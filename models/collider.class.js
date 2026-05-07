
/**
 * Represents an invisible rectangular collision area.
 */
class Collider extends DrawableObject {

  /**
   * Creates a collider with position and size.
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
