/**
 * Represents a collectible poison bottle.
 */ 
class Poison extends DrawableObject {
    height = 100;
    width = 60;

    /**
     * Creates a poison bottle at the given position.
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        super();
        this.loadImage('img/4.Marcadores/Posión/Dark - Right.png');
        this.x = x;
        this.y = y;
    }
}