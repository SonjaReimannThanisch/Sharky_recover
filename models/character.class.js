/**
 * Represents the playable Sharky character with movement, combat and animation logic.
 */
class Character extends MovableObject {
    height = 280;
    width = 200;
    y = 80;
    world;
    speed = 10;
    minY = -130;
    maxY;
    lastAttack = 0;
    attackCooldown = 400;
    coins = 0;
    bottle = 0;
    isChargingBubble = false;
    isBubbleAttacking = false;
    bubbleAttackStartedAt = 0;
    bubbleAttackDuration = 500;
    isFinSlapAttacking = false;
    finSlapAttackStartedAt = 0;
    finSlapAttackDuration = 500;
    lastActionTime = Date.now();
    lastDamageType = 'poison';
    deathCause = '';
    isCinematicDead = false;
    movementInterval = null;
    animationInterval = null;
    offset = {
        top: 120,
        left: 40,
        right: 40,
        bottom: 50,
    }

    /**
     * Creates the main character and loads all animation assets.
     */
    constructor() {
        super().loadImage('img/1.Sharkie/1.IDLE/1.png');
        this.images = window.CHARACTER_IMAGES;
        this.loadAllImages();
    }

    /**
     * Loads all character animation images into the cache.
     */
    loadAllImages() {
        this.loadImages(this.images.IDLE);
        this.loadImages(this.images.LONG_IDLE);
        this.loadImages(this.images.SWIM);
        this.loadImages(this.images.POISEN);
        this.loadImages(this.images.POISEN_HURT);
        this.loadImages(this.images.ELECTRO_HURT);
        this.loadImages(this.images.ELECTRO_DEAD);
        this.loadImages(this.images.BUBBLE_ATTACK);
        this.loadImages(this.images.FIN_SLAP);
        this.loadImages(this.images.WHALE_ATTACK);
        this.loadImages(this.images.WHALE_ATTACK_BUBBLE);
        this.loadImages(this.images.DEAD_CINEMATIC);
    }

    /**
     * Starts movement and animation loops for the character.
     */
    animate() {
        this.setMaxY();
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    /**
     * Calculates the maximum vertical movement position.
     */
    setMaxY() {
        if (!this.world) return;
        let o = this.offset || { top: 0, left: 0, right: 0, bottom: 0 };
        let hitboxHeight = this.height - o.top - o.bottom;
        this.maxY = this.world.canvas.height - hitboxHeight - o.top;
    }

    /**
     * Starts the continuous movement input loop.
     */
    startMovementLoop() {
        if (this.movementInterval) return;
        this.movementInterval = setInterval(() => {
            this.handleMovementInput();
        }, 1000 / 60);
    }

    /**
     * Starts the continuous animation update loop.
     */
    startAnimationLoop() {
        if (this.animationInterval) return;
        this.animationInterval = setInterval(() => {
            this.handleAnimations();
        }, 80);
    }

    /**
     * Processes movement input and updates the camera position.
     */
    handleMovementInput() {
        if (this.shouldStopMovement()) return;
        this.moveRight();
        this.moveLeft();
        this.moveUp();
        this.moveDown();
        this.updateCamera();
    }

    /**
     * Checks whether movement should be disabled.
     * @returns {boolean}
     */
    shouldStopMovement() {
        return !this.world || this.world.isGameOver || this.world.hasWon || this.isDead() || this.isCinematicDead;
    }

    /**
     * Updates the world camera position based on character movement.
     */
    updateCamera() {
        this.world.camera_x = -this.x;
    }

    /**
     * Moves the character to the right.
     */
    moveRight() {
        if (!this.world.keyboard.RIGHT) return;
        if (this.x >= this.world.level.level_end_x) return;
        this.x += this.speed;
        this.otherDirection = false;
        this.world.hasPlayerMoved = true;
        this.lastActionTime = Date.now();
    }

    /**
     * Moves the character to the left.
     */
    moveLeft() {
        if (!this.world.keyboard.LEFT) return;
        if (this.x <= 0) return;
        this.x -= this.speed;
        this.otherDirection = true;
        this.world.hasPlayerMoved = true;
        this.lastActionTime = Date.now();
    }

    /**
     * Moves the character upward.
     */
    moveUp() {
        if (!this.world.keyboard.UP) return;
        if (this.y <= this.minY) return;
        this.y = Math.max(this.minY, this.y - this.speed);
        this.world.hasPlayerMoved = true;
        this.lastActionTime = Date.now();
    }

    /**
     * Moves the character downward.
     */
    moveDown() {
        if (!this.world.keyboard.DOWN) return;
        if (this.y >= this.maxY) return;
        this.y = Math.min(this.maxY, this.y + this.speed);
        this.world.hasPlayerMoved = true;
        this.lastActionTime = Date.now();
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
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
        }
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    /**
     * Handles the fin slap attack animation state.
     * @param {number} now
     * @returns {boolean}
     */
    handleFinSlap(now) {
        if (!this.isFinSlapAttacking) return false;
        this.playAnimation(this.images.FIN_SLAP);
        if (now - this.finSlapAttackStartedAt > this.finSlapAttackDuration) {
            this.isFinSlapAttacking = false;
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
        if (!this.isChargingBubble) return false;
        this.playAnimation(this.images.WHALE_ATTACK);
        if (now - this.bubbleAttackStartedAt > 300) {
            this.startBubbleAttack(now);
        }
        return true;
    }

    /**
     * Starts the active bubble attack phase.
     * @param {number} now
     */
    startBubbleAttack(now) {
        this.isChargingBubble = false;
        this.isBubbleAttacking = true;
        this.bubbleAttackStartedAt = now;
    }

    /**
     * Handles the active bubble attack animation.
     * @param {number} now
     * @returns {boolean}
     */
    handleActiveBubble(now) {
        if (!this.isBubbleAttacking) return false;
        this.playAnimation(this.getBubbleAttackImages());
        if (now - this.bubbleAttackStartedAt > this.bubbleAttackDuration) {
            this.isBubbleAttacking = false;
        }
        return true;
    }

    /**
     * Gets the correct bubble attack animation images.
     * @returns {string[]}
     */
    getBubbleAttackImages() {
        if (this.bubbleAttackType === 'poison') {
            return this.images.WHALE_ATTACK_BUBBLE;
        }
        return this.images.BUBBLE_ATTACK;
    }

    /**
     * Handles the cinematic death animation state.
     * @returns {boolean}
     */
    handleCinematicDeath() {
        if (!this.isCinematicDead) return false;
        this.playAnimation(this.images.DEAD_CINEMATIC);
        return true;
    }

    /**
     * Handles the standard death animation state.
     * @returns {boolean}
     */
    handleDeath() {
        if (!this.isDead()) return false;
        this.playAnimation(this.getDeathImages());
        return true;
    }

    /**
     * Gets the correct death animation images.
     * @returns {string[]}
     */
    getDeathImages() {
        if (this.lastDamageType === 'electro') {
            return this.images.ELECTRO_DEAD;
        }
        return this.images.POISEN;
    }

    /**
     * Handles the hurt animation state.
     * @returns {boolean}
     */
    handleHurt() {
        if (!this.isHurt()) return false;
        this.playAnimation(this.getHurtImages());
        return true;
    }

    /**
     * Gets the correct hurt animation images.
     * @returns {string[]}
     */
    getHurtImages() {
        if (this.lastDamageType === 'electro') {
            return this.images.ELECTRO_HURT;
        }
        return this.images.POISEN_HURT;
    }

    /**
     * Handles swimming movement animations and sounds.
     * @returns {boolean}
     */
    handleMovement() {
        if (!this.isMoving()) return false;
        this.stopSleepSound();
        this.playAnimation(this.images.SWIM);
        this.playSwimSound();
        return true;
    }

    /**
     * Checks whether movement input is active.
     * @returns {boolean}
     */
    isMoving() {
        return this.world.keyboard.RIGHT ||
            this.world.keyboard.LEFT ||
            this.world.keyboard.UP ||
            this.world.keyboard.DOWN;
    }

    /**
     * Stops the sleep sound effect.
     */
    stopSleepSound() {
        if (!this.isSleepingSoundPlaying) return;
        this.world.sound.stopSound('sleep');
        this.isSleepingSoundPlaying = false;
    }

    /**
     * Checks whether the character entered sleep mode.
     * @returns {boolean}
     */
    isSleeping() {
        return Date.now() - this.lastActionTime > 10000;
    }

    /**
     * Plays the swim sound effect.
     */
    playSwimSound() {
        if (this.isSwimmingSoundPlaying) return;
        this.world.sound.playSound('swim');
        this.isSwimmingSoundPlaying = true;
        setTimeout(() => {
            this.isSwimmingSoundPlaying = false;
        }, 200);
    }

    /**
     * Handles idle and sleep animations.
     */
    handleIdle() {
        if (!this.canIdle()) {
            this.stopSleepSound();
            return;
        }
        if (this.idleDuringBossFight()) {
            this.playAnimation(this.images.IDLE);
            return;
        }
        this.playIdleAnimation();
    }

    /**
     * Checks whether the character can enter idle state.
     * @returns {boolean}
     */
    canIdle() {
        return this.world || !this.world.hasStarted || this.world.isGameOver;
    }

    /**
     * Checks whether the boss fight idle animation should play.
     * @returns {boolean}
     */
    idleDuringBossFight() {
        return this.world && this.world.bossFightStarted && !this.isDead();
    }

    /**
     * Plays idle or sleep animations depending on inactivity.
     */
    playIdleAnimation() {
        if (this.isSleeping() && this.world.hasPlayerMoved) {
            this.playAnimation(this.images.LONG_IDLE);
            this.playSleepSound();
            return;
        }
        this.stopSleepSound();
        this.playAnimation(this.images.IDLE);
    }

    /**
     * Plays the sleep sound effect.
     */
    playSleepSound() {
        if (this.isSleepingSoundPlaying) return;
        this.world.sound.playSound('sleep');
        this.isSleepingSoundPlaying = true;
    }

    /**
     * Sets the current damage type for hurt and death animations.
     * @param {string} type
     */
    setDamageType(type) {
        this.lastDamageType = type;
    }

    /**
     * Starts the bubble attack animation sequence.
     * @param {string} type
     */
    startBubbleAttackAnimation(type = 'normal') {
        this.lastActionTime = Date.now();
        this.isChargingBubble = true;
        this.isBubbleAttacking = false;
        this.bubbleAttackType = type || 'normal';
        this.bubbleAttackStartedAt = Date.now();
        this.currentImage = 0;
    }

    /**
     * Starts the fin slap attack animation sequence.
     */
    startFinSlapAttackAnimation() {
        this.lastActionTime = Date.now();
        if (this.isFinSlapAttacking) return;
        this.isFinSlapAttacking = true;
        this.finSlapAttackStartedAt = Date.now();
        this.currentImage = 0;
    }
}