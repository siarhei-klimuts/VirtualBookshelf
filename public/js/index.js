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
			if(this.isBook() && !this.isGetted()) {
				this.getted = true;
				this.parent = this.object.parent;
				this.object.position.set(0, 0, -this.object.geometry.boundingBox.max.z - 0.25);
				Camera.camera.add(this.object);			
			} else {
				this.put();
			}
		},
		put: function() {
			if(this.isGetted()) {
				this.parent.add(this.object);
				this.object.reload();//position
				this.clear();
			}
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
            return res.data
        });
	};

	Data.postFeedback = function(dto) {
        return $http.post('/feedback', dto);
	};

	return Data;
});
angular.module('VirtualBookshelf')
.factory('environment', function ($q, $log, LibraryObject, SectionObject, BookObject, Data, Camera, cache) {
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
		var width = window.innerWidth;
		var height = window.innerHeight;

		if(!Detector.webgl) {
			Detector.addGetWebGLMessage();
		}

		init(width, height);
		Camera.init(width, height);
		Controls.init();

		startRenderLoop();

		User.load().then(function (res) {
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

	var width = window.innerWidth;
	var height = window.innerHeight;

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
			x = event.x;
			y = event.y;
			mouse.longX = width * 0.5 - x;
			mouse.longY = height * 0.5 - y;
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
			mouse.longX = width * 0.5 - x;
			mouse.longY = height * 0.5 - y;
			mouse.dX = event.x - x;
			mouse.dY = event.y - y;
			x = event.x;
			y = event.y;
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
		var vector = new THREE.Vector3((x / width) * 2 - 1, - (y / height) * 2 + 1, 0.5);
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
.factory('UI', function ($q, $log, $window, $interval, SelectorMeta, User, Data, Controls, navigation, environment, locator, selector, blockUI) {
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

		go: function(id) {
			id && ($window.location = '/' + id);
		}
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
					environment.loadLibrary(result.id);
					UI.menu.show = null; // TODO: hide after go 
					UI.menu.selectLibrary.updateList();
					//TODO: add library without reload
				}).catch(function (res) {
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
			var scope = this;

			scope.block();
			Data.postBook({userId: User.getId()}).then(function (res) {
				scope.expand(res.data);
				return scope.loadData();
			}).then(function (res) {
				//TODO: research, looks rigth
			}).catch(function (error) {
				$log.error(error);
				//TODO: show an error
			}).finally(function (res) {
				scope.unblock();
			});
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
			}).finally(function (res) {
				scope.unblock();
			});
		},
		place: function(book) {
			var scope = this;
			var promise;
			var isBookPlaced = !!book.sectionId;

			scope.block();
			promise = isBookPlaced ? locator.unplaceBook(book) : locator.placeBook(book);
			promise.then(function (res) {
				return scope.loadData();
			}).catch(function (error) {
				//TODO: show an error
				$log.error(error);
			}).finally(function (res) {
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
		getImg: function() {
			return this.book.model ? BOOK_IMAGE_URL.replace('{model}', this.book.model) : null;
		},
		isShow: function() {
			return !!this.book.id;
		},
		save: function() {
			var scope = this;
			
			UI.menu.inventory.block();
			Data.postBook(this.book).then(function (res) {
				environment.updateBook(res.data);
				scope.cancel();
				return UI.menu.inventory.loadData()
			}).catch(function (res) {
				//TODO: show error
			}).finally(function (res) {
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
		}).catch(function (res) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL1VpQ3RybC5qcyIsImRpcmVjdGl2ZXMvc2VsZWN0LmpzIiwibGlicy9sb2Rhc2gubWluLmpzIiwic2VydmljZXMvY2FjaGUuanMiLCJzZXJ2aWNlcy9jYW1lcmEuanMiLCJzZXJ2aWNlcy9jb250cm9scy5qcyIsInNlcnZpY2VzL2RhdGEuanMiLCJzZXJ2aWNlcy9lbnZpcm9ubWVudC5qcyIsInNlcnZpY2VzL21haW4uanMiLCJzZXJ2aWNlcy9tb3VzZS5qcyIsInNlcnZpY2VzL25hdmlnYXRpb24uanMiLCJzZXJ2aWNlcy91aS5qcyIsInNlcnZpY2VzL3VzZXIuanMiLCJzZXJ2aWNlcy9tb2RlbHMvQmFzZU9iamVjdC5qcyIsInNlcnZpY2VzL21vZGVscy9Cb29rT2JqZWN0LmpzIiwic2VydmljZXMvbW9kZWxzL0NhbWVyYU9iamVjdC5qcyIsInNlcnZpY2VzL21vZGVscy9DYW52YXNJbWFnZS5qcyIsInNlcnZpY2VzL21vZGVscy9DYW52YXNUZXh0LmpzIiwic2VydmljZXMvbW9kZWxzL0xpYnJhcnlPYmplY3QuanMiLCJzZXJ2aWNlcy9tb2RlbHMvU2VjdGlvbk9iamVjdC5qcyIsInNlcnZpY2VzL21vZGVscy9TZWxlY3Rvck1ldGEuanMiLCJzZXJ2aWNlcy9tb2RlbHMvU2hlbGZPYmplY3QuanMiLCJzZXJ2aWNlcy9zY2VuZS9oaWdobGlnaHQuanMiLCJzZXJ2aWNlcy9zY2VuZS9sb2NhdG9yLmpzIiwic2VydmljZXMvc2NlbmUvc2VsZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyXG4gICAgLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicsIFsnYmxvY2tVSScsICdhbmd1bGFyVXRpbHMuZGlyZWN0aXZlcy5kaXJQYWdpbmF0aW9uJ10pXG4gICAgXHQuY29uZmlnKGZ1bmN0aW9uIChibG9ja1VJQ29uZmlnLCBwYWdpbmF0aW9uVGVtcGxhdGVQcm92aWRlcikge1xuICAgIFx0XHRibG9ja1VJQ29uZmlnLmRlbGF5ID0gMDtcbiAgICBcdFx0YmxvY2tVSUNvbmZpZy5hdXRvQmxvY2sgPSBmYWxzZTtcblx0XHRcdGJsb2NrVUlDb25maWcuYXV0b0luamVjdEJvZHlCbG9jayA9IGZhbHNlO1xuXHRcdFx0cGFnaW5hdGlvblRlbXBsYXRlUHJvdmlkZXIuc2V0UGF0aCgnL2pzL2FuZ3VsYXIvZGlyUGFnaW5hdGlvbi9kaXJQYWdpbmF0aW9uLnRwbC5odG1sJyk7XG4gICAgXHR9KVxuICAgIFx0LnJ1bihmdW5jdGlvbiAoTWFpbikge1xuXHRcdFx0TWFpbi5zdGFydCgpO1xuICAgIFx0fSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmNvbnRyb2xsZXIoJ1VpQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIFVJKSB7XG4gICAgJHNjb3BlLm1lbnUgPSBVSS5tZW51O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmRpcmVjdGl2ZSgndmJTZWxlY3QnLCBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRyZXN0cmljdDogJ0UnLFxuICAgIFx0dHJhbnNjbHVkZTogdHJ1ZSxcblx0XHR0ZW1wbGF0ZVVybDogJy91aS9zZWxlY3QuZWpzJyxcblx0XHRzY29wZToge1xuXHRcdFx0b3B0aW9uczogJz0nLFxuXHRcdFx0c2VsZWN0ZWQ6ICc9Jyxcblx0XHRcdHZhbHVlOiAnQCcsXG5cdFx0XHRsYWJlbDogJ0AnXG5cdFx0fSxcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIGNvbnRyb2xsZXIsIHRyYW5zY2x1ZGUpIHtcblx0XHRcdHNjb3BlLnNlbGVjdCA9IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0c2NvcGUuc2VsZWN0ZWQgPSBpdGVtW3Njb3BlLnZhbHVlXTtcblx0XHRcdH07XG5cblx0XHRcdHNjb3BlLmlzU2VsZWN0ZWQgPSBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdHJldHVybiBzY29wZS5zZWxlY3RlZCA9PT0gaXRlbVtzY29wZS52YWx1ZV07XG5cdFx0XHR9O1xuXHRcdH1cblx0fVxufSk7XG4iLCIvKipcbiAqIEBsaWNlbnNlXG4gKiBsb2Rhc2ggMy4yLjAgKEN1c3RvbSBCdWlsZCkgbG9kYXNoLmNvbS9saWNlbnNlIHwgVW5kZXJzY29yZS5qcyAxLjcuMCB1bmRlcnNjb3JlanMub3JnL0xJQ0VOU0VcbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiAtbyAuL2xvZGFzaC5qc2BcbiAqL1xuOyhmdW5jdGlvbigpe2Z1bmN0aW9uIG4obix0KXtpZihuIT09dCl7dmFyIHI9bj09PW4sZT10PT09dDtpZihuPnR8fCFyfHx0eXBlb2Ygbj09XCJ1bmRlZmluZWRcIiYmZSlyZXR1cm4gMTtpZihuPHR8fCFlfHx0eXBlb2YgdD09XCJ1bmRlZmluZWRcIiYmcilyZXR1cm4tMX1yZXR1cm4gMH1mdW5jdGlvbiB0KG4sdCxyKXtpZih0IT09dClyZXR1cm4gcChuLHIpO3I9KHJ8fDApLTE7Zm9yKHZhciBlPW4ubGVuZ3RoOysrcjxlOylpZihuW3JdPT09dClyZXR1cm4gcjtyZXR1cm4tMX1mdW5jdGlvbiByKG4sdCl7dmFyIHI9bi5sZW5ndGg7Zm9yKG4uc29ydCh0KTtyLS07KW5bcl09bltyXS5jO3JldHVybiBufWZ1bmN0aW9uIGUobil7cmV0dXJuIHR5cGVvZiBuPT1cInN0cmluZ1wiP246bnVsbD09bj9cIlwiOm4rXCJcIn1mdW5jdGlvbiB1KG4pe3JldHVybiBuLmNoYXJDb2RlQXQoMCl9ZnVuY3Rpb24gbyhuLHQpe2Zvcih2YXIgcj0tMSxlPW4ubGVuZ3RoOysrcjxlJiYtMTx0LmluZGV4T2Yobi5jaGFyQXQocikpOyk7cmV0dXJuIHJcbn1mdW5jdGlvbiBpKG4sdCl7Zm9yKHZhciByPW4ubGVuZ3RoO3ItLSYmLTE8dC5pbmRleE9mKG4uY2hhckF0KHIpKTspO3JldHVybiByfWZ1bmN0aW9uIGYodCxyKXtyZXR1cm4gbih0LmEsci5hKXx8dC5iLXIuYn1mdW5jdGlvbiBhKHQscil7Zm9yKHZhciBlPS0xLHU9dC5hLG89ci5hLGk9dS5sZW5ndGg7KytlPGk7KXt2YXIgZj1uKHVbZV0sb1tlXSk7aWYoZilyZXR1cm4gZn1yZXR1cm4gdC5iLXIuYn1mdW5jdGlvbiBjKG4pe3JldHVybiBXdFtuXX1mdW5jdGlvbiBsKG4pe3JldHVybiBOdFtuXX1mdW5jdGlvbiBzKG4pe3JldHVyblwiXFxcXFwiK0x0W25dfWZ1bmN0aW9uIHAobix0LHIpe3ZhciBlPW4ubGVuZ3RoO2Zvcih0PXI/dHx8ZToodHx8MCktMTtyP3QtLTorK3Q8ZTspe3ZhciB1PW5bdF07aWYodSE9PXUpcmV0dXJuIHR9cmV0dXJuLTF9ZnVuY3Rpb24gaChuKXtyZXR1cm4gbiYmdHlwZW9mIG49PVwib2JqZWN0XCJ8fGZhbHNlfWZ1bmN0aW9uIF8obil7cmV0dXJuIDE2MD49biYmOTw9biYmMTM+PW58fDMyPT1ufHwxNjA9PW58fDU3NjA9PW58fDYxNTg9PW58fDgxOTI8PW4mJig4MjAyPj1ufHw4MjMyPT1ufHw4MjMzPT1ufHw4MjM5PT1ufHw4Mjg3PT1ufHwxMjI4OD09bnx8NjUyNzk9PW4pXG59ZnVuY3Rpb24gZyhuLHQpe2Zvcih2YXIgcj0tMSxlPW4ubGVuZ3RoLHU9LTEsbz1bXTsrK3I8ZTspbltyXT09PXQmJihuW3JdPUIsb1srK3VdPXIpO3JldHVybiBvfWZ1bmN0aW9uIHYobil7Zm9yKHZhciB0PS0xLHI9bi5sZW5ndGg7Kyt0PHImJl8obi5jaGFyQ29kZUF0KHQpKTspO3JldHVybiB0fWZ1bmN0aW9uIHkobil7Zm9yKHZhciB0PW4ubGVuZ3RoO3QtLSYmXyhuLmNoYXJDb2RlQXQodCkpOyk7cmV0dXJuIHR9ZnVuY3Rpb24gZChuKXtyZXR1cm4gVXRbbl19ZnVuY3Rpb24gbShfKXtmdW5jdGlvbiBXdChuKXtpZihoKG4pJiYhKFNvKG4pfHxuIGluc3RhbmNlb2YgVXQpKXtpZihuIGluc3RhbmNlb2YgTnQpcmV0dXJuIG47aWYoVXUuY2FsbChuLFwiX19jaGFpbl9fXCIpJiZVdS5jYWxsKG4sXCJfX3dyYXBwZWRfX1wiKSlyZXR1cm4gaGUobil9cmV0dXJuIG5ldyBOdChuKX1mdW5jdGlvbiBOdChuLHQscil7dGhpcy5fX3dyYXBwZWRfXz1uLHRoaXMuX19hY3Rpb25zX189cnx8W10sdGhpcy5fX2NoYWluX189ISF0XG59ZnVuY3Rpb24gVXQobil7dGhpcy5fX3dyYXBwZWRfXz1uLHRoaXMuX19hY3Rpb25zX189bnVsbCx0aGlzLl9fZGlyX189MSx0aGlzLl9fZHJvcENvdW50X189MCx0aGlzLl9fZmlsdGVyZWRfXz1mYWxzZSx0aGlzLl9faXRlcmF0ZWVzX189bnVsbCx0aGlzLl9fdGFrZUNvdW50X189c28sdGhpcy5fX3ZpZXdzX189bnVsbH1mdW5jdGlvbiBGdCgpe3RoaXMuX19kYXRhX189e319ZnVuY3Rpb24gTHQobil7dmFyIHQ9bj9uLmxlbmd0aDowO2Zvcih0aGlzLmRhdGE9e2hhc2g6dG8obnVsbCksc2V0Om5ldyBadX07dC0tOyl0aGlzLnB1c2goblt0XSl9ZnVuY3Rpb24gQnQobix0KXt2YXIgcj1uLmRhdGE7cmV0dXJuKHR5cGVvZiB0PT1cInN0cmluZ1wifHxYZSh0KT9yLnNldC5oYXModCk6ci5oYXNoW3RdKT8wOi0xfWZ1bmN0aW9uIHp0KG4sdCl7dmFyIHI9LTEsZT1uLmxlbmd0aDtmb3IodHx8KHQ9d3UoZSkpOysrcjxlOyl0W3JdPW5bcl07cmV0dXJuIHR9ZnVuY3Rpb24gTXQobix0KXtmb3IodmFyIHI9LTEsZT1uLmxlbmd0aDsrK3I8ZSYmZmFsc2UhPT10KG5bcl0scixuKTspO3JldHVybiBuXG59ZnVuY3Rpb24gcXQobix0KXtmb3IodmFyIHI9LTEsZT1uLmxlbmd0aDsrK3I8ZTspaWYoIXQobltyXSxyLG4pKXJldHVybiBmYWxzZTtyZXR1cm4gdHJ1ZX1mdW5jdGlvbiBQdChuLHQpe2Zvcih2YXIgcj0tMSxlPW4ubGVuZ3RoLHU9LTEsbz1bXTsrK3I8ZTspe3ZhciBpPW5bcl07dChpLHIsbikmJihvWysrdV09aSl9cmV0dXJuIG99ZnVuY3Rpb24gS3Qobix0KXtmb3IodmFyIHI9LTEsZT1uLmxlbmd0aCx1PXd1KGUpOysrcjxlOyl1W3JdPXQobltyXSxyLG4pO3JldHVybiB1fWZ1bmN0aW9uIFZ0KG4pe2Zvcih2YXIgdD0tMSxyPW4ubGVuZ3RoLGU9bG87Kyt0PHI7KXt2YXIgdT1uW3RdO3U+ZSYmKGU9dSl9cmV0dXJuIGV9ZnVuY3Rpb24gWXQobix0LHIsZSl7dmFyIHU9LTEsbz1uLmxlbmd0aDtmb3IoZSYmbyYmKHI9blsrK3VdKTsrK3U8bzspcj10KHIsblt1XSx1LG4pO3JldHVybiByfWZ1bmN0aW9uIFp0KG4sdCxyLGUpe3ZhciB1PW4ubGVuZ3RoO2ZvcihlJiZ1JiYocj1uWy0tdV0pO3UtLTspcj10KHIsblt1XSx1LG4pO1xucmV0dXJuIHJ9ZnVuY3Rpb24gR3Qobix0KXtmb3IodmFyIHI9LTEsZT1uLmxlbmd0aDsrK3I8ZTspaWYodChuW3JdLHIsbikpcmV0dXJuIHRydWU7cmV0dXJuIGZhbHNlfWZ1bmN0aW9uIEp0KG4sdCl7cmV0dXJuIHR5cGVvZiBuPT1cInVuZGVmaW5lZFwiP3Q6bn1mdW5jdGlvbiBYdChuLHQscixlKXtyZXR1cm4gdHlwZW9mIG4hPVwidW5kZWZpbmVkXCImJlV1LmNhbGwoZSxyKT9uOnR9ZnVuY3Rpb24gSHQobix0LHIpe3ZhciBlPUZvKHQpO2lmKCFyKXJldHVybiBucih0LG4sZSk7Zm9yKHZhciB1PS0xLG89ZS5sZW5ndGg7Kyt1PG87KXt2YXIgaT1lW3VdLGY9bltpXSxhPXIoZix0W2ldLGksbix0KTsoYT09PWE/YT09PWY6ZiE9PWYpJiYodHlwZW9mIGYhPVwidW5kZWZpbmVkXCJ8fGkgaW4gbil8fChuW2ldPWEpfXJldHVybiBufWZ1bmN0aW9uIFF0KG4sdCl7Zm9yKHZhciByPS0xLGU9bi5sZW5ndGgsdT1vZShlKSxvPXQubGVuZ3RoLGk9d3Uobyk7KytyPG87KXt2YXIgZj10W3JdO3U/KGY9cGFyc2VGbG9hdChmKSxpW3JdPWVlKGYsZSk/bltmXTp3KTppW3JdPW5bZl1cbn1yZXR1cm4gaX1mdW5jdGlvbiBucihuLHQscil7cnx8KHI9dCx0PXt9KTtmb3IodmFyIGU9LTEsdT1yLmxlbmd0aDsrK2U8dTspe3ZhciBvPXJbZV07dFtvXT1uW29dfXJldHVybiB0fWZ1bmN0aW9uIHRyKG4sdCxyKXt2YXIgZT10eXBlb2YgbjtpZihcImZ1bmN0aW9uXCI9PWUpe2lmKGU9dHlwZW9mIHQhPVwidW5kZWZpbmVkXCIpe3ZhciBlPVd0LnN1cHBvcnQsdT0hKGUuZnVuY05hbWVzP24ubmFtZTplLmZ1bmNEZWNvbXApO2lmKCF1KXt2YXIgbz1XdS5jYWxsKG4pO2UuZnVuY05hbWVzfHwodT0hZHQudGVzdChvKSksdXx8KHU9a3QudGVzdChvKXx8SGUobiksYm8obix1KSl9ZT11fW49ZT9OcihuLHQscik6bn1lbHNlIG49bnVsbD09bj92dTpcIm9iamVjdFwiPT1lP2JyKG4pOnR5cGVvZiB0PT1cInVuZGVmaW5lZFwiP2pyKG4rXCJcIik6eHIobitcIlwiLHQpO3JldHVybiBufWZ1bmN0aW9uIHJyKG4sdCxyLGUsdSxvLGkpe3ZhciBmO2lmKHImJihmPXU/cihuLGUsdSk6cihuKSksdHlwZW9mIGYhPVwidW5kZWZpbmVkXCIpcmV0dXJuIGY7XG5pZighWGUobikpcmV0dXJuIG47aWYoZT1TbyhuKSl7aWYoZj1uZShuKSwhdClyZXR1cm4genQobixmKX1lbHNle3ZhciBhPUx1LmNhbGwobiksYz1hPT1LO2lmKGEhPVkmJmEhPXomJighY3x8dSkpcmV0dXJuIFR0W2FdP3JlKG4sYSx0KTp1P246e307aWYoZj10ZShjP3t9Om4pLCF0KXJldHVybiBucihuLGYsRm8obikpfWZvcihvfHwobz1bXSksaXx8KGk9W10pLHU9by5sZW5ndGg7dS0tOylpZihvW3VdPT1uKXJldHVybiBpW3VdO3JldHVybiBvLnB1c2gobiksaS5wdXNoKGYpLChlP010Ol9yKShuLGZ1bmN0aW9uKGUsdSl7Zlt1XT1ycihlLHQscix1LG4sbyxpKX0pLGZ9ZnVuY3Rpb24gZXIobix0LHIsZSl7aWYodHlwZW9mIG4hPVwiZnVuY3Rpb25cIil0aHJvdyBuZXcgT3UoJCk7cmV0dXJuIEd1KGZ1bmN0aW9uKCl7bi5hcHBseSh3LFJyKHIsZSkpfSx0KX1mdW5jdGlvbiB1cihuLHIpe3ZhciBlPW4/bi5sZW5ndGg6MCx1PVtdO2lmKCFlKXJldHVybiB1O3ZhciBvPS0xLGk9UXIoKSxmPWk9PXQsYT1mJiYyMDA8PXIubGVuZ3RoJiZ4byhyKSxjPXIubGVuZ3RoO1xuYSYmKGk9QnQsZj1mYWxzZSxyPWEpO246Zm9yKDsrK288ZTspaWYoYT1uW29dLGYmJmE9PT1hKXtmb3IodmFyIGw9YztsLS07KWlmKHJbbF09PT1hKWNvbnRpbnVlIG47dS5wdXNoKGEpfWVsc2UgMD5pKHIsYSkmJnUucHVzaChhKTtyZXR1cm4gdX1mdW5jdGlvbiBvcihuLHQpe3ZhciByPW4/bi5sZW5ndGg6MDtpZighb2UocikpcmV0dXJuIF9yKG4sdCk7Zm9yKHZhciBlPS0xLHU9cGUobik7KytlPHImJmZhbHNlIT09dCh1W2VdLGUsdSk7KTtyZXR1cm4gbn1mdW5jdGlvbiBpcihuLHQpe3ZhciByPW4/bi5sZW5ndGg6MDtpZighb2UocikpcmV0dXJuIGdyKG4sdCk7Zm9yKHZhciBlPXBlKG4pO3ItLSYmZmFsc2UhPT10KGVbcl0scixlKTspO3JldHVybiBufWZ1bmN0aW9uIGZyKG4sdCl7dmFyIHI9dHJ1ZTtyZXR1cm4gb3IobixmdW5jdGlvbihuLGUsdSl7cmV0dXJuIHI9ISF0KG4sZSx1KX0pLHJ9ZnVuY3Rpb24gYXIobix0KXt2YXIgcj1bXTtyZXR1cm4gb3IobixmdW5jdGlvbihuLGUsdSl7dChuLGUsdSkmJnIucHVzaChuKVxufSkscn1mdW5jdGlvbiBjcihuLHQscixlKXt2YXIgdTtyZXR1cm4gcihuLGZ1bmN0aW9uKG4scixvKXtyZXR1cm4gdChuLHIsbyk/KHU9ZT9yOm4sZmFsc2UpOnZvaWQgMH0pLHV9ZnVuY3Rpb24gbHIobix0LHIsZSl7ZT0oZXx8MCktMTtmb3IodmFyIHU9bi5sZW5ndGgsbz0tMSxpPVtdOysrZTx1Oyl7dmFyIGY9bltlXTtpZihoKGYpJiZvZShmLmxlbmd0aCkmJihTbyhmKXx8WWUoZikpKXt0JiYoZj1scihmLHQscikpO3ZhciBhPS0xLGM9Zi5sZW5ndGg7Zm9yKGkubGVuZ3RoKz1jOysrYTxjOylpWysrb109ZlthXX1lbHNlIHJ8fChpWysrb109Zil9cmV0dXJuIGl9ZnVuY3Rpb24gc3Iobix0LHIpe3ZhciBlPS0xLHU9cGUobik7cj1yKG4pO2Zvcih2YXIgbz1yLmxlbmd0aDsrK2U8bzspe3ZhciBpPXJbZV07aWYoZmFsc2U9PT10KHVbaV0saSx1KSlicmVha31yZXR1cm4gbn1mdW5jdGlvbiBwcihuLHQscil7dmFyIGU9cGUobik7cj1yKG4pO2Zvcih2YXIgdT1yLmxlbmd0aDt1LS07KXt2YXIgbz1yW3VdO1xuaWYoZmFsc2U9PT10KGVbb10sbyxlKSlicmVha31yZXR1cm4gbn1mdW5jdGlvbiBocihuLHQpe3NyKG4sdCxvdSl9ZnVuY3Rpb24gX3Iobix0KXtyZXR1cm4gc3Iobix0LEZvKX1mdW5jdGlvbiBncihuLHQpe3JldHVybiBwcihuLHQsRm8pfWZ1bmN0aW9uIHZyKG4sdCl7Zm9yKHZhciByPS0xLGU9dC5sZW5ndGgsdT0tMSxvPVtdOysrcjxlOyl7dmFyIGk9dFtyXTtKZShuW2ldKSYmKG9bKyt1XT1pKX1yZXR1cm4gb31mdW5jdGlvbiB5cihuLHQscil7dmFyIGU9LTEsdT10eXBlb2YgdD09XCJmdW5jdGlvblwiLG89bj9uLmxlbmd0aDowLGk9b2Uobyk/d3Uobyk6W107cmV0dXJuIG9yKG4sZnVuY3Rpb24obil7dmFyIG89dT90Om51bGwhPW4mJm5bdF07aVsrK2VdPW8/by5hcHBseShuLHIpOnd9KSxpfWZ1bmN0aW9uIGRyKG4sdCxyLGUsdSxvKXtpZihuPT09dClyZXR1cm4gMCE9PW58fDEvbj09MS90O3ZhciBpPXR5cGVvZiBuLGY9dHlwZW9mIHQ7aWYoXCJmdW5jdGlvblwiIT1pJiZcIm9iamVjdFwiIT1pJiZcImZ1bmN0aW9uXCIhPWYmJlwib2JqZWN0XCIhPWZ8fG51bGw9PW58fG51bGw9PXQpbj1uIT09biYmdCE9PXQ7XG5lbHNlIG46e3ZhciBpPWRyLGY9U28obiksYT1Tbyh0KSxjPUQsbD1EO2Z8fChjPUx1LmNhbGwobiksYz09ej9jPVk6YyE9WSYmKGY9cnUobikpKSxhfHwobD1MdS5jYWxsKHQpLGw9PXo/bD1ZOmwhPVkmJnJ1KHQpKTt2YXIgcz1jPT1ZLGE9bD09WSxsPWM9PWw7aWYoIWx8fGZ8fHMpaWYoYz1zJiZVdS5jYWxsKG4sXCJfX3dyYXBwZWRfX1wiKSxhPWEmJlV1LmNhbGwodCxcIl9fd3JhcHBlZF9fXCIpLGN8fGEpbj1pKGM/bi52YWx1ZSgpOm4sYT90LnZhbHVlKCk6dCxyLGUsdSxvKTtlbHNlIGlmKGwpe2Zvcih1fHwodT1bXSksb3x8KG89W10pLGM9dS5sZW5ndGg7Yy0tOylpZih1W2NdPT1uKXtuPW9bY109PXQ7YnJlYWsgbn11LnB1c2gobiksby5wdXNoKHQpLG49KGY/WnI6SnIpKG4sdCxpLHIsZSx1LG8pLHUucG9wKCksby5wb3AoKX1lbHNlIG49ZmFsc2U7ZWxzZSBuPUdyKG4sdCxjKX1yZXR1cm4gbn1mdW5jdGlvbiBtcihuLHQscixlLHUpe3ZhciBvPXQubGVuZ3RoO2lmKG51bGw9PW4pcmV0dXJuIW87XG5mb3IodmFyIGk9LTEsZj0hdTsrK2k8bzspaWYoZiYmZVtpXT9yW2ldIT09blt0W2ldXTohVXUuY2FsbChuLHRbaV0pKXJldHVybiBmYWxzZTtmb3IoaT0tMTsrK2k8bzspe3ZhciBhPXRbaV07aWYoZiYmZVtpXSlhPVV1LmNhbGwobixhKTtlbHNle3ZhciBjPW5bYV0sbD1yW2ldLGE9dT91KGMsbCxhKTp3O3R5cGVvZiBhPT1cInVuZGVmaW5lZFwiJiYoYT1kcihsLGMsdSx0cnVlKSl9aWYoIWEpcmV0dXJuIGZhbHNlfXJldHVybiB0cnVlfWZ1bmN0aW9uIHdyKG4sdCl7dmFyIHI9W107cmV0dXJuIG9yKG4sZnVuY3Rpb24obixlLHUpe3IucHVzaCh0KG4sZSx1KSl9KSxyfWZ1bmN0aW9uIGJyKG4pe3ZhciB0PUZvKG4pLHI9dC5sZW5ndGg7aWYoMT09cil7dmFyIGU9dFswXSx1PW5bZV07aWYoaWUodSkpcmV0dXJuIGZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZuW2VdPT09dSYmVXUuY2FsbChuLGUpfX1mb3IodmFyIG89d3UociksaT13dShyKTtyLS07KXU9blt0W3JdXSxvW3JdPXUsaVtyXT1pZSh1KTtyZXR1cm4gZnVuY3Rpb24obil7cmV0dXJuIG1yKG4sdCxvLGkpXG59fWZ1bmN0aW9uIHhyKG4sdCl7cmV0dXJuIGllKHQpP2Z1bmN0aW9uKHIpe3JldHVybiBudWxsIT1yJiZyW25dPT09dH06ZnVuY3Rpb24ocil7cmV0dXJuIG51bGwhPXImJmRyKHQscltuXSxudWxsLHRydWUpfX1mdW5jdGlvbiBBcihuLHQscixlLHUpe3ZhciBvPW9lKHQubGVuZ3RoKSYmKFNvKHQpfHxydSh0KSk7cmV0dXJuKG8/TXQ6X3IpKHQsZnVuY3Rpb24odCxpLGYpe2lmKGgodCkpe2V8fChlPVtdKSx1fHwodT1bXSk7bjp7dD1lO2Zvcih2YXIgYT11LGM9dC5sZW5ndGgsbD1mW2ldO2MtLTspaWYodFtjXT09bCl7bltpXT1hW2NdLGk9dm9pZCAwO2JyZWFrIG59Yz1uW2ldLGY9cj9yKGMsbCxpLG4sZik6dzt2YXIgcz10eXBlb2YgZj09XCJ1bmRlZmluZWRcIjtzJiYoZj1sLG9lKGwubGVuZ3RoKSYmKFNvKGwpfHxydShsKSk/Zj1TbyhjKT9jOmM/enQoYyk6W106Tm8obCl8fFllKGwpP2Y9WWUoYyk/ZXUoYyk6Tm8oYyk/Yzp7fTpzPWZhbHNlKSx0LnB1c2gobCksYS5wdXNoKGYpLHM/bltpXT1BcihmLGwscix0LGEpOihmPT09Zj9mIT09YzpjPT09YykmJihuW2ldPWYpLGk9dm9pZCAwXG59cmV0dXJuIGl9YT1uW2ldLGY9cj9yKGEsdCxpLG4sZik6dywobD10eXBlb2YgZj09XCJ1bmRlZmluZWRcIikmJihmPXQpLCFvJiZ0eXBlb2YgZj09XCJ1bmRlZmluZWRcInx8IWwmJihmPT09Zj9mPT09YTphIT09YSl8fChuW2ldPWYpfSksbn1mdW5jdGlvbiBqcihuKXtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIG51bGw9PXQ/dzp0W25dfX1mdW5jdGlvbiBrcihuLHQpe3JldHVybiBuK1B1KGNvKCkqKHQtbisxKSl9ZnVuY3Rpb24gRXIobix0LHIsZSx1KXtyZXR1cm4gdShuLGZ1bmN0aW9uKG4sdSxvKXtyPWU/KGU9ZmFsc2Usbik6dChyLG4sdSxvKX0pLHJ9ZnVuY3Rpb24gUnIobix0LHIpe3ZhciBlPS0xLHU9bi5sZW5ndGg7Zm9yKHQ9bnVsbD09dD8wOit0fHwwLDA+dCYmKHQ9LXQ+dT8wOnUrdCkscj10eXBlb2Ygcj09XCJ1bmRlZmluZWRcInx8cj51P3U6K3J8fDAsMD5yJiYocis9dSksdT10PnI/MDpyLXQ+Pj4wLHQ+Pj49MCxyPXd1KHUpOysrZTx1OylyW2VdPW5bZSt0XTtyZXR1cm4gcn1mdW5jdGlvbiBJcihuLHQpe3ZhciByO1xucmV0dXJuIG9yKG4sZnVuY3Rpb24obixlLHUpe3JldHVybiByPXQobixlLHUpLCFyfSksISFyfWZ1bmN0aW9uIE9yKG4scil7dmFyIGU9LTEsdT1RcigpLG89bi5sZW5ndGgsaT11PT10LGY9aSYmMjAwPD1vLGE9ZiYmeG8oKSxjPVtdO2E/KHU9QnQsaT1mYWxzZSk6KGY9ZmFsc2UsYT1yP1tdOmMpO246Zm9yKDsrK2U8bzspe3ZhciBsPW5bZV0scz1yP3IobCxlLG4pOmw7aWYoaSYmbD09PWwpe2Zvcih2YXIgcD1hLmxlbmd0aDtwLS07KWlmKGFbcF09PT1zKWNvbnRpbnVlIG47ciYmYS5wdXNoKHMpLGMucHVzaChsKX1lbHNlIDA+dShhLHMpJiYoKHJ8fGYpJiZhLnB1c2gocyksYy5wdXNoKGwpKX1yZXR1cm4gY31mdW5jdGlvbiBDcihuLHQpe2Zvcih2YXIgcj0tMSxlPXQubGVuZ3RoLHU9d3UoZSk7KytyPGU7KXVbcl09blt0W3JdXTtyZXR1cm4gdX1mdW5jdGlvbiBUcihuLHQpe3ZhciByPW47ciBpbnN0YW5jZW9mIFV0JiYocj1yLnZhbHVlKCkpO2Zvcih2YXIgZT0tMSx1PXQubGVuZ3RoOysrZTx1Oyl7dmFyIHI9W3JdLG89dFtlXTtcblZ1LmFwcGx5KHIsby5hcmdzKSxyPW8uZnVuYy5hcHBseShvLnRoaXNBcmcscil9cmV0dXJuIHJ9ZnVuY3Rpb24gU3Iobix0LHIpe3ZhciBlPTAsdT1uP24ubGVuZ3RoOmU7aWYodHlwZW9mIHQ9PVwibnVtYmVyXCImJnQ9PT10JiZ1PD1fbyl7Zm9yKDtlPHU7KXt2YXIgbz1lK3U+Pj4xLGk9bltvXTsocj9pPD10Omk8dCk/ZT1vKzE6dT1vfXJldHVybiB1fXJldHVybiBXcihuLHQsdnUscil9ZnVuY3Rpb24gV3Iobix0LHIsZSl7dD1yKHQpO2Zvcih2YXIgdT0wLG89bj9uLmxlbmd0aDowLGk9dCE9PXQsZj10eXBlb2YgdD09XCJ1bmRlZmluZWRcIjt1PG87KXt2YXIgYT1QdSgodStvKS8yKSxjPXIoblthXSksbD1jPT09YzsoaT9sfHxlOmY/bCYmKGV8fHR5cGVvZiBjIT1cInVuZGVmaW5lZFwiKTplP2M8PXQ6Yzx0KT91PWErMTpvPWF9cmV0dXJuIG9vKG8saG8pfWZ1bmN0aW9uIE5yKG4sdCxyKXtpZih0eXBlb2YgbiE9XCJmdW5jdGlvblwiKXJldHVybiB2dTtpZih0eXBlb2YgdD09XCJ1bmRlZmluZWRcIilyZXR1cm4gbjtcbnN3aXRjaChyKXtjYXNlIDE6cmV0dXJuIGZ1bmN0aW9uKHIpe3JldHVybiBuLmNhbGwodCxyKX07Y2FzZSAzOnJldHVybiBmdW5jdGlvbihyLGUsdSl7cmV0dXJuIG4uY2FsbCh0LHIsZSx1KX07Y2FzZSA0OnJldHVybiBmdW5jdGlvbihyLGUsdSxvKXtyZXR1cm4gbi5jYWxsKHQscixlLHUsbyl9O2Nhc2UgNTpyZXR1cm4gZnVuY3Rpb24ocixlLHUsbyxpKXtyZXR1cm4gbi5jYWxsKHQscixlLHUsbyxpKX19cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIG4uYXBwbHkodCxhcmd1bWVudHMpfX1mdW5jdGlvbiBVcihuKXtyZXR1cm4gRHUuY2FsbChuLDApfWZ1bmN0aW9uIEZyKG4sdCxyKXtmb3IodmFyIGU9ci5sZW5ndGgsdT0tMSxvPXVvKG4ubGVuZ3RoLWUsMCksaT0tMSxmPXQubGVuZ3RoLGE9d3UobytmKTsrK2k8ZjspYVtpXT10W2ldO2Zvcig7Kyt1PGU7KWFbclt1XV09blt1XTtmb3IoO28tLTspYVtpKytdPW5bdSsrXTtyZXR1cm4gYX1mdW5jdGlvbiBMcihuLHQscil7Zm9yKHZhciBlPS0xLHU9ci5sZW5ndGgsbz0tMSxpPXVvKG4ubGVuZ3RoLXUsMCksZj0tMSxhPXQubGVuZ3RoLGM9d3UoaSthKTsrK288aTspY1tvXT1uW29dO1xuZm9yKGk9bzsrK2Y8YTspY1tpK2ZdPXRbZl07Zm9yKDsrK2U8dTspY1tpK3JbZV1dPW5bbysrXTtyZXR1cm4gY31mdW5jdGlvbiAkcihuLHQpe3JldHVybiBmdW5jdGlvbihyLGUsdSl7dmFyIG89dD90KCk6e307aWYoZT1IcihlLHUsMyksU28ocikpe3U9LTE7Zm9yKHZhciBpPXIubGVuZ3RoOysrdTxpOyl7dmFyIGY9clt1XTtuKG8sZixlKGYsdSxyKSxyKX19ZWxzZSBvcihyLGZ1bmN0aW9uKHQscix1KXtuKG8sdCxlKHQscix1KSx1KX0pO3JldHVybiBvfX1mdW5jdGlvbiBCcihuKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgdD1hcmd1bWVudHMubGVuZ3RoLHI9YXJndW1lbnRzWzBdO2lmKDI+dHx8bnVsbD09cilyZXR1cm4gcjtpZigzPHQmJnVlKGFyZ3VtZW50c1sxXSxhcmd1bWVudHNbMl0sYXJndW1lbnRzWzNdKSYmKHQ9MiksMzx0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBhcmd1bWVudHNbdC0yXSl2YXIgZT1Ocihhcmd1bWVudHNbLS10LTFdLGFyZ3VtZW50c1t0LS1dLDUpO2Vsc2UgMjx0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBhcmd1bWVudHNbdC0xXSYmKGU9YXJndW1lbnRzWy0tdF0pO1xuZm9yKHZhciB1PTA7Kyt1PHQ7KXt2YXIgbz1hcmd1bWVudHNbdV07byYmbihyLG8sZSl9cmV0dXJuIHJ9fWZ1bmN0aW9uIHpyKG4sdCl7ZnVuY3Rpb24gcigpe3JldHVybih0aGlzIGluc3RhbmNlb2Ygcj9lOm4pLmFwcGx5KHQsYXJndW1lbnRzKX12YXIgZT1NcihuKTtyZXR1cm4gcn1mdW5jdGlvbiBEcihuKXtyZXR1cm4gZnVuY3Rpb24odCl7dmFyIHI9LTE7dD1wdShmdSh0KSk7Zm9yKHZhciBlPXQubGVuZ3RoLHU9XCJcIjsrK3I8ZTspdT1uKHUsdFtyXSxyKTtyZXR1cm4gdX19ZnVuY3Rpb24gTXIobil7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIHQ9d28obi5wcm90b3R5cGUpLHI9bi5hcHBseSh0LGFyZ3VtZW50cyk7cmV0dXJuIFhlKHIpP3I6dH19ZnVuY3Rpb24gcXIobix0KXtyZXR1cm4gZnVuY3Rpb24ocixlLG8pe28mJnVlKHIsZSxvKSYmKGU9bnVsbCk7dmFyIGk9SHIoKSxmPW51bGw9PWU7aWYoaT09PXRyJiZmfHwoZj1mYWxzZSxlPWkoZSxvLDMpKSxmKXtpZihlPVNvKHIpLGV8fCF0dShyKSlyZXR1cm4gbihlP3I6c2UocikpO1xuZT11fXJldHVybiBYcihyLGUsdCl9fWZ1bmN0aW9uIFByKG4sdCxyLGUsdSxvLGksZixhLGMpe2Z1bmN0aW9uIGwoKXtmb3IodmFyIGI9YXJndW1lbnRzLmxlbmd0aCxqPWIsaz13dShiKTtqLS07KWtbal09YXJndW1lbnRzW2pdO2lmKGUmJihrPUZyKGssZSx1KSksbyYmKGs9THIoayxvLGkpKSxffHx5KXt2YXIgaj1sLnBsYWNlaG9sZGVyLEU9ZyhrLGopLGI9Yi1FLmxlbmd0aDtpZihiPGMpe3ZhciBPPWY/enQoZik6bnVsbCxiPXVvKGMtYiwwKSxDPV8/RTpudWxsLEU9Xz9udWxsOkUsVD1fP2s6bnVsbCxrPV8/bnVsbDprO3JldHVybiB0fD1fP1I6SSx0Jj1+KF8/STpSKSx2fHwodCY9fih4fEEpKSxrPVByKG4sdCxyLFQsQyxrLEUsTyxhLGIpLGsucGxhY2Vob2xkZXI9aixrfX1pZihqPXA/cjp0aGlzLGgmJihuPWpbbV0pLGYpZm9yKE89ay5sZW5ndGgsYj1vbyhmLmxlbmd0aCxPKSxDPXp0KGspO2ItLTspRT1mW2JdLGtbYl09ZWUoRSxPKT9DW0VdOnc7cmV0dXJuIHMmJmE8ay5sZW5ndGgmJihrLmxlbmd0aD1hKSwodGhpcyBpbnN0YW5jZW9mIGw/ZHx8TXIobik6bikuYXBwbHkoaixrKVxufXZhciBzPXQmQyxwPXQmeCxoPXQmQSxfPXQmayx2PXQmaix5PXQmRSxkPSFoJiZNcihuKSxtPW47cmV0dXJuIGx9ZnVuY3Rpb24gS3Iobix0LHIpe3JldHVybiBuPW4ubGVuZ3RoLHQ9K3Qsbjx0JiZybyh0KT8odC09bixyPW51bGw9PXI/XCIgXCI6citcIlwiLGx1KHIsTXUodC9yLmxlbmd0aCkpLnNsaWNlKDAsdCkpOlwiXCJ9ZnVuY3Rpb24gVnIobix0LHIsZSl7ZnVuY3Rpb24gdSgpe2Zvcih2YXIgdD0tMSxmPWFyZ3VtZW50cy5sZW5ndGgsYT0tMSxjPWUubGVuZ3RoLGw9d3UoZitjKTsrK2E8YzspbFthXT1lW2FdO2Zvcig7Zi0tOylsW2ErK109YXJndW1lbnRzWysrdF07cmV0dXJuKHRoaXMgaW5zdGFuY2VvZiB1P2k6bikuYXBwbHkobz9yOnRoaXMsbCl9dmFyIG89dCZ4LGk9TXIobik7cmV0dXJuIHV9ZnVuY3Rpb24gWXIobix0LHIsZSx1LG8saSxmKXt2YXIgYT10JkE7aWYoIWEmJnR5cGVvZiBuIT1cImZ1bmN0aW9uXCIpdGhyb3cgbmV3IE91KCQpO3ZhciBjPWU/ZS5sZW5ndGg6MDtpZihjfHwodCY9fihSfEkpLGU9dT1udWxsKSxjLT11P3UubGVuZ3RoOjAsdCZJKXt2YXIgbD1lLHM9dTtcbmU9dT1udWxsfXZhciBwPSFhJiZBbyhuKTtpZihyPVtuLHQscixlLHUsbCxzLG8saSxmXSxwJiZ0cnVlIT09cCl7ZT1yWzFdLHQ9cFsxXSxmPWV8dCxvPUN8Tyx1PXh8QSxpPW98dXxqfEU7dmFyIGw9ZSZDJiYhKHQmQykscz1lJk8mJiEodCZPKSxoPShzP3I6cClbN10sXz0obD9yOnApWzhdO289Zj49byYmZjw9aSYmKGU8T3x8KHN8fGwpJiZoLmxlbmd0aDw9XyksKCEoZT49TyYmdD51fHxlPnUmJnQ+PU8pfHxvKSYmKHQmeCYmKHJbMl09cFsyXSxmfD1lJng/MDpqKSwoZT1wWzNdKSYmKHU9clszXSxyWzNdPXU/RnIodSxlLHBbNF0pOnp0KGUpLHJbNF09dT9nKHJbM10sQik6enQocFs0XSkpLChlPXBbNV0pJiYodT1yWzVdLHJbNV09dT9Mcih1LGUscFs2XSk6enQoZSkscls2XT11P2cocls1XSxCKTp6dChwWzZdKSksKGU9cFs3XSkmJihyWzddPXp0KGUpKSx0JkMmJihyWzhdPW51bGw9PXJbOF0/cFs4XTpvbyhyWzhdLHBbOF0pKSxudWxsPT1yWzldJiYocls5XT1wWzldKSxyWzBdPXBbMF0sclsxXT1mKSx0PXJbMV0sZj1yWzldXG59cmV0dXJuIHJbOV09bnVsbD09Zj9hPzA6bi5sZW5ndGg6dW8oZi1jLDApfHwwLChwP2JvOmpvKSh0PT14P3pyKHJbMF0sclsyXSk6dCE9UiYmdCE9KHh8Uil8fHJbNF0ubGVuZ3RoP1ByLmFwcGx5KHcscik6VnIuYXBwbHkodyxyKSxyKX1mdW5jdGlvbiBacihuLHQscixlLHUsbyxpKXt2YXIgZj0tMSxhPW4ubGVuZ3RoLGM9dC5sZW5ndGgsbD10cnVlO2lmKGEhPWMmJighdXx8Yzw9YSkpcmV0dXJuIGZhbHNlO2Zvcig7bCYmKytmPGE7KXt2YXIgcz1uW2ZdLHA9dFtmXSxsPXc7aWYoZSYmKGw9dT9lKHAscyxmKTplKHMscCxmKSksdHlwZW9mIGw9PVwidW5kZWZpbmVkXCIpaWYodSlmb3IodmFyIGg9YztoLS0mJihwPXRbaF0sIShsPXMmJnM9PT1wfHxyKHMscCxlLHUsbyxpKSkpOyk7ZWxzZSBsPXMmJnM9PT1wfHxyKHMscCxlLHUsbyxpKX1yZXR1cm4hIWx9ZnVuY3Rpb24gR3Iobix0LHIpe3N3aXRjaChyKXtjYXNlIE06Y2FzZSBxOnJldHVybituPT0rdDtjYXNlIFA6cmV0dXJuIG4ubmFtZT09dC5uYW1lJiZuLm1lc3NhZ2U9PXQubWVzc2FnZTtcbmNhc2UgVjpyZXR1cm4gbiE9K24/dCE9K3Q6MD09bj8xL249PTEvdDpuPT0rdDtjYXNlIFo6Y2FzZSBHOnJldHVybiBuPT10K1wiXCJ9cmV0dXJuIGZhbHNlfWZ1bmN0aW9uIEpyKG4sdCxyLGUsdSxvLGkpe3ZhciBmPUZvKG4pLGE9Zi5sZW5ndGgsYz1Gbyh0KS5sZW5ndGg7aWYoYSE9YyYmIXUpcmV0dXJuIGZhbHNlO2Zvcih2YXIgbCxjPS0xOysrYzxhOyl7dmFyIHM9ZltjXSxwPVV1LmNhbGwodCxzKTtpZihwKXt2YXIgaD1uW3NdLF89dFtzXSxwPXc7ZSYmKHA9dT9lKF8saCxzKTplKGgsXyxzKSksdHlwZW9mIHA9PVwidW5kZWZpbmVkXCImJihwPWgmJmg9PT1ffHxyKGgsXyxlLHUsbyxpKSl9aWYoIXApcmV0dXJuIGZhbHNlO2x8fChsPVwiY29uc3RydWN0b3JcIj09cyl9cmV0dXJuIGx8fChyPW4uY29uc3RydWN0b3IsZT10LmNvbnN0cnVjdG9yLCEociE9ZSYmXCJjb25zdHJ1Y3RvclwiaW4gbiYmXCJjb25zdHJ1Y3RvclwiaW4gdCl8fHR5cGVvZiByPT1cImZ1bmN0aW9uXCImJnIgaW5zdGFuY2VvZiByJiZ0eXBlb2YgZT09XCJmdW5jdGlvblwiJiZlIGluc3RhbmNlb2YgZSk/dHJ1ZTpmYWxzZVxufWZ1bmN0aW9uIFhyKG4sdCxyKXt2YXIgZT1yP3NvOmxvLHU9ZSxvPXU7cmV0dXJuIG9yKG4sZnVuY3Rpb24obixpLGYpe2k9dChuLGksZiksKChyP2k8dTppPnUpfHxpPT09ZSYmaT09PW8pJiYodT1pLG89bil9KSxvfWZ1bmN0aW9uIEhyKG4sdCxyKXt2YXIgZT1XdC5jYWxsYmFja3x8X3UsZT1lPT09X3U/dHI6ZTtyZXR1cm4gcj9lKG4sdCxyKTplfWZ1bmN0aW9uIFFyKG4scixlKXt2YXIgdT1XdC5pbmRleE9mfHxkZSx1PXU9PT1kZT90OnU7cmV0dXJuIG4/dShuLHIsZSk6dX1mdW5jdGlvbiBuZShuKXt2YXIgdD1uLmxlbmd0aCxyPW5ldyBuLmNvbnN0cnVjdG9yKHQpO3JldHVybiB0JiZcInN0cmluZ1wiPT10eXBlb2YgblswXSYmVXUuY2FsbChuLFwiaW5kZXhcIikmJihyLmluZGV4PW4uaW5kZXgsci5pbnB1dD1uLmlucHV0KSxyfWZ1bmN0aW9uIHRlKG4pe3JldHVybiBuPW4uY29uc3RydWN0b3IsdHlwZW9mIG49PVwiZnVuY3Rpb25cIiYmbiBpbnN0YW5jZW9mIG58fChuPUV1KSxuZXcgblxufWZ1bmN0aW9uIHJlKG4sdCxyKXt2YXIgZT1uLmNvbnN0cnVjdG9yO3N3aXRjaCh0KXtjYXNlIEo6cmV0dXJuIFVyKG4pO2Nhc2UgTTpjYXNlIHE6cmV0dXJuIG5ldyBlKCtuKTtjYXNlIFg6Y2FzZSBIOmNhc2UgUTpjYXNlIG50OmNhc2UgdHQ6Y2FzZSBydDpjYXNlIGV0OmNhc2UgdXQ6Y2FzZSBvdDpyZXR1cm4gdD1uLmJ1ZmZlcixuZXcgZShyP1VyKHQpOnQsbi5ieXRlT2Zmc2V0LG4ubGVuZ3RoKTtjYXNlIFY6Y2FzZSBHOnJldHVybiBuZXcgZShuKTtjYXNlIFo6dmFyIHU9bmV3IGUobi5zb3VyY2UseXQuZXhlYyhuKSk7dS5sYXN0SW5kZXg9bi5sYXN0SW5kZXh9cmV0dXJuIHV9ZnVuY3Rpb24gZWUobix0KXtyZXR1cm4gbj0rbix0PW51bGw9PXQ/dm86dCwtMTxuJiYwPT1uJTEmJm48dH1mdW5jdGlvbiB1ZShuLHQscil7aWYoIVhlKHIpKXJldHVybiBmYWxzZTt2YXIgZT10eXBlb2YgdDtyZXR1cm5cIm51bWJlclwiPT1lPyhlPXIubGVuZ3RoLGU9b2UoZSkmJmVlKHQsZSkpOmU9XCJzdHJpbmdcIj09ZSYmdCBpbiByLGUmJnJbdF09PT1uXG59ZnVuY3Rpb24gb2Uobil7cmV0dXJuIHR5cGVvZiBuPT1cIm51bWJlclwiJiYtMTxuJiYwPT1uJTEmJm48PXZvfWZ1bmN0aW9uIGllKG4pe3JldHVybiBuPT09biYmKDA9PT1uPzA8MS9uOiFYZShuKSl9ZnVuY3Rpb24gZmUobix0KXtuPXBlKG4pO2Zvcih2YXIgcj0tMSxlPXQubGVuZ3RoLHU9e307KytyPGU7KXt2YXIgbz10W3JdO28gaW4gbiYmKHVbb109bltvXSl9cmV0dXJuIHV9ZnVuY3Rpb24gYWUobix0KXt2YXIgcj17fTtyZXR1cm4gaHIobixmdW5jdGlvbihuLGUsdSl7dChuLGUsdSkmJihyW2VdPW4pfSkscn1mdW5jdGlvbiBjZShuKXt2YXIgdDtpZighaChuKXx8THUuY2FsbChuKSE9WXx8IShVdS5jYWxsKG4sXCJjb25zdHJ1Y3RvclwiKXx8KHQ9bi5jb25zdHJ1Y3Rvcix0eXBlb2YgdCE9XCJmdW5jdGlvblwifHx0IGluc3RhbmNlb2YgdCkpKXJldHVybiBmYWxzZTt2YXIgcjtyZXR1cm4gaHIobixmdW5jdGlvbihuLHQpe3I9dH0pLHR5cGVvZiByPT1cInVuZGVmaW5lZFwifHxVdS5jYWxsKG4scilcbn1mdW5jdGlvbiBsZShuKXtmb3IodmFyIHQ9b3Uobikscj10Lmxlbmd0aCxlPXImJm4ubGVuZ3RoLHU9V3Quc3VwcG9ydCx1PWUmJm9lKGUpJiYoU28obil8fHUubm9uRW51bUFyZ3MmJlllKG4pKSxvPS0xLGk9W107KytvPHI7KXt2YXIgZj10W29dOyh1JiZlZShmLGUpfHxVdS5jYWxsKG4sZikpJiZpLnB1c2goZil9cmV0dXJuIGl9ZnVuY3Rpb24gc2Uobil7cmV0dXJuIG51bGw9PW4/W106b2Uobi5sZW5ndGgpP1hlKG4pP246RXUobik6aXUobil9ZnVuY3Rpb24gcGUobil7cmV0dXJuIFhlKG4pP246RXUobil9ZnVuY3Rpb24gaGUobil7cmV0dXJuIG4gaW5zdGFuY2VvZiBVdD9uLmNsb25lKCk6bmV3IE50KG4uX193cmFwcGVkX18sbi5fX2NoYWluX18senQobi5fX2FjdGlvbnNfXykpfWZ1bmN0aW9uIF9lKG4sdCxyKXtyZXR1cm4gbiYmbi5sZW5ndGg/KChyP3VlKG4sdCxyKTpudWxsPT10KSYmKHQ9MSksUnIobiwwPnQ/MDp0KSk6W119ZnVuY3Rpb24gZ2Uobix0LHIpe3ZhciBlPW4/bi5sZW5ndGg6MDtcbnJldHVybiBlPygocj91ZShuLHQscik6bnVsbD09dCkmJih0PTEpLHQ9ZS0oK3R8fDApLFJyKG4sMCwwPnQ/MDp0KSk6W119ZnVuY3Rpb24gdmUobix0LHIpe3ZhciBlPS0xLHU9bj9uLmxlbmd0aDowO2Zvcih0PUhyKHQsciwzKTsrK2U8dTspaWYodChuW2VdLGUsbikpcmV0dXJuIGU7cmV0dXJuLTF9ZnVuY3Rpb24geWUobil7cmV0dXJuIG4/blswXTp3fWZ1bmN0aW9uIGRlKG4scixlKXt2YXIgdT1uP24ubGVuZ3RoOjA7aWYoIXUpcmV0dXJuLTE7aWYodHlwZW9mIGU9PVwibnVtYmVyXCIpZT0wPmU/dW8odStlLDApOmV8fDA7ZWxzZSBpZihlKXJldHVybiBlPVNyKG4sciksbj1uW2VdLChyPT09cj9yPT09bjpuIT09bik/ZTotMTtyZXR1cm4gdChuLHIsZSl9ZnVuY3Rpb24gbWUobil7cmV0dXJuIF9lKG4sMSl9ZnVuY3Rpb24gd2UobixyLGUsdSl7aWYoIW58fCFuLmxlbmd0aClyZXR1cm5bXTt0eXBlb2YgciE9XCJib29sZWFuXCImJm51bGwhPXImJih1PWUsZT11ZShuLHIsdSk/bnVsbDpyLHI9ZmFsc2UpO1xudmFyIG89SHIoKTtpZigobyE9PXRyfHxudWxsIT1lKSYmKGU9byhlLHUsMykpLHImJlFyKCk9PXQpe3I9ZTt2YXIgaTtlPS0xLHU9bi5sZW5ndGg7Zm9yKHZhciBvPS0xLGY9W107KytlPHU7KXt2YXIgYT1uW2VdLGM9cj9yKGEsZSxuKTphO2UmJmk9PT1jfHwoaT1jLGZbKytvXT1hKX1uPWZ9ZWxzZSBuPU9yKG4sZSk7cmV0dXJuIG59ZnVuY3Rpb24gYmUobil7Zm9yKHZhciB0PS0xLHI9KG4mJm4ubGVuZ3RoJiZWdChLdChuLE51KSkpPj4+MCxlPXd1KHIpOysrdDxyOyllW3RdPUt0KG4sanIodCkpO3JldHVybiBlfWZ1bmN0aW9uIHhlKG4sdCl7dmFyIHI9LTEsZT1uP24ubGVuZ3RoOjAsdT17fTtmb3IoIWV8fHR8fFNvKG5bMF0pfHwodD1bXSk7KytyPGU7KXt2YXIgbz1uW3JdO3Q/dVtvXT10W3JdOm8mJih1W29bMF1dPW9bMV0pfXJldHVybiB1fWZ1bmN0aW9uIEFlKG4pe3JldHVybiBuPVd0KG4pLG4uX19jaGFpbl9fPXRydWUsbn1mdW5jdGlvbiBqZShuLHQscil7cmV0dXJuIHQuY2FsbChyLG4pXG59ZnVuY3Rpb24ga2Uobix0LHIpe3ZhciBlPW4/bi5sZW5ndGg6MDtyZXR1cm4gb2UoZSl8fChuPWl1KG4pLGU9bi5sZW5ndGgpLGU/KHI9dHlwZW9mIHI9PVwibnVtYmVyXCI/MD5yP3VvKGUrciwwKTpyfHwwOjAsdHlwZW9mIG49PVwic3RyaW5nXCJ8fCFTbyhuKSYmdHUobik/cjxlJiYtMTxuLmluZGV4T2YodCxyKTotMTxRcihuLHQscikpOmZhbHNlfWZ1bmN0aW9uIEVlKG4sdCxyKXt2YXIgZT1TbyhuKT9xdDpmcjtyZXR1cm4odHlwZW9mIHQhPVwiZnVuY3Rpb25cInx8dHlwZW9mIHIhPVwidW5kZWZpbmVkXCIpJiYodD1Icih0LHIsMykpLGUobix0KX1mdW5jdGlvbiBSZShuLHQscil7dmFyIGU9U28obik/UHQ6YXI7cmV0dXJuIHQ9SHIodCxyLDMpLGUobix0KX1mdW5jdGlvbiBJZShuLHQscil7cmV0dXJuIFNvKG4pPyh0PXZlKG4sdCxyKSwtMTx0P25bdF06dyk6KHQ9SHIodCxyLDMpLGNyKG4sdCxvcikpfWZ1bmN0aW9uIE9lKG4sdCxyKXtyZXR1cm4gdHlwZW9mIHQ9PVwiZnVuY3Rpb25cIiYmdHlwZW9mIHI9PVwidW5kZWZpbmVkXCImJlNvKG4pP010KG4sdCk6b3IobixOcih0LHIsMykpXG59ZnVuY3Rpb24gQ2Uobix0LHIpe2lmKHR5cGVvZiB0PT1cImZ1bmN0aW9uXCImJnR5cGVvZiByPT1cInVuZGVmaW5lZFwiJiZTbyhuKSlmb3Iocj1uLmxlbmd0aDtyLS0mJmZhbHNlIT09dChuW3JdLHIsbik7KTtlbHNlIG49aXIobixOcih0LHIsMykpO3JldHVybiBufWZ1bmN0aW9uIFRlKG4sdCxyKXt2YXIgZT1TbyhuKT9LdDp3cjtyZXR1cm4gdD1Icih0LHIsMyksZShuLHQpfWZ1bmN0aW9uIFNlKG4sdCxyLGUpe3JldHVybihTbyhuKT9ZdDpFcikobixIcih0LGUsNCksciwzPmFyZ3VtZW50cy5sZW5ndGgsb3IpfWZ1bmN0aW9uIFdlKG4sdCxyLGUpe3JldHVybihTbyhuKT9adDpFcikobixIcih0LGUsNCksciwzPmFyZ3VtZW50cy5sZW5ndGgsaXIpfWZ1bmN0aW9uIE5lKG4sdCxyKXtyZXR1cm4ocj91ZShuLHQscik6bnVsbD09dCk/KG49c2UobiksdD1uLmxlbmd0aCwwPHQ/bltrcigwLHQtMSldOncpOihuPVVlKG4pLG4ubGVuZ3RoPW9vKDA+dD8wOit0fHwwLG4ubGVuZ3RoKSxuKX1mdW5jdGlvbiBVZShuKXtuPXNlKG4pO1xuZm9yKHZhciB0PS0xLHI9bi5sZW5ndGgsZT13dShyKTsrK3Q8cjspe3ZhciB1PWtyKDAsdCk7dCE9dSYmKGVbdF09ZVt1XSksZVt1XT1uW3RdfXJldHVybiBlfWZ1bmN0aW9uIEZlKG4sdCxyKXt2YXIgZT1TbyhuKT9HdDpJcjtyZXR1cm4odHlwZW9mIHQhPVwiZnVuY3Rpb25cInx8dHlwZW9mIHIhPVwidW5kZWZpbmVkXCIpJiYodD1Icih0LHIsMykpLGUobix0KX1mdW5jdGlvbiBMZShuLHQpe3ZhciByO2lmKHR5cGVvZiB0IT1cImZ1bmN0aW9uXCIpe2lmKHR5cGVvZiBuIT1cImZ1bmN0aW9uXCIpdGhyb3cgbmV3IE91KCQpO3ZhciBlPW47bj10LHQ9ZX1yZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gMDwtLW4/cj10LmFwcGx5KHRoaXMsYXJndW1lbnRzKTp0PW51bGwscn19ZnVuY3Rpb24gJGUobix0KXt2YXIgcj14O2lmKDI8YXJndW1lbnRzLmxlbmd0aCl2YXIgZT1Scihhcmd1bWVudHMsMiksdT1nKGUsJGUucGxhY2Vob2xkZXIpLHI9cnxSO3JldHVybiBZcihuLHIsdCxlLHUpfWZ1bmN0aW9uIEJlKG4sdCl7dmFyIHI9eHxBO1xuaWYoMjxhcmd1bWVudHMubGVuZ3RoKXZhciBlPVJyKGFyZ3VtZW50cywyKSx1PWcoZSxCZS5wbGFjZWhvbGRlcikscj1yfFI7cmV0dXJuIFlyKHQscixuLGUsdSl9ZnVuY3Rpb24gemUobix0LHIpe3JldHVybiByJiZ1ZShuLHQscikmJih0PW51bGwpLG49WXIobixrLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCx0KSxuLnBsYWNlaG9sZGVyPXplLnBsYWNlaG9sZGVyLG59ZnVuY3Rpb24gRGUobix0LHIpe3JldHVybiByJiZ1ZShuLHQscikmJih0PW51bGwpLG49WXIobixFLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCx0KSxuLnBsYWNlaG9sZGVyPURlLnBsYWNlaG9sZGVyLG59ZnVuY3Rpb24gTWUobix0LHIpe2Z1bmN0aW9uIGUoKXt2YXIgcj10LShUbygpLWMpOzA+PXJ8fHI+dD8oZiYmcXUoZikscj1wLGY9cz1wPXcsciYmKGg9VG8oKSxhPW4uYXBwbHkobCxpKSxzfHxmfHwoaT1sPW51bGwpKSk6cz1HdShlLHIpfWZ1bmN0aW9uIHUoKXtzJiZxdShzKSxmPXM9cD13LChnfHxfIT09dCkmJihoPVRvKCksYT1uLmFwcGx5KGwsaSksc3x8Znx8KGk9bD1udWxsKSlcbn1mdW5jdGlvbiBvKCl7aWYoaT1hcmd1bWVudHMsYz1UbygpLGw9dGhpcyxwPWcmJihzfHwhdiksZmFsc2U9PT1fKXZhciByPXYmJiFzO2Vsc2V7Znx8dnx8KGg9Yyk7dmFyIG89Xy0oYy1oKSx5PTA+PW98fG8+Xzt5PyhmJiYoZj1xdShmKSksaD1jLGE9bi5hcHBseShsLGkpKTpmfHwoZj1HdSh1LG8pKX1yZXR1cm4geSYmcz9zPXF1KHMpOnN8fHQ9PT1ffHwocz1HdShlLHQpKSxyJiYoeT10cnVlLGE9bi5hcHBseShsLGkpKSwheXx8c3x8Znx8KGk9bD1udWxsKSxhfXZhciBpLGYsYSxjLGwscyxwLGg9MCxfPWZhbHNlLGc9dHJ1ZTtpZih0eXBlb2YgbiE9XCJmdW5jdGlvblwiKXRocm93IG5ldyBPdSgkKTtpZih0PTA+dD8wOnQsdHJ1ZT09PXIpdmFyIHY9dHJ1ZSxnPWZhbHNlO2Vsc2UgWGUocikmJih2PXIubGVhZGluZyxfPVwibWF4V2FpdFwiaW4gciYmdW8oK3IubWF4V2FpdHx8MCx0KSxnPVwidHJhaWxpbmdcImluIHI/ci50cmFpbGluZzpnKTtyZXR1cm4gby5jYW5jZWw9ZnVuY3Rpb24oKXtzJiZxdShzKSxmJiZxdShmKSxmPXM9cD13XG59LG99ZnVuY3Rpb24gcWUoKXt2YXIgbj1hcmd1bWVudHMsdD1uLmxlbmd0aC0xO2lmKDA+dClyZXR1cm4gZnVuY3Rpb24obil7cmV0dXJuIG59O2lmKCFxdChuLEplKSl0aHJvdyBuZXcgT3UoJCk7cmV0dXJuIGZ1bmN0aW9uKCl7Zm9yKHZhciByPXQsZT1uW3JdLmFwcGx5KHRoaXMsYXJndW1lbnRzKTtyLS07KWU9bltyXS5jYWxsKHRoaXMsZSk7cmV0dXJuIGV9fWZ1bmN0aW9uIFBlKG4sdCl7ZnVuY3Rpb24gcigpe3ZhciBlPXIuY2FjaGUsdT10P3QuYXBwbHkodGhpcyxhcmd1bWVudHMpOmFyZ3VtZW50c1swXTtpZihlLmhhcyh1KSlyZXR1cm4gZS5nZXQodSk7dmFyIG89bi5hcHBseSh0aGlzLGFyZ3VtZW50cyk7cmV0dXJuIGUuc2V0KHUsbyksb31pZih0eXBlb2YgbiE9XCJmdW5jdGlvblwifHx0JiZ0eXBlb2YgdCE9XCJmdW5jdGlvblwiKXRocm93IG5ldyBPdSgkKTtyZXR1cm4gci5jYWNoZT1uZXcgUGUuQ2FjaGUscn1mdW5jdGlvbiBLZShuKXt2YXIgdD1Scihhcmd1bWVudHMsMSkscj1nKHQsS2UucGxhY2Vob2xkZXIpO1xucmV0dXJuIFlyKG4sUixudWxsLHQscil9ZnVuY3Rpb24gVmUobil7dmFyIHQ9UnIoYXJndW1lbnRzLDEpLHI9Zyh0LFZlLnBsYWNlaG9sZGVyKTtyZXR1cm4gWXIobixJLG51bGwsdCxyKX1mdW5jdGlvbiBZZShuKXtyZXR1cm4gb2UoaChuKT9uLmxlbmd0aDp3KSYmTHUuY2FsbChuKT09enx8ZmFsc2V9ZnVuY3Rpb24gWmUobil7cmV0dXJuIG4mJjE9PT1uLm5vZGVUeXBlJiZoKG4pJiYtMTxMdS5jYWxsKG4pLmluZGV4T2YoXCJFbGVtZW50XCIpfHxmYWxzZX1mdW5jdGlvbiBHZShuKXtyZXR1cm4gaChuKSYmdHlwZW9mIG4ubWVzc2FnZT09XCJzdHJpbmdcIiYmTHUuY2FsbChuKT09UHx8ZmFsc2V9ZnVuY3Rpb24gSmUobil7cmV0dXJuIHR5cGVvZiBuPT1cImZ1bmN0aW9uXCJ8fGZhbHNlfWZ1bmN0aW9uIFhlKG4pe3ZhciB0PXR5cGVvZiBuO3JldHVyblwiZnVuY3Rpb25cIj09dHx8biYmXCJvYmplY3RcIj09dHx8ZmFsc2V9ZnVuY3Rpb24gSGUobil7cmV0dXJuIG51bGw9PW4/ZmFsc2U6THUuY2FsbChuKT09Sz9CdS50ZXN0KFd1LmNhbGwobikpOmgobikmJnd0LnRlc3Qobil8fGZhbHNlXG59ZnVuY3Rpb24gUWUobil7cmV0dXJuIHR5cGVvZiBuPT1cIm51bWJlclwifHxoKG4pJiZMdS5jYWxsKG4pPT1WfHxmYWxzZX1mdW5jdGlvbiBudShuKXtyZXR1cm4gaChuKSYmTHUuY2FsbChuKT09Wnx8ZmFsc2V9ZnVuY3Rpb24gdHUobil7cmV0dXJuIHR5cGVvZiBuPT1cInN0cmluZ1wifHxoKG4pJiZMdS5jYWxsKG4pPT1HfHxmYWxzZX1mdW5jdGlvbiBydShuKXtyZXR1cm4gaChuKSYmb2Uobi5sZW5ndGgpJiZDdFtMdS5jYWxsKG4pXXx8ZmFsc2V9ZnVuY3Rpb24gZXUobil7cmV0dXJuIG5yKG4sb3UobikpfWZ1bmN0aW9uIHV1KG4pe3JldHVybiB2cihuLG91KG4pKX1mdW5jdGlvbiBvdShuKXtpZihudWxsPT1uKXJldHVybltdO1hlKG4pfHwobj1FdShuKSk7Zm9yKHZhciB0PW4ubGVuZ3RoLHQ9dCYmb2UodCkmJihTbyhuKXx8bW8ubm9uRW51bUFyZ3MmJlllKG4pKSYmdHx8MCxyPW4uY29uc3RydWN0b3IsZT0tMSxyPXR5cGVvZiByPT1cImZ1bmN0aW9uXCImJnIucHJvdG90eXBlPT09bix1PXd1KHQpLG89MDx0OysrZTx0Oyl1W2VdPWUrXCJcIjtcbmZvcih2YXIgaSBpbiBuKW8mJmVlKGksdCl8fFwiY29uc3RydWN0b3JcIj09aSYmKHJ8fCFVdS5jYWxsKG4saSkpfHx1LnB1c2goaSk7cmV0dXJuIHV9ZnVuY3Rpb24gaXUobil7cmV0dXJuIENyKG4sRm8obikpfWZ1bmN0aW9uIGZ1KG4pe3JldHVybihuPWUobikpJiZuLnJlcGxhY2UoYnQsYyl9ZnVuY3Rpb24gYXUobil7cmV0dXJuKG49ZShuKSkmJmp0LnRlc3Qobik/bi5yZXBsYWNlKEF0LFwiXFxcXCQmXCIpOm59ZnVuY3Rpb24gY3Uobix0LHIpe3JldHVybiByJiZ1ZShuLHQscikmJih0PTApLGFvKG4sdCl9ZnVuY3Rpb24gbHUobix0KXt2YXIgcj1cIlwiO2lmKG49ZShuKSx0PSt0LDE+dHx8IW58fCFybyh0KSlyZXR1cm4gcjtkbyB0JTImJihyKz1uKSx0PVB1KHQvMiksbis9bjt3aGlsZSh0KTtyZXR1cm4gcn1mdW5jdGlvbiBzdShuLHQscil7dmFyIHU9bjtyZXR1cm4obj1lKG4pKT8ocj91ZSh1LHQscik6bnVsbD09dCk/bi5zbGljZSh2KG4pLHkobikrMSk6KHQrPVwiXCIsbi5zbGljZShvKG4sdCksaShuLHQpKzEpKTpuXG59ZnVuY3Rpb24gcHUobix0LHIpe3JldHVybiByJiZ1ZShuLHQscikmJih0PW51bGwpLG49ZShuKSxuLm1hdGNoKHR8fFJ0KXx8W119ZnVuY3Rpb24gaHUobil7dHJ5e3JldHVybiBuLmFwcGx5KHcsUnIoYXJndW1lbnRzLDEpKX1jYXRjaCh0KXtyZXR1cm4gR2UodCk/dDpuZXcgeHUodCl9fWZ1bmN0aW9uIF91KG4sdCxyKXtyZXR1cm4gciYmdWUobix0LHIpJiYodD1udWxsKSxoKG4pP3l1KG4pOnRyKG4sdCl9ZnVuY3Rpb24gZ3Uobil7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIG59fWZ1bmN0aW9uIHZ1KG4pe3JldHVybiBufWZ1bmN0aW9uIHl1KG4pe3JldHVybiBicihycihuLHRydWUpKX1mdW5jdGlvbiBkdShuLHQscil7aWYobnVsbD09cil7dmFyIGU9WGUodCksdT1lJiZGbyh0KTsoKHU9dSYmdS5sZW5ndGgmJnZyKHQsdSkpP3UubGVuZ3RoOmUpfHwodT1mYWxzZSxyPXQsdD1uLG49dGhpcyl9dXx8KHU9dnIodCxGbyh0KSkpO3ZhciBvPXRydWUsZT0tMSxpPUplKG4pLGY9dS5sZW5ndGg7XG4hMT09PXI/bz1mYWxzZTpYZShyKSYmXCJjaGFpblwiaW4gciYmKG89ci5jaGFpbik7Zm9yKDsrK2U8Zjspe3I9dVtlXTt2YXIgYT10W3JdO25bcl09YSxpJiYobi5wcm90b3R5cGVbcl09ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIHI9dGhpcy5fX2NoYWluX187aWYob3x8cil7dmFyIGU9bih0aGlzLl9fd3JhcHBlZF9fKTtyZXR1cm4oZS5fX2FjdGlvbnNfXz16dCh0aGlzLl9fYWN0aW9uc19fKSkucHVzaCh7ZnVuYzp0LGFyZ3M6YXJndW1lbnRzLHRoaXNBcmc6bn0pLGUuX19jaGFpbl9fPXIsZX1yZXR1cm4gcj1bdGhpcy52YWx1ZSgpXSxWdS5hcHBseShyLGFyZ3VtZW50cyksdC5hcHBseShuLHIpfX0oYSkpfXJldHVybiBufWZ1bmN0aW9uIG11KCl7fV89Xz9EdC5kZWZhdWx0cygkdC5PYmplY3QoKSxfLER0LnBpY2soJHQsT3QpKTokdDt2YXIgd3U9Xy5BcnJheSxidT1fLkRhdGUseHU9Xy5FcnJvcixBdT1fLkZ1bmN0aW9uLGp1PV8uTWF0aCxrdT1fLk51bWJlcixFdT1fLk9iamVjdCxSdT1fLlJlZ0V4cCxJdT1fLlN0cmluZyxPdT1fLlR5cGVFcnJvcixDdT13dS5wcm90b3R5cGUsVHU9RXUucHJvdG90eXBlLFN1PShTdT1fLndpbmRvdykmJlN1LmRvY3VtZW50LFd1PUF1LnByb3RvdHlwZS50b1N0cmluZyxOdT1qcihcImxlbmd0aFwiKSxVdT1UdS5oYXNPd25Qcm9wZXJ0eSxGdT0wLEx1PVR1LnRvU3RyaW5nLCR1PV8uXyxCdT1SdShcIl5cIithdShMdSkucmVwbGFjZSgvdG9TdHJpbmd8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZyxcIiQxLio/XCIpK1wiJFwiKSx6dT1IZSh6dT1fLkFycmF5QnVmZmVyKSYmenUsRHU9SGUoRHU9enUmJm5ldyB6dSgwKS5zbGljZSkmJkR1LE11PWp1LmNlaWwscXU9Xy5jbGVhclRpbWVvdXQsUHU9anUuZmxvb3IsS3U9SGUoS3U9RXUuZ2V0UHJvdG90eXBlT2YpJiZLdSxWdT1DdS5wdXNoLFl1PVR1LnByb3BlcnR5SXNFbnVtZXJhYmxlLFp1PUhlKFp1PV8uU2V0KSYmWnUsR3U9Xy5zZXRUaW1lb3V0LEp1PUN1LnNwbGljZSxYdT1IZShYdT1fLlVpbnQ4QXJyYXkpJiZYdSxIdT1IZShIdT1fLldlYWtNYXApJiZIdSxRdT1mdW5jdGlvbigpe3RyeXt2YXIgbj1IZShuPV8uRmxvYXQ2NEFycmF5KSYmbix0PW5ldyBuKG5ldyB6dSgxMCksMCwxKSYmblxufWNhdGNoKHIpe31yZXR1cm4gdH0oKSxubz1IZShubz13dS5pc0FycmF5KSYmbm8sdG89SGUodG89RXUuY3JlYXRlKSYmdG8scm89Xy5pc0Zpbml0ZSxlbz1IZShlbz1FdS5rZXlzKSYmZW8sdW89anUubWF4LG9vPWp1Lm1pbixpbz1IZShpbz1idS5ub3cpJiZpbyxmbz1IZShmbz1rdS5pc0Zpbml0ZSkmJmZvLGFvPV8ucGFyc2VJbnQsY289anUucmFuZG9tLGxvPWt1Lk5FR0FUSVZFX0lORklOSVRZLHNvPWt1LlBPU0lUSVZFX0lORklOSVRZLHBvPWp1LnBvdygyLDMyKS0xLGhvPXBvLTEsX289cG8+Pj4xLGdvPVF1P1F1LkJZVEVTX1BFUl9FTEVNRU5UOjAsdm89anUucG93KDIsNTMpLTEseW89SHUmJm5ldyBIdSxtbz1XdC5zdXBwb3J0PXt9OyFmdW5jdGlvbihuKXttby5mdW5jRGVjb21wPSFIZShfLldpblJURXJyb3IpJiZrdC50ZXN0KG0pLG1vLmZ1bmNOYW1lcz10eXBlb2YgQXUubmFtZT09XCJzdHJpbmdcIjt0cnl7bW8uZG9tPTExPT09U3UuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLm5vZGVUeXBlXG59Y2F0Y2godCl7bW8uZG9tPWZhbHNlfXRyeXttby5ub25FbnVtQXJncz0hWXUuY2FsbChhcmd1bWVudHMsMSl9Y2F0Y2gocil7bW8ubm9uRW51bUFyZ3M9dHJ1ZX19KDAsMCksV3QudGVtcGxhdGVTZXR0aW5ncz17ZXNjYXBlOmh0LGV2YWx1YXRlOl90LGludGVycG9sYXRlOmd0LHZhcmlhYmxlOlwiXCIsaW1wb3J0czp7XzpXdH19O3ZhciB3bz1mdW5jdGlvbigpe2Z1bmN0aW9uIG4oKXt9cmV0dXJuIGZ1bmN0aW9uKHQpe2lmKFhlKHQpKXtuLnByb3RvdHlwZT10O3ZhciByPW5ldyBuO24ucHJvdG90eXBlPW51bGx9cmV0dXJuIHJ8fF8uT2JqZWN0KCl9fSgpLGJvPXlvP2Z1bmN0aW9uKG4sdCl7cmV0dXJuIHlvLnNldChuLHQpLG59OnZ1O0R1fHwoVXI9enUmJlh1P2Z1bmN0aW9uKG4pe3ZhciB0PW4uYnl0ZUxlbmd0aCxyPVF1P1B1KHQvZ28pOjAsZT1yKmdvLHU9bmV3IHp1KHQpO2lmKHIpe3ZhciBvPW5ldyBRdSh1LDAscik7by5zZXQobmV3IFF1KG4sMCxyKSl9cmV0dXJuIHQhPWUmJihvPW5ldyBYdSh1LGUpLG8uc2V0KG5ldyBYdShuLGUpKSksdVxufTpndShudWxsKSk7dmFyIHhvPXRvJiZadT9mdW5jdGlvbihuKXtyZXR1cm4gbmV3IEx0KG4pfTpndShudWxsKSxBbz15bz9mdW5jdGlvbihuKXtyZXR1cm4geW8uZ2V0KG4pfTptdSxqbz1mdW5jdGlvbigpe3ZhciBuPTAsdD0wO3JldHVybiBmdW5jdGlvbihyLGUpe3ZhciB1PVRvKCksbz1OLSh1LXQpO2lmKHQ9dSwwPG8pe2lmKCsrbj49VylyZXR1cm4gcn1lbHNlIG49MDtyZXR1cm4gYm8ocixlKX19KCksa289JHIoZnVuY3Rpb24obix0LHIpe1V1LmNhbGwobixyKT8rK25bcl06bltyXT0xfSksRW89JHIoZnVuY3Rpb24obix0LHIpe1V1LmNhbGwobixyKT9uW3JdLnB1c2godCk6bltyXT1bdF19KSxSbz0kcihmdW5jdGlvbihuLHQscil7bltyXT10fSksSW89cXIoVnQpLE9vPXFyKGZ1bmN0aW9uKG4pe2Zvcih2YXIgdD0tMSxyPW4ubGVuZ3RoLGU9c287Kyt0PHI7KXt2YXIgdT1uW3RdO3U8ZSYmKGU9dSl9cmV0dXJuIGV9LHRydWUpLENvPSRyKGZ1bmN0aW9uKG4sdCxyKXtuW3I/MDoxXS5wdXNoKHQpXG59LGZ1bmN0aW9uKCl7cmV0dXJuW1tdLFtdXX0pLFRvPWlvfHxmdW5jdGlvbigpe3JldHVybihuZXcgYnUpLmdldFRpbWUoKX0sU289bm98fGZ1bmN0aW9uKG4pe3JldHVybiBoKG4pJiZvZShuLmxlbmd0aCkmJkx1LmNhbGwobik9PUR8fGZhbHNlfTttby5kb218fChaZT1mdW5jdGlvbihuKXtyZXR1cm4gbiYmMT09PW4ubm9kZVR5cGUmJmgobikmJiFObyhuKXx8ZmFsc2V9KTt2YXIgV289Zm98fGZ1bmN0aW9uKG4pe3JldHVybiB0eXBlb2Ygbj09XCJudW1iZXJcIiYmcm8obil9OyhKZSgveC8pfHxYdSYmIUplKFh1KSkmJihKZT1mdW5jdGlvbihuKXtyZXR1cm4gTHUuY2FsbChuKT09S30pO3ZhciBObz1LdT9mdW5jdGlvbihuKXtpZighbnx8THUuY2FsbChuKSE9WSlyZXR1cm4gZmFsc2U7dmFyIHQ9bi52YWx1ZU9mLHI9SGUodCkmJihyPUt1KHQpKSYmS3Uocik7cmV0dXJuIHI/bj09cnx8S3Uobik9PXI6Y2Uobil9OmNlLFVvPUJyKEh0KSxGbz1lbz9mdW5jdGlvbihuKXtpZihuKXZhciB0PW4uY29uc3RydWN0b3Iscj1uLmxlbmd0aDtcbnJldHVybiB0eXBlb2YgdD09XCJmdW5jdGlvblwiJiZ0LnByb3RvdHlwZT09PW58fHR5cGVvZiBuIT1cImZ1bmN0aW9uXCImJnImJm9lKHIpP2xlKG4pOlhlKG4pP2VvKG4pOltdfTpsZSxMbz1CcihBciksJG89RHIoZnVuY3Rpb24obix0LHIpe3JldHVybiB0PXQudG9Mb3dlckNhc2UoKSxuKyhyP3QuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrdC5zbGljZSgxKTp0KX0pLEJvPURyKGZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4gbisocj9cIi1cIjpcIlwiKSt0LnRvTG93ZXJDYXNlKCl9KTs4IT1hbyhJdCtcIjA4XCIpJiYoY3U9ZnVuY3Rpb24obix0LHIpe3JldHVybihyP3VlKG4sdCxyKTpudWxsPT10KT90PTA6dCYmKHQ9K3QpLG49c3UobiksYW8obix0fHwobXQudGVzdChuKT8xNjoxMCkpfSk7dmFyIHpvPURyKGZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4gbisocj9cIl9cIjpcIlwiKSt0LnRvTG93ZXJDYXNlKCl9KSxEbz1EcihmdW5jdGlvbihuLHQscil7cmV0dXJuIG4rKHI/XCIgXCI6XCJcIikrKHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrdC5zbGljZSgxKSlcbn0pO3JldHVybiBOdC5wcm90b3R5cGU9d28oV3QucHJvdG90eXBlKSxVdC5wcm90b3R5cGU9d28oTnQucHJvdG90eXBlKSxVdC5wcm90b3R5cGUuY29uc3RydWN0b3I9VXQsRnQucHJvdG90eXBlW1wiZGVsZXRlXCJdPWZ1bmN0aW9uKG4pe3JldHVybiB0aGlzLmhhcyhuKSYmZGVsZXRlIHRoaXMuX19kYXRhX19bbl19LEZ0LnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24obil7cmV0dXJuXCJfX3Byb3RvX19cIj09bj93OnRoaXMuX19kYXRhX19bbl19LEZ0LnByb3RvdHlwZS5oYXM9ZnVuY3Rpb24obil7cmV0dXJuXCJfX3Byb3RvX19cIiE9biYmVXUuY2FsbCh0aGlzLl9fZGF0YV9fLG4pfSxGdC5wcm90b3R5cGUuc2V0PWZ1bmN0aW9uKG4sdCl7cmV0dXJuXCJfX3Byb3RvX19cIiE9biYmKHRoaXMuX19kYXRhX19bbl09dCksdGhpc30sTHQucHJvdG90eXBlLnB1c2g9ZnVuY3Rpb24obil7dmFyIHQ9dGhpcy5kYXRhO3R5cGVvZiBuPT1cInN0cmluZ1wifHxYZShuKT90LnNldC5hZGQobik6dC5oYXNoW25dPXRydWVcbn0sUGUuQ2FjaGU9RnQsV3QuYWZ0ZXI9ZnVuY3Rpb24obix0KXtpZih0eXBlb2YgdCE9XCJmdW5jdGlvblwiKXtpZih0eXBlb2YgbiE9XCJmdW5jdGlvblwiKXRocm93IG5ldyBPdSgkKTt2YXIgcj1uO249dCx0PXJ9cmV0dXJuIG49cm8obj0rbik/bjowLGZ1bmN0aW9uKCl7cmV0dXJuIDE+LS1uP3QuYXBwbHkodGhpcyxhcmd1bWVudHMpOnZvaWQgMH19LFd0LmFyeT1mdW5jdGlvbihuLHQscil7cmV0dXJuIHImJnVlKG4sdCxyKSYmKHQ9bnVsbCksdD1uJiZudWxsPT10P24ubGVuZ3RoOnVvKCt0fHwwLDApLFlyKG4sQyxudWxsLG51bGwsbnVsbCxudWxsLHQpfSxXdC5hc3NpZ249VW8sV3QuYXQ9ZnVuY3Rpb24obil7cmV0dXJuIG9lKG4/bi5sZW5ndGg6MCkmJihuPXNlKG4pKSxRdChuLGxyKGFyZ3VtZW50cyxmYWxzZSxmYWxzZSwxKSl9LFd0LmJlZm9yZT1MZSxXdC5iaW5kPSRlLFd0LmJpbmRBbGw9ZnVuY3Rpb24obil7Zm9yKHZhciB0PW4scj0xPGFyZ3VtZW50cy5sZW5ndGg/bHIoYXJndW1lbnRzLGZhbHNlLGZhbHNlLDEpOnV1KG4pLGU9LTEsdT1yLmxlbmd0aDsrK2U8dTspe3ZhciBvPXJbZV07XG50W29dPVlyKHRbb10seCx0KX1yZXR1cm4gdH0sV3QuYmluZEtleT1CZSxXdC5jYWxsYmFjaz1fdSxXdC5jaGFpbj1BZSxXdC5jaHVuaz1mdW5jdGlvbihuLHQscil7dD0ocj91ZShuLHQscik6bnVsbD09dCk/MTp1bygrdHx8MSwxKSxyPTA7Zm9yKHZhciBlPW4/bi5sZW5ndGg6MCx1PS0xLG89d3UoTXUoZS90KSk7cjxlOylvWysrdV09UnIobixyLHIrPXQpO3JldHVybiBvfSxXdC5jb21wYWN0PWZ1bmN0aW9uKG4pe2Zvcih2YXIgdD0tMSxyPW4/bi5sZW5ndGg6MCxlPS0xLHU9W107Kyt0PHI7KXt2YXIgbz1uW3RdO28mJih1WysrZV09byl9cmV0dXJuIHV9LFd0LmNvbnN0YW50PWd1LFd0LmNvdW50Qnk9a28sV3QuY3JlYXRlPWZ1bmN0aW9uKG4sdCxyKXt2YXIgZT13byhuKTtyZXR1cm4gciYmdWUobix0LHIpJiYodD1udWxsKSx0P25yKHQsZSxGbyh0KSk6ZX0sV3QuY3Vycnk9emUsV3QuY3VycnlSaWdodD1EZSxXdC5kZWJvdW5jZT1NZSxXdC5kZWZhdWx0cz1mdW5jdGlvbihuKXtpZihudWxsPT1uKXJldHVybiBuO1xudmFyIHQ9enQoYXJndW1lbnRzKTtyZXR1cm4gdC5wdXNoKEp0KSxVby5hcHBseSh3LHQpfSxXdC5kZWZlcj1mdW5jdGlvbihuKXtyZXR1cm4gZXIobiwxLGFyZ3VtZW50cywxKX0sV3QuZGVsYXk9ZnVuY3Rpb24obix0KXtyZXR1cm4gZXIobix0LGFyZ3VtZW50cywyKX0sV3QuZGlmZmVyZW5jZT1mdW5jdGlvbigpe2Zvcih2YXIgbj0tMSx0PWFyZ3VtZW50cy5sZW5ndGg7KytuPHQ7KXt2YXIgcj1hcmd1bWVudHNbbl07aWYoU28ocil8fFllKHIpKWJyZWFrfXJldHVybiB1cihyLGxyKGFyZ3VtZW50cyxmYWxzZSx0cnVlLCsrbikpfSxXdC5kcm9wPV9lLFd0LmRyb3BSaWdodD1nZSxXdC5kcm9wUmlnaHRXaGlsZT1mdW5jdGlvbihuLHQscil7dmFyIGU9bj9uLmxlbmd0aDowO2lmKCFlKXJldHVybltdO2Zvcih0PUhyKHQsciwzKTtlLS0mJnQobltlXSxlLG4pOyk7cmV0dXJuIFJyKG4sMCxlKzEpfSxXdC5kcm9wV2hpbGU9ZnVuY3Rpb24obix0LHIpe3ZhciBlPW4/bi5sZW5ndGg6MDtpZighZSlyZXR1cm5bXTtcbnZhciB1PS0xO2Zvcih0PUhyKHQsciwzKTsrK3U8ZSYmdChuW3VdLHUsbik7KTtyZXR1cm4gUnIobix1KX0sV3QuZmlsbD1mdW5jdGlvbihuLHQscixlKXt2YXIgdT1uP24ubGVuZ3RoOjA7aWYoIXUpcmV0dXJuW107Zm9yKHImJnR5cGVvZiByIT1cIm51bWJlclwiJiZ1ZShuLHQscikmJihyPTAsZT11KSx1PW4ubGVuZ3RoLHI9bnVsbD09cj8wOityfHwwLDA+ciYmKHI9LXI+dT8wOnUrciksZT10eXBlb2YgZT09XCJ1bmRlZmluZWRcInx8ZT51P3U6K2V8fDAsMD5lJiYoZSs9dSksdT1yPmU/MDplPj4+MCxyPj4+PTA7cjx1OyluW3IrK109dDtyZXR1cm4gbn0sV3QuZmlsdGVyPVJlLFd0LmZsYXR0ZW49ZnVuY3Rpb24obix0LHIpe3ZhciBlPW4/bi5sZW5ndGg6MDtyZXR1cm4gciYmdWUobix0LHIpJiYodD1mYWxzZSksZT9scihuLHQpOltdfSxXdC5mbGF0dGVuRGVlcD1mdW5jdGlvbihuKXtyZXR1cm4gbiYmbi5sZW5ndGg/bHIobix0cnVlKTpbXX0sV3QuZmxvdz1mdW5jdGlvbigpe3ZhciBuPWFyZ3VtZW50cyx0PW4ubGVuZ3RoO1xuaWYoIXQpcmV0dXJuIGZ1bmN0aW9uKG4pe3JldHVybiBufTtpZighcXQobixKZSkpdGhyb3cgbmV3IE91KCQpO3JldHVybiBmdW5jdGlvbigpe2Zvcih2YXIgcj0wLGU9bltyXS5hcHBseSh0aGlzLGFyZ3VtZW50cyk7KytyPHQ7KWU9bltyXS5jYWxsKHRoaXMsZSk7cmV0dXJuIGV9fSxXdC5mbG93UmlnaHQ9cWUsV3QuZm9yRWFjaD1PZSxXdC5mb3JFYWNoUmlnaHQ9Q2UsV3QuZm9ySW49ZnVuY3Rpb24obix0LHIpe3JldHVybih0eXBlb2YgdCE9XCJmdW5jdGlvblwifHx0eXBlb2YgciE9XCJ1bmRlZmluZWRcIikmJih0PU5yKHQsciwzKSksc3Iobix0LG91KX0sV3QuZm9ySW5SaWdodD1mdW5jdGlvbihuLHQscil7cmV0dXJuIHQ9TnIodCxyLDMpLHByKG4sdCxvdSl9LFd0LmZvck93bj1mdW5jdGlvbihuLHQscil7cmV0dXJuKHR5cGVvZiB0IT1cImZ1bmN0aW9uXCJ8fHR5cGVvZiByIT1cInVuZGVmaW5lZFwiKSYmKHQ9TnIodCxyLDMpKSxfcihuLHQpfSxXdC5mb3JPd25SaWdodD1mdW5jdGlvbihuLHQscil7cmV0dXJuIHQ9TnIodCxyLDMpLHByKG4sdCxGbylcbn0sV3QuZnVuY3Rpb25zPXV1LFd0Lmdyb3VwQnk9RW8sV3QuaW5kZXhCeT1SbyxXdC5pbml0aWFsPWZ1bmN0aW9uKG4pe3JldHVybiBnZShuLDEpfSxXdC5pbnRlcnNlY3Rpb249ZnVuY3Rpb24oKXtmb3IodmFyIG49W10scj0tMSxlPWFyZ3VtZW50cy5sZW5ndGgsdT1bXSxvPVFyKCksaT1vPT10OysrcjxlOyl7dmFyIGY9YXJndW1lbnRzW3JdOyhTbyhmKXx8WWUoZikpJiYobi5wdXNoKGYpLHUucHVzaChpJiYxMjA8PWYubGVuZ3RoJiZ4byhyJiZmKSkpfXZhciBlPW4ubGVuZ3RoLGk9blswXSxhPS0xLGM9aT9pLmxlbmd0aDowLGw9W10scz11WzBdO246Zm9yKDsrK2E8YzspaWYoZj1pW2FdLDA+KHM/QnQocyxmKTpvKGwsZikpKXtmb3Iocj1lOy0tcjspe3ZhciBwPXVbcl07aWYoMD4ocD9CdChwLGYpOm8obltyXSxmKSkpY29udGludWUgbn1zJiZzLnB1c2goZiksbC5wdXNoKGYpfXJldHVybiBsfSxXdC5pbnZlcnQ9ZnVuY3Rpb24obix0LHIpe3ImJnVlKG4sdCxyKSYmKHQ9bnVsbCkscj0tMTtcbmZvcih2YXIgZT1GbyhuKSx1PWUubGVuZ3RoLG89e307KytyPHU7KXt2YXIgaT1lW3JdLGY9bltpXTt0P1V1LmNhbGwobyxmKT9vW2ZdLnB1c2goaSk6b1tmXT1baV06b1tmXT1pfXJldHVybiBvfSxXdC5pbnZva2U9ZnVuY3Rpb24obix0KXtyZXR1cm4geXIobix0LFJyKGFyZ3VtZW50cywyKSl9LFd0LmtleXM9Rm8sV3Qua2V5c0luPW91LFd0Lm1hcD1UZSxXdC5tYXBWYWx1ZXM9ZnVuY3Rpb24obix0LHIpe3ZhciBlPXt9O3JldHVybiB0PUhyKHQsciwzKSxfcihuLGZ1bmN0aW9uKG4scix1KXtlW3JdPXQobixyLHUpfSksZX0sV3QubWF0Y2hlcz15dSxXdC5tYXRjaGVzUHJvcGVydHk9ZnVuY3Rpb24obix0KXtyZXR1cm4geHIobitcIlwiLHJyKHQsdHJ1ZSkpfSxXdC5tZW1vaXplPVBlLFd0Lm1lcmdlPUxvLFd0Lm1peGluPWR1LFd0Lm5lZ2F0ZT1mdW5jdGlvbihuKXtpZih0eXBlb2YgbiE9XCJmdW5jdGlvblwiKXRocm93IG5ldyBPdSgkKTtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4hbi5hcHBseSh0aGlzLGFyZ3VtZW50cylcbn19LFd0Lm9taXQ9ZnVuY3Rpb24obix0LHIpe2lmKG51bGw9PW4pcmV0dXJue307aWYodHlwZW9mIHQhPVwiZnVuY3Rpb25cIil7dmFyIGU9S3QobHIoYXJndW1lbnRzLGZhbHNlLGZhbHNlLDEpLEl1KTtyZXR1cm4gZmUobix1cihvdShuKSxlKSl9cmV0dXJuIHQ9TnIodCxyLDMpLGFlKG4sZnVuY3Rpb24obixyLGUpe3JldHVybiF0KG4scixlKX0pfSxXdC5vbmNlPWZ1bmN0aW9uKG4pe3JldHVybiBMZShuLDIpfSxXdC5wYWlycz1mdW5jdGlvbihuKXtmb3IodmFyIHQ9LTEscj1GbyhuKSxlPXIubGVuZ3RoLHU9d3UoZSk7Kyt0PGU7KXt2YXIgbz1yW3RdO3VbdF09W28sbltvXV19cmV0dXJuIHV9LFd0LnBhcnRpYWw9S2UsV3QucGFydGlhbFJpZ2h0PVZlLFd0LnBhcnRpdGlvbj1DbyxXdC5waWNrPWZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4gbnVsbD09bj97fTp0eXBlb2YgdD09XCJmdW5jdGlvblwiP2FlKG4sTnIodCxyLDMpKTpmZShuLGxyKGFyZ3VtZW50cyxmYWxzZSxmYWxzZSwxKSl9LFd0LnBsdWNrPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIFRlKG4sanIodCkpXG59LFd0LnByb3BlcnR5PWZ1bmN0aW9uKG4pe3JldHVybiBqcihuK1wiXCIpfSxXdC5wcm9wZXJ0eU9mPWZ1bmN0aW9uKG4pe3JldHVybiBmdW5jdGlvbih0KXtyZXR1cm4gbnVsbD09bj93Om5bdF19fSxXdC5wdWxsPWZ1bmN0aW9uKCl7dmFyIG49YXJndW1lbnRzWzBdO2lmKCFufHwhbi5sZW5ndGgpcmV0dXJuIG47Zm9yKHZhciB0PTAscj1RcigpLGU9YXJndW1lbnRzLmxlbmd0aDsrK3Q8ZTspZm9yKHZhciB1PTAsbz1hcmd1bWVudHNbdF07LTE8KHU9cihuLG8sdSkpOylKdS5jYWxsKG4sdSwxKTtyZXR1cm4gbn0sV3QucHVsbEF0PWZ1bmN0aW9uKHQpe3ZhciByPXR8fFtdLGU9bHIoYXJndW1lbnRzLGZhbHNlLGZhbHNlLDEpLHU9ZS5sZW5ndGgsbz1RdChyLGUpO2ZvcihlLnNvcnQobik7dS0tOyl7dmFyIGk9cGFyc2VGbG9hdChlW3VdKTtpZihpIT1mJiZlZShpKSl7dmFyIGY9aTtKdS5jYWxsKHIsaSwxKX19cmV0dXJuIG99LFd0LnJhbmdlPWZ1bmN0aW9uKG4sdCxyKXtyJiZ1ZShuLHQscikmJih0PXI9bnVsbCksbj0rbnx8MCxyPW51bGw9PXI/MTorcnx8MCxudWxsPT10Pyh0PW4sbj0wKTp0PSt0fHwwO1xudmFyIGU9LTE7dD11byhNdSgodC1uKS8ocnx8MSkpLDApO2Zvcih2YXIgdT13dSh0KTsrK2U8dDspdVtlXT1uLG4rPXI7cmV0dXJuIHV9LFd0LnJlYXJnPWZ1bmN0aW9uKG4pe3ZhciB0PWxyKGFyZ3VtZW50cyxmYWxzZSxmYWxzZSwxKTtyZXR1cm4gWXIobixPLG51bGwsbnVsbCxudWxsLHQpfSxXdC5yZWplY3Q9ZnVuY3Rpb24obix0LHIpe3ZhciBlPVNvKG4pP1B0OmFyO3JldHVybiB0PUhyKHQsciwzKSxlKG4sZnVuY3Rpb24obixyLGUpe3JldHVybiF0KG4scixlKX0pfSxXdC5yZW1vdmU9ZnVuY3Rpb24obix0LHIpe3ZhciBlPS0xLHU9bj9uLmxlbmd0aDowLG89W107Zm9yKHQ9SHIodCxyLDMpOysrZTx1OylyPW5bZV0sdChyLGUsbikmJihvLnB1c2gociksSnUuY2FsbChuLGUtLSwxKSx1LS0pO3JldHVybiBvfSxXdC5yZXN0PW1lLFd0LnNodWZmbGU9VWUsV3Quc2xpY2U9ZnVuY3Rpb24obix0LHIpe3ZhciBlPW4/bi5sZW5ndGg6MDtyZXR1cm4gZT8ociYmdHlwZW9mIHIhPVwibnVtYmVyXCImJnVlKG4sdCxyKSYmKHQ9MCxyPWUpLFJyKG4sdCxyKSk6W11cbn0sV3Quc29ydEJ5PWZ1bmN0aW9uKG4sdCxlKXt2YXIgdT0tMSxvPW4/bi5sZW5ndGg6MCxpPW9lKG8pP3d1KG8pOltdO3JldHVybiBlJiZ1ZShuLHQsZSkmJih0PW51bGwpLHQ9SHIodCxlLDMpLG9yKG4sZnVuY3Rpb24obixyLGUpe2lbKyt1XT17YTp0KG4scixlKSxiOnUsYzpufX0pLHIoaSxmKX0sV3Quc29ydEJ5QWxsPWZ1bmN0aW9uKG4pe3ZhciB0PWFyZ3VtZW50czszPHQubGVuZ3RoJiZ1ZSh0WzFdLHRbMl0sdFszXSkmJih0PVtuLHRbMV1dKTt2YXIgZT0tMSx1PW4/bi5sZW5ndGg6MCxvPWxyKHQsZmFsc2UsZmFsc2UsMSksaT1vZSh1KT93dSh1KTpbXTtyZXR1cm4gb3IobixmdW5jdGlvbihuKXtmb3IodmFyIHQ9by5sZW5ndGgscj13dSh0KTt0LS07KXJbdF09bnVsbD09bj93Om5bb1t0XV07aVsrK2VdPXthOnIsYjplLGM6bn19KSxyKGksYSl9LFd0LnNwcmVhZD1mdW5jdGlvbihuKXtpZih0eXBlb2YgbiE9XCJmdW5jdGlvblwiKXRocm93IG5ldyBPdSgkKTtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIG4uYXBwbHkodGhpcyx0KVxufX0sV3QudGFrZT1mdW5jdGlvbihuLHQscil7cmV0dXJuIG4mJm4ubGVuZ3RoPygocj91ZShuLHQscik6bnVsbD09dCkmJih0PTEpLFJyKG4sMCwwPnQ/MDp0KSk6W119LFd0LnRha2VSaWdodD1mdW5jdGlvbihuLHQscil7dmFyIGU9bj9uLmxlbmd0aDowO3JldHVybiBlPygocj91ZShuLHQscik6bnVsbD09dCkmJih0PTEpLHQ9ZS0oK3R8fDApLFJyKG4sMD50PzA6dCkpOltdfSxXdC50YWtlUmlnaHRXaGlsZT1mdW5jdGlvbihuLHQscil7dmFyIGU9bj9uLmxlbmd0aDowO2lmKCFlKXJldHVybltdO2Zvcih0PUhyKHQsciwzKTtlLS0mJnQobltlXSxlLG4pOyk7cmV0dXJuIFJyKG4sZSsxKX0sV3QudGFrZVdoaWxlPWZ1bmN0aW9uKG4sdCxyKXt2YXIgZT1uP24ubGVuZ3RoOjA7aWYoIWUpcmV0dXJuW107dmFyIHU9LTE7Zm9yKHQ9SHIodCxyLDMpOysrdTxlJiZ0KG5bdV0sdSxuKTspO3JldHVybiBScihuLDAsdSl9LFd0LnRhcD1mdW5jdGlvbihuLHQscil7cmV0dXJuIHQuY2FsbChyLG4pLG5cbn0sV3QudGhyb3R0bGU9ZnVuY3Rpb24obix0LHIpe3ZhciBlPXRydWUsdT10cnVlO2lmKHR5cGVvZiBuIT1cImZ1bmN0aW9uXCIpdGhyb3cgbmV3IE91KCQpO3JldHVybiBmYWxzZT09PXI/ZT1mYWxzZTpYZShyKSYmKGU9XCJsZWFkaW5nXCJpbiByPyEhci5sZWFkaW5nOmUsdT1cInRyYWlsaW5nXCJpbiByPyEhci50cmFpbGluZzp1KSxTdC5sZWFkaW5nPWUsU3QubWF4V2FpdD0rdCxTdC50cmFpbGluZz11LE1lKG4sdCxTdCl9LFd0LnRocnU9amUsV3QudGltZXM9ZnVuY3Rpb24obix0LHIpe2lmKG49K24sMT5ufHwhcm8obikpcmV0dXJuW107dmFyIGU9LTEsdT13dShvbyhuLHBvKSk7Zm9yKHQ9TnIodCxyLDEpOysrZTxuOyllPHBvP3VbZV09dChlKTp0KGUpO3JldHVybiB1fSxXdC50b0FycmF5PWZ1bmN0aW9uKG4pe3ZhciB0PW4/bi5sZW5ndGg6MDtyZXR1cm4gb2UodCk/dD96dChuKTpbXTppdShuKX0sV3QudG9QbGFpbk9iamVjdD1ldSxXdC50cmFuc2Zvcm09ZnVuY3Rpb24obix0LHIsZSl7dmFyIHU9U28obil8fHJ1KG4pO1xucmV0dXJuIHQ9SHIodCxlLDQpLG51bGw9PXImJih1fHxYZShuKT8oZT1uLmNvbnN0cnVjdG9yLHI9dT9TbyhuKT9uZXcgZTpbXTp3byhKZShlKSYmZS5wcm90b3R5cGUpKTpyPXt9KSwodT9NdDpfcikobixmdW5jdGlvbihuLGUsdSl7cmV0dXJuIHQocixuLGUsdSl9KSxyfSxXdC51bmlvbj1mdW5jdGlvbigpe3JldHVybiBPcihscihhcmd1bWVudHMsZmFsc2UsdHJ1ZSkpfSxXdC51bmlxPXdlLFd0LnVuemlwPWJlLFd0LnZhbHVlcz1pdSxXdC52YWx1ZXNJbj1mdW5jdGlvbihuKXtyZXR1cm4gQ3IobixvdShuKSl9LFd0LndoZXJlPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIFJlKG4sYnIodCkpfSxXdC53aXRob3V0PWZ1bmN0aW9uKG4pe3JldHVybiB1cihuLFJyKGFyZ3VtZW50cywxKSl9LFd0LndyYXA9ZnVuY3Rpb24obix0KXtyZXR1cm4gdD1udWxsPT10P3Z1OnQsWXIodCxSLG51bGwsW25dLFtdKX0sV3QueG9yPWZ1bmN0aW9uKCl7Zm9yKHZhciBuPS0xLHQ9YXJndW1lbnRzLmxlbmd0aDsrK248dDspe3ZhciByPWFyZ3VtZW50c1tuXTtcbmlmKFNvKHIpfHxZZShyKSl2YXIgZT1lP3VyKGUscikuY29uY2F0KHVyKHIsZSkpOnJ9cmV0dXJuIGU/T3IoZSk6W119LFd0LnppcD1mdW5jdGlvbigpe2Zvcih2YXIgbj1hcmd1bWVudHMubGVuZ3RoLHQ9d3Uobik7bi0tOyl0W25dPWFyZ3VtZW50c1tuXTtyZXR1cm4gYmUodCl9LFd0LnppcE9iamVjdD14ZSxXdC5iYWNrZmxvdz1xZSxXdC5jb2xsZWN0PVRlLFd0LmNvbXBvc2U9cWUsV3QuZWFjaD1PZSxXdC5lYWNoUmlnaHQ9Q2UsV3QuZXh0ZW5kPVVvLFd0Lml0ZXJhdGVlPV91LFd0Lm1ldGhvZHM9dXUsV3Qub2JqZWN0PXhlLFd0LnNlbGVjdD1SZSxXdC50YWlsPW1lLFd0LnVuaXF1ZT13ZSxkdShXdCxXdCksV3QuYXR0ZW1wdD1odSxXdC5jYW1lbENhc2U9JG8sV3QuY2FwaXRhbGl6ZT1mdW5jdGlvbihuKXtyZXR1cm4obj1lKG4pKSYmbi5jaGFyQXQoMCkudG9VcHBlckNhc2UoKStuLnNsaWNlKDEpfSxXdC5jbG9uZT1mdW5jdGlvbihuLHQscixlKXtyZXR1cm4gdHlwZW9mIHQhPVwiYm9vbGVhblwiJiZudWxsIT10JiYoZT1yLHI9dWUobix0LGUpP251bGw6dCx0PWZhbHNlKSxyPXR5cGVvZiByPT1cImZ1bmN0aW9uXCImJk5yKHIsZSwxKSxycihuLHQscilcbn0sV3QuY2xvbmVEZWVwPWZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4gdD10eXBlb2YgdD09XCJmdW5jdGlvblwiJiZOcih0LHIsMSkscnIobix0cnVlLHQpfSxXdC5kZWJ1cnI9ZnUsV3QuZW5kc1dpdGg9ZnVuY3Rpb24obix0LHIpe249ZShuKSx0Kz1cIlwiO3ZhciB1PW4ubGVuZ3RoO3JldHVybiByPSh0eXBlb2Ygcj09XCJ1bmRlZmluZWRcIj91Om9vKDA+cj8wOityfHwwLHUpKS10Lmxlbmd0aCwwPD1yJiZuLmluZGV4T2YodCxyKT09cn0sV3QuZXNjYXBlPWZ1bmN0aW9uKG4pe3JldHVybihuPWUobikpJiZwdC50ZXN0KG4pP24ucmVwbGFjZShsdCxsKTpufSxXdC5lc2NhcGVSZWdFeHA9YXUsV3QuZXZlcnk9RWUsV3QuZmluZD1JZSxXdC5maW5kSW5kZXg9dmUsV3QuZmluZEtleT1mdW5jdGlvbihuLHQscil7cmV0dXJuIHQ9SHIodCxyLDMpLGNyKG4sdCxfcix0cnVlKX0sV3QuZmluZExhc3Q9ZnVuY3Rpb24obix0LHIpe3JldHVybiB0PUhyKHQsciwzKSxjcihuLHQsaXIpfSxXdC5maW5kTGFzdEluZGV4PWZ1bmN0aW9uKG4sdCxyKXt2YXIgZT1uP24ubGVuZ3RoOjA7XG5mb3IodD1Icih0LHIsMyk7ZS0tOylpZih0KG5bZV0sZSxuKSlyZXR1cm4gZTtyZXR1cm4tMX0sV3QuZmluZExhc3RLZXk9ZnVuY3Rpb24obix0LHIpe3JldHVybiB0PUhyKHQsciwzKSxjcihuLHQsZ3IsdHJ1ZSl9LFd0LmZpbmRXaGVyZT1mdW5jdGlvbihuLHQpe3JldHVybiBJZShuLGJyKHQpKX0sV3QuZmlyc3Q9eWUsV3QuaGFzPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG4/VXUuY2FsbChuLHQpOmZhbHNlfSxXdC5pZGVudGl0eT12dSxXdC5pbmNsdWRlcz1rZSxXdC5pbmRleE9mPWRlLFd0LmlzQXJndW1lbnRzPVllLFd0LmlzQXJyYXk9U28sV3QuaXNCb29sZWFuPWZ1bmN0aW9uKG4pe3JldHVybiB0cnVlPT09bnx8ZmFsc2U9PT1ufHxoKG4pJiZMdS5jYWxsKG4pPT1NfHxmYWxzZX0sV3QuaXNEYXRlPWZ1bmN0aW9uKG4pe3JldHVybiBoKG4pJiZMdS5jYWxsKG4pPT1xfHxmYWxzZX0sV3QuaXNFbGVtZW50PVplLFd0LmlzRW1wdHk9ZnVuY3Rpb24obil7aWYobnVsbD09bilyZXR1cm4gdHJ1ZTt2YXIgdD1uLmxlbmd0aDtcbnJldHVybiBvZSh0KSYmKFNvKG4pfHx0dShuKXx8WWUobil8fGgobikmJkplKG4uc3BsaWNlKSk/IXQ6IUZvKG4pLmxlbmd0aH0sV3QuaXNFcXVhbD1mdW5jdGlvbihuLHQscixlKXtyZXR1cm4gcj10eXBlb2Ygcj09XCJmdW5jdGlvblwiJiZOcihyLGUsMyksIXImJmllKG4pJiZpZSh0KT9uPT09dDooZT1yP3Iobix0KTp3LHR5cGVvZiBlPT1cInVuZGVmaW5lZFwiP2RyKG4sdCxyKTohIWUpfSxXdC5pc0Vycm9yPUdlLFd0LmlzRmluaXRlPVdvLFd0LmlzRnVuY3Rpb249SmUsV3QuaXNNYXRjaD1mdW5jdGlvbihuLHQscixlKXt2YXIgdT1Gbyh0KSxvPXUubGVuZ3RoO2lmKHI9dHlwZW9mIHI9PVwiZnVuY3Rpb25cIiYmTnIocixlLDMpLCFyJiYxPT1vKXt2YXIgaT11WzBdO2lmKGU9dFtpXSxpZShlKSlyZXR1cm4gbnVsbCE9biYmZT09PW5baV0mJlV1LmNhbGwobixpKX1mb3IodmFyIGk9d3UobyksZj13dShvKTtvLS07KWU9aVtvXT10W3Vbb11dLGZbb109aWUoZSk7cmV0dXJuIG1yKG4sdSxpLGYscilcbn0sV3QuaXNOYU49ZnVuY3Rpb24obil7cmV0dXJuIFFlKG4pJiZuIT0rbn0sV3QuaXNOYXRpdmU9SGUsV3QuaXNOdWxsPWZ1bmN0aW9uKG4pe3JldHVybiBudWxsPT09bn0sV3QuaXNOdW1iZXI9UWUsV3QuaXNPYmplY3Q9WGUsV3QuaXNQbGFpbk9iamVjdD1ObyxXdC5pc1JlZ0V4cD1udSxXdC5pc1N0cmluZz10dSxXdC5pc1R5cGVkQXJyYXk9cnUsV3QuaXNVbmRlZmluZWQ9ZnVuY3Rpb24obil7cmV0dXJuIHR5cGVvZiBuPT1cInVuZGVmaW5lZFwifSxXdC5rZWJhYkNhc2U9Qm8sV3QubGFzdD1mdW5jdGlvbihuKXt2YXIgdD1uP24ubGVuZ3RoOjA7cmV0dXJuIHQ/blt0LTFdOnd9LFd0Lmxhc3RJbmRleE9mPWZ1bmN0aW9uKG4sdCxyKXt2YXIgZT1uP24ubGVuZ3RoOjA7aWYoIWUpcmV0dXJuLTE7dmFyIHU9ZTtpZih0eXBlb2Ygcj09XCJudW1iZXJcIil1PSgwPnI/dW8oZStyLDApOm9vKHJ8fDAsZS0xKSkrMTtlbHNlIGlmKHIpcmV0dXJuIHU9U3Iobix0LHRydWUpLTEsbj1uW3VdLCh0PT09dD90PT09bjpuIT09bik/dTotMTtcbmlmKHQhPT10KXJldHVybiBwKG4sdSx0cnVlKTtmb3IoO3UtLTspaWYoblt1XT09PXQpcmV0dXJuIHU7cmV0dXJuLTF9LFd0Lm1heD1JbyxXdC5taW49T28sV3Qubm9Db25mbGljdD1mdW5jdGlvbigpe3JldHVybiBfLl89JHUsdGhpc30sV3Qubm9vcD1tdSxXdC5ub3c9VG8sV3QucGFkPWZ1bmN0aW9uKG4sdCxyKXtuPWUobiksdD0rdDt2YXIgdT1uLmxlbmd0aDtyZXR1cm4gdTx0JiZybyh0KT8odT0odC11KS8yLHQ9UHUodSksdT1NdSh1KSxyPUtyKFwiXCIsdSxyKSxyLnNsaWNlKDAsdCkrbityKTpufSxXdC5wYWRMZWZ0PWZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4obj1lKG4pKSYmS3Iobix0LHIpK259LFd0LnBhZFJpZ2h0PWZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4obj1lKG4pKSYmbitLcihuLHQscil9LFd0LnBhcnNlSW50PWN1LFd0LnJhbmRvbT1mdW5jdGlvbihuLHQscil7ciYmdWUobix0LHIpJiYodD1yPW51bGwpO3ZhciBlPW51bGw9PW4sdT1udWxsPT10O3JldHVybiBudWxsPT1yJiYodSYmdHlwZW9mIG49PVwiYm9vbGVhblwiPyhyPW4sbj0xKTp0eXBlb2YgdD09XCJib29sZWFuXCImJihyPXQsdT10cnVlKSksZSYmdSYmKHQ9MSx1PWZhbHNlKSxuPStufHwwLHU/KHQ9bixuPTApOnQ9K3R8fDAscnx8biUxfHx0JTE/KHI9Y28oKSxvbyhuK3IqKHQtbitwYXJzZUZsb2F0KFwiMWUtXCIrKChyK1wiXCIpLmxlbmd0aC0xKSkpLHQpKTprcihuLHQpXG59LFd0LnJlZHVjZT1TZSxXdC5yZWR1Y2VSaWdodD1XZSxXdC5yZXBlYXQ9bHUsV3QucmVzdWx0PWZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4gdD1udWxsPT1uP3c6blt0XSx0eXBlb2YgdD09XCJ1bmRlZmluZWRcIiYmKHQ9ciksSmUodCk/dC5jYWxsKG4pOnR9LFd0LnJ1bkluQ29udGV4dD1tLFd0LnNpemU9ZnVuY3Rpb24obil7dmFyIHQ9bj9uLmxlbmd0aDowO3JldHVybiBvZSh0KT90OkZvKG4pLmxlbmd0aH0sV3Quc25ha2VDYXNlPXpvLFd0LnNvbWU9RmUsV3Quc29ydGVkSW5kZXg9ZnVuY3Rpb24obix0LHIsZSl7dmFyIHU9SHIocik7cmV0dXJuIHU9PT10ciYmbnVsbD09cj9TcihuLHQpOldyKG4sdCx1KHIsZSwxKSl9LFd0LnNvcnRlZExhc3RJbmRleD1mdW5jdGlvbihuLHQscixlKXt2YXIgdT1IcihyKTtyZXR1cm4gdT09PXRyJiZudWxsPT1yP1NyKG4sdCx0cnVlKTpXcihuLHQsdShyLGUsMSksdHJ1ZSl9LFd0LnN0YXJ0Q2FzZT1EbyxXdC5zdGFydHNXaXRoPWZ1bmN0aW9uKG4sdCxyKXtyZXR1cm4gbj1lKG4pLHI9bnVsbD09cj8wOm9vKDA+cj8wOityfHwwLG4ubGVuZ3RoKSxuLmxhc3RJbmRleE9mKHQscik9PXJcbn0sV3QudGVtcGxhdGU9ZnVuY3Rpb24obix0LHIpe3ZhciB1PVd0LnRlbXBsYXRlU2V0dGluZ3M7ciYmdWUobix0LHIpJiYodD1yPW51bGwpLG49ZShuKSx0PUh0KEh0KHt9LHJ8fHQpLHUsWHQpLHI9SHQoSHQoe30sdC5pbXBvcnRzKSx1LmltcG9ydHMsWHQpO3ZhciBvLGksZj1GbyhyKSxhPUNyKHIsZiksYz0wO3I9dC5pbnRlcnBvbGF0ZXx8eHQ7dmFyIGw9XCJfX3ArPSdcIjtyPVJ1KCh0LmVzY2FwZXx8eHQpLnNvdXJjZStcInxcIityLnNvdXJjZStcInxcIisocj09PWd0P3Z0Onh0KS5zb3VyY2UrXCJ8XCIrKHQuZXZhbHVhdGV8fHh0KS5zb3VyY2UrXCJ8JFwiLFwiZ1wiKTt2YXIgcD1cInNvdXJjZVVSTFwiaW4gdD9cIi8vIyBzb3VyY2VVUkw9XCIrdC5zb3VyY2VVUkwrXCJcXG5cIjpcIlwiO2lmKG4ucmVwbGFjZShyLGZ1bmN0aW9uKHQscixlLHUsZixhKXtyZXR1cm4gZXx8KGU9dSksbCs9bi5zbGljZShjLGEpLnJlcGxhY2UoRXQscyksciYmKG89dHJ1ZSxsKz1cIicrX19lKFwiK3IrXCIpKydcIiksZiYmKGk9dHJ1ZSxsKz1cIic7XCIrZitcIjtcXG5fX3ArPSdcIiksZSYmKGwrPVwiJysoKF9fdD0oXCIrZStcIikpPT1udWxsPycnOl9fdCkrJ1wiKSxjPWErdC5sZW5ndGgsdFxufSksbCs9XCInO1wiLCh0PXQudmFyaWFibGUpfHwobD1cIndpdGgob2JqKXtcIitsK1wifVwiKSxsPShpP2wucmVwbGFjZShpdCxcIlwiKTpsKS5yZXBsYWNlKGZ0LFwiJDFcIikucmVwbGFjZShhdCxcIiQxO1wiKSxsPVwiZnVuY3Rpb24oXCIrKHR8fFwib2JqXCIpK1wiKXtcIisodD9cIlwiOlwib2JqfHwob2JqPXt9KTtcIikrXCJ2YXIgX190LF9fcD0nJ1wiKyhvP1wiLF9fZT1fLmVzY2FwZVwiOlwiXCIpKyhpP1wiLF9faj1BcnJheS5wcm90b3R5cGUuam9pbjtmdW5jdGlvbiBwcmludCgpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKX1cIjpcIjtcIikrbCtcInJldHVybiBfX3B9XCIsdD1odShmdW5jdGlvbigpe3JldHVybiBBdShmLHArXCJyZXR1cm4gXCIrbCkuYXBwbHkodyxhKX0pLHQuc291cmNlPWwsR2UodCkpdGhyb3cgdDtyZXR1cm4gdH0sV3QudHJpbT1zdSxXdC50cmltTGVmdD1mdW5jdGlvbihuLHQscil7dmFyIHU9bjtyZXR1cm4obj1lKG4pKT9uLnNsaWNlKChyP3VlKHUsdCxyKTpudWxsPT10KT92KG4pOm8obix0K1wiXCIpKTpuXG59LFd0LnRyaW1SaWdodD1mdW5jdGlvbihuLHQscil7dmFyIHU9bjtyZXR1cm4obj1lKG4pKT8ocj91ZSh1LHQscik6bnVsbD09dCk/bi5zbGljZSgwLHkobikrMSk6bi5zbGljZSgwLGkobix0K1wiXCIpKzEpOm59LFd0LnRydW5jPWZ1bmN0aW9uKG4sdCxyKXtyJiZ1ZShuLHQscikmJih0PW51bGwpO3ZhciB1PVQ7aWYocj1TLG51bGwhPXQpaWYoWGUodCkpe3ZhciBvPVwic2VwYXJhdG9yXCJpbiB0P3Quc2VwYXJhdG9yOm8sdT1cImxlbmd0aFwiaW4gdD8rdC5sZW5ndGh8fDA6dTtyPVwib21pc3Npb25cImluIHQ/ZSh0Lm9taXNzaW9uKTpyfWVsc2UgdT0rdHx8MDtpZihuPWUobiksdT49bi5sZW5ndGgpcmV0dXJuIG47aWYodS09ci5sZW5ndGgsMT51KXJldHVybiByO2lmKHQ9bi5zbGljZSgwLHUpLG51bGw9PW8pcmV0dXJuIHQrcjtpZihudShvKSl7aWYobi5zbGljZSh1KS5zZWFyY2gobykpe3ZhciBpLGY9bi5zbGljZSgwLHUpO2ZvcihvLmdsb2JhbHx8KG89UnUoby5zb3VyY2UsKHl0LmV4ZWMobyl8fFwiXCIpK1wiZ1wiKSksby5sYXN0SW5kZXg9MDtuPW8uZXhlYyhmKTspaT1uLmluZGV4O1xudD10LnNsaWNlKDAsbnVsbD09aT91OmkpfX1lbHNlIG4uaW5kZXhPZihvLHUpIT11JiYobz10Lmxhc3RJbmRleE9mKG8pLC0xPG8mJih0PXQuc2xpY2UoMCxvKSkpO3JldHVybiB0K3J9LFd0LnVuZXNjYXBlPWZ1bmN0aW9uKG4pe3JldHVybihuPWUobikpJiZzdC50ZXN0KG4pP24ucmVwbGFjZShjdCxkKTpufSxXdC51bmlxdWVJZD1mdW5jdGlvbihuKXt2YXIgdD0rK0Z1O3JldHVybiBlKG4pK3R9LFd0LndvcmRzPXB1LFd0LmFsbD1FZSxXdC5hbnk9RmUsV3QuY29udGFpbnM9a2UsV3QuZGV0ZWN0PUllLFd0LmZvbGRsPVNlLFd0LmZvbGRyPVdlLFd0LmhlYWQ9eWUsV3QuaW5jbHVkZT1rZSxXdC5pbmplY3Q9U2UsZHUoV3QsZnVuY3Rpb24oKXt2YXIgbj17fTtyZXR1cm4gX3IoV3QsZnVuY3Rpb24odCxyKXtXdC5wcm90b3R5cGVbcl18fChuW3JdPXQpfSksbn0oKSxmYWxzZSksV3Quc2FtcGxlPU5lLFd0LnByb3RvdHlwZS5zYW1wbGU9ZnVuY3Rpb24obil7cmV0dXJuIHRoaXMuX19jaGFpbl9ffHxudWxsIT1uP3RoaXMudGhydShmdW5jdGlvbih0KXtyZXR1cm4gTmUodCxuKVxufSk6TmUodGhpcy52YWx1ZSgpKX0sV3QuVkVSU0lPTj1iLE10KFwiYmluZCBiaW5kS2V5IGN1cnJ5IGN1cnJ5UmlnaHQgcGFydGlhbCBwYXJ0aWFsUmlnaHRcIi5zcGxpdChcIiBcIiksZnVuY3Rpb24obil7V3Rbbl0ucGxhY2Vob2xkZXI9V3R9KSxNdChbXCJmaWx0ZXJcIixcIm1hcFwiLFwidGFrZVdoaWxlXCJdLGZ1bmN0aW9uKG4sdCl7dmFyIHI9dD09VSxlPXQ9PUw7VXQucHJvdG90eXBlW25dPWZ1bmN0aW9uKG4sdSl7dmFyIG89dGhpcy5jbG9uZSgpLGk9by5fX2ZpbHRlcmVkX18sZj1vLl9faXRlcmF0ZWVzX198fChvLl9faXRlcmF0ZWVzX189W10pO3JldHVybiBvLl9fZmlsdGVyZWRfXz1pfHxyfHxlJiYwPm8uX19kaXJfXyxmLnB1c2goe2l0ZXJhdGVlOkhyKG4sdSwzKSx0eXBlOnR9KSxvfX0pLE10KFtcImRyb3BcIixcInRha2VcIl0sZnVuY3Rpb24obix0KXt2YXIgcj1cIl9fXCIrbitcIkNvdW50X19cIixlPW4rXCJXaGlsZVwiO1V0LnByb3RvdHlwZVtuXT1mdW5jdGlvbihlKXtlPW51bGw9PWU/MTp1byhQdShlKXx8MCwwKTtcbnZhciB1PXRoaXMuY2xvbmUoKTtpZih1Ll9fZmlsdGVyZWRfXyl7dmFyIG89dVtyXTt1W3JdPXQ/b28obyxlKTpvK2V9ZWxzZSh1Ll9fdmlld3NfX3x8KHUuX192aWV3c19fPVtdKSkucHVzaCh7c2l6ZTplLHR5cGU6bisoMD51Ll9fZGlyX18/XCJSaWdodFwiOlwiXCIpfSk7cmV0dXJuIHV9LFV0LnByb3RvdHlwZVtuK1wiUmlnaHRcIl09ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMucmV2ZXJzZSgpW25dKHQpLnJldmVyc2UoKX0sVXQucHJvdG90eXBlW24rXCJSaWdodFdoaWxlXCJdPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIHRoaXMucmV2ZXJzZSgpW2VdKG4sdCkucmV2ZXJzZSgpfX0pLE10KFtcImZpcnN0XCIsXCJsYXN0XCJdLGZ1bmN0aW9uKG4sdCl7dmFyIHI9XCJ0YWtlXCIrKHQ/XCJSaWdodFwiOlwiXCIpO1V0LnByb3RvdHlwZVtuXT1mdW5jdGlvbigpe3JldHVybiB0aGlzW3JdKDEpLnZhbHVlKClbMF19fSksTXQoW1wiaW5pdGlhbFwiLFwicmVzdFwiXSxmdW5jdGlvbihuLHQpe3ZhciByPVwiZHJvcFwiKyh0P1wiXCI6XCJSaWdodFwiKTtcblV0LnByb3RvdHlwZVtuXT1mdW5jdGlvbigpe3JldHVybiB0aGlzW3JdKDEpfX0pLE10KFtcInBsdWNrXCIsXCJ3aGVyZVwiXSxmdW5jdGlvbihuLHQpe3ZhciByPXQ/XCJmaWx0ZXJcIjpcIm1hcFwiLGU9dD9icjpqcjtVdC5wcm90b3R5cGVbbl09ZnVuY3Rpb24obil7cmV0dXJuIHRoaXNbcl0oZShuKSl9fSksVXQucHJvdG90eXBlLmNvbXBhY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5maWx0ZXIodnUpfSxVdC5wcm90b3R5cGUuZHJvcFdoaWxlPWZ1bmN0aW9uKG4sdCl7dmFyIHI7cmV0dXJuIG49SHIobix0LDMpLHRoaXMuZmlsdGVyKGZ1bmN0aW9uKHQsZSx1KXtyZXR1cm4gcnx8KHI9IW4odCxlLHUpKX0pfSxVdC5wcm90b3R5cGUucmVqZWN0PWZ1bmN0aW9uKG4sdCl7cmV0dXJuIG49SHIobix0LDMpLHRoaXMuZmlsdGVyKGZ1bmN0aW9uKHQscixlKXtyZXR1cm4hbih0LHIsZSl9KX0sVXQucHJvdG90eXBlLnNsaWNlPWZ1bmN0aW9uKG4sdCl7bj1udWxsPT1uPzA6K258fDA7dmFyIHI9MD5uP3RoaXMudGFrZVJpZ2h0KC1uKTp0aGlzLmRyb3Aobik7XG5yZXR1cm4gdHlwZW9mIHQhPVwidW5kZWZpbmVkXCImJih0PSt0fHwwLHI9MD50P3IuZHJvcFJpZ2h0KC10KTpyLnRha2UodC1uKSkscn0sVXQucHJvdG90eXBlLnRvQXJyYXk9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kcm9wKDApfSxfcihVdC5wcm90b3R5cGUsZnVuY3Rpb24obix0KXt2YXIgcj1XdFt0XSxlPS9eKD86Zmlyc3R8bGFzdCkkLy50ZXN0KHQpO1d0LnByb3RvdHlwZVt0XT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQobil7cmV0dXJuIG49W25dLFZ1LmFwcGx5KG4sbyksci5hcHBseShXdCxuKX12YXIgdT10aGlzLl9fd3JhcHBlZF9fLG89YXJndW1lbnRzLGk9dGhpcy5fX2NoYWluX18sZj0hIXRoaXMuX19hY3Rpb25zX18ubGVuZ3RoLGE9dSBpbnN0YW5jZW9mIFV0LGM9YSYmIWY7cmV0dXJuIGUmJiFpP2M/bi5jYWxsKHUpOnIuY2FsbChXdCx0aGlzLnZhbHVlKCkpOmF8fFNvKHUpPyh1PW4uYXBwbHkoYz91Om5ldyBVdCh0aGlzKSxvKSxlfHwhZiYmIXUuX19hY3Rpb25zX198fCh1Ll9fYWN0aW9uc19ffHwodS5fX2FjdGlvbnNfXz1bXSkpLnB1c2goe2Z1bmM6amUsYXJnczpbdF0sdGhpc0FyZzpXdH0pLG5ldyBOdCh1LGkpKTp0aGlzLnRocnUodClcbn19KSxNdChcImNvbmNhdCBqb2luIHBvcCBwdXNoIHNoaWZ0IHNvcnQgc3BsaWNlIHVuc2hpZnRcIi5zcGxpdChcIiBcIiksZnVuY3Rpb24obil7dmFyIHQ9Q3Vbbl0scj0vXig/OnB1c2h8c29ydHx1bnNoaWZ0KSQvLnRlc3Qobik/XCJ0YXBcIjpcInRocnVcIixlPS9eKD86am9pbnxwb3B8c2hpZnQpJC8udGVzdChuKTtXdC5wcm90b3R5cGVbbl09ZnVuY3Rpb24oKXt2YXIgbj1hcmd1bWVudHM7cmV0dXJuIGUmJiF0aGlzLl9fY2hhaW5fXz90LmFwcGx5KHRoaXMudmFsdWUoKSxuKTp0aGlzW3JdKGZ1bmN0aW9uKHIpe3JldHVybiB0LmFwcGx5KHIsbil9KX19KSxVdC5wcm90b3R5cGUuY2xvbmU9ZnVuY3Rpb24oKXt2YXIgbj10aGlzLl9fYWN0aW9uc19fLHQ9dGhpcy5fX2l0ZXJhdGVlc19fLHI9dGhpcy5fX3ZpZXdzX18sZT1uZXcgVXQodGhpcy5fX3dyYXBwZWRfXyk7cmV0dXJuIGUuX19hY3Rpb25zX189bj96dChuKTpudWxsLGUuX19kaXJfXz10aGlzLl9fZGlyX18sZS5fX2Ryb3BDb3VudF9fPXRoaXMuX19kcm9wQ291bnRfXyxlLl9fZmlsdGVyZWRfXz10aGlzLl9fZmlsdGVyZWRfXyxlLl9faXRlcmF0ZWVzX189dD96dCh0KTpudWxsLGUuX190YWtlQ291bnRfXz10aGlzLl9fdGFrZUNvdW50X18sZS5fX3ZpZXdzX189cj96dChyKTpudWxsLGVcbn0sVXQucHJvdG90eXBlLnJldmVyc2U9ZnVuY3Rpb24oKXtpZih0aGlzLl9fZmlsdGVyZWRfXyl7dmFyIG49bmV3IFV0KHRoaXMpO24uX19kaXJfXz0tMSxuLl9fZmlsdGVyZWRfXz10cnVlfWVsc2Ugbj10aGlzLmNsb25lKCksbi5fX2Rpcl9fKj0tMTtyZXR1cm4gbn0sVXQucHJvdG90eXBlLnZhbHVlPWZ1bmN0aW9uKCl7dmFyIG49dGhpcy5fX3dyYXBwZWRfXy52YWx1ZSgpO2lmKCFTbyhuKSlyZXR1cm4gVHIobix0aGlzLl9fYWN0aW9uc19fKTt2YXIgdCxyPXRoaXMuX19kaXJfXyxlPTA+cjt0PW4ubGVuZ3RoO2Zvcih2YXIgdT10aGlzLl9fdmlld3NfXyxvPTAsaT0tMSxmPXU/dS5sZW5ndGg6MDsrK2k8Zjspe3ZhciBhPXVbaV0sYz1hLnNpemU7c3dpdGNoKGEudHlwZSl7Y2FzZVwiZHJvcFwiOm8rPWM7YnJlYWs7Y2FzZVwiZHJvcFJpZ2h0XCI6dC09YzticmVhaztjYXNlXCJ0YWtlXCI6dD1vbyh0LG8rYyk7YnJlYWs7Y2FzZVwidGFrZVJpZ2h0XCI6bz11byhvLHQtYyl9fXQ9e3N0YXJ0Om8sZW5kOnR9LGk9dC5zdGFydCxmPXQuZW5kLHQ9Zi1pLHU9dGhpcy5fX2Ryb3BDb3VudF9fLG89b28odCx0aGlzLl9fdGFrZUNvdW50X18pLGU9ZT9mOmktMSxmPShpPXRoaXMuX19pdGVyYXRlZXNfXyk/aS5sZW5ndGg6MCxhPTAsYz1bXTtcbm46Zm9yKDt0LS0mJmE8bzspe2Zvcih2YXIgZT1lK3IsbD0tMSxzPW5bZV07KytsPGY7KXt2YXIgcD1pW2xdLGg9cC5pdGVyYXRlZShzLGUsbikscD1wLnR5cGU7aWYocD09RilzPWg7ZWxzZSBpZighaCl7aWYocD09VSljb250aW51ZSBuO2JyZWFrIG59fXU/dS0tOmNbYSsrXT1zfXJldHVybiBjfSxXdC5wcm90b3R5cGUuY2hhaW49ZnVuY3Rpb24oKXtyZXR1cm4gQWUodGhpcyl9LFd0LnByb3RvdHlwZS5jb21taXQ9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IE50KHRoaXMudmFsdWUoKSx0aGlzLl9fY2hhaW5fXyl9LFd0LnByb3RvdHlwZS5wbGFudD1mdW5jdGlvbihuKXtmb3IodmFyIHQscj10aGlzO3IgaW5zdGFuY2VvZiBOdDspe3ZhciBlPWhlKHIpO3Q/dS5fX3dyYXBwZWRfXz1lOnQ9ZTt2YXIgdT1lLHI9ci5fX3dyYXBwZWRfX31yZXR1cm4gdS5fX3dyYXBwZWRfXz1uLHR9LFd0LnByb3RvdHlwZS5yZXZlcnNlPWZ1bmN0aW9uKCl7dmFyIG49dGhpcy5fX3dyYXBwZWRfXztyZXR1cm4gbiBpbnN0YW5jZW9mIFV0Pyh0aGlzLl9fYWN0aW9uc19fLmxlbmd0aCYmKG49bmV3IFV0KHRoaXMpKSxuZXcgTnQobi5yZXZlcnNlKCksdGhpcy5fX2NoYWluX18pKTp0aGlzLnRocnUoZnVuY3Rpb24obil7cmV0dXJuIG4ucmV2ZXJzZSgpXG59KX0sV3QucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudmFsdWUoKStcIlwifSxXdC5wcm90b3R5cGUucnVuPVd0LnByb3RvdHlwZS50b0pTT049V3QucHJvdG90eXBlLnZhbHVlT2Y9V3QucHJvdG90eXBlLnZhbHVlPWZ1bmN0aW9uKCl7cmV0dXJuIFRyKHRoaXMuX193cmFwcGVkX18sdGhpcy5fX2FjdGlvbnNfXyl9LFd0LnByb3RvdHlwZS5jb2xsZWN0PVd0LnByb3RvdHlwZS5tYXAsV3QucHJvdG90eXBlLmhlYWQ9V3QucHJvdG90eXBlLmZpcnN0LFd0LnByb3RvdHlwZS5zZWxlY3Q9V3QucHJvdG90eXBlLmZpbHRlcixXdC5wcm90b3R5cGUudGFpbD1XdC5wcm90b3R5cGUucmVzdCxXdH12YXIgdyxiPVwiMy4yLjBcIix4PTEsQT0yLGo9NCxrPTgsRT0xNixSPTMyLEk9NjQsTz0xMjgsQz0yNTYsVD0zMCxTPVwiLi4uXCIsVz0xNTAsTj0xNixVPTAsRj0xLEw9MiwkPVwiRXhwZWN0ZWQgYSBmdW5jdGlvblwiLEI9XCJfX2xvZGFzaF9wbGFjZWhvbGRlcl9fXCIsej1cIltvYmplY3QgQXJndW1lbnRzXVwiLEQ9XCJbb2JqZWN0IEFycmF5XVwiLE09XCJbb2JqZWN0IEJvb2xlYW5dXCIscT1cIltvYmplY3QgRGF0ZV1cIixQPVwiW29iamVjdCBFcnJvcl1cIixLPVwiW29iamVjdCBGdW5jdGlvbl1cIixWPVwiW29iamVjdCBOdW1iZXJdXCIsWT1cIltvYmplY3QgT2JqZWN0XVwiLFo9XCJbb2JqZWN0IFJlZ0V4cF1cIixHPVwiW29iamVjdCBTdHJpbmddXCIsSj1cIltvYmplY3QgQXJyYXlCdWZmZXJdXCIsWD1cIltvYmplY3QgRmxvYXQzMkFycmF5XVwiLEg9XCJbb2JqZWN0IEZsb2F0NjRBcnJheV1cIixRPVwiW29iamVjdCBJbnQ4QXJyYXldXCIsbnQ9XCJbb2JqZWN0IEludDE2QXJyYXldXCIsdHQ9XCJbb2JqZWN0IEludDMyQXJyYXldXCIscnQ9XCJbb2JqZWN0IFVpbnQ4QXJyYXldXCIsZXQ9XCJbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XVwiLHV0PVwiW29iamVjdCBVaW50MTZBcnJheV1cIixvdD1cIltvYmplY3QgVWludDMyQXJyYXldXCIsaXQ9L1xcYl9fcFxcKz0nJzsvZyxmdD0vXFxiKF9fcFxcKz0pJydcXCsvZyxhdD0vKF9fZVxcKC4qP1xcKXxcXGJfX3RcXCkpXFwrJyc7L2csY3Q9LyYoPzphbXB8bHR8Z3R8cXVvdHwjMzl8Izk2KTsvZyxsdD0vWyY8PlwiJ2BdL2csc3Q9UmVnRXhwKGN0LnNvdXJjZSkscHQ9UmVnRXhwKGx0LnNvdXJjZSksaHQ9LzwlLShbXFxzXFxTXSs/KSU+L2csX3Q9LzwlKFtcXHNcXFNdKz8pJT4vZyxndD0vPCU9KFtcXHNcXFNdKz8pJT4vZyx2dD0vXFwkXFx7KFteXFxcXH1dKig/OlxcXFwuW15cXFxcfV0qKSopXFx9L2cseXQ9L1xcdyokLyxkdD0vXlxccypmdW5jdGlvblsgXFxuXFxyXFx0XStcXHcvLG10PS9eMFt4WF0vLHd0PS9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC8sYnQ9L1tcXHhjMC1cXHhkNlxceGQ4LVxceGRlXFx4ZGYtXFx4ZjZcXHhmOC1cXHhmZl0vZyx4dD0vKCReKS8sQXQ9L1suKis/XiR7fSgpfFtcXF1cXC9cXFxcXS9nLGp0PVJlZ0V4cChBdC5zb3VyY2UpLGt0PS9cXGJ0aGlzXFxiLyxFdD0vWydcXG5cXHJcXHUyMDI4XFx1MjAyOVxcXFxdL2csUnQ9UmVnRXhwKFwiW0EtWlxcXFx4YzAtXFxcXHhkNlxcXFx4ZDgtXFxcXHhkZV17Mix9KD89W0EtWlxcXFx4YzAtXFxcXHhkNlxcXFx4ZDgtXFxcXHhkZV1bYS16XFxcXHhkZi1cXFxceGY2XFxcXHhmOC1cXFxceGZmXSspfFtBLVpcXFxceGMwLVxcXFx4ZDZcXFxceGQ4LVxcXFx4ZGVdP1thLXpcXFxceGRmLVxcXFx4ZjZcXFxceGY4LVxcXFx4ZmZdK3xbQS1aXFxcXHhjMC1cXFxceGQ2XFxcXHhkOC1cXFxceGRlXSt8WzAtOV0rXCIsXCJnXCIpLEl0PVwiIFxcdFxceDBiXFxmXFx4YTBcXHVmZWZmXFxuXFxyXFx1MjAyOFxcdTIwMjlcXHUxNjgwXFx1MTgwZVxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDNcXHUyMDA0XFx1MjAwNVxcdTIwMDZcXHUyMDA3XFx1MjAwOFxcdTIwMDlcXHUyMDBhXFx1MjAyZlxcdTIwNWZcXHUzMDAwXCIsT3Q9XCJBcnJheSBBcnJheUJ1ZmZlciBEYXRlIEVycm9yIEZsb2F0MzJBcnJheSBGbG9hdDY0QXJyYXkgRnVuY3Rpb24gSW50OEFycmF5IEludDE2QXJyYXkgSW50MzJBcnJheSBNYXRoIE51bWJlciBPYmplY3QgUmVnRXhwIFNldCBTdHJpbmcgXyBjbGVhclRpbWVvdXQgZG9jdW1lbnQgaXNGaW5pdGUgcGFyc2VJbnQgc2V0VGltZW91dCBUeXBlRXJyb3IgVWludDhBcnJheSBVaW50OENsYW1wZWRBcnJheSBVaW50MTZBcnJheSBVaW50MzJBcnJheSBXZWFrTWFwIHdpbmRvdyBXaW5SVEVycm9yXCIuc3BsaXQoXCIgXCIpLEN0PXt9O1xuQ3RbWF09Q3RbSF09Q3RbUV09Q3RbbnRdPUN0W3R0XT1DdFtydF09Q3RbZXRdPUN0W3V0XT1DdFtvdF09dHJ1ZSxDdFt6XT1DdFtEXT1DdFtKXT1DdFtNXT1DdFtxXT1DdFtQXT1DdFtLXT1DdFtcIltvYmplY3QgTWFwXVwiXT1DdFtWXT1DdFtZXT1DdFtaXT1DdFtcIltvYmplY3QgU2V0XVwiXT1DdFtHXT1DdFtcIltvYmplY3QgV2Vha01hcF1cIl09ZmFsc2U7dmFyIFR0PXt9O1R0W3pdPVR0W0RdPVR0W0pdPVR0W01dPVR0W3FdPVR0W1hdPVR0W0hdPVR0W1FdPVR0W250XT1UdFt0dF09VHRbVl09VHRbWV09VHRbWl09VHRbR109VHRbcnRdPVR0W2V0XT1UdFt1dF09VHRbb3RdPXRydWUsVHRbUF09VHRbS109VHRbXCJbb2JqZWN0IE1hcF1cIl09VHRbXCJbb2JqZWN0IFNldF1cIl09VHRbXCJbb2JqZWN0IFdlYWtNYXBdXCJdPWZhbHNlO3ZhciBTdD17bGVhZGluZzpmYWxzZSxtYXhXYWl0OjAsdHJhaWxpbmc6ZmFsc2V9LFd0PXtcIlxceGMwXCI6XCJBXCIsXCJcXHhjMVwiOlwiQVwiLFwiXFx4YzJcIjpcIkFcIixcIlxceGMzXCI6XCJBXCIsXCJcXHhjNFwiOlwiQVwiLFwiXFx4YzVcIjpcIkFcIixcIlxceGUwXCI6XCJhXCIsXCJcXHhlMVwiOlwiYVwiLFwiXFx4ZTJcIjpcImFcIixcIlxceGUzXCI6XCJhXCIsXCJcXHhlNFwiOlwiYVwiLFwiXFx4ZTVcIjpcImFcIixcIlxceGM3XCI6XCJDXCIsXCJcXHhlN1wiOlwiY1wiLFwiXFx4ZDBcIjpcIkRcIixcIlxceGYwXCI6XCJkXCIsXCJcXHhjOFwiOlwiRVwiLFwiXFx4YzlcIjpcIkVcIixcIlxceGNhXCI6XCJFXCIsXCJcXHhjYlwiOlwiRVwiLFwiXFx4ZThcIjpcImVcIixcIlxceGU5XCI6XCJlXCIsXCJcXHhlYVwiOlwiZVwiLFwiXFx4ZWJcIjpcImVcIixcIlxceGNjXCI6XCJJXCIsXCJcXHhjZFwiOlwiSVwiLFwiXFx4Y2VcIjpcIklcIixcIlxceGNmXCI6XCJJXCIsXCJcXHhlY1wiOlwiaVwiLFwiXFx4ZWRcIjpcImlcIixcIlxceGVlXCI6XCJpXCIsXCJcXHhlZlwiOlwiaVwiLFwiXFx4ZDFcIjpcIk5cIixcIlxceGYxXCI6XCJuXCIsXCJcXHhkMlwiOlwiT1wiLFwiXFx4ZDNcIjpcIk9cIixcIlxceGQ0XCI6XCJPXCIsXCJcXHhkNVwiOlwiT1wiLFwiXFx4ZDZcIjpcIk9cIixcIlxceGQ4XCI6XCJPXCIsXCJcXHhmMlwiOlwib1wiLFwiXFx4ZjNcIjpcIm9cIixcIlxceGY0XCI6XCJvXCIsXCJcXHhmNVwiOlwib1wiLFwiXFx4ZjZcIjpcIm9cIixcIlxceGY4XCI6XCJvXCIsXCJcXHhkOVwiOlwiVVwiLFwiXFx4ZGFcIjpcIlVcIixcIlxceGRiXCI6XCJVXCIsXCJcXHhkY1wiOlwiVVwiLFwiXFx4ZjlcIjpcInVcIixcIlxceGZhXCI6XCJ1XCIsXCJcXHhmYlwiOlwidVwiLFwiXFx4ZmNcIjpcInVcIixcIlxceGRkXCI6XCJZXCIsXCJcXHhmZFwiOlwieVwiLFwiXFx4ZmZcIjpcInlcIixcIlxceGM2XCI6XCJBZVwiLFwiXFx4ZTZcIjpcImFlXCIsXCJcXHhkZVwiOlwiVGhcIixcIlxceGZlXCI6XCJ0aFwiLFwiXFx4ZGZcIjpcInNzXCJ9LE50PXtcIiZcIjpcIiZhbXA7XCIsXCI8XCI6XCImbHQ7XCIsXCI+XCI6XCImZ3Q7XCIsJ1wiJzpcIiZxdW90O1wiLFwiJ1wiOlwiJiMzOTtcIixcImBcIjpcIiYjOTY7XCJ9LFV0PXtcIiZhbXA7XCI6XCImXCIsXCImbHQ7XCI6XCI8XCIsXCImZ3Q7XCI6XCI+XCIsXCImcXVvdDtcIjonXCInLFwiJiMzOTtcIjpcIidcIixcIiYjOTY7XCI6XCJgXCJ9LEZ0PXtcImZ1bmN0aW9uXCI6dHJ1ZSxvYmplY3Q6dHJ1ZX0sTHQ9e1wiXFxcXFwiOlwiXFxcXFwiLFwiJ1wiOlwiJ1wiLFwiXFxuXCI6XCJuXCIsXCJcXHJcIjpcInJcIixcIlxcdTIwMjhcIjpcInUyMDI4XCIsXCJcXHUyMDI5XCI6XCJ1MjAyOVwifSwkdD1GdFt0eXBlb2Ygd2luZG93XSYmd2luZG93IT09KHRoaXMmJnRoaXMud2luZG93KT93aW5kb3c6dGhpcyxCdD1GdFt0eXBlb2YgZXhwb3J0c10mJmV4cG9ydHMmJiFleHBvcnRzLm5vZGVUeXBlJiZleHBvcnRzLEZ0PUZ0W3R5cGVvZiBtb2R1bGVdJiZtb2R1bGUmJiFtb2R1bGUubm9kZVR5cGUmJm1vZHVsZSx6dD1CdCYmRnQmJnR5cGVvZiBnbG9iYWw9PVwib2JqZWN0XCImJmdsb2JhbDtcbiF6dHx8enQuZ2xvYmFsIT09enQmJnp0LndpbmRvdyE9PXp0JiZ6dC5zZWxmIT09enR8fCgkdD16dCk7dmFyIHp0PUZ0JiZGdC5leHBvcnRzPT09QnQmJkJ0LER0PW0oKTt0eXBlb2YgZGVmaW5lPT1cImZ1bmN0aW9uXCImJnR5cGVvZiBkZWZpbmUuYW1kPT1cIm9iamVjdFwiJiZkZWZpbmUuYW1kPygkdC5fPUR0LCBkZWZpbmUoZnVuY3Rpb24oKXtyZXR1cm4gRHR9KSk6QnQmJkZ0P3p0PyhGdC5leHBvcnRzPUR0KS5fPUR0OkJ0Ll89RHQ6JHQuXz1EdH0pLmNhbGwodGhpcyk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2NhY2hlJywgZnVuY3Rpb24gKCRxLCAkbG9nLCBEYXRhKSB7XG5cdHZhciBjYWNoZSA9IHt9O1xuXG5cdHZhciBsaWJyYXJ5ID0gbnVsbDtcblx0dmFyIHNlY3Rpb25zID0ge307XG5cdHZhciBib29rcyA9IHt9O1xuXHR2YXIgaW1hZ2VzID0ge307XG5cblx0Y2FjaGUuaW5pdCA9IGZ1bmN0aW9uKGxpYnJhcnlNb2RlbCwgc2VjdGlvbk1vZGVscywgYm9va01vZGVscywgaW1hZ2VVcmxzKSB7XG5cdFx0dmFyIGxpYnJhcnlMb2FkID0gbG9hZExpYnJhcnlEYXRhKGxpYnJhcnlNb2RlbCk7XG5cdFx0dmFyIHNlY3Rpb25zTG9hZCA9IFtdO1xuXHRcdHZhciBib29rc0xvYWQgPSBbXTtcblx0XHR2YXIgaW1hZ2VzTG9hZCA9IFtdO1xuXHRcdHZhciBtb2RlbCwgdXJsOyAvLyBpdGVyYXRvcnNcblxuXHRcdGZvciAobW9kZWwgaW4gc2VjdGlvbk1vZGVscykge1xuXHRcdFx0c2VjdGlvbnNMb2FkLnB1c2goYWRkU2VjdGlvbihtb2RlbCkpO1xuXHRcdH1cblxuXHRcdGZvciAobW9kZWwgaW4gYm9va01vZGVscykge1xuXHRcdFx0Ym9va3NMb2FkLnB1c2goYWRkQm9vayhtb2RlbCkpO1xuXHRcdH1cblxuXHRcdGZvciAodXJsIGluIGltYWdlVXJscykge1xuXHRcdFx0aW1hZ2VzTG9hZC5wdXNoKGFkZEltYWdlKHVybCkpO1xuXHRcdH1cblxuXHRcdHZhciBwcm9taXNlID0gJHEuYWxsKHtcblx0XHRcdGxpYnJhcnlDYWNoZTogbGlicmFyeUxvYWQsIFxuXHRcdFx0c2VjdGlvbnNMb2FkOiAkcS5hbGwoc2VjdGlvbnNMb2FkKSwgXG5cdFx0XHRib29rc0xvYWQ6ICRxLmFsbChib29rc0xvYWQpLFxuXHRcdFx0aW1hZ2VzTG9hZDogJHEuYWxsKGltYWdlc0xvYWQpXG5cdFx0fSkudGhlbihmdW5jdGlvbiAocmVzdWx0cykge1xuXHRcdFx0bGlicmFyeSA9IHJlc3VsdHMubGlicmFyeUNhY2hlO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0Y2FjaGUuZ2V0TGlicmFyeSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBsaWJyYXJ5O1xuXHR9O1xuXG5cdGNhY2hlLmdldFNlY3Rpb24gPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBjb21tb25HZXR0ZXIoc2VjdGlvbnMsIG1vZGVsLCBhZGRTZWN0aW9uKTtcblx0fTtcblxuXHRjYWNoZS5nZXRCb29rID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHRyZXR1cm4gY29tbW9uR2V0dGVyKGJvb2tzLCBtb2RlbCwgYWRkQm9vayk7XG5cdH07XG5cblx0Y2FjaGUuZ2V0SW1hZ2UgPSBmdW5jdGlvbih1cmwpIHtcblx0XHRyZXR1cm4gY29tbW9uR2V0dGVyKGltYWdlcywgdXJsLCBhZGRJbWFnZSk7XG5cdH07XG5cblx0dmFyIGNvbW1vbkdldHRlciA9IGZ1bmN0aW9uKGZyb20sIGtleSwgYWRkRnVuY3Rpb24pIHtcblx0XHR2YXIgcmVzdWx0ID0gZnJvbVtrZXldO1xuXG5cdFx0aWYoIXJlc3VsdCkge1xuXHRcdFx0cmVzdWx0ID0gYWRkRnVuY3Rpb24oa2V5KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gJHEud2hlbihyZXN1bHQpO1xuXHR9O1xuXG5cdHZhciBjb21tb25BZGRlciA9IGZ1bmN0aW9uKHdoZXJlLCB3aGF0LCBsb2FkZXIsIGtleSkge1xuXHRcdHZhciBwcm9taXNlID0gbG9hZGVyKHdoYXQpLnRoZW4oZnVuY3Rpb24gKGxvYWRlZENhY2hlKSB7XG5cdFx0XHR3aGVyZVtrZXkgfHwgd2hhdF0gPSBsb2FkZWRDYWNoZTtcblxuXHRcdFx0cmV0dXJuIGxvYWRlZENhY2hlO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIGFkZFNlY3Rpb24gPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBjb21tb25BZGRlcihzZWN0aW9ucywgbW9kZWwsIGxvYWRTZWN0aW9uRGF0YSk7XG5cdH07XG5cblx0dmFyIGFkZEJvb2sgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHJldHVybiBjb21tb25BZGRlcihib29rcywgbW9kZWwsIGxvYWRCb29rRGF0YSk7XG5cdH07XG5cblx0dmFyIGFkZEltYWdlID0gZnVuY3Rpb24odXJsKSB7XG5cdFx0cmV0dXJuIGNvbW1vbkFkZGVyKGltYWdlcywgJy9vdXRzaWRlP2xpbms9JyArIHVybCwgRGF0YS5sb2FkSW1hZ2UsIHVybCkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0XHQkbG9nLmVycm9yKCdFcnJvciBhZGRpbmcgaW1hZ2U6JywgdXJsKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH0pO1xuXHR9O1xuXG5cdHZhciBsb2FkTGlicmFyeURhdGEgPSBmdW5jdGlvbihtb2RlbCkge1xuXHRcdHZhciBwYXRoID0gJy9vYmovbGlicmFyaWVzL3ttb2RlbH0vJy5yZXBsYWNlKCd7bW9kZWx9JywgbW9kZWwpO1xuICAgICAgICB2YXIgbW9kZWxVcmwgPSBwYXRoICsgJ21vZGVsLmpzb24nO1xuICAgICAgICB2YXIgbWFwVXJsID0gcGF0aCArICdtYXAuanBnJztcblxuICAgICAgICB2YXIgcHJvbWlzZSA9ICRxLmFsbCh7XG4gICAgICAgIFx0Z2VvbWV0cnk6IERhdGEubG9hZEdlb21ldHJ5KG1vZGVsVXJsKSwgXG4gICAgICAgIFx0bWFwSW1hZ2U6IERhdGEubG9hZEltYWdlKG1hcFVybClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIGxvYWRTZWN0aW9uRGF0YSA9IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0dmFyIHBhdGggPSAnL29iai9zZWN0aW9ucy97bW9kZWx9LycucmVwbGFjZSgne21vZGVsfScsIG1vZGVsKTtcbiAgICAgICAgdmFyIG1vZGVsVXJsID0gcGF0aCArICdtb2RlbC5qcyc7XG4gICAgICAgIHZhciBtYXBVcmwgPSBwYXRoICsgJ21hcC5qcGcnO1xuICAgICAgICB2YXIgZGF0YVVybCA9IHBhdGggKyAnZGF0YS5qc29uJztcblxuICAgICAgICB2YXIgcHJvbWlzZSA9ICRxLmFsbCh7XG4gICAgICAgIFx0Z2VvbWV0cnk6IERhdGEubG9hZEdlb21ldHJ5KG1vZGVsVXJsKSwgXG4gICAgICAgIFx0bWFwSW1hZ2U6IERhdGEubG9hZEltYWdlKG1hcFVybCksIFxuICAgICAgICBcdGRhdGE6IERhdGEuZ2V0RGF0YShkYXRhVXJsKVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHR2YXIgbG9hZEJvb2tEYXRhID0gZnVuY3Rpb24obW9kZWwpIHtcblx0XHR2YXIgcGF0aCA9ICcvb2JqL2Jvb2tzL3ttb2RlbH0vJy5yZXBsYWNlKCd7bW9kZWx9JywgbW9kZWwpO1xuICAgICAgICB2YXIgbW9kZWxVcmwgPSBwYXRoICsgJ21vZGVsLmpzJztcbiAgICAgICAgdmFyIG1hcFVybCA9IHBhdGggKyAnbWFwLmpwZyc7XG5cbiAgICAgICAgdmFyIHByb21pc2UgPSAkcS5hbGwoe1xuICAgICAgICBcdGdlb21ldHJ5OiBEYXRhLmxvYWRHZW9tZXRyeShtb2RlbFVybCksXG4gICAgICAgIFx0bWFwSW1hZ2U6IERhdGEubG9hZEltYWdlKG1hcFVybCkgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHJldHVybiBjYWNoZTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdDYW1lcmEnLCBmdW5jdGlvbiAoQ2FtZXJhT2JqZWN0KSB7XG5cdHZhciBDYW1lcmEgPSB7XG5cdFx0SEVJR1RIOiAxLjUsXG5cdFx0b2JqZWN0OiBuZXcgQ2FtZXJhT2JqZWN0KCksXG5cdFx0c2V0UGFyZW50OiBmdW5jdGlvbihwYXJlbnQpIHtcblx0XHRcdHBhcmVudC5hZGQodGhpcy5vYmplY3QpO1xuXHRcdH0sXG5cdFx0Z2V0UG9zaXRpb246IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMub2JqZWN0LnBvc2l0aW9uO1xuXHRcdH1cblx0fTtcblxuXHRDYW1lcmEuaW5pdCA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcblx0XHRDYW1lcmEuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDQ1LCB3aWR0aCAvIGhlaWdodCwgMC4wMSwgNTApO1xuXHRcdHRoaXMub2JqZWN0LnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgQ2FtZXJhLkhFSUdUSCwgMCk7XG5cdFx0dGhpcy5vYmplY3Qucm90YXRpb24ub3JkZXIgPSAnWVhaJztcblxuXHRcdHZhciBjYW5kbGUgPSBuZXcgVEhSRUUuUG9pbnRMaWdodCgweDY2NTU1NSwgMS42LCAxMCk7XG5cdFx0Y2FuZGxlLnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcblx0XHR0aGlzLm9iamVjdC5hZGQoY2FuZGxlKTtcblxuXHRcdHRoaXMub2JqZWN0LmFkZChDYW1lcmEuY2FtZXJhKTtcblx0fTtcblxuXHRDYW1lcmEucm90YXRlID0gZnVuY3Rpb24oeCwgeSkge1xuXHRcdHZhciBuZXdYID0gdGhpcy5vYmplY3Qucm90YXRpb24ueCArIHkgKiAwLjAwMDEgfHwgMDtcblx0XHR2YXIgbmV3WSA9IHRoaXMub2JqZWN0LnJvdGF0aW9uLnkgKyB4ICogMC4wMDAxIHx8IDA7XG5cblx0XHRpZihuZXdYIDwgMS41NyAmJiBuZXdYID4gLTEuNTcpIHtcdFxuXHRcdFx0dGhpcy5vYmplY3Qucm90YXRpb24ueCA9IG5ld1g7XG5cdFx0fVxuXG5cdFx0dGhpcy5vYmplY3Qucm90YXRpb24ueSA9IG5ld1k7XG5cdH07XG5cblx0Q2FtZXJhLmdvID0gZnVuY3Rpb24oc3BlZWQpIHtcblx0XHR2YXIgZGlyZWN0aW9uID0gdGhpcy5nZXRWZWN0b3IoKTtcblx0XHR2YXIgbmV3UG9zaXRpb24gPSB0aGlzLm9iamVjdC5wb3NpdGlvbi5jbG9uZSgpO1xuXHRcdG5ld1Bvc2l0aW9uLmFkZChkaXJlY3Rpb24ubXVsdGlwbHlTY2FsYXIoc3BlZWQpKTtcblxuXHRcdHRoaXMub2JqZWN0Lm1vdmUobmV3UG9zaXRpb24pO1xuXHR9O1xuXG5cdENhbWVyYS5nZXRWZWN0b3IgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgdmVjdG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgLTEpO1xuXG5cdFx0cmV0dXJuIHZlY3Rvci5hcHBseUV1bGVyKHRoaXMub2JqZWN0LnJvdGF0aW9uKTtcblx0fTtcblxuXHRyZXR1cm4gQ2FtZXJhO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLyogXG4gKiBjb250cm9scy5qcyBpcyBhIHNlcnZpY2UgZm9yIHByb2Nlc3Npbmcgbm90IFVJKG1lbnVzKSBldmVudHMgXG4gKiBsaWtlIG1vdXNlLCBrZXlib2FyZCwgdG91Y2ggb3IgZ2VzdHVyZXMuXG4gKlxuICogVE9ETzogcmVtb3ZlIGFsbCBidXNpbmVzIGxvZ2ljIGZyb20gdGhlcmUgYW5kIGxlYXZlIG9ubHlcbiAqIGV2ZW50cyBmdW5jdGlvbmFsaXR5IHRvIG1ha2UgaXQgbW9yZSBzaW1pbGFyIHRvIHVzdWFsIGNvbnRyb2xsZXJcbiAqL1xuLmZhY3RvcnkoJ0NvbnRyb2xzJywgZnVuY3Rpb24gKCRxLCAkbG9nLCBTZWxlY3Rvck1ldGEsIEJvb2tPYmplY3QsIFNoZWxmT2JqZWN0LCBTZWN0aW9uT2JqZWN0LCBDYW1lcmEsIERhdGEsIG5hdmlnYXRpb24sIGVudmlyb25tZW50LCBtb3VzZSwgc2VsZWN0b3IpIHtcblx0dmFyIENvbnRyb2xzID0ge307XG5cblx0Q29udHJvbHMuQlVUVE9OU19ST1RBVEVfU1BFRUQgPSAxMDA7XG5cdENvbnRyb2xzLkJVVFRPTlNfR09fU1BFRUQgPSAwLjAyO1xuXG5cdENvbnRyb2xzLlBvY2tldCA9IHtcblx0XHRfYm9va3M6IHt9LFxuXG5cdFx0c2VsZWN0T2JqZWN0OiBmdW5jdGlvbih0YXJnZXQpIHtcblx0XHRcdHZhciBcblx0XHRcdFx0ZGF0YU9iamVjdCA9IHRoaXMuX2Jvb2tzW3RhcmdldC52YWx1ZV1cblxuXHRcdFx0RGF0YS5jcmVhdGVCb29rKGRhdGFPYmplY3QsIGZ1bmN0aW9uIChib29rLCBkYXRhT2JqZWN0KSB7XG5cdFx0XHRcdENvbnRyb2xzLlBvY2tldC5yZW1vdmUoZGF0YU9iamVjdC5pZCk7XG5cdFx0XHRcdENvbnRyb2xzLnNlbGVjdGVkLnNlbGVjdChib29rLCBudWxsKTtcblx0XHRcdFx0Ly8gYm9vay5jaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0cmVtb3ZlOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0dGhpcy5fYm9va3NbaWRdID0gbnVsbDtcblx0XHRcdGRlbGV0ZSB0aGlzLl9ib29rc1tpZF07XG5cdFx0fSxcblx0XHRwdXQ6IGZ1bmN0aW9uKGRhdGFPYmplY3QpIHtcblx0XHRcdHRoaXMuX2Jvb2tzW2RhdGFPYmplY3QuaWRdID0gZGF0YU9iamVjdDtcblx0XHR9LFxuXHRcdGdldEJvb2tzOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9ib29rcztcblx0XHR9LFxuXHRcdGlzRW1wdHk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2Jvb2tzLmxlbmd0aCA9PSAwO1xuXHRcdH1cblx0fTtcblxuXHRDb250cm9scy5zZWxlY3RlZCA9IHtcblx0XHRvYmplY3Q6IG51bGwsXG5cdFx0Ly8gcGFyZW50OiBudWxsLFxuXHRcdGdldHRlZDogbnVsbCxcblx0XHQvLyBwb2ludDogbnVsbCxcblxuXHRcdGlzQm9vazogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZEJvb2soKTtcblx0XHR9LFxuXHRcdGlzU2VjdGlvbjogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gc2VsZWN0b3IuaXNTZWxlY3RlZFNlY3Rpb24oKTtcblx0XHR9LFxuXHRcdGlzU2hlbGY6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHNlbGVjdG9yLmlzU2VsZWN0ZWRTaGVsZigpO1xuXHRcdH0sXG5cdFx0aXNNb3ZhYmxlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBCb29sZWFuKHRoaXMuaXNCb29rKCkgfHwgdGhpcy5pc1NlY3Rpb24oKSk7XG5cdFx0fSxcblx0XHRpc1JvdGF0YWJsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gQm9vbGVhbih0aGlzLmlzU2VjdGlvbigpKTtcblx0XHR9LFxuXHRcdGNsZWFyOiBmdW5jdGlvbigpIHtcblx0XHRcdHNlbGVjdG9yLnVuc2VsZWN0KCk7XG5cdFx0XHR0aGlzLm9iamVjdCA9IG51bGw7XG5cdFx0XHR0aGlzLmdldHRlZCA9IG51bGw7XG5cdFx0fSxcblx0XHRzZWxlY3Q6IGZ1bmN0aW9uKCkge1xuXHRcdFx0c2VsZWN0b3Iuc2VsZWN0Rm9jdXNlZCgpO1xuXG5cdFx0XHQvLyB0aGlzLmNsZWFyKCk7XG5cdFx0XHR0aGlzLm9iamVjdCA9IHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0KCk7XG5cdFx0XHQvLyB0aGlzLnBvaW50ID0gcG9pbnQ7XG5cblx0XHR9LFxuXHRcdHJlbGVhc2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGVjdGVkT2JqZWN0ID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcblx0XHRcdC8vVE9ETzogdGhlcmUgaXMgbm8gc2VsZWN0ZWQgb2JqZWN0IGFmdGVyIHJlbW92ZSBmcm9tZSBzY2VuZVxuXHRcdFx0aWYodGhpcy5pc0Jvb2soKSAmJiAhc2VsZWN0ZWRPYmplY3QucGFyZW50KSB7XG5cdFx0XHRcdENvbnRyb2xzLlBvY2tldC5wdXQoc2VsZWN0ZWRPYmplY3QuZGF0YU9iamVjdCk7XG5cdFx0XHRcdHRoaXMuY2xlYXIoKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5zYXZlKCk7XG5cdFx0fSxcblx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYodGhpcy5pc0Jvb2soKSAmJiAhdGhpcy5pc0dldHRlZCgpKSB7XG5cdFx0XHRcdHRoaXMuZ2V0dGVkID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5wYXJlbnQgPSB0aGlzLm9iamVjdC5wYXJlbnQ7XG5cdFx0XHRcdHRoaXMub2JqZWN0LnBvc2l0aW9uLnNldCgwLCAwLCAtdGhpcy5vYmplY3QuZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnogLSAwLjI1KTtcblx0XHRcdFx0Q2FtZXJhLmNhbWVyYS5hZGQodGhpcy5vYmplY3QpO1x0XHRcdFxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5wdXQoKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHB1dDogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZih0aGlzLmlzR2V0dGVkKCkpIHtcblx0XHRcdFx0dGhpcy5wYXJlbnQuYWRkKHRoaXMub2JqZWN0KTtcblx0XHRcdFx0dGhpcy5vYmplY3QucmVsb2FkKCk7Ly9wb3NpdGlvblxuXHRcdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpc0dldHRlZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5pc0Jvb2soKSAmJiB0aGlzLmdldHRlZDtcblx0XHR9LFxuXHRcdHNhdmU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGVjdGVkT2JqZWN0ID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcblx0XHRcdGlmKHRoaXMuaXNNb3ZhYmxlKCkgJiYgc2VsZWN0ZWRPYmplY3QuY2hhbmdlZCkge1xuXHRcdFx0XHRzZWxlY3RlZE9iamVjdC5zYXZlKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdENvbnRyb2xzLmluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRDb250cm9scy5jbGVhcigpO1xuXHRcdENvbnRyb2xzLmluaXRMaXN0ZW5lcnMoKTtcblx0fTtcblxuXHRDb250cm9scy5pbml0TGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBDb250cm9scy5vbkRibENsaWNrLCBmYWxzZSk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgQ29udHJvbHMub25Nb3VzZURvd24sIGZhbHNlKTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgQ29udHJvbHMub25Nb3VzZVVwLCBmYWxzZSk7XG5cdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgQ29udHJvbHMub25Nb3VzZU1vdmUsIGZhbHNlKTtcdFxuXHRcdGRvY3VtZW50Lm9uY29udGV4dG1lbnUgPSBmdW5jdGlvbigpIHtyZXR1cm4gZmFsc2U7fVxuXHR9O1xuXG5cdENvbnRyb2xzLmNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdFx0Q29udHJvbHMuc2VsZWN0ZWQuY2xlYXIoKTtcdFxuXHR9O1xuXG5cdENvbnRyb2xzLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKCFDb250cm9scy5zZWxlY3RlZC5pc0dldHRlZCgpKSB7XG5cdFx0XHRpZihtb3VzZVszXSkge1xuXHRcdFx0XHRDYW1lcmEucm90YXRlKG1vdXNlLmxvbmdYLCBtb3VzZS5sb25nWSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKChtb3VzZVsxXSAmJiBtb3VzZVszXSkgfHwgbmF2aWdhdGlvbi5zdGF0ZS5mb3J3YXJkKSB7XG5cdFx0XHRcdENhbWVyYS5nbyh0aGlzLkJVVFRPTlNfR09fU1BFRUQpO1xuXHRcdFx0fSBlbHNlIGlmKG5hdmlnYXRpb24uc3RhdGUuYmFja3dhcmQpIHtcblx0XHRcdFx0Q2FtZXJhLmdvKC10aGlzLkJVVFRPTlNfR09fU1BFRUQpO1xuXHRcdFx0fSBlbHNlIGlmKG5hdmlnYXRpb24uc3RhdGUubGVmdCkge1xuXHRcdFx0XHRDYW1lcmEucm90YXRlKHRoaXMuQlVUVE9OU19ST1RBVEVfU1BFRUQsIDApO1xuXHRcdFx0fSBlbHNlIGlmKG5hdmlnYXRpb24uc3RhdGUucmlnaHQpIHtcblx0XHRcdFx0Q2FtZXJhLnJvdGF0ZSgtdGhpcy5CVVRUT05TX1JPVEFURV9TUEVFRCwgMCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdC8vIEV2ZW50c1xuXG5cdENvbnRyb2xzLm9uRGJsQ2xpY2sgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmKG1vdXNlLmlzQ2FudmFzKCkpIHtcblx0XHRcdHN3aXRjaChldmVudC53aGljaCkge1xuXHRcdFx0XHRjYXNlIDE6IENvbnRyb2xzLnNlbGVjdGVkLmdldCgpOyBicmVhaztcblx0XHRcdH0gICBcdFxuXHRcdH1cblx0fTtcblxuXHRDb250cm9scy5vbk1vdXNlRG93biA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0bW91c2UuZG93bihldmVudCk7IFxuXG5cdFx0aWYobW91c2UuaXNDYW52YXMoKSB8fCBtb3VzZS5pc1BvY2tldEJvb2soKSkge1xuXHRcdFx0Ly8gZXZlbnQucHJldmVudERlZmF1bHQoKTsvL1RPRE86IHJlc2VhcmNoIChlbmFibGVkIGNhbm5vdCBzZXQgY3Vyc29yIHRvIGlucHV0KVxuXG5cdFx0XHRpZihtb3VzZVsxXSAmJiAhbW91c2VbM10gJiYgIUNvbnRyb2xzLnNlbGVjdGVkLmlzR2V0dGVkKCkpIHtcblx0XHRcdFx0aWYobW91c2UuaXNDYW52YXMoKSkge1xuXHRcdFx0XHRcdENvbnRyb2xzLnNlbGVjdE9iamVjdCgpO1xuXHRcdFx0XHRcdENvbnRyb2xzLnNlbGVjdGVkLnNlbGVjdCgpO1xuXHRcdFx0XHR9IGVsc2UgaWYobW91c2UuaXNQb2NrZXRCb29rKCkpIHtcblx0XHRcdFx0XHRDb250cm9scy5Qb2NrZXQuc2VsZWN0T2JqZWN0KG1vdXNlLnRhcmdldCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Q29udHJvbHMub25Nb3VzZVVwID0gZnVuY3Rpb24oZXZlbnQpIHtcblx0XHRtb3VzZS51cChldmVudCk7XG5cdFx0XG5cdFx0c3dpdGNoKGV2ZW50LndoaWNoKSB7XG5cdFx0XHQgY2FzZSAxOiBDb250cm9scy5zZWxlY3RlZC5yZWxlYXNlKCk7IGJyZWFrO1xuXHRcdH1cblx0fTtcblxuXHRDb250cm9scy5vbk1vdXNlTW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0bW91c2UubW92ZShldmVudCk7XG5cblx0XHRpZihtb3VzZS5pc0NhbnZhcygpKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0IFx0aWYoIUNvbnRyb2xzLnNlbGVjdGVkLmlzR2V0dGVkKCkpIHtcblx0XHRcdFx0aWYobW91c2VbMV0gJiYgIW1vdXNlWzNdKSB7XHRcdFxuXHRcdFx0XHRcdENvbnRyb2xzLm1vdmVPYmplY3QoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRDb250cm9scy5zZWxlY3RPYmplY3QoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gdmFyIG9iaiA9IENvbnRyb2xzLnNlbGVjdGVkLm9iamVjdDtcblxuXHRcdFx0XHQvLyBpZihvYmogaW5zdGFuY2VvZiBCb29rT2JqZWN0KSB7XG5cdFx0XHRcdC8vIFx0aWYobW91c2VbMV0pIHtcblx0XHRcdFx0Ly8gXHRcdG9iai5tb3ZlRWxlbWVudChtb3VzZS5kWCwgbW91c2UuZFksIFVJLm1lbnUuY3JlYXRlQm9vay5lZGl0ZWQpO1xuXHRcdFx0XHQvLyBcdH1cblx0XHRcdFx0Ly8gXHRpZihtb3VzZVsyXSAmJiBVSS5tZW51LmNyZWF0ZUJvb2suZWRpdGVkID09ICdjb3ZlcicpIHtcblx0XHRcdFx0Ly8gIFx0XHRvYmouc2NhbGVFbGVtZW50KG1vdXNlLmRYLCBtb3VzZS5kWSk7XG5cdFx0XHRcdC8vIFx0fVxuXHRcdFx0XHQvLyBcdGlmKG1vdXNlWzNdKSB7XG5cdFx0XHRcdC8vICBcdFx0b2JqLnJvdGF0ZShtb3VzZS5kWCwgbW91c2UuZFksIHRydWUpO1xuXHRcdFx0XHQvLyBcdH1cblx0XHRcdFx0Ly8gfSBcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly8qKioqXG5cblx0Q29udHJvbHMuc2VsZWN0T2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyXG5cdFx0XHRpbnRlcnNlY3RlZCxcblx0XHRcdG9iamVjdDtcblxuXHRcdGlmKG1vdXNlLmlzQ2FudmFzKCkgJiYgZW52aXJvbm1lbnQubGlicmFyeSkge1xuXHRcdFx0Ly9UT0RPOiBvcHRpbWl6ZVxuXHRcdFx0aW50ZXJzZWN0ZWQgPSBtb3VzZS5nZXRJbnRlcnNlY3RlZChlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCB0cnVlLCBbQm9va09iamVjdF0pO1xuXHRcdFx0aWYoIWludGVyc2VjdGVkKSB7XG5cdFx0XHRcdGludGVyc2VjdGVkID0gbW91c2UuZ2V0SW50ZXJzZWN0ZWQoZW52aXJvbm1lbnQubGlicmFyeS5jaGlsZHJlbiwgdHJ1ZSwgW1NoZWxmT2JqZWN0XSk7XG5cdFx0XHR9XG5cdFx0XHRpZighaW50ZXJzZWN0ZWQpIHtcblx0XHRcdFx0aW50ZXJzZWN0ZWQgPSBtb3VzZS5nZXRJbnRlcnNlY3RlZChlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCB0cnVlLCBbU2VjdGlvbk9iamVjdF0pO1xuXHRcdFx0fVxuXHRcdFx0aWYoaW50ZXJzZWN0ZWQpIHtcblx0XHRcdFx0b2JqZWN0ID0gaW50ZXJzZWN0ZWQub2JqZWN0O1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxlY3Rvci5mb2N1cyhuZXcgU2VsZWN0b3JNZXRhKG9iamVjdCkpO1xuXHRcdH1cblx0fTtcblxuXHRDb250cm9scy5tb3ZlT2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIFxuXHRcdFx0bW91c2VWZWN0b3IsXG5cdFx0XHRuZXdQb3NpdGlvbixcblx0XHRcdGludGVyc2VjdGVkLFxuXHRcdFx0cGFyZW50LFxuXHRcdFx0b2xkUGFyZW50O1xuXHRcdHZhciBzZWxlY3RlZE9iamVjdDtcblxuXHRcdGlmKENvbnRyb2xzLnNlbGVjdGVkLmlzQm9vaygpIHx8IChDb250cm9scy5zZWxlY3RlZC5pc1NlY3Rpb24oKS8qICYmIFVJLm1lbnUuc2VjdGlvbk1lbnUuaXNNb3ZlT3B0aW9uKCkqLykpIHtcblx0XHRcdHNlbGVjdGVkT2JqZWN0ID0gc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcblx0XHRcdG1vdXNlVmVjdG9yID0gQ2FtZXJhLmdldFZlY3RvcigpO1x0XG5cblx0XHRcdG5ld1Bvc2l0aW9uID0gc2VsZWN0ZWRPYmplY3QucG9zaXRpb24uY2xvbmUoKTtcblx0XHRcdG9sZFBhcmVudCA9IHNlbGVjdGVkT2JqZWN0LnBhcmVudDtcblxuXHRcdFx0aWYoQ29udHJvbHMuc2VsZWN0ZWQuaXNCb29rKCkpIHtcblx0XHRcdFx0aW50ZXJzZWN0ZWQgPSBtb3VzZS5nZXRJbnRlcnNlY3RlZChlbnZpcm9ubWVudC5saWJyYXJ5LmNoaWxkcmVuLCB0cnVlLCBbU2hlbGZPYmplY3RdKTtcblx0XHRcdFx0c2VsZWN0ZWRPYmplY3Quc2V0UGFyZW50KGludGVyc2VjdGVkID8gaW50ZXJzZWN0ZWQub2JqZWN0IDogbnVsbCk7XG5cdFx0XHR9XG5cblx0XHRcdHBhcmVudCA9IHNlbGVjdGVkT2JqZWN0LnBhcmVudDtcblx0XHRcdGlmKHBhcmVudCkge1xuXHRcdFx0XHRwYXJlbnQubG9jYWxUb1dvcmxkKG5ld1Bvc2l0aW9uKTtcblxuXHRcdFx0XHRuZXdQb3NpdGlvbi54IC09IChtb3VzZVZlY3Rvci56ICogbW91c2UuZFggKyBtb3VzZVZlY3Rvci54ICogbW91c2UuZFkpICogMC4wMDM7XG5cdFx0XHRcdG5ld1Bvc2l0aW9uLnogLT0gKC1tb3VzZVZlY3Rvci54ICogbW91c2UuZFggKyBtb3VzZVZlY3Rvci56ICogbW91c2UuZFkpICogMC4wMDM7XG5cblx0XHRcdFx0cGFyZW50LndvcmxkVG9Mb2NhbChuZXdQb3NpdGlvbik7XG5cdFx0XHRcdGlmKCFzZWxlY3RlZE9iamVjdC5tb3ZlKG5ld1Bvc2l0aW9uKSAmJiBDb250cm9scy5zZWxlY3RlZC5pc0Jvb2soKSkge1xuXHRcdFx0XHRcdGlmKHBhcmVudCAhPT0gb2xkUGFyZW50KSB7XG5cdFx0XHRcdFx0XHRzZWxlY3RlZE9iamVjdC5zZXRQYXJlbnQob2xkUGFyZW50KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LyogZWxzZSBpZihVSS5tZW51LnNlY3Rpb25NZW51LmlzUm90YXRlT3B0aW9uKCkgJiYgQ29udHJvbHMuc2VsZWN0ZWQuaXNTZWN0aW9uKCkpIHtcblx0XHRcdENvbnRyb2xzLnNlbGVjdGVkLm9iamVjdC5yb3RhdGUoQ29udHJvbHMubW91c2UuZFgpO1x0XHRcdFxuXHRcdH0qL1xuXHR9O1xuXG5cdHJldHVybiBDb250cm9scztcdFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0RhdGEnLCBmdW5jdGlvbiAoJGh0dHAsICRxKSB7XG5cdHZhciBEYXRhID0ge307XG5cblx0RGF0YS5URVhUVVJFX1JFU09MVVRJT04gPSA1MTI7XG5cdERhdGEuQ09WRVJfTUFYX1kgPSAzOTQ7XG5cdERhdGEuQ09WRVJfRkFDRV9YID0gMjk2O1xuXG4gICAgRGF0YS5sb2FkSW1hZ2UgPSBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgdmFyIGRlZmZlcmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICBcbiAgICAgICAgaW1nLmNyb3NzT3JpZ2luID0gJyc7IFxuICAgICAgICBpbWcuc3JjID0gdXJsO1xuICAgICAgICBcbiAgICAgICAgaWYoaW1nLmNvbXBsZXRlKSB7XG4gICAgICAgICAgICBkZWZmZXJlZC5yZXNvbHZlKGltZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGVmZmVyZWQucmVzb2x2ZShpbWcpO1xuICAgICAgICB9O1xuICAgICAgICBpbWcub25lcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgZGVmZmVyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZGVmZmVyZWQucHJvbWlzZTsgXG4gICAgfTtcblxuICAgIERhdGEubG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgXHRyZXR1cm4gJGh0dHAucG9zdCgnL2F1dGgvbG9nb3V0Jyk7XG4gICAgfTtcblxuXHREYXRhLmdldFVzZXIgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvdXNlcicpO1xuXHR9O1xuXG5cdERhdGEuZ2V0VXNlckJvb2tzID0gZnVuY3Rpb24odXNlcklkKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2ZyZWVCb29rcy8nICsgdXNlcklkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdHJldHVybiByZXMuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHREYXRhLnBvc3RCb29rID0gZnVuY3Rpb24oYm9vaykge1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYm9vaycsIGJvb2spO1xuXHR9O1xuXG5cdERhdGEuZGVsZXRlQm9vayA9IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRyZXR1cm4gJGh0dHAoe1xuXHRcdFx0bWV0aG9kOiAnREVMRVRFJyxcblx0XHRcdHVybDogJy9ib29rJyxcblx0XHRcdGRhdGE6IGJvb2ssXG5cdFx0XHRoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnfVxuXHRcdH0pO1xuXHR9O1xuXG5cdERhdGEuZ2V0VUlEYXRhID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL29iai9kYXRhLmpzb24nKTtcblx0fTtcblxuXHREYXRhLmdldExpYnJhcmllcyA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9saWJyYXJpZXMnKTtcblx0fTtcblxuXHREYXRhLmdldExpYnJhcnkgPSBmdW5jdGlvbihsaWJyYXJ5SWQpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvbGlicmFyeS8nICsgbGlicmFyeUlkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdHJldHVybiByZXMuZGF0YTtcblx0XHR9KTtcblx0fTtcblxuXHREYXRhLnBvc3RMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeU1vZGVsKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvbGlicmFyeS8nICsgbGlicmFyeU1vZGVsKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfSk7XG5cdH07XG5cblx0RGF0YS5nZXRTZWN0aW9ucyA9IGZ1bmN0aW9uKGxpYnJhcnlJZCkge1xuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvc2VjdGlvbnMvJyArIGxpYnJhcnlJZCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH0pO1xuXHR9O1xuXG5cdERhdGEucG9zdFNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uRGF0YSkge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL3NlY3Rpb24nLCBzZWN0aW9uRGF0YSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIFx0cmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9KTtcblx0fTtcblxuXHREYXRhLmdldEJvb2tzID0gZnVuY3Rpb24oc2VjdGlvbklkKSB7XG5cdFx0Ly9UT0RPOiB1c2VySWRcbiAgICAgICAgcmV0dXJuICRodHRwLmdldCgnL2Jvb2tzLycgKyBzZWN0aW9uSWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9KTtcblx0fTtcblxuXHREYXRhLmxvYWRHZW9tZXRyeSA9IGZ1bmN0aW9uKGxpbmspIHtcbiAgICAgICAgdmFyIGRlZmZlcmVkID0gJHEuZGVmZXIoKTtcblx0XHR2YXIganNvbkxvYWRlciA9IG5ldyBUSFJFRS5KU09OTG9hZGVyKCk7XG5cbiAgICAgICAgLy9UT0RPOiBmb3VuZCBubyB3YXkgdG8gcmVqZWN0XG5cdFx0anNvbkxvYWRlci5sb2FkKGxpbmssIGZ1bmN0aW9uIChnZW9tZXRyeSkge1xuXHRcdFx0ZGVmZmVyZWQucmVzb2x2ZShnZW9tZXRyeSk7XG5cdFx0fSk7XG5cbiAgICAgICAgcmV0dXJuIGRlZmZlcmVkLnByb21pc2U7XG5cdH07XG5cblx0RGF0YS5nZXREYXRhID0gZnVuY3Rpb24odXJsKSB7XG4gICAgICAgIHJldHVybiAkaHR0cC5nZXQodXJsKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YVxuICAgICAgICB9KTtcblx0fTtcblxuXHREYXRhLnBvc3RGZWVkYmFjayA9IGZ1bmN0aW9uKGR0bykge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2ZlZWRiYWNrJywgZHRvKTtcblx0fTtcblxuXHRyZXR1cm4gRGF0YTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdlbnZpcm9ubWVudCcsIGZ1bmN0aW9uICgkcSwgJGxvZywgTGlicmFyeU9iamVjdCwgU2VjdGlvbk9iamVjdCwgQm9va09iamVjdCwgRGF0YSwgQ2FtZXJhLCBjYWNoZSkge1xuXHR2YXIgZW52aXJvbm1lbnQgPSB7fTtcblxuXHRlbnZpcm9ubWVudC5DTEVBUkFOQ0UgPSAwLjAwMTtcblx0IFxuXHR2YXIgbGlicmFyeUR0byA9IG51bGw7XG5cdHZhciBzZWN0aW9ucyA9IG51bGw7XG5cdHZhciBib29rcyA9IG51bGw7XG5cblx0ZW52aXJvbm1lbnQuc2NlbmUgPSBudWxsO1xuXHRlbnZpcm9ubWVudC5saWJyYXJ5ID0gbnVsbDtcblxuXHRlbnZpcm9ubWVudC5sb2FkTGlicmFyeSA9IGZ1bmN0aW9uKGxpYnJhcnlJZCkge1xuXHRcdGNsZWFyU2NlbmUoKTsgLy8gaW5pdHMgc29tZSBmaWVsZHNcblxuXHRcdHZhciBwcm9taXNlID0gRGF0YS5nZXRMaWJyYXJ5KGxpYnJhcnlJZCkudGhlbihmdW5jdGlvbiAoZHRvKSB7XG5cdFx0XHR2YXIgZGljdCA9IHBhcnNlTGlicmFyeUR0byhkdG8pO1xuXHRcdFx0XG5cdFx0XHRzZWN0aW9ucyA9IGRpY3Quc2VjdGlvbnM7XG5cdFx0XHRib29rcyA9IGRpY3QuYm9va3M7XG5cdFx0XHRsaWJyYXJ5RHRvID0gZHRvO1xuXG5cdFx0XHRyZXR1cm4gaW5pdENhY2hlKGxpYnJhcnlEdG8sIGRpY3Quc2VjdGlvbnMsIGRpY3QuYm9va3MpO1xuXHRcdH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0Y3JlYXRlTGlicmFyeShsaWJyYXJ5RHRvKTtcblx0XHRcdHJldHVybiBjcmVhdGVTZWN0aW9ucyhzZWN0aW9ucyk7XG5cdFx0fSkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gY3JlYXRlQm9va3MoYm9va3MpO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0ZW52aXJvbm1lbnQuZ2V0Qm9vayA9IGZ1bmN0aW9uKGJvb2tJZCkge1xuXHRcdHJldHVybiBnZXREaWN0T2JqZWN0KGJvb2tzLCBib29rSWQpO1xuXHR9O1xuXG5cdGVudmlyb25tZW50LmdldFNlY3Rpb24gPSBmdW5jdGlvbihzZWN0aW9uSWQpIHtcblx0XHRyZXR1cm4gZ2V0RGljdE9iamVjdChzZWN0aW9ucywgc2VjdGlvbklkKTtcblx0fTtcblxuXHRlbnZpcm9ubWVudC5nZXRTaGVsZiA9IGZ1bmN0aW9uKHNlY3Rpb25JZCwgc2hlbGZJZCkge1xuXHRcdHZhciBzZWN0aW9uID0gZW52aXJvbm1lbnQuZ2V0U2VjdGlvbihzZWN0aW9uSWQpO1xuXHRcdHZhciBzaGVsZiA9IHNlY3Rpb24gJiYgc2VjdGlvbi5zaGVsdmVzW3NoZWxmSWRdO1xuXG5cdFx0cmV0dXJuIHNoZWxmO1xuXHR9O1xuXG5cdHZhciBnZXREaWN0T2JqZWN0ID0gZnVuY3Rpb24oZGljdCwgb2JqZWN0SWQpIHtcblx0XHR2YXIgZGljdEl0ZW0gPSBkaWN0W29iamVjdElkXTtcblx0XHR2YXIgZGljdE9iamVjdCA9IGRpY3RJdGVtICYmIGRpY3RJdGVtLm9iajtcblxuXHRcdHJldHVybiBkaWN0T2JqZWN0O1xuXHR9O1xuXG5cdGVudmlyb25tZW50LnVwZGF0ZVNlY3Rpb24gPSBmdW5jdGlvbihkdG8pIHtcblx0XHRpZihkdG8ubGlicmFyeUlkID09IGVudmlyb25tZW50LmxpYnJhcnkuaWQpIHtcblx0XHRcdHJlbW92ZU9iamVjdChzZWN0aW9ucywgZHRvLmlkKTtcblx0XHRcdGNyZWF0ZVNlY3Rpb24oZHRvKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlT2JqZWN0KHNlY3Rpb25zLCBkdG8uaWQpO1xuXHRcdH1cdFxuXHR9O1xuXG5cdGVudmlyb25tZW50LnVwZGF0ZUJvb2sgPSBmdW5jdGlvbihkdG8pIHtcblx0XHR2YXIgc2hlbGYgPSBnZXRCb29rU2hlbGYoZHRvKTtcblxuXHRcdGlmKHNoZWxmKSB7XG5cdFx0XHRyZW1vdmVPYmplY3QoYm9va3MsIGR0by5pZCk7XG5cdFx0XHRjcmVhdGVCb29rKGR0byk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZU9iamVjdChib29rcywgZHRvLmlkKTtcblx0XHR9XG5cdH07XG5cblx0ZW52aXJvbm1lbnQucmVtb3ZlQm9vayA9IGZ1bmN0aW9uKGJvb2tEdG8pIHtcblx0XHRyZW1vdmVPYmplY3QoYm9va3MsIGJvb2tEdG8uaWQpO1xuXHR9O1xuXG5cdHZhciByZW1vdmVPYmplY3QgPSBmdW5jdGlvbihkaWN0LCBrZXkpIHtcblx0XHR2YXIgZGljdEl0ZW0gPSBkaWN0W2tleV07XG5cdFx0aWYoZGljdEl0ZW0pIHtcblx0XHRcdGRlbGV0ZSBkaWN0W2tleV07XG5cdFx0XHRcblx0XHRcdGlmKGRpY3RJdGVtLm9iaikge1xuXHRcdFx0XHRkaWN0SXRlbS5vYmouc2V0UGFyZW50KG51bGwpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHR2YXIgaW5pdENhY2hlID0gZnVuY3Rpb24obGlicmFyeUR0bywgc2VjdGlvbnNEaWN0LCBib29rc0RpY3QpIHtcblx0XHR2YXIgbGlicmFyeU1vZGVsID0gbGlicmFyeUR0by5tb2RlbDtcblx0XHR2YXIgc2VjdGlvbk1vZGVscyA9IHt9O1xuXHRcdHZhciBib29rTW9kZWxzID0ge307XG5cdFx0dmFyIGltYWdlVXJscyA9IHt9O1xuXG5cdFx0Zm9yICh2YXIgc2VjdGlvbklkIGluIHNlY3Rpb25zRGljdCkge1xuXHRcdFx0dmFyIHNlY3Rpb25EdG8gPSBzZWN0aW9uc0RpY3Rbc2VjdGlvbklkXS5kdG87XG5cdFx0XHRzZWN0aW9uTW9kZWxzW3NlY3Rpb25EdG8ubW9kZWxdID0gdHJ1ZTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBib29rSWQgaW4gYm9va3NEaWN0KSB7XG5cdFx0XHR2YXIgYm9va0R0byA9IGJvb2tzRGljdFtib29rSWRdLmR0bztcblx0XHRcdGJvb2tNb2RlbHNbYm9va0R0by5tb2RlbF0gPSB0cnVlO1xuXG5cdFx0XHRpZihib29rRHRvLmNvdmVyKSB7XG5cdFx0XHRcdGltYWdlVXJsc1tib29rRHRvLmNvdmVyXSA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNhY2hlLmluaXQobGlicmFyeU1vZGVsLCBzZWN0aW9uTW9kZWxzLCBib29rTW9kZWxzLCBpbWFnZVVybHMpO1xuXHR9O1xuXG5cdHZhciBjbGVhclNjZW5lID0gZnVuY3Rpb24oKSB7XG5cdFx0Ly8gQ29udHJvbHMuY2xlYXIoKTtcblx0XHRlbnZpcm9ubWVudC5saWJyYXJ5ID0gbnVsbDtcblx0XHRzZWN0aW9ucyA9IHt9O1xuXHRcdGJvb2tzID0ge307XG5cblx0XHR3aGlsZShlbnZpcm9ubWVudC5zY2VuZS5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHRpZihlbnZpcm9ubWVudC5zY2VuZS5jaGlsZHJlblswXS5kaXNwb3NlKSB7XG5cdFx0XHRcdGVudmlyb25tZW50LnNjZW5lLmNoaWxkcmVuWzBdLmRpc3Bvc2UoKTtcblx0XHRcdH1cblx0XHRcdGVudmlyb25tZW50LnNjZW5lLnJlbW92ZShlbnZpcm9ubWVudC5zY2VuZS5jaGlsZHJlblswXSk7XG5cdFx0fVxuXHR9O1xuXG5cdHZhciBwYXJzZUxpYnJhcnlEdG8gPSBmdW5jdGlvbihsaWJyYXJ5RHRvKSB7XG5cdFx0dmFyIHJlc3VsdCA9IHtcblx0XHRcdHNlY3Rpb25zOiB7fSxcblx0XHRcdGJvb2tzOiB7fVxuXHRcdH07XG5cblx0XHRmb3IodmFyIHNlY3Rpb25JbmRleCA9IGxpYnJhcnlEdG8uc2VjdGlvbnMubGVuZ3RoIC0gMTsgc2VjdGlvbkluZGV4ID49IDA7IHNlY3Rpb25JbmRleC0tKSB7XG5cdFx0XHR2YXIgc2VjdGlvbkR0byA9IGxpYnJhcnlEdG8uc2VjdGlvbnNbc2VjdGlvbkluZGV4XTtcblx0XHRcdHJlc3VsdC5zZWN0aW9uc1tzZWN0aW9uRHRvLmlkXSA9IHtkdG86IHNlY3Rpb25EdG99O1xuXG5cdFx0XHRmb3IodmFyIGJvb2tJbmRleCA9IHNlY3Rpb25EdG8uYm9va3MubGVuZ3RoIC0gMTsgYm9va0luZGV4ID49IDA7IGJvb2tJbmRleC0tKSB7XG5cdFx0XHRcdHZhciBib29rRHRvID0gc2VjdGlvbkR0by5ib29rc1tib29rSW5kZXhdO1xuXHRcdFx0XHRyZXN1bHQuYm9va3NbYm9va0R0by5pZF0gPSB7ZHRvOiBib29rRHRvfTtcblx0XHRcdH1cblxuXHRcdFx0ZGVsZXRlIHNlY3Rpb25EdG8uYm9va3M7XG5cdFx0fVxuXG5cdFx0ZGVsZXRlIGxpYnJhcnlEdG8uc2VjdGlvbnM7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHZhciBjcmVhdGVMaWJyYXJ5ID0gZnVuY3Rpb24obGlicmFyeUR0bykge1xuXHRcdHZhciBsaWJyYXJ5ID0gbnVsbDtcblx0XHR2YXIgbGlicmFyeUNhY2hlID0gY2FjaGUuZ2V0TGlicmFyeSgpO1xuICAgICAgICB2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGxpYnJhcnlDYWNoZS5tYXBJbWFnZSk7XG4gICAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7bWFwOiB0ZXh0dXJlfSk7XG5cbiAgICAgICAgdGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cdFx0bGlicmFyeSA9IG5ldyBMaWJyYXJ5T2JqZWN0KGxpYnJhcnlEdG8sIGxpYnJhcnlDYWNoZS5nZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXHRcdENhbWVyYS5zZXRQYXJlbnQobGlicmFyeSk7XG5cblx0XHRlbnZpcm9ubWVudC5zY2VuZS5hZGQobGlicmFyeSk7XG5cdFx0ZW52aXJvbm1lbnQubGlicmFyeSA9IGxpYnJhcnk7XG5cdH07XG5cblx0dmFyIGNyZWF0ZVNlY3Rpb25zID0gZnVuY3Rpb24oc2VjdGlvbnNEaWN0KSB7XG5cdFx0dmFyIHJlc3VsdHMgPSBbXTtcblx0XHR2YXIga2V5O1xuXG5cdFx0Zm9yKGtleSBpbiBzZWN0aW9uc0RpY3QpIHtcblx0XHRcdHJlc3VsdHMucHVzaChjcmVhdGVTZWN0aW9uKHNlY3Rpb25zRGljdFtrZXldLmR0bykpO1x0XHRcblx0XHR9XG5cblx0XHRyZXR1cm4gJHEuYWxsKHJlc3VsdHMpO1xuXHR9O1xuXG5cdHZhciBjcmVhdGVTZWN0aW9uID0gZnVuY3Rpb24oc2VjdGlvbkR0bykge1xuXHRcdHZhciBwcm9taXNlID0gY2FjaGUuZ2V0U2VjdGlvbihzZWN0aW9uRHRvLm1vZGVsKS50aGVuKGZ1bmN0aW9uIChzZWN0aW9uQ2FjaGUpIHtcblx0ICAgICAgICB2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKHNlY3Rpb25DYWNoZS5tYXBJbWFnZSk7XG5cdCAgICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHttYXA6IHRleHR1cmV9KTtcblx0ICAgICAgICB2YXIgc2VjdGlvbjtcblxuXHQgICAgICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xuXHQgICAgICAgIHNlY3Rpb25EdG8uZGF0YSA9IHNlY3Rpb25DYWNoZS5kYXRhO1xuXG5cdCAgICAgICAgc2VjdGlvbiA9IG5ldyBTZWN0aW9uT2JqZWN0KHNlY3Rpb25EdG8sIHNlY3Rpb25DYWNoZS5nZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG5cdFx0XHRlbnZpcm9ubWVudC5saWJyYXJ5LmFkZChzZWN0aW9uKTtcblx0XHRcdGFkZFRvRGljdChzZWN0aW9ucywgc2VjdGlvbik7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXHQvLyBUT0RPOiBtZXJnZSB3aXRoIGNyZWF0ZVNlY3Rpb25zXG5cdHZhciBjcmVhdGVCb29rcyA9IGZ1bmN0aW9uKGJvb2tzRGljdCkge1xuXHRcdHZhciByZXN1bHRzID0gW107XG5cdFx0dmFyIGtleTtcblxuXHRcdGZvcihrZXkgaW4gYm9va3NEaWN0KSB7XG5cdFx0XHRyZXN1bHRzLnB1c2goY3JlYXRlQm9vayhib29rc0RpY3Rba2V5XS5kdG8pKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gJHEuYWxsKHJlc3VsdHMpO1xuXHR9O1xuXG5cdHZhciBjcmVhdGVCb29rID0gZnVuY3Rpb24oYm9va0R0bykge1xuXHRcdHZhciBwcm9taXNlcyA9IHt9O1xuXHRcdHZhciBwcm9taXNlO1xuXG5cdFx0cHJvbWlzZXMuYm9va0NhY2hlID0gY2FjaGUuZ2V0Qm9vayhib29rRHRvLm1vZGVsKTtcblx0XHRpZihib29rRHRvLmNvdmVyKSB7XG5cdFx0XHRwcm9taXNlcy5jb3ZlckNhY2hlID0gY2FjaGUuZ2V0SW1hZ2UoYm9va0R0by5jb3Zlcik7XG5cdFx0fVxuXG5cdFx0cHJvbWlzZSA9ICRxLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbiAocmVzdWx0cykge1xuXHRcdFx0dmFyIGJvb2tDYWNoZSA9IHJlc3VsdHMuYm9va0NhY2hlO1xuXHRcdFx0dmFyIGNvdmVySW1hZ2UgPSByZXN1bHRzLmNvdmVyQ2FjaGU7XG5cdFx0XHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG5cblx0XHRcdGNhbnZhcy53aWR0aCA9IGNhbnZhcy5oZWlnaHQgPSBEYXRhLlRFWFRVUkVfUkVTT0xVVElPTjtcblx0XHRcdHZhciB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoY2FudmFzKTtcblx0XHQgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHttYXA6IHRleHR1cmV9KTtcblxuXHRcdFx0dmFyIGJvb2sgPSBuZXcgQm9va09iamVjdChib29rRHRvLCBib29rQ2FjaGUuZ2VvbWV0cnksIG1hdGVyaWFsLCBib29rQ2FjaGUubWFwSW1hZ2UsIGNvdmVySW1hZ2UpO1xuXG5cdFx0XHRhZGRUb0RpY3QoYm9va3MsIGJvb2spO1xuXHRcdFx0cGxhY2VCb29rT25TaGVsZihib29rKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBhZGRUb0RpY3QgPSBmdW5jdGlvbihkaWN0LCBvYmopIHtcblx0XHR2YXIgZGljdEl0ZW0gPSB7XG5cdFx0XHRkdG86IG9iai5kYXRhT2JqZWN0LFxuXHRcdFx0b2JqOiBvYmpcblx0XHR9O1xuXG5cdFx0ZGljdFtvYmouaWRdID0gZGljdEl0ZW07XG5cdH07XG5cblx0dmFyIGdldEJvb2tTaGVsZiA9IGZ1bmN0aW9uKGJvb2tEdG8pIHtcblx0XHRyZXR1cm4gZW52aXJvbm1lbnQuZ2V0U2hlbGYoYm9va0R0by5zZWN0aW9uSWQsIGJvb2tEdG8uc2hlbGZJZCk7XG5cdH07XG5cblx0dmFyIHBsYWNlQm9va09uU2hlbGYgPSBmdW5jdGlvbihib29rKSB7XG5cdFx0dmFyIHNoZWxmID0gZ2V0Qm9va1NoZWxmKGJvb2suZGF0YU9iamVjdCk7XG5cdFx0c2hlbGYuYWRkKGJvb2spO1xuXHR9O1xuXG5cdHJldHVybiBlbnZpcm9ubWVudDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdNYWluJywgZnVuY3Rpb24gKCRsb2csIERhdGEsIENhbWVyYSwgTGlicmFyeU9iamVjdCwgQ29udHJvbHMsIFVzZXIsIFVJLCBlbnZpcm9ubWVudCkge1xuXHR2YXIgU1RBVFNfQ09OVEFJTkVSX0lEID0gJ3N0YXRzJztcblx0dmFyIExJQlJBUllfQ0FOVkFTX0lEID0gJ0xJQlJBUlknO1xuXHRcblx0dmFyIGNhbnZhcztcblx0dmFyIHJlbmRlcmVyO1xuXHR2YXIgc3RhdHM7XG5cdFxuXHR2YXIgTWFpbiA9IHt9O1xuXG5cdE1haW4uc3RhcnQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR2YXIgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG5cdFx0aWYoIURldGVjdG9yLndlYmdsKSB7XG5cdFx0XHREZXRlY3Rvci5hZGRHZXRXZWJHTE1lc3NhZ2UoKTtcblx0XHR9XG5cblx0XHRpbml0KHdpZHRoLCBoZWlnaHQpO1xuXHRcdENhbWVyYS5pbml0KHdpZHRoLCBoZWlnaHQpO1xuXHRcdENvbnRyb2xzLmluaXQoKTtcblxuXHRcdHN0YXJ0UmVuZGVyTG9vcCgpO1xuXG5cdFx0VXNlci5sb2FkKCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRyZXR1cm4gZW52aXJvbm1lbnQubG9hZExpYnJhcnkoVXNlci5nZXRMaWJyYXJ5KCkgfHwgMSkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFVJLmluaXQoKTtcblx0XHRcdH0pO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuXHRcdFx0JGxvZy5lcnJvcihlcnJvcik7XG5cdFx0XHQvL1RPRE86IHNob3cgZXJyb3IgbWVzc2FnZSAgXG5cdFx0fSk7XHRcdFxuXHR9O1xuXG5cdHZhciBpbml0ID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuXHRcdHZhciBzdGF0c0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFNUQVRTX0NPTlRBSU5FUl9JRCk7XG5cblx0XHRzdGF0cyA9IG5ldyBTdGF0cygpO1xuXHRcdHN0YXRzQ29udGFpbmVyLmFwcGVuZENoaWxkKHN0YXRzLmRvbUVsZW1lbnQpO1xuXG5cdFx0Y2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoTElCUkFSWV9DQU5WQVNfSUQpO1xuXHRcdHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe2NhbnZhczogY2FudmFzfSk7XG5cdFx0cmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcblxuXHRcdGVudmlyb25tZW50LnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG5cdFx0ZW52aXJvbm1lbnQuc2NlbmUuZm9nID0gbmV3IFRIUkVFLkZvZygweDAwMDAwMCwgNCwgNyk7XG5cdH07XG5cblx0dmFyIHN0YXJ0UmVuZGVyTG9vcCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGFydFJlbmRlckxvb3ApO1xuXHRcdENvbnRyb2xzLnVwZGF0ZSgpO1xuXHRcdHJlbmRlcmVyLnJlbmRlcihlbnZpcm9ubWVudC5zY2VuZSwgQ2FtZXJhLmNhbWVyYSk7XG5cblx0XHRzdGF0cy51cGRhdGUoKTtcblx0fTtcblxuXHRyZXR1cm4gTWFpbjtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdtb3VzZScsIGZ1bmN0aW9uIChDYW1lcmEpIHtcblx0dmFyIG1vdXNlID0ge307XG5cblx0dmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cblx0dmFyIHggPSBudWxsO1xuXHR2YXIgeSA9IG51bGw7XG5cdFxuXHRtb3VzZS50YXJnZXQgPSBudWxsO1xuXHRtb3VzZS5kWCA9IG51bGw7XG5cdG1vdXNlLmRZID0gbnVsbDtcblx0bW91c2UubG9uZ1ggPSBudWxsO1xuXHRtb3VzZS5sb25nWSA9IG51bGw7XG5cblx0bW91c2UuZ2V0VGFyZ2V0ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMudGFyZ2V0O1xuXHR9O1xuXG5cdG1vdXNlLmRvd24gPSBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmKGV2ZW50KSB7XG5cdFx0XHR0aGlzW2V2ZW50LndoaWNoXSA9IHRydWU7XG5cdFx0XHR0aGlzLnRhcmdldCA9IGV2ZW50LnRhcmdldDtcblx0XHRcdHggPSBldmVudC54O1xuXHRcdFx0eSA9IGV2ZW50Lnk7XG5cdFx0XHRtb3VzZS5sb25nWCA9IHdpZHRoICogMC41IC0geDtcblx0XHRcdG1vdXNlLmxvbmdZID0gaGVpZ2h0ICogMC41IC0geTtcblx0XHR9XG5cdH07XG5cblx0bW91c2UudXAgPSBmdW5jdGlvbihldmVudCkge1xuXHRcdGlmKGV2ZW50KSB7XG5cdFx0XHR0aGlzW2V2ZW50LndoaWNoXSA9IGZhbHNlO1xuXHRcdFx0dGhpc1sxXSA9IGZhbHNlOyAvLyBsaW51eCBjaHJvbWUgYnVnIGZpeCAod2hlbiBib3RoIGtleXMgcmVsZWFzZSB0aGVuIGJvdGggZXZlbnQud2hpY2ggZXF1YWwgMylcblx0XHR9XG5cdH07XG5cblx0bW91c2UubW92ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cdFx0aWYoZXZlbnQpIHtcblx0XHRcdHRoaXMudGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuXHRcdFx0bW91c2UubG9uZ1ggPSB3aWR0aCAqIDAuNSAtIHg7XG5cdFx0XHRtb3VzZS5sb25nWSA9IGhlaWdodCAqIDAuNSAtIHk7XG5cdFx0XHRtb3VzZS5kWCA9IGV2ZW50LnggLSB4O1xuXHRcdFx0bW91c2UuZFkgPSBldmVudC55IC0geTtcblx0XHRcdHggPSBldmVudC54O1xuXHRcdFx0eSA9IGV2ZW50Lnk7XG5cdFx0fVxuXHR9O1xuXG5cdG1vdXNlLmlzQ2FudmFzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMudGFyZ2V0ICYmIHRoaXMudGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKCd1aScpID4gLTE7XG5cdH07XG5cblx0bW91c2UuaXNQb2NrZXRCb29rID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZhbHNlOyAvL1RPRE86IHN0dWJcblx0XHQvLyByZXR1cm4gISEodGhpcy50YXJnZXQgJiYgdGhpcy50YXJnZXQucGFyZW50Tm9kZSA9PSBVSS5tZW51LmludmVudG9yeS5ib29rcyk7XG5cdH07XG5cblx0bW91c2UuZ2V0SW50ZXJzZWN0ZWQgPSBmdW5jdGlvbihvYmplY3RzLCByZWN1cnNpdmUsIHNlYXJjaEZvcikge1xuXHRcdHZhclxuXHRcdFx0dmVjdG9yLFxuXHRcdFx0cmF5Y2FzdGVyLFxuXHRcdFx0aW50ZXJzZWN0cyxcblx0XHRcdGludGVyc2VjdGVkLFxuXHRcdFx0cmVzdWx0LFxuXHRcdFx0aSwgajtcblxuXHRcdHJlc3VsdCA9IG51bGw7XG5cdFx0dmVjdG9yID0gZ2V0VmVjdG9yKCk7XG5cdFx0cmF5Y2FzdGVyID0gbmV3IFRIUkVFLlJheWNhc3RlcihDYW1lcmEuZ2V0UG9zaXRpb24oKSwgdmVjdG9yKTtcblx0XHRpbnRlcnNlY3RzID0gcmF5Y2FzdGVyLmludGVyc2VjdE9iamVjdHMob2JqZWN0cywgcmVjdXJzaXZlKTtcblxuXHRcdGlmKHNlYXJjaEZvcikge1xuXHRcdFx0aWYoaW50ZXJzZWN0cy5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgaW50ZXJzZWN0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGludGVyc2VjdGVkID0gaW50ZXJzZWN0c1tpXTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRmb3IoaiA9IHNlYXJjaEZvci5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuXHRcdFx0XHRcdFx0aWYoaW50ZXJzZWN0ZWQub2JqZWN0IGluc3RhbmNlb2Ygc2VhcmNoRm9yW2pdKSB7XG5cdFx0XHRcdFx0XHRcdHJlc3VsdCA9IGludGVyc2VjdGVkO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZihyZXN1bHQpIHtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVx0XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0ID0gaW50ZXJzZWN0cztcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdHZhciBnZXRWZWN0b3IgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgcHJvamVjdG9yID0gbmV3IFRIUkVFLlByb2plY3RvcigpO1xuXHRcdHZhciB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygoeCAvIHdpZHRoKSAqIDIgLSAxLCAtICh5IC8gaGVpZ2h0KSAqIDIgKyAxLCAwLjUpO1xuXHRcdHByb2plY3Rvci51bnByb2plY3RWZWN0b3IodmVjdG9yLCBDYW1lcmEuY2FtZXJhKTtcblx0XG5cdFx0cmV0dXJuIHZlY3Rvci5zdWIoQ2FtZXJhLmdldFBvc2l0aW9uKCkpLm5vcm1hbGl6ZSgpO1xuXHR9O1xuXG5cdHJldHVybiBtb3VzZTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCduYXZpZ2F0aW9uJywgZnVuY3Rpb24gKCkge1xuXHR2YXIgbmF2aWdhdGlvbiA9IHtcblx0XHRzdGF0ZToge1xuXHRcdFx0Zm9yd2FyZDogZmFsc2UsXG5cdFx0XHRiYWNrd2FyZDogZmFsc2UsXG5cdFx0XHRsZWZ0OiBmYWxzZSxcblx0XHRcdHJpZ2h0OiBmYWxzZVx0XHRcdFxuXHRcdH1cblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvU3RvcCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc3RhdGUuZm9yd2FyZCA9IGZhbHNlO1xuXHRcdHRoaXMuc3RhdGUuYmFja3dhcmQgPSBmYWxzZTtcblx0XHR0aGlzLnN0YXRlLmxlZnQgPSBmYWxzZTtcblx0XHR0aGlzLnN0YXRlLnJpZ2h0ID0gZmFsc2U7XG5cdH07XG5cblx0bmF2aWdhdGlvbi5nb0ZvcndhcmQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnN0YXRlLmZvcndhcmQgPSB0cnVlO1xuXHR9O1xuXG5cdG5hdmlnYXRpb24uZ29CYWNrd2FyZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuc3RhdGUuYmFja3dhcmQgPSB0cnVlO1xuXHR9O1xuXG5cdG5hdmlnYXRpb24uZ29MZWZ0ID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5zdGF0ZS5sZWZ0ID0gdHJ1ZTtcblx0fTtcblxuXHRuYXZpZ2F0aW9uLmdvUmlnaHQgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnN0YXRlLnJpZ2h0ID0gdHJ1ZTtcblx0fTtcblxuXHRyZXR1cm4gbmF2aWdhdGlvbjtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdVSScsIGZ1bmN0aW9uICgkcSwgJGxvZywgJHdpbmRvdywgJGludGVydmFsLCBTZWxlY3Rvck1ldGEsIFVzZXIsIERhdGEsIENvbnRyb2xzLCBuYXZpZ2F0aW9uLCBlbnZpcm9ubWVudCwgbG9jYXRvciwgc2VsZWN0b3IsIGJsb2NrVUkpIHtcblx0dmFyIEJPT0tfSU1BR0VfVVJMID0gJy9vYmovYm9va3Mve21vZGVsfS9pbWcuanBnJztcblx0dmFyIFVJID0ge21lbnU6IHt9fTtcblxuXHRVSS5tZW51LnNlbGVjdExpYnJhcnkgPSB7XG5cdFx0bGlzdDogW10sXG5cblx0XHR1cGRhdGVMaXN0OiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBzY29wZSA9IHRoaXM7XG5cblx0XHQgICAgdmFyIHByb21pc2UgPSBEYXRhLmdldExpYnJhcmllcygpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHQgICAgICAgICAgICBzY29wZS5saXN0ID0gcmVzLmRhdGE7XG5cdCAgICBcdH0pO1xuXG5cdCAgICBcdHJldHVybiBwcm9taXNlO1xuXHRcdH0sXG5cblx0XHRnbzogZnVuY3Rpb24oaWQpIHtcblx0XHRcdGlkICYmICgkd2luZG93LmxvY2F0aW9uID0gJy8nICsgaWQpO1xuXHRcdH1cblx0fTtcblxuXHRVSS5tZW51LmNyZWF0ZUxpYnJhcnkgPSB7XG5cdFx0bGlzdDogW10sXG5cdFx0bW9kZWw6IG51bGwsXG5cblx0XHRnZXRJbWc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMubW9kZWwgPyAnL29iai9saWJyYXJpZXMve21vZGVsfS9pbWcuanBnJy5yZXBsYWNlKCd7bW9kZWx9JywgdGhpcy5tb2RlbCkgOiBudWxsO1xuXHRcdH0sXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmKHRoaXMubW9kZWwpIHtcblx0XHRcdFx0RGF0YS5wb3N0TGlicmFyeSh0aGlzLm1vZGVsKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcblx0XHRcdFx0XHRlbnZpcm9ubWVudC5sb2FkTGlicmFyeShyZXN1bHQuaWQpO1xuXHRcdFx0XHRcdFVJLm1lbnUuc2hvdyA9IG51bGw7IC8vIFRPRE86IGhpZGUgYWZ0ZXIgZ28gXG5cdFx0XHRcdFx0VUkubWVudS5zZWxlY3RMaWJyYXJ5LnVwZGF0ZUxpc3QoKTtcblx0XHRcdFx0XHQvL1RPRE86IGFkZCBsaWJyYXJ5IHdpdGhvdXQgcmVsb2FkXG5cdFx0XHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFx0XHQvL1RPRE86IHNob3cgYW4gZXJyb3Jcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVx0XHRcblx0fTtcblxuXHRVSS5tZW51LmNyZWF0ZVNlY3Rpb24gPSB7XG5cdFx0bGlzdDogW10sXG5cdFx0bW9kZWw6IG51bGwsXG5cdFx0XG5cdFx0Z2V0SW1nOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLm1vZGVsID8gJy9vYmovc2VjdGlvbnMve21vZGVsfS9pbWcuanBnJy5yZXBsYWNlKCd7bW9kZWx9JywgdGhpcy5tb2RlbCkgOiBudWxsO1xuXHRcdH0sXG5cblx0XHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYodGhpcy5tb2RlbCkge1xuXHRcdFx0XHR2YXIgc2VjdGlvbkRhdGEgPSB7XG5cdFx0XHRcdFx0bW9kZWw6IHRoaXMubW9kZWwsXG5cdFx0XHRcdFx0bGlicmFyeUlkOiBlbnZpcm9ubWVudC5saWJyYXJ5LmlkLFxuXHRcdFx0XHRcdHVzZXJJZDogVXNlci5nZXRJZCgpXG5cdFx0XHRcdH07XG5cblx0XHRcdFx0dGhpcy5wbGFjZShzZWN0aW9uRGF0YSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHBsYWNlOiBmdW5jdGlvbihkdG8pIHtcblx0XHRcdC8vVE9ETzogYmxvY2tcblx0XHRcdGxvY2F0b3IucGxhY2VTZWN0aW9uKGR0bykuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0XHRcdC8vVE9ETzogc2hvdyBhbiBlcnJvclxuXHRcdFx0XHQkbG9nLmVycm9yKGVycm9yKTtcblx0XHRcdH0pO1x0XG5cdFx0fVxuXHR9O1xuXG5cdFVJLm1lbnUuZmVlZGJhY2sgPSB7XG5cdFx0bWVzc2FnZTogbnVsbCxcblx0XHRzaG93OiB0cnVlLFxuXG5cdFx0Y2xvc2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5zaG93ID0gZmFsc2U7XG5cdFx0fSxcblx0XHRzdWJtaXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGRhdGFPYmplY3Q7XG5cdFx0XHRcblx0XHRcdGlmKHRoaXMubWVzc2FnZSkge1xuXHRcdFx0XHRkYXRhT2JqZWN0ID0ge1xuXHRcdFx0XHRcdG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcblx0XHRcdFx0XHR1c2VySWQ6IFVzZXIuZ2V0SWQoKVxuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdERhdGEucG9zdEZlZWRiYWNrKGRhdGFPYmplY3QpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmNsb3NlKCk7XG5cdFx0fVxuXHR9O1xuXG5cdFVJLm1lbnUubmF2aWdhdGlvbiA9IHtcblx0XHRzdG9wOiBmdW5jdGlvbigpIHtcblx0XHRcdG5hdmlnYXRpb24uZ29TdG9wKCk7XG5cdFx0fSxcblx0XHRmb3J3YXJkOiBmdW5jdGlvbigpIHtcblx0XHRcdG5hdmlnYXRpb24uZ29Gb3J3YXJkKCk7XG5cdFx0fSxcblx0XHRiYWNrd2FyZDogZnVuY3Rpb24oKSB7XG5cdFx0XHRuYXZpZ2F0aW9uLmdvQmFja3dhcmQoKTtcblx0XHR9LFxuXHRcdGxlZnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0bmF2aWdhdGlvbi5nb0xlZnQoKTtcblx0XHR9LFxuXHRcdHJpZ2h0OiBmdW5jdGlvbigpIHtcblx0XHRcdG5hdmlnYXRpb24uZ29SaWdodCgpO1xuXHRcdH1cblx0fTtcblxuXHRVSS5tZW51LmxvZ2luID0ge1xuXHRcdGlzU2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gIVVzZXIuaXNBdXRob3JpemVkKCkgJiYgVXNlci5pc0xvYWRlZCgpO1xuXHRcdH0sXG5cblx0XHRnb29nbGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHdpbiA9ICR3aW5kb3cub3BlbignL2F1dGgvZ29vZ2xlJywgJycsICd3aWR0aD04MDAsaGVpZ2h0PTYwMCxtb2RhbD15ZXMsYWx3YXlzUmFpc2VkPXllcycpO1xuXHRcdCAgICB2YXIgY2hlY2tBdXRoV2luZG93ID0gJGludGVydmFsKGZ1bmN0aW9uICgpIHtcblx0XHQgICAgICAgIGlmICh3aW4gJiYgd2luLmNsb3NlZCkge1xuXHRcdCAgICAgICAgXHQkaW50ZXJ2YWwuY2FuY2VsKGNoZWNrQXV0aFdpbmRvdyk7XG5cblx0XHQgICAgICAgIFx0VXNlci5sb2FkKCkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0ICAgICAgICBcdFx0cmV0dXJuIGxvYWRVc2VyRGF0YSgpO1xuXHRcdCAgICAgICAgXHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0ICAgICAgICBcdFx0JGxvZy5sb2coJ1VzZXIgbG9hZGluZCBlcnJvcicpO1xuXHRcdFx0XHRcdFx0Ly9UT0RPOiBzaG93IGVycm9yIG1lc3NhZ2UgIFxuXHRcdCAgICAgICAgXHR9KTtcblx0XHQgICAgICAgIH1cblx0XHQgICAgfSwgMTAwKTtcdFx0XHRcblx0XHR9LFxuXG5cdFx0bG9nb3V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFVzZXIubG9nb3V0KCkuZmluYWxseShmdW5jdGlvbiAoKSB7XG4gICAgICAgIFx0XHRyZXR1cm4gbG9hZFVzZXJEYXRhKCk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdCRsb2cuZXJyb3IoJ0xvZ291dCBlcnJvcicpO1xuXHRcdFx0XHQvL1RPRE86IHNob3cgYW4gZXJyb3Jcblx0XHRcdH0pO1xuXHRcdH1cblx0fTtcblxuXHRVSS5tZW51LmludmVudG9yeSA9IHtcblx0XHRzZWFyY2g6IG51bGwsXG5cdFx0bGlzdDogbnVsbCxcblx0XHRibG9ja2VyOiAnaW52ZW50b3J5Jyxcblx0XG5cdFx0ZXhwYW5kOiBmdW5jdGlvbihib29rKSB7XG5cdFx0XHRVSS5tZW51LmNyZWF0ZUJvb2suc2V0Qm9vayhib29rKTtcblx0XHR9LFxuXHRcdGJsb2NrOiBmdW5jdGlvbigpIHtcblx0XHRcdGJsb2NrVUkuaW5zdGFuY2VzLmdldCh0aGlzLmJsb2NrZXIpLnN0YXJ0KCk7XG5cdFx0fSxcblx0XHR1bmJsb2NrOiBmdW5jdGlvbigpIHtcblx0XHRcdGJsb2NrVUkuaW5zdGFuY2VzLmdldCh0aGlzLmJsb2NrZXIpLnN0b3AoKTtcblx0XHR9LFxuXHRcdGlzU2hvdzogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gVXNlci5pc0F1dGhvcml6ZWQoKTtcblx0XHR9LFxuXHRcdGlzQm9va1NlbGVjdGVkOiBmdW5jdGlvbihpZCkge1xuXHRcdFx0cmV0dXJuIHNlbGVjdG9yLmlzQm9va1NlbGVjdGVkKGlkKTtcblx0XHR9LFxuXHRcdHNlbGVjdDogZnVuY3Rpb24oZHRvKSB7XG5cdFx0XHR2YXIgYm9vayA9IGVudmlyb25tZW50LmdldEJvb2soZHRvLmlkKTtcblx0XHRcdHZhciBtZXRhID0gbmV3IFNlbGVjdG9yTWV0YShib29rKTtcblx0XHRcdHNlbGVjdG9yLnNlbGVjdChtZXRhKTtcblx0XHR9LFxuXHRcdGFkZEJvb2s6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNjb3BlID0gdGhpcztcblxuXHRcdFx0c2NvcGUuYmxvY2soKTtcblx0XHRcdERhdGEucG9zdEJvb2soe3VzZXJJZDogVXNlci5nZXRJZCgpfSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdHNjb3BlLmV4cGFuZChyZXMuZGF0YSk7XG5cdFx0XHRcdHJldHVybiBzY29wZS5sb2FkRGF0YSgpO1xuXHRcdFx0fSkudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdC8vVE9ETzogcmVzZWFyY2gsIGxvb2tzIHJpZ3RoXG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdFx0JGxvZy5lcnJvcihlcnJvcik7XG5cdFx0XHRcdC8vVE9ETzogc2hvdyBhbiBlcnJvclxuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdHNjb3BlLnVuYmxvY2soKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0cmVtb3ZlOiBmdW5jdGlvbihib29rKSB7XG5cdFx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdFx0XHRzY29wZS5ibG9jaygpO1xuXHRcdFx0RGF0YS5kZWxldGVCb29rKGJvb2spLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRlbnZpcm9ubWVudC5yZW1vdmVCb29rKHJlcy5kYXRhKTtcblx0XHRcdFx0cmV0dXJuIHNjb3BlLmxvYWREYXRhKCk7XG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdFx0Ly9UT0RPOiBzaG93IGFuIGVycm9yXG5cdFx0XHRcdCRsb2cuZXJyb3IoZXJyb3IpO1xuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdHNjb3BlLnVuYmxvY2soKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0cGxhY2U6IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRcdHZhciBzY29wZSA9IHRoaXM7XG5cdFx0XHR2YXIgcHJvbWlzZTtcblx0XHRcdHZhciBpc0Jvb2tQbGFjZWQgPSAhIWJvb2suc2VjdGlvbklkO1xuXG5cdFx0XHRzY29wZS5ibG9jaygpO1xuXHRcdFx0cHJvbWlzZSA9IGlzQm9va1BsYWNlZCA/IGxvY2F0b3IudW5wbGFjZUJvb2soYm9vaykgOiBsb2NhdG9yLnBsYWNlQm9vayhib29rKTtcblx0XHRcdHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdHJldHVybiBzY29wZS5sb2FkRGF0YSgpO1xuXHRcdFx0fSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0XHRcdC8vVE9ETzogc2hvdyBhbiBlcnJvclxuXHRcdFx0XHQkbG9nLmVycm9yKGVycm9yKTtcblx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRzY29wZS51bmJsb2NrKCk7IFxuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRsb2FkRGF0YTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdFx0dmFyIHByb21pc2U7XG5cblx0XHRcdHNjb3BlLmJsb2NrKCk7XG5cdFx0XHRwcm9taXNlID0gJHEud2hlbih0aGlzLmlzU2hvdygpID8gRGF0YS5nZXRVc2VyQm9va3MoVXNlci5nZXRJZCgpKSA6IG51bGwpLnRoZW4oZnVuY3Rpb24gKGJvb2tzKSB7XG5cdFx0XHRcdHNjb3BlLmxpc3QgPSBib29rcztcblx0XHRcdH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRzY29wZS51bmJsb2NrKCk7XHRcdFxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiBwcm9taXNlO1xuXHRcdH1cblx0fTtcblxuXHRVSS5tZW51LmNyZWF0ZUJvb2sgPSB7XG5cdFx0bGlzdDogW10sXG5cdFx0Ym9vazoge30sXG5cblx0XHRzZXRCb29rOiBmdW5jdGlvbihib29rKSB7XG5cdFx0XHR0aGlzLmJvb2sgPSB7fTsgLy8gY3JlYXRlIG5ldyBvYmplY3QgZm9yIHVuYmluZCBmcm9tIHNjb3BlXG5cdFx0XHRpZihib29rKSB7XG5cdFx0XHRcdHRoaXMuYm9vay5pZCA9IGJvb2suaWQ7XG5cdFx0XHRcdHRoaXMuYm9vay51c2VySWQgPSBib29rLnVzZXJJZDtcblx0XHRcdFx0dGhpcy5ib29rLm1vZGVsID0gYm9vay5tb2RlbDtcblx0XHRcdFx0dGhpcy5ib29rLmNvdmVyID0gYm9vay5jb3Zlcjtcblx0XHRcdFx0dGhpcy5ib29rLnRpdGxlID0gYm9vay50aXRsZTtcblx0XHRcdFx0dGhpcy5ib29rLmF1dGhvciA9IGJvb2suYXV0aG9yO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Z2V0SW1nOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLmJvb2subW9kZWwgPyBCT09LX0lNQUdFX1VSTC5yZXBsYWNlKCd7bW9kZWx9JywgdGhpcy5ib29rLm1vZGVsKSA6IG51bGw7XG5cdFx0fSxcblx0XHRpc1Nob3c6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuICEhdGhpcy5ib29rLmlkO1xuXHRcdH0sXG5cdFx0c2F2ZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXHRcdFx0XG5cdFx0XHRVSS5tZW51LmludmVudG9yeS5ibG9jaygpO1xuXHRcdFx0RGF0YS5wb3N0Qm9vayh0aGlzLmJvb2spLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRlbnZpcm9ubWVudC51cGRhdGVCb29rKHJlcy5kYXRhKTtcblx0XHRcdFx0c2NvcGUuY2FuY2VsKCk7XG5cdFx0XHRcdHJldHVybiBVSS5tZW51LmludmVudG9yeS5sb2FkRGF0YSgpXG5cdFx0XHR9KS5jYXRjaChmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdC8vVE9ETzogc2hvdyBlcnJvclxuXHRcdFx0fSkuZmluYWxseShmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHRcdFVJLm1lbnUuaW52ZW50b3J5LnVuYmxvY2soKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0Y2FuY2VsOiBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuc2V0Qm9vaygpO1xuXHRcdH1cblx0fTtcblxuXHRVSS5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdFx0Ly9UT0RPOiBtb3ZlIHRvIG1lbnUgbW9kZWxzXG5cdFx0RGF0YS5nZXRVSURhdGEoKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdFVJLm1lbnUuY3JlYXRlTGlicmFyeS5saXN0ID0gcmVzLmRhdGEubGlicmFyaWVzO1xuXHRcdFx0VUkubWVudS5jcmVhdGVTZWN0aW9uLmxpc3QgPSByZXMuZGF0YS5ib29rc2hlbHZlcztcblx0XHRcdFVJLm1lbnUuY3JlYXRlQm9vay5saXN0ID0gcmVzLmRhdGEuYm9va3M7XG5cblx0XHRcdHJldHVybiBsb2FkVXNlckRhdGEoKTtcblx0XHR9KS5jYXRjaChmdW5jdGlvbiAocmVzKSB7XG5cdFx0XHQkbG9nLmxvZygnVUkgaW5pdCBlcnJvcicpO1xuXHRcdFx0Ly9UT0RPOiBzaG93IGFuIGVycm9yXG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIGxvYWRVc2VyRGF0YSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkcS5hbGwoW1xuXHRcdFx0VUkubWVudS5zZWxlY3RMaWJyYXJ5LnVwZGF0ZUxpc3QoKSwgXG5cdFx0XHRVSS5tZW51LmludmVudG9yeS5sb2FkRGF0YSgpXG5cdFx0XSk7XG5cdH07XG5cblx0cmV0dXJuIFVJO1xufSk7XG5cbi8vIFZpcnR1YWxCb29rc2hlbGYuVUkuaW5pdENvbnRyb2xzRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLm1vZGVsLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VNb2RlbDtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2sudGV4dHVyZS5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlQm9va1RleHR1cmU7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmNvdmVyLm9uY2hhbmdlID0gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VCb29rQ292ZXI7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmF1dGhvci5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSgnYXV0aG9yJywgJ3RleHQnKTtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suYXV0aG9yU2l6ZS5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSgnYXV0aG9yJywgJ3NpemUnKTtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suYXV0aG9yQ29sb3Iub25jaGFuZ2UgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZVNwZWNpZmljVmFsdWUoJ2F1dGhvcicsICdjb2xvcicpO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay50aXRsZS5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSgndGl0bGUnLCAndGV4dCcpO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay50aXRsZVNpemUub25jaGFuZ2UgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZVNwZWNpZmljVmFsdWUoJ3RpdGxlJywgJ3NpemUnKTtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2sudGl0bGVDb2xvci5vbmNoYW5nZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2hhbmdlU3BlY2lmaWNWYWx1ZSgndGl0bGUnLCAnY29sb3InKTtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suZWRpdENvdmVyLm9uY2xpY2sgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLnN3aXRjaEVkaXRlZDtcblx0Ly8gVmlydHVhbEJvb2tzaGVsZi5VSS5tZW51LmNyZWF0ZUJvb2suZWRpdEF1dGhvci5vbmNsaWNrID0gVmlydHVhbEJvb2tzaGVsZi5VSS5zd2l0Y2hFZGl0ZWQ7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmVkaXRUaXRsZS5vbmNsaWNrID0gVmlydHVhbEJvb2tzaGVsZi5VSS5zd2l0Y2hFZGl0ZWQ7XG5cdC8vIFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLm9rLm9uY2xpY2sgPSBWaXJ0dWFsQm9va3NoZWxmLlVJLnNhdmVCb29rO1xuXHQvLyBWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5jYW5jZWwub25jbGljayA9IFZpcnR1YWxCb29rc2hlbGYuVUkuY2FuY2VsQm9va0VkaXQ7XG4vLyB9O1xuXG4vLyBjcmVhdGUgYm9va1xuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLnNob3dDcmVhdGVCb29rID0gZnVuY3Rpb24oKSB7XG4vLyBcdHZhciBtZW51Tm9kZSA9IFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rO1xuXG4vLyBcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNCb29rKCkpIHtcbi8vIFx0XHRtZW51Tm9kZS5zaG93KCk7XG4vLyBcdFx0bWVudU5vZGUuc2V0VmFsdWVzKCk7XG4vLyBcdH0gZWxzZSBpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzU2VjdGlvbigpKSB7XG4vLyBcdFx0dmFyIHNlY3Rpb24gPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcbi8vIFx0XHR2YXIgc2hlbGYgPSBzZWN0aW9uLmdldFNoZWxmQnlQb2ludChWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLnBvaW50KTtcbi8vIFx0XHR2YXIgZnJlZVBvc2l0aW9uID0gc2VjdGlvbi5nZXRHZXRGcmVlU2hlbGZQb3NpdGlvbihzaGVsZiwge3g6IDAuMDUsIHk6IDAuMTIsIHo6IDAuMX0pOyBcbi8vIFx0XHRpZihmcmVlUG9zaXRpb24pIHtcbi8vIFx0XHRcdG1lbnVOb2RlLnNob3coKTtcblxuLy8gXHRcdFx0dmFyIGRhdGFPYmplY3QgPSB7XG4vLyBcdFx0XHRcdG1vZGVsOiBtZW51Tm9kZS5tb2RlbC52YWx1ZSwgXG4vLyBcdFx0XHRcdHRleHR1cmU6IG1lbnVOb2RlLnRleHR1cmUudmFsdWUsIFxuLy8gXHRcdFx0XHRjb3ZlcjogbWVudU5vZGUuY292ZXIudmFsdWUsXG4vLyBcdFx0XHRcdHBvc194OiBmcmVlUG9zaXRpb24ueCxcbi8vIFx0XHRcdFx0cG9zX3k6IGZyZWVQb3NpdGlvbi55LFxuLy8gXHRcdFx0XHRwb3NfejogZnJlZVBvc2l0aW9uLnosXG4vLyBcdFx0XHRcdHNlY3Rpb25JZDogc2VjdGlvbi5kYXRhT2JqZWN0LmlkLFxuLy8gXHRcdFx0XHRzaGVsZklkOiBzaGVsZi5pZCxcbi8vIFx0XHRcdFx0dXNlcklkOiBWaXJ0dWFsQm9va3NoZWxmLnVzZXIuaWRcbi8vIFx0XHRcdH07XG5cbi8vIFx0XHRcdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5jcmVhdGVCb29rKGRhdGFPYmplY3QsIGZ1bmN0aW9uIChib29rLCBkYXRhT2JqZWN0KSB7XG4vLyBcdFx0XHRcdGJvb2sucGFyZW50ID0gc2hlbGY7XG4vLyBcdFx0XHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0ID0gYm9vaztcbi8vIFx0XHRcdFx0VmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5nZXQoKTtcbi8vIFx0XHRcdH0pO1xuLy8gXHRcdH0gZWxzZSB7XG4vLyBcdFx0XHRhbGVydCgnVGhlcmUgaXMgbm8gZnJlZSBzcGFjZSBvbiBzZWxlY3RlZCBzaGVsZi4nKTtcbi8vIFx0XHR9XG4vLyBcdH1cbi8vIH1cblxuLy8gVmlydHVhbEJvb2tzaGVsZi5VSS5jaGFuZ2VNb2RlbCA9IGZ1bmN0aW9uKCkge1xuLy8gXHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0dmFyIG9sZEJvb2sgPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcbi8vIFx0XHR2YXIgZGF0YU9iamVjdCA9IHtcbi8vIFx0XHRcdG1vZGVsOiB0aGlzLnZhbHVlLFxuLy8gXHRcdFx0dGV4dHVyZTogb2xkQm9vay50ZXh0dXJlLnRvU3RyaW5nKCksXG4vLyBcdFx0XHRjb3Zlcjogb2xkQm9vay5jb3Zlci50b1N0cmluZygpXG4vLyBcdFx0fTtcblxuLy8gXHRcdFZpcnR1YWxCb29rc2hlbGYuRGF0YS5jcmVhdGVCb29rKGRhdGFPYmplY3QsIGZ1bmN0aW9uIChib29rLCBkYXRhT2JqZWN0KSB7XG4vLyBcdFx0XHRib29rLmNvcHlTdGF0ZShvbGRCb29rKTtcbi8vIFx0XHR9KTtcbi8vIFx0fVxuLy8gfVxuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZUJvb2tUZXh0dXJlID0gZnVuY3Rpb24oKSB7XG4vLyBcdGlmKFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQuaXNCb29rKCkpIHtcbi8vIFx0XHR2YXIgYm9vayA9IFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0O1xuLy8gXHRcdGJvb2sudGV4dHVyZS5sb2FkKHRoaXMudmFsdWUsIGZhbHNlLCBmdW5jdGlvbiAoKSB7XG4vLyBcdFx0XHRib29rLnVwZGF0ZVRleHR1cmUoKTtcbi8vIFx0XHR9KTtcbi8vIFx0fVxuLy8gfVxuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZUJvb2tDb3ZlciA9IGZ1bmN0aW9uKCkge1xuLy8gXHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0dmFyIGJvb2sgPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcbi8vIFx0XHRib29rLmNvdmVyLmxvYWQodGhpcy52YWx1ZSwgdHJ1ZSwgZnVuY3Rpb24oKSB7XG4vLyBcdFx0XHRib29rLnVwZGF0ZVRleHR1cmUoKTtcbi8vIFx0XHR9KTtcbi8vIFx0fVxuLy8gfVxuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLmNoYW5nZVNwZWNpZmljVmFsdWUgPSBmdW5jdGlvbihmaWVsZCwgcHJvcGVydHkpIHtcbi8vIFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcbi8vIFx0XHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0XHRWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdFtmaWVsZF1bcHJvcGVydHldID0gdGhpcy52YWx1ZTtcbi8vIFx0XHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQub2JqZWN0LnVwZGF0ZVRleHR1cmUoKTtcbi8vIFx0XHR9XG4vLyBcdH07XG4vLyB9O1xuXG4vLyBWaXJ0dWFsQm9va3NoZWxmLlVJLnN3aXRjaEVkaXRlZCA9IGZ1bmN0aW9uKCkge1xuLy8gXHR2YXIgYWN0aXZlRWxlbWV0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EuYWN0aXZlRWRpdCcpO1xuXG4vLyBcdGZvcih2YXIgaSA9IGFjdGl2ZUVsZW1ldHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbi8vIFx0XHRhY3RpdmVFbGVtZXRzW2ldLmNsYXNzTmFtZSA9ICdpbmFjdGl2ZUVkaXQnO1xuLy8gXHR9O1xuXG4vLyBcdHZhciBwcmV2aW91c0VkaXRlZCA9IFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmVkaXRlZDtcbi8vIFx0dmFyIGN1cnJlbnRFZGl0ZWQgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZWRpdCcpO1xuXG4vLyBcdGlmKHByZXZpb3VzRWRpdGVkICE9IGN1cnJlbnRFZGl0ZWQpIHtcbi8vIFx0XHR0aGlzLmNsYXNzTmFtZSA9ICdhY3RpdmVFZGl0Jztcbi8vIFx0XHRWaXJ0dWFsQm9va3NoZWxmLlVJLm1lbnUuY3JlYXRlQm9vay5lZGl0ZWQgPSBjdXJyZW50RWRpdGVkO1xuLy8gXHR9IGVsc2Uge1xuLy8gXHRcdFZpcnR1YWxCb29rc2hlbGYuVUkubWVudS5jcmVhdGVCb29rLmVkaXRlZCA9IG51bGw7XG4vLyBcdH1cbi8vIH1cblxuLy8gVmlydHVhbEJvb2tzaGVsZi5VSS5zYXZlQm9vayA9IGZ1bmN0aW9uKCkge1xuLy8gXHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0dmFyIGJvb2sgPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcblxuLy8gXHRcdFZpcnR1YWxCb29rc2hlbGYuc2VsZWN0ZWQucHV0KCk7XG4vLyBcdFx0Ym9vay5zYXZlKCk7XG4vLyBcdH1cbi8vIH1cblxuLy8gVmlydHVhbEJvb2tzaGVsZi5VSS5jYW5jZWxCb29rRWRpdCA9IGZ1bmN0aW9uKCkge1xuLy8gXHRpZihWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLmlzQm9vaygpKSB7XG4vLyBcdFx0dmFyIGJvb2sgPSBWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLm9iamVjdDtcblx0XHRcbi8vIFx0XHRWaXJ0dWFsQm9va3NoZWxmLnNlbGVjdGVkLnB1dCgpO1xuLy8gXHRcdGJvb2sucmVmcmVzaCgpO1xuLy8gXHR9XG4vLyB9IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ1VzZXInLCBmdW5jdGlvbiAoJGxvZywgRGF0YSkge1xuXHR2YXIgdXNlciA9IHt9O1xuXG5cdHZhciBsb2FkZWQgPSBmYWxzZTtcblx0dmFyIF9kYXRhT2JqZWN0ID0gbnVsbDtcblx0dmFyIF9wb3NpdGlvbiA9IG51bGw7XG5cdHZhciBfbGlicmFyeSA9IG51bGw7XG5cblx0dXNlci5sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNjb3BlID0gdGhpcztcblxuXHRcdHJldHVybiBEYXRhLmdldFVzZXIoKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdHNjb3BlLnNldERhdGFPYmplY3QocmVzLmRhdGEpO1xuXHRcdFx0c2NvcGUuc2V0TGlicmFyeSgpO1xuXHRcdFx0bG9hZGVkID0gdHJ1ZTtcblxuXHRcdFx0JGxvZy5sb2coJ3VzZXIgbG9hZGVkJyk7XG5cdFx0fSk7XG5cdH07XG5cblx0dXNlci5sb2dvdXQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gRGF0YS5sb2dvdXQoKS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB1c2VyLmxvYWQoKTtcblx0XHR9KTtcblx0fTtcblxuXHR1c2VyLnNldERhdGFPYmplY3QgPSBmdW5jdGlvbihkYXRhT2JqZWN0KSB7XG5cdFx0X2RhdGFPYmplY3QgPSBkYXRhT2JqZWN0O1xuXHR9O1xuXG5cdHVzZXIuZ2V0TGlicmFyeSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBfbGlicmFyeTtcblx0fTtcblxuXHR1c2VyLnNldExpYnJhcnkgPSBmdW5jdGlvbihsaWJyYXJ5SWQpIHtcblx0XHRfbGlicmFyeSA9IGxpYnJhcnlJZCB8fCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUuc3Vic3RyaW5nKDEpO1xuXHR9O1xuXG5cdHVzZXIuZ2V0SWQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gX2RhdGFPYmplY3QgJiYgX2RhdGFPYmplY3QuaWQ7XG5cdH07XG5cblx0dXNlci5pc0F1dGhvcml6ZWQgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gQm9vbGVhbihfZGF0YU9iamVjdCk7XG5cdH07XG5cblx0dXNlci5pc0xvYWRlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBsb2FkZWQ7XG5cdH1cblxuXHRyZXR1cm4gdXNlcjtcbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0Jhc2VPYmplY3QnLCBmdW5jdGlvbiAoKSB7XG5cdHZhciBCYXNlT2JqZWN0ID0gZnVuY3Rpb24oZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG5cdFx0VEhSRUUuTWVzaC5jYWxsKHRoaXMsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cblx0XHR0aGlzLmRhdGFPYmplY3QgPSBkYXRhT2JqZWN0IHx8IHt9O1xuXHRcdHRoaXMuZGF0YU9iamVjdC5yb3RhdGlvbiA9IHRoaXMuZGF0YU9iamVjdC5yb3RhdGlvbiB8fCBbMCwgMCwgMF07XG5cdFx0XG5cdFx0dGhpcy5pZCA9IHRoaXMuZGF0YU9iamVjdC5pZDtcblx0XHR0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjModGhpcy5kYXRhT2JqZWN0LnBvc194LCB0aGlzLmRhdGFPYmplY3QucG9zX3ksIHRoaXMuZGF0YU9iamVjdC5wb3Nfeik7XG5cdFx0dGhpcy5yb3RhdGlvbi5vcmRlciA9ICdYWVonO1xuXHRcdHRoaXMucm90YXRpb24uZnJvbUFycmF5KHRoaXMuZGF0YU9iamVjdC5yb3RhdGlvbi5tYXAoTnVtYmVyKSk7XG5cblx0XHR0aGlzLnVwZGF0ZU1hdHJpeCgpO1xuXG5cdFx0Ly9UT0RPOiByZXNlYXJjaCwgYWZ0ZXIgY2FjaGluZyBnZW9tZXRyeSB0aGlzIGNhbiBiZSBydW4gb25jZVxuXHRcdHRoaXMuZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XG5cdFx0XG5cdFx0dGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1x0XHRcblx0fTtcblx0XG5cdEJhc2VPYmplY3QucHJvdG90eXBlID0gbmV3IFRIUkVFLk1lc2goKTtcblx0QmFzZU9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBCYXNlT2JqZWN0O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLmdldFR5cGUgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gdGhpcy50eXBlO1xuXHR9O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLmlzT3V0T2ZQYXJyZW50ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIE1hdGguYWJzKHRoaXMuYm91bmRpbmdCb3guY2VudGVyLnggLSB0aGlzLnBhcmVudC5ib3VuZGluZ0JveC5jZW50ZXIueCkgPiAodGhpcy5wYXJlbnQuYm91bmRpbmdCb3gucmFkaXVzLnggLSB0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy54KVxuXHRcdFx0Ly98fCBNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci55IC0gdGhpcy5wYXJlbnQuYm91bmRpbmdCb3guY2VudGVyLnkpID4gKHRoaXMucGFyZW50LmJvdW5kaW5nQm94LnJhZGl1cy55IC0gdGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueSlcblx0XHRcdHx8IE1hdGguYWJzKHRoaXMuYm91bmRpbmdCb3guY2VudGVyLnogLSB0aGlzLnBhcmVudC5ib3VuZGluZ0JveC5jZW50ZXIueikgPiAodGhpcy5wYXJlbnQuYm91bmRpbmdCb3gucmFkaXVzLnogLSB0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy56KTtcblx0fTtcblxuXHRCYXNlT2JqZWN0LnByb3RvdHlwZS5pc0NvbGxpZGVkID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyXG5cdFx0XHRyZXN1bHQsXG5cdFx0XHR0YXJnZXRzLFxuXHRcdFx0dGFyZ2V0LFxuXHRcdFx0aTtcblxuXHRcdHRoaXMudXBkYXRlQm91bmRpbmdCb3goKTtcblxuXHRcdHJlc3VsdCA9IHRoaXMuaXNPdXRPZlBhcnJlbnQoKTtcblx0XHR0YXJnZXRzID0gdGhpcy5wYXJlbnQuY2hpbGRyZW47XG5cblx0XHRpZighcmVzdWx0KSB7XG5cdFx0XHRmb3IoaSA9IHRhcmdldHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcblx0XHRcdFx0dGFyZ2V0ID0gdGFyZ2V0c1tpXS5ib3VuZGluZ0JveDtcblxuXHRcdFx0XHRpZih0YXJnZXRzW2ldID09PSB0aGlzIFxuXHRcdFx0XHR8fCAhdGFyZ2V0IC8vIGNoaWxkcmVuIHdpdGhvdXQgQkJcblx0XHRcdFx0fHwgKE1hdGguYWJzKHRoaXMuYm91bmRpbmdCb3guY2VudGVyLnggLSB0YXJnZXQuY2VudGVyLngpID4gKHRoaXMuYm91bmRpbmdCb3gucmFkaXVzLnggKyB0YXJnZXQucmFkaXVzLngpKVxuXHRcdFx0XHR8fCAoTWF0aC5hYnModGhpcy5ib3VuZGluZ0JveC5jZW50ZXIueSAtIHRhcmdldC5jZW50ZXIueSkgPiAodGhpcy5ib3VuZGluZ0JveC5yYWRpdXMueSArIHRhcmdldC5yYWRpdXMueSkpXG5cdFx0XHRcdHx8IChNYXRoLmFicyh0aGlzLmJvdW5kaW5nQm94LmNlbnRlci56IC0gdGFyZ2V0LmNlbnRlci56KSA+ICh0aGlzLmJvdW5kaW5nQm94LnJhZGl1cy56ICsgdGFyZ2V0LnJhZGl1cy56KSkpIHtcdFxuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHQgICAgXHRyZXN1bHQgPSB0cnVlO1x0XHRcblx0XHQgICAgXHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbihuZXdQb3NpdGlvbikge1xuXHRcdHZhciBcblx0XHRcdGN1cnJlbnRQb3NpdGlvbixcblx0XHRcdHJlc3VsdDtcblxuXHRcdHJlc3VsdCA9IGZhbHNlO1xuXHRcdGN1cnJlbnRQb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uY2xvbmUoKTtcblx0XHRcblx0XHRpZihuZXdQb3NpdGlvbi54KSB7XG5cdFx0XHR0aGlzLnBvc2l0aW9uLnNldFgobmV3UG9zaXRpb24ueCk7XG5cblx0XHRcdGlmKHRoaXMuaXNDb2xsaWRlZCgpKSB7XG5cdFx0XHRcdHRoaXMucG9zaXRpb24uc2V0WChjdXJyZW50UG9zaXRpb24ueCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKG5ld1Bvc2l0aW9uLnopIHtcblx0XHRcdHRoaXMucG9zaXRpb24uc2V0WihuZXdQb3NpdGlvbi56KTtcblxuXHRcdFx0aWYodGhpcy5pc0NvbGxpZGVkKCkpIHtcblx0XHRcdFx0dGhpcy5wb3NpdGlvbi5zZXRaKGN1cnJlbnRQb3NpdGlvbi56KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5jaGFuZ2VkID0gdGhpcy5jaGFuZ2VkIHx8IHJlc3VsdDtcblx0XHR0aGlzLnVwZGF0ZUJvdW5kaW5nQm94KCk7XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uKGRYLCBkWSwgaXNEZW1vKSB7XG5cdFx0dmFyIFxuXHRcdFx0Y3VycmVudFJvdGF0aW9uID0gdGhpcy5yb3RhdGlvbi5jbG9uZSgpLFxuXHRcdFx0cmVzdWx0ID0gZmFsc2U7IFxuXHRcdFxuXHRcdGlmKGRYKSB7XG5cdFx0XHR0aGlzLnJvdGF0aW9uLnkgKz0gZFggKiAwLjAxO1xuXG5cdFx0XHRpZighaXNEZW1vICYmIHRoaXMuaXNDb2xsaWRlZCgpKSB7XG5cdFx0XHRcdHRoaXMucm90YXRpb24ueSA9IGN1cnJlbnRSb3RhdGlvbi55O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0ID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZihkWSkge1xuXHRcdFx0dGhpcy5yb3RhdGlvbi54ICs9IGRZICogMC4wMTtcblxuXHRcdFx0aWYoIWlzRGVtbyAmJiB0aGlzLmlzQ29sbGlkZWQoKSkge1xuXHRcdFx0XHR0aGlzLnJvdGF0aW9uLnggPSBjdXJyZW50Um90YXRpb24ueDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdCA9IHRydWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5jaGFuZ2VkID0gdGhpcy5jaGFuZ2VkIHx8ICghaXNEZW1vICYmIHJlc3VsdCk7XG5cdFx0dGhpcy51cGRhdGVCb3VuZGluZ0JveCgpO1xuXHR9O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLnVwZGF0ZUJvdW5kaW5nQm94ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyXG5cdFx0XHRib3VuZGluZ0JveCxcblx0XHRcdHJhZGl1cyxcblx0XHRcdGNlbnRlcjtcblxuXHRcdHRoaXMudXBkYXRlTWF0cml4KCk7XG5cdFx0Ym91bmRpbmdCb3ggPSB0aGlzLmdlb21ldHJ5LmJvdW5kaW5nQm94LmNsb25lKCkuYXBwbHlNYXRyaXg0KHRoaXMubWF0cml4KTtcblx0XHRcblx0XHRyYWRpdXMgPSB7XG5cdFx0XHR4OiAoYm91bmRpbmdCb3gubWF4LnggLSBib3VuZGluZ0JveC5taW4ueCkgKiAwLjUsXG5cdFx0XHR5OiAoYm91bmRpbmdCb3gubWF4LnkgLSBib3VuZGluZ0JveC5taW4ueSkgKiAwLjUsXG5cdFx0XHR6OiAoYm91bmRpbmdCb3gubWF4LnogLSBib3VuZGluZ0JveC5taW4ueikgKiAwLjVcblx0XHR9O1xuXG5cdFx0Y2VudGVyID0gbmV3IFRIUkVFLlZlY3RvcjMoXG5cdFx0XHRyYWRpdXMueCArIGJvdW5kaW5nQm94Lm1pbi54LFxuXHRcdFx0cmFkaXVzLnkgKyBib3VuZGluZ0JveC5taW4ueSxcblx0XHRcdHJhZGl1cy56ICsgYm91bmRpbmdCb3gubWluLnpcblx0XHQpO1xuXG5cdFx0dGhpcy5ib3VuZGluZ0JveCA9IHtcblx0XHRcdHJhZGl1czogcmFkaXVzLFxuXHRcdFx0Y2VudGVyOiBjZW50ZXJcblx0XHR9O1xuXHR9O1xuXG5cdEJhc2VPYmplY3QucHJvdG90eXBlLnJlbG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucG9zaXRpb24uc2V0WCh0aGlzLmRhdGFPYmplY3QucG9zX3gpO1xuXHRcdHRoaXMucG9zaXRpb24uc2V0WSh0aGlzLmRhdGFPYmplY3QucG9zX3kpO1xuXHRcdHRoaXMucG9zaXRpb24uc2V0Wih0aGlzLmRhdGFPYmplY3QucG9zX3opO1xuXHRcdHRoaXMucm90YXRpb24uc2V0KDAsIDAsIDApO1xuXHR9O1xuXG5cdHJldHVybiBCYXNlT2JqZWN0O1x0XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnQm9va09iamVjdCcsIGZ1bmN0aW9uIChCYXNlT2JqZWN0LCBDYW52YXNUZXh0LCBDYW52YXNJbWFnZSwgRGF0YSkge1x0XG5cdHZhciBCb29rT2JqZWN0ID0gZnVuY3Rpb24oZGF0YU9iamVjdCwgZ2VvbWV0cnksIG1hdGVyaWFsLCBtYXBJbWFnZSwgY292ZXJJbWFnZSkge1xuXHRcdEJhc2VPYmplY3QuY2FsbCh0aGlzLCBkYXRhT2JqZWN0LCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXHRcdFxuXHRcdHRoaXMubW9kZWwgPSB0aGlzLmRhdGFPYmplY3QubW9kZWw7XG5cdFx0dGhpcy5jYW52YXMgPSBtYXRlcmlhbC5tYXAuaW1hZ2U7XG5cdFx0dGhpcy50ZXh0dXJlID0gbmV3IENhbnZhc0ltYWdlKG51bGwsIG51bGwsIG1hcEltYWdlKTtcblx0XHR0aGlzLmNvdmVyID0gbmV3IENhbnZhc0ltYWdlKHRoaXMuZGF0YU9iamVjdC5jb3ZlclBvcywgdGhpcy5kYXRhT2JqZWN0LmNvdmVyLCBjb3ZlckltYWdlKTtcblx0XHR0aGlzLmF1dGhvciA9IG5ldyBDYW52YXNUZXh0KHRoaXMuZGF0YU9iamVjdC5hdXRob3IsIHRoaXMuZGF0YU9iamVjdC5hdXRob3JGb250KTtcblx0XHR0aGlzLnRpdGxlID0gbmV3IENhbnZhc1RleHQodGhpcy5kYXRhT2JqZWN0LnRpdGxlLCB0aGlzLmRhdGFPYmplY3QudGl0bGVGb250KTtcblxuXHRcdHRoaXMudXBkYXRlVGV4dHVyZSgpO1xuXHR9O1xuXG5cdEJvb2tPYmplY3QuVFlQRSA9ICdCb29rT2JqZWN0JztcblxuXHRCb29rT2JqZWN0LnByb3RvdHlwZSA9IG5ldyBCYXNlT2JqZWN0KCk7XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQm9va09iamVjdDtcblx0Qm9va09iamVjdC5wcm90b3R5cGUudGV4dE5vZGVzID0gWydhdXRob3InLCAndGl0bGUnXTtcblx0Qm9va09iamVjdC5wcm90b3R5cGUudHlwZSA9IEJvb2tPYmplY3QuVFlQRTtcblxuXHRCb29rT2JqZWN0LnByb3RvdHlwZS51cGRhdGVUZXh0dXJlID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdHZhciBjb3ZlciA9IHRoaXMuY292ZXI7XG5cblx0XHRpZih0aGlzLnRleHR1cmUuaW1hZ2UpIHtcblx0XHRcdGNvbnRleHQuZHJhd0ltYWdlKHRoaXMudGV4dHVyZS5pbWFnZSwgMCwgMCk7XG5cdFx0fVxuXG5cdFx0aWYoY292ZXIuaW1hZ2UpIHtcblx0XHRcdHZhciBkaWZmID0gY292ZXIueSArIGNvdmVyLmhlaWdodCAtIERhdGEuQ09WRVJfTUFYX1k7XG5cdFx0IFx0dmFyIGxpbWl0ZWRIZWlnaHQgPSBkaWZmID4gMCA/IGNvdmVyLmhlaWdodCAtIGRpZmYgOiBjb3Zlci5oZWlnaHQ7XG5cdFx0IFx0dmFyIGNyb3BIZWlnaHQgPSBkaWZmID4gMCA/IGNvdmVyLmltYWdlLm5hdHVyYWxIZWlnaHQgLSAoY292ZXIuaW1hZ2UubmF0dXJhbEhlaWdodCAvIGNvdmVyLmhlaWdodCAqIGRpZmYpIDogY292ZXIuaW1hZ2UubmF0dXJhbEhlaWdodDtcblxuXHRcdFx0Y29udGV4dC5kcmF3SW1hZ2UoY292ZXIuaW1hZ2UsIDAsIDAsIGNvdmVyLmltYWdlLm5hdHVyYWxXaWR0aCwgY3JvcEhlaWdodCwgY292ZXIueCwgY292ZXIueSwgY292ZXIud2lkdGgsIGxpbWl0ZWRIZWlnaHQpO1xuXHRcdH1cblxuXHRcdGZvcih2YXIgaSA9IHRoaXMudGV4dE5vZGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHR2YXIgdGV4dE5vZGUgPSB0aGlzW3RoaXMudGV4dE5vZGVzW2ldXTtcblxuXHRcdFx0aWYodGV4dE5vZGUuaXNWYWxpZCgpKSB7XG5cblx0XHRcdFx0Y29udGV4dC5mb250ID0gdGV4dE5vZGUuZ2V0Rm9udCgpO1xuXHRcdFx0XHRjb250ZXh0LmZpbGxTdHlsZSA9IHRleHROb2RlLmNvbG9yO1xuXHRcdCAgICBcdGNvbnRleHQuZmlsbFRleHQodGV4dE5vZGUudGV4dCwgdGV4dE5vZGUueCwgdGV4dE5vZGUueSwgdGV4dE5vZGUud2lkdGgpO1xuXHRcdCAgICB9XG5cdFx0fVxuXG5cdFx0dGhpcy5tYXRlcmlhbC5tYXAubmVlZHNVcGRhdGUgPSB0cnVlO1xuXHR9O1xuXHRCb29rT2JqZWN0LnByb3RvdHlwZS5tb3ZlRWxlbWVudCA9IGZ1bmN0aW9uKGRYLCBkWSwgZWxlbWVudCkge1xuXHRcdHZhciBlbGVtZW50ID0gZWxlbWVudCAmJiB0aGlzW2VsZW1lbnRdO1xuXHRcdFxuXHRcdGlmKGVsZW1lbnQpIHtcblx0XHRcdGlmKGVsZW1lbnQubW92ZSkge1xuXHRcdFx0XHRlbGVtZW50Lm1vdmUoZFgsIGRZKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVsZW1lbnQueCArPSBkWDtcblx0XHRcdFx0ZWxlbWVudC55ICs9IGRZO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnVwZGF0ZVRleHR1cmUoKTtcblx0XHR9XG5cdH07XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnNjYWxlRWxlbWVudCA9IGZ1bmN0aW9uKGRYLCBkWSkge1xuXHRcdHRoaXMuY292ZXIud2lkdGggKz0gZFg7XG5cdFx0dGhpcy5jb3Zlci5oZWlnaHQgKz0gZFk7XG5cdFx0dGhpcy51cGRhdGVUZXh0dXJlKCk7XG5cdH07XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdFx0dGhpcy5kYXRhT2JqZWN0Lm1vZGVsID0gdGhpcy5tb2RlbDtcblx0XHR0aGlzLmRhdGFPYmplY3QudGV4dHVyZSA9IHRoaXMudGV4dHVyZS50b1N0cmluZygpO1xuXHRcdHRoaXMuZGF0YU9iamVjdC5jb3ZlciA9IHRoaXMuY292ZXIudG9TdHJpbmcoKTtcblx0XHR0aGlzLmRhdGFPYmplY3QuY292ZXJQb3MgPSB0aGlzLmNvdmVyLnNlcmlhbGl6ZVByb3BlcnRpZXMoKTtcblx0XHR0aGlzLmRhdGFPYmplY3QuYXV0aG9yID0gdGhpcy5hdXRob3IudG9TdHJpbmcoKTtcblx0XHR0aGlzLmRhdGFPYmplY3QuYXV0aG9yRm9udCA9IHRoaXMuYXV0aG9yLnNlcmlhbGl6ZUZvbnQoKTtcblx0XHR0aGlzLmRhdGFPYmplY3QudGl0bGUgPSB0aGlzLnRpdGxlLnRvU3RyaW5nKCk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LnRpdGxlRm9udCA9IHRoaXMudGl0bGUuc2VyaWFsaXplRm9udCgpO1xuXHRcdHRoaXMuZGF0YU9iamVjdC5wb3NfeCA9IHRoaXMucG9zaXRpb24ueDtcblx0XHR0aGlzLmRhdGFPYmplY3QucG9zX3kgPSB0aGlzLnBvc2l0aW9uLnk7XG5cdFx0dGhpcy5kYXRhT2JqZWN0LnBvc196ID0gdGhpcy5wb3NpdGlvbi56O1xuXG5cdFx0RGF0YS5wb3N0Qm9vayh0aGlzLmRhdGFPYmplY3QsIGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG5cdFx0XHRpZighZXJyICYmIHJlc3VsdCkge1xuXHRcdFx0XHRzY29wZS5kYXRhT2JqZWN0ID0gcmVzdWx0O1xuXHRcdFx0XHRzY29wZS5jaGFuZ2VkID0gZmFsc2U7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvL1RPRE86IGhpZGUgZWRpdCwgbm90aWZ5IHVzZXJcblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblx0Qm9va09iamVjdC5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzY29wZSA9IHRoaXM7XG5cdFx0Ly9UT0RPOiB1c2UgaW4gY29uc3RydWN0b3IgaW5zdGVhZCBvZiBzZXBhcmF0ZSBpbWFnZXMgbG9hZGluZ1xuXHRcdHNjb3BlLnRleHR1cmUubG9hZChzY29wZS5kYXRhT2JqZWN0LnRleHR1cmUsIGZhbHNlLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRzY29wZS5jb3Zlci5sb2FkKHNjb3BlLmRhdGFPYmplY3QuY292ZXIsIHRydWUsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzY29wZS5tb2RlbCA9IHNjb3BlLmRhdGFPYmplY3QubW9kZWw7XG5cdFx0XHRcdHNjb3BlLmNvdmVyLnBhcnNlUHJvcGVydGllcyhzY29wZS5kYXRhT2JqZWN0LmNvdmVyUG9zKTtcblx0XHRcdFx0c2NvcGUuYXV0aG9yLnNldFRleHQoc2NvcGUuZGF0YU9iamVjdC5hdXRob3IpO1xuXHRcdFx0XHRzY29wZS5hdXRob3IucGFyc2VQcm9wZXJ0aWVzKHNjb3BlLmRhdGFPYmplY3QuYXV0aG9yRm9udCk7XG5cdFx0XHRcdHNjb3BlLnRpdGxlLnNldFRleHQoc2NvcGUuZGF0YU9iamVjdC50aXRsZSk7XG5cdFx0XHRcdHNjb3BlLnRpdGxlLnBhcnNlUHJvcGVydGllcyhzY29wZS5kYXRhT2JqZWN0LnRpdGxlRm9udCk7XG5cblx0XHRcdFx0c2NvcGUudXBkYXRlVGV4dHVyZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH07XG5cdEJvb2tPYmplY3QucHJvdG90eXBlLmNvcHlTdGF0ZSA9IGZ1bmN0aW9uKGJvb2spIHtcblx0XHRpZihib29rIGluc3RhbmNlb2YgQm9va09iamVjdCkge1xuXHRcdFx0dmFyIGZpZWxkcyA9IFsnZGF0YU9iamVjdCcsICdwb3NpdGlvbicsICdyb3RhdGlvbicsICdtb2RlbCcsICd0ZXh0dXJlJywgJ2NvdmVyJywgJ2F1dGhvcicsICd0aXRsZSddO1xuXHRcdFx0Zm9yKHZhciBpID0gZmllbGRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRcdHZhciBmaWVsZCA9IGZpZWxkc1tpXTtcblx0XHRcdFx0dGhpc1tmaWVsZF0gPSBib29rW2ZpZWxkXTtcblx0XHRcdH07XG5cblx0XHRcdHRoaXMudXBkYXRlVGV4dHVyZSgpO1xuXHRcdFx0Ym9vay5wYXJlbnQuYWRkKHRoaXMpO1xuXHRcdFx0Ym9vay5wYXJlbnQucmVtb3ZlKGJvb2spO1xuXHRcdFx0VmlydHVhbEJvb2tzaGVsZi5zZWxlY3RlZC5vYmplY3QgPSB0aGlzO1xuXHRcdH1cblx0fTtcblx0Qm9va09iamVjdC5wcm90b3R5cGUuc2V0UGFyZW50ID0gZnVuY3Rpb24ocGFyZW50KSB7XG5cdFx0aWYodGhpcy5wYXJlbnQgIT0gcGFyZW50KSB7XG5cdFx0XHRpZihwYXJlbnQpIHtcblx0XHRcdFx0cGFyZW50LmFkZCh0aGlzKTtcblx0XHRcdFx0dGhpcy5kYXRhT2JqZWN0LnNoZWxmSWQgPSBwYXJlbnQuaWQ7XG5cdFx0XHRcdHRoaXMuZGF0YU9iamVjdC5zZWN0aW9uSWQgPSBwYXJlbnQucGFyZW50LmlkO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5wYXJlbnQucmVtb3ZlKHRoaXMpO1xuXHRcdFx0XHR0aGlzLmRhdGFPYmplY3Quc2hlbGZJZCA9IG51bGw7XG5cdFx0XHRcdHRoaXMuZGF0YU9iamVjdC5zZWN0aW9uSWQgPSBudWxsO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gQm9va09iamVjdDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdDYW1lcmFPYmplY3QnLCBmdW5jdGlvbiAoQmFzZU9iamVjdCkge1xuXHR2YXIgQ2FtZXJhT2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0QmFzZU9iamVjdC5jYWxsKHRoaXMpO1xuXHR9O1xuXG5cdENhbWVyYU9iamVjdC5wcm90b3R5cGUgPSBuZXcgQmFzZU9iamVjdCgpO1xuXHRcblx0Q2FtZXJhT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENhbWVyYU9iamVjdDtcblx0XG5cdENhbWVyYU9iamVjdC5wcm90b3R5cGUudXBkYXRlQm91bmRpbmdCb3ggPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgcmFkaXVzID0ge3g6IDAuMSwgeTogMSwgejogMC4xfTtcblx0XHR2YXIgY2VudGVyID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCk7XG5cblx0XHR0aGlzLmJvdW5kaW5nQm94ID0ge1xuXHRcdFx0cmFkaXVzOiByYWRpdXMsXG5cdFx0XHRjZW50ZXI6IHRoaXMucG9zaXRpb24gLy9UT0RPOiBuZWVkcyBjZW50ZXIgb2Ygc2VjdGlvbiBpbiBwYXJlbnQgb3Igd29ybGQgY29vcmRpbmF0ZXNcblx0XHR9O1xuXHR9O1xuXG5cdHJldHVybiBDYW1lcmFPYmplY3Q7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnVmlydHVhbEJvb2tzaGVsZicpXG4uZmFjdG9yeSgnQ2FudmFzSW1hZ2UnLCBmdW5jdGlvbiAoJHEsIERhdGEpIHtcblx0dmFyIENhbnZhc0ltYWdlID0gZnVuY3Rpb24ocHJvcGVydGllcywgbGluaywgaW1hZ2UpIHtcblx0XHR0aGlzLmxpbmsgPSBsaW5rIHx8ICcnO1xuXHRcdHRoaXMuaW1hZ2UgPSBpbWFnZTtcblx0XHR0aGlzLnBhcnNlUHJvcGVydGllcyhwcm9wZXJ0aWVzKTtcblx0fTtcblx0XG5cdENhbnZhc0ltYWdlLnByb3RvdHlwZSA9IHtcblx0XHRjb25zdHJ1Y3RvcjogQ2FudmFzSW1hZ2UsXG5cblx0XHR0b1N0cmluZzogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5saW5rO1xuXHRcdH0sXG5cdFx0cGFyc2VQcm9wZXJ0aWVzOiBmdW5jdGlvbihwcm9wZXJ0aWVzKSB7XG5cdFx0XHR2YXIgYXJncyA9IHByb3BlcnRpZXMgJiYgcHJvcGVydGllcy5zcGxpdCgnLCcpIHx8IFtdO1xuXG5cdFx0XHR0aGlzLnggPSBOdW1iZXIoYXJnc1swXSkgfHwgRGF0YS5DT1ZFUl9GQUNFX1g7XG5cdFx0XHR0aGlzLnkgPSBOdW1iZXIoYXJnc1sxXSkgfHwgMDtcblx0XHRcdHRoaXMud2lkdGggPSBOdW1iZXIoYXJnc1syXSkgfHwgMjE2O1xuXHRcdFx0dGhpcy5oZWlnaHQgPSBOdW1iZXIoYXJnc1szXSkgfHwgRGF0YS5DT1ZFUl9NQVhfWTtcblx0XHR9LFxuXHRcdHNlcmlhbGl6ZVByb3BlcnRpZXM6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIFt0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHRdLmpvaW4oJywnKTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIENhbnZhc0ltYWdlO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ0NhbnZhc1RleHQnLCBmdW5jdGlvbiAoRGF0YSkge1xuXHR2YXIgQ2FudmFzVGV4dCA9IGZ1bmN0aW9uKHRleHQsIHByb3BlcnRpZXMpIHtcblx0XHR0aGlzLnRleHQgPSB0ZXh0IHx8ICcnO1xuXHRcdHRoaXMucGFyc2VQcm9wZXJ0aWVzKHByb3BlcnRpZXMpO1xuXHR9O1xuXG5cdENhbnZhc1RleHQucHJvdG90eXBlID0ge1xuXHRcdGNvbnN0cnVjdG9yOiBDYW52YXNUZXh0LFxuXHRcdGdldEZvbnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIFt0aGlzLnN0eWxlLCB0aGlzLnNpemUgKyAncHgnLCB0aGlzLmZvbnRdLmpvaW4oJyAnKTtcblx0XHR9LFxuXHRcdGlzVmFsaWQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuICh0aGlzLnRleHQgJiYgdGhpcy54ICYmIHRoaXMueSk7XG5cdFx0fSxcblx0XHR0b1N0cmluZzogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy50ZXh0IHx8ICcnO1xuXHRcdH0sXG5cdFx0c2V0VGV4dDogZnVuY3Rpb24odGV4dCkge1xuXHRcdFx0dGhpcy50ZXh0ID0gdGV4dDtcblx0XHR9LFxuXHRcdHNlcmlhbGl6ZUZvbnQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIFt0aGlzLnN0eWxlLCB0aGlzLnNpemUsIHRoaXMuZm9udCwgdGhpcy54LCB0aGlzLnksIHRoaXMuY29sb3IsIHRoaXMud2lkdGhdLmpvaW4oJywnKTtcblx0XHR9LFxuXHRcdHBhcnNlUHJvcGVydGllczogZnVuY3Rpb24ocHJvcGVydGllcykge1xuXHRcdFx0dmFyIGFyZ3MgPSBwcm9wZXJ0aWVzICYmIHByb3BlcnRpZXMuc3BsaXQoJywnKSB8fCBbXTtcblxuXHRcdFx0dGhpcy5zdHlsZSA9IGFyZ3NbMF07XG5cdFx0XHR0aGlzLnNpemUgPSBhcmdzWzFdIHx8IDE0O1xuXHRcdFx0dGhpcy5mb250ID0gYXJnc1syXSB8fCAnQXJpYWwnO1xuXHRcdFx0dGhpcy54ID0gTnVtYmVyKGFyZ3NbM10pIHx8IERhdGEuQ09WRVJfRkFDRV9YO1xuXHRcdFx0dGhpcy55ID0gTnVtYmVyKGFyZ3NbNF0pIHx8IDEwO1xuXHRcdFx0dGhpcy5jb2xvciA9IGFyZ3NbNV0gfHwgJ2JsYWNrJztcblx0XHRcdHRoaXMud2lkdGggPSBhcmdzWzZdIHx8IDUxMjtcblx0XHR9LFxuXHRcdG1vdmU6IGZ1bmN0aW9uKGRYLCBkWSkge1xuXHRcdFx0dGhpcy54ICs9IGRYO1xuXHRcdFx0dGhpcy55ICs9IGRZO1xuXG5cdFx0XHRpZih0aGlzLnggPD0gMCkgdGhpcy54ID0gMTtcblx0XHRcdGlmKHRoaXMueSA8PSAwKSB0aGlzLnkgPSAxO1xuXHRcdFx0aWYodGhpcy54ID49IERhdGEuVEVYVFVSRV9SRVNPTFVUSU9OKSB0aGlzLnggPSBEYXRhLlRFWFRVUkVfUkVTT0xVVElPTjtcblx0XHRcdGlmKHRoaXMueSA+PSBEYXRhLkNPVkVSX01BWF9ZKSB0aGlzLnkgPSBEYXRhLkNPVkVSX01BWF9ZO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gQ2FudmFzVGV4dDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdMaWJyYXJ5T2JqZWN0JywgZnVuY3Rpb24gKEJhc2VPYmplY3QsIERhdGEpIHtcblx0dmFyIExpYnJhcnlPYmplY3QgPSBmdW5jdGlvbihwYXJhbXMsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuXHRcdEJhc2VPYmplY3QuY2FsbCh0aGlzLCBwYXJhbXMsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cdFx0dGhpcy5saWJyYXJ5T2JqZWN0ID0gcGFyYW1zLmxpYnJhcnlPYmplY3QgfHwge307Ly9UT0RPOiByZXNlYXJjaFxuXHR9O1xuXHRMaWJyYXJ5T2JqZWN0LnByb3RvdHlwZSA9IG5ldyBCYXNlT2JqZWN0KCk7XG5cdExpYnJhcnlPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTGlicmFyeU9iamVjdDtcblxuXHRyZXR1cm4gTGlicmFyeU9iamVjdDtcdFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ1NlY3Rpb25PYmplY3QnLCBmdW5jdGlvbiAoQmFzZU9iamVjdCwgU2hlbGZPYmplY3QsIERhdGEpIHtcblx0dmFyIFNlY3Rpb25PYmplY3QgPSBmdW5jdGlvbihwYXJhbXMsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuXHRcdEJhc2VPYmplY3QuY2FsbCh0aGlzLCBwYXJhbXMsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cblx0XHR0aGlzLnNoZWx2ZXMgPSB7fTtcblx0XHRmb3IodmFyIGtleSBpbiBwYXJhbXMuZGF0YS5zaGVsdmVzKSB7XG5cdFx0XHR0aGlzLnNoZWx2ZXNba2V5XSA9IG5ldyBTaGVsZk9iamVjdChwYXJhbXMuZGF0YS5zaGVsdmVzW2tleV0pOyBcblx0XHRcdHRoaXMuYWRkKHRoaXMuc2hlbHZlc1trZXldKTtcblx0XHR9XG5cdH07XG5cblx0U2VjdGlvbk9iamVjdC5UWVBFID0gJ1NlY3Rpb25PYmplY3QnO1xuXG5cdFNlY3Rpb25PYmplY3QucHJvdG90eXBlID0gbmV3IEJhc2VPYmplY3QoKTtcblx0U2VjdGlvbk9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZWN0aW9uT2JqZWN0O1xuXHRTZWN0aW9uT2JqZWN0LnByb3RvdHlwZS50eXBlID0gU2VjdGlvbk9iamVjdC5UWVBFO1xuXG5cdFNlY3Rpb25PYmplY3QucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgc2NvcGUgPSB0aGlzO1xuXG5cdFx0dGhpcy5kYXRhT2JqZWN0LnBvc194ID0gdGhpcy5wb3NpdGlvbi54O1xuXHRcdHRoaXMuZGF0YU9iamVjdC5wb3NfeSA9IHRoaXMucG9zaXRpb24ueTtcblx0XHR0aGlzLmRhdGFPYmplY3QucG9zX3ogPSB0aGlzLnBvc2l0aW9uLno7XG5cblx0XHR0aGlzLmRhdGFPYmplY3Qucm90YXRpb24gPSBbdGhpcy5yb3RhdGlvbi54LCB0aGlzLnJvdGF0aW9uLnksIHRoaXMucm90YXRpb24uel07XG5cblx0XHREYXRhLnBvc3RTZWN0aW9uKHRoaXMuZGF0YU9iamVjdCkudGhlbihmdW5jdGlvbiAoZHRvKSB7XG5cdFx0XHRzY29wZS5kYXRhT2JqZWN0ID0gZHRvO1xuXHRcdFx0c2NvcGUuY2hhbmdlZCA9IGZhbHNlO1xuXHRcdH0pLmNhdGNoKGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdC8vVE9ETzogaGlkZSBlZGl0LCBub3RpZnkgdXNlclxuXHRcdH0pO1xuXHR9O1xuXG5cdHJldHVybiBTZWN0aW9uT2JqZWN0O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ1NlbGVjdG9yTWV0YScsIGZ1bmN0aW9uICgpIHtcblx0dmFyIFNlbGVjdG9yTWV0YSA9IGZ1bmN0aW9uKHNlbGVjdGVkT2JqZWN0KSB7XG5cdFx0aWYoc2VsZWN0ZWRPYmplY3QpIHtcblx0XHRcdHRoaXMuaWQgPSBzZWxlY3RlZE9iamVjdC5pZDtcblx0XHRcdHRoaXMucGFyZW50SWQgPSBzZWxlY3RlZE9iamVjdC5wYXJlbnQuaWQ7XG5cdFx0XHR0aGlzLnR5cGUgPSBzZWxlY3RlZE9iamVjdC5nZXRUeXBlKCk7XG5cdFx0fVxuXHR9O1xuXG5cdFNlbGVjdG9yTWV0YS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAhdGhpcy5pZDtcblx0fTtcblxuXHRTZWxlY3Rvck1ldGEucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHRyZXR1cm4gISghbWV0YVxuXHRcdFx0XHR8fCBtZXRhLmlkICE9PSB0aGlzLmlkXG5cdFx0XHRcdHx8IG1ldGEucGFyZW50SWQgIT09IHRoaXMucGFyZW50SWRcblx0XHRcdFx0fHwgbWV0YS50eXBlICE9PSB0aGlzLnR5cGUpO1xuXHR9O1xuXHRcblx0cmV0dXJuIFNlbGVjdG9yTWV0YTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdTaGVsZk9iamVjdCcsIGZ1bmN0aW9uIChCYXNlT2JqZWN0KSB7XG5cdHZhciBTaGVsZk9iamVjdCA9IGZ1bmN0aW9uKHBhcmFtcykge1xuXHRcdHZhciBzaXplID0gcGFyYW1zLnNpemUgfHwgWzEsMSwxXTtcdFxuXHRcdHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtjb2xvcjogMHgwMGZmMDAsIHRyYW5zcGFyZW50OiB0cnVlLCBvcGFjaXR5OiAwLjJ9KTtcblx0XHRCYXNlT2JqZWN0LmNhbGwodGhpcywgcGFyYW1zLCBuZXcgVEhSRUUuQ3ViZUdlb21ldHJ5KHNpemVbMF0sIHNpemVbMV0sIHNpemVbMl0pLCBtYXRlcmlhbCk7XG5cblx0XHR0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMocGFyYW1zLnBvc2l0aW9uWzBdLCBwYXJhbXMucG9zaXRpb25bMV0sIHBhcmFtcy5wb3NpdGlvblsyXSk7XG5cdFx0dGhpcy5zaXplID0gbmV3IFRIUkVFLlZlY3RvcjMoc2l6ZVswXSwgc2l6ZVsxXSwgc2l6ZVsyXSk7XG5cdFx0dGhpcy52aXNpYmxlID0gZmFsc2U7XG5cdH07XG5cblx0U2hlbGZPYmplY3QuVFlQRSA9ICdTaGVsZk9iamVjdCc7XG5cblx0U2hlbGZPYmplY3QucHJvdG90eXBlID0gbmV3IEJhc2VPYmplY3QoKTtcblx0U2hlbGZPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2hlbGZPYmplY3Q7XG5cdFNoZWxmT2JqZWN0LnByb3RvdHlwZS50eXBlID0gU2hlbGZPYmplY3QuVFlQRTtcblxuXG5cdHJldHVybiBTaGVsZk9iamVjdDtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdoaWdobGlnaHQnLCBmdW5jdGlvbiAoZW52aXJvbm1lbnQpIHtcblx0dmFyIGhpZ2hsaWdodCA9IHt9O1xuXG5cdHZhciBQTEFORV9ST1RBVElPTiA9IE1hdGguUEkgKiAwLjU7XG5cdHZhciBQTEFORV9NVUxUSVBMSUVSID0gMjtcblx0dmFyIENPTE9SX1NFTEVDVCA9IDB4MDA1NTMzO1xuXHR2YXIgQ09MT1JfRk9DVVMgPSAweDAwMzM1NTtcblxuXHR2YXIgc2VsZWN0O1xuXHR2YXIgZm9jdXM7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgbWF0ZXJpYWxQcm9wZXJ0aWVzID0ge1xuXHRcdFx0bWFwOiBuZXcgVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZSggJ2ltZy9nbG93LnBuZycgKSxcblx0XHRcdHRyYW5zcGFyZW50OiB0cnVlLCBcblx0XHRcdHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG5cdFx0XHRibGVuZGluZzogVEhSRUUuQWRkaXRpdmVCbGVuZGluZyxcblx0XHRcdGRlcHRoVGVzdDogZmFsc2Vcblx0XHR9O1xuXG5cdFx0bWF0ZXJpYWxQcm9wZXJ0aWVzLmNvbG9yID0gQ09MT1JfU0VMRUNUO1xuXHRcdHZhciBtYXRlcmlhbFNlbGVjdCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbChtYXRlcmlhbFByb3BlcnRpZXMpO1xuXG5cdFx0bWF0ZXJpYWxQcm9wZXJ0aWVzLmNvbG9yID0gQ09MT1JfRk9DVVM7XG5cdFx0dmFyIG1hdGVyaWFsRm9jdXMgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwobWF0ZXJpYWxQcm9wZXJ0aWVzKTtcblxuXHRcdHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDEsIDEsIDEpO1xuXG5cdFx0c2VsZWN0ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsU2VsZWN0KTtcblx0XHRzZWxlY3Qucm90YXRpb24ueCA9IFBMQU5FX1JPVEFUSU9OO1xuXG5cdFx0Zm9jdXMgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxGb2N1cyk7XG5cdFx0Zm9jdXMucm90YXRpb24ueCA9IFBMQU5FX1JPVEFUSU9OO1xuXHR9O1xuXG5cdHZhciBjb21tb25IaWdobGlnaHQgPSBmdW5jdGlvbih3aGljaCwgb2JqKSB7XG5cdFx0aWYob2JqKSB7XG5cdFx0XHR2YXIgd2lkdGggPSBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnggKiBQTEFORV9NVUxUSVBMSUVSO1xuXHRcdFx0dmFyIGhlaWdodCA9IG9iai5nZW9tZXRyeS5ib3VuZGluZ0JveC5tYXgueiAqIFBMQU5FX01VTFRJUExJRVI7XG5cdFx0XHR2YXIgYm90dG9tID0gb2JqLmdlb21ldHJ5LmJvdW5kaW5nQm94Lm1pbi55ICsgZW52aXJvbm1lbnQuQ0xFQVJBTkNFO1xuXHRcdFx0XG5cdFx0XHR3aGljaC5wb3NpdGlvbi55ID0gYm90dG9tO1xuXHRcdFx0d2hpY2guc2NhbGUuc2V0KHdpZHRoLCBoZWlnaHQsIDEpO1xuXHRcdFx0b2JqLmFkZCh3aGljaCk7XG5cblx0XHRcdHdoaWNoLnZpc2libGUgPSB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aGljaC52aXNpYmxlID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0aGlnaGxpZ2h0LmZvY3VzID0gZnVuY3Rpb24ob2JqKSB7XG5cdFx0Y29tbW9uSGlnaGxpZ2h0KGZvY3VzLCBvYmopO1xuXHR9O1xuXG5cdGhpZ2hsaWdodC5zZWxlY3QgPSBmdW5jdGlvbihvYmopIHtcblx0XHRjb21tb25IaWdobGlnaHQoc2VsZWN0LCBvYmopO1xuXHR9O1xuXG5cdGluaXQoKTtcblxuXHRyZXR1cm4gaGlnaGxpZ2h0O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ1ZpcnR1YWxCb29rc2hlbGYnKVxuLmZhY3RvcnkoJ2xvY2F0b3InLCBmdW5jdGlvbiAoJHEsICRsb2csIFNlY3Rpb25PYmplY3QsIEJvb2tPYmplY3QsIERhdGEsIHNlbGVjdG9yLCBlbnZpcm9ubWVudCwgY2FjaGUpIHtcblx0dmFyIFZJU1VBTF9ERUJVRyA9IGZhbHNlO1xuXHR2YXIgbG9jYXRvciA9IHt9O1xuXG5cdGxvY2F0b3IucGxhY2VTZWN0aW9uID0gZnVuY3Rpb24oc2VjdGlvbkR0bykge1xuXHRcdHZhciBwcm9taXNlID0gY2FjaGUuZ2V0U2VjdGlvbihzZWN0aW9uRHRvLm1vZGVsKS50aGVuKGZ1bmN0aW9uIChzZWN0aW9uQ2FjaGUpIHtcblx0XHRcdHZhciBzZWN0aW9uQkIgPSBzZWN0aW9uQ2FjaGUuZ2VvbWV0cnkuYm91bmRpbmdCb3g7XG5cdFx0XHR2YXIgbGlicmFyeUJCID0gZW52aXJvbm1lbnQubGlicmFyeS5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblx0XHRcdHZhciBmcmVlUGxhY2UgPSBnZXRGcmVlUGxhY2UoZW52aXJvbm1lbnQubGlicmFyeS5jaGlsZHJlbiwgbGlicmFyeUJCLCBzZWN0aW9uQkIpO1xuXG5cdFx0XHRpZiAoZnJlZVBsYWNlKSB7XG5cdFx0XHRcdHJldHVybiBzYXZlU2VjdGlvbihzZWN0aW9uRHRvLCBmcmVlUGxhY2UpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0JHEucmVqZWN0KCd0aGVyZSBpcyBubyBmcmVlIHNwYWNlJyk7XG5cdFx0XHR9XG5cdFx0fSkudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gZW52aXJvbm1lbnQudXBkYXRlU2VjdGlvbihzZWN0aW9uRHRvKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBzYXZlU2VjdGlvbiA9IGZ1bmN0aW9uKGR0bywgcG9zaXRpb24pIHtcblx0XHRkdG8ubGlicmFyeUlkID0gZW52aXJvbm1lbnQubGlicmFyeS5pZDtcblx0XHRkdG8ucG9zX3ggPSBwb3NpdGlvbi54O1xuXHRcdGR0by5wb3NfeSA9IHBvc2l0aW9uLnk7XG5cdFx0ZHRvLnBvc196ID0gcG9zaXRpb24uejtcblxuXHRcdHJldHVybiBEYXRhLnBvc3RTZWN0aW9uKGR0byk7XG5cdH07XG5cblx0bG9jYXRvci5wbGFjZUJvb2sgPSBmdW5jdGlvbihib29rRHRvKSB7XG5cdFx0dmFyIHByb21pc2U7XG5cdFx0dmFyIHNoZWxmID0gc2VsZWN0b3IuaXNTZWxlY3RlZFNoZWxmKCkgJiYgc2VsZWN0b3IuZ2V0U2VsZWN0ZWRPYmplY3QoKTtcblxuXHRcdGlmKHNoZWxmKSB7XG5cdFx0XHRwcm9taXNlID0gY2FjaGUuZ2V0Qm9vayhib29rRHRvLm1vZGVsKS50aGVuKGZ1bmN0aW9uIChib29rQ2FjaGUpIHtcblx0XHRcdFx0dmFyIHNoZWxmQkIgPSBzaGVsZi5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblx0XHRcdFx0dmFyIGJvb2tCQiA9IGJvb2tDYWNoZS5nZW9tZXRyeS5ib3VuZGluZ0JveDtcblx0XHRcdFx0dmFyIGZyZWVQbGFjZSA9IGdldEZyZWVQbGFjZShzaGVsZi5jaGlsZHJlbiwgc2hlbGZCQiwgYm9va0JCKTtcblxuXHRcdFx0XHRpZihmcmVlUGxhY2UpIHtcblx0XHRcdFx0XHRyZXR1cm4gc2F2ZUJvb2soYm9va0R0bywgZnJlZVBsYWNlLCBzaGVsZik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuICRxLnJlamVjdCgndGhlcmUgaXMgbm8gZnJlZSBzcGFjZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0cmV0dXJuIGVudmlyb25tZW50LnVwZGF0ZUJvb2soYm9va0R0byk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cHJvbWlzZSA9ICRxLnJlamVjdCgnc2hlbGYgaXMgbm90IHNlbGVjdGVkJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblx0dmFyIHNhdmVCb29rID0gZnVuY3Rpb24oZHRvLCBwb3NpdGlvbiwgc2hlbGYpIHtcblx0XHRkdG8uc2hlbGZJZCA9IHNoZWxmLmlkO1xuXHRcdGR0by5zZWN0aW9uSWQgPSBzaGVsZi5wYXJlbnQuaWQ7XG5cdFx0ZHRvLnBvc194ID0gcG9zaXRpb24ueDtcblx0XHRkdG8ucG9zX3kgPSBwb3NpdGlvbi55O1xuXHRcdGR0by5wb3NfeiA9IHBvc2l0aW9uLno7XG5cblx0XHRyZXR1cm4gRGF0YS5wb3N0Qm9vayhkdG8pO1xuXHR9O1xuXG5cdGxvY2F0b3IudW5wbGFjZUJvb2sgPSBmdW5jdGlvbihib29rRHRvKSB7XG5cdFx0dmFyIHByb21pc2U7XG5cdFx0Ym9va0R0by5zZWN0aW9uSWQgPSBudWxsO1xuXG5cdFx0cHJvbWlzZSA9IERhdGEucG9zdEJvb2soYm9va0R0bykudGhlbihmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gZW52aXJvbm1lbnQudXBkYXRlQm9vayhib29rRHRvKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cdHZhciBnZXRGcmVlUGxhY2UgPSBmdW5jdGlvbihvYmplY3RzLCBzcGFjZUJCLCB0YXJnZXRCQikge1xuXHRcdHZhciBtYXRyaXhQcmVjaXNpb24gPSBuZXcgVEhSRUUuVmVjdG9yMyh0YXJnZXRCQi5tYXgueCAtIHRhcmdldEJCLm1pbi54LCAwLCB0YXJnZXRCQi5tYXgueiAtIHRhcmdldEJCLm1pbi56KTtcblx0XHR2YXIgb2NjdXBpZWRNYXRyaXggPSBnZXRPY2N1cGllZE1hdHJpeChvYmplY3RzLCBtYXRyaXhQcmVjaXNpb24pO1xuXHRcdHZhciBmcmVlUG9zaXRpb24gPSBnZXRGcmVlTWF0cml4Q2VsbHMob2NjdXBpZWRNYXRyaXgsIHNwYWNlQkIsIHRhcmdldEJCLCBtYXRyaXhQcmVjaXNpb24pO1xuXHRcdFxuXHRcdGlmIChWSVNVQUxfREVCVUcpIHtcblx0XHRcdGRlYnVnU2hvd0ZyZWUoZnJlZVBvc2l0aW9uLCBtYXRyaXhQcmVjaXNpb24sIGVudmlyb25tZW50LmxpYnJhcnkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBmcmVlUG9zaXRpb247XG5cdH07XG5cblx0dmFyIGdldEZyZWVNYXRyaXhDZWxscyA9IGZ1bmN0aW9uKG9jY3VwaWVkTWF0cml4LCBzcGFjZUJCLCB0YXJnZXRCQiwgbWF0cml4UHJlY2lzaW9uKSB7XG5cdFx0dmFyIHRhcmdldENlbGxzU2l6ZSA9IDE7XG5cdFx0dmFyIGZyZWVDZWxsc0NvdW50ID0gMDtcblx0XHR2YXIgZnJlZUNlbGxzU3RhcnQ7XG5cdFx0dmFyIHhJbmRleDtcblx0XHR2YXIgekluZGV4O1xuXHRcdHZhciBjZWxscztcblxuXHRcdHZhciBtaW5YQ2VsbCA9IE1hdGguZmxvb3Ioc3BhY2VCQi5taW4ueCAvIG1hdHJpeFByZWNpc2lvbi54KSArIDE7XG5cdFx0dmFyIG1heFhDZWxsID0gTWF0aC5mbG9vcihzcGFjZUJCLm1heC54IC8gbWF0cml4UHJlY2lzaW9uLngpO1xuXHRcdHZhciBtaW5aQ2VsbCA9IE1hdGguZmxvb3Ioc3BhY2VCQi5taW4ueiAvIG1hdHJpeFByZWNpc2lvbi56KSArIDE7XG5cdFx0dmFyIG1heFpDZWxsID0gTWF0aC5mbG9vcihzcGFjZUJCLm1heC56IC8gbWF0cml4UHJlY2lzaW9uLnopO1xuXG5cdFx0Zm9yICh6SW5kZXggPSBtaW5aQ2VsbDsgekluZGV4IDw9IG1heFpDZWxsOyB6SW5kZXgrKykge1xuXHRcdFx0Zm9yICh4SW5kZXggPSBtaW5YQ2VsbDsgeEluZGV4IDw9IG1heFhDZWxsOyB4SW5kZXgrKykge1xuXHRcdFx0XHRpZiAoIW9jY3VwaWVkTWF0cml4W3pJbmRleF1beEluZGV4XSkge1xuXHRcdFx0XHRcdGZyZWVDZWxsc1N0YXJ0IHx8IChmcmVlQ2VsbHNTdGFydCA9IHhJbmRleCk7XG5cdFx0XHRcdFx0ZnJlZUNlbGxzQ291bnQrKztcblxuXHRcdFx0XHRcdGlmIChmcmVlQ2VsbHNDb3VudCA9PT0gdGFyZ2V0Q2VsbHNTaXplKSB7XG5cdFx0XHRcdFx0XHRjZWxscyA9IF8ucmFuZ2UoZnJlZUNlbGxzU3RhcnQsIGZyZWVDZWxsc1N0YXJ0ICsgZnJlZUNlbGxzQ291bnQpO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGdldFBvc2l0aW9uRnJvbUNlbGxzKGNlbGxzLCB6SW5kZXgsIG1hdHJpeFByZWNpc2lvbiwgc3BhY2VCQiwgdGFyZ2V0QkIpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRmcmVlQ2VsbHNDb3VudCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fTtcblxuXHR2YXIgZ2V0UG9zaXRpb25Gcm9tQ2VsbHMgPSBmdW5jdGlvbihjZWxscywgekluZGV4LCBtYXRyaXhQcmVjaXNpb24sIHNwYWNlQkIsIHRhcmdldEJCKSB7XG5cdFx0dmFyIHNpemUgPSBjZWxscy5sZW5ndGggKiBtYXRyaXhQcmVjaXNpb24ueDtcblx0XHR2YXIgeCA9IGNlbGxzWzBdICogbWF0cml4UHJlY2lzaW9uLng7XG5cdFx0dmFyIHogPVx0ekluZGV4ICogbWF0cml4UHJlY2lzaW9uLno7XG5cdFx0dmFyIHkgPSBnZXRCb3R0b21ZKHNwYWNlQkIsIHRhcmdldEJCKTtcblxuXHRcdHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMyh4LCB5LCB6KTtcblx0fTtcblxuXHR2YXIgZ2V0Qm90dG9tWSA9IGZ1bmN0aW9uKHNwYWNlQkIsIHRhcmdldEJCKSB7XG5cdFx0cmV0dXJuIHNwYWNlQkIubWluLnkgLSB0YXJnZXRCQi5taW4ueSArIGVudmlyb25tZW50LkNMRUFSQU5DRTtcblx0fTtcblxuXHR2YXIgZ2V0T2NjdXBpZWRNYXRyaXggPSBmdW5jdGlvbihvYmplY3RzLCBtYXRyaXhQcmVjaXNpb24pIHtcblx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0dmFyIG9iamVjdEJCO1xuXHRcdHZhciBtaW5LZXlYO1xuXHRcdHZhciBtYXhLZXlYO1xuXHRcdHZhciBtaW5LZXlaO1xuXHRcdHZhciBtYXhLZXlaO1x0XHRcblx0XHR2YXIgejtcblxuXHRcdG9iamVjdHMuZm9yRWFjaChmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHRpZiAob2JqIGluc3RhbmNlb2YgU2VjdGlvbk9iamVjdCB8fCBvYmogaW5zdGFuY2VvZiBCb29rT2JqZWN0KSB7XG5cdFx0XHRcdG9iamVjdEJCID0gb2JqLmJvdW5kaW5nQm94O1xuXG5cdFx0XHRcdG1pbktleVggPSBNYXRoLnJvdW5kKChvYmplY3RCQi5jZW50ZXIueCAtIG9iamVjdEJCLnJhZGl1cy54KSAvIG1hdHJpeFByZWNpc2lvbi54KTtcblx0XHRcdFx0bWF4S2V5WCA9IE1hdGgucm91bmQoKG9iamVjdEJCLmNlbnRlci54ICsgb2JqZWN0QkIucmFkaXVzLngpIC8gbWF0cml4UHJlY2lzaW9uLngpO1xuXHRcdFx0XHRtaW5LZXlaID0gTWF0aC5yb3VuZCgob2JqZWN0QkIuY2VudGVyLnogLSBvYmplY3RCQi5yYWRpdXMueikgLyBtYXRyaXhQcmVjaXNpb24ueik7XG5cdFx0XHRcdG1heEtleVogPSBNYXRoLnJvdW5kKChvYmplY3RCQi5jZW50ZXIueiArIG9iamVjdEJCLnJhZGl1cy56KSAvIG1hdHJpeFByZWNpc2lvbi56KTtcblxuXHRcdFx0XHRmb3IgKHogPSBtaW5LZXlaOyB6IDw9IG1heEtleVo7IHorKykge1xuXHRcdFx0XHRcdHJlc3VsdFt6XSB8fCAocmVzdWx0W3pdID0ge30pO1xuXHRcdFx0XHRcdHJlc3VsdFt6XVttaW5LZXlYXSA9IHRydWU7XG5cdFx0XHRcdFx0cmVzdWx0W3pdW21heEtleVhdID0gdHJ1ZTtcblxuXHRcdFx0XHRcdGlmIChWSVNVQUxfREVCVUcpIHtcblx0XHRcdFx0XHRcdGRlYnVnU2hvd0JCKG9iaik7XG5cdFx0XHRcdFx0XHRkZWJ1Z0FkZE9jY3VwaWVkKFttaW5LZXlYLCBtYXhLZXlYXSwgbWF0cml4UHJlY2lzaW9uLCBvYmosIHopO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcblxuXHR2YXIgZGVidWdTaG93QkIgPSBmdW5jdGlvbihvYmopIHtcblx0XHR2YXIgb2JqZWN0QkIgPSBvYmouYm91bmRpbmdCb3g7XG5cdFx0dmFyIG9iakJveCA9IG5ldyBUSFJFRS5NZXNoKFxuXHRcdFx0bmV3IFRIUkVFLkN1YmVHZW9tZXRyeShcblx0XHRcdFx0b2JqZWN0QkIucmFkaXVzLnggKiAyLCBcblx0XHRcdFx0b2JqZWN0QkIucmFkaXVzLnkgKiAyICsgMC4xLCBcblx0XHRcdFx0b2JqZWN0QkIucmFkaXVzLnogKiAyXG5cdFx0XHQpLCBcblx0XHRcdG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcblx0XHRcdFx0Y29sb3I6IDB4YmJiYmZmLFxuXHRcdFx0XHRvcGFjaXR5OiAwLjIsXG5cdFx0XHRcdHRyYW5zcGFyZW50OiB0cnVlXG5cdFx0XHR9KVxuXHRcdCk7XG5cdFx0XG5cdFx0b2JqQm94LnBvc2l0aW9uLnggPSBvYmplY3RCQi5jZW50ZXIueDtcblx0XHRvYmpCb3gucG9zaXRpb24ueSA9IG9iamVjdEJCLmNlbnRlci55O1xuXHRcdG9iakJveC5wb3NpdGlvbi56ID0gb2JqZWN0QkIuY2VudGVyLno7XG5cblx0XHRvYmoucGFyZW50LmFkZChvYmpCb3gpO1xuXHR9O1xuXG5cdHZhciBkZWJ1Z0FkZE9jY3VwaWVkID0gZnVuY3Rpb24oY2VsbHMsIG1hdHJpeFByZWNpc2lvbiwgb2JqLCB6S2V5KSB7XG5cdFx0Y2VsbHMuZm9yRWFjaChmdW5jdGlvbiAoY2VsbCkge1xuXHRcdFx0dmFyIHBvcyA9IGdldFBvc2l0aW9uRnJvbUNlbGxzKFtjZWxsXSwgektleSwgbWF0cml4UHJlY2lzaW9uLCBvYmoucGFyZW50Lmdlb21ldHJ5LmJvdW5kaW5nQm94LCBvYmouZ2VvbWV0cnkuYm91bmRpbmdCb3gpXG5cdFx0XHR2YXIgY2VsbEJveCA9IG5ldyBUSFJFRS5NZXNoKG5ldyBUSFJFRS5DdWJlR2VvbWV0cnkobWF0cml4UHJlY2lzaW9uLnggLSAwLjAxLCAwLjAxLCBtYXRyaXhQcmVjaXNpb24ueiAtIDAuMDEpLCBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7Y29sb3I6IDB4ZmYwMDAwfSkpO1xuXHRcdFx0XG5cdFx0XHRjZWxsQm94LnBvc2l0aW9uID0gcG9zO1xuXHRcdFx0b2JqLnBhcmVudC5hZGQoY2VsbEJveCk7XG5cdFx0fSk7XG5cdH07XG5cblx0dmFyIGRlYnVnU2hvd0ZyZWUgPSBmdW5jdGlvbihwb3NpdGlvbiwgbWF0cml4UHJlY2lzaW9uLCBvYmopIHtcblx0XHRpZiAocG9zaXRpb24pIHtcblx0XHRcdHZhciBjZWxsQm94ID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkN1YmVHZW9tZXRyeShtYXRyaXhQcmVjaXNpb24ueCwgMC41LCBtYXRyaXhQcmVjaXNpb24ueiksIG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtjb2xvcjogMHgwMGZmMDB9KSk7XG5cdFx0XHRjZWxsQm94LnBvc2l0aW9uID0gcG9zaXRpb247XG5cdFx0XHRvYmoucGFyZW50LmFkZChjZWxsQm94KTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIGxvY2F0b3I7XHRcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdWaXJ0dWFsQm9va3NoZWxmJylcbi5mYWN0b3J5KCdzZWxlY3RvcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBTZWxlY3Rvck1ldGEsIEJvb2tPYmplY3QsIFNoZWxmT2JqZWN0LCBTZWN0aW9uT2JqZWN0LCBDYW1lcmEsIGVudmlyb25tZW50LCBoaWdobGlnaHQpIHtcblx0dmFyIHNlbGVjdG9yID0ge307XG5cdFxuXHR2YXIgc2VsZWN0ZWQgPSBuZXcgU2VsZWN0b3JNZXRhKCk7XG5cdHZhciBmb2N1c2VkID0gbmV3IFNlbGVjdG9yTWV0YSgpO1xuXG5cdHNlbGVjdG9yLmZvY3VzID0gZnVuY3Rpb24obWV0YSkge1xuXHRcdGlmKCFtZXRhLmVxdWFscyhmb2N1c2VkKSkge1xuXHRcdFx0aWYoIWZvY3VzZWQuZXF1YWxzKHNlbGVjdGVkKSkge1xuXHRcdFx0XHRoaWdobGlnaHQuZm9jdXMobnVsbCk7XG5cdFx0XHR9XG5cblx0XHRcdGZvY3VzZWQgPSBtZXRhO1xuXG5cdFx0XHRpZighZm9jdXNlZC5pc0VtcHR5KCkgJiYgIWZvY3VzZWQuZXF1YWxzKHNlbGVjdGVkKSkge1xuXHRcdFx0XHR2YXIgb2JqID0gZ2V0T2JqZWN0KGZvY3VzZWQpO1xuXHRcdFx0XHRoaWdobGlnaHQuZm9jdXMob2JqKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0c2VsZWN0b3Iuc2VsZWN0Rm9jdXNlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBtZXRhID0gZm9jdXNlZDtcblxuXHRcdHNlbGVjdG9yLnNlbGVjdChtZXRhKTtcblx0XHQkcm9vdFNjb3BlLiRhcHBseSgpO1xuXHR9O1xuXG5cdHNlbGVjdG9yLnNlbGVjdCA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHRpZighbWV0YS5lcXVhbHMoc2VsZWN0ZWQpKSB7XG5cdFx0XHRzZWxlY3Rvci51bnNlbGVjdCgpO1xuXHRcdFx0c2VsZWN0ZWQgPSBtZXRhO1xuXG5cdFx0XHR2YXIgb2JqID0gZ2V0T2JqZWN0KHNlbGVjdGVkKTtcblx0XHRcdGhpZ2hsaWdodC5zZWxlY3Qob2JqKTtcblx0XHRcdGhpZ2hsaWdodC5mb2N1cyhudWxsKTtcblx0XHR9XG5cdH07XG5cblx0c2VsZWN0b3IudW5zZWxlY3QgPSBmdW5jdGlvbigpIHtcblx0XHRpZighc2VsZWN0ZWQuaXNFbXB0eSgpKSB7XG5cdFx0XHRoaWdobGlnaHQuc2VsZWN0KG51bGwpO1xuXHRcdFx0c2VsZWN0ZWQgPSBuZXcgU2VsZWN0b3JNZXRhKCk7XG5cdFx0fVxuXHR9O1xuXG5cdHNlbGVjdG9yLmdldFNlbGVjdGVkT2JqZWN0ID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGdldE9iamVjdChzZWxlY3RlZCk7XG5cdH07XG5cblx0dmFyIGdldE9iamVjdCA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHR2YXIgb2JqZWN0O1xuXG5cdFx0aWYoIW1ldGEuaXNFbXB0eSgpKSB7XG5cdFx0XHRvYmplY3QgPSBpc1NoZWxmKG1ldGEpID8gZW52aXJvbm1lbnQuZ2V0U2hlbGYobWV0YS5wYXJlbnRJZCwgbWV0YS5pZClcblx0XHRcdFx0OiBpc0Jvb2sobWV0YSkgPyBlbnZpcm9ubWVudC5nZXRCb29rKG1ldGEuaWQpXG5cdFx0XHRcdDogaXNTZWN0aW9uKG1ldGEpID8gZW52aXJvbm1lbnQuZ2V0U2VjdGlvbihtZXRhLmlkKVxuXHRcdFx0XHQ6IG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9iamVjdDtcdFxuXHR9O1xuXG5cdHNlbGVjdG9yLmlzQm9va1NlbGVjdGVkID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gaXNCb29rKHNlbGVjdGVkKSAmJiBzZWxlY3RlZC5pZCA9PT0gaWQ7XG5cdH07XG5cblx0c2VsZWN0b3IuaXNTZWxlY3RlZFNoZWxmID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGlzU2hlbGYoc2VsZWN0ZWQpO1xuXHR9O1xuXG5cdHNlbGVjdG9yLmlzU2VsZWN0ZWRCb29rID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGlzQm9vayhzZWxlY3RlZCk7XG5cdH07XG5cblx0c2VsZWN0b3IuaXNTZWxlY3RlZFNlY3Rpb24gPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gaXNTZWN0aW9uKHNlbGVjdGVkKTtcblx0fTtcblxuXHR2YXIgaXNTaGVsZiA9IGZ1bmN0aW9uKG1ldGEpIHtcblx0XHRyZXR1cm4gbWV0YS50eXBlID09PSBTaGVsZk9iamVjdC5UWVBFO1xuXHR9O1xuXG5cdHZhciBpc0Jvb2sgPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0cmV0dXJuIG1ldGEudHlwZSA9PT0gQm9va09iamVjdC5UWVBFO1xuXHR9O1xuXG5cdHZhciBpc1NlY3Rpb24gPSBmdW5jdGlvbihtZXRhKSB7XG5cdFx0cmV0dXJuIG1ldGEudHlwZSA9PT0gU2VjdGlvbk9iamVjdC5UWVBFO1xuXHR9O1xuXG5cdHJldHVybiBzZWxlY3Rvcjtcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==