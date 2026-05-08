/**
 * Handles background, light and environment updates.
 */
class WorldEnvironmentManager {
    
    /**
     * Creates the environment manager for the game world.
     * @param {World} world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Updates all environment systems.
     */
    update() {
        this.updateBackground();
        this.updateLights();
        this.world.collision.checkBarrierCollision();
    }

    /**
     * Updates repeating background layer positions.
     */
    updateBackground() {
        let w = this.world.TILE_WIDTH;
        let groups = [
            this.world.level.background.slice(0, 2),
            this.world.level.background.slice(2, 4),
            this.world.level.background.slice(4, 6),
        ];
        let leftEdge = -this.world.camera_x;
        let rightEdge = leftEdge + w;
        groups.forEach(g => g.forEach(bg => {
            if (bg.x + w < leftEdge) bg.x += w * g.length;
            if (bg.x > rightEdge) bg.x -= w * g.length;
        }));
    }

    /**
     * Updates animated light layers.
     */
    updateLights() {
        let w = this.world.TILE_WIDTH;
        let leftEdge = -this.world.camera_x;
        let rightEdge = leftEdge + w;
        let t = performance.now() / 1000;
        this.world.level.lights.forEach(light => {
            light.update(t);
            if (light.x + w < leftEdge) light.x += w * this.world.level.lights.length;
            if (light.x > rightEdge) light.x -= w * this.world.level.lights.length;
        });
    }
}