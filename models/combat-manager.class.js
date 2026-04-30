class CombatWorld {
    constructor(world) {
        this.world = world;
    }

    update(now) {
        this.checkAttackCollisions();
        this.cleanupAttacks();
        this.updateAttacks(now);
    }

    checkAttackCollisions() {
        for (let i = 0; i < this.world.attacks.length; i++) {
            let attack = this.world.attacks[i];
            if (attack.hasHit) continue;
            this.checkAttackAgainstEnemies(attack);
        }
    }

    checkAttackAgainstEnemies(attack) {
        for (let j = 0; j < this.world.level.enemies.length; j++) {
            let enemy = this.world.level.enemies[j];
            if (!this.canAttackHitEnemy(attack, enemy)) continue;
            if (!attack.isColliding(enemy)) continue;
            this.applyAttackDamage(attack, enemy);
            attack.hitTarget();
            break;
        }
    }

    canAttackHitEnemy(attack, enemy) {
        if (attack instanceof BubbleTrapAttack) {
            return enemy instanceof jellyfisch || enemy instanceof Endboss;
        }
        if (attack instanceof FinSlapAttack) {
            return enemy instanceof pufferfisch;
        }
        return true;
    }

    applyAttackDamage(attack, enemy) {
        if (attack instanceof FinSlapAttack) {
            enemy.hit('finSlap');
            return;
        }
        if (attack instanceof BubbleTrapAttack) {
            enemy.hit(attack.type);
            return;
        }
        enemy.hit('normal');
    }

    updateAttacks(now) {
        for (let i = 0; i < this.world.attacks.length; i++) {
            let attack = this.world.attacks[i];
            this.tickAttack(attack, now);
            this.moveAttack(attack);
        }
    }

    tickAttack(attack, now) {
        if (typeof attack.tick === 'function') {
            attack.tick(now);
        }
    }

    moveAttack(attack) {
        if (attack.vx) {
            attack.x += attack.vx;
        }
    }

    cleanupAttacks() {
        this.world.attacks = this.world.attacks.filter(
            attack => !attack.isExpired() && !attack.markedForDeletion
        );
    }
}