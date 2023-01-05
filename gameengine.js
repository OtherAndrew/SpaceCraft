// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        this.ctx = null;
        this.WIDTH = 1024
        this.HEIGHT = 768


        //Scenes
        this.demoScene = new PhysicsDemoScene(null)


        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        // Options and the Details
        this.options = options || {
            debugging: false,
        };
    };

    init(ctx, assets) {
        this.ctx = ctx;
        this.demoScene.init()
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
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
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

        this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);
    };


    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.demoScene.draw(this.ctx)
        this.ctx. textAlign = 'left'
        this.ctx.font = '15px Helvetica'
        this.ctx.fillText(`FPS: ${Math.floor(1000/this.clockTick)}`, 10,20)
    };

    update() {
        this.demoScene.update()
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };
}




