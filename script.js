const records = [
  { id:"01", title:"ルーメン海", category:"地理", description:"夜になると海面の下から淡い光が浮かび上がる内海。光源は生物とも鉱物ともいわれるが、いまだ確かな説明は見つかっていない。", fields:[["所在地","北緯不明・東岸域"],["観測時期","年間を通じて観測"],["備考","潮汐と発光周期に相関あり"]] },
  { id:"02", title:"硝子島", category:"地理", description:"島の地表の大部分が透明な結晶質で覆われている。遠景では海上に浮かぶ巨大なレンズのように見え、島内では方角の感覚を失いやすい。", fields:[["分類","無人島"],["地質","未知の珪酸塩結晶"],["備考","地図の記載と実測が一致しない"]] },
  { id:"03", title:"黒い羅針盤", category:"道具", description:"北を指さず、持ち主が最後に忘れた場所の方角を示すとされる古い羅針盤。針は磁場に反応せず、使用者によって示す方向が異なる。", fields:[["材質","黒色金属・ガラス"],["全長","約 8 cm"],["備考","針の交換記録なし"]] },
  { id:"04", title:"記憶鍵", category:"道具", description:"鍵穴に差し込むと、扉ではなく所有者の記憶の一部が開くという小型の鍵。開かれた記憶は鮮明になる一方、別の記憶が薄れる。", fields:[["分類","記憶関連器具"],["確認例","少なくとも 12 件"],["備考","使用回数と喪失記憶の関係は不明"]] },
  { id:"05", title:"モロウ鳥", category:"生物", description:"薄明の時間帯にだけ姿を見せる黒い鳥。鳴き声は記録されていないが、目撃者は皆、遠くで紙をめくるような音を聞いたと証言する。", fields:[["体長","約 40 cm"],["活動時間","日の出前・日没後"],["備考","写真では輪郭が不鮮明になる"]] },
  { id:"06", title:"無音時刻", category:"現象", description:"特定の地域で、一日のうち数秒から数分にわたり、あらゆる音が消失する現象。消失中も時計は進み、音が戻った後に時間の欠落は確認されない。", fields:[["発生頻度","不定期"],["継続時間","数秒〜数分"],["備考","録音機器にも同様の欠落が生じる"]] }
];

const ring = document.getElementById("ring");
const ringItems = document.getElementById("ringItems");
const article = document.getElementById("article");
const currentIndex = document.getElementById("currentIndex");
const count = records.length;
const step = 360 / count;
let selected = -1;
let rotation = 0;
let dragging = false;
let lastPointerAngle = 0;
let dragStartRotation = 0;

function normalizeAngle(a) { return ((a % 360) + 360) % 360; }
function signedDelta(a) { return ((a + 180) % 360 + 360) % 360 - 180; }

records.forEach((record, i) => {
  const item = document.createElement("div");
  item.className = "ring-item";
  item.innerHTML = `<span class="item-no">${record.id}</span><span>${record.title}</span>`;
  ringItems.appendChild(item);
});

const items = [...document.querySelectorAll(".ring-item")];

function renderRing() {
  const radius = window.innerHeight * 0.355;
  items.forEach((item, i) => {
    const angle = i * step + rotation - 180;
    const rad = angle * Math.PI / 180;
    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius;
    // Keep labels upright while positioning them along the inside circumference.
    item.style.transform = `translate(${x}px, ${y}px)`;
    const distance = Math.abs(signedDelta(angle + 180));
    item.classList.toggle("active", i === selected);
    item.style.opacity = distance < 34 ? "1" : ".76";
  });
  currentIndex.textContent = `${String(selected < 0 ? 0 : selected + 1).padStart(2,"0")} / ${String(count).padStart(2,"0")}`;
}

function showPage(index) {
  selected = (index + count) % count;
  const r = records[selected];
  article.innerHTML = `
    <div class="article-number">ARCHIVE RECORD / ${r.id}</div>
    <span class="article-category">${r.category}</span>
    <h1 class="article-title">${r.title}</h1>
    <p class="article-description">${r.description}</p>
    <dl class="article-detail">${r.fields.map(([k,v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>
  `;
  article.style.animation = "none";
  void article.offsetWidth;
  article.style.animation = "";
  renderRing();
  history.replaceState(null, "", `#${r.id}`);
}

function pointerAngle(event) {
  const rect = ring.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return Math.atan2(event.clientY - cy, event.clientX - cx) * 180 / Math.PI;
}

function startDrag(event) {
  if (event.button !== undefined && event.button !== 0) return;
  dragging = true;
  lastPointerAngle = pointerAngle(event);
  dragStartRotation = rotation;
  ring.setPointerCapture?.(event.pointerId);
  event.preventDefault();
}
function moveDrag(event) {
  if (!dragging) return;
  const next = pointerAngle(event);
  // 1:1 angular tracking: no inertia, easing, or velocity-based acceleration.
  rotation += signedDelta(next - lastPointerAngle);
  lastPointerAngle = next;
  renderRing();
}
function endDrag() {
  if (!dragging) return;
  dragging = false;
  const nearest = Math.round(-rotation / step);
  rotation = -nearest * step;
  showPage(nearest);
}
ring.addEventListener("pointerdown", startDrag);
ring.addEventListener("pointermove", moveDrag);
ring.addEventListener("pointerup", endDrag);
ring.addEventListener("pointercancel", endDrag);
ring.addEventListener("lostpointercapture", endDrag);

window.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") { rotation -= step; showPage(Math.round(-rotation / step)); }
  if (e.key === "ArrowLeft") { rotation += step; showPage(Math.round(-rotation / step)); }
});
window.addEventListener("resize", renderRing);

function tick() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString("ja-JP", {hour:"2-digit", minute:"2-digit"});
}
tick();
setInterval(tick, 30000);

const hashId = location.hash.slice(1);
const initial = records.findIndex(r => r.id === hashId);
if (initial >= 0) {
  rotation = -initial * step;
  showPage(initial);
} else {
  selected = -1;
  renderRing();
}
