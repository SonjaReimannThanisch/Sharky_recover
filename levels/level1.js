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

function createEnemies() {
    return [
        new Jellyfisch('green', 500, 180),
        new Jellyfisch('yellow', 800, 260),

        new Pufferfisch('pink', 1500, 220),
        new Jellyfisch('lila', 1800, 140),

        new Pufferfisch('rose', 2300, 280),
        new Jellyfisch('green', 2600, 160),
        new Pufferfisch('green', 2950, 230),

        new Jellyfisch('pink', 3300, 180),
        new Pufferfisch('green', 3500, 260),

        new Endboss(),
    ];
}

function createCoins() {
    return [
        new Coin(260, 320),
        new Coin(340, 260),
        new Coin(420, 320),
        new Coin(1500, 300),
        new Coin(1580, 240),
        new Coin(1660, 210),
        new Coin(1740, 240),
        new Coin(1820, 300),
        new Coin(3180, 220),
        new Coin(3260, 250),
        new Coin(3340, 280),
        new Coin(3580, 340),
        new Coin(3660, 340),
        new Coin(3760, 260),
        new Coin(3820, 230),
        new Coin(3880, 260),
    ];
}

function createPoison() {
    return [
        new Poison(760, 340),
        new Poison(1380, 340),
        new Poison(2100, 320),
        new Poison(3220, 330),
        new Poison(3680, 330),
    ];
}

function createLights() {
    return [
        new Light('img/3.Background/Layers/1.Light/1.png', 0),
        new Light('img/3.Background/Layers/1.Light/2.png', 720),
    ];
}

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

function createBarriers() {
    let barrierTwo = new Barriers('img/3.Background/Barrier/2.png', 950, 150, 420, 320);
    barrierTwo.offset = { top: 45, left: 50, right: 40, bottom: 0 };
    return [
        barrierTwo,
        new Barriers('img/3.Background/Barrier/3.png', 3440, 10, 200, 240),
        ...createCaveBarrier(),
    ];
}

function createCaveBarrier() {
    let caveDeco = new Barriers('img/3.Background/Barrier/1.png', 2300, 0, 850, 480);
    caveDeco.offset = { top: 9999, left: 9999, right: 9999, bottom: 9999 };

    let caveTop = new Barriers('', 2300, 0, 850, 120);
    caveTop.offset = { top: 0, left: 30, right: 30, bottom: 10 };

    let caveBottom = new Barriers('', 2300, 360, 850, 120);
    caveBottom.offset = { top: 10, left: 30, right: 30, bottom: 0 };

    return [caveDeco, caveTop, caveBottom];
}