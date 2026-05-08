/**
 * Represents the main game world and gameplay loop.
 */
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

    /**
     * Creates the game world and initializes all gameplay systems.
     * @param {HTMLCanvasElement} canvas
     * @param {Keyboard} keyboard
     */
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

    /**
     * Initializes all HUD elements.
     */
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

    /**
     * Initializes all UI systems.
     */
    initUi() {
        this.ui.bindUi();
        this.winScreen = new WinScreen(this.canvas.width, this.canvas.height);
    }

    /**
     * Initializes world references and level objects.
     */
    initWorldState() {
        this.setWorld();
        this.setWorldForLevelObjects();
    }

    /**
     * Starts the gameplay systems and collision checks.
     */
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

    /**
     * Triggers the game over state if the player died.
     */
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

    /**
     * Applies damage to the player character.
     * @param {number} amount
     * @param {string} type
     * @param {string} cause
     */
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
    }

    /**
     * Plays the correct damage sound effect.
     * @param {string} type
     */
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

    /**
     * Reduces the player energy value.
     * @param {number} amount
     */
    reduceCharacterEnergy(amount) {
        this.mainCharacter.energy = Math.max(
            0,
            this.mainCharacter.energy - amount
        );
        this.mainCharacter.lastHit = new Date().getTime();
    }

    /**
     * Gets the current endboss instance.
     * @returns {Endboss}
     */
    getEndboss() {
        return this.level.enemies.find(e => e instanceof Endboss);
    }

    isPressingIntoBarrier() {
        return this.keyboard.LEFT || this.keyboard.RIGHT || this.keyboard.UP || this.keyboard.DOWN;
    }

    /**
     * Updates looping background positions.
     */
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

    /**
     * Updates animated light layers.
     */
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

    /**
     * Checks whether gameplay is currently active.
     * @returns {boolean}
     */
    isRunningGame() {
        return this.hasStarted && !this.isGameOver && !this.hasWon;
    }

    setWorldForLevelObjects() {
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    /**
     * Starts the main render loop.
     */
    draw() {
        this.beginFrame();
        if (this.isRunningGame()) this.updateWorldState();
        this.drawWorldLayer();
        this.drawHudLayer();
        this.endFrame();
    }

    beginFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.isRunningGame() && !this.hasWon) {
            this.camera_x = Math.min(0, -this.mainCharacter.x);
        }
    }

    /**
     * Updates all active gameplay systems.
     */
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
        this.combat.handleAttackInput(now);
    }

    /**
     * Draws all world objects.
     */
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

    /**
     * Draws all HUD elements.
     */
    drawHudLayer() {
        this.addToMap(this.statusLife);
        this.addToMap(this.statusCoins);
        this.addToMap(this.statusPoison);
        this.ui.drawHudWonLayer();
    }

    endFrame() {
        requestAnimationFrame(this.draw.bind(this));
    }

    /**
     * Restarts the current game state.
     */
    restartGame() {
        this.ui.hideGameOver();
        this.ui.hideWinScreen();
        this.resetWorldState();
        this.hasStarted = true;
        this.sound.stopAllMusic();
        this.sound.playMusic();
        this.mainCharacter.animate();
        this.collision.checkCollisions();
    }

    /**
     * Resets all gameplay state values.
     */
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

    /**
     * Handles active boss fight behavior.
     */
    handleBossState() {
        if (!this.bossFightStarted) return;
        let boss = this.getEndboss();
        if (!boss) return;
        boss.update();
        if (boss.isDead && !this.hasWon) {
            this.hasWon = true;
            this.ui.showWinScreen();
            this.sound.stopAllMusic();
            this.sound.stopAllSounds();
            this.sound.playSound('winning');
        }
    }

    /**
     * Adds multiple objects to the render pipeline.
     * @param {Array} objects
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Draws a single object on the canvas.
     * @param {DrawableObject} mo
     */
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

    /**
     * Returns the player to the start screen.
     */
    goHome() {
        this.sound.stopAllMusic();
        this.sound.playMenu();
        this.ui.hideGameOver();
         this.ui.hideWinScreen();
        this.resetWorldState();
        document.getElementById('startscreen')?.classList.remove('hidden');
    }

    /**
     * Handles menu input actions.
     */
    checkMenuInput() {
        if (!this.keyboard.ESC) return;
        if (document.fullscreenElement) return;
        this.goHome();
        this.keyboard.ESC = false;
    }

    /**
     * Starts the boss fight when the trigger area is reached.
     */
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