兼容性检查模块
=================

简介
-----------------
该模块为兼容性检查通用模块。

支持包括移动端，本地客户端，webGL，浏览器最低版本等的兼容性检查。

适用情况
-----------------
目前支持对生物Unity新实验的兼容性检查。

具体情况可能需要更新该模块。

如何使用
-----------------
``` js
// 引入
import {compatiblityCheckCommon} from '';

// 设置参数
const demand = {
  mobile: false,    // 表示是否需要兼容移动端; 默认为 false
  nwClient: true,   // 表示是否需要兼容nw本地客户端; 默认为 true
  webGL: true,      // 表示是否需要支持webGL; 默认为 false
  browserVersions: {chrome: 57, safari: 20, firefox: 52, edge: 12},  // 表示支持浏览器内核最低版本
  url: './'         // 表示跳转页面的基础 url 地址，实际跳转为 {url + 'pages/pagesA.html'}
}

// 调用
compatibilityCheckCommon(demand);  //在页面中调用，会自动跳转


```

