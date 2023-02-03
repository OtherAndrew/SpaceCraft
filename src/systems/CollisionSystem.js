// Variety of ways to check for a collection
class CollisionSystem {
    constructor(player, entities) {
        this.entities = entities
        this.player = player
        this.collisions = []
        this.directions = {
            UP: [-135,-45],
            DOWN: [45,135],
            UP_LEFT: [-180,-135],
            DOWN_LEFT: [135, 180],
            UP_RIGHT: [-45, 0],
            DOWN_RIGHT: [0, 45]
        }
    }
    update() {
        const pCollider = this.player.components.boxCollider;
        const pTransform = this.player.components.transform;
        this.entities.forEach(e => {
            if(e.isDrawable && this.player.id !== e.id && e.components.boxCollider) {
                const eCollider = e.components.boxCollider
                if(this.boxCollision(this.player, e)) {
                    if(e.tag.includes('tile')) {
                        this.player.components.boxCollider.collisions[e.tag] = {
                            pos: e.components.boxCollider,
                            dir: this.#checkDirection(this.player, e)
                        }
                        // if (pTransform.velocityY > 0) { // falling
                        //     if (pCollider.last.bottom <= eCollider.top) { // was above
                        //         pTransform.velocityY = 0
                        //         pTransform.y = pTransform.lastY
                        //         this.player.components.state.isGrounded = true
                        //     } else {
                        //         this.player.components.state.isGrounded = false
                        //     }
                        // }
                        // if (pTransform.velocityY < 0) { // jumping
                        //     if (pCollider.last.top >= eCollider.bottom) { // was below
                        //         pTransform.velocityY = 0
                        //         pTransform.y = pTransform.lastY
                        //     }
                        // }
                        // if (pTransform.velocityX < 0) { // left
                        //     if (pCollider.last.left >= eCollider.right) { // was left
                        //         pTransform.velocityX = 0
                        //         pTransform.x = pTransform.lastX
                        //     }
                        // }
                        // if (pTransform.velocityX > 0) { // right
                        //     if (pCollider.last.right <= eCollider.left) { // was right
                        //         pTransform.velocityX = 0
                        //         pTransform.x = pTransform.lastX
                        //     }
                        // }
                    } else {
                        pCollider.collisions[e.tag] = true
                    }
                }
                this.#playerCollisionResolution(this.player)
            }
        });
    }

    #playerCollisionResolution(player) {
        let collisions = player.components.boxCollider.collisions
        for(let e in collisions) {
            if(e.includes('tile') && collisions[e].dir.length > 0) {
                collisions[e].dir.forEach(dir => {
                    if(dir === 'DOWN') {
                        player.components.transform.velocityY = 0
                        player.components.transform.y = player.components.transform.lastY
                        player.components.state.isGrounded = true
                    } else {
                        player.components.state.isGrounded = false
                        if (dir === 'UP') {
                            player.components.transform.velocityY = 0
                            player.components.transform.y = player.components.transform.lastY
                        } else if (dir === 'UP_RIGHT' || dir === 'DOWN_RIGHT') {
                            player.components.transform.velocityX = 0
                            player.components.transform.x = player.components.transform.lastX
                        } else if (dir === 'UP_LEFT' || dir === 'DOWN_LEFT') {
                            player.components.transform.velocityX = 0
                            player.components.transform.x = player.components.transform.lastX
                        } else {

                        }
                    }
                });
                collisions[e].dir.length = 0;
            }
        }
    }

    //Collision between two Rectangles, does not return direction of collision
    boxCollision(entityA, entityB) {

        let a = entityA.components.boxCollider
        let b = entityB.components.boxCollider
        // let futurePos = {
        //     x: a.x + (entityA.components.transform.velocityX * deltaTime),
        //     y: a.y + (entityA.components.transform.velocityY * deltaTime)
        // }
        return a.right > b.left
            && a.left < b.right
            && a.top < b.bottom
            && a.bottom > b.top;
    }

    /**
     * Checks which side the collision occurs.
     * entityA is the player.
     * @param {Entity} entityA 
     * @param {Entity} entityB 
     * @return {Array} of directions
     */
    #checkDirection(entityA, entityB) {
        let a = entityA.components.boxCollider
        let b = entityB.components.boxCollider
        let midPointA = {
            x: a.x + (a.width * .5),
            y: a.y + (a.height * .5)
        }
        let midPointB = {
            x: b.x + (b.width * .5),
            y: b.y + (b.height * .5)
        }
        let degree = getDirection(midPointA, midPointB)
        let result = []
        for(let dir in this.directions) {
            if(isBetween(degree, this.directions[dir][0], this.directions[dir][1])) {
                result.push(dir)
            }
        }
       return result
    }

    // Checks if point is within a rectangle
    pointInRect = (point, rect) => {
        return (point.x >= rect.x && point.y >= rect.y && point.x < rect.x + rect.width && point.y < rect.y + rect.height)
    }
}