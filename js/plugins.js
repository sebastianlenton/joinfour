//cookies - http://www.quirksmode.org/js/cookies.html
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie( name ) {
	createCookie(name,"",-1);
}

//if the cookie is present, erase. If it's not present, create
function toggleCookie( name, value, days ) {
	if( readCookie( name ) ) {
		eraseCookie( name );
	} else {
		createCookie( name, value, days );
	}
}

// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

// debouncing function from John Hann
//http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
//http://paulirish.com/2009/throttled-smartresize-jquery-event-handler/
(function($,sr){ 
  var debounce = function (func, threshold, execAsap) {
      var timeout;
 
      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null; 
          };
 
          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);
 
          timeout = setTimeout(delayed, threshold || 50); 					//lower value makes it more responsive
      };
  }
	// smartresize 
	jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
})(jQuery,'smartresize');

/*
jquery.animate-enhanced plugin v1.05
---
http://github.com/benbarnett/jQuery-Animate-Enhanced
http://benbarnett.net
@benpbarnett
*/
(function(d,B,C){function H(a,b,l,c){if("d"!=l&&D(a)){var g=I.exec(b),e="auto"===a.css(l)?0:a.css(l),e="string"==typeof e?y(e):e;"string"==typeof b&&y(b);c=!0===c?0:e;var f=a.is(":hidden"),d=a.translation();"left"==l&&(c=parseInt(e,10)+d.x);"right"==l&&(c=parseInt(e,10)+d.x);"top"==l&&(c=parseInt(e,10)+d.y);"bottom"==l&&(c=parseInt(e,10)+d.y);g||"show"!=b?g||"hide"!=b||(c=0):(c=1,f&&a.css({display:J(a.context.tagName),opacity:0}));return g?(a=parseFloat(g[2]),g[1]&&(a=("-="===g[1]?-1:1)*a+parseInt(c,
10)),"%"==g[3]&&(a+="%"),a):c}}function K(a,b,l,c,g,e,f,p){var m=a.data(r),m=m&&!q(m)?m:d.extend(!0,{},L),s=g;if(-1<d.inArray(b,z)){var k=m.meta,n=y(a.css(b))||0,t=b+"_o",s=g-n;k[b]=s;k[t]="auto"==a.css(b)?0+s:n+s||0;m.meta=k;f&&0===s&&(s=0-k[t],k[b]=s,k[t]=0)}return a.data(r,M(a,m,b,l,c,s,e,f,p))}function M(a,b,d,c,g,e,f,p,m){var s=!1;f=!0===f&&!0===p;b=b||{};b.original||(b.original={},s=!0);b.properties=b.properties||{};b.secondary=b.secondary||{};p=b.meta;for(var r=b.original,n=b.properties,t=
b.secondary,h=k.length-1;0<=h;h--){var u=k[h]+"transition-property",v=k[h]+"transition-duration",q=k[h]+"transition-timing-function";d=f?k[h]+"transform":d;s&&(r[u]=a.css(u)||"",r[v]=a.css(v)||"",r[q]=a.css(q)||"");t[d]=f?!0===m||!0===A&&!1!==m&&E?"translate3d("+p.left+"px, "+p.top+"px, 0)":"translate("+p.left+"px,"+p.top+"px)":e;n[u]=(n[u]?n[u]+",":"")+d;n[v]=(n[v]?n[v]+",":"")+c+"ms";n[q]=(n[q]?n[q]+",":"")+g}return b}function N(a){for(var b in a)if(!("width"!=b&&"height"!=b||"show"!=a[b]&&"hide"!=
a[b]&&"toggle"!=a[b]))return!0;return!1}function q(a){for(var b in a)return!1;return!0}function J(a){a=a.toUpperCase();var b={LI:"list-item",TR:"table-row",TD:"table-cell",TH:"table-cell",CAPTION:"table-caption",COL:"table-column",COLGROUP:"table-column-group",TFOOT:"table-footer-group",THEAD:"table-header-group",TBODY:"table-row-group"};return"string"==typeof b[a]?b[a]:"block"}function y(a){return parseFloat(a.replace(a.match(/\D+$/),""))}function D(a){var b=!0;a.each(function(a,d){return b=b&&d.ownerDocument});
return b}function O(a,b,l){if(!D(l))return!1;var c=-1<d.inArray(a,P);"width"!=a&&"height"!=a&&"opacity"!=a||parseFloat(b)!==parseFloat(l.css(a))||(c=!1);return c}var P="top right bottom left opacity height width".split(" "),z=["top","right","bottom","left"],k=["-webkit-","-moz-","-o-",""],Q=["avoidTransforms","useTranslate3d","leaveTransforms"],I=/^([+-]=)?([\d+-.]+)(.*)$/,R=/([A-Z])/g,L={secondary:{},meta:{top:0,right:0,bottom:0,left:0}},r="jQe",F=null,w=!1,x=(document.body||document.documentElement).style,
G=void 0!==x.WebkitTransition||void 0!==x.MozTransition||void 0!==x.OTransition||void 0!==x.transition,E="WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix,A=E;d.expr&&d.expr.filters&&(F=d.expr.filters.animated,d.expr.filters.animated=function(a){return d(a).data("events")&&d(a).data("events")["webkitTransitionEnd oTransitionEnd transitionend"]?!0:F.call(this,a)});d.extend({toggle3DByDefault:function(){return A=!A},toggleDisabledByDefault:function(){return w=!w},setDisabledByDefault:function(a){return w=
a}});d.fn.translation=function(){if(!this[0])return null;var a=window.getComputedStyle(this[0],null),b={x:0,y:0};if(a)for(var d=k.length-1;0<=d;d--){var c=a.getPropertyValue(k[d]+"transform");if(c&&/matrix/i.test(c)){a=c.replace(/^matrix\(/i,"").split(/, |\)$/g);b={x:parseInt(a[4],10),y:parseInt(a[5],10)};break}}return b};d.fn.animate=function(a,b,l,c){a=a||{};var g=!("undefined"!==typeof a.bottom||"undefined"!==typeof a.right),e=d.speed(b,l,c),f=0,p=function(){f--;0===f&&"function"===typeof e.complete&&
e.complete.apply(this,arguments)};return!0===("undefined"!==typeof a.avoidCSSTransitions?a.avoidCSSTransitions:w)||!G||q(a)||N(a)||0>=e.duration||e.step?B.apply(this,arguments):this[!0===e.queue?"queue":"each"](function(){var b=d(this),c=d.extend({},e),l=function(c){var e=b.data(r)||{original:{}},f={};if(2==c.eventPhase){if(!0!==a.leaveTransforms){for(c=k.length-1;0<=c;c--)f[k[c]+"transform"]="";if(g&&"undefined"!==typeof e.meta){c=0;for(var h;h=z[c];++c)f[h]=e.meta[h+"_o"]+"px",d(this).css(h,f[h])}}b.unbind("webkitTransitionEnd oTransitionEnd transitionend").css(e.original).css(f).data(r,
null);"hide"===a.opacity&&b.css({display:"none",opacity:""});p.call(this)}},n={bounce:"cubic-bezier(0.0, 0.35, .5, 1.3)",linear:"linear",swing:"ease-in-out",easeInQuad:"cubic-bezier(0.550, 0.085, 0.680, 0.530)",easeInCubic:"cubic-bezier(0.550, 0.055, 0.675, 0.190)",easeInQuart:"cubic-bezier(0.895, 0.030, 0.685, 0.220)",easeInQuint:"cubic-bezier(0.755, 0.050, 0.855, 0.060)",easeInSine:"cubic-bezier(0.470, 0.000, 0.745, 0.715)",easeInExpo:"cubic-bezier(0.950, 0.050, 0.795, 0.035)",easeInCirc:"cubic-bezier(0.600, 0.040, 0.980, 0.335)",
easeInBack:"cubic-bezier(0.600, -0.280, 0.735, 0.045)",easeOutQuad:"cubic-bezier(0.250, 0.460, 0.450, 0.940)",easeOutCubic:"cubic-bezier(0.215, 0.610, 0.355, 1.000)",easeOutQuart:"cubic-bezier(0.165, 0.840, 0.440, 1.000)",easeOutQuint:"cubic-bezier(0.230, 1.000, 0.320, 1.000)",easeOutSine:"cubic-bezier(0.390, 0.575, 0.565, 1.000)",easeOutExpo:"cubic-bezier(0.190, 1.000, 0.220, 1.000)",easeOutCirc:"cubic-bezier(0.075, 0.820, 0.165, 1.000)",easeOutBack:"cubic-bezier(0.175, 0.885, 0.320, 1.275)",easeInOutQuad:"cubic-bezier(0.455, 0.030, 0.515, 0.955)",
easeInOutCubic:"cubic-bezier(0.645, 0.045, 0.355, 1.000)",easeInOutQuart:"cubic-bezier(0.770, 0.000, 0.175, 1.000)",easeInOutQuint:"cubic-bezier(0.860, 0.000, 0.070, 1.000)",easeInOutSine:"cubic-bezier(0.445, 0.050, 0.550, 0.950)",easeInOutExpo:"cubic-bezier(1.000, 0.000, 0.000, 1.000)",easeInOutCirc:"cubic-bezier(0.785, 0.135, 0.150, 0.860)",easeInOutBack:"cubic-bezier(0.680, -0.550, 0.265, 1.550)"},t={},n=n[c.easing||"swing"]?n[c.easing||"swing"]:c.easing||"swing",h;for(h in a)if(-1===d.inArray(h,
Q)){var u=-1<d.inArray(h,z),v=H(b,a[h],h,u&&!0!==a.avoidTransforms);O(h,v,b)?K(b,h,c.duration,n,v,u&&!0!==a.avoidTransforms,g,a.useTranslate3d):t[h]=a[h]}b.unbind("webkitTransitionEnd oTransitionEnd transitionend");h=b.data(r);if(!h||q(h)||q(h.secondary))c.queue=!1;else{f++;b.css(h.properties);var w=h.secondary;setTimeout(function(){b.bind("webkitTransitionEnd oTransitionEnd transitionend",l).css(w)})}q(t)||(f++,B.apply(b,[t,{duration:c.duration,easing:d.easing[c.easing]?c.easing:d.easing.swing?"swing":
"linear",complete:p,queue:c.queue}]));return!0})};d.fn.animate.defaults={};d.fn.stop=function(a,b,l){if(!G)return C.apply(this,[a,b]);a&&this.queue([]);this.each(function(){var c=d(this),g=c.data(r);if(g&&!q(g)){var e,f={};if(b){if(f=g.secondary,!l&&void 0!==typeof g.meta.left_o||void 0!==typeof g.meta.top_o)for(f.left=void 0!==typeof g.meta.left_o?g.meta.left_o:"auto",f.top=void 0!==typeof g.meta.top_o?g.meta.top_o:"auto",e=k.length-1;0<=e;e--)f[k[e]+"transform"]=""}else if(!q(g.secondary)){var p=
window.getComputedStyle(c[0],null);if(p)for(var m in g.secondary)if(g.secondary.hasOwnProperty(m)&&(m=m.replace(R,"-$1").toLowerCase(),f[m]=p.getPropertyValue(m),!l&&/matrix/i.test(f[m])))for(e=f[m].replace(/^matrix\(/i,"").split(/, |\)$/g),f.left=parseFloat(e[4])+parseFloat(c.css("left"))+"px"||"auto",f.top=parseFloat(e[5])+parseFloat(c.css("top"))+"px"||"auto",e=k.length-1;0<=e;e--)f[k[e]+"transform"]=""}c.unbind("webkitTransitionEnd oTransitionEnd transitionend");c.css(g.original).css(f).data(r,
null)}else C.apply(c,[a,b])});return this}})(jQuery,jQuery.fn.animate,jQuery.fn.stop);
