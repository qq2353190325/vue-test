import{_ as v,r as C,o as S,c as x,a as k}from"./index-7dde7ba7.js";const y=1024*1024*5,g=navigator.hardwareConcurrency||4;function I(_,d){return new Promise(s=>{const p=[],c=Math.ceil(_.size/y),u=Math.ceil(c/g);let f=0;for(let r=0;r<g;r++){const l=new Worker(new URL("/assets/worker-75a50425.js",self.location),{type:"module"}),n=r*u;let e=n+u;e>c&&(e=c),l.postMessage({file:_,CHUNK_SIZE:y,startIndex:n,endIndex:e,identifier:d}),l.onmessage=o=>{for(let t=n;t<e;t++)p[t]=o.data[t-n];l.terminate(),f++,f===g&&s(p)}}})}const T={class:"container"},O={__name:"VideoSlice",setup(_){const d=C(),s=C(),p=n=>`${n.name}-${d.value}`,c=()=>{},u=async n=>{s.value=n.target.files[0],d.value=Date.now();let e=p(s.value);console.time("分片");const o=await I(s.value,e);console.timeEnd("分片"),console.log(o),await f(o);const t=await r(e);for(const{i:a,chunk:i,fileIdentifier:w}of o){if(t.includes(a))continue;const m=new FormData;m.append("file",i),m.append("index",a),m.append("identifier",w),(await fetch("http://127.0.0.1:3000/admin/upload",{method:"POST",body:m})).ok&&console.log("继传成功")}const h=await l(e,s.value.name);console.log(h?"文件上传成功":"文件合并失败")},f=async n=>{let e=0,o={};n[0].fileIdentifier;for(const{i:t,chunk:h,fileIdentifier:a}of n){const i=new FormData;i.append("file",h),i.append("index",t),i.append("identifier",a),(await fetch("http://127.0.0.1:3000/admin/upload",{method:"POST",body:i})).ok?(e+=h.size,o[a]=(e/s.value.size*100).toFixed(2),console.log(`上传进度：${o[a]}%`)):console.log("上传失败")}},r=async n=>{const e=await fetch("http://127.0.0.1:3000/admin/check-uploaded",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({identifier:n})});return e.ok?(await e.json()).uploadedChunks:[]},l=async(n,e)=>(await fetch("http://127.0.0.1:3000/admin/mergeChunks",{method:"POST",body:JSON.stringify({identifier:n,fileName:e})})).ok;return(n,e)=>(S(),x("div",T,[k("div",null,[k("input",{type:"file",ref:"fileInput",onChange:u,accept:"video/*"},null,544),k("button",{onClick:c},"确定")])]))}},P=v(O,[["__scopeId","data-v-8cfad1c1"]]);export{P as default};
