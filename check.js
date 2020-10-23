
const clientInfo = getClientInfo();

testDemand = {
  mobile: false,
  nwClient: true,
  webGL: true,
  browserVersions: {chrome: 57, safari: 20, firefox: 52, edge: 12},
  url: './'
}

compatibilityCheckCommon(testDemand);

function compatibilityCheckCommon (demand = {
  mobile: false, 
  nwClient: true,
  webGL: false,
  browserVersions: {chrome: 57, safari: 11, firefox: 52, edge: 12},
  url: './'
}) {

  console.log('-------------------');
  if (isMobile()) {
    // 移动端
    if (demand.mobile) {
      return true;
    }

    redirectTo(url + 'pages/pageA.html');
    return false;
  }
  
  console.log('is not mobile');

  if (isNWClient()) {
    // 本地客户端
    
    if (demand.nwClient) {
      if (demand.webGL) {
        if(hasWebGLContext()) {

          return true;
        }
        redirectTo(url + 'pages/NWClient.html');
        return false;
      }
      // 此处可以加一些环境需求
      return true;
    }
    //redirect to local Page
    redirectTo(url + 'pages/NWClient.html'); // 当前不支持本地客户端
    return false;
  }

  console.log('is not NWClient');

  if (demand.webGL) {
    console.log('webgl need...');
    checkBrowserWebGL(demand.browserVersions, demand.url);
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
  return clientInfo.mobile;
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
    console.log('has webGL');
    return true;
  } else {
    console.log('dones\'t have webGL');
    return false;
  }
}

/**
 * 是否是IE浏览器
 */
function isIEBrowser() {
  if(clientInfo.browser == 'MSIE' || clientInfo.browser == 'MSIE11') {
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
    console.log('is mac');
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

/**
 * 判断当前浏览器版本是否满足最低要求
 * @param {Object} browserVersions 表示最低内核版本，统一用小写 { chrome: 57, safari: 11, firefox: 52, edge: 12}
 */
function isNewerCore (browserVersions = {chrome: 57, safari: 11, firefox: 52, edge: 12}) {
  console.log('isNewerCore??.....');
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


function isNewerChromiumCore (leastVersion = 57) {
  console.log('isNewerChromiumCore??....');
  let currentBrowser = clientInfo.browser;
  let currentVersion = Number(clientInfo.browserMajorVersion);
  if (currentBrowser == 'Chrome') {
    console.log(typeof(currentVersion));
    console.log(currentVersion);
    return currentVersion >= leastVersion;
  }
  return false;
  
}

function checkBrowserWebGL (browserVersions, url) {
  // if (hasWebGLContext()) {
  if (false) {                      // test not have webGL
    // 支持webGL
    
    if (isIEBrowser()) {
      redirectTo(url + 'pages/pageD.html');
      return false;
    }

    return true;
  }

  console.log('no webGL');

  if (isWin7Above()) {
    // win7系统以上

    
    if (isNewerCore(browserVersions)) {
      // 当前浏览器是较新的内核版本
      console.log('is Newer core');
      redirectTo(url + 'pages/pageB.html');
    }
    else {
      console.log('is not Newer core');
      redirectTo(url + 'pages/pageD.html');
    }
    return false;
  }
  else {
    // win7系统以下

    if (isNewerChromiumCore()) {
      // 当前浏览器是较新的 谷歌 内核版本
      console.log('is Newer chrome core');
      redirectTo(url + 'pages/pageB.html');
    }
    else {
      console.log('is not Newer chrome core');
      redirectTo(url + 'pages/pageC.html');
    }
    return false;
  }
}


function redirectTo(url) {
  console.log('redirect to page ' + url);
  window.location.href = url;
  // todo
}


// export {compatibilityCheckCommon}