/* Verbatim copy of the simulator sound engine (unchanged). */
function S58Engine(fs){
const M=1023,T=Math.PI*2,rnd=Math.random,lp=f=>1-Math.exp(-T*f/fs);
const Line=()=>({b:new Float32Array(1024),i:0}),push=(L,x)=>{L.b[L.i]=x;L.i=(L.i+1)&M};
const rd=(L,d)=>{const p=L.i-d,k=Math.floor(p),f=p-k;return L.b[k&M]*(1-f)+L.b[(k+1)&M]*f};
const a2=d=>(d-2)*(d-2); // area ~ d_int^2 (parede 1 mm)
function Seg(mm,A,c,loss,fc){return{mm,A,c,loss,fa:lp(fc),D:1,g:1,f:Line(),b:Line(),fy:0,by:0,fo:0,bo:0}}
function outs(s){let r=rd(s.f,s.D);s.fy+=s.fa*(r-s.fy);s.fo=s.fy*s.g;r=rd(s.b,s.D);s.by+=s.fa*(r-s.by);s.bo=s.by*s.g}
function J(ps){return ps.map(([s,e])=>({s,e,x:0}))}
function runJ(j){let S=0,N=0;for(const p of j){p.x=p.e?p.s.fo:p.s.bo;S+=p.s.A;N+=p.s.A*p.x}const pj=2*N/S;for(const p of j)push(p.e?p.s.b:p.s.f,pj-p.x)}
/* ---- geometria (mm) vinda de paths.py/params.py ---- */
const G={dp:598,red:90,mid:[1240,910],fus:405.9,leg:1142.2,tee:80,lead:100,muf:380,ym:452,tip:230,jp:650};
const pre=(G.leg-G.fus)/2, Am=a2(63.5), Acore=a2(76), Abaf=a2(44.5);
const C={dp:620,mid:570,xp:530,tail:480,ym:450,tip:420,jp:530};
const S=[],mk=(...a)=>{const s=Seg(...a);S.push(s);return s};
const dp=[0,1].map(()=>mk(G.dp,a2(70),C.dp,.05,7000));
const mid=[0,1].map(k=>mk(G.red+G.mid[k]+pre,Am,C.mid,.05,6500));
const com=mk(G.fus,1.55*Am,C.xp,.06,6000);
const po=[0,1].map(()=>mk(pre-G.tee,Am,C.xp,.05,6000));
const jp=[0,1].map(()=>mk(G.jp,a2(50.8),C.jp,.06,5000));
const tl=[0,1].map(()=>mk(G.tee+G.lead,Am,C.tail,.05,6000));
const mf=[0,1].map(()=>mk(G.muf,Am,C.tail,.1,4500));
const ym=[0,1].map(()=>mk(G.ym,a2(76.2),C.ym,.05,6000));
const tp=[0,1].map(()=>mk(G.tip,a2(101.6),C.tip,.04,6000));
const N1=[0,1].map(k=>J([[dp[k],1],[mid[k],0]])), X1=J([[mid[0],1],[mid[1],1],[com,0]]), X2=J([[com,1],[po[0],0],[po[1],0]]);
const TT=[0,1].map(k=>J([[po[k],1],[tl[k],0],[jp[k],0]])), M1=[0,1].map(k=>J([[tl[k],1],[mf[k],0]]));
const M2=[0,1].map(k=>J([[mf[k],1],[ym[k],0]])), Y=[0,1].map(k=>J([[ym[k],1],[tp[k],0]]));
const E={rpm:750,pedal:0,load:0,gear:0,cut:false,v:1,valve:'auto',v12:false,pops:true,cabin:false,vol:1,onFire:null,
  ang:0,nextEv:0,ev:0,act:[],cyl:[1,.97,1.03,.99,1.02,.98],G};
/* pulso de blowdown no domínio do ângulo (0..130°) */
const SH=new Float32Array(257);{let m=0;for(let i=0;i<=256;i++){const t=i/256*130;SH[i]=(1-Math.exp(-t/5))*Math.exp(-t/26);m=Math.max(m,SH[i])}for(let i=0;i<=256;i++)SH[i]/=m}
const ORDER=[1,5,3,6,2,4],GEAR=[1,.5,.33,.24];
const st={ta:[0,0],tb:[0,0],mt:[0,0],nz:0,pop:[0,0],rp:[0,0],rl:[0,0],dx:0,dy:0,ex:0,ey:0,cl:[0,0],t:0};
function dyn(dt){
  E.load+=(E.pedal-E.load)*Math.min(1,dt*10);
  const g=GEAR[E.gear];
  if(E.cut){E.rpm-=3200*dt;if(E.rpm<7200-130)E.cut=false}
  else if(E.pedal>.02)E.rpm+=E.pedal*g*5200*(1-.35*E.rpm/7200)*dt;
  else E.rpm-=(500+E.rpm*.5)*(E.gear?1.4:1)*dt;
  if(E.rpm<750)E.rpm=750; if(E.rpm>=7200){E.rpm=7200;E.cut=true}
  const vt=E.valve==='open'?1:E.valve==='closed'?0:(E.rpm>3800||E.load>.75?1:0);
  E.v+=(vt-E.v)*Math.min(1,dt*8);
  const tf=.9+.1*E.load;
  for(const s of S){s.D=Math.max(1,s.mm*fs/(1000*s.c*tf));s.g=1-s.loss*s.mm/1000}
  for(const k of[0,1]){mf[k].A=Abaf+E.v*Acore;mf[k].fa=lp(700+5000*E.v);mf[k].g=1-(.15+1.6*(1-E.v))*G.muf/1000}
}
const nEv=()=>E.v12?12:6;
function fire(){
  const n=nEv(),k=E.ev%n,cyl=E.v12?(k+1):ORDER[k],bank=E.v12?k%2:(cyl<=3?0:1);
  let a=(.18+.82*E.load)*(.55+.45*E.rpm/7200)*(1+.6*E.load*Math.min(1,Math.max(0,(E.rpm-2000)/2000)));
  a*=(E.v12?.7:E.cyl[cyl-1])*(1+.08*(rnd()-.5));
  if(E.cut&&rnd()>.12)a*=.04;
  E.act.push({t0:E.ang,a,bank,w:E.v12?1.5:1});
  if(E.onFire)E.onFire(cyl,bank,E.rpm);
  E.ev++;E.nextEv+=720/n;
}
E.process=function(oL,oR,n){
  const dt=1/fs,kT=lp(1100+3000*(.3+.7*E.load));
  for(let i=0;i<n;i++){
    if((i&31)===0)dyn(32*dt);
    E.ang+=E.rpm*6*dt;
    while(E.ang>=E.nextEv)fire();
    const s=[0,0],z=rnd()*2-1;st.nz+=.35*(z-st.nz);
    for(let j=E.act.length-1;j>=0;j--){const p=E.act[j],th=(E.ang-p.t0)*p.w;
      if(th>=130){E.act.splice(j,1);continue}
      const f=th*256/130,q=f|0,v=SH[q]+(SH[q+1]-SH[q])*(f-q);
      s[p.bank]+=p.a*v*(1+.5*st.nz*(.5+E.load))}
    if(E.pops&&E.pedal<.05&&E.rpm>2200&&rnd()<dt*(E.rpm-2000)/1400)st.pop[rnd()<.5?0:1]=.5+rnd()*.8;
    for(const k of[0,1]){
      st.pop[k]*=.9985; s[k]+=st.pop[k]*z*.6*st.pop[k];
      st.ta[k]+=kT*(s[k]-st.ta[k]);st.tb[k]+=kT*(st.ta[k]-st.tb[k]);s[k]=st.tb[k];if(E.ts)s[k]=E.ts[k];
      outs(dp[k]);outs(mid[k]);outs(po[k]);outs(jp[k]);outs(tl[k]);outs(mf[k]);outs(ym[k]);outs(tp[k])}
    outs(com);
    for(const k of[0,1]){
      push(dp[k].f,s[k]*2+.55*dp[k].bo);        // turbina: fonte + reflexão parcial
      runJ(N1[k]);runJ(TT[k]);runJ(M1[k]);runJ(M2[k]);runJ(Y[k]);
      push(jp[k].b,.985*jp[k].fo);              // J-pipe: fundo cego
      const inc=tp[k].fo;st.mt[k]+=lp(1800)*(inc-st.mt[k]);const out=-.96*st.mt[k];push(tp[k].b,out); // boca aberta
      const u=inc-out,d=u-st.rp[k];st.rp[k]=u;st.rl[k]+=lp(5000)*(d-st.rl[k]);
      st.cl[k]=st.rl[k]+(E.pedal+.1)*(E.rpm/7200)**2*.03*z; // ruído de escoamento na ponteira
    }
    runJ(X1);runJ(X2);
    let l=st.cl[0]+.3*st.cl[1],r=st.cl[1]+.3*st.cl[0];
    if(E.cabin){const m=(l+r)*.5;st.t+=lp(900)*(m-st.t);l=r=st.t*1.6}
    const y=l*3*E.vol,yy=r*3*E.vol;
    const dcL=y-st.dx+.995*st.dy;st.dx=y;st.dy=dcL;
    const dcR=yy-st.ex+.995*st.ey;st.ex=yy;st.ey=dcR;
    oL[i]=Math.tanh(dcL);oR[i]=Math.tanh(dcR);
  }
};
E.setComp=(loop,up)=>{mid[0].mm=G.red+G.mid[1]+loop+pre;mid[1].mm=G.red+G.mid[1]+pre;dp[1].mm=G.dp+up};E.setComp(330,0);
E.reset=()=>{E.act=[];E.ang=0;E.nextEv=0;E.ev=0;E.cut=false};
E.segs=S;
return E}
export default S58Engine;
