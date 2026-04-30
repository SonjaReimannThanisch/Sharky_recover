function injectStartScreen() {
  if (document.getElementById('startscreen')) return;
  let markup = `
    <div id="startscreen" class="overlay-start">
      <div class="start-wrap">
        <img class="start-instructions" src="img/6.Botones/Instructions 2.png" alt="Instructions">

        <button id="btn-start" class="img-btn" aria-label="Start">
          <img src="img/6.Botones/Start/1.png" alt="Start">
        </button>

        <div class="start-footer">
          <button id="btn-fullscreen" class="img-btn small" aria-label="Fullscreen">
            <img src="img/6.Botones/Full Screen/Mesa de trabajo 9.png" alt="Full screen">
          </button>
          <button id="btn-mute-start" class="hud-btn small" aria-label="Mute music">
            🔊
          </button>

          <a class="impressum-link" href="impressum.html">Impressum</a>
        </div>
        <footer>
          <p>WASD – Move | Space – Attack</p>
        </footer>
      </div>
    </div>
  `;

  document.getElementById('fullscreen').insertAdjacentHTML('beforeend', markup);
}

function injectGameHud() {
  if (document.getElementById('btn-mute')) return;

  let markup = `
    <button id="btn-mute" class="hud-btn" aria-label="Mute music">
      🔊
    </button>
  `;
  document.getElementById('fullscreen')?.insertAdjacentHTML('beforeend', markup);
}

function startFromStartscreen(worldInstance) {
  document.getElementById('startscreen')?.classList.add('hidden');
  worldInstance.startGame();
}

function bindStartUi(worldInstance) {
  document.getElementById('btn-start')?.addEventListener('click', () => {
    worldInstance.sound.playSound('itemsSelect');
    updateStartMuteButton(worldInstance)
    updateMuteButton(worldInstance)
    startFromStartscreen(worldInstance);
  });

  document.getElementById('btn-fullscreen')?.addEventListener('click', async () => {
    worldInstance.sound.playSound('itemsSelect');
    let screen = document.getElementById('fullscreen');
    if (!screen) return;
    if (!document.fullscreenElement) enterFullscreen(screen);
    else exitFullscreen();
  });

  document.getElementById('btn-mute-start')?.addEventListener('click', () => {
    worldInstance.sound.playSound('itemsSelect');
    worldInstance.sound.toggleMusic();
    updateStartMuteButton(worldInstance);
  });
}

function updateStartMuteButton(worldInstance) {
  // worldInstance.sound.playSound('itemsSelect');
  let btn = document.getElementById('btn-mute-start');
  if (!btn) return;
  btn.textContent = worldInstance.sound.isMuted ? '🔇' : '🔊';
}

function enterFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function bindGameHudUi(worldInstance) {
  document.getElementById('btn-mute')?.addEventListener('click', () => {
    worldInstance.sound.playSound('itemsSelect');
    worldInstance.sound.toggleMusic()
    updateMuteButton(worldInstance);
  });
}

function updateMuteButton(worldInstance) {
  // worldInstance.sound.playSound('itemsSelect');
  // worldInstance.sound.toggleMusic();
  let btn = document.getElementById('btn-mute');
  if (!btn) return;
  btn.textContent = worldInstance.sound.isMuted ? '🔇' : '🔊';
}