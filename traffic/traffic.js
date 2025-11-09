/* Traffic Signal Simulator
   - Uses DOM manipulation to control lights.
   - Provides start/pause/reset and manual override.
   - Shows visual toast notifications. Optional browser alert.
*/

(() => {
  // DOM elements
  const lampRed = document.getElementById('lamp-red');
  const lampYellow = document.getElementById('lamp-yellow');
  const lampGreen = document.getElementById('lamp-green');
  const countdownEl = document.getElementById('countdown');
  const ringFg = document.querySelector('.ring-fg');
  const toast = document.getElementById('toast');

  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pedBtn = document.getElementById('pedBtn');
  const alertToggle = document.getElementById('alertToggle');

  // timer inputs
  const tGreenInput = document.getElementById('t-green');
  const tYellowInput = document.getElementById('t-yellow');
  const tRedInput = document.getElementById('t-red');

  // state, sequence and timing
  const SEQ = ['green', 'yellow', 'red']; // cyclic order
  let current = 'red';
  let timer = null;
  let interval = null;
  let remaining = 0;
  let running = false;
  let ringCircumference = 2 * Math.PI * 52; // r=52 in CSS
  // Initialize ring circle length
  ringFg.style.strokeDasharray = `${ringCircumference}`;
  ringFg.style.strokeDashoffset = `${ringCircumference}`;

  // helper to get durations (seconds)
  function getDurations() {
    const g = Math.max(1, parseInt(tGreenInput.value, 10) || 6);
    const y = Math.max(1, parseInt(tYellowInput.value, 10) || 3);
    const r = Math.max(1, parseInt(tRedInput.value, 10) || 6);
    return { green: g, yellow: y, red: r };
  }

  // update visual lamps
  function setLampState(state) {
    lampRed.dataset.state = state === 'red' ? 'on' : 'off';
    lampYellow.dataset.state = state === 'yellow' ? 'on' : 'off';
    lampGreen.dataset.state = state === 'green' ? 'on' : 'off';
    current = state;
    // adjust ring color
    if (state === 'green') ringFg.style.stroke = 'url(#)'; // fallback
    if (state === 'green') ringFg.style.stroke = 'rgba(0,230,128,0.95)';
    if (state === 'yellow') ringFg.style.stroke = 'rgba(255,200,0,0.95)';
    if (state === 'red') ringFg.style.stroke = 'rgba(255,60,60,0.95)';
    // notify
    notifyState(state);
  }

  // display toast and optional alert
  function notifyState(state) {
    const msg = state === 'green' ? 'Green — Go' : state === 'yellow' ? 'Yellow — Prepare to stop' : 'Red — Stop';
    showToast(msg);
    if (alertToggle.checked) {
      // small non-blocking delay before alert to avoid simultaneous triggers
      setTimeout(() => alert(msg), 50);
    }
    // short beep using Web Audio API (subtle)
    beepForState(state);
  }

  // beep sound generator (short beep)
  function beepForState(state) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      // frequency vary by state
      o.frequency.value = state === 'green' ? 660 : state === 'yellow' ? 440 : 220;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      // ramp to audible quickly then down
      g.gain.exponentialRampToValueAtTime(0.02, ctx.currentTime + 0.02);
      setTimeout(() => {
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
        setTimeout(() => { o.stop(); ctx.close?.(); }, 180);
      }, 120);
    } catch (e) {
      // audio may be blocked; ignore
    }
  }

  // toast helper
  let toastTimer = null;
  function showToast(text, ms = 2000) {
    clearTimeout(toastTimer);
    toast.textContent = text;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
    }, ms);
  }

  // update countdown and ring progress
  function updateCountdown(sec, total) {
    countdownEl.textContent = String(Math.ceil(sec));
    const pct = Math.max(0, Math.min(1, (total - sec) / total));
    const offset = ringCircumference * (1 - pct);
    ringFg.style.strokeDashoffset = offset;
  }

  // run one state for its duration, then call nextState
  function runState(state, duration) {
    clearInterval(interval);
    remaining = duration;
    updateCountdown(remaining, duration);
    setLampState(state);

    interval = setInterval(() => {
      remaining -= 0.25; // update more smoothly
      if (remaining <= 0) {
        clearInterval(interval);
        nextState(); // go to next
      } else {
        updateCountdown(remaining, duration);
      }
    }, 250);
  }

  // go to next in sequence
  function nextState(manual = false) {
    const durs = getDurations();
    let nextIndex = (SEQ.indexOf(current) + 1) % SEQ.length;
    const next = SEQ[nextIndex];

    // If pedestrian pressed and next is green -> short-circuit to yellow->red quickly
    if (manual) {
      // on manual override, use full duration of next
      runState(next, durs[next]);
      return;
    }
    // Normal automatic behavior
    runState(next, durs[next]);
  }

  // prev state (manual)
  function prevState() {
    const durs = getDurations();
    let idx = SEQ.indexOf(current);
    idx = (idx - 1 + SEQ.length) % SEQ.length;
    runState(SEQ[idx], durs[SEQ[idx]]);
  }

  // Public controls
  function start() {
    if (running) return;
    running = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    // If currently no running interval, start from current state
    const durs = getDurations();
    // If current is undefined or off, start with green
    if (!current) current = 'red';
    // If starting from paused with remaining > 0, resume; else start sequence with next state
    if (remaining > 0) {
      runState(current, remaining);
    } else {
      // start from next after current, unless current is off -> start green
      let startState = current === 'red' ? 'green' : SEQ[(SEQ.indexOf(current) + 1) % SEQ.length];
      runState(startState, durs[startState]);
    }
  }

  function pause() {
    if (!running) return;
    running = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    clearInterval(interval);
    showToast('Paused');
  }

  function reset() {
    running = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    clearInterval(interval);
    // reset to red by default
    setLampState('red');
    remaining = 0;
    updateCountdown(0,1);
    ringFg.style.strokeDashoffset = ringCircumference;
    showToast('Reset');
  }

  // Pedestrian button: safe behavior -> change to yellow then red quickly
  function pedestrian() {
    showToast('Pedestrian requested');
    // if already red, keep red for pedestrian duration
    const durs = getDurations();
    if (current === 'red') {
      runState('red', durs.red + 3); // small extension
      return;
    }
    // force transition: yellow then red
    clearInterval(interval);
    runState('yellow', Math.min(3, durs.yellow)); // short caution
    // after yellow completes, it will call nextState -> red
  }

  // Manual next/prev handlers
  function manualNext() {
    clearInterval(interval);
    const durs = getDurations();
    nextState(true);
  }
  function manualPrev() {
    clearInterval(interval);
    prevState();
  }

  // attach UI
  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', pause);
  resetBtn.addEventListener('click', reset);
  nextBtn.addEventListener('click', manualNext);
  prevBtn.addEventListener('click', manualPrev);
  pedBtn.addEventListener('click', pedestrian);

  // Keyboard shortcuts (optional)
  window.addEventListener('keydown', (e) => {
    if (e.key === ' ') { // space toggles start/pause
      e.preventDefault();
      running ? pause() : start();
    } else if (e.key === 'n') {
      manualNext();
    } else if (e.key === 'p') {
      manualPrev();
    }
  });

  // Initialize default state and UI state
  reset();
  // show visual countdown 0
  updateCountdown(0,1);

  // expose some debug methods on window (optional)
  window._traffic = {
    start, pause, reset, manualNext, manualPrev, setLampState
  };
})();
