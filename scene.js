

/*
    You know, a scene.
*/
class Scene {
    constructor(width, height) {
        this.WIDTH = width,
        this.HEIGHT = height
        this.entityManager = new EntityManager()
        this.renderSystem = new RenderSystem(this.entityManager.getEntities)
    }

    update() {

    }
     draw() {

     }
}


class PhysicsDemoScene extends Scene {
    constructor(width, height) {
        super(width, height)
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
            x: 50,
            y: 0,
            width: 50,
            height: 50
        }, this.entityManager)
        this.playerMovement = new PlayerInputSystem(this.player)
        this.playerCollisionResolution = new PlayerCollisionResolution(this.player)
        this.camera = new Camera(this.player, this)
    }

    update(input) {
        this.entityManager.update()
        this.playerMovement.update(input)
        this.collisionSystem.update()
        this.playerCollisionResolution.update()
        this.camera.update()
        console.log(this.player.components.transform)
    }
    draw(ctx) {
        this.entityManager.entities.forEach(e => {
            if(e.tag === 'border') {
                ctx.strokeStyle = 'green'
            } else {
                ctx.strokeStyle = 'black'
            }
            let c = e.components.boxCollider
            ctx.strokeRect(c.x - this.camera.x - 50, c.y - this.camera.y - 60 , c.width, c.height)
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
                    x: this.width * .5 + 1,
                    y: this.height * .5 + 1,
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