using Jering.Javascript.NodeJS;
using SmsLib;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using static NaverLib.Model;

namespace NaverLib
{
	public class Naver
	{
		/// <summary>
		/// npm install
		/// </summary>
		public static void NodeInit()
		{
			var npm = Process.Start(new ProcessStartInfo
			{
				FileName = "cmd",
				RedirectStandardInput = true,
				WorkingDirectory = Directory.GetCurrentDirectory(),
				UseShellExecute = false,
				CreateNoWindow = true
			});
			npm.StandardInput.WriteLine("npm i & exit");
			npm.WaitForExit();
		}

		private static Task<T> InvokeJS<T>(params object[] args)
		{
			return StaticNodeJSService.InvokeFromFileAsync<T>(@".\sharp_invoker.js", args: args);
		}

		private static async Task<BVSDData> GenRandomBVSDData(string uuid, string id, string pw, int nth = 0, BVSDData overrideData = null, bool isRegister = false)
		{
			return await InvokeJS<BVSDData>("genRand", uuid, id, pw, nth, overrideData, isRegister);
		}

		private static async Task<string> GetLoginForm(string id, string pw, Crpyto.RsaResult encpw, BVSDData bVSDData, bool convertQueryString)
		{
			return await InvokeJS<string>("getLoginForm", id, pw, encpw.encPswd, encpw.encKey, bVSDData.uuid, bVSDData, convertQueryString);
		}

		private static async Task<string> GetRegisterForm(IDInfo person, BVSDData bVSDData, bool convertQueryString)
		{
			return await InvokeJS<string>("getRegisterForm", person, bVSDData, convertQueryString);
		}

		private static string GetLcsQS(string NNB, string url, string referer)
		{
			return Task.Run(() => InvokeJS<string>("genLcsQS", NNB, url, referer)).Result;
		}

		public static async Task<CookieContainer> Register(string id,
													 string pw,
													 WebProxy proxy,
													 string nationNo,
													 string internalNationCode,
													 ApiProvider apiProvider,
													 CancellationTokenSource ct,
													 string overrideSjoin = null)
		{
			const string userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0";
			var nnb = "";
			var person = new IDInfo
			{
				id = id ?? NameHelper.GetRandomId(),
				pw = pw ?? NameHelper.GetRandomPw(),
				birth = NameHelper.GetRandomYYYYMMDD(),
				name = NameHelper.GetRandomKorName(),
				gender = NameHelper.GetRandomGender(),
				uuid = Guid.NewGuid().ToString(),
				token_sjoin = overrideSjoin,
				isForign = true,
			};

			var cookies = new CookieContainer();
			var httpClient = new HttpClient(new WinHttpHandler
			{
				AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate,
				CookieContainer = cookies,
				Proxy = proxy,
				WindowsProxyUsePolicy = WindowsProxyUsePolicy.UseCustomProxy,
				CookieUsePolicy = CookieUsePolicy.UseSpecifiedCookieContainer,
			});

			httpClient.DefaultRequestHeaders.TryAddWithoutValidation("User-Agent", userAgent);
			httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*;q=0.8");
			httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Accept-Language", "en-US,en;q=0.5");
			httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Upgrade-Insecure-Requests", "1");
			httpClient.DefaultRequestHeaders.TryAddWithoutValidation("DNT", "1");

			var bvsdOverride = new BVSDData();
			bvsdOverride.fingerprint.UserAgent = userAgent;
			var bvsd = await GenRandomBVSDData(person.uuid, person.id, person.pw, 1, bvsdOverride, true);

			if (overrideSjoin == null)
			{
				var sJoinRes = await httpClient.GetAsync("https://nid.naver.com/user2/V2Join?m=agree&lang=en_US&cpno=");
				var sjoinBodyTask = sJoinRes.Content.ReadAsStringAsync();
				var agreeLcsReq = new HttpRequestMessage(HttpMethod.Get, "https://lcs.naver.com/m?" + GetLcsQS(nnb, sJoinRes.RequestMessage.RequestUri.AbsoluteUri, ""));
				agreeLcsReq.Headers.TryAddWithoutValidation("Referer", "https://nid.naver.com/");
				await httpClient.SendAsync(agreeLcsReq);
				nnb = cookies.GetCookies(new Uri("https://naver.com"))?["NNB"].Value ?? "";
				var sjoinBody = await sjoinBodyTask;
				if (sjoinBody.IndexOf("token_sjoin") == -1)
				{
					Debug.WriteLine("token_sjoin not found");
					return null;
				}
				var startIdx = sjoinBody.IndexOf(@"name=""token_sjoin"" value=""") + @"name=""token_sjoin"" value=""".Length;
				person.token_sjoin = sjoinBody.Substring(startIdx, sjoinBody.IndexOf(@""">", startIdx) - startIdx);
			}

			{
				var keyRequest = new HttpRequestMessage(HttpMethod.Get, $"https://nid.naver.com/user2/V2Join?token_sjoin={person.token_sjoin}&langSelect=ko_KR&chk_all=on&termsService=on&termsPrivacy=on&termsLocation=Y&termsEmail=Y");
				keyRequest.Headers.TryAddWithoutValidation("Referer", "https://nid.naver.com/user2/V2Join?m=agree&lang=en_US&cpno=");
				var keyResponse = await httpClient.SendAsync(keyRequest);
				var keyRaw = await keyResponse.Content.ReadAsStringAsync();
				var keys = new Regex(@"var sessionKey = ""([A-Za-z0-9]+)"";\s+var keyName = ""(\d+)"";\s+var eValue = ""([0-9a-f]+)"";\s+var nValue = ""(\d+)"";", RegexOptions.Multiline).Match(keyRaw).Groups;
				var encpw = Crpyto.GetEncpw(new Crpyto.RsaInfo(keys[1].Value, keys[2].Value, keys[3].Value, keys[4].Value), person.id, person.pw);
				person.encpw = encpw.encPswd;
				person.enckey = encpw.encKey;
			}

			var api = new SmsApi(apiProvider, COUNTRY_ID.Russia, new ActivServiceCodeInfo(ServiceCode.Naver));
			var numberInfo = api.GetNumber();

			person.nationNo = nationNo;
			person.phoneNo = numberInfo.number.Replace("#" + person.nationNo, "");

			httpClient.DefaultRequestHeaders.Add("X-Requested-With", "XMLHttpRequest");
			httpClient.DefaultRequestHeaders.Remove("Accept");
			httpClient.DefaultRequestHeaders.Add("Accept", "*/*");
			httpClient.DefaultRequestHeaders.Remove("Upgrade-Insecure-Requests");
			var idTask = httpClient.GetStringAsync($"https://nid.naver.com/user2/joinAjax?m=checkId&id={person.id}");
			var pwTask = httpClient.GetStringAsync($"https://nid.naver.com/user2/joinAjax?m=checkPswd&id=gfddsjgpj&pw={person.pw}");
			await httpClient.GetStringAsync($"https://nid.naver.com/user2/joinAjax?m=sendAuthno&nationNo={person.nationNo}&mobno={person.phoneNo}&lang=ko_KR&key={person.token_sjoin}");
			//await new HttpClient().GetAsync($"https://nid.naver.com/user2/joinAjax?m=sendAuthno&nationNo={person.nationNo}&mobno={person.phoneNo}&lang=ko_KR&key={person.token_sjoin}");
			Debug.WriteLine($"https://nid.naver.com/user2/joinAjax?m=sendAuthno&nationNo={person.nationNo}&mobno={person.phoneNo}&lang=ko_KR&key={person.token_sjoin}");
			//var ct = new System.Threading.CancellationTokenSource(20000);
			person.authNo = await api.GetCode(numberInfo.id, ct.Token);

			if (person.authNo == null) throw new Exception("code timeout");

			var result = await httpClient.GetStringAsync($"https://nid.naver.com/user2/joinAjax?m=checkAuthno&authno={person.authNo}&key={person.token_sjoin}");
			if (result == "NNNNN") throw new Exception("Authno fail");

			httpClient.DefaultRequestHeaders.Remove("X-Requested-With");

			if (await idTask == "NNNNF") person.id = NameHelper.GetRandomId();

			var form = await GetRegisterForm(person, bvsd, convertQueryString: true);
			var formCollection = HttpUtility.ParseQueryString(form);
			var formContent = formCollection.Cast<string>().Select(key => new KeyValuePair<string, string>(key, formCollection[key]));

			await pwTask;
			httpClient.DefaultRequestHeaders.Referrer = new Uri("https://nid.naver.com/nidlogin.login?mode=form&url=https%3A%2F%2Fwww.naver.com");
			httpClient.DefaultRequestHeaders.Add("User-Agent", bvsd.fingerprint.UserAgent);
			httpClient.DefaultRequestHeaders.Add("Accpet", "*/*");

			await httpClient.PostAsync("https://nid.naver.com/user2/V2Join?m=end", new FormUrlEncodedContent(formContent));
			httpClient.Dispose();
			Debug.WriteLine(person.id + ":" + person.pw);

			if (cookies.GetCookies(new Uri("https://nid.naver.com"))["NID_SES"] == null)
			{
				throw new Exception("Register failed or restricted");
			}
			return cookies;
		}
	}
}