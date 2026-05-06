class World {
    mainCharacter = new Character();
    level;
    canvas;
    ctx;
    sound;
    keyboard;
    camera_x = 0;
    statusLife;
    statusCoins;
    statusPoison;
    hasPlayerMoved = false;
    attacks = [];
    lastFinSlapAt = 0;
    lastBubbleAt = 0;
    finSlapCooldowns  = 400;
    bubbleCooldowns = 900;
    lastX = 0;
    lastY = 0;
    isGameOver = false;
    hasWon = false;
    TILE_WIDTH = 720;
    enemyCollisionInterval = null;
    hasStarted = false;
    bossTriggerX = 3800;
    bossFightStarted = false;
    bubbles = [];

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.combat = new CombatWorld(this);
        this.ui = new WorldUiManager(this);
        this.collision = new WorldCollisionManager(this);
        this.collectibles = new WorldCollectibleManager(this);
        this.keyboard = keyboard;
        this.level = createLevel1();
        this.sound = new SoundManager();
        this.initHud();
        this.initUi();
        this.initWorldState();
        this.draw();
    }

    initHud() {
        this.keyboardSprite = new Keyboard(this.canvas.width, this.canvas.height);
        this.statusLife = new StatusBar('life');
        this.statusCoins = new StatusBar('coins');
        this.statusPoison = new StatusBar('poison');
        this.statusLife.y = 45;
        this.statusCoins.y = 80;
        this.statusPoison.y = 10;
    }

    updateCollectibles() {
        this.collectibles.checkCoinCollision();
        this.collectibles.checkPoisonCollision();
    }

    initUi() {
        this.ui.bindUi();
        this.winScreen = new WinScreen(this.canvas.width, this.canvas.height);
    }

    initWorldState() {
        this.setWorld();
        this.setWorldForLevelObjects();
    }

    startGame() {
        if (this.hasStarted) return;
        this.hasStarted = true;
        this.sound.stopAllMusic();
        this.sound.playMusic();
        this.mainCharacter.animate();
        this.collision.checkCollisions();
    }

    setWorld() {
        this.mainCharacter.world = this;
    }

    triggerGameOverIfDead() {
        if (this.mainCharacter.energy <= 0 && !this.isGameOver) {
            this.isGameOver = true;
            this.sound.stopAllSounds();
            this.sound.stopAllMusic();
            this.attacks = [];
            this.sound.playSound('gameover');
            this.ui.handleGameOver();
        }
    }

    applyDamage(amount = 5, type = 'poison', cause = '') {
        this.mainCharacter.setDamageType(type);
        this.mainCharacter.deathCause = cause;
        this.reduceCharacterEnergy(amount);
        this.statusLife.setPercentage(this.mainCharacter.energy);
        if (this.mainCharacter.energy <= 0) {
        this.triggerGameOverIfDead();
        return;
        }
        this.playDamageSound(type);
        // this.triggerGameOverIfDead();
    }

    playDamageSound(type) {
        if (type === 'electro') {
            this.sound.playSound('electroHit');
            return;
        }
        if (type === 'barrier') {
            this.sound.playSound('barrier');
            return;
        }
        this.sound.playSound('hit');
    }

    reduceCharacterEnergy(amount) {
        this.mainCharacter.energy -= amount;
        if (this.mainCharacter.energy < 0) {
            this.mainCharacter.energy = 0;
            return;
        }
        this.mainCharacter.lastHit = new Date().getTime();
    }

    getEndboss() {
        return this.level.enemies.find(e => e instanceof Endboss);
    }

    isPressingIntoBarrier() {
        return this.keyboard.LEFT || this.keyboard.RIGHT || this.keyboard.UP || this.keyboard.DOWN;
    }

    updateBackground() {
        let w = this.TILE_WIDTH;
        let groups = [
            this.level.background.slice(0, 2),
            this.level.background.slice(2, 4),
            this.level.background.slice(4, 6),
        ];
        let leftEdge = -this.camera_x;
        let rightEdge = leftEdge + w;
        groups.forEach(g => { g.forEach(bg => {
            if (bg.x + w < leftEdge) bg.x += w * g.length
            if (bg.x > rightEdge) bg.x -= w * g.length;
            });
        });
    }

    updateLights() {
        let w = this.TILE_WIDTH;
        let leftEdge = -this.camera_x;
        let rightEdge = leftEdge + w;
        let t = performance.now() / 1000;
        this.level.lights.forEach(light => {
            light.update(t);
            if (light.x + w < leftEdge) light.x += w * this.level.lights.length;
            if (light.x > rightEdge)    light.x -= w * this.level.lights.length;
        });
    }

    isRunningGame() {
        return this.hasStarted && !this.isGameOver;
    }

    setWorldForLevelObjects() {
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    draw() {
        this.beginFrame();
        if (this.isRunningGame()) this.updateWorldState();
        this.drawWorldLayer();
        this.drawHudLayer();
        this.endFrame();
    }

    beginFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.camera_x = Math.min(0, -this.mainCharacter.x);
    }

    updateWorldState() {
        let now = Date.now();
        this.updateEnvironment();
        this.updateCollectibles();
        this.updateMenuState();
        this.updateEnemies();
        this.updateBossFight();
        this.updateCombat(now);
    }

    updateEnvironment() {
        this.updateBackground();
        this.updateLights();
        this.collision.checkBarrierCollision();
    }

    updateMenuState() {
        this.checkMenuInput();
    }

    updateEnemies() {
        this.removeDeadEnemies();
    }

    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(e => !e.markedForDeletion);
    }

    updateBossFight() {
        this.checkEndbossTrigger();
        this.handleBossState();
    }

    updateCombat(now) {
        this.combat.update(now);
        this.handleAttackInput(now);
    }

    drawWorldLayer() {
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.background);
        this.addObjectsToMap(this.level.barriers);
        this.addObjectsToMap(this.level.lights);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.poison);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.mainCharacter);
        this.addObjectsToMap(this.attacks);
        this.ctx.translate(-this.camera_x, 0);
    }

    drawHudLayer() {
        this.addToMap(this.statusLife);
        this.addToMap(this.statusCoins);
        this.addToMap(this.statusPoison);
        this.ui.drawHudWonLayer();
    }

    endFrame() {
        requestAnimationFrame(this.draw.bind(this));
    }

    restartGame() {
        this.ui.hideGameOver();
        this.resetWorldState();
        this.hasStarted = true;
        this.sound.stopAllMusic();
        this.sound.playMusic();
        this.mainCharacter.animate();
        this.collision.checkCollisions();
    }

    resetWorldState() {
        this.resetIntervals();
        this.resetFlags();
        this.resetCollections();
        this.resetLevelState();
        this.resetHudState();
        this.resetWinState();  
    }
    
    resetIntervals() {
        clearInterval(this.enemyCollisionInterval);
        this.enemyCollisionInterval = null;
    }

    resetFlags() {
        this.hasPlayerMoved = false;
        this.bossFightStarted = false;
        this.isGameOver = false;
        this.hasStarted = false;
        this.hasWon = false;
    }

    resetCollections() {
        this.attacks = [];
        this.bubbles = [];
        this.lastFinSlapAt = 0;
        this.lastBubbleAt = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.camera_x = 0;
    }

    resetLevelState() {
        this.level = createLevel1();
        this.mainCharacter = new Character();
        this.setWorld();
        this.setWorldForLevelObjects();
    }

    resetHudState() {
        this.statusLife.setPercentage(this.mainCharacter.energy);
        this.statusCoins.setPercentage(0);
        this.statusPoison.setPercentage(0);
    }

    resetWinState() {
        this.winScreen = new WinScreen(this.canvas.width, this.canvas.height);
    }

    handleBossState() {
        if (!this.bossFightStarted) return;
        let boss = this.getEndboss();
        if (!boss) return;
        boss.update();
        if (boss.isDead && !this.hasWon) {
            this.hasWon = true;
            this.sound.stopAllMusic();
            this.sound.stopAllSounds();
            this.sound.playSound('winning');
        }
    }

    handleAttackInput(now) {
        if (!this.hasStarted || this.isGameOver) return;
        if (this.keyboard.SPACE) this.tryFinSlap(now);
        if (this.keyboard.D) this.tryBubble(now);
    }

    tryFinSlap(now) {
        if (now - this.lastFinSlapAt < this.finSlapCooldowns ) return;
        let activeFinSlap = this.attacks.some(a => a instanceof FinSlapAttack);
        if (activeFinSlap) return;
        this.mainCharacter.startFinSlapAttackAnimation();
        this.sound.playSound('finSlapAttack');
        let attack = new FinSlapAttack(this.mainCharacter);
        this.attacks.push(attack);
        this.lastFinSlapAt = now;
    }

    tryBubble(now) {
        if (now - this.lastBubbleAt < this.bubbleCooldowns) return;
        let type = 'normal';
        let boss = this.getEndboss();
        if (boss && boss.isActive) {
            type = 'poison';
        }
        this.sound.playSound('bubbleAttack');
        this.mainCharacter.startBubbleAttackAnimation(type);
        setTimeout(() => {
            if (this.isGameOver) return;
            this.attacks.push(new BubbleTrapAttack(this.mainCharacter, type));
        }, 500);
        this.lastBubbleAt = now;
    }

    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(mo) {
        const prevAlpha = this.ctx.globalAlpha;
        if (mo.alpha !== undefined) this.ctx.globalAlpha = mo.alpha;
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (mo.drawFrame) mo.drawFrame(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
        this.ctx.globalAlpha = prevAlpha;
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    goHome() {
        this.sound.stopAllMusic();
        this.sound.playMenu();
        this.ui.hideGameOver();
        this.resetWorldState();
        document.getElementById('startscreen')?.classList.remove('hidden');
    }

    checkMenuInput() {
        if (!this.keyboard.ESC) return;
        if (document.fullscreenElement) return;
        this.goHome();
        this.keyboard.ESC = false;
    }

    checkEndbossTrigger() {
        if ( this.bossFightStarted) return;
        let boss = this.getEndboss();
        if (!boss) return;
        if (this.mainCharacter.x >=this.bossTriggerX) {
            this.bossFightStarted = true;
            boss.startIntro();
        }
    }
}