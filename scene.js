

/*
    You know, a scene.
*/
class Scene {
    constructor() {
        this.entityManager = new EntityManager()
        this.renderSystem = new RenderSystem(this.entityManager.getEntities)
    }

    update() {

    }
     draw() {

     }
}


class PhysicsDemoScene extends Scene {
    constructor() {
        super()
        this.collisionSystem = new CollisionSystem(this.entityManager.getEntities)
    }

    init() {
        borderBlueprint({
            x: 50,
            y: 300,
            width: 500,
            height: 50
        }, this.entityManager)

        borderBlueprint({
            x: 600,
            y: 500,
            width: 500,
            height: 50
        }, this.entityManager)

        this.player = simpleDynamicBox({
            x: 300,
            y: 50,
            width: 50,
            height: 50
        }, this.entityManager)
        this.playerMovement = new PlayerInputSystem(this.player)
        this.playerCollisionResolution = new PlayerCollisionResolution(this.player)
    }

    update(input) {
        this.entityManager.update()
        this.playerMovement.update(input)
        this.collisionSystem.update()
        this.playerCollisionResolution.update()
    }
    draw(ctx) {
        this.entityManager.entities.forEach(e => {
            if(e.tag === 'border') {
                ctx.strokeStyle = 'green'
            } else {
                ctx.strokeStyle = 'black'
            }
            let c = e.components.boxCollider
            ctx.strokeRect(c.x, c.y, c.width, c.height)
        })
    }
}

class TerrainDemoScene extends Scene {
    constructor() {
        super()
        this.gridSize = 6
        this.colorScale = 255
        this.blockWidth = 32
    }

    init() {
        this.#generateNoiseMap()
        this.#generateTerrain()
    }

    update(keys) {
        this.entityManager.update()
    }

    draw(ctx) {
        this.entityManager.getEntities.forEach(e => {
            let pos = e.components.transform
            let color = e.components.color
            console.log(color.color)
            ctx.fillStyle = `rgb(${color.color}, ${color.color}, ${color.color})`
            ctx.strokeStyle = 'white'
            ctx.fillRect(pos.x, pos.y, this.blockWidth, this.blockWidth)
            ctx.strokeRect(pos.x, pos.y, this.blockWidth, this.blockWidth)
        })
    }

    #generateNoiseMap() {
        this.noiseMap = []
        for(let y = 0; y < this.gridSize; y += 1/this.gridSize) {
            let row = []
            for(let x = 0; x < this.gridSize; x += 1/this.gridSize) {
                let v = parseInt(perlin.get(x,y) * this.colorScale)
                row.push(v)
            }
            this.noiseMap.push(row)
            row = []
        }
        console.log(this.noiseMap)
    }
    #generateTerrain() {
        this.terrainMap = []
        this.noiseMap.forEach( (row, y) => {
            row.forEach((e, x) => {
                this.#createBlock({
                    x: x * this.blockWidth,
                    y: y * this.blockWidth,
                    color: e
                })
            })
        })
    }

    #createBlock(props) {
        this.entityManager.addEntity({
            tag: 'block',
            components: [
                new CTransform({
                    x: props.x,
                    y: props.y,
                }),
                new CColor(props.color)
            ]
        })
    }
}







class AnimationDemoScene extends Scene {
    constructor() {
        super()
    }

    init(sprite, input) {
        this.player = this.#createPlayer(sprite)
        this.playerStateManager = new PlayerStateManager(input, this.player)
        this.createPlayerStates()
    }

    update(input, deltaTime) {
        this.entityManager.update()
        this.playerStateManager.update(input, deltaTime)
    }

    draw(ctx) {
        this.renderSystem.draw(ctx)
    }


    /*
        I added a fps value to the sprite component so we can control
        the speed of frames.
    */
    #createPlayer(sprite) {
        let e = this.entityManager.addEntity({
            tag: 'player',
            components: [
                new CTransform({
                    x: 400,
                    y: 300,
                    maxVelocity: 10
                }),
                new CSprite(sprite, 100, 91.3, 1.5, .02),
                new CState()
            ]
        })
        return e
    }

    /*
            So basically, the pattern is, you add a state with the x and y values that
        match an animation, from the sprite sheet. The frameX is mostly always zero, the first frame.
        I created a Playerstatemanager to manage the state changes when there is inputs.
        It is under systems.
        I only mapped two buttons for two animations,
        a => roll
        d => run right
    */
    createPlayerStates() {
        this.playerStateManager.addStates([
            {
                tag: 'Running',
                state: new State({
                    frameX: 0,
                    frameY: 3,
                    maxFrames: 8
                }),
            }, {
                tag: 'Idle',
                state: new State({
                    frameX: 0,
                    frameY: 5,
                    maxFrames: 4
                })
            }, {
                tag: 'Rolling',
                state: new State({
                    frameX: 0,
                    frameY: 6,
                    maxFrames: 6
                })
            }
        ])
    }
}