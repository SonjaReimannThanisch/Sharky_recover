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
        new Pufferfisch('pink'),
        new Pufferfisch('pink'),
        new Pufferfisch('pink'),
        new Pufferfisch('rose'),
        new Pufferfisch('rose'),
        new Pufferfisch('rose'),
        new Pufferfisch('green'),
        new Pufferfisch('green'),
        new Pufferfisch('green'),

        new Jellyfisch('lila'),
        new Jellyfisch('lila'),
        new Jellyfisch('lila'),
        new Jellyfisch('yellow'),
        new Jellyfisch('yellow'),
        new Jellyfisch('yellow'),

        new Jellyfisch('green'),
        new Jellyfisch('green'),
        new Jellyfisch('green'),
        new Jellyfisch('green'),

        new Jellyfisch('pink'),
        new Jellyfisch('pink'),
        new Jellyfisch('pink'),
        new Jellyfisch('pink'),

        new Endboss(),
    ];
}

function createCoins() {
    return [
        new Coin(240, 320),
        new Coin(280, 260),
        new Coin(340, 220),
        new Coin(420, 220),
        new Coin(480, 260),
        new Coin(520, 320),
    ];
}

function createPoison() {
    return [
        new Poison(290, 350),
        new Poison(350, 350),
        new Poison(410, 350),
        new Poison(470, 350),
        new Poison(530, 350),
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
    return [
        new Barriers('img/3.Background/Barrier/2.png', 1630, 200, 600, 280),
        new Barriers('img/3.Background/Barrier/3.png', 3440, 10, 200, 240),
        ...createCaveBarrier(),
    ];
}

function createCaveBarrier() {
    let caveDeco = new Barriers('img/3.Background/Barrier/1.png', 2540, 0, 850, 480);
    caveDeco.offset = { top: 9999, left: 9999, right: 9999, bottom: 9999 };

    let caveTop = new Barriers('', 2540, 0, 850, 140);
    caveTop.offset = { top: 0, left: 0, right: 0, bottom: 0 };

    let caveBottom = new Barriers('', 2540, 340, 850, 140);
    caveBottom.offset = { top: 0, left: 0, right: 0, bottom: 0 };

    return [caveDeco, caveTop, caveBottom];
}