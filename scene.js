

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