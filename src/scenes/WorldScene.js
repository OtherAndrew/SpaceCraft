
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
    }

    /**
     * Initializes this class' terrain entities
     * Player and player movement are for testing purposes
     * @param assets
     */
    init(assets) {
        // entities
        this.playerSprite = assets[PLAYER_PATH];

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
        this.#createPlayer()
        this.playerMovement = new PlayerInputSystem(this.player)
        this.playerStateManager = new PlayerStateManager(this.playerMovement, this.player);

        this.camera = new Camera(this.player, (GRIDSIZE * GRIDSIZE * BLOCKSIZE))
        this.renderBox = new RenderBox(this.player, GRIDSIZE, BLOCKSIZE)
        this.hud = new HUD(this);

        this.collisionSystem = new CollisionSystem(this.entityManager.getEntities);
    }

    update(uiActive, keys) {
        if (!uiActive) {
            this.entityManager.update()
            this.playerMovement.update(keys)
            this.camera.update()
            this.renderBox.update()
            this.playerStateManager.update(keys, this.game.clockTick)
            this.collisionSystem.update()
            this.renderSystem.update(this.game.clockTick);
            this.#updateTileState()
        }
        this.hud.update(uiActive); // UI LAST AT ALL TIMES
    }

    draw(ctx) {
        this.renderSystem.draw(ctx, this.camera)
        /*
        this.entityManager.getEntities.forEach(e => {
            if(e.components.boxCollider){
                let box = e.components.boxCollider
                ctx.fillStyle = 'rgba(200,200,100,1)'
                ctx.fillRect(box.x - this.camera.x, box.y - this.camera.y, box.width, box.height)
            }
        })
        */
        this.hud.draw(ctx); // UI ON TOP OF EVERYTHING
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
                r.push(this.#createBlock({
                    x: x * BLOCKSIZE,
                    y: y * BLOCKSIZE,
                    value: val,
                    recurse: true
                }).tag)
            })
            this.terrainMap.push(r)
        })
        console.log(this.terrainMap)
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
                return this.entityManager.addEntity({
                    tag: 'dirt',
                    components: [
                        new CTransform({
                            x: props.x,
                            y: props.y,
                        }),
                        new CSprite(this.tileDirtSprite, 18, 18, {scale: 2, startFrameX: 8, frameY: 5 })
                    ]
                })
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
                return this.entityManager.addEntity({
                    tag: 'stone',
                    components: [
                        new CTransform({
                            x: props.x,
                            y: props.y,
                        }),
                        new CSprite(this.tileStoneSprite, 18, 18, {scale: 2, startFrameX: 8, frameY: 5 })
                    ]
                })
            case 'ruby':
                if(props.y < (120 * BLOCKSIZE)) {
                    props.value = Math.round(Math.random() + .4)
                    props.recurse = false
                    return this.#createBlock(props)
                }
                return this.entityManager.addEntity({
                    tag: 'stone',
                    components: [
                        new CTransform({
                            x: props.x,
                            y: props.y,
                        }),
                        new CSprite(this.tileRubySprite, 18, 18, {scale: 2, startFrameX: 8, frameY: 2})
                    ]
                })
            default: 
                return {tag: 'air'}
        }
    }

    /**
     * A player entity for testing purposes
     */
    #createPlayer() {
        this.player = this.entityManager.addEntity(new Player(this.playerSprite));

        // const positionX = WIDTH / 2;
        // const positionY = HEIGHT / 2;
        // const sWidth = 200;
        // const sHeight = 250;
        // const scale = 0.25;
        // const dWidth = sWidth * scale;
        // const dHeight = sWidth * scale;
        //
        // this.player = this.entityManager.addEntity({
        //     tag: 'player',
        //     components: [
        //         new CSprite(this.playerSprite, sWidth, sHeight, {
        //             scale: scale,
        //             fps: 30
        //         }),
        //         new CTransform({
        //             x: positionX,
        //             y: positionY,
        //             maxVelocity: 15
        //         }),
        //         new CBoxCollider({
        //             x: positionX,
        //             y: positionY,
        //             width: dWidth,
        //             height: dHeight
        //         }),
        //         new CRigidBody(1),
        //         // new CInput(),
        //         new CState()
        //     ]
        // });
    }

    #generateBackgrounds() {
        let surfaceBackWidth = 512
        let surfaceBackHeight = 240
        let resizeVal = 2

        for(let i = 0; i < 2; i++) {
            this.entityManager.addEntity({
                tag: 'background_layer_0',
                components: [
                    new CTransform({
                        x: (surfaceBackWidth * i * resizeVal),
                        y: (-surfaceBackHeight * resizeVal) + BLOCKSIZE,
                        maxVelocity: 0
                    }),
                    new CSprite(this.backgroundSurface0, surfaceBackWidth, surfaceBackHeight, { scale: resizeVal } )
                ]
            })
            this.entityManager.addEntity({
                tag: 'background_layer_1',
                components: [
                    new CTransform({
                        x: (surfaceBackWidth * i * resizeVal),
                        y: (-surfaceBackHeight * resizeVal) + BLOCKSIZE,
                        maxVelocity: 0
                    }),
                    new CSprite(this.backgroundSurface1, surfaceBackWidth, surfaceBackHeight, { scale: resizeVal })
                ]
            })
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

        let posX = e.components.transform.x / BLOCKSIZE
        let posY = e.components.transform.y / BLOCKSIZE
        if ( posY === 0 ||
            this.terrainMap[posY][clamp(posX-1, 0, posX)] === 'air' ||
            this.terrainMap[posY][clamp(posX+1, 0, this.terrainMap.length-1)] === 'air' ||
            this.terrainMap[clamp(posY-1,0,posY)][posX] === 'air' ||
            this.terrainMap[clamp(posY+1, 0, this.terrainMap.length-1)][posX] === 'air') {
                e.addComponent([
                    new CBoxCollider({
                        x: e.components.transform.x,
                        y: e.components.transform.y,
                        width: 32,
                        height: 32
                    })
                ])
            }
    }
}