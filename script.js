'use strict';

const records = [
  {id:'lumen-sea',number:'001',category:'place',categoryName:'PLACE / 場所・領域',title:'ルーメン海',subtitle:'LUMEN SEA — 光を湛える内海',summary:'大陸北西部に位置する、夜間に海面全体が青白く発光する内海。海水そのものに発光性の微粒子が含まれているとされるが、その発生源は現在も特定されていない。',fields:[['分類','内海・自然領域'],['所在地','北緯 61° / 西経 14° 付近'],['水深','平均 420 m'],['発光周期','日没から日の出まで']],section:'観測記録',detail:'発光は波の動きに合わせて強弱を繰り返し、遠方からは海面に星空が沈んでいるように見える。沿岸には定住者がほとんどおらず、航行には専用の遮光標識が用いられる。発光現象と潮汐の相関については、複数の仮説が提唱されている。',quote:'海が光っているのではない。海の底から、何かがこちらを見ているのだ。'},
  {id:'glass-island',number:'002',category:'place',categoryName:'PLACE / 場所・領域',title:'硝子島',subtitle:'GLASS ISLE — 風の音を返す島',summary:'透明度の高い鉱物層に覆われた小島。島の地表は薄い硝子板のような質感を持ち、風が吹くと島全体から微かな共鳴音が発生する。',fields:[['分類','浮島・地質特異点'],['所在地','ルーメン海東部'],['面積','約 3.8 km²'],['特記事項','磁針が正常に作動しない']],section:'地質と環境',detail:'島の表層は自然結晶化した珪質鉱物で構成される。踏みしめても割れることはないが、気温差の大きい日には地面の一部が淡く曇る。島内には植物がほとんど自生せず、風の強さによって異なる音階の共鳴が観測される。',quote:'島に立つと、自分の足音だけがいつまでも遅れてついてくる。'},
  {id:'black-compass',number:'003',category:'object',categoryName:'OBJECT / 物品・遺物',title:'黒い羅針盤',subtitle:'THE BLACK COMPASS — 北を指さない羅針盤',summary:'黒曜石に似た素材で作られた携帯型の方位計。針は磁北を示さず、所持者が最も長く忘れていた場所の方向を指すと伝えられている。',fields:[['分類','航行補助具・遺物'],['全長','約 9 cm'],['材質','黒色結晶体（推定）'],['発見年','記録なし']],section:'機能に関する記述',detail:'針の動作原理は解明されていない。複数人が同時に観察した場合、針が示す方向は観察者ごとに異なるという報告がある。分解を試みた記録は残るものの、内部構造を確認できた例はない。',quote:'目的地を教える道具ではない。帰る場所を思い出させる道具だ。'},
  {id:'memory-key',number:'004',category:'object',categoryName:'OBJECT / 物品・遺物',title:'記憶鍵',subtitle:'MEMORY KEY — 開かない扉のための鍵',summary:'鍵穴のない扉に差し込むと、使用者の記憶にまつわる短い音声が再生されるという小型の金属製品。再生内容は毎回異なる。',fields:[['分類','記録媒体・用途不明品'],['全長','約 6.5 cm'],['材質','銀白色合金'],['確認例','公的記録 17 件']],section:'使用時の反応',detail:'音声は使用者本人の声に似ている場合が多いが、本人が覚えていない出来事を語る例も報告されている。再生後、鍵は数分間冷却され、再使用には一定の時間を要する。',quote:'鍵が開けるのは扉ではなく、閉じたままにしていた記憶なのかもしれない。'},
  {id:'morrow-bird',number:'005',category:'life',categoryName:'LIFE / 生物・存在',title:'モロウ鳥',subtitle:'MORROW BIRD — 明日の声を持つ鳥',summary:'薄灰色の羽毛と半透明の尾羽を持つ小型の鳥類。鳴き声が、翌日にその場所で聞かれる音と酷似するという特異な性質を持つ。',fields:[['分類','未分類鳥類'],['体長','約 18 cm'],['生息域','硝子島周辺'],['活動時間','薄明時']],section:'生態',detail:'群れを形成せず、単独で行動する。鳴き声は人の会話、雨音、鐘の音など多岐にわたるが、発声の時点では対応する出来事がまだ発生していない。予測の精度や時間幅には個体差がある。',quote:'その鳥が鳴いた翌朝、誰もいない駅に列車が到着した。'},
  {id:'silent-hour',number:'006',category:'event',categoryName:'PHENOMENON / 現象・事件',title:'無音時刻',subtitle:'THE SILENT HOUR — 音が失われる一時間',summary:'年に数回、特定の地域で発生する音響消失現象。発生中は自然音・人工音を問わず、あらゆる音が観測されなくなる。',fields:[['分類','局地的音響異常'],['継続時間','約 60 分'],['発生頻度','年 2〜4 回'],['前兆','気圧の急激な安定']],section:'発生時の記録',detail:'現象の発生中も光や熱、電波などは通常どおり伝播する。録音機器には無音のデータが記録される一方、現象終了後に一部の機器から発生前の音声が再生されたという報告がある。',quote:'世界が静かになったのではない。世界が、聞くことをやめたのだ。'}
];

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const ringItems = $('#ringItems');
const ringStage = $('#ringStage');
const searchInput = $('#searchInput');
let currentId = null;
let currentCategory = 'all';
let visibleRecords = [...records];
let ringRotation = 0;
let dragState = null;

function updateClock(){
  const now = new Date();
  $('#clock').textContent = [now.getHours(),now.getMinutes(),now.getSeconds()].map(v=>String(v).padStart(2,'0')).join(':');
}
updateClock();
window.setInterval(updateClock,1000);

function buildRing(){
  ringItems.innerHTML = '';
  const count = visibleRecords.length + 1;
  const radius = Math.min(ringStage.clientWidth,ringStage.clientHeight) * .39;
  const items = [{id:null,number:'00',title:'OVERVIEW'},...visibleRecords];
  items.forEach((item,index)=>{
    const angle = (index / count) * Math.PI * 2 - Math.PI/2;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ring-item';
    button.dataset.id = item.id || 'home';
    button.setAttribute('aria-label',item.id ? `${item.number} ${item.title}` : 'トップページ');
    button.textContent = item.id ? item.number.slice(-2) : 'N';
    button.style.setProperty('--x',`${Math.cos(angle)*radius}px`);
    button.style.setProperty('--y',`${Math.sin(angle)*radius}px`);
    button.addEventListener('click',()=>selectRecord(item.id));
    ringItems.append(button);
  });
  updateRingSelection();
}

function updateRingSelection(){
  const buttons = $$('.ring-item',ringItems);
  const activeIndex = visibleRecords.findIndex(record=>record.id===currentId)+1;
  const selectedIndex = currentId ? activeIndex : 0;
  buttons.forEach((button,index)=>{
    const active = index===selectedIndex;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
  });
  const selected = currentId ? records.find(record=>record.id===currentId) : null;
  $('#ringSelected').textContent = selected ? selected.title : 'OVERVIEW';
  $('#ringSelectedIndex').textContent = `${String(selectedIndex).padStart(2,'0')} — ${String(visibleRecords.length).padStart(2,'0')}`;
  $('#pageCounter').textContent = `INDEX / ${String(selectedIndex).padStart(2,'0')}`;
  $('#recordId').textContent = selected ? `REC. ${selected.number}` : 'REC. 000';
  $('#breadcrumbCategory').textContent = selected ? selected.category.toUpperCase() : 'OVERVIEW';
}

function selectRecord(id){
  if(id && !visibleRecords.some(record=>record.id===id)) return;
  currentId = id || null;
  const home = $('#homeView');
  const article = $('#recordView');
  const empty = $('#emptyState');
  empty.classList.add('hidden');
  if(!currentId){
    article.classList.add('hidden');
    home.classList.remove('hidden');
  }else{
    const record = records.find(item=>item.id===currentId);
    home.classList.add('hidden');
    article.classList.remove('hidden');
    article.innerHTML = `
      <p class="record-kicker">${escapeHTML(record.categoryName)} <span>— RECORD ${record.number}</span></p>
      <h1 class="record-title">${escapeHTML(record.title)}</h1>
      <p class="record-subtitle">${escapeHTML(record.subtitle)}</p>
      <div class="record-rule"></div>
      <p class="record-description">${escapeHTML(record.summary)}</p>
      <div class="record-grid">${record.fields.map(([label,value])=>`<div class="data-cell"><span>${escapeHTML(label)}</span><b>${escapeHTML(value)}</b></div>`).join('')}</div>
      <h2 class="record-section-title">${escapeHTML(record.section)}</h2>
      <p class="record-detail">${escapeHTML(record.detail)}</p>
      <blockquote class="record-quote"><b>FIELD NOTE / 採録者の覚書</b>${escapeHTML(record.quote)}</blockquote>`;
  }
  updateRingSelection();
  history.replaceState(null,'',currentId ? `#${currentId}` : '#home');
}

function escapeHTML(value){
  return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}

function applyFilters(){
  const term = searchInput.value.trim().toLocaleLowerCase('ja');
  visibleRecords = records.filter(record=>{
    const matchesCategory = currentCategory==='all' || record.category===currentCategory;
    const haystack = [record.title,record.subtitle,record.summary,record.categoryName].join(' ').toLocaleLowerCase('ja');
    return matchesCategory && (!term || haystack.includes(term));
  });
  const currentStillVisible = visibleRecords.some(record=>record.id===currentId);
  if(!currentStillVisible) currentId = null;
  const hasResults = visibleRecords.length>0;
  $('#homeView').classList.toggle('hidden',Boolean(currentId) || !hasResults);
  $('#recordView').classList.toggle('hidden',!currentId || !hasResults);
  $('#emptyState').classList.toggle('hidden',hasResults);
  if(currentId) selectRecord(currentId);
  else updateRingSelection();
  buildRing();
}

function rotateSelection(direction){
  const items = [null,...visibleRecords.map(record=>record.id)];
  if(!items.length) return;
  const index = items.indexOf(currentId);
  const next = (index + direction + items.length) % items.length;
  selectRecord(items[next]);
}

function angleFromPointer(event){
  const rect = ringStage.getBoundingClientRect();
  return Math.atan2(event.clientY-(rect.top+rect.height/2),event.clientX-(rect.left+rect.width/2));
}
ringStage.addEventListener('pointerdown',event=>{
  if(event.target.closest('.ring-item')) return;
  dragState={pointerId:event.pointerId,lastAngle:angleFromPointer(event),moved:0};
  ringStage.classList.add('dragging');
  ringStage.setPointerCapture(event.pointerId);
});
ringStage.addEventListener('pointermove',event=>{
  if(!dragState || dragState.pointerId!==event.pointerId) return;
  const angle=angleFromPointer(event);
  let delta=angle-dragState.lastAngle;
  if(delta>Math.PI) delta-=Math.PI*2;
  if(delta<-Math.PI) delta+=Math.PI*2;
  dragState.moved+=Math.abs(delta);
  dragState.lastAngle=angle;
  ringRotation+=delta;
  ringItems.style.transform=`rotate(${ringRotation}rad)`;
});
function finishDrag(event){
  if(!dragState || (event && dragState.pointerId!==event.pointerId)) return;
  const moved=dragState.moved;
  dragState=null;
  ringStage.classList.remove('dragging');
  if(moved>.22){
    const step=(Math.PI*2)/(visibleRecords.length+1);
    const turns=Math.max(1,Math.round(Math.abs(ringRotation)/step));
    const direction=ringRotation>0?1:-1;
    for(let i=0;i<Math.min(turns,visibleRecords.length+1);i++) rotateSelection(direction);
    ringRotation=0;
    ringItems.style.transform='rotate(0rad)';
  }
}
ringStage.addEventListener('pointerup',finishDrag);
ringStage.addEventListener('pointercancel',finishDrag);

$('#ringPrev').addEventListener('click',()=>rotateSelection(-1));
$('#ringNext').addEventListener('click',()=>rotateSelection(1));
$('.featured-card').addEventListener('click',()=>selectRecord('lumen-sea'));
$$('.category-button').forEach(button=>button.addEventListener('click',()=>{
  currentCategory=button.dataset.category;
  $$('.category-button').forEach(item=>item.classList.toggle('active',item===button));
  applyFilters();
}));
searchInput.addEventListener('input',applyFilters);
window.addEventListener('keydown',event=>{
  if(event.key==='/' && document.activeElement!==searchInput){event.preventDefault();searchInput.focus();}
  if(event.key==='Escape'){searchInput.blur();searchInput.value='';currentCategory='all';$$('.category-button').forEach(button=>button.classList.toggle('active',button.dataset.category==='all'));applyFilters();selectRecord(null);}
  if(event.key==='ArrowRight') rotateSelection(1);
  if(event.key==='ArrowLeft') rotateSelection(-1);
});
window.addEventListener('resize',()=>buildRing());
window.addEventListener('hashchange',()=>{
  const id=location.hash.slice(1);
  if(id==='home'||!id) selectRecord(null);
  else if(records.some(record=>record.id===id)){currentCategory='all';searchInput.value='';$$('.category-button').forEach(button=>button.classList.toggle('active',button.dataset.category==='all'));applyFilters();selectRecord(id);}
});

buildRing();
const initialId=location.hash.slice(1);
if(records.some(record=>record.id===initialId)) selectRecord(initialId);
else selectRecord(null);
