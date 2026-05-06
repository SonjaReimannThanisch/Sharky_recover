class Barriers extends MovableObject {

  constructor(imagePath, x, y, width, height) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.offset = {
      top: 35,
      left: 10,
      right: 25,
      bottom: 20,
    };
  }
}