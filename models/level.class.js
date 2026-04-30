class Level {
    enemies;
    lights;
    background;
    level_end_x = 720 * 20;


    constructor(enemies, coins, poison, lights, background, barriers){
        this.enemies = enemies;
        this.coins = coins;
        this.poison = poison;
        this.lights = lights;
        this.background  = background;
        this.barriers = barriers;
    }
} 