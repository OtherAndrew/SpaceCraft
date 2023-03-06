class ProjectileFactory {

    constructor(entityManager) {
        this.entityManager = entityManager;
    }

    /**
     * Shoots a projectile.
     * @param {String} type                Projectile type.
     * @param {{number, number}} targetPos Target position.
     * @param {Object} originEntity        Origin entity.
     */
    playerShoot(type, targetPos, originEntity) {
        const midPoint = {
            x: WIDTH * .5,
            y: HEIGHT * .5
        }
        const directionVector = normalize(midPoint, targetPos);
        const projectileOrigin = originEntity.components["boxCollider"].center;
        const projectileQueue = [];
        switch (type) {
            case 'weak_bullet':
                projectileOrigin.x += directionVector.x * 15
                projectileOrigin.y += directionVector.y * 15
                projectileQueue.push(new Projectile({
                    tag: 'playerAttack',
                    sprite: this.orbSprite(8),
                    damage: 12.5,
                    speed: BLOCKSIZE * 0.5,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    // 0.4 = 100% center to edge horizontal
                    // 0.3 = 75% center to edge horizontal
                    // 0.2 = 50% center to edge horizontal
                    duration: 0.25,
                    hasGravity: false,
                    spread: 1
                }));
                ASSET_MANAGER.playAsset(SOUND_PATH.LASER);
                break;
            case 'mid_bullet':
                projectileOrigin.x += directionVector.x * 15
                projectileOrigin.y += directionVector.y * 15
                projectileQueue.push(new Projectile({
                    tag: 'playerAttack',
                    sprite: this.orbSprite(11),
                    damage: 15,
                    speed: BLOCKSIZE * 0.5,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    // 0.4 = 100% center to edge horizontal
                    // 0.3 = 75% center to edge horizontal
                    // 0.2 = 50% center to edge horizontal
                    duration: 0.3,
                    hasGravity: false,
                    spread: 1
                }));
                ASSET_MANAGER.playAsset(SOUND_PATH.LASER);
                break;
            case 'strong_bullet':
                projectileOrigin.x += directionVector.x * 10
                projectileOrigin.y += directionVector.y * 10
                projectileQueue.push(new Projectile({
                    tag: 'playerAttack',
                    sprite: this.orbSprite(2),
                    damage: 20,
                    speed: BLOCKSIZE * 0.75,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    // 0.4 = 100% center to edge horizontal
                    // 0.3 = 75% center to edge horizontal
                    // 0.2 = 50% center to edge horizontal
                    duration: 0.3,
                    hasGravity: false,
                    spread: 1
                }));
                ASSET_MANAGER.playAsset(SOUND_PATH.LASER);
                break;
            case 'minigun_bullet':
                projectileOrigin.x += directionVector.x * 10
                projectileOrigin.y += directionVector.y * 10
                for (let i = 0; i < 2; i++) {
                    projectileQueue.push(new Projectile({
                        tag: 'playerAttack',
                        sprite: this.orbSprite(14, 0, 0.8),
                        damage: 4,
                        speed: BLOCKSIZE * 0.75,
                        dVector: directionVector,
                        origin: projectileOrigin,
                        // 0.4 = 100% center to edge horizontal
                        // 0.3 = 75% center to edge horizontal
                        // 0.2 = 50% center to edge horizontal
                        duration: 0.45,
                        hasGravity: false,
                        spread: 1.25
                    }));
                }
                break;
            case 'railgun_bullet':
                projectileOrigin.x += directionVector.x * 10
                projectileOrigin.y += directionVector.y * 10
                projectileQueue.push(new Projectile({
                    tag: 'playerAttack ignoreTile pierce',
                    sprite: this.orbSprite(4),
                    damage: 200,
                    speed: BLOCKSIZE * 0.9,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 0.5,
                    hasGravity: false,
                    spread: 0
                }));
                ASSET_MANAGER.playAsset(SOUND_PATH.STRONG_LASER);
                break;
            case 'fire':
                projectileOrigin.x += directionVector.x * 30
                projectileOrigin.y += directionVector.y * 30
                projectileQueue.push(new Projectile({
                    tag: 'playerAttack pierce fire',
                    sprite: this.fireSprite(),
                    damage: 0.25,
                    speed: BLOCKSIZE * 0.1,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 1,
                    hasGravity: false,
                    spread: 0.33
                }));
                break;
            case 'bomb':
                projectileOrigin.x += directionVector.x * 20;
                projectileOrigin.y += directionVector.y * 20;
                directionVector.y -= 0.25;
                projectileQueue.push(new Projectile({
                    tag: 'playerAttack explosive',
                    sprite: this.bombSprite(BLOCKSIZE * 0.6),
                    damage: 0,
                    speed: BLOCKSIZE * 0.5,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 2,
                    hasGravity: true,
                    spread: 0.5
                }));
                ASSET_MANAGER.playAsset(SOUND_PATH.GRENADE_LAUNCHER);
                break;
            case 'mini_bomb':
                projectileOrigin.x += directionVector.x * 10;
                projectileOrigin.y += directionVector.y * 10;
                projectileQueue.push(new Projectile({
                    tag: 'playerAttack mini explosive',
                    sprite: this.miniBombSprite(BLOCKSIZE * 0.45),
                    damage: 0,
                    speed: BLOCKSIZE * 0.75,
                    dVector: directionVector,
                    origin: projectileOrigin,
                    duration: 0.5,
                    hasGravity: false,
                    spread: 0
                }));
                for (let i = 0; i < 2; i++) {
                    projectileQueue.push(new Projectile({
                        tag: 'playerAttack mini explosive',
                        sprite: this.miniBombSprite(BLOCKSIZE * 0.45),
                        damage: 0,
                        speed: BLOCKSIZE * 0.75,
                        dVector: directionVector,
                        origin: projectileOrigin,
                        duration: 0.5,
                        hasGravity: false,
                        spread: 3.5
                    }));
                }
                ASSET_MANAGER.playAsset(SOUND_PATH.HAND_CANNON);
                break;
            default: console.log(`ProjectileManager.playerShoot: Invalid projectile type: ${type}.`);
        }
        projectileQueue.forEach(p => this.entityManager.addEntity(p));
    }

    entityShoot(type, targetPos, origin) {
        const directionVector = normalize(origin, targetPos);
        const projectileQueue = [];
        let sprite;
        switch (type) {
            case 'bloodspore':
                origin.x += directionVector.x * 10;
                origin.y += directionVector.y * 10;
                projectileQueue.push(new Projectile({
                    tag: 'enemy',
                    sprite: this.darkOrbSprite(8, 1),
                    damage: 50,
                    speed: BLOCKSIZE * 0.05,
                    dVector: directionVector,
                    origin: origin,
                    duration: 5,
                    hasGravity: false,
                    spread: 0
                }));
                break;
            case 'spore':
                origin.x += directionVector.x * 10;
                origin.y += directionVector.y * 10;
                projectileQueue.push(new Projectile({
                    tag: 'enemy',
                    sprite: this.darkOrbSprite(4, 1),
                    damage: 25,
                    speed: BLOCKSIZE * 0.05,
                    dVector: directionVector,
                    origin: origin,
                    duration: 5,
                    hasGravity: false,
                    spread: 0
                }));
                break;
            case 'electroball':
                origin.x += directionVector.x * 10;
                origin.y += directionVector.y * 10;
                projectileQueue.push(new Projectile({
                    tag: 'enemy ignoreTile pierce stun',
                    sprite: this.electricitySprite(),
                    damage: 1,
                    speed: BLOCKSIZE * 0.1,
                    dVector: directionVector,
                    origin: origin,
                    duration: 5,
                    hasGravity: false,
                    spread: 0
                }));
                break;
            case 'strongimpact':
                origin.x += directionVector.x * 20;
                origin.y += directionVector.y * 20;
                sprite = this.impactSprite();
                projectileQueue.push(new Projectile({
                    tag: 'enemy ignoreTile pierce stun',
                    sprite: sprite,
                    damage: 3.5,
                    speed: 0,
                    dVector: directionVector,
                    origin: origin,
                    duration: sprite.frameDuration * (sprite.lastFrameX - sprite.firstFrameX + 1),
                    hasGravity: false,
                    spread: 0
                }));
                break;
            case 'weakimpact':
                origin.x += directionVector.x * 20;
                origin.y += directionVector.y * 20;
                sprite = this.impactSprite();
                projectileQueue.push(new Projectile({
                    tag: 'enemy ignoreTile pierce stun',
                    sprite: sprite,
                    damage: 1,
                    speed: 0,
                    dVector: directionVector,
                    origin: origin,
                    duration: sprite.frameDuration * (sprite.lastFrameX - sprite.firstFrameX + 1),
                    hasGravity: false,
                    spread: 0
                }));
                break;
            default: console.log(`ProjectileManager.entityShoot: Invalid projectile type: ${type}.`);
        }
        projectileQueue.forEach(p => this.entityManager.addEntity(p));
    }

    detonate(type, position) {
        const projectileQueue = [];
        switch (type) {
            case 'explosion':
                projectileQueue.push(new Explosion({
                    tag: 'ignoreTile destroyBlock',
                    sprite: this.explosionSprite(BLOCKSIZE * 5),
                    damage: 16,
                    origin: position,
                }));
                ASSET_MANAGER.playAsset(SOUND_PATH.EXPLOSION);
                break;
            case 'mini_explosion':
                projectileQueue.push(new Explosion({
                    tag: 'ignoreTile',
                    sprite: this.explosionSprite(BLOCKSIZE * 1.5),
                    damage: 4,
                    origin: position,
                }));
                switch (randomInt(3)) {
                    case 0: ASSET_MANAGER.playAsset(SOUND_PATH.SMALL_EXPLOSION1); break;
                    case 1: ASSET_MANAGER.playAsset(SOUND_PATH.SMALL_EXPLOSION2); break;
                    case 2: ASSET_MANAGER.playAsset(SOUND_PATH.SMALL_EXPLOSION3); break;
                }
                break;
            case 'enemy_explosion':
                projectileQueue.push(new Explosion({
                    tag: 'ignoreTile',
                    sprite: this.explosionSprite(BLOCKSIZE * 5),
                    damage: 3,
                    origin: position,
                }));
                ASSET_MANAGER.playAsset(SOUND_PATH.EXPLOSION);
                break;
            default: console.log(`ProjectileManager.detonate: Invalid projectile type: ${type}.`);
        }
        projectileQueue.forEach(p => this.entityManager.addEntity(p));
    }

    orbSprite(frameX = 0, frameY = 0, scale = 1) {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_PATH.ORB),
            sWidth: 16,
            sHeight: 16,
            scale: scale,
            firstFrameX: frameX,
            frameY: frameY
        });
    }

    fireSprite() {
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_PATH.FIRE),
            sWidth: 8,
            sHeight: 12,
            scale: 2,
            firstFrameX: 0,
            lastFrameX: 4,
            fps: 30
        });
        sprite.currentFrame = randomInt(sprite.lastFrameX);
        return sprite;
    }

    bombSprite(size) {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_PATH.BOMB),
            sWidth: 10,
            sHeight: 10,
            scale: size / 10,
        });
    }

    miniBombSprite(size) {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_PATH.MINI_BOMB),
            sWidth: 10,
            sHeight: 10,
            scale: size / 10,
        });
    }

    explosionSprite(size) {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_PATH.EXPLOSION),
            sWidth: 64,
            sHeight: 64,
            scale: size / 64,
            firstFrameX: 0,
            lastFrameX: 5,
            fps: 24
        });
    }

    darkOrbSprite(frameX = 0, frameY = 0, scale = 1) {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_PATH.DARK_ORB),
            sWidth: 16,
            sHeight: 16,
            scale: scale,
            firstFrameX: frameX,
            frameY: frameY
        });
    }

    electricitySprite() {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_PATH.ELECTRICITY),
            sWidth: 65,
            sHeight: 66,
            scale: BLOCKSIZE * 1.5 / 65,
            lastFrameX: 10,
            fps: 30
        });
    }

    impactSprite() {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(PROJECTILE_PATH.IMPACT),
            sWidth: 78,
            sHeight: 69,
            scale: BLOCKSIZE * 2 / 78,
            lastFrameX: 5,
            fps: 30
        });
    }
}

class Projectile {

    /**
     * Generates projectile blueprint.
     * @param {Object} props                   Projectile properties
     * @param {string} props.tag               Projectile tag
     * @param {CSprite} props.sprite           Projectile sprite
     * @param {number} props.damage            Projectile damage
     * @param {number} props.speed             Projectile speed
     * @param {{number, number}} props.dVector Projectile direction vector (vX, vY)
     * @param {{number, number}} props.origin  Projectile origin point (x, y)
     * @param {number} props.duration          Projectile duration
     * @param {boolean} props.hasGravity       If projectile has gravity
     * @return {Projectile} Projectile blueprint.
     */
    constructor(props) {
        this.tag = props.tag;
        this.name = 'projectile';
        this.components = this.#buildComponents(props);
        return this;
    }

    #buildComponents(props) {
        const stats = new CStats({
            damage: props.damage,
            speed: props.speed,
            invincible: true
        });
        const sprite = props.sprite;
        const transform = new CTransform({
            x: props.origin.x - sprite.dWidth / 2,
            y: props.origin.y - sprite.dHeight / 2,
            hasGravity: props.hasGravity,
            velocityX: props.dVector.x * stats.speed + randomSpread(props.spread),
            velocityY: props.dVector.y * stats.speed + randomSpread(props.spread),
        });
        const collider = new CBoxCollider({
            x: transform.x,
            y: transform.y,
            width: sprite.dWidth,
            height: sprite.dHeight,
        });
        const duration = new CDuration(props.duration);
        transform.collider = collider
        return [stats, sprite, transform, collider, duration];
    }
}

class Explosion {

    /**
     * Generates Explosion blueprint.
     * @param {Object} props                   Explosion properties
     * @param {string} props.tag               Explosion tag
     * @param {CSprite} props.sprite           Explosion sprite
     * @param {number} props.damage            Explosion damage
     * @param {{number, number}} props.origin  Explosion origin point (x, y)
     * @return {Explosion} Explosion blueprint.
     */
    constructor(props) {
        this.tag = props.tag;
        this.name = 'explosion';
        this.components = this.#buildComponents(props);
        return this;
    }

    #buildComponents(props) {
        const stats = new CStats({
            damage: props.damage,
            invincible: true
        });
        const sprite = props.sprite;
        const transform = new CTransform({
            x: props.origin.x - sprite.dWidth / 2,
            y: props.origin.y - sprite.dHeight / 2,
            hasGravity: false,
        });
        const collider = new CBoxCollider({
            x: transform.x,
            y: transform.y,
            width: sprite.dWidth,
            height: sprite.dHeight,
        });
        const duration = new CDuration(sprite.frameDuration * (sprite.lastFrameX - sprite.firstFrameX + 1));
        transform.collider = collider
        return [stats, sprite, transform, collider, duration];
    }
}
