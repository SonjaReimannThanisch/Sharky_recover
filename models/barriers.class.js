/**
 * Represents a barrier with a collision offset.
 */
class Barriers extends MovableObject {

  /**
 * Creates a barrier object with size, position and default collision offset.
 * @param {string} imagePath
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 */
  constructor(imagePath, x, y, width, height) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.offset = {
      top: 10,
      left: 40,
      right: 35,
      bottom: 25,
    };
  }
}