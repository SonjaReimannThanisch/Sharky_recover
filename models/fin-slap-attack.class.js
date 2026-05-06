class FinSlapAttack extends Attack {

    width = 140;
    height = 130;
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
        let offsetX = this.character.otherDirection ? -20 : 20;
        this.x = this.character.x + offsetX;
        this.y = this.character.y + 100;
    }

    tick() {
        this.updatePosition();
    }

    hitTarget() {
        this.hasHit = true;
        this.markedForDeletion = true;
    }
}
