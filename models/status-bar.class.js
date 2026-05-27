/**
 * Represents a HUD status bar for life, coins or poison.
 */
class StatusBar extends DrawableObject {
    percentage = 100;
    images = [];

    IMAGES_STATUS_LIFE = [
        'img/4.Marcadores/green/Life/0_copia.png',
        'img/4.Marcadores/green/Life/20_copia.png',
        'img/4.Marcadores/green/Life/40_copia.png',
        'img/4.Marcadores/green/Life/60_copia.png',
        'img/4.Marcadores/green/Life/80_copia.png',
        'img/4.Marcadores/green/Life/100_copia.png',
    ];

    IMAGES_STATUS_COINS = [
        'img/4.Marcadores/green/Coin/0_copia4.png',
        'img/4.Marcadores/green/Coin/20_copia2.png',
        'img/4.Marcadores/green/Coin/40_copia4.png',
        'img/4.Marcadores/green/Coin/60_copia4.png',
        'img/4.Marcadores/green/Coin/80_copia4.png',
        'img/4.Marcadores/green/Coin/100_copia4.png',
    ];

    IMAGES_STATUS_POISON = [
        'img/4.Marcadores/green/poisoned bubbles/0_copia2.png',
        'img/4.Marcadores/green/poisoned bubbles/20_copia3.png',
        'img/4.Marcadores/green/poisoned bubbles/40_copia2.png',
        'img/4.Marcadores/green/poisoned bubbles/60_copia2.png',
        'img/4.Marcadores/green/poisoned bubbles/80_copia2.png',
        'img/4.Marcadores/green/poisoned bubbles/100_copia3.png',
    ];

    IMAGES_STATUS_BOSS = [
        'img/4.Marcadores/orange/0_ copia_h (1).png',
        'img/4.Marcadores/orange/20_ copia_h (2).png',
        'img/4.Marcadores/orange/40_ copia_h (3).png',
        'img/4.Marcadores/orange/60_ copia_h (4).png',
        'img/4.Marcadores/orange/80_ copia_h (5).png',
        'img/4.Marcadores/orange/100_ copia_h (6).png',
    ];

    /**
     * Creates a status bar of the given type.
     * @param {string} type
     */
    constructor(type = 'life') {
        super();
        this.images =
            type === 'coins' ? this.IMAGES_STATUS_COINS :
            type === 'poison' ? this.IMAGES_STATUS_POISON :
            type === 'boss' ? this.IMAGES_STATUS_BOSS :
            this.IMAGES_STATUS_LIFE;

        this.loadImages(this.images);

        this.x = 40;
        this.y = 0;
        this.width = 180;
        this.height = 50;

        const start = (type === 'life' || type === 'boss') ? 100 : 0;
        this.setPercentage(start);
    }

    /**
     * Updates the displayed percentage of the status bar.
     * @param {number} percentage
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        let path = this.images[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the correct image index for the current percentage.
     * @returns {number}
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80)  return 4;
        if (this.percentage >= 60)  return 3;
        if (this.percentage >= 40)  return 2;
        if (this.percentage >= 20)  return 1;
        return 0;
    }

}
