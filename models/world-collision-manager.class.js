class WorldCollisionManager {
    constructor(world) {
        this.world = world;
    }

    checkCollisions() {
        if (this.world.enemyCollisionInterval) return;
        this.world.enemyCollisionInterval = setInterval(
            this.runEnemyCollisionCheck.bind(this),
            1000
        );
    }

    runEnemyCollisionCheck() {
        this.world.level.enemies.forEach(this.checkEnemyCollision.bind(this));
    }

    checkEnemyCollision(enemy) {
        if (enemy.isDead) return;

        if (
            this.world.mainCharacter.isColliding(enemy) &&
            !this.world.mainCharacter.isHurt()
        ) {
            let cause = enemy instanceof Endboss ? 'boss' : '';
            this.world.applyDamage(
                enemy.damage || 5,
                enemy.damageType || 'poison',
                cause
            );
        }
    }

    isCollidingWithAnyBarrier() {
        return this.world.level.barriers.some(
            barrier => this.world.mainCharacter.isColliding(barrier)
        );
    }

    // checkBarrierCollision() {
    //     if (!this.isBlockedByBarrierOrBoss()) {
    //         this.rememberPlayerPosition();
    //         return;
    //     }
    //     if (!this.barrierSoundPlayed) {
    //         this.world.sound.playSound('barrier');
    //         this.barrierSoundPlayed = true;
    //     }
    //     this.resetPlayerToLastPosition();
    //     this.applyBarrierDamage();
    // }

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

    isBlockedByBarrierOrBoss() {
        let hitBarrier = this.isCollidingWithAnyBarrier();
        let boss = this.world.getEndboss();
        let hitBoss =
            boss &&
            boss.isCollidable() &&
            this.world.mainCharacter.isColliding(boss);

        return hitBarrier || hitBoss;
    }

    applyBarrierDamage() {
        if (
            this.world.isPressingIntoBarrier() &&
            !this.world.mainCharacter.isHurt()
        ) {
            this.world.applyDamage(5, 'barrier');
        }
    }

    resetPlayerToLastPosition() {
        this.world.mainCharacter.x = this.world.lastX;
        this.world.mainCharacter.y = this.world.lastY;
    }

    rememberPlayerPosition() {
        this.world.lastX = this.world.mainCharacter.x;
        this.world.lastY = this.world.mainCharacter.y;
    }
}