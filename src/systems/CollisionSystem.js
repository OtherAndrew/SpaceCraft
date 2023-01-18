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