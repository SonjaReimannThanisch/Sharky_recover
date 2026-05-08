/**
 * Represents a complete game level with all level objects.
 */
class Level {
    enemies;
    lights;
    background;
    level_end_x = 720 * 20;

    /**
     * Creates a game level with enemies, collectibles and environment objects.
     * @param {Array} enemies
     * @param {Array} coins
     * @param {Array} poison
     * @param {Array} lights
     * @param {Array} background
     * @param {Array} barriers
     */
    constructor(enemies, coins, poison, lights, background, barriers){
        this.enemies = enemies;
        this.coins = coins;
        this.poison = poison;
        this.lights = lights;
        this.background  = background;
        this.barriers = barriers;
    }
} 