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
            return enemy instanceof Jellyfisch || enemy instanceof Endboss;
        }
        if (attack instanceof FinSlapAttack) {
            return enemy instanceof Pufferfisch;
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

    handleAttackInput(now) {
        if (!this.world.hasStarted || this.world.isGameOver) return;
        if (this.world.keyboard.SPACE) this.tryFinSlap(now);
        if (this.world.keyboard.D) this.tryBubble(now);
    }

    tryFinSlap(now) {
        if (now - this.world.lastFinSlapAt < this.world.finSlapCooldowns) return;
        if (this.hasActiveFinSlap()) return;
        this.startFinSlap(now);
    }

    hasActiveFinSlap() {
        return this.world.attacks.some(a => a instanceof FinSlapAttack);
    }

    startFinSlap(now) {
        this.world.mainCharacter.startFinSlapAttackAnimation();
        this.world.sound.playSound('finSlapAttack');
        this.world.attacks.push(new FinSlapAttack(this.world.mainCharacter));
        this.world.lastFinSlapAt = now;
    }

    tryBubble(now) {
        if (this.isBubbleOnCooldown(now)) return;
        let type = this.getBubbleType();
        if (!this.canUseBubble(type)) return;
        this.useBubbleResource(type);
        this.startBubbleAttack(type);
        this.world.lastBubbleAt = now;
    }

    isBubbleOnCooldown(now) {
        return now - this.world.lastBubbleAt < this.world.bubbleCooldowns;
    }

    getBubbleType() {
        let boss = this.world.getEndboss();
        if (boss && boss.isActive) return 'poison';
        return 'normal';
    }

    canUseBubble(type) {
        if (type !== 'poison') return true;
        return this.world.mainCharacter.bottle >= 20;
    }

    useBubbleResource(type) {
        if (type !== 'poison') return;
        this.world.mainCharacter.bottle -= 20;
        this.world.statusPoison.setPercentage(this.world.mainCharacter.bottle);
    }

    startBubbleAttack(type) {
        this.world.sound.playSound('bubbleAttack');
        this.world.mainCharacter.startBubbleAttackAnimation(type);
        this.spawnBubbleDelayed(type);
    }

    spawnBubbleDelayed(type) {
        setTimeout(() => {
            if (this.world.isGameOver || this.world.hasWon) return;
            this.world.attacks.push(
                new BubbleTrapAttack(this.world.mainCharacter, type)
            );
        }, 500);
    }
}