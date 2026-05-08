/**
 * Handles character animation states and animation flow.
 */
class CharacterAnimationManager {

    /**
     * Creates the animation manager for the main character.
     * @param {Character} character
     */
    constructor(character) {
        this.character = character;
    }

    /**
     * Handles the current character animation state.
     */
    handleAnimations() {
        let now = Date.now();

        if (this.handleFinSlap(now)) return;
        if (this.handleBubble(now)) return;
        if (this.handleCinematicDeath()) return;
        if (this.handleDeath()) return;
        if (this.handleHurt()) return;
        if (this.handleMovement()) return;

        this.handleIdle();
    }

    /**
     * Stops all active movement and animation loops.
     */
    stopAnimationLoops() {
        if (this.character.movementInterval) {
            clearInterval(this.character.movementInterval);
            this.character.movementInterval = null;
        }
        if (this.character.animationInterval) {
            clearInterval(this.character.animationInterval);
            this.character.animationInterval = null;
        }
    }

    /**
     * Handles the fin slap attack animation state.
     * @param {number} now
     * @returns {boolean}
     */
    handleFinSlap(now) {
        if (!this.character.isFinSlapAttacking) return false;
        this.character.playAnimation(this.character.images.FIN_SLAP);
        if (now - this.character.finSlapAttackStartedAt > this.character.finSlapAttackDuration) {
            this.character.isFinSlapAttacking = false;
        }
        return true;
    }

    /**
     * Handles bubble attack animation states.
     * @param {number} now
     * @returns {boolean}
     */
    handleBubble(now) {
        if (this.handleChargingBubble(now)) return true;
        if (this.handleActiveBubble(now)) return true;
        return false;
    }
    
    /**
     * Handles the bubble charging animation phase.
     * @param {number} now
     * @returns {boolean}
     */
    handleChargingBubble(now) {
        if (!this.character.isChargingBubble) return false;
        this.character.playAnimation(this.character.images.WHALE_ATTACK);
        if (now - this.character.bubbleAttackStartedAt > 300) {
            this.startBubbleAttack(now);
        }
        return true;
    }

    /**
     * Starts the active bubble attack phase.
     * @param {number} now
     */
    startBubbleAttack(now) {
        this.character.isChargingBubble = false;
        this.character.isBubbleAttacking = true;
        this.character.bubbleAttackStartedAt = now;
    }

    /**
     * Handles the active bubble attack animation.
     * @param {number} now
     * @returns {boolean}
     */
    handleActiveBubble(now) {
        if (!this.character.isBubbleAttacking) return false;
        this.character.playAnimation(this.getBubbleAttackImages());
        if (now - this.character.bubbleAttackStartedAt > this.character.bubbleAttackDuration) {
            this.character.isBubbleAttacking = false;
        }
        return true;
    }

    /**
     * Gets the correct bubble attack animation images.
     * @returns {string[]}
     */
    getBubbleAttackImages() {
        if (this.character.bubbleAttackType === 'poison') {
            return this.character.images.WHALE_ATTACK_BUBBLE;
        }
        return this.character.images.BUBBLE_ATTACK;
    }

    /**
     * Handles the cinematic death animation state.
     * @returns {boolean}
     */
    handleCinematicDeath() {
        if (!this.character.isCinematicDead) return false;
        this.character.playAnimation(this.character.images.DEAD_CINEMATIC);
        return true;
    }

    /**
     * Handles the standard death animation state.
     * @returns {boolean}
     */
    handleDeath() {
        if (!this.character.isDead()) return false;
        this.character.playAnimation(this.getDeathImages());
        return true;
    }

    /**
     * Gets the correct death animation images.
     * @returns {string[]}
     */
    getDeathImages() {
        if (this.character.lastDamageType === 'electro') {
            return this.character.images.ELECTRO_DEAD;
        }
        return this.character.images.POISEN;
    }

    /**
     * Handles the hurt animation state.
     * @returns {boolean}
     */
    handleHurt() {
        if (!this.character.isHurt()) return false;
        this.character.playAnimation(this.getHurtImages());
        return true;
    }

    /**
     * Gets the correct hurt animation images.
     * @returns {string[]}
     */
    getHurtImages() {
        if (this.character.lastDamageType === 'electro') {
            return this.character.images.ELECTRO_HURT;
        }
        return this.character.images.POISEN_HURT;
    }

    /**
     * Handles swimming movement animations and sounds.
     * @returns {boolean}
     */
    handleMovement() {
        if (!this.character.isMoving()) return false;
        this.stopSleepSound();
        this.character.playAnimation(this.character.images.SWIM);
        this.playSwimSound();
        return true;
    }

    /**
     * Checks whether movement input is active.
     * @returns {boolean}
     */
    isMoving() {
        return this.character.world.keyboard.RIGHT ||
            this.character.world.keyboard.LEFT ||
            this.character.world.keyboard.UP ||
            this.character.world.keyboard.DOWN;
    }

    /**
     * Stops the sleep sound effect.
     */
    stopSleepSound() {
        if (!this.character.isSleepingSoundPlaying) return;
        this.character.world.sound.stopSound('sleep');
        this.character.isSleepingSoundPlaying = false;
    }

    /**
     * Checks whether the character entered sleep mode.
     * @returns {boolean}
     */
    isSleeping() {
        return Date.now() - this.character.lastActionTime > 10000;
    }

    /**
     * Plays the swim sound effect.
     */
    playSwimSound() {
        if (this.character.isSwimmingSoundPlaying) return;
        this.character.world.sound.playSound('swim');
        this.character.isSwimmingSoundPlaying = true;
        setTimeout(() => {
            this.character.isSwimmingSoundPlaying = false;
        }, 200);
    }

    /**
     * Handles idle and sleep animations.
     */
    handleIdle() {
        if (!this.character.canIdle()) {
            this.stopSleepSound();
            return;
        }
        if (this.character.idleDuringBossFight()) {
            this.character.playAnimation(this.character.images.IDLE);
            return;
        }
        this.character.playIdleAnimation();
    }

    /**
     * Checks whether the character can enter idle state.
     * @returns {boolean}
     */
    canIdle() {
        return this.character.world || !this.character.world.hasStarted || this.character.world.isGameOver;
    }

    /**
     * Checks whether the boss fight idle animation should play.
     * @returns {boolean}
     */
    idleDuringBossFight() {
        return this.character.world && this.character.world.bossFightStarted && !this.character.isDead();
    }

    /**
     * Plays idle or sleep animations depending on inactivity.
     */
    playIdleAnimation() {
        if (this.isSleeping() && this.character.world.hasPlayerMoved) {
            this.character.playAnimation(this.character.images.LONG_IDLE);
            this.playSleepSound();
            return;
        }
        this.stopSleepSound();
        this.character.playAnimation(this.character.images.IDLE);
    }

    /**
     * Plays the sleep sound effect.
     */
    playSleepSound() {
        if (this.character.isSleepingSoundPlaying) return;
        this.character.world.sound.playSound('sleep');
        this.character.isSleepingSoundPlaying = true;
    }

    /**
     * Sets the current damage type for hurt and death animations.
     * @param {string} type
     */
    setDamageType(type) {
        this.character.lastDamageType = type;
    }

    /**
     * Starts the bubble attack animation sequence.
     * @param {string} type
     */
    startBubbleAttackAnimation(type = 'normal') {
        this.character.lastActionTime = Date.now();
        this.character.isChargingBubble = true;
        this.character.isBubbleAttacking = false;
        this.character.bubbleAttackType = type || 'normal';
        this.character.bubbleAttackStartedAt = Date.now();
        this.character.currentImage = 0;
    }

    


}