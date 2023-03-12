/**
 * Checks for and resolves collisions between entities.
 *
 * @author Mario Flores Vences
 * @author Andrew Nguyen
 */
class CollisionSystem {
    constructor(player, entities, projectileFactory) {
        Object.assign(this, { player, entities, projectileFactory })

        this.tileCollideList = [];
        this.mobList = [];
        this.tileList = [];

        this.playerAttackList = [];
        this.explosionList = [];
        this.enemyAttackList = [];

        this.refresh();
    }

    /**
     * Refreshes collide check lists.
     * Call this before resolving.
     */
    refresh() {
        this.tileCollideList = [];
        this.mobList = [];
        this.tileList = [];

        this.playerAttackList = [];
        this.explosionList = [];
        this.enemyAttackList = [];

        for (let i = 0; i < this.entities.length; i++) {
            const e = this.entities[i];
            if (e.isDrawable && e.components["boxCollider"]) {
                if (this.#canCollideWithTiles(e)) {
                    this.tileCollideList.push(e);
                }
                if (e.tag.includes('mob')) {
                    this.mobList.push(e);
                }
                if (e.name === 'block') {
                    this.tileList.push(e);
                }
                if (e.tag.includes("playerAttack")) {
                    this.playerAttackList.push(e);
                }
                if (e.name === 'explosion') {
                    this.explosionList.push(e);
                }
                if (e.tag.includes("enemy")) {
                    this.enemyAttackList.push(e);
                }
            }
            if (e.name === 'border') {
                this.tileList.push(e);
            }
        }
    }

    /**
     * Determines if an entity is able to collide with a tile.
     * @param {Entity} e The entity.
     * @return {boolean} True if the entity is able to collide with a tile, false otherwise.
     */
    #canCollideWithTiles(e) {
        return e.name === "player" || e.tag.includes("npc") || e.tag.includes("fire")
               || (e.tag.includes("mob") && !e.tag.includes("ghost"));
    }

    /**
     * Checks for and resolves X collisions between entities and tiles.
     */
    resolveTileX() {
        for (let i = 0; i < this.tileCollideList.length; i++) {
            const entity = this.tileCollideList[i];
            const eTransform = entity.components["transform"];
            if (eTransform.velocityX === 0) continue;
            for (let j = 0; j < this.tileList.length; j++) {
                if (checkCollision(entity, this.tileList[j])) {
                    const eCollider = entity.components["boxCollider"];
                    eCollider.sideCollision = true;
                    eTransform.velocityX = 0;
                    eTransform.x = eTransform.last.x;
                    eCollider.setPosition(eTransform.x, eTransform.y);
                    if (this.tileList[j].name === 'border' && entity.name === 'player') {
                        entity.components["stats"].applyDamage(0.33);
                        this.#playHitSound(0.33);
                    }
                    break;
                }
            }
        }
    }

    /**
     * Checks for and resolves Y collisions between entities and tiles.
     */
    resolveTileY() {
        for (let i = 0; i < this.tileCollideList.length; i++) {
            const entity = this.tileCollideList[i];
            const eTransform = entity.components["transform"];
            if (eTransform.velocityY === 0) continue;
            for (let j = 0; j < this.tileList.length; j++) {
                if (checkCollision(entity, this.tileList[j])) {
                    const eCollider = entity.components["boxCollider"];
                    const tCollider = this.tileList[j].components["boxCollider"];
                    if (this.#bottomCollision(eCollider, tCollider)) {
                        if (entity.components.state) entity.components.state.grounded = true;
                        this.#fallDamage(entity);
                    }
                    eTransform.velocityY = 0;
                    if (entity.name === 'player' && this.#topCollision(eCollider, tCollider)) {
                        eTransform.y += tCollider.bottom - eCollider.top;
                    } else {
                        eTransform.y = eTransform.last.y;
                    }
                    eCollider.setPosition(eTransform.x, eTransform.y);
                    break;
                }
            }
        }
    }

    /**
     * Applies fall damage to entity.
     * @param {Entity} entity The entity.
     */
    #fallDamage(entity) {
        const eTransform = entity.components["transform"];
        const fallDamage = eTransform.fallDamageTime * FALL_DAMAGE_MULTIPLIER;
        if (entity.components["stats"]
                && entity.components["stats"].hasFallDamage
                && eTransform.hasGravity
                && fallDamage !== 0) {
            entity.components["stats"].applyDamage(fallDamage);
            if (entity.name === 'player') ASSET_MANAGER.playAsset(SOUND_PATH.FALL_DAMAGE);
        }
        eTransform.fallDamageTime = 0;
    }

    /**
     * Detects bottom collision.
     * @param {CBoxCollider} eCollider Entity collider.
     * @param {CBoxCollider} tCollider Tile collider.
     * @return {boolean} If tile is colliding with bottom of entity.
     */
    #bottomCollision(eCollider, tCollider) {
        return eCollider.bottom > tCollider.top && eCollider.last.bottom <= tCollider.top;
    }

    /**
     * Detects top collision.
     * @param {CBoxCollider} eCollider Entity collider.
     * @param {CBoxCollider} tCollider Tile collider.
     * @return {boolean} If tile is colliding with top of entity.
     */
    #topCollision(eCollider, tCollider) {
        return eCollider.top < tCollider.bottom && eCollider.last.top >= tCollider.bottom;
    }

    /**
     * Resolves attack collisions from all sources (player, enemy, explosions) and
     * applies damage accordingly.
     */
    resolveAttack() {
        this.#resolvePlayerAttack();
        this.#resolveExplosions();
        this.#resolveEnemyAttack();
    }

    /**
     * Resolves player projectile collisions.
     */
    #resolvePlayerAttack() {
        for (let i = 0; i < this.playerAttackList.length; i++) {
            const atk = this.playerAttackList[i];
            for (let j = 0; j < this.mobList.length; j++) {
                const mob = this.mobList[j];
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
            }
            for (let j = 0; j < this.tileList.length; j++) {
                if (checkCollision(atk, this.tileList[j])) {
                    if (atk.tag.includes("explosive")) {
                        this.#handleExplosions(atk);
                    }
                    if (!atk.tag.includes("ignoreTile")) {
                        atk.destroy();
                    }
                    break;
                }
            }
        }
    }

    /**
     * Resolves explosion collisions.
     */
    #resolveExplosions() {
        for (let i = 0; i < this.explosionList.length; i++) {
            const e = this.explosionList[i];
            if (checkCollision(e, this.player)) {
                this.player.components["stats"].applyDamage(e.components["stats"].damage);
            }
            for (let j = 0; j < this.mobList.length; j++) {
                const mob = this.mobList[j];
                if (checkCollision(e, mob) && !mob.tag.includes('ignoreAttack')) {
                    mob.components["stats"].applyDamage(e.components["stats"].damage);
                    this.#stun(mob);
                }
            }
        }
    }

    /**
     * Resolves enemy attack collisions.
     */
    #resolveEnemyAttack() {
        for (let i = 0; i < this.enemyAttackList.length; i++) {
            const atk = this.enemyAttackList[i];
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
                this.#playHitSound(atk.components['stats'].damage);
            }
            if (atk.name === "projectile" && !atk.tag.includes("ignoreTile")) {
                for (let j = 0; j < this.tileList.length; j++) {
                    if (checkCollision(atk, this.tileList[j])) {
                        atk.destroy();
                        break;
                    }
                }
            }
        }
    }

    #playHitSound(attackDamage) {
        if (this.player.components['stats'].isDead) return;
        if (attackDamage <= 0) return;
        if (ASSET_MANAGER.isPlaying(SOUND_PATH.HIT1)
            || ASSET_MANAGER.isPlaying(SOUND_PATH.HIT2)
            || ASSET_MANAGER.isPlaying(SOUND_PATH.HIT3)) return;
        switch (randomInt(3)) {
            case 0:
                ASSET_MANAGER.playAsset(SOUND_PATH.HIT1);
                break;
            case 1:
                ASSET_MANAGER.playAsset(SOUND_PATH.HIT2);
                break;
            case 2:
                ASSET_MANAGER.playAsset(SOUND_PATH.HIT3);
                break;
        }
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

    /**
     * Determines if a mob is colliding with a tile, used for spawning.
     * @param {Entity} mob A mob.
     * @return {boolean} True if the mob collides with a tile, false otherwise.
     */
    checkTileCollision(mob) {
        for (let i = 0; i < this.tileList.length; i++) {
            if (checkCollision(mob, this.tileList[i])) {
                return true;
            }
        }
        return false;
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
