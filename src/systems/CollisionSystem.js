// Variety of ways to check for a collection
class CollisionSystem {
    constructor(player, entities) {
        this.player = player;
        this.entities = entities;

        this.collideList = null;
        this.tileCollideList = null;
        this.tileList = null;
        this.playerAttackList = null;
        this.mobAttackList = null;
        this.projectileList = null;

        this.refresh();
    }

    /**
     * Refreshes collide check lists.
     */
    refresh() {
        this.collideList = this.entities.filter(e => e.isDrawable && e.components.boxCollider);
        this.mobList = this.collideList.filter(e => e.tag.includes("mob"));
        this.tileList = this.collideList.filter(e => e.tag.includes("tile"));
        this.tileCollideList = this.collideList.filter(e => e.tag.includes("player")
                                                         || e.tag.includes("mob"));
        this.playerAttackList = this.collideList.filter(e => e.tag.includes("playerAttack"));
        this.mobAttackList = this.collideList.filter(e => e.tag.includes("enemy")
                                                       || e.tag.includes("enemyAttack"));
        this.projectileList = this.collideList.filter(e => e.tag.includes("playerAttack")
                                                        || e.tag.includes("enemyAttack"));
    }

    /**
     * Checks for and resolves X collisions between mobs and tiles.
     */
    resolveTileX() {
        this.tileCollideList.forEach(mob => {
            this.tileList.forEach(tile => {
                if (this.#checkCollision(mob, tile)) {
                    const mTransform = mob.components.transform;
                    const mCollider = mob.components.boxCollider;
                    mTransform.velocityX = 0
                    mTransform.x = mTransform.last.x
                    mCollider.setPosition(mTransform.x, mTransform.y)
                }
            });
        });
    }

    /**
     * Checks for and resolves Y collisions between mobs and tiles.
     */
    resolveTileY() {
        this.tileCollideList.forEach(mob => {
            this.tileList.forEach(tile => {
                if (this.#checkCollision(mob, tile)) {
                    const mTransform = mob.components.transform;
                    const mCollider = mob.components.boxCollider;
                    const tCollider = tile.components.boxCollider;
                    mTransform.velocityY = 0
                    mTransform.y = mTransform.last.y
                    if (mCollider.bottom > tCollider.top && mCollider.last.bottom <= tCollider.top) {
                        mob.components.state.grounded = true;
                    }
                    mCollider.setPosition(mTransform.x, mTransform.y)
                }
            });
        });
    }

    // resolve player attack
    resolvePlayerAttack() {
        this.playerAttackList.forEach(atk => {
           this.mobList.forEach(mob => {
               if (this.#checkCollision(atk, mob)) {
                   // handle attack
               }
           });
        });
    }

    resolveMobAttack() {
        this.mobAttackList.forEach(atk => {
            if (this.#checkCollision(atk, this.player)) {
                // handle attack
            }
            this.tileList.forEach(tile => {
               if (this.#checkCollision(atk, tile) && atk.tag.includes("enemyAttack")) {
                   // remove
               }
            });
        });
    }

    resolveProjectiles() {
        this.projectileList.forEach(p => {
            if (this.#checkCollision(p, this.player)) {
                // damage player
            }
            this.mobList.forEach(mob => {
               if (this.#checkCollision(p, mob)) {
                   // damage mob
               }
            });
            this.tileList.forEach(tile => {
               if (this.#checkCollision(p, tile)) {
                   // remove projectile
               }
            });
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