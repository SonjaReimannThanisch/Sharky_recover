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
        top: 130,
        left: 35,
        right: 10,
        bottom: 60,
    }

    constructor() {
        super().loadImage('img/1.Sharkie/1.IDLE/1.png');
        this.images = window.CHARACTER_IMAGES;
        this.loadAllImages();
    }

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

    animate() {
        this.setMaxY();
        this.startMovementLoop();
        this.startAnimationLoop();
    }

    setMaxY() {
        let o = this.offset || { top: 0, left: 0, right: 0, bottom: 0 };
        let hitboxHeight = this.height - o.top - o.bottom;
        this.maxY = this.world.canvas.height - hitboxHeight - o.top;
    }

    startMovementLoop() {
        if (this.movementInterval) return;
        this.movementInterval = setInterval(() => {
            this.handleMovementInput();
        }, 1000 / 60);
    }

    startAnimationLoop() {
        if (this.animationInterval) return;
        this.animationInterval = setInterval(() => {
            this.handleAnimations();
        }, 80);
    }

    handleMovementInput() {
        this.moveRight();
        this.moveLeft();
        this.moveUp();
        this.moveDown();
        this.updateCamera();
    }

    updateCamera() {
        this.world.camera_x = -this.x;
    }

    moveRight() {
        if (!this.world.keyboard.RIGHT) return;
        if (this.x >= this.world.level.level_end_x) return;
        this.x += this.speed;
        this.otherDirection = false;
        this.world.hasPlayerMoved = true;
        this.lastActionTime = Date.now();
    }

    moveLeft() {
        if (!this.world.keyboard.LEFT) return;
        if (this.x <= 0) return;
        this.x -= this.speed;
        this.otherDirection = true;
        this.world.hasPlayerMoved = true;
        this.lastActionTime = Date.now();
    }

    moveUp() {
        if (!this.world.keyboard.UP) return;
        if (this.y <= this.minY) return;
        this.y = Math.max(this.minY, this.y - this.speed);
        this.world.hasPlayerMoved = true;
        this.lastActionTime = Date.now();
    }

    moveDown() {
        if (!this.world.keyboard.DOWN) return;
        if (this.y >= this.maxY) return;
        this.y = Math.min(this.maxY, this.y + this.speed);
        this.world.hasPlayerMoved = true;
        this.lastActionTime = Date.now();
    }

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

    handleFinSlap(now) {
        if (!this.isFinSlapAttacking) return false;
        this.playAnimation(this.images.FIN_SLAP);
        if (now - this.finSlapAttackStartedAt > this.finSlapAttackDuration) {
            this.isFinSlapAttacking = false;
        }
        return true;
    }

    handleBubble(now) {
        if (this.handleChargingBubble(now)) return true;
        if (this.handleActiveBubble(now)) return true;
        return false;
    }
    
    handleChargingBubble(now) {
        if (!this.isChargingBubble) return false;
        this.playAnimation(this.images.WHALE_ATTACK);
        if (now - this.bubbleAttackStartedAt > 300) {
            this.startBubbleAttack(now);
        }
        return true;
    }

    startBubbleAttack(now) {
        this.isChargingBubble = false;
        this.isBubbleAttacking = true;
        this.bubbleAttackStartedAt = now;
    }

    handleActiveBubble(now) {
        if (!this.isBubbleAttacking) return false;
        this.playAnimation(this.getBubbleAttackImages());
        if (now - this.bubbleAttackStartedAt > this.bubbleAttackDuration) {
            this.isBubbleAttacking = false;
        }
        return true;
    }

    getBubbleAttackImages() {
        if (this.bubbleAttackType === 'poison') {
            return this.images.WHALE_ATTACK_BUBBLE;
        }
        return this.images.BUBBLE_ATTACK;
    }

    handleCinematicDeath() {
        if (!this.isCinematicDead) return false;
        this.playAnimation(this.images.DEAD_CINEMATIC);
        return true;
    }

    handleDeath() {
        if (!this.isDead()) return false;
        this.playAnimation(this.getDeathImages());
        return true;
    }

    getDeathImages() {
        if (this.lastDamageType === 'electro') {
            return this.images.ELECTRO_DEAD;
        }
        return this.images.POISEN;
    }

    handleHurt() {
        if (!this.isHurt()) return false;
        this.playAnimation(this.getHurtImages());
        return true;
    }

    getHurtImages() {
        if (this.lastDamageType === 'electro') {
            return this.images.ELECTRO_HURT;
        }
        return this.images.POISEN_HURT;
    }

    handleMovement() {
        if (!this.isMoving()) return false;
        this.stopSleepSound();
        this.playAnimation(this.images.SWIM);
        this.playSwimSound();
        return true;
    }

    isMoving() {
        return this.world.keyboard.RIGHT ||
            this.world.keyboard.LEFT ||
            this.world.keyboard.UP ||
            this.world.keyboard.DOWN;
    }

    stopSleepSound() {
        if (!this.isSleepingSoundPlaying) return;
        this.world.sound.stopSound('sleep');
        this.isSleepingSoundPlaying = false;
    }

    isSleeping() {
        return Date.now() - this.lastActionTime > 10000;
    }

    playSwimSound() {
        if (this.isSwimmingSoundPlaying) return;
        this.world.sound.playSound('swim');
        this.isSwimmingSoundPlaying = true;
        setTimeout(() => {
            this.isSwimmingSoundPlaying = false;
        }, 200);
    }

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

    canIdle() {
        return this.world || !this.world.hasStarted || this.world.isGameOver;
    }

    idleDuringBossFight() {
        return this.world && this.world.bossFightStarted && !this.isDead();
    }

    playIdleAnimation() {
        if (this.isSleeping() && this.world.hasPlayerMoved) {
            this.playAnimation(this.images.LONG_IDLE);
            this.playSleepSound();
            return;
        }
        this.stopSleepSound();
        this.playAnimation(this.images.IDLE);
    }

    playSleepSound() {
        if (this.isSleepingSoundPlaying) return;
        this.world.sound.playSound('sleep');
        this.isSleepingSoundPlaying = true;
    }

    setDamageType(type) {
        this.lastDamageType = type;
    }

    startBubbleAttackAnimation(type = 'normal') {
        this.lastActionTime = Date.now();
        this.isChargingBubble = true;
        this.isBubbleAttacking = false;
        this.bubbleAttackType = type || 'normal';
        this.bubbleAttackStartedAt = Date.now();
        this.currentImage = 0;
    }

    startFinSlapAttackAnimation() {
        this.lastActionTime = Date.now();
        if (this.isFinSlapAttacking) return;
        this.isFinSlapAttacking = true;
        this.finSlapAttackStartedAt = Date.now();
        this.currentImage = 0;
    }
}