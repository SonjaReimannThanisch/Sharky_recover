class movableObject extends drawableObject {
    speed = 0.15;
    otherDirection = false;
    energy = 100;
    lastHit = 0;

    
    drawFrame(ctx) {
        if (!window.DEBUG) return;
        if(this instanceof character || this instanceof pufferfisch || this instanceof jellyfisch || this instanceof Endboss || this instanceof barriers || this instanceof Attack) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'blue';
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

    hit() {
        this.energy -= 5;
        if (this.energy <= 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;        
        return timePassed < 0.6;
    }

    isDead() {
        return this.energy === 0;
    }

}
