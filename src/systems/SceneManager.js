class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;

        // create entities to load into game
    };

    // load entities into game
    load() {

    };

    update() {

    };

    draw(ctx) {
        // draw stuff in view (placeholder)
        ctx.drawImage(ASSET_MANAGER.getAsset("./testimages/bg.png"), 0, 0);
    };
}