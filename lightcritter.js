class LightCritter {
    constructor(game) {
        //this.game = game;
        this.speed = 45; //base travel speed 25
        this.x = 600;
        this.y = 0;
        this.face = 1;  //0 face right, 1 face left

        Object.assign(this, {game});
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/lightcritter25f.png");
        this.animations = [];
        //spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
        this.animations.push(new Animator(this.spritesheet, 1,105,27, 21, 3, .07, 3));
        this.animations.push(new Animator(this.spritesheet, 1,79,27, 21, 3, .07, 3));
        //this.loadanimation();
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
            this.animations[0].drawFrame(this.game.clockTick, ctx, this.x,this.y, 2.5);
        } else {
            this.animations[1].drawFrame(this.game.clockTick, ctx, this.x,this.y, 2.5);
        }

    }
    loadanimation() {  //do not use, this is a model with 4 states  right idle, right walk, left idle, left walk. (stretch goal)
        for (var i = 0; i < 2; i++){   //direction
            this.animations.push([]);
            for (var j = 0; j< 2; j++) {      //switch between idle - run
                this.animations[i].push([]);
            }
        }
        //face right idle
        this.animations[0][0] = new Animator(this.spritesheet, 1,105,27, 21, 3, .07, 3);
        // run right
        this.animations[0][1] = new Animator(this.spritesheet, 1,105,27, 21, 3, .07, 3);

        //face left idle
        this.animations[1][0] = new Animator(this.spritesheet, 1,79,27, 21, 3, .07, 3);
        //run left
        this.animations[1][1] = new Animator(this.spritesheet, 1,79,27, 21, 3, .07, 3);

    }
}