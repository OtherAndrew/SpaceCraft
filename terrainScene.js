
class TerrainScene extends Scene {
    constructor(config) {
        super(config.width, config.height)
        this.gridSize = config.gridSize
        this.blockWidth = config.blockSize
        //Sets numerical value ranges to blocks so we can map them to the terrainMap
        // Ranges from 0 to 10 ish
        this.blockValues = [
            'solidDirt',
            'solidDirt',
            'solidDirt',
            'solidDirt',
            'solidDirt',
            'solidDirt',
            'null',
            'null',
            'null',
            'null',
        ]
    }

    /**
     * Initializes this class' terrain entities
     * Player and player movement are for testing purposes
     * @param {Image} sprite 
     */
    init(sprite) {
        this.tileSprite = sprite
        this.#generateNoiseMap()
        this.#generateTerrain()
        this.#createPlayer()
        this.playerMovement = new PlayerInputSystem(this.player)
        this.camera = new Camera(this.player, this)
        this.renderBox = new RenderBox(this.player, this.gridSize, this.blockWidth)
    }

    update(keys) {
        this.entityManager.update()
        this.playerMovement.update(keys)
        this.camera.update()
        this.renderBox.update()
        this.#updateTileState()
    }

    draw(ctx) {
        this.renderSystem.draw(ctx, this.camera)
        this.entityManager.getEntities.forEach(e => {
            if(e.components.boxCollider){
                let box = e.components.boxCollider
                ctx.fillStyle = 'rgba(200,200,100,1)'
                ctx.fillRect(box.x - this.camera.x, box.y - this.camera.y, box.width, box.height)
            }
        })
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
        for(let y = 0; y < this.gridSize; y += 1/this.gridSize) {
            let row = []
            for(let x = 0; x < this.gridSize; x += 1/this.gridSize) {
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
                    x: x * this.blockWidth,
                    y: y * this.blockWidth,
                    value: val
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
            case 'solidDirt':
                return this.entityManager.addEntity({
                    tag: 'solidDirt',
                    components: [
                        new CTransform({
                            x: props.x,
                            y: props.y,
                        }),
                        new CSprite(this.tileSprite, 18, 16, 2, 1)
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
        this.player = this.entityManager.addEntity({
            tag:'player',
            components: [
                new CTransform({
                    x: 100,
                    y: 100,
                    maxVelocity: 10
                }),
                new CBoxCollider({
                    x: this.width * .5 + 1,
                    y: this.height * .5 + 1,
                    width: 32,
                    height: 32
                }),
                new CRigidBody({mass: 1}),
                new CSprite(this.tileSprite, 16,16,2,1)
            ]
        })
    }


    /**
     * This method checks to see what is in the bounds of the view screen. 
     * Entities that are within the view screen are marked as drawable so they can be drawn to the ctx.
     * Also, calls check if exposed method to save a loop routine.
     */
    #updateTileState() {
        this.entityManager.getEntities.forEach(e => {
            if(e.tag !== 'player') {
                if(e.components.transform.x > (this.renderBox.x - 18) * 32 &&
                e.components.transform.x < (this.renderBox.x + 18) * 32 &&
                e.components.transform.y > (this.renderBox.y - 14) * 32 &&
                e.components.transform.y < (this.renderBox.y + 12) * 32) {
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
        let posX = e.components.transform.x / this.blockWidth
        let posY = e.components.transform.y / this.blockWidth
        if(this.terrainMap[posY][clamp(posX-1, 0, posX)] === 'air' ||
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