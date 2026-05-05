class WorldCollisionManager {

    constructor(World) {
        this.World = World;
    }

    checkCollisions() {
        if (this.World.enemyCollisionInterval) return;
        this.World.enemyCollisionInterval = setInterval(
            this.runEnemyCollisionCheck.bind(this),
            1000
        );
    }

    runEnemyCollisionCheck() {
        this.World.level.enemies.forEach(this.checkEnemyCollision.bind(this));
    }

    checkEnemyCollision(enemy) {
        if (enemy.isDead) return;

        if (
            this.World.mainCharacter.isColliding(enemy) &&
            !this.World.mainCharacter.isHurt()
        ) {
            let cause = enemy instanceof Endboss ? 'boss' : '';
            this.World.applyDamage(
                enemy.damage || 5,
                enemy.damageType || 'poison',
                cause
            );
        }
    }

    isCollidingWithAnyBarrier() {
        return this.World.level.Barriers.some(
            barrier => this.World.mainCharacter.isColliding(barrier)
        );
    }

    checkBarrierCollision() {
        if (!this.isBlockedByBarrierOrBoss()) {
            this.rememberPlayerPosition();
            this.barrierSoundPlayed = false;
            return;
        }

        if (!this.barrierSoundPlayed) {
            this.World.sound.playSound('barrier');
            this.barrierSoundPlayed = true;
        }

        this.resetPlayerToLastPosition();
        this.applyBarrierDamage();
    }   

    isBlockedByBarrierOrBoss() {
        return this.isCollidingWithAnyBarrier();
        let boss = this.World.getEndboss();
        let hitBoss =
            boss &&
            boss.isCollidable() &&
            this.World.mainCharacter.isColliding(boss);

        return hitBarrier || hitBoss;
    }

    applyBarrierDamage() {
        if (
            this.World.isPressingIntoBarrier() &&
            !this.World.mainCharacter.isHurt()
        ) {
            this.World.applyDamage(5, 'barrier');
        }
    }

    resetPlayerToLastPosition() {
        this.World.mainCharacter.x = this.World.lastX;
        this.World.mainCharacter.y = this.World.lastY;
    }

    rememberPlayerPosition() {
        this.World.lastX = this.World.mainCharacter.x;
        this.World.lastY = this.World.mainCharacter.y;
    }
}