class Wasp {
    constructor(game) {
        //this.game = game;
        this.speed = 70; //base travel speed 25
        this.x = 500;
        this.y = 0;
        this.face = 1;  //0 face right, 1 face left
        this.dead = false;
        this.deadCounter = 0;
        Object.assign(this, {game});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/wasp50f.png");
        this.animations = []
        //spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
        //fly right
        this.animations.push(new Animator(this.spritesheet, 2,60,41, 44, 4, .05, 2));
        //fly left
        this.animations.push(new Animator(this.spritesheet, 2,11,41, 44, 4, .08, 2));
        //death
        this.animations.push(new Animator(this.spritesheet, 2,123,67, 175, 4, .08, 4,0,0));

    }

    update() {
        if (this.x == 100){
            this.dead = true;
        }
        if (this.dead) {
            /*if (this.deadCounter === 0) this.game.addEntity(new Score(this.game, this.x, this.y, 100));*/
            this.deadCounter += this.game.clockTick;
            if (this.deadCounter > 1) this.removeFromWorld = true;
        }
        if (this.face == 0) {
                this.x += this.speed * this.game.clockTick;
            } else {
                this.x -= this.speed * this.game.clockTick;
            }

    }
    draw(ctx) {

        if (this.dead) {

        }else {
            if (this.face == 0) {
                this.animations[0].drawFrame(this.game.clockTick, ctx, this.x,this.y, 1);
            } else {
                this.animations[1].drawFrame(this.game.clockTick, ctx, this.x,this.y, 1);
            }
        }

    }
}