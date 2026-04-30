class character extends movableObject {

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
        this.loadImages(this.images.POISENED);
        this.loadImages(this.images.POIHURT);
        this.loadImages(this.images.ELECTROHURT);
        this.loadImages(this.images.ELECTRODEAD);
        this.loadImages(this.images.BUBBLEATTACK);
        this.loadImages(this.images.FINSLAP);
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
            this.handleMovementinput();
        }, 1000 / 60);
    }

    startAnimationLoop() {
        if (this.animationInterval) return;
        this.animationInterval = setInterval(() => {
            this.handleAnimations();
        }, 80);
    }

    handleMovementinput() {
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
        this.playAnimation(this.images.FINSLAP);
        if (now - this.finSlapAttackStartedAt > this.finSlapAttackDuration) {
            this.isFinSlapAttacking = false;
        }
        return true;
    }

    handleBubble(now) {
        if (this.isChargingBubble) {
            this.playAnimation(this.images.WHALE_ATTACK);
            if (now - this.bubbleAttackStartedAt > 300) {
                this.isChargingBubble = false;
                this.isBubbleAttacking = true;
                this.bubbleAttackStartedAt = now;
            }
            return true;
        }
        if (this.isBubbleAttacking) {
            if (this.bubbleAttackType === 'poison') {
                this.playAnimation(this.images.WHALE_ATTACK_BUBBLE);
            } else {
                this.playAnimation(this.images.BUBBLEATTACK);
            }
            if (now - this.bubbleAttackStartedAt > this.bubbleAttackDuration) {
                this.isBubbleAttacking = false;
            }
            return true;
        }
        return false;
    }

    handleCinematicDeath() {
        if (!this.isCinematicDead) return false;
        this.playAnimation(this.images.DEAD_CINEMATIC);
        return true;
    }

    handleDeath() {
        if (!this.isDead()) return false;
        if (this.lastDamageType === 'electro') {
            this.playAnimation(this.images.ELECTRODEAD);
        } else {
            this.playAnimation(this.images.POISENED);
        }
        return true;
    }

    handleHurt() {
        if (!this.isHurt()) return false;
        if (this.lastDamageType === 'electro') {
            this.playAnimation(this.images.ELECTROHURT);
        } else {
            this.playAnimation(this.images.POIHURT);
        }
        return true;
    }

    handleMovement() {
        if (
            this.world.keyboard.RIGHT ||
            this.world.keyboard.LEFT ||
            this.world.keyboard.UP ||
            this.world.keyboard.DOWN
        ) {
            this.stopSleepsound();
            this.playAnimation(this.images.SWIM);
            this.playSwimSound();
            return true;
        }
        return false;
    }

    stopSleepsound() {
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
        }, 300);
    }


    handleIdle() {
        if (!this.world || !this.world.hasStarted || this.world.isGameOver) {
            this.stopSleepsound();
            return;
        }
        if (this.world && this.world.bossFightStarted && !this.isDead()) {
            this.playAnimation(this.images.IDLE);
            return;
        }
        let idleTime = Date.now() - this.lastActionTime;
        if (idleTime > 10000 && this.world.hasPlayerMoved) {
            this.playAnimation(this.images.LONG_IDLE);
            this.playSleepSound();
        } else {
            this.stopSleepsound();
            this.playAnimation(this.images.IDLE);
        }
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