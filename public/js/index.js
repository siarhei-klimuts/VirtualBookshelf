angular
    .module('VirtualBookshelf', ['blockUI', 'angularUtils.directives.dirPagination'])
    	.config(function (blockUIConfig, paginationTemplateProvider) {
    		blockUIConfig.delay = 0;
    		blockUIConfig.autoBlock = false;
			blockUIConfig.autoInjectBodyBlock = false;
			paginationTemplateProvider.setPath('/js/angular/dirPagination/dirPagination.tpl.html');
    	})
    	.run(function (Main) {
			Main.start();
    	});
angular.module('VirtualBookshelf')
.controller('UiCtrl', function ($scope, UI) {
    $scope.menu = UI.menu;
});
angular.module('VirtualBookshelf')
.directive('vbSelect', function() {
	return {
		restrict: 'E',
    	transclude: true,
		templateUrl: '/ui/select.ejs',
		scope: {
			options: '=',
			selected: '=',
			value: '@',
			label: '@'
		},
		link: function(scope, element, attrs, controller, transclude) {
			scope.select = function(item) {
				scope.selected = item[scope.value];
			};

			scope.isSelected = function(item) {
				return scope.selected === item[scope.value];
			};
		}
	}
});

/**
 * @license
 * lodash 3.2.0 (Custom Build) lodash.com/license | Underscore.js 1.7.0 underscorejs.org/LICENSE
 * Build: `lodash modern -o ./lodash.js`
 */
;(function(){function n(n,t){if(n!==t){var r=n===n,e=t===t;if(n>t||!r||typeof n=="undefined"&&e)return 1;if(n<t||!e||typeof t=="undefined"&&r)return-1}return 0}function t(n,t,r){if(t!==t)return p(n,r);r=(r||0)-1;for(var e=n.length;++r<e;)if(n[r]===t)return r;return-1}function r(n,t){var r=n.length;for(n.sort(t);r--;)n[r]=n[r].c;return n}function e(n){return typeof n=="string"?n:null==n?"":n+""}function u(n){return n.charCodeAt(0)}function o(n,t){for(var r=-1,e=n.length;++r<e&&-1<t.indexOf(n.charAt(r)););return r
}function i(n,t){for(var r=n.length;r--&&-1<t.indexOf(n.charAt(r)););return r}function f(t,r){return n(t.a,r.a)||t.b-r.b}function a(t,r){for(var e=-1,u=t.a,o=r.a,i=u.length;++e<i;){var f=n(u[e],o[e]);if(f)return f}return t.b-r.b}function c(n){return Wt[n]}function l(n){return Nt[n]}function s(n){return"\\"+Lt[n]}function p(n,t,r){var e=n.length;for(t=r?t||e:(t||0)-1;r?t--:++t<e;){var u=n[t];if(u!==u)return t}return-1}function h(n){return n&&typeof n=="object"||false}function _(n){return 160>=n&&9<=n&&13>=n||32==n||160==n||5760==n||6158==n||8192<=n&&(8202>=n||8232==n||8233==n||8239==n||8287==n||12288==n||65279==n)
}function g(n,t){for(var r=-1,e=n.length,u=-1,o=[];++r<e;)n[r]===t&&(n[r]=B,o[++u]=r);return o}function v(n){for(var t=-1,r=n.length;++t<r&&_(n.charCodeAt(t)););return t}function y(n){for(var t=n.length;t--&&_(n.charCodeAt(t)););return t}function d(n){return Ut[n]}function m(_){function Wt(n){if(h(n)&&!(So(n)||n instanceof Ut)){if(n instanceof Nt)return n;if(Uu.call(n,"__chain__")&&Uu.call(n,"__wrapped__"))return he(n)}return new Nt(n)}function Nt(n,t,r){this.__wrapped__=n,this.__actions__=r||[],this.__chain__=!!t
}function Ut(n){this.__wrapped__=n,this.__actions__=null,this.__dir__=1,this.__dropCount__=0,this.__filtered__=false,this.__iteratees__=null,this.__takeCount__=so,this.__views__=null}function Ft(){this.__data__={}}function Lt(n){var t=n?n.length:0;for(this.data={hash:to(null),set:new Zu};t--;)this.push(n[t])}function Bt(n,t){var r=n.data;return(typeof t=="string"||Xe(t)?r.set.has(t):r.hash[t])?0:-1}function zt(n,t){var r=-1,e=n.length;for(t||(t=wu(e));++r<e;)t[r]=n[r];return t}function Mt(n,t){for(var r=-1,e=n.length;++r<e&&false!==t(n[r],r,n););return n
}function qt(n,t){for(var r=-1,e=n.length;++r<e;)if(!t(n[r],r,n))return false;return true}function Pt(n,t){for(var r=-1,e=n.length,u=-1,o=[];++r<e;){var i=n[r];t(i,r,n)&&(o[++u]=i)}return o}function Kt(n,t){for(var r=-1,e=n.length,u=wu(e);++r<e;)u[r]=t(n[r],r,n);return u}function Vt(n){for(var t=-1,r=n.length,e=lo;++t<r;){var u=n[t];u>e&&(e=u)}return e}function Yt(n,t,r,e){var u=-1,o=n.length;for(e&&o&&(r=n[++u]);++u<o;)r=t(r,n[u],u,n);return r}function Zt(n,t,r,e){var u=n.length;for(e&&u&&(r=n[--u]);u--;)r=t(r,n[u],u,n);
return r}function Gt(n,t){for(var r=-1,e=n.length;++r<e;)if(t(n[r],r,n))return true;return false}function Jt(n,t){return typeof n=="undefined"?t:n}function Xt(n,t,r,e){return typeof n!="undefined"&&Uu.call(e,r)?n:t}function Ht(n,t,r){var e=Fo(t);if(!r)return nr(t,n,e);for(var u=-1,o=e.length;++u<o;){var i=e[u],f=n[i],a=r(f,t[i],i,n,t);(a===a?a===f:f!==f)&&(typeof f!="undefined"||i in n)||(n[i]=a)}return n}function Qt(n,t){for(var r=-1,e=n.length,u=oe(e),o=t.length,i=wu(o);++r<o;){var f=t[r];u?(f=parseFloat(f),i[r]=ee(f,e)?n[f]:w):i[r]=n[f]
}return i}function nr(n,t,r){r||(r=t,t={});for(var e=-1,u=r.length;++e<u;){var o=r[e];t[o]=n[o]}return t}function tr(n,t,r){var e=typeof n;if("function"==e){if(e=typeof t!="undefined"){var e=Wt.support,u=!(e.funcNames?n.name:e.funcDecomp);if(!u){var o=Wu.call(n);e.funcNames||(u=!dt.test(o)),u||(u=kt.test(o)||He(n),bo(n,u))}e=u}n=e?Nr(n,t,r):n}else n=null==n?vu:"object"==e?br(n):typeof t=="undefined"?jr(n+""):xr(n+"",t);return n}function rr(n,t,r,e,u,o,i){var f;if(r&&(f=u?r(n,e,u):r(n)),typeof f!="undefined")return f;
if(!Xe(n))return n;if(e=So(n)){if(f=ne(n),!t)return zt(n,f)}else{var a=Lu.call(n),c=a==K;if(a!=Y&&a!=z&&(!c||u))return Tt[a]?re(n,a,t):u?n:{};if(f=te(c?{}:n),!t)return nr(n,f,Fo(n))}for(o||(o=[]),i||(i=[]),u=o.length;u--;)if(o[u]==n)return i[u];return o.push(n),i.push(f),(e?Mt:_r)(n,function(e,u){f[u]=rr(e,t,r,u,n,o,i)}),f}function er(n,t,r,e){if(typeof n!="function")throw new Ou($);return Gu(function(){n.apply(w,Rr(r,e))},t)}function ur(n,r){var e=n?n.length:0,u=[];if(!e)return u;var o=-1,i=Qr(),f=i==t,a=f&&200<=r.length&&xo(r),c=r.length;
a&&(i=Bt,f=false,r=a);n:for(;++o<e;)if(a=n[o],f&&a===a){for(var l=c;l--;)if(r[l]===a)continue n;u.push(a)}else 0>i(r,a)&&u.push(a);return u}function or(n,t){var r=n?n.length:0;if(!oe(r))return _r(n,t);for(var e=-1,u=pe(n);++e<r&&false!==t(u[e],e,u););return n}function ir(n,t){var r=n?n.length:0;if(!oe(r))return gr(n,t);for(var e=pe(n);r--&&false!==t(e[r],r,e););return n}function fr(n,t){var r=true;return or(n,function(n,e,u){return r=!!t(n,e,u)}),r}function ar(n,t){var r=[];return or(n,function(n,e,u){t(n,e,u)&&r.push(n)
}),r}function cr(n,t,r,e){var u;return r(n,function(n,r,o){return t(n,r,o)?(u=e?r:n,false):void 0}),u}function lr(n,t,r,e){e=(e||0)-1;for(var u=n.length,o=-1,i=[];++e<u;){var f=n[e];if(h(f)&&oe(f.length)&&(So(f)||Ye(f))){t&&(f=lr(f,t,r));var a=-1,c=f.length;for(i.length+=c;++a<c;)i[++o]=f[a]}else r||(i[++o]=f)}return i}function sr(n,t,r){var e=-1,u=pe(n);r=r(n);for(var o=r.length;++e<o;){var i=r[e];if(false===t(u[i],i,u))break}return n}function pr(n,t,r){var e=pe(n);r=r(n);for(var u=r.length;u--;){var o=r[u];
if(false===t(e[o],o,e))break}return n}function hr(n,t){sr(n,t,ou)}function _r(n,t){return sr(n,t,Fo)}function gr(n,t){return pr(n,t,Fo)}function vr(n,t){for(var r=-1,e=t.length,u=-1,o=[];++r<e;){var i=t[r];Je(n[i])&&(o[++u]=i)}return o}function yr(n,t,r){var e=-1,u=typeof t=="function",o=n?n.length:0,i=oe(o)?wu(o):[];return or(n,function(n){var o=u?t:null!=n&&n[t];i[++e]=o?o.apply(n,r):w}),i}function dr(n,t,r,e,u,o){if(n===t)return 0!==n||1/n==1/t;var i=typeof n,f=typeof t;if("function"!=i&&"object"!=i&&"function"!=f&&"object"!=f||null==n||null==t)n=n!==n&&t!==t;
else n:{var i=dr,f=So(n),a=So(t),c=D,l=D;f||(c=Lu.call(n),c==z?c=Y:c!=Y&&(f=ru(n))),a||(l=Lu.call(t),l==z?l=Y:l!=Y&&ru(t));var s=c==Y,a=l==Y,l=c==l;if(!l||f||s)if(c=s&&Uu.call(n,"__wrapped__"),a=a&&Uu.call(t,"__wrapped__"),c||a)n=i(c?n.value():n,a?t.value():t,r,e,u,o);else if(l){for(u||(u=[]),o||(o=[]),c=u.length;c--;)if(u[c]==n){n=o[c]==t;break n}u.push(n),o.push(t),n=(f?Zr:Jr)(n,t,i,r,e,u,o),u.pop(),o.pop()}else n=false;else n=Gr(n,t,c)}return n}function mr(n,t,r,e,u){var o=t.length;if(null==n)return!o;
for(var i=-1,f=!u;++i<o;)if(f&&e[i]?r[i]!==n[t[i]]:!Uu.call(n,t[i]))return false;for(i=-1;++i<o;){var a=t[i];if(f&&e[i])a=Uu.call(n,a);else{var c=n[a],l=r[i],a=u?u(c,l,a):w;typeof a=="undefined"&&(a=dr(l,c,u,true))}if(!a)return false}return true}function wr(n,t){var r=[];return or(n,function(n,e,u){r.push(t(n,e,u))}),r}function br(n){var t=Fo(n),r=t.length;if(1==r){var e=t[0],u=n[e];if(ie(u))return function(n){return null!=n&&n[e]===u&&Uu.call(n,e)}}for(var o=wu(r),i=wu(r);r--;)u=n[t[r]],o[r]=u,i[r]=ie(u);return function(n){return mr(n,t,o,i)
}}function xr(n,t){return ie(t)?function(r){return null!=r&&r[n]===t}:function(r){return null!=r&&dr(t,r[n],null,true)}}function Ar(n,t,r,e,u){var o=oe(t.length)&&(So(t)||ru(t));return(o?Mt:_r)(t,function(t,i,f){if(h(t)){e||(e=[]),u||(u=[]);n:{t=e;for(var a=u,c=t.length,l=f[i];c--;)if(t[c]==l){n[i]=a[c],i=void 0;break n}c=n[i],f=r?r(c,l,i,n,f):w;var s=typeof f=="undefined";s&&(f=l,oe(l.length)&&(So(l)||ru(l))?f=So(c)?c:c?zt(c):[]:No(l)||Ye(l)?f=Ye(c)?eu(c):No(c)?c:{}:s=false),t.push(l),a.push(f),s?n[i]=Ar(f,l,r,t,a):(f===f?f!==c:c===c)&&(n[i]=f),i=void 0
}return i}a=n[i],f=r?r(a,t,i,n,f):w,(l=typeof f=="undefined")&&(f=t),!o&&typeof f=="undefined"||!l&&(f===f?f===a:a!==a)||(n[i]=f)}),n}function jr(n){return function(t){return null==t?w:t[n]}}function kr(n,t){return n+Pu(co()*(t-n+1))}function Er(n,t,r,e,u){return u(n,function(n,u,o){r=e?(e=false,n):t(r,n,u,o)}),r}function Rr(n,t,r){var e=-1,u=n.length;for(t=null==t?0:+t||0,0>t&&(t=-t>u?0:u+t),r=typeof r=="undefined"||r>u?u:+r||0,0>r&&(r+=u),u=t>r?0:r-t>>>0,t>>>=0,r=wu(u);++e<u;)r[e]=n[e+t];return r}function Ir(n,t){var r;
return or(n,function(n,e,u){return r=t(n,e,u),!r}),!!r}function Or(n,r){var e=-1,u=Qr(),o=n.length,i=u==t,f=i&&200<=o,a=f&&xo(),c=[];a?(u=Bt,i=false):(f=false,a=r?[]:c);n:for(;++e<o;){var l=n[e],s=r?r(l,e,n):l;if(i&&l===l){for(var p=a.length;p--;)if(a[p]===s)continue n;r&&a.push(s),c.push(l)}else 0>u(a,s)&&((r||f)&&a.push(s),c.push(l))}return c}function Cr(n,t){for(var r=-1,e=t.length,u=wu(e);++r<e;)u[r]=n[t[r]];return u}function Tr(n,t){var r=n;r instanceof Ut&&(r=r.value());for(var e=-1,u=t.length;++e<u;){var r=[r],o=t[e];
Vu.apply(r,o.args),r=o.func.apply(o.thisArg,r)}return r}function Sr(n,t,r){var e=0,u=n?n.length:e;if(typeof t=="number"&&t===t&&u<=_o){for(;e<u;){var o=e+u>>>1,i=n[o];(r?i<=t:i<t)?e=o+1:u=o}return u}return Wr(n,t,vu,r)}function Wr(n,t,r,e){t=r(t);for(var u=0,o=n?n.length:0,i=t!==t,f=typeof t=="undefined";u<o;){var a=Pu((u+o)/2),c=r(n[a]),l=c===c;(i?l||e:f?l&&(e||typeof c!="undefined"):e?c<=t:c<t)?u=a+1:o=a}return oo(o,ho)}function Nr(n,t,r){if(typeof n!="function")return vu;if(typeof t=="undefined")return n;
switch(r){case 1:return function(r){return n.call(t,r)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,o){return n.call(t,r,e,u,o)};case 5:return function(r,e,u,o,i){return n.call(t,r,e,u,o,i)}}return function(){return n.apply(t,arguments)}}function Ur(n){return Du.call(n,0)}function Fr(n,t,r){for(var e=r.length,u=-1,o=uo(n.length-e,0),i=-1,f=t.length,a=wu(o+f);++i<f;)a[i]=t[i];for(;++u<e;)a[r[u]]=n[u];for(;o--;)a[i++]=n[u++];return a}function Lr(n,t,r){for(var e=-1,u=r.length,o=-1,i=uo(n.length-u,0),f=-1,a=t.length,c=wu(i+a);++o<i;)c[o]=n[o];
for(i=o;++f<a;)c[i+f]=t[f];for(;++e<u;)c[i+r[e]]=n[o++];return c}function $r(n,t){return function(r,e,u){var o=t?t():{};if(e=Hr(e,u,3),So(r)){u=-1;for(var i=r.length;++u<i;){var f=r[u];n(o,f,e(f,u,r),r)}}else or(r,function(t,r,u){n(o,t,e(t,r,u),u)});return o}}function Br(n){return function(){var t=arguments.length,r=arguments[0];if(2>t||null==r)return r;if(3<t&&ue(arguments[1],arguments[2],arguments[3])&&(t=2),3<t&&"function"==typeof arguments[t-2])var e=Nr(arguments[--t-1],arguments[t--],5);else 2<t&&"function"==typeof arguments[t-1]&&(e=arguments[--t]);
for(var u=0;++u<t;){var o=arguments[u];o&&n(r,o,e)}return r}}function zr(n,t){function r(){return(this instanceof r?e:n).apply(t,arguments)}var e=Mr(n);return r}function Dr(n){return function(t){var r=-1;t=pu(fu(t));for(var e=t.length,u="";++r<e;)u=n(u,t[r],r);return u}}function Mr(n){return function(){var t=wo(n.prototype),r=n.apply(t,arguments);return Xe(r)?r:t}}function qr(n,t){return function(r,e,o){o&&ue(r,e,o)&&(e=null);var i=Hr(),f=null==e;if(i===tr&&f||(f=false,e=i(e,o,3)),f){if(e=So(r),e||!tu(r))return n(e?r:se(r));
e=u}return Xr(r,e,t)}}function Pr(n,t,r,e,u,o,i,f,a,c){function l(){for(var b=arguments.length,j=b,k=wu(b);j--;)k[j]=arguments[j];if(e&&(k=Fr(k,e,u)),o&&(k=Lr(k,o,i)),_||y){var j=l.placeholder,E=g(k,j),b=b-E.length;if(b<c){var O=f?zt(f):null,b=uo(c-b,0),C=_?E:null,E=_?null:E,T=_?k:null,k=_?null:k;return t|=_?R:I,t&=~(_?I:R),v||(t&=~(x|A)),k=Pr(n,t,r,T,C,k,E,O,a,b),k.placeholder=j,k}}if(j=p?r:this,h&&(n=j[m]),f)for(O=k.length,b=oo(f.length,O),C=zt(k);b--;)E=f[b],k[b]=ee(E,O)?C[E]:w;return s&&a<k.length&&(k.length=a),(this instanceof l?d||Mr(n):n).apply(j,k)
}var s=t&C,p=t&x,h=t&A,_=t&k,v=t&j,y=t&E,d=!h&&Mr(n),m=n;return l}function Kr(n,t,r){return n=n.length,t=+t,n<t&&ro(t)?(t-=n,r=null==r?" ":r+"",lu(r,Mu(t/r.length)).slice(0,t)):""}function Vr(n,t,r,e){function u(){for(var t=-1,f=arguments.length,a=-1,c=e.length,l=wu(f+c);++a<c;)l[a]=e[a];for(;f--;)l[a++]=arguments[++t];return(this instanceof u?i:n).apply(o?r:this,l)}var o=t&x,i=Mr(n);return u}function Yr(n,t,r,e,u,o,i,f){var a=t&A;if(!a&&typeof n!="function")throw new Ou($);var c=e?e.length:0;if(c||(t&=~(R|I),e=u=null),c-=u?u.length:0,t&I){var l=e,s=u;
e=u=null}var p=!a&&Ao(n);if(r=[n,t,r,e,u,l,s,o,i,f],p&&true!==p){e=r[1],t=p[1],f=e|t,o=C|O,u=x|A,i=o|u|j|E;var l=e&C&&!(t&C),s=e&O&&!(t&O),h=(s?r:p)[7],_=(l?r:p)[8];o=f>=o&&f<=i&&(e<O||(s||l)&&h.length<=_),(!(e>=O&&t>u||e>u&&t>=O)||o)&&(t&x&&(r[2]=p[2],f|=e&x?0:j),(e=p[3])&&(u=r[3],r[3]=u?Fr(u,e,p[4]):zt(e),r[4]=u?g(r[3],B):zt(p[4])),(e=p[5])&&(u=r[5],r[5]=u?Lr(u,e,p[6]):zt(e),r[6]=u?g(r[5],B):zt(p[6])),(e=p[7])&&(r[7]=zt(e)),t&C&&(r[8]=null==r[8]?p[8]:oo(r[8],p[8])),null==r[9]&&(r[9]=p[9]),r[0]=p[0],r[1]=f),t=r[1],f=r[9]
}return r[9]=null==f?a?0:n.length:uo(f-c,0)||0,(p?bo:jo)(t==x?zr(r[0],r[2]):t!=R&&t!=(x|R)||r[4].length?Pr.apply(w,r):Vr.apply(w,r),r)}function Zr(n,t,r,e,u,o,i){var f=-1,a=n.length,c=t.length,l=true;if(a!=c&&(!u||c<=a))return false;for(;l&&++f<a;){var s=n[f],p=t[f],l=w;if(e&&(l=u?e(p,s,f):e(s,p,f)),typeof l=="undefined")if(u)for(var h=c;h--&&(p=t[h],!(l=s&&s===p||r(s,p,e,u,o,i))););else l=s&&s===p||r(s,p,e,u,o,i)}return!!l}function Gr(n,t,r){switch(r){case M:case q:return+n==+t;case P:return n.name==t.name&&n.message==t.message;
case V:return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case Z:case G:return n==t+""}return false}function Jr(n,t,r,e,u,o,i){var f=Fo(n),a=f.length,c=Fo(t).length;if(a!=c&&!u)return false;for(var l,c=-1;++c<a;){var s=f[c],p=Uu.call(t,s);if(p){var h=n[s],_=t[s],p=w;e&&(p=u?e(_,h,s):e(h,_,s)),typeof p=="undefined"&&(p=h&&h===_||r(h,_,e,u,o,i))}if(!p)return false;l||(l="constructor"==s)}return l||(r=n.constructor,e=t.constructor,!(r!=e&&"constructor"in n&&"constructor"in t)||typeof r=="function"&&r instanceof r&&typeof e=="function"&&e instanceof e)?true:false
}function Xr(n,t,r){var e=r?so:lo,u=e,o=u;return or(n,function(n,i,f){i=t(n,i,f),((r?i<u:i>u)||i===e&&i===o)&&(u=i,o=n)}),o}function Hr(n,t,r){var e=Wt.callback||_u,e=e===_u?tr:e;return r?e(n,t,r):e}function Qr(n,r,e){var u=Wt.indexOf||de,u=u===de?t:u;return n?u(n,r,e):u}function ne(n){var t=n.length,r=new n.constructor(t);return t&&"string"==typeof n[0]&&Uu.call(n,"index")&&(r.index=n.index,r.input=n.input),r}function te(n){return n=n.constructor,typeof n=="function"&&n instanceof n||(n=Eu),new n
}function re(n,t,r){var e=n.constructor;switch(t){case J:return Ur(n);case M:case q:return new e(+n);case X:case H:case Q:case nt:case tt:case rt:case et:case ut:case ot:return t=n.buffer,new e(r?Ur(t):t,n.byteOffset,n.length);case V:case G:return new e(n);case Z:var u=new e(n.source,yt.exec(n));u.lastIndex=n.lastIndex}return u}function ee(n,t){return n=+n,t=null==t?vo:t,-1<n&&0==n%1&&n<t}function ue(n,t,r){if(!Xe(r))return false;var e=typeof t;return"number"==e?(e=r.length,e=oe(e)&&ee(t,e)):e="string"==e&&t in r,e&&r[t]===n
}function oe(n){return typeof n=="number"&&-1<n&&0==n%1&&n<=vo}function ie(n){return n===n&&(0===n?0<1/n:!Xe(n))}function fe(n,t){n=pe(n);for(var r=-1,e=t.length,u={};++r<e;){var o=t[r];o in n&&(u[o]=n[o])}return u}function ae(n,t){var r={};return hr(n,function(n,e,u){t(n,e,u)&&(r[e]=n)}),r}function ce(n){var t;if(!h(n)||Lu.call(n)!=Y||!(Uu.call(n,"constructor")||(t=n.constructor,typeof t!="function"||t instanceof t)))return false;var r;return hr(n,function(n,t){r=t}),typeof r=="undefined"||Uu.call(n,r)
}function le(n){for(var t=ou(n),r=t.length,e=r&&n.length,u=Wt.support,u=e&&oe(e)&&(So(n)||u.nonEnumArgs&&Ye(n)),o=-1,i=[];++o<r;){var f=t[o];(u&&ee(f,e)||Uu.call(n,f))&&i.push(f)}return i}function se(n){return null==n?[]:oe(n.length)?Xe(n)?n:Eu(n):iu(n)}function pe(n){return Xe(n)?n:Eu(n)}function he(n){return n instanceof Ut?n.clone():new Nt(n.__wrapped__,n.__chain__,zt(n.__actions__))}function _e(n,t,r){return n&&n.length?((r?ue(n,t,r):null==t)&&(t=1),Rr(n,0>t?0:t)):[]}function ge(n,t,r){var e=n?n.length:0;
return e?((r?ue(n,t,r):null==t)&&(t=1),t=e-(+t||0),Rr(n,0,0>t?0:t)):[]}function ve(n,t,r){var e=-1,u=n?n.length:0;for(t=Hr(t,r,3);++e<u;)if(t(n[e],e,n))return e;return-1}function ye(n){return n?n[0]:w}function de(n,r,e){var u=n?n.length:0;if(!u)return-1;if(typeof e=="number")e=0>e?uo(u+e,0):e||0;else if(e)return e=Sr(n,r),n=n[e],(r===r?r===n:n!==n)?e:-1;return t(n,r,e)}function me(n){return _e(n,1)}function we(n,r,e,u){if(!n||!n.length)return[];typeof r!="boolean"&&null!=r&&(u=e,e=ue(n,r,u)?null:r,r=false);
var o=Hr();if((o!==tr||null!=e)&&(e=o(e,u,3)),r&&Qr()==t){r=e;var i;e=-1,u=n.length;for(var o=-1,f=[];++e<u;){var a=n[e],c=r?r(a,e,n):a;e&&i===c||(i=c,f[++o]=a)}n=f}else n=Or(n,e);return n}function be(n){for(var t=-1,r=(n&&n.length&&Vt(Kt(n,Nu)))>>>0,e=wu(r);++t<r;)e[t]=Kt(n,jr(t));return e}function xe(n,t){var r=-1,e=n?n.length:0,u={};for(!e||t||So(n[0])||(t=[]);++r<e;){var o=n[r];t?u[o]=t[r]:o&&(u[o[0]]=o[1])}return u}function Ae(n){return n=Wt(n),n.__chain__=true,n}function je(n,t,r){return t.call(r,n)
}function ke(n,t,r){var e=n?n.length:0;return oe(e)||(n=iu(n),e=n.length),e?(r=typeof r=="number"?0>r?uo(e+r,0):r||0:0,typeof n=="string"||!So(n)&&tu(n)?r<e&&-1<n.indexOf(t,r):-1<Qr(n,t,r)):false}function Ee(n,t,r){var e=So(n)?qt:fr;return(typeof t!="function"||typeof r!="undefined")&&(t=Hr(t,r,3)),e(n,t)}function Re(n,t,r){var e=So(n)?Pt:ar;return t=Hr(t,r,3),e(n,t)}function Ie(n,t,r){return So(n)?(t=ve(n,t,r),-1<t?n[t]:w):(t=Hr(t,r,3),cr(n,t,or))}function Oe(n,t,r){return typeof t=="function"&&typeof r=="undefined"&&So(n)?Mt(n,t):or(n,Nr(t,r,3))
}function Ce(n,t,r){if(typeof t=="function"&&typeof r=="undefined"&&So(n))for(r=n.length;r--&&false!==t(n[r],r,n););else n=ir(n,Nr(t,r,3));return n}function Te(n,t,r){var e=So(n)?Kt:wr;return t=Hr(t,r,3),e(n,t)}function Se(n,t,r,e){return(So(n)?Yt:Er)(n,Hr(t,e,4),r,3>arguments.length,or)}function We(n,t,r,e){return(So(n)?Zt:Er)(n,Hr(t,e,4),r,3>arguments.length,ir)}function Ne(n,t,r){return(r?ue(n,t,r):null==t)?(n=se(n),t=n.length,0<t?n[kr(0,t-1)]:w):(n=Ue(n),n.length=oo(0>t?0:+t||0,n.length),n)}function Ue(n){n=se(n);
for(var t=-1,r=n.length,e=wu(r);++t<r;){var u=kr(0,t);t!=u&&(e[t]=e[u]),e[u]=n[t]}return e}function Fe(n,t,r){var e=So(n)?Gt:Ir;return(typeof t!="function"||typeof r!="undefined")&&(t=Hr(t,r,3)),e(n,t)}function Le(n,t){var r;if(typeof t!="function"){if(typeof n!="function")throw new Ou($);var e=n;n=t,t=e}return function(){return 0<--n?r=t.apply(this,arguments):t=null,r}}function $e(n,t){var r=x;if(2<arguments.length)var e=Rr(arguments,2),u=g(e,$e.placeholder),r=r|R;return Yr(n,r,t,e,u)}function Be(n,t){var r=x|A;
if(2<arguments.length)var e=Rr(arguments,2),u=g(e,Be.placeholder),r=r|R;return Yr(t,r,n,e,u)}function ze(n,t,r){return r&&ue(n,t,r)&&(t=null),n=Yr(n,k,null,null,null,null,null,t),n.placeholder=ze.placeholder,n}function De(n,t,r){return r&&ue(n,t,r)&&(t=null),n=Yr(n,E,null,null,null,null,null,t),n.placeholder=De.placeholder,n}function Me(n,t,r){function e(){var r=t-(To()-c);0>=r||r>t?(f&&qu(f),r=p,f=s=p=w,r&&(h=To(),a=n.apply(l,i),s||f||(i=l=null))):s=Gu(e,r)}function u(){s&&qu(s),f=s=p=w,(g||_!==t)&&(h=To(),a=n.apply(l,i),s||f||(i=l=null))
}function o(){if(i=arguments,c=To(),l=this,p=g&&(s||!v),false===_)var r=v&&!s;else{f||v||(h=c);var o=_-(c-h),y=0>=o||o>_;y?(f&&(f=qu(f)),h=c,a=n.apply(l,i)):f||(f=Gu(u,o))}return y&&s?s=qu(s):s||t===_||(s=Gu(e,t)),r&&(y=true,a=n.apply(l,i)),!y||s||f||(i=l=null),a}var i,f,a,c,l,s,p,h=0,_=false,g=true;if(typeof n!="function")throw new Ou($);if(t=0>t?0:t,true===r)var v=true,g=false;else Xe(r)&&(v=r.leading,_="maxWait"in r&&uo(+r.maxWait||0,t),g="trailing"in r?r.trailing:g);return o.cancel=function(){s&&qu(s),f&&qu(f),f=s=p=w
},o}function qe(){var n=arguments,t=n.length-1;if(0>t)return function(n){return n};if(!qt(n,Je))throw new Ou($);return function(){for(var r=t,e=n[r].apply(this,arguments);r--;)e=n[r].call(this,e);return e}}function Pe(n,t){function r(){var e=r.cache,u=t?t.apply(this,arguments):arguments[0];if(e.has(u))return e.get(u);var o=n.apply(this,arguments);return e.set(u,o),o}if(typeof n!="function"||t&&typeof t!="function")throw new Ou($);return r.cache=new Pe.Cache,r}function Ke(n){var t=Rr(arguments,1),r=g(t,Ke.placeholder);
return Yr(n,R,null,t,r)}function Ve(n){var t=Rr(arguments,1),r=g(t,Ve.placeholder);return Yr(n,I,null,t,r)}function Ye(n){return oe(h(n)?n.length:w)&&Lu.call(n)==z||false}function Ze(n){return n&&1===n.nodeType&&h(n)&&-1<Lu.call(n).indexOf("Element")||false}function Ge(n){return h(n)&&typeof n.message=="string"&&Lu.call(n)==P||false}function Je(n){return typeof n=="function"||false}function Xe(n){var t=typeof n;return"function"==t||n&&"object"==t||false}function He(n){return null==n?false:Lu.call(n)==K?Bu.test(Wu.call(n)):h(n)&&wt.test(n)||false
}function Qe(n){return typeof n=="number"||h(n)&&Lu.call(n)==V||false}function nu(n){return h(n)&&Lu.call(n)==Z||false}function tu(n){return typeof n=="string"||h(n)&&Lu.call(n)==G||false}function ru(n){return h(n)&&oe(n.length)&&Ct[Lu.call(n)]||false}function eu(n){return nr(n,ou(n))}function uu(n){return vr(n,ou(n))}function ou(n){if(null==n)return[];Xe(n)||(n=Eu(n));for(var t=n.length,t=t&&oe(t)&&(So(n)||mo.nonEnumArgs&&Ye(n))&&t||0,r=n.constructor,e=-1,r=typeof r=="function"&&r.prototype===n,u=wu(t),o=0<t;++e<t;)u[e]=e+"";
for(var i in n)o&&ee(i,t)||"constructor"==i&&(r||!Uu.call(n,i))||u.push(i);return u}function iu(n){return Cr(n,Fo(n))}function fu(n){return(n=e(n))&&n.replace(bt,c)}function au(n){return(n=e(n))&&jt.test(n)?n.replace(At,"\\$&"):n}function cu(n,t,r){return r&&ue(n,t,r)&&(t=0),ao(n,t)}function lu(n,t){var r="";if(n=e(n),t=+t,1>t||!n||!ro(t))return r;do t%2&&(r+=n),t=Pu(t/2),n+=n;while(t);return r}function su(n,t,r){var u=n;return(n=e(n))?(r?ue(u,t,r):null==t)?n.slice(v(n),y(n)+1):(t+="",n.slice(o(n,t),i(n,t)+1)):n
}function pu(n,t,r){return r&&ue(n,t,r)&&(t=null),n=e(n),n.match(t||Rt)||[]}function hu(n){try{return n.apply(w,Rr(arguments,1))}catch(t){return Ge(t)?t:new xu(t)}}function _u(n,t,r){return r&&ue(n,t,r)&&(t=null),h(n)?yu(n):tr(n,t)}function gu(n){return function(){return n}}function vu(n){return n}function yu(n){return br(rr(n,true))}function du(n,t,r){if(null==r){var e=Xe(t),u=e&&Fo(t);((u=u&&u.length&&vr(t,u))?u.length:e)||(u=false,r=t,t=n,n=this)}u||(u=vr(t,Fo(t)));var o=true,e=-1,i=Je(n),f=u.length;
!1===r?o=false:Xe(r)&&"chain"in r&&(o=r.chain);for(;++e<f;){r=u[e];var a=t[r];n[r]=a,i&&(n.prototype[r]=function(t){return function(){var r=this.__chain__;if(o||r){var e=n(this.__wrapped__);return(e.__actions__=zt(this.__actions__)).push({func:t,args:arguments,thisArg:n}),e.__chain__=r,e}return r=[this.value()],Vu.apply(r,arguments),t.apply(n,r)}}(a))}return n}function mu(){}_=_?Dt.defaults($t.Object(),_,Dt.pick($t,Ot)):$t;var wu=_.Array,bu=_.Date,xu=_.Error,Au=_.Function,ju=_.Math,ku=_.Number,Eu=_.Object,Ru=_.RegExp,Iu=_.String,Ou=_.TypeError,Cu=wu.prototype,Tu=Eu.prototype,Su=(Su=_.window)&&Su.document,Wu=Au.prototype.toString,Nu=jr("length"),Uu=Tu.hasOwnProperty,Fu=0,Lu=Tu.toString,$u=_._,Bu=Ru("^"+au(Lu).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),zu=He(zu=_.ArrayBuffer)&&zu,Du=He(Du=zu&&new zu(0).slice)&&Du,Mu=ju.ceil,qu=_.clearTimeout,Pu=ju.floor,Ku=He(Ku=Eu.getPrototypeOf)&&Ku,Vu=Cu.push,Yu=Tu.propertyIsEnumerable,Zu=He(Zu=_.Set)&&Zu,Gu=_.setTimeout,Ju=Cu.splice,Xu=He(Xu=_.Uint8Array)&&Xu,Hu=He(Hu=_.WeakMap)&&Hu,Qu=function(){try{var n=He(n=_.Float64Array)&&n,t=new n(new zu(10),0,1)&&n
}catch(r){}return t}(),no=He(no=wu.isArray)&&no,to=He(to=Eu.create)&&to,ro=_.isFinite,eo=He(eo=Eu.keys)&&eo,uo=ju.max,oo=ju.min,io=He(io=bu.now)&&io,fo=He(fo=ku.isFinite)&&fo,ao=_.parseInt,co=ju.random,lo=ku.NEGATIVE_INFINITY,so=ku.POSITIVE_INFINITY,po=ju.pow(2,32)-1,ho=po-1,_o=po>>>1,go=Qu?Qu.BYTES_PER_ELEMENT:0,vo=ju.pow(2,53)-1,yo=Hu&&new Hu,mo=Wt.support={};!function(n){mo.funcDecomp=!He(_.WinRTError)&&kt.test(m),mo.funcNames=typeof Au.name=="string";try{mo.dom=11===Su.createDocumentFragment().nodeType
}catch(t){mo.dom=false}try{mo.nonEnumArgs=!Yu.call(arguments,1)}catch(r){mo.nonEnumArgs=true}}(0,0),Wt.templateSettings={escape:ht,evaluate:_t,interpolate:gt,variable:"",imports:{_:Wt}};var wo=function(){function n(){}return function(t){if(Xe(t)){n.prototype=t;var r=new n;n.prototype=null}return r||_.Object()}}(),bo=yo?function(n,t){return yo.set(n,t),n}:vu;Du||(Ur=zu&&Xu?function(n){var t=n.byteLength,r=Qu?Pu(t/go):0,e=r*go,u=new zu(t);if(r){var o=new Qu(u,0,r);o.set(new Qu(n,0,r))}return t!=e&&(o=new Xu(u,e),o.set(new Xu(n,e))),u
}:gu(null));var xo=to&&Zu?function(n){return new Lt(n)}:gu(null),Ao=yo?function(n){return yo.get(n)}:mu,jo=function(){var n=0,t=0;return function(r,e){var u=To(),o=N-(u-t);if(t=u,0<o){if(++n>=W)return r}else n=0;return bo(r,e)}}(),ko=$r(function(n,t,r){Uu.call(n,r)?++n[r]:n[r]=1}),Eo=$r(function(n,t,r){Uu.call(n,r)?n[r].push(t):n[r]=[t]}),Ro=$r(function(n,t,r){n[r]=t}),Io=qr(Vt),Oo=qr(function(n){for(var t=-1,r=n.length,e=so;++t<r;){var u=n[t];u<e&&(e=u)}return e},true),Co=$r(function(n,t,r){n[r?0:1].push(t)
},function(){return[[],[]]}),To=io||function(){return(new bu).getTime()},So=no||function(n){return h(n)&&oe(n.length)&&Lu.call(n)==D||false};mo.dom||(Ze=function(n){return n&&1===n.nodeType&&h(n)&&!No(n)||false});var Wo=fo||function(n){return typeof n=="number"&&ro(n)};(Je(/x/)||Xu&&!Je(Xu))&&(Je=function(n){return Lu.call(n)==K});var No=Ku?function(n){if(!n||Lu.call(n)!=Y)return false;var t=n.valueOf,r=He(t)&&(r=Ku(t))&&Ku(r);return r?n==r||Ku(n)==r:ce(n)}:ce,Uo=Br(Ht),Fo=eo?function(n){if(n)var t=n.constructor,r=n.length;
return typeof t=="function"&&t.prototype===n||typeof n!="function"&&r&&oe(r)?le(n):Xe(n)?eo(n):[]}:le,Lo=Br(Ar),$o=Dr(function(n,t,r){return t=t.toLowerCase(),n+(r?t.charAt(0).toUpperCase()+t.slice(1):t)}),Bo=Dr(function(n,t,r){return n+(r?"-":"")+t.toLowerCase()});8!=ao(It+"08")&&(cu=function(n,t,r){return(r?ue(n,t,r):null==t)?t=0:t&&(t=+t),n=su(n),ao(n,t||(mt.test(n)?16:10))});var zo=Dr(function(n,t,r){return n+(r?"_":"")+t.toLowerCase()}),Do=Dr(function(n,t,r){return n+(r?" ":"")+(t.charAt(0).toUpperCase()+t.slice(1))
});return Nt.prototype=wo(Wt.prototype),Ut.prototype=wo(Nt.prototype),Ut.prototype.constructor=Ut,Ft.prototype["delete"]=function(n){return this.has(n)&&delete this.__data__[n]},Ft.prototype.get=function(n){return"__proto__"==n?w:this.__data__[n]},Ft.prototype.has=function(n){return"__proto__"!=n&&Uu.call(this.__data__,n)},Ft.prototype.set=function(n,t){return"__proto__"!=n&&(this.__data__[n]=t),this},Lt.prototype.push=function(n){var t=this.data;typeof n=="string"||Xe(n)?t.set.add(n):t.hash[n]=true
},Pe.Cache=Ft,Wt.after=function(n,t){if(typeof t!="function"){if(typeof n!="function")throw new Ou($);var r=n;n=t,t=r}return n=ro(n=+n)?n:0,function(){return 1>--n?t.apply(this,arguments):void 0}},Wt.ary=function(n,t,r){return r&&ue(n,t,r)&&(t=null),t=n&&null==t?n.length:uo(+t||0,0),Yr(n,C,null,null,null,null,t)},Wt.assign=Uo,Wt.at=function(n){return oe(n?n.length:0)&&(n=se(n)),Qt(n,lr(arguments,false,false,1))},Wt.before=Le,Wt.bind=$e,Wt.bindAll=function(n){for(var t=n,r=1<arguments.length?lr(arguments,false,false,1):uu(n),e=-1,u=r.length;++e<u;){var o=r[e];
t[o]=Yr(t[o],x,t)}return t},Wt.bindKey=Be,Wt.callback=_u,Wt.chain=Ae,Wt.chunk=function(n,t,r){t=(r?ue(n,t,r):null==t)?1:uo(+t||1,1),r=0;for(var e=n?n.length:0,u=-1,o=wu(Mu(e/t));r<e;)o[++u]=Rr(n,r,r+=t);return o},Wt.compact=function(n){for(var t=-1,r=n?n.length:0,e=-1,u=[];++t<r;){var o=n[t];o&&(u[++e]=o)}return u},Wt.constant=gu,Wt.countBy=ko,Wt.create=function(n,t,r){var e=wo(n);return r&&ue(n,t,r)&&(t=null),t?nr(t,e,Fo(t)):e},Wt.curry=ze,Wt.curryRight=De,Wt.debounce=Me,Wt.defaults=function(n){if(null==n)return n;
var t=zt(arguments);return t.push(Jt),Uo.apply(w,t)},Wt.defer=function(n){return er(n,1,arguments,1)},Wt.delay=function(n,t){return er(n,t,arguments,2)},Wt.difference=function(){for(var n=-1,t=arguments.length;++n<t;){var r=arguments[n];if(So(r)||Ye(r))break}return ur(r,lr(arguments,false,true,++n))},Wt.drop=_e,Wt.dropRight=ge,Wt.dropRightWhile=function(n,t,r){var e=n?n.length:0;if(!e)return[];for(t=Hr(t,r,3);e--&&t(n[e],e,n););return Rr(n,0,e+1)},Wt.dropWhile=function(n,t,r){var e=n?n.length:0;if(!e)return[];
var u=-1;for(t=Hr(t,r,3);++u<e&&t(n[u],u,n););return Rr(n,u)},Wt.fill=function(n,t,r,e){var u=n?n.length:0;if(!u)return[];for(r&&typeof r!="number"&&ue(n,t,r)&&(r=0,e=u),u=n.length,r=null==r?0:+r||0,0>r&&(r=-r>u?0:u+r),e=typeof e=="undefined"||e>u?u:+e||0,0>e&&(e+=u),u=r>e?0:e>>>0,r>>>=0;r<u;)n[r++]=t;return n},Wt.filter=Re,Wt.flatten=function(n,t,r){var e=n?n.length:0;return r&&ue(n,t,r)&&(t=false),e?lr(n,t):[]},Wt.flattenDeep=function(n){return n&&n.length?lr(n,true):[]},Wt.flow=function(){var n=arguments,t=n.length;
if(!t)return function(n){return n};if(!qt(n,Je))throw new Ou($);return function(){for(var r=0,e=n[r].apply(this,arguments);++r<t;)e=n[r].call(this,e);return e}},Wt.flowRight=qe,Wt.forEach=Oe,Wt.forEachRight=Ce,Wt.forIn=function(n,t,r){return(typeof t!="function"||typeof r!="undefined")&&(t=Nr(t,r,3)),sr(n,t,ou)},Wt.forInRight=function(n,t,r){return t=Nr(t,r,3),pr(n,t,ou)},Wt.forOwn=function(n,t,r){return(typeof t!="function"||typeof r!="undefined")&&(t=Nr(t,r,3)),_r(n,t)},Wt.forOwnRight=function(n,t,r){return t=Nr(t,r,3),pr(n,t,Fo)
},Wt.functions=uu,Wt.groupBy=Eo,Wt.indexBy=Ro,Wt.initial=function(n){return ge(n,1)},Wt.intersection=function(){for(var n=[],r=-1,e=arguments.length,u=[],o=Qr(),i=o==t;++r<e;){var f=arguments[r];(So(f)||Ye(f))&&(n.push(f),u.push(i&&120<=f.length&&xo(r&&f)))}var e=n.length,i=n[0],a=-1,c=i?i.length:0,l=[],s=u[0];n:for(;++a<c;)if(f=i[a],0>(s?Bt(s,f):o(l,f))){for(r=e;--r;){var p=u[r];if(0>(p?Bt(p,f):o(n[r],f)))continue n}s&&s.push(f),l.push(f)}return l},Wt.invert=function(n,t,r){r&&ue(n,t,r)&&(t=null),r=-1;
for(var e=Fo(n),u=e.length,o={};++r<u;){var i=e[r],f=n[i];t?Uu.call(o,f)?o[f].push(i):o[f]=[i]:o[f]=i}return o},Wt.invoke=function(n,t){return yr(n,t,Rr(arguments,2))},Wt.keys=Fo,Wt.keysIn=ou,Wt.map=Te,Wt.mapValues=function(n,t,r){var e={};return t=Hr(t,r,3),_r(n,function(n,r,u){e[r]=t(n,r,u)}),e},Wt.matches=yu,Wt.matchesProperty=function(n,t){return xr(n+"",rr(t,true))},Wt.memoize=Pe,Wt.merge=Lo,Wt.mixin=du,Wt.negate=function(n){if(typeof n!="function")throw new Ou($);return function(){return!n.apply(this,arguments)
}},Wt.omit=function(n,t,r){if(null==n)return{};if(typeof t!="function"){var e=Kt(lr(arguments,false,false,1),Iu);return fe(n,ur(ou(n),e))}return t=Nr(t,r,3),ae(n,function(n,r,e){return!t(n,r,e)})},Wt.once=function(n){return Le(n,2)},Wt.pairs=function(n){for(var t=-1,r=Fo(n),e=r.length,u=wu(e);++t<e;){var o=r[t];u[t]=[o,n[o]]}return u},Wt.partial=Ke,Wt.partialRight=Ve,Wt.partition=Co,Wt.pick=function(n,t,r){return null==n?{}:typeof t=="function"?ae(n,Nr(t,r,3)):fe(n,lr(arguments,false,false,1))},Wt.pluck=function(n,t){return Te(n,jr(t))
},Wt.property=function(n){return jr(n+"")},Wt.propertyOf=function(n){return function(t){return null==n?w:n[t]}},Wt.pull=function(){var n=arguments[0];if(!n||!n.length)return n;for(var t=0,r=Qr(),e=arguments.length;++t<e;)for(var u=0,o=arguments[t];-1<(u=r(n,o,u));)Ju.call(n,u,1);return n},Wt.pullAt=function(t){var r=t||[],e=lr(arguments,false,false,1),u=e.length,o=Qt(r,e);for(e.sort(n);u--;){var i=parseFloat(e[u]);if(i!=f&&ee(i)){var f=i;Ju.call(r,i,1)}}return o},Wt.range=function(n,t,r){r&&ue(n,t,r)&&(t=r=null),n=+n||0,r=null==r?1:+r||0,null==t?(t=n,n=0):t=+t||0;
var e=-1;t=uo(Mu((t-n)/(r||1)),0);for(var u=wu(t);++e<t;)u[e]=n,n+=r;return u},Wt.rearg=function(n){var t=lr(arguments,false,false,1);return Yr(n,O,null,null,null,t)},Wt.reject=function(n,t,r){var e=So(n)?Pt:ar;return t=Hr(t,r,3),e(n,function(n,r,e){return!t(n,r,e)})},Wt.remove=function(n,t,r){var e=-1,u=n?n.length:0,o=[];for(t=Hr(t,r,3);++e<u;)r=n[e],t(r,e,n)&&(o.push(r),Ju.call(n,e--,1),u--);return o},Wt.rest=me,Wt.shuffle=Ue,Wt.slice=function(n,t,r){var e=n?n.length:0;return e?(r&&typeof r!="number"&&ue(n,t,r)&&(t=0,r=e),Rr(n,t,r)):[]
},Wt.sortBy=function(n,t,e){var u=-1,o=n?n.length:0,i=oe(o)?wu(o):[];return e&&ue(n,t,e)&&(t=null),t=Hr(t,e,3),or(n,function(n,r,e){i[++u]={a:t(n,r,e),b:u,c:n}}),r(i,f)},Wt.sortByAll=function(n){var t=arguments;3<t.length&&ue(t[1],t[2],t[3])&&(t=[n,t[1]]);var e=-1,u=n?n.length:0,o=lr(t,false,false,1),i=oe(u)?wu(u):[];return or(n,function(n){for(var t=o.length,r=wu(t);t--;)r[t]=null==n?w:n[o[t]];i[++e]={a:r,b:e,c:n}}),r(i,a)},Wt.spread=function(n){if(typeof n!="function")throw new Ou($);return function(t){return n.apply(this,t)
}},Wt.take=function(n,t,r){return n&&n.length?((r?ue(n,t,r):null==t)&&(t=1),Rr(n,0,0>t?0:t)):[]},Wt.takeRight=function(n,t,r){var e=n?n.length:0;return e?((r?ue(n,t,r):null==t)&&(t=1),t=e-(+t||0),Rr(n,0>t?0:t)):[]},Wt.takeRightWhile=function(n,t,r){var e=n?n.length:0;if(!e)return[];for(t=Hr(t,r,3);e--&&t(n[e],e,n););return Rr(n,e+1)},Wt.takeWhile=function(n,t,r){var e=n?n.length:0;if(!e)return[];var u=-1;for(t=Hr(t,r,3);++u<e&&t(n[u],u,n););return Rr(n,0,u)},Wt.tap=function(n,t,r){return t.call(r,n),n
},Wt.throttle=function(n,t,r){var e=true,u=true;if(typeof n!="function")throw new Ou($);return false===r?e=false:Xe(r)&&(e="leading"in r?!!r.leading:e,u="trailing"in r?!!r.trailing:u),St.leading=e,St.maxWait=+t,St.trailing=u,Me(n,t,St)},Wt.thru=je,Wt.times=function(n,t,r){if(n=+n,1>n||!ro(n))return[];var e=-1,u=wu(oo(n,po));for(t=Nr(t,r,1);++e<n;)e<po?u[e]=t(e):t(e);return u},Wt.toArray=function(n){var t=n?n.length:0;return oe(t)?t?zt(n):[]:iu(n)},Wt.toPlainObject=eu,Wt.transform=function(n,t,r,e){var u=So(n)||ru(n);
return t=Hr(t,e,4),null==r&&(u||Xe(n)?(e=n.constructor,r=u?So(n)?new e:[]:wo(Je(e)&&e.prototype)):r={}),(u?Mt:_r)(n,function(n,e,u){return t(r,n,e,u)}),r},Wt.union=function(){return Or(lr(arguments,false,true))},Wt.uniq=we,Wt.unzip=be,Wt.values=iu,Wt.valuesIn=function(n){return Cr(n,ou(n))},Wt.where=function(n,t){return Re(n,br(t))},Wt.without=function(n){return ur(n,Rr(arguments,1))},Wt.wrap=function(n,t){return t=null==t?vu:t,Yr(t,R,null,[n],[])},Wt.xor=function(){for(var n=-1,t=arguments.length;++n<t;){var r=arguments[n];
if(So(r)||Ye(r))var e=e?ur(e,r).concat(ur(r,e)):r}return e?Or(e):[]},Wt.zip=function(){for(var n=arguments.length,t=wu(n);n--;)t[n]=arguments[n];return be(t)},Wt.zipObject=xe,Wt.backflow=qe,Wt.collect=Te,Wt.compose=qe,Wt.each=Oe,Wt.eachRight=Ce,Wt.extend=Uo,Wt.iteratee=_u,Wt.methods=uu,Wt.object=xe,Wt.select=Re,Wt.tail=me,Wt.unique=we,du(Wt,Wt),Wt.attempt=hu,Wt.camelCase=$o,Wt.capitalize=function(n){return(n=e(n))&&n.charAt(0).toUpperCase()+n.slice(1)},Wt.clone=function(n,t,r,e){return typeof t!="boolean"&&null!=t&&(e=r,r=ue(n,t,e)?null:t,t=false),r=typeof r=="function"&&Nr(r,e,1),rr(n,t,r)
},Wt.cloneDeep=function(n,t,r){return t=typeof t=="function"&&Nr(t,r,1),rr(n,true,t)},Wt.deburr=fu,Wt.endsWith=function(n,t,r){n=e(n),t+="";var u=n.length;return r=(typeof r=="undefined"?u:oo(0>r?0:+r||0,u))-t.length,0<=r&&n.indexOf(t,r)==r},Wt.escape=function(n){return(n=e(n))&&pt.test(n)?n.replace(lt,l):n},Wt.escapeRegExp=au,Wt.every=Ee,Wt.find=Ie,Wt.findIndex=ve,Wt.findKey=function(n,t,r){return t=Hr(t,r,3),cr(n,t,_r,true)},Wt.findLast=function(n,t,r){return t=Hr(t,r,3),cr(n,t,ir)},Wt.findLastIndex=function(n,t,r){var e=n?n.length:0;
for(t=Hr(t,r,3);e--;)if(t(n[e],e,n))return e;return-1},Wt.findLastKey=function(n,t,r){return t=Hr(t,r,3),cr(n,t,gr,true)},Wt.findWhere=function(n,t){return Ie(n,br(t))},Wt.first=ye,Wt.has=function(n,t){return n?Uu.call(n,t):false},Wt.identity=vu,Wt.includes=ke,Wt.indexOf=de,Wt.isArguments=Ye,Wt.isArray=So,Wt.isBoolean=function(n){return true===n||false===n||h(n)&&Lu.call(n)==M||false},Wt.isDate=function(n){return h(n)&&Lu.call(n)==q||false},Wt.isElement=Ze,Wt.isEmpty=function(n){if(null==n)return true;var t=n.length;
return oe(t)&&(So(n)||tu(n)||Ye(n)||h(n)&&Je(n.splice))?!t:!Fo(n).length},Wt.isEqual=function(n,t,r,e){return r=typeof r=="function"&&Nr(r,e,3),!r&&ie(n)&&ie(t)?n===t:(e=r?r(n,t):w,typeof e=="undefined"?dr(n,t,r):!!e)},Wt.isError=Ge,Wt.isFinite=Wo,Wt.isFunction=Je,Wt.isMatch=function(n,t,r,e){var u=Fo(t),o=u.length;if(r=typeof r=="function"&&Nr(r,e,3),!r&&1==o){var i=u[0];if(e=t[i],ie(e))return null!=n&&e===n[i]&&Uu.call(n,i)}for(var i=wu(o),f=wu(o);o--;)e=i[o]=t[u[o]],f[o]=ie(e);return mr(n,u,i,f,r)
},Wt.isNaN=function(n){return Qe(n)&&n!=+n},Wt.isNative=He,Wt.isNull=function(n){return null===n},Wt.isNumber=Qe,Wt.isObject=Xe,Wt.isPlainObject=No,Wt.isRegExp=nu,Wt.isString=tu,Wt.isTypedArray=ru,Wt.isUndefined=function(n){return typeof n=="undefined"},Wt.kebabCase=Bo,Wt.last=function(n){var t=n?n.length:0;return t?n[t-1]:w},Wt.lastIndexOf=function(n,t,r){var e=n?n.length:0;if(!e)return-1;var u=e;if(typeof r=="number")u=(0>r?uo(e+r,0):oo(r||0,e-1))+1;else if(r)return u=Sr(n,t,true)-1,n=n[u],(t===t?t===n:n!==n)?u:-1;
if(t!==t)return p(n,u,true);for(;u--;)if(n[u]===t)return u;return-1},Wt.max=Io,Wt.min=Oo,Wt.noConflict=function(){return _._=$u,this},Wt.noop=mu,Wt.now=To,Wt.pad=function(n,t,r){n=e(n),t=+t;var u=n.length;return u<t&&ro(t)?(u=(t-u)/2,t=Pu(u),u=Mu(u),r=Kr("",u,r),r.slice(0,t)+n+r):n},Wt.padLeft=function(n,t,r){return(n=e(n))&&Kr(n,t,r)+n},Wt.padRight=function(n,t,r){return(n=e(n))&&n+Kr(n,t,r)},Wt.parseInt=cu,Wt.random=function(n,t,r){r&&ue(n,t,r)&&(t=r=null);var e=null==n,u=null==t;return null==r&&(u&&typeof n=="boolean"?(r=n,n=1):typeof t=="boolean"&&(r=t,u=true)),e&&u&&(t=1,u=false),n=+n||0,u?(t=n,n=0):t=+t||0,r||n%1||t%1?(r=co(),oo(n+r*(t-n+parseFloat("1e-"+((r+"").length-1))),t)):kr(n,t)
},Wt.reduce=Se,Wt.reduceRight=We,Wt.repeat=lu,Wt.result=function(n,t,r){return t=null==n?w:n[t],typeof t=="undefined"&&(t=r),Je(t)?t.call(n):t},Wt.runInContext=m,Wt.size=function(n){var t=n?n.length:0;return oe(t)?t:Fo(n).length},Wt.snakeCase=zo,Wt.some=Fe,Wt.sortedIndex=function(n,t,r,e){var u=Hr(r);return u===tr&&null==r?Sr(n,t):Wr(n,t,u(r,e,1))},Wt.sortedLastIndex=function(n,t,r,e){var u=Hr(r);return u===tr&&null==r?Sr(n,t,true):Wr(n,t,u(r,e,1),true)},Wt.startCase=Do,Wt.startsWith=function(n,t,r){return n=e(n),r=null==r?0:oo(0>r?0:+r||0,n.length),n.lastIndexOf(t,r)==r
},Wt.template=function(n,t,r){var u=Wt.templateSettings;r&&ue(n,t,r)&&(t=r=null),n=e(n),t=Ht(Ht({},r||t),u,Xt),r=Ht(Ht({},t.imports),u.imports,Xt);var o,i,f=Fo(r),a=Cr(r,f),c=0;r=t.interpolate||xt;var l="__p+='";r=Ru((t.escape||xt).source+"|"+r.source+"|"+(r===gt?vt:xt).source+"|"+(t.evaluate||xt).source+"|$","g");var p="sourceURL"in t?"//# sourceURL="+t.sourceURL+"\n":"";if(n.replace(r,function(t,r,e,u,f,a){return e||(e=u),l+=n.slice(c,a).replace(Et,s),r&&(o=true,l+="'+__e("+r+")+'"),f&&(i=true,l+="';"+f+";\n__p+='"),e&&(l+="'+((__t=("+e+"))==null?'':__t)+'"),c=a+t.length,t
}),l+="';",(t=t.variable)||(l="with(obj){"+l+"}"),l=(i?l.replace(it,""):l).replace(ft,"$1").replace(at,"$1;"),l="function("+(t||"obj")+"){"+(t?"":"obj||(obj={});")+"var __t,__p=''"+(o?",__e=_.escape":"")+(i?",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}":";")+l+"return __p}",t=hu(function(){return Au(f,p+"return "+l).apply(w,a)}),t.source=l,Ge(t))throw t;return t},Wt.trim=su,Wt.trimLeft=function(n,t,r){var u=n;return(n=e(n))?n.slice((r?ue(u,t,r):null==t)?v(n):o(n,t+"")):n
},Wt.trimRight=function(n,t,r){var u=n;return(n=e(n))?(r?ue(u,t,r):null==t)?n.slice(0,y(n)+1):n.slice(0,i(n,t+"")+1):n},Wt.trunc=function(n,t,r){r&&ue(n,t,r)&&(t=null);var u=T;if(r=S,null!=t)if(Xe(t)){var o="separator"in t?t.separator:o,u="length"in t?+t.length||0:u;r="omission"in t?e(t.omission):r}else u=+t||0;if(n=e(n),u>=n.length)return n;if(u-=r.length,1>u)return r;if(t=n.slice(0,u),null==o)return t+r;if(nu(o)){if(n.slice(u).search(o)){var i,f=n.slice(0,u);for(o.global||(o=Ru(o.source,(yt.exec(o)||"")+"g")),o.lastIndex=0;n=o.exec(f);)i=n.index;
t=t.slice(0,null==i?u:i)}}else n.indexOf(o,u)!=u&&(o=t.lastIndexOf(o),-1<o&&(t=t.slice(0,o)));return t+r},Wt.unescape=function(n){return(n=e(n))&&st.test(n)?n.replace(ct,d):n},Wt.uniqueId=function(n){var t=++Fu;return e(n)+t},Wt.words=pu,Wt.all=Ee,Wt.any=Fe,Wt.contains=ke,Wt.detect=Ie,Wt.foldl=Se,Wt.foldr=We,Wt.head=ye,Wt.include=ke,Wt.inject=Se,du(Wt,function(){var n={};return _r(Wt,function(t,r){Wt.prototype[r]||(n[r]=t)}),n}(),false),Wt.sample=Ne,Wt.prototype.sample=function(n){return this.__chain__||null!=n?this.thru(function(t){return Ne(t,n)
}):Ne(this.value())},Wt.VERSION=b,Mt("bind bindKey curry curryRight partial partialRight".split(" "),function(n){Wt[n].placeholder=Wt}),Mt(["filter","map","takeWhile"],function(n,t){var r=t==U,e=t==L;Ut.prototype[n]=function(n,u){var o=this.clone(),i=o.__filtered__,f=o.__iteratees__||(o.__iteratees__=[]);return o.__filtered__=i||r||e&&0>o.__dir__,f.push({iteratee:Hr(n,u,3),type:t}),o}}),Mt(["drop","take"],function(n,t){var r="__"+n+"Count__",e=n+"While";Ut.prototype[n]=function(e){e=null==e?1:uo(Pu(e)||0,0);
var u=this.clone();if(u.__filtered__){var o=u[r];u[r]=t?oo(o,e):o+e}else(u.__views__||(u.__views__=[])).push({size:e,type:n+(0>u.__dir__?"Right":"")});return u},Ut.prototype[n+"Right"]=function(t){return this.reverse()[n](t).reverse()},Ut.prototype[n+"RightWhile"]=function(n,t){return this.reverse()[e](n,t).reverse()}}),Mt(["first","last"],function(n,t){var r="take"+(t?"Right":"");Ut.prototype[n]=function(){return this[r](1).value()[0]}}),Mt(["initial","rest"],function(n,t){var r="drop"+(t?"":"Right");
Ut.prototype[n]=function(){return this[r](1)}}),Mt(["pluck","where"],function(n,t){var r=t?"filter":"map",e=t?br:jr;Ut.prototype[n]=function(n){return this[r](e(n))}}),Ut.prototype.compact=function(){return this.filter(vu)},Ut.prototype.dropWhile=function(n,t){var r;return n=Hr(n,t,3),this.filter(function(t,e,u){return r||(r=!n(t,e,u))})},Ut.prototype.reject=function(n,t){return n=Hr(n,t,3),this.filter(function(t,r,e){return!n(t,r,e)})},Ut.prototype.slice=function(n,t){n=null==n?0:+n||0;var r=0>n?this.takeRight(-n):this.drop(n);
return typeof t!="undefined"&&(t=+t||0,r=0>t?r.dropRight(-t):r.take(t-n)),r},Ut.prototype.toArray=function(){return this.drop(0)},_r(Ut.prototype,function(n,t){var r=Wt[t],e=/^(?:first|last)$/.test(t);Wt.prototype[t]=function(){function t(n){return n=[n],Vu.apply(n,o),r.apply(Wt,n)}var u=this.__wrapped__,o=arguments,i=this.__chain__,f=!!this.__actions__.length,a=u instanceof Ut,c=a&&!f;return e&&!i?c?n.call(u):r.call(Wt,this.value()):a||So(u)?(u=n.apply(c?u:new Ut(this),o),e||!f&&!u.__actions__||(u.__actions__||(u.__actions__=[])).push({func:je,args:[t],thisArg:Wt}),new Nt(u,i)):this.thru(t)
}}),Mt("concat join pop push shift sort splice unshift".split(" "),function(n){var t=Cu[n],r=/^(?:push|sort|unshift)$/.test(n)?"tap":"thru",e=/^(?:join|pop|shift)$/.test(n);Wt.prototype[n]=function(){var n=arguments;return e&&!this.__chain__?t.apply(this.value(),n):this[r](function(r){return t.apply(r,n)})}}),Ut.prototype.clone=function(){var n=this.__actions__,t=this.__iteratees__,r=this.__views__,e=new Ut(this.__wrapped__);return e.__actions__=n?zt(n):null,e.__dir__=this.__dir__,e.__dropCount__=this.__dropCount__,e.__filtered__=this.__filtered__,e.__iteratees__=t?zt(t):null,e.__takeCount__=this.__takeCount__,e.__views__=r?zt(r):null,e
},Ut.prototype.reverse=function(){if(this.__filtered__){var n=new Ut(this);n.__dir__=-1,n.__filtered__=true}else n=this.clone(),n.__dir__*=-1;return n},Ut.prototype.value=function(){var n=this.__wrapped__.value();if(!So(n))return Tr(n,this.__actions__);var t,r=this.__dir__,e=0>r;t=n.length;for(var u=this.__views__,o=0,i=-1,f=u?u.length:0;++i<f;){var a=u[i],c=a.size;switch(a.type){case"drop":o+=c;break;case"dropRight":t-=c;break;case"take":t=oo(t,o+c);break;case"takeRight":o=uo(o,t-c)}}t={start:o,end:t},i=t.start,f=t.end,t=f-i,u=this.__dropCount__,o=oo(t,this.__takeCount__),e=e?f:i-1,f=(i=this.__iteratees__)?i.length:0,a=0,c=[];
n:for(;t--&&a<o;){for(var e=e+r,l=-1,s=n[e];++l<f;){var p=i[l],h=p.iteratee(s,e,n),p=p.type;if(p==F)s=h;else if(!h){if(p==U)continue n;break n}}u?u--:c[a++]=s}return c},Wt.prototype.chain=function(){return Ae(this)},Wt.prototype.commit=function(){return new Nt(this.value(),this.__chain__)},Wt.prototype.plant=function(n){for(var t,r=this;r instanceof Nt;){var e=he(r);t?u.__wrapped__=e:t=e;var u=e,r=r.__wrapped__}return u.__wrapped__=n,t},Wt.prototype.reverse=function(){var n=this.__wrapped__;return n instanceof Ut?(this.__actions__.length&&(n=new Ut(this)),new Nt(n.reverse(),this.__chain__)):this.thru(function(n){return n.reverse()
})},Wt.prototype.toString=function(){return this.value()+""},Wt.prototype.run=Wt.prototype.toJSON=Wt.prototype.valueOf=Wt.prototype.value=function(){return Tr(this.__wrapped__,this.__actions__)},Wt.prototype.collect=Wt.prototype.map,Wt.prototype.head=Wt.prototype.first,Wt.prototype.select=Wt.prototype.filter,Wt.prototype.tail=Wt.prototype.rest,Wt}var w,b="3.2.0",x=1,A=2,j=4,k=8,E=16,R=32,I=64,O=128,C=256,T=30,S="...",W=150,N=16,U=0,F=1,L=2,$="Expected a function",B="__lodash_placeholder__",z="[object Arguments]",D="[object Array]",M="[object Boolean]",q="[object Date]",P="[object Error]",K="[object Function]",V="[object Number]",Y="[object Object]",Z="[object RegExp]",G="[object String]",J="[object ArrayBuffer]",X="[object Float32Array]",H="[object Float64Array]",Q="[object Int8Array]",nt="[object Int16Array]",tt="[object Int32Array]",rt="[object Uint8Array]",et="[object Uint8ClampedArray]",ut="[object Uint16Array]",ot="[object Uint32Array]",it=/\b__p\+='';/g,ft=/\b(__p\+=)''\+/g,at=/(__e\(.*?\)|\b__t\))\+'';/g,ct=/&(?:amp|lt|gt|quot|#39|#96);/g,lt=/[&<>"'`]/g,st=RegExp(ct.source),pt=RegExp(lt.source),ht=/<%-([\s\S]+?)%>/g,_t=/<%([\s\S]+?)%>/g,gt=/<%=([\s\S]+?)%>/g,vt=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,yt=/\w*$/,dt=/^\s*function[ \n\r\t]+\w/,mt=/^0[xX]/,wt=/^\[object .+?Constructor\]$/,bt=/[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g,xt=/($^)/,At=/[.*+?^${}()|[\]\/\\]/g,jt=RegExp(At.source),kt=/\bthis\b/,Et=/['\n\r\u2028\u2029\\]/g,Rt=RegExp("[A-Z\\xc0-\\xd6\\xd8-\\xde]{2,}(?=[A-Z\\xc0-\\xd6\\xd8-\\xde][a-z\\xdf-\\xf6\\xf8-\\xff]+)|[A-Z\\xc0-\\xd6\\xd8-\\xde]?[a-z\\xdf-\\xf6\\xf8-\\xff]+|[A-Z\\xc0-\\xd6\\xd8-\\xde]+|[0-9]+","g"),It=" \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000",Ot="Array ArrayBuffer Date Error Float32Array Float64Array Function Int8Array Int16Array Int32Array Math Number Object RegExp Set String _ clearTimeout document isFinite parseInt setTimeout TypeError Uint8Array Uint8ClampedArray Uint16Array Uint32Array WeakMap window WinRTError".split(" "),Ct={};
Ct[X]=Ct[H]=Ct[Q]=Ct[nt]=Ct[tt]=Ct[rt]=Ct[et]=Ct[ut]=Ct[ot]=true,Ct[z]=Ct[D]=Ct[J]=Ct[M]=Ct[q]=Ct[P]=Ct[K]=Ct["[object Map]"]=Ct[V]=Ct[Y]=Ct[Z]=Ct["[object Set]"]=Ct[G]=Ct["[object WeakMap]"]=false;var Tt={};Tt[z]=Tt[D]=Tt[J]=Tt[M]=Tt[q]=Tt[X]=Tt[H]=Tt[Q]=Tt[nt]=Tt[tt]=Tt[V]=Tt[Y]=Tt[Z]=Tt[G]=Tt[rt]=Tt[et]=Tt[ut]=Tt[ot]=true,Tt[P]=Tt[K]=Tt["[object Map]"]=Tt["[object Set]"]=Tt["[object WeakMap]"]=false;var St={leading:false,maxWait:0,trailing:false},Wt={"\xc0":"A","\xc1":"A","\xc2":"A","\xc3":"A","\xc4":"A","\xc5":"A","\xe0":"a","\xe1":"a","\xe2":"a","\xe3":"a","\xe4":"a","\xe5":"a","\xc7":"C","\xe7":"c","\xd0":"D","\xf0":"d","\xc8":"E","\xc9":"E","\xca":"E","\xcb":"E","\xe8":"e","\xe9":"e","\xea":"e","\xeb":"e","\xcc":"I","\xcd":"I","\xce":"I","\xcf":"I","\xec":"i","\xed":"i","\xee":"i","\xef":"i","\xd1":"N","\xf1":"n","\xd2":"O","\xd3":"O","\xd4":"O","\xd5":"O","\xd6":"O","\xd8":"O","\xf2":"o","\xf3":"o","\xf4":"o","\xf5":"o","\xf6":"o","\xf8":"o","\xd9":"U","\xda":"U","\xdb":"U","\xdc":"U","\xf9":"u","\xfa":"u","\xfb":"u","\xfc":"u","\xdd":"Y","\xfd":"y","\xff":"y","\xc6":"Ae","\xe6":"ae","\xde":"Th","\xfe":"th","\xdf":"ss"},Nt={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"},Ut={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'","&#96;":"`"},Ft={"function":true,object:true},Lt={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},$t=Ft[typeof window]&&window!==(this&&this.window)?window:this,Bt=Ft[typeof exports]&&exports&&!exports.nodeType&&exports,Ft=Ft[typeof module]&&module&&!module.nodeType&&module,zt=Bt&&Ft&&typeof global=="object"&&global;
!zt||zt.global!==zt&&zt.window!==zt&&zt.self!==zt||($t=zt);var zt=Ft&&Ft.exports===Bt&&Bt,Dt=m();typeof define=="function"&&typeof define.amd=="object"&&define.amd?($t._=Dt, define(function(){return Dt})):Bt&&Ft?zt?(Ft.exports=Dt)._=Dt:Bt._=Dt:$t._=Dt}).call(this);
angular.module('VirtualBookshelf')
.factory('archive', function (Data) {
	var archive = {};

	archive.sendExternalURL = function(externalURL, tags) {
		return Data.postArchiveImage(externalURL, tags);
	};

	return archive;
});
angular.module('VirtualBookshelf')
.factory('cache', function ($q, $log, Data) {
	var cache = {};

	var library = null;
	var sections = {};
	var books = {};
	var images = {};

	cache.init = function(libraryModel, sectionModels, bookModels, imageUrls) {
		var libraryLoad = loadLibraryData(libraryModel);
		var sectionsLoad = [];
		var booksLoad = [];
		var imagesLoad = [];
		var model, url; // iterators

		for (model in sectionModels) {
			sectionsLoad.push(addSection(model));
		}

		for (model in bookModels) {
			booksLoad.push(addBook(model));
		}

		for (url in imageUrls) {
			imagesLoad.push(addImage(url));
		}

		var promise = $q.all({
			libraryCache: libraryLoad, 
			sectionsLoad: $q.all(sectionsLoad), 
			booksLoad: $q.all(booksLoad),
			imagesLoad: $q.all(imagesLoad)
		}).then(function (results) {
			library = results.libraryCache;
		});

		return promise;
	};

	cache.getLibrary = function() {
		return library;
	};

	cache.getSection = function(model) {
		return commonGetter(sections, model, addSection);
	};

	cache.getBook = function(model) {
		return commonGetter(books, model, addBook);
	};

	cache.getImage = function(url) {
		return commonGetter(images, url, addImage);
	};

	var commonGetter = function(from, key, addFunction) {
		var result = from[key];

		if(!result) {
			result = addFunction(key);
		}

		return $q.when(result);
	};

	var commonAdder = function(where, what, loader, key) {
		var promise = loader(what).then(function (loadedCache) {
			where[key || what] = loadedCache;

			return loadedCache;
		});

		return promise;
	};

	var addSection = function(model) {
		return commonAdder(sections, model, loadSectionData);
	};

	var addBook = function(model) {
		return commonAdder(books, model, loadBookData);
	};

	var addImage = function(url) {
		return commonAdder(images, '/outside?link=' + url, Data.loadImage, url).catch(function (error) {
			$log.error('Error adding image:', url);
			return null;
		});
	};

	var loadLibraryData = function(model) {
		var path = '/obj/libraries/{model}/'.replace('{model}', model);
        var modelUrl = path + 'model.json';
        var mapUrl = path + 'map.jpg';

        var promise = $q.all({
        	geometry: Data.loadGeometry(modelUrl), 
        	mapImage: Data.loadImage(mapUrl)
        });

        return promise;
	};

	var loadSectionData = function(model) {
		var path = '/obj/sections/{model}/'.replace('{model}', model);
        var modelUrl = path + 'model.js';
        var mapUrl = path + 'map.jpg';
        var dataUrl = path + 'data.json';

        var promise = $q.all({
        	geometry: Data.loadGeometry(modelUrl), 
        	mapImage: Data.loadImage(mapUrl), 
        	data: Data.getData(dataUrl)
        });

        return promise;
	};

	var loadBookData = function(model) {
		var path = '/obj/books/{model}/'.replace('{model}', model);
        var modelUrl = path + 'model.js';
        var mapUrl = path + 'map.jpg';

        var promise = $q.all({
        	geometry: Data.loadGeometry(modelUrl),
        	mapImage: Data.loadImage(mapUrl) 
        });

        return promise;
	};

	return cache;
});
angular.module('VirtualBookshelf')
.factory('Camera', function (CameraObject) {
	var Camera = {
		HEIGTH: 1.5,
		object: new CameraObject(),
		setParent: function(parent) {
			parent.add(this.object);
		},
		getPosition: function() {
			return this.object.position;
		}
	};

	Camera.init = function(width, height) {
		Camera.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 50);
		this.object.position = new THREE.Vector3(0, Camera.HEIGTH, 0);
		this.object.rotation.order = 'YXZ';

		var candle = new THREE.PointLight(0x665555, 1.6, 10);
		candle.position.set(0, 0, 0);
		this.object.add(candle);

		this.object.add(Camera.camera);
	};

	Camera.rotate = function(x, y) {
		var newX = this.object.rotation.x + y * 0.0001 || 0;
		var newY = this.object.rotation.y + x * 0.0001 || 0;

		if(newX < 1.57 && newX > -1.57) {	
			this.object.rotation.x = newX;
		}

		this.object.rotation.y = newY;
	};

	Camera.go = function(speed) {
		var direction = this.getVector();
		var newPosition = this.object.position.clone();
		newPosition.add(direction.multiplyScalar(speed));

		this.object.move(newPosition);
	};

	Camera.getVector = function() {
		var vector = new THREE.Vector3(0, 0, -1);

		return vector.applyEuler(this.object.rotation);
	};

	return Camera;
});
angular.module('VirtualBookshelf')
/* 
 * controls.js is a service for processing not UI(menus) events 
 * like mouse, keyboard, touch or gestures.
 *
 * TODO: remove all busines logic from there and leave only
 * events functionality to make it more similar to usual controller
 */
.factory('Controls', function ($q, $log, SelectorMeta, BookObject, ShelfObject, SectionObject, Camera, Data, navigation, environment, mouse, selector) {
	var Controls = {};

	Controls.BUTTONS_ROTATE_SPEED = 100;
	Controls.BUTTONS_GO_SPEED = 0.02;

	Controls.Pocket = {
		_books: {},

		selectObject: function(target) {
			var 
				dataObject = this._books[target.value]

			Data.createBook(dataObject, function (book, dataObject) {
				Controls.Pocket.remove(dataObject.id);
				Controls.selected.select(book, null);
				// book.changed = true;
			});
		},
		remove: function(id) {
			this._books[id] = null;
			delete this._books[id];
		},
		put: function(dataObject) {
			this._books[dataObject.id] = dataObject;
		},
		getBooks: function() {
			return this._books;
		},
		isEmpty: function() {
			return this._books.length == 0;
		}
	};

	Controls.selected = {
		object: null,
		// parent: null,
		getted: null,
		// point: null,

		isBook: function() {
			return selector.isSelectedBook();
		},
		isSection: function() {
			return selector.isSelectedSection();
		},
		isShelf: function() {
			return selector.isSelectedShelf();
		},
		isMovable: function() {
			return Boolean(this.isBook() || this.isSection());
		},
		isRotatable: function() {
			return Boolean(this.isSection());
		},
		clear: function() {
			selector.unselect();
			this.object = null;
			this.getted = null;
		},
		select: function() {
			selector.selectFocused();

			// this.clear();
			this.object = selector.getSelectedObject();
			// this.point = point;

		},
		release: function() {
			var selectedObject = selector.getSelectedObject();
			//TODO: there is no selected object after remove frome scene
			if(this.isBook() && !selectedObject.parent) {
				Controls.Pocket.put(selectedObject.dataObject);
				this.clear();
			}

			this.save();
		},
		get: function() {
			// if(this.isBook() && !this.isGetted()) {
			// 	this.getted = true;
			// 	this.parent = this.object.parent;
			// 	this.object.position.set(0, 0, -this.object.geometry.boundingBox.max.z - 0.25);
			// 	Camera.camera.add(this.object);			
			// } else {
			// 	this.put();
			// }
		},
		put: function() {
			// if(this.isGetted()) {
			// 	this.parent.add(this.object);
			// 	this.object.reload();//position
			// 	this.clear();
			// }
		},
		isGetted: function() {
			return this.isBook() && this.getted;
		},
		save: function() {
			var selectedObject = selector.getSelectedObject();
			if(this.isMovable() && selectedObject.changed) {
				selectedObject.save();
			}
		}
	};

	Controls.init = function() {
		Controls.clear();
		Controls.initListeners();
	};

	Controls.initListeners = function() {
		document.addEventListener('dblclick', Controls.onDblClick, false);
		document.addEventListener('mousedown', Controls.onMouseDown, false);
		document.addEventListener('mouseup', Controls.onMouseUp, false);
		document.addEventListener('mousemove', Controls.onMouseMove, false);	
		document.oncontextmenu = function() {return false;}
	};

	Controls.clear = function() {
		Controls.selected.clear();	
	};

	Controls.update = function() {
		if(!Controls.selected.isGetted()) {
			if(mouse[3]) {
				Camera.rotate(mouse.longX, mouse.longY);
			}

			if((mouse[1] && mouse[3]) || navigation.state.forward) {
				Camera.go(this.BUTTONS_GO_SPEED);
			} else if(navigation.state.backward) {
				Camera.go(-this.BUTTONS_GO_SPEED);
			} else if(navigation.state.left) {
				Camera.rotate(this.BUTTONS_ROTATE_SPEED, 0);
			} else if(navigation.state.right) {
				Camera.rotate(-this.BUTTONS_ROTATE_SPEED, 0);
			}
		}
	};

	// Events

	Controls.onDblClick = function(event) {
		if(mouse.isCanvas()) {
			switch(event.which) {
				case 1: Controls.selected.get(); break;
			}   	
		}
	};

	Controls.onMouseDown = function(event) {
		mouse.down(event); 

		if(mouse.isCanvas() || mouse.isPocketBook()) {
			// event.preventDefault();//TODO: research (enabled cannot set cursor to input)

			if(mouse[1] && !mouse[3] && !Controls.selected.isGetted()) {
				if(mouse.isCanvas()) {
					Controls.selectObject();
					Controls.selected.select();
				} else if(mouse.isPocketBook()) {
					Controls.Pocket.selectObject(mouse.target);
				}
			}
		}
	};

	Controls.onMouseUp = function(event) {
		mouse.up(event);
		
		switch(event.which) {
			 case 1: Controls.selected.release(); break;
		}
	};

	Controls.onMouseMove = function(event) {
		mouse.move(event);

		if(mouse.isCanvas()) {
			event.preventDefault();

		 	if(!Controls.selected.isGetted()) {
				if(mouse[1] && !mouse[3]) {		
					Controls.moveObject();
				} else {
					Controls.selectObject();
				}
			} else {
				// var obj = Controls.selected.object;

				// if(obj instanceof BookObject) {
				// 	if(mouse[1]) {
				// 		obj.moveElement(mouse.dX, mouse.dY, UI.menu.createBook.edited);
				// 	}
				// 	if(mouse[2] && UI.menu.createBook.edited == 'cover') {
				//  		obj.scaleElement(mouse.dX, mouse.dY);
				// 	}
				// 	if(mouse[3]) {
				//  		obj.rotate(mouse.dX, mouse.dY, true);
				// 	}
				// } 
			}
		}
	};

	//****

	Controls.selectObject = function() {
		var
			intersected,
			object;

		if(mouse.isCanvas() && environment.library) {
			//TODO: optimize
			intersected = mouse.getIntersected(environment.library.children, true, [BookObject]);
			if(!intersected) {
				intersected = mouse.getIntersected(environment.library.children, true, [ShelfObject]);
			}
			if(!intersected) {
				intersected = mouse.getIntersected(environment.library.children, true, [SectionObject]);
			}
			if(intersected) {
				object = intersected.object;
			}

			selector.focus(new SelectorMeta(object));
		}
	};

	Controls.moveObject = function() {
		var 
			mouseVector,
			newPosition,
			intersected,
			parent,
			oldParent;
		var selectedObject;

		if(Controls.selected.isBook() || (Controls.selected.isSection()/* && UI.menu.sectionMenu.isMoveOption()*/)) {
			selectedObject = selector.getSelectedObject();
			mouseVector = Camera.getVector();	

			newPosition = selectedObject.position.clone();
			oldParent = selectedObject.parent;

			if(Controls.selected.isBook()) {
				intersected = mouse.getIntersected(environment.library.children, true, [ShelfObject]);
				selectedObject.setParent(intersected ? intersected.object : null);
			}

			parent = selectedObject.parent;
			if(parent) {
				parent.localToWorld(newPosition);

				newPosition.x -= (mouseVector.z * mouse.dX + mouseVector.x * mouse.dY) * 0.003;
				newPosition.z -= (-mouseVector.x * mouse.dX + mouseVector.z * mouse.dY) * 0.003;

				parent.worldToLocal(newPosition);
				if(!selectedObject.move(newPosition) && Controls.selected.isBook()) {
					if(parent !== oldParent) {
						selectedObject.setParent(oldParent);
					}
				}
			}
		}/* else if(UI.menu.sectionMenu.isRotateOption() && Controls.selected.isSection()) {
			Controls.selected.object.rotate(Controls.mouse.dX);			
		}*/
	};

	return Controls;	
});
angular.module('VirtualBookshelf')
.factory('Data', function ($http, $q) {
	var Data = {};

	Data.TEXTURE_RESOLUTION = 512;
	Data.COVER_MAX_Y = 394;
	Data.COVER_FACE_X = 296;

    Data.loadImage = function(url) {
        var deffered = $q.defer();
        var img = new Image();
        
        img.crossOrigin = ''; 
        img.src = url;
        
        if(img.complete) {
            deffered.resolve(img);
        }

        img.onload = function () {
            deffered.resolve(img);
        };
        img.onerror = function (error) {
            deffered.reject(error);
        };

        return deffered.promise; 
    };

    Data.postArchiveImage = function(externalURL, tags) {
    	var data = {
    		url: externalURL,
    		tags: tags
    	};

    	return $http.post('/archive', data).then(function (res) {
    		return res.data;
    	});
    };

    Data.logout = function() {
    	return $http.post('/auth/logout');
    };

	Data.getUser = function() {
		return $http.get('/user');
	};

	Data.getUserBooks = function(userId) {
		return $http.get('/freeBooks/' + userId).then(function (res) {
			return res.data;
		});
	};

	Data.postBook = function(book) {
		return $http.post('/book', book);
	};

	Data.deleteBook = function(book) {
		return $http({
			method: 'DELETE',
			url: '/book',
			data: book,
			headers: {'Content-Type': 'application/json;charset=utf-8'}
		});
	};

	Data.getUIData = function() {
		return $http.get('/obj/data.json');
	};

	Data.getLibraries = function() {
		return $http.get('/libraries');
	};

	Data.getLibrary = function(libraryId) {
		return $http.get('/library/' + libraryId).then(function (res) {
			return res.data;
		});
	};

	Data.postLibrary = function(libraryModel) {
        return $http.post('/library/' + libraryModel).then(function (res) {
            return res.data;
        });
	};

	Data.getSections = function(libraryId) {
        return $http.get('/sections/' + libraryId).then(function (res) {
            return res.data;
        });
	};

	Data.postSection = function(sectionData) {
        return $http.post('/section', sectionData).then(function (res) {
        	return res.data;
        });
	};

	Data.getBooks = function(sectionId) {
		//TODO: userId
        return $http.get('/books/' + sectionId).then(function (res) {
            return res.data;
        });
	};

	Data.loadGeometry = function(link) {
        var deffered = $q.defer();
		var jsonLoader = new THREE.JSONLoader();

        //TODO: found no way to reject
		jsonLoader.load(link, function (geometry) {
			deffered.resolve(geometry);
		});

        return deffered.promise;
	};

	Data.getData = function(url) {
        return $http.get(url).then(function (res) {
            return res.data;
        });
	};

	Data.postFeedback = function(dto) {
        return $http.post('/feedback', dto);
	};

	return Data;
});
angular.module('VirtualBookshelf')
.factory('environment', function ($q, $log, $window, LibraryObject, SectionObject, BookObject, Data, Camera, cache) {
	var environment = {};

	environment.CLEARANCE = 0.001;
	 
	var libraryDto = null;
	var sections = null;
	var books = null;

	environment.scene = null;
	environment.library = null;

	environment.loadLibrary = function(libraryId) {
		clearScene(); // inits some fields

		var promise = Data.getLibrary(libraryId).then(function (dto) {
			var dict = parseLibraryDto(dto);
			
			sections = dict.sections;
			books = dict.books;
			libraryDto = dto;

			return initCache(libraryDto, dict.sections, dict.books);
		}).then(function () {
			createLibrary(libraryDto);
			return createSections(sections);
		}).then(function () {
			return createBooks(books);
		});

		return promise;
	};

	environment.goToLibrary = function(id) {
		if(id) {
			$window.location = '/' + id;
		}
	};

	environment.getBook = function(bookId) {
		return getDictObject(books, bookId);
	};

	environment.getSection = function(sectionId) {
		return getDictObject(sections, sectionId);
	};

	environment.getShelf = function(sectionId, shelfId) {
		var section = environment.getSection(sectionId);
		var shelf = section && section.shelves[shelfId];

		return shelf;
	};

	var getDictObject = function(dict, objectId) {
		var dictItem = dict[objectId];
		var dictObject = dictItem && dictItem.obj;

		return dictObject;
	};

	environment.updateSection = function(dto) {
		if(dto.libraryId == environment.library.id) {
			removeObject(sections, dto.id);
			createSection(dto);
		} else {
			removeObject(sections, dto.id);
		}	
	};

	environment.updateBook = function(dto) {
		var shelf = getBookShelf(dto);

		if(shelf) {
			removeObject(books, dto.id);
			createBook(dto);
		} else {
			removeObject(books, dto.id);
		}
	};

	environment.removeBook = function(bookDto) {
		removeObject(books, bookDto.id);
	};

	var removeObject = function(dict, key) {
		var dictItem = dict[key];
		if(dictItem) {
			delete dict[key];
			
			if(dictItem.obj) {
				dictItem.obj.setParent(null);
			}
		}
	};

	var initCache = function(libraryDto, sectionsDict, booksDict) {
		var libraryModel = libraryDto.model;
		var sectionModels = {};
		var bookModels = {};
		var imageUrls = {};

		for (var sectionId in sectionsDict) {
			var sectionDto = sectionsDict[sectionId].dto;
			sectionModels[sectionDto.model] = true;
		}

		for (var bookId in booksDict) {
			var bookDto = booksDict[bookId].dto;
			bookModels[bookDto.model] = true;

			if(bookDto.cover) {
				imageUrls[bookDto.cover] = true;
			}
		}

		return cache.init(libraryModel, sectionModels, bookModels, imageUrls);
	};

	var clearScene = function() {
		// Controls.clear();
		environment.library = null;
		sections = {};
		books = {};

		while(environment.scene.children.length > 0) {
			if(environment.scene.children[0].dispose) {
				environment.scene.children[0].dispose();
			}
			environment.scene.remove(environment.scene.children[0]);
		}
	};

	var parseLibraryDto = function(libraryDto) {
		var result = {
			sections: {},
			books: {}
		};

		for(var sectionIndex = libraryDto.sections.length - 1; sectionIndex >= 0; sectionIndex--) {
			var sectionDto = libraryDto.sections[sectionIndex];
			result.sections[sectionDto.id] = {dto: sectionDto};

			for(var bookIndex = sectionDto.books.length - 1; bookIndex >= 0; bookIndex--) {
				var bookDto = sectionDto.books[bookIndex];
				result.books[bookDto.id] = {dto: bookDto};
			}

			delete sectionDto.books;
		}

		delete libraryDto.sections;

		return result;
	};

	var createLibrary = function(libraryDto) {
		var library = null;
		var libraryCache = cache.getLibrary();
        var texture = new THREE.Texture(libraryCache.mapImage);
        var material = new THREE.MeshPhongMaterial({map: texture});

        texture.needsUpdate = true;
		library = new LibraryObject(libraryDto, libraryCache.geometry, material);
		Camera.setParent(library);

		environment.scene.add(library);
		environment.library = library;
	};

	var createSections = function(sectionsDict) {
		var results = [];
		var key;

		for(key in sectionsDict) {
			results.push(createSection(sectionsDict[key].dto));		
		}

		return $q.all(results);
	};

	var createSection = function(sectionDto) {
		var promise = cache.getSection(sectionDto.model).then(function (sectionCache) {
	        var texture = new THREE.Texture(sectionCache.mapImage);
	        var material = new THREE.MeshPhongMaterial({map: texture});
	        var section;

	        texture.needsUpdate = true;
	        sectionDto.data = sectionCache.data;

	        section = new SectionObject(sectionDto, sectionCache.geometry, material);

			environment.library.add(section);
			addToDict(sections, section);
		});

		return promise;
	};

	// TODO: merge with createSections
	var createBooks = function(booksDict) {
		var results = [];
		var key;

		for(key in booksDict) {
			results.push(createBook(booksDict[key].dto));
		}

		return $q.all(results);
	};

	var createBook = function(bookDto) {
		var promises = {};
		var promise;

		promises.bookCache = cache.getBook(bookDto.model);
		if(bookDto.cover) {
			promises.coverCache = cache.getImage(bookDto.cover);
		}

		promise = $q.all(promises).then(function (results) {
			var bookCache = results.bookCache;
			var coverImage = results.coverCache;
			var canvas = document.createElement('canvas');

			canvas.width = canvas.height = Data.TEXTURE_RESOLUTION;
			var texture = new THREE.Texture(canvas);
		    var material = new THREE.MeshPhongMaterial({map: texture});

			var book = new BookObject(bookDto, bookCache.geometry, material, bookCache.mapImage, coverImage);

			addToDict(books, book);
			placeBookOnShelf(book);
		});

		return promise;
	};

	var addToDict = function(dict, obj) {
		var dictItem = {
			dto: obj.dataObject,
			obj: obj
		};

		dict[obj.id] = dictItem;
	};

	var getBookShelf = function(bookDto) {
		return environment.getShelf(bookDto.sectionId, bookDto.shelfId);
	};

	var placeBookOnShelf = function(book) {
		var shelf = getBookShelf(book.dataObject);
		shelf.add(book);
	};

	return environment;
});
angular.module('VirtualBookshelf')
.factory('Main', function ($log, Data, Camera, LibraryObject, Controls, User, UI, environment) {
	var STATS_CONTAINER_ID = 'stats';
	var LIBRARY_CANVAS_ID = 'LIBRARY';
	
	var canvas;
	var renderer;
	var stats;
	
	var Main = {};

	Main.start = function() {
		var winResize;
		var width = window.innerWidth;
		var height = window.innerHeight;

		if(!Detector.webgl) {
			Detector.addGetWebGLMessage();
		}

		init(width, height);
		Camera.init(width, height);
		Controls.init();

		winResize = new THREEx.WindowResize(renderer, Camera.camera);

		startRenderLoop();

		User.load().then(function () {
			return environment.loadLibrary(User.getLibrary() || 1).then(function () {
				UI.init();
			});
		}).catch(function (error) {
			$log.error(error);
			//TODO: show error message  
		});		
	};

	var init = function(width, height) {
		var statsContainer = document.getElementById(STATS_CONTAINER_ID);

		stats = new Stats();
		statsContainer.appendChild(stats.domElement);

		canvas = document.getElementById(LIBRARY_CANVAS_ID);
		renderer = new THREE.WebGLRenderer({canvas: canvas});
		renderer.setSize(width, height);

		environment.scene = new THREE.Scene();
		environment.scene.fog = new THREE.Fog(0x000000, 4, 7);
	};

	var startRenderLoop = function() {
		requestAnimationFrame(startRenderLoop);
		Controls.update();
		renderer.render(environment.scene, Camera.camera);

		stats.update();
	};

	return Main;
});
angular.module('VirtualBookshelf')
.factory('mouse', function (Camera) {
	var mouse = {};

	var getWidth = function() {
		return window.innerWidth;
	};

	var getHeight = function() {
		return window.innerHeight;
	};

	var x = null;
	var y = null;
	
	mouse.target = null;
	mouse.dX = null;
	mouse.dY = null;
	mouse.longX = null;
	mouse.longY = null;

	mouse.getTarget = function() {
		return this.target;
	};

	mouse.down = function(event) {
		if(event) {
			this[event.which] = true;
			this.target = event.target;
			x = event.clientX;
			y = event.clientY;
			mouse.longX = getWidth() * 0.5 - x;
			mouse.longY = getHeight() * 0.5 - y;
		}
	};

	mouse.up = function(event) {
		if(event) {
			this[event.which] = false;
			this[1] = false; // linux chrome bug fix (when both keys release then both event.which equal 3)
		}
	};

	mouse.move = function(event) {
		if(event) {
			this.target = event.target;
			mouse.longX = getWidth() * 0.5 - x;
			mouse.longY = getHeight() * 0.5 - y;
			mouse.dX = event.clientX - x;
			mouse.dY = event.clientY - y;
			x = event.clientX;
			y = event.clientY;
		}
	};

	mouse.isCanvas = function() {
		return this.target && this.target.className.indexOf('ui') > -1;
	};

	mouse.isPocketBook = function() {
		return false; //TODO: stub
		// return !!(this.target && this.target.parentNode == UI.menu.inventory.books);
	};

	mouse.getIntersected = function(objects, recursive, searchFor) {
		var
			vector,
			raycaster,
			intersects,
			intersected,
			result,
			i, j;

		result = null;
		vector = getVector();
		raycaster = new THREE.Raycaster(Camera.getPosition(), vector);
		intersects = raycaster.intersectObjects(objects, recursive);

		if(searchFor) {
			if(intersects.length) {
				for(i = 0; i < intersects.length; i++) {
					intersected = intersects[i];
					
					for(j = searchFor.length - 1; j >= 0; j--) {
						if(intersected.object instanceof searchFor[j]) {
							result = intersected;
							break;
						}
					}

					if(result) {
						break;
					}
				}
			}		
		} else {
			result = intersects;
		}

		return result;
	};

	var getVector = function() {
		var projector = new THREE.Projector();
		var vector = new THREE.Vector3((x / getWidth()) * 2 - 1, - (y / getHeight()) * 2 + 1, 0.5);
		projector.unprojectVector(vector, Camera.camera);
	
		return vector.sub(Camera.getPosition()).normalize();
	};

	return mouse;
});
angular.module('VirtualBookshelf')
.factory('navigation', function () {
	var navigation = {
		state: {
			forward: false,
			backward: false,
			left: false,
			right: false			
		}
	};

	navigation.goStop = function() {
		this.state.forward = false;
		this.state.backward = false;
		this.state.left = false;
		this.state.right = false;
	};

	navigation.goForward = function() {
		this.state.forward = true;
	};

	navigation.goBackward = function() {
		this.state.backward = true;
	};

	navigation.goLeft = function() {
		this.state.left = true;
	};

	navigation.goRight = function() {
		this.state.right = true;
	};

	return navigation;
});
angular.module('VirtualBookshelf')
.factory('UI', function ($q, $log, $window, $interval, SelectorMeta, User, Data, Controls, navigation, environment, locator, selector, archive, blockUI) {
	var BOOK_IMAGE_URL = '/obj/books/{model}/img.jpg';
	var UI = {menu: {}};

	UI.menu.selectLibrary = {
		list: [],

		updateList: function() {
			var scope = this;

		    var promise = Data.getLibraries().then(function (res) {
	            scope.list = res.data;
	    	});

	    	return promise;
		},

		go: environment.goToLibrary
	};

	UI.menu.createLibrary = {
		list: [],
		model: null,

		getImg: function() {
			return this.model ? '/obj/libraries/{model}/img.jpg'.replace('{model}', this.model) : null;
		},
		create: function() {
			if(this.model) {
				Data.postLibrary(this.model).then(function (result) {
					environment.goToLibrary(result.id);
				}).catch(function () {
					//TODO: show an error
				});
			}
		}		
	};

	UI.menu.createSection = {
		list: [],
		model: null,
		
		getImg: function() {
			return this.model ? '/obj/sections/{model}/img.jpg'.replace('{model}', this.model) : null;
		},

		create: function() {
			if(this.model) {
				var sectionData = {
					model: this.model,
					libraryId: environment.library.id,
					userId: User.getId()
				};

				this.place(sectionData);
			}
		},

		place: function(dto) {
			//TODO: block
			locator.placeSection(dto).catch(function (error) {
				//TODO: show an error
				$log.error(error);
			});	
		}
	};

	UI.menu.feedback = {
		message: null,
		show: true,

		close: function() {
			this.show = false;
		},
		submit: function() {
			var dataObject;
			
			if(this.message) {
				dataObject = {
					message: this.message,
					userId: User.getId()
				};

				Data.postFeedback(dataObject);
			}

			this.close();
		}
	};

	UI.menu.navigation = {
		stop: function() {
			navigation.goStop();
		},
		forward: function() {
			navigation.goForward();
		},
		backward: function() {
			navigation.goBackward();
		},
		left: function() {
			navigation.goLeft();
		},
		right: function() {
			navigation.goRight();
		}
	};

	UI.menu.login = {
		isShow: function() {
			return !User.isAuthorized() && User.isLoaded();
		},

		google: function() {
			var win = $window.open('/auth/google', '', 'width=800,height=600,modal=yes,alwaysRaised=yes');
		    var checkAuthWindow = $interval(function () {
		        if (win && win.closed) {
		        	$interval.cancel(checkAuthWindow);

		        	User.load().then(function () {
		        		return loadUserData();
		        	}).catch(function () {
		        		$log.log('User loadind error');
						//TODO: show error message  
		        	});
		        }
		    }, 100);			
		},

		logout: function() {
			User.logout().finally(function () {
        		return loadUserData();
			}).catch(function () {
				$log.error('Logout error');
				//TODO: show an error
			});
		}
	};

	UI.menu.inventory = {
		search: null,
		list: null,
		blocker: 'inventory',
	
		expand: function(book) {
			UI.menu.createBook.setBook(book);
		},
		block: function() {
			blockUI.instances.get(this.blocker).start();
		},
		unblock: function() {
			blockUI.instances.get(this.blocker).stop();
		},
		isShow: function() {
			return User.isAuthorized();
		},
		isBookSelected: function(id) {
			return selector.isBookSelected(id);
		},
		select: function(dto) {
			var book = environment.getBook(dto.id);
			var meta = new SelectorMeta(book);
			selector.select(meta);
		},
		addBook: function() {
			this.expand({userId: User.getId()});
		},
		remove: function(book) {
			var scope = this;

			scope.block();
			Data.deleteBook(book).then(function (res) {
				environment.removeBook(res.data);
				return scope.loadData();
			}).catch(function (error) {
				//TODO: show an error
				$log.error(error);
			}).finally(function () {
				scope.unblock();
			});
		},
		place: function(book) {
			var scope = this;
			var promise;
			var isBookPlaced = !!book.sectionId;

			scope.block();
			promise = isBookPlaced ? locator.unplaceBook(book) : locator.placeBook(book);
			promise.then(function () {
				return scope.loadData();
			}).catch(function (error) {
				//TODO: show an error
				$log.error(error);
			}).finally(function () {
				scope.unblock(); 
			});
		},
		loadData: function() {
			var scope = this;
			var promise;

			scope.block();
			promise = $q.when(this.isShow() ? Data.getUserBooks(User.getId()) : null).then(function (books) {
				scope.list = books;
			}).finally(function () {
				scope.unblock();		
			});

			return promise;
		}
	};

	UI.menu.createBook = {
		list: [],
		book: {},
		coverInputURL: null,

		setBook: function(book) {
			this.book = {}; // create new object for unbind from scope
			if(book) {
				this.book.id = book.id;
				this.book.userId = book.userId;
				this.book.model = book.model;
				this.book.cover = book.cover;
				this.book.title = book.title;
				this.book.author = book.author;
			}
		},
		applyCover: function() {
			if(!this.isCoverDisabled()) {
				UI.menu.inventory.block();
				archive.sendExternalURL(this.coverInputURL, [this.book.title, this.book.author]).then(function (result) {
					UI.menu.createBook.book.cover = result.url;
					UI.menu.createBook.coverInputURL = null;
				}).catch(function () {
					$log.error('Apply cover error');
					//TODO: show an error
				}).finally(function () {
					UI.menu.inventory.unblock();
				});
			} else {
				$log.log('There are no tags for image');
				//TODO: show an error
			}
		},
		removeCover: function() {
			this.book.cover = null;
			this.coverInputURL = null;
		},
		getImg: function() {
			return this.book.model ? BOOK_IMAGE_URL.replace('{model}', this.book.model) : null;
		},
		getCoverImg: function() {
			return this.isCoverShow ? this.book.cover : null;
		},
		isCoverDisabled: function() {
			return !(this.book.title && this.book.author);
		},
		isCoverShow: function() {
			return Boolean(this.book.cover);
		},
		isShow: function() {
			return !!this.book.userId;
		},
		save: function() {
			var scope = this;
			
			UI.menu.inventory.block();
			Data.postBook(this.book).then(function (res) {
				environment.updateBook(res.data);
				scope.cancel();
				return UI.menu.inventory.loadData();
			}).catch(function () {
				$log.error('Book save error');
				//TODO: show error
			}).finally(function () {
				UI.menu.inventory.unblock();
			});
		},
		cancel: function() {
			this.setBook();
		}
	};

	UI.init = function() {
		//TODO: move to menu models
		Data.getUIData().then(function (res) {
			UI.menu.createLibrary.list = res.data.libraries;
			UI.menu.createSection.list = res.data.bookshelves;
			UI.menu.createBook.list = res.data.books;

			return loadUserData();
		}).catch(function () {
			$log.log('UI init error');
			//TODO: show an error
		});
	};

	var loadUserData = function() {
		return $q.all([
			UI.menu.selectLibrary.updateList(), 
			UI.menu.inventory.loadData()
		]);
	};

	return UI;
});

// VirtualBookshelf.UI.initControlsEvents = function() {
	// VirtualBookshelf.UI.menu.createBook.model.onchange = VirtualBookshelf.UI.changeModel;
	// VirtualBookshelf.UI.menu.createBook.texture.onchange = VirtualBookshelf.UI.changeBookTexture;
	// VirtualBookshelf.UI.menu.createBook.cover.onchange = VirtualBookshelf.UI.changeBookCover;
	// VirtualBookshelf.UI.menu.createBook.author.onchange = VirtualBookshelf.UI.changeSpecificValue('author', 'text');
	// VirtualBookshelf.UI.menu.createBook.authorSize.onchange = VirtualBookshelf.UI.changeSpecificValue('author', 'size');
	// VirtualBookshelf.UI.menu.createBook.authorColor.onchange = VirtualBookshelf.UI.changeSpecificValue('author', 'color');
	// VirtualBookshelf.UI.menu.createBook.title.onchange = VirtualBookshelf.UI.changeSpecificValue('title', 'text');
	// VirtualBookshelf.UI.menu.createBook.titleSize.onchange = VirtualBookshelf.UI.changeSpecificValue('title', 'size');
	// VirtualBookshelf.UI.menu.createBook.titleColor.onchange = VirtualBookshelf.UI.changeSpecificValue('title', 'color');
	// VirtualBookshelf.UI.menu.createBook.editCover.onclick = VirtualBookshelf.UI.switchEdited;
	// VirtualBookshelf.UI.menu.createBook.editAuthor.onclick = VirtualBookshelf.UI.switchEdited;
	// VirtualBookshelf.UI.menu.createBook.editTitle.onclick = VirtualBookshelf.UI.switchEdited;
	// VirtualBookshelf.UI.menu.createBook.ok.onclick = VirtualBookshelf.UI.saveBook;
	// VirtualBookshelf.UI.menu.createBook.cancel.onclick = VirtualBookshelf.UI.cancelBookEdit;
// };

// create book

// VirtualBookshelf.UI.showCreateBook = function() {
// 	var menuNode = VirtualBookshelf.UI.menu.createBook;

// 	if(VirtualBookshelf.selected.isBook()) {
// 		menuNode.show();
// 		menuNode.setValues();
// 	} else if(VirtualBookshelf.selected.isSection()) {
// 		var section = VirtualBookshelf.selected.object;
// 		var shelf = section.getShelfByPoint(VirtualBookshelf.selected.point);
// 		var freePosition = section.getGetFreeShelfPosition(shelf, {x: 0.05, y: 0.12, z: 0.1}); 
// 		if(freePosition) {
// 			menuNode.show();

// 			var dataObject = {
// 				model: menuNode.model.value, 
// 				texture: menuNode.texture.value, 
// 				cover: menuNode.cover.value,
// 				pos_x: freePosition.x,
// 				pos_y: freePosition.y,
// 				pos_z: freePosition.z,
// 				sectionId: section.dataObject.id,
// 				shelfId: shelf.id,
// 				userId: VirtualBookshelf.user.id
// 			};

// 			VirtualBookshelf.Data.createBook(dataObject, function (book, dataObject) {
// 				book.parent = shelf;
// 				VirtualBookshelf.selected.object = book;
// 				VirtualBookshelf.selected.get();
// 			});
// 		} else {
// 			alert('There is no free space on selected shelf.');
// 		}
// 	}
// }

// VirtualBookshelf.UI.changeModel = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var oldBook = VirtualBookshelf.selected.object;
// 		var dataObject = {
// 			model: this.value,
// 			texture: oldBook.texture.toString(),
// 			cover: oldBook.cover.toString()
// 		};

// 		VirtualBookshelf.Data.createBook(dataObject, function (book, dataObject) {
// 			book.copyState(oldBook);
// 		});
// 	}
// }

// VirtualBookshelf.UI.changeBookTexture = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var book = VirtualBookshelf.selected.object;
// 		book.texture.load(this.value, false, function () {
// 			book.updateTexture();
// 		});
// 	}
// }

// VirtualBookshelf.UI.changeBookCover = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var book = VirtualBookshelf.selected.object;
// 		book.cover.load(this.value, true, function() {
// 			book.updateTexture();
// 		});
// 	}
// }

// VirtualBookshelf.UI.changeSpecificValue = function(field, property) {
// 	return function () {
// 		if(VirtualBookshelf.selected.isBook()) {
// 			VirtualBookshelf.selected.object[field][property] = this.value;
// 			VirtualBookshelf.selected.object.updateTexture();
// 		}
// 	};
// };

// VirtualBookshelf.UI.switchEdited = function() {
// 	var activeElemets = document.querySelectorAll('a.activeEdit');

// 	for(var i = activeElemets.length - 1; i >= 0; i--) {
// 		activeElemets[i].className = 'inactiveEdit';
// 	};

// 	var previousEdited = VirtualBookshelf.UI.menu.createBook.edited;
// 	var currentEdited = this.getAttribute('edit');

// 	if(previousEdited != currentEdited) {
// 		this.className = 'activeEdit';
// 		VirtualBookshelf.UI.menu.createBook.edited = currentEdited;
// 	} else {
// 		VirtualBookshelf.UI.menu.createBook.edited = null;
// 	}
// }

// VirtualBookshelf.UI.saveBook = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var book = VirtualBookshelf.selected.object;

// 		VirtualBookshelf.selected.put();
// 		book.save();
// 	}
// }

// VirtualBookshelf.UI.cancelBookEdit = function() {
// 	if(VirtualBookshelf.selected.isBook()) {
// 		var book = VirtualBookshelf.selected.object;
		
// 		VirtualBookshelf.selected.put();
// 		book.refresh();
// 	}
// }
angular.module('VirtualBookshelf')
.factory('User', function ($log, Data) {
	var user = {};

	var loaded = false;
	var _dataObject = null;
	var _position = null;
	var _library = null;

	user.load = function() {
		var scope = this;

		return Data.getUser().then(function (res) {
			scope.setDataObject(res.data);
			scope.setLibrary();
			loaded = true;

			$log.log('user loaded');
		});
	};

	user.logout = function() {
		return Data.logout().then(function () {
			return user.load();
		});
	};

	user.setDataObject = function(dataObject) {
		_dataObject = dataObject;
	};

	user.getLibrary = function() {
		return _library;
	};

	user.setLibrary = function(libraryId) {
		_library = libraryId || window.location.pathname.substring(1);
	};

	user.getId = function() {
		return _dataObject && _dataObject.id;
	};

	user.isAuthorized = function() {
		return Boolean(_dataObject);
	};

	user.isLoaded = function() {
		return loaded;
	}

	return user;
});

// This THREEx helper makes it easy to handle window resize.
// It will update renderer and camera when window is resized.
//
// # Usage
//
// **Step 1**: Start updating renderer and camera
//
// ```var windowResize = new THREEx.WindowResize(aRenderer, aCamera)```
//    
// **Step 2**: stop updating renderer and camera
//
// ```windowResize.destroy()```
// # Code

//

/** @namespace */
var THREEx	= THREEx || {}

/**
 * Update renderer and camera when the window is resized
 * 
 * @param {Object} renderer the renderer to update
 * @param {Object} Camera the camera to update
 * @param {Function} dimension callback for renderer size
*/
THREEx.WindowResize	= function(renderer, camera, dimension){
	dimension 	= dimension || function(){ return { width: window.innerWidth, height: window.innerHeight } }
	var callback	= function(){
		// fetch target renderer size
		var rendererSize = dimension();
		// notify the renderer of the size change
		renderer.setSize( rendererSize.width, rendererSize.height )
		// update the camera
		camera.aspect	= rendererSize.width / rendererSize.height
		camera.updateProjectionMatrix()
	}
	// bind the resize event
	window.addEventListener('resize', callback, false)
	// return .stop() the function to stop watching window resize
	return {
		trigger	: function(){
			callback()
		},
		/**
		 * Stop watching window resize
		*/
		destroy	: function(){
			window.removeEventListener('resize', callback)
		}
	}
}

angular.module('VirtualBookshelf')
.factory('BaseObject', function () {
	var BaseObject = function(dataObject, geometry, material) {
		THREE.Mesh.call(this, geometry, material);

		this.dataObject = dataObject || {};
		this.dataObject.rotation = this.dataObject.rotation || [0, 0, 0];
		
		this.id = this.dataObject.id;
		this.position = new THREE.Vector3(this.dataObject.pos_x, this.dataObject.pos_y, this.dataObject.pos_z);
		this.rotation.order = 'XYZ';
		this.rotation.fromArray(this.dataObject.rotation.map(Number));

		this.updateMatrix();

		//TODO: research, after caching geometry this can be run once
		this.geometry.computeBoundingBox();
		
		this.updateBoundingBox();		
	};
	
	BaseObject.prototype = new THREE.Mesh();
	BaseObject.prototype.constructor = BaseObject;

	BaseObject.prototype.getType = function() {
		return this.type;
	};

	BaseObject.prototype.isOutOfParrent = function() {
		return Math.abs(this.boundingBox.center.x - this.parent.boundingBox.center.x) > (this.parent.boundingBox.radius.x - this.boundingBox.radius.x)
			//|| Math.abs(this.boundingBox.center.y - this.parent.boundingBox.center.y) > (this.parent.boundingBox.radius.y - this.boundingBox.radius.y)
			|| Math.abs(this.boundingBox.center.z - this.parent.boundingBox.center.z) > (this.parent.boundingBox.radius.z - this.boundingBox.radius.z);
	};

	BaseObject.prototype.isCollided = function() {
		var
			result,
			targets,
			target,
			i;

		this.updateBoundingBox();

		result = this.isOutOfParrent();
		targets = this.parent.children;

		if(!result) {
			for(i = targets.length - 1; i >= 0; i--) {
				target = targets[i].boundingBox;

				if(targets[i] === this 
				|| !target // children without BB
				|| (Math.abs(this.boundingBox.center.x - target.center.x) > (this.boundingBox.radius.x + target.radius.x))
				|| (Math.abs(this.boundingBox.center.y - target.center.y) > (this.boundingBox.radius.y + target.radius.y))
				|| (Math.abs(this.boundingBox.center.z - target.center.z) > (this.boundingBox.radius.z + target.radius.z))) {	
					continue;
				}

		    	result = true;		
		    	break;
			}
		}

		return result;
	};

	BaseObject.prototype.move = function(newPosition) {
		var 
			currentPosition,
			result;

		result = false;
		currentPosition = this.position.clone();
		
		if(newPosition.x) {
			this.position.setX(newPosition.x);

			if(this.isCollided()) {
				this.position.setX(currentPosition.x);
			} else {
				result = true;
			}
		}

		if(newPosition.z) {
			this.position.setZ(newPosition.z);

			if(this.isCollided()) {
				this.position.setZ(currentPosition.z);
			} else {
				result = true;
			}
		}

		this.changed = this.changed || result;
		this.updateBoundingBox();

		return result;
	};

	BaseObject.prototype.rotate = function(dX, dY, isDemo) {
		var 
			currentRotation = this.rotation.clone(),
			result = false; 
		
		if(dX) {
			this.rotation.y += dX * 0.01;

			if(!isDemo && this.isCollided()) {
				this.rotation.y = currentRotation.y;
			} else {
				result = true;
			}
		}

		if(dY) {
			this.rotation.x += dY * 0.01;

			if(!isDemo && this.isCollided()) {
				this.rotation.x = currentRotation.x;
			} else {
				result = true;
			}
		}

		this.changed = this.changed || (!isDemo && result);
		this.updateBoundingBox();
	};

	BaseObject.prototype.updateBoundingBox = function() {
		var
			boundingBox,
			radius,
			center;

		this.updateMatrix();
		boundingBox = this.geometry.boundingBox.clone().applyMatrix4(this.matrix);
		
		radius = {
			x: (boundingBox.max.x - boundingBox.min.x) * 0.5,
			y: (boundingBox.max.y - boundingBox.min.y) * 0.5,
			z: (boundingBox.max.z - boundingBox.min.z) * 0.5
		};

		center = new THREE.Vector3(
			radius.x + boundingBox.min.x,
			radius.y + boundingBox.min.y,
			radius.z + boundingBox.min.z
		);

		this.boundingBox = {
			radius: radius,
			center: center
		};
	};

	BaseObject.prototype.reload = function() {
		this.position.setX(this.dataObject.pos_x);
		this.position.setY(this.dataObject.pos_y);
		this.position.setZ(this.dataObject.pos_z);
		this.rotation.set(0, 0, 0);
	};

	return BaseObject;	
});
angular.module('VirtualBookshelf')
.factory('BookObject', function (BaseObject, CanvasText, CanvasImage, Data) {	
	var BookObject = function(dataObject, geometry, material, mapImage, coverImage) {
		BaseObject.call(this, dataObject, geometry, material);
		
		this.model = this.dataObject.model;
		this.canvas = material.map.image;
		this.texture = new CanvasImage(null, null, mapImage);
		this.cover = new CanvasImage(this.dataObject.coverPos, this.dataObject.cover, coverImage);
		this.author = new CanvasText(this.dataObject.author, this.dataObject.authorFont);
		this.title = new CanvasText(this.dataObject.title, this.dataObject.titleFont);

		this.updateTexture();
	};

	BookObject.TYPE = 'BookObject';

	BookObject.prototype = new BaseObject();
	BookObject.prototype.constructor = BookObject;
	BookObject.prototype.textNodes = ['author', 'title'];
	BookObject.prototype.type = BookObject.TYPE;

	BookObject.prototype.updateTexture = function() {
		var context = this.canvas.getContext('2d');
		var cover = this.cover;

		if(this.texture.image) {
			context.drawImage(this.texture.image, 0, 0);
		}

		if(cover.image) {
			var diff = cover.y + cover.height - Data.COVER_MAX_Y;
		 	var limitedHeight = diff > 0 ? cover.height - diff : cover.height;
		 	var cropHeight = diff > 0 ? cover.image.naturalHeight - (cover.image.naturalHeight / cover.height * diff) : cover.image.naturalHeight;

			context.drawImage(cover.image, 0, 0, cover.image.naturalWidth, cropHeight, cover.x, cover.y, cover.width, limitedHeight);
		}

		for(var i = this.textNodes.length - 1; i >= 0; i--) {
			var textNode = this[this.textNodes[i]];

			if(textNode.isValid()) {

				context.font = textNode.getFont();
				context.fillStyle = textNode.color;
		    	context.fillText(textNode.text, textNode.x, textNode.y, textNode.width);
		    }
		}

		this.material.map.needsUpdate = true;
	};
	BookObject.prototype.moveElement = function(dX, dY, element) {
		var element = element && this[element];
		
		if(element) {
			if(element.move) {
				element.move(dX, dY);
			} else {
				element.x += dX;
				element.y += dY;
			}

			this.updateTexture();
		}
	};
	BookObject.prototype.scaleElement = function(dX, dY) {
		this.cover.width += dX;
		this.cover.height += dY;
		this.updateTexture();
	};
	BookObject.prototype.save = function() {
		var scope = this;

		this.dataObject.model = this.model;
		this.dataObject.texture = this.texture.toString();
		this.dataObject.cover = this.cover.toString();
		this.dataObject.coverPos = this.cover.serializeProperties();
		this.dataObject.author = this.author.toString();
		this.dataObject.authorFont = this.author.serializeFont();
		this.dataObject.title = this.title.toString();
		this.dataObject.titleFont = this.title.serializeFont();
		this.dataObject.pos_x = this.position.x;
		this.dataObject.pos_y = this.position.y;
		this.dataObject.pos_z = this.position.z;

		Data.postBook(this.dataObject, function(err, result) {
			if(!err && result) {
				scope.dataObject = result;
				scope.changed = false;
			} else {
				//TODO: hide edit, notify user
			}
		});
	};
	BookObject.prototype.refresh = function() {
		var scope = this;
		//TODO: use in constructor instead of separate images loading
		scope.texture.load(scope.dataObject.texture, false, function () {
			scope.cover.load(scope.dataObject.cover, true, function() {
				scope.model = scope.dataObject.model;
				scope.cover.parseProperties(scope.dataObject.coverPos);
				scope.author.setText(scope.dataObject.author);
				scope.author.parseProperties(scope.dataObject.authorFont);
				scope.title.setText(scope.dataObject.title);
				scope.title.parseProperties(scope.dataObject.titleFont);

				scope.updateTexture();
			});
		});
	};
	BookObject.prototype.copyState = function(book) {
		if(book instanceof BookObject) {
			var fields = ['dataObject', 'position', 'rotation', 'model', 'texture', 'cover', 'author', 'title'];
			for(var i = fields.length - 1; i >= 0; i--) {
				var field = fields[i];
				this[field] = book[field];
			};

			this.updateTexture();
			book.parent.add(this);
			book.parent.remove(book);
			VirtualBookshelf.selected.object = this;
		}
	};
	BookObject.prototype.setParent = function(parent) {
		if(this.parent != parent) {
			if(parent) {
				parent.add(this);
				this.dataObject.shelfId = parent.id;
				this.dataObject.sectionId = parent.parent.id;
			} else {
				this.parent.remove(this);
				this.dataObject.shelfId = null;
				this.dataObject.sectionId = null;
			}
		}
	};

	return BookObject;
});
angular.module('VirtualBookshelf')
.factory('CameraObject', function (BaseObject) {
	var CameraObject = function() {
		BaseObject.call(this);
	};

	CameraObject.prototype = new BaseObject();
	
	CameraObject.prototype.constructor = CameraObject;
	
	CameraObject.prototype.updateBoundingBox = function() {
		var radius = {x: 0.1, y: 1, z: 0.1};
		var center = new THREE.Vector3(0, 0, 0);

		this.boundingBox = {
			radius: radius,
			center: this.position //TODO: needs center of section in parent or world coordinates
		};
	};

	return CameraObject;
});
angular.module('VirtualBookshelf')
.factory('CanvasImage', function ($q, Data) {
	var CanvasImage = function(properties, link, image) {
		this.link = link || '';
		this.image = image;
		this.parseProperties(properties);
	};
	
	CanvasImage.prototype = {
		constructor: CanvasImage,

		toString: function() {
			return this.link;
		},
		parseProperties: function(properties) {
			var args = properties && properties.split(',') || [];

			this.x = Number(args[0]) || Data.COVER_FACE_X;
			this.y = Number(args[1]) || 0;
			this.width = Number(args[2]) || 216;
			this.height = Number(args[3]) || Data.COVER_MAX_Y;
		},
		serializeProperties: function() {
			return [this.x, this.y, this.width, this.height].join(',');
		}
	};

	return CanvasImage;
});
angular.module('VirtualBookshelf')
.factory('CanvasText', function (Data) {
	var CanvasText = function(text, properties) {
		this.text = text || '';
		this.parseProperties(properties);
	};

	CanvasText.prototype = {
		constructor: CanvasText,
		getFont: function() {
			return [this.style, this.size + 'px', this.font].join(' ');
		},
		isValid: function() {
			return (this.text && this.x && this.y);
		},
		toString: function() {
			return this.text || '';
		},
		setText: function(text) {
			this.text = text;
		},
		serializeFont: function() {
			return [this.style, this.size, this.font, this.x, this.y, this.color, this.width].join(',');
		},
		parseProperties: function(properties) {
			var args = properties && properties.split(',') || [];

			this.style = args[0];
			this.size = args[1] || 14;
			this.font = args[2] || 'Arial';
			this.x = Number(args[3]) || Data.COVER_FACE_X;
			this.y = Number(args[4]) || 10;
			this.color = args[5] || 'black';
			this.width = args[6] || 512;
		},
		move: function(dX, dY) {
			this.x += dX;
			this.y += dY;

			if(this.x <= 0) this.x = 1;
			if(this.y <= 0) this.y = 1;
			if(this.x >= Data.TEXTURE_RESOLUTION) this.x = Data.TEXTURE_RESOLUTION;
			if(this.y >= Data.COVER_MAX_Y) this.y = Data.COVER_MAX_Y;
		}
	};

	return CanvasText;
});
angular.module('VirtualBookshelf')
.factory('LibraryObject', function (BaseObject, Data) {
	var LibraryObject = function(params, geometry, material) {
		BaseObject.call(this, params, geometry, material);
		this.libraryObject = params.libraryObject || {};//TODO: research
	};
	LibraryObject.prototype = new BaseObject();
	LibraryObject.prototype.constructor = LibraryObject;

	return LibraryObject;	
});
angular.module('VirtualBookshelf')
.factory('SectionObject', function (BaseObject, ShelfObject, Data) {
	var SectionObject = function(params, geometry, material) {
		BaseObject.call(this, params, geometry, material);

		this.shelves = {};
		for(var key in params.data.shelves) {
			this.shelves[key] = new ShelfObject(params.data.shelves[key]); 
			this.add(this.shelves[key]);
		}
	};

	SectionObject.TYPE = 'SectionObject';

	SectionObject.prototype = new BaseObject();
	SectionObject.prototype.constructor = SectionObject;
	SectionObject.prototype.type = SectionObject.TYPE;

	SectionObject.prototype.save = function() {
		var scope = this;

		this.dataObject.pos_x = this.position.x;
		this.dataObject.pos_y = this.position.y;
		this.dataObject.pos_z = this.position.z;

		this.dataObject.rotation = [this.rotation.x, this.rotation.y, this.rotation.z];

		Data.postSection(this.dataObject).then(function (dto) {
			scope.dataObject = dto;
			scope.changed = false;
		}).catch(function (res) {
			//TODO: hide edit, notify user
		});
	};

	return SectionObject;
});
angular.module('VirtualBookshelf')
.factory('SelectorMeta', function () {
	var SelectorMeta = function(selectedObject) {
		if(selectedObject) {
			this.id = selectedObject.id;
			this.parentId = selectedObject.parent.id;
			this.type = selectedObject.getType();
		}
	};

	SelectorMeta.prototype.isEmpty = function() {
		return !this.id;
	};

	SelectorMeta.prototype.equals = function(meta) {
		return !(!meta
				|| meta.id !== this.id
				|| meta.parentId !== this.parentId
				|| meta.type !== this.type);
	};
	
	return SelectorMeta;
});
angular.module('VirtualBookshelf')
.factory('ShelfObject', function (BaseObject) {
	var ShelfObject = function(params) {
		var size = params.size || [1,1,1];	
		var material = new THREE.MeshLambertMaterial({color: 0x00ff00, transparent: true, opacity: 0.2});
		BaseObject.call(this, params, new THREE.CubeGeometry(size[0], size[1], size[2]), material);

		this.position = new THREE.Vector3(params.position[0], params.position[1], params.position[2]);
		this.size = new THREE.Vector3(size[0], size[1], size[2]);
		this.visible = false;
	};

	ShelfObject.TYPE = 'ShelfObject';

	ShelfObject.prototype = new BaseObject();
	ShelfObject.prototype.constructor = ShelfObject;
	ShelfObject.prototype.type = ShelfObject.TYPE;


	return ShelfObject;
});
angular.module('VirtualBookshelf')
.factory('highlight', function (environment) {
	var highlight = {};

	var PLANE_ROTATION = Math.PI * 0.5;
	var PLANE_MULTIPLIER = 2;
	var COLOR_SELECT = 0x005533;
	var COLOR_FOCUS = 0x003355;

	var select;
	var focus;

	var init = function() {
		var materialProperties = {
			map: new THREE.ImageUtils.loadTexture( 'img/glow.png' ),
			transparent: true, 
			side: THREE.DoubleSide,
			blending: THREE.AdditiveBlending,
			depthTest: false
		};

		materialProperties.color = COLOR_SELECT;
		var materialSelect = new THREE.MeshBasicMaterial(materialProperties);

		materialProperties.color = COLOR_FOCUS;
		var materialFocus = new THREE.MeshBasicMaterial(materialProperties);

		var geometry = new THREE.PlaneGeometry(1, 1, 1);

		select = new THREE.Mesh(geometry, materialSelect);
		select.rotation.x = PLANE_ROTATION;

		focus = new THREE.Mesh(geometry, materialFocus);
		focus.rotation.x = PLANE_ROTATION;
	};

	var commonHighlight = function(which, obj) {
		if(obj) {
			var width = obj.geometry.boundingBox.max.x * PLANE_MULTIPLIER;
			var height = obj.geometry.boundingBox.max.z * PLANE_MULTIPLIER;
			var bottom = obj.geometry.boundingBox.min.y + environment.CLEARANCE;
			
			which.position.y = bottom;
			which.scale.set(width, height, 1);
			obj.add(which);

			which.visible = true;
		} else {
			which.visible = false;
		}
	}

	highlight.focus = function(obj) {
		commonHighlight(focus, obj);
	};

	highlight.select = function(obj) {
		commonHighlight(select, obj);
	};

	init();

	return highlight;
});
angular.module('VirtualBookshelf')
.factory('locator', function ($q, $log, SectionObject, BookObject, Data, selector, environment, cache) {
	var VISUAL_DEBUG = false;
	var locator = {};

	locator.placeSection = function(sectionDto) {
		var promise = cache.getSection(sectionDto.model).then(function (sectionCache) {
			var sectionBB = sectionCache.geometry.boundingBox;
			var libraryBB = environment.library.geometry.boundingBox;
			var freePlace = getFreePlace(environment.library.children, libraryBB, sectionBB);

			if (freePlace) {
				return saveSection(sectionDto, freePlace);
			} else {
				$q.reject('there is no free space');
			}
		}).then(function () {
			return environment.updateSection(sectionDto);
		});

		return promise;
	};

	var saveSection = function(dto, position) {
		dto.libraryId = environment.library.id;
		dto.pos_x = position.x;
		dto.pos_y = position.y;
		dto.pos_z = position.z;

		return Data.postSection(dto);
	};

	locator.placeBook = function(bookDto) {
		var promise;
		var shelf = selector.isSelectedShelf() && selector.getSelectedObject();

		if(shelf) {
			promise = cache.getBook(bookDto.model).then(function (bookCache) {
				var shelfBB = shelf.geometry.boundingBox;
				var bookBB = bookCache.geometry.boundingBox;
				var freePlace = getFreePlace(shelf.children, shelfBB, bookBB);

				if(freePlace) {
					return saveBook(bookDto, freePlace, shelf);
				} else {
					return $q.reject('there is no free space');
				}
			}).then(function () {
				return environment.updateBook(bookDto);
			});
		} else {
			promise = $q.reject('shelf is not selected');
		}

		return promise;
	};

	var saveBook = function(dto, position, shelf) {
		dto.shelfId = shelf.id;
		dto.sectionId = shelf.parent.id;
		dto.pos_x = position.x;
		dto.pos_y = position.y;
		dto.pos_z = position.z;

		return Data.postBook(dto);
	};

	locator.unplaceBook = function(bookDto) {
		var promise;
		bookDto.sectionId = null;

		promise = Data.postBook(bookDto).then(function () {
			return environment.updateBook(bookDto);
		});

		return promise;
	};

	var getFreePlace = function(objects, spaceBB, targetBB) {
		var matrixPrecision = new THREE.Vector3(targetBB.max.x - targetBB.min.x, 0, targetBB.max.z - targetBB.min.z);
		var occupiedMatrix = getOccupiedMatrix(objects, matrixPrecision);
		var freePosition = getFreeMatrixCells(occupiedMatrix, spaceBB, targetBB, matrixPrecision);
		
		if (VISUAL_DEBUG) {
			debugShowFree(freePosition, matrixPrecision, environment.library);
		}

		return freePosition;
	};

	var getFreeMatrixCells = function(occupiedMatrix, spaceBB, targetBB, matrixPrecision) {
		var targetCellsSize = 1;
		var freeCellsCount = 0;
		var freeCellsStart;
		var xIndex;
		var zIndex;
		var cells;

		var minXCell = Math.floor(spaceBB.min.x / matrixPrecision.x) + 1;
		var maxXCell = Math.floor(spaceBB.max.x / matrixPrecision.x);
		var minZCell = Math.floor(spaceBB.min.z / matrixPrecision.z) + 1;
		var maxZCell = Math.floor(spaceBB.max.z / matrixPrecision.z);

		for (zIndex = minZCell; zIndex <= maxZCell; zIndex++) {
			for (xIndex = minXCell; xIndex <= maxXCell; xIndex++) {
				if (!occupiedMatrix[zIndex][xIndex]) {
					freeCellsStart || (freeCellsStart = xIndex);
					freeCellsCount++;

					if (freeCellsCount === targetCellsSize) {
						cells = _.range(freeCellsStart, freeCellsStart + freeCellsCount);
						return getPositionFromCells(cells, zIndex, matrixPrecision, spaceBB, targetBB);
					}
				} else {
					freeCellsCount = 0;
				}
			}
		}

		return null;
	};

	var getPositionFromCells = function(cells, zIndex, matrixPrecision, spaceBB, targetBB) {
		var size = cells.length * matrixPrecision.x;
		var x = cells[0] * matrixPrecision.x;
		var z =	zIndex * matrixPrecision.z;
		var y = getBottomY(spaceBB, targetBB);

		return new THREE.Vector3(x, y, z);
	};

	var getBottomY = function(spaceBB, targetBB) {
		return spaceBB.min.y - targetBB.min.y + environment.CLEARANCE;
	};

	var getOccupiedMatrix = function(objects, matrixPrecision) {
		var result = {};
		var objectBB;
		var minKeyX;
		var maxKeyX;
		var minKeyZ;
		var maxKeyZ;		
		var z;

		objects.forEach(function (obj) {
			if (obj instanceof SectionObject || obj instanceof BookObject) {
				objectBB = obj.boundingBox;

				minKeyX = Math.round((objectBB.center.x - objectBB.radius.x) / matrixPrecision.x);
				maxKeyX = Math.round((objectBB.center.x + objectBB.radius.x) / matrixPrecision.x);
				minKeyZ = Math.round((objectBB.center.z - objectBB.radius.z) / matrixPrecision.z);
				maxKeyZ = Math.round((objectBB.center.z + objectBB.radius.z) / matrixPrecision.z);

				for (z = minKeyZ; z <= maxKeyZ; z++) {
					result[z] || (result[z] = {});
					result[z][minKeyX] = true;
					result[z][maxKeyX] = true;

					if (VISUAL_DEBUG) {
						debugShowBB(obj);
						debugAddOccupied([minKeyX, maxKeyX], matrixPrecision, obj, z);
					}
				}
			}
		});

		return result;
	};

	var debugShowBB = function(obj) {
		var objectBB = obj.boundingBox;
		var objBox = new THREE.Mesh(
			new THREE.CubeGeometry(
				objectBB.radius.x * 2, 
				objectBB.radius.y * 2 + 0.1, 
				objectBB.radius.z * 2
			), 
			new THREE.MeshLambertMaterial({
				color: 0xbbbbff,
				opacity: 0.2,
				transparent: true
			})
		);
		
		objBox.position.x = objectBB.center.x;
		objBox.position.y = objectBB.center.y;
		objBox.position.z = objectBB.center.z;

		obj.parent.add(objBox);
	};

	var debugAddOccupied = function(cells, matrixPrecision, obj, zKey) {
		cells.forEach(function (cell) {
			var pos = getPositionFromCells([cell], zKey, matrixPrecision, obj.parent.geometry.boundingBox, obj.geometry.boundingBox)
			var cellBox = new THREE.Mesh(new THREE.CubeGeometry(matrixPrecision.x - 0.01, 0.01, matrixPrecision.z - 0.01), new THREE.MeshLambertMaterial({color: 0xff0000}));
			
			cellBox.position = pos;
			obj.parent.add(cellBox);
		});
	};

	var debugShowFree = function(position, matrixPrecision, obj) {
		if (position) {
			var cellBox = new THREE.Mesh(new THREE.CubeGeometry(matrixPrecision.x, 0.5, matrixPrecision.z), new THREE.MeshLambertMaterial({color: 0x00ff00}));
			cellBox.position = position;
			obj.parent.add(cellBox);
		}
	};

	return locator;	
});
angular.module('VirtualBookshelf')
.factory('selector', function ($rootScope, SelectorMeta, BookObject, ShelfObject, SectionObject, Camera, environment, highlight) {
	var selector = {};
	
	var selected = new SelectorMeta();
	var focused = new SelectorMeta();

	selector.focus = function(meta) {
		if(!meta.equals(focused)) {
			if(!focused.equals(selected)) {
				highlight.focus(null);
			}

			focused = meta;

			if(!focused.isEmpty() && !focused.equals(selected)) {
				var obj = getObject(focused);
				highlight.focus(obj);
			}
		}
	};

	selector.selectFocused = function() {
		var meta = focused;

		selector.select(meta);
		$rootScope.$apply();
	};

	selector.select = function(meta) {
		if(!meta.equals(selected)) {
			selector.unselect();
			selected = meta;

			var obj = getObject(selected);
			highlight.select(obj);
			highlight.focus(null);
		}
	};

	selector.unselect = function() {
		if(!selected.isEmpty()) {
			highlight.select(null);
			selected = new SelectorMeta();
		}
	};

	selector.getSelectedObject = function() {
		return getObject(selected);
	};

	var getObject = function(meta) {
		var object;

		if(!meta.isEmpty()) {
			object = isShelf(meta) ? environment.getShelf(meta.parentId, meta.id)
				: isBook(meta) ? environment.getBook(meta.id)
				: isSection(meta) ? environment.getSection(meta.id)
				: null;
		}

		return object;	
	};

	selector.isBookSelected = function(id) {
		return isBook(selected) && selected.id === id;
	};

	selector.isSelectedShelf = function() {
		return isShelf(selected);
	};

	selector.isSelectedBook = function() {
		return isBook(selected);
	};

	selector.isSelectedSection = function() {
		return isSection(selected);
	};

	var isShelf = function(meta) {
		return meta.type === ShelfObject.TYPE;
	};

	var isBook = function(meta) {
		return meta.type === BookObject.TYPE;
	};

	var isSection = function(meta) {
		return meta.type === SectionObject.TYPE;
	};

	return selector;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL1VpQ3RybC5qcyIsImRpcmVjdGl2ZXMvc2VsZWN0LmpzIiwibGlicy9sb2Rhc2gubWluLmpzIiwic2VydmljZXMvYXJjaGl2ZS5qcyIsInNlcnZpY2VzL2NhY2hlLmpzIiwic2VydmljZXMvY2FtZXJhLmpzIiwic2VydmljZXMvY29udHJvbHMuanMiLCJzZXJ2aWNlcy9kYXRhLmpzIiwic2VydmljZXMvZW52aXJvbm1lbnQuanMiLCJzZXJ2aWNlcy9tYWluLmpzIiwic2VydmljZXMvbW91c2UuanMiLCJzZXJ2aWNlcy9uYXZpZ2F0aW9uLmpzIiwic2VydmljZXMvdWkuanMiLCJzZXJ2aWNlcy91c2VyLmpzIiwibGlicy90aHJlZS5qcy90aHJlZXgud2luZG93cmVzaXplLmpzIiwic2VydmljZXMvbW9kZWxzL0Jhc2VPYmplY3QuanMiLCJzZXJ2aWNlcy9tb2RlbHMvQm9va09iamVjdC5qcyIsInNlcnZpY2VzL21vZGVscy9DYW1lcmFPYmplY3QuanMiLCJzZXJ2aWNlcy9tb2RlbHMvQ2FudmFzSW1hZ2UuanMiLCJzZXJ2aWNlcy9tb2RlbHMvQ2FudmFzVGV4dC5qcyIsInNlcnZpY2VzL21vZGVscy9MaWJyYXJ5T2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL1NlY3Rpb25PYmplY3QuanMiLCJzZXJ2aWNlcy9tb2RlbHMvU2VsZWN0b3JNZXRhLmpzIiwic2VydmljZXMvbW9kZWxzL1NoZWxmT2JqZWN0LmpzIiwic2VydmljZXMvc2NlbmUvaGlnaGxpZ2h0LmpzIiwic2VydmljZXMvc2NlbmUvbG9jYXRvci5qcyIsInNlcnZpY2VzL3NjZW5lL3NlbGVjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeGJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXJcbiAgICAubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJywgWydibG9ja1VJJywgJ2FuZ3VsYXJVdGlscy5kaXJlY3RpdmVzLmRpclBhZ2luYXRpb24nXSlcbiAgICBcdC5jb25maWcoZnVuY3Rpb24gKGJsb2NrVUlDb25maWcsIHBhZ2luYXRpb25UZW1wbGF0ZVByb3ZpZGVyKSB7XG4gICAgXHRcdGJsb2NrVUlDb25maWcuZGVsYXkgPSAwO1xuICAgIFx0XHRibG9ja1VJQ29uZmlnLmF1dG9CbG9jayA9IGZhbHNlO1xuXHRcdFx0YmxvY2tVSUNvbmZpZy5hdXRvSW5qZWN0Qm9keUJsb2NrID0gZmFsc2U7XG5cdFx0XHRwYWdpbmF0aW9uVGVtcGxhdGVQcm92aWRlci5zZXRQYXRoKCcvanMvYW5ndWxhci9kaXJQYWdpbmF0aW9uL2RpclBhZ2luYXRpb24udHBsLmh0bWwnKTtcbiAgICBcdH0pXG4gICAgXHQucnVuKGZ1bmN0aW9uIChNYWluKSB7XG5cdFx0XHRNYWluLnN0YXJ0KCk7XG4gICAgXHR9KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uY29udHJvbGxlcignVWlDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgVUkpIHtcbiAgICAkc2NvcGUubWVudSA9IFVJLm1lbnU7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZGlyZWN0aXZlKCd2YlNlbGVjdCcsIGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHJlc3RyaWN0OiAnRScsXG4gICAgXHR0cmFuc2NsdWRlOiB0cnVlLFxuXHRcdHRlbXBsYXRlVXJsOiAnL3VpL3NlbGVjdC5lanMnLFxuXHRcdHNjb3BlOiB7XG5cdFx0XHRvcHRpb25zOiAnPScsXG5cdFx0XHRzZWxlY3RlZDogJz0nLFxuXHRcdFx0dmFsdWU6ICdAJyxcblx0XHRcdGxhYmVsOiAnQCdcblx0XHR9LFxuXHRcdGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY29udHJvbGxlciwgdHJhbnNjbHVkZSkge1xuXHRcdFx0c2NvcGUuc2VsZWN0ID0gZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRzY29wZS5zZWxlY3RlZCA9IGl0ZW1bc2NvcGUudmFsdWVdO1xuXHRcdFx0fTtcblxuXHRcdFx0c2NvcGUuaXNTZWxlY3RlZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0cmV0dXJuIHNjb3BlLnNlbGVjdGVkID09PSBpdGVtW3Njb3BlLnZhbHVlXTtcblx0XHRcdH07XG5cdFx0fVxuXHR9XG59KTtcbiIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIGxvZGFzaCAzLjIuMCAoQ3VzdG9tIEJ1aWxkKSBsb2Rhc2guY29tL2xpY2Vuc2UgfCBVbmRlcnNjb3JlLmpzIDEuNy4wIHVuZGVyc2NvcmVqcy5vcmcvTElDRU5TRVxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIC1vIC4vbG9kYXNoLmpzYFxuICovXG47KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gbihuLHQpe2lmKG4hPT10KXt2YXIgcj1uPT09bixlPXQ9PT10O2lmKG4+dHx8IXJ8fHR5cGVvZiBuPT1cInVuZGVmaW5lZFwiJiZlKXJldHVybiAxO2lmKG48dHx8IWV8fHR5cGVvZiB0PT1cInVuZGVmaW5lZFwiJiZyKXJldHVybi0xfXJldHVybiAwfWZ1bmN0aW9uIHQobix0LHIpe2lmKHQhPT10KXJldHVybiBwKG4scik7cj0ocnx8MCktMTtmb3IodmFyIGU9bi5sZW5ndGg7KytyPGU7KWlmKG5bcl09PT10KXJldHVybiByO3JldHVybi0xfWZ1bmN0aW9uIHIobix0KXt2YXIgcj1uLmxlbmd0aDtmb3Iobi5zb3J0KHQpO3ItLTspbltyXT1uW3JdLmM7cmV0dXJuIG59ZnVuY3Rpb24gZShuKXtyZXR1cm4gdHlwZW9mIG49PVwic3RyaW5nXCI/bjpudWxsPT1uP1wiXCI6bitcIlwifWZ1bmN0aW9uIHUobil7cmV0dXJuIG4uY2hhckNvZGVBdCgwKX1mdW5jdGlvbiBvKG4sdCl7Zm9yKHZhciByPS0xLGU9bi5sZW5ndGg7KytyPGUmJi0xPHQuaW5kZXhPZihuLmNoYXJBdChyKSk7KTtyZXR1cm4gclxufWZ1bmN0aW9uIGkobix0KXtmb3IodmFyIHI9bi5sZW5ndGg7ci0tJiYtMTx0LmluZGV4T2Yobi5jaGFyQXQocikpOyk7cmV0dXJuIHJ9ZnVuY3Rpb24gZih0LHIpe3JldHVybiBuKHQuYSxyLmEpfHx0LmItci5ifWZ1bmN0aW9uIGEodCxyKXtmb3IodmFyIGU9LTEsdT10LmEsbz1yLmEsaT11Lmxlbmd0aDsrK2U8aTspe3ZhciBmPW4odVtlXSxvW2VdKTtpZihmKXJldHVybiBmfXJldHVybiB0LmItci5ifWZ1bmN0aW9uIGMobil7cmV0dXJuIFd0W25dfWZ1bmN0aW9uIGwobil7cmV0dXJuIE50W25dfWZ1bmN0aW9uIHMobil7cmV0dXJuXCJcXFxcXCIrTHRbbl19ZnVuY3Rpb24gcChuLHQscil7dmFyIGU9bi5sZW5ndGg7Zm9yKHQ9cj90fHxlOih0fHwwKS0xO3I/dC0tOisrdDxlOyl7dmFyIHU9blt0XTtpZih1IT09dSlyZXR1cm4gdH1yZXR1cm4tMX1mdW5jdGlvbiBoKG4pe3JldHVybiBuJiZ0eXBlb2Ygbj09XCJvYmplY3RcInx8ZmFsc2V9ZnVuY3Rpb24gXyhuKXtyZXR1cm4gMTYwPj1uJiY5PD1uJiYxMz49bnx8MzI9PW58fDE2MD09bnx8NTc2MD09bnx8NjE1OD09bnx8ODE5Mjw9biYmKDgyMDI+PW58fDgyMzI9PW58fDgyMzM9PW58fDgyMzk9PW58fDgyODc9PW58fDEyMjg4PT1ufHw2NTI3OT09bilcbn1mdW5jdGlvbiBnKG4sdCl7Zm9yKHZhciByPS0xLGU9bi5sZW5ndGgsdT0tMSxvPVtdOysrcjxlOyluW3JdPT09dCYmKG5bcl09QixvWysrdV09cik7cmV0dXJuIG99ZnVuY3Rpb24gdihuKXtmb3IodmFyIHQ9LTEscj1uLmxlbmd0aDsrK3Q8ciYmXyhuLmNoYXJDb2RlQXQodCkpOyk7cmV0dXJuIHR9ZnVuY3Rpb24geShuKXtmb3IodmFyIHQ9bi5sZW5ndGg7dC0tJiZfKG4uY2hhckNvZGVBdCh0KSk7KTtyZXR1cm4gdH1mdW5jdGlvbiBkKG4pe3JldHVybiBVdFtuXX1mdW5jdGlvbiBtKF8pe2Z1bmN0aW9uIFd0KG4pe2lmKGgobikmJiEoU28obil8fG4gaW5zdGFuY2VvZiBVdCkpe2lmKG4gaW5zdGFuY2VvZiBOdClyZXR1cm4gbjtpZihVdS5jYWxsKG4sXCJfX2NoYWluX19cIikmJlV1LmNhbGwobixcIl9fd3JhcHBlZF9fXCIpKXJldHVybiBoZShuKX1yZXR1cm4gbmV3IE50KG4pfWZ1bmN0aW9uIE50KG4sdCxyKXt0aGlzLl9fd3JhcHBlZF9fPW4sdGhpcy5fX2FjdGlvbnNfXz1yfHxbXSx0aGlzLl9fY2hhaW5fXz0hIXRcbn1mdW5jdGlvbiBVdChuKXt0aGlzLl9fd3JhcHBlZF9fPW4sdGhpcy5fX2FjdGlvbnNfXz1udWxsLHRoaXMuX19kaXJfXz0xLHRoaXMuX19kcm9wQ291bnRfXz0wLHRoaXMuX19maWx0ZXJlZF9fPWZhbHNlLHRoaXMuX19pdGVyYXRlZXNfXz1udWxsLHRoaXMuX190YWtlQ291bnRfXz1zbyx0aGlzLl9fdmlld3NfXz1udWxsfWZ1bmN0aW9uIEZ0KCl7dGhpcy5fX2RhdGFfXz17fX1mdW5jdGlvbiBMdChuKXt2YXIgdD1uP24ubGVuZ3RoOjA7Zm9yKHRoaXMuZGF0YT17aGFzaDp0byhudWxsKSxzZXQ6bmV3IFp1fTt0LS07KXRoaXMucHVzaChuW3RdKX1mdW5jdGlvbiBCdChuLHQpe3ZhciByPW4uZGF0YTtyZXR1cm4odHlwZW9mIHQ9PVwic3RyaW5nXCJ8fFhlKHQpP3Iuc2V0Lmhhcyh0KTpyLmhhc2hbdF0pPzA6LTF9ZnVuY3Rpb24genQobix0KXt2YXIgcj0tMSxlPW4ubGVuZ3RoO2Zvcih0fHwodD13dShlKSk7KytyPGU7KXRbcl09bltyXTtyZXR1cm4gdH1mdW5jdGlvbiBNdChuLHQpe2Zvcih2YXIgcj0tMSxlPW4ubGVuZ3RoOysrcjxlJiZmYWxzZSE9PXQobltyXSxyLG4pOyk7cmV0dXJuIG5cbn1mdW5jdGlvbiBxdChuLHQpe2Zvcih2YXIgcj0tMSxlPW4ubGVuZ3RoOysrcjxlOylpZighdChuW3JdLHIsbikpcmV0dXJuIGZhbHNlO3JldHVybiB0cnVlfWZ1bmN0aW9uIFB0KG4sdCl7Zm9yKHZhciByPS0xLGU9bi5sZW5ndGgsdT0tMSxvPVtdOysrcjxlOyl7dmFyIGk9bltyXTt0KGkscixuKSYmKG9bKyt1XT1pKX1yZXR1cm4gb31mdW5jdGlvbiBLdChuLHQpe2Zvcih2YXIgcj0tMSxlPW4ubGVuZ3RoLHU9d3UoZSk7KytyPGU7KXVbcl09dChuW3JdLHIsbik7cmV0dXJuIHV9ZnVuY3Rpb24gVnQobil7Zm9yKHZhciB0PS0xLHI9bi5sZW5ndGgsZT1sbzsrK3Q8cjspe3ZhciB1PW5bdF07dT5lJiYoZT11KX1yZXR1cm4gZX1mdW5jdGlvbiBZdChuLHQscixlKXt2YXIgdT0tMSxvPW4ubGVuZ3RoO2ZvcihlJiZvJiYocj1uWysrdV0pOysrdTxvOylyPXQocixuW3VdLHUsbik7cmV0dXJuIHJ9ZnVuY3Rpb24gWnQobix0LHIsZSl7dmFyIHU9bi5sZW5ndGg7Zm9yKGUmJnUmJihyPW5bLS11XSk7dS0tOylyPXQocixuW3VdLHUsbik7XG5yZXR1cm4gcn1mdW5jdGlvbiBHdChuLHQpe2Zvcih2YXIgcj0tMSxlPW4ubGVuZ3RoOysrcjxlOylpZih0KG5bcl0scixuKSlyZXR1cm4gdHJ1ZTtyZXR1cm4gZmFsc2V9ZnVuY3Rpb24gSnQobix0KXtyZXR1cm4gdHlwZW9mIG49PVwidW5kZWZpbmVkXCI/dDpufWZ1bmN0aW9uIFh0KG4sdCxyLGUpe3JldHVybiB0eXBlb2YgbiE9XCJ1bmRlZmluZWRcIiYmVXUuY2FsbChlLHIpP246dH1mdW5jdGlvbiBIdChuLHQscil7dmFyIGU9Rm8odCk7aWYoIXIpcmV0dXJuIG5yKHQsbixlKTtmb3IodmFyIHU9LTEsbz1lLmxlbmd0aDsrK3U8bzspe3ZhciBpPWVbdV0sZj1uW2ldLGE9cihmLHRbaV0saSxuLHQpOyhhPT09YT9hPT09ZjpmIT09ZikmJih0eXBlb2YgZiE9XCJ1bmRlZmluZWRcInx8aSBpbiBuKXx8KG5baV09YSl9cmV0dXJuIG59ZnVuY3Rpb24gUXQobix0KXtmb3IodmFyIHI9LTEsZT1uLmxlbmd0aCx1PW9lKGUpLG89dC5sZW5ndGgsaT13dShvKTsrK3I8bzspe3ZhciBmPXRbcl07dT8oZj1wYXJzZUZsb2F0KGYpLGlbcl09ZWUoZixlKT9uW2ZdOncpOmlbcl09bltmXVxufXJldHVybiBpfWZ1bmN0aW9uIG5yKG4sdCxyKXtyfHwocj10LHQ9e30pO2Zvcih2YXIgZT0tMSx1PXIubGVuZ3RoOysrZTx1Oyl7dmFyIG89cltlXTt0W29dPW5bb119cmV0dXJuIHR9ZnVuY3Rpb24gdHIobix0LHIpe3ZhciBlPXR5cGVvZiBuO2lmKFwiZnVuY3Rpb25cIj09ZSl7aWYoZT10eXBlb2YgdCE9XCJ1bmRlZmluZWRcIil7dmFyIGU9V3Quc3VwcG9ydCx1PSEoZS5mdW5jTmFtZXM/bi5uYW1lOmUuZnVuY0RlY29tcCk7aWYoIXUpe3ZhciBvPVd1LmNhbGwobik7ZS5mdW5jTmFtZXN8fCh1PSFkdC50ZXN0KG8pKSx1fHwodT1rdC50ZXN0KG8pfHxIZShuKSxibyhuLHUpKX1lPXV9bj1lP05yKG4sdCxyKTpufWVsc2Ugbj1udWxsPT1uP3Z1Olwib2JqZWN0XCI9PWU/YnIobik6dHlwZW9mIHQ9PVwidW5kZWZpbmVkXCI/anIobitcIlwiKTp4cihuK1wiXCIsdCk7cmV0dXJuIG59ZnVuY3Rpb24gcnIobix0LHIsZSx1LG8saSl7dmFyIGY7aWYociYmKGY9dT9yKG4sZSx1KTpyKG4pKSx0eXBlb2YgZiE9XCJ1bmRlZmluZWRcIilyZXR1cm4gZjtcbmlmKCFYZShuKSlyZXR1cm4gbjtpZihlPVNvKG4pKXtpZihmPW5lKG4pLCF0KXJldHVybiB6dChuLGYpfWVsc2V7dmFyIGE9THUuY2FsbChuKSxjPWE9PUs7aWYoYSE9WSYmYSE9eiYmKCFjfHx1KSlyZXR1cm4gVHRbYV0/cmUobixhLHQpOnU/bjp7fTtpZihmPXRlKGM/e306biksIXQpcmV0dXJuIG5yKG4sZixGbyhuKSl9Zm9yKG98fChvPVtdKSxpfHwoaT1bXSksdT1vLmxlbmd0aDt1LS07KWlmKG9bdV09PW4pcmV0dXJuIGlbdV07cmV0dXJuIG8ucHVzaChuKSxpLnB1c2goZiksKGU/TXQ6X3IpKG4sZnVuY3Rpb24oZSx1KXtmW3VdPXJyKGUsdCxyLHUsbixvLGkpfSksZn1mdW5jdGlvbiBlcihuLHQscixlKXtpZih0eXBlb2YgbiE9XCJmdW5jdGlvblwiKXRocm93IG5ldyBPdSgkKTtyZXR1cm4gR3UoZnVuY3Rpb24oKXtuLmFwcGx5KHcsUnIocixlKSl9LHQpfWZ1bmN0aW9uIHVyKG4scil7dmFyIGU9bj9uLmxlbmd0aDowLHU9W107aWYoIWUpcmV0dXJuIHU7dmFyIG89LTEsaT1RcigpLGY9aT09dCxhPWYmJjIwMDw9ci5sZW5ndGgmJnhvKHIpLGM9ci5sZW5ndGg7XG5hJiYoaT1CdCxmPWZhbHNlLHI9YSk7bjpmb3IoOysrbzxlOylpZihhPW5bb10sZiYmYT09PWEpe2Zvcih2YXIgbD1jO2wtLTspaWYocltsXT09PWEpY29udGludWUgbjt1LnB1c2goYSl9ZWxzZSAwPmkocixhKSYmdS5wdXNoKGEpO3JldHVybiB1fWZ1bmN0aW9uIG9yKG4sdCl7dmFyIHI9bj9uLmxlbmd0aDowO2lmKCFvZShyKSlyZXR1cm4gX3Iobix0KTtmb3IodmFyIGU9LTEsdT1wZShuKTsrK2U8ciYmZmFsc2UhPT10KHVbZV0sZSx1KTspO3JldHVybiBufWZ1bmN0aW9uIGlyKG4sdCl7dmFyIHI9bj9uLmxlbmd0aDowO2lmKCFvZShyKSlyZXR1cm4gZ3Iobix0KTtmb3IodmFyIGU9cGUobik7ci0tJiZmYWxzZSE9PXQoZVtyXSxyLGUpOyk7cmV0dXJuIG59ZnVuY3Rpb24gZnIobix0KXt2YXIgcj10cnVlO3JldHVybiBvcihuLGZ1bmN0aW9uKG4sZSx1KXtyZXR1cm4gcj0hIXQobixlLHUpfSkscn1mdW5jdGlvbiBhcihuLHQpe3ZhciByPVtdO3JldHVybiBvcihuLGZ1bmN0aW9uKG4sZSx1KXt0KG4sZSx1KSYmci5wdXNoKG4pXG59KSxyfWZ1bmN0aW9uIGNyKG4sdCxyLGUpe3ZhciB1O3JldHVybiByKG4sZnVuY3Rpb24obixyLG8pe3JldHVybiB0KG4scixvKT8odT1lP3I6bixmYWxzZSk6dm9pZCAwfSksdX1mdW5jdGlvbiBscihuLHQscixlKXtlPShlfHwwKS0xO2Zvcih2YXIgdT1uLmxlbmd0aCxvPS0xLGk9W107KytlPHU7KXt2YXIgZj1uW2VdO2lmKGgoZikmJm9lKGYubGVuZ3RoKSYmKFNvKGYpfHxZZShmKSkpe3QmJihmPWxyKGYsdCxyKSk7dmFyIGE9LTEsYz1mLmxlbmd0aDtmb3IoaS5sZW5ndGgrPWM7KythPGM7KWlbKytvXT1mW2FdfWVsc2Ugcnx8KGlbKytvXT1mKX1yZXR1cm4gaX1mdW5jdGlvbiBzcihuLHQscil7dmFyIGU9LTEsdT1wZShuKTtyPXIobik7Zm9yKHZhciBvPXIubGVuZ3RoOysrZTxvOyl7dmFyIGk9cltlXTtpZihmYWxzZT09PXQodVtpXSxpLHUpKWJyZWFrfXJldHVybiBufWZ1bmN0aW9uIHByKG4sdCxyKXt2YXIgZT1wZShuKTtyPXIobik7Zm9yKHZhciB1PXIubGVuZ3RoO3UtLTspe3ZhciBvPXJbdV07XG5pZihmYWxzZT09PXQoZVtvXSxvLGUpKWJyZWFrfXJldHVybiBufWZ1bmN0aW9uIGhyKG4sdCl7c3Iobix0LG91KX1mdW5jdGlvbiBfcihuLHQpe3JldHVybiBzcihuLHQsRm8pfWZ1bmN0aW9uIGdyKG4sdCl7cmV0dXJuIHByKG4sdCxGbyl9ZnVuY3Rpb24gdnIobix0KXtmb3IodmFyIHI9LTEsZT10Lmxlbmd0aCx1PS0xLG89W107KytyPGU7KXt2YXIgaT10W3JdO0plKG5baV0pJiYob1srK3VdPWkpfXJldHVybiBvfWZ1bmN0aW9uIHlyKG4sdCxyKXt2YXIgZT0tMSx1PXR5cGVvZiB0PT1cImZ1bmN0aW9uXCIsbz1uP24ubGVuZ3RoOjAsaT1vZShvKT93dShvKTpbXTtyZXR1cm4gb3IobixmdW5jdGlvbihuKXt2YXIgbz11P3Q6bnVsbCE9biYmblt0XTtpWysrZV09bz9vLmFwcGx5KG4scik6d30pLGl9ZnVuY3Rpb24gZHIobix0LHIsZSx1LG8pe2lmKG49PT10KXJldHVybiAwIT09bnx8MS9uPT0xL3Q7dmFyIGk9dHlwZW9mIG4sZj10eXBlb2YgdDtpZihcImZ1bmN0aW9uXCIhPWkmJlwib2JqZWN0XCIhPWkmJlwiZnVuY3Rpb25cIiE9ZiYmXCJvYmplY3RcIiE9Znx8bnVsbD09bnx8bnVsbD09dCluPW4hPT1uJiZ0IT09dDtcbmVsc2Ugbjp7dmFyIGk9ZHIsZj1TbyhuKSxhPVNvKHQpLGM9RCxsPUQ7Znx8KGM9THUuY2FsbChuKSxjPT16P2M9WTpjIT1ZJiYoZj1ydShuKSkpLGF8fChsPUx1LmNhbGwodCksbD09ej9sPVk6bCE9WSYmcnUodCkpO3ZhciBzPWM9PVksYT1sPT1ZLGw9Yz09bDtpZighbHx8Znx8cylpZihjPXMmJlV1LmNhbGwobixcIl9fd3JhcHBlZF9fXCIpLGE9YSYmVXUuY2FsbCh0LFwiX193cmFwcGVkX19cIiksY3x8YSluPWkoYz9uLnZhbHVlKCk6bixhP3QudmFsdWUoKTp0LHIsZSx1LG8pO2Vsc2UgaWYobCl7Zm9yKHV8fCh1PVtdKSxvfHwobz1bXSksYz11Lmxlbmd0aDtjLS07KWlmKHVbY109PW4pe249b1tjXT09dDticmVhayBufXUucHVzaChuKSxvLnB1c2godCksbj0oZj9acjpKcikobix0LGkscixlLHUsbyksdS5wb3AoKSxvLnBvcCgpfWVsc2Ugbj1mYWxzZTtlbHNlIG49R3Iobix0LGMpfXJldHVybiBufWZ1bmN0aW9uIG1yKG4sdCxyLGUsdSl7dmFyIG89dC5sZW5ndGg7aWYobnVsbD09bilyZXR1cm4hbztcbmZvcih2YXIgaT0tMSxmPSF1OysraTxvOylpZihmJiZlW2ldP3JbaV0hPT1uW3RbaV1dOiFVdS5jYWxsKG4sdFtpXSkpcmV0dXJuIGZhbHNlO2ZvcihpPS0xOysraTxvOyl7dmFyIGE9dFtpXTtpZihmJiZlW2ldKWE9VXUuY2FsbChuLGEpO2Vsc2V7dmFyIGM9blthXSxsPXJbaV0sYT11P3UoYyxsLGEpOnc7dHlwZW9mIGE9PVwidW5kZWZpbmVkXCImJihhPWRyKGwsYyx1LHRydWUpKX1pZighYSlyZXR1cm4gZmFsc2V9cmV0dXJuIHRydWV9ZnVuY3Rpb24gd3Iobix0KXt2YXIgcj1bXTtyZXR1cm4gb3IobixmdW5jdGlvbihuLGUsdSl7ci5wdXNoKHQobixlLHUpKX0pLHJ9ZnVuY3Rpb24gYnIobil7dmFyIHQ9Rm8obikscj10Lmxlbmd0aDtpZigxPT1yKXt2YXIgZT10WzBdLHU9bltlXTtpZihpZSh1KSlyZXR1cm4gZnVuY3Rpb24obil7cmV0dXJuIG51bGwhPW4mJm5bZV09PT11JiZVdS5jYWxsKG4sZSl9fWZvcih2YXIgbz13dShyKSxpPXd1KHIpO3ItLTspdT1uW3Rbcl1dLG9bcl09dSxpW3JdPWllKHUpO3JldHVybiBmdW5jdGlvbihuKXtyZXR1cm4gbXIobix0LG8saSlcbn19ZnVuY3Rpb24geHIobix0KXtyZXR1cm4gaWUodCk/ZnVuY3Rpb24ocil7cmV0dXJuIG51bGwhPXImJnJbbl09PT10fTpmdW5jdGlvbihyKXtyZXR1cm4gbnVsbCE9ciYmZHIodCxyW25dLG51bGwsdHJ1ZSl9fWZ1bmN0aW9uIEFyKG4sdCxyLGUsdSl7dmFyIG89b2UodC5sZW5ndGgpJiYoU28odCl8fHJ1KHQpKTtyZXR1cm4obz9NdDpfcikodCxmdW5jdGlvbih0LGksZil7aWYoaCh0KSl7ZXx8KGU9W10pLHV8fCh1PVtdKTtuOnt0PWU7Zm9yKHZhciBhPXUsYz10Lmxlbmd0aCxsPWZbaV07Yy0tOylpZih0W2NdPT1sKXtuW2ldPWFbY10saT12b2lkIDA7YnJlYWsgbn1jPW5baV0sZj1yP3IoYyxsLGksbixmKTp3O3ZhciBzPXR5cGVvZiBmPT1cInVuZGVmaW5lZFwiO3MmJihmPWwsb2UobC5sZW5ndGgpJiYoU28obCl8fHJ1KGwpKT9mPVNvKGMpP2M6Yz96dChjKTpbXTpObyhsKXx8WWUobCk/Zj1ZZShjKT9ldShjKTpObyhjKT9jOnt9OnM9ZmFsc2UpLHQucHVzaChsKSxhLnB1c2goZikscz9uW2ldPUFyKGYsbCxyLHQsYSk6KGY9PT1mP2YhPT1jOmM9PT1jKSYmKG5baV09ZiksaT12b2lkIDBcbn1yZXR1cm4gaX1hPW5baV0sZj1yP3IoYSx0LGksbixmKTp3LChsPXR5cGVvZiBmPT1cInVuZGVmaW5lZFwiKSYmKGY9dCksIW8mJnR5cGVvZiBmPT1cInVuZGVmaW5lZFwifHwhbCYmKGY9PT1mP2Y9PT1hOmEhPT1hKXx8KG5baV09Zil9KSxufWZ1bmN0aW9uIGpyKG4pe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gbnVsbD09dD93OnRbbl19fWZ1bmN0aW9uIGtyKG4sdCl7cmV0dXJuIG4rUHUoY28oKSoodC1uKzEpKX1mdW5jdGlvbiBFcihuLHQscixlLHUpe3JldHVybiB1KG4sZnVuY3Rpb24obix1LG8pe3I9ZT8oZT1mYWxzZSxuKTp0KHIsbix1LG8pfSkscn1mdW5jdGlvbiBScihuLHQscil7dmFyIGU9LTEsdT1uLmxlbmd0aDtmb3IodD1udWxsPT10PzA6K3R8fDAsMD50JiYodD0tdD51PzA6dSt0KSxyPXR5cGVvZiByPT1cInVuZGVmaW5lZFwifHxyPnU/dTorcnx8MCwwPnImJihyKz11KSx1PXQ+cj8wOnItdD4+PjAsdD4+Pj0wLHI9d3UodSk7KytlPHU7KXJbZV09bltlK3RdO3JldHVybiByfWZ1bmN0aW9uIElyKG4sdCl7dmFyIHI7XG5yZXR1cm4gb3IobixmdW5jdGlvbihuLGUsdSl7cmV0dXJuIHI9dChuLGUsdSksIXJ9KSwhIXJ9ZnVuY3Rpb24gT3IobixyKXt2YXIgZT0tMSx1PVFyKCksbz1uLmxlbmd0aCxpPXU9PXQsZj1pJiYyMDA8PW8sYT1mJiZ4bygpLGM9W107YT8odT1CdCxpPWZhbHNlKTooZj1mYWxzZSxhPXI/W106Yyk7bjpmb3IoOysrZTxvOyl7dmFyIGw9bltlXSxzPXI/cihsLGUsbik6bDtpZihpJiZsPT09bCl7Zm9yKHZhciBwPWEubGVuZ3RoO3AtLTspaWYoYVtwXT09PXMpY29udGludWUgbjtyJiZhLnB1c2gocyksYy5wdXNoKGwpfWVsc2UgMD51KGEscykmJigocnx8ZikmJmEucHVzaChzKSxjLnB1c2gobCkpfXJldHVybiBjfWZ1bmN0aW9uIENyKG4sdCl7Zm9yKHZhciByPS0xLGU9dC5sZW5ndGgsdT13dShlKTsrK3I8ZTspdVtyXT1uW3Rbcl1dO3JldHVybiB1fWZ1bmN0aW9uIFRyKG4sdCl7dmFyIHI9bjtyIGluc3RhbmNlb2YgVXQmJihyPXIudmFsdWUoKSk7Zm9yKHZhciBlPS0xLHU9dC5sZW5ndGg7KytlPHU7KXt2YXIgcj1bcl0sbz10W2VdO1xuVnUuYXBwbHkocixvLmFyZ3MpLHI9by5mdW5jLmFwcGx5KG8udGhpc0FyZyxyKX1yZXR1cm4gcn1mdW5jdGlvbiBTcihuLHQscil7dmFyIGU9MCx1PW4/bi5sZW5ndGg6ZTtpZih0eXBlb2YgdD09XCJudW1iZXJcIiYmdD09PXQmJnU8PV9vKXtmb3IoO2U8dTspe3ZhciBvPWUrdT4+PjEsaT1uW29dOyhyP2k8PXQ6aTx0KT9lPW8rMTp1PW99cmV0dXJuIHV9cmV0dXJuIFdyKG4sdCx2dSxyKX1mdW5jdGlvbiBXcihuLHQscixlKXt0PXIodCk7Zm9yKHZhciB1PTAsbz1uP24ubGVuZ3RoOjAsaT10IT09dCxmPXR5cGVvZiB0PT1cInVuZGVmaW5lZFwiO3U8bzspe3ZhciBhPVB1KCh1K28pLzIpLGM9cihuW2FdKSxsPWM9PT1jOyhpP2x8fGU6Zj9sJiYoZXx8dHlwZW9mIGMhPVwidW5kZWZpbmVkXCIpOmU/Yzw9dDpjPHQpP3U9YSsxOm89YX1yZXR1cm4gb28obyxobyl9ZnVuY3Rpb24gTnIobix0LHIpe2lmKHR5cGVvZiBuIT1cImZ1bmN0aW9uXCIpcmV0dXJuIHZ1O2lmKHR5cGVvZiB0PT1cInVuZGVmaW5lZFwiKXJldHVybiBuO1xuc3dpdGNoKHIpe2Nhc2UgMTpyZXR1cm4gZnVuY3Rpb24ocil7cmV0dXJuIG4uY2FsbCh0LHIpfTtjYXNlIDM6cmV0dXJuIGZ1bmN0aW9uKHIsZSx1KXtyZXR1cm4gbi5jYWxsKHQscixlLHUpfTtjYXNlIDQ6cmV0dXJuIGZ1bmN0aW9uKHIsZSx1LG8pe3JldHVybiBuLmNhbGwodCxyLGUsdSxvKX07Y2FzZSA1OnJldHVybiBmdW5jdGlvbihyLGUsdSxvLGkpe3JldHVybiBuLmNhbGwodCxyLGUsdSxvLGkpfX1yZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gbi5hcHBseSh0LGFyZ3VtZW50cyl9fWZ1bmN0aW9uIFVyKG4pe3JldHVybiBEdS5jYWxsKG4sMCl9ZnVuY3Rpb24gRnIobix0LHIpe2Zvcih2YXIgZT1yLmxlbmd0aCx1PS0xLG89dW8obi5sZW5ndGgtZSwwKSxpPS0xLGY9dC5sZW5ndGgsYT13dShvK2YpOysraTxmOylhW2ldPXRbaV07Zm9yKDsrK3U8ZTspYVtyW3VdXT1uW3VdO2Zvcig7by0tOylhW2krK109blt1KytdO3JldHVybiBhfWZ1bmN0aW9uIExyKG4sdCxyKXtmb3IodmFyIGU9LTEsdT1yLmxlbmd0aCxvPS0xLGk9dW8obi5sZW5ndGgtdSwwKSxmPS0xLGE9dC5sZW5ndGgsYz13dShpK2EpOysrbzxpOyljW29dPW5bb107XG5mb3IoaT1vOysrZjxhOyljW2krZl09dFtmXTtmb3IoOysrZTx1OyljW2krcltlXV09bltvKytdO3JldHVybiBjfWZ1bmN0aW9uICRyKG4sdCl7cmV0dXJuIGZ1bmN0aW9uKHIsZSx1KXt2YXIgbz10P3QoKTp7fTtpZihlPUhyKGUsdSwzKSxTbyhyKSl7dT0tMTtmb3IodmFyIGk9ci5sZW5ndGg7Kyt1PGk7KXt2YXIgZj1yW3VdO24obyxmLGUoZix1LHIpLHIpfX1lbHNlIG9yKHIsZnVuY3Rpb24odCxyLHUpe24obyx0LGUodCxyLHUpLHUpfSk7cmV0dXJuIG99fWZ1bmN0aW9uIEJyKG4pe3JldHVybiBmdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cy5sZW5ndGgscj1hcmd1bWVudHNbMF07aWYoMj50fHxudWxsPT1yKXJldHVybiByO2lmKDM8dCYmdWUoYXJndW1lbnRzWzFdLGFyZ3VtZW50c1syXSxhcmd1bWVudHNbM10pJiYodD0yKSwzPHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGFyZ3VtZW50c1t0LTJdKXZhciBlPU5yKGFyZ3VtZW50c1stLXQtMV0sYXJndW1lbnRzW3QtLV0sNSk7ZWxzZSAyPHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGFyZ3VtZW50c1t0LTFdJiYoZT1hcmd1bWVudHNbLS10XSk7XG5mb3IodmFyIHU9MDsrK3U8dDspe3ZhciBvPWFyZ3VtZW50c1t1XTtvJiZuKHIsbyxlKX1yZXR1cm4gcn19ZnVuY3Rpb24genIobix0KXtmdW5jdGlvbiByKCl7cmV0dXJuKHRoaXMgaW5zdGFuY2VvZiByP2U6bikuYXBwbHkodCxhcmd1bWVudHMpfXZhciBlPU1yKG4pO3JldHVybiByfWZ1bmN0aW9uIERyKG4pe3JldHVybiBmdW5jdGlvbih0KXt2YXIgcj0tMTt0PXB1KGZ1KHQpKTtmb3IodmFyIGU9dC5sZW5ndGgsdT1cIlwiOysrcjxlOyl1PW4odSx0W3JdLHIpO3JldHVybiB1fX1mdW5jdGlvbiBNcihuKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgdD13byhuLnByb3RvdHlwZSkscj1uLmFwcGx5KHQsYXJndW1lbnRzKTtyZXR1cm4gWGUocik/cjp0fX1mdW5jdGlvbiBxcihuLHQpe3JldHVybiBmdW5jdGlvbihyLGUsbyl7byYmdWUocixlLG8pJiYoZT1udWxsKTt2YXIgaT1IcigpLGY9bnVsbD09ZTtpZihpPT09dHImJmZ8fChmPWZhbHNlLGU9aShlLG8sMykpLGYpe2lmKGU9U28ociksZXx8IXR1KHIpKXJldHVybiBuKGU/cjpzZShyKSk7XG5lPXV9cmV0dXJuIFhyKHIsZSx0KX19ZnVuY3Rpb24gUHIobix0LHIsZSx1LG8saSxmLGEsYyl7ZnVuY3Rpb24gbCgpe2Zvcih2YXIgYj1hcmd1bWVudHMubGVuZ3RoLGo9YixrPXd1KGIpO2otLTspa1tqXT1hcmd1bWVudHNbal07aWYoZSYmKGs9RnIoayxlLHUpKSxvJiYoaz1McihrLG8saSkpLF98fHkpe3ZhciBqPWwucGxhY2Vob2xkZXIsRT1nKGssaiksYj1iLUUubGVuZ3RoO2lmKGI8Yyl7dmFyIE89Zj96dChmKTpudWxsLGI9dW8oYy1iLDApLEM9Xz9FOm51bGwsRT1fP251bGw6RSxUPV8/azpudWxsLGs9Xz9udWxsOms7cmV0dXJuIHR8PV8/UjpJLHQmPX4oXz9JOlIpLHZ8fCh0Jj1+KHh8QSkpLGs9UHIobix0LHIsVCxDLGssRSxPLGEsYiksay5wbGFjZWhvbGRlcj1qLGt9fWlmKGo9cD9yOnRoaXMsaCYmKG49alttXSksZilmb3IoTz1rLmxlbmd0aCxiPW9vKGYubGVuZ3RoLE8pLEM9enQoayk7Yi0tOylFPWZbYl0sa1tiXT1lZShFLE8pP0NbRV06dztyZXR1cm4gcyYmYTxrLmxlbmd0aCYmKGsubGVuZ3RoPWEpLCh0aGlzIGluc3RhbmNlb2YgbD9kfHxNcihuKTpuKS5hcHBseShqLGspXG59dmFyIHM9dCZDLHA9dCZ4LGg9dCZBLF89dCZrLHY9dCZqLHk9dCZFLGQ9IWgmJk1yKG4pLG09bjtyZXR1cm4gbH1mdW5jdGlvbiBLcihuLHQscil7cmV0dXJuIG49bi5sZW5ndGgsdD0rdCxuPHQmJnJvKHQpPyh0LT1uLHI9bnVsbD09cj9cIiBcIjpyK1wiXCIsbHUocixNdSh0L3IubGVuZ3RoKSkuc2xpY2UoMCx0KSk6XCJcIn1mdW5jdGlvbiBWcihuLHQscixlKXtmdW5jdGlvbiB1KCl7Zm9yKHZhciB0PS0xLGY9YXJndW1lbnRzLmxlbmd0aCxhPS0xLGM9ZS5sZW5ndGgsbD13dShmK2MpOysrYTxjOylsW2FdPWVbYV07Zm9yKDtmLS07KWxbYSsrXT1hcmd1bWVudHNbKyt0XTtyZXR1cm4odGhpcyBpbnN0YW5jZW9mIHU/aTpuKS5hcHBseShvP3I6dGhpcyxsKX12YXIgbz10JngsaT1NcihuKTtyZXR1cm4gdX1mdW5jdGlvbiBZcihuLHQscixlLHUsbyxpLGYpe3ZhciBhPXQmQTtpZighYSYmdHlwZW9mIG4hPVwiZnVuY3Rpb25cIil0aHJvdyBuZXcgT3UoJCk7dmFyIGM9ZT9lLmxlbmd0aDowO2lmKGN8fCh0Jj1+KFJ8SSksZT11PW51bGwpLGMtPXU/dS5sZW5ndGg6MCx0Jkkpe3ZhciBsPWUscz11O1xuZT11PW51bGx9dmFyIHA9IWEmJkFvKG4pO2lmKHI9W24sdCxyLGUsdSxsLHMsbyxpLGZdLHAmJnRydWUhPT1wKXtlPXJbMV0sdD1wWzFdLGY9ZXx0LG89Q3xPLHU9eHxBLGk9b3x1fGp8RTt2YXIgbD1lJkMmJiEodCZDKSxzPWUmTyYmISh0Jk8pLGg9KHM/cjpwKVs3XSxfPShsP3I6cClbOF07bz1mPj1vJiZmPD1pJiYoZTxPfHwoc3x8bCkmJmgubGVuZ3RoPD1fKSwoIShlPj1PJiZ0PnV8fGU+dSYmdD49Tyl8fG8pJiYodCZ4JiYoclsyXT1wWzJdLGZ8PWUmeD8wOmopLChlPXBbM10pJiYodT1yWzNdLHJbM109dT9Gcih1LGUscFs0XSk6enQoZSkscls0XT11P2coclszXSxCKTp6dChwWzRdKSksKGU9cFs1XSkmJih1PXJbNV0scls1XT11P0xyKHUsZSxwWzZdKTp6dChlKSxyWzZdPXU/ZyhyWzVdLEIpOnp0KHBbNl0pKSwoZT1wWzddKSYmKHJbN109enQoZSkpLHQmQyYmKHJbOF09bnVsbD09cls4XT9wWzhdOm9vKHJbOF0scFs4XSkpLG51bGw9PXJbOV0mJihyWzldPXBbOV0pLHJbMF09cFswXSxyWzFdPWYpLHQ9clsxXSxmPXJbOV1cbn1yZXR1cm4gcls5XT1udWxsPT1mP2E/MDpuLmxlbmd0aDp1byhmLWMsMCl8fDAsKHA/Ym86am8pKHQ9PXg/enIoclswXSxyWzJdKTp0IT1SJiZ0IT0oeHxSKXx8cls0XS5sZW5ndGg/UHIuYXBwbHkodyxyKTpWci5hcHBseSh3LHIpLHIpfWZ1bmN0aW9uIFpyKG4sdCxyLGUsdSxvLGkpe3ZhciBmPS0xLGE9bi5sZW5ndGgsYz10Lmxlbmd0aCxsPXRydWU7aWYoYSE9YyYmKCF1fHxjPD1hKSlyZXR1cm4gZmFsc2U7Zm9yKDtsJiYrK2Y8YTspe3ZhciBzPW5bZl0scD10W2ZdLGw9dztpZihlJiYobD11P2UocCxzLGYpOmUocyxwLGYpKSx0eXBlb2YgbD09XCJ1bmRlZmluZWRcIilpZih1KWZvcih2YXIgaD1jO2gtLSYmKHA9dFtoXSwhKGw9cyYmcz09PXB8fHIocyxwLGUsdSxvLGkpKSk7KTtlbHNlIGw9cyYmcz09PXB8fHIocyxwLGUsdSxvLGkpfXJldHVybiEhbH1mdW5jdGlvbiBHcihuLHQscil7c3dpdGNoKHIpe2Nhc2UgTTpjYXNlIHE6cmV0dXJuK249PSt0O2Nhc2UgUDpyZXR1cm4gbi5uYW1lPT10Lm5hbWUmJm4ubWVzc2FnZT09dC5tZXNzYWdlO1xuY2FzZSBWOnJldHVybiBuIT0rbj90IT0rdDowPT1uPzEvbj09MS90Om49PSt0O2Nhc2UgWjpjYXNlIEc6cmV0dXJuIG49PXQrXCJcIn1yZXR1cm4gZmFsc2V9ZnVuY3Rpb24gSnIobix0LHIsZSx1LG8saSl7dmFyIGY9Rm8obiksYT1mLmxlbmd0aCxjPUZvKHQpLmxlbmd0aDtpZihhIT1jJiYhdSlyZXR1cm4gZmFsc2U7Zm9yKHZhciBsLGM9LTE7KytjPGE7KXt2YXIgcz1mW2NdLHA9VXUuY2FsbCh0LHMpO2lmKHApe3ZhciBoPW5bc10sXz10W3NdLHA9dztlJiYocD11P2UoXyxoLHMpOmUoaCxfLHMpKSx0eXBlb2YgcD09XCJ1bmRlZmluZWRcIiYmKHA9aCYmaD09PV98fHIoaCxfLGUsdSxvLGkpKX1pZighcClyZXR1cm4gZmFsc2U7bHx8KGw9XCJjb25zdHJ1Y3RvclwiPT1zKX1yZXR1cm4gbHx8KHI9bi5jb25zdHJ1Y3RvcixlPXQuY29uc3RydWN0b3IsIShyIT1lJiZcImNvbnN0cnVjdG9yXCJpbiBuJiZcImNvbnN0cnVjdG9yXCJpbiB0KXx8dHlwZW9mIHI9PVwiZnVuY3Rpb25cIiYmciBpbnN0YW5jZW9mIHImJnR5cGVvZiBlPT1cImZ1bmN0aW9uXCImJmUgaW5zdGFuY2VvZiBlKT90cnVlOmZhbHNlXG59ZnVuY3Rpb24gWHIobix0LHIpe3ZhciBlPXI/c286bG8sdT1lLG89dTtyZXR1cm4gb3IobixmdW5jdGlvbihuLGksZil7aT10KG4saSxmKSwoKHI/aTx1Omk+dSl8fGk9PT1lJiZpPT09bykmJih1PWksbz1uKX0pLG99ZnVuY3Rpb24gSHIobix0LHIpe3ZhciBlPVd0LmNhbGxiYWNrfHxfdSxlPWU9PT1fdT90cjplO3JldHVybiByP2Uobix0LHIpOmV9ZnVuY3Rpb24gUXIobixyLGUpe3ZhciB1PVd0LmluZGV4T2Z8fGRlLHU9dT09PWRlP3Q6dTtyZXR1cm4gbj91KG4scixlKTp1fWZ1bmN0aW9uIG5lKG4pe3ZhciB0PW4ubGVuZ3RoLHI9bmV3IG4uY29uc3RydWN0b3IodCk7cmV0dXJuIHQmJlwic3RyaW5nXCI9PXR5cGVvZiBuWzBdJiZVdS5jYWxsKG4sXCJpbmRleFwiKSYmKHIuaW5kZXg9bi5pbmRleCxyLmlucHV0PW4uaW5wdXQpLHJ9ZnVuY3Rpb24gdGUobil7cmV0dXJuIG49bi5jb25zdHJ1Y3Rvcix0eXBlb2Ygbj09XCJmdW5jdGlvblwiJiZuIGluc3RhbmNlb2Ygbnx8KG49RXUpLG5ldyBuXG59ZnVuY3Rpb24gcmUobix0LHIpe3ZhciBlPW4uY29uc3RydWN0b3I7c3dpdGNoKHQpe2Nhc2UgSjpyZXR1cm4gVXIobik7Y2FzZSBNOmNhc2UgcTpyZXR1cm4gbmV3IGUoK24pO2Nhc2UgWDpjYXNlIEg6Y2FzZSBROmNhc2UgbnQ6Y2FzZSB0dDpjYXNlIHJ0OmNhc2UgZXQ6Y2FzZSB1dDpjYXNlIG90OnJldHVybiB0PW4uYnVmZmVyLG5ldyBlKHI/VXIodCk6dCxuLmJ5dGVPZmZzZXQsbi5sZW5ndGgpO2Nhc2UgVjpjYXNlIEc6cmV0dXJuIG5ldyBlKG4pO2Nhc2UgWjp2YXIgdT1uZXcgZShuLnNvdXJjZSx5dC5leGVjKG4pKTt1Lmxhc3RJbmRleD1uLmxhc3RJbmRleH1yZXR1cm4gdX1mdW5jdGlvbiBlZShuLHQpe3JldHVybiBuPStuLHQ9bnVsbD09dD92bzp0LC0xPG4mJjA9PW4lMSYmbjx0fWZ1bmN0aW9uIHVlKG4sdCxyKXtpZighWGUocikpcmV0dXJuIGZhbHNlO3ZhciBlPXR5cGVvZiB0O3JldHVyblwibnVtYmVyXCI9PWU/KGU9ci5sZW5ndGgsZT1vZShlKSYmZWUodCxlKSk6ZT1cInN0cmluZ1wiPT1lJiZ0IGluIHIsZSYmclt0XT09PW5cbn1mdW5jdGlvbiBvZShuKXtyZXR1cm4gdHlwZW9mIG49PVwibnVtYmVyXCImJi0xPG4mJjA9PW4lMSYmbjw9dm99ZnVuY3Rpb24gaWUobil7cmV0dXJuIG49PT1uJiYoMD09PW4/MDwxL246IVhlKG4pKX1mdW5jdGlvbiBmZShuLHQpe249cGUobik7Zm9yKHZhciByPS0xLGU9dC5sZW5ndGgsdT17fTsrK3I8ZTspe3ZhciBvPXRbcl07byBpbiBuJiYodVtvXT1uW29dKX1yZXR1cm4gdX1mdW5jdGlvbiBhZShuLHQpe3ZhciByPXt9O3JldHVybiBocihuLGZ1bmN0aW9uKG4sZSx1KXt0KG4sZSx1KSYmKHJbZV09bil9KSxyfWZ1bmN0aW9uIGNlKG4pe3ZhciB0O2lmKCFoKG4pfHxMdS5jYWxsKG4pIT1ZfHwhKFV1LmNhbGwobixcImNvbnN0cnVjdG9yXCIpfHwodD1uLmNvbnN0cnVjdG9yLHR5cGVvZiB0IT1cImZ1bmN0aW9uXCJ8fHQgaW5zdGFuY2VvZiB0KSkpcmV0dXJuIGZhbHNlO3ZhciByO3JldHVybiBocihuLGZ1bmN0aW9uKG4sdCl7cj10fSksdHlwZW9mIHI9PVwidW5kZWZpbmVkXCJ8fFV1LmNhbGwobixyKVxufWZ1bmN0aW9uIGxlKG4pe2Zvcih2YXIgdD1vdShuKSxyPXQubGVuZ3RoLGU9ciYmbi5sZW5ndGgsdT1XdC5zdXBwb3J0LHU9ZSYmb2UoZSkmJihTbyhuKXx8dS5ub25FbnVtQXJncyYmWWUobikpLG89LTEsaT1bXTsrK288cjspe3ZhciBmPXRbb107KHUmJmVlKGYsZSl8fFV1LmNhbGwobixmKSkmJmkucHVzaChmKX1yZXR1cm4gaX1mdW5jdGlvbiBzZShuKXtyZXR1cm4gbnVsbD09bj9bXTpvZShuLmxlbmd0aCk/WGUobik/bjpFdShuKTppdShuKX1mdW5jdGlvbiBwZShuKXtyZXR1cm4gWGUobik/bjpFdShuKX1mdW5jdGlvbiBoZShuKXtyZXR1cm4gbiBpbnN0YW5jZW9mIFV0P24uY2xvbmUoKTpuZXcgTnQobi5fX3dyYXBwZWRfXyxuLl9fY2hhaW5fXyx6dChuLl9fYWN0aW9uc19fKSl9ZnVuY3Rpb24gX2Uobix0LHIpe3JldHVybiBuJiZuLmxlbmd0aD8oKHI/dWUobix0LHIpOm51bGw9PXQpJiYodD0xKSxScihuLDA+dD8wOnQpKTpbXX1mdW5jdGlvbiBnZShuLHQscil7dmFyIGU9bj9uLmxlbmd0aDowO1xucmV0dXJuIGU/KChyP3VlKG4sdCxyKTpudWxsPT10KSYmKHQ9MSksdD1lLSgrdHx8MCksUnIobiwwLDA+dD8wOnQpKTpbXX1mdW5jdGlvbiB2ZShuLHQscil7dmFyIGU9LTEsdT1uP24ubGVuZ3RoOjA7Zm9yKHQ9SHIodCxyLDMpOysrZTx1OylpZih0KG5bZV0sZSxuKSlyZXR1cm4gZTtyZXR1cm4tMX1mdW5jdGlvbiB5ZShuKXtyZXR1cm4gbj9uWzBdOnd9ZnVuY3Rpb24gZGUobixyLGUpe3ZhciB1PW4/bi5sZW5ndGg6MDtpZighdSlyZXR1cm4tMTtpZih0eXBlb2YgZT09XCJudW1iZXJcIillPTA+ZT91byh1K2UsMCk6ZXx8MDtlbHNlIGlmKGUpcmV0dXJuIGU9U3IobixyKSxuPW5bZV0sKHI9PT1yP3I9PT1uOm4hPT1uKT9lOi0xO3JldHVybiB0KG4scixlKX1mdW5jdGlvbiBtZShuKXtyZXR1cm4gX2UobiwxKX1mdW5jdGlvbiB3ZShuLHIsZSx1KXtpZighbnx8IW4ubGVuZ3RoKXJldHVybltdO3R5cGVvZiByIT1cImJvb2xlYW5cIiYmbnVsbCE9ciYmKHU9ZSxlPXVlKG4scix1KT9udWxsOnIscj1mYWxzZSk7XG52YXIgbz1IcigpO2lmKChvIT09dHJ8fG51bGwhPWUpJiYoZT1vKGUsdSwzKSksciYmUXIoKT09dCl7cj1lO3ZhciBpO2U9LTEsdT1uLmxlbmd0aDtmb3IodmFyIG89LTEsZj1bXTsrK2U8dTspe3ZhciBhPW5bZV0sYz1yP3IoYSxlLG4pOmE7ZSYmaT09PWN8fChpPWMsZlsrK29dPWEpfW49Zn1lbHNlIG49T3IobixlKTtyZXR1cm4gbn1mdW5jdGlvbiBiZShuKXtmb3IodmFyIHQ9LTEscj0obiYmbi5sZW5ndGgmJlZ0KEt0KG4sTnUpKSk+Pj4wLGU9d3Uocik7Kyt0PHI7KWVbdF09S3Qobixqcih0KSk7cmV0dXJuIGV9ZnVuY3Rpb24geGUobix0KXt2YXIgcj0tMSxlPW4/bi5sZW5ndGg6MCx1PXt9O2ZvcighZXx8dHx8U28oblswXSl8fCh0PVtdKTsrK3I8ZTspe3ZhciBvPW5bcl07dD91W29dPXRbcl06byYmKHVbb1swXV09b1sxXSl9cmV0dXJuIHV9ZnVuY3Rpb24gQWUobil7cmV0dXJuIG49V3Qobiksbi5fX2NoYWluX189dHJ1ZSxufWZ1bmN0aW9uIGplKG4sdCxyKXtyZXR1cm4gdC5jYWxsKHIsbilcbn1mdW5jdGlvbiBrZShuLHQscil7dmFyIGU9bj9uLmxlbmd0aDowO3JldHVybiBvZShlKXx8KG49aXUobiksZT1uLmxlbmd0aCksZT8ocj10eXBlb2Ygcj09XCJudW1iZXJcIj8wPnI/dW8oZStyLDApOnJ8fDA6MCx0eXBlb2Ygbj09XCJzdHJpbmdcInx8IVNvKG4pJiZ0dShuKT9yPGUmJi0xPG4uaW5kZXhPZih0LHIpOi0xPFFyKG4sdCxyKSk6ZmFsc2V9ZnVuY3Rpb24gRWUobix0LHIpe3ZhciBlPVNvKG4pP3F0OmZyO3JldHVybih0eXBlb2YgdCE9XCJmdW5jdGlvblwifHx0eXBlb2YgciE9XCJ1bmRlZmluZWRcIikmJih0PUhyKHQsciwzKSksZShuLHQpfWZ1bmN0aW9uIFJlKG4sdCxyKXt2YXIgZT1TbyhuKT9QdDphcjtyZXR1cm4gdD1Icih0LHIsMyksZShuLHQpfWZ1bmN0aW9uIEllKG4sdCxyKXtyZXR1cm4gU28obik/KHQ9dmUobix0LHIpLC0xPHQ/blt0XTp3KToodD1Icih0LHIsMyksY3Iobix0LG9yKSl9ZnVuY3Rpb24gT2Uobix0LHIpe3JldHVybiB0eXBlb2YgdD09XCJmdW5jdGlvblwiJiZ0eXBlb2Ygcj09XCJ1bmRlZmluZWRcIiYmU28obik/TXQobix0KTpvcihuLE5yKHQsciwzKSlcbn1mdW5jdGlvbiBDZShuLHQscil7aWYodHlwZW9mIHQ9PVwiZnVuY3Rpb25cIiYmdHlwZW9mIHI9PVwidW5kZWZpbmVkXCImJlNvKG4pKWZvcihyPW4ubGVuZ3RoO3ItLSYmZmFsc2UhPT10KG5bcl0scixuKTspO2Vsc2Ugbj1pcihuLE5yKHQsciwzKSk7cmV0dXJuIG59ZnVuY3Rpb24gVGUobix0LHIpe3ZhciBlPVNvKG4pP0t0OndyO3JldHVybiB0PUhyKHQsciwzKSxlKG4sdCl9ZnVuY3Rpb24gU2Uobix0LHIsZSl7cmV0dXJuKFNvKG4pP1l0OkVyKShuLEhyKHQsZSw0KSxyLDM+YXJndW1lbnRzLmxlbmd0aCxvcil9ZnVuY3Rpb24gV2Uobix0LHIsZSl7cmV0dXJuKFNvKG4pP1p0OkVyKShuLEhyKHQsZSw0KSxyLDM+YXJndW1lbnRzLmxlbmd0aCxpcil9ZnVuY3Rpb24gTmUobix0LHIpe3JldHVybihyP3VlKG4sdCxyKTpudWxsPT10KT8obj1zZShuKSx0PW4ubGVuZ3RoLDA8dD9uW2tyKDAsdC0xKV06dyk6KG49VWUobiksbi5sZW5ndGg9b28oMD50PzA6K3R8fDAsbi5sZW5ndGgpLG4pfWZ1bmN0aW9uIFVlKG4pe249c2Uobik7XG5mb3IodmFyIHQ9LTEscj1uLmxlbmd0aCxlPXd1KHIpOysrdDxyOyl7dmFyIHU9a3IoMCx0KTt0IT11JiYoZVt0XT1lW3VdKSxlW3VdPW5bdF19cmV0dXJuIGV9ZnVuY3Rpb24gRmUobix0LHIpe3ZhciBlPVNvKG4pP0d0OklyO3JldHVybih0eXBlb2YgdCE9XCJmdW5jdGlvblwifHx0eXBlb2YgciE9XCJ1bmRlZmluZWRcIikmJih0PUhyKHQsciwzKSksZShuLHQpfWZ1bmN0aW9uIExlKG4sdCl7dmFyIHI7aWYodHlwZW9mIHQhPVwiZnVuY3Rpb25cIil7aWYodHlwZW9mIG4hPVwiZnVuY3Rpb25cIil0aHJvdyBuZXcgT3UoJCk7dmFyIGU9bjtuPXQsdD1lfXJldHVybiBmdW5jdGlvbigpe3JldHVybiAwPC0tbj9yPXQuYXBwbHkodGhpcyxhcmd1bWVudHMpOnQ9bnVsbCxyfX1mdW5jdGlvbiAkZShuLHQpe3ZhciByPXg7aWYoMjxhcmd1bWVudHMubGVuZ3RoKXZhciBlPVJyKGFyZ3VtZW50cywyKSx1PWcoZSwkZS5wbGFjZWhvbGRlcikscj1yfFI7cmV0dXJuIFlyKG4scix0LGUsdSl9ZnVuY3Rpb24gQmUobix0KXt2YXIgcj14fEE7XG5pZigyPGFyZ3VtZW50cy5sZW5ndGgpdmFyIGU9UnIoYXJndW1lbnRzLDIpLHU9ZyhlLEJlLnBsYWNlaG9sZGVyKSxyPXJ8UjtyZXR1cm4gWXIodCxyLG4sZSx1KX1mdW5jdGlvbiB6ZShuLHQscil7cmV0dXJuIHImJnVlKG4sdCxyKSYmKHQ9bnVsbCksbj1ZcihuLGssbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLHQpLG4ucGxhY2Vob2xkZXI9emUucGxhY2Vob2xkZXIsbn1mdW5jdGlvbiBEZShuLHQscil7cmV0dXJuIHImJnVlKG4sdCxyKSYmKHQ9bnVsbCksbj1ZcihuLEUsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLHQpLG4ucGxhY2Vob2xkZXI9RGUucGxhY2Vob2xkZXIsbn1mdW5jdGlvbiBNZShuLHQscil7ZnVuY3Rpb24gZSgpe3ZhciByPXQtKFRvKCktYyk7MD49cnx8cj50PyhmJiZxdShmKSxyPXAsZj1zPXA9dyxyJiYoaD1UbygpLGE9bi5hcHBseShsLGkpLHN8fGZ8fChpPWw9bnVsbCkpKTpzPUd1KGUscil9ZnVuY3Rpb24gdSgpe3MmJnF1KHMpLGY9cz1wPXcsKGd8fF8hPT10KSYmKGg9VG8oKSxhPW4uYXBwbHkobCxpKSxzfHxmfHwoaT1sPW51bGwpKVxufWZ1bmN0aW9uIG8oKXtpZihpPWFyZ3VtZW50cyxjPVRvKCksbD10aGlzLHA9ZyYmKHN8fCF2KSxmYWxzZT09PV8pdmFyIHI9diYmIXM7ZWxzZXtmfHx2fHwoaD1jKTt2YXIgbz1fLShjLWgpLHk9MD49b3x8bz5fO3k/KGYmJihmPXF1KGYpKSxoPWMsYT1uLmFwcGx5KGwsaSkpOmZ8fChmPUd1KHUsbykpfXJldHVybiB5JiZzP3M9cXUocyk6c3x8dD09PV98fChzPUd1KGUsdCkpLHImJih5PXRydWUsYT1uLmFwcGx5KGwsaSkpLCF5fHxzfHxmfHwoaT1sPW51bGwpLGF9dmFyIGksZixhLGMsbCxzLHAsaD0wLF89ZmFsc2UsZz10cnVlO2lmKHR5cGVvZiBuIT1cImZ1bmN0aW9uXCIpdGhyb3cgbmV3IE91KCQpO2lmKHQ9MD50PzA6dCx0cnVlPT09cil2YXIgdj10cnVlLGc9ZmFsc2U7ZWxzZSBYZShyKSYmKHY9ci5sZWFkaW5nLF89XCJtYXhXYWl0XCJpbiByJiZ1bygrci5tYXhXYWl0fHwwLHQpLGc9XCJ0cmFpbGluZ1wiaW4gcj9yLnRyYWlsaW5nOmcpO3JldHVybiBvLmNhbmNlbD1mdW5jdGlvbigpe3MmJnF1KHMpLGYmJnF1KGYpLGY9cz1wPXdcbn0sb31mdW5jdGlvbiBxZSgpe3ZhciBuPWFyZ3VtZW50cyx0PW4ubGVuZ3RoLTE7aWYoMD50KXJldHVybiBmdW5jdGlvbihuKXtyZXR1cm4gbn07aWYoIXF0KG4sSmUpKXRocm93IG5ldyBPdSgkKTtyZXR1cm4gZnVuY3Rpb24oKXtmb3IodmFyIHI9dCxlPW5bcl0uYXBwbHkodGhpcyxhcmd1bWVudHMpO3ItLTspZT1uW3JdLmNhbGwodGhpcyxlKTtyZXR1cm4gZX19ZnVuY3Rpb24gUGUobix0KXtmdW5jdGlvbiByKCl7dmFyIGU9ci5jYWNoZSx1PXQ/dC5hcHBseSh0aGlzLGFyZ3VtZW50cyk6YXJndW1lbnRzWzBdO2lmKGUuaGFzKHUpKXJldHVybiBlLmdldCh1KTt2YXIgbz1uLmFwcGx5KHRoaXMsYXJndW1lbnRzKTtyZXR1cm4gZS5zZXQodSxvKSxvfWlmKHR5cGVvZiBuIT1cImZ1bmN0aW9uXCJ8fHQmJnR5cGVvZiB0IT1cImZ1bmN0aW9uXCIpdGhyb3cgbmV3IE91KCQpO3JldHVybiByLmNhY2hlPW5ldyBQZS5DYWNoZSxyfWZ1bmN0aW9uIEtlKG4pe3ZhciB0PVJyKGFyZ3VtZW50cywxKSxyPWcodCxLZS5wbGFjZWhvbGRlcik7XG5yZXR1cm4gWXIobixSLG51bGwsdCxyKX1mdW5jdGlvbiBWZShuKXt2YXIgdD1Scihhcmd1bWVudHMsMSkscj1nKHQsVmUucGxhY2Vob2xkZXIpO3JldHVybiBZcihuLEksbnVsbCx0LHIpfWZ1bmN0aW9uIFllKG4pe3JldHVybiBvZShoKG4pP24ubGVuZ3RoOncpJiZMdS5jYWxsKG4pPT16fHxmYWxzZX1mdW5jdGlvbiBaZShuKXtyZXR1cm4gbiYmMT09PW4ubm9kZVR5cGUmJmgobikmJi0xPEx1LmNhbGwobikuaW5kZXhPZihcIkVsZW1lbnRcIil8fGZhbHNlfWZ1bmN0aW9uIEdlKG4pe3JldHVybiBoKG4pJiZ0eXBlb2Ygbi5tZXNzYWdlPT1cInN0cmluZ1wiJiZMdS5jYWxsKG4pPT1QfHxmYWxzZX1mdW5jdGlvbiBKZShuKXtyZXR1cm4gdHlwZW9mIG49PVwiZnVuY3Rpb25cInx8ZmFsc2V9ZnVuY3Rpb24gWGUobil7dmFyIHQ9dHlwZW9mIG47cmV0dXJuXCJmdW5jdGlvblwiPT10fHxuJiZcIm9iamVjdFwiPT10fHxmYWxzZX1mdW5jdGlvbiBIZShuKXtyZXR1cm4gbnVsbD09bj9mYWxzZTpMdS5jYWxsKG4pPT1LP0J1LnRlc3QoV3UuY2FsbChuKSk6aChuKSYmd3QudGVzdChuKXx8ZmFsc2Vcbn1mdW5jdGlvbiBRZShuKXtyZXR1cm4gdHlwZW9mIG49PVwibnVtYmVyXCJ8fGgobikmJkx1LmNhbGwobik9PVZ8fGZhbHNlfWZ1bmN0aW9uIG51KG4pe3JldHVybiBoKG4pJiZMdS5jYWxsKG4pPT1afHxmYWxzZX1mdW5jdGlvbiB0dShuKXtyZXR1cm4gdHlwZW9mIG49PVwic3RyaW5nXCJ8fGgobikmJkx1LmNhbGwobik9PUd8fGZhbHNlfWZ1bmN0aW9uIHJ1KG4pe3JldHVybiBoKG4pJiZvZShuLmxlbmd0aCkmJkN0W0x1LmNhbGwobildfHxmYWxzZX1mdW5jdGlvbiBldShuKXtyZXR1cm4gbnIobixvdShuKSl9ZnVuY3Rpb24gdXUobil7cmV0dXJuIHZyKG4sb3UobikpfWZ1bmN0aW9uIG91KG4pe2lmKG51bGw9PW4pcmV0dXJuW107WGUobil8fChuPUV1KG4pKTtmb3IodmFyIHQ9bi5sZW5ndGgsdD10JiZvZSh0KSYmKFNvKG4pfHxtby5ub25FbnVtQXJncyYmWWUobikpJiZ0fHwwLHI9bi5jb25zdHJ1Y3RvcixlPS0xLHI9dHlwZW9mIHI9PVwiZnVuY3Rpb25cIiYmci5wcm90b3R5cGU9PT1uLHU9d3UodCksbz0wPHQ7KytlPHQ7KXVbZV09ZStcIlwiO1xuZm9yKHZhciBpIGluIG4pbyYmZWUoaSx0KXx8XCJjb25zdHJ1Y3RvclwiPT1pJiYocnx8IVV1LmNhbGwobixpKSl8fHUucHVzaChpKTtyZXR1cm4gdX1mdW5jdGlvbiBpdShuKXtyZXR1cm4gQ3IobixGbyhuKSl9ZnVuY3Rpb24gZnUobil7cmV0dXJuKG49ZShuKSkmJm4ucmVwbGFjZShidCxjKX1mdW5jdGlvbiBhdShuKXtyZXR1cm4obj1lKG4pKSYmanQudGVzdChuKT9uLnJlcGxhY2UoQXQsXCJcXFxcJCZcIik6bn1mdW5jdGlvbiBjdShuLHQscil7cmV0dXJuIHImJnVlKG4sdCxyKSYmKHQ9MCksYW8obix0KX1mdW5jdGlvbiBsdShuLHQpe3ZhciByPVwiXCI7aWYobj1lKG4pLHQ9K3QsMT50fHwhbnx8IXJvKHQpKXJldHVybiByO2RvIHQlMiYmKHIrPW4pLHQ9UHUodC8yKSxuKz1uO3doaWxlKHQpO3JldHVybiByfWZ1bmN0aW9uIHN1KG4sdCxyKXt2YXIgdT1uO3JldHVybihuPWUobikpPyhyP3VlKHUsdCxyKTpudWxsPT10KT9uLnNsaWNlKHYobikseShuKSsxKToodCs9XCJcIixuLnNsaWNlKG8obix0KSxpKG4sdCkrMSkpOm5cbn1mdW5jdGlvbiBwdShuLHQscil7cmV0dXJuIHImJnVlKG4sdCxyKSYmKHQ9bnVsbCksbj1lKG4pLG4ubWF0Y2godHx8UnQpfHxbXX1mdW5jdGlvbiBodShuKXt0cnl7cmV0dXJuIG4uYXBwbHkodyxScihhcmd1bWVudHMsMSkpfWNhdGNoKHQpe3JldHVybiBHZSh0KT90Om5ldyB4dSh0KX19ZnVuY3Rpb24gX3Uobix0LHIpe3JldHVybiByJiZ1ZShuLHQscikmJih0PW51bGwpLGgobik/eXUobik6dHIobix0KX1mdW5jdGlvbiBndShuKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gbn19ZnVuY3Rpb24gdnUobil7cmV0dXJuIG59ZnVuY3Rpb24geXUobil7cmV0dXJuIGJyKHJyKG4sdHJ1ZSkpfWZ1bmN0aW9uIGR1KG4sdCxyKXtpZihudWxsPT1yKXt2YXIgZT1YZSh0KSx1PWUmJkZvKHQpOygodT11JiZ1Lmxlbmd0aCYmdnIodCx1KSk/dS5sZW5ndGg6ZSl8fCh1PWZhbHNlLHI9dCx0PW4sbj10aGlzKX11fHwodT12cih0LEZvKHQpKSk7dmFyIG89dHJ1ZSxlPS0xLGk9SmUobiksZj11Lmxlbmd0aDtcbiExPT09cj9vPWZhbHNlOlhlKHIpJiZcImNoYWluXCJpbiByJiYobz1yLmNoYWluKTtmb3IoOysrZTxmOyl7cj11W2VdO3ZhciBhPXRbcl07bltyXT1hLGkmJihuLnByb3RvdHlwZVtyXT1mdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgcj10aGlzLl9fY2hhaW5fXztpZihvfHxyKXt2YXIgZT1uKHRoaXMuX193cmFwcGVkX18pO3JldHVybihlLl9fYWN0aW9uc19fPXp0KHRoaXMuX19hY3Rpb25zX18pKS5wdXNoKHtmdW5jOnQsYXJnczphcmd1bWVudHMsdGhpc0FyZzpufSksZS5fX2NoYWluX189cixlfXJldHVybiByPVt0aGlzLnZhbHVlKCldLFZ1LmFwcGx5KHIsYXJndW1lbnRzKSx0LmFwcGx5KG4scil9fShhKSl9cmV0dXJuIG59ZnVuY3Rpb24gbXUoKXt9Xz1fP0R0LmRlZmF1bHRzKCR0Lk9iamVjdCgpLF8sRHQucGljaygkdCxPdCkpOiR0O3ZhciB3dT1fLkFycmF5LGJ1PV8uRGF0ZSx4dT1fLkVycm9yLEF1PV8uRnVuY3Rpb24sanU9Xy5NYXRoLGt1PV8uTnVtYmVyLEV1PV8uT2JqZWN0LFJ1PV8uUmVnRXhwLEl1PV8uU3RyaW5nLE91PV8uVHlwZUVycm9yLEN1PXd1LnByb3RvdHlwZSxUdT1FdS5wcm90b3R5cGUsU3U9KFN1PV8ud2luZG93KSYmU3UuZG9jdW1lbnQsV3U9QXUucHJvdG90eXBlLnRvU3RyaW5nLE51PWpyKFwibGVuZ3RoXCIpLFV1PVR1Lmhhc093blByb3BlcnR5LEZ1PTAsTHU9VHUudG9TdHJpbmcsJHU9Xy5fLEJ1PVJ1KFwiXlwiK2F1KEx1KS5yZXBsYWNlKC90b1N0cmluZ3woZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLFwiJDEuKj9cIikrXCIkXCIpLHp1PUhlKHp1PV8uQXJyYXlCdWZmZXIpJiZ6dSxEdT1IZShEdT16dSYmbmV3IHp1KDApLnNsaWNlKSYmRHUsTXU9anUuY2VpbCxxdT1fLmNsZWFyVGltZW91dCxQdT1qdS5mbG9vcixLdT1IZShLdT1FdS5nZXRQcm90b3R5cGVPZikmJkt1LFZ1PUN1LnB1c2gsWXU9VHUucHJvcGVydHlJc0VudW1lcmFibGUsWnU9SGUoWnU9Xy5TZXQpJiZadSxHdT1fLnNldFRpbWVvdXQsSnU9Q3Uuc3BsaWNlLFh1PUhlKFh1PV8uVWludDhBcnJheSkmJlh1LEh1PUhlKEh1PV8uV2Vha01hcCkmJkh1LFF1PWZ1bmN0aW9uKCl7dHJ5e3ZhciBuPUhlKG49Xy5GbG9hdDY0QXJyYXkpJiZuLHQ9bmV3IG4obmV3IHp1KDEwKSwwLDEpJiZuXG59Y2F0Y2gocil7fXJldHVybiB0fSgpLG5vPUhlKG5vPXd1LmlzQXJyYXkpJiZubyx0bz1IZSh0bz1FdS5jcmVhdGUpJiZ0byxybz1fLmlzRmluaXRlLGVvPUhlKGVvPUV1LmtleXMpJiZlbyx1bz1qdS5tYXgsb289anUubWluLGlvPUhlKGlvPWJ1Lm5vdykmJmlvLGZvPUhlKGZvPWt1LmlzRmluaXRlKSYmZm8sYW89Xy5wYXJzZUludCxjbz1qdS5yYW5kb20sbG89a3UuTkVHQVRJVkVfSU5GSU5JVFksc289a3UuUE9TSVRJVkVfSU5GSU5JVFkscG89anUucG93KDIsMzIpLTEsaG89cG8tMSxfbz1wbz4+PjEsZ289UXU/UXUuQllURVNfUEVSX0VMRU1FTlQ6MCx2bz1qdS5wb3coMiw1MyktMSx5bz1IdSYmbmV3IEh1LG1vPVd0LnN1cHBvcnQ9e307IWZ1bmN0aW9uKG4pe21vLmZ1bmNEZWNvbXA9IUhlKF8uV2luUlRFcnJvcikmJmt0LnRlc3QobSksbW8uZnVuY05hbWVzPXR5cGVvZiBBdS5uYW1lPT1cInN0cmluZ1wiO3RyeXttby5kb209MTE9PT1TdS5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkubm9kZVR5cGVcbn1jYXRjaCh0KXttby5kb209ZmFsc2V9dHJ5e21vLm5vbkVudW1BcmdzPSFZdS5jYWxsKGFyZ3VtZW50cywxKX1jYXRjaChyKXttby5ub25FbnVtQXJncz10cnVlfX0oMCwwKSxXdC50ZW1wbGF0ZVNldHRpbmdzPXtlc2NhcGU6aHQsZXZhbHVhdGU6X3QsaW50ZXJwb2xhdGU6Z3QsdmFyaWFibGU6XCJcIixpbXBvcnRzOntfOld0fX07dmFyIHdvPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbigpe31yZXR1cm4gZnVuY3Rpb24odCl7aWYoWGUodCkpe24ucHJvdG90eXBlPXQ7dmFyIHI9bmV3IG47bi5wcm90b3R5cGU9bnVsbH1yZXR1cm4gcnx8Xy5PYmplY3QoKX19KCksYm89eW8/ZnVuY3Rpb24obix0KXtyZXR1cm4geW8uc2V0KG4sdCksbn06dnU7RHV8fChVcj16dSYmWHU/ZnVuY3Rpb24obil7dmFyIHQ9bi5ieXRlTGVuZ3RoLHI9UXU/UHUodC9nbyk6MCxlPXIqZ28sdT1uZXcgenUodCk7aWYocil7dmFyIG89bmV3IFF1KHUsMCxyKTtvLnNldChuZXcgUXUobiwwLHIpKX1yZXR1cm4gdCE9ZSYmKG89bmV3IFh1KHUsZSksby5zZXQobmV3IFh1KG4sZSkpKSx1XG59Omd1KG51bGwpKTt2YXIgeG89dG8mJlp1P2Z1bmN0aW9uKG4pe3JldHVybiBuZXcgTHQobil9Omd1KG51bGwpLEFvPXlvP2Z1bmN0aW9uKG4pe3JldHVybiB5by5nZXQobil9Om11LGpvPWZ1bmN0aW9uKCl7dmFyIG49MCx0PTA7cmV0dXJuIGZ1bmN0aW9uKHIsZSl7dmFyIHU9VG8oKSxvPU4tKHUtdCk7aWYodD11LDA8byl7aWYoKytuPj1XKXJldHVybiByfWVsc2Ugbj0wO3JldHVybiBibyhyLGUpfX0oKSxrbz0kcihmdW5jdGlvbihuLHQscil7VXUuY2FsbChuLHIpPysrbltyXTpuW3JdPTF9KSxFbz0kcihmdW5jdGlvbihuLHQscil7VXUuY2FsbChuLHIpP25bcl0ucHVzaCh0KTpuW3JdPVt0XX0pLFJvPSRyKGZ1bmN0aW9uKG4sdCxyKXtuW3JdPXR9KSxJbz1xcihWdCksT289cXIoZnVuY3Rpb24obil7Zm9yKHZhciB0PS0xLHI9bi5sZW5ndGgsZT1zbzsrK3Q8cjspe3ZhciB1PW5bdF07dTxlJiYoZT11KX1yZXR1cm4gZX0sdHJ1ZSksQ289JHIoZnVuY3Rpb24obix0LHIpe25bcj8wOjFdLnB1c2godClcbn0sZnVuY3Rpb24oKXtyZXR1cm5bW10sW11dfSksVG89aW98fGZ1bmN0aW9uKCl7cmV0dXJuKG5ldyBidSkuZ2V0VGltZSgpfSxTbz1ub3x8ZnVuY3Rpb24obil7cmV0dXJuIGgobikmJm9lKG4ubGVuZ3RoKSYmTHUuY2FsbChuKT09RHx8ZmFsc2V9O21vLmRvbXx8KFplPWZ1bmN0aW9uKG4pe3JldHVybiBuJiYxPT09bi5ub2RlVHlwZSYmaChuKSYmIU5vKG4pfHxmYWxzZX0pO3ZhciBXbz1mb3x8ZnVuY3Rpb24obil7cmV0dXJuIHR5cGVvZiBuPT1cIm51bWJlclwiJiZybyhuKX07KEplKC94Lyl8fFh1JiYhSmUoWHUpKSYmKEplPWZ1bmN0aW9uKG4pe3JldHVybiBMdS5jYWxsKG4pPT1LfSk7dmFyIE5vPUt1P2Z1bmN0aW9uKG4pe2lmKCFufHxMdS5jYWxsKG4pIT1ZKXJldHVybiBmYWxzZTt2YXIgdD1uLnZhbHVlT2Yscj1IZSh0KSYmKHI9S3UodCkpJiZLdShyKTtyZXR1cm4gcj9uPT1yfHxLdShuKT09cjpjZShuKX06Y2UsVW89QnIoSHQpLEZvPWVvP2Z1bmN0aW9uKG4pe2lmKG4pdmFyIHQ9bi5jb25zdHJ1Y3RvcixyPW4ubGVuZ3RoO1xucmV0dXJuIHR5cGVvZiB0PT1cImZ1bmN0aW9uXCImJnQucHJvdG90eXBlPT09bnx8dHlwZW9mIG4hPVwiZnVuY3Rpb25cIiYmciYmb2Uocik/bGUobik6WGUobik/ZW8obik6W119OmxlLExvPUJyKEFyKSwkbz1EcihmdW5jdGlvbihuLHQscil7cmV0dXJuIHQ9dC50b0xvd2VyQ2FzZSgpLG4rKHI/dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSt0LnNsaWNlKDEpOnQpfSksQm89RHIoZnVuY3Rpb24obix0LHIpe3JldHVybiBuKyhyP1wiLVwiOlwiXCIpK3QudG9Mb3dlckNhc2UoKX0pOzghPWFvKEl0K1wiMDhcIikmJihjdT1mdW5jdGlvbihuLHQscil7cmV0dXJuKHI/dWUobix0LHIpOm51bGw9PXQpP3Q9MDp0JiYodD0rdCksbj1zdShuKSxhbyhuLHR8fChtdC50ZXN0KG4pPzE2OjEwKSl9KTt2YXIgem89RHIoZnVuY3Rpb24obix0LHIpe3JldHVybiBuKyhyP1wiX1wiOlwiXCIpK3QudG9Mb3dlckNhc2UoKX0pLERvPURyKGZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4gbisocj9cIiBcIjpcIlwiKSsodC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSt0LnNsaWNlKDEpKVxufSk7cmV0dXJuIE50LnByb3RvdHlwZT13byhXdC5wcm90b3R5cGUpLFV0LnByb3RvdHlwZT13byhOdC5wcm90b3R5cGUpLFV0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1VdCxGdC5wcm90b3R5cGVbXCJkZWxldGVcIl09ZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuaGFzKG4pJiZkZWxldGUgdGhpcy5fX2RhdGFfX1tuXX0sRnQucHJvdG90eXBlLmdldD1mdW5jdGlvbihuKXtyZXR1cm5cIl9fcHJvdG9fX1wiPT1uP3c6dGhpcy5fX2RhdGFfX1tuXX0sRnQucHJvdG90eXBlLmhhcz1mdW5jdGlvbihuKXtyZXR1cm5cIl9fcHJvdG9fX1wiIT1uJiZVdS5jYWxsKHRoaXMuX19kYXRhX18sbil9LEZ0LnByb3RvdHlwZS5zZXQ9ZnVuY3Rpb24obix0KXtyZXR1cm5cIl9fcHJvdG9fX1wiIT1uJiYodGhpcy5fX2RhdGFfX1tuXT10KSx0aGlzfSxMdC5wcm90b3R5cGUucHVzaD1mdW5jdGlvbihuKXt2YXIgdD10aGlzLmRhdGE7dHlwZW9mIG49PVwic3RyaW5nXCJ8fFhlKG4pP3Quc2V0LmFkZChuKTp0Lmhhc2hbbl09dHJ1ZVxufSxQZS5DYWNoZT1GdCxXdC5hZnRlcj1mdW5jdGlvbihuLHQpe2lmKHR5cGVvZiB0IT1cImZ1bmN0aW9uXCIpe2lmKHR5cGVvZiBuIT1cImZ1bmN0aW9uXCIpdGhyb3cgbmV3IE91KCQpO3ZhciByPW47bj10LHQ9cn1yZXR1cm4gbj1ybyhuPStuKT9uOjAsZnVuY3Rpb24oKXtyZXR1cm4gMT4tLW4/dC5hcHBseSh0aGlzLGFyZ3VtZW50cyk6dm9pZCAwfX0sV3QuYXJ5PWZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4gciYmdWUobix0LHIpJiYodD1udWxsKSx0PW4mJm51bGw9PXQ/bi5sZW5ndGg6dW8oK3R8fDAsMCksWXIobixDLG51bGwsbnVsbCxudWxsLG51bGwsdCl9LFd0LmFzc2lnbj1VbyxXdC5hdD1mdW5jdGlvbihuKXtyZXR1cm4gb2Uobj9uLmxlbmd0aDowKSYmKG49c2UobikpLFF0KG4sbHIoYXJndW1lbnRzLGZhbHNlLGZhbHNlLDEpKX0sV3QuYmVmb3JlPUxlLFd0LmJpbmQ9JGUsV3QuYmluZEFsbD1mdW5jdGlvbihuKXtmb3IodmFyIHQ9bixyPTE8YXJndW1lbnRzLmxlbmd0aD9scihhcmd1bWVudHMsZmFsc2UsZmFsc2UsMSk6dXUobiksZT0tMSx1PXIubGVuZ3RoOysrZTx1Oyl7dmFyIG89cltlXTtcbnRbb109WXIodFtvXSx4LHQpfXJldHVybiB0fSxXdC5iaW5kS2V5PUJlLFd0LmNhbGxiYWNrPV91LFd0LmNoYWluPUFlLFd0LmNodW5rPWZ1bmN0aW9uKG4sdCxyKXt0PShyP3VlKG4sdCxyKTpudWxsPT10KT8xOnVvKCt0fHwxLDEpLHI9MDtmb3IodmFyIGU9bj9uLmxlbmd0aDowLHU9LTEsbz13dShNdShlL3QpKTtyPGU7KW9bKyt1XT1ScihuLHIscis9dCk7cmV0dXJuIG99LFd0LmNvbXBhY3Q9ZnVuY3Rpb24obil7Zm9yKHZhciB0PS0xLHI9bj9uLmxlbmd0aDowLGU9LTEsdT1bXTsrK3Q8cjspe3ZhciBvPW5bdF07byYmKHVbKytlXT1vKX1yZXR1cm4gdX0sV3QuY29uc3RhbnQ9Z3UsV3QuY291bnRCeT1rbyxXdC5jcmVhdGU9ZnVuY3Rpb24obix0LHIpe3ZhciBlPXdvKG4pO3JldHVybiByJiZ1ZShuLHQscikmJih0PW51bGwpLHQ/bnIodCxlLEZvKHQpKTplfSxXdC5jdXJyeT16ZSxXdC5jdXJyeVJpZ2h0PURlLFd0LmRlYm91bmNlPU1lLFd0LmRlZmF1bHRzPWZ1bmN0aW9uKG4pe2lmKG51bGw9PW4pcmV0dXJuIG47XG52YXIgdD16dChhcmd1bWVudHMpO3JldHVybiB0LnB1c2goSnQpLFVvLmFwcGx5KHcsdCl9LFd0LmRlZmVyPWZ1bmN0aW9uKG4pe3JldHVybiBlcihuLDEsYXJndW1lbnRzLDEpfSxXdC5kZWxheT1mdW5jdGlvbihuLHQpe3JldHVybiBlcihuLHQsYXJndW1lbnRzLDIpfSxXdC5kaWZmZXJlbmNlPWZ1bmN0aW9uKCl7Zm9yKHZhciBuPS0xLHQ9YXJndW1lbnRzLmxlbmd0aDsrK248dDspe3ZhciByPWFyZ3VtZW50c1tuXTtpZihTbyhyKXx8WWUocikpYnJlYWt9cmV0dXJuIHVyKHIsbHIoYXJndW1lbnRzLGZhbHNlLHRydWUsKytuKSl9LFd0LmRyb3A9X2UsV3QuZHJvcFJpZ2h0PWdlLFd0LmRyb3BSaWdodFdoaWxlPWZ1bmN0aW9uKG4sdCxyKXt2YXIgZT1uP24ubGVuZ3RoOjA7aWYoIWUpcmV0dXJuW107Zm9yKHQ9SHIodCxyLDMpO2UtLSYmdChuW2VdLGUsbik7KTtyZXR1cm4gUnIobiwwLGUrMSl9LFd0LmRyb3BXaGlsZT1mdW5jdGlvbihuLHQscil7dmFyIGU9bj9uLmxlbmd0aDowO2lmKCFlKXJldHVybltdO1xudmFyIHU9LTE7Zm9yKHQ9SHIodCxyLDMpOysrdTxlJiZ0KG5bdV0sdSxuKTspO3JldHVybiBScihuLHUpfSxXdC5maWxsPWZ1bmN0aW9uKG4sdCxyLGUpe3ZhciB1PW4/bi5sZW5ndGg6MDtpZighdSlyZXR1cm5bXTtmb3IociYmdHlwZW9mIHIhPVwibnVtYmVyXCImJnVlKG4sdCxyKSYmKHI9MCxlPXUpLHU9bi5sZW5ndGgscj1udWxsPT1yPzA6K3J8fDAsMD5yJiYocj0tcj51PzA6dStyKSxlPXR5cGVvZiBlPT1cInVuZGVmaW5lZFwifHxlPnU/dTorZXx8MCwwPmUmJihlKz11KSx1PXI+ZT8wOmU+Pj4wLHI+Pj49MDtyPHU7KW5bcisrXT10O3JldHVybiBufSxXdC5maWx0ZXI9UmUsV3QuZmxhdHRlbj1mdW5jdGlvbihuLHQscil7dmFyIGU9bj9uLmxlbmd0aDowO3JldHVybiByJiZ1ZShuLHQscikmJih0PWZhbHNlKSxlP2xyKG4sdCk6W119LFd0LmZsYXR0ZW5EZWVwPWZ1bmN0aW9uKG4pe3JldHVybiBuJiZuLmxlbmd0aD9scihuLHRydWUpOltdfSxXdC5mbG93PWZ1bmN0aW9uKCl7dmFyIG49YXJndW1lbnRzLHQ9bi5sZW5ndGg7XG5pZighdClyZXR1cm4gZnVuY3Rpb24obil7cmV0dXJuIG59O2lmKCFxdChuLEplKSl0aHJvdyBuZXcgT3UoJCk7cmV0dXJuIGZ1bmN0aW9uKCl7Zm9yKHZhciByPTAsZT1uW3JdLmFwcGx5KHRoaXMsYXJndW1lbnRzKTsrK3I8dDspZT1uW3JdLmNhbGwodGhpcyxlKTtyZXR1cm4gZX19LFd0LmZsb3dSaWdodD1xZSxXdC5mb3JFYWNoPU9lLFd0LmZvckVhY2hSaWdodD1DZSxXdC5mb3JJbj1mdW5jdGlvbihuLHQscil7cmV0dXJuKHR5cGVvZiB0IT1cImZ1bmN0aW9uXCJ8fHR5cGVvZiByIT1cInVuZGVmaW5lZFwiKSYmKHQ9TnIodCxyLDMpKSxzcihuLHQsb3UpfSxXdC5mb3JJblJpZ2h0PWZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4gdD1Ocih0LHIsMykscHIobix0LG91KX0sV3QuZm9yT3duPWZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4odHlwZW9mIHQhPVwiZnVuY3Rpb25cInx8dHlwZW9mIHIhPVwidW5kZWZpbmVkXCIpJiYodD1Ocih0LHIsMykpLF9yKG4sdCl9LFd0LmZvck93blJpZ2h0PWZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4gdD1Ocih0LHIsMykscHIobix0LEZvKVxufSxXdC5mdW5jdGlvbnM9dXUsV3QuZ3JvdXBCeT1FbyxXdC5pbmRleEJ5PVJvLFd0LmluaXRpYWw9ZnVuY3Rpb24obil7cmV0dXJuIGdlKG4sMSl9LFd0LmludGVyc2VjdGlvbj1mdW5jdGlvbigpe2Zvcih2YXIgbj1bXSxyPS0xLGU9YXJndW1lbnRzLmxlbmd0aCx1PVtdLG89UXIoKSxpPW89PXQ7KytyPGU7KXt2YXIgZj1hcmd1bWVudHNbcl07KFNvKGYpfHxZZShmKSkmJihuLnB1c2goZiksdS5wdXNoKGkmJjEyMDw9Zi5sZW5ndGgmJnhvKHImJmYpKSl9dmFyIGU9bi5sZW5ndGgsaT1uWzBdLGE9LTEsYz1pP2kubGVuZ3RoOjAsbD1bXSxzPXVbMF07bjpmb3IoOysrYTxjOylpZihmPWlbYV0sMD4ocz9CdChzLGYpOm8obCxmKSkpe2ZvcihyPWU7LS1yOyl7dmFyIHA9dVtyXTtpZigwPihwP0J0KHAsZik6byhuW3JdLGYpKSljb250aW51ZSBufXMmJnMucHVzaChmKSxsLnB1c2goZil9cmV0dXJuIGx9LFd0LmludmVydD1mdW5jdGlvbihuLHQscil7ciYmdWUobix0LHIpJiYodD1udWxsKSxyPS0xO1xuZm9yKHZhciBlPUZvKG4pLHU9ZS5sZW5ndGgsbz17fTsrK3I8dTspe3ZhciBpPWVbcl0sZj1uW2ldO3Q/VXUuY2FsbChvLGYpP29bZl0ucHVzaChpKTpvW2ZdPVtpXTpvW2ZdPWl9cmV0dXJuIG99LFd0Lmludm9rZT1mdW5jdGlvbihuLHQpe3JldHVybiB5cihuLHQsUnIoYXJndW1lbnRzLDIpKX0sV3Qua2V5cz1GbyxXdC5rZXlzSW49b3UsV3QubWFwPVRlLFd0Lm1hcFZhbHVlcz1mdW5jdGlvbihuLHQscil7dmFyIGU9e307cmV0dXJuIHQ9SHIodCxyLDMpLF9yKG4sZnVuY3Rpb24obixyLHUpe2Vbcl09dChuLHIsdSl9KSxlfSxXdC5tYXRjaGVzPXl1LFd0Lm1hdGNoZXNQcm9wZXJ0eT1mdW5jdGlvbihuLHQpe3JldHVybiB4cihuK1wiXCIscnIodCx0cnVlKSl9LFd0Lm1lbW9pemU9UGUsV3QubWVyZ2U9TG8sV3QubWl4aW49ZHUsV3QubmVnYXRlPWZ1bmN0aW9uKG4pe2lmKHR5cGVvZiBuIT1cImZ1bmN0aW9uXCIpdGhyb3cgbmV3IE91KCQpO3JldHVybiBmdW5jdGlvbigpe3JldHVybiFuLmFwcGx5KHRoaXMsYXJndW1lbnRzKVxufX0sV3Qub21pdD1mdW5jdGlvbihuLHQscil7aWYobnVsbD09bilyZXR1cm57fTtpZih0eXBlb2YgdCE9XCJmdW5jdGlvblwiKXt2YXIgZT1LdChscihhcmd1bWVudHMsZmFsc2UsZmFsc2UsMSksSXUpO3JldHVybiBmZShuLHVyKG91KG4pLGUpKX1yZXR1cm4gdD1Ocih0LHIsMyksYWUobixmdW5jdGlvbihuLHIsZSl7cmV0dXJuIXQobixyLGUpfSl9LFd0Lm9uY2U9ZnVuY3Rpb24obil7cmV0dXJuIExlKG4sMil9LFd0LnBhaXJzPWZ1bmN0aW9uKG4pe2Zvcih2YXIgdD0tMSxyPUZvKG4pLGU9ci5sZW5ndGgsdT13dShlKTsrK3Q8ZTspe3ZhciBvPXJbdF07dVt0XT1bbyxuW29dXX1yZXR1cm4gdX0sV3QucGFydGlhbD1LZSxXdC5wYXJ0aWFsUmlnaHQ9VmUsV3QucGFydGl0aW9uPUNvLFd0LnBpY2s9ZnVuY3Rpb24obix0LHIpe3JldHVybiBudWxsPT1uP3t9OnR5cGVvZiB0PT1cImZ1bmN0aW9uXCI/YWUobixOcih0LHIsMykpOmZlKG4sbHIoYXJndW1lbnRzLGZhbHNlLGZhbHNlLDEpKX0sV3QucGx1Y2s9ZnVuY3Rpb24obix0KXtyZXR1cm4gVGUobixqcih0KSlcbn0sV3QucHJvcGVydHk9ZnVuY3Rpb24obil7cmV0dXJuIGpyKG4rXCJcIil9LFd0LnByb3BlcnR5T2Y9ZnVuY3Rpb24obil7cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiBudWxsPT1uP3c6blt0XX19LFd0LnB1bGw9ZnVuY3Rpb24oKXt2YXIgbj1hcmd1bWVudHNbMF07aWYoIW58fCFuLmxlbmd0aClyZXR1cm4gbjtmb3IodmFyIHQ9MCxyPVFyKCksZT1hcmd1bWVudHMubGVuZ3RoOysrdDxlOylmb3IodmFyIHU9MCxvPWFyZ3VtZW50c1t0XTstMTwodT1yKG4sbyx1KSk7KUp1LmNhbGwobix1LDEpO3JldHVybiBufSxXdC5wdWxsQXQ9ZnVuY3Rpb24odCl7dmFyIHI9dHx8W10sZT1scihhcmd1bWVudHMsZmFsc2UsZmFsc2UsMSksdT1lLmxlbmd0aCxvPVF0KHIsZSk7Zm9yKGUuc29ydChuKTt1LS07KXt2YXIgaT1wYXJzZUZsb2F0KGVbdV0pO2lmKGkhPWYmJmVlKGkpKXt2YXIgZj1pO0p1LmNhbGwocixpLDEpfX1yZXR1cm4gb30sV3QucmFuZ2U9ZnVuY3Rpb24obix0LHIpe3ImJnVlKG4sdCxyKSYmKHQ9cj1udWxsKSxuPStufHwwLHI9bnVsbD09cj8xOityfHwwLG51bGw9PXQ/KHQ9bixuPTApOnQ9K3R8fDA7XG52YXIgZT0tMTt0PXVvKE11KCh0LW4pLyhyfHwxKSksMCk7Zm9yKHZhciB1PXd1KHQpOysrZTx0Oyl1W2VdPW4sbis9cjtyZXR1cm4gdX0sV3QucmVhcmc9ZnVuY3Rpb24obil7dmFyIHQ9bHIoYXJndW1lbnRzLGZhbHNlLGZhbHNlLDEpO3JldHVybiBZcihuLE8sbnVsbCxudWxsLG51bGwsdCl9LFd0LnJlamVjdD1mdW5jdGlvbihuLHQscil7dmFyIGU9U28obik/UHQ6YXI7cmV0dXJuIHQ9SHIodCxyLDMpLGUobixmdW5jdGlvbihuLHIsZSl7cmV0dXJuIXQobixyLGUpfSl9LFd0LnJlbW92ZT1mdW5jdGlvbihuLHQscil7dmFyIGU9LTEsdT1uP24ubGVuZ3RoOjAsbz1bXTtmb3IodD1Icih0LHIsMyk7KytlPHU7KXI9bltlXSx0KHIsZSxuKSYmKG8ucHVzaChyKSxKdS5jYWxsKG4sZS0tLDEpLHUtLSk7cmV0dXJuIG99LFd0LnJlc3Q9bWUsV3Quc2h1ZmZsZT1VZSxXdC5zbGljZT1mdW5jdGlvbihuLHQscil7dmFyIGU9bj9uLmxlbmd0aDowO3JldHVybiBlPyhyJiZ0eXBlb2YgciE9XCJudW1iZXJcIiYmdWUobix0LHIpJiYodD0wLHI9ZSksUnIobix0LHIpKTpbXVxufSxXdC5zb3J0Qnk9ZnVuY3Rpb24obix0LGUpe3ZhciB1PS0xLG89bj9uLmxlbmd0aDowLGk9b2Uobyk/d3Uobyk6W107cmV0dXJuIGUmJnVlKG4sdCxlKSYmKHQ9bnVsbCksdD1Icih0LGUsMyksb3IobixmdW5jdGlvbihuLHIsZSl7aVsrK3VdPXthOnQobixyLGUpLGI6dSxjOm59fSkscihpLGYpfSxXdC5zb3J0QnlBbGw9ZnVuY3Rpb24obil7dmFyIHQ9YXJndW1lbnRzOzM8dC5sZW5ndGgmJnVlKHRbMV0sdFsyXSx0WzNdKSYmKHQ9W24sdFsxXV0pO3ZhciBlPS0xLHU9bj9uLmxlbmd0aDowLG89bHIodCxmYWxzZSxmYWxzZSwxKSxpPW9lKHUpP3d1KHUpOltdO3JldHVybiBvcihuLGZ1bmN0aW9uKG4pe2Zvcih2YXIgdD1vLmxlbmd0aCxyPXd1KHQpO3QtLTspclt0XT1udWxsPT1uP3c6bltvW3RdXTtpWysrZV09e2E6cixiOmUsYzpufX0pLHIoaSxhKX0sV3Quc3ByZWFkPWZ1bmN0aW9uKG4pe2lmKHR5cGVvZiBuIT1cImZ1bmN0aW9uXCIpdGhyb3cgbmV3IE91KCQpO3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gbi5hcHBseSh0aGlzLHQpXG59fSxXdC50YWtlPWZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4gbiYmbi5sZW5ndGg/KChyP3VlKG4sdCxyKTpudWxsPT10KSYmKHQ9MSksUnIobiwwLDA+dD8wOnQpKTpbXX0sV3QudGFrZVJpZ2h0PWZ1bmN0aW9uKG4sdCxyKXt2YXIgZT1uP24ubGVuZ3RoOjA7cmV0dXJuIGU/KChyP3VlKG4sdCxyKTpudWxsPT10KSYmKHQ9MSksdD1lLSgrdHx8MCksUnIobiwwPnQ/MDp0KSk6W119LFd0LnRha2VSaWdodFdoaWxlPWZ1bmN0aW9uKG4sdCxyKXt2YXIgZT1uP24ubGVuZ3RoOjA7aWYoIWUpcmV0dXJuW107Zm9yKHQ9SHIodCxyLDMpO2UtLSYmdChuW2VdLGUsbik7KTtyZXR1cm4gUnIobixlKzEpfSxXdC50YWtlV2hpbGU9ZnVuY3Rpb24obix0LHIpe3ZhciBlPW4/bi5sZW5ndGg6MDtpZighZSlyZXR1cm5bXTt2YXIgdT0tMTtmb3IodD1Icih0LHIsMyk7Kyt1PGUmJnQoblt1XSx1LG4pOyk7cmV0dXJuIFJyKG4sMCx1KX0sV3QudGFwPWZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4gdC5jYWxsKHIsbiksblxufSxXdC50aHJvdHRsZT1mdW5jdGlvbihuLHQscil7dmFyIGU9dHJ1ZSx1PXRydWU7aWYodHlwZW9mIG4hPVwiZnVuY3Rpb25cIil0aHJvdyBuZXcgT3UoJCk7cmV0dXJuIGZhbHNlPT09cj9lPWZhbHNlOlhlKHIpJiYoZT1cImxlYWRpbmdcImluIHI/ISFyLmxlYWRpbmc6ZSx1PVwidHJhaWxpbmdcImluIHI/ISFyLnRyYWlsaW5nOnUpLFN0LmxlYWRpbmc9ZSxTdC5tYXhXYWl0PSt0LFN0LnRyYWlsaW5nPXUsTWUobix0LFN0KX0sV3QudGhydT1qZSxXdC50aW1lcz1mdW5jdGlvbihuLHQscil7aWYobj0rbiwxPm58fCFybyhuKSlyZXR1cm5bXTt2YXIgZT0tMSx1PXd1KG9vKG4scG8pKTtmb3IodD1Ocih0LHIsMSk7KytlPG47KWU8cG8/dVtlXT10KGUpOnQoZSk7cmV0dXJuIHV9LFd0LnRvQXJyYXk9ZnVuY3Rpb24obil7dmFyIHQ9bj9uLmxlbmd0aDowO3JldHVybiBvZSh0KT90P3p0KG4pOltdOml1KG4pfSxXdC50b1BsYWluT2JqZWN0PWV1LFd0LnRyYW5zZm9ybT1mdW5jdGlvbihuLHQscixlKXt2YXIgdT1TbyhuKXx8cnUobik7XG5yZXR1cm4gdD1Icih0LGUsNCksbnVsbD09ciYmKHV8fFhlKG4pPyhlPW4uY29uc3RydWN0b3Iscj11P1NvKG4pP25ldyBlOltdOndvKEplKGUpJiZlLnByb3RvdHlwZSkpOnI9e30pLCh1P010Ol9yKShuLGZ1bmN0aW9uKG4sZSx1KXtyZXR1cm4gdChyLG4sZSx1KX0pLHJ9LFd0LnVuaW9uPWZ1bmN0aW9uKCl7cmV0dXJuIE9yKGxyKGFyZ3VtZW50cyxmYWxzZSx0cnVlKSl9LFd0LnVuaXE9d2UsV3QudW56aXA9YmUsV3QudmFsdWVzPWl1LFd0LnZhbHVlc0luPWZ1bmN0aW9uKG4pe3JldHVybiBDcihuLG91KG4pKX0sV3Qud2hlcmU9ZnVuY3Rpb24obix0KXtyZXR1cm4gUmUobixicih0KSl9LFd0LndpdGhvdXQ9ZnVuY3Rpb24obil7cmV0dXJuIHVyKG4sUnIoYXJndW1lbnRzLDEpKX0sV3Qud3JhcD1mdW5jdGlvbihuLHQpe3JldHVybiB0PW51bGw9PXQ/dnU6dCxZcih0LFIsbnVsbCxbbl0sW10pfSxXdC54b3I9ZnVuY3Rpb24oKXtmb3IodmFyIG49LTEsdD1hcmd1bWVudHMubGVuZ3RoOysrbjx0Oyl7dmFyIHI9YXJndW1lbnRzW25dO1xuaWYoU28ocil8fFllKHIpKXZhciBlPWU/dXIoZSxyKS5jb25jYXQodXIocixlKSk6cn1yZXR1cm4gZT9PcihlKTpbXX0sV3QuemlwPWZ1bmN0aW9uKCl7Zm9yKHZhciBuPWFyZ3VtZW50cy5sZW5ndGgsdD13dShuKTtuLS07KXRbbl09YXJndW1lbnRzW25dO3JldHVybiBiZSh0KX0sV3QuemlwT2JqZWN0PXhlLFd0LmJhY2tmbG93PXFlLFd0LmNvbGxlY3Q9VGUsV3QuY29tcG9zZT1xZSxXdC5lYWNoPU9lLFd0LmVhY2hSaWdodD1DZSxXdC5leHRlbmQ9VW8sV3QuaXRlcmF0ZWU9X3UsV3QubWV0aG9kcz11dSxXdC5vYmplY3Q9eGUsV3Quc2VsZWN0PVJlLFd0LnRhaWw9bWUsV3QudW5pcXVlPXdlLGR1KFd0LFd0KSxXdC5hdHRlbXB0PWh1LFd0LmNhbWVsQ2FzZT0kbyxXdC5jYXBpdGFsaXplPWZ1bmN0aW9uKG4pe3JldHVybihuPWUobikpJiZuLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpK24uc2xpY2UoMSl9LFd0LmNsb25lPWZ1bmN0aW9uKG4sdCxyLGUpe3JldHVybiB0eXBlb2YgdCE9XCJib29sZWFuXCImJm51bGwhPXQmJihlPXIscj11ZShuLHQsZSk/bnVsbDp0LHQ9ZmFsc2UpLHI9dHlwZW9mIHI9PVwiZnVuY3Rpb25cIiYmTnIocixlLDEpLHJyKG4sdCxyKVxufSxXdC5jbG9uZURlZXA9ZnVuY3Rpb24obix0LHIpe3JldHVybiB0PXR5cGVvZiB0PT1cImZ1bmN0aW9uXCImJk5yKHQsciwxKSxycihuLHRydWUsdCl9LFd0LmRlYnVycj1mdSxXdC5lbmRzV2l0aD1mdW5jdGlvbihuLHQscil7bj1lKG4pLHQrPVwiXCI7dmFyIHU9bi5sZW5ndGg7cmV0dXJuIHI9KHR5cGVvZiByPT1cInVuZGVmaW5lZFwiP3U6b28oMD5yPzA6K3J8fDAsdSkpLXQubGVuZ3RoLDA8PXImJm4uaW5kZXhPZih0LHIpPT1yfSxXdC5lc2NhcGU9ZnVuY3Rpb24obil7cmV0dXJuKG49ZShuKSkmJnB0LnRlc3Qobik/bi5yZXBsYWNlKGx0LGwpOm59LFd0LmVzY2FwZVJlZ0V4cD1hdSxXdC5ldmVyeT1FZSxXdC5maW5kPUllLFd0LmZpbmRJbmRleD12ZSxXdC5maW5kS2V5PWZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4gdD1Icih0LHIsMyksY3Iobix0LF9yLHRydWUpfSxXdC5maW5kTGFzdD1mdW5jdGlvbihuLHQscil7cmV0dXJuIHQ9SHIodCxyLDMpLGNyKG4sdCxpcil9LFd0LmZpbmRMYXN0SW5kZXg9ZnVuY3Rpb24obix0LHIpe3ZhciBlPW4/bi5sZW5ndGg6MDtcbmZvcih0PUhyKHQsciwzKTtlLS07KWlmKHQobltlXSxlLG4pKXJldHVybiBlO3JldHVybi0xfSxXdC5maW5kTGFzdEtleT1mdW5jdGlvbihuLHQscil7cmV0dXJuIHQ9SHIodCxyLDMpLGNyKG4sdCxncix0cnVlKX0sV3QuZmluZFdoZXJlPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIEllKG4sYnIodCkpfSxXdC5maXJzdD15ZSxXdC5oYXM9ZnVuY3Rpb24obix0KXtyZXR1cm4gbj9VdS5jYWxsKG4sdCk6ZmFsc2V9LFd0LmlkZW50aXR5PXZ1LFd0LmluY2x1ZGVzPWtlLFd0LmluZGV4T2Y9ZGUsV3QuaXNBcmd1bWVudHM9WWUsV3QuaXNBcnJheT1TbyxXdC5pc0Jvb2xlYW49ZnVuY3Rpb24obil7cmV0dXJuIHRydWU9PT1ufHxmYWxzZT09PW58fGgobikmJkx1LmNhbGwobik9PU18fGZhbHNlfSxXdC5pc0RhdGU9ZnVuY3Rpb24obil7cmV0dXJuIGgobikmJkx1LmNhbGwobik9PXF8fGZhbHNlfSxXdC5pc0VsZW1lbnQ9WmUsV3QuaXNFbXB0eT1mdW5jdGlvbihuKXtpZihudWxsPT1uKXJldHVybiB0cnVlO3ZhciB0PW4ubGVuZ3RoO1xucmV0dXJuIG9lKHQpJiYoU28obil8fHR1KG4pfHxZZShuKXx8aChuKSYmSmUobi5zcGxpY2UpKT8hdDohRm8obikubGVuZ3RofSxXdC5pc0VxdWFsPWZ1bmN0aW9uKG4sdCxyLGUpe3JldHVybiByPXR5cGVvZiByPT1cImZ1bmN0aW9uXCImJk5yKHIsZSwzKSwhciYmaWUobikmJmllKHQpP249PT10OihlPXI/cihuLHQpOncsdHlwZW9mIGU9PVwidW5kZWZpbmVkXCI/ZHIobix0LHIpOiEhZSl9LFd0LmlzRXJyb3I9R2UsV3QuaXNGaW5pdGU9V28sV3QuaXNGdW5jdGlvbj1KZSxXdC5pc01hdGNoPWZ1bmN0aW9uKG4sdCxyLGUpe3ZhciB1PUZvKHQpLG89dS5sZW5ndGg7aWYocj10eXBlb2Ygcj09XCJmdW5jdGlvblwiJiZOcihyLGUsMyksIXImJjE9PW8pe3ZhciBpPXVbMF07aWYoZT10W2ldLGllKGUpKXJldHVybiBudWxsIT1uJiZlPT09bltpXSYmVXUuY2FsbChuLGkpfWZvcih2YXIgaT13dShvKSxmPXd1KG8pO28tLTspZT1pW29dPXRbdVtvXV0sZltvXT1pZShlKTtyZXR1cm4gbXIobix1LGksZixyKVxufSxXdC5pc05hTj1mdW5jdGlvbihuKXtyZXR1cm4gUWUobikmJm4hPStufSxXdC5pc05hdGl2ZT1IZSxXdC5pc051bGw9ZnVuY3Rpb24obil7cmV0dXJuIG51bGw9PT1ufSxXdC5pc051bWJlcj1RZSxXdC5pc09iamVjdD1YZSxXdC5pc1BsYWluT2JqZWN0PU5vLFd0LmlzUmVnRXhwPW51LFd0LmlzU3RyaW5nPXR1LFd0LmlzVHlwZWRBcnJheT1ydSxXdC5pc1VuZGVmaW5lZD1mdW5jdGlvbihuKXtyZXR1cm4gdHlwZW9mIG49PVwidW5kZWZpbmVkXCJ9LFd0LmtlYmFiQ2FzZT1CbyxXdC5sYXN0PWZ1bmN0aW9uKG4pe3ZhciB0PW4/bi5sZW5ndGg6MDtyZXR1cm4gdD9uW3QtMV06d30sV3QubGFzdEluZGV4T2Y9ZnVuY3Rpb24obix0LHIpe3ZhciBlPW4/bi5sZW5ndGg6MDtpZighZSlyZXR1cm4tMTt2YXIgdT1lO2lmKHR5cGVvZiByPT1cIm51bWJlclwiKXU9KDA+cj91byhlK3IsMCk6b28ocnx8MCxlLTEpKSsxO2Vsc2UgaWYocilyZXR1cm4gdT1TcihuLHQsdHJ1ZSktMSxuPW5bdV0sKHQ9PT10P3Q9PT1uOm4hPT1uKT91Oi0xO1xuaWYodCE9PXQpcmV0dXJuIHAobix1LHRydWUpO2Zvcig7dS0tOylpZihuW3VdPT09dClyZXR1cm4gdTtyZXR1cm4tMX0sV3QubWF4PUlvLFd0Lm1pbj1PbyxXdC5ub0NvbmZsaWN0PWZ1bmN0aW9uKCl7cmV0dXJuIF8uXz0kdSx0aGlzfSxXdC5ub29wPW11LFd0Lm5vdz1UbyxXdC5wYWQ9ZnVuY3Rpb24obix0LHIpe249ZShuKSx0PSt0O3ZhciB1PW4ubGVuZ3RoO3JldHVybiB1PHQmJnJvKHQpPyh1PSh0LXUpLzIsdD1QdSh1KSx1PU11KHUpLHI9S3IoXCJcIix1LHIpLHIuc2xpY2UoMCx0KStuK3IpOm59LFd0LnBhZExlZnQ9ZnVuY3Rpb24obix0LHIpe3JldHVybihuPWUobikpJiZLcihuLHQscikrbn0sV3QucGFkUmlnaHQ9ZnVuY3Rpb24obix0LHIpe3JldHVybihuPWUobikpJiZuK0tyKG4sdCxyKX0sV3QucGFyc2VJbnQ9Y3UsV3QucmFuZG9tPWZ1bmN0aW9uKG4sdCxyKXtyJiZ1ZShuLHQscikmJih0PXI9bnVsbCk7dmFyIGU9bnVsbD09bix1PW51bGw9PXQ7cmV0dXJuIG51bGw9PXImJih1JiZ0eXBlb2Ygbj09XCJib29sZWFuXCI/KHI9bixuPTEpOnR5cGVvZiB0PT1cImJvb2xlYW5cIiYmKHI9dCx1PXRydWUpKSxlJiZ1JiYodD0xLHU9ZmFsc2UpLG49K258fDAsdT8odD1uLG49MCk6dD0rdHx8MCxyfHxuJTF8fHQlMT8ocj1jbygpLG9vKG4rcioodC1uK3BhcnNlRmxvYXQoXCIxZS1cIisoKHIrXCJcIikubGVuZ3RoLTEpKSksdCkpOmtyKG4sdClcbn0sV3QucmVkdWNlPVNlLFd0LnJlZHVjZVJpZ2h0PVdlLFd0LnJlcGVhdD1sdSxXdC5yZXN1bHQ9ZnVuY3Rpb24obix0LHIpe3JldHVybiB0PW51bGw9PW4/dzpuW3RdLHR5cGVvZiB0PT1cInVuZGVmaW5lZFwiJiYodD1yKSxKZSh0KT90LmNhbGwobik6dH0sV3QucnVuSW5Db250ZXh0PW0sV3Quc2l6ZT1mdW5jdGlvbihuKXt2YXIgdD1uP24ubGVuZ3RoOjA7cmV0dXJuIG9lKHQpP3Q6Rm8obikubGVuZ3RofSxXdC5zbmFrZUNhc2U9em8sV3Quc29tZT1GZSxXdC5zb3J0ZWRJbmRleD1mdW5jdGlvbihuLHQscixlKXt2YXIgdT1IcihyKTtyZXR1cm4gdT09PXRyJiZudWxsPT1yP1NyKG4sdCk6V3Iobix0LHUocixlLDEpKX0sV3Quc29ydGVkTGFzdEluZGV4PWZ1bmN0aW9uKG4sdCxyLGUpe3ZhciB1PUhyKHIpO3JldHVybiB1PT09dHImJm51bGw9PXI/U3Iobix0LHRydWUpOldyKG4sdCx1KHIsZSwxKSx0cnVlKX0sV3Quc3RhcnRDYXNlPURvLFd0LnN0YXJ0c1dpdGg9ZnVuY3Rpb24obix0LHIpe3JldHVybiBuPWUobikscj1udWxsPT1yPzA6b28oMD5yPzA6K3J8fDAsbi5sZW5ndGgpLG4ubGFzdEluZGV4T2YodCxyKT09clxufSxXdC50ZW1wbGF0ZT1mdW5jdGlvbihuLHQscil7dmFyIHU9V3QudGVtcGxhdGVTZXR0aW5ncztyJiZ1ZShuLHQscikmJih0PXI9bnVsbCksbj1lKG4pLHQ9SHQoSHQoe30scnx8dCksdSxYdCkscj1IdChIdCh7fSx0LmltcG9ydHMpLHUuaW1wb3J0cyxYdCk7dmFyIG8saSxmPUZvKHIpLGE9Q3IocixmKSxjPTA7cj10LmludGVycG9sYXRlfHx4dDt2YXIgbD1cIl9fcCs9J1wiO3I9UnUoKHQuZXNjYXBlfHx4dCkuc291cmNlK1wifFwiK3Iuc291cmNlK1wifFwiKyhyPT09Z3Q/dnQ6eHQpLnNvdXJjZStcInxcIisodC5ldmFsdWF0ZXx8eHQpLnNvdXJjZStcInwkXCIsXCJnXCIpO3ZhciBwPVwic291cmNlVVJMXCJpbiB0P1wiLy8jIHNvdXJjZVVSTD1cIit0LnNvdXJjZVVSTCtcIlxcblwiOlwiXCI7aWYobi5yZXBsYWNlKHIsZnVuY3Rpb24odCxyLGUsdSxmLGEpe3JldHVybiBlfHwoZT11KSxsKz1uLnNsaWNlKGMsYSkucmVwbGFjZShFdCxzKSxyJiYobz10cnVlLGwrPVwiJytfX2UoXCIrcitcIikrJ1wiKSxmJiYoaT10cnVlLGwrPVwiJztcIitmK1wiO1xcbl9fcCs9J1wiKSxlJiYobCs9XCInKygoX190PShcIitlK1wiKSk9PW51bGw/Jyc6X190KSsnXCIpLGM9YSt0Lmxlbmd0aCx0XG59KSxsKz1cIic7XCIsKHQ9dC52YXJpYWJsZSl8fChsPVwid2l0aChvYmope1wiK2wrXCJ9XCIpLGw9KGk/bC5yZXBsYWNlKGl0LFwiXCIpOmwpLnJlcGxhY2UoZnQsXCIkMVwiKS5yZXBsYWNlKGF0LFwiJDE7XCIpLGw9XCJmdW5jdGlvbihcIisodHx8XCJvYmpcIikrXCIpe1wiKyh0P1wiXCI6XCJvYmp8fChvYmo9e30pO1wiKStcInZhciBfX3QsX19wPScnXCIrKG8/XCIsX19lPV8uZXNjYXBlXCI6XCJcIikrKGk/XCIsX19qPUFycmF5LnByb3RvdHlwZS5qb2luO2Z1bmN0aW9uIHByaW50KCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpfVwiOlwiO1wiKStsK1wicmV0dXJuIF9fcH1cIix0PWh1KGZ1bmN0aW9uKCl7cmV0dXJuIEF1KGYscCtcInJldHVybiBcIitsKS5hcHBseSh3LGEpfSksdC5zb3VyY2U9bCxHZSh0KSl0aHJvdyB0O3JldHVybiB0fSxXdC50cmltPXN1LFd0LnRyaW1MZWZ0PWZ1bmN0aW9uKG4sdCxyKXt2YXIgdT1uO3JldHVybihuPWUobikpP24uc2xpY2UoKHI/dWUodSx0LHIpOm51bGw9PXQpP3Yobik6byhuLHQrXCJcIikpOm5cbn0sV3QudHJpbVJpZ2h0PWZ1bmN0aW9uKG4sdCxyKXt2YXIgdT1uO3JldHVybihuPWUobikpPyhyP3VlKHUsdCxyKTpudWxsPT10KT9uLnNsaWNlKDAseShuKSsxKTpuLnNsaWNlKDAsaShuLHQrXCJcIikrMSk6bn0sV3QudHJ1bmM9ZnVuY3Rpb24obix0LHIpe3ImJnVlKG4sdCxyKSYmKHQ9bnVsbCk7dmFyIHU9VDtpZihyPVMsbnVsbCE9dClpZihYZSh0KSl7dmFyIG89XCJzZXBhcmF0b3JcImluIHQ/dC5zZXBhcmF0b3I6byx1PVwibGVuZ3RoXCJpbiB0Pyt0Lmxlbmd0aHx8MDp1O3I9XCJvbWlzc2lvblwiaW4gdD9lKHQub21pc3Npb24pOnJ9ZWxzZSB1PSt0fHwwO2lmKG49ZShuKSx1Pj1uLmxlbmd0aClyZXR1cm4gbjtpZih1LT1yLmxlbmd0aCwxPnUpcmV0dXJuIHI7aWYodD1uLnNsaWNlKDAsdSksbnVsbD09bylyZXR1cm4gdCtyO2lmKG51KG8pKXtpZihuLnNsaWNlKHUpLnNlYXJjaChvKSl7dmFyIGksZj1uLnNsaWNlKDAsdSk7Zm9yKG8uZ2xvYmFsfHwobz1SdShvLnNvdXJjZSwoeXQuZXhlYyhvKXx8XCJcIikrXCJnXCIpKSxvLmxhc3RJbmRleD0wO249by5leGVjKGYpOylpPW4uaW5kZXg7XG50PXQuc2xpY2UoMCxudWxsPT1pP3U6aSl9fWVsc2Ugbi5pbmRleE9mKG8sdSkhPXUmJihvPXQubGFzdEluZGV4T2YobyksLTE8byYmKHQ9dC5zbGljZSgwLG8pKSk7cmV0dXJuIHQrcn0sV3QudW5lc2NhcGU9ZnVuY3Rpb24obil7cmV0dXJuKG49ZShuKSkmJnN0LnRlc3Qobik/bi5yZXBsYWNlKGN0LGQpOm59LFd0LnVuaXF1ZUlkPWZ1bmN0aW9uKG4pe3ZhciB0PSsrRnU7cmV0dXJuIGUobikrdH0sV3Qud29yZHM9cHUsV3QuYWxsPUVlLFd0LmFueT1GZSxXdC5jb250YWlucz1rZSxXdC5kZXRlY3Q9SWUsV3QuZm9sZGw9U2UsV3QuZm9sZHI9V2UsV3QuaGVhZD15ZSxXdC5pbmNsdWRlPWtlLFd0LmluamVjdD1TZSxkdShXdCxmdW5jdGlvbigpe3ZhciBuPXt9O3JldHVybiBfcihXdCxmdW5jdGlvbih0LHIpe1d0LnByb3RvdHlwZVtyXXx8KG5bcl09dCl9KSxufSgpLGZhbHNlKSxXdC5zYW1wbGU9TmUsV3QucHJvdG90eXBlLnNhbXBsZT1mdW5jdGlvbihuKXtyZXR1cm4gdGhpcy5fX2NoYWluX198fG51bGwhPW4/dGhpcy50aHJ1KGZ1bmN0aW9uKHQpe3JldHVybiBOZSh0LG4pXG59KTpOZSh0aGlzLnZhbHVlKCkpfSxXdC5WRVJTSU9OPWIsTXQoXCJiaW5kIGJpbmRLZXkgY3VycnkgY3VycnlSaWdodCBwYXJ0aWFsIHBhcnRpYWxSaWdodFwiLnNwbGl0KFwiIFwiKSxmdW5jdGlvbihuKXtXdFtuXS5wbGFjZWhvbGRlcj1XdH0pLE10KFtcImZpbHRlclwiLFwibWFwXCIsXCJ0YWtlV2hpbGVcIl0sZnVuY3Rpb24obix0KXt2YXIgcj10PT1VLGU9dD09TDtVdC5wcm90b3R5cGVbbl09ZnVuY3Rpb24obix1KXt2YXIgbz10aGlzLmNsb25lKCksaT1vLl9fZmlsdGVyZWRfXyxmPW8uX19pdGVyYXRlZXNfX3x8KG8uX19pdGVyYXRlZXNfXz1bXSk7cmV0dXJuIG8uX19maWx0ZXJlZF9fPWl8fHJ8fGUmJjA+by5fX2Rpcl9fLGYucHVzaCh7aXRlcmF0ZWU6SHIobix1LDMpLHR5cGU6dH0pLG99fSksTXQoW1wiZHJvcFwiLFwidGFrZVwiXSxmdW5jdGlvbihuLHQpe3ZhciByPVwiX19cIituK1wiQ291bnRfX1wiLGU9bitcIldoaWxlXCI7VXQucHJvdG90eXBlW25dPWZ1bmN0aW9uKGUpe2U9bnVsbD09ZT8xOnVvKFB1KGUpfHwwLDApO1xudmFyIHU9dGhpcy5jbG9uZSgpO2lmKHUuX19maWx0ZXJlZF9fKXt2YXIgbz11W3JdO3Vbcl09dD9vbyhvLGUpOm8rZX1lbHNlKHUuX192aWV3c19ffHwodS5fX3ZpZXdzX189W10pKS5wdXNoKHtzaXplOmUsdHlwZTpuKygwPnUuX19kaXJfXz9cIlJpZ2h0XCI6XCJcIil9KTtyZXR1cm4gdX0sVXQucHJvdG90eXBlW24rXCJSaWdodFwiXT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5yZXZlcnNlKClbbl0odCkucmV2ZXJzZSgpfSxVdC5wcm90b3R5cGVbbitcIlJpZ2h0V2hpbGVcIl09ZnVuY3Rpb24obix0KXtyZXR1cm4gdGhpcy5yZXZlcnNlKClbZV0obix0KS5yZXZlcnNlKCl9fSksTXQoW1wiZmlyc3RcIixcImxhc3RcIl0sZnVuY3Rpb24obix0KXt2YXIgcj1cInRha2VcIisodD9cIlJpZ2h0XCI6XCJcIik7VXQucHJvdG90eXBlW25dPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbcl0oMSkudmFsdWUoKVswXX19KSxNdChbXCJpbml0aWFsXCIsXCJyZXN0XCJdLGZ1bmN0aW9uKG4sdCl7dmFyIHI9XCJkcm9wXCIrKHQ/XCJcIjpcIlJpZ2h0XCIpO1xuVXQucHJvdG90eXBlW25dPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbcl0oMSl9fSksTXQoW1wicGx1Y2tcIixcIndoZXJlXCJdLGZ1bmN0aW9uKG4sdCl7dmFyIHI9dD9cImZpbHRlclwiOlwibWFwXCIsZT10P2JyOmpyO1V0LnByb3RvdHlwZVtuXT1mdW5jdGlvbihuKXtyZXR1cm4gdGhpc1tyXShlKG4pKX19KSxVdC5wcm90b3R5cGUuY29tcGFjdD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmZpbHRlcih2dSl9LFV0LnByb3RvdHlwZS5kcm9wV2hpbGU9ZnVuY3Rpb24obix0KXt2YXIgcjtyZXR1cm4gbj1IcihuLHQsMyksdGhpcy5maWx0ZXIoZnVuY3Rpb24odCxlLHUpe3JldHVybiByfHwocj0hbih0LGUsdSkpfSl9LFV0LnByb3RvdHlwZS5yZWplY3Q9ZnVuY3Rpb24obix0KXtyZXR1cm4gbj1IcihuLHQsMyksdGhpcy5maWx0ZXIoZnVuY3Rpb24odCxyLGUpe3JldHVybiFuKHQscixlKX0pfSxVdC5wcm90b3R5cGUuc2xpY2U9ZnVuY3Rpb24obix0KXtuPW51bGw9PW4/MDorbnx8MDt2YXIgcj0wPm4/dGhpcy50YWtlUmlnaHQoLW4pOnRoaXMuZHJvcChuKTtcbnJldHVybiB0eXBlb2YgdCE9XCJ1bmRlZmluZWRcIiYmKHQ9K3R8fDAscj0wPnQ/ci5kcm9wUmlnaHQoLXQpOnIudGFrZSh0LW4pKSxyfSxVdC5wcm90b3R5cGUudG9BcnJheT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmRyb3AoMCl9LF9yKFV0LnByb3RvdHlwZSxmdW5jdGlvbihuLHQpe3ZhciByPVd0W3RdLGU9L14oPzpmaXJzdHxsYXN0KSQvLnRlc3QodCk7V3QucHJvdG90eXBlW3RdPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChuKXtyZXR1cm4gbj1bbl0sVnUuYXBwbHkobixvKSxyLmFwcGx5KFd0LG4pfXZhciB1PXRoaXMuX193cmFwcGVkX18sbz1hcmd1bWVudHMsaT10aGlzLl9fY2hhaW5fXyxmPSEhdGhpcy5fX2FjdGlvbnNfXy5sZW5ndGgsYT11IGluc3RhbmNlb2YgVXQsYz1hJiYhZjtyZXR1cm4gZSYmIWk/Yz9uLmNhbGwodSk6ci5jYWxsKFd0LHRoaXMudmFsdWUoKSk6YXx8U28odSk/KHU9bi5hcHBseShjP3U6bmV3IFV0KHRoaXMpLG8pLGV8fCFmJiYhdS5fX2FjdGlvbnNfX3x8KHUuX19hY3Rpb25zX198fCh1Ll9fYWN0aW9uc19fPVtdKSkucHVzaCh7ZnVuYzpqZSxhcmdzOlt0XSx0aGlzQXJnOld0fSksbmV3IE50KHUsaSkpOnRoaXMudGhydSh0KVxufX0pLE10KFwiY29uY2F0IGpvaW4gcG9wIHB1c2ggc2hpZnQgc29ydCBzcGxpY2UgdW5zaGlmdFwiLnNwbGl0KFwiIFwiKSxmdW5jdGlvbihuKXt2YXIgdD1DdVtuXSxyPS9eKD86cHVzaHxzb3J0fHVuc2hpZnQpJC8udGVzdChuKT9cInRhcFwiOlwidGhydVwiLGU9L14oPzpqb2lufHBvcHxzaGlmdCkkLy50ZXN0KG4pO1d0LnByb3RvdHlwZVtuXT1mdW5jdGlvbigpe3ZhciBuPWFyZ3VtZW50cztyZXR1cm4gZSYmIXRoaXMuX19jaGFpbl9fP3QuYXBwbHkodGhpcy52YWx1ZSgpLG4pOnRoaXNbcl0oZnVuY3Rpb24ocil7cmV0dXJuIHQuYXBwbHkocixuKX0pfX0pLFV0LnByb3RvdHlwZS5jbG9uZT1mdW5jdGlvbigpe3ZhciBuPXRoaXMuX19hY3Rpb25zX18sdD10aGlzLl9faXRlcmF0ZWVzX18scj10aGlzLl9fdmlld3NfXyxlPW5ldyBVdCh0aGlzLl9fd3JhcHBlZF9fKTtyZXR1cm4gZS5fX2FjdGlvbnNfXz1uP3p0KG4pOm51bGwsZS5fX2Rpcl9fPXRoaXMuX19kaXJfXyxlLl9fZHJvcENvdW50X189dGhpcy5fX2Ryb3BDb3VudF9fLGUuX19maWx0ZXJlZF9fPXRoaXMuX19maWx0ZXJlZF9fLGUuX19pdGVyYXRlZXNfXz10P3p0KHQpOm51bGwsZS5fX3Rha2VDb3VudF9fPXRoaXMuX190YWtlQ291bnRfXyxlLl9fdmlld3NfXz1yP3p0KHIpOm51bGwsZVxufSxVdC5wcm90b3R5cGUucmV2ZXJzZT1mdW5jdGlvbigpe2lmKHRoaXMuX19maWx0ZXJlZF9fKXt2YXIgbj1uZXcgVXQodGhpcyk7bi5fX2Rpcl9fPS0xLG4uX19maWx0ZXJlZF9fPXRydWV9ZWxzZSBuPXRoaXMuY2xvbmUoKSxuLl9fZGlyX18qPS0xO3JldHVybiBufSxVdC5wcm90b3R5cGUudmFsdWU9ZnVuY3Rpb24oKXt2YXIgbj10aGlzLl9fd3JhcHBlZF9fLnZhbHVlKCk7aWYoIVNvKG4pKXJldHVybiBUcihuLHRoaXMuX19hY3Rpb25zX18pO3ZhciB0LHI9dGhpcy5fX2Rpcl9fLGU9MD5yO3Q9bi5sZW5ndGg7Zm9yKHZhciB1PXRoaXMuX192aWV3c19fLG89MCxpPS0xLGY9dT91Lmxlbmd0aDowOysraTxmOyl7dmFyIGE9dVtpXSxjPWEuc2l6ZTtzd2l0Y2goYS50eXBlKXtjYXNlXCJkcm9wXCI6bys9YzticmVhaztjYXNlXCJkcm9wUmlnaHRcIjp0LT1jO2JyZWFrO2Nhc2VcInRha2VcIjp0PW9vKHQsbytjKTticmVhaztjYXNlXCJ0YWtlUmlnaHRcIjpvPXVvKG8sdC1jKX19dD17c3RhcnQ6byxlbmQ6dH0saT10LnN0YXJ0LGY9dC5lbmQsdD1mLWksdT10aGlzLl9fZHJvcENvdW50X18sbz1vbyh0LHRoaXMuX190YWtlQ291bnRfXyksZT1lP2Y6aS0xLGY9KGk9dGhpcy5fX2l0ZXJhdGVlc19fKT9pLmxlbmd0aDowLGE9MCxjPVtdO1xubjpmb3IoO3QtLSYmYTxvOyl7Zm9yKHZhciBlPWUrcixsPS0xLHM9bltlXTsrK2w8Zjspe3ZhciBwPWlbbF0saD1wLml0ZXJhdGVlKHMsZSxuKSxwPXAudHlwZTtpZihwPT1GKXM9aDtlbHNlIGlmKCFoKXtpZihwPT1VKWNvbnRpbnVlIG47YnJlYWsgbn19dT91LS06Y1thKytdPXN9cmV0dXJuIGN9LFd0LnByb3RvdHlwZS5jaGFpbj1mdW5jdGlvbigpe3JldHVybiBBZSh0aGlzKX0sV3QucHJvdG90eXBlLmNvbW1pdD1mdW5jdGlvbigpe3JldHVybiBuZXcgTnQodGhpcy52YWx1ZSgpLHRoaXMuX19jaGFpbl9fKX0sV3QucHJvdG90eXBlLnBsYW50PWZ1bmN0aW9uKG4pe2Zvcih2YXIgdCxyPXRoaXM7ciBpbnN0YW5jZW9mIE50Oyl7dmFyIGU9aGUocik7dD91Ll9fd3JhcHBlZF9fPWU6dD1lO3ZhciB1PWUscj1yLl9fd3JhcHBlZF9ffXJldHVybiB1Ll9fd3JhcHBlZF9fPW4sdH0sV3QucHJvdG90eXBlLnJldmVyc2U9ZnVuY3Rpb24oKXt2YXIgbj10aGlzLl9fd3JhcHBlZF9fO3JldHVybiBuIGluc3RhbmNlb2YgVXQ/KHRoaXMuX19hY3Rpb25zX18ubGVuZ3RoJiYobj1uZXcgVXQodGhpcykpLG5ldyBOdChuLnJldmVyc2UoKSx0aGlzLl9fY2hhaW5fXykpOnRoaXMudGhydShmdW5jdGlvbihuKXtyZXR1cm4gbi5yZXZlcnNlKClcbn0pfSxXdC5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52YWx1ZSgpK1wiXCJ9LFd0LnByb3RvdHlwZS5ydW49V3QucHJvdG90eXBlLnRvSlNPTj1XdC5wcm90b3R5cGUudmFsdWVPZj1XdC5wcm90b3R5cGUudmFsdWU9ZnVuY3Rpb24oKXtyZXR1cm4gVHIodGhpcy5fX3dyYXBwZWRfXyx0aGlzLl9fYWN0aW9uc19fKX0sV3QucHJvdG90eXBlLmNvbGxlY3Q9V3QucHJvdG90eXBlLm1hcCxXdC5wcm90b3R5cGUuaGVhZD1XdC5wcm90b3R5cGUuZmlyc3QsV3QucHJvdG90eXBlLnNlbGVjdD1XdC5wcm90b3R5cGUuZmlsdGVyLFd0LnByb3RvdHlwZS50YWlsPVd0LnByb3RvdHlwZS5yZXN0LFd0fXZhciB3LGI9XCIzLjIuMFwiLHg9MSxBPTIsaj00LGs9OCxFPTE2LFI9MzIsST02NCxPPTEyOCxDPTI1NixUPTMwLFM9XCIuLi5cIixXPTE1MCxOPTE2LFU9MCxGPTEsTD0yLCQ9XCJFeHBlY3RlZCBhIGZ1bmN0aW9uXCIsQj1cIl9fbG9kYXNoX3BsYWNlaG9sZGVyX19cIix6PVwiW29iamVjdCBBcmd1bWVudHNdXCIsRD1cIltvYmplY3QgQXJyYXldXCIsTT1cIltvYmplY3QgQm9vbGVhbl1cIixxPVwiW29iamVjdCBEYXRlXVwiLFA9XCJbb2JqZWN0IEVycm9yXVwiLEs9XCJbb2JqZWN0IEZ1bmN0aW9uXVwiLFY9XCJbb2JqZWN0IE51bWJlcl1cIixZPVwiW29iamVjdCBPYmplY3RdXCIsWj1cIltvYmplY3QgUmVnRXhwXVwiLEc9XCJbb2JqZWN0IFN0cmluZ11cIixKPVwiW29iamVjdCBBcnJheUJ1ZmZlcl1cIixYPVwiW29iamVjdCBGbG9hdDMyQXJyYXldXCIsSD1cIltvYmplY3QgRmxvYXQ2NEFycmF5XVwiLFE9XCJbb2JqZWN0IEludDhBcnJheV1cIixudD1cIltvYmplY3QgSW50MTZBcnJheV1cIix0dD1cIltvYmplY3QgSW50MzJBcnJheV1cIixydD1cIltvYmplY3QgVWludDhBcnJheV1cIixldD1cIltvYmplY3QgVWludDhDbGFtcGVkQXJyYXldXCIsdXQ9XCJbb2JqZWN0IFVpbnQxNkFycmF5XVwiLG90PVwiW29iamVjdCBVaW50MzJBcnJheV1cIixpdD0vXFxiX19wXFwrPScnOy9nLGZ0PS9cXGIoX19wXFwrPSknJ1xcKy9nLGF0PS8oX19lXFwoLio/XFwpfFxcYl9fdFxcKSlcXCsnJzsvZyxjdD0vJig/OmFtcHxsdHxndHxxdW90fCMzOXwjOTYpOy9nLGx0PS9bJjw+XCInYF0vZyxzdD1SZWdFeHAoY3Quc291cmNlKSxwdD1SZWdFeHAobHQuc291cmNlKSxodD0vPCUtKFtcXHNcXFNdKz8pJT4vZyxfdD0vPCUoW1xcc1xcU10rPyklPi9nLGd0PS88JT0oW1xcc1xcU10rPyklPi9nLHZ0PS9cXCRcXHsoW15cXFxcfV0qKD86XFxcXC5bXlxcXFx9XSopKilcXH0vZyx5dD0vXFx3KiQvLGR0PS9eXFxzKmZ1bmN0aW9uWyBcXG5cXHJcXHRdK1xcdy8sbXQ9L14wW3hYXS8sd3Q9L15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLyxidD0vW1xceGMwLVxceGQ2XFx4ZDgtXFx4ZGVcXHhkZi1cXHhmNlxceGY4LVxceGZmXS9nLHh0PS8oJF4pLyxBdD0vWy4qKz9eJHt9KCl8W1xcXVxcL1xcXFxdL2csanQ9UmVnRXhwKEF0LnNvdXJjZSksa3Q9L1xcYnRoaXNcXGIvLEV0PS9bJ1xcblxcclxcdTIwMjhcXHUyMDI5XFxcXF0vZyxSdD1SZWdFeHAoXCJbQS1aXFxcXHhjMC1cXFxceGQ2XFxcXHhkOC1cXFxceGRlXXsyLH0oPz1bQS1aXFxcXHhjMC1cXFxceGQ2XFxcXHhkOC1cXFxceGRlXVthLXpcXFxceGRmLVxcXFx4ZjZcXFxceGY4LVxcXFx4ZmZdKyl8W0EtWlxcXFx4YzAtXFxcXHhkNlxcXFx4ZDgtXFxcXHhkZV0/W2EtelxcXFx4ZGYtXFxcXHhmNlxcXFx4ZjgtXFxcXHhmZl0rfFtBLVpcXFxceGMwLVxcXFx4ZDZcXFxceGQ4LVxcXFx4ZGVdK3xbMC05XStcIixcImdcIiksSXQ9XCIgXFx0XFx4MGJcXGZcXHhhMFxcdWZlZmZcXG5cXHJcXHUyMDI4XFx1MjAyOVxcdTE2ODBcXHUxODBlXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMGFcXHUyMDJmXFx1MjA1ZlxcdTMwMDBcIixPdD1cIkFycmF5IEFycmF5QnVmZmVyIERhdGUgRXJyb3IgRmxvYXQzMkFycmF5IEZsb2F0NjRBcnJheSBGdW5jdGlvbiBJbnQ4QXJyYXkgSW50MTZBcnJheSBJbnQzMkFycmF5IE1hdGggTnVtYmVyIE9iamVjdCBSZWdFeHAgU2V0IFN0cmluZyBfIGNsZWFyVGltZW91dCBkb2N1bWVudCBpc0Zpbml0ZSBwYXJzZUludCBzZXRUaW1lb3V0IFR5cGVFcnJvciBVaW50OEFycmF5IFVpbnQ4Q2xhbXBlZEFycmF5IFVpbnQxNkFycmF5IFVpbnQzMkFycmF5IFdlYWtNYXAgd2luZG93IFdpblJURXJyb3JcIi5zcGxpdChcIiBcIiksQ3Q9e307XG5DdFtYXT1DdFtIXT1DdFtRXT1DdFtudF09Q3RbdHRdPUN0W3J0XT1DdFtldF09Q3RbdXRdPUN0W290XT10cnVlLEN0W3pdPUN0W0RdPUN0W0pdPUN0W01dPUN0W3FdPUN0W1BdPUN0W0tdPUN0W1wiW29iamVjdCBNYXBdXCJdPUN0W1ZdPUN0W1ldPUN0W1pdPUN0W1wiW29iamVjdCBTZXRdXCJdPUN0W0ddPUN0W1wiW29iamVjdCBXZWFrTWFwXVwiXT1mYWxzZTt2YXIgVHQ9e307VHRbel09VHRbRF09VHRbSl09VHRbTV09VHRbcV09VHRbWF09VHRbSF09VHRbUV09VHRbbnRdPVR0W3R0XT1UdFtWXT1UdFtZXT1UdFtaXT1UdFtHXT1UdFtydF09VHRbZXRdPVR0W3V0XT1UdFtvdF09dHJ1ZSxUdFtQXT1UdFtLXT1UdFtcIltvYmplY3QgTWFwXVwiXT1UdFtcIltvYmplY3QgU2V0XVwiXT1UdFtcIltvYmplY3QgV2Vha01hcF1cIl09ZmFsc2U7dmFyIFN0PXtsZWFkaW5nOmZhbHNlLG1heFdhaXQ6MCx0cmFpbGluZzpmYWxzZX0sV3Q9e1wiXFx4YzBcIjpcIkFcIixcIlxceGMxXCI6XCJBXCIsXCJcXHhjMlwiOlwiQVwiLFwiXFx4YzNcIjpcIkFcIixcIlxceGM0XCI6XCJBXCIsXCJcXHhjNVwiOlwiQVwiLFwiXFx4ZTBcIjpcImFcIixcIlxceGUxXCI6XCJhXCIsXCJcXHhlMlwiOlwiYVwiLFwiXFx4ZTNcIjpcImFcIixcIlxceGU0XCI6XCJhXCIsXCJcXHhlNVwiOlwiYVwiLFwiXFx4YzdcIjpcIkNcIixcIlxceGU3XCI6XCJjXCIsXCJcXHhkMFwiOlwiRFwiLFwiXFx4ZjBcIjpcImRcIixcIlxceGM4XCI6XCJFXCIsXCJcXHhjOVwiOlwiRVwiLFwiXFx4Y2FcIjpcIkVcIixcIlxceGNiXCI6XCJFXCIsXCJcXHhlOFwiOlwiZVwiLFwiXFx4ZTlcIjpcImVcIixcIlxceGVhXCI6XCJlXCIsXCJcXHhlYlwiOlwiZVwiLFwiXFx4Y2NcIjpcIklcIixcIlxceGNkXCI6XCJJXCIsXCJcXHhjZVwiOlwiSVwiLFwiXFx4Y2ZcIjpcIklcIixcIlxceGVjXCI6XCJpXCIsXCJcXHhlZFwiOlwiaVwiLFwiXFx4ZWVcIjpcImlcIixcIlxceGVmXCI6XCJpXCIsXCJcXHhkMVwiOlwiTlwiLFwiXFx4ZjFcIjpcIm5cIixcIlxceGQyXCI6XCJPXCIsXCJcXHhkM1wiOlwiT1wiLFwiXFx4ZDRcIjpcIk9cIixcIlxceGQ1XCI6XCJPXCIsXCJcXHhkNlwiOlwiT1wiLFwiXFx4ZDhcIjpcIk9cIixcIlxceGYyXCI6XCJvXCIsXCJcXHhmM1wiOlwib1wiLFwiXFx4ZjRcIjpcIm9cIixcIlxceGY1XCI6XCJvXCIsXCJcXHhmNlwiOlwib1wiLFwiXFx4ZjhcIjpcIm9cIixcIlxceGQ5XCI6XCJVXCIsXCJcXHhkYVwiOlwiVVwiLFwiXFx4ZGJcIjpcIlVcIixcIlxceGRjXCI6XCJVXCIsXCJcXHhmOVwiOlwidVwiLFwiXFx4ZmFcIjpcInVcIixcIlxceGZiXCI6XCJ1XCIsXCJcXHhmY1wiOlwidVwiLFwiXFx4ZGRcIjpcIllcIixcIlxceGZkXCI6XCJ5XCIsXCJcXHhmZlwiOlwieVwiLFwiXFx4YzZcIjpcIkFlXCIsXCJcXHhlNlwiOlwiYWVcIixcIlxceGRlXCI6XCJUaFwiLFwiXFx4ZmVcIjpcInRoXCIsXCJcXHhkZlwiOlwic3NcIn0sTnQ9e1wiJlwiOlwiJmFtcDtcIixcIjxcIjpcIiZsdDtcIixcIj5cIjpcIiZndDtcIiwnXCInOlwiJnF1b3Q7XCIsXCInXCI6XCImIzM5O1wiLFwiYFwiOlwiJiM5NjtcIn0sVXQ9e1wiJmFtcDtcIjpcIiZcIixcIiZsdDtcIjpcIjxcIixcIiZndDtcIjpcIj5cIixcIiZxdW90O1wiOidcIicsXCImIzM5O1wiOlwiJ1wiLFwiJiM5NjtcIjpcImBcIn0sRnQ9e1wiZnVuY3Rpb25cIjp0cnVlLG9iamVjdDp0cnVlfSxMdD17XCJcXFxcXCI6XCJcXFxcXCIsXCInXCI6XCInXCIsXCJcXG5cIjpcIm5cIixcIlxcclwiOlwiclwiLFwiXFx1MjAyOFwiOlwidTIwMjhcIixcIlxcdTIwMjlcIjpcInUyMDI5XCJ9LCR0PUZ0W3R5cGVvZiB3aW5kb3ddJiZ3aW5kb3chPT0odGhpcyYmdGhpcy53aW5kb3cpP3dpbmRvdzp0aGlzLEJ0PUZ0W3R5cGVvZiBleHBvcnRzXSYmZXhwb3J0cyYmIWV4cG9ydHMubm9kZVR5cGUmJmV4cG9ydHMsRnQ9RnRbdHlwZW9mIG1vZHVsZV0mJm1vZHVsZSYmIW1vZHVsZS5ub2RlVHlwZSYmbW9kdWxlLHp0PUJ0JiZGdCYmdHlwZW9mIGdsb2JhbD09XCJvYmplY3RcIiYmZ2xvYmFsO1xuIXp0fHx6dC5nbG9iYWwhPT16dCYmenQud2luZG93IT09enQmJnp0LnNlbGYhPT16dHx8KCR0PXp0KTt2YXIgenQ9RnQmJkZ0LmV4cG9ydHM9PT1CdCYmQnQsRHQ9bSgpO3R5cGVvZiBkZWZpbmU9PVwiZnVuY3Rpb25cIiYmdHlwZW9mIGRlZmluZS5hbWQ9PVwib2JqZWN0XCImJmRlZmluZS5hbWQ/KCR0Ll89RHQsIGRlZmluZShmdW5jdGlvbigpe3JldHVybiBEdH0pKTpCdCYmRnQ/enQ/KEZ0LmV4cG9ydHM9RHQpLl89RHQ6QnQuXz1EdDokdC5fPUR0fSkuY2FsbCh0aGlzKTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnYXJjaGl2ZScsIGZ1bmN0aW9uIChEYXRhKSB7XG5cdHZhciBhcmNoaXZlID0ge307XG5cblx0YXJjaGl2ZS5zZW5kRXh0ZXJuYWxVUkwgPSBmdW5jdGlvbihleHRlcm5hbFVSTCwgdGFncykge1xuXHRcdHJldHVybiBEYXRhLnBvc3RBcmNoaXZlSW1hZ2UoZXh0ZXJuYWxVUkwsIHRhZ3MpO1xuXHR9O1xuXG5cdHJldHVybiBhcmNoaXZlO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2NhY2hlJywgZnVuY3Rpb24gKCRxLCAkbG9nLCBEYXRhKSB7XG5cdHZhciBjYWNoZSA9IHt9O1xuXG5cdHZhciBsaWJyYXJ5ID0gbnVsbDtcblx0dmFyIHNlY3Rpb25zID0ge307XG5cdHZhciBib29rcyA9IHt9O1xuXHR2YXIgaW1hZ2VzID0ge307XG5cblx0Y2FjaGUuaW5pdCA9IGZ1bmN0aW9uKGxpYnJhcnlNb2RlbCwgc2VjdGlvbk1vZGVscywgYm9va01vZGVscywgaW1hZ2VVcmxzKSB7XG5cdFx0dmFyIGxpYnJhcnlMb2FkID0gbG9hZExpYnJhcnlEYXRhKGxpYnJhcnlNb2RlbCk7XG5cdFx0dmFyIHNlY3Rpb25zTG9hZCA9IFtdO1xuXHRcdHZhciBib29rc0xvYWQgPSBbXTtcblx0XHR2YXIgaW1hZ2VzTG9hZCA9IFtdO1xuXHRcdHZhciBtb2RlbCwgdXJsOyAvLyBpdGVyYXRvcnNcblxuXHRcdGZvciAobW9kZWwgaW4gc2VjdGlvbk1vZGVscykge1xuXHRcdFx0c2VjdGlvbnNMb2FkLnB1c2goYWRkU2VjdGlvbihtb2RlbCkpO1xuXHRcdH1cblxuXHRcdGZvciAobW9kZWwgaW4gYm9va01vZGVscykge1xuXHRcdFx0Ym9va3NMb2FkLnB1c2goYWRkQm9vayhtb2RlbCkpO1xuXHRcdH1cblxuXHRcdGZvciAodXJsIGluIGltYWdlVXJscykge1xuXHRcdFx0aW1hZ2VzTG9hZC5wdXNoKGFkZEltYWdlKHVybCkpO1xuXHRcdH1cblxuXHRcdHZhciBwcm9taXNlID0gJHEuYWxsKHtcblx0XHRcdGxpYnJhcnlDYWNoZTogbGlicmFyeUxvYWQsIFxuXHRcdFx0c2VjdGlvbnNMb2FkOiAkcS5hbGwoc2VjdGlvbnNMb2FkKSwgXG5cdFx0XHRib29rc0xvYWQ6ICRxLmFsbChib29rc0xvYWQpLFxuXHRcdFx0aW1hZ2VzTG9hZDogJHEuYWxsKGltYWdlc0xvYWQpXG5cdFx0fSkudGhlbihmdW5jdGlvbiAocmVzdWx0cykge1xuXHRcdFx0bGlicmFyeSA9IHJlc3VsdHMubGlicmFyeUNhY2hlO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0Y2FjaGUuZ2V0TGlicmFyeSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBsaWJyYXJ5O1xuXHR9O1xuXG5cdGNhY2hlLmdldFNlY3Rpb24gPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBjb21tb25HZXR0ZXIoc2VjdGlvbnMsIG1vZGVsLCBhZGRTZWN0aW9uKTtcblx0fTtcblxuXHRjYWNoZS5nZXRCb29rID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHRyZXR1cm4gY29tbW9uR2V0dGVyKGJvb2tzLCBtb2RlbCwgYWRkQm9vayk7XG5cdH07XG5cblx0Y2FjaGUuZ2V0SW1hZ2UgPSBmdW5jdGlvbih1cmwpIHtcblx0XHRyZXR1cm4gY29tbW9uR2V0dGVyKGltYWdlcywgdXJsLCBhZGRJbWFnZSk7XG5cdH07XG5cblx0dmFyIGNvbW1vbkdldHRlciA9IGZ1bmN0aW9uKGZyb20sIGtleSwgYWRkRnVuY3Rpb24pIHtcblx0XHR2YXIgcmVzdWx0ID0gZnJvbVtrZXldO1xuXG5cdFx0aWYoIXJlc3VsdCkge1xuXHRcdFx0cmVzdWx0ID0gYWRkRnVuY3Rpb24oa2V5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gJHEud2hlbihyZXN1bHQpO1xuXHR9O1xuXG5cdHZhciBjb21tb25BZGRlciA9IGZ1bmN0aW9uKHdoZXJlLCB3aGF0LCBsb2FkZXIsIGtleSkge1xuXHRcdHZhciBwcm9taXNlID0gbG9hZGVyKHdoYXQpLnRoZW4oZnVuY3Rpb24gKGxvYWRlZENhY2hlKSB7XG5cdFx0XHR3aGVyZVtrZXkgfHwgd2hhdF0gPSBsb2FkZWRDYWNoZTtcblxuXHRcdFx0cmV0dXJuIGxvYWRlZENhY2hlO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIGFkZFNlY3Rpb24gPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBjb21tb25BZGRlcihzZWN0aW9ucywgbW9kZWwsIGxvYWRTZWN0aW9uRGF0YSk7XG5cdH07XG5cblx0dmFyIGFkZEJvb2sgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBjb21tb25BZGRlcihib29rcywgbW9kZWwsIGxvYWRCb29rRGF0YSk7XG5cdH07XG5cblx0dmFyIGFkZEltYWdlID0gZnVuY3Rpb24odXJsKSB7XG5cdFx0cmV0dXJuIGNvbW1vbkFkZGVyKGltYWdlcywgJy9vdXRzaWRlP2xpbms9JyArIHVybCwgRGF0YS5sb2FkSW1hZ2UsIHVybCkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0XHQkbG9nLmVycm9yKCdFcnJvciBhZGRpbmcgaW1hZ2U6JywgdXJsKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBsb2FkTGlicmFyeURhdGEgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHZhciBwYXRoID0gJy9vYmovbGlicmFyaWVzL3ttb2RlbH0vJy5yZXBsYWNlKCd7bW9kZWx9JywgbW9kZWwpO1xuICAgICAgICB2YXIgbW9kZWxVcmwgPSBwYXRoICsgJ21vZGVsLmpzb24nO1xuICAgICAgICB2YXIgbWFwVXJsID0gcGF0aCArICdtYXAuanBnJztcblxuICAgICAgICB2YXIgcHJvbWlzZSA9ICRxLmFsbCh7XG4gICAgICAgIFx0Z2VvbWV0cnk6IERhdGEubG9hZEdlb21ldHJ5KG1vZGVsVXJsKSwgXG4gICAgICAgIFx0bWFwSW1hZ2U6IERhdGEubG9hZEltYWdlKG1hcFVybClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIGxvYWRTZWN0aW9uRGF0YSA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0dmFyIHBhdGggPSAnL29iai9zZWN0aW9ucy97bW9kZWx9LycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKTtcbiAgICAgICAgdmFyIG1vZGVsVXJsID0gcGF0aCArICdtb2RlbC5qcyc7XG4gICAgICAgIHZhciBtYXBVcmwgPSBwYXRoICsgJ21hcC5qcGcnO1xuICAgICAgICB2YXIgZGF0YVVybCA9IHBhdGggKyAnZGF0YS5qc29uJztcblxuICAgICAgICB2YXIgcHJvbWlzZSA9ICRxLmFsbCh7XG4gICAgICAgIFx0Z2VvbWV0cnk6IERhdGEubG9hZEdlb21ldHJ5KG1vZGVsVXJsKSwgXG4gICAgICAgIFx0bWFwSW1hZ2U6IERhdGEubG9hZEltYWdlKG1hcFVybCksIFxuICAgICAgICBcdGRhdGE6IERhdGEuZ2V0RGF0YShkYXRhVXJsKVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgbG9hZEJvb2tEYXRhID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHR2YXIgcGF0aCA9ICcvb2JqL2Jvb2tzL3ttb2RlbH0vJy5yZXBsYWNlKCd7bW9kZWx9JywgbW9kZWwpO1xuICAgICAgICB2YXIgbW9kZWxVcmwgPSBwYXRoICsgJ21vZGVsLmpzJztcbiAgICAgICAgdmFyIG1hcFVybCA9IHBhdGggKyAnbWFwLmpwZyc7XG5cbiAgICAgICAgdmFyIHByb21pc2UgPSAkcS5hbGwoe1xuICAgICAgICBcdGdlb21ldHJ5OiBEYXRhLmxvYWRHZW9tZXRyeShtb2RlbFVybCksXG4gICAgICAgIFx0bWFwSW1hZ2U6IERhdGEubG9hZEltYWdlKG1hcFVybCkgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHJldHVybiBjYWNoZTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdDYW1lcmEnLCBmdW5jdGlvbiAoQ2FtZXJhT2JqZWN0KSB7XG5cdHZhciBDYW1lcmEgPSB7XG5cdFx0SEVJR1RIOiAxLjUsXG5cdFx0b2JqZWN0OiBuZXcgQ2FtZXJhT2JqZWN0KCksXG5cdFx0c2V0UGFyZW50OiBmdW5jdGlvbihwYXJlbnQpIHtcblx0XHRcdHBhcmVudC5hZGQodGhpcy5vYmplY3QpO1xuXHRcdH0sXG5cdFx0Z2V0UG9zaXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMub2JqZWN0LnBvc2l0aW9uO1xuXHRcdH1cblx0fTtcblxuXHRDYW1lcmEuaW5pdCA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcblx0XHRDYW1lcmEuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDQ1LCB3aWR0aCAvIGhlaWdodCwgMC4wMSwgNTApO1xuXHRcdHRoaXMub2JqZWN0LnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgQ2FtZXJhLkhFSUdUSCwgMCk7XG5cdFx0dGhpcy5vYmplY3Qucm90YXRpb24ub3JkZXIgPSAnWVhaJztcblxuXHRcdHZhciBjYW5kbGUgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDY2NTU1NSwgMS42LCAxMCk7XG5cdFx0Y2FuZGxlLnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcblx0XHR0aGlzLm9iamVjdC5hZGQoY2FuZGxlKTtcblxuXHRcdHRoaXMub2JqZWN0LmFkZChDYW1lcmEuY2FtZXJhKTtcblx0fTtcblxuXHRDYW1lcmEucm90YXRlID0gZnVuY3Rpb24oeCwgeSkge1xuXHRcdHZhciBuZXdYID0gdGhpcy5vYmplY3Qucm90YXRpb24ueCArIHkgKiAwLjAwMDEgfHwgMDtcblx0XHR2YXIgbmV3WSA9IHRoaXMub2JqZWN0LnJvdGF0aW9uLnkgKyB4ICogMC4wMDAxIHx8IDA7XG5cblx0XHRpZihuZXdYIDwgMS41NyAmJiBuZXdYID4gLTEuNTcpIHtcdFxuXHRcdFx0dGhpcy5vYmplY3Qucm90YXRpb24ueCA9IG5ld1g7XG5cdFx0fVxuXG5cdFx0dGhpcy5vYmplY3Qucm90YXRpb24ueSA9IG5ld1k7XG5cdH07XG5cblx0Q2FtZXJhLmdvID0gZnVuY3Rpb24oc3BlZWQpIHtcblx0XHR2YXIgZGlyZWN0aW9uID0gdGhpcy5nZXRWZWN0b3IoKTtcblx0XHR2YXIgbmV3UG9zaXRpb24gPSB0aGlzLm9iamVjdC5wb3NpdGlvbi5jbG9uZSgpO1xuXHRcdG5ld1Bvc2l0aW9uLmFkZChkaXJlY3Rpb24ubXVsdGlwbHlTY2FsYXIoc3BlZWQpKTtcblxuXHRcdHRoaXMub2JqZWN0Lm1vdmUobmV3UG9zaXRpb24pO1xuXHR9O1xuXG5cdENhbWVyYS5nZXRWZWN0b3IgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgLTEpO1xuXG5cdFx0cmV0dXJuIHZlY3Rvci5hcHBseUV1bGVyKHRoaXMub2JqZWN0LnJvdGF0aW9uKTtcblx0fTtcblxuXHRyZXR1cm4gQ2FtZXJhO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLyogXG4gKiBjb250cm9scy5qcyBpcyBhIHNlcnZpY2UgZm9yIHByb2Nlc3Npbmcgbm90IFVJKG1lbnVzKSBldmVudHMgXG4gKiBsaWtlIG1vdXNlLCBrZXlib2FyZCwgdG91Y2ggb3IgZ2VzdHVyZXMuXG4gKlxuICogVE9ETzogcmVtb3ZlIGFsbCBidXNpbmVzIGxvZ2ljIGZyb20gdGhlcmUgYW5kIGxlYXZlIG9ubHlcbiAqIGV2ZW50cyBmdW5jdGlvbmFsaXR5IHRvIG1ha2UgaXQgbW9yZSBzaW1pbGFyIHRvIHVzdWFsIGNvbnRyb2xsZXJcbiAqL1xuLmZhY3RvcnkoJ0NvbnRyb2xzJywgZnVuY3Rpb24gKCRxLCAkbG9nLCBTZWxlY3Rvck1ldGEsIEJvb2tPYmplY3QsIFNoZWxmT2JqZWN0LCBTZWN0aW9uT2JqZWN0LCBDYW1lcmEsIERhdGEsIG5hdmlnYXRpb24sIGVudmlyb25tZW50LCBtb3VzZSwgc2VsZWN0b3IpIHtcblx0dmFyIENvbnRyb2xzID0ge307XG5cblx0Q29udHJvbHMuQlVUVE9OU19ST1RBVEVfU1BFRUQgPSAxMDA7XG5cdENvbnRyb2xzLkJVVFRPTlNfR09fU1BFRUQgPSAwLjAyO1xuXG5cdENvbnRyb2xzLlBvY2tldCA9IHtcblx0XHRfYm9va3M6IHt9LFxuXG5cdFx0c2VsZWN0T2JqZWN0OiBmdW5jdGlvbih0YXJnZXQpIHtcblx0XHRcdHZhciBcblx0XHRcdFx0ZGF0YU9iamVjdCA9IHRoaXMuX2Jvb2tzW3RhcmdldC52YWx1ZV1cblxuXHRcdFx0RGF0YS5jcmVhdGVCb29rKGRhdGFPYmplY3QsIGZ1bmN0aW9uIChib29rLCBkYXRhT2JqZWN0KSB7XG5cdFx0XHRcdENvbnRyb2xzLlBvY2tldC5yZW1vdmUoZGF0YU9iamVjdC5pZCk7XG5cdFx0XHRcdENvbnRyb2xzLnNlbGVjdGVkLnNlbGVjdChib29rLCBudWxsKTtcblx0XHRcdFx0Ly8gYm9vay5jaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0cmVtb3ZlOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0dGhpcy5fYm9va3NbaWRdID0gbnVsbDtcblx0XHRcdGRlbGV0ZSB0aGlzLl9ib29rc1tpZF07XG5cdFx0fSxcblx0XHRwdXQ6IGZ1bmN0aW9uKGRhdGFPYmplY3QpIHtcblx0XHRcdHRoaXMuX2Jvb2tzW2RhdGFPYmplY3QuaWRdID0gZGF0YU9iamVjdDtcblx0XHR9LFxuXHRcdGdldEJvb2tzOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9ib29rcztcblx0XHR9LFxuXHRcdGlzRW1wdHk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Jvb2tzLmxlbmd0aCA9PSAwO1xuXHRcdH1cblx0fTtcblxuXHRDb250cm9scy5zZWxlY3RlZCA9IHtcblx0XHRvYmplY3Q6IG51bGwsXG5cdFx0Ly8gcGFyZW50OiBudWxsLFxuXHRcdGdldHRlZDogbnVsbCxcblx0XHQvLyBwb2ludDogbnVsbCxcblxuXHRcdGlzQm9vazogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZEJvb2soKTtcblx0XHR9LFxuXHRcdGlzU2VjdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZFNlY3Rpb24oKTtcblx0XHR9LFxuXHRcdGlzU2hlbGY6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHNlbGVjdG9yLmlzU2VsZWN0ZWRTaGVsZigpO1xuXHRcdH0sXG5cdFx0aXNNb3ZhYmxlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBCb29sZWFuKHRoaXMuaXNCb29rKCkgfHwgdGhpcy5pc1NlY3Rpb24oKSk7XG5cdFx0fSxcblx0XHRpc1JvdGF0YWJsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gQm9vbGVhbih0aGlzLmlzU2VjdGlvbigpKTtcblx0XHR9LFxuXHRcdGNsZWFyOiBmdW5jdGlvbigpIHtcblx0XHRcdHNlbGVjdG9yLnVuc2VsZWN0KCk7XG5cdFx0XHR0aGlzLm9iamVjdCA9IG51bGw7XG5cdFx0XHR0aGlzLmdldHRlZCA9IG51bGw7XG5cdFx0fSxcblx0XHRzZWxlY3Q6IGZ1bmN0aW9uKCkge1xuXHRcdFx0c2VsZWN0b3Iuc2VsZWN0Rm9jdXNlZCgpO1xuXG5cdFx0XHQvLyB0aGlzLmNsZWFyKCk7XG5cdFx0XHR0aGlzLm9iamVjdCA9IHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0KCk7XG5cdFx0XHQvLyB0aGlzLnBvaW50ID0gcG9pbnQ7XG5cblx0XHR9LFxuXHRcdHJlbGVhc2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGVjdGVkT2JqZWN0ID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcblx0XHRcdC8vVE9ETzogdGhlcmUgaXMgbm8gc2VsZWN0ZWQgb2JqZWN0IGFmdGVyIHJlbW92ZSBmcm9tZSBzY2VuZVxuXHRcdFx0aWYodGhpcy5pc0Jvb2soKSAmJiAhc2VsZWN0ZWRPYmplY3QucGFyZW50KSB7XG5cdFx0XHRcdENvbnRyb2xzLlBvY2tldC5wdXQoc2VsZWN0ZWRPYmplY3QuZGF0YU9iamVjdCk7XG5cdFx0XHRcdHRoaXMuY2xlYXIoKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5zYXZlKCk7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gaWYodGhpcy5pc0Jvb2soKSAmJiAhdGhpcy5pc0dldHRlZCgpKSB7XG5cdFx0XHQvLyBcdHRoaXMuZ2V0dGVkID0gdHJ1ZTtcblx0XHRcdC8vIFx0dGhpcy5wYXJlbnQgPSB0aGlzLm9iamVjdC5wYXJlbnQ7XG5cdFx0XHQvLyBcdHRoaXMub2JqZWN0LnBvc2l0aW9uLnNldCgwLCAwLCAtdGhpcy5vYmplY3QuZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnogLSAwLjI1KTtcblx0XHRcdC8vIFx0Q2FtZXJhLmNhbWVyYS5hZGQodGhpcy5vYmplY3QpO1x0XHRcdFxuXHRcdFx0Ly8gfSBlbHNlIHtcblx0XHRcdC8vIFx0dGhpcy5wdXQoKTtcblx0XHRcdC8vIH1cblx0XHR9LFxuXHRcdHB1dDogZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBpZih0aGlzLmlzR2V0dGVkKCkpIHtcblx0XHRcdC8vIFx0dGhpcy5wYXJlbnQuYWRkKHRoaXMub2JqZWN0KTtcblx0XHRcdC8vIFx0dGhpcy5vYmplY3QucmVsb2FkKCk7Ly9wb3NpdGlvblxuXHRcdFx0Ly8gXHR0aGlzLmNsZWFyKCk7XG5cdFx0XHQvLyB9XG5cdFx0fSxcblx0XHRpc0dldHRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pc0Jvb2soKSAmJiB0aGlzLmdldHRlZDtcblx0XHR9LFxuXHRcdHNhdmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGVjdGVkT2JqZWN0ID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcblx0XHRcdGlmKHRoaXMuaXNNb3ZhYmxlKCkgJiYgc2VsZWN0ZWRPYmplY3QuY2hhbmdlZCkge1xuXHRcdFx0XHRzZWxlY3RlZE9iamVjdC5zYXZlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdENvbnRyb2xzLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRDb250cm9scy5jbGVhcigpO1xuXHRcdENvbnRyb2xzLmluaXRMaXN0ZW5lcnMoKTtcblx0fTtcblxuXHRDb250cm9scy5pbml0TGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBDb250cm9scy5vbkRibENsaWNrLCBmYWxzZSk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgQ29udHJvbHMub25Nb3VzZURvd24sIGZhbHNlKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgQ29udHJvbHMub25Nb3VzZVVwLCBmYWxzZSk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgQ29udHJvbHMub25Nb3VzZU1vdmUsIGZhbHNlKTtcdFxuXHRcdGRvY3VtZW50Lm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbigpIHtyZXR1cm4gZmFsc2U7fVxuXHR9O1xuXG5cdENvbnRyb2xzLmNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdFx0Q29udHJvbHMuc2VsZWN0ZWQuY2xlYXIoKTtcdFxuXHR9O1xuXG5cdENvbnRyb2xzLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKCFDb250cm9scy5zZWxlY3RlZC5pc0dldHRlZCgpKSB7XG5cdFx0XHRpZihtb3VzZVszXSkge1xuXHRcdFx0XHRDYW1lcmEucm90YXRlKG1vdXNlLmxvbmdYLCBtb3VzZS5sb25nWSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKChtb3VzZVsxXSAmJiBtb3VzZVszXSkgfHwgbmF2aWdhdGlvbi5zdGF0ZS5mb3J3YXJkKSB7XG5cdFx0XHRcdENhbWVyYS5nbyh0aGlzLkJVVFRPTlNfR09fU1BFRUQpO1xuXHRcdFx0fSBlbHNlIGlmKG5hdmlnYXRpb24uc3RhdGUuYmFja3dhcmQpIHtcblx0XHRcdFx0Q2FtZXJhLmdvKC10aGlzLkJVVFRPTlNfR09fU1BFRUQpO1xuXHRcdFx0fSBlbHNlIGlmKG5hdmlnYXRpb24uc3RhdGUubGVmdCkge1xuXHRcdFx0XHRDYW1lcmEucm90YXRlKHRoaXMuQlVUVE9OU19ST1RBVEVfU1BFRUQsIDApO1xuXHRcdFx0fSBlbHNlIGlmKG5hdmlnYXRpb24uc3RhdGUucmlnaHQpIHtcblx0XHRcdFx0Q2FtZXJhLnJvdGF0ZSgtdGhpcy5CVVRUT05TX1JPVEFURV9TUEVFRCwgMCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEV2ZW50c1xuXG5cdENvbnRyb2xzLm9uRGJsQ2xpY2sgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmKG1vdXNlLmlzQ2FudmFzKCkpIHtcblx0XHRcdHN3aXRjaChldmVudC53aGljaCkge1xuXHRcdFx0XHRjYXNlIDE6IENvbnRyb2xzLnNlbGVjdGVkLmdldCgpOyBicmVhaztcblx0XHRcdH0gICBcdFxuXHRcdH1cblx0fTtcblxuXHRDb250cm9scy5vbk1vdXNlRG93biA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0bW91c2UuZG93bihldmVudCk7IFxuXG5cdFx0aWYobW91c2UuaXNDYW52YXMoKSB8fCBtb3VzZS5pc1BvY2tldEJvb2soKSkge1xuXHRcdFx0Ly8gZXZlbnQucHJldmVudERlZmF1bHQoKTsvL1RPRE86IHJlc2VhcmNoIChlbmFibGVkIGNhbm5vdCBzZXQgY3Vyc29yIHRvIGlucHV0KVxuXG5cdFx0XHRpZihtb3VzZVsxXSAmJiAhbW91c2VbM10gJiYgIUNvbnRyb2xzLnNlbGVjdGVkLmlzR2V0dGVkKCkpIHtcblx0XHRcdFx0aWYobW91c2UuaXNDYW52YXMoKSkge1xuXHRcdFx0XHRcdENvbnRyb2xzLnNlbGVjdE9iamVjdCgpO1xuXHRcdFx0XHRcdENvbnRyb2xzLnNlbGVjdGVkLnNlbGVjdCgpO1xuXHRcdFx0XHR9IGVsc2UgaWYobW91c2UuaXNQb2NrZXRCb29rKCkpIHtcblx0XHRcdFx0XHRDb250cm9scy5Qb2NrZXQuc2VsZWN0T2JqZWN0KG1vdXNlLnRhcmdldCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Q29udHJvbHMub25Nb3VzZVVwID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRtb3VzZS51cChldmVudCk7XG5cdFx0XG5cdFx0c3dpdGNoKGV2ZW50LndoaWNoKSB7XG5cdFx0XHQgY2FzZSAxOiBDb250cm9scy5zZWxlY3RlZC5yZWxlYXNlKCk7IGJyZWFrO1xuXHRcdH1cblx0fTtcblxuXHRDb250cm9scy5vbk1vdXNlTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0bW91c2UubW92ZShldmVudCk7XG5cblx0XHRpZihtb3VzZS5pc0NhbnZhcygpKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0IFx0aWYoIUNvbnRyb2xzLnNlbGVjdGVkLmlzR2V0dGVkKCkpIHtcblx0XHRcdFx0aWYobW91c2VbMV0gJiYgIW1vdXNlWzNdKSB7XHRcdFxuXHRcdFx0XHRcdENvbnRyb2xzLm1vdmVPYmplY3QoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRDb250cm9scy5zZWxlY3RPYmplY3QoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gdmFyIG9iaiA9IENvbnRyb2xzLnNlbGVjdGVkLm9iamVjdDtcblxuXHRcdFx0XHQvLyBpZihvYmogaW5zdGFuY2VvZiBCb29rT2JqZWN0KSB7XG5cdFx0XHRcdC8vIFx0aWYobW91c2VbMV0pIHtcblx0XHRcdFx0Ly8gXHRcdG9iai5tb3ZlRWxlbWVudChtb3VzZS5kWCwgbW91c2UuZFksIFVJLm1lbnUuY3JlYXRlQm9vay5lZGl0ZWQpO1xuXHRcdFx0XHQvLyBcdH1cblx0XHRcdFx0Ly8gXHRpZihtb3VzZVsyXSAmJiBVSS5tZW51LmNyZWF0ZUJvb2suZWRpdGVkID09ICdjb3ZlcicpIHtcblx0XHRcdFx0Ly8gIFx0XHRvYmouc2NhbGVFbGVtZW50KG1vdXNlLmRYLCBtb3VzZS5kWSk7XG5cdFx0XHRcdC8vIFx0fVxuXHRcdFx0XHQvLyBcdGlmKG1vdXNlWzNdKSB7XG5cdFx0XHRcdC8vICBcdFx0b2JqLnJvdGF0ZShtb3VzZS5kWCwgbW91c2UuZFksIHRydWUpO1xuXHRcdFx0XHQvLyBcdH1cblx0XHRcdFx0Ly8gfSBcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8qKioqXG5cblx0Q29udHJvbHMuc2VsZWN0T2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyXG5cdFx0XHRpbnRlcnNlY3RlZCxcblx0XHRcdG9iamVjdDtcblxuXHRcdGlmKG1vdXNlLmlzQ2FudmFzKCkgJiYgZW52aXJvbm1lbnQubGlicmFyeSkge1xuXHRcdFx0Ly9UT0RPOiBvcHRpbWl6ZVxuXHRcdFx0aW50ZXJzZWN0ZWQgPSBtb3VzZS5nZXRJbnRlcnNlY3RlZChlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCB0cnVlLCBbQm9va09iamVjdF0pO1xuXHRcdFx0aWYoIWludGVyc2VjdGVkKSB7XG5cdFx0XHRcdGludGVyc2VjdGVkID0gbW91c2UuZ2V0SW50ZXJzZWN0ZWQoZW52aXJvbm1lbnQubGlicmFyeS5jaGlsZHJlbiwgdHJ1ZSwgW1NoZWxmT2JqZWN0XSk7XG5cdFx0XHR9XG5cdFx0XHRpZighaW50ZXJzZWN0ZWQpIHtcblx0XHRcdFx0aW50ZXJzZWN0ZWQgPSBtb3VzZS5nZXRJbnRlcnNlY3RlZChlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCB0cnVlLCBbU2VjdGlvbk9iamVjdF0pO1xuXHRcdFx0fVxuXHRcdFx0aWYoaW50ZXJzZWN0ZWQpIHtcblx0XHRcdFx0b2JqZWN0ID0gaW50ZXJzZWN0ZWQub2JqZWN0O1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxlY3Rvci5mb2N1cyhuZXcgU2VsZWN0b3JNZXRhKG9iamVjdCkpO1xuXHRcdH1cblx0fTtcblxuXHRDb250cm9scy5tb3ZlT2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIFxuXHRcdFx0bW91c2VWZWN0b3IsXG5cdFx0XHRuZXdQb3NpdGlvbixcblx0XHRcdGludGVyc2VjdGVkLFxuXHRcdFx0cGFyZW50LFxuXHRcdFx0b2xkUGFyZW50O1xuXHRcdHZhciBzZWxlY3RlZE9iamVjdDtcblxuXHRcdGlmKENvbnRyb2xzLnNlbGVjdGVkLmlzQm9vaygpIHx8IChDb250cm9scy5zZWxlY3RlZC5pc1NlY3Rpb24oKS8qICYmIFVJLm1lbnUuc2VjdGlvbk1lbnUuaXNNb3ZlT3B0aW9uKCkqLykpIHtcblx0XHRcdHNlbGVjdGVkT2JqZWN0ID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcblx0XHRcdG1vdXNlVmVjdG9yID0gQ2FtZXJhLmdldFZlY3RvcigpO1x0XG5cblx0XHRcdG5ld1Bvc2l0aW9uID0gc2VsZWN0ZWRPYmplY3QucG9zaXRpb24uY2xvbmUoKTtcblx0XHRcdG9sZFBhcmVudCA9IHNlbGVjdGVkT2JqZWN0LnBhcmVudDtcblxuXHRcdFx0aWYoQ29udHJvbHMuc2VsZWN0ZWQuaXNCb29rKCkpIHtcblx0XHRcdFx0aW50ZXJzZWN0ZWQgPSBtb3VzZS5nZXRJbnRlcnNlY3RlZChlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCB0cnVlLCBbU2hlbGZPYmplY3RdKTtcblx0XHRcdFx0c2VsZWN0ZWRPYmplY3Quc2V0UGFyZW50KGludGVyc2VjdGVkID8gaW50ZXJzZWN0ZWQub2JqZWN0IDogbnVsbCk7XG5cdFx0XHR9XG5cblx0XHRcdHBhcmVudCA9IHNlbGVjdGVkT2JqZWN0LnBhcmVudDtcblx0XHRcdGlmKHBhcmVudCkge1xuXHRcdFx0XHRwYXJlbnQubG9jYWxUb1dvcmxkKG5ld1Bvc2l0aW9uKTtcblxuXHRcdFx0XHRuZXdQb3NpdGlvbi54IC09IChtb3VzZVZlY3Rvci56ICogbW91c2UuZFggKyBtb3VzZVZlY3Rvci54ICogbW91c2UuZFkpICogMC4wMDM7XG5cdFx0XHRcdG5ld1Bvc2l0aW9uLnogLT0gKC1tb3VzZVZlY3Rvci54ICogbW91c2UuZFggKyBtb3VzZVZlY3Rvci56ICogbW91c2UuZFkpICogMC4wMDM7XG5cblx0XHRcdFx0cGFyZW50LndvcmxkVG9Mb2NhbChuZXdQb3NpdGlvbik7XG5cdFx0XHRcdGlmKCFzZWxlY3RlZE9iamVjdC5tb3ZlKG5ld1Bvc2l0aW9uKSAmJiBDb250cm9scy5zZWxlY3RlZC5pc0Jvb2soKSkge1xuXHRcdFx0XHRcdGlmKHBhcmVudCAhPT0gb2xkUGFyZW50KSB7XG5cdFx0XHRcdFx0XHRzZWxlY3RlZE9iamVjdC5zZXRQYXJlbnQob2xkUGFyZW50KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LyogZWxzZSBpZihVSS5tZW51LnNlY3Rpb25NZW51LmlzUm90YXRlT3B0aW9uKCkgJiYgQ29udHJvbHMuc2VsZWN0ZWQuaXNTZWN0aW9uKCkpIHtcblx0XHRcdENvbnRyb2xzLnNlbGVjdGVkLm9iamVjdC5yb3RhdGUoQ29udHJvbHMubW91c2UuZFgpO1x0XHRcdFxuXHRcdH0qL1xuXHR9O1xuXG5cdHJldHVybiBDb250cm9scztcdFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0RhdGEnLCBmdW5jdGlvbiAoJGh0dHAsICRxKSB7XG5cdHZhciBEYXRhID0ge307XG5cblx0RGF0YS5URVhUVVJFX1JFU09MVVRJT04gPSA1MTI7XG5cdERhdGEuQ09WRVJfTUFYX1kgPSAzOTQ7XG5cdERhdGEuQ09WRVJfRkFDRV9YID0gMjk2O1xuXG4gICAgRGF0YS5sb2FkSW1hZ2UgPSBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgdmFyIGRlZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICBcbiAgICAgICAgaW1nLmNyb3NzT3JpZ2luID0gJyc7IFxuICAgICAgICBpbWcuc3JjID0gdXJsO1xuICAgICAgICBcbiAgICAgICAgaWYoaW1nLmNvbXBsZXRlKSB7XG4gICAgICAgICAgICBkZWZmZXJlZC5yZXNvbHZlKGltZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGVmZmVyZWQucmVzb2x2ZShpbWcpO1xuICAgICAgICB9O1xuICAgICAgICBpbWcub25lcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgZGVmZmVyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZGVmZmVyZWQucHJvbWlzZTsgXG4gICAgfTtcblxuICAgIERhdGEucG9zdEFyY2hpdmVJbWFnZSA9IGZ1bmN0aW9uKGV4dGVybmFsVVJMLCB0YWdzKSB7XG4gICAgXHR2YXIgZGF0YSA9IHtcbiAgICBcdFx0dXJsOiBleHRlcm5hbFVSTCxcbiAgICBcdFx0dGFnczogdGFnc1xuICAgIFx0fTtcblxuICAgIFx0cmV0dXJuICRodHRwLnBvc3QoJy9hcmNoaXZlJywgZGF0YSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgXHRcdHJldHVybiByZXMuZGF0YTtcbiAgICBcdH0pO1xuICAgIH07XG5cbiAgICBEYXRhLmxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgIFx0cmV0dXJuICRodHRwLnBvc3QoJy9hdXRoL2xvZ291dCcpO1xuICAgIH07XG5cblx0RGF0YS5nZXRVc2VyID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL3VzZXInKTtcblx0fTtcblxuXHREYXRhLmdldFVzZXJCb29rcyA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9mcmVlQm9va3MvJyArIHVzZXJJZCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0RGF0YS5wb3N0Qm9vayA9IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2Jvb2snLCBib29rKTtcblx0fTtcblxuXHREYXRhLmRlbGV0ZUJvb2sgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0cmV0dXJuICRodHRwKHtcblx0XHRcdG1ldGhvZDogJ0RFTEVURScsXG5cdFx0XHR1cmw6ICcvYm9vaycsXG5cdFx0XHRkYXRhOiBib29rLFxuXHRcdFx0aGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04J31cblx0XHR9KTtcblx0fTtcblxuXHREYXRhLmdldFVJRGF0YSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9vYmovZGF0YS5qc29uJyk7XG5cdH07XG5cblx0RGF0YS5nZXRMaWJyYXJpZXMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvbGlicmFyaWVzJyk7XG5cdH07XG5cblx0RGF0YS5nZXRMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeUlkKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2xpYnJhcnkvJyArIGxpYnJhcnlJZCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRyZXR1cm4gcmVzLmRhdGE7XG5cdFx0fSk7XG5cdH07XG5cblx0RGF0YS5wb3N0TGlicmFyeSA9IGZ1bmN0aW9uKGxpYnJhcnlNb2RlbCkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2xpYnJhcnkvJyArIGxpYnJhcnlNb2RlbCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuXHR9O1xuXG5cdERhdGEuZ2V0U2VjdGlvbnMgPSBmdW5jdGlvbihsaWJyYXJ5SWQpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL3NlY3Rpb25zLycgKyBsaWJyYXJ5SWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9KTtcblx0fTtcblxuXHREYXRhLnBvc3RTZWN0aW9uID0gZnVuY3Rpb24oc2VjdGlvbkRhdGEpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9zZWN0aW9uJywgc2VjdGlvbkRhdGEpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBcdHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG5cdH07XG5cblx0RGF0YS5nZXRCb29rcyA9IGZ1bmN0aW9uKHNlY3Rpb25JZCkge1xuXHRcdC8vVE9ETzogdXNlcklkXG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9ib29rcy8nICsgc2VjdGlvbklkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG5cdH07XG5cblx0RGF0YS5sb2FkR2VvbWV0cnkgPSBmdW5jdGlvbihsaW5rKSB7XG4gICAgICAgIHZhciBkZWZmZXJlZCA9ICRxLmRlZmVyKCk7XG5cdFx0dmFyIGpzb25Mb2FkZXIgPSBuZXcgVEhSRUUuSlNPTkxvYWRlcigpO1xuXG4gICAgICAgIC8vVE9ETzogZm91bmQgbm8gd2F5IHRvIHJlamVjdFxuXHRcdGpzb25Mb2FkZXIubG9hZChsaW5rLCBmdW5jdGlvbiAoZ2VvbWV0cnkpIHtcblx0XHRcdGRlZmZlcmVkLnJlc29sdmUoZ2VvbWV0cnkpO1xuXHRcdH0pO1xuXG4gICAgICAgIHJldHVybiBkZWZmZXJlZC5wcm9taXNlO1xuXHR9O1xuXG5cdERhdGEuZ2V0RGF0YSA9IGZ1bmN0aW9uKHVybCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KHVybCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuXHR9O1xuXG5cdERhdGEucG9zdEZlZWRiYWNrID0gZnVuY3Rpb24oZHRvKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvZmVlZGJhY2snLCBkdG8pO1xuXHR9O1xuXG5cdHJldHVybiBEYXRhO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2Vudmlyb25tZW50JywgZnVuY3Rpb24gKCRxLCAkbG9nLCAkd2luZG93LCBMaWJyYXJ5T2JqZWN0LCBTZWN0aW9uT2JqZWN0LCBCb29rT2JqZWN0LCBEYXRhLCBDYW1lcmEsIGNhY2hlKSB7XG5cdHZhciBlbnZpcm9ubWVudCA9IHt9O1xuXG5cdGVudmlyb25tZW50LkNMRUFSQU5DRSA9IDAuMDAxO1xuXHQgXG5cdHZhciBsaWJyYXJ5RHRvID0gbnVsbDtcblx0dmFyIHNlY3Rpb25zID0gbnVsbDtcblx0dmFyIGJvb2tzID0gbnVsbDtcblxuXHRlbnZpcm9ubWVudC5zY2VuZSA9IG51bGw7XG5cdGVudmlyb25tZW50LmxpYnJhcnkgPSBudWxsO1xuXG5cdGVudmlyb25tZW50LmxvYWRMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeUlkKSB7XG5cdFx0Y2xlYXJTY2VuZSgpOyAvLyBpbml0cyBzb21lIGZpZWxkc1xuXG5cdFx0dmFyIHByb21pc2UgPSBEYXRhLmdldExpYnJhcnkobGlicmFyeUlkKS50aGVuKGZ1bmN0aW9uIChkdG8pIHtcblx0XHRcdHZhciBkaWN0ID0gcGFyc2VMaWJyYXJ5RHRvKGR0byk7XG5cdFx0XHRcblx0XHRcdHNlY3Rpb25zID0gZGljdC5zZWN0aW9ucztcblx0XHRcdGJvb2tzID0gZGljdC5ib29rcztcblx0XHRcdGxpYnJhcnlEdG8gPSBkdG87XG5cblx0XHRcdHJldHVybiBpbml0Q2FjaGUobGlicmFyeUR0bywgZGljdC5zZWN0aW9ucywgZGljdC5ib29rcyk7XG5cdFx0fSkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRjcmVhdGVMaWJyYXJ5KGxpYnJhcnlEdG8pO1xuXHRcdFx0cmV0dXJuIGNyZWF0ZVNlY3Rpb25zKHNlY3Rpb25zKTtcblx0XHR9KS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjcmVhdGVCb29rcyhib29rcyk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHRlbnZpcm9ubWVudC5nb1RvTGlicmFyeSA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0aWYoaWQpIHtcblx0XHRcdCR3aW5kb3cubG9jYXRpb24gPSAnLycgKyBpZDtcblx0XHR9XG5cdH07XG5cblx0ZW52aXJvbm1lbnQuZ2V0Qm9vayA9IGZ1bmN0aW9uKGJvb2tJZCkge1xuXHRcdHJldHVybiBnZXREaWN0T2JqZWN0KGJvb2tzLCBib29rSWQpO1xuXHR9O1xuXG5cdGVudmlyb25tZW50LmdldFNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uSWQpIHtcblx0XHRyZXR1cm4gZ2V0RGljdE9iamVjdChzZWN0aW9ucywgc2VjdGlvbklkKTtcblx0fTtcblxuXHRlbnZpcm9ubWVudC5nZXRTaGVsZiA9IGZ1bmN0aW9uKHNlY3Rpb25JZCwgc2hlbGZJZCkge1xuXHRcdHZhciBzZWN0aW9uID0gZW52aXJvbm1lbnQuZ2V0U2VjdGlvbihzZWN0aW9uSWQpO1xuXHRcdHZhciBzaGVsZiA9IHNlY3Rpb24gJiYgc2VjdGlvbi5zaGVsdmVzW3NoZWxmSWRdO1xuXG5cdFx0cmV0dXJuIHNoZWxmO1xuXHR9O1xuXG5cdHZhciBnZXREaWN0T2JqZWN0ID0gZnVuY3Rpb24oZGljdCwgb2JqZWN0SWQpIHtcblx0XHR2YXIgZGljdEl0ZW0gPSBkaWN0W29iamVjdElkXTtcblx0XHR2YXIgZGljdE9iamVjdCA9IGRpY3RJdGVtICYmIGRpY3RJdGVtLm9iajtcblxuXHRcdHJldHVybiBkaWN0T2JqZWN0O1xuXHR9O1xuXG5cdGVudmlyb25tZW50LnVwZGF0ZVNlY3Rpb24gPSBmdW5jdGlvbihkdG8pIHtcblx0XHRpZihkdG8ubGlicmFyeUlkID09IGVudmlyb25tZW50LmxpYnJhcnkuaWQpIHtcblx0XHRcdHJlbW92ZU9iamVjdChzZWN0aW9ucywgZHRvLmlkKTtcblx0XHRcdGNyZWF0ZVNlY3Rpb24oZHRvKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlT2JqZWN0KHNlY3Rpb25zLCBkdG8uaWQpO1xuXHRcdH1cdFxuXHR9O1xuXG5cdGVudmlyb25tZW50LnVwZGF0ZUJvb2sgPSBmdW5jdGlvbihkdG8pIHtcblx0XHR2YXIgc2hlbGYgPSBnZXRCb29rU2hlbGYoZHRvKTtcblxuXHRcdGlmKHNoZWxmKSB7XG5cdFx0XHRyZW1vdmVPYmplY3QoYm9va3MsIGR0by5pZCk7XG5cdFx0XHRjcmVhdGVCb29rKGR0byk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZU9iamVjdChib29rcywgZHRvLmlkKTtcblx0XHR9XG5cdH07XG5cblx0ZW52aXJvbm1lbnQucmVtb3ZlQm9vayA9IGZ1bmN0aW9uKGJvb2tEdG8pIHtcblx0XHRyZW1vdmVPYmplY3QoYm9va3MsIGJvb2tEdG8uaWQpO1xuXHR9O1xuXG5cdHZhciByZW1vdmVPYmplY3QgPSBmdW5jdGlvbihkaWN0LCBrZXkpIHtcblx0XHR2YXIgZGljdEl0ZW0gPSBkaWN0W2tleV07XG5cdFx0aWYoZGljdEl0ZW0pIHtcblx0XHRcdGRlbGV0ZSBkaWN0W2tleV07XG5cdFx0XHRcblx0XHRcdGlmKGRpY3RJdGVtLm9iaikge1xuXHRcdFx0XHRkaWN0SXRlbS5vYmouc2V0UGFyZW50KG51bGwpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHR2YXIgaW5pdENhY2hlID0gZnVuY3Rpb24obGlicmFyeUR0bywgc2VjdGlvbnNEaWN0LCBib29rc0RpY3QpIHtcblx0XHR2YXIgbGlicmFyeU1vZGVsID0gbGlicmFyeUR0by5tb2RlbDtcblx0XHR2YXIgc2VjdGlvbk1vZGVscyA9IHt9O1xuXHRcdHZhciBib29rTW9kZWxzID0ge307XG5cdFx0dmFyIGltYWdlVXJscyA9IHt9O1xuXG5cdFx0Zm9yICh2YXIgc2VjdGlvbklkIGluIHNlY3Rpb25zRGljdCkge1xuXHRcdFx0dmFyIHNlY3Rpb25EdG8gPSBzZWN0aW9uc0RpY3Rbc2VjdGlvbklkXS5kdG87XG5cdFx0XHRzZWN0aW9uTW9kZWxzW3NlY3Rpb25EdG8ubW9kZWxdID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBib29rSWQgaW4gYm9va3NEaWN0KSB7XG5cdFx0XHR2YXIgYm9va0R0byA9IGJvb2tzRGljdFtib29rSWRdLmR0bztcblx0XHRcdGJvb2tNb2RlbHNbYm9va0R0by5tb2RlbF0gPSB0cnVlO1xuXG5cdFx0XHRpZihib29rRHRvLmNvdmVyKSB7XG5cdFx0XHRcdGltYWdlVXJsc1tib29rRHRvLmNvdmVyXSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNhY2hlLmluaXQobGlicmFyeU1vZGVsLCBzZWN0aW9uTW9kZWxzLCBib29rTW9kZWxzLCBpbWFnZVVybHMpO1xuXHR9O1xuXG5cdHZhciBjbGVhclNjZW5lID0gZnVuY3Rpb24oKSB7XG5cdFx0Ly8gQ29udHJvbHMuY2xlYXIoKTtcblx0XHRlbnZpcm9ubWVudC5saWJyYXJ5ID0gbnVsbDtcblx0XHRzZWN0aW9ucyA9IHt9O1xuXHRcdGJvb2tzID0ge307XG5cblx0XHR3aGlsZShlbnZpcm9ubWVudC5zY2VuZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHRpZihlbnZpcm9ubWVudC5zY2VuZS5jaGlsZHJlblswXS5kaXNwb3NlKSB7XG5cdFx0XHRcdGVudmlyb25tZW50LnNjZW5lLmNoaWxkcmVuWzBdLmRpc3Bvc2UoKTtcblx0XHRcdH1cblx0XHRcdGVudmlyb25tZW50LnNjZW5lLnJlbW92ZShlbnZpcm9ubWVudC5zY2VuZS5jaGlsZHJlblswXSk7XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBwYXJzZUxpYnJhcnlEdG8gPSBmdW5jdGlvbihsaWJyYXJ5RHRvKSB7XG5cdFx0dmFyIHJlc3VsdCA9IHtcblx0XHRcdHNlY3Rpb25zOiB7fSxcblx0XHRcdGJvb2tzOiB7fVxuXHRcdH07XG5cblx0XHRmb3IodmFyIHNlY3Rpb25JbmRleCA9IGxpYnJhcnlEdG8uc2VjdGlvbnMubGVuZ3RoIC0gMTsgc2VjdGlvbkluZGV4ID49IDA7IHNlY3Rpb25JbmRleC0tKSB7XG5cdFx0XHR2YXIgc2VjdGlvbkR0byA9IGxpYnJhcnlEdG8uc2VjdGlvbnNbc2VjdGlvbkluZGV4XTtcblx0XHRcdHJlc3VsdC5zZWN0aW9uc1tzZWN0aW9uRHRvLmlkXSA9IHtkdG86IHNlY3Rpb25EdG99O1xuXG5cdFx0XHRmb3IodmFyIGJvb2tJbmRleCA9IHNlY3Rpb25EdG8uYm9va3MubGVuZ3RoIC0gMTsgYm9va0luZGV4ID49IDA7IGJvb2tJbmRleC0tKSB7XG5cdFx0XHRcdHZhciBib29rRHRvID0gc2VjdGlvbkR0by5ib29rc1tib29rSW5kZXhdO1xuXHRcdFx0XHRyZXN1bHQuYm9va3NbYm9va0R0by5pZF0gPSB7ZHRvOiBib29rRHRvfTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsZXRlIHNlY3Rpb25EdG8uYm9va3M7XG5cdFx0fVxuXG5cdFx0ZGVsZXRlIGxpYnJhcnlEdG8uc2VjdGlvbnM7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHZhciBjcmVhdGVMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeUR0bykge1xuXHRcdHZhciBsaWJyYXJ5ID0gbnVsbDtcblx0XHR2YXIgbGlicmFyeUNhY2hlID0gY2FjaGUuZ2V0TGlicmFyeSgpO1xuICAgICAgICB2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGxpYnJhcnlDYWNoZS5tYXBJbWFnZSk7XG4gICAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7bWFwOiB0ZXh0dXJlfSk7XG5cbiAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cdFx0bGlicmFyeSA9IG5ldyBMaWJyYXJ5T2JqZWN0KGxpYnJhcnlEdG8sIGxpYnJhcnlDYWNoZS5nZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXHRcdENhbWVyYS5zZXRQYXJlbnQobGlicmFyeSk7XG5cblx0XHRlbnZpcm9ubWVudC5zY2VuZS5hZGQobGlicmFyeSk7XG5cdFx0ZW52aXJvbm1lbnQubGlicmFyeSA9IGxpYnJhcnk7XG5cdH07XG5cblx0dmFyIGNyZWF0ZVNlY3Rpb25zID0gZnVuY3Rpb24oc2VjdGlvbnNEaWN0KSB7XG5cdFx0dmFyIHJlc3VsdHMgPSBbXTtcblx0XHR2YXIga2V5O1xuXG5cdFx0Zm9yKGtleSBpbiBzZWN0aW9uc0RpY3QpIHtcblx0XHRcdHJlc3VsdHMucHVzaChjcmVhdGVTZWN0aW9uKHNlY3Rpb25zRGljdFtrZXldLmR0bykpO1x0XHRcblx0XHR9XG5cblx0XHRyZXR1cm4gJHEuYWxsKHJlc3VsdHMpO1xuXHR9O1xuXG5cdHZhciBjcmVhdGVTZWN0aW9uID0gZnVuY3Rpb24oc2VjdGlvbkR0bykge1xuXHRcdHZhciBwcm9taXNlID0gY2FjaGUuZ2V0U2VjdGlvbihzZWN0aW9uRHRvLm1vZGVsKS50aGVuKGZ1bmN0aW9uIChzZWN0aW9uQ2FjaGUpIHtcblx0ICAgICAgICB2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKHNlY3Rpb25DYWNoZS5tYXBJbWFnZSk7XG5cdCAgICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHttYXA6IHRleHR1cmV9KTtcblx0ICAgICAgICB2YXIgc2VjdGlvbjtcblxuXHQgICAgICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xuXHQgICAgICAgIHNlY3Rpb25EdG8uZGF0YSA9IHNlY3Rpb25DYWNoZS5kYXRhO1xuXG5cdCAgICAgICAgc2VjdGlvbiA9IG5ldyBTZWN0aW9uT2JqZWN0KHNlY3Rpb25EdG8sIHNlY3Rpb25DYWNoZS5nZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG5cdFx0XHRlbnZpcm9ubWVudC5saWJyYXJ5LmFkZChzZWN0aW9uKTtcblx0XHRcdGFkZFRvRGljdChzZWN0aW9ucywgc2VjdGlvbik7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHQvLyBUT0RPOiBtZXJnZSB3aXRoIGNyZWF0ZVNlY3Rpb25zXG5cdHZhciBjcmVhdGVCb29rcyA9IGZ1bmN0aW9uKGJvb2tzRGljdCkge1xuXHRcdHZhciByZXN1bHRzID0gW107XG5cdFx0dmFyIGtleTtcblxuXHRcdGZvcihrZXkgaW4gYm9va3NEaWN0KSB7XG5cdFx0XHRyZXN1bHRzLnB1c2goY3JlYXRlQm9vayhib29rc0RpY3Rba2V5XS5kdG8pKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gJHEuYWxsKHJlc3VsdHMpO1xuXHR9O1xuXG5cdHZhciBjcmVhdGVCb29rID0gZnVuY3Rpb24oYm9va0R0bykge1xuXHRcdHZhciBwcm9taXNlcyA9IHt9O1xuXHRcdHZhciBwcm9taXNlO1xuXG5cdFx0cHJvbWlzZXMuYm9va0NhY2hlID0gY2FjaGUuZ2V0Qm9vayhib29rRHRvLm1vZGVsKTtcblx0XHRpZihib29rRHRvLmNvdmVyKSB7XG5cdFx0XHRwcm9taXNlcy5jb3ZlckNhY2hlID0gY2FjaGUuZ2V0SW1hZ2UoYm9va0R0by5jb3Zlcik7XG5cdFx0fVxuXG5cdFx0cHJvbWlzZSA9ICRxLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbiAocmVzdWx0cykge1xuXHRcdFx0dmFyIGJvb2tDYWNoZSA9IHJlc3VsdHMuYm9va0NhY2hlO1xuXHRcdFx0dmFyIGNvdmVySW1hZ2UgPSByZXN1bHRzLmNvdmVyQ2FjaGU7XG5cdFx0XHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cblx0XHRcdGNhbnZhcy53aWR0aCA9IGNhbnZhcy5oZWlnaHQgPSBEYXRhLlRFWFRVUkVfUkVTT0xVVElPTjtcblx0XHRcdHZhciB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoY2FudmFzKTtcblx0XHQgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHttYXA6IHRleHR1cmV9KTtcblxuXHRcdFx0dmFyIGJvb2sgPSBuZXcgQm9va09iamVjdChib29rRHRvLCBib29rQ2FjaGUuZ2VvbWV0cnksIG1hdGVyaWFsLCBib29rQ2FjaGUubWFwSW1hZ2UsIGNvdmVySW1hZ2UpO1xuXG5cdFx0XHRhZGRUb0RpY3QoYm9va3MsIGJvb2spO1xuXHRcdFx0cGxhY2VCb29rT25TaGVsZihib29rKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBhZGRUb0RpY3QgPSBmdW5jdGlvbihkaWN0LCBvYmopIHtcblx0XHR2YXIgZGljdEl0ZW0gPSB7XG5cdFx0XHRkdG86IG9iai5kYXRhT2JqZWN0LFxuXHRcdFx0b2JqOiBvYmpcblx0XHR9O1xuXG5cdFx0ZGljdFtvYmouaWRdID0gZGljdEl0ZW07XG5cdH07XG5cblx0dmFyIGdldEJvb2tTaGVsZiA9IGZ1bmN0aW9uKGJvb2tEdG8pIHtcblx0XHRyZXR1cm4gZW52aXJvbm1lbnQuZ2V0U2hlbGYoYm9va0R0by5zZWN0aW9uSWQsIGJvb2tEdG8uc2hlbGZJZCk7XG5cdH07XG5cblx0dmFyIHBsYWNlQm9va09uU2hlbGYgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0dmFyIHNoZWxmID0gZ2V0Qm9va1NoZWxmKGJvb2suZGF0YU9iamVjdCk7XG5cdFx0c2hlbGYuYWRkKGJvb2spO1xuXHR9O1xuXG5cdHJldHVybiBlbnZpcm9ubWVudDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdNYWluJywgZnVuY3Rpb24gKCRsb2csIERhdGEsIENhbWVyYSwgTGlicmFyeU9iamVjdCwgQ29udHJvbHMsIFVzZXIsIFVJLCBlbnZpcm9ubWVudCkge1xuXHR2YXIgU1RBVFNfQ09OVEFJTkVSX0lEID0gJ3N0YXRzJztcblx0dmFyIExJQlJBUllfQ0FOVkFTX0lEID0gJ0xJQlJBUlknO1xuXHRcblx0dmFyIGNhbnZhcztcblx0dmFyIHJlbmRlcmVyO1xuXHR2YXIgc3RhdHM7XG5cdFxuXHR2YXIgTWFpbiA9IHt9O1xuXG5cdE1haW4uc3RhcnQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgd2luUmVzaXplO1xuXHRcdHZhciB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cblx0XHRpZighRGV0ZWN0b3Iud2ViZ2wpIHtcblx0XHRcdERldGVjdG9yLmFkZEdldFdlYkdMTWVzc2FnZSgpO1xuXHRcdH1cblxuXHRcdGluaXQod2lkdGgsIGhlaWdodCk7XG5cdFx0Q2FtZXJhLmluaXQod2lkdGgsIGhlaWdodCk7XG5cdFx0Q29udHJvbHMuaW5pdCgpO1xuXG5cdFx0d2luUmVzaXplID0gbmV3IFRIUkVFeC5XaW5kb3dSZXNpemUocmVuZGVyZXIsIENhbWVyYS5jYW1lcmEpO1xuXG5cdFx0c3RhcnRSZW5kZXJMb29wKCk7XG5cblx0XHRVc2VyLmxvYWQoKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBlbnZpcm9ubWVudC5sb2FkTGlicmFyeShVc2VyLmdldExpYnJhcnkoKSB8fCAxKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0VUkuaW5pdCgpO1xuXHRcdFx0fSk7XG5cdFx0fSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0XHQkbG9nLmVycm9yKGVycm9yKTtcblx0XHRcdC8vVE9ETzogc2hvdyBlcnJvciBtZXNzYWdlICBcblx0XHR9KTtcdFx0XG5cdH07XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0dmFyIHN0YXRzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU1RBVFNfQ09OVEFJTkVSX0lEKTtcblxuXHRcdHN0YXRzID0gbmV3IFN0YXRzKCk7XG5cdFx0c3RhdHNDb250YWluZXIuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tRWxlbWVudCk7XG5cblx0XHRjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChMSUJSQVJZX0NBTlZBU19JRCk7XG5cdFx0cmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7Y2FudmFzOiBjYW52YXN9KTtcblx0XHRyZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuXG5cdFx0ZW52aXJvbm1lbnQuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblx0XHRlbnZpcm9ubWVudC5zY2VuZS5mb2cgPSBuZXcgVEhSRUUuRm9nKDB4MDAwMDAwLCA0LCA3KTtcblx0fTtcblxuXHR2YXIgc3RhcnRSZW5kZXJMb29wID0gZnVuY3Rpb24oKSB7XG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0YXJ0UmVuZGVyTG9vcCk7XG5cdFx0Q29udHJvbHMudXBkYXRlKCk7XG5cdFx0cmVuZGVyZXIucmVuZGVyKGVudmlyb25tZW50LnNjZW5lLCBDYW1lcmEuY2FtZXJhKTtcblxuXHRcdHN0YXRzLnVwZGF0ZSgpO1xuXHR9O1xuXG5cdHJldHVybiBNYWluO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ21vdXNlJywgZnVuY3Rpb24gKENhbWVyYSkge1xuXHR2YXIgbW91c2UgPSB7fTtcblxuXHR2YXIgZ2V0V2lkdGggPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gd2luZG93LmlubmVyV2lkdGg7XG5cdH07XG5cblx0dmFyIGdldEhlaWdodCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdH07XG5cblx0dmFyIHggPSBudWxsO1xuXHR2YXIgeSA9IG51bGw7XG5cdFxuXHRtb3VzZS50YXJnZXQgPSBudWxsO1xuXHRtb3VzZS5kWCA9IG51bGw7XG5cdG1vdXNlLmRZID0gbnVsbDtcblx0bW91c2UubG9uZ1ggPSBudWxsO1xuXHRtb3VzZS5sb25nWSA9IG51bGw7XG5cblx0bW91c2UuZ2V0VGFyZ2V0ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMudGFyZ2V0O1xuXHR9O1xuXG5cdG1vdXNlLmRvd24gPSBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmKGV2ZW50KSB7XG5cdFx0XHR0aGlzW2V2ZW50LndoaWNoXSA9IHRydWU7XG5cdFx0XHR0aGlzLnRhcmdldCA9IGV2ZW50LnRhcmdldDtcblx0XHRcdHggPSBldmVudC5jbGllbnRYO1xuXHRcdFx0eSA9IGV2ZW50LmNsaWVudFk7XG5cdFx0XHRtb3VzZS5sb25nWCA9IGdldFdpZHRoKCkgKiAwLjUgLSB4O1xuXHRcdFx0bW91c2UubG9uZ1kgPSBnZXRIZWlnaHQoKSAqIDAuNSAtIHk7XG5cdFx0fVxuXHR9O1xuXG5cdG1vdXNlLnVwID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRpZihldmVudCkge1xuXHRcdFx0dGhpc1tldmVudC53aGljaF0gPSBmYWxzZTtcblx0XHRcdHRoaXNbMV0gPSBmYWxzZTsgLy8gbGludXggY2hyb21lIGJ1ZyBmaXggKHdoZW4gYm90aCBrZXlzIHJlbGVhc2UgdGhlbiBib3RoIGV2ZW50LndoaWNoIGVxdWFsIDMpXG5cdFx0fVxuXHR9O1xuXG5cdG1vdXNlLm1vdmUgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmKGV2ZW50KSB7XG5cdFx0XHR0aGlzLnRhcmdldCA9IGV2ZW50LnRhcmdldDtcblx0XHRcdG1vdXNlLmxvbmdYID0gZ2V0V2lkdGgoKSAqIDAuNSAtIHg7XG5cdFx0XHRtb3VzZS5sb25nWSA9IGdldEhlaWdodCgpICogMC41IC0geTtcblx0XHRcdG1vdXNlLmRYID0gZXZlbnQuY2xpZW50WCAtIHg7XG5cdFx0XHRtb3VzZS5kWSA9IGV2ZW50LmNsaWVudFkgLSB5O1xuXHRcdFx0eCA9IGV2ZW50LmNsaWVudFg7XG5cdFx0XHR5ID0gZXZlbnQuY2xpZW50WTtcblx0XHR9XG5cdH07XG5cblx0bW91c2UuaXNDYW52YXMgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy50YXJnZXQgJiYgdGhpcy50YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ3VpJykgPiAtMTtcblx0fTtcblxuXHRtb3VzZS5pc1BvY2tldEJvb2sgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gZmFsc2U7IC8vVE9ETzogc3R1YlxuXHRcdC8vIHJldHVybiAhISh0aGlzLnRhcmdldCAmJiB0aGlzLnRhcmdldC5wYXJlbnROb2RlID09IFVJLm1lbnUuaW52ZW50b3J5LmJvb2tzKTtcblx0fTtcblxuXHRtb3VzZS5nZXRJbnRlcnNlY3RlZCA9IGZ1bmN0aW9uKG9iamVjdHMsIHJlY3Vyc2l2ZSwgc2VhcmNoRm9yKSB7XG5cdFx0dmFyXG5cdFx0XHR2ZWN0b3IsXG5cdFx0XHRyYXljYXN0ZXIsXG5cdFx0XHRpbnRlcnNlY3RzLFxuXHRcdFx0aW50ZXJzZWN0ZWQsXG5cdFx0XHRyZXN1bHQsXG5cdFx0XHRpLCBqO1xuXG5cdFx0cmVzdWx0ID0gbnVsbDtcblx0XHR2ZWN0b3IgPSBnZXRWZWN0b3IoKTtcblx0XHRyYXljYXN0ZXIgPSBuZXcgVEhSRUUuUmF5Y2FzdGVyKENhbWVyYS5nZXRQb3NpdGlvbigpLCB2ZWN0b3IpO1xuXHRcdGludGVyc2VjdHMgPSByYXljYXN0ZXIuaW50ZXJzZWN0T2JqZWN0cyhvYmplY3RzLCByZWN1cnNpdmUpO1xuXG5cdFx0aWYoc2VhcmNoRm9yKSB7XG5cdFx0XHRpZihpbnRlcnNlY3RzLmxlbmd0aCkge1xuXHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBpbnRlcnNlY3RzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0aW50ZXJzZWN0ZWQgPSBpbnRlcnNlY3RzW2ldO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGZvcihqID0gc2VhcmNoRm9yLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKSB7XG5cdFx0XHRcdFx0XHRpZihpbnRlcnNlY3RlZC5vYmplY3QgaW5zdGFuY2VvZiBzZWFyY2hGb3Jbal0pIHtcblx0XHRcdFx0XHRcdFx0cmVzdWx0ID0gaW50ZXJzZWN0ZWQ7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmKHJlc3VsdCkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXN1bHQgPSBpbnRlcnNlY3RzO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0dmFyIGdldFZlY3RvciA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBwcm9qZWN0b3IgPSBuZXcgVEhSRUUuUHJvamVjdG9yKCk7XG5cdFx0dmFyIHZlY3RvciA9IG5ldyBUSFJFRS5WZWN0b3IzKCh4IC8gZ2V0V2lkdGgoKSkgKiAyIC0gMSwgLSAoeSAvIGdldEhlaWdodCgpKSAqIDIgKyAxLCAwLjUpO1xuXHRcdHByb2plY3Rvci51bnByb2plY3RWZWN0b3IodmVjdG9yLCBDYW1lcmEuY2FtZXJhKTtcblx0XG5cdFx0cmV0dXJuIHZlY3Rvci5zdWIoQ2FtZXJhLmdldFBvc2l0aW9uKCkpLm5vcm1hbGl6ZSgpO1xuXHR9O1xuXG5cdHJldHVybiBtb3VzZTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCduYXZpZ2F0aW9uJywgZnVuY3Rpb24gKCkge1xuXHR2YXIgbmF2aWdhdGlvbiA9IHtcblx0XHRzdGF0ZToge1xuXHRcdFx0Zm9yd2FyZDogZmFsc2UsXG5cdFx0XHRiYWNrd2FyZDogZmFsc2UsXG5cdFx0XHRsZWZ0OiBmYWxzZSxcblx0XHRcdHJpZ2h0OiBmYWxzZVx0XHRcdFxuXHRcdH1cblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvU3RvcCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc3RhdGUuZm9yd2FyZCA9IGZhbHNlO1xuXHRcdHRoaXMuc3RhdGUuYmFja3dhcmQgPSBmYWxzZTtcblx0XHR0aGlzLnN0YXRlLmxlZnQgPSBmYWxzZTtcblx0XHR0aGlzLnN0YXRlLnJpZ2h0ID0gZmFsc2U7XG5cdH07XG5cblx0bmF2aWdhdGlvbi5nb0ZvcndhcmQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnN0YXRlLmZvcndhcmQgPSB0cnVlO1xuXHR9O1xuXG5cdG5hdmlnYXRpb24uZ29CYWNrd2FyZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc3RhdGUuYmFja3dhcmQgPSB0cnVlO1xuXHR9O1xuXG5cdG5hdmlnYXRpb24uZ29MZWZ0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zdGF0ZS5sZWZ0ID0gdHJ1ZTtcblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvUmlnaHQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnN0YXRlLnJpZ2h0ID0gdHJ1ZTtcblx0fTtcblxuXHRyZXR1cm4gbmF2aWdhdGlvbjtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdVSScsIGZ1bmN0aW9uICgkcSwgJGxvZywgJHdpbmRvdywgJGludGVydmFsLCBTZWxlY3Rvck1ldGEsIFVzZXIsIERhdGEsIENvbnRyb2xzLCBuYXZpZ2F0aW9uLCBlbnZpcm9ubWVudCwgbG9jYXRvciwgc2VsZWN0b3IsIGFyY2hpdmUsIGJsb2NrVUkpIHtcblx0dmFyIEJPT0tfSU1BR0VfVVJMID0gJy9vYmovYm9va3Mve21vZGVsfS9pbWcuanBnJztcblx0dmFyIFVJID0ge21lbnU6IHt9fTtcblxuXHRVSS5tZW51LnNlbGVjdExpYnJhcnkgPSB7XG5cdFx0bGlzdDogW10sXG5cblx0XHR1cGRhdGVMaXN0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzY29wZSA9IHRoaXM7XG5cblx0XHQgICAgdmFyIHByb21pc2UgPSBEYXRhLmdldExpYnJhcmllcygpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHQgICAgICAgICAgICBzY29wZS5saXN0ID0gcmVzLmRhdGE7XG5cdCAgICBcdH0pO1xuXG5cdCAgICBcdHJldHVybiBwcm9taXNlO1xuXHRcdH0sXG5cblx0XHRnbzogZW52aXJvbm1lbnQuZ29Ub0xpYnJhcnlcblx0fTtcblxuXHRVSS5tZW51LmNyZWF0ZUxpYnJhcnkgPSB7XG5cdFx0bGlzdDogW10sXG5cdFx0bW9kZWw6IG51bGwsXG5cblx0XHRnZXRJbWc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMubW9kZWwgPyAnL29iai9saWJyYXJpZXMve21vZGVsfS9pbWcuanBnJy5yZXBsYWNlKCd7bW9kZWx9JywgdGhpcy5tb2RlbCkgOiBudWxsO1xuXHRcdH0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmKHRoaXMubW9kZWwpIHtcblx0XHRcdFx0RGF0YS5wb3N0TGlicmFyeSh0aGlzLm1vZGVsKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcblx0XHRcdFx0XHRlbnZpcm9ubWVudC5nb1RvTGlicmFyeShyZXN1bHQuaWQpO1xuXHRcdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0Ly9UT0RPOiBzaG93IGFuIGVycm9yXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cdFx0XG5cdH07XG5cblx0VUkubWVudS5jcmVhdGVTZWN0aW9uID0ge1xuXHRcdGxpc3Q6IFtdLFxuXHRcdG1vZGVsOiBudWxsLFxuXHRcdFxuXHRcdGdldEltZzogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5tb2RlbCA/ICcvb2JqL3NlY3Rpb25zL3ttb2RlbH0vaW1nLmpwZycucmVwbGFjZSgne21vZGVsfScsIHRoaXMubW9kZWwpIDogbnVsbDtcblx0XHR9LFxuXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmKHRoaXMubW9kZWwpIHtcblx0XHRcdFx0dmFyIHNlY3Rpb25EYXRhID0ge1xuXHRcdFx0XHRcdG1vZGVsOiB0aGlzLm1vZGVsLFxuXHRcdFx0XHRcdGxpYnJhcnlJZDogZW52aXJvbm1lbnQubGlicmFyeS5pZCxcblx0XHRcdFx0XHR1c2VySWQ6IFVzZXIuZ2V0SWQoKVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHRoaXMucGxhY2Uoc2VjdGlvbkRhdGEpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRwbGFjZTogZnVuY3Rpb24oZHRvKSB7XG5cdFx0XHQvL1RPRE86IGJsb2NrXG5cdFx0XHRsb2NhdG9yLnBsYWNlU2VjdGlvbihkdG8pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuXHRcdFx0XHQvL1RPRE86IHNob3cgYW4gZXJyb3Jcblx0XHRcdFx0JGxvZy5lcnJvcihlcnJvcik7XG5cdFx0XHR9KTtcdFxuXHRcdH1cblx0fTtcblxuXHRVSS5tZW51LmZlZWRiYWNrID0ge1xuXHRcdG1lc3NhZ2U6IG51bGwsXG5cdFx0c2hvdzogdHJ1ZSxcblxuXHRcdGNsb3NlOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuc2hvdyA9IGZhbHNlO1xuXHRcdH0sXG5cdFx0c3VibWl0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBkYXRhT2JqZWN0O1xuXHRcdFx0XG5cdFx0XHRpZih0aGlzLm1lc3NhZ2UpIHtcblx0XHRcdFx0ZGF0YU9iamVjdCA9IHtcblx0XHRcdFx0XHRtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXG5cdFx0XHRcdFx0dXNlcklkOiBVc2VyLmdldElkKClcblx0XHRcdFx0fTtcblxuXHRcdFx0XHREYXRhLnBvc3RGZWVkYmFjayhkYXRhT2JqZWN0KTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5jbG9zZSgpO1xuXHRcdH1cblx0fTtcblxuXHRVSS5tZW51Lm5hdmlnYXRpb24gPSB7XG5cdFx0c3RvcDogZnVuY3Rpb24oKSB7XG5cdFx0XHRuYXZpZ2F0aW9uLmdvU3RvcCgpO1xuXHRcdH0sXG5cdFx0Zm9yd2FyZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRuYXZpZ2F0aW9uLmdvRm9yd2FyZCgpO1xuXHRcdH0sXG5cdFx0YmFja3dhcmQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0bmF2aWdhdGlvbi5nb0JhY2t3YXJkKCk7XG5cdFx0fSxcblx0XHRsZWZ0OiBmdW5jdGlvbigpIHtcblx0XHRcdG5hdmlnYXRpb24uZ29MZWZ0KCk7XG5cdFx0fSxcblx0XHRyaWdodDogZnVuY3Rpb24oKSB7XG5cdFx0XHRuYXZpZ2F0aW9uLmdvUmlnaHQoKTtcblx0XHR9XG5cdH07XG5cblx0VUkubWVudS5sb2dpbiA9IHtcblx0XHRpc1Nob3c6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuICFVc2VyLmlzQXV0aG9yaXplZCgpICYmIFVzZXIuaXNMb2FkZWQoKTtcblx0XHR9LFxuXG5cdFx0Z29vZ2xlOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciB3aW4gPSAkd2luZG93Lm9wZW4oJy9hdXRoL2dvb2dsZScsICcnLCAnd2lkdGg9ODAwLGhlaWdodD02MDAsbW9kYWw9eWVzLGFsd2F5c1JhaXNlZD15ZXMnKTtcblx0XHQgICAgdmFyIGNoZWNrQXV0aFdpbmRvdyA9ICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0ICAgICAgICBpZiAod2luICYmIHdpbi5jbG9zZWQpIHtcblx0XHQgICAgICAgIFx0JGludGVydmFsLmNhbmNlbChjaGVja0F1dGhXaW5kb3cpO1xuXG5cdFx0ICAgICAgICBcdFVzZXIubG9hZCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdCAgICAgICAgXHRcdHJldHVybiBsb2FkVXNlckRhdGEoKTtcblx0XHQgICAgICAgIFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdCAgICAgICAgXHRcdCRsb2cubG9nKCdVc2VyIGxvYWRpbmQgZXJyb3InKTtcblx0XHRcdFx0XHRcdC8vVE9ETzogc2hvdyBlcnJvciBtZXNzYWdlICBcblx0XHQgICAgICAgIFx0fSk7XG5cdFx0ICAgICAgICB9XG5cdFx0ICAgIH0sIDEwMCk7XHRcdFx0XG5cdFx0fSxcblxuXHRcdGxvZ291dDogZnVuY3Rpb24oKSB7XG5cdFx0XHRVc2VyLmxvZ291dCgpLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICBcdFx0cmV0dXJuIGxvYWRVc2VyRGF0YSgpO1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHQkbG9nLmVycm9yKCdMb2dvdXQgZXJyb3InKTtcblx0XHRcdFx0Ly9UT0RPOiBzaG93IGFuIGVycm9yXG5cdFx0XHR9KTtcblx0XHR9XG5cdH07XG5cblx0VUkubWVudS5pbnZlbnRvcnkgPSB7XG5cdFx0c2VhcmNoOiBudWxsLFxuXHRcdGxpc3Q6IG51bGwsXG5cdFx0YmxvY2tlcjogJ2ludmVudG9yeScsXG5cdFxuXHRcdGV4cGFuZDogZnVuY3Rpb24oYm9vaykge1xuXHRcdFx0VUkubWVudS5jcmVhdGVCb29rLnNldEJvb2soYm9vayk7XG5cdFx0fSxcblx0XHRibG9jazogZnVuY3Rpb24oKSB7XG5cdFx0XHRibG9ja1VJLmluc3RhbmNlcy5nZXQodGhpcy5ibG9ja2VyKS5zdGFydCgpO1xuXHRcdH0sXG5cdFx0dW5ibG9jazogZnVuY3Rpb24oKSB7XG5cdFx0XHRibG9ja1VJLmluc3RhbmNlcy5nZXQodGhpcy5ibG9ja2VyKS5zdG9wKCk7XG5cdFx0fSxcblx0XHRpc1Nob3c6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIFVzZXIuaXNBdXRob3JpemVkKCk7XG5cdFx0fSxcblx0XHRpc0Jvb2tTZWxlY3RlZDogZnVuY3Rpb24oaWQpIHtcblx0XHRcdHJldHVybiBzZWxlY3Rvci5pc0Jvb2tTZWxlY3RlZChpZCk7XG5cdFx0fSxcblx0XHRzZWxlY3Q6IGZ1bmN0aW9uKGR0bykge1xuXHRcdFx0dmFyIGJvb2sgPSBlbnZpcm9ubWVudC5nZXRCb29rKGR0by5pZCk7XG5cdFx0XHR2YXIgbWV0YSA9IG5ldyBTZWxlY3Rvck1ldGEoYm9vayk7XG5cdFx0XHRzZWxlY3Rvci5zZWxlY3QobWV0YSk7XG5cdFx0fSxcblx0XHRhZGRCb29rOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuZXhwYW5kKHt1c2VySWQ6IFVzZXIuZ2V0SWQoKX0pO1xuXHRcdH0sXG5cdFx0cmVtb3ZlOiBmdW5jdGlvbihib29rKSB7XG5cdFx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdFx0XHRzY29wZS5ibG9jaygpO1xuXHRcdFx0RGF0YS5kZWxldGVCb29rKGJvb2spLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRlbnZpcm9ubWVudC5yZW1vdmVCb29rKHJlcy5kYXRhKTtcblx0XHRcdFx0cmV0dXJuIHNjb3BlLmxvYWREYXRhKCk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdFx0Ly9UT0RPOiBzaG93IGFuIGVycm9yXG5cdFx0XHRcdCRsb2cuZXJyb3IoZXJyb3IpO1xuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHNjb3BlLnVuYmxvY2soKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0cGxhY2U6IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRcdHZhciBzY29wZSA9IHRoaXM7XG5cdFx0XHR2YXIgcHJvbWlzZTtcblx0XHRcdHZhciBpc0Jvb2tQbGFjZWQgPSAhIWJvb2suc2VjdGlvbklkO1xuXG5cdFx0XHRzY29wZS5ibG9jaygpO1xuXHRcdFx0cHJvbWlzZSA9IGlzQm9va1BsYWNlZCA/IGxvY2F0b3IudW5wbGFjZUJvb2soYm9vaykgOiBsb2NhdG9yLnBsYWNlQm9vayhib29rKTtcblx0XHRcdHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiBzY29wZS5sb2FkRGF0YSgpO1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0XHRcdC8vVE9ETzogc2hvdyBhbiBlcnJvclxuXHRcdFx0XHQkbG9nLmVycm9yKGVycm9yKTtcblx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzY29wZS51bmJsb2NrKCk7IFxuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRsb2FkRGF0YTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdFx0dmFyIHByb21pc2U7XG5cblx0XHRcdHNjb3BlLmJsb2NrKCk7XG5cdFx0XHRwcm9taXNlID0gJHEud2hlbih0aGlzLmlzU2hvdygpID8gRGF0YS5nZXRVc2VyQm9va3MoVXNlci5nZXRJZCgpKSA6IG51bGwpLnRoZW4oZnVuY3Rpb24gKGJvb2tzKSB7XG5cdFx0XHRcdHNjb3BlLmxpc3QgPSBib29rcztcblx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzY29wZS51bmJsb2NrKCk7XHRcdFxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBwcm9taXNlO1xuXHRcdH1cblx0fTtcblxuXHRVSS5tZW51LmNyZWF0ZUJvb2sgPSB7XG5cdFx0bGlzdDogW10sXG5cdFx0Ym9vazoge30sXG5cdFx0Y292ZXJJbnB1dFVSTDogbnVsbCxcblxuXHRcdHNldEJvb2s6IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRcdHRoaXMuYm9vayA9IHt9OyAvLyBjcmVhdGUgbmV3IG9iamVjdCBmb3IgdW5iaW5kIGZyb20gc2NvcGVcblx0XHRcdGlmKGJvb2spIHtcblx0XHRcdFx0dGhpcy5ib29rLmlkID0gYm9vay5pZDtcblx0XHRcdFx0dGhpcy5ib29rLnVzZXJJZCA9IGJvb2sudXNlcklkO1xuXHRcdFx0XHR0aGlzLmJvb2subW9kZWwgPSBib29rLm1vZGVsO1xuXHRcdFx0XHR0aGlzLmJvb2suY292ZXIgPSBib29rLmNvdmVyO1xuXHRcdFx0XHR0aGlzLmJvb2sudGl0bGUgPSBib29rLnRpdGxlO1xuXHRcdFx0XHR0aGlzLmJvb2suYXV0aG9yID0gYm9vay5hdXRob3I7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRhcHBseUNvdmVyOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmKCF0aGlzLmlzQ292ZXJEaXNhYmxlZCgpKSB7XG5cdFx0XHRcdFVJLm1lbnUuaW52ZW50b3J5LmJsb2NrKCk7XG5cdFx0XHRcdGFyY2hpdmUuc2VuZEV4dGVybmFsVVJMKHRoaXMuY292ZXJJbnB1dFVSTCwgW3RoaXMuYm9vay50aXRsZSwgdGhpcy5ib29rLmF1dGhvcl0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuXHRcdFx0XHRcdFVJLm1lbnUuY3JlYXRlQm9vay5ib29rLmNvdmVyID0gcmVzdWx0LnVybDtcblx0XHRcdFx0XHRVSS5tZW51LmNyZWF0ZUJvb2suY292ZXJJbnB1dFVSTCA9IG51bGw7XG5cdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQkbG9nLmVycm9yKCdBcHBseSBjb3ZlciBlcnJvcicpO1xuXHRcdFx0XHRcdC8vVE9ETzogc2hvdyBhbiBlcnJvclxuXHRcdFx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRVSS5tZW51LmludmVudG9yeS51bmJsb2NrKCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JGxvZy5sb2coJ1RoZXJlIGFyZSBubyB0YWdzIGZvciBpbWFnZScpO1xuXHRcdFx0XHQvL1RPRE86IHNob3cgYW4gZXJyb3Jcblx0XHRcdH1cblx0XHR9LFxuXHRcdHJlbW92ZUNvdmVyOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuYm9vay5jb3ZlciA9IG51bGw7XG5cdFx0XHR0aGlzLmNvdmVySW5wdXRVUkwgPSBudWxsO1xuXHRcdH0sXG5cdFx0Z2V0SW1nOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLmJvb2subW9kZWwgPyBCT09LX0lNQUdFX1VSTC5yZXBsYWNlKCd7bW9kZWx9JywgdGhpcy5ib29rLm1vZGVsKSA6IG51bGw7XG5cdFx0fSxcblx0XHRnZXRDb3ZlckltZzogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pc0NvdmVyU2hvdyA/IHRoaXMuYm9vay5jb3ZlciA6IG51bGw7XG5cdFx0fSxcblx0XHRpc0NvdmVyRGlzYWJsZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuICEodGhpcy5ib29rLnRpdGxlICYmIHRoaXMuYm9vay5hdXRob3IpO1xuXHRcdH0sXG5cdFx0aXNDb3ZlclNob3c6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIEJvb2xlYW4odGhpcy5ib29rLmNvdmVyKTtcblx0XHR9LFxuXHRcdGlzU2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gISF0aGlzLmJvb2sudXNlcklkO1xuXHRcdH0sXG5cdFx0c2F2ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdFx0XG5cdFx0XHRVSS5tZW51LmludmVudG9yeS5ibG9jaygpO1xuXHRcdFx0RGF0YS5wb3N0Qm9vayh0aGlzLmJvb2spLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRlbnZpcm9ubWVudC51cGRhdGVCb29rKHJlcy5kYXRhKTtcblx0XHRcdFx0c2NvcGUuY2FuY2VsKCk7XG5cdFx0XHRcdHJldHVybiBVSS5tZW51LmludmVudG9yeS5sb2FkRGF0YSgpO1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuXHRcdFx0XHQkbG9nLmVycm9yKCdCb29rIHNhdmUgZXJyb3InKTtcblx0XHRcdFx0Ly9UT0RPOiBzaG93IGVycm9yXG5cdFx0XHR9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0VUkubWVudS5pbnZlbnRvcnkudW5ibG9jaygpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRjYW5jZWw6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5zZXRCb29rKCk7XG5cdFx0fVxuXHR9O1xuXG5cdFVJLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHQvL1RPRE86IG1vdmUgdG8gbWVudSBtb2RlbHNcblx0XHREYXRhLmdldFVJRGF0YSgpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0VUkubWVudS5jcmVhdGVMaWJyYXJ5Lmxpc3QgPSByZXMuZGF0YS5saWJyYXJpZXM7XG5cdFx0XHRVSS5tZW51LmNyZWF0ZVNlY3Rpb24ubGlzdCA9IHJlcy5kYXRhLmJvb2tzaGVsdmVzO1xuXHRcdFx0VUkubWVudS5jcmVhdGVCb29rLmxpc3QgPSByZXMuZGF0YS5ib29rcztcblxuXHRcdFx0cmV0dXJuIGxvYWRVc2VyRGF0YSgpO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdCRsb2cubG9nKCdVSSBpbml0IGVycm9yJyk7XG5cdFx0XHQvL1RPRE86IHNob3cgYW4gZXJyb3Jcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgbG9hZFVzZXJEYXRhID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICRxLmFsbChbXG5cdFx0XHRVSS5tZW51LnNlbGVjdExpYnJhcnkudXBkYXRlTGlzdCgpLCBcblx0XHRcdFVJLm1lbnUuaW52ZW50b3J5LmxvYWREYXRhKClcblx0XHRdKTtcblx0fTtcblxuXHRyZXR1cm4gVUk7XG59KTtcblxuLy8gVmlydHVhbEJvb2tzaGVsZi5VSS5pbml0Q29udHJvbHNFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2subW9kZWwub25jaGFuZ2UgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZU1vZGVsO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay50ZXh0dXJlLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VCb29rVGV4dHVyZTtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suY292ZXIub25jaGFuZ2UgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZUJvb2tDb3Zlcjtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suYXV0aG9yLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VTcGVjaWZpY1ZhbHVlKCdhdXRob3InLCAndGV4dCcpO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5hdXRob3JTaXplLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VTcGVjaWZpY1ZhbHVlKCdhdXRob3InLCAnc2l6ZScpO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5hdXRob3JDb2xvci5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSgnYXV0aG9yJywgJ2NvbG9yJyk7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLnRpdGxlLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VTcGVjaWZpY1ZhbHVlKCd0aXRsZScsICd0ZXh0Jyk7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLnRpdGxlU2l6ZS5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSgndGl0bGUnLCAnc2l6ZScpO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay50aXRsZUNvbG9yLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VTcGVjaWZpY1ZhbHVlKCd0aXRsZScsICdjb2xvcicpO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5lZGl0Q292ZXIub25jbGljayA9IFZpcnR1YWxCb29rc2hlbGYuVUkuc3dpdGNoRWRpdGVkO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5lZGl0QXV0aG9yLm9uY2xpY2sgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLnN3aXRjaEVkaXRlZDtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suZWRpdFRpdGxlLm9uY2xpY2sgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLnN3aXRjaEVkaXRlZDtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2sub2sub25jbGljayA9IFZpcnR1YWxCb29rc2hlbGYuVUkuc2F2ZUJvb2s7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmNhbmNlbC5vbmNsaWNrID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jYW5jZWxCb29rRWRpdDtcbi8vIH07XG5cbi8vIGNyZWF0ZSBib29rXG5cbi8vIFZpcnR1YWxCb29rc2hlbGYuVUkuc2hvd0NyZWF0ZUJvb2sgPSBmdW5jdGlvbigpIHtcbi8vIFx0dmFyIG1lbnVOb2RlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2s7XG5cbi8vIFx0aWYoVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5pc0Jvb2soKSkge1xuLy8gXHRcdG1lbnVOb2RlLnNob3coKTtcbi8vIFx0XHRtZW51Tm9kZS5zZXRWYWx1ZXMoKTtcbi8vIFx0fSBlbHNlIGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNTZWN0aW9uKCkpIHtcbi8vIFx0XHR2YXIgc2VjdGlvbiA9IFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0O1xuLy8gXHRcdHZhciBzaGVsZiA9IHNlY3Rpb24uZ2V0U2hlbGZCeVBvaW50KFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQucG9pbnQpO1xuLy8gXHRcdHZhciBmcmVlUG9zaXRpb24gPSBzZWN0aW9uLmdldEdldEZyZWVTaGVsZlBvc2l0aW9uKHNoZWxmLCB7eDogMC4wNSwgeTogMC4xMiwgejogMC4xfSk7IFxuLy8gXHRcdGlmKGZyZWVQb3NpdGlvbikge1xuLy8gXHRcdFx0bWVudU5vZGUuc2hvdygpO1xuXG4vLyBcdFx0XHR2YXIgZGF0YU9iamVjdCA9IHtcbi8vIFx0XHRcdFx0bW9kZWw6IG1lbnVOb2RlLm1vZGVsLnZhbHVlLCBcbi8vIFx0XHRcdFx0dGV4dHVyZTogbWVudU5vZGUudGV4dHVyZS52YWx1ZSwgXG4vLyBcdFx0XHRcdGNvdmVyOiBtZW51Tm9kZS5jb3Zlci52YWx1ZSxcbi8vIFx0XHRcdFx0cG9zX3g6IGZyZWVQb3NpdGlvbi54LFxuLy8gXHRcdFx0XHRwb3NfeTogZnJlZVBvc2l0aW9uLnksXG4vLyBcdFx0XHRcdHBvc196OiBmcmVlUG9zaXRpb24ueixcbi8vIFx0XHRcdFx0c2VjdGlvbklkOiBzZWN0aW9uLmRhdGFPYmplY3QuaWQsXG4vLyBcdFx0XHRcdHNoZWxmSWQ6IHNoZWxmLmlkLFxuLy8gXHRcdFx0XHR1c2VySWQ6IFZpcnR1YWxCb29rc2hlbGYudXNlci5pZFxuLy8gXHRcdFx0fTtcblxuLy8gXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5EYXRhLmNyZWF0ZUJvb2soZGF0YU9iamVjdCwgZnVuY3Rpb24gKGJvb2ssIGRhdGFPYmplY3QpIHtcbi8vIFx0XHRcdFx0Ym9vay5wYXJlbnQgPSBzaGVsZjtcbi8vIFx0XHRcdFx0VmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3QgPSBib29rO1xuLy8gXHRcdFx0XHRWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmdldCgpO1xuLy8gXHRcdFx0fSk7XG4vLyBcdFx0fSBlbHNlIHtcbi8vIFx0XHRcdGFsZXJ0KCdUaGVyZSBpcyBubyBmcmVlIHNwYWNlIG9uIHNlbGVjdGVkIHNoZWxmLicpO1xuLy8gXHRcdH1cbi8vIFx0fVxuLy8gfVxuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZU1vZGVsID0gZnVuY3Rpb24oKSB7XG4vLyBcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNCb29rKCkpIHtcbi8vIFx0XHR2YXIgb2xkQm9vayA9IFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0O1xuLy8gXHRcdHZhciBkYXRhT2JqZWN0ID0ge1xuLy8gXHRcdFx0bW9kZWw6IHRoaXMudmFsdWUsXG4vLyBcdFx0XHR0ZXh0dXJlOiBvbGRCb29rLnRleHR1cmUudG9TdHJpbmcoKSxcbi8vIFx0XHRcdGNvdmVyOiBvbGRCb29rLmNvdmVyLnRvU3RyaW5nKClcbi8vIFx0XHR9O1xuXG4vLyBcdFx0VmlydHVhbEJvb2tzaGVsZi5EYXRhLmNyZWF0ZUJvb2soZGF0YU9iamVjdCwgZnVuY3Rpb24gKGJvb2ssIGRhdGFPYmplY3QpIHtcbi8vIFx0XHRcdGJvb2suY29weVN0YXRlKG9sZEJvb2spO1xuLy8gXHRcdH0pO1xuLy8gXHR9XG4vLyB9XG5cbi8vIFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlQm9va1RleHR1cmUgPSBmdW5jdGlvbigpIHtcbi8vIFx0aWYoVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5pc0Jvb2soKSkge1xuLy8gXHRcdHZhciBib29rID0gVmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3Q7XG4vLyBcdFx0Ym9vay50ZXh0dXJlLmxvYWQodGhpcy52YWx1ZSwgZmFsc2UsIGZ1bmN0aW9uICgpIHtcbi8vIFx0XHRcdGJvb2sudXBkYXRlVGV4dHVyZSgpO1xuLy8gXHRcdH0pO1xuLy8gXHR9XG4vLyB9XG5cbi8vIFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlQm9va0NvdmVyID0gZnVuY3Rpb24oKSB7XG4vLyBcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNCb29rKCkpIHtcbi8vIFx0XHR2YXIgYm9vayA9IFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0O1xuLy8gXHRcdGJvb2suY292ZXIubG9hZCh0aGlzLnZhbHVlLCB0cnVlLCBmdW5jdGlvbigpIHtcbi8vIFx0XHRcdGJvb2sudXBkYXRlVGV4dHVyZSgpO1xuLy8gXHRcdH0pO1xuLy8gXHR9XG4vLyB9XG5cbi8vIFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSA9IGZ1bmN0aW9uKGZpZWxkLCBwcm9wZXJ0eSkge1xuLy8gXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuLy8gXHRcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNCb29rKCkpIHtcbi8vIFx0XHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0W2ZpZWxkXVtwcm9wZXJ0eV0gPSB0aGlzLnZhbHVlO1xuLy8gXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3QudXBkYXRlVGV4dHVyZSgpO1xuLy8gXHRcdH1cbi8vIFx0fTtcbi8vIH07XG5cbi8vIFZpcnR1YWxCb29rc2hlbGYuVUkuc3dpdGNoRWRpdGVkID0gZnVuY3Rpb24oKSB7XG4vLyBcdHZhciBhY3RpdmVFbGVtZXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYS5hY3RpdmVFZGl0Jyk7XG5cbi8vIFx0Zm9yKHZhciBpID0gYWN0aXZlRWxlbWV0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuLy8gXHRcdGFjdGl2ZUVsZW1ldHNbaV0uY2xhc3NOYW1lID0gJ2luYWN0aXZlRWRpdCc7XG4vLyBcdH07XG5cbi8vIFx0dmFyIHByZXZpb3VzRWRpdGVkID0gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suZWRpdGVkO1xuLy8gXHR2YXIgY3VycmVudEVkaXRlZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdlZGl0Jyk7XG5cbi8vIFx0aWYocHJldmlvdXNFZGl0ZWQgIT0gY3VycmVudEVkaXRlZCkge1xuLy8gXHRcdHRoaXMuY2xhc3NOYW1lID0gJ2FjdGl2ZUVkaXQnO1xuLy8gXHRcdFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmVkaXRlZCA9IGN1cnJlbnRFZGl0ZWQ7XG4vLyBcdH0gZWxzZSB7XG4vLyBcdFx0VmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suZWRpdGVkID0gbnVsbDtcbi8vIFx0fVxuLy8gfVxuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLnNhdmVCb29rID0gZnVuY3Rpb24oKSB7XG4vLyBcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNCb29rKCkpIHtcbi8vIFx0XHR2YXIgYm9vayA9IFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0O1xuXG4vLyBcdFx0VmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5wdXQoKTtcbi8vIFx0XHRib29rLnNhdmUoKTtcbi8vIFx0fVxuLy8gfVxuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLmNhbmNlbEJvb2tFZGl0ID0gZnVuY3Rpb24oKSB7XG4vLyBcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNCb29rKCkpIHtcbi8vIFx0XHR2YXIgYm9vayA9IFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0O1xuXHRcdFxuLy8gXHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQucHV0KCk7XG4vLyBcdFx0Ym9vay5yZWZyZXNoKCk7XG4vLyBcdH1cbi8vIH0iLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnVXNlcicsIGZ1bmN0aW9uICgkbG9nLCBEYXRhKSB7XG5cdHZhciB1c2VyID0ge307XG5cblx0dmFyIGxvYWRlZCA9IGZhbHNlO1xuXHR2YXIgX2RhdGFPYmplY3QgPSBudWxsO1xuXHR2YXIgX3Bvc2l0aW9uID0gbnVsbDtcblx0dmFyIF9saWJyYXJ5ID0gbnVsbDtcblxuXHR1c2VyLmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdFx0cmV0dXJuIERhdGEuZ2V0VXNlcigpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0c2NvcGUuc2V0RGF0YU9iamVjdChyZXMuZGF0YSk7XG5cdFx0XHRzY29wZS5zZXRMaWJyYXJ5KCk7XG5cdFx0XHRsb2FkZWQgPSB0cnVlO1xuXG5cdFx0XHQkbG9nLmxvZygndXNlciBsb2FkZWQnKTtcblx0XHR9KTtcblx0fTtcblxuXHR1c2VyLmxvZ291dCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBEYXRhLmxvZ291dCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHVzZXIubG9hZCgpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHVzZXIuc2V0RGF0YU9iamVjdCA9IGZ1bmN0aW9uKGRhdGFPYmplY3QpIHtcblx0XHRfZGF0YU9iamVjdCA9IGRhdGFPYmplY3Q7XG5cdH07XG5cblx0dXNlci5nZXRMaWJyYXJ5ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIF9saWJyYXJ5O1xuXHR9O1xuXG5cdHVzZXIuc2V0TGlicmFyeSA9IGZ1bmN0aW9uKGxpYnJhcnlJZCkge1xuXHRcdF9saWJyYXJ5ID0gbGlicmFyeUlkIHx8IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zdWJzdHJpbmcoMSk7XG5cdH07XG5cblx0dXNlci5nZXRJZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBfZGF0YU9iamVjdCAmJiBfZGF0YU9iamVjdC5pZDtcblx0fTtcblxuXHR1c2VyLmlzQXV0aG9yaXplZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBCb29sZWFuKF9kYXRhT2JqZWN0KTtcblx0fTtcblxuXHR1c2VyLmlzTG9hZGVkID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGxvYWRlZDtcblx0fVxuXG5cdHJldHVybiB1c2VyO1xufSk7XG4iLCIvLyBUaGlzIFRIUkVFeCBoZWxwZXIgbWFrZXMgaXQgZWFzeSB0byBoYW5kbGUgd2luZG93IHJlc2l6ZS5cbi8vIEl0IHdpbGwgdXBkYXRlIHJlbmRlcmVyIGFuZCBjYW1lcmEgd2hlbiB3aW5kb3cgaXMgcmVzaXplZC5cbi8vXG4vLyAjIFVzYWdlXG4vL1xuLy8gKipTdGVwIDEqKjogU3RhcnQgdXBkYXRpbmcgcmVuZGVyZXIgYW5kIGNhbWVyYVxuLy9cbi8vIGBgYHZhciB3aW5kb3dSZXNpemUgPSBuZXcgVEhSRUV4LldpbmRvd1Jlc2l6ZShhUmVuZGVyZXIsIGFDYW1lcmEpYGBgXG4vLyAgICBcbi8vICoqU3RlcCAyKio6IHN0b3AgdXBkYXRpbmcgcmVuZGVyZXIgYW5kIGNhbWVyYVxuLy9cbi8vIGBgYHdpbmRvd1Jlc2l6ZS5kZXN0cm95KClgYGBcbi8vICMgQ29kZVxuXG4vL1xuXG4vKiogQG5hbWVzcGFjZSAqL1xudmFyIFRIUkVFeFx0PSBUSFJFRXggfHwge31cblxuLyoqXG4gKiBVcGRhdGUgcmVuZGVyZXIgYW5kIGNhbWVyYSB3aGVuIHRoZSB3aW5kb3cgaXMgcmVzaXplZFxuICogXG4gKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyZXIgdGhlIHJlbmRlcmVyIHRvIHVwZGF0ZVxuICogQHBhcmFtIHtPYmplY3R9IENhbWVyYSB0aGUgY2FtZXJhIHRvIHVwZGF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZGltZW5zaW9uIGNhbGxiYWNrIGZvciByZW5kZXJlciBzaXplXG4qL1xuVEhSRUV4LldpbmRvd1Jlc2l6ZVx0PSBmdW5jdGlvbihyZW5kZXJlciwgY2FtZXJhLCBkaW1lbnNpb24pe1xuXHRkaW1lbnNpb24gXHQ9IGRpbWVuc2lvbiB8fCBmdW5jdGlvbigpeyByZXR1cm4geyB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0IH0gfVxuXHR2YXIgY2FsbGJhY2tcdD0gZnVuY3Rpb24oKXtcblx0XHQvLyBmZXRjaCB0YXJnZXQgcmVuZGVyZXIgc2l6ZVxuXHRcdHZhciByZW5kZXJlclNpemUgPSBkaW1lbnNpb24oKTtcblx0XHQvLyBub3RpZnkgdGhlIHJlbmRlcmVyIG9mIHRoZSBzaXplIGNoYW5nZVxuXHRcdHJlbmRlcmVyLnNldFNpemUoIHJlbmRlcmVyU2l6ZS53aWR0aCwgcmVuZGVyZXJTaXplLmhlaWdodCApXG5cdFx0Ly8gdXBkYXRlIHRoZSBjYW1lcmFcblx0XHRjYW1lcmEuYXNwZWN0XHQ9IHJlbmRlcmVyU2l6ZS53aWR0aCAvIHJlbmRlcmVyU2l6ZS5oZWlnaHRcblx0XHRjYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpXG5cdH1cblx0Ly8gYmluZCB0aGUgcmVzaXplIGV2ZW50XG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBjYWxsYmFjaywgZmFsc2UpXG5cdC8vIHJldHVybiAuc3RvcCgpIHRoZSBmdW5jdGlvbiB0byBzdG9wIHdhdGNoaW5nIHdpbmRvdyByZXNpemVcblx0cmV0dXJuIHtcblx0XHR0cmlnZ2VyXHQ6IGZ1bmN0aW9uKCl7XG5cdFx0XHRjYWxsYmFjaygpXG5cdFx0fSxcblx0XHQvKipcblx0XHQgKiBTdG9wIHdhdGNoaW5nIHdpbmRvdyByZXNpemVcblx0XHQqL1xuXHRcdGRlc3Ryb3lcdDogZnVuY3Rpb24oKXtcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBjYWxsYmFjaylcblx0XHR9XG5cdH1cbn1cbiIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdCYXNlT2JqZWN0JywgZnVuY3Rpb24gKCkge1xuXHR2YXIgQmFzZU9iamVjdCA9IGZ1bmN0aW9uKGRhdGFPYmplY3QsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuXHRcdFRIUkVFLk1lc2guY2FsbCh0aGlzLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG5cdFx0dGhpcy5kYXRhT2JqZWN0ID0gZGF0YU9iamVjdCB8fCB7fTtcblx0XHR0aGlzLmRhdGFPYmplY3Qucm90YXRpb24gPSB0aGlzLmRhdGFPYmplY3Qucm90YXRpb24gfHwgWzAsIDAsIDBdO1xuXHRcdFxuXHRcdHRoaXMuaWQgPSB0aGlzLmRhdGFPYmplY3QuaWQ7XG5cdFx0dGhpcy5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKHRoaXMuZGF0YU9iamVjdC5wb3NfeCwgdGhpcy5kYXRhT2JqZWN0LnBvc195LCB0aGlzLmRhdGFPYmplY3QucG9zX3opO1xuXHRcdHRoaXMucm90YXRpb24ub3JkZXIgPSAnWFlaJztcblx0XHR0aGlzLnJvdGF0aW9uLmZyb21BcnJheSh0aGlzLmRhdGFPYmplY3Qucm90YXRpb24ubWFwKE51bWJlcikpO1xuXG5cdFx0dGhpcy51cGRhdGVNYXRyaXgoKTtcblxuXHRcdC8vVE9ETzogcmVzZWFyY2gsIGFmdGVyIGNhY2hpbmcgZ2VvbWV0cnkgdGhpcyBjYW4gYmUgcnVuIG9uY2Vcblx0XHR0aGlzLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ0JveCgpO1xuXHRcdFxuXHRcdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcdFx0XG5cdH07XG5cdFxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZSA9IG5ldyBUSFJFRS5NZXNoKCk7XG5cdEJhc2VPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQmFzZU9iamVjdDtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5nZXRUeXBlID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMudHlwZTtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5pc091dE9mUGFycmVudCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci54IC0gdGhpcy5wYXJlbnQuYm91bmRpbmdCb3guY2VudGVyLngpID4gKHRoaXMucGFyZW50LmJvdW5kaW5nQm94LnJhZGl1cy54IC0gdGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueClcblx0XHRcdC8vfHwgTWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueSAtIHRoaXMucGFyZW50LmJvdW5kaW5nQm94LmNlbnRlci55KSA+ICh0aGlzLnBhcmVudC5ib3VuZGluZ0JveC5yYWRpdXMueSAtIHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLnkpXG5cdFx0XHR8fCBNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci56IC0gdGhpcy5wYXJlbnQuYm91bmRpbmdCb3guY2VudGVyLnopID4gKHRoaXMucGFyZW50LmJvdW5kaW5nQm94LnJhZGl1cy56IC0gdGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueik7XG5cdH07XG5cblx0QmFzZU9iamVjdC5wcm90b3R5cGUuaXNDb2xsaWRlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhclxuXHRcdFx0cmVzdWx0LFxuXHRcdFx0dGFyZ2V0cyxcblx0XHRcdHRhcmdldCxcblx0XHRcdGk7XG5cblx0XHR0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KCk7XG5cblx0XHRyZXN1bHQgPSB0aGlzLmlzT3V0T2ZQYXJyZW50KCk7XG5cdFx0dGFyZ2V0cyA9IHRoaXMucGFyZW50LmNoaWxkcmVuO1xuXG5cdFx0aWYoIXJlc3VsdCkge1xuXHRcdFx0Zm9yKGkgPSB0YXJnZXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdHRhcmdldCA9IHRhcmdldHNbaV0uYm91bmRpbmdCb3g7XG5cblx0XHRcdFx0aWYodGFyZ2V0c1tpXSA9PT0gdGhpcyBcblx0XHRcdFx0fHwgIXRhcmdldCAvLyBjaGlsZHJlbiB3aXRob3V0IEJCXG5cdFx0XHRcdHx8IChNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci54IC0gdGFyZ2V0LmNlbnRlci54KSA+ICh0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy54ICsgdGFyZ2V0LnJhZGl1cy54KSlcblx0XHRcdFx0fHwgKE1hdGguYWJzKHRoaXMuYm91bmRpbmdCb3guY2VudGVyLnkgLSB0YXJnZXQuY2VudGVyLnkpID4gKHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLnkgKyB0YXJnZXQucmFkaXVzLnkpKVxuXHRcdFx0XHR8fCAoTWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueiAtIHRhcmdldC5jZW50ZXIueikgPiAodGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueiArIHRhcmdldC5yYWRpdXMueikpKSB7XHRcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0ICAgIFx0cmVzdWx0ID0gdHJ1ZTtcdFx0XG5cdFx0ICAgIFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24obmV3UG9zaXRpb24pIHtcblx0XHR2YXIgXG5cdFx0XHRjdXJyZW50UG9zaXRpb24sXG5cdFx0XHRyZXN1bHQ7XG5cblx0XHRyZXN1bHQgPSBmYWxzZTtcblx0XHRjdXJyZW50UG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmNsb25lKCk7XG5cdFx0XG5cdFx0aWYobmV3UG9zaXRpb24ueCkge1xuXHRcdFx0dGhpcy5wb3NpdGlvbi5zZXRYKG5ld1Bvc2l0aW9uLngpO1xuXG5cdFx0XHRpZih0aGlzLmlzQ29sbGlkZWQoKSkge1xuXHRcdFx0XHR0aGlzLnBvc2l0aW9uLnNldFgoY3VycmVudFBvc2l0aW9uLngpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZihuZXdQb3NpdGlvbi56KSB7XG5cdFx0XHR0aGlzLnBvc2l0aW9uLnNldFoobmV3UG9zaXRpb24ueik7XG5cblx0XHRcdGlmKHRoaXMuaXNDb2xsaWRlZCgpKSB7XG5cdFx0XHRcdHRoaXMucG9zaXRpb24uc2V0WihjdXJyZW50UG9zaXRpb24ueik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuY2hhbmdlZCA9IHRoaXMuY2hhbmdlZCB8fCByZXN1bHQ7XG5cdFx0dGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5yb3RhdGUgPSBmdW5jdGlvbihkWCwgZFksIGlzRGVtbykge1xuXHRcdHZhciBcblx0XHRcdGN1cnJlbnRSb3RhdGlvbiA9IHRoaXMucm90YXRpb24uY2xvbmUoKSxcblx0XHRcdHJlc3VsdCA9IGZhbHNlOyBcblx0XHRcblx0XHRpZihkWCkge1xuXHRcdFx0dGhpcy5yb3RhdGlvbi55ICs9IGRYICogMC4wMTtcblxuXHRcdFx0aWYoIWlzRGVtbyAmJiB0aGlzLmlzQ29sbGlkZWQoKSkge1xuXHRcdFx0XHR0aGlzLnJvdGF0aW9uLnkgPSBjdXJyZW50Um90YXRpb24ueTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYoZFkpIHtcblx0XHRcdHRoaXMucm90YXRpb24ueCArPSBkWSAqIDAuMDE7XG5cblx0XHRcdGlmKCFpc0RlbW8gJiYgdGhpcy5pc0NvbGxpZGVkKCkpIHtcblx0XHRcdFx0dGhpcy5yb3RhdGlvbi54ID0gY3VycmVudFJvdGF0aW9uLng7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuY2hhbmdlZCA9IHRoaXMuY2hhbmdlZCB8fCAoIWlzRGVtbyAmJiByZXN1bHQpO1xuXHRcdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS51cGRhdGVCb3VuZGluZ0JveCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhclxuXHRcdFx0Ym91bmRpbmdCb3gsXG5cdFx0XHRyYWRpdXMsXG5cdFx0XHRjZW50ZXI7XG5cblx0XHR0aGlzLnVwZGF0ZU1hdHJpeCgpO1xuXHRcdGJvdW5kaW5nQm94ID0gdGhpcy5nZW9tZXRyeS5ib3VuZGluZ0JveC5jbG9uZSgpLmFwcGx5TWF0cml4NCh0aGlzLm1hdHJpeCk7XG5cdFx0XG5cdFx0cmFkaXVzID0ge1xuXHRcdFx0eDogKGJvdW5kaW5nQm94Lm1heC54IC0gYm91bmRpbmdCb3gubWluLngpICogMC41LFxuXHRcdFx0eTogKGJvdW5kaW5nQm94Lm1heC55IC0gYm91bmRpbmdCb3gubWluLnkpICogMC41LFxuXHRcdFx0ejogKGJvdW5kaW5nQm94Lm1heC56IC0gYm91bmRpbmdCb3gubWluLnopICogMC41XG5cdFx0fTtcblxuXHRcdGNlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IzKFxuXHRcdFx0cmFkaXVzLnggKyBib3VuZGluZ0JveC5taW4ueCxcblx0XHRcdHJhZGl1cy55ICsgYm91bmRpbmdCb3gubWluLnksXG5cdFx0XHRyYWRpdXMueiArIGJvdW5kaW5nQm94Lm1pbi56XG5cdFx0KTtcblxuXHRcdHRoaXMuYm91bmRpbmdCb3ggPSB7XG5cdFx0XHRyYWRpdXM6IHJhZGl1cyxcblx0XHRcdGNlbnRlcjogY2VudGVyXG5cdFx0fTtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5yZWxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnBvc2l0aW9uLnNldFgodGhpcy5kYXRhT2JqZWN0LnBvc194KTtcblx0XHR0aGlzLnBvc2l0aW9uLnNldFkodGhpcy5kYXRhT2JqZWN0LnBvc195KTtcblx0XHR0aGlzLnBvc2l0aW9uLnNldFoodGhpcy5kYXRhT2JqZWN0LnBvc196KTtcblx0XHR0aGlzLnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcblx0fTtcblxuXHRyZXR1cm4gQmFzZU9iamVjdDtcdFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0Jvb2tPYmplY3QnLCBmdW5jdGlvbiAoQmFzZU9iamVjdCwgQ2FudmFzVGV4dCwgQ2FudmFzSW1hZ2UsIERhdGEpIHtcdFxuXHR2YXIgQm9va09iamVjdCA9IGZ1bmN0aW9uKGRhdGFPYmplY3QsIGdlb21ldHJ5LCBtYXRlcmlhbCwgbWFwSW1hZ2UsIGNvdmVySW1hZ2UpIHtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsKTtcblx0XHRcblx0XHR0aGlzLm1vZGVsID0gdGhpcy5kYXRhT2JqZWN0Lm1vZGVsO1xuXHRcdHRoaXMuY2FudmFzID0gbWF0ZXJpYWwubWFwLmltYWdlO1xuXHRcdHRoaXMudGV4dHVyZSA9IG5ldyBDYW52YXNJbWFnZShudWxsLCBudWxsLCBtYXBJbWFnZSk7XG5cdFx0dGhpcy5jb3ZlciA9IG5ldyBDYW52YXNJbWFnZSh0aGlzLmRhdGFPYmplY3QuY292ZXJQb3MsIHRoaXMuZGF0YU9iamVjdC5jb3ZlciwgY292ZXJJbWFnZSk7XG5cdFx0dGhpcy5hdXRob3IgPSBuZXcgQ2FudmFzVGV4dCh0aGlzLmRhdGFPYmplY3QuYXV0aG9yLCB0aGlzLmRhdGFPYmplY3QuYXV0aG9yRm9udCk7XG5cdFx0dGhpcy50aXRsZSA9IG5ldyBDYW52YXNUZXh0KHRoaXMuZGF0YU9iamVjdC50aXRsZSwgdGhpcy5kYXRhT2JqZWN0LnRpdGxlRm9udCk7XG5cblx0XHR0aGlzLnVwZGF0ZVRleHR1cmUoKTtcblx0fTtcblxuXHRCb29rT2JqZWN0LlRZUEUgPSAnQm9va09iamVjdCc7XG5cblx0Qm9va09iamVjdC5wcm90b3R5cGUgPSBuZXcgQmFzZU9iamVjdCgpO1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEJvb2tPYmplY3Q7XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnRleHROb2RlcyA9IFsnYXV0aG9yJywgJ3RpdGxlJ107XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnR5cGUgPSBCb29rT2JqZWN0LlRZUEU7XG5cblx0Qm9va09iamVjdC5wcm90b3R5cGUudXBkYXRlVGV4dHVyZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBjb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHR2YXIgY292ZXIgPSB0aGlzLmNvdmVyO1xuXG5cdFx0aWYodGhpcy50ZXh0dXJlLmltYWdlKSB7XG5cdFx0XHRjb250ZXh0LmRyYXdJbWFnZSh0aGlzLnRleHR1cmUuaW1hZ2UsIDAsIDApO1xuXHRcdH1cblxuXHRcdGlmKGNvdmVyLmltYWdlKSB7XG5cdFx0XHR2YXIgZGlmZiA9IGNvdmVyLnkgKyBjb3Zlci5oZWlnaHQgLSBEYXRhLkNPVkVSX01BWF9ZO1xuXHRcdCBcdHZhciBsaW1pdGVkSGVpZ2h0ID0gZGlmZiA+IDAgPyBjb3Zlci5oZWlnaHQgLSBkaWZmIDogY292ZXIuaGVpZ2h0O1xuXHRcdCBcdHZhciBjcm9wSGVpZ2h0ID0gZGlmZiA+IDAgPyBjb3Zlci5pbWFnZS5uYXR1cmFsSGVpZ2h0IC0gKGNvdmVyLmltYWdlLm5hdHVyYWxIZWlnaHQgLyBjb3Zlci5oZWlnaHQgKiBkaWZmKSA6IGNvdmVyLmltYWdlLm5hdHVyYWxIZWlnaHQ7XG5cblx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKGNvdmVyLmltYWdlLCAwLCAwLCBjb3Zlci5pbWFnZS5uYXR1cmFsV2lkdGgsIGNyb3BIZWlnaHQsIGNvdmVyLngsIGNvdmVyLnksIGNvdmVyLndpZHRoLCBsaW1pdGVkSGVpZ2h0KTtcblx0XHR9XG5cblx0XHRmb3IodmFyIGkgPSB0aGlzLnRleHROb2Rlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0dmFyIHRleHROb2RlID0gdGhpc1t0aGlzLnRleHROb2Rlc1tpXV07XG5cblx0XHRcdGlmKHRleHROb2RlLmlzVmFsaWQoKSkge1xuXG5cdFx0XHRcdGNvbnRleHQuZm9udCA9IHRleHROb2RlLmdldEZvbnQoKTtcblx0XHRcdFx0Y29udGV4dC5maWxsU3R5bGUgPSB0ZXh0Tm9kZS5jb2xvcjtcblx0XHQgICAgXHRjb250ZXh0LmZpbGxUZXh0KHRleHROb2RlLnRleHQsIHRleHROb2RlLngsIHRleHROb2RlLnksIHRleHROb2RlLndpZHRoKTtcblx0XHQgICAgfVxuXHRcdH1cblxuXHRcdHRoaXMubWF0ZXJpYWwubWFwLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblx0fTtcblx0Qm9va09iamVjdC5wcm90b3R5cGUubW92ZUVsZW1lbnQgPSBmdW5jdGlvbihkWCwgZFksIGVsZW1lbnQpIHtcblx0XHR2YXIgZWxlbWVudCA9IGVsZW1lbnQgJiYgdGhpc1tlbGVtZW50XTtcblx0XHRcblx0XHRpZihlbGVtZW50KSB7XG5cdFx0XHRpZihlbGVtZW50Lm1vdmUpIHtcblx0XHRcdFx0ZWxlbWVudC5tb3ZlKGRYLCBkWSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlbGVtZW50LnggKz0gZFg7XG5cdFx0XHRcdGVsZW1lbnQueSArPSBkWTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy51cGRhdGVUZXh0dXJlKCk7XG5cdFx0fVxuXHR9O1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5zY2FsZUVsZW1lbnQgPSBmdW5jdGlvbihkWCwgZFkpIHtcblx0XHR0aGlzLmNvdmVyLndpZHRoICs9IGRYO1xuXHRcdHRoaXMuY292ZXIuaGVpZ2h0ICs9IGRZO1xuXHRcdHRoaXMudXBkYXRlVGV4dHVyZSgpO1xuXHR9O1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblxuXHRcdHRoaXMuZGF0YU9iamVjdC5tb2RlbCA9IHRoaXMubW9kZWw7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LnRleHR1cmUgPSB0aGlzLnRleHR1cmUudG9TdHJpbmcoKTtcblx0XHR0aGlzLmRhdGFPYmplY3QuY292ZXIgPSB0aGlzLmNvdmVyLnRvU3RyaW5nKCk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LmNvdmVyUG9zID0gdGhpcy5jb3Zlci5zZXJpYWxpemVQcm9wZXJ0aWVzKCk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LmF1dGhvciA9IHRoaXMuYXV0aG9yLnRvU3RyaW5nKCk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LmF1dGhvckZvbnQgPSB0aGlzLmF1dGhvci5zZXJpYWxpemVGb250KCk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LnRpdGxlID0gdGhpcy50aXRsZS50b1N0cmluZygpO1xuXHRcdHRoaXMuZGF0YU9iamVjdC50aXRsZUZvbnQgPSB0aGlzLnRpdGxlLnNlcmlhbGl6ZUZvbnQoKTtcblx0XHR0aGlzLmRhdGFPYmplY3QucG9zX3ggPSB0aGlzLnBvc2l0aW9uLng7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LnBvc195ID0gdGhpcy5wb3NpdGlvbi55O1xuXHRcdHRoaXMuZGF0YU9iamVjdC5wb3NfeiA9IHRoaXMucG9zaXRpb24uejtcblxuXHRcdERhdGEucG9zdEJvb2sodGhpcy5kYXRhT2JqZWN0LCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuXHRcdFx0aWYoIWVyciAmJiByZXN1bHQpIHtcblx0XHRcdFx0c2NvcGUuZGF0YU9iamVjdCA9IHJlc3VsdDtcblx0XHRcdFx0c2NvcGUuY2hhbmdlZCA9IGZhbHNlO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly9UT0RPOiBoaWRlIGVkaXQsIG5vdGlmeSB1c2VyXG5cdFx0XHR9XG5cdFx0fSk7XG5cdH07XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdC8vVE9ETzogdXNlIGluIGNvbnN0cnVjdG9yIGluc3RlYWQgb2Ygc2VwYXJhdGUgaW1hZ2VzIGxvYWRpbmdcblx0XHRzY29wZS50ZXh0dXJlLmxvYWQoc2NvcGUuZGF0YU9iamVjdC50ZXh0dXJlLCBmYWxzZSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0c2NvcGUuY292ZXIubG9hZChzY29wZS5kYXRhT2JqZWN0LmNvdmVyLCB0cnVlLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0c2NvcGUubW9kZWwgPSBzY29wZS5kYXRhT2JqZWN0Lm1vZGVsO1xuXHRcdFx0XHRzY29wZS5jb3Zlci5wYXJzZVByb3BlcnRpZXMoc2NvcGUuZGF0YU9iamVjdC5jb3ZlclBvcyk7XG5cdFx0XHRcdHNjb3BlLmF1dGhvci5zZXRUZXh0KHNjb3BlLmRhdGFPYmplY3QuYXV0aG9yKTtcblx0XHRcdFx0c2NvcGUuYXV0aG9yLnBhcnNlUHJvcGVydGllcyhzY29wZS5kYXRhT2JqZWN0LmF1dGhvckZvbnQpO1xuXHRcdFx0XHRzY29wZS50aXRsZS5zZXRUZXh0KHNjb3BlLmRhdGFPYmplY3QudGl0bGUpO1xuXHRcdFx0XHRzY29wZS50aXRsZS5wYXJzZVByb3BlcnRpZXMoc2NvcGUuZGF0YU9iamVjdC50aXRsZUZvbnQpO1xuXG5cdFx0XHRcdHNjb3BlLnVwZGF0ZVRleHR1cmUoKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9O1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5jb3B5U3RhdGUgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0aWYoYm9vayBpbnN0YW5jZW9mIEJvb2tPYmplY3QpIHtcblx0XHRcdHZhciBmaWVsZHMgPSBbJ2RhdGFPYmplY3QnLCAncG9zaXRpb24nLCAncm90YXRpb24nLCAnbW9kZWwnLCAndGV4dHVyZScsICdjb3ZlcicsICdhdXRob3InLCAndGl0bGUnXTtcblx0XHRcdGZvcih2YXIgaSA9IGZpZWxkcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0XHR2YXIgZmllbGQgPSBmaWVsZHNbaV07XG5cdFx0XHRcdHRoaXNbZmllbGRdID0gYm9va1tmaWVsZF07XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLnVwZGF0ZVRleHR1cmUoKTtcblx0XHRcdGJvb2sucGFyZW50LmFkZCh0aGlzKTtcblx0XHRcdGJvb2sucGFyZW50LnJlbW92ZShib29rKTtcblx0XHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0ID0gdGhpcztcblx0XHR9XG5cdH07XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnNldFBhcmVudCA9IGZ1bmN0aW9uKHBhcmVudCkge1xuXHRcdGlmKHRoaXMucGFyZW50ICE9IHBhcmVudCkge1xuXHRcdFx0aWYocGFyZW50KSB7XG5cdFx0XHRcdHBhcmVudC5hZGQodGhpcyk7XG5cdFx0XHRcdHRoaXMuZGF0YU9iamVjdC5zaGVsZklkID0gcGFyZW50LmlkO1xuXHRcdFx0XHR0aGlzLmRhdGFPYmplY3Quc2VjdGlvbklkID0gcGFyZW50LnBhcmVudC5pZDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMucGFyZW50LnJlbW92ZSh0aGlzKTtcblx0XHRcdFx0dGhpcy5kYXRhT2JqZWN0LnNoZWxmSWQgPSBudWxsO1xuXHRcdFx0XHR0aGlzLmRhdGFPYmplY3Quc2VjdGlvbklkID0gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIEJvb2tPYmplY3Q7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnQ2FtZXJhT2JqZWN0JywgZnVuY3Rpb24gKEJhc2VPYmplY3QpIHtcblx0dmFyIENhbWVyYU9iamVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdEJhc2VPYmplY3QuY2FsbCh0aGlzKTtcblx0fTtcblxuXHRDYW1lcmFPYmplY3QucHJvdG90eXBlID0gbmV3IEJhc2VPYmplY3QoKTtcblx0XG5cdENhbWVyYU9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDYW1lcmFPYmplY3Q7XG5cdFxuXHRDYW1lcmFPYmplY3QucHJvdG90eXBlLnVwZGF0ZUJvdW5kaW5nQm94ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHJhZGl1cyA9IHt4OiAwLjEsIHk6IDEsIHo6IDAuMX07XG5cdFx0dmFyIGNlbnRlciA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDApO1xuXG5cdFx0dGhpcy5ib3VuZGluZ0JveCA9IHtcblx0XHRcdHJhZGl1czogcmFkaXVzLFxuXHRcdFx0Y2VudGVyOiB0aGlzLnBvc2l0aW9uIC8vVE9ETzogbmVlZHMgY2VudGVyIG9mIHNlY3Rpb24gaW4gcGFyZW50IG9yIHdvcmxkIGNvb3JkaW5hdGVzXG5cdFx0fTtcblx0fTtcblxuXHRyZXR1cm4gQ2FtZXJhT2JqZWN0O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0NhbnZhc0ltYWdlJywgZnVuY3Rpb24gKCRxLCBEYXRhKSB7XG5cdHZhciBDYW52YXNJbWFnZSA9IGZ1bmN0aW9uKHByb3BlcnRpZXMsIGxpbmssIGltYWdlKSB7XG5cdFx0dGhpcy5saW5rID0gbGluayB8fCAnJztcblx0XHR0aGlzLmltYWdlID0gaW1hZ2U7XG5cdFx0dGhpcy5wYXJzZVByb3BlcnRpZXMocHJvcGVydGllcyk7XG5cdH07XG5cdFxuXHRDYW52YXNJbWFnZS5wcm90b3R5cGUgPSB7XG5cdFx0Y29uc3RydWN0b3I6IENhbnZhc0ltYWdlLFxuXG5cdFx0dG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMubGluaztcblx0XHR9LFxuXHRcdHBhcnNlUHJvcGVydGllczogZnVuY3Rpb24ocHJvcGVydGllcykge1xuXHRcdFx0dmFyIGFyZ3MgPSBwcm9wZXJ0aWVzICYmIHByb3BlcnRpZXMuc3BsaXQoJywnKSB8fCBbXTtcblxuXHRcdFx0dGhpcy54ID0gTnVtYmVyKGFyZ3NbMF0pIHx8IERhdGEuQ09WRVJfRkFDRV9YO1xuXHRcdFx0dGhpcy55ID0gTnVtYmVyKGFyZ3NbMV0pIHx8IDA7XG5cdFx0XHR0aGlzLndpZHRoID0gTnVtYmVyKGFyZ3NbMl0pIHx8IDIxNjtcblx0XHRcdHRoaXMuaGVpZ2h0ID0gTnVtYmVyKGFyZ3NbM10pIHx8IERhdGEuQ09WRVJfTUFYX1k7XG5cdFx0fSxcblx0XHRzZXJpYWxpemVQcm9wZXJ0aWVzOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBbdGhpcy54LCB0aGlzLnksIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0XS5qb2luKCcsJyk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBDYW52YXNJbWFnZTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdDYW52YXNUZXh0JywgZnVuY3Rpb24gKERhdGEpIHtcblx0dmFyIENhbnZhc1RleHQgPSBmdW5jdGlvbih0ZXh0LCBwcm9wZXJ0aWVzKSB7XG5cdFx0dGhpcy50ZXh0ID0gdGV4dCB8fCAnJztcblx0XHR0aGlzLnBhcnNlUHJvcGVydGllcyhwcm9wZXJ0aWVzKTtcblx0fTtcblxuXHRDYW52YXNUZXh0LnByb3RvdHlwZSA9IHtcblx0XHRjb25zdHJ1Y3RvcjogQ2FudmFzVGV4dCxcblx0XHRnZXRGb250OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBbdGhpcy5zdHlsZSwgdGhpcy5zaXplICsgJ3B4JywgdGhpcy5mb250XS5qb2luKCcgJyk7XG5cdFx0fSxcblx0XHRpc1ZhbGlkOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiAodGhpcy50ZXh0ICYmIHRoaXMueCAmJiB0aGlzLnkpO1xuXHRcdH0sXG5cdFx0dG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMudGV4dCB8fCAnJztcblx0XHR9LFxuXHRcdHNldFRleHQ6IGZ1bmN0aW9uKHRleHQpIHtcblx0XHRcdHRoaXMudGV4dCA9IHRleHQ7XG5cdFx0fSxcblx0XHRzZXJpYWxpemVGb250OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBbdGhpcy5zdHlsZSwgdGhpcy5zaXplLCB0aGlzLmZvbnQsIHRoaXMueCwgdGhpcy55LCB0aGlzLmNvbG9yLCB0aGlzLndpZHRoXS5qb2luKCcsJyk7XG5cdFx0fSxcblx0XHRwYXJzZVByb3BlcnRpZXM6IGZ1bmN0aW9uKHByb3BlcnRpZXMpIHtcblx0XHRcdHZhciBhcmdzID0gcHJvcGVydGllcyAmJiBwcm9wZXJ0aWVzLnNwbGl0KCcsJykgfHwgW107XG5cblx0XHRcdHRoaXMuc3R5bGUgPSBhcmdzWzBdO1xuXHRcdFx0dGhpcy5zaXplID0gYXJnc1sxXSB8fCAxNDtcblx0XHRcdHRoaXMuZm9udCA9IGFyZ3NbMl0gfHwgJ0FyaWFsJztcblx0XHRcdHRoaXMueCA9IE51bWJlcihhcmdzWzNdKSB8fCBEYXRhLkNPVkVSX0ZBQ0VfWDtcblx0XHRcdHRoaXMueSA9IE51bWJlcihhcmdzWzRdKSB8fCAxMDtcblx0XHRcdHRoaXMuY29sb3IgPSBhcmdzWzVdIHx8ICdibGFjayc7XG5cdFx0XHR0aGlzLndpZHRoID0gYXJnc1s2XSB8fCA1MTI7XG5cdFx0fSxcblx0XHRtb3ZlOiBmdW5jdGlvbihkWCwgZFkpIHtcblx0XHRcdHRoaXMueCArPSBkWDtcblx0XHRcdHRoaXMueSArPSBkWTtcblxuXHRcdFx0aWYodGhpcy54IDw9IDApIHRoaXMueCA9IDE7XG5cdFx0XHRpZih0aGlzLnkgPD0gMCkgdGhpcy55ID0gMTtcblx0XHRcdGlmKHRoaXMueCA+PSBEYXRhLlRFWFRVUkVfUkVTT0xVVElPTikgdGhpcy54ID0gRGF0YS5URVhUVVJFX1JFU09MVVRJT047XG5cdFx0XHRpZih0aGlzLnkgPj0gRGF0YS5DT1ZFUl9NQVhfWSkgdGhpcy55ID0gRGF0YS5DT1ZFUl9NQVhfWTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIENhbnZhc1RleHQ7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnTGlicmFyeU9iamVjdCcsIGZ1bmN0aW9uIChCYXNlT2JqZWN0LCBEYXRhKSB7XG5cdHZhciBMaWJyYXJ5T2JqZWN0ID0gZnVuY3Rpb24ocGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgcGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXHRcdHRoaXMubGlicmFyeU9iamVjdCA9IHBhcmFtcy5saWJyYXJ5T2JqZWN0IHx8IHt9Oy8vVE9ETzogcmVzZWFyY2hcblx0fTtcblx0TGlicmFyeU9iamVjdC5wcm90b3R5cGUgPSBuZXcgQmFzZU9iamVjdCgpO1xuXHRMaWJyYXJ5T2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IExpYnJhcnlPYmplY3Q7XG5cblx0cmV0dXJuIExpYnJhcnlPYmplY3Q7XHRcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdTZWN0aW9uT2JqZWN0JywgZnVuY3Rpb24gKEJhc2VPYmplY3QsIFNoZWxmT2JqZWN0LCBEYXRhKSB7XG5cdHZhciBTZWN0aW9uT2JqZWN0ID0gZnVuY3Rpb24ocGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgcGFyYW1zLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG5cdFx0dGhpcy5zaGVsdmVzID0ge307XG5cdFx0Zm9yKHZhciBrZXkgaW4gcGFyYW1zLmRhdGEuc2hlbHZlcykge1xuXHRcdFx0dGhpcy5zaGVsdmVzW2tleV0gPSBuZXcgU2hlbGZPYmplY3QocGFyYW1zLmRhdGEuc2hlbHZlc1trZXldKTsgXG5cdFx0XHR0aGlzLmFkZCh0aGlzLnNoZWx2ZXNba2V5XSk7XG5cdFx0fVxuXHR9O1xuXG5cdFNlY3Rpb25PYmplY3QuVFlQRSA9ICdTZWN0aW9uT2JqZWN0JztcblxuXHRTZWN0aW9uT2JqZWN0LnByb3RvdHlwZSA9IG5ldyBCYXNlT2JqZWN0KCk7XG5cdFNlY3Rpb25PYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VjdGlvbk9iamVjdDtcblx0U2VjdGlvbk9iamVjdC5wcm90b3R5cGUudHlwZSA9IFNlY3Rpb25PYmplY3QuVFlQRTtcblxuXHRTZWN0aW9uT2JqZWN0LnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblxuXHRcdHRoaXMuZGF0YU9iamVjdC5wb3NfeCA9IHRoaXMucG9zaXRpb24ueDtcblx0XHR0aGlzLmRhdGFPYmplY3QucG9zX3kgPSB0aGlzLnBvc2l0aW9uLnk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LnBvc196ID0gdGhpcy5wb3NpdGlvbi56O1xuXG5cdFx0dGhpcy5kYXRhT2JqZWN0LnJvdGF0aW9uID0gW3RoaXMucm90YXRpb24ueCwgdGhpcy5yb3RhdGlvbi55LCB0aGlzLnJvdGF0aW9uLnpdO1xuXG5cdFx0RGF0YS5wb3N0U2VjdGlvbih0aGlzLmRhdGFPYmplY3QpLnRoZW4oZnVuY3Rpb24gKGR0bykge1xuXHRcdFx0c2NvcGUuZGF0YU9iamVjdCA9IGR0bztcblx0XHRcdHNjb3BlLmNoYW5nZWQgPSBmYWxzZTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHQvL1RPRE86IGhpZGUgZWRpdCwgbm90aWZ5IHVzZXJcblx0XHR9KTtcblx0fTtcblxuXHRyZXR1cm4gU2VjdGlvbk9iamVjdDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdTZWxlY3Rvck1ldGEnLCBmdW5jdGlvbiAoKSB7XG5cdHZhciBTZWxlY3Rvck1ldGEgPSBmdW5jdGlvbihzZWxlY3RlZE9iamVjdCkge1xuXHRcdGlmKHNlbGVjdGVkT2JqZWN0KSB7XG5cdFx0XHR0aGlzLmlkID0gc2VsZWN0ZWRPYmplY3QuaWQ7XG5cdFx0XHR0aGlzLnBhcmVudElkID0gc2VsZWN0ZWRPYmplY3QucGFyZW50LmlkO1xuXHRcdFx0dGhpcy50eXBlID0gc2VsZWN0ZWRPYmplY3QuZ2V0VHlwZSgpO1xuXHRcdH1cblx0fTtcblxuXHRTZWxlY3Rvck1ldGEucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gIXRoaXMuaWQ7XG5cdH07XG5cblx0U2VsZWN0b3JNZXRhLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0cmV0dXJuICEoIW1ldGFcblx0XHRcdFx0fHwgbWV0YS5pZCAhPT0gdGhpcy5pZFxuXHRcdFx0XHR8fCBtZXRhLnBhcmVudElkICE9PSB0aGlzLnBhcmVudElkXG5cdFx0XHRcdHx8IG1ldGEudHlwZSAhPT0gdGhpcy50eXBlKTtcblx0fTtcblx0XG5cdHJldHVybiBTZWxlY3Rvck1ldGE7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnU2hlbGZPYmplY3QnLCBmdW5jdGlvbiAoQmFzZU9iamVjdCkge1xuXHR2YXIgU2hlbGZPYmplY3QgPSBmdW5jdGlvbihwYXJhbXMpIHtcblx0XHR2YXIgc2l6ZSA9IHBhcmFtcy5zaXplIHx8IFsxLDEsMV07XHRcblx0XHR2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7Y29sb3I6IDB4MDBmZjAwLCB0cmFuc3BhcmVudDogdHJ1ZSwgb3BhY2l0eTogMC4yfSk7XG5cdFx0QmFzZU9iamVjdC5jYWxsKHRoaXMsIHBhcmFtcywgbmV3IFRIUkVFLkN1YmVHZW9tZXRyeShzaXplWzBdLCBzaXplWzFdLCBzaXplWzJdKSwgbWF0ZXJpYWwpO1xuXG5cdFx0dGhpcy5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKHBhcmFtcy5wb3NpdGlvblswXSwgcGFyYW1zLnBvc2l0aW9uWzFdLCBwYXJhbXMucG9zaXRpb25bMl0pO1xuXHRcdHRoaXMuc2l6ZSA9IG5ldyBUSFJFRS5WZWN0b3IzKHNpemVbMF0sIHNpemVbMV0sIHNpemVbMl0pO1xuXHRcdHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuXHR9O1xuXG5cdFNoZWxmT2JqZWN0LlRZUEUgPSAnU2hlbGZPYmplY3QnO1xuXG5cdFNoZWxmT2JqZWN0LnByb3RvdHlwZSA9IG5ldyBCYXNlT2JqZWN0KCk7XG5cdFNoZWxmT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNoZWxmT2JqZWN0O1xuXHRTaGVsZk9iamVjdC5wcm90b3R5cGUudHlwZSA9IFNoZWxmT2JqZWN0LlRZUEU7XG5cblxuXHRyZXR1cm4gU2hlbGZPYmplY3Q7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnaGlnaGxpZ2h0JywgZnVuY3Rpb24gKGVudmlyb25tZW50KSB7XG5cdHZhciBoaWdobGlnaHQgPSB7fTtcblxuXHR2YXIgUExBTkVfUk9UQVRJT04gPSBNYXRoLlBJICogMC41O1xuXHR2YXIgUExBTkVfTVVMVElQTElFUiA9IDI7XG5cdHZhciBDT0xPUl9TRUxFQ1QgPSAweDAwNTUzMztcblx0dmFyIENPTE9SX0ZPQ1VTID0gMHgwMDMzNTU7XG5cblx0dmFyIHNlbGVjdDtcblx0dmFyIGZvY3VzO1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIG1hdGVyaWFsUHJvcGVydGllcyA9IHtcblx0XHRcdG1hcDogbmV3IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmUoICdpbWcvZ2xvdy5wbmcnICksXG5cdFx0XHR0cmFuc3BhcmVudDogdHJ1ZSwgXG5cdFx0XHRzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxuXHRcdFx0YmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmcsXG5cdFx0XHRkZXB0aFRlc3Q6IGZhbHNlXG5cdFx0fTtcblxuXHRcdG1hdGVyaWFsUHJvcGVydGllcy5jb2xvciA9IENPTE9SX1NFTEVDVDtcblx0XHR2YXIgbWF0ZXJpYWxTZWxlY3QgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwobWF0ZXJpYWxQcm9wZXJ0aWVzKTtcblxuXHRcdG1hdGVyaWFsUHJvcGVydGllcy5jb2xvciA9IENPTE9SX0ZPQ1VTO1xuXHRcdHZhciBtYXRlcmlhbEZvY3VzID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKG1hdGVyaWFsUHJvcGVydGllcyk7XG5cblx0XHR2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgxLCAxLCAxKTtcblxuXHRcdHNlbGVjdCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbFNlbGVjdCk7XG5cdFx0c2VsZWN0LnJvdGF0aW9uLnggPSBQTEFORV9ST1RBVElPTjtcblxuXHRcdGZvY3VzID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsRm9jdXMpO1xuXHRcdGZvY3VzLnJvdGF0aW9uLnggPSBQTEFORV9ST1RBVElPTjtcblx0fTtcblxuXHR2YXIgY29tbW9uSGlnaGxpZ2h0ID0gZnVuY3Rpb24od2hpY2gsIG9iaikge1xuXHRcdGlmKG9iaikge1xuXHRcdFx0dmFyIHdpZHRoID0gb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1heC54ICogUExBTkVfTVVMVElQTElFUjtcblx0XHRcdHZhciBoZWlnaHQgPSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnogKiBQTEFORV9NVUxUSVBMSUVSO1xuXHRcdFx0dmFyIGJvdHRvbSA9IG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5taW4ueSArIGVudmlyb25tZW50LkNMRUFSQU5DRTtcblx0XHRcdFxuXHRcdFx0d2hpY2gucG9zaXRpb24ueSA9IGJvdHRvbTtcblx0XHRcdHdoaWNoLnNjYWxlLnNldCh3aWR0aCwgaGVpZ2h0LCAxKTtcblx0XHRcdG9iai5hZGQod2hpY2gpO1xuXG5cdFx0XHR3aGljaC52aXNpYmxlID0gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2hpY2gudmlzaWJsZSA9IGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdGhpZ2hsaWdodC5mb2N1cyA9IGZ1bmN0aW9uKG9iaikge1xuXHRcdGNvbW1vbkhpZ2hsaWdodChmb2N1cywgb2JqKTtcblx0fTtcblxuXHRoaWdobGlnaHQuc2VsZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG5cdFx0Y29tbW9uSGlnaGxpZ2h0KHNlbGVjdCwgb2JqKTtcblx0fTtcblxuXHRpbml0KCk7XG5cblx0cmV0dXJuIGhpZ2hsaWdodDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdsb2NhdG9yJywgZnVuY3Rpb24gKCRxLCAkbG9nLCBTZWN0aW9uT2JqZWN0LCBCb29rT2JqZWN0LCBEYXRhLCBzZWxlY3RvciwgZW52aXJvbm1lbnQsIGNhY2hlKSB7XG5cdHZhciBWSVNVQUxfREVCVUcgPSBmYWxzZTtcblx0dmFyIGxvY2F0b3IgPSB7fTtcblxuXHRsb2NhdG9yLnBsYWNlU2VjdGlvbiA9IGZ1bmN0aW9uKHNlY3Rpb25EdG8pIHtcblx0XHR2YXIgcHJvbWlzZSA9IGNhY2hlLmdldFNlY3Rpb24oc2VjdGlvbkR0by5tb2RlbCkudGhlbihmdW5jdGlvbiAoc2VjdGlvbkNhY2hlKSB7XG5cdFx0XHR2YXIgc2VjdGlvbkJCID0gc2VjdGlvbkNhY2hlLmdlb21ldHJ5LmJvdW5kaW5nQm94O1xuXHRcdFx0dmFyIGxpYnJhcnlCQiA9IGVudmlyb25tZW50LmxpYnJhcnkuZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cdFx0XHR2YXIgZnJlZVBsYWNlID0gZ2V0RnJlZVBsYWNlKGVudmlyb25tZW50LmxpYnJhcnkuY2hpbGRyZW4sIGxpYnJhcnlCQiwgc2VjdGlvbkJCKTtcblxuXHRcdFx0aWYgKGZyZWVQbGFjZSkge1xuXHRcdFx0XHRyZXR1cm4gc2F2ZVNlY3Rpb24oc2VjdGlvbkR0bywgZnJlZVBsYWNlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRxLnJlamVjdCgndGhlcmUgaXMgbm8gZnJlZSBzcGFjZScpO1xuXHRcdFx0fVxuXHRcdH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGVudmlyb25tZW50LnVwZGF0ZVNlY3Rpb24oc2VjdGlvbkR0byk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgc2F2ZVNlY3Rpb24gPSBmdW5jdGlvbihkdG8sIHBvc2l0aW9uKSB7XG5cdFx0ZHRvLmxpYnJhcnlJZCA9IGVudmlyb25tZW50LmxpYnJhcnkuaWQ7XG5cdFx0ZHRvLnBvc194ID0gcG9zaXRpb24ueDtcblx0XHRkdG8ucG9zX3kgPSBwb3NpdGlvbi55O1xuXHRcdGR0by5wb3NfeiA9IHBvc2l0aW9uLno7XG5cblx0XHRyZXR1cm4gRGF0YS5wb3N0U2VjdGlvbihkdG8pO1xuXHR9O1xuXG5cdGxvY2F0b3IucGxhY2VCb29rID0gZnVuY3Rpb24oYm9va0R0bykge1xuXHRcdHZhciBwcm9taXNlO1xuXHRcdHZhciBzaGVsZiA9IHNlbGVjdG9yLmlzU2VsZWN0ZWRTaGVsZigpICYmIHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0KCk7XG5cblx0XHRpZihzaGVsZikge1xuXHRcdFx0cHJvbWlzZSA9IGNhY2hlLmdldEJvb2soYm9va0R0by5tb2RlbCkudGhlbihmdW5jdGlvbiAoYm9va0NhY2hlKSB7XG5cdFx0XHRcdHZhciBzaGVsZkJCID0gc2hlbGYuZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cdFx0XHRcdHZhciBib29rQkIgPSBib29rQ2FjaGUuZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cdFx0XHRcdHZhciBmcmVlUGxhY2UgPSBnZXRGcmVlUGxhY2Uoc2hlbGYuY2hpbGRyZW4sIHNoZWxmQkIsIGJvb2tCQik7XG5cblx0XHRcdFx0aWYoZnJlZVBsYWNlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHNhdmVCb29rKGJvb2tEdG8sIGZyZWVQbGFjZSwgc2hlbGYpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiAkcS5yZWplY3QoJ3RoZXJlIGlzIG5vIGZyZWUgc3BhY2UnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiBlbnZpcm9ubWVudC51cGRhdGVCb29rKGJvb2tEdG8pO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHByb21pc2UgPSAkcS5yZWplY3QoJ3NoZWxmIGlzIG5vdCBzZWxlY3RlZCcpO1xuXHRcdH1cblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBzYXZlQm9vayA9IGZ1bmN0aW9uKGR0bywgcG9zaXRpb24sIHNoZWxmKSB7XG5cdFx0ZHRvLnNoZWxmSWQgPSBzaGVsZi5pZDtcblx0XHRkdG8uc2VjdGlvbklkID0gc2hlbGYucGFyZW50LmlkO1xuXHRcdGR0by5wb3NfeCA9IHBvc2l0aW9uLng7XG5cdFx0ZHRvLnBvc195ID0gcG9zaXRpb24ueTtcblx0XHRkdG8ucG9zX3ogPSBwb3NpdGlvbi56O1xuXG5cdFx0cmV0dXJuIERhdGEucG9zdEJvb2soZHRvKTtcblx0fTtcblxuXHRsb2NhdG9yLnVucGxhY2VCb29rID0gZnVuY3Rpb24oYm9va0R0bykge1xuXHRcdHZhciBwcm9taXNlO1xuXHRcdGJvb2tEdG8uc2VjdGlvbklkID0gbnVsbDtcblxuXHRcdHByb21pc2UgPSBEYXRhLnBvc3RCb29rKGJvb2tEdG8pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGVudmlyb25tZW50LnVwZGF0ZUJvb2soYm9va0R0byk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgZ2V0RnJlZVBsYWNlID0gZnVuY3Rpb24ob2JqZWN0cywgc3BhY2VCQiwgdGFyZ2V0QkIpIHtcblx0XHR2YXIgbWF0cml4UHJlY2lzaW9uID0gbmV3IFRIUkVFLlZlY3RvcjModGFyZ2V0QkIubWF4LnggLSB0YXJnZXRCQi5taW4ueCwgMCwgdGFyZ2V0QkIubWF4LnogLSB0YXJnZXRCQi5taW4ueik7XG5cdFx0dmFyIG9jY3VwaWVkTWF0cml4ID0gZ2V0T2NjdXBpZWRNYXRyaXgob2JqZWN0cywgbWF0cml4UHJlY2lzaW9uKTtcblx0XHR2YXIgZnJlZVBvc2l0aW9uID0gZ2V0RnJlZU1hdHJpeENlbGxzKG9jY3VwaWVkTWF0cml4LCBzcGFjZUJCLCB0YXJnZXRCQiwgbWF0cml4UHJlY2lzaW9uKTtcblx0XHRcblx0XHRpZiAoVklTVUFMX0RFQlVHKSB7XG5cdFx0XHRkZWJ1Z1Nob3dGcmVlKGZyZWVQb3NpdGlvbiwgbWF0cml4UHJlY2lzaW9uLCBlbnZpcm9ubWVudC5saWJyYXJ5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZnJlZVBvc2l0aW9uO1xuXHR9O1xuXG5cdHZhciBnZXRGcmVlTWF0cml4Q2VsbHMgPSBmdW5jdGlvbihvY2N1cGllZE1hdHJpeCwgc3BhY2VCQiwgdGFyZ2V0QkIsIG1hdHJpeFByZWNpc2lvbikge1xuXHRcdHZhciB0YXJnZXRDZWxsc1NpemUgPSAxO1xuXHRcdHZhciBmcmVlQ2VsbHNDb3VudCA9IDA7XG5cdFx0dmFyIGZyZWVDZWxsc1N0YXJ0O1xuXHRcdHZhciB4SW5kZXg7XG5cdFx0dmFyIHpJbmRleDtcblx0XHR2YXIgY2VsbHM7XG5cblx0XHR2YXIgbWluWENlbGwgPSBNYXRoLmZsb29yKHNwYWNlQkIubWluLnggLyBtYXRyaXhQcmVjaXNpb24ueCkgKyAxO1xuXHRcdHZhciBtYXhYQ2VsbCA9IE1hdGguZmxvb3Ioc3BhY2VCQi5tYXgueCAvIG1hdHJpeFByZWNpc2lvbi54KTtcblx0XHR2YXIgbWluWkNlbGwgPSBNYXRoLmZsb29yKHNwYWNlQkIubWluLnogLyBtYXRyaXhQcmVjaXNpb24ueikgKyAxO1xuXHRcdHZhciBtYXhaQ2VsbCA9IE1hdGguZmxvb3Ioc3BhY2VCQi5tYXgueiAvIG1hdHJpeFByZWNpc2lvbi56KTtcblxuXHRcdGZvciAoekluZGV4ID0gbWluWkNlbGw7IHpJbmRleCA8PSBtYXhaQ2VsbDsgekluZGV4KyspIHtcblx0XHRcdGZvciAoeEluZGV4ID0gbWluWENlbGw7IHhJbmRleCA8PSBtYXhYQ2VsbDsgeEluZGV4KyspIHtcblx0XHRcdFx0aWYgKCFvY2N1cGllZE1hdHJpeFt6SW5kZXhdW3hJbmRleF0pIHtcblx0XHRcdFx0XHRmcmVlQ2VsbHNTdGFydCB8fCAoZnJlZUNlbGxzU3RhcnQgPSB4SW5kZXgpO1xuXHRcdFx0XHRcdGZyZWVDZWxsc0NvdW50Kys7XG5cblx0XHRcdFx0XHRpZiAoZnJlZUNlbGxzQ291bnQgPT09IHRhcmdldENlbGxzU2l6ZSkge1xuXHRcdFx0XHRcdFx0Y2VsbHMgPSBfLnJhbmdlKGZyZWVDZWxsc1N0YXJ0LCBmcmVlQ2VsbHNTdGFydCArIGZyZWVDZWxsc0NvdW50KTtcblx0XHRcdFx0XHRcdHJldHVybiBnZXRQb3NpdGlvbkZyb21DZWxscyhjZWxscywgekluZGV4LCBtYXRyaXhQcmVjaXNpb24sIHNwYWNlQkIsIHRhcmdldEJCKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZnJlZUNlbGxzQ291bnQgPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cdH07XG5cblx0dmFyIGdldFBvc2l0aW9uRnJvbUNlbGxzID0gZnVuY3Rpb24oY2VsbHMsIHpJbmRleCwgbWF0cml4UHJlY2lzaW9uLCBzcGFjZUJCLCB0YXJnZXRCQikge1xuXHRcdHZhciBzaXplID0gY2VsbHMubGVuZ3RoICogbWF0cml4UHJlY2lzaW9uLng7XG5cdFx0dmFyIHggPSBjZWxsc1swXSAqIG1hdHJpeFByZWNpc2lvbi54O1xuXHRcdHZhciB6ID1cdHpJbmRleCAqIG1hdHJpeFByZWNpc2lvbi56O1xuXHRcdHZhciB5ID0gZ2V0Qm90dG9tWShzcGFjZUJCLCB0YXJnZXRCQik7XG5cblx0XHRyZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoeCwgeSwgeik7XG5cdH07XG5cblx0dmFyIGdldEJvdHRvbVkgPSBmdW5jdGlvbihzcGFjZUJCLCB0YXJnZXRCQikge1xuXHRcdHJldHVybiBzcGFjZUJCLm1pbi55IC0gdGFyZ2V0QkIubWluLnkgKyBlbnZpcm9ubWVudC5DTEVBUkFOQ0U7XG5cdH07XG5cblx0dmFyIGdldE9jY3VwaWVkTWF0cml4ID0gZnVuY3Rpb24ob2JqZWN0cywgbWF0cml4UHJlY2lzaW9uKSB7XG5cdFx0dmFyIHJlc3VsdCA9IHt9O1xuXHRcdHZhciBvYmplY3RCQjtcblx0XHR2YXIgbWluS2V5WDtcblx0XHR2YXIgbWF4S2V5WDtcblx0XHR2YXIgbWluS2V5Wjtcblx0XHR2YXIgbWF4S2V5WjtcdFx0XG5cdFx0dmFyIHo7XG5cblx0XHRvYmplY3RzLmZvckVhY2goZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0aWYgKG9iaiBpbnN0YW5jZW9mIFNlY3Rpb25PYmplY3QgfHwgb2JqIGluc3RhbmNlb2YgQm9va09iamVjdCkge1xuXHRcdFx0XHRvYmplY3RCQiA9IG9iai5ib3VuZGluZ0JveDtcblxuXHRcdFx0XHRtaW5LZXlYID0gTWF0aC5yb3VuZCgob2JqZWN0QkIuY2VudGVyLnggLSBvYmplY3RCQi5yYWRpdXMueCkgLyBtYXRyaXhQcmVjaXNpb24ueCk7XG5cdFx0XHRcdG1heEtleVggPSBNYXRoLnJvdW5kKChvYmplY3RCQi5jZW50ZXIueCArIG9iamVjdEJCLnJhZGl1cy54KSAvIG1hdHJpeFByZWNpc2lvbi54KTtcblx0XHRcdFx0bWluS2V5WiA9IE1hdGgucm91bmQoKG9iamVjdEJCLmNlbnRlci56IC0gb2JqZWN0QkIucmFkaXVzLnopIC8gbWF0cml4UHJlY2lzaW9uLnopO1xuXHRcdFx0XHRtYXhLZXlaID0gTWF0aC5yb3VuZCgob2JqZWN0QkIuY2VudGVyLnogKyBvYmplY3RCQi5yYWRpdXMueikgLyBtYXRyaXhQcmVjaXNpb24ueik7XG5cblx0XHRcdFx0Zm9yICh6ID0gbWluS2V5WjsgeiA8PSBtYXhLZXlaOyB6KyspIHtcblx0XHRcdFx0XHRyZXN1bHRbel0gfHwgKHJlc3VsdFt6XSA9IHt9KTtcblx0XHRcdFx0XHRyZXN1bHRbel1bbWluS2V5WF0gPSB0cnVlO1xuXHRcdFx0XHRcdHJlc3VsdFt6XVttYXhLZXlYXSA9IHRydWU7XG5cblx0XHRcdFx0XHRpZiAoVklTVUFMX0RFQlVHKSB7XG5cdFx0XHRcdFx0XHRkZWJ1Z1Nob3dCQihvYmopO1xuXHRcdFx0XHRcdFx0ZGVidWdBZGRPY2N1cGllZChbbWluS2V5WCwgbWF4S2V5WF0sIG1hdHJpeFByZWNpc2lvbiwgb2JqLCB6KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0dmFyIGRlYnVnU2hvd0JCID0gZnVuY3Rpb24ob2JqKSB7XG5cdFx0dmFyIG9iamVjdEJCID0gb2JqLmJvdW5kaW5nQm94O1xuXHRcdHZhciBvYmpCb3ggPSBuZXcgVEhSRUUuTWVzaChcblx0XHRcdG5ldyBUSFJFRS5DdWJlR2VvbWV0cnkoXG5cdFx0XHRcdG9iamVjdEJCLnJhZGl1cy54ICogMiwgXG5cdFx0XHRcdG9iamVjdEJCLnJhZGl1cy55ICogMiArIDAuMSwgXG5cdFx0XHRcdG9iamVjdEJCLnJhZGl1cy56ICogMlxuXHRcdFx0KSwgXG5cdFx0XHRuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XG5cdFx0XHRcdGNvbG9yOiAweGJiYmJmZixcblx0XHRcdFx0b3BhY2l0eTogMC4yLFxuXHRcdFx0XHR0cmFuc3BhcmVudDogdHJ1ZVxuXHRcdFx0fSlcblx0XHQpO1xuXHRcdFxuXHRcdG9iakJveC5wb3NpdGlvbi54ID0gb2JqZWN0QkIuY2VudGVyLng7XG5cdFx0b2JqQm94LnBvc2l0aW9uLnkgPSBvYmplY3RCQi5jZW50ZXIueTtcblx0XHRvYmpCb3gucG9zaXRpb24ueiA9IG9iamVjdEJCLmNlbnRlci56O1xuXG5cdFx0b2JqLnBhcmVudC5hZGQob2JqQm94KTtcblx0fTtcblxuXHR2YXIgZGVidWdBZGRPY2N1cGllZCA9IGZ1bmN0aW9uKGNlbGxzLCBtYXRyaXhQcmVjaXNpb24sIG9iaiwgektleSkge1xuXHRcdGNlbGxzLmZvckVhY2goZnVuY3Rpb24gKGNlbGwpIHtcblx0XHRcdHZhciBwb3MgPSBnZXRQb3NpdGlvbkZyb21DZWxscyhbY2VsbF0sIHpLZXksIG1hdHJpeFByZWNpc2lvbiwgb2JqLnBhcmVudC5nZW9tZXRyeS5ib3VuZGluZ0JveCwgb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94KVxuXHRcdFx0dmFyIGNlbGxCb3ggPSBuZXcgVEhSRUUuTWVzaChuZXcgVEhSRUUuQ3ViZUdlb21ldHJ5KG1hdHJpeFByZWNpc2lvbi54IC0gMC4wMSwgMC4wMSwgbWF0cml4UHJlY2lzaW9uLnogLSAwLjAxKSwgbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe2NvbG9yOiAweGZmMDAwMH0pKTtcblx0XHRcdFxuXHRcdFx0Y2VsbEJveC5wb3NpdGlvbiA9IHBvcztcblx0XHRcdG9iai5wYXJlbnQuYWRkKGNlbGxCb3gpO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBkZWJ1Z1Nob3dGcmVlID0gZnVuY3Rpb24ocG9zaXRpb24sIG1hdHJpeFByZWNpc2lvbiwgb2JqKSB7XG5cdFx0aWYgKHBvc2l0aW9uKSB7XG5cdFx0XHR2YXIgY2VsbEJveCA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5DdWJlR2VvbWV0cnkobWF0cml4UHJlY2lzaW9uLngsIDAuNSwgbWF0cml4UHJlY2lzaW9uLnopLCBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7Y29sb3I6IDB4MDBmZjAwfSkpO1xuXHRcdFx0Y2VsbEJveC5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuXHRcdFx0b2JqLnBhcmVudC5hZGQoY2VsbEJveCk7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBsb2NhdG9yO1x0XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnc2VsZWN0b3InLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgU2VsZWN0b3JNZXRhLCBCb29rT2JqZWN0LCBTaGVsZk9iamVjdCwgU2VjdGlvbk9iamVjdCwgQ2FtZXJhLCBlbnZpcm9ubWVudCwgaGlnaGxpZ2h0KSB7XG5cdHZhciBzZWxlY3RvciA9IHt9O1xuXHRcblx0dmFyIHNlbGVjdGVkID0gbmV3IFNlbGVjdG9yTWV0YSgpO1xuXHR2YXIgZm9jdXNlZCA9IG5ldyBTZWxlY3Rvck1ldGEoKTtcblxuXHRzZWxlY3Rvci5mb2N1cyA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHRpZighbWV0YS5lcXVhbHMoZm9jdXNlZCkpIHtcblx0XHRcdGlmKCFmb2N1c2VkLmVxdWFscyhzZWxlY3RlZCkpIHtcblx0XHRcdFx0aGlnaGxpZ2h0LmZvY3VzKG51bGwpO1xuXHRcdFx0fVxuXG5cdFx0XHRmb2N1c2VkID0gbWV0YTtcblxuXHRcdFx0aWYoIWZvY3VzZWQuaXNFbXB0eSgpICYmICFmb2N1c2VkLmVxdWFscyhzZWxlY3RlZCkpIHtcblx0XHRcdFx0dmFyIG9iaiA9IGdldE9iamVjdChmb2N1c2VkKTtcblx0XHRcdFx0aGlnaGxpZ2h0LmZvY3VzKG9iaik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHNlbGVjdG9yLnNlbGVjdEZvY3VzZWQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgbWV0YSA9IGZvY3VzZWQ7XG5cblx0XHRzZWxlY3Rvci5zZWxlY3QobWV0YSk7XG5cdFx0JHJvb3RTY29wZS4kYXBwbHkoKTtcblx0fTtcblxuXHRzZWxlY3Rvci5zZWxlY3QgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0aWYoIW1ldGEuZXF1YWxzKHNlbGVjdGVkKSkge1xuXHRcdFx0c2VsZWN0b3IudW5zZWxlY3QoKTtcblx0XHRcdHNlbGVjdGVkID0gbWV0YTtcblxuXHRcdFx0dmFyIG9iaiA9IGdldE9iamVjdChzZWxlY3RlZCk7XG5cdFx0XHRoaWdobGlnaHQuc2VsZWN0KG9iaik7XG5cdFx0XHRoaWdobGlnaHQuZm9jdXMobnVsbCk7XG5cdFx0fVxuXHR9O1xuXG5cdHNlbGVjdG9yLnVuc2VsZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYoIXNlbGVjdGVkLmlzRW1wdHkoKSkge1xuXHRcdFx0aGlnaGxpZ2h0LnNlbGVjdChudWxsKTtcblx0XHRcdHNlbGVjdGVkID0gbmV3IFNlbGVjdG9yTWV0YSgpO1xuXHRcdH1cblx0fTtcblxuXHRzZWxlY3Rvci5nZXRTZWxlY3RlZE9iamVjdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBnZXRPYmplY3Qoc2VsZWN0ZWQpO1xuXHR9O1xuXG5cdHZhciBnZXRPYmplY3QgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0dmFyIG9iamVjdDtcblxuXHRcdGlmKCFtZXRhLmlzRW1wdHkoKSkge1xuXHRcdFx0b2JqZWN0ID0gaXNTaGVsZihtZXRhKSA/IGVudmlyb25tZW50LmdldFNoZWxmKG1ldGEucGFyZW50SWQsIG1ldGEuaWQpXG5cdFx0XHRcdDogaXNCb29rKG1ldGEpID8gZW52aXJvbm1lbnQuZ2V0Qm9vayhtZXRhLmlkKVxuXHRcdFx0XHQ6IGlzU2VjdGlvbihtZXRhKSA/IGVudmlyb25tZW50LmdldFNlY3Rpb24obWV0YS5pZClcblx0XHRcdFx0OiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiBvYmplY3Q7XHRcblx0fTtcblxuXHRzZWxlY3Rvci5pc0Jvb2tTZWxlY3RlZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuIGlzQm9vayhzZWxlY3RlZCkgJiYgc2VsZWN0ZWQuaWQgPT09IGlkO1xuXHR9O1xuXG5cdHNlbGVjdG9yLmlzU2VsZWN0ZWRTaGVsZiA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBpc1NoZWxmKHNlbGVjdGVkKTtcblx0fTtcblxuXHRzZWxlY3Rvci5pc1NlbGVjdGVkQm9vayA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBpc0Jvb2soc2VsZWN0ZWQpO1xuXHR9O1xuXG5cdHNlbGVjdG9yLmlzU2VsZWN0ZWRTZWN0aW9uID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGlzU2VjdGlvbihzZWxlY3RlZCk7XG5cdH07XG5cblx0dmFyIGlzU2hlbGYgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0cmV0dXJuIG1ldGEudHlwZSA9PT0gU2hlbGZPYmplY3QuVFlQRTtcblx0fTtcblxuXHR2YXIgaXNCb29rID0gZnVuY3Rpb24obWV0YSkge1xuXHRcdHJldHVybiBtZXRhLnR5cGUgPT09IEJvb2tPYmplY3QuVFlQRTtcblx0fTtcblxuXHR2YXIgaXNTZWN0aW9uID0gZnVuY3Rpb24obWV0YSkge1xuXHRcdHJldHVybiBtZXRhLnR5cGUgPT09IFNlY3Rpb25PYmplY3QuVFlQRTtcblx0fTtcblxuXHRyZXR1cm4gc2VsZWN0b3I7XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=