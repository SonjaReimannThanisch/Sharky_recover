class Barriers extends MovableObject {

  constructor(imagePath, x, y, width, height) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.offset = { top: 20, left: 20, right: 20, bottom: 20 };
  }
}