if((window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth)>=992){!(function(){function o(w,v,i){return w.getAttribute(v)||i;}
function j(i){return document.getElementsByTagName(i);}
function l(){const i=j('script');const w=i.length;const v=i[w-1];return{l:w,z:o(v,'zIndex',-1),o:o(v,'opacity',0.5),c:o(v,'color','0,0,0'),n:o(v,'cotun',99),};}
function k(){(r=u.width=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth),(n=u.height=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight);}
function b(){e.clearRect(0,0,r,n);e.fillStyle='#F5F6F7';e.fillRect(0,0,r,n);const w=[f].concat(t);let x;let v;let A;let B;let z;let
y;t.forEach((i)=>{(i.x+=i.xa),(i.y+=i.ya),(i.xa*=i.x>r||i.x<0?-1:1),(i.ya*=i.y>n||i.y<0?-1:1),e.fillRect(i.x-0.5,i.y-0.5,1,1);for(v=0;v<w.length;v++){x=w[v];if(i!==x&&x.x!==null&&x.y!==null){(B=i.x-x.x),(z=i.y-x.y),(y=B*B+z*z);y<x.max&&(x===f&&y>=x.max/2&&((i.x-=0.03*B),(i.y-=0.03*z)),(A=(x.max-y)/x.max),e.beginPath(),(e.lineWidth=A/2),(e.strokeStyle=`rgba(${s.c},${A + 0.2})`),e.moveTo(i.x,i.y),e.lineTo(x.x,x.y),e.stroke());}}
w.splice(w.indexOf(i),1);}),m(b);}
var u=document.createElement('canvas');var s=l();const c=`c_n${s.l}`;var e=u.getContext('2d');let r;let n;var m=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(i){window.setTimeout(i,1000/45);};const a=Math.random;var f={x:null,y:null,max:20000};u.id=c;u.style.cssText=`position:fixed;top:0;left:0;z-index:${s.z};opacity:${s.o}`;j('body')[0].appendChild(u);k(),(window.onresize=k);(window.onmousemove=function(i){(i=i||window.event),(f.x=i.clientX),(f.y=i.clientY);}),(window.onmouseout=function(){(f.x=null),(f.y=null);});for(var t=[],p=0;s.n>p;p++){const h=a()*r;const g=a()*n;const q=2*a()-1;const d=2*a()-1;t.push({x:h,y:g,xa:q,ya:d,max:6000,});}
setTimeout(()=>{b();},100);}());}