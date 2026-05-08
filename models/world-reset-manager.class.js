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

    resetIntervals() {
        clearInterval(this.world.enemyCollisionInterval);
        this.world.enemyCollisionInterval = null;
    }

    resetFlags() {
        this.world.hasPlayerMoved = false;
        this.world.bossFightStarted = false;
        this.world.isGameOver = false;
        this.world.hasStarted = false;
        this.world.hasWon = false;
    }

    resetCollections() {
        this.world.attacks = [];
        this.world.bubbles = [];
        this.world.lastFinSlapAt = 0;
        this.world.lastBubbleAt = 0;
        this.world.lastX = 0;
        this.world.lastY = 0;
        this.world.camera_x = 0;
    }

    resetLevelState() {
        this.world.level = createLevel1();
        this.world.mainCharacter = new Character();
        this.world.setWorld();
        this.world.setWorldForLevelObjects();
    }

    resetHudState() {
        this.world.statusLife.setPercentage(this.world.mainCharacter.energy);
        this.world.statusCoins.setPercentage(0);
        this.world.statusPoison.setPercentage(0);
    }

    resetWinState() {
        this.world.winScreen = new WinScreen(
            this.world.canvas.width,
            this.world.canvas.height
        );
    }
}