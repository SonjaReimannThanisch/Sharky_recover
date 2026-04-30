class WorldCollectibleManager {

    constructor(world) {
        this.world = world;
    }

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

    checkPoisonCollision() {
        this.world.level.poison.forEach((poison, i) => {
            if (this.world.mainCharacter.isColliding(poison)) {
                this.world.level.poison.splice(i, 1);
                this.world.sound.playSound('collectBottle');
                this.world.mainCharacter.bottle = Math.min(
                    100,
                    (this.world.mainCharacter.bottle || 0) + 10
                );
                this.world.statusPoison.setPercentage(
                    this.world.mainCharacter.bottle
                );
            }
        });
    }

}