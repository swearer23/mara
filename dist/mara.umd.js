!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).Mara=t()}(this,(function(){"use strict";class e{constructor(e){this.storage=e,this.probe()}probe(){const{onerror:e}=window;window.onerror=(...t)=>{"function"==typeof e&&e.apply(this,t),this.pushLine(t[0],t[1],t[2],t[3],t[4])}}pushLine(e,t,n,r,o){return this.storage.addLine({etype:"JS_ERROR",message:`${e} \n ${o&&o.stack}`,js:`${t}:${n}:${r}`}),!0}}let t=(e=21)=>crypto.getRandomValues(new Uint8Array(e)).reduce(((e,t)=>e+=(t&=63)<36?t.toString(36):t<62?(t-26).toString(36).toUpperCase():t>62?"-":"_"),"");const n={},r=e=>{try{return JSON.stringify(e,null,2)}catch(e){return"not_serializable"}};class o{constructor(e){this.storage=e,this.probe()}probe(){const e=this,{open:r,send:o,setRequestHeader:i}=XMLHttpRequest.prototype;XMLHttpRequest.prototype.open=function(){this.__xhrid=t(),n[this.__xhrid]={headers:{},payload:{},response:{},xhrObject:null},e.addListener(this,arguments),r.apply(this,arguments)},XMLHttpRequest.prototype.setRequestHeader=function(){if(!this.__xhrid)return i.apply(this,arguments);const[e,t]=[...arguments];n[this.__xhrid].headers[e]=t,i.apply(this,arguments)},XMLHttpRequest.prototype.send=function(){if(!this.__xhrid)return o.apply(this,arguments);n[this.__xhrid].payload=[...arguments],o.apply(this,arguments)}}addListener(e,t){const r=this;if(n[e.__xhrid].xhrObject)return;n[e.__xhrid].xhrObject={xhr:e};const{ontimeout:o}=e;e.addEventListener("loadend",(()=>{const{statusText:o,status:i,response:s}=e;let{payload:a,headers:u}=n[e.__xhrid];const c={statusText:o,payload:a,headers:u,status:i,response:s};0!==parseInt(i)&&(/^2[0-9]{1,3}/gi.test(i)||r.addAjaxError(c,[...t]))})),e.addEventListener("error",(()=>{r.addAjaxError({networkError:!0,statusText:e.statusText||"network error"},[...t])})),e.ontimeout=(...n)=>{r.addAjaxError({networkError:!0,statusText:e.statusText},[...t]),o&&o.apply(this,n)}}addAjaxError(e,t){const n={etype:"API_ERROR",networkError:e.networkError||!1,status:e.statusText,statusCode:e.status,request:{method:t[0],url:t[1]}};e.payload&&(n.payload=r(e.payload)),e.response&&(n.response=r(e.response)),e.headers&&(n.headers=r(e.headers)),this.storage.addLine(n)}}const i=function(e){this.forms=e,this.probe()};function s(e,t,n){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return n}function a(e,t){!function(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object")}(e,t),t.add(e)}i.prototype.probe=function(){if(!window.fetch)return;const e=window.fetch;window.fetch=(t,n)=>{let r="GET",o=t||"";return"string"==typeof t?r=n&&n.method?n.method:r:"[object Request]"===Object.prototype.toString.call(t)&&(r=t.method||r,o=t.url||""),e(t,n).then((e=>{const t=`${e.status}`;return/^2[0-9]{1,3}/gi.test(t)||0==+t||this.forms.addLine({etype:"API_ERROR",msg:`status:${e.status}`,js:`${r} :${o}`}),e})).catch((e=>{let t;try{t=e&&e.message?e.message:JSON.stringify(e)}catch(n){t=e&&e.message?e.message:e}throw this.forms.addLine({etype:"API_ERROR",msg:t,js:`${r} :${o}`}),e}))}};var u=new WeakSet,c=new WeakSet,f=new WeakSet,d=new WeakSet;class l{constructor(e){a(this,d),a(this,f),a(this,c),a(this,u),this.storage=e,this.collectInterval=null,this.lastIndex=null,this.navigationPerfCollected=!1,window.performance&&(window.performance.getEntriesByType("navigation")[0].domComplete?s(this,u,p).call(this):window.addEventListener("load",(()=>{s(this,u,p).call(this)})))}}function p(){this.collectInterval=setInterval((()=>{s(this,c,h).call(this)}),1e3)}function h(){const e=performance.getEntries();this.navigationPerfCollected||(s(this,f,m).call(this,e.filter((e=>"navigation"===e.entryType))[0]),this.lastIndex=0),e.slice(this.lastIndex+1).forEach((e=>{if(!e.name.includes("api/mara/report")&&"resource"===e.entryType){const t=Math.max(e.startTime,e.fetchStart).toFixed(2),n=e.responseEnd.toFixed(2);s(this,d,y).call(this,{entryType:e.entryType,name:e.name,startTime:t,endTime:n,duration:(n-t).toFixed(2)})}})),this.lastIndex=e.length-1}function m(e){this.navigationPerfCollected=!0;const t=(n=e,{entryType:e.entryType,name:"1.1.dnsLookup",startTime:n.domainLookupStart.toFixed(2),endTime:n.domainLookupEnd.toFixed(2),duration:(n.domainLookupEnd-n.domainLookupStart).toFixed(2)});var n;s(this,d,y).call(this,t);const r=(t=>({entryType:e.entryType,name:"1.2.tcpConnect",startTime:t.connectStart.toFixed(2),endTime:t.connectEnd.toFixed(2),duration:(t.connectStart-t.connectEnd).toFixed(2)}))(e);s(this,d,y).call(this,r);const o=(t=>({entryType:e.entryType,name:"1.3.requestForHTML",startTime:t.requestStart.toFixed(2),endTime:t.responseEnd.toFixed(2),duration:(t.responseEnd-t.requestStart).toFixed(2)}))(e);s(this,d,y).call(this,o);const i=(t=>{const n=t.responseEnd.toFixed(2),r=t.domContentLoadedEventEnd.toFixed(2);return{entryType:e.entryType,name:"1.4.documentLoad",startTime:n,endTime:r,duration:(r-n).toFixed(2)}})(e);s(this,d,y).call(this,i);const a=(t=>{const n=t.domContentLoadedEventEnd.toFixed(2),r=t.domComplete.toFixed(2);return{entryType:e.entryType,name:"1.5.domComplete",startTime:n,endTime:r,duration:(r-n).toFixed(2)}})(e);s(this,d,y).call(this,a);const u=(t=>{const n=t.domComplete.toFixed(2);return{entryType:e.entryType,name:"1.navigationTiming",startTime:0,endTime:n,duration:(n-0).toFixed(2)}})(e);s(this,d,y).call(this,u)}function y({entryType:e,name:t,startTime:n,endTime:r,duration:o}){const i={etype:"PERF_LOG",entryType:e,name:t,startTime:n,endTime:r,duration:o};this.storage.addLine(i)}var g,v=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}},w=Object.prototype.toString,E=(g=Object.create(null),function(e){var t=w.call(e);return g[t]||(g[t]=t.slice(8,-1).toLowerCase())});function _(e){return e=e.toLowerCase(),function(t){return E(t)===e}}function b(e){return Array.isArray(e)}function x(e){return void 0===e}var T=_("ArrayBuffer");function R(e){return null!==e&&"object"==typeof e}function O(e){if("object"!==E(e))return!1;var t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}var S=_("Date"),A=_("File"),j=_("Blob"),C=_("FileList");function B(e){return"[object Function]"===w.call(e)}var L=_("URLSearchParams");function P(e,t){if(null!=e)if("object"!=typeof e&&(e=[e]),b(e))for(var n=0,r=e.length;n<r;n++)t.call(null,e[n],n,e);else for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.call(null,e[o],o,e)}var N,k=(N="undefined"!=typeof Uint8Array&&Object.getPrototypeOf(Uint8Array),function(e){return N&&e instanceof N}),D={isArray:b,isArrayBuffer:T,isBuffer:function(e){return null!==e&&!x(e)&&null!==e.constructor&&!x(e.constructor)&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)},isFormData:function(e){var t="[object FormData]";return e&&("function"==typeof FormData&&e instanceof FormData||w.call(e)===t||B(e.toString)&&e.toString()===t)},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&T(e.buffer)},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:R,isPlainObject:O,isUndefined:x,isDate:S,isFile:A,isBlob:j,isFunction:B,isStream:function(e){return R(e)&&B(e.pipe)},isURLSearchParams:L,isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},forEach:P,merge:function e(){var t={};function n(n,r){O(t[r])&&O(n)?t[r]=e(t[r],n):O(n)?t[r]=e({},n):b(n)?t[r]=n.slice():t[r]=n}for(var r=0,o=arguments.length;r<o;r++)P(arguments[r],n);return t},extend:function(e,t,n){return P(t,(function(t,r){e[r]=n&&"function"==typeof t?v(t,n):t})),e},trim:function(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")},stripBOM:function(e){return 65279===e.charCodeAt(0)&&(e=e.slice(1)),e},inherits:function(e,t,n,r){e.prototype=Object.create(t.prototype,r),e.prototype.constructor=e,n&&Object.assign(e.prototype,n)},toFlatObject:function(e,t,n){var r,o,i,s={};t=t||{};do{for(o=(r=Object.getOwnPropertyNames(e)).length;o-- >0;)s[i=r[o]]||(t[i]=e[i],s[i]=!0);e=Object.getPrototypeOf(e)}while(e&&(!n||n(e,t))&&e!==Object.prototype);return t},kindOf:E,kindOfTest:_,endsWith:function(e,t,n){e=String(e),(void 0===n||n>e.length)&&(n=e.length),n-=t.length;var r=e.indexOf(t,n);return-1!==r&&r===n},toArray:function(e){if(!e)return null;var t=e.length;if(x(t))return null;for(var n=new Array(t);t-- >0;)n[t]=e[t];return n},isTypedArray:k,isFileList:C};function U(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var F=function(e,t,n){if(!t)return e;var r;if(n)r=n(t);else if(D.isURLSearchParams(t))r=t.toString();else{var o=[];D.forEach(t,(function(e,t){null!=e&&(D.isArray(e)?t+="[]":e=[e],D.forEach(e,(function(e){D.isDate(e)?e=e.toISOString():D.isObject(e)&&(e=JSON.stringify(e)),o.push(U(t)+"="+U(e))})))})),r=o.join("&")}if(r){var i=e.indexOf("#");-1!==i&&(e=e.slice(0,i)),e+=(-1===e.indexOf("?")?"?":"&")+r}return e};function I(){this.handlers=[]}I.prototype.use=function(e,t,n){return this.handlers.push({fulfilled:e,rejected:t,synchronous:!!n&&n.synchronous,runWhen:n?n.runWhen:null}),this.handlers.length-1},I.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},I.prototype.forEach=function(e){D.forEach(this.handlers,(function(t){null!==t&&e(t)}))};var q=I,M=function(e,t){D.forEach(e,(function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])}))};function H(e,t,n,r,o){Error.call(this),this.message=e,this.name="AxiosError",t&&(this.code=t),n&&(this.config=n),r&&(this.request=r),o&&(this.response=o)}D.inherits(H,Error,{toJSON:function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code,status:this.response&&this.response.status?this.response.status:null}}});var $=H.prototype,z={};["ERR_BAD_OPTION_VALUE","ERR_BAD_OPTION","ECONNABORTED","ETIMEDOUT","ERR_NETWORK","ERR_FR_TOO_MANY_REDIRECTS","ERR_DEPRECATED","ERR_BAD_RESPONSE","ERR_BAD_REQUEST","ERR_CANCELED"].forEach((function(e){z[e]={value:e}})),Object.defineProperties(H,z),Object.defineProperty($,"isAxiosError",{value:!0}),H.from=function(e,t,n,r,o,i){var s=Object.create($);return D.toFlatObject(e,s,(function(e){return e!==Error.prototype})),H.call(s,e.message,t,n,r,o),s.name=e.name,i&&Object.assign(s,i),s};var W=H,J={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1};var V=function(e,t){t=t||new FormData;var n=[];function r(e){return null===e?"":D.isDate(e)?e.toISOString():D.isArrayBuffer(e)||D.isTypedArray(e)?"function"==typeof Blob?new Blob([e]):Buffer.from(e):e}return function e(o,i){if(D.isPlainObject(o)||D.isArray(o)){if(-1!==n.indexOf(o))throw Error("Circular reference detected in "+i);n.push(o),D.forEach(o,(function(n,o){if(!D.isUndefined(n)){var s,a=i?i+"."+o:o;if(n&&!i&&"object"==typeof n)if(D.endsWith(o,"{}"))n=JSON.stringify(n);else if(D.endsWith(o,"[]")&&(s=D.toArray(n)))return void s.forEach((function(e){!D.isUndefined(e)&&t.append(a,r(e))}));e(n,a)}})),n.pop()}else t.append(i,r(o))}(e),t},X=D.isStandardBrowserEnv()?{write:function(e,t,n,r,o,i){var s=[];s.push(e+"="+encodeURIComponent(t)),D.isNumber(n)&&s.push("expires="+new Date(n).toGMTString()),D.isString(r)&&s.push("path="+r),D.isString(o)&&s.push("domain="+o),!0===i&&s.push("secure"),document.cookie=s.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}},G=function(e,t){return e&&!/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t)?function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}(e,t):t},K=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"],Q=D.isStandardBrowserEnv()?function(){var e,t=/(msie|trident)/i.test(navigator.userAgent),n=document.createElement("a");function r(e){var r=e;return t&&(n.setAttribute("href",r),r=n.href),n.setAttribute("href",r),{href:n.href,protocol:n.protocol?n.protocol.replace(/:$/,""):"",host:n.host,search:n.search?n.search.replace(/^\?/,""):"",hash:n.hash?n.hash.replace(/^#/,""):"",hostname:n.hostname,port:n.port,pathname:"/"===n.pathname.charAt(0)?n.pathname:"/"+n.pathname}}return e=r(window.location.href),function(t){var n=D.isString(t)?r(t):t;return n.protocol===e.protocol&&n.host===e.host}}():function(){return!0};function Y(e){W.call(this,null==e?"canceled":e,W.ERR_CANCELED),this.name="CanceledError"}D.inherits(Y,W,{__CANCEL__:!0});var Z=Y,ee=function(e){return new Promise((function(t,n){var r,o=e.data,i=e.headers,s=e.responseType;function a(){e.cancelToken&&e.cancelToken.unsubscribe(r),e.signal&&e.signal.removeEventListener("abort",r)}D.isFormData(o)&&D.isStandardBrowserEnv()&&delete i["Content-Type"];var u=new XMLHttpRequest;if(e.auth){var c=e.auth.username||"",f=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";i.Authorization="Basic "+btoa(c+":"+f)}var d=G(e.baseURL,e.url);function l(){if(u){var r,o,i,c,f,d="getAllResponseHeaders"in u?(r=u.getAllResponseHeaders(),f={},r?(D.forEach(r.split("\n"),(function(e){if(c=e.indexOf(":"),o=D.trim(e.substr(0,c)).toLowerCase(),i=D.trim(e.substr(c+1)),o){if(f[o]&&K.indexOf(o)>=0)return;f[o]="set-cookie"===o?(f[o]?f[o]:[]).concat([i]):f[o]?f[o]+", "+i:i}})),f):f):null;!function(e,t,n){var r=n.config.validateStatus;n.status&&r&&!r(n.status)?t(new W("Request failed with status code "+n.status,[W.ERR_BAD_REQUEST,W.ERR_BAD_RESPONSE][Math.floor(n.status/100)-4],n.config,n.request,n)):e(n)}((function(e){t(e),a()}),(function(e){n(e),a()}),{data:s&&"text"!==s&&"json"!==s?u.response:u.responseText,status:u.status,statusText:u.statusText,headers:d,config:e,request:u}),u=null}}if(u.open(e.method.toUpperCase(),F(d,e.params,e.paramsSerializer),!0),u.timeout=e.timeout,"onloadend"in u?u.onloadend=l:u.onreadystatechange=function(){u&&4===u.readyState&&(0!==u.status||u.responseURL&&0===u.responseURL.indexOf("file:"))&&setTimeout(l)},u.onabort=function(){u&&(n(new W("Request aborted",W.ECONNABORTED,e,u)),u=null)},u.onerror=function(){n(new W("Network Error",W.ERR_NETWORK,e,u,u)),u=null},u.ontimeout=function(){var t=e.timeout?"timeout of "+e.timeout+"ms exceeded":"timeout exceeded",r=e.transitional||J;e.timeoutErrorMessage&&(t=e.timeoutErrorMessage),n(new W(t,r.clarifyTimeoutError?W.ETIMEDOUT:W.ECONNABORTED,e,u)),u=null},D.isStandardBrowserEnv()){var p=(e.withCredentials||Q(d))&&e.xsrfCookieName?X.read(e.xsrfCookieName):void 0;p&&(i[e.xsrfHeaderName]=p)}"setRequestHeader"in u&&D.forEach(i,(function(e,t){void 0===o&&"content-type"===t.toLowerCase()?delete i[t]:u.setRequestHeader(t,e)})),D.isUndefined(e.withCredentials)||(u.withCredentials=!!e.withCredentials),s&&"json"!==s&&(u.responseType=e.responseType),"function"==typeof e.onDownloadProgress&&u.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&u.upload&&u.upload.addEventListener("progress",e.onUploadProgress),(e.cancelToken||e.signal)&&(r=function(e){u&&(n(!e||e&&e.type?new Z:e),u.abort(),u=null)},e.cancelToken&&e.cancelToken.subscribe(r),e.signal&&(e.signal.aborted?r():e.signal.addEventListener("abort",r))),o||(o=null);var h,m=(h=/^([-+\w]{1,25})(:?\/\/|:)/.exec(d))&&h[1]||"";m&&-1===["http","https","file"].indexOf(m)?n(new W("Unsupported protocol "+m+":",W.ERR_BAD_REQUEST,e)):u.send(o)}))},te={"Content-Type":"application/x-www-form-urlencoded"};function ne(e,t){!D.isUndefined(e)&&D.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}var re,oe={transitional:J,adapter:(("undefined"!=typeof XMLHttpRequest||"undefined"!=typeof process&&"[object process]"===Object.prototype.toString.call(process))&&(re=ee),re),transformRequest:[function(e,t){if(M(t,"Accept"),M(t,"Content-Type"),D.isFormData(e)||D.isArrayBuffer(e)||D.isBuffer(e)||D.isStream(e)||D.isFile(e)||D.isBlob(e))return e;if(D.isArrayBufferView(e))return e.buffer;if(D.isURLSearchParams(e))return ne(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString();var n,r=D.isObject(e),o=t&&t["Content-Type"];if((n=D.isFileList(e))||r&&"multipart/form-data"===o){var i=this.env&&this.env.FormData;return V(n?{"files[]":e}:e,i&&new i)}return r||"application/json"===o?(ne(t,"application/json"),function(e,t,n){if(D.isString(e))try{return(t||JSON.parse)(e),D.trim(e)}catch(e){if("SyntaxError"!==e.name)throw e}return(n||JSON.stringify)(e)}(e)):e}],transformResponse:[function(e){var t=this.transitional||oe.transitional,n=t&&t.silentJSONParsing,r=t&&t.forcedJSONParsing,o=!n&&"json"===this.responseType;if(o||r&&D.isString(e)&&e.length)try{return JSON.parse(e)}catch(e){if(o){if("SyntaxError"===e.name)throw W.from(e,W.ERR_BAD_RESPONSE,this,null,this.response);throw e}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:null},validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*"}}};D.forEach(["delete","get","head"],(function(e){oe.headers[e]={}})),D.forEach(["post","put","patch"],(function(e){oe.headers[e]=D.merge(te)}));var ie=oe,se=function(e,t,n){var r=this||ie;return D.forEach(n,(function(n){e=n.call(r,e,t)})),e},ae=function(e){return!(!e||!e.__CANCEL__)};function ue(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new Z}var ce=function(e){return ue(e),e.headers=e.headers||{},e.data=se.call(e,e.data,e.headers,e.transformRequest),e.headers=D.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),D.forEach(["delete","get","head","post","put","patch","common"],(function(t){delete e.headers[t]})),(e.adapter||ie.adapter)(e).then((function(t){return ue(e),t.data=se.call(e,t.data,t.headers,e.transformResponse),t}),(function(t){return ae(t)||(ue(e),t&&t.response&&(t.response.data=se.call(e,t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)}))},fe=function(e,t){t=t||{};var n={};function r(e,t){return D.isPlainObject(e)&&D.isPlainObject(t)?D.merge(e,t):D.isPlainObject(t)?D.merge({},t):D.isArray(t)?t.slice():t}function o(n){return D.isUndefined(t[n])?D.isUndefined(e[n])?void 0:r(void 0,e[n]):r(e[n],t[n])}function i(e){if(!D.isUndefined(t[e]))return r(void 0,t[e])}function s(n){return D.isUndefined(t[n])?D.isUndefined(e[n])?void 0:r(void 0,e[n]):r(void 0,t[n])}function a(n){return n in t?r(e[n],t[n]):n in e?r(void 0,e[n]):void 0}var u={url:i,method:i,data:i,baseURL:s,transformRequest:s,transformResponse:s,paramsSerializer:s,timeout:s,timeoutMessage:s,withCredentials:s,adapter:s,responseType:s,xsrfCookieName:s,xsrfHeaderName:s,onUploadProgress:s,onDownloadProgress:s,decompress:s,maxContentLength:s,maxBodyLength:s,beforeRedirect:s,transport:s,httpAgent:s,httpsAgent:s,cancelToken:s,socketPath:s,responseEncoding:s,validateStatus:a};return D.forEach(Object.keys(e).concat(Object.keys(t)),(function(e){var t=u[e]||o,r=t(e);D.isUndefined(r)&&t!==a||(n[e]=r)})),n},de="0.27.2",le=de,pe={};["object","boolean","number","function","string","symbol"].forEach((function(e,t){pe[e]=function(n){return typeof n===e||"a"+(t<1?"n ":" ")+e}}));var he={};pe.transitional=function(e,t,n){function r(e,t){return"[Axios v"+le+"] Transitional option '"+e+"'"+t+(n?". "+n:"")}return function(n,o,i){if(!1===e)throw new W(r(o," has been removed"+(t?" in "+t:"")),W.ERR_DEPRECATED);return t&&!he[o]&&(he[o]=!0,console.warn(r(o," has been deprecated since v"+t+" and will be removed in the near future"))),!e||e(n,o,i)}};var me={assertOptions:function(e,t,n){if("object"!=typeof e)throw new W("options must be an object",W.ERR_BAD_OPTION_VALUE);for(var r=Object.keys(e),o=r.length;o-- >0;){var i=r[o],s=t[i];if(s){var a=e[i],u=void 0===a||s(a,i,e);if(!0!==u)throw new W("option "+i+" must be "+u,W.ERR_BAD_OPTION_VALUE)}else if(!0!==n)throw new W("Unknown option "+i,W.ERR_BAD_OPTION)}},validators:pe},ye=me.validators;function ge(e){this.defaults=e,this.interceptors={request:new q,response:new q}}ge.prototype.request=function(e,t){"string"==typeof e?(t=t||{}).url=e:t=e||{},(t=fe(this.defaults,t)).method?t.method=t.method.toLowerCase():this.defaults.method?t.method=this.defaults.method.toLowerCase():t.method="get";var n=t.transitional;void 0!==n&&me.assertOptions(n,{silentJSONParsing:ye.transitional(ye.boolean),forcedJSONParsing:ye.transitional(ye.boolean),clarifyTimeoutError:ye.transitional(ye.boolean)},!1);var r=[],o=!0;this.interceptors.request.forEach((function(e){"function"==typeof e.runWhen&&!1===e.runWhen(t)||(o=o&&e.synchronous,r.unshift(e.fulfilled,e.rejected))}));var i,s=[];if(this.interceptors.response.forEach((function(e){s.push(e.fulfilled,e.rejected)})),!o){var a=[ce,void 0];for(Array.prototype.unshift.apply(a,r),a=a.concat(s),i=Promise.resolve(t);a.length;)i=i.then(a.shift(),a.shift());return i}for(var u=t;r.length;){var c=r.shift(),f=r.shift();try{u=c(u)}catch(e){f(e);break}}try{i=ce(u)}catch(e){return Promise.reject(e)}for(;s.length;)i=i.then(s.shift(),s.shift());return i},ge.prototype.getUri=function(e){e=fe(this.defaults,e);var t=G(e.baseURL,e.url);return F(t,e.params,e.paramsSerializer)},D.forEach(["delete","get","head","options"],(function(e){ge.prototype[e]=function(t,n){return this.request(fe(n||{},{method:e,url:t,data:(n||{}).data}))}})),D.forEach(["post","put","patch"],(function(e){function t(t){return function(n,r,o){return this.request(fe(o||{},{method:e,headers:t?{"Content-Type":"multipart/form-data"}:{},url:n,data:r}))}}ge.prototype[e]=t(),ge.prototype[e+"Form"]=t(!0)}));var ve=ge;function we(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise((function(e){t=e}));var n=this;this.promise.then((function(e){if(n._listeners){var t,r=n._listeners.length;for(t=0;t<r;t++)n._listeners[t](e);n._listeners=null}})),this.promise.then=function(e){var t,r=new Promise((function(e){n.subscribe(e),t=e})).then(e);return r.cancel=function(){n.unsubscribe(t)},r},e((function(e){n.reason||(n.reason=new Z(e),t(n.reason))}))}we.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},we.prototype.subscribe=function(e){this.reason?e(this.reason):this._listeners?this._listeners.push(e):this._listeners=[e]},we.prototype.unsubscribe=function(e){if(this._listeners){var t=this._listeners.indexOf(e);-1!==t&&this._listeners.splice(t,1)}},we.source=function(){var e;return{token:new we((function(t){e=t})),cancel:e}};var Ee=we;var _e=function e(t){var n=new ve(t),r=v(ve.prototype.request,n);return D.extend(r,ve.prototype,n),D.extend(r,n),r.create=function(n){return e(fe(t,n))},r}(ie);_e.Axios=ve,_e.CanceledError=Z,_e.CancelToken=Ee,_e.isCancel=ae,_e.VERSION=de,_e.toFormData=V,_e.AxiosError=W,_e.Cancel=_e.CanceledError,_e.all=function(e){return Promise.all(e)},_e.spread=function(e){return function(t){return e.apply(null,t)}},_e.isAxiosError=function(e){return D.isObject(e)&&!0===e.isAxiosError};var be=_e,xe=_e;be.default=xe;var Te=be,Re="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function Oe(e){if(e.__esModule)return e;var t=Object.defineProperty({},"__esModule",{value:!0});return Object.keys(e).forEach((function(n){var r=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(t,n,r.get?r:{enumerable:!0,get:function(){return e[n]}})})),t}function Se(e){var t={exports:{}};return e(t,t.exports),t.exports}var Ae=Oe({__proto__:null,default:{}}),je=Se((function(e,t){var n;e.exports=(n=n||function(e,t){var n;if("undefined"!=typeof window&&window.crypto&&(n=window.crypto),"undefined"!=typeof self&&self.crypto&&(n=self.crypto),"undefined"!=typeof globalThis&&globalThis.crypto&&(n=globalThis.crypto),!n&&"undefined"!=typeof window&&window.msCrypto&&(n=window.msCrypto),!n&&void 0!==Re&&Re.crypto&&(n=Re.crypto),!n&&"function"==typeof require)try{n=Ae}catch(e){}var r=function(){if(n){if("function"==typeof n.getRandomValues)try{return n.getRandomValues(new Uint32Array(1))[0]}catch(e){}if("function"==typeof n.randomBytes)try{return n.randomBytes(4).readInt32LE()}catch(e){}}throw new Error("Native crypto module could not be used to get secure random number.")},o=Object.create||function(){function e(){}return function(t){var n;return e.prototype=t,n=new e,e.prototype=null,n}}(),i={},s=i.lib={},a=s.Base={extend:function(e){var t=o(this);return e&&t.mixIn(e),t.hasOwnProperty("init")&&this.init!==t.init||(t.init=function(){t.$super.init.apply(this,arguments)}),t.init.prototype=t,t.$super=this,t},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.init.prototype.extend(this)}},u=s.WordArray=a.extend({init:function(e,n){e=this.words=e||[],this.sigBytes=n!=t?n:4*e.length},toString:function(e){return(e||f).stringify(this)},concat:function(e){var t=this.words,n=e.words,r=this.sigBytes,o=e.sigBytes;if(this.clamp(),r%4)for(var i=0;i<o;i++){var s=n[i>>>2]>>>24-i%4*8&255;t[r+i>>>2]|=s<<24-(r+i)%4*8}else for(var a=0;a<o;a+=4)t[r+a>>>2]=n[a>>>2];return this.sigBytes+=o,this},clamp:function(){var t=this.words,n=this.sigBytes;t[n>>>2]&=4294967295<<32-n%4*8,t.length=e.ceil(n/4)},clone:function(){var e=a.clone.call(this);return e.words=this.words.slice(0),e},random:function(e){for(var t=[],n=0;n<e;n+=4)t.push(r());return new u.init(t,e)}}),c=i.enc={},f=c.Hex={stringify:function(e){for(var t=e.words,n=e.sigBytes,r=[],o=0;o<n;o++){var i=t[o>>>2]>>>24-o%4*8&255;r.push((i>>>4).toString(16)),r.push((15&i).toString(16))}return r.join("")},parse:function(e){for(var t=e.length,n=[],r=0;r<t;r+=2)n[r>>>3]|=parseInt(e.substr(r,2),16)<<24-r%8*4;return new u.init(n,t/2)}},d=c.Latin1={stringify:function(e){for(var t=e.words,n=e.sigBytes,r=[],o=0;o<n;o++){var i=t[o>>>2]>>>24-o%4*8&255;r.push(String.fromCharCode(i))}return r.join("")},parse:function(e){for(var t=e.length,n=[],r=0;r<t;r++)n[r>>>2]|=(255&e.charCodeAt(r))<<24-r%4*8;return new u.init(n,t)}},l=c.Utf8={stringify:function(e){try{return decodeURIComponent(escape(d.stringify(e)))}catch(e){throw new Error("Malformed UTF-8 data")}},parse:function(e){return d.parse(unescape(encodeURIComponent(e)))}},p=s.BufferedBlockAlgorithm=a.extend({reset:function(){this._data=new u.init,this._nDataBytes=0},_append:function(e){"string"==typeof e&&(e=l.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function(t){var n,r=this._data,o=r.words,i=r.sigBytes,s=this.blockSize,a=i/(4*s),c=(a=t?e.ceil(a):e.max((0|a)-this._minBufferSize,0))*s,f=e.min(4*c,i);if(c){for(var d=0;d<c;d+=s)this._doProcessBlock(o,d);n=o.splice(0,c),r.sigBytes-=f}return new u.init(n,f)},clone:function(){var e=a.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0});s.Hasher=p.extend({cfg:a.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function(){p.reset.call(this),this._doReset()},update:function(e){return this._append(e),this._process(),this},finalize:function(e){return e&&this._append(e),this._doFinalize()},blockSize:16,_createHelper:function(e){return function(t,n){return new e.init(n).finalize(t)}},_createHmacHelper:function(e){return function(t,n){return new h.HMAC.init(e,n).finalize(t)}}});var h=i.algo={};return i}(Math),n)})),Ce=Se((function(e,t){var n;e.exports=(n=je,function(e){var t=n,r=t.lib,o=r.WordArray,i=r.Hasher,s=t.algo,a=[];!function(){for(var t=0;t<64;t++)a[t]=4294967296*e.abs(e.sin(t+1))|0}();var u=s.MD5=i.extend({_doReset:function(){this._hash=new o.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(e,t){for(var n=0;n<16;n++){var r=t+n,o=e[r];e[r]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8)}var i=this._hash.words,s=e[t+0],u=e[t+1],p=e[t+2],h=e[t+3],m=e[t+4],y=e[t+5],g=e[t+6],v=e[t+7],w=e[t+8],E=e[t+9],_=e[t+10],b=e[t+11],x=e[t+12],T=e[t+13],R=e[t+14],O=e[t+15],S=i[0],A=i[1],j=i[2],C=i[3];S=c(S,A,j,C,s,7,a[0]),C=c(C,S,A,j,u,12,a[1]),j=c(j,C,S,A,p,17,a[2]),A=c(A,j,C,S,h,22,a[3]),S=c(S,A,j,C,m,7,a[4]),C=c(C,S,A,j,y,12,a[5]),j=c(j,C,S,A,g,17,a[6]),A=c(A,j,C,S,v,22,a[7]),S=c(S,A,j,C,w,7,a[8]),C=c(C,S,A,j,E,12,a[9]),j=c(j,C,S,A,_,17,a[10]),A=c(A,j,C,S,b,22,a[11]),S=c(S,A,j,C,x,7,a[12]),C=c(C,S,A,j,T,12,a[13]),j=c(j,C,S,A,R,17,a[14]),S=f(S,A=c(A,j,C,S,O,22,a[15]),j,C,u,5,a[16]),C=f(C,S,A,j,g,9,a[17]),j=f(j,C,S,A,b,14,a[18]),A=f(A,j,C,S,s,20,a[19]),S=f(S,A,j,C,y,5,a[20]),C=f(C,S,A,j,_,9,a[21]),j=f(j,C,S,A,O,14,a[22]),A=f(A,j,C,S,m,20,a[23]),S=f(S,A,j,C,E,5,a[24]),C=f(C,S,A,j,R,9,a[25]),j=f(j,C,S,A,h,14,a[26]),A=f(A,j,C,S,w,20,a[27]),S=f(S,A,j,C,T,5,a[28]),C=f(C,S,A,j,p,9,a[29]),j=f(j,C,S,A,v,14,a[30]),S=d(S,A=f(A,j,C,S,x,20,a[31]),j,C,y,4,a[32]),C=d(C,S,A,j,w,11,a[33]),j=d(j,C,S,A,b,16,a[34]),A=d(A,j,C,S,R,23,a[35]),S=d(S,A,j,C,u,4,a[36]),C=d(C,S,A,j,m,11,a[37]),j=d(j,C,S,A,v,16,a[38]),A=d(A,j,C,S,_,23,a[39]),S=d(S,A,j,C,T,4,a[40]),C=d(C,S,A,j,s,11,a[41]),j=d(j,C,S,A,h,16,a[42]),A=d(A,j,C,S,g,23,a[43]),S=d(S,A,j,C,E,4,a[44]),C=d(C,S,A,j,x,11,a[45]),j=d(j,C,S,A,O,16,a[46]),S=l(S,A=d(A,j,C,S,p,23,a[47]),j,C,s,6,a[48]),C=l(C,S,A,j,v,10,a[49]),j=l(j,C,S,A,R,15,a[50]),A=l(A,j,C,S,y,21,a[51]),S=l(S,A,j,C,x,6,a[52]),C=l(C,S,A,j,h,10,a[53]),j=l(j,C,S,A,_,15,a[54]),A=l(A,j,C,S,u,21,a[55]),S=l(S,A,j,C,w,6,a[56]),C=l(C,S,A,j,O,10,a[57]),j=l(j,C,S,A,g,15,a[58]),A=l(A,j,C,S,T,21,a[59]),S=l(S,A,j,C,m,6,a[60]),C=l(C,S,A,j,b,10,a[61]),j=l(j,C,S,A,p,15,a[62]),A=l(A,j,C,S,E,21,a[63]),i[0]=i[0]+S|0,i[1]=i[1]+A|0,i[2]=i[2]+j|0,i[3]=i[3]+C|0},_doFinalize:function(){var t=this._data,n=t.words,r=8*this._nDataBytes,o=8*t.sigBytes;n[o>>>5]|=128<<24-o%32;var i=e.floor(r/4294967296),s=r;n[15+(o+64>>>9<<4)]=16711935&(i<<8|i>>>24)|4278255360&(i<<24|i>>>8),n[14+(o+64>>>9<<4)]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),t.sigBytes=4*(n.length+1),this._process();for(var a=this._hash,u=a.words,c=0;c<4;c++){var f=u[c];u[c]=16711935&(f<<8|f>>>24)|4278255360&(f<<24|f>>>8)}return a},clone:function(){var e=i.clone.call(this);return e._hash=this._hash.clone(),e}});function c(e,t,n,r,o,i,s){var a=e+(t&n|~t&r)+o+s;return(a<<i|a>>>32-i)+t}function f(e,t,n,r,o,i,s){var a=e+(t&r|n&~r)+o+s;return(a<<i|a>>>32-i)+t}function d(e,t,n,r,o,i,s){var a=e+(t^n^r)+o+s;return(a<<i|a>>>32-i)+t}function l(e,t,n,r,o,i,s){var a=e+(n^(t|~r))+o+s;return(a<<i|a>>>32-i)+t}t.MD5=i._createHelper(u),t.HmacMD5=i._createHmacHelper(u)}(Math),n.MD5)}));const Be=(e,t,n,r,o)=>{let i,s;"prod"===e?(i="https://m7-hlgw-c1-openapi.longfor.com/julianos-prod/",s="a2e33eb4-6516-43f9-bcc0-9c47b0f123b3"):(i="//api-uat.longfor.com/julianos-uat/",s="791f6690-0714-445f-9273-78a3199622d2");const a={"X-Gaia-Api-Key":s},u=(new Date).getTime(),c=(e=>{const t=e=>e>=65&&e<91||e>=97&&e<123,n=e.toString().split("");let r="",o=0;for(;o<13;){const e=n[o],i=`${e}${n[o+1]}`,s=`${i}${n[o+2]}`;0!==parseInt(e)?t(parseInt(i))?(r+=String.fromCharCode(i),o+=2):t(parseInt(s))?(r+=String.fromCharCode(s),o+=3):(r+=e,o++):(r=`${r}${e}`,o++)}return r.split("").reverse().join("")})(u),f=((e,t)=>Ce(`${e}${t}`).toString())(o.appid,u);o.appid&&(a["x-mara-signature"]=f,a["x-mara-slug"]=c,a["x-mara-app-name"]=o.appname);return{method:t,url:`${i}${n}`,withCredentials:!0,headers:a,data:r}};var Le=new WeakSet,Pe=new WeakSet,Ne=new WeakSet,ke=new WeakSet;class De{constructor(e,t,n,r){if(a(this,ke),a(this,Ne),a(this,Pe),a(this,Le),De.instance)return De.instance;this.__pool__=[],this.appname=e,this.appid=t,this.sessionId=n,this.env=r,this.userid=null,s(this,Le,Ue).call(this),De.instance=this}setUser(e){this.userid||(this.userid=e)}addLine(e){setTimeout((()=>{this.__pool__.push(Object.assign(s(this,ke,qe).call(this),e))}),0)}}function Ue(){setInterval(s(this,Ne,Ie).bind(this),1e3)}function Fe(){let e=[];if("prod"===this.env)e=this.__pool__,this.__pool__=[];else if(this.__pool__.length>5)for(let t=0;t<5;t++)e.push(this.__pool__.shift());else e=this.__pool__,this.__pool__=[];return e}function Ie(){if(!this.userid)return;const e=s(this,Pe,Fe).call(this);if(e.length){const t="api/mara/report",n=Be(this.env,"post",t,e.map((e=>(e.user=this.userid,e))),{appname:this.appname,appid:this.appid});Te(n)}}function qe(){let e;try{e=(new Date).toLocaleString("zh-CN",{timeZone:"Asia/Shanghai"})}catch(t){e=(new Date).toLocaleString()}return Object.assign({},{localeTime:e,"@timestamp":Date.now(),ua:navigator.userAgent,url:location?location.href:"",appname:this.appname,sessionId:this.sessionId})}De.instance=null;return class{constructor(e,n,r={env:"uat"}){this.checkParams(e,n),this.appname=e,this.appid=n,this.env=r.env,this.userid=null,this.sessionId=t(16),this.init()}checkParams(e,t){if(!e)throw Error("appname 必传");if(!t)throw Error("appid 必传")}init(){this.storage=new De(this.appname,this.appid,this.sessionId,this.env),new e(this.storage),new o(this.storage),new i(this.storage),new l(this.storage)}setUser(e){this.storage.setUser(e)}probe(e,...t){e&&("object"==typeof t&&(t=JSON.stringify(t,null,2)),this.storage.addLine({etype:"RT_LOG",eventTag:e,message:t}))}}}));
