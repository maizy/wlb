import{r as i,j as t}from"./jsx-runtime-56DGgGmo.js";import{u as x,w as y,x as h,y as S,_ as f,O as w,M as j,L as g,S as k}from"./components-hXNuMGC1.js";/**
 * @remix-run/react v2.9.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let a="positions";function M({getKey:e,...l}){let{isSpaMode:u}=x(),o=y(),c=h();S({getKey:e,storageKey:a});let d=i.useMemo(()=>{if(!e)return null;let s=e(o,c);return s!==o.key?s:null},[]);if(u)return null;let m=((s,p)=>{if(!window.history.state||!window.history.state.key){let r=Math.random().toString(32).slice(2);window.history.replaceState({key:r},"")}try{let n=JSON.parse(sessionStorage.getItem(s)||"{}")[p||window.history.state.key];typeof n=="number"&&window.scrollTo(0,n)}catch(r){console.error(r),sessionStorage.removeItem(s)}}).toString();return i.createElement("script",f({},l,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${m})(${JSON.stringify(a)}, ${JSON.stringify(d)})`}}))}function R({children:e}){return t.jsxs("html",{lang:"en",children:[t.jsxs("head",{children:[t.jsx("meta",{charSet:"utf-8"}),t.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),t.jsx(j,{}),t.jsx(g,{})]}),t.jsxs("body",{children:[e,t.jsx(M,{}),t.jsx(k,{})]})]})}function _(){return t.jsx(w,{})}function b(){return t.jsx(t.Fragment,{})}export{b as HydrateFallback,R as Layout,_ as default};
