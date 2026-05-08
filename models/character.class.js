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
        this.animationManager = new CharacterAnimationManager(this);
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

    handleAnimations() {
        this.animationManager.handleAnimations();
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
     * Starts the fin slap attack animation sequence.
     */
    startFinSlapAttackAnimation() {
        this.lastActionTime = Date.now();
        if (this.isFinSlapAttacking) return;
        this.isFinSlapAttacking = true;
        this.finSlapAttackStartedAt = Date.now();
        this.currentImage = 0;
    }

    startBubbleAttackAnimation(type = 'normal') {
    this.animationManager.startBubbleAttackAnimation(type);
}

    setDamageType(type) {
        this.animationManager.setDamageType(type);
    }

    isMoving() {
        return this.animationManager.isMoving();
    }

    isSleeping() {
        return this.animationManager.isSleeping();
    }

    stopSleepSound() {
        this.animationManager.stopSleepSound();
    }

    playSwimSound() {
        this.animationManager.playSwimSound();
    }

    canIdle() {
        return this.animationManager.canIdle();
    }

    idleDuringBossFight() {
        return this.animationManager.idleDuringBossFight();
    }

    playIdleAnimation() {
        this.animationManager.playIdleAnimation();
    }

    playSleepSound() {
        this.animationManager.playSleepSound();
    }

}