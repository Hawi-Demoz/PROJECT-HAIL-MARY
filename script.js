const sunBrightnessEl = document.getElementById('sunBrightness');
const statusEl = document.getElementById('status');
const harvestSlider = document.getElementById('harvest');
const shieldSlider = document.getElementById('shield');
const powerSlider = document.getElementById('power');
const restartBtn = document.getElementById('restartBtn');
const dangerSound = document.getElementById('dangerSound');
const rockyEl = document.getElementById('rocky');
const soundToggle = document.getElementById('soundToggle');
let soundOn = true;

soundToggle.addEventListener('change', () => {
  soundOn = soundToggle.checked;
});




let sunBrightness = 100;
let gameOver = false;
let tick = 0;
let chartData = [];

const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Sun Brightness (%)',
      data: [],
      borderColor: '#ffdd57',
      backgroundColor: 'rgba(255, 221, 87, 0.2)',
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 100
      }
    }
  }
});

function updateSun() {
  if (gameOver) return;

  const harvest = parseInt(harvestSlider.value);
  const shield = parseInt(shieldSlider.value);
  const power = parseInt(powerSlider.value);

  const brightnessDrop = 2;
  const shieldEffect = shield * 0.01;
  const harvestBoost = harvest * 0.02;
  const powerEffect = power * 0.01;
  const totalResistance = (shieldEffect + harvestBoost) * powerEffect;

  sunBrightness -= (brightnessDrop - totalResistance);
  if (sunBrightness > 100) sunBrightness = 100;
  if (sunBrightness <= 0) {
    sunBrightness = 0;
    gameOver = true;
    sunBrightnessEl.textContent = `☠️ 0%`;
    statusEl.textContent = "💀 Earth froze. The Sun went dark.";
    statusEl.style.color = "red";
    rockyEl.textContent = "🪐 Rocky says: 'Bad! Very bad! Restart!' 😖";
    if (soundOn) dangerSound.play();

    return;
  }

  sunBrightnessEl.textContent = `${sunBrightness.toFixed(1)}%`;

  // Add data to chart
  tick++;
  chart.data.labels.push(tick);
  chart.data.datasets[0].data.push(sunBrightness.toFixed(1));
  chart.update();

  // Update status
  if (sunBrightness > 80) {
    statusEl.textContent = "🌍 Earth is warm and thriving!";
    statusEl.style.color = "lightgreen";
    rockyEl.textContent = "🪐 Rocky says: 'Good! Smart human!' 😄";
  } else if (sunBrightness > 50) {
    statusEl.textContent = "😬 Sun dimming... stay alert.";
    statusEl.style.color = "yellow";
    rockyEl.textContent = "";
  } else if (sunBrightness > 20) {
    statusEl.textContent = "⚠️ Critical sunlight loss!";
    statusEl.style.color = "orange";
    if (soundOn) dangerSound.play();

    rockyEl.textContent = "🪐 Rocky says: 'Danger! Adjust systems!' 🚨";
  } else {
    statusEl.textContent = "❄️ Earth is freezing...";
    statusEl.style.color = "lightblue";
    if (soundOn) dangerSound.play();

    rockyEl.textContent = "🪐 Rocky says: 'Cold! Very cold!' 🧊";
  }
}

function resetGame() {
  sunBrightness = 100;
  gameOver = false;
  tick = 0;
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.update();
  sunBrightnessEl.textContent = "100%";
  statusEl.textContent = "🌍 Earth is stable… for now.";
  statusEl.style.color = "lightgreen";
  rockyEl.textContent = "🪐";
}


restartBtn.addEventListener('click', resetGame);
setInterval(updateSun, 1000);
