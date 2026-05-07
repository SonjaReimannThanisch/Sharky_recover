window.DEBUG = true;
let canvas;
let gameWorld;
let keyboard = new Keyboard();

/**
 * Initializes the game, UI systems and input bindings.
 */
function init() {
  injectStartScreen();
  canvas = document.getElementById('backgroundCanvas');
  keyboard = new Keyboard(canvas.width, canvas.height);
  gameWorld = new World(canvas, keyboard);
  bindStartUi(gameWorld);
  updateStartMuteButton(gameWorld);
  injectGameHud();
  injectMobileControls();
  bindMobileControls(gameWorld);
  bindGameHudUi(gameWorld);
  updateMuteButton(gameWorld);
  setupAudioUnlock();
}

/**
 * Unlocks browser audio playback after first user interaction.
 */
function setupAudioUnlock() {
  const unlock = () => {
    if (gameWorld.sound && !gameWorld.sound.isMuted && !gameWorld.hasStarted) {
      gameWorld.sound.playMenu();
    }
  };
  document.addEventListener('click', unlock, { once: true });
  document.addEventListener('keydown', unlock, { once: true });
}

window.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  if (event.code === "Enter") {startFromStartscreen(gameWorld);}
  if (event.code === "ArrowRight") keyboard.RIGHT = true;
  if (event.code === "ArrowLeft") keyboard.LEFT = true;
  if (event.code === "ArrowUp") keyboard.UP = true;
  if (event.code === "ArrowDown") keyboard.DOWN = true;
  if (event.code === "Space") keyboard.SPACE = true;
  if (event.code === "KeyD")  keyboard. D    = true;
  if (event.code === "Escape") keyboard.ESC = true;
  if (event.code === "KeyT") keyboard.T = true;
  if (event.code === "KeyY") keyboard.Y = true;

});

window.addEventListener("keyup", (event) => {
  if (event.code === "ArrowRight") keyboard.RIGHT = false;
  if (event.code === "ArrowLeft") keyboard.LEFT = false;
  if (event.code === "ArrowUp") keyboard.UP = false;
  if (event.code === "ArrowDown") keyboard.DOWN = false;
  if (event.code === "Space") keyboard.SPACE = false;
  if (event.code === "KeyD")  keyboard. D    = false;
  if (event.code === "Escape") keyboard.ESC = false;
  if (event.code === "KeyT") keyboard.T = false;
  if (event.code === "KeyY") keyboard.Y = false;

});