class drawableObject {
    x = 10;
    y = 280;
    width = 150;
    height = 150;
    img;
    currentImage = 0
    imageCache = {};

loadImage(path) {
    this.img = new Image();
    this.img.src = path;
}

    draw(ctx) {
        if (!this.img) return;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

}