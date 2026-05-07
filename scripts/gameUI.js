/**
 * Injects the start screen overlay into the game container.
 */
function injectStartScreen() {
  if (document.getElementById('startscreen')) return;
  let markup = `
    <div id="startscreen" class="overlay-start">
      <div class="start-wrap">
        <div class="start-controls">
          <div class="control-line move-line">
            <img class="key-arrows" src="img/6.Botones/Key/arrow keys.png" alt="Arrow keys">
            <img class="title-move" src="img/6.Botones/Tittles/Move title.png" alt="Move Shark">
          </div>

          <div class="control-line attack-line">
            <img class="key-space" src="img/6.Botones/Key/Space Bar key.png" alt="Space Bar">
            <img class="key-d" src="img/6.Botones/Key/D key.png" alt="D key">
            <img class="title-attack" src="img/6.Botones/Tittles/Attack tittle.png" alt="Attack">
          </div>
        </div>
 
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

          <a class="impressum-link" onclick="openImpressum()">Impressum</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById('fullscreen').insertAdjacentHTML('beforeend', markup);
}

/**
 * Injects mobile touch controls for touchscreen devices.
 */
function injectMobileControls() {
  if (document.getElementById('mobile-controls')) return;

  let markup = `
    <div id="mobile-controls" class="mobile-controls">
      <div class="mobile-move">
        <button id="mobile-up">▲</button>
        <div>
          <button id="mobile-left">◀</button>
          <button id="mobile-down">▼</button>
          <button id="mobile-right">▶</button>
        </div>
      </div>

      <div class="mobile-action">
        <button id="mobile-fin">Fin</button>
        <button id="mobile-bubble">Bubble</button>
      </div>
    </div>
  `;

  document.getElementById('fullscreen')?.insertAdjacentHTML('beforeend', markup);
}

/**
 * Injects the in-game HUD controls.
 */
function injectGameHud() {
  if (document.getElementById('btn-mute')) return;

  let markup = `
    <button id="btn-mute" class="hud-btn" aria-label="Mute music">
      🔊
    </button>
  `;
  document.getElementById('fullscreen')?.insertAdjacentHTML('beforeend', markup);
}

/**
 * Starts the game from the start screen.
 * @param {World} worldInstance
 */
function startFromStartscreen(worldInstance) {
  document.getElementById('startscreen')?.classList.add('hidden');
  worldInstance.startGame();
}

/**
 * Binds all start screen UI interactions.
 * @param {World} worldInstance
 */
function bindStartUi(worldInstance) {
  bindStartButton(worldInstance);
  bindFullscreenButton(worldInstance);
  bindStartMuteButton(worldInstance);
}

/**
 * Binds the start button interaction.
 */
function bindStartButton(worldInstance) {
  document.getElementById('btn-start')?.addEventListener('click', () => {
    worldInstance.sound.playSound('itemsSelect');
    updateStartMuteButton(worldInstance);
    updateMuteButton(worldInstance);
    startFromStartscreen(worldInstance);
  });
}

/**
 * Binds the fullscreen button interaction.
 */
function bindFullscreenButton(worldInstance) {
  document.getElementById('btn-fullscreen')?.addEventListener('click', () => {
    worldInstance.sound.playSound('itemsSelect');
    toggleFullscreen();
  });
}

/**
 * Binds the start screen mute button interaction.
 */
function bindStartMuteButton(worldInstance) {
  document.getElementById('btn-mute-start')?.addEventListener('click', () => {
    worldInstance.sound.playSound('itemsSelect');
    worldInstance.sound.toggleMusic();
    updateStartMuteButton(worldInstance);
  });
}

/**
 * Toggles fullscreen mode for the game container.
 */
function toggleFullscreen() {
  let screen = document.getElementById('fullscreen');
  if (!screen) return;
  if (!document.fullscreenElement) enterFullscreen(screen);
  else exitFullscreen();
}

function updateStartMuteButton(worldInstance) {
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

/**
 * Binds the in-game HUD button interactions.
 * @param {World} worldInstance
 */
function bindGameHudUi(worldInstance) {
  document.getElementById('btn-mute')?.addEventListener('click', () => {
    worldInstance.sound.playSound('itemsSelect');
    worldInstance.sound.toggleMusic()
    updateMuteButton(worldInstance);
  });
}

function updateMuteButton(worldInstance) {
  let btn = document.getElementById('btn-mute');
  if (!btn) return;
  btn.textContent = worldInstance.sound.isMuted ? '🔇' : '🔊';
}

/**
 * Binds all mobile control buttons to keyboard input states.
 * @param {World} worldInstance
 */
function bindMobileControls(worldInstance) {
  bindMobileButton('mobile-left', worldInstance, 'LEFT');
  bindMobileButton('mobile-right', worldInstance, 'RIGHT');
  bindMobileButton('mobile-up', worldInstance, 'UP');
  bindMobileButton('mobile-down', worldInstance, 'DOWN');
  bindMobileButton('mobile-fin', worldInstance, 'SPACE');
  bindMobileButton('mobile-bubble', worldInstance, 'D');

  document.getElementById('mobile-controls')
    ?.addEventListener('contextmenu', event => event.preventDefault());
}

/**
 * Binds a mobile button to a keyboard control state.
 * @param {string} id
 * @param {World} worldInstance
 * @param {string} key
 */
function bindMobileButton(id, worldInstance, key) {
  let button = document.getElementById(id);
  if (!button) return;
  button.addEventListener('touchstart', event => {
    event.preventDefault();
    worldInstance.keyboard[key] = true;
  });
  button.addEventListener('touchend', event => {
    event.preventDefault();
    worldInstance.keyboard[key] = false;
  });
}

/**
 * Opens the impressum overlay.
 */
function openImpressum() {
  document.getElementById('impressumOverlay')?.classList.remove('hidden');
}

/**
 * Closes the impressum overlay.
 */
function closeImpressum() {
  document.getElementById('impressumOverlay')?.classList.add('hidden');
}