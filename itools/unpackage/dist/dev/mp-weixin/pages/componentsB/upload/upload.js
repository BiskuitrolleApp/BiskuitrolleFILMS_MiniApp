require('../common/vendor.js');(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/componentsB/upload/upload"],{456:function(e,n,t){"use strict";(function(e){t(5);r(t(3));var n=r(t(457));function r(e){return e&&e.__esModule?e:{default:e}}wx.__webpack_require_UNI_MP_PLUGIN__=t,e(n.default)}).call(this,t(1)["createPage"])},457:function(e,n,t){"use strict";t.r(n);var r=t(458),o=t(460);for(var u in o)"default"!==u&&function(e){t.d(n,e,(function(){return o[e]}))}(u);t(462),t(464);var i,c=t(11),a=Object(c["default"])(o["default"],r["render"],r["staticRenderFns"],!1,null,null,null,!1,r["components"],i);a.options.__file="pages/componentsB/upload/upload.nvue",n["default"]=a.exports},458:function(e,n,t){"use strict";t.r(n);var r=t(459);t.d(n,"render",(function(){return r["render"]})),t.d(n,"staticRenderFns",(function(){return r["staticRenderFns"]})),t.d(n,"recyclableRender",(function(){return r["recyclableRender"]})),t.d(n,"components",(function(){return r["components"]}))},459:function(e,n,t){"use strict";var r;t.r(n),t.d(n,"render",(function(){return o})),t.d(n,"staticRenderFns",(function(){return i})),t.d(n,"recyclableRender",(function(){return u})),t.d(n,"components",(function(){return r}));try{r={uUpload:function(){return Promise.all([t.e("common/vendor"),t.e("uni_modules/uview-ui/components/u-upload/u-upload")]).then(t.bind(null,1156))}}}catch(c){if(-1===c.message.indexOf("Cannot find module")||-1===c.message.indexOf(".vue"))throw c;console.error(c.message),console.error("1. 排查组件名称拼写是否正确"),console.error("2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"),console.error("3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件")}var o=function(){var e=this,n=e.$createElement;e._self._c},u=!1,i=[];o._withStripped=!0},460:function(e,n,t){"use strict";t.r(n);var r=t(461),o=t.n(r);for(var u in r)"default"!==u&&function(e){t.d(n,e,(function(){return r[e]}))}(u);n["default"]=o.a},461:function(e,n,t){"use strict";(function(e){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=o(t(36));function o(e){return e&&e.__esModule?e:{default:e}}function u(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?u(Object(t),!0).forEach((function(n){c(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):u(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n,t,r,o,u,i){try{var c=e[u](i),a=c.value}catch(s){return void t(s)}c.done?n(a):Promise.resolve(a).then(r,o)}function s(e){return function(){var n=this,t=arguments;return new Promise((function(r,o){var u=e.apply(n,t);function i(e){a(u,r,o,i,c,"next",e)}function c(e){a(u,r,o,i,c,"throw",e)}i(void 0)}))}}var l={data:function(){return{fileList1:[],fileList2:[],fileList3:[{url:"https://cdn.uviewui.com/uview/swiper/1.jpg"}],fileList4:[{url:"https://cdn.uviewui.com/uview/swiper/1.jpg"},{url:"https://cdn.uviewui.com/uview/swiper/1.jpg"}],fileList5:[],fileList6:[],fileList7:[]}},onLoad:function(){},methods:{deletePic:function(e){this["fileList".concat(e.name)].splice(e.index,1)},afterRead:function(e){var n=this;return s(r.default.mark((function t(){var o,u,c,a,s;return r.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:o=[].concat(e.file),u=n["fileList".concat(e.name)].length,o.map((function(t){n["fileList".concat(e.name)].push(i(i({},t),{},{status:"uploading",message:"上传中"}))})),c=0;case 4:if(!(c<o.length)){t.next=14;break}return t.next=7,n.uploadFilePromise(o[c].thumb);case 7:a=t.sent,s=n["fileList".concat(e.name)][u],n["fileList".concat(e.name)].splice(u,1,Object.assign(s,{status:"success",message:"",url:a})),u++;case 11:c++,t.next=4;break;case 14:case"end":return t.stop()}}),t)})))()},uploadFilePromise:function(n){return new Promise((function(t,r){e.uploadFile({url:"",filePath:n,name:"file",formData:{user:"test"},success:function(e){setTimeout((function(){t(e.data.data)}),1e3)}})}))}}};n.default=l}).call(this,t(1)["default"])},462:function(e,n,t){"use strict";t.r(n);var r=t(463),o=t.n(r);for(var u in r)"default"!==u&&function(e){t.d(n,e,(function(){return r[e]}))}(u);n["default"]=o.a},463:function(e,n,t){},464:function(e,n,t){"use strict";t.r(n);var r=t(465),o=t.n(r);for(var u in r)"default"!==u&&function(e){t.d(n,e,(function(){return r[e]}))}(u);n["default"]=o.a},465:function(e,n,t){}},[[456,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/componentsB/upload/upload.js.map