

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
class StateManager {

    static addStates(entity, props) {
        props.forEach( o => {
            entity.components.state.states.set(o['tag'], o['state'])
        })
    }
    
    static setState(entity, s) {
        let state = entity.components.state
        state.currentState = state.states.get(s)
        state.currentState.enter(entity.components.sprite)
    }
    
}


// Not sure if this should be a system
class inputManager {

}


// Variety of ways to check for a collection
class CollisionSystem {
    constructor(entities) {
        this.entities = entities
    }
    update() {
        
    }
    
    //Collision between two Rectangles, does not return direction of collision
    #checkCollision(entityA, entityB) {
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


    /*
    static checkCollision(e, entities) {
        for()
    }
    */

    // Checks if point is within a rectangle
    static pointInRect = (point, rect) => {
        return (point.x >= rect.x && point.y >= rect.y && point.x < rect.x + rect.width && point.y < rect.y + rect.height)
    }

    static dynamicRectCollision() {

    }
    // Helper function for dynamicCollision. A ray is used from a dynamic rectangle origin to another body to check for a collision,
    // returns direction of collision
    static #rayCastCollision(rayOrigin, rayDirection, rect) {

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


//Not sure if gravity should be a system
class GravitySystem {
    constructor(entities) {
        this.entities = entities
    }
    update() {
        this.entities.forEach(e => {
            if(e.components.gravity) {
                e.components.transform.velocityY += e.components.gravity.gravityForce
            }
        })
    }
}

class MovementSystem {
    constructor(entities) {
        this.entities = entities
    }
    update() {
        this.entities.forEach(e => {
            if(e.components.rigidBody) {
                let t = e.components.transform
                if(t.velocityX > t.maxVelocity) {
                    t.velocityX = t.maxVelocity
                } if(t.velocityY > t.maxVelocity) {
                    t.velocityY = t.maxVelocity
                }
                t.x += t.velocityX
                t.y += t.velocityY
                if(e.components.boxCollider) {
                    let col = e.components.boxCollider
                    col.x = t.x
                    col.y = t.y
                }
            }
        })
    }
}

/*
class ForceSystem {
    constructor(entities) {
        this.entities = entities
    }

    update() {
        this.entities.forEach(e => {
            if(e.components.force) {
                let f = e.components.force
                this.entities.forEach(c => {
                    if(c.id !== e.id) {
                        if(c.components.rigidBody) {
                            let acceleration = f.force/c.components.rigidBody.mass
                            let vx = c.components.transform.vx
                            let vy = c.components.transform.vy
                            let maxVelocity = c.components.transform.maxVelocity
                            let a = c.components.transform.x - e.components.force.origin.x
                            let b = c.components.transform.y - e.components.force.origin.y
                            let distance = Math.sqrt((a*a) + (b*b))
                            let normalizedA = a/distance
                            let normalizedB = b/distance
                            let newX = c.components.transform.x += normalizedA * acceleration * -1
                            let newY = c.components.transform.y += normalizedB * acceleration * -1
                            console.log(` a: ${a}, b: ${b}, distance: ${distance}, normalizedA: ${normalizedA}, normalizedB:${normalizedB}, newX: ${newX}, newY: ${newY}, acc: ${acceleration}`)
                            console.log('\n')
                        }
                    }
                })
            }
        })
    }
}

*/

