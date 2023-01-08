

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
    }

    init() {
        this.terrainMap = this.#generateMap()
        this.#createTerrainEntities()
    }

    update() {
        this.entityManager.update()
    }

    draw(ctx) {
        this.entityManager.getEntities.forEach(e => {
            if(e.tag === 'blue') {
                ctx.fillStyle = 'blue'
            } else if (e.tag === 'brown') {
                ctx.fillStyle = 'green'
            }
            let c = e.components.transform
            ctx.strokeRect(c.x, c.y, c.x + 32, c.y + 32)
            ctx.fillRect(c.x, c.y, c.x + 32, c.y + 32)
        })
    }

    #generateMap() {
        const blockWidth = 32
        const blockHeight = 24
        const tMap = []
        for(let i = 0; i < blockHeight; i++) {
            let row = []
            for(let j = 0; j < blockWidth; j++) {
                if(i < 15) {
                    row.push('blue')
                } else {
                    row.push('brown')
                }
                
            }
            tMap.push(row)
        }
        return tMap
    }

    // 32 width blocks by 24 blocks
    #createTerrainEntities() {
        const blockWidth = 32
        const blockHeight = 24
        for(let i = 0; i < this.terrainMap.length; i++) {
            let row = this.terrainMap[i]
            for(let j = 0; j < row.length; j++) {
                let props = {
                    x: 32 * j,
                    y: 32 * i,
                    width: 32,
                    height: 32,
                    color: this.terrainMap[i][j]
                }
                this.#createTile(props)
            }
        }
    }

    #createTile(props) {
        let components = []

        if(props.color === 'brown') {
            components.push(new CBoxCollider({
                x: props.x,
                y: props.y,
                width: props.width,
                height: props.height
            }))
        }
        components.push(new CTransform({
            x: props.x,
            y: props.y,
            velocityX: 0,
            velocityY: 0,
            angle: 0
        }))

        this.entityManager.addEntity({
            tag: props.color,
            components: components
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