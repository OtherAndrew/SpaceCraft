
class WorldScene extends Scene {
    constructor(game) {
        super()
        this.game = game;
        //Sets numerical value ranges to blocks so we can map them to the terrainMap
        // Ranges from 0 to 10 ish
        this.blockValues = [
            'ruby',
            'stone',
            'stone',
            'stone',
            'dirt',
            'dirt',
            'null',
            'null',
            'null',
            'null',
        ]
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
        this.sporeSprite = assets[SPORE_PATH];

        //tiles
        this.tileDirtSprite = assets[TILES_DIRT_PATH]
        this.tileStoneSprite = assets[TILES_STONE_PATH]
        this.tileRubySprite = assets[TILES_RUBY_PATH]
        this.caveBackground = assets[BACKGROUND_CAVE_PATH]

        //background
        this.backgroundSurface0 = assets[BACKGROUND_SURFACE_0]
        this.backgroundSurface1 = assets[BACKGROUND_SURFACE_1]


        this.#generateBackgrounds()
        this.#generateNoiseMap()
        this.#generateTerrain()
        this.#createEntity()
        this.#createPlayer()
        this.#createSpore()
        this.playerMovement = new PlayerController(this.player)
        this.sporeManager = new SporeController(this.spore)
        // this.monsterStateManager = new EntityController(this.entity);
        this.renderSystem = new RenderSystem(this.entityManager.getEntities)

        this.camera = new Camera(this.player, (GRIDSIZE * GRIDSIZE * BLOCKSIZE))
        this.renderBox = new RenderBox(this.player, GRIDSIZE, BLOCKSIZE)
        this.hud = new HUD(this.containerManager, this.player);
        this.craftingMenu = new CraftMenu(this.containerManager);

        // this.collisionSystem = new CollisionSystem(this.entityManager.getEntities);
    }

    update(uiActive, keys, mouseDown, deltaTime) {
        if (!uiActive) {
            // draw stuff last
            this.entityManager.update()
            this.playerMovement.update(keys, deltaTime)
            this.sporeManager.update(deltaTime)
            this.camera.update()
            this.renderBox.update()
            // this.collisionSystem.update()
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

        //console.log(this.player.components.rigidBody.isGrounded)
        this.craftingMenu.update(uiActive);
        this.containerManager.update(uiActive, mouseDown);
        this.hud.update(uiActive, keys);
    }

    draw(uiActive, ctx) {
        this.renderSystem.draw(ctx, this.camera)

        this.entityManager.getEntities.forEach(e => {
            if(e.components.boxCollider){
                let box = e.components.boxCollider
                ctx.fillStyle = 'rgba(200,200,100,.3)'
                ctx.fillRect(box.x - this.camera.x, box.y - this.camera.y, box.width, box.height)
            }
        })

        // this.craftingMenu.draw(uiActive);
        this.containerManager.draw(uiActive, ctx);
        this.hud.draw(uiActive, ctx);
    }

    /**
     * Private class function. Generates a (2*gridSize) * (2*gridSize) matrix of perlin noise values
     * The values are from -1 to 1 so it is modified by multiplying by valueOffset and adding valueAddition
     * so it can be easy to work with.
     * Range from 0 to 120 ish.
     */
    #generateNoiseMap() {
        this.noiseMap = []
        let valueOffset = 10
        let valueAdditional = 5
        for(let y = 0; y < GRIDSIZE; y += 1/GRIDSIZE) {
            let row = []
            for(let x = 0; x < GRIDSIZE; x += 1/GRIDSIZE) {
                let v = parseInt(perlin.get(x,y) * valueOffset + valueAdditional)
                row.push(v)
            }
            this.noiseMap.push(row)
            row = []
        }
    }

    /**
     * Private class function. Uses a noiseMap to place blocks according to the blockValues.
     * 
     */
    #generateTerrain() {
        this.terrainMap = []
        this.noiseMap.forEach( (row, y) => {
            let r = []
            row.forEach((val, x) => {
                let e = this.#createBlock({
                    x: x * BLOCKSIZE,
                    y: y * BLOCKSIZE,
                    value: val,
                    recurse: true
                })
                r.push({
                    tag: e.tag,
                    id: e.id
                })
            })
            this.terrainMap.push(r)
        })
    }

    /**
     * Creates a tile entity according to the noise value 
     * @param {*} props 
     * @returns 
     */
    #createBlock(props) {
        switch(this.blockValues[props.value]) {
            case 'dirt':
                if(props.y < (50 * BLOCKSIZE) && props.recurse) {
                    props.value = Math.round(Math.random() + 3.7)
                    props.recurse = false
                    return this.#createBlock(props)
                } else if (props.y > (120 * BLOCKSIZE) && props.recurse) {
                    props.value = Math.round(Math.random() + 2.7)
                    props.recurse = false
                    return this.#createBlock(props)
                }
                return this.entityManager.addEntity(new DirtBlock({
                    sprite: this.tileDirtSprite,
                    x: props.x,
                    y: props.y,
                    sWidth: 16,
                    sHeight: 16,
                    scale: BLOCKSIZE / 16,
                    frameX: getRandomInt(6),
                    frameY: getRandomInt(2)
                }));
            case 'stone':
                if(props.y > (6 * BLOCKSIZE) && props.y < (120 * BLOCKSIZE) && props.recurse) {
                    props.value = Math.round(Math.random() + 3)
                    props.recurse = false
                    return this.#createBlock(props)
                } else if(props.y > (120 * BLOCKSIZE) && props.recurse) {
                    props.value = Math.round(Math.random() + .4)
                    props.recurse = false
                    return this.#createBlock(props)
                }
                return this.entityManager.addEntity(new StoneBlock({
                    sprite: this.tileStoneSprite,
                    x: props.x,
                    y: props.y,
                    sWidth: 16,
                    sHeight: 16,
                    scale: BLOCKSIZE / 16,
                    frameX: getRandomInt(6),
                    frameY: getRandomInt(2)
                }));
            case 'ruby':
                if(props.y < (120 * BLOCKSIZE)) {
                    props.value = Math.round(Math.random() + .4)
                    props.recurse = false
                    return this.#createBlock(props)
                }
                return this.entityManager.addEntity(new RubyBlock({
                    sprite: this.tileRubySprite,
                    x: props.x,
                    y: props.y,
                    sWidth: 16,
                    sHeight: 16,
                    scale: BLOCKSIZE / 16,
                    frameX: getRandomInt(3)
                }));
            default: 
                return {tag: 'air'}
        }
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
            y: -100,
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
     *  spore
     */
    #createSpore() {
        const spriteWidth = 138;
        const spriteHeight = 196;
        const scale = 0.5;
        //const test = this.player.transform.x;
        //console.log(test)
        this.spore = this.entityManager.addEntity(new Spore({
            sprite: this.sporeSprite,
            //x: this.player.positionX,
            //x: this.player.transform.x,

            x: this.player.components.transform.x,
            //y: this.player.transform.y,
            y: this.player.components.transform.y - 50,
            sWidth: spriteWidth,
            sHeight: spriteHeight,
            scale: scale
        }));

    }
    #generateBackgrounds() {
        let surfaceBackWidth = 512
        let surfaceBackHeight = 240
        let scale = 2

        for(let i = 0; i < 2; i++) {
            this.entityManager.addEntity(new Background_0({
                x: (surfaceBackWidth * i * scale),
                y: (-surfaceBackHeight * scale) + BLOCKSIZE,
                maxVelocity: 0,
                sprite: this.backgroundSurface0,
                sWidth: surfaceBackWidth,
                sHeight: surfaceBackHeight,
                scale: scale
            }));

            this.entityManager.addEntity(new Background_1({
                x: (surfaceBackWidth * i * scale),
                y: (-surfaceBackHeight * scale) + BLOCKSIZE,
                maxVelocity: 0,
                sprite: this.backgroundSurface1,
                sWidth: surfaceBackWidth,
                sHeight: surfaceBackHeight,
                scale: scale
            }));
        }
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
                this.terrainMap[posY][clamp(posX+1, 0, this.terrainMap.length-1)].tag === 'air' ||
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