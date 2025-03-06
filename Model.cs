using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace NaverLib
{
	[System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE1006:명명 스타일", Justification = "Model")]
	public class Model
	{
		public class LCSData
		{
			[JsonPropertyName("u")]
			public string url { get; set; }

			[JsonPropertyName("e")]
			public string referer { get; set; }

			public string os { get; set; }
			public string ln { get; set; }
			public string sr { get; set; }
			public string pr { get; set; }
			public string bw { get; set; }
			public string bh { get; set; }
			public string c { get; set; }
			public string j { get; set; }
			public string k { get; set; }
			public string i { get; set; }

			[JsonPropertyName("ls")]
			public string nnb { get; set; }

			public string ct { get; set; }
			public string navigationStart { get; set; }
			public string unloadEventStart { get; set; }
			public string unloadEventEnd { get; set; }
			public string fetchStart { get; set; }
			public string domainLookupStart { get; set; }
			public string domainLookupEnd { get; set; }
			public string connectStart { get; set; }
			public string connectEnd { get; set; }
			public string requestStart { get; set; }
			public string responseStart { get; set; }
			public string responseEnd { get; set; }
			public string domLoading { get; set; }
			public string domInteractive { get; set; }
			public string domContentLoadedEventStart { get; set; }
			public string domContentLoadedEventEnd { get; set; }
			public string domComplete { get; set; }
			public string loadEventStart { get; set; }
			public string loadEventEnd { get; set; }

			[JsonPropertyName("first-paint")]
			public string first_paint { get; set; }

			[JsonPropertyName("first-contentful-paint")]
			public string first_contentful_paint { get; set; }

			public string ngt { get; set; }
			public string pid { get; set; }
			public string ts { get; set; }
			public string EOU { get; set; }
		}

		public class BVSDData
		{
			[JsonPropertyName("a")]
			public string uuid { get; set; }

			[JsonPropertyName("d"), JsonIgnore]
			public List<KeyData> KeyDatas { get; set; }

			[JsonPropertyName("g"), JsonIgnore]
			public MouseData MouseData { get; set; }

			[JsonPropertyName("i")]
			public FPData fingerprint { get; set; }

			public BVSDData()
			{
				KeyDatas = new List<KeyData>();
				MouseData = new MouseData();
				fingerprint = new FPData();
			}
		}

		public class KeyData { }

		public class MouseData { }

		public class FPData
		{
			[JsonPropertyName("a")]
			public string UserAgent { get; set; }

			[JsonPropertyName("r")]
			public string GLVendor { get; set; }

			[JsonPropertyName("y")]
			public List<string> FontList { get; set; }
		}

		public class IDInfo
		{
			public string id { get; set; }
			public string pw { get; set; }
			public string token_sjoin { get; set; }
			public string name { get; set; }
			public string gender { get; set; }
			public string encpw { get; set; }
			public string enckey { get; set; }
			public string uuid { get; set; }
			public string nationNo { get; set; }
			public string phoneNo { get; set; }
			public string authNo { get; set; }
			public string birth { get; set; }
			public bool isForign { get; set; } = false;
		}
	}
}