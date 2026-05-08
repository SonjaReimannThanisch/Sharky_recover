/**
 * Handles enemy and barrier collision logic.
 */
class WorldCollisionManager {

    /**
     * Creates the collision manager for the game world.
     * @param {World} world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Starts the enemy collision loop.
     */
    checkCollisions() {
        if (this.world.enemyCollisionInterval) return;
        this.world.enemyCollisionInterval = setInterval(
            this.runEnemyCollisionCheck.bind(this),
            1000
        );
    }

    /**
     * Runs collision checks for all enemies.
     */
    runEnemyCollisionCheck() {
        this.world.level.enemies.forEach(this.checkEnemyCollision.bind(this));
    }

    /**
     * Checks collision between the player and a single enemy.
     * @param {MovableObject} enemy
     */
    checkEnemyCollision(enemy) {
        if (enemy.isDead) return;
        if (
            this.world.mainCharacter.isColliding(enemy) &&
            !this.world.mainCharacter.isHurt()
        ) {
            let cause = enemy instanceof Endboss ? 'boss' : '';
            this.world.applyDamage(
                enemy.damage || 10,
                enemy.damageType || 'poison',
                cause
            );
        }
    }

    /**
     * Checks whether the player collides with any barrier.
     * @returns {boolean}
     */
    isCollidingWithAnyBarrier() {
        return this.world.level.barriers.some(
            barrier => this.world.mainCharacter.isColliding(barrier)
        );
    }

    /**
     * Handles barrier collision behavior and damage.
     */
    checkBarrierCollision() {
        if (!this.isBlockedByBarrierOrBoss()) {
            this.rememberPlayerPosition();
            this.barrierSoundPlayed = false;
            return;
        }
        if (!this.barrierSoundPlayed) {
            this.world.sound.playSound('barrier');
            this.barrierSoundPlayed = true;
        }
        this.resetPlayerToLastPosition();
        this.applyBarrierDamage();
    }   

    /**
     * Checks whether the player is blocked by a barrier.
     * @returns {boolean}
     */
    isBlockedByBarrierOrBoss() {
        return this.isCollidingWithAnyBarrier();
        let boss = this.world.getEndboss();
        let hitBoss =
            boss &&
            boss.isCollidable() &&
            this.world.mainCharacter.isColliding(boss);

        return hitBarrier || hitBoss;
    }
    /**
     * Applies barrier collision damage.
     */
    applyBarrierDamage() {
        if (
            this.world.isPressingIntoBarrier() &&
            !this.world.mainCharacter.isHurt()
        ) {
            this.world.applyDamage(20, 'barrier');
        }
    }

    /**
     * Resets the player to the previous valid position.
     */
    resetPlayerToLastPosition() {
        this.world.mainCharacter.x = this.world.lastX;
        this.world.mainCharacter.y = this.world.lastY;
    }

    /**
     * Stores the current player position.
     */
    rememberPlayerPosition() {
        this.world.lastX = this.world.mainCharacter.x;
        this.world.lastY = this.world.mainCharacter.y;
    }
}