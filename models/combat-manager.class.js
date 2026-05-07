/**
 * Handles combat logic, attack collisions and attack updates.
 */
class CombatWorld {

    /**
     * Creates the combat manager for the game world.
     * @param {World} world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Updates attack collisions, cleanup and movement.
     * @param {number} now
     */
    update(now) {
        this.checkAttackCollisions();
        this.cleanupAttacks();
        this.updateAttacks(now);
    }

    /**
     * Checks all active attacks against enemies.
     */
    checkAttackCollisions() {
        for (let i = 0; i < this.world.attacks.length; i++) {
            let attack = this.world.attacks[i];
            if (attack.hasHit) continue;
            this.checkAttackAgainstEnemies(attack);
        }
    }

    /**
     * Checks a single attack against all enemies.
     * @param {Attack} attack
     */
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

    /**
     * Checks whether an attack type can damage a specific enemy.
     * @param {Attack} attack
     * @param {MovableObject} enemy
     * @returns {boolean}
     */
    canAttackHitEnemy(attack, enemy) {
        if (attack instanceof BubbleTrapAttack) {
            return enemy instanceof Jellyfisch || enemy instanceof Endboss;
        }
        if (attack instanceof FinSlapAttack) {
            return enemy instanceof Pufferfisch;
        }
        return true;
    }

    /**
     * Applies attack damage to an enemy.
     * @param {Attack} attack
     * @param {MovableObject} enemy
     */
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

    /**
     * Updates all active attacks.
     * @param {number} now
     */
    updateAttacks(now) {
        for (let i = 0; i < this.world.attacks.length; i++) {
            let attack = this.world.attacks[i];
            this.tickAttack(attack, now);
            this.moveAttack(attack);
        }
    }

    /**
     * Updates attack-specific animation logic.
     * @param {Attack} attack
     * @param {number} now
     */
    tickAttack(attack, now) {
        if (typeof attack.tick === 'function') {
            attack.tick(now);
        }
    }

    /**
     * Moves an attack horizontally.
     * @param {Attack} attack
     */
    moveAttack(attack) {
        if (attack.vx) {
            attack.x += attack.vx;
        }
    }

    /**
     * Removes expired or deleted attacks.
     */
    cleanupAttacks() {
        this.world.attacks = this.world.attacks.filter(
            attack => !attack.isExpired() && !attack.markedForDeletion
        );
    }

    /**
     * Handles combat input for fin slap and bubble attacks.
     * @param {number} now
     */
    handleAttackInput(now) {
        if (!this.world.hasStarted || this.world.isGameOver) return;
        if (this.world.keyboard.SPACE) this.tryFinSlap(now);
        if (this.world.keyboard.D) this.tryBubble(now);
    }

    /**
     * Attempts to trigger a fin slap attack.
     * @param {number} now
     */
    tryFinSlap(now) {
        if (now - this.world.lastFinSlapAt < this.world.finSlapCooldowns) return;
        if (this.hasActiveFinSlap()) return;
        this.startFinSlap(now);
    }

    /**
     * Checks whether a fin slap attack is already active.
     * @returns {boolean}
     */
    hasActiveFinSlap() {
        return this.world.attacks.some(a => a instanceof FinSlapAttack);
    }

    /**
     * Starts a fin slap attack animation and hitbox.
     * @param {number} now
     */
    startFinSlap(now) {
        this.world.mainCharacter.startFinSlapAttackAnimation();
        this.world.sound.playSound('finSlapAttack');
        this.world.attacks.push(new FinSlapAttack(this.world.mainCharacter));
        this.world.lastFinSlapAt = now;
    }

    /**
     * Attempts to trigger a bubble attack.
     * @param {number} now
     */
    tryBubble(now) {
        if (this.isBubbleOnCooldown(now)) return;
        let type = this.getBubbleType();
        if (!this.canUseBubble(type)) return;
        this.useBubbleResource(type);
        this.startBubbleAttack(type);
        this.world.lastBubbleAt = now;
    }

    /**
     * Checks whether the bubble attack cooldown is active.
     * @param {number} now
     * @returns {boolean}
     */
    isBubbleOnCooldown(now) {
        return now - this.world.lastBubbleAt < this.world.bubbleCooldowns;
    }

    /**
     * Determines the current bubble attack type.
     * @returns {string}
     */
    getBubbleType() {
        let boss = this.world.getEndboss();
        if (boss && boss.isActive) return 'poison';
        return 'normal';
    }

    /**
     * Checks whether the player can use a bubble attack.
     * @param {string} type
     * @returns {boolean}
     */
    canUseBubble(type) {
        if (type !== 'poison') return true;
        return this.world.mainCharacter.bottle >= 20;
    }

    /**
     * Consumes poison resources for poison bubble attacks.
     * @param {string} type
     */
    useBubbleResource(type) {
        if (type !== 'poison') return;
        this.world.mainCharacter.bottle -= 20;
        this.world.statusPoison.setPercentage(this.world.mainCharacter.bottle);
    }

    /**
     * Starts a bubble attack animation and sound.
     * @param {string} type
     */
    startBubbleAttack(type) {
        this.world.sound.playSound('bubbleAttack');
        this.world.mainCharacter.startBubbleAttackAnimation(type);
        this.spawnBubbleDelayed(type);
    }

    /**
     * Spawns a bubble attack after the charging animation delay.
     * @param {string} type
     */
    spawnBubbleDelayed(type) {
        setTimeout(() => {
            if (this.world.isGameOver || this.world.hasWon) return;
            this.world.attacks.push(
                new BubbleTrapAttack(this.world.mainCharacter, type)
            );
        }, 500);
    }
}