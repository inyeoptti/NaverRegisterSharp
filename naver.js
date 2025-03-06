exports = void (0);
//const murmurHash3 = require('./lib/murmurhash3');
const crypto = require('crypto');
const random_ua = require('random-useragent');
const querystring = require('querystring');
const lzstring = require('lz-string');

const md5 = require('./md5');
// eval(require('fs').readFileSync('./lib/md5.js', 'utf-8'));

let arr, str;

function refineComponents(components = []) {
    let t = {};
    components.forEach((component) => {
        if (component.key === "canvas" || component.key === "webgl") {
            component.value = md5.hex_md5(component.value);
        }
        t[refineBfAttrName(component.key)] = component.value;
    });
    return t;
}
function refineBfAttrName(e) {
    let a = {
        user_agent: "a",
        language: "b",
        color_depth: "c",
        device_memory: "d",
        pixel_ratio: "e",
        hardware_concurrency: "f",
        resolution: "g",
        available_resolution: "h",
        timezone_offset: "i",
        session_storage: "j",
        local_storage: "k",
        indexed_db: "l",
        cpu_class: "m",
        navigator_platform: "n",
        do_not_track: "o",
        canvas: "p",
        webgl: "q",
        webgl_vendor: "r",
        adblock: "s",
        has_lied_languages: "t",
        has_lied_resolution: "u",
        has_lied_os: "v",
        has_lied_browser: "w",
        touch_support: "x",
        js_fonts: "y",
        open_database: "z",
        regular_plugins: "aa",
        add_behavior: "ab"
    }
    return a[e] || e;
}

function genParam(name = "", text = "") {
    let isPw = name !== "id";
    let keyInfoFn = (text = "", isPw = false) => {
        let delay = 0;
        let a = [];
        let b = [];
        for (let i = 0; i < text.length; i++) {
            a.push(`${delay},d,i${i},${isPw ? "" : text.toUpperCase().charCodeAt(i)}`);
            a.push(`${crypto.randomInt(50, 200)},u,i${i},${isPw ? "" : text.toUpperCase().charCodeAt(i)}`);
            b.push(`${delay},${isPw ? "" : text.slice(0, i + 1)}`);
            delay = crypto.randomInt(200, 1500);
        }
        // a.push(`${crypto.randomInt(128, 256)},d,${isPw ? "ENTER," : "TAB,9"}`);
        if (b.length == 0) b.push("0,");
        return { a: a, b: b };
    }
    let keyInfo = keyInfoFn(text, isPw);
    return {
        "i": name,
        "a": keyInfo.a,
        "b": {
            "a": keyInfo.b,
            "b": keyInfo.b.length - 1
        },
        "c": "",
        "d": isPw ? "" : text,
        "e": isPw,
        "f": false
    };
}

function genMouse() {
    let ga = [];
    for (let i = 0; i < 198; i++) {
        ga.push(`0|${crypto.randomInt(3, 16)}|${crypto.randomInt(0, 10) > 1 ? 1 : 0}|${crypto.randomInt(0, 10) > 2 ? -1 : 0}`);
    }
    ga.push(`1|${crypto.randomInt(20, 200)}|0|0`, `2|${crypto.randomInt(50, 200)}|0|0`);
    return ga;
}

function genAgent() {
    return random_ua.getRandom((ua) => { return ua.osName == "Windows" });
}

function genGlVendor() {
    return `Google Inc.~ANGLE (NVIDIA GeForce GTX ${crypto.randomInt(100, 300)}0 3GB Direct3D11 vs_5_0 ps_5_0)`;
}

function genFontList() {
    let inital = ["monospace", "sans-serif", "serif"];
    let some = ["Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS", "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style", "Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New", "Garamond", "Geneva", "Georgia", "Helvetica", "Helvetica Neue", "Impact", "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode", "Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO", "Palatino", "Palatino Linotype", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol", "Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS", "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"];
    return [...inital, ...(some.filter(() => crypto.randomInt(4) > 2))].sort();
}

function genRand(uuid, id, pw, nth = 0, overrideData = {}, register = false) {
    return {
        "a": `${(overrideData?.a || uuid).replace(/-\d$/, "")}-${nth}`,
        "b": "1.3.4",
        "c": false,
        "d": register ? [genParam("id", id), genParam("pswd1", pw), genParam("pswd2", pw)] : [genParam("id", id), genParam("pw", pw)],
        "e": {
            "a": {
                "a": 444,
                "b": 444,
                "c": 444
            },
            "b": {
                "a": 444,
                "b": 444,
                "c": 444
            }
        },
        "f": {
            "a": {
                "a": {
                    "a": 444,
                    "b": 444,
                    "c": 444
                },
                "b": {
                    "a": 444,
                    "b": 444,
                    "c": 444
                }
            },
            "b": {
                "a": {
                    "a": 444,
                    "b": 444,
                    "c": 444
                },
                "b": {
                    "a": 444,
                    "b": 444,
                    "c": 444
                }
            }
        },
        "g": {
            "a": [...genMouse()],
            "b": crypto.randomInt(5000, 6000),
            "c": crypto.randomInt(5000, 8000),
            "d": crypto.randomInt(5000, 8000),
            "e": crypto.randomInt(60000, 65000),
            "f": 0
        },
        "j": 74,
        "h": crypto.randomBytes(16).toString('hex'),
        "i": {
            "a": overrideData?.i?.a || genAgent(),
            "b": "ko-KR",
            "c": 24,
            "d": 8,
            "e": 1,
            "f": 16,
            "g": [
                1920,
                1080
            ],
            "h": [
                1920,
                1040
            ],
            "i": -540,
            "j": 1,
            "k": 1,
            "l": 1,
            "z": 1,
            "m": "unknown",
            "n": "Win32",
            "o": "unknown",
            "aa": [
                "Chrome PDF Plugin::Portable Document Format::application/x-google-chrome-pdf~pdf",
                "Chrome PDF Viewer::::application/pdf~pdf",
                "Native Client::::application/x-nacl~,application/x-pnacl~"
            ],
            "p": crypto.randomBytes(16).toString('hex'),
            "q": crypto.randomBytes(16).toString('hex'),
            "r": overrideData?.i?.r || genGlVendor(),
            "s": false,
            "t": false,
            "u": false,
            "v": false,
            "w": false,
            "x": [
                0,
                false,
                false
            ],
            "y": overrideData?.i?.y || genFontList()
        }
    }
}
function genLcs(NNB, url, referer) {
    const precisionUnderPoint = [0, 0.09999999404, 0.20000001788, 0.30000001192, 0.40000000596, 0.5, 0.59999999404, 0.70000001788, 0.80000001192, 0.90000000596];
    const paintStartTime = crypto.randomInt(50, 150) + precisionUnderPoint[crypto.randomInt(10)];
    let baseTime = new Date().getTime();
    let timing = {
        "connectStart": baseTime + 2,
        "navigationStart": baseTime,
        "loadEventEnd": baseTime + 70,
        "domLoading": baseTime + 27,
        "secureConnectionStart": 0,
        "fetchStart": baseTime + 2,
        "domContentLoadedEventStart": baseTime + 65,
        "responseStart": baseTime + 17,
        "responseEnd": baseTime + 18,
        "domInteractive": baseTime + 65,
        "domainLookupEnd": baseTime + 2,
        "redirectStart": 0,
        "requestStart": baseTime + 17,
        "unloadEventEnd": 0,
        "unloadEventStart": 0,
        "domComplete": baseTime + 70,
        "domainLookupStart": baseTime + 2,
        "loadEventStart": baseTime + 70,
        "domContentLoadedEventEnd": baseTime + 65,
        "redirectEnd": 0,
        "connectEnd": baseTime + 2
    }
    let browserCapa = {
        u: url,
        e: referer,
        os: "Win32",
        ln: "ko-KR",
        sr: "1920x1080",
        pr: 1,
        bw: 1920,
        bh: 969,
        c: 24,
        j: "N",
        k: "Y",
        i: "",
        ls: NNB,
        ct: "",
        ...timing,
        "first-paint": paintStartTime,
        "first-contentful-paint": paintStartTime,
        ngt: 1,
        pid: crypto.randomBytes(16).toString('hex'), // md5{(NNB+pageURL+(window.performance.now())||(new Date().getTime()))||navigator.userAgent + Math.random()} //maybe ok even random md5
        ts: new Date().getTime(),
        EOU: ""
    }
    if (!NNB) delete browserCapa["ls"];
    for (let k in browserCapa) {
        browserCapa[k] = querystring.escape(browserCapa[k]);
    }
    return browserCapa;
}
function genLcsQS(NNB, url, referer) {
    return querystring.stringify(genLcs(NNB, url, referer));
}
function getLoginForm(id, pw, encpw, encnm, uuid, overrideData, convertQueryString) {
    var ret = {
        "localechange": "",
        "dynamicKey": "",
        "encpw": encpw,
        "enctp": "1",
        "svctype": "1",
        "smart_LEVEL": "1",
        "bvsd": getBVSDValue(uuid, genRand(uuid, id, pw, 0, overrideData, false)),
        "encnm": encnm, //from https://nid.naver.com/login/ext/keys2.nhn
        "locale": "ko_KR",
        "url": "https://www.naver.com",
        "id": "",
        "pw": ""
    }
    // for (let k in ret) {
    //     ret[k] = querystring.escape(ret[k]);
    // }
    if (convertQueryString) return querystring.stringify(ret);
    return ret;
}
function getRegisterForm({ id, pw, token_sjoin, name, gender, encpw, enckey, birth, uuid, nationNo, phoneNo, authNo, isForign }, overrideData, convertQueryString) {
    var ret = {
        "token_sjoin": token_sjoin,
        "encPswd": encpw,
        "encKey": enckey,
        "birthday": birth,
        "joinMode": "unreal",
        "pbirthday": "",
        "ipinFlag": "",
        "nid_kb2": getBVSDValue(uuid, genRand(uuid, id, pw, 1, overrideData, true)),
        "id": id,
        "pswd1": pw,
        "pswd2": pw,
        ...(isForign ? {
            "name1": name,
            "name2": name
        }:{
            "name": name
        }),
        "gender": gender,
        "email": "",
        "nationNo": nationNo,
        "phoneNo": phoneNo,
        "authNo": authNo,
        "pname": "",
        "pmm": "월",
        "pgender": "",
        "pforeign": "0",
        "ptelecom": "SKT",
        "pphoneNo": "",
        "iphoneNo": "",
    }
    if (convertQueryString) return querystring.stringify(ret);
    return ret;
}

// token_sjoin: cUZvbBKyD2eQtjb3
// encPswd: 6f9e19f775b957d4367ea5587b44798d5e6b6d383b56a918a0d295517ebe4679fb55d821259bddd2f3596849ea0366e8810e1cdab90fa381db11abcc3ae279158032f127e822debea664cbbd7058e1d00b5ea0cebe509b3d723a55820e6daed2ea4630a8e2b5ee3cf04d1da33dc83a946ccde95db9fe095b9ef7c9689ede98c2
// encKey: 100016657
// birthday: d
// joinMode: unreal
// pbirthday: 
// ipinFlag: 
// nid_kb2: {"uuid":"daae03dd-fb06-4f71-889f-4b35c1c21af5-1","encData":"N4IghiBcICZmBTADAZhjAtAMwEZIGwYAsWA7AIwYAcVAnFsTigKwDG5rATOWFsxuRAAaEDighyAOhSSiwkKyhYwAGwDOCETCgBtUAEtx+7SIiQdIJEJhD9V0knnlanIQFdb9xyKLNa123IhKhQnfCsPfSCQpyRuAP1XUlonFBR3WySUkSokZgT00lCRchQI20LikBZ8BKJgqucgyPqYkU4iKxt9fOT5fFrI3uyJNPzu2oonUldIycERZmZXbtIhUjkSqjXItY3U5nruqiEiEfxZ2xOzp1Ku239mbxB8E8jH5-JyIlru8itmAsJKQ3oEAUD8EUEl8hMsnFR6pEYXCALoiMSQUBmCxWLDyXz+LBqWLxIkAe3kuXy5MMIhqQhpxPanQZajJ+jZqRYrPZbIA5vIlq5GWS+QArA71EXioFfMo8jmisXkTi3H4K-nKzhVSHpaValByNGiKBfAC+IkU0Hk2mg+pVhvkCCUqg0IjxkGU6gQFoM4gADmoAO4wIHYywJKyU-KRKMlOL3KIiEqHDJJ274ILdVwHNM5xakX4VZPAy76dJObhZ2z1QVl2uLTgrWz5eS0ZotkukQEJWqCwa2PuN5v6NaV9K7EsdE7HEvfRFXEtEGHdfxhDv6NfGjFY3QRklxiTkTMl5iFudV09Nrs9uv5kDTpcwkDbqC0C0KcQ2r8iZ2QAAuABObiaCAHpehovogIY0CBiGqqmHuiaHlQA52CWtB5NCc5xGmQSCiqCT3rQoKJCWKB0AUGFlhWIgDOk3QNi85T6ExtBngkrYlMkaZcaMUITHOmFpkOIBUMwRajnOIJpmOIgUEci5OH4aYnKkRAjmuKakVu6JQLu5j7iImF8YC94UVpLz4LRIDsXJ-E2eJokKXOho5q+kDvpaP6wD5f5ASB7out6ZrGn+BkGUQUV6ZAUW1lacUfju4BQHFMVpZ+sVRWaH4ehFKWYgVGUYhlCXZTFkXRSaWXxal2VJfpBWVbWJVVWVRANYVZjFXVtU1TlH4Cl1SEAD5fGNI0CPISAjUQE1TSIM3-BNzwzaQI0zQtlhjeQ81Aktu2bftI3rYd01jXNu1bTNl2TcdKB7ed+CPYtI3PVdx3jR9T0redX0bT932vd8L3badAPA0tEPbe9d3neDq0jQ9Z2vQjf27UDYOgzNsPXSNtDYyNVCE6UG1w8Dt2IyqZN48TKPbQ9M1U1DiOM+T23LZjM3E0df3I+zS2U4DAsnb9r3PbzwOcGL20E-TOOE-zeOk1zO0k8wJP88zMsHTTn0a6r1OqzzIsGyLIPG4T61M3zZNU2bysY9DS1s1T0uq0rx1y87Y3SzbUuE2biO3XjBP+xzUOO+rmuK4T3vK0z5sO17OtvST7si2jr0h59c2SxzfuZ6nuP63bf2J3j4O03rtuG1rf3J+d9fZ+nNfA5750539QuvSbeMl+dGvh9zJNO3jXfi6njeoyTidU2Px1V7ns9txz09Y4bGdUxPBep67Tep-Hn0d8D6+C6nefm83EeEwPFO3w-+cj0-vuE3TIvX2tZe9yv8tjWfadDaR0+nPA+f9-qV2LiTS+ysT4c33u3GOf8s5r2jobIeIsd43V-h-HBeM4Ej3QaPVO5AMH9ytofWOf8sFE2gYTHuHMF7nSPuXKhPtSFvzYePQOdDwEZ2VgAz+otwEwM+kw++yDv7bXfuQ1WACVbsMLltDGAwpHSwkmXDySwiBjitCCcIWgoDLBQGuP8+BfAbCCpAJAH4JSQFTCAAAFuIIgCBMysCoKwC4rwYCcDgP8AYOBcCuNIDgcgOAEBwE2NBRqZgQAAFkyQAC99AqBUGAAA9MwSQSAAAEAAKAA6voAAdjAMkQY1AAG5ckAFUanFLKRUtQuSAByAAVXJ+BJDkBqQgEpGAADiAAhGpgEABukApC0B6T00gABKXJgyECsAANZkgyZwJAXxtnagKSofQqyEC5IAGL6EAggLAZIAAeGSZDXMWQAZQQGARJJSjkAE9Nk5J6QhaqIB1kYAANIACV5BWg6IYyAak-z4Q9MeEQQ0dDOC2UIf4uRjTOPMCiqw-xOjGhghgQ4UY7H4VWaaEQKgKUgCSdSgAtuINw7ySkVJKfINl0BGkoD+RSaATLVksqDGy0w4YADCjjAJkjpccgACgAERObkmVKg3B8lKZASAMqySAX-GAHAKhjlyrJKwNw0qSn-lOdqulYB-warAP6f0BzWA2v0GSEpGTrkYD5GSUUBqMCsAlVKhAGB-QwCwAAP1DXiEQ4rJXSqVQq3JAA1fQCAgwIEAhqu1DqnUurdRkqNkaw3yFaS68ZxzRUHP6barN9rHX6Gdf+V17rPUlLAKwFQ4ahB1tzU2-Nnr-Rto7eGl8Ih-TiBgEQUMWBXj0HReJXgRAwm0FILgUg7BWBIFoDgRA8gACOE6OCkA2F4rAeQECcFYAgDSFANgbCwDAFA5iYA7qBIBcQgyfV8gNbkgAkiU1gkhw0AEFWmDIADIAFECmtKTb+uVv7gNLIQCc7VV6lntIABq5PIMkPJKARm5LleclZ-4UByq+Lk8ZagAD6zAaN5MDHRhj8z5DEk9K6UC-5gpuhAG4HjoFxkCZEEGYTIBrm6FxJxhknHjQfL3MM-Q-41BAReXS5NGawC5MeWAEpLS3kUhjdWtwgEPlLLJP+RxDb5CiqlQ27TummQgFs3S+zOm9O5PiY8mzZITOpvfSIAAEggFQ5am3OraQgEC8hf10v9O27jIhwO1NFfBpDgyQWgblZB+Q4G3CsGMFp9zLT2kfP9GmwCSmM3yC8+Zyz1mRC1YAPJuH-CoH15LGsAE0QWIblfIGVqgXUsvkM871srKvmtGwgcb2nWCVf9IlkAY2yTHNqb++Q7SLk4Hy44hAFqvPyCTRmuAbb5B0rdWSNQ8Wr1sccxgDQlXo0gEe-oPEKIcpAA"}
// id: fsoisogj1234
// pswd1: test112233
// pswd2: test112233
// name: sgdasge
// gender: F
// email: 
// nationNo: 55
// phoneNo: 11969390224
// authNo: 2529
// pname: 
// pmm: 월
// pgender: 
// pforeign: 0
// ptelecom: SKT
// pphoneNo: 
// iphoneNo: 

function getBVSDValue(uuid, data) {
    return JSON.stringify({
        uuid: uuid,
        encData: getEncData(data)
    });
}
function getEncData(data) {
    let strdata = JSON.stringify(data);
    let compressed = lzstring.compressToEncodedURIComponent(strdata);
    return compressed;
}
// function getEncpw(pw, key = ""){
//     // keySplit(session_keys)) {
// 	// 	rsa.setPublic(evalue, nvalue);
// 	// 	try{
// 	// 		encpw.value = rsa.encrypt(
// 	// 			getLenChar(sessionkey) + sessionkey +
// 	// 			getLenChar(id.value) + id.value +
// 	// 			getLenChar(pw.value) + pw.value);
//     // https://nid.naver.com/login/ext/keys2.nhn

//     key = "16Ivlu9oJs7TFzl186b6Nqdp981pTJem,100016633,9142dcd34acb1c4608c5c61dccff2bd379b247aed79ac395bb2f045e748f2fd838cd0450983ee6026f256facf6837b1ea4fd743969ce6ba94260bd24a7ea6e5b9c8af612dbbd68495dd6c268a4cdcbf5e7a518ef2a0af6b4d8eeb63bc43a2bb4be99a9a7666fd92e538305329c0c3ca854976a4b04f5e002297b145c79f2f435,010001";
//     let [sessionKey, keyname, evalue, nvalue] = key.split(",");

//     let rsa = new NodeRsa
// }
module.exports = { genRand, genLcs, genLcsQS, getLoginForm, getRegisterForm };


// let info = genRand(crypto.randomUUID(), "test1234", "test112233");

// console.log(getEncData(info));
// // str = "";
// // // arr = str2binl(str);
// // let res = getR();
// // let arr = [];
// // for (let k in res) {
// //     arr.push(res[k]);
// // }
// // console.log(murmurHash3.x64.hash128(arr.join("~~~"), 31));
// debugger;