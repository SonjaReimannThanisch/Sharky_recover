/**
 * Handles resetting world state after restart or home navigation.
 */
class WorldResetManager {
    /**
     * Creates the reset manager for the game world.
     * @param {World} world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Resets all world state sections.
     */
    reset() {
        this.resetIntervals();
        this.resetFlags();
        this.resetCollections();
        this.resetLevelState();
        this.resetHudState();
        this.resetWinState();
    }

    /**
     * Resets all running intervals.
     */
    resetIntervals() {
        clearInterval(this.world.enemyCollisionInterval);
        this.world.enemyCollisionInterval = null;
    }

    /**
     * Resets gameplay state flags.
     */
    resetFlags() {
        this.world.hasPlayerMoved = false;
        this.world.bossFightStarted = false;
        this.world.isGameOver = false;
        this.world.hasStarted = false;
        this.world.hasWon = false;
    }

    /**
     * Resets runtime collections and timers.
     */
    resetCollections() {
        this.world.attacks = [];
        this.world.bubbles = [];
        this.world.lastFinSlapAt = 0;
        this.world.lastBubbleAt = 0;
        this.world.lastX = 0;
        this.world.lastY = 0;
        this.world.camera_x = 0;
    }

    /**
     * Recreates the level and character state.
     */
    resetLevelState() {
        this.world.level = createLevel1();
        this.world.mainCharacter = new Character();
        this.world.setWorld();
        this.world.setWorldForLevelObjects();
    }

    /**
     * Resets all HUD percentages.
     */
    resetHudState() {
        this.world.statusLife.setPercentage(this.world.mainCharacter.energy);
        this.world.statusCoins.setPercentage(0);
        this.world.statusPoison.setPercentage(0);
    }

    /**
     * Recreates the win screen state.
     */
    resetWinState() {
        this.world.winScreen = new WinScreen(
            this.world.canvas.width,
            this.world.canvas.height
        );
    }
}