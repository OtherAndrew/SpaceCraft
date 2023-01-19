
class Player {
    constructor(game, x, y) {
        this.game = game;
        this.tag = "player";
        this.scale = 0.25;
        this.width = 200 * this.scale;
        this.height = 200 * this.scale;
        this.x = x;
        this.y = y;
        this.components = [
            new CSprite(
                ASSET_MANAGER.getAsset("./assets/sprites/player.png"),
                200,
                250,
                0.25,
                30
            ),
            new CTransform({
                x: this.x,
                y: this.y,
                velocityX: 0,
                velocityY: 0,
                rotation: 0,
            }),
            new CBoxCollider({
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height
            }),
            new CRigidBody(1),
            new CInput()
        ];
    };

    update() {
        this.x += this.components.transform.velocityX * this.game.clockTick;
    }
    draw(ctx) {
        //use this.face to switch side.
        this.animations[0].drawFrame(this.game.clockTick, ctx, this.x ,this.y, 1);
    }
}