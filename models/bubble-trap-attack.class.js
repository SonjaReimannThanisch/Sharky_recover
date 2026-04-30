class BubbleTrapAttack extends Attack {
    width = 60;
    height = 60;
    lifetime = 1000;
    hasHit = false;
    isImpacting = false;
    markedForDeletion = false;
    impactSpeed = 0;
    impactEndAt = 0;

    constructor(character, type = 'normal') {
        super();
        this.images = BUBBLE_IMAGES;
        this.type = type;
        this.character = character;
        this.otherDirection = this.character.otherDirection;

        this.loadAllImages();
        this.setStartImage();
        this.getBubbleImages();
        this.setStartPosition();
        this.startVelocity();
    }

    loadAllImages() {
        this.loadImages(this.images.NORMAL);
        this.loadImages(this.images.POISON);
    }

    setStartImage() {
        let images = this.getBubbleImages();
        this.img = this.imageCache[images[0]];
    }

    getBubbleImages() {
        if (this.type === 'poison') return this.images.POISON;
        return this.images.NORMAL;
    }

    startVelocity() {
        let speed = 8 + Math.random() * 4;
        this.vx = this.otherDirection ? -speed : speed;
    }

    setStartPosition() {
        this.otherDirection = this.character.otherDirection;
        this.x = this.character.x + this.character.width - 10;
        this.y = this.character.y + this.character.height / 2;
        if (this.otherDirection) {
            this.x = this.character.x - this.width + 10;
        }
    }

    tick(now) {
        this.animateBubble(now);
        this.updateImpact(now);
    }

    animateBubble(now) {
        if (!this.lastFrameAt) this.lastFrameAt = now;
        if (now-this.lastFrameAt <= 50) return;
        this.playAnimation(this.getBubbleImages());
        this.lastFrameAt = now;
    }

    updateImpact(now) {
        if (!this.isImpacting) return;
        this.x += this.impactSpeed;
        if (now >= this.impactEndAt) {
            this.impactSpeed = 0;
        }
        this.width += 0.2;
        this.height += 0.2;
    }

    hitTarget() {
        this.hasHit = true;
        this.isImpacting = true;
        this.impactSpeed = this.otherDirection ? -2 : 2;
        this.impactEndAt = Date.now() + 120;
        setTimeout(() => {
            this.vx = 0;
            this.markedForDeletion = true;
        }, 180);
    }
}