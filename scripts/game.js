
'use strict';
const $=s=>document.querySelector(s),c=$('#world'),ctx=c.getContext('2d'),keys={},sprites={},ART={};
let dockHeightPx=0,terrainCameraY=562;
const CAST={yuji:{name:'Yuji Itadori',title:'THE VESSEL',color:'#ff647b',desc:'Close the distance. Chain heavy strikes into devastating Black Flashes.',passive:'Vessel’s resolve · combo finishers restore 10 energy',skill:'Divergent Fist',ult:'Black Flash',domain:'Benevolent Boundary'},sukuna:{name:'Ryomen Sukuna',title:'KING OF CURSES',color:'#ff6c58',desc:'Carve through curses with Dismantle, launch Divine Flame, and unleash Malevolent Shrine.',passive:'Predatory instinct · exorcisms restore 8 health',skill:'Dismantle',ult:'Divine Flame',domain:'Malevolent Shrine'},megumi:{name:'Megumi Fushiguro',title:'TEN SHADOWS',color:'#a38bff',desc:'Command Divine Dogs and call down Nue. Control the battlefield from the shadows.',passive:'Shadow affinity · techniques recover 15% faster',skill:'Divine Dogs',ult:'Nue',domain:'Chimera Shadow Garden'},gojo:{name:'Satoru Gojo',title:'THE STRONGEST',color:'#63d6ff',desc:'Draw curses into Blue, repel them with Red, and overwhelm them with Limitless. Hold Space while falling to hover briefly.',passive:'Infinity · spends 18 energy to block one hit every 8 seconds',skill:'Lapse: Blue',ult:'Reversal: Red',domain:'Unlimited Void'}};
CAST.custom={name:'Custom Sorcerer',title:'NEW GENERATION',color:'#da9dff',desc:'A modern-day sorcerer with your own name, aura, and inherited cursed technique.',passive:'A fresh start · find your own path',skill:'Divergent Fist',ult:'Black Flash',domain:'Falling Star'};
const CHAPTERS={
yuji:[['A Promise to Protect','The curtain has fallen. Someone out there still needs you.'],['Shadows in the Grove','Keep moving. You made a promise.'],['Shibuya Rescue','The station is full of curses. Find the survivors.'],['A Final Stand','Break the veil before more people are hurt.'],['Sunrise After Shibuya','The people you saved finally make it home.']],
megumi:[['The Missing Shadow','A shikigami disappeared while tracking a curse.'],['Whispers in the Grove','The shadows here are hiding something.'],['Shibuya Investigation','Follow the residuals into the station.'],['Chimera Unleashed','Recover your shadow from the sealed shrine.'],['Shadows Returned','The missing shikigami returns from the shrine.']],
gojo:[['The Unbreakable Curtain','Someone designed this veil to trap even you.'],['A Missing Student','Follow the trail through the grove.'],['The Shibuya Trap','You know the city is a trap. Walk in anyway.'],['Beyond Infinity','Show the curse why its barrier cannot hold you.'],['The Strongest Can Rest','The veil falls. Your students inherit a brighter future.']],
sukuna:[['Exiled in the Heian Era','Rejected at birth and hunted by sorcerer clans, you are forced to survive without a teacher.'],['The First Hunt','No one will teach you cursed energy. Defeat the clan hunters and discover your power alone.'],['The Bloody Capital','The great Heian capital sends its strongest sorcerers to hunt you.'],['Rise of the King','Survive the final hunt and carve your name into the era of curses.'],['The King Remains','The guardian is gone. Your reign is only beginning.']],
custom:[['Your First Assignment','A new sorcerer enters Jujutsu High.'],['An Innate Technique','Your power awakens among the bamboo.'],['Night Shift','Your first solo mission takes you to Shibuya.'],['Special Grade Examination','Defeat the shrine guardian to earn your title.']]
};
let ZONES=[{name:'Jujutsu High',sub:'A quiet place before the storm',x:0,end:1500,color:'#9bc3bb'},{name:'Whispering Grove',sub:'Something moves between the bamboo',x:1500,end:3100,color:'#7ae8c1'},{name:'Shibuya After Dark',sub:'The streets belong to the curses',x:3100,end:5700,color:'#ed7cb6'},{name:'The Sealed Shrine',sub:'A special grade waits beyond the gate',x:5700,end:7600,color:'#f4a079'}];
const groundY=x=>x<1500?562:x<3100?612:x<5700?562:612;
let platforms=[{x:0,y:562,w:1500,h:500},{x:1500,y:612,w:1600,h:500},{x:3100,y:562,w:2600,h:500},{x:5700,y:612,w:1900,h:500},...[ [550,435,190],[900,335,200],[1230,430,160],[1690,490,210],[2040,385,200],[2410,465,220],[2770,355,220],[3330,435,250],[3720,330,260],[4140,405,240],[4510,300,260],[4930,425,240],[5350,340,190],[5900,485,220],[6260,380,190],[6580,470,210] ].map(([x,y,w])=>({x,y,w,h:20}))];
const BASE_SHRINES=[{x:290,name:'School Gate'},{x:2880,name:'Grove Lantern'},{x:5480,name:'Station Lantern'}];
const BASE_CHESTS=[{x:970,y:335,id:0},{x:2120,y:385,id:1},{x:2820,y:355,id:2},{x:4590,y:300,id:3},{x:5430,y:340,id:4},{x:6330,y:380,id:5}];
const ORIGIN_ROOFS=[[550,435,190],[900,335,200],[1230,430,160],[1690,490,210],[2040,385,200],[2410,465,220],[2770,355,220],[3330,435,250],[3720,330,260],[4140,405,240],[4510,300,260],[4930,425,240],[5350,340,190],[5900,485,220],[6260,380,190],[6580,470,210]];
const INITIAL=()=>({customSkin:'#e9ad8d',customEyes:'#71e5f4',customHairStyle:0,customBuild:0,customAccessory:0,customMark:0,customEyesShape:0,customTrim:'#f2ba76',lifeStage:0,lifeBossWins:[],sideQuestClaims:[],storyEnded:false,eliteDefeated:[],rituals:[],encounterCount:0,encounterTimer:7,campaignStep:0,learned:{},trainingHits:0,heian:true,focusTraining:false,reinforcedGuard:false,comboMastery:false,storyTokens:0,storyMilestones:[],customHair:'#e5bcd7',customOutfit:'#30456d',rct:false,rctCd:0,mastery:false,storySeen:[],customName:'Custom Sorcerer',customStyle:'yuji',customColor:'#da9dff',x:185,y:460,w:34,h:70,vx:0,vy:0,face:1,hp:130,ce:100,level:1,xp:0,points:0,char:'yuji',skill:false,advanced:false,domain:false,power:0,vitality:0,ground:false,jumps:0,inv:0,attack:0,combo:0,comboTimer:0,cd:0,scd:0,rcd:0,dcd:0,dash:0,dashCd:0,slideTime:0,slideCooldown:0,slideDirection:1,castTime:0,hurtTime:0,passiveCd:0,jumpBuffer:0,coyote:0,checkpoint:185,coins:0,medkits:2,tonics:1,itemCd:0,hoverTime:0,hovering:false,outfits:{},outfitUnlocks:[],trialsWon:0});
let manualSavePending=false;
let trial={active:false,wave:0,timer:0,cleared:false,backup:[],returnX:0,returnY:0};
const REDUCED_MOTION=!!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
let cameraLook=0;
let mouseAttacking=false;
let pendingStrikes=[],portraitKey='';
let needsRedraw=true;
let p=INITIAL(),W=1280,H=720,cam=0,last=0,time=0,walking=0,paused=true,started=false,zoneIndex=0,quest=0,kills=0,bossDead=false,opened=[],effects=[],particles=[],texts=[],enemies=[],shots=[],hitStop=0,shake=0,domainTime=0,noticeTime=0,zoneTime=0,autoSave=0,saveData=null,saveOK=false,sound=true,audio=null,settings={shake:!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches,zoom:1.2},activeTab='techniques',tutorial=0;
let chests=[{x:970,y:335,id:0},{x:2120,y:385,id:1},{x:2820,y:355,id:2},{x:4590,y:300,id:3},{x:5430,y:340,id:4},{x:6330,y:380,id:5}];
let shrines=[{x:290,name:'School Gate'},{x:2880,name:'Grove Lantern'},{x:5480,name:'Station Lantern'}];
function readDockLayout(){const dock=$('#combatDock'),rect=dock.getBoundingClientRect?.();dockHeightPx=dock.hidden?0:rect?.height||(innerWidth<800?210:144);document.documentElement?.style?.setProperty?.('--dock-height',dockHeightPx+'px');needsRedraw=true}
function groundScreenY(){return Math.max(160,Math.min(562,720-(dockHeightPx+48)/innerHeight*720))}
function worldOffsetY(){let offset=groundScreenY()-terrainCameraY*cameraZoom();if(started&&p.y*cameraZoom()+offset<105)offset=105-p.y*cameraZoom();return offset}
function resize(){W=Math.max(240,Math.round(innerWidth/innerHeight*720));c.width=W;c.height=720;ctx.imageSmoothingEnabled=false;if(typeof needsRedraw!=='undefined')needsRedraw=true;readDockLayout()}resize();addEventListener('resize',resize);
function cameraZoom(){return settings.zoom===1?1:settings.zoom===1.4?1.4:1.2}
function visibleWidth(){return W/cameraZoom()}
function maxHP(){return 120+p.level*10+p.vitality*30}
function zoneAt(x){return x<1500?0:x<3100?1:x<5700?2:3}
function say(s){$('#notice').textContent=s;noticeTime=3.4}
function float(s,x,y,color='#fff'){texts.push({s,x,y,color,t:1.2})}
function tone(freq=300,duration=.08,type='sine',vol=.035){if(!sound)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(30,freq*.4),audio.currentTime+duration);g.gain.setValueAtTime(vol,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration)}catch{}}
function burst(x,y,color,n=12,speed=180){for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*speed*2,vy:(Math.random()-.6)*speed,t:.3+Math.random()*.5,color,size:2+Math.random()*3})}
function pack(){return {version:2,p:{...p,x:trial.active?trial.returnX:p.x,y:trial.active?trial.returnY:p.y,vx:0,vy:0,dash:0,inv:1},quest,kills,bossDead,opened,settings,sound}}
function decodeBackup(text){if(typeof text!=='string'||text.length>50000)throw Error('That file is too large for a save backup.');let data;try{data=JSON.parse(text)}catch{throw Error('That file is not a valid JSON save.')}if(!validSave(data))throw Error('This is not a supported VEILBOUND save backup.');return data}
function exportBackup(){const blob=new Blob([JSON.stringify(pack(),null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='veilbound-'+p.char+'-level-'+p.level+'.json';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);say('Save backup exported. Keep it to restore this journey later.')}
async function importBackup(file){if(!file)return;try{if(file.size>50000)throw Error('That file is too large for a save backup.');const data=decodeBackup(await file.text());saveData=data;start(data.p.char,true);save();say('Save backup restored. Welcome back.')}catch(error){say(error.message||'Could not read that save backup.')}}
function validSave(s){return s&&s.version===2&&s.p&&CAST[s.p.char]&&Number.isFinite(s.p.x)&&s.p.x>=0&&s.p.x<=7600&&Number.isFinite(s.p.level)&&s.p.level>=1&&s.p.level<1000&&Array.isArray(s.opened)}
function save(manual=false){saveData=pack();try{localStorage.setItem('jjk-veilbound-v2',JSON.stringify(saveData));saveOK=true}catch{saveOK=false}if(window.parent!==window)window.parent.postMessage({type:'veilbound-save',data:saveData},'*');if(manual){manualSavePending=true;say(saveOK?'Progress saved.':window.parent!==window?'Saving through loader…':'Browser storage is unavailable. Export a save backup in Settings.')}}
try{const data=JSON.parse(localStorage.getItem('jjk-veilbound-v2'));if(validSave(data))saveData=data}catch{}
addEventListener('message',e=>{if(e.source!==window.parent)return;if(e.data?.type==='veilbound-save-data'&&validSave(e.data.data)){saveData=e.data.data;if(!started)title()}if(e.data?.type==='veilbound-save-result'){saveOK=!!e.data.ok;if(manualSavePending){say(saveOK?'Progress saved.':'Browser storage is unavailable. Export a save backup in Settings.');manualSavePending=false}else if(!saveOK)say('Browser storage is unavailable. Export a save backup in Settings.')}});
if(window.parent!==window)window.parent.postMessage({type:'veilbound-load'},'*');
const ORIGINS={
 yuji:{start:185,name:'Tokyo Jujutsu High',era:'MODERN DAY',zones:['Training Courtyard','Cursed Bamboo Grove','Shibuya Crossing','Sealed Shrine'],sky:['#15263e','#293b59'],accent:'#84cde1'},
 megumi:{start:1620,name:'Fushiguro Estate',era:'MODERN DAY',zones:['Abandoned Estate','Ten Shadows Forest','Ritual District','Moonlit Temple'],sky:['#0b1524','#2a304d'],accent:'#a6a1ee'},
 gojo:{start:3360,name:'Gojo Clan Compound',era:'MODERN DAY',zones:['Gojo Clan Residence','Infinity Training Grounds','City of Barriers','Prison Seal Sanctum'],sky:['#122840','#254d65'],accent:'#8eeafa'},
 sukuna:{start:1560,name:'Heian Exile',era:'HEIAN PERIOD',zones:['Exile Settlement','Forest of the Hunted','Heian Capital','Blood Moon Shrine'],sky:['#2a121e','#60313e'],accent:'#f4a079'},
 custom:{start:4160,name:'Modern Sorcerer Academy',era:'MODERN DAY',zones:['First-Year Dormitory','Technique Practice Field','Night City Patrol','Qualification Shrine'],sky:['#161c38','#45315e'],accent:'#d3a5f6'}
};
let currentOrigin='yuji';
function setupOrigin(char){
 currentOrigin=ORIGINS[char]?char:'yuji';const origin=ORIGINS[currentOrigin],names=origin.zones;
 ZONES=ZONES.map((z,i)=>({...z,name:names[i],sub:origin.era+' · '+names[i],color:origin.accent}));
 // Keep the continuous collidable world, but each campaign has its own spawn, rooftops and field structures.
 const rooftopShift={yuji:0,megumi:-28,gojo:35,sukuna:-47,custom:18}[currentOrigin];
 platforms=platforms.filter(f=>f.h>100).concat(ORIGIN_ROOFS.map(([x,y,w],i)=>({x:x+(i%3)*26,y:y+rooftopShift+(i%2)*9,w,h:20})));
 shrines=[{x:origin.start+80,name:origin.name+' · Sanctuary'}, ...BASE_SHRINES.filter(s=>Math.abs(s.x-origin.start)>180)];
 chests=BASE_CHESTS.map(v=>({...v}));
}
function drawOriginSet(){
 if(currentOrigin==='yuji')return;
 const origin=ORIGINS[currentOrigin],color=origin.accent;
 for(let i=0;i<25;i++){const x=120+i*300;if(x<cam-240||x>cam+W+240)continue;const y=groundY(x),variant=(i+currentOrigin.length)%4;
  if(currentOrigin==='sukuna'){
   rect(x-50,y-115,105,115,'#352630');rect(x-61,y-121,125,12,'#9b5e55');poly([[x-80,y-118],[x,y-195-variant*10],[x+80,y-118]],'#4e2c36');rect(x-14,y-80,30,80,'#201923');
   for(let j=0;j<3;j++)rect(x+38+j*7,y-85,4,48,'#b76d5a');
  }else if(currentOrigin==='megumi'){
   rect(x-36,y-140,76,140,'#1b2737');poly([[x-55,y-143],[x,y-202],[x+56,y-143]],'#2e4256');rect(x-14,y-86,26,84,'#111827');
   for(let j=0;j<4;j++)circle(x-28+j*16,y-169,2,'#968bd8');
  }else if(currentOrigin==='gojo'){
   rect(x-45,y-190,95,190,'#1b3347');rect(x-53,y-196,112,11,'#9fd8ec');rect(x-25,y-166,50,110,'#243d53');for(let j=0;j<5;j++)rect(x-31+j*13,y-154,7,45,'#82c1d2');glow(x,y-175,75,'#9acdf017');
  }else{
   rect(x-51,y-148,105,148,'#312d55');rect(x-60,y-153,120,9,'#ab85ca');rect(x-25,y-112,45,68,'#171b36');for(let j=0;j<3;j++)rect(x+25+j*11,y-129,7,20,'#ac8dc7');
  }
 }
 for(const s of shrines)lantern(s.x,groundY(s.x),true);
 for(const ch of chests)if(!opened.includes(ch.id)){rect(ch.x-17,ch.y-20,35,20,'#765237');rect(ch.x-18,ch.y-24,37,7,'#c49e62')}
 ctx.save();ctx.fillStyle=color;ctx.globalAlpha=.8;ctx.font='bold 13px monospace';ctx.textAlign='center';ctx.fillText(origin.era+' · '+origin.name,ORIGINS[currentOrigin].start+100,groundY(origin.start)-105);ctx.restore();
}

const EXTENDED_QUESTS={"yuji":[{"title":"The Ruined Arcade","type":"elite","target":0,"description":"Defeat the regional commander","xp":120,"fragments":40},{"title":"A Promise at the Torii","type":"ritual","target":0,"description":"Purify a cursed seal (E)","xp":140,"fragments":45},{"title":"Midnight Exorcism","type":"kills","target":14,"description":"Defeat 14 curses in total","xp":160,"fragments":50},{"title":"Road to Shibuya","type":"travel","target":1450,"description":"Explore 1450 meters beyond your origin","xp":180,"fragments":55},{"title":"The Unmarked Curse","type":"elite","target":1,"description":"Defeat the regional commander","xp":200,"fragments":60},{"title":"A Signal from Below","type":"ritual","target":1,"description":"Purify a cursed seal (E)","xp":220,"fragments":65},{"title":"The Station Sweep","type":"kills","target":20,"description":"Defeat 20 curses in total","xp":240,"fragments":70},{"title":"Black Flash Practice","type":"level","target":6,"description":"Reach level 6","xp":260,"fragments":75},{"title":"Subway Ambush","type":"elite","target":2,"description":"Defeat the regional commander","xp":280,"fragments":80},{"title":"Protect the Evacuation","type":"ritual","target":2,"description":"Purify a cursed seal (E)","xp":300,"fragments":85},{"title":"Stronger Than Fear","type":"kills","target":27,"description":"Defeat 27 curses in total","xp":320,"fragments":90},{"title":"The Crossing","type":"travel","target":2100,"description":"Explore 2100 meters beyond your origin","xp":340,"fragments":95},{"title":"The Final Curse User","type":"elite","target":3,"description":"Defeat the regional commander","xp":360,"fragments":100},{"title":"A Prayer for the Lost","type":"ritual","target":3,"description":"Purify a cursed seal (E)","xp":380,"fragments":105},{"title":"Aftermath Training","type":"level","target":8,"description":"Reach level 8","xp":400,"fragments":110},{"title":"Shibuya's Last Spirits","type":"kills","target":35,"description":"Defeat 35 curses in total","xp":420,"fragments":115},{"title":"Perfect Your Divergent Fist","type":"skill","target":"advanced","description":"Unlock advanced in the skill tree","xp":440,"fragments":120},{"title":"Defenders of Dawn","type":"kills","target":44,"description":"Defeat 44 curses in total","xp":460,"fragments":125},{"title":"Restore Your Strength","type":"skill","target":"rct","description":"Unlock rct in the skill tree","xp":480,"fragments":130},{"title":"A New Grade","type":"level","target":10,"description":"Reach level 10","xp":500,"fragments":135},{"title":"Ghosts of the Crossing","type":"kills","target":52,"description":"Defeat 52 curses in total","xp":520,"fragments":140},{"title":"Benevolent Boundary","type":"skill","target":"domain","description":"Unlock domain in the skill tree","xp":540,"fragments":145},{"title":"The Never-Ending Veil","type":"kills","target":65,"description":"Defeat 65 curses in total","xp":560,"fragments":150},{"title":"An Unbroken Promise","type":"level","target":12,"description":"Reach level 12","xp":580,"fragments":155}],"megumi":[{"title":"Wolf at the Gate","type":"elite","target":0,"description":"Defeat the regional commander","xp":120,"fragments":40},{"title":"Seal of the Shadows","type":"ritual","target":0,"description":"Purify a cursed seal (E)","xp":140,"fragments":45},{"title":"The Cursed Grove","type":"kills","target":14,"description":"Defeat 14 curses in total","xp":160,"fragments":50},{"title":"Footprints in the Rain","type":"travel","target":1450,"description":"Explore 1450 meters beyond your origin","xp":180,"fragments":55},{"title":"The Wandering Summoner","type":"elite","target":1,"description":"Defeat the regional commander","xp":200,"fragments":60},{"title":"The Forgotten Shikigami","type":"ritual","target":1,"description":"Purify a cursed seal (E)","xp":220,"fragments":65},{"title":"The Haunted Estate","type":"kills","target":20,"description":"Defeat 20 curses in total","xp":240,"fragments":70},{"title":"A Silent Technique","type":"level","target":6,"description":"Reach level 6","xp":260,"fragments":75},{"title":"The Masked Binder","type":"elite","target":2,"description":"Defeat the regional commander","xp":280,"fragments":80},{"title":"The Second Seal","type":"ritual","target":2,"description":"Purify a cursed seal (E)","xp":300,"fragments":85},{"title":"Return to the Shadows","type":"kills","target":27,"description":"Defeat 27 curses in total","xp":320,"fragments":90},{"title":"The Forest Edge","type":"travel","target":2100,"description":"Explore 2100 meters beyond your origin","xp":340,"fragments":95},{"title":"The Ten Shadows Trial","type":"elite","target":3,"description":"Defeat the regional commander","xp":360,"fragments":100},{"title":"The Last Talon","type":"ritual","target":3,"description":"Purify a cursed seal (E)","xp":380,"fragments":105},{"title":"Eyes in the Darkness","type":"level","target":8,"description":"Reach level 8","xp":400,"fragments":110},{"title":"Spirit Wolf's Prey","type":"kills","target":35,"description":"Defeat 35 curses in total","xp":420,"fragments":115},{"title":"Summoning Nue","type":"skill","target":"advanced","description":"Unlock advanced in the skill tree","xp":440,"fragments":120},{"title":"Hunt the Invaders","type":"kills","target":44,"description":"Defeat 44 curses in total","xp":460,"fragments":125},{"title":"The Shadow Heals","type":"skill","target":"rct","description":"Unlock rct in the skill tree","xp":480,"fragments":130},{"title":"The Guardian's Memory","type":"level","target":10,"description":"Reach level 10","xp":500,"fragments":135},{"title":"Another Pack Appears","type":"kills","target":52,"description":"Defeat 52 curses in total","xp":520,"fragments":140},{"title":"Chimera Shadow Garden","type":"skill","target":"domain","description":"Unlock domain in the skill tree","xp":540,"fragments":145},{"title":"Hunter of Darkness","type":"kills","target":65,"description":"Defeat 65 curses in total","xp":560,"fragments":150},{"title":"Keeper of the Shikigami","type":"level","target":12,"description":"Reach level 12","xp":580,"fragments":155}],"gojo":[{"title":"The Limitless Challenge","type":"elite","target":0,"description":"Defeat the regional commander","xp":120,"fragments":40},{"title":"Barrier in the Tower","type":"ritual","target":0,"description":"Purify a cursed seal (E)","xp":140,"fragments":45},{"title":"A City Full of Curses","type":"kills","target":14,"description":"Defeat 14 curses in total","xp":160,"fragments":50},{"title":"Into the Barrier District","type":"travel","target":1450,"description":"Explore 1450 meters beyond your origin","xp":180,"fragments":55},{"title":"The Unseen Assassin","type":"elite","target":1,"description":"Defeat the regional commander","xp":200,"fragments":60},{"title":"An Unraveled Seal","type":"ritual","target":1,"description":"Purify a cursed seal (E)","xp":220,"fragments":65},{"title":"The Cursed Skyline","type":"kills","target":20,"description":"Defeat 20 curses in total","xp":240,"fragments":70},{"title":"Six Eyes Training","type":"level","target":6,"description":"Reach level 6","xp":260,"fragments":75},{"title":"The Barrier Architect","type":"elite","target":2,"description":"Defeat the regional commander","xp":280,"fragments":80},{"title":"A Fault in the Curtain","type":"ritual","target":2,"description":"Purify a cursed seal (E)","xp":300,"fragments":85},{"title":"Clear the Observation Deck","type":"kills","target":27,"description":"Defeat 27 curses in total","xp":320,"fragments":90},{"title":"Beyond the Tower","type":"travel","target":2100,"description":"Explore 2100 meters beyond your origin","xp":340,"fragments":95},{"title":"The Anti-Limitless Squad","type":"elite","target":3,"description":"Defeat the regional commander","xp":360,"fragments":100},{"title":"Sealbreaker","type":"ritual","target":3,"description":"Purify a cursed seal (E)","xp":380,"fragments":105},{"title":"The Broken Infinity","type":"level","target":8,"description":"Reach level 8","xp":400,"fragments":110},{"title":"The Second Invasion","type":"kills","target":35,"description":"Defeat 35 curses in total","xp":420,"fragments":115},{"title":"Reversal Red","type":"skill","target":"advanced","description":"Unlock advanced in the skill tree","xp":440,"fragments":120},{"title":"Purging the Residuals","type":"kills","target":44,"description":"Defeat 44 curses in total","xp":460,"fragments":125},{"title":"Reverse Technique","type":"skill","target":"rct","description":"Unlock rct in the skill tree","xp":480,"fragments":130},{"title":"The Strongest's Burden","type":"level","target":10,"description":"Reach level 10","xp":500,"fragments":135},{"title":"The Infinity Test","type":"kills","target":52,"description":"Defeat 52 curses in total","xp":520,"fragments":140},{"title":"Unlimited Void","type":"skill","target":"domain","description":"Unlock domain in the skill tree","xp":540,"fragments":145},{"title":"A Threat to the Clan","type":"kills","target":65,"description":"Defeat 65 curses in total","xp":560,"fragments":150},{"title":"Beyond the Limit","type":"level","target":12,"description":"Reach level 12","xp":580,"fragments":155}],"sukuna":[{"title":"The Clan's Executioner","type":"elite","target":0,"description":"Defeat the regional commander","xp":120,"fragments":40},{"title":"Blood-Stained Offering","type":"ritual","target":0,"description":"Purify a cursed seal (E)","xp":140,"fragments":45},{"title":"The Heian Purge","type":"kills","target":14,"description":"Defeat 14 curses in total","xp":160,"fragments":50},{"title":"The Mountains of Exile","type":"travel","target":1450,"description":"Explore 1450 meters beyond your origin","xp":180,"fragments":55},{"title":"The Imperial Butcher","type":"elite","target":1,"description":"Defeat the regional commander","xp":200,"fragments":60},{"title":"Burn the Ancient Seal","type":"ritual","target":1,"description":"Purify a cursed seal (E)","xp":220,"fragments":65},{"title":"The Clan's Survivors","type":"kills","target":20,"description":"Defeat 20 curses in total","xp":240,"fragments":70},{"title":"Strength of the Rejected","type":"level","target":6,"description":"Reach level 6","xp":260,"fragments":75},{"title":"The Court Sorcerer","type":"elite","target":2,"description":"Defeat the regional commander","xp":280,"fragments":80},{"title":"Sigil of the Fallen","type":"ritual","target":2,"description":"Purify a cursed seal (E)","xp":300,"fragments":85},{"title":"Slaughter on the Road","type":"kills","target":27,"description":"Defeat 27 curses in total","xp":320,"fragments":90},{"title":"The Imperial Approach","type":"travel","target":2100,"description":"Explore 2100 meters beyond your origin","xp":340,"fragments":95},{"title":"The Champion of the Emperor","type":"elite","target":3,"description":"Defeat the regional commander","xp":360,"fragments":100},{"title":"The Last Offering","type":"ritual","target":3,"description":"Purify a cursed seal (E)","xp":380,"fragments":105},{"title":"No One to Teach Him","type":"level","target":8,"description":"Reach level 8","xp":400,"fragments":110},{"title":"The Last Hunters","type":"kills","target":35,"description":"Defeat 35 curses in total","xp":420,"fragments":115},{"title":"Divine Flame","type":"skill","target":"advanced","description":"Unlock advanced in the skill tree","xp":440,"fragments":120},{"title":"Curses Without Masters","type":"kills","target":44,"description":"Defeat 44 curses in total","xp":460,"fragments":125},{"title":"Reverse Your Fate","type":"skill","target":"rct","description":"Unlock rct in the skill tree","xp":480,"fragments":130},{"title":"King of No One","type":"level","target":10,"description":"Reach level 10","xp":500,"fragments":135},{"title":"The Court's Revenge","type":"kills","target":52,"description":"Defeat 52 curses in total","xp":520,"fragments":140},{"title":"Malevolent Shrine","type":"skill","target":"domain","description":"Unlock domain in the skill tree","xp":540,"fragments":145},{"title":"The Age of Fear","type":"kills","target":65,"description":"Defeat 65 curses in total","xp":560,"fragments":150},{"title":"The King of Curses","type":"level","target":12,"description":"Reach level 12","xp":580,"fragments":155}],"custom":[{"title":"The Academy Trial","type":"elite","target":0,"description":"Defeat the regional commander","xp":120,"fragments":40},{"title":"The First Seal","type":"ritual","target":0,"description":"Purify a cursed seal (E)","xp":140,"fragments":45},{"title":"Graduation Patrol","type":"kills","target":14,"description":"Defeat 14 curses in total","xp":160,"fragments":50},{"title":"The Shadow District","type":"travel","target":1450,"description":"Explore 1450 meters beyond your origin","xp":180,"fragments":55},{"title":"The Rival Student","type":"elite","target":1,"description":"Defeat the regional commander","xp":200,"fragments":60},{"title":"The Second Assignment","type":"ritual","target":1,"description":"Purify a cursed seal (E)","xp":220,"fragments":65},{"title":"Battle Under the Veil","type":"kills","target":20,"description":"Defeat 20 curses in total","xp":240,"fragments":70},{"title":"Find Your Rhythm","type":"level","target":6,"description":"Reach level 6","xp":260,"fragments":75},{"title":"The Cursed Examiner","type":"elite","target":2,"description":"Defeat the regional commander","xp":280,"fragments":80},{"title":"A Broken Lesson","type":"ritual","target":2,"description":"Purify a cursed seal (E)","xp":300,"fragments":85},{"title":"The Night Sweep","type":"kills","target":27,"description":"Defeat 27 curses in total","xp":320,"fragments":90},{"title":"The Restricted Quarter","type":"travel","target":2100,"description":"Explore 2100 meters beyond your origin","xp":340,"fragments":95},{"title":"The Senior Sorcerer","type":"elite","target":3,"description":"Defeat the regional commander","xp":360,"fragments":100},{"title":"Proof of Resolve","type":"ritual","target":3,"description":"Purify a cursed seal (E)","xp":380,"fragments":105},{"title":"Advanced Control","type":"level","target":8,"description":"Reach level 8","xp":400,"fragments":110},{"title":"The Final Patrol","type":"kills","target":35,"description":"Defeat 35 curses in total","xp":420,"fragments":115},{"title":"Find Your Technique","type":"skill","target":"advanced","description":"Unlock advanced in the skill tree","xp":440,"fragments":120},{"title":"An Unfinished Mission","type":"kills","target":44,"description":"Defeat 44 curses in total","xp":460,"fragments":125},{"title":"Learn to Heal","type":"skill","target":"rct","description":"Unlock rct in the skill tree","xp":480,"fragments":130},{"title":"Special Grade Test","type":"level","target":10,"description":"Reach level 10","xp":500,"fragments":135},{"title":"A City of Curses","type":"kills","target":52,"description":"Defeat 52 curses in total","xp":520,"fragments":140},{"title":"Your Own Domain","type":"skill","target":"domain","description":"Unlock domain in the skill tree","xp":540,"fragments":145},{"title":"The Last Challenge","type":"kills","target":65,"description":"Defeat 65 curses in total","xp":560,"fragments":150},{"title":"A Sorcerer of Your Own","type":"level","target":12,"description":"Reach level 12","xp":580,"fragments":155}]};
const CAMPAIGN_TOTAL=60;
const ELITE_TITLES={yuji:['Crossing Butcher','Tunnel Stalker','Cursed Conductor','Shibuya Executioner'],megumi:['Shadowbound Revenant','Ritual Wraith','Night Summoner','Chimera Hunter'],gojo:['Barrier Enforcer','Sealing Adept','Void Assassin','Prison Architect'],sukuna:['Heian Clan Hunter','Imperial Executioner','Royal Onmyoji','Court Champion'],custom:['Academy Rival','Technique Examiner','Field Veteran','Special Grade Examiner']};
function originQuestPos(i){return Math.max(650,Math.min(7100,(ORIGINS[currentOrigin]||ORIGINS.yuji).start+570+i*580))}
function spawnRegionalElites(){
 p.eliteDefeated??=[];
 for(let i=0;i<4;i++){
  if(p.eliteDefeated.includes(i))continue;
  const x=originQuestPos(i),type=i%2?'spitter':'brute',h=type==='brute'?76:58,max=280+i*145;
  enemies.push({id:300+i,elite:i,eliteName:ELITE_TITLES[currentOrigin][i],x,y:groundY(x)-h,w:type==='brute'?58:43,h,vx:0,vy:0,hp:max,max,type,cd:.75,wind:0,hurt:0,stun:0,dead:false,home:x,phase:1});
 }
}
function replenishEncounter(){
 if(trial.active||paused||!started||(p.encounterTimer||0)>0)return;
 p.encounterTimer=11;
 if(enemies.filter(e=>!e.dead&&e.type!=='dummy'&&e.type!=='boss'&&e.elite===undefined).length>=14)return;
 const x=Math.max(650,Math.min(6900,p.x+(p.face||1)*(450+Math.random()*320)));
 const type=(p.encounterCount||0)%5===0?'brute':(p.encounterCount||0)%3===0?'spitter':'crawler',h=type==='brute'?76:48,hp=(type==='brute'?155:88)+Math.min(230,p.level*9);
 enemies.push({id:500+(p.encounterCount||0),x,y:groundY(x)-h,w:type==='brute'?52:38,h,vx:0,vy:0,hp,max:hp,type,cd:.7,wind:0,hurt:0,stun:0,dead:false,home:x});
 p.encounterCount=(p.encounterCount||0)+1;
}
function drawQuestLandmarks(){
 const accent=ORIGINS[currentOrigin].accent;
 for(let i=0;i<4;i++){
  const x=originQuestPos(i),y=groundY(x),done=(p.rituals||[]).includes(i);
  if(x<cam-150||x>cam+visibleWidth()+150)continue;
  rect(x-28,y-7,56,7,'#39364d');rect(x-21,y-82,42,75,'#342638');
  poly([[x-30,y-82],[x,y-112],[x+30,y-82]],done?'#507d7c':'#815a87');
  rect(x-4,y-70,8,57,done?'#67bfb7':accent);
  for(let j=0;j<4;j++){const a=time*.9+j*Math.PI/2;circle(x+Math.cos(a)*24,y-49+Math.sin(a)*21,3,done?'#67bfb7':accent)}
  if(!done){glow(x,y-54,47,accent+'28');ctx.save();ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillStyle='#fff2eb';ctx.fillText('E · PURIFY SEAL',x,y-123);ctx.restore()}
 }
}

function spawn(){enemies=[];for(let i=0;i<24;i++){let x=760+i*265;const type=i%5===3?'spitter':i%4===2?'brute':'crawler';const hp=type==='brute'?140:type==='spitter'?65:80;enemies.push({id:i,x,y:groundY(x)-(type==='brute'?76:48),w:type==='brute'?52:38,h:type==='brute'?76:48,vx:0,vy:0,hp,max:hp,type,cd:1+Math.random(),wind:0,hurt:0,stun:0,dead:false,home:x})}const dummyX=ORIGINS[currentOrigin].start+360;enemies.push({id:100,x:dummyX,y:groundY(dummyX)-80,w:36,h:80,vx:0,vy:0,hp:9999,max:9999,type:'dummy',cd:0,wind:0,hurt:0,stun:0,dead:false,home:600});spawnRegionalElites();spawnLifeBoss();if(!bossDead&&!LIFE_MISSIONS[p.char])enemies.push({id:99,x:7010,y:502,w:100,h:110,vx:0,vy:0,hp:1350,max:1350,type:'boss',cd:1.5,wind:0,hurt:0,stun:0,dead:false,home:7010,phase:1})}
function start(char,cont=false){if(cont){if(!validSave(saveData)){say('No saved journey yet. Choose a sorcerer.');return}p={...INITIAL(),...saveData.p};if(p.char==='custom'){customDraft.name=p.customName;customDraft.style=p.customStyle;customDraft.color=p.customColor;customDraft.hair=p.customHair||'#e5bcd7';customDraft.outfit=p.customOutfit||'#30456d';customDraft.skin=p.customSkin||'#e9ad8d';customDraft.eyes=p.customEyes||'#71e5f4';customDraft.hairStyle=p.customHairStyle||0;customDraft.build=p.customBuild||0;customDraft.accessory=p.customAccessory||0;customDraft.mark=p.customMark||0;customDraft.eyesShape=p.customEyesShape||0;customDraft.trim=p.customTrim||'#f2ba76';syncCustom()}quest=saveData.quest||0;kills=saveData.kills||0;opened=saveData.opened||[];bossDead=!!saveData.bossDead;settings=saveData.settings||settings;sound=saveData.sound!==false;p.hp=Math.max(1,p.hp);p.inv=2}else{p=INITIAL();p.char=char;if(char==='sukuna'){p.x=1570;p.y=500;p.checkpoint=1570;p.hp=95;p.ce=0}if(char==='custom'){syncCustom();p.customName=customDraft.name;p.customStyle=customDraft.style;p.customColor=customDraft.color;p.customHair=customDraft.hair;p.customOutfit=customDraft.outfit;p.customSkin=customDraft.skin;p.customEyes=customDraft.eyes;p.customHairStyle=customDraft.hairStyle;p.customBuild=customDraft.build;p.customAccessory=customDraft.accessory;p.customMark=customDraft.mark;p.customEyesShape=customDraft.eyesShape;p.customTrim=customDraft.trim}quest=char==='sukuna'?2:0;kills=0;opened=[];bossDead=false;tutorial=0}setupOrigin(p.char);if(!cont){p.campaignStep=0;p.lifeStage=0}applyLifeStage(!cont);trial.active=false;applyOutfits();spawn();if(p.char==='sukuna'){for(const enemy of enemies){if(enemy.type==='dummy')continue;enemy.hp=Math.ceil(enemy.hp*1.65);enemy.max=enemy.hp;enemy.cd=Math.max(.3,enemy.cd*.7)}}pendingStrikes=[];effects=[];shots=[];particles=[];texts=[];domainTime=0;hitStop=0;shake=0;cameraLook=0;walking=0;autoSave=0;Object.keys(keys).forEach(k=>keys[k]=false);mouseAttacking=false;started=true;paused=false;isolateGameMenu(false);$('#overlay').hidden=true;$('#combatDock').hidden=false;$('#hud').hidden=false;$('#right').hidden=false;$('#hotbar').hidden=false;zoneIndex=zoneAt(p.x);cam=Math.max(0,p.x-visibleWidth()*.5);zoneTime=4;terrainCameraY=groundY(p.x);readDockLayout();c.focus();tone(500,.2);say(cont?'Welcome back. Your journey continues.':'Talk to the instructor by the gate. Press E.');updateHUD();if(!cont){p.storySeen??=[];if(!p.storySeen.includes(0))p.storySeen.push(0);save()}}
let selectedCharacter='yuji';
const customDraft={name:'Custom Sorcerer',style:'yuji',color:'#da9dff',hair:'#e5bcd7',outfit:'#30456d',skin:'#e9ad8d',eyes:'#71e5f4',hairStyle:0,build:0,accessory:0,mark:0,eyesShape:0,trim:'#f2ba76'};
function syncCustom(){
 const style=CAST[customDraft.style]||CAST.yuji;
 CAST.custom.name=customDraft.name.slice(0,22)||'Custom Sorcerer';CAST.custom.color=customDraft.color;
 CAST.custom.skill=style.skill;CAST.custom.ult=style.ult;CAST.custom.domain='Personal Domain: '+({yuji:'Falling Star',megumi:'Night Garden',gojo:'Event Horizon',sukuna:'Crimson Shrine'}[customDraft.style]||'Falling Star');
}

const PERSONAL_EVENTS={"yuji":[["Rescue Signal","A student is trapped under a collapsed entrance.","Break through the rubble","Draw the curses away"],["The Last Train","Survivors are hiding beneath Shibuya Station.","Escort the survivors","Defend the escape route"]],"megumi":[["Shikigami Trace","A familiar shadow moves between the bamboo.","Follow the shadow","Investigate its residual energy"],["Incomplete Ritual","Cursed symbols cover the station walls.","Destroy the ritual seal","Summon a shikigami to scout"]],"gojo":[["Broken Curtain","A barrier seal has been hidden in the grove.","Destroy the seal","Decode the barrier"],["Hidden Observer","A curse user watches from Shibuya.","Cut the connection","Turn their technique against them"]],"sukuna":[["A Cursed Offering","A relic buried in the grove radiates power.","Claim the relic","Absorb the nearby cursed energy"],["An Insolent Rival","An arrogant curse challenges the King of Curses.","Accept the duel","Overwhelm it without fighting"]],"custom":[["First Real Choice","A first-year student is surrounded by curses.","Rescue the student","Draw the curses away"],["Technique Trial","An ancient residual challenges your innate technique.","Overpower it","Study its weakness"]]};
function tryPersonalEvent(index){
 if(!started||paused||trial.active||quest<2||p.storyMilestones?.includes(index))return;
 const event=PERSONAL_EVENTS[p.char]?.[index];if(!event)return;
 // Record before opening so the encounter cannot retrigger during the same frame.
 p.storyMilestones??=[];p.storyMilestones.push(index);save();
 paused=true;isolateGameMenu(true);$('#overlay').hidden=false;
 const [heading,description,choiceA,choiceB]=event;
 $('#panel').innerHTML='<div class="story-scene"><div class="eyebrow">PERSONAL ASSIGNMENT · '+CAST[p.char].title+'</div><h1>'+heading+'</h1><div class="story-orb">✧</div><p>'+description+'</p><p class="muted">Choose your approach. Your decision changes the reward and is recorded in your journal.</p><div class="story-choices"><button data-story-choice="0">'+choiceA+'</button><button data-story-choice="1">'+choiceB+'</button></div></div>';
 $('#panel').querySelectorAll('[data-story-choice]').forEach(button=>button.onclick=()=>{
  const strategy=button.dataset.storyChoice==='1',xp=strategy?110:145,fragments=strategy?50:30;
  p.storyChoices??={};p.storyChoices[index]=strategy?'strategy':'force';
  p.coins+=fragments;reward(xp);
  if(strategy)p.ce=100;else p.hp=Math.min(maxHP(),p.hp+35);
  burst(p.x+17,p.y+28,CAST[p.char].color,28);save();resume();
  say('Assignment complete · +'+xp+' XP · +'+fragments+' fragments · '+(strategy?'energy restored':'health restored'));
 });
}

function storyScene(chapter){
 if(!started||!CHAPTERS[p.char]?.[chapter]||p.storySeen?.includes(chapter))return;
 p.storySeen??=[];p.storySeen.push(chapter);save();paused=true;isolateGameMenu(true);$('#overlay').hidden=false;
 const [heading,line]=CHAPTERS[p.char][chapter];
 $('#panel').innerHTML='<div class="story-scene"><div class="eyebrow">CHAPTER '+(chapter+1)+' · '+CAST[p.char].title+'</div><h1>'+heading+'</h1><div class="story-orb">✧</div><p>'+line+'</p><button id="storyNext">CONTINUE →</button></div>';
 $('#storyNext').onclick=()=>resume();
}
function rctHeal(){if(paused||!learnedSkill('rct')||p.rctCd>0||p.ce<45||p.hp>=maxHP())return;p.ce-=45;p.rctCd=15;p.hp=Math.min(maxHP(),p.hp+maxHP()*.4);burst(p.x+17,p.y+35,'#a6ffcf',30);float('REVERSE CURSED TECHNIQUE',p.x,p.y-35,'#a6ffcf');tone(790,.25);save();updateHUD()}



function refreshCreatorPreview(){
 const cv=$('#creatorLive');if(!cv)return;
 const g=cv.getContext('2d'),d=customDraft,W=cv.width,H=cv.height;
 g.clearRect(0,0,W,H);g.imageSmoothingEnabled=true;
 const shade=(hex,n)=>{let h=hex.replace('#','');if(!/^[0-9a-f]{6}$/i.test(h))h='777777';let v=parseInt(h,16);return '#'+[v>>16&255,v>>8&255,v&255].map(x=>Math.max(0,Math.min(255,x+n)).toString(16).padStart(2,'0')).join('')};
 const path=(pts,fill,stroke='#111322',width=3)=>{g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.lineJoin='round';g.stroke()}};
 const ellipse=(x,y,rx,ry,col,stroke=null,lw=2)=>{g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fillStyle=col;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;g.stroke()}};
 const line=(x,y,x2,y2,col,w=3)=>{g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke()};
 const gradient=(a,b,x=0,y=0,x2=W,y2=H)=>{const z=g.createLinearGradient(x,y,x2,y2);z.addColorStop(0,a);z.addColorStop(1,b);return z};
 // Studio backdrop with circular aura, vignette and floor reflection.
 let backdrop=g.createRadialGradient(144,138,10,144,170,235);backdrop.addColorStop(0,shade(d.color,-45));backdrop.addColorStop(.5,'#20233d');backdrop.addColorStop(1,'#090d1b');g.fillStyle=backdrop;g.fillRect(0,0,W,H);
 for(let i=0;i<8;i++){g.globalAlpha=.12+i*.016;g.strokeStyle=d.color;g.lineWidth=1;g.beginPath();g.arc(144,150,59+i*17,0,Math.PI*2);g.stroke()}g.globalAlpha=1;
 ellipse(144,301,88,13,'#080b17');ellipse(144,298,69,6,shade(d.color,-55));
 const skin=d.skin,shadow=shade(skin,-27),skinLight=shade(skin,24),uniform=d.outfit,trim=d.trim;
 const thick=d.build===2?16:0,tall=d.build===1?13:0;
 g.save();g.translate(0,d.build===1?-5:0);
 // Feet and pants, drawn with clean colored panels.
 path([[109-thick/3,225],[144,231],[139,290],[128,303],[105,296],[99-thick/3,260]],gradient(shade(uniform,-32),shade(uniform,5)),'#080d1c',4);
 path([[144,232],[178+thick/3,225],[186+thick/3,293],[166,303],[150,286]],gradient(uniform,shade(uniform,-30)),'#080d1c',4);
 path([[101,292],[133,295],[134,311],[95,312]],'#181b2c','#090b15',3);
 path([[163,294],[188,293],[198,311],[161,311]],'#181b2c','#090b15',3);
 line(103,310,135,310,trim,2);line(163,310,196,310,trim,2);
 // Coattails and arms.
 path([[97-thick/2,156],[79-thick,184],[69-thick,259],[86,277],[108,214]],gradient(shade(uniform,9),shade(uniform,-35)),'#101322',4);
 path([[187+thick/2,158],[207+thick,188],[218+thick,262],[197,276],[181,219]],gradient(shade(uniform,5),shade(uniform,-35)),'#101322',4);
 path([[90-thick/2,157],[107,145],[179,145],[197+thick/2,159],[190+thick/3,240],[151,259],[99-thick/3,240]],gradient(shade(uniform,22),shade(uniform,-29),103,130,193,264),'#0c1020',5);
 path([[141,154],[153,154],[167,251],[149,257]],shade(uniform,-24),null);line(145,154,148,251,trim,3);
 path([[99,163],[111,160],[108,233],[97,239]],shade(uniform,-16),null);path([[184,163],[195,160],[191,233],[181,239]],shade(uniform,-16),null);
 // Shoulder seam, ornament and gloves.
 line(109,161,131,177,trim,3);line(175,161,162,176,trim,3);ellipse(170,192,5,5,d.color,'#dbe5f7',1.5);
 path([[68-thick,251],[88,253],[90,277],[77,286],[65-thick,271]],gradient(skin,shadow),'#101322',3);
 path([[199,250],[217+thick,253],[224+thick,269],[210,284],[195,277]],gradient(skin,shadow),'#101322',3);
 // Neck and ears.
 path([[128,135],[159,135],[162,155],[144,173],[124,156]],gradient(skinLight,shadow),'#101322',4);
 ellipse(98,110,12,18,shadow,'#121628',3);ellipse(189,110,12,18,skin,'#121628',3);
 // Facial silhouette, jaw and cheek highlights.
 path([[105,59],[125,43],[164,46],[186,64],[189,112],[180,146],[158,167],[132,167],[108,144],[98,105]],gradient(skinLight,shadow,106,53,180,153),'#111322',4);
 path([[109,105],[125,91],[127,138],[138,155],[120,148]],shade(skin,9),null);
 ellipse(115,122,13,8,shade(skin,13));ellipse(171,122,13,8,shade(skin,8));
 // Eyes, brows, nose and mouth.
 line(115,95,132,92,shade(d.hair,-65),4);line(156,92,174,95,shade(d.hair,-65),4);
 const eyeStyle=Number(d.eyesShape)||0;
 const eyeRy=eyeStyle===1?3.7:eyeStyle===2?7:5.7;
 ellipse(124,109,10,eyeRy,'#f6f3f6','#1d1a2c',2);
 ellipse(163,109,10,eyeRy,'#f6f3f6','#1d1a2c',2);
 ellipse(126,109,4,Math.max(3,eyeRy-1),d.eyes,'#191928',1.2);
 ellipse(161,109,4,Math.max(3,eyeRy-1),d.eyes,'#191928',1.2);
 ellipse(127,107,1.6,2.1,'#fff');ellipse(162,107,1.6,2.1,'#fff');
 if(eyeStyle===2){g.shadowBlur=15;g.shadowColor=d.eyes;ellipse(126,109,7,6,d.eyes);ellipse(161,109,7,6,d.eyes);g.shadowBlur=0}
 line(144,110,141,128,shadow,2);line(140,129,145,131,skinLight,1.5);line(134,144,151,144,shade(skin,-60),2);
 // Layered hairstyle silhouettes. Four genuinely distinct shapes.
 const hstyle=Number(d.hairStyle)||0,hair=d.hair,deep=shade(hair,-37),shine=shade(hair,30);
 if(hstyle===0){
  path([[95,100],[91,71],[75,55],[103,57],[91,30],[119,39],[133,14],[146,35],[170,16],[172,42],[202,28],[187,57],[205,65],[184,79],[178,60],[155,72],[136,59],[118,80],[99,78]],gradient(shine,hair,100,15,181,91),'#101322',4);
  path([[101,66],[124,36],[132,65],[151,42],[160,64],[185,50],[175,79],[150,74],[128,86]],deep,null);
 }else if(hstyle===1){
  path([[96,105],[91,63],[108,37],[139,31],[168,34],[189,59],[187,103],[173,73],[152,64],[130,77],[112,72]],gradient(shine,hair),'#101322',4);
  path([[104,54],[125,42],[116,75],[140,47],[143,71],[169,48],[177,72]],deep,null);
 }else if(hstyle===2){
  path([[94,166],[88,86],[91,54],[120,32],[166,32],[191,56],[198,174],[179,183],[171,84],[157,67],[142,95],[119,80],[112,179]],gradient(shine,deep),'#101322',4);
  path([[104,55],[139,40],[128,94],[155,51],[151,97],[182,63],[174,107]],hair,null);
 }else{
  path([[98,100],[91,66],[103,43],[120,27],[158,23],[184,40],[193,82],[187,126],[179,118],[177,63],[143,54],[117,71]],gradient(shine,deep),'#101322',4);
  path([[112,48],[138,30],[178,42],[167,51],[137,47]],hair,null);
  line(181,78,184,117,shine,3);
 }
 // Marks and accessories must sit over the face and hair.
 const mark=Number(d.mark)||0,accessory=Number(d.accessory)||0;
 if(mark===1){line(112,124,123,128,shade(d.color,-25),3);line(164,128,176,124,shade(d.color,-25),3)}
 if(mark===2){line(169,93,154,143,shade(d.color,-25),4);line(169,93,154,143,'#ffd6d4',1)}
 if(mark===3){line(138,75,151,75,d.color,4);line(144,69,144,82,d.color,3);ellipse(144,76,3,3,trim)}
 if(accessory===1){path([[95,84],[113,68],[177,69],[188,84],[181,92],[108,88]],shade(uniform,-30),'#151323',3);line(111,80,177,80,trim,3)}
 if(accessory===2){path([[105,163],[125,143],[142,164],[161,143],[183,159],[177,193],[111,193]],shade(uniform,-24),'#101322',3);line(125,153,143,171,trim,2)}
 if(accessory===3){path([[110,131],[123,123],[166,123],[180,131],[169,153],[119,154]],shade(uniform,-36),'#111322',3);line(122,139,166,139,trim,2)}
 g.restore();
 // Dedicated composition labels.
 g.font='bold 10px monospace';g.fillStyle='#e2c9f2';g.textAlign='left';g.fillText('SORCERER DOSSIER',14,22);
 g.fillStyle=d.color;g.fillRect(14,29,50,3);
 g.font='9px monospace';g.fillStyle='#a7a5c0';g.fillText('CHARACTER MODEL • LIVE',14,H-11);
}
function selectCharacter(char){
 if(!CAST[char])return;
 selectedCharacter=char;
 const order=Object.keys(CAST),i=order.indexOf(char),cast=CAST[char];
 const descriptions={
 yuji:['MODERN JAPAN · VESSEL','Protect people caught in the veil and learn to harness your cursed energy.'],
 megumi:['MODERN JAPAN · TEN SHADOWS','Track the disappearance of a shikigami. Learn each summon through dangerous missions.'],
 gojo:['MODERN JAPAN · LIMITLESS','Discover a conspiracy aimed at sealing the strongest; learn to use your gifts under pressure.'],
 sukuna:['HEIAN ERA · THE REJECTED','Born feared and abandoned in a brutal era. No instructor will teach you. Survive exile and learn cursed energy by yourself. EXTREME DIFFICULTY.'],
 custom:['MODERN DAY · FIRST YEAR','Create your own look, choose a technique foundation, and prove yourself as a new sorcerer.']
 };
 const [era,story]=descriptions[char];
 $('#selectionEra').textContent=era;$('#selectionName').textContent=cast.name;$('#selectionRole').textContent=cast.title;$('#selectionStory').textContent=story;
 $('#selectionPassive').textContent=cast.passive;
 $('#selectionKit').textContent='Earn in skill tree: '+cast.skill+' → '+cast.ult+' → '+cast.domain;
 $('#characterCount').textContent=(i+1)+' / '+order.length;
 $('#leftName').textContent=CAST[order[(i-1+order.length)%order.length]].name;
 $('#rightName').textContent=CAST[order[(i+1)%order.length]].name;
 $('#beginJourney').textContent=char==='sukuna'?'SURVIVE THE HEIAN ERA →':'BEGIN ORIGIN →';
 $('#selectionStage').style.setProperty('--accent',cast.color);
 const preview=$('#featuredPortrait');preview.dataset.preview=char;
 const editor=$('#customEditor');editor.hidden=char!=='custom';
 if(char==='custom'){
  editor.innerHTML='<div class="creator-heading"><strong>CREATE YOUR SORCERER</strong><span>BUILD A LOOK THAT IS YOURS</span></div><div class="creator-layout"><div class="creator-portrait"><canvas id="creatorLive" width="288" height="324"></canvas><span>LIVE CHARACTER PREVIEW</span><button id="randomLook" type="button">🎲 RANDOMIZE APPEARANCE</button></div><div class="creator-options"><div class="creator-grid"><label>SORCERER NAME<input id="sorcName" maxlength="22" placeholder="Your name"></label><label>CURSED TECHNIQUE<select id="sorcStyle"><option value="yuji">Impact · Divergent Fist</option><option value="megumi">Shadows · Divine Dogs</option><option value="gojo">Space · Limitless</option><option value="sukuna">Slashes · Dismantle</option></select></label><label>HAIRSTYLE<select id="sorcHairStyle"><option value="0">Spiky</option><option value="1">Short & Messy</option><option value="2">Long Fringe</option><option value="3">Swept Back</option></select></label><label>BODY TYPE<select id="sorcBuild"><option value="0">Standard</option><option value="1">Tall</option><option value="2">Heavy</option></select></label><label>SKIN TONE<input id="sorcSkin" type="color"></label><label>EYE COLOR<input id="sorcEyes" type="color"></label><label>HAIR COLOR<input id="sorcHair" type="color"></label><label>UNIFORM<input id="sorcOutfit" type="color"></label><label>CURSED AURA<input id="sorcColor" type="color"></label><label>UNIFORM TRIM<input id="sorcTrim" type="color"></label><label>FACE MARKS<select id="sorcMark"><option value="0">None</option><option value="1">Under-eye marks</option><option value="2">Scar across cheek</option><option value="3">Cursed sigil</option></select></label><label>EYE STYLE<select id="sorcEyesShape"><option value="0">Normal</option><option value="1">Sharp</option><option value="2">Glowing</option></select></label><label>ACCESSORY<select id="sorcAccessory"><option value="0">None</option><option value="1">Headband</option><option value="2">High collar</option><option value="3">Face mask</option></select></label></div></div></div>';
  for(const [id,key] of [['sorcName','name'],['sorcStyle','style'],['sorcColor','color'],['sorcHair','hair'],['sorcOutfit','outfit'],['sorcSkin','skin'],['sorcEyes','eyes'],['sorcHairStyle','hairStyle'],['sorcBuild','build'],['sorcMark','mark'],['sorcEyesShape','eyesShape'],['sorcAccessory','accessory'],['sorcTrim','trim']])$('#'+id).value=customDraft[key];
  $('#sorcName').oninput=e=>{customDraft.name=e.target.value.replace(/[<>]/g,'');syncCustom();$('#selectionName').textContent=CAST.custom.name};
  $('#sorcStyle').onchange=e=>{customDraft.style=e.target.value;syncCustom();$('#selectionKit').textContent='Earn in skill tree: '+CAST.custom.skill+' → '+CAST.custom.ult+' → '+CAST.custom.domain};
  $('#sorcColor').oninput=e=>{customDraft.color=e.target.value;syncCustom();$('#selectionStage').style.setProperty('--accent',e.target.value);refreshCreatorPreview()};
  $('#sorcHair').oninput=e=>{customDraft.hair=e.target.value;refreshCreatorPreview()};
  $('#sorcOutfit').oninput=e=>{customDraft.outfit=e.target.value;refreshCreatorPreview()};$('#sorcSkin').oninput=e=>{customDraft.skin=e.target.value;refreshCreatorPreview()};$('#sorcEyes').oninput=e=>{customDraft.eyes=e.target.value;refreshCreatorPreview()};$('#sorcHairStyle').onchange=e=>{customDraft.hairStyle=Number(e.target.value);refreshCreatorPreview()};$('#sorcBuild').onchange=e=>{customDraft.build=Number(e.target.value);refreshCreatorPreview()};for(const [id,key] of [['sorcMark','mark'],['sorcEyesShape','eyesShape'],['sorcAccessory','accessory']])$('#'+id).onchange=e=>{customDraft[key]=Number(e.target.value);refreshCreatorPreview()};$('#sorcTrim').oninput=e=>{customDraft.trim=e.target.value;refreshCreatorPreview()};$('#randomLook').onclick=()=>{const palette=['#293a54','#d0a286','#f6c3a1','#8155ab','#c57081','#d6e7f5','#152e3a','#a48d67'];for(const key of ['skin','eyes','hair','outfit','color'])customDraft[key]=palette[Math.floor(Math.random()*palette.length)];customDraft.hairStyle=Math.floor(Math.random()*4);customDraft.build=Math.floor(Math.random()*3);customDraft.mark=Math.floor(Math.random()*4);customDraft.accessory=Math.floor(Math.random()*4);customDraft.eyesShape=Math.floor(Math.random()*3);selectCharacter('custom')};refreshCreatorPreview();
 }
}
function title(){
 if(started)return;isolateGameMenu(true);
 $('#panel').innerHTML='<div class="select-shell"><div class="eyebrow">VEILBOUND · CHARACTER ORIGIN</div><h1 class="hero-title">CHOOSE <span>YOUR FATE</span></h1><p class="select-hint">A / D TO CHANGE CHARACTERS · ENTER TO BEGIN</p><div id="selectionStage" class="selection-stage"><button id="prevCharacter" class="carousel-arrow" aria-label="Previous character">❮</button><div class="neighbor left" id="leftName"></div><div class="featured-character"><div class="selection-era" id="selectionEra"></div><div class="featured-art"><canvas id="featuredPortrait" data-preview="yuji" width="192" height="216"></canvas></div><div id="selectionRole" class="eyebrow"></div><h2 id="selectionName"></h2><p id="selectionStory"></p><div class="selection-passive" id="selectionPassive"></div><small id="selectionKit"></small></div><div class="neighbor right" id="rightName"></div><button id="nextCharacter" class="carousel-arrow" aria-label="Next character">❯</button></div><div id="customEditor" class="custom-editor" hidden></div><div class="selection-actions"><button id="beginJourney">BEGIN ORIGIN →</button><button id="continue" '+(!saveData?'disabled':'')+'>CONTINUE SAVE</button><span id="characterCount"></span></div></div>';
 const order=Object.keys(CAST),shift=d=>selectCharacter(order[(order.indexOf(selectedCharacter)+d+order.length)%order.length]);
 $('#prevCharacter').onclick=()=>shift(-1);$('#nextCharacter').onclick=()=>shift(1);
 $('#beginJourney').onclick=()=>start(selectedCharacter);
 $('#continue').onclick=()=>start('yuji',true);
 selectCharacter(selectedCharacter);
}

const STORY_TASKS={"yuji":["Meet the instructor and accept the rescue assignment.","Exorcise five curses and return to the instructor.","Reach Shibuya to rescue the trapped civilians.","Defeat the shrine guardian and lift the veil."],"megumi":["Speak to the instructor about the missing shikigami.","Defeat five curses to recover shadow residuals.","Track the shikigami into Shibuya.","Defeat the shrine guardian and reclaim your shadow."],"gojo":["Question the instructor about the unusual curtain.","Eliminate five curses to expose its residual energy.","Investigate the trap in Shibuya.","Destroy the shrine's barrier anchor."],"sukuna":["Survive the Heian exile and defeat three hunters.","Hunt curses alone to discover cursed energy.","Push toward the Heian capital through hostile territory.","Defeat the guardian and become the King of Curses."],"custom":["Report for your first assignment at Jujutsu High.","Defeat five curses as a trainee sorcerer.","Travel to Shibuya for your solo mission.","Defeat the shrine guardian to pass your examination."]};
function storyObjective(){const tasks=STORY_TASKS[p.char]||STORY_TASKS.custom;return tasks[Math.max(0,Math.min(3,quest))]}

const CAMPAIGN_MISSIONS={"yuji":[{"title":"The First Punch","type":"training","target":5,"description":"Land 5 hits on your training target","xp":48,"fragments":18},{"title":"Curses at the Gate","type":"kills","target":2,"description":"Defeat 2 curses","xp":55,"fragments":20},{"title":"Into the Bamboo","type":"travel","target":350,"description":"Travel deeper into your origin area","xp":52,"fragments":18},{"title":"Protect the Road","type":"kills","target":4,"description":"Defeat 4 curses in total","xp":65,"fragments":25},{"title":"Find Your Resolve","type":"level","target":2,"description":"Reach level 2","xp":55,"fragments":20},{"title":"The Broken Footbridge","type":"travel","target":680,"description":"Reach the next landmark","xp":75,"fragments":30},{"title":"Sweep the Grove","type":"kills","target":6,"description":"Defeat 6 curses in total","xp":85,"fragments":35},{"title":"Supplies for Survivors","type":"cache","target":1,"description":"Find and open a hidden cache","xp":75,"fragments":40},{"title":"A Sorcerer's Growth","type":"level","target":3,"description":"Reach level 3","xp":90,"fragments":35},{"title":"Entering Enemy Territory","type":"travel","target":1150,"description":"Investigate the distant district","xp":110,"fragments":45},{"title":"Last Rescue Signal","type":"kills","target":9,"description":"Defeat 9 curses in total","xp":115,"fragments":55},{"title":"Break the Curtain","type":"boss","target":1,"description":"Defeat the final shrine guardian","xp":225,"fragments":100}],"megumi":[{"title":"Shadow Discipline","type":"training","target":5,"description":"Land 5 hits on your training target","xp":48,"fragments":18},{"title":"Tracks in the Dark","type":"kills","target":2,"description":"Defeat 2 curses","xp":55,"fragments":20},{"title":"The Vanished Familiar","type":"travel","target":350,"description":"Travel deeper into your origin area","xp":52,"fragments":18},{"title":"Scattered Residuals","type":"kills","target":4,"description":"Defeat 4 curses in total","xp":65,"fragments":25},{"title":"A Shadow's Shape","type":"level","target":2,"description":"Reach level 2","xp":55,"fragments":20},{"title":"The Moonlit Trail","type":"travel","target":680,"description":"Reach the next landmark","xp":75,"fragments":30},{"title":"Hunt the Intruders","type":"kills","target":6,"description":"Defeat 6 curses in total","xp":85,"fragments":35},{"title":"Recover the Evidence","type":"cache","target":1,"description":"Find and open a hidden cache","xp":75,"fragments":40},{"title":"The Fushiguro Oath","type":"level","target":3,"description":"Reach level 3","xp":90,"fragments":35},{"title":"The Hidden Ritual","type":"travel","target":1150,"description":"Investigate the distant district","xp":110,"fragments":45},{"title":"Seal the Darkness","type":"kills","target":9,"description":"Defeat 9 curses in total","xp":115,"fragments":55},{"title":"Chimera's Return","type":"boss","target":1,"description":"Defeat the final shrine guardian","xp":225,"fragments":100}],"gojo":[{"title":"Limitless Basics","type":"training","target":5,"description":"Land 5 hits on your training target","xp":48,"fragments":18},{"title":"Uninvited Guests","type":"kills","target":2,"description":"Defeat 2 curses","xp":55,"fragments":20},{"title":"The First Barrier","type":"travel","target":350,"description":"Travel deeper into your origin area","xp":52,"fragments":18},{"title":"A Flaw in Infinity","type":"kills","target":4,"description":"Defeat 4 curses in total","xp":65,"fragments":25},{"title":"Talent Is Not Enough","type":"level","target":2,"description":"Reach level 2","xp":55,"fragments":20},{"title":"Behind the Curtain","type":"travel","target":680,"description":"Reach the next landmark","xp":75,"fragments":30},{"title":"Erase the Residuals","type":"kills","target":6,"description":"Defeat 6 curses in total","xp":85,"fragments":35},{"title":"The Lost Records","type":"cache","target":1,"description":"Find and open a hidden cache","xp":75,"fragments":40},{"title":"The Strongest's Burden","type":"level","target":3,"description":"Reach level 3","xp":90,"fragments":35},{"title":"The Prison Seal Trail","type":"travel","target":1150,"description":"Investigate the distant district","xp":110,"fragments":45},{"title":"The Last Barrier","type":"kills","target":9,"description":"Defeat 9 curses in total","xp":115,"fragments":55},{"title":"Unseal the Horizon","type":"boss","target":1,"description":"Defeat the final shrine guardian","xp":225,"fragments":100}],"sukuna":[{"title":"Rejected by the Clans","type":"training","target":5,"description":"Land 5 hits on your training target","xp":48,"fragments":18},{"title":"Hunted at Dawn","type":"kills","target":2,"description":"Defeat 2 curses","xp":55,"fragments":20},{"title":"The Burning Road","type":"travel","target":350,"description":"Travel deeper into your origin area","xp":52,"fragments":18},{"title":"Blood in the Pines","type":"kills","target":4,"description":"Defeat 4 curses in total","xp":65,"fragments":25},{"title":"Power Without a Teacher","type":"level","target":2,"description":"Reach level 2","xp":55,"fragments":20},{"title":"The Heian Border","type":"travel","target":680,"description":"Reach the next landmark","xp":75,"fragments":30},{"title":"Silence the Hunters","type":"kills","target":6,"description":"Defeat 6 curses in total","xp":85,"fragments":35},{"title":"Offerings of the Fallen","type":"cache","target":1,"description":"Find and open a hidden cache","xp":75,"fragments":40},{"title":"He Who Needs No Master","type":"level","target":3,"description":"Reach level 3","xp":90,"fragments":35},{"title":"March on the Capital","type":"travel","target":1150,"description":"Investigate the distant district","xp":110,"fragments":45},{"title":"The King Is Feared","type":"kills","target":9,"description":"Defeat 9 curses in total","xp":115,"fragments":55},{"title":"Rise of the King","type":"boss","target":1,"description":"Defeat the final shrine guardian","xp":225,"fragments":100}],"custom":[{"title":"First Day Trial","type":"training","target":5,"description":"Land 5 hits on your training target","xp":48,"fragments":18},{"title":"The First Exorcism","type":"kills","target":2,"description":"Defeat 2 curses","xp":55,"fragments":20},{"title":"Beyond the Academy","type":"travel","target":350,"description":"Travel deeper into your origin area","xp":52,"fragments":18},{"title":"Sorcerer Evaluation","type":"kills","target":4,"description":"Defeat 4 curses in total","xp":65,"fragments":25},{"title":"Learn Your Name","type":"level","target":2,"description":"Reach level 2","xp":55,"fragments":20},{"title":"The Old Training Grounds","type":"travel","target":680,"description":"Reach the next landmark","xp":75,"fragments":30},{"title":"A Real Assignment","type":"kills","target":6,"description":"Defeat 6 curses in total","xp":85,"fragments":35},{"title":"Recover the Emergency Supplies","type":"cache","target":1,"description":"Find and open a hidden cache","xp":75,"fragments":40},{"title":"Stand on Your Own","type":"level","target":3,"description":"Reach level 3","xp":90,"fragments":35},{"title":"The Night Patrol","type":"travel","target":1150,"description":"Investigate the distant district","xp":110,"fragments":45},{"title":"An Unfinished Lesson","type":"kills","target":9,"description":"Defeat 9 curses in total","xp":115,"fragments":55},{"title":"Earn Your Grade","type":"boss","target":1,"description":"Defeat the final shrine guardian","xp":225,"fragments":100}]};

// A dedicated life-story campaign: 5 playable arcs per character, 12 objectives per arc.
const LIFE_ARCS={"gojo":[["CHILDHOOD · SIX EYES","Gojo Clan Estate","A gifted child grows up beneath the watch of the Gojo clan.","Clan Training Guardian"],["TEENAGER · HIDDEN INVENTORY","Tokyo Jujutsu High","Satoru trains with Geto, protects the Star Plasma Vessel, and faces Toji Fushiguro.","Toji Fushiguro"],["ADULT · SHIBUYA INCIDENT","Shibuya Station","Now a teacher, Gojo enters the crowds of Shibuya and the sealing trap awaiting him.","Shibuya Curse Coalition"],["UNSEALED · THE RETURN","Post-Seal Tokyo","Gojo returns after the Prison Realm and trains for the final confrontation.","Special Grade Vanguard"],["FINAL ARC · SHINJUKU SHOWDOWN","Shinjuku Battlefield","The final battle against Sukuna will end in Gojo's death.","Ryomen Sukuna"]],"yuji":[["CHILDHOOD · SENDAI","Sendai School","Yuji grows up with unusual strength before he learns curses exist.","Schoolyard Curse"],["VESSEL · JUJUTSU HIGH","Tokyo Jujutsu High","Yuji becomes Sukuna's vessel, meets fellow students, and trains his cursed energy.","Special Grade Curse"],["SHIBUYA INCIDENT","Shibuya Crossing","A night of fear forces Yuji to stand against overwhelming curses.","Shibuya Devourer"],["CULLING GAME","Abandoned Colony","Yuji navigates a deadly colony and fights to keep people alive.","Colony Champion"],["FINAL ARC · SUKUNA","Shinjuku Ruins","Yuji confronts the King of Curses and the legacy of his own choices.","Sukuna's Shadow"]],"megumi":[["CHILDHOOD · THE ZENIN SHADOW","Fushiguro Home","Megumi's childhood is shaped by a powerful inherited technique.","Zenin Hunter"],["TEENAGER · TEN SHADOWS","Jujutsu High","Megumi trains his shikigami and learns the cost of using their powers.","Ritual Summoner"],["SHIBUYA INCIDENT","Shibuya Streets","A sorcerer's duty pulls Megumi into the violence of Shibuya.","Shibuya Curse"],["CULLING GAME","Barrier Colony","Megumi risks his life to protect the people he cares about.","Colony Sorcerer"],["FINAL ARC · SHADOWS","Final Shrine","The fate of Ten Shadows reaches its breaking point.","Shadow Sovereign"]],"sukuna":[["HEIAN CHILDHOOD · THE REJECTED","Heian Exile","Born rejected and feared, Sukuna is forced to learn without a teacher.","Heian Hunter"],["HEIAN ADULTHOOD · ASCENT","Imperial Capital","Sukuna grows into an unmatched curse, slaughtering the hunters sent for him.","Imperial Executioner"],["CURSED OBJECT · CENTURIES PASS","Sealed Shrine","Time passes as Sukuna's power survives in cursed objects.","Seal Guardian"],["MODERN AGE · THE VESSEL","Shibuya Streets","Sukuna emerges in modern Japan and unleashes ancient techniques.","Modern Special Grade"],["FINAL AGE · KING OF CURSES","Shinjuku Battlefield","The King of Curses faces the strongest sorcerers of the modern age.","Satoru Gojo"]],"custom":[["CHILDHOOD · FIRST AWAKENING","Neo-Tokyo Suburbs · 2048","In a future Japan, a young sorcerer discovers an unstable inherited technique.","Unregistered Curse"],["TEENAGER · NEW JUJUTSU ACADEMY","Future Sorcerer Academy · 2056","As a student, learn to control your technique while rival cadets compete for rank.","Academy Rival"],["YOUNG ADULT · NEON DISTRICT","Neo-Shibuya · 2064","The rebuilt city is threatened by artificial cursed-energy devices.","Synthetic Curse"],["EXPERIENCED SORCERER · THE FRACTURE","The Temporal Rift · 2074","Decades-old cursed research tears holes between present and past.","Rift Warden"],["FUTURE LEGEND · THE LAST VEIL","Tokyo Sky Citadel · 2084","A new generation faces the source of the fracture. Decide what your legacy becomes.","The Future Sovereign"]]};
const LIFE_MISSIONS={"gojo":[{"title":"The Six Eyes Awaken","type":"training","target":5,"stage":0,"description":"Train your basic punches","xp":65,"fragments":20},{"title":"Under Clan Protection","type":"kills","target":2,"stage":0,"description":"Exorcise 2 curses in total","xp":78,"fragments":24},{"title":"The First Curse","type":"travel","target":260,"stage":0,"description":"Reach 260 meters from this chapter start","xp":91,"fragments":28},{"title":"The Gift of Infinity","type":"kills","target":4,"stage":0,"description":"Exorcise 4 curses in total","xp":104,"fragments":32},{"title":"The Clan's Trial","type":"bossApproach","target":0,"stage":0,"description":"Continue the story","xp":117,"fragments":36},{"title":"The First Binding","type":"travel","target":470,"stage":0,"description":"Reach 470 meters from this chapter start","xp":130,"fragments":40},{"title":"A Child's Discipline","type":"level","target":2,"stage":0,"description":"Reach level 2","xp":143,"fragments":44},{"title":"A Dangerous Lesson","type":"travel","target":690,"stage":0,"description":"Reach 690 meters from this chapter start","xp":156,"fragments":48},{"title":"Exorcise the Intruder","type":"kills","target":7,"stage":0,"description":"Exorcise 7 curses in total","xp":169,"fragments":52},{"title":"Learning Blue","type":"skill","target":"technique","stage":0,"description":"Unlock technique in your skill tree","xp":182,"fragments":56},{"title":"A Heir's Burden","type":"kills","target":10,"stage":0,"description":"Exorcise 10 curses in total","xp":195,"fragments":60},{"title":"CLAN TRAINING GUARDIAN","type":"lifeBoss","target":0,"stage":0,"description":"Defeat Clan Training Guardian","xp":208,"fragments":64},{"title":"Hidden Inventory Begins","type":"training","target":5,"stage":1,"description":"Train your basic punches","xp":110,"fragments":32},{"title":"Training With Geto","type":"kills","target":12,"stage":1,"description":"Exorcise 12 curses in total","xp":123,"fragments":36},{"title":"The Vessel Mission","type":"travel","target":260,"stage":1,"description":"Reach 260 meters from this chapter start","xp":136,"fragments":40},{"title":"Escort Through the City","type":"kills","target":14,"stage":1,"description":"Exorcise 14 curses in total","xp":149,"fragments":44},{"title":"An Assassin Approaches","type":"bossApproach","target":0,"stage":1,"description":"Continue the story","xp":162,"fragments":48},{"title":"The Escort Seal","type":"travel","target":470,"stage":1,"description":"Reach 470 meters from this chapter start","xp":175,"fragments":52},{"title":"The Strongest Students","type":"level","target":5,"stage":1,"description":"Reach level 5","xp":188,"fragments":56},{"title":"Chasing the Bounty","type":"travel","target":690,"stage":1,"description":"Reach 690 meters from this chapter start","xp":201,"fragments":60},{"title":"The Last Defense","type":"kills","target":17,"stage":1,"description":"Exorcise 17 curses in total","xp":214,"fragments":64},{"title":"The Cost of Limitless","type":"skill","target":"advanced","stage":1,"description":"Unlock advanced in your skill tree","xp":227,"fragments":68},{"title":"A Promise to Riko","type":"kills","target":20,"stage":1,"description":"Exorcise 20 curses in total","xp":240,"fragments":72},{"title":"TOJI FUSHIGURO","type":"lifeBoss","target":1,"stage":1,"description":"Defeat Toji Fushiguro","xp":253,"fragments":76},{"title":"A Teacher's Duty","type":"training","target":5,"stage":2,"description":"Train your basic punches","xp":155,"fragments":44},{"title":"Curse Outbreak","type":"kills","target":22,"stage":2,"description":"Exorcise 22 curses in total","xp":168,"fragments":48},{"title":"The Crowded Station","type":"travel","target":260,"stage":2,"description":"Reach 260 meters from this chapter start","xp":181,"fragments":52},{"title":"The Trap Beneath","type":"kills","target":24,"stage":2,"description":"Exorcise 24 curses in total","xp":194,"fragments":56},{"title":"The Curse Coalition","type":"bossApproach","target":0,"stage":2,"description":"Continue the story","xp":207,"fragments":60},{"title":"The Station Barrier","type":"travel","target":470,"stage":2,"description":"Reach 470 meters from this chapter start","xp":220,"fragments":64},{"title":"Hold Back the Darkness","type":"level","target":8,"stage":2,"description":"Reach level 8","xp":233,"fragments":68},{"title":"Find the Survivors","type":"travel","target":690,"stage":2,"description":"Reach 690 meters from this chapter start","xp":246,"fragments":72},{"title":"Protect Your Students","type":"kills","target":27,"stage":2,"description":"Exorcise 27 curses in total","xp":259,"fragments":76},{"title":"Reverse Cursed Energy","type":"skill","target":"rct","stage":2,"description":"Unlock rct in your skill tree","xp":272,"fragments":80},{"title":"A Seal Appears","type":"kills","target":30,"stage":2,"description":"Exorcise 30 curses in total","xp":285,"fragments":84},{"title":"SHIBUYA SHOWDOWN","type":"lifeBoss","target":2,"stage":2,"description":"Defeat Shibuya Curse Coalition","xp":298,"fragments":88},{"title":"Unsealed","type":"training","target":5,"stage":3,"description":"Train your basic punches","xp":200,"fragments":56},{"title":"Return to a Changed World","type":"kills","target":32,"stage":3,"description":"Exorcise 32 curses in total","xp":213,"fragments":60},{"title":"Beyond the Curtain","type":"travel","target":260,"stage":3,"description":"Reach 260 meters from this chapter start","xp":226,"fragments":64},{"title":"The City's Damage","type":"kills","target":34,"stage":3,"description":"Exorcise 34 curses in total","xp":239,"fragments":68},{"title":"The Final Vanguard","type":"bossApproach","target":0,"stage":3,"description":"Continue the story","xp":252,"fragments":72},{"title":"The Remnant Seal","type":"travel","target":470,"stage":3,"description":"Reach 470 meters from this chapter start","xp":265,"fragments":76},{"title":"The Strongest Returns","type":"level","target":11,"stage":3,"description":"Reach level 11","xp":278,"fragments":80},{"title":"Practice the Domain","type":"travel","target":690,"stage":3,"description":"Reach 690 meters from this chapter start","xp":291,"fragments":84},{"title":"Protect the Students","type":"kills","target":37,"stage":3,"description":"Exorcise 37 curses in total","xp":304,"fragments":88},{"title":"Unlimited Void","type":"skill","target":"domain","stage":3,"description":"Unlock domain in your skill tree","xp":317,"fragments":92},{"title":"The Last Promise","type":"kills","target":40,"stage":3,"description":"Exorcise 40 curses in total","xp":330,"fragments":96},{"title":"SPECIAL GRADE VANGUARD","type":"lifeBoss","target":3,"stage":3,"description":"Defeat Special Grade Vanguard","xp":343,"fragments":100},{"title":"Shinjuku Duel","type":"training","target":5,"stage":4,"description":"Train your basic punches","xp":245,"fragments":68},{"title":"The First Exchange","type":"kills","target":42,"stage":4,"description":"Exorcise 42 curses in total","xp":258,"fragments":72},{"title":"The Strongest Clash","type":"travel","target":260,"stage":4,"description":"Reach 260 meters from this chapter start","xp":271,"fragments":76},{"title":"Domain and Domain","type":"kills","target":44,"stage":4,"description":"Exorcise 44 curses in total","xp":284,"fragments":80},{"title":"The Adaptation","type":"bossApproach","target":0,"stage":4,"description":"Continue the story","xp":297,"fragments":84},{"title":"The Last Barrier","type":"travel","target":470,"stage":4,"description":"Reach 470 meters from this chapter start","xp":310,"fragments":88},{"title":"When Infinity Breaks","type":"level","target":14,"stage":4,"description":"Reach level 14","xp":323,"fragments":92},{"title":"A Dangerous Reversal","type":"travel","target":690,"stage":4,"description":"Reach 690 meters from this chapter start","xp":336,"fragments":96},{"title":"Hollow Purple","type":"kills","target":47,"stage":4,"description":"Exorcise 47 curses in total","xp":349,"fragments":100},{"title":"The Last Domain","type":"skill","target":"mastery","stage":4,"description":"Unlock mastery in your skill tree","xp":362,"fragments":104},{"title":"Beyond the Limits","type":"kills","target":50,"stage":4,"description":"Exorcise 50 curses in total","xp":375,"fragments":108},{"title":"GOJO VS SUKUNA","type":"lifeBoss","target":4,"stage":4,"description":"Defeat Ryomen Sukuna","xp":388,"fragments":112}],"yuji":[{"title":"CHILDHOOD · First Lessons","type":"training","target":5,"stage":0,"description":"Train your basic punches","xp":65,"fragments":20},{"title":"CHILDHOOD · The First Threat","type":"kills","target":2,"stage":0,"description":"Exorcise 2 curses in total","xp":78,"fragments":24},{"title":"CHILDHOOD · Follow the Trail","type":"travel","target":260,"stage":0,"description":"Reach 260 meters from this chapter start","xp":91,"fragments":28},{"title":"CHILDHOOD · Cursed Resistance","type":"kills","target":4,"stage":0,"description":"Exorcise 4 curses in total","xp":104,"fragments":32},{"title":"CHILDHOOD · Guardian of the Road","type":"bossApproach","target":0,"stage":0,"description":"Continue the story","xp":117,"fragments":36},{"title":"CHILDHOOD · The Field Seal","type":"travel","target":470,"stage":0,"description":"Reach 470 meters from this chapter start","xp":130,"fragments":40},{"title":"CHILDHOOD · The Trials of Growth","type":"level","target":2,"stage":0,"description":"Reach level 2","xp":143,"fragments":44},{"title":"CHILDHOOD · Beyond the Old Boundary","type":"travel","target":690,"stage":0,"description":"Reach 690 meters from this chapter start","xp":156,"fragments":48},{"title":"CHILDHOOD · One More Battle","type":"kills","target":7,"stage":0,"description":"Exorcise 7 curses in total","xp":169,"fragments":52},{"title":"CHILDHOOD · Learn the Next Technique","type":"skill","target":"technique","stage":0,"description":"Unlock technique in your skill tree","xp":182,"fragments":56},{"title":"CHILDHOOD · Before the Turning Point","type":"kills","target":10,"stage":0,"description":"Exorcise 10 curses in total","xp":195,"fragments":60},{"title":"SCHOOLYARD CURSE","type":"lifeBoss","target":0,"stage":0,"description":"Defeat Schoolyard Curse","xp":208,"fragments":64},{"title":"VESSEL · First Lessons","type":"training","target":5,"stage":1,"description":"Train your basic punches","xp":110,"fragments":32},{"title":"VESSEL · The First Threat","type":"kills","target":12,"stage":1,"description":"Exorcise 12 curses in total","xp":123,"fragments":36},{"title":"VESSEL · Follow the Trail","type":"travel","target":260,"stage":1,"description":"Reach 260 meters from this chapter start","xp":136,"fragments":40},{"title":"VESSEL · Cursed Resistance","type":"kills","target":14,"stage":1,"description":"Exorcise 14 curses in total","xp":149,"fragments":44},{"title":"VESSEL · Guardian of the Road","type":"bossApproach","target":0,"stage":1,"description":"Continue the story","xp":162,"fragments":48},{"title":"VESSEL · The Field Seal","type":"travel","target":470,"stage":1,"description":"Reach 470 meters from this chapter start","xp":175,"fragments":52},{"title":"VESSEL · The Trials of Growth","type":"level","target":5,"stage":1,"description":"Reach level 5","xp":188,"fragments":56},{"title":"VESSEL · Beyond the Old Boundary","type":"travel","target":690,"stage":1,"description":"Reach 690 meters from this chapter start","xp":201,"fragments":60},{"title":"VESSEL · One More Battle","type":"kills","target":17,"stage":1,"description":"Exorcise 17 curses in total","xp":214,"fragments":64},{"title":"VESSEL · Learn the Next Technique","type":"skill","target":"advanced","stage":1,"description":"Unlock advanced in your skill tree","xp":227,"fragments":68},{"title":"VESSEL · Before the Turning Point","type":"kills","target":20,"stage":1,"description":"Exorcise 20 curses in total","xp":240,"fragments":72},{"title":"SPECIAL GRADE CURSE","type":"lifeBoss","target":1,"stage":1,"description":"Defeat Special Grade Curse","xp":253,"fragments":76},{"title":"SHIBUYA INCIDENT · First Lessons","type":"training","target":5,"stage":2,"description":"Train your basic punches","xp":155,"fragments":44},{"title":"SHIBUYA INCIDENT · The First Threat","type":"kills","target":22,"stage":2,"description":"Exorcise 22 curses in total","xp":168,"fragments":48},{"title":"SHIBUYA INCIDENT · Follow the Trail","type":"travel","target":260,"stage":2,"description":"Reach 260 meters from this chapter start","xp":181,"fragments":52},{"title":"SHIBUYA INCIDENT · Cursed Resistance","type":"kills","target":24,"stage":2,"description":"Exorcise 24 curses in total","xp":194,"fragments":56},{"title":"SHIBUYA INCIDENT · Guardian of the Road","type":"bossApproach","target":0,"stage":2,"description":"Continue the story","xp":207,"fragments":60},{"title":"SHIBUYA INCIDENT · The Field Seal","type":"travel","target":470,"stage":2,"description":"Reach 470 meters from this chapter start","xp":220,"fragments":64},{"title":"SHIBUYA INCIDENT · The Trials of Growth","type":"level","target":8,"stage":2,"description":"Reach level 8","xp":233,"fragments":68},{"title":"SHIBUYA INCIDENT · Beyond the Old Boundary","type":"travel","target":690,"stage":2,"description":"Reach 690 meters from this chapter start","xp":246,"fragments":72},{"title":"SHIBUYA INCIDENT · One More Battle","type":"kills","target":27,"stage":2,"description":"Exorcise 27 curses in total","xp":259,"fragments":76},{"title":"SHIBUYA INCIDENT · Learn the Next Technique","type":"skill","target":"rct","stage":2,"description":"Unlock rct in your skill tree","xp":272,"fragments":80},{"title":"SHIBUYA INCIDENT · Before the Turning Point","type":"kills","target":30,"stage":2,"description":"Exorcise 30 curses in total","xp":285,"fragments":84},{"title":"SHIBUYA DEVOURER","type":"lifeBoss","target":2,"stage":2,"description":"Defeat Shibuya Devourer","xp":298,"fragments":88},{"title":"CULLING GAME · First Lessons","type":"training","target":5,"stage":3,"description":"Train your basic punches","xp":200,"fragments":56},{"title":"CULLING GAME · The First Threat","type":"kills","target":32,"stage":3,"description":"Exorcise 32 curses in total","xp":213,"fragments":60},{"title":"CULLING GAME · Follow the Trail","type":"travel","target":260,"stage":3,"description":"Reach 260 meters from this chapter start","xp":226,"fragments":64},{"title":"CULLING GAME · Cursed Resistance","type":"kills","target":34,"stage":3,"description":"Exorcise 34 curses in total","xp":239,"fragments":68},{"title":"CULLING GAME · Guardian of the Road","type":"bossApproach","target":0,"stage":3,"description":"Continue the story","xp":252,"fragments":72},{"title":"CULLING GAME · The Field Seal","type":"travel","target":470,"stage":3,"description":"Reach 470 meters from this chapter start","xp":265,"fragments":76},{"title":"CULLING GAME · The Trials of Growth","type":"level","target":11,"stage":3,"description":"Reach level 11","xp":278,"fragments":80},{"title":"CULLING GAME · Beyond the Old Boundary","type":"travel","target":690,"stage":3,"description":"Reach 690 meters from this chapter start","xp":291,"fragments":84},{"title":"CULLING GAME · One More Battle","type":"kills","target":37,"stage":3,"description":"Exorcise 37 curses in total","xp":304,"fragments":88},{"title":"CULLING GAME · Learn the Next Technique","type":"skill","target":"domain","stage":3,"description":"Unlock domain in your skill tree","xp":317,"fragments":92},{"title":"CULLING GAME · Before the Turning Point","type":"kills","target":40,"stage":3,"description":"Exorcise 40 curses in total","xp":330,"fragments":96},{"title":"COLONY CHAMPION","type":"lifeBoss","target":3,"stage":3,"description":"Defeat Colony Champion","xp":343,"fragments":100},{"title":"FINAL ARC · First Lessons","type":"training","target":5,"stage":4,"description":"Train your basic punches","xp":245,"fragments":68},{"title":"FINAL ARC · The First Threat","type":"kills","target":42,"stage":4,"description":"Exorcise 42 curses in total","xp":258,"fragments":72},{"title":"FINAL ARC · Follow the Trail","type":"travel","target":260,"stage":4,"description":"Reach 260 meters from this chapter start","xp":271,"fragments":76},{"title":"FINAL ARC · Cursed Resistance","type":"kills","target":44,"stage":4,"description":"Exorcise 44 curses in total","xp":284,"fragments":80},{"title":"FINAL ARC · Guardian of the Road","type":"bossApproach","target":0,"stage":4,"description":"Continue the story","xp":297,"fragments":84},{"title":"FINAL ARC · The Field Seal","type":"travel","target":470,"stage":4,"description":"Reach 470 meters from this chapter start","xp":310,"fragments":88},{"title":"FINAL ARC · The Trials of Growth","type":"level","target":14,"stage":4,"description":"Reach level 14","xp":323,"fragments":92},{"title":"FINAL ARC · Beyond the Old Boundary","type":"travel","target":690,"stage":4,"description":"Reach 690 meters from this chapter start","xp":336,"fragments":96},{"title":"FINAL ARC · One More Battle","type":"kills","target":47,"stage":4,"description":"Exorcise 47 curses in total","xp":349,"fragments":100},{"title":"FINAL ARC · Learn the Next Technique","type":"skill","target":"mastery","stage":4,"description":"Unlock mastery in your skill tree","xp":362,"fragments":104},{"title":"FINAL ARC · Before the Turning Point","type":"kills","target":50,"stage":4,"description":"Exorcise 50 curses in total","xp":375,"fragments":108},{"title":"SUKUNA'S SHADOW","type":"lifeBoss","target":4,"stage":4,"description":"Defeat Sukuna's Shadow","xp":388,"fragments":112}],"megumi":[{"title":"CHILDHOOD · First Lessons","type":"training","target":5,"stage":0,"description":"Train your basic punches","xp":65,"fragments":20},{"title":"CHILDHOOD · The First Threat","type":"kills","target":2,"stage":0,"description":"Exorcise 2 curses in total","xp":78,"fragments":24},{"title":"CHILDHOOD · Follow the Trail","type":"travel","target":260,"stage":0,"description":"Reach 260 meters from this chapter start","xp":91,"fragments":28},{"title":"CHILDHOOD · Cursed Resistance","type":"kills","target":4,"stage":0,"description":"Exorcise 4 curses in total","xp":104,"fragments":32},{"title":"CHILDHOOD · Guardian of the Road","type":"bossApproach","target":0,"stage":0,"description":"Continue the story","xp":117,"fragments":36},{"title":"CHILDHOOD · The Field Seal","type":"travel","target":470,"stage":0,"description":"Reach 470 meters from this chapter start","xp":130,"fragments":40},{"title":"CHILDHOOD · The Trials of Growth","type":"level","target":2,"stage":0,"description":"Reach level 2","xp":143,"fragments":44},{"title":"CHILDHOOD · Beyond the Old Boundary","type":"travel","target":690,"stage":0,"description":"Reach 690 meters from this chapter start","xp":156,"fragments":48},{"title":"CHILDHOOD · One More Battle","type":"kills","target":7,"stage":0,"description":"Exorcise 7 curses in total","xp":169,"fragments":52},{"title":"CHILDHOOD · Learn the Next Technique","type":"skill","target":"technique","stage":0,"description":"Unlock technique in your skill tree","xp":182,"fragments":56},{"title":"CHILDHOOD · Before the Turning Point","type":"kills","target":10,"stage":0,"description":"Exorcise 10 curses in total","xp":195,"fragments":60},{"title":"ZENIN HUNTER","type":"lifeBoss","target":0,"stage":0,"description":"Defeat Zenin Hunter","xp":208,"fragments":64},{"title":"TEENAGER · First Lessons","type":"training","target":5,"stage":1,"description":"Train your basic punches","xp":110,"fragments":32},{"title":"TEENAGER · The First Threat","type":"kills","target":12,"stage":1,"description":"Exorcise 12 curses in total","xp":123,"fragments":36},{"title":"TEENAGER · Follow the Trail","type":"travel","target":260,"stage":1,"description":"Reach 260 meters from this chapter start","xp":136,"fragments":40},{"title":"TEENAGER · Cursed Resistance","type":"kills","target":14,"stage":1,"description":"Exorcise 14 curses in total","xp":149,"fragments":44},{"title":"TEENAGER · Guardian of the Road","type":"bossApproach","target":0,"stage":1,"description":"Continue the story","xp":162,"fragments":48},{"title":"TEENAGER · The Field Seal","type":"travel","target":470,"stage":1,"description":"Reach 470 meters from this chapter start","xp":175,"fragments":52},{"title":"TEENAGER · The Trials of Growth","type":"level","target":5,"stage":1,"description":"Reach level 5","xp":188,"fragments":56},{"title":"TEENAGER · Beyond the Old Boundary","type":"travel","target":690,"stage":1,"description":"Reach 690 meters from this chapter start","xp":201,"fragments":60},{"title":"TEENAGER · One More Battle","type":"kills","target":17,"stage":1,"description":"Exorcise 17 curses in total","xp":214,"fragments":64},{"title":"TEENAGER · Learn the Next Technique","type":"skill","target":"advanced","stage":1,"description":"Unlock advanced in your skill tree","xp":227,"fragments":68},{"title":"TEENAGER · Before the Turning Point","type":"kills","target":20,"stage":1,"description":"Exorcise 20 curses in total","xp":240,"fragments":72},{"title":"RITUAL SUMMONER","type":"lifeBoss","target":1,"stage":1,"description":"Defeat Ritual Summoner","xp":253,"fragments":76},{"title":"SHIBUYA INCIDENT · First Lessons","type":"training","target":5,"stage":2,"description":"Train your basic punches","xp":155,"fragments":44},{"title":"SHIBUYA INCIDENT · The First Threat","type":"kills","target":22,"stage":2,"description":"Exorcise 22 curses in total","xp":168,"fragments":48},{"title":"SHIBUYA INCIDENT · Follow the Trail","type":"travel","target":260,"stage":2,"description":"Reach 260 meters from this chapter start","xp":181,"fragments":52},{"title":"SHIBUYA INCIDENT · Cursed Resistance","type":"kills","target":24,"stage":2,"description":"Exorcise 24 curses in total","xp":194,"fragments":56},{"title":"SHIBUYA INCIDENT · Guardian of the Road","type":"bossApproach","target":0,"stage":2,"description":"Continue the story","xp":207,"fragments":60},{"title":"SHIBUYA INCIDENT · The Field Seal","type":"travel","target":470,"stage":2,"description":"Reach 470 meters from this chapter start","xp":220,"fragments":64},{"title":"SHIBUYA INCIDENT · The Trials of Growth","type":"level","target":8,"stage":2,"description":"Reach level 8","xp":233,"fragments":68},{"title":"SHIBUYA INCIDENT · Beyond the Old Boundary","type":"travel","target":690,"stage":2,"description":"Reach 690 meters from this chapter start","xp":246,"fragments":72},{"title":"SHIBUYA INCIDENT · One More Battle","type":"kills","target":27,"stage":2,"description":"Exorcise 27 curses in total","xp":259,"fragments":76},{"title":"SHIBUYA INCIDENT · Learn the Next Technique","type":"skill","target":"rct","stage":2,"description":"Unlock rct in your skill tree","xp":272,"fragments":80},{"title":"SHIBUYA INCIDENT · Before the Turning Point","type":"kills","target":30,"stage":2,"description":"Exorcise 30 curses in total","xp":285,"fragments":84},{"title":"SHIBUYA CURSE","type":"lifeBoss","target":2,"stage":2,"description":"Defeat Shibuya Curse","xp":298,"fragments":88},{"title":"CULLING GAME · First Lessons","type":"training","target":5,"stage":3,"description":"Train your basic punches","xp":200,"fragments":56},{"title":"CULLING GAME · The First Threat","type":"kills","target":32,"stage":3,"description":"Exorcise 32 curses in total","xp":213,"fragments":60},{"title":"CULLING GAME · Follow the Trail","type":"travel","target":260,"stage":3,"description":"Reach 260 meters from this chapter start","xp":226,"fragments":64},{"title":"CULLING GAME · Cursed Resistance","type":"kills","target":34,"stage":3,"description":"Exorcise 34 curses in total","xp":239,"fragments":68},{"title":"CULLING GAME · Guardian of the Road","type":"bossApproach","target":0,"stage":3,"description":"Continue the story","xp":252,"fragments":72},{"title":"CULLING GAME · The Field Seal","type":"travel","target":470,"stage":3,"description":"Reach 470 meters from this chapter start","xp":265,"fragments":76},{"title":"CULLING GAME · The Trials of Growth","type":"level","target":11,"stage":3,"description":"Reach level 11","xp":278,"fragments":80},{"title":"CULLING GAME · Beyond the Old Boundary","type":"travel","target":690,"stage":3,"description":"Reach 690 meters from this chapter start","xp":291,"fragments":84},{"title":"CULLING GAME · One More Battle","type":"kills","target":37,"stage":3,"description":"Exorcise 37 curses in total","xp":304,"fragments":88},{"title":"CULLING GAME · Learn the Next Technique","type":"skill","target":"domain","stage":3,"description":"Unlock domain in your skill tree","xp":317,"fragments":92},{"title":"CULLING GAME · Before the Turning Point","type":"kills","target":40,"stage":3,"description":"Exorcise 40 curses in total","xp":330,"fragments":96},{"title":"COLONY SORCERER","type":"lifeBoss","target":3,"stage":3,"description":"Defeat Colony Sorcerer","xp":343,"fragments":100},{"title":"FINAL ARC · First Lessons","type":"training","target":5,"stage":4,"description":"Train your basic punches","xp":245,"fragments":68},{"title":"FINAL ARC · The First Threat","type":"kills","target":42,"stage":4,"description":"Exorcise 42 curses in total","xp":258,"fragments":72},{"title":"FINAL ARC · Follow the Trail","type":"travel","target":260,"stage":4,"description":"Reach 260 meters from this chapter start","xp":271,"fragments":76},{"title":"FINAL ARC · Cursed Resistance","type":"kills","target":44,"stage":4,"description":"Exorcise 44 curses in total","xp":284,"fragments":80},{"title":"FINAL ARC · Guardian of the Road","type":"bossApproach","target":0,"stage":4,"description":"Continue the story","xp":297,"fragments":84},{"title":"FINAL ARC · The Field Seal","type":"travel","target":470,"stage":4,"description":"Reach 470 meters from this chapter start","xp":310,"fragments":88},{"title":"FINAL ARC · The Trials of Growth","type":"level","target":14,"stage":4,"description":"Reach level 14","xp":323,"fragments":92},{"title":"FINAL ARC · Beyond the Old Boundary","type":"travel","target":690,"stage":4,"description":"Reach 690 meters from this chapter start","xp":336,"fragments":96},{"title":"FINAL ARC · One More Battle","type":"kills","target":47,"stage":4,"description":"Exorcise 47 curses in total","xp":349,"fragments":100},{"title":"FINAL ARC · Learn the Next Technique","type":"skill","target":"mastery","stage":4,"description":"Unlock mastery in your skill tree","xp":362,"fragments":104},{"title":"FINAL ARC · Before the Turning Point","type":"kills","target":50,"stage":4,"description":"Exorcise 50 curses in total","xp":375,"fragments":108},{"title":"SHADOW SOVEREIGN","type":"lifeBoss","target":4,"stage":4,"description":"Defeat Shadow Sovereign","xp":388,"fragments":112}],"sukuna":[{"title":"HEIAN CHILDHOOD · First Lessons","type":"training","target":5,"stage":0,"description":"Survive and train alone","xp":65,"fragments":20},{"title":"HEIAN CHILDHOOD · The First Threat","type":"kills","target":2,"stage":0,"description":"Exorcise 2 curses in total","xp":78,"fragments":24},{"title":"HEIAN CHILDHOOD · Follow the Trail","type":"travel","target":260,"stage":0,"description":"Reach 260 meters from this chapter start","xp":91,"fragments":28},{"title":"HEIAN CHILDHOOD · Cursed Resistance","type":"kills","target":4,"stage":0,"description":"Exorcise 4 curses in total","xp":104,"fragments":32},{"title":"HEIAN CHILDHOOD · Guardian of the Road","type":"bossApproach","target":0,"stage":0,"description":"Continue the story","xp":117,"fragments":36},{"title":"HEIAN CHILDHOOD · The Field Seal","type":"travel","target":470,"stage":0,"description":"Reach 470 meters from this chapter start","xp":130,"fragments":40},{"title":"HEIAN CHILDHOOD · The Trials of Growth","type":"level","target":2,"stage":0,"description":"Reach level 2","xp":143,"fragments":44},{"title":"HEIAN CHILDHOOD · Beyond the Old Boundary","type":"travel","target":690,"stage":0,"description":"Reach 690 meters from this chapter start","xp":156,"fragments":48},{"title":"HEIAN CHILDHOOD · One More Battle","type":"kills","target":7,"stage":0,"description":"Exorcise 7 curses in total","xp":169,"fragments":52},{"title":"HEIAN CHILDHOOD · Learn the Next Technique","type":"skill","target":"technique","stage":0,"description":"Unlock technique in your skill tree","xp":182,"fragments":56},{"title":"HEIAN CHILDHOOD · Before the Turning Point","type":"kills","target":10,"stage":0,"description":"Exorcise 10 curses in total","xp":195,"fragments":60},{"title":"HEIAN HUNTER","type":"lifeBoss","target":0,"stage":0,"description":"Defeat Heian Hunter","xp":208,"fragments":64},{"title":"HEIAN ADULTHOOD · First Lessons","type":"training","target":5,"stage":1,"description":"Survive and train alone","xp":110,"fragments":32},{"title":"HEIAN ADULTHOOD · The First Threat","type":"kills","target":12,"stage":1,"description":"Exorcise 12 curses in total","xp":123,"fragments":36},{"title":"HEIAN ADULTHOOD · Follow the Trail","type":"travel","target":260,"stage":1,"description":"Reach 260 meters from this chapter start","xp":136,"fragments":40},{"title":"HEIAN ADULTHOOD · Cursed Resistance","type":"kills","target":14,"stage":1,"description":"Exorcise 14 curses in total","xp":149,"fragments":44},{"title":"HEIAN ADULTHOOD · Guardian of the Road","type":"bossApproach","target":0,"stage":1,"description":"Continue the story","xp":162,"fragments":48},{"title":"HEIAN ADULTHOOD · The Field Seal","type":"travel","target":470,"stage":1,"description":"Reach 470 meters from this chapter start","xp":175,"fragments":52},{"title":"HEIAN ADULTHOOD · The Trials of Growth","type":"level","target":5,"stage":1,"description":"Reach level 5","xp":188,"fragments":56},{"title":"HEIAN ADULTHOOD · Beyond the Old Boundary","type":"travel","target":690,"stage":1,"description":"Reach 690 meters from this chapter start","xp":201,"fragments":60},{"title":"HEIAN ADULTHOOD · One More Battle","type":"kills","target":17,"stage":1,"description":"Exorcise 17 curses in total","xp":214,"fragments":64},{"title":"HEIAN ADULTHOOD · Learn the Next Technique","type":"skill","target":"advanced","stage":1,"description":"Unlock advanced in your skill tree","xp":227,"fragments":68},{"title":"HEIAN ADULTHOOD · Before the Turning Point","type":"kills","target":20,"stage":1,"description":"Exorcise 20 curses in total","xp":240,"fragments":72},{"title":"IMPERIAL EXECUTIONER","type":"lifeBoss","target":1,"stage":1,"description":"Defeat Imperial Executioner","xp":253,"fragments":76},{"title":"CURSED OBJECT · First Lessons","type":"training","target":5,"stage":2,"description":"Survive and train alone","xp":155,"fragments":44},{"title":"CURSED OBJECT · The First Threat","type":"kills","target":22,"stage":2,"description":"Exorcise 22 curses in total","xp":168,"fragments":48},{"title":"CURSED OBJECT · Follow the Trail","type":"travel","target":260,"stage":2,"description":"Reach 260 meters from this chapter start","xp":181,"fragments":52},{"title":"CURSED OBJECT · Cursed Resistance","type":"kills","target":24,"stage":2,"description":"Exorcise 24 curses in total","xp":194,"fragments":56},{"title":"CURSED OBJECT · Guardian of the Road","type":"bossApproach","target":0,"stage":2,"description":"Continue the story","xp":207,"fragments":60},{"title":"CURSED OBJECT · The Field Seal","type":"travel","target":470,"stage":2,"description":"Reach 470 meters from this chapter start","xp":220,"fragments":64},{"title":"CURSED OBJECT · The Trials of Growth","type":"level","target":8,"stage":2,"description":"Reach level 8","xp":233,"fragments":68},{"title":"CURSED OBJECT · Beyond the Old Boundary","type":"travel","target":690,"stage":2,"description":"Reach 690 meters from this chapter start","xp":246,"fragments":72},{"title":"CURSED OBJECT · One More Battle","type":"kills","target":27,"stage":2,"description":"Exorcise 27 curses in total","xp":259,"fragments":76},{"title":"CURSED OBJECT · Learn the Next Technique","type":"skill","target":"rct","stage":2,"description":"Unlock rct in your skill tree","xp":272,"fragments":80},{"title":"CURSED OBJECT · Before the Turning Point","type":"kills","target":30,"stage":2,"description":"Exorcise 30 curses in total","xp":285,"fragments":84},{"title":"SEAL GUARDIAN","type":"lifeBoss","target":2,"stage":2,"description":"Defeat Seal Guardian","xp":298,"fragments":88},{"title":"MODERN AGE · First Lessons","type":"training","target":5,"stage":3,"description":"Survive and train alone","xp":200,"fragments":56},{"title":"MODERN AGE · The First Threat","type":"kills","target":32,"stage":3,"description":"Exorcise 32 curses in total","xp":213,"fragments":60},{"title":"MODERN AGE · Follow the Trail","type":"travel","target":260,"stage":3,"description":"Reach 260 meters from this chapter start","xp":226,"fragments":64},{"title":"MODERN AGE · Cursed Resistance","type":"kills","target":34,"stage":3,"description":"Exorcise 34 curses in total","xp":239,"fragments":68},{"title":"MODERN AGE · Guardian of the Road","type":"bossApproach","target":0,"stage":3,"description":"Continue the story","xp":252,"fragments":72},{"title":"MODERN AGE · The Field Seal","type":"travel","target":470,"stage":3,"description":"Reach 470 meters from this chapter start","xp":265,"fragments":76},{"title":"MODERN AGE · The Trials of Growth","type":"level","target":11,"stage":3,"description":"Reach level 11","xp":278,"fragments":80},{"title":"MODERN AGE · Beyond the Old Boundary","type":"travel","target":690,"stage":3,"description":"Reach 690 meters from this chapter start","xp":291,"fragments":84},{"title":"MODERN AGE · One More Battle","type":"kills","target":37,"stage":3,"description":"Exorcise 37 curses in total","xp":304,"fragments":88},{"title":"MODERN AGE · Learn the Next Technique","type":"skill","target":"domain","stage":3,"description":"Unlock domain in your skill tree","xp":317,"fragments":92},{"title":"MODERN AGE · Before the Turning Point","type":"kills","target":40,"stage":3,"description":"Exorcise 40 curses in total","xp":330,"fragments":96},{"title":"MODERN SPECIAL GRADE","type":"lifeBoss","target":3,"stage":3,"description":"Defeat Modern Special Grade","xp":343,"fragments":100},{"title":"FINAL AGE · First Lessons","type":"training","target":5,"stage":4,"description":"Survive and train alone","xp":245,"fragments":68},{"title":"FINAL AGE · The First Threat","type":"kills","target":42,"stage":4,"description":"Exorcise 42 curses in total","xp":258,"fragments":72},{"title":"FINAL AGE · Follow the Trail","type":"travel","target":260,"stage":4,"description":"Reach 260 meters from this chapter start","xp":271,"fragments":76},{"title":"FINAL AGE · Cursed Resistance","type":"kills","target":44,"stage":4,"description":"Exorcise 44 curses in total","xp":284,"fragments":80},{"title":"FINAL AGE · Guardian of the Road","type":"bossApproach","target":0,"stage":4,"description":"Continue the story","xp":297,"fragments":84},{"title":"FINAL AGE · The Field Seal","type":"travel","target":470,"stage":4,"description":"Reach 470 meters from this chapter start","xp":310,"fragments":88},{"title":"FINAL AGE · The Trials of Growth","type":"level","target":14,"stage":4,"description":"Reach level 14","xp":323,"fragments":92},{"title":"FINAL AGE · Beyond the Old Boundary","type":"travel","target":690,"stage":4,"description":"Reach 690 meters from this chapter start","xp":336,"fragments":96},{"title":"FINAL AGE · One More Battle","type":"kills","target":47,"stage":4,"description":"Exorcise 47 curses in total","xp":349,"fragments":100},{"title":"FINAL AGE · Learn the Next Technique","type":"skill","target":"mastery","stage":4,"description":"Unlock mastery in your skill tree","xp":362,"fragments":104},{"title":"FINAL AGE · Before the Turning Point","type":"kills","target":50,"stage":4,"description":"Exorcise 50 curses in total","xp":375,"fragments":108},{"title":"SATORU GOJO","type":"lifeBoss","target":4,"stage":4,"description":"Defeat Satoru Gojo","xp":388,"fragments":112}],"custom":[{"title":"Unseen at Home","type":"training","target":5,"stage":0,"description":"Train your basic punches","xp":65,"fragments":20},{"title":"The First Spark","type":"kills","target":2,"stage":0,"description":"Exorcise 2 curses in total","xp":78,"fragments":24},{"title":"Whispers in the Alley","type":"travel","target":260,"stage":0,"description":"Reach 260 meters from this chapter start","xp":91,"fragments":28},{"title":"A New Shadow","type":"kills","target":4,"stage":0,"description":"Exorcise 4 curses in total","xp":104,"fragments":32},{"title":"Futureborn Threat","type":"bossApproach","target":0,"stage":0,"description":"Continue the story","xp":117,"fragments":36},{"title":"The Prototype Seal","type":"travel","target":470,"stage":0,"description":"Reach 470 meters from this chapter start","xp":130,"fragments":40},{"title":"Learn What You Are","type":"level","target":2,"stage":0,"description":"Reach level 2","xp":143,"fragments":44},{"title":"The Last School Day","type":"travel","target":690,"stage":0,"description":"Reach 690 meters from this chapter start","xp":156,"fragments":48},{"title":"A Child's Courage","type":"kills","target":7,"stage":0,"description":"Exorcise 7 curses in total","xp":169,"fragments":52},{"title":"Control the Energy","type":"skill","target":"technique","stage":0,"description":"Unlock technique in your skill tree","xp":182,"fragments":56},{"title":"Neon Storm Warning","type":"kills","target":10,"stage":0,"description":"Exorcise 10 curses in total","xp":195,"fragments":60},{"title":"THE FIRST AWAKENING","type":"lifeBoss","target":0,"stage":0,"description":"Defeat Unregistered Curse","xp":208,"fragments":64},{"title":"The Cadet Entrance","type":"training","target":5,"stage":1,"description":"Train your basic punches","xp":110,"fragments":32},{"title":"The Missing Student","type":"kills","target":12,"stage":1,"description":"Exorcise 12 curses in total","xp":123,"fragments":36},{"title":"Secrets in Class","type":"travel","target":260,"stage":1,"description":"Reach 260 meters from this chapter start","xp":136,"fragments":40},{"title":"The Campus Sweep","type":"kills","target":14,"stage":1,"description":"Exorcise 14 curses in total","xp":149,"fragments":44},{"title":"Rival of the Academy","type":"bossApproach","target":0,"stage":1,"description":"Continue the story","xp":162,"fragments":48},{"title":"The Student Seal","type":"travel","target":470,"stage":1,"description":"Reach 470 meters from this chapter start","xp":175,"fragments":52},{"title":"Final Exams","type":"level","target":5,"stage":1,"description":"Reach level 5","xp":188,"fragments":56},{"title":"Into the Training Wards","type":"travel","target":690,"stage":1,"description":"Reach 690 meters from this chapter start","xp":201,"fragments":60},{"title":"First Solo Patrol","type":"kills","target":17,"stage":1,"description":"Exorcise 17 curses in total","xp":214,"fragments":64},{"title":"Your First Signature Art","type":"skill","target":"advanced","stage":1,"description":"Unlock advanced in your skill tree","xp":227,"fragments":68},{"title":"The Graduation Ceremony","type":"kills","target":20,"stage":1,"description":"Exorcise 20 curses in total","xp":240,"fragments":72},{"title":"THE ACADEMY DUEL","type":"lifeBoss","target":1,"stage":1,"description":"Defeat Academy Rival","xp":253,"fragments":76},{"title":"Neon Streets","type":"training","target":5,"stage":2,"description":"Train your basic punches","xp":155,"fragments":44},{"title":"Synthetic Spirits","type":"kills","target":22,"stage":2,"description":"Exorcise 22 curses in total","xp":168,"fragments":48},{"title":"Into Neo-Shibuya","type":"travel","target":260,"stage":2,"description":"Reach 260 meters from this chapter start","xp":181,"fragments":52},{"title":"The Cyber Curse","type":"kills","target":24,"stage":2,"description":"Exorcise 24 curses in total","xp":194,"fragments":56},{"title":"The Artificial Sorcerer","type":"bossApproach","target":0,"stage":2,"description":"Continue the story","xp":207,"fragments":60},{"title":"Break the Power Grid","type":"travel","target":470,"stage":2,"description":"Reach 470 meters from this chapter start","xp":220,"fragments":64},{"title":"A New Rank","type":"level","target":8,"stage":2,"description":"Reach level 8","xp":233,"fragments":68},{"title":"The Underground City","type":"travel","target":690,"stage":2,"description":"Reach 690 meters from this chapter start","xp":246,"fragments":72},{"title":"The Last Survivor","type":"kills","target":27,"stage":2,"description":"Exorcise 27 curses in total","xp":259,"fragments":76},{"title":"Control the Surge","type":"skill","target":"rct","stage":2,"description":"Unlock rct in your skill tree","xp":272,"fragments":80},{"title":"A City in Crisis","type":"kills","target":30,"stage":2,"description":"Exorcise 30 curses in total","xp":285,"fragments":84},{"title":"NEO-SHIBUYA SHOWDOWN","type":"lifeBoss","target":2,"stage":2,"description":"Defeat Synthetic Curse","xp":298,"fragments":88},{"title":"An Impossible Signal","type":"training","target":5,"stage":3,"description":"Train your basic punches","xp":200,"fragments":56},{"title":"The Rift Descends","type":"kills","target":32,"stage":3,"description":"Exorcise 32 curses in total","xp":213,"fragments":60},{"title":"Shadow of Tomorrow","type":"travel","target":260,"stage":3,"description":"Reach 260 meters from this chapter start","xp":226,"fragments":64},{"title":"Beyond Known Time","type":"kills","target":34,"stage":3,"description":"Exorcise 34 curses in total","xp":239,"fragments":68},{"title":"The Timebound Hunter","type":"bossApproach","target":0,"stage":3,"description":"Continue the story","xp":252,"fragments":72},{"title":"Stabilize the Rift","type":"travel","target":470,"stage":3,"description":"Reach 470 meters from this chapter start","xp":265,"fragments":76},{"title":"Master the Impossible","type":"level","target":11,"stage":3,"description":"Reach level 11","xp":278,"fragments":80},{"title":"The Fractured Shrine","type":"travel","target":690,"stage":3,"description":"Reach 690 meters from this chapter start","xp":291,"fragments":84},{"title":"Chase the Timeline","type":"kills","target":37,"stage":3,"description":"Exorcise 37 curses in total","xp":304,"fragments":88},{"title":"Bend Cursed Energy","type":"skill","target":"domain","stage":3,"description":"Unlock domain in your skill tree","xp":317,"fragments":92},{"title":"The Last Temporal Lock","type":"kills","target":40,"stage":3,"description":"Exorcise 40 curses in total","xp":330,"fragments":96},{"title":"THE RIFT WARDEN","type":"lifeBoss","target":3,"stage":3,"description":"Defeat Rift Warden","xp":343,"fragments":100},{"title":"Legend of the Future","type":"training","target":5,"stage":4,"description":"Train your basic punches","xp":245,"fragments":68},{"title":"The Last Exorcists","type":"kills","target":42,"stage":4,"description":"Exorcise 42 curses in total","xp":258,"fragments":72},{"title":"Run to the Citadel","type":"travel","target":260,"stage":4,"description":"Reach 260 meters from this chapter start","xp":271,"fragments":76},{"title":"Night Falls Forever","type":"kills","target":44,"stage":4,"description":"Exorcise 44 curses in total","xp":284,"fragments":80},{"title":"The Reborn Enemy","type":"bossApproach","target":0,"stage":4,"description":"Continue the story","xp":297,"fragments":84},{"title":"Seal the Future Gate","type":"travel","target":470,"stage":4,"description":"Reach 470 meters from this chapter start","xp":310,"fragments":88},{"title":"The Final Training","type":"level","target":14,"stage":4,"description":"Reach level 14","xp":323,"fragments":92},{"title":"At the Edge of Time","type":"travel","target":690,"stage":4,"description":"Reach 690 meters from this chapter start","xp":336,"fragments":96},{"title":"The Last City Patrol","type":"kills","target":47,"stage":4,"description":"Exorcise 47 curses in total","xp":349,"fragments":100},{"title":"Your Own Domain","type":"skill","target":"mastery","stage":4,"description":"Unlock mastery in your skill tree","xp":362,"fragments":104},{"title":"What Remains of Us","type":"kills","target":50,"stage":4,"description":"Exorcise 50 curses in total","xp":375,"fragments":108},{"title":"THE FUTURE SOVEREIGN","type":"lifeBoss","target":4,"stage":4,"description":"Defeat The Future Sovereign","xp":388,"fragments":112}]};
const LIFE_STARTS=[200,1550,3220,4550,5900];
function currentLifeStage(){return Math.max(0,Math.min(4,Math.floor((p.campaignStep||0)/12)))}
function currentLifeArc(){return LIFE_ARCS[p.char]?.[currentLifeStage()]||LIFE_ARCS.yuji[0]}
function currentLifeStartingX(){return LIFE_STARTS[currentLifeStage()]}
function lifeBossName(stage=currentLifeStage()){return LIFE_ARCS[p.char]?.[stage]?.[3]||'Unknown Guardian'}
function spawnLifeBoss(){
 if((p.campaignStep||0)%12!==11)return;
 const stage=currentLifeStage();
 if((p.lifeBossWins||[]).includes(stage)||p.storyEnded)return;
 const x=Math.min(7120,LIFE_STARTS[stage]+900),h=90,hp=430+stage*400;
 enemies.push({id:820+stage,lifeBossStage:stage,lifeBossTitle:lifeBossName(stage),x,y:groundY(x)-h,w:68,h,vx:0,vy:0,hp,max:hp,type:'brute',cd:.7,wind:0,hurt:0,stun:0,dead:false,home:x});
}
function applyLifeStage(teleport=false){
 const stage=currentLifeStage(),arc=currentLifeArc(),colors=['#657b9c','#7880b0','#7768a5','#6f8b93','#a64c63'];
 ZONES=ZONES.map((z,i)=>({...z,name:i===zoneAt(LIFE_STARTS[stage])?arc[1]:z.name,sub:arc[0],color:colors[stage]}));
 if(teleport){p.x=LIFE_STARTS[stage];p.y=groundY(p.x)-p.h;p.vx=0;p.vy=0;p.checkpoint=p.x+65;p.maxJourneyX=p.x;p.chapterTravelStart=p.x;cam=Math.max(0,p.x-visibleWidth()*.5);terrainCameraY=groundY(p.x)}
 p.lifeStage=stage;
}
function lifeCutscene(stage,ending=false){
 if(!started)return;
 const arc=LIFE_ARCS[p.char][stage];if(!arc)return;
 paused=true;isolateGameMenu(true);$('#overlay').hidden=false;
 const headline=ending&&p.char==='gojo'?'THE END OF THE STRONGEST':ending?'A LEGACY WRITTEN IN CURSED ENERGY':'TIME SKIP · '+arc[0];
 const description=ending&&p.char==='gojo'?'Gojo fought Sukuna with everything he had. His strength was extraordinary, but the battle ends in his defeat and death. His students will carry his hopes forward.':arc[2];
 $('#panel').innerHTML='<div class="story-scene life-cutscene"><div class="eyebrow">'+(ending?'FINAL CHAPTER':'A NEW ERA BEGINS')+'</div><h1>'+headline+'</h1><div class="story-orb">✧</div><h2>'+arc[1]+'</h2><p>'+description+'</p><p class="muted">'+(ending?'The campaign is complete. You can review your adventures from the journal.':'Your next story chapter begins with a different area, enemies and quests.')+'</p><button id="lifeNext">'+(ending?'VIEW MY LEGACY':'CONTINUE THE STORY')+' →</button></div>';
 $('#lifeNext').onclick=()=>{if(ending)menu('journal');else resume()};
}
function finishLifeBoss(e){
 const stage=e.lifeBossStage;
 p.lifeBossWins??=[];if(!p.lifeBossWins.includes(stage))p.lifeBossWins.push(stage);
 say('STORY BOSS DEFEATED · '+e.lifeBossTitle);
 save();
}
function sideQuestsForStage(stage=currentLifeStage()){
 const names=p.char==='custom'?['Neon Distress Call','Future Relic Collector','Cyber-Curse Patrol','Prototype Experiments','Academy Community Service','The Hidden Timeline']:
 p.char==='gojo'?['Clan Favors','Extra Cursed Targets','Infinity Research','Safe Passage','Lost Student Search','The Strongest Challenge']:
 ['Help the Locals','Curse Cleanup','Find the Lost Relic','Extra Combat Practice','Protect the District','A Sorcerer’s Duty'];
 const k=stage;
 return [
  {id:k+':0',name:names[0],type:'kills',target:k*10+3,xp:135,coins:65},
  {id:k+':1',name:names[1],type:'travel',target:360,xp:140,coins:70},
  {id:k+':2',name:names[2],type:'kills',target:k*10+7,xp:190,coins:85},
  {id:k+':3',name:names[3],type:'level',target:Math.min(16,3+k*3),xp:215,coins:95},
  {id:k+':4',name:names[4],type:'cache',target:1,xp:165,coins:70},
  {id:k+':5',name:names[5],type:'boss',target:k,xp:325,coins:150}
 ];
}
function sideQuestComplete(q){
 if(q.type==='kills')return kills>=q.target;
 if(q.type==='travel')return (p.maxJourneyX||p.x)>=currentLifeStartingX()+q.target;
 if(q.type==='level')return p.level>=q.target;
 if(q.type==='cache')return opened.length>=q.target;
 if(q.type==='boss')return (p.lifeBossWins||[]).includes(q.target);
 return false;
}
function claimSideQuest(id){
 const q=sideQuestsForStage().find(x=>x.id===id);
 if(!q||!sideQuestComplete(q)||(p.sideQuestClaims||[]).includes(id))return;
 p.sideQuestClaims??=[];p.sideQuestClaims.push(id);p.coins+=q.coins;reward(q.xp);tone(760,.2);say('SIDE QUEST COMPLETE · '+q.name+' · +'+q.xp+' XP');save();menu('journal');
}
function sideQuestJournal(){
 return '<div class="campaign-journal"><h2>Optional Assignments</h2><p class="muted">These missions are optional and never block the main story. Complete them for bonus experience and fragments.</p><div class="campaign-list">'+sideQuestsForStage().map(q=>{const claimed=(p.sideQuestClaims||[]).includes(q.id),ready=sideQuestComplete(q);return '<div class="campaign-entry '+(claimed?'done':ready?'active':'pending')+'"><div><strong>'+q.name+'</strong><small>'+q.type.toUpperCase()+' · '+q.target+' · +'+q.xp+' XP · +'+q.coins+' fragments</small></div><button data-claim-side="'+q.id+'" '+(!ready||claimed?'disabled':'')+'>'+(claimed?'CLAIMED':ready?'CLAIM':'IN PROGRESS')+'</button></div>'}).join('')+'</div></div>';
}

function allCampaignMissions(){return LIFE_MISSIONS[p.char]||LIFE_MISSIONS.yuji}
function currentCampaignMission(){return allCampaignMissions()[Math.max(0,p.campaignStep||0)]||null}
function campaignMissionProgress(m){
 if(!m)return '';
 const target=m.target,origin=ORIGINS[p.char]||ORIGINS.yuji;
 if(m.type==='lifeBoss')return (p.lifeBossWins||[]).includes(m.target)?'Boss defeated':'Find and defeat '+lifeBossName(m.target);
 if(m.type==='bossApproach')return Math.max(0,Math.round((p.maxJourneyX||p.x)-currentLifeStartingX()))+' / 540 meters';
 if(m.type==='elite')return (p.eliteDefeated||[]).includes(m.target)?'Commander defeated':'Defeat '+ELITE_TITLES[currentOrigin][m.target];
 if(m.type==='ritual')return (p.rituals||[]).includes(m.target)?'Seal purified':'Press E at cursed seal '+(m.target+1);
 if(m.type==='skill')return learnedSkill(m.target)?'Technique mastered':'Unlock '+m.target+' in the skill tree';
 if(m.type==='training')return p.char==='sukuna'?Math.min(kills,3)+' / 3 hunters':Math.min(p.trainingHits||0,target)+' / '+target+' practice hits';
 if(m.type==='kills')return Math.min(kills,target)+' / '+target+' curses';
 if(m.type==='travel')return Math.max(0,Math.round((p.maxJourneyX||p.x)-currentLifeStartingX()))+' / '+target+' meters';
 if(m.type==='cache')return Math.min(opened.length,target)+' / '+target+' caches';
 if(m.type==='level')return p.level+' / '+target+' levels';
 if(m.type==='boss')return bossDead?'Guardian defeated':'Guardian undefeated';
 return '';
}
function isCampaignMissionComplete(m){
 if(!m)return false;
 switch(m.type){
  case 'training':return p.char==='sukuna'?kills>=3:(p.trainingHits||0)>=m.target;
  case 'kills':return kills>=m.target;
  case 'travel':return (p.maxJourneyX||p.x)>=currentLifeStartingX()+m.target;
 case 'bossApproach':return (p.maxJourneyX||p.x)>=currentLifeStartingX()+540;
 case 'lifeBoss':return (p.lifeBossWins||[]).includes(m.target);
 case 'elite':return (p.eliteDefeated||[]).includes(m.target);
 case 'ritual':return (p.rituals||[]).includes(m.target);
 case 'skill':return learnedSkill(m.target);
  case 'cache':return opened.length>=m.target;
  case 'level':return p.level>=m.target;
  case 'boss':return bossDead;
  default:return false;
 }
}
function updateCampaignMissions(){
 if(trial.active)return;
 const m=currentCampaignMission();if(!m||!isCampaignMissionComplete(m))return;
 const previousStage=currentLifeStage();p.campaignStep=Math.min(CAMPAIGN_TOTAL,(p.campaignStep||0)+1);
 if(p.campaignStep%12===11)spawnLifeBoss();
 p.coins+=m.fragments;reward(m.xp);
 burst(p.x+17,p.y+20,CAST[p.char].color,25,130);
 say('QUEST COMPLETE · '+m.title+' · +'+m.xp+' XP · +'+m.fragments+' fragments');
 if(p.campaignStep>=CAMPAIGN_TOTAL){p.storyEnded=true;save();lifeCutscene(4,true);return}
 if(currentLifeStage()!==previousStage){applyLifeStage(true);opened=[];setupOrigin(p.char);spawn();if(p.char==='sukuna')for(const e of enemies){if(e.type==='dummy')continue;e.hp=Math.ceil(e.hp*1.6);e.max=e.hp}zoneIndex=zoneAt(p.x);save();lifeCutscene(currentLifeStage());return}
 save();
}
function campaignJournal(){
 const missions=allCampaignMissions();
 const step=p.campaignStep||0,current=missions[step];
 return lifetimeMapMarkup()+'<div class="campaign-journal"><div class="eyebrow">LIFETIME STORY · '+currentLifeArc()[0]+'</div><h2>'+currentLifeArc()[1]+'</h2><p>'+currentLifeArc()[2]+'</p></div><div class="campaign-journal"><div class="eyebrow">MAIN STORY · CHAPTER '+(currentLifeStage()+1)+'/5</div><h2>'+ORIGINS[p.char].name+'</h2><p>'+(current?'NEXT: '+current.description+' · '+campaignMissionProgress(current):'All 60 life-story missions complete!')+'</p><div class="campaign-meter"><span style="width:'+(Math.min(CAMPAIGN_TOTAL,step)/CAMPAIGN_TOTAL*100)+'%"></span></div><div class="campaign-list">'+missions.map((m,i)=>'<div class="campaign-entry '+(i<step?'done':i===step?'active':'pending')+'"><b>'+(i<step?'✓':String(i+1).padStart(2,'0'))+'</b><div><strong>'+m.title+'</strong><small>'+m.description+(i===step?' · '+campaignMissionProgress(m):'')+'</small></div><span>+'+m.xp+' XP</span></div>').join('')+'</div></div>';
}

function objective(){if(trial.active)return 'Cursed gauntlet · clear wave '+trial.wave+' of 3.';return quest<4?storyObjective(): 'The veil is lifted. Find every hidden cache.'}

const FOUNDATION_SKILLS=[
 {id:'ceControl',name:'Cursed Energy Awareness',level:1,cost:1,need:[],mission:'Land five punches on the training dummy (Sukuna: defeat three hunters alone)',test:()=>p.char==='sukuna'?kills>=3:p.trainingHits>=5,desc:'Unlock cursed energy generation and energy regeneration.'},
 {id:'dash',name:'Cursed Dash',level:2,cost:1,need:['ceControl'],mission:'Reach level 2 by exorcising curses',test:()=>p.level>=2,desc:'Shift becomes a fast invulnerable cursed dash.'},
 {id:'technique',name:'Innate Technique',level:3,cost:1,need:['ceControl'],mission:'Reach level 3 and survive combat training',test:()=>p.level>=3,desc:'Unlock K: your first character-specific cursed technique.'},
 {id:'doubleJump',name:'Air Step',level:4,cost:1,need:['dash'],mission:'Reach level 4',test:()=>p.level>=4,desc:'Unlock the second jump while airborne.'},
 {id:'focusTraining',name:'Energy Flow Mastery',level:5,cost:1,need:['technique'],mission:'Reach level 5',test:()=>p.level>=5,desc:'Increase cursed-energy regeneration by 50%.'},
 {id:'reinforcedGuard',name:'Cursed Reinforcement',level:5,cost:1,need:['ceControl'],mission:'Reach level 5',test:()=>p.level>=5,desc:'Take 15% less damage.'},
 {id:'comboMastery',name:'Perfect Strike',level:6,cost:1,need:['technique'],mission:'Reach level 6',test:()=>p.level>=6,desc:'Increase melee damage by 25%.'},
 {id:'advanced',name:'Advanced Technique',level:7,cost:2,need:['technique'],mission:'Reach level 7',test:()=>p.level>=7,desc:'Unlock R: your signature advanced attack.'},
 {id:'rct',name:'Reverse Cursed Technique',level:8,cost:2,need:['focusTraining'],mission:'Reach level 8',test:()=>p.level>=8,desc:'Unlock H: convert cursed energy into healing.'},
 {id:'domain',name:'Domain Expansion',level:12,cost:3,need:['advanced','rct'],mission:'Reach level 12 and master advanced attacks and RCT',test:()=>p.level>=12,desc:'Unlock L: your personal Domain Expansion.'},
 {id:'mastery',name:'Maximum Technique',level:16,cost:3,need:['domain','comboMastery'],mission:'Reach level 16',test:()=>p.level>=16,desc:'Final branch: 40% more damage.'}
];
const SKILL_QUEST_GATES={ceControl:1,dash:3,technique:5,doubleJump:6,focusTraining:9,reinforcedGuard:7,comboMastery:8,advanced:19,rct:31,domain:43,mastery:55};
function questSkillReady(id){return (p.campaignStep||0)>=(SKILL_QUEST_GATES[id]||0)}
function learnedSkill(id){return !!(p.learned?.[id]||p[id]===true)}
function skillTreeMarkup(){
 const available=FOUNDATION_SKILLS.map(node=>{
  const owned=learnedSkill(node.id),missing=node.need.filter(x=>!learnedSkill(x));
  const questReady=questSkillReady(node.id);const ready=!owned&&questReady&&p.level>=node.level&&node.test()&&!missing.length&&p.points>=node.cost;
  return '<button class="skill-node '+(owned?'unlocked':ready?'ready':'locked')+'" data-skill="'+node.id+'" '+(ready?'':'disabled')+'><small>LEVEL '+node.level+' · '+node.cost+' POINT'+(node.cost>1?'S':'')+'</small><strong>'+node.name+'</strong><span>'+node.desc+'</span><em>'+(owned?'✓ LEARNED':!questReady?'COMPLETE ORIGIN QUEST '+SKILL_QUEST_GATES[node.id]:missing.length?'REQUIRES '+missing.join(', ').toUpperCase():!node.test()?'MISSION: '+node.mission:p.points<node.cost?'NOT ENOUGH POINTS':'UNLOCK AVAILABLE')+'</em></button>';
 });
 return '<div class="skill-intro"><h2>PATH OF THE SORCERER</h2><p>Start with crouch, sprint and punches. Train, complete missions, and earn points from leveling. Nothing powerful comes free.</p><strong>'+p.points+' POINTS AVAILABLE</strong><p>Training dummy punches: '+Math.min(p.trainingHits||0,5)+' / 5'+(p.char==='sukuna'?' · Heian hunters defeated: '+Math.min(kills,3)+' / 3':'')+'</p></div><div class="skill-tree-grid">'+available.join('')+'</div>';
}
function unlockSkill(id){
 const node=FOUNDATION_SKILLS.find(n=>n.id===id);
 if(!node||!questSkillReady(id)||learnedSkill(id)||p.level<node.level||p.points<node.cost||!node.test()||node.need.some(x=>!learnedSkill(x)))return;
 p.points-=node.cost;p.learned??={};p.learned[id]=true;
 if(['advanced','rct','domain','mastery','focusTraining','reinforcedGuard','comboMastery'].includes(id))p[id]=true;
 if(id==='technique')p.skill=true;
 if(id==='ceControl')p.ce=50;
 burst(p.x+17,p.y+30,CAST[p.char].color,25);tone(740,.2);save();menu('techniques');
}

const UPDATE_HISTORY=[{"v":"2.5.0","title":"Sorcerer Switching & Update Center","items":["Switch sorcerers from the roster anywhere outside a combat trial.","Each sorcerer keeps separate story progress, level, skills and location.","New update notification and changelog in the launcher and field manual."]},{"v":"2.4.0","title":"Expanded Campaign","items":["60 campaign objectives across five sorcerers.","New environmental decorations and quest journal tracker."]},{"v":"2.3.0","title":"Character Preview","items":["Higher-detail custom-character preview."]},{"v":"2.2.0","title":"Creator Expansion","items":["More markings, accessories and eye choices."]},{"v":"2.1.0","title":"Character Origins","items":["Distinct character starting areas and world themes."]},{"v":"2.0.3","title":"Story Objective Fix","items":["Restored the missing objective function."]}];
function updateLogMarkup(){
 return '<div class="campaign-journal"><div class="eyebrow">VEILBOUND PATCH HISTORY</div><h2>What’s New</h2><p class="muted">Latest improvements and bug fixes. The loader also checks for updates whenever it fetches the game.</p>'+UPDATE_HISTORY.map((u,i)=>'<div class="story-record" style="display:block;text-align:left"><strong style="color:#e7b6f9">'+u.v+' · '+u.title+'</strong><ul style="margin:9px 0 2px;padding-left:20px">'+u.items.map(a=>'<li style="margin:5px 0">'+a+'</li>').join('')+'</ul></div>').join('')+'</div>';
}

function menu(tab='techniques'){if(!started)return;paused=true;Object.keys(keys).forEach(k=>keys[k]=false);isolateGameMenu(true);activeTab=tab;$('#overlay').hidden=false;const cast=CAST[p.char];let content='';if(tab==='techniques')content=skillTreeMarkup();if(tab==='journal')content=campaignJournal()+sideQuestJournal()+'<p class="eyebrow">ACTIVE ASSIGNMENT</p><h2>'+['A new beginning','Clear the outskirts','Follow the residuals','Break the veil','Dawn beyond the veil'][quest]+'</h2><p>'+objective()+'</p><div class="journal-stats"><div><b>'+kills+'</b>Curses exorcised</div><div><b>'+opened.length+'/6</b>Hidden caches</div><div><b>'+p.coins+'</b>Cursed fragments</div></div><p class="muted">Lanterns restore health, save your progress, and become your rescue point. Press E near a lantern or cache. Hold S + Space to drop through a rooftop.</p>';if(tab==='journal')content+='<div class="tree"><h3>PERSONAL STORY · '+CAST[p.char].name+'</h3>'+CHAPTERS[p.char].map((a,i)=>'<button data-chapter="'+i+'" '+(!p.storySeen?.includes(i)?'disabled':'')+'><small>CHAPTER '+(i+1)+'</small><strong>'+a[0]+'</strong><span>'+(p.storySeen?.includes(i)?'REPLAY CUTSCENE':'LOCKED')+'</span></button>').join('')+'</div>';if(tab==='journal')content+='<div class="tree"><h3>Personal encounters</h3>'+PERSONAL_EVENTS[p.char].map((event,i)=>'<div class="story-record"><strong>'+event[0]+'</strong><small>'+(p.storyChoices?.[i]?'COMPLETED · '+p.storyChoices[i].toUpperCase():p.storyMilestones?.includes(i)?'IN PROGRESS':'UNDISCOVERED')+'</small></div>').join('')+'</div>';if(tab==='journal'&&bossDead)content+='<button id="trialButton">Cursed gauntlet · '+p.trialsWon+' victories ↗</button>';if(tab==='map')content=originMapMarkup();if(tab==='roster'){content='<p class="muted">Choose a sorcerer at any time. Each one has their own story, training, location and saved progress. Switching returns you to that sorcerer’s world.</p><div class="choices">'+Object.entries(CAST).map(([key,v])=>'<button class="character" data-switch="'+key+'" style="--accent:'+v.color+'" '+(key===p.char||trial.active?'disabled':'')+'><span class="char-role">'+v.title+'</span><img src="'+(ART[key]||ART.yuji)+'" alt="'+v.name+'"><strong>'+v.name+'</strong><span>'+v.passive+'</span><b>'+(key===p.char?'CURRENT SORCERER':trial.active?'LEAVE TRIAL TO SWITCH':'SWITCH TO '+(ORIGINS[key]?.name||'NEW ORIGIN'))+'</b></button>').join('')+'</div>'}if(tab==='roster')content+=wardrobeMarkup();if(tab==='supplies'){const atLantern=shrines.some(s=>Math.abs(p.x-s.x)<100&&Math.abs(p.y+p.h-groundY(s.x))<100);content='<p class="muted">Spend cursed fragments at a lantern. Carry up to five of each supply.</p><div class="supply-balance">'+p.coins+' <span>CURSED FRAGMENTS</span></div><div class="supply-grid"><div><div class="supply-icon heal">✚</div><h2>Recovery talisman</h2><p>Restores 45% of maximum health plus 30.<br>Press <kbd>1</kbd> in the field.</p><small>Carried: '+p.medkits+' / 5</small><button data-restock="medkits" '+(!atLantern||p.coins<30||p.medkits>=5?'disabled':'')+'>Restock · 30 fragments</button></div><div><div class="supply-icon energy">◇</div><h2>Cursed energy tonic</h2><p>Restores 55 cursed energy.<br>Press <kbd>2</kbd> in the field.</p><small>Carried: '+p.tonics+' / 5</small><button data-restock="tonics" '+(!atLantern||p.coins<35||p.tonics>=5?'disabled':'')+'>Restock · 35 fragments</button></div></div><p class="muted">'+(atLantern?'Lantern link established. Supplies are available.':'Return to a lantern to restock supplies.')+'</p>'}if(tab==='updates')content=updateLogMarkup();if(tab==='settings')content='<h2>Make it yours</h2><div class="settings"><button id="sound">Sound effects: '+(sound?'ON':'OFF')+'</button><button id="shake">Screen shake: '+(settings.shake?'ON':'OFF')+'</button><button id="zoom">Camera: '+(cameraZoom()===1?'WIDE':cameraZoom()===1.4?'CLOSE':'STANDARD')+'</button><button id="save">Save progress</button><button id="exportSave">Export save backup</button><button id="importSave">Import save backup</button><input type="file" id="saveFile" accept=".json,application/json" hidden></div><p class="muted">A / D or arrows: move · Space: double jump · Shift: dash<br>J / left mouse: combo · K / right mouse: technique · R: advanced · L: domain<br>E: interact · M: map · Tab: techniques · Esc: pause<br>Progress autosaves every 12 seconds and at lanterns. Export a backup to move your journey between browsers or devices.</p>';$('#panel').innerHTML='<div class="eyebrow">'+cast.name+' · LEVEL '+p.level+'</div><div class="menu-heading"><h1>Field manual</h1><button id="resume">Resume ↗</button></div><nav>'+['techniques','roster','supplies','journal','map','updates','settings'].map(t=>'<button data-tab="'+t+'" class="'+(t===tab?'selected':'')+'">'+t+'</button>').join('')+'</nav>'+content;$('#resume').onclick=resume;if(tab==='journal'&&bossDead)$('#trialButton').onclick=trialBriefing;$('#panel').querySelectorAll('[data-outfit]').forEach(b=>b.onclick=()=>equipOutfit(b.dataset.outfit));$('#resume').focus();$('#panel').querySelectorAll('[data-restock]').forEach(b=>b.onclick=()=>restock(b.dataset.restock));$('#panel').querySelectorAll('[data-switch]').forEach(b=>b.onclick=()=>switchCharacter(b.dataset.switch));$('#panel').querySelectorAll('[data-claim-side]').forEach(b=>b.onclick=()=>claimSideQuest(b.dataset.claimSide));$('#panel').querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>menu(b.dataset.tab));$('#panel').querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>buy(b.dataset.buy));$('#panel').querySelectorAll('[data-skill]').forEach(b=>b.onclick=()=>unlockSkill(b.dataset.skill));$('#panel').querySelectorAll('[data-chapter]').forEach(b=>b.onclick=()=>{const n=Number(b.dataset.chapter);if(p.storySeen?.includes(n)){p.storySeen=p.storySeen.filter(v=>v!==n);storyScene(n)}});if(tab==='settings'){$('#sound').onclick=()=>{sound=!sound;save();menu(tab)};$('#shake').onclick=()=>{settings.shake=!settings.shake;save();menu(tab)};$('#zoom').onclick=()=>{settings.zoom=cameraZoom()===1?1.2:cameraZoom()===1.2?1.4:1;save();menu(tab)};$('#save').onclick=()=>save(true);if(trial.active){const leave=document.createElement('button');leave.textContent='Leave combat trial';leave.onclick=()=>{finishTrial(false);resume()};$('#panel').appendChild(leave)};$('#exportSave').onclick=exportBackup;$('#importSave').onclick=()=>$('#saveFile').click();$('#saveFile').onchange=()=>importBackup($('#saveFile').files[0])}}
function trialBriefing(){if(!bossDead)return;paused=true;isolateGameMenu(true);$('#overlay').hidden=false;$('#panel').innerHTML='<div class="eyebrow">POST-STORY ASSIGNMENT</div><h1>The cursed gauntlet</h1><p class="muted">Three waves. No lanterns. One sorcerer.<br>Survive the curse packs and defeat the Veilkeeper’s echo. You return to your current location after the trial.</p><div class="journal-stats"><div><b>3</b>Combat waves</div><div><b>150</b>Victory fragments</div><div><b>'+p.trialsWon+'</b>Trials completed</div></div><p class="muted">You enter with full health and energy. Supplies are allowed. Normal progress is safe, and you can leave through Settings.</p><button id="beginTrial">Enter the gauntlet ↗</button> <button id="cancelTrial">Back to journal</button>';$('#beginTrial').onclick=beginTrial;$('#cancelTrial').onclick=()=>menu('journal');$('#beginTrial').focus()}
function beginTrial(){if(!bossDead||trial.active)return;trial={active:true,wave:1,timer:0,cleared:false,backup:enemies,returnX:p.x,returnY:p.y};p.x=6500;p.y=542;p.hp=maxHP();p.ce=100;p.vx=p.vy=0;p.inv=2;p.attack=p.castTime=p.hurtTime=0;p.scd=p.rcd=p.dcd=0;effects=[];shots=[];pendingStrikes=[];domainTime=0;cam=Math.max(0,6400-visibleWidth()*.1);spawnTrialWave();resume();say('CURSED GAUNTLET · WAVE 1 / 3')}
function spawnTrialWave(){enemies=[];const count=trial.wave===1?3:trial.wave===2?5:2;for(let i=0;i<count;i++){const type=trial.wave===3?'spitter':i%3===2?'brute':i%2?'spitter':'crawler',w=type==='brute'?52:38,hh=type==='brute'?76:48,hp=65+p.level*12+trial.wave*15;enemies.push({id:200+i,x:6800+i*110,y:612-hh,w,h:hh,vy:0,hp,max:hp,type,cd:1+i*.25,wind:0,hurt:0,stun:0,dead:false,home:6800+i*110,trial:true})}if(trial.wave===3)enemies.push({id:299,x:7140,y:502,w:100,h:110,vy:0,hp:1800,max:1800,type:'boss',cd:2,wind:0,hurt:0,stun:0,dead:false,home:7140,phase:1,trial:true});trial.cleared=false;trial.timer=0;shots=[];domainTime=0}
function finishTrial(won){if(!trial.active)return;const old=trial;trial.active=false;enemies=old.backup;p.x=old.returnX;p.y=old.returnY;p.vx=p.vy=0;p.attack=p.castTime=p.hurtTime=p.dash=0;p.inv=2;shots=[];effects=[];pendingStrikes=[];domainTime=0;cam=Math.max(0,Math.min(Math.max(0,7600-visibleWidth()),p.x-visibleWidth()*.5));if(won){p.trialsWon++;p.coins+=150;reward(180);say('GAUNTLET COMPLETE · +150 FRAGMENTS · +180 XP');tone(900,.4)}else say('Trial ended. Your journey is safe.');save();updateHUD()}
function updateTrial(dt){if(!trial.active)return;p.x=Math.max(6350,Math.min(7480,p.x));if(enemies.every(e=>e.dead)&&!trial.cleared){trial.cleared=true;trial.timer=2;say('WAVE '+trial.wave+' CLEARED')}if(trial.cleared){trial.timer-=dt;if(trial.timer<=0){if(trial.wave===3){finishTrial(true);return}trial.wave++;spawnTrialWave();say('CURSED GAUNTLET · WAVE '+trial.wave+' / 3')}}}
function restock(type){const cost=type==='medkits'?30:type==='tonics'?35:Infinity;if(!shrines.some(s=>Math.abs(p.x-s.x)<100&&Math.abs(p.y+p.h-groundY(s.x))<100)||p.coins<cost||p[type]>=5)return;p.coins-=cost;p[type]++;tone(600,.1);save();menu('supplies')}
function useSupply(type){if(paused||p.itemCd>0)return;if(!['medkits','tonics'].includes(type)||p[type]<=0){say('No supplies left. Restock at a lantern.');return}if(type==='medkits'&&p.hp>=maxHP()||type==='tonics'&&p.ce>=100){say(type==='medkits'?'Health is already full.':'Cursed energy is already full.');return}p[type]--;p.itemCd=1.2;const before=type==='medkits'?p.hp:p.ce;if(type==='medkits')p.hp=Math.min(maxHP(),p.hp+maxHP()*.45+30);else p.ce=Math.min(100,p.ce+55);const color=type==='medkits'?'#b5edc0':'#a6e9ff';float('+'+Math.round((type==='medkits'?p.hp:p.ce)-before)+(type==='medkits'?' HP':' CE'),p.x,p.y-25,color);burst(p.x+17,p.y+35,color,25,120);effects.push({type:'restore',x:p.x+17,y:p.y+35,t:.6,max:.6,color});tone(800,.2);save();updateHUD()}
const OUTFIT_NAMES=['Signature','Field uniform','Awakened'];
const OUTFIT_COLORS={
 yuji:[{}, {cloth:'#3b3544',mid:'#5c4c60',light:'#8a7183',accent:'#a64e67',accentLight:'#dc8091'}, {cloth:'#8e3f55',mid:'#bf5e6a',light:'#eb9a91',shade:'#48293d',accent:'#272f46',accentLight:'#53617b',shoe:'#b7474c'}],
 megumi:[{}, {cloth:'#203d40',mid:'#38615f',light:'#64918b',accent:'#d0bf8f'}, {cloth:'#25203c',mid:'#4a4269',light:'#797397',accent:'#dfc79c'}],
 gojo:[{}, {cloth:'#181f2c',mid:'#2d394b',light:'#4c6175'}, {cloth:'#d5dbe0',mid:'#a0b4c4',light:'#f0f3f3',shade:'#718a9d',shoe:'#31485f'}],
 sukuna:[{}, {cloth:'#302538',mid:'#584257',light:'#87627a',accent:'#b34457',accentLight:'#df8a93'}, {cloth:'#86384b',mid:'#b2666c',light:'#df9c91',shade:'#4f273c',accent:'#e1cdb8',accentLight:'#fff0da'}]
};
function rebuildCharacter(char){const chosen=Number(p.outfits?.[char])||0;PALETTES[char]={...BASE_PALETTES[char],...(OUTFIT_COLORS[char][chosen]||{})};const list=(state,n,variant=0)=>Array.from({length:n},(_,i)=>makeFrame(char,state,i*Math.PI*2/(state==='attack'||state==='cast'?n-1:n),variant));sprites[char]={idle:list('idle',4),walk:list('walk',12),jump:list('jump',2),fall:list('fall',2),dash:list('dash',4),attack:[...list('attack',6,0),...list('attack',6,1),...list('attack',6,2)],cast:list('cast',8),hover:list('cast',8),hurt:list('hurt',3)};ART[char]=sprites[char].idle[0].toDataURL()}
function rebuildCustomSprite(){
 const base=p.customStyle||'yuji',original=PALETTES[base];
 if(!original||!sprites[base])return;
 PALETTES.custom={...original,hair:p.customHair||'#e5bcd7',hairLight:p.customHair||'#e5bcd7',hairShade:p.customHair||'#e5bcd7',skin:p.customSkin||'#e9ad8d',skinLight:p.customSkin||'#e9ad8d',eye:p.customEyes||'#71e5f4',cloth:p.customOutfit||'#30456d',mid:p.customOutfit||'#30456d',accent:p.customColor||'#da9dff',accentLight:p.customColor||'#da9dff',edge:p.customTrim||'#f2ba76'};
 const list=(state,n,variant=0)=>Array.from({length:n},(_,i)=>makeFrame('custom',state,i*Math.PI*2/(state==='attack'||state==='cast'?n-1:n),variant));
 sprites.custom={idle:list('idle',4),walk:list('walk',12),jump:list('jump',2),fall:list('fall',2),dash:list('dash',4),attack:[...list('attack',6,0),...list('attack',6,1),...list('attack',6,2)],cast:list('cast',8),hover:list('cast',8),hurt:list('hurt',3)};
 ART.custom=sprites.custom.idle[0].toDataURL();
}
function applyOutfits(){if(!p.outfits||typeof p.outfits!=='object')p.outfits={};if(!Array.isArray(p.outfitUnlocks))p.outfitUnlocks=[];for(const char of ['yuji','sukuna','megumi','gojo'])rebuildCharacter(char);rebuildCustomSprite();portraitKey=''}
function equipOutfit(index){index=Number(index);if(!Number.isInteger(index)||index<0||index>2||!shrines.some(s=>Math.abs(p.x-s.x)<100&&Math.abs(p.y+p.h-groundY(s.x))<100))return;const key=p.char+'/'+index,owned=index===0||p.outfitUnlocks.includes(key);if(!owned){if(p.coins<80)return;p.coins-=80;p.outfitUnlocks.push(key)}p.outfits[p.char]=index;rebuildCharacter(p.char);portraitKey='';tone(700,.16);save();updateHUD();menu('roster')}
function wardrobeMarkup(){const current=Number(p.outfits?.[p.char])||0,near=shrines.some(s=>Math.abs(p.x-s.x)<100&&Math.abs(p.y+p.h-groundY(s.x))<100);return '<div class="wardrobe"><div class="eyebrow">'+CAST[p.char].name+' · WARDROBE</div><p class="muted">Cosmetic uniforms. Your abilities and stats stay the same.</p><div class="outfit-options">'+OUTFIT_NAMES.map((name,index)=>{const owned=index===0||p.outfitUnlocks.includes(p.char+'/'+index),colors={...BASE_PALETTES[p.char],...OUTFIT_COLORS[p.char][index]};return '<button data-outfit="'+index+'" '+(!near||current===index||!owned&&p.coins<80?'disabled':'')+'><span class="outfit-swatches"><i style="background:'+colors.cloth+'"></i><i style="background:'+colors.mid+'"></i><i style="background:'+colors.accent+'"></i></span><strong>'+name+'</strong><small>'+(current===index?'EQUIPPED':owned?'Equip uniform':'Unlock · 80 fragments')+'</small></button>'}).join('')+'</div></div>'}
function switchCharacter(char){
 if(!started||!CAST[char]||char===p.char||trial.active)return;
 // Keep each character's story and training independent.
 const profiles={...(p.campaignProfiles||{})};
 const oldChar=p.char;
 const {campaignProfiles:discardProfiles,...outgoing}=p;
 profiles[oldChar]={p:outgoing,quest,kills,opened:[...opened],bossDead};
 const incoming=profiles[char];
 const fresh=INITIAL();
 p={...fresh,...(incoming?.p||{}),campaignProfiles:profiles,char};
 p.learned={...(p.learned||{})};
 if(char==='custom'){
  // Preserve the appearance created on the selection screen for new custom profiles.
  if(!incoming){
   Object.assign(p,{customName:customDraft.name,customStyle:customDraft.style,customColor:customDraft.color,customHair:customDraft.hair,customOutfit:customDraft.outfit,customSkin:customDraft.skin,customEyes:customDraft.eyes,customHairStyle:customDraft.hairStyle,customBuild:customDraft.build,customAccessory:customDraft.accessory,customMark:customDraft.mark,customEyesShape:customDraft.eyesShape,customTrim:customDraft.trim});
  }else{
   Object.assign(customDraft,{name:p.customName||customDraft.name,style:p.customStyle||'yuji',color:p.customColor||customDraft.color,hair:p.customHair||customDraft.hair,outfit:p.customOutfit||customDraft.outfit,skin:p.customSkin||customDraft.skin,eyes:p.customEyes||customDraft.eyes,hairStyle:p.customHairStyle||0,build:p.customBuild||0,accessory:p.customAccessory||0,mark:p.customMark||0,eyesShape:p.customEyesShape||0,trim:p.customTrim||customDraft.trim});
  }
  syncCustom();
 }
 quest=incoming?.quest??(char==='sukuna'?2:0);
 kills=incoming?.kills??0;
 opened=Array.isArray(incoming?.opened)?[...incoming.opened]:[];
 bossDead=!!incoming?.bossDead;
 if(!incoming){
  p.x=ORIGINS[char].start;
  p.y=groundY(p.x)-p.h;
  p.checkpoint=p.x+80;
  p.hp=char==='sukuna'?95:maxHP();
  p.ce=0;
 }
 p.vx=0;p.vy=0;p.attack=0;p.castTime=0;p.dash=0;p.inv=1;
 p.hoverTime=0;p.hovering=false;p.hurtTime=0;
 p.scd=p.rcd=p.dcd=p.passiveCd=0;
 setupOrigin(char);applyLifeStage(!incoming);applyOutfits();spawn();
 if(char==='sukuna')for(const e of enemies){if(e.type==='dummy')continue;e.hp=Math.ceil(e.hp*1.65);e.max=e.hp;e.cd=Math.max(.3,e.cd*.7)}
 shots=[];effects=[];particles=[];texts=[];pendingStrikes=[];
 domainTime=0;zoneIndex=zoneAt(p.x);terrainCameraY=groundY(p.x);
 cam=Math.max(0,p.x-visibleWidth()*.5);
 Object.keys(keys).forEach(k=>keys[k]=false);
 save();resume();updateHUD();
 say('Switched to '+CAST[char].name+' · '+ORIGINS[char].name);
}
function buy(type){const cost=type==='mastery'?3:((type==='domain'||type==='rct')?2:1);if(p.points<cost)return;if((['focusTraining','reinforcedGuard','comboMastery'].includes(type)&&(p[type]||p.level<({focusTraining:2,reinforcedGuard:3,comboMastery:6}[type])))||(type==='advanced'&&p.level<3)||(type==='domain'&&p.level<8)||(type==='rct'&&(p.rct||p.level<5))||(type==='mastery'&&(p.mastery||p.level<10||!p.domain||!p.rct))||(type==='advanced'&&p.advanced)||(type==='domain'&&(p.domain||!p.advanced))||(['power','vitality'].includes(type)&&p[type]>=5))return;p.points-=cost;if(type==='power'||type==='vitality'){p[type]++;if(type==='vitality')p.hp=Math.min(maxHP(),p.hp+30)}else p[type]=true;tone(660,.2);save();menu()}
function resume(){paused=false;isolateGameMenu(false);$('#overlay').hidden=true;c.focus()}
function openInstructorDialogue(){
 paused=true;isolateGameMenu(true);$('#overlay').hidden=false;const cast=CAST[p.char];
 const voice={custom:'This is my first mission. I will make it count.',yuji:'People are still out there. I’ll clear a path.',megumi:'The residuals lead east. I’ll follow them.',gojo:'A veil over an entire district? Someone wants attention.',sukuna:'If you want those curses gone, stay out of my way.'};
 const ready=quest===1&&kills>=5;
 const line=quest===0?'A curtain has sealed the district. Our scouts found curses gathering along the road. Clear five of them, then return here. Start with the training dummy if you need to get your footing.':quest===1?(ready?'The residuals are thinning. Good work. Our scouts traced their source to an abandoned shrine beyond the station. Your next assignment is to find it.':'Five curses. That is your assignment. Watch for amber attack warnings, dodge through danger with Shift, and use your technique to create an opening.'):quest===2?'Follow the road east: through Whispering Grove, past Shibuya Station, and into the shrine grounds. Rest at the lanterns along the way. You can change sorcerers at any lantern.':quest===3?'The Veilkeeper is sustaining the curtain. Its armor fractures as it weakens, but its attacks become faster. Leave energy for a dodge, and watch its hands.':'The curtain has fallen. The district is safe for now. There are still hidden caches among the rooftops. Keep training; the next assignment will come.';
 $('#panel').innerHTML='<div class="dialogue-panel"><div class="eyebrow">JUJUTSU HIGH · FIELD SUPERVISION</div><h1>Before you cross the veil.</h1><div class="dialogue-body"><img src="'+(ART.supervisor||ART.gojo)+'" alt="Field supervisor"><div><small class="eyebrow">FIELD SUPERVISOR</small><p>'+line+'</p><blockquote><b>'+cast.name+'</b><br>“'+voice[p.char]+'”</blockquote></div></div><div class="dialogue-actions"><button id="dialogueAction">'+(quest===0?'Accept assignment':ready?'Report success · +170 XP +50 fragments':'Return to the field')+'</button><button id="dialogueRoster">Change sorcerer</button></div><p class="muted">Health and cursed energy restored. School Gate is now your checkpoint.</p></div>';
 $('#dialogueAction').onclick=()=>{if(quest===0){quest=1;say('Assignment accepted · Exorcise five curses.')}else if(ready){quest=bossDead?4:2;reward(170);p.coins+=50;say('Assignment complete · Follow the residuals east.')}save();resume();updateHUD()};$('#dialogueRoster').onclick=()=>menu('roster');$('#dialogueAction').focus();
}
function prepareSupervisor(){
 const original=PALETTES.gojo;PALETTES.gojo={...original,cloth:'#202b3c',mid:'#34455b',light:'#52647a',hair:'#293449',hairLight:'#47556a',hairShade:'#162134'};
 const frames=[];for(let i=0;i<4;i++){const phase=i*Math.PI/2,frame=makeFrame('gojo','idle',phase),g=frame.getContext('2d'),bob=Math.sin(phase)*.7;
  g.fillStyle='#e7bda2';g.fillRect(30,Math.round(25-bob),21,7);g.strokeStyle='#1b2639';g.lineWidth=1;g.strokeRect(33,Math.round(26-bob),7,4);g.strokeRect(43,Math.round(26-bob),7,4);g.fillStyle='#1b2639';g.fillRect(40,Math.round(27-bob),3,1);
  g.fillStyle='#e1e5e5';g.beginPath();g.moveTo(30,Math.round(34-bob));g.lineTo(46,Math.round(34-bob));g.lineTo(41,Math.round(49-bob));g.closePath();g.fill();g.fillStyle='#6d4c68';g.fillRect(39,Math.round(38-bob),3,12);
  g.fillStyle='#7f6d57';g.fillRect(45,53,12,17);g.fillStyle='#d3c5a8';g.fillRect(46,55,10,12);frames.push(frame)}PALETTES.gojo=original;const idle=frames;sprites.supervisor={idle};ART.supervisor=idle[0].toDataURL();
}
function drawTrainingDummy(e){const x=e.x+e.w/2,y=e.y+e.h;const flash=e.hurt>0;rect(x-5,y-72,10,72,'#7b5f49');rect(x-26,y-48,52,8,'#765841');rect(x-11,y-3,23,4,'#ab8b68');poly([[x-15,y-64],[x+15,y-64],[x+19,y-26],[x-18,y-26],['A Name to Remember','You pass your examination and earn recognition as a sorcerer.']],flash?'#f2d5b9':'#b7a078');for(let i=0;i<4;i++)rect(x-15,y-58+i*8,31,2,'#66563f');circle(x,y-77,12,flash?'#fff1d5':'#bda67d');rect(x-5,y-80,3,3,'#574837');rect(x+4,y-80,3,3,'#574837');text('TRAINING DUMMY',x,y-104,'#cbbca4',9,'center')}

function interact(){const ritual=Array.from({length:4},(_,i)=>i).find(i=>!(p.rituals||[]).includes(i)&&Math.abs(p.x-originQuestPos(i))<95&&Math.abs(p.y+p.h-groundY(originQuestPos(i)))<105);if(ritual!==undefined){if(!(p.eliteDefeated||[]).includes(ritual)){say('Seal guarded by '+ELITE_TITLES[currentOrigin][ritual]+'. Defeat the commander first.');return}p.rituals??=[];p.rituals.push(ritual);p.coins+=70;reward(125);burst(originQuestPos(ritual),groundY(originQuestPos(ritual))-60,CAST[p.char].color,40,170);say('CURSED SEAL PURIFIED · +125 XP · +70 fragments');save();return}const shrine=shrines.find(s=>Math.abs(p.x-s.x)<100&&Math.abs(p.y+p.h-groundY(s.x))<100);if(shrine){p.hp=maxHP();p.ce=100;p.checkpoint=shrine.x;if(shrine.x===ORIGINS[currentOrigin].start+80){openInstructorDialogue();save();return}else say('Rested at '+shrine.name+'. Checkpoint saved.');burst(shrine.x,groundY(shrine.x)-40,'#96ead2',35);save();return}const chest=chests.find(v=>!opened.includes(v.id)&&Math.abs(p.x-v.x)<85&&Math.abs(p.y+p.h-v.y)<85);if(chest){opened.push(chest.id);p.coins+=40;reward(65);p.hp=Math.min(maxHP(),p.hp+35);burst(chest.x,chest.y-15,'#ffd68a',30);say('Hidden cache · +40 fragments · +65 XP · health restored');tone(900,.2);save();return}say('Find a lantern, the instructor, or a hidden cache.')}
function reward(amount){p.xp+=amount;while(p.xp>=p.level*80){p.xp-=p.level*80;p.level++;p.points++;p.hp=maxHP();p.ce=100;say('LEVEL '+p.level+' · +1 technique point. Open Tab to upgrade.');burst(p.x+17,p.y+30,'#ffe5a6',35);tone(1000,.25)}}
function damage(e,amount,knock=0,color=CAST[p.char].color){if(e.dead)return;amount=Math.round(amount*(1+p.power*.15)*(learnedSkill('mastery')?1.4:1)*(domainTime>0&&p.char==='yuji'?1.2:1));e.hp-=amount;e.hurt=.18;effects.push({type:'impact',x:e.x+e.w/2,y:e.y+e.h/2,t:.14,max:.14,color});e.stun=Math.max(e.stun,e.type==='boss'?.1:.25);if(knock&&e.type!=='dummy')moveHorizontal(e,knock);float(amount,e.x+e.w/2,e.y-10,color);burst(e.x+e.w/2,e.y+e.h/2,color,12);shake=Math.max(shake,4);hitStop=.035;cinematicHit(e.x+e.w/2,e.y+e.h/2,color,false);tone(150,.055,'triangle');if(e.type==='dummy'){p.trainingHits=(p.trainingHits||0)+1;if(p.trainingHits===5)say('Punch training complete! Open Tab to unlock Cursed Energy Awareness.');e.hp=e.max;e.stun=0;return}if(e.lifeBossStage===4&&p.char==='gojo'&&p.campaignStep===59&&e.hp<=e.max*.3&&!p.storyEnded){e.dead=true;p.hp=0;p.gojoFinalDefeat=true;p.lifeBossWins??=[];if(!p.lifeBossWins.includes(4))p.lifeBossWins.push(4);burst(p.x+17,p.y+25,'#ff5566',65,270);say('SUKUNA · A FINAL FATAL SLASH');save();updateCampaignMissions();return}if(e.hp<=0){if(e.lifeBossStage!==undefined)finishLifeBoss(e);if(e.elite!==undefined){p.eliteDefeated??=[];if(!p.eliteDefeated.includes(e.elite))p.eliteDefeated.push(e.elite);say('ELITE DEFEATED · '+e.eliteName)}if(e.type!=='dummy'){triggerFinisher(e.x+e.w/2,e.y+e.h/2,color,e.type==='boss');hitStop=Math.max(hitStop,e.type==='boss'?.12:.065);shake=Math.max(shake,e.type==='boss'?16:8)}e.dead=true;kills++;if(p.char==='sukuna'){p.hp=Math.min(maxHP(),p.hp+8);float('+8 HP',p.x,p.y-25,'#e6bcb6')}p.coins+=e.type==='boss'?200:8;reward(e.type==='boss'?500:e.type==='brute'?55:35);burst(e.x+e.w/2,e.y+e.h/2,color,35,260);if(e.type==='boss'&&!e.trial){bossDead=true;quest=4;domainTime=0;shots=[];say('VEIL LIFTED · Cursed Gauntlet unlocked in the journal.');save();setTimeout(()=>{if(started&&bossDead&&!trial.active)storyScene(4)},850)}else if(quest===1&&kills===5)say('Assignment ready. Return to the instructor at the school gate.')}}
function resolveMelee(strike){characterAttackVFX(strike);const style=p.char==='custom'?p.customStyle:p.char,black=style==='yuji'&&strike.combo===2,cleave=style==='sukuna'&&strike.combo===2;effects.push({type:'slash',x:p.x+17,y:p.y+30,dir:strike.face,t:.22,max:.22,color:black?'#ff3159':cleave?'#ffb8b1':'#fff1df',size:70+strike.combo*10});let connected=false;for(const e of enemies)if(!e.dead&&(e.x-p.x)*strike.face>-25&&(e.x-p.x)*strike.face<100&&Math.abs(e.y+e.h/2-p.y-35)<85){damage(e,(black?55:cleave?60:22+strike.combo*9)*(learnedSkill('comboMastery')?1.25:1),strike.face*(strike.combo===2?40:12));connected=true}if(connected&&p.char==='yuji'&&strike.combo===2){effects.push({type:'blackflash',x:p.x+17+strike.face*60,y:p.y+30,t:.3,max:.3,color:'#ff4869'});hitStop=.09;shake=12;cinematicHit(p.x+17+strike.face*60,p.y+30,'#ff3159',true);p.ce=Math.min(100,p.ce+10);float('+10 CE',p.x,p.y-24,'#a2e5ec')}if(connected&&cleave){cinematicHit(p.x+17+strike.face*55,p.y+30,'#ffb2ac',true)}if(connected&&cleave)effects.push({type:'cleave',x:p.x+17+strike.face*55,y:p.y+30,t:.25,max:.25,color:'#ffb2ac'});tone(220+strike.combo*80,.06,'sawtooth')}
function attackBase(kind){if(paused||p.hurtTime>0)return;const cast=CAST[p.char];if(kind>0&&!p.learned?.technique){say('First learn cursed energy control, then unlock your technique in Tab.');return}if(kind===0){if(p.cd>0||p.castTime>.2)return;p.combo=p.comboTimer>0?(p.combo+1)%3:0;p.comboTimer=.9;p.cd=p.combo===2?.42:.22;p.attack=.28;p.castTime=0;pendingStrikes.push({delay:.095,combo:p.combo,face:p.face});return}const advanced=kind===2,domain=kind===3,cost=domain?85:advanced?38:24,key=domain?'dcd':advanced?'rcd':'scd';if(advanced&&!learnedSkill('advanced')||domain&&!learnedSkill('domain')){say('Unlock this in the technique tree. Press Tab.');return}if(p[key]>0){say('Technique recovering · '+Math.ceil(p[key])+'s');return}if(p.ce<cost){say('Not enough cursed energy. Let it regenerate.');return}p.ce-=cost;pendingStrikes=[];p[key]=(domain?28:advanced?7:3)*((p.char==='megumi'||p.char==='custom'&&p.customStyle==='megumi')&&!domain?.85:1);p.attack=0;p.castTime=.55;tone(domain?100:600,domain?.7:.25,'sine');if(domain){domainTime=6;characterDomainVFX();startDomainCinematic(cast.color,cast.domain);shake=12;effects.push({type:'domain',x:p.x+17,y:p.y+30,t:1.5,max:1.5,color:cast.color});say(cast.domain.toUpperCase());for(const e of enemies)if(!e.dead&&Math.abs(e.x-p.x)<900){damage(e,180,0,cast.color);e.stun=e.type==='boss'?((p.char==='gojo'||p.char==='custom'&&p.customStyle==='gojo')?1.8:1):5}return}if((p.char==='sukuna'||p.char==='custom'&&p.customStyle==='sukuna')){if(advanced){effects.push({type:'flamecast',x:p.x+17+p.face*45,y:p.y+28,t:.65,max:.65,color:'#ffb36b'});shots.push({type:'flame',x:p.x+17,y:p.y+28,vx:p.face*600,vy:0,t:1.5,owner:'player',damage:140,color:'#ff9f57',hit:[]});say('OPEN · DIVINE FLAME')}else{for(let i=0;i<3;i++)shots.push({type:'dismantle',x:p.x+17+p.face*i*12,y:p.y+16+i*12,vx:p.face*(700+i*35),vy:0,t:1,owner:'player',damage:40,color:'#ffb8b1',hit:[]});tone(650,.1,'sawtooth')}}else if((p.char==='yuji'||p.char==='custom'&&p.customStyle==='yuji')){const reach=advanced?210:140;effects.push({type:advanced?'blackflash':'fist',x:p.x+17+p.face*55,y:p.y+30,dir:p.face,t:.5,max:.5,color:cast.color,size:reach});for(const e of enemies)if(!e.dead&&(e.x-p.x)*p.face>-20&&(e.x-p.x)*p.face<reach&&Math.abs(e.y-p.y)<110)damage(e,advanced?180:75,p.face*70);shake=advanced?13:7;if(!advanced)effects.push({type:'echo',x:p.x+p.face*80,y:p.y+30,t:.45,max:.45,dir:p.face,color:'#a8e5ff',fired:false})}else if((p.char==='megumi'||p.char==='custom'&&p.customStyle==='megumi')){if(advanced){effects.push({type:'nue',x:p.x+17,y:p.y-160,t:1,max:1,color:'#c3a9ff'});for(const e of enemies)if(!e.dead&&Math.abs(e.x-p.x)<520){effects.push({type:'lightning',x:e.x+e.w/2,y:e.y+e.h/2,t:.45,max:.45,color:'#e1c8ff'});damage(e,120,0,cast.color)}}else{for(const offset of [0,.18])shots.push({type:'dog',fur:offset===0?'#d5d3e6':'#282d47',x:p.x+17,y:p.y+45,vx:p.face*570,vy:0,t:1.2+offset,owner:'player',damage:62,color:cast.color,hit:[]});say('Divine Dogs · hunt')}}else if(advanced){const combined=effects.some(f=>f.type==='blue'&&f.t>0);if(combined){effects=effects.filter(f=>f.type!=='blue');say('IMAGINARY TECHNIQUE · HOLLOW PURPLE');shake=12}const color=combined?'#bd8cff':'#ff5c79';effects.push({type:combined?'purple':'red',x:p.x+17+p.face*40,y:p.y+30,t:.6,max:.6,color});shots.push({type:combined?'purple':'red',x:p.x+17,y:p.y+28,vx:p.face*(combined?620:740),vy:0,t:combined?1.8:1.2,owner:'player',damage:combined?240:150,color,hit:[]})}else{const x=Math.max(0,Math.min(7500,p.x+p.face*230));effects.push({type:'blue',x,y:p.y+30,t:1.4,max:1.4,color:'#68d6ff'});for(const e of enemies)if(!e.dead&&Math.abs(e.x-x)<240&&Math.abs(e.y-p.y)<160){damage(e,80,(x-e.x)*.55,cast.color);e.stun=1}}}
let shadowSummonTimer=0;
function nearestTechniqueTarget(x,y,range,ignore=[]){return enemies.filter(e=>!e.dead&&Math.abs(e.x+e.w/2-x)<range&&Math.abs(e.y+e.h/2-y)<240&&!ignore.includes(e.id)).sort((a,b)=>(a.type==='dummy'?10000:0)+Math.hypot(a.x+ a.w/2-x,a.y+a.h/2-y)-((b.type==='dummy'?10000:0)+Math.hypot(b.x+b.w/2-x,b.y+b.h/2-y)))[0]}
function attack(kind){
 const key=kind===3?'dcd':kind===2?'rcd':'scd',oldCd=p[key];
 const targets=enemies.filter(e=>!e.dead&&(e.x-p.x)*p.face>-20&&(e.x-p.x)*p.face<(kind===2?320:145)&&Math.abs(e.y-p.y)<110);
 if(kind===2&&(p.char==='yuji'||p.char==='custom'&&p.customStyle==='yuji')&&!paused&&p.hurtTime<=0&&p.advanced&&p.ce>=38&&p.rcd<=0){const target=targets.sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0];if(target){moveHorizontal(p,p.face*Math.max(0,Math.min(100,Math.abs(target.x-p.x)-60)));p.inv=Math.max(p.inv,.16);burst(p.x+17,p.y+40,'#ff6d88',16,250)}}
 attackBase(kind);
 if(kind===0||p[key]===oldCd)return;
 if((p.char==='yuji'||p.char==='custom'&&p.customStyle==='yuji')){
  if(kind===1){const echo=[...effects].reverse().find(f=>f.type==='echo');if(echo){echo.targets=targets.map(e=>e.id);echo.t=.5;echo.max=.5}}
  if(kind===2){const hit=targets[0],flash=[...effects].reverse().find(f=>f.type==='blackflash');if(flash&&hit){flash.x=hit.x+hit.w/2;flash.y=hit.y+hit.h/2}hitStop=Math.max(hitStop,.07)}
 }else if((p.char==='megumi'||p.char==='custom'&&p.customStyle==='megumi')){
  for(const s of shots)if(s.type==='dog'&&!s.enhanced){s.enhanced=true;s.t=2.35;s.trail=[]}
  if(kind===2){const bird=[...effects].reverse().find(f=>f.type==='nue');if(bird){bird.t=1.8;bird.max=1.8;bird.storm=true;bird.boltTimer=.3;bird.bolts=0;bird.targets=[]}}
 }else if((p.char==='gojo'||p.char==='custom'&&p.customStyle==='gojo')){
  const well=[...effects].reverse().find(f=>f.type==='blue');if(well){well.t=2.4;well.max=2.4;well.gravity=true;well.tick=.35}
  for(const s of shots)if(s.type==='purple'&&!s.enhanced){s.enhanced=true;s.t=2;s.charge=.3;s.dir=Math.sign(s.vx);s.trail=[]}
 }else if((p.char==='sukuna'||p.char==='custom'&&p.customStyle==='sukuna')){
  for(const s of shots)if(s.type==='dismantle'&&!s.enhanced){s.enhanced=true;s.damage=32;s.t=1.15;s.trail=[]}
 }
 if(kind===3)shadowSummonTimer=0;
}
function resolveDivergence(f){if(f.targets){for(const id of f.targets){const e=enemies.find(e=>e.id===id&&!e.dead);if(!e)continue;effects.push({type:'echoimpact',x:e.x+e.w/2,y:e.y+e.h/2,t:.35,max:.35,color:'#a8e5ff'});damage(e,45,f.dir*25,'#9bdbff')}}else for(const e of enemies)if(!e.dead&&Math.abs(e.x-f.x)<90&&Math.abs(e.y-f.y)<100)damage(e,45,f.dir*20,'#9bdbff')}
function updateTechniques(dt){
 for(const s of shots){
  if(s.trail){s.trail.push({x:s.x,y:s.y});if(s.trail.length>10)s.trail.shift()}
  if(s.type==='dog'){
   let target=enemies.find(e=>e.id===s.targetId&&!e.dead&&!s.hit.includes(e.id));target??=nearestTechniqueTarget(s.x,s.y,550,s.hit);
   if(target){s.targetId=target.id;const dx=target.x+target.w/2-s.x,desired=Math.sign(dx||s.vx)*Math.min(650,160+Math.abs(dx)*8);s.vx+=(desired-s.vx)*Math.min(1,dt*10)}
  }
 }
 for(const f of [...effects]){
  if(f.type==='blue'&&f.gravity){f.tick-=dt;for(const e of enemies){if(e.dead||e.type==='dummy')continue;const dx=f.x-e.x-e.w/2,dy=f.y-e.y-e.h/2;if(Math.abs(dx)<220&&Math.abs(dy)<180){const force=(e.type==='boss'?.25:1)*Math.min(1,dt*4);moveHorizontal(e,dx*force);e.vx=0;if(f.tick<=0)damage(e,6,0,'#8bdeff')}}if(f.tick<=0)f.tick=.35}
  if(f.type==='nue'&&f.storm&&f.bolts<3){f.boltTimer-=dt;if(f.boltTimer<=0){let target=nearestTechniqueTarget(p.x+17,p.y+35,540,f.targets);target??=nearestTechniqueTarget(p.x+17,p.y+35,540);if(target){effects.push({type:'lightning',x:target.x+target.w/2,y:target.y+target.h/2,t:.36,max:.36,color:'#e6caff'});f.targets.push(target.id);damage(target,14,0,'#c6acff')}f.bolts++;f.boltTimer=.35}}
  if(f.type==='flameburst'&&!f.fireGround){f.fireGround=true;effects.push({type:'burningground',x:f.x,y:groundY(f.x)-4,t:1.6,max:1.6,tick:.25,color:'#ffac6c'})}
  if(f.type==='burningground'){f.tick-=dt;if(f.tick<=0){f.tick=.3;for(const e of enemies)if(!e.dead&&Math.abs(e.x+e.w/2-f.x)<110&&Math.abs(e.y+e.h-f.y)<100)damage(e,5,0,'#ffc98c')}}
 }
 if(domainTime>0&&p.char==='megumi'){shadowSummonTimer+=dt;if(shadowSummonTimer>1.35){shadowSummonTimer=0;const target=nearestTechniqueTarget(p.x+17,p.y+35,800);if(target)shots.push({type:'dog',enhanced:true,fur:'#282d47',x:p.x+17,y:p.y+45,vx:Math.sign(target.x-p.x)*570,vy:0,t:1.5,owner:'player',damage:24,color:'#b5a0ef',hit:[],targetId:target.id,trail:[]})}}else shadowSummonTimer=0;
}
function drawTechniqueOverlays(){
 for(const s of shots){
  if(s.trail&&s.trail.length>1){ctx.save();for(let i=1;i<s.trail.length;i++){ctx.globalAlpha=i/s.trail.length*.28;ctx.strokeStyle=s.color;ctx.lineWidth=s.type==='purple'?12:s.type==='dog'?3:2;ctx.beginPath();ctx.moveTo(s.trail[i-1].x,s.trail[i-1].y);ctx.lineTo(s.trail[i].x,s.trail[i].y);ctx.stroke()}ctx.restore()}
  if(s.type==='purple'){if(s.charge>0){const r=38*(s.charge/.3);glow(s.x-r,s.y,40,'#80d9ff66');glow(s.x+r,s.y,40,'#ff7ca866');circle(s.x-r,s.y,10,'#94deff');circle(s.x+r,s.y,10,'#ff96b8')}else{glow(s.x,s.y,90,'#ae72e842');ctx.strokeStyle='#e6caff';ctx.lineWidth=1;for(let i=0;i<4;i++){const a=time*8+i*Math.PI/2;ctx.beginPath();ctx.moveTo(s.x+Math.cos(a)*35,s.y+Math.sin(a)*35);ctx.lineTo(s.x+Math.cos(a+.25)*47,s.y+Math.sin(a+.25)*47);ctx.lineTo(s.x+Math.cos(a+.5)*39,s.y+Math.sin(a+.5)*39);ctx.stroke()}}}
  if(s.type==='dismantle'){ctx.strokeStyle='#fff6f0';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(s.x-35,s.y-37);ctx.lineTo(s.x+35,s.y+37);ctx.stroke();glow(s.x,s.y,34,'#ef8c9d20')}
  if(s.type==='flame'){glow(s.x,s.y,70,'#ffac5b40');for(let i=0;i<4;i++)circle(s.x-Math.sign(s.vx)*(25+i*10),s.y+Math.sin(time*19+i)*12,2,'#ffd38b')}
 }
 for(const f of effects){
  const progress=1-f.t/f.max;
  if(f.type==='blue'&&f.gravity){ctx.save();ctx.strokeStyle='#a3e9ff';ctx.lineWidth=1;for(let i=0;i<12;i++){const a=time*3+i*Math.PI/6,r=45+((time*70+i*17)%100);ctx.globalAlpha=(r-40)/105*.6;ctx.beginPath();ctx.moveTo(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r*.65);ctx.lineTo(f.x+Math.cos(a+.25)*(r-20),f.y+Math.sin(a+.25)*(r-20)*.65);ctx.stroke()}ctx.restore()}
  if(f.type==='repulse'||f.type==='echoimpact'){ctx.save();ctx.globalAlpha=Math.max(0,1-progress);ctx.strokeStyle=f.type==='repulse'?'#ff9ea7':'#b8efff';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(f.x,f.y,15+progress*120,8+progress*65,0,0,Math.PI*2);ctx.stroke();ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(f.x,f.y,20+progress*150,12+progress*80,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
  if(f.type==='burningground'){ctx.save();ctx.globalAlpha=Math.min(1,f.t*2)*.65;for(let i=0;i<13;i++){const x=f.x-100+i*16,height=10+Math.sin(time*12+i*2)*7;poly([[x-5,f.y],[x-3,f.y-height],[x+1,f.y-height-8],[x+7,f.y]],i%2?'#ff8b52':'#ffc87d')}glow(f.x,f.y,120,'#fb844122');ctx.restore()}
 }
}

function hurt(amount,sourceX){if(p.inv>0)return;if(learnedSkill('reinforcedGuard')&&amount<9999)amount=Math.max(1,Math.ceil(amount*.85));const dodging=p.dash>0;if(dodging)return;if(p.char==='gojo'&&p.passiveCd<=0&&p.ce>=18&&amount<9999){p.ce-=18;p.passiveCd=8;effects.push({type:'infinity',x:p.x+17,y:p.y+35,t:.75,max:.75,color:'#87e6ff'});float('INFINITY',p.x,p.y-20,'#b7f3ff');tone(900,.16);return}p.hp-=amount;p.inv=1;p.hurtTime=.28;p.attack=0;pendingStrikes=[];p.castTime=0;p.vx=Math.sign(p.x-sourceX)*240;p.vy=-150;shake=8;burst(p.x+17,p.y+30,'#ff5c7c',18);float('-'+amount,p.x,p.y-15,'#ff718c');tone(75,.15,'sawtooth');if(p.hp<=0){if(p.char==='gojo'&&currentLifeStage()===4&&p.campaignStep===59&&(p.finalDuelSeconds||0)>=45&&!p.storyEnded){p.gojoFinalDefeat=true;p.lifeBossWins??=[];if(!p.lifeBossWins.includes(4))p.lifeBossWins.push(4);save();updateCampaignMissions();return}if(trial.active)finishTrial(false);p.x=p.checkpoint;p.y=groundY(p.x)-p.h-5;p.hoverTime=0;p.hovering=false;p.hp=maxHP();p.ce=100;p.inv=3;p.vx=p.vy=0;p.attack=p.castTime=p.hurtTime=p.dash=p.comboTimer=0;pendingStrikes=[];domainTime=0;effects=[];shots=[];cam=Math.max(0,Math.min(Math.max(0,7600-visibleWidth()),p.x-visibleWidth()*.5));for(const e of enemies)if(!e.dead&&Math.abs(e.x-p.x)<250)e.x=e.home;say('Rescued at your checkpoint. Your progress is safe.');save()}}
function jump(){if(p.ground||p.coyote>0||(p.learned?.doubleJump&&p.jumps<2)){p.jumpBuffer=0;p.coyote=0;if(keys.s&&p.ground){const roof=platforms.find(f=>f.h<100&&Math.abs(p.y+p.h-f.y)<5&&p.x+34>f.x&&p.x<f.x+f.w);if(roof){p.y+=25;p.ground=false;p.jumps=1;return}}p.vy=p.jumps===0?(p.char==='megumi'?-620:-600):(p.char==='megumi'?-575:-540);p.jumps++;p.ground=false;burst(p.x+17,p.y+p.h,p.jumps>1?CAST[p.char].color:'#b5c6cf',p.jumps>1?14:7,90);tone(350,.08)}}
function dash(){if(!p.learned?.dash){say('Dash is locked. Complete training and unlock it in Tab.');return}if(p.dashCd>0||p.ce<8)return;p.dash=.17;p.dashCd=.8;p.attack=0;p.castTime=0;pendingStrikes=[];p.inv=Math.max(p.inv,.2);p.ce-=8;tone(170,.1,'triangle');burst(p.x+17,p.y+35,CAST[p.char].color,10)}
function input(key,down){keys[key]=down;if(!down||paused)return;if([' ','w','arrowup'].includes(key)){p.jumpBuffer=.12;jump()}if(key==='shift'&&p.learned?.dash)dash();if(key==='c'&&p.ground&&Math.abs(p.vx)>150)beginCombatSlide();if(key==='j')attack(0);if(key==='k')attack(1);if(key==='r')attack(2);if(key==='l')attack(3);if(key==='e')interact();if(key==='h')rctHeal();if(key==='1')useSupply('medkits');if(key==='2')useSupply('tonics')}
function isolateGameMenu(active){if(active)mouseAttacking=false;for(const selector of ['#hud','#right','#touch','#hotbar'])$(selector).inert=active;c.inert=active}
addEventListener('keydown',e=>{const k=e.key.toLowerCase();
 if(!paused&&[' ','tab','arrowup','arrowdown','arrowleft','arrowright'].includes(k)||!started&&['arrowleft','arrowright'].includes(k))e.preventDefault();
 if(paused&&k==='tab'){const buttons=[...$('#panel').querySelectorAll('button:not([disabled]),a[href]')];if(buttons.length){const first=buttons[0],lastButton=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();lastButton.focus()}else if(!e.shiftKey&&document.activeElement===lastButton){e.preventDefault();first.focus()}}return}
 if(e.repeat)return;
 if(!started){if(['INPUT','SELECT','TEXTAREA'].includes(e.target?.tagName))return;if(['a','d','arrowleft','arrowright'].includes(k)){const roster=Object.keys(CAST),index=roster.indexOf(selectedCharacter);selectCharacter(roster[(index+(['a','arrowleft'].includes(k)?-1:1)+roster.length)%roster.length])}if(k==='enter'&&e.target?.tagName!=='BUTTON'){e.preventDefault();start(selectedCharacter)}return}
 if(k==='escape'){paused?resume():menu();return}
 if(k==='m'){menu('map');return}if(k==='h'&&!paused){rctHeal();return}
 if(paused)return;
 if(k==='tab'){menu('techniques');return}
 input(k,true)
});addEventListener('keyup',e=>input(e.key.toLowerCase(),false));addEventListener('blur',()=>{mouseAttacking=false;Object.keys(keys).forEach(k=>keys[k]=false)});$('#menu').onclick=()=>menu();$('#medkitCount').onclick=()=>useSupply('medkits');$('#tonicCount').onclick=()=>useSupply('tonics');$('#mapButton').onclick=()=>menu('map');document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);input(b.dataset.key,true)};b.onpointerup=b.onpointercancel=()=>input(b.dataset.key,false)});
c.oncontextmenu=e=>e.preventDefault();
c.onpointerdown=e=>{if(paused||!started||e.pointerType&&e.pointerType!=='mouse'&&e.pointerType!=='pen')return;if(e.button!==0&&e.button!==2)return;e.preventDefault();c.focus();c.setPointerCapture?.(e.pointerId);if(p.attack<=0&&p.castTime<=0){const worldX=cam+e.clientX/innerWidth*visibleWidth();p.face=worldX>=p.x+17?1:-1}if(e.button===0){mouseAttacking=true;attack(0)}else attack(1)};
c.onpointerup=e=>{if(e.button===0)mouseAttacking=false};c.onpointercancel=()=>mouseAttacking=false;
document.querySelectorAll('[data-action]').forEach(button=>button.onclick=()=>{if(paused)return;attack(Number(button.dataset.action));c.focus()});

function moveHorizontal(o,delta){const before=o.x;o.x=Math.max(0,Math.min(7600-o.w,o.x+delta));let blocked=false;for(const f of platforms){if(f.h<100||o.y+o.h<=f.y+3||o.y>=f.y+f.h)continue;if(o.x+o.w>f.x&&o.x<f.x+f.w){if(delta>0&&before+o.w<=f.x+1){o.x=f.x-o.w;blocked=true}else if(delta<0&&before>=f.x+f.w-1){o.x=f.x+f.w;blocked=true}}}return blocked}
function physics(o,dt){const old=o.y+o.h;o.vy+=(o===p&&p.char==='gojo'?1270:1550)*dt;if(o===p){p.hovering=false;if(p.char==='gojo'&&!p.ground&&p.vy>0&&keys[' ']&&p.hoverTime<1.5&&p.ce>=10){p.vy=Math.min(p.vy,75);p.ce=Math.max(0,p.ce-16*dt);p.hoverTime+=dt;p.hovering=true}}o.y+=o.vy*dt;o.ground=false;for(const f of platforms)if(o.x+o.w>f.x&&o.x<f.x+f.w&&old<=f.y+3&&o.y+o.h>=f.y&&o.vy>=0){o.y=f.y-o.h;o.vy=0;o.ground=true;if(o===p){o.jumps=0;o.hoverTime=0;o.hovering=false}}}
function enemyAI(e,dt){if(e.dead)return;if(e.y>950){e.x=e.home;e.y=groundY(e.home)-e.h;e.vy=0}if(e.type==='dummy'){e.hurt=Math.max(0,e.hurt-dt);return}if(p.x<580&&e.type!=='boss'&&e.lifeBossStage===undefined){e.x+=(e.home-e.x)*Math.min(1,dt*2);return}e.hurt=Math.max(0,e.hurt-dt);e.stun=Math.max(0,e.stun-dt);e.cd-=dt;physics(e,dt);if(e.type==='boss'){const previous=e.phase||1;e.phase=e.hp<e.max*.5?2:1;if(previous===1&&e.phase===2){burst(e.x+50,e.y+50,'#ffc087',35,240);say('THE VEILKEEPER · ENRAGED');tone(90,.4,'triangle')}}if(e.stun>0)return;const dx=p.x-e.x,dy=p.y+p.h/2-e.y-e.h/2,dist=Math.abs(dx);if(e.lifeBossStage!==undefined){storyBossAI(e,dt);return}if(e.type==='boss'){if(p.x<6000){e.hp=e.max;e.phase=1;e.x=e.home;e.wind=0;e.cd=1.5;return}if(dist>950)return;e.phase=e.hp<e.max*.5?2:1;if(e.wind>0){e.wind-=dt;if(e.wind<=0){if(e.move==='slam'){effects.push({type:'shockwave',x:e.x+50,y:e.y+110,t:.65,max:.65,color:'#ffac79'});for(const dir of [-1,1])shots.push({type:'wave',x:e.x+50,y:groundY(e.x)-25,vx:dir*(e.phase===2?380:290),vy:0,t:2,owner:'enemy',damage:28,color:'#f79879'});if(dist<170&&Math.abs(dy)<120)hurt(32,e.x);shake=10}else{for(let i=-1;i<=1;i++)shots.push({type:'curse',x:e.x+50,y:e.y+40,vx:Math.sign(dx)*(260+e.phase*60),vy:i*95,t:2.4,owner:'enemy',damage:20,color:'#e56ba2'})}e.cd=e.phase===2?1.2:2}return}if(e.cd<=0){e.wind=e.phase===2?.6:.9;e.move=Math.floor(time)%2?'slam':'volley';tone(85,.2,'triangle')}else if(dist>130)e.x=Math.max(6350,Math.min(7440,e.x+Math.sign(dx)*(e.phase===2?110:70)*dt));return}if(dist>650){if(dist<1000)e.x=e.home+Math.sin(time*.6+e.id)*22;return}if(e.wind>0){e.wind-=dt;if(e.wind<=0){if(e.type==='spitter'){const len=Math.hypot(dx,dy)||1;shots.push({type:'curse',x:e.x+19,y:e.y+20,vx:dx/len*260,vy:dy/len*260,t:2.6,owner:'enemy',damage:14,color:'#b393f4'})}else if(dist<(e.type==='brute'?110:75)&&Math.abs(dy)<85)hurt(e.type==='brute'?24:13,e.x);e.cd=e.type==='brute'?1.6:1.2}return}if(e.type==='spitter'){if(dist>350&&moveHorizontal(e,Math.sign(dx)*55*dt)&&e.ground)e.vy=-470;if(e.cd<=0){e.wind=.65}}else{if(dist>50&&moveHorizontal(e,Math.sign(dx)*(e.type==='brute'?62:115)*dt)&&e.ground)e.vy=-490;if(dist<100&&Math.abs(dy)<100&&e.cd<=0)e.wind=e.type==='brute'?.65:.4;if(p.y<e.y-60&&e.ground&&dist<240){e.vy=-520;e.ground=false}}}

/* Campaign quality pass: mission targeting, proper story bosses, and intentional movement. */
function campaignDestination(m){
 if(!m)return null;
 const origin=currentLifeStartingX(),step=currentLifeStage();
 if(m.type==='bossApproach')return Math.min(7120,origin+540);
 if(m.type==='lifeBoss')return Math.min(7120,origin+900);
 if(m.type==='travel')return Math.min(7480,origin+m.target);
 if(m.type==='training')return Math.min(7400,ORIGINS[currentOrigin].start+360);
 if(m.type==='ritual'||m.type==='elite')return originQuestPos(Number(m.target)||0);
 if(m.type==='cache'){
  const next=chests.find(c=>!opened.includes(c.id));
  return next?.x??null;
 }
 return null;
}
function drawMissionBeacon(){
 if(!started||paused||trial.active||p.storyEnded)return;
 const m=currentCampaignMission(),destination=campaignDestination(m);
 if(destination===null)return;
 const dist=Math.abs(destination-(p.x+17)),screen=(destination-cam)*cameraZoom();
 ctx.save();ctx.textAlign='center';
 const mainColor=ORIGINS[currentOrigin].accent;
 if(screen>35&&screen<W-35){
  const py=(groundY(destination)-105)*cameraZoom()+worldOffsetY();
  const bob=Math.sin(time*3)*5;
  ctx.shadowColor=mainColor;ctx.shadowBlur=16;
  ctx.strokeStyle=mainColor;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(screen,py-18+bob);ctx.lineTo(screen+13,py-5+bob);ctx.lineTo(screen,py+8+bob);ctx.lineTo(screen-13,py-5+bob);ctx.closePath();ctx.stroke();
  ctx.shadowBlur=0;ctx.fillStyle='#fff4e8';ctx.font='bold 11px system-ui';ctx.fillText('OBJECTIVE · '+Math.round(dist)+'m',screen,py-26+bob);
 }else{
  const right=destination>p.x,at=right?W-83:83;
  ctx.fillStyle='#141927dd';ctx.fillRect(at-67,87,134,38);ctx.strokeStyle=mainColor;ctx.strokeRect(at-67,87,134,38);
  ctx.font='bold 12px system-ui';ctx.fillStyle='#f4eafa';ctx.fillText((right?'▶ ':'◀ ')+Math.round(dist)+'m',at,111);
 }
 ctx.restore();
}
function storyBossAI(e,dt){
 const delta=p.x-e.x,dist=Math.abs(delta);
 if(dist>900){if(e.wind>0)e.wind=0;return}
 e.phase=e.hp<e.max*.33?3:e.hp<e.max*.7?2:1;
 if(e.wind>0){
  e.wind-=dt;
  if(e.wind<=0){
   const x=e.x+e.w/2;
   if(e.move==='surge'){
    effects.push({type:'shockwave',x,y:groundY(x)-15,t:.62,max:.62,color:'#ff809b'});
    for(const dir of [-1,1])shots.push({type:'wave',x,y:groundY(x)-18,vx:dir*(330+e.phase*60),vy:0,t:1.7,owner:'enemy',damage:13+e.phase*6,color:'#fa86b4'});
    if(dist<115&&Math.abs(p.y-e.y)<120)hurt(16+e.phase*7,e.x);
   }else{
    for(let i=-1;i<=1;i++)shots.push({type:'curse',x,y:e.y+28,vx:Math.sign(delta||1)*(230+e.phase*65),vy:i*(70+e.phase*18),t:2,owner:'enemy',damage:10+e.phase*4,color:'#d9a4ff'});
   }
   e.cd=Math.max(.85,1.9-e.phase*.24);e.wind=0;
  }
  return;
 }
 if(e.stun>0)return;
 if(e.cd<=0){
  e.move=(Math.floor(time*2+e.lifeBossStage)%3===0?'volley':'surge');
  e.wind=e.move==='surge'?Math.max(.43,.9-e.phase*.13):Math.max(.5,.95-e.phase*.11);
  tone(155,.08,'triangle');
 }else if(dist>100){
  const speed=55+e.phase*32;
  moveHorizontal(e,Math.sign(delta)*speed*dt);
 }
 if(e.ground&&p.y<e.y-80&&dist<250){e.vy=-480;e.ground=false}
}
function drawCombatThreatIndicator(){
 if(!started||paused)return;
 const threats=enemies.filter(e=>!e.dead&&e.wind>0&&Math.abs(e.x-p.x)<450&&Math.abs(e.y-p.y)<175);
 if(!threats.length)return;
 const e=threats.reduce((a,b)=>Math.abs(a.x-p.x)<Math.abs(b.x-p.x)?a:b),boss=e.lifeBossStage!==undefined;
 ctx.save();const w=boss?245:180,x=W*.5-w*.5;
 ctx.fillStyle='#160c24d9';ctx.fillRect(x,137,w,30);ctx.strokeStyle=boss?'#fb7eaa':'#efaf9f';ctx.lineWidth=1.5;ctx.strokeRect(x,137,w,30);
 ctx.fillStyle='#fff0e8';ctx.textAlign='center';ctx.font='bold 11px system-ui';
 ctx.fillText(boss?'STORY BOSS · DODGE THE ATTACK':'INCOMING ATTACK · DASH TO EVADE',W*.5,157);ctx.restore();
}
function updateMovementPolish(dt){
 // Crouching makes traversal slower. Sprinting creates a brief momentum-based slide.
 p.slideTime=Math.max(0,(p.slideTime||0)-dt);
 p.slideCooldown=Math.max(0,(p.slideCooldown||0)-dt);
 if(p.slideTime>0&&p.dash<=0&&p.ground){p.vx=p.slideDirection*(Math.max(170,590*(p.slideTime/.55)));moveHorizontal(p,p.vx*dt)}
}
function beginCombatSlide(){
 if(paused||!started||!p.ground||p.slideCooldown>0||p.slideTime>0||Math.abs(p.vx)<150)return;
 p.slideTime=.55;p.slideCooldown=.95;p.slideDirection=Math.sign(p.vx)||p.face;
 p.inv=Math.max(p.inv,.14);tone(185,.07,'triangle');burst(p.x+17,p.y+p.h-3,'#9eb8c8',9,70);
}

function update(dt){time+=dt;if(p.char==='gojo'&&currentLifeStage()===4&&p.campaignStep===59&&enemies.some(e=>e.lifeBossStage===4&&!e.dead&&Math.abs(e.x-p.x)<500))p.finalDuelSeconds=(p.finalDuelSeconds||0)+dt;p.encounterTimer=Math.max(0,(p.encounterTimer||0)-dt);p.maxJourneyX=Math.max(p.maxJourneyX||p.x,p.x);for(const k of ['rctCd','cd','scd','rcd','dcd','dash','dashCd','attack','castTime','hurtTime','passiveCd','itemCd','jumpBuffer','coyote','inv','comboTimer'])p[k]=Math.max(0,p[k]-dt);p.ce=p.learned?.ceControl?Math.min(100,p.ce+(learnedSkill('focusTraining')?12:8)*dt):0;domainTime=Math.max(0,domainTime-dt);const dir=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0);const sprinting=!!(keys.shift&&!p.learned?.dash);const crouching=!!(keys.s||keys.arrowdown||keys.c);const speed=(sprinting?390:crouching?125:245);const target=dir*speed;p.vx=p.dash>0?p.face*880:p.slideTime>0?p.slideDirection*Math.max(175,575*p.slideTime/.55):p.vx+(target-p.vx)*Math.min(1,dt*(dir?11:8));p.slideTime=Math.max(0,(p.slideTime||0)-dt);p.slideCooldown=Math.max(0,(p.slideCooldown||0)-dt);if(dir&&p.dash<=0&&p.slideTime<=0&&p.attack<=0&&p.castTime<=0)p.face=dir;moveHorizontal(p,p.vx*dt);if(p.ground)walking+=Math.abs(p.vx)*dt;const wasGrounded=p.ground,fallSpeed=p.vy;if(wasGrounded)p.coyote=.08;physics(p,dt);if(!wasGrounded&&p.ground){if(fallSpeed>250)burst(p.x+17,p.y+70,'#a9b4c5',10,100);if(p.jumpBuffer>0)jump()}if(p.ground&&Math.abs(p.vx)>160&&Math.random()<dt*8)burst(p.x+17,p.y+70,'#8999b1',2,35);if(p.y>950)hurt(9999,p.x);for(const strike of pendingStrikes){strike.delay-=dt;if(strike.delay<=0)resolveMelee(strike)}pendingStrikes=pendingStrikes.filter(strike=>strike.delay>0);if((keys.j||mouseAttacking)&&p.cd<=0)attack(0);if(p.dash>0&&Math.random()<.7)effects.push({type:'ghost',x:p.x,y:p.y,t:.18,max:.18,color:CAST[p.char].color,face:p.face});updateTechniques(dt);for(const e of enemies)enemyAI(e,dt);for(const s of shots){if(s.charge>0){s.charge=Math.max(0,s.charge-dt);s.x=p.x+17+s.dir*44;s.y=p.y+28;continue}s.t-=dt;s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.type==='dog'){const target=enemies.find(e=>e.id===s.targetId&&!e.dead),desiredY=target?Math.min(groundY(s.x)-18,target.y+target.h*.55):groundY(s.x)-18;s.y+=(desiredY-s.y)*Math.min(1,dt*10)}if(s.owner==='enemy'){if(Math.abs(s.x-p.x-17)<29&&Math.abs(s.y-p.y-35)<45){hurt(s.damage,s.x);s.t=0}}else{for(const e of enemies)if(s.t>0&&!e.dead&&!s.hit.includes(e.id)&&Math.abs(s.x-e.x-e.w/2)<e.w/2+30&&Math.abs(s.y-e.y-e.h/2)<e.h/2+22){damage(e,s.damage,Math.sign(s.vx)*(s.type==='red'?125:s.type==='purple'?45:28),s.color);s.hit.push(e.id);if(s.type==='red'){effects.push({type:'repulse',x:s.x,y:s.y,t:.45,max:.45,color:'#ffa2ad'});for(const other of enemies)if(other!==e&&!other.dead&&Math.abs(other.x-s.x)<130&&Math.abs(other.y-s.y)<120)damage(other,45,Math.sign(other.x-s.x||s.vx)*90,'#ff9cae')}if(s.type==='flame'){effects.push({type:'flameburst',x:s.x,y:s.y,t:.6,max:.6,color:'#ffb05d'});burst(s.x,s.y,'#ffb35c',40,250);for(const other of enemies)if(other!==e&&!other.dead&&Math.abs(other.x-s.x)<120&&Math.abs(other.y-s.y)<120)damage(other,65,Math.sign(s.vx)*25,'#ffc87e')}if(s.type!=='dog'&&s.type!=='purple'&&s.type!=='dismantle')s.t=0}}}shots=shots.filter(s=>s.t>0&&s.x>=0&&s.x<=7600);for(const f of effects){f.t-=dt;if(f.type==='echo'&&f.t<.1&&!f.fired){f.fired=true;resolveDivergence(f)}}effects=effects.filter(f=>f.t>0);for(const q of particles){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=200*dt;q.t-=dt}particles=particles.filter(q=>q.t>0).slice(-650);for(const t of texts){t.t-=dt;t.y-=33*dt}texts=texts.filter(t=>t.t>0);if(domainTime>0&&Math.floor(time*4)!==Math.floor((time-dt)*4))for(const e of enemies)if(!e.dead&&Math.abs(e.x-p.x)<900)damage(e,12,0,CAST[p.char].color);const z=zoneAt(p.x);/* Lifetime campaigns control their own cutscenes and do not interrupt missions with legacy popups. */if(z!==zoneIndex){zoneIndex=z;zoneTime=4;tone(400,.3)}if(p.x>6050&&quest===2){quest=3;say('Special-grade presence detected. Prepare yourself.');save()}if(bossDead&&quest>=2)quest=4;terrainCameraY+=(groundY(p.x)-terrainCameraY)*Math.min(1,dt*4);cameraLook+=(Math.max(-60,Math.min(60,REDUCED_MOTION?0:p.vx*.18))-cameraLook)*Math.min(1,dt*3);cam+=(Math.max(0,Math.min(Math.max(0,7600-visibleWidth()),p.x-visibleWidth()*.5+cameraLook))-cam)*Math.min(1,dt*5);shake=Math.max(0,shake-dt*22);zoneTime=Math.max(0,zoneTime-dt);noticeTime-=dt;if(noticeTime<0)$('#notice').textContent='';updateTrial(dt);replenishEncounter();updateCampaignMissions();autoSave+=dt;if(autoSave>12){autoSave=0;save()}updateHUD()}
function updateHUD(){const cast=CAST[p.char];updatePortrait();$('#rank').textContent=cast.name;$('#hud').classList.toggle('danger',p.hp<maxHP()*.3);$('#medkitCount').textContent='1 · Heal '+p.medkits;$('#tonicCount').textContent='2 · Energy '+p.tonics;$('#level').textContent='LV '+p.level;$('#hp').style.width=Math.max(0,p.hp/maxHP()*100)+'%';$('#hpText').textContent=Math.ceil(p.hp)+' / '+maxHP();$('#energy').style.width=p.ce+'%';$('#ceText').textContent=Math.floor(p.ce)+' / 100';$('#xp').style.width=p.xp/(p.level*80)*100+'%';$('#objective').textContent=currentCampaignMission()?'MAIN STORY · '+currentCampaignMission().title+' · '+campaignMissionProgress(currentCampaignMission()):objective();$('#questProgress').textContent=trial.active?'CURSED GAUNTLET · WAVE '+trial.wave+' / 3':'CHAPTER '+(currentLifeStage()+1)+' / 5 · MISSION '+Math.min(12,(p.campaignStep||0)%12+1)+' / 12';$('#zone').textContent=ZONES[zoneIndex].name;$('#coins').textContent=p.coins+' fragments';$('#passiveLabel').textContent=cast.passive+(p.char==='gojo'&&p.passiveCd>0?' · '+Math.ceil(p.passiveCd)+'s':'');$('#skillName').textContent=cast.skill;$('#advancedName').textContent=p.char==='gojo'&&effects.some(f=>f.type==='blue'&&f.t>0)?'Hollow Purple':cast.ult;$('#domainName').textContent='Domain';for(const [id,key,unlocked,cost]of [['skillCd','scd',learnedSkill('technique'),24],['advancedCd','rcd',p.advanced,38],['domainCd','dcd',p.domain,85]]){const disabled=!unlocked||p[key]>0||p.ce<cost;$('#'+id).textContent=!unlocked?'LOCKED':p[key]>0?p[key].toFixed(1)+'s':p.ce<cost?cost+' CE':'READY';$('#'+id).parentElement.classList.toggle('unavailable',disabled);$('#'+id).parentElement.disabled=disabled}const nearRitual=Array.from({length:4},(_,i)=>i).some(i=>!(p.rituals||[]).includes(i)&&Math.abs(p.x-originQuestPos(i))<95);const nearby=nearRitual||shrines.some(s=>Math.abs(p.x-s.x)<100&&Math.abs(p.y+p.h-groundY(s.x))<100)||chests.some(v=>!opened.includes(v.id)&&Math.abs(p.x-v.x)<85&&Math.abs(p.y+p.h-v.y)<85);$('#interact').hidden=!nearby;const boss=enemies.find(e=>(e.type==='boss'||e.lifeBossStage!==undefined)&&!e.dead&&Math.abs(e.x-p.x)<850);$('#boss').hidden=!boss;if(boss){$('#bossName').textContent=boss.lifeBossTitle|| (boss.trial?'THE VEILKEEPER · ECHO':'THE VEILKEEPER');$('#bossHp').style.width=Math.max(0,boss.hp/boss.max*100)+'%';$('#bossPhase').textContent=boss.phase===3?'PHASE III · DESPERATION':boss.phase===2?'PHASE II · ENRAGED':'SPECIAL GRADE'}}
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h)}
function circle(x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
function poly(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill()}
function glow(x,y,r,color){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
function text(s,x,y,color='#d9dbe9',size=12,align='left'){ctx.fillStyle=color;ctx.font=size+'px system-ui';ctx.textAlign=align;ctx.fillText(s,x,y);ctx.textAlign='left'}
function building(x,y,w,h,near=false){rect(x,y,w,h,near?'#22273b':'#1a2035');rect(x-5,y-6,w+10,8,near?'#596078':'#333c55');rect(x+8,y+6,3,h-6,'#3a3e53');for(let xx=18;xx<w-10;xx+=28)for(let yy=22;yy<h-16;yy+=36){const lit=(Math.floor(x)+xx+yy)%7<4;rect(x+xx,y+yy,12,20,lit?'#e5aa8360':'#11182a');if(lit)rect(x+xx,y+yy+9,12,2,'#414259')}if(near){rect(x+w-44,y-25,30,19,'#383f52');rect(x+w-40,y-28,22,3,'#535d71')}}
function background(){const g=ctx.createLinearGradient(0,0,0,720);const domainSky={yuji:['#231024','#563148'],megumi:['#090e20','#24243d'],gojo:['#07172f','#244867'],sukuna:['#220e18','#542637'],custom:['#20132d','#4f3863']};const atmosphere=LIFE_SKIES[currentLifeStage()]||ORIGINS[currentOrigin].sky;g.addColorStop(0,domainTime?domainSky[p.char][0]:atmosphere[0]);g.addColorStop(.65,domainTime?domainSky[p.char][1]:atmosphere[1]);g.addColorStop(1,'#63505f');ctx.fillStyle=g;ctx.fillRect(0,0,W,720);for(let i=0;i<65;i++){const x=((i*137.7-cam*.035)%W+W)%W,y=35+(i*43)%260;rect(x,y,i%4===0?2:1,1,'#b0bed17a')}glow(W*.77-cam*.015,138,130,'#ccd7ff15');circle(W*.77-cam*.015,138,38,'#cbd2e0');circle(W*.77-cam*.015+12,129,36,'#a3acc0');for(let i=-1;i<12;i++){let x=i*420-cam*.08;poly([[x,440],[x+230,215+(i%3)*30],[x+480,440]],'#1b2c42')}for(let layer=0;layer<2;layer++)for(let i=0;i<30;i++){const x=i*220-cam*(.15+layer*.14);if(x<-240||x>W+240)continue;const h=90+(i*71+layer*59)%180;building(x,520-h,165,h+160)}for(let i=0;i<5;i++){const x=((i*460+time*6-cam*.1)%(W+300)+W+300)%(W+300)-150;ctx.fillStyle='#b7b4cd08';ctx.fillRect(x,400+i*34,350,14)}}
function roof(x,y,w,deep=70){poly([[x-18,y],[x+w/2,y-deep],[x+w+18,y],[x+w+10,y+9],[x-10,y+9]],'#141c2b');rect(x-23,y-2,w+46,5,'#74717e');for(let i=0;i<w/22;i++)rect(x+i*22,y+3,16,2,'#343e50')}
function torii(x,y,w){rect(x,y,w,10,'#c05b61');rect(x+8,y+10,w-16,5,'#662c3f');rect(x+30,y,w*.045,170,'#9a3f50');rect(x+w-45,y,w*.045,170,'#9a3f50');rect(x+20,y+43,w-40,9,'#863647');poly([[x-18,y-10],[x+w*.4,y-4],[x+w*.6,y-4],[x+w+18,y-10],[x+w+10,y],[x-10,y]],'#282033');for(let i=0;i<4;i++)rect(x+w*.27+i*25,y+55,6,14,'#d8bba4')}
function lantern(x,y,on=true){rect(x-3,y-70,6,70,'#343d4d');rect(x-13,y-83,26,6,'#66737c');rect(x-10,y-78,20,25,'#252e3e');rect(x-7,y-75,14,18,on?'#ffda9c':'#6a6479');rect(x-15,y-54,30,5,'#626c73');if(on)glow(x,y-67,90,'#ffbd6435')}

/* Environment v2: deterministic, distance-culled geometry. Uses no external image assets. */

const REGION_VARIANTS={
 yuji:['Academy Gates','Rain-washed Bamboo','Shibuya Subway','Sealed Overpass'],
 megumi:['Shadow Courtyard','Moonlit Cedar Forest','Ritualist Quarter','Forgotten Temple'],
 gojo:['Clan Observatory','Limitless Trial Field','Barrier Skyscrapers','Sealing Chamber'],
 sukuna:['Exile Hamlet','Bloodpine Forest','Heian Imperial Court','Cursed Throne'],
 custom:['Student Residence','Training Gauntlet','Night Patrol District','Final Examination']
};
function drawRegionalLandmarks(){
 const accent=ORIGINS[currentOrigin].accent;
 for(let i=0;i<4;i++){
  const left=ZONES[i].x,right=ZONES[i].end;
  const x=Math.floor((left+right)/2);
  if(x<cam-340||x>cam+visibleWidth()+340)continue;
  const y=groundY(x),name=REGION_VARIANTS[currentOrigin][i];
  // Different silhouettes and set pieces for each chapter within each origin.
  if(currentOrigin==='sukuna'){
   if(i===0){for(let j=-1;j<=1;j++){const bx=x+j*110;rect(bx-32,y-118,65,118,'#51343a');poly([[bx-49,y-120],[bx,y-172],[bx+49,y-120]],'#9f5647');rect(bx-8,y-58,18,58,'#241823')}}
   if(i===1){for(let j=0;j<5;j++){const bx=x-160+j*78;rect(bx-9,y-173,17,173,'#322d3c');poly([[bx-55,y-110],[bx,y-245],[bx+55,y-110]],'#653945')}}
   if(i===2){for(let j=0;j<4;j++){const bx=x-135+j*90;rect(bx-32,y-205,66,205,'#603c43');poly([[bx-46,y-207],[bx,y-254],[bx+46,y-207]],'#a66b53');for(let k=0;k<3;k++)rect(bx-22+k*19,y-140,12,52,'#211f2c')}}
   if(i===3){rect(x-145,y-165,290,165,'#3a2532');for(let j=0;j<7;j++)poly([[x-145+j*45,y-165],[x-124+j*45,y-205],[x-102+j*45,y-165]],'#8b4556');rect(x-50,y-90,100,90,'#181625')}
  }else if(currentOrigin==='megumi'){
   if(i===1){for(let j=0;j<7;j++){const bx=x-180+j*59;rect(bx-7,y-205,12,205,'#243d41');poly([[bx-46,y-90],[bx,y-260],[bx+48,y-90]],'#23534d')}}
   else{rect(x-135,y-147,270,147,'#1d2a38');poly([[x-166,y-149],[x,y-239],[x+166,y-149]],'#3b4b60');for(let j=0;j<8;j++)rect(x-111+j*30,y-95,18,71,'#314c5b')}
  }else if(currentOrigin==='gojo'){
   for(let j=0;j<5;j++){const bx=x-160+j*80,h=240+(j%3)*42;rect(bx-30,y-h,63,h,'#19354a');rect(bx-32,y-h,67,7,'#65b4d0');for(let k=0;k<8;k++)rect(bx-21,y-h+20+k*24,40,10,k%2?'#3b7b9a':'#a1ddec')}
   if(i===3){for(let r=0;r<4;r++){ctx.strokeStyle=accent;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y-120,55+r*21,time*.2+r,time*.2+r+Math.PI*1.3);ctx.stroke()}}
  }else if(currentOrigin==='custom'){
   rect(x-135,y-175,270,175,'#363052');poly([[x-163,y-179],[x,y-239],[x+163,y-179]],'#765d9c');for(let j=0;j<8;j++)rect(x-121+j*31,y-123,19,39,'#a48ad0');rect(x-39,y-66,78,66,'#181d39');
   if(i===3){glow(x,y-197,88,accent+'28');circle(x,y-194,16,accent)}
  }else{
   if(i===0){rect(x-138,y-146,275,146,'#364858');poly([[x-161,y-148],[x,y-216],[x+161,y-148]],'#6e5966');for(let j=0;j<6;j++)rect(x-116+j*40,y-99,25,80,'#576d73')}
   if(i===1){for(let j=0;j<7;j++){const bx=x-180+j*54;rect(bx-6,y-222,10,222,'#27483e');rect(bx-3,y-221,3,215,'#6a9273');for(let k=0;k<4;k++)poly([[bx,y-90-k*35],[bx-45,y-114-k*35],[bx-2,y-100-k*35]],'#397461')}}
   if(i===2){rect(x-196,y-94,390,94,'#282e48');rect(x-182,y-89,362,12,'#bc669c');for(let j=0;j<10;j++)rect(x-168+j*36,y-64,26,45,'#171e36');rect(x-31,y-73,62,73,'#8a668f')}
   if(i===3){rect(x-120,y-132,240,132,'#422e45');poly([[x-154,y-134],[x,y-216],[x+154,y-134]],'#6e4259');rect(x-39,y-85,77,85,'#1b1527')}
  }
  ctx.save();ctx.font='bold 13px monospace';ctx.textAlign='center';ctx.fillStyle='#f4e6f0';ctx.fillText('◆ '+name.toUpperCase(),x,y-270);ctx.restore();
 }
}
function drawEliteLabels(e){
 if((e.elite===undefined&&e.lifeBossStage===undefined)||e.dead)return;
 const x=e.x+e.w/2,y=e.y-23,accent=ORIGINS[currentOrigin].accent;
 ctx.save();ctx.textAlign='center';ctx.font='bold 12px sans-serif';ctx.fillStyle='#fff3ed';ctx.fillText(e.lifeBossTitle||e.eliteName,x,y-15);rect(x-46,y-8,92,6,'#171521');rect(x-46,y-8,Math.max(0,e.hp/e.max)*92,6,accent);ctx.restore();
}
function originMapMarkup(){
 const m=currentCampaignMission();
 return lifetimeMapMarkup()+'<div class="campaign-journal"><div class="eyebrow">'+ORIGINS[p.char].era+' · CAMPAIGN MAP</div><h2>'+ORIGINS[p.char].name+'</h2><p>Each region has its own scenery, commanders and landmarks. Current quest: '+(m?m.title:'Campaign complete')+'</p><div class="map">'+ZONES.map((z,i)=>'<div style="--accent:'+z.color+'" class="'+(i===zoneAt(p.x)?'current':'')+'"><small>REGION '+(i+1)+'</small><strong>'+REGION_VARIANTS[p.char][i]+'</strong><span>'+z.name+' · '+(i===zoneAt(p.x)?'YOU ARE HERE':(p.maxJourneyX||p.x)>z.end?'EXPLORED':'UNEXPLORED')+'</span></div>').join('')+'</div><h3>REGIONAL COMMANDERS</h3><div class="campaign-list">'+ELITE_TITLES[p.char].map((title,i)=>'<div class="campaign-entry '+((p.eliteDefeated||[]).includes(i)?'done':'active')+'"><b>'+(i+1)+'</b><div><strong>'+title+'</strong><small>Map position '+Math.round(originQuestPos(i))+'</small></div><span>' + ((p.eliteDefeated||[]).includes(i)?'DEFEATED':'ACTIVE')+'</span></div>').join('')+'</div><h3>CURSED SEALS</h3><p>'+(p.rituals||[]).length+' / 4 purified · Press E when standing beside one after defeating its commander.</p></div>';
}


const LIFE_SKIES=[
 ['#172945','#51687c'],['#182340','#4d5773'],['#111c38','#343e70'],['#211c44','#574873'],['#260f2b','#a3485a']
];
function drawLifetimeEnvironment(){
 const stage=currentLifeStage(),origin=currentOrigin,start=LIFE_STARTS[stage];
 const palette=LIFE_SKIES[stage],accent=ORIGINS[origin].accent;
 // Chapter boundaries visually shift from childhood neighborhoods to cities, ruins and future battlefields.
 const min=Math.max(0,Math.floor((cam-240)/220)),max=Math.min(36,Math.ceil((cam+visibleWidth()+240)/220));
 for(let i=min;i<=max;i++){
  const x=90+i*220,y=groundY(x);
  if(stage===0){
   rect(x-74,y-98,148,98,'#3a3850');rect(x-66,y-90,132,90,'#596077');
   poly([[x-90,y-98],[x,y-161],[x+90,y-98]],'#7b6779');
   for(let j=0;j<4;j++)rect(x-54+j*27,y-75,16,26,j%2?'#f3c899':'#252a42');
  }else if(stage===1){
   rect(x-62,y-151,124,151,'#2d3754');poly([[x-73,y-152],[x,y-197],[x+74,y-152]],'#68798a');
   rect(x-20,y-61,40,61,'#101b31');for(let j=0;j<4;j++)rect(x-47+j*26,y-127,14,32,'#94aabd');
  }else if(stage===2){
   const h=175+(i%3)*45;
   rect(x-75,y-h,149,h,'#17243c');rect(x-68,y-h+8,134,h-12,'#2a3753');
   for(let row=0;row<6;row++)for(let col=0;col<4;col++)rect(x-59+col*32,y-h+18+row*27,18,14,(row+col+i)%3===0?'#d58caf':'#687fa5');
   rect(x-78,y-h,157,7,accent);
  }else if(stage===3){
   rect(x-91,y-135,181,135,'#30263e');poly([[x-98,y-137],[x,y-198],[x+99,y-137]],'#72607a');
   for(let j=0;j<3;j++){const bx=x-53+j*53;rect(bx-12,y-107,25,59,'#15192c');rect(bx-9,y-99,19,42,'#8d9cb1')}
   if(i%2===0){glow(x,y-187,62,accent+'22');ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y-183,19+Math.sin(time*.9+i)*3,0,Math.PI*2);ctx.stroke()}
  }else{
   rect(x-80,y-55,165,55,'#332939');
   poly([[x-94,y-55],[x-38,y-116],[x-2,y-70],[x+41,y-130],[x+91,y-55]],'#4a3647');
   rect(x-37,y-49,19,48,'#151525');rect(x+30,y-33,33,33,'#171524');
   if(i%3===0){rect(x+67,y-130,10,130,'#763d50');glow(x+74,y-130,60,'#db627b25')}
  }
  if(origin==='custom'){
   // Custom sorcerers use a future timeline with neon technology and temporal anomalies.
   rect(x-77,y-119,6,119,'#7368a2');
   rect(x-92,y-123,34,20,stage<2?'#72d9ee':'#d77dff');
   if(stage>=2){
    ctx.save();ctx.globalAlpha=.55+.25*Math.sin(time*2+i);ctx.strokeStyle=stage>=3?'#e0a3ff':'#72f5e8';ctx.lineWidth=3;ctx.strokeRect(x-56,y-151,114,50);ctx.font='bold 15px monospace';ctx.textAlign='center';ctx.fillStyle='#c1f3f7';ctx.fillText(stage===2?'NEO CITY':stage===3?'RIFT 2074':'TOKYO 2084',x,y-122);ctx.restore();
    if(stage>=3){for(let j=0;j<4;j++){const angle=time*.65+j*Math.PI/2;circle(x+Math.cos(angle)*42,y-179+Math.sin(angle)*32,3,'#d68fff')}}
   }
  }else if(origin==='gojo'&&stage===1){
   for(let j=0;j<3;j++)rect(x-32+j*23,y-147,5,70,'#96c6ed');
  }else if(origin==='sukuna'&&stage<=1){
   for(let j=0;j<3;j++)poly([[x-78+j*63,y-99],[x-50+j*63,y-149],[x-22+j*63,y-99]],'#89464a');
  }
 }
 const end=LIFE_STARTS[stage]+900;
 if(end>cam-100&&end<cam+visibleWidth()+100&&!(p.lifeBossWins||[]).includes(stage)){
  const y=groundY(end)-140;
  glow(end,y,72,accent+'30');
  ctx.save();ctx.fillStyle='#fff1ed';ctx.textAlign='center';ctx.font='bold 12px monospace';ctx.fillText('STORY BOSS · '+lifeBossName(stage).toUpperCase(),end,y-35);ctx.restore();
 }
}
function lifetimeMapMarkup(){
 return '<div class="campaign-journal"><div class="eyebrow">LIFE CHRONICLE</div><h2>Five eras · One lifetime</h2><div class="campaign-list">'+LIFE_ARCS[p.char].map((arc,i)=>'<div class="campaign-entry '+(i<currentLifeStage()?'done':i===currentLifeStage()?'active':'pending')+'"><b>0'+(i+1)+'</b><div><strong>'+arc[0]+'</strong><small>'+arc[1]+' · '+arc[3]+'</small></div><span>'+(i<currentLifeStage()?'COMPLETED':i===currentLifeStage()?'CURRENT':'LOCKED')+'</span></div>').join('')+'</div></div>';
}

function drawEnhancedEnvironment(){
 const origin=ORIGINS[currentOrigin]||ORIGINS.yuji;
 const zone=zoneAt(p.x),accent=origin.accent;
 const min=Math.max(0,Math.floor((cam-260)/285)),max=Math.min(28,Math.ceil((cam+visibleWidth()+260)/285));
 const tree=(x,y,i)=>{
  let h=135+(i*29)%95;
  rect(x-9,y-h,18,h,'#253d41');rect(x-4,y-h,4,h,'#658b73');
  for(let j=0;j<4;j++){
   const yy=y-h+j*32;
   poly([[x-58+j*4,yy+34],[x,yy-24],[x+62-j*5,yy+34]],j%2?'#2b655d':'#346c5b');
   rect(x+5,yy+7,18,3,'#55907a');
  }
  rect(x-22,y-3,45,5,'#243a3a');
 };
 const pagoda=(x,y,i)=>{
  const w=100+(i%2)*20,h=120+(i%3)*27;
  rect(x-w/2,y-h,w,h,'#382c38');rect(x-w/2+6,y-h+13,w-12,h-18,'#47313c');
  for(let floor=0;floor<3;floor++){
   const yy=y-h+floor*43;
   poly([[x-w/2-17,yy+12],[x,yy-19],[x+w/2+17,yy+12],[x+w/2+9,yy+18],[x-w/2-9,yy+18]],floor%2?'#793e47':'#642e3e');
   for(let j=-1;j<=1;j++)rect(x+j*22-6,yy+20,11,16,'#c891694f');
  }
  rect(x-10,y-43,20,43,'#1d1623');rect(x-27,y-3,54,5,'#a26457');
 };
 const towers=(x,y,i)=>{
  const w=110+(i%3)*24,h=180+(i*17)%110;
  rect(x-w/2,y-h,w,h,'#1b2943');rect(x-w/2+8,y-h+8,w-16,h-8,'#253651');
  rect(x-w/2-6,y-h,w+12,9,'#628ba5');
  for(let row=0;row<7;row++)for(let col=0;col<4;col++){
   const xx=x-w/2+17+col*(w-27)/4,yy=y-h+22+row*22;
   rect(xx,yy,13,10,(row+col+i)%4===0?'#95cfdf':'#486b8a');
  }
  rect(x-23,y-65,48,59,'#0b1728');rect(x-27,y-69,55,6,'#88d9ef');
  glow(x,y-h+45,44,'#61c9e812');
 };
 const academy=(x,y,i)=>{
  const w=128+(i%2)*26,h=120+(i%2)*40;
  rect(x-w/2,y-h,w,h,'#323349');
  rect(x-w/2+7,y-h+7,w-14,h-13,'#4b4a61');
  poly([[x-w/2-15,y-h+4],[x,y-h-41],[x+w/2+15,y-h+4]],'#6a5374');
  for(let col=0;col<4;col++)for(let row=0;row<2;row++){
   const xx=x-w/2+14+col*27,yy=y-h+24+row*43;
   rect(xx,yy,17,29,'#151e32');rect(xx+3,yy+3,11,20,'#777da6');rect(xx+8,yy+2,2,23,'#242c47');
  }
  rect(x-12,y-42,24,42,'#19203b');
 };
 const torches=(x,y)=>{
  rect(x-3,y-45,6,45,'#4a3a3c');rect(x-11,y-49,22,6,'#bb8469');
  const flicker=Math.sin(time*8+x)*3;poly([[x-9,y-49],[x-3,y-64-flicker],[x+1,y-55],[x+7,y-70-flicker],[x+11,y-49]],'#f5a35d');
  glow(x,y-60,38,'#ef8d4019');
 };
 for(let i=min;i<=max;i++){
  const x=160+i*285,y=groundY(x);
  if(currentOrigin==='sukuna'){
   if(i%3===0)pagoda(x,y,i);else if(i%3===1)tree(x,y,i);else{rect(x-57,y-78,115,78,'#47353b');poly([[x-75,y-82],[x,y-143],[x+74,y-82]],'#763d47');rect(x-18,y-42,37,42,'#261c29')}
   if(i%2===0)torches(x+90,y);
   for(let j=0;j<4;j++)rect(x-140+j*61,y-3,36,3,'#72575a');
  }else if(currentOrigin==='megumi'){
   if(i%2===0)tree(x,y,i);else academy(x,y,i);
   for(let j=0;j<3;j++){const px=x-94+j*70;rect(px,y-12,4,12,'#5a6282');circle(px+2,y-15,3,'#ac9ecf')}
  }else if(currentOrigin==='gojo'){
   towers(x,y,i);
   rect(x-137,y-6,273,6,'#6d8498');for(let j=0;j<8;j++)rect(x-127+j*32,y-15,21,3,'#66899a');
   if(i%2===0)glow(x,y-136,80,'#87c8df15');
  }else if(currentOrigin==='custom'){
   academy(x,y,i);
   if(i%2===0){rect(x+76,y-100,4,100,'#68668c');glow(x+78,y-99,27,'#bd8df025')}
  }else{
   if(i%3===0)academy(x,y,i);else if(i%3===1)tree(x,y,i);else towers(x,y,i);
  }
  // Path cobbles and grass tufts are foreground decoration, not collision.
  const tile=currentOrigin==='sukuna'?'#75605b':currentOrigin==='megumi'?'#506d68':'#6a7282';
  for(let j=0;j<7;j++){rect(x-132+j*41,y-3,26,2,tile);if((i+j)%3===0)rect(x-128+j*41,y-8,3,5,'#426b63')}
 }
 // Floating ink-like motes, restricted to the visible region.
 for(let i=0;i<15;i++){
  const x=cam+((i*139+Math.sin(time*.5+i)*20)%(visibleWidth()+150)),y=240+(i*83)%300;
  circle(x,y,1.5,i%2?accent:'#c4d4e0');
 }
 const mission=currentCampaignMission();
 if(mission&&mission.type==='travel'){
  const goal=origin.start+mission.target;
  if(goal>=cam-70&&goal<=cam+visibleWidth()+70){
   const y=groundY(goal)-94;
   glow(goal,y,52,accent+'25');
   for(let j=0;j<4;j++)circle(goal+Math.cos(time*2+j*1.57)*24,y+Math.sin(time*2+j*1.57)*16,3,accent);
   ctx.save();ctx.fillStyle='#fff3e9';ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.fillText('QUEST DESTINATION',goal,y-40);ctx.restore();
  }
 }
}

function scenery(){for(const f of platforms){if(f.x+f.w<cam-100||f.x>cam+W+100)continue;if(f.h>100){rect(f.x,f.y,f.w,500,'#171c2b');rect(f.x,f.y,f.w,6,'#75828d');rect(f.x,f.y+6,f.w,12,'#3d4659');for(let x=f.x;x<f.x+f.w;x+=40){rect(x,f.y+19,38,16,'#2b3345');rect(x+3,f.y+38,35,16,'#242d40');rect(x+12,f.y+58,24,2,'#343a4c')}if(f.x===1500)for(let x=1500;x<3100;x+=35)rect(x,f.y-4,25,5,'#5a8879')}else{if(f.x>3100&&f.x<5700){building(f.x,f.y+8,f.w,562-f.y,true);rect(f.x-8,f.y,f.w+16,7,'#71768c')}else{rect(f.x,f.y,f.w,8,'#74817e');rect(f.x,f.y+8,f.w,12,'#333e4b');for(let x=f.x+15;x<f.x+f.w;x+=55)rect(x,f.y+15,8,20,'#343c4a')}}}
 if(currentOrigin!=='yuji'){drawOriginSet();return}
 // School courtyard and layered wooden buildings.
 for(let i=0;i<3;i++){let x=90+i*350;rect(x,422,290,140,'#344151');rect(x+12,435,266,110,'#222b3b');for(let j=0;j<6;j++){rect(x+25+j*40,450,27,65,'#8d8a7d');rect(x+25+j*40,480,27,3,'#34394b');rect(x+37+j*40,450,3,65,'#34394b')}roof(x-10,423,310,60)}torii(330,392,240);text('TOKYO JUJUTSU HIGH',485,548,'#c4c3bc',13,'center');
 // Bamboo and shrine trees give the grove its own silhouette.
 for(let i=0;i<32;i++){const x=1520+i*49;if(x<cam-80||x>cam+W+80)continue;const top=190+(i*71)%150;rect(x,top,7,612-top,'#284d4c');rect(x+2,top,2,612-top,'#557869');for(let yy=top+40;yy<570;yy+=55){rect(x-2,yy,11,4,'#74917d');poly([[x,yy],[x-30,yy-12],[x-58,yy-7],[x-15,yy+2]],'#355d56');poly([[x,yy-20],[x+30,yy-36],[x+55,yy-30],[x+10,yy-16]],'#3b675c')}}
 for(let i=0;i<7;i++){const x=3250+i*345;if(x<cam-180||x>cam+W+180)continue;rect(x,487,90,64,'#33354b');rect(x+7,493,76,45,'#121c30');const col=i%2?'#d865a0':'#61bec9';rect(x+4,490,82,4,col);text(i%2?'RAMEN':'TOKYO',x+45,520,col,16,'center');glow(x+45,508,90,col+'18');rect(x+155,425,5,137,'#596073');rect(x+145,424,25,8,'#a8afb3');glow(x+157,436,80,'#f6d4ab20')}
 for(let i=0;i<9;i++){const x=5760+i*210;rect(x,340,20,272,'#292536');poly([[x-75,402],[x+10,210],[x+95,402]],'#252e3b');poly([[x-95,462],[x+10,260],[x+115,462]],'#293742')}torii(6750,385,520);rect(6910,460,210,152,'#40313e');roof(6880,460,270,85);rect(6980,500,65,112,'#161b29');rect(6890,585,250,10,'#77707c');
 for(const s of shrines){lantern(s.x,groundY(s.x),true);if(p.checkpoint===s.x){circle(s.x,groundY(s.x)-104,3,'#c6ffdf')}}for(const ch of chests){const isOpen=opened.includes(ch.id);rect(ch.x-16,ch.y-22,32,22,'#745034');rect(ch.x-18,ch.y-25-(isOpen?9:0),36,9,'#b88751');rect(ch.x-2,ch.y-22,5,15,'#efc88b');if(!isOpen){glow(ch.x,ch.y-14,40,'#ffd17620');circle(ch.x,ch.y-38+Math.sin(time*2)*4,2,'#ffe3aa')}}}
function drawEnemy(e){
 if(e.dead)return;if(e.type==='dummy'){drawTrainingDummy(e);return}const boss=e.type==='boss',brute=e.type==='brute',spitter=e.type==='spitter',face=p.x>e.x?1:-1;
 const near=Math.abs(p.x-e.x)<650,moving=near&&Math.abs(p.x-e.x)>65&&e.wind<=0&&e.stun<=0;
 const stride=moving?Math.sin(time*(boss?6:brute?5:11)+e.id):Math.sin(time*2+e.id)*.15;
 const flash=e.hurt>0,palette=boss?['#352b43','#6c536d','#a57689','#f7afae']:brute?(e.lifeBossStage!==undefined?['#382335','#68364c','#b35d78','#ffbf9e']:['#23353e','#48686c','#82a29c','#d2dcb8']):spitter?['#282a48','#665785','#a88db1','#edc6e0']:['#302b48','#665174','#987592','#e2a8c6'];
 const [dark,mid,light,eye]=palette,paint=color=>flash?'#f1e9eb':color;
 function limb(ax,ay,bx,by,cx,cy,w,color){ctx.lineCap='square';ctx.lineJoin='miter';for(const [width,col]of [[w+3,'#111827'],[w,paint(color)],[Math.max(1,w*.2),paint(light)]]){ctx.strokeStyle=col;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);ctx.lineTo(cx,cy);ctx.stroke()}}
 const gy=e.y+e.h;ctx.save();ctx.translate(e.x+e.w/2,gy);ctx.scale(face,1);
 ctx.globalAlpha=.22;ctx.fillStyle='#000510';ctx.beginPath();ctx.ellipse(0,groundY(e.x)-gy,boss?52:brute?31:spitter?24:28,5,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
 if(e.wind>0){const pulse=.65+.35*Math.sin(time*22),warn=boss?'#ff6f9a':'#ffbd80';ctx.save();ctx.globalAlpha=pulse;ctx.strokeStyle=warn;ctx.lineWidth=boss?3:2;ctx.setLineDash([7,6]);ctx.beginPath();ctx.ellipse(0,-e.h*.48,boss?48:brute?35:26,e.h*.57,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=warn;ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.fillText('!',0,-e.h-12);ctx.restore()}
 if(boss){
  // Veilkeeper: articulated arms, layered armor, ceremonial mask and torn mantle.
  const sway=Math.sin(time*2)*2,charge=e.wind>0?1-e.wind/(e.phase===2?.6:.9):0;
  poly([[-30,-94],[-46,-64],[-39,-12],[-23,-24],[-12,-8],[0,-27],[20,-10],[40,-20],[47,-68],[28,-99]],paint(dark));
  for(let i=0;i<5;i++)poly([[-36+i*17,-70],[-41+i*17,-12+(i%2)*8],[-29+i*17,-22],[-24+i*17,-68]],paint(i%2?'#45374f':'#392f46'));
  limb(-14,-40,-19-stride*8,-20,-22-stride*12,-3,12,dark);limb(14,-40,20+stride*8,-22,23+stride*13,-2,13,mid);
  rect(-31-stride*12,-5,20,7,paint(dark));rect(12+stride*13,-4,22,7,paint(mid));
  limb(-26,-78,-48,-58-charge*20,-50,-37-charge*30,13,dark);
  limb(-22,-62,-40,-42,-34,-22,9,mid);
  const reach=e.wind>0?charge*20:0;
  limb(25,-78,42+reach*.5,-56-reach,41+reach,-36-reach*1.5,15,mid);
  limb(22,-62,40,-38,31,-19,10,dark);
  poly([[-26,-84],[-19,-91],[22,-90],[30,-80],[21,-46],[-17,-47]],paint(mid));
  for(let i=0;i<4;i++){const y=-80+i*8;poly([[-18,y],[22,y-1],[19,y+5],[-16,y+6]],paint(i%2?dark:'#826378'));rect(-14,y+1,28,1,paint(light))}
  circle(2,-71,8,paint('#392c48'));circle(2,-71,4,e.phase===2?'#ffc49c':'#df8fa9');
  poly([[-24,-48],[21,-48],[30,-26],[12,-33],[0,-22],[-13,-33],[-31,-24]],paint('#75566d'));rect(-20,-48,40,4,paint(light));
  poly([[-16,-97+sway],[-17,-115+sway],[0,-125+sway],[18,-115+sway],[16,-97+sway],[5,-88+sway],[-6,-89+sway]],paint('#bcabb0'));
  poly([[-14,-116+sway],[-22,-134+sway],[-17,-139+sway],[-7,-120+sway]],paint('#e6d4c4'));
  poly([[10,-119+sway],[22,-139+sway],[28,-137+sway],[17,-112+sway]],paint('#c6aeb4'));
  poly([[-11,-108+sway],[-2,-111+sway],[-3,-103+sway],[-10,-102+sway]],'#241c32');poly([[3,-110+sway],[13,-108+sway],[11,-102+sway],[4,-103+sway]],'#241c32');
  rect(-9,-107+sway,5,3,e.phase===2?'#fff0a9':'#f4a6ba');rect(5,-107+sway,5,3,e.phase===2?'#fff0a9':'#f4a6ba');
  poly([[-7,-96+sway],[0,-99+sway],[8,-96+sway],[4,-91+sway],[-4,-91+sway]],'#403047');
  for(const side of [-1,1]){const handX=side<0?-50:41+reach,handY=side<0?-37-charge*30:-36-reach*1.5;for(let i=0;i<3;i++)poly([[handX-6+i*5,handY],[handX-4+i*5,handY+13],[handX+i*5,handY+15],[handX-1+i*5,handY]],paint('#c6adb6'))}
  if(e.phase===2){ctx.strokeStyle='#efb188';ctx.lineWidth=1.5;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,-65,60+i*7,time*(i%2?1:-1)+i,time*(i%2?1:-1)+i+1.7);ctx.stroke()}glow(0,-72,100,'#f78c6a18')}
 }else if(brute){
  // Heavy curse: plated shoulders, enormous forearms and a distinct low head.
  limb(-12,-31,-17-stride*4,-15,-21-stride*6,-3,13,dark);limb(13,-31,20+stride*4,-15,22+stride*7,-2,14,mid);
  poly([[-25,-62],[-31,-43],[-24,-21],[22,-22],[30,-44],[23,-65]],paint(mid));
  poly([[-22,-58],[-15,-67],[17,-67],[24,-57],[12,-44],[-12,-44]],paint(light));
  for(let i=0;i<3;i++){rect(-16,-45+i*7,33,4,paint(dark));rect(-13,-44+i*7,27,1,paint(light))}
  const raised=e.wind>0?-25:0;
  limb(-24,-56,-35,-37+raised,-29,-13+raised,15,dark);limb(24,-56,39,-38+raised,36,-12+raised,18,mid);
  for(let side of [-1,1]){const hx=side<0?-29:36;poly([[hx-11,-18+raised],[hx+9,-19+raised],[hx+13,-4+raised],[hx-12,-4+raised]],paint(light));for(let j=0;j<3;j++)rect(hx-7+j*6,-5+raised,3,8,paint('#c9d8c1'))}
  poly([[-14,-64],[-18,-81],[-2,-88],[15,-80],[17,-65],[3,-57]],paint(mid));
  poly([[-15,-78],[-23,-91],[-17,-96],[-7,-82]],paint('#b3c7be'));poly([[8,-83],[17,-97],[23,-90],[16,-75]],paint('#b3c7be'));
  rect(-8,-76,8,4,'#e3b985');rect(6,-76,7,4,'#e3b985');rect(-8,-65,20,5,paint('#162b35'));for(let i=0;i<4;i++)rect(-6+i*5,-65,2,4,'#ced2bb');
 }else if(spitter){
  const bob=Math.sin(time*3+e.id)*4,charge=e.wind>0?1-e.wind/.65:0;
  poly([[-21,-45+bob],[-26,-20],[-16,-8],[-8,-17],[0,-4],[9,-16],[20,-8],[27,-23],[20,-45+bob]],paint(dark));
  poly([[-15,-46+bob],[-9,-55+bob],[10,-55+bob],[19,-42+bob],[16,-18],[-14,-18]],paint(mid));
  limb(-17,-40+bob,-30,-31+bob,-22,-20+bob,5,dark);limb(17,-40+bob,31,-34+bob,26,-20+bob,6,mid);
  poly([[-17,-52+bob],[-13,-69+bob],[2,-75+bob],[18,-61+bob],[15,-48+bob],[3,-43+bob]],paint(light));
  rect(-7,-61+bob,5,4,'#201d36');rect(6,-61+bob,6,4,'#201d36');circle(4,-51+bob,7+charge*4,'#241d37');circle(5,-51+bob,3+charge*3,'#e6b3de');
  if(e.wind>0)glow(5,-51+bob,45,'#cf9df345');
  for(let i=0;i<3;i++)circle(-12+i*12,-7+Math.sin(time*4+i)*3,1.5,'#b3a4d2');
 }else{
  // Fast curse: a hunched spine and four jointed, clawed limbs.
  limb(-9,-20,-23-stride*6,-13,-27-stride*8,-1,6,dark);limb(8,-20,23+stride*6,-12,29+stride*8,-1,7,mid);
  poly([[-19,-30],[-10,-43],[6,-40],[17,-23],[8,-11],[-10,-11],[-22,-20]],paint(mid));
  poly([[-12,-37],[-8,-40],[6,-36],[10,-25],[-3,-24]],paint(light));
  limb(-16,-28,-30,-20+stride*2,-35,-4,6,dark);limb(14,-28,28,-22-stride*2,33,-4,7,mid);
  for(const x of [-35,33]){rect(x-4,-3,12,3,paint(light));for(let i=0;i<3;i++)rect(x-2+i*4,-1,2,3,'#c1b3bd')}
  poly([[-11,-37],[-13,-53],[-3,-60],[13,-55],[19,-43],[12,-31],[0,-30]],paint(light));
  poly([[-11,-51],[-17,-65],[-10,-62],[-4,-54]],paint('#c1a8b4'));poly([[8,-55],[20,-64],[17,-52]],paint('#c1a8b4'));
  rect(-5,-48,7,4,'#281f38');rect(7,-48,7,4,'#281f38');rect(-4,-47,5,2,eye);rect(8,-47,5,2,eye);rect(0,-37,15,4,'#2d243c');for(let i=0;i<4;i++)rect(1+i*4,-37,2,4,'#ded0c6');
 }
 ctx.restore();
 if(e.lifeBossStage!==undefined){
  const stage=e.lifeBossStage,accent=['#9dbcef','#c68fe4','#f1a6c8','#7dd7c9','#ff797f'][stage]||'#e5a5cb';
  const x=e.x+e.w/2,y=e.y+e.h/2;
  ctx.save();
  ctx.strokeStyle=accent;ctx.lineWidth=2;
  ctx.globalAlpha=.38+.18*Math.sin(time*3+stage);
  ctx.beginPath();ctx.ellipse(x,y,37+stage*3,47+stage*3,0,0,Math.PI*2);ctx.stroke();
  for(let i=0;i<4+stage;i++){const angle=time*.45+i*Math.PI*2/(4+stage);circle(x+Math.cos(angle)*34,y+Math.sin(angle)*46,3,accent)}
  ctx.globalAlpha=1;
  ctx.fillStyle=accent;ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText(['I','II','III','IV','V'][stage]+' · '+(e.phase===3?'FINAL PHASE':e.phase===2?'ENRAGED':'GUARDIAN'),x,e.y-56);
  ctx.restore();
 }
 if(!boss&&e.hp<e.max){rect(e.x,e.y-20,e.w,3,'#201a2f');rect(e.x,e.y-20,e.w*Math.max(0,e.hp/e.max),3,'#c97caa')}
 if(e.wind>0){
  const radius=boss?(e.move==='slam'?170:100):brute?110:spitter?45:75;
  ctx.globalAlpha=.12+.08*Math.sin(time*18);ctx.fillStyle='#ffbb77';ctx.beginPath();ctx.ellipse(e.x+e.w/2,gy,radius,12,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  ctx.strokeStyle='#ffbc85';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(e.x+e.w/2,gy,radius,12,0,0,Math.PI*2);ctx.stroke();
  const label=e.lifeBossStage!==undefined?(e.move==='surge'?'AREA SHOCKWAVE':'CURSED VOLLEY'):boss?(e.move==='slam'?'SHOCKWAVE':'CURSED VOLLEY'):spitter?'SPIT':brute?'HEAVY STRIKE':'LUNGE';text(label,e.x+e.w/2,e.y-(boss?48:35),'#ffd6ad',9,'center');
 }
}

function drawDivineDog(s){
 ctx.save();ctx.translate(s.x,s.y);ctx.scale(Math.sign(s.vx),1);const phase=time*22+(s.fur==='#282d47'?Math.PI:0),fur=s.fur||'#d5d3e6',shade=fur==='#282d47'?'#141d32':'#8d92ad',edge=fur==='#282d47'?'#5c6988':'#eeedf7';
 const leg=(x,offset,far)=>{const step=Math.sin(phase+offset)*8,knee=x+step*.4,foot=x+step;ctx.strokeStyle='#11172b';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x,-6);ctx.lineTo(knee,4);ctx.lineTo(foot,12-Math.max(0,Math.cos(phase+offset))*6);ctx.stroke();ctx.strokeStyle=far?shade:fur;ctx.lineWidth=4;ctx.stroke();rect(foot-2,10-Math.max(0,Math.cos(phase+offset))*6,9,3,far?shade:fur)};
 leg(-18,0,true);leg(11,Math.PI,true);
 poly([[-28,-10],[-36,-24],[-44,-30],[-40,-16],[-27,-4]],shade);
 poly([[-28,-18],[-9,-22],[13,-19],[26,-25],[36,-18],[30,-7],[15,-3],[-22,-3],[-30,-8]],'#11172b');
 poly([[-26,-16],[-9,-19],[12,-16],[24,-22],[32,-17],[27,-8],[12,-6],[-22,-6]],fur);
 poly([[-22,-15],[-7,-18],[9,-15],[17,-13],[7,-11],[-20,-11]],edge);
 leg(-17,Math.PI,false);leg(12,0,false);
 poly([[13,-19],[18,-32],[24,-39],[27,-30],[34,-35],[35,-24],[43,-20],[44,-14],[34,-11],[23,-14]],fur);
 poly([[20,-31],[24,-36],[25,-29]],shade);poly([[29,-29],[33,-32],[33,-26]],shade);
 rect(32,-22,5,3,'#ec87be');rect(34,-22,2,2,'#ffe2ef');rect(41,-18,4,3,'#202438');rect(35,-13,8,2,'#1a2034');rect(37,-13,2,3,'#f6f3e8');
 // Forehead marking distinguishes the shikigami from an ordinary wolf.
 poly([[27,-29],[29,-25],[27,-22],[25,-25]],'#bd456d');glow(27,-23,40,'#ae82ec20');ctx.restore();
}
function drawNue(f){
 const flap=Math.sin(time*13)*20;ctx.save();ctx.translate(f.x,f.y);glow(0,0,130,'#ae7cf12a');
 for(const side of [-1,1]){ctx.save();ctx.scale(side,1);poly([[0,6],[30,-12],[85,-30-flap],[148,-18-flap*.6],[117,0],[67,18],[20,25]],'#6d5b91');
  for(let i=0;i<7;i++){const x=40+i*14,y=-8-i*2-flap*(i/7);poly([[x,y],[x+34,y-9],[x+21,y+19+i],[x+8,y+17+i]],i%2?'#a18bbf':'#b9a4d0');poly([[x+5,y+8],[x+24,y+1],[x+17,y+18+i]],'#796994')}
  ctx.restore()}
 poly([[-25,-4],[-13,-25],[10,-27],[28,-5],[15,30],[-12,30]],'#846d9f');
 poly([[-19,-15],[-11,-33],[6,-38],[23,-21],[20,-6],[5,7],[-8,4]],'#dbc5d6');
 poly([[-16,-24],[-25,-39],[-8,-32]],'#ae94bb');poly([[13,-28],[24,-39],[24,-21]],'#ae94bb');
 circle(-5,-20,5,'#4d365c');circle(12,-20,5,'#4d365c');circle(-4,-20,2,'#ffe5a4');circle(11,-20,2,'#ffe5a4');poly([[2,-15],[8,-15],[4,-7]],'#ae7d68');
 for(const x of [-9,10]){rect(x,27,4,14,'#b1a1af');for(let i=0;i<3;i++)poly([[x-4+i*4,38],[x-3+i*4,45],[x+i*4,39]],'#e6d7c3')}
 for(let i=0;i<4;i++){const a=time*4+i*Math.PI/2;ctx.strokeStyle='#d6c1ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(Math.cos(a)*70,Math.sin(a)*30);ctx.lineTo(Math.cos(a+.2)*85,Math.sin(a+.2)*40);ctx.lineTo(Math.cos(a+.4)*73,Math.sin(a+.4)*34);ctx.stroke()}
 ctx.restore();
}

function drawEffects(){for(const f of effects){const alpha=Math.min(1,f.t/f.max*2);ctx.globalAlpha=alpha;const progress=1-f.t/f.max;if(f.type==='cleave'){ctx.strokeStyle='#ffe9e5';ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(f.x-30+i*14,f.y-48);ctx.lineTo(f.x-10+i*14,f.y+48);ctx.stroke()}}else if(f.type==='flamecast'||f.type==='flameburst'){glow(f.x,f.y,100*(.4+progress),'#ff9d5555');for(let i=0;i<10;i++){const angle=i*Math.PI/5;const r=20+progress*80;poly([[f.x,f.y],[f.x+Math.cos(angle)*r,f.y+Math.sin(angle)*r],[f.x+Math.cos(angle+.2)*r*.5,f.y+Math.sin(angle+.2)*r*.5]],i%2?'#ff8356':'#ffe2a1')}}else if(f.type==='infinity'){ctx.strokeStyle='#a9f0ff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(f.x,f.y,38,52,0,0,Math.PI*2);ctx.stroke();glow(f.x,f.y,85,'#8be9ff30');text('∞',f.x,f.y+7,'#dcfaff',26,'center')}else if(f.type==='impact'){ctx.strokeStyle='#fff5ef';ctx.lineWidth=2;for(let i=0;i<4;i++){const angle=i*Math.PI/2+Math.PI/4;ctx.beginPath();ctx.moveTo(f.x+Math.cos(angle)*8,f.y+Math.sin(angle)*8);ctx.lineTo(f.x+Math.cos(angle)*25,f.y+Math.sin(angle)*25);ctx.stroke()}}else if(f.type==='ghost'){ctx.globalAlpha=alpha*.22;person(f.x,f.y,p.char,f.face,'dash',{ghost:true})}else if(f.type==='slash'){ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.dir,1);ctx.strokeStyle=f.color;ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,f.size,-1.1+progress*.5,1.1+progress*.5);ctx.stroke();ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,f.size+9,-1,.9);ctx.stroke();ctx.restore()}else if(f.type==='blue'||f.type==='red'||f.type==='purple'){const r=(f.type==='blue'?30:40)*(1+Math.sin(time*20)*.1);glow(f.x,f.y,r*4,f.color+'60');circle(f.x,f.y,r,f.color);circle(f.x,f.y,r*.55,'#eefaff');for(let i=0;i<6;i++){const a=time*5+i*Math.PI/3;ctx.strokeStyle=f.color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(f.x,f.y,45+i*4,a,a+1);ctx.stroke()}}else if(f.type==='nue'){drawNue(f)}else if(f.type==='lightning'){ctx.strokeStyle='#e4caff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(f.x-30,80);ctx.lineTo(f.x+15,230);ctx.lineTo(f.x-15,260);ctx.lineTo(f.x,f.y);ctx.stroke();glow(f.x,f.y,80,'#b99aff60')}else if(f.type==='domain'){ctx.strokeStyle=f.color;ctx.lineWidth=5;ctx.beginPath();ctx.arc(f.x,f.y,50+progress*1000,0,7);ctx.stroke()}else if(f.type==='shockwave'){ctx.strokeStyle=f.color;ctx.lineWidth=7;ctx.beginPath();ctx.ellipse(f.x,f.y,30+progress*300,15+progress*30,0,0,7);ctx.stroke()}else if(f.type==='blackflash'){for(let i=0;i<8;i++){const a=i*Math.PI/4;poly([[f.x,f.y],[f.x+Math.cos(a)*150,f.y+Math.sin(a)*150],[f.x+Math.cos(a+.08)*60,f.y+Math.sin(a+.08)*60]],'#180b1b');ctx.strokeStyle='#ff285d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(f.x+Math.cos(a)*110,f.y+Math.sin(a)*110);ctx.stroke()}glow(f.x,f.y,100,'#ff225544')}else{ctx.strokeStyle=f.color;ctx.lineWidth=3;ctx.beginPath();ctx.arc(f.x,f.y,15+progress*70,0,7);ctx.stroke()}}ctx.globalAlpha=1;for(const s of shots){if(s.type==='flame'){ctx.save();ctx.translate(s.x,s.y);ctx.scale(Math.sign(s.vx),1);glow(0,0,70,'#ff9b5545');for(let i=0;i<7;i++){const back=-8-i*10;poly([[back,Math.sin(time*24+i)*7],[back-22,-15+i],[back-15,0],[back-24,14-i]],i%2?'#ff713d':'#ffc179')}poly([[22,0],[-9,-10],[-3,0],[-9,10]],'#fff0c1');ctx.restore()}else if(s.type==='dismantle'){ctx.save();ctx.translate(s.x,s.y);ctx.rotate(-.6);rect(-2,-24,4,48,'#fff1ed');rect(-4,-14,1,38,'#f17e8e');ctx.restore()}else if(s.type==='dog'){drawDivineDog(s)}else if(s.type==='wave'){ctx.strokeStyle=s.color;ctx.lineWidth=5;ctx.beginPath();ctx.arc(s.x,s.y+18,31,Math.PI,Math.PI*2);ctx.stroke();glow(s.x,s.y,48,s.color+'35');rect(s.x-30,s.y+17,60,3,s.color)}else{for(let trail=1;trail<=3;trail++){ctx.globalAlpha=.3/trail;circle(s.x-s.vx*.018*trail,s.y-s.vy*.018*trail,Math.max(2,8-trail*2),s.color)}ctx.globalAlpha=1;glow(s.x,s.y,35,s.color+'55');circle(s.x,s.y,s.type==='purple'?30:s.type==='red'?15:7,s.color);circle(s.x,s.y,3,'#fff3f5');if(s.type==='purple'){circle(s.x-8,s.y,11,'#ff89b6');circle(s.x+8,s.y,11,'#88d9ff');circle(s.x,s.y,13,'#e5c9ff');ctx.strokeStyle='#e6c4ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(s.x,s.y,38,time*12,time*12+4.5);ctx.stroke()}}}}
function drawThreatWarnings(){if(!started||paused)return;const left=enemies.some(e=>!e.dead&&e.wind>0&&e.x+e.w<cam&&Math.abs(e.x-p.x)<1000),right=enemies.some(e=>!e.dead&&e.wind>0&&e.x>cam+visibleWidth()&&Math.abs(e.x-p.x)<1000);if(left){rect(7,337,78,22,'#201b29e0');text('◀  INCOMING',14,352,'#ffce9e',9)}if(right){rect(W-85,337,78,22,'#201b29e0');text('INCOMING  ▶',W-78,352,'#ffce9e',9)}}
function drawAmbient(){if(domainTime>0||!started)return;const z=zoneIndex;if(z===2){ctx.strokeStyle='#a1c7de25';ctx.lineWidth=1;for(let i=0;i<55;i++){const x=((i*73+time*90)%(W+70)+W+70)%(W+70),y=((i*113+time*310)%780)-30;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-6,y+16);ctx.stroke()}}else{for(let i=0;i<18;i++){const x=((i*121+time*(z===1?21:12))%(W+60)+W+60)%(W+60)-30,y=130+((i*47+time*(z===3?-15:9))%480+480)%480;ctx.globalAlpha=.24;if(z===1){poly([[x-4,y],[x,y-2],[x+7,y+1],[x,y+2]],'#91c2a7')}else if(z===3)circle(x,y,1.5,'#f6bda1');else poly([[x,y-2],[x+3,y],[x+1,y+3],[x-2,y+1]],'#e9afbf')}ctx.globalAlpha=1}}
function drawDomainWorld(){
 if(domainTime<=0)return;const x=p.x+17,y=groundY(p.x),fade=Math.min(1,domainTime,6-domainTime);ctx.save();ctx.globalAlpha=fade*.75;
 if(p.char==='megumi'){
  poly([[x-650,y],[x-650,y-9],...Array.from({length:25},(_,i)=>[x-650+i*55,y-10-Math.sin(time*3+i)*8]),[x+670,y+25],[x-650,y+25]],'#080e21');
  for(let i=0;i<13;i++){const sx=x-570+i*95,sy=groundY(Math.max(0,sx));const rise=(Math.sin(time*2+i)+1)*12;poly([[sx-8,sy],[sx-6,sy-25-rise],[sx-13,sy-39-rise],[sx-8,sy-43-rise],[sx-2,sy-32-rise],[sx+1,sy-49-rise],[sx+5,sy-47-rise],[sx+5,sy-31-rise],[sx+11,sy-37-rise],[sx+14,sy-34-rise],[sx+7,sy-20-rise],[sx+8,sy]],'#171d39');circle(sx,sy-13-rise,2,'#b49cde')}
  for(let i=0;i<3;i++)drawDivineDog({x:x-320+((time*140+i*240)%700),y:y-18,vx:1,fur:i%2?'#282d47':'#9293b8'});
 }else if(p.char==='gojo'){
  for(let i=0;i<5;i++){ctx.strokeStyle=i%2?'#87ceec55':'#b3a4f855';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,p.y+25,100+i*75,70+i*42,time*.15+i*.2,0,Math.PI*2);ctx.stroke()}
  for(let i=0;i<18;i++){const sx=x-530+(i*67+time*14)%1060,sy=p.y-220+(i*41)%430;text(i%3?'∞':'0 1',sx,sy,'#9bcbe57a',9)}
 }else if(p.char==='sukuna'){
  // A shrine silhouette rises behind the caster, with teeth along its entrance.
  const sx=x-115,sy=y-130;rect(sx,sy,230,130,'#41323f');roof(sx-22,sy,274,65);rect(sx+64,sy+33,102,97,'#100e1b');
  for(let i=0;i<8;i++){poly([[sx+67+i*12,sy+34],[sx+74+i*12,sy+34],[sx+71+i*12,sy+55]],'#c6b7b0');poly([[sx+67+i*12,sy+126],[sx+74+i*12,sy+126],[sx+71+i*12,sy+111]],'#c6b7b0')}
  rect(sx-15,y-8,260,8,'#997f85');torii(x-160,y-220,320);
  for(let i=0;i<9;i++){const sx2=x-600+((time*420+i*155)%1200);ctx.strokeStyle='#e6a3a777';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx2,p.y-210);ctx.lineTo(sx2+160,p.y+160);ctx.stroke()}
 }else{
  ctx.strokeStyle='#ff8fa655';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(x,y-2,130+i*130,18+i*11,0,0,Math.PI*2);ctx.stroke()}
  for(let i=0;i<24;i++){const a=i*Math.PI/12+time*.15,r=260+Math.sin(time*3+i)*25;circle(x+Math.cos(a)*r,p.y+25+Math.sin(a)*130,2,i%3?'#ff718a':'#fff1e0')}
 }
 ctx.restore();
}
function updatePortrait(){const frameIndex=Math.floor(time*3)%4,key=p.char+'/'+frameIndex;if(key===portraitKey)return;portraitKey=key;const g=$('#portrait').getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,46,46);g.drawImage((sprites[p.char]||sprites[p.customStyle]||sprites.yuji).idle[frameIndex],14,0,58,58,0,0,46,46)}

function draw(){background();ctx.save();if(settings.shake&&shake>0&&!paused)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);ctx.translate(0,worldOffsetY());ctx.scale(cameraZoom(),cameraZoom());ctx.translate(-Math.round(cam),0);scenery();if(started){drawEnhancedEnvironment();drawLifetimeEnvironment();drawRegionalLandmarks();drawQuestLandmarks();drawDomainWorld();for(const e of enemies)if(e.x>cam-200&&e.x<cam+W+200){drawEnemy(e);drawEliteLabels(e)}const instructorX=ORIGINS[currentOrigin].start+65;person(instructorX,groundY(instructorX)-70,'supervisor',1,'idle');text(quest===1&&kills>=5?'REPORT READY':'INSTRUCTOR',instructorX+16,groundY(instructorX)-90,'#edd6b0',10,'center');if(p.castTime>0||domainTime>0){const color=CAST[p.char].color;glow(p.x+17,p.y+35,65,color+'25');ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(p.x+17,p.y+69,32,7,0,0,Math.PI*2);ctx.stroke();for(let i=0;i<5;i++){const angle=time*8+i*Math.PI*2/5;circle(p.x+17+Math.cos(angle)*28,p.y+35+Math.sin(angle)*30,2,color)}}if(p.inv<=0||REDUCED_MOTION||Math.floor(time*16)%2===0)person(p.x,p.y,p.char,p.face,p.hurtTime>0?'hurt':p.dash>0?'dash':p.castTime>0?'cast':p.attack>0?'attack':p.hovering?'hover':!p.ground?(p.vy>0?'fall':'jump'):Math.abs(p.vx)>15?'walk':'idle');drawEffects();drawTechniqueOverlays();drawCharacterTechniqueVFX();for(const q of particles){ctx.globalAlpha=Math.min(1,q.t*3);rect(q.x,q.y,q.size,q.size,q.color)}ctx.globalAlpha=1;for(const t of texts){ctx.globalAlpha=Math.min(1,t.t*2);text(t.s,t.x,t.y,t.color,17,'center')}ctx.globalAlpha=1}for(let i=0;i<35;i++){let x=((i*191+time*(i%2?24:-14))%8000+8000)%8000,y=240+(i*43)%330+Math.sin(time+i)*20;if(x>cam&&x<cam+W){ctx.globalAlpha=.35;circle(x,y,1.5,ZONES[zoneIndex].color);ctx.globalAlpha=1}}ctx.restore();drawAmbient();drawThreatWarnings();drawMissionBeacon();drawCombatThreatIndicator();const vignette=ctx.createRadialGradient(W/2,350,200,W/2,350,W*.8);vignette.addColorStop(0,'transparent');vignette.addColorStop(1,'#040711a0');ctx.fillStyle=vignette;ctx.fillRect(0,0,W,720);if(domainTime>0){ctx.strokeStyle=CAST[p.char].color;ctx.lineWidth=3;ctx.strokeRect(13,13,W-26,694);for(let i=0;i<35;i++){let x=(i*131+time*30)%W;rect(x,20+(i*67)%680,2,2,CAST[p.char].color)}text(CAST[p.char].domain.toUpperCase(),W/2,175,CAST[p.char].color,W<700?12:18,'center');if(domainTime>4.6){const t=6-domainTime,alpha=Math.min(1,t*7,(domainTime-4.6)*4);ctx.save();ctx.globalAlpha=alpha;rect(0,210,W,180,'#0b0e1dee');rect(0,210,W,2,CAST[p.char].color);rect(0,388,W,2,CAST[p.char].color);const compact=W<700,left=compact?16:W/2-260,portraitX=compact?W-112:W/2+110;const nameSize=compact?Math.max(10,Math.min(18,(W-130)/CAST[p.char].domain.length*1.7)):25;text('DOMAIN EXPANSION',left,258,'#c3b5c9',compact?8:10);text(CAST[p.char].domain,left,302,CAST[p.char].color,nameSize);text(CAST[p.char].name,left,330,'#e1dbe5',compact?9:12);ctx.imageSmoothingEnabled=false;ctx.drawImage(sprites[p.char].cast[4],12,0,72,75,portraitX,compact?235:215,compact?100:166,compact?104:173);ctx.restore()}}if(zoneTime>0&&started){ctx.globalAlpha=Math.min(1,zoneTime,4-zoneTime);text('0'+(zoneIndex+1)+'  /  '+ZONES[zoneIndex].name.toUpperCase(),W/2,235,'#f0e7e3',25,'center');text(ZONES[zoneIndex].sub,W/2,262,'#b9b9c9',12,'center');ctx.globalAlpha=1}}
// Original, code-authored pixel sprites. Pixel geometry is rendered without
// smoothing so every animation remains sharp at fractional window sizes.
const PALETTES={
yuji:{ink:'#101525',shade:'#19263e',cloth:'#263e5a',mid:'#365773',light:'#55758b',edge:'#7d9aab',skin:'#e9ad8d',skinLight:'#ffcfad',skinShade:'#bd796e',hair:'#d9798d',hairLight:'#f5a5a1',hairShade:'#9f4d6c',accent:'#c53c59',accentLight:'#ef6474',sole:'#201b31',shoe:'#be374d',eye:'#533b47'},
sukuna:{ink:'#201827',shade:'#302435',cloth:'#d0c9c3',mid:'#b9aaa8',light:'#f2e4d8',edge:'#e5d2bf',skin:'#d99f86',skinLight:'#f7c5a3',skinShade:'#ac6f66',hair:'#bb6474',hairLight:'#e59791',hairShade:'#7d3b54',accent:'#3d2a37',accentLight:'#806070',sole:'#261e2b',shoe:'#3e2936',eye:'#e4484c'},
megumi:{ink:'#0d1324',shade:'#172338',cloth:'#243650',mid:'#344e70',light:'#4c6986',edge:'#71859b',skin:'#e2b291',skinLight:'#f8cdb0',skinShade:'#ac7e77',hair:'#142333',hairLight:'#385268',hairShade:'#0b1524',accent:'#d8b65b',accentLight:'#f6d488',sole:'#1b1926',shoe:'#705441',eye:'#2b7883'},
gojo:{ink:'#111729',shade:'#172238',cloth:'#24354d',mid:'#37516c',light:'#54738c',edge:'#85a3b2',skin:'#e7bda2',skinLight:'#ffdbc0',skinShade:'#b4837b',hair:'#dce8eb',hairLight:'#fcfaff',hairShade:'#97bacb',accent:'#778fa6',accentLight:'#b4c7d8',sole:'#111725',shoe:'#25384d',eye:'#71e5f4'}
};
const BASE_PALETTES=JSON.parse(JSON.stringify(PALETTES));
function makeFrame(char,state,phase=0,variant=0){
 const a=document.createElement('canvas');a.width=96;a.height=108;const g=a.getContext('2d'),pal=PALETTES[char];g.imageSmoothingEnabled=false;
 const box=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
 const poly=(points,col)=>{g.fillStyle=col;g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(Math.round(x),Math.round(y)):g.moveTo(Math.round(x),Math.round(y)));g.closePath();g.fill()};
 const walking=state==='walk',running=state==='dash',air=state==='jump'||state==='fall',striking=state==='attack',casting=state==='cast',hurtState=state==='hurt';
 const cycle=walking?Math.sin(phase):0,cos=walking?Math.cos(phase):0,idle=state==='idle'?Math.sin(phase)*.7:0;
 const progress=phase/(Math.PI*2),swing=striking?Math.sin(Math.min(1,progress)*Math.PI):0,cast=casting?Math.sin(Math.min(1,progress)*Math.PI):0;
 const tall=char==='gojo'?4:char==='megumi'?2:0,bob=walking?Math.abs(cos)*1.5:running?Math.sin(phase)*1.2:casting?cast*.8:idle,lean=running?10+Math.sin(phase):striking?swing*4:hurtState?-3-Math.cos(phase)*2:walking?2:0;
 const pelvis={x:37+lean*.3,y:67-bob},shoulder={x:37+lean,y:44-tall-bob},head={x:39+lean,y:30-tall-bob};
 // Draw a tapered pixel limb in three shaded bands, with a crisp dark border.
 function segment(from,to,width,color,highlight=true){const dx=to.x-from.x,dy=to.y-from.y,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;const shape=(w,col,off=0)=>poly([[from.x+nx*w+off,from.y+ny*w],[to.x+nx*w+off,to.y+ny*w],[to.x-nx*w+off,to.y-ny*w],[from.x-nx*w+off,from.y-ny*w]],col);shape(width/2+1.2,pal.ink);shape(width/2,color);if(highlight){g.strokeStyle=pal.light;g.lineWidth=2;g.beginPath();g.moveTo(Math.round(from.x+nx*(width/2-1)),Math.round(from.y+ny*(width/2-1)));g.lineTo(Math.round(to.x+nx*(width/2-1)),Math.round(to.y+ny*(width/2-1)));g.stroke()}}
 function boot(x,y,far=false){poly([[x-5,y-3],[x+4,y-3],[x+5,y+1],[x+10,y+3],[x+10,y+7],[x-7,y+7],[x-7,y+2]],pal.ink);box(x-5,y-2,9,7,far?pal.shade:pal.shoe);box(x+1,y+2,7,3,far?pal.shade:pal.shoe);box(x-5,y+6,15,2,pal.sole);if(!far){box(x-4,y,5,1,pal.edge);box(x+3,y+3,4,1,char==='yuji'?pal.accentLight:pal.light)}}
 function hand(x,y,fist=true){box(x-4,y-3,8,8,pal.ink);box(x-3,y-2,6,6,pal.skin);box(x-2,y-2,5,2,pal.skinLight);box(x+3,y,2,fist?3:7,pal.skinShade);if(!fist){box(x+2,y-6,2,7,pal.skinLight);box(x+5,y-5,2,7,pal.skin)}}
 let farFoot={x:36-cycle*12,y:97-Math.max(0,cos)*7},nearFoot={x:39+cycle*14,y:97-Math.max(0,-cos)*7},farKnee={x:33-cycle*5,y:82-Math.max(0,cos)*4},nearKnee={x:41+cycle*6,y:82-Math.max(0,-cos)*4};
 if(state==='idle'&&char==='yuji'){farKnee={x:30,y:82};farFoot={x:27,y:97};nearKnee={x:45,y:82};nearFoot={x:49,y:97}}
 if(air){farKnee={x:28,y:78};farFoot={x:23+Math.cos(phase)*2,y:89};nearKnee={x:49,y:74};nearFoot={x:52,y:86+Math.cos(phase)*2};if(state==='fall'){farFoot.y+=6;nearFoot.y+=8}}
 if(running){farKnee={x:22,y:73};farFoot={x:12,y:84+Math.cos(phase)*3};nearKnee={x:49,y:80};nearFoot={x:56+Math.cos(phase)*2,y:96}}
 if(striking&&variant===2){nearKnee={x:50+swing*8,y:77-swing*12};nearFoot={x:53+swing*19,y:94-swing*26}}
 const hipFar={x:33+lean*.3,y:pelvis.y},hipNear={x:42+lean*.3,y:pelvis.y};
 segment(hipFar,farKnee,11,pal.shade,false);segment(farKnee,farFoot,9,pal.shade,false);boot(farFoot.x,farFoot.y,true);
 let farElbow={x:31+cycle*8+lean,y:55-tall-bob},farHand={x:33+cycle*14+lean,y:66-tall-bob};
 if(state==='idle'&&char==='yuji'){farElbow={x:26,y:53-bob};farHand={x:32,y:41-bob}}
 if(running){farElbow={x:21,y:48};farHand={x:17,y:56}}if(air){farElbow={x:26,y:49};farHand={x:24,y:39}}if(casting){farElbow={x:34,y:51-tall};farHand={x:44-cast*2,y:44-tall-cast*2}}
 segment({x:32+lean,y:shoulder.y+1},farElbow,8,pal.shade,false);segment(farElbow,farHand,7,pal.shade,false);hand(farHand.x,farHand.y);
 // Broad hoodie on Yuji, fitted high collar on Megumi, longer silhouette on Gojo.
 const bodyWidth=char==='yuji'||char==='sukuna'?13:11;
 poly([[shoulder.x-bodyWidth,shoulder.y-1],[shoulder.x+9,shoulder.y-2],[pelvis.x+12,pelvis.y+2],[pelvis.x-11,pelvis.y+2]],pal.ink);
 poly([[shoulder.x-bodyWidth+2,shoulder.y+1],[shoulder.x+7,shoulder.y],[pelvis.x+10,pelvis.y],[pelvis.x-9,pelvis.y]],pal.cloth);
 poly([[shoulder.x+3,shoulder.y+2],[shoulder.x+7,shoulder.y+2],[pelvis.x+9,pelvis.y-2],[pelvis.x+5,pelvis.y-2]],pal.mid);
 poly([[shoulder.x-bodyWidth+3,shoulder.y+6],[shoulder.x-5,shoulder.y+9],[pelvis.x-5,pelvis.y-3],[pelvis.x-9,pelvis.y-1]],pal.shade);
 box(pelvis.x-9,pelvis.y-2,19,4,pal.shade);box(pelvis.x-4,pelvis.y-1,8,1,pal.light);box(shoulder.x+5,shoulder.y+10,2,3,pal.accent);
 segment(hipNear,nearKnee,char==='yuji'?12:10,pal.cloth);segment(nearKnee,nearFoot,char==='yuji'?10:9,pal.cloth);boot(nearFoot.x,nearFoot.y);
 box(nearKnee.x-3,nearKnee.y-2,6,2,pal.shade);box(pelvis.x+7,pelvis.y+7,2,8,pal.light);
 // Neck and a side-facing face, with separate eyebrow, ear and jaw pixels.
 box(head.x-3,head.y+9,8,8,pal.skinShade);poly([[head.x-9,head.y-10],[head.x+8,head.y-9],[head.x+11,head.y+2],[head.x+15,head.y+4],[head.x+13,head.y+8],[head.x+9,head.y+14],[head.x-3,head.y+13],[head.x-8,head.y+6]],pal.ink);
 poly([[head.x-6,head.y-7],[head.x+7,head.y-6],[head.x+9,head.y+3],[head.x+12,head.y+4],[head.x+10,head.y+8],[head.x+6,head.y+12],[head.x-2,head.y+10],[head.x-6,head.y+4]],pal.skin);
 box(head.x-2,head.y-5,7,6,pal.skinLight);box(head.x+7,head.y+4,4,2,pal.skinLight);box(head.x-6,head.y+1,3,5,pal.skinShade);box(head.x-5,head.y+1,2,3,pal.skinLight);box(head.x+6,head.y+9,4,1,pal.skinShade);
 if(char==='yuji'||char==='sukuna'){
  // Cropped dark sides and separate pink crown spikes.
  poly([[head.x-10,head.y+3],[head.x-11,head.y-7],[head.x-8,head.y-12],[head.x+8,head.y-11],[head.x+10,head.y-5],[head.x+6,head.y-2],[head.x-5,head.y-3],[head.x-5,head.y+3]],pal.hairShade);
  poly([[head.x-12,head.y-7],[head.x-10,head.y-14],[head.x-6,head.y-12],[head.x-3,head.y-17],[head.x+1,head.y-13],[head.x+6,head.y-16],[head.x+8,head.y-11],[head.x+12,head.y-9],[head.x+9,head.y-5],[head.x+4,head.y-6],[head.x,head.y-4],[head.x-5,head.y-6]],pal.hair);
  poly([[head.x-7,head.y-11],[head.x-3,head.y-14],[head.x-2,head.y-10],[head.x+4,head.y-12],[head.x+6,head.y-8],[head.x,head.y-7]],pal.hairLight);box(head.x+5,head.y-1,5,1,pal.hairShade);box(head.x+6,head.y+1,3,2,pal.eye);box(head.x+8,head.y+1,1,1,'#fff4e6');
  if(char==='sukuna'){
   // Facial tattoos, secondary eyes, a white wrap jacket and dark waist sash.
   box(head.x+5,head.y-3,6,2,'#442332');box(head.x+3,head.y+4,7,1,'#502734');box(head.x+1,head.y+6,3,1,'#502734');box(head.x+5,head.y+7,2,3,'#502734');box(head.x-2,head.y-4,2,5,'#502734');box(head.x-3,head.y+2,2,5,'#502734');box(head.x+7,head.y+4,2,1,'#e4484c');
   poly([[shoulder.x-11,shoulder.y-6],[shoulder.x-4,shoulder.y-5],[shoulder.x+3,shoulder.y+14],[shoulder.x+8,shoulder.y-5],[shoulder.x+13,shoulder.y-3],[shoulder.x+5,shoulder.y+24]],pal.light);
   poly([[shoulder.x-5,shoulder.y-5],[shoulder.x+1,shoulder.y+10],[shoulder.x+7,shoulder.y-4],[shoulder.x+3,shoulder.y+17]],pal.ink);
   box(pelvis.x-10,pelvis.y-5,22,7,pal.accent);box(pelvis.x+6,pelvis.y,4,14,pal.accent);box(pelvis.x+4,pelvis.y+3,9,3,pal.accentLight);
  }else{
  poly([[shoulder.x-12,shoulder.y-3],[shoulder.x-8,shoulder.y-8],[shoulder.x+9,shoulder.y-7],[shoulder.x+12,shoulder.y-1],[shoulder.x+6,shoulder.y+3],[shoulder.x-6,shoulder.y+3]],pal.accent);box(shoulder.x-6,shoulder.y-5,12,3,pal.accentLight);box(shoulder.x-10,shoulder.y+1,4,12,pal.accent);box(shoulder.x-8,shoulder.y+10,3,2,pal.accentLight);
  // Hoodie cord and displaced scarf tail during locomotion.
  box(shoulder.x+2,shoulder.y+4,1,8,pal.accentLight);box(shoulder.x+5,shoulder.y+4,1,10,pal.accentLight);
  if(walking||running)poly([[shoulder.x-10,shoulder.y-4],[shoulder.x-24,shoulder.y-5-Math.sin(phase)*3],[shoulder.x-30,shoulder.y],[shoulder.x-14,shoulder.y+2]],pal.accent);
  }
 }else if(char==='megumi'){
  poly([[head.x-11,head.y+3],[head.x-13,head.y-7],[head.x-19,head.y-12],[head.x-10,head.y-12],[head.x-12,head.y-22],[head.x-5,head.y-17],[head.x-1,head.y-26],[head.x+3,head.y-17],[head.x+11,head.y-24],[head.x+11,head.y-15],[head.x+20,head.y-17],[head.x+13,head.y-8],[head.x+15,head.y-4],[head.x+5,head.y-3],[head.x+3,head.y+1],[head.x-1,head.y-3],[head.x-6,head.y+5]],pal.hairShade);
  poly([[head.x-10,head.y-10],[head.x-10,head.y-17],[head.x-5,head.y-13],[head.x-1,head.y-21],[head.x+2,head.y-13],[head.x+8,head.y-18],[head.x+7,head.y-10],[head.x+14,head.y-13],[head.x+9,head.y-6],[head.x+3,head.y-6],[head.x-1,head.y-8]],pal.hair);box(head.x-6,head.y-11,5,2,pal.hairLight);box(head.x+1,head.y-13,2,5,pal.hairLight);box(head.x+5,head.y,5,1,pal.hairShade);box(head.x+6,head.y+2,3,2,pal.eye);box(head.x+8,head.y+2,1,1,'#9ae8d4');
  poly([[shoulder.x-10,shoulder.y-7],[shoulder.x+10,shoulder.y-8],[shoulder.x+11,shoulder.y+2],[shoulder.x-8,shoulder.y+3]],pal.ink);box(shoulder.x-8,shoulder.y-6,17,8,pal.cloth);box(shoulder.x+7,shoulder.y-5,2,5,pal.light);box(shoulder.x+7,shoulder.y+5,2,2,pal.accentLight);box(shoulder.x+5,shoulder.y+17,2,2,pal.accent);
 }else{
  poly([[head.x-11,head.y+1],[head.x-13,head.y-8],[head.x-16,head.y-15],[head.x-9,head.y-12],[head.x-8,head.y-22],[head.x-3,head.y-17],[head.x+2,head.y-24],[head.x+5,head.y-17],[head.x+12,head.y-21],[head.x+11,head.y-13],[head.x+17,head.y-15],[head.x+13,head.y-6],[head.x+7,head.y-3],[head.x+2,head.y-5],[head.x-5,head.y-2]],pal.hairShade);
  poly([[head.x-11,head.y-9],[head.x-12,head.y-12],[head.x-6,head.y-11],[head.x-6,head.y-19],[head.x-2,head.y-14],[head.x+2,head.y-20],[head.x+5,head.y-13],[head.x+10,head.y-17],[head.x+9,head.y-10],[head.x+14,head.y-12],[head.x+10,head.y-6],[head.x+3,head.y-7],[head.x-3,head.y-5]],pal.hair);
  poly([[head.x-6,head.y-11],[head.x-5,head.y-16],[head.x-1,head.y-12],[head.x+2,head.y-17],[head.x+4,head.y-10],[head.x+9,head.y-13],[head.x+8,head.y-8],[head.x+1,head.y-8]],pal.hairLight);
  poly([[head.x-9,head.y-1],[head.x+10,head.y-3],[head.x+12,head.y+3],[head.x-6,head.y+6]],pal.ink);box(head.x-5,head.y+1,13,2,'#2c3d56');box(head.x+7,head.y-1,2,1,'#59718a');
  poly([[shoulder.x-10,shoulder.y-9],[shoulder.x+10,shoulder.y-10],[shoulder.x+11,shoulder.y+2],[shoulder.x-8,shoulder.y+2]],pal.ink);box(shoulder.x-8,shoulder.y-7,16,8,pal.cloth);box(shoulder.x+7,shoulder.y-6,2,7,pal.light);box(shoulder.x+5,shoulder.y+4,1,15,pal.light);
 }
 let nearElbow={x:47-cycle*7+lean,y:55-tall-bob},nearHand={x:46-cycle*13+lean,y:66-tall-bob};
 if(state==='idle'&&char==='yuji'){nearElbow={x:51,y:55-bob};nearHand={x:54,y:42-bob}}
 if(state==='idle'&&char==='gojo'){nearElbow={x:49,y:56-tall-bob};nearHand={x:42,y:64-bob}}
 if(air){nearElbow={x:51,y:46-tall};nearHand={x:53,y:35-tall}}if(running){nearElbow={x:43,y:55};nearHand={x:30,y:56}}
 if(striking){const reach=variant===0?23:variant===1?30:17;nearElbow={x:49+swing*7,y:49-tall-swing*(variant===1?7:0)};nearHand={x:49+swing*reach,y:57-tall-swing*(variant===1?24:14)}}
 if(casting){nearElbow={x:49,y:49-tall};nearHand=char==='megumi'?{x:44-cast*2,y:42-tall-cast*2}:char==='gojo'?{x:60+cast*4,y:35-tall}:{x:55+cast*3,y:43-tall-cast*3}}
 if(hurtState){nearElbow={x:43,y:48};nearHand={x:42,y:34}}
 segment({x:44+lean,y:shoulder.y+3},nearElbow,9,pal.mid);segment(nearElbow,nearHand,8,pal.cloth);box(nearHand.x-5,nearHand.y-7,8,4,pal.shade);hand(nearHand.x,nearHand.y,!(casting&&(char==='gojo'||char==='sukuna')));
 if(casting&&char==='megumi'){hand(nearHand.x-6,nearHand.y+2,false);box(nearHand.x-2,nearHand.y-3,6,2,pal.skinLight)}
 if(char==='custom'){
  const style=started&&p.char==='custom'?Number(p.customHairStyle)||0:Number(customDraft.hairStyle)||0;
  const hx=head.x-11,hy=head.y-15;
  if(style===1){box(hx+3,hy+1,22,5,pal.hair);box(hx+18,hy+4,8,7,pal.hairShade)}
  if(style===2){box(hx-3,hy,9,23,pal.hair);box(hx+22,hy,9,20,pal.hair);box(hx+5,hy-2,18,6,pal.hairLight)}
  if(style===3){box(hx+2,hy-5,24,7,pal.hair);box(hx+13,hy-8,16,5,pal.hairLight)}
  const customMode=started&&p.char==='custom',accessory=Number(customMode?p.customAccessory:customDraft.accessory)||0,mark=Number(customMode?p.customMark:customDraft.mark)||0,eyesShape=Number(customMode?p.customEyesShape:customDraft.eyesShape)||0;
  if(accessory===1){box(hx-1,hy+8,31,5,pal.accent);box(hx+2,hy+9,6,3,pal.edge)}
  if(accessory===2){box(shoulder.x-16,shoulder.y-1,12,17,pal.cloth);box(shoulder.x+8,shoulder.y-1,12,17,pal.cloth);box(shoulder.x-13,shoulder.y,3,14,pal.edge)}
  if(accessory===3){box(head.x-9,head.y+7,25,9,pal.cloth);box(head.x-9,head.y+8,25,2,pal.edge)}
  if(mark===1){box(head.x-7,head.y+2,5,2,pal.accent);box(head.x+7,head.y+2,5,2,pal.accent)}
  if(mark===2){box(head.x+7,head.y-5,2,16,pal.accent)}
  if(mark===3){box(head.x-1,head.y-8,7,3,pal.accent);box(head.x+1,head.y-12,3,11,pal.accent)}
  if(eyesShape===1){box(head.x-6,head.y-4,6,2,pal.ink);box(head.x+5,head.y-4,6,2,pal.ink)}
  if(eyesShape===2){box(head.x-7,head.y-3,8,5,pal.accentLight);box(head.x+4,head.y-3,8,5,pal.accentLight)}
  const eye=pal.eye||'#a8d4fb';box(head.x-5,head.y-2,3,2,eye);box(head.x+6,head.y-2,3,2,eye);
 }
 return a;
}
function person(x,y,char,face,state,options={}){
 const frames=sprites[char]||(char==='custom'?sprites[p.customStyle||'yuji']:null);if(!frames)return;let index=0;
 if(state==='walk')index=Math.floor(walking/9)%12;
 else if(state==='idle')index=Math.floor(time*3)%4;
 else if(state==='attack')index=Math.min(5,Math.floor((1-Math.max(0,p.attack)/.28)*6))+Math.max(0,p.combo)*6;
 else if(state==='cast')index=Math.min(7,Math.floor((1-Math.max(0,p.castTime)/.55)*8));
 else if(state==='hover')index=Math.floor(time*7)%8;
 else if(state==='dash')index=Math.floor(time*24)%4;
 else if(state==='jump'||state==='fall')index=Math.floor(time*5)%2;
 else if(state==='hurt')index=Math.floor(time*12)%3;
 const frame=frames[state]?.[index]||frames.idle[0];
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(x+17),Math.round(y+70));ctx.scale(face,1);
 const height=char==='gojo'?91:char==='megumi'?88:85;
 if(!options.ghost&&state!=='jump'&&state!=='fall'&&state!=='hover'){ctx.globalAlpha=.18;ctx.fillStyle='#010614';ctx.beginPath();ctx.ellipse(0,0,23,4,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}
 if(!options.ghost&&(state==='attack'||state==='dash'||state==='cast')){const energy=CAST[char]?.color||'#d5b9ec';ctx.save();ctx.globalAlpha=state==='attack'?.24:state==='dash'?.16:.12;ctx.shadowBlur=state==='attack'?18:12;ctx.shadowColor=energy;ctx.fillStyle=energy;ctx.beginPath();ctx.ellipse(0,-height*.55,24,height*.39,0,0,Math.PI*2);ctx.fill();ctx.restore()}if(char==='custom'&&!options.ghost){ctx.save();ctx.shadowColor=p.customColor||'#da9dff';ctx.shadowBlur=20;ctx.globalAlpha=.4;ctx.drawImage(frame,-height*40/108,-height,height*96/108,height);ctx.restore()}ctx.drawImage(frame,-height*40/108,-height,height*96/108,height);if(!options.ghost&&state==='attack'){const combo=p.combo||0;ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=.48;ctx.strokeStyle=CAST[char]?.color||'#ffe1ed';ctx.lineWidth=2.8;ctx.beginPath();ctx.arc(combo===1?12:20,-height*.5,combo===2?30:24,-1.2,0.9);ctx.stroke();ctx.restore()}ctx.restore();
}
function prepareArt(){for(const char of ['yuji','sukuna','megumi','gojo']){
 const list=(state,n,variant=0)=>Array.from({length:n},(_,i)=>makeFrame(char,state,i*Math.PI*2/(state==='attack'||state==='cast'?n-1:n),variant));
 sprites[char]={idle:list('idle',4),walk:list('walk',12),jump:list('jump',2),fall:list('fall',2),dash:list('dash',4),attack:[...list('attack',6,0),...list('attack',6,1),...list('attack',6,2)],cast:list('cast',8),hover:list('cast',8),hurt:list('hurt',3)};
 ART[char]=makeFrame(char,'idle',0).toDataURL();
}}

let artClock=0;function previewCharacters(){if(started)return;document.querySelectorAll('[data-preview]').forEach(canvas=>{const g=canvas.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,192,216);const char=canvas.dataset.preview,phase=(artClock+Object.keys(CAST).indexOf(char)*.7)%9;let state='idle',index=Math.floor(artClock*3)%4;if(phase>4&&phase<6){state='walk';index=Math.floor(artClock*12)%12}else if(phase>=6&&phase<7){state='attack';index=Math.min(5,Math.floor((phase-6)*6))}else if(phase>=7){state='cast';index=Math.min(7,Math.floor((phase-7)*4))}const frame=(sprites[char]||sprites.yuji)[state][index];g.drawImage(frame,8,0,192,216)})}

/* Combat polish: deterministic short-lived impact frames, ink slashes, and shock rings. */
const cinematicHits=[];
function cinematicHit(x,y,color,heavy=false){
 if(!settings.shake&&!heavy) return;
 cinematicHits.push({x,y,color,heavy,life:heavy?.25:.12,max:heavy?.25:.12,seed:(Math.random()*6.28)});
 if(cinematicHits.length>9)cinematicHits.shift();
}
function drawCinematicHits(dt){
 if(!cinematicHits.length)return;
 const zoom=cameraZoom(),offset=worldOffsetY();
 ctx.save();
 for(let i=cinematicHits.length-1;i>=0;i--){
  const h=cinematicHits[i];h.life-=dt;if(h.life<=0){cinematicHits.splice(i,1);continue}
  const k=1-h.life/h.max,px=(h.x-cam)*zoom,py=h.y*zoom+offset;
  if(px< -190||px>W+190)continue;
  ctx.save();ctx.translate(px,py);ctx.rotate(h.seed*.04);
  const power=(1-k)*(h.heavy?1:.6);
  if(h.heavy&&k<.22){
   ctx.globalAlpha=.18*(1-k/.22);ctx.fillStyle='#f7f3e8';ctx.fillRect(-W,-720,W*2,1440);
   ctx.globalAlpha=.8*(1-k/.22);ctx.fillStyle='#100914';ctx.beginPath();
   for(let n=0;n<12;n++){const a=n*Math.PI/6+h.seed*.05,r1=12,r2=260+(n%3)*70;
    ctx.moveTo(Math.cos(a)*r1,Math.sin(a)*r1);ctx.lineTo(Math.cos(a-.042)*r2,Math.sin(a-.042)*r2);ctx.lineTo(Math.cos(a+.042)*r2,Math.sin(a+.042)*r2)}
   ctx.fill();
  }
  ctx.globalAlpha=power;ctx.strokeStyle=h.color;ctx.lineCap='round';
  for(let n=0;n<(h.heavy?18:9);n++){
   const a=n*Math.PI/(h.heavy?9:4.5)+h.seed;
   const r=18+k*35,reach=(h.heavy?130:55)*(1-k*.55)+(n%3)*9;
   ctx.lineWidth=n%4===0?4:1.5;ctx.beginPath();
   ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);
   ctx.lineTo(Math.cos(a)*(r+reach),Math.sin(a)*(r+reach));ctx.stroke();
  }
  ctx.strokeStyle='#fff7f0';ctx.lineWidth=h.heavy?4:2;ctx.globalAlpha=power*.85;
  ctx.beginPath();ctx.ellipse(0,0,16+k*(h.heavy?115:56),9+k*(h.heavy?78:35),-.25,0,Math.PI*2);ctx.stroke();
  ctx.globalAlpha=power*.7;ctx.strokeStyle=h.color;ctx.lineWidth=2;ctx.beginPath();
  ctx.ellipse(0,0,26+k*(h.heavy?150:74),17+k*(h.heavy?99:46),.2,0,Math.PI*2);ctx.stroke();
  ctx.restore();
 }
 ctx.restore();
}


let finisherScene=null,domainScene=null;
function triggerFinisher(x,y,color,boss){
 finisherScene={x,y,color,boss,life:boss?.85:.4,max:boss?.85:.4};
 cinematicHit(x,y,color,true);effects.push({type:'shockwave',x,y,t:.45,max:.45,color});
}
function startDomainCinematic(color,name){domainScene={color,name,life:1.15,max:1.15};hitStop=Math.max(hitStop,.075)}
function drawCombatCinematics(dt){
 if(finisherScene){
  const s=finisherScene;s.life=Math.max(0,s.life-dt);const k=1-s.life/s.max;
  ctx.save();if(s.boss){ctx.fillStyle='rgba(7,7,17,'+(Math.sin(Math.PI*k)*.5)+')';ctx.fillRect(0,0,W,720)}
  ctx.translate((s.x-cam)*cameraZoom(),s.y*cameraZoom()+worldOffsetY());ctx.rotate(-.16);ctx.globalAlpha=Math.min(1,s.life*5);
  ctx.lineWidth=s.boss?9:5;ctx.strokeStyle='#fff8f3';ctx.beginPath();ctx.moveTo(-210-k*90,100);ctx.lineTo(190+k*80,-120);ctx.stroke();
  ctx.strokeStyle=s.color;ctx.lineWidth=s.boss?4:3;ctx.beginPath();ctx.moveTo(-220-k*80,115);ctx.lineTo(180+k*75,-105);ctx.stroke();ctx.restore();
  if(s.boss){ctx.save();ctx.globalAlpha=Math.min(1,s.life*3)*.9;ctx.fillStyle='#fceaf5';ctx.font='bold 32px system-ui';ctx.textAlign='center';ctx.shadowBlur=22;ctx.shadowColor=s.color;ctx.fillText('CURSE EXORCISED',W/2,180);ctx.restore()}
  if(!s.life)finisherScene=null;
 }
 if(domainScene){
  const s=domainScene;s.life=Math.max(0,s.life-dt);const k=1-s.life/s.max;ctx.save();const a=Math.min(1,k*6,s.life*4);
  ctx.globalAlpha=a*.78;ctx.fillStyle='#090817';ctx.fillRect(0,0,W,720);ctx.translate(W/2,350);
  for(let i=0;i<4;i++){ctx.save();ctx.rotate(k*1.2+i*Math.PI/4);ctx.strokeStyle=s.color;ctx.lineWidth=5-i;ctx.globalAlpha=a*(.8-i*.13);ctx.beginPath();ctx.ellipse(0,0,65+i*65+k*160,35+i*42+k*100,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
  ctx.globalAlpha=a;ctx.textAlign='center';ctx.fillStyle='#faf2ff';ctx.font='bold 14px monospace';ctx.fillText('DOMAIN EXPANSION',0,-90);ctx.fillStyle=s.color;ctx.font='bold '+(W<650?19:29)+'px system-ui';ctx.fillText(s.name.toUpperCase(),0,0,Math.max(180,W-40));ctx.restore();
  if(!s.life)domainScene=null;
 }
}

/* Distinct stylized attacks by fighter. All effect lifetimes are bounded. */
const characterFx=[];
function characterAttackVFX(strike){
 const fx={type:p.char==='custom'?p.customStyle:p.char,x:p.x+17+strike.face*35,y:p.y+34,dir:strike.face,t:.3,max:.3,combo:strike.combo,kind:'strike'};
 characterFx.push(fx);
 if(p.char==='yuji'&&strike.combo===2)characterFx.push({...fx,kind:'divergent',x:fx.x+strike.face*15,t:.4,max:.4});
 if(p.char==='sukuna')characterFx.push({...fx,kind:'cut',t:.4,max:.4});
 if(p.char==='megumi')characterFx.push({...fx,kind:'shadow',t:.4,max:.4});
 if(p.char==='gojo')characterFx.push({...fx,kind:'limitless',t:.35,max:.35});
 if(characterFx.length>25)characterFx.splice(0,characterFx.length-25);
}
function characterDomainVFX(){characterFx.push({type:p.char,kind:'domain',x:p.x+17,y:p.y+34,dir:p.face,t:1,max:1,combo:2})}
function drawCharacterTechniqueVFX(){
 for(const fx of characterFx){
  const k=1-fx.t/fx.max;ctx.save();ctx.translate(fx.x,fx.y);ctx.scale(fx.dir,1);ctx.globalAlpha=Math.min(1,fx.t*6);
  if(fx.kind==='strike'&&fx.type==='yuji'){ctx.lineCap='round';ctx.strokeStyle='#fff6e4';ctx.lineWidth=5;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-25,-27+i*13);ctx.quadraticCurveTo(10,-42+i*16,68+k*22,-5+i*10);ctx.stroke()}}
  else if(fx.kind==='divergent'){ctx.strokeStyle='#ff3c71';ctx.lineWidth=4;ctx.beginPath();ctx.arc(40,0,15+k*65,0,Math.PI*2);ctx.stroke();glow(40,0,60,'#ef245738')}
  else if(fx.kind==='cut'||(fx.kind==='strike'&&fx.type==='sukuna')){ctx.strokeStyle=fx.kind==='cut'?'#ff7189':'#fff0ee';ctx.lineWidth=fx.kind==='cut'?4:2;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(-45+i*18+k*100,45);ctx.lineTo(50+i*18+k*100,-48);ctx.stroke()}}
  else if(fx.kind==='limitless'||(fx.kind==='strike'&&fx.type==='gojo')){for(let i=0;i<3;i++){ctx.strokeStyle=i%2?'#b18eff':'#91edff';ctx.lineWidth=3-i*.6;ctx.beginPath();ctx.ellipse(20,0,13+k*65+i*11,18+k*44+i*9,-.3,0,Math.PI*2);ctx.stroke()}}
  else if(fx.kind==='shadow'||(fx.kind==='strike'&&fx.type==='megumi')){ctx.fillStyle='#1b143b';ctx.beginPath();ctx.ellipse(20,28,42+k*80,8+k*12,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#af9cfc';ctx.lineWidth=2;for(let i=0;i<4;i++){const x=-35+i*24;ctx.beginPath();ctx.moveTo(x,22);ctx.quadraticCurveTo(x+15,-25-k*30,x+35,18);ctx.stroke()}}
  else if(fx.kind==='domain'){let palette={yuji:'#ff6c87',gojo:'#93defe',megumi:'#9c8deb',sukuna:'#fa8094'};ctx.strokeStyle=palette[fx.type]||'#fff';ctx.lineWidth=5;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,0,40+k*250+i*38,28+k*155+i*25,0,0,Math.PI*2);ctx.stroke()}}
  ctx.restore();
 }
}
function updateCharacterFx(dt){for(let i=characterFx.length-1;i>=0;i--){characterFx[i].t-=dt;if(characterFx[i].t<=0)characterFx.splice(i,1)}}
let lastGameError='';function reportGameError(error){const message=String(error?.message||error);if(message===lastGameError)return;lastGameError=message;console.error('[VEILBOUND]',error);const n=$('#notice');if(n){n.textContent='GAME ERROR: '+message+' — report this message';noticeTime=12}if(started){paused=true;isolateGameMenu(true);$('#overlay').hidden=false;$('#panel').innerHTML='<div class="story-scene"><h2>GAMEPLAY ERROR</h2><p id="errorMessage"></p><button id="recoverGame">RETURN TO GAME</button></div>';$('#errorMessage').textContent=message;$('#recoverGame').onclick=()=>{lastGameError='';resume()}}}
window.addEventListener('error',event=>{reportGameError(event.error||event.message)});
window.addEventListener('unhandledrejection',event=>{reportGameError(event.reason||'Unexpected error')});
function loop(t){const dt=Math.min(.033,Math.max(0,(t-last)/1000));last=t;artClock+=dt;if(paused&&noticeTime>0){noticeTime-=dt;if(noticeTime<=0)$('#notice').textContent=''}if(!started)previewCharacters();try{if(!paused){if(hitStop>0)hitStop-=dt;else update(dt);updateCharacterFx(dt);draw();drawCinematicHits(dt);drawCombatCinematics(dt);needsRedraw=false}else if(needsRedraw){draw();drawCinematicHits(0);drawCombatCinematics(0);needsRedraw=false}}catch(error){reportGameError(error)}requestAnimationFrame(loop)}prepareArt();prepareSupervisor();title();if(typeof ResizeObserver!=='undefined')new ResizeObserver(readDockLayout).observe($('#combatDock'));requestAnimationFrame(loop);

