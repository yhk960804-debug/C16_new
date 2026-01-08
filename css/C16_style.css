@font-face{
  font-family: "MixFont";
  src: url("../fonts/Azim-Light.otf") format("opentype");
  font-weight: 400;
  font-style: normal;
  unicode-range: U+0000-024F, U+2000-206F, U+20A0-20CF;
}

@font-face{
  font-family: "MixFont";
  src: url("../fonts/HYc1gj.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  unicode-range: U+3000-303F, U+3400-4DBF, U+4E00-9FFF, U+FF00-FFEF;
}

@font-face{
  font-family: "MixFont";
  src: url("../fonts/DFKai-SB.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  unicode-range: U+3000-303F,U+3400-4DBF,U+4E00-9FFF,U+FF00-FFEF;;
}

@font-face{
  font-family: "MixFont";
  src: url("../fonts/STKaiti.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  unicode-range: U+3000-303F,U+3400-4DBF,U+4E00-9FFF,U+FF00-FFEF;
}

:root{
  --bg:#fafafa;
  --card:#ffffff;
  --shadow:0 0 10px rgba(0,0,0,.08);
  --gap:clamp(10px, 2.4vw, 20px);
  --radius:16px;
  --fs:clamp(20px, 3.8vw, 30px);
  --h2:clamp(50px, 10vw, 60px);
  --c2:#99DBF5;
  --c3:#A7ECEE;
}

*{ box-sizing:border-box; }

.cornerTag{
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10001;
  pointer-events: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.cornerTag img{ height: 18px; width:auto; display:block; flex:0 0 auto; }
.cornerTag > span{
  font-size: 14px;
  line-height: 1;
  color: rgba(0,0,0,.75);
  white-space: nowrap;
}
.cornerTag .en{
  font-size: 12px;
  display: inline-block;
  transform: translateY(-0.03em);
}

body{
  margin:0;
  padding:clamp(10px, 3vw, 20px);
  font-family: "MixFont","KaiTi","Kaiti SC","STKaiti","DFKai-SB", serif;
  font-size:var(--fs);
  font-weight:bold;
  line-height:1.35;
  background: linear-gradient(180deg, var(--c2), #ffffff 55%, var(--c3));
}

.lead{ margin:2px 0 5px; font-size:clamp(20px, 3.8vw, 30px); }

.container{ max-width:1100px; margin:0 auto; }

.section{
  background:var(--card);
  border-radius:var(--radius);
  padding:clamp(14px, 3vw, 24px);
  margin:0 0 var(--gap);
  box-shadow:var(--shadow);
}

h2{ 
  font-family: "MixFont","KaiTi","Kaiti SC","STKaiti","DFKai-SB", serif;
  font-size:var(--h2); 
  text-align:center; 
}

#pageTitle{
  width: min(1200px, 100%);
  margin: 10px auto 0px;
  text-align:center;
  font-size: var(--h2);
  font-weight: 800;
  line-height: 2;
  text-shadow:
    -2px -2px 0 #fff,  2px -2px 0 #fff,
    -2px  2px 0 #fff,  2px  2px 0 #fff,
     0   -2px 0 #fff,  0    2px 0 #fff,
    -2px  0   0 #fff,  2px  0   0 #fff,
     0    4px 10px rgba(0,0,0,.18);
}

/* 通用提示 */
.success{
  text-align:center;
  font-size:clamp(26px, 4.6vw, 40px);
  margin-top:clamp(10px, 2.2vw, 18px);
  display:none;
  color:#1aa260;
}

#success3 b{
  display: block;
  width: fit-content;
  max-width: calc(100% - 24px);
  margin: 10px auto 0;
  padding: 10px clamp(16px, 8vw, 90px);
  font-size: clamp(24px, 6vw, 37px);
  white-space: nowrap;
  word-break: keep-all;
  overflow-wrap: normal;
  text-align: center;
  box-sizing: border-box;
}

.hint{
  text-align:center;
  font-size:clamp(22px, 4vw, 34px);
  margin-top:clamp(10px, 2vw, 16px);
  display:none;
  color:#323232;
}

/* ========= 第一题 ========= */
.qblock{ display:grid; gap:var(--gap); grid-template-columns:1fr; }

.options, .answers{
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
  gap:var(--gap);
}

.option, .word{ touch-action:none; user-select:none; }

.option{
  background: linear-gradient(180deg, #D4F6FF, #C6E7FF);
  padding:clamp(10px, 1.3vw, 10px) clamp(10px, 1.3vw, 10px);
  border-radius:14px;
  cursor:grab;
  box-shadow:var(--shadow);
  margin-top:0px;
}

.options .option{
  text-align:center;
  white-space:nowrap;
  overflow-wrap:normal;
  word-break:keep-all;
  flex: 0 0 calc(20% - (var(--gap) / 2));
}

.drop-box{
  flex: 0 0 calc(50% - (var(--gap) / 2));
  width:clamp(140px, 24vw, 200px);
  height:clamp(170px, 26vw, 240px);
  border:2px dashed #aaa;
  border-radius:18px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:flex-start;
  padding-top:8px;
  background:#fff;
  text-align:center;
  overflow: visible;
}

.drop-box img{
  width:100%;
  height:clamp(95px, 16vw, 150px);
  object-fit:contain;
  pointer-events:none;
}

.drop-box[data-answer="马来族"] img{
  transform: translateY(-10px) scale(1.2);
  transform-origin: center;
}
.drop-box[data-answer="华族"] img{
  transform: translateY(-10px) scale(1.1);
  transform-origin: center;
}
@media (max-width: 700px){
  .drop-box[data-answer="马来族"] img{
    transform: translateY(-14px) scale(1.35);
  }
}

/* ========= 第二题 ========= */
.words{
  display:flex;
  flex-wrap:wrap;
  gap:var(--gap);
  justify-content:center;
  margin-top:clamp(8px, 2vw, 14px);
}
.word{
  background:#fff3e0;
  padding:clamp(10px, 5vw, 10px) clamp(10px, 5vw, 10px);
  border-radius:12px;
  cursor:grab;
  box-shadow:var(--shadow);
}
.answer-line{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:clamp(6px, 1.5vw, 10px);
  margin-top:clamp(10px, 2.2vw, 18px);
  flex-wrap:wrap;
}
.slot{
  border:2px dashed #aaa;
  border-radius:12px;
  min-height:clamp(46px, 8vw, 56px);
  display:flex;
  align-items:center;
  justify-content:center;
  background:#fff;
  padding:4px 4px;
}
.slot.len2{ width: 4em; }
.slot.len3{ width: 5em; }
.slot.len4{ width: 6em; }
.punct{ font-size:var(--fs); line-height:1; }
.slot .word{ margin:0; box-shadow:none; }

.locked{
  opacity:.45;
  filter: grayscale(.15);
}
.locked, .locked *{ pointer-events:none; }

#success3 b{
  color:#00712D;
  font-family: "MixFont","KaiTi","Kaiti SC","STKaiti","DFKai-SB", serif;
  display:inline-block;
  text-align:center;
  margin:5px 0 0px;
  font-size:37px;
  background:#F8FDCF;
  padding:10px 90px;
  border-radius:20px;
  text-shadow:
    -2px -2px 0 #D5ED9F,  2px -2px 0 #D5ED9F,
    -2px  2px 0 #D5ED9F,  2px  2px 0 #D5ED9F,
     0   -2px 0 #D5ED9F,  0    2px 0 #D5ED9F,
    -2px  0   0 #D5ED9F,  2px  0   0 #D5ED9F,
     0    4px 10px rgba(0,0,0,.18);
}

/* ===== 响应式 ===== */
@media (min-width: 900px){
  :root{ --fs:22px; --h2:40px; }
}
@media (max-width: 700px){
  #q1a .options, #q1b .options{
    flex-wrap:wrap;
    overflow-x:visible;
    -webkit-overflow-scrolling:touch;
    justify-content:center;
    gap:14px;
    padding:6px 4px 10px;
  }
  #q1a .answers, #q1b .answers{
    display:grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    justify-items:center;
    gap:14px;
  }
  #q1a .drop-box, #q1b .drop-box{
    width:100%;
    max-width:230px;
  }
}
  #success3 b{
    font-size: clamp(32px, 8vw, 40px);          /* 手机字更小一点 */
    padding: 10px clamp(28px, 8vw, 50px);       /* 左右 padding 变小 */
    max-width: calc(100% - 24px);               /* 防止超出卡片 */
    box-sizing: border-box;
  }

/* ===== 底部按钮（PNG） ===== */
#controls{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:100px;
  margin:24px 0 10px;
  padding-bottom:calc(10px + env(safe-area-inset-bottom));
  background:transparent;
  position:sticky;
  bottom:0;
  z-index:50;
}
#controls::before{
  content:none;
  display:none;
  position:absolute;
  inset:0;
  background: linear-gradient(180deg, rgba(255,255,255,.0), rgba(255,255,255,.85));
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  z-index:0;
  pointer-events:none;
}
#controls button{ position:relative; z-index:1; }

#controls .img-btn{
  width: clamp(40px, 12vw, 60px);
  height: clamp(60px, 40vw, 80px);
  border:none;
  padding:0;
  cursor:pointer;
  background: transparent no-repeat center / contain;
  -webkit-tap-highlight-color: transparent;
}
#controls .img-restart{ background-image:url("../images/BTN_RESTART_RED.png"); }
#controls .img-home{ background-image:url("../images/BTN_HOME_RED.png"); }
#controls .img-btn:active{ transform:scale(0.98); }

#controls{ display:flex; } 
#btnBack{ order: 1; } 
#btnRestart{ order: 2; } 

/* ===== 只改电脑端（>=900px） ===== */
@media (min-width: 900px){
  h2,
  #pageTitle{
    font-size: 55px !important;
  }

  .words .word,
  .answer-line .slot,
  .answer-line .slot .word{
    font-size: clamp(20px, 3.8vw, 30px) !important; /* 与 .lead 完全一致 */
  }
.option{ font-size: clamp(20px, 3.8vw, 30px) !important; }
}

/* ===== 只改手机竖屏：不影响电脑端 / 不影响手机横屏 ===== */
@media (max-width: 700px) and (orientation: portrait){

  h2,
  #pageTitle{
    font-size: 35px !important;
  }

  :root{
    --leadSizeP: clamp(20px, 3.8vw, 30px);
  }
  .lead{ font-size: var(--leadSizeP) !important; }

  .options .option,
  .drop-box .option,
  .words .word,
  .answer-line .slot,
  .answer-line .slot .word{
    font-size: var(--leadSizeP) !important;
  }
}
/* ===== 只改手机横屏 ===== */
@media (max-width: 900px) and (orientation: landscape){

  /* 1) 标题 h2 固定 35px（含 #pageTitle） */
  h2, #pageTitle{
    font-size: 35px !important;
  }

  /* 2) 字号：option / dropbox内的option / words / slot 都 =「手机竖屏 .lead」的字号
        你竖屏 .lead 用的是 clamp(20px, 3.8vw, 30px)，在手机竖屏通常会落在 20px。
        为了让横屏“跟竖屏一样”，这里直接固定为 20px（最稳定）。 */
  .lead,
  .options .option,
  .drop-box .option,
  .words .word,
  .answer-line .slot,
  .answer-line .slot .word{
    font-size: 20px !important;
  }

  /* 3) 横屏整体缩小 50%（推荐：缩小间距/盒子尺寸，而不是 transform 缩放） */
  :root{
    --gap: clamp(5px, 1.2vw, 10px);   /* 原本大约的一半 */
    --radius: 8px;                    /* 原本 16px 的一半 */
  }
  body{ padding: clamp(5px, 1.5vw, 10px); }       /* 原本的一半左右 */
  .section{ padding: clamp(7px, 1.5vw, 12px); }
  .option{ padding: 6px 8px; border-radius: 10px; }
  .word{ padding: 6px 8px; border-radius: 10px; }
  .slot{ min-height: 38px; }
  .drop-box{
    width: 100%;
    flex: none;
    height: clamp(120px, 38vh, 170px);
    border-radius: 12px;
  }
  .drop-box img{
    height: clamp(70px, 22vh, 110px);
  }

  /* 4) 横屏排版：Q1A / Q1B 统一为
        4 个 option 一排（在 lead 下），4 个 drop-box 一排（在 option 下） */
  #q1a .options, #q1b .options{
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--gap);
    justify-items: stretch;
  }
  #q1a .answers, #q1b .answers{
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--gap);
    justify-items: stretch;
  }

  /* 取消你原本 .options .option 的 flex 规则（否则会和 grid 冲突） */
  #q1a .options .option, #q1b .options .option{
    flex: none !important;
    width: 100%;
    white-space: nowrap;
  }
    #controls{
    gap: 40px;                  /* 原本 100px 太大 */
    margin: 10px 0 6px;
  }

  #controls .img-btn{
    width:  clamp(32px, 7vw, 44px);
    height: clamp(40px, 9vw, 56px);
  }
}

