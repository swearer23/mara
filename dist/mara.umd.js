!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).Mara=t()}(this,(function(){"use strict";class e{constructor(e){this.storage=e,this.probe()}probe(){const{onerror:e}=window;window.onerror=(...t)=>{"function"==typeof e&&e.apply(this,t),this.pushLine(t[0],t[1],t[2],t[3],t[4])}}pushLine(e,t,n,r,o){return this.storage.addLine({etype:"JS_ERROR",message:`${e} \n ${o&&o.stack}`,js:`${t}:${n}:${r}`}),!0}}let t=(e=21)=>crypto.getRandomValues(new Uint8Array(e)).reduce(((e,t)=>e+=(t&=63)<36?t.toString(36):t<62?(t-26).toString(36).toUpperCase():t>62?"-":"_"),"");const n={},r=e=>{try{return JSON.stringify(e,null,2)}catch(e){return"not_serializable"}},o=()=>({headers:{},payload:{},response:{},xhrObject:null,xhrOpenedAt:window.performance&&window.performance.now()});class i{constructor(e,t={autoTraceId:autoTraceId,slowAPIThreshold:slowAPIThreshold,traceIdKey:traceIdKey,slowAPIThreshold:slowAPIThreshold,sessionId:sessionId,sessionIdKey:sessionIdKey,onApiMeasured:onApiMeasured}){this.storage=e,this.autoTraceId=t.autoTraceId,this.slowAPIThreshold=t.slowAPIThreshold,this.traceIdKey=t.traceIdKey,this.slowAPIThreshold=t.slowAPIThreshold,this.sessionId=t.sessionId,this.sessionIdKey=t.sessionIdKey,this.onApiMeasured=t.onApiMeasured,this.probe()}probe(){const e=this,{open:r,send:i,setRequestHeader:s}=XMLHttpRequest.prototype;XMLHttpRequest.prototype.open=function(){arguments[1].includes("api/mara/report")||(this.__xhrid=t(),n[this.__xhrid]=o(),e.addListener(this,arguments)),r.apply(this,arguments)},XMLHttpRequest.prototype.setRequestHeader=function(){if(!this.__xhrid)return s.apply(this,arguments);const[e,t]=[...arguments];n[this.__xhrid].headers[e]=t,s.apply(this,arguments)},XMLHttpRequest.prototype.send=function(){return this.__xhrid?(e.autoTraceId&&(this.setRequestHeader(e.traceIdKey,t(16)),this.setRequestHeader(e.sessionIdKey,e.sessionId)),e.slowAPIThreshold&&(n[this.__xhrid].startTime=Date.now()),this.__xhrid?(n[this.__xhrid].payload=[...arguments],void i.apply(this,arguments)):i.apply(this,arguments)):i.apply(this,arguments)}}addListener(e,t){const r=this;if(n[e.__xhrid].xhrObject)return;n[e.__xhrid].xhrObject={xhr:e};const{ontimeout:o}=e;e.addEventListener("readystatechange",(()=>{window.performance&&n[e.__xhrid]&&(e.readyState===XMLHttpRequest.HEADERS_RECEIVED&&(n[e.__xhrid].startRequestAt=window.performance.now()),e.readyState===XMLHttpRequest.LOADING&&(n[e.__xhrid].startReceiveAt=window.performance.now()),e.readyState===XMLHttpRequest.DONE&&200===e.status&&(n[e.__xhrid].completedAt=window.performance.now(),this.onApiMeasured(Object.assign({},n[e.__xhrid]),[...t],this.traceIdKey)))})),e.addEventListener("loadend",(()=>{const{statusText:o,status:i,response:s}=e;let{payload:a,headers:c}=n[e.__xhrid];const u={statusText:o,payload:a,headers:c,status:i,response:s};if(0!==parseInt(i)&&(/^2[0-9]{1,3}/gi.test(i)||r.addAjaxError(u,[...t]),r.slowAPIThreshold)){const{startTime:o}=n[e.__xhrid],i=Date.now()-o;i>r.slowAPIThreshold&&r.addSlowApiLog(u,[...t],i)}})),e.addEventListener("error",(()=>{r.addAjaxError({networkError:!0,statusText:e.statusText||"network error"},[...t])})),e.ontimeout=(...n)=>{r.addAjaxError({networkError:!0,statusText:e.statusText},[...t]),o&&o.apply(this,n)}}addSlowApiLog(e,t,n){const o={etype:"SLOW_API_LOG",networkError:!1,status:e.statusText,statusCode:e.status,duration:n,request:{method:t[0],url:t[1]}};e.payload&&(o.payload=r(e.payload)),e.response&&(o.response=r(e.response)),e.headers&&(o.headers=r(e.headers)),this.storage.addLine(o)}addAjaxError(e,t){const n={etype:"API_ERROR",networkError:e.networkError||!1,status:e.statusText,statusCode:e.status,request:{method:t[0],url:t[1]}};e.payload&&(n.payload=r(e.payload)),e.response&&(n.response=r(e.response)),e.headers&&(n.headers=r(e.headers)),this.storage.addLine(n)}}const s=function(e){this.forms=e,this.probe()};function a(e,t,n){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return n}function c(e,t){!function(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object")}(e,t),t.add(e)}s.prototype.probe=function(){if(!window.fetch)return;const e=window.fetch;window.fetch=(t,n)=>{let r="GET",o=t||"";return"string"==typeof t?r=n&&n.method?n.method:r:"[object Request]"===Object.prototype.toString.call(t)&&(r=t.method||r,o=t.url||""),e(t,n).then((e=>{const t=`${e.status}`;return/^2[0-9]{1,3}/gi.test(t)||0==+t||this.forms.addLine({etype:"API_ERROR",msg:`status:${e.status}`,js:`${r} :${o}`}),e})).catch((e=>{let t;try{t=e&&e.message?e.message:JSON.stringify(e)}catch(n){t=e&&e.message?e.message:e}throw this.forms.addLine({etype:"API_ERROR",msg:t,js:`${r} :${o}`}),e}))}};var u=new WeakSet,d=new WeakSet,h=new WeakSet,f=new WeakSet;class l{constructor(e){c(this,f),c(this,h),c(this,d),c(this,u),this.storage=e,this.collectInterval=null,this.lastIndex=null,this.navigationPerfCollected=!1,window.performance&&(window.performance.getEntriesByType("navigation")[0].domComplete?a(this,u,p).call(this):window.addEventListener("load",(()=>{a(this,u,p).call(this)})))}addApiMeasureResult(e,t,n){const r=(e.completedAt-e.xhrOpenedAt).toFixed(2),o=(e.startReceiveAt-e.xhrOpenedAt).toFixed(2),i=(e.completedAt-e.startReceiveAt).toFixed(2),s=e.headers[n],a={etype:"PERF_LOG",entryType:"xmlhttprequest",entryName:t[1],startTime:e.xhrOpenedAt.toFixed(2),endTime:e.completedAt.toFixed(2),duration:r,ttfb:o,networkcost:i,traceIdKey:n,traceIdValue:s};this.storage.addLine(a)}}function p(){this.collectInterval=setInterval((()=>{a(this,d,m).call(this)}),1e3)}function m(){const e=performance.getEntries();this.navigationPerfCollected||(a(this,h,y).call(this,e.filter((e=>"navigation"===e.entryType))[0]),this.lastIndex=0),e.slice(this.lastIndex+1).forEach((e=>{if(!e.name.includes("api/mara/report"))if("resource"===e.entryType&&"xmlhttprequest"!==e.initiatorType){const t=Math.max(e.startTime,e.fetchStart).toFixed(2),n=e.responseEnd.toFixed(2);a(this,f,g).call(this,{entryType:e.entryType,name:e.name,startTime:t,endTime:n,duration:(n-t).toFixed(2)})}else["mark","measure"].includes(e.entryType)&&a(this,f,g).call(this,{entryType:e.entryType,name:e.name,startTime:e.startTime.toFixed(2),duration:e.duration.toFixed(2)})})),this.lastIndex=e.length-1}function y(e){this.navigationPerfCollected=!0;const t=(n=e,{entryType:e.entryType,name:"1.1.dnsLookup",startTime:n.domainLookupStart.toFixed(2),endTime:n.domainLookupEnd.toFixed(2),duration:(n.domainLookupEnd-n.domainLookupStart).toFixed(2)});var n;a(this,f,g).call(this,t);const r=(t=>({entryType:e.entryType,name:"1.2.tcpConnect",startTime:t.connectStart.toFixed(2),endTime:t.connectEnd.toFixed(2),duration:(t.connectEnd-t.connectStart).toFixed(2)}))(e);a(this,f,g).call(this,r);const o=(t=>({entryType:e.entryType,name:"1.3.requestForHTML",startTime:t.requestStart.toFixed(2),endTime:t.responseEnd.toFixed(2),duration:(t.responseEnd-t.requestStart).toFixed(2)}))(e);a(this,f,g).call(this,o);const i=(t=>{const n=t.responseEnd.toFixed(2),r=t.domContentLoadedEventEnd.toFixed(2);return{entryType:e.entryType,name:"1.4.documentLoad",startTime:n,endTime:r,duration:(r-n).toFixed(2)}})(e);a(this,f,g).call(this,i);const s=(t=>{const n=t.domContentLoadedEventEnd.toFixed(2),r=t.domComplete.toFixed(2);return{entryType:e.entryType,name:"1.5.domComplete",startTime:n,endTime:r,duration:(r-n).toFixed(2)}})(e);a(this,f,g).call(this,s);const c=(t=>{const n=t.domComplete.toFixed(2);return{entryType:e.entryType,name:"1.navigationTiming",startTime:0,endTime:n,duration:(n-0).toFixed(2)}})(e);a(this,f,g).call(this,c)}function g({entryType:e,name:t,startTime:n,endTime:r,duration:o}){const i={etype:"PERF_LOG",entryType:e,entryName:t,startTime:n,endTime:r,duration:o};this.storage.addLine(i)}var w,v=function(e,t){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}},_=Object.prototype.toString,E=(w=Object.create(null),function(e){var t=_.call(e);return w[t]||(w[t]=t.slice(8,-1).toLowerCase())});function T(e){return e=e.toLowerCase(),function(t){return E(t)===e}}function b(e){return Array.isArray(e)}function x(e){return void 0===e}var R=T("ArrayBuffer");function A(e){return null!==e&&"object"==typeof e}function O(e){if("object"!==E(e))return!1;var t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}var S=T("Date"),I=T("File"),C=T("Blob"),j=T("FileList");function P(e){return"[object Function]"===_.call(e)}var L=T("URLSearchParams");function B(e,t){if(null!=e)if("object"!=typeof e&&(e=[e]),b(e))for(var n=0,r=e.length;n<r;n++)t.call(null,e[n],n,e);else for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.call(null,e[o],o,e)}var N,D=(N="undefined"!=typeof Uint8Array&&Object.getPrototypeOf(Uint8Array),function(e){return N&&e instanceof N}),k={isArray:b,isArrayBuffer:R,isBuffer:function(e){return null!==e&&!x(e)&&null!==e.constructor&&!x(e.constructor)&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)},isFormData:function(e){var t="[object FormData]";return e&&("function"==typeof FormData&&e instanceof FormData||_.call(e)===t||P(e.toString)&&e.toString()===t)},isArrayBufferView:function(e){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&R(e.buffer)},isString:function(e){return"string"==typeof e},isNumber:function(e){return"number"==typeof e},isObject:A,isPlainObject:O,isUndefined:x,isDate:S,isFile:I,isBlob:C,isFunction:P,isStream:function(e){return A(e)&&P(e.pipe)},isURLSearchParams:L,isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},forEach:B,merge:function e(){var t={};function n(n,r){O(t[r])&&O(n)?t[r]=e(t[r],n):O(n)?t[r]=e({},n):b(n)?t[r]=n.slice():t[r]=n}for(var r=0,o=arguments.length;r<o;r++)B(arguments[r],n);return t},extend:function(e,t,n){return B(t,(function(t,r){e[r]=n&&"function"==typeof t?v(t,n):t})),e},trim:function(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")},stripBOM:function(e){return 65279===e.charCodeAt(0)&&(e=e.slice(1)),e},inherits:function(e,t,n,r){e.prototype=Object.create(t.prototype,r),e.prototype.constructor=e,n&&Object.assign(e.prototype,n)},toFlatObject:function(e,t,n){var r,o,i,s={};t=t||{};do{for(o=(r=Object.getOwnPropertyNames(e)).length;o-- >0;)s[i=r[o]]||(t[i]=e[i],s[i]=!0);e=Object.getPrototypeOf(e)}while(e&&(!n||n(e,t))&&e!==Object.prototype);return t},kindOf:E,kindOfTest:T,endsWith:function(e,t,n){e=String(e),(void 0===n||n>e.length)&&(n=e.length),n-=t.length;var r=e.indexOf(t,n);return-1!==r&&r===n},toArray:function(e){if(!e)return null;var t=e.length;if(x(t))return null;for(var n=new Array(t);t-- >0;)n[t]=e[t];return n},isTypedArray:D,isFileList:j};function F(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var U=function(e,t,n){if(!t)return e;var r;if(n)r=n(t);else if(k.isURLSearchParams(t))r=t.toString();else{var o=[];k.forEach(t,(function(e,t){null!=e&&(k.isArray(e)?t+="[]":e=[e],k.forEach(e,(function(e){k.isDate(e)?e=e.toISOString():k.isObject(e)&&(e=JSON.stringify(e)),o.push(F(t)+"="+F(e))})))})),r=o.join("&")}if(r){var i=e.indexOf("#");-1!==i&&(e=e.slice(0,i)),e+=(-1===e.indexOf("?")?"?":"&")+r}return e};function q(){this.handlers=[]}q.prototype.use=function(e,t,n){return this.handlers.push({fulfilled:e,rejected:t,synchronous:!!n&&n.synchronous,runWhen:n?n.runWhen:null}),this.handlers.length-1},q.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)},q.prototype.forEach=function(e){k.forEach(this.handlers,(function(t){null!==t&&e(t)}))};var M=q,H=function(e,t){k.forEach(e,(function(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])}))};function $(e,t,n,r,o){Error.call(this),this.message=e,this.name="AxiosError",t&&(this.code=t),n&&(this.config=n),r&&(this.request=r),o&&(this.response=o)}k.inherits($,Error,{toJSON:function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code,status:this.response&&this.response.status?this.response.status:null}}});var K=$.prototype,z={};["ERR_BAD_OPTION_VALUE","ERR_BAD_OPTION","ECONNABORTED","ETIMEDOUT","ERR_NETWORK","ERR_FR_TOO_MANY_REDIRECTS","ERR_DEPRECATED","ERR_BAD_RESPONSE","ERR_BAD_REQUEST","ERR_CANCELED"].forEach((function(e){z[e]={value:e}})),Object.defineProperties($,z),Object.defineProperty(K,"isAxiosError",{value:!0}),$.from=function(e,t,n,r,o,i){var s=Object.create(K);return k.toFlatObject(e,s,(function(e){return e!==Error.prototype})),$.call(s,e.message,t,n,r,o),s.name=e.name,i&&Object.assign(s,i),s};var W=$,J={silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1};var V=function(e,t){t=t||new FormData;var n=[];function r(e){return null===e?"":k.isDate(e)?e.toISOString():k.isArrayBuffer(e)||k.isTypedArray(e)?"function"==typeof Blob?new Blob([e]):Buffer.from(e):e}return function e(o,i){if(k.isPlainObject(o)||k.isArray(o)){if(-1!==n.indexOf(o))throw Error("Circular reference detected in "+i);n.push(o),k.forEach(o,(function(n,o){if(!k.isUndefined(n)){var s,a=i?i+"."+o:o;if(n&&!i&&"object"==typeof n)if(k.endsWith(o,"{}"))n=JSON.stringify(n);else if(k.endsWith(o,"[]")&&(s=k.toArray(n)))return void s.forEach((function(e){!k.isUndefined(e)&&t.append(a,r(e))}));e(n,a)}})),n.pop()}else t.append(i,r(o))}(e),t},X=k.isStandardBrowserEnv()?{write:function(e,t,n,r,o,i){var s=[];s.push(e+"="+encodeURIComponent(t)),k.isNumber(n)&&s.push("expires="+new Date(n).toGMTString()),k.isString(r)&&s.push("path="+r),k.isString(o)&&s.push("domain="+o),!0===i&&s.push("secure"),document.cookie=s.join("; ")},read:function(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function(e){this.write(e,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}},G=function(e,t){return e&&!/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t)?function(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}(e,t):t},Q=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"],Y=k.isStandardBrowserEnv()?function(){var e,t=/(msie|trident)/i.test(navigator.userAgent),n=document.createElement("a");function r(e){var r=e;return t&&(n.setAttribute("href",r),r=n.href),n.setAttribute("href",r),{href:n.href,protocol:n.protocol?n.protocol.replace(/:$/,""):"",host:n.host,search:n.search?n.search.replace(/^\?/,""):"",hash:n.hash?n.hash.replace(/^#/,""):"",hostname:n.hostname,port:n.port,pathname:"/"===n.pathname.charAt(0)?n.pathname:"/"+n.pathname}}return e=r(window.location.href),function(t){var n=k.isString(t)?r(t):t;return n.protocol===e.protocol&&n.host===e.host}}():function(){return!0};function Z(e){W.call(this,null==e?"canceled":e,W.ERR_CANCELED),this.name="CanceledError"}k.inherits(Z,W,{__CANCEL__:!0});var ee=Z,te=function(e){return new Promise((function(t,n){var r,o=e.data,i=e.headers,s=e.responseType;function a(){e.cancelToken&&e.cancelToken.unsubscribe(r),e.signal&&e.signal.removeEventListener("abort",r)}k.isFormData(o)&&k.isStandardBrowserEnv()&&delete i["Content-Type"];var c=new XMLHttpRequest;if(e.auth){var u=e.auth.username||"",d=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";i.Authorization="Basic "+btoa(u+":"+d)}var h=G(e.baseURL,e.url);function f(){if(c){var r,o,i,u,d,h="getAllResponseHeaders"in c?(r=c.getAllResponseHeaders(),d={},r?(k.forEach(r.split("\n"),(function(e){if(u=e.indexOf(":"),o=k.trim(e.substr(0,u)).toLowerCase(),i=k.trim(e.substr(u+1)),o){if(d[o]&&Q.indexOf(o)>=0)return;d[o]="set-cookie"===o?(d[o]?d[o]:[]).concat([i]):d[o]?d[o]+", "+i:i}})),d):d):null;!function(e,t,n){var r=n.config.validateStatus;n.status&&r&&!r(n.status)?t(new W("Request failed with status code "+n.status,[W.ERR_BAD_REQUEST,W.ERR_BAD_RESPONSE][Math.floor(n.status/100)-4],n.config,n.request,n)):e(n)}((function(e){t(e),a()}),(function(e){n(e),a()}),{data:s&&"text"!==s&&"json"!==s?c.response:c.responseText,status:c.status,statusText:c.statusText,headers:h,config:e,request:c}),c=null}}if(c.open(e.method.toUpperCase(),U(h,e.params,e.paramsSerializer),!0),c.timeout=e.timeout,"onloadend"in c?c.onloadend=f:c.onreadystatechange=function(){c&&4===c.readyState&&(0!==c.status||c.responseURL&&0===c.responseURL.indexOf("file:"))&&setTimeout(f)},c.onabort=function(){c&&(n(new W("Request aborted",W.ECONNABORTED,e,c)),c=null)},c.onerror=function(){n(new W("Network Error",W.ERR_NETWORK,e,c,c)),c=null},c.ontimeout=function(){var t=e.timeout?"timeout of "+e.timeout+"ms exceeded":"timeout exceeded",r=e.transitional||J;e.timeoutErrorMessage&&(t=e.timeoutErrorMessage),n(new W(t,r.clarifyTimeoutError?W.ETIMEDOUT:W.ECONNABORTED,e,c)),c=null},k.isStandardBrowserEnv()){var l=(e.withCredentials||Y(h))&&e.xsrfCookieName?X.read(e.xsrfCookieName):void 0;l&&(i[e.xsrfHeaderName]=l)}"setRequestHeader"in c&&k.forEach(i,(function(e,t){void 0===o&&"content-type"===t.toLowerCase()?delete i[t]:c.setRequestHeader(t,e)})),k.isUndefined(e.withCredentials)||(c.withCredentials=!!e.withCredentials),s&&"json"!==s&&(c.responseType=e.responseType),"function"==typeof e.onDownloadProgress&&c.addEventListener("progress",e.onDownloadProgress),"function"==typeof e.onUploadProgress&&c.upload&&c.upload.addEventListener("progress",e.onUploadProgress),(e.cancelToken||e.signal)&&(r=function(e){c&&(n(!e||e&&e.type?new ee:e),c.abort(),c=null)},e.cancelToken&&e.cancelToken.subscribe(r),e.signal&&(e.signal.aborted?r():e.signal.addEventListener("abort",r))),o||(o=null);var p,m=(p=/^([-+\w]{1,25})(:?\/\/|:)/.exec(h))&&p[1]||"";m&&-1===["http","https","file"].indexOf(m)?n(new W("Unsupported protocol "+m+":",W.ERR_BAD_REQUEST,e)):c.send(o)}))},ne={"Content-Type":"application/x-www-form-urlencoded"};function re(e,t){!k.isUndefined(e)&&k.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}var oe,ie={transitional:J,adapter:(("undefined"!=typeof XMLHttpRequest||"undefined"!=typeof process&&"[object process]"===Object.prototype.toString.call(process))&&(oe=te),oe),transformRequest:[function(e,t){if(H(t,"Accept"),H(t,"Content-Type"),k.isFormData(e)||k.isArrayBuffer(e)||k.isBuffer(e)||k.isStream(e)||k.isFile(e)||k.isBlob(e))return e;if(k.isArrayBufferView(e))return e.buffer;if(k.isURLSearchParams(e))return re(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString();var n,r=k.isObject(e),o=t&&t["Content-Type"];if((n=k.isFileList(e))||r&&"multipart/form-data"===o){var i=this.env&&this.env.FormData;return V(n?{"files[]":e}:e,i&&new i)}return r||"application/json"===o?(re(t,"application/json"),function(e,t,n){if(k.isString(e))try{return(t||JSON.parse)(e),k.trim(e)}catch(e){if("SyntaxError"!==e.name)throw e}return(n||JSON.stringify)(e)}(e)):e}],transformResponse:[function(e){var t=this.transitional||ie.transitional,n=t&&t.silentJSONParsing,r=t&&t.forcedJSONParsing,o=!n&&"json"===this.responseType;if(o||r&&k.isString(e)&&e.length)try{return JSON.parse(e)}catch(e){if(o){if("SyntaxError"===e.name)throw W.from(e,W.ERR_BAD_RESPONSE,this,null,this.response);throw e}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,env:{FormData:null},validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*"}}};k.forEach(["delete","get","head"],(function(e){ie.headers[e]={}})),k.forEach(["post","put","patch"],(function(e){ie.headers[e]=k.merge(ne)}));var se=ie,ae=function(e,t,n){var r=this||se;return k.forEach(n,(function(n){e=n.call(r,e,t)})),e},ce=function(e){return!(!e||!e.__CANCEL__)};function ue(e){if(e.cancelToken&&e.cancelToken.throwIfRequested(),e.signal&&e.signal.aborted)throw new ee}var de=function(e){return ue(e),e.headers=e.headers||{},e.data=ae.call(e,e.data,e.headers,e.transformRequest),e.headers=k.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),k.forEach(["delete","get","head","post","put","patch","common"],(function(t){delete e.headers[t]})),(e.adapter||se.adapter)(e).then((function(t){return ue(e),t.data=ae.call(e,t.data,t.headers,e.transformResponse),t}),(function(t){return ce(t)||(ue(e),t&&t.response&&(t.response.data=ae.call(e,t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)}))},he=function(e,t){t=t||{};var n={};function r(e,t){return k.isPlainObject(e)&&k.isPlainObject(t)?k.merge(e,t):k.isPlainObject(t)?k.merge({},t):k.isArray(t)?t.slice():t}function o(n){return k.isUndefined(t[n])?k.isUndefined(e[n])?void 0:r(void 0,e[n]):r(e[n],t[n])}function i(e){if(!k.isUndefined(t[e]))return r(void 0,t[e])}function s(n){return k.isUndefined(t[n])?k.isUndefined(e[n])?void 0:r(void 0,e[n]):r(void 0,t[n])}function a(n){return n in t?r(e[n],t[n]):n in e?r(void 0,e[n]):void 0}var c={url:i,method:i,data:i,baseURL:s,transformRequest:s,transformResponse:s,paramsSerializer:s,timeout:s,timeoutMessage:s,withCredentials:s,adapter:s,responseType:s,xsrfCookieName:s,xsrfHeaderName:s,onUploadProgress:s,onDownloadProgress:s,decompress:s,maxContentLength:s,maxBodyLength:s,beforeRedirect:s,transport:s,httpAgent:s,httpsAgent:s,cancelToken:s,socketPath:s,responseEncoding:s,validateStatus:a};return k.forEach(Object.keys(e).concat(Object.keys(t)),(function(e){var t=c[e]||o,r=t(e);k.isUndefined(r)&&t!==a||(n[e]=r)})),n},fe="0.27.2",le=fe,pe={};["object","boolean","number","function","string","symbol"].forEach((function(e,t){pe[e]=function(n){return typeof n===e||"a"+(t<1?"n ":" ")+e}}));var me={};pe.transitional=function(e,t,n){function r(e,t){return"[Axios v"+le+"] Transitional option '"+e+"'"+t+(n?". "+n:"")}return function(n,o,i){if(!1===e)throw new W(r(o," has been removed"+(t?" in "+t:"")),W.ERR_DEPRECATED);return t&&!me[o]&&(me[o]=!0,console.warn(r(o," has been deprecated since v"+t+" and will be removed in the near future"))),!e||e(n,o,i)}};var ye={assertOptions:function(e,t,n){if("object"!=typeof e)throw new W("options must be an object",W.ERR_BAD_OPTION_VALUE);for(var r=Object.keys(e),o=r.length;o-- >0;){var i=r[o],s=t[i];if(s){var a=e[i],c=void 0===a||s(a,i,e);if(!0!==c)throw new W("option "+i+" must be "+c,W.ERR_BAD_OPTION_VALUE)}else if(!0!==n)throw new W("Unknown option "+i,W.ERR_BAD_OPTION)}},validators:pe},ge=ye.validators;function we(e){this.defaults=e,this.interceptors={request:new M,response:new M}}we.prototype.request=function(e,t){"string"==typeof e?(t=t||{}).url=e:t=e||{},(t=he(this.defaults,t)).method?t.method=t.method.toLowerCase():this.defaults.method?t.method=this.defaults.method.toLowerCase():t.method="get";var n=t.transitional;void 0!==n&&ye.assertOptions(n,{silentJSONParsing:ge.transitional(ge.boolean),forcedJSONParsing:ge.transitional(ge.boolean),clarifyTimeoutError:ge.transitional(ge.boolean)},!1);var r=[],o=!0;this.interceptors.request.forEach((function(e){"function"==typeof e.runWhen&&!1===e.runWhen(t)||(o=o&&e.synchronous,r.unshift(e.fulfilled,e.rejected))}));var i,s=[];if(this.interceptors.response.forEach((function(e){s.push(e.fulfilled,e.rejected)})),!o){var a=[de,void 0];for(Array.prototype.unshift.apply(a,r),a=a.concat(s),i=Promise.resolve(t);a.length;)i=i.then(a.shift(),a.shift());return i}for(var c=t;r.length;){var u=r.shift(),d=r.shift();try{c=u(c)}catch(e){d(e);break}}try{i=de(c)}catch(e){return Promise.reject(e)}for(;s.length;)i=i.then(s.shift(),s.shift());return i},we.prototype.getUri=function(e){e=he(this.defaults,e);var t=G(e.baseURL,e.url);return U(t,e.params,e.paramsSerializer)},k.forEach(["delete","get","head","options"],(function(e){we.prototype[e]=function(t,n){return this.request(he(n||{},{method:e,url:t,data:(n||{}).data}))}})),k.forEach(["post","put","patch"],(function(e){function t(t){return function(n,r,o){return this.request(he(o||{},{method:e,headers:t?{"Content-Type":"multipart/form-data"}:{},url:n,data:r}))}}we.prototype[e]=t(),we.prototype[e+"Form"]=t(!0)}));var ve=we;function _e(e){if("function"!=typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise((function(e){t=e}));var n=this;this.promise.then((function(e){if(n._listeners){var t,r=n._listeners.length;for(t=0;t<r;t++)n._listeners[t](e);n._listeners=null}})),this.promise.then=function(e){var t,r=new Promise((function(e){n.subscribe(e),t=e})).then(e);return r.cancel=function(){n.unsubscribe(t)},r},e((function(e){n.reason||(n.reason=new ee(e),t(n.reason))}))}_e.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},_e.prototype.subscribe=function(e){this.reason?e(this.reason):this._listeners?this._listeners.push(e):this._listeners=[e]},_e.prototype.unsubscribe=function(e){if(this._listeners){var t=this._listeners.indexOf(e);-1!==t&&this._listeners.splice(t,1)}},_e.source=function(){var e;return{token:new _e((function(t){e=t})),cancel:e}};var Ee=_e;var Te=function e(t){var n=new ve(t),r=v(ve.prototype.request,n);return k.extend(r,ve.prototype,n),k.extend(r,n),r.create=function(n){return e(he(t,n))},r}(se);Te.Axios=ve,Te.CanceledError=ee,Te.CancelToken=Ee,Te.isCancel=ce,Te.VERSION=fe,Te.toFormData=V,Te.AxiosError=W,Te.Cancel=Te.CanceledError,Te.all=function(e){return Promise.all(e)},Te.spread=function(e){return function(t){return e.apply(null,t)}},Te.isAxiosError=function(e){return k.isObject(e)&&!0===e.isAxiosError};var be=Te,xe=Te;be.default=xe;var Re=be,Ae="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function Oe(e){if(e.__esModule)return e;var t=Object.defineProperty({},"__esModule",{value:!0});return Object.keys(e).forEach((function(n){var r=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(t,n,r.get?r:{enumerable:!0,get:function(){return e[n]}})})),t}function Se(e){var t={exports:{}};return e(t,t.exports),t.exports}var Ie=Oe({__proto__:null,default:{}}),Ce=Se((function(e,t){var n;e.exports=(n=n||function(e,t){var n;if("undefined"!=typeof window&&window.crypto&&(n=window.crypto),"undefined"!=typeof self&&self.crypto&&(n=self.crypto),"undefined"!=typeof globalThis&&globalThis.crypto&&(n=globalThis.crypto),!n&&"undefined"!=typeof window&&window.msCrypto&&(n=window.msCrypto),!n&&void 0!==Ae&&Ae.crypto&&(n=Ae.crypto),!n&&"function"==typeof require)try{n=Ie}catch(e){}var r=function(){if(n){if("function"==typeof n.getRandomValues)try{return n.getRandomValues(new Uint32Array(1))[0]}catch(e){}if("function"==typeof n.randomBytes)try{return n.randomBytes(4).readInt32LE()}catch(e){}}throw new Error("Native crypto module could not be used to get secure random number.")},o=Object.create||function(){function e(){}return function(t){var n;return e.prototype=t,n=new e,e.prototype=null,n}}(),i={},s=i.lib={},a=s.Base={extend:function(e){var t=o(this);return e&&t.mixIn(e),t.hasOwnProperty("init")&&this.init!==t.init||(t.init=function(){t.$super.init.apply(this,arguments)}),t.init.prototype=t,t.$super=this,t},create:function(){var e=this.extend();return e.init.apply(e,arguments),e},init:function(){},mixIn:function(e){for(var t in e)e.hasOwnProperty(t)&&(this[t]=e[t]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.init.prototype.extend(this)}},c=s.WordArray=a.extend({init:function(e,n){e=this.words=e||[],this.sigBytes=n!=t?n:4*e.length},toString:function(e){return(e||d).stringify(this)},concat:function(e){var t=this.words,n=e.words,r=this.sigBytes,o=e.sigBytes;if(this.clamp(),r%4)for(var i=0;i<o;i++){var s=n[i>>>2]>>>24-i%4*8&255;t[r+i>>>2]|=s<<24-(r+i)%4*8}else for(var a=0;a<o;a+=4)t[r+a>>>2]=n[a>>>2];return this.sigBytes+=o,this},clamp:function(){var t=this.words,n=this.sigBytes;t[n>>>2]&=4294967295<<32-n%4*8,t.length=e.ceil(n/4)},clone:function(){var e=a.clone.call(this);return e.words=this.words.slice(0),e},random:function(e){for(var t=[],n=0;n<e;n+=4)t.push(r());return new c.init(t,e)}}),u=i.enc={},d=u.Hex={stringify:function(e){for(var t=e.words,n=e.sigBytes,r=[],o=0;o<n;o++){var i=t[o>>>2]>>>24-o%4*8&255;r.push((i>>>4).toString(16)),r.push((15&i).toString(16))}return r.join("")},parse:function(e){for(var t=e.length,n=[],r=0;r<t;r+=2)n[r>>>3]|=parseInt(e.substr(r,2),16)<<24-r%8*4;return new c.init(n,t/2)}},h=u.Latin1={stringify:function(e){for(var t=e.words,n=e.sigBytes,r=[],o=0;o<n;o++){var i=t[o>>>2]>>>24-o%4*8&255;r.push(String.fromCharCode(i))}return r.join("")},parse:function(e){for(var t=e.length,n=[],r=0;r<t;r++)n[r>>>2]|=(255&e.charCodeAt(r))<<24-r%4*8;return new c.init(n,t)}},f=u.Utf8={stringify:function(e){try{return decodeURIComponent(escape(h.stringify(e)))}catch(e){throw new Error("Malformed UTF-8 data")}},parse:function(e){return h.parse(unescape(encodeURIComponent(e)))}},l=s.BufferedBlockAlgorithm=a.extend({reset:function(){this._data=new c.init,this._nDataBytes=0},_append:function(e){"string"==typeof e&&(e=f.parse(e)),this._data.concat(e),this._nDataBytes+=e.sigBytes},_process:function(t){var n,r=this._data,o=r.words,i=r.sigBytes,s=this.blockSize,a=i/(4*s),u=(a=t?e.ceil(a):e.max((0|a)-this._minBufferSize,0))*s,d=e.min(4*u,i);if(u){for(var h=0;h<u;h+=s)this._doProcessBlock(o,h);n=o.splice(0,u),r.sigBytes-=d}return new c.init(n,d)},clone:function(){var e=a.clone.call(this);return e._data=this._data.clone(),e},_minBufferSize:0});s.Hasher=l.extend({cfg:a.extend(),init:function(e){this.cfg=this.cfg.extend(e),this.reset()},reset:function(){l.reset.call(this),this._doReset()},update:function(e){return this._append(e),this._process(),this},finalize:function(e){return e&&this._append(e),this._doFinalize()},blockSize:16,_createHelper:function(e){return function(t,n){return new e.init(n).finalize(t)}},_createHmacHelper:function(e){return function(t,n){return new p.HMAC.init(e,n).finalize(t)}}});var p=i.algo={};return i}(Math),n)})),je=Se((function(e,t){var n;e.exports=(n=Ce,function(e){var t=n,r=t.lib,o=r.WordArray,i=r.Hasher,s=t.algo,a=[];!function(){for(var t=0;t<64;t++)a[t]=4294967296*e.abs(e.sin(t+1))|0}();var c=s.MD5=i.extend({_doReset:function(){this._hash=new o.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(e,t){for(var n=0;n<16;n++){var r=t+n,o=e[r];e[r]=16711935&(o<<8|o>>>24)|4278255360&(o<<24|o>>>8)}var i=this._hash.words,s=e[t+0],c=e[t+1],l=e[t+2],p=e[t+3],m=e[t+4],y=e[t+5],g=e[t+6],w=e[t+7],v=e[t+8],_=e[t+9],E=e[t+10],T=e[t+11],b=e[t+12],x=e[t+13],R=e[t+14],A=e[t+15],O=i[0],S=i[1],I=i[2],C=i[3];O=u(O,S,I,C,s,7,a[0]),C=u(C,O,S,I,c,12,a[1]),I=u(I,C,O,S,l,17,a[2]),S=u(S,I,C,O,p,22,a[3]),O=u(O,S,I,C,m,7,a[4]),C=u(C,O,S,I,y,12,a[5]),I=u(I,C,O,S,g,17,a[6]),S=u(S,I,C,O,w,22,a[7]),O=u(O,S,I,C,v,7,a[8]),C=u(C,O,S,I,_,12,a[9]),I=u(I,C,O,S,E,17,a[10]),S=u(S,I,C,O,T,22,a[11]),O=u(O,S,I,C,b,7,a[12]),C=u(C,O,S,I,x,12,a[13]),I=u(I,C,O,S,R,17,a[14]),O=d(O,S=u(S,I,C,O,A,22,a[15]),I,C,c,5,a[16]),C=d(C,O,S,I,g,9,a[17]),I=d(I,C,O,S,T,14,a[18]),S=d(S,I,C,O,s,20,a[19]),O=d(O,S,I,C,y,5,a[20]),C=d(C,O,S,I,E,9,a[21]),I=d(I,C,O,S,A,14,a[22]),S=d(S,I,C,O,m,20,a[23]),O=d(O,S,I,C,_,5,a[24]),C=d(C,O,S,I,R,9,a[25]),I=d(I,C,O,S,p,14,a[26]),S=d(S,I,C,O,v,20,a[27]),O=d(O,S,I,C,x,5,a[28]),C=d(C,O,S,I,l,9,a[29]),I=d(I,C,O,S,w,14,a[30]),O=h(O,S=d(S,I,C,O,b,20,a[31]),I,C,y,4,a[32]),C=h(C,O,S,I,v,11,a[33]),I=h(I,C,O,S,T,16,a[34]),S=h(S,I,C,O,R,23,a[35]),O=h(O,S,I,C,c,4,a[36]),C=h(C,O,S,I,m,11,a[37]),I=h(I,C,O,S,w,16,a[38]),S=h(S,I,C,O,E,23,a[39]),O=h(O,S,I,C,x,4,a[40]),C=h(C,O,S,I,s,11,a[41]),I=h(I,C,O,S,p,16,a[42]),S=h(S,I,C,O,g,23,a[43]),O=h(O,S,I,C,_,4,a[44]),C=h(C,O,S,I,b,11,a[45]),I=h(I,C,O,S,A,16,a[46]),O=f(O,S=h(S,I,C,O,l,23,a[47]),I,C,s,6,a[48]),C=f(C,O,S,I,w,10,a[49]),I=f(I,C,O,S,R,15,a[50]),S=f(S,I,C,O,y,21,a[51]),O=f(O,S,I,C,b,6,a[52]),C=f(C,O,S,I,p,10,a[53]),I=f(I,C,O,S,E,15,a[54]),S=f(S,I,C,O,c,21,a[55]),O=f(O,S,I,C,v,6,a[56]),C=f(C,O,S,I,A,10,a[57]),I=f(I,C,O,S,g,15,a[58]),S=f(S,I,C,O,x,21,a[59]),O=f(O,S,I,C,m,6,a[60]),C=f(C,O,S,I,T,10,a[61]),I=f(I,C,O,S,l,15,a[62]),S=f(S,I,C,O,_,21,a[63]),i[0]=i[0]+O|0,i[1]=i[1]+S|0,i[2]=i[2]+I|0,i[3]=i[3]+C|0},_doFinalize:function(){var t=this._data,n=t.words,r=8*this._nDataBytes,o=8*t.sigBytes;n[o>>>5]|=128<<24-o%32;var i=e.floor(r/4294967296),s=r;n[15+(o+64>>>9<<4)]=16711935&(i<<8|i>>>24)|4278255360&(i<<24|i>>>8),n[14+(o+64>>>9<<4)]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),t.sigBytes=4*(n.length+1),this._process();for(var a=this._hash,c=a.words,u=0;u<4;u++){var d=c[u];c[u]=16711935&(d<<8|d>>>24)|4278255360&(d<<24|d>>>8)}return a},clone:function(){var e=i.clone.call(this);return e._hash=this._hash.clone(),e}});function u(e,t,n,r,o,i,s){var a=e+(t&n|~t&r)+o+s;return(a<<i|a>>>32-i)+t}function d(e,t,n,r,o,i,s){var a=e+(t&r|n&~r)+o+s;return(a<<i|a>>>32-i)+t}function h(e,t,n,r,o,i,s){var a=e+(t^n^r)+o+s;return(a<<i|a>>>32-i)+t}function f(e,t,n,r,o,i,s){var a=e+(n^(t|~r))+o+s;return(a<<i|a>>>32-i)+t}t.MD5=i._createHelper(c),t.HmacMD5=i._createHmacHelper(c)}(Math),n.MD5)}));const Pe=(e,t,n,r,o)=>{let i,s;"prod"===e?(i="https://m7-hlgw-c1-openapi.longfor.com/julianos-prod/",s="a2e33eb4-6516-43f9-bcc0-9c47b0f123b3"):(i="//api-uat.longfor.com/julianos-uat/",s="791f6690-0714-445f-9273-78a3199622d2");const a={"X-Gaia-Api-Key":s},c=(new Date).getTime(),u=(e=>{const t=e=>e>=65&&e<91||e>=97&&e<123,n=e.toString().split("");let r="",o=0;for(;o<13;){const e=n[o],i=`${e}${n[o+1]}`,s=`${i}${n[o+2]}`;0!==parseInt(e)?t(parseInt(i))?(r+=String.fromCharCode(i),o+=2):t(parseInt(s))?(r+=String.fromCharCode(s),o+=3):(r+=e,o++):(r=`${r}${e}`,o++)}return r.split("").reverse().join("")})(c),d=((e,t)=>je(`${e}${t}`).toString())(o.appid,c);o.appid&&(a["x-mara-signature"]=d,a["x-mara-slug"]=u,a["x-mara-app-name"]=o.appname);return{method:t,url:`${i}${n}`,withCredentials:!0,headers:a,data:r}};var Le=new WeakSet,Be=new WeakSet,Ne=new WeakSet,De=new WeakSet;class ke{constructor(e,t,n,r){if(c(this,De),c(this,Ne),c(this,Be),c(this,Le),ke.instance)return ke.instance;this.__pool__=[],this.appname=e,this.appid=t,this.sessionId=n,this.env=r,this.userid=null,a(this,Le,Fe).call(this),ke.instance=this}setUser(e){this.userid||(this.userid=e)}addLine(e){setTimeout((()=>{this.__pool__.push(Object.assign(a(this,De,Me).call(this),e))}),0)}}function Fe(){setInterval(a(this,Ne,qe).bind(this),1e3)}function Ue(){let e=[];if("prod"===this.env)e=this.__pool__,this.__pool__=[];else if(this.__pool__.length>5)for(let t=0;t<5;t++)e.push(this.__pool__.shift());else e=this.__pool__,this.__pool__=[];return e}function qe(){if(!this.userid)return;const e=a(this,Be,Ue).call(this);if(e.length){const t="api/mara/report",n=Pe(this.env,"post",t,e.map((e=>(e.user=this.userid,e))),{appname:this.appname,appid:this.appid});Re(n)}}function Me(){let e;try{e=(new Date).toLocaleString("zh-CN",{timeZone:"Asia/Shanghai"})}catch(t){e=(new Date).toLocaleString()}return Object.assign({},{localeTime:e,"@timestamp":Date.now(),ua:navigator.userAgent,url:location?location.href:"",appname:this.appname,sessionId:this.sessionId})}ke.instance=null;return class{constructor(e,n,{env:r="uat",autoTraceId:o=!1,traceIdKey:i="x-mara-trace-id",slowAPIThreshold:s=0,sessionIdKey:a="x-mara-session-id"}){this.checkParams(e,n),this.appname=e,this.appid=n,this.env=r,this.autoTraceId=o,this.autoTraceId&&(this.traceIdKey=i,this.sessionIdKey=a),this.slowAPIThreshold=s,this.userid=null,this.sessionId=t(16),this.init()}checkParams(e,t){if(!e)throw Error("appname 必传");if(!t)throw Error("appid 必传")}init(){this.storage=new ke(this.appname,this.appid,this.sessionId,this.env),this.performance=new l(this.storage),new e(this.storage),new i(this.storage,{slowAPIThreshold:this.slowAPIThreshold,autoTraceId:this.autoTraceId,traceIdKey:this.traceIdKey,slowAPIThreshold:this.slowAPIThreshold,sessionId:this.sessionId,sessionIdKey:this.sessionIdKey,onApiMeasured:this.performance.addApiMeasureResult}),new s(this.storage)}setUser(e){this.storage.setUser(e)}probe(e,...t){e&&("object"==typeof t&&(t=JSON.stringify(t,null,2)),this.storage.addLine({etype:"RT_LOG",eventTag:e,message:t}))}}}));
