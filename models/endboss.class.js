class Endboss extends movableObject {
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
        top: 220,
        left: 35,
        right: 40,
        bottom: 80,
    }

    constructor(x, y) {
    
        super().loadImage('img/2.Enemy/3 Final Enemy/1.Introduce/1.png');
        this.images = window.ENDBOSS_IMAGES;
        this.x = this.finalX;
        this.y = -520;
        this.loadAllImages();
    }

    loadAllImages() {
        this.loadImages(this.images.INTRO);
        this.loadImages(this.images.IDLE);
        this.loadImages(this.images.ATTACK);
        this.loadImages(this.images.HURT);
        this.loadImages(this.images.DEAD);
    }

    startIntro() {
        if (this.isAwakened) return;
        this.world.sound.playSound('endbossIntro');
        this.isAwakened = true;
        this.isIntroducing = true;
        this.isHurt = false;
        this.startAnimationLoop();
    }

    update() {
        if (this.handleIntro())return;
        if (!this.canUpdate()) return;
        let now = Date.now();
        this.keepInFightArea();
        this.tryStartAttack(now);
        this.updateAttack(now);
    }

    handleIntro() {
        if (!this.isIntroducing) return false;
        this.y += this.introSpeedY;
        if (this.y >= this.finalY) {
            this.endbossIntro();
        }
        return true;
    }

    endbossIntro() {
        this.y = this.finalY;
        this.isIntroducing = false;
        this.isActive = true;
        this.lastAttackAt = Date.now() - this.attackCooldown;
    }

    canUpdate() {
        return this.isActive && !this.isDead;
    }

    keepInFightArea() {
        this.x = Math.max(3600, Math.min(this.x, 4550));
    }

    tryStartAttack(now) {
        if (this.isAttacking && !this._isHurt) return;
        if (now - this.lastAttackAt < this.attackCooldown) return;
        this.startAttack();
        
    }

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

    getDistanceToPlayer() {
        let player = this.world.mainCharacter;
        let bossCenterX = this.x + this.width / 2;
        let playerCenterX = player.x + player.width / 2;

        return Math.abs(playerCenterX - bossCenterX);
    }

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

    stopAttack() {
        this.isAttacking= false;
        this.lastAttackAt = Date.now();
    }

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

    isCollidable() {
        return this.isActive;
    }

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

    takeDamage(type) {
        this.energy -= type === 'poison' ? 20 : 5;
    }

    startHurtState() {
        this._isHurt = true;
        setTimeout(() => {
            this._isHurt = false;
        }, 300);
    }

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