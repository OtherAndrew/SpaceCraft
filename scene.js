

/*
    You know, a scene.
*/
class Scene {
    constructor(input) {
        this.entityManager = new EntityManager()
        this.renderSystem = new RenderSystem(this.entityManager.getEntities)
    }

    update() {

    }
     draw() {

     }
}

class PhysicsDemoScene extends Scene {
    constructor(input) {
        super(input)
        this.gravitySystem = new GravitySystem(this.entityManager.getEntities)
        this.movementSystem = new MovementSystem(this.entityManager.getEntities)
    }

    init() {
        borderBlueprint({
            x: 50,
            y: 500,
            width: 900,
            height: 100
        }, this.entityManager)

        this.player = simpleDynamicBox({
            x: 300,
            y: 300,
            width: 50,
            height: 50
        }, this.entityManager)
    }

    update() {
        this.entityManager.update()
        this.player.components.transform.y += this.player.components.transform.velocityY
        this.player.components.boxCollider.x = this.player.components.transform.x
        this.player.components.boxCollider.y = this.player.components.transform.y
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

    createPlayer = (assets) => {
        let e = this.entityManager.addEntity({
            id: this.entityManager.totalEntities++,
            tag: 'player',
            components: [
                new CTransform({
                    x: this.WIDTH * .5,
                    y: this.HEIGHT * .5,
                    velocityX: 0,
                    velocityY: 0,
                    angle: 0
                }),
                new CSprite(assets['./assets/sprites/player.png'], 100,91.3, 1.5),
                new CState(),
                new CInput(),
                new CRigidBody({
                    mass: 1,
                    gravityMod: 1
                }),
                new CBoxCollider({
                    x: this.WIDTH * .5,
                    y: this.HEIGHT * .5,
                    width: Math.floor(100 * 1.5),
                    height: Math.floor(91.3 * 1.5)
                }),
                new CGravity(2)

            ]
        })
        e.components.input.entity = e
        StateManager.addStates(e, [
            {tag: 'sitting',
            state: new State({
                frameX: 0,
                frameY: 5,
                maxFrames: 4
            })},
    
            {tag: 'running',
            state: new State({
                frameX: 0,
                frameY: 3,
                maxFrames: 8
            })}
        ])
        StateManager.setState(e, 'running')
        this.player = e

}


updatePlayer() {
    // check player collisions
    this.entityManager.getEntities.forEach(e => {
        if(e.tag !== 'player') {
            if(CollisionSystem.checkCollision(this.player, e)) {
                // check which side we collided on
                let t = this.player.components.boxCollider
                let h = e.components.boxCollider
                console.log(t)
                console.log(h)
                if(t.x + t.width <= h.x ){
                    //right collision
                    console.log('right')
                } else if(h.x + h.width <= t.x) {
                    // left collision
                    console.log('left')
                } else if(t.y + t.height <= h.y) {
                    // bottom collision
                    console.log('bottom')
                    this.player.components.transform.velocityY = 0
                } else if(h.y + h.height <= t.y) {
                    // top collision
                    console.log('top')
                } else {
                    console.log('collision not handled properly')
                }
            }
        }
        
    })
}
}