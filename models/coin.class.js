/**
 * Represents a collectible coin.
 */
class Coin extends DrawableObject {
    
    height = 60;
    width = 60;

    /**
     * Creates a coin at the given position.
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        super();
        this.loadImage('img/4.Marcadores/1. Coins/4.png');
        this.x = x;
        this.y = y;
    }
}