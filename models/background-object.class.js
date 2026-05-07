/**
 * Represents a static background layer object.
 */
class BackgroundObject extends DrawableObject {

  width = 720;
  height = 480;

  /**
 * Creates a background object at the given x position.
 * @param {string} imagePath
 * @param {number} x
 */
  constructor(imagePath, x) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }

}


