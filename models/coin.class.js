class coin extends drawableObject {
    height = 60;
    width = 60;

    constructor(x, y) {
        super();
        this.loadImage('img/4.Marcadores/1. Coins/4.png');
        this.x = x;
        this.y = y;
    }
}