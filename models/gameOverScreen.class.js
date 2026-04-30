class GameOverScreen extends drawableObject {

    IMAGES_GAMEOVER = [
        'img/6.Botones/Tittles/Game Over/Recurso 11.png',
    ];

    IMAGES_TRYAGAIN = [
        'img/6.Botones/Try again/Recurso 15.png',
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES_GAMEOVER[0]);
        this.loadImage(this.IMAGES_TRYAGAIN[0]);
        this.x = 40;
        this.y = 0;
        this.width = 180;
        this.height = 50;
    }

}