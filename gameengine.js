// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {

        this.ctx = null;
        //used to calculate FPS
        this.renderedFrames = 0
        this.currentTime = 0
        this.lastTime = 0
        this.frames = 0

        //Scenes
        this.terrainDemoScene = new WorldScene(this)
        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.uiActive = false;
        this.keys = {};

        // Options and the Details
        this.options = options || {
            debugging: false,
        };
    };

    init(ctx, assets) {
        this.ctx = ctx;
        this.terrainDemoScene.init(assets)
        console.log(assets)
        this.startInput();
        this.timer = new Timer();
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left - 1,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top - 1
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        this.ctx.canvas.addEventListener("keydown", e => {
            if (e.code === "Tab") {  // PREVENT TABBING OUT
                e.preventDefault();
            }
        });

        /* KEY LISTENERS FOR:
         I    : INVENTORY
         C    : CRAFT
         ESC  : EXIT UI */
        const that = this;
        this.ctx.canvas.addEventListener("keyup", e => {
                switch (e.code) {
                    // case "KeyQ":
                    //     that.uiActive = !that.uiActive;
                    //     console.log(that.uiActive);
                    //     break;
                    case "Escape":
                        that.uiActive = false;
                        console.log(that.uiActive);
                        break;
                    case "Tab":
                        that.uiActive = !that.uiActive;
                        console.log(that.uiActive);
                        break;
                }
            }, false);
        this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);
    };

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = 'rgb(159,109,50)'
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.terrainDemoScene.draw(this.ctx)
        //this.animationDemoScene.draw(this.ctx)
        if(this.currentTime > 1) {
            this.currentTime = 0
            this.frames = this.renderedFrames
            this.renderedFrames = 0
        } else {
            this.currentTime += this.clockTick
            this.renderedFrames++
        }
        this.ctx. textAlign = 'left'
        this.ctx.font = '15px Helvetica'
        this.ctx.fillText(`FPS: ${this.frames}`, 10,20)
    };

    update() {
        //this.demoScene.update(this.keys)
        this.terrainDemoScene.update(this.uiActive, this.keys);
        //this.animationDemoScene.update(this.keys, this.clockTick)
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };
}




