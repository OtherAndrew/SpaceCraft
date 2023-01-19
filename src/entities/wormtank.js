class WormTank {
    constructor(game) {
        //this.game = game;
        this.speed = 35; //base travel speed 25
        this.x = 350;
        this.y = 0;
        this.face = 1;  //0 face right, 1 face left

        Object.assign(this, {game});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/wormtank25f.png");
        this.animations = []
        //spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
        this.animations.push(new Animator(this.spritesheet, 0,40,40, 26, 6, .05, 1));
        this.animations.push(new Animator(this.spritesheet, 0,6,40, 26, 6, .05, 1));
    }

    update() {
        if (this.face == 0) {
            this.x += this.speed * this.game.clockTick;
        } else {
            this.x -= this.speed * this.game.clockTick;
        }
    }
    draw(ctx) {
        //use this.face to switch side.
        if (this.face == 0) {
            this.animations[0].drawFrame(this.game.clockTick, ctx, this.x,this.y, 2.2);
        } else {
            this.animations[1].drawFrame(this.game.clockTick, ctx, this.x,this.y, 2.2);
        }

    }
}