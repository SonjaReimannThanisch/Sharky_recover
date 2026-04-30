class FinSlapAttack extends Attack {

    width = 180;
    height = 120;
    lifetime = 250;
    hasHit = false;
    isImpacting = false;
    markedForDeletion  = false;


    constructor(character) {
        super();
        this.character = character;
        this.updatePosition();
    }

    updatePosition() {
        this.otherDirection = this.character.otherDirection;
        let offsetX = this.character.otherDirection ? -50 : 50;
        this.x = this.character.x + offsetX;
        this.y = this.character.y + 120;
    }

    tick() {
        this.updatePosition();
    }

    hitTarget() {
        this.hasHit = true;
        this.markedForDeletion = true;
    }
}
