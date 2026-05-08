/**
 * Represents the fin slap melee attack hitbox.
 */
class FinSlapAttack extends Attack {

    width = 140;
    height = 130;
    lifetime = 250;
    hasHit = false;
    isImpacting = false;
    markedForDeletion  = false;

    /**
     * Creates a fin slap attack for the character.
     * @param {Character} character
     */
    constructor(character) {
        super();
        this.character = character;
        this.updatePosition();
    }

    /**
     * Updates the attack position based on the character.
     */
    updatePosition() {
        this.otherDirection = this.character.otherDirection;
        let offsetX = this.character.otherDirection ? -20 : 20;
        this.x = this.character.x + offsetX;
        this.y = this.character.y + 100;
    }

    /**
     * Updates the attack state.
     */
    tick() {
        this.updatePosition();
    }

    /**
     * Marks the attack as completed after a hit.
     */
    hitTarget() {
        this.hasHit = true;
        this.markedForDeletion = true;
    }
}
