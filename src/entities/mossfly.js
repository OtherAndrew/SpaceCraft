class MossFly {
    constructor(game) {
        //this.game = game;
        this.speed = 70; //base travel speed 25
        this.x = 0;
        this.y = 0;
        this.face = 0;  //0 face right, 1 face left

        Object.assign(this, {game});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/mossfly25f.png");
        this.animations = []
        //spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
        this.animations.push(new Animator(this.spritesheet, 1,160,29, 32, 4, .05, 2));
        this.animations.push(new Animator(this.spritesheet, 1,121,29, 32, 4, .05, 2));
    }

    update() {
        if (this.face == 0) {
            this.x += this.speed * this.game.clockTick;
        } else {
            this.x -= this.speed * this.game.clockTick;
        }
    }
    draw(ctx) {

        if (this.face == 0) {
            this.animations[0].drawFrame(this.game.clockTick, ctx, this.x,this.y, 1);
        } else {
            this.animations[1].drawFrame(this.game.clockTick, ctx, this.x,this.y, 1);
        }


    }
}