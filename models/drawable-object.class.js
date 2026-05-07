
/**
 * Base class for drawable game objects with image loading and animation support.
 */
class DrawableObject {
    x = 10;
    y = 280;
    width = 150;
    height = 150;
    img;
    currentImage = 0
    imageCache = {};

    /**
     * Loads a single image for the object.
     * @param {string} path
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object on the canvas.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (!this.img) return;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Preloads multiple animation images into the image cache.
     * @param {string[]} arr
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Plays the next frame of an animation sequence.
     * @param {string[]} images
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

}