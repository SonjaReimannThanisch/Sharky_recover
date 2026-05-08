/**
 * Stores keyboard input states for the game.
 */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    SPACE = false;
    A = false;
    ESC = false;
    T = false;
    Y = false;
    height = 100;
    width = 165;
    y = 80;

    /**
     * Creates the keyboard HUD position.
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     */
    constructor(canvasWidth, canvasHeight) {
        this.x = canvasWidth - this.width - 20;
        this.y = canvasHeight - this.height - 15;
    }
}