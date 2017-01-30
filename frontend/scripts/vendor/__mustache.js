/**
 * Template7 1.1.4
 * Mobile-first JavaScript template engine
 * 
 * http://www.idangero.us/template7/
 * 
 * Copyright 2016, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 * 
 * Licensed under MIT
 * 
 * Released on: December 17, 2016
 */
window.Template7=function(){"use strict";function e(e){return"[object Array]"===Object.prototype.toString.apply(e)}function t(e){return"function"==typeof e}function r(e){return"undefined"!=typeof window&&window.escape?window.escape(e):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function n(e){var t,r,n,i=e.replace(/[{}#}]/g,"").split(" "),o=[];for(r=0;r<i.length;r++){var p,s,f=i[r];if(0===r)o.push(f);else if(0===f.indexOf('"')||0===f.indexOf("'"))if(p=0===f.indexOf('"')?l:a,s=0===f.indexOf('"')?'"':"'",2===f.match(p).length)o.push(f);else{for(t=0,n=r+1;n<i.length;n++)if(f+=" "+i[n],i[n].indexOf(s)>=0){t=n,o.push(f);break}t&&(r=t)}else if(f.indexOf("=")>0){var c=f.split("="),u=c[0],h=c[1];if(p||(p=0===h.indexOf('"')?l:a,s=0===h.indexOf('"')?'"':"'"),2!==h.match(p).length){for(t=0,n=r+1;n<i.length;n++)if(h+=" "+i[n],i[n].indexOf(s)>=0){t=n;break}t&&(r=t)}var d=[u,h.replace(p,"")];o.push(d)}else o.push(f)}return o}function i(t){var r,i,a=[];if(!t)return[];var l=t.split(/({{[^{^}]*}})/);for(r=0;r<l.length;r++){var o=l[r];if(""!==o)if(o.indexOf("{{")<0)a.push({type:"plain",content:o});else{if(o.indexOf("{/")>=0)continue;if(o.indexOf("{#")<0&&o.indexOf(" ")<0&&o.indexOf("else")<0){a.push({type:"variable",contextName:o.replace(/[{}]/g,"")});continue}var p=n(o),s=p[0],f=">"===s,c=[],u={};for(i=1;i<p.length;i++){var h=p[i];e(h)?u[h[0]]="false"!==h[1]&&h[1]:c.push(h)}if(o.indexOf("{#")>=0){var d,v="",g="",x=0,m=!1,y=!1,O=0;for(i=r+1;i<l.length;i++)if(l[i].indexOf("{{#")>=0&&O++,l[i].indexOf("{{/")>=0&&O--,l[i].indexOf("{{#"+s)>=0)v+=l[i],y&&(g+=l[i]),x++;else if(l[i].indexOf("{{/"+s)>=0){if(!(x>0)){d=i,m=!0;break}x--,v+=l[i],y&&(g+=l[i])}else l[i].indexOf("else")>=0&&0===O?y=!0:(y||(v+=l[i]),y&&(g+=l[i]));m&&(d&&(r=d),a.push({type:"helper",helperName:s,contextName:c,content:v,inverseContent:g,hash:u}))}else o.indexOf(" ")>0&&(f&&(s="_partial",c[0]&&(c[0]='"'+c[0].replace(/"|'/g,"")+'"')),a.push({type:"helper",helperName:s,contextName:c,hash:u}))}}return a}var a=new RegExp("'","g"),l=new RegExp('"',"g"),o=function(e,t){function r(e,t){return e.content?o(e.content,t):function(){return""}}function n(e,t){return e.inverseContent?o(e.inverseContent,t):function(){return""}}function a(e,t){var r,n,i=0;if(0===e.indexOf("../")){i=e.split("../").length-1;var a=t.split("_")[1]-i;t="ctx_"+(a>=1?a:1),n=e.split("../")[i].split(".")}else 0===e.indexOf("@global")?(t="Template7.global",n=e.split("@global.")[1].split(".")):0===e.indexOf("@root")?(t="root",n=e.split("@root.")[1].split(".")):n=e.split(".");r=t;for(var l=0;l<n.length;l++){var o=n[l];0===o.indexOf("@")?l>0?r+="[(data && data."+o.replace("@","")+")]":r="(data && data."+e.replace("@","")+")":isFinite(o)?r+="["+o+"]":"this"===o||o.indexOf("this.")>=0||o.indexOf("this[")>=0||o.indexOf("this(")>=0?r=o.replace("this",t):r+="."+o}return r}function l(e,t){for(var r=[],n=0;n<e.length;n++)/^['"]/.test(e[n])?r.push(e[n]):/^(true|false|\d+)$/.test(e[n])?r.push(e[n]):r.push(a(e[n],t));return r.join(", ")}function o(e,t){if(t=t||1,e=e||p.template,"string"!=typeof e)throw new Error("Template7: Template must be a string");var o=i(e);if(0===o.length)return function(){return""};var s="ctx_"+t,f="";f+=1===t?"(function ("+s+", data, root) {\n":"(function ("+s+", data) {\n",1===t&&(f+="function isArray(arr){return Object.prototype.toString.apply(arr) === '[object Array]';}\n",f+="function isFunction(func){return (typeof func === 'function');}\n",f+='function c(val, ctx) {if (typeof val !== "undefined" && val !== null) {if (isFunction(val)) {return val.call(ctx);} else return val;} else return "";}\n',f+="root = root || ctx_1 || {};\n"),f+="var r = '';\n";var c;for(c=0;c<o.length;c++){var u=o[c];if("plain"!==u.type){var h,d;if("variable"===u.type&&(h=a(u.contextName,s),f+="r += c("+h+", "+s+");"),"helper"===u.type)if(u.helperName in p.helpers)d=l(u.contextName,s),f+="r += (Template7.helpers."+u.helperName+").call("+s+", "+(d&&d+", ")+"{hash:"+JSON.stringify(u.hash)+", data: data || {}, fn: "+r(u,t+1)+", inverse: "+n(u,t+1)+", root: root});";else{if(u.contextName.length>0)throw new Error('Template7: Missing helper: "'+u.helperName+'"');h=a(u.helperName,s),f+="if ("+h+") {",f+="if (isArray("+h+")) {",f+="r += (Template7.helpers.each).call("+s+", "+h+", {hash:"+JSON.stringify(u.hash)+", data: data || {}, fn: "+r(u,t+1)+", inverse: "+n(u,t+1)+", root: root});",f+="}else {",f+="r += (Template7.helpers.with).call("+s+", "+h+", {hash:"+JSON.stringify(u.hash)+", data: data || {}, fn: "+r(u,t+1)+", inverse: "+n(u,t+1)+", root: root});",f+="}}"}}else f+="r +='"+u.content.replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/'/g,"\\'")+"';"}return f+="\nreturn r;})",eval.call(window,f)}var p=this;p.template=e,p.compile=function(e){return p.compiled||(p.compiled=o(e)),p.compiled}};o.prototype={options:{},partials:{},helpers:{_partial:function(e,t){var r=o.prototype.partials[e];if(!r||r&&!r.template)return"";r.compiled||(r.compiled=new o(r.template).compile());var n=this;for(var i in t.hash)n[i]=t.hash[i];return r.compiled(n,t.data,t.root)},escape:function(e,t){if("string"!=typeof e)throw new Error('Template7: Passed context to "escape" helper should be a string');return r(e)},if:function(e,r){return t(e)&&(e=e.call(this)),e?r.fn(this,r.data):r.inverse(this,r.data)},unless:function(e,r){return t(e)&&(e=e.call(this)),e?r.inverse(this,r.data):r.fn(this,r.data)},each:function(r,n){var i="",a=0;if(t(r)&&(r=r.call(this)),e(r)){for(n.hash.reverse&&(r=r.reverse()),a=0;a<r.length;a++)i+=n.fn(r[a],{first:0===a,last:a===r.length-1,index:a});n.hash.reverse&&(r=r.reverse())}else for(var l in r)a++,i+=n.fn(r[l],{key:l});return a>0?i:n.inverse(this)},with:function(e,r){return t(e)&&(e=e.call(this)),r.fn(e)},join:function(e,r){return t(e)&&(e=e.call(this)),e.join(r.hash.delimiter||r.hash.delimeter)},js:function(e,t){var r;return r=e.indexOf("return")>=0?"(function(){"+e+"})":"(function(){return ("+e+")})",eval.call(this,r).call(this)},js_compare:function(e,t){var r;r=e.indexOf("return")>=0?"(function(){"+e+"})":"(function(){return ("+e+")})";var n=eval.call(this,r).call(this);return n?t.fn(this,t.data):t.inverse(this,t.data)}}};var p=function(e,t){if(2===arguments.length){var r=new o(e),n=r.compile()(t);return r=null,n}return new o(e)};return p.registerHelper=function(e,t){o.prototype.helpers[e]=t},p.unregisterHelper=function(e){o.prototype.helpers[e]=void 0,delete o.prototype.helpers[e]},p.registerPartial=function(e,t){o.prototype.partials[e]={template:t}},p.unregisterPartial=function(e,t){o.prototype.partials[e]&&(o.prototype.partials[e]=void 0,delete o.prototype.partials[e])},p.compile=function(e,t){var r=new o(e,t);return r.compile()},p.options=o.prototype.options,p.helpers=o.prototype.helpers,p.partials=o.prototype.partials,p}();

;(function(d){
    function template(id, data) {
        if (d.getElementById(id) !== null) {
            return Template7.compile(d.getElementById(id).innerHTML)(data || {});
        }
        return '';
    }
    window.template = template;
})(document);