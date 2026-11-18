/* ==========================================================================
           1. DATASETS (Thai Consonants, English A-Z, Minimal Curated Colors)
           ========================================================================== */
const THAI_CONSONANTS = [
  { char: "ก", name: "ก ไก่" },
  { char: "ข", name: "ข ไข่" },
  { char: "ฃ", name: "ฃ ขวด" },
  { char: "ค", name: "ค ควาย" },
  { char: "ฅ", name: "ฅ คน" },
  { char: "ฆ", name: "ฆ ระฆัง" },
  { char: "ง", name: "ง งู" },
  { char: "จ", name: "จ จาน" },
  { char: "ฉ", name: "ฉ ฉิ่ง" },
  { char: "ช", name: "ช ช้าง" },
  { char: "ซ", name: "ซ โซ่" },
  { char: "ฌ", name: "ฌ เฌอ" },
  { char: "ญ", name: "ญ หญิง" },
  { char: "ฎ", name: "ฎ ชฎา" },
  { char: "ฏ", name: "ฏ ปฏัก" },
  { char: "ฐ", name: "ฐ ฐาน" },
  { char: "ฑ", name: "ฑ มณโฑ" },
  { char: "ฒ", name: "ฒ ผู้เฒ่า" },
  { char: "ณ", name: "ณ เณร" },
  { char: "ด", name: "ด เด็ก" },
  { char: "ต", name: "ต เต่า" },
  { char: "ถ", name: "ถ ถุง" },
  { char: "ท", name: "ท ทหาร" },
  { char: "ธ", name: "ธ ธง" },
  { char: "น", name: "น หนู" },
  { char: "บ", name: "บ ใบไม้" },
  { char: "ป", name: "ป ปลา" },
  { char: "ผ", name: "ผ ผึ้ง" },
  { char: "ฝ", name: "ฝ ฝา" },
  { char: "พ", name: "พ พาน" },
  { char: "ฟ", name: "ฟ ฟัน" },
  { char: "ภ", name: "ภ สำเภา" },
  { char: "ม", name: "ม ม้า" },
  { char: "ย", name: "ย ยักษ์" },
  { char: "ร", name: "ร เรือ" },
  { char: "ล", name: "ล ลิง" },
  { char: "ว", name: "ว แหวน" },
  { char: "ศ", name: "ศ ศาลา" },
  { char: "ษ", name: "ษ ฤๅษี" },
  { char: "ส", name: "ส เสือ" },
  { char: "ห", name: "ห หีบ" },
  { char: "ฬ", name: "ฬ จุฬา" },
  { char: "อ", name: "อ อ่าง" },
  { char: "ฮ", name: "ฮ นกฮูก" },
];

const ENGLISH_LETTERS = Array.from({ length: 26 }, (_, i) => {
  const upper = String.fromCharCode(65 + i);
  const lower = String.fromCharCode(97 + i);
  return { char: upper, sub: `${upper} · ${lower}` };
});

const COLORS = [
  { nameTh: "สีแดง", nameEn: "Crimson Red", hex: "#EF4444" },
  { nameTh: "สีส้ม", nameEn: "Tangerine Orange", hex: "#F97316" },
  { nameTh: "สีเหลืองอำพัน", nameEn: "Amber Yellow", hex: "#F59E0B" },
  { nameTh: "สีเขียวมรกต", nameEn: "Emerald Green", hex: "#10B981" },
  { nameTh: "สีเขียวมิ้นต์", nameEn: "Mint Teal", hex: "#14B8A6" },
  { nameTh: "สีฟ้าคราม", nameEn: "Sky Blue", hex: "#0EA5E9" },
  { nameTh: "สีน้ำเงินโคบอลต์", nameEn: "Cobalt Blue", hex: "#3B82F6" },
  { nameTh: "สีน้ำเงินเข้ม", nameEn: "Indigo", hex: "#6366F1" },
  { nameTh: "สีม่วงไวโอเล็ต", nameEn: "Violet", hex: "#8B5CF6" },
  { nameTh: "สีชมพูโรส", nameEn: "Rose Pink", hex: "#F43F5E" },
  { nameTh: "สีชมพูซากุระ", nameEn: "Soft Pink", hex: "#F472B6" },
  { nameTh: "สีขาวบริสุทธิ์", nameEn: "Pure White", hex: "#F4F4F5" },
  { nameTh: "สีเทาสเลท", nameEn: "Slate Gray", hex: "#64748B" },
  { nameTh: "สีดำออบซิเดียน", nameEn: "Obsidian Black", hex: "#18181B" },
  { nameTh: "สีน้ำตาลเอิร์ธ", nameEn: "Warm Brown", hex: "#A16207" },
  { nameTh: "สีเขียวมะกอก", nameEn: "Olive Lime", hex: "#84CC16" },
];

/* ==========================================================================
           2. STATE
           ========================================================================== */
const state = {
  currentMode: "thai", // 'thai' | 'eng' | 'color'
  isSpinning: false,
  soundEnabled: true,
  noRepeat: false,
  usedIndices: {
    thai: new Set(),
    eng: new Set(),
    color: new Set(),
  },
  history: {
    thai: [],
    eng: [],
    color: [],
  },
};

/* ==========================================================================
           3. SOFT WEB AUDIO SYNTHESIZER
           ========================================================================== */
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) audioCtx = new AudioCtx();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function playSoftTick(progress = 0.5) {
  if (!state.soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const freq = 260 + progress * 180;
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch (e) {}
}

function playSoftChime() {
  if (!state.soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;

    const freqs = [523.25, 659.25]; // Gentle C5 -> E5
    freqs.forEach((f, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const start = audioCtx.currentTime + idx * 0.06;

      osc.type = "sine";
      osc.frequency.setValueAtTime(f, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.08, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(start);
      osc.stop(start + 0.38);
    });
  } catch (e) {}
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  const icon = document.getElementById("soundIcon");
  const label = document.getElementById("soundLabel");

  if (state.soundEnabled) {
    initAudio();
    icon.className = "fa-solid fa-volume-high text-zinc-300";
    label.textContent = "เสียงเปิด";
    playSoftTick(0.7);
  } else {
    icon.className = "fa-solid fa-volume-xmark text-zinc-500";
    label.textContent = "เสียงปิด";
  }
}

/* ==========================================================================
           4. MODE & POOL LOGIC
           ========================================================================== */
function getDataset(mode) {
  if (mode === "thai") return THAI_CONSONANTS;
  if (mode === "eng") return ENGLISH_LETTERS;
  return COLORS;
}

function switchMode(mode) {
  if (state.isSpinning || state.currentMode === mode) return;
  state.currentMode = mode;

  const modes = ["thai", "eng", "color"];
  const index = modes.indexOf(mode);

  // Slide indicator
  const indicator = document.getElementById("tabIndicator");
  indicator.style.transform = `translateX(${index * 100}%)`;

  // Update tab text colors
  modes.forEach((m) => {
    const btn = document.getElementById(`tab-${m}`);
    if (m === mode) {
      btn.classList.remove("text-zinc-400", "hover:text-zinc-200");
      btn.classList.add("text-zinc-950");
    } else {
      btn.classList.remove("text-zinc-950");
      btn.classList.add("text-zinc-400", "hover:text-zinc-200");
    }
  });

  document.getElementById("inlineAlert").classList.add("hidden");
  resetDisplayPlaceholder();
  updatePoolUI();
  renderHistory();
  playSoftTick(0.4);
}

function resetDisplayPlaceholder() {
  const placeholders = {
    thai: { symbol: "ก-ฮ", text: "พร้อมสุ่มพยัญชนะไทย 44 ตัว" },
    eng: { symbol: "A-Z", text: "พร้อมสุ่มตัวอักษรอังกฤษ 26 ตัว" },
    color: {
      symbol:
        '<span class="w-8 h-8 rounded-full border border-zinc-600 inline-block"></span>',
      text: "พร้อมสุ่มสีต่างๆ 16 เฉดสี",
    },
  };
  const p = placeholders[state.currentMode];
  document.getElementById("resultContainer").innerHTML = `
                <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-[#111114] border border-white/[0.07] flex items-center justify-center mb-4">
                    <span class="text-3xl sm:text-4xl font-semibold text-zinc-500 tracking-wider flex items-center justify-center">${p.symbol}</span>
                </div>
                <p class="text-sm text-zinc-400">${p.text}</p>
            `;
}

function toggleNoRepeat() {
  if (state.isSpinning) return;
  state.noRepeat = !state.noRepeat;

  const btn = document.getElementById("noRepeatToggle");
  const knob = document.getElementById("noRepeatKnob");
  btn.setAttribute("aria-checked", state.noRepeat);

  if (state.noRepeat) {
    btn.classList.remove("bg-zinc-800");
    btn.classList.add("bg-zinc-200");
    knob.classList.remove("translate-x-0", "bg-zinc-400");
    knob.classList.add("translate-x-4", "bg-zinc-950");
  } else {
    btn.classList.remove("bg-zinc-200");
    btn.classList.add("bg-zinc-800");
    knob.classList.remove("translate-x-4", "bg-zinc-950");
    knob.classList.add("translate-x-0", "bg-zinc-400");
    document.getElementById("inlineAlert").classList.add("hidden");
  }
  updatePoolUI();
}

function updatePoolUI() {
  const mode = state.currentMode;
  const total = getDataset(mode).length;
  const used = state.usedIndices[mode].size;
  const remaining = total - used;

  const counterEl = document.getElementById("poolCounter");
  const resetPoolBtn = document.getElementById("resetPoolBtn");

  if (state.noRepeat) {
    counterEl.textContent = `เหลือ ${remaining} จาก ${total} รายการ`;
    resetPoolBtn.classList.toggle("hidden", used === 0);
  } else {
    counterEl.textContent = `ทั้งหมด ${total} รายการ`;
    resetPoolBtn.classList.add("hidden");
  }
}

function resetModePool() {
  const mode = state.currentMode;
  state.usedIndices[mode].clear();
  document.getElementById("inlineAlert").classList.add("hidden");
  updatePoolUI();
  resetDisplayPlaceholder();
  playSoftTick(0.6);
}

/* ==========================================================================
           5. SPINNING & RENDERING
           ========================================================================== */
function startRandomSpin() {
  if (state.isSpinning) return;

  const mode = state.currentMode;
  const dataset = getDataset(mode);
  const usedSet = state.usedIndices[mode];

  let availableIndices = [];
  if (state.noRepeat) {
    for (let i = 0; i < dataset.length; i++) {
      if (!usedSet.has(i)) availableIndices.push(i);
    }
    if (availableIndices.length === 0) {
      document.getElementById("inlineAlert").classList.remove("hidden");
      return;
    }
  } else {
    availableIndices = dataset.map((_, i) => i);
  }

  const finalIndex =
    availableIndices[Math.floor(Math.random() * availableIndices.length)];

  state.isSpinning = true;
  document.getElementById("inlineAlert").classList.add("hidden");

  const spinBtn = document.getElementById("spinBtn");
  const spinBtnText = document.getElementById("spinBtnText");
  spinBtn.disabled = true;
  spinBtnText.textContent = "กำลังสุ่ม...";

  const totalSteps = 18;
  let step = 0;

  function tick() {
    step++;
    const progress = step / totalSteps;

    if (step < totalSteps) {
      const previewIdx = Math.floor(Math.random() * dataset.length);
      renderResult(mode, dataset[previewIdx], false);
      playSoftTick(progress);

      const delay = 35 + Math.pow(progress, 2.3) * 145;
      setTimeout(tick, delay);
    } else {
      if (state.noRepeat) {
        usedSet.add(finalIndex);
      }
      const winner = dataset[finalIndex];
      renderResult(mode, winner, true);
      recordHistory(mode, winner);
      updatePoolUI();
      playSoftChime();

      state.isSpinning = false;
      spinBtn.disabled = false;
      spinBtnText.textContent = "สุ่ม";
    }
  }

  tick();
}

function renderResult(mode, item, isFinal) {
  const container = document.getElementById("resultContainer");
  const animClass = isFinal ? "animate-reveal" : "opacity-65 scale-95";

  if (mode === "thai") {
    container.innerHTML = `
                    <div class="${animClass} flex flex-col items-center">
                        <div class="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl bg-[#111114] border ${isFinal ? "border-white/20" : "border-white/[0.06]"} flex items-center justify-center mb-4">
                            <span class="text-7xl sm:text-8xl font-semibold text-zinc-100 leading-none select-none">
                                ${item.char}
                            </span>
                        </div>
                        <span class="text-base sm:text-lg font-medium ${isFinal ? "text-zinc-200" : "text-zinc-500"}">
                            ${item.name}
                        </span>
                    </div>
                `;
  } else if (mode === "eng") {
    container.innerHTML = `
                    <div class="${animClass} flex flex-col items-center">
                        <div class="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl bg-[#111114] border ${isFinal ? "border-white/20" : "border-white/[0.06]"} flex items-center justify-center mb-4">
                            <span class="font-inter text-7xl sm:text-8xl font-semibold text-zinc-100 leading-none select-none">
                                ${item.char}
                            </span>
                        </div>
                        <span class="font-inter text-base sm:text-lg font-medium ${isFinal ? "text-zinc-200" : "text-zinc-500"}">
                            ${item.sub}
                        </span>
                    </div>
                `;
  } else if (mode === "color") {
    container.innerHTML = `
                    <div class="${animClass} flex flex-col items-center">
                        <div class="w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-white/15 mb-4 shadow-lg transition-colors"
                             style="background-color: ${item.hex};">
                        </div>
                        <h2 class="text-xl sm:text-2xl font-semibold text-zinc-100">
                            ${item.nameTh}
                        </h2>
                        <div class="flex items-center gap-2 mt-1.5 text-xs font-inter text-zinc-400">
                            <span>${item.nameEn}</span>
                            <span>•</span>
                            <span class="px-2 py-0.5 rounded bg-[#111114] border border-white/[0.08] text-zinc-300">${item.hex}</span>
                        </div>
                    </div>
                `;
  }
}

/* ==========================================================================
           6. HISTORY & KEYBOARD SHORTCUT
           ========================================================================== */
function recordHistory(mode, item) {
  state.history[mode].unshift(item);
  if (state.history[mode].length > 24) {
    state.history[mode].pop();
  }
  renderHistory();
}

function renderHistory() {
  const mode = state.currentMode;
  const list = state.history[mode];
  const container = document.getElementById("historyList");
  const countEl = document.getElementById("historyCount");
  const clearBtn = document.getElementById("clearHistoryBtn");

  countEl.textContent = list.length;
  clearBtn.disabled = list.length === 0;

  if (list.length === 0) {
    container.innerHTML = `<p class="text-xs text-zinc-600 py-2">ยังไม่มีประวัติการสุ่ม</p>`;
    return;
  }

  container.innerHTML = list
    .map((item, idx) => {
      const highlight =
        idx === 0
          ? "border-white/25 text-zinc-100 bg-zinc-800/70"
          : "border-white/[0.06] text-zinc-400 bg-[#111114]";

      if (mode === "thai" || mode === "eng") {
        return `
                        <span class="inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2.5 rounded-lg border text-sm font-medium ${highlight}">
                            ${item.char}
                        </span>
                    `;
      } else {
        return `
                        <span class="inline-flex items-center gap-2 h-9 px-3 rounded-lg border text-xs ${highlight}">
                            <span class="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" style="background-color: ${item.hex};"></span>
                            <span>${item.nameTh}</span>
                        </span>
                    `;
      }
    })
    .join("");
}

function clearCurrentHistory() {
  state.history[state.currentMode] = [];
  renderHistory();
  playSoftTick(0.3);
}

// Spacebar shortcut to trigger spin
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && document.activeElement.tagName !== "BUTTON") {
    e.preventDefault();
    startRandomSpin();
  }
});

window.onload = function () {
  updatePoolUI();
  renderHistory();
};
