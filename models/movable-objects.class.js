/**
 * Represents movable game objects with collision and damage logic.
 */
class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    energy = 100;
    lastHit = 0;

    /**
     * Draws collision debug frames for movable objects.
     * @param {CanvasRenderingContext2D} ctx
     */    
    drawFrame(ctx) {
        if (!window.DEBUG) return;
        if(this instanceof Character || this instanceof Pufferfisch || this instanceof Jellyfisch || this instanceof Endboss || this instanceof Barriers || this instanceof Attack) {
            ctx.beginPath();
            ctx.strokeStyle = 'deepskyblue';
            ctx.lineWidth = 3;
            let offset = this.offset || { top: 0, left: 0, right: 0, bottom: 0 };
            ctx.rect(
            this.x + offset.left,
            this.y + offset.top,
            this.width - offset.left - offset.right,
            this.height - offset.top - offset.bottom
            );
            ctx.stroke();
        }
    }

    /**
     * Checks collision between two game objects.
     * @param {MovableObject} mo
     * @returns {boolean}
     */
    isColliding(mo) {
        const a = this.offset || { top: 0, left: 0, right: 0, bottom: 0 };
        const b = mo.offset || { top: 0, left: 0, right: 0, bottom: 0 };

        const ax = this.x + a.left;
        const ay = this.y + a.top;
        const aw = this.width - a.left - a.right;
        const ah = this.height - a.top - a.bottom;

        const bx = mo.x + b.left;
        const by = mo.y + b.top;
        const bw = mo.width - b.left - b.right;
        const bh = mo.height - b.top - b.bottom;

        return ax + aw > bx &&
                ay + ah > by &&
                ax < bx + bw &&
                ay < by + bh;
    }
    /**
     * Applies damage to the object.
     */
    hit() {
        this.energy -= 5;
        if (this.energy <= 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks whether the object is currently hurt.
     * @returns {boolean}
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;        
        return timePassed < 0.6;
    }

    /**
     * Checks whether the object has no energy left.
     * @returns {boolean}
     */
    isDead() {
        return this.energy === 0;
    }

}
