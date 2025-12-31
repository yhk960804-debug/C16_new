function flashHint(sectionEl){
  if(!sectionEl) return;
  const hint = sectionEl.querySelector(".hint");
  if(!hint) return;

  hint.style.display = "block";

  // ====== 你可以调的数值 ======
  const HINT_GAP = 12;  // hint 距离底条上缘留多少像素
  // ===========================

  requestAnimationFrame(()=>{
    const rect = hint.getBoundingClientRect();
    const safeBottom = window.innerHeight - CONTROLS_H;

    if(rect.bottom > safeBottom - HINT_GAP){
      const delta = rect.bottom - (safeBottom - HINT_GAP);
      window.scrollBy({ top: delta, behavior: "smooth" });
    }else if(rect.top < 0 + HINT_GAP){
      const delta = rect.top - HINT_GAP;
      window.scrollBy({ top: delta, behavior: "smooth" });
    }
  });

  if(hint._t) clearTimeout(hint._t);
  hint._t = setTimeout(()=>{ hint.style.display = "none"; }, 2000);
}

// ====== 你可以调的数值 ======
const CONTROLS_H = 120;
const LOCK_PAD   = 16;

let unlockedQ1B = false;
let unlockedQ2  = false;

function lockSection(id, locked){
  const el = document.getElementById(id);
  if(!el) return;
  el.classList.toggle("locked", locked);
  el.setAttribute("aria-disabled", locked ? "true" : "false");
}

function getScrollLimitY(){
  const anchorId = !unlockedQ1B ? "q1a" : (!unlockedQ2 ? "q1b" : "q2");
  const el = document.getElementById(anchorId);
  if(!el) return Infinity;

  const rect = el.getBoundingClientRect();
  const bottomDocY = window.scrollY + rect.bottom;
  const safeBottom = window.innerHeight - CONTROLS_H;

  return Math.max(0, bottomDocY - safeBottom + LOCK_PAD);
}

let _locking = false;
function enforceScrollLimit(){
  if(_locking) return;
  const maxY = getScrollLimitY();
  if(window.scrollY > maxY){
    _locking = true;
    window.scrollTo({ top: maxY, behavior: "auto" });
    _locking = false;
  }
}
window.addEventListener("scroll", enforceScrollLimit, { passive: true });
window.addEventListener("resize", enforceScrollLimit);

/* ================= 桌面端：HTML5 drag & drop ================= */
let dragged = null;

document.querySelectorAll(".option, .word").forEach(el=>{
  el.addEventListener("dragstart", e => dragged = e.target);
});

document.querySelectorAll(".drop-box").forEach(box=>{
  box.addEventListener("dragover", e => e.preventDefault());
  box.addEventListener("drop", e=>{
    e.preventDefault();
    if(!dragged) return;

    const text = dragged.innerText.trim();
    if(!dragged.classList.contains("option")) return;

    if(text !== box.dataset.answer){
      flashHint(box.closest(".section"));
      return;
    }

    const existing = box.querySelector(".option");
    if(existing){
      box.closest(".section").querySelector(".options").appendChild(existing);
    }

    box.appendChild(dragged);
    dragged = null;
    checkQ1();
  });
});

// 第二题：slot drop
document.querySelectorAll("#q2Answer .slot").forEach(slot=>{
  slot.addEventListener("dragover", e => e.preventDefault());
  slot.addEventListener("drop", e=>{
    e.preventDefault();
    if(!dragged) return;
    if(!dragged.classList.contains("word")) return;

    const existing = slot.querySelector(".word");
    if(existing) document.getElementById("q2Words").appendChild(existing);

    slot.appendChild(dragged);

    if(dragged.innerText.trim() !== slot.dataset.answer){
      flashHint(document.getElementById("q2"));
    }

    dragged = null;
    checkQ2();
  });
});

// 第二题：拖回选项区
const q2Words = document.getElementById("q2Words");
q2Words.addEventListener("dragover", e => e.preventDefault());
q2Words.addEventListener("drop", e=>{
  e.preventDefault();
  if(!dragged) return;
  if(!dragged.classList.contains("word")) return;
  q2Words.appendChild(dragged);
  dragged = null;
  checkQ2();
});

/* ================= 手机端：Pointer 触控拖放 ================= */
let pointerDrag = { el:null, ghost:null, offsetX:0, offsetY:0, active:false };

function isTouchPointer(e){
  return e.pointerType === "touch" || e.pointerType === "pen";
}

function startPointerDrag(e, el){
  pointerDrag.el = el;
  pointerDrag.active = true;

  const r = el.getBoundingClientRect();
  pointerDrag.offsetX = e.clientX - r.left;
  pointerDrag.offsetY = e.clientY - r.top;

  const ghost = el.cloneNode(true);
  ghost.style.position = "fixed";
  ghost.style.left = (e.clientX - pointerDrag.offsetX) + "px";
  ghost.style.top  = (e.clientY - pointerDrag.offsetY) + "px";
  ghost.style.zIndex = 9999;
  ghost.style.opacity = "0.9";
  ghost.style.pointerEvents = "none";
  ghost.style.transform = "scale(1.02)";
  document.body.appendChild(ghost);
  pointerDrag.ghost = ghost;
}

function movePointerDrag(e){
  if(!pointerDrag.active || !pointerDrag.ghost) return;
  pointerDrag.ghost.style.left = (e.clientX - pointerDrag.offsetX) + "px";
  pointerDrag.ghost.style.top  = (e.clientY - pointerDrag.offsetY) + "px";
}

function endPointerDrag(e){
  if(!pointerDrag.active) return;

  const el = pointerDrag.el;
  const ghost = pointerDrag.ghost;
  const target = document.elementFromPoint(e.clientX, e.clientY);

  // 1) 第一题：drop-box
  const dropBox = target && target.closest && target.closest(".drop-box");
  if(dropBox && el.classList.contains("option")){
    const text = el.innerText.trim();
    if(text === dropBox.dataset.answer){
      const existing = dropBox.querySelector(".option");
      if(existing){
        dropBox.closest(".section").querySelector(".options").appendChild(existing);
      }
      dropBox.appendChild(el);
      checkQ1();
    }else{
      flashHint(dropBox.closest(".section"));
    }
  }

  // 2) 第二题：slot
  const slot = target && target.closest && target.closest("#q2Answer .slot");
  if(slot && el.classList.contains("word")){
    const existing = slot.querySelector(".word");
    if(existing) document.getElementById("q2Words").appendChild(existing);

    slot.appendChild(el);

    if(el.innerText.trim() !== slot.dataset.answer){
      flashHint(document.getElementById("q2"));
    }

    checkQ2();
  }

  // 3) 第二题：拖回选项区
  const wordsArea = target && target.closest && target.closest("#q2Words");
  if(wordsArea && el.classList.contains("word")){
    wordsArea.appendChild(el);
    checkQ2();
  }

  if(ghost) ghost.remove();
  pointerDrag = { el:null, ghost:null, offsetX:0, offsetY:0, active:false };
}

document.querySelectorAll(".option, .word").forEach(el=>{
  el.addEventListener("pointerdown", (e)=>{
    if(!isTouchPointer(e)) return;
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    startPointerDrag(e, el);
  });

  el.addEventListener("pointermove", (e)=>{
    if(!isTouchPointer(e)) return;
    if(!pointerDrag.active) return;
    e.preventDefault();
    movePointerDrag(e);
  });

  el.addEventListener("pointerup", (e)=>{
    if(!isTouchPointer(e)) return;
    e.preventDefault();
    endPointerDrag(e);
  });

  el.addEventListener("pointercancel", (e)=>{
    if(!isTouchPointer(e)) return;
    endPointerDrag(e);
  });
});

/* ================= 检查逻辑 + reset ================= */
const SCROLL_DELAY = 1000; // 你要几秒：2000=2秒

let tScrollQ1B = null;
let tScrollQ2  = null;
let tScrollEnd = null;

function delayedScrollTo(id, timerName){
  if(timerName === "q1b" && tScrollQ1B) clearTimeout(tScrollQ1B);
  if(timerName === "q2"  && tScrollQ2)  clearTimeout(tScrollQ2);
  if(timerName === "end" && tScrollEnd) clearTimeout(tScrollEnd); // ✅ 修正拼字

  const fn = () => {
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  };

  if(timerName === "q1b") tScrollQ1B = setTimeout(fn, SCROLL_DELAY);
  if(timerName === "q2")  tScrollQ2  = setTimeout(fn, SCROLL_DELAY);
  if(timerName === "end") tScrollEnd = setTimeout(fn, SCROLL_DELAY);
}

let didAutoScroll = false;
let didScrollToQ1b = false;
let didScrollToQ2  = false;

function isSectionDone(id){
  const sec = document.getElementById(id);
  if(!sec) return false;
  return [...sec.querySelectorAll(".drop-box")].every(b => b.querySelector(".option"));
}

function isQ1AllDone(){
  return ["q1a","q1b"].every(id=>{
    const sec = document.getElementById(id);
    if(!sec) return false;
    return [...sec.querySelectorAll(".drop-box")].every(b => b.querySelector(".option"));
  });
}

function checkQ1(){
  const q1a = document.getElementById("q1a");
  const q1b = document.getElementById("q1b");

  const q1aDone = isSectionDone("q1a");
  const q1bDone = isSectionDone("q1b");

  if(q1a && q1aDone) q1a.querySelector(".success").style.display = "block";
  if(q1b && q1bDone) q1b.querySelector(".success").style.display = "block";

  if(q1aDone && !didScrollToQ1b){
    didScrollToQ1b = true;
    delayedScrollTo("q1b", "q1b");
  }

  if(q1aDone && q1bDone && !didScrollToQ2){
    didScrollToQ2 = true;
    delayedScrollTo("q2", "q2");
  }

  if(!q1aDone) didScrollToQ1b = false;
  if(!(q1aDone && q1bDone)) didScrollToQ2 = false;

  if(q1aDone && !unlockedQ1B){
    unlockedQ1B = true;
    lockSection("q1b", false);
    enforceScrollLimit();
  }

  if(q1aDone && q1bDone && !unlockedQ2){
    unlockedQ2 = true;
    lockSection("q2", false);
    enforceScrollLimit();
  }
}

function checkQ2(){
  const slots = [...document.querySelectorAll("#q2Answer .slot")];
  const success3 = document.getElementById("success3");

  if(slots.some(s => !s.querySelector(".word"))){
    success3.style.display = "none";
    didAutoScroll = false;
    return;
  }

  const ok = slots.every(s => s.querySelector(".word").innerText.trim() === s.dataset.answer);
  success3.style.display = ok ? "block" : "none";

  if(ok && isQ1AllDone() && !didAutoScroll){
    didAutoScroll = true;
    // 你若要也延迟再滚到底部成功，也可改成 delayedScrollTo("success3","end")
    success3.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if(!ok) didAutoScroll = false;
}

function resetQ2(){
  const q2Words = document.getElementById("q2Words");
  const success3 = document.getElementById("success3");

  document.querySelectorAll("#q2Answer .slot .word").forEach(w=>q2Words.appendChild(w));

  ["真开心","学习","各族同学","一起","我和"].forEach(t=>{
    const el = [...q2Words.querySelectorAll(".word")].find(x=>x.innerText.trim()===t);
    if(el) q2Words.appendChild(el);
  });

  if(success3) success3.style.display = "none";
  didAutoScroll = false;
}

function resetQ1Section(id, order){
  const sec = document.getElementById(id);
  if(!sec) return;

  const optionsBox = sec.querySelector(".options");
  if(!optionsBox) return;

  sec.querySelectorAll(".drop-box .option").forEach(opt=>{
    optionsBox.appendChild(opt);
  });

  order.forEach(t=>{
    const el = [...optionsBox.querySelectorAll(".option")]
      .find(x => x.innerText.trim() === t);
    if(el) optionsBox.appendChild(el);
  });

  const s = sec.querySelector(".success");
  if(s) s.style.display = "none";
}

/* ===== 底部按钮：重新开始 / 返回 ===== */
document.getElementById("restartAll").addEventListener("click", ()=>{
  unlockedQ1B = false;
  unlockedQ2  = false;
  lockSection("q1b", true);
  lockSection("q2",  true);

  didScrollToQ1b = false;
  didScrollToQ2  = false;
  didAutoScroll  = false;

  resetQ1Section("q1a", ["华族","印度族","马来族","玛美里族"]);
  resetQ1Section("q1b", ["锡克族","伊班族","卡达山杜顺族","峇峇娘惹"]);
  resetQ2();

  window.scrollTo({ top: 0, behavior: "smooth" });
  enforceScrollLimit();
});

document.getElementById("backBtn").addEventListener("click", ()=>{
  history.back();
});

/* 初始上锁 + 立刻执行一次限制 */
lockSection("q1b", true);
lockSection("q2",  true);
unlockedQ1B = false;
unlockedQ2  = false;
enforceScrollLimit();
