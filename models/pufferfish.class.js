class pufferfisch extends movableObject {

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
        top: 0,
        left: 0,
        right: 0,
        bottom: 20,
    }

    constructor(color = 'pink') {
        super()
        this.images = window.PUFFERFISH_IMAGES;
        this.type = color;
        this.swimImages = this.getSwimImages();
        this.loadImage(this.swimImages[0]);
        this.loadAllImages();
        this.x = 1440 + Math.random() * 500;
        this.y = 140 + Math.random() * 200;
        this.speed = 0.6 + Math.random() * 0.7;
        this.animate();
        this.damageType = 'poison';
    }

    loadAllImages() {
        this.loadImages(this.images.IMAGE_PINK);
        this.loadImages(this.images.IMAGE_ROSE);
        this.loadImages(this.images.IMAGE_GREEN);
        this.loadImages(this.images.DIE_PINK);
        this.loadImages(this.images.DIE_ROSE);
        this.loadImages(this.images.DIE_GREEN);
    }

    getSwimImages() {
        if (this.type === 'rose') return this.images.IMAGE_ROSE;
        if (this.type === 'green') return  this.images.IMAGE_GREEN;
        return this.images.IMAGE_PINK;
    }

    getDieImages() {
        if (this.type === 'pink') return this.images.DIE_PINK;
        if (this.type === 'rose') return this.images.DIE_ROSE;
        return this.images.DIE_GREEN;
    }

    hit(type = 'normal') {
        if (this.isDead) return;
        this.energy -= this.getDamage(type);
        this.deathType = type;
        if (this.energy <= 0) {
            this.die();
        }
    }

    getDamage(type) {
        if (type === 'finSlap') return 100;
        return 100;
    }

    animate() {
        this.startMovement();
        this.startAnimation();
    }

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

    move() {
        this.x -= this.speed;
    }

    handleDeathMovement() {
        if (this.deathType !== 'finSlap') return;
        this.x += this.deathSpeedX;
        this.y += this.deathSpeedY;
        this.deathSpeedX += this.deathGravity;
    }

    startAnimation() {
        setInterval(() => {
            if (this.isDead) {
                this.playAnimation(this.getDieImages());
            } else {
                this.playAnimation(this.swimImages);
            }
        }, 200);
    }

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