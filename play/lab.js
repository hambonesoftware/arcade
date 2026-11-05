import { createPlayHUD } from "./v1/hambone-play.js";

const stage=document.querySelector("#previewStage");
const frame=document.querySelector("#previewFrame");
const safeText=document.querySelector("#safeRegion");
const resolution=document.querySelector("#resolution");
let hud=null;
let activeStyle="workbench";
let activePhase="ready";
let activeDensity="standard";

const profiles={
  workbench:{title:"LAB 01",metrics:[["force","FORCE","12 kN"],["strain","STRAIN","640 µε"],["mass","MASS","67 kg"]],event:"FIRST YIELD",action:"TEST BEAM"},
  broadcast:{title:"GRAND PRIX",metrics:[["time","TIME","01:03.7"],["position","POSITION","4 / 32"],["merges","MERGES","12"]],event:"NEW RACE LEADER",action:"PAUSE RACE"},
  arcade:{title:"APEIRON X",metrics:[["score","SCORE","18,250"],["lives","LIVES","03"],["level","WAVE","07"]],event:"MULTIPLIER ×4",action:"FIRE"},
  adventure:{title:"HOPSHIFT",metrics:[["hearts","HEALTH","♥ ♥ ♥"],["coins","COINS","27"],["stage","ZONE","02"]],event:"CHECKPOINT SAVED",action:"JUMP"}
};

function rebuild(){
  hud?.destroy();
  const def=profiles[activeStyle];
  stage.dataset.demoGenre=activeStyle;
  hud=createPlayHUD({root:stage,viewport:stage,style:activeStyle,title:def.title,
    metrics:def.metrics.map(m=>({id:m[0],label:m[1],value:m[2]})),
    onSafeRect:rect=>{
      safeText.textContent=Math.round(rect.width)+" × "+Math.round(rect.height)+" px (center "+Math.round(rect.centerX)+", "+Math.round(rect.centerY)+")";
    }});
  hud.addAction({label:"◉ OPTIONS",onClick:()=>{
    const panel=document.createElement("div");
    panel.textContent="Demo tool tray: this area holds the selected game's own existing controls.";
    hud.openTray({title:def.title+" TOOLS",content:panel});
  }});
  hud.addAction({label:"▶ "+def.action,className:"is-primary",onClick:()=>{
    if(activeStyle==="broadcast") hud.setPhase("paused");
    else hud.setPhase("playing");
    hud.showEvent(def.event,{duration:1800});
  }});
  hud.setDensity(activeDensity);
  hud.setPhase(activePhase);
}
function select(group,selector,attr,value){
  document.querySelectorAll(selector).forEach(b=>b.classList.toggle("selected",b.dataset[attr]===value));
}
document.querySelectorAll("[data-style]").forEach(button=>button.addEventListener("click",()=>{
  activeStyle=button.dataset.style;select(null,"[data-style]","style",activeStyle);rebuild();
}));
document.querySelectorAll("[data-phase]").forEach(button=>button.addEventListener("click",()=>{
  activePhase=button.dataset.phase;select(null,"[data-phase]","phase",activePhase);hud.setPhase(activePhase);
}));
document.querySelectorAll("[data-density]").forEach(button=>button.addEventListener("click",()=>{
  activeDensity=button.dataset.density;select(null,"[data-density]","density",activeDensity);hud.setDensity(activeDensity);
}));
document.querySelectorAll("[data-screen]").forEach(button=>button.addEventListener("click",()=>{
  const screen=button.dataset.screen;
  frame.classList.toggle("portrait",screen==="portrait");frame.classList.toggle("landscape",screen==="landscape");
  resolution.textContent=screen==="portrait"?"PORTRAIT / 390 × 720":"LANDSCAPE / 16:9";
  select(null,"[data-screen]","screen",screen);
  requestAnimationFrame(()=>hud.setSafeFrameCallback(rect=>{safeText.textContent=Math.round(rect.width)+" × "+Math.round(rect.height)+" px";}));
}));
document.querySelector("#demoEvent").addEventListener("click",()=>hud.showEvent(profiles[activeStyle].event,{duration:2000}));
rebuild();
