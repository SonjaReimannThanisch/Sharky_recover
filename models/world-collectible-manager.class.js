/**
 * Creates the collectible manager for the game world.
 * @param {World} world
 */
class WorldCollectibleManager {

    /**
     * Creates the collectible manager for the game world.
     * @param {World} world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks collisions between the player and coins.
     */
    checkCoinCollision() {
        this.world.level.coins.forEach((coin, i) => {
            if (this.world.mainCharacter.isColliding(coin)) {
                this.world.level.coins.splice(i, 1);
                this.world.mainCharacter.coins = Math.min(100, (this.world.mainCharacter.coins || 0) + 10);
                this.world.statusCoins.setPercentage(this.world.mainCharacter.coins);
                this.world.sound.playSound('collectCoin');
            }
        });
    }

    /**
     * Checks collisions between the player and poison bottles.
     */
    checkPoisonCollision() {
        this.world.level.poison.forEach((poison, i) => {
            if (!this.world.mainCharacter.isColliding(poison)) return;
            this.collectPoisonBottle(i);
        });
    }

    /**
     * Collects a poison bottle and updates inventory state.
     * @param {number} index
     */
    collectPoisonBottle(index) {
        this.world.level.poison.splice(index, 1);
        this.world.sound.playSound('collectBottle');
        this.addPoisonToInventory();
        this.updatePoisonStatusBar();
    }

    /**
     * Adds poison resources to the player inventory.
     */
    addPoisonToInventory() {
        this.world.mainCharacter.bottle = Math.min(
            100,
            (this.world.mainCharacter.bottle || 0) + 20
        );
    }

    /**
     * Updates the poison status bar UI.
     */
    updatePoisonStatusBar() {
        this.world.statusPoison.setPercentage(
            this.world.mainCharacter.bottle
        );
    }

}