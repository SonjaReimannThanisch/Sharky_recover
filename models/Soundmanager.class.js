/**
 * Handles game music and sound effects.
 */
class SoundManager {
    currentTrack = 'menu';

    /**
     * Creates the sound manager and loads audio assets.
     */
    constructor() {
        this.isMuted = localStorage.getItem('muted') === 'true';
        this.sounds = {
            swim: new Audio('assets/soundeffects/character/swim-main-nice.mp3'),
            sleep: new Audio('assets/soundeffects/character/snoring.mp3'),
            bubbleAttack: new Audio('assets/soundeffects/attacks/bubble-rise.mp3'),
            finSlapAttack: new Audio('assets/soundeffects/attacks/fin-slap.mp3'),
            hit: new Audio('assets/soundeffects/character/hit-normal.mp3'),
            electroHit: new Audio('assets/soundeffects/character/hit-electro.mp3'),
            gameover: new Audio('assets/soundeffects/ui/game-over.mp3'),
            winning: new Audio('assets/soundeffects/ui/win.mp3'),
            barrier: new Audio('assets/soundeffects/ui/barrier-thud.mp3'),
            itemsSelect: new Audio('assets/soundeffects/ui/item-select.mp3'),
            collectCoin: new Audio('assets/soundeffects/collect/collect-coin.mp3'),
            collectBottle: new Audio('assets/soundeffects/collect/collect-bottle.mp3'),
            characterDeath: new Audio('assets/soundeffects/character/character-death.mp3'),
            endbossIntro: new Audio('assets/soundeffects/endboss/endboss-introduction.mp3'),
            endbossAttack: new Audio('assets/soundeffects/environment/endboss-attack.mp3'),
            endbossDeath: new Audio('assets/soundeffects/environment/endboss-death.mp3'),
            endbossHurt: new Audio('assets/soundeffects/environment/endboss-hurt.mp3'),
        }
        this.menuMusic = new Audio('assets/background-music/waterBackground.mp3');
        this.music = new Audio('assets/background-music/musicword-bubbles-309433.mp3');
        this.setupMusic();
        this.setupVolume();
    }

    /**
     * Configures music loop settings.
     */
    setupMusic() {
        this.music.loop = true;
        this.menuMusic.loop = true;
        this.menuMusic.playbackRate = 1.4;
    }

    /**
     * Configures default audio volumes.
     */
    setupVolume() {
        this.music.volume = 0.2;
        this.menuMusic.volume = 0.2;
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.4;
        });
    }

    /**
     * Plays a sound effect by name.
     * @param {string} name
     */
    playSound(name) {
        if (this.isMuted) return;
        let sound = this.sounds[name];
        if (!sound) return;
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    /**
     * Starts the menu background music.
     */
    playMenu() {
        if (this.isMuted) return;
        this.currentTrack = 'menu';
        this.music.pause();
        this.menuMusic.currentTime = 0;
        this.menuMusic.play().catch(() => {});
    }

    /**
     * Starts the in-game background music.
     */
    playMusic() {
        if (this.isMuted) return;
        this.currentTrack = 'game';
        this.menuMusic.pause();
        this.music.currentTime = 0;
        this.music.play().catch(() => {});
    }

    /**
     * Toggles mute state for all audio.
     */
    toggleMusic() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('muted', this.isMuted);
        if (this.isMuted) {
            this.stopAllMusic();
            this.stopAllSounds();
            return;
        }
        this.resumeCurrentTrack();
    }

    /**
     * Resumes the currently active music track.
     */
    resumeCurrentTrack() {
        if (this.currentTrack === 'menu') {
            this.menuMusic.play().catch(() => {});
        } else {
            this.music.play().catch(() => {});
        }
    }

    /**
     * Stops a specific sound effect.
     * @param {string} name
     */
    stopSound(name) {
        let sound = this.sounds[name];
        if (!sound) return;
        sound.pause();
        sound.currentTime = 0;
    }
    
    /**
     * Stops all sound effects.
     */
    stopAllSounds() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    /**
     * Stops all music tracks.
     */
    stopAllMusic() {
        this.music.pause();
        this.menuMusic.pause();
    }
}