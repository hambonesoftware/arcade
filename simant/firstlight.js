'use strict';
/* First Light: scenario rules, pure mission state and objective descriptions.
   Runtime activity (ants, food, battles, digging) is owned by game.js. */
(() => {
  const OUTPOST={x:686,y:360,r:38};
  const BORDER={x:507,y:348,r:86};
  const STEPS=[
    {id:'food',title:'Feed the first brood',hint:'Select Workers and gather from the nearby green seed patch. Workers must carry the food home.',action:'Find food',label:'1 / 5 · FORAGE'},
    {id:'dig',title:'Room to grow',hint:'Open the Nest. Mark the excavation and watch your workers clear six soil cells. Then build the nursery.',action:'Open nest & excavate',label:'2 / 5 · EXCAVATE'},
    {id:'border',title:'The contested border',hint:'Train three soldiers, then hold the glowing food site with at least one black ant for 18 seconds.',action:'Find the border',label:'3 / 5 · EXPAND'},
    {id:'raid',title:'Defend the queen',hint:'Red raiders are approaching. Select soldiers, defend your entrance and survive their attack.',action:'Defend the nest',label:'4 / 5 · DEFEND'},
    {id:'outpost',title:'Secure the patch',hint:'Destroy the enemy forward outpost, then hold its position for 16 seconds.',action:'Attack the outpost',label:'5 / 5 · CONQUER'}
  ];
  function fresh(){
    return {version:1,step:0,delivered:0,cells:[0,0,0,0,0,0],digQueued:false,
      borderHold:0,raidElapsed:0,raidSpawned:false,raidIds:[],
      outpostHealth:95,outpostHold:0,complete:false,failed:false,
      initialWorkers:4,workerLosses:0,lastReward:-1};
  }
  function normalize(input){
    const defaults=fresh();
    if(!input||typeof input!=='object')return defaults;
    const o={...defaults,...input};
    o.step=Number.isInteger(o.step)?Math.max(0,Math.min(5,o.step)):0;
    o.delivered=Number.isFinite(o.delivered)?Math.max(0,o.delivered):0;
    o.cells=Array.from({length:6},(_,i)=>Number.isFinite(input.cells?.[i])?Math.max(0,Math.min(1,input.cells[i])):0);
    for(const k of ['borderHold','raidElapsed','outpostHealth','outpostHold']){
      if(!Number.isFinite(o[k]))o[k]=defaults[k];
    }
    o.raidIds=Array.isArray(o.raidIds)?o.raidIds.filter(Number.isInteger).slice(0,18):[];
    return o;
  }
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  function dug(state){return state.cells.filter(v=>v>=1).length;}
  function completion(state,workers,soldiers,nursery){
    switch(state.step){
      case 0:return state.delivered>=45;
      case 1:return dug(state)===6 && nursery>=1;
      case 2:return soldiers>=3 && state.borderHold>=18;
      case 3:return state.raidElapsed>=45;
      case 4:return state.outpostHealth<=0 && state.outpostHold>=16;
      default:return false;
    }
  }
  function objective(state,soldiers,nursery){
    const s=STEPS[Math.min(4,state.step)];
    switch(state.step){
      case 0:return {...s,progress:clamp(state.delivered/45,0,1),counter:Math.min(45,Math.floor(state.delivered))+' / 45 food delivered'};
      case 1:{const n=dug(state);return {...s,progress:(n+(nursery>0?2:0))/8,counter:n+' / 6 soil cells · Nursery '+(nursery?'built':'required')};}
      case 2:return {...s,progress:clamp((Math.min(soldiers,3)/3+Math.min(state.borderHold,18)/18)/2,0,1),
        counter:Math.min(soldiers,3)+' / 3 soldiers · '+Math.floor(Math.min(state.borderHold,18))+' / 18s holding'};
      case 3:return {...s,progress:clamp(state.raidElapsed/45,0,1),counter:Math.floor(state.raidElapsed)+' / 45 seconds survived'};
      case 4:return {...s,progress:clamp((1-state.outpostHealth/95)*.7+Math.min(state.outpostHold,16)/16*.3,0,1),
        counter:state.outpostHealth>0?'Outpost health '+Math.ceil(state.outpostHealth)+'%':'Territory held '+Math.floor(Math.min(state.outpostHold,16))+' / 16s'};
      default:return {id:'victory',title:'First Light secured!',hint:'Your colony is ready to spread into the backyard.',label:'MISSION COMPLETE',action:'Open Backyard',counter:'5 / 5 objectives',progress:1};
    }
  }
  window.ColonyFirstLight={OUTPOST,BORDER,STEPS,fresh,normalize,dug,completion,objective};
})();