/* Native scroll choreography shared by the standalone preview and React integration. */
(function(global){
function createTorinoMotion(root,paused=false){
 let frame=0,dead=false;const cleanup=[];const opening=root.querySelector('[data-studio="opening"]'),cards=[...root.querySelectorAll('.studio-card')],ticker=root.querySelector('.studio-ticker'),rooms=[...root.querySelectorAll('[data-studio="room"]')],object=root.querySelector('[data-studio="object"]');
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 function draw(){frame=0;if(dead)return;const h=innerHeight,w=innerWidth;const o=opening?.getBoundingClientRect(),t=ticker?.getBoundingClientRect(),r=rooms.map(el=>el.getBoundingClientRect()),b=object?.getBoundingClientRect();const p=paused?0:clamp((72-(o?.top||0))/Math.max(1,(o?.height||h)-h));
 cards.forEach((el,i)=>{if(el.hasAttribute('data-fixed-card'))return;const signs=[-1,1,1],rot=[-11,8,13];el.style.setProperty('--card-y',`${p*(i===2?90:-45)}px`);el.style.setProperty('--card-r',`${rot[i]*(1-p*.85)}deg`)});
 if(ticker) ticker.style.setProperty('--ticker-x',`${paused?-8:-8-clamp(1-(t.top/h),-1,2)*8}%`);
 rooms.forEach((el,i)=>{const next=r[i+1];const covered=paused||!next?0:clamp((h-next.top)/(h-90));el.style.setProperty('--room-scale',String(1-covered*.055));el.style.setProperty('--room-light',String(1-covered*.24))});
 if(object){const q=paused?0:clamp((h-b.top)/(h+b.height));object.style.setProperty('--object-r',`${-9+q*18}deg`);object.style.setProperty('--object-s',`${.92+q*.12}`)}
 }
 function schedule(){if(!frame&&!dead)frame=requestAnimationFrame(draw)}
 global.addEventListener('scroll',schedule,{passive:true});global.addEventListener('resize',schedule);cleanup.push(()=>global.removeEventListener('scroll',schedule),()=>global.removeEventListener('resize',schedule));
 const reveals=root.querySelectorAll('.reveal,.journal-grid>a');if(!paused&&'IntersectionObserver'in global){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target)}}),{threshold:.08});reveals.forEach(el=>observer.observe(el));cleanup.push(()=>observer.disconnect())}else reveals.forEach(el=>el.classList.add('revealed'));
 draw();return {destroy(){dead=true;cancelAnimationFrame(frame);cleanup.forEach(fn=>fn());cards.forEach(el=>{el.style.removeProperty('--card-y');el.style.removeProperty('--card-r')});rooms.forEach(el=>{el.style.removeProperty('--room-scale');el.style.removeProperty('--room-light')});object?.style.removeProperty('--object-r');object?.style.removeProperty('--object-s')}};
}
let active;global.TorinoMotion={create:createTorinoMotion,refresh(root,paused){active?.destroy();active=createTorinoMotion(root,paused)},destroy(){active?.destroy();active=null}};
})(window);
