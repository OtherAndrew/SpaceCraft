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
        //this.scene = new WorldScene(this)
        /*
        this.scenes = {
            worldScene: new WorldScene(this),
            mainMenuScene: new MainMenu()
        }
        */
        this.mainScene = new MainMenu()
        // Information on the input
        this.click = null;
        this.mouseDown = null;
        this.mouse = null;
        this.wheel = null;
        this.menuActive = false;
        this.pausemenuActive = false;
        this.focused = true;
        this.keys = [];

        // Options and the Details
        this.options = options || {
            debugging: false,
        };

        // https://medium.com/iecse-hashtag/day-2-cheat-codes-for-websites-8e371c29f02
        this.bufferArray = [];
        this.lastKeystrokeTime = 0;

        this.winCheat = false;
        this.pickaxeCheat = false;
        this.weaponCheat = false;
        this.invincibleCheat = false;
        this.craftCheat = false;

        this.gaveWinCheat = false;
        this.gavePickaxeCheat = false;
        this.gaveWeaponCheat = false;
        this.gaveInvincibleCheat = false;
        this.gaveCraftCheat = false;
    };

    init(ctx, assets, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.mainScene.init(this.canvas);
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

        const getXYTW = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left - 1,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top - 1,
            t: this.timer.gameTime,
            w: e.which
        });

        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXYTW(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXYTW(e);
        });

        this.ctx.canvas.addEventListener('mousedown', e => {
            if (this.options.debugging) {
                console.log("MouseDown", getXandY(e));
            }
            this.mouseDown = getXYTW(e);
        })

        this.ctx.canvas.addEventListener('mouseup', e => {
            if (this.options.debugging) {
                console.log("MouseUp", getXYTW(e));
            }
            this.mouseDown = null
        })
        
        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e));
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
            switch (e.code) {
                case "Tab":
                    e.preventDefault();
                    break;
            }
            // if (e.code === "Tab") {  // PREVENT TABBING OUT
            //     e.preventDefault();
            // }
        });

        /* KEY LISTENERS FOR:
         TAB    : INVENTORY/CRAFTING
         ESC    : EXIT UI */
        const that = this;
        this.ctx.canvas.addEventListener("keyup", e => {
            switch (e.code) {
                case "Escape":
                    that.menuActive = false;
                    break;
                case "Tab":
                case "KeyQ":
                    this.activateMenu();
                    break;
                case 'Backslash':
                    this.options.debugging = !this.options.debugging;
                    break;
            }
        }, false);
        this.ctx.canvas.addEventListener("keydown", event => this.keys[event.code] = true);
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.code] = false);

        // https://medium.com/iecse-hashtag/day-2-cheat-codes-for-websites-8e371c29f02
        window.addEventListener("keyup", e => {
            if (Date.now() - this.lastKeystrokeTime > 3000) { // 3 seconds
                this.bufferArray = [];
                this.lastKeystrokeTime = Date.now();
            }
            this.bufferArray.push(e.key.toLowerCase());
            if (this.bufferArray.join("") === CHEATCODE.WIN && !this.gaveWinCheat) {
                this.winCheat = true;
                this.gaveWinCheat = true;
                this.bufferArray = [];
                this.lastKeystrokeTime = Date.now();
            }
            if (this.bufferArray.join("") === CHEATCODE.PICKAXE && !this.gavePickaxeCheat) {
                this.pickaxeCheat = true;
                this.gavePickaxeCheat = true;
                this.bufferArray = [];
                this.lastKeystrokeTime = Date.now();
            }
            if (this.bufferArray.join("") === CHEATCODE.WEAPON && !this.gaveWeaponCheat) {
                this.weaponCheat = true;
                this.gaveWeaponCheat = true;
                this.bufferArray = [];
                this.lastKeystrokeTime = Date.now();
            }
            if (this.bufferArray.join("") === CHEATCODE.INVINCIBLE && !this.gaveInvincibleCheat) {
                this.invincibleCheat = true;
                this.gaveInvincibleCheat = true;
                this.bufferArray = [];
                this.lastKeystrokeTime = Date.now();
            }
            if (this.bufferArray.join("") === CHEATCODE.CRAFT && !this.gaveCraftCheat) {
                this.craftCheat = true;
                this.gaveCraftCheat = true;
                this.bufferArray = [];
                this.lastKeystrokeTime = Date.now();
            }
        });
    };

    /**
     * Periodically checks if the game has focus.
     * If not then the game is paused.
     * Borrowed from: https://github.com/Kenpai718/Untitled-Knight-Game/blob/main/engine/gameengine.js
     */
    checkGameFocus() {
        const elem = document.getElementById("gameWorld");
        if (elem === document.activeElement) {
            // console.log("focus gained");
            this.focused = true;
        }
        else {
            // console.log("focus lost")
            this.focused = false;
            this.resetControls();
        }
    }

    resetControls() {
        // https://stackoverflow.com/a/40836264
        Object.keys(this.keys).forEach(key => this.keys[key] = false);
    }

    activateMenu() {
        this.menuActive = !this.menuActive;
        if (this.menuActive) {
            this.screenshot = this.ctx.getImageData(0, 0, 1024, 768);
            blur(this.screenshot, 2, 1);
        }
    }


    // activatePausemenu() {
    //     this.pausemenuActive = !this.pausemenuActive;
    //     if (this.pausemenuActive) {
    //         let sprite = "./assets/menu/splashscreen_pausemenu.png";
    //         this.ctx.drawImage(sprite,
    //             0,
    //             0,
    //             sprite.sWidth,
    //             sprite.sHeight
    //         );
    //
    //     }
    // }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.mainScene.draw(this.menuActive, this.ctx, this.mouse);
        if (this.currentTime > 1) {
            this.currentTime = 0;
            this.frames = this.renderedFrames;
            this.renderedFrames = 0;
        } else {
            this.currentTime += this.clockTick;
            this.renderedFrames++;
        }
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = 'left';
        this.ctx.font = 'bold 15px Helvetica';
        if (this.focused) {
            this.ctx.fillText(`FPS: ${this.frames}`, 10, 20);
        } else {
            this.ctx.fillText("PAUSED", 10, 20);
        }
    };

    update() {
        if (this.focused) {
            const status = this.mainScene.update(this.menuActive, this.keys, this.mouseDown, this.mouse, this.wheel, this.clockTick);
            if (status) {
                this.mainScene = new WorldScene(this)
                this.mainScene.init(this.canvas);
            }
        }
        this.refreshInput();
        this.checkGameFocus();
    };

    refreshInput() {
        this.wheel = null;
    }

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };
}




