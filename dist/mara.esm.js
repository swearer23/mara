import{nanoid as t}from"nanoid";import e from"file-saver";import o from"sweetalert2";let n;const i={qq:/\bm?qqbrowser\/([0-9.]+)/,360:t=>-1!==t.indexOf("360 aphone browser")?/\b360 aphone browser \(([^\)]+)\)/:/\b360(?:se|ee|chrome|browser)\b/,aoyou:/\baoyou/,webview:/\bcpu(?: iphone)? os (?:[0-9._]+).+\bapplewebkit\b/,firefox:/\bfirefox\/([0-9.ab]+)/,chrome:/ (?:chrome|crios|crmo)\/([0-9.]+)/,ie:/\b(?:msie |ie |trident\/[0-9].*rv[ :])([0-9.]+)/,android:t=>-1===t.indexOf("android")?"":/\bversion\/([0-9.]+(?: beta)?)/,safari:/\bversion\/([0-9.]+(?: beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\//,opera:/\bopera/,unknow:"unknow"},s={windows:/\bwindows nt ([0-9.]+)/,macosx:/\bmac os x ([0-9._]+)/,linux:"linux",wphone:t=>-1!==t.indexOf("windows phone ")?/\bwindows phone (?:os )?([0-9.]+)/:-1!==t.indexOf("xblwp")?/\bxblwp([0-9.]+)/:-1!==t.indexOf("zunewp")?/\bzunewp([0-9.]+)/:"windows phone",ios:t=>/\bcpu(?: iphone)? os /.test(t)?/\bcpu(?: iphone)? os ([0-9._]+)/:-1!==t.indexOf("iph os ")?/\biph os ([0-9_]+)/:/\bios\b/,android:t=>t.indexOf("android")>=0?/\bandroid[ \/-]?([0-9.x]+)?/:t.indexOf("adr")>=0?t.indexOf("mqqbrowser")>=0?/\badr[ ]\(linux; u; ([0-9.]+)?/:/\badr(?:[ ]([0-9.]+))?/:"android",unknow:"unknow"},r={weixin:/micromessenger/gi,qqvideo:/qqlivebrowser/gi,qqvideoipad:/qqlivehdbrowser/gi,shouqq:/qq\//gi,qqnews:/qqnews/gi,qzone:/qzone\//gi,unknow:"unknow"},a=(t,e)=>Object.prototype.toString.call(t)===`[object ${e}]`,h=(t,e)=>{const o=u[t.toLowerCase()];for(const t in e){const n=e[t],i=a(n,"Function")?n(c()):n;if(o.name=t,!0===i)break;if("[object String]"===toString(i)){if(-1!==c().indexOf(i))break}else if(a(i,"Object")){if(void 0!==i.version){o.version=i.version;break}}else if(i&&i.exec){const t=i.exec(c());if(t){t.length>=2&&t[1]?o.version=t[1].replace(/_/g,"."):o.version="0.0.0";break}}}return o},c=()=>{if(!n){const t="__",e=navigator.userAgent||"",o=navigator.platform||"",i=navigator.appVersion||"",s=navigator.vendor||"";n=e+t+o+t+i+t+s,n=n.toLowerCase()}return n},p=t=>{n||(h("os",s),h("platform",r),h("browser",i));return"all"===t||"full"===t?c():void 0!==t?u[t].name:`${u.os.name}  _${u.os.version}  ${u.browser.name}  _${u.browser.version}`},u={os:{name:"unknow",version:"0.0.0"},platform:{name:"unknow",version:"0.0.0"},browser:{name:"unknow",version:"0.0.0"}},l=(...t)=>{const e=t[0],o=Array.prototype.slice.call(t,1);for(let t=0;t<o.length;t++){const n=o[t];for(const t in n)e[t]=n[t]}return e},d=t=>{if(!t)return!0;if(!t.length)return!0;let e=0;for(let o=t.length-1;o>0;o--)t[o]||(e+=1);return e>t.length-1},f=t=>{const e="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";t=t||9;let o="";for(let n=0;n<t;n++)o+=e.charAt(Math.floor(Math.random()*e.length));return o};class m{constructor(){if(m.instance)return m.instance;this.__pool__={},m.instance=this}setItem(t,e){this.__pool__[t]=e}getItem(t){return this.__pool__[t]}remove(t){this.__pool__[t]=null}}m.instance=null;const w=new m,g=t=>0===t.indexOf("csijs_")?t:"csijs_"+t,b=(t,e,o)=>{"object"==typeof e&&(e=o?e:(t=>{try{return JSON.stringify(t)}catch(e){return t}})(e)),((t,e)=>{try{w.setItem(t,e)}catch(t){console.error(t)}})(g(t),e)},y=(t,e)=>{const o=(t=>w.getItem?w.getItem(t):null)(g(t));return o?e?o:(t=>{try{return JSON.parse(t)}catch(e){return t}})(o):null},x=t=>{(t=>{try{w&&w.removeItem(t)}catch(t){}})(g(t))},_=()=>{const t=y("info"),e=[],o=t?t.length:0;if(t&&o){const o=parseInt(t.max,10);for(let n=parseInt(t.min,10);n<=o;n++){const o=`${t.type}_${n}`,i=y(o);e.push(i)}}return e};function v(t){this.csiReport=t}function q(t){this.csi=t,this.tapQueue=[]}v.prototype.createPage=function(){const n=_();d(n)?o.fire({title:"暂无异常",text:"稍后窗口会自动关闭",icon:"success",heightAuto:!1,timer:2e3}):o.fire({title:"收集完成",text:`收集到${n.length}条日志，点击下方按钮下载日志`,icon:"success",heightAuto:!1,showConfirmButton:!0,confirmButtonText:"下载",showCancelButton:!0,cancelButtonText:"关闭",preConfirm:()=>{const o=_().map((t=>`${JSON.stringify(t,null,2)}\n`));var n=new Blob(o,{type:"text/plain;charset=utf-8"});e.saveAs(n,`${t()}.dat`)}})},v.prototype.toggleShow=function(){o.isVisible()||this.createPage()},q.prototype={init(t=!1){this.showPage=new v(this.csi.report.bind(this.csi)),t||this.bindDefaultTrigger()},onTapQueue(t,e){const o=this.tapQueue.length?this.tapQueue[this.tapQueue.length-1]:null;if(o&&t.timeStamp-o.timeStamp>300&&(console.log("clear tap queue"),this.tapQueue=[]),this.tapQueue.push(t),this.tapQueue.length===e)return this.tapQueue=[],!0}},q.prototype.bindDefaultTrigger=function(){document.querySelector("html").addEventListener("touchend",(t=>{this.onTapQueue(t,4)&&setTimeout(this.toggleShow.bind(this),100)})),document.addEventListener("keydown",(t=>{(t=t||window.event).ctrlKey&&6===parseInt(t.key,10)&&this.showPage.toggleShow()}))},q.prototype.toggleShow=function(){this.showPage.toggleShow()};const L=function(t){this.forms=t};L.prototype.probe=function(){const{onerror:t}=window;window.onerror=(...e)=>{var o,n,i,s,r,a;"function"==typeof t&&t.apply(this,e),o=this.forms,n=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o.addLine({etype:"win error",msg:`${n} \n ${a&&a.stack}`,js:`${i}:${s}:${r}`})}};const j={},$=function(t){this.forms=t},k=(t,e,o)=>{t.addLine({etype:"ajax error",msg:e,js:o.join(" :")})};$.prototype.probe=function(e=!1){const o=this;this.logAjaxTrace=e;const{open:n,send:i,setRequestHeader:s}=XMLHttpRequest.prototype;XMLHttpRequest.prototype.open=function(){const e=t();this.__xhrid=e,o.addListener(this,arguments),n.apply(this,arguments)},XMLHttpRequest.prototype.setRequestHeader=function(){const[t,e]=[...arguments];"content-type"===t.toLowerCase()&&"application/json"===e.toLowerCase()&&(j[this.__xhrid].recordPayload=!0),s.apply(this,arguments)},XMLHttpRequest.prototype.send=function(){j[this.__xhrid].recordPayload&&(j[this.__xhrid].payload=[...arguments]),i.apply(this,arguments)}},$.prototype.addListener=function(t,e){if(j[t.__xhrid])return;j[t.__xhrid]={xhr:t};const{ontimeout:o}=t;t.addEventListener("loadend",(()=>{const o=t.status;let n,i=j[t.__xhrid].payload||{};try{i=JSON.parse(i)}catch(t){i=i}try{n=JSON.parse(t.response)}catch(e){n=t.response}const s={status:o,payload:i,response:n};0!==parseInt(o)&&(/^2[0-9]{1,3}/gi.test(o)?this.logAjaxTrace&&((t,e,o)=>{t.addLine({etype:"ajax trace",msg:e,js:o.join(":")})})(this.forms,s,[...e]):k(this.forms,s,[...e]))})),t.addEventListener("error",(()=>{k(this.forms,t.status||"networkError",[...e])})),t.ontimeout=(...n)=>{this.forms.addLine({etype:"ajax error",msg:`timeout ${t.status}`,js:e.join(" :")}),o&&o.apply(this,n)}};const O=function(t){this.forms=t};O.prototype.probe=function(){if(!window.fetch)return;const t=window.fetch;window.fetch=(e,o)=>{let n="GET",i=e||"";return"string"==typeof e?n=o&&o.method?o.method:n:"[object Request]"===Object.prototype.toString.call(e)&&(n=e.method||n,i=e.url||""),t(e,o).then((t=>{const e=`${t.status}`;return/^2[0-9]{1,3}/gi.test(e)||0==+e||this.forms.addLine({etype:"fetch error",msg:`status:${t.status}`,js:`${n} :${i}`}),t})).catch((t=>{let e;try{e=t&&t.message?t.message:JSON.stringify(t)}catch(o){e=t&&t.message?t.message:t}throw this.forms.addLine({etype:"fetch error",msg:e,js:`${n} :${i}`}),t}))}};const S=function(){this.fid="",this.uid="",this.min=0,this.max=0,this.type="",this.length=""},I=function(){this.pid="",this.index="",this.time="",this.ua="",this.etype="",this.msg="",this.url="",this.other=""},T=function(t,e,o){const n={feid:t,uid:f(),min:0,max:0,type:e,length:0};this.maxLine=o||20,this.info=l(new S,n,y("info")),this.line=new I};T.prototype={addLine(t){const e={pid:f(6),index:parseInt(this.info.max,10)+1,time:Date.now(),ua:p()};(t=>{for(const e in t)t[e]="";t.url=location?location.href:""})(this.line),l(this.line,e,t);const o=`${this.info.type}_${this.line.index}`;b(o,this.line),this.updateInfo(this.line)},updateInfo(t){const e=parseInt(t.index,10);let o=parseInt(this.info.min,10);o=o||e;let n=e-o+1;if(n>this.maxLine){const t=n-this.maxLine;for(let e=0;e<t;e++){const t=`${this.info.type}_${o+e}`;x(t)}n=this.maxLine}this.info.length=n,this.info.min=e-n+1,this.info.max=e,b("info",this.info)}};const P=function(t,e){this.errTable=new T(t,"err",e)};P.prototype={addLine(t){const e=this.errTable;setTimeout((()=>{e.addLine(t)}),0)}};const Q=()=>{p();const{browser:t}=u,{name:e}=t,o=parseFloat(t.version);return"ie"===e&&o<9};class A{constructor(t={}){t.report=t.report||(()=>{console.warn("report needs to be defined")}),this.inited=!1,this.checkParams(t),this.init(t)}checkParams(t){if(!t.feID)throw Error("feID必传");if(!t.report||"function"!=typeof t.report)throw Error("请填写自定义上报函数")}init(t){if(!this.inited&&!Q())try{this.opts=t;const e=new P(t.feID,t.maxLine);this.forms=e,this.panel=new q(this),this.panel.init(t.customPanelTrigger),new L(e).probe(),new $(e).probe(t.logAjaxTrace),new O(e).probe(),this.inited=!0}catch(t){console.error(t)}}probe(...t){Q()||this.forms.addLine({etype:"custom error",msg:t})}report(){if(Q())return;const t=_();d(t)||this.opts.report(t)}showPanel(){this.panel.toggleShow()}}export{A as default};