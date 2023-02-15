/**
 * Checks for and resolves collisions between entities.
 *
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 */
class CollisionSystem {
    constructor(player, entities, projectileManager) {
        this.player = player;
        this.entities = entities;
        this.projectileManager = projectileManager;

        this.collideList = null;
        this.tileCollideList = null;
        this.mobList = null;
        this.tileList = null;
        //extras
        this.playerAttackList = null;
        this.mobAttackList = null;
        this.projectileList = null;

        this.refresh();
    }

    /**
     * Refreshes collide check lists.
     * Call this before resolving.
     */
    refresh() {
        this.collideList = this.entities.filter(e => /*e.isDrawable &&*/ e.components["boxCollider"]);
        this.tileCollideList = this.collideList.filter(e =>
                   e.tag.includes("player") || e.tag.includes("rocket")
                || (e.tag.includes("mob") && !e.tag.includes("ghost"))
        );

        this.mobList = this.collideList.filter(e => e.tag.includes("mob"));
        this.tileList = this.collideList.filter(e => e.tag.includes("tile"));
        this.projectileList = this.collideList.filter(e => e.tag.includes("bullet") || e.tag.includes("bomb"));
        // extras
        // this.playerAttackList = this.collideList.filter(e => e.tag.includes("playerAttack"));
        this.mobAttackList = this.collideList.filter(e => e.tag.includes("enemy")
                                                       || e.tag.includes("enemyAttack"));


    }

    /**
     * Checks for and resolves X collisions between mobs and tiles.
     */
    resolveTileX() {
        this.tileCollideList.forEach(mob => {
            this.tileList.forEach(tile => {
                if (this.checkCollision(mob, tile)) {
                    const mTransform = mob.components["transform"];
                    const mCollider = mob.components["boxCollider"];
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
                if (this.checkCollision(mob, tile)) {
                    const mTransform = mob.components["transform"];
                    const mCollider = mob.components["boxCollider"];
                    const tCollider = tile.components["boxCollider"];
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

    //draft
    resolvePlayerAttack() {
        this.playerAttackList.forEach(atk => {
           this.tileCollideList.forEach(mob => {
               if (this.checkCollision(atk, mob)) {
                   // handle attack
               }
           });
        });
    }

    //draft
    resolveMobAttack() {
        this.mobAttackList.forEach(atk => {
            if (this.checkCollision(atk, this.player)) {
                this.player.components['stats'].applyDamage(atk.components['stats'].damage)
                // this.player.components['stats'].applyDamage(atk.components['stats'].doDamage());
                // console.log(atk.components['stats'].damage)
                // console.log(this.player.components['stats'].currentHealth)
            }
        });
    }

    /**
     * Resolves projectile collisions.
     */
    resolveProjectiles() {
        this.projectileList.forEach(p => {
            this.mobList.forEach(mob => {
               if (this.checkCollision(p, mob) && !mob.tag.includes('ignore')) {
                   // damage mob
                   mob.components["stats"].applyDamage(p.components["stats"].damage);
                   // freeze mob in place when hit
                   const mTransform = mob.components["transform"];
                   mTransform.velocityY = 0
                   mTransform.x = mTransform.last.x;
                   if (!mTransform.gravity) {
                       mTransform.velocityY = 0
                       mTransform.y = mTransform.last.y;
                   }
                   mob.components["boxCollider"].setPosition(mTransform.x, mTransform.y)

                   if (p.tag.includes("bomb")) {
                       this.projectileManager.shoot("explosion",
                           { x: p.components["boxCollider"].center.x, y:  p.components["boxCollider"].center.y }, p);
                   }
                   if (!p.tag.includes("fire") && !p.tag.includes("explosion")) p.destroy();
               }
            });
            this.tileList.forEach(tile => {
               if (this.checkCollision(p, tile)) {
                   if (p.tag.includes("explosion")) {
                       // tile.destroy();
                   } else if (p.tag.includes("bomb")) {
                       this.projectileManager.shoot("explosion",
                           { x: p.components["transform"].x, y:  p.components["transform"].y }, p);
                       p.destroy();
                   } else {
                       p.destroy();
                   }
               }
            });
        });
    }

    // touchingRocket() {
    //     return this.checkCollision(this.player, this.rocket)
    // }

    /**
     * Checks for collision between 2 entities with box colliders.
     * @param entityA     First entity.
     * @param entityB     Second entity.
     * @returns {boolean} If entities are colliding.
     */
    checkCollision(entityA, entityB) {
        const a = entityA.components["boxCollider"];
        const b = entityB.components["boxCollider"];
        return a.right > b.left
            && a.left < b.right
            && a.top < b.bottom
            && a.bottom > b.top;
    }

}