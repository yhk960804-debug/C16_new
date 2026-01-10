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
    const safeBottom = window.innerHeight - getControlsH();

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

function scrollToSuccess(sectionId){
  const sec = document.getElementById(sectionId);
  if(!sec) return;
  const success = sec.querySelector(".success");
  if(!success) return;

  // 先确保它是可见的
  success.style.display = "block";

  const GAP = 12;
  requestAnimationFrame(()=>{
    const rect = success.getBoundingClientRect();
    const safeBottom = window.innerHeight - CONTROLS_H;

    if(rect.bottom > safeBottom - GAP){
      const delta = rect.bottom - (safeBottom - GAP);
      window.scrollBy({ top: delta, behavior: "smooth" });
    }else if(rect.top < 0 + GAP){
      const delta = rect.top - GAP;
      window.scrollBy({ top: delta, behavior: "smooth" });
    }
  });
}
function ensureVisible(el, gap = 12){
  if(!el) return;

  requestAnimationFrame(()=>{
    const rect = el.getBoundingClientRect();
    const safeBottom = window.innerHeight - CONTROLS_H;

    // 元素底部被底栏挡住 -> 往下滚
    if(rect.bottom > safeBottom - gap){
      const delta = rect.bottom - (safeBottom - gap);
      window.scrollBy({ top: delta, behavior: "smooth" });
    }
    // 元素顶部跑到视窗上方 -> 往上滚
    else if(rect.top < gap){
      const delta = rect.top - gap;
      window.scrollBy({ top: delta, behavior: "smooth" });
    }
  });
}

let didScrollToQ1aSuccess = false;


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
// ✅ 只针对“玛美里族 / 印度族”这两个 drop-box，强制滚到看得见
if(box.dataset.answer === "玛美里族" || box.dataset.answer === "印度族"){
  ensureVisible(box);
}
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

 const dropBox = target && target.closest && target.closest(".drop-box");
if(dropBox && el.classList.contains("option")){
  const text = el.innerText.trim();

  if(text === dropBox.dataset.answer){
    const existing = dropBox.querySelector(".option");
    if(existing){
      dropBox.closest(".section").querySelector(".options").appendChild(existing);
    }
    dropBox.appendChild(el);

    if(isMobileLandscape()) ensureVisible(dropBox);
    checkQ1();
  }else{
    // ✅ 手机端答错：显示 “想一想，再回答”
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
const SCROLL_DELAY = 1500; // 你要几秒：2000=2秒

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

  // ✅ 新增：Q1A 第一次完成时，先滚到 Q1A 的 success
  if(q1aDone && !didScrollToQ1aSuccess){
    didScrollToQ1aSuccess = true;
    scrollToSuccess("q1a");
  }

  if(q1aDone && !didScrollToQ1b){
    didScrollToQ1b = true;
    delayedScrollTo("q1b", "q1b");
  }
  if(q1bDone && !didScrollToQ1bSuccess){
    didScrollToQ1bSuccess = true;
   scrollToSuccess("q1b");
  }
  if(q1aDone && q1bDone && !didScrollToQ2){
    didScrollToQ2 = true;
    delayedScrollTo("q2", "q2");
  }

  if(!q1aDone){
    didScrollToQ1aSuccess = false;
   didScrollToQ1b = false;
  }
  if(!q1bDone){
   didScrollToQ1bSuccess = false;
  }

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
let didScrollToQ1bSuccess = false;


function checkQ2(){
  const slots = [...document.querySelectorAll("#q2Answer .slot")];
  const success3 = document.getElementById("success3");

  if(slots.some(s => !s.querySelector(".word"))){
    success3.style.display = "none";
    document.body.classList.remove("show-success3"); // ✅ 加这里
    didAutoScroll = false;
    return;
  }


  const ok = slots.every(s => s.querySelector(".word").innerText.trim() === s.dataset.answer);
  success3.style.display = ok ? "block" : "none";
  document.body.classList.toggle("show-success3", ok); // ✅ 只在出现时加底部空间

  if(ok && isQ1AllDone() && !didAutoScroll){
    didAutoScroll = true;

    const sticker = success3.querySelector("b") || success3; // ✅ 锁定「你真棒！」

  // 先滚到靠下位置
    sticker.scrollIntoView({ behavior:"smooth", block:"end" });

  // 再用你现成的 ensureVisible，确保不会被 #controls 挡住
    setTimeout(()=>ensureVisible(sticker, 12), 250);
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
  document.body.classList.remove("show-success3"); 
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
document.getElementById("btnRestart").addEventListener("click", ()=>{
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

document.getElementById("btnBack").addEventListener("click", ()=>{
  history.back();
});

function asset(src) {
  return src; // 目前你的路径已是 "images/xxx.png"，直接返回即可
}

/* 你的按钮图片路径（按你的实际文件名改） */
const BTN_HOME_RED     = "images/BTN_HOME_RED.png";
const BTN_HOME_YELLOW  = "images/BTN_HOME_YELLOW.png";
const BTN_RESTART_RED  = "images/BTN_RESTART_RED.png";
const BTN_RESTART_YELLOW = "images/BTN_RESTART_YELLOW.png";

/** 绑定“按下变黄、放开变红”的效果（支持 pointer + 键盘） */
function bindPressSwap(buttonEl, redSrc, yellowSrc) {
  if (!buttonEl) return;

  // 兼容：按钮内部有 img 就换 img.src；没有 img 就换按钮背景图
  const img = buttonEl.querySelector("img") || null;

  const preload = (src) => {
    const im = new Image();
    im.src = asset(src);
  };
  preload(redSrc);
  preload(yellowSrc);

  const applyRed = () => {
    if (img) img.src = asset(redSrc);
    else buttonEl.style.backgroundImage = `url("${asset(redSrc)}")`;
  };

  const applyYellow = (e) => {
    // 鼠标右键/中键不触发
    if (e?.pointerType === "mouse" && e.button !== 0) return;
    if (img) img.src = asset(yellowSrc);
    else buttonEl.style.backgroundImage = `url("${asset(yellowSrc)}")`;
  };

  // 初始化为红色
  applyRed();

  // pointer：按下/抬起/取消/离开
  buttonEl.addEventListener("pointerdown", applyYellow);
  buttonEl.addEventListener("pointerup", applyRed);
  buttonEl.addEventListener("pointercancel", applyRed);
  buttonEl.addEventListener("pointerleave", applyRed);
  requestAnimationFrame(applyRed); // 再补一次，确保首帧渲染



  // 键盘：Enter/Space
  buttonEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      // Space 默认会滚动页面，通常应阻止
      e.preventDefault();
      applyYellow(e);
    }
  });
  buttonEl.addEventListener("keyup", (e) => {
    if (e.key === "Enter" || e.key === " ") applyRed();
  });

  // 窗口失焦：强制回红色，避免卡在黄色
  window.addEventListener("blur", applyRed, { passive: true });
}

/* 绑定你的两个按钮 */
const btnBack = document.getElementById("btnBack");
const btnRestart = document.getElementById("btnRestart");

bindPressSwap(btnBack, BTN_HOME_RED, BTN_HOME_YELLOW);
bindPressSwap(btnRestart, BTN_RESTART_RED, BTN_RESTART_YELLOW);

/* 初始上锁 + 立刻执行一次限制 */
lockSection("q1b", true);
lockSection("q2",  true);
unlockedQ1B = false;
unlockedQ2  = false;
enforceScrollLimit();


function isMobileLandscape(){
  return window.matchMedia("(max-width: 900px) and (orientation: landscape)").matches;
}

function getControlsH(){
  const c = document.getElementById("controls");
  return c ? Math.ceil(c.getBoundingClientRect().height) : CONTROLS_H; // 用你原本常数兜底
}

function ensureVisible(el, gap = 12){
  if(!el) return;

  requestAnimationFrame(()=>{
    const rect = el.getBoundingClientRect();
    const safeBottom = window.innerHeight - getControlsH();

    if(rect.bottom > safeBottom - gap){
      window.scrollBy({ top: rect.bottom - (safeBottom - gap), behavior:"smooth" });
    }else if(rect.top < gap){
      window.scrollBy({ top: rect.top - gap, behavior:"smooth" });
    }
  });
}

function hitTest(selector, x, y){
  const list = Array.from(document.querySelectorAll(selector));
  return list.find(el=>{
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }) || null;
}

