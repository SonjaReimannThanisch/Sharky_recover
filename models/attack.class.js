/**
 * Base class for temporary attack objects.
 */
class Attack extends MovableObject {
    damage = 20;
    lifetime = 200;
    createdAt = 0;
    hasHit = false;

    /**
     * Creates an attack and stores its creation time.
     */
    constructor() {
        super();
        this.createdAt = Date.now();
    }

    /**
     * Checks whether the attack lifetime has expired.
     * @returns {boolean}
     */
    isExpired() {
        return Date.now() - this.createdAt > this.lifetime;
    }
}
