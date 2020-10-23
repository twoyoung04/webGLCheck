
const clientInfo = getClientInfo();

webGLCompatibilityCheck();

function webGLCompatibilityCheck () {
  var clientInfo = getClientInfo();
  console.log('-------------------');
  if (isMobile()) {
    // 移动端

    redirectTo('A');
    return false;
  }
  
  console.log('is not mobile');

  if (isNWClient()) {
    // 本地客户端
    
    if(hasWebGLContext()) {

      return true;
    }

    //redirect to local Page
    redirectTo('LB');
    return false;
  }

  console.log('is not NWClient');

  
  // if (hasWebGLContext()) {
  if (false) {                      // test not have webGL
    // 支持webGL

    if (isIEBrowser()) {

      redirectTo('D');
      return false;
    }

    return true;
  }

  console.log('no webGL');

  if (isWin7Above(clientInfo)) {
    // win7系统以上

    
    if (isRecentCore(clientInfo)) {
      // 当前浏览器是较新的内核版本
      console.log('is Recent core');
      redirectTo('B');
    }
    else {
      console.log('is not Recent core');
      redirectTo('D');
    }
    return false;
  }
  else {
    // win7系统以下

    if (isRecentChromiumCore(clientInfo)) {
      // 当前浏览器是较新的 谷歌 内核版本
      console.log('is Recent chrome core');
      redirectTo('B');
    }
    else {
      console.log('is not Recent chrome core');
      redirectTo('C');
    }
    return false;
  }
  
}


/**
 * JavaScript Client Detection
 * @returns {Object} properties: screen: browser, browserVersion, browserMajorVersion, mobile, os, osVersion, cookies, flashVersion
 */
function getClientInfo () {

  var unknown = '-';

  // screen
  var screenSize = '';
  if (screen.width) {
      width = (screen.width) ? screen.width : '';
      height = (screen.height) ? screen.height : '';
      screenSize += '' + width + " x " + height;
  }

  // browser
  var nVer = navigator.appVersion;
  var nAgt = navigator.userAgent;
  var browser = navigator.appName;
  var core = browser;
  var version = '' + parseFloat(navigator.appVersion);
  var majorVersion = parseInt(navigator.appVersion, 10);
  var nameOffset, verOffset, ix;

  // // Opera
  // if ((verOffset = nAgt.indexOf('Opera')) != -1) {
  //     browser = 'Opera';
  //     version = nAgt.substring(verOffset + 6);
  //     if ((verOffset = nAgt.indexOf('Version')) != -1) {
  //         version = nAgt.substring(verOffset + 8);
  //     }
  // }
  // // Opera Next
  // if ((verOffset = nAgt.indexOf('OPR')) != -1) {
  //     browser = 'Opera';
  //     version = nAgt.substring(verOffset + 4);
  // }

  // Legacy Edge
  if ((verOffset = nAgt.indexOf('Edge')) != -1) {
      browser = 'LegacyEdge';
      version = nAgt.substring(verOffset + 5);
  } 
  // Edge (Chromium)
  else if ((verOffset = nAgt.indexOf('Edg')) != -1) {
      browser = 'Edge';
      version = nAgt.substring(verOffset + 4);
  }
  // MSIE
  else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
      browser = 'MSIE';
      version = nAgt.substring(verOffset + 5);
  }
  // MSIE 11+
  else if (nAgt.indexOf('Trident/') != -1) {
    browser = 'MSIE11';
    version = nAgt.substring(nAgt.indexOf('rv:') + 3);
  }
  // Chrome
  else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
      browser = 'Chrome';
      version = nAgt.substring(verOffset + 7);
  }
  // Safari
  else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
      browser = 'Safari';
      version = nAgt.substring(verOffset + 7);
      if ((verOffset = nAgt.indexOf('Version')) != -1) {
          version = nAgt.substring(verOffset + 8);
      }
  }
  // Firefox
  else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
      browser = 'Firefox';
      version = nAgt.substring(verOffset + 8);
  }
  // Other browsers
  else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
      browser = nAgt.substring(nameOffset, verOffset);
      version = nAgt.substring(verOffset + 1);
      if (browser.toLowerCase() == browser.toUpperCase()) {
          browser = navigator.appName;
      }
  }
  // trim the version string
  if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
  if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
  if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

  majorVersion = parseInt('' + version, 10);
  if (isNaN(majorVersion)) {
      version = '' + parseFloat(navigator.appVersion);
      majorVersion = parseInt(navigator.appVersion, 10);
  }

  // mobile version
  var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

  // cookie
  var cookieEnabled = (navigator.cookieEnabled) ? true : false;

  if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
  }

  // system
  var os = unknown;
  var clientStrings = [
      {s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
      {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
      {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
      {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
      {s:'Windows Vista', r:/Windows NT 6.0/},
      {s:'Windows Server 2003', r:/Windows NT 5.2/},
      {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
      {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
      {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
      {s:'Windows 98', r:/(Windows 98|Win98)/},
      {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
      {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
      {s:'Windows CE', r:/Windows CE/},
      {s:'Windows 3.11', r:/Win16/},
      {s:'Android', r:/Android/},
      {s:'Open BSD', r:/OpenBSD/},
      {s:'Sun OS', r:/SunOS/},
      {s:'Chrome OS', r:/CrOS/},
      {s:'Linux', r:/(Linux|X11(?!.*CrOS))/},
      {s:'iOS', r:/(iPhone|iPad|iPod)/},
      {s:'Mac OS X', r:/Mac OS X/},
      {s:'Mac OS', r:/(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
      {s:'QNX', r:/QNX/},
      {s:'UNIX', r:/UNIX/},
      {s:'BeOS', r:/BeOS/},
      {s:'OS/2', r:/OS\/2/},
      {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
  ];
  for (var id in clientStrings) {
      var cs = clientStrings[id];
      if (cs.r.test(nAgt)) {
          os = cs.s;
          break;
      }
  }

  var osVersion = unknown;

  if (/Windows/.test(os)) {
      osVersion = /Windows (.*)/.exec(os)[1];
      os = 'Windows';
  }

  switch (os) {
      case 'Mac OS':
      case 'Mac OS X':
      case 'Android':
          osVersion = /(?:Android|Mac OS|Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh) ([\.\_\d]+)/.exec(nAgt)[1];
          break;

      case 'iOS':
          osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
          osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
          break;
  }
  
  // flash (you'll need to include swfobject)
  /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
  var flashVersion = 'no check';
  if (typeof swfobject != 'undefined') {
      var fv = swfobject.getFlashPlayerVersion();
      if (fv.major > 0) {
          flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
      }
      else  {
          flashVersion = unknown;
      }
  }

  window.jscd = {
      screen: screenSize,
      browser: browser,
      browserVersion: version,
      browserMajorVersion: majorVersion,
      mobile: mobile,
      os: os,
      osVersion: osVersion,
      cookies: cookieEnabled,
      flashVersion: flashVersion
  };

  console.log('OS: ' + jscd.os +' '+ jscd.osVersion);
  console.log('Browser: ' + jscd.browser +'  '+ jscd.browserMajorVersion + '  ' + jscd.browserVersion);
  console.log('Mobile: ' + jscd.mobile);
  console.log('Flash: ' + jscd.flashVersion);
  console.log('Cookies: ' + jscd.cookies);
  console.log('Screen Size: ' + jscd.screen);
  console.log('Full User Agent: ' + navigator.userAgent);

  return window.jscd;
}


/**
 * 检查是否是移动端
 * @returns {boolean} true 为移动端
 */
function isMobile() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

/**
 * 检查是否是本地客户端
 * @returns {boolean} true 为本地客户端
 */
function isNWClient() {
  try {
      if (window.require && window.require('nw.gui')) {
          return true;
      }
  } catch (e) {
      console.log(e);
  }
  return false;
}

/**
 * 检查是否支持webGL
 * @returns {boolean} true 为支持webGL
 */
function hasWebGLContext () {
  var canvas = document.createElement("canvas");
  // Get WebGLRenderingContext from canvas element.
  var gl = canvas.getContext("webgl")
      || canvas.getContext("experimental-webgl");
  // Report the result.
  if (gl && gl instanceof WebGLRenderingContext) {
      return true;
  } else {
      return false;
  }
}

/**
 * 是否是IE浏览器
 */
function isIEBrowser() {
  if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {
    console.log('is IE Browser');
    return true;
  }
  return false;  
}

/**
 * 是否是win 7系统以上
 */
function isWin7Above() {
  console.log('isWin7Above??.....');
  // todo

  if (clientInfo.os && clientInfo.os.indexOf('Mac OS' != -1)) {
    return true;
  }
  if (clientInfo.os && clientInfo.os == 'Windows') {
    if (clientInfo.osVersion) {
      let currenSystemVersion = Number(clientInfo.osVersion);
      console.log('current system version: ' + currenSystemVersion); 
      if (currenSystemVersion == 7 || currenSystemVersion == 8 || currenSystemVersion == 8.1 || currenSystemVersion == 10) {
        return true;
      }
    }
  }
  return false;
}


function isRecentCore (browserVersions, url) {
  console.log('isRecentCore??.....');
  let currentBrowser = clientInfo.browser;
  let currentVersion = Number(clientInfo.browserMajorVersion);
  if (currentBrowser == 'Chrome') {
    return browserVersions.chrome && currentVersion >= Number(browserVersions.chrome);
  }
  if (currentBrowser == 'Safari') {
    return browserVersions.safari && currentVersion >= Number(browserVersions.safari);
  }
  if (currentBrowser == 'Firefox') {
    return browserVersions.firefox && currentVersion >= Number(browserVersions.firefox);
  }
  if (currentBrowser == 'Edge') {
    return browserVersions.edge && currentVersion >= Number(browserVersions.edge);
  }
  return false;
}

function isRecentChromiumCore () {
  console.log('isRecentChromiumCore??....');
  let currentBrowser = clientInfo.browser;
  let currentVersion = Number(clientInfo.browserMajorVersion);
  if (currentBrowser == 'Chrome') {
    console.log(typeof(currentVersion));
    console.log(currentVersion);
    let leastVersion = 57;
    return currentVersion >= leastVersion;
  }
  return false;
  
}


function redirectTo(page) {
  console.log('redirect to page ' + page);
  // todo
}