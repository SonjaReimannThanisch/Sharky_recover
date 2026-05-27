/**
 * Represents a poisonous pufferfish enemy.
 */
class Pufferfisch extends MovableObject {
    height = 80;
    width = 80;
    isDead = false;
    markedForDeletion = false;
    energy = 100;
    hasHit = false;
    deathType = 'normal';
    deathSpeedX = 0;
    deathSpeedY = 0;
    deathGravity = 0.08;

    offset = {
        top: 16,
        left: 8,
        right: 8,
        bottom: 16,
    }

    /**
     * Creates a pufferfish enemy with color and position.
     * @param {string} color
     * @param {number} x
     * @param {number} y
     */
    constructor(color = 'pink', x = 1440, y = 140) {
        super()
        this.images = window.PUFFERFISH_IMAGES;
        this.type = color;
        this.swimImages = this.getSwimImages();
        this.loadImage(this.swimImages[0]);
        this.loadAllImages();
        this.x = x;
        this.y = y;
        this.speed = 0.6 + Math.random() * 0.5;
        this.animate();
        this.damageType = 'poison';
    }

    /**
     * Loads all pufferfish animation images.
     */
    loadAllImages() {
        this.loadImages(this.images.IMAGE_PINK);
        this.loadImages(this.images.IMAGE_ROSE);
        this.loadImages(this.images.IMAGE_GREEN);
        this.loadImages(this.images.DIE_PINK);
        this.loadImages(this.images.DIE_ROSE);
        this.loadImages(this.images.DIE_GREEN);
    }

    /**
     * Gets the swimming animation images for the current pufferfish type.
     * @returns {string[]}
     */
    getSwimImages() {
        if (this.type === 'rose') return this.images.IMAGE_ROSE;
        if (this.type === 'green') return  this.images.IMAGE_GREEN;
        return this.images.IMAGE_PINK;
    }

    /**
     * Gets the death animation images for the current pufferfish type.
     * @returns {string[]}
     */
    getDieImages() {
        if (this.type === 'pink') return this.images.DIE_PINK;
        if (this.type === 'rose') return this.images.DIE_ROSE;
        return this.images.DIE_GREEN;
    }

    /**
     * Applies damage to the pufferfish.
     * @param {string} type
     */
    hit(type = 'normal') {
        if (this.isDead) return;
        this.energy -= this.getDamage(type);
        this.deathType = type;
        if (this.energy <= 0) {
            this.die();
        }
    }

    /**
     * Gets the damage value for an attack type.
     * @param {string} type
     * @returns {number}
     */
    getDamage(type) {
        if (type === 'finSlap') return 100;
        return 100;
    }

    /**
     * Starts movement and animation loops.
     */
    animate() {
        this.startMovement();
        this.startAnimation();
    }

    /**
     * Starts the pufferfish movement loop.
     */
    startMovement() {
        setInterval(() => {
            if (!this.world?.hasStarted || !this.world?.hasPlayerMoved) return;
            if (this.isDead) {
                this.handleDeathMovement();
            } else {
                this.move();
            }
        }, 1000 / 60);
    }

    /**
     * Moves the pufferfish horizontally.
     */
    move() {
        let nextX = this.x - this.speed;
        if (this.wouldHitBarrier(nextX)) {
            this.turnAround();
            return;
        }
        this.x = nextX;
    }

    /**
     * Checks whether the pufferfish would collide with a barrier.
     * @param {number} nextX
     * @returns {boolean}
     */
    wouldHitBarrier(nextX) {
        let oldX = this.x;
        this.x = nextX;
        let hitsBarrier = this.world.level.barriers.some(barrier =>
            this.isColliding(barrier)
        );
        this.x = oldX;
        return hitsBarrier;
    }

    /**
     * Reverses movement direction after a barrier collision.
     */
    turnAround() {
        this.speed *= -1;
        this.otherDirection = !this.otherDirection;
    }

    /**
     * Handles movement after a fin slap death.
     */
    handleDeathMovement() {
        if (this.deathType !== 'finSlap') return;
        this.x += this.deathSpeedX;
        this.y += this.deathSpeedY;
        this.deathSpeedX += this.deathGravity;
    }

    /**
     * Starts the pufferfish animation loop.
     */
    startAnimation() {
        setInterval(() => {
            if (this.world?.isGameOver || this.world?.hasWon) return;
            if (this.isDead) {
                this.playAnimation(this.getDieImages());
            } else {
                this.playAnimation(this.swimImages);
            }
        }, 200);
    }

    /**
     * Handles pufferfish death behavior.
     */
    die() {
        this.isDead = true;
        this.speed = 0;
        if (this.deathType === 'finSlap') {
            this.deathSpeedX = 5;
            this.deathSpeedY = Math.random() < 0.5 ? -5 : 5;
        }
        setTimeout(() => {
            this.markedForDeletion = true;
        }, 700);
    }
}