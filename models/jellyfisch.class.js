class jellyfisch extends movableObject {

    height = 80;
    width = 80;
    isDead = false;
    markedForDeletion = false;
    energy = 100;

    offset = {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5,
    }

    constructor(color = 'lila') {
        super();
        this.images = window.JELLYFISH_IMAGES;
        this.type = color;
        this.damage = this.isSuperDangerous() ? 20:5;
        this.swimImages = this.getSwimImages();
        this.loadImage(this.swimImages[0]);
        this.loadAllImages();
        this.x = 890 + Math.random() * 500;
        this.y = 100 + Math.random() * 200;
        this.speed = 0.3 + Math.random() * 0.5;
        this.animate();
        this.damageType = 'electro';
    }

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

    getSwimImages() {
        if (this.type === 'yellow') return this.images.MOVE_YELLOW;
        if (this.type === 'green') return this.images.MOVE_GREEN;
        if (this.type === 'pink') return this.images.MOVE_PINK;
        return this.images.MOVE_LILA;
    }
    getDieImages() {
        if (this.type === 'yellow') return this.images.DEAD_YELLOW;
        if (this.type === 'green') return this.images.DEAD_GREEN;
        if (this.type === 'pink') return this.images.DEAD_PINK;
        return this.images.DEAD_LILA;
    }

    isSuperDangerous() {
        return this.type === 'green' || this.type === 'pink';
    }

    hit() {
        if (this.isDead) return;
        this.energy -= 100;
        if (this.energy <= 0) {
            this.die();
        }
    }

    die() {
        this.isDead = true;
        this.speed = 0;
        this.currentImage = 0;
        setTimeout(() => {
            this.markedForDeletion = true;
        }, 500);
    }

    animate(){
        this.startMovement();
        this.startAnimation();
    }

    startMovement() {
        setInterval(() => {
            if (!this.world?.hasStarted || !this.world?.hasPlayerMoved) return;
            if (!this.isDead) {
                this.x -= this.speed;
            }
        }, 1000 / 60);
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

}