using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace NaverLib
{
	public class Crpyto
	{
		public static RsaResult CreateRsaKey(RsaInfo rsaInfo, string id, string pw)
		{
			var comVal = (char)rsaInfo.sessionKey.Length + rsaInfo.sessionKey + (char)id.Length + id;
			Console.WriteLine(comVal);
			var val = EncryptRSA(rsaInfo.eValue, rsaInfo.nValue, comVal + (char)pw.Length + pw);

			return new RsaResult(val, rsaInfo.keyName);
		}

		public static RsaResult GetEncpw(RsaInfo rsaInfo, string id, string pw)
		{
			var data = (char)rsaInfo.sessionKey.Length + rsaInfo.sessionKey +
					   (char)id.Length + id +
					   (char)pw.Length + pw;
			return new RsaResult(EncryptRSA(rsaInfo.eValue, rsaInfo.nValue, data), rsaInfo.keyName);
		}

		public class RsaInfo
		{
			public string sessionKey;
			public string keyName;
			public string eValue;
			public string nValue = "010001";

			public RsaInfo(string sessionKey, string keyName, string eValue, string nValue = "010001")
			{
				this.sessionKey = sessionKey;
				this.keyName = keyName;
				this.eValue = eValue;
				this.nValue = nValue;
			}
		}

		public class RsaResult
		{
			public string encPswd;
			public string encKey;

			public RsaResult(string encPswd, string encKey)
			{
				this.encPswd = encPswd;
				this.encKey = encKey;
			}
		}

		private static string EncryptRSA(string strPublicModulusKey, string strPublicExponentKey, string strTarget)
		{
			string strResult = string.Empty;

			// 공개키 생성
			RSAParameters publicKey = new RSAParameters()
			{
				Modulus = Enumerable.Range(0, strPublicModulusKey.Length)
				.Where(x => x % 2 == 0)
				.Select(x => Convert.ToByte(strPublicModulusKey.Substring(x, 2), 16))
				.ToArray()
				,
				Exponent = Enumerable.Range(0, strPublicExponentKey.Length)
				.Where(x => x % 2 == 0)
				.Select(x => Convert.ToByte(strPublicExponentKey.Substring(x, 2), 16))
				.ToArray()
			};

			try
			{
				RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
				rsa.ImportParameters(publicKey);
				// 암호화 및 Byte => String 변환
				byte[] enc = rsa.Encrypt(Encoding.UTF8.GetBytes(strTarget), false);
				strResult = BitConverter.ToString(enc).Replace("-", "").ToLower();
			}
			catch (CryptographicException)
			{
				strResult = string.Empty;
			}

			return strResult;
		}
	}
}