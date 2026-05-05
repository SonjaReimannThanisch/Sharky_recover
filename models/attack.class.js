class Attack extends MovableObject {
    damage = 20;
    lifetime = 200;
    createdAt = 0;
    hasHit = false;

    constructor() {
        super();
        this.createdAt = Date.now();
    }

    isExpired() {
        return Date.now() - this.createdAt > this.lifetime;
    }
}
