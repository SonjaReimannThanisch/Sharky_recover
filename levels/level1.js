/**
 * Creates the first game level with enemies, collectibles, background and barriers.
 * @returns {Level} The configured level instance.
 */
function createLevel1() {
    return new Level(
        createEnemies(),
        createCoins(),
        createPoison(),
        createLights(),
        createBackground(),
        createBarriers()
    );
}

/**
 * Creates all enemies for the first level.
 * @returns {Array<MovableObject>} The enemy objects.
 */
function createEnemies() {
    return [
        new Jellyfisch('green', 500, 180),
        new Jellyfisch('yellow', 800, 260),
        new Pufferfisch('rose', 640, 280),

        new Pufferfisch('pink', 1500, 220),
        new Jellyfisch('lila', 1800, 140),

        new Pufferfisch('rose', 2300, 280),
        new Jellyfisch('green', 2600, 160),
        new Pufferfisch('green', 2950, 230),

        new Jellyfisch('pink', 3300, 180),
        new Pufferfisch('green', 3500, 260),
        new Pufferfisch('pink', 3660, 220),

        new Endboss(),
    ];
}

/**
 * Creates all coins for the first level.
 * @returns {Array<Coin>} The coin objects.
 */
function createCoins() {
    return [
        new Coin(1500, 300),
        new Coin(1580, 240),
        new Coin(1660, 210),
        new Coin(1740, 240),
        new Coin(1820, 300),

        new Coin(2440, 160),
        new Coin(2520, 130),
        new Coin(2600, 160),

        new Coin(3180, 220),
        new Coin(3260, 250),
        new Coin(3340, 280),

        new Coin(3660, 320),
        new Coin(3740, 260),
        new Coin(3820, 230),
    ];
}

/**
 * Creates all poison bottles for the first level.
 * @returns {Array<Poison>} The poison bottle objects.
 */
function createPoison() {
    return [
        new Poison(45, 315),
        new Poison(900, 340),
        new Poison(1900, 330),
        new Poison(2740, 320),
        new Poison(3420, 330),
        new Poison(3620, 370),
        new Poison(4200, 330),
        new Poison(5000, 330),
    ];
}

/**
 * Creates all animated background light objects.
 * @returns {Array<Light>} The light objects.
 */
function createLights() {
    return [
        new Light('img/3.Background/Layers/1.Light/1.png', 0),
        new Light('img/3.Background/Layers/1.Light/2.png', 720),
    ];
}

/**
 * Creates the repeating background layers for the level.
 * @returns {Array<BackgroundObject>} The background objects.
 */
function createBackground() {
    return [
        new BackgroundObject('img/3.Background/Layers/5.Water/D1.png', 0),
        new BackgroundObject('img/3.Background/Layers/5.Water/D2.png', 720),

        new BackgroundObject('img/3.Background/Layers/3.Fondo 1/D1.png', 0),
        new BackgroundObject('img/3.Background/Layers/3.Fondo 1/D2.png', 720),

        new BackgroundObject('img/3.Background/Layers/2.Floor/D1.png', 0),
        new BackgroundObject('img/3.Background/Layers/2.Floor/D2.png', 720),
    ];
}

/**
 * Creates all barrier objects and collision areas for the level.
 * @returns {Array<Barriers>} The barrier objects.
 */
function createBarriers() {
    let barrierTwo = new Barriers('img/3.Background/Barrier/2.png', 950, 150, 420, 320);
    barrierTwo.offset = { top: 45, left: 50, right: 40, bottom: 0 };
    return [
        barrierTwo,
        new Barriers('img/3.Background/Barrier/3.png', 3440, 10, 200, 240),
        ...createCaveBarrier(),
    ];
}

/**
 * Creates the cave barrier setup with decorative and collision layers.
 * @returns {Array<Barriers>} The cave barrier objects.
 */
function createCaveBarrier() {
    let caveDeco = new Barriers('img/3.Background/Barrier/1.png', 2300, 0, 850, 480);
    caveDeco.offset = { top: 9999, left: 9999, right: 9999, bottom: 9999 };

    let caveTop = new Barriers('', 2300, 0, 850, 120);
    caveTop.offset = { top: 0, left: 30, right: 30, bottom: 10 };

    let caveBottom = new Barriers('', 2300, 360, 850, 120);
    caveBottom.offset = { top: 10, left: 30, right: 30, bottom: 0 };

    return [caveDeco, caveTop, caveBottom];
}