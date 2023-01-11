

/*
A collection of systems that handle the updating of entity components.
*/


// Draws entities that have sprites
class RenderSystem {
    constructor(entities) {
        this.entities = entities
    }

    draw(ctx) {

        this.entities.forEach(e => {
            if(e.components.transform) {
                let sprite = e.components.sprite
                ctx.drawImage(
                    sprite.sprite,
                    sprite.frameX * sprite.spriteWidth,
                    sprite.frameY * sprite.spriteHeight,
                    sprite.spriteWidth,
                    sprite.spriteHeight,
                    e.components.transform.x,
                    e.components.transform.y,
                    sprite.resizeWidth,
                    sprite.resizeHeight        
                )

                } else {
                console.log(this.tag, 'requires CTransform component to be drawable')
                }
        })
        
    }

    update() {
        this.entities.forEach(e => {
            let sprite = e.components.sprite
            if(sprite.frameX >= sprite.maxFrames) {
                sprite.frameX = 0
            } else {
                sprite.frameX++
            }
        })
        
    }
}


// Changes state of an entity. Usually used to change an animation
class PlayerStateManager {

    constructor(input, player) {
        this.input = input
        this.playerSprite = player.components.sprite
        this.playerState = player.components.state
    }

    addStates(props) {
        props.forEach( o => {
            this.playerState.states.set(o['tag'], o['state'])
        })
    }
    
    setState(s) {
        this.playerState.currentState = s
        this.enter(this.playerState.states.get(s))
    }

    enter(state) {
        this.playerSprite.frameX = state.frameX
        this.playerSprite.frameY = state.frameY
        this.playerSprite.maxFrames = state.maxFrames
    }
    update(input, deltaTime) {
        if(this.playerSprite.frameTimer > this.playerSprite.frameInterval) {
            this.playerSprite.frameTimer = 0
            if(this.playerSprite.frameX < this.playerSprite.maxFrames) {
                this.playerSprite.frameX++
                
            } else {
                this.playerSprite.frameX = 0
            }
        } else {
            this.playerSprite.frameTimer += deltaTime
        }
        console.log(this.playerSprite.frameTimer)
        if(input['d']) {
            if(this.playerState.currentState !== 'Running') {
                this.setState('Running')
            }
        } else if(input['a']) {
                if(this.playerState.currentState !== 'Rolling') {
                    this.setState('Rolling')
                }
        } else {
            if(this.playerState.currentState !== 'Idle') {
                this.setState('Idle')
            }
        }
    }
    
}

class PlayerCollisionResolution {
    constructor(player) {
        this.playerComponents = player.components
        this.collisions = this.playerComponents.boxCollider.collisions
    }
    update() {
        for(let e in this.collisions) {
            if(e === 'ground') {
                this.playerComponents.rigidBody.isGrounded = this.collisions[e]
                this.collisions[e] = false
            }
        }
    }
}

// Variety of ways to check for a collection
class CollisionSystem {
    constructor(entities) {
        this.entities = entities
        this.collisions = []
    }
    update() {
        this.entities.forEach(e => {
            if(e.tag === 'player') {
                this.entities.forEach(t => {
                    if(e.id !== t.id) {
                        if(this.boxCollision(e, t)) {
                            e.components.boxCollider.collisions[t.tag] = true
                        }
                    }
                })
            }
            
        })
    }
    
    //Collision between two Rectangles, does not return direction of collision
    boxCollision(entityA, entityB) {
        if(entityA.components.boxCollider && entityB.components.boxCollider) {
            let a = entityA.components.boxCollider
            let b = entityB.components.boxCollider
            if(a.x < b.x + b.width &&
                a.x + a.width > b.x &&
                a.y < b.y + b.height &&
                a.y + a.height > b.y) {
                    return true
                }
        }
    }

    // Checks if point is within a rectangle
    pointInRect = (point, rect) => {
        return (point.x >= rect.x && point.y >= rect.y && point.x < rect.x + rect.width && point.y < rect.y + rect.height)
    }

    dynamicRectCollision(a, b) {

        const expandedRect = {
            x: b.x - a.x / 2,
            y: b.y - a.y / 2,
            width: b.width + a.width,
            height: b.height + a.height
        }

        return this.#rayCastCollision({
            x: a.x + a. width / 2,
            y: a.y + a.height / 2
        }, {
            x: a.velocityX,
            y: a.velocityY
        }, expandedRect
        
        )
    }
    // Helper function for dynamicCollision. A ray is used from a dynamic rectangle origin to another body to check for a collision,
    // returns direction of collision
    #rayCastCollision(rayOrigin, rayDirection, rect) {

        let timeNear = {
            x: (rect.x - rayOrigin.x) / rayDirection.x,
            y: (rect.y - rayOrigin.y) / rayDirection.y
        }
        let timeFar = {
            x: (rect.x + rect.width - rayOrigin.x) / rayDirection.x,
            y: (rect.y + rect.height - rayOrigin.y) / rayDirection.y
        }
        if(timeNear.x > timeFar.x) {
            let temp = timeNear.x
            timeNear.x = timeFar.x
            timeFar.x = temp
        }
        if(timeNear.y > timeFar.y) {
            let temp = timeNear.y
            timeNear.y = timeFar.y
            timeFar.y = temp
        }
        if(timeNear.x > timeFar.y || timeNear.y > timeFar.x) {
            return false
        }
    
        let timeHitNear = Math.max(timeNear.x, timeNear.y)
        let timeHitFar = Math.min(timeFar.x, timeFar.y)
        if(timeHitFar < 0) return false
    
    
        let contactNormal = {
            x: 0,
            y: 0
        }
        let contactPoint = {
            x: rayOrigin.x + timeHitNear * rayDirection.x,
            y: rayOrigin.y + timeHitNear * rayDirection.y
        }
    
        if(timeNear.x > timeNear.y) {
            if(rayDirection.x < 0) {
                contactNormal.x = 1
            } else {
                contactNormal.x = -1
            } 
        } else if (timeNear.x < timeNear.y) {
            if(rayDirection.y < 0) {
                contactNormal.y = 1
            } else {
                contactNormal.y = -1
            }       
        }
        
        return true, {contactNormal: contactNormal, contactPoint: contactPoint, hit: timeHitNear}
    }



}

class PlayerInputSystem {
    constructor(player) {
        this.player = player
        this.playerPos = this.player.components.transform
        this.hitBox = this.player.components.boxCollider
        this.speed = 2
        this.gravity = 0
    }
    /**
     * Controlls
     * a - move left
     * d - move right
     * " " - jump
     * @param {input params} input 
     */
    update(input) {

        if(input['a']) {
            this.playerPos.velocityX = clamp(this.playerPos.velocityX - this.speed, -this.playerPos.maxVelocity, 0)
        } else if(input['d']) {
            this.playerPos.velocityX = clamp(this.playerPos.velocityX + this.speed, 0, this.playerPos.maxVelocity)
        } else if(input['w']) {
            this.playerPos.velocityY = clamp(this.playerPos.velocityY - this.speed, -this.playerPos.maxVelocity, 0)
        }else if(input['s']) {
            this.playerPos.velocityY = clamp(this.playerPos.velocityY + this.speed, 0, this.playerPos.maxVelocity)
        } else {
            this.playerPos.velocityX === 0 ? this.playerPos.velocityX = 0 : (this.playerPos.velocityX > 0 ? this.playerPos.velocityX -= this.speed : this.playerPos.velocityX += this.speed)
            this.playerPos.velocityY === 0 ? this.playerPos.velocityY = 0 : (this.playerPos.velocityY > 0 ? this.playerPos.velocityY -= this.speed : this.playerPos.velocityY += this.speed)     
        }
        if(input[' '] && this.player.components.rigidBody.isGrounded) {
            this.playerPos.velocityY = -10
            this.player.components.rigidBody.isGrounded = false
        }

        if(!this.player.components.rigidBody.isGrounded) {
            this.playerPos.velocityY += this.gravity
        } else if(this.player.components.rigidBody.isGrounded) {
            this.playerPos.velocityY = 0 
        }

        // move hitbox with player
        this.playerPos.x += this.playerPos.velocityX
        this.playerPos.y += this.playerPos.velocityY
        this.hitBox.x = this.playerPos.x
        this.hitBox.y = this.playerPos.y
    }
}
