
class WorldScene extends Scene {


    constructor(game) {
        super()
        this.game = game;
        this.mid = HEIGHT_PIXELS * .5 + WIDTH
        //other game stats --- display during win condition (rocket scene)
        //add total each mob kills
        //total blocks mined
        //total jetpack used
        //total jumps
        //total deaths
    }

    /**
     * Initializes this class' terrain entities
     * Player and player movement are for testing purposes
     * @param assets
     */
    init(assets, canvas) {
        this.mobFactory = new MobFactory(this.entityManager);
        let spawnMap
        [this.terrainMap, spawnMap] = getTerrain(this.entityManager, this.mobFactory)
        // this.#createEntity()
        this.player = this.mobFactory.build('player', WIDTH_PIXELS * .5, HEIGHT_PIXELS * .5 - 100);
        this.rocket =
            this.mobFactory.build('rocket', this.player.components.transform.x - 750, this.player.components.transform.y - 200);
        this.spawnManager = new SpawnerManager(this.mobFactory, spawnMap, this.player)
        this.spawnTestEntities();

        /*
    this.spawnManager.spawnTestEntities({
        x: WIDTH_PIXELS * .5,
        y: HEIGHT_PIXELS * .5 - 100
    });
    */

        this.projectileFactory = new ProjectileFactory(this.entityManager)
        this.playerController = new PlayerController(this.player, this.game, this.entityManager, this.containerManager,
                                                     this.projectileFactory, this.terrainMap);
        this.movementSystem = new MovementSystem(this.entityManager.getEntities, this.player);
        this.mobController = new EntityController(this.entityManager.getEntities, this.player, this.projectileFactory);
        this.renderSystem = new RenderSystem(this.entityManager.getEntities);
        this.camera = new Camera(this.player);
        this.renderBox = new RenderBox(this.player, GRIDSIZE, BLOCKSIZE);
        this.hud = new HUD(this.containerManager, this.player);
        this.craftingMenu = new InteractiveMenu(this.containerManager);
        this.collisionSystem = new CollisionSystem(this.player, this.entityManager.getEntities, this.projectileFactory);
        this.cursorSystem = new CursorSystem(canvas, this.terrainMap, this.hud, this.player);
        this.cursorSystem.init();
        // this.worldImages = new WorldImages(this.player)
        // this.worldImages.init(this.entityManager)
        this.particleFactory = new ParticleFactory(this.entityManager)
        this.healthSystem = new HealthSystem(this.entityManager, this.particleFactory, this.containerManager);
        this.durationSystem = new DurationSystem(this.entityManager.getEntities);
        this.weaponSystem = new WeaponSystem(this.entityManager.getEntities)
        this.giveWeapons2();
    }

    spawnTestEntities() {
        const px = this.player.components['boxCollider'].center.x;
        const py = this.player.components['boxCollider'].center.y;

        // this.mobFactory.build('spikejumper', px + 300, py - 200);
        // this.mobFactory.build('bloodsucker', px - 300, py - 200);
        // this.mobFactory.build('dirtcarver', px + 300, py - 200);
        this.mobFactory.build('vengefly', px - 300, py - 200);
        this.mobFactory.build('wormtank', px - 300, py - 200);
        // this.mobFactory.build('mossfly', px - 300, py - 200);
        this.mobFactory.build('silverfish', px + 600, py - 200);
        // this.mobFactory.build('electrojelly', px - 600, py - 200);
        // this.mobFactory.build('bombfly', px + 900, py - 200);
        // this.mobFactory.build('grapebomb', px - 900, py - 200);
        // this.mobFactory.build('spore', px + 1200, py - 200);

    }

    giveWeapons2() {
        const weps = [
            new Pickaxe(),
            new LaserPistol(),
            new LaserGun(),
            new LaserRifle(),
            new Flamethrower(),
            new GrenadeLauncher(),
            new HandCannon(),
            new Minigun(),
            new Railgun(),
        ]
        weps.forEach(w => {
            this.containerManager.addToInventory('player', this.entityManager.addEntity(w))
        });
    }

    update(menuActive, keys, mouseDown, mouse, wheel, deltaTime) {
        if (!menuActive) {
            if (this.#checkWinCon()) {
                this.rocket.components["state"].setState("win");
                this.rocket.components['transform'].hasGravity = false;
                this.camera.setTarget(this.rocket);
                this.renderBox.setTarget(this.rocket);
                this.player.isDrawable = false;
                this.player.components['stats'].invincible = true;
                console.log("win");
            } else if (this.player.components['stats'].isDead) {
                this.player.components["transform"].hasGravity = false;
                this.player.components["transform"].velocityX = 0;
                this.player.components["transform"].velocityY = 0;
                this.player.isDrawable = false;
                this.player.components['stats'].invincible = true;
                console.log("game over");
            } else {
                this.containerManager.reloadInventory();
                // **get input**
                this.playerController.update(keys, mouseDown, mouse, deltaTime, this.hud.activeContainer);
            }
            // **update state**
            this.spawnManager.update(deltaTime);
            this.entityManager.update();
            this.renderBox.update();
            this.#updateTileState();
            this.entityManager.getEntities.forEach((e) => this.#checkIfExposed(e));
            this.collisionSystem.refresh();

            this.mobController.update(deltaTime);
            // https://gamedev.stackexchange.com/a/71123
            // update Y first for ledges
            this.movementSystem.updateY(deltaTime);
            this.collisionSystem.resolveTileY();
            this.movementSystem.updateX(deltaTime);
            this.collisionSystem.resolveTileX();

            //this.worldImages.update()
            this.collisionSystem.resolveAttack();
            this.healthSystem.update(deltaTime);
            this.durationSystem.update(deltaTime);
            this.weaponSystem.update(deltaTime);

            // **draw**
            this.camera.update();
            this.renderSystem.update(deltaTime);
        }
        this.cursorSystem.update(menuActive, getGridCell(mouse, this.player))
        this.craftingMenu.update(menuActive);
        this.containerManager.update(menuActive, mouseDown, mouse);
        this.hud.update(menuActive, keys, wheel);
    }

    draw(menuActive, ctx, mouse) {
        ctx.fillStyle = this.player.components.transform.y > this.mid ? '#2a3647' : '#222222'
        ctx.fillRect(0, 0, WIDTH, HEIGHT)
        if (menuActive) ctx.putImageData(this.game.screenshot, 0, 0);
        else this.renderSystem.draw(ctx, this.camera);

        // this.#drawColliders(ctx);

        this.containerManager.draw(menuActive, ctx, mouse);
        this.hud.draw(menuActive, ctx);
    }

    #drawColliders(ctx) {
        this.entityManager.getEntities.forEach(e => {
            if (e.components.boxCollider) {
                let box = e.components.boxCollider
                ctx.fillStyle = 'rgba(200,200,100,.3)'
                ctx.fillRect(box.x - this.camera.x, box.y - this.camera.y, box.width, box.height)
            }
        });
        this.spawnManager.spawnMap.forEach(pos => {
            ctx.fillStyle = 'rgba(255,0,0)'
            ctx.fillRect((pos.x * BLOCKSIZE) - this.camera.x, (pos.y * BLOCKSIZE) - this.camera.y, BLOCKSIZE, BLOCKSIZE)
        })
    }

    /**
     * This method checks to see what is in the bounds of the view screen. 
     * Entities that are within the view screen are marked as drawable so they can be drawn to the ctx.
     * Also, calls check if exposed method to save a loop routine.
     * @todo performance optimization
     */
    #updateTileState() {
        this.entityManager.getEntities.forEach(e => {
            if(e.name !== 'player' && !e.tag.includes('background') && !this.#isItem(e)) {
                if(e.components.transform.x > (this.renderBox.x - BLOCKSIZE) * BLOCKSIZE &&
                e.components.transform.x < (this.renderBox.x + BLOCKSIZE) * BLOCKSIZE &&
                e.components.transform.y > (this.renderBox.y - BLOCKSIZE) * BLOCKSIZE &&
                e.components.transform.y < (this.renderBox.y + BLOCKSIZE) * BLOCKSIZE) {
                    if(!e.isBroken) {
                        e.isDrawable = true
                    }
                    this.#checkIfExposed(e)
                } else {
                    e.isDrawable = false
                }
            }
        })
    }

    #isItem(e) {
        return e.name === 'weapon' || e.name === 'tool' || e.name === "item";
    }

    /**
     * Checks a drawable entities four directions to see if it is exposed(not completely surrounded by other blocks).
     * A player will be able to collide with an exposed block, so they must be given colliders.
     * @param {Entity} e
     */
    #checkIfExposed(e) {
        if(e.isDrawable && e.tag.includes('tile') && !this.#isItem(e)) {
            const posX = e.components.transform.x / BLOCKSIZE
            const posY = e.components.transform.y / BLOCKSIZE
            if (this.#isExposed(posY, posX)) {
                if (!e.components["boxCollider"]) {
                    e.addComponent([
                        new CBoxCollider({
                            x: e.components.transform.x,
                            y: e.components.transform.y,
                            width: BLOCKSIZE,
                            height: BLOCKSIZE
                        })
                    ]);
                }
            } else {
                delete e.components["boxCollider"];
            }
        }
    }

    #isExposed(posY, posX) {
        return posY === 0
               || /air|interact/.test(this.terrainMap[clamp(posY-1,0,posY)][posX].tag)
               || /air|interact/.test(this.terrainMap[posY][clamp(posX - 1, 0, posX)].tag)
               || /air|interact/.test(this.terrainMap[posY][clamp(posX + 1, 0, this.terrainMap[0].length - 1)].tag)
               || /air|interact/.test(this.terrainMap[clamp(posY + 1, 0, this.terrainMap.length - 1)][posX].tag)
               || /air|interact/.test(this.terrainMap[clamp(posY - 1, 0, this.terrainMap.length - 1)][posX].tag);
    }
    
    #checkWinCon() {
        let requisite = { item : { tag : 'tile_iron' }, count : 10 }
        return (this.containerManager.checkCount(requisite) && checkCollision(this.player, this.rocket))
    }
}
