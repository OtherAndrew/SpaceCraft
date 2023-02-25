
class Mossamber {
    /**
     * Initializes mossamber (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of monster spawn
     * @param {number} props.y       Y position of monster spawn
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob enemy';
        this.name = 'mossamber';
        this.components = this.#buildComponents(props);
    };
    
    #buildComponents(props) {
        const stats = new CStats({
            damage: -0.1,
            maxHealth: 100
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.MOSSAMBER],
            sWidth: 110,
            sHeight: 121,
            scale: BLOCKSIZE * 3 / 110,
            lastFrameX: 3,
            fps: 5
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true
        });
        const cWidth = BLOCKSIZE * 2.4;
        const xOffset = BLOCKSIZE * 0.25
        const yOffset = BLOCKSIZE * 1.5
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            xOffset: xOffset,
            height: sprite.dHeight - yOffset,
            yOffset: yOffset
        });
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;
        return [stats, sprite, transform, collider, state];
    }

    update(target, projectileManager) {
    }

}
