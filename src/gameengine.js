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
        this.terrainScene = new WorldScene(this)
        // Information on the input
        this.click = null;
        this.mouseDown = null;
        this.mouse = null;
        this.wheel = null;
        this.menuActive = false;
        this.keys = {};

        // Options and the Details
        this.options = options || {
            debugging: false,
        };
    };

    init(ctx, assets, canvas) {
        this.ctx = ctx;
        this.terrainScene.init(assets, canvas)
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
         TAB    : INVENTORY/CRAFTING
         ESC    : EXIT UI */
        const that = this;
        this.ctx.canvas.addEventListener("keyup", e => {
            switch (e.code) {
                case "Escape":
                    that.menuActive = false;
                    break;
                case "Tab":
                    this.activateMenu();
                    break;
            }
        }, false);
        this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);
    };

    activateMenu() {
        this.menuActive = !this.menuActive;
        if (this.menuActive) {
            this.screenshot = this.ctx.getImageData(0, 0, 1024, 768);
            this.blur(this.screenshot, 2, 1);
        }
    }

    // credit: https://gist.github.com/tieleman/6028023
    blur(imageData, radius, quality) {
        var pixels = imageData.data;
        var width = imageData.width;
        var height = imageData.height;

        var rsum, gsum, bsum, asum, x, y, i, p, p1, p2, yp, yi, yw;
        var wm = width - 1;
        var hm = height - 1;
        var rad1x = radius + 1;
        var divx = radius + rad1x;
        var rad1y = radius + 1;
        var divy = radius + rad1y;
        var div2 = 1 / (divx * divy);

        var r = [];
        var g = [];
        var b = [];
        var a = [];

        var vmin = [];
        var vmax = [];

        while (quality-- > 0) {
            yw = yi = 0;

            for (y = 0; y < height; y++) {
                rsum = pixels[yw] * rad1x;
                gsum = pixels[yw + 1] * rad1x;
                bsum = pixels[yw + 2] * rad1x;
                asum = pixels[yw + 3] * rad1x;


                for (i = 1; i <= radius; i++) {
                    p = yw + (((i > wm ? wm : i)) << 2);
                    rsum += pixels[p++];
                    gsum += pixels[p++];
                    bsum += pixels[p++];
                    asum += pixels[p]
                }

                for (x = 0; x < width; x++) {
                    r[yi] = rsum;
                    g[yi] = gsum;
                    b[yi] = bsum;
                    a[yi] = asum;

                    if (y === 0) {
                        vmin[x] = Math.min(x + rad1x, wm) << 2;
                        vmax[x] = Math.max(x - radius, 0) << 2;
                    }

                    p1 = yw + vmin[x];
                    p2 = yw + vmax[x];

                    rsum += pixels[p1++] - pixels[p2++];
                    gsum += pixels[p1++] - pixels[p2++];
                    bsum += pixels[p1++] - pixels[p2++];
                    asum += pixels[p1] - pixels[p2];

                    yi++;
                }
                yw += (width << 2);
            }

            for (x = 0; x < width; x++) {
                yp = x;
                rsum = r[yp] * rad1y;
                gsum = g[yp] * rad1y;
                bsum = b[yp] * rad1y;
                asum = a[yp] * rad1y;

                for (i = 1; i <= radius; i++) {
                    yp += (i > hm ? 0 : width);
                    rsum += r[yp];
                    gsum += g[yp];
                    bsum += b[yp];
                    asum += a[yp];
                }

                yi = x << 2;
                for (y = 0; y < height; y++) {
                    pixels[yi] = (rsum * div2 + 0.5) | 0;
                    pixels[yi + 1] = (gsum * div2 + 0.5) | 0;
                    pixels[yi + 2] = (bsum * div2 + 0.5) | 0;
                    pixels[yi + 3] = (asum * div2 + 0.5) | 0;

                    if (x === 0) {
                        vmin[y] = Math.min(y + rad1y, hm) * width;
                        vmax[y] = Math.max(y - radius, 0) * width;
                    }

                    p1 = x + vmin[y];
                    p2 = x + vmax[y];

                    rsum += r[p1] - r[p2];
                    gsum += g[p1] - g[p2];
                    bsum += b[p1] - b[p2];
                    asum += a[p1] - a[p2];

                    yi += width << 2;
                }
            }
        }
        postMessage(imageData);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // this.ctx.fillStyle = 'rgb(159,109,50)'
        this.ctx.fillStyle = '#222222'
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.terrainScene.draw(this.menuActive, this.ctx, this.mouse)
        if (this.currentTime > 1) {
            this.currentTime = 0
            this.frames = this.renderedFrames
            this.renderedFrames = 0
        } else {
            this.currentTime += this.clockTick
            this.renderedFrames++
        }
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = 'left'
        this.ctx.font = 'bold 15px Helvetica'
        this.ctx.fillText(`FPS: ${this.frames}`, 10, 20)
    };

    update() {
        this.terrainScene.update(this.menuActive, this.keys, this.mouseDown, this.mouse, this.wheel, this.clockTick);
        this.refreshInput();
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




