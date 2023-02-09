class Projectile {

    /**
     *
     * @param {Object} props
     * @param {number} props.damage
     * @param {number} props.angle
     * @param {number} props.speed
     * @param {boolean} props.hasGravity
     * @return {Projectile}
     */
    constructor(props) {
        this.tag = 'projectile';
        this.name = 'projectile';
        this.components = this.#buildComponents(props);
        return this;
    }

    #buildComponents(props) {
        const stats = new CStats({
            damage: props.damage,
            speed: props.speed
        });
        const sprite = new CSprite({
            sprite: props.sprite,
            sWidth: props.sWidth,
            sHeight: props.sHeight,
            scale: props.scale,
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: props.hasGravity,
            rotation: props.angle,
            velocityX: Math.cos(props.angle) * props.speed, // + player vx
            velocityY: Math.sin(props.angle) * props.speed // + player vy
        });
        // const cWidth = BLOCKSIZE * .25;
        // const cHeight = BLOCKSIZE * .25
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: sprite.dWidth,
            height: sprite.dHeight,
            // xOffset: (sprite.dWidth - cWidth) / 2,
            // yOffset: (sprite.dHeight - cHeight) / 2,
        });
        transform.collider = collider
        return [stats, sprite, transform, collider];
    }
}

//damage, angle, speed, hasGravity