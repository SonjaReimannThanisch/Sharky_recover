class WorldUiManager {

        constructor(world) {
        this.world = world;
    }

    showGameOver() {
        this.world.sound.stopAllMusic();
        this.world.sound.stopAllSounds();
        this.freezeBossForGameOver();
        this.lockCameraOnPlayer();
        document.getElementById('gameover')?.classList.remove('hidden');
    }

    hideGameOver() {
        document.getElementById('gameover')?.classList.add('hidden');
    }

    freezeBossForGameOver() {
        let boss = this.world.getEndboss();
        if (!boss) return;
        boss.isAttacking = false;
    }

    lockCameraOnPlayer() {
        this.world.camera_x = -this.world.mainCharacter.x;
    }

    bindUi() {
        let restartBtn = document.getElementById('btn-restart');
        if (restartBtn) {
            restartBtn.onclick = () => this.world.restartGame();
        }
        let homeBtn  = document.getElementById('btn-home');
        if (homeBtn ) {
            homeBtn .onclick = () => this.world.goHome();
        }
    }

    drawHudWonLayer() {
        if (!this.world.hasWon) return;
        this.world.ctx.save();
        let overlayAlpha = Math.min(this.world.winScreen.alpha, 0.9);
        this.world.ctx.globalAlpha = overlayAlpha;
        this.world.ctx.fillStyle = "rgba(10, 3, 37, 0.75)";
        this.world.ctx.fillRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        this.world.ctx.restore();
        if (this.world.winScreen.alpha < 1) {
            this.world.winScreen.alpha += 0.02;
        }
        this.world.addToMap(this.world.winScreen);
    }

    handleGameOver() {
        if (this.isBossDeath()) {
            this.playBossDeath();
            return;
        }
        this.playNormalDeath();
    }

    isBossDeath() {
        return this.world.mainCharacter.deathCause === 'boss';
    }

    playBossDeath() {
        this.world.mainCharacter.isCinematicDead = true;
        setTimeout(() => this.showGameOver(), 1500);
    }

    playNormalDeath() {
        this.showGameOver();
        this.world.sound.playSound('characterDeath');
    }
}