/**
 * Represents the whale endboss enemy.
 */
class Endboss extends MovableObject {
    height = 600;
    width = 600;
    energy = 100;
    finalX = 4400;
    finalY = -100;
    introSpeedY = 6;
    isAwakened = false;
    isIntroducing = false;
    isActive = false;
    _isHurt = false;
    isAttacking = false;
    attackCooldown = 1800;
    attackDuration= 1200;
    attackSpeed = 3;
    lastAttackAt = 8;
    attackDirection = 1;
    isDead = false;
    damage = 35;
    damageType = 'poison';

    offset = {
        top: 180,
        left: 45,
        right: 45,
        bottom: 70,
    }

    /**
     * Creates the endboss and loads all animations.
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {
        super().loadImage('img/2.Enemy/3 Final Enemy/1.Introduce/1.png');
        this.images = window.ENDBOSS_IMAGES;
        this.x = this.finalX;
        this.y = -520;
        this.loadAllImages();
    }

    /**
     * Loads all endboss animation images.
     */
    loadAllImages() {
        this.loadImages(this.images.INTRO);
        this.loadImages(this.images.IDLE);
        this.loadImages(this.images.ATTACK);
        this.loadImages(this.images.HURT);
        this.loadImages(this.images.DEAD);
    }

    /**
     * Starts the endboss intro sequence.
     */
    startIntro() {
        if (this.isAwakened) return;
        this.world.sound.playSound('endbossIntro');
        this.isAwakened = true;
        this.isIntroducing = true;
        this.isHurt = false;
        this.startAnimationLoop();
    }

    /**
     * Updates endboss movement and attack behavior.
     */
    update() {
        if (this.handleIntro())return;
        if (!this.canUpdate()) return;
        let now = Date.now();
        this.keepInFightArea();
        this.tryStartAttack(now);
        this.updateAttack(now);
    }

    /**
     * Handles the intro animation movement.
     * @returns {boolean}
     */
    handleIntro() {
        if (!this.isIntroducing) return false;
        this.y += this.introSpeedY;
        if (this.y >= this.finalY) {
            this.endbossIntro();
        }
        return true;
    }

    /**
     * Finishes the intro phase and activates the boss fight.
     */
    endbossIntro() {
        this.y = this.finalY;
        this.isIntroducing = false;
        this.isActive = true;
        this.lastAttackAt = Date.now() - this.attackCooldown;
    }

    /**
     * Checks whether the endboss can update.
     * @returns {boolean}
     */
    canUpdate() {
        return this.isActive && !this.isDead;
    }

    /**
     * Keeps the endboss inside the fight area.
     */
    keepInFightArea() {
        this.x = Math.max(3600, Math.min(this.x, 4550));
    }

    /**
     * Starts an attack if the cooldown expired.
     * @param {number} now
     */
    tryStartAttack(now) {
        if (this.isAttacking && !this._isHurt) return;
        if (now - this.lastAttackAt < this.attackCooldown) return;
        this.startAttack();
        
    }

    /**
     * Updates the active attack movement.
     * @param {number} now
     */
    updateAttack(now) {
        if (!this.isAttacking) return;
        let distanceToPlayer = this.getDistanceToPlayer();
        if (distanceToPlayer > 150) {
            this.x += this.attackDirection * this.attackSpeed;
        }
        if (now - this.attackStartedAt >= this.attackDuration || distanceToPlayer <= 80) {
            this.stopAttack();
        }
    }

    /**
     * Gets the horizontal distance to the player.
     * @returns {number}
     */
    getDistanceToPlayer() {
        let player = this.world.mainCharacter;
        let bossCenterX = this.x + this.width / 2;
        let playerCenterX = player.x + player.width / 2;

        return Math.abs(playerCenterX - bossCenterX);
    }

    /**
     * Starts the endboss attack sequence.
     */
    startAttack() {
        if (!this.world) return;
        let player = this.world.mainCharacter;
        let dy = player.y - this.y;
        this.y += dy * 0.02;
        let bossCenterX = this.x + this.width / 2;
        let playerCenterX = player.x + player.width / 2;
        this.attackDirection = playerCenterX < bossCenterX ? -1 : 1;
        this.otherDirection = this.attackDirection === 1;
        this.attackSpeed = 2;
        this.isAttacking= true;
        this.attackStartedAt = Date.now();
        this.world.sound.playSound('endbossAttack');
    }

    /**
     * Stops the current attack.
     */
    stopAttack() {
        this.isAttacking= false;
        this.lastAttackAt = Date.now();
    }

    /**
     * Starts the endboss animation loop.
     */
    startAnimationLoop() {
        if (this.animationInterval) return;

        this.animationInterval = setInterval(() => {
            if (this.isIntroducing) {
                this.playAnimation(this.images.INTRO);
            } else if (this.isActive && this._isHurt) {
                this.playAnimation(this.images.HURT);
            } else if (this.isActive && this.isAttacking) {
                this.playAnimation(this.images.ATTACK);
            } else if (this.isActive) {
                this.playAnimation(this.images.IDLE);
            } else if (!this.isActive && this.energy <= 0) {
                this.playAnimation(this.images.DEAD);
            }
        }, 200);
    }   

    /**
     * Checks whether the endboss can collide with the player.
     * @returns {boolean}
     */
    isCollidable() {
        return this.isActive;
    }

    /**
     * Applies damage to the endboss.
     * @param {string} type
     */
    hit(type = 'normal') {
        if (!this.isActive || this.isDead) return;
        this.takeDamage(type);
        this.startHurtState();
        this.world.sound.playSound('endbossHurt');
        if (this.isAttacking) {
            this.stopAttack();
        }
        if (this.energy <= 0) {
            this.die();
        }
    }

    /**
     * Calculates damage based on attack type.
     * @param {string} type
     */
    takeDamage(type) {
        this.energy -= type === 'poison' ? 20 : 5;
    }

    /**
     * Starts the temporary hurt animation state.
     */
    startHurtState() {
        this._isHurt = true;
        setTimeout(() => {
            this._isHurt = false;
        }, 300);
    }

    /**
     * Handles endboss death behavior.
     */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.isActive = false;
        this._isHurt = false;
        this.isAttacking = false;
        this.playAnimation(this.images.DEAD);
        this.world.sound.playSound('endbossDeath');
    }
}