/**
 * Checks for and resolves collisions between entities.
 *
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 */
class CollisionSystem {
    constructor(player, entities, projectileFactory) {
        Object.assign(this, { player, entities, projectileFactory })

        this.collideList = null;
        this.tileCollideList = null;
        this.mobList = null;
        this.tileList = null;

        this.playerAttackList = null;
        this.explosionList = null;
        this.enemyAttackList = null;

        this.refresh();
    }

    /**
     * Refreshes collide check lists.
     * Call this before resolving.
     */
    refresh() {
        this.collideList = this.entities.filter(e => e.isDrawable && e.components["boxCollider"]);
        this.tileCollideList = this.collideList.filter(e =>
                e.name === "player" || e.name === "rocket" || e.tag.includes("fire")
                || (e.tag.includes("mob") && !e.tag.includes("ghost"))
        );
        this.mobList = this.collideList.filter(e => e.tag.includes("mob"));
        this.tileList = this.collideList.filter(e => e.name === 'block');

        this.playerAttackList = this.collideList.filter(e => e.tag.includes("playerAttack"));
        this.explosionList = this.collideList.filter(e => e.name === 'explosion');
        this.enemyAttackList = this.collideList.filter(e => e.tag.includes("enemy"))
    }

    /**
     * Checks for and resolves X collisions between mobs and tiles.
     */
    resolveTileX() {
        this.tileCollideList.forEach(mob => {
            this.tileList.forEach(tile => {
                if (checkCollision(mob, tile)) {
                    const mTransform = mob.components["transform"];
                    const mCollider = mob.components["boxCollider"];
                    mCollider.sideCollision = true;
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
                if (checkCollision(mob, tile)) {
                    const mTransform = mob.components["transform"];
                    const mCollider = mob.components["boxCollider"];
                    const tCollider = tile.components["boxCollider"];
                    if (mCollider.bottom > tCollider.top && mCollider.last.bottom <= tCollider.top) {
                        if (mob.components.state) mob.components.state.grounded = true;
                        const fallDamage = mTransform.fallDamageTime * FALL_DAMAGE_MULTIPLIER;
                        if (mob.components["stats"] && mob.components["stats"].hasFallDamage
                                && mTransform.hasGravity && fallDamage !== 0) {
                            mob.components["stats"].applyDamage(fallDamage);
                        }
                        mTransform.fallDamageTime = 0;
                    }
                    mTransform.velocityY = 0
                    mTransform.y = mTransform.last.y
                    mCollider.setPosition(mTransform.x, mTransform.y)
                }
            });
        });
    }

    /**
     * Responds to attack collisions.
     */
    resolveAttack() {
        this.#resolvePlayerAttack();
        this.#resolveExplosions();
        this.#resolveEnemyAttack();
    }

    checkTileCollision(mob) {
        console.log("checking tile collision")
        let out = false;
        this.tileList.forEach(tile => {
            if (checkCollision(mob, tile)) {
                out = true;
            }
        });
        return out;
    }

    /**
     * Resolves projectile collisions.
     */
    #resolvePlayerAttack() {
        this.playerAttackList.forEach(atk => {
            this.mobList.forEach(mob => {
               if (checkCollision(atk, mob) && !mob.tag.includes('ignoreAttack')) {
                   mob.components["stats"].applyDamage(atk.components["stats"].damage);
                   mob.components["boxCollider"].attackCollision = true;
                   this.#stun(mob);
                   if (atk.tag.includes("explosive")) {
                       this.#handleExplosions(atk);
                   }
                   if (!atk.tag.includes("pierce")) {
                       atk.destroy();
                   }
               }
            });

            this.tileList.forEach(tile => {
               if (checkCollision(atk, tile)) {
                   if (atk.tag.includes("explosive")) {
                       this.#handleExplosions(atk);
                   }
                   if (!atk.tag.includes("ignoreTile")) {
                       atk.destroy();
                   }
               }
            });
        });
    }

    #resolveExplosions() {
        this.explosionList.forEach(e => {
            if (checkCollision(e, this.player)) {
                this.player.components["stats"].applyDamage(e.components["stats"].damage);
            }
            this.mobList.forEach(mob => {
                if (checkCollision(e, mob) && !mob.tag.includes('ignoreAttack')) {
                    mob.components["stats"].applyDamage(e.components["stats"].damage);
                    this.#stun(mob);
                }
            });
            this.tileList.forEach(tile => {
                if (checkCollision(e, tile)) {
                    if (e.tag.includes("destroyBlock")) {
                        // tile.components["stats"].applyDamage(e.components["stats"].damage);
                    }
                }
            });
        });
    }

    /**
     * Applies damage to player if attacked by mob.
     */
    #resolveEnemyAttack() {
        this.enemyAttackList.forEach(atk => {
            if (checkCollision(atk, this.player)) {
                this.player.components['stats'].applyDamage(atk.components['stats'].damage)
                if (atk.tag.includes("explosive")) {
                    this.#handleExplosions(atk);
                }
                if (atk.tag.includes("stun")) {
                    this.#stun(this.player);
                }
                if (atk.name === "projectile" && !atk.tag.includes("pierce")) {
                    atk.destroy();
                }
            }
            this.tileList.forEach(tile => {
                if (checkCollision(atk, tile)) {
                    if (atk.name === "projectile" && !atk.tag.includes("ignoreTile")) {
                        atk.destroy();
                    }
                }
            });
        });
    }

    /**
     * Stuns mob temporarily.
     * @param {Entity} mob Mob to stun.
     */
    #stun(mob) {
        const mTransform = mob.components["transform"];
        mTransform.velocityY = 0;
        mTransform.x = mTransform.last.x;
        if (!mTransform.hasGravity) {
            mTransform.velocityY = 0;
            mTransform.y = mTransform.last.y;
        }
        mob.components["boxCollider"].setPosition(mTransform.x, mTransform.y);
    }

    /**
     * Spawns explosion from projectile if bomb.
     * @param {Entity} p Bomb projectile.
     */
    #handleExplosions(p) {
        const origin = p.components["boxCollider"].center;
        if (p.tag === "playerAttack explosive") {
            this.projectileFactory.detonate("explosion", origin);
        } else if (p.tag === "playerAttack mini explosive") {
            this.projectileFactory.detonate("mini_explosion", origin);
        }
    }
}

/**
 * Checks for collision between 2 entities with box colliders.
 * @param {Entity | CBoxCollider} entityA     First entity.
 * @param {Entity | CBoxCollider} entityB     Second entity.
 * @returns {boolean} If entities are colliding.
 */
const checkCollision = (entityA, entityB) => {
    const a = (entityA instanceof CBoxCollider) ? entityA : entityA.components["boxCollider"];
    const b = (entityB instanceof CBoxCollider) ? entityB : entityB.components["boxCollider"];
    return a.right > b.left
        && a.left < b.right
        && a.top < b.bottom
        && a.bottom > b.top;
}
