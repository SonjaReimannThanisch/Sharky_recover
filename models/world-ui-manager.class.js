/**
 * Handles game overlays and UI interactions.
 */
class WorldUiManager {

    /**
     * Creates the UI manager for the game world.
     * @param {World} world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Shows the game over overlay.
     */
    showGameOver() {
        this.world.sound.stopAllMusic();
        this.world.sound.stopAllSounds();
        this.freezeBossForGameOver();
        this.lockCameraOnPlayer();
        document.getElementById('gameover')?.classList.remove('hidden');
    }

    /**
     * Hides the game over overlay.
     */
    hideGameOver() {
        document.getElementById('gameover')?.classList.add('hidden');
    }

    /**
     * Stops boss attack behavior during game over.
     */
    freezeBossForGameOver() {
        let boss = this.world.getEndboss();
        if (!boss) return;
        boss.isAttacking = false;
    }

    /**
     * Locks the camera on the player position.
     */
    lockCameraOnPlayer() {
        this.world.camera_x = -this.world.mainCharacter.x;
    }

    /**
     * Binds all overlay button interactions.
     */
    bindUi() {
        this.bindButton('btn-restart', () => this.world.restartGame());
        this.bindButton('btn-home', () => this.world.goHome());
        this.bindButton('btn-win-restart', () => this.world.restartGame());
        this.bindButton('btn-win-home', () => this.world.goHome());
    }

    /**
     * Binds a UI button action.
     * @param {string} id
     * @param {Function} action
     */
    bindButton(id, action) {
        let button = document.getElementById(id);
        if (!button) return;
        button.onclick = action;
    }

    /**
     * Draws the win overlay layer.
     */
    drawHudWonLayer() {
        if (!this.world.hasWon) return;
        this.world.ctx.save();
        let overlayAlpha = Math.min(this.world.winScreen.alpha, 0.9);
        this.world.ctx.globalAlpha = overlayAlpha;
        this.world.ctx.fillStyle = "rgba(10, 3, 37, 0.75)";
        this.world.ctx.fillRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        this.world.ctx.restore();
        if (this.world.winScreen.alpha < 1) {
            this.world.winScreen.alpha += 0.02;
        }
        this.world.addToMap(this.world.winScreen);
    }

    /**
     * Handles game over state behavior.
     */
    handleGameOver() {
        if (this.isBossDeath()) {
            this.playBossDeath();
            return;
        }
        this.playNormalDeath();
    }
    
    /**
     * Checks whether the player died from the boss.
     * @returns {boolean}
     */
    isBossDeath() {
        return this.world.mainCharacter.deathCause === 'boss';
    }

    /**
     * Plays the cinematic boss death sequence.
     */
    playBossDeath() {
        this.world.mainCharacter.isCinematicDead = true;
        setTimeout(() => this.showGameOver(), 1500);
    }

    /**
     * Plays the normal death sequence.
     */
    playNormalDeath() {
        this.showGameOver();
        this.world.sound.playSound('characterDeath');
    }

    /**
     * Shows the win screen overlay.
     */
    showWinScreen() {
        document.getElementById('winscreen') ?.classList.remove('hidden');
    }

    /**
     * Hides the win screen overlay.
     */
    hideWinScreen() { 
        document.getElementById('winscreen') ?.classList.add('hidden');
    }
}