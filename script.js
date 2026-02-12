/* KBA Website interactions (no libraries) */
const yearEls = document.querySelectorAll("[data-year]");
yearEls.forEach(el => el.textContent = new Date().getFullYear());

/* Scroll reveal */
function revealOnScroll(){
  const els = document.querySelectorAll(".card");
  els.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight - 40) el.classList.add("reveal");
  });
}
window.addEventListener("scroll", revealOnScroll, {passive:true});
revealOnScroll();

/* Offer popup with balloons (show ONCE across pages) */
const offer = document.getElementById("offer");
const closeOfferBtn = document.getElementById("closeOffer");
const balloonLayer = document.getElementById("balloonLayer");
const OFFER_KEY = "kba_offer_seen_v1";

function spawnBalloons(n=10){
  if (!balloonLayer) return;
  balloonLayer.innerHTML = "";
  const w = window.innerWidth;
  for(let i=0;i<n;i++){
    const b = document.createElement("div");
    b.className = "balloon";
    const left = Math.random() * (Math.min(700, w) - 40);
    const dur = 1200 + Math.random()*1200;
    const dx = (Math.random()*120 - 60).toFixed(0) + "px";
    b.style.left = left + "px";
    b.style.setProperty("--dur", dur + "ms");
    b.style.setProperty("--dx", dx);
    b.style.bottom = "-20px";
    balloonLayer.appendChild(b);
  }
}

function showOffer({force=false} = {}){
  if (!offer) return;
  if (!force){
    const seen = localStorage.getItem(OFFER_KEY);
    if (seen) return;
    localStorage.setItem(OFFER_KEY, "1");
  }
  offer.classList.add("show");
  spawnBalloons(12);
  setTimeout(hideOffer, 5200);
}
function hideOffer(){
  if (!offer) return;
  offer.classList.remove("show");
}

/* Show offer only once across pages */
window.addEventListener("load", () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  setTimeout(() => showOffer({force:false}), 450);
});

if (closeOfferBtn) closeOfferBtn.addEventListener("click", hideOffer);

/* WhatsApp helper */
function openWhatsApp(phone, text){
  const msg = encodeURIComponent(text);
  const url = `https://wa.me/${phone}?text=${msg}`;
  window.open(url, "_blank", "noreferrer");
}
window.kbaOpenWhatsApp = openWhatsApp;


/* Random item images (user can replace images in assets/items and update assets/items.json) */
async function applyRandomItemImages(){
  const imgs = document.querySelectorAll("img.itemImg[data-slug][data-prefix]");
  if (!imgs.length) return;

  // Determine correct path to items.json relative to current page
  // If prefix starts with "../" -> items.json also one level up
  const any = imgs[0];
  const prefix = any.getAttribute("data-prefix") || "assets/items/";
  const jsonPath = prefix.startsWith("../") ? "../assets/items.json" : "assets/items.json";

  try{
    const res = await fetch(jsonPath, {cache:"no-store"});
    const map = await res.json();
    imgs.forEach(img => {
      const slug = img.getAttribute("data-slug");
      const list = map?.[slug];
      const pfx = img.getAttribute("data-prefix") || prefix;
      if (Array.isArray(list) && list.length){
        const pick = list[Math.floor(Math.random() * list.length)];
        img.src = pfx + pick;
      }
    });
  }catch(e){
    // If opened directly (file://) fetch may be blocked in some browsers.
    // In that case, images will remain as default placeholder.
  }
}
applyRandomItemImages();

/* Scroll showcase: reveal parts while scrolling */
(function(){
  const sec = document.getElementById("scrollShow");
  if (!sec) return;
  const car = sec.querySelector(".carImg");
  const parts = Array.from(sec.querySelectorAll(".part"));

  function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }

  function onScroll(){
    const r = sec.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    // progress 0..1 across the whole section scroll
    const total = sec.offsetHeight - vh;
    const scrolled = clamp(-r.top, 0, total);
    const p = total > 0 ? (scrolled / total) : 0;

    // car subtle motion
    if (car){
      const y = 10 - p*18;
      const s = 0.98 + p*0.05;
      car.style.transform = `translateY(${y}px) scale(${s})`;
    }

    // reveal parts in steps
    parts.forEach((el, i) => {
      const start = 0.12 + i*0.11;
      const end = start + 0.16;
      const t = clamp((p - start)/(end - start), 0, 1);
      el.style.opacity = t.toFixed(3);
      el.style.transform = `translateY(${(12 - t*12).toFixed(1)}px) scale(${(0.98 + t*0.02).toFixed(3)})`;
    });
  }

  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();
})();


/* First-time intro: car parts drop + "claim up to 50% offer" (shows once across pages) */
(function(){
  const INTRO_KEY = "kba_intro_seen_v1";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try{
    if (localStorage.getItem(INTRO_KEY)) return;
    localStorage.setItem(INTRO_KEY, "1");
  }catch(e){
    // if storage blocked, still show once per session/page
  }

  const isPages = window.location.pathname.includes("/pages/");
  const ASSETS = isPages ? "../assets/" : "assets/";

  const overlay = document.createElement("div");
  overlay.className = "introDrop";
  overlay.setAttribute("aria-hidden","true");

  const msg = document.createElement("div");
  msg.className = "introMsg";
  msg.innerHTML = `
    <div class="introMsgTop">
      <div class="introMsgTitle">🎉 Claim up to <b>50% OFF</b> on your first order</div>
      <div class="introMsgSub">Bearings • Belts • Filters • Brake Parts • Tools • Oils</div>
    </div>
  `;
  overlay.appendChild(msg);

  const icons = ["part-1.svg","part-2.svg","part-3.svg","part-4.svg","part-5.svg","part-6.svg","cat-bearings.svg","cat-v-belts.svg","cat-filters.svg"];
  const count = 14;

  for (let i=0;i<count;i++){
    const it = document.createElement("div");
    it.className = "dropItem";
    const img = document.createElement("img");
    img.alt = "";
    img.src = ASSETS + icons[Math.floor(Math.random()*icons.length)];
    it.appendChild(img);

    const x = Math.random()*100;
    const d = (Math.random()*0.8).toFixed(2);
    const dur = (1.4 + Math.random()*1.2).toFixed(2);
    const rot = (Math.random()*140 - 70).toFixed(0);
    const size = (34 + Math.random()*24).toFixed(0);
    it.style.left = x + "vw";
    it.style.animationDelay = d + "s";
    it.style.animationDuration = dur + "s";
    it.style.setProperty("--rot", rot + "deg");
    it.style.width = size + "px";
    it.style.height = size + "px";
    overlay.appendChild(it);
  }

  document.body.appendChild(overlay);

  // Auto remove
  setTimeout(() => {
    overlay.classList.add("hide");
    setTimeout(() => overlay.remove(), 650);
  }, 3800);
})();
