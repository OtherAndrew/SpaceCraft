
class WorldScene extends Scene {
    constructor(game) {
        super()
        this.game = game;
    }

    /**
     * Initializes this class' terrain entities
     * Player and player movement are for testing purposes
     * @param assets
     */
    init(assets) {
        // entities
        this.playerSprite = assets[PLAYER_PATH];
        this.entitySprite = assets[ENTITY_PATH];
        this.sporeSprite = assets[SPORE_PATH];
        this.dirtCarverSprite = assets[DIRTCARVER_PATH];
        this.lightJellySprite = assets[LIGHTJELLY_PATH];
        this.lightBugSprite = assets[LIGHTBUG_PATH];
        //this.genericDeathSprite = assets[GENERICDEATH_PATH];
        this.terrainMap = getTerrain(this.entityManager)
        // this.#createEntity()
        this.#createPlayer()
        this.#createSpore()
        this.#createDirtcarver()
        // this.#createLightjelly()
        this.#createLightbug()
        //this.#genericDeath()
        this.playerMovement = new PlayerController(this.player)
        // this.sporeManager = new SporeController(this.spore)
        // this.dirtcarverManager = new DirtcarverController(this.dirtcarver, this.player)
        // this.lightjellyManager = new LightjellyController(this.lightjelly, this.player)
        // this.lightbugManager = new LightbugController(this.lightbug, this.player)
        //this.genericDeathManager = new GenericDeathController(this.lightjelly, this.player)

        this.mobController = new EntityController(this.entityManager.getEntities, this.player);
        this.renderSystem = new RenderSystem(this.entityManager.getEntities)
        this.camera = new Camera(this.player)
        this.renderBox = new RenderBox(this.player, GRIDSIZE, BLOCKSIZE)
        this.hud = new HUD(this.containerManager, this.player);
        this.craftingMenu = new CraftMenu(this.containerManager);
        this.collisionSystem = new CollisionSystem(this.player, this.entityManager.getEntities);
    }

    update(uiActive, keys, mouseDown, deltaTime) {
        if (!uiActive) {
            // draw stuff last
            this.entityManager.update()
            this.playerMovement.update(keys, deltaTime)
            // this.sporeManager.update(deltaTime)
            // this.dirtcarverManager.update(deltaTime)
            // this.lightjellyManager.update(deltaTime)
            // this.lightbugManager.update(deltaTime)
            //this.genericDeathManager.update(deltaTime)
            this.camera.update()
            this.renderBox.update()
            this.mobController.update(deltaTime)
            this.#updateTileState()
            this.entityManager.getEntities.forEach((e) => this.#checkIfExposed(e));
            this.collisionSystem.update()

            this.renderSystem.update(this.game.clockTick);
            // temporary spot for this
            if(mouseDown) {
                this.breakBlock(mouseDown, this.player, this.terrainMap)
            }
        }
        this.craftingMenu.update(uiActive);
        this.containerManager.update(uiActive, mouseDown);
        this.hud.update(uiActive, keys);
    }

    draw(uiActive, ctx) {
        if (uiActive)
            ctx.putImageData(this.game.screenshot, 0, 0);
        else
            this.renderSystem.draw(ctx, this.camera);
        
        // this.entityManager.getEntities.forEach(e => {
        //     if(e.components.boxCollider){
        //         let box = e.components.boxCollider
        //         ctx.fillStyle = 'rgba(200,200,100,.3)'
        //         ctx.fillRect(box.x - this.camera.x, box.y - this.camera.y, box.width, box.height)
        //     }
        // });

        // this.craftingMenu.draw(uiActive);
        this.containerManager.draw(uiActive, ctx);
        this.hud.draw(uiActive, ctx);
    }

    /**
     * A player entity for testing purposes
     */
    #createPlayer() {
        const spriteWidth = 200;
        const spriteHeight = 250;
        const scale = BLOCKSIZE / spriteWidth * 1.5;

        this.player = this.entityManager.addEntity(new Player({
            sprite: this.playerSprite,
            x: WIDTH_PIXELS * .5,
            y: HEIGHT_PIXELS * .5 - 100,
            sWidth : spriteWidth,
            sHeight: spriteHeight,
            scale: scale
        }));
    }

    // /**
    //  * A non-player entity for testing purposes
    //  */
    // #createEntity() {
    //     const spriteWidth = 200;
    //     const spriteHeight = 250;
    //     const scale = BLOCKSIZE / spriteWidth * 1.5;
    //
    //     this.entity = this.entityManager.addEntity(new NPC({
    //         sprite: this.entitySprite,
    //         x: WIDTH / 2,
    //         y: HEIGHT / 2,
    //         sWidth : spriteWidth,
    //         sHeight: spriteHeight,
    //         scale: scale
    //     }));
    // }
    //
    //
    // /**
    //  *  spore
    //  */
    #createSpore() {
        const spriteWidth = 138;
        const spriteHeight = 196;
        const scale = 0.5;
        //const test = this.player.transform.x;
        //console.log(test)
        this.spore = this.entityManager.addEntity(new Spore({
            sprite: this.sporeSprite,
            x: this.player.components.transform.x,
            y: this.player.components.transform.y - 50,
            sWidth: spriteWidth,
            sHeight: spriteHeight,
            scale: scale
        }));

    }
    //
    // /**
    //  *  dirtcarver spawn condition
    //  */
    #createDirtcarver() {
        const spriteWidth = 262;
        const spriteHeight = 84;
        const scale = 0.5;
        this.dirtcarver = this.entityManager.addEntity(new Dirtcarver({
            sprite: this.dirtCarverSprite,
            //control spawn point

            x: this.player.components.transform.x - 100,
            y: this.player.components.transform.y - 250,
            sWidth: spriteWidth,
            sHeight: spriteHeight,
            scale: scale
        }));

    }
    // lightjelly movement logic = lightbug movement logic
    //
    // /**
    //  *  lightjelly spawn condition
    //  */
    // #createLightjelly() {
    //     const spriteWidth = 168;
    //     const spriteHeight = 219;
    //     const scale = .5;
    //     //const test = this.player.transform.x;
    //     //console.log(test)
    //     this.lightjelly = this.entityManager.addEntity(new Lightjelly({
    //         sprite: this.lightJellySprite,
    //         //controller for spawn point
    //
    //         x: this.player.components.transform.x + 300,
    //         y: this.player.components.transform.y - 300,
    //         sWidth: spriteWidth,
    //         sHeight: spriteHeight,
    //         scale: scale
    //     }));
    //
    // }

    /**
     *  lightbug spawn condition
     */
    #createLightbug() {
        const spriteWidth = 50;
        const spriteHeight = 49;
        const scale = 1;
        this.lightbug = this.entityManager.addEntity(new Lightbug({
            sprite: this.lightBugSprite,
            //controller for spawn point

            x: this.player.components.transform.x + 1200,
            y: this.player.components.transform.y - 100,
            sWidth: spriteWidth,
            sHeight: spriteHeight,
            scale: scale
        }));

    }

    /**
     * This method checks to see what is in the bounds of the view screen. 
     * Entities that are within the view screen are marked as drawable so they can be drawn to the ctx.
     * Also, calls check if exposed method to save a loop routine.
     */
    #updateTileState() {
        this.entityManager.getEntities.forEach(e => {
            if(e.tag !== 'player' && !e.tag.includes('background')) {
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

    /**
     * Checks a drawable entities four directions to see if it is exposed(not completely surrounded by other blocks).
     * A player will be able to collide with a exposed block, so they must be given colliders.
     * @param {Entity} e
     */
    #checkIfExposed(e) {
        
        if(e.components.boxCollider) return

        const posX = e.components.transform.x / BLOCKSIZE
        const posY = e.components.transform.y / BLOCKSIZE

        if(e.isDrawable && e.tag.includes('tile')) {
            //adds 'ground' tag to block so player can jump off of it
            if(posY === 0 || this.terrainMap[clamp(posY-1,0,posY)][posX].tag === 'air') {
                e.addComponent([
                    new CBoxCollider({
                        x: e.components.transform.x,
                        y: e.components.transform.y,
                        width: BLOCKSIZE,
                        height: BLOCKSIZE
                    })
                ])
                e.tag = e.tag + " ground"
            }
            if (
                this.terrainMap[posY][clamp(posX-1, 0, posX)].tag === 'air' ||
                this.terrainMap[posY][clamp(posX+1, 0, this.terrainMap[0].length-1)].tag === 'air' ||
                this.terrainMap[clamp(posY+1, 0, this.terrainMap.length-1)][posX].tag === 'air') {
                    e.addComponent([
                        new CBoxCollider({
                            x: e.components.transform.x,
                            y: e.components.transform.y,
                            width: BLOCKSIZE,
                            height: BLOCKSIZE
                        })
                    ])
                }
        }
    }

    breakBlock(pos, player, terrainMap) {
        let offsetX = player.components.transform.x >= WIDTH/2 ?
                      player.components.transform.x >= WIDTH_PIXELS - WIDTH/2 ?
                      WIDTH_PIXELS - (WIDTH_PIXELS - player.components.transform.x) - WIDTH * .75 :
                      (player.components.transform.x - WIDTH/2) : 0
        let mapX = Math.floor((pos.x + offsetX)/BLOCKSIZE)
        let mapY = Math.floor((pos.y + (player.components.transform.y - HEIGHT/2))/BLOCKSIZE)
        if(mapY < 0) return
        console.log(terrainMap[mapY][mapX].tag)
        if(terrainMap[mapY][mapX].tag.includes('tile')) {
            let e = this.entityManager.getEntity(terrainMap[mapY][mapX].id)
            e.components.lifespan.current -= 1
            if(e.components.lifespan.current <= 0) {
                terrainMap[mapY][mapX].tag = 'air'
                terrainMap[mapY][mapX].id = null
                this.containerManager.addToInventory('player', this.#resizeBlock(e))
            }
        } else if(terrainMap[mapY][mapX].tag.includes('air')) {

            //this is where we spawn the selected item from inventory
            let newBlock = this.entityManager.addEntity(new DirtBlock({
                sprite: ASSET_MANAGER.cache[TILES_DIRT_PATH],
                x: mapX * BLOCKSIZE,
                y: mapY * BLOCKSIZE,
                sWidth: 16,
                sHeight: 16,
                scale: BLOCKSIZE / 16,
                frameX: getRandomInt(6),
                frameY: getRandomInt(2)
            }))
            terrainMap[mapY][mapX].tag = newBlock.tag
            terrainMap[mapY][mapX].id = newBlock.id
            console.log(newBlock)
        }
    }

    #resizeBlock(e) {
        console.log(e.components.sprite)
        e.components.sprite.dWidth = e.components.sprite.dWidth * .5
        e.components.sprite.dHeight = e.components.sprite.dHeight * .5
        e.components.transform.x += BLOCKSIZE * .25
        e.components.transform.y += BLOCKSIZE * .25
        e.components.transform.velocityY = 10
        e.isBroken = true
        e.isDrawable = false
        console.log(e)
        return e
    }
}