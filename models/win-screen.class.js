/**
 * Represents the win screen overlay graphics.
 */
class WinScreen extends DrawableObject {
    alpha = 0;

    IMAGES_WIN = [
        'img/6.Botones/Tittles/You win/Mesa de trabajo 1.png',
    ];

    IMAGES_YOUWIN = [
        'img/6.Botones/Tittles/You win/Recurso 19.png',
        'img/6.Botones/Tittles/You win/Recurso 20.png',
        'img/6.Botones/Tittles/You win/Recurso 21.png',
        'img/6.Botones/Tittles/You win/Recurso 22.png',
    ];

    /**
     * Creates the win screen overlay.
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     */
    constructor(canvasWidth, canvasHeight) {
        super();
        this.loadImage(this.IMAGES_WIN[0]);
        this.width =720;
        this.height = 480;
        this.x = (canvasWidth - this.width) / 2;
        this.y = (canvasHeight - this.height) / 2;
    }
}