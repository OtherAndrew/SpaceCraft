
class WorldScene extends Scene {
    constructor(game) {
        super()
        this.game = game;
        this.collisionSystem = new CollisionSystem(this.entityManager.getEntities)
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
        this.terrainMap = getTerrain(this.entityManager)
        this.#createEntity()
        this.#createPlayer()
        this.playerMovement = new PlayerController(this.player)
        // this.monsterStateManager = new EntityController(this.entity);
        this.renderSystem = new RenderSystem(this.entityManager.getEntities)
        this.camera = new Camera(this.player)
        this.renderBox = new RenderBox(this.player, GRIDSIZE, BLOCKSIZE)
        this.hud = new HUD(this.containerManager, this.player);
        this.craftingMenu = new CraftMenu(this.containerManager);
        this.collisionSystem = new CollisionSystem(this.entityManager.getEntities);
    }

    update(uiActive, keys, mouseDown, deltaTime) {
        if (!uiActive) {
            // draw stuff last
            this.entityManager.update()
            this.playerMovement.update(keys, deltaTime)
            this.camera.update()
            this.renderBox.update()
            this.renderSystem.update(this.game.clockTick);
            // this.monsterStateManager.update(this.game.clockTick)
            this.#updateTileState()
            this.entityManager.getEntities.forEach((e) => this.#checkIfExposed(e));
            this.collisionSystem.update(deltaTime)
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

    /**
     * A non-player entity for testing purposes
     */
    #createEntity() {
        const spriteWidth = 200;
        const spriteHeight = 250;
        const scale = BLOCKSIZE / spriteWidth * 1.5;

        this.entity = this.entityManager.addEntity(new NPC({
            sprite: this.entitySprite,
            x: WIDTH / 2,
            y: HEIGHT / 2,
            sWidth : spriteWidth,
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
                    e.isDrawable = true
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
            console.log("inside")
            let e = this.entityManager.getEntity(terrainMap[mapY][mapX].id)
            e.components.lifespan.current -= 1
            console.log(e.components.lifespan.current)
            if(e.components.lifespan.current <= 0) {
                e.destroy()
                terrainMap[mapY][mapX].tag = 'air'
                terrainMap[mapY][mapX].id = null
            }
        }
    }
}