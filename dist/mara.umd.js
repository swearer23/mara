!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("nanoid"),require("axios"),require("crypto-js")):"function"==typeof define&&define.amd?define(["nanoid","axios","crypto-js"],e):(t="undefined"!=typeof globalThis?globalThis:t||self).Mara=e(t.nanoid,t.axios,t.CryptoJS)}(this,(function(t,e,s){"use strict";function n(t){return t&&"object"==typeof t&&"default"in t?t.default:t}var o=n(e),i=n(s);class r{constructor(t){this.storage=t,this.probe()}probe(){const{onerror:t}=window;window.onerror=(...e)=>{"function"==typeof t&&t.apply(this,e),this.pushLine(e[0],e[1],e[2],e[3],e[4])}}pushLine(t,e,s,n,o){return this.storage.addLine({etype:"JS_ERROR",message:`${t} \n ${o&&o.stack}`,js:`${e}:${s}:${n}`}),!0}}const a={},d=t=>{try{return JSON.stringify(t,null,2)}catch(t){return"not_serializable"}};class p{constructor(t){this.storage=t,this.probe()}probe(){const e=this,{open:s,send:n,setRequestHeader:o}=XMLHttpRequest.prototype;XMLHttpRequest.prototype.open=function(){this.__xhrid=t.nanoid(),a[this.__xhrid]={headers:{},payload:{},response:{},xhrObject:null},e.addListener(this,arguments),s.apply(this,arguments)},XMLHttpRequest.prototype.setRequestHeader=function(){if(!this.__xhrid)return o.apply(this,arguments);const[t,e]=[...arguments];a[this.__xhrid].headers[t]=e,o.apply(this,arguments)},XMLHttpRequest.prototype.send=function(){if(!this.__xhrid)return n.apply(this,arguments);a[this.__xhrid].payload=[...arguments],n.apply(this,arguments)}}addListener(t,e){const s=this;if(a[t.__xhrid].xhrObject)return;a[t.__xhrid].xhrObject={xhr:t};const{ontimeout:n}=t;t.addEventListener("loadend",(()=>{const{statusText:n,status:o,response:i}=t;let{payload:r,headers:d}=a[t.__xhrid];const p={statusText:n,payload:r,headers:d,status:o,response:i};0!==parseInt(o)&&(/^2[0-9]{1,3}/gi.test(o)||s.addAjaxError(p,[...e]))})),t.addEventListener("error",(()=>{s.addAjaxError({networkError:!0,statusText:t.statusText||"network error"},[...e])})),t.ontimeout=(...o)=>{s.addAjaxError({networkError:!0,statusText:t.statusText},[...e]),n&&n.apply(this,o)}}addAjaxError(t,e){const s={etype:"API_ERROR",networkError:t.networkError||!1,status:t.statusText,statusCode:t.status,request:{method:e[0],url:e[1]}};t.payload&&(s.payload=d(t.payload)),t.response&&(s.response=d(t.response)),t.headers&&(s.headers=d(t.headers)),this.storage.addLine(s)}}const h=function(t){this.forms=t,this.probe()};h.prototype.probe=function(){if(!window.fetch)return;const t=window.fetch;window.fetch=(e,s)=>{let n="GET",o=e||"";return"string"==typeof e?n=s&&s.method?s.method:n:"[object Request]"===Object.prototype.toString.call(e)&&(n=e.method||n,o=e.url||""),t(e,s).then((t=>{const e=`${t.status}`;return/^2[0-9]{1,3}/gi.test(e)||0==+e||this.forms.addLine({etype:"API_ERROR",msg:`status:${t.status}`,js:`${n} :${o}`}),t})).catch((t=>{let e;try{e=t&&t.message?t.message:JSON.stringify(t)}catch(s){e=t&&t.message?t.message:t}throw this.forms.addLine({etype:"API_ERROR",msg:e,js:`${n} :${o}`}),t}))}};class c{constructor(t){this.storage=t,this.collectInterval=null,this.lastIndex=null,this.navigationPerfCollected=!1,window.performance&&(window.performance.getEntriesByType("navigation")[0].domComplete?this.#t():window.addEventListener("load",(()=>{this.#t()})))}#t(){this.collectInterval=setInterval((()=>{this.#e()}),1e3)}#e(){const t=performance.getEntries();this.navigationPerfCollected||(this.#s(t.filter((t=>"navigation"===t.entryType))[0]),this.lastIndex=0),t.slice(this.lastIndex+1).forEach((t=>{if(!t.name.includes("api/mara/report")&&"resource"===t.entryType){console.log(t.initiatorType);const e=Math.max(t.startTime,t.fetchStart).toFixed(2),s=t.responseEnd.toFixed(2);this.#n({entryType:t.entryType,name:t.name,startTime:e,endTime:s,duration:(s-e).toFixed(2)})}})),this.lastIndex=t.length-1}#s(t){this.navigationPerfCollected=!0;const e=(s=t,{entryType:t.entryType,name:"1.1.dnsLookup",startTime:s.domainLookupStart.toFixed(2),endTime:s.domainLookupEnd.toFixed(2),duration:(s.domainLookupEnd-s.domainLookupStart).toFixed(2)});var s;this.#n(e);const n=(e=>({entryType:t.entryType,name:"1.2.tcpConnect",startTime:e.connectStart.toFixed(2),endTime:e.connectEnd.toFixed(2),duration:(e.connectStart-e.connectEnd).toFixed(2)}))(t);this.#n(n);const o=(e=>({entryType:t.entryType,name:"1.3.requestForHTML",startTime:e.requestStart.toFixed(2),endTime:e.responseEnd.toFixed(2),duration:(e.responseEnd-e.requestStart).toFixed(2)}))(t);this.#n(o);const i=(e=>{const s=e.responseEnd.toFixed(2),n=e.domContentLoadedEventEnd.toFixed(2);return{entryType:t.entryType,name:"1.4.documentLoad",startTime:s,endTime:n,duration:(n-s).toFixed(2)}})(t);this.#n(i);const r=(e=>{const s=e.domContentLoadedEventEnd.toFixed(2),n=e.domComplete.toFixed(2);return{entryType:t.entryType,name:"1.5.domComplete",startTime:s,endTime:n,duration:(n-s).toFixed(2)}})(t);this.#n(r);const a=(e=>{const s=e.domComplete.toFixed(2);return{entryType:t.entryType,name:"1.navigationTiming",startTime:0,endTime:s,duration:(s-0).toFixed(2)}})(t);this.#n(a)}#n({entryType:t,name:e,startTime:s,endTime:n,duration:o}){const i={etype:"PERF_LOG",entryType:t,name:e,startTime:s,endTime:n,duration:o};this.storage.addLine(i)}}const l=(t,e,s,n,o)=>{let r,a;"prod"===t?(r="https://m7-hlgw-c1-openapi.longfor.com/julianos-prod/",a="a2e33eb4-6516-43f9-bcc0-9c47b0f123b3"):(r="//api-uat.longfor.com/julianos-uat/",a="791f6690-0714-445f-9273-78a3199622d2");const d={"X-Gaia-Api-Key":a},p=(new Date).getTime(),h=(t=>{const e=t=>t>=65&&t<91||t>=97&&t<123,s=t.toString().split("");let n="",o=0;for(;o<13;){const t=s[o],i=`${t}${s[o+1]}`,r=`${i}${s[o+2]}`;0!==parseInt(t)?e(parseInt(i))?(n+=String.fromCharCode(i),o+=2):e(parseInt(r))?(n+=String.fromCharCode(r),o+=3):(n+=t,o++):(n=`${n}${t}`,o++)}return n.split("").reverse().join("")})(p),c=((t,e)=>i.MD5(`${t}${e}`).toString())(o.appid,p);o.appid&&(d["x-mara-signature"]=c,d["x-mara-slug"]=h,d["x-mara-app-name"]=o.appname);return{method:e,url:`${r}${s}`,withCredentials:!0,headers:d,data:n}};class u{constructor(t,e,s){if(u.instance)return u.instance;this.__pool__=[],this.appname=t,this.appid=e,this.sessionId=s,this.userid=null,this.#o(),u.instance=this}#o(){setInterval(this.#i.bind(this),1e3)}#r(){let t=[];if(this.__pool__.length>5)for(let e=0;e<5;e++)t.push(this.__pool__.shift());else t=this.__pool__,this.__pool__=[];return t}#i(){if(!this.userid)return;const t=this.#r();if(t.length){const e="api/mara/report",s=l(this.env,"post",e,t.map((t=>(t.user=this.userid,t))),{appname:this.appname,appid:this.appid});o(s)}}#a(){let t;try{t=(new Date).toLocaleString("zh-CN",{timeZone:"Asia/Shanghai"})}catch(e){t=(new Date).toLocaleString()}return Object.assign({},{localeTime:t,"@timestamp":Date.now(),ua:navigator.userAgent,url:location?location.href:"",appname:this.appname,sessionId:this.sessionId})}setUser(t){this.userid||(this.userid=t)}addLine(t){setTimeout((()=>{this.__pool__.push(Object.assign(this.#a(),t))}),0)}}u.instance=null;return class{constructor(e,s,n={env:"uat"}){this.checkParams(e,s),this.appname=e,this.appid=s,this.env=n.env,this.userid=null,this.sessionId=t.nanoid(16),this.init()}checkParams(t,e){if(!t)throw Error("appname 必传");if(!e)throw Error("appid 必传")}init(){this.storage=new u(this.appname,this.appid,this.sessionId),new r(this.storage),new p(this.storage),new h(this.storage),new c(this.storage)}setUser(t){this.storage.setUser(t)}probe(t,...e){t&&("object"!=typeof msg&&(e=JSON.stringify(e,null,2)),this.storage.addLine({etype:"RT_LOG",eventTag:t,message:e}))}}}));
