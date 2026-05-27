/**
 * Represents an electric jellyfish enemy.
 */
class Jellyfisch extends MovableObject {
    height = 80;
    width = 80;
    isDead = false;
    markedForDeletion = false;
    energy = 100;
    
    offset = {
        top: 18,
        left: 8,
        right: 8,
        bottom: 8,
    }

    /**
     * Creates a jellyfish enemy with color and position.
     * @param {string} color
     * @param {number} x
     * @param {number} y
     */
    constructor(color = 'lila', x = 890, y = 100) {
        super();
        this.images = window.JELLYFISH_IMAGES;
        this.type = color;
        this.damage = this.isSuperDangerous() ? 20:5;
        this.swimImages = this.getSwimImages();
        this.loadImage(this.swimImages[0]);
        this.loadAllImages();
        this.x = x;
        this.y = y;
        this.speed = 0.3 + Math.random() * 0.5;
        this.animate();
        this.damageType = 'electro';
    }

    /**
     * Loads all jellyfish animation images.
     */
    loadAllImages() {
        this.loadImages(this.images.MOVE_LILA);
        this.loadImages(this.images.MOVE_YELLOW);
        this.loadImages(this.images.MOVE_GREEN);
        this.loadImages(this.images.MOVE_PINK);
        this.loadImages(this.images.DEAD_LILA);
        this.loadImages(this.images.DEAD_GREEN);
        this.loadImages(this.images.DEAD_PINK);
        this.loadImages(this.images.DEAD_YELLOW);
    }

    /**
     * Gets the swimming animation images for the current jellyfish type.
     * @returns {string[]}
     */
    getSwimImages() {
        if (this.type === 'yellow') return this.images.MOVE_YELLOW;
        if (this.type === 'green') return this.images.MOVE_GREEN;
        if (this.type === 'pink') return this.images.MOVE_PINK;
        return this.images.MOVE_LILA;
    }

    /**
     * Gets the death animation images for the current jellyfish type.
     * @returns {string[]}
     */
    getDieImages() {
        if (this.type === 'yellow') return this.images.DEAD_YELLOW;
        if (this.type === 'green') return this.images.DEAD_GREEN;
        if (this.type === 'pink') return this.images.DEAD_PINK;
        return this.images.DEAD_LILA;
    }

    /**
     * Checks whether the jellyfish deals increased damage.
     * @returns {boolean}
     */
    isSuperDangerous() {
        return this.type === 'green' || this.type === 'pink';
    }

    /**
     * Applies damage to the jellyfish.
     */
    hit() {
        if (this.isDead) return;
        this.energy -= 100;
        if (this.energy <= 0) {
            this.die();
        }
    }

    /**
     * Handles jellyfish death behavior.
     */
    die() {
        this.isDead = true;
        this.speed = 0;
        this.currentImage = 0;
        setTimeout(() => {
            this.markedForDeletion = true;
        }, 500);
    }

    /**
     * Starts movement and animation loops.
     */
    animate(){
        this.startMovement();
        this.startAnimation();
    }

    /**
     * Starts the jellyfish movement loop.
     */
    startMovement() {
        setInterval(() => {
            if (!this.world?.hasStarted || !this.world?.hasPlayerMoved) return;
            if (!this.isDead) {
                this.move();
            }
        }, 1000 / 60);
    }

    /**
     * Moves the jellyfish horizontally.
     */
    move() {
        let nextX = this.x - this.speed;
        if (this.wouldHitBarrier(nextX)) {
            this.speed *= -1;
            return;
        }
        this.x = nextX;
    }

    /**
     * Checks whether the jellyfish would collide with a barrier.
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
     * Starts the jellyfish animation loop.
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

}