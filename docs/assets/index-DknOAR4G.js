var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,o)=>(o=n==null?{}:e(i(n)),s(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var l=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.for(`react.view_transition`),m=Symbol.iterator;function h(e){return typeof e!=`object`||!e?null:(e=m&&e[m]||e[`@@iterator`],typeof e==`function`?e:null)}var g={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},_=Object.assign,v={};function y(e,t,n){this.props=e,this.context=t,this.refs=v,this.updater=n||g}y.prototype.isReactComponent={},y.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},y.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function b(){}b.prototype=y.prototype;function x(e,t,n){this.props=e,this.context=t,this.refs=v,this.updater=n||g}var S=x.prototype=new b;S.constructor=x,_(S,y.prototype),S.isPureReactComponent=!0;var C=Array.isArray;function w(){}var T={H:null,A:null,T:null,S:null},ee=Object.prototype.hasOwnProperty;function E(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function te(e,t){return E(e.type,t,e.props)}function D(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function ne(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var O=/\/+/g;function re(e,t){return typeof e==`object`&&e&&e.key!=null?ne(``+e.key):t.toString(36)}function ie(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(w,w):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function ae(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,ae(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+re(e,0):a,C(o)?(i=``,c!=null&&(i=c.replace(O,`$&/`)+`/`),ae(o,r,i,``,function(e){return e})):o!=null&&(D(o)&&(o=te(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(O,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(C(e))for(var u=0;u<e.length;u++)a=e[u],s=l+re(a,u),c+=ae(a,r,i,s,o);else if(u=h(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+re(a,u++),c+=ae(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return ae(ie(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function k(e,t,n){if(e==null)return e;var r=[],i=0;return ae(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function A(e){if(e._status===-1){var t=e._result,n=t();n.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t,n.status===void 0&&(n.status=`fulfilled`,n.value=t))},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t,n.status===void 0&&(n.status=`rejected`,n.reason=t))}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var oe=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)};function se(e){var t=T.T,n={};n.types=t===null?null:t.types,T.T=n;try{var r=e(),i=T.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(w,oe)}catch(e){oe(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),T.T=t}}function ce(e){var t=T.T;if(t!==null){var n=t.types;n===null?t.types=[e]:n.indexOf(e)===-1&&n.push(e)}else se(ce.bind(null,e))}var j={map:k,forEach:function(e,t,n){k(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return k(e,function(){t++}),t},toArray:function(e){return k(e,function(e){return e})||[]},only:function(e){if(!D(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=j,e.Component=y,e.Fragment=r,e.Profiler=a,e.PureComponent=x,e.StrictMode=i,e.Suspense=l,e.ViewTransition=p,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=T,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return T.H.useMemoCache(e)}},e.addTransitionType=ce,e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=_({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!ee.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return E(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)ee.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return E(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=D,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:A}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=se,e.unstable_useCacheRefresh=function(){return T.H.useCacheRefresh()},e.use=function(e){return T.H.use(e)},e.useActionState=function(e,t,n){return T.H.useActionState(e,t,n)},e.useCallback=function(e,t){return T.H.useCallback(e,t)},e.useContext=function(e){return T.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return T.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return T.H.useEffect(e,t)},e.useEffectEvent=function(e){return T.H.useEffectEvent(e)},e.useId=function(){return T.H.useId()},e.useImperativeHandle=function(e,t,n){return T.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return T.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return T.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return T.H.useMemo(e,t)},e.useOptimistic=function(e,t){return T.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return T.H.useReducer(e,t,n)},e.useRef=function(e){return T.H.useRef(e)},e.useState=function(e){return T.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return T.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return T.H.useTransition()},e.version=`19.3.1`})),u=o(((e,t)=>{t.exports=l()})),d=o((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function x(e){if(h=!1,b(e),!m){if(n(c)!==null)m=!0,S||(S=!0,te());else{var t=n(l);t!==null&&O(x,t.startTime-e)}}}var S=!1,C=-1,w=5,T=-1;function ee(){return g?!0:!(e.unstable_now()-T<w)}function E(){if(g=!1,S){var t=e.unstable_now();T=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(C),C=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&ee());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&O(x,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}i=void 0}}finally{i?te():S=!1}}}var te;if(typeof y==`function`)te=function(){y(E)};else if(typeof MessageChannel<`u`){var D=new MessageChannel,ne=D.port2;D.port1.onmessage=E,te=function(){ne.postMessage(null)}}else te=function(){_(E,0)};function O(t,n){C=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):w=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(C),C=-1):h=!0,O(x,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,S||(S=!0,te()))),r},e.unstable_shouldYield=ee,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),f=o(((e,t)=>{t.exports=d()})),p=o((e=>{var t=u();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function r(){}var i={d:{f:r,r:function(){throw Error(n(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},a=Symbol.for(`react.portal`),o=Symbol.for(`react.recoverable`),s=Symbol.for(`react.optimistic_key`);function c(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:a,key:r==null?null:r===s?s:``+r,children:e,containerInfo:t,implementation:n}}var l=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function d(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,e.browser=function(e){return{$$typeof:o,_reason:e}},e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return c(e,t,null,r)},e.flushSync=function(e){var t=l.T,n=i.p;try{if(l.T=null,i.p=2,e)return e()}finally{l.T=t,i.p=n,i.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,i.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&i.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=d(n,t.crossOrigin),a=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?i.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:a,fetchPriority:o}):n===`script`&&i.d.X(e,{crossOrigin:r,integrity:a,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`){if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=d(t.as,t.crossOrigin);i.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0})}}else t??i.d.M(e)}},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=d(n,t.crossOrigin);i.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`){if(t){var n=d(t.as,t.crossOrigin);i.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0})}else i.d.m(e)}},e.requestFormReset=function(e){i.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return l.H.useFormState(e,t,n)},e.useFormStatus=function(){return l.H.useHostTransitionStatus()},e.version=`19.3.1`})),m=o(((e,t)=>{function n(){if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE==`function`)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=p()})),h=o((e=>{var t=f(),n=u(),r=m();function i(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function a(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function o(e){for(var t=e,n=t;n&&!n.alternate;)t=n,t.flags&4098&&(e=t.return),n=t.return;for(;t.return;)t=t.return;return t.tag===3?e:null}function s(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function c(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function l(e){if(o(e)!==e)throw Error(i(188))}function d(e){var t=e.alternate;if(!t){if(t=o(e),t===null)throw Error(i(188));return t===e?e:null}for(var n=e,r=t;;){var a=n.return;if(a===null)break;var s=a.alternate;if(s===null){if(r=a.return,r!==null){n=r;continue}break}if(a.child===s.child){for(s=a.child;s;){if(s===n)return l(a),e;if(s===r)return l(a),t;s=s.sibling}throw Error(i(188))}if(n.return!==r.return)n=a,r=s;else{for(var c=!1,u=a.child;u;){if(u===n){c=!0,n=a,r=s;break}if(u===r){c=!0,r=a,n=s;break}u=u.sibling}if(!c){for(u=s.child;u;){if(u===n){c=!0,n=s,r=a;break}if(u===r){c=!0,r=s,n=a;break}u=u.sibling}if(!c)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function p(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=p(e),t!==null)return t;e=e.sibling}return null}function h(e,t,n,r,i,a){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&n(e,r,i,a)||(e.tag!==22||e.memoizedState===null)&&(t||e.tag!==5&&e.tag!==27)&&h(e.child,t,n,r,i,a))return!0;e=e.sibling}return!1}function g(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function _(e){var t=!1;for(e=e.return;e!==null&&(e.tag===4&&(t=!0),e.tag!==3&&e.tag!==5&&e.tag!==27);)e=e.return;return t}function v(e){var t=[null,null],n=g(e);return n===null||y(t,e,n.child,{foundSelf:!1}),t}function y(e,t,n,r){for(;n!==null;){if(n===t)r.foundSelf=!0;else if(n.tag===5||n.tag===27||n.tag===6){if(r.foundSelf)return e[1]=n,!0;e[0]=n}else if((n.tag!==22||n.memoizedState===null)&&y(e,t,n.child,r))return!0;n=n.sibling}return!1}function b(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(i(559))}}var x=null,S=null;function C(e,t,n){return e===n||e===t&&(x=e,!0)}function w(e,t,n){return e===n?(S=e,!1):e===t&&(S!==null&&(x=e),!0)}function T(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function ee(e,t,n){for(var r=0,i=e;i;i=n(i))r++;i=0;for(var a=t;a;a=n(a))i++;for(;0<r-i;)e=n(e),r--;for(;0<i-r;)t=n(t),i--;for(;r--;){if(e===t||t!==null&&e===t.alternate)return e;e=n(e),t=n(t)}return null}var E=Object.assign,te=Symbol.for(`react.element`),D=Symbol.for(`react.transitional.element`),ne=Symbol.for(`react.portal`),O=Symbol.for(`react.fragment`),re=Symbol.for(`react.strict_mode`),ie=Symbol.for(`react.profiler`),ae=Symbol.for(`react.consumer`),k=Symbol.for(`react.context`),A=Symbol.for(`react.forward_ref`),oe=Symbol.for(`react.suspense`),se=Symbol.for(`react.suspense_list`),ce=Symbol.for(`react.memo`),j=Symbol.for(`react.lazy`),le=Symbol.for(`react.activity`),ue=Symbol.for(`react.legacy_hidden`),de=Symbol.for(`react.memo_cache_sentinel`),fe=Symbol.for(`react.view_transition`),pe=Symbol.for(`react.recoverable`),me=Symbol.iterator;function M(e){return typeof e!=`object`||!e?null:(e=me&&e[me]||e[`@@iterator`],typeof e==`function`?e:null)}var he=Symbol.for(`react.client.reference`);function ge(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===he?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case O:return`Fragment`;case ie:return`Profiler`;case re:return`StrictMode`;case oe:return`Suspense`;case se:return`SuspenseList`;case le:return`Activity`;case fe:return`ViewTransition`}if(typeof e==`object`)switch(e.$$typeof){case ne:return`Portal`;case k:return e.displayName||`Context`;case ae:return(e._context.displayName||`Context`)+`.Consumer`;case A:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case ce:return t=e.displayName||null,t===null?ge(e.type)||`Memo`:t;case j:t=e._payload,e=e._init;try{return ge(e(t))}catch{}}return null}var _e=Array.isArray,N=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,P=r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ve={pending:!1,data:null,method:null,action:null},ye=[],be=-1;function xe(e){return{current:e}}function F(e){0>be||(e.current=ye[be],ye[be]=null,be--)}function I(e,t){be++,ye[be]=e.current,e.current=t}var Se=xe(null),Ce=xe(null),we=xe(null),Te=xe(null);function Ee(e,t){switch(I(we,t),I(Ce,e),I(Se,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?up(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=up(t),e=dp(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}F(Se),I(Se,e)}function L(){F(Se),F(Ce),F(we)}function De(e){var t=e.memoizedState;t!==null&&(sh._currentValue=t.memoizedState,I(Te,e)),t=Se.current;var n=dp(t,e.type);t!==n&&(I(Ce,e),I(Se,n))}function Oe(e){Ce.current===e&&(F(Se),F(Ce)),Te.current===e&&(F(Te),sh._currentValue=ve)}var ke,Ae;function je(e){if(ke===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);ke=t&&t[1]||``,Ae=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+ke+e+Ae}var Me=!1;function Ne(e,t){if(!e||Me)return``;Me=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}n=!1;try{var i=Object.getOwnPropertyDescriptor(e.prototype,`props`);Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),n=!0,new e}finally{n&&(i===void 0?delete e.prototype.props:Object.defineProperty(e.prototype,"props",i))}}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{Me=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?je(n):``}function Pe(e,t){switch(e.tag){case 26:case 27:case 5:return je(e.type);case 16:return je(`Lazy`);case 13:return e.child!==t&&t!==null?je(`Suspense Fallback`):je(`Suspense`);case 19:return je(`SuspenseList`);case 0:case 15:return Ne(e.type,!1);case 11:return Ne(e.type.render,!1);case 1:return Ne(e.type,!0);case 31:return je(`Activity`);case 30:return je(`ViewTransition`);default:return``}}function Fe(e){try{var t=``,n=null;do t+=Pe(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var Ie=Object.prototype.hasOwnProperty,Le=t.unstable_scheduleCallback,Re=t.unstable_cancelCallback,ze=t.unstable_shouldYield,Be=t.unstable_requestPaint,R=t.unstable_now,Ve=t.unstable_getCurrentPriorityLevel,He=t.unstable_ImmediatePriority,Ue=t.unstable_UserBlockingPriority,We=t.unstable_NormalPriority,Ge=t.unstable_LowPriority,Ke=t.unstable_IdlePriority,qe=t.log,Je=t.unstable_setDisableYieldValue,Ye=null,Xe=null;function Ze(e){if(typeof qe==`function`&&Je(e),Xe&&typeof Xe.setStrictMode==`function`)try{Xe.setStrictMode(Ye,e)}catch{}}var z=Math.clz32?Math.clz32:et,Qe=Math.log,$e=Math.LN2;function et(e){return e>>>=0,e===0?32:31-(Qe(e)/$e|0)|0}var tt=256,nt=262144,B=4194304;function rt(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function it(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=rt(n))):i=rt(o):i=rt(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=rt(n))):i=rt(o)):i=rt(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function at(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function ot(e,t){t&8&&(t|=t&32);var n=e.entangledLanes;if(n!==0)for(e=e.entanglements,n&=t;0<n;){var r=31-z(n),i=1<<r;t|=e[r],n&=~i}return t}function st(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ct(){var e=B;return B<<=1,!(B&62914560)&&(B=4194304),e}function lt(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function ut(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function dt(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-z(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&ft(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function ft(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-z(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function pt(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-z(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function mt(e,t){var n=t&-t;return n=n&42?1:ht(n),(n&(e.suspendedLanes|t))===0?n:0}function ht(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function gt(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function _t(){var e=P.p;return e===0?(e=window.event,e===void 0?32:Ch(e.type)):e}function vt(e,t){var n=P.p;try{return P.p=e,t()}finally{P.p=n}}var yt=Math.random().toString(36).slice(2),bt=`__reactFiber$`+yt,xt=`__reactProps$`+yt,St=`__reactContainer$`+yt,Ct=`__reactEvents$`+yt,wt=`__reactListeners$`+yt,Tt=`__reactHandles$`+yt,Et=`__reactResources$`+yt,Dt=`__reactMarker$`+yt,Ot=`__reactLoad$`+yt;function kt(e){delete e[bt],delete e[xt],delete e[wt],delete e[Tt]}function At(e){var t;if(t=e[bt])return t;for(var n=e.parentNode;n;){if(t=n[St]||n[bt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=fm(e);e!==null;){if(n=e[bt])return n;e=fm(e)}return t}e=n,n=e.parentNode}return null}function jt(e){if(e=e[bt]||e[St]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Mt(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(i(33))}function Nt(e){var t=e[Et];return t||=e[Et]={hoistableStyles:new Map,hoistableScripts:new Map},t}function Pt(e){e[Dt]=!0}function Ft(e){e[Ot]=void 0}var It=new Set,Lt={};function Rt(e,t){zt(e,t),zt(e+`Capture`,t)}function zt(e,t){for(Lt[e]=t,e=0;e<t.length;e++)It.add(t[e])}var Bt=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),Vt={},Ht={};function Ut(e){return Ie.call(Ht,e)?!0:Ie.call(Vt,e)?!1:Bt.test(e)?Ht[e]=!0:(Vt[e]=!0,!1)}var V=!1;function Wt(){var e=V;return V=!1,e}function H(e,t,n){if(Ut(t)){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,n)}}}function Gt(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,n)}}function Kt(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,r)}}function U(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function qt(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function W(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function G(e){if(!e._valueTracker){var t=qt(e)?`checked`:`value`;e._valueTracker=W(e,t,``+e[t])}}function Jt(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=qt(e)?e.checked?`true`:`false`:e.value),e=r,e!==n&&(t.setValue(e),!0)}var Yt=/[\n"\\]/g;function Xt(e){return e.replace(Yt,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function Zt(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+U(t)):e.value!==``+U(t)&&(e.value=``+U(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):$t(e,U(n)):o===`number`&&e.value==t?$t(e,U(e.value)):$t(e,U(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+U(s):e.removeAttribute(`name`)}function Qt(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){G(e);return}n=n==null?``:``+U(n),t=t==null?n:``+U(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),G(e)}function $t(e,t){e.defaultValue!==``+t&&(e.defaultValue=``+t)}function en(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+U(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function tn(e,t,n){t!=null&&(t=``+U(t),t!==e.value&&(e.value=t),n==null)?e.defaultValue!==t&&(e.defaultValue=t):e.defaultValue=n==null?``:``+U(n)}function nn(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(i(92));if(_e(r)){if(1<r.length)throw Error(i(93));r=r[0]}n=r}n??=``,t=n}n=U(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),G(e)}function rn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var an=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function on(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||an.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function sn(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(i(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``,V=!0);for(var a in t)r=t[a],t.hasOwnProperty(a)&&n[a]!==r&&(on(e,a,r),V=!0)}else for(var o in t)t.hasOwnProperty(o)&&on(e,o,t[o])}function K(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var cn=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`maskType`,`mask-type`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),ln=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function un(e){return ln.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function dn(){}var fn=null;function pn(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var mn=null,hn=null;function gn(e){var t=jt(e);if(t&&(e=t.stateNode)){var n=e[xt]||null;a:switch(e=t.stateNode,t.type){case`input`:if(Zt(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+Xt(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var a=r[xt]||null;if(!a)throw Error(i(90));Zt(r,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&Jt(r)}break a;case`textarea`:tn(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&en(e,!!n.multiple,t,!1)}}}var _n=!1;function vn(e,t,n){if(_n)return e(t,n);_n=!0;try{return e(t)}finally{if(_n=!1,(mn!==null||hn!==null)&&(Ld(),mn&&(t=mn,e=hn,hn=mn=null,gn(t),e)))for(t=0;t<e.length;t++)gn(e[t])}}function yn(e,t){var n=e.stateNode;if(n===null)return null;var r=n[xt]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=e!==`button`&&e!==`input`&&e!==`select`&&e!==`textarea`),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(i(231,t,typeof n));return n}var bn=typeof window<`u`&&window.document!==void 0&&window.document.createElement!==void 0,xn=!1;if(bn)try{var Sn={};Object.defineProperty(Sn,"passive",{get:function(){xn=!0}}),window.addEventListener(`test`,Sn,Sn),window.removeEventListener(`test`,Sn,Sn)}catch{xn=!1}var Cn=null,wn=null,Tn=null;function En(){if(Tn)return Tn;var e,t=wn,n=t.length,r,i=`value`in Cn?Cn.value:Cn.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return Tn=i.slice(e,1<r?1-r:void 0)}function Dn(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function On(){return!0}function kn(){return!1}function An(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?On:kn,this.isPropagationStopped=kn,this}return E(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=On)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=On)},persist:function(){},isPersistent:On}),t}var jn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Mn=An(jn),Nn=E({},jn,{view:0,detail:0}),Pn=An(Nn),Fn,In,Ln,Rn=E({},Nn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Yn,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==Ln&&(Ln&&e.type===`mousemove`?(Fn=e.screenX-Ln.screenX,In=e.screenY-Ln.screenY):In=Fn=0,Ln=e),Fn)},movementY:function(e){return`movementY`in e?e.movementY:In}}),zn=An(Rn),Bn=An(E({},Rn,{dataTransfer:0})),Vn=An(E({},Nn,{relatedTarget:0})),Hn=An(E({},jn,{animationName:0,elapsedTime:0,pseudoElement:0})),Un=An(E({},jn,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),Wn=An(E({},jn,{data:0})),Gn={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},Kn={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},qn={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function Jn(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=qn[e])?!!t[e]:!1}function Yn(){return Jn}var Xn=An(E({},Nn,{key:function(e){if(e.key){var t=Gn[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=Dn(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?Kn[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Yn,charCode:function(e){return e.type===`keypress`?Dn(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?Dn(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),Zn=An(E({},Rn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),Qn=An(E({},jn,{submitter:0})),$n=An(E({},Nn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Yn})),er=An(E({},jn,{propertyName:0,elapsedTime:0,pseudoElement:0})),tr=An(E({},Rn,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),nr=An(E({},jn,{newState:0,oldState:0,source:0})),rr=[9,13,27,32],ir=bn&&`CompositionEvent`in window,ar=null;bn&&`documentMode`in document&&(ar=document.documentMode);var or=bn&&`TextEvent`in window&&!ar,sr=bn&&(!ir||ar&&8<ar&&11>=ar),cr=` `,lr=!1;function ur(e,t){switch(e){case`keyup`:return rr.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function dr(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var fr=!1;function pr(e,t){switch(e){case`compositionend`:return dr(t);case`keypress`:return t.which===32?(lr=!0,cr):null;case`textInput`:return e=t.data,e===cr&&lr?null:e;default:return null}}function mr(e,t){if(fr)return e===`compositionend`||!ir&&ur(e,t)?(e=En(),Tn=wn=Cn=null,fr=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return sr&&t.locale!==`ko`?null:t.data;default:return null}}var hr={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function gr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!hr[e.type]:t===`textarea`}function _r(e,t,n,r){mn?hn?hn.push(r):hn=[r]:mn=r,t=qf(t,`onChange`),0<t.length&&(n=new Mn(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var vr=null,yr=null;function br(e){Bf(e,0)}function xr(e){if(Jt(Mt(e)))return e}function Sr(e,t){if(e===`change`)return t}var Cr=!1;if(bn){var wr;if(bn){var Tr=`oninput`in document;if(!Tr){var Er=document.createElement(`div`);Er.setAttribute(`oninput`,`return;`),Tr=typeof Er.oninput==`function`}wr=Tr}else wr=!1;Cr=wr&&(!document.documentMode||9<document.documentMode)}function Dr(){vr&&(vr.detachEvent(`onpropertychange`,Or),yr=vr=null)}function Or(e){if(e.propertyName===`value`&&xr(yr)){var t=[];_r(t,yr,e,pn(e)),vn(br,t)}}function kr(e,t,n){e===`focusin`?(Dr(),vr=t,yr=n,vr.attachEvent(`onpropertychange`,Or)):e===`focusout`&&Dr()}function Ar(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return xr(yr)}function jr(e,t){if(e===`click`)return xr(t)}function Mr(e,t){if(e===`input`||e===`change`)return xr(t)}function Nr(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var Pr=typeof Object.is==`function`?Object.is:Nr;function Fr(e,t){if(Pr(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Ie.call(t,i)||!Pr(e[i],t[i]))return!1}return!0}function Ir(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}function Lr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Rr(e,t){var n=Lr(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=Lr(n)}}function zr(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?zr(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Br(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Ir(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=Ir(e.document)}return t}function Vr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var Hr=bn&&`documentMode`in document&&11>=document.documentMode,Ur=null,Wr=null,Gr=null,Kr=!1;function qr(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Kr||Ur==null||Ur!==Ir(r)||(r=Ur,`selectionStart`in r&&Vr(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Gr&&Fr(Gr,r)||(Gr=r,r=qf(Wr,`onSelect`),0<r.length&&(t=new Mn(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=Ur)))}function Jr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var Yr={animationend:Jr(`Animation`,`AnimationEnd`),animationiteration:Jr(`Animation`,`AnimationIteration`),animationstart:Jr(`Animation`,`AnimationStart`),transitionrun:Jr(`Transition`,`TransitionRun`),transitionstart:Jr(`Transition`,`TransitionStart`),transitioncancel:Jr(`Transition`,`TransitionCancel`),transitionend:Jr(`Transition`,`TransitionEnd`)},Xr={},Zr={};bn&&(Zr=document.createElement(`div`).style,`AnimationEvent`in window||(delete Yr.animationend.animation,delete Yr.animationiteration.animation,delete Yr.animationstart.animation),`TransitionEvent`in window||delete Yr.transitionend.transition);function Qr(e){if(Xr[e])return Xr[e];if(!Yr[e])return e;var t=Yr[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Zr)return Xr[e]=t[n];return e}var $r=Qr(`animationend`),ei=Qr(`animationiteration`),ti=Qr(`animationstart`),ni=Qr(`transitionrun`),ri=Qr(`transitionstart`),ii=Qr(`transitioncancel`),ai=Qr(`transitionend`),oi=new Map,si=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);si.push(`scrollEnd`);function ci(e,t){oi.set(e,t),Rt(t,[e])}var li=0;function ui(e,t){if(e.name!=null&&e.name!==`auto`)return e.name;if(t.autoName!==null)return t.autoName;e=vd.identifierPrefix;var n=li++;return e=`_`+e+`t_`+n.toString(32)+`_`,t.autoName=e}function di(e){if(e==null||typeof e==`string`)return e;var t=null,n=Ed;if(n!==null)for(var r=0;r<n.length;r++){var i=e[n[r]];if(i!=null){if(i===`none`)return`none`;t=t==null?i:t+(` `+i)}}return t??e.default}function fi(e,t){return e=di(e),t=di(t),t==null?e===`auto`?null:e:t===`auto`?null:t}var pi=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},mi=[],hi=0,gi=0;function _i(){for(var e=hi,t=gi=hi=0;t<e;){var n=mi[t];mi[t++]=null;var r=mi[t];mi[t++]=null;var i=mi[t];mi[t++]=null;var a=mi[t];if(mi[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&bi(n,i,a)}}function vi(e,t,n,r){mi[hi++]=e,mi[hi++]=t,mi[hi++]=n,mi[hi++]=r,gi|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function q(e,t,n,r){return vi(e,t,n,r),xi(e)}function yi(e,t){return vi(e,null,null,t),xi(e)}function bi(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-z(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function xi(e){if(50<Dd)throw Dd=0,Od=null,Error(i(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Si={};function Ci(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function wi(e,t,n,r){return new Ci(e,t,n,r)}function Ti(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Ei(e,t){var n=e.alternate;return n===null?(n=wi(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&1206910976,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function Di(e,t){e.flags&=1206910978;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Oi(e,t,n,r,a,o){var s=0;if(r=e,typeof r==`function`)Ti(r)&&(s=1);else if(typeof r==`string`)s=qm(e,n,Se.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(r){case le:return e=wi(31,n,t,a),e.elementType=le,e.lanes=o,e;case O:return ki(n.children,a,o,t);case re:s=8,a|=24;break;case ie:return e=wi(12,n,t,a|2),e.elementType=ie,e.lanes=o,e;case oe:return e=wi(13,n,t,a),e.elementType=oe,e.lanes=o,e;case se:return e=wi(19,n,t,a),e.elementType=se,e.lanes=o,e;case ue:case fe:return e=a|32,e=wi(30,n,t,e),e.elementType=fe,e.lanes=o,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof r==`object`&&r)switch(r.$$typeof){case k:s=10;break a;case ae:s=9;break a;case A:s=11;break a;case ce:s=14;break a;case j:s=16,r=null;break a}s=29,n=Error(i(130,e===null?`null`:typeof e,``)),r=null}return t=wi(s,n,t,a),t.elementType=e,t.type=r,t.lanes=o,t}function ki(e,t,n,r){return e=wi(7,e,r,t),e.lanes=n,e}function Ai(e,t,n){return e=wi(6,e,null,t),e.lanes=n,e}function ji(e){var t=wi(18,null,null,0);return t.stateNode=e,t}function Mi(e,t,n){return t=wi(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Ni=new WeakMap;function Pi(e,t){if(typeof e==`object`&&e){var n=Ni.get(e);return n===void 0?(t={value:e,source:t,stack:Fe(t)},Ni.set(e,t),t):n}return{value:e,source:t,stack:Fe(t)}}var Fi=[],Ii=0,Li=null,Ri=0,zi=[],Bi=0,Vi=null,Hi=1,Ui=``;function Wi(e,t){Fi[Ii++]=Ri,Fi[Ii++]=Li,Li=e,Ri=t}function Gi(e,t,n){zi[Bi++]=Hi,zi[Bi++]=Ui,zi[Bi++]=Vi,Vi=e;var r=Hi;e=Ui;var i=32-z(r)-1;r&=~(1<<i),n+=1;var a=32-z(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Hi=1<<32-z(t)+i|n<<i|r,Ui=a+e}else Hi=1<<a|n<<i|r,Ui=e}function Ki(e){e.return!==null&&(Wi(e,1),Gi(e,1,0))}function qi(e){for(;e===Li;)Li=Fi[--Ii],Fi[Ii]=null,Ri=Fi[--Ii],Fi[Ii]=null;for(;e===Vi;)Vi=zi[--Bi],zi[Bi]=null,Ui=zi[--Bi],zi[Bi]=null,Hi=zi[--Bi],zi[Bi]=null}function Ji(e,t){zi[Bi++]=Hi,zi[Bi++]=Ui,zi[Bi++]=Vi,Hi=t.id,Ui=t.overflow,Vi=e}var Yi=null,Xi=null,J=!1,Zi=null,Qi=!1,$i=Error(i(519));function ea(e){throw oa(Pi(Error(i(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),$i}function ta(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[bt]=e,t[xt]=r,n){case`dialog`:$(`cancel`,t),$(`close`,t);break;case`iframe`:case`object`:case`embed`:$(`load`,t);break;case`video`:case`audio`:for(n=0;n<Rf.length;n++)$(Rf[n],t);break;case`source`:$(`error`,t);break;case`img`:case`image`:case`link`:$(`error`,t),$(`load`,t);break;case`details`:$(`toggle`,t);break;case`input`:$(`invalid`,t),Qt(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:$(`invalid`,t);break;case`textarea`:$(`invalid`,t),nn(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||$f(t.textContent,n)?(r.popover!=null&&($(`beforetoggle`,t),$(`toggle`,t)),r.onScroll!=null&&$(`scroll`,t),r.onScrollEnd!=null&&$(`scrollend`,t),r.onClick!=null&&(t.onclick=dn),t=!0):t=!1,t||ea(e,!0)}function na(e){for(Yi=e.return;Yi;)switch(Yi.tag){case 5:case 31:case 13:Qi=!1;return;case 27:case 3:Qi=!0;return;default:Yi=Yi.return}}function ra(e){if(e!==Yi)return!1;if(!J)return na(e),J=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=n===`form`||n===`button`||pp(e.type,e.memoizedProps)),n=!n),n&&Xi&&ea(e),na(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));Xi=dm(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));Xi=dm(e)}else t===27?(t=Xi,Sp(e.type)?(e=um,um=null,Xi=e):Xi=t):Xi=Yi?lm(e.stateNode.nextSibling):null;return!0}function ia(){Xi=Yi=null,J=!1}function aa(){var e=Zi;return e!==null&&(ud===null?ud=e:ud.push.apply(ud,e),Zi=null),e}function oa(e){Zi===null?Zi=[e]:Zi.push(e)}var sa=xe(null),ca=null,la=null;function ua(e,t,n){I(sa,t._currentValue),t._currentValue=n}function da(e){e._currentValue=sa.current,F(sa)}function fa(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function pa(e,t,n,r){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var o=a.dependencies;if(o!==null){var s=a.child;o=o.firstContext;a:for(;o!==null;){var c=o;o=a;for(var l=0;l<t.length;l++)if(c.context===t[l]){o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),fa(o.return,n,e),r||(s=null);break a}o=c.next}}else if(a.tag===18){if(s=a.return,s===null)throw Error(i(341));s.lanes|=n,o=s.alternate,o!==null&&(o.lanes|=n),fa(s,n,e),s=null}else a.tag===13&&a.memoizedState!==null&&a.memoizedState.dehydrated===null?(a.lanes|=n,s=a.alternate,s!==null&&(s.lanes|=n),fa(a.return,n,e),s=a.child,s=s===null?null:s.sibling):s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===e){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}}function ma(e,t,n,r){e=null;for(var a=t,o=!1;a!==null;){if(!o){if(a.flags&524288)o=!0;else if(a.flags&262144)break}if(a.tag===10){var s=a.alternate;if(s===null)throw Error(i(387));if(s=s.memoizedProps,s!==null){var c=a.type;Pr(a.pendingProps.value,s.value)||(e===null?e=[c]:e.push(c))}}else if(a===Te.current){if(s=a.alternate,s===null)throw Error(i(387));s.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e===null?e=[sh]:e.push(sh))}a=a.return}return e!==null&&pa(t,e,n,r),t.flags|=262144,e!==null}function ha(e){for(e=e.firstContext;e!==null;){if(!Pr(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function ga(e){ca=e,la=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function _a(e){return ya(ca,e)}function va(e,t){return ca===null&&ga(e),ya(e,t)}function ya(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},la===null){if(e===null)throw Error(i(308));la=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else la=la.next=t;return n}var ba=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},xa=t.unstable_scheduleCallback,Sa=t.unstable_NormalPriority,Ca={$$typeof:k,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function wa(){return{controller:new ba,data:new Map,refCount:0}}function Ta(e){e.refCount--,e.refCount===0&&xa(Sa,function(){e.controller.abort()})}function Ea(e,t){if(e.pendingLanes&4194048){var n=e.transitionTypes;for(n===null&&(n=e.transitionTypes=[]),e=0;e<t.length;e++){var r=t[e];n.indexOf(r)===-1&&n.push(r)}}}var Da=null;function Oa(e){var t=e.transitionTypes;return e.transitionTypes=null,t}var ka=null,Aa=0,ja=0,Ma=null;function Na(e,t){if(ka===null){var n=ka=[];Aa=0,ja=Nf(),Ma={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return Aa++,t.then(Pa,Pa),t}function Pa(){if(--Aa===0&&(Da=null,ka!==null)){Ma!==null&&(Ma.status=`fulfilled`);var e=ka;ka=null,ja=0,Ma=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Fa(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var Ia=N.S;N.S=function(e,t){if(pd=R(),typeof t==`object`&&t&&typeof t.then==`function`&&Na(e,t),Da!==null)for(var n=yf;n!==null;)Ea(n,Da),n=n.next;if(n=e.types,n!==null){for(var r=yf;r!==null;)Ea(r,n),r=r.next;if(ja!==0){r=Da,r===null&&(r=Da=[]);for(var i=0;i<n.length;i++){var a=n[i];r.indexOf(a)===-1&&r.push(a)}}}Ia!==null&&Ia(e,t)};var La=xe(null);function Ra(){var e=La.current;return e===null?Xu.pooledCache:e}function za(e,t){t===null?I(La,La.current):I(La,t.pool)}function Ba(){var e=Ra();return e===null?null:{parent:Ca._currentValue,pool:e}}var Va=Error(i(460)),Ha=Error(i(474)),Ua=Error(i(542)),Wa={then:function(){}};function Ga(e){return e=e.status,e===`fulfilled`||e===`rejected`}function Ka(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(dn,dn),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,Xa(e),e===void 0&&!(`reason`in t)?Error(i(600)):e;default:if(typeof t.status==`string`)t.then(dn,dn);else{if(e=Xu,e!==null&&100<e.shellSuspendCounter)throw Error(i(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,Xa(e),e}throw Ja=t,Va}}function qa(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(Ja=e,Va):e}}var Ja=null;function Ya(){if(Ja===null)throw Error(i(459));var e=Ja;return Ja=null,e}function Xa(e){if(e===Va||e===Ua)throw Error(i(483))}var Za=null,Qa=0;function $a(e){var t=Qa;return Qa+=1,Za===null&&(Za=[]),Ka(Za,e,t)}function eo(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function to(e,t){throw t.$$typeof===te?Error(i(525)):(e=Object.prototype.toString.call(t),Error(i(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function no(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function a(e,t){return e=Ei(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=134217730,n):(r=r.index,r<n?(t.flags|=2,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=134217730),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=Ai(n,e.mode,r),t.return=e,t):(t=a(t,n),t.return=e,t)}function l(e,t,n,r){var i=n.type;return i===O?(e=d(e,t,n.props.children,r,n.key),eo(e,n),e):t!==null&&(t.elementType===i||typeof i==`object`&&i&&i.$$typeof===j&&qa(i)===t.type)?(t=a(t,n.props),eo(t,n),t.return=e,t):(t=Oi(n.type,n.key,n.props,null,e.mode,r),eo(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=Mi(n,e.mode,r),t.return=e,t):(t=a(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,i){return t===null||t.tag!==7?(t=ki(n,e.mode,r,i),t.return=e,t):(t=a(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=Ai(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case D:return n=Oi(t.type,t.key,t.props,null,e.mode,n),eo(n,t),n.return=e,n;case ne:return t=Mi(t,e.mode,n),t.return=e,t;case j:return t=qa(t),f(e,t,n)}if(_e(t)||M(t))return t=ki(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,$a(t),n);if(t.$$typeof===k)return f(e,va(e,t),n);to(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case D:return n.key===i?l(e,t,n,r):null;case ne:return n.key===i?u(e,t,n,r):null;case j:return n=qa(n),p(e,t,n,r)}if(_e(n)||M(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,$a(n),r);if(n.$$typeof===k)return p(e,t,va(e,n),r);to(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case D:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case ne:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case j:return r=qa(r),m(e,t,n,r,i)}if(_e(r)||M(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return m(e,t,n,$a(r),i);if(r.$$typeof===k)return m(e,t,n,va(t,r),i);to(t,r)}return null}function h(i,a,s,c){for(var l=null,u=null,d=a,h=a=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(i,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(i,d),a=o(_,a,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(i,d),J&&Wi(i,h),l;if(d===null){for(;h<s.length;h++)d=f(i,s[h],c),d!==null&&(a=o(d,a,h),u===null?l=d:u.sibling=d,u=d);return J&&Wi(i,h),l}for(d=r(d);h<s.length;h++)g=m(d,i,h,s[h],c),g!==null&&(e&&(_=g.alternate,_!==null&&d.delete(_.key===null?h:_.key)),a=o(g,a,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(i,e)}),J&&Wi(i,h),l}function g(a,s,c,l){if(c==null)throw Error(i(151));for(var u=null,d=null,h=s,g=s=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(a,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(a,h),s=o(y,s,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(a,h),J&&Wi(a,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(a,v.value,l),v!==null&&(s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return J&&Wi(a,g),u}for(h=r(h);!v.done;g++,v=c.next())v=m(h,a,g,v.value,l),v!==null&&(e&&(_=v.alternate,_!==null&&h.delete(_.key===null?g:_.key)),s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(a,e)}),J&&Wi(a,g),u}function _(e,r,o,c){if(typeof o==`object`&&o&&o.type===O&&o.key===null&&o.props.ref===void 0&&(o=o.props.children),typeof o==`object`&&o){switch(o.$$typeof){case D:a:{for(var l=o.key;r!==null;){if(r.key===l){if(l=o.type,l===O){if(r.tag===7){n(e,r.sibling),c=a(r,o.props.children),eo(c,o),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===j&&qa(l)===r.type){n(e,r.sibling),c=a(r,o.props),eo(c,o),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}o.type===O?(c=ki(o.props.children,e.mode,c,o.key),eo(c,o),c.return=e,e=c):(c=Oi(o.type,o.key,o.props,null,e.mode,c),eo(c,o),c.return=e,e=c)}return s(e);case ne:a:{for(l=o.key;r!==null;){if(r.key===l){if(r.tag===4&&r.stateNode.containerInfo===o.containerInfo&&r.stateNode.implementation===o.implementation){n(e,r.sibling),c=a(r,o.children||[]),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}c=Mi(o,e.mode,c),c.return=e,e=c}return s(e);case j:return o=qa(o),_(e,r,o,c)}if(_e(o))return h(e,r,o,c);if(M(o)){if(l=M(o),typeof l!=`function`)throw Error(i(150));return o=l.call(o),g(e,r,o,c)}if(typeof o.then==`function`)return _(e,r,$a(o),c);if(o.$$typeof===k)return _(e,r,va(e,o),c);to(e,o)}return typeof o==`string`&&o!==``||typeof o==`number`||typeof o==`bigint`?(o=``+o,r!==null&&r.tag===6?(n(e,r.sibling),c=a(r,o),c.return=e,e=c):(n(e,r),c=Ai(o,e.mode,c),c.return=e,e=c),s(e)):n(e,r)}return function(e,t,n,r){try{Qa=0;var i=_(e,t,n,r);return Za=null,i}catch(t){if(t===Va||t===Ua)throw t;var a=wi(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var ro=no(!0),io=no(!1),ao=!1;function oo(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function so(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function co(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function lo(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,X&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=xi(e),bi(e,null,n),t}return vi(e,r,t,n),xi(e)}function uo(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,pt(e,n)}}function fo(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n}else e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var po=!1;function mo(){if(po){var e=Ma;if(e!==null)throw e}}function ho(e,t,n,r){po=!1;var i=e.updateQueue;ao=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane&-536870913,p=f!==s.lane;if(p?(Q&f)===f:(r&f)===f){f!==0&&f===ja&&(po=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var m=e,h=s;f=t;var g=n;switch(h.tag){case 1:if(m=h.payload,typeof m==`function`){d=m.call(g,d,f);break a}d=m;break a;case 3:m.flags=m.flags&-65537|128;case 0:if(m=h.payload,f=typeof m==`function`?m.call(g,d,f):m,f==null)break a;d=E({},d,f);break a;case 2:ao=!0}}f=s.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[f]:p.push(f))}else p={lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),id|=o,e.lanes=o,e.memoizedState=d}}function go(e,t){if(typeof e!=`function`)throw Error(i(191,e));e.call(t)}function _o(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)go(n[e],t)}var vo=xe(null),yo=xe(0);function bo(e,t){e=nd,I(yo,e),I(vo,t),nd=e|t.baseLanes}function xo(){I(yo,nd),I(vo,vo.current)}function So(){nd=yo.current,F(vo),F(yo)}var Co=xe(null),wo=null;function To(e){var t=e.alternate;I(Ao,Ao.current&1),I(Co,e),wo===null&&(t===null||vo.current!==null||t.memoizedState!==null)&&(wo=e)}function Eo(e){I(Ao,Ao.current),I(Co,e),wo===null&&(wo=e)}function Do(e){e.tag===22?(I(Ao,Ao.current),I(Co,e),wo===null&&(wo=e)):Oo()}function Oo(){I(Ao,Ao.current),I(Co,Co.current)}function ko(e){F(Co),wo===e&&(wo=null),F(Ao)}var Ao=xe(0);function jo(e,t){I(Co,Co.current),I(Ao,t)}function Mo(e){F(Ao),F(Co),wo===e&&(wo=null)}function No(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||om(n)||sm(n)))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==`independent`){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Po=0,Y=null,Fo=null,Io=null,Lo=!1,Ro=!1,zo=!1,Bo=0,Vo=0,Ho=null,Uo=0;function Wo(){throw Error(i(321))}function Go(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Pr(e[n],t[n]))return!1;return!0}function Ko(e,t,n,r,i,a){return Po=a,Y=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,N.H=e===null||e.memoizedState===null?lc:uc,zo=!1,a=n(r,i),zo=!1,Ro&&(a=Jo(t,n,r,i)),qo(e),a}function qo(e){N.H=cc;var t=Fo!==null&&Fo.next!==null;if(Po=0,Io=Fo=Y=null,Lo=!1,Vo=0,Ho=null,t)throw Error(i(300));e===null||Dc||(e=e.dependencies,e!==null&&ha(e)&&(Dc=!0))}function Jo(e,t,n,r){Y=e;var a=0;do{if(Ro&&(Ho=null),Vo=0,Ro=!1,25<=a)throw Error(i(301));if(a+=1,Io=Fo=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}N.H=dc,o=t(n,r)}while(Ro);return o}function Yo(){var e=N.H,t=e.useState()[0];return t=typeof t.then==`function`?ns(t):t,e=e.useState()[0],(Fo===null?null:Fo.memoizedState)!==e&&(Y.flags|=1024),t}function Xo(){var e=Bo!==0;return Bo=0,e}function Zo(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function Qo(e){if(Lo){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Lo=!1}Po=0,Io=Fo=Y=null,Ro=!1,Vo=Bo=0,Ho=null}function $o(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Io===null?Y.memoizedState=Io=e:Io=Io.next=e,Io}function es(){if(Fo===null){var e=Y.alternate;e=e===null?null:e.memoizedState}else e=Fo.next;var t=Io===null?Y.memoizedState:Io.next;if(t!==null)Io=t,Fo=e;else{if(e===null)throw Y.alternate===null?Error(i(467)):Error(i(310));Fo=e,e={memoizedState:Fo.memoizedState,baseState:Fo.baseState,baseQueue:Fo.baseQueue,queue:Fo.queue,next:null},Io===null?Y.memoizedState=Io=e:Io=Io.next=e}return Io}function ts(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function ns(e){var t=Vo;return Vo+=1,Ho===null&&(Ho=[]),e=Ka(Ho,e,t),t=Y,(Io===null?t.memoizedState:Io.next)===null&&(t=t.alternate,N.H=t===null||t.memoizedState===null?lc:uc),e}function rs(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return ns(e);if(e.$$typeof===pe)return;if(e.$$typeof===k)return _a(e)}throw Error(i(438,String(e)))}function is(e){var t=null,n=Y.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=Y.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=ts(),Y.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=de;return t.index++,n}function as(e,t){return typeof t==`function`?t(e):t}function os(e){return ss(es(),Fo,e)}function ss(e,t,n){var r=e.queue;if(r===null)throw Error(i(311));r.lastRenderedReducer=n;var a=e.baseQueue,o=r.pending;if(o!==null){if(a!==null){var s=a.next;a.next=o.next,o.next=s}t.baseQueue=a=o,r.pending=null}if(o=e.baseState,a===null)e.memoizedState=o;else{t=a.next;var c=s=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(Po&f)===f:(Q&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===ja&&(d=!0);else if((Po&p)===p){u=u.next,p===ja&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,s=o):l=l.next=f,Y.lanes|=p,id|=p;f=u.action,zo&&n(o,f),o=u.hasEagerState?u.eagerState:n(o,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,s=o):l=l.next=p,Y.lanes|=f,id|=f;u=u.next}while(u!==null&&u!==t);if(l===null?s=o:l.next=c,!Pr(o,e.memoizedState)&&(Dc=!0,d&&(n=Ma,n!==null)))throw n;e.memoizedState=o,e.baseState=s,e.baseQueue=l,r.lastRenderedState=o}return a===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function cs(e){var t=es(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,a=n.pending,o=t.memoizedState;if(a!==null){n.pending=null;var s=a=a.next;do o=e(o,s.action),s=s.next;while(s!==a);Pr(o,t.memoizedState)||(Dc=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function ls(e,t,n){var r=Y,a=es(),o=J;if(o){if(n===void 0)throw Error(i(407));n=n()}else n=t();var s=!Pr((Fo||a).memoizedState,n);if(s&&(a.memoizedState=n,Dc=!0),a=a.queue,Ps(fs.bind(null,r,a,e),[e]),e=a.getSnapshot!==t||s||Io!==null&&!!(Io.memoizedState.tag&1),ks(e?9:8,{destroy:void 0},ds.bind(null,r,a,n,t),null),e){if(r.flags|=2048,Xu===null)throw Error(i(349));o||Po&127||us(r,t,n)}return n}function us(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Y.updateQueue,t===null?(t=ts(),Y.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function ds(e,t,n,r){t.value=n,t.getSnapshot=r,ps(t)&&ms(e)}function fs(e,t,n){return n(function(){ps(t)&&ms(e)})}function ps(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Pr(e,n)}catch{return!0}}function ms(e){var t=yi(e,2);t!==null&&Md(t,e,2)}function hs(e){var t=$o();if(typeof e==`function`){var n=e;if(e=n(),zo){Ze(!0);try{n()}finally{Ze(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:as,lastRenderedState:e},t}function gs(e,t,n,r){return e.baseState=n,ss(e,Fo,typeof r==`function`?r:as)}function _s(e,t,n,r,a){if(ac(e))throw Error(i(485));if(e=t.action,e!==null){var o={payload:a,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){o.listeners.push(e)}};N.T===null?o.isTransition=!1:n(!0),r(o),n=t.pending,n===null?(o.next=t.pending=o,vs(t,o)):(o.next=n.next,t.pending=n.next=o)}}function vs(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=N.T,o={};o.types=a===null?null:a.types,N.T=o;try{var s=n(i,r),c=N.S;c!==null&&c(o,s),ys(e,t,s)}catch(n){xs(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),N.T=a}}else try{a=n(i,r),ys(e,t,a)}catch(n){xs(e,t,n)}}function ys(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){bs(e,t,n)},function(n){return xs(e,t,n)}):bs(e,t,n)}function bs(e,t,n){t.status=`fulfilled`,t.value=n,Ss(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,vs(e,n)))}function xs(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,Ss(t),t=t.next;while(t!==r)}e.action=null}function Ss(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Cs(e,t){return t}function ws(e,t){if(J){var n=Xu.formState;if(n!==null){a:{var r=Y;if(J){if(Xi){b:{for(var i=Xi,a=Qi;i.nodeType!==8;)if(!a||(i=lm(i.nextSibling),i===null)){i=null;break b}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){Xi=lm(i.nextSibling),r=i.data===`F!`;break a}}ea(r)}r=!1}r&&(t=n[0])}}return n=$o(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Cs,lastRenderedState:t},n.queue=r,n=nc.bind(null,Y,r),r.dispatch=n,r=hs(!1),a=ic.bind(null,Y,!1,r.queue),r=$o(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=_s.bind(null,Y,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function Ts(e){return Es(es(),Fo,e)}function Es(e,t,n){if(t=ss(e,t,Cs)[0],e=os(as)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=ns(t)}catch(e){throw e===Va?Ua:e}else r=t;t=es();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(Y.flags|=2048,ks(9,{destroy:void 0},Ds.bind(null,i,n),null)),[r,a,e]}function Ds(e,t){e.action=t}function Os(e){var t=es(),n=Fo;if(n!==null)return Es(t,n,e);es(),t=t.memoizedState,n=es();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function ks(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=Y.updateQueue,t===null&&(t=ts(),Y.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function As(){return es().memoizedState}function js(e,t,n,r){var i=$o();Y.flags|=e,i.memoizedState=ks(1|t,{destroy:void 0},n,r===void 0?null:r)}function Ms(e,t,n,r){var i=es();r=r===void 0?null:r;var a=i.memoizedState.inst;Fo!==null&&r!==null&&Go(r,Fo.memoizedState.deps)?i.memoizedState=ks(t,a,n,r):(Y.flags|=e,i.memoizedState=ks(1|t,a,n,r))}function Ns(e,t){js(8390656,8,e,t)}function Ps(e,t){Ms(2048,8,e,t)}function Fs(e){Y.flags|=4;var t=Y.updateQueue;if(t===null)t=ts(),Y.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Is(e){var t=es().memoizedState;return Fs({ref:t,nextImpl:e}),function(){if(X&2)throw Error(i(440));return t.impl.apply(void 0,arguments)}}function Ls(e,t){return Ms(4,2,e,t)}function Rs(e,t){return Ms(4,4,e,t)}function zs(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Bs(e,t,n){n=n==null?null:n.concat([e]),Ms(4,4,zs.bind(null,t,e),n)}function Vs(){}function Hs(e,t){var n=es();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&Go(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Us(e,t){var n=es();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&Go(t,r[1]))return r[0];if(r=e(),zo){Ze(!0);try{e()}finally{Ze(!1)}}return n.memoizedState=[r,t],r}function Ws(e,t,n){return n===void 0||Po&1073741824&&!(Q&261930)?e.memoizedState=t:(e.memoizedState=n,e=Ad(),Y.lanes|=e,id|=e,n)}function Gs(e,t,n,r){return Pr(n,t)?n:vo.current===null?!(Po&106)||Po&1073741824&&!(Q&261930)?(Dc=!0,e.memoizedState=n):(e=Ad(),Y.lanes|=e,id|=e,t):(e=Ws(e,n,r),Pr(e,t)||(Dc=!0),e)}function Ks(e,t,n,r,i){var a=P.p;P.p=a!==0&&8>a?a:8;var o=N.T,s={};s.types=o===null?null:o.types,N.T=s,ic(e,!1,t,n);try{var c=i(),l=N.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?rc(e,t,Fa(c,r),kd(e)):rc(e,t,r,kd(e))}catch(n){rc(e,t,{then:function(){},status:`rejected`,reason:n},kd())}finally{P.p=a,o!==null&&s.types!==null&&(o.types=s.types),N.T=o}}function qs(){}function Js(e,t,n,r){if(e.tag!==5)throw Error(i(476));var a=Ys(e).queue;Ks(e,a,t,ve,n===null?qs:function(){return Xs(e),n(r)})}function Ys(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:ve,baseState:ve,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:as,lastRenderedState:ve},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:as,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Xs(e){var t=Ys(e);t.next===null&&(t=e.alternate.memoizedState),rc(e,t.next.queue,{},kd())}function Zs(){return _a(sh)}function Qs(){return es().memoizedState}function $s(){return es().memoizedState}function ec(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=kd();e=co(n);var r=lo(t,e,n);r!==null&&(Md(r,t,n),uo(r,t,n)),t={cache:wa()},e.payload=t;return}t=t.return}}function tc(e,t,n){var r=kd();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},ac(e)?oc(t,n):(n=q(e,t,n,r),n!==null&&(Md(n,e,r),sc(n,t,r)))}function nc(e,t,n){rc(e,t,n,kd())}function rc(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(ac(e))oc(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,Pr(s,o))return vi(e,t,i,0),Xu===null&&_i(),!1}catch{}if(n=q(e,t,i,r),n!==null)return Md(n,e,r),sc(n,t,r),!0}return!1}function ic(e,t,n,r){if(r={lane:2,revertLane:Nf(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},ac(e)){if(t)throw Error(i(479))}else t=q(e,n,r,2),t!==null&&Md(t,e,2)}function ac(e){var t=e.alternate;return e===Y||t!==null&&t===Y}function oc(e,t){Ro=Lo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function sc(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,pt(e,n)}}var cc={readContext:_a,use:rs,useCallback:Wo,useContext:Wo,useEffect:Wo,useImperativeHandle:Wo,useLayoutEffect:Wo,useInsertionEffect:Wo,useMemo:Wo,useReducer:Wo,useRef:Wo,useState:Wo,useDebugValue:Wo,useDeferredValue:Wo,useTransition:Wo,useSyncExternalStore:Wo,useId:Wo,useHostTransitionStatus:Wo,useFormState:Wo,useActionState:Wo,useOptimistic:Wo,useMemoCache:Wo,useCacheRefresh:Wo,useEffectEvent:Wo},lc={readContext:_a,use:rs,useCallback:function(e,t){return $o().memoizedState=[e,t===void 0?null:t],e},useContext:_a,useEffect:Ns,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),js(4194308,4,zs.bind(null,t,e),n)},useLayoutEffect:function(e,t){return js(4194308,4,e,t)},useInsertionEffect:function(e,t){js(4,2,e,t)},useMemo:function(e,t){var n=$o();t=t===void 0?null:t;var r=e();if(zo){Ze(!0);try{e()}finally{Ze(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=$o();if(n!==void 0){var i=n(t);if(zo){Ze(!0);try{n(t)}finally{Ze(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=tc.bind(null,Y,e),[r.memoizedState,e]},useRef:function(e){var t=$o();return e={current:e},t.memoizedState=e},useState:function(e){e=hs(e);var t=e.queue,n=nc.bind(null,Y,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Vs,useDeferredValue:function(e,t){return Ws($o(),e,t)},useTransition:function(){var e=hs(!1);return e=Ks.bind(null,Y,e.queue,!0,!1),$o().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=Y,a=$o();if(J){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),Xu===null)throw Error(i(349));Q&127||us(r,t,n)}a.memoizedState=n;var o={value:n,getSnapshot:t};return a.queue=o,Ns(fs.bind(null,r,o,e),[e]),r.flags|=2048,ks(9,{destroy:void 0},ds.bind(null,r,o,n,t),null),n},useId:function(){var e=$o(),t=Xu.identifierPrefix;if(J){var n=Ui,r=Hi;n=(r&~(1<<32-z(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=Bo++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=Uo++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:Zs,useFormState:ws,useActionState:ws,useOptimistic:function(e){var t=$o();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=ic.bind(null,Y,!0,n),n.dispatch=t,[e,t]},useMemoCache:is,useCacheRefresh:function(){return $o().memoizedState=ec.bind(null,Y)},useEffectEvent:function(e){var t=$o(),n={impl:e};return t.memoizedState=n,function(){if(X&2)throw Error(i(440));return n.impl.apply(void 0,arguments)}}},uc={readContext:_a,use:rs,useCallback:Hs,useContext:_a,useEffect:Ps,useImperativeHandle:Bs,useInsertionEffect:Ls,useLayoutEffect:Rs,useMemo:Us,useReducer:os,useRef:As,useState:function(){return os(as)},useDebugValue:Vs,useDeferredValue:function(e,t){return Gs(es(),Fo.memoizedState,e,t)},useTransition:function(){var e=os(as)[0],t=es().memoizedState;return[typeof e==`boolean`?e:ns(e),t]},useSyncExternalStore:ls,useId:Qs,useHostTransitionStatus:Zs,useFormState:Ts,useActionState:Ts,useOptimistic:function(e,t){return gs(es(),Fo,e,t)},useMemoCache:is,useCacheRefresh:$s,useEffectEvent:Is},dc={readContext:_a,use:rs,useCallback:Hs,useContext:_a,useEffect:Ps,useImperativeHandle:Bs,useInsertionEffect:Ls,useLayoutEffect:Rs,useMemo:Us,useReducer:cs,useRef:As,useState:function(){return cs(as)},useDebugValue:Vs,useDeferredValue:function(e,t){var n=es();return Fo===null?Ws(n,e,t):Gs(n,Fo.memoizedState,e,t)},useTransition:function(){var e=cs(as)[0],t=es().memoizedState;return[typeof e==`boolean`?e:ns(e),t]},useSyncExternalStore:ls,useId:Qs,useHostTransitionStatus:Zs,useFormState:Os,useActionState:Os,useOptimistic:function(e,t){var n=es();return Fo===null?(n.baseState=e,[e,n.queue.dispatch]):gs(n,Fo,e,t)},useMemoCache:is,useCacheRefresh:$s,useEffectEvent:Is};function fc(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:E({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var pc={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=kd(),i=co(r);i.payload=t,n!=null&&(i.callback=n),t=lo(e,i,r),t!==null&&(Md(t,e,r),uo(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=kd(),i=co(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=lo(e,i,r),t!==null&&(Md(t,e,r),uo(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=kd(),r=co(n);r.tag=2,t!=null&&(r.callback=t),t=lo(e,r,n),t!==null&&(Md(t,e,n),uo(t,e,n))}};function mc(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!Fr(n,r)||!Fr(i,a):!0}function hc(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&pc.enqueueReplaceState(t,t.state,null)}function gc(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=E({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function _c(e){pi(e)}function vc(e){console.error(e)}function yc(e){pi(e)}function bc(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function xc(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function Sc(e,t,n){return n=co(n),n.tag=3,n.payload={element:null},n.callback=function(){bc(e,t)},n}function Cc(e){return e=co(e),e.tag=3,e}function wc(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){xc(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){xc(t,n,r),typeof i!=`function`&&(gd===null?gd=new Set([this]):gd.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function Tc(e,t,n,r,a){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&ma(t,n,a,!0),n=Co.current,n!==null){switch(n.tag){case 31:case 13:case 19:return wo===null?Wd():n.alternate===null&&rd===0&&(rd=3),n.flags&=-257,n.flags|=65536,n.lanes=a,r===Wa?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),pf(e,r,a)),!1;case 22:return n.flags|=65536,r===Wa?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),pf(e,r,a)),!1}throw Error(i(435,n.tag))}return pf(e,r,a),Wd(),!1}if(J)return t=Co.current,t===null?(r!==$i&&(t=Error(i(423),{cause:r}),oa(Pi(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,r=Pi(r,n),a=Sc(e.stateNode,r,a),fo(e,a),rd!==4&&(rd=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=a,r!==$i&&(e=Error(i(422),{cause:r}),oa(Pi(e,n)))),!1;var o=Error(i(520),{cause:r});if(o=Pi(o,n),ld===null?ld=[o]:ld.push(o),rd!==4&&(rd=2),t===null)return!0;r=Pi(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=Sc(n.stateNode,r,e),fo(n,e),!1;case 1:if(t=n.type,o=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||o!==null&&typeof o.componentDidCatch==`function`&&(gd===null||!gd.has(o))))return n.flags|=65536,a&=-a,n.lanes|=a,a=Cc(a),wc(a,e,n,r),fo(n,a),!1;break;case 22:if(n.memoizedState!==null)return n.flags|=65536,!1}n=n.return}while(n!==null);return!1}var Ec=Error(i(461)),Dc=!1;function Oc(e,t,n,r){t.child=e===null?io(t,null,n,r):ro(t,e.child,n,r)}function kc(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return ga(t),r=Ko(e,t,n,o,a,i),s=Xo(),e!==null&&!Dc?(Zo(e,t,i),rl(e,t,i)):(J&&s&&Ki(t),t.flags|=1,Oc(e,t,r,i),t.child)}function Ac(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!Ti(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,jc(e,t,a,r,i)):(e=Oi(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!il(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?Fr:n,n(o,r)&&e.ref===t.ref)return rl(e,t,i)}return t.flags|=1,e=Ei(a,r),e.ref=t.ref,e.return=t,t.child=e}function jc(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(Fr(a,r)&&e.ref===t.ref){if(Dc=!1,t.pendingProps=r=a,il(e,i))e.flags&131072&&(Dc=!0);else return t.lanes=e.lanes,rl(e,t,i)}}return zc(e,t,n,r,i)}function Mc(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return Pc(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&za(t,a===null?null:a.cachePool),a===null?xo():bo(t,a),Do(t);else return r=t.lanes=536870912,Pc(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&za(t,null),xo(),Oo()):(za(t,a.cachePool),bo(t,a),Oo(),t.memoizedState=null);return Oc(e,t,i,n),t.child}function Nc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Pc(e,t,n,r,i){var a=Ra();return a=a===null?null:{parent:Ca._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&za(t,null),xo(),Do(t),e!==null&&ma(e,t,r,!0),t.childLanes=i,null}function Fc(e,t){return t=Jc({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Ic(e,t,n){return ro(t,e.child,null,n),e=Fc(t,t.pendingProps),e.flags|=2,ko(t),t.memoizedState=null,e}function Lc(e,t,n){var r=t.pendingProps,a=!!(t.flags&128);if(t.flags&=-129,e===null){if(J){if(r.mode===`hidden`)return e=Fc(t,r),t.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},Nc(null,e);if(Eo(t),(e=Xi)?(e=am(e,Qi),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Vi===null?null:{id:Hi,overflow:Ui},retryLane:536870912,hydrationErrors:null},n=ji(e),n.return=t,t.child=n,Yi=t,Xi=null)):e=null,e===null)throw ea(t);return t.lanes=536870912,null}return Fc(t,r)}var o=e.memoizedState;if(o!==null){var s=o.dehydrated;if(Eo(t),a){if(t.flags&256)t.flags&=-257,t=Ic(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(i(558))}else if(Dc||ma(e,t,n,!1),a=(n&e.childLanes)!==0,Dc||a){if(vo.current===null){if(r=Xu,r!==null&&(s=mt(r,n),s!==0&&s!==o.retryLane))throw o.retryLane=s,yi(e,s),Md(r,e,s),Ec;Wd()}t=Ic(e,t,n)}else e=o.treeContext,Xi=lm(s.nextSibling),Yi=t,J=!0,Zi=null,Qi=!1,e!==null&&Ji(t,e),t=Fc(t,r),t.flags|=134221824;return t}return e=Ei(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Rc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(i(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function zc(e,t,n,r,i){return ga(t),n=Ko(e,t,n,r,void 0,i),r=Xo(),e!==null&&!Dc?(Zo(e,t,i),rl(e,t,i)):(J&&r&&Ki(t),t.flags|=1,Oc(e,t,n,i),t.child)}function Bc(e,t,n,r,i,a){return ga(t),t.updateQueue=null,n=Jo(t,r,n,i),qo(e),r=Xo(),e!==null&&!Dc?(Zo(e,t,a),rl(e,t,a)):(J&&r&&Ki(t),t.flags|=1,Oc(e,t,n,a),t.child)}function Vc(e,t,n,r,i){if(ga(t),t.stateNode===null){var a=Si,o=n.contextType;typeof o==`object`&&o&&(a=_a(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=pc,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},oo(t),o=n.contextType,a.context=typeof o==`object`&&o?_a(o):Si,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(fc(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&pc.enqueueReplaceState(a,a.state,null),ho(t,r,a,i),mo(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=gc(n,s);a.props=c;var l=a.context,u=n.contextType;o=Si,typeof u==`object`&&u&&(o=_a(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&hc(t,a,r,o),ao=!1;var f=t.memoizedState;a.state=f,ho(t,r,a,i),mo(),l=t.memoizedState,s||f!==l||ao?(typeof d==`function`&&(fc(t,n,d,r),l=t.memoizedState),(c=ao||mc(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,so(e,t),o=t.memoizedProps,u=gc(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=Si,typeof l==`object`&&l&&(c=_a(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&hc(t,a,r,c),ao=!1,f=t.memoizedState,a.state=f,ho(t,r,a,i),mo();var p=t.memoizedState;o!==d||f!==p||ao||e!==null&&e.dependencies!==null&&ha(e.dependencies)?(typeof s==`function`&&(fc(t,n,s,r),p=t.memoizedState),(u=ao||mc(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&ha(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,Rc(e,t),r=!!(t.flags&128),a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=ro(t,e.child,null,i),t.child=ro(t,null,n,i)):Oc(e,t,n,i),t.memoizedState=a.state,e=t.child):e=rl(e,t,i),e}function Hc(e,t,n,r){return ia(),t.flags|=256,Oc(e,t,n,r),t.child}var Uc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Wc(e){return{baseLanes:e,cachePool:Ba()}}function Gc(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=sd),e}function Kc(e,t,n){var r=t.pendingProps,i=!1,a=!!(t.flags&128),o;if((o=a)||(o=e!==null&&e.memoizedState===null?!1:!!(Ao.current&2)),o&&(i=!0,t.flags&=-129),o=!!(t.flags&32),t.flags&=-33,e===null){if(J){if(i?To(t):Oo(),(e=Xi)?(e=am(e,Qi),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Vi===null?null:{id:Hi,overflow:Ui},retryLane:536870912,hydrationErrors:null},n=ji(e),n.return=t,t.child=n,Yi=t,Xi=null)):e=null,e===null)throw ea(t);return t.lanes=sm(e)?32:536870912,null}return a=r.children,r=r.fallback,i?(Oo(),i=t.mode,a=Jc({mode:`hidden`,children:a},i),r=ki(r,i,n,null),a.return=t,r.return=t,a.sibling=r,t.child=a,r=t.child,r.memoizedState=Wc(n),r.childLanes=Gc(e,o,n),t.memoizedState=Uc,Nc(null,r)):(To(t),qc(t,a))}var s=e.memoizedState;if(s!==null){var c=s.dehydrated;if(c!==null)return Xc(e,t,a,o,r,c,s,n)}return i?(Oo(),i=r.fallback,a=t.mode,s=e.child,c=s.sibling,r=Ei(s,{mode:`hidden`,children:r.children}),r.subtreeFlags=s.subtreeFlags&1206910976,c===null?(i=ki(i,a,n,null),i.flags|=2):i=Ei(c,i),i.return=t,r.return=t,r.sibling=i,t.child=r,Nc(null,r),r=t.child,i=e.child.memoizedState,i===null?i=Wc(n):(a=i.cachePool,a===null?a=Ba():(s=Ca._currentValue,a=a.parent===s?a:{parent:s,pool:s}),i={baseLanes:i.baseLanes|n,cachePool:a}),r.memoizedState=i,r.childLanes=Gc(e,o,n),t.memoizedState=Uc,Nc(e.child,r)):(To(t),n=e.child,e=n.sibling,n=Ei(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(o=t.deletions,o===null?(t.deletions=[e],t.flags|=16):o.push(e)),t.child=n,t.memoizedState=null,n)}function qc(e,t){return t=Jc({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function Jc(e,t){return e=wi(22,e,null,t),e.lanes=0,e}function Yc(e,t,n){return ro(t,e.child,null,n),e=qc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Xc(e,t,n,r,a,o,s,c){if(n)return t.flags&256?(To(t),t.flags&=-257,Yc(e,t,c)):t.memoizedState===null?(Oo(),o=a.fallback,s=t.mode,a=Jc({mode:`visible`,children:a.children},s),o=ki(o,s,c,null),o.flags|=2,a.return=t,o.return=t,a.sibling=o,t.child=a,ro(t,e.child,null,c),a=t.child,a.memoizedState=Wc(c),a.childLanes=Gc(e,r,c),t.memoizedState=Uc,Nc(null,a)):(Oo(),t.child=e.child,t.flags|=128,null);if(To(t),sm(o)){if(r=o.nextSibling&&o.nextSibling.dataset,r)var l=r.dgst;return r=l,r!==``&&(a=Error(i(419)),a.stack=``,a.digest=r,oa({value:a,source:null,stack:null})),Yc(e,t,c)}if(Dc||ma(e,t,c,!1),r=(c&e.childLanes)!==0,Dc||r){if(vo.current!==null)return Yc(e,t,c);if(r=Xu,r!==null&&(a=mt(r,c),a!==0&&a!==s.retryLane))throw s.retryLane=a,yi(e,a),Md(r,e,a),Ec;return om(o)||Wd(),Yc(e,t,c)}return om(o)?(t.flags|=192,t.child=e.child,null):(e=s.treeContext,Xi=lm(o.nextSibling),Yi=t,J=!0,Zi=null,Qi=!1,e!==null&&Ji(t,e),t=qc(t,a.children),t.flags|=134221824,t)}function Zc(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),fa(e.return,t,n)}function Qc(e){for(var t=null;e!==null;){var n=e.alternate;n!==null&&No(n)===null&&(t=e),e=e.sibling}return t}function $c(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function el(e){var t=e.child;for(e.child=null;t!==null;){var n=t.sibling;t.sibling=e.child,e.child=t,t=n}}function tl(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=Ao.current;if(t.flags&128)return jo(t,o),null;var s=!!(o&2);if(s?(o=o&1|2,t.flags|=128):o&=1,jo(t,o),i===`backwards`&&e!==null?(el(e),Oc(e,t,r,n),el(e)):Oc(e,t,r,n),r=J?Ri:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Zc(e,n,t);else if(e.tag===19)Zc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`backwards`:n=Qc(t.child),n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null,el(t)),$c(t,!0,i,null,a,r);break;case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&No(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}$c(t,!0,n,null,a,r);break;case`together`:$c(t,!1,null,null,void 0,r);break;case`independent`:t.memoizedState=null;break;default:n=Qc(t.child),n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),$c(t,!1,i,n,a,r)}return t.child}function nl(e,t,n){var r=t.pendingProps;return ua(t,t.type,r.value),Oc(e,t,r.children,n),t.child}function rl(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),id|=t.lanes,(n&t.childLanes)===0){if(e!==null){if(ma(e,t,n,!1),(n&t.childLanes)===0)return null}else return null}if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=Ei(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Ei(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function il(e,t){return(e.lanes&t)!==0||(e=e.dependencies,!!(e!==null&&ha(e)))}function al(e,t,n){switch(t.tag){case 3:Ee(t,t.stateNode.containerInfo),ua(t,Ca,e.memoizedState.cache),ia();break;case 27:case 5:De(t);break;case 4:Ee(t,t.stateNode.containerInfo);break;case 10:ua(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Eo(t),null;break;case 13:var r=t.memoizedState;if(r!==null){if(r.dehydrated!==null)return To(t),t.flags|=128,null;r=ma(e,t,n,!1);var i=t.child.childLanes;return r||(n&i)!==0?Kc(e,t,n):(To(t),e=rl(e,t,n),e===null?null:e.sibling)}To(t);break;case 19:if(t.flags&128)return tl(e,t,n);if(i=!!(e.flags&128),r=(n&t.childLanes)!==0,r||=(ma(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return tl(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),jo(t,Ao.current),r)break;return null;case 22:return t.lanes=0,Mc(e,t,n,t.pendingProps);case 24:ua(t,Ca,e.memoizedState.cache)}return rl(e,t,n)}function ol(e,t,n){if(e!==null){if(e.memoizedProps!==t.pendingProps)Dc=!0;else{if(!il(e,n)&&!(t.flags&128))return Dc=!1,al(e,t,n);Dc=!!(e.flags&131072)}}else Dc=!1,J&&t.flags&1048576&&Gi(t,Ri,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=qa(t.elementType),t.type=e,typeof e==`function`)Ti(e)?(r=gc(e,r),t.tag=1,t=Vc(null,t,e,r,n)):(t.tag=0,t=zc(null,t,e,r,n));else{if(e!=null){var a=e.$$typeof;if(a===A){t.tag=11,t=kc(null,t,e,r,n);break a}if(a===ce){t.tag=14,t=Ac(null,t,e,r,n);break a}if(a===k){t.tag=10,t.type=e,t=nl(null,t,n);break a}}throw t=ge(e)||e,Error(i(306,t,``))}}return t;case 0:return zc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,a=gc(r,t.pendingProps),Vc(e,t,r,a,n);case 3:a:{if(Ee(t,t.stateNode.containerInfo),e===null)throw Error(i(387));r=t.pendingProps;var o=t.memoizedState;a=o.element,so(e,t),ho(t,r,null,n);var s=t.memoizedState;if(r=s.cache,ua(t,Ca,r),r!==o.cache&&pa(t,[Ca],n,!0),mo(),r=s.element,o.isDehydrated){if(o={element:r,isDehydrated:!1,cache:s.cache},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){t=Hc(e,t,r,n);break a}if(r!==a){a=Pi(Error(i(424)),t),oa(a),t=Hc(e,t,r,n);break a}switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(Xi=lm(e.firstChild),Yi=t,J=!0,Zi=null,Qi=!0,n=io(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|134221824,n=n.sibling}else{if(ia(),r===a){t=rl(e,t,n);break a}Oc(e,t,r,n)}t=t.child}return t;case 26:return Rc(e,t),e===null?(n=Nm(t.type,null,t.pendingProps,null))?t.memoizedState=n:J||(t.stateNode=fp(t.type,t.pendingProps,we.current,t)):t.memoizedState=Nm(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return De(t),e===null&&J&&(r=t.stateNode=hm(t.type,t.pendingProps,we.current),Yi=t,Qi=!0,a=Xi,Sp(t.type)?(um=a,Xi=lm(r.firstChild)):Xi=a),Oc(e,t,t.pendingProps.children,n),Rc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&J&&((a=r=Xi)&&(r=rm(r,t.type,t.pendingProps,Qi),r===null?a=!1:(t.stateNode=r,Yi=t,Xi=lm(r.firstChild),Qi=!1,a=!0)),a||ea(t)),De(t),a=t.type,o=t.pendingProps,s=e===null?null:e.memoizedProps,r=o.children,pp(a,o)?r=null:s!==null&&pp(a,s)&&(t.flags|=32),t.memoizedState!==null&&(a=Ko(e,t,Yo,null,null,n),sh._currentValue=a),Rc(e,t),Oc(e,t,r,n),t.child;case 6:return e===null&&J&&((e=n=Xi)&&(n=im(n,t.pendingProps,Qi),n===null?e=!1:(t.stateNode=n,Yi=t,Xi=null,e=!0)),e||ea(t)),null;case 13:return Kc(e,t,n);case 4:return Ee(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=ro(t,null,r,n):Oc(e,t,r,n),t.child;case 11:return kc(e,t,t.type,t.pendingProps,n);case 7:return r=t.pendingProps,Rc(e,t),Oc(e,t,r,n),t.child;case 8:return Oc(e,t,t.pendingProps.children,n),t.child;case 12:return Oc(e,t,t.pendingProps.children,n),t.child;case 10:return nl(e,t,n);case 9:return a=t.type._context,r=t.pendingProps.children,ga(t),a=_a(a),r=r(a),t.flags|=1,Oc(e,t,r,n),t.child;case 14:return Ac(e,t,t.type,t.pendingProps,n);case 15:return jc(e,t,t.type,t.pendingProps,n);case 19:return tl(e,t,n);case 31:return Lc(e,t,n);case 22:return Mc(e,t,n,t.pendingProps);case 24:return ga(t),r=_a(Ca),e===null?(a=Ra(),a===null&&(a=Xu,o=wa(),a.pooledCache=o,o.refCount++,o!==null&&(a.pooledCacheLanes|=n),a=o),t.memoizedState={parent:r,cache:a},oo(t),ua(t,Ca,a)):((e.lanes&n)!==0&&(so(e,t),ho(t,null,null,n),mo()),a=e.memoizedState,o=t.memoizedState,a.parent===r?(r=o.cache,ua(t,Ca,r),r!==a.cache&&pa(t,[Ca],n,!0)):(a={parent:r,cache:r},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),ua(t,Ca,r))),Oc(e,t,t.pendingProps.children,n),t.child;case 30:return t.stateNode===null&&(t.stateNode={autoName:null,paired:null,clones:null,ref:null}),r=t.pendingProps,r.name!=null&&r.name!==`auto`?t.flags|=e===null?18882560:18874368:J&&Ki(t),e!==null&&e.memoizedProps.name!==r.name?t.flags|=4194816:Rc(e,t),Oc(e,t,r.children,n),t.child;case 29:throw t.pendingProps}throw Error(i(156,t.tag))}function sl(e){e.flags|=4}function cl(e,t,n,r,i){var a;if((a=!!(e.mode&32))&&(a=n===null?Jm(t,r):Jm(t,r)&&(r.src!==n.src||r.srcSet!==n.srcSet)),a){if(e.flags|=16777216,(i&335544128)===i){if(e.stateNode.complete)e.flags|=8192;else if(Vd())e.flags|=8192;else throw Ja=Wa,Ha}}else e.flags&=-16777217}function ll(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Ym(t)){if(Vd())e.flags|=8192;else throw Ja=Wa,Ha}}function ul(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:ct(),e.lanes|=t,cd|=t)}function dl(e,t){if(!J)switch(e.tailMode){case`visible`:break;case`collapsed`:for(var n=e.tail,r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null;break;default:for(t=e.tail,n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null}}function fl(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&1206910976,r|=i.flags&1206910976,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function pl(e,t,n){var r=t.pendingProps;switch(qi(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return fl(t),null;case 1:return fl(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),da(Ca),L(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(ra(t)?sl(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,aa())),fl(t),null;case 26:var a=t.type,o=t.memoizedState;return e===null?(sl(t),o===null?(fl(t),cl(t,a,null,r,n)):(fl(t),ll(t,o))):o?o===e.memoizedState?(fl(t),t.flags&=-16777217):(sl(t),fl(t),ll(t,o)):(e=e.memoizedProps,e!==r&&sl(t),fl(t),cl(t,a,e,r,n)),null;case 27:if(Oe(t),n=we.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&sl(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return fl(t),t.subtreeFlags&=-33554433,null}e=Se.current,ra(t)?ta(t,e):(e=hm(a,r,n),t.stateNode=e,sl(t))}return fl(t),t.subtreeFlags&=-33554433,null;case 5:if(Oe(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&sl(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return fl(t),t.subtreeFlags&=-33554433,null}if(o=Se.current,ra(t))ta(t,o);else{var s=lp(we.current);switch(o){case 1:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case 2:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;default:switch(a){case`svg`:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case`math`:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;case`script`:o=s.createElement(`div`),o.innerHTML=`<script><\/script>`,o=o.removeChild(o.firstChild);break;case`select`:o=typeof r.is==`string`?s.createElement(`select`,{is:r.is}):s.createElement(`select`),r.multiple?o.multiple=!0:r.size&&(o.size=r.size);break;default:o=typeof r.is==`string`?s.createElement(a,{is:r.is}):s.createElement(a)}}o[bt]=t,o[xt]=r;a:for(s=t.child;s!==null;){if(s.tag===5||s.tag===6)o.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===t)break a;for(;s.sibling===null;){if(s.return===null||s.return===t)break a;s=s.return}s.sibling.return=s.return,s=s.sibling}t.stateNode=o;a:switch(np(o,a,r),a){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&sl(t)}}return fl(t),t.subtreeFlags&=-33554433,cl(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&sl(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(i(166));if(e=we.current,ra(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,a=Yi,a!==null)switch(a.tag){case 27:case 5:r=a.memoizedProps}e[bt]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||$f(e.nodeValue,n)),e||ea(t,!0)}else e=lp(e).createTextNode(r),e[bt]=t,t.stateNode=e}return fl(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=ra(t),n!==null){if(e===null){if(!r)throw Error(i(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(557));e[bt]=t}else ia(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;fl(t),e=!1}else n=aa(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(ko(t),t):(ko(t),null);if(t.flags&128)throw Error(i(558))}return fl(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=ra(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a===null?null:a.dehydrated,!a)throw Error(i(317));a[bt]=t}else ia(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;fl(t),a=!1}else a=aa(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(ko(t),t):(ko(t),null)}return ko(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,a=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(a=r.alternate.memoizedState.cachePool.pool),o=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(o=r.memoizedState.cachePool.pool),o!==a&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),ul(t,t.updateQueue),fl(t),null);case 4:return L(),e===null&&Uf(t.stateNode.containerInfo),t.flags|=67108864,fl(t),null;case 10:return da(t.type),fl(t),null;case 19:if(Mo(t),r=t.memoizedState,r===null)return fl(t),null;if(a=!!(t.flags&128),o=r.rendering,o===null){if(a)dl(r,!1);else{if(rd!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=No(e),o!==null){for(t.flags|=128,dl(r,!1),e=o.updateQueue,t.updateQueue=e,ul(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)Di(n,e),n=n.sibling;return jo(t,Ao.current&1|2),J&&Wi(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&R()>md&&(t.flags|=128,a=!0,dl(r,!1),t.lanes=4194304)}}else{if(!a){if(e=No(o),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,ul(t,e),dl(r,!0),r.tail===null&&r.tailMode!==`collapsed`&&r.tailMode!==`visible`&&!o.alternate&&!J)return fl(t),null}else 2*R()-r.renderingStartTime>md&&n!==536870912&&(t.flags|=128,a=!0,dl(r,!1),t.lanes=4194304)}r.isBackwards?(o.sibling=t.child,t.child=o):(e=r.last,e===null?t.child=o:e.sibling=o,r.last=o)}if(r.tail!==null){e=r.tail;a:{for(n=e;n!==null;){if(n.alternate!==null){n=!1;break a}n=n.sibling}n=!0}return r.rendering=e,r.tail=e.sibling,r.renderingStartTime=R(),e.sibling=null,o=Ao.current,o=a?o&1|2:o&1,r.tailMode===`visible`||r.tailMode===`collapsed`||!n||J?jo(t,o):(n=o,I(Co,t),I(Ao,n),wo===null&&(wo=t)),J&&Wi(t,r.treeForkCount),e}return fl(t),null;case 22:case 23:return ko(t),So(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(fl(t),t.subtreeFlags&6&&(t.flags|=8192)):fl(t),n=t.updateQueue,n!==null&&ul(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&F(La),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),da(Ca),fl(t),null;case 25:return null;case 30:return t.flags|=33554432,fl(t),null}throw Error(i(156,t.tag))}function ml(e,t){switch(qi(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return da(Ca),L(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Oe(t),null;case 31:if(t.memoizedState!==null){if(ko(t),t.alternate===null)throw Error(i(340));ia()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(ko(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));ia()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Mo(t),e=t.flags,e&65536?(t.flags=e&-65537|128,e=t.memoizedState,e!==null&&(e.rendering=null,e.tail=null),t.flags|=4,t):null;case 4:return L(),null;case 10:return da(t.type),null;case 22:case 23:return ko(t),So(),e!==null&&F(La),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return da(Ca),null;case 25:return null;default:return null}}function hl(e,t){switch(qi(t),t.tag){case 3:da(Ca),L();break;case 26:case 27:case 5:Oe(t);break;case 4:L();break;case 31:t.memoizedState!==null&&ko(t);break;case 13:ko(t);break;case 19:Mo(t);break;case 10:da(t.type);break;case 22:case 23:ko(t),So(),e!==null&&F(La);break;case 24:da(Ca)}}function gl(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){ff(t,t.return,e)}}function _l(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){ff(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){ff(t,t.return,e)}}function vl(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{_o(t,n)}catch(t){ff(e,e.return,t)}}}function yl(e,t,n){n.props=gc(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){ff(e,t,n)}}function bl(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:var i=e.stateNode,a=ui(e.memoizedProps,i);(i.ref===null||i.ref.name!==a)&&(i.ref=Pp(a)),r=i.ref;break;case 7:if(e.stateNode===null){var o=new Fp(e);h(e.child,!1,Qp,o,void 0,void 0),e.stateNode=o}r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){ff(e,t,n)}}function xl(e,t){var n=e.ref,r=e.refCleanup;if(n!==null){if(typeof r==`function`)try{r()}catch(n){ff(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){ff(e,t,n)}else n.current=null}}function Sl(e,t){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&t!==null)for(var n=0;n<t.length;n++)em(e.stateNode,t[n])}function Cl(e){for(var t=e.return;t!==null&&(El(t)&&em(e.stateNode,t.stateNode),!Tl(t));)t=t.return}function wl(e){for(var t=e.return;t!==null&&(El(t)&&tm(e.stateNode,t.stateNode),!Tl(t));)t=t.return}function Tl(e){return e.tag===5||e.tag===3||e.tag===27}function El(e){return e&&e.tag===7&&e.stateNode!==null}function Dl(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){ff(e,e.return,t)}}function Ol(e,t,n){try{var r=e.stateNode;ip(r,e.type,n,t),r[xt]=t}catch(t){ff(e,e.return,t)}}function kl(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Sp(e.type)||e.tag===4}function Al(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||kl(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Sp(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function jl(e,t,n,r){var i=e.tag;if(i===5||i===6)i=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(i,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(i),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=dn)),Sl(e,r),V=!0;else if(i!==4&&(i===27&&(Sl(e,r),r=null,Sp(e.type)&&(n=e.stateNode,t=null)),e=e.child,e!==null))for(jl(e,t,n,r),e=e.sibling;e!==null;)jl(e,t,n,r),e=e.sibling}function Ml(e,t,n,r){var i=e.tag;if(i===5||i===6)i=e.stateNode,t?n.insertBefore(i,t):n.appendChild(i),Sl(e,r),V=!0;else if(i!==4&&(i===27&&(Sl(e,r),r=null,Sp(e.type)&&(n=e.stateNode)),e=e.child,e!==null))for(Ml(e,t,n,r),e=e.sibling;e!==null;)Ml(e,t,n,r),e=e.sibling}function Nl(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);np(t,r,n),t[bt]=e,t[xt]=n}catch(t){ff(e,e.return,t)}}var Pl=!1,Fl=null;function Il(e){(e.tag===30||e.subtreeFlags&33554432)&&(Pl=!0)}var Ll=null;function Rl(){var e=Ll;return Ll=null,e}var zl=0;function Bl(e,t,n,r,i){return zl=0,Vl(e.child,t,n,r,i)}function Vl(e,t,n,r,i){for(var a=!1;e!==null;){if(e.tag===5){var o=e.stateNode;if(r!==null){var s=Op(o);r.push(s),s.view&&(a=!0)}else a||Op(o).view&&(a=!0);Pl=!0,Tp(o,zl===0?t:t+`_`+zl,n),zl++}else e.tag===22&&e.memoizedState!==null||e.tag===30&&i||Vl(e.child,t,n,r,i)&&(a=!0);e=e.sibling}return a}function Hl(e,t){for(;e!==null;)e.tag===5?Ep(e.stateNode,e.memoizedProps):e.tag===22&&e.memoizedState!==null||e.tag===30&&t||Hl(e.child,t),e=e.sibling}function Ul(e){if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(Ul(e),e.tag===30&&e.flags&18874368&&e.stateNode.paired)){var t=e.memoizedProps;if(t.name==null||t.name===`auto`)throw Error(i(544));var n=t.name;t=fi(t.default,t.share),t!==`none`&&(Bl(e,n,t,null,!1)||Hl(e.child,!1))}e=e.sibling}}function Wl(e,t){if(e.tag===30){var n=e.stateNode,r=e.memoizedProps,i=ui(r,n),a=fi(r.default,n.paired?r.share:r.enter);a===`none`?Ul(e):Bl(e,i,a,null,!1)?(Ul(e),n.paired||t||jd(e,r.onEnter)):Hl(e.child,!1)}else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)Wl(e,t),e=e.sibling;else Ul(e)}function Gl(e){if(Fl!==null&&Fl.size!==0){var t=Fl;if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&e.flags&18874368){var n=e.memoizedProps,r=n.name;if(r!=null&&r!==`auto`){var i=t.get(r);if(i!==void 0){var a=fi(n.default,n.share);if(a!==`none`&&(Bl(e,r,a,null,!1)?(a=e.stateNode,i.paired=a,a.paired=i,jd(e,n.onShare)):Hl(e.child,!1)),t.delete(r),t.size===0)break}}}Gl(e)}e=e.sibling}}}function Kl(e){if(e.tag===30){var t=e.memoizedProps,n=ui(t,e.stateNode),r=Fl===null?void 0:Fl.get(n),i=fi(t.default,r===void 0?t.exit:t.share);i!==`none`&&(Bl(e,n,i,null,!1)?r===void 0?jd(e,t.onExit):(i=e.stateNode,r.paired=i,i.paired=r,Fl.delete(n),jd(e,t.onShare)):Hl(e.child,!1)),Fl!==null&&Gl(e)}else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)Kl(e),e=e.sibling;else Fl!==null&&Gl(e)}function ql(e){for(e=e.child;e!==null;){if(e.tag===30){var t=e.memoizedProps,n=ui(t,e.stateNode);t=fi(t.default,t.update),e.flags&=-5,t!==`none`&&Bl(e,n,t,e.memoizedState=[],!1)}else e.subtreeFlags&33554432&&ql(e);e=e.sibling}}function Jl(e){if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&e.flags&18874368){var t=e.stateNode;t.paired!==null&&(t.paired=null,Hl(e.child,!1))}Jl(e)}e=e.sibling}}function Yl(e){if(e.tag===30)e.stateNode.paired=null,Hl(e.child,!1),Jl(e);else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)Yl(e),e=e.sibling;else Jl(e)}function Xl(e){for(e=e.child;e!==null;)e.tag===30?Hl(e.child,!1):e.subtreeFlags&33554432&&Xl(e),e=e.sibling}function Zl(e,t,n,r,i,a,o){for(var s=!1;t!==null;){if(t.tag===5){var c=t.stateNode;if(a!==null&&zl<a.length){var l=a[zl],u=Op(c);(l.view||u.view)&&(s=!0);var d;if(d=!(e.flags&4)){if(u.clip)d=!0;else{d=l.rect;var f=u.rect;d=d.y!==f.y||d.x!==f.x||d.height!==f.height||d.width!==f.width}}d&&(e.flags|=4),u.abs?u=!l.abs:(l=l.rect,u=u.rect,u=l.height!==u.height||l.width!==u.width),u&&(e.flags|=32)}else e.flags|=32;e.flags&4&&Tp(c,zl===0?n:n+`_`+zl,i),s&&e.flags&4||(Ll===null&&(Ll=[]),Ll.push(c,zl===0?r:r+`_`+zl,t.memoizedProps)),zl++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&o?e.flags|=t.flags&32:Zl(e,t.child,n,r,i,a,o)&&(s=!0));t=t.sibling}return s}function Ql(e,t){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,r=e.stateNode,i=ui(n,r),a=fi(n.default,n.update);if(t){r=r.clones;var o=r===null?null:r.map(kp)}else o=e.memoizedState,e.memoizedState=null;r=e;var s=e.child;zl=0,i=Zl(r,s,i,i,a,o,!1),e.flags&4&&i&&(t||jd(e,n.onUpdate))}else e.subtreeFlags&33554432&&Ql(e,t);e=e.sibling}}var $l=!1,eu=!1,tu=!1,nu=!1,ru=typeof WeakSet==`function`?WeakSet:Set,iu=null,au=!1,ou=!1,su=!1,cu=!1;function lu(e,t,n){if(e=e.containerInfo,sp=gh,e=Br(e),Vr(e)){if(`selectionStart`in e)var r={start:e.selectionStart,end:e.selectionEnd};else a:{r=(r=e.ownerDocument)&&r.defaultView||window;var i=r.getSelection&&r.getSelection();if(i&&i.rangeCount!==0){r=i.anchorNode;var a=i.anchorOffset,o=i.focusNode;i=i.focusOffset;try{r.nodeType,o.nodeType}catch{r=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==r||a!==0&&f.nodeType!==3||(c=s+a),f!==o||i!==0&&f.nodeType!==3||(l=s+i),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===r&&++u===a&&(c=s),p===o&&++d===i&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}r=c===-1||l===-1?null:{start:c,end:l}}else r=null}r||={start:0,end:0}}else r=null;for(cp={focusedElem:e,selectionRange:r},gh=!1,n=(n&335544064)===n,iu=t,t=n?9270:1024;iu!==null;){if(e=iu,n&&(r=e.deletions,r!==null))for(a=0;a<r.length;a++)n&&Kl(r[a]);if(e.alternate===null&&e.flags&2)n&&Il(e),uu(n);else{if(e.tag===22){if(r=e.alternate,e.memoizedState!==null){r!==null&&r.memoizedState===null&&n&&Kl(r),uu(n);continue}if(r!==null&&r.memoizedState!==null){n&&Il(e),uu(n);continue}}r=e.child,(e.subtreeFlags&t)!==0&&r!==null?(r.return=e,iu=r):(n&&ql(e),uu(n))}}Fl=null}function uu(e){for(;iu!==null;){var t=iu,n=e,r=t.alternate,a=t.flags;switch(t.tag){case 0:case 11:case 15:break;case 1:if(a&1024&&r!==null){n=void 0,a=r.memoizedProps,r=r.memoizedState;var o=t.stateNode;try{var s=gc(t.type,a);n=o.getSnapshotBeforeUpdate(s,r),o.__reactInternalSnapshotBeforeUpdate=n}catch(e){ff(t,t.return,e)}}break;case 3:if(a&1024){if(r=t.stateNode.containerInfo,n=r.nodeType,n===9)nm(r);else if(n===1)switch(r.nodeName){case`HEAD`:case`HTML`:case`BODY`:nm(r);break;default:r.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:n&&r!==null&&(n=ui(r.memoizedProps,r.stateNode),a=t.memoizedProps,a=fi(a.default,a.update),a!==`none`&&Bl(r,n,a,r.memoizedState=[],!0));break;default:if(a&1024)throw Error(i(163))}if(r=t.sibling,r!==null){r.return=t.return,iu=r;break}iu=t.return}}function du(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:ju(e,n),r&4&&gl(5,n);break;case 1:if(ju(e,n),r&4){if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){ff(n,n.return,e)}else{var i=gc(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){ff(n,n.return,e)}}}r&64&&vl(n),r&512&&bl(n,n.return);break;case 3:if(ju(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{_o(e,t)}catch(e){ff(n,n.return,e)}}break;case 27:t===null&&r&4&&Nl(n);case 26:case 5:ju(e,n),t===null&&r&4&&Dl(n),r&512&&bl(n,n.return);break;case 12:ju(e,n);break;case 31:ju(e,n),r&4&&bu(e,n);break;case 13:ju(e,n),r&4&&xu(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=gf.bind(null,n),cm(e,n))));break;case 22:if(r=n.memoizedState!==null||$l,!r){var a=t!==null&&t.memoizedState!==null||eu;t=$l,i=eu,$l=r,(eu=a)&&!i?(r=2,n.subtreeFlags&8772&&(r|=1),Nu(e,n,r)):ju(e,n),$l=t,eu=i}break;case 30:ju(e,n),r&512&&bl(n,n.return);break;case 7:r&512&&bl(n,n.return);default:ju(e,n)}}function fu(e,t){for(e=e.child;e!==null;)pu(e,t),e=e.sibling}function pu(e,t){switch(e.tag){case 5:case 26:try{var n=e.stateNode;if(t){var r=n.style;typeof r.setProperty==`function`?r.setProperty(`display`,`none`,`important`):r.display=`none`}else{var i=e.stateNode,a=e.memoizedProps.style,o=a!=null&&a.hasOwnProperty(`display`)?a.display:null;i.style.display=o==null||typeof o==`boolean`?``:(``+o).trim()}}catch(t){ff(e,e.return,t)}mu(e,t);break;case 6:try{e.stateNode.nodeValue=t?``:e.memoizedProps,V=!0}catch(t){ff(e,e.return,t)}break;case 18:try{var s=e.stateNode;t?wp(s,!0):wp(e.stateNode,!1)}catch(t){ff(e,e.return,t)}break;case 22:case 23:e.memoizedState===null&&fu(e,t);break;default:fu(e,t)}}function mu(e,t){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){a:{var n=e,r=t;switch(n.tag){case 4:pu(n,r);break a;case 22:n.memoizedState===null&&mu(n,r);break a;default:mu(n,r)}}e=e.sibling}}function hu(e){var t=e.alternate;t!==null&&(e.alternate=null,hu(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&kt(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var gu=null,_u=!1;function vu(e,t,n){for(n=n.child;n!==null;)yu(e,t,n),n=n.sibling}function yu(e,t,n){if(Xe&&typeof Xe.onCommitFiberUnmount==`function`)try{Xe.onCommitFiberUnmount(Ye,n)}catch{}switch(n.tag){case 26:eu||xl(n,t),vu(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&!eu&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:eu||xl(n,t),wl(n);var r=gu,i=_u;Sp(n.type)&&(gu=n.stateNode,_u=!1),vu(e,t,n),gm(n.stateNode,n.type,n.memoizedProps),gu=r,_u=i;break;case 5:eu||xl(n,t),wl(n);case 6:if(n.tag===6&&wl(n),r=gu,i=_u,gu=null,vu(e,t,n),gu=r,_u=i,gu!==null){if(_u)try{(gu.nodeType===9?gu.body:gu.nodeName===`HTML`?gu.ownerDocument.body:gu).removeChild(n.stateNode),V=!0}catch(e){ff(n,t,e)}else try{gu.removeChild(n.stateNode),V=!0}catch(e){ff(n,t,e)}}break;case 18:gu!==null&&(_u?(e=gu,Cp(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Hh(e)):Cp(gu,n.stateNode));break;case 4:r=gu,i=_u,gu=n.stateNode.containerInfo,_u=!0,vu(e,t,n),gu=r,_u=i;break;case 0:case 11:case 14:case 15:_l(2,n,t),eu||_l(4,n,t),vu(e,t,n);break;case 1:eu||(xl(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&yl(n,t,r)),vu(e,t,n);break;case 21:vu(e,t,n);break;case 22:eu=(r=eu)||n.memoizedState!==null,vu(e,t,n),eu=r;break;case 30:xl(n,t),vu(e,t,n);break;case 7:eu||xl(n,t),vu(e,t,n);break;default:vu(e,t,n)}}function bu(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Hh(e)}catch(e){ff(t,t.return,e)}}}function xu(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Hh(e)}catch(e){ff(t,t.return,e)}}function Su(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new ru),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new ru),t;default:throw Error(i(435,e.tag))}}function Cu(e,t){var n=Su(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=_f.bind(null,e,t);t.then(r,r)}})}function wu(e,t,n){var r=t.deletions;if(r!==null)for(var a=0;a<r.length;a++){var o=r[a],s=e,c=t,l=c;a:for(;l!==null;){switch(l.tag){case 27:if(Sp(l.type)){gu=l.stateNode,_u=!1;break a}break;case 5:gu=l.stateNode,_u=!1;break a;case 3:case 4:gu=l.stateNode.containerInfo,_u=!0;break a}l=l.return}if(gu===null)throw Error(i(160));yu(s,c,o),gu=null,_u=!1,s=o.alternate,s!==null&&(s.return=null),o.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Eu(t,e,n),t=t.sibling}var Tu=null;function Eu(e,t,n){var r=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(a&4&&(r=e.updateQueue,r=r===null?null:r.events,r!==null))for(var o=0;o<r.length;o++){var s=r[o];s.ref.impl=s.nextImpl}wu(t,e,n),Du(e),a&4&&(_l(3,e,e.return),gl(3,e),_l(5,e,e.return));break;case 1:wu(t,e,n),Du(e),a&512&&(eu||r===null||xl(r,r.return)),a&64&&$l&&(e=e.updateQueue,e!==null&&(t=e.callbacks,t!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?t:n.concat(t))));break;case 26:if(o=Tu,wu(t,e,n),Du(e),a&512&&(eu||r===null||xl(r,r.return)),a&4){if(a=r===null?null:r.memoizedState,n=e.memoizedState,r===null){if(n===null){if(e.stateNode===null){if($l)e.stateNode=fp(e.type,e.memoizedProps,t.containerInfo,e);else{a:{t=e.type,n=e.memoizedProps,a=o.ownerDocument||o;b:switch(t){case`title`:r=a.getElementsByTagName(`title`)[0],(!r||r[Dt]||r[bt]||r.namespaceURI===`http://www.w3.org/2000/svg`||r.hasAttribute(`itemprop`))&&(r=a.createElement(t),a.head.insertBefore(r,a.querySelector(`head > title`))),np(r,t,n),r[bt]=e,Pt(r),t=r;break a;case`link`:if(o=Gm(`link`,`href`,a).get(t+(n.href||``))){for(s=0;s<o.length;s++)if(r=o[s],r.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&r.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&r.getAttribute(`title`)===(n.title==null?null:n.title)&&r.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){o.splice(s,1);break b}}r=a.createElement(t),np(r,t,n),a.head.appendChild(r);break;case`meta`:if(o=Gm(`meta`,`content`,a).get(t+(n.content||``))){for(s=0;s<o.length;s++)if(r=o[s],r.getAttribute(`content`)===(n.content==null?null:``+n.content)&&r.getAttribute(`name`)===(n.name==null?null:n.name)&&r.getAttribute(`property`)===(n.property==null?null:n.property)&&r.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&r.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){o.splice(s,1);break b}}r=a.createElement(t),np(r,t,n),a.head.appendChild(r);break;default:throw Error(i(468,t))}r[bt]=e,Pt(r),t=r}e.stateNode=t}}else $l||Km(o,e.type,e.stateNode)}else e.stateNode=Bm(o,n,e.memoizedProps)}else a===n?n===null&&e.stateNode!==null&&Ol(e,e.memoizedProps,r.memoizedProps):(a===null?(t=r.stateNode,t===null||eu||t.parentNode.removeChild(t)):a.count--,n===null?$l||Km(o,e.type,e.stateNode):Bm(o,n,e.memoizedProps))}break;case 27:wu(t,e,n),Du(e),a&512&&(eu||r===null||xl(r,r.return)),r!==null&&a&4&&Ol(e,e.memoizedProps,r.memoizedProps);break;case 5:if(o=tu,tu=!1,wu(t,e,n),tu=o,Du(e),a&512&&(eu||r===null||xl(r,r.return)),e.flags&32){t=e.stateNode;try{rn(t,``),V=!0}catch(t){ff(e,e.return,t)}}a&4&&e.stateNode!=null&&(t=e.memoizedProps,Ol(e,t,r===null?t:r.memoizedProps)),a&1024&&(nu=!0);break;case 6:if(wu(t,e,n),Du(e),a&4){if(e.stateNode===null)throw Error(i(162));t=e.memoizedProps,n=e.stateNode;try{n.nodeValue=t,V=!0}catch(t){ff(e,e.return,t)}}break;case 3:if(V=!1,Wm=null,o=Tu,Tu=bm(t.containerInfo),wu(t,e,n),Tu=o,Du(e),a&4&&r!==null&&r.memoizedState.isDehydrated)try{Hh(t.containerInfo)}catch(t){ff(e,e.return,t)}nu&&(nu=!1,Ou(e)),V=!1;break;case 4:a=tu,tu=$l,r=Wt(),o=Tu,Tu=bm(e.stateNode.containerInfo),wu(t,e,n),Du(e),Tu=o,V&&ou&&(su=!0),V=r,tu=a;break;case 12:wu(t,e,n),Du(e);break;case 31:wu(t,e,n),Du(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Cu(e,t)));break;case 13:wu(t,e,n),Du(e),e.child.flags&8192&&e.memoizedState!==null!=(r!==null&&r.memoizedState!==null)&&(fd=R()),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Cu(e,t)));break;case 22:o=e.memoizedState!==null,s=r!==null&&r.memoizedState!==null;var c=$l,l=eu,u=tu;$l=c||o,tu=u||o,eu=l||s,wu(t,e,n),eu=l,tu=u,$l=c,Du(e),a&8192&&(t=e.stateNode,t._visibility=o?t._visibility&-2:t._visibility|1,!o||r===null||s||$l||eu||(t=s||eu,n=$l,r=eu,$l=o||$l,eu=t,Mu(e,2),$l=n,eu=r),!o&&tu||fu(e,o)),a&4&&(t=e.updateQueue,t!==null&&(n=t.retryQueue,n!==null&&(t.retryQueue=null,Cu(e,n))));break;case 19:wu(t,e,n),Du(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Cu(e,t)));break;case 30:a&512&&(eu||r===null||xl(r,r.return)),a=Wt(),o=ou,s=(n&335544064)===n,c=e.memoizedProps,ou=s&&fi(c.default,c.update)!==`none`,wu(t,e,n),Du(e),s&&r!==null&&V&&(e.flags|=4),ou=o,V=a;break;case 21:break;case 7:a&512&&(eu||r===null||xl(r,r.return)),r&&r.stateNode!==null&&(r.stateNode._fragmentFiber=e);default:wu(t,e,n),Du(e)}}function Du(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(kl(r)){n=r;break}r=r.return}r=null;for(var a=e.return;a!==null;){if(El(a)){var o=a.stateNode;r===null?r=[o]:r.push(o)}if(Tl(a))break;a=a.return}var s=r;if(n==null)throw Error(i(160));switch(n.tag){case 27:var c=n.stateNode;Ml(e,Al(e),c,s);break;case 5:var l=n.stateNode;n.flags&32&&(rn(l,``),n.flags&=-33),Ml(e,Al(e),l,s);break;case 3:case 4:var u=n.stateNode.containerInfo;jl(e,Al(e),u,s);break;default:throw Error(i(161))}}catch(t){ff(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Ou(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Ou(t),t.tag===5&&t.flags&1024&&(t=t.stateNode,gh=!0,t.reset(),gh=!1),e=e.sibling}}function ku(e,t){if(t.subtreeFlags&9270)for(t=t.child;t!==null;)Au(t,e),t=t.sibling;else Ql(t,!1)}function Au(e,t){var n=e.alternate;if(n===null)Wl(e,!1);else switch(e.tag){case 3:if(cu=au=!1,Rl(),ku(t,e),!au&&!su){if(e=Ll,e!==null)for(var r=0;r<e.length;r+=3){n=e[r];var i=e[r+1];Ep(n,e[r+2]),n=n.ownerDocument.documentElement,n!==null&&n.animate({opacity:[0,0],pointerEvents:[`none`,`none`]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition-group(`+i+`)`})}e=t.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===``&&(e.style.viewTransitionName=`none`,e.animate({opacity:[0,0],pointerEvents:[`none`,`none`]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition-group(root)`}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition`})),cu=!0}Ll=null;break;case 5:ku(t,e);break;case 4:r=au,au=!1,ku(t,e),au&&(su=!0),au=r;break;case 22:e.memoizedState===null&&(n.memoizedState===null?ku(t,e):Wl(e,!1));break;case 30:r=au,i=Rl(),au=!1,ku(t,e),au&&(e.flags|=4);var a=e.memoizedProps,o=e.stateNode;t=ui(a,o),o=ui(n.memoizedProps,o);var s=fi(a.default,a.update);s===`none`?t=!1:(a=n.memoizedState,n.memoizedState=null,n=e.child,zl=0,t=Zl(e,n,t,o,s,a,!0),zl!==(a===null?0:a.length)&&(e.flags|=32)),e.flags&4&&t?(jd(e,e.memoizedProps.onUpdate),Ll=i):i!==null&&(i.push.apply(i,Ll),Ll=i),au=e.flags&32?!0:r;break;default:ku(t,e)}}function ju(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)du(e,t.alternate,t),t=t.sibling}function Mu(e,t){for(e=e.child;e!==null;){var n=e,r=t;switch(n.tag){case 0:case 11:case 14:case 15:_l(4,n,n.return),Mu(n,r);break;case 1:xl(n,n.return);var i=n.stateNode;typeof i.componentWillUnmount==`function`&&yl(n,n.return,i),Mu(n,r);break;case 27:r&2&&gm(n.stateNode,n.type,n.memoizedProps);case 5:xl(n,n.return),n.tag!==5&&n.tag!==27||wl(n),Mu(n,r);break;case 6:wl(n);break;case 26:xl(n,n.return),i=n.stateNode,n.memoizedState!==null||i===null||eu||i.parentNode.removeChild(i),Mu(n,r);break;case 22:n.memoizedState===null&&Mu(n,r);break;case 30:xl(n,n.return),Mu(n,r);break;case 7:xl(n,n.return);default:Mu(n,r)}e=e.sibling}}function Nu(e,t,n){for(n=t.subtreeFlags&8772?n:n&-2,t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags,s=!!(n&1);switch(a.tag){case 0:case 11:case 15:Nu(i,a,n),gl(4,a);break;case 1:if(Nu(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){ff(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var c=r.stateNode;try{var l=i.shared.hiddenCallbacks;if(l!==null)for(i.shared.hiddenCallbacks=null,i=0;i<l.length;i++)go(l[i],c)}catch(e){ff(r,r.return,e)}}s&&o&64&&vl(a),bl(a,a.return);break;case 27:n&2&&Nl(a);case 5:a.tag!==5&&a.tag!==27||Cl(a),Nu(i,a,n),s&&r===null&&o&4&&Dl(a),bl(a,a.return);break;case 6:Cl(a);break;case 26:c=a.stateNode,a.memoizedState!==null||c===null||$l||Km(bm(c.ownerDocument),a.type,c),Nu(i,a,n),s&&r===null&&o&4&&Dl(a),bl(a,a.return);break;case 12:Nu(i,a,n);break;case 31:Nu(i,a,n),s&&o&4&&bu(i,a);break;case 13:Nu(i,a,n),s&&o&4&&xu(i,a);break;case 22:a.memoizedState===null&&Nu(i,a,n),bl(a,a.return);break;case 30:Nu(i,a,n),bl(a,a.return);break;case 7:bl(a,a.return);default:Nu(i,a,n)}t=t.sibling}}function Pu(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&Ta(n))}function Fu(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Ta(e))}function Iu(e,t,n,r){var i=(n&335544064)===n;if(t.subtreeFlags&(i?10262:10256))for(t=t.child;t!==null;)Lu(e,t,n,r),t=t.sibling;else i&&Xl(t)}function Lu(e,t,n,r){var i=(n&335544064)===n;i&&t.alternate===null&&t.return!==null&&t.return.alternate!==null&&Yl(t);var a=t.flags;switch(t.tag){case 0:case 11:case 15:Iu(e,t,n,r),a&2048&&gl(9,t);break;case 1:Iu(e,t,n,r);break;case 3:Iu(e,t,n,r),i&&cu&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,e.style.viewTransitionName===`root`&&(e.style.viewTransitionName=``),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===`none`&&(e.style.viewTransitionName=``)),a&2048&&(a=null,t.alternate!==null&&(a=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==a&&(t.refCount++,a!=null&&Ta(a)));break;case 12:if(a&2048){Iu(e,t,n,r),a=t.stateNode;try{var o=t.memoizedProps,s=o.id,c=o.onPostCommit;typeof c==`function`&&c(s,t.alternate===null?`mount`:`update`,a.passiveEffectDuration,-0)}catch(e){ff(t,t.return,e)}}else Iu(e,t,n,r);break;case 31:Iu(e,t,n,r);break;case 13:Iu(e,t,n,r);break;case 23:break;case 22:o=t.stateNode,s=t.alternate,t.memoizedState===null?(i&&s!==null&&s.memoizedState!==null&&Yl(t),o._visibility&2?Iu(e,t,n,r):(o._visibility|=2,Ru(e,t,n,r,!!(t.subtreeFlags&10256)||!1))):(i&&s!==null&&s.memoizedState===null&&Yl(s),o._visibility&2?Iu(e,t,n,r):zu(e,t)),a&2048&&Pu(s,t);break;case 24:Iu(e,t,n,r),a&2048&&Fu(t.alternate,t);break;case 30:i&&(a=t.alternate,a!==null&&(Hl(a.child,!0),Hl(t.child,!0))),Iu(e,t,n,r);break;default:Iu(e,t,n,r)}}function Ru(e,t,n,r,i){for(i&&=!!(t.subtreeFlags&10256)||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:Ru(a,o,s,c,i),gl(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,Ru(a,o,s,c,i)):u._visibility&2?Ru(a,o,s,c,i):zu(a,o),i&&l&2048&&Pu(o.alternate,o);break;case 24:Ru(a,o,s,c,i),i&&l&2048&&Fu(o.alternate,o);break;default:Ru(a,o,s,c,i)}t=t.sibling}}function zu(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:zu(n,r),i&2048&&Pu(r.alternate,r);break;case 24:zu(n,r),i&2048&&Fu(r.alternate,r);break;default:zu(n,r)}t=t.sibling}}var Bu=8192;function Vu(e,t,n){if(e.subtreeFlags&Bu)for(e=e.child;e!==null;)Hu(e,t,n),e=e.sibling}function Hu(e,t,n){switch(e.tag){case 26:Vu(e,t,n),e.flags&Bu&&(e.memoizedState===null?(e=e.stateNode,(t&335544128)===t&&Zm(n,e)):Qm(n,Tu,e.memoizedState,e.memoizedProps));break;case 5:Vu(e,t,n),e.flags&Bu&&(e=e.stateNode,(t&335544128)===t&&Zm(n,e));break;case 3:case 4:var r=Tu;Tu=bm(e.stateNode.containerInfo),Vu(e,t,n),Tu=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=Bu,Bu=16777216,Vu(e,t,n),Bu=r):Vu(e,t,n));break;case 30:if((e.flags&Bu)!==0&&(r=e.memoizedProps.name,r!=null&&r!==`auto`)){var i=e.stateNode;i.paired=null,Fl===null&&(Fl=new Map),Fl.set(r,i)}Vu(e,t,n);break;default:Vu(e,t,n)}}function Uu(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Wu(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];iu=r,qu(r,e)}Uu(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Gu(e),e=e.sibling}function Gu(e){switch(e.tag){case 0:case 11:case 15:Wu(e),e.flags&2048&&_l(9,e,e.return);break;case 3:Wu(e);break;case 12:Wu(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Ku(e)):Wu(e);break;default:Wu(e)}}function Ku(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];iu=r,qu(r,e)}Uu(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:_l(8,t,t.return),Ku(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Ku(t));break;default:Ku(t)}e=e.sibling}}function qu(e,t){for(;iu!==null;){var n=iu;switch(n.tag){case 0:case 11:case 15:_l(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:Ta(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,iu=r;else a:for(n=e;iu!==null;){r=iu;var i=r.sibling,a=r.return;if(hu(r),r===n){iu=null;break a}if(i!==null){i.return=a,iu=i;break a}iu=a}}}var Ju={getCacheForType:function(e){var t=_a(Ca),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return _a(Ca).controller.signal}},Yu=typeof WeakMap==`function`?WeakMap:Map,X=0,Xu=null,Z=null,Q=0,Zu=0,Qu=null,$u=!1,ed=!1,td=!1,nd=0,rd=0,id=0,ad=0,od=0,sd=0,cd=0,ld=null,ud=null,dd=!1,fd=0,pd=0,md=1/0,hd=null,gd=null,_d=0,vd=null,yd=null,bd=0,xd=0,Sd=null,Cd=null,wd=null,Td=null,Ed=null,Dd=0,Od=null;function kd(){return X&2&&Q!==0?Q&-Q:N.T===null?_t():Nf()}function Ad(){if(sd===0){if(!(Q&536870912)||J){var e=nt;nt<<=1,!(nt&3932160)&&(nt=262144),sd=e}else sd=536870912}return e=Co.current,e!==null&&(e.flags|=32),sd}function jd(e,t){if(t!=null){var n=e.stateNode,r=n.ref;r===null&&(r=n.ref=Pp(ui(e.memoizedProps,n))),Td===null&&(Td=[]),Td.push(t.bind(null,r))}}function Md(e,t,n){(e===Xu&&(Zu===2||Zu===9)||e.cancelPendingCommit!==null)&&(zd(e,0),Id(e,Q,sd,!1)),ut(e,n),X&2&&e===Xu||(e===Xu&&(!(X&2)&&(ad|=n),rd===4&&Id(e,Q,sd,!1)),Tf(e))}function Nd(e,t,n){if(X&6)throw Error(i(327));var r=!n&&!(t&127)&&(t&e.expiredLanes)===0||at(e,t),a=r?qd(e,t):Gd(e,t,!0),o=r;do{if(a===0){ed&&!r&&Id(e,t,0,!1);break}if(n=e.current.alternate,o&&!Fd(n))a=Gd(e,t,!1),o=!1;else{if(a===2){if(o=t,e.errorRecoveryDisabledLanes&o)var s=0;else s=e.pendingLanes&-536870913,s=s===0?s&536870912?536870912:0:s;if(s!==0){t=s;a:{var c=e;a=ld;var l=c.current.memoizedState.isDehydrated;if(l&&(zd(c,s).flags|=256),s=Gd(c,s,!1),s!==2&&s!==6){if(td&&!l){c.errorRecoveryDisabledLanes|=o,ad|=o,a=4;break a}o=ud,ud=a,o!==null&&(ud===null?ud=o:ud.push.apply(ud,o))}a=s}if(o=!1,a!==2)continue}}if(a===1){zd(e,0),Id(e,t,0,!0);break}a:{switch(r=e,o=a,o){case 0:case 1:throw Error(i(345));case 4:if((t&4194048)!==t&&(t&62914560)!==t)break;case 6:Id(r,t,sd,!$u);break a;case 2:ud=null;break;case 3:case 5:break;default:throw Error(i(329))}if((t&62914560)===t&&(a=fd+300-R(),10<a)){if(Id(r,t,sd,!$u),it(r,0,!0)!==0)break a;bd=t,r.timeoutHandle=gp(Pd.bind(null,r,n,ud,hd,dd,t,sd,ad,cd,$u,o,`Throttled`,-0,0),a);break a}Pd(r,n,ud,hd,dd,t,sd,ad,cd,$u,o,null,-0,0)}break}}while(1);Tf(e)}function Pd(e,t,n,r,i,a,o,s,c,l,u,d,f,p){e.timeoutHandle=-1;var m=t.subtreeFlags,h=(a&335544064)===a;d=null,(h||m&8192||(m&16785408)==16785408)&&(d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:dn},Fl=null,Hu(t,a,d),h&&(m=d,h=e.containerInfo,h=(h.nodeType===9?h:h.ownerDocument).__reactViewTransition,h!=null&&(m.count++,m.waitingForViewTransition=!0,m=nh.bind(m),h.finished.then(m,m))),m=(a&62914560)===a?fd-R():(a&4194048)===a?pd-R():0,m=eh(d,m),m!==null)?(bd=a,e.cancelPendingCommit=m(ef.bind(null,e,t,a,n,r,i,o,s,c,l,u,d,null,f,p)),Id(e,a,o,!l)):ef(e,t,a,n,r,i,o,s,c,l,u,d)}function Fd(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!Pr(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Id(e,t,n,r){t=ot(e,t),t&=~od,t&=~ad,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-z(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&ft(e,n,t)}function Ld(){return X&6?!0:(Ef(0,!1),!1)}function Rd(){if(Z!==null){if(Zu===0)var e=Z.return;else e=Z,la=ca=null,Qo(e),Za=null,Qa=0,e=Z;for(;e!==null;)hl(e.alternate,e),e=e.return;Z=null}}function zd(e,t){var n=e.timeoutHandle;return n!==-1&&(e.timeoutHandle=-1,_p(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),bd=0,Rd(),Xu=e,Z=n=Ei(e.current,null),Q=t,Zu=0,Qu=null,$u=!1,ed=at(e,t),td=!1,cd=sd=od=ad=id=rd=0,ud=ld=null,dd=!1,nd=ot(e,t),_i(),n}function Bd(e,t){Y=null,N.H=cc,t===Va||t===Ua?(t=Ya(),Zu=3):t===Ha?(t=Ya(),Zu=4):Zu=t===Ec?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,Qu=t,Z===null&&(rd=1,bc(e,Pi(t,e.current)))}function Vd(){var e=Co.current;return e===null?!0:(Q&4194048)===Q?wo===null:(Q&62914560)===Q||Q&536870912?e===wo:!1}function Hd(){var e=N.H;return N.H=cc,e===null?cc:e}function Ud(){var e=N.A;return N.A=Ju,e}function Wd(){rd=4,$u||(Q&4194048)!==Q&&Co.current!==null||(ed=!0),!(id&134217727)&&!(ad&134217727)||Xu===null||Id(Xu,Q,sd,!1)}function Gd(e,t,n){var r=X;X|=2;var i=Hd(),a=Ud();(Xu!==e||Q!==t)&&(hd=null,zd(e,t)),t=!1;var o=rd;a:do try{if(Zu!==0&&Z!==null){var s=Z,c=Qu;switch(Zu){case 8:Rd(),o=6;break a;case 3:case 2:case 9:case 6:Co.current===null&&(t=!0);var l=Zu;if(Zu=0,Qu=null,Zd(e,s,c,l),n&&ed){o=0;break a}break;default:l=Zu,Zu=0,Qu=null,Zd(e,s,c,l)}}Kd(),o=rd;break}catch(t){Bd(e,t)}while(1);return t&&e.shellSuspendCounter++,la=ca=null,X=r,N.H=i,N.A=a,Z===null&&(Xu=null,Q=0,_i()),o}function Kd(){for(;Z!==null;)Yd(Z)}function qd(e,t){var n=X;X|=2;var r=Hd(),a=Ud();Xu!==e||Q!==t?(hd=null,md=R()+500,zd(e,t)):ed=at(e,t);a:do try{if(Zu!==0&&Z!==null){t=Z;var o=Qu;b:switch(Zu){case 1:Zu=0,Qu=null,Zd(e,t,o,1);break;case 2:case 9:if(Ga(o)){Zu=0,Qu=null,Xd(t);break}t=function(){Zu!==2&&Zu!==9||Xu!==e||(Zu=7),Tf(e)},o.then(t,t);break a;case 3:Zu=7;break a;case 4:Zu=5;break a;case 7:Ga(o)?(Zu=0,Qu=null,Xd(t)):(Zu=0,Qu=null,Zd(e,t,o,7));break;case 5:var s=null;switch(Z.tag){case 26:s=Z.memoizedState;case 5:case 27:var c=Z;if(s?Ym(s):c.stateNode.complete){Zu=0,Qu=null;var l=c.sibling;if(l!==null)Z=l;else{var u=c.return;u===null?Z=null:(Z=u,Qd(u))}break b}}Zu=0,Qu=null,Zd(e,t,o,5);break;case 6:Zu=0,Qu=null,Zd(e,t,o,6);break;case 8:Rd(),rd=6;break a;default:throw Error(i(462))}}Jd();break}catch(t){Bd(e,t)}while(1);return la=ca=null,N.H=r,N.A=a,X=n,Z===null?(Xu=null,Q=0,_i(),rd):0}function Jd(){for(;Z!==null&&!ze();)Yd(Z)}function Yd(e){var t=ol(e.alternate,e,nd);e.memoizedProps=e.pendingProps,t===null?Qd(e):Z=t}function Xd(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Bc(n,t,t.pendingProps,t.type,void 0,Q);break;case 11:t=Bc(n,t,t.pendingProps,t.type.render,t.ref,Q);break;case 5:Qo(t);var r=t;r===Yi&&(J?(na(r),r.tag===5&&r.stateNode!=null&&(Xi=r.stateNode)):(na(r),J=!0));default:hl(n,t),t=Z=Di(t,nd),t=ol(n,t,nd)}e.memoizedProps=e.pendingProps,t===null?Qd(e):Z=t}function Zd(e,t,n,r){la=ca=null,Qo(t),Za=null,Qa=0;var i=t.return;try{if(Tc(e,i,t,n,Q)){rd=1,bc(e,Pi(n,e.current)),Z=null;return}}catch(t){if(i!==null)throw Z=i,t;rd=1,bc(e,Pi(n,e.current)),Z=null;return}t.flags&32768?(J||r===1?e=!0:ed||Q&536870912?e=!1:($u=e=!0,(r===2||r===9||r===3||r===6)&&(r=Co.current,r!==null&&r.tag===13&&(r.flags|=16384))),$d(t,e)):Qd(t)}function Qd(e){var t=e;do{if(t.flags&32768){$d(t,$u);return}e=t.return;var n=pl(t.alternate,t,nd);if(n!==null){Z=n;return}if(t=t.sibling,t!==null){Z=t;return}Z=t=e}while(t!==null);rd===0&&(rd=5)}function $d(e,t){do{var n=ml(e.alternate,e);if(n!==null){n.flags&=32767,Z=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){Z=e;return}Z=e=n}while(e!==null);rd=6,Z=null}function ef(e,t,n,r,a,o,s,c,l,u,d,f){e.cancelPendingCommit=null;do lf();while(_d!==0);if(X&6)throw Error(i(327));if(t!==null){if(t===e.current)throw Error(i(177));e===Xu&&(Z=Xu=null,Q=0),yd=t,vd=e,bd=n,Sd=a,Cd=r,tf(e,t,n,s,c,l,f)}}function tf(e,t,n,r,i,a,o){var s=t.lanes|t.childLanes;if(xd=s,s|=gi,dt(e,n,s,r,i,a),Td=null,(n&335544064)===n?(Ed=Oa(e),r=10262):(Ed=null,r=10256),(t.subtreeFlags&r)!==0||(t.flags&r)!==0?(e.callbackNode=null,e.callbackPriority=0,vf(We,function(){return uf(),null})):(e.callbackNode=null,e.callbackPriority=0),Pl=!1,r=!!(t.flags&13878),t.subtreeFlags&13878||r){r=N.T,N.T=null,i=P.p,P.p=2,a=X,X|=4;try{lu(e,t,n)}finally{X=a,P.p=i,N.T=r}}_d=1,Pl?wd=Mp(o,e.containerInfo,Ed,af,of,rf,sf,uf,nf,null,null):(af(),of(),sf())}function nf(e){if(_d!==0){var t=vd.onRecoverableError;t(e,{componentStack:null})}}function rf(){_d===3&&(_d=0,Au(yd,vd),_d=4)}function af(){if(_d===1){_d=0;var e=vd,t=yd,n=bd,r=!!(t.flags&13878);if(t.subtreeFlags&13878||r){r=N.T,N.T=null;var i=P.p;P.p=2;var a=X;X|=4;try{ou=su=!1,Eu(t,e,n),n=cp;var o=Br(e.containerInfo),s=n.focusedElem,c=n.selectionRange;if(o!==s&&s&&s.ownerDocument&&zr(s.ownerDocument.documentElement,s)){if(c!==null&&Vr(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=Rr(s,h),v=Rr(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}gh=!!sp,cp=sp=null}finally{X=a,P.p=i,N.T=r}}e.current=t,_d=2}}function of(){if(_d===2){_d=0;var e=vd,t=yd,n=!!(t.flags&8772);if(t.subtreeFlags&8772||n){n=N.T,N.T=null;var r=P.p;P.p=2;var i=X;X|=4;try{du(e,t.alternate,t)}finally{X=i,P.p=r,N.T=n}}_d=3}}function sf(){if(_d===4||_d===3){_d=0;var e=wd;wd=null,Be();var t=vd,n=yd,r=bd,i=Cd,a=(r&335544064)===r?10262:10256;if((n.subtreeFlags&a)!==0||(n.flags&a)!==0?_d=5:(_d=0,yd=vd=null,cf(t,t.pendingLanes)),a=t.pendingLanes,a===0&&(gd=null),gt(r),n=n.stateNode,Xe&&typeof Xe.onCommitFiberRoot==`function`)try{Xe.onCommitFiberRoot(Ye,n,void 0,(n.current.flags&128)==128)}catch{}if(i!==null){n=N.T,a=P.p,P.p=2,N.T=null;try{for(var o=t.onRecoverableError,s=0;s<i.length;s++){var c=i[s];o(c.value,{componentStack:c.stack})}}finally{N.T=n,P.p=a}}if(i=Td,o=Ed,Ed=null,i!==null&&(Td=null,o===null&&(o=[]),e!==null))for(c=0;c<i.length;c++)n=(0,i[c])(o),n!==void 0&&e.finished.finally(n);bd&3&&lf(),Tf(t),a=t.pendingLanes,r&261930&&a&42?t===Od?Dd++:(Dd=0,Od=t):(Dd=0,Od=null),Ef(0,!1)}}function cf(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Ta(t)))}function lf(){return wd!==null&&(wd.skipTransition(),wd=null),af(),of(),sf(),uf()}function uf(){if(_d!==5)return!1;var e=vd,t=xd;xd=0;var n=gt(bd),r=N.T,a=P.p;try{P.p=32>n?32:n,N.T=null,n=Sd,Sd=null;var o=vd,s=bd;if(_d=0,yd=vd=null,bd=0,X&6)throw Error(i(331));var c=X;if(X|=4,Gu(o.current),Lu(o,o.current,s,n),X=c,Ef(0,!1),Xe&&typeof Xe.onPostCommitFiberRoot==`function`)try{Xe.onPostCommitFiberRoot(Ye,o)}catch{}return!0}finally{P.p=a,N.T=r,cf(e,t)}}function df(e,t,n){t=Pi(n,t),t=Sc(e.stateNode,t,2),e=lo(e,t,2),e!==null&&(ut(e,2),Tf(e))}function ff(e,t,n){if(e.tag===3)df(e,e,n);else for(;t!==null;){if(t.tag===3){df(t,e,n);break}if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(gd===null||!gd.has(r))){e=Pi(n,e),n=Cc(2),r=lo(t,n,2),r!==null&&(wc(n,r,t,e),ut(r,2),Tf(r));break}}t=t.return}}function pf(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Yu;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(td=!0,i.add(n),e=mf.bind(null,e,t,n),t.then(e,e))}function mf(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,Xu===e&&(Q&n)===n&&(rd===4||rd===3&&(Q&62914560)===Q&&300>R()-fd?X&2?od|=n:zd(e,0):od|=n,cd===Q&&(cd=0)),Tf(e)}function hf(e,t){t===0&&(t=ct()),e=yi(e,t),e!==null&&(ut(e,t),Tf(e))}function gf(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),hf(e,n)}function _f(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(i(314))}r!==null&&r.delete(t),hf(e,n)}function vf(e,t){return Le(e,t)}var yf=null,bf=null,xf=!1,Sf=!1,Cf=!1,wf=0;function Tf(e){e!==bf&&e.next===null&&(bf===null?yf=bf=e:bf=bf.next=e),Sf=!0,xf||(xf=!0,Mf())}function Ef(e,t){if(!Cf&&Sf){Cf=!0;do for(var n=!1,r=yf;r!==null;){if(!t){if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-z(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,jf(r,a))}else a=Q,a=it(r,r===Xu?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||at(r,a)||(n=!0,jf(r,a))}r=r.next}while(n);Cf=!1}}function Df(){Of()}function Of(){Sf=xf=!1;var e=0;wf!==0&&hp()&&(e=wf);for(var t=R(),n=null,r=yf;r!==null;){var i=r.next,a=kf(r,t);a===0?(r.next=null,n===null?yf=i:n.next=i,i===null&&(bf=n)):(n=r,(e!==0||a&3)&&(Sf=!0)),r=i}_d!==0&&_d!==5||Ef(e,!1),wf!==0&&(wf=0)}function kf(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-z(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=st(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=Xu,n=Q,n=it(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(Zu===2||Zu===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&Re(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||at(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&Re(r),gt(n)){case 2:case 8:n=Ue;break;case 32:n=We;break;case 268435456:n=Ke;break;default:n=We}return r=Af.bind(null,e),n=Le(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&Re(r),e.callbackPriority=2,e.callbackNode=null,2}function Af(e,t){if(_d!==0&&_d!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(lf()&&e.callbackNode!==n)return null;var r=Q;return r=it(e,e===Xu?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(Nd(e,r,t),kf(e,R()),e.callbackNode!=null&&e.callbackNode===n?Af.bind(null,e):null)}function jf(e,t){if(lf())return null;Nd(e,t,!0)}function Mf(){bp(function(){X&6?Le(He,Df):Of()})}function Nf(){if(wf===0){var e=ja;e===0&&(e=tt,tt<<=1,!(tt&261888)&&(tt=256)),wf=e}return wf}function Pf(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:un(e)}function Ff(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=Pf((i[xt]||null).action),o=r.submitter;o&&(t=(t=o[xt]||null)?Pf(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new Mn(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(wf!==0){var e=new FormData(i,o);Js(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=new FormData(i,o),Js(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var If=0;If<si.length;If++){var Lf=si[If];ci(Lf.toLowerCase(),`on`+(Lf[0].toUpperCase()+Lf.slice(1)))}ci($r,`onAnimationEnd`),ci(ei,`onAnimationIteration`),ci(ti,`onAnimationStart`),ci(`dblclick`,`onDoubleClick`),ci(`focusin`,`onFocus`),ci(`focusout`,`onBlur`),ci(ni,`onTransitionRun`),ci(ri,`onTransitionStart`),ci(ii,`onTransitionCancel`),ci(ai,`onTransitionEnd`),zt(`onMouseEnter`,[`mouseout`,`mouseover`]),zt(`onMouseLeave`,[`mouseout`,`mouseover`]),zt(`onPointerEnter`,[`pointerout`,`pointerover`]),zt(`onPointerLeave`,[`pointerout`,`pointerover`]),Rt(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),Rt(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),Rt(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),Rt(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),Rt(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),Rt(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var Rf=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),zf=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(Rf));function Bf(e,t){t=!!(t&4);for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){pi(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){pi(e)}i.currentTarget=null,a=c}}}}function $(e,t){var n=t[Ct];n===void 0&&(n=t[Ct]=new Set);var r=e+`__bubble`;n.has(r)||(Wf(t,e,2,!1),n.add(r))}function Vf(e,t,n){var r=0;t&&(r|=4),Wf(n,e,r,t)}var Hf=`_reactListening`+Math.random().toString(36).slice(2);function Uf(e){if(!e[Hf]){e[Hf]=!0,It.forEach(function(t){t!==`selectionchange`&&(zf.has(t)||Vf(t,!1,e),Vf(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Hf]||(t[Hf]=!0,Vf(`selectionchange`,!1,t))}}function Wf(e,t,n,r){switch(Ch(t)){case 2:var i=_h;break;case 8:i=vh;break;default:i=yh}n=i.bind(null,t,n,e),i=void 0,!xn||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function Gf(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var c=r.stateNode.containerInfo;if(c===i)break;if(s===4)for(s=r.return;s!==null;){var l=s.tag;if((l===3||l===4)&&s.stateNode.containerInfo===i)return;s=s.return}for(;c!==null;){if(s=At(c),s===null)return;if(l=s.tag,l===5||l===6||l===26||l===27){r=a=s;continue a}c=c.parentNode}}r=r.return}vn(function(){var r=a,i=pn(n),s=[];a:{var c=oi.get(e);if(c!==void 0){var l=Mn,u=e;switch(e){case`keypress`:if(Dn(n)===0)break a;case`keydown`:case`keyup`:l=Xn;break;case`focusin`:u=`focus`,l=Vn;break;case`focusout`:u=`blur`,l=Vn;break;case`beforeblur`:case`afterblur`:l=Vn;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:l=zn;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:l=Bn;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:l=$n;break;case $r:case ei:case ti:l=Hn;break;case ai:l=er;break;case`scroll`:case`scrollend`:l=Pn;break;case`wheel`:l=tr;break;case`copy`:case`cut`:case`paste`:l=Un;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:l=Zn;break;case`submit`:l=Qn;break;case`toggle`:case`beforetoggle`:l=nr}var d=!!(t&4),f=!d&&(e===`scroll`||e===`scrollend`),p=d?c===null?null:c+`Capture`:c;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=yn(m,p),g!=null&&d.push(Kf(m,g,h))),f)break;m=m.return}0<d.length&&(c=new l(c,u,null,n,i),s.push({event:c,listeners:d}))}}if(!(t&7)){a:{if(l=e===`mouseover`||e===`pointerover`,c=e===`mouseout`||e===`pointerout`,l&&n!==fn&&(u=n.relatedTarget||n.fromElement)&&(At(u)||u[St]))break a;(c||l)&&(u=i.window===i?i:(l=i.ownerDocument)?l.defaultView||l.parentWindow:window,c?(l=n.relatedTarget||n.toElement,c=r,l=l?At(l):null,l!==null&&(f=o(l),d=l.tag,l!==f||d!==5&&d!==27&&d!==6)&&(l=null)):(c=null,l=r),c!==l&&(d=zn,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=Zn,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=c==null?u:Mt(c),h=l==null?u:Mt(l),u=new d(g,m+`leave`,c,n,i),u.target=f,u.relatedTarget=h,g=null,At(i)===r&&(d=new d(p,m+`enter`,l,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,d=c&&l?ee(c,l,Jf):null,c!==null&&Yf(s,u,c,d,!1),l!==null&&f!==null&&Yf(s,f,l,d,!0)))}a:{if(c=r?Mt(r):window,l=c.nodeName&&c.nodeName.toLowerCase(),l===`select`||l===`input`&&c.type===`file`)var _=Sr;else if(gr(c)){if(Cr)_=Mr;else{_=Ar;var v=kr}}else l=c.nodeName,!l||l.toLowerCase()!==`input`||c.type!==`checkbox`&&c.type!==`radio`?r&&K(r.elementType)&&(_=Sr):_=jr;if(_&&=_(e,r)){_r(s,_,n,i);break a}v&&v(e,c,r)}switch(v=r?Mt(r):window,e){case`focusin`:(gr(v)||v.contentEditable===`true`)&&(Ur=v,Wr=r,Gr=null);break;case`focusout`:Gr=Wr=Ur=null;break;case`mousedown`:Kr=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:Kr=!1,qr(s,n,i);break;case`selectionchange`:if(Hr)break;case`keydown`:case`keyup`:qr(s,n,i)}var y;if(ir)b:{switch(e){case`compositionstart`:var b=`onCompositionStart`;break b;case`compositionend`:b=`onCompositionEnd`;break b;case`compositionupdate`:b=`onCompositionUpdate`;break b}b=void 0}else fr?ur(e,n)&&(b=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(b=`onCompositionStart`);b&&(sr&&n.locale!==`ko`&&(fr||b!==`onCompositionStart`?b===`onCompositionEnd`&&fr&&(y=En()):(Cn=i,wn=`value`in Cn?Cn.value:Cn.textContent,fr=!0)),v=qf(r,b),0<v.length&&(b=new Wn(b,e,null,n,i),s.push({event:b,listeners:v}),y?b.data=y:(y=dr(n),y!==null&&(b.data=y)))),(y=or?pr(e,n):mr(e,n))&&(b=qf(r,`onBeforeInput`),0<b.length&&(v=new Wn(`onBeforeInput`,`beforeinput`,null,n,i),s.push({event:v,listeners:b}),v.data=y)),Ff(s,e,r,n,i)}Bf(s,t)})}function Kf(e,t,n){return{instance:e,listener:t,currentTarget:n}}function qf(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=yn(e,n),i!=null&&r.unshift(Kf(e,i,a)),i=yn(e,t),i!=null&&r.push(Kf(e,i,a))),e.tag===3)return r;e=e.return}return[]}function Jf(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Yf(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=yn(n,a),l!=null&&o.unshift(Kf(n,l,c))):i||(l=yn(n,a),l!=null&&o.push(Kf(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var Xf=/\r\n?/g,Zf=/\u0000|\uFFFD/g;function Qf(e){return(typeof e==`string`?e:``+e).replace(Xf,`
`).replace(Zf,``)}function $f(e,t){return t=Qf(t),Qf(e)===t}function ep(e,t,n,r,a,o){switch(n){case`children`:if(typeof r==`string`)t===`body`||t===`textarea`&&r===``||rn(e,r);else if(typeof r==`number`||typeof r==`bigint`)t!==`body`&&rn(e,``+r);else return;break;case`className`:Gt(e,`class`,r);break;case`tabIndex`:Gt(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:Gt(e,n,r);break;case`style`:sn(e,r,o);return;case`data`:if(t!==`object`){Gt(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)||r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=un(r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}if(typeof o==`function`&&(n===`formAction`?(t!==`input`&&ep(e,t,`name`,a.name,a,null),ep(e,t,`formEncType`,a.formEncType,a,null),ep(e,t,`formMethod`,a.formMethod,a,null),ep(e,t,`formTarget`,a.formTarget,a,null)):(ep(e,t,`encType`,a.encType,a,null),ep(e,t,`method`,a.method,a,null),ep(e,t,`target`,a.target,a,null))),r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=un(r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=dn);return;case`onScroll`:r!=null&&$(`scroll`,e);return;case`onScrollEnd`:r!=null&&$(`scrollend`,e);return;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));o?.__html!==n&&(e.innerHTML=n)}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=un(r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`credentialless`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:$(`beforetoggle`,e),$(`toggle`,e),H(e,`popover`,r);break;case`xlinkActuate`:Kt(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:Kt(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:Kt(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:Kt(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:Kt(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:Kt(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:Kt(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:Kt(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:Kt(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:H(e,`is`,r);break;case`innerText`:case`textContent`:return;default:if(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)n=cn.get(n)||n,H(e,n,r);else return}V=!0}function tp(e,t,n,r,a,o){switch(n){case`style`:sn(e,r,o);return;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));o?.__html!==n&&(e.innerHTML=n)}}break;case`children`:if(typeof r==`string`)rn(e,r);else if(typeof r==`number`||typeof r==`bigint`)rn(e,``+r);else return;break;case`onScroll`:r!=null&&$(`scroll`,e);return;case`onScrollEnd`:r!=null&&$(`scrollend`,e);return;case`onClick`:r!=null&&(e.onclick=dn);return;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:return;case`innerText`:case`textContent`:return;default:if(!Lt.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(a=n.endsWith(`Capture`),o=n.slice(2,a?n.length-7:void 0),t=e[xt]||null,t=t==null?null:t[n],typeof t==`function`&&e.removeEventListener(o,t,a),typeof r==`function`)){typeof t!=`function`&&t!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(o,r,a);break a}V=!0,n in e?e[n]=r:!0===r?e.setAttribute(n,``):H(e,n,r)}return}V=!0}function np(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:$(`error`,e),$(`load`,e);var r=!1,a=!1,o;for(o in n)if(n.hasOwnProperty(o)){var s=n[o];if(s!=null)switch(o){case`src`:r=!0;break;case`srcSet`:a=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:ep(e,t,o,s,n,null)}}a&&ep(e,t,`srcSet`,n.srcSet,n,null),r&&ep(e,t,`src`,n.src,n,null);return;case`input`:$(`invalid`,e);var c=o=s=a=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:a=d;break;case`type`:s=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:o=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(i(137,t));break;default:ep(e,t,r,d,n,null)}}Qt(e,o,c,l,u,s,a,!1);return;case`select`:for(a in $(`invalid`,e),r=s=o=null,n)if(n.hasOwnProperty(a)&&(c=n[a],c!=null))switch(a){case`value`:o=c;break;case`defaultValue`:s=c;break;case`multiple`:r=c;default:ep(e,t,a,c,n,null)}t=o,n=s,e.multiple=!!r,t==null?n!=null&&en(e,!!r,n,!0):en(e,!!r,t,!1);return;case`textarea`:for(s in $(`invalid`,e),o=a=r=null,n)if(n.hasOwnProperty(s)&&(c=n[s],c!=null))switch(s){case`value`:r=c;break;case`defaultValue`:a=c;break;case`children`:o=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(i(91));break;default:ep(e,t,s,c,n,null)}nn(e,r,a,o);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:ep(e,t,l,r,n,null)}return;case`dialog`:$(`beforetoggle`,e),$(`toggle`,e),$(`cancel`,e),$(`close`,e);break;case`iframe`:case`object`:$(`load`,e);break;case`video`:case`audio`:for(r=0;r<Rf.length;r++)$(Rf[r],e);break;case`image`:$(`error`,e),$(`load`,e);break;case`details`:$(`toggle`,e);break;case`embed`:case`source`:case`link`:$(`error`,e),$(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:ep(e,t,u,r,n,null)}return;default:if(K(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&tp(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&ep(e,t,c,r,n,null))}var rp={};function ip(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var a=null,o=null,s=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||ep(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:m!==f&&(V=!0),o=m;break;case`name`:m!==f&&(V=!0),a=m;break;case`checked`:m!==f&&(V=!0),u=m;break;case`defaultChecked`:m!==f&&(V=!0),d=m;break;case`value`:m!==f&&(V=!0),s=m;break;case`defaultValue`:m!==f&&(V=!0),c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(i(137,t));break;default:m!==f&&ep(e,t,p,m,r,f)}}Zt(e,s,c,l,u,d,o,a);return;case`select`:for(o in m=s=c=p=null,n)if(l=n[o],n.hasOwnProperty(o)&&l!=null)switch(o){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(o)||ep(e,t,o,null,r,l)}for(a in r)if(o=r[a],l=n[a],r.hasOwnProperty(a)&&(o!=null||l!=null))switch(a){case`value`:o!==l&&(V=!0),p=o;break;case`defaultValue`:o!==l&&(V=!0),c=o;break;case`multiple`:o!==l&&(V=!0),s=o;default:o!==l&&ep(e,t,a,o,r,l)}t=c,n=s,r=m,p==null?!!r!=!!n&&(t==null?en(e,!!n,n?[]:``,!1):en(e,!!n,t,!0)):en(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(a=n[c],n.hasOwnProperty(c)&&a!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:ep(e,t,c,null,r,a)}for(s in r)if(a=r[s],o=n[s],r.hasOwnProperty(s)&&(a!=null||o!=null))switch(s){case`value`:a!==o&&(V=!0),p=a;break;case`defaultValue`:a!==o&&(V=!0),m=a;break;case`children`:break;case`dangerouslySetInnerHTML`:if(a!=null)throw Error(i(91));break;default:a!==o&&ep(e,t,s,a,r,o)}tn(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:ep(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:p!==m&&(V=!0),e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:ep(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&ep(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(i(137,t));break;default:ep(e,t,u,p,r,m)}return;default:if(K(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&tp(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||tp(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&ep(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||ep(e,t,f,p,r,m)}function ap(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function op(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&ap(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&ap(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var sp=null,cp=null;function lp(e){return e.nodeType===9?e:e.ownerDocument}function up(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function dp(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function fp(e,t,n,r){return n=lp(n).createElement(e),n[bt]=r,n[xt]=t,np(n,e,t),Pt(n),n}function pp(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var mp=null;function hp(){var e=window.event;return e&&e.type===`popstate`?e!==mp&&(mp=e,!0):(mp=null,!1)}var gp=typeof setTimeout==`function`?setTimeout:void 0,_p=typeof clearTimeout==`function`?clearTimeout:void 0,vp=typeof Promise==`function`?Promise:void 0,yp=typeof requestAnimationFrame==`function`?requestAnimationFrame:gp,bp=typeof queueMicrotask==`function`?queueMicrotask:vp===void 0?gp:function(e){return vp.resolve(null).then(e).catch(xp)};function xp(e){setTimeout(function(){throw e})}function Sp(e){return e===`head`}function Cp(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8){if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Hh(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)_m(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,_m(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[Dt]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&_m(e.ownerDocument.body)}n=i}while(n);Hh(t)}function wp(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8){if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++}n=r}while(n)}function Tp(e,t,n){if(t=CSS.escape(t)===t?t:`r-`+btoa(t).replace(/=/g,``),e.style.viewTransitionName=t,n!=null&&(e.style.viewTransitionClass=n),n=getComputedStyle(e),n.display===`inline`){if(t=e.getClientRects(),t.length===1)var r=1;else for(var i=r=0;i<t.length;i++){var a=t[i];0<a.width&&0<a.height&&r++}r===1&&(e=e.style,e.display=t.length===1?`inline-block`:`block`,e.marginTop=`-`+n.paddingTop,e.marginBottom=`-`+n.paddingBottom)}}function Ep(e,t){e=e.style,t=t.style;var n=t==null?null:t.hasOwnProperty(`viewTransitionName`)?t.viewTransitionName:t.hasOwnProperty(`view-transition-name`)?t[`view-transition-name`]:null;e.viewTransitionName=n==null||typeof n==`boolean`?``:(``+n).trim(),n=t==null?null:t.hasOwnProperty(`viewTransitionClass`)?t.viewTransitionClass:t.hasOwnProperty(`view-transition-class`)?t[`view-transition-class`]:null,e.viewTransitionClass=n==null||typeof n==`boolean`?``:(``+n).trim(),e.display===`inline-block`&&(t==null?e.display=e.margin=``:(n=t.display,e.display=n==null||typeof n==`boolean`?``:n,n=t.margin,n==null?(n=t.hasOwnProperty(`marginTop`)?t.marginTop:t[`margin-top`],e.marginTop=n==null||typeof n==`boolean`?``:n,t=t.hasOwnProperty(`marginBottom`)?t.marginBottom:t[`margin-bottom`],e.marginBottom=t==null||typeof t==`boolean`?``:t):e.margin=n))}function Dp(e,t,n){return n=n.ownerDocument.defaultView,{rect:e,abs:t.position===`absolute`||t.position===`fixed`,clip:t.clipPath!==`none`||t.overflow!==`visible`||t.filter!==`none`||t.mask!==`none`||t.mask!==`none`||t.borderRadius!==`0px`,view:0<=e.bottom&&0<=e.right&&e.top<=n.innerHeight&&e.left<=n.innerWidth}}function Op(e){return Dp(e.getBoundingClientRect(),getComputedStyle(e),e)}function kp(e){var t=e.getBoundingClientRect();t=new DOMRect(t.x+2e4,t.y+2e4,t.width,t.height);var n=getComputedStyle(e);return Dp(t,n,e)}function Ap(e){return e.documentElement.clientHeight}function jp(e){this.addEventListener(`load`,e),this.addEventListener(`error`,e)}function Mp(e,t,n,r,i,a,o,s,c){var l=t.nodeType===9?t:t.ownerDocument;try{var u=l.startViewTransition({update:function(){var t=l.defaultView,n=t.navigation&&t.navigation.transition,o=l.fonts.status;r();var s=[];if(o===`loaded`&&(Ap(l),l.fonts.status===`loading`&&s.push(l.fonts.ready)),o=s.length,e!==null)for(var c=e.suspenseyImages,u=0,d=0;d<c.length;d++){var f=c[d];if(!f.complete){var p=f.getBoundingClientRect();if(0<p.bottom&&0<p.right&&p.top<t.innerHeight&&p.left<t.innerWidth){if(u+=Xm(f),u>$m){s.length=o;break}f=new Promise(jp.bind(f)),s.push(f)}}}if(0<s.length)return t=Promise.race([Promise.all(s),new Promise(function(e){return setTimeout(e,500)})]).then(i,i),(n?Promise.allSettled([n.finished,t]):t).then(a,a);if(i(),n)return n.finished.then(a,a);a()},types:n});l.__reactViewTransition=u;var d=[];return u.ready.then(function(){for(var e=l.documentElement.getAnimations({subtree:!0}),t=0;t<e.length;t++){var n=e[t],r=n.effect,i=r.pseudoElement;if(i!=null&&i.startsWith(`::view-transition`)){d.push(n),n=r.getKeyframes();for(var a=i=void 0,s=!0,c=0;c<n.length;c++){var u=n[c],f=u.width;if(i===void 0)i=f;else if(i!==f){s=!1;break}if(f=u.height,a===void 0)a=f;else if(a!==f){s=!1;break}delete u.width,delete u.height,u.transform===`none`&&delete u.transform}s&&i!==void 0&&a!==void 0&&(r.setKeyframes(n),s=getComputedStyle(r.target,r.pseudoElement),s.width!==i||s.height!==a)&&(s=n[0],s.width=i,s.height=a,s=n[n.length-1],s.width=i,s.height=a,r.setKeyframes(n))}}o()},function(e){l.__reactViewTransition===u&&(l.__reactViewTransition=null);try{if(typeof e==`object`&&e)switch(e.name){case`InvalidStateError`:(e.message===`View transition was skipped because document visibility state is hidden.`||e.message===`Skipping view transition because document visibility state has become hidden.`||e.message===`Skipping view transition because viewport size changed.`||e.message===`Transition was aborted because of invalid state`)&&(e=null)}e!==null&&c(e)}finally{r(),i(),o()}}),u.finished.finally(function(){for(var e=0;e<d.length;e++)d[e].cancel();l.__reactViewTransition===u&&(l.__reactViewTransition=null),s()}),u}catch{return r(),i(),o(),null}}function Np(e,t){this._scope=document.documentElement,this._selector=`::view-transition-`+e+`(`+t+`)`}Np.prototype.animate=function(e,t){return t=typeof t==`number`?{duration:t}:E({},t),t.pseudoElement=this._selector,this._scope.animate(e,t)},Np.prototype.getAnimations=function(){for(var e=this._scope,t=this._selector,n=e.getAnimations({subtree:!0}),r=[],i=0;i<n.length;i++){var a=n[i].effect;a!==null&&a.target===e&&a.pseudoElement===t&&r.push(n[i])}return r},Np.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function Pp(e){return{name:e,group:new Np(`group`,e),imagePair:new Np(`image-pair`,e),old:new Np(`old`,e),new:new Np(`new`,e)}}function Fp(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}Fp.prototype.addEventListener=function(e,t,n){var r=null,i=null;if(!(n!=null&&typeof n!=`boolean`&&(r=n.signal||null,r!==null&&r.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var a=this._eventListeners;if(Bp(a,e,t,n)===-1){var o=this,s=t;n!=null&&typeof n!=`boolean`&&!0===n.once&&(s=function(r){o.removeEventListener(e,t,n),typeof t==`function`?t.call(this,r):t.handleEvent(r)}),r!==null&&(i=o.removeEventListener.bind(o,e,t,n),r.addEventListener(`abort`,i,{once:!0}),i=r.removeEventListener.bind(r,`abort`,i)),r=Rp(n),a.push({type:e,listener:t,optionsOrUseCapture:n,attachedListener:s,cleanup:i}),h(this._fragmentFiber.child,!1,Ip,e,s,r)}this._eventListeners=a}};function Ip(e,t,n,r){return b(e).addEventListener(t,n,r),!1}Fp.prototype.removeEventListener=function(e,t,n){var r=this._eventListeners;if(r!==null&&(t=Bp(r,e,t,n),t!==-1)){var i=r[t];n=i.attachedListener;var a=i.cleanup;i=Rp(i.optionsOrUseCapture),h(this._fragmentFiber.child,!1,Lp,e,n,i),r.splice(t,1),a!==null&&a()}};function Lp(e,t,n,r){return b(e).removeEventListener(t,n,r),!1}function Rp(e){return e!=null&&typeof e!=`boolean`&&(!0===e.once||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function zp(e){return e==null?`c=0`:typeof e==`boolean`?`c=`+(e?`1`:`0`):`c=`+(e.capture?`1`:`0`)}function Bp(e,t,n,r){if(e.length===0)return-1;r=zp(r);for(var i=0;i<e.length;i++){var a=e[i];if(a.type===t&&a.listener===n&&zp(a.optionsOrUseCapture)===r)return i}return-1}Fp.prototype.dispatchEvent=function(e){var t=g(this._fragmentFiber);if(t===null)return!0;t=b(t);var n=this._eventListeners;if(n!==null&&0<n.length||!e.bubbles){var r=t.nodeType===9?t.createComment(``):document.createTextNode(``);if(n)for(var i=0;i<n.length;i++){var a=n[i];r.addEventListener(a.type,a.attachedListener,Rp(a.optionsOrUseCapture))}if(t.appendChild(r),e=r.dispatchEvent(e),n)for(i=0;i<n.length;i++)a=n[i],r.removeEventListener(a.type,a.attachedListener,Rp(a.optionsOrUseCapture));return t.removeChild(r),e}return t.dispatchEvent(e)},Fp.prototype.focus=function(e){h(this._fragmentFiber.child,!0,Vp,e,void 0,void 0)};function Vp(e,t){return e.tag!==6&&(e=b(e),pm(e,t))}Fp.prototype.focusLast=function(e){var t=[];h(this._fragmentFiber.child,!0,Hp,t,void 0,void 0);for(var n=t.length-1;0<=n&&!Vp(t[n],e);n--);};function Hp(e,t){return t.push(e),!1}Fp.prototype.blur=function(){var e=g(this._fragmentFiber);e!==null&&(e=b(e),e=lp(e).activeElement,e!==null&&h(this._fragmentFiber.child,!1,Up,e,void 0,void 0))};function Up(e,t){return e.tag!==6&&(e=b(e),e===t||e.contains(t)?(t.blur(),!0):!1)}Fp.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),h(this._fragmentFiber.child,!1,Wp,e,void 0,void 0)};function Wp(e,t){return e.tag===6||(e=b(e),t.observe(e)),!1}Fp.prototype.unobserveUsing=function(e){var t=this._observers;if(t!==null&&t.has(e)){t.delete(e),h(this._fragmentFiber.child,!1,Gp,e,void 0,void 0);for(var n=t=0;n<Kp.length;n++){var r=Kp[n];r.fragmentInstance===this&&r.observer===e?e.unobserve(r.instance):Kp[t++]=r}Kp.length=t}};function Gp(e,t){return e.tag===6||(e=b(e),t.unobserve(e)),!1}var Kp=[],qp=!1;function Jp(e,t,n){Kp.push({fragmentInstance:e,observer:t,instance:n}),qp||(qp=!0,mm(function(){qp=!1;var e=Kp;Kp=[];for(var t=0;t<e.length;t++){var n=e[t];n.observer.unobserve(n.instance)}}))}Fp.prototype.getClientRects=function(){var e=[];return h(this._fragmentFiber.child,!1,Yp,e,void 0,void 0),e};function Yp(e,t){if(e.tag===6){e=e.stateNode;var n=e.ownerDocument.createRange();n.selectNodeContents(e),t.push.apply(t,n.getClientRects())}else e=b(e),t.push.apply(t,e.getClientRects());return!1}Fp.prototype.getRootNode=function(e){var t=g(this._fragmentFiber);return t===null?this:b(t).getRootNode(e)},Fp.prototype.compareDocumentPosition=function(e){var t=g(this._fragmentFiber);if(t===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var n=[];h(this._fragmentFiber.child,!1,Hp,n,void 0,void 0);var r=b(t);if(n.length===0){if(n=r,_(this._fragmentFiber)){a:{for(t=this._fragmentFiber.return;t!==null;){if(t.tag===4){t=t.stateNode.containerInfo;break a}if(t.tag===3||t.tag===5||t.tag===27)break;t=t.return}t=null}t!=null&&(n=t)}t=this._fragmentFiber;var i=r=n.compareDocumentPosition(e);return n===e?i=Node.DOCUMENT_POSITION_CONTAINS:r&Node.DOCUMENT_POSITION_CONTAINED_BY&&(n=v(t)[1],n===null?i=Node.DOCUMENT_POSITION_PRECEDING:(e=b(n).compareDocumentPosition(e),i=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),i|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}t=b(n[0]),i=b(n[n.length-1]);var a=_(this._fragmentFiber)?t.parentElement:r;if(a==null)return Node.DOCUMENT_POSITION_DISCONNECTED;r=a.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_CONTAINED_BY,a=a.compareDocumentPosition(i)&Node.DOCUMENT_POSITION_CONTAINED_BY;var o=t.compareDocumentPosition(e),s=i.compareDocumentPosition(e),c=o&Node.DOCUMENT_POSITION_CONTAINED_BY||s&Node.DOCUMENT_POSITION_CONTAINED_BY;return s=r&&a&&o&Node.DOCUMENT_POSITION_FOLLOWING&&s&Node.DOCUMENT_POSITION_PRECEDING,t=r&&t===e||a&&i===e||c||s?Node.DOCUMENT_POSITION_CONTAINED_BY:!r&&t===e||!a&&i===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:o,t&Node.DOCUMENT_POSITION_DISCONNECTED||t&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||Xp(t,this._fragmentFiber,n[0],n[n.length-1],e)?t:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function Xp(e,t,n,r,i){var a=At(i);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(n=!!a)a:{for(;a!==null;){if(a.tag===7&&(a===t||a.alternate===t)){n=!0;break a}a=a.return}n=!1}return n}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(a===null)return a=i.ownerDocument,i===a||i===a.documentElement||i===a.body;a:{for(a=t,t=g(t);a!==null;){if(!(a.tag!==5&&a.tag!==3&&a.tag!==27||a!==t&&a.alternate!==t)){a=!0;break a}a=a.return}a=!1}return a}return e&Node.DOCUMENT_POSITION_PRECEDING?((t=!!a)&&!(t=a===n)&&(t=ee(n,a,T),t===null?t=!1:(h(t,!0,C,a,n),a=x,x=null,t=a!==null)),t):e&Node.DOCUMENT_POSITION_FOLLOWING?((t=!!a)&&!(t=a===r)&&(t=ee(r,a,T),t===null?t=!1:(h(t,!0,w,a,r),a=x,S=x=null,t=a!==null)),t):!1}function Zp(e,t){var n=e.ownerDocument.createRange();n.selectNodeContents(e),e=n.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,t?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}Fp.prototype.scrollIntoView=function(e){if(typeof e==`object`)throw Error(i(566));var t=[];h(this._fragmentFiber.child,!1,Hp,t,void 0,void 0);var n=!1!==e;if(t.length===0){var r=v(this._fragmentFiber);if(r=n?r[1]||r[0]||g(this._fragmentFiber):r[0]||r[1],r===null)return;if(r.tag===6){e=b(r),Zp(e,n);return}if(r=b(r),r.nodeType!==9){if(r.nodeType===11){n=`host`in r?r.host:null,n!==null&&n.scrollIntoView(e);return}r.scrollIntoView(e)}}for(r=n?t.length-1:0;r!==(n?-1:t.length);){var a=t[r];a.tag===6?(a=b(a),Zp(a,n)):b(a).scrollIntoView(e),r+=n?-1:1}};function Qp(e,t){return e=b(e),$p(e,t),!1}function $p(e,t){e.reactFragments??=new Set,e.reactFragments.add(t)}function em(e,t){var n=t._eventListeners;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];e.addEventListener(i.type,i.attachedListener,Rp(i.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(n){for(var r=0,i=0;i<Kp.length;i++){var a=Kp[i];(a.fragmentInstance!==t||a.observer!==n||a.instance!==e)&&(Kp[r++]=a)}Kp.length=r,n.observe(e)}),$p(e,t))}function tm(e,t){var n=t._eventListeners;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];e.removeEventListener(i.type,i.attachedListener,Rp(i.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(n){typeof n.rootMargin==`string`?Jp(t,n,e):n.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(t))}function nm(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:nm(n),kt(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function rm(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r){if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e}else if(!e[Dt])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=lm(e.nextSibling),e===null)break}return null}function im(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=lm(e.nextSibling),e===null))return null;return e}function am(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=lm(e.nextSibling),e===null))return null;return e}function om(e){return e.data===`$?`||e.data===`$~`}function sm(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function cm(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function lm(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var um=null;function dm(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return lm(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function fm(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function pm(e,t){function n(){r=!0}if(e.ownerDocument.activeElement===e)return!0;var r=!1;try{e.ownerDocument.addEventListener(`focus`,n,!0),(e.focus||HTMLElement.prototype.focus).call(e,t)}finally{e.ownerDocument.removeEventListener(`focus`,n,!0)}return r}function mm(e){yp(function(){yp(function(t){return e(t)})})}function hm(e,t,n){switch(t=lp(n),e){case`html`:if(e=t.documentElement,!e)throw Error(i(452));return e;case`head`:if(e=t.head,!e)throw Error(i(453));return e;case`body`:if(e=t.body,!e)throw Error(i(454));return e;default:throw Error(i(451))}}function gm(e,t,n){for(var r in n){var i=n[r];n.hasOwnProperty(r)&&i!=null&&ep(e,t,r,null,rp,i)}n.dangerouslySetInnerHTML!=null&&(e.textContent=``),e.onclick===dn&&(e.onclick=null),kt(e)}function _m(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);kt(e)}var vm=new Map,ym=new Set;function bm(e){if(typeof e.getRootNode==`function`){var t=e.getRootNode();if(t.nodeType===9||t.nodeType===11)return t}return e.nodeType===9?e:e.ownerDocument}var xm=P.d;P.d={f:Sm,r:Cm,D:Em,C:Dm,L:Om,m:km,X:jm,S:Am,M:Mm};function Sm(){var e=xm.f(),t=Ld();return e||t}function Cm(e){var t=jt(e);t!==null&&t.tag===5&&t.type===`form`?Xs(t):xm.r(e)}var wm=typeof document>`u`?null:document;function Tm(e,t,n){var r=wm;if(r&&typeof t==`string`&&t){var i=Xt(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),ym.has(i)||(ym.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),np(t,`link`,e),Pt(t),r.head.appendChild(t)))}}function Em(e){xm.D(e),Tm(`dns-prefetch`,e,null)}function Dm(e,t){xm.C(e,t),Tm(`preconnect`,e,t)}function Om(e,t,n){xm.L(e,t,n);var r=wm;if(r&&e&&t){var i=`link[rel="preload"][as="`+Xt(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+Xt(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+Xt(n.imageSizes)+`"]`)):i+=`[href="`+Xt(e)+`"]`;var a=i;switch(t){case`style`:a=Pm(e);break;case`script`:a=Rm(e)}if(!(vm.has(a)||(e=E({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),vm.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(Fm(a))||t===`script`&&r.querySelector(zm(a))))){var o=r.createElement(`link`);np(o,`link`,e),t===`style`&&(o[Ot]=!0,o.onload=o.onerror=function(){Ft(o)}),Pt(o),r.head.appendChild(o)}}}function km(e,t){xm.m(e,t);var n=wm;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+Xt(r)+`"][href="`+Xt(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Rm(e)}if(!vm.has(a)&&(e=E({rel:`modulepreload`,href:e},t),vm.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(zm(a)))return}r=n.createElement(`link`),np(r,`link`,e),Pt(r),n.head.appendChild(r)}}}function Am(e,t,n){xm.S(e,t,n);var r=wm;if(r&&e){var i=Nt(r).hoistableStyles,a=Pm(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(Fm(a)))s.loading=5;else{e=E({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=vm.get(a))&&Hm(e,n);var c=o=r.createElement(`link`);Pt(c),np(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Vm(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function jm(e,t){xm.X(e,t);var n=wm;if(n&&e){var r=Nt(n).hoistableScripts,i=Rm(e),a=r.get(i);a||(a=n.querySelector(zm(i)),a||(e=E({src:e,async:!0},t),(t=vm.get(i))&&Um(e,t),a=n.createElement(`script`),Pt(a),np(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Mm(e,t){xm.M(e,t);var n=wm;if(n&&e){var r=Nt(n).hoistableScripts,i=Rm(e),a=r.get(i);a||(a=n.querySelector(zm(i)),a||(e=E({src:e,async:!0,type:`module`},t),(t=vm.get(i))&&Um(e,t),a=n.createElement(`script`),Pt(a),np(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Nm(e,t,n,r){var a=(a=we.current)?bm(a):null;if(!a)throw Error(i(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(n=Pm(n.href),t=Nt(a).hoistableStyles,r=t.get(n),r||(r={type:`style`,instance:null,count:0,state:null},t.set(n,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=Pm(n.href);var o=Nt(a).hoistableStyles,s=o.get(e);if(s||(a=a.ownerDocument||a,s={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},o.set(e,s),(o=a.querySelector(Fm(e)))?o._p||(s.instance=o,s.state.loading=5):(o=vm.get(e),o||(o={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},vm.set(e,o)),Lm(a,e,o,s.state))),t&&r===null)throw Error(i(528,``));return s}if(t&&r!==null)throw Error(i(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(n=Rm(n),t=Nt(a).hoistableScripts,r=t.get(n),r||(r={type:`script`,instance:null,count:0,state:null},t.set(n,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(i(444,e))}}function Pm(e){return`href="`+Xt(e)+`"`}function Fm(e){return`link[rel="stylesheet"][`+e+`]`}function Im(e){return E({},e,{"data-precedence":e.precedence,precedence:null})}function Lm(e,t,n,r){if(t=e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)){if(!0!==t[Ot]){r.loading=1;return}}else t=e.createElement(`link`),t[Ot]=!0,t.onload=t.onerror=Ft.bind(null,t),np(t,`link`,n),Pt(t),e.head.appendChild(t);r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2})}function Rm(e){return`[src="`+Xt(e)+`"]`}function zm(e){return`script[async]`+e}function Bm(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+Xt(n.href)+`"]`);if(r)return t.instance=r,Pt(r),r;var a=E({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),Pt(r),np(r,`style`,a),Vm(r,n.precedence,e),t.instance=r;case`stylesheet`:a=Pm(n.href);var o=e.querySelector(Fm(a));if(o)return t.state.loading|=4,t.instance=o,Pt(o),o;r=Im(n),(a=vm.get(a))&&Hm(r,a),o=(e.ownerDocument||e).createElement(`link`),Pt(o);var s=o;return s._p=new Promise(function(e,t){s.onload=e,s.onerror=t}),np(o,`link`,r),t.state.loading|=4,Vm(o,n.precedence,e),t.instance=o;case`script`:return o=Rm(n.src),(a=e.querySelector(zm(o)))?(t.instance=a,Pt(a),a):(r=n,(a=vm.get(o))&&(r=E({},n),Um(r,a)),e=e.ownerDocument||e,a=e.createElement(`script`),Pt(a),np(a,`link`,r),e.head.appendChild(a),t.instance=a);case`void`:return null;default:throw Error(i(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Vm(r,n.precedence,e));return t.instance}function Vm(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Hm(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function Um(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Wm=null;function Gm(e,t,n){if(Wm===null){var r=new Map,i=Wm=new Map;i.set(n,r)}else i=Wm,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[Dt]||a[bt]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Km(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function qm(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Jm(e,t){return e===`img`&&t.src!=null&&t.src!==``&&t.onLoad==null&&t.loading!==`lazy`}function Ym(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Xm(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio==`number`?devicePixelRatio:1)*.25}function Zm(e,t){typeof t.decode==`function`&&(e.imgCount++,t.complete||(e.imgBytes+=Xm(t),e.suspenseyImages.push(t)),e=rh.bind(e),t.decode().then(e,e))}function Qm(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=Pm(r.href),a=t.querySelector(Fm(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=nh.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,Pt(a);return}a=t.ownerDocument||t,r=Im(r),(i=vm.get(i))&&Hm(r,i),a=a.createElement(`link`),Pt(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),np(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=nh.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var $m=0;function eh(e,t){return e.stylesheets&&e.count===0&&ah(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&ah(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&$m===0&&($m=62500*op());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&ah(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>$m?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function th(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)ah(e,e.stylesheets);else if(e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}}}function nh(){this.count--,th(this)}function rh(){this.imgCount--,th(this)}var ih=null;function ah(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,ih=new Map,t.forEach(oh,e),ih=null,nh.call(e))}function oh(e,t){if(!(t.state.loading&4)){var n=ih.get(e);if(n)var r=n.get(null);else{n=new Map,ih.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=nh.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var sh={$$typeof:k,Provider:null,Consumer:null,_currentValue:ve,_currentValue2:ve,_threadCount:0};function ch(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=lt(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=lt(0),this.hiddenUpdates=lt(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.transitionTypes=null,this.incompleteTransitions=new Map}function lh(e,t,n,r,i,a,o,s,c,l,u,d){return e=new ch(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=wi(3,null,null,t),e.current=a,a.stateNode=e,t=wa(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},oo(a),e}function uh(e){return e?(e=Si,e):Si}function dh(e,t,n,r,i,a){i=uh(i),r.context===null?r.context=i:r.pendingContext=i,r=co(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=lo(e,r,t),n!==null&&(Md(n,e,t),uo(n,e,t))}function fh(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ph(e,t){fh(e,t),(e=e.alternate)&&fh(e,t)}function mh(e){if(e.tag===13||e.tag===31){var t=yi(e,67108864);t!==null&&Md(t,e,67108864),ph(e,67108864)}}function hh(e){if(e.tag===13||e.tag===31){var t=kd();t=ht(t);var n=yi(e,t);n!==null&&Md(n,e,t),ph(e,t)}}var gh=!0;function _h(e,t,n,r){var i=N.T;N.T=null;var a=P.p;try{P.p=2,yh(e,t,n,r)}finally{P.p=a,N.T=i}}function vh(e,t,n,r){var i=N.T;N.T=null;var a=P.p;try{P.p=8,yh(e,t,n,r)}finally{P.p=a,N.T=i}}function yh(e,t,n,r){if(gh){var i=bh(r);if(i===null)Gf(e,t,r,xh,n),Mh(e,r);else if(Ph(i,e,t,n,r))r.stopPropagation();else if(Mh(e,r),t&4&&-1<jh.indexOf(e)){for(;i!==null;){var a=jt(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=rt(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-z(o);s.entanglements[1]|=c,o&=~c}Tf(a),!(X&6)&&(md=R()+500,Ef(0,!1))}}break;case 31:case 13:s=yi(a,2),s!==null&&Md(s,a,2),Ld(),ph(a,2)}if(a=bh(r),a===null&&Gf(e,t,r,xh,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else Gf(e,t,r,null,n)}}function bh(e){return e=pn(e),Sh(e)}var xh=null;function Sh(e){if(xh=null,e=At(e),e!==null){var t=o(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=s(t),e!==null)return e;e=null}else if(n===31){if(e=c(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return xh=e,null}function Ch(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`fullscreenerror`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`resize`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(Ve()){case He:return 2;case Ue:return 8;case We:case Ge:return 32;case Ke:return 268435456;default:return 32}default:return 32}}var wh=!1,Th=null,Eh=null,Dh=null,Oh=new Map,kh=new Map,Ah=[],jh=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function Mh(e,t){switch(e){case`focusin`:case`focusout`:Th=null;break;case`dragenter`:case`dragleave`:Eh=null;break;case`mouseover`:case`mouseout`:Dh=null;break;case`pointerover`:case`pointerout`:Oh.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:kh.delete(t.pointerId)}}function Nh(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=jt(t),t!==null&&mh(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Ph(e,t,n,r,i){switch(t){case`focusin`:return Th=Nh(Th,e,t,n,r,i),!0;case`dragenter`:return Eh=Nh(Eh,e,t,n,r,i),!0;case`mouseover`:return Dh=Nh(Dh,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return Oh.set(a,Nh(Oh.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,kh.set(a,Nh(kh.get(a)||null,e,t,n,r,i)),!0}return!1}function Fh(e){var t=At(e.target);if(t!==null){var n=o(t);if(n!==null){if(t=n.tag,t===13){if(t=s(n),t!==null){e.blockedOn=t,vt(e.priority,function(){hh(n)});return}}else if(t===31){if(t=c(n),t!==null){e.blockedOn=t,vt(e.priority,function(){hh(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ih(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=bh(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);fn=r,n.target.dispatchEvent(r),fn=null}else return t=jt(n),t!==null&&mh(t),e.blockedOn=n,!1;t.shift()}return!0}function Lh(e,t,n){Ih(e)&&n.delete(t)}function Rh(){wh=!1,Th!==null&&Ih(Th)&&(Th=null),Eh!==null&&Ih(Eh)&&(Eh=null),Dh!==null&&Ih(Dh)&&(Dh=null),Oh.forEach(Lh),kh.forEach(Lh)}function zh(e,n){e.blockedOn===n&&(e.blockedOn=null,wh||(wh=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,Rh)))}var Bh=null;function Vh(e){Bh!==e&&(Bh=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){Bh===e&&(Bh=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(Sh(r||n)===null)continue;break}var a=jt(n);a!==null&&(e.splice(t,3),t-=3,Js(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Hh(e){function t(t){return zh(t,e)}Th!==null&&zh(Th,e),Eh!==null&&zh(Eh,e),Dh!==null&&zh(Dh,e),Oh.forEach(t),kh.forEach(t);for(var n=0;n<Ah.length;n++){var r=Ah[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<Ah.length&&(n=Ah[0],n.blockedOn===null);)Fh(n),n.blockedOn===null&&Ah.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[xt]||null;if(typeof a==`function`)o||Vh(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[xt]||null)s=o.formAction;else if(Sh(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Vh(n)}}}function Uh(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Wh(e){this._internalRoot=e}Gh.prototype.render=Wh.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));var n=t.current;dh(n,kd(),e,t,null,null)},Gh.prototype.unmount=Wh.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;dh(e.current,2,null,e,null,null),Ld(),t[St]=null}};function Gh(e){this._internalRoot=e}Gh.prototype.unstable_scheduleHydration=function(e){if(e){var t=_t();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Ah.length&&t!==0&&t<Ah[n].priority;n++);Ah.splice(n,0,e),n===0&&Fh(e)}};var Kh=n.version;if(Kh!==`19.3.1`)throw Error(i(527,Kh,`19.3.1`));P.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(i(188)):(e=Object.keys(e).join(`,`),Error(i(268,e)));return e=d(t),e=e===null?null:p(e),e=e===null?null:e.stateNode,e};var qh={bundleType:0,version:`19.3.1`,rendererPackageName:`react-dom`,currentDispatcherRef:N,reconcilerVersion:`19.3.1`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var Jh=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Jh.isDisabled&&Jh.supportsFiber)try{Ye=Jh.inject(qh),Xe=Jh}catch{}}e.createRoot=function(e,t){if(!a(e))throw Error(i(299));var n=!1,r=``,o=_c,s=vc,c=yc;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=lh(e,1,!1,null,null,n,r,null,o,s,c,Uh),e[St]=t.current,Uf(e),new Wh(t)}})),g=o(((e,t)=>{function n(){if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE==`function`)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=h()})),_=c(u(),1),v=g(),y=`modulepreload`,b=function(e,t){return new URL(e,t).href},x={},S=function(e){return e.pathname.endsWith(`.css`)},C=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},w=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=b(t,n);let r=s(t),i=S(r);return C(x,r.href,()=>{if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let t=document.createElement(`link`);if(t.rel=i?`stylesheet`:y,i||(t.as=`script`),t.crossOrigin=``,t.href=r.href,a&&t.setAttribute(`nonce`,a),document.head.appendChild(t),i)return new Promise((e,n)=>{t.addEventListener(`load`,e),t.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${r}`)))})})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},T=26214400;async function ee(e){if(!e)throw Error(`لم يتم اختيار أي ملف.`);if(e.size===0)throw Error(`حجم الملف صفر (0 بايت). يبدو أن الصورة مخزنة سحابياً في Google Photos أو iCloud ولم تُنزَّل بعد — نزّل الصورة على الجهاز أولاً ثم أعد المحاولة.`);if(e.size>T){let t=(e.size/1048576).toFixed(1);throw Error(`حجم الملف (${t} MB) كبير جداً (الحد الأقصى 25 MB).`)}let t;try{let n=await e.slice(0,16).arrayBuffer();if(t=new Uint8Array(n),t.length<4)throw Error(`الملف غير مكتمل أو تعذّرت قراءته من الذاكرة.`)}catch{throw Error(`تعذّرت قراءة الملف من الهاتف (قد تكون الصورة سحابية في iCloud أو Google Photos ولم يتم تنزيلها محلياً، أو تم إلغاء صلاحية الوصول). نزّل الصورة على جهازك أولاً ثم حاول مجدداً.`)}if(t[0]===37&&t[1]===80&&t[2]===68&&t[3]===70)return{kind:`pdf`,mimeType:`application/pdf`,isPdf:!0,isImage:!1,sizeBytes:e.size};if(t[0]===255&&t[1]===216&&t[2]===255)return{kind:`jpeg`,mimeType:`image/jpeg`,isPdf:!1,isImage:!0,sizeBytes:e.size};if(t[0]===137&&t[1]===80&&t[2]===78&&t[3]===71)return{kind:`png`,mimeType:`image/png`,isPdf:!1,isImage:!0,sizeBytes:e.size};if(t[0]===71&&t[1]===73&&t[2]===70&&t[3]===56)return{kind:`gif`,mimeType:`image/gif`,isPdf:!1,isImage:!0,sizeBytes:e.size};if(t[0]===66&&t[1]===77)return{kind:`bmp`,mimeType:`image/bmp`,isPdf:!1,isImage:!0,sizeBytes:e.size};if(t.length>=12&&t[0]===82&&t[1]===73&&t[2]===70&&t[3]===70&&t[8]===87&&t[9]===69&&t[10]===66&&t[11]===80)return{kind:`webp`,mimeType:`image/webp`,isPdf:!1,isImage:!0,sizeBytes:e.size};if(t.length>=12&&t[4]===102&&t[5]===116&&t[6]===121&&t[7]===112){let n=String.fromCharCode(t[8],t[9],t[10],t[11]).toLowerCase();if([`heic`,`heix`,`hevc`,`hevx`,`mif1`,`msf1`,`heis`].includes(n))return{kind:`heic`,mimeType:`image/heic`,isPdf:!1,isImage:!0,sizeBytes:e.size};if(n===`avif`||n===`avis`)return{kind:`webp`,mimeType:`image/avif`,isPdf:!1,isImage:!0,sizeBytes:e.size}}if(e.type.startsWith(`image/`))return{kind:`unknown`,mimeType:e.type,isPdf:!1,isImage:!0,sizeBytes:e.size};throw Error(`صيغة الملف (${e.name||e.type||`غير معروف`}) غير صالحة أو تالفة. يرجى اختيار صورة فاتورة (JPG / PNG / HEIC / WEBP) أو ملف PDF حقيقي.`)}function E(e){return new Promise(t=>{let n=new FileReader;n.onload=e=>{try{let n=e.target?.result;if(!n||n.byteLength<4){t(1);return}let r=new DataView(n);if(r.getUint16(0)!==65496){t(1);return}let i=2;for(;i<r.byteLength-2;){let e=r.getUint16(i);if(i+=2,e===65505){if(i+8>=r.byteLength||r.getUint32(i+2)!==1165519206){t(1);return}let e=i+2+6,n=r.getUint16(e)===18761,a=e+r.getUint32(e+4,n);if(a+2>=r.byteLength){t(1);return}let o=r.getUint16(a,n);for(let e=0;e<o;e++){let i=a+2+e*12;if(i+10>=r.byteLength)break;if(r.getUint16(i,n)===274){t(r.getUint16(i+8,n));return}}t(1);return}if((e&65280)!=65280||i+2>=r.byteLength)break;i+=r.getUint16(i)}t(1)}catch{t(1)}},n.onerror=()=>t(1),n.readAsArrayBuffer(e.slice(0,65536))})}function te(e,t,n,r){switch(t){case 2:e.transform(-1,0,0,1,n,0);break;case 3:e.transform(-1,0,0,-1,n,r);break;case 4:e.transform(1,0,0,-1,0,r);break;case 5:e.transform(0,1,1,0,0,0);break;case 6:e.transform(0,1,-1,0,r,0);break;case 7:e.transform(0,-1,-1,0,r,n);break;case 8:e.transform(0,-1,1,0,0,n)}}function D(e,t,n=1600){if(e<=0||t<=0)return{width:1,height:1};let r=Math.max(e,t);if(r<=n)return{width:e,height:t};let i=n/r;return{width:Math.max(1,Math.round(e*i)),height:Math.max(1,Math.round(t*i))}}async function ne(e,t=.86){let n=await w(()=>import(`./heic2any-BzEdAbRx.js`).then(e=>c(e.default,1)),[],import.meta.url),r=await(n.default||n)({blob:e,toType:`image/jpeg`,quality:t});return Array.isArray(r)?r[0]:r}async function O(e,t=1600,n=.82){let r=await ee(e),i=e.size;if(r.isPdf)return{file:e,inspection:r,wasCompressed:!1,wasConvertedFromHeic:!1,originalSizeBytes:i,finalSizeBytes:e.size};let a=e,o=!1;if(r.kind===`heic`)try{a=await ne(e,.86),o=!0}catch(e){console.warn(`heic2any conversion warning (will try native createImageBitmap fallback):`,e?.message||e)}let s=e.name.replace(/\.[^/.]+$/,``).trim()||`invoice_mobile`;if(typeof createImageBitmap<`u`)try{let e=await createImageBitmap(a,{imageOrientation:`from-image`}),{width:c,height:l}=D(e.width,e.height,t),u=document.createElement(`canvas`);u.width=c,u.height=l;let d=u.getContext(`2d`,{alpha:!1});if(!d)throw e.close(),Error(`Canvas 2D context unavailable`);d.fillStyle=`#ffffff`,d.fillRect(0,0,c,l),d.imageSmoothingEnabled=!0,d.imageSmoothingQuality=`high`,d.drawImage(e,0,0,c,l),e.close();let f=await new Promise(e=>u.toBlob(e,`image/jpeg`,n));if(!f)throw Error(`canvas.toBlob returned null`);let p=new File([f],`${s}.jpg`,{type:`image/jpeg`,lastModified:Date.now()});return console.log(`📸 [MobilePrep] ${(i/1024/1024).toFixed(2)}MB → ${(p.size/1024).toFixed(0)}KB (${c}×${l}) HEIC=${o}`),{file:p,inspection:{...r,mimeType:`image/jpeg`,kind:`jpeg`},wasCompressed:!0,wasConvertedFromHeic:o,originalSizeBytes:i,finalSizeBytes:p.size}}catch(e){console.warn(`createImageBitmap path fell back:`,e?.message||e)}try{let e=r.kind===`jpeg`?await E(a):1,c=URL.createObjectURL(a);try{let a=await new Promise((e,t)=>{let n=new Image;n.onload=()=>e(n),n.onerror=()=>t(Error(`Image element decode failed`)),n.src=c}),l=e>=5&&e<=8,{width:u,height:d}=D(l?a.naturalHeight:a.naturalWidth,l?a.naturalWidth:a.naturalHeight,t),f=document.createElement(`canvas`);f.width=u,f.height=d;let p=f.getContext(`2d`,{alpha:!1});if(!p)throw Error(`Canvas 2D context unavailable`);p.fillStyle=`#ffffff`,p.fillRect(0,0,u,d),p.imageSmoothingEnabled=!0,p.imageSmoothingQuality=`high`,p.save(),te(p,e,u,d);let m=l?d:u,h=l?u:d;p.drawImage(a,0,0,m,h),p.restore();let g=await new Promise(e=>f.toBlob(e,`image/jpeg`,n));if(!g)throw Error(`canvas.toBlob returned null`);let _=new File([g],`${s}.jpg`,{type:`image/jpeg`,lastModified:Date.now()});return{file:_,inspection:{...r,mimeType:`image/jpeg`,kind:`jpeg`},wasCompressed:!0,wasConvertedFromHeic:o,originalSizeBytes:i,finalSizeBytes:_.size}}finally{URL.revokeObjectURL(c)}}catch{if(o&&a){let e=new File([a],`${s}.jpg`,{type:`image/jpeg`,lastModified:Date.now()});return{file:e,inspection:{...r,mimeType:`image/jpeg`,kind:`jpeg`},wasCompressed:!1,wasConvertedFromHeic:!0,originalSizeBytes:i,finalSizeBytes:e.size,warning:`تم تحويل الصورة من HEIC لكن تعذّر ضغطها — تم استخدام النسخة المحولة.`}}let t=e.type?e:new File([e],e.name||`${s}.jpg`,{type:r.mimeType,lastModified:Date.now()});return{file:t,inspection:r,wasCompressed:!1,wasConvertedFromHeic:!1,originalSizeBytes:i,finalSizeBytes:t.size,warning:r.kind===`heic`?`لم يتمكن المتصفح من تحويل صورة HEIC محلياً — سيتم محاولة إرسالها مباشرة.`:`تعذّر ضغط الصورة محلياً — سيتم إرسال الملف الأصلي تلقائياً.`}}}function re(e){let t=(e||``).toLowerCase();return t.includes(`drop`)||t.includes(`drup`)||t.includes(`قطرة`)||t.includes(`قطره`)?`قطرة`:t.includes(`ointment`)||t.includes(`مرهم`)||t.includes(`oint`)||t.includes(`ung`)?`مرهم`:t.includes(`cream`)||t.includes(`كريم`)||t.includes(`crm`)||t.includes(`cr `)?`كريم`:`حبوب`}function ie(e){if(!e)return``;for(let[t,n]of[[`الزعفرانية`,`الزعفرانية`],[`زعفرانية`,`الزعفرانية`],[`مدينة الصدر`,`مدينة الصدر`],[`الصدر`,`مدينة الصدر`],[`الكرادة`,`الكرادة`],[`المنصور`,`المنصور`],[`الشعب`,`الشعب`],[`الدورة`,`الدورة`],[`الكاظمية`,`الكاظمية`],[`الحارثية`,`الحارثية`],[`زيونة`,`زيونة`],[`السيدية`,`السيدية`],[`الغزالية`,`الغزالية`],[`البلديات`,`البلديات`],[`الحبيبية`,`الحبيبية`],[`بغداد الجديدة`,`بغداد الجديدة`],[`العامرية`,`العامرية`],[`اليرموك`,`اليرموك`],[`حي الجامعة`,`حي الجامعة`],[`البياع`,`البياع`],[`حي أور`,`حي أور`],[`المشتل`,`المشتل`],[`الغدير`,`الغدير`],[`حي الخضراء`,`حي الخضراء`],[`القاهرة`,`القاهرة`],[`الصليخ`,`الصليخ`],[`الأعظمية`,`الأعظمية`],[`الكرخ`,`الكرخ`],[`الرصافة`,`الرصافة`],[`بسماية`,`بسماية`],[`الشعلة`,`الشعلة`],[`جكوك`,`جكوك`],[`الطارمية`,`الطارمية`],[`المدائن`,`المدائن`],[`المحمودية`,`المحمودية`],[`أبو غريب`,`أبو غريب`]])if(e.includes(t))return n;let t=e.match(/[\/\-]\s*([^\/\-\n\r]{3,25})$/);return t&&t[1].trim().length>=3?t[1].trim():``}var ae=`// ضع هذا الكود المختصر (مرة واحدة فقط) في شيت المندوب بعد إضافة مشروع سكربت الأدمن كـ Library باسم AdminLib (الوضع: HEAD)
function onEdit(e) { return AdminLib.onEdit(e); }
function doGet(e) { return AdminLib.doGet(e); }
function doPost(e) { return AdminLib.doPost(e); }
function testRun() { return AdminLib.testRun(); }`,k=`var SPREADSHEET_ID = '1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE';
var ADMIN_USERS_SHEET_ID = '1_CBGFeFrTaw6L_7U1ztdAZ3gJjjVMEpUhE8oyUn-NjI';
var SCRIPT_VERSION = 10;
var TEMPLATE_SYNC_GUARD = false;

var DATA_COL_KEYS = [
  'invoice_number', 'invoice_date', 'warehouse_name', 'pharmacy_name',
  'area', 'city', 'product_name', 'dosage_form',
  'quantity', 'unit_price', 'bonus_quantity', 'line_total',
  'total_invoice', 'rep_name', 'status', 'timestamp', 'loyalty'
];

function extractSheetIdFromUrl(val) {
  var s = String(val || '').trim();
  if (!s) return '';
  var m = s.match(/\\/spreadsheets\\/d\\/([a-zA-Z0-9-_]+)/);
  if (m && m[1]) return m[1];
  if (/^[a-zA-Z0-9-_]{20,}$/.test(s)) return s;
  return '';
}

function getTargetSpreadsheet(customSpreadsheetId) {
  var targetId = extractSheetIdFromUrl(customSpreadsheetId) || String(customSpreadsheetId || '').trim();
  if (targetId && targetId !== SPREADSHEET_ID) {
    try {
      var opened = SpreadsheetApp.openById(targetId);
      if (opened) return opened;
    } catch (e) {}
  }
  try {
    var ssDefault = SpreadsheetApp.openById(targetId || SPREADSHEET_ID);
    if (ssDefault) return ssDefault;
  } catch (e2) {}
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e3) {}
  return null;
}

function sheetHasPivotTables(sheet) {
  try {
    return Boolean(sheet && typeof sheet.getPivotTables === 'function' && sheet.getPivotTables().length > 0);
  } catch (e) {
    return false;
  }
}

function isUsersSheetObj(sheet) {
  if (!sheet) return false;
  try {
    var parentId = sheet.getParent().getId();
    if (parentId === ADMIN_USERS_SHEET_ID) return true;
  } catch (e) {}
  var name = String(sheet.getName() || '').trim();
  if (name === 'المستخدمون' || name.toLowerCase() === 'users') return true;
  try {
    if (sheet.getLastRow() > 0) {
      var row1 = sheet.getRange(1, 1, 1, Math.min(4, Math.max(1, sheet.getLastColumn()))).getValues()[0];
      var a = normAr(row1[0]);
      var b = normAr(row1[1]);
      if ((a.indexOf('الاسم') !== -1 && b.indexOf('الرمز') !== -1) || (a === 'id' && b.indexOf('full_name') !== -1)) {
        return true;
      }
    }
  } catch (e2) {}
  return false;
}

function findInvoiceDataSheet(ss, preferredName) {
  if (!ss) return null;
  var pref = String(preferredName || '').trim();
  if (pref && pref !== 'الفواتير') {
    var named = ss.getSheetByName(pref);
    if (named && !isUsersSheetObj(named) && !sheetHasPivotTables(named)) return named;
  }
  var candidates = ['الفواتير', 'Sheet1', 'الورقة1', 'المبيعات'];
  for (var c = 0; c < candidates.length; c++) {
    var cs = ss.getSheetByName(candidates[c]);
    if (cs && !isUsersSheetObj(cs) && !sheetHasPivotTables(cs)) return cs;
  }
  var all = ss.getSheets();
  for (var i = 0; i < all.length; i++) {
    var s = all[i];
    if (isUsersSheetObj(s) || sheetHasPivotTables(s)) continue;
    try {
      if (s.getLastRow() > 0) {
        var r1 = s.getRange(1, 1, 1, Math.min(6, Math.max(1, s.getLastColumn()))).getValues()[0];
        for (var k = 0; k < r1.length; k++) {
          var hk = normAr(r1[k]);
          if (hk.indexOf('رقم الفاتور') !== -1 || hk.indexOf('اسم الصيدلي') !== -1) return s;
        }
      }
    } catch (e) {}
  }
  for (var j = 0; j < all.length; j++) {
    if (!isUsersSheetObj(all[j]) && !sheetHasPivotTables(all[j])) return all[j];
  }
  return null;
}

function getTargetSheet(customSpreadsheetId, preferredSheetName) {
  var ss = getTargetSpreadsheet(customSpreadsheetId);
  if (!ss) return null;
  return findInvoiceDataSheet(ss, preferredSheetName);
}

function getOrCreateUsersSheet(adminSpreadsheetId) {
  var targetId = extractSheetIdFromUrl(adminSpreadsheetId) || String(adminSpreadsheetId || ADMIN_USERS_SHEET_ID).trim();
  var ss = null;
  if (targetId) {
    try { ss = SpreadsheetApp.openById(targetId); } catch (e) {}
  }
  if (!ss) ss = getTargetSpreadsheet('');
  if (!ss) return null;

  var allSheets = ss.getSheets();
  for (var s = 0; s < allSheets.length; s++) {
    var cand = allSheets[s];
    if (cand.getLastRow() > 0) {
      var r1 = cand.getRange(1, 1, 1, Math.min(4, Math.max(1, cand.getLastColumn()))).getValues()[0];
      var c0 = normAr(r1[0]);
      var c1 = normAr(r1[1]);
      if (c0.indexOf('الاسم') !== -1 || c1.indexOf('الرمز') !== -1 || c0 === 'id') {
        return cand;
      }
    }
  }

  var sheet = ss.getSheetByName('المستخدمون') || ss.getSheets()[0];
  if (!sheet) sheet = ss.insertSheet('المستخدمون');
  if (sheet.getLastRow() === 0) {
    var masterHeaders = ['الاسم', 'الرمز السري', 'صفحة كوكل شيت', 'اي بي اي سكربت', 'اي بي اي جمناي'];
    sheet.appendRow(masterHeaders);
    sheet.getRange(1, 1, 1, masterHeaders.length).setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
  }
  return sheet;
}

function resolveUserColMap(headers) {
  var norm = [];
  for (var i = 0; i < headers.length; i++) norm.push(normAr(headers[i]));
  var findIdx = function(patterns) {
    for (var c = 0; c < norm.length; c++) {
      if (!norm[c]) continue;
      for (var p = 0; p < patterns.length; p++) {
        if (norm[c].indexOf(patterns[p]) !== -1) return c;
      }
    }
    return -1;
  };
  var isLegacy = norm[0] === 'id' || (norm[0] && norm[0].indexOf('معرف') !== -1);
  if (!isLegacy) {
    return {
      isLegacy: false,
      nameCol: findIdx(['الاسم', 'full_name', 'name']) >= 0 ? findIdx(['الاسم', 'full_name', 'name']) : 0,
      passCol: findIdx(['الرمز السري', 'كلمه المرور', 'الرمز', 'password', 'pin']) >= 0 ? findIdx(['الرمز السري', 'كلمه المرور', 'الرمز', 'password', 'pin']) : 1,
      sheetCol: findIdx(['صفحه كوكل شيت', 'شيت', 'sheet']) >= 0 ? findIdx(['صفحه كوكل شيت', 'شيت', 'sheet']) : 2,
      webhookCol: findIdx(['اي بي اي سكربت', 'سكربت', 'webhook', 'script']) >= 0 ? findIdx(['اي بي اي سكربت', 'سكربت', 'webhook', 'script']) : 3,
      emailCol: findIdx(['email', 'بريد', 'username']),
      idCol: findIdx(['معرف']),
      roleCol: findIdx(['role', 'دور', 'صلاحيه']),
      activeCol: findIdx(['is_active', 'الحاله']),
      geminiCol: findIdx(['اي بي اي جمناي', 'مفتاح جمناي', 'جمناي', 'gemini', 'مفتاح'])
    };
  }
  return {
    isLegacy: true, idCol: 0, nameCol: 1, emailCol: 2, passCol: 3,
    roleCol: 4, activeCol: 5, geminiCol: 6, sheetCol: 7, webhookCol: 8
  };
}

function ensureMasterGeminiColumn(usersSheet, forcedColZeroIdx) {
  if (!usersSheet) return 4;
  var lastCol = Math.max(4, usersSheet.getLastColumn());
  var headers = usersSheet.getLastRow() > 0 ? usersSheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  var uMap = resolveUserColMap(headers);
  if (uMap.geminiCol >= 0) return uMap.geminiCol;
  var targetCol = (forcedColZeroIdx !== undefined && forcedColZeroIdx >= 4) ? forcedColZeroIdx : 4;
  for (var gc = 4; gc < headers.length; gc++) {
    if (!String(headers[gc] || '').trim()) { targetCol = gc; break; }
    if (gc === headers.length - 1 && String(headers[gc] || '').trim()) { targetCol = headers.length; }
  }
  if (targetCol < 4) targetCol = 4;
  try {
    usersSheet.getRange(1, targetCol + 1).setValue('اي بي اي جمناي').setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
  } catch (e) {}
  return targetCol;
}

function propagateGeminiKeyToAllUserRows(usersSheet, targetGemCol, gemKeyVal) {
  if (!usersSheet) return;
  var lastRow = usersSheet.getLastRow();
  var lastCol = Math.max(4, usersSheet.getLastColumn());
  var headers = lastRow > 0 ? usersSheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  var uMap = resolveUserColMap(headers);
  for (var gr = 2; gr <= lastRow; gr++) {
    var rowNameG = String(usersSheet.getRange(gr, uMap.nameCol + 1).getValue() || '').trim();
    if (rowNameG) {
      usersSheet.getRange(gr, targetGemCol + 1).setValue(gemKeyVal);
    }
  }
}

function isBaqerName(name, email) {
  var n = normAr(name).replace(/^(د\\.|دكتور)\\s+/i, '').trim();
  var e = String(email || '').trim().toLowerCase();
  return n === 'باقر' || n === 'باقر علي' || n.indexOf('باقر ') === 0 || n === 'baqer' || n === 'baqir' || e === 'baqer@pharma.com' || e === 'admin@pharma.com';
}

function readAllSheetUsers(sheet) {
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var uMap = resolveUserColMap(headers);
  var users = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var fullName = String(row[uMap.nameCol] || '').trim();
    var emailVal = uMap.emailCol >= 0 ? String(row[uMap.emailCol] || '').trim().toLowerCase() : '';
    var idVal = uMap.idCol >= 0 ? String(row[uMap.idCol] || '').trim() : '';
    if (!fullName && !emailVal) continue;
    var nCheck = normAr(fullName);
    if (nCheck === 'الاسم' || nCheck === 'full_name' || idVal.toLowerCase() === 'id') continue;
    var role = isBaqerName(fullName, emailVal) ? 'admin' : 'medical_rep';
    var activeRaw = uMap.activeCol >= 0 ? String(row[uMap.activeCol] === undefined ? 'TRUE' : row[uMap.activeCol]).trim().toUpperCase() : 'TRUE';
    if (activeRaw === 'FALSE' || activeRaw === '0' || activeRaw === 'معطل') continue;
    var rawGem = uMap.geminiCol >= 0 ? String(row[uMap.geminiCol] || '').trim() : '';
    if (!rawGem) {
      for (var c = 4; c < row.length; c++) {
        var cv = String(row[c] || '').trim();
        if (/^(AIza|AQ\\.)/.test(cv)) { rawGem = cv; break; }
      }
    }
    users.push({
      rowNumber: i + 1,
      id: idVal || ('sheet-usr-' + (i + 1)),
      full_name: fullName || emailVal.split('@')[0],
      email: emailVal || (fullName.toLowerCase().replace(/\\s+/g, '_') + '@pharma.com'),
      password_hash: String(row[uMap.passCol] || '').trim(),
      role: role,
      is_active: true,
      gemini_api_key: rawGem,
      sheet_id: String(row[uMap.sheetCol] || '').trim(),
      webhook_url: String(row[uMap.webhookCol] || '').trim()
    });
  }
  return users;
}

function getExpectedCols(sheet) {
  var headers = [
    'رقم الفاتورة',
    'تاريخ الفاتورة',
    'اسم المذخر',
    'اسم الصيدلية',
    'المنطقة / المكان',
    'المدينة / المحافظة',
    'اسم المادة الدوائية',
    'نوع المادة / الشكل الدوائي',
    'الكمية',
    'سعر المفرد (د.ع)',
    'البونص المجاني',
    'المجموع (د.ع)',
    'صافي الفاتورة الكلي (د.ع)',
    'اسم المندوب العلمي',
    'حالة الاعتماد',
    'وقت وتاريخ الإدراج'
  ];
  if (sheet && sheet.getLastRow() > 0 && sheet.getLastColumn() > 16) {
    var existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    for (var c = 16; c < existing.length; c++) {
      var label = String(existing[c] || '').trim();
      if (label) headers.push(label);
    }
  }
  return headers;
}

function normAr(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[\\u064B-\\u0652\\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\\s+/g, ' ')
    .trim();
}

function normPh(s) {
  return normAr(s).replace(/^(صيدلية|صيدليه|مذخر|ص\\.?)\\s+/gi, '').trim();
}

function normProd(s) {
  return normAr(s).replace(/[^a-z0-9\\u0621-\\u064a]/gi, '');
}

function formatYmd(val) {
  if (!val) return '';
  if (val instanceof Date) {
    try { return Utilities.formatDate(val, 'Asia/Baghdad', 'yyyy-MM-dd'); } catch (e) {}
  }
  var s = String(val).trim();
  var m = s.match(/^(\\d{4})[-/](\\d{1,2})[-/](\\d{1,2})/);
  if (m) return m[1] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[3]).slice(-2);
  var us = s.match(/^(\\d{1,2})[/-](\\d{1,2})[/-](\\d{4})$/);
  if (us) {
    var p1 = Number(us[1]), p2 = Number(us[2]);
    var mo = p1 > 12 ? p2 : p1;
    var dy = p1 > 12 ? p1 : p2;
    return us[3] + '-' + ('0' + mo).slice(-2) + '-' + ('0' + dy).slice(-2);
  }
  return s.split('T')[0];
}

function detectDosage(name) {
  var p = String(name || '').toLowerCase();
  if (p.indexOf('drop') !== -1 || p.indexOf('قطرة') !== -1 || p.indexOf('drups') !== -1 || p.indexOf('hyfresh') !== -1 || p.indexOf('loxtra') !== -1) return 'قطرة';
  if (p.indexOf('cream') !== -1 || p.indexOf('كريم') !== -1 || p.indexOf('elica') !== -1 || p.indexOf('fucidin') !== -1) return 'كريم';
  if (p.indexOf('oint') !== -1 || p.indexOf('مرهم') !== -1) return 'مرهم';
  return 'حبوب';
}

function detectAreaFromPh(phName) {
  var s = normAr(phName);
  var areas = [
    ['فلسطين', 'شارع فلسطين'], ['كراده', 'الكرادة'], ['منصور', 'المنصور'],
    ['زعفرانيه', 'الزعفرانية'], ['مدينة الصدر', 'مدينة الصدر'], ['مدينه الصدر', 'مدينة الصدر'],
    ['صدر', 'مدينة الصدر'], ['اعظميه', 'الأعظمية'], ['كاظميه', 'الكاظمية'],
    ['دوره', 'الدورة'], ['بياع', 'البياع'], ['عامريه', 'العامرية'],
    ['غزاليه', 'الغزالية'], ['شعب', 'الشعب'], ['زيونه', 'زيونة'],
    ['بغداد الجديده', 'بغداد الجديدة'], ['جادرية', 'الجادرية'], ['جادريه', 'الجادرية'],
    ['حارثيه', 'الحارثية'], ['سيديه', 'السيدية'], ['بلديات', 'البلديات'],
    ['حبيبيه', 'الحبيبية'], ['يرموك', 'اليرموك'], ['جامعه', 'حي الجامعة'],
    ['حي اور', 'حي أور'], ['مشتل', 'المشتل'], ['غدير', 'الغدير'],
    ['خضراء', 'حي الخضراء'], ['قاهره', 'القاهرة'], ['صليخ', 'الصليخ'],
    ['شعله', 'الشعلة'], ['بسمايه', 'بسماية'], ['محموديه', 'المحمودية'],
    ['مدائن', 'المدائن'], ['ابو غريب', 'أبو غريب'], ['طارميه', 'الطارمية'],
    ['كرخ', 'الكرخ'], ['رصافه', 'الرصافة']
  ];
  for (var i = 0; i < areas.length; i++) {
    if (s.indexOf(areas[i][0]) !== -1) return areas[i][1];
  }
  var slashMatch = String(phName || '').match(/[\\/-]\\s*([^\\n\\r\\/-]{3,25})$/);
  if (slashMatch && slashMatch[1] && slashMatch[1].trim().length >= 3) return slashMatch[1].trim();
  return 'مركز المدينة';
}

function isKnownCityName(val) {
  var v = normAr(val);
  var cities = ['بغداد', 'البصره', 'اربيل', 'النجف', 'كربلاء', 'الموصل', 'نينوى', 'بابل', 'الحله', 'كركوك', 'ديالى', 'الانبار', 'واسط', 'ذي قار', 'ميسان', 'المثنى', 'القادسيه', 'الديوانيه', 'صلاح الدين', 'دهوك', 'السليمانيه'];
  for (var i = 0; i < cities.length; i++) {
    if (v === cities[i]) return true;
  }
  return false;
}

function isShiftedOldRow(row) {
  var c4 = String(row[4] || '').trim();
  var c5 = String(row[5] || '').trim();
  var c6Num = Number(row[6]);
  var c13 = String(row[13] || '').trim();
  var c14 = String(row[14] || '').trim();
  if (row.length < 16) return true;
  if (c5 !== '' && !isNaN(c6Num) && c6Num > 0 && c13 && c13.indexOf(':') !== -1 && !c14 && !String(row[15] || '').trim()) return true;
  if (isKnownCityName(c4) && !isNaN(c6Num) && c6Num > 0 && c5 !== '' && isNaN(Number(c5)) && !c14 && !String(row[15] || '').trim()) return true;
  return false;
}

function resolveColMap(headers) {
  var hasArea = false;
  var hasDosage = false;
  for (var k = 0; k < headers.length; k++) {
    var hk = normAr(headers[k]);
    if (hk.indexOf('المنطق') !== -1 || hk.indexOf('المكان') !== -1) hasArea = true;
    if (hk.indexOf('نوع الماد') !== -1 || hk.indexOf('الشكل الدوائي') !== -1) hasDosage = true;
  }
  var map = {
    invoice_number: 0, invoice_date: 1, warehouse_name: 2, pharmacy_name: 3,
    area: hasArea ? 4 : -1,
    city: hasArea ? 5 : 4,
    product_name: hasArea ? 6 : 5,
    dosage_form: hasDosage ? 7 : -1,
    quantity: (hasArea && hasDosage) ? 8 : 6,
    unit_price: (hasArea && hasDosage) ? 9 : 7,
    bonus_quantity: (hasArea && hasDosage) ? 10 : 8,
    line_total: (hasArea && hasDosage) ? 11 : 9,
    total_invoice: (hasArea && hasDosage) ? 12 : 10,
    rep_name: (hasArea && hasDosage) ? 13 : 11,
    status: (hasArea && hasDosage) ? 14 : 12,
    timestamp: (hasArea && hasDosage) ? 15 : 13,
    loyalty: (hasArea && hasDosage) ? 16 : 14
  };
  for (var c = 0; c < headers.length; c++) {
    var h = normAr(headers[c]);
    if (!h) continue;
    if (h.indexOf('رقم الفاتور') !== -1) map.invoice_number = c;
    else if (h.indexOf('تاريخ الفاتور') !== -1) map.invoice_date = c;
    else if (h.indexOf('المذخر') !== -1) map.warehouse_name = c;
    else if (h.indexOf('اسم الصيدلي') !== -1) map.pharmacy_name = c;
    else if (h.indexOf('المنطق') !== -1 || h.indexOf('المكان') !== -1) map.area = c;
    else if (h.indexOf('المدين') !== -1 || h.indexOf('المحافظ') !== -1) map.city = c;
    else if (h.indexOf('اسم الماد') !== -1 || h.indexOf('الماده الدوائي') !== -1) map.product_name = c;
    else if (h.indexOf('نوع الماد') !== -1 || h.indexOf('الشكل الدوائي') !== -1) map.dosage_form = c;
    else if (h === 'الكميه' || h.indexOf('الكمي') !== -1) map.quantity = c;
    else if (h.indexOf('سعر المفرد') !== -1) map.unit_price = c;
    else if (h.indexOf('البونص') !== -1) map.bonus_quantity = c;
    else if (h.indexOf('صافي الفاتور') !== -1) map.total_invoice = c;
    else if (h.indexOf('المجموع') !== -1) map.line_total = c;
    else if (h.indexOf('المندوب') !== -1) map.rep_name = c;
    else if (h.indexOf('حاله الاعتماد') !== -1 || h.indexOf('الحال') !== -1) map.status = c;
    else if (h.indexOf('وقت وتاريخ') !== -1 || h.indexOf('الادراج') !== -1) map.timestamp = c;
    else if (h.indexOf('الولاء') !== -1) map.loyalty = c;
  }
  return map;
}

function buildRowValuesByHeaders(r, headers, existingRow) {
  var totalCols = headers.length;
  var vals = [];
  for (var c = 0; c < totalCols; c++) {
    vals.push(existingRow && existingRow[c] !== undefined ? existingRow[c] : '');
  }
  var colMap = resolveColMap(headers);
  var invNum = String(r.invoice_number || '').trim();
  var phName = String(r.pharmacy_name || (existingRow ? existingRow[colMap.pharmacy_name] : '') || '').trim();
  var resolvedCity = String(r.city || r.pharmacy_city || (existingRow && colMap.city >= 0 ? existingRow[colMap.city] : '') || 'بغداد').trim();
  var resolvedArea = String(r.area || r.pharmacy_area || '').trim();
  if (!resolvedArea && existingRow && colMap.area >= 0) {
    var oldArea = String(existingRow[colMap.area] || '').trim();
    if (oldArea && !isKnownCityName(oldArea)) resolvedArea = oldArea;
  }
  if (!resolvedArea || resolvedArea === 'مركز المدينة') {
    var guessed = detectAreaFromPh(phName);
    if (!resolvedArea || (guessed && guessed !== 'مركز المدينة')) resolvedArea = guessed;
  }
  var prodName = String(r.product_name || (existingRow ? existingRow[colMap.product_name] : '') || '').trim();
  var repName = String(r.rep_name || (existingRow ? existingRow[colMap.rep_name] : '') || 'مندوب علمي').trim();

  vals[colMap.invoice_number] = invNum;
  vals[colMap.invoice_date]   = formatYmd(r.invoice_date);
  vals[colMap.warehouse_name] = r.warehouse_name || (existingRow ? existingRow[colMap.warehouse_name] : '') || 'مذخر الشغف الحديث';
  vals[colMap.pharmacy_name]  = phName;
  if (colMap.area >= 0) vals[colMap.area] = resolvedArea;
  if (colMap.city >= 0) vals[colMap.city] = resolvedCity || 'بغداد';
  vals[colMap.product_name]   = prodName;
  if (colMap.dosage_form >= 0) vals[colMap.dosage_form] = r.dosage_form || detectDosage(prodName);
  vals[colMap.quantity]       = Number(r.quantity || 0);
  vals[colMap.unit_price]     = Number(r.unit_price || 0);
  vals[colMap.bonus_quantity] = Number(r.bonus_quantity || 0);
  vals[colMap.line_total]     = Number(r.line_total || 0);
  vals[colMap.total_invoice]  = Number(r.total_invoice || 0);
  vals[colMap.rep_name]       = repName;
  vals[colMap.status]         = r.status || (existingRow ? existingRow[colMap.status] : '') || 'قيد التدقيق';
  vals[colMap.timestamp]      = r.timestamp || (existingRow ? existingRow[colMap.timestamp] : '') || '';
  if (colMap.loyalty >= 0 && colMap.loyalty < totalCols && r.loyalty !== undefined && r.loyalty !== '') {
    vals[colMap.loyalty] = r.loyalty;
  }
  return vals;
}

function setupSheet(sheet) {
  if (!sheet) sheet = getTargetSheet();
  if (!sheet || isUsersSheetObj(sheet) || sheetHasPivotTables(sheet)) return;
  var headers = getExpectedCols(sheet);
  var totalCols = headers.length;
  var lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.appendRow(headers);
  } else {
    var rawData = sheet.getDataRange().getValues();
    var cleanedData = [];
    var needsRewrite = false;
    var currentHeaders = rawData[0] || [];
    var oldMap = resolveColMap(currentHeaders);
    if (
      currentHeaders.length < 16 ||
      String(currentHeaders[4] || '').trim() !== 'المنطقة / المكان' ||
      String(currentHeaders[5] || '').trim() !== 'المدينة / المحافظة' ||
      String(currentHeaders[7] || '').trim() !== 'نوع المادة / الشكل الدوائي'
    ) {
      needsRewrite = true;
    }
    for (var i = 1; i < rawData.length; i++) {
      var row = rawData[i];
      var invNum = String(row[oldMap.invoice_number] !== undefined ? row[oldMap.invoice_number] : (row[0] || '')).trim();
      var phNameCheck = String(row[oldMap.pharmacy_name] !== undefined ? row[oldMap.pharmacy_name] : (row[3] || '')).trim();
      if (invNum === '123' || (!invNum && !phNameCheck && !row[oldMap.product_name])) { needsRewrite = true; continue; }
      if (oldMap.area >= 0 && isShiftedOldRow(row)) {
        needsRewrite = true;
        var phName = String(row[3] || '').trim();
        var cityName = String(row[4] || 'بغداد').trim();
        var prName = String(row[5] || '').trim();
        var qtyVal = Number(row[6] || 0);
        var priceVal = Number(row[7] || 0);
        var bonusVal = Number(row[8] || 0);
        var lineTotalVal = Number(row[9] || (qtyVal * priceVal));
        var totalInvVal = Number(row[10] || lineTotalVal);
        var maybeRep = String(row[11] || '').trim();
        var maybeStatus = String(row[12] || '').trim();
        var maybeTs = String(row[13] || '').trim();
        if (!maybeRep && maybeTs) maybeRep = 'مندوب علمي';
        if (!maybeStatus) maybeStatus = 'قيد التدقيق';
        var rebuilt14 = [invNum, formatYmd(row[1]), String(row[2] || '').trim(), phName, detectAreaFromPh(phName), cityName || 'بغداد', prName, detectDosage(prName), qtyVal, priceVal, bonusVal, lineTotalVal, totalInvVal, maybeRep, maybeStatus, maybeTs];
        while (rebuilt14.length < totalCols) rebuilt14.push(row[rebuilt14.length] !== undefined ? row[rebuilt14.length] : '');
        cleanedData.push(rebuilt14);
      } else {
        var phM = String(row[oldMap.pharmacy_name] || '').trim();
        var cityM = oldMap.city >= 0 ? String(row[oldMap.city] || '').trim() : '';
        var areaM = oldMap.area >= 0 ? String(row[oldMap.area] || '').trim() : '';
        if (isKnownCityName(areaM) && (!cityM || !isKnownCityName(cityM))) {
          var tmp = cityM;
          cityM = areaM;
          areaM = tmp;
          needsRewrite = true;
        } else if (isKnownCityName(areaM) && isKnownCityName(cityM)) {
          areaM = '';
          needsRewrite = true;
        }
        if (!cityM) cityM = 'بغداد';
        if (!areaM || areaM === 'مركز المدينة') {
          var gArea = detectAreaFromPh(phM);
          if (!areaM || (gArea && gArea !== 'مركز المدينة')) areaM = gArea;
        }
        var prodM = String(row[oldMap.product_name] || '').trim();
        var dosM = oldMap.dosage_form >= 0 ? String(row[oldMap.dosage_form] || '').trim() : '';
        if (!dosM) dosM = detectDosage(prodM);
        var mappedRow = [
          invNum,
          formatYmd(row[oldMap.invoice_date]),
          String(row[oldMap.warehouse_name] || '').trim(),
          phM,
          areaM,
          cityM,
          prodM,
          dosM,
          row[oldMap.quantity] !== undefined ? row[oldMap.quantity] : 0,
          row[oldMap.unit_price] !== undefined ? row[oldMap.unit_price] : 0,
          row[oldMap.bonus_quantity] !== undefined ? row[oldMap.bonus_quantity] : 0,
          row[oldMap.line_total] !== undefined ? row[oldMap.line_total] : 0,
          row[oldMap.total_invoice] !== undefined ? row[oldMap.total_invoice] : 0,
          String(row[oldMap.rep_name] || '').trim(),
          String(row[oldMap.status] || 'قيد التدقيق').trim(),
          row[oldMap.timestamp] !== undefined ? row[oldMap.timestamp] : ''
        ];
        for (var ec = 16; ec < totalCols; ec++) {
          mappedRow.push(row[ec] !== undefined ? row[ec] : '');
        }
        cleanedData.push(mappedRow);
      }
    }
    if (needsRewrite) {
      sheet.clear();
      sheet.getRange(1, 1, 1, totalCols).setValues([headers]);
      if (cleanedData.length > 0) sheet.getRange(2, 1, cleanedData.length, totalCols).setValues(cleanedData);
    }
  }
  var headerRange = sheet.getRange(1, 1, 1, totalCols);
  headerRange.setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold').setFontSize(11).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);
  sheet.setRightToLeft(true);
  try {
    sheet.clearConditionalFormatRules();
    highlightDuplicatesInSheet(sheet);
    sheet.autoResizeColumns(1, totalCols);
  } catch (fmtErr) {}

  if (!TEMPLATE_SYNC_GUARD && typeof sheet.getParent === 'function') {
    try {
      var pSs = sheet.getParent();
      if (pSs && pSs.getId && pSs.getId() !== SPREADSHEET_ID && pSs.getId() !== ADMIN_USERS_SHEET_ID && pSs.getSheets().length <= 1) {
        cloneAdminTabsAndPivotsToTarget(pSs.getId());
      }
    } catch (syncAutoErr) {}
  }
}

function getColKeyByIndex(colMap, zeroBasedIdx) {
  for (var i = 0; i < DATA_COL_KEYS.length; i++) {
    var k = DATA_COL_KEYS[i];
    if (colMap[k] === zeroBasedIdx) return k;
  }
  return '';
}

function mapAdminColToRepCol(adminCol1Based, adminColMap, repColMap, tabName, adminHeaders, repHeaders) {
  var zeroIdx = Number(adminCol1Based) - 1;
  var key = getColKeyByIndex(adminColMap, zeroIdx);
  if (key) {
    if (normAr(tabName).indexOf('منطق') !== -1 && key === 'city' && repColMap.area >= 0) {
      return repColMap.area + 1;
    }
    return repColMap[key] >= 0 ? (repColMap[key] + 1) : Number(adminCol1Based);
  }
  if (Array.isArray(adminHeaders) && Array.isArray(repHeaders) && zeroIdx >= 0 && zeroIdx < adminHeaders.length) {
    var srcLabel = normAr(adminHeaders[zeroIdx]);
    if (srcLabel) {
      for (var ri = 0; ri < repHeaders.length; ri++) {
        if (normAr(repHeaders[ri]) === srcLabel) return ri + 1;
      }
    }
  }
  return Number(adminCol1Based);
}

function copySinglePivotTable(pt, targetTab, repSourceRange, adminColMap, repColMap, tabName, adminHeaders, repHeaders) {
  var anchorA1 = 'A1';
  try { anchorA1 = pt.getAnchorCell().getA1Notation(); } catch (e) {}
  var newPt = targetTab.getRange(anchorA1).createPivotTable(repSourceRange);
  var rGroups = typeof pt.getRowGroups === 'function' ? pt.getRowGroups() : [];
  for (var rgIdx = 0; rgIdx < rGroups.length; rgIdx++) {
    var rg = rGroups[rgIdx];
    var targetRCol = mapAdminColToRepCol(rg.getSourceDataColumn(), adminColMap, repColMap, tabName, adminHeaders, repHeaders);
    var newRg = newPt.addRowGroup(targetRCol);
    try { if (typeof rg.totalsAreShown === 'function') newRg.showTotals(rg.totalsAreShown()); } catch (e1) {}
    try { if (typeof rg.areLabelsRepeated === 'function' && rg.areLabelsRepeated()) newRg.showRepeatedLabels(); } catch (e2) {}
    try { if (typeof rg.isSortAscending === 'function') { if (rg.isSortAscending()) newRg.sortAscending(); else newRg.sortDescending(); } } catch (e3) {}
  }
  var cGroups = typeof pt.getColumnGroups === 'function' ? pt.getColumnGroups() : [];
  for (var cgIdx = 0; cgIdx < cGroups.length; cgIdx++) {
    var cg = cGroups[cgIdx];
    var targetCCol = mapAdminColToRepCol(cg.getSourceDataColumn(), adminColMap, repColMap, tabName, adminHeaders, repHeaders);
    var newCg = newPt.addColumnGroup(targetCCol);
    try { if (typeof cg.totalsAreShown === 'function') newCg.showTotals(cg.totalsAreShown()); } catch (e4) {}
    try { if (typeof cg.areLabelsRepeated === 'function' && cg.areLabelsRepeated()) newCg.showRepeatedLabels(); } catch (e5) {}
    try { if (typeof cg.isSortAscending === 'function') { if (cg.isSortAscending()) newCg.sortAscending(); else newCg.sortDescending(); } } catch (e6) {}
  }
  var pVals = typeof pt.getPivotValues === 'function' ? pt.getPivotValues() : [];
  for (var pvIdx = 0; pvIdx < pVals.length; pvIdx++) {
    var pv = pVals[pvIdx];
    var targetVCol = mapAdminColToRepCol(pv.getSourceDataColumn(), adminColMap, repColMap, tabName, adminHeaders, repHeaders);
    var fn = typeof pv.getSummarizedBy === 'function' ? pv.getSummarizedBy() : (SpreadsheetApp.PivotTableSummarizeFunction ? SpreadsheetApp.PivotTableSummarizeFunction.SUM : 'SUM');
    var newPv = newPt.addPivotValue(targetVCol, fn);
    try { var dn = typeof pv.getDisplayName === 'function' ? pv.getDisplayName() : ''; if (dn) newPv.setDisplayName(dn); } catch (e7) {}
    try {
      if (typeof pv.getDisplayType === 'function' && typeof newPv.showAs === 'function') {
        var dispType = pv.getDisplayType();
        if (dispType && String(dispType) !== 'DEFAULT') newPv.showAs(dispType);
      }
    } catch (e7b) {}
  }
  var pFilters = typeof pt.getFilters === 'function' ? pt.getFilters() : [];
  for (var pfIdx = 0; pfIdx < pFilters.length; pfIdx++) {
    var pf = pFilters[pfIdx];
    try {
      var targetFCol = mapAdminColToRepCol(pf.getSourceDataColumn(), adminColMap, repColMap, tabName, adminHeaders, repHeaders);
      var crit = typeof pf.getFilterCriteria === 'function' ? pf.getFilterCriteria() : null;
      if (crit) newPt.addFilter(targetFCol, crit);
    } catch (e8) {}
  }
  return newPt;
}

function ensureSheetMinRows(sheet, minRows) {
  var targetMin = minRows || 1000;
  var curMax = typeof sheet.getMaxRows === 'function' ? sheet.getMaxRows() : Math.max(sheet.getLastRow() + 50, targetMin);
  if (typeof sheet.getMaxRows === 'function' && curMax < targetMin && typeof sheet.insertRowsAfter === 'function' && curMax > 0) {
    try {
      sheet.insertRowsAfter(curMax, targetMin - curMax);
      curMax = sheet.getMaxRows();
    } catch (e) {}
  }
  return Math.max(1, curMax);
}

function fixAdminAreaPivotIfNeeded(adminSs, adminDataSheet) {
  if (!adminSs || !adminDataSheet) return;
  var sheets = adminSs.getSheets();
  var adminHeaders = adminDataSheet.getLastRow() > 0 ? adminDataSheet.getRange(1, 1, 1, Math.max(16, adminDataSheet.getLastColumn())).getValues()[0] : getExpectedCols(adminDataSheet);
  var colMap = resolveColMap(adminHeaders);
  var maxRows = ensureSheetMinRows(adminDataSheet, 1000);
  var srcRange = adminDataSheet.getRange(1, 1, maxRows, adminHeaders.length);
  for (var i = 0; i < sheets.length; i++) {
    var tab = sheets[i];
    if (normAr(tab.getName()).indexOf('منطق') === -1) continue;
    var pts = typeof tab.getPivotTables === 'function' ? tab.getPivotTables() : [];
    if (pts.length === 0) continue;
    var pt0 = pts[0];
    var rGroups = typeof pt0.getRowGroups === 'function' ? pt0.getRowGroups() : [];
    if (rGroups.length > 0 && colMap.area >= 0 && rGroups[0].getSourceDataColumn() !== colMap.area + 1) {
      var anchorA1 = 'A1';
      try { anchorA1 = pt0.getAnchorCell().getA1Notation(); } catch (e) {}
      var colGroups = typeof pt0.getColumnGroups === 'function' ? pt0.getColumnGroups() : [];
      var vals = typeof pt0.getPivotValues === 'function' ? pt0.getPivotValues() : [];
      var filts = typeof pt0.getFilters === 'function' ? pt0.getFilters() : [];
      var snapRg = [];
      for (var ri = 0; ri < rGroups.length; ri++) {
        snapRg.push({
          col: mapAdminColToRepCol(rGroups[ri].getSourceDataColumn(), colMap, colMap, tab.getName()),
          totals: typeof rGroups[ri].totalsAreShown === 'function' ? rGroups[ri].totalsAreShown() : true,
          repeat: typeof rGroups[ri].areLabelsRepeated === 'function' ? rGroups[ri].areLabelsRepeated() : false,
          sortAsc: typeof rGroups[ri].isSortAscending === 'function' ? rGroups[ri].isSortAscending() : null
        });
      }
      var snapCg = [];
      for (var ci = 0; ci < colGroups.length; ci++) {
        snapCg.push({
          col: mapAdminColToRepCol(colGroups[ci].getSourceDataColumn(), colMap, colMap, tab.getName()),
          totals: typeof colGroups[ci].totalsAreShown === 'function' ? colGroups[ci].totalsAreShown() : true
        });
      }
      var snapVal = [];
      for (var vi = 0; vi < vals.length; vi++) {
        snapVal.push({ col: mapAdminColToRepCol(vals[vi].getSourceDataColumn(), colMap, colMap, tab.getName()), fn: typeof vals[vi].getSummarizedBy === 'function' ? vals[vi].getSummarizedBy() : 'SUM', dn: typeof vals[vi].getDisplayName === 'function' ? vals[vi].getDisplayName() : '' });
      }
      var snapFilt = [];
      for (var fi = 0; fi < filts.length; fi++) {
        try {
          var critF = typeof filts[fi].getFilterCriteria === 'function' ? filts[fi].getFilterCriteria() : null;
          if (critF) snapFilt.push({ col: mapAdminColToRepCol(filts[fi].getSourceDataColumn(), colMap, colMap, tab.getName()), crit: critF });
        } catch (fe) {}
      }
      tab.clear();
      var rebuilt = tab.getRange(anchorA1).createPivotTable(srcRange);
      for (var si = 0; si < snapRg.length; si++) {
        var ng = rebuilt.addRowGroup(snapRg[si].col);
        try { ng.showTotals(snapRg[si].totals); } catch (e1) {}
        try { if (snapRg[si].repeat) ng.showRepeatedLabels(); } catch (e1b) {}
        try { if (snapRg[si].sortAsc === true) ng.sortAscending(); else if (snapRg[si].sortAsc === false) ng.sortDescending(); } catch (e1c) {}
      }
      for (var sc = 0; sc < snapCg.length; sc++) {
        var nc = rebuilt.addColumnGroup(snapCg[sc].col);
        try { nc.showTotals(snapCg[sc].totals); } catch (e1d) {}
      }
      for (var sv = 0; sv < snapVal.length; sv++) {
        var nv = rebuilt.addPivotValue(snapVal[sv].col, snapVal[sv].fn);
        try { if (snapVal[sv].dn) nv.setDisplayName(snapVal[sv].dn); } catch (e2) {}
      }
      for (var sf = 0; sf < snapFilt.length; sf++) {
        try { rebuilt.addFilter(snapFilt[sf].col, snapFilt[sf].crit); } catch (e3) {}
      }
      try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (e4) {}
    }
  }
}

function cloneAdminTabsAndPivotsToTarget(targetSpreadsheetId, options) {
  if (TEMPLATE_SYNC_GUARD) return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'sync_guard_active' };
  TEMPLATE_SYNC_GUARD = true;
  var tabsOnly = Boolean(options && options.tabsOnly);
  try {
    var adminSs = getTargetSpreadsheet(SPREADSHEET_ID);
    var targetId = extractSheetIdFromUrl(targetSpreadsheetId) || String(targetSpreadsheetId || '').trim();
    if (!adminSs || !targetId || targetId === ADMIN_USERS_SHEET_ID) {
      return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'invalid_target_or_admin' };
    }
    var adminDataSheet = findInvoiceDataSheet(adminSs);
    if (!adminDataSheet) return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'no_admin_data_sheet' };

    setupSheet(adminDataSheet);
    try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (fAdm) {}
    fixAdminAreaPivotIfNeeded(adminSs, adminDataSheet);

    if (targetId === SPREADSHEET_ID) {
      return { synced: true, sheetName: adminSs.getName ? adminSs.getName() : '', tabsCount: adminSs.getSheets().length, pivotsCount: 0, tabNames: [], errorDetails: '' };
    }

    var targetSs = null;
    try { targetSs = SpreadsheetApp.openById(targetId); } catch (openErr) {
      return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'تعذر فتح الشيت (تأكد من صلاحيات المشاركة): ' + String(openErr) };
    }
    if (!targetSs) {
      return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'null_target_spreadsheet' };
    }
    var targetSheetTitle = '';
    try { targetSheetTitle = typeof targetSs.getName === 'function' ? targetSs.getName() : ''; } catch (nErr) {}

    var repFirst = targetSs.getSheets()[0];
    if (repFirst && isUsersSheetObj(repFirst)) {
      return { synced: false, sheetName: targetSheetTitle, tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'target_is_master_users_sheet' };
    }

    var targetDataSheet = findInvoiceDataSheet(targetSs);
    try {
      if (!targetDataSheet) targetDataSheet = targetSs.insertSheet('الفواتير');
      setupSheet(targetDataSheet);
    } catch (permErr) {
      return {
        synced: false,
        sheetName: targetSheetTitle,
        tabsCount: 0,
        pivotsCount: 0,
        tabNames: [],
        errorDetails: 'لا توجد صلاحية تعديل (Editor) على شيت المندوب — شاركه مع حساب باقر كـ Editor: ' + String(permErr)
      };
    }

    var adminHeaders = getExpectedCols(adminDataSheet);
    var repHeaders = getExpectedCols(targetDataSheet);
    if (adminHeaders.length > repHeaders.length) {
      for (var eh = repHeaders.length; eh < adminHeaders.length; eh++) {
        repHeaders.push(adminHeaders[eh]);
        targetDataSheet.getRange(1, eh + 1).setValue(adminHeaders[eh]).setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
      }
    }
    try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (fRep1) {}

    var adminColMap = resolveColMap(adminHeaders);
    var repColMap = resolveColMap(repHeaders);
    var repMaxRows = ensureSheetMinRows(targetDataSheet, Math.max(targetDataSheet.getLastRow() + 200, 1000));
    var repSourceRange = targetDataSheet.getRange(1, 1, repMaxRows, repHeaders.length);

    var adminDataName = adminDataSheet.getName();
    var repDataName = targetDataSheet.getName();
    var adminSheets = adminSs.getSheets();
    var tabsCount = 0;
    var pivotsCount = 0;
    var tabNames = [];
    var tabErrors = [];

    for (var sIdx = 0; sIdx < adminSheets.length; sIdx++) {
      var s = adminSheets[sIdx];
      var sName = String(s.getName() || '').trim();
      if (sName === adminDataName || isUsersSheetObj(s)) continue;

      try {
        var targetTab = targetSs.getSheetByName(sName) || targetSs.insertSheet(sName);
        try { targetTab.setRightToLeft(true); } catch (rtlErr) {}
        try { var tc = typeof s.getTabColor === 'function' ? s.getTabColor() : null; if (tc) targetTab.setTabColor(tc); } catch (tcErr) {}

        var existingOldPts = typeof targetTab.getPivotTables === 'function' ? targetTab.getPivotTables() : [];
        for (var op = existingOldPts.length - 1; op >= 0; op--) {
          try { if (typeof existingOldPts[op].remove === 'function') existingOldPts[op].remove(); } catch (rmErr) {}
        }
        targetTab.clear();

        var adminPts = typeof s.getPivotTables === 'function' ? s.getPivotTables() : [];
        if (adminPts.length > 0 && !tabsOnly) {
          for (var ptIdx = 0; ptIdx < adminPts.length; ptIdx++) {
            copySinglePivotTable(adminPts[ptIdx], targetTab, repSourceRange, adminColMap, repColMap, sName, adminHeaders, repHeaders);
            pivotsCount++;
            try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (fPt) {}
          }
        } else {
          var lr = s.getLastRow();
          var lc = s.getLastColumn();
          if (lr > 0 && lc > 0) {
            var srcRng = s.getRange(1, 1, lr, lc);
            var vals = srcRng.getValues();
            var forms = typeof srcRng.getFormulas === 'function' ? srcRng.getFormulas() : [];
            var destRng = targetTab.getRange(1, 1, lr, lc);
            var mergedOut = [];
            var escAdmin = adminDataName.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
            var refRegex = new RegExp("('?" + escAdmin + "'?)!", 'g');
            for (var rr = 0; rr < lr; rr++) {
              var lineOut = [];
              for (var cc = 0; cc < lc; cc++) {
                var f = (forms[rr] && forms[rr][cc]) ? String(forms[rr][cc]) : '';
                if (f && f.charAt(0) === '=') {
                  lineOut.push(f.replace(refRegex, "'" + repDataName + "'!"));
                } else {
                  lineOut.push(vals[rr][cc]);
                }
              }
              mergedOut.push(lineOut);
            }
            destRng.setValues(mergedOut);
            try { targetTab.autoResizeColumns(1, lc); } catch (rcErr) {}
          }
        }
        tabNames.push(sName);
        tabsCount++;
      } catch (tabErr) {
        tabErrors.push(sName + ': ' + String(tabErr));
      }
    }
    try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (fEnd) {}
    return {
      synced: tabsCount > 0 || tabErrors.length === 0,
      sheetName: targetSheetTitle,
      tabsCount: tabsCount,
      pivotsCount: pivotsCount,
      tabNames: tabNames,
      errorDetails: tabErrors.join(' | ')
    };
  } catch (outerErr) {
    return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: String(outerErr) };
  } finally {
    TEMPLATE_SYNC_GUARD = false;
  }
}

function groupSheetRowsSafe(data, colMap) {
  var bucketMap = {};
  var bucketOrder = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var invNum = String(row[colMap.invoice_number] || '').trim();
    var dt = formatYmd(row[colMap.invoice_date]);
    var ph = normPh(row[colMap.pharmacy_name]);
    var prod = normProd(row[colMap.product_name]);
    var qty = Math.round(Number(row[colMap.quantity] || 0));
    var ts = String(row[colMap.timestamp] || '').trim();
    if (!ph && !prod && !invNum) continue;
    var bKey = (invNum || ph) + '::' + dt + '::' + ts;
    if (!bucketMap[bKey]) { bucketMap[bKey] = []; bucketOrder.push(bKey); }
    bucketMap[bKey].push({ sheetRow: i + 1, row: row, ph: ph, dt: dt, invNum: invNum, ts: ts, pKey: prod + ':' + qty });
  }

  var groups = [];
  for (var b = 0; b < bucketOrder.length; b++) {
    var entries = bucketMap[bucketOrder[b]];
    var block = [];
    var seen = {};
    for (var e = 0; e < entries.length; e++) {
      var ent = entries[e];
      if (ent.pKey && ent.pKey !== ':0' && seen[ent.pKey] && block.length > 0) {
        groups.push(block);
        block = [];
        seen = {};
      }
      block.push(ent);
      if (ent.pKey && ent.pKey !== ':0') seen[ent.pKey] = true;
    }
    if (block.length > 0) groups.push(block);
  }
  return groups;
}

function buildGroupSignatureSafe(block) {
  if (!block || block.length === 0) return '';
  var first = block[0];
  if (!first.ph || !first.dt) return '';
  var items = [];
  for (var i = 0; i < block.length; i++) {
    if (block[i].pKey && block[i].pKey !== ':0') items.push(block[i].pKey);
  }
  if (items.length === 0) return '';
  items.sort();
  return first.ph + '||' + first.dt + '||' + items.length + '||' + items.join('|');
}

function highlightDuplicatesInSheet(sheet) {
  if (!sheet) sheet = getTargetSheet();
  if (!sheet || isUsersSheetObj(sheet)) return;
  var lastRow = sheet.getLastRow();
  var totalCols = Math.max(16, sheet.getLastColumn());
  if (lastRow <= 1) return;
  var headers = sheet.getRange(1, 1, 1, totalCols).getValues()[0];
  var colMap = resolveColMap(headers);
  var data = sheet.getRange(1, 1, lastRow, totalCols).getValues();
  var groups = groupSheetRowsSafe(data, colMap);

  var bySignature = {};
  for (var g = 0; g < groups.length; g++) {
    var grp = groups[g];
    var sig = buildGroupSignatureSafe(grp);
    if (!sig) continue;
    if (!bySignature[sig]) bySignature[sig] = [];
    bySignature[sig].push(grp);
  }
  var dupRowMap = {};
  for (var sigKey in bySignature) {
    if (bySignature[sigKey].length > 1) {
      var copies = bySignature[sigKey];
      for (var c = 0; c < copies.length; c++) {
        for (var rIdx = 0; rIdx < copies[c].length; rIdx++) {
          dupRowMap[copies[c][rIdx].sheetRow] = true;
        }
      }
    }
  }
  for (var sheetRow = 2; sheetRow <= lastRow; sheetRow++) {
    var rng = sheet.getRange(sheetRow, 1, 1, totalCols);
    rng.setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
    if (dupRowMap[sheetRow]) rng.setBackground('#fee2e2').setFontColor('#991b1b');
    else rng.setBackground('#ffffff').setFontColor('#0f172a');
  }
}

function deleteMatchingInvoiceRows(sheet, targetInvNum, deleteMode, targetPh, targetDate, targetTs) {
  var headers = sheet.getRange(1, 1, 1, Math.max(16, sheet.getLastColumn())).getValues()[0];
  var colMap = resolveColMap(headers);
  var cleanTarget = String(targetInvNum || '').trim();
  var cleanPh = normPh(targetPh || '');
  var cleanDate = formatYmd(targetDate || '');
  var data = sheet.getDataRange().getValues();
  var deleted = 0;

  if (deleteMode === 'duplicate_copy') {
    var allGroups = groupSheetRowsSafe(data, colMap);
    var matchingGroups = [];
    for (var g = 0; g < allGroups.length; g++) {
      var grp = allGroups[g];
      var gFirst = grp[0];
      var isMatch = false;
      if (cleanTarget && gFirst.invNum === cleanTarget) isMatch = true;
      else if (cleanPh && cleanDate && gFirst.ph === cleanPh && gFirst.dt === cleanDate) isMatch = true;
      if (isMatch) matchingGroups.push(grp);
    }

    if (matchingGroups.length <= 1) {
      return 0;
    }

    var chosenGroup = matchingGroups[matchingGroups.length - 1];
    if (targetTs) {
      for (var k = 1; k < matchingGroups.length; k++) {
        if (matchingGroups[k][0].ts === String(targetTs).trim()) {
          chosenGroup = matchingGroups[k];
          break;
        }
      }
    }

    var rowsToDelete = [];
    for (var ri = 0; ri < chosenGroup.length; ri++) {
      rowsToDelete.push(chosenGroup[ri].sheetRow);
    }
    rowsToDelete.sort(function(a, b) { return b - a; });
    for (var d = 0; d < rowsToDelete.length; d++) {
      sheet.deleteRow(rowsToDelete[d]);
      deleted++;
    }
    return deleted;
  }

  for (var i = data.length - 1; i >= 1; i--) {
    var rNum = String(data[i][colMap.invoice_number] || '').trim();
    var matchRow = false;
    if (cleanTarget && rNum === cleanTarget) matchRow = true;
    else if (!cleanTarget && cleanPh && cleanDate && normPh(data[i][colMap.pharmacy_name]) === cleanPh && formatYmd(data[i][colMap.invoice_date]) === cleanDate) matchRow = true;
    if (!matchRow) continue;
    sheet.deleteRow(i + 1);
    deleted++;
  }
  return deleted;
}

function findUserRowIndex(data, uMap, targetRowNum, targetName, targetEmail) {
  var cleanTargetName = normAr(targetName || '');
  var cleanTargetEmail = String(targetEmail || '').trim().toLowerCase();
  var rn = Number(targetRowNum || 0);
  if (rn >= 2 && rn <= data.length) {
    var rowAtIdx = data[rn - 1];
    var rName = normAr(rowAtIdx[uMap.nameCol]);
    var rEmail = uMap.emailCol >= 0 ? String(rowAtIdx[uMap.emailCol] || '').trim().toLowerCase() : '';
    if ((!cleanTargetName && !cleanTargetEmail) || (cleanTargetName && rName === cleanTargetName) || (cleanTargetEmail && rEmail === cleanTargetEmail)) {
      return rn;
    }
  }
  for (var i = 1; i < data.length; i++) {
    var nm = normAr(data[i][uMap.nameCol]);
    var em = uMap.emailCol >= 0 ? String(data[i][uMap.emailCol] || '').trim().toLowerCase() : '';
    if (cleanTargetName && nm === cleanTargetName) return i + 1;
    if (cleanTargetEmail && em === cleanTargetEmail) return i + 1;
  }
  return -1;
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'لا توجد بيانات مرفقة بالطلب' })).setMimeType(ContentService.MimeType.JSON);
    }

    var payload = JSON.parse(e.postData.contents);
    var actionName = String(payload.action || '').trim();

    if (actionName === 'register_user' || actionName === 'add_user' || actionName === 'upsert_user' || actionName === 'seed_users') {
      var usersSheet = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheet) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي للمستخدمين' })).setMimeType(ContentService.MimeType.JSON);
      }
      var ensureGemColIdx = ensureMasterGeminiColumn(usersSheet);
      var headersU = usersSheet.getRange(1, 1, 1, Math.max(5, usersSheet.getLastColumn())).getValues()[0];
      var uMap = resolveUserColMap(headersU);
      if (uMap.geminiCol < 0) uMap.geminiCol = ensureGemColIdx;
      var incomingUsers = payload.users || (payload.user ? [payload.user] : []);
      var currentUsers = readAllSheetUsers(usersSheet);
      var existingSharedGem = '';
      for (var sg = 0; sg < currentUsers.length; sg++) {
        if (currentUsers[sg].gemini_api_key) { existingSharedGem = currentUsers[sg].gemini_api_key; break; }
      }
      var inserted = 0;
      for (var ui = 0; ui < incomingUsers.length; ui++) {
        var u = incomingUsers[ui];
        var uName = String(u.full_name || u.name || '').trim();
        var uEmail = String(u.email || '').trim().toLowerCase();
        var uPass = String(u.password_hash || u.password || '').trim();
        if (!uName && !uEmail) continue;
        var dupUser = false;
        for (var exi = 0; exi < currentUsers.length; exi++) {
          if ((uName && normAr(currentUsers[exi].full_name) === normAr(uName)) || (uEmail && currentUsers[exi].email === uEmail)) {
            dupUser = true;
            break;
          }
        }
        if (dupUser) {
          if (actionName === 'register_user' || actionName === 'add_user') {
            return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'هذا الاسم مسجل مسبقاً في الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
          }
          continue;
        }
        var totalUCols = Math.max(5, headersU.length);
        var uRow = [];
        for (var k = 0; k < totalUCols; k++) uRow.push('');
        uRow[uMap.nameCol] = uName || uEmail.split('@')[0];
        uRow[uMap.passCol] = /^[1-9]\\d*$/.test(uPass) ? Number(uPass) : uPass;
        uRow[uMap.sheetCol] = String(u.sheet_url || u.sheet_id || '').trim();
        uRow[uMap.webhookCol] = String(u.webhook_url || '').trim();
        if (uMap.idCol >= 0) uRow[uMap.idCol] = u.id || ('usr-' + new Date().getTime() + '-' + ui);
        if (uMap.emailCol >= 0) uRow[uMap.emailCol] = uEmail;
        if (uMap.roleCol >= 0) uRow[uMap.roleCol] = isBaqerName(uName, uEmail) ? 'admin' : 'medical_rep';
        if (uMap.activeCol >= 0) uRow[uMap.activeCol] = 'TRUE';
        if (uMap.geminiCol >= 0) uRow[uMap.geminiCol] = String(u.gemini_api_key || existingSharedGem || '').trim();

        var newRowIndex = usersSheet.getLastRow() + 1;
        usersSheet.getRange(newRowIndex, 1, 1, totalUCols).setValues([uRow]);
        if (!/^[1-9]\\d*$/.test(uPass)) {
          try { usersSheet.getRange(newRowIndex, uMap.passCol + 1).setNumberFormat('@').setValue(uPass); } catch (nfErr) {}
        }
        var newUserSheetId = extractSheetIdFromUrl(u.sheet_url || u.sheet_id);
        if (newUserSheetId) {
          try { cloneAdminTabsAndPivotsToTarget(newUserSheetId); } catch (tErr) {}
        }
        currentUsers.push({ full_name: uName, email: uEmail });
        inserted++;
      }
      try { usersSheet.autoResizeColumns(1, Math.max(5, headersU.length)); } catch (ue) {}
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        inserted: inserted,
        message: 'تم حفظ المستخدم وتجهيز شيته بنفس أوراق الأدمن في الشيت الرئيسي بنجاح.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'set_shared_gemini_key') {
      var usersSheetGem = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetGem) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      var gemKeyVal = String(payload.gemini_api_key || payload.geminiApiKey || '').trim();
      var targetGemCol = ensureMasterGeminiColumn(usersSheetGem);
      propagateGeminiKeyToAllUserRows(usersSheetGem, targetGemCol, gemKeyVal);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        gemini_api_key: gemKeyVal,
        message: 'تم تحديث مفتاح Gemini في العمود E وتعميمه لجميع المستخدمين في الشيت الرئيسي بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'unify_admin_webhook') {
      var usersSheetUni = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetUni) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      ensureMasterGeminiColumn(usersSheetUni);
      var headersUni = usersSheetUni.getRange(1, 1, 1, Math.max(5, usersSheetUni.getLastColumn())).getValues()[0];
      var uMapUni = resolveUserColMap(headersUni);
      var centralUrl = String(payload.centralWebhookUrl || payload.webhookUrl || '').trim();
      var clearNonAdmin = String(payload.mode || '') === 'clear';
      var lastRowUni = usersSheetUni.getLastRow();
      var updatedUni = 0;
      for (var ur = 2; ur <= lastRowUni; ur++) {
        var rNameU = String(usersSheetUni.getRange(ur, uMapUni.nameCol + 1).getValue() || '').trim();
        if (!rNameU) continue;
        var valToWrite = clearNonAdmin && !isBaqerName(rNameU, '') ? '' : centralUrl;
        usersSheetUni.getRange(ur, uMapUni.webhookCol + 1).setValue(valToWrite);
        updatedUni++;
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        updated: updatedUni,
        message: 'تم توحيد رابط السكربت المركزي لـ ' + updatedUni + ' حساب في الشيت الرئيسي بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'sync_template_to_all' || actionName === 'sync_tabs_only') {
      var tabsOnlyMode = actionName === 'sync_tabs_only' || payload.mode === 'tabs_only';
      var adminSsMain = getTargetSpreadsheet(SPREADSHEET_ID);
      var adminDataOnly = findInvoiceDataSheet(adminSsMain);
      if (adminDataOnly) {
        setupSheet(adminDataOnly);
        try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (flA) {}
        fixAdminAreaPivotIfNeeded(adminSsMain, adminDataOnly);
      }
      var targetIds = [];
      if (payload.targetSpreadsheetId) {
        var singleTId = extractSheetIdFromUrl(payload.targetSpreadsheetId);
        if (singleTId) targetIds.push(singleTId);
      } else {
        var usersSheetTpl = getOrCreateUsersSheet(payload.adminSpreadsheetId || ADMIN_USERS_SHEET_ID);
        var uListTpl = readAllSheetUsers(usersSheetTpl);
        for (var ui2 = 0; ui2 < uListTpl.length; ui2++) {
          var sidRep = extractSheetIdFromUrl(uListTpl[ui2].sheet_id);
          if (sidRep && sidRep !== SPREADSHEET_ID && targetIds.indexOf(sidRep) === -1) {
            targetIds.push(sidRep);
          }
        }
        if (Array.isArray(payload.targetIds)) {
          for (var ti = 0; ti < payload.targetIds.length; ti++) {
            var extraSid = extractSheetIdFromUrl(payload.targetIds[ti]);
            if (extraSid && extraSid !== SPREADSHEET_ID && targetIds.indexOf(extraSid) === -1) {
              targetIds.push(extraSid);
            }
          }
        }
      }
      var syncResults = [];
      var syncedCount = 0;
      for (var sLoop = 0; sLoop < targetIds.length; sLoop++) {
        var curSid = targetIds[sLoop];
        try {
          var resClone = cloneAdminTabsAndPivotsToTarget(curSid, { tabsOnly: tabsOnlyMode });
          if (resClone.synced) syncedCount++;
          syncResults.push({
            sheetId: curSid,
            sheetName: resClone.sheetName || '',
            ok: resClone.synced,
            tabsCount: resClone.tabsCount,
            pivotsCount: resClone.pivotsCount,
            tabNames: resClone.tabNames || [],
            errorDetails: resClone.errorDetails || ''
          });
        } catch (repErr) {
          syncResults.push({ sheetId: curSid, sheetName: '', ok: false, tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: String(repErr) });
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        tabsOnly: tabsOnlyMode,
        updatedSheets: syncedCount,
        totalTargets: targetIds.length,
        results: syncResults,
        message: 'تمت مزامنة أوراق و Pivot Tables الأدمن مع (' + syncedCount + ' / ' + targetIds.length + ') شيتات بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'update_user') {
      var usersSheetUpd = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetUpd) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      var ensuredUpdGemCol = ensureMasterGeminiColumn(usersSheetUpd);
      var dataUpd = usersSheetUpd.getDataRange().getValues();
      var headersUpd = dataUpd[0] || [];
      var uMapUpd = resolveUserColMap(headersUpd);
      if (uMapUpd.geminiCol < 0) uMapUpd.geminiCol = ensuredUpdGemCol;
      var targetRow = findUserRowIndex(dataUpd, uMapUpd, payload.rowNumber, payload.currentName || payload.username, payload.email);
      if (targetRow === -1) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, script_version: SCRIPT_VERSION, error: 'المستخدم غير موجود في الشيت الرئيسي.' })).setMimeType(ContentService.MimeType.JSON);
      }
      var newName = String(payload.newName || '').trim();
      if (newName) {
        for (var ci = 1; ci < dataUpd.length; ci++) {
          if (ci + 1 !== targetRow && normAr(dataUpd[ci][uMapUpd.nameCol]) === normAr(newName)) {
            return ContentService.createTextOutput(JSON.stringify({ success: false, script_version: SCRIPT_VERSION, error: 'الاسم الجديد مسجل مسبقاً لمستخدم آخر.' })).setMimeType(ContentService.MimeType.JSON);
          }
        }
        usersSheetUpd.getRange(targetRow, uMapUpd.nameCol + 1).setValue(newName);
      }
      if (payload.newPassword !== undefined && String(payload.newPassword).trim() !== '') {
        var np = String(payload.newPassword).trim();
        var passCell = usersSheetUpd.getRange(targetRow, uMapUpd.passCol + 1);
        if (/^[1-9]\\d*$/.test(np)) {
          passCell.setNumberFormat('0').setValue(Number(np));
        } else {
          passCell.setNumberFormat('@').setValue(np);
        }
      }
      if (payload.newSheetUrl !== undefined) {
        var cleanUrlStr = String(payload.newSheetUrl).trim();
        usersSheetUpd.getRange(targetRow, uMapUpd.sheetCol + 1).setValue(cleanUrlStr);
        var updatedSid = extractSheetIdFromUrl(cleanUrlStr);
        if (updatedSid && updatedSid !== SPREADSHEET_ID) {
          try { cloneAdminTabsAndPivotsToTarget(updatedSid); } catch (uSyncErr) {}
        }
      }
      if (payload.newWebhookUrl !== undefined) {
        usersSheetUpd.getRange(targetRow, uMapUpd.webhookCol + 1).setValue(String(payload.newWebhookUrl).trim());
      }
      if (payload.newGeminiApiKey !== undefined && uMapUpd.geminiCol >= 0) {
        usersSheetUpd.getRange(targetRow, uMapUpd.geminiCol + 1).setValue(String(payload.newGeminiApiKey).trim());
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        rowNumber: targetRow,
        message: 'تم تعديل البيانات وحفظها في الشيت الرئيسي بنجاح.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'delete_user') {
      var usersSheetDel = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetDel) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      var dataDel = usersSheetDel.getDataRange().getValues();
      var uMapDel = resolveUserColMap(dataDel[0] || []);
      var delRow = findUserRowIndex(dataDel, uMapDel, payload.rowNumber, payload.currentName || payload.username, payload.email);
      if (delRow === -1) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, script_version: SCRIPT_VERSION, error: 'المستخدم غير موجود.' })).setMimeType(ContentService.MimeType.JSON);
      }
      usersSheetDel.deleteRow(delRow);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        message: 'تم حذف المستخدم من الشيت الرئيسي بنجاح.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getTargetSheet(payload.spreadsheetId, payload.sheetName || 'الفواتير');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح ورقة الفواتير في كوكل شيت' })).setMimeType(ContentService.MimeType.JSON);
    }
    setupSheet(sheet);

    if (actionName === 'repair' || actionName === 'setup') {
      highlightDuplicatesInSheet(sheet);
      var targetForSync = extractSheetIdFromUrl(payload.spreadsheetId) || SPREADSHEET_ID;
      var syncTplRes = { synced: false, tabsCount: 0, pivotsCount: 0 };
      try { syncTplRes = cloneAdminTabsAndPivotsToTarget(targetForSync); } catch (reSyncErr) {}
      try { sheet.autoResizeColumns(1, Math.max(16, sheet.getLastColumn())); } catch (errR) {}
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        templateSynced: syncTplRes.synced,
        tabsCount: syncTplRes.tabsCount,
        pivotsCount: syncTplRes.pivotsCount,
        message: 'تم توحيد الأعمدة (المنطقة قبل المدينة) واستنساخ أوراق الأدمن و Pivot Tables بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'delete_invoice') {
      var delInv = payload.invoice_number || (payload.row && payload.row.invoice_number);
      var delCount = deleteMatchingInvoiceRows(sheet, delInv, payload.delete_mode, payload.pharmacy_name, payload.invoice_date, payload.timestamp);
      highlightDuplicatesInSheet(sheet);
      return ContentService.createTextOutput(JSON.stringify({ success: true, script_version: SCRIPT_VERSION, deleted: delCount, message: 'تم حذف ' + delCount + ' سطر من كوكل شيت وإعادة ضبط الألوان' })).setMimeType(ContentService.MimeType.JSON);
    }

    var headers = getExpectedCols(sheet);
    var totalCols = headers.length;
    var colMap = resolveColMap(headers);
    var rows = payload.rows || [];
    var data = sheet.getDataRange().getValues();
    var addedCount = 0;
    var updatedCount = 0;

    if (actionName === 'edit_invoice' || actionName === 'replace_invoice') {
      var matchNums = {};
      if (payload.previous_invoice_number) matchNums[String(payload.previous_invoice_number).trim()] = true;
      if (payload.invoice_number) matchNums[String(payload.invoice_number).trim()] = true;
      var existingIndices = [];
      for (var m = 1; m < data.length; m++) {
        var rNum = String(data[m][colMap.invoice_number] || '').trim();
        if (rNum && matchNums[rNum]) existingIndices.push(m + 1);
      }
      if (existingIndices.length === 0 && payload.pharmacy_name && payload.invoice_date) {
        var targetPhN = normPh(payload.pharmacy_name);
        var targetDtY = formatYmd(payload.invoice_date);
        for (var m2 = 1; m2 < data.length; m2++) {
          if (normPh(data[m2][colMap.pharmacy_name]) === targetPhN && formatYmd(data[m2][colMap.invoice_date]) === targetDtY) existingIndices.push(m2 + 1);
        }
      }
      var validEditRows = [];
      for (var vr = 0; vr < rows.length; vr++) {
        if (String(rows[vr].invoice_number || '').trim() !== '123') validEditRows.push(rows[vr]);
      }
      if (existingIndices.length === 0) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true, script_version: SCRIPT_VERSION, added: 0, updated: 0,
          message: 'وضع التعديل: لم يتم إنشاء صف جديد لعدم العثور على الصف الأصلي في الشيت.'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      var common = Math.min(existingIndices.length, validEditRows.length);
      for (var u = 0; u < common; u++) {
        var sheetRowNum = existingIndices[u];
        var newVals = buildRowValuesByHeaders(validEditRows[u], headers, data[sheetRowNum - 1]);
        sheet.getRange(sheetRowNum, 1, 1, totalCols).setValues([newVals]);
        updatedCount++;
      }
      if (validEditRows.length > existingIndices.length) {
        var insertAfter = existingIndices[existingIndices.length - 1];
        for (var a = common; a < validEditRows.length; a++) {
          var insVals = buildRowValuesByHeaders(validEditRows[a], headers, null);
          sheet.insertRowAfter(insertAfter);
          insertAfter++;
          sheet.getRange(insertAfter, 1, 1, totalCols).setValues([insVals]);
          addedCount++;
        }
      } else if (existingIndices.length > validEditRows.length) {
        for (var d = existingIndices.length - 1; d >= validEditRows.length; d--) sheet.deleteRow(existingIndices[d]);
      }
      highlightDuplicatesInSheet(sheet);
      try { sheet.autoResizeColumns(1, totalCols); } catch (re1) {}
      return ContentService.createTextOutput(JSON.stringify({
        success: true, script_version: SCRIPT_VERSION, added: addedCount, updated: updatedCount,
        message: 'تم تعديل الفاتورة في نفس الصف (' + updatedCount + ' تحديث، ' + addedCount + ' بند إضافي).'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName && !Array.isArray(payload.rows)) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        script_version: SCRIPT_VERSION,
        error: 'أمر غير مدعوم أو تنسيق طلب غير مكتمل: ' + actionName
      })).setMimeType(ContentService.MimeType.JSON);
    }

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var invNum = String(r.invoice_number || '').trim();
      var phN = normPh(r.pharmacy_name || '');
      if (invNum === '123' || (!invNum && !phN)) continue;
      var addVals = buildRowValuesByHeaders(r, headers, null);
      sheet.appendRow(addVals);
      addedCount++;
      data.push(addVals);
    }
    highlightDuplicatesInSheet(sheet);
    try { sheet.autoResizeColumns(1, totalCols); } catch (resizeErr) {}
    return ContentService.createTextOutput(JSON.stringify({
      success: true, script_version: SCRIPT_VERSION, added: addedCount, updated: updatedCount,
      message: 'تم إدراج ' + addedCount + ' سطراً جديداً بترتيب الأعمدة الموحّد بنجاح.'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function onEdit(e) {
  try {
    var activeSheet = (e && e.range && typeof e.range.getSheet === 'function') ? e.range.getSheet() : null;
    if (activeSheet && isUsersSheetObj(activeSheet)) {
      var lastC = Math.max(5, activeSheet.getLastColumn());
      var headersU = activeSheet.getRange(1, 1, 1, lastC).getValues()[0];
      var uMap = resolveUserColMap(headersU);
      var editedCol = (e && e.range && typeof e.range.getColumn === 'function') ? (e.range.getColumn() - 1) : -1;
      if (editedCol >= 4 && (uMap.geminiCol === editedCol || uMap.geminiCol < 0)) {
        var gCol = ensureMasterGeminiColumn(activeSheet, editedCol);
        var editedVal = String(e.range.getValue() || '').trim();
        if (editedVal && /^(AIza|AQ\\.)/.test(editedVal)) {
          propagateGeminiKeyToAllUserRows(activeSheet, gCol, editedVal);
        }
      }
      return;
    }
    var sheet = activeSheet || getTargetSheet();
    if (sheet && !isUsersSheetObj(sheet) && !sheetHasPivotTables(sheet)) {
      highlightDuplicatesInSheet(sheet);
    }
  } catch (err) {}
}

function doGet(e) {
  try {
    var action = e && e.parameter ? (e.parameter.action || e.parameter.sheet || '') : '';
    var customId = e && e.parameter ? (e.parameter.spreadsheetId || '') : '';

    if (action === 'users' || action === 'المستخدمون') {
      var uSheet = getOrCreateUsersSheet(e && e.parameter ? (e.parameter.adminSpreadsheetId || customId) : '');
      var uHeaders = uSheet && uSheet.getLastRow() > 0 ? uSheet.getRange(1, 1, 1, Math.max(4, uSheet.getLastColumn())).getValues()[0] : [];
      var uList = readAllSheetUsers(uSheet);
      return ContentService.createTextOutput(JSON.stringify({
        success: true, script_version: SCRIPT_VERSION, headers: uHeaders, users: uList
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getTargetSheet(customId, 'الفواتير');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ script_version: SCRIPT_VERSION, headers: [], rows: [] })).setMimeType(ContentService.MimeType.JSON);
    }
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ script_version: SCRIPT_VERSION, headers: data[0] || [], rows: [] })).setMimeType(ContentService.MimeType.JSON);
    }

    var headers = data[0];
    var colMap = resolveColMap(headers);
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var invNum = String(row[colMap.invoice_number] || '').trim();
      var phName = String(row[colMap.pharmacy_name] || '').trim();
      if (invNum === '123' || (!invNum && !phName && !row[colMap.product_name])) continue;

      var invDate = formatYmd(row[colMap.invoice_date]);
      var cells = [];
      for (var c = 0; c < headers.length; c++) {
        if (c === colMap.invoice_date) cells.push(invDate);
        else cells.push(row[c] !== undefined && row[c] !== null ? String(row[c]) : '');
      }

      var prNameGet = String(row[colMap.product_name] || '');
      rows.push({
        invoice_number: invNum,
        invoice_date:   invDate,
        warehouse_name: String(row[colMap.warehouse_name] || ''),
        pharmacy_name:  phName,
        area:           colMap.area >= 0 ? String(row[colMap.area] || '') : detectAreaFromPh(phName),
        city:           colMap.city >= 0 ? String(row[colMap.city] || 'بغداد') : 'بغداد',
        product_name:   prNameGet,
        dosage_form:    colMap.dosage_form >= 0 ? String(row[colMap.dosage_form] || '') : detectDosage(prNameGet),
        quantity:       Number(row[colMap.quantity] || 0),
        unit_price:     Number(row[colMap.unit_price] || 0),
        bonus_quantity: Number(row[colMap.bonus_quantity] || 0),
        line_total:     Number(row[colMap.line_total] || 0),
        total_invoice:  Number(row[colMap.total_invoice] || 0),
        rep_name:       String(row[colMap.rep_name] || ''),
        status:         String(row[colMap.status] || 'قيد التدقيق'),
        timestamp:      String(row[colMap.timestamp] || ''),
        loyalty:        colMap.loyalty >= 0 && colMap.loyalty < headers.length ? String(row[colMap.loyalty] || '') : '',
        cells:          cells
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      script_version: SCRIPT_VERSION,
      headers: headers,
      rows: rows
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function testRun() {
  var uSheet = getOrCreateUsersSheet(ADMIN_USERS_SHEET_ID);
  if (uSheet) ensureMasterGeminiColumn(uSheet);
  var adminSheet = getTargetSheet(SPREADSHEET_ID);
  if (adminSheet && !isUsersSheetObj(adminSheet)) {
    setupSheet(adminSheet);
    try { fixAdminAreaPivotIfNeeded(getTargetSpreadsheet(SPREADSHEET_ID), adminSheet); } catch (e) {}
  }
  Logger.log('تم التحقق من الجداول والترقية بنجاح (v' + SCRIPT_VERSION + ').');
}`;function A(e){return String(e||``).toLowerCase().replace(/[\u064B-\u0652\u0640]/g,``).replace(/[أإآ]/g,`ا`).replace(/ة/g,`ه`).replace(/ى/g,`ي`).replace(/\s+/g,` `).trim()}function oe(e){return A(e).replace(/^(صيدلية|صيدليه|مذخر|ص\.?)\s+/gi,``).trim()}function se(e){return A(e).replace(/[^a-z0-9\u0621-\u064a]/gi,``)}function ce(e){let t=String(e||``).trim();if(!t)return``;let n=t.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(n)return`${n[1]}-${n[2].padStart(2,`0`)}-${n[3].padStart(2,`0`)}`;let r=t.match(/^Date\((\d{4}),\s*(\d{1,2}),\s*(\d{1,2})/);if(r){let e=String(Number(r[2])+1).padStart(2,`0`);return`${r[1]}-${e}-${r[3].padStart(2,`0`)}`}let i=t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);if(i){let e=Number(i[1]),t=Number(i[2]),n=e>12?t:e,r=e>12?e:t;return`${i[3]}-${String(n).padStart(2,`0`)}-${String(r).padStart(2,`0`)}`}return t.split(`T`)[0]}function j(e){if(typeof e==`number`&&!isNaN(e))return e;let t=[`٠`,`١`,`٢`,`٣`,`٤`,`٥`,`٦`,`٧`,`٨`,`٩`],n=[`۰`,`۱`,`۲`,`۳`,`۴`,`۵`,`۶`,`۷`,`۸`,`۹`],r=String(e??``).replace(/[٠-٩]/g,e=>String(t.indexOf(e))).replace(/[۰-۹]/g,e=>String(n.indexOf(e))).replace(/,/g,``).replace(/[^\d.-]/g,``),i=Number(r);return isNaN(i)?0:i}function le(e){if(!Array.isArray(e)||e.length===0)return{count:0,signature:``};let t=e.map(e=>({name:se(e.product_name_snapshot||e.custom_product_name||e.product_name||e.name||``),qty:Math.round(j(e.sold_quantity??e.quantity??0))})).filter(e=>e.name.length>0).sort((e,t)=>e.name===t.name?e.qty-t.qty:e.name.localeCompare(t.name));if(t.length===0)return{count:0,signature:``};let n=`${t.length}::${t.map(e=>`${e.name}:${e.qty}`).join(`|`)}`;return{count:t.length,signature:n}}function ue(e){let t=new Map;e.forEach((e,n)=>{let r=String(e.invoice_number||``).trim(),i=oe(e.pharmacy_name||``),a=ce(e.invoice_date||``),o=String(e.timestamp||``).trim(),s=`${r||i}::${a}::${o}`;t.has(s)||t.set(s,[]),t.get(s).push({row:e,rowIndex:n})});let n=[];for(let[e,r]of t.entries()){let t=[],i=[],a=new Set;for(let e of r){let n=`${se(e.row.product_name||``)}:${Math.round(j(e.row.quantity||0))}`;n&&a.has(n)&&i.length>0&&(t.push(i),i=[],a=new Set),i.push(e),n&&a.add(n)}i.length>0&&t.push(i),t.forEach((r,i)=>{let a=r[0].row,o=fe({pharmacy_name:a.pharmacy_name,invoice_date:a.invoice_date,items:r.map(e=>({product_name:e.row.product_name,quantity:e.row.quantity}))});n.push({gKey:t.length>1?`${e}::copy-${i}`:e,invoice_number:String(a.invoice_number||``).trim(),invoice_date:ce(a.invoice_date||``),pharmacy_name:String(a.pharmacy_name||``).trim(),timestamp:String(a.timestamp||``).trim(),status:String(a.status||``).replace(` ✓`,``).trim(),compositeKey:o,items:r})})}return n}function de(e,t,n){if(!t||t.length===0)return{isDuplicate:!1,isExactMatch:!1,statusChangedOnly:!1,sheetCopiesCount:0,reason:``};let r=String(e?.invoice_number||``).trim(),i=fe({pharmacy_name:e?.pharmacy_name||``,invoice_date:e?.invoice_date||``,items:e?.items||[]});if(!i)return{isDuplicate:!1,isExactMatch:!1,statusChangedOnly:!1,sheetCopiesCount:0,reason:``};let a=e?.status===`approved`?`معتمدة`:e?.status===`rejected`?`مرفوضة`:`قيد التدقيق`,o=(n||ue(t)).filter(e=>e.compositeKey&&e.compositeKey===i);if(o.length===0)return{isDuplicate:!1,isExactMatch:!1,statusChangedOnly:!1,sheetCopiesCount:0,reason:``};let s=o.find(e=>!(r&&e.invoice_number===r&&e.status!==a));if(!s)return{isDuplicate:!1,isExactMatch:!0,statusChangedOnly:!0,sheetCopiesCount:o.length,reason:``};let c=ce(e?.invoice_date||``),l=(e?.items||[]).length;return{isDuplicate:!0,isExactMatch:!!(r&&s.invoice_number===r),statusChangedOnly:!1,sheetCopiesCount:o.length,reason:`نفس الفاتورة (${s.pharmacy_name||e?.pharmacy_name} / ${c} — ${l} أصناف وبنفس الكميات) موجودة مسبقاً${s.invoice_number?` برقم (${s.invoice_number})`:``}`}}function fe(e){let t=oe(e.pharmacy_name||``),n=ce(e.invoice_date||``),r=le(e.items);return!t||!n||r.count===0?``:`${t}||${n}||${r.signature}`}function pe(e){let t=new Map,n=[...e].sort((e,t)=>new Date(e.created_at||e.invoice_date).getTime()-new Date(t.created_at||t.invoice_date).getTime()),r=new Map;for(let e of n){let n=fe({pharmacy_name:e.pharmacy_name,invoice_date:e.invoice_date,items:e.items});n?(r.has(n)||r.set(n,[]),r.get(n).push(e)):t.set(e.id,{isDuplicate:!1,isOriginal:!1,duplicateCount:0,reason:``})}for(let e of r.values())e.length>1?e.forEach((n,r)=>{r===0?t.set(n.id,{isDuplicate:!0,isOriginal:!0,duplicateCount:e.length-1,reason:`يوجد ${e.length-1} نسخ متطابقة (نفس الصيدلية والتاريخ والمنتجات وعددها)`}):t.set(n.id,{isDuplicate:!0,isOriginal:!1,duplicateCount:e.length-1,matchedWithId:e[0].id,reason:`نسخة مكررة مطابقة تماماً للأصل (نفس الصيدلية والتاريخ والأصناف والكميات)`})}):t.set(e[0].id,{isDuplicate:!1,isOriginal:!1,duplicateCount:0,reason:``});return t}function me(e){let t=ue(e),n=new Map,r=new Set,i=[];for(let e of t)e.compositeKey&&(n.has(e.compositeKey)||n.set(e.compositeKey,[]),n.get(e.compositeKey).push(e));for(let e of n.values()){if(e.length<=1)continue;for(let t of e)for(let e of t.items)r.add(e.rowIndex);let t=e.slice(1);for(let e of t){let t=e.items[0].row,n=String(t.invoice_number||``).trim();i.push({key:e.gKey,invoice_number:n||`بدون رقم`,invoice_date:ce(t.invoice_date||``),pharmacy_name:String(t.pharmacy_name||``).trim(),timestamp:String(t.timestamp||``).trim(),rowsCount:e.items.length,totalAmount:e.items.reduce((e,t)=>e+j(t.row.line_total||0),0),productsSummary:e.items.map(e=>`${e.row.product_name||``} (${j(e.row.quantity||0)})`).join(`، `),rowIndices:e.items.map(e=>e.rowIndex)})}}return{duplicateGroups:i,duplicateRowIndices:r}}var M=`1_CBGFeFrTaw6L_7U1ztdAZ3gJjjVMEpUhE8oyUn-NjI`,he=`https://docs.google.com/spreadsheets/d/${M}/edit?usp=sharing`,ge=`1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE`,_e=`https://script.google.com/macros/s/AKfycbzCpY1P3iyWJrI2HFjTRvJjsObDMO1Gfpk82nrPuoee021RWKfl3jTfiRBW0bQtFz2I/exec`;function N(e){let t=[`٠`,`١`,`٢`,`٣`,`٤`,`٥`,`٦`,`٧`,`٨`,`٩`],n=[`۰`,`۱`,`۲`,`۳`,`۴`,`۵`,`۶`,`۷`,`۸`,`۹`];return String(e||``).replace(/[٠-٩]/g,e=>String(t.indexOf(e))).replace(/[۰-۹]/g,e=>String(n.indexOf(e)))}function P(e){return N(String(e||``)).toLowerCase().replace(/[\u064B-\u0652\u0640]/g,``).replace(/[أإآ]/g,`ا`).replace(/ة/g,`ه`).replace(/ى/g,`ي`).replace(/^(د\.|دكتور)\s+/i,``).replace(/\s+/g,` `).trim()}function ve(e,t){let n=P(e),r=String(t||``).trim().toLowerCase();return!!(n===`باقر`||n===`باقر علي`||n.startsWith(`باقر `)||n===`baqer`||n===`baqir`||r===`baqer@pharma.com`||r===`admin@pharma.com`)}function ye(e){let t=String(e||``).trim();if(!t)return``;let n=t.match(/\/d\/([a-zA-Z0-9-_]+)/);return n&&n[1]?n[1]:/^[a-zA-Z0-9-_]{20,}$/.test(t)?t:``}function be(e){return e?e.f!==void 0&&e.f!==null&&String(e.f).trim()!==``?String(e.f).trim():e.v!==void 0&&e.v!==null?typeof e.v==`number`?(Number.isInteger(e.v),String(e.v)):String(e.v).trim():``:``}function xe(e){let t=e.map(e=>P(e)),n=e=>t.findIndex(t=>t&&e.some(e=>t.includes(e))),r=t[0]===`id`||t[0]?.includes(`معرف`);if(t.some(e=>e.includes(`الاسم`))||t.some(e=>e.includes(`الرمز`))||t.some(e=>e.includes(`صفحه`))||t.some(e=>e.includes(`اي بي اي`))||!r){let e=n([`الاسم`,`full_name`,`name`]),t=n([`الرمز السري`,`كلمه المرور`,`الرمز`,`password`,`pin`]),r=n([`صفحه كوكل شيت`,`شيت`,`sheet`]),i=n([`اي بي اي سكربت`,`سكربت`,`webhook`,`script`]),a=n([`email`,`بريد`,`username`]),o=n([`^id$`,`المعرف`]),s=n([`role`,`دور`,`صلاحيه`]),c=n([`is_active`,`الحاله`]),l=n([`اي بي اي جمناي`,`مفتاح جمناي`,`جمناي`,`gemini`,`مفتاح`]);return{nameCol:e>=0?e:0,passCol:t>=0?t:1,sheetCol:r>=0?r:2,webhookCol:i>=0?i:3,emailCol:a,idCol:o,roleCol:s,activeCol:c,geminiCol:l}}return{idCol:0,nameCol:1,emailCol:2,passCol:3,roleCol:4,activeCol:5,geminiCol:6,sheetCol:7,webhookCol:8}}function F(e){let t=e?.table?.cols||[],n=e?.table?.rows||[];if(!Array.isArray(n)||n.length===0)return[];let r=t.map(e=>String(e?.label||``).trim()),i=Number(e?.table?.parsedNumHeaders||0),a=(n[0]?.c||[]).map(e=>be(e)),o=r.some(e=>{let t=P(e);return t.includes(`الاسم`)||t.includes(`الرمز`)||t===`id`||t===`full_name`||t===`email`}),s=r,c=0,l=i>0?i+1:2;!o&&a.some(Boolean)&&a.some(e=>{let t=P(e);return t.includes(`الاسم`)||t.includes(`الرمز`)||t===`id`||t===`full_name`})&&(s=a,c=1,l=1);let u=xe(s),d=[];for(let e=c;e<n.length;e++){let t=n[e]?.c||[],r=e=>e>=0?be(t[e]):``,a=r(u.nameCol),o=N(r(u.passCol)),s=r(u.emailCol),c=r(u.sheetCol),f=r(u.webhookCol),p=r(u.idCol),m=r(u.activeCol),h=r(u.geminiCol)||t.slice(4).map(e=>be(e)).find(e=>/^(AIza|AQ\.)/.test(e.trim()))||``;if(!a&&!s)continue;let g=P(a);if(g===`الاسم`||g===`full_name`||g===`a`||p.toLowerCase()===`id`)continue;if(m){let e=m.trim().toUpperCase();if(e===`FALSE`||e===`0`||e===`معطل`)continue}let _=a||s.split(`@`)[0],v=(a||s).trim(),y=v.toLowerCase().replace(/\s+/g,`_`).replace(/[^a-z0-9_\u0621-\u064a-]/gi,``)||`rep_${e}`,b=s.includes(`@`)?s.toLowerCase():`${y}@pharma.com`,x=ve(_,b),S=x?`admin`:`medical_rep`,C=ye(c)||void 0,w=C?`https://docs.google.com/spreadsheets/d/${C}/edit?usp=sharing`:c.startsWith(`http`)?c:void 0,T=f&&f.startsWith(`http`)?f:void 0;!T&&x&&(T=_e);let ee=i>0?e+i+1:e+l;d.push({rowNumber:ee,id:p||`sheet-usr-${ee}`,full_name:_,email:b,username:v,password_hash:o,role:S,is_active:!0,sheet_id:C,sheet_url:w,webhook_url:T,gemini_api_key:h||void 0})}return Se(d)}function I(e){if(!Array.isArray(e)||e.length===0)return``;let t=e.find(e=>e.role===`admin`&&e.gemini_api_key&&e.gemini_api_key.trim());return t?.gemini_api_key?t.gemini_api_key.trim():e.find(e=>e.gemini_api_key&&e.gemini_api_key.trim())?.gemini_api_key?.trim()||``}function Se(e){let t=I(e);if(!t)return e;let n=e.find(e=>e.role===`admin`&&e.gemini_api_key?.trim())?.gemini_api_key?.trim()||t;return e.map(e=>({...e,gemini_api_key:n||e.gemini_api_key||t}))}function Ce(e){let t=[],n=[],r=``,i=!1,a=String(e||``).replace(/^\uFEFF/,``);for(let e=0;e<a.length;e++){let o=a[e];if(i)o===`"`?a[e+1]===`"`?(r+=`"`,e++):i=!1:r+=o;else if(o===`"`)i=!0;else if(o===`,`)n.push(r.trim()),r=``;else if(o===`\r`)continue;else o===`
`?(n.push(r.trim()),t.push(n),n=[],r=``):r+=o}return(r.length>0||n.length>0)&&(n.push(r.trim()),t.push(n)),t}function we(e){let t=Ce(e);if(t.length<=1)return[];let n=xe(t[0]||[]),r=[];for(let e=1;e<t.length;e++){let i=t[e]||[],a=e=>e>=0?String(i[e]??``).trim():``,o=a(n.nameCol),s=N(a(n.passCol)),c=a(n.emailCol),l=a(n.sheetCol),u=a(n.webhookCol),d=a(n.idCol),f=a(n.activeCol),p=a(n.geminiCol)||i.slice(4).find(e=>/^(AIza|AQ\.)/.test(String(e||``).trim()))||``;if(!o&&!c)continue;let m=P(o);if(m===`الاسم`||m===`full_name`||d.toLowerCase()===`id`)continue;if(f){let e=f.trim().toUpperCase();if(e===`FALSE`||e===`0`||e===`معطل`)continue}let h=o||c.split(`@`)[0],g=(o||c).trim(),_=g.toLowerCase().replace(/\s+/g,`_`).replace(/[^a-z0-9_\u0621-\u064a-]/gi,``)||`rep_${e}`,v=c.includes(`@`)?c.toLowerCase():`${_}@pharma.com`,y=ve(h,v),b=y?`admin`:`medical_rep`,x=ye(l)||void 0,S=x?`https://docs.google.com/spreadsheets/d/${x}/edit?usp=sharing`:l.startsWith(`http`)?l:void 0,C=u&&u.startsWith(`http`)?u:void 0;!C&&y&&(C=_e);let w=e+1;r.push({rowNumber:w,id:d||`sheet-usr-${w}`,full_name:h,email:v,username:g,password_hash:s,role:b,is_active:!0,sheet_id:x,sheet_url:S,webhook_url:C,gemini_api_key:p.trim()||void 0})}return Se(r)}function Te(e){return Array.isArray(e)?Se(e.filter(e=>e&&(e.full_name||e.email)).map((e,t)=>{let n=String(e.full_name||e.name||``).trim(),r=String(e.email||``).trim().toLowerCase(),i=ve(n,r),a=String(e.sheet_url||e.sheet_id||``).trim(),o=ye(a)||void 0,s=o?`https://docs.google.com/spreadsheets/d/${o}/edit?usp=sharing`:a.startsWith(`http`)?a:void 0,c=String(e.webhook_url||``).trim()||void 0;!c&&i&&(c=_e);let l=Number(e.rowNumber||t+2);return{rowNumber:l,id:String(e.id||`sheet-usr-${l}`),full_name:n,email:r||`${n.toLowerCase().replace(/\s+/g,`_`)}@pharma.com`,username:n,password_hash:N(String(e.password_hash||e.password||``).trim()),role:i?`admin`:`medical_rep`,is_active:!0,sheet_id:o,sheet_url:s,webhook_url:c,gemini_api_key:String(e.gemini_api_key||``).trim()||void 0}})):[]}function Ee(...e){let t=new Map;for(let n of e)if(Array.isArray(n))for(let e of n){if(!e||Array.isArray(e))continue;let n=P(e.full_name)||(e.email||``).toLowerCase();if(!n)continue;let r=t.get(n);r?t.set(n,{...r,...e,password_hash:e.password_hash||r.password_hash,sheet_id:e.sheet_id||r.sheet_id,sheet_url:e.sheet_url||r.sheet_url,webhook_url:e.webhook_url||r.webhook_url,gemini_api_key:e.gemini_api_key||r.gemini_api_key,rowNumber:e.rowNumber||r.rowNumber}):t.set(n,{...e})}return Se(Array.from(t.values()))}function L(e){return e?e.role===`admin`||!!ye(e.sheet_id||e.sheet_url):!1}var De=`عذراً، لا تملك أي قاعدة بيانات (صفحة كوكل شيت) مرتبطة بحسابك في الشيت الرئيسي — تم منع الدخول إلى بيانات الإدارة لحماية الخصوصية. يرجى مراجعة المدير (باقر) لإضافة رابط صفحتك الخاصة.`,Oe=`pharma_sheet_shared_gemini_key`,ke=e=>L(e??H()),Ae=`http://localhost:5000/api/v1`.replace(/\/$/,``),je=ge;`${je}`;var Me=_e,Ne=`https://script.google.com/macros/s/AKfycbyxEXPVY7glHZlXL6c6af3ryZib9AtCVsM5oaljxyxIMKnyY7VlCH-UhCGBBrnVmz1o/exec`,Pe=()=>{let e=(localStorage.getItem(`pharma_admin_webhook_url`)||``).trim();return!e||e===Ne?Me:e},Fe=e=>{e.trim()?localStorage.setItem(`pharma_admin_webhook_url`,e.trim()):localStorage.removeItem(`pharma_admin_webhook_url`)},Ie=()=>{let e=localStorage.getItem(`pharma_api_base`);return(e&&e.trim()?e.trim():Ae).replace(/\/$/,``)},Le=e=>{e.trim()?localStorage.setItem(`pharma_api_base`,e.trim().replace(/\/$/,``)):localStorage.removeItem(`pharma_api_base`)},Re=()=>(localStorage.getItem(Oe)||H()?.gemini_api_key||localStorage.getItem(`pharma_gemini_api_key`)||``).trim(),ze=e=>{e.trim()?localStorage.setItem(`pharma_gemini_api_key`,e.trim()):(localStorage.removeItem(`pharma_gemini_api_key`),localStorage.removeItem(Oe))},Be=()=>{let e=H();if(e){if(!L(e))return``;let t=localStorage.getItem(`pharma_webhook_url::${e.id}`)||``;return t.trim()?t.trim():e.webhook_url&&e.webhook_url.trim()?e.webhook_url.trim():Pe()||Me}return``},R=()=>{let e=H();if(!e)return``;if(e.sheet_id&&e.sheet_id.trim()){let t=ye(e.sheet_id)||e.sheet_id.trim();if(t)return t}if(e.sheet_url&&e.sheet_url.trim()){let t=ye(e.sheet_url);if(t)return t}return e.role===`admin`?je:``},Ve=()=>{let e=H();if(!e||!L(e))return``;if(e?.sheet_url&&e.sheet_url.trim())return e.sheet_url.trim();let t=R();return t?`https://docs.google.com/spreadsheets/d/${t}/edit?usp=sharing`:``},He=[{id:`ph-1`,name:`صيدلية دواء / شارع فلسطين`,city:`بغداد`,area:`شارع فلسطين`,address:`بغداد - شارع فلسطين مقابل ساحة بيروت`,phone:`07701234567`,assigned_rep_name:`علي حسن (مندوب الرصافة)`,total_invoices:2,total_sales:197510},{id:`ph-2`,name:`صيدلية المطرقة`,city:`بغداد`,area:`الزعفرانية`,address:`بغداد - الزعفرانية السوق العام`,phone:`07801234568`,assigned_rep_name:`علي حسن (مندوب الرصافة)`,total_invoices:1,total_sales:1065500},{id:`ph-3`,name:`صيدلية النور الحديثة`,city:`بغداد`,area:`الكرادة`,address:`بغداد - الكرادة خارج`,phone:`07901234569`,assigned_rep_name:`أحمد خليل (مندوب الكرخ)`,total_invoices:0,total_sales:0},{id:`ph-4`,name:`صيدلية الشفاء التخصصية`,city:`بغداد`,area:`المنصور`,address:`بغداد - المنصور شارع 14 رمضان`,phone:`07709876543`,assigned_rep_name:`أحمد خليل (مندوب الكرخ)`,total_invoices:0,total_sales:0}],Ue=[{id:`pr-1`,name:`Elica Cream 30g Jamjoom`,product_type:`cream`,base_price:4828,is_active:!0},{id:`pr-2`,name:`Hyfresh Drop 10ml`,product_type:`drop`,base_price:5267,is_active:!0},{id:`pr-3`,name:`Fucidin Ointment 20g`,product_type:`ointment`,base_price:3750,is_active:!0},{id:`pr-4`,name:`Panadol Extra Tablets`,product_type:`other`,base_price:2500,is_active:!0}],We=[{id:`inv-1`,invoice_number:`691659`,invoice_date:`2026-10-27`,pharmacy_id:`ph-1`,pharmacy_name:`صيدلية دواء / شارع فلسطين`,pharmacy_city:`بغداد`,pharmacy_area:`شارع فلسطين`,rep_id:`rep-rusafa`,rep_name:`علي حسن (مندوب الرصافة)`,status:`approved`,total_sales_amount:144840,total_pieces_count:30,total_bonus_count:3,created_at:new Date().toISOString(),items:[{product_id:`pr-1`,product_name_snapshot:`Elica Cream 30g Jamjoom`,dosage_form:`كريم`,sold_quantity:30,historical_unit_price:4828,bonus_quantity:3,total_quantity:33,line_total:144840}]},{id:`inv-2`,invoice_number:`1035986`,invoice_date:`2026-10-25`,pharmacy_id:`ph-1`,pharmacy_name:`صيدلية دواء / شارع فلسطين`,pharmacy_city:`بغداد`,pharmacy_area:`شارع فلسطين`,rep_id:`rep-rusafa`,rep_name:`علي حسن (مندوب الرصافة)`,status:`approved`,total_sales_amount:52670,total_pieces_count:10,total_bonus_count:1,created_at:new Date().toISOString(),items:[{product_id:`pr-2`,product_name_snapshot:`Hyfresh Drop 10ml`,dosage_form:`قطرة`,sold_quantity:10,historical_unit_price:5267,bonus_quantity:1,total_quantity:11,line_total:52670}]},{id:`inv-3`,invoice_number:`21084`,invoice_date:`2026-11-04`,pharmacy_id:`ph-2`,pharmacy_name:`صيدلية المطرقة`,pharmacy_city:`بغداد`,pharmacy_area:`الزعفرانية`,rep_id:`rep-rusafa`,rep_name:`علي حسن (مندوب الرصافة)`,status:`pending_review`,total_sales_amount:1065500,total_pieces_count:8,total_bonus_count:0,created_at:new Date().toISOString(),items:[{product_id:`pr-2`,product_name_snapshot:`قطرة أذن مضادة للألم`,dosage_form:`قطرة`,sold_quantity:3,historical_unit_price:4100,bonus_quantity:0,total_quantity:3,line_total:12300},{product_id:`pr-2`,product_name_snapshot:`قطرة أذن مضادة للألم`,dosage_form:`قطرة`,sold_quantity:5,historical_unit_price:210640,bonus_quantity:0,total_quantity:5,line_total:1053200}]}],Ge=`pharma_local_pharmacies_v1`,Ke=`pharma_local_invoices_v1`;function qe(e){let t=H();return t?`${e}::${t.sheet_id||ye(t.sheet_url)||(t.role===`admin`?je:`no_db_${t.id}`)}`:`${e}::anon`}function Je(){let e=H();if(!L(e))return[];try{let e=localStorage.getItem(qe(Ge));if(e){let t=JSON.parse(e);if(Array.isArray(t))return t}}catch{}return e?.role===`admin`&&R()===je?[...He]:[]}function Ye(e){if(L(H()))try{localStorage.setItem(qe(Ge),JSON.stringify(e))}catch{}}function Xe(){let e=H();if(!L(e))return[];try{let e=localStorage.getItem(qe(Ke));if(e){let t=JSON.parse(e);if(Array.isArray(t))return t}}catch{}return e?.role===`admin`&&R()===je?[...We]:[]}function Ze(e){if(!L(H()))return;let t=qe(Ke);try{localStorage.setItem(t,JSON.stringify(e))}catch{try{let n=e.map((e,t)=>t>3&&e.image_url?.startsWith(`data:`)?{...e,image_url:void 0}:e);localStorage.setItem(t,JSON.stringify(n))}catch{}}}function z(e){if(!e)return!1;let t=String(e.message||e).toLowerCase();return e.name===`TypeError`||e.name===`AbortError`||t.includes(`fetch`)||t.includes(`network`)||t.includes(`load failed`)||t.includes(`timeout`)||t.includes(`aborted`)}var Qe=`pharma_pending_ocr_queue_v1`;function $e(){try{let e=localStorage.getItem(Qe);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t:[]}catch{return[]}}function et(e){let t=$e(),n={...e,id:`q-`+Date.now()+`-`+Math.random().toString(36).slice(2,6),createdAt:new Date().toISOString()},r=[n,...t].slice(0,5);try{localStorage.setItem(Qe,JSON.stringify(r))}catch{try{localStorage.setItem(Qe,JSON.stringify(r.slice(0,2)))}catch{}}return n}function tt(e){let t=$e().filter(t=>t.id!==e);try{localStorage.setItem(Qe,JSON.stringify(t))}catch{}}function nt(){let e=Ie();return typeof window<`u`&&window.location.protocol===`https:`&&(e.startsWith(`http://localhost`)||e.startsWith(`http://127.0.0.1`))}async function B(e,t,n=6e3){let r=Ie(),i=nt()?600:n,a=new AbortController,o=setTimeout(()=>a.abort(),i);try{return await fetch(`${r}${e}`,{...t,signal:a.signal})}finally{clearTimeout(o)}}async function rt(e,t,n,r=3,i=28e3){if(nt())throw TypeError(`Localhost backend unreachable from HTTPS origin`);let a=Ie(),o=Ut(),s;for(let c=1;c<=r;c++)try{let r=await new Promise((r,s)=>{let c=new XMLHttpRequest;c.open(`POST`,`${a}${e}`,!0),c.timeout=i,o&&c.setRequestHeader(`Authorization`,`Bearer ${o}`),c.upload.onprogress=e=>{e.lengthComputable&&n&&n(Math.round(e.loaded/e.total*100))},c.onload=()=>{let e={};try{e=JSON.parse(c.responseText||`{}`)}catch{}r({status:c.status,body:e})},c.onerror=()=>s(TypeError(`Network error during file upload`)),c.ontimeout=()=>s(TypeError(`Upload request timed out`)),c.send(t)});if(r.status===401||r.status===403)throw Wt(),Kt(),window.dispatchEvent(new Event(`auth:logout`)),Error(`انتهت صلاحية جلسة الدخول، يرجى تسجيل الدخول مجدداً`);if(r.status>=200&&r.status<300)return r.body?.data??r.body;throw r.status>=400&&r.status<500&&r.status!==408&&r.status!==429?Error(r.body?.error||r.body?.message||`خطأ في التحقق من الملف (${r.status})`):Error(r.body?.error||r.body?.message||`Server returned ${r.status}`)}catch(e){if(s=e,!(c<r&&z(e)))throw e;let t=Math.min(4e3,800*2**(c-1));await new Promise(e=>setTimeout(e,t))}throw s}async function it(e,t){for(let n=0;n<30;n++){let n=await W(await B(`/invoices/ocr-status/${encodeURIComponent(e)}`,{headers:U()},8e3));if(n?.status===`completed`&&n?.result)return n.result;if(n?.status===`failed`)throw Error(n.error||`فشلت عملية تحليل الفاتورة في الخلفية`);typeof n?.progress==`number`&&t?.(n.progress,n.message||`جاري تحليل الفاتورة بالذكاء الاصطناعي...`),await new Promise(e=>setTimeout(e,1200))}throw Error(`انتهت مهلة انتظار نتيجة التحليل من الخادم`)}function at(e,t){return new Promise((n,r)=>{let i=new FileReader;i.onload=()=>{let r=String(i.result||``),a=r.indexOf(`,`);n({dataUrl:r,base64:a>=0?r.slice(a+1):r,mimeType:t||e.type||(e.name.toLowerCase().endsWith(`.pdf`)?`application/pdf`:`image/jpeg`)})},i.onerror=()=>r(Error(`تعذر قراءة الملف من الجهاز، يرجى التحقق من صلاحية الوصول للملفات`)),i.readAsDataURL(e)})}var ot=[`gemini-flash-lite-latest`,`gemini-flash-latest`,`gemini-2.5-flash-lite`,`gemini-3-flash-preview`,`gemini-2.5-flash`,`gemini-2.0-flash`],st=`أنت نظام ذكاء اصطناعي خبير متخصص في قراءة فواتير أدوية المذاخر والمستودعات في العراق.
تجاهل أي نوافذ فيديو أو تشتيت جانبي على لقطات شاشة الهاتف واقرأ الفاتورة بدقة كاملة مهما كانت لغتها (عربية / إنجليزية / مختلطة).

قواعد الاستخراج الصارمة:
1. invoice_number: رقم الفاتورة (مثل SAL-01-596911 أو 21084 أو 44941).
2. invoice_date: التاريخ بصيغة YYYY-MM-DD (مثال: 13/07/2026 -> 2026-07-13).
3. pharmacy_name: الاسم الكامل للصيدلية المشترية بعد "اسم الجهة" أو "المطلوب لـ" أو "Client Info :" أو "الزبون". أضف كلمة "صيدلية" في البداية إن لم توجد. ممنوع إرجاع كلمة "صيدلية" وحدها دون اسمها الكامل. تجاهل حقل Reference #.
4. pharmacy_area: المنطقة/الحي (مثال: الزعفرانية، الكرادة، المنصور، زيونة، مدينة الصدر...).
5. items: مصفوفة الأصناف في جدول الفاتورة:
   - product_name: اسم الدواء كاملاً كما هو مكتوب.
   - dosage_form: يجب أن تكون واحدة من هذه الكلمات الـ 4 فقط: "قطرة" | "كريم" | "مرهم" | "حبوب".
   - quantity: الكمية المباعة كرقم صحيح.
   - unit_price: سعر المفرد بالدينار (أزل الفواصل مثل 5,750 أو 5'750 -> 5750).
   - bonus_quantity: عمود المجاني / البونص / FOC (0 إن لم يوجد).

أعد كائن JSON صحيحاً فقط بدون أي نص أو Markdown إضافي بهذا الشكل:
{
  "invoice_number": "...",
  "invoice_date": "YYYY-MM-DD",
  "pharmacy_name": "صيدلية ...",
  "pharmacy_area": "...",
  "items": [
    { "product_name": "...", "dosage_form": "قطرة|كريم|مرهم|حبوب", "quantity": 10, "unit_price": 5000, "bonus_quantity": 0 }
  ],
  "confidence": 0.95
}`;function ct(e,t){let n=(t||``).toLowerCase();return n.includes(`free tier is not available`)||n.includes(`set up billing`)?`الباقة المجانية لـ Gemini متوقفة حالياً على هذا المشروع (403) — فعّل الفوترة في Google AI Studio أو أنشئ مفتاحاً من مشروع/حساب جديد.`:e===400&&(n.includes(`api key`)||n.includes(`api_key_invalid`))?`مفتاح Gemini API غير صالح (تأكد من نسخه كاملاً دون مسافات سواء بدأ بـ AQ. أو AIzaSy).`:e===401||e===403?`تم رفض الطلب من Gemini (${e}): ${t||`تحقق من تفعيل Generative Language API وصلاحيات المفتاح.`}`:e===429?`تم تجاوز حد الطلبات المجاني لمفتاح Gemini مؤقتاً (429). انتظر ثوانٍ وحاول مجدداً.`:e===404?`نموذج Gemini غير متاح لهذا المفتاح (404).`:`خطأ من خادم Gemini (${e}): ${t||`استجابة غير متوقعة`}`}var lt=18e5,ut=50,dt=6e5,ft=3,pt=`pharma_client_ocr_breaker_v1`,mt=new Map,ht=new Map;function gt(e){let t=(e||``).trim();if(!t)return`none`;let n=2166136261;for(let e=0;e<t.length;e++)n^=t.charCodeAt(e),n=Math.imul(n,16777619);return(n>>>0).toString(16)}async function _t(e){let t=await e.arrayBuffer();if(typeof crypto<`u`&&crypto.subtle?.digest){let e=await crypto.subtle.digest(`SHA-256`,t);return Array.from(new Uint8Array(e)).map(e=>e.toString(16).padStart(2,`0`)).join(``)}let n=new Uint8Array(t),r=2166136261,i=2654435769;for(let e=0;e<n.length;e++)r=Math.imul(r^n[e],16777619),i=Math.imul(i^n[e]+e,2246822507);return`${n.length}-${(r>>>0).toString(16)}-${(i>>>0).toString(16)}`}function vt(e){let t=gt(e??Re()),n=ht.get(t);if(!n&&typeof localStorage<`u`)try{let e=localStorage.getItem(pt);if(e){let r=JSON.parse(e);r?.[t]&&(n=r[t])}}catch{}if(!n)return{open:!1,remainingMs:0};let r=n.openUntil-Date.now();return r<=0?(bt(e??Re()),{open:!1,remainingMs:0}):(ht.set(t,n),{open:!0,remainingMs:r,reason:n.reason,statusCode:n.statusCode})}function yt(e,t,n){let r=gt(e??Re()),i={openUntil:Date.now()+dt,reason:t,statusCode:n};if(ht.set(r,i),typeof localStorage<`u`)try{let e=localStorage.getItem(pt),t=e?JSON.parse(e):{};t[r]=i,localStorage.setItem(pt,JSON.stringify(t))}catch{}}function bt(e){if(e===void 0){if(ht.clear(),typeof localStorage<`u`)try{localStorage.removeItem(pt)}catch{}return}let t=gt(e);if(ht.delete(t),typeof localStorage<`u`)try{let e=localStorage.getItem(pt);if(!e)return;let n=JSON.parse(e);delete n[t],localStorage.setItem(pt,JSON.stringify(n))}catch{}}function xt(e){let t=(e||``).replace(/```json\s*|```/gi,``).trim(),n=t.indexOf(`{`),r=t.lastIndexOf(`}`);if(n<0||r<0)throw Error(`لم يُرجع Google Gemini بيانات جدول صالحة (JSON).`);let i=JSON.parse(t.slice(n,r+1));return Array.isArray(i.items)&&(i.items=i.items.map(e=>({...e,dosage_form:[`قطرة`,`كريم`,`مرهم`,`حبوب`].includes(e.dosage_form)?e.dosage_form:re(String(e.product_name||``))}))),!i.pharmacy_area&&i.pharmacy_name&&(i.pharmacy_area=ie(String(i.pharmacy_name))),i}async function St(e,t,n){let r=null;for(let i=0;i<ot.length;i++){let a=ot[i],o=`https://generativelanguage.googleapis.com/v1beta/models/${a}:generateContent?key=${encodeURIComponent(t)}`;for(let t=1;t<=ft;t++){let s=new AbortController,c=setTimeout(()=>s.abort(),3e4);try{n?.(55+i*8,`جاري القراءة الذكية عبر Google Gemini (${a})...`);let c=await fetch(o,{method:`POST`,headers:{"Content-Type":`application/json`},signal:s.signal,body:JSON.stringify({contents:[{parts:[{text:st},{inline_data:{mime_type:e.mimeType,data:e.base64}}]}],generationConfig:{temperature:.1,responseMimeType:`application/json`}})});if(!c.ok){let e=(await c.json().catch(()=>({})))?.error?.message||c.statusText||``,n=ct(c.status,e),i=e.toLowerCase();if(c.status===400&&i.includes(`api_key_invalid`))throw Object.assign(Error(n),{fatalAuth:!0,statusCode:400});if(c.status===403&&(i.includes(`free tier`)||i.includes(`set up billing`)))throw Object.assign(Error(n),{statusCode:403,shouldTripCircuit:!0,fatalBilling:!0});if(c.status===404||c.status===403){r=Object.assign(Error(n),{statusCode:c.status,shouldTripCircuit:c.status===403});break}if((c.status===429||c.status>=500)&&t<ft){r=Object.assign(Error(n),{statusCode:c.status,shouldTripCircuit:c.status===429}),await new Promise(e=>setTimeout(e,500*2**(t-1)));continue}throw Object.assign(Error(n),{statusCode:c.status,shouldTripCircuit:c.status===429})}return{parsed:xt((await c.json())?.candidates?.[0]?.content?.parts?.[0]?.text||``),modelUsed:a}}catch(e){if(clearTimeout(c),e?.fatalAuth||e?.fatalBilling)throw e;if(r=e?.name===`AbortError`?Object.assign(Error(`انتهت مهلة الاتصال بـ Gemini API (تأكد من سرعة الإنترنت)`),{statusCode:408}):e,t<ft&&!e?.statusCode){await new Promise(e=>setTimeout(e,500*2**(t-1)));continue}}finally{clearTimeout(c)}}}throw r||Error(`تعذر تحليل الفاتورة عبر جميع نماذج Google Gemini.`)}var Ct=0;async function wt(){let e=Pe(),t=[];t.push((async()=>{try{let e=new AbortController,t=setTimeout(()=>e.abort(),5e3),n=await fetch(`https://docs.google.com/spreadsheets/d/${M}/export?format=csv&_t=${Date.now()}`,{signal:e.signal}).finally(()=>clearTimeout(t));return n.ok?we(await n.text()):[]}catch{return[]}})()),e&&e.startsWith(`http`)&&t.push((async()=>{try{let t=new AbortController,n=setTimeout(()=>t.abort(),5500),r=await fetch(`${e}?action=users&_t=${Date.now()}`,{signal:t.signal}).finally(()=>clearTimeout(n));if(!r.ok)return[];let i=await r.json().catch(()=>null);return i?.success&&Array.isArray(i.users)?Te(i.users):[]}catch{return[]}})()),t.push((async()=>{let e=[`https://docs.google.com/spreadsheets/d/${M}/gviz/tq?tqx=out:json&_t=${Date.now()}`,`https://docs.google.com/spreadsheets/d/${M}/gviz/tq?tqx=out:json&sheet=%D8%A7%D9%84%D9%85%D8%B3%D8%AA%D8%AE%D8%AF%D9%85%D9%88%D9%86&_t=${Date.now()}`];for(let t of e)try{let e=new AbortController,n=setTimeout(()=>e.abort(),5e3),r=await fetch(t,{signal:e.signal}).finally(()=>clearTimeout(n));if(!r.ok)continue;let i=(await r.text()).match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);if(!i?.[1])continue;let a=F(JSON.parse(i[1]));if(a.length>0)return a}catch{}return[]})());let n=(await Promise.allSettled(t)).filter(e=>e.status===`fulfilled`&&e.value.length>0).map(e=>e.value);if(n.length===0)return[];let r=Ee(...n),i=I(r);return i&&(localStorage.setItem(Oe,i),localStorage.setItem(`pharma_gemini_api_key`,i),Ct=Date.now()),r}async function Tt(e,t,n=12e3){let r=JSON.stringify(t);try{let t=new AbortController,i=setTimeout(()=>t.abort(),n),a=await(await fetch(e,{method:`POST`,headers:{"Content-Type":`text/plain;charset=utf-8`},body:r,signal:t.signal}).finally(()=>clearTimeout(i))).text().catch(()=>``),o=null;try{o=JSON.parse(a)}catch{}return{sent:!0,parsed:o}}catch(t){if(t?.name===`AbortError`)throw Error(`انتهت مهلة الانتظار للاستجابة من Google Apps Script — تحقق من اكتمال العملية في الشيت.`);return await fetch(e,{method:`POST`,mode:`no-cors`,headers:{"Content-Type":`text/plain;charset=utf-8`},body:r}),{sent:!0,opaque:!0}}}var Et=`pharma_sheets_sync_outbox_v1`,Dt=`pharma_sheets_skipped_duplicates_v1`;function Ot(){try{let e=localStorage.getItem(Dt),t=e?JSON.parse(e):[];return Array.isArray(t)?t:[]}catch{return[]}}function kt(e){if(e&&e.length!==0)try{let t=Ot(),n=[...e.map(e=>({...e,id:`skip-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,detectedAt:new Date().toISOString()})),...t].filter((e,t,n)=>n.findIndex(t=>t.invoice_number===e.invoice_number&&t.pharmacy_name===e.pharmacy_name&&t.reason===e.reason)===t).slice(0,20);localStorage.setItem(Dt,JSON.stringify(n))}catch{}}function At(){try{localStorage.removeItem(Dt)}catch{}}function jt(){try{let e=localStorage.getItem(Et),t=e?JSON.parse(e):[];return Array.isArray(t)?t:[]}catch{return[]}}function Mt(e){try{e.length===0?localStorage.removeItem(Et):localStorage.setItem(Et,JSON.stringify(e.slice(-40)))}catch{}}function Nt(e){let t=e?.items||[],n=new Date().toLocaleString(`ar-IQ`,{timeZone:`Asia/Baghdad`,year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`,second:`2-digit`}),r=e?.status===`approved`?`معتمدة ✓`:e?.status===`rejected`?`مرفوضة`:`قيد التدقيق`,i=String(e?.pharmacy_name||`صيدلية معتمدة`).trim(),a=String(e?.pharmacy_city||`بغداد`).trim(),o=String(e?.pharmacy_area||e?.area||ie(i)||`مركز المدينة`).trim();return t.map(t=>{let s=Number(t.sold_quantity||t.quantity||1),c=Number(t.historical_unit_price||t.custom_unit_price||t.unit_price||0),l=Number(t.bonus_quantity??t.custom_bonus??0),u=Number(t.line_total||s*c),d=String(t.product_name_snapshot||t.custom_product_name||t.product_name||`مستحضر دوائي`).trim(),f=String(t.dosage_form||re(d)).trim();return{invoice_number:String(e?.invoice_number||``).trim(),invoice_date:String(e?.invoice_date||``).split(`T`)[0],warehouse_name:String(e?.warehouse_name||`مذخر الشغف الحديث`).trim(),pharmacy_name:i,area:o,city:a,product_name:d,dosage_form:[`قطرة`,`كريم`,`مرهم`,`حبوب`].includes(f)?f:re(d),quantity:s,unit_price:c,bonus_quantity:l,line_total:u,total_invoice:Number(e?.total_sales_amount||u),rep_name:String(e?.rep_name||`مندوب علمي`).trim(),status:r,timestamp:n}})}function Pt(e){let t=e?.table?.cols||[],n=e?.table?.rows||[],r=t.map(e=>String(e?.label||``).trim()),i=0;if(!r.some(Boolean)&&n.length>0){let e=(n[0]?.c||[]).map(e=>String(e?.f??e?.v??``).trim());e.some(e=>e.includes(`رقم الفاتورة`)||e.includes(`اسم الصيدلية`)||e.includes(`الكمية`))&&(r=e,i=1)}r.some(Boolean)||(r=t.map(e=>String(e?.label||e?.id||``).trim()));let a=r.map(e=>e.toLowerCase().replace(/[أإآ]/g,`ا`).replace(/ة/g,`ه`).replace(/ى/g,`ي`)),o=(e,t)=>{let n=a.findIndex(t=>t&&e.some(e=>t.includes(e)));return n>=0?n:t},s=a.findIndex(e=>e&&(e.includes(`المنطق`)||e.includes(`المكان`))),c=a.findIndex(e=>e&&(e.includes(`المدين`)||e.includes(`المحافظ`))),l=a.findIndex(e=>e&&(e.includes(`نوع الماد`)||e.includes(`الشكل الدوائي`))),u=s>=0&&l>=0,d={invoice_number:o([`رقم الفاتور`],0),invoice_date:o([`تاريخ الفاتور`],1),warehouse_name:o([`المذخر`],2),pharmacy_name:o([`اسم الصيدلي`],3),city:c>=0?c:4,area:s>=0?s:-1,product_name:o([`اسم الماد`,`الماده الدوائي`],u?6:5),dosage_form:l>=0?l:-1,quantity:o([`الكمي`],u?8:6),unit_price:o([`سعر المفرد`],u?9:7),bonus_quantity:o([`البونص`],u?10:8),line_total:o([`المجموع`],u?11:9),total_invoice:o([`صافي الفاتور`],u?12:10),rep_name:o([`المندوب`],u?13:11),status:o([`حاله الاعتماد`,`الحال`],u?14:12),timestamp:o([`وقت وتاريخ`,`الادراج`],u?15:13)},f=[];for(let e=i;e<n.length;e++){let t=n[e]?.c||[],i=e=>e>=0?String(t[e]?.f??t[e]?.v??``).trim():``,a=e=>e>=0?j(t[e]?.v??t[e]?.f??0):0,o=i(d.invoice_number),s=i(d.pharmacy_name),c=i(d.product_name);if(o===`123`||o===`رقم الفاتورة`||!o&&!s&&!c)continue;let l=r.map((e,t)=>i(t));f.push({invoice_number:o,invoice_date:i(d.invoice_date),warehouse_name:i(d.warehouse_name),pharmacy_name:s,area:i(d.area),city:i(d.city),product_name:c,dosage_form:i(d.dosage_form),quantity:a(d.quantity),unit_price:a(d.unit_price),bonus_quantity:a(d.bonus_quantity),line_total:a(d.line_total),total_invoice:a(d.total_invoice),rep_name:i(d.rep_name),status:i(d.status),timestamp:i(d.timestamp),cells:l})}return{headers:r,rows:f}}async function Ft(){try{let e=R();if(!e||!L(H()))return{reachable:!1,rows:[]};let t=new AbortController,n=setTimeout(()=>t.abort(),3500),r=await fetch(`https://docs.google.com/spreadsheets/d/${e}/gviz/tq?tqx=out:json&_t=${Date.now()}`,{signal:t.signal}).finally(()=>clearTimeout(n));if(!r.ok)return{reachable:!1,rows:[]};let i=(await r.text()).match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);if(!i?.[1])return{reachable:!1,rows:[]};let{headers:a,rows:o}=Pt(JSON.parse(i[1]));return{reachable:!0,rows:o,headers:a}}catch{return{reachable:!1,rows:[]}}}async function It(){return(await Ft()).rows}function Lt(e){let t=H(),n=new Map;for(let t of e){let e=`${String(t.invoice_number||t.pharmacy_name||`row`).trim()}::${ce(t.invoice_date)}::${String(t.timestamp||``).trim()}`;n.has(e)||n.set(e,[]),n.get(e).push(t)}let r=[],i=0;for(let e of n.values()){i++;let n=e[0],a=e.map((e,t)=>{let n=Math.max(1,Number(e.quantity)||1),r=Number(e.unit_price)||0,a=Number(e.bonus_quantity)||0,o=Number(e.line_total)||n*r;return{id:`sh-item-${i}-${t}`,product_id:`pr-1`,product_name_snapshot:e.product_name||`مستحضر دوائي`,dosage_form:e.dosage_form||re(e.product_name||``),sold_quantity:n,historical_unit_price:r,bonus_quantity:a,total_quantity:n+a,line_total:o}}),o=String(n.status||``),s=o.includes(`معتمدة`)?`approved`:o.includes(`مرفوضة`)?`rejected`:`pending_review`,c=Number(n.total_invoice)||a.reduce((e,t)=>e+t.line_total,0);r.push({id:`sh-inv-${n.invoice_number||i}-${i}`,invoice_number:n.invoice_number||`INV-${i}`,invoice_date:ce(n.invoice_date)||new Date().toISOString().split(`T`)[0],pharmacy_id:`ph-${i}`,pharmacy_name:n.pharmacy_name||`صيدلية`,pharmacy_city:n.city||`بغداد`,pharmacy_area:n.area||ie(n.pharmacy_name||``)||``,rep_id:t?.id||`rep-1`,rep_name:n.rep_name||t?.full_name||`مندوب علمي`,status:s,total_sales_amount:c,total_pieces_count:a.reduce((e,t)=>e+t.sold_quantity,0),total_bonus_count:a.reduce((e,t)=>e+t.bonus_quantity,0),created_at:new Date().toISOString(),items:a})}return r}function Rt(e,t){let n=de(e,t);return{isDuplicate:n.isDuplicate,isExactMatch:n.isExactMatch,statusChangedOnly:n.statusChangedOnly,reason:n.reason}}function zt(e){let t=jt(),n={...e,targetSheetId:e.targetSheetId||R(),targetWebhookUrl:e.targetWebhookUrl||Be(),id:`sync-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,createdAt:new Date().toISOString()};Mt([...e.action===`edit_invoice`&&e.invoice_number?t.filter(t=>t.action!==`edit_invoice`||t.invoice_number!==e.invoice_number||(t.targetSheetId||R())!==n.targetSheetId):t,n])}async function Bt(e){let t=Be(),n=jt();if(n.length===0)return{flushed:0,remaining:0};let r=0,i=[];for(let a=0;a<n.length;a++){let o=n[a],s=(o.targetWebhookUrl||t||``).trim();if(!s||!s.startsWith(`http`)){i.push(o);continue}let c=JSON.stringify({action:o.action,spreadsheetId:o.targetSheetId||R(),sheetName:`الفواتير`,invoice_number:o.invoice_number,previous_invoice_number:o.previous_invoice_number,pharmacy_name:o.pharmacy_name,invoice_date:o.invoice_date,timestamp:o.timestamp,delete_mode:o.delete_mode,rows:o.rows||[]});if(e?.useBeacon&&typeof navigator<`u`&&typeof navigator.sendBeacon==`function`&&c.length<6e4&&navigator.sendBeacon(s,new Blob([c],{type:`text/plain;charset=utf-8`})))r++;else try{let t=!!e?.keepalive&&c.length<6e4;await fetch(s,{method:`POST`,mode:`no-cors`,keepalive:t,headers:{"Content-Type":`text/plain;charset=utf-8`},body:c}),r++}catch{i.push(...n.slice(a));break}}return Mt(i),{flushed:r,remaining:i.length}}function Vt(e,t){if(!L(H()))throw Error(De);let n=Je(),r=Xe(),i=H(),a=String(e.pharmacy_name||``).trim(),o=String(e.pharmacy_area||``).trim(),s=a?n.find(e=>e.name.trim().toLowerCase()===a.toLowerCase()):n.find(t=>t.id===e.pharmacy_id);!s&&a&&(s={id:`ph-`+Date.now()+`-`+Math.random().toString(36).slice(2,5),name:a,city:`بغداد`,area:o||ie(a)||``,address:o?`بغداد - ${o}`:`بغداد`,phone:``,assigned_rep_id:i?.id,assigned_rep_name:i?.full_name||`مندوب ميداني`,total_invoices:0,total_sales:0},n.unshift(s),Ye(n));let c=0,l=0,u=0,d=(e.items||[]).map((e,t)=>{let n=Ue.find(t=>t.id===e.product_id),r=Number(e.sold_quantity||1),i=e.custom_unit_price===void 0?Number(n?.base_price||5e3):Number(e.custom_unit_price),a=e.custom_bonus===void 0?e.bonus_quantity===void 0?Math.floor(r/10):Number(e.bonus_quantity):Number(e.custom_bonus),o=r*i;return c+=o,l+=r,u+=a,{id:`item-${Date.now()}-${t}`,product_id:e.product_id||n?.id||`pr-1`,product_name_snapshot:e.custom_product_name||n?.name||`مستحضر دوائي`,dosage_form:e.dosage_form||`حبوب`,sold_quantity:r,historical_unit_price:i,bonus_quantity:a,total_quantity:r+a,line_total:o,ocr_confidence:e.ocr_confidence}}),f=s?.name||e.pharmacy_name||`صيدلية معتمدة`,p=String(e.pharmacy_area||s?.area||ie(f)||``).trim();s&&p&&!s.area&&(s.area=p,Ye(n));let m={id:`inv-`+Date.now()+`-`+Math.random().toString(36).slice(2,5),invoice_number:e.invoice_number||`INV-${Date.now().toString().slice(-6)}`,invoice_date:e.invoice_date||new Date().toISOString().split(`T`)[0],pharmacy_id:s?.id||e.pharmacy_id||`ph-custom`,pharmacy_name:f,pharmacy_city:s?.city||`بغداد`,pharmacy_area:p,rep_id:i?.id||`rep-rusafa`,rep_name:i?.full_name||`علي حسن (مندوب الرصافة)`,status:`pending_review`,total_sales_amount:c,total_pieces_count:l,total_bonus_count:u,image_url:e.image_url,notes:e.notes,created_at:new Date().toISOString(),items:d,pending_sheet_upload:!0};if(r.unshift(m),Ze(r),!t?.skipSheetCheck){let e=Nt(m);zt({action:`add_invoice`,invoice_number:m.invoice_number,pharmacy_name:m.pharmacy_name,invoice_date:m.invoice_date,rows:e}),Bt({keepalive:!0}).catch(()=>{})}return m}async function Ht(e){let t=Vt(e,{skipSheetCheck:!0}),n=Rt(t,await It());if(n.isDuplicate)return kt([{invoice_number:String(t.invoice_number||``),pharmacy_name:t.pharmacy_name||``,invoice_date:(t.invoice_date||``).split(`T`)[0],reason:n.reason}]),t;let r=Nt(t);return zt({action:`add_invoice`,invoice_number:String(t.invoice_number||``),pharmacy_name:t.pharmacy_name,invoice_date:t.invoice_date,rows:r}),await Promise.race([Bt({keepalive:!0}),new Promise(e=>setTimeout(e,3e3))]).catch(()=>{}),t}var Ut=()=>localStorage.getItem(`pharma_token`),V=e=>localStorage.setItem(`pharma_token`,e),Wt=()=>localStorage.removeItem(`pharma_token`),H=()=>{try{let e=localStorage.getItem(`pharma_user`);return e?JSON.parse(e):null}catch{return null}},Gt=e=>localStorage.setItem(`pharma_user`,JSON.stringify(e)),Kt=()=>{localStorage.removeItem(`pharma_user`),localStorage.removeItem(`pharma_google_sheet_url`),localStorage.removeItem(`pharma_webhook_url`)},U=()=>{let e=Ut();return{"Content-Type":`application/json`,...e?{Authorization:`Bearer ${e}`}:{}}},qt=()=>{let e=Ut();return e?{Authorization:`Bearer ${e}`}:{}};async function W(e){if(e.status===401||e.status===403)throw Wt(),Kt(),window.dispatchEvent(new Event(`auth:logout`)),Error(`انتهت صلاحية جلسة الدخول، يرجى تسجيل الدخول مجدداً`);let t=await e.json().catch(()=>({}));if(!e.ok)throw Error(t.error||t.message||`خطأ ${e.status}`);return t.data}var G={async login(e,t){let n=e.trim(),r=N(t.trim());try{let e=await B(`/auth/login`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({email:n,password:r})}),t=await e.json().catch(()=>({}));if(!e.ok)throw Error(t.error||t.message||`الاسم أو الرمز السري غير متطابق مع قاعدة البيانات`);let i=t.data?.accessToken||t.data?.token,a=t.data?.user;return localStorage.removeItem(`pharma_google_sheet_url`),localStorage.removeItem(`pharma_webhook_url`),V(i),Gt(a),{token:i,user:a}}catch(e){if(z(e)){let e=await wt();if(e.length===0)throw Error(`تعذر الاتصال بجدول البيانات الرئيسي (Google Sheet) — يرجى التحقق من اتصال الإنترنت.`);let t=P(n),i=n.toLowerCase(),a=e.find(e=>{let r=P(e.full_name),a=(e.email||``).toLowerCase();return e.full_name.trim()===n||!!t&&r===t||a===i||a.split(`@`)[0]===i});if(!a)throw Error(`الاسم أو الرمز السري غير متطابق مع قاعدة البيانات`);let o=N(String(a.password_hash||``).trim()),s=!1;if(o.startsWith(`$2`))try{s=await(await w(()=>import(`./bcryptjs-BG7J3HqN.js`),[],import.meta.url)).compare(r,o)}catch{s=!1}else s=o!==``&&o===r;if(!s)throw Error(`الاسم أو الرمز السري غير متطابق مع قاعدة البيانات`);let{password_hash:c,username:l,...u}=a,d=I(e);d&&!u.gemini_api_key&&(u.gemini_api_key=d),localStorage.removeItem(`pharma_google_sheet_url`),localStorage.removeItem(`pharma_webhook_url`);let f=`sheet-jwt-`+Date.now();return V(f),Gt(u),{token:f,user:u}}throw e}},async register(e){let t=e.fullName.trim(),n=N(e.pin.trim()),r=(e.username||t).trim().toLowerCase(),i=r.includes(`@`)?r:`${r.replace(/\s+/g,`_`)}@pharma.com`;if(ve(t,i))throw Error(`هذا الاسم محجوز للإدارة الرئيسية ولا يمكن تسجيله كحساب جديد`);try{let r=await B(`/auth/register`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({fullName:t,email:i,password:n,roleName:`medical_rep`,sheetUrl:e.sheetUrl?.trim()||void 0,webhookUrl:e.webhookUrl?.trim()||void 0,geminiApiKey:e.geminiApiKey?.trim()||void 0,area:e.area?.trim()||void 0})}),a=await r.json().catch(()=>({}));if(!r.ok)throw Error(a.error||a.message||`فشل تسجيل الحساب`);let o=a.data?.accessToken||a.data?.token,s=a.data?.user;return localStorage.removeItem(`pharma_google_sheet_url`),localStorage.removeItem(`pharma_webhook_url`),V(o),Gt(s),{token:o,user:s}}catch(r){if(z(r)){if((await wt()).some(e=>P(e.full_name)===P(t)))throw Error(`هذا الاسم مسجل مسبقاً في الشيت الرئيسي`);let r=ye(e.sheetUrl)||void 0,a=e.webhookUrl?.trim()||void 0,o=Pe();o&&await Tt(o,{action:`add_user`,adminSpreadsheetId:M,spreadsheetId:M,user:{full_name:t,email:i,password_hash:n,role:`medical_rep`,sheet_url:e.sheetUrl?.trim()||``,sheet_id:r||``,webhook_url:a||``}});let s={id:`sheet-usr-`+Date.now(),full_name:t,email:i,role:`medical_rep`,area:e.area||`بغداد`,sheet_id:r,sheet_url:e.sheetUrl?.trim()||void 0,webhook_url:a};localStorage.removeItem(`pharma_google_sheet_url`),localStorage.removeItem(`pharma_webhook_url`);let c=`sheet-reg-jwt-`+Date.now();return V(c),Gt(s),{token:c,user:s}}throw r}},async updateUserProfile(e){let t=H();if(!t)throw Error(`يرجى تسجيل الدخول أولاً`);let n=N(e.currentPassword.trim()),r=e.newName?.trim(),i=e.newPassword?N(e.newPassword.trim()):void 0;if(i&&e.confirmPassword&&i!==N(e.confirmPassword.trim()))throw Error(`الرمز السري الجديد وتأكيده غير متطابقين`);if(r&&ve(r)&&t.role!==`admin`)throw Error(`لا يمكن تغيير الاسم إلى اسم الإدارة الرئيسية`);try{let e=await W(await B(`/auth/update-profile`,{method:`POST`,headers:U(),body:JSON.stringify({currentName:t.full_name,currentPassword:n,newName:r,newPassword:i})},9e3));return e.accessToken&&V(e.accessToken),Gt(e.user),{user:e.user,verifiedInSheet:!0}}catch(e){if(!z(e))throw e;let a=await wt(),o=a.find(e=>P(e.full_name)===P(t.full_name)||e.email.toLowerCase()===t.email.toLowerCase());if(!o)throw Error(`تعذر العثور على سجل حسابك في الشيت الرئيسي`);let s=N(o.password_hash||``),c=!1;if(s.startsWith(`$2`))try{c=await(await w(()=>import(`./bcryptjs-BG7J3HqN.js`),[],import.meta.url)).compare(n,s)}catch{c=!1}else c=s===n;if(!c)throw Error(`الرمز السري الحالي غير صحيح`);if(r&&a.some(e=>e.id!==o.id&&P(e.full_name)===P(r)))throw Error(`هذا الاسم مستخدم مسبقاً لمندوب آخر في الشيت الرئيسي`);let l=Pe();if(!l)throw Error(`لا يوجد رابط Apps Script للشيت الرئيسي لحفظ التعديلات`);let u=await Tt(l,{action:`update_user`,adminSpreadsheetId:M,spreadsheetId:M,rowNumber:o.rowNumber,currentName:o.full_name,email:o.email,newName:r||void 0,newPassword:i||void 0});if(u.parsed&&u.parsed.success===!1)throw Error(u.parsed.error||u.parsed.message||`فشل تعديل البيانات في الشيت الرئيسي`);await new Promise(e=>setTimeout(e,1200));let d=await wt().catch(()=>[]),f=d.find(e=>e.rowNumber===o.rowNumber)||d.find(e=>r&&P(e.full_name)===P(r)),p=!(!f||r&&P(f.full_name)!==P(r)||i&&N(f.password_hash)!==i),m=r||t.full_name,h={...t,full_name:m,role:ve(m,t.email)?`admin`:t.role};return Gt(h),{user:h,verifiedInSheet:p}}},async getPharmacies(){if(!L(H()))return[];try{return await W(await B(`/pharmacies`,{headers:U()}))}catch(e){if(z(e))return Je();throw e}},async createPharmacy(e){if(!L(H()))throw Error(De);try{return await W(await B(`/pharmacies`,{method:`POST`,headers:U(),body:JSON.stringify(e)}))}catch(t){if(z(t)){let t=Je(),n={id:`ph-`+Date.now(),name:e.name||`صيدلية جديدة`,city:e.city||`بغداد`,area:e.area||`مركز المدينة`,address:e.address||`بغداد`,phone:e.phone||`07700000000`,total_invoices:0,total_sales:0};return t.unshift(n),Ye(t),n}throw t}},async getProducts(){try{return await W(await B(`/catalog/products`,{headers:U()}))}catch(e){if(z(e))return Ue;throw e}},async getInvoices(){if(!L(H()))return[];try{return await W(await B(`/invoices?sync_sheet=1`,{headers:U()}))}catch(e){if(z(e))return await G.syncSheetDeletion().catch(()=>{}),Xe();throw e}},async syncSheetDeletion(){if(!L(H()))return!1;try{let{reachable:e,rows:t}=await Ft();if(!e)return!1;let n=qe(Ke);if(localStorage.getItem(n)===null)return Ze(t.length>0?Lt(t):R()===je?[...We]:[]),!0;let r=ue(t),i=new Set(t.map(e=>String(e.invoice_number||``).trim()).filter(Boolean)),a=new Map;for(let e of r)e.compositeKey&&a.set(e.compositeKey,(a.get(e.compositeKey)||0)+1);let o=R(),s=new Set(jt().filter(e=>(e.targetSheetId||o)===o&&e.action!==`delete_invoice`).map(e=>String(e.invoice_number||``).trim()).filter(Boolean)),c=Xe(),l=!1,u=c.reduce((e,t)=>{let n=String(t.invoice_number||``).trim();if(n&&s.has(n))return e.push(t),e;let r=fe({pharmacy_name:t.pharmacy_name,invoice_date:t.invoice_date,items:t.items}),o=!1;if(r){let e=a.get(r)||0;e>0?(a.set(r,e-1),o=!0):n&&i.has(n)&&c.filter(e=>String(e.invoice_number||``).trim()===n).length===1&&(o=!0)}else o=!n||i.has(n);return o?(t.pending_sheet_upload?(l=!0,e.push({...t,pending_sheet_upload:!1})):e.push(t),e):(t.pending_sheet_upload&&e.push(t),e)},[]);return u.length!==c.length||l?(Ze(u),u.length!==c.length):!1}catch{return!1}},async createInvoice(e){if(!L(H()))throw Error(De);try{return await W(await B(`/invoices`,{method:`POST`,headers:U(),body:JSON.stringify(e)},12e3))}catch(t){if(z(t))return await Ht(e);throw t}},async updateInvoice(e,t){try{return await W(await B(`/invoices/${e}`,{method:`PUT`,headers:U(),body:JSON.stringify(t)}))}catch(n){if(z(n)){let n=Xe(),r=Je(),i=H(),a=n.findIndex(t=>t.id===e);if(a===-1)throw Error(`الفاتورة غير موجودة محلياً`);let o=n[a],s=(t.pharmacy_name||``).trim(),c=s?r.find(e=>e.name.trim().toLowerCase()===s.toLowerCase()):r.find(e=>e.id===(t.pharmacy_id||o.pharmacy_id));!c&&s&&(c={id:`ph-`+Date.now()+`-`+Math.random().toString(36).slice(2,5),name:s,city:`بغداد`,area:(t.pharmacy_area||``).trim()||ie(s)||``,address:t.pharmacy_area?`بغداد - ${t.pharmacy_area}`:`بغداد`,phone:``,assigned_rep_id:i?.id,assigned_rep_name:i?.full_name||`مندوب ميداني`,total_invoices:0,total_sales:0},r.unshift(c),Ye(r));let l=o.items||[],u=o.total_sales_amount,d=o.total_pieces_count,f=o.total_bonus_count;t.items&&t.items.length>0&&(u=0,d=0,f=0,l=t.items.map((e,t)=>{let n=Number(e.sold_quantity||1),r=Number(e.custom_unit_price??5e3),i=Number(e.custom_bonus??Math.floor(n/10)),a=n*r;return u+=a,d+=n,f+=i,{id:`item-${Date.now()}-${t}`,product_id:e.product_id||`pr-1`,product_name_snapshot:e.custom_product_name||`مستحضر دوائي`,dosage_form:e.dosage_form||re(e.custom_product_name||``),sold_quantity:n,historical_unit_price:r,bonus_quantity:i,total_quantity:n+i,line_total:a}}));let p=s||c?.name||o.pharmacy_name||``,m=(t.pharmacy_area||``).trim()||o.pharmacy_area||c?.area||ie(p)||``,h={...o,pharmacy_id:c?.id||t.pharmacy_id||o.pharmacy_id,pharmacy_name:p,pharmacy_area:m,invoice_number:t.invoice_number??o.invoice_number,invoice_date:t.invoice_date??o.invoice_date,notes:t.notes??o.notes,total_sales_amount:u,total_pieces_count:d,total_bonus_count:f,items:l};return n[a]=h,Ze(n),zt({action:`edit_invoice`,invoice_number:h.invoice_number,previous_invoice_number:o.invoice_number,pharmacy_name:h.pharmacy_name,invoice_date:h.invoice_date,rows:Nt(h)}),await Promise.race([Bt({keepalive:!0}),new Promise(e=>setTimeout(e,3e3))]).catch(()=>{}),h}throw n}},async reviewInvoice(e,t,n){try{return await W(await B(`/invoices/${e}/review`,{method:`PUT`,headers:U(),body:JSON.stringify({status:t,rejection_reason:n})}))}catch(r){if(z(r)){let r=Xe(),i=r.findIndex(t=>t.id===e);if(i===-1)throw Error(`الفاتورة غير موجودة`);return r[i]={...r[i],status:t,rejection_reason:n},Ze(r),zt({action:`edit_invoice`,invoice_number:r[i].invoice_number,previous_invoice_number:r[i].invoice_number,pharmacy_name:r[i].pharmacy_name,invoice_date:r[i].invoice_date,rows:Nt(r[i])}),await Promise.race([Bt({keepalive:!0}),new Promise(e=>setTimeout(e,3e3))]).catch(()=>{}),r[i]}throw r}},async deleteInvoice(e,t){try{await W(await B(`/invoices/${e}`,{method:`DELETE`,headers:U()}))}catch(n){if(z(n)){let n=Xe(),r=n.find(t=>t.id===e),i=n.filter(t=>t.id!==e);if(Ze(i),r?.invoice_number||r?.pharmacy_name){let e=String(r.invoice_number||``).trim(),n=!!(e&&i.some(t=>String(t.invoice_number||``).trim()===e)),a=!!(t?.preserveOriginalInSheet||n);zt({action:`delete_invoice`,invoice_number:e,pharmacy_name:r.pharmacy_name,invoice_date:(r.invoice_date||``).split(`T`)[0],delete_mode:a?`duplicate_copy`:`all`}),await Promise.race([Bt({keepalive:!0}),new Promise(e=>setTimeout(e,2500))]).catch(()=>{})}return}throw n}},async testGeminiKey(e){let t=e.trim();if(!t)return{valid:!1,message:`يرجى إدخال مفتاح Google Gemini API أولاً.`};let n=`تعذر التحقق من المفتاح`;for(let e of ot){let r=`https://generativelanguage.googleapis.com/v1beta/models/${e}:generateContent?key=${encodeURIComponent(t)}`;try{let i=await fetch(r,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({contents:[{parts:[{text:`أجب بكلمة OK فقط`}]}],generationConfig:{maxOutputTokens:10}})});if(i.ok)return ze(t),bt(t),{valid:!0,model:e,provider:`gemini`,message:`تم التحقق! Google Gemini يعمل بنجاح على (${e}) ✅`};let a=(await i.json().catch(()=>({})))?.error?.message||i.statusText||``;if(n=ct(i.status,a),i.status===400&&a.toLowerCase().includes(`api_key_invalid`)||i.status===403&&a.toLowerCase().includes(`free tier`))return{valid:!1,provider:`gemini`,message:n}}catch(e){n=`تعذر الاتصال بخوادم Google Gemini: `+(e?.message||`خطأ شبكة`)}}return{valid:!1,provider:`gemini`,message:n}},async uploadInvoiceFile(e,t,n){let r=(e,t,r)=>{n?.onProgress?.({stage:e,percent:t,message:r})};Date.now()-Ct>15e3&&await G.syncSharedGeminiKeyFromSheet().catch(()=>``);let i=Re(),a=vt(i),o=!nt(),s=e.size>0?await _t(e):``,c=s?`${s}:${gt(i)}:${a.open?`open`:`closed`}:${t||``}:${o?Ie():`browser`}`:``;if(c){let e=mt.get(c);if(e&&Date.now()<=e.expiresAt){r(`done`,100,`تم استرجاع النتيجة فوراً من الذاكرة المؤقتة (SHA-256 Cache)`),e.result?.image_url&&n?.onPreparedPreview&&e.result?._prepMeta&&n.onPreparedPreview(e.result.image_url,e.result._prepMeta);let{_prepMeta:t,...i}=e.result;return{...i,cached:!0}}e&&mt.delete(c)}let l=(e,t)=>{if(c&&!e?.queued_offline){if(mt.size>=ut){let e=mt.keys().next().value;e&&mt.delete(e)}mt.set(c,{expiresAt:Date.now()+lt,result:{...e,_prepMeta:t}})}};r(`inspect`,10,`فحص سلامة الملف وصيغته الحقيقية...`);let u=await O(e,1600,.82);if(r(`prepare`,25,u.wasConvertedFromHeic?`تم تحويل HEIC وتصغير الصورة للموبايل...`:u.wasCompressed?`تم ضغط الصورة (${Math.round(u.finalSizeBytes/1024)} KB) وتصحيح الاتجاه...`:`تم التحقق من الملف جاهز للمعالجة...`),n?.onPreparedPreview&&!u.inspection.isPdf)try{let e=URL.createObjectURL(u.file);n.onPreparedPreview(e,u)}catch{}let d={originalSizeBytes:u.originalSizeBytes,finalSizeBytes:u.finalSizeBytes,wasCompressed:u.wasCompressed,wasConvertedFromHeic:u.wasConvertedFromHeic,kind:u.inspection.kind};try{let e=new FormData;if(e.append(`invoice_file`,u.file),t&&e.append(`pharmacy_id`,t),r(`upload`,35,`رفع الفاتورة للخادم...`),o){let t=await rt(`/invoices/ocr`,e,e=>r(`upload`,35+Math.round(e*.25),`جاري الرفع (${e}%)...`),2,28e3);if(t?.jobId&&!t?.extracted_items){r(`analyze`,65,`بدأ التحليل في الخلفية...`);let e=await it(t.jobId,(e,t)=>r(`analyze`,Math.max(65,e),t)),n=e?.needs_review??Number(e?.confidence||0)<.75,i={...e,needs_review:n,ocr_engine:`backend`,prepared_info:d};return l(i,u),r(`done`,100,`اكتملت القراءة بنجاح`),i}let n=t?.needs_review??Number(t?.confidence||0)<.75,i={...t,needs_review:n,ocr_engine:`backend`,prepared_info:d};return l(i,u),r(`done`,100,`اكتملت القراءة بنجاح`),i}throw TypeError(`Localhost backend skipped on HTTPS origin`)}catch(e){if(!z(e))throw e;r(`analyze`,45,`تحضير البيانات للقراءة...`);let n=await at(u.file,u.inspection.mimeType),o,s=a.open;if(i){if(a.open)o=`قاطع الدائرة مفعّل (${Math.max(1,Math.ceil(a.remainingMs/6e4))} د متبقية بعد خطأ ${a.statusCode||`403/429`}) — التحويل الفوري للمحرك المحلي`,console.warn(`OCR Circuit Breaker open — skipping AI call:`,o);else try{let{parsed:e,modelUsed:t}=await St(n,i,(e,t)=>r(`analyze`,e,t)),a=Array.isArray(e.items)?e.items:[],o=Number(e.confidence||.92),s=a.length===0||o<.75,c={extracted_items:a,invoice_number:e.invoice_number||void 0,invoice_date:e.invoice_date||new Date().toISOString().split(`T`)[0],pharmacy_name:e.pharmacy_name||void 0,pharmacy_area:e.pharmacy_area||void 0,image_url:n.dataUrl,confidence:o,offline_mode:!1,ocr_engine:`gemini-browser`,ocr_warning:u.warning,needs_review:s,needs_review_reason:s?`ثقة القراءة الذكية منخفضة أو لم تُكتشف أصناف — يرجى مراجعة الفاتورة قبل الحفظ.`:void 0,cached:!1,circuit_breaker_open:!1,prepared_info:d};return l(c,u),r(`done`,100,`اكتملت القراءة بالذكاء الاصطناعي (${t})`),c}catch(e){let t=String(e?.message||`فشل تحليل الفاتورة عبر محرك الذكاء الاصطناعي`);o=t,(e?.shouldTripCircuit||e?.statusCode===403||e?.statusCode===429)&&(yt(i,t,e?.statusCode),s=!0),console.warn(`Browser AI Vision OCR failed:`,o)}}return typeof navigator<`u`&&navigator.onLine===!1?(et({fileName:u.file.name,mimeType:n.mimeType,dataUrl:n.dataUrl,pharmacyId:t,reason:`انقطاع اتصال الإنترنت أثناء الرفع`}),r(`done`,100,`تم حفظ الفاتورة محلياً لحين عودة الاتصال`),{extracted_items:[],invoice_number:``,invoice_date:new Date().toISOString().split(`T`)[0],pharmacy_name:``,pharmacy_area:``,image_url:n.dataUrl,confidence:0,raw_text:``,offline_mode:!0,ocr_engine:`offline-manual`,queued_offline:!0,needs_review:!0,needs_review_reason:`لا يوجد اتصال بالإنترنت — ستُستكمل المراجعة عند عودة الاتصال.`,cached:!1,circuit_breaker_open:s,ocr_error:o||`لا يوجد اتصال بالإنترنت — تم حفظ الصورة في الطابور المحلي لإكمال التحليل لاحقاً.`,prepared_info:d}):(r(`done`,100,`تم إرفاق الفاتورة`),{extracted_items:[],invoice_number:``,invoice_date:new Date().toISOString().split(`T`)[0],pharmacy_name:``,pharmacy_area:``,image_url:n.dataUrl,confidence:0,raw_text:``,offline_mode:!0,ocr_engine:`offline-manual`,needs_review:!0,needs_review_reason:`تعذر الاستخراج الآلي — هذه الفاتورة تحتاج إدخالاً ومراجعة يدوية قبل الحفظ.`,cached:!1,circuit_breaker_open:s,ocr_error:o,ocr_warning:o?`فشلت القراءة الذكية: ${o}`:u.inspection.isPdf?`قراءة ملفات PDF تلقائياً على الموبايل تتطلب إدخال مفتاح Google Gemini API في إعدادات Gemini بالأعلى.`:u.warning||`لم يتم تفعيل مفتاح Google Gemini أو الخادم — يمكنك تعبئة البيانات يدوياً أو إضافة مفتاح Google Gemini بالأعلى.`,prepared_info:d})}},async uploadInvoiceFilesBatch(e){try{let t=new FormData;return e.forEach(e=>t.append(`invoice_files`,e)),await W(await B(`/invoices/ocr-batch`,{method:`POST`,headers:qt(),body:t},45e3))}catch(t){if(z(t)){let t=await Promise.all(e.map(async e=>{let t=await G.uploadInvoiceFile(e);return{file_name:e.name,image_url:t.image_url,invoice_number:t.invoice_number||``,invoice_date:t.invoice_date||new Date().toISOString().split(`T`)[0],pharmacy_id:t.pharmacy_id||``,pharmacy_name:t.pharmacy_name||``,extracted_items:t.extracted_items||[],total_amount:0,confidence:t.confidence||1,ocr_engine:t.offline_mode?`local-offline`:`gemini-browser`}}));return{results:t,total:t.length,successful:t.length}}throw t}},async createInvoicesBatch(e){if(!L(H()))throw Error(De);try{return await W(await B(`/invoices/batch`,{method:`POST`,headers:U(),body:JSON.stringify({invoices:e})},15e3))}catch(t){if(z(t)){let t=await It(),n=[],r=[];for(let i of e){let e=Vt(i,{skipSheetCheck:!0});n.push(e);let a=Rt(e,t);a.isDuplicate?r.push({invoice_number:String(e.invoice_number||``),pharmacy_name:e.pharmacy_name||``,invoice_date:(e.invoice_date||``).split(`T`)[0],reason:a.reason}):zt({action:`add_invoice`,invoice_number:String(e.invoice_number||``),pharmacy_name:e.pharmacy_name,invoice_date:e.invoice_date,rows:Nt(e)})}return r.length>0&&kt(r),await Promise.race([Bt({keepalive:!0}),new Promise(e=>setTimeout(e,3500))]).catch(()=>{}),{count:n.length,invoices:n,skipped_duplicates:r}}throw t}},async getSheetsData(){if(!L(H()))throw Error(De);try{return await W(await B(`/sheets/data`,{headers:U()}))}catch(e){if(z(e)){let e=R(),t=Ve(),n=Xe().flatMap(e=>Nt(e).map(e=>({...e,cells:[e.invoice_number,e.invoice_date,e.warehouse_name,e.pharmacy_name,e.area,e.city,e.product_name,e.dosage_form,String(e.quantity),String(e.unit_price),String(e.bonus_quantity),String(e.line_total),String(e.total_invoice),e.rep_name,e.status,e.timestamp]}))),r=await Ft();return r.reachable&&r.rows.length>0?{headers:r.headers&&r.headers.length>0?r.headers:[`رقم الفاتورة`,`تاريخ الفاتورة`,`اسم المذخر`,`اسم الصيدلية`,`المنطقة / المكان`,`المدينة / المحافظة`,`اسم المادة الدوائية`,`نوع المادة / الشكل الدوائي`,`الكمية`,`سعر المفرد (د.ع)`,`البونص المجاني`,`المجموع (د.ع)`,`صافي الفاتورة الكلي (د.ع)`,`اسم المندوب العلمي`,`حالة الاعتماد`,`وقت وتاريخ الإدراج`],rows:r.rows,rawCount:r.rows.length,sheet_id:e,sheet_url:t}:r.reachable&&r.rows.length===0?{headers:r.headers&&r.headers.length>0?r.headers:[`رقم الفاتورة`,`تاريخ الفاتورة`,`اسم المذخر`,`اسم الصيدلية`,`المنطقة / المكان`,`المدينة / المحافظة`,`اسم المادة الدوائية`,`نوع المادة / الشكل الدوائي`,`الكمية`,`سعر المفرد (د.ع)`,`البونص المجاني`,`المجموع (د.ع)`,`صافي الفاتورة الكلي (د.ع)`,`اسم المندوب العلمي`,`حالة الاعتماد`,`وقت وتاريخ الإدراج`],rows:[],rawCount:0,sheet_id:e,sheet_url:t}:{headers:[`رقم الفاتورة`,`تاريخ الفاتورة`,`اسم المذخر`,`اسم الصيدلية`,`المنطقة / المكان`,`المدينة / المحافظة`,`اسم المادة الدوائية`,`نوع المادة / الشكل الدوائي`,`الكمية`,`سعر المفرد (د.ع)`,`البونص المجاني`,`المجموع (د.ع)`,`صافي الفاتورة الكلي (د.ع)`,`اسم المندوب العلمي`,`حالة الاعتماد`,`وقت وتاريخ الإدراج`],rows:n,rawCount:n.length,sheet_id:e,sheet_url:t}}throw e}},async syncAllToSheets(){if(!L(H()))throw Error(De);try{return await W(await B(`/sheets/sync-all`,{method:`POST`,headers:U()},15e3))}catch(e){if(z(e)){let e=Xe(),t=await It(),n=ue(t),r=[],i=new Set,a=[],o=0;for(let s of e){let e=ce(s.invoice_date||``),c=fe({pharmacy_name:s.pharmacy_name,invoice_date:s.invoice_date,items:s.items});if(c&&i.has(c)){r.push({invoice_number:String(s.invoice_number||``),pharmacy_name:s.pharmacy_name||``,invoice_date:e,reason:`نسخة مكررة داخل النظام`});continue}c&&i.add(c);let l=de(s,t,n);if(l.isDuplicate){r.push({invoice_number:String(s.invoice_number||``),pharmacy_name:s.pharmacy_name||``,invoice_date:e,reason:l.reason});continue}let u=Nt(s);a.push(...u),zt({action:l.statusChangedOnly?`edit_invoice`:`add_invoice`,invoice_number:String(s.invoice_number||``),previous_invoice_number:l.statusChangedOnly?String(s.invoice_number||``):void 0,pharmacy_name:s.pharmacy_name,invoice_date:s.invoice_date,rows:u}),o++}return r.length>0&&kt(r),await Promise.race([Bt({keepalive:!0}),new Promise(e=>setTimeout(e,4e3))]).catch(()=>{}),{success:!0,rows_count:a.length,skipped_duplicates:r,message:r.length>0?`تمت مزامنة ${o} فواتير جديدة/معدلة (${a.length} سطراً) وتخطي ${r.length} فواتير مكررة فقط.`:o>0?`تمت المزامنة السحابية لـ ${o} فواتير (${a.length} سطراً) بنجاح 🚀`:`كافة الفواتير متطابقة ومزامنة بالفعل مع كوكل شيت ✅`,mode:`cloud-direct`,timestamp:new Date().toISOString()}}throw e}},async getSheetsGapStatus(){if(!L(H()))throw Error(De);try{return await W(await B(`/sheets/gap-status`,{headers:U()}))}catch(e){if(z(e)){let e=Xe(),t=await Ft(),n=t.rows,r=ue(n),i=e.filter(e=>!de(e,n,r).isDuplicate);return{system_invoices_count:e.length,sheet_rows_count:t.reachable?n.length:e.length,sheet_unique_invoices_count:t.reachable?r.length:e.length,unuploaded_count:i.length,unuploaded_invoices:i.map(e=>({id:e.id,invoice_number:String(e.invoice_number||``),invoice_date:e.invoice_date,pharmacy_name:e.pharmacy_name||``,total_sales_amount:Number(e.total_sales_amount||0),items_count:e.items?.length||0})),missing_in_system_count:0,has_gap:i.length>0}}throw e}},async syncUnuploadedToSheets(){if(!L(H())||!L(H()))throw Error(De);try{return await W(await B(`/sheets/sync-unuploaded`,{method:`POST`,headers:U()},15e3))}catch(e){if(z(e)){let e=Xe(),t=await It(),n=ue(t),r=[],i=new Set,a=0,o=0;for(let s of e){let e=fe({pharmacy_name:s.pharmacy_name,invoice_date:s.invoice_date,items:s.items});if(e&&i.has(e)){r.push({invoice_number:String(s.invoice_number||``),pharmacy_name:s.pharmacy_name||``,invoice_date:(s.invoice_date||``).split(`T`)[0],reason:`نسخة مكررة داخل النظام`});continue}e&&i.add(e);let c=de(s,t,n);if(c.isDuplicate){r.push({invoice_number:String(s.invoice_number||``),pharmacy_name:s.pharmacy_name||``,invoice_date:(s.invoice_date||``).split(`T`)[0],reason:c.reason});continue}let l=Nt(s);zt({action:c.statusChangedOnly?`edit_invoice`:`add_invoice`,invoice_number:String(s.invoice_number||``),previous_invoice_number:c.statusChangedOnly?String(s.invoice_number||``):void 0,pharmacy_name:s.pharmacy_name,invoice_date:s.invoice_date,rows:l}),a++,o+=l.length}return r.length>0&&kt(r),await Promise.race([Bt({keepalive:!0}),new Promise(e=>setTimeout(e,3500))]).catch(()=>{}),{success:!0,synced_count:a,rows_count:o,skipped_duplicates:r,message:r.length>0?`تم رفع ${a} فواتير جديدة (بما فيها المختلفة في الكميات) وتخطي ${r.length} فواتير مطابقة تماماً`:`تمت مزامنة ${a} فواتير غير مرفوعة (${o} سطراً) بنجاح`}}throw e}},async flushSheetsSyncOutbox(e){return Bt(e)},async deleteDuplicateSheetInvoice(e){let t=String(e.invoice_number||``).trim(),n=Xe();if(t){let e=n.filter(e=>String(e.invoice_number||``).trim()===t);if(e.length>1){let t=e[e.length-1];Ze(n.filter(e=>e.id!==t.id))}}zt({action:`delete_invoice`,invoice_number:t,pharmacy_name:e.pharmacy_name,invoice_date:e.invoice_date,timestamp:e.timestamp,delete_mode:`duplicate_copy`}),await Promise.race([Bt({keepalive:!0}),new Promise(e=>setTimeout(e,3e3))]).catch(()=>{})},async repairGoogleSheet(){let e=Be();return!e||!e.startsWith(`http`)?{success:!1,message:`رابط Webhook غير مفعّل.`}:(await fetch(e,{method:`POST`,mode:`no-cors`,headers:{"Content-Type":`text/plain;charset=utf-8`},body:JSON.stringify({action:`repair`,spreadsheetId:R(),sheetName:`الفواتير`})}),{success:!0,message:`تم إرسال أمر إصلاح الأعمدة المزاحة وفحص التكرار وتلوين الصفوف في كوكل شيت.`})},async checkWebhookScriptStatus(){let e=Be();if(!e||!e.startsWith(`http`))return{scriptVersion:0,isOutdated:!1};try{let t=await fetch(e,{method:`GET`});if(!t.ok)return{scriptVersion:0,isOutdated:!1};let n=await t.json().catch(()=>null);if(!n)return{scriptVersion:0,isOutdated:!1};let r=Number(n.script_version||1);return{scriptVersion:r,isOutdated:r<10}}catch{return{scriptVersion:0,isOutdated:!1}}},getPendingSkippedSheetDuplicates:Ot,addSkippedSheetDuplicateNotices:kt,clearSkippedSheetDuplicateNotices:At,async importMissingFromSheets(){if(!L(H()))throw Error(De);try{return await W(await B(`/sheets/import-missing`,{method:`POST`,headers:U()},15e3))}catch(e){if(z(e))return{imported_count:0,message:`تم التحقق من الشيت في الوضع السحابي المباشر`};throw e}},async getSheetsConfig(){if(!L(H()))throw Error(De);try{return await W(await B(`/sheets/config`,{headers:U()}))}catch(e){if(z(e))return{sheet_id:R(),sheet_url:Ve(),webhook_url:Be(),is_connected:!!Be(),apps_script_code:k,headers:[`رقم الفاتورة`,`تاريخ الفاتورة`,`اسم المذخر`,`اسم الصيدلية`,`المنطقة / المكان`,`المدينة / المحافظة`,`اسم المادة الدوائية`,`نوع المادة / الشكل الدوائي`,`الكمية`,`سعر المفرد (د.ع)`,`البونص المجاني`,`المجموع (د.ع)`,`صافي الفاتورة الكلي (د.ع)`,`اسم المندوب العلمي`,`حالة الاعتماد`,`وقت وتاريخ الإدراج`]};throw e}},async updateSheetsWebhook(e){let t=e.trim(),n=H();n?(localStorage.setItem(`pharma_webhook_url::${n.id}`,t),Gt({...n,webhook_url:t||void 0})):localStorage.setItem(`pharma_webhook_url`,t);try{return await W(await B(`/sheets/config`,{method:`POST`,headers:U(),body:JSON.stringify({webhook_url:t})}))}catch(e){if(z(e))return{webhook_url:t,is_connected:!!t};throw e}},async getKPIs(){if(!L(H()))return{total_invoices:0,total_pharmacies_visited:0,total_pieces_sold:0,total_bonus_given:0,total_bonus_pieces:0,total_revenue:0,total_sales_amount:0,approved_invoices:0,pending_invoices:0};try{return await W(await B(`/analytics/kpis`,{headers:U()}))}catch(e){if(z(e)){let e=Xe(),t=Je(),n=e.reduce((e,t)=>e+Number(t.total_sales_amount||0),0),r=e.reduce((e,t)=>e+Number(t.total_pieces_count||0),0),i=e.reduce((e,t)=>e+Number(t.total_bonus_count||0),0);return{total_invoices:e.length,total_pharmacies_visited:t.length,total_pieces_sold:r,total_bonus_given:i,total_bonus_pieces:i,total_revenue:n,total_sales_amount:n,approved_invoices:e.filter(e=>e.status===`approved`).length,pending_invoices:e.filter(e=>e.status===`pending_review`).length}}throw e}},async getRepKPIs(e){try{return await W(await B(`/analytics/kpis?rep_id=${e}`,{headers:U()}))}catch(e){if(z(e))return G.getKPIs();throw e}},async getAdminUsersFromSheet(){return wt()},async syncSharedGeminiKeyFromSheet(){return I(await wt().catch(()=>[]))||Re()},async syncUserSessionFromMasterSheet(){let e=H();if(!e)return{user:null,sharedGeminiKey:``};let t=await wt().catch(()=>[]),n=I(t);if(t.length===0)return{user:e,sharedGeminiKey:n||Re()};let r=P(e.full_name),i=t.find(t=>P(t.full_name)===r||t.email.toLowerCase()===e.email.toLowerCase());if(!i)return{user:e,sharedGeminiKey:n||Re()};let a={...e,full_name:i.full_name,role:i.role,sheet_id:i.sheet_id,sheet_url:i.sheet_url,webhook_url:i.webhook_url,gemini_api_key:i.gemini_api_key||n||void 0};return(a.sheet_id!==e.sheet_id||a.webhook_url!==e.webhook_url||a.role!==e.role||a.full_name!==e.full_name||a.gemini_api_key!==e.gemini_api_key)&&Gt(a),{user:a,sharedGeminiKey:n||a.gemini_api_key||``}},async adminSetSharedGeminiKey(e){let t=e.trim();t?(localStorage.setItem(Oe,t),localStorage.setItem(`pharma_gemini_api_key`,t)):(localStorage.removeItem(Oe),localStorage.removeItem(`pharma_gemini_api_key`));let n=H();n&&Gt({...n,gemini_api_key:t||void 0});try{return await W(await B(`/users/shared-gemini-key`,{method:`POST`,headers:U(),body:JSON.stringify({gemini_api_key:t,admin_webhook_url:Pe()})},1e4)),{verifiedInSheet:!0,message:`تم حفظ مفتاح Gemini وتعميمه لجميع المستخدمين في الشيت الرئيسي بنجاح ✅`}}catch(e){if(!z(e))throw e;let n=Pe();if(!n)throw Error(`يرجى تحديد رابط Apps Script Webhook للشيت الرئيسي أولاً`);let r=await Tt(n,{action:`set_shared_gemini_key`,adminSpreadsheetId:M,spreadsheetId:M,gemini_api_key:t});if(r.parsed&&r.parsed.success===!1)throw Error(r.parsed.error||`فشل تعميم مفتاح Gemini في الشيت الرئيسي`);await new Promise(e=>setTimeout(e,1200));let i=I(await wt().catch(()=>[]))===t;return{verifiedInSheet:i,message:i?`تم حفظ مفتاح Gemini في العمود E وتعميمه لجميع المستخدمين في الشيت الرئيسي بنجاح ✅`:`تم إرسال المفتاح للشيت الرئيسي (تأكد من تحديث Apps Script للإصدار v10 على الشيت الرئيسي ليُحفظ في العمود E للجميع).`}}},async adminSyncTemplateToAllSheets(e){let t=e?.mode===`tabs_only`?`tabs_only`:`full`,n=t===`tabs_only`?`sync_tabs_only`:`sync_template_to_all`,r=e=>{if(!e)return;if(e.success===!1)throw Error(e.error||e.message||`تعذر مزامنة أوراق و Pivot Tables الأدمن`);let t=Number(e.script_version||0);if(t<10||e.updatedSheets===void 0)throw Error(`السكربت المنشور على شيت الأدمن هو الإصدار (v${t||`قديم`}) ولا يدعم استنساخ الأوراق و Pivot Tables بالكامل. انسخ كود v10 والصقه في Apps Script ← Deploy ← Manage deployments ← Edit ← New version ← Deploy.`)};try{let n=await W(await B(`/users/sync-template-all`,{method:`POST`,headers:U(),body:JSON.stringify({admin_webhook_url:Pe(),targetIds:e?.targetIds||[],targetSpreadsheetId:e?.targetSpreadsheetId,mode:t})},45e3));return r(n),n}catch(i){if(!z(i))throw i;let a=Pe();if(!a)throw Error(`لا يوجد رابط Apps Script المركزي للأدمن`);let o=await Tt(a,{action:n,mode:t,adminSpreadsheetId:M,spreadsheetId:je,targetSpreadsheetId:e?.targetSpreadsheetId,targetIds:e?.targetIds||[]},45e3);if(o.opaque)throw Error(`تعذر قراءة استجابة Google Apps Script — تأكد من نشر كود v10 بصلاحية Anyone.`);return r(o.parsed),o.parsed||{updatedSheets:0,totalTargets:0,message:`تمت مزامنة أوراق و Pivot Tables الأدمن بنجاح ✅`}}},async adminUnifyWebhookUrl(e,t=`set`){let n=(e||Pe()||Me).trim(),r=e=>{if(!e)return;if(e.success===!1)throw Error(e.error||e.message||`تعذر توحيد رابط السكربت المركزي`);let t=Number(e.script_version||0);if(t<10||e.updated===void 0)throw Error(`السكربت المنشور على شيت الأدمن هو الإصدار (v${t||`قديم`}) ولا يدعم أمر توحيد عمود D. يرجى نشر كود v10 (New version) أولاً.`)};try{let e=await W(await B(`/users/unify-webhook`,{method:`POST`,headers:U(),body:JSON.stringify({centralWebhookUrl:n,mode:t,admin_webhook_url:Pe()})},2e4));return r(e),e}catch(e){if(!z(e))throw e;let i=Pe();if(!i)throw Error(`يرجى تحديد رابط Apps Script Webhook للشيت الرئيسي أولاً`);let a=await Tt(i,{action:`unify_admin_webhook`,adminSpreadsheetId:M,spreadsheetId:M,centralWebhookUrl:n,mode:t},2e4);if(a.opaque)throw Error(`تعذر قراءة استجابة Google Apps Script — تأكد من نشر كود v10 بصلاحية Anyone.`);return r(a.parsed),a.parsed||{updated:0,message:`تم إرسال أمر توحيد رابط سكربت الأدمن المركزي لجميع الحسابات بنجاح ⚡`}}},async checkAdminWebhookVersion(){let e=Pe();if(!e||!e.startsWith(`http`))return{scriptVersion:0,isOutdated:!0};try{let t=await fetch(`${e}?action=users&_t=${Date.now()}`,{method:`GET`});if(!t.ok)return{scriptVersion:0,isOutdated:!1};let n=await t.json().catch(()=>null);if(!n)return{scriptVersion:0,isOutdated:!1};let r=Number(n.script_version||1);return{scriptVersion:r,isOutdated:r<10}}catch{return{scriptVersion:0,isOutdated:!1}}},async adminAddSheetUser(e){let t=e.full_name.trim(),n=N(e.password.trim()),r=e.gemini_api_key?.trim()||Re();try{return await W(await B(`/users/add-to-sheet`,{method:`POST`,headers:U(),body:JSON.stringify({full_name:t,password:n,sheet_url:e.sheet_url?.trim()||``,webhook_url:e.webhook_url?.trim()||``,gemini_api_key:r||``,admin_webhook_url:Pe()})},1e4)),{verifiedInSheet:!0,message:`تمت إضافة المستخدم إلى الشيت الرئيسي بنجاح`}}catch(i){if(!z(i))throw i;let a=Pe();if(!a)throw Error(`يرجى تحديد رابط Apps Script Webhook للشيت الرئيسي أولاً`);let o=await Tt(a,{action:`add_user`,adminSpreadsheetId:M,spreadsheetId:M,user:{full_name:t,password_hash:n,sheet_url:e.sheet_url?.trim()||``,sheet_id:ye(e.sheet_url),webhook_url:e.webhook_url?.trim()||``,gemini_api_key:r||``}});if(o.parsed&&o.parsed.success===!1)throw Error(o.parsed.error||`فشل إضافة المستخدم للشيت الرئيسي`);await new Promise(e=>setTimeout(e,1200));let s=(await wt().catch(()=>[])).some(e=>P(e.full_name)===P(t));return{verifiedInSheet:s,message:s?`تمت إضافة المستخدم وتوثيقه في الشيت الرئيسي بنجاح ✅`:`تم إرسال الطلب إلى Google Apps Script (تأكد من تحديث السكربت للإصدار v10 إذا لم يظهر الصف فوراً).`}}},async adminUpdateSheetUser(e){let t=e.newName?.trim(),n=e.newPassword!==void 0&&e.newPassword.trim()!==``?N(e.newPassword.trim()):void 0;try{return await W(await B(`/users/update-in-sheet`,{method:`PUT`,headers:U(),body:JSON.stringify({rowNumber:e.rowNumber,currentName:e.currentName,newName:t,newPassword:n,newSheetUrl:e.newSheetUrl?.trim(),newWebhookUrl:e.newWebhookUrl?.trim(),newGeminiApiKey:e.newGeminiApiKey?.trim(),admin_webhook_url:Pe()})},1e4)),{verifiedInSheet:!0,message:`تم تعديل المستخدم في الشيت الرئيسي بنجاح`}}catch(r){if(!z(r))throw r;let i=Pe();if(!i)throw Error(`يرجى تحديد رابط Apps Script Webhook للشيت الرئيسي أولاً`);let a=await Tt(i,{action:`update_user`,adminSpreadsheetId:M,spreadsheetId:M,rowNumber:e.rowNumber,currentName:e.currentName,newName:t,newPassword:n,newSheetUrl:e.newSheetUrl?.trim(),newWebhookUrl:e.newWebhookUrl?.trim(),newGeminiApiKey:e.newGeminiApiKey?.trim()});if(a.parsed&&a.parsed.success===!1)throw Error(a.parsed.error||`فشل تعديل المستخدم في الشيت الرئيسي`);await new Promise(e=>setTimeout(e,1200));let o=(await wt().catch(()=>[])).find(t=>t.rowNumber===e.rowNumber),s=!(!o||t&&P(o.full_name)!==P(t)||n&&N(o.password_hash)!==n);return{verifiedInSheet:s,message:s?`تم تعديل الصف وحفظه في الشيت الرئيسي بنجاح ✅`:`تم إرسال التعديل للويب هوك (تأكد من نشر Apps Script v10 مع صلاحية الشيت الرئيسي إن لم يتغير الصف).`}}},async adminDeleteSheetUser(e){try{return await W(await B(`/users/delete-from-sheet`,{method:`DELETE`,headers:U(),body:JSON.stringify({rowNumber:e.rowNumber,currentName:e.currentName,admin_webhook_url:Pe()})},1e4)),{verifiedInSheet:!0,message:`تم حذف المستخدم من الشيت الرئيسي بنجاح`}}catch(t){if(!z(t))throw t;let n=Pe();if(!n)throw Error(`يرجى تحديد رابط Apps Script Webhook للشيت الرئيسي أولاً`);let r=await Tt(n,{action:`delete_user`,adminSpreadsheetId:M,spreadsheetId:M,rowNumber:e.rowNumber,currentName:e.currentName});if(r.parsed&&r.parsed.success===!1)throw Error(r.parsed.error||`فشل حذف المستخدم من الشيت الرئيسي`);await new Promise(e=>setTimeout(e,1200));let i=(await wt().catch(()=>[])).some(t=>t.rowNumber===e.rowNumber&&P(t.full_name)===P(e.currentName));return{verifiedInSheet:!i,message:i?`تم إرسال أمر الحذف للويب هوك (تحقق من تحديث Apps Script للإصدار 9 على الشيت الرئيسي).`:`تم حذف المستخدم من الشيت الرئيسي بنجاح ✅`}}},async getUsers(){try{return await W(await B(`/users`,{headers:U()}))}catch(e){if(z(e)){let e=await wt();return e.length>0?e.map(({password_hash:e,username:t,...n})=>n):[]}throw e}},async generatePasswordHash(e){return W(await B(`/users/generate-hash`,{method:`POST`,headers:U(),body:JSON.stringify({password:e})}))},async getAdminSheetConfig(){try{return await W(await B(`/users/admin-sheet-config`,{headers:U()}))}catch(e){if(z(e))return{sheet_id:M,sheet_url:he,sheet_name:`الشيت الرئيسي`,columns:[{col:`A`,field:`full_name`,title:`الاسم`,example:`باقر علي`},{col:`B`,field:`password_hash`,title:`الرمز السري`,example:`123456`},{col:`C`,field:`sheet_url`,title:`صفحة كوكل شيت`,example:`https://docs.google.com/spreadsheets/d/...`},{col:`D`,field:`webhook_url`,title:`اي بي اي سكربت`,example:`https://script.google.com/macros/s/.../exec`},{col:`E`,field:`gemini_api_key`,title:`اي بي اي جمناي`,example:`AIzaSy...`}]};throw e}},async formatUserRow(e){return W(await B(`/users/format-row`,{method:`POST`,headers:U(),body:JSON.stringify(e)}))}},Jt=e=>e?.replace(/([a-z0-9])([A-Z])/g,`$1-$2`).toLowerCase();function Yt(e,t,n=[]){if(t==null)throw Error(`[lucide]: iconNode is required when icon name is used`);return{name:Jt(e),size:24,node:t,...n.length>0?{aliases:n}:{}}}var Xt=e=>{let t=``,n=!1;for(let r of e)r===`-`||r===`_`||r<=` `?n=t.length>0:(t.length===0?t+=r.toLowerCase():t+=n?r.toUpperCase():r,n=!1);return t},Zt=e=>{let t=Xt(e);return t.charAt(0).toUpperCase()+t.slice(1)},Qt=(...e)=>e.filter((e,t,n)=>!!e&&e.trim()!==``&&n.indexOf(e)===t).join(` `).trim(),$t={xmlns:`http://www.w3.org/2000/svg`,width:24,height:24,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,"stroke-width":2,"stroke-linecap":`round`,"stroke-linejoin":`round`};function en(e){return e!=null}function tn(e,t={}){let n=t.attributeNames??{},r=e=>n[e]??e,i=e.size??e.width??$t.width,a=e.size??e.height??$t.height,o=e.aliases?.filter(e=>typeof e==`string`&&e.trim()!==``).map(e=>`lucide-${e}`)??[],s=[...e.name?[`lucide-${e.name}`]:[],...o],c=t.className?.split(` `).filter(Boolean)??[],l=t.includeDefaultClasses===!1?Qt(...c):Qt(`lucide`,...s,...c),u=t.absoluteStrokeWidth?Number(t.strokeWidth??$t[`stroke-width`])*Number(e.size??e.width??$t.width)/Number(t.size??t.width??$t.width):t.strokeWidth??$t[`stroke-width`];return[`svg`,{...Object.entries($t).reduce((e,[t,n])=>(e[r(t)]=n,e),{}),...`color`in t&&t.color&&{[r(`stroke`)]:t.color},...`size`in t&&en(t.size)&&{[r(`width`)]:t.size,[r(`height`)]:t.size},...`width`in t&&en(t.width)&&{[r(`width`)]:t.width},...`height`in t&&en(t.height)&&{[r(`height`)]:t.height},[r(`stroke-width`)]:u,...l&&{[r(`class`)]:l},[r(`viewBox`)]:`0 0 ${i} ${a}`,...t.hasA11yProp===!1?{[r(`aria-hidden`)]:`true`}:{},...`attributes`in t&&t.attributes},e.node.map(e=>{let[n,i,a]=e,o=t.nonScalingStroke?{[r(`vector-effect`)]:`non-scaling-stroke`,...i}:i;return a?[n,o,a]:[n,o]})]}function nn(e,t={}){return tn(e,{...t,attributeNames:{...t.attributeNames,class:`className`,"stroke-width":`strokeWidth`,"stroke-linecap":`strokeLinecap`,"stroke-linejoin":`strokeLinejoin`,"vector-effect":`vectorEffect`}})}var rn=e=>{for(let t in e)if(t.startsWith(`aria-`)||t===`role`||t===`title`)return!0;return!1},an=(0,_.createContext)({}),on=()=>(0,_.useContext)(an),sn=(0,_.forwardRef)(({color:e,size:t,width:n,height:r,strokeWidth:i,absoluteStrokeWidth:a,nonScalingStroke:o,className:s=``,children:c,iconNode:l=[],icon:u={node:l,aliases:[],size:24},...d},f)=>{let{size:p=24,strokeWidth:m=2,absoluteStrokeWidth:h=!1,nonScalingStroke:g=!1,color:v=`currentColor`,className:y=``}=on()??{},b=!!c||rn(d),[x,S,C=[]]=nn(u,{color:e??v,width:n??t??p,height:r??t??p,strokeWidth:i??m,absoluteStrokeWidth:a??h,nonScalingStroke:o??g,className:Qt(y,s),hasA11yProp:b,attributes:d});return(0,_.createElement)(x,{ref:f,...S},[...C.map(([e,t])=>(0,_.createElement)(e,t)),...Array.isArray(c)?c:[c]])});function K(e,t=[],n=[]){let r=typeof e==`string`?Yt(e,t,n):e,i=(0,_.forwardRef)(({className:e,...t},n)=>(0,_.createElement)(sn,{ref:n,icon:r,className:e,...t}));return r.name&&(i.displayName=Zt(r.name)),i}var cn={name:`arrow-right`,size:24,node:[[`path`,{d:`M5 12h14`,key:`1ays0h`}],[`path`,{d:`m12 5 7 7-7 7`,key:`xquz4c`}]]};cn.node;var ln=K(cn),un={name:`building-complex`,size:24,node:[[`path`,{d:`M10 12h4`,key:`a56b0p`}],[`path`,{d:`M10 8h4`,key:`1sr2af`}],[`path`,{d:`M14 21v-3a2 2 0 0 0-4 0v3`,key:`1rgiei`}],[`path`,{d:`M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2`,key:`secmi2`}],[`path`,{d:`M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16`,key:`16ra0t`}]],aliases:[`building-2`]};un.node;var dn=K(un),fn={name:`calculator`,size:24,node:[[`rect`,{width:`16`,height:`20`,x:`4`,y:`2`,rx:`2`,key:`1nb95v`}],[`line`,{x1:`8`,x2:`16`,y1:`6`,y2:`6`,key:`x4nwl0`}],[`line`,{x1:`16`,x2:`16`,y1:`14`,y2:`18`,key:`wjye3r`}],[`path`,{d:`M16 10h.01`,key:`1m94wz`}],[`path`,{d:`M12 10h.01`,key:`1nrarc`}],[`path`,{d:`M8 10h.01`,key:`19clt8`}],[`path`,{d:`M12 14h.01`,key:`1etili`}],[`path`,{d:`M8 14h.01`,key:`6423bh`}],[`path`,{d:`M12 18h.01`,key:`mhygvu`}],[`path`,{d:`M8 18h.01`,key:`lrp35t`}]]};fn.node;var pn=K(fn),mn={name:`calendar`,size:24,node:[[`path`,{d:`M8 2v3`,key:`1ioesn`}],[`path`,{d:`M16 2v3`,key:`otl347`}],[`rect`,{x:`3`,y:`3`,width:`18`,height:`18`,rx:`2`,key:`h1oib`}],[`path`,{d:`M3 9h18`,key:`1pudct`}]]};mn.node;var hn=K(mn),gn={name:`camera`,size:24,node:[[`path`,{d:`M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z`,key:`18u6gg`}],[`circle`,{cx:`12`,cy:`13`,r:`3`,key:`1vg3eu`}]]};gn.node;var _n=K(gn),vn={name:`check`,size:24,node:[[`path`,{d:`M20 6 9 17l-5-5`,key:`1gmf2c`}]]};vn.node;var yn=K(vn),bn={name:`chevron-down`,size:24,node:[[`path`,{d:`m6 9 6 6 6-6`,key:`qrunsl`}]]};bn.node;var xn=K(bn),Sn={name:`chevron-left`,size:24,node:[[`path`,{d:`m15 18-6-6 6-6`,key:`1wnfg3`}]]};Sn.node;var Cn=K(Sn),wn={name:`chevron-up`,size:24,node:[[`path`,{d:`m18 15-6-6-6 6`,key:`153udz`}]]};wn.node;var Tn=K(wn),En={name:`circle-alert`,size:24,node:[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`line`,{x1:`12`,x2:`12`,y1:`8`,y2:`12`,key:`1pkeuh`}],[`line`,{x1:`12`,x2:`12.01`,y1:`16`,y2:`16`,key:`4dfq90`}]],aliases:[`alert-circle`]};En.node;var Dn=K(En),On={name:`circle-check-big`,size:24,node:[[`path`,{d:`M21.801 10A10 10 0 1 1 17 3.335`,key:`yps3ct`}],[`path`,{d:`m9 11 3 3L22 4`,key:`1pflzl`}]],aliases:[`check-circle`]};On.node;var kn=K(On),An={name:`circle-check`,size:24,node:[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`m16 9-5.5 5.5L8 12`,key:`xofnsj`}]],aliases:[`check-circle-2`]};An.node;var jn=K(An),Mn={name:`circle-x`,size:24,node:[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`m15 9-6 6`,key:`1uzhvr`}],[`path`,{d:`m9 9 6 6`,key:`z0biqf`}]],aliases:[`x-circle`]};Mn.node;var Nn=K(Mn),Pn={name:`clock`,size:24,node:[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 6v6l4 2`,key:`mmk7yg`}]]};Pn.node;var Fn=K(Pn),In={name:`cloud-download`,size:24,node:[[`path`,{d:`M12 13v8l-4-4`,key:`1f5nwf`}],[`path`,{d:`m12 21 4-4`,key:`1lfcce`}],[`path`,{d:`M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284`,key:`ui1hmy`}]],aliases:[`download-cloud`]};In.node;var Ln=K(In),Rn={name:`cloud-upload`,size:24,node:[[`path`,{d:`M12 13v8`,key:`1l5pq0`}],[`path`,{d:`M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242`,key:`1pljnt`}],[`path`,{d:`m8 17 4-4 4 4`,key:`1quai1`}]],aliases:[`upload-cloud`]};Rn.node;var zn=K(Rn),Bn={name:`copy`,size:24,node:[[`rect`,{width:`14`,height:`14`,x:`8`,y:`8`,rx:`2`,ry:`2`,key:`17jyea`}],[`path`,{d:`M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2`,key:`zix9uf`}]]};Bn.node;var Vn=K(Bn),Hn={name:`database`,size:24,node:[[`ellipse`,{cx:`12`,cy:`5`,rx:`9`,ry:`3`,key:`msslwz`}],[`path`,{d:`M3 5V19A9 3 0 0 0 21 19V5`,key:`1wlel7`}],[`path`,{d:`M3 12A9 3 0 0 0 21 12`,key:`mv7ke4`}]]};Hn.node;var Un=K(Hn),Wn={name:`download`,size:24,node:[[`path`,{d:`M12 15V3`,key:`m9g1x1`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}],[`path`,{d:`m7 10 5 5 5-5`,key:`brsn70`}]]};Wn.node;var Gn=K(Wn),Kn={name:`external-link`,size:24,node:[[`path`,{d:`M15 3h6v6`,key:`1q9fwt`}],[`path`,{d:`M10 14 21 3`,key:`gplh6r`}],[`path`,{d:`M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6`,key:`a6xqqp`}]]};Kn.node;var qn=K(Kn),Jn={name:`eye-off`,size:24,node:[[`path`,{d:`M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49`,key:`ct8e1f`}],[`path`,{d:`M14.084 14.158a3 3 0 0 1-4.242-4.242`,key:`151rxh`}],[`path`,{d:`M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143`,key:`13bj9a`}],[`path`,{d:`m2 2 20 20`,key:`1ooewy`}]]};Jn.node;var Yn=K(Jn),Xn={name:`eye`,size:24,node:[[`path`,{d:`M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0`,key:`1nclc0`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]]};Xn.node;var Zn=K(Xn),Qn={name:`file-plus`,size:24,node:[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,key:`1oefj6`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`,key:`wfsgrz`}],[`path`,{d:`M9 15h6`,key:`cctwl0`}],[`path`,{d:`M12 18v-6`,key:`17g6i2`}]]};Qn.node;var $n=K(Qn),er={name:`file-spreadsheet`,size:24,node:[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,key:`1oefj6`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`,key:`wfsgrz`}],[`path`,{d:`M8 13h2`,key:`yr2amv`}],[`path`,{d:`M14 13h2`,key:`un5t4a`}],[`path`,{d:`M8 17h2`,key:`2yhykz`}],[`path`,{d:`M14 17h2`,key:`10kma7`}]]};er.node;var tr=K(er),nr={name:`file-text`,size:24,node:[[`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,key:`1oefj6`}],[`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`,key:`wfsgrz`}],[`path`,{d:`M10 9H8`,key:`b1mrlr`}],[`path`,{d:`M16 13H8`,key:`t4e002`}],[`path`,{d:`M16 17H8`,key:`z1uh3a`}]]};nr.node;var rr=K(nr),ir={name:`gift`,size:24,node:[[`path`,{d:`M12 7v14`,key:`1akyts`}],[`path`,{d:`M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8`,key:`1sqzm4`}],[`path`,{d:`M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5`,key:`kc0143`}],[`rect`,{x:`3`,y:`7`,width:`18`,height:`4`,rx:`1`,key:`1hberx`}]]};ir.node;var ar=K(ir),or={name:`images`,size:24,node:[[`path`,{d:`m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16`,key:`9kzy35`}],[`path`,{d:`M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2`,key:`1t0f0t`}],[`circle`,{cx:`13`,cy:`7`,r:`1`,fill:`currentColor`,key:`1obus6`}],[`rect`,{x:`8`,y:`2`,width:`14`,height:`14`,rx:`2`,key:`1gvhby`}]]};or.node;var sr=K(or),cr={name:`key-round`,size:24,node:[[`path`,{d:`M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z`,key:`1s6t7t`}],[`circle`,{cx:`16.5`,cy:`7.5`,r:`.5`,fill:`currentColor`,key:`w0ekpg`}]]};cr.node;var lr=K(cr),ur={name:`key`,size:24,node:[[`path`,{d:`m2 21 9.6-9.6`,key:`9l79m3`}],[`path`,{d:`m7.5 15.5 2.3 2.3a1 1 0 0 1 0 1.4l-2.1 2.1a1 1 0 0 1-1.4 0L4 19`,key:`fw8biw`}],[`circle`,{cx:`15.5`,cy:`7.5`,r:`5.5`,key:`4wxmhb`}]]};ur.node;var dr=K(ur),fr={name:`layers`,size:24,node:[[`path`,{d:`M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z`,key:`zw3jo`}],[`path`,{d:`M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12`,key:`1wduqc`}],[`path`,{d:`M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17`,key:`kqbvx6`}]],aliases:[`layers-3`]};fr.node;var pr=K(fr),mr={name:`layout-dashboard`,size:24,node:[[`rect`,{width:`7`,height:`9`,x:`3`,y:`3`,rx:`1`,key:`10lvy0`}],[`rect`,{width:`7`,height:`5`,x:`14`,y:`3`,rx:`1`,key:`16une8`}],[`rect`,{width:`7`,height:`9`,x:`14`,y:`12`,rx:`1`,key:`1hutg5`}],[`rect`,{width:`7`,height:`5`,x:`3`,y:`16`,rx:`1`,key:`ldoo1y`}]]};mr.node;var hr=K(mr),gr={name:`loader`,size:24,node:[[`path`,{d:`M12 2v4`,key:`3427ic`}],[`path`,{d:`m16.2 7.8 2.9-2.9`,key:`r700ao`}],[`path`,{d:`M18 12h4`,key:`wj9ykh`}],[`path`,{d:`m16.2 16.2 2.9 2.9`,key:`1bxg5t`}],[`path`,{d:`M12 18v4`,key:`jadmvz`}],[`path`,{d:`m4.9 19.1 2.9-2.9`,key:`bwix9q`}],[`path`,{d:`M2 12h4`,key:`j09sii`}],[`path`,{d:`m4.9 4.9 2.9 2.9`,key:`giyufr`}]]};gr.node;var _r=K(gr),vr={name:`log-in`,size:24,node:[[`path`,{d:`m10 17 5-5-5-5`,key:`1bsop3`}],[`path`,{d:`M15 12H3`,key:`6jk70r`}],[`path`,{d:`M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4`,key:`u53s6r`}]]};vr.node;var yr=K(vr),br={name:`lock`,size:24,node:[[`rect`,{width:`18`,height:`11`,x:`3`,y:`11`,rx:`2`,ry:`2`,key:`1w4ew1`}],[`path`,{d:`M7 11V7a5 5 0 0 1 10 0v4`,key:`fwvmzm`}]]};br.node;var xr=K(br),Sr={name:`log-out`,size:24,node:[[`path`,{d:`m16 17 5-5-5-5`,key:`1bji2h`}],[`path`,{d:`M21 12H9`,key:`dn1m92`}],[`path`,{d:`M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4`,key:`1uf3rs`}]]};Sr.node;var Cr=K(Sr),wr={name:`map-pin`,size:24,node:[[`path`,{d:`M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0`,key:`1r0f0z`}],[`circle`,{cx:`12`,cy:`10`,r:`3`,key:`ilqhr7`}]]};wr.node;var Tr=K(wr),Er={name:`menu`,size:24,node:[[`path`,{d:`M4 5h16`,key:`1tepv9`}],[`path`,{d:`M4 12h16`,key:`1lakjw`}],[`path`,{d:`M4 19h16`,key:`1djgab`}]]};Er.node;var Dr=K(Er),Or={name:`pen-line`,size:24,node:[[`path`,{d:`M13 21h8`,key:`1jsn5i`}],[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,key:`1a8usu`}]],aliases:[`edit-3`]};Or.node;var kr=K(Or),Ar={name:`phone`,size:24,node:[[`path`,{d:`M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384`,key:`9njp5v`}]]};Ar.node;var jr=K(Ar),Mr={name:`pill`,size:24,node:[[`path`,{d:`m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z`,key:`wa1lgi`}],[`path`,{d:`m8.5 8.5 7 7`,key:`rvfmvr`}]]};Mr.node;var Nr=K(Mr),Pr={name:`plus`,size:24,node:[[`path`,{d:`M5 12h14`,key:`1ays0h`}],[`path`,{d:`M12 5v14`,key:`s699le`}]]};Pr.node;var Fr=K(Pr),Ir={name:`refresh-cw`,size:24,node:[[`path`,{d:`M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8`,key:`v9h5vc`}],[`path`,{d:`M21 3v5h-5`,key:`1q7to0`}],[`path`,{d:`M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16`,key:`3uifl3`}],[`path`,{d:`M8 16H3v5`,key:`1cv678`}]]};Ir.node;var Lr=K(Ir),Rr={name:`save`,size:24,node:[[`path`,{d:`M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z`,key:`1c8476`}],[`path`,{d:`M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7`,key:`1ydtos`}],[`path`,{d:`M7 3v4a1 1 0 0 0 1 1h7`,key:`t51u73`}]]};Rr.node;var zr=K(Rr),Br={name:`search`,size:24,node:[[`path`,{d:`m21 21-4.34-4.34`,key:`14j7rj`}],[`circle`,{cx:`11`,cy:`11`,r:`8`,key:`4ej97u`}]]};Br.node;var Vr=K(Br),Hr={name:`settings`,size:24,node:[[`path`,{d:`M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,key:`1i5ecw`}],[`circle`,{cx:`12`,cy:`12`,r:`3`,key:`1v7zrd`}]]};Hr.node;var Ur=K(Hr),Wr={name:`shield-check`,size:24,node:[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]]};Wr.node;var Gr=K(Wr),Kr={name:`sparkles`,size:24,node:[[`path`,{d:`M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z`,key:`1s2grr`}],[`path`,{d:`M20 2v4`,key:`1rf3ol`}],[`path`,{d:`M22 4h-4`,key:`gwowj6`}],[`circle`,{cx:`4`,cy:`20`,r:`2`,key:`6kqj1y`}]],aliases:[`stars`]};Kr.node;var qr=K(Kr),Jr={name:`table`,size:24,node:[[`path`,{d:`M12 3v18`,key:`108xh3`}],[`rect`,{width:`18`,height:`18`,x:`3`,y:`3`,rx:`2`,key:`afitv7`}],[`path`,{d:`M3 9h18`,key:`1pudct`}],[`path`,{d:`M3 15h18`,key:`5xshup`}]]};Jr.node;var Yr=K(Jr),Xr={name:`terminal`,size:24,node:[[`path`,{d:`M12 19h8`,key:`baeox8`}],[`path`,{d:`m4 17 6-6-6-6`,key:`1yngyt`}]]};Xr.node;var Zr=K(Xr),Qr={name:`trash`,size:24,node:[[`path`,{d:`M10 11v6`,key:`nco0om`}],[`path`,{d:`M14 11v6`,key:`outv1u`}],[`path`,{d:`M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`,key:`miytrc`}],[`path`,{d:`M3 6h18`,key:`d0wm0j`}],[`path`,{d:`M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`,key:`e791ji`}]],aliases:[`trash-2`]};Qr.node;var $r=K(Qr),ei={name:`trending-up`,size:24,node:[[`path`,{d:`M16 7h6v6`,key:`box55l`}],[`path`,{d:`m22 7-8.5 8.5-5-5L2 17`,key:`1t1m79`}]]};ei.node;var ti=K(ei),ni={name:`triangle-alert`,size:24,node:[[`path`,{d:`m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3`,key:`wmoenq`}],[`path`,{d:`M12 9v4`,key:`juzpu7`}],[`path`,{d:`M12 17h.01`,key:`p32p05`}]],aliases:[`alert-triangle`]};ni.node;var ri=K(ni),ii={name:`upload`,size:24,node:[[`path`,{d:`M12 3v12`,key:`1x0j5s`}],[`path`,{d:`m17 8-5-5-5 5`,key:`7q97r8`}],[`path`,{d:`M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`,key:`ih7n3h`}]]};ii.node;var ai=K(ii),oi={name:`user-check`,size:24,node:[[`path`,{d:`m16 11 2 2 4-4`,key:`9rsbq5`}],[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`,key:`1yyitq`}],[`circle`,{cx:`9`,cy:`7`,r:`4`,key:`nufk8`}]]};oi.node;var si=K(oi),ci={name:`user-plus`,size:24,node:[[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`,key:`1yyitq`}],[`circle`,{cx:`9`,cy:`7`,r:`4`,key:`nufk8`}],[`line`,{x1:`19`,x2:`19`,y1:`8`,y2:`14`,key:`1bvyxn`}],[`line`,{x1:`22`,x2:`16`,y1:`11`,y2:`11`,key:`1shjgl`}]]};ci.node;var li=K(ci),ui={name:`users`,size:24,node:[[`path`,{d:`M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`,key:`1yyitq`}],[`path`,{d:`M16 3.128a4 4 0 0 1 0 7.744`,key:`16gr8j`}],[`path`,{d:`M22 21v-2a4 4 0 0 0-3-3.87`,key:`kshegd`}],[`circle`,{cx:`9`,cy:`7`,r:`4`,key:`nufk8`}]]};ui.node;var di=K(ui),fi={name:`wifi-off`,size:24,node:[[`path`,{d:`M12 20h.01`,key:`zekei9`}],[`path`,{d:`M8.5 16.429a5 5 0 0 1 7 0`,key:`1bycff`}],[`path`,{d:`M5 12.859a10 10 0 0 1 5.17-2.69`,key:`1dl1wf`}],[`path`,{d:`M19 12.859a10 10 0 0 0-2.007-1.523`,key:`4k23kn`}],[`path`,{d:`M2 8.82a15 15 0 0 1 4.177-2.643`,key:`1grhjp`}],[`path`,{d:`M22 8.82a15 15 0 0 0-11.288-3.764`,key:`z3jwby`}],[`path`,{d:`m2 2 20 20`,key:`1ooewy`}]]};fi.node;var pi=K(fi),mi={name:`x`,size:24,node:[[`path`,{d:`M18 6 6 18`,key:`1bl5f8`}],[`path`,{d:`m6 6 12 12`,key:`d8bk6v`}]]};mi.node;var hi=K(mi),gi={name:`zoom-in`,size:24,node:[[`circle`,{cx:`11`,cy:`11`,r:`8`,key:`4ej97u`}],[`line`,{x1:`21`,x2:`16.65`,y1:`21`,y2:`16.65`,key:`13gj7c`}],[`line`,{x1:`11`,x2:`11`,y1:`8`,y2:`14`,key:`1vmskp`}],[`line`,{x1:`8`,x2:`14`,y1:`11`,y2:`11`,key:`durymu`}]]};gi.node;var _i=K(gi),vi=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),q=o(((e,t)=>{t.exports=vi()}))(),yi=({onLoginSuccess:e})=>{let[t,n]=(0,_.useState)(`login`),[r,i]=(0,_.useState)(``),[a,o]=(0,_.useState)(``),[s,c]=(0,_.useState)(!1),[l,u]=(0,_.useState)(``),[d,f]=(0,_.useState)(``),[p,m]=(0,_.useState)(`الرصافة`),[h,g]=(0,_.useState)(``),[v,y]=(0,_.useState)(``),[b,x]=(0,_.useState)(!1),[S,C]=(0,_.useState)(null),[w,T]=(0,_.useState)(null);return(0,q.jsx)(`div`,{style:{minHeight:`100vh`,display:`flex`,alignItems:`center`,justifyContent:`center`,padding:`1.5rem 1rem`,background:`linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)`},children:(0,q.jsx)(`div`,{style:{maxWidth:460,width:`100%`},children:(0,q.jsxs)(`div`,{className:`card animate-in`,style:{padding:`2rem 1.75rem`,borderRadius:20},children:[(0,q.jsxs)(`div`,{style:{textAlign:`center`,marginBottom:`1.25rem`},children:[(0,q.jsx)(`div`,{style:{width:64,height:64,borderRadius:18,background:`linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)`,color:`#ffffff`,display:`flex`,alignItems:`center`,justifyContent:`center`,margin:`0 auto 0.75rem`,boxShadow:`0 8px 24px rgba(37, 99, 235, 0.35)`},children:(0,q.jsx)(Nr,{size:34})}),(0,q.jsx)(`h2`,{style:{fontWeight:900,color:`var(--gray-900)`,fontSize:`1.32rem`,margin:`0 0 0.35rem`},children:`منظومة مبيعات المندوبين وفواتير الصيدليات`}),(0,q.jsx)(`p`,{style:{fontSize:`0.8rem`,color:`var(--gray-500)`,margin:0},children:`تحقق مباشر من قاعدة بيانات Google Sheets الرئيسية — لكل مستخدم صفحته الخاصة`}),(0,q.jsxs)(`div`,{style:{marginTop:`0.55rem`,display:`flex`,gap:`0.4rem`,justifyContent:`center`,flexWrap:`wrap`},children:[(0,q.jsxs)(`span`,{className:`badge badge-primary`,style:{fontSize:`0.72rem`},children:[(0,q.jsx)(Un,{size:11}),` تطابق تام مع الشيت الرئيسي`]}),(0,q.jsxs)(`span`,{className:`badge badge-success`,style:{fontSize:`0.72rem`},children:[(0,q.jsx)(tr,{size:11}),` عزل صفحة كل مندوب`]})]})]}),(0,q.jsxs)(`div`,{className:`tab-pills mb-3`,style:{background:`#f1f5f9`,padding:`4px`,borderRadius:12},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>{n(`login`),C(null)},className:`tab-pill ${t===`login`?`active`:``}`,style:{fontWeight:800,fontSize:`0.85rem`},children:[(0,q.jsx)(yr,{size:15}),` تسجيل الدخول`]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>{n(`register`),C(null)},className:`tab-pill ${t===`register`?`active`:``}`,style:{fontWeight:800,fontSize:`0.85rem`},children:[(0,q.jsx)(li,{size:15}),` تسجيل مندوب جديد`]})]}),S&&(0,q.jsx)(`div`,{className:`alert-danger mb-3`,style:{padding:`0.65rem 0.9rem`,fontSize:`0.82rem`},children:(0,q.jsxs)(`span`,{children:[`⚠️ `,S]})}),w&&(0,q.jsxs)(`div`,{className:`alert-success mb-3`,style:{padding:`0.65rem 0.9rem`,fontSize:`0.82rem`},children:[(0,q.jsx)(jn,{size:16}),` `,(0,q.jsx)(`span`,{children:w})]}),t===`login`?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsxs)(`div`,{style:{background:`#f8fafc`,border:`1px solid #e2e8f0`,borderRadius:12,padding:`0.75rem 0.9rem`,marginBottom:`1.1rem`,fontSize:`0.76rem`,color:`#334155`,lineHeight:1.6},children:[(0,q.jsxs)(`div`,{style:{fontWeight:800,color:`#0f172a`,marginBottom:2,display:`flex`,alignItems:`center`,gap:5},children:[(0,q.jsx)(Gr,{size:14,style:{color:`var(--primary)`}}),`آلية الدخول وصلاحيات قاعدة البيانات:`]}),(0,q.jsxs)(`div`,{children:[`• يجب تطابق `,(0,q.jsx)(`strong`,{children:`الاسم`}),` و`,(0,q.jsx)(`strong`,{children:`الرمز السري`}),` مع السجل المسجل في الشيت الرئيسي.`]}),(0,q.jsxs)(`div`,{children:[`• يفتح حساب `,(0,q.jsx)(`strong`,{children:`باقر`}),` كأدمن مع صلاحية إدارة الشيت الرئيسي، ويدخل البقية كمندوبين بصفحاتهم الخاصة.`]})]}),(0,q.jsxs)(`form`,{onSubmit:async t=>{t.preventDefault(),C(null),T(null);let n=r.trim(),i=N(a.trim());if(!n||!i)C(`يرجى إدخال الاسم والرمز السري المطابقين للشيت الرئيسي`);else{x(!0);try{e((await G.login(n,i)).user)}catch(e){C(e.message||`الاسم أو الرمز السري غير متطابق مع قاعدة البيانات`)}finally{x(!1)}}},style:{display:`flex`,flexDirection:`column`,gap:`0.95rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`الاسم المسجل في الشيت`}),(0,q.jsxs)(`div`,{style:{position:`relative`},children:[(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,style:{paddingRight:`2.5rem`,fontSize:`0.92rem`},placeholder:`مثال: باقر علي أو keko1`,value:r,onChange:e=>i(e.target.value),autoComplete:`username`,required:!0}),(0,q.jsx)(si,{size:18,style:{position:`absolute`,right:12,top:`50%`,transform:`translateY(-50%)`,color:`var(--gray-400)`}})]})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`0.35rem`},children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:800,color:`var(--gray-700)`,margin:0},children:`الرمز السري`}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>c(!s),style:{background:`none`,border:`none`,color:`var(--primary)`,cursor:`pointer`,fontSize:`0.74rem`,fontWeight:700,display:`flex`,alignItems:`center`,gap:4},children:s?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(Yn,{size:13}),` إخفاء`]}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(Zn,{size:13}),` إظهار الرمز`]})})]}),(0,q.jsxs)(`div`,{style:{position:`relative`},children:[(0,q.jsx)(`input`,{type:s?`text`:`password`,className:`clay-input`,style:{paddingRight:`2.5rem`,fontSize:`0.92rem`},placeholder:`أدخل الرمز السري...`,value:a,onChange:e=>o(e.target.value),autoComplete:`current-password`,required:!0}),(0,q.jsx)(xr,{size:18,style:{position:`absolute`,right:12,top:`50%`,transform:`translateY(-50%)`,color:`var(--gray-400)`}})]})]}),(0,q.jsx)(`button`,{type:`submit`,disabled:b,className:`btn-clay btn-primary`,style:{width:`100%`,padding:`0.85rem`,fontSize:`0.98rem`,fontWeight:800,marginTop:`0.35rem`},children:b?`جاري التحقق من قاعدة البيانات...`:(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(yr,{size:18}),` تسجيل الدخول`]})})]}),(0,q.jsxs)(`div`,{style:{marginTop:`1rem`,textAlign:`center`,fontSize:`0.74rem`,color:`var(--gray-500)`,display:`flex`,alignItems:`center`,justifyContent:`center`,gap:4},children:[(0,q.jsx)(lr,{size:12}),` يمكن للمندوبين تغيير الاسم والرمز لاحقاً من قائمة «حسابي» داخل التطبيق`]})]}):(0,q.jsxs)(`form`,{onSubmit:async t=>{if(t.preventDefault(),C(null),T(null),!l.trim()){C(`يرجى إدخال الاسم الكامل للمندوب`);return}let n=N(d.trim());if(!n||n.length<4)C(`الرمز السري (PIN) يجب أن يتكون من 4 أرقام أو أحرف على الأقل`);else{x(!0);try{let t=await G.register({fullName:l.trim(),username:l.trim(),pin:n,area:p,sheetUrl:h.trim(),webhookUrl:v.trim()});T(`تم تسجيل حساب المندوب في الشيت الرئيسي بنجاح! جاري الدخول...`),setTimeout(()=>{e(t.user)},500)}catch(e){C(e.message||`فشل تسجيل الحساب، يرجى المحاولة مجدداً`)}finally{x(!1)}}},style:{display:`flex`,flexDirection:`column`,gap:`0.85rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.8rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.3rem`},children:`الاسم (للدخول وظهور المندوب) *`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,placeholder:`مثال: keko3 أو حسين كريم`,value:l,onChange:e=>u(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.8rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.3rem`},children:`الرمز السري (PIN / Password) *`}),(0,q.jsx)(`input`,{type:`password`,className:`clay-input`,placeholder:`123456`,value:d,onChange:e=>f(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.8rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.3rem`},children:`منطقة العمل / المحافظة`}),(0,q.jsxs)(`select`,{className:`clay-input`,value:p,onChange:e=>m(e.target.value),children:[(0,q.jsx)(`option`,{value:`الرصافة`,children:`بغداد / الرصافة`}),(0,q.jsx)(`option`,{value:`الكرخ`,children:`بغداد / الكرخ`}),(0,q.jsx)(`option`,{value:`المنصور`,children:`بغداد / المنصور`}),(0,q.jsx)(`option`,{value:`الكرادة`,children:`بغداد / الكرادة`}),(0,q.jsx)(`option`,{value:`البصرة`,children:`البصرة`}),(0,q.jsx)(`option`,{value:`أربيل`,children:`أربيل`}),(0,q.jsx)(`option`,{value:`النجف`,children:`النجف الأشرف`}),(0,q.jsx)(`option`,{value:`كربلاء`,children:`كربلاء المقدسة`})]})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.8rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.3rem`},children:`رابط صفحة كوكل شيت الخاصة بالمندوب`}),(0,q.jsx)(`input`,{type:`url`,className:`clay-input`,style:{direction:`ltr`,fontSize:`0.8rem`},placeholder:`https://docs.google.com/spreadsheets/d/...`,value:h,onChange:e=>g(e.target.value)})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.8rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.3rem`},children:`رابط Apps Script الخاص بالمندوب (اختياري)`}),(0,q.jsx)(`input`,{type:`url`,className:`clay-input`,style:{direction:`ltr`,fontSize:`0.8rem`},placeholder:`https://script.google.com/macros/s/.../exec`,value:v,onChange:e=>y(e.target.value)})]}),(0,q.jsx)(`button`,{type:`submit`,disabled:b,className:`btn-clay btn-primary`,style:{width:`100%`,padding:`0.8rem`,fontSize:`0.98rem`,fontWeight:800,marginTop:`0.4rem`,background:`#059669`,borderColor:`#047857`},children:b?`جاري التسجيل في الشيت الرئيسي...`:(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(li,{size:18}),` تسجيل كمندوب والدخول`]})})]})]})})})},bi=({user:e,kpis:t,invoices:n,pharmacies:r,onNavigate:i,onApproveInvoice:a,onRejectInvoice:o})=>{let s=n.filter(e=>e.status===`pending_review`),c=e.role===`medical_rep`,l=e.role===`admin`,u=new Date().toLocaleDateString(`ar-IQ`,{weekday:`long`,year:`numeric`,month:`long`,day:`numeric`});return(0,q.jsxs)(`div`,{className:`animate-in`,children:[(0,q.jsx)(`div`,{className:`card mb-4`,style:{background:`linear-gradient(135deg, #fff 0%, #f0f7ff 100%)`},children:(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,flexWrap:`wrap`,gap:`1rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,marginBottom:`0.5rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`span`,{className:`badge badge-primary`,children:[(0,q.jsx)(qr,{size:13}),l?`صلاحيات الإدارة الكاملة`:c?`لوحة المندوب الميداني`:`لوحة المشرف`]}),(0,q.jsx)(`span`,{style:{fontSize:`0.8rem`,color:`var(--gray-400)`},children:u})]}),(0,q.jsxs)(`h2`,{style:{fontWeight:900,color:`var(--gray-900)`,margin:0,fontSize:`1.4rem`},children:[`أهلاً بك، `,e.full_name,` 👋`]}),(0,q.jsx)(`p`,{style:{color:`var(--gray-500)`,margin:`0.4rem 0 0`,fontSize:`0.9rem`},children:l?`متابعة شبكة المبيعات، اعتماد الفواتير، وتحليل البونص على مستوى الصيدليات.`:`سجل زياراتك اليومية وأضف فواتير الصيدليات بالإدخال اليدوي أو بالذكاء الاصطناعي.`})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.75rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`button`,{onClick:()=>i(`add-invoice`),className:`btn-clay btn-primary`,style:{background:`#059669`,borderColor:`#047857`},children:[(0,q.jsx)($n,{size:18}),` إضافة فاتورة جديدة`]}),(0,q.jsxs)(`button`,{onClick:()=>i(`visits`),className:`btn-clay btn-secondary`,children:[(0,q.jsx)(hn,{size:18}),` جدول الزيارات`]})]})]})}),(()=>{let e=Number(t?.total_sales_amount??t?.total_revenue??0),n=Number(t?.total_invoices??0),i=Number(t?.total_pharmacies_visited||r.length||0),a=Number(t?.total_bonus_pieces??t?.total_bonus_given??0);return(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(160px, 1fr))`,gap:`1rem`,marginBottom:`1.5rem`},children:[(0,q.jsxs)(`div`,{className:`stat-card card-hover`,children:[(0,q.jsx)(`div`,{className:`stat-icon`,style:{background:`#eff6ff`,color:`#2563eb`},children:(0,q.jsx)(ti,{size:24})}),(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,children:`إجمالي المبيعات`}),(0,q.jsx)(`div`,{className:`stat-value`,children:e.toLocaleString()}),(0,q.jsx)(`div`,{className:`stat-sub`,children:`دينار عراقي`})]})]}),(0,q.jsxs)(`div`,{className:`stat-card card-hover`,children:[(0,q.jsx)(`div`,{className:`stat-icon`,style:{background:`#ecfdf5`,color:`#059669`},children:(0,q.jsx)(rr,{size:24})}),(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,children:`الفواتير المعالجة`}),(0,q.jsx)(`div`,{className:`stat-value`,children:n}),(0,q.jsx)(`div`,{className:`stat-sub`,children:s.length>0?(0,q.jsxs)(`span`,{className:`badge badge-warning`,style:{fontSize:`0.7rem`},children:[(0,q.jsx)(Fn,{size:11}),` `,s.length,` بانتظار المراجعة`]}):(0,q.jsx)(`span`,{className:`badge badge-success`,style:{fontSize:`0.7rem`},children:`كل الفواتير معتمدة ✓`})})]})]}),(0,q.jsxs)(`div`,{className:`stat-card card-hover`,children:[(0,q.jsx)(`div`,{className:`stat-icon`,style:{background:`#f5f3ff`,color:`#7c3aed`},children:(0,q.jsx)(dn,{size:24})}),(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,children:`الصيدليات المعتمدة`}),(0,q.jsx)(`div`,{className:`stat-value`,children:i}),(0,q.jsx)(`div`,{className:`stat-sub`,children:`صيدلية مسجلة`})]})]}),(0,q.jsxs)(`div`,{className:`stat-card card-hover`,children:[(0,q.jsx)(`div`,{className:`stat-icon`,style:{background:`#fffbeb`,color:`#d97706`},children:(0,q.jsx)(ar,{size:24})}),(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,children:`قطع البونص الممنوحة`}),(0,q.jsxs)(`div`,{className:`stat-value`,style:{color:`var(--warning)`},children:[`+`,a]}),(0,q.jsx)(`div`,{className:`stat-sub`,children:`قطعة مجانية (10+1)`})]})]})]})})(),(0,q.jsxs)(`div`,{className:`dashboard-mid-grid`,children:[(()=>{let e={drop:{label:`💧 قطرات (Drops)`,amount:0,qty:0,color:`var(--primary)`},cream:{label:`🧴 كريمات (Creams)`,amount:0,qty:0,color:`var(--success)`},ointment:{label:`🩹 مراهم (Ointments)`,amount:0,qty:0,color:`var(--warning)`},tablet:{label:`💊 حبوب وأخرى (Tablets)`,amount:0,qty:0,color:`#7c3aed`}};for(let t of n)for(let n of t.items||[]){let t=String(n.dosage_form||``).trim(),r=[`قطرة`,`كريم`,`مرهم`,`حبوب`].includes(t)?t:re(n.product_name_snapshot||``),i=Number(n.line_total||Number(n.sold_quantity||0)*Number(n.historical_unit_price||0)||0),a=Number(n.sold_quantity||0),o=r===`قطرة`?e.drop:r===`كريم`?e.cream:r===`مرهم`?e.ointment:e.tablet;o.amount+=i,o.qty+=a}let t=[e.drop,e.cream,e.ointment,e.tablet],r=t.reduce((e,t)=>e+t.amount,0),i=t.reduce((e,t)=>e+t.qty,0),a=r>0?r:i,o=(e.tablet.amount>0||e.tablet.qty>0?t:[e.drop,e.cream,e.ointment]).map(e=>{let t=r>0?e.amount:e.qty,n=a>0?t/a*100:0,i=Math.round(n*10)/10;return{...e,pct:i}});return(0,q.jsxs)(`div`,{className:`card`,children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`1.25rem`,gap:`0.5rem`,flexWrap:`wrap`},children:[(0,q.jsx)(`h5`,{style:{fontWeight:800,margin:0},children:`توزيع المبيعات`}),(0,q.jsxs)(`span`,{className:`badge badge-purple`,children:[(0,q.jsx)(qr,{size:12}),` `,n.length>0?`نسبة حقيقية (${n.length} فاتورة)`:`لا توجد مبيعات بعد`]})]}),o.map(e=>(0,q.jsxs)(`div`,{style:{marginBottom:`1rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,fontSize:`0.83rem`,fontWeight:600,marginBottom:`0.35rem`,gap:`0.5rem`},children:[(0,q.jsx)(`span`,{children:e.label}),(0,q.jsxs)(`span`,{style:{color:e.color,fontWeight:800},children:[e.pct,`%`,e.amount>0&&(0,q.jsxs)(`span`,{style:{fontSize:`0.73rem`,color:`var(--gray-500)`,fontWeight:600,marginRight:6},children:[`(`,e.amount.toLocaleString(),` د.ع)`]})]})]}),(0,q.jsx)(`div`,{className:`progress-bar-bg`,children:(0,q.jsx)(`div`,{className:`progress-bar-fill`,style:{width:`${Math.min(100,e.pct)}%`,background:e.color}})})]},e.label))]})})(),(0,q.jsxs)(`div`,{className:`card`,children:[(0,q.jsx)(`h5`,{style:{fontWeight:800,marginBottom:`1rem`},children:`إجراءات سريعة`}),(0,q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.75rem`},children:[(0,q.jsxs)(`button`,{onClick:()=>i(`add-invoice`),className:`btn-clay btn-secondary`,style:{justifyContent:`flex-start`,padding:`0.875rem 1rem`,textAlign:`right`,borderColor:`#a7f3d0`,background:`#ecfdf5`},children:[(0,q.jsx)($n,{size:20,style:{color:`#059669`,flexShrink:0}}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontWeight:800,fontSize:`0.9rem`,color:`#065f46`},children:`رفع / إضافة فاتورة جديدة`}),(0,q.jsx)(`div`,{style:{fontSize:`0.77rem`,color:`#047857`,marginTop:2},children:`كاميرا الموبايل، صورة أو PDF أو إدخال يدوي`})]})]}),(0,q.jsxs)(`button`,{onClick:()=>i(`pharmacies`),className:`btn-clay btn-secondary`,style:{justifyContent:`flex-start`,padding:`0.875rem 1rem`,textAlign:`right`},children:[(0,q.jsx)(dn,{size:20,style:{color:`var(--purple)`,flexShrink:0}}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontWeight:700,fontSize:`0.9rem`},children:`دليل الصيدليات`}),(0,q.jsx)(`div`,{style:{fontSize:`0.77rem`,color:`var(--gray-400)`,marginTop:2},children:`إدارة العملاء وسجل المعاملات`})]})]}),(0,q.jsxs)(`button`,{onClick:()=>i(`billing`),className:`btn-clay btn-secondary`,style:{justifyContent:`flex-start`,padding:`0.875rem 1rem`,textAlign:`right`},children:[(0,q.jsx)(Gn,{size:20,style:{color:`var(--success)`,flexShrink:0}}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontWeight:700,fontSize:`0.9rem`},children:`سجل الفواتير والتقارير`}),(0,q.jsx)(`div`,{style:{fontSize:`0.77rem`,color:`var(--gray-400)`,marginTop:2},children:`مراجعة الاعتماد وتصدير Excel`})]})]})]})]})]}),(0,q.jsxs)(`div`,{className:`card`,children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`1rem`,flexWrap:`wrap`,gap:`0.5rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`h5`,{style:{fontWeight:800,margin:0},children:`الفواتير قيد المراجعة`}),(0,q.jsx)(`span`,{style:{fontSize:`0.82rem`,color:`var(--gray-400)`},children:`الفواتير الجديدة بانتظار اعتماد المشرف`})]}),(0,q.jsxs)(`button`,{onClick:()=>i(`billing`),className:`btn-clay btn-secondary btn-sm`,children:[`عرض الكل (`,n.length,`)`]})]}),s.length===0?(0,q.jsxs)(`div`,{style:{textAlign:`center`,padding:`2rem`,color:`var(--gray-400)`},children:[(0,q.jsx)(jn,{size:40,style:{color:`var(--success)`,display:`block`,margin:`0 auto 0.75rem`}}),(0,q.jsx)(`p`,{style:{fontWeight:700,margin:0},children:`لا توجد فواتير معلقة — كل شيء معتمد! ✅`})]}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`div`,{className:`desktop-table-view`,style:{overflowX:`auto`},children:(0,q.jsxs)(`table`,{className:`clay-table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`رقم الفاتورة`}),(0,q.jsx)(`th`,{children:`الصيدلية`}),(0,q.jsx)(`th`,{children:`المندوب`}),(0,q.jsx)(`th`,{children:`التاريخ`}),(0,q.jsx)(`th`,{children:`المبلغ`}),(0,q.jsx)(`th`,{children:`البونص`}),(0,q.jsx)(`th`,{children:`الحالة`}),l&&(0,q.jsx)(`th`,{style:{textAlign:`center`},children:`إجراء`})]})}),(0,q.jsx)(`tbody`,{children:s.map(e=>{let t=(e.invoice_date||``).split(`T`)[0];return(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`td`,{style:{fontWeight:700,color:`var(--gray-900)`},children:(0,q.jsx)(`button`,{onClick:()=>i(`billing`),className:`btn-link`,style:{fontWeight:800,color:`var(--primary)`,textDecoration:`underline`,background:`none`,border:`none`,cursor:`pointer`,padding:0},title:`عرض تفاصيل الفاتورة في السجل`,children:e.invoice_number||`—`})}),(0,q.jsx)(`td`,{style:{color:`var(--gray-600)`},children:e.pharmacy_name}),(0,q.jsx)(`td`,{style:{color:`var(--gray-600)`},children:e.rep_name}),(0,q.jsx)(`td`,{style:{color:`var(--gray-500)`,fontSize:`0.85rem`},children:t}),(0,q.jsxs)(`td`,{style:{fontWeight:800,color:`var(--primary)`},children:[Number(e.total_sales_amount||0).toLocaleString(),` د.ع`]}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`span`,{className:`badge badge-warning`,children:[`+`,e.total_bonus_count,` 🎁`]})}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`span`,{className:`badge badge-warning`,children:[(0,q.jsx)(Fn,{size:12}),` قيد المراجعة`]})}),l&&(0,q.jsx)(`td`,{children:(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.4rem`,justifyContent:`center`},children:[(0,q.jsxs)(`button`,{onClick:()=>a(e.id),className:`btn-clay btn-success btn-sm`,children:[(0,q.jsx)(jn,{size:14}),` اعتماد`]}),(0,q.jsxs)(`button`,{onClick:()=>o(e.id),className:`btn-clay btn-danger btn-sm`,children:[(0,q.jsx)(Dn,{size:14}),` رفض`]})]})})]},e.id)})})]})}),(0,q.jsx)(`div`,{className:`mobile-cards-view`,children:s.map(e=>{let t=(e.invoice_date||``).split(`T`)[0];return(0,q.jsxs)(`div`,{className:`mobile-invoice-card`,style:{borderRight:`4px solid var(--warning)`},children:[(0,q.jsxs)(`div`,{className:`mobile-card-header`,children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>i(`billing`),className:`mobile-invoice-number-btn`,children:[`فاتورة #`,e.invoice_number||`—`]}),(0,q.jsxs)(`span`,{className:`badge badge-warning`,children:[(0,q.jsx)(Fn,{size:12}),` قيد المراجعة`]})]}),(0,q.jsxs)(`div`,{style:{fontWeight:800,fontSize:`0.94rem`,color:`var(--gray-900)`},children:[`🏥 `,e.pharmacy_name]}),(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,fontSize:`0.78rem`,color:`var(--gray-600)`},children:[(0,q.jsxs)(`span`,{children:[`👤 `,e.rep_name]}),(0,q.jsxs)(`span`,{children:[`📅 `,t]})]}),(0,q.jsxs)(`div`,{className:`mobile-card-metrics`,style:{gridTemplateColumns:`1.2fr 1fr`},children:[(0,q.jsxs)(`div`,{className:`mobile-metric`,children:[(0,q.jsx)(`span`,{className:`mobile-metric-label`,children:`المبلغ`}),(0,q.jsxs)(`span`,{className:`mobile-metric-val`,style:{color:`var(--primary)`},children:[Number(e.total_sales_amount||0).toLocaleString(),` د.ع`]})]}),(0,q.jsxs)(`div`,{className:`mobile-metric`,children:[(0,q.jsx)(`span`,{className:`mobile-metric-label`,children:`البونص`}),(0,q.jsxs)(`span`,{className:`badge badge-warning`,style:{width:`fit-content`},children:[`+`,e.total_bonus_count,` 🎁`]})]})]}),l&&(0,q.jsxs)(`div`,{className:`mobile-card-actions`,children:[(0,q.jsxs)(`button`,{onClick:()=>a(e.id),className:`btn-clay btn-success btn-sm flex-1`,style:{justifyContent:`center`},children:[(0,q.jsx)(jn,{size:14}),` اعتماد`]}),(0,q.jsxs)(`button`,{onClick:()=>o(e.id),className:`btn-clay btn-danger btn-sm flex-1`,style:{justifyContent:`center`},children:[(0,q.jsx)(Dn,{size:14}),` رفض`]})]})]},e.id)})})]})]}),(0,q.jsx)(`style`,{children:`
        @media (max-width: 768px) {
          .mid-grid { grid-template-columns: 1fr !important; }
        }
      `})]})},xi=m(),Si=({onClose:e,maxWidth:t=640,backdropStyle:n,cardStyle:r,children:i})=>((0,_.useEffect)(()=>{let t=document.body.style.overflow;document.body.style.overflow=`hidden`;let n=t=>{t.key===`Escape`&&e?.()};return window.addEventListener(`keydown`,n),()=>{document.body.style.overflow=t,window.removeEventListener(`keydown`,n)}},[e]),typeof document>`u`?null:(0,xi.createPortal)((0,q.jsx)(`div`,{className:`modal-backdrop-floating`,style:n,onClick:t=>{t.target===t.currentTarget&&e?.()},children:(0,q.jsx)(`div`,{className:`modal-card-floating`,style:{maxWidth:t,...r},onClick:e=>e.stopPropagation(),children:i})}),document.body)),Ci=({pharmacies:e,onStartInvoiceForPharmacy:t})=>{let[n,r]=(0,_.useState)(`all`),[i,a]=(0,_.useState)(!1),[o,s]=(0,_.useState)([{id:`v-1`,pharmacy_id:e[0]?.id||`ph1`,pharmacy_name:e[0]?.name||`صيدلية النور الحديثة`,rep_name:`علي حسن`,visit_date:`2026-10-31`,visit_time:`10:00 ص`,purpose:`order_delivery`,status:`scheduled`,notes:`تسليم طلبية قطرات العيون وعرض عينة الكريم الجديد`},{id:`v-2`,pharmacy_id:e[1]?.id||`ph2`,pharmacy_name:e[1]?.name||`صيدلية الشفاء التخصصية`,rep_name:`علي حسن`,visit_date:`2026-10-31`,visit_time:`01:30 م`,purpose:`sample_show`,status:`scheduled`,notes:`شرح بونص 10+1 لصاحب الصيدلية`},{id:`v-3`,pharmacy_id:e[2]?.id||`ph3`,pharmacy_name:e[2]?.name||`صيدلية الأمل المركزية`,rep_name:`علي حسن`,visit_date:`2026-10-30`,visit_time:`04:00 م`,purpose:`collection`,status:`completed`,notes:`تمت الزيارة ومراجعة الفاتورة بنجاح`}]),[c,l]=(0,_.useState)(e[0]?.id||``),[u,d]=(0,_.useState)(new Date().toISOString().split(`T`)[0]),[f,p]=(0,_.useState)(`11:00 ص`),[m,h]=(0,_.useState)(`routine_check`),[g,v]=(0,_.useState)(``),y=t=>{t.preventDefault();let n=e.find(e=>e.id===c),r={id:`v-`+Date.now(),pharmacy_id:c,pharmacy_name:n?n.name:`صيدلية جديدة`,rep_name:`علي حسن`,visit_date:u,visit_time:f,purpose:m,status:`scheduled`,notes:g};s([r,...o]),a(!1),v(``)},b=(e,t)=>{s(o.map(n=>n.id===e?{...n,status:t}:n))},x=o.filter(e=>n===`all`||e.status===n),S=e=>{switch(e){case`routine_check`:return{label:`زيارة متابعة دورية`,badge:`badge-primary`};case`order_delivery`:return{label:`تسليم شحنة طلبيات`,badge:`badge-success`};case`sample_show`:return{label:`عرض عينات وبونص`,badge:`badge-purple`};case`collection`:return{label:`تحصيل ومطابقة مالية`,badge:`badge-warning`};default:return{label:`زيارة ميدانية`,badge:`badge-primary`}}};return(0,q.jsxs)(`div`,{className:`animate-in`,style:{display:`flex`,flexDirection:`column`,gap:`1.25rem`},children:[(0,q.jsxs)(`div`,{className:`page-header`,children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,marginBottom:`0.4rem`},children:[(0,q.jsxs)(`span`,{className:`badge badge-primary`,children:[(0,q.jsx)(hn,{size:13}),` جدول المواعيد والزيارات`]}),(0,q.jsx)(`span`,{style:{fontSize:`0.8rem`,color:`var(--gray-400)`},children:`المسار اليومي للمندوب الطبي`})]}),(0,q.jsx)(`h1`,{className:`page-title`,children:`جدول زيارات الصيدليات الميدانية`}),(0,q.jsx)(`p`,{className:`page-subtitle`,children:`تنظيم مواعيد المندوب، متابعة الصيدليات المجدولة، وتحويل الزيارة مباشرة إلى فاتورة.`})]}),(0,q.jsxs)(`button`,{onClick:()=>a(!0),className:`btn-clay btn-primary`,children:[(0,q.jsx)(Fr,{size:18}),(0,q.jsx)(`span`,{children:`حجز موعد زيارة جديد`})]})]}),(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(200px, 1fr))`,gap:`1rem`},children:[(0,q.jsx)(`div`,{className:`stat-card`,children:(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,children:`إجمالي المواعيد المجدولة`}),(0,q.jsx)(`div`,{className:`stat-value`,style:{color:`var(--primary)`},children:o.length}),(0,q.jsx)(`div`,{className:`stat-sub`,children:`مواعيد مسجلة`})]})}),(0,q.jsx)(`div`,{className:`stat-card`,children:(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,children:`الزيارات المكتملة`}),(0,q.jsx)(`div`,{className:`stat-value`,style:{color:`var(--success)`},children:o.filter(e=>e.status===`completed`).length}),(0,q.jsx)(`div`,{className:`stat-sub`,children:`زيارة منجزة`})]})}),(0,q.jsx)(`div`,{className:`stat-card`,children:(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,children:`المواعيد القادمة`}),(0,q.jsx)(`div`,{className:`stat-value`,style:{color:`var(--warning)`},children:o.filter(e=>e.status===`scheduled`).length}),(0,q.jsx)(`div`,{className:`stat-sub`,children:`بانتظار الانطلاق`})]})})]}),(0,q.jsxs)(`div`,{className:`tab-pills`,style:{margin:0},children:[(0,q.jsxs)(`button`,{onClick:()=>r(`all`),className:`tab-pill ${n===`all`?`active`:``}`,children:[`الكل (`,o.length,`)`]}),(0,q.jsxs)(`button`,{onClick:()=>r(`scheduled`),className:`tab-pill ${n===`scheduled`?`active`:``}`,children:[`المجدولة القادمة (`,o.filter(e=>e.status===`scheduled`).length,`)`]}),(0,q.jsxs)(`button`,{onClick:()=>r(`completed`),className:`tab-pill ${n===`completed`?`active`:``}`,children:[`المكتملة (`,o.filter(e=>e.status===`completed`).length,`)`]})]}),(0,q.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(270px, 1fr))`,gap:`1rem`},children:x.map(e=>{let n=S(e.purpose);return(0,q.jsxs)(`div`,{className:`card`,style:{display:`flex`,flexDirection:`column`,justifyContent:`space-between`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:`0.75rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`span`,{className:`badge ${n.badge}`,style:{marginBottom:`0.4rem`,display:`inline-flex`},children:n.label}),(0,q.jsx)(`h4`,{style:{fontWeight:800,margin:`0.3rem 0 0`,color:`var(--gray-900)`},children:e.pharmacy_name})]}),(0,q.jsx)(`span`,{className:`badge ${e.status===`completed`?`badge-success`:e.status===`cancelled`?`badge-danger`:`badge-warning`}`,children:e.status===`completed`?`مكتملة ✓`:e.status===`cancelled`?`ملغاة`:`قيد الانتظار`})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`1rem`,fontSize:`0.82rem`,color:`var(--gray-500)`,marginBottom:`0.75rem`},children:[(0,q.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`0.3rem`},children:[(0,q.jsx)(hn,{size:14,style:{color:`var(--primary)`}}),` `,e.visit_date]}),(0,q.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`0.3rem`},children:[(0,q.jsx)(Fn,{size:14,style:{color:`var(--warning)`}}),` `,e.visit_time]})]}),e.notes&&(0,q.jsx)(`p`,{style:{fontSize:`0.85rem`,color:`var(--gray-600)`,background:`var(--gray-50)`,padding:`0.65rem 0.85rem`,borderRadius:10,margin:`0 0 1rem`},children:e.notes})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,gap:`0.5rem`,paddingTop:`0.75rem`,borderTop:`1px solid var(--gray-100)`},children:[(0,q.jsxs)(`button`,{onClick:()=>t(e.pharmacy_id),className:`btn-clay btn-primary btn-sm`,style:{fontWeight:700},children:[(0,q.jsx)($n,{size:15}),` إنشاء فاتورة`]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.35rem`},children:[e.status!==`completed`&&(0,q.jsxs)(`button`,{onClick:()=>b(e.id,`completed`),className:`btn-clay btn-success btn-sm`,title:`تمت الزيارة`,children:[(0,q.jsx)(jn,{size:15}),` تم`]}),e.status!==`cancelled`&&(0,q.jsxs)(`button`,{onClick:()=>b(e.id,`cancelled`),className:`btn-clay btn-secondary btn-sm`,title:`إلغاء الموعد`,children:[(0,q.jsx)(Nn,{size:15}),` إلغاء`]})]})]})]},e.id)})}),i&&(0,q.jsxs)(Si,{maxWidth:500,onClose:()=>a(!1),children:[(0,q.jsxs)(`div`,{className:`modal-header`,children:[(0,q.jsxs)(`h4`,{className:`modal-title`,style:{display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,q.jsx)(hn,{size:20,style:{color:`var(--primary)`}}),`حجز موعد زيارة جديد`]}),(0,q.jsx)(`button`,{onClick:()=>a(!1),style:{background:`none`,border:`none`,cursor:`pointer`,color:`var(--gray-400)`},children:(0,q.jsx)(hi,{size:20})})]}),(0,q.jsxs)(`form`,{onSubmit:y,className:`modal-body`,style:{display:`flex`,flexDirection:`column`,gap:`1rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:700,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`الصيدلية المستهدفة *`}),(0,q.jsx)(`select`,{className:`clay-input`,value:c,onChange:e=>l(e.target.value),required:!0,children:e.map(e=>(0,q.jsxs)(`option`,{value:e.id,children:[e.name,` (`,e.city,`)`]},e.id))})]}),(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`0.75rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:700,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`تاريخ الزيارة *`}),(0,q.jsx)(`input`,{type:`date`,className:`clay-input`,value:u,onChange:e=>d(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:700,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`وقت الزيارة *`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,placeholder:`10:30 ص`,value:f,onChange:e=>p(e.target.value),required:!0})]})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:700,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`الغرض من الزيارة *`}),(0,q.jsxs)(`select`,{className:`clay-input`,value:m,onChange:e=>h(e.target.value),children:[(0,q.jsx)(`option`,{value:`routine_check`,children:`زيارة متابعة دورية`}),(0,q.jsx)(`option`,{value:`order_delivery`,children:`تسليم شحنة طلبيات`}),(0,q.jsx)(`option`,{value:`sample_show`,children:`عرض عينات جديدة وبونص 10+1`}),(0,q.jsx)(`option`,{value:`collection`,children:`تحصيل ومطابقة مالية`})]})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:700,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`ملاحظات الموعد`}),(0,q.jsx)(`textarea`,{className:`clay-input`,rows:2,placeholder:`ملاحظات وتفاصيل الزيارة...`,value:g,onChange:e=>v(e.target.value)})]}),(0,q.jsxs)(`div`,{className:`modal-footer`,children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>a(!1),className:`btn-clay btn-secondary btn-sm`,children:`إلغاء`}),(0,q.jsx)(`button`,{type:`submit`,className:`btn-clay btn-primary btn-sm`,children:`تأكيد حجز الموعد`})]})]})]})]})},wi=[`الزعفرانية`,`مدينة الصدر`,`الكرادة`,`المنصور`,`الشعب`,`الدورة`,`الكاظمية`,`الحارثية`,`زيونة`,`السيدية`,`الغزالية`,`البلديات`,`الحبيبية`,`بغداد الجديدة`,`العامرية`,`اليرموك`,`حي الجامعة`,`البياع`,`حي أور`,`المشتل`,`الغدير`,`الأعظمية`,`بسماية`,`الشعلة`];function Ti(e){let t=(e||``).toLowerCase();return t.includes(`drop`)||t.includes(`drup`)||t.includes(`قطرة`)||t.includes(`قطره`)?`قطرة`:t.includes(`ointment`)||t.includes(`مرهم`)||t.includes(`oint`)||t.includes(` ung`)?`مرهم`:t.includes(`cream`)||t.includes(`كريم`)||t.includes(` crm`)||t.includes(` cr `)?`كريم`:`حبوب`}function Ei(e){switch(e){case`قطرة`:return{bg:`#eff6ff`,color:`#1d4ed8`,border:`#bfdbfe`};case`كريم`:return{bg:`#ecfdf5`,color:`#047857`,border:`#a7f3d0`};case`مرهم`:return{bg:`#fff7ed`,color:`#c2410c`,border:`#fed7aa`};default:return{bg:`#f5f3ff`,color:`#6d28d9`,border:`#ddd6fe`}}}var Di=({invoices:e,products:t,pharmacies:n,fixedBonusEnabled:r=!0,existingInvoices:i,onSaveAll:a,onCancel:o})=>{let[s,c]=(0,_.useState)(e),[l,u]=(0,_.useState)(!1),[d,f]=(0,_.useState)(null),[p,m]=(0,_.useState)({}),h=(e,t)=>{let n=fe({pharmacy_name:e.pharmacy_name,invoice_date:e.invoice_date,items:(e.items||[]).map(e=>({product_name:e.product_name,quantity:e.quantity}))});if(!n)return{isDuplicate:!1,reason:``};for(let e=0;e<s.length;e++){if(e===t)continue;let r=s[e],i=fe({pharmacy_name:r.pharmacy_name,invoice_date:r.invoice_date,items:(r.items||[]).map(e=>({product_name:e.product_name,quantity:e.quantity}))});if(i&&i===n)return{isDuplicate:!0,reason:`مطابقة تماماً لنفس بيانات وكميات الفاتورة #${e+1} في هذه الدفعة`}}if(i&&i.length>0)for(let e of i){let t=fe({pharmacy_name:e.pharmacy_name,invoice_date:e.invoice_date,items:e.items||[]});if(t&&t===n)return{isDuplicate:!0,reason:`مسجلة مسبقاً لنفس الصيدلية (${e.pharmacy_name||`الصيدلية`}) بنفس التاريخ والأصناف والكميات`}}return{isDuplicate:!1,reason:``}},g=(e,t,r)=>{c(i=>i.map(i=>{if(i.id!==e)return i;if(t===`pharmacy_id`){let e=n.find(e=>e.id===r);return{...i,pharmacy_id:r,pharmacy_name:e?e.name:i.pharmacy_name,pharmacy_area:e?.area||i.pharmacy_area}}if(t===`pharmacy_name`){let e=String(r||``).trim().toLowerCase(),t=n.find(t=>t.name.trim().toLowerCase()===e);return{...i,pharmacy_name:r,pharmacy_id:t?t.id:``,pharmacy_area:t&&t.area||i.pharmacy_area}}return{...i,[t]:r}}))},v=(e,n,i,a)=>{c(o=>o.map(o=>{if(o.id!==e)return o;let s=o.items.map(e=>{if(e.id!==n)return e;let o={...e};if(i===`quantity`){let e=Math.max(1,parseInt(a)||0);o.quantity=e,r&&(o.bonus_quantity=Math.floor(e/10)),o.line_total=e*(o.unit_price||0)}else if(i===`unit_price`){let e=Math.max(0,parseFloat(a)||0);o.unit_price=e,o.line_total=(o.quantity||1)*e}else if(i===`bonus_quantity`)o.bonus_quantity=Math.max(0,parseInt(a)||0);else if(i===`dosage_form`)o.dosage_form=String(a);else if(i===`product_name`){o.product_name=String(a),o.dosage_form=o.dosage_form||Ti(String(a));let e=t.find(e=>e.name.toLowerCase().includes(String(a).toLowerCase()));e&&(o.product_id=e.id,o.unit_price||(o.unit_price=Number(e.base_price),o.line_total=(o.quantity||1)*Number(e.base_price)))}else if(i===`product_id`){o.product_id=String(a);let e=t.find(e=>e.id===a);e&&(o.product_name=e.name,o.dosage_form=o.dosage_form||Ti(e.name),o.unit_price=Number(e.base_price),o.line_total=(o.quantity||1)*Number(e.base_price))}return o});return{...o,items:s}}))},y=e=>{let n=t[0],i={id:`item-${Date.now()}-${Math.random().toString(36).substring(2,6)}`,product_id:n?.id||``,product_name:n?.name||`مستحضر دوائي جديد`,dosage_form:Ti(n?.name||`كريم`),quantity:10,unit_price:Number(n?.base_price||5e3),bonus_quantity:+!!r,line_total:10*Number(n?.base_price||5e3),ocr_confidence:1};c(t=>t.map(t=>t.id===e?{...t,items:[...t.items,i]}:t))},b=(e,t)=>{c(n=>n.map(n=>n.id===e?{...n,items:n.items.filter(e=>e.id!==t)}:n))},x=e=>{if(s.length===1){if(!window.confirm(`هذه الفاتورة الوحيدة المتبقية. هل تريد إلغاء مراجعة الدفعة والعودة؟`))return;o()}else c(t=>t.filter(t=>t.id!==e))},S=()=>{c(e=>e.map(e=>({...e,items:e.items.map(e=>({...e,bonus_quantity:Math.floor((Number(e.quantity)||0)/10)}))})))},C=async()=>{for(let e=0;e<s.length;e++){let t=s[e];if(!t.invoice_number?.trim()){alert(`يرجى كتابة رقم الفاتورة للفاتورة رقم ${e+1}`);return}if(!t.pharmacy_name?.trim()){alert(`يرجى تحديد اسم الصيدلية للفاتورة رقم ${e+1} (${t.invoice_number})`);return}if(t.items.length===0){alert(`الفاتورة رقم ${e+1} (${t.invoice_number}) لا تحتوي على أي بنود! أضف صنفاً واحداً على الأقل.`);return}}let e=s.map((e,t)=>({...h(e,t),idx:t+1})).filter(e=>e.isDuplicate);if(!(e.length>0&&!window.confirm(`⚠️ تنبيه: تم اكتشاف ${e.length} فواتير مكررة!\n\n`+e.map(e=>`• فاتورة #${e.idx}: ${e.reason}`).join(`
`)+`

هل تريد بالتأكيد الاستمرار وحفظ جميع الفواتير؟`))){u(!0);try{await a(s)}finally{u(!1)}}},w=s.length,T=s.filter(e=>!!e.needs_review||e.confidence<.75).length,ee=s.filter((e,t)=>h(e,t).isDuplicate).length,E=s.reduce((e,t)=>e+t.items.length,0),te=s.reduce((e,t)=>e+t.items.reduce((e,t)=>e+(Number(t.quantity)||0),0),0),D=s.reduce((e,t)=>e+t.items.reduce((e,t)=>e+(Number(t.bonus_quantity)||0),0),0),ne=s.reduce((e,t)=>e+t.items.reduce((e,t)=>e+(Number(t.line_total)||Number(t.quantity)*Number(t.unit_price)||0),0),0);return(0,q.jsxs)(`div`,{className:`animate-in`,style:{display:`flex`,flexDirection:`column`,gap:`1.25rem`,width:`100%`},children:[(0,q.jsxs)(`div`,{className:`card`,style:{padding:`1.25rem`,background:`linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)`,color:`white`,border:`none`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`1rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,marginBottom:`0.4rem`,flexWrap:`wrap`},children:[(0,q.jsx)(`span`,{className:`badge`,style:{background:`rgba(255,255,255,0.18)`,color:`#a5f3fc`,border:`1px solid rgba(255,255,255,0.25)`},children:`✨ فحص وتدقيق Google Gemini AI`}),(0,q.jsxs)(`span`,{className:`badge`,style:{background:`#10b981`,color:`white`},children:[w,` فواتير مكتشفة`]}),T>0&&(0,q.jsxs)(`span`,{className:`badge`,style:{background:`#f59e0b`,color:`#0f172a`,fontWeight:800},children:[`⚠️ `,T,` تحتاج مراجعة`]}),ee>0&&(0,q.jsxs)(`span`,{className:`badge`,style:{background:`#ef4444`,color:`white`,fontWeight:800},children:[`⚠️ `,ee,` فواتير مكررة`]})]}),(0,q.jsxs)(`h2`,{style:{fontSize:`1.35rem`,fontWeight:900,margin:`0 0 0.25rem 0`,color:`white`},children:[`مراجعة وتدقيق الفواتير المرفوعة (`,w,` صور)`]}),(0,q.jsx)(`p`,{style:{fontSize:`0.82rem`,color:`#cbd5e1`,margin:0},children:`تم استخراج بيانات الفواتير تلقائياً. يمكنك مراجعة وتعديل أي خلية أو قيمة بالضغط عليها مباشرة لضمان دقة 100% قبل الحفظ.`})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.6rem`,flexWrap:`wrap`,alignItems:`center`},children:[(0,q.jsxs)(`button`,{onClick:S,className:`btn-clay btn-secondary btn-sm`,style:{background:`rgba(255,255,255,0.15)`,color:`white`,borderColor:`rgba(255,255,255,0.3)`,fontWeight:700},title:`تطبيق قاعدة 10+1 (كل 10 قطع = 1 مجانية) على جميع فواتير الدفعة`,children:[(0,q.jsx)(pn,{size:14}),` تطبيق 10+1 على الكل`]}),(0,q.jsx)(`button`,{onClick:o,disabled:l,className:`btn-clay btn-secondary btn-sm`,style:{background:`rgba(255,255,255,0.15)`,color:`white`,borderColor:`rgba(255,255,255,0.3)`},children:`إلغاء والعودة`}),(0,q.jsxs)(`button`,{onClick:C,disabled:l||s.length===0,className:`btn-clay btn-primary`,style:{background:`#10b981`,borderColor:`#059669`,color:`white`,fontWeight:900,fontSize:`0.95rem`,padding:`0.6rem 1.4rem`},children:[l?(0,q.jsx)(Lr,{size:16,className:`animate-spin`}):(0,q.jsx)(zr,{size:16}),l?`جارِ الحفظ والمزامنة...`:`💾 حفظ جميع الفواتير (${w}) الآن 🚀`]})]})]}),(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(130px, 1fr))`,gap:`0.75rem`,marginTop:`1.25rem`,paddingTop:`1rem`,borderTop:`1px solid rgba(255,255,255,0.15)`},children:[(0,q.jsxs)(`div`,{style:{background:`rgba(255,255,255,0.1)`,padding:`0.6rem 0.8rem`,borderRadius:10},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.72rem`,color:`#94a3b8`,display:`block`},children:`إجمالي الفواتير`}),(0,q.jsx)(`span`,{style:{fontSize:`1.2rem`,fontWeight:900,color:`white`},children:w})]}),(0,q.jsxs)(`div`,{style:{background:`rgba(255,255,255,0.1)`,padding:`0.6rem 0.8rem`,borderRadius:10},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.72rem`,color:`#94a3b8`,display:`block`},children:`عدد المواد والأصناف`}),(0,q.jsx)(`span`,{style:{fontSize:`1.2rem`,fontWeight:900,color:`#38bdf8`},children:E})]}),(0,q.jsxs)(`div`,{style:{background:`rgba(255,255,255,0.1)`,padding:`0.6rem 0.8rem`,borderRadius:10},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.72rem`,color:`#94a3b8`,display:`block`},children:`إجمالي القطع المباعة`}),(0,q.jsx)(`span`,{style:{fontSize:`1.2rem`,fontWeight:900,color:`#facc15`},children:te})]}),(0,q.jsxs)(`div`,{style:{background:`rgba(255,255,255,0.1)`,padding:`0.6rem 0.8rem`,borderRadius:10},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.72rem`,color:`#94a3b8`,display:`block`},children:`إجمالي البونص المجاني`}),(0,q.jsxs)(`span`,{style:{fontSize:`1.2rem`,fontWeight:900,color:`#a7f3d0`},children:[`+`,D]})]}),(0,q.jsxs)(`div`,{style:{background:`rgba(255,255,255,0.15)`,padding:`0.6rem 0.8rem`,borderRadius:10},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.72rem`,color:`#94a3b8`,display:`block`},children:`صافي القيمة الكلية`}),(0,q.jsxs)(`span`,{style:{fontSize:`1.2rem`,fontWeight:900,color:`#4ade80`},children:[ne.toLocaleString(),` `,(0,q.jsx)(`span`,{style:{fontSize:`0.75rem`},children:`د.ع`})]})]})]})]}),(0,q.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`1.25rem`},children:s.map((e,r)=>{let i=!!p[e.id],a=e.items.reduce((e,t)=>e+(Number(t.line_total)||Number(t.quantity)*Number(t.unit_price)||0),0),o=e.items.reduce((e,t)=>e+(Number(t.quantity)||0),0),s=e.items.reduce((e,t)=>e+(Number(t.bonus_quantity)||0),0),c=!!e.needs_review||e.confidence<.75,l=!c&&e.confidence>=.8?`#10b981`:e.confidence>=.5?`#d97706`:`#ef4444`,u=c?`⚠️ تحتاج مراجعة`:e.confidence>=.8?`دقة عالية ✓`:`دقة متوسطة ⚠️`,d=h(e,r);return(0,q.jsxs)(`div`,{className:`card`,style:{padding:0,overflow:`hidden`,borderRadius:14,border:d.isDuplicate?`2px solid #ef4444`:`2px solid ${!c&&e.confidence>=.8?`#bbf7d0`:c||e.confidence>=.5?`#fde68a`:`#fecaca`}`,boxShadow:d.isDuplicate?`0 4px 16px rgba(239, 68, 68, 0.15)`:`0 4px 16px rgba(0,0,0,0.04)`},children:[(0,q.jsxs)(`div`,{style:{padding:`0.85rem 1.15rem`,background:d.isDuplicate?`#fef2f2`:!c&&e.confidence>=.8?`#f0fdf4`:`#fffbeb`,borderBottom:`1px solid var(--gray-200)`,display:`flex`,alignItems:`center`,justifyContent:`space-between`,flexWrap:`wrap`,gap:`0.75rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.75rem`,flexWrap:`wrap`},children:[e.image_url?(0,q.jsxs)(`div`,{onClick:()=>f(e.image_url),style:{position:`relative`,width:46,height:46,borderRadius:8,overflow:`hidden`,cursor:`pointer`,border:`2px solid white`,boxShadow:`0 2px 6px rgba(0,0,0,0.15)`,flexShrink:0},title:`اضغط لتكبير الصورة الأصلية للمقارنة`,children:[(0,q.jsx)(`img`,{src:e.image_url,alt:``,style:{width:`100%`,height:`100%`,objectFit:`cover`}}),(0,q.jsx)(`div`,{style:{position:`absolute`,inset:0,background:`rgba(0,0,0,0.25)`,display:`flex`,alignItems:`center`,justifyContent:`center`,color:`white`},children:(0,q.jsx)(_i,{size:16})})]}):(0,q.jsx)(`div`,{style:{width:46,height:46,borderRadius:8,background:`#e2e8f0`,display:`flex`,alignItems:`center`,justifyContent:`center`,color:`#64748b`},children:(0,q.jsx)(rr,{size:22})}),(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,marginBottom:`0.2rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`span`,{style:{fontWeight:900,fontSize:`0.95rem`,color:`var(--gray-900)`},children:[`فاتورة #`,r+1,`:`]}),(0,q.jsxs)(`span`,{className:`badge`,style:{background:l,color:`white`,fontSize:`0.72rem`,padding:`2px 8px`},children:[u,` (`,Math.round(e.confidence*100),`%)`]}),d.isDuplicate&&(0,q.jsxs)(`span`,{className:`badge`,style:{background:`#dc2626`,color:`white`,fontSize:`0.72rem`,padding:`2px 8px`,display:`inline-flex`,alignItems:`center`,gap:4},children:[(0,q.jsx)(Dn,{size:13}),` ⚠️ مكررة: `,d.reason]}),e.file_name&&(0,q.jsxs)(`span`,{style:{fontSize:`0.75rem`,color:`var(--gray-500)`,direction:`ltr`},children:[`📄 `,e.file_name]})]}),c&&e.needs_review_reason&&(0,q.jsxs)(`div`,{style:{fontSize:`0.74rem`,color:`#92400e`,fontWeight:700,marginBottom:`0.25rem`},children:[`⚠️ `,e.needs_review_reason]}),(0,q.jsxs)(`div`,{className:`batch-header-fields`,style:{display:`flex`,alignItems:`center`,gap:`1rem`,flexWrap:`wrap`,fontSize:`0.82rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.35rem`},children:[(0,q.jsx)(`span`,{style:{color:`var(--gray-500)`,fontWeight:700},children:`رقم الفاتورة:`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,style:{padding:`2px 8px`,fontSize:`0.82rem`,width:140,fontWeight:800,color:`var(--primary)`},value:e.invoice_number,onChange:t=>g(e.id,`invoice_number`,t.target.value)})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.35rem`},children:[(0,q.jsx)(`span`,{style:{color:`var(--gray-500)`,fontWeight:700},children:`التاريخ:`}),(0,q.jsx)(`input`,{type:`date`,className:`clay-input`,style:{padding:`2px 8px`,fontSize:`0.82rem`,width:135},value:e.invoice_date,onChange:t=>g(e.id,`invoice_date`,t.target.value)})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.35rem`},children:[(0,q.jsx)(`span`,{style:{color:`var(--gray-500)`,fontWeight:700},children:`الصيدلية:`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,placeholder:`اسم الصيدلية...`,style:{padding:`2px 8px`,fontSize:`0.82rem`,width:220,fontWeight:700},value:e.pharmacy_name,onChange:t=>g(e.id,`pharmacy_name`,t.target.value)}),(0,q.jsxs)(`select`,{className:`clay-input`,style:{padding:`2px 4px`,fontSize:`0.78rem`,width:120},value:e.pharmacy_id||``,onChange:t=>g(e.id,`pharmacy_id`,t.target.value),title:`اختر صيدلية مسجلة لتطابق فوري`,children:[(0,q.jsx)(`option`,{value:``,children:`(مطابقة تلقائية)`}),n.map(e=>(0,q.jsx)(`option`,{value:e.id,children:e.name},e.id))]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.35rem`},children:[(0,q.jsx)(`span`,{style:{color:`var(--gray-500)`,fontWeight:700},children:`المنطقة / المكان:`}),(0,q.jsx)(`input`,{type:`text`,list:`areas-list-${e.id}`,className:`clay-input`,placeholder:`الزعفرانية أو مدينة الصدر...`,style:{padding:`2px 8px`,fontSize:`0.82rem`,width:175,fontWeight:700,color:`#0369a1`},value:e.pharmacy_area||``,onChange:t=>g(e.id,`pharmacy_area`,t.target.value)}),(0,q.jsx)(`datalist`,{id:`areas-list-${e.id}`,children:wi.map(e=>(0,q.jsx)(`option`,{value:e},e))})]})]})]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.6rem`},children:[(0,q.jsxs)(`div`,{style:{textAlign:`left`,marginLeft:`0.5rem`},children:[(0,q.jsx)(`div`,{style:{fontSize:`0.72rem`,color:`var(--gray-500)`},children:`صافي الفاتورة`}),(0,q.jsxs)(`div`,{style:{fontSize:`1.05rem`,fontWeight:900,color:`#059669`},children:[a.toLocaleString(),` د.ع`]})]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>m(t=>({...t,[e.id]:!i})),className:`btn-clay btn-secondary btn-sm`,title:i?`عرض جدول المواد`:`طي جدول المواد`,children:[i?(0,q.jsx)(xn,{size:15}):(0,q.jsx)(Tn,{size:15}),i?`عرض (${e.items.length})`:`طي`]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>x(e.id),className:`btn-clay btn-sm`,style:{background:d.isDuplicate?`#dc2626`:`#fee2e2`,color:d.isDuplicate?`white`:`#b91c1c`,borderColor:d.isDuplicate?`#b91c1c`:`#fca5a5`,fontWeight:d.isDuplicate?800:600,display:`flex`,alignItems:`center`,gap:4},title:d.isDuplicate?`إزالة هذه الفاتورة المكررة من الدفعة`:`حذف هذه الفاتورة من الدفعة`,children:[(0,q.jsx)($r,{size:15}),d.isDuplicate?`إزالة المكررة`:`حذف`]})]})]}),!i&&(0,q.jsxs)(`div`,{style:{padding:`0.75rem 1rem`},children:[(0,q.jsx)(`div`,{className:`table-responsive desktop-table-view`,children:(0,q.jsxs)(`table`,{className:`clay-table`,style:{width:`100%`,fontSize:`0.82rem`,marginBottom:0},children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{style:{background:`#f8fafc`},children:[(0,q.jsx)(`th`,{style:{width:40,textAlign:`center`},children:`#`}),(0,q.jsx)(`th`,{children:`اسم المادة الدوائية (قابل للتعديل)`}),(0,q.jsx)(`th`,{style:{width:110,textAlign:`center`},children:`نوع المادة`}),(0,q.jsx)(`th`,{style:{width:100,textAlign:`center`},children:`الكمية`}),(0,q.jsx)(`th`,{style:{width:120,textAlign:`center`},children:`سعر المفرد (د.ع)`}),(0,q.jsx)(`th`,{style:{width:90,textAlign:`center`},children:`البونص المجاني`}),(0,q.jsx)(`th`,{style:{width:120,textAlign:`center`},children:`المجموع (د.ع)`}),(0,q.jsx)(`th`,{style:{width:45,textAlign:`center`},children:`حذف`})]})}),(0,q.jsx)(`tbody`,{children:e.items.map((n,r)=>(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`td`,{style:{textAlign:`center`,fontWeight:700,color:`var(--gray-400)`},children:r+1}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.35rem`,alignItems:`center`},children:[(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,style:{flex:1,padding:`3px 8px`,fontSize:`0.82rem`,fontWeight:700},value:n.product_name,onChange:t=>v(e.id,n.id,`product_name`,t.target.value),placeholder:`اسم المستحضر...`}),(0,q.jsxs)(`select`,{className:`clay-input`,style:{width:120,padding:`3px 4px`,fontSize:`0.75rem`,color:`var(--gray-600)`},value:n.product_id||``,onChange:t=>v(e.id,n.id,`product_id`,t.target.value),title:`اختر من المنتجات المسجلة في الكتالوج`,children:[(0,q.jsx)(`option`,{value:``,children:`(منتج حر)`}),t.map(e=>(0,q.jsx)(`option`,{value:e.id,children:e.name},e.id))]})]})}),(0,q.jsx)(`td`,{style:{textAlign:`center`},children:(0,q.jsxs)(`select`,{className:`clay-input`,style:{padding:`2px 4px`,fontSize:`0.78rem`,fontWeight:800,borderRadius:6,width:95,textAlign:`center`,background:n.dosage_form===`كريم`?`#ecfdf5`:n.dosage_form===`مرهم`?`#fff7ed`:n.dosage_form===`قطرة`?`#eff6ff`:`#f5f3ff`,color:n.dosage_form===`كريم`?`#047857`:n.dosage_form===`مرهم`?`#c2410c`:n.dosage_form===`قطرة`?`#1d4ed8`:`#6d28d9`},value:n.dosage_form||`حبوب`,onChange:t=>v(e.id,n.id,`dosage_form`,t.target.value),children:[(0,q.jsx)(`option`,{value:`قطرة`,children:`قطرة`}),(0,q.jsx)(`option`,{value:`كريم`,children:`كريم`}),(0,q.jsx)(`option`,{value:`مرهم`,children:`مرهم`}),(0,q.jsx)(`option`,{value:`حبوب`,children:`حبوب`})]})}),(0,q.jsx)(`td`,{style:{textAlign:`center`},children:(0,q.jsx)(`input`,{type:`number`,min:1,className:`clay-input`,style:{width:75,padding:`3px 6px`,textAlign:`center`,fontWeight:800,fontSize:`0.85rem`},value:n.quantity,onChange:t=>v(e.id,n.id,`quantity`,t.target.value)})}),(0,q.jsx)(`td`,{style:{textAlign:`center`},children:(0,q.jsx)(`input`,{type:`number`,min:0,step:250,className:`clay-input`,style:{width:95,padding:`3px 6px`,textAlign:`center`,fontWeight:700,fontSize:`0.82rem`},value:n.unit_price,onChange:t=>v(e.id,n.id,`unit_price`,t.target.value)})}),(0,q.jsx)(`td`,{style:{textAlign:`center`},children:(0,q.jsx)(`input`,{type:`number`,min:0,className:`clay-input`,style:{width:65,padding:`3px 6px`,textAlign:`center`,fontWeight:800,fontSize:`0.82rem`,color:n.bonus_quantity>0?`#b45309`:`var(--gray-500)`,background:n.bonus_quantity>0?`#fef3c7`:void 0},value:n.bonus_quantity,onChange:t=>v(e.id,n.id,`bonus_quantity`,t.target.value)})}),(0,q.jsxs)(`td`,{style:{textAlign:`center`,fontWeight:800,color:`var(--primary)`,fontSize:`0.85rem`},children:[(n.line_total||n.quantity*n.unit_price).toLocaleString(),` د.ع`]}),(0,q.jsx)(`td`,{style:{textAlign:`center`},children:(0,q.jsx)(`button`,{type:`button`,onClick:()=>b(e.id,n.id),style:{background:`#fee2e2`,border:`1px solid #fca5a5`,borderRadius:6,color:`#dc2626`,cursor:`pointer`,padding:`4px 6px`,touchAction:`manipulation`},title:`حذف هذا الصنف`,children:(0,q.jsx)($r,{size:15})})})]},n.id))})]})}),(0,q.jsx)(`div`,{className:`mobile-cards-view`,style:{gap:`0.75rem`},children:e.items.map((t,n)=>(0,q.jsxs)(`div`,{style:{background:`#f8fafc`,border:`1.5px solid var(--gray-200)`,borderRadius:12,padding:`0.75rem`,display:`flex`,flexDirection:`column`,gap:`0.55rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,gap:`0.4rem`},children:[(0,q.jsxs)(`span`,{style:{fontWeight:800,fontSize:`0.8rem`,color:`var(--gray-500)`},children:[`صنف #`,n+1]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>b(e.id,t.id),className:`btn-clay btn-danger btn-sm`,style:{padding:`0.35rem 0.7rem`,fontSize:`0.78rem`,background:`#fee2e2`,color:`#dc2626`,border:`1px solid #fca5a5`,fontWeight:800,touchAction:`manipulation`},children:[(0,q.jsx)($r,{size:14}),` حذف الصنف`]})]}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,style:{padding:`0.45rem 0.65rem`,fontSize:`0.85rem`,fontWeight:700},value:t.product_name,onChange:n=>v(e.id,t.id,`product_name`,n.target.value),placeholder:`اسم المستحضر...`}),(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`0.5rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`span`,{style:{fontSize:`0.68rem`,color:`var(--gray-500)`,display:`block`},children:`نوع المادة`}),(0,q.jsxs)(`select`,{className:`clay-input`,style:{padding:`0.4rem`,fontSize:`0.8rem`,fontWeight:700},value:t.dosage_form||`حبوب`,onChange:n=>v(e.id,t.id,`dosage_form`,n.target.value),children:[(0,q.jsx)(`option`,{value:`قطرة`,children:`قطرة`}),(0,q.jsx)(`option`,{value:`كريم`,children:`كريم`}),(0,q.jsx)(`option`,{value:`مرهم`,children:`مرهم`}),(0,q.jsx)(`option`,{value:`حبوب`,children:`حبوب`})]})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`span`,{style:{fontSize:`0.68rem`,color:`var(--gray-500)`,display:`block`},children:`الكمية`}),(0,q.jsx)(`input`,{type:`number`,min:1,className:`clay-input`,style:{padding:`0.4rem`,textAlign:`center`,fontWeight:800},value:t.quantity,onChange:n=>v(e.id,t.id,`quantity`,n.target.value)})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`span`,{style:{fontSize:`0.68rem`,color:`var(--gray-500)`,display:`block`},children:`سعر المفرد`}),(0,q.jsx)(`input`,{type:`number`,min:0,step:250,className:`clay-input`,style:{padding:`0.4rem`,textAlign:`center`,fontWeight:700},value:t.unit_price,onChange:n=>v(e.id,t.id,`unit_price`,n.target.value)})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`span`,{style:{fontSize:`0.68rem`,color:`var(--gray-500)`,display:`block`},children:`البونص`}),(0,q.jsx)(`input`,{type:`number`,min:0,className:`clay-input`,style:{padding:`0.4rem`,textAlign:`center`,fontWeight:800,color:t.bonus_quantity>0?`#b45309`:void 0},value:t.bonus_quantity,onChange:n=>v(e.id,t.id,`bonus_quantity`,n.target.value)})]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,background:`#eff6ff`,padding:`0.4rem 0.65rem`,borderRadius:8},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.75rem`,fontWeight:700,color:`var(--gray-600)`},children:`المجموع الصافي:`}),(0,q.jsxs)(`span`,{style:{fontWeight:900,color:`var(--primary)`,fontSize:`0.88rem`},children:[(t.line_total||t.quantity*t.unit_price).toLocaleString(),` د.ع`]})]})]},t.id))}),(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginTop:`0.6rem`,paddingTop:`0.6rem`,borderTop:`1px solid var(--gray-100)`},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>y(e.id),className:`btn-clay btn-secondary btn-sm`,style:{fontSize:`0.78rem`,display:`flex`,alignItems:`center`,gap:`0.3rem`,fontWeight:700},children:[(0,q.jsx)(Fr,{size:14}),` إضافة صنف إضافي للفاتورة`]}),(0,q.jsxs)(`div`,{style:{fontSize:`0.8rem`,color:`var(--gray-600)`},children:[(0,q.jsxs)(`span`,{children:[`مجموع الأصناف: `,(0,q.jsx)(`strong`,{children:e.items.length})]}),` |`,` `,(0,q.jsxs)(`span`,{children:[`القطع: `,(0,q.jsx)(`strong`,{children:o})]}),` |`,` `,(0,q.jsxs)(`span`,{children:[`البونص: `,(0,q.jsxs)(`strong`,{style:{color:`#b45309`},children:[`+`,s]})]}),` |`,` `,(0,q.jsxs)(`span`,{children:[`الصافي: `,(0,q.jsxs)(`strong`,{style:{color:`#059669`,fontSize:`0.9rem`},children:[a.toLocaleString(),` د.ع`]})]})]})]})]})]},e.id)})}),(0,q.jsxs)(`div`,{style:{position:`sticky`,bottom:`clamp(5px, 1.5vh, 15px)`,zIndex:50,background:`white`,padding:`0.9rem 1.25rem`,borderRadius:14,boxShadow:`0 8px 30px rgba(0,0,0,0.12)`,border:`1.5px solid var(--gray-200)`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`0.75rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.75rem`},children:[(0,q.jsx)(jn,{size:22,style:{color:`#059669`}}),(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{fontWeight:800,fontSize:`0.9rem`,color:`var(--gray-800)`},children:[`تم تدقيق `,w,` فواتير بإجمالي `,te,` قطعة`]}),(0,q.jsxs)(`div`,{style:{fontSize:`0.78rem`,color:`var(--gray-500)`},children:[`المجموع الإجمالي لكافة الفواتير:`,` `,(0,q.jsxs)(`strong`,{style:{color:`#059669`,fontSize:`0.9rem`},children:[ne.toLocaleString(),` د.ع`]})]})]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.6rem`},children:[(0,q.jsx)(`button`,{type:`button`,onClick:o,disabled:l,className:`btn-clay btn-secondary`,style:{fontWeight:700},children:`إلغاء والعودة`}),(0,q.jsxs)(`button`,{type:`button`,onClick:C,disabled:l||s.length===0,className:`btn-clay btn-primary`,style:{fontWeight:900,fontSize:`0.95rem`,padding:`0.65rem 1.75rem`},children:[l?(0,q.jsx)(Lr,{size:18,className:`animate-spin`}):(0,q.jsx)(zr,{size:18}),l?`جارِ الحفظ والمزامنة...`:`حفظ وتصدير ${w} فواتير الآن 🚀`]})]})]}),d&&(0,q.jsxs)(Si,{onClose:()=>f(null),maxWidth:`92vw`,backdropStyle:{zIndex:99999,cursor:`zoom-out`},cardStyle:{maxHeight:`92vh`,padding:`0.75rem`,background:`#0f172a`,borderRadius:14,display:`flex`,flexDirection:`column`,alignItems:`center`,position:`relative`},children:[(0,q.jsxs)(`div`,{style:{width:`100%`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`0.5rem`,color:`white`},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.85rem`,fontWeight:700},children:`🔍 معاينة الفاتورة الأصلية لمطابقة القراءة`}),(0,q.jsx)(`button`,{onClick:()=>f(null),style:{background:`none`,border:`none`,color:`white`,cursor:`pointer`,padding:4},children:(0,q.jsx)(hi,{size:20})})]}),(0,q.jsx)(`img`,{src:d,alt:`Invoice Preview`,style:{maxWidth:`100%`,maxHeight:`80vh`,objectFit:`contain`,borderRadius:8,boxShadow:`0 4px 20px rgba(0,0,0,0.5)`}})]})]})},Oi=()=>{let e=new Date;return`INV-${e.getFullYear()}${String(e.getMonth()+1).padStart(2,`0`)}${String(e.getDate()).padStart(2,`0`)}-${Math.floor(1e3+Math.random()*9e3)}`},ki=({pharmacies:e,products:t,invoices:n=[],initialPharmacyId:r,onInvoiceCreated:i,onCancel:a})=>{let[o,s]=(0,_.useState)(`ocr`),[l,u]=(0,_.useState)(e),[d,f]=(0,_.useState)(r||``),[p,m]=(0,_.useState)(()=>{let t=e.find(e=>e.id===r);return t?t.name:``}),[h,g]=(0,_.useState)(()=>e.find(e=>e.id===r)?.area||``),[v,y]=(0,_.useState)(Oi),[b,x]=(0,_.useState)(new Date().toISOString().split(`T`)[0]),[S,C]=(0,_.useState)(``),[T,ee]=(0,_.useState)(``),[E,te]=(0,_.useState)(``),[D,ne]=(0,_.useState)(!0),[O,re]=(0,_.useState)([{id:`item-1`,product_id:t[0]?.id||``,sold_quantity:10,ocr_bonus:1}]),ae=(()=>{let e=fe({pharmacy_name:p||l.find(e=>e.id===d)?.name||``,invoice_date:b,items:O.map(e=>({product_name:e.custom_name||t.find(t=>t.id===e.product_id)?.name||e.product_id,quantity:e.sold_quantity}))});return e&&n.find(t=>{let n=fe({pharmacy_name:t.pharmacy_name,invoice_date:t.invoice_date,items:t.items});return!!n&&n===e})||null})();_.useEffect(()=>{u(e)},[e]);let[k,A]=(0,_.useState)([]),[oe,se]=(0,_.useState)(0),[ce,j]=(0,_.useState)(!1),[le,ue]=(0,_.useState)(!1),[de,pe]=(0,_.useState)([]),[me,M]=(0,_.useState)(null),[he,ge]=(0,_.useState)(null),[_e,N]=(0,_.useState)(!1),[P,ve]=(0,_.useState)(!1),[ye,be]=(0,_.useState)(null),[xe,F]=(0,_.useState)(!1),[I,Se]=(0,_.useState)(null),[Ce,we]=(0,_.useState)(!1),[Te,Ee]=(0,_.useState)(null),[L,De]=(0,_.useState)(!1),[Oe,ke]=(0,_.useState)(null),[Ae,je]=(0,_.useState)(null),[Me,Ne]=(0,_.useState)(!1),[Pe,Fe]=(0,_.useState)(!1),[Be,R]=(0,_.useState)(0),[Ve,He]=(0,_.useState)(null),[Ue,We]=(0,_.useState)(!1),[Ge,Ke]=(0,_.useState)(!1),[qe,Je]=(0,_.useState)(()=>Re()),[Ye,Xe]=(0,_.useState)(!1),[Ze,z]=(0,_.useState)(!1),[Qe,et]=(0,_.useState)(null),[B,rt]=(0,_.useState)(()=>Ie()),[it,at]=(0,_.useState)(!1),[ot,st]=(0,_.useState)(()=>$e()),[ct,lt]=(0,_.useState)(()=>typeof navigator<`u`?navigator.onLine:!0),ut=(0,_.useRef)(null),dt=(0,_.useRef)(null),ft=async()=>{try{let e=await w(()=>import(`./eruda-BqWSbn-Y.js`).then(e=>c(e.default,1)),[],import.meta.url);(e.default||e).init(),at(!0)}catch(e){yt(`تعذر تشغيل أداة التشخيص: `+(e?.message||``))}};(0,_.useEffect)(()=>{typeof window<`u`&&window.location.search.includes(`debug=1`)&&!it&&ft();let e=()=>{lt(!0),st($e()),G.syncSharedGeminiKeyFromSheet().then(e=>{e&&Je(e)}).catch(()=>{})},t=()=>lt(!1);return window.addEventListener(`online`,e),window.addEventListener(`offline`,t),G.syncSharedGeminiKeyFromSheet().then(e=>{e&&Je(e)}).catch(()=>{}),()=>{window.removeEventListener(`online`,e),window.removeEventListener(`offline`,t)}},[]);let pt=e=>{if(e<0||e>=k.length)return;A(e=>e.map((e,t)=>t===oe?{...e,pharmacyId:d,pharmacyName:p,pharmacyArea:h,invoiceNumber:v,invoiceDate:b,items:O,notes:S,imageUrl:T}:e));let n=k[e];se(e),f(n.pharmacyId),m(n.pharmacyName),g(n.pharmacyArea||``),te(n.pharmacyName),y(n.invoiceNumber),x(n.invoiceDate),re(n.items&&n.items.length>0?n.items:[{id:`item-1`,product_id:t[0]?.id||``,sold_quantity:10,dosage_form:`حبوب`}]),C(n.notes||``),ge(n.previewUrl),ee(n.imageUrl||``),M(n.file),F(n.status===`done`),R(n.confidence),Se(n.ocrEngine||null),we(!!n.needsReview),Ee(n.needsReviewReason||null),De(!!n.cached)},mt=e=>{let n=k.filter((t,n)=>n!==e);if(A(n),n.length===0)M(null),ge(null),F(!1),we(!1),Ee(null),De(!1),Se(null),m(``),g(``),f(``),y(Oi()),re([{id:`item-1`,product_id:t[0]?.id||``,sold_quantity:10,dosage_form:`حبوب`}]),se(0);else{let t=Math.min(e,n.length-1);se(t);let r=n[t];f(r.pharmacyId),m(r.pharmacyName),g(r.pharmacyArea||``),y(r.invoiceNumber),x(r.invoiceDate),re(r.items),ge(r.previewUrl),M(r.file),F(r.status===`done`),R(r.confidence),Se(r.ocrEngine||null),we(!!r.needsReview),Ee(r.needsReviewReason||null),De(!!r.cached)}},[ht,gt]=(0,_.useState)(!1),[_t,yt]=(0,_.useState)(null),bt=e=>{let n=t.find(t=>t.id===e.product_id)||t[0],r=e.custom_price??(n?.base_price?Number(n.base_price):0),i=Math.floor(e.sold_quantity/10);e.manual_bonus===void 0?D?i=Math.floor(e.sold_quantity/10):e.ocr_bonus!==void 0&&(i=e.ocr_bonus):i=e.manual_bonus;let a=e.sold_quantity*r,o=e.custom_name||n?.name||``;return{prod:n,unitPrice:r,bonus:i,lineTotal:a,displayName:o}},xt=O.reduce((e,t)=>e+bt(t).lineTotal,0),St=O.reduce((e,t)=>e+t.sold_quantity,0),Ct=O.reduce((e,t)=>e+bt(t).bonus,0),wt=()=>re(e=>[...e,{id:`item-`+Date.now(),product_id:t[0]?.id||``,sold_quantity:10,custom_name:``,dosage_form:`حبوب`,custom_price:void 0,ocr_bonus:D?1:void 0}]),Tt=e=>{re(t=>t.filter(t=>t.id!==e))},Et=(e,t,n)=>re(r=>r.map(r=>{if(r.id!==e)return r;let i={...r,[t]:n};if(t===`sold_quantity`&&D&&r.manual_bonus===void 0&&(i.ocr_bonus=Math.floor((Number(n)||0)/10)),t===`custom_name`&&!r.dosage_form){let e=Ti(n);e&&(i.dosage_form=e)}return i})),Dt=(0,_.useCallback)((e,n)=>!e||e.length===0?[]:e.map((e,r)=>{let i=t.find(t=>t.id===e.product_id);!i&&e.product_name&&(i=t.find(t=>t.name.toLowerCase().includes(e.product_name.toLowerCase().slice(0,6))||e.product_name.toLowerCase().includes(t.name.toLowerCase().slice(0,6))));let a=e.quantity||10;return{id:`ocr-`+r+`-`+Date.now().toString().slice(-4),product_id:i?.id||t[0]?.id||``,sold_quantity:a,custom_name:e.product_name||i?.name||``,dosage_form:e.dosage_form||Ti(e.product_name||i?.name||``),custom_price:e.unit_price??(i?Number(i.base_price):void 0),ocr_bonus:D||e.bonus_quantity===void 0?Math.floor(a/10):e.bonus_quantity,ocr_confidence:n}}),[t,D]),Ot=e=>!!(e.needs_review??(e.offline_mode||Number(e.confidence||0)<.75)),kt=async e=>{ve(!0),F(!1),Fe(!1),we(!1),Ee(null),De(!1),ke(null),je(null),Se(null),yt(null),be({stage:`inspect`,percent:8,message:`فحص سلامة الملف وصيغته الحقيقية...`});try{let t=await G.uploadInvoiceFile(e,d,{onProgress:e=>be(e),onPreparedPreview:e=>ge(e)}),n=Ot(t);if(we(n),Ee(t.needs_review_reason||null),De(!!t.cached),t.image_url&&ee(t.image_url),t.ocr_engine&&Se(t.ocr_engine),t.raw_text&&je(t.raw_text),t.ocr_warning&&ke(t.ocr_warning),t.queued_offline&&st($e()),t.offline_mode){Fe(!0),R(0),t.ocr_error&&!t.ocr_warning&&ke(t.ocr_error),He(`تم إرفاق صورة الفاتورة بنجاح — أكمل البيانات يدوياً أو أضف مفتاح Google Gemini لقراءتها آلياً.`);return}if(t.pharmacy_name&&(m(t.pharmacy_name),te(t.pharmacy_name)),t.pharmacy_area&&g(t.pharmacy_area),t.pharmacy_id)f(t.pharmacy_id),u(e=>e.some(e=>e.id===t.pharmacy_id)?e:[{id:t.pharmacy_id,name:t.pharmacy_name||`صيدلية جديدة`,city:`بغداد`,area:t.pharmacy_area},...e]);else if(t.pharmacy_name){let e=l.find(e=>e.name.includes(t.pharmacy_name));e&&(f(e.id),e.area&&!t.pharmacy_area&&g(e.area))}t.invoice_number&&y(t.invoice_number),t.invoice_date&&x(t.invoice_date);let r=Dt(t.extracted_items,t.confidence);r.length>0&&re(r),R(Math.round((t.confidence||.7)*100)),F(!0);let i=t.ocr_engine===`gemini-browser`?`Google Gemini AI`:`خادم Gemini AI`;He(r.length>0?`تم استخراج ${r.length} أصناف عبر (${i})${t.pharmacy_name?` — `+t.pharmacy_name:``}`:`تمت معالجة الصورة عبر (${i}) — يرجى التحقق من الأصناف وتأكيدها.`)}catch(e){yt(`تعذر استخراج بيانات الملف: `+(e.message||`خطأ غير متوقع`))}finally{ve(!1)}},At=(0,_.useCallback)(async e=>{if(!e||e.length===0)return;let n=Array.from(e);if(yt(null),we(!1),Ee(null),De(!1),ke(null),je(null),n.length>1||k.length>0){let e=n.map((e,n)=>({id:`batch-${Date.now()}-${n}-${Math.random().toString(36).substring(2,6)}`,file:e,previewUrl:e.type.startsWith(`image/`)&&!/\.hei[cf]$/i.test(e.name)?URL.createObjectURL(e):``,status:`pending`,pharmacyId:``,pharmacyName:``,pharmacyArea:``,invoiceNumber:Oi(),invoiceDate:new Date().toISOString().split(`T`)[0],items:[{id:`item-1`,product_id:t[0]?.id||``,sold_quantity:10,dosage_form:`حبوب`}],confidence:0})),r=[...k,...e];A(r);let i=k.length;se(i);for(let n=0;n<e.length;n++){let r=i+n,a=e[n].file;A(e=>e.map((e,t)=>t===r?{...e,status:`scanning`}:e)),r===i&&(ve(!0),ge(e[n].previewUrl),M(a),m(``),g(``),f(``));try{let e=await G.uploadInvoiceFile(a,void 0,{onProgress:e=>{r===i&&be(e)},onPreparedPreview:e=>{A(t=>t.map((t,n)=>n===r?{...t,previewUrl:e}:t)),r===i&&ge(e)}}),n=Ot(e),o=Dt(e.extracted_items,e.confidence),s=o.length>0?o:[{id:`item-1`,product_id:t[0]?.id||``,sold_quantity:10,dosage_form:`حبوب`}];A(t=>t.map((t,i)=>i===r?{...t,status:`done`,pharmacyId:e.pharmacy_id||``,pharmacyName:e.pharmacy_name||``,pharmacyArea:e.pharmacy_area||``,invoiceNumber:e.invoice_number||t.invoiceNumber,invoiceDate:e.invoice_date||t.invoiceDate,imageUrl:e.image_url,items:s,confidence:Math.round((e.confidence||.7)*100),ocrEngine:e.ocr_engine,needsReview:n,needsReviewReason:e.needs_review_reason,cached:!!e.cached}:t)),r===i&&(e.pharmacy_name&&(m(e.pharmacy_name),te(e.pharmacy_name)),e.pharmacy_area&&g(e.pharmacy_area),e.pharmacy_id&&f(e.pharmacy_id),e.invoice_number&&y(e.invoice_number),e.invoice_date&&x(e.invoice_date),e.image_url&&ee(e.image_url),e.ocr_engine&&Se(e.ocr_engine),e.ocr_warning&&ke(e.ocr_warning),e.raw_text&&je(e.raw_text),we(n),Ee(e.needs_review_reason||null),De(!!e.cached),re(s),e.offline_mode?(Fe(!0),R(0),He(`تم إرفاق الصور بنجاح — يمكنك مراجعتها وتعبئة البيانات مباشرة.`)):(R(Math.round((e.confidence||.7)*100)),F(!0),He(`تم استخراج ${e.extracted_items?.length||0} أصناف — ${e.pharmacy_name||``}`)))}catch(e){A(t=>t.map((t,n)=>n===r?{...t,status:`error`,errorMsg:e.message}:t)),r===i&&yt(e.message)}finally{r===i&&ve(!1)}}n.length>1&&setTimeout(()=>{A(e=>{let n=e.map((e,n)=>({id:e.id||`inv-${n}`,file_name:e.file?.name,image_url:e.imageUrl||e.previewUrl,invoice_number:e.invoiceNumber,invoice_date:e.invoiceDate,pharmacy_id:e.pharmacyId,pharmacy_name:e.pharmacyName,pharmacy_area:e.pharmacyArea||``,confidence:e.confidence?e.confidence/100:.8,ocr_engine:e.ocrEngine,needs_review:e.needsReview,needs_review_reason:e.needsReviewReason,items:(e.items||[]).map((e,n)=>{let r=t.find(t=>t.id===e.product_id),i=e.custom_price===void 0?Number(r?.base_price||5e3):e.custom_price,a=e.manual_bonus===void 0?e.ocr_bonus===void 0?Math.floor((e.sold_quantity||10)/10):e.ocr_bonus:e.manual_bonus;return{id:e.id||`it-${n}`,product_id:e.product_id,product_name:e.custom_name||r?.name||`مستحضر دوائي`,dosage_form:e.dosage_form||Ti(e.custom_name||r?.name||``),quantity:e.sold_quantity||10,unit_price:i,bonus_quantity:a,line_total:(e.sold_quantity||10)*i,ocr_confidence:e.ocr_confidence}})}));return pe(n),ue(!0),e})},400)}else{let e=n[0];M(e),y(Oi()),x(new Date().toISOString().split(`T`)[0]),C(``),re([{id:`item-1`,product_id:t[0]?.id||``,sold_quantity:10}]),F(!1),He(null),e.type.startsWith(`image/`)&&!/\.hei[cf]$/i.test(e.name)?ge(URL.createObjectURL(e)):ge(null),kt(e)}},[e,t,d,k,Dt]),jt=async e=>{try{let t=await(await fetch(e.dataUrl)).blob(),n=new File([t],e.fileName||`queued_invoice.jpg`,{type:e.mimeType||`image/jpeg`});tt(e.id),st($e()),M(n),ge(e.dataUrl),await kt(n)}catch(e){yt(`تعذر استعادة الفاتورة المؤجلة: `+(e?.message||``))}},Mt=()=>{let e=k.map((e,t)=>t===oe?{...e,pharmacyId:d,pharmacyName:p,pharmacyArea:h,invoiceNumber:v,invoiceDate:b,items:O,notes:S,imageUrl:T,needsReview:Ce,needsReviewReason:Te||void 0}:e).map((e,n)=>({id:e.id||`inv-${n}`,file_name:e.file?.name,image_url:e.imageUrl||e.previewUrl,invoice_number:e.invoiceNumber,invoice_date:e.invoiceDate,pharmacy_id:e.pharmacyId,pharmacy_name:e.pharmacyName,pharmacy_area:e.pharmacyArea||``,confidence:e.confidence?e.confidence/100:.8,ocr_engine:e.ocrEngine,needs_review:e.needsReview,needs_review_reason:e.needsReviewReason,items:(e.items||[]).map((e,n)=>{let r=bt(e),i=t.find(t=>t.id===e.product_id),a=e.custom_price===void 0?Number(i?.base_price||5e3):e.custom_price,o=e.manual_bonus===void 0?e.ocr_bonus===void 0?r.bonus:e.ocr_bonus:e.manual_bonus;return{id:e.id||`it-${n}`,product_id:e.product_id,product_name:e.custom_name||i?.name||`مستحضر دوائي`,dosage_form:e.dosage_form||Ti(e.custom_name||i?.name||``),quantity:e.sold_quantity||10,unit_price:a,bonus_quantity:o,line_total:(e.sold_quantity||10)*a,ocr_confidence:e.ocr_confidence}})}));pe(e),ue(!0)},Nt=async()=>{if(k.length!==0){j(!0),yt(null);try{let e=k.map((e,t)=>t===oe?{...e,pharmacyId:d,pharmacyName:p,pharmacyArea:h,invoiceNumber:v,invoiceDate:b,items:O,notes:S,imageUrl:T}:e);for(let t of e){let e=t.pharmacyName.replace(/^(صيدلية|صيدليه|مذخر|ص)\b/gi,``).trim();if(!t.pharmacyId&&e.length<2){yt(`يرجى تحديد أو كتابة اسم صيدلية صحيح ومميز للفاتورة (${t.invoiceNumber||t.file?.name||`بدون رقم`})`),j(!1);return}}let t=e.map(e=>{let t=e.pharmacyName.trim();return{pharmacy_id:l.find(e=>e.name.trim().toLowerCase()===t.toLowerCase())?.id||void 0,pharmacy_name:t||void 0,pharmacy_area:e.pharmacyArea?.trim()||void 0,invoice_number:e.invoiceNumber.trim(),invoice_date:e.invoiceDate,image_url:e.imageUrl||void 0,notes:e.notes?.trim()||void 0,items:e.items.map(e=>{let t=bt(e);return{product_id:e.product_id,sold_quantity:e.sold_quantity,custom_product_name:e.custom_name?.trim()||void 0,dosage_form:e.dosage_form||Ti(e.custom_name||``),custom_unit_price:e.custom_price===void 0?void 0:e.custom_price,custom_bonus:e.manual_bonus===void 0?e.ocr_bonus===void 0?t.bonus:e.ocr_bonus:e.manual_bonus,bonus_quantity:t.bonus,ocr_confidence:e.ocr_confidence}})}}),n=await G.createInvoicesBatch(t);n.invoices&&n.invoices.length>0&&i(n.invoices[0])}catch(e){yt(e.message||`فشل حفظ دفعة الفواتير ومزامنتها`)}finally{j(!1)}}};return le&&de.length>0?(0,q.jsx)(Di,{invoices:de,products:t,pharmacies:l,fixedBonusEnabled:D,existingInvoices:n,onCancel:()=>ue(!1),onSaveAll:async e=>{let n=e.map(e=>{let n=(e.pharmacy_name||``).trim();return{pharmacy_id:l.find(e=>e.name.trim().toLowerCase()===n.toLowerCase())?.id||void 0,pharmacy_name:n||void 0,pharmacy_area:e.pharmacy_area?.trim()||void 0,invoice_number:e.invoice_number?.trim(),invoice_date:e.invoice_date,image_url:e.image_url||void 0,items:e.items.map(e=>({product_id:e.product_id||t[0]?.id||``,sold_quantity:e.quantity,custom_product_name:e.product_name,dosage_form:e.dosage_form||Ti(e.product_name||``),custom_unit_price:e.unit_price,bonus_quantity:e.bonus_quantity,custom_bonus:e.bonus_quantity,ocr_confidence:e.ocr_confidence}))}}),r=await G.createInvoicesBatch(n);r.invoices&&r.invoices.length>0&&i(r.invoices[0])}}):(0,q.jsxs)(`div`,{className:`animate-in add-invoice-mobile-page`,children:[(0,q.jsxs)(`div`,{className:`page-header`,style:{marginBottom:`1rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.45rem`,marginBottom:`0.35rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`span`,{className:`badge badge-primary`,style:{fontSize:`0.74rem`},children:[(0,q.jsx)(Un,{size:12}),` سحابي + محلي متصل`]}),(0,q.jsxs)(`span`,{className:`badge badge-success`,style:{fontSize:`0.74rem`},children:[(0,q.jsx)(qr,{size:12}),` معالجة الفواتير الذكية`]})]}),(0,q.jsxs)(`h1`,{className:`page-title`,style:{display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,q.jsx)($n,{size:24,style:{color:`var(--primary)`}}),`إضافة فاتورة جديدة`]})]}),(0,q.jsxs)(`button`,{type:`button`,className:`btn-clay btn-secondary btn-sm`,onClick:a,children:[(0,q.jsx)(ln,{size:15}),` العودة للسجل`]})]}),(0,q.jsx)(`div`,{className:`card mb-3`,style:{padding:`0.75rem 1rem`},children:(0,q.jsxs)(`div`,{className:`tab-pills`,style:{margin:0},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>{s(`ocr`),yt(null)},className:`tab-pill ${o===`ocr`?`active`:``}`,style:{fontWeight:800},children:[(0,q.jsx)(_n,{size:16,style:{color:o===`ocr`?`var(--primary)`:`var(--gray-500)`,flexShrink:0}}),(0,q.jsx)(`span`,{children:`📷 صورة / كاميرا أو PDF`})]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>{s(`manual`),yt(null)},className:`tab-pill ${o===`manual`?`active`:``}`,style:{fontWeight:800},children:[(0,q.jsx)(kr,{size:16,style:{flexShrink:0}}),(0,q.jsx)(`span`,{children:`✍️ إدخال يدوي مباشر`})]})]})}),!ct&&(0,q.jsxs)(`div`,{className:`alert-danger mb-3`,style:{background:`#fff7ed`,borderColor:`#fdba74`,color:`#9a3412`},children:[(0,q.jsx)(pi,{size:18}),(0,q.jsx)(`span`,{style:{fontWeight:700,fontSize:`0.84rem`},children:`أنت غير متصل بالإنترنت حالياً — يمكنك التقاط الصور وسنحفظها محلياً لإكمال التحليل عند عودة الشبكة.`})]}),ot.length>0&&ct&&(0,q.jsxs)(`div`,{className:`alert-info mb-3`,style:{display:`flex`,flexDirection:`column`,gap:`0.5rem`},children:[(0,q.jsx)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`0.5rem`},children:(0,q.jsxs)(`span`,{style:{fontWeight:800,fontSize:`0.84rem`},children:[`⏳ يوجد `,ot.length,` فواتير محفوظة من انقطاع الشبكة السابق بانتظار التحليل:`]})}),(0,q.jsx)(`div`,{style:{display:`flex`,gap:`0.45rem`,flexWrap:`wrap`},children:ot.map(e=>(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.35rem`,alignItems:`center`,background:`#ffffff`,padding:`0.3rem 0.6rem`,borderRadius:8,border:`1px solid #bfdbfe`},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.76rem`,fontWeight:700},children:e.fileName}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>jt(e),className:`btn-clay btn-primary btn-sm`,style:{padding:`0.2rem 0.55rem`,fontSize:`0.72rem`},children:`تحليل الآن`}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>{tt(e.id),st($e())},style:{background:`none`,border:`none`,color:`#ef4444`,cursor:`pointer`,padding:2},title:`حذف من الطابور`,children:(0,q.jsx)(hi,{size:13})})]},e.id))})]}),_t&&(0,q.jsxs)(`div`,{className:`alert-danger mb-4`,children:[(0,q.jsx)(Dn,{size:20,style:{flexShrink:0}}),(0,q.jsx)(`span`,{style:{fontWeight:600},children:_t}),(0,q.jsx)(`button`,{style:{marginRight:`auto`,background:`none`,border:`none`,cursor:`pointer`,color:`inherit`},onClick:()=>yt(null),children:(0,q.jsx)(hi,{size:16})})]}),k.length>0&&(0,q.jsxs)(`div`,{className:`card mb-4`,style:{padding:`1rem`,background:`#f8fafc`,border:`1px solid #bfdbfe`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`0.75rem`,flexWrap:`wrap`,gap:`0.5rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,q.jsx)(pr,{size:20,style:{color:`var(--primary)`}}),(0,q.jsxs)(`h5`,{style:{margin:0,fontWeight:800,color:`var(--gray-900)`},children:[`دفعة الفواتير المرفوعة (`,k.length,` صور فواتير)`]}),(0,q.jsxs)(`span`,{className:`badge badge-primary`,children:[`الفاتورة المعروضة: #`,oe+1]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.5rem`,alignItems:`center`,flexWrap:`wrap`},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:Mt,className:`btn-clay btn-primary btn-sm`,style:{background:`#059669`,borderColor:`#047857`,color:`white`,fontWeight:800,fontSize:`0.78rem`,display:`flex`,alignItems:`center`,gap:5},title:`عرض جميع الفواتير في جدول موحد وتعديل أي خلية مباشرة`,children:[(0,q.jsx)(Zn,{size:14}),` جدول تدقيق وتعديل جميع الفواتير (`,k.length,`) 🔍`]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>dt.current?.click(),className:`btn-clay btn-secondary btn-sm`,style:{fontSize:`0.78rem`,display:`flex`,alignItems:`center`,gap:4},children:[(0,q.jsx)(_n,{size:14}),` تصوير فاتورة أخرى`]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>ut.current?.click(),className:`btn-clay btn-secondary btn-sm`,style:{fontSize:`0.78rem`,display:`flex`,alignItems:`center`,gap:4},children:[(0,q.jsx)(Fr,{size:14}),` إضافة من المعرض`]}),k.length>1&&(0,q.jsxs)(`button`,{type:`button`,onClick:Nt,disabled:ce||P,className:`btn-clay btn-primary btn-sm`,style:{fontWeight:800,fontSize:`0.78rem`,display:`flex`,alignItems:`center`,gap:4},children:[(0,q.jsx)(qr,{size:14}),ce?`جارِ حفظ الدفعة...`:`حفظ ومزامنة كل الفواتير (${k.length}) 🚀`]})]})]}),(0,q.jsx)(`div`,{style:{display:`flex`,gap:`0.75rem`,overflowX:`auto`,paddingBottom:`0.5rem`},children:k.map((e,t)=>{let n=t===oe;return(0,q.jsxs)(`div`,{onClick:()=>pt(t),style:{minWidth:175,maxWidth:210,padding:`0.65rem 0.85rem`,borderRadius:12,cursor:`pointer`,background:n?`#eff6ff`:`#ffffff`,border:n?`2px solid var(--primary)`:`1px solid var(--gray-200)`,boxShadow:n?`0 4px 12px rgba(37, 99, 235, 0.15)`:`none`,display:`flex`,flexDirection:`column`,gap:`0.35rem`,transition:`all 0.15s ease`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,q.jsxs)(`span`,{style:{fontSize:`0.72rem`,fontWeight:800,color:n?`var(--primary)`:`var(--gray-600)`},children:[`فاتورة #`,t+1]}),(0,q.jsx)(`button`,{type:`button`,onClick:e=>{e.stopPropagation(),mt(t)},style:{background:`none`,border:`none`,color:`var(--danger)`,cursor:`pointer`,padding:0},title:`حذف هذه الفاتورة من الدفعة`,children:(0,q.jsx)($r,{size:13})})]}),(0,q.jsx)(`div`,{style:{fontSize:`0.78rem`,fontWeight:700,color:`var(--gray-800)`,whiteSpace:`nowrap`,overflow:`hidden`,textOverflow:`ellipsis`},children:e.pharmacyName||(e.status===`error`?`فشل القراءة`:`صيدلية قيد القراءة...`)}),(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,fontSize:`0.68rem`,color:`var(--gray-500)`},children:[(0,q.jsx)(`span`,{children:e.invoiceNumber||`—`}),(0,q.jsx)(`span`,{children:e.status===`scanning`?(0,q.jsx)(_r,{size:12,className:`animate-spin`,style:{color:`var(--primary)`}}):e.status===`done`?(0,q.jsx)(yn,{size:13,style:{color:`#059669`,fontWeight:900}}):(0,q.jsx)(Dn,{size:12,style:{color:`var(--danger)`}})})]})]},e.id)})})]}),(0,q.jsx)(`form`,{onSubmit:async e=>{if(e.preventDefault(),yt(null),!d&&!p.trim()){yt(`يرجى اختيار أو كتابة اسم الصيدلية أولاً`);return}let t=p.replace(/^(صيدلية|صيدليه|مذخر|ص)\b/gi,``).trim();if(!d&&t.length<2)yt(`يرجى كتابة الاسم الكامل والمميز للصيدلية (مثلاً: صيدلية النور النموذجية أو صيدلية السلام / المنصور)`);else if(!v.trim())yt(`يرجى إدخال رقم الفاتورة`);else if(O.length===0)yt(`لا توجد أصناف في الفاتورة — اضغط "+ إضافة صنف آخر" لإضافة صنف واحد على الأقل.`);else if(O.some(e=>!e.product_id||e.sold_quantity<1))yt(`يرجى التحقق من بنود الفاتورة — كل صنف يحتاج منتجاً وكمية صحيحة`);else if(!ae||window.confirm(`⚠️ تنبيه: فاتورة مكررة!\n\nيوجد فاتورة مسجلة مسبقاً لنفس الصيدلية (${ae.pharmacy_name||`الصيدلية`}) بتاريخ (${(ae.invoice_date||``).split(`T`)[0]}) وبنفس كامل الأصناف والكميات.\n\nهل تريد الحفظ رغم ذلك؟`)){gt(!0);try{let e=p.trim(),t={pharmacy_id:l.find(t=>t.name.trim().toLowerCase()===e.toLowerCase())?.id||void 0,pharmacy_name:e||void 0,pharmacy_area:h.trim()||void 0,invoice_number:v.trim(),invoice_date:b,image_url:T||void 0,notes:S.trim()||void 0,force_save:!!ae,items:O.map(e=>{let t=bt(e);return{product_id:e.product_id,sold_quantity:e.sold_quantity,custom_product_name:e.custom_name?.trim()||void 0,dosage_form:e.dosage_form||Ti(e.custom_name||``),custom_unit_price:e.custom_price===void 0?void 0:e.custom_price,custom_bonus:e.manual_bonus===void 0?e.ocr_bonus===void 0?t.bonus:e.ocr_bonus:e.manual_bonus,bonus_quantity:t.bonus,ocr_confidence:e.ocr_confidence}})};i(await G.createInvoice(t))}catch(e){yt(e.message||`فشل في حفظ الفاتورة في قاعدة بيانات سوبا بيس.`)}finally{gt(!1)}}},children:(0,q.jsxs)(`div`,{className:`add-invoice-grid ${o===`ocr`?`two-col`:`single-col`}`,children:[o===`ocr`&&(0,q.jsxs)(`div`,{className:`card`,style:{display:`flex`,flexDirection:`column`,gap:`1rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`0.5rem`},children:[(0,q.jsxs)(`h5`,{style:{fontWeight:800,margin:0,display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,q.jsx)(_n,{size:20,style:{color:`var(--primary)`}}),`صورة الفاتورة أو ملف PDF`]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>We(e=>!e),className:`btn-clay btn-secondary btn-sm`,style:{fontSize:`0.74rem`,padding:`0.32rem 0.7rem`},title:`إعدادات مفتاح Google Gemini للقراءة الآلية`,children:[(0,q.jsx)(Ur,{size:13}),` إعدادات Gemini`]})]}),(()=>{let e=!nt(),t=!!qe.trim();if(e)return(0,q.jsxs)(`div`,{style:{background:`#ecfdf5`,border:`1px solid #a7f3d0`,borderRadius:10,padding:`0.55rem 0.75rem`,fontSize:`0.78rem`,color:`#065f46`,display:`flex`,alignItems:`center`,gap:`0.45rem`,fontWeight:700},children:[(0,q.jsx)(Gr,{size:16,style:{color:`#059669`,flexShrink:0}}),(0,q.jsx)(`span`,{children:`متصل بالخادم الخلفي لقراءة الفواتير بالذكاء الاصطناعي.`})]});if(t){let e=vt(qe);return(0,q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.4rem`},children:[(0,q.jsxs)(`div`,{style:{background:`#ecfdf5`,border:`1px solid #a7f3d0`,borderRadius:10,padding:`0.55rem 0.75rem`,fontSize:`0.78rem`,color:`#065f46`,display:`flex`,alignItems:`center`,justifyContent:`space-between`,gap:`0.5rem`,flexWrap:`wrap`,fontWeight:700},children:[(0,q.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`0.4rem`},children:[(0,q.jsx)(qr,{size:15,style:{color:`#059669`,flexShrink:0}}),`القراءة الذكية عبر Google Gemini Vision AI مفعّلة على هاتفك`]}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>We(e=>!e),style:{background:`none`,border:`none`,color:`#047857`,fontWeight:800,cursor:`pointer`,fontSize:`0.74rem`,textDecoration:`underline`,padding:0},children:`تعديل المفتاح`})]}),e.open&&(0,q.jsxs)(`div`,{style:{background:`#fffbeb`,border:`1px solid #fde68a`,borderRadius:9,padding:`0.45rem 0.75rem`,fontSize:`0.74rem`,color:`#92400e`,fontWeight:700},children:[`⏸️ قاطع الدائرة مفعّل (`,Math.max(1,Math.ceil(e.remainingMs/6e4)),` دقيقة متبقية بعد خطأ `,e.statusCode||`403/429`,`) — أدخل مفتاح Gemini جديداً أو أكمل البيانات يدوياً.`]})]})}return(0,q.jsxs)(`div`,{style:{background:`#fffbeb`,border:`1.5px solid #fcd34d`,borderRadius:12,padding:`0.75rem 0.85rem`,fontSize:`0.8rem`,color:`#92400e`,display:`flex`,flexDirection:`column`,gap:`0.45rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,gap:`0.5rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`strong`,{style:{display:`flex`,alignItems:`center`,gap:`0.4rem`},children:[(0,q.jsx)(ri,{size:16,style:{color:`#d97706`,flexShrink:0}}),`مفتاح Google Gemini غير مُعد بعد (إدخال يدوي حالياً)`]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>We(!0),className:`btn-clay btn-primary btn-sm`,style:{background:`#d97706`,borderColor:`#b45309`,fontSize:`0.74rem`,padding:`0.28rem 0.65rem`},children:[(0,q.jsx)(dr,{size:13}),` إضافة مفتاح Gemini`]})]}),(0,q.jsx)(`div`,{style:{fontSize:`0.75rem`,lineHeight:1.45,color:`#78350f`},children:`تعمل القراءة الآلية للفواتير عبر Google Gemini Vision فقط — أضف مفتاح Gemini API في الإعدادات.`})]})})(),Ue&&(0,q.jsxs)(`div`,{style:{background:`#f8fafc`,border:`1.5px solid #cbd5e1`,borderRadius:12,padding:`0.9rem`,display:`flex`,flexDirection:`column`,gap:`0.75rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`0.4rem`},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.8rem`,fontWeight:800,color:`#0f172a`},children:`🔑 مفتاح Google Gemini API (يتحدث تلقائياً من الشيت الرئيسي):`}),(0,q.jsxs)(`a`,{href:`https://aistudio.google.com/apikey`,target:`_blank`,rel:`noopener noreferrer`,style:{fontSize:`0.72rem`,fontWeight:800,background:`#fffbeb`,color:`#b45309`,border:`1px solid #fde68a`,padding:`0.25rem 0.55rem`,borderRadius:8,display:`inline-flex`,alignItems:`center`,gap:3,textDecoration:`none`},children:[`🟡 الحصول على مفتاح من Google AI Studio `,(0,q.jsx)(qn,{size:11})]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.4rem`,flexWrap:`wrap`},children:[(0,q.jsx)(`input`,{type:Ye?`text`:`password`,className:`clay-input`,style:{flex:`1 1 180px`,padding:`0.48rem 0.65rem`,fontSize:`0.85rem`,direction:`ltr`,textAlign:`left`},placeholder:`AIzaSy... / AQ...`,value:qe,onChange:e=>{Je(e.target.value),ze(e.target.value),et(null)}}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>Xe(e=>!e),className:`btn-clay btn-secondary btn-sm`,style:{fontSize:`0.75rem`},children:Ye?`إخفاء`:`إظهار`}),(0,q.jsx)(`button`,{type:`button`,disabled:Ze||!qe.trim(),onClick:async()=>{z(!0);let e=await G.testGeminiKey(qe);if(e.valid&&H()?.role===`admin`)try{let t=await G.adminSetSharedGeminiKey(qe);et({valid:!0,message:`${e.message} — ${t.message}`})}catch{et(e)}else et(e);z(!1)},className:`btn-clay btn-primary btn-sm`,style:{fontSize:`0.76rem`,fontWeight:800},children:Ze?`جاري الاختبار...`:`اختبار وحفظ 🔍`}),qe&&(0,q.jsx)(`button`,{type:`button`,onClick:()=>{Je(``),ze(``),et(null)},className:`btn-clay btn-secondary btn-sm`,style:{fontSize:`0.74rem`,color:`#dc2626`},children:`مسح`})]}),Qe&&(0,q.jsx)(`div`,{className:Qe.valid?`alert-success`:`alert-danger`,style:{margin:0,padding:`0.55rem 0.75rem`,fontSize:`0.78rem`},children:Qe.message}),(0,q.jsxs)(`div`,{style:{borderTop:`1px solid #e2e8f0`,paddingTop:`0.55rem`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`0.5rem`},children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>Ke(e=>!e),style:{background:`none`,border:`none`,color:`#475569`,fontSize:`0.74rem`,fontWeight:700,cursor:`pointer`,padding:0},children:Ge?`▼ إخفاء خيارات الخادم المتقدمة`:`◀ خيارات الخادم الخلفي المتقدمة (اختياري)`}),(0,q.jsxs)(`button`,{type:`button`,onClick:ft,className:`btn-clay btn-secondary btn-sm`,style:{fontSize:`0.72rem`,padding:`0.25rem 0.55rem`},title:`عرض وحدة فحص الأخطاء والشبكة على شاشة الموبايل`,children:[(0,q.jsx)(Zr,{size:12}),` `,it?`Console مفعّل ✓`:`تشغيل فاحص الموبايل (Console)`]})]}),Ge&&(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.72rem`,fontWeight:700,color:`#475569`,display:`block`,marginBottom:3},children:`عنوان الخادم الخلفي (Backend API URL — للخوادم السحابية فقط):`}),(0,q.jsx)(`input`,{type:`url`,className:`clay-input`,style:{padding:`0.45rem 0.65rem`,fontSize:`0.82rem`,direction:`ltr`,textAlign:`left`},placeholder:`https://your-server.example.com/api/v1`,value:B,onChange:e=>{rt(e.target.value),Le(e.target.value)}})]})]}),(0,q.jsx)(`input`,{ref:dt,type:`file`,accept:`image/*`,capture:`environment`,onChange:e=>{At(e.target.files),e.target.value=``},style:{display:`none`}}),(0,q.jsx)(`input`,{ref:ut,type:`file`,multiple:!0,accept:`image/*,application/pdf`,onChange:e=>{At(e.target.files),e.target.value=``},style:{display:`none`}}),(0,q.jsxs)(`div`,{className:`upload-zone ${_e?`drag-over`:``}`,style:{position:`relative`,minHeight:260,cursor:`default`,border:me?`2px solid var(--primary)`:void 0,background:P?`#0f172a`:void 0},onDragOver:e=>{e.preventDefault(),N(!0)},onDragLeave:()=>N(!1),onDrop:e=>{e.preventDefault(),N(!1),At(e.dataTransfer.files)},children:[P&&(0,q.jsx)(`div`,{className:`ocr-laser-line`}),he?(0,q.jsxs)(`div`,{style:{position:`relative`,width:`100%`,textAlign:`center`},children:[(0,q.jsx)(`img`,{src:he,alt:`معاينة الفاتورة`,style:{maxHeight:270,maxWidth:`100%`,borderRadius:12,objectFit:`contain`,opacity:P?.5:1,border:`2px dashed var(--primary)`}}),P&&(0,q.jsxs)(`div`,{style:{position:`absolute`,inset:0,display:`flex`,flexDirection:`column`,alignItems:`center`,justifyContent:`center`,color:`#38bdf8`,background:`rgba(15, 23, 42, 0.8)`,borderRadius:12,padding:`1rem`},children:[(0,q.jsx)(_r,{size:34,className:`animate-spin`,style:{marginBottom:10}}),(0,q.jsx)(`div`,{style:{fontWeight:800,fontSize:`0.96rem`,color:`#ffffff`},children:ye?.message||`جاري قراءة بيانات الفاتورة...`}),ye&&(0,q.jsxs)(`div`,{style:{width:`80%`,maxWidth:260,marginTop:10},children:[(0,q.jsx)(`div`,{className:`progress-bar-bg`,style:{background:`rgba(255,255,255,0.2)`,height:7},children:(0,q.jsx)(`div`,{className:`progress-bar-fill`,style:{width:`${ye.percent}%`,background:`linear-gradient(90deg, #38bdf8, #10b981)`}})}),(0,q.jsxs)(`div`,{style:{fontSize:`0.72rem`,color:`#cbd5e1`,marginTop:4},children:[ye.percent,`%`]})]})]})]}):me?(0,q.jsxs)(`div`,{style:{textAlign:`center`,padding:`1.5rem`,color:P?`#ffffff`:`inherit`},children:[(0,q.jsx)(rr,{size:64,style:{color:`var(--danger)`,marginBottom:10}}),(0,q.jsx)(`p`,{style:{fontWeight:700,fontSize:`1rem`,margin:0},children:me.name}),(0,q.jsxs)(`p`,{style:{fontSize:`0.8rem`,color:`var(--gray-400)`,marginTop:4},children:[`(`,(me.size/1024).toFixed(1),` KB)`]}),P&&(0,q.jsxs)(`div`,{style:{marginTop:`1rem`,color:`#38bdf8`},children:[(0,q.jsx)(_r,{size:24,className:`animate-spin`,style:{display:`inline-block`,verticalAlign:`middle`,marginLeft:8}}),(0,q.jsx)(`span`,{style:{fontWeight:700},children:ye?.message||`جاري تجهيز وقراءة الملف...`})]})]}):(0,q.jsxs)(`div`,{style:{padding:`1.5rem 0.85rem`,textAlign:`center`},children:[(0,q.jsx)(`div`,{style:{width:56,height:56,borderRadius:`50%`,background:`rgba(37, 99, 235, 0.1)`,color:`var(--primary)`,display:`flex`,alignItems:`center`,justifyContent:`center`,margin:`0 auto 0.75rem`},children:(0,q.jsx)(ai,{size:26})}),(0,q.jsx)(`p`,{style:{fontWeight:800,color:`var(--gray-800)`,fontSize:`0.96rem`,marginBottom:4},children:`اختر طريقة رفع الفاتورة`}),(0,q.jsx)(`p`,{style:{fontSize:`0.78rem`,color:`var(--gray-500)`,maxWidth:340,margin:`0 auto 1rem`},children:`يتم ضغط الصور وتصحيح دورانها (EXIF/HEIC) تلقائياً على جهازك قبل القراءة`}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.6rem`,justifyContent:`center`,flexWrap:`wrap`},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>dt.current?.click(),className:`btn-clay btn-primary`,style:{display:`flex`,alignItems:`center`,gap:`0.45rem`,fontSize:`0.86rem`,fontWeight:800,padding:`0.65rem 1.05rem`,background:`#059669`,borderColor:`#047857`},children:[(0,q.jsx)(_n,{size:17}),` التقاط صورة بالكاميرا`]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>ut.current?.click(),className:`btn-clay btn-secondary`,style:{display:`flex`,alignItems:`center`,gap:`0.45rem`,fontSize:`0.86rem`,fontWeight:800,padding:`0.65rem 1.05rem`},children:[(0,q.jsx)(sr,{size:17,style:{color:`var(--primary)`}}),` من المعرض أو PDF`]})]})]})]}),me&&(0,q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.65rem`},children:[xe?Ce?(0,q.jsxs)(`div`,{style:{margin:0,padding:`0.8rem 1rem`,background:`#fffbeb`,border:`1.5px solid #f59e0b`,borderRadius:12,display:`flex`,alignItems:`flex-start`,gap:`0.65rem`},children:[(0,q.jsx)(ri,{size:22,style:{color:`#d97706`,flexShrink:0,marginTop:2}}),(0,q.jsxs)(`div`,{style:{flex:1},children:[(0,q.jsxs)(`div`,{style:{fontWeight:800,color:`#92400e`,display:`flex`,alignItems:`center`,gap:`0.45rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`span`,{children:[`⚠️ تحتاج مراجعة — `,I===`gemini-browser`?`تمت القراءة عبر Gemini (${Be}%)`:`نتيجة أولية (${Be}%)`]}),(0,q.jsx)(`span`,{className:`badge`,style:{background:`#f59e0b`,color:`#ffffff`,fontSize:`0.7rem`,padding:`2px 7px`},children:`تحتاج مراجعة`}),L&&(0,q.jsx)(`span`,{className:`badge`,style:{background:`#e0f2fe`,color:`#0369a1`,fontSize:`0.7rem`,padding:`2px 7px`},children:`⚡ Cache`})]}),(0,q.jsx)(`div`,{style:{fontSize:`0.8rem`,color:`#78350f`,marginTop:3,lineHeight:1.45},children:Te||Ve||`الدقة أقل مع الفواتير العربية بالمحرك الاحتياطي — راجع أسماء الأدوية والكميات والأسعار قبل الحفظ.`})]})]}):(0,q.jsxs)(`div`,{className:`alert-success`,style:{margin:0,padding:`0.75rem 1rem`},children:[(0,q.jsx)(jn,{size:22,style:{color:`var(--success)`,flexShrink:0}}),(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{fontWeight:800,color:`#065f46`,display:`flex`,alignItems:`center`,gap:`0.45rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`span`,{children:[`تمت قراءة البيانات بنجاح (`,Be,`%)`]}),L&&(0,q.jsx)(`span`,{className:`badge`,style:{background:`#e0f2fe`,color:`#0369a1`,fontSize:`0.7rem`,padding:`2px 7px`},children:`⚡ Cache`})]}),(0,q.jsx)(`div`,{style:{fontSize:`0.8rem`,color:`#047857`,marginTop:2},children:Ve||`تم تعبئة بيانات الصيدلية والأصناف تلقائياً في النموذج أدناه.`})]})]}):Pe?(0,q.jsxs)(`div`,{className:`alert-info`,style:{margin:0,padding:`0.75rem 1rem`},children:[(0,q.jsx)(jn,{size:20,style:{color:`var(--primary)`,flexShrink:0}}),(0,q.jsxs)(`div`,{style:{fontSize:`0.82rem`,lineHeight:1.45},children:[(0,q.jsx)(`strong`,{style:{display:`block`},children:`📸 تم إرفاق الفاتورة بنجاح!`}),Ve||`أكمل اسم الصيدلية والأصناف في النموذج أدناه ثم اضغط حفظ.`]})]}):null,Oe&&(0,q.jsxs)(`div`,{style:{background:`#fffbeb`,border:`1px solid #fde68a`,borderRadius:10,padding:`0.65rem 0.85rem`,fontSize:`0.78rem`,color:`#92400e`,lineHeight:1.45,display:`flex`,gap:`0.45rem`,alignItems:`flex-start`},children:[(0,q.jsx)(ri,{size:16,style:{color:`#d97706`,flexShrink:0,marginTop:2}}),(0,q.jsx)(`div`,{children:Oe})]}),Ae&&(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>Ne(e=>!e),style:{background:`none`,border:`none`,color:`var(--primary)`,fontSize:`0.76rem`,fontWeight:700,cursor:`pointer`,padding:0},children:Me?`▼ إخفاء النص الخام المستخرج`:`📄 عرض النص الخام المقروء من الفاتورة`}),Me&&(0,q.jsx)(`pre`,{dir:`auto`,style:{marginTop:`0.4rem`,background:`#0f172a`,color:`#e2e8f0`,padding:`0.65rem`,borderRadius:10,fontSize:`0.74rem`,maxHeight:160,overflowY:`auto`,whiteSpace:`pre-wrap`},children:Ae})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.45rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>me&&kt(me),disabled:P,className:`btn-clay btn-secondary flex-1`,children:[(0,q.jsx)(Lr,{size:15,className:P?`animate-spin`:``}),`إعادة القراءة`]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>dt.current?.click(),disabled:P,className:`btn-clay btn-secondary`,title:`التقاط صورة أخرى بالكاميرا`,children:[(0,q.jsx)(_n,{size:15}),` كاميرا`]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>ut.current?.click(),disabled:P,className:`btn-clay btn-secondary`,title:`اختيار ملف آخر من المعرض`,children:[(0,q.jsx)(sr,{size:15}),` معرض`]}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>{M(null),ge(null),F(!1),Fe(!1),we(!1),Ee(null),De(!1),He(null),ke(null),je(null),Se(null),m(``),f(``),y(Oi()),re([{id:`item-1`,product_id:t[0]?.id||``,sold_quantity:10}])},className:`btn-clay btn-secondary`,title:`إزالة الملف`,children:(0,q.jsx)(hi,{size:16})})]})]})]}),(0,q.jsxs)(`div`,{className:`card`,style:{display:`flex`,flexDirection:`column`,gap:`1.25rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`0.5rem`},children:[(0,q.jsxs)(`h5`,{style:{fontWeight:800,margin:0,display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,q.jsx)(pn,{size:20,style:{color:`var(--success)`}}),`تفاصيل الفاتورة والبنود`]}),(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.4rem`,flexWrap:`wrap`},children:[L&&(0,q.jsx)(`span`,{className:`badge`,style:{background:`#e0f2fe`,color:`#0369a1`,fontSize:`0.73rem`},children:`⚡ من الذاكرة المؤقتة`}),xe&&Ce?(0,q.jsxs)(`span`,{className:`badge`,style:{background:`#fef3c7`,color:`#92400e`,border:`1px solid #f59e0b`,fontSize:`0.75rem`,fontWeight:800},children:[(0,q.jsx)(ri,{size:13}),` تحتاج مراجعة يدوية`]}):xe?(0,q.jsxs)(`span`,{className:`badge badge-success`,style:{fontSize:`0.75rem`},children:[(0,q.jsx)(yn,{size:13}),` تمت القراءة آلياً`]}):null]})]}),(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(min(100%, 240px), 1fr))`,gap:`1rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`الصيدلية المستهدفة *`}),(0,q.jsxs)(`div`,{style:{position:`relative`},children:[(0,q.jsx)(`input`,{type:`text`,list:`pharmacies-datalist`,className:`clay-input`,placeholder:`اسم الصيدلية (يتم التعرف عليه آلياً أو اكتبه هنا)...`,value:p,onChange:e=>{let t=e.target.value;m(t);let n=l.find(e=>e.name.trim()===t.trim()),r=n?n.area:ie(t);f(n?n.id:``),r&&!h.trim()&&g(r)},required:!0,style:{width:`100%`,fontWeight:700}}),(0,q.jsx)(`datalist`,{id:`pharmacies-datalist`,children:l.map(e=>(0,q.jsx)(`option`,{value:e.name,children:e.city?`(${e.city})`:``},e.id))})]}),p&&(0,q.jsxs)(`div`,{style:{fontSize:`0.73rem`,color:`#059669`,marginTop:`0.25rem`,fontWeight:700,display:`flex`,alignItems:`center`,gap:`0.25rem`},children:[(0,q.jsx)(yn,{size:12}),` الصيدلية المحددة: `,p]})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`المنطقة / المكان`}),(0,q.jsx)(`input`,{type:`text`,list:`baghdad-areas-datalist`,className:`clay-input`,placeholder:`مثال: الزعفرانية، مدينة الصدر، الكرادة...`,value:h,onChange:e=>g(e.target.value),style:{width:`100%`}}),(0,q.jsx)(`datalist`,{id:`baghdad-areas-datalist`,children:wi.map(e=>(0,q.jsx)(`option`,{value:e},e))})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`رقم الفاتورة *`}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.4rem`},children:[(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,value:v,onChange:e=>y(e.target.value),required:!0}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>y(Oi()),className:`btn-clay btn-secondary btn-sm`,title:`توليد رقم جديد`,children:(0,q.jsx)(Lr,{size:14})})]}),ae&&(0,q.jsxs)(`div`,{style:{marginTop:`0.45rem`,background:`#fef2f2`,border:`1.5px solid #f87171`,borderRadius:10,padding:`0.5rem 0.75rem`,display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,q.jsx)(Dn,{size:18,style:{color:`#dc2626`,flexShrink:0}}),(0,q.jsxs)(`div`,{style:{fontSize:`0.78rem`,color:`#991b1b`,lineHeight:1.35},children:[(0,q.jsx)(`strong`,{children:`⚠️ فاتورة مكررة:`}),` يوجد فاتورة لنفس الصيدلية `,(0,q.jsx)(`strong`,{children:ae.pharmacy_name||`الصيدلية`}),` بتاريخ `,(ae.invoice_date||``).split(`T`)[0],` بنفس الأصناف والكميات!`]})]})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`تاريخ الفاتورة *`}),(0,q.jsx)(`input`,{type:`date`,className:`clay-input`,value:b,onChange:e=>x(e.target.value),required:!0})]})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`0.5rem`,background:D?`#ecfdf5`:`#f8fafc`,border:D?`1.5px solid #6ee7b7`:`1px solid var(--gray-200)`,borderRadius:12,padding:`0.6rem 0.85rem`,marginBottom:`0.75rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.6rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:`0.45rem`,cursor:`pointer`,margin:0,fontWeight:800,fontSize:`0.84rem`,color:D?`#047857`:`var(--gray-700)`},children:[(0,q.jsx)(`input`,{type:`checkbox`,checked:D,onChange:e=>{let t=e.target.checked;ne(t),t&&re(e=>e.map(e=>({...e,manual_bonus:void 0,ocr_bonus:Math.floor((Number(e.sold_quantity)||0)/10)})))},style:{width:17,height:17,accentColor:`#10b981`,cursor:`pointer`}}),(0,q.jsx)(`span`,{children:`🎁 البونص الثابت (كل 10 قطع = قطعة واحدة مجانية 10+1)`})]}),(0,q.jsx)(`span`,{className:`badge ${D?`badge-success`:`badge-gray`}`,style:{fontSize:`0.7rem`,padding:`3px 8px`},children:D?`✓ مطبّق تلقائياً (10 + 1)`:`معطل (حسب قراءة الفاتورة)`})]}),(0,q.jsx)(`div`,{style:{display:`flex`,gap:`0.4rem`,alignItems:`center`},children:(0,q.jsx)(`button`,{type:`button`,onClick:()=>{ne(!0),re(e=>e.map(e=>({...e,manual_bonus:void 0,ocr_bonus:Math.floor((Number(e.sold_quantity)||0)/10)})))},className:`btn-clay btn-secondary btn-sm`,style:{fontSize:`0.74rem`,padding:`0.25rem 0.6rem`,color:`#047857`,fontWeight:800},title:`إعادة احتساب وتطبيق قاعدة 10+1 على كافة البنود`,children:`⚡ تطبيق 10+1 على جميع البنود`})})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`0.65rem`},children:[(0,q.jsx)(`span`,{style:{fontWeight:800,fontSize:`0.9rem`,color:`var(--gray-800)`},children:`الأصناف والكميات المحسوبة:`}),(0,q.jsxs)(`button`,{type:`button`,onClick:wt,className:`btn-clay btn-secondary btn-sm`,children:[(0,q.jsx)(Fr,{size:14}),` إضافة صنف آخر`]})]}),(0,q.jsx)(`div`,{className:`invoice-items-scroll`,children:(0,q.jsxs)(`div`,{className:`invoice-items-container`,children:[O.map((e,n)=>{let{prod:r,unitPrice:i,bonus:a,lineTotal:o,displayName:s}=bt(e);return(0,q.jsxs)(`div`,{className:`invoice-item-row`,children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`span`,{style:{fontSize:`0.68rem`,color:`var(--gray-400)`,display:`block`},children:`المنتج`}),e.custom_name?(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,style:{padding:`0.4rem 0.6rem`,fontSize:`0.82rem`,fontWeight:700},value:e.custom_name,onChange:t=>Et(e.id,`custom_name`,t.target.value),title:`اسم المنتج المقروء من الفاتورة — يمكن تعديله`}):(0,q.jsxs)(`select`,{className:`clay-input`,style:{padding:`0.4rem 0.6rem`,fontSize:`0.85rem`},value:e.product_id,onChange:t=>Et(e.id,`product_id`,t.target.value),required:!0,children:[(0,q.jsx)(`option`,{value:``,children:`-- اختر المنتج --`}),t.map(e=>(0,q.jsxs)(`option`,{value:e.id,children:[e.name,` (`,e.base_price,` د.ع)`]},e.id))]})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`span`,{style:{fontSize:`0.68rem`,color:`var(--gray-400)`,display:`block`},children:`نوع المادة`}),(0,q.jsxs)(`select`,{className:`clay-input`,style:{padding:`0.35rem 0.4rem`,fontSize:`0.78rem`,fontWeight:700},value:e.dosage_form||Ti(e.custom_name||``),onChange:t=>Et(e.id,`dosage_form`,t.target.value),children:[(0,q.jsx)(`option`,{value:`قطرة`,children:`قطرة`}),(0,q.jsx)(`option`,{value:`كريم`,children:`كريم`}),(0,q.jsx)(`option`,{value:`مرهم`,children:`مرهم`}),(0,q.jsx)(`option`,{value:`حبوب`,children:`حبوب`})]})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`span`,{style:{fontSize:`0.68rem`,color:`var(--gray-400)`,display:`block`},children:`الكمية`}),(0,q.jsx)(`input`,{type:`number`,min:1,className:`clay-input`,style:{padding:`0.4rem`,textAlign:`center`,fontSize:`0.85rem`},value:e.sold_quantity,onChange:t=>Et(e.id,`sold_quantity`,Math.max(1,parseInt(t.target.value)||1))})]}),(0,q.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.68rem`,color:`var(--gray-400)`,display:`block`},children:`السعر`}),e.custom_price===void 0?(0,q.jsxs)(`span`,{style:{fontWeight:700,fontSize:`0.85rem`,color:`var(--gray-700)`},children:[i.toLocaleString(),` د.ع`]}):(0,q.jsx)(`input`,{type:`number`,min:0,className:`clay-input`,style:{padding:`0.4rem`,textAlign:`center`,fontSize:`0.82rem`,width:`100%`},value:e.custom_price,onChange:t=>Et(e.id,`custom_price`,parseFloat(t.target.value)||0),title:`السعر المقروء من الفاتورة`})]}),(0,q.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,q.jsxs)(`span`,{style:{fontSize:`0.68rem`,color:`var(--gray-400)`,display:`block`},children:[`البونص`,e.manual_bonus===void 0&&(0,q.jsx)(`span`,{style:{fontSize:`0.6rem`,color:D?`#15803d`:`var(--primary)`,display:`block`,fontWeight:700},children:D?`(10+1 ثابت)`:`تلقائي`})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:3},children:[(0,q.jsx)(`span`,{style:{color:a>0?`var(--warning)`:`var(--gray-400)`,fontWeight:800,fontSize:`0.85rem`},children:`+`}),(0,q.jsx)(`input`,{type:`number`,min:0,className:`clay-input`,style:{padding:`0.35rem 0.4rem`,textAlign:`center`,fontSize:`0.85rem`,width:`100%`,fontWeight:800,color:a>0?`var(--warning)`:`var(--gray-600)`,border:e.manual_bonus===void 0?void 0:`2px solid var(--warning)`},value:a,title:e.manual_bonus===void 0?D?`بونص ثابت: كل 10 قطع = 1 مجاناً`:`بونص مستخرج من الفاتورة`:`بونص مُعدّل يدوياً`,onChange:t=>{let n=Math.max(0,parseInt(t.target.value)||0);Et(e.id,`manual_bonus`,n)}})]}),e.manual_bonus!==void 0&&(0,q.jsx)(`button`,{type:`button`,style:{background:`none`,border:`none`,cursor:`pointer`,fontSize:`0.65rem`,color:`#15803d`,padding:0,marginTop:2,fontWeight:700},title:`إعادة لقاعدة البونص الثابت (10+1)`,onClick:()=>Et(e.id,`manual_bonus`,void 0),children:`↺ 10+1 ثابت`})]}),(0,q.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.68rem`,color:`var(--gray-400)`,display:`block`},children:`المجموع`}),(0,q.jsxs)(`span`,{style:{fontWeight:800,fontSize:`0.9rem`,color:`var(--primary)`},children:[o.toLocaleString(),` د.ع`]})]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>Tt(e.id),style:{background:`#fee2e2`,border:`1px solid #fca5a5`,borderRadius:8,color:`#dc2626`,cursor:`pointer`,display:`flex`,alignItems:`center`,justifyContent:`center`,gap:4,padding:`0.35rem 0.55rem`,fontWeight:800,touchAction:`manipulation`},title:`حذف الصنف`,children:[(0,q.jsx)($r,{size:16}),(0,q.jsx)(`span`,{className:`mobile-only-inline`,style:{fontSize:`0.78rem`},children:`حذف الصنف`})]})]},e.id)}),O.length===0&&(0,q.jsx)(`div`,{style:{textAlign:`center`,padding:`1.1rem`,background:`#fffbeb`,border:`1px dashed #f59e0b`,borderRadius:12,color:`#92400e`,fontSize:`0.84rem`,fontWeight:700},children:`لا توجد أصناف حالياً — اضغط زر "+ إضافة صنف آخر" بالأعلى لإضافة صنف.`})]})})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:700,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`ملاحظات الفاتورة (اختياري)`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,placeholder:`مثال: تم الاتفاق على السداد خلال 30 يوم`,value:S,onChange:e=>C(e.target.value)})]}),(0,q.jsxs)(`div`,{style:{background:`linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)`,border:`1px solid #bfdbfe`,borderRadius:14,padding:`1rem 1.25rem`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`1rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.8rem`,color:`var(--gray-500)`,fontWeight:600},children:`إجمالي الفاتورة الصافي:`}),(0,q.jsxs)(`div`,{style:{fontSize:`1.6rem`,fontWeight:900,color:`var(--primary)`},children:[xt.toLocaleString(),` `,(0,q.jsx)(`span`,{style:{fontSize:`0.9rem`,fontWeight:600},children:`دينار عراقي`})]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`1.25rem`,textAlign:`center`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.72rem`,color:`var(--gray-400)`},children:`إجمالي القطع`}),(0,q.jsxs)(`div`,{style:{fontWeight:800,fontSize:`1.1rem`,color:`var(--gray-800)`},children:[St,` قطعة`]})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.72rem`,color:`var(--warning)`},children:`إجمالي البونص`}),(0,q.jsxs)(`div`,{style:{fontWeight:800,fontSize:`1.1rem`,color:`var(--warning)`},children:[`+`,Ct,` مجانية`]})]})]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.75rem`,marginTop:`0.5rem`},children:[k.length>1&&(0,q.jsx)(`button`,{type:`button`,onClick:Nt,disabled:ce||P,className:`btn-clay btn-primary`,style:{padding:`0.95rem 1.5rem`,fontSize:`1.05rem`,fontWeight:900,background:`linear-gradient(135deg, #10b981 0%, #059669 100%)`,boxShadow:`0 4px 15px rgba(16, 185, 129, 0.35)`},children:ce?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(_r,{size:20,className:`animate-spin`}),` جارِ حفظ ومزامنة جميع الفواتير في كوكل شيت...`]}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(qr,{size:20}),` حفظ ومزامنة جميع الفواتير دفعة واحدة (`,k.length,` فواتير) في كوكل شيت 🚀`]})}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.75rem`,flexWrap:`wrap`},children:[(0,q.jsx)(`button`,{type:`submit`,disabled:ht||P||ce,className:`btn-clay btn-primary flex-1`,style:{padding:`0.875rem 1.25rem`,fontSize:`0.96rem`,fontWeight:800,minWidth:`min(100%, 200px)`},children:ht?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(_r,{size:18,className:`animate-spin`}),` جاري حفظ الفاتورة...`]}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(jn,{size:20}),` `,k.length>1?`حفظ هذه الفاتورة الحالية فقط`:`حفظ الفاتورة ومزامنتها`]})}),(0,q.jsx)(`button`,{type:`button`,onClick:a,className:`btn-clay btn-secondary`,style:{padding:`0.875rem 1.25rem`},children:`إلغاء`})]})]})]})]})})]})},Ai=({pharmacies:e,invoices:t,onStartInvoiceForPharmacy:n,onScheduleVisit:r})=>{let[i,a]=(0,_.useState)(e[0]?.id||``),[o,s]=(0,_.useState)(null),[c,l]=(0,_.useState)(``),[u,d]=(0,_.useState)(`all`),f=e.find(e=>e.id===(o||i))||e[0],p=t.filter(e=>e.pharmacy_id===f?.id),m=p.reduce((e,t)=>e+Number(t.total_sales_amount||0),0),h=p.reduce((e,t)=>e+Number(t.total_pieces_count||0),0),g=p.reduce((e,t)=>e+Number(t.total_bonus_count||0),0),v=Array.from(new Set(e.map(e=>e.area||e.city).filter(Boolean))),y=e.filter(e=>{let t=e.name.toLowerCase().includes(c.toLowerCase())||e.city.toLowerCase().includes(c.toLowerCase())||e.area&&e.area.toLowerCase().includes(c.toLowerCase()),n=u===`all`||e.area===u||e.city===u;return t&&n});return(0,q.jsxs)(`div`,{className:`animate-in`,style:{display:`flex`,flexDirection:`column`,gap:`1.25rem`},children:[(0,q.jsx)(`div`,{className:`pharmacy-mobile-page`,children:o?(0,q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`1rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,gap:`0.5rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>s(null),className:`pharmacy-back-btn`,children:[(0,q.jsx)(ln,{size:17}),(0,q.jsx)(`span`,{children:`العودة لدليل الصيدليات`})]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>f&&n(f.id),className:`btn-clay btn-primary btn-sm`,style:{background:`#059669`,borderColor:`#047857`,fontWeight:800,display:`flex`,alignItems:`center`,gap:5},children:[(0,q.jsx)($n,{size:16}),(0,q.jsx)(`span`,{children:`+ إضافة فاتورة`})]})]}),(0,q.jsxs)(`div`,{className:`card`,style:{padding:`1.25rem`,borderLeft:`4px solid var(--primary)`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.4rem`,marginBottom:`0.35rem`},children:[(0,q.jsxs)(`span`,{className:`badge badge-primary`,style:{fontSize:`0.72rem`},children:[(0,q.jsx)(dn,{size:12}),` ملف الصيدلية`]}),f?.area&&(0,q.jsxs)(`span`,{className:`badge`,style:{background:`#f0f9ff`,color:`#0369a1`,border:`1px solid #bae6fd`,fontSize:`0.72rem`,fontWeight:700},children:[`📍 `,f.area]})]}),(0,q.jsx)(`h2`,{style:{fontSize:`1.25rem`,fontWeight:900,color:`var(--gray-900)`,margin:`0 0 0.5rem`},children:f?.name}),(0,q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.35rem`,fontSize:`0.82rem`,color:`var(--gray-600)`,marginBottom:`0.85rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.4rem`},children:[(0,q.jsx)(Tr,{size:15,style:{color:`var(--primary)`}}),(0,q.jsxs)(`span`,{children:[f?.city,` `,f?.address?`— ${f.address}`:``]})]}),f?.phone&&(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.4rem`},children:[(0,q.jsx)(jr,{size:15,style:{color:`var(--success)`}}),(0,q.jsx)(`a`,{href:`tel:${f.phone}`,style:{color:`var(--primary)`,fontWeight:700},children:f.phone})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.4rem`},children:[(0,q.jsx)(si,{size:15,style:{color:`var(--purple)`}}),(0,q.jsxs)(`span`,{children:[`المندوب: `,f?.assigned_rep_name||`مندوب بغداد`]})]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.5rem`,flexWrap:`wrap`,paddingTop:`0.75rem`,borderTop:`1px solid var(--gray-100)`},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>f&&n(f.id),className:`btn-clay btn-primary flex-1`,style:{background:`#059669`,borderColor:`#047857`,fontWeight:800,justifyContent:`center`},children:[(0,q.jsx)($n,{size:16}),` إضافة فاتورة`]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>f&&r(f.id),className:`btn-clay btn-secondary flex-1`,style:{fontWeight:800,justifyContent:`center`},children:[(0,q.jsx)(hn,{size:16}),` جدولة زيارة`]})]})]}),(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(105px, 1fr))`,gap:`0.65rem`},children:[(0,q.jsx)(`div`,{className:`stat-card`,style:{padding:`0.75rem`},children:(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,style:{fontSize:`0.7rem`},children:`إجمالي المسحوبات`}),(0,q.jsx)(`div`,{className:`stat-value`,style:{fontSize:`1.05rem`,color:`var(--primary)`},children:m.toLocaleString()}),(0,q.jsx)(`div`,{className:`stat-sub`,style:{fontSize:`0.65rem`},children:`د.ع`})]})}),(0,q.jsx)(`div`,{className:`stat-card`,style:{padding:`0.75rem`},children:(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,style:{fontSize:`0.7rem`},children:`إجمالي القطع`}),(0,q.jsx)(`div`,{className:`stat-value`,style:{fontSize:`1.05rem`,color:`var(--success)`},children:h}),(0,q.jsx)(`div`,{className:`stat-sub`,style:{fontSize:`0.65rem`},children:`قطعة`})]})}),(0,q.jsx)(`div`,{className:`stat-card`,style:{padding:`0.75rem`},children:(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,style:{fontSize:`0.7rem`},children:`البونص المجاني`}),(0,q.jsxs)(`div`,{className:`stat-value`,style:{fontSize:`1.05rem`,color:`var(--purple)`},children:[`+`,g]}),(0,q.jsx)(`div`,{className:`stat-sub`,style:{fontSize:`0.65rem`},children:`هدية 🎁`})]})})]}),(0,q.jsxs)(`div`,{className:`card`,style:{padding:`1rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`0.75rem`},children:[(0,q.jsxs)(`h5`,{style:{fontWeight:800,margin:0,fontSize:`0.92rem`},children:[`سجل فواتير الصيدلية (`,p.length,`)`]}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>f&&n(f.id),className:`btn-link`,style:{fontSize:`0.76rem`,color:`#059669`,fontWeight:800,textDecoration:`none`},children:`+ فاتورة جديدة`})]}),p.length===0?(0,q.jsxs)(`div`,{style:{textAlign:`center`,padding:`2rem 1rem`,color:`var(--gray-400)`},children:[(0,q.jsx)(rr,{size:36,style:{color:`var(--gray-300)`,display:`block`,margin:`0 auto 0.5rem`}}),(0,q.jsx)(`p`,{style:{fontWeight:700,fontSize:`0.86rem`,margin:0},children:`لا توجد فواتير مسجلة لهذه الصيدلية بعد`}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>f&&n(f.id),className:`btn-clay btn-primary btn-sm`,style:{marginTop:`0.75rem`,background:`#059669`,borderColor:`#047857`},children:[(0,q.jsx)($n,{size:15}),` إضافة الفاتورة الأولى`]})]}):(0,q.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.65rem`},children:p.map(e=>(0,q.jsxs)(`div`,{style:{background:`var(--gray-50)`,border:`1px solid var(--gray-200)`,borderRadius:12,padding:`0.75rem 0.85rem`,display:`flex`,flexDirection:`column`,gap:`0.35rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,q.jsxs)(`span`,{style:{fontWeight:800,fontSize:`0.85rem`,color:`var(--gray-900)`},children:[`فاتورة #`,e.invoice_number||`—`]}),(0,q.jsx)(`span`,{className:`badge ${e.status===`approved`?`badge-success`:e.status===`rejected`?`badge-danger`:`badge-warning`}`,style:{fontSize:`0.68rem`},children:e.status===`approved`?`معتمدة`:e.status===`rejected`?`مرفوضة`:`قيد التدقيق`})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,fontSize:`0.75rem`,color:`var(--gray-500)`},children:[(0,q.jsxs)(`span`,{children:[`التاريخ: `,(e.invoice_date||``).split(`T`)[0]]}),(0,q.jsxs)(`span`,{style:{fontWeight:800,color:`var(--primary)`},children:[Number(e.total_sales_amount).toLocaleString(),` د.ع`]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,fontSize:`0.72rem`,color:`var(--gray-600)`},children:[(0,q.jsxs)(`span`,{children:[`الكمية: `,e.total_pieces_count,` قطعة`]}),(0,q.jsxs)(`span`,{className:`badge badge-warning`,style:{fontSize:`0.66rem`},children:[`+`,e.total_bonus_count,` بونص 🎁`]})]})]},e.id))})]})]}):(0,q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`1rem`},children:[(0,q.jsxs)(`div`,{className:`card`,style:{padding:`1.15rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,marginBottom:`0.3rem`},children:[(0,q.jsxs)(`span`,{className:`badge badge-primary`,style:{fontSize:`0.74rem`},children:[(0,q.jsx)(dn,{size:13}),` شبكة التوزيع الدوائية`]}),(0,q.jsxs)(`span`,{className:`badge badge-success`,style:{fontSize:`0.74rem`},children:[e.length,` صيدلية`]})]}),(0,q.jsx)(`h1`,{className:`page-title`,style:{fontSize:`1.25rem`,margin:`0 0 0.35rem`},children:`دليل الصيدليات المعتمدة`}),(0,q.jsx)(`p`,{className:`page-subtitle`,style:{fontSize:`0.8rem`,margin:0},children:`اختر صيدلية للاطلاع على مسحوباتها وسجل فواتيرها أو إضافة فاتورة فورية لها.`}),(0,q.jsx)(`div`,{style:{marginTop:`0.85rem`},children:(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,style:{fontSize:`0.85rem`,padding:`0.6rem 0.85rem`},placeholder:`🔍 ابحث باسم الصيدلية أو المنطقة...`,value:c,onChange:e=>l(e.target.value)})}),v.length>0&&(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.4rem`,overflowX:`auto`,paddingBottom:`0.25rem`,marginTop:`0.65rem`},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>d(`all`),className:`btn-clay btn-sm ${u===`all`?`btn-primary`:`btn-secondary`}`,style:{fontSize:`0.72rem`,padding:`0.25rem 0.65rem`,borderRadius:20},children:[`الكل (`,e.length,`)`]}),v.map(e=>(0,q.jsx)(`button`,{type:`button`,onClick:()=>d(e),className:`btn-clay btn-sm ${u===e?`btn-primary`:`btn-secondary`}`,style:{fontSize:`0.72rem`,padding:`0.25rem 0.65rem`,borderRadius:20,whiteSpace:`nowrap`},children:e},e))]})]}),(0,q.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.75rem`},children:y.map(e=>{let r=t.filter(t=>t.pharmacy_id===e.id),i=r.reduce((e,t)=>e+Number(t.total_sales_amount||0),0),a=r.reduce((e,t)=>e+Number(t.total_pieces_count||0),0);return(0,q.jsxs)(`div`,{className:`pharmacy-mobile-card`,onClick:()=>s(e.id),style:{cursor:`pointer`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,gap:`0.5rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{fontWeight:900,fontSize:`1rem`,color:`var(--gray-900)`,marginBottom:`0.2rem`},children:[`🏥 `,e.name]}),(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.4rem`,flexWrap:`wrap`,fontSize:`0.76rem`,color:`var(--gray-600)`},children:[(0,q.jsxs)(`span`,{className:`badge`,style:{background:`#f0f9ff`,color:`#0369a1`,border:`1px solid #bae6fd`,fontSize:`0.7rem`,fontWeight:700},children:[`📍 `,e.area||e.city]}),e.phone&&(0,q.jsxs)(`span`,{children:[`📞 `,e.phone]})]})]}),(0,q.jsx)(Cn,{size:20,style:{color:`var(--primary)`,flexShrink:0,marginTop:4}})]}),(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1.2fr 1fr 1fr`,gap:`0.4rem`,background:`var(--gray-50)`,borderRadius:10,padding:`0.5rem 0.75rem`,border:`1px solid var(--gray-200)`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.66rem`,color:`var(--gray-500)`,fontWeight:600},children:`إجمالي المسحوبات`}),(0,q.jsx)(`div`,{style:{fontSize:`0.84rem`,fontWeight:900,color:`var(--primary)`},children:i>0?`${i.toLocaleString()} د.ع`:`لا توجد مبيعات`})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.66rem`,color:`var(--gray-500)`,fontWeight:600},children:`الفواتير`}),(0,q.jsx)(`div`,{style:{fontSize:`0.84rem`,fontWeight:800,color:`var(--gray-800)`},children:r.length})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.66rem`,color:`var(--gray-500)`,fontWeight:600},children:`القطع`}),(0,q.jsx)(`div`,{style:{fontSize:`0.84rem`,fontWeight:800,color:`var(--gray-800)`},children:a})]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.5rem`,alignItems:`center`},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:t=>{t.stopPropagation(),s(e.id)},className:`btn-clay btn-secondary btn-sm flex-1`,style:{justifyContent:`center`,fontSize:`0.8rem`,fontWeight:800},children:[(0,q.jsx)(rr,{size:14}),` عرض الملف والفواتير`]}),(0,q.jsxs)(`button`,{type:`button`,onClick:t=>{t.stopPropagation(),n(e.id)},className:`btn-clay btn-primary btn-sm`,style:{background:`#059669`,borderColor:`#047857`,fontWeight:800,fontSize:`0.8rem`,display:`flex`,alignItems:`center`,gap:4},children:[(0,q.jsx)($n,{size:14}),` + فاتورة`]})]})]},e.id)})})]})}),(0,q.jsx)(`div`,{className:`pharmacy-desktop-view`,style:{display:void 0},children:(0,q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`1.25rem`},children:[(0,q.jsx)(`div`,{className:`card`,children:(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,flexWrap:`wrap`,gap:`1rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,marginBottom:`0.4rem`},children:[(0,q.jsxs)(`span`,{className:`badge badge-primary`,children:[(0,q.jsx)(dn,{size:13}),` ملف الصيدلية 360°`]}),(0,q.jsx)(`span`,{style:{fontSize:`0.8rem`,color:`var(--gray-400)`},children:`قاعدة بيانات Supabase Docker`})]}),(0,q.jsx)(`h1`,{className:`page-title`,style:{margin:`0 0 0.5rem`},children:f?.name||`اختر صيدلية`}),(0,q.jsxs)(`div`,{style:{display:`flex`,flexWrap:`wrap`,gap:`1rem`,fontSize:`0.85rem`,color:`var(--gray-600)`},children:[(0,q.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`0.35rem`},children:[(0,q.jsx)(Tr,{size:15,style:{color:`var(--primary)`}}),` `,f?.city,` — `,f?.address]}),(0,q.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`0.35rem`},children:[(0,q.jsx)(jr,{size:15,style:{color:`var(--success)`}}),` `,f?.phone||`—`]}),(0,q.jsxs)(`span`,{style:{display:`flex`,alignItems:`center`,gap:`0.35rem`},children:[(0,q.jsx)(si,{size:15,style:{color:`var(--purple)`}}),` المندوب المسؤول: `,f?.assigned_rep_name||`مندوب بغداد`]})]})]}),f&&(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.65rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`button`,{onClick:()=>n(f.id),className:`btn-clay btn-primary`,style:{background:`#059669`,borderColor:`#047857`},children:[(0,q.jsx)($n,{size:18}),(0,q.jsx)(`span`,{children:`إضافة فاتورة لهذه الصيدلية`})]}),(0,q.jsxs)(`button`,{onClick:()=>r(f.id),className:`btn-clay btn-secondary`,children:[(0,q.jsx)(hn,{size:18}),(0,q.jsx)(`span`,{children:`جدولة زيارة`})]})]})]})}),(0,q.jsxs)(`div`,{className:`pharmacy-profile-grid`,children:[(0,q.jsxs)(`div`,{className:`card`,style:{height:`fit-content`},children:[(0,q.jsxs)(`h5`,{style:{fontWeight:800,marginBottom:`0.75rem`,display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,q.jsx)(dn,{size:18,style:{color:`var(--primary)`}}),`دليل الصيدليات (`,e.length,`)`]}),(0,q.jsx)(`div`,{style:{marginBottom:`0.75rem`},children:(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,placeholder:`🔍 ابحث بالاسم أو المدينة...`,value:c,onChange:e=>l(e.target.value)})}),(0,q.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.5rem`},children:y.map(e=>{let t=e.id===f?.id;return(0,q.jsxs)(`div`,{onClick:()=>a(e.id),style:{padding:`0.85rem 1rem`,borderRadius:12,cursor:`pointer`,transition:`all 0.2s ease`,background:t?`var(--primary)`:`var(--gray-50)`,color:t?`#ffffff`:`var(--gray-800)`,border:t?`1px solid var(--primary)`:`1px solid var(--gray-200)`},children:[(0,q.jsx)(`div`,{style:{fontWeight:800,fontSize:`0.9rem`},children:e.name}),(0,q.jsxs)(`div`,{style:{fontSize:`0.75rem`,opacity:t?.9:.6,marginTop:2},children:[`📍 `,e.city,` `,e.address?`— ${e.address.substring(0,24)}...`:``]})]},e.id)})})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`1.25rem`},children:[(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(180px, 1fr))`,gap:`1rem`},children:[(0,q.jsx)(`div`,{className:`stat-card`,children:(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,children:`إجمالي المسحوبات`}),(0,q.jsx)(`div`,{className:`stat-value`,style:{color:`var(--primary)`},children:m.toLocaleString()}),(0,q.jsx)(`div`,{className:`stat-sub`,children:`دينار عراقي`})]})}),(0,q.jsx)(`div`,{className:`stat-card`,children:(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,children:`إجمالي القطع المشتراة`}),(0,q.jsx)(`div`,{className:`stat-value`,style:{color:`var(--success)`},children:h}),(0,q.jsx)(`div`,{className:`stat-sub`,children:`عبوة دوائية`})]})}),(0,q.jsx)(`div`,{className:`stat-card`,children:(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,children:`البونص المكتسب`}),(0,q.jsxs)(`div`,{className:`stat-value`,style:{color:`var(--purple)`},children:[`+`,g]}),(0,q.jsx)(`div`,{className:`stat-sub`,children:`قطعة مجانية (10+1)`})]})})]}),(0,q.jsxs)(`div`,{className:`card`,children:[(0,q.jsxs)(`h5`,{style:{fontWeight:800,marginBottom:`1rem`},children:[`سجل فواتير الصيدلية (`,p.length,`)`]}),p.length===0?(0,q.jsxs)(`div`,{style:{textAlign:`center`,padding:`2.5rem 1rem`,color:`var(--gray-400)`},children:[(0,q.jsx)(rr,{size:40,style:{color:`var(--gray-300)`,display:`block`,margin:`0 auto 0.75rem`}}),(0,q.jsx)(`p`,{style:{fontWeight:700,margin:0},children:`لا توجد فواتير سابقة لهذه الصيدلية حتى الآن`}),(0,q.jsxs)(`button`,{onClick:()=>f&&n(f.id),className:`btn-clay btn-primary btn-sm`,style:{marginTop:`0.85rem`,background:`#059669`,borderColor:`#047857`},children:[(0,q.jsx)($n,{size:15}),` إضافة الفاتورة الأولى`]})]}):(0,q.jsx)(`div`,{style:{overflowX:`auto`},children:(0,q.jsxs)(`table`,{className:`clay-table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`رقم الفاتورة`}),(0,q.jsx)(`th`,{children:`تاريخ الفاتورة`}),(0,q.jsx)(`th`,{children:`المبلغ`}),(0,q.jsx)(`th`,{children:`القطع`}),(0,q.jsx)(`th`,{children:`البونص`}),(0,q.jsx)(`th`,{children:`الحالة`})]})}),(0,q.jsx)(`tbody`,{children:p.map(e=>(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`td`,{style:{fontWeight:800},children:e.invoice_number||`—`}),(0,q.jsx)(`td`,{children:e.invoice_date}),(0,q.jsxs)(`td`,{style:{fontWeight:800,color:`var(--primary)`},children:[Number(e.total_sales_amount).toLocaleString(),` د.ع`]}),(0,q.jsx)(`td`,{children:e.total_pieces_count}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`span`,{className:`badge badge-warning`,children:[`+`,e.total_bonus_count,` 🎁`]})}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`span`,{className:`badge ${e.status===`approved`?`badge-success`:e.status===`rejected`?`badge-danger`:`badge-warning`}`,children:e.status===`approved`?`معتمدة`:e.status===`rejected`?`مرفوضة`:`قيد المراجعة`})})]},e.id))})]})})]})]})]})]})})]})},ji=({user:e,invoices:t,pharmacies:n,onApproveInvoice:r,onRejectInvoice:i,onDeleteInvoice:a,onUpdateInvoice:o,onAddInvoice:s,onRefresh:c})=>{let[l,u]=(0,_.useState)(`all`),[d,f]=(0,_.useState)(`all`),[p,m]=(0,_.useState)(``),[h,g]=(0,_.useState)(null),[v,y]=(0,_.useState)(null),[b,x]=(0,_.useState)(null),[S,C]=(0,_.useState)(``),[w,T]=(0,_.useState)(null),[ee,E]=(0,_.useState)(!1),[te,D]=(0,_.useState)(null),[ne,O]=(0,_.useState)(null),[re,ae]=(0,_.useState)(``),[k,A]=(0,_.useState)(``),[oe,se]=(0,_.useState)(``),[ce,j]=(0,_.useState)(``),[le,ue]=(0,_.useState)(``),[de,fe]=(0,_.useState)([]),[me,M]=(0,_.useState)(!1),[he,ge]=(0,_.useState)(null),_e=e=>{O(e),ae(e.pharmacy_id);let t=e.pharmacy_name||n.find(t=>t.id===e.pharmacy_id)?.name||``;A(t),se(e.pharmacy_area||e.area||ie(t)||``),j(e.invoice_number||``),ue((e.invoice_date||``).split(`T`)[0]),fe(e.items&&e.items.length>0?e.items.map((e,t)=>({id:e.id||`edit-item-${t}-${Date.now()}`,product_id:e.product_id,product_name_snapshot:e.product_name_snapshot,dosage_form:e.dosage_form,sold_quantity:e.sold_quantity,historical_unit_price:e.historical_unit_price,bonus_quantity:e.bonus_quantity})):[{id:`1`,product_id:`c0000010-0000-0000-0000-000000000010`,product_name_snapshot:`دواء جديد`,sold_quantity:10,historical_unit_price:5e3,bonus_quantity:1}]),ge(null)},N=e=>{fe(t=>t.filter((t,n)=>n!==e))},P=async(e,t)=>{let n=e.items||[];if(n.length<=1){window.confirm(`هذا آخر صنف في الفاتورة. هل تريد حذف الفاتورة بالكامل؟`)&&(await G.deleteInvoice(e.id),a?.(e.id),g(null));return}let r=n[t];if(!window.confirm(`هل تريد حذف الصنف "${r?.product_name_snapshot||``}" من الفاتورة؟`))return;let i=n.filter((e,n)=>n!==t);try{let t=await G.updateInvoice(e.id,{pharmacy_id:e.pharmacy_id,pharmacy_name:e.pharmacy_name,pharmacy_area:e.pharmacy_area||e.area||``,invoice_number:e.invoice_number,invoice_date:(e.invoice_date||``).split(`T`)[0],items:i.map(e=>({product_id:e.product_id,sold_quantity:Math.max(1,Number(e.sold_quantity)||1),custom_product_name:e.product_name_snapshot,dosage_form:e.dosage_form,custom_unit_price:Number(e.historical_unit_price)||0,custom_bonus:Number(e.bonus_quantity)||0}))});o?.(t),g(t)}catch(e){alert(e?.message||`فشل حذف الصنف من الفاتورة`)}},ve=async e=>{if(e.preventDefault(),ne){if(de.length===0)ge(`يرجى إضافة صنف واحد على الأقل قبل حفظ الفاتورة.`);else{M(!0),ge(null);try{let e=k.trim(),t=n.find(t=>t.name.trim().toLowerCase()===e.toLowerCase()),r={pharmacy_id:t?t.id:re&&t===void 0&&!e?re:void 0,pharmacy_name:e||void 0,pharmacy_area:oe.trim(),invoice_number:ce.trim(),invoice_date:le,items:de.map(e=>({product_id:e.product_id,sold_quantity:Math.max(1,parseInt(e.sold_quantity)||1),custom_product_name:e.product_name_snapshot?.trim(),dosage_form:e.dosage_form,custom_unit_price:parseFloat(e.historical_unit_price)||0,custom_bonus:e.bonus_quantity===void 0?void 0:Math.max(0,parseInt(e.bonus_quantity)||0)}))},i=await G.updateInvoice(ne.id,r);o?.(i),O(null),h?.id===ne.id&&g(i)}catch(e){ge(e.message||`فشل حفظ التعديلات`)}finally{M(!1)}}}},[ye,be]=(0,_.useState)(!1),[xe,F]=(0,_.useState)(!1),I=_.useMemo(()=>pe(t),[t]),Se=_.useMemo(()=>t.filter(e=>{let t=I.get(e.id);return t?.isDuplicate&&!t?.isOriginal}).length,[t,I]),Ce=async()=>{let e=t.filter(e=>{let t=I.get(e.id);return t?.isDuplicate&&!t?.isOriginal});if(e.length!==0&&window.confirm(`⚠️ هل أنت متأكد من رغبتك في إزالة جميع النسخ المكررة (${e.length} فاتورة)؟\n\nسيتم الإبقاء على الفواتير الأصلية فقط وإزالة كافة النسخ المكررة، وستعود الفواتير الأصلية للوضع الطبيعي غير الملون فوراً.`)){F(!0);try{for(let t of e)await G.deleteInvoice(t.id,{preserveOriginalInSheet:!0}),a?.(t.id);c?.()}catch(e){alert(`حدث خطأ أثناء إزالة بعض الفواتير: `+(e.message||e))}finally{F(!1)}}},we=t.filter(e=>{if(ye&&!I.get(e.id)?.isDuplicate||l!==`all`&&e.status!==l||d!==`all`&&e.pharmacy_id!==d)return!1;if(p){let t=p.toLowerCase(),n=e.invoice_number?.toLowerCase().includes(t),r=e.pharmacy_name?.toLowerCase().includes(t),i=(e.pharmacy_area||e.area||``).toLowerCase().includes(t),a=e.rep_name?.toLowerCase().includes(t);if(!n&&!r&&!i&&!a)return!1}return!0}),Te=we.reduce((e,t)=>e+Number(t.total_sales_amount||0),0),Ee=we.filter(e=>e.status===`approved`).reduce((e,t)=>e+Number(t.total_sales_amount||0),0),L=we.filter(e=>e.status===`pending_review`).reduce((e,t)=>e+Number(t.total_sales_amount||0),0),De=we.reduce((e,t)=>e+Number(t.total_bonus_count||0),0),Oe=()=>{let e=[`رقم الفاتورة`,`الصيدلية`,`المنطقة / المكان`,`المدينة / المحافظة`,`المندوب`,`التاريخ`,`المبلغ (د.ع)`,`القطع`,`البونص`,`الحالة`,`سبب الرفض`],t=we.map(e=>[e.invoice_number||``,`"${e.pharmacy_name||``}"`,`"${e.pharmacy_area||e.area||``}"`,`"${e.pharmacy_city||`بغداد`}"`,`"${e.rep_name||``}"`,e.invoice_date,e.total_sales_amount,e.total_pieces_count,e.total_bonus_count,e.status===`approved`?`معتمدة`:e.status===`rejected`?`مرفوضة`:`قيد المراجعة`,`"${e.rejection_reason||``}"`]),n=`﻿`+[e.join(`,`),...t.map(e=>e.join(`,`))].join(`\r
`),r=new Blob([n],{type:`text/csv;charset=utf-8;`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.setAttribute(`download`,`تقرير_الفواتير_والمبيعات_${new Date().toISOString().split(`T`)[0]}.csv`),document.body.appendChild(a),a.click(),document.body.removeChild(a)},ke=()=>{b&&(S.trim()?(i(b,S),x(null),C(``)):alert(`يرجى كتابة سبب رفض الفاتورة`))},Ae=e.role===`admin`||e.role===`supervisor`;return(0,q.jsxs)(`div`,{className:`animate-in`,style:{display:`flex`,flexDirection:`column`,gap:`1.25rem`},children:[(0,q.jsxs)(`div`,{className:`page-header`,children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,marginBottom:`0.4rem`},children:[(0,q.jsxs)(`span`,{className:`badge badge-primary`,children:[(0,q.jsx)(rr,{size:13}),` السجل المالي للفواتير`]}),(0,q.jsx)(`span`,{style:{fontSize:`0.8rem`,color:`var(--gray-400)`},children:`قاعدة بيانات Supabase Docker`})]}),(0,q.jsx)(`h1`,{className:`page-title`,children:`سجل فواتير المبيعات والاعتماد`}),(0,q.jsx)(`p`,{className:`page-subtitle`,children:`استعراض وتدقيق الفواتير المرفوعة بواسطة المندوبين، مراجعة بونص الأصناف (10+1)، واعتماد الصرف أو الرفض.`})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.65rem`,alignItems:`center`,flexWrap:`wrap`},children:[c&&(0,q.jsxs)(`button`,{onClick:c,className:`btn-clay btn-secondary`,title:`مزامنة وتحديث الفواتير من كوكل شيت`,children:[(0,q.jsx)(Lr,{size:17}),(0,q.jsx)(`span`,{children:`مزامنة من الشيت`})]}),s&&(0,q.jsxs)(`button`,{onClick:s,className:`btn-clay btn-primary`,style:{background:`#059669`,borderColor:`#047857`,display:`flex`,alignItems:`center`,gap:`0.45rem`,fontWeight:800},children:[(0,q.jsx)(Fr,{size:18}),(0,q.jsx)(`span`,{children:`إضافة فاتورة جديدة`})]}),(0,q.jsxs)(`button`,{onClick:Oe,className:`btn-clay btn-secondary`,children:[(0,q.jsx)(Gn,{size:18}),(0,q.jsx)(`span`,{children:`تصدير تقرير Excel (CSV)`})]})]})]}),(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(220px, 1fr))`,gap:`1rem`},children:[(0,q.jsx)(`div`,{className:`stat-card`,children:(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,children:`إجمالي الفواتير المعروضة`}),(0,q.jsx)(`div`,{className:`stat-value`,style:{color:`var(--primary)`},children:Te.toLocaleString()}),(0,q.jsx)(`div`,{className:`stat-sub`,children:`دينار عراقي`})]})}),(0,q.jsx)(`div`,{className:`stat-card`,children:(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,children:`المبالغ المعتمدة رسمياً`}),(0,q.jsx)(`div`,{className:`stat-value`,style:{color:`var(--success)`},children:Ee.toLocaleString()}),(0,q.jsx)(`div`,{className:`stat-sub`,children:`دينار عراقي`})]})}),(0,q.jsx)(`div`,{className:`stat-card`,children:(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,children:`مبالغ قيد المراجعة`}),(0,q.jsx)(`div`,{className:`stat-value`,style:{color:`var(--warning)`},children:L.toLocaleString()}),(0,q.jsx)(`div`,{className:`stat-sub`,children:`دينار عراقي`})]})}),(0,q.jsx)(`div`,{className:`stat-card`,children:(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,children:`إجمالي بونص الأصناف`}),(0,q.jsxs)(`div`,{className:`stat-value`,style:{color:`var(--purple)`},children:[`+`,De]}),(0,q.jsx)(`div`,{className:`stat-sub`,children:`قطعة مجانية ممنوحة`})]})}),Se>0&&(0,q.jsx)(`div`,{onClick:()=>be(e=>!e),className:`stat-card`,style:{cursor:`pointer`,background:ye?`#fee2e2`:`#fef2f2`,border:`2px solid #ef4444`,boxShadow:`0 4px 12px rgba(239, 68, 68, 0.12)`},title:`انقر لتصفية الفواتير المكررة فقط`,children:(0,q.jsxs)(`div`,{className:`stat-content`,children:[(0,q.jsx)(`div`,{className:`stat-label`,style:{color:`#991b1b`,fontWeight:800},children:`⚠️ فواتير مكررة مرصودة`}),(0,q.jsx)(`div`,{className:`stat-value`,style:{color:`#dc2626`},children:Se}),(0,q.jsx)(`div`,{className:`stat-sub`,style:{color:`#b91c1c`},children:ye?`انقر لعرض الكل ✓`:`انقر لتصفية المكررات 🔍`})]})})]}),Se>0&&(0,q.jsxs)(`div`,{style:{background:`linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)`,border:`1.5px solid #f87171`,borderRadius:14,padding:`0.9rem 1.25rem`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`1rem`,color:`#991b1b`,boxShadow:`0 4px 14px rgba(239, 68, 68, 0.1)`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.75rem`},children:[(0,q.jsx)(Dn,{size:24,style:{color:`#dc2626`,flexShrink:0}}),(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{fontWeight:900,fontSize:`0.95rem`,color:`#991b1b`},children:[`⚠️ تم رصد (`,Se,`) فواتير مكررة في السجل المالي!`]}),(0,q.jsx)(`div`,{style:{fontSize:`0.82rem`,color:`#b91c1c`,marginTop:`0.15rem`},children:`الفواتير المكررة موضحة باللون الوردي وشارة ⚠️ مكررة. يمكنك إزالتها فردياً أو إزالة جميع النسخ المكررة بضغطة واحدة، وستعود الفاتورة الأصلية للوضع الطبيعي غير الملون فوراً.`})]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.6rem`,alignItems:`center`,flexWrap:`wrap`},children:[(0,q.jsx)(`button`,{onClick:()=>be(e=>!e),className:`btn-clay btn-secondary btn-sm`,style:{background:`white`,color:`#991b1b`,borderColor:`#fca5a5`,fontWeight:800},children:ye?`عرض جميع الفواتير`:`تصفية المكررات فقط (${Se})`}),(0,q.jsxs)(`button`,{onClick:Ce,disabled:xe,className:`btn-clay btn-danger btn-sm`,style:{fontWeight:900,display:`flex`,alignItems:`center`,gap:6,background:`#dc2626`,color:`white`},title:`حذف جميع النسخ المكررة والإبقاء على الفاتورة الأصلية فقط`,children:[(0,q.jsx)($r,{size:15}),xe?`جارِ الإزالة...`:`إزالة كافة النسخ المكررة بنقرة واحدة`]})]})]}),(0,q.jsx)(`div`,{className:`card`,style:{padding:`1rem 1.25rem`},children:(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(200px, 1fr))`,gap:`1rem`,alignItems:`center`},children:[(0,q.jsx)(`div`,{children:(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,placeholder:`🔍 بحث برقم الفاتورة...`,value:p,onChange:e=>m(e.target.value)})}),(0,q.jsx)(`div`,{children:(0,q.jsxs)(`select`,{className:`clay-input`,value:l,onChange:e=>u(e.target.value),children:[(0,q.jsxs)(`option`,{value:`all`,children:[`جميع الحالات (`,t.length,`)`]}),(0,q.jsx)(`option`,{value:`pending_review`,children:`قيد المراجعة والتدقيق`}),(0,q.jsx)(`option`,{value:`approved`,children:`معتمدة`}),(0,q.jsx)(`option`,{value:`rejected`,children:`مرفوضة`})]})}),(0,q.jsx)(`div`,{children:(0,q.jsxs)(`select`,{className:`clay-input`,value:d,onChange:e=>f(e.target.value),children:[(0,q.jsx)(`option`,{value:`all`,children:`كل الصيدليات`}),n.map(e=>(0,q.jsxs)(`option`,{value:e.id,children:[e.name,` (`,e.city,`)`]},e.id))]})})]})}),(0,q.jsxs)(`div`,{className:`card`,children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`1.25rem`,flexWrap:`wrap`,gap:`0.5rem`},children:[(0,q.jsxs)(`h5`,{style:{fontWeight:800,margin:0},children:[`قائمة الفواتير الموثقة (`,we.length,`)`]}),(0,q.jsx)(`span`,{style:{fontSize:`0.8rem`,color:`var(--gray-400)`},children:`مخزنة في PostgreSQL عبر سوبا بيس`})]}),we.length===0?(0,q.jsxs)(`div`,{style:{textAlign:`center`,padding:`3rem 1rem`,color:`var(--gray-400)`},children:[(0,q.jsx)(rr,{size:48,style:{color:`var(--gray-300)`,display:`block`,margin:`0 auto 1rem`}}),(0,q.jsx)(`h4`,{style:{fontWeight:800,color:`var(--gray-700)`,marginBottom:`0.5rem`},children:`لا توجد فواتير مسجلة حالياً`}),(0,q.jsx)(`p`,{style:{fontSize:`0.88rem`,maxWidth:400,margin:`0 auto`},children:`تم تنظيف بيانات الاختبار بالكامل. يمكن للمندوب إضافة الفواتير الجديدة يدوياً أو عبر رفع صورة أو ملف PDF.`})]}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`div`,{className:`table-responsive desktop-table-view`,children:(0,q.jsxs)(`table`,{className:`clay-table`,children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{children:`رقم الفاتورة`}),(0,q.jsx)(`th`,{children:`الصيدلية`}),(0,q.jsx)(`th`,{children:`المنطقة / المكان`}),(0,q.jsx)(`th`,{children:`المندوب`}),(0,q.jsx)(`th`,{children:`تاريخ الفاتورة`}),(0,q.jsx)(`th`,{children:`المبلغ الإجمالي`}),(0,q.jsx)(`th`,{children:`القطع`}),(0,q.jsx)(`th`,{children:`البونص`}),(0,q.jsx)(`th`,{children:`الحالة`}),(0,q.jsx)(`th`,{children:`تفاصيل الأصناف`}),(0,q.jsx)(`th`,{children:`مستند الفاتورة`}),Ae&&(0,q.jsx)(`th`,{style:{textAlign:`center`},children:`إجراء الاعتماد`}),(0,q.jsx)(`th`,{style:{textAlign:`center`},children:`تعديل`}),(0,q.jsx)(`th`,{style:{textAlign:`center`},children:`حذف`})]})}),(0,q.jsx)(`tbody`,{children:we.map(t=>{let n=(t.invoice_date||``).split(`T`)[0],i=I.get(t.id),a=i?.isDuplicate,o=i?.isOriginal;return(0,q.jsxs)(`tr`,{style:{background:a?o?`#fffbeb`:`#fee2e2`:`#ffffff`,transition:`background-color 0.25s ease`},children:[(0,q.jsx)(`td`,{style:{fontWeight:800,color:a&&!o?`#b91c1c`:`var(--gray-900)`},children:(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.4rem`,flexWrap:`wrap`},children:[(0,q.jsx)(`button`,{onClick:()=>g(t),className:`btn-link`,style:{fontWeight:800,color:a&&!o?`#b91c1c`:`var(--primary)`,textDecoration:`underline`,background:`none`,border:`none`,cursor:`pointer`,padding:0},title:`انقر لقراءة تفاصيل الفاتورة`,children:t.invoice_number||`—`}),a&&(0,q.jsx)(`span`,{className:`badge`,style:{fontSize:`0.68rem`,padding:`2px 6px`,background:o?`#f59e0b`:`#ef4444`,color:`white`,fontWeight:800},title:i?.reason,children:o?`⚠️ أصلية`:`⚠️ مكررة`})]})}),(0,q.jsx)(`td`,{style:{fontWeight:600},children:t.pharmacy_name||`صيدلية معتمدة`}),(0,q.jsx)(`td`,{children:(0,q.jsx)(`span`,{className:`badge`,style:{background:`#f0f9ff`,color:`#0369a1`,border:`1px solid #bae6fd`,fontSize:`0.78rem`,fontWeight:700},children:t.pharmacy_area||t.area||`—`})}),(0,q.jsx)(`td`,{style:{color:`var(--gray-600)`},children:t.rep_name||`مندوب ميداني`}),(0,q.jsx)(`td`,{style:{color:`var(--gray-500)`,fontSize:`0.85rem`},children:n}),(0,q.jsxs)(`td`,{style:{fontWeight:800,color:`var(--primary)`},children:[Number(t.total_sales_amount).toLocaleString(),` د.ع`]}),(0,q.jsxs)(`td`,{children:[t.total_pieces_count,` قطعة`]}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`span`,{className:`badge ${t.total_bonus_count>0?`badge-warning`:`badge-gray`}`,children:[`+`,t.total_bonus_count,` 🎁`]})}),(0,q.jsx)(`td`,{children:t.status===`approved`?(0,q.jsxs)(`span`,{className:`badge badge-success`,children:[(0,q.jsx)(jn,{size:12}),` معتمدة`]}):t.status===`rejected`?(0,q.jsxs)(`span`,{className:`badge badge-danger`,title:t.rejection_reason,children:[(0,q.jsx)(Dn,{size:12}),` مرفوضة`]}):(0,q.jsxs)(`span`,{className:`badge badge-warning`,children:[(0,q.jsx)(Fn,{size:12}),` قيد التدقيق`]})}),(0,q.jsx)(`td`,{children:(0,q.jsxs)(`button`,{onClick:()=>g(t),className:`btn-clay btn-primary btn-sm`,style:{padding:`0.35rem 0.65rem`,display:`flex`,alignItems:`center`,gap:`0.35rem`},title:`قراءة وتدقيق بنود الفاتورة`,children:[(0,q.jsx)(rr,{size:14}),` تفاصيل (`,t.items?.length||0,`)`]})}),(0,q.jsx)(`td`,{children:t.image_url?(0,q.jsxs)(`button`,{onClick:()=>y(t.image_url||null),className:`btn-clay btn-secondary btn-sm`,style:{padding:`0.35rem 0.65rem`},children:[(0,q.jsx)(Zn,{size:14}),` معاينة`]}):(0,q.jsx)(`span`,{style:{fontSize:`0.75rem`,color:`var(--gray-400)`},children:`إدخال يدوي`})}),Ae&&(0,q.jsx)(`td`,{children:t.status===`pending_review`?(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.4rem`,justifyContent:`center`},children:[(0,q.jsxs)(`button`,{onClick:()=>r(t.id),className:`btn-clay btn-success btn-sm`,children:[(0,q.jsx)(jn,{size:14}),` اعتماد`]}),(0,q.jsxs)(`button`,{onClick:()=>x(t.id),className:`btn-clay btn-danger btn-sm`,children:[(0,q.jsx)(Dn,{size:14}),` رفض`]})]}):(0,q.jsx)(`span`,{style:{fontSize:`0.75rem`,color:`var(--gray-400)`,textAlign:`center`,display:`block`},children:`مكتملة`})}),(Ae||t.rep_id===e.id&&t.status===`pending_review`)&&(0,q.jsx)(`td`,{style:{textAlign:`center`},children:(0,q.jsx)(`button`,{onClick:()=>_e(t),className:`btn-clay btn-secondary btn-sm`,style:{padding:`0.3rem 0.5rem`},title:`تعديل بيانات الفاتورة`,children:(0,q.jsx)(kr,{size:14,style:{color:`var(--primary)`}})})}),(Ae||t.rep_id===e.id&&t.status===`pending_review`)&&(0,q.jsx)(`td`,{style:{textAlign:`center`},children:(0,q.jsxs)(`button`,{onClick:()=>T(t.id),className:`btn-clay btn-danger btn-sm`,style:{padding:a&&!o?`0.3rem 0.65rem`:`0.3rem 0.5rem`,background:a&&!o?`#dc2626`:void 0,color:a&&!o?`white`:void 0,fontWeight:a&&!o?800:600,display:`inline-flex`,alignItems:`center`,gap:4},title:a&&!o?`إزالة هذه النسخة المكررة من السجل`:`حذف الفاتورة`,children:[(0,q.jsx)($r,{size:14}),a&&!o&&(0,q.jsx)(`span`,{children:`إزالة المكررة`})]})})]},t.id)})})]})}),(0,q.jsx)(`div`,{className:`mobile-cards-view`,children:we.map(t=>{let n=(t.invoice_date||``).split(`T`)[0],i=I.get(t.id),a=i?.isDuplicate,o=i?.isOriginal,s=Ae||t.rep_id===e.id&&t.status===`pending_review`;return(0,q.jsxs)(`div`,{className:`mobile-invoice-card`,style:{borderLeft:a?o?`4px solid #f59e0b`:`4px solid #ef4444`:`4px solid var(--primary)`,background:a?o?`#fffbeb`:`#fee2e2`:`#ffffff`},children:[(0,q.jsxs)(`div`,{className:`mobile-card-header`,children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.4rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>g(t),className:`mobile-invoice-number-btn`,title:`انقر لتفاصيل الفاتورة`,children:[`فاتورة #`,t.invoice_number||`—`]}),a&&(0,q.jsx)(`span`,{className:`badge`,style:{fontSize:`0.68rem`,padding:`2px 6px`,background:o?`#f59e0b`:`#ef4444`,color:`white`,fontWeight:800},children:o?`⚠️ أصلية`:`⚠️ مكررة`})]}),(0,q.jsx)(`div`,{children:t.status===`approved`?(0,q.jsxs)(`span`,{className:`badge badge-success`,children:[(0,q.jsx)(jn,{size:12}),` معتمدة`]}):t.status===`rejected`?(0,q.jsxs)(`span`,{className:`badge badge-danger`,children:[(0,q.jsx)(Dn,{size:12}),` مرفوضة`]}):(0,q.jsxs)(`span`,{className:`badge badge-warning`,children:[(0,q.jsx)(Fn,{size:12}),` قيد التدقيق`]})})]}),(0,q.jsxs)(`div`,{className:`mobile-card-body`,children:[(0,q.jsxs)(`div`,{style:{fontWeight:800,fontSize:`0.96rem`,color:`var(--gray-900)`,marginBottom:`0.25rem`},children:[`🏥 `,t.pharmacy_name||`صيدلية معتمدة`]}),(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.6rem`,flexWrap:`wrap`,fontSize:`0.78rem`,color:`var(--gray-600)`,marginBottom:`0.5rem`},children:[t.pharmacy_area&&(0,q.jsxs)(`span`,{className:`badge`,style:{background:`#f0f9ff`,color:`#0369a1`,border:`1px solid #bae6fd`,fontSize:`0.74rem`,fontWeight:700},children:[`📍 `,t.pharmacy_area]}),(0,q.jsxs)(`span`,{children:[`👤 `,t.rep_name||`مندوب ميداني`]}),(0,q.jsxs)(`span`,{children:[`📅 `,n]})]}),(0,q.jsxs)(`div`,{className:`mobile-card-metrics`,children:[(0,q.jsxs)(`div`,{className:`mobile-metric`,children:[(0,q.jsx)(`span`,{className:`mobile-metric-label`,children:`المبلغ الصافي:`}),(0,q.jsxs)(`span`,{className:`mobile-metric-val`,style:{color:`var(--primary)`,fontWeight:900},children:[Number(t.total_sales_amount).toLocaleString(),` د.ع`]})]}),(0,q.jsxs)(`div`,{className:`mobile-metric`,children:[(0,q.jsx)(`span`,{className:`mobile-metric-label`,children:`الكمية:`}),(0,q.jsxs)(`span`,{className:`mobile-metric-val`,children:[t.total_pieces_count,` قطعة`]})]}),(0,q.jsxs)(`div`,{className:`mobile-metric`,children:[(0,q.jsx)(`span`,{className:`mobile-metric-label`,children:`البونص:`}),(0,q.jsxs)(`span`,{className:`badge ${t.total_bonus_count>0?`badge-warning`:`badge-gray`}`,style:{fontSize:`0.72rem`},children:[`+`,t.total_bonus_count,` 🎁`]})]})]})]}),(0,q.jsxs)(`div`,{className:`mobile-card-actions`,children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>g(t),className:`btn-clay btn-secondary btn-sm`,style:{flex:1,justifyContent:`center`},children:[(0,q.jsx)(rr,{size:14}),` تفاصيل (`,t.items?.length||0,`)`]}),t.image_url&&(0,q.jsxs)(`button`,{type:`button`,onClick:()=>y(t.image_url||null),className:`btn-clay btn-secondary btn-sm`,style:{padding:`0.35rem 0.65rem`},title:`معاينة المستند`,children:[(0,q.jsx)(Zn,{size:14}),` صورة`]}),Ae&&t.status===`pending_review`&&(0,q.jsxs)(q.Fragment,{children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>r(t.id),className:`btn-clay btn-success btn-sm`,style:{padding:`0.35rem 0.65rem`},title:`اعتماد الفاتورة`,children:[(0,q.jsx)(jn,{size:14}),` اعتماد`]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>x(t.id),className:`btn-clay btn-danger btn-sm`,style:{padding:`0.35rem 0.65rem`},title:`رفض الفاتورة`,children:[(0,q.jsx)(Dn,{size:14}),` رفض`]})]}),s&&(a&&!o?(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.4rem`,width:`100%`,flexWrap:`wrap`,marginTop:`0.25rem`},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>_e(t),className:`btn-clay btn-secondary btn-sm`,style:{padding:`0.4rem 0.65rem`},title:`تعديل الفاتورة`,children:[(0,q.jsx)(kr,{size:14,style:{color:`var(--primary)`}}),` تعديل`]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>T(t.id),className:`btn-clay btn-danger btn-sm`,style:{flex:1,justifyContent:`center`,background:`#dc2626`,color:`white`,fontWeight:800,padding:`0.45rem 0.75rem`},title:`حذف الفاتورة المكررة بالكامل مع جميع أصنافها`,children:[(0,q.jsx)($r,{size:14}),` حذف الفاتورة المكررة بالكامل (`,t.items?.length||1,` أصناف)`]})]}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>_e(t),className:`btn-clay btn-secondary btn-sm`,style:{padding:`0.35rem 0.6rem`},title:`تعديل الفاتورة`,children:(0,q.jsx)(kr,{size:14,style:{color:`var(--primary)`}})}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>T(t.id),className:`btn-clay btn-danger btn-sm`,style:{padding:`0.35rem 0.6rem`},title:`حذف الفاتورة`,children:(0,q.jsx)($r,{size:14})})]}))]})]},t.id)})})]})]}),h&&(()=>{let t=I.get(h.id),n=Ae||h.rep_id===e.id&&h.status===`pending_review`;return(0,q.jsxs)(Si,{maxWidth:880,onClose:()=>g(null),children:[(0,q.jsxs)(`div`,{className:`modal-header`,children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,marginBottom:`0.25rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`span`,{className:`badge badge-primary`,children:[(0,q.jsx)(rr,{size:13}),` قراءة وتدقيق الفاتورة`]}),h.status===`approved`?(0,q.jsxs)(`span`,{className:`badge badge-success`,children:[(0,q.jsx)(jn,{size:12}),` معتمدة`]}):h.status===`rejected`?(0,q.jsxs)(`span`,{className:`badge badge-danger`,children:[(0,q.jsx)(Dn,{size:12}),` مرفوضة`]}):(0,q.jsxs)(`span`,{className:`badge badge-warning`,children:[(0,q.jsx)(Fn,{size:12}),` قيد التدقيق والمراجعة`]}),t?.isDuplicate&&!t?.isOriginal&&(0,q.jsx)(`span`,{className:`badge`,style:{background:`#dc2626`,color:`white`,fontWeight:800},children:`⚠️ نسخة مكررة`})]}),(0,q.jsxs)(`h3`,{className:`modal-title`,children:[`فاتورة رقم: `,h.invoice_number||`—`]}),(0,q.jsxs)(`div`,{className:`modal-subtitle`,style:{display:`flex`,gap:`1rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`span`,{children:[`🏥 الصيدلية: `,(0,q.jsx)(`strong`,{children:h.pharmacy_name||`—`})]}),(0,q.jsxs)(`span`,{children:[`📍 المنطقة: `,(0,q.jsx)(`strong`,{children:h.pharmacy_area||h.area||`—`})]}),(0,q.jsxs)(`span`,{children:[`👤 المندوب: `,(0,q.jsx)(`strong`,{children:h.rep_name||`—`})]}),(0,q.jsxs)(`span`,{children:[`📅 التاريخ: `,(0,q.jsx)(`strong`,{children:(h.invoice_date||``).split(`T`)[0]})]})]})]}),(0,q.jsx)(`button`,{onClick:()=>g(null),style:{background:`none`,border:`none`,cursor:`pointer`,color:`var(--gray-400)`,padding:4},children:(0,q.jsx)(hi,{size:22})})]}),(0,q.jsxs)(`div`,{className:`modal-body`,children:[h.rejection_reason&&(0,q.jsxs)(`div`,{className:`alert-danger mb-3`,style:{padding:`0.75rem 1rem`},children:[(0,q.jsx)(Dn,{size:18}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`strong`,{children:`سبب الرفض:`}),` `,h.rejection_reason]})]}),h.image_url&&(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,background:`var(--gray-50)`,border:`1px solid var(--gray-200)`,borderRadius:12,padding:`0.75rem 1rem`,marginBottom:`1rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.75rem`},children:[(0,q.jsx)(`img`,{src:h.image_url,alt:`معاينة`,style:{width:44,height:44,objectFit:`cover`,borderRadius:8,border:`1px solid var(--gray-300)`}}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontWeight:700,fontSize:`0.88rem`},children:`مستند الفاتورة الأصلي مرفق`}),(0,q.jsx)(`div`,{style:{fontSize:`0.75rem`,color:`var(--gray-500)`},children:`تم التقاطه أو رفعه عبر النظام`})]})]}),(0,q.jsxs)(`button`,{onClick:()=>y(h.image_url||null),className:`btn-clay btn-secondary btn-sm`,children:[(0,q.jsx)(Zn,{size:14}),` معاينة بالحجم الكامل`]})]}),(0,q.jsxs)(`h5`,{style:{fontWeight:800,marginBottom:`0.75rem`,color:`var(--gray-800)`},children:[`قائمة الأصناف الدوائية المحسوبة (`,h.items?.length||0,` أصناف):`]}),!h.items||h.items.length===0?(0,q.jsx)(`div`,{style:{textAlign:`center`,padding:`1.5rem`,color:`var(--gray-400)`,background:`var(--gray-50)`,borderRadius:12},children:`لا توجد بنود مفصلة لهذه الفاتورة`}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(`div`,{className:`desktop-table-view`,style:{overflowX:`auto`,border:`1px solid var(--gray-200)`,borderRadius:12},children:(0,q.jsxs)(`table`,{className:`clay-table`,style:{margin:0,fontSize:`0.86rem`},children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{style:{background:`var(--gray-100)`},children:[(0,q.jsx)(`th`,{children:`#`}),(0,q.jsx)(`th`,{children:`اسم المستحضر الدوائي`}),(0,q.jsx)(`th`,{children:`النوع`}),(0,q.jsx)(`th`,{style:{textAlign:`center`},children:`الكمية المباعة`}),(0,q.jsx)(`th`,{style:{textAlign:`center`},children:`سعر الوحدة`}),(0,q.jsx)(`th`,{style:{textAlign:`center`},children:`البونص (10+1)`}),(0,q.jsx)(`th`,{style:{textAlign:`center`},children:`إجمالي القطع`}),(0,q.jsx)(`th`,{style:{textAlign:`left`},children:`المجموع الصافي`}),n&&(0,q.jsx)(`th`,{style:{textAlign:`center`},children:`حذف الصنف`})]})}),(0,q.jsx)(`tbody`,{children:h.items.map((e,t)=>(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`td`,{children:t+1}),(0,q.jsx)(`td`,{style:{fontWeight:800,color:`var(--gray-900)`},children:e.product_name_snapshot||`مستحضر دوائي`}),(0,q.jsx)(`td`,{children:(()=>{let t=e.dosage_form||(e.product_type_snapshot===`drop`?`قطرة`:e.product_type_snapshot===`cream`?`كريم`:e.product_type_snapshot===`ointment`?`مرهم`:Ti(e.product_name_snapshot||``)),n=Ei(t);return(0,q.jsx)(`span`,{className:`badge`,style:{fontSize:`0.75rem`,fontWeight:800,background:n.bg,color:n.color,border:`1px solid ${n.border}`},children:t})})()}),(0,q.jsxs)(`td`,{style:{textAlign:`center`,fontWeight:700},children:[e.sold_quantity,` قطعة`]}),(0,q.jsxs)(`td`,{style:{textAlign:`center`,color:`var(--gray-600)`},children:[Number(e.historical_unit_price).toLocaleString(),` د.ع`]}),(0,q.jsx)(`td`,{style:{textAlign:`center`},children:(0,q.jsxs)(`span`,{className:`badge ${e.bonus_quantity>0?`badge-warning`:`badge-gray`}`,children:[`+`,e.bonus_quantity,` مجانية`]})}),(0,q.jsx)(`td`,{style:{textAlign:`center`,fontWeight:800,color:`var(--gray-800)`},children:(e.sold_quantity||0)+(e.bonus_quantity||0)}),(0,q.jsxs)(`td`,{style:{textAlign:`left`,fontWeight:900,color:`var(--primary)`},children:[Number(e.line_total).toLocaleString(),` د.ع`]}),n&&(0,q.jsx)(`td`,{style:{textAlign:`center`},children:(0,q.jsx)(`button`,{type:`button`,onClick:()=>P(h,t),className:`btn-clay btn-danger btn-sm`,style:{padding:`0.28rem 0.55rem`},title:`حذف هذا الصنف`,children:(0,q.jsx)($r,{size:14})})})]},e.id||t))})]})}),(0,q.jsx)(`div`,{className:`mobile-cards-view`,style:{gap:`0.6rem`},children:h.items.map((e,t)=>{let r=e.dosage_form||(e.product_type_snapshot===`drop`?`قطرة`:e.product_type_snapshot===`cream`?`كريم`:e.product_type_snapshot===`ointment`?`مرهم`:Ti(e.product_name_snapshot||``)),i=Ei(r);return(0,q.jsxs)(`div`,{style:{background:`var(--gray-50)`,border:`1px solid var(--gray-200)`,borderRadius:12,padding:`0.75rem`,display:`flex`,flexDirection:`column`,gap:`0.45rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,gap:`0.4rem`},children:[(0,q.jsxs)(`span`,{style:{fontWeight:800,color:`var(--gray-900)`,fontSize:`0.9rem`},children:[t+1,`. `,e.product_name_snapshot||`مستحضر دوائي`]}),(0,q.jsx)(`span`,{className:`badge`,style:{fontSize:`0.7rem`,background:i.bg,color:i.color,border:`1px solid ${i.border}`},children:r})]}),(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`1fr 1fr`,gap:`0.35rem`,fontSize:`0.78rem`,color:`var(--gray-600)`},children:[(0,q.jsxs)(`span`,{children:[`الكمية: `,(0,q.jsx)(`strong`,{children:e.sold_quantity}),` قطعة`]}),(0,q.jsxs)(`span`,{children:[`السعر: `,(0,q.jsx)(`strong`,{children:Number(e.historical_unit_price).toLocaleString()}),` د.ع`]}),(0,q.jsxs)(`span`,{children:[`البونص: `,(0,q.jsxs)(`strong`,{style:{color:`#b45309`},children:[`+`,e.bonus_quantity]})]}),(0,q.jsxs)(`span`,{style:{color:`var(--primary)`,fontWeight:900},children:[`المجموع: `,Number(e.line_total).toLocaleString(),` د.ع`]})]}),n&&(0,q.jsxs)(`button`,{type:`button`,onClick:()=>P(h,t),className:`btn-clay btn-danger btn-sm`,style:{marginTop:4,width:`100%`,justifyContent:`center`,background:`#fee2e2`,color:`#dc2626`,border:`1px solid #fca5a5`,fontWeight:800},children:[(0,q.jsx)($r,{size:14}),` حذف الصنف`]})]},e.id||t)})})]}),(0,q.jsxs)(`div`,{style:{marginTop:`1.25rem`,padding:`1rem 1.25rem`,borderRadius:14,background:`linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)`,border:`1px solid #86efac`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`1rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.78rem`,color:`#166534`,fontWeight:700},children:`إجمالي قيمة الفاتورة الصافي:`}),(0,q.jsxs)(`div`,{style:{fontSize:`1.5rem`,fontWeight:900,color:`#15803d`},children:[Number(h.total_sales_amount).toLocaleString(),` `,(0,q.jsx)(`span`,{style:{fontSize:`0.85rem`},children:`دينار عراقي`})]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`1.5rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.75rem`,color:`#166534`},children:`إجمالي القطع المباعة`}),(0,q.jsxs)(`div`,{style:{fontWeight:800,fontSize:`1.1rem`,color:`#14532d`},children:[h.total_pieces_count,` قطعة`]})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.75rem`,color:`#b45309`},children:`إجمالي بونص مجاني`}),(0,q.jsxs)(`div`,{style:{fontWeight:800,fontSize:`1.1rem`,color:`#d97706`},children:[`+`,h.total_bonus_count,` قطعة 🎁`]})]})]})]})]}),(0,q.jsxs)(`div`,{style:{borderTop:`1px solid var(--gray-200)`,paddingTop:`1rem`,marginTop:`1rem`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`0.75rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.5rem`,alignItems:`center`,flexWrap:`wrap`},children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>g(null),className:`btn-clay btn-secondary`,children:`إغلاق`}),n&&(0,q.jsxs)(q.Fragment,{children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>{let e=h;g(null),_e(e)},className:`btn-clay btn-primary btn-sm`,style:{display:`flex`,alignItems:`center`,gap:`0.35rem`},children:[(0,q.jsx)(kr,{size:15}),` تعديل الفاتورة`]}),t?.isDuplicate&&!t?.isOriginal&&(0,q.jsxs)(`button`,{type:`button`,onClick:()=>T(h.id),className:`btn-clay btn-danger btn-sm`,style:{background:`#dc2626`,color:`white`,fontWeight:800},children:[(0,q.jsx)($r,{size:15}),` حذف الفاتورة المكررة بالكامل`]})]})]}),Ae&&h.status===`pending_review`&&(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.5rem`},children:[(0,q.jsxs)(`button`,{onClick:()=>{r(h.id),g(null)},className:`btn-clay btn-success`,children:[(0,q.jsx)(jn,{size:16}),` اعتماد الفاتورة الآن`]}),(0,q.jsxs)(`button`,{onClick:()=>{x(h.id),g(null)},className:`btn-clay btn-danger`,children:[(0,q.jsx)(Dn,{size:16}),` رفض الفاتورة`]})]})]})]})})(),v&&(0,q.jsxs)(Si,{maxWidth:720,onClose:()=>y(null),children:[(0,q.jsxs)(`div`,{className:`modal-header`,children:[(0,q.jsx)(`h5`,{className:`modal-title`,children:`مستند الفاتورة الأصلي`}),(0,q.jsx)(`button`,{onClick:()=>y(null),style:{background:`none`,border:`none`,cursor:`pointer`,color:`var(--gray-500)`},children:(0,q.jsx)(hi,{size:20})})]}),(0,q.jsx)(`div`,{className:`modal-body`,style:{textAlign:`center`},children:(0,q.jsx)(`img`,{src:v,alt:`أصل الفاتورة`,style:{maxWidth:`100%`,maxHeight:`60vh`,objectFit:`contain`,borderRadius:12}})})]}),b&&(0,q.jsxs)(Si,{maxWidth:460,onClose:()=>{x(null),C(``)},children:[(0,q.jsxs)(`div`,{className:`modal-header`,children:[(0,q.jsx)(`h5`,{className:`modal-title`,style:{color:`var(--danger)`},children:`تأكيد رفض الفاتورة`}),(0,q.jsx)(`button`,{onClick:()=>{x(null),C(``)},style:{background:`none`,border:`none`,cursor:`pointer`,color:`var(--gray-400)`},children:(0,q.jsx)(hi,{size:20})})]}),(0,q.jsxs)(`div`,{className:`modal-body`,children:[(0,q.jsx)(`p`,{style:{color:`var(--gray-600)`,marginBottom:`0.85rem`},children:`يرجى كتابة سبب الرفض ليظهر للمندوب ويتمكن من تصحيح الفاتورة أو إعادة رفعها:`}),(0,q.jsx)(`textarea`,{className:`clay-input`,rows:3,placeholder:`مثال: الصورة غير واضحة، أو الكمية غير متطابقة مع الختم`,value:S,onChange:e=>C(e.target.value),style:{width:`100%`,marginBottom:`0.85rem`}})]}),(0,q.jsxs)(`div`,{className:`modal-footer`,children:[(0,q.jsx)(`button`,{onClick:()=>{x(null),C(``)},className:`btn-clay btn-secondary btn-sm`,children:`إلغاء`}),(0,q.jsx)(`button`,{onClick:ke,className:`btn-clay btn-danger btn-sm`,children:`تأكيد الرفض`})]})]}),w&&(0,q.jsxs)(Si,{maxWidth:440,onClose:()=>{ee||(T(null),D(null))},children:[(0,q.jsxs)(`div`,{className:`modal-header`,children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.65rem`},children:[(0,q.jsx)($r,{size:22,style:{color:`var(--danger)`}}),(0,q.jsx)(`h5`,{className:`modal-title`,style:{color:`var(--danger)`},children:`تأكيد حذف الفاتورة`})]}),(0,q.jsx)(`button`,{onClick:()=>{T(null),D(null)},style:{background:`none`,border:`none`,cursor:`pointer`,color:`var(--gray-400)`},children:(0,q.jsx)(hi,{size:20})})]}),(0,q.jsxs)(`div`,{className:`modal-body`,children:[(0,q.jsx)(`p`,{style:{color:`var(--gray-600)`,margin:`0 0 1rem 0`,lineHeight:1.6},children:w&&I.get(w)?.isDuplicate&&!I.get(w)?.isOriginal?(0,q.jsx)(`span`,{style:{color:`#b91c1c`,fontWeight:700},children:`⚠️ أنت بصدد إزالة هذه النسخة المكررة. عند إزالتها، ستعود الفاتورة الأصلية تلقائياً للوضع الطبيعي غير الملون فوراً.`}):`هل أنت متأكد من حذف هذه الفاتورة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.`}),te&&(0,q.jsxs)(`div`,{className:`alert-danger mb-3`,style:{padding:`0.6rem 1rem`,fontSize:`0.83rem`},children:[(0,q.jsx)(Dn,{size:15}),` `,te]})]}),(0,q.jsxs)(`div`,{className:`modal-footer`,children:[(0,q.jsx)(`button`,{onClick:()=>{T(null),D(null)},disabled:ee,className:`btn-clay btn-secondary btn-sm`,children:`إلغاء`}),(0,q.jsx)(`button`,{onClick:async()=>{if(w){E(!0),D(null);try{let e=I.get(w);await G.deleteInvoice(w,{preserveOriginalInSheet:!!e?.isDuplicate}),a?.(w),T(null),h?.id===w&&g(null)}catch(e){D(e.message||`فشل حذف الفاتورة`)}finally{E(!1)}}},disabled:ee,className:`btn-clay btn-danger btn-sm`,children:ee?`جارِ الحذف...`:w&&I.get(w)?.isDuplicate&&!I.get(w)?.isOriginal?`تأكيد إزالة المكررة`:`تأكيد الحذف`})]})]}),ne&&(0,q.jsxs)(Si,{maxWidth:920,onClose:()=>{me||O(null)},children:[(0,q.jsxs)(`div`,{className:`modal-header`,children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,q.jsx)(kr,{size:22,style:{color:`var(--primary)`}}),(0,q.jsxs)(`h4`,{className:`modal-title`,children:[`تعديل بيانات الفاتورة: `,ne.invoice_number||`بدون رقم`]})]}),(0,q.jsx)(`button`,{onClick:()=>O(null),style:{background:`none`,border:`none`,cursor:`pointer`,color:`var(--gray-400)`},children:(0,q.jsx)(hi,{size:20})})]}),he&&(0,q.jsxs)(`div`,{className:`alert-danger mb-3`,style:{padding:`0.65rem 1rem`},children:[(0,q.jsx)(Dn,{size:16}),` `,he]}),(0,q.jsxs)(`form`,{onSubmit:ve,className:`modal-body`,style:{display:`flex`,flexDirection:`column`},children:[(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(220px, 1fr))`,gap:`1rem`,marginBottom:`1.25rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.8rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`الصيدلية المستهدفة *`}),(0,q.jsx)(`input`,{type:`text`,list:`edit-pharmacies-datalist`,className:`clay-input`,placeholder:`اكتب اسم الصيدلية أو اختر من القائمة...`,value:k,onChange:e=>{let t=e.target.value;A(t);let r=n.find(e=>e.name.trim().toLowerCase()===t.trim().toLowerCase());ae(r?r.id:``);let i=r?r.area:ie(t);i&&!oe.trim()&&se(i)},required:!0,style:{fontWeight:700}}),(0,q.jsx)(`datalist`,{id:`edit-pharmacies-datalist`,children:n.map(e=>(0,q.jsx)(`option`,{value:e.name,children:e.city?`(${e.city})`:``},e.id))})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.8rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`المنطقة / المكان`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,placeholder:`مثال: المنصور، الكرادة، الزعفرانية...`,value:oe,onChange:e=>se(e.target.value)})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.8rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`رقم الفاتورة *`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,value:ce,onChange:e=>j(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.8rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`تاريخ الفاتورة *`}),(0,q.jsx)(`input`,{type:`date`,className:`clay-input`,value:le,onChange:e=>ue(e.target.value),required:!0})]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`0.65rem`,flexWrap:`wrap`,gap:`0.5rem`},children:[(0,q.jsxs)(`span`,{style:{fontWeight:800,fontSize:`0.9rem`,color:`var(--gray-800)`},children:[`الأصناف والأسعار والكميات المحسوبة (`,de.length,` أصناف):`]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.4rem`,alignItems:`center`},children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>fe(e=>e.map(e=>({...e,bonus_quantity:Math.floor(Math.max(1,parseInt(e.sold_quantity)||1)/10)}))),className:`btn-clay btn-secondary btn-sm`,style:{fontSize:`0.74rem`,color:`#15803d`,fontWeight:800},title:`إعادة احتساب وتطبيق قاعدة البونص الثابت (10+1) على كافة البنود`,children:`🎁 تطبيق بونص (10+1)`}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>fe(e=>[...e,{id:Math.random().toString(),product_id:`c0000010-0000-0000-0000-000000000010`,product_name_snapshot:`صنف دوائي جديد`,sold_quantity:10,historical_unit_price:5e3,bonus_quantity:1}]),className:`btn-clay btn-secondary btn-sm`,children:[(0,q.jsx)(Fr,{size:14}),` إضافة صنف آخر`]})]})]}),(0,q.jsx)(`div`,{className:`invoice-items-scroll`,style:{marginBottom:`1.25rem`},children:(0,q.jsxs)(`div`,{className:`edit-invoice-items-wrap`,children:[de.map((e,t)=>{let n=Math.max(1,parseInt(e.sold_quantity)||1),r=n*(parseFloat(e.historical_unit_price)||0);return(0,q.jsxs)(`div`,{className:`edit-invoice-item-row`,children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`span`,{style:{fontSize:`0.68rem`,color:`var(--gray-400)`,display:`block`},children:`اسم الدواء / المادة`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,style:{padding:`0.35rem 0.5rem`,fontSize:`0.82rem`,fontWeight:700},value:e.product_name_snapshot||``,onChange:e=>{let n=e.target.value;fe(e=>e.map((e,r)=>r===t?{...e,product_name_snapshot:n}:e))},required:!0})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`span`,{style:{fontSize:`0.68rem`,color:`var(--gray-400)`,display:`block`},children:`الكمية`}),(0,q.jsx)(`input`,{type:`number`,min:1,className:`clay-input`,style:{padding:`0.35rem`,textAlign:`center`,fontSize:`0.82rem`},value:e.sold_quantity,onChange:e=>{let n=e.target.value,r=Math.max(0,parseInt(n)||0);fe(e=>e.map((e,i)=>i===t?{...e,sold_quantity:n,bonus_quantity:Math.floor(r/10)}:e))},required:!0})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`span`,{style:{fontSize:`0.68rem`,color:`var(--gray-400)`,display:`block`},children:`السعر (د.ع)`}),(0,q.jsx)(`input`,{type:`number`,min:0,className:`clay-input`,style:{padding:`0.35rem`,textAlign:`center`,fontSize:`0.82rem`},value:e.historical_unit_price,onChange:e=>{let n=e.target.value;fe(e=>e.map((e,r)=>r===t?{...e,historical_unit_price:n}:e))},required:!0})]}),(0,q.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.68rem`,color:`var(--gray-400)`,display:`block`},children:`البونص`}),(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`center`,gap:2},children:[(0,q.jsx)(`span`,{style:{color:`var(--warning)`,fontWeight:800,fontSize:`0.82rem`},children:`+`}),(0,q.jsx)(`input`,{type:`number`,min:0,className:`clay-input`,style:{padding:`0.35rem 0.4rem`,textAlign:`center`,fontSize:`0.82rem`,width:`100%`,fontWeight:800,color:`var(--warning)`},value:e.bonus_quantity===void 0?Math.floor(n/10):e.bonus_quantity,onChange:e=>{let n=Math.max(0,parseInt(e.target.value)||0);fe(e=>e.map((e,r)=>r===t?{...e,bonus_quantity:n}:e))}})]})]}),(0,q.jsxs)(`div`,{style:{textAlign:`center`},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.68rem`,color:`var(--gray-400)`,display:`block`},children:`المجموع`}),(0,q.jsxs)(`span`,{style:{fontWeight:800,fontSize:`0.85rem`,color:`var(--primary)`},children:[r.toLocaleString(),` د.ع`]})]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>N(t),style:{background:`#fee2e2`,border:`1px solid #fca5a5`,color:`#dc2626`,cursor:`pointer`,padding:`0.35rem 0.65rem`,borderRadius:8,display:`flex`,alignItems:`center`,justifyContent:`center`,gap:4,fontWeight:800,fontSize:`0.78rem`,touchAction:`manipulation`},title:`حذف هذا الصنف`,children:[(0,q.jsx)($r,{size:15}),(0,q.jsx)(`span`,{className:`mobile-only-inline`,children:`حذف الصنف`})]})]},e.id||t)}),de.length===0&&(0,q.jsx)(`div`,{style:{textAlign:`center`,padding:`1.1rem`,background:`#fffbeb`,border:`1px dashed #f59e0b`,borderRadius:10,color:`#92400e`,fontSize:`0.84rem`,fontWeight:700},children:`تم حذف جميع الأصناف — اضغط زر "+ إضافة صنف آخر" بالأعلى لإضافة صنف جديد.`})]})}),(()=>{let e=de.reduce((e,t)=>e+Math.max(1,parseInt(t.sold_quantity)||1)*(parseFloat(t.historical_unit_price)||0),0),t=de.reduce((e,t)=>e+Math.max(1,parseInt(t.sold_quantity)||1),0),n=de.reduce((e,t)=>e+(t.bonus_quantity===void 0?Math.floor(Math.max(1,parseInt(t.sold_quantity)||1)/10):Number(t.bonus_quantity)),0);return(0,q.jsxs)(`div`,{style:{background:`linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)`,border:`1px solid #bfdbfe`,borderRadius:12,padding:`0.85rem 1.25rem`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`1rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.75rem`,color:`#1e40af`,fontWeight:700},children:`المجموع الإجمالي الجديد:`}),(0,q.jsxs)(`div`,{style:{fontSize:`1.4rem`,fontWeight:900,color:`#1d4ed8`},children:[e.toLocaleString(),` `,(0,q.jsx)(`span`,{style:{fontSize:`0.82rem`},children:`دينار عراقي`})]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`1.5rem`,textAlign:`center`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.72rem`,color:`#1e40af`},children:`القطع الكلية`}),(0,q.jsxs)(`div`,{style:{fontWeight:800,fontSize:`1rem`,color:`#1e3a8a`},children:[t,` قطعة`]})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.72rem`,color:`#b45309`},children:`البونص المجاني`}),(0,q.jsxs)(`div`,{style:{fontWeight:800,fontSize:`1rem`,color:`#b45309`},children:[`+`,n,` مجاناً`]})]})]})]})})(),(0,q.jsxs)(`div`,{className:`modal-footer`,children:[(0,q.jsx)(`button`,{type:`button`,onClick:()=>O(null),className:`btn-clay btn-secondary`,disabled:me,children:`إلغاء`}),(0,q.jsx)(`button`,{type:`submit`,disabled:me,className:`btn-clay btn-primary`,style:{padding:`0.65rem 1.5rem`,fontWeight:800},children:me?`جاري حفظ التعديل...`:`حفظ التعديلات في الفاتورة ✅`})]})]})]})]})},Mi=({onDataChanged:e})=>{let[t,n]=(0,_.useState)(!1),[r,i]=(0,_.useState)(!1),[a,o]=(0,_.useState)(!1),[s,c]=(0,_.useState)(null),[l,u]=(0,_.useState)(null),[d,f]=(0,_.useState)(null),[p,m]=(0,_.useState)(null),[h,g]=(0,_.useState)(null),[v,y]=(0,_.useState)(``),[b,x]=(0,_.useState)(!1),[S,C]=(0,_.useState)(``),[w,T]=(0,_.useState)(!1),[ee,E]=(0,_.useState)(()=>jt().length),[te,D]=(0,_.useState)([]),[ne,O]=(0,_.useState)(!1),[re,ie]=(0,_.useState)(null),[ae,A]=(0,_.useState)(!1),[oe,se]=(0,_.useState)(!1),ce=H()?.role===`admin`,[j,le]=(0,_.useState)(null),[ue,de]=(0,_.useState)(!1),[fe,pe]=(0,_.useState)(!1),M=async()=>{n(!0),u(null);try{await G.flushSheetsSyncOutbox({keepalive:!0}).catch(()=>{}),E(jt().length),D(G.getPendingSkippedSheetDuplicates());let[e,t,n,r]=await Promise.all([G.getSheetsData(),G.getSheetsConfig(),G.getSheetsGapStatus().catch(()=>null),G.checkWebhookScriptStatus().catch(()=>({scriptVersion:0,isOutdated:!1}))]);m(e),g(t),le(n),ie(r?.scriptVersion?r.scriptVersion:null),O(!!r?.isOutdated),y(t.webhook_url||``)}catch(e){u(e.message||`تعذر جلب بيانات كوكل شيت`)}finally{n(!1)}};(0,_.useEffect)(()=>{M()},[]);let he=async()=>{i(!0),u(null),f(null);try{let t=await G.syncAllToSheets();f(t.message),Array.isArray(t.skipped_duplicates)&&t.skipped_duplicates.length>0&&G.addSkippedSheetDuplicateNotices(t.skipped_duplicates),await M(),e?.()}catch(e){u(e.message||`فشلت المزامنة مع كوكل شيت`)}finally{i(!1)}},ge=async()=>{de(!0),u(null),f(null);try{let t=await G.syncUnuploadedToSheets();f(t.message),Array.isArray(t.skipped_duplicates)&&t.skipped_duplicates.length>0&&G.addSkippedSheetDuplicateNotices(t.skipped_duplicates),await M(),e?.()}catch(e){u(e.message||`فشل رفع الفواتير غير المرفوعة`)}finally{de(!1)}},_e=async()=>{pe(!0),u(null),f(null);try{let e=await G.importMissingFromSheets();f(e.message),await M()}catch(e){u(e.message||`فشل استيراد الفواتير من كوكل شيت`)}finally{pe(!1)}},N=async e=>{e.preventDefault(),o(!0),u(null),f(null);try{let e=await G.updateSheetsWebhook(v);g(t=>t?{...t,webhook_url:e.webhook_url,is_connected:e.is_connected}:null),f(`تم حفظ رابط الويب هوك بنجاح! النظام متصل الآن للمزامنة الفورية.`)}catch(e){u(e.message||`فشل حفظ إعدادات الرابط`)}finally{o(!1)}},P=()=>{let e=h?.apps_script_code&&h.apps_script_code.includes(`SCRIPT_VERSION`)?h.apps_script_code:k;navigator.clipboard.writeText(e),x(!0),setTimeout(()=>x(!1),2500)},ve=async()=>{A(!0),u(null),f(null);try{let e=await G.repairGoogleSheet();f(e.message),await M()}catch(e){u(e?.message||`تعذر تنفيذ الإصلاح التلقائي للشيت`)}finally{A(!1)}},ye=async()=>{se(!0),u(null),f(null);try{let e=await G.checkAdminWebhookVersion().catch(()=>({scriptVersion:0,isOutdated:!1}));if(e.scriptVersion>0&&e.scriptVersion<10)throw ie(e.scriptVersion),O(!0),T(!0),Error(`السكربت المنشور على شيت الأدمن هو الإصدار (v${e.scriptVersion}) ولا يدعم استنساخ الأوراق و Pivot Tables. انسخ كود v10 أدناه ثم Apps Script ← Deploy ← Manage deployments ← Edit ← Version: New version ← Deploy.`);let t=await G.adminSyncTemplateToAllSheets();f(t.message||`تمت مزامنة أوراق و Pivot Tables الأدمن مع جميع الشيتات بنجاح ✅`),await M()}catch(e){u(e?.message||`تعذر مزامنة أوراق و Pivot Tables الأدمن لجميع الشيتات`)}finally{se(!1)}},be=(0,_.useMemo)(()=>(p?.rows||[]).filter(e=>{let t=String(e.invoice_number||``).trim(),n=String(e.pharmacy_name||``).trim(),r=String(e.product_name||``).trim();return t!==`123`&&(!!t||!!n||!!r)}),[p]),xe=(0,_.useMemo)(()=>p?.headers&&p.headers.length>0?p.headers:[`رقم الفاتورة`,`تاريخ الفاتورة`,`اسم المذخر`,`اسم الصيدلية`,`المنطقة / المكان`,`المدينة / المحافظة`,`اسم المادة الدوائية`,`نوع المادة / الشكل الدوائي`,`الكمية`,`سعر المفرد (د.ع)`,`البونص المجاني`,`المجموع (د.ع)`,`صافي الفاتورة الكلي (د.ع)`,`اسم المندوب العلمي`,`حالة الاعتماد`,`وقت وتاريخ الإدراج`],[p]),F=(0,_.useMemo)(()=>{let e=xe.map(e=>String(e||``).trim()),t=e.findIndex(e=>e.includes(`المنطق`)||e.includes(`المكان`)),n=e.findIndex(e=>e.includes(`المدين`)||e.includes(`المحافظ`)),r=t===-1||n>=0&&n!==t+1,i=new Set(`بغداد.البصرة.البصره.أربيل.اربيل.النجف.كربلاء.الموصل.نينوى.بابل.الحلة.الحله.كركوك.ديالى.الأنبار.الانبار.واسط.ذي قار.ميسان.المثنى.القادسية.القادسيه.الديوانية.الديوانيه.صلاح الدين.دهوك.السليمانية.السليمانيه`.split(`.`)),a=be.some(e=>{let t=String(e.product_name||``).trim(),n=String(e.rep_name||``).trim(),r=String(e.timestamp||``).trim(),a=String(e.area||``).trim(),o=String(e.city||``).trim(),s=/^\d+$/.test(t),c=a===`بغداد`&&o.length>2&&s,l=i.has(a)&&(!o||!i.has(o)),u=!r&&n.includes(`:`)&&/\d/.test(n),d=[`drop`,`cream`,`oint`,`قطرة`,`كريم`,`مرهم`,`elica`,`hyfresh`].some(e=>o.toLowerCase().includes(e));return c||l||u||d});return r||a},[be,xe]),{duplicateGroups:I,duplicateRowIndices:Se}=(0,_.useMemo)(()=>me(be),[be]),Ce=async t=>{if(window.confirm(`⚠️ حذف الفاتورة المكررة بالكامل (${t.invoice_number})?\n\nسيتم حذف جميع أصناف ومكونات هذه النسخة المكررة (${t.rowsCount} بنود) من الشيت والنظام دفعة واحدة وإرجاع الصف السليم للون الأبيض.`)){c(t.key),u(null),f(null);try{await G.deleteDuplicateSheetInvoice({invoice_number:t.invoice_number===`بدون رقم`?``:t.invoice_number,pharmacy_name:t.pharmacy_name,invoice_date:t.invoice_date,timestamp:t.timestamp}),f(`تم إرسال أمر حذف الفاتورة المكررة بالكامل (${t.invoice_number} — ${t.rowsCount} بنود) وإعادة الصف السليم للون الأبيض ✅`),await M(),e?.()}catch(e){u(e?.message||`تعذر حذف الفاتورة المكررة`)}finally{c(null)}}},we=(0,_.useMemo)(()=>be.map((e,t)=>({row:e,rowIndex:t})),[be]).filter(({row:e})=>{if(!S.trim())return!0;let t=S.toLowerCase();return Array.isArray(e.cells)&&e.cells.some(e=>String(e||``).toLowerCase().includes(t))||e.invoice_number&&String(e.invoice_number).toLowerCase().includes(t)||e.pharmacy_name&&String(e.pharmacy_name).toLowerCase().includes(t)||e.product_name&&String(e.product_name).toLowerCase().includes(t)||e.warehouse_name&&String(e.warehouse_name).toLowerCase().includes(t)||e.rep_name&&String(e.rep_name).toLowerCase().includes(t)||e.area&&String(e.area).toLowerCase().includes(t)||e.dosage_form&&String(e.dosage_form).toLowerCase().includes(t)}),Te=we.map(e=>e.row),Ee=Te.reduce((e,t)=>e+(Number(t.line_total)||0),0),L=Te.reduce((e,t)=>e+(Number(t.quantity)||0),0),De=Te.reduce((e,t)=>e+(Number(t.bonus_quantity)||0),0);return(0,q.jsxs)(`div`,{className:`animate-in`,style:{display:`flex`,flexDirection:`column`,gap:`1.25rem`},children:[(0,q.jsxs)(`div`,{className:`page-header`,style:{marginBottom:0},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,marginBottom:`0.4rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`span`,{className:`badge badge-success`,style:{display:`flex`,alignItems:`center`,gap:4},children:[(0,q.jsx)(Un,{size:13}),` كوكل شيت كقاعدة بيانات حية`]}),(0,q.jsxs)(`span`,{className:`badge ${h?.is_connected?`badge-primary`:`badge-warning`}`,style:{display:`flex`,alignItems:`center`,gap:4},children:[(0,q.jsx)(Gr,{size:13}),` `,h?.is_connected?`مزامنة تلقائية فورية مفعلة`:`قراءة عامة نشطة`]}),ee>0&&(0,q.jsxs)(`span`,{className:`badge`,style:{background:`#fef3c7`,color:`#92400e`,fontWeight:800},children:[`⏳ `,ee,` تحديثات بانتظار المزامنة`]})]}),(0,q.jsxs)(`h1`,{className:`page-title`,style:{display:`flex`,alignItems:`center`,gap:`0.6rem`},children:[(0,q.jsx)(tr,{size:28,style:{color:`#10b981`}}),`إدارة ومزامنة كوكل شيت (Google Sheets)`]}),(0,q.jsx)(`p`,{className:`page-subtitle`,children:`عرض جميع الأعمدة والبيانات الحية بمقاس تلقائي (Fit to Row / Fit to Column) مع مزامنة مستمرة لكل تعديل أو اعتماد أو حذف.`})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.6rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`a`,{href:h?.sheet_url||`https://docs.google.com/spreadsheets/d/1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE/edit?usp=sharing`,target:`_blank`,rel:`noopener noreferrer`,className:`btn-clay btn-secondary`,style:{textDecoration:`none`,display:`flex`,alignItems:`center`,gap:`0.4rem`,fontWeight:700},children:[(0,q.jsx)(qn,{size:16}),` فتح الملف في كوكل شيت`]}),(0,q.jsxs)(`button`,{onClick:M,disabled:t||r,className:`btn-clay btn-secondary`,title:`تحديث البيانات من كوكل شيت`,children:[(0,q.jsx)(Lr,{size:16,className:t?`animate-spin`:``}),` تحديث`]}),j?.unuploaded_count&&j.unuploaded_count>0?(0,q.jsxs)(`button`,{onClick:ge,disabled:ue||r,className:`btn-clay btn-primary`,style:{fontWeight:800,background:`#d97706`,borderColor:`#b45309`},children:[(0,q.jsx)(zn,{size:16,className:ue?`animate-spin`:``}),ue?`جارِ الرفع...`:`رفع غير المرفوعة (${j.unuploaded_count}) ⚡`]}):null,ce&&(0,q.jsxs)(`button`,{onClick:ye,disabled:oe||r,className:`btn-clay btn-secondary`,style:{fontWeight:800,background:`#ecfeff`,color:`#0e7490`,borderColor:`#a5f3fc`},title:`استنساخ تبويبات و Pivot Tables شيت الأدمن لجميع شيتات المندوبين`,children:[(0,q.jsx)(Lr,{size:16,className:oe?`animate-spin`:``}),oe?`جارِ تعميم Pivot Tables...`:`🔄 مزامنة أوراق و Pivot Tables الأدمن للجميع`]}),(0,q.jsxs)(`button`,{onClick:he,disabled:r||t,className:`btn-clay btn-primary`,style:{fontWeight:800},children:[(0,q.jsx)(zn,{size:18,className:r?`animate-spin`:``}),r?`جارِ المزامنة...`:`مزامنة وتصدير جميع الفواتير الآن 🚀`]})]})]}),l&&(0,q.jsxs)(`div`,{className:`alert-danger`,style:{display:`flex`,alignItems:`center`,gap:`0.75rem`},children:[(0,q.jsx)(Dn,{size:20}),(0,q.jsx)(`span`,{children:l})]}),d&&(0,q.jsxs)(`div`,{className:`alert-success`,style:{display:`flex`,alignItems:`center`,gap:`0.75rem`},children:[(0,q.jsx)(jn,{size:20,style:{color:`#059669`}}),(0,q.jsx)(`span`,{children:d})]}),(ne||F)&&(0,q.jsx)(`div`,{className:`card`,style:{background:`#fef2f2`,border:`2px solid #ef4444`,padding:`1rem 1.2rem`},children:(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,flexWrap:`wrap`,gap:`0.75rem`},children:[(0,q.jsxs)(`div`,{style:{flex:`1 1 280px`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,color:`#991b1b`,fontWeight:900,fontSize:`0.96rem`,marginBottom:4},children:[(0,q.jsx)(ri,{size:20,style:{color:`#dc2626`,flexShrink:0}}),(0,q.jsxs)(`span`,{children:[`تنبيه هام: يلزم تحديث كود Google Apps Script إلى الإصدار 10 (v10)`,re?` — النسخة الحية الآن: v${re}`:``,` لتوحيد الأعمدة و Pivot Tables`]})]}),(0,q.jsxs)(`div`,{style:{fontSize:`0.8rem`,color:`#7f1d1d`,lineHeight:1.65},children:[`لضمان توحيد العمود `,(0,q.jsx)(`strong`,{children:`E = المنطقة / المكان`}),` قبل العمود `,(0,q.jsx)(`strong`,{children:`F = المدينة / المحافظة`}),` واستنساخ أوراق و Pivot Tables الأدمن لكل شيت ببياناته الخاصة: انسخ الكود الجديد (v10) ← الصقه في `,(0,q.jsx)(`strong`,{children:`Extensions ← Apps Script`}),` (شيت الأدمن المركزي) ← `,(0,q.jsx)(`strong`,{children:`Deploy ← Manage deployments ← Edit ← Version: New version ← Deploy`}),` ثم اضغط «إصلاح الأعمدة وتلوين الشيت الآن».`]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.5rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>{P(),T(!0)},className:`btn-clay btn-primary btn-sm`,style:{fontWeight:800,background:`#dc2626`,borderColor:`#b91c1c`},children:[b?(0,q.jsx)(yn,{size:15}):(0,q.jsx)(Vn,{size:15}),b?`تم نسخ كود v10!`:`نسخ كود Apps Script v10 📋`]}),(0,q.jsxs)(`button`,{type:`button`,onClick:ve,disabled:ae,className:`btn-clay btn-secondary btn-sm`,style:{fontWeight:800},children:[(0,q.jsx)(Lr,{size:15,className:ae?`animate-spin`:``}),ae?`جارِ الإصلاح...`:`إصلاح الأعمدة وتلوين الشيت الآن 🛠️`]})]})]})}),te.length>0&&(0,q.jsxs)(`div`,{className:`card`,style:{background:`#fffbeb`,border:`1.5px solid #f59e0b`,padding:`0.95rem 1.15rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,gap:`0.5rem`,flexWrap:`wrap`,marginBottom:`0.55rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,color:`#92400e`,fontWeight:900,fontSize:`0.92rem`},children:[(0,q.jsx)(ri,{size:19,style:{color:`#d97706`,flexShrink:0}}),(0,q.jsxs)(`span`,{children:[`تنبيه: تم تخطي رفع (`,te.length,`) فواتير مكررة موجودة مسبقاً في كوكل شيت (لم يُعد رفعها)`]})]}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>{G.clearSkippedSheetDuplicateNotices(),D([])},className:`btn-clay btn-secondary btn-sm`,style:{fontSize:`0.74rem`,padding:`0.25rem 0.65rem`},children:`إخفاء التنبيه`})]}),(0,q.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.35rem`},children:te.map((e,t)=>(0,q.jsxs)(`div`,{style:{fontSize:`0.8rem`,color:`#78350f`,background:`rgba(255,255,255,0.75)`,padding:`0.45rem 0.7rem`,borderRadius:8,border:`1px solid #fde68a`},children:[`• فاتورة رقم `,(0,q.jsx)(`strong`,{children:e.invoice_number||`بدون رقم`}),` — `,(0,q.jsx)(`strong`,{children:e.pharmacy_name||`صيدلية`}),` (`,e.invoice_date||`—`,`): `,e.reason]},e.id||t))})]}),I.length>0&&(0,q.jsxs)(`div`,{className:`card`,style:{background:`#fef2f2`,border:`1.5px solid #f87171`,padding:`1rem 1.2rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.55rem`,marginBottom:`0.75rem`,color:`#991b1b`,fontWeight:900},children:[(0,q.jsx)(ri,{size:20,style:{color:`#dc2626`,flexShrink:0}}),(0,q.jsxs)(`span`,{children:[`تم رصد (`,I.length,`) نسخ مكررة في سجل كوكل شيت — احذف الفاتورة المكررة بالكامل بضغطة واحدة:`]})]}),(0,q.jsx)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.6rem`},children:I.map(e=>(0,q.jsxs)(`div`,{style:{background:`#ffffff`,border:`1px solid #fecaca`,borderRadius:12,padding:`0.75rem 0.95rem`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`0.65rem`},children:[(0,q.jsxs)(`div`,{style:{minWidth:0,flex:`1 1 220px`},children:[(0,q.jsxs)(`div`,{style:{fontWeight:900,fontSize:`0.9rem`,color:`#991b1b`},children:[`⚠️ فاتورة مكررة #`,e.invoice_number,` — `,e.pharmacy_name||`صيدلية`]}),(0,q.jsxs)(`div`,{style:{fontSize:`0.78rem`,color:`#475569`,marginTop:2,lineHeight:1.45},children:[`التاريخ: `,(0,q.jsx)(`strong`,{children:e.invoice_date||`—`}),` • عدد المواد: `,(0,q.jsx)(`strong`,{children:e.rowsCount}),` • الإجمالي: `,(0,q.jsxs)(`strong`,{children:[e.totalAmount.toLocaleString(),` د.ع`]})]}),(0,q.jsxs)(`div`,{style:{fontSize:`0.74rem`,color:`#64748b`,marginTop:2},children:[`المكونات: `,e.productsSummary]})]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>Ce(e),disabled:s===e.key,className:`btn-clay btn-danger btn-sm`,style:{background:`#dc2626`,color:`white`,fontWeight:800,padding:`0.55rem 0.95rem`,width:`auto`},children:[(0,q.jsx)($r,{size:15}),s===e.key?`جارِ الحذف...`:`حذف الفاتورة المكررة بالكامل (${e.rowsCount} أصناف)`]})]},e.key))})]}),j&&(0,q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`0.75rem`},children:[(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(180px, 1fr))`,gap:`0.75rem`},children:[(0,q.jsxs)(`div`,{className:`card`,style:{padding:`0.85rem 1rem`,display:`flex`,alignItems:`center`,gap:`0.75rem`},children:[(0,q.jsx)(Un,{size:24,style:{color:`var(--primary)`}}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.72rem`,color:`var(--gray-500)`,fontWeight:700},children:`فواتير النظام المسجلة`}),(0,q.jsxs)(`div`,{style:{fontSize:`1.25rem`,fontWeight:900,color:`var(--gray-800)`},children:[j.system_invoices_count,` `,(0,q.jsx)(`span`,{style:{fontSize:`0.75rem`,fontWeight:600},children:`فاتورة`})]})]})]}),(0,q.jsxs)(`div`,{className:`card`,style:{padding:`0.85rem 1rem`,display:`flex`,alignItems:`center`,gap:`0.75rem`},children:[(0,q.jsx)(tr,{size:24,style:{color:`#10b981`}}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.72rem`,color:`var(--gray-500)`,fontWeight:700},children:`فواتير كوكل شيت`}),(0,q.jsxs)(`div`,{style:{fontSize:`1.25rem`,fontWeight:900,color:`#047857`},children:[j.sheet_unique_invoices_count,` `,(0,q.jsxs)(`span`,{style:{fontSize:`0.75rem`,fontWeight:600},children:[`فاتورة (`,j.sheet_rows_count,` سطراً)`]})]})]})]}),(0,q.jsxs)(`div`,{className:`card`,style:{padding:`0.85rem 1rem`,display:`flex`,alignItems:`center`,gap:`0.75rem`,background:j.unuploaded_count>0?`#fffbeb`:`#f0fdf4`,borderColor:j.unuploaded_count>0?`#fde68a`:`#bbf7d0`},children:[(0,q.jsx)(zn,{size:24,style:{color:j.unuploaded_count>0?`#d97706`:`#16a34a`}}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.72rem`,color:j.unuploaded_count>0?`#92400e`:`#15803d`,fontWeight:700},children:`فواتير غير مرفوعة (فجوة)`}),(0,q.jsxs)(`div`,{style:{fontSize:`1.25rem`,fontWeight:900,color:j.unuploaded_count>0?`#b45309`:`#16a34a`},children:[j.unuploaded_count,` `,(0,q.jsx)(`span`,{style:{fontSize:`0.75rem`,fontWeight:600},children:j.unuploaded_count===0?`✅ لا توجد فجوة`:`معلقة`})]})]})]}),(0,q.jsxs)(`div`,{className:`card`,style:{padding:`0.85rem 1rem`,display:`flex`,alignItems:`center`,gap:`0.75rem`},children:[(0,q.jsx)(Ln,{size:24,style:{color:`#0284c7`}}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.72rem`,color:`var(--gray-500)`,fontWeight:700},children:`فواتير بالشيت غير مسجلة`}),(0,q.jsxs)(`div`,{style:{fontSize:`1.25rem`,fontWeight:900,color:`#0369a1`},children:[j.missing_in_system_count,` `,(0,q.jsx)(`span`,{style:{fontSize:`0.75rem`,fontWeight:600},children:`فاتورة`})]})]})]})]}),j.missing_in_system_count>0&&(0,q.jsxs)(`div`,{style:{background:`#f0f9ff`,border:`1px solid #bae6fd`,borderRadius:12,padding:`0.85rem 1.25rem`,display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`0.75rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.65rem`},children:[(0,q.jsx)(Ln,{size:22,style:{color:`#0284c7`,flexShrink:0}}),(0,q.jsx)(`div`,{children:(0,q.jsxs)(`div`,{style:{fontWeight:800,fontSize:`0.9rem`,color:`#0369a1`},children:[`فواتير في كوكل شيت غير مسجلة في المنصة: يوجد `,j.missing_in_system_count,` فواتير.`]})})]}),(0,q.jsxs)(`button`,{onClick:_e,disabled:fe||r,className:`btn-clay btn-secondary`,style:{fontWeight:800,padding:`0.5rem 1.25rem`},children:[(0,q.jsx)(Ln,{size:16,className:fe?`animate-spin`:``}),fe?`جارِ الاستيراد...`:`📥 استيراد إلى النظام (${j.missing_in_system_count})`]})]})]}),(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(260px, 1fr))`,gap:`1rem`},children:[(0,q.jsxs)(`div`,{className:`card`,style:{padding:`1.25rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`0.75rem`},children:[(0,q.jsxs)(`h5`,{style:{fontWeight:800,margin:0,display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,q.jsx)(Ur,{size:18,style:{color:`var(--primary)`}}),`رابط المزامنة التلقائية (Apps Script Webhook)`]}),(0,q.jsx)(`span`,{className:`badge ${h?.is_connected?`badge-success`:`badge-gray`}`,style:{fontSize:`0.75rem`},children:h?.is_connected?`🟢 متصل`:`⚪ غير مفعل`})]}),(0,q.jsxs)(`form`,{onSubmit:N,style:{display:`flex`,gap:`0.5rem`,flexWrap:`wrap`},children:[(0,q.jsx)(`input`,{type:`url`,className:`clay-input`,style:{flex:`1 1 200px`,fontSize:`0.82rem`,direction:`ltr`},placeholder:`https://script.google.com/macros/s/.../exec`,value:v,onChange:e=>y(e.target.value)}),(0,q.jsx)(`button`,{type:`submit`,disabled:a,className:`btn-clay btn-primary btn-sm`,style:{padding:`0.5rem 1rem`,fontWeight:700},children:a?`حفظ...`:`حفظ الرابط`})]}),(0,q.jsx)(`div`,{style:{marginTop:`0.75rem`},children:(0,q.jsx)(`button`,{type:`button`,onClick:()=>T(!w),style:{background:`none`,border:`none`,color:`var(--primary)`,cursor:`pointer`,fontSize:`0.8rem`,fontWeight:700,padding:0},children:w?`▼ إخفاء كود Apps Script المحدّث`:`► عرض كود Apps Script المحدّث (لتفعيل الحذف والتعديل الكامل في الشيت)`})})]}),(0,q.jsxs)(`div`,{className:`card`,style:{padding:`1.25rem`,display:`flex`,flexDirection:`column`,justifyContent:`space-between`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`h5`,{style:{fontWeight:800,margin:`0 0 0.75rem 0`,display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,q.jsx)(Yr,{size:18,style:{color:`#10b981`}}),`إحصائيات بيانات كوكل شيت (`,xe.length,` أعمدة)`]}),(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(80px, 1fr))`,gap:`0.75rem`,textAlign:`center`},children:[(0,q.jsxs)(`div`,{style:{background:`var(--gray-50)`,padding:`0.6rem`,borderRadius:10},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.72rem`,color:`var(--gray-400)`,display:`block`},children:`عدد الأسطر`}),(0,q.jsx)(`span`,{style:{fontWeight:800,fontSize:`1.2rem`,color:`var(--gray-800)`},children:be.length})]}),(0,q.jsxs)(`div`,{style:{background:`var(--gray-50)`,padding:`0.6rem`,borderRadius:10},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.72rem`,color:`var(--gray-400)`,display:`block`},children:`إجمالي القطع`}),(0,q.jsx)(`span`,{style:{fontWeight:800,fontSize:`1.2rem`,color:`var(--primary)`},children:L})]}),(0,q.jsxs)(`div`,{style:{background:`var(--gray-50)`,padding:`0.6rem`,borderRadius:10},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.72rem`,color:`var(--gray-400)`,display:`block`},children:`إجمالي البونص`}),(0,q.jsxs)(`span`,{style:{fontWeight:800,fontSize:`1.2rem`,color:`var(--warning)`},children:[`+`,De]})]})]})]}),(0,q.jsxs)(`div`,{style:{marginTop:`0.75rem`,paddingTop:`0.75rem`,borderTop:`1px solid var(--gray-200)`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.82rem`,color:`var(--gray-600)`,fontWeight:700},children:`إجمالي مبيعات الشيت:`}),(0,q.jsxs)(`span`,{style:{fontWeight:900,fontSize:`1.15rem`,color:`#059669`},children:[Ee.toLocaleString(),` `,(0,q.jsx)(`span`,{style:{fontSize:`0.75rem`},children:`د.ع`})]})]})]})]}),w&&(0,q.jsxs)(`div`,{className:`card`,style:{background:`#f8fafc`,border:`1px solid #cbd5e1`,padding:`1.25rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`0.75rem`,flexWrap:`wrap`,gap:`0.5rem`},children:[(0,q.jsxs)(`h5`,{style:{fontWeight:800,margin:0,color:`#1e293b`,display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,q.jsx)(qr,{size:18,style:{color:`var(--primary)`}}),`كود الربط التلقائي المحدّث (يدعم الاستبدال والحذف والاعتماد وملاءمة الأعمدة)`]}),(0,q.jsxs)(`button`,{onClick:P,className:`btn-clay btn-secondary btn-sm`,style:{display:`flex`,alignItems:`center`,gap:`0.4rem`,fontWeight:700},children:[b?(0,q.jsx)(yn,{size:14,style:{color:`#059669`}}):(0,q.jsx)(Vn,{size:14}),b?`تم النسخ بنجاح!`:`نسخ الكود بالكامل`]})]}),(0,q.jsxs)(`ol`,{style:{fontSize:`0.82rem`,color:`#475569`,lineHeight:1.85,paddingRight:`1.25rem`,margin:`0 0 1rem 0`},children:[(0,q.jsxs)(`li`,{children:[`من كوكل شيت افتح `,(0,q.jsx)(`strong`,{children:`Extensions ← Apps Script`}),` والصق الكود ثم اضغط حفظ.`]}),(0,q.jsxs)(`li`,{children:[`لتحديث النشر دون تغيير الرابط: `,(0,q.jsx)(`strong`,{children:`Deploy ← Manage deployments ← Edit ← Version: New version ← Deploy`}),`.`]})]}),(0,q.jsx)(`pre`,{style:{background:`#0f172a`,color:`#38bdf8`,padding:`1rem`,borderRadius:10,fontSize:`0.75rem`,maxHeight:220,overflowY:`auto`,direction:`ltr`,textAlign:`left`,fontFamily:`Consolas, Monaco, monospace`},children:h?.apps_script_code&&h.apps_script_code.includes(`SCRIPT_VERSION`)?h.apps_script_code:`var SPREADSHEET_ID = '1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE';
var ADMIN_USERS_SHEET_ID = '1_CBGFeFrTaw6L_7U1ztdAZ3gJjjVMEpUhE8oyUn-NjI';
var SCRIPT_VERSION = 10;
var TEMPLATE_SYNC_GUARD = false;

var DATA_COL_KEYS = [
  'invoice_number', 'invoice_date', 'warehouse_name', 'pharmacy_name',
  'area', 'city', 'product_name', 'dosage_form',
  'quantity', 'unit_price', 'bonus_quantity', 'line_total',
  'total_invoice', 'rep_name', 'status', 'timestamp', 'loyalty'
];

function extractSheetIdFromUrl(val) {
  var s = String(val || '').trim();
  if (!s) return '';
  var m = s.match(/\\/spreadsheets\\/d\\/([a-zA-Z0-9-_]+)/);
  if (m && m[1]) return m[1];
  if (/^[a-zA-Z0-9-_]{20,}$/.test(s)) return s;
  return '';
}

function getTargetSpreadsheet(customSpreadsheetId) {
  var targetId = extractSheetIdFromUrl(customSpreadsheetId) || String(customSpreadsheetId || '').trim();
  if (targetId && targetId !== SPREADSHEET_ID) {
    try {
      var opened = SpreadsheetApp.openById(targetId);
      if (opened) return opened;
    } catch (e) {}
  }
  try {
    var ssDefault = SpreadsheetApp.openById(targetId || SPREADSHEET_ID);
    if (ssDefault) return ssDefault;
  } catch (e2) {}
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e3) {}
  return null;
}

function sheetHasPivotTables(sheet) {
  try {
    return Boolean(sheet && typeof sheet.getPivotTables === 'function' && sheet.getPivotTables().length > 0);
  } catch (e) {
    return false;
  }
}

function isUsersSheetObj(sheet) {
  if (!sheet) return false;
  try {
    var parentId = sheet.getParent().getId();
    if (parentId === ADMIN_USERS_SHEET_ID) return true;
  } catch (e) {}
  var name = String(sheet.getName() || '').trim();
  if (name === 'المستخدمون' || name.toLowerCase() === 'users') return true;
  try {
    if (sheet.getLastRow() > 0) {
      var row1 = sheet.getRange(1, 1, 1, Math.min(4, Math.max(1, sheet.getLastColumn()))).getValues()[0];
      var a = normAr(row1[0]);
      var b = normAr(row1[1]);
      if ((a.indexOf('الاسم') !== -1 && b.indexOf('الرمز') !== -1) || (a === 'id' && b.indexOf('full_name') !== -1)) {
        return true;
      }
    }
  } catch (e2) {}
  return false;
}

function findInvoiceDataSheet(ss, preferredName) {
  if (!ss) return null;
  var pref = String(preferredName || '').trim();
  if (pref && pref !== 'الفواتير') {
    var named = ss.getSheetByName(pref);
    if (named && !isUsersSheetObj(named) && !sheetHasPivotTables(named)) return named;
  }
  var candidates = ['الفواتير', 'Sheet1', 'الورقة1', 'المبيعات'];
  for (var c = 0; c < candidates.length; c++) {
    var cs = ss.getSheetByName(candidates[c]);
    if (cs && !isUsersSheetObj(cs) && !sheetHasPivotTables(cs)) return cs;
  }
  var all = ss.getSheets();
  for (var i = 0; i < all.length; i++) {
    var s = all[i];
    if (isUsersSheetObj(s) || sheetHasPivotTables(s)) continue;
    try {
      if (s.getLastRow() > 0) {
        var r1 = s.getRange(1, 1, 1, Math.min(6, Math.max(1, s.getLastColumn()))).getValues()[0];
        for (var k = 0; k < r1.length; k++) {
          var hk = normAr(r1[k]);
          if (hk.indexOf('رقم الفاتور') !== -1 || hk.indexOf('اسم الصيدلي') !== -1) return s;
        }
      }
    } catch (e) {}
  }
  for (var j = 0; j < all.length; j++) {
    if (!isUsersSheetObj(all[j]) && !sheetHasPivotTables(all[j])) return all[j];
  }
  return null;
}

function getTargetSheet(customSpreadsheetId, preferredSheetName) {
  var ss = getTargetSpreadsheet(customSpreadsheetId);
  if (!ss) return null;
  return findInvoiceDataSheet(ss, preferredSheetName);
}

function getOrCreateUsersSheet(adminSpreadsheetId) {
  var targetId = extractSheetIdFromUrl(adminSpreadsheetId) || String(adminSpreadsheetId || ADMIN_USERS_SHEET_ID).trim();
  var ss = null;
  if (targetId) {
    try { ss = SpreadsheetApp.openById(targetId); } catch (e) {}
  }
  if (!ss) ss = getTargetSpreadsheet('');
  if (!ss) return null;

  var allSheets = ss.getSheets();
  for (var s = 0; s < allSheets.length; s++) {
    var cand = allSheets[s];
    if (cand.getLastRow() > 0) {
      var r1 = cand.getRange(1, 1, 1, Math.min(4, Math.max(1, cand.getLastColumn()))).getValues()[0];
      var c0 = normAr(r1[0]);
      var c1 = normAr(r1[1]);
      if (c0.indexOf('الاسم') !== -1 || c1.indexOf('الرمز') !== -1 || c0 === 'id') {
        return cand;
      }
    }
  }

  var sheet = ss.getSheetByName('المستخدمون') || ss.getSheets()[0];
  if (!sheet) sheet = ss.insertSheet('المستخدمون');
  if (sheet.getLastRow() === 0) {
    var masterHeaders = ['الاسم', 'الرمز السري', 'صفحة كوكل شيت', 'اي بي اي سكربت', 'اي بي اي جمناي'];
    sheet.appendRow(masterHeaders);
    sheet.getRange(1, 1, 1, masterHeaders.length).setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
  }
  return sheet;
}

function resolveUserColMap(headers) {
  var norm = [];
  for (var i = 0; i < headers.length; i++) norm.push(normAr(headers[i]));
  var findIdx = function(patterns) {
    for (var c = 0; c < norm.length; c++) {
      if (!norm[c]) continue;
      for (var p = 0; p < patterns.length; p++) {
        if (norm[c].indexOf(patterns[p]) !== -1) return c;
      }
    }
    return -1;
  };
  var isLegacy = norm[0] === 'id' || (norm[0] && norm[0].indexOf('معرف') !== -1);
  if (!isLegacy) {
    return {
      isLegacy: false,
      nameCol: findIdx(['الاسم', 'full_name', 'name']) >= 0 ? findIdx(['الاسم', 'full_name', 'name']) : 0,
      passCol: findIdx(['الرمز السري', 'كلمه المرور', 'الرمز', 'password', 'pin']) >= 0 ? findIdx(['الرمز السري', 'كلمه المرور', 'الرمز', 'password', 'pin']) : 1,
      sheetCol: findIdx(['صفحه كوكل شيت', 'شيت', 'sheet']) >= 0 ? findIdx(['صفحه كوكل شيت', 'شيت', 'sheet']) : 2,
      webhookCol: findIdx(['اي بي اي سكربت', 'سكربت', 'webhook', 'script']) >= 0 ? findIdx(['اي بي اي سكربت', 'سكربت', 'webhook', 'script']) : 3,
      emailCol: findIdx(['email', 'بريد', 'username']),
      idCol: findIdx(['معرف']),
      roleCol: findIdx(['role', 'دور', 'صلاحيه']),
      activeCol: findIdx(['is_active', 'الحاله']),
      geminiCol: findIdx(['اي بي اي جمناي', 'مفتاح جمناي', 'جمناي', 'gemini', 'مفتاح'])
    };
  }
  return {
    isLegacy: true, idCol: 0, nameCol: 1, emailCol: 2, passCol: 3,
    roleCol: 4, activeCol: 5, geminiCol: 6, sheetCol: 7, webhookCol: 8
  };
}

function ensureMasterGeminiColumn(usersSheet, forcedColZeroIdx) {
  if (!usersSheet) return 4;
  var lastCol = Math.max(4, usersSheet.getLastColumn());
  var headers = usersSheet.getLastRow() > 0 ? usersSheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  var uMap = resolveUserColMap(headers);
  if (uMap.geminiCol >= 0) return uMap.geminiCol;
  var targetCol = (forcedColZeroIdx !== undefined && forcedColZeroIdx >= 4) ? forcedColZeroIdx : 4;
  for (var gc = 4; gc < headers.length; gc++) {
    if (!String(headers[gc] || '').trim()) { targetCol = gc; break; }
    if (gc === headers.length - 1 && String(headers[gc] || '').trim()) { targetCol = headers.length; }
  }
  if (targetCol < 4) targetCol = 4;
  try {
    usersSheet.getRange(1, targetCol + 1).setValue('اي بي اي جمناي').setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
  } catch (e) {}
  return targetCol;
}

function propagateGeminiKeyToAllUserRows(usersSheet, targetGemCol, gemKeyVal) {
  if (!usersSheet) return;
  var lastRow = usersSheet.getLastRow();
  var lastCol = Math.max(4, usersSheet.getLastColumn());
  var headers = lastRow > 0 ? usersSheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  var uMap = resolveUserColMap(headers);
  for (var gr = 2; gr <= lastRow; gr++) {
    var rowNameG = String(usersSheet.getRange(gr, uMap.nameCol + 1).getValue() || '').trim();
    if (rowNameG) {
      usersSheet.getRange(gr, targetGemCol + 1).setValue(gemKeyVal);
    }
  }
}

function isBaqerName(name, email) {
  var n = normAr(name).replace(/^(د\\.|دكتور)\\s+/i, '').trim();
  var e = String(email || '').trim().toLowerCase();
  return n === 'باقر' || n === 'باقر علي' || n.indexOf('باقر ') === 0 || n === 'baqer' || n === 'baqir' || e === 'baqer@pharma.com' || e === 'admin@pharma.com';
}

function readAllSheetUsers(sheet) {
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var uMap = resolveUserColMap(headers);
  var users = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var fullName = String(row[uMap.nameCol] || '').trim();
    var emailVal = uMap.emailCol >= 0 ? String(row[uMap.emailCol] || '').trim().toLowerCase() : '';
    var idVal = uMap.idCol >= 0 ? String(row[uMap.idCol] || '').trim() : '';
    if (!fullName && !emailVal) continue;
    var nCheck = normAr(fullName);
    if (nCheck === 'الاسم' || nCheck === 'full_name' || idVal.toLowerCase() === 'id') continue;
    var role = isBaqerName(fullName, emailVal) ? 'admin' : 'medical_rep';
    var activeRaw = uMap.activeCol >= 0 ? String(row[uMap.activeCol] === undefined ? 'TRUE' : row[uMap.activeCol]).trim().toUpperCase() : 'TRUE';
    if (activeRaw === 'FALSE' || activeRaw === '0' || activeRaw === 'معطل') continue;
    var rawGem = uMap.geminiCol >= 0 ? String(row[uMap.geminiCol] || '').trim() : '';
    if (!rawGem) {
      for (var c = 4; c < row.length; c++) {
        var cv = String(row[c] || '').trim();
        if (/^(AIza|AQ\\.)/.test(cv)) { rawGem = cv; break; }
      }
    }
    users.push({
      rowNumber: i + 1,
      id: idVal || ('sheet-usr-' + (i + 1)),
      full_name: fullName || emailVal.split('@')[0],
      email: emailVal || (fullName.toLowerCase().replace(/\\s+/g, '_') + '@pharma.com'),
      password_hash: String(row[uMap.passCol] || '').trim(),
      role: role,
      is_active: true,
      gemini_api_key: rawGem,
      sheet_id: String(row[uMap.sheetCol] || '').trim(),
      webhook_url: String(row[uMap.webhookCol] || '').trim()
    });
  }
  return users;
}

function getExpectedCols(sheet) {
  var headers = [
    'رقم الفاتورة',
    'تاريخ الفاتورة',
    'اسم المذخر',
    'اسم الصيدلية',
    'المنطقة / المكان',
    'المدينة / المحافظة',
    'اسم المادة الدوائية',
    'نوع المادة / الشكل الدوائي',
    'الكمية',
    'سعر المفرد (د.ع)',
    'البونص المجاني',
    'المجموع (د.ع)',
    'صافي الفاتورة الكلي (د.ع)',
    'اسم المندوب العلمي',
    'حالة الاعتماد',
    'وقت وتاريخ الإدراج'
  ];
  if (sheet && sheet.getLastRow() > 0 && sheet.getLastColumn() > 16) {
    var existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    for (var c = 16; c < existing.length; c++) {
      var label = String(existing[c] || '').trim();
      if (label) headers.push(label);
    }
  }
  return headers;
}

function normAr(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[\\u064B-\\u0652\\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\\s+/g, ' ')
    .trim();
}

function normPh(s) {
  return normAr(s).replace(/^(صيدلية|صيدليه|مذخر|ص\\.?)\\s+/gi, '').trim();
}

function normProd(s) {
  return normAr(s).replace(/[^a-z0-9\\u0621-\\u064a]/gi, '');
}

function formatYmd(val) {
  if (!val) return '';
  if (val instanceof Date) {
    try { return Utilities.formatDate(val, 'Asia/Baghdad', 'yyyy-MM-dd'); } catch (e) {}
  }
  var s = String(val).trim();
  var m = s.match(/^(\\d{4})[-/](\\d{1,2})[-/](\\d{1,2})/);
  if (m) return m[1] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[3]).slice(-2);
  var us = s.match(/^(\\d{1,2})[/-](\\d{1,2})[/-](\\d{4})$/);
  if (us) {
    var p1 = Number(us[1]), p2 = Number(us[2]);
    var mo = p1 > 12 ? p2 : p1;
    var dy = p1 > 12 ? p1 : p2;
    return us[3] + '-' + ('0' + mo).slice(-2) + '-' + ('0' + dy).slice(-2);
  }
  return s.split('T')[0];
}

function detectDosage(name) {
  var p = String(name || '').toLowerCase();
  if (p.indexOf('drop') !== -1 || p.indexOf('قطرة') !== -1 || p.indexOf('drups') !== -1 || p.indexOf('hyfresh') !== -1 || p.indexOf('loxtra') !== -1) return 'قطرة';
  if (p.indexOf('cream') !== -1 || p.indexOf('كريم') !== -1 || p.indexOf('elica') !== -1 || p.indexOf('fucidin') !== -1) return 'كريم';
  if (p.indexOf('oint') !== -1 || p.indexOf('مرهم') !== -1) return 'مرهم';
  return 'حبوب';
}

function detectAreaFromPh(phName) {
  var s = normAr(phName);
  var areas = [
    ['فلسطين', 'شارع فلسطين'], ['كراده', 'الكرادة'], ['منصور', 'المنصور'],
    ['زعفرانيه', 'الزعفرانية'], ['مدينة الصدر', 'مدينة الصدر'], ['مدينه الصدر', 'مدينة الصدر'],
    ['صدر', 'مدينة الصدر'], ['اعظميه', 'الأعظمية'], ['كاظميه', 'الكاظمية'],
    ['دوره', 'الدورة'], ['بياع', 'البياع'], ['عامريه', 'العامرية'],
    ['غزاليه', 'الغزالية'], ['شعب', 'الشعب'], ['زيونه', 'زيونة'],
    ['بغداد الجديده', 'بغداد الجديدة'], ['جادرية', 'الجادرية'], ['جادريه', 'الجادرية'],
    ['حارثيه', 'الحارثية'], ['سيديه', 'السيدية'], ['بلديات', 'البلديات'],
    ['حبيبيه', 'الحبيبية'], ['يرموك', 'اليرموك'], ['جامعه', 'حي الجامعة'],
    ['حي اور', 'حي أور'], ['مشتل', 'المشتل'], ['غدير', 'الغدير'],
    ['خضراء', 'حي الخضراء'], ['قاهره', 'القاهرة'], ['صليخ', 'الصليخ'],
    ['شعله', 'الشعلة'], ['بسمايه', 'بسماية'], ['محموديه', 'المحمودية'],
    ['مدائن', 'المدائن'], ['ابو غريب', 'أبو غريب'], ['طارميه', 'الطارمية'],
    ['كرخ', 'الكرخ'], ['رصافه', 'الرصافة']
  ];
  for (var i = 0; i < areas.length; i++) {
    if (s.indexOf(areas[i][0]) !== -1) return areas[i][1];
  }
  var slashMatch = String(phName || '').match(/[\\/-]\\s*([^\\n\\r\\/-]{3,25})$/);
  if (slashMatch && slashMatch[1] && slashMatch[1].trim().length >= 3) return slashMatch[1].trim();
  return 'مركز المدينة';
}

function isKnownCityName(val) {
  var v = normAr(val);
  var cities = ['بغداد', 'البصره', 'اربيل', 'النجف', 'كربلاء', 'الموصل', 'نينوى', 'بابل', 'الحله', 'كركوك', 'ديالى', 'الانبار', 'واسط', 'ذي قار', 'ميسان', 'المثنى', 'القادسيه', 'الديوانيه', 'صلاح الدين', 'دهوك', 'السليمانيه'];
  for (var i = 0; i < cities.length; i++) {
    if (v === cities[i]) return true;
  }
  return false;
}

function isShiftedOldRow(row) {
  var c4 = String(row[4] || '').trim();
  var c5 = String(row[5] || '').trim();
  var c6Num = Number(row[6]);
  var c13 = String(row[13] || '').trim();
  var c14 = String(row[14] || '').trim();
  if (row.length < 16) return true;
  if (c5 !== '' && !isNaN(c6Num) && c6Num > 0 && c13 && c13.indexOf(':') !== -1 && !c14 && !String(row[15] || '').trim()) return true;
  if (isKnownCityName(c4) && !isNaN(c6Num) && c6Num > 0 && c5 !== '' && isNaN(Number(c5)) && !c14 && !String(row[15] || '').trim()) return true;
  return false;
}

function resolveColMap(headers) {
  var hasArea = false;
  var hasDosage = false;
  for (var k = 0; k < headers.length; k++) {
    var hk = normAr(headers[k]);
    if (hk.indexOf('المنطق') !== -1 || hk.indexOf('المكان') !== -1) hasArea = true;
    if (hk.indexOf('نوع الماد') !== -1 || hk.indexOf('الشكل الدوائي') !== -1) hasDosage = true;
  }
  var map = {
    invoice_number: 0, invoice_date: 1, warehouse_name: 2, pharmacy_name: 3,
    area: hasArea ? 4 : -1,
    city: hasArea ? 5 : 4,
    product_name: hasArea ? 6 : 5,
    dosage_form: hasDosage ? 7 : -1,
    quantity: (hasArea && hasDosage) ? 8 : 6,
    unit_price: (hasArea && hasDosage) ? 9 : 7,
    bonus_quantity: (hasArea && hasDosage) ? 10 : 8,
    line_total: (hasArea && hasDosage) ? 11 : 9,
    total_invoice: (hasArea && hasDosage) ? 12 : 10,
    rep_name: (hasArea && hasDosage) ? 13 : 11,
    status: (hasArea && hasDosage) ? 14 : 12,
    timestamp: (hasArea && hasDosage) ? 15 : 13,
    loyalty: (hasArea && hasDosage) ? 16 : 14
  };
  for (var c = 0; c < headers.length; c++) {
    var h = normAr(headers[c]);
    if (!h) continue;
    if (h.indexOf('رقم الفاتور') !== -1) map.invoice_number = c;
    else if (h.indexOf('تاريخ الفاتور') !== -1) map.invoice_date = c;
    else if (h.indexOf('المذخر') !== -1) map.warehouse_name = c;
    else if (h.indexOf('اسم الصيدلي') !== -1) map.pharmacy_name = c;
    else if (h.indexOf('المنطق') !== -1 || h.indexOf('المكان') !== -1) map.area = c;
    else if (h.indexOf('المدين') !== -1 || h.indexOf('المحافظ') !== -1) map.city = c;
    else if (h.indexOf('اسم الماد') !== -1 || h.indexOf('الماده الدوائي') !== -1) map.product_name = c;
    else if (h.indexOf('نوع الماد') !== -1 || h.indexOf('الشكل الدوائي') !== -1) map.dosage_form = c;
    else if (h === 'الكميه' || h.indexOf('الكمي') !== -1) map.quantity = c;
    else if (h.indexOf('سعر المفرد') !== -1) map.unit_price = c;
    else if (h.indexOf('البونص') !== -1) map.bonus_quantity = c;
    else if (h.indexOf('صافي الفاتور') !== -1) map.total_invoice = c;
    else if (h.indexOf('المجموع') !== -1) map.line_total = c;
    else if (h.indexOf('المندوب') !== -1) map.rep_name = c;
    else if (h.indexOf('حاله الاعتماد') !== -1 || h.indexOf('الحال') !== -1) map.status = c;
    else if (h.indexOf('وقت وتاريخ') !== -1 || h.indexOf('الادراج') !== -1) map.timestamp = c;
    else if (h.indexOf('الولاء') !== -1) map.loyalty = c;
  }
  return map;
}

function buildRowValuesByHeaders(r, headers, existingRow) {
  var totalCols = headers.length;
  var vals = [];
  for (var c = 0; c < totalCols; c++) {
    vals.push(existingRow && existingRow[c] !== undefined ? existingRow[c] : '');
  }
  var colMap = resolveColMap(headers);
  var invNum = String(r.invoice_number || '').trim();
  var phName = String(r.pharmacy_name || (existingRow ? existingRow[colMap.pharmacy_name] : '') || '').trim();
  var resolvedCity = String(r.city || r.pharmacy_city || (existingRow && colMap.city >= 0 ? existingRow[colMap.city] : '') || 'بغداد').trim();
  var resolvedArea = String(r.area || r.pharmacy_area || '').trim();
  if (!resolvedArea && existingRow && colMap.area >= 0) {
    var oldArea = String(existingRow[colMap.area] || '').trim();
    if (oldArea && !isKnownCityName(oldArea)) resolvedArea = oldArea;
  }
  if (!resolvedArea || resolvedArea === 'مركز المدينة') {
    var guessed = detectAreaFromPh(phName);
    if (!resolvedArea || (guessed && guessed !== 'مركز المدينة')) resolvedArea = guessed;
  }
  var prodName = String(r.product_name || (existingRow ? existingRow[colMap.product_name] : '') || '').trim();
  var repName = String(r.rep_name || (existingRow ? existingRow[colMap.rep_name] : '') || 'مندوب علمي').trim();

  vals[colMap.invoice_number] = invNum;
  vals[colMap.invoice_date]   = formatYmd(r.invoice_date);
  vals[colMap.warehouse_name] = r.warehouse_name || (existingRow ? existingRow[colMap.warehouse_name] : '') || 'مذخر الشغف الحديث';
  vals[colMap.pharmacy_name]  = phName;
  if (colMap.area >= 0) vals[colMap.area] = resolvedArea;
  if (colMap.city >= 0) vals[colMap.city] = resolvedCity || 'بغداد';
  vals[colMap.product_name]   = prodName;
  if (colMap.dosage_form >= 0) vals[colMap.dosage_form] = r.dosage_form || detectDosage(prodName);
  vals[colMap.quantity]       = Number(r.quantity || 0);
  vals[colMap.unit_price]     = Number(r.unit_price || 0);
  vals[colMap.bonus_quantity] = Number(r.bonus_quantity || 0);
  vals[colMap.line_total]     = Number(r.line_total || 0);
  vals[colMap.total_invoice]  = Number(r.total_invoice || 0);
  vals[colMap.rep_name]       = repName;
  vals[colMap.status]         = r.status || (existingRow ? existingRow[colMap.status] : '') || 'قيد التدقيق';
  vals[colMap.timestamp]      = r.timestamp || (existingRow ? existingRow[colMap.timestamp] : '') || '';
  if (colMap.loyalty >= 0 && colMap.loyalty < totalCols && r.loyalty !== undefined && r.loyalty !== '') {
    vals[colMap.loyalty] = r.loyalty;
  }
  return vals;
}

function setupSheet(sheet) {
  if (!sheet) sheet = getTargetSheet();
  if (!sheet || isUsersSheetObj(sheet) || sheetHasPivotTables(sheet)) return;
  var headers = getExpectedCols(sheet);
  var totalCols = headers.length;
  var lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.appendRow(headers);
  } else {
    var rawData = sheet.getDataRange().getValues();
    var cleanedData = [];
    var needsRewrite = false;
    var currentHeaders = rawData[0] || [];
    var oldMap = resolveColMap(currentHeaders);
    if (
      currentHeaders.length < 16 ||
      String(currentHeaders[4] || '').trim() !== 'المنطقة / المكان' ||
      String(currentHeaders[5] || '').trim() !== 'المدينة / المحافظة' ||
      String(currentHeaders[7] || '').trim() !== 'نوع المادة / الشكل الدوائي'
    ) {
      needsRewrite = true;
    }
    for (var i = 1; i < rawData.length; i++) {
      var row = rawData[i];
      var invNum = String(row[oldMap.invoice_number] !== undefined ? row[oldMap.invoice_number] : (row[0] || '')).trim();
      var phNameCheck = String(row[oldMap.pharmacy_name] !== undefined ? row[oldMap.pharmacy_name] : (row[3] || '')).trim();
      if (invNum === '123' || (!invNum && !phNameCheck && !row[oldMap.product_name])) { needsRewrite = true; continue; }
      if (oldMap.area >= 0 && isShiftedOldRow(row)) {
        needsRewrite = true;
        var phName = String(row[3] || '').trim();
        var cityName = String(row[4] || 'بغداد').trim();
        var prName = String(row[5] || '').trim();
        var qtyVal = Number(row[6] || 0);
        var priceVal = Number(row[7] || 0);
        var bonusVal = Number(row[8] || 0);
        var lineTotalVal = Number(row[9] || (qtyVal * priceVal));
        var totalInvVal = Number(row[10] || lineTotalVal);
        var maybeRep = String(row[11] || '').trim();
        var maybeStatus = String(row[12] || '').trim();
        var maybeTs = String(row[13] || '').trim();
        if (!maybeRep && maybeTs) maybeRep = 'مندوب علمي';
        if (!maybeStatus) maybeStatus = 'قيد التدقيق';
        var rebuilt14 = [invNum, formatYmd(row[1]), String(row[2] || '').trim(), phName, detectAreaFromPh(phName), cityName || 'بغداد', prName, detectDosage(prName), qtyVal, priceVal, bonusVal, lineTotalVal, totalInvVal, maybeRep, maybeStatus, maybeTs];
        while (rebuilt14.length < totalCols) rebuilt14.push(row[rebuilt14.length] !== undefined ? row[rebuilt14.length] : '');
        cleanedData.push(rebuilt14);
      } else {
        var phM = String(row[oldMap.pharmacy_name] || '').trim();
        var cityM = oldMap.city >= 0 ? String(row[oldMap.city] || '').trim() : '';
        var areaM = oldMap.area >= 0 ? String(row[oldMap.area] || '').trim() : '';
        if (isKnownCityName(areaM) && (!cityM || !isKnownCityName(cityM))) {
          var tmp = cityM;
          cityM = areaM;
          areaM = tmp;
          needsRewrite = true;
        } else if (isKnownCityName(areaM) && isKnownCityName(cityM)) {
          areaM = '';
          needsRewrite = true;
        }
        if (!cityM) cityM = 'بغداد';
        if (!areaM || areaM === 'مركز المدينة') {
          var gArea = detectAreaFromPh(phM);
          if (!areaM || (gArea && gArea !== 'مركز المدينة')) areaM = gArea;
        }
        var prodM = String(row[oldMap.product_name] || '').trim();
        var dosM = oldMap.dosage_form >= 0 ? String(row[oldMap.dosage_form] || '').trim() : '';
        if (!dosM) dosM = detectDosage(prodM);
        var mappedRow = [
          invNum,
          formatYmd(row[oldMap.invoice_date]),
          String(row[oldMap.warehouse_name] || '').trim(),
          phM,
          areaM,
          cityM,
          prodM,
          dosM,
          row[oldMap.quantity] !== undefined ? row[oldMap.quantity] : 0,
          row[oldMap.unit_price] !== undefined ? row[oldMap.unit_price] : 0,
          row[oldMap.bonus_quantity] !== undefined ? row[oldMap.bonus_quantity] : 0,
          row[oldMap.line_total] !== undefined ? row[oldMap.line_total] : 0,
          row[oldMap.total_invoice] !== undefined ? row[oldMap.total_invoice] : 0,
          String(row[oldMap.rep_name] || '').trim(),
          String(row[oldMap.status] || 'قيد التدقيق').trim(),
          row[oldMap.timestamp] !== undefined ? row[oldMap.timestamp] : ''
        ];
        for (var ec = 16; ec < totalCols; ec++) {
          mappedRow.push(row[ec] !== undefined ? row[ec] : '');
        }
        cleanedData.push(mappedRow);
      }
    }
    if (needsRewrite) {
      sheet.clear();
      sheet.getRange(1, 1, 1, totalCols).setValues([headers]);
      if (cleanedData.length > 0) sheet.getRange(2, 1, cleanedData.length, totalCols).setValues(cleanedData);
    }
  }
  var headerRange = sheet.getRange(1, 1, 1, totalCols);
  headerRange.setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold').setFontSize(11).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);
  sheet.setRightToLeft(true);
  try {
    sheet.clearConditionalFormatRules();
    highlightDuplicatesInSheet(sheet);
    sheet.autoResizeColumns(1, totalCols);
  } catch (fmtErr) {}

  if (!TEMPLATE_SYNC_GUARD && typeof sheet.getParent === 'function') {
    try {
      var pSs = sheet.getParent();
      if (pSs && pSs.getId && pSs.getId() !== SPREADSHEET_ID && pSs.getId() !== ADMIN_USERS_SHEET_ID && pSs.getSheets().length <= 1) {
        cloneAdminTabsAndPivotsToTarget(pSs.getId());
      }
    } catch (syncAutoErr) {}
  }
}

function getColKeyByIndex(colMap, zeroBasedIdx) {
  for (var i = 0; i < DATA_COL_KEYS.length; i++) {
    var k = DATA_COL_KEYS[i];
    if (colMap[k] === zeroBasedIdx) return k;
  }
  return '';
}

function mapAdminColToRepCol(adminCol1Based, adminColMap, repColMap, tabName, adminHeaders, repHeaders) {
  var zeroIdx = Number(adminCol1Based) - 1;
  var key = getColKeyByIndex(adminColMap, zeroIdx);
  if (key) {
    if (normAr(tabName).indexOf('منطق') !== -1 && key === 'city' && repColMap.area >= 0) {
      return repColMap.area + 1;
    }
    return repColMap[key] >= 0 ? (repColMap[key] + 1) : Number(adminCol1Based);
  }
  if (Array.isArray(adminHeaders) && Array.isArray(repHeaders) && zeroIdx >= 0 && zeroIdx < adminHeaders.length) {
    var srcLabel = normAr(adminHeaders[zeroIdx]);
    if (srcLabel) {
      for (var ri = 0; ri < repHeaders.length; ri++) {
        if (normAr(repHeaders[ri]) === srcLabel) return ri + 1;
      }
    }
  }
  return Number(adminCol1Based);
}

function copySinglePivotTable(pt, targetTab, repSourceRange, adminColMap, repColMap, tabName, adminHeaders, repHeaders) {
  var anchorA1 = 'A1';
  try { anchorA1 = pt.getAnchorCell().getA1Notation(); } catch (e) {}
  var newPt = targetTab.getRange(anchorA1).createPivotTable(repSourceRange);
  var rGroups = typeof pt.getRowGroups === 'function' ? pt.getRowGroups() : [];
  for (var rgIdx = 0; rgIdx < rGroups.length; rgIdx++) {
    var rg = rGroups[rgIdx];
    var targetRCol = mapAdminColToRepCol(rg.getSourceDataColumn(), adminColMap, repColMap, tabName, adminHeaders, repHeaders);
    var newRg = newPt.addRowGroup(targetRCol);
    try { if (typeof rg.totalsAreShown === 'function') newRg.showTotals(rg.totalsAreShown()); } catch (e1) {}
    try { if (typeof rg.areLabelsRepeated === 'function' && rg.areLabelsRepeated()) newRg.showRepeatedLabels(); } catch (e2) {}
    try { if (typeof rg.isSortAscending === 'function') { if (rg.isSortAscending()) newRg.sortAscending(); else newRg.sortDescending(); } } catch (e3) {}
  }
  var cGroups = typeof pt.getColumnGroups === 'function' ? pt.getColumnGroups() : [];
  for (var cgIdx = 0; cgIdx < cGroups.length; cgIdx++) {
    var cg = cGroups[cgIdx];
    var targetCCol = mapAdminColToRepCol(cg.getSourceDataColumn(), adminColMap, repColMap, tabName, adminHeaders, repHeaders);
    var newCg = newPt.addColumnGroup(targetCCol);
    try { if (typeof cg.totalsAreShown === 'function') newCg.showTotals(cg.totalsAreShown()); } catch (e4) {}
    try { if (typeof cg.areLabelsRepeated === 'function' && cg.areLabelsRepeated()) newCg.showRepeatedLabels(); } catch (e5) {}
    try { if (typeof cg.isSortAscending === 'function') { if (cg.isSortAscending()) newCg.sortAscending(); else newCg.sortDescending(); } } catch (e6) {}
  }
  var pVals = typeof pt.getPivotValues === 'function' ? pt.getPivotValues() : [];
  for (var pvIdx = 0; pvIdx < pVals.length; pvIdx++) {
    var pv = pVals[pvIdx];
    var targetVCol = mapAdminColToRepCol(pv.getSourceDataColumn(), adminColMap, repColMap, tabName, adminHeaders, repHeaders);
    var fn = typeof pv.getSummarizedBy === 'function' ? pv.getSummarizedBy() : (SpreadsheetApp.PivotTableSummarizeFunction ? SpreadsheetApp.PivotTableSummarizeFunction.SUM : 'SUM');
    var newPv = newPt.addPivotValue(targetVCol, fn);
    try { var dn = typeof pv.getDisplayName === 'function' ? pv.getDisplayName() : ''; if (dn) newPv.setDisplayName(dn); } catch (e7) {}
    try {
      if (typeof pv.getDisplayType === 'function' && typeof newPv.showAs === 'function') {
        var dispType = pv.getDisplayType();
        if (dispType && String(dispType) !== 'DEFAULT') newPv.showAs(dispType);
      }
    } catch (e7b) {}
  }
  var pFilters = typeof pt.getFilters === 'function' ? pt.getFilters() : [];
  for (var pfIdx = 0; pfIdx < pFilters.length; pfIdx++) {
    var pf = pFilters[pfIdx];
    try {
      var targetFCol = mapAdminColToRepCol(pf.getSourceDataColumn(), adminColMap, repColMap, tabName, adminHeaders, repHeaders);
      var crit = typeof pf.getFilterCriteria === 'function' ? pf.getFilterCriteria() : null;
      if (crit) newPt.addFilter(targetFCol, crit);
    } catch (e8) {}
  }
  return newPt;
}

function ensureSheetMinRows(sheet, minRows) {
  var targetMin = minRows || 1000;
  var curMax = typeof sheet.getMaxRows === 'function' ? sheet.getMaxRows() : Math.max(sheet.getLastRow() + 50, targetMin);
  if (typeof sheet.getMaxRows === 'function' && curMax < targetMin && typeof sheet.insertRowsAfter === 'function' && curMax > 0) {
    try {
      sheet.insertRowsAfter(curMax, targetMin - curMax);
      curMax = sheet.getMaxRows();
    } catch (e) {}
  }
  return Math.max(1, curMax);
}

function fixAdminAreaPivotIfNeeded(adminSs, adminDataSheet) {
  if (!adminSs || !adminDataSheet) return;
  var sheets = adminSs.getSheets();
  var adminHeaders = adminDataSheet.getLastRow() > 0 ? adminDataSheet.getRange(1, 1, 1, Math.max(16, adminDataSheet.getLastColumn())).getValues()[0] : getExpectedCols(adminDataSheet);
  var colMap = resolveColMap(adminHeaders);
  var maxRows = ensureSheetMinRows(adminDataSheet, 1000);
  var srcRange = adminDataSheet.getRange(1, 1, maxRows, adminHeaders.length);
  for (var i = 0; i < sheets.length; i++) {
    var tab = sheets[i];
    if (normAr(tab.getName()).indexOf('منطق') === -1) continue;
    var pts = typeof tab.getPivotTables === 'function' ? tab.getPivotTables() : [];
    if (pts.length === 0) continue;
    var pt0 = pts[0];
    var rGroups = typeof pt0.getRowGroups === 'function' ? pt0.getRowGroups() : [];
    if (rGroups.length > 0 && colMap.area >= 0 && rGroups[0].getSourceDataColumn() !== colMap.area + 1) {
      var anchorA1 = 'A1';
      try { anchorA1 = pt0.getAnchorCell().getA1Notation(); } catch (e) {}
      var colGroups = typeof pt0.getColumnGroups === 'function' ? pt0.getColumnGroups() : [];
      var vals = typeof pt0.getPivotValues === 'function' ? pt0.getPivotValues() : [];
      var filts = typeof pt0.getFilters === 'function' ? pt0.getFilters() : [];
      var snapRg = [];
      for (var ri = 0; ri < rGroups.length; ri++) {
        snapRg.push({
          col: mapAdminColToRepCol(rGroups[ri].getSourceDataColumn(), colMap, colMap, tab.getName()),
          totals: typeof rGroups[ri].totalsAreShown === 'function' ? rGroups[ri].totalsAreShown() : true,
          repeat: typeof rGroups[ri].areLabelsRepeated === 'function' ? rGroups[ri].areLabelsRepeated() : false,
          sortAsc: typeof rGroups[ri].isSortAscending === 'function' ? rGroups[ri].isSortAscending() : null
        });
      }
      var snapCg = [];
      for (var ci = 0; ci < colGroups.length; ci++) {
        snapCg.push({
          col: mapAdminColToRepCol(colGroups[ci].getSourceDataColumn(), colMap, colMap, tab.getName()),
          totals: typeof colGroups[ci].totalsAreShown === 'function' ? colGroups[ci].totalsAreShown() : true
        });
      }
      var snapVal = [];
      for (var vi = 0; vi < vals.length; vi++) {
        snapVal.push({ col: mapAdminColToRepCol(vals[vi].getSourceDataColumn(), colMap, colMap, tab.getName()), fn: typeof vals[vi].getSummarizedBy === 'function' ? vals[vi].getSummarizedBy() : 'SUM', dn: typeof vals[vi].getDisplayName === 'function' ? vals[vi].getDisplayName() : '' });
      }
      var snapFilt = [];
      for (var fi = 0; fi < filts.length; fi++) {
        try {
          var critF = typeof filts[fi].getFilterCriteria === 'function' ? filts[fi].getFilterCriteria() : null;
          if (critF) snapFilt.push({ col: mapAdminColToRepCol(filts[fi].getSourceDataColumn(), colMap, colMap, tab.getName()), crit: critF });
        } catch (fe) {}
      }
      tab.clear();
      var rebuilt = tab.getRange(anchorA1).createPivotTable(srcRange);
      for (var si = 0; si < snapRg.length; si++) {
        var ng = rebuilt.addRowGroup(snapRg[si].col);
        try { ng.showTotals(snapRg[si].totals); } catch (e1) {}
        try { if (snapRg[si].repeat) ng.showRepeatedLabels(); } catch (e1b) {}
        try { if (snapRg[si].sortAsc === true) ng.sortAscending(); else if (snapRg[si].sortAsc === false) ng.sortDescending(); } catch (e1c) {}
      }
      for (var sc = 0; sc < snapCg.length; sc++) {
        var nc = rebuilt.addColumnGroup(snapCg[sc].col);
        try { nc.showTotals(snapCg[sc].totals); } catch (e1d) {}
      }
      for (var sv = 0; sv < snapVal.length; sv++) {
        var nv = rebuilt.addPivotValue(snapVal[sv].col, snapVal[sv].fn);
        try { if (snapVal[sv].dn) nv.setDisplayName(snapVal[sv].dn); } catch (e2) {}
      }
      for (var sf = 0; sf < snapFilt.length; sf++) {
        try { rebuilt.addFilter(snapFilt[sf].col, snapFilt[sf].crit); } catch (e3) {}
      }
      try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (e4) {}
    }
  }
}

function cloneAdminTabsAndPivotsToTarget(targetSpreadsheetId, options) {
  if (TEMPLATE_SYNC_GUARD) return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'sync_guard_active' };
  TEMPLATE_SYNC_GUARD = true;
  var tabsOnly = Boolean(options && options.tabsOnly);
  try {
    var adminSs = getTargetSpreadsheet(SPREADSHEET_ID);
    var targetId = extractSheetIdFromUrl(targetSpreadsheetId) || String(targetSpreadsheetId || '').trim();
    if (!adminSs || !targetId || targetId === ADMIN_USERS_SHEET_ID) {
      return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'invalid_target_or_admin' };
    }
    var adminDataSheet = findInvoiceDataSheet(adminSs);
    if (!adminDataSheet) return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'no_admin_data_sheet' };

    setupSheet(adminDataSheet);
    try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (fAdm) {}
    fixAdminAreaPivotIfNeeded(adminSs, adminDataSheet);

    if (targetId === SPREADSHEET_ID) {
      return { synced: true, sheetName: adminSs.getName ? adminSs.getName() : '', tabsCount: adminSs.getSheets().length, pivotsCount: 0, tabNames: [], errorDetails: '' };
    }

    var targetSs = null;
    try { targetSs = SpreadsheetApp.openById(targetId); } catch (openErr) {
      return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'تعذر فتح الشيت (تأكد من صلاحيات المشاركة): ' + String(openErr) };
    }
    if (!targetSs) {
      return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'null_target_spreadsheet' };
    }
    var targetSheetTitle = '';
    try { targetSheetTitle = typeof targetSs.getName === 'function' ? targetSs.getName() : ''; } catch (nErr) {}

    var repFirst = targetSs.getSheets()[0];
    if (repFirst && isUsersSheetObj(repFirst)) {
      return { synced: false, sheetName: targetSheetTitle, tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'target_is_master_users_sheet' };
    }

    var targetDataSheet = findInvoiceDataSheet(targetSs);
    try {
      if (!targetDataSheet) targetDataSheet = targetSs.insertSheet('الفواتير');
      setupSheet(targetDataSheet);
    } catch (permErr) {
      return {
        synced: false,
        sheetName: targetSheetTitle,
        tabsCount: 0,
        pivotsCount: 0,
        tabNames: [],
        errorDetails: 'لا توجد صلاحية تعديل (Editor) على شيت المندوب — شاركه مع حساب باقر كـ Editor: ' + String(permErr)
      };
    }

    var adminHeaders = getExpectedCols(adminDataSheet);
    var repHeaders = getExpectedCols(targetDataSheet);
    if (adminHeaders.length > repHeaders.length) {
      for (var eh = repHeaders.length; eh < adminHeaders.length; eh++) {
        repHeaders.push(adminHeaders[eh]);
        targetDataSheet.getRange(1, eh + 1).setValue(adminHeaders[eh]).setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
      }
    }
    try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (fRep1) {}

    var adminColMap = resolveColMap(adminHeaders);
    var repColMap = resolveColMap(repHeaders);
    var repMaxRows = ensureSheetMinRows(targetDataSheet, Math.max(targetDataSheet.getLastRow() + 200, 1000));
    var repSourceRange = targetDataSheet.getRange(1, 1, repMaxRows, repHeaders.length);

    var adminDataName = adminDataSheet.getName();
    var repDataName = targetDataSheet.getName();
    var adminSheets = adminSs.getSheets();
    var tabsCount = 0;
    var pivotsCount = 0;
    var tabNames = [];
    var tabErrors = [];

    for (var sIdx = 0; sIdx < adminSheets.length; sIdx++) {
      var s = adminSheets[sIdx];
      var sName = String(s.getName() || '').trim();
      if (sName === adminDataName || isUsersSheetObj(s)) continue;

      try {
        var targetTab = targetSs.getSheetByName(sName) || targetSs.insertSheet(sName);
        try { targetTab.setRightToLeft(true); } catch (rtlErr) {}
        try { var tc = typeof s.getTabColor === 'function' ? s.getTabColor() : null; if (tc) targetTab.setTabColor(tc); } catch (tcErr) {}

        var existingOldPts = typeof targetTab.getPivotTables === 'function' ? targetTab.getPivotTables() : [];
        for (var op = existingOldPts.length - 1; op >= 0; op--) {
          try { if (typeof existingOldPts[op].remove === 'function') existingOldPts[op].remove(); } catch (rmErr) {}
        }
        targetTab.clear();

        var adminPts = typeof s.getPivotTables === 'function' ? s.getPivotTables() : [];
        if (adminPts.length > 0 && !tabsOnly) {
          for (var ptIdx = 0; ptIdx < adminPts.length; ptIdx++) {
            copySinglePivotTable(adminPts[ptIdx], targetTab, repSourceRange, adminColMap, repColMap, sName, adminHeaders, repHeaders);
            pivotsCount++;
            try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (fPt) {}
          }
        } else {
          var lr = s.getLastRow();
          var lc = s.getLastColumn();
          if (lr > 0 && lc > 0) {
            var srcRng = s.getRange(1, 1, lr, lc);
            var vals = srcRng.getValues();
            var forms = typeof srcRng.getFormulas === 'function' ? srcRng.getFormulas() : [];
            var destRng = targetTab.getRange(1, 1, lr, lc);
            var mergedOut = [];
            var escAdmin = adminDataName.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
            var refRegex = new RegExp("('?" + escAdmin + "'?)!", 'g');
            for (var rr = 0; rr < lr; rr++) {
              var lineOut = [];
              for (var cc = 0; cc < lc; cc++) {
                var f = (forms[rr] && forms[rr][cc]) ? String(forms[rr][cc]) : '';
                if (f && f.charAt(0) === '=') {
                  lineOut.push(f.replace(refRegex, "'" + repDataName + "'!"));
                } else {
                  lineOut.push(vals[rr][cc]);
                }
              }
              mergedOut.push(lineOut);
            }
            destRng.setValues(mergedOut);
            try { targetTab.autoResizeColumns(1, lc); } catch (rcErr) {}
          }
        }
        tabNames.push(sName);
        tabsCount++;
      } catch (tabErr) {
        tabErrors.push(sName + ': ' + String(tabErr));
      }
    }
    try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (fEnd) {}
    return {
      synced: tabsCount > 0 || tabErrors.length === 0,
      sheetName: targetSheetTitle,
      tabsCount: tabsCount,
      pivotsCount: pivotsCount,
      tabNames: tabNames,
      errorDetails: tabErrors.join(' | ')
    };
  } catch (outerErr) {
    return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: String(outerErr) };
  } finally {
    TEMPLATE_SYNC_GUARD = false;
  }
}

function groupSheetRowsSafe(data, colMap) {
  var bucketMap = {};
  var bucketOrder = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var invNum = String(row[colMap.invoice_number] || '').trim();
    var dt = formatYmd(row[colMap.invoice_date]);
    var ph = normPh(row[colMap.pharmacy_name]);
    var prod = normProd(row[colMap.product_name]);
    var qty = Math.round(Number(row[colMap.quantity] || 0));
    var ts = String(row[colMap.timestamp] || '').trim();
    if (!ph && !prod && !invNum) continue;
    var bKey = (invNum || ph) + '::' + dt + '::' + ts;
    if (!bucketMap[bKey]) { bucketMap[bKey] = []; bucketOrder.push(bKey); }
    bucketMap[bKey].push({ sheetRow: i + 1, row: row, ph: ph, dt: dt, invNum: invNum, ts: ts, pKey: prod + ':' + qty });
  }

  var groups = [];
  for (var b = 0; b < bucketOrder.length; b++) {
    var entries = bucketMap[bucketOrder[b]];
    var block = [];
    var seen = {};
    for (var e = 0; e < entries.length; e++) {
      var ent = entries[e];
      if (ent.pKey && ent.pKey !== ':0' && seen[ent.pKey] && block.length > 0) {
        groups.push(block);
        block = [];
        seen = {};
      }
      block.push(ent);
      if (ent.pKey && ent.pKey !== ':0') seen[ent.pKey] = true;
    }
    if (block.length > 0) groups.push(block);
  }
  return groups;
}

function buildGroupSignatureSafe(block) {
  if (!block || block.length === 0) return '';
  var first = block[0];
  if (!first.ph || !first.dt) return '';
  var items = [];
  for (var i = 0; i < block.length; i++) {
    if (block[i].pKey && block[i].pKey !== ':0') items.push(block[i].pKey);
  }
  if (items.length === 0) return '';
  items.sort();
  return first.ph + '||' + first.dt + '||' + items.length + '||' + items.join('|');
}

function highlightDuplicatesInSheet(sheet) {
  if (!sheet) sheet = getTargetSheet();
  if (!sheet || isUsersSheetObj(sheet)) return;
  var lastRow = sheet.getLastRow();
  var totalCols = Math.max(16, sheet.getLastColumn());
  if (lastRow <= 1) return;
  var headers = sheet.getRange(1, 1, 1, totalCols).getValues()[0];
  var colMap = resolveColMap(headers);
  var data = sheet.getRange(1, 1, lastRow, totalCols).getValues();
  var groups = groupSheetRowsSafe(data, colMap);

  var bySignature = {};
  for (var g = 0; g < groups.length; g++) {
    var grp = groups[g];
    var sig = buildGroupSignatureSafe(grp);
    if (!sig) continue;
    if (!bySignature[sig]) bySignature[sig] = [];
    bySignature[sig].push(grp);
  }
  var dupRowMap = {};
  for (var sigKey in bySignature) {
    if (bySignature[sigKey].length > 1) {
      var copies = bySignature[sigKey];
      for (var c = 0; c < copies.length; c++) {
        for (var rIdx = 0; rIdx < copies[c].length; rIdx++) {
          dupRowMap[copies[c][rIdx].sheetRow] = true;
        }
      }
    }
  }
  for (var sheetRow = 2; sheetRow <= lastRow; sheetRow++) {
    var rng = sheet.getRange(sheetRow, 1, 1, totalCols);
    rng.setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
    if (dupRowMap[sheetRow]) rng.setBackground('#fee2e2').setFontColor('#991b1b');
    else rng.setBackground('#ffffff').setFontColor('#0f172a');
  }
}

function deleteMatchingInvoiceRows(sheet, targetInvNum, deleteMode, targetPh, targetDate, targetTs) {
  var headers = sheet.getRange(1, 1, 1, Math.max(16, sheet.getLastColumn())).getValues()[0];
  var colMap = resolveColMap(headers);
  var cleanTarget = String(targetInvNum || '').trim();
  var cleanPh = normPh(targetPh || '');
  var cleanDate = formatYmd(targetDate || '');
  var data = sheet.getDataRange().getValues();
  var deleted = 0;

  if (deleteMode === 'duplicate_copy') {
    var allGroups = groupSheetRowsSafe(data, colMap);
    var matchingGroups = [];
    for (var g = 0; g < allGroups.length; g++) {
      var grp = allGroups[g];
      var gFirst = grp[0];
      var isMatch = false;
      if (cleanTarget && gFirst.invNum === cleanTarget) isMatch = true;
      else if (cleanPh && cleanDate && gFirst.ph === cleanPh && gFirst.dt === cleanDate) isMatch = true;
      if (isMatch) matchingGroups.push(grp);
    }

    if (matchingGroups.length <= 1) {
      return 0;
    }

    var chosenGroup = matchingGroups[matchingGroups.length - 1];
    if (targetTs) {
      for (var k = 1; k < matchingGroups.length; k++) {
        if (matchingGroups[k][0].ts === String(targetTs).trim()) {
          chosenGroup = matchingGroups[k];
          break;
        }
      }
    }

    var rowsToDelete = [];
    for (var ri = 0; ri < chosenGroup.length; ri++) {
      rowsToDelete.push(chosenGroup[ri].sheetRow);
    }
    rowsToDelete.sort(function(a, b) { return b - a; });
    for (var d = 0; d < rowsToDelete.length; d++) {
      sheet.deleteRow(rowsToDelete[d]);
      deleted++;
    }
    return deleted;
  }

  for (var i = data.length - 1; i >= 1; i--) {
    var rNum = String(data[i][colMap.invoice_number] || '').trim();
    var matchRow = false;
    if (cleanTarget && rNum === cleanTarget) matchRow = true;
    else if (!cleanTarget && cleanPh && cleanDate && normPh(data[i][colMap.pharmacy_name]) === cleanPh && formatYmd(data[i][colMap.invoice_date]) === cleanDate) matchRow = true;
    if (!matchRow) continue;
    sheet.deleteRow(i + 1);
    deleted++;
  }
  return deleted;
}

function findUserRowIndex(data, uMap, targetRowNum, targetName, targetEmail) {
  var cleanTargetName = normAr(targetName || '');
  var cleanTargetEmail = String(targetEmail || '').trim().toLowerCase();
  var rn = Number(targetRowNum || 0);
  if (rn >= 2 && rn <= data.length) {
    var rowAtIdx = data[rn - 1];
    var rName = normAr(rowAtIdx[uMap.nameCol]);
    var rEmail = uMap.emailCol >= 0 ? String(rowAtIdx[uMap.emailCol] || '').trim().toLowerCase() : '';
    if ((!cleanTargetName && !cleanTargetEmail) || (cleanTargetName && rName === cleanTargetName) || (cleanTargetEmail && rEmail === cleanTargetEmail)) {
      return rn;
    }
  }
  for (var i = 1; i < data.length; i++) {
    var nm = normAr(data[i][uMap.nameCol]);
    var em = uMap.emailCol >= 0 ? String(data[i][uMap.emailCol] || '').trim().toLowerCase() : '';
    if (cleanTargetName && nm === cleanTargetName) return i + 1;
    if (cleanTargetEmail && em === cleanTargetEmail) return i + 1;
  }
  return -1;
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'لا توجد بيانات مرفقة بالطلب' })).setMimeType(ContentService.MimeType.JSON);
    }

    var payload = JSON.parse(e.postData.contents);
    var actionName = String(payload.action || '').trim();

    if (actionName === 'register_user' || actionName === 'add_user' || actionName === 'upsert_user' || actionName === 'seed_users') {
      var usersSheet = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheet) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي للمستخدمين' })).setMimeType(ContentService.MimeType.JSON);
      }
      var ensureGemColIdx = ensureMasterGeminiColumn(usersSheet);
      var headersU = usersSheet.getRange(1, 1, 1, Math.max(5, usersSheet.getLastColumn())).getValues()[0];
      var uMap = resolveUserColMap(headersU);
      if (uMap.geminiCol < 0) uMap.geminiCol = ensureGemColIdx;
      var incomingUsers = payload.users || (payload.user ? [payload.user] : []);
      var currentUsers = readAllSheetUsers(usersSheet);
      var existingSharedGem = '';
      for (var sg = 0; sg < currentUsers.length; sg++) {
        if (currentUsers[sg].gemini_api_key) { existingSharedGem = currentUsers[sg].gemini_api_key; break; }
      }
      var inserted = 0;
      for (var ui = 0; ui < incomingUsers.length; ui++) {
        var u = incomingUsers[ui];
        var uName = String(u.full_name || u.name || '').trim();
        var uEmail = String(u.email || '').trim().toLowerCase();
        var uPass = String(u.password_hash || u.password || '').trim();
        if (!uName && !uEmail) continue;
        var dupUser = false;
        for (var exi = 0; exi < currentUsers.length; exi++) {
          if ((uName && normAr(currentUsers[exi].full_name) === normAr(uName)) || (uEmail && currentUsers[exi].email === uEmail)) {
            dupUser = true;
            break;
          }
        }
        if (dupUser) {
          if (actionName === 'register_user' || actionName === 'add_user') {
            return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'هذا الاسم مسجل مسبقاً في الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
          }
          continue;
        }
        var totalUCols = Math.max(5, headersU.length);
        var uRow = [];
        for (var k = 0; k < totalUCols; k++) uRow.push('');
        uRow[uMap.nameCol] = uName || uEmail.split('@')[0];
        uRow[uMap.passCol] = /^[1-9]\\d*$/.test(uPass) ? Number(uPass) : uPass;
        uRow[uMap.sheetCol] = String(u.sheet_url || u.sheet_id || '').trim();
        uRow[uMap.webhookCol] = String(u.webhook_url || '').trim();
        if (uMap.idCol >= 0) uRow[uMap.idCol] = u.id || ('usr-' + new Date().getTime() + '-' + ui);
        if (uMap.emailCol >= 0) uRow[uMap.emailCol] = uEmail;
        if (uMap.roleCol >= 0) uRow[uMap.roleCol] = isBaqerName(uName, uEmail) ? 'admin' : 'medical_rep';
        if (uMap.activeCol >= 0) uRow[uMap.activeCol] = 'TRUE';
        if (uMap.geminiCol >= 0) uRow[uMap.geminiCol] = String(u.gemini_api_key || existingSharedGem || '').trim();

        var newRowIndex = usersSheet.getLastRow() + 1;
        usersSheet.getRange(newRowIndex, 1, 1, totalUCols).setValues([uRow]);
        if (!/^[1-9]\\d*$/.test(uPass)) {
          try { usersSheet.getRange(newRowIndex, uMap.passCol + 1).setNumberFormat('@').setValue(uPass); } catch (nfErr) {}
        }
        var newUserSheetId = extractSheetIdFromUrl(u.sheet_url || u.sheet_id);
        if (newUserSheetId) {
          try { cloneAdminTabsAndPivotsToTarget(newUserSheetId); } catch (tErr) {}
        }
        currentUsers.push({ full_name: uName, email: uEmail });
        inserted++;
      }
      try { usersSheet.autoResizeColumns(1, Math.max(5, headersU.length)); } catch (ue) {}
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        inserted: inserted,
        message: 'تم حفظ المستخدم وتجهيز شيته بنفس أوراق الأدمن في الشيت الرئيسي بنجاح.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'set_shared_gemini_key') {
      var usersSheetGem = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetGem) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      var gemKeyVal = String(payload.gemini_api_key || payload.geminiApiKey || '').trim();
      var targetGemCol = ensureMasterGeminiColumn(usersSheetGem);
      propagateGeminiKeyToAllUserRows(usersSheetGem, targetGemCol, gemKeyVal);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        gemini_api_key: gemKeyVal,
        message: 'تم تحديث مفتاح Gemini في العمود E وتعميمه لجميع المستخدمين في الشيت الرئيسي بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'unify_admin_webhook') {
      var usersSheetUni = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetUni) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      ensureMasterGeminiColumn(usersSheetUni);
      var headersUni = usersSheetUni.getRange(1, 1, 1, Math.max(5, usersSheetUni.getLastColumn())).getValues()[0];
      var uMapUni = resolveUserColMap(headersUni);
      var centralUrl = String(payload.centralWebhookUrl || payload.webhookUrl || '').trim();
      var clearNonAdmin = String(payload.mode || '') === 'clear';
      var lastRowUni = usersSheetUni.getLastRow();
      var updatedUni = 0;
      for (var ur = 2; ur <= lastRowUni; ur++) {
        var rNameU = String(usersSheetUni.getRange(ur, uMapUni.nameCol + 1).getValue() || '').trim();
        if (!rNameU) continue;
        var valToWrite = clearNonAdmin && !isBaqerName(rNameU, '') ? '' : centralUrl;
        usersSheetUni.getRange(ur, uMapUni.webhookCol + 1).setValue(valToWrite);
        updatedUni++;
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        updated: updatedUni,
        message: 'تم توحيد رابط السكربت المركزي لـ ' + updatedUni + ' حساب في الشيت الرئيسي بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'sync_template_to_all' || actionName === 'sync_tabs_only') {
      var tabsOnlyMode = actionName === 'sync_tabs_only' || payload.mode === 'tabs_only';
      var adminSsMain = getTargetSpreadsheet(SPREADSHEET_ID);
      var adminDataOnly = findInvoiceDataSheet(adminSsMain);
      if (adminDataOnly) {
        setupSheet(adminDataOnly);
        try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (flA) {}
        fixAdminAreaPivotIfNeeded(adminSsMain, adminDataOnly);
      }
      var targetIds = [];
      if (payload.targetSpreadsheetId) {
        var singleTId = extractSheetIdFromUrl(payload.targetSpreadsheetId);
        if (singleTId) targetIds.push(singleTId);
      } else {
        var usersSheetTpl = getOrCreateUsersSheet(payload.adminSpreadsheetId || ADMIN_USERS_SHEET_ID);
        var uListTpl = readAllSheetUsers(usersSheetTpl);
        for (var ui2 = 0; ui2 < uListTpl.length; ui2++) {
          var sidRep = extractSheetIdFromUrl(uListTpl[ui2].sheet_id);
          if (sidRep && sidRep !== SPREADSHEET_ID && targetIds.indexOf(sidRep) === -1) {
            targetIds.push(sidRep);
          }
        }
        if (Array.isArray(payload.targetIds)) {
          for (var ti = 0; ti < payload.targetIds.length; ti++) {
            var extraSid = extractSheetIdFromUrl(payload.targetIds[ti]);
            if (extraSid && extraSid !== SPREADSHEET_ID && targetIds.indexOf(extraSid) === -1) {
              targetIds.push(extraSid);
            }
          }
        }
      }
      var syncResults = [];
      var syncedCount = 0;
      for (var sLoop = 0; sLoop < targetIds.length; sLoop++) {
        var curSid = targetIds[sLoop];
        try {
          var resClone = cloneAdminTabsAndPivotsToTarget(curSid, { tabsOnly: tabsOnlyMode });
          if (resClone.synced) syncedCount++;
          syncResults.push({
            sheetId: curSid,
            sheetName: resClone.sheetName || '',
            ok: resClone.synced,
            tabsCount: resClone.tabsCount,
            pivotsCount: resClone.pivotsCount,
            tabNames: resClone.tabNames || [],
            errorDetails: resClone.errorDetails || ''
          });
        } catch (repErr) {
          syncResults.push({ sheetId: curSid, sheetName: '', ok: false, tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: String(repErr) });
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        tabsOnly: tabsOnlyMode,
        updatedSheets: syncedCount,
        totalTargets: targetIds.length,
        results: syncResults,
        message: 'تمت مزامنة أوراق و Pivot Tables الأدمن مع (' + syncedCount + ' / ' + targetIds.length + ') شيتات بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'update_user') {
      var usersSheetUpd = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetUpd) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      var ensuredUpdGemCol = ensureMasterGeminiColumn(usersSheetUpd);
      var dataUpd = usersSheetUpd.getDataRange().getValues();
      var headersUpd = dataUpd[0] || [];
      var uMapUpd = resolveUserColMap(headersUpd);
      if (uMapUpd.geminiCol < 0) uMapUpd.geminiCol = ensuredUpdGemCol;
      var targetRow = findUserRowIndex(dataUpd, uMapUpd, payload.rowNumber, payload.currentName || payload.username, payload.email);
      if (targetRow === -1) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, script_version: SCRIPT_VERSION, error: 'المستخدم غير موجود في الشيت الرئيسي.' })).setMimeType(ContentService.MimeType.JSON);
      }
      var newName = String(payload.newName || '').trim();
      if (newName) {
        for (var ci = 1; ci < dataUpd.length; ci++) {
          if (ci + 1 !== targetRow && normAr(dataUpd[ci][uMapUpd.nameCol]) === normAr(newName)) {
            return ContentService.createTextOutput(JSON.stringify({ success: false, script_version: SCRIPT_VERSION, error: 'الاسم الجديد مسجل مسبقاً لمستخدم آخر.' })).setMimeType(ContentService.MimeType.JSON);
          }
        }
        usersSheetUpd.getRange(targetRow, uMapUpd.nameCol + 1).setValue(newName);
      }
      if (payload.newPassword !== undefined && String(payload.newPassword).trim() !== '') {
        var np = String(payload.newPassword).trim();
        var passCell = usersSheetUpd.getRange(targetRow, uMapUpd.passCol + 1);
        if (/^[1-9]\\d*$/.test(np)) {
          passCell.setNumberFormat('0').setValue(Number(np));
        } else {
          passCell.setNumberFormat('@').setValue(np);
        }
      }
      if (payload.newSheetUrl !== undefined) {
        var cleanUrlStr = String(payload.newSheetUrl).trim();
        usersSheetUpd.getRange(targetRow, uMapUpd.sheetCol + 1).setValue(cleanUrlStr);
        var updatedSid = extractSheetIdFromUrl(cleanUrlStr);
        if (updatedSid && updatedSid !== SPREADSHEET_ID) {
          try { cloneAdminTabsAndPivotsToTarget(updatedSid); } catch (uSyncErr) {}
        }
      }
      if (payload.newWebhookUrl !== undefined) {
        usersSheetUpd.getRange(targetRow, uMapUpd.webhookCol + 1).setValue(String(payload.newWebhookUrl).trim());
      }
      if (payload.newGeminiApiKey !== undefined && uMapUpd.geminiCol >= 0) {
        usersSheetUpd.getRange(targetRow, uMapUpd.geminiCol + 1).setValue(String(payload.newGeminiApiKey).trim());
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        rowNumber: targetRow,
        message: 'تم تعديل البيانات وحفظها في الشيت الرئيسي بنجاح.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'delete_user') {
      var usersSheetDel = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetDel) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      var dataDel = usersSheetDel.getDataRange().getValues();
      var uMapDel = resolveUserColMap(dataDel[0] || []);
      var delRow = findUserRowIndex(dataDel, uMapDel, payload.rowNumber, payload.currentName || payload.username, payload.email);
      if (delRow === -1) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, script_version: SCRIPT_VERSION, error: 'المستخدم غير موجود.' })).setMimeType(ContentService.MimeType.JSON);
      }
      usersSheetDel.deleteRow(delRow);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        message: 'تم حذف المستخدم من الشيت الرئيسي بنجاح.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getTargetSheet(payload.spreadsheetId, payload.sheetName || 'الفواتير');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح ورقة الفواتير في كوكل شيت' })).setMimeType(ContentService.MimeType.JSON);
    }
    setupSheet(sheet);

    if (actionName === 'repair' || actionName === 'setup') {
      highlightDuplicatesInSheet(sheet);
      var targetForSync = extractSheetIdFromUrl(payload.spreadsheetId) || SPREADSHEET_ID;
      var syncTplRes = { synced: false, tabsCount: 0, pivotsCount: 0 };
      try { syncTplRes = cloneAdminTabsAndPivotsToTarget(targetForSync); } catch (reSyncErr) {}
      try { sheet.autoResizeColumns(1, Math.max(16, sheet.getLastColumn())); } catch (errR) {}
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        templateSynced: syncTplRes.synced,
        tabsCount: syncTplRes.tabsCount,
        pivotsCount: syncTplRes.pivotsCount,
        message: 'تم توحيد الأعمدة (المنطقة قبل المدينة) واستنساخ أوراق الأدمن و Pivot Tables بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'delete_invoice') {
      var delInv = payload.invoice_number || (payload.row && payload.row.invoice_number);
      var delCount = deleteMatchingInvoiceRows(sheet, delInv, payload.delete_mode, payload.pharmacy_name, payload.invoice_date, payload.timestamp);
      highlightDuplicatesInSheet(sheet);
      return ContentService.createTextOutput(JSON.stringify({ success: true, script_version: SCRIPT_VERSION, deleted: delCount, message: 'تم حذف ' + delCount + ' سطر من كوكل شيت وإعادة ضبط الألوان' })).setMimeType(ContentService.MimeType.JSON);
    }

    var headers = getExpectedCols(sheet);
    var totalCols = headers.length;
    var colMap = resolveColMap(headers);
    var rows = payload.rows || [];
    var data = sheet.getDataRange().getValues();
    var addedCount = 0;
    var updatedCount = 0;

    if (actionName === 'edit_invoice' || actionName === 'replace_invoice') {
      var matchNums = {};
      if (payload.previous_invoice_number) matchNums[String(payload.previous_invoice_number).trim()] = true;
      if (payload.invoice_number) matchNums[String(payload.invoice_number).trim()] = true;
      var existingIndices = [];
      for (var m = 1; m < data.length; m++) {
        var rNum = String(data[m][colMap.invoice_number] || '').trim();
        if (rNum && matchNums[rNum]) existingIndices.push(m + 1);
      }
      if (existingIndices.length === 0 && payload.pharmacy_name && payload.invoice_date) {
        var targetPhN = normPh(payload.pharmacy_name);
        var targetDtY = formatYmd(payload.invoice_date);
        for (var m2 = 1; m2 < data.length; m2++) {
          if (normPh(data[m2][colMap.pharmacy_name]) === targetPhN && formatYmd(data[m2][colMap.invoice_date]) === targetDtY) existingIndices.push(m2 + 1);
        }
      }
      var validEditRows = [];
      for (var vr = 0; vr < rows.length; vr++) {
        if (String(rows[vr].invoice_number || '').trim() !== '123') validEditRows.push(rows[vr]);
      }
      if (existingIndices.length === 0) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true, script_version: SCRIPT_VERSION, added: 0, updated: 0,
          message: 'وضع التعديل: لم يتم إنشاء صف جديد لعدم العثور على الصف الأصلي في الشيت.'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      var common = Math.min(existingIndices.length, validEditRows.length);
      for (var u = 0; u < common; u++) {
        var sheetRowNum = existingIndices[u];
        var newVals = buildRowValuesByHeaders(validEditRows[u], headers, data[sheetRowNum - 1]);
        sheet.getRange(sheetRowNum, 1, 1, totalCols).setValues([newVals]);
        updatedCount++;
      }
      if (validEditRows.length > existingIndices.length) {
        var insertAfter = existingIndices[existingIndices.length - 1];
        for (var a = common; a < validEditRows.length; a++) {
          var insVals = buildRowValuesByHeaders(validEditRows[a], headers, null);
          sheet.insertRowAfter(insertAfter);
          insertAfter++;
          sheet.getRange(insertAfter, 1, 1, totalCols).setValues([insVals]);
          addedCount++;
        }
      } else if (existingIndices.length > validEditRows.length) {
        for (var d = existingIndices.length - 1; d >= validEditRows.length; d--) sheet.deleteRow(existingIndices[d]);
      }
      highlightDuplicatesInSheet(sheet);
      try { sheet.autoResizeColumns(1, totalCols); } catch (re1) {}
      return ContentService.createTextOutput(JSON.stringify({
        success: true, script_version: SCRIPT_VERSION, added: addedCount, updated: updatedCount,
        message: 'تم تعديل الفاتورة في نفس الصف (' + updatedCount + ' تحديث، ' + addedCount + ' بند إضافي).'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName && !Array.isArray(payload.rows)) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        script_version: SCRIPT_VERSION,
        error: 'أمر غير مدعوم أو تنسيق طلب غير مكتمل: ' + actionName
      })).setMimeType(ContentService.MimeType.JSON);
    }

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var invNum = String(r.invoice_number || '').trim();
      var phN = normPh(r.pharmacy_name || '');
      if (invNum === '123' || (!invNum && !phN)) continue;
      var addVals = buildRowValuesByHeaders(r, headers, null);
      sheet.appendRow(addVals);
      addedCount++;
      data.push(addVals);
    }
    highlightDuplicatesInSheet(sheet);
    try { sheet.autoResizeColumns(1, totalCols); } catch (resizeErr) {}
    return ContentService.createTextOutput(JSON.stringify({
      success: true, script_version: SCRIPT_VERSION, added: addedCount, updated: updatedCount,
      message: 'تم إدراج ' + addedCount + ' سطراً جديداً بترتيب الأعمدة الموحّد بنجاح.'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function onEdit(e) {
  try {
    var activeSheet = (e && e.range && typeof e.range.getSheet === 'function') ? e.range.getSheet() : null;
    if (activeSheet && isUsersSheetObj(activeSheet)) {
      var lastC = Math.max(5, activeSheet.getLastColumn());
      var headersU = activeSheet.getRange(1, 1, 1, lastC).getValues()[0];
      var uMap = resolveUserColMap(headersU);
      var editedCol = (e && e.range && typeof e.range.getColumn === 'function') ? (e.range.getColumn() - 1) : -1;
      if (editedCol >= 4 && (uMap.geminiCol === editedCol || uMap.geminiCol < 0)) {
        var gCol = ensureMasterGeminiColumn(activeSheet, editedCol);
        var editedVal = String(e.range.getValue() || '').trim();
        if (editedVal && /^(AIza|AQ\\.)/.test(editedVal)) {
          propagateGeminiKeyToAllUserRows(activeSheet, gCol, editedVal);
        }
      }
      return;
    }
    var sheet = activeSheet || getTargetSheet();
    if (sheet && !isUsersSheetObj(sheet) && !sheetHasPivotTables(sheet)) {
      highlightDuplicatesInSheet(sheet);
    }
  } catch (err) {}
}

function doGet(e) {
  try {
    var action = e && e.parameter ? (e.parameter.action || e.parameter.sheet || '') : '';
    var customId = e && e.parameter ? (e.parameter.spreadsheetId || '') : '';

    if (action === 'users' || action === 'المستخدمون') {
      var uSheet = getOrCreateUsersSheet(e && e.parameter ? (e.parameter.adminSpreadsheetId || customId) : '');
      var uHeaders = uSheet && uSheet.getLastRow() > 0 ? uSheet.getRange(1, 1, 1, Math.max(4, uSheet.getLastColumn())).getValues()[0] : [];
      var uList = readAllSheetUsers(uSheet);
      return ContentService.createTextOutput(JSON.stringify({
        success: true, script_version: SCRIPT_VERSION, headers: uHeaders, users: uList
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getTargetSheet(customId, 'الفواتير');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ script_version: SCRIPT_VERSION, headers: [], rows: [] })).setMimeType(ContentService.MimeType.JSON);
    }
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ script_version: SCRIPT_VERSION, headers: data[0] || [], rows: [] })).setMimeType(ContentService.MimeType.JSON);
    }

    var headers = data[0];
    var colMap = resolveColMap(headers);
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var invNum = String(row[colMap.invoice_number] || '').trim();
      var phName = String(row[colMap.pharmacy_name] || '').trim();
      if (invNum === '123' || (!invNum && !phName && !row[colMap.product_name])) continue;

      var invDate = formatYmd(row[colMap.invoice_date]);
      var cells = [];
      for (var c = 0; c < headers.length; c++) {
        if (c === colMap.invoice_date) cells.push(invDate);
        else cells.push(row[c] !== undefined && row[c] !== null ? String(row[c]) : '');
      }

      var prNameGet = String(row[colMap.product_name] || '');
      rows.push({
        invoice_number: invNum,
        invoice_date:   invDate,
        warehouse_name: String(row[colMap.warehouse_name] || ''),
        pharmacy_name:  phName,
        area:           colMap.area >= 0 ? String(row[colMap.area] || '') : detectAreaFromPh(phName),
        city:           colMap.city >= 0 ? String(row[colMap.city] || 'بغداد') : 'بغداد',
        product_name:   prNameGet,
        dosage_form:    colMap.dosage_form >= 0 ? String(row[colMap.dosage_form] || '') : detectDosage(prNameGet),
        quantity:       Number(row[colMap.quantity] || 0),
        unit_price:     Number(row[colMap.unit_price] || 0),
        bonus_quantity: Number(row[colMap.bonus_quantity] || 0),
        line_total:     Number(row[colMap.line_total] || 0),
        total_invoice:  Number(row[colMap.total_invoice] || 0),
        rep_name:       String(row[colMap.rep_name] || ''),
        status:         String(row[colMap.status] || 'قيد التدقيق'),
        timestamp:      String(row[colMap.timestamp] || ''),
        loyalty:        colMap.loyalty >= 0 && colMap.loyalty < headers.length ? String(row[colMap.loyalty] || '') : '',
        cells:          cells
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      script_version: SCRIPT_VERSION,
      headers: headers,
      rows: rows
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function testRun() {
  var uSheet = getOrCreateUsersSheet(ADMIN_USERS_SHEET_ID);
  if (uSheet) ensureMasterGeminiColumn(uSheet);
  var adminSheet = getTargetSheet(SPREADSHEET_ID);
  if (adminSheet && !isUsersSheetObj(adminSheet)) {
    setupSheet(adminSheet);
    try { fixAdminAreaPivotIfNeeded(getTargetSpreadsheet(SPREADSHEET_ID), adminSheet); } catch (e) {}
  }
  Logger.log('تم التحقق من الجداول والترقية بنجاح (v' + SCRIPT_VERSION + ').');
}`}),(0,q.jsxs)(`div`,{style:{marginTop:`0.85rem`,paddingTop:`0.85rem`,borderTop:`1px dashed #cbd5e1`},children:[(0,q.jsx)(`div`,{style:{fontSize:`0.78rem`,fontWeight:800,color:`#334155`,marginBottom:6},children:`كود الغلاف المختصر لشيتات المندوبين (4 أسطر فقط عند ربط مشروع الأدمن كـ Library باسم AdminLib في وضع HEAD):`}),(0,q.jsx)(`pre`,{style:{background:`#1e293b`,color:`#a7f3d0`,padding:`0.75rem`,borderRadius:8,fontSize:`0.73rem`,direction:`ltr`,textAlign:`left`,margin:0},children:`// ضع هذا الكود المختصر (مرة واحدة فقط) في شيت المندوب بعد إضافة مشروع سكربت الأدمن كـ Library باسم AdminLib (الوضع: HEAD)
function onEdit(e) { return AdminLib.onEdit(e); }
function doGet(e) { return AdminLib.doGet(e); }
function doPost(e) { return AdminLib.doPost(e); }
function testRun() { return AdminLib.testRun(); }`})]})]}),(0,q.jsxs)(`div`,{className:`card`,style:{padding:`1.15rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`0.75rem`,marginBottom:`1rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`h4`,{style:{fontWeight:800,margin:`0 0 0.25rem 0`},children:[`سجل البيانات الحية المسحوبة من كوكل شيت (`,Te.length,` سطر • `,xe.length,` عمود)`]}),(0,q.jsx)(`span`,{style:{fontSize:`0.78rem`,color:`var(--gray-500)`},children:`عرض كامل لجميع الأعمدة والصفوف بدون قص النصوص (Fit to Row & Fit to Column) — اسحب أفقياً لرؤية جميع الأعمدة.`})]}),(0,q.jsxs)(`div`,{style:{position:`relative`,width:`min(100%, 280px)`},children:[(0,q.jsx)(Vr,{size:16,style:{position:`absolute`,right:10,top:`50%`,transform:`translateY(-50%)`,color:`var(--gray-400)`}}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,placeholder:`بحث في كافة أعمدة كوكل شيت...`,style:{width:`100%`,paddingRight:`2rem`,fontSize:`0.82rem`},value:S,onChange:e=>C(e.target.value)})]})]}),t?(0,q.jsxs)(`div`,{style:{textAlign:`center`,padding:`3rem`},children:[(0,q.jsx)(Lr,{size:32,className:`animate-spin`,style:{color:`var(--primary)`,marginBottom:10}}),(0,q.jsx)(`div`,{style:{fontWeight:700,color:`var(--gray-600)`},children:`جارِ قراءة البيانات الحية من كوكل شيت...`})]}):Te.length===0?(0,q.jsxs)(`div`,{style:{textAlign:`center`,padding:`3.5rem 1rem`,background:`var(--gray-50)`,borderRadius:12},children:[(0,q.jsx)(tr,{size:48,style:{color:`var(--gray-300)`,marginBottom:12}}),(0,q.jsx)(`h5`,{style:{fontWeight:800,color:`var(--gray-700)`,marginBottom:6},children:`لا توجد بيانات مسجلة في كوكل شيت حتى الآن`}),(0,q.jsxs)(`button`,{onClick:he,disabled:r,className:`btn-clay btn-primary`,style:{fontWeight:800},children:[(0,q.jsx)(zn,{size:18}),` تصدير الفواتير الحالية إلى كوكل شيت الآن`]})]}):(0,q.jsx)(`div`,{style:{overflowX:`auto`,WebkitOverflowScrolling:`touch`,width:`100%`,borderRadius:12,border:`1px solid var(--gray-200)`},children:(0,q.jsxs)(`table`,{className:`clay-table`,style:{width:`max-content`,minWidth:`100%`,tableLayout:`auto`,fontSize:`0.82rem`,margin:0},children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{style:{textAlign:`center`,whiteSpace:`nowrap`,padding:`0.65rem 0.75rem`},children:`#`}),xe.map((e,t)=>(0,q.jsx)(`th`,{style:{whiteSpace:`nowrap`,padding:`0.65rem 0.85rem`,textAlign:`center`},children:e||`عمود ${t+1}`},t)),I.length>0&&(0,q.jsx)(`th`,{style:{whiteSpace:`nowrap`,padding:`0.65rem 0.85rem`,textAlign:`center`},children:`إجراء التكرار`})]})}),(0,q.jsx)(`tbody`,{children:we.map(({row:e,rowIndex:t},n)=>{let r=Se.has(t),i=I.find(e=>e.rowIndices.includes(t));return(0,q.jsxs)(`tr`,{style:{height:`auto`,background:r?`#fee2e2`:`#ffffff`,color:r?`#991b1b`:`#0f172a`},children:[(0,q.jsx)(`td`,{style:{textAlign:`center`,fontWeight:700,color:`var(--gray-500)`,whiteSpace:`nowrap`,verticalAlign:`middle`,padding:`0.6rem 0.75rem`},children:n+1}),xe.map((t,n)=>{let i=String(t||``).toLowerCase().replace(/[أإآ]/g,`ا`).replace(/ة/g,`ه`).replace(/ى/g,`ي`),a=Array.isArray(e.cells)&&e.cells[n]!==void 0?String(e.cells[n]):i.includes(`رقم الفاتور`)?String(e.invoice_number??``):i.includes(`تاريخ الفاتور`)?String(e.invoice_date??``):i.includes(`المذخر`)?String(e.warehouse_name??``):i.includes(`اسم الصيدلي`)?String(e.pharmacy_name??``):i.includes(`المدين`)||i.includes(`المحافظ`)?String(e.city??``):i.includes(`المنطق`)||i.includes(`المكان`)?String(e.area??``):i.includes(`اسم الماد`)||i.includes(`الماده الدوائي`)?String(e.product_name??``):i.includes(`نوع الماد`)||i.includes(`الشكل الدوائي`)?String(e.dosage_form??``):i.includes(`الكمي`)?String(e.quantity??``):i.includes(`سعر المفرد`)?String(e.unit_price??``):i.includes(`البونص`)?String(e.bonus_quantity??``):i.includes(`صافي الفاتور`)?String(e.total_invoice??``):i.includes(`المجموع`)?String(e.line_total??``):i.includes(`المندوب`)?String(e.rep_name??``):i.includes(`حاله الاعتماد`)||i.includes(`الحال`)?String(e.status??``):i.includes(`وقت وتاريخ`)||i.includes(`الادراج`)?String(e.timestamp??``):``;if(i.includes(`رقم الفاتور`)||!i&&n===0)return(0,q.jsx)(`td`,{style:{fontWeight:800,color:r?`#b91c1c`:`var(--primary)`,whiteSpace:`nowrap`,verticalAlign:`middle`,padding:`0.6rem 0.85rem`},children:a||`—`},n);if(i.includes(`نوع الماد`)||i.includes(`الشكل الدوائي`)){let e=a.trim(),t=[`قطرة`,`كريم`,`مرهم`,`حبوب`].includes(e)?e:e.includes(`drop`)||e.includes(`قطر`)?`قطرة`:e.includes(`cream`)||e.includes(`كريم`)?`كريم`:e.includes(`oint`)||e.includes(`مرهم`)?`مرهم`:`حبوب`,r=Ei(t);return(0,q.jsx)(`td`,{style:{whiteSpace:`nowrap`,textAlign:`center`,verticalAlign:`middle`,padding:`0.6rem 0.85rem`},children:(0,q.jsx)(`span`,{className:`badge`,style:{fontSize:`0.74rem`,background:r.bg,color:r.color,border:`1px solid ${r.border}`,fontWeight:800},children:t})},n)}if(i.includes(`سعر المفرد`)||i.includes(`المجموع`)||i.includes(`صافي الفاتور`)){let e=i.includes(`المجموع`)||i.includes(`صافي الفاتور`),t=Number(String(a).replace(/[^\d.-]/g,``));return(0,q.jsx)(`td`,{style:{whiteSpace:`nowrap`,textAlign:`center`,fontWeight:e?800:600,color:i.includes(`المجموع`)?`var(--primary)`:void 0,verticalAlign:`middle`,padding:`0.6rem 0.85rem`},children:a?isNaN(t)?a:`${t.toLocaleString()} د.ع`:`—`},n)}if(i.includes(`حاله الاعتماد`)||i.includes(`الحال`))return(0,q.jsx)(`td`,{style:{whiteSpace:`nowrap`,textAlign:`center`,verticalAlign:`middle`,padding:`0.6rem 0.85rem`},children:(0,q.jsx)(`span`,{className:`badge ${a.includes(`معتمدة`)?`badge-success`:a.includes(`مرفوضة`)?`badge-danger`:`badge-warning`}`,children:a||`قيد التدقيق`})},n);let o=i.includes(`وقت وتاريخ`)||i.includes(`الادراج`),s=i.includes(`الكمي`)||i.includes(`البونص`),c=i.includes(`اسم الصيدلي`)||i.includes(`اسم الماد`)||i.includes(`المنطق`),l=i.includes(`المذخر`)||i.includes(`اسم الصيدلي`)||i.includes(`اسم الماد`)||i.includes(`المندوب`)||n>=16;return(0,q.jsx)(`td`,{style:{whiteSpace:l?`normal`:`nowrap`,wordBreak:l?`break-word`:void 0,minWidth:l?150:void 0,maxWidth:l?280:void 0,lineHeight:1.45,verticalAlign:`middle`,textAlign:s?`center`:void 0,fontWeight:c?700:void 0,padding:`0.6rem 0.85rem`},children:o?(0,q.jsxs)(`span`,{style:{fontSize:`0.76rem`,color:`var(--gray-500)`,whiteSpace:`nowrap`},children:[(0,q.jsx)(Fn,{size:11,style:{display:`inline`,marginLeft:3}}),a||`—`]}):a||`—`},n)}),I.length>0&&(0,q.jsx)(`td`,{style:{whiteSpace:`nowrap`,textAlign:`center`,verticalAlign:`middle`,padding:`0.6rem 0.85rem`},children:i?(0,q.jsxs)(`button`,{type:`button`,onClick:()=>Ce(i),disabled:s===i.key,className:`btn-clay btn-danger btn-sm`,style:{background:`#dc2626`,color:`white`,fontWeight:800,padding:`0.3rem 0.65rem`,fontSize:`0.74rem`},children:[(0,q.jsx)($r,{size:13}),` حذف الفاتورة المكررة (`,i.rowsCount,`)`]}):(0,q.jsx)(`span`,{style:{fontSize:`0.75rem`,color:`var(--gray-400)`},children:`—`})})]},t)})})]})})]})]})},Ni=()=>{let[e,t]=(0,_.useState)([]),[n,r]=(0,_.useState)(!1),[i,a]=(0,_.useState)(!1),[o,s]=(0,_.useState)(null),[c,l]=(0,_.useState)(null),[u,d]=(0,_.useState)({}),[f,p]=(0,_.useState)(()=>Pe()),[m,h]=(0,_.useState)(!1),[g,v]=(0,_.useState)(!1),[y,b]=(0,_.useState)(!1),[x,S]=(0,_.useState)(!1),[C,w]=(0,_.useState)(null),[T,ee]=(0,_.useState)(``),[E,te]=(0,_.useState)(!1),[D,ne]=(0,_.useState)(!1),[O,re]=(0,_.useState)(!1),[ie,A]=(0,_.useState)([]),[oe,se]=(0,_.useState)(!1),[ce,j]=(0,_.useState)(!1),[le,ue]=(0,_.useState)(!1),[de,fe]=(0,_.useState)(``),[pe,me]=(0,_.useState)(``),[M,ge]=(0,_.useState)(``),[_e,N]=(0,_.useState)(``),[P,be]=(0,_.useState)(``),[xe,F]=(0,_.useState)(null),[Se,Ce]=(0,_.useState)(``),[we,Te]=(0,_.useState)(``),[Ee,L]=(0,_.useState)(``),[De,Oe]=(0,_.useState)(``),[ke,Ae]=(0,_.useState)(``),je=async()=>{r(!0),s(null);try{let e=await G.getAdminUsersFromSheet();t(e);let n=e.find(e=>e.role===`admin`&&e.webhook_url&&e.webhook_url.startsWith(`http`)),r=Pe();n?.webhook_url&&(!r||r.includes(`AKfycbyxEXPVY7gl`))&&(Fe(n.webhook_url),p(n.webhook_url));let i=await G.checkAdminWebhookVersion().catch(()=>({scriptVersion:0,isOutdated:!1})),a=I(e);a&&ee(a),w(i?.scriptVersion?i.scriptVersion:null),S(!!i?.isOutdated)}catch(e){s(e?.message||`تعذر قراءة الشيت الرئيسي للمستخدمين`)}finally{r(!1)}},Me=async e=>{e.preventDefault(),ne(!0),s(null),l(null);try{let e=await G.adminSetSharedGeminiKey(T.trim());l(e.message),await je()}catch(e){s(e?.message||`تعذر حفظ مفتاح Gemini الموحد في الشيت الرئيسي`)}finally{ne(!1)}};(0,_.useEffect)(()=>{je()},[]);let Ne=e=>{d(t=>({...t,[e]:!t[e]}))},Ie=e=>{e.preventDefault(),Fe(f),h(!0),setTimeout(()=>h(!1),2500),je()},Le=()=>{navigator.clipboard.writeText(k),b(!0),setTimeout(()=>b(!1),2500)},Re=()=>{navigator.clipboard.writeText(ae),j(!0),setTimeout(()=>j(!1),2500)},ze=async(t=`full`)=>{re(!0),s(null),l(null),A([]);try{let n=await G.checkAdminWebhookVersion().catch(()=>({scriptVersion:0,isOutdated:!1}));if(n.scriptVersion>0&&n.scriptVersion<10)throw w(n.scriptVersion),S(!0),v(!0),Error(`السكربت المنشور حالياً على شيت الأدمن هو الإصدار (v${n.scriptVersion}) ولا يدعم استنساخ الأوراق و Pivot Tables. انسخ كود v10 أدناه ثم Apps Script ← Deploy ← Manage deployments ← Edit ← Version: New version ← Deploy ثم أعد المحاولة.`);let r=e.filter(e=>{let t=ye(e.sheet_url||e.sheet_id);return t&&t!==`1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE`});if(r.length===0){let e=await G.adminSyncTemplateToAllSheets({mode:t});l(e.message||`تمت مزامنة أوراق و Pivot Tables شيت الأدمن لجميع الشيتات بنجاح ✅`),await je();return}let i=[],a=0;for(let e of r){let n=ye(e.sheet_url||e.sheet_id);try{let r=await G.adminSyncTemplateToAllSheets({targetSpreadsheetId:n,mode:t}),o=Array.isArray(r.results)&&r.results[0]?r.results[0]:null,s=o?!!o.ok:Number(r.updatedSheets||0)>0;s&&a++,i.push({repName:e.full_name,sheetId:n,sheetName:o?.sheetName||``,ok:s,tabsCount:Number(o?.tabsCount||0),pivotsCount:Number(o?.pivotsCount||0),tabNames:o?.tabNames||[],errorDetails:o?.errorDetails||o?.error||``})}catch(t){i.push({repName:e.full_name,sheetId:n,ok:!1,tabsCount:0,pivotsCount:0,errorDetails:t?.message||`تعذرت مزامنة شيت المندوب`})}A([...i])}a===r.length?l(`تمت مزامنة أوراق و Pivot Tables الأدمن مع (${a} / ${r.length}) شيتات للمندوبين — كل شيت يقرأ بياناته الخاصة بنجاح ✅`):a>0?l(`تمت مزامنة (${a} / ${r.length}) شيتات، وبعض الشيتات تحتاج التحقق من صلاحية التعديل (Editor). راجع التفاصيل أدناه.`):s(`لم تتم مزامنة أي شيت — تحقق من تفاصيل الأخطاء أدناه وتأكد من مشاركة شيتات المندوبين بصلاحية محرر (Editor) مع حساب باقر.`),await je()}catch(e){s(e?.message||`تعذر مزامنة أوراق و Pivot Tables الأدمن لجميع الشيتات`)}finally{re(!1)}},Be=async()=>{let e=f.trim()||`https://script.google.com/macros/s/AKfycbzCpY1P3iyWJrI2HFjTRvJjsObDMO1Gfpk82nrPuoee021RWKfl3jTfiRBW0bQtFz2I/exec`;if(window.confirm(`⚡ توحيد السكربت المركزي للجميع:\n\nسيتم كتابة رابط سكربت الأدمن المركزي التالي في عمود (D: اي بي اي سكربت) لجميع الحسابات في الشيت الرئيسي لكي ينعكس أي تعديل تقومي به عند الأدمن على الجميع فوراً:\n\n${e}\n\nهل تريد المتابعة؟`)){se(!0),s(null),l(null);try{let t=await G.adminUnifyWebhookUrl(e,`set`);l(t.message||`تم توحيد رابط سكربت الأدمن المركزي لجميع الحسابات بنجاح ⚡`),await je()}catch(e){s(e?.message||`تعذر توحيد رابط السكربت المركزي لجميع المستخدمين`)}finally{se(!1)}}},R=async e=>{if(e.preventDefault(),!de.trim()||!pe.trim())s(`الاسم والرمز السري مطلوبان`);else{a(!0),s(null),l(null);try{let e=await G.adminAddSheetUser({full_name:de.trim(),password:pe.trim(),sheet_url:M.trim(),webhook_url:_e.trim(),gemini_api_key:P.trim()||T.trim()});l(e.message),ue(!1),fe(``),me(``),ge(``),N(``),be(``),await je()}catch(e){s(e?.message||`تعذر إضافة المستخدم للشيت الرئيسي`)}finally{a(!1)}}},Ve=e=>{F(e),Ce(e.full_name||``),Te(e.password_hash||``),L(e.sheet_url||e.sheet_id||``),Oe(e.webhook_url||``),Ae(e.gemini_api_key||``),s(null)},He=async e=>{if(e.preventDefault(),xe){if(!Se.trim()||!we.trim())s(`لا يمكن ترك الاسم أو الرمز السري فارغاً`);else{a(!0),s(null),l(null);try{let e=await G.adminUpdateSheetUser({rowNumber:xe.rowNumber,currentName:xe.full_name,newName:Se.trim(),newPassword:we.trim(),newSheetUrl:Ee.trim(),newWebhookUrl:De.trim(),newGeminiApiKey:ke.trim()});l(e.message),F(null),await je()}catch(e){s(e?.message||`تعذر تعديل السجل في الشيت الرئيسي`)}finally{a(!1)}}}},Ue=async e=>{if(ve(e.full_name,e.email))s(`لا يمكن حذف حساب الأدمن الرئيسي (باقر)`);else if(window.confirm(`⚠️ هل تريد حذف المستخدم "${e.full_name}" (الصف ${e.rowNumber}) من الشيت الرئيسي؟`)){a(!0),s(null),l(null);try{let t=await G.adminDeleteSheetUser({rowNumber:e.rowNumber,currentName:e.full_name});l(t.message),await je()}catch(e){s(e?.message||`تعذر حذف المستخدم`)}finally{a(!1)}}};return(0,q.jsxs)(`div`,{className:`animate-in`,style:{display:`flex`,flexDirection:`column`,gap:`1.25rem`},children:[(0,q.jsxs)(`div`,{className:`page-header`,style:{marginBottom:0},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,marginBottom:`0.4rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`span`,{className:`badge badge-primary`,style:{display:`flex`,alignItems:`center`,gap:4},children:[(0,q.jsx)(tr,{size:13}),` الشيت الرئيسي — صلاحيات الأدمن فقط`]}),(0,q.jsxs)(`span`,{className:`badge badge-success`,style:{display:`flex`,alignItems:`center`,gap:4},children:[(0,q.jsx)(Gr,{size:13}),` تحكم كامل بالإضافة والتعديل والحذف`]})]}),(0,q.jsxs)(`h1`,{className:`page-title`,style:{display:`flex`,alignItems:`center`,gap:`0.6rem`},children:[(0,q.jsx)(di,{size:28,style:{color:`var(--primary)`}}),`إدارة الشيت الرئيسي وقاعدة بيانات المستخدمين`]}),(0,q.jsx)(`p`,{className:`page-subtitle`,children:`فقط حساب باقر يملك صلاحية التلاعب أو تعديل الشيت الرئيسي؛ يدخل كل مستخدم آخر كمندوب إلى صفحة كوكل شيت الخاصة به.`})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.6rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`a`,{href:he,target:`_blank`,rel:`noopener noreferrer`,className:`btn-clay btn-secondary`,style:{textDecoration:`none`,display:`flex`,alignItems:`center`,gap:`0.4rem`,fontWeight:700},children:[(0,q.jsx)(qn,{size:16}),` فتح الشيت الرئيسي في كوكل`]}),(0,q.jsxs)(`button`,{onClick:je,disabled:n,className:`btn-clay btn-secondary`,children:[(0,q.jsx)(Lr,{size:16,className:n?`animate-spin`:``}),` تحديث`]}),(0,q.jsxs)(`button`,{onClick:()=>{ue(!0),s(null)},className:`btn-clay btn-primary`,style:{fontWeight:800},children:[(0,q.jsx)(Fr,{size:18}),` إضافة مستخدم للشيت الرئيسي`]})]})]}),o&&(0,q.jsxs)(`div`,{className:`alert-danger`,style:{display:`flex`,alignItems:`center`,gap:`0.75rem`},children:[(0,q.jsx)(Dn,{size:20}),(0,q.jsx)(`span`,{children:o})]}),c&&(0,q.jsxs)(`div`,{className:`alert-success`,style:{display:`flex`,alignItems:`center`,gap:`0.75rem`},children:[(0,q.jsx)(jn,{size:20,style:{color:`#059669`}}),(0,q.jsx)(`span`,{children:c})]}),x&&(0,q.jsx)(`div`,{className:`card`,style:{background:`#fffbeb`,border:`1.5px solid #f59e0b`,padding:`1rem 1.2rem`},children:(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`0.75rem`},children:[(0,q.jsxs)(`div`,{style:{flex:`1 1 280px`},children:[(0,q.jsxs)(`div`,{style:{fontWeight:900,color:`#92400e`,fontSize:`0.94rem`,display:`flex`,alignItems:`center`,gap:6},children:[(0,q.jsx)(ri,{size:18,style:{color:`#d97706`}}),`ترقية سكربت الأدمن المركزي إلى الإصدار 10 (v10)`,C?` — النسخة الحية الآن: v${C}`:``]}),(0,q.jsxs)(`div`,{style:{fontSize:`0.78rem`,color:`#78350f`,marginTop:4,lineHeight:1.55},children:[`الإصدار `,(0,q.jsx)(`strong`,{children:`v10`}),` مطلوب لتفعيل استنساخ أوراق و Pivot Tables الأدمن لجميع المندوبين (ببيانات كل مندوب الخاصة) وتوحيد عمود D. عند النشر في Google Apps Script تأكد من اختيار: `,(0,q.jsx)(`strong`,{children:`Deploy ← Manage deployments ← Edit ← Version: New version ← Deploy`}),`.`]})]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>{Le(),v(!0)},className:`btn-clay btn-primary btn-sm`,style:{fontWeight:800,background:`#d97706`,borderColor:`#b45309`},children:[y?(0,q.jsx)(yn,{size:15}):(0,q.jsx)(Vn,{size:15}),y?`تم نسخ كود v10!`:`نسخ كود Apps Script v10`]})]})}),(0,q.jsxs)(`div`,{className:`card`,style:{padding:`1.1rem 1.2rem`,border:`1.5px solid #bae6fd`,background:`linear-gradient(135deg, #f8fafc, #ecfeff)`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`0.75rem`},children:[(0,q.jsxs)(`div`,{style:{flex:`1 1 280px`},children:[(0,q.jsxs)(`h4`,{style:{fontWeight:800,margin:`0 0 0.25rem 0`,color:`#0c4a6e`,display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,q.jsx)(qr,{size:18,style:{color:`#0284c7`}}),`توحيد القوالب (Pivot Tables) والسكربت المركزي لجميع الشيتات (v10)`]}),(0,q.jsxs)(`p`,{style:{fontSize:`0.78rem`,color:`#0369a1`,margin:0,lineHeight:1.55},children:[`أي ورقة أو Pivot Table تعدّه في شيت الأدمن يمكنك استنساخه لجميع المندوبين بضغطة واحدة بحيث يقرأ كل Pivot Table من `,(0,q.jsx)(`strong`,{children:`فواتير ذلك المندوب فقط`}),` دون خلط البيانات.`]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.5rem`,flexWrap:`wrap`},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>ze(`full`),disabled:O||i,className:`btn-clay btn-primary btn-sm`,style:{fontWeight:800,background:`#0284c7`,borderColor:`#0369a1`},children:[(0,q.jsx)(Lr,{size:15,className:O?`animate-spin`:``}),O?`جارِ مزامنة القوالب...`:`🔄 استنساخ أوراق و Pivot Tables الأدمن للجميع`]}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>ze(`tabs_only`),disabled:O||i,className:`btn-clay btn-secondary btn-sm`,style:{fontWeight:700},title:`نسخ أسماء وهيكل الأوراق فقط بدون إعادة بناء Pivot Tables`,children:`📑 مزامنة هيكل الأوراق فقط`}),(0,q.jsxs)(`button`,{type:`button`,onClick:Be,disabled:oe||i,className:`btn-clay btn-secondary btn-sm`,style:{fontWeight:800},children:[(0,q.jsx)(qr,{size:15,className:oe?`animate-spin`:``}),oe?`جارِ التوحيد...`:`⚡ توحيد عمود D على سكربت الأدمن المركزي للجميع`]})]})]}),ie.length>0&&(0,q.jsx)(`div`,{style:{marginTop:`0.9rem`,paddingTop:`0.85rem`,borderTop:`1px dashed #7dd3fc`,display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(220px, 1fr))`,gap:`0.55rem`},children:ie.map(e=>(0,q.jsxs)(`div`,{style:{background:e.ok?`#f0fdf4`:`#fef2f2`,border:`1px solid ${e.ok?`#86efac`:`#fca5a5`}`,borderRadius:10,padding:`0.55rem 0.75rem`,fontSize:`0.76rem`},children:[(0,q.jsxs)(`div`,{style:{fontWeight:900,color:e.ok?`#166534`:`#991b1b`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},children:[(0,q.jsxs)(`span`,{children:[e.ok?`✅`:`❌`,` `,e.repName]}),(0,q.jsxs)(`span`,{children:[e.tabsCount,` أوراق • `,e.pivotsCount,` Pivot`]})]}),e.tabNames&&e.tabNames.length>0&&(0,q.jsxs)(`div`,{style:{color:`#15803d`,marginTop:3},children:[`الأوراق: `,e.tabNames.join(`، `)]}),e.errorDetails&&(0,q.jsx)(`div`,{style:{color:`#b91c1c`,marginTop:3,wordBreak:`break-word`},children:e.errorDetails})]},e.sheetId))})]}),(0,q.jsxs)(`div`,{className:`card`,style:{padding:`1.15rem 1.2rem`,border:`1.5px solid #c7d2fe`,background:`linear-gradient(135deg, #f8fafc, #eef2ff)`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`0.5rem`,marginBottom:`0.65rem`},children:[(0,q.jsxs)(`h4`,{style:{fontWeight:800,margin:0,display:`flex`,alignItems:`center`,gap:`0.5rem`,color:`#1e1b4b`},children:[(0,q.jsx)(lr,{size:18,style:{color:`#4f46e5`}}),`مفتاح Google Gemini API الموحد لجميع المستخدمين (العمود E: اي بي اي جمناي)`]}),T.trim()&&(0,q.jsx)(`span`,{className:`badge badge-success`,children:`مفعّل لجميع المندوبين ✓`})]}),(0,q.jsxs)(`p`,{style:{fontSize:`0.78rem`,color:`#4338ca`,margin:`0 0 0.75rem 0`,lineHeight:1.5},children:[`أي تغيير هنا يُكتب مباشرة في عمود `,(0,q.jsx)(`strong`,{children:`اي بي اي جمناي`}),` بالشيت الرئيسي ويتعمم تلقائياً عند كل المستخدمين (الهاتف والحاسوب والخادم) في نفس الوقت دون الحاجة لإدخال المفتاح لدى كل مندوب.`]}),(0,q.jsxs)(`form`,{onSubmit:Me,style:{display:`flex`,gap:`0.5rem`,flexWrap:`wrap`},children:[(0,q.jsx)(`input`,{type:E?`text`:`password`,className:`clay-input`,style:{flex:`1 1 260px`,fontSize:`0.82rem`,direction:`ltr`,background:`#ffffff`},placeholder:`AIzaSy... أو AQ...`,value:T,onChange:e=>ee(e.target.value)}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>te(e=>!e),className:`btn-clay btn-secondary btn-sm`,style:{fontWeight:700},children:[E?(0,q.jsx)(Yn,{size:14}):(0,q.jsx)(Zn,{size:14}),E?`إخفاء`:`إظهار`]}),(0,q.jsx)(`button`,{type:`submit`,disabled:D,className:`btn-clay btn-primary btn-sm`,style:{fontWeight:800},children:D?`جارِ التعميم في الشيت...`:`حفظ وتعميم المفتاح على الجميع`})]})]}),(0,q.jsxs)(`div`,{className:`card`,style:{padding:`1.2rem`},children:[(0,q.jsx)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`1rem`,flexWrap:`wrap`,gap:`0.5rem`},children:(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`h4`,{style:{fontWeight:800,margin:`0 0 0.2rem 0`},children:[`جدول الحسابات في الشيت الرئيسي (`,e.length,` مستخدم)`]}),(0,q.jsx)(`span`,{style:{fontSize:`0.76rem`,color:`var(--gray-500)`},children:`الأعمدة الحقيقية: A: الاسم | B: الرمز السري | C: صفحة كوكل شيت | D: اي بي اي سكربت | E: اي بي اي جمناي`})]})}),n?(0,q.jsxs)(`div`,{style:{textAlign:`center`,padding:`3rem`},children:[(0,q.jsx)(Lr,{size:32,className:`animate-spin`,style:{color:`var(--primary)`,marginBottom:10}}),(0,q.jsx)(`div`,{style:{fontWeight:700,color:`var(--gray-600)`},children:`جارِ قراءة الشيت الرئيسي مباشرة...`})]}):e.length===0?(0,q.jsxs)(`div`,{style:{textAlign:`center`,padding:`3rem`,background:`var(--gray-50)`,borderRadius:12},children:[(0,q.jsx)(di,{size:48,style:{color:`var(--gray-300)`,marginBottom:10}}),(0,q.jsx)(`h5`,{style:{fontWeight:800,color:`var(--gray-700)`},children:`لم يتم العثور على مستخدمين`}),(0,q.jsx)(`p`,{style:{fontSize:`0.82rem`,color:`var(--gray-500)`},children:`تأكد من مشاركة الشيت الرئيسي كـ (Anyone with the link can view) أو أضف أول مستخدم من الزر أعلاه.`})]}):(0,q.jsx)(`div`,{className:`table-responsive`,children:(0,q.jsxs)(`table`,{className:`clay-table`,style:{width:`100%`,fontSize:`0.82rem`},children:[(0,q.jsx)(`thead`,{children:(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`th`,{style:{width:52,textAlign:`center`},children:`الصف`}),(0,q.jsx)(`th`,{children:`الاسم`}),(0,q.jsx)(`th`,{style:{textAlign:`center`},children:`الرمز السري`}),(0,q.jsx)(`th`,{style:{textAlign:`center`},children:`الدور`}),(0,q.jsx)(`th`,{children:`صفحة كوكل شيت الخاصة`}),(0,q.jsx)(`th`,{children:`رابط اي بي اي سكربت`}),(0,q.jsx)(`th`,{children:`مفتاح جمناي (E)`}),(0,q.jsx)(`th`,{style:{textAlign:`center`},children:`إجراءات`})]})}),(0,q.jsx)(`tbody`,{children:e.map(e=>{let t=!!u[e.rowNumber],n=e.role===`admin`;return(0,q.jsxs)(`tr`,{children:[(0,q.jsx)(`td`,{style:{textAlign:`center`,color:`var(--gray-500)`,fontWeight:800},children:e.rowNumber}),(0,q.jsx)(`td`,{style:{fontWeight:900,color:`var(--gray-900)`},children:e.full_name}),(0,q.jsx)(`td`,{style:{textAlign:`center`},children:(0,q.jsxs)(`div`,{style:{display:`inline-flex`,alignItems:`center`,gap:6,direction:`ltr`},children:[(0,q.jsx)(`code`,{style:{fontWeight:700,background:`#f1f5f9`,padding:`2px 8px`,borderRadius:6},children:t?e.password_hash||`—`:`••••••`}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>Ne(e.rowNumber),style:{background:`none`,border:`none`,cursor:`pointer`,color:`var(--gray-500)`,padding:2},title:t?`إخفاء الرمز`:`إظهار الرمز`,children:t?(0,q.jsx)(Yn,{size:14}):(0,q.jsx)(Zn,{size:14})})]})}),(0,q.jsx)(`td`,{style:{textAlign:`center`},children:(0,q.jsx)(`span`,{className:`badge ${n?`badge-primary`:`badge-success`}`,children:n?`أدمن (باقر)`:`مندوب`})}),(0,q.jsx)(`td`,{style:{fontSize:`0.76rem`},children:e.sheet_url?(0,q.jsxs)(`a`,{href:e.sheet_url,target:`_blank`,rel:`noopener noreferrer`,style:{color:`var(--primary)`,fontWeight:700,textDecoration:`none`,display:`inline-flex`,alignItems:`center`,gap:4},children:[(0,q.jsx)(qn,{size:12}),` `,e.sheet_id?`${e.sheet_id.slice(0,14)}...`:`فتح الشيت`]}):(0,q.jsx)(`span`,{style:{color:`#b91c1c`,fontWeight:800},children:`⛔ بدون قاعدة بيانات (محظور)`})}),(0,q.jsx)(`td`,{style:{fontSize:`0.75rem`,direction:`ltr`,textAlign:`left`,color:`var(--gray-600)`},children:e.webhook_url?(0,q.jsx)(`span`,{className:`badge badge-success`,title:e.webhook_url,children:`مربوط ✓`}):(0,q.jsx)(`span`,{className:`badge badge-gray`,children:`افتراضي`})}),(0,q.jsx)(`td`,{style:{fontSize:`0.75rem`,textAlign:`center`},children:e.gemini_api_key?(0,q.jsx)(`span`,{className:`badge badge-primary`,title:e.gemini_api_key,children:`مربوط ✓`}):T?(0,q.jsx)(`span`,{className:`badge badge-success`,title:`يستخدم المفتاح الموحد من الشيت الرئيسي`,children:`موحد ✓`}):(0,q.jsx)(`span`,{className:`badge badge-gray`,children:`غير محدد`})}),(0,q.jsx)(`td`,{style:{textAlign:`center`,whiteSpace:`nowrap`},children:(0,q.jsxs)(`div`,{style:{display:`inline-flex`,gap:`0.35rem`},children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>Ve(e),disabled:i,className:`btn-clay btn-secondary btn-sm`,style:{padding:`0.3rem 0.65rem`,fontWeight:700},children:[(0,q.jsx)(kr,{size:13}),` تعديل`]}),!n&&(0,q.jsxs)(`button`,{type:`button`,onClick:()=>Ue(e),disabled:i,className:`btn-clay btn-danger btn-sm`,style:{padding:`0.3rem 0.65rem`,background:`#fee2e2`,color:`#b91c1c`,borderColor:`#fecaca`,fontWeight:700},children:[(0,q.jsx)($r,{size:13}),` حذف`]})]})})]},`${e.rowNumber}-${e.full_name}`)})})]})})]}),(0,q.jsxs)(`div`,{className:`card`,style:{padding:`1.2rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`0.5rem`,marginBottom:`0.75rem`},children:[(0,q.jsxs)(`h4`,{style:{fontWeight:800,margin:0,display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,q.jsx)(Ur,{size:18,style:{color:`var(--primary)`}}),`رابط سكربت التحكم بالشيت الرئيسي (Admin Apps Script Webhook)`]}),m&&(0,q.jsx)(`span`,{className:`badge badge-success`,children:`تم حفظ رابط الأدمن ✓`})]}),(0,q.jsxs)(`form`,{onSubmit:Ie,style:{display:`flex`,gap:`0.5rem`,flexWrap:`wrap`,marginBottom:`0.75rem`},children:[(0,q.jsx)(`input`,{type:`url`,className:`clay-input`,style:{flex:`1 1 260px`,fontSize:`0.8rem`,direction:`ltr`},placeholder:`https://script.google.com/macros/s/.../exec`,value:f,onChange:e=>p(e.target.value)}),(0,q.jsx)(`button`,{type:`submit`,className:`btn-clay btn-primary btn-sm`,style:{fontWeight:700},children:`حفظ رابط السكربت الرئيسي`}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>v(!g),className:`btn-clay btn-secondary btn-sm`,style:{fontWeight:700},children:[(0,q.jsx)(qr,{size:14}),` `,g?`إخفاء كود v10`:`عرض كود Apps Script v10`]})]}),g&&(0,q.jsxs)(`div`,{style:{background:`#f8fafc`,border:`1px solid #cbd5e1`,borderRadius:12,padding:`1rem`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`0.5rem`,flexWrap:`wrap`,gap:`0.5rem`},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.8rem`,fontWeight:800,color:`#1e293b`},children:`الصق هذا الكود في شيت الأدمن (Extensions ← Apps Script) ثم Deploy ← Manage deployments ← Edit ← New version`}),(0,q.jsxs)(`button`,{type:`button`,onClick:Le,className:`btn-clay btn-primary btn-sm`,style:{fontWeight:700},children:[y?(0,q.jsx)(yn,{size:14}):(0,q.jsx)(Vn,{size:14}),y?`تم النسخ!`:`نسخ الكود المركزي v10 بالكامل`]})]}),(0,q.jsx)(`pre`,{style:{background:`#0f172a`,color:`#38bdf8`,padding:`0.9rem`,borderRadius:10,fontSize:`0.72rem`,maxHeight:220,overflowY:`auto`,direction:`ltr`,textAlign:`left`,margin:0},children:`var SPREADSHEET_ID = '1zKhTz-jI-Fnw3zCh0zywSClIPSuNyyOJRiF_A8yLBFE';
var ADMIN_USERS_SHEET_ID = '1_CBGFeFrTaw6L_7U1ztdAZ3gJjjVMEpUhE8oyUn-NjI';
var SCRIPT_VERSION = 10;
var TEMPLATE_SYNC_GUARD = false;

var DATA_COL_KEYS = [
  'invoice_number', 'invoice_date', 'warehouse_name', 'pharmacy_name',
  'area', 'city', 'product_name', 'dosage_form',
  'quantity', 'unit_price', 'bonus_quantity', 'line_total',
  'total_invoice', 'rep_name', 'status', 'timestamp', 'loyalty'
];

function extractSheetIdFromUrl(val) {
  var s = String(val || '').trim();
  if (!s) return '';
  var m = s.match(/\\/spreadsheets\\/d\\/([a-zA-Z0-9-_]+)/);
  if (m && m[1]) return m[1];
  if (/^[a-zA-Z0-9-_]{20,}$/.test(s)) return s;
  return '';
}

function getTargetSpreadsheet(customSpreadsheetId) {
  var targetId = extractSheetIdFromUrl(customSpreadsheetId) || String(customSpreadsheetId || '').trim();
  if (targetId && targetId !== SPREADSHEET_ID) {
    try {
      var opened = SpreadsheetApp.openById(targetId);
      if (opened) return opened;
    } catch (e) {}
  }
  try {
    var ssDefault = SpreadsheetApp.openById(targetId || SPREADSHEET_ID);
    if (ssDefault) return ssDefault;
  } catch (e2) {}
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e3) {}
  return null;
}

function sheetHasPivotTables(sheet) {
  try {
    return Boolean(sheet && typeof sheet.getPivotTables === 'function' && sheet.getPivotTables().length > 0);
  } catch (e) {
    return false;
  }
}

function isUsersSheetObj(sheet) {
  if (!sheet) return false;
  try {
    var parentId = sheet.getParent().getId();
    if (parentId === ADMIN_USERS_SHEET_ID) return true;
  } catch (e) {}
  var name = String(sheet.getName() || '').trim();
  if (name === 'المستخدمون' || name.toLowerCase() === 'users') return true;
  try {
    if (sheet.getLastRow() > 0) {
      var row1 = sheet.getRange(1, 1, 1, Math.min(4, Math.max(1, sheet.getLastColumn()))).getValues()[0];
      var a = normAr(row1[0]);
      var b = normAr(row1[1]);
      if ((a.indexOf('الاسم') !== -1 && b.indexOf('الرمز') !== -1) || (a === 'id' && b.indexOf('full_name') !== -1)) {
        return true;
      }
    }
  } catch (e2) {}
  return false;
}

function findInvoiceDataSheet(ss, preferredName) {
  if (!ss) return null;
  var pref = String(preferredName || '').trim();
  if (pref && pref !== 'الفواتير') {
    var named = ss.getSheetByName(pref);
    if (named && !isUsersSheetObj(named) && !sheetHasPivotTables(named)) return named;
  }
  var candidates = ['الفواتير', 'Sheet1', 'الورقة1', 'المبيعات'];
  for (var c = 0; c < candidates.length; c++) {
    var cs = ss.getSheetByName(candidates[c]);
    if (cs && !isUsersSheetObj(cs) && !sheetHasPivotTables(cs)) return cs;
  }
  var all = ss.getSheets();
  for (var i = 0; i < all.length; i++) {
    var s = all[i];
    if (isUsersSheetObj(s) || sheetHasPivotTables(s)) continue;
    try {
      if (s.getLastRow() > 0) {
        var r1 = s.getRange(1, 1, 1, Math.min(6, Math.max(1, s.getLastColumn()))).getValues()[0];
        for (var k = 0; k < r1.length; k++) {
          var hk = normAr(r1[k]);
          if (hk.indexOf('رقم الفاتور') !== -1 || hk.indexOf('اسم الصيدلي') !== -1) return s;
        }
      }
    } catch (e) {}
  }
  for (var j = 0; j < all.length; j++) {
    if (!isUsersSheetObj(all[j]) && !sheetHasPivotTables(all[j])) return all[j];
  }
  return null;
}

function getTargetSheet(customSpreadsheetId, preferredSheetName) {
  var ss = getTargetSpreadsheet(customSpreadsheetId);
  if (!ss) return null;
  return findInvoiceDataSheet(ss, preferredSheetName);
}

function getOrCreateUsersSheet(adminSpreadsheetId) {
  var targetId = extractSheetIdFromUrl(adminSpreadsheetId) || String(adminSpreadsheetId || ADMIN_USERS_SHEET_ID).trim();
  var ss = null;
  if (targetId) {
    try { ss = SpreadsheetApp.openById(targetId); } catch (e) {}
  }
  if (!ss) ss = getTargetSpreadsheet('');
  if (!ss) return null;

  var allSheets = ss.getSheets();
  for (var s = 0; s < allSheets.length; s++) {
    var cand = allSheets[s];
    if (cand.getLastRow() > 0) {
      var r1 = cand.getRange(1, 1, 1, Math.min(4, Math.max(1, cand.getLastColumn()))).getValues()[0];
      var c0 = normAr(r1[0]);
      var c1 = normAr(r1[1]);
      if (c0.indexOf('الاسم') !== -1 || c1.indexOf('الرمز') !== -1 || c0 === 'id') {
        return cand;
      }
    }
  }

  var sheet = ss.getSheetByName('المستخدمون') || ss.getSheets()[0];
  if (!sheet) sheet = ss.insertSheet('المستخدمون');
  if (sheet.getLastRow() === 0) {
    var masterHeaders = ['الاسم', 'الرمز السري', 'صفحة كوكل شيت', 'اي بي اي سكربت', 'اي بي اي جمناي'];
    sheet.appendRow(masterHeaders);
    sheet.getRange(1, 1, 1, masterHeaders.length).setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
  }
  return sheet;
}

function resolveUserColMap(headers) {
  var norm = [];
  for (var i = 0; i < headers.length; i++) norm.push(normAr(headers[i]));
  var findIdx = function(patterns) {
    for (var c = 0; c < norm.length; c++) {
      if (!norm[c]) continue;
      for (var p = 0; p < patterns.length; p++) {
        if (norm[c].indexOf(patterns[p]) !== -1) return c;
      }
    }
    return -1;
  };
  var isLegacy = norm[0] === 'id' || (norm[0] && norm[0].indexOf('معرف') !== -1);
  if (!isLegacy) {
    return {
      isLegacy: false,
      nameCol: findIdx(['الاسم', 'full_name', 'name']) >= 0 ? findIdx(['الاسم', 'full_name', 'name']) : 0,
      passCol: findIdx(['الرمز السري', 'كلمه المرور', 'الرمز', 'password', 'pin']) >= 0 ? findIdx(['الرمز السري', 'كلمه المرور', 'الرمز', 'password', 'pin']) : 1,
      sheetCol: findIdx(['صفحه كوكل شيت', 'شيت', 'sheet']) >= 0 ? findIdx(['صفحه كوكل شيت', 'شيت', 'sheet']) : 2,
      webhookCol: findIdx(['اي بي اي سكربت', 'سكربت', 'webhook', 'script']) >= 0 ? findIdx(['اي بي اي سكربت', 'سكربت', 'webhook', 'script']) : 3,
      emailCol: findIdx(['email', 'بريد', 'username']),
      idCol: findIdx(['معرف']),
      roleCol: findIdx(['role', 'دور', 'صلاحيه']),
      activeCol: findIdx(['is_active', 'الحاله']),
      geminiCol: findIdx(['اي بي اي جمناي', 'مفتاح جمناي', 'جمناي', 'gemini', 'مفتاح'])
    };
  }
  return {
    isLegacy: true, idCol: 0, nameCol: 1, emailCol: 2, passCol: 3,
    roleCol: 4, activeCol: 5, geminiCol: 6, sheetCol: 7, webhookCol: 8
  };
}

function ensureMasterGeminiColumn(usersSheet, forcedColZeroIdx) {
  if (!usersSheet) return 4;
  var lastCol = Math.max(4, usersSheet.getLastColumn());
  var headers = usersSheet.getLastRow() > 0 ? usersSheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  var uMap = resolveUserColMap(headers);
  if (uMap.geminiCol >= 0) return uMap.geminiCol;
  var targetCol = (forcedColZeroIdx !== undefined && forcedColZeroIdx >= 4) ? forcedColZeroIdx : 4;
  for (var gc = 4; gc < headers.length; gc++) {
    if (!String(headers[gc] || '').trim()) { targetCol = gc; break; }
    if (gc === headers.length - 1 && String(headers[gc] || '').trim()) { targetCol = headers.length; }
  }
  if (targetCol < 4) targetCol = 4;
  try {
    usersSheet.getRange(1, targetCol + 1).setValue('اي بي اي جمناي').setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
  } catch (e) {}
  return targetCol;
}

function propagateGeminiKeyToAllUserRows(usersSheet, targetGemCol, gemKeyVal) {
  if (!usersSheet) return;
  var lastRow = usersSheet.getLastRow();
  var lastCol = Math.max(4, usersSheet.getLastColumn());
  var headers = lastRow > 0 ? usersSheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  var uMap = resolveUserColMap(headers);
  for (var gr = 2; gr <= lastRow; gr++) {
    var rowNameG = String(usersSheet.getRange(gr, uMap.nameCol + 1).getValue() || '').trim();
    if (rowNameG) {
      usersSheet.getRange(gr, targetGemCol + 1).setValue(gemKeyVal);
    }
  }
}

function isBaqerName(name, email) {
  var n = normAr(name).replace(/^(د\\.|دكتور)\\s+/i, '').trim();
  var e = String(email || '').trim().toLowerCase();
  return n === 'باقر' || n === 'باقر علي' || n.indexOf('باقر ') === 0 || n === 'baqer' || n === 'baqir' || e === 'baqer@pharma.com' || e === 'admin@pharma.com';
}

function readAllSheetUsers(sheet) {
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var uMap = resolveUserColMap(headers);
  var users = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var fullName = String(row[uMap.nameCol] || '').trim();
    var emailVal = uMap.emailCol >= 0 ? String(row[uMap.emailCol] || '').trim().toLowerCase() : '';
    var idVal = uMap.idCol >= 0 ? String(row[uMap.idCol] || '').trim() : '';
    if (!fullName && !emailVal) continue;
    var nCheck = normAr(fullName);
    if (nCheck === 'الاسم' || nCheck === 'full_name' || idVal.toLowerCase() === 'id') continue;
    var role = isBaqerName(fullName, emailVal) ? 'admin' : 'medical_rep';
    var activeRaw = uMap.activeCol >= 0 ? String(row[uMap.activeCol] === undefined ? 'TRUE' : row[uMap.activeCol]).trim().toUpperCase() : 'TRUE';
    if (activeRaw === 'FALSE' || activeRaw === '0' || activeRaw === 'معطل') continue;
    var rawGem = uMap.geminiCol >= 0 ? String(row[uMap.geminiCol] || '').trim() : '';
    if (!rawGem) {
      for (var c = 4; c < row.length; c++) {
        var cv = String(row[c] || '').trim();
        if (/^(AIza|AQ\\.)/.test(cv)) { rawGem = cv; break; }
      }
    }
    users.push({
      rowNumber: i + 1,
      id: idVal || ('sheet-usr-' + (i + 1)),
      full_name: fullName || emailVal.split('@')[0],
      email: emailVal || (fullName.toLowerCase().replace(/\\s+/g, '_') + '@pharma.com'),
      password_hash: String(row[uMap.passCol] || '').trim(),
      role: role,
      is_active: true,
      gemini_api_key: rawGem,
      sheet_id: String(row[uMap.sheetCol] || '').trim(),
      webhook_url: String(row[uMap.webhookCol] || '').trim()
    });
  }
  return users;
}

function getExpectedCols(sheet) {
  var headers = [
    'رقم الفاتورة',
    'تاريخ الفاتورة',
    'اسم المذخر',
    'اسم الصيدلية',
    'المنطقة / المكان',
    'المدينة / المحافظة',
    'اسم المادة الدوائية',
    'نوع المادة / الشكل الدوائي',
    'الكمية',
    'سعر المفرد (د.ع)',
    'البونص المجاني',
    'المجموع (د.ع)',
    'صافي الفاتورة الكلي (د.ع)',
    'اسم المندوب العلمي',
    'حالة الاعتماد',
    'وقت وتاريخ الإدراج'
  ];
  if (sheet && sheet.getLastRow() > 0 && sheet.getLastColumn() > 16) {
    var existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    for (var c = 16; c < existing.length; c++) {
      var label = String(existing[c] || '').trim();
      if (label) headers.push(label);
    }
  }
  return headers;
}

function normAr(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[\\u064B-\\u0652\\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/\\s+/g, ' ')
    .trim();
}

function normPh(s) {
  return normAr(s).replace(/^(صيدلية|صيدليه|مذخر|ص\\.?)\\s+/gi, '').trim();
}

function normProd(s) {
  return normAr(s).replace(/[^a-z0-9\\u0621-\\u064a]/gi, '');
}

function formatYmd(val) {
  if (!val) return '';
  if (val instanceof Date) {
    try { return Utilities.formatDate(val, 'Asia/Baghdad', 'yyyy-MM-dd'); } catch (e) {}
  }
  var s = String(val).trim();
  var m = s.match(/^(\\d{4})[-/](\\d{1,2})[-/](\\d{1,2})/);
  if (m) return m[1] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[3]).slice(-2);
  var us = s.match(/^(\\d{1,2})[/-](\\d{1,2})[/-](\\d{4})$/);
  if (us) {
    var p1 = Number(us[1]), p2 = Number(us[2]);
    var mo = p1 > 12 ? p2 : p1;
    var dy = p1 > 12 ? p1 : p2;
    return us[3] + '-' + ('0' + mo).slice(-2) + '-' + ('0' + dy).slice(-2);
  }
  return s.split('T')[0];
}

function detectDosage(name) {
  var p = String(name || '').toLowerCase();
  if (p.indexOf('drop') !== -1 || p.indexOf('قطرة') !== -1 || p.indexOf('drups') !== -1 || p.indexOf('hyfresh') !== -1 || p.indexOf('loxtra') !== -1) return 'قطرة';
  if (p.indexOf('cream') !== -1 || p.indexOf('كريم') !== -1 || p.indexOf('elica') !== -1 || p.indexOf('fucidin') !== -1) return 'كريم';
  if (p.indexOf('oint') !== -1 || p.indexOf('مرهم') !== -1) return 'مرهم';
  return 'حبوب';
}

function detectAreaFromPh(phName) {
  var s = normAr(phName);
  var areas = [
    ['فلسطين', 'شارع فلسطين'], ['كراده', 'الكرادة'], ['منصور', 'المنصور'],
    ['زعفرانيه', 'الزعفرانية'], ['مدينة الصدر', 'مدينة الصدر'], ['مدينه الصدر', 'مدينة الصدر'],
    ['صدر', 'مدينة الصدر'], ['اعظميه', 'الأعظمية'], ['كاظميه', 'الكاظمية'],
    ['دوره', 'الدورة'], ['بياع', 'البياع'], ['عامريه', 'العامرية'],
    ['غزاليه', 'الغزالية'], ['شعب', 'الشعب'], ['زيونه', 'زيونة'],
    ['بغداد الجديده', 'بغداد الجديدة'], ['جادرية', 'الجادرية'], ['جادريه', 'الجادرية'],
    ['حارثيه', 'الحارثية'], ['سيديه', 'السيدية'], ['بلديات', 'البلديات'],
    ['حبيبيه', 'الحبيبية'], ['يرموك', 'اليرموك'], ['جامعه', 'حي الجامعة'],
    ['حي اور', 'حي أور'], ['مشتل', 'المشتل'], ['غدير', 'الغدير'],
    ['خضراء', 'حي الخضراء'], ['قاهره', 'القاهرة'], ['صليخ', 'الصليخ'],
    ['شعله', 'الشعلة'], ['بسمايه', 'بسماية'], ['محموديه', 'المحمودية'],
    ['مدائن', 'المدائن'], ['ابو غريب', 'أبو غريب'], ['طارميه', 'الطارمية'],
    ['كرخ', 'الكرخ'], ['رصافه', 'الرصافة']
  ];
  for (var i = 0; i < areas.length; i++) {
    if (s.indexOf(areas[i][0]) !== -1) return areas[i][1];
  }
  var slashMatch = String(phName || '').match(/[\\/-]\\s*([^\\n\\r\\/-]{3,25})$/);
  if (slashMatch && slashMatch[1] && slashMatch[1].trim().length >= 3) return slashMatch[1].trim();
  return 'مركز المدينة';
}

function isKnownCityName(val) {
  var v = normAr(val);
  var cities = ['بغداد', 'البصره', 'اربيل', 'النجف', 'كربلاء', 'الموصل', 'نينوى', 'بابل', 'الحله', 'كركوك', 'ديالى', 'الانبار', 'واسط', 'ذي قار', 'ميسان', 'المثنى', 'القادسيه', 'الديوانيه', 'صلاح الدين', 'دهوك', 'السليمانيه'];
  for (var i = 0; i < cities.length; i++) {
    if (v === cities[i]) return true;
  }
  return false;
}

function isShiftedOldRow(row) {
  var c4 = String(row[4] || '').trim();
  var c5 = String(row[5] || '').trim();
  var c6Num = Number(row[6]);
  var c13 = String(row[13] || '').trim();
  var c14 = String(row[14] || '').trim();
  if (row.length < 16) return true;
  if (c5 !== '' && !isNaN(c6Num) && c6Num > 0 && c13 && c13.indexOf(':') !== -1 && !c14 && !String(row[15] || '').trim()) return true;
  if (isKnownCityName(c4) && !isNaN(c6Num) && c6Num > 0 && c5 !== '' && isNaN(Number(c5)) && !c14 && !String(row[15] || '').trim()) return true;
  return false;
}

function resolveColMap(headers) {
  var hasArea = false;
  var hasDosage = false;
  for (var k = 0; k < headers.length; k++) {
    var hk = normAr(headers[k]);
    if (hk.indexOf('المنطق') !== -1 || hk.indexOf('المكان') !== -1) hasArea = true;
    if (hk.indexOf('نوع الماد') !== -1 || hk.indexOf('الشكل الدوائي') !== -1) hasDosage = true;
  }
  var map = {
    invoice_number: 0, invoice_date: 1, warehouse_name: 2, pharmacy_name: 3,
    area: hasArea ? 4 : -1,
    city: hasArea ? 5 : 4,
    product_name: hasArea ? 6 : 5,
    dosage_form: hasDosage ? 7 : -1,
    quantity: (hasArea && hasDosage) ? 8 : 6,
    unit_price: (hasArea && hasDosage) ? 9 : 7,
    bonus_quantity: (hasArea && hasDosage) ? 10 : 8,
    line_total: (hasArea && hasDosage) ? 11 : 9,
    total_invoice: (hasArea && hasDosage) ? 12 : 10,
    rep_name: (hasArea && hasDosage) ? 13 : 11,
    status: (hasArea && hasDosage) ? 14 : 12,
    timestamp: (hasArea && hasDosage) ? 15 : 13,
    loyalty: (hasArea && hasDosage) ? 16 : 14
  };
  for (var c = 0; c < headers.length; c++) {
    var h = normAr(headers[c]);
    if (!h) continue;
    if (h.indexOf('رقم الفاتور') !== -1) map.invoice_number = c;
    else if (h.indexOf('تاريخ الفاتور') !== -1) map.invoice_date = c;
    else if (h.indexOf('المذخر') !== -1) map.warehouse_name = c;
    else if (h.indexOf('اسم الصيدلي') !== -1) map.pharmacy_name = c;
    else if (h.indexOf('المنطق') !== -1 || h.indexOf('المكان') !== -1) map.area = c;
    else if (h.indexOf('المدين') !== -1 || h.indexOf('المحافظ') !== -1) map.city = c;
    else if (h.indexOf('اسم الماد') !== -1 || h.indexOf('الماده الدوائي') !== -1) map.product_name = c;
    else if (h.indexOf('نوع الماد') !== -1 || h.indexOf('الشكل الدوائي') !== -1) map.dosage_form = c;
    else if (h === 'الكميه' || h.indexOf('الكمي') !== -1) map.quantity = c;
    else if (h.indexOf('سعر المفرد') !== -1) map.unit_price = c;
    else if (h.indexOf('البونص') !== -1) map.bonus_quantity = c;
    else if (h.indexOf('صافي الفاتور') !== -1) map.total_invoice = c;
    else if (h.indexOf('المجموع') !== -1) map.line_total = c;
    else if (h.indexOf('المندوب') !== -1) map.rep_name = c;
    else if (h.indexOf('حاله الاعتماد') !== -1 || h.indexOf('الحال') !== -1) map.status = c;
    else if (h.indexOf('وقت وتاريخ') !== -1 || h.indexOf('الادراج') !== -1) map.timestamp = c;
    else if (h.indexOf('الولاء') !== -1) map.loyalty = c;
  }
  return map;
}

function buildRowValuesByHeaders(r, headers, existingRow) {
  var totalCols = headers.length;
  var vals = [];
  for (var c = 0; c < totalCols; c++) {
    vals.push(existingRow && existingRow[c] !== undefined ? existingRow[c] : '');
  }
  var colMap = resolveColMap(headers);
  var invNum = String(r.invoice_number || '').trim();
  var phName = String(r.pharmacy_name || (existingRow ? existingRow[colMap.pharmacy_name] : '') || '').trim();
  var resolvedCity = String(r.city || r.pharmacy_city || (existingRow && colMap.city >= 0 ? existingRow[colMap.city] : '') || 'بغداد').trim();
  var resolvedArea = String(r.area || r.pharmacy_area || '').trim();
  if (!resolvedArea && existingRow && colMap.area >= 0) {
    var oldArea = String(existingRow[colMap.area] || '').trim();
    if (oldArea && !isKnownCityName(oldArea)) resolvedArea = oldArea;
  }
  if (!resolvedArea || resolvedArea === 'مركز المدينة') {
    var guessed = detectAreaFromPh(phName);
    if (!resolvedArea || (guessed && guessed !== 'مركز المدينة')) resolvedArea = guessed;
  }
  var prodName = String(r.product_name || (existingRow ? existingRow[colMap.product_name] : '') || '').trim();
  var repName = String(r.rep_name || (existingRow ? existingRow[colMap.rep_name] : '') || 'مندوب علمي').trim();

  vals[colMap.invoice_number] = invNum;
  vals[colMap.invoice_date]   = formatYmd(r.invoice_date);
  vals[colMap.warehouse_name] = r.warehouse_name || (existingRow ? existingRow[colMap.warehouse_name] : '') || 'مذخر الشغف الحديث';
  vals[colMap.pharmacy_name]  = phName;
  if (colMap.area >= 0) vals[colMap.area] = resolvedArea;
  if (colMap.city >= 0) vals[colMap.city] = resolvedCity || 'بغداد';
  vals[colMap.product_name]   = prodName;
  if (colMap.dosage_form >= 0) vals[colMap.dosage_form] = r.dosage_form || detectDosage(prodName);
  vals[colMap.quantity]       = Number(r.quantity || 0);
  vals[colMap.unit_price]     = Number(r.unit_price || 0);
  vals[colMap.bonus_quantity] = Number(r.bonus_quantity || 0);
  vals[colMap.line_total]     = Number(r.line_total || 0);
  vals[colMap.total_invoice]  = Number(r.total_invoice || 0);
  vals[colMap.rep_name]       = repName;
  vals[colMap.status]         = r.status || (existingRow ? existingRow[colMap.status] : '') || 'قيد التدقيق';
  vals[colMap.timestamp]      = r.timestamp || (existingRow ? existingRow[colMap.timestamp] : '') || '';
  if (colMap.loyalty >= 0 && colMap.loyalty < totalCols && r.loyalty !== undefined && r.loyalty !== '') {
    vals[colMap.loyalty] = r.loyalty;
  }
  return vals;
}

function setupSheet(sheet) {
  if (!sheet) sheet = getTargetSheet();
  if (!sheet || isUsersSheetObj(sheet) || sheetHasPivotTables(sheet)) return;
  var headers = getExpectedCols(sheet);
  var totalCols = headers.length;
  var lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.appendRow(headers);
  } else {
    var rawData = sheet.getDataRange().getValues();
    var cleanedData = [];
    var needsRewrite = false;
    var currentHeaders = rawData[0] || [];
    var oldMap = resolveColMap(currentHeaders);
    if (
      currentHeaders.length < 16 ||
      String(currentHeaders[4] || '').trim() !== 'المنطقة / المكان' ||
      String(currentHeaders[5] || '').trim() !== 'المدينة / المحافظة' ||
      String(currentHeaders[7] || '').trim() !== 'نوع المادة / الشكل الدوائي'
    ) {
      needsRewrite = true;
    }
    for (var i = 1; i < rawData.length; i++) {
      var row = rawData[i];
      var invNum = String(row[oldMap.invoice_number] !== undefined ? row[oldMap.invoice_number] : (row[0] || '')).trim();
      var phNameCheck = String(row[oldMap.pharmacy_name] !== undefined ? row[oldMap.pharmacy_name] : (row[3] || '')).trim();
      if (invNum === '123' || (!invNum && !phNameCheck && !row[oldMap.product_name])) { needsRewrite = true; continue; }
      if (oldMap.area >= 0 && isShiftedOldRow(row)) {
        needsRewrite = true;
        var phName = String(row[3] || '').trim();
        var cityName = String(row[4] || 'بغداد').trim();
        var prName = String(row[5] || '').trim();
        var qtyVal = Number(row[6] || 0);
        var priceVal = Number(row[7] || 0);
        var bonusVal = Number(row[8] || 0);
        var lineTotalVal = Number(row[9] || (qtyVal * priceVal));
        var totalInvVal = Number(row[10] || lineTotalVal);
        var maybeRep = String(row[11] || '').trim();
        var maybeStatus = String(row[12] || '').trim();
        var maybeTs = String(row[13] || '').trim();
        if (!maybeRep && maybeTs) maybeRep = 'مندوب علمي';
        if (!maybeStatus) maybeStatus = 'قيد التدقيق';
        var rebuilt14 = [invNum, formatYmd(row[1]), String(row[2] || '').trim(), phName, detectAreaFromPh(phName), cityName || 'بغداد', prName, detectDosage(prName), qtyVal, priceVal, bonusVal, lineTotalVal, totalInvVal, maybeRep, maybeStatus, maybeTs];
        while (rebuilt14.length < totalCols) rebuilt14.push(row[rebuilt14.length] !== undefined ? row[rebuilt14.length] : '');
        cleanedData.push(rebuilt14);
      } else {
        var phM = String(row[oldMap.pharmacy_name] || '').trim();
        var cityM = oldMap.city >= 0 ? String(row[oldMap.city] || '').trim() : '';
        var areaM = oldMap.area >= 0 ? String(row[oldMap.area] || '').trim() : '';
        if (isKnownCityName(areaM) && (!cityM || !isKnownCityName(cityM))) {
          var tmp = cityM;
          cityM = areaM;
          areaM = tmp;
          needsRewrite = true;
        } else if (isKnownCityName(areaM) && isKnownCityName(cityM)) {
          areaM = '';
          needsRewrite = true;
        }
        if (!cityM) cityM = 'بغداد';
        if (!areaM || areaM === 'مركز المدينة') {
          var gArea = detectAreaFromPh(phM);
          if (!areaM || (gArea && gArea !== 'مركز المدينة')) areaM = gArea;
        }
        var prodM = String(row[oldMap.product_name] || '').trim();
        var dosM = oldMap.dosage_form >= 0 ? String(row[oldMap.dosage_form] || '').trim() : '';
        if (!dosM) dosM = detectDosage(prodM);
        var mappedRow = [
          invNum,
          formatYmd(row[oldMap.invoice_date]),
          String(row[oldMap.warehouse_name] || '').trim(),
          phM,
          areaM,
          cityM,
          prodM,
          dosM,
          row[oldMap.quantity] !== undefined ? row[oldMap.quantity] : 0,
          row[oldMap.unit_price] !== undefined ? row[oldMap.unit_price] : 0,
          row[oldMap.bonus_quantity] !== undefined ? row[oldMap.bonus_quantity] : 0,
          row[oldMap.line_total] !== undefined ? row[oldMap.line_total] : 0,
          row[oldMap.total_invoice] !== undefined ? row[oldMap.total_invoice] : 0,
          String(row[oldMap.rep_name] || '').trim(),
          String(row[oldMap.status] || 'قيد التدقيق').trim(),
          row[oldMap.timestamp] !== undefined ? row[oldMap.timestamp] : ''
        ];
        for (var ec = 16; ec < totalCols; ec++) {
          mappedRow.push(row[ec] !== undefined ? row[ec] : '');
        }
        cleanedData.push(mappedRow);
      }
    }
    if (needsRewrite) {
      sheet.clear();
      sheet.getRange(1, 1, 1, totalCols).setValues([headers]);
      if (cleanedData.length > 0) sheet.getRange(2, 1, cleanedData.length, totalCols).setValues(cleanedData);
    }
  }
  var headerRange = sheet.getRange(1, 1, 1, totalCols);
  headerRange.setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold').setFontSize(11).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);
  sheet.setRightToLeft(true);
  try {
    sheet.clearConditionalFormatRules();
    highlightDuplicatesInSheet(sheet);
    sheet.autoResizeColumns(1, totalCols);
  } catch (fmtErr) {}

  if (!TEMPLATE_SYNC_GUARD && typeof sheet.getParent === 'function') {
    try {
      var pSs = sheet.getParent();
      if (pSs && pSs.getId && pSs.getId() !== SPREADSHEET_ID && pSs.getId() !== ADMIN_USERS_SHEET_ID && pSs.getSheets().length <= 1) {
        cloneAdminTabsAndPivotsToTarget(pSs.getId());
      }
    } catch (syncAutoErr) {}
  }
}

function getColKeyByIndex(colMap, zeroBasedIdx) {
  for (var i = 0; i < DATA_COL_KEYS.length; i++) {
    var k = DATA_COL_KEYS[i];
    if (colMap[k] === zeroBasedIdx) return k;
  }
  return '';
}

function mapAdminColToRepCol(adminCol1Based, adminColMap, repColMap, tabName, adminHeaders, repHeaders) {
  var zeroIdx = Number(adminCol1Based) - 1;
  var key = getColKeyByIndex(adminColMap, zeroIdx);
  if (key) {
    if (normAr(tabName).indexOf('منطق') !== -1 && key === 'city' && repColMap.area >= 0) {
      return repColMap.area + 1;
    }
    return repColMap[key] >= 0 ? (repColMap[key] + 1) : Number(adminCol1Based);
  }
  if (Array.isArray(adminHeaders) && Array.isArray(repHeaders) && zeroIdx >= 0 && zeroIdx < adminHeaders.length) {
    var srcLabel = normAr(adminHeaders[zeroIdx]);
    if (srcLabel) {
      for (var ri = 0; ri < repHeaders.length; ri++) {
        if (normAr(repHeaders[ri]) === srcLabel) return ri + 1;
      }
    }
  }
  return Number(adminCol1Based);
}

function copySinglePivotTable(pt, targetTab, repSourceRange, adminColMap, repColMap, tabName, adminHeaders, repHeaders) {
  var anchorA1 = 'A1';
  try { anchorA1 = pt.getAnchorCell().getA1Notation(); } catch (e) {}
  var newPt = targetTab.getRange(anchorA1).createPivotTable(repSourceRange);
  var rGroups = typeof pt.getRowGroups === 'function' ? pt.getRowGroups() : [];
  for (var rgIdx = 0; rgIdx < rGroups.length; rgIdx++) {
    var rg = rGroups[rgIdx];
    var targetRCol = mapAdminColToRepCol(rg.getSourceDataColumn(), adminColMap, repColMap, tabName, adminHeaders, repHeaders);
    var newRg = newPt.addRowGroup(targetRCol);
    try { if (typeof rg.totalsAreShown === 'function') newRg.showTotals(rg.totalsAreShown()); } catch (e1) {}
    try { if (typeof rg.areLabelsRepeated === 'function' && rg.areLabelsRepeated()) newRg.showRepeatedLabels(); } catch (e2) {}
    try { if (typeof rg.isSortAscending === 'function') { if (rg.isSortAscending()) newRg.sortAscending(); else newRg.sortDescending(); } } catch (e3) {}
  }
  var cGroups = typeof pt.getColumnGroups === 'function' ? pt.getColumnGroups() : [];
  for (var cgIdx = 0; cgIdx < cGroups.length; cgIdx++) {
    var cg = cGroups[cgIdx];
    var targetCCol = mapAdminColToRepCol(cg.getSourceDataColumn(), adminColMap, repColMap, tabName, adminHeaders, repHeaders);
    var newCg = newPt.addColumnGroup(targetCCol);
    try { if (typeof cg.totalsAreShown === 'function') newCg.showTotals(cg.totalsAreShown()); } catch (e4) {}
    try { if (typeof cg.areLabelsRepeated === 'function' && cg.areLabelsRepeated()) newCg.showRepeatedLabels(); } catch (e5) {}
    try { if (typeof cg.isSortAscending === 'function') { if (cg.isSortAscending()) newCg.sortAscending(); else newCg.sortDescending(); } } catch (e6) {}
  }
  var pVals = typeof pt.getPivotValues === 'function' ? pt.getPivotValues() : [];
  for (var pvIdx = 0; pvIdx < pVals.length; pvIdx++) {
    var pv = pVals[pvIdx];
    var targetVCol = mapAdminColToRepCol(pv.getSourceDataColumn(), adminColMap, repColMap, tabName, adminHeaders, repHeaders);
    var fn = typeof pv.getSummarizedBy === 'function' ? pv.getSummarizedBy() : (SpreadsheetApp.PivotTableSummarizeFunction ? SpreadsheetApp.PivotTableSummarizeFunction.SUM : 'SUM');
    var newPv = newPt.addPivotValue(targetVCol, fn);
    try { var dn = typeof pv.getDisplayName === 'function' ? pv.getDisplayName() : ''; if (dn) newPv.setDisplayName(dn); } catch (e7) {}
    try {
      if (typeof pv.getDisplayType === 'function' && typeof newPv.showAs === 'function') {
        var dispType = pv.getDisplayType();
        if (dispType && String(dispType) !== 'DEFAULT') newPv.showAs(dispType);
      }
    } catch (e7b) {}
  }
  var pFilters = typeof pt.getFilters === 'function' ? pt.getFilters() : [];
  for (var pfIdx = 0; pfIdx < pFilters.length; pfIdx++) {
    var pf = pFilters[pfIdx];
    try {
      var targetFCol = mapAdminColToRepCol(pf.getSourceDataColumn(), adminColMap, repColMap, tabName, adminHeaders, repHeaders);
      var crit = typeof pf.getFilterCriteria === 'function' ? pf.getFilterCriteria() : null;
      if (crit) newPt.addFilter(targetFCol, crit);
    } catch (e8) {}
  }
  return newPt;
}

function ensureSheetMinRows(sheet, minRows) {
  var targetMin = minRows || 1000;
  var curMax = typeof sheet.getMaxRows === 'function' ? sheet.getMaxRows() : Math.max(sheet.getLastRow() + 50, targetMin);
  if (typeof sheet.getMaxRows === 'function' && curMax < targetMin && typeof sheet.insertRowsAfter === 'function' && curMax > 0) {
    try {
      sheet.insertRowsAfter(curMax, targetMin - curMax);
      curMax = sheet.getMaxRows();
    } catch (e) {}
  }
  return Math.max(1, curMax);
}

function fixAdminAreaPivotIfNeeded(adminSs, adminDataSheet) {
  if (!adminSs || !adminDataSheet) return;
  var sheets = adminSs.getSheets();
  var adminHeaders = adminDataSheet.getLastRow() > 0 ? adminDataSheet.getRange(1, 1, 1, Math.max(16, adminDataSheet.getLastColumn())).getValues()[0] : getExpectedCols(adminDataSheet);
  var colMap = resolveColMap(adminHeaders);
  var maxRows = ensureSheetMinRows(adminDataSheet, 1000);
  var srcRange = adminDataSheet.getRange(1, 1, maxRows, adminHeaders.length);
  for (var i = 0; i < sheets.length; i++) {
    var tab = sheets[i];
    if (normAr(tab.getName()).indexOf('منطق') === -1) continue;
    var pts = typeof tab.getPivotTables === 'function' ? tab.getPivotTables() : [];
    if (pts.length === 0) continue;
    var pt0 = pts[0];
    var rGroups = typeof pt0.getRowGroups === 'function' ? pt0.getRowGroups() : [];
    if (rGroups.length > 0 && colMap.area >= 0 && rGroups[0].getSourceDataColumn() !== colMap.area + 1) {
      var anchorA1 = 'A1';
      try { anchorA1 = pt0.getAnchorCell().getA1Notation(); } catch (e) {}
      var colGroups = typeof pt0.getColumnGroups === 'function' ? pt0.getColumnGroups() : [];
      var vals = typeof pt0.getPivotValues === 'function' ? pt0.getPivotValues() : [];
      var filts = typeof pt0.getFilters === 'function' ? pt0.getFilters() : [];
      var snapRg = [];
      for (var ri = 0; ri < rGroups.length; ri++) {
        snapRg.push({
          col: mapAdminColToRepCol(rGroups[ri].getSourceDataColumn(), colMap, colMap, tab.getName()),
          totals: typeof rGroups[ri].totalsAreShown === 'function' ? rGroups[ri].totalsAreShown() : true,
          repeat: typeof rGroups[ri].areLabelsRepeated === 'function' ? rGroups[ri].areLabelsRepeated() : false,
          sortAsc: typeof rGroups[ri].isSortAscending === 'function' ? rGroups[ri].isSortAscending() : null
        });
      }
      var snapCg = [];
      for (var ci = 0; ci < colGroups.length; ci++) {
        snapCg.push({
          col: mapAdminColToRepCol(colGroups[ci].getSourceDataColumn(), colMap, colMap, tab.getName()),
          totals: typeof colGroups[ci].totalsAreShown === 'function' ? colGroups[ci].totalsAreShown() : true
        });
      }
      var snapVal = [];
      for (var vi = 0; vi < vals.length; vi++) {
        snapVal.push({ col: mapAdminColToRepCol(vals[vi].getSourceDataColumn(), colMap, colMap, tab.getName()), fn: typeof vals[vi].getSummarizedBy === 'function' ? vals[vi].getSummarizedBy() : 'SUM', dn: typeof vals[vi].getDisplayName === 'function' ? vals[vi].getDisplayName() : '' });
      }
      var snapFilt = [];
      for (var fi = 0; fi < filts.length; fi++) {
        try {
          var critF = typeof filts[fi].getFilterCriteria === 'function' ? filts[fi].getFilterCriteria() : null;
          if (critF) snapFilt.push({ col: mapAdminColToRepCol(filts[fi].getSourceDataColumn(), colMap, colMap, tab.getName()), crit: critF });
        } catch (fe) {}
      }
      tab.clear();
      var rebuilt = tab.getRange(anchorA1).createPivotTable(srcRange);
      for (var si = 0; si < snapRg.length; si++) {
        var ng = rebuilt.addRowGroup(snapRg[si].col);
        try { ng.showTotals(snapRg[si].totals); } catch (e1) {}
        try { if (snapRg[si].repeat) ng.showRepeatedLabels(); } catch (e1b) {}
        try { if (snapRg[si].sortAsc === true) ng.sortAscending(); else if (snapRg[si].sortAsc === false) ng.sortDescending(); } catch (e1c) {}
      }
      for (var sc = 0; sc < snapCg.length; sc++) {
        var nc = rebuilt.addColumnGroup(snapCg[sc].col);
        try { nc.showTotals(snapCg[sc].totals); } catch (e1d) {}
      }
      for (var sv = 0; sv < snapVal.length; sv++) {
        var nv = rebuilt.addPivotValue(snapVal[sv].col, snapVal[sv].fn);
        try { if (snapVal[sv].dn) nv.setDisplayName(snapVal[sv].dn); } catch (e2) {}
      }
      for (var sf = 0; sf < snapFilt.length; sf++) {
        try { rebuilt.addFilter(snapFilt[sf].col, snapFilt[sf].crit); } catch (e3) {}
      }
      try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (e4) {}
    }
  }
}

function cloneAdminTabsAndPivotsToTarget(targetSpreadsheetId, options) {
  if (TEMPLATE_SYNC_GUARD) return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'sync_guard_active' };
  TEMPLATE_SYNC_GUARD = true;
  var tabsOnly = Boolean(options && options.tabsOnly);
  try {
    var adminSs = getTargetSpreadsheet(SPREADSHEET_ID);
    var targetId = extractSheetIdFromUrl(targetSpreadsheetId) || String(targetSpreadsheetId || '').trim();
    if (!adminSs || !targetId || targetId === ADMIN_USERS_SHEET_ID) {
      return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'invalid_target_or_admin' };
    }
    var adminDataSheet = findInvoiceDataSheet(adminSs);
    if (!adminDataSheet) return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'no_admin_data_sheet' };

    setupSheet(adminDataSheet);
    try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (fAdm) {}
    fixAdminAreaPivotIfNeeded(adminSs, adminDataSheet);

    if (targetId === SPREADSHEET_ID) {
      return { synced: true, sheetName: adminSs.getName ? adminSs.getName() : '', tabsCount: adminSs.getSheets().length, pivotsCount: 0, tabNames: [], errorDetails: '' };
    }

    var targetSs = null;
    try { targetSs = SpreadsheetApp.openById(targetId); } catch (openErr) {
      return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'تعذر فتح الشيت (تأكد من صلاحيات المشاركة): ' + String(openErr) };
    }
    if (!targetSs) {
      return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'null_target_spreadsheet' };
    }
    var targetSheetTitle = '';
    try { targetSheetTitle = typeof targetSs.getName === 'function' ? targetSs.getName() : ''; } catch (nErr) {}

    var repFirst = targetSs.getSheets()[0];
    if (repFirst && isUsersSheetObj(repFirst)) {
      return { synced: false, sheetName: targetSheetTitle, tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: 'target_is_master_users_sheet' };
    }

    var targetDataSheet = findInvoiceDataSheet(targetSs);
    try {
      if (!targetDataSheet) targetDataSheet = targetSs.insertSheet('الفواتير');
      setupSheet(targetDataSheet);
    } catch (permErr) {
      return {
        synced: false,
        sheetName: targetSheetTitle,
        tabsCount: 0,
        pivotsCount: 0,
        tabNames: [],
        errorDetails: 'لا توجد صلاحية تعديل (Editor) على شيت المندوب — شاركه مع حساب باقر كـ Editor: ' + String(permErr)
      };
    }

    var adminHeaders = getExpectedCols(adminDataSheet);
    var repHeaders = getExpectedCols(targetDataSheet);
    if (adminHeaders.length > repHeaders.length) {
      for (var eh = repHeaders.length; eh < adminHeaders.length; eh++) {
        repHeaders.push(adminHeaders[eh]);
        targetDataSheet.getRange(1, eh + 1).setValue(adminHeaders[eh]).setBackground('#1e3a8a').setFontColor('#ffffff').setFontWeight('bold');
      }
    }
    try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (fRep1) {}

    var adminColMap = resolveColMap(adminHeaders);
    var repColMap = resolveColMap(repHeaders);
    var repMaxRows = ensureSheetMinRows(targetDataSheet, Math.max(targetDataSheet.getLastRow() + 200, 1000));
    var repSourceRange = targetDataSheet.getRange(1, 1, repMaxRows, repHeaders.length);

    var adminDataName = adminDataSheet.getName();
    var repDataName = targetDataSheet.getName();
    var adminSheets = adminSs.getSheets();
    var tabsCount = 0;
    var pivotsCount = 0;
    var tabNames = [];
    var tabErrors = [];

    for (var sIdx = 0; sIdx < adminSheets.length; sIdx++) {
      var s = adminSheets[sIdx];
      var sName = String(s.getName() || '').trim();
      if (sName === adminDataName || isUsersSheetObj(s)) continue;

      try {
        var targetTab = targetSs.getSheetByName(sName) || targetSs.insertSheet(sName);
        try { targetTab.setRightToLeft(true); } catch (rtlErr) {}
        try { var tc = typeof s.getTabColor === 'function' ? s.getTabColor() : null; if (tc) targetTab.setTabColor(tc); } catch (tcErr) {}

        var existingOldPts = typeof targetTab.getPivotTables === 'function' ? targetTab.getPivotTables() : [];
        for (var op = existingOldPts.length - 1; op >= 0; op--) {
          try { if (typeof existingOldPts[op].remove === 'function') existingOldPts[op].remove(); } catch (rmErr) {}
        }
        targetTab.clear();

        var adminPts = typeof s.getPivotTables === 'function' ? s.getPivotTables() : [];
        if (adminPts.length > 0 && !tabsOnly) {
          for (var ptIdx = 0; ptIdx < adminPts.length; ptIdx++) {
            copySinglePivotTable(adminPts[ptIdx], targetTab, repSourceRange, adminColMap, repColMap, sName, adminHeaders, repHeaders);
            pivotsCount++;
            try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (fPt) {}
          }
        } else {
          var lr = s.getLastRow();
          var lc = s.getLastColumn();
          if (lr > 0 && lc > 0) {
            var srcRng = s.getRange(1, 1, lr, lc);
            var vals = srcRng.getValues();
            var forms = typeof srcRng.getFormulas === 'function' ? srcRng.getFormulas() : [];
            var destRng = targetTab.getRange(1, 1, lr, lc);
            var mergedOut = [];
            var escAdmin = adminDataName.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
            var refRegex = new RegExp("('?" + escAdmin + "'?)!", 'g');
            for (var rr = 0; rr < lr; rr++) {
              var lineOut = [];
              for (var cc = 0; cc < lc; cc++) {
                var f = (forms[rr] && forms[rr][cc]) ? String(forms[rr][cc]) : '';
                if (f && f.charAt(0) === '=') {
                  lineOut.push(f.replace(refRegex, "'" + repDataName + "'!"));
                } else {
                  lineOut.push(vals[rr][cc]);
                }
              }
              mergedOut.push(lineOut);
            }
            destRng.setValues(mergedOut);
            try { targetTab.autoResizeColumns(1, lc); } catch (rcErr) {}
          }
        }
        tabNames.push(sName);
        tabsCount++;
      } catch (tabErr) {
        tabErrors.push(sName + ': ' + String(tabErr));
      }
    }
    try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (fEnd) {}
    return {
      synced: tabsCount > 0 || tabErrors.length === 0,
      sheetName: targetSheetTitle,
      tabsCount: tabsCount,
      pivotsCount: pivotsCount,
      tabNames: tabNames,
      errorDetails: tabErrors.join(' | ')
    };
  } catch (outerErr) {
    return { synced: false, sheetName: '', tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: String(outerErr) };
  } finally {
    TEMPLATE_SYNC_GUARD = false;
  }
}

function groupSheetRowsSafe(data, colMap) {
  var bucketMap = {};
  var bucketOrder = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var invNum = String(row[colMap.invoice_number] || '').trim();
    var dt = formatYmd(row[colMap.invoice_date]);
    var ph = normPh(row[colMap.pharmacy_name]);
    var prod = normProd(row[colMap.product_name]);
    var qty = Math.round(Number(row[colMap.quantity] || 0));
    var ts = String(row[colMap.timestamp] || '').trim();
    if (!ph && !prod && !invNum) continue;
    var bKey = (invNum || ph) + '::' + dt + '::' + ts;
    if (!bucketMap[bKey]) { bucketMap[bKey] = []; bucketOrder.push(bKey); }
    bucketMap[bKey].push({ sheetRow: i + 1, row: row, ph: ph, dt: dt, invNum: invNum, ts: ts, pKey: prod + ':' + qty });
  }

  var groups = [];
  for (var b = 0; b < bucketOrder.length; b++) {
    var entries = bucketMap[bucketOrder[b]];
    var block = [];
    var seen = {};
    for (var e = 0; e < entries.length; e++) {
      var ent = entries[e];
      if (ent.pKey && ent.pKey !== ':0' && seen[ent.pKey] && block.length > 0) {
        groups.push(block);
        block = [];
        seen = {};
      }
      block.push(ent);
      if (ent.pKey && ent.pKey !== ':0') seen[ent.pKey] = true;
    }
    if (block.length > 0) groups.push(block);
  }
  return groups;
}

function buildGroupSignatureSafe(block) {
  if (!block || block.length === 0) return '';
  var first = block[0];
  if (!first.ph || !first.dt) return '';
  var items = [];
  for (var i = 0; i < block.length; i++) {
    if (block[i].pKey && block[i].pKey !== ':0') items.push(block[i].pKey);
  }
  if (items.length === 0) return '';
  items.sort();
  return first.ph + '||' + first.dt + '||' + items.length + '||' + items.join('|');
}

function highlightDuplicatesInSheet(sheet) {
  if (!sheet) sheet = getTargetSheet();
  if (!sheet || isUsersSheetObj(sheet)) return;
  var lastRow = sheet.getLastRow();
  var totalCols = Math.max(16, sheet.getLastColumn());
  if (lastRow <= 1) return;
  var headers = sheet.getRange(1, 1, 1, totalCols).getValues()[0];
  var colMap = resolveColMap(headers);
  var data = sheet.getRange(1, 1, lastRow, totalCols).getValues();
  var groups = groupSheetRowsSafe(data, colMap);

  var bySignature = {};
  for (var g = 0; g < groups.length; g++) {
    var grp = groups[g];
    var sig = buildGroupSignatureSafe(grp);
    if (!sig) continue;
    if (!bySignature[sig]) bySignature[sig] = [];
    bySignature[sig].push(grp);
  }
  var dupRowMap = {};
  for (var sigKey in bySignature) {
    if (bySignature[sigKey].length > 1) {
      var copies = bySignature[sigKey];
      for (var c = 0; c < copies.length; c++) {
        for (var rIdx = 0; rIdx < copies[c].length; rIdx++) {
          dupRowMap[copies[c][rIdx].sheetRow] = true;
        }
      }
    }
  }
  for (var sheetRow = 2; sheetRow <= lastRow; sheetRow++) {
    var rng = sheet.getRange(sheetRow, 1, 1, totalCols);
    rng.setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
    if (dupRowMap[sheetRow]) rng.setBackground('#fee2e2').setFontColor('#991b1b');
    else rng.setBackground('#ffffff').setFontColor('#0f172a');
  }
}

function deleteMatchingInvoiceRows(sheet, targetInvNum, deleteMode, targetPh, targetDate, targetTs) {
  var headers = sheet.getRange(1, 1, 1, Math.max(16, sheet.getLastColumn())).getValues()[0];
  var colMap = resolveColMap(headers);
  var cleanTarget = String(targetInvNum || '').trim();
  var cleanPh = normPh(targetPh || '');
  var cleanDate = formatYmd(targetDate || '');
  var data = sheet.getDataRange().getValues();
  var deleted = 0;

  if (deleteMode === 'duplicate_copy') {
    var allGroups = groupSheetRowsSafe(data, colMap);
    var matchingGroups = [];
    for (var g = 0; g < allGroups.length; g++) {
      var grp = allGroups[g];
      var gFirst = grp[0];
      var isMatch = false;
      if (cleanTarget && gFirst.invNum === cleanTarget) isMatch = true;
      else if (cleanPh && cleanDate && gFirst.ph === cleanPh && gFirst.dt === cleanDate) isMatch = true;
      if (isMatch) matchingGroups.push(grp);
    }

    if (matchingGroups.length <= 1) {
      return 0;
    }

    var chosenGroup = matchingGroups[matchingGroups.length - 1];
    if (targetTs) {
      for (var k = 1; k < matchingGroups.length; k++) {
        if (matchingGroups[k][0].ts === String(targetTs).trim()) {
          chosenGroup = matchingGroups[k];
          break;
        }
      }
    }

    var rowsToDelete = [];
    for (var ri = 0; ri < chosenGroup.length; ri++) {
      rowsToDelete.push(chosenGroup[ri].sheetRow);
    }
    rowsToDelete.sort(function(a, b) { return b - a; });
    for (var d = 0; d < rowsToDelete.length; d++) {
      sheet.deleteRow(rowsToDelete[d]);
      deleted++;
    }
    return deleted;
  }

  for (var i = data.length - 1; i >= 1; i--) {
    var rNum = String(data[i][colMap.invoice_number] || '').trim();
    var matchRow = false;
    if (cleanTarget && rNum === cleanTarget) matchRow = true;
    else if (!cleanTarget && cleanPh && cleanDate && normPh(data[i][colMap.pharmacy_name]) === cleanPh && formatYmd(data[i][colMap.invoice_date]) === cleanDate) matchRow = true;
    if (!matchRow) continue;
    sheet.deleteRow(i + 1);
    deleted++;
  }
  return deleted;
}

function findUserRowIndex(data, uMap, targetRowNum, targetName, targetEmail) {
  var cleanTargetName = normAr(targetName || '');
  var cleanTargetEmail = String(targetEmail || '').trim().toLowerCase();
  var rn = Number(targetRowNum || 0);
  if (rn >= 2 && rn <= data.length) {
    var rowAtIdx = data[rn - 1];
    var rName = normAr(rowAtIdx[uMap.nameCol]);
    var rEmail = uMap.emailCol >= 0 ? String(rowAtIdx[uMap.emailCol] || '').trim().toLowerCase() : '';
    if ((!cleanTargetName && !cleanTargetEmail) || (cleanTargetName && rName === cleanTargetName) || (cleanTargetEmail && rEmail === cleanTargetEmail)) {
      return rn;
    }
  }
  for (var i = 1; i < data.length; i++) {
    var nm = normAr(data[i][uMap.nameCol]);
    var em = uMap.emailCol >= 0 ? String(data[i][uMap.emailCol] || '').trim().toLowerCase() : '';
    if (cleanTargetName && nm === cleanTargetName) return i + 1;
    if (cleanTargetEmail && em === cleanTargetEmail) return i + 1;
  }
  return -1;
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'لا توجد بيانات مرفقة بالطلب' })).setMimeType(ContentService.MimeType.JSON);
    }

    var payload = JSON.parse(e.postData.contents);
    var actionName = String(payload.action || '').trim();

    if (actionName === 'register_user' || actionName === 'add_user' || actionName === 'upsert_user' || actionName === 'seed_users') {
      var usersSheet = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheet) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي للمستخدمين' })).setMimeType(ContentService.MimeType.JSON);
      }
      var ensureGemColIdx = ensureMasterGeminiColumn(usersSheet);
      var headersU = usersSheet.getRange(1, 1, 1, Math.max(5, usersSheet.getLastColumn())).getValues()[0];
      var uMap = resolveUserColMap(headersU);
      if (uMap.geminiCol < 0) uMap.geminiCol = ensureGemColIdx;
      var incomingUsers = payload.users || (payload.user ? [payload.user] : []);
      var currentUsers = readAllSheetUsers(usersSheet);
      var existingSharedGem = '';
      for (var sg = 0; sg < currentUsers.length; sg++) {
        if (currentUsers[sg].gemini_api_key) { existingSharedGem = currentUsers[sg].gemini_api_key; break; }
      }
      var inserted = 0;
      for (var ui = 0; ui < incomingUsers.length; ui++) {
        var u = incomingUsers[ui];
        var uName = String(u.full_name || u.name || '').trim();
        var uEmail = String(u.email || '').trim().toLowerCase();
        var uPass = String(u.password_hash || u.password || '').trim();
        if (!uName && !uEmail) continue;
        var dupUser = false;
        for (var exi = 0; exi < currentUsers.length; exi++) {
          if ((uName && normAr(currentUsers[exi].full_name) === normAr(uName)) || (uEmail && currentUsers[exi].email === uEmail)) {
            dupUser = true;
            break;
          }
        }
        if (dupUser) {
          if (actionName === 'register_user' || actionName === 'add_user') {
            return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'هذا الاسم مسجل مسبقاً في الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
          }
          continue;
        }
        var totalUCols = Math.max(5, headersU.length);
        var uRow = [];
        for (var k = 0; k < totalUCols; k++) uRow.push('');
        uRow[uMap.nameCol] = uName || uEmail.split('@')[0];
        uRow[uMap.passCol] = /^[1-9]\\d*$/.test(uPass) ? Number(uPass) : uPass;
        uRow[uMap.sheetCol] = String(u.sheet_url || u.sheet_id || '').trim();
        uRow[uMap.webhookCol] = String(u.webhook_url || '').trim();
        if (uMap.idCol >= 0) uRow[uMap.idCol] = u.id || ('usr-' + new Date().getTime() + '-' + ui);
        if (uMap.emailCol >= 0) uRow[uMap.emailCol] = uEmail;
        if (uMap.roleCol >= 0) uRow[uMap.roleCol] = isBaqerName(uName, uEmail) ? 'admin' : 'medical_rep';
        if (uMap.activeCol >= 0) uRow[uMap.activeCol] = 'TRUE';
        if (uMap.geminiCol >= 0) uRow[uMap.geminiCol] = String(u.gemini_api_key || existingSharedGem || '').trim();

        var newRowIndex = usersSheet.getLastRow() + 1;
        usersSheet.getRange(newRowIndex, 1, 1, totalUCols).setValues([uRow]);
        if (!/^[1-9]\\d*$/.test(uPass)) {
          try { usersSheet.getRange(newRowIndex, uMap.passCol + 1).setNumberFormat('@').setValue(uPass); } catch (nfErr) {}
        }
        var newUserSheetId = extractSheetIdFromUrl(u.sheet_url || u.sheet_id);
        if (newUserSheetId) {
          try { cloneAdminTabsAndPivotsToTarget(newUserSheetId); } catch (tErr) {}
        }
        currentUsers.push({ full_name: uName, email: uEmail });
        inserted++;
      }
      try { usersSheet.autoResizeColumns(1, Math.max(5, headersU.length)); } catch (ue) {}
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        inserted: inserted,
        message: 'تم حفظ المستخدم وتجهيز شيته بنفس أوراق الأدمن في الشيت الرئيسي بنجاح.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'set_shared_gemini_key') {
      var usersSheetGem = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetGem) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      var gemKeyVal = String(payload.gemini_api_key || payload.geminiApiKey || '').trim();
      var targetGemCol = ensureMasterGeminiColumn(usersSheetGem);
      propagateGeminiKeyToAllUserRows(usersSheetGem, targetGemCol, gemKeyVal);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        gemini_api_key: gemKeyVal,
        message: 'تم تحديث مفتاح Gemini في العمود E وتعميمه لجميع المستخدمين في الشيت الرئيسي بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'unify_admin_webhook') {
      var usersSheetUni = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetUni) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      ensureMasterGeminiColumn(usersSheetUni);
      var headersUni = usersSheetUni.getRange(1, 1, 1, Math.max(5, usersSheetUni.getLastColumn())).getValues()[0];
      var uMapUni = resolveUserColMap(headersUni);
      var centralUrl = String(payload.centralWebhookUrl || payload.webhookUrl || '').trim();
      var clearNonAdmin = String(payload.mode || '') === 'clear';
      var lastRowUni = usersSheetUni.getLastRow();
      var updatedUni = 0;
      for (var ur = 2; ur <= lastRowUni; ur++) {
        var rNameU = String(usersSheetUni.getRange(ur, uMapUni.nameCol + 1).getValue() || '').trim();
        if (!rNameU) continue;
        var valToWrite = clearNonAdmin && !isBaqerName(rNameU, '') ? '' : centralUrl;
        usersSheetUni.getRange(ur, uMapUni.webhookCol + 1).setValue(valToWrite);
        updatedUni++;
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        updated: updatedUni,
        message: 'تم توحيد رابط السكربت المركزي لـ ' + updatedUni + ' حساب في الشيت الرئيسي بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'sync_template_to_all' || actionName === 'sync_tabs_only') {
      var tabsOnlyMode = actionName === 'sync_tabs_only' || payload.mode === 'tabs_only';
      var adminSsMain = getTargetSpreadsheet(SPREADSHEET_ID);
      var adminDataOnly = findInvoiceDataSheet(adminSsMain);
      if (adminDataOnly) {
        setupSheet(adminDataOnly);
        try { if (typeof SpreadsheetApp.flush === 'function') SpreadsheetApp.flush(); } catch (flA) {}
        fixAdminAreaPivotIfNeeded(adminSsMain, adminDataOnly);
      }
      var targetIds = [];
      if (payload.targetSpreadsheetId) {
        var singleTId = extractSheetIdFromUrl(payload.targetSpreadsheetId);
        if (singleTId) targetIds.push(singleTId);
      } else {
        var usersSheetTpl = getOrCreateUsersSheet(payload.adminSpreadsheetId || ADMIN_USERS_SHEET_ID);
        var uListTpl = readAllSheetUsers(usersSheetTpl);
        for (var ui2 = 0; ui2 < uListTpl.length; ui2++) {
          var sidRep = extractSheetIdFromUrl(uListTpl[ui2].sheet_id);
          if (sidRep && sidRep !== SPREADSHEET_ID && targetIds.indexOf(sidRep) === -1) {
            targetIds.push(sidRep);
          }
        }
        if (Array.isArray(payload.targetIds)) {
          for (var ti = 0; ti < payload.targetIds.length; ti++) {
            var extraSid = extractSheetIdFromUrl(payload.targetIds[ti]);
            if (extraSid && extraSid !== SPREADSHEET_ID && targetIds.indexOf(extraSid) === -1) {
              targetIds.push(extraSid);
            }
          }
        }
      }
      var syncResults = [];
      var syncedCount = 0;
      for (var sLoop = 0; sLoop < targetIds.length; sLoop++) {
        var curSid = targetIds[sLoop];
        try {
          var resClone = cloneAdminTabsAndPivotsToTarget(curSid, { tabsOnly: tabsOnlyMode });
          if (resClone.synced) syncedCount++;
          syncResults.push({
            sheetId: curSid,
            sheetName: resClone.sheetName || '',
            ok: resClone.synced,
            tabsCount: resClone.tabsCount,
            pivotsCount: resClone.pivotsCount,
            tabNames: resClone.tabNames || [],
            errorDetails: resClone.errorDetails || ''
          });
        } catch (repErr) {
          syncResults.push({ sheetId: curSid, sheetName: '', ok: false, tabsCount: 0, pivotsCount: 0, tabNames: [], errorDetails: String(repErr) });
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        tabsOnly: tabsOnlyMode,
        updatedSheets: syncedCount,
        totalTargets: targetIds.length,
        results: syncResults,
        message: 'تمت مزامنة أوراق و Pivot Tables الأدمن مع (' + syncedCount + ' / ' + targetIds.length + ') شيتات بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'update_user') {
      var usersSheetUpd = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetUpd) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      var ensuredUpdGemCol = ensureMasterGeminiColumn(usersSheetUpd);
      var dataUpd = usersSheetUpd.getDataRange().getValues();
      var headersUpd = dataUpd[0] || [];
      var uMapUpd = resolveUserColMap(headersUpd);
      if (uMapUpd.geminiCol < 0) uMapUpd.geminiCol = ensuredUpdGemCol;
      var targetRow = findUserRowIndex(dataUpd, uMapUpd, payload.rowNumber, payload.currentName || payload.username, payload.email);
      if (targetRow === -1) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, script_version: SCRIPT_VERSION, error: 'المستخدم غير موجود في الشيت الرئيسي.' })).setMimeType(ContentService.MimeType.JSON);
      }
      var newName = String(payload.newName || '').trim();
      if (newName) {
        for (var ci = 1; ci < dataUpd.length; ci++) {
          if (ci + 1 !== targetRow && normAr(dataUpd[ci][uMapUpd.nameCol]) === normAr(newName)) {
            return ContentService.createTextOutput(JSON.stringify({ success: false, script_version: SCRIPT_VERSION, error: 'الاسم الجديد مسجل مسبقاً لمستخدم آخر.' })).setMimeType(ContentService.MimeType.JSON);
          }
        }
        usersSheetUpd.getRange(targetRow, uMapUpd.nameCol + 1).setValue(newName);
      }
      if (payload.newPassword !== undefined && String(payload.newPassword).trim() !== '') {
        var np = String(payload.newPassword).trim();
        var passCell = usersSheetUpd.getRange(targetRow, uMapUpd.passCol + 1);
        if (/^[1-9]\\d*$/.test(np)) {
          passCell.setNumberFormat('0').setValue(Number(np));
        } else {
          passCell.setNumberFormat('@').setValue(np);
        }
      }
      if (payload.newSheetUrl !== undefined) {
        var cleanUrlStr = String(payload.newSheetUrl).trim();
        usersSheetUpd.getRange(targetRow, uMapUpd.sheetCol + 1).setValue(cleanUrlStr);
        var updatedSid = extractSheetIdFromUrl(cleanUrlStr);
        if (updatedSid && updatedSid !== SPREADSHEET_ID) {
          try { cloneAdminTabsAndPivotsToTarget(updatedSid); } catch (uSyncErr) {}
        }
      }
      if (payload.newWebhookUrl !== undefined) {
        usersSheetUpd.getRange(targetRow, uMapUpd.webhookCol + 1).setValue(String(payload.newWebhookUrl).trim());
      }
      if (payload.newGeminiApiKey !== undefined && uMapUpd.geminiCol >= 0) {
        usersSheetUpd.getRange(targetRow, uMapUpd.geminiCol + 1).setValue(String(payload.newGeminiApiKey).trim());
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        rowNumber: targetRow,
        message: 'تم تعديل البيانات وحفظها في الشيت الرئيسي بنجاح.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'delete_user') {
      var usersSheetDel = getOrCreateUsersSheet(payload.adminSpreadsheetId || payload.spreadsheetId);
      if (!usersSheetDel) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح الشيت الرئيسي' })).setMimeType(ContentService.MimeType.JSON);
      }
      var dataDel = usersSheetDel.getDataRange().getValues();
      var uMapDel = resolveUserColMap(dataDel[0] || []);
      var delRow = findUserRowIndex(dataDel, uMapDel, payload.rowNumber, payload.currentName || payload.username, payload.email);
      if (delRow === -1) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, script_version: SCRIPT_VERSION, error: 'المستخدم غير موجود.' })).setMimeType(ContentService.MimeType.JSON);
      }
      usersSheetDel.deleteRow(delRow);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        message: 'تم حذف المستخدم من الشيت الرئيسي بنجاح.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getTargetSheet(payload.spreadsheetId, payload.sheetName || 'الفواتير');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'تعذر فتح ورقة الفواتير في كوكل شيت' })).setMimeType(ContentService.MimeType.JSON);
    }
    setupSheet(sheet);

    if (actionName === 'repair' || actionName === 'setup') {
      highlightDuplicatesInSheet(sheet);
      var targetForSync = extractSheetIdFromUrl(payload.spreadsheetId) || SPREADSHEET_ID;
      var syncTplRes = { synced: false, tabsCount: 0, pivotsCount: 0 };
      try { syncTplRes = cloneAdminTabsAndPivotsToTarget(targetForSync); } catch (reSyncErr) {}
      try { sheet.autoResizeColumns(1, Math.max(16, sheet.getLastColumn())); } catch (errR) {}
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        script_version: SCRIPT_VERSION,
        templateSynced: syncTplRes.synced,
        tabsCount: syncTplRes.tabsCount,
        pivotsCount: syncTplRes.pivotsCount,
        message: 'تم توحيد الأعمدة (المنطقة قبل المدينة) واستنساخ أوراق الأدمن و Pivot Tables بنجاح!'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName === 'delete_invoice') {
      var delInv = payload.invoice_number || (payload.row && payload.row.invoice_number);
      var delCount = deleteMatchingInvoiceRows(sheet, delInv, payload.delete_mode, payload.pharmacy_name, payload.invoice_date, payload.timestamp);
      highlightDuplicatesInSheet(sheet);
      return ContentService.createTextOutput(JSON.stringify({ success: true, script_version: SCRIPT_VERSION, deleted: delCount, message: 'تم حذف ' + delCount + ' سطر من كوكل شيت وإعادة ضبط الألوان' })).setMimeType(ContentService.MimeType.JSON);
    }

    var headers = getExpectedCols(sheet);
    var totalCols = headers.length;
    var colMap = resolveColMap(headers);
    var rows = payload.rows || [];
    var data = sheet.getDataRange().getValues();
    var addedCount = 0;
    var updatedCount = 0;

    if (actionName === 'edit_invoice' || actionName === 'replace_invoice') {
      var matchNums = {};
      if (payload.previous_invoice_number) matchNums[String(payload.previous_invoice_number).trim()] = true;
      if (payload.invoice_number) matchNums[String(payload.invoice_number).trim()] = true;
      var existingIndices = [];
      for (var m = 1; m < data.length; m++) {
        var rNum = String(data[m][colMap.invoice_number] || '').trim();
        if (rNum && matchNums[rNum]) existingIndices.push(m + 1);
      }
      if (existingIndices.length === 0 && payload.pharmacy_name && payload.invoice_date) {
        var targetPhN = normPh(payload.pharmacy_name);
        var targetDtY = formatYmd(payload.invoice_date);
        for (var m2 = 1; m2 < data.length; m2++) {
          if (normPh(data[m2][colMap.pharmacy_name]) === targetPhN && formatYmd(data[m2][colMap.invoice_date]) === targetDtY) existingIndices.push(m2 + 1);
        }
      }
      var validEditRows = [];
      for (var vr = 0; vr < rows.length; vr++) {
        if (String(rows[vr].invoice_number || '').trim() !== '123') validEditRows.push(rows[vr]);
      }
      if (existingIndices.length === 0) {
        return ContentService.createTextOutput(JSON.stringify({
          success: true, script_version: SCRIPT_VERSION, added: 0, updated: 0,
          message: 'وضع التعديل: لم يتم إنشاء صف جديد لعدم العثور على الصف الأصلي في الشيت.'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      var common = Math.min(existingIndices.length, validEditRows.length);
      for (var u = 0; u < common; u++) {
        var sheetRowNum = existingIndices[u];
        var newVals = buildRowValuesByHeaders(validEditRows[u], headers, data[sheetRowNum - 1]);
        sheet.getRange(sheetRowNum, 1, 1, totalCols).setValues([newVals]);
        updatedCount++;
      }
      if (validEditRows.length > existingIndices.length) {
        var insertAfter = existingIndices[existingIndices.length - 1];
        for (var a = common; a < validEditRows.length; a++) {
          var insVals = buildRowValuesByHeaders(validEditRows[a], headers, null);
          sheet.insertRowAfter(insertAfter);
          insertAfter++;
          sheet.getRange(insertAfter, 1, 1, totalCols).setValues([insVals]);
          addedCount++;
        }
      } else if (existingIndices.length > validEditRows.length) {
        for (var d = existingIndices.length - 1; d >= validEditRows.length; d--) sheet.deleteRow(existingIndices[d]);
      }
      highlightDuplicatesInSheet(sheet);
      try { sheet.autoResizeColumns(1, totalCols); } catch (re1) {}
      return ContentService.createTextOutput(JSON.stringify({
        success: true, script_version: SCRIPT_VERSION, added: addedCount, updated: updatedCount,
        message: 'تم تعديل الفاتورة في نفس الصف (' + updatedCount + ' تحديث، ' + addedCount + ' بند إضافي).'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (actionName && !Array.isArray(payload.rows)) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        script_version: SCRIPT_VERSION,
        error: 'أمر غير مدعوم أو تنسيق طلب غير مكتمل: ' + actionName
      })).setMimeType(ContentService.MimeType.JSON);
    }

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var invNum = String(r.invoice_number || '').trim();
      var phN = normPh(r.pharmacy_name || '');
      if (invNum === '123' || (!invNum && !phN)) continue;
      var addVals = buildRowValuesByHeaders(r, headers, null);
      sheet.appendRow(addVals);
      addedCount++;
      data.push(addVals);
    }
    highlightDuplicatesInSheet(sheet);
    try { sheet.autoResizeColumns(1, totalCols); } catch (resizeErr) {}
    return ContentService.createTextOutput(JSON.stringify({
      success: true, script_version: SCRIPT_VERSION, added: addedCount, updated: updatedCount,
      message: 'تم إدراج ' + addedCount + ' سطراً جديداً بترتيب الأعمدة الموحّد بنجاح.'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function onEdit(e) {
  try {
    var activeSheet = (e && e.range && typeof e.range.getSheet === 'function') ? e.range.getSheet() : null;
    if (activeSheet && isUsersSheetObj(activeSheet)) {
      var lastC = Math.max(5, activeSheet.getLastColumn());
      var headersU = activeSheet.getRange(1, 1, 1, lastC).getValues()[0];
      var uMap = resolveUserColMap(headersU);
      var editedCol = (e && e.range && typeof e.range.getColumn === 'function') ? (e.range.getColumn() - 1) : -1;
      if (editedCol >= 4 && (uMap.geminiCol === editedCol || uMap.geminiCol < 0)) {
        var gCol = ensureMasterGeminiColumn(activeSheet, editedCol);
        var editedVal = String(e.range.getValue() || '').trim();
        if (editedVal && /^(AIza|AQ\\.)/.test(editedVal)) {
          propagateGeminiKeyToAllUserRows(activeSheet, gCol, editedVal);
        }
      }
      return;
    }
    var sheet = activeSheet || getTargetSheet();
    if (sheet && !isUsersSheetObj(sheet) && !sheetHasPivotTables(sheet)) {
      highlightDuplicatesInSheet(sheet);
    }
  } catch (err) {}
}

function doGet(e) {
  try {
    var action = e && e.parameter ? (e.parameter.action || e.parameter.sheet || '') : '';
    var customId = e && e.parameter ? (e.parameter.spreadsheetId || '') : '';

    if (action === 'users' || action === 'المستخدمون') {
      var uSheet = getOrCreateUsersSheet(e && e.parameter ? (e.parameter.adminSpreadsheetId || customId) : '');
      var uHeaders = uSheet && uSheet.getLastRow() > 0 ? uSheet.getRange(1, 1, 1, Math.max(4, uSheet.getLastColumn())).getValues()[0] : [];
      var uList = readAllSheetUsers(uSheet);
      return ContentService.createTextOutput(JSON.stringify({
        success: true, script_version: SCRIPT_VERSION, headers: uHeaders, users: uList
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = getTargetSheet(customId, 'الفواتير');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ script_version: SCRIPT_VERSION, headers: [], rows: [] })).setMimeType(ContentService.MimeType.JSON);
    }
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ script_version: SCRIPT_VERSION, headers: data[0] || [], rows: [] })).setMimeType(ContentService.MimeType.JSON);
    }

    var headers = data[0];
    var colMap = resolveColMap(headers);
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var invNum = String(row[colMap.invoice_number] || '').trim();
      var phName = String(row[colMap.pharmacy_name] || '').trim();
      if (invNum === '123' || (!invNum && !phName && !row[colMap.product_name])) continue;

      var invDate = formatYmd(row[colMap.invoice_date]);
      var cells = [];
      for (var c = 0; c < headers.length; c++) {
        if (c === colMap.invoice_date) cells.push(invDate);
        else cells.push(row[c] !== undefined && row[c] !== null ? String(row[c]) : '');
      }

      var prNameGet = String(row[colMap.product_name] || '');
      rows.push({
        invoice_number: invNum,
        invoice_date:   invDate,
        warehouse_name: String(row[colMap.warehouse_name] || ''),
        pharmacy_name:  phName,
        area:           colMap.area >= 0 ? String(row[colMap.area] || '') : detectAreaFromPh(phName),
        city:           colMap.city >= 0 ? String(row[colMap.city] || 'بغداد') : 'بغداد',
        product_name:   prNameGet,
        dosage_form:    colMap.dosage_form >= 0 ? String(row[colMap.dosage_form] || '') : detectDosage(prNameGet),
        quantity:       Number(row[colMap.quantity] || 0),
        unit_price:     Number(row[colMap.unit_price] || 0),
        bonus_quantity: Number(row[colMap.bonus_quantity] || 0),
        line_total:     Number(row[colMap.line_total] || 0),
        total_invoice:  Number(row[colMap.total_invoice] || 0),
        rep_name:       String(row[colMap.rep_name] || ''),
        status:         String(row[colMap.status] || 'قيد التدقيق'),
        timestamp:      String(row[colMap.timestamp] || ''),
        loyalty:        colMap.loyalty >= 0 && colMap.loyalty < headers.length ? String(row[colMap.loyalty] || '') : '',
        cells:          cells
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      script_version: SCRIPT_VERSION,
      headers: headers,
      rows: rows
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function testRun() {
  var uSheet = getOrCreateUsersSheet(ADMIN_USERS_SHEET_ID);
  if (uSheet) ensureMasterGeminiColumn(uSheet);
  var adminSheet = getTargetSheet(SPREADSHEET_ID);
  if (adminSheet && !isUsersSheetObj(adminSheet)) {
    setupSheet(adminSheet);
    try { fixAdminAreaPivotIfNeeded(getTargetSpreadsheet(SPREADSHEET_ID), adminSheet); } catch (e) {}
  }
  Logger.log('تم التحقق من الجداول والترقية بنجاح (v' + SCRIPT_VERSION + ').');
}`}),(0,q.jsxs)(`div`,{style:{marginTop:`0.85rem`,paddingTop:`0.85rem`,borderTop:`1px dashed #cbd5e1`},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`0.45rem`,flexWrap:`wrap`,gap:`0.5rem`},children:[(0,q.jsx)(`span`,{style:{fontSize:`0.77rem`,fontWeight:800,color:`#334155`},children:`غلاف المكتبة الثابت لشيتات المندوبين (AdminLib — وضع HEAD) لتحديث دوال onEdit داخل كل شيت تلقائياً:`}),(0,q.jsxs)(`button`,{type:`button`,onClick:Re,className:`btn-clay btn-secondary btn-sm`,style:{fontWeight:700},children:[ce?(0,q.jsx)(yn,{size:14}):(0,q.jsx)(Vn,{size:14}),ce?`تم نسخ الغلاف!`:`نسخ الغلاف المختصر (4 أسطر)`]})]}),(0,q.jsx)(`pre`,{style:{background:`#1e293b`,color:`#a7f3d0`,padding:`0.75rem`,borderRadius:8,fontSize:`0.72rem`,direction:`ltr`,textAlign:`left`,margin:0},children:`// ضع هذا الكود المختصر (مرة واحدة فقط) في شيت المندوب بعد إضافة مشروع سكربت الأدمن كـ Library باسم AdminLib (الوضع: HEAD)
function onEdit(e) { return AdminLib.onEdit(e); }
function doGet(e) { return AdminLib.doGet(e); }
function doPost(e) { return AdminLib.doPost(e); }
function testRun() { return AdminLib.testRun(); }`})]})]})]}),le&&(0,q.jsxs)(Si,{maxWidth:560,onClose:()=>ue(!1),children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`1rem`,borderBottom:`1px solid var(--gray-200)`,paddingBottom:`0.75rem`},children:[(0,q.jsxs)(`h4`,{style:{fontWeight:800,margin:0,display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,q.jsx)(Fr,{size:20,style:{color:`var(--primary)`}}),`إضافة مستخدم جديد للشيت الرئيسي`]}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>ue(!1),className:`btn-clay btn-secondary btn-sm`,children:`✕`})]}),(0,q.jsxs)(`form`,{onSubmit:R,style:{display:`flex`,flexDirection:`column`,gap:`0.85rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:700,display:`block`,marginBottom:4},children:`الاسم (العمود A) *`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,placeholder:`مثال: keko3`,value:de,onChange:e=>fe(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:700,display:`block`,marginBottom:4},children:`الرمز السري (العمود B) *`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,placeholder:`123456`,value:pe,onChange:e=>me(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:700,display:`block`,marginBottom:4},children:`رابط صفحة كوكل شيت الخاصة به (العمود C)`}),(0,q.jsx)(`input`,{type:`url`,className:`clay-input`,style:{direction:`ltr`,fontSize:`0.8rem`},placeholder:`https://docs.google.com/spreadsheets/d/...`,value:M,onChange:e=>ge(e.target.value)})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:700,display:`block`,marginBottom:4},children:`رابط اي بي اي سكربت الخاص به (العمود D)`}),(0,q.jsx)(`input`,{type:`url`,className:`clay-input`,style:{direction:`ltr`,fontSize:`0.8rem`},placeholder:`https://script.google.com/macros/s/.../exec`,value:_e,onChange:e=>N(e.target.value)})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:700,display:`block`,marginBottom:4},children:`مفتاح Gemini API (العمود E — اختياري)`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,style:{direction:`ltr`,fontSize:`0.8rem`},placeholder:T?`يُملأ تلقائياً من المفتاح الموحد`:`AIzaSy... / AQ...`,value:P,onChange:e=>be(e.target.value)})]}),(0,q.jsx)(`button`,{type:`submit`,disabled:i,className:`btn-clay btn-primary`,style:{fontWeight:800,marginTop:`0.35rem`},children:i?`جارِ الحفظ في الشيت الرئيسي...`:`حفظ وإضافة للشيت الرئيسي`})]})]}),xe&&(0,q.jsxs)(Si,{maxWidth:560,onClose:()=>F(null),children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`1rem`,borderBottom:`1px solid var(--gray-200)`,paddingBottom:`0.75rem`},children:[(0,q.jsxs)(`h4`,{style:{fontWeight:800,margin:0,display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,q.jsx)(kr,{size:19,style:{color:`var(--primary)`}}),`تعديل بيانات الصف #`,xe.rowNumber,` (`,xe.full_name,`)`]}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>F(null),className:`btn-clay btn-secondary btn-sm`,children:`✕`})]}),(0,q.jsxs)(`form`,{onSubmit:He,style:{display:`flex`,flexDirection:`column`,gap:`0.85rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:700,display:`block`,marginBottom:4},children:`الاسم (العمود A) *`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,value:Se,onChange:e=>Ce(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:700,display:`block`,marginBottom:4},children:`الرمز السري (العمود B) *`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,value:we,onChange:e=>Te(e.target.value),required:!0})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:700,display:`block`,marginBottom:4},children:`صفحة كوكل شيت الخاصة به (العمود C)`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,style:{direction:`ltr`,fontSize:`0.8rem`},value:Ee,onChange:e=>L(e.target.value)})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:700,display:`block`,marginBottom:4},children:`اي بي اي سكربت (العمود D)`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,style:{direction:`ltr`,fontSize:`0.8rem`},value:De,onChange:e=>Oe(e.target.value)})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:700,display:`block`,marginBottom:4},children:`اي بي اي جمناي (العمود E)`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,style:{direction:`ltr`,fontSize:`0.8rem`},placeholder:`AIzaSy... / AQ...`,value:ke,onChange:e=>Ae(e.target.value)})]}),(0,q.jsx)(`button`,{type:`submit`,disabled:i,className:`btn-clay btn-primary`,style:{fontWeight:800,marginTop:`0.35rem`},children:i?`جارِ حفظ التعديلات...`:`حفظ التعديلات في الشيت الرئيسي`})]})]})]})},Pi=({user:e,onUserUpdated:t})=>{let[n,r]=(0,_.useState)(e.full_name||``),[i,a]=(0,_.useState)(``),[o,s]=(0,_.useState)(``),[c,l]=(0,_.useState)(``),[u,d]=(0,_.useState)(!1),[f,p]=(0,_.useState)(!1),[m,h]=(0,_.useState)(null),[g,v]=(0,_.useState)(null),y=e.role===`admin`;return(0,q.jsxs)(`div`,{className:`animate-in`,style:{display:`flex`,flexDirection:`column`,gap:`1.25rem`,maxWidth:680,margin:`0 auto`},children:[(0,q.jsx)(`div`,{className:`page-header`,style:{marginBottom:0},children:(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,marginBottom:`0.4rem`},children:(0,q.jsxs)(`span`,{className:`badge ${y?`badge-primary`:`badge-success`}`,children:[(0,q.jsx)(Gr,{size:13}),` `,y?`حساب مدير النظام (الأدمن)`:`حساب مندوب علمي`]})}),(0,q.jsxs)(`h1`,{className:`page-title`,style:{display:`flex`,alignItems:`center`,gap:`0.6rem`},children:[(0,q.jsx)(lr,{size:26,style:{color:`var(--primary)`}}),`حسابي وإعدادات الدخول`]}),(0,q.jsx)(`p`,{className:`page-subtitle`,children:`يمكنك تعديل اسم الدخول والرمز السري وسيتم تحديثهما تلقائياً في قاعدة بيانات كوكل شيت الخاصة بك.`})]})}),(0,q.jsx)(`div`,{className:`card`,style:{padding:`1.15rem`,background:`linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)`},children:(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,flexWrap:`wrap`,gap:`0.75rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`div`,{style:{fontSize:`0.76rem`,color:`var(--gray-500)`,fontWeight:700},children:`المستخدم الحالي`}),(0,q.jsx)(`div`,{style:{fontSize:`1.15rem`,fontWeight:900,color:`var(--gray-900)`},children:e.full_name}),(0,q.jsxs)(`div`,{style:{fontSize:`0.78rem`,color:e.sheet_id||y?`var(--primary)`:`#dc2626`,fontWeight:700,marginTop:2},children:[(0,q.jsx)(tr,{size:13,style:{display:`inline`,marginLeft:4}}),e.sheet_id?`الشيت الشخصي: ${e.sheet_id.slice(0,18)}...`:y?`الشيت الرئيسي / الافتراضي للأدمن`:`⛔ لا تملك أي قاعدة بيانات (كوكل شيت) مرتبطة بحسابك`]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.5rem`,flexWrap:`wrap`},children:[e.sheet_url&&(0,q.jsxs)(`a`,{href:e.sheet_url,target:`_blank`,rel:`noopener noreferrer`,className:`btn-clay btn-secondary btn-sm`,style:{textDecoration:`none`,fontWeight:700},children:[(0,q.jsx)(qn,{size:14}),` فتح شيت فواتيري`]}),y&&(0,q.jsxs)(`a`,{href:`https://docs.google.com/spreadsheets/d/1_CBGFeFrTaw6L_7U1ztdAZ3gJjjVMEpUhE8oyUn-NjI/edit?usp=sharing`,target:`_blank`,rel:`noopener noreferrer`,className:`btn-clay btn-primary btn-sm`,style:{textDecoration:`none`,fontWeight:700},children:[(0,q.jsx)(qn,{size:14}),` فتح الشيت الرئيسي`]})]})]})}),(0,q.jsxs)(`div`,{className:`card`,style:{padding:`1.35rem`},children:[(0,q.jsxs)(`h3`,{style:{fontWeight:900,margin:`0 0 1rem`,fontSize:`1.02rem`,display:`flex`,alignItems:`center`,gap:`0.5rem`},children:[(0,q.jsx)(si,{size:19,style:{color:`var(--primary)`}}),`تعديل الاسم والرمز السري في Google Sheets`]}),m&&(0,q.jsxs)(`div`,{className:`alert-danger mb-3`,style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,fontSize:`0.84rem`},children:[(0,q.jsx)(Dn,{size:18}),(0,q.jsx)(`span`,{children:m})]}),g&&(0,q.jsxs)(`div`,{className:`alert-success mb-3`,style:{display:`flex`,alignItems:`center`,gap:`0.5rem`,fontSize:`0.84rem`},children:[(0,q.jsx)(jn,{size:18}),(0,q.jsx)(`span`,{children:g})]}),(0,q.jsxs)(`form`,{onSubmit:async r=>{r.preventDefault(),h(null),v(null);let u=n.trim(),d=i.trim(),f=o.trim(),m=c.trim();if(!d){h(`يرجى إدخال الرمز السري الحالي للتحقق من الهوية قبل الحفظ`);return}let g=u&&u!==e.full_name.trim(),_=!!f;if(!g&&!_)h(`لم تقم بتغيير الاسم أو إدخال رمز سري جديد`);else if(u.length<2)h(`الاسم يجب أن يتكون من حرفين على الأقل`);else{if(_){if(f.length<4){h(`الرمز السري الجديد يجب أن يتكون من 4 أحرف أو أرقام على الأقل`);return}if(f!==m){h(`الرمز السري الجديد وتأكيده غير متطابقين`);return}}p(!0);try{let e=await G.updateUserProfile({currentPassword:d,newName:g?u:void 0,newPassword:_?f:void 0,confirmPassword:_?m:void 0});t(e.user),a(``),s(``),l(``),v(e.verifiedInSheet?`✅ تم تعديل البيانات وحفظها وتوثيقها مباشرة في جدول كوكل شيت الرئيسي!`:`✅ تم إرسال التعديل لجدول كوكل شيت وتحديث جلستك الحالية! (ملاحظة: تأكد من نشر Apps Script الإصدار 5 على الشيت الرئيسي لتطبيق التعديل مباشرة إن لم يظهر فوراً).`)}catch(e){h(e?.message||`تعذر حفظ التعديلات، يرجى المحاولة مجدداً`)}finally{p(!1)}}},style:{display:`flex`,flexDirection:`column`,gap:`0.95rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`الاسم الجديد (لتسجيل الدخول في الشيت الرئيسي)`}),(0,q.jsx)(`input`,{type:`text`,className:`clay-input`,value:n,onChange:e=>r(e.target.value),placeholder:`أدخل الاسم الجديد...`,required:!0}),y&&(0,q.jsx)(`div`,{style:{fontSize:`0.72rem`,color:`#0369a1`,marginTop:4},children:`تنبيه: يرتبط دخولك كأدمن باسم باقر في الشيت الرئيسي.`})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`center`,marginBottom:`0.35rem`},children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:800,color:`var(--gray-700)`,margin:0},children:`الرمز السري الحالي (مطلوب للتأكيد) *`}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>d(!u),style:{background:`none`,border:`none`,color:`var(--primary)`,cursor:`pointer`,fontSize:`0.75rem`,fontWeight:700,display:`flex`,alignItems:`center`,gap:4},children:u?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(Yn,{size:13}),` إخفاء`]}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(Zn,{size:13}),` إظهار الرموز`]})})]}),(0,q.jsxs)(`div`,{style:{position:`relative`},children:[(0,q.jsx)(`input`,{type:u?`text`:`password`,className:`clay-input`,style:{paddingRight:`2.4rem`},placeholder:`أدخل الرمز السري الحالي...`,value:i,onChange:e=>a(e.target.value),required:!0}),(0,q.jsx)(xr,{size:16,style:{position:`absolute`,right:12,top:`50%`,transform:`translateY(-50%)`,color:`var(--gray-400)`}})]})]}),(0,q.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(220px, 1fr))`,gap:`0.85rem`},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`الرمز السري الجديد (اتركه فارغاً للإبقاء على الحالي)`}),(0,q.jsx)(`input`,{type:u?`text`:`password`,className:`clay-input`,placeholder:`مثال: 654321`,value:o,onChange:e=>s(e.target.value)})]}),(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`label`,{style:{fontSize:`0.82rem`,fontWeight:800,color:`var(--gray-700)`,display:`block`,marginBottom:`0.35rem`},children:`تأكيد الرمز السري الجديد`}),(0,q.jsx)(`input`,{type:u?`text`:`password`,className:`clay-input`,placeholder:`أعد إدخال الرمز الجديد...`,value:c,onChange:e=>l(e.target.value)})]})]}),(0,q.jsx)(`button`,{type:`submit`,disabled:f,className:`btn-clay btn-primary`,style:{width:`100%`,padding:`0.8rem`,fontSize:`0.96rem`,fontWeight:800,marginTop:`0.25rem`},children:f?(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(Lr,{size:18,className:`animate-spin`}),` جاري الحفظ والمزامنة مع الشيت الرئيسي...`]}):(0,q.jsxs)(q.Fragment,{children:[(0,q.jsx)(zr,{size:18}),` حفظ التعديلات في كوكل شيت`]})})]})]})]})};function Fi(){let[e,t]=(0,_.useState)(H()),[n,r]=(0,_.useState)(`dashboard`),[i,a]=(0,_.useState)([]),[o,s]=(0,_.useState)([]),[c,l]=(0,_.useState)([]),[u,d]=(0,_.useState)({total_invoices:0,total_pharmacies_visited:0,total_pieces_sold:0,total_bonus_given:0,total_revenue:0}),[f,p]=(0,_.useState)(!1),[m,h]=(0,_.useState)([]),[g,v]=(0,_.useState)(!1),[y,b]=(0,_.useState)(),[x,S]=(0,_.useState)(0),[C,w]=(0,_.useState)(!1),T=(e,t)=>!e||!t?!!e!=!!t:(e.sheet_id||``).trim()!==(t.sheet_id||``).trim()||(e.sheet_url||``).trim()!==(t.sheet_url||``).trim()||(e.webhook_url||``).trim()!==(t.webhook_url||``).trim()||e.role!==t.role||e.full_name!==t.full_name||(e.gemini_api_key||``).trim()!==(t.gemini_api_key||``).trim(),ee=async()=>{if(e){w(!0);try{let n=await G.syncUserSessionFromMasterSheet();n.user&&T(e,n.user)&&t(n.user),ke(n.user||e)?(E(`تم العثور على قاعدة بياناتك في الشيت الرئيسي بنجاح ✅`),await te()):E(De,`error`)}catch(e){E(`تعذر التحقق من الشيت الرئيسي: `+(e?.message||``),`error`)}finally{w(!1)}}},E=(e,t=`success`)=>{let n=Date.now().toString();h(r=>[...r,{id:n,message:e,type:t}]),setTimeout(()=>h(e=>e.filter(e=>e.id!==n)),4e3)},te=async()=>{if(!ke(e))a([]),l([]),d({total_invoices:0,total_pharmacies_visited:0,total_pieces_sold:0,total_bonus_given:0,total_revenue:0}),p(!1);else{p(!0);try{let[e,t,n,r]=await Promise.all([G.getPharmacies(),G.getProducts(),G.getInvoices(),G.getKPIs()]);a(e),s(t),l(n);let i={total_invoices:Number(r?.total_invoices||0),total_pharmacies_visited:Number(r?.total_pharmacies_visited||0),total_pieces_sold:Number(r?.total_pieces_sold||0),total_bonus_given:Number(r?.total_bonus_pieces??r?.total_bonus_given??0),total_bonus_pieces:Number(r?.total_bonus_pieces??r?.total_bonus_given??0),total_revenue:Number(r?.total_sales_amount??r?.total_revenue??0),total_sales_amount:Number(r?.total_sales_amount??r?.total_revenue??0),approved_invoices:Number(r?.approved_invoices||0),pending_invoices:Number(r?.pending_invoices||0)};d(i)}catch(e){E(`فشل تحميل البيانات: `+(e.message||`خطأ في الاتصال بالخادم`),`error`)}finally{p(!1)}}};(0,_.useEffect)(()=>{let e=()=>{t(null)};return window.addEventListener(`auth:logout`,e),()=>window.removeEventListener(`auth:logout`,e)},[]),(0,_.useEffect)(()=>{if(!e)return;let n=!1;return(async()=>{try{let r=await G.syncUserSessionFromMasterSheet();if(!n&&r.user&&T(e,r.user)){t(r.user);return}}catch{}n||(ke(e)?(G.flushSheetsSyncOutbox({keepalive:!0}).catch(()=>{}),te()):(a([]),l([]),p(!1)))})(),()=>{n=!0}},[e]),(0,_.useEffect)(()=>{if(!e)return;let r=0,i=async(n=!1)=>{let i=Date.now();if(!(!n&&i-r<3e3)){r=i;try{let n=await G.syncUserSessionFromMasterSheet();if(n.user&&T(e,n.user)){t(n.user);return}if(!ke(e))return;await G.syncSheetDeletion()&&await te()}catch{}}},a=()=>{document.visibilityState===`visible`&&i(!1)};window.addEventListener(`focus`,a),document.addEventListener(`visibilitychange`,a);let o=setInterval(()=>{document.visibilityState===`visible`&&(n===`billing`||n===`dashboard`||n===`sheets`)&&i(!0)},8e3);return()=>{window.removeEventListener(`focus`,a),document.removeEventListener(`visibilitychange`,a),clearInterval(o)}},[e,n]),(0,_.useEffect)(()=>{let e=()=>{G.flushSheetsSyncOutbox({keepalive:!0,useBeacon:!0}).catch(()=>{})},t=()=>{document.visibilityState===`hidden`?e():G.flushSheetsSyncOutbox({keepalive:!0}).catch(()=>{})};return window.addEventListener(`online`,e),window.addEventListener(`pagehide`,e),window.addEventListener(`beforeunload`,e),document.addEventListener(`visibilitychange`,t),()=>{window.removeEventListener(`online`,e),window.removeEventListener(`pagehide`,e),window.removeEventListener(`beforeunload`,e),document.removeEventListener(`visibilitychange`,t)}},[]),(0,_.useEffect)(()=>(g?document.body.style.overflow=`hidden`:document.body.style.overflow=``,()=>{document.body.style.overflow=``}),[g]);let D=()=>{Wt(),Kt(),t(null)},ne=async e=>{try{await G.reviewInvoice(e,`approved`),E(`تم اعتماد الفاتورة بنجاح ✅`),te()}catch(e){E(`خطأ في الاعتماد: `+e.message,`error`)}},O=async(e,t)=>{try{await G.reviewInvoice(e,`rejected`,t),E(`تم رفض الفاتورة مع إشعار المندوب ⚠️`,`info`),te()}catch(e){E(`خطأ: `+e.message,`error`)}},re=async e=>{l(t=>t.filter(t=>t.id!==e)),E(`تم حذف الفاتورة بنجاح 🗑️`,`info`)},ie=e=>{l(t=>t.map(t=>t.id===e.id?e:t)),E(`تم تعديل الفاتورة ${e.invoice_number} بنجاح ✏️`,`success`),te()},ae=e=>{b(void 0),S(e=>e+1),E(`تم حفظ الفاتورة ${e.invoice_number} وإرسالها للاعتماد 🎉`),r(`billing`),te()},k=e=>{b(e),S(e=>e+1),r(`add-invoice`)},A=e=>{e===`add-invoice`?(b(void 0),S(e=>e+1)):(e===`billing`||e===`dashboard`)&&te(),r(e),v(!1),window.scrollTo({top:0,behavior:`instant`})},oe=[{id:`dashboard`,label:`الرئيسية`,icon:(0,q.jsx)(hr,{size:19})},{id:`visits`,label:`الزيارات`,icon:(0,q.jsx)(hn,{size:19})},{id:`add-invoice`,label:`إضافة فاتورة`,icon:(0,q.jsx)($n,{size:20})},{id:`pharmacies`,label:`الصيدليات`,icon:(0,q.jsx)(dn,{size:19})},{id:`billing`,label:`الفواتير`,icon:(0,q.jsx)(rr,{size:19})},{id:`sheets`,label:`كوكل شيت`,icon:(0,q.jsx)(tr,{size:19})},{id:`profile`,label:`حسابي`,icon:(0,q.jsx)(lr,{size:19})},...e?.role===`admin`?[{id:`users`,label:`الشيت الرئيسي`,icon:(0,q.jsx)(di,{size:19})}]:[]],se=e?.role===`admin`?`مدير عام`:e?.role===`supervisor`?`مشرف مبيعات`:`مندوب علمي`,ce=e?.role===`admin`?`#2563eb`:e?.role===`supervisor`?`#7c3aed`:`#059669`;return e?(0,q.jsxs)(`div`,{className:`app-wrapper`,children:[(0,q.jsx)(`div`,{className:`toast-bar`,children:m.map(e=>(0,q.jsxs)(`div`,{className:`alert-${e.type===`success`?`success`:e.type===`error`?`danger`:`info`} mb-2`,children:[e.type===`success`?(0,q.jsx)(kn,{size:18}):(0,q.jsx)(Dn,{size:18}),(0,q.jsx)(`span`,{children:e.message})]},e.id))}),(0,q.jsxs)(`header`,{className:`topbar`,children:[(0,q.jsxs)(`a`,{href:`#`,className:`topbar-brand`,onClick:e=>{e.preventDefault(),A(`dashboard`)},children:[(0,q.jsx)(`div`,{className:`topbar-brand-icon`,children:(0,q.jsx)(Nr,{size:20})}),(0,q.jsxs)(`div`,{className:`topbar-brand-text`,children:[(0,q.jsx)(`span`,{className:`topbar-brand-name`,children:`PharmaSales`}),(0,q.jsx)(`span`,{className:`topbar-brand-sub`,children:`نظام إدارة المبيعات الدوائية`})]})]}),(0,q.jsx)(`nav`,{className:`topbar-nav`,children:oe.map(e=>{let t=e.id===`add-invoice`;return(0,q.jsxs)(`button`,{onClick:()=>A(e.id),className:`topbar-nav-item ${n===e.id?`active`:``} ${t?`topbar-highlight-btn`:``}`,style:t?{color:`#ffffff`}:void 0,children:[e.icon,(0,q.jsx)(`span`,{children:e.label})]},e.id)})}),(0,q.jsxs)(`div`,{className:`topbar-actions`,children:[f&&(0,q.jsx)(`div`,{style:{width:20,height:20,border:`2px solid #e2e8f0`,borderTopColor:`#3b82f6`,borderRadius:`50%`},className:`animate-spin`}),n!==`add-invoice`&&ke(e)&&(0,q.jsxs)(`button`,{className:`topbar-mobile-add-btn`,onClick:()=>A(`add-invoice`),title:`إضافة فاتورة جديدة`,children:[(0,q.jsx)($n,{size:15}),(0,q.jsx)(`span`,{children:`+ فاتورة`})]}),(0,q.jsxs)(`button`,{className:`topbar-user-pill`,onClick:()=>A(`profile`),title:`إعدادات الحساب وتغيير الاسم أو الرمز`,children:[(0,q.jsx)(`div`,{className:`topbar-user-avatar`,style:{background:ce},children:e.full_name.charAt(0)}),(0,q.jsxs)(`div`,{className:`topbar-user-info`,children:[(0,q.jsx)(`span`,{className:`topbar-user-name`,children:e.full_name.split(` `)[0]}),(0,q.jsx)(`span`,{className:`topbar-user-role`,children:se})]})]}),(0,q.jsx)(`button`,{className:`topbar-logout-btn`,onClick:D,title:`تسجيل الخروج`,children:(0,q.jsx)(Cr,{size:18})}),(0,q.jsx)(`button`,{className:`topbar-mobile-toggle`,onClick:()=>v(!g),children:g?(0,q.jsx)(hi,{size:20}):(0,q.jsx)(Dr,{size:20})})]})]}),g&&(0,q.jsx)(`div`,{className:`mobile-drawer-backdrop`,onClick:()=>v(!1)}),g&&(0,q.jsxs)(`aside`,{className:`mobile-nav-drawer`,"aria-label":`القائمة الجانبية`,children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`space-between`,gap:`0.75rem`,padding:`0.5rem 0.25rem 0.9rem`,borderBottom:`1.5px solid var(--gray-200)`,marginBottom:`0.5rem`,flexShrink:0},children:[(0,q.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`0.7rem`,minWidth:0},children:[(0,q.jsx)(`div`,{className:`topbar-user-avatar`,style:{background:ce,width:42,height:42,fontSize:`1rem`},children:e.full_name.charAt(0)}),(0,q.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,minWidth:0},children:[(0,q.jsx)(`span`,{style:{fontWeight:900,fontSize:`0.95rem`,color:`#0f172a`,whiteSpace:`nowrap`,overflow:`hidden`,textOverflow:`ellipsis`},children:e.full_name}),(0,q.jsx)(`span`,{style:{fontSize:`0.74rem`,color:`#475569`,fontWeight:700},children:se})]})]}),(0,q.jsx)(`button`,{type:`button`,onClick:()=>v(!1),"aria-label":`إغلاق القائمة`,style:{width:36,height:36,borderRadius:10,border:`1px solid var(--gray-200)`,background:`#f1f5f9`,color:`#0f172a`,display:`flex`,alignItems:`center`,justifyContent:`center`,cursor:`pointer`,flexShrink:0},children:(0,q.jsx)(hi,{size:20})})]}),(0,q.jsx)(`div`,{style:{fontSize:`0.72rem`,fontWeight:800,color:`#64748b`,padding:`0 0.35rem 0.25rem`},children:`أقسام المنظومة`}),oe.map(e=>{let t=n===e.id,r=e.id===`add-invoice`;return(0,q.jsxs)(`button`,{type:`button`,onClick:()=>A(e.id),className:`mobile-nav-item ${t?`active`:``}`,style:r&&!t?{background:`#ecfdf5`,color:`#047857`,borderColor:`#a7f3d0`,fontWeight:800}:void 0,children:[(0,q.jsx)(`span`,{style:{width:34,height:34,borderRadius:10,display:`inline-flex`,alignItems:`center`,justifyContent:`center`,flexShrink:0,background:t?`rgba(255,255,255,0.22)`:r?`#d1fae5`:`#e0e7ff`,color:t?`#ffffff`:r?`#059669`:`#2563eb`},children:e.icon}),(0,q.jsx)(`span`,{style:{flex:1},children:e.label})]},e.id)}),(0,q.jsx)(`div`,{className:`divider`,style:{margin:`0.75rem 0`}}),(0,q.jsxs)(`button`,{type:`button`,className:`mobile-nav-item`,onClick:D,style:{background:`#fef2f2`,color:`#b91c1c`,borderColor:`#fecaca`,fontWeight:800,marginTop:`auto`},children:[(0,q.jsx)(`span`,{style:{width:34,height:34,borderRadius:10,display:`inline-flex`,alignItems:`center`,justifyContent:`center`,background:`#fee2e2`,color:`#dc2626`,flexShrink:0},children:(0,q.jsx)(Cr,{size:18})}),(0,q.jsx)(`span`,{children:`تسجيل الخروج`})]})]}),(0,q.jsx)(`main`,{className:`app-main ${n===`add-invoice`?`app-main-fullpage`:``}`,children:(0,q.jsxs)(`div`,{className:`app-content animate-in`,children:[!ke(e)&&[`dashboard`,`visits`,`add-invoice`,`pharmacies`,`billing`,`sheets`].includes(n)&&(0,q.jsxs)(`div`,{className:`card`,style:{maxWidth:620,margin:`2rem auto`,padding:`2rem 1.5rem`,border:`2px solid #ef4444`,background:`linear-gradient(135deg, #fff5f5, #fef2f2)`,textAlign:`center`},children:[(0,q.jsx)(`div`,{style:{display:`flex`,justifyContent:`center`,marginBottom:`0.85rem`},children:(0,q.jsx)(`div`,{style:{width:64,height:64,borderRadius:`50%`,background:`#fee2e2`,color:`#dc2626`,display:`flex`,alignItems:`center`,justifyContent:`center`},children:(0,q.jsx)(Dn,{size:34})})}),(0,q.jsx)(`h2`,{style:{fontWeight:900,color:`#991b1b`,fontSize:`1.25rem`,marginBottom:`0.6rem`},children:`⛔ لا تملك أي قاعدة بيانات (Google Sheet)`}),(0,q.jsx)(`p`,{style:{color:`#7f1d1d`,fontSize:`0.94rem`,lineHeight:1.7,marginBottom:`0.75rem`,fontWeight:600},children:`عذراً، لا تملك أي قاعدة بيانات (صفحة كوكل شيت) مرتبطة بحسابك في الشيت الرئيسي — تم منع الدخول إلى بيانات الإدارة لحماية الخصوصية. يرجى مراجعة المدير (باقر) لإضافة رابط صفحتك الخاصة.`}),(0,q.jsxs)(`div`,{style:{background:`#ffffff`,border:`1px solid #fecaca`,borderRadius:10,padding:`0.85rem`,fontSize:`0.84rem`,color:`#475569`,marginBottom:`1.25rem`,lineHeight:1.6},children:[(0,q.jsxs)(`div`,{children:[(0,q.jsx)(`strong`,{children:`الحساب الحالي:`}),` `,e.full_name]}),(0,q.jsxs)(`div`,{children:[`يجب على الأدمن (`,(0,q.jsx)(`strong`,{children:`باقر`}),`) إضافة رابط صفحة Google Sheet الخاصة بك في العمود `,(0,q.jsx)(`strong`,{children:`C`}),` داخل الشيت الرئيسي حتى تتمكن من رؤية فواتيرك وإدخال بيانات جديدة. لا يمكنك الدخول إلى شيت الإدارة أو شيت باقر.`]})]}),(0,q.jsxs)(`div`,{style:{display:`flex`,gap:`0.65rem`,justifyContent:`center`,flexWrap:`wrap`},children:[(0,q.jsx)(`button`,{type:`button`,onClick:ee,disabled:C,className:`btn-clay btn-primary`,style:{fontWeight:800},children:C?`⏳ جارِ التحقق من الشيت الرئيسي...`:`🔄 إعادة التحقق من الشيت الرئيسي`}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>A(`profile`),className:`btn-clay btn-secondary`,style:{fontWeight:700},children:[(0,q.jsx)(lr,{size:15}),` حسابي`]}),(0,q.jsxs)(`button`,{type:`button`,onClick:D,className:`btn-clay btn-secondary`,style:{color:`#b91c1c`,borderColor:`#fecaca`,background:`#fee2e2`,fontWeight:700},children:[(0,q.jsx)(Cr,{size:15}),` تسجيل الخروج`]})]})]}),ke(e)&&n===`dashboard`&&(0,q.jsx)(bi,{user:e,kpis:u,invoices:c,pharmacies:i,onNavigate:e=>A(e),onApproveInvoice:ne,onRejectInvoice:e=>O(e,`مرفوض من قِبَل المدير`)}),ke(e)&&n===`visits`&&(0,q.jsx)(Ci,{pharmacies:i,onStartInvoiceForPharmacy:k}),ke(e)&&n===`add-invoice`&&(0,q.jsx)(ki,{pharmacies:i,products:o,invoices:c,initialPharmacyId:y,onInvoiceCreated:ae,onCancel:()=>A(`billing`)},x),ke(e)&&n===`pharmacies`&&(0,q.jsx)(Ai,{pharmacies:i,invoices:c,onStartInvoiceForPharmacy:k,onScheduleVisit:()=>A(`visits`)}),ke(e)&&n===`billing`&&(0,q.jsx)(ji,{user:e,invoices:c,pharmacies:i,onApproveInvoice:ne,onRejectInvoice:O,onDeleteInvoice:re,onUpdateInvoice:ie,onAddInvoice:()=>A(`add-invoice`),onRefresh:te}),ke(e)&&n===`sheets`&&(0,q.jsx)(Mi,{onDataChanged:te}),n===`users`&&e?.role===`admin`&&(0,q.jsx)(Ni,{}),n===`profile`&&(0,q.jsx)(Pi,{user:e,onUserUpdated:e=>t(e)})]})}),n!==`add-invoice`&&ke(e)&&(0,q.jsxs)(`button`,{type:`button`,onClick:()=>A(`add-invoice`),className:`mobile-fab-btn`,title:`إضافة فاتورة جديدة`,children:[(0,q.jsx)($n,{size:19}),(0,q.jsx)(`span`,{children:`+ إضافة فاتورة`})]}),n!==`add-invoice`&&(0,q.jsxs)(`nav`,{className:`mobile-bottom-nav`,children:[(0,q.jsxs)(`button`,{type:`button`,onClick:()=>A(`dashboard`),className:`mobile-bottom-nav-item ${n===`dashboard`?`active`:``}`,children:[(0,q.jsx)(`div`,{className:`bottom-nav-icon`,children:(0,q.jsx)(hr,{size:20})}),(0,q.jsx)(`span`,{className:`bottom-nav-label`,children:`الرئيسية`})]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>A(`billing`),className:`mobile-bottom-nav-item ${n===`billing`?`active`:``}`,children:[(0,q.jsx)(`div`,{className:`bottom-nav-icon`,children:(0,q.jsx)(rr,{size:20})}),(0,q.jsx)(`span`,{className:`bottom-nav-label`,children:`الفواتير`})]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>A(`add-invoice`),className:`mobile-bottom-nav-item highlight`,children:[(0,q.jsx)(`div`,{className:`bottom-nav-icon`,children:(0,q.jsx)($n,{size:24})}),(0,q.jsx)(`span`,{className:`bottom-nav-label`,children:`+ فاتورة`})]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>A(`sheets`),className:`mobile-bottom-nav-item ${n===`sheets`?`active`:``}`,children:[(0,q.jsx)(`div`,{className:`bottom-nav-icon`,children:(0,q.jsx)(tr,{size:20})}),(0,q.jsx)(`span`,{className:`bottom-nav-label`,children:`كوكل شيت`})]}),(0,q.jsxs)(`button`,{type:`button`,onClick:()=>v(!0),className:`mobile-bottom-nav-item ${g?`active`:``}`,children:[(0,q.jsx)(`div`,{className:`bottom-nav-icon`,children:(0,q.jsx)(Dr,{size:20})}),(0,q.jsx)(`span`,{className:`bottom-nav-label`,children:`المزيد`})]})]})]}):(0,q.jsx)(yi,{onLoginSuccess:e=>t(e)})}(0,v.createRoot)(document.getElementById(`root`)).render((0,q.jsx)(_.StrictMode,{children:(0,q.jsx)(Fi,{})}));export{c as n,o as t};