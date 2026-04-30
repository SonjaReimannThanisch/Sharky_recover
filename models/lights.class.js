class Light extends movableObject {
  y = 0;
  width = 720;
  height = 480;
  baseAlpha = 0.55;
  pulseAmp = 0.1;
  pulseSpeed = 2.5;
  baseY = 0;
  wobbleAmp = 2;
  wobbleSpeed = 2;

  phase = Math.random() * Math.PI * 2;

  constructor(imagePath, x = 0) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.baseY = this.y;
  }

  update(t) {
    this.alpha = this.baseAlpha + this.pulseAmp * Math.sin(t * this.pulseSpeed + this.phase);
    this.y = this.baseY + this.wobbleAmp * Math.sin(t * this.wobbleSpeed + this.phase);
  }
}