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
        // this.playerAttackList = null;
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
                e.name === "player" || e.name === "rocket"
                || (e.tag.includes("mob") && !e.tag.includes("ghost"))
        );

        this.mobList = this.collideList.filter(e => e.tag.includes("mob"));
        this.tileList = this.collideList.filter(e => e.name === 'block');
        this.playerAttackList = this.collideList.filter(e =>
                e.tag.includes("bullet") || e.tag.includes("bomb"));
        this.explosionList = this.collideList.filter(e => e.name === 'explosion');
        // extras
        // this.playerAttackList = this.collideList.filter(e => e.tag.includes("playerAttack"));
        this.enemyAttackList = this.collideList.filter(e => e.tag.includes("enemy"))
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

    /**
     * Responds to attack collisions.
     */
    resolveAttack() {
        this.#resolvePlayerAttack();
        this.#resolveExplosions();
        this.#resolveEnemyAttack();
    }

    /**
     * Resolves projectile collisions.
     */
    #resolvePlayerAttack() {
        this.playerAttackList.forEach(p => {

            this.mobList.forEach(mob => {
               if (this.checkCollision(p, mob) && !mob.tag.includes('ignore')) {
                   mob.components["stats"].applyDamage(p.components["stats"].damage);
                   this.#stun(mob);
                   if (p.tag.includes("bomb")) {
                       this.#handleExplosions(p);
                   }
                   if (!p.tag.includes("fire")
                            && !p.tag.includes("explosion")
                            && !p.tag.includes("railgun")) {
                       p.destroy();
                   }
               }
            });

            this.tileList.forEach(tile => {
               if (this.checkCollision(p, tile)) {
                   // only big explosions can destroy blocks
                   if (p.tag === "bullet_explosion") {
                       // tile.destroy();
                   }
                   if (p.tag.includes("bomb")) {
                       this.#handleExplosions(p);
                   }
                   if (!p.tag.includes("explosion")
                            && !p.tag.includes("railgun")) {
                       p.destroy();
                   }
               }
            });
        });
    }

    #resolveExplosions() {
        this.explosionList.forEach(e => {
            if (this.checkCollision(e, this.player)) {
                if (e.tag.includes("explosion")) {
                    this.player.components["stats"].applyDamage(p.components["stats"].damage);
                }
                // this.#handleExplosions(p)
            }
            this.mobList.forEach(mob => {
                if (this.checkCollision(e, mob) && !mob.tag.includes('ignore')) {
                    mob.components["stats"].applyDamage(e.components["stats"].damage);
                    this.#stun(mob);
                }
            });

            this.tileList.forEach(tile => {
                if (this.checkCollision(e, tile)) {
                    // only big explosions can destroy blocks
                    if (e.tag === "bullet_explosion") {
                        // tile.destroy();
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
            if (this.checkCollision(atk, this.player)) {
                this.player.components['stats'].applyDamage(atk.components['stats'].damage)
                if (atk.tag === "enemyAttack") {
                    atk.destroy();
                }
            }
            this.tileList.forEach(tile => {
                if (this.checkCollision(atk, tile) && atk.tag === "enemyAttack") {
                    atk.destroy();
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
        if (!mTransform.gravity) {
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
        if (p.tag === "bomb") {
            this.projectileManager.detonate("explosion", origin);
        } else if (p.tag === "mini_bomb") {
            this.projectileManager.detonate("mini_explosion", origin);
        }
    }

    /**
     * Checks for collision between 2 entities with box colliders.
     * @param {Entity} entityA     First entity.
     * @param {Entity} entityB     Second entity.
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