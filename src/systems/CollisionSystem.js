// Variety of ways to check for a collection
class CollisionSystem {
    constructor(player, entities) {
        this.player = player
        this.entities = entities
        this.mobCollisionList = ["player", "mob"];
    }

    updateTileY() {
        const collideList = this.entities.filter(e => e.isDrawable && e.components.boxCollider);
        collideList.forEach(a => {
            if (this.mobCollisionList.some(mob => a.tag.includes(mob))) {
                const tileList = collideList.filter(e => e.tag.includes('tile'));
                tileList.forEach(b => {
                    if (this.#checkCollision(a, b) && a.id !== b.id) {
                        const aTransform = a.components.transform;
                        const aCollider = a.components.boxCollider;
                        const bCollider = b.components.boxCollider;
                        aTransform.velocityY = 0
                        aTransform.y = aTransform.last.y
                        if (aCollider.bottom > bCollider.top && aCollider.last.bottom <= bCollider.top) {
                            a.components.state.grounded = true;
                        }
                        aCollider.setPosition(aTransform.x, aTransform.y)
                    }
                });
            }
        });
    }

    updateTileX() {
        const collideList = this.entities.filter(e => e.isDrawable && e.components.boxCollider);
        collideList.forEach(a => {
            if (this.mobCollisionList.some(mob => a.tag.includes(mob))) {
                const tileList = collideList.filter(e => e.tag.includes('tile'));
                tileList.forEach(b => {
                    if (this.#checkCollision(a, b) && a.id !== b.id) {
                        const aTransform = a.components.transform;
                        const aCollider = a.components.boxCollider;
                        aTransform.velocityX = 0
                        aTransform.x = aTransform.last.x
                        aCollider.setPosition(aTransform.x, aTransform.y)
                    }
                });
            }
        });
    }

    /**
     * Checks for collision between 2 entities with box colliders.
     * @param entityA     First entity.
     * @param entityB     Second entity.
     * @returns {boolean} If entities are colliding.
     */
    #checkCollision(entityA, entityB) {
        const a = entityA.components.boxCollider;
        const b = entityB.components.boxCollider;
        return a.right > b.left
            && a.left < b.right
            && a.top < b.bottom
            && a.bottom > b.top;
    }

}