import{nanoid as t}from"nanoid";import e from"file-saver";import o from"sweetalert2";import n from"axios";import i from"ali-oss";import s from"clipboard";import r from"toastify-js";let a;const c={qq:/\bm?qqbrowser\/([0-9.]+)/,360:t=>-1!==t.indexOf("360 aphone browser")?/\b360 aphone browser \(([^\)]+)\)/:/\b360(?:se|ee|chrome|browser)\b/,aoyou:/\baoyou/,webview:/\bcpu(?: iphone)? os (?:[0-9._]+).+\bapplewebkit\b/,firefox:/\bfirefox\/([0-9.ab]+)/,chrome:/ (?:chrome|crios|crmo)\/([0-9.]+)/,ie:/\b(?:msie |ie |trident\/[0-9].*rv[ :])([0-9.]+)/,android:t=>-1===t.indexOf("android")?"":/\bversion\/([0-9.]+(?: beta)?)/,safari:/\bversion\/([0-9.]+(?: beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\//,opera:/\bopera/,unknow:"unknow"},p={windows:/\bwindows nt ([0-9.]+)/,macosx:/\bmac os x ([0-9._]+)/,linux:"linux",wphone:t=>-1!==t.indexOf("windows phone ")?/\bwindows phone (?:os )?([0-9.]+)/:-1!==t.indexOf("xblwp")?/\bxblwp([0-9.]+)/:-1!==t.indexOf("zunewp")?/\bzunewp([0-9.]+)/:"windows phone",ios:t=>/\bcpu(?: iphone)? os /.test(t)?/\bcpu(?: iphone)? os ([0-9._]+)/:-1!==t.indexOf("iph os ")?/\biph os ([0-9_]+)/:/\bios\b/,android:t=>t.indexOf("android")>=0?/\bandroid[ \/-]?([0-9.x]+)?/:t.indexOf("adr")>=0?t.indexOf("mqqbrowser")>=0?/\badr[ ]\(linux; u; ([0-9.]+)?/:/\badr(?:[ ]([0-9.]+))?/:"android",unknow:"unknow"},h={weixin:/micromessenger/gi,qqvideo:/qqlivebrowser/gi,qqvideoipad:/qqlivehdbrowser/gi,shouqq:/qq\//gi,qqnews:/qqnews/gi,qzone:/qzone\//gi,unknow:"unknow"},u=(t,e)=>Object.prototype.toString.call(t)===`[object ${e}]`,l=(t,e)=>{const o=m[t.toLowerCase()];for(const t in e){const n=e[t],i=u(n,"Function")?n(d()):n;if(o.name=t,!0===i)break;if("[object String]"===toString(i)){if(-1!==d().indexOf(i))break}else if(u(i,"Object")){if(void 0!==i.version){o.version=i.version;break}}else if(i&&i.exec){const t=i.exec(d());if(t){t.length>=2&&t[1]?o.version=t[1].replace(/_/g,"."):o.version="0.0.0";break}}}return o},d=()=>{if(!a){const t="__",e=navigator.userAgent||"",o=navigator.platform||"",n=navigator.appVersion||"",i=navigator.vendor||"";a=e+t+o+t+n+t+i,a=a.toLowerCase()}return a},f=t=>{a||(l("os",p),l("platform",h),l("browser",c));return"all"===t||"full"===t?d():void 0!==t?m[t].name:`${m.os.name}  _${m.os.version}  ${m.browser.name}  _${m.browser.version}`},m={os:{name:"unknow",version:"0.0.0"},platform:{name:"unknow",version:"0.0.0"},browser:{name:"unknow",version:"0.0.0"}},w=(...t)=>{const e=t[0],o=Array.prototype.slice.call(t,1);for(let t=0;t<o.length;t++){const n=o[t];for(const t in n)e[t]=n[t]}return e},g=t=>{if(!t)return!0;if(!t.length)return!0;let e=0;for(let o=t.length-1;o>0;o--)t[o]||(e+=1);return e>t.length-1},y=t=>{const e="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";t=t||9;let o="";for(let n=0;n<t;n++)o+=e.charAt(Math.floor(Math.random()*e.length));return o};class b{constructor(){if(b.instance)return b.instance;this.__pool__={},b.instance=this}setItem(t,e){this.__pool__[t]=e}getItem(t){return this.__pool__[t]}remove(t){this.__pool__[t]=null}}b.instance=null;const x=new b,_=t=>0===t.indexOf("csijs_")?t:"csijs_"+t,v=(t,e,o)=>{"object"==typeof e&&(e=o?e:(t=>{try{return JSON.stringify(t)}catch(e){return t}})(e)),((t,e)=>{try{x.setItem(t,e)}catch(t){console.error(t)}})(_(t),e)},q=(t,e)=>{const o=(t=>x.getItem?x.getItem(t):null)(_(t));return o?e?o:(t=>{try{return JSON.parse(t)}catch(e){return t}})(o):null},S=t=>{(t=>{try{x&&x.removeItem(t)}catch(t){}})(_(t))},$=()=>{const t=q("info"),e=[],o=t?t.length:0;if(t&&o){const o=parseInt(t.max,10);for(let n=parseInt(t.min,10);n<=o;n++){const o=`${t.type}_${n}`,i=q(o);e.push(i)}}return e},j={download:"下载",copy:"复制",upload:"上传",report:"上报"};function L(t,e="download"){this.csiReport=t,j[e]&&(this.operation=e,this.mainBtnText=j[e])}function k(t){this.csi=t,this.tapQueue=[]}L.prototype.createPage=function(){const a=$();g(a)?o.fire({title:"暂无异常",text:"稍后窗口会自动关闭",icon:"success",heightAuto:!1,timer:2e3}):o.fire({title:"收集完成",text:`收集到${a.length}条日志，点击下方按钮下载日志`,icon:"success",heightAuto:!1,showConfirmButton:!0,confirmButtonText:this.mainBtnText,showCancelButton:!0,cancelButtonText:"关闭",preConfirm:()=>"upload"===this.operation?(async()=>{const e=$().map((t=>`${JSON.stringify(t,null,2)}\n`));var a=new Blob(e,{type:"text/plain;charset=utf-8"});const c=`${t()}.dat`,{Credentials:p}=(await n({method:"get",url:"http://julianos-uat.longfor.com/api/admin/alioss/sts",withCredentials:!0})).data,h=new i({region:"oss-cn-beijing",accessKeyId:p.AccessKeyId,accessKeySecret:p.AccessKeySecret,stsToken:p.SecurityToken,bucket:"prod-zws-wuguofeng"});await h.put(`mara/${c}`,a);const u=await h.signatureUrl(`mara/${c}`);o.fire({title:"上传完成",icon:"success",showConfirmButton:!0,confirmButtonText:"复制链接",showCancelButton:!0,cancelButtonText:"关闭",preConfirm:()=>{document.querySelector(".swal2-confirm").setAttribute("data-clipboard-text",u),new s(".swal2-confirm").on("success",(function(t){console.log(t),r({text:"链接已复制",duration:1e3,gravity:"bottom",position:"center",style:{position:"fixed",margin:"0 auto",left:0,right:0,width:"80px",textAlign:"center",background:"black",zIndex:"999999",padding:"5px",opacity:.8,borderRadius:"5px",color:"white"}}).showToast(),t.clearSelection()}))}})})():"copy"===this.operation?(()=>{const t=JSON.stringify($(),null,2);document.querySelector(".swal2-confirm").setAttribute("data-clipboard-text",t),new s(".swal2-confirm").on("success",(function(t){r({text:"复制成功",duration:1e3,gravity:"bottom",position:"center",style:{position:"fixed",margin:"0 auto",left:0,right:0,width:"80px",textAlign:"center",background:"black",zIndex:"999999",padding:"5px",opacity:.8,borderRadius:"5px",color:"white"}}).showToast(),t.clearSelection()}))})():(()=>{const o=$().map((t=>`${JSON.stringify(t,null,2)}\n`));var n=new Blob(o,{type:"text/plain;charset=utf-8"});const i=`${t()}.dat`;e.saveAs(n,i)})()})},L.prototype.toggleShow=function(){o.isVisible()||this.createPage()},k.prototype={init(t=!1,e){this.showPage=new L(this.csi.report.bind(this.csi),e),t||this.bindDefaultTrigger()},onTapQueue(t,e){const o=this.tapQueue.length?this.tapQueue[this.tapQueue.length-1]:null;if(o&&t.timeStamp-o.timeStamp>300&&(this.tapQueue=[]),this.tapQueue.push(t),this.tapQueue.length===e)return this.tapQueue=[],!0}},k.prototype.bindDefaultTrigger=function(){document.querySelector("html").addEventListener("touchend",(t=>{this.onTapQueue(t,4)&&setTimeout(this.toggleShow.bind(this),100)})),document.addEventListener("keydown",(t=>{(t=t||window.event).ctrlKey&&6===parseInt(t.key,10)&&this.showPage.toggleShow()}))},k.prototype.toggleShow=function(){this.showPage.toggleShow()};const T=function(t){this.forms=t};T.prototype.probe=function(){const{onerror:t}=window;window.onerror=(...e)=>{var o,n,i,s,r,a;"function"==typeof t&&t.apply(this,e),o=this.forms,n=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o.addLine({etype:"win error",msg:`${n} \n ${a&&a.stack}`,js:`${i}:${s}:${r}`})}};const O={},I=function(t){this.forms=t},A=(t,e,o)=>{t.addLine({etype:"ajax error",msg:e,js:o.join(" :")})};I.prototype.probe=function(e=!1,o){const n=this;this.logAjaxTrace=e,this.excludeKeywords=o||[];const{open:i,send:s,setRequestHeader:r}=XMLHttpRequest.prototype,a=t=>{for(let e=0;e<this.excludeKeywords.length;e++)if(-1!==t.indexOf(this.excludeKeywords[e]))return!0;return!1};XMLHttpRequest.prototype.open=function(){const e=[...arguments];if(e[1]&&a(e[1]))return i.apply(this,arguments);const o=t();this.__xhrid=o,n.addListener(this,arguments),i.apply(this,arguments)},XMLHttpRequest.prototype.setRequestHeader=function(){if(!this.__xhrid)return r.apply(this,arguments);const[t,e]=[...arguments];"content-type"===t.toLowerCase()&&e.toLowerCase().includes("application/json")&&(O[this.__xhrid].recordPayload=!0),r.apply(this,arguments)},XMLHttpRequest.prototype.send=function(){if(!this.__xhrid)return s.apply(this,arguments);O[this.__xhrid].recordPayload&&(O[this.__xhrid].payload=[...arguments]),s.apply(this,arguments)}},I.prototype.addListener=function(t,e){if(O[t.__xhrid])return;O[t.__xhrid]={xhr:t};const{ontimeout:o}=t;t.addEventListener("loadend",(()=>{const o=t.status;let n,i=O[t.__xhrid].payload||{};try{i=JSON.parse(i)}catch(t){i=i}try{n=JSON.parse(t.response)}catch(e){n=t.response}const s={status:o,payload:i,response:n};0!==parseInt(o)&&(/^2[0-9]{1,3}/gi.test(o)?this.logAjaxTrace&&((t,e,o)=>{t.addLine({etype:"ajax trace",msg:e,js:o.join(":")})})(this.forms,s,[...e]):A(this.forms,s,[...e]))})),t.addEventListener("error",(()=>{A(this.forms,t.status||"networkError",[...e])})),t.ontimeout=(...n)=>{this.forms.addLine({etype:"ajax error",msg:`timeout ${t.status}`,js:e.join(" :")}),o&&o.apply(this,n)}};const C=function(t){this.forms=t};C.prototype.probe=function(){if(!window.fetch)return;const t=window.fetch;window.fetch=(e,o)=>{let n="GET",i=e||"";return"string"==typeof e?n=o&&o.method?o.method:n:"[object Request]"===Object.prototype.toString.call(e)&&(n=e.method||n,i=e.url||""),t(e,o).then((t=>{const e=`${t.status}`;return/^2[0-9]{1,3}/gi.test(e)||0==+e||this.forms.addLine({etype:"fetch error",msg:`status:${t.status}`,js:`${n} :${i}`}),t})).catch((t=>{let e;try{e=t&&t.message?t.message:JSON.stringify(t)}catch(o){e=t&&t.message?t.message:t}throw this.forms.addLine({etype:"fetch error",msg:e,js:`${n} :${i}`}),t}))}};const B=function(){this.fid="",this.uid="",this.min=0,this.max=0,this.type="",this.length=""},z=function(){this.pid="",this.index="",this.time="",this.ua="",this.etype="",this.msg="",this.url="",this.other=""},P=function(t,e,o){const n={feid:t,uid:y(),min:0,max:0,type:e,length:0};this.maxLine=o||20,this.info=w(new B,n,q("info")),this.line=new z};P.prototype={addLine(t){const e={pid:y(6),index:parseInt(this.info.max,10)+1,time:Date.now(),ua:f()};(t=>{for(const e in t)t[e]="";t.url=location?location.href:""})(this.line),w(this.line,e,t);const o=`${this.info.type}_${this.line.index}`;v(o,this.line),this.updateInfo(this.line)},updateInfo(t){const e=parseInt(t.index,10);let o=parseInt(this.info.min,10);o=o||e;let n=e-o+1;if(n>this.maxLine){const t=n-this.maxLine;for(let e=0;e<t;e++){const t=`${this.info.type}_${o+e}`;S(t)}n=this.maxLine}this.info.length=n,this.info.min=e-n+1,this.info.max=e,v("info",this.info)}};const Q=function(t,e){this.errTable=new P(t,"err",e)};Q.prototype={addLine(t){const e=this.errTable;setTimeout((()=>{e.addLine(t)}),0)}};const R=()=>{f();const{browser:t}=m,{name:e}=t,o=parseFloat(t.version);return"ie"===e&&o<9};class E{constructor(t={}){t.report=t.report||(()=>{console.warn("report needs to be defined")}),this.inited=!1,this.checkParams(t),this.init(t)}checkParams(t){if(!t.feID)throw Error("feID必传");if(!t.report||"function"!=typeof t.report)throw Error("请填写自定义上报函数")}init(t){if(!this.inited&&!R()){try{this.opts=t;const e=new Q(t.feID,t.maxLine);this.forms=e,this.panel=new k(this),this.panel.init(t.customPanelTrigger,t.operationMethod),new T(e).probe(),new I(e).probe(t.logAjaxTrace,t.excludeAjaxKeywords),new C(e).probe(),this.inited=!0}catch(t){console.error(t)}if(t.containerFontSize){const e=document.createElement("style");e.innerText=`.swal2-popup {font-size: ${t.containerFontSize}}`,document.head.appendChild(e)}}}probe(...t){R()||this.forms.addLine({etype:"custom error",msg:t})}report(){if(R())return;const t=$();g(t)||this.opts.report(t)}showPanel(){this.panel.toggleShow()}}export{E as default};
