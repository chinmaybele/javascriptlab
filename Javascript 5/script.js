// script.js — parses input, renders array tiles, and finds min/max using loops.
// Place this file in same folder as index.html and style.css.

document.addEventListener('DOMContentLoaded', () => {
  const numbersInput = document.getElementById('numbers');
  const arrayBox = document.getElementById('arrayBox');
  const result = document.getElementById('result');
  const findMinBtn = document.getElementById('findMinBtn');
  const findMaxBtn = document.getElementById('findMaxBtn');
  const showArrBtn = document.getElementById('showArrBtn');

  // Parse input string into number array. Accepts commas and/or spaces as separators
  function parseInput() {
    const raw = numbersInput.value.trim();
    if (!raw) return [];
    // split on commas or whitespace (one or more)
    const parts = raw.split(/[, \t\n]+/).filter(Boolean);
    const arr = parts.map(s => parseFloat(s)).filter(n => !isNaN(n));
    return arr;
  }

  // Render visible array tiles
  function renderArray(arr) {
    clearHighlights();
    arrayBox.innerHTML = '';
    if (!arr || arr.length === 0) {
      result.innerHTML = '<span class="warn">⚠️ Please enter valid numbers separated by commas or spaces.</span>';
      return;
    }

    // Create tiles with staggered animation delay
    arr.forEach((value, idx) => {
      const tile = document.createElement('div');
      tile.className = 'num';
      tile.textContent = value;
      tile.dataset.value = String(value);
      tile.dataset.index = String(idx);
      tile.style.animationDelay = `${idx * 0.06}s`;
      arrayBox.appendChild(tile);
    });

    result.innerHTML = `<span class="info">Array: [${arr.join(', ')}] — choose <strong>Find Min</strong> or <strong>Find Max</strong>.</span>`;
  }

  // Remove min/max highlight classes
  function clearHighlights() {
    const tiles = arrayBox.querySelectorAll('.num');
    tiles.forEach(t => {
      t.classList.remove('min');
      t.classList.remove('max');
    });
  }

  // Find minimum using explicit loop
  function findMin() {
    const arr = parseInput();
    renderArray(arr);
    if (!arr.length) return;

    // loop to find min
    let min = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < min) min = arr[i];
    }

    // highlight all tiles equal to min
    const tiles = arrayBox.querySelectorAll('.num');
    tiles.forEach(t => {
      const val = parseFloat(t.dataset.value);
      if (val === min) t.classList.add('min');
      else t.classList.remove('min');
    });

    result.innerHTML = `Minimum: <span class="val min">${min}</span>`;
  }

  // Find maximum using explicit loop
  function findMax() {
    const arr = parseInput();
    renderArray(arr);
    if (!arr.length) return;

    // loop to find max
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) max = arr[i];
    }

    // highlight all tiles equal to max
    const tiles = arrayBox.querySelectorAll('.num');
    tiles.forEach(t => {
      const val = parseFloat(t.dataset.value);
      if (val === max) t.classList.add('max');
      else t.classList.remove('max');
    });

    result.innerHTML = `Maximum: <span class="val max">${max}</span>`;
  }

  // Event listeners
  findMinBtn.addEventListener('click', findMin);
  findMaxBtn.addEventListener('click', findMax);
  showArrBtn.addEventListener('click', () => renderArray(parseInput()));

  // allow Enter to show array quickly
  numbersInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      renderArray(parseInput());
    }
  });
});
