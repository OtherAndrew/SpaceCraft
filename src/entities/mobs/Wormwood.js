/**
 * Wormwood is a beneficial stationary mob that heals the player on contact.
 * Can be defeated to obtain wood.
 *
 * @author Jeep Naarkom
 * @author Andrew Nguyen
 */

class Wormwood {
    /**
     * Initializes Wormwood
     * @param {Object} props   Position properties.
     * @param {number} props.x X spawn position.
     * @param {number} props.y Y spawn position.
     * @returns {Wormwood} Wormwood blueprint.
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob enemy';
        this.name = 'wormwood';
        this.components = this.#buildComponents(props);
        return this;
    };
    
    #buildComponents(props) {
        const stats = new CStats({
            damage: -0.2,
            maxHealth: 200,
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.WORMWOOD],
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
        const state = new CState();
        transform.collider = collider
        state.sprite = sprite;
        return [stats, sprite, transform, collider, state];
    }

    update(target, projectileManager) {
    }

}
