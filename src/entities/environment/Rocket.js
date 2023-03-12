
class Rocket {
    /**
     * Initializes rocket
     * @param {Object} props         Position properties
     * @param {number} props.x       X position
     * @param {number} props.y       Y position
     * @returns {Rocket} Rocket NPC blueprint
     * @constructor
     */
    constructor(props) {
        this.tag = 'ignore npc';
        this.name = 'rocket';
        this.components = this.#buildComponents(props);
    };
    
    #buildComponents(props) {
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.ROCKET],
            sWidth: 221,
            sHeight: 295,
            padding: 1
        });
        const transform = new CTransform({
            x: props.x + 20,
            y: props.y,
            hasGravity: true
        });
        const cWidth = 3 * BLOCKSIZE;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            xOffset: (sprite.dWidth - cWidth) / 2,
            height: sprite.dHeight
        });
        transform.collider = collider
        const state = new CState();
        return [sprite, transform, collider, state];
    }

    update(tick, projectileManager) {}
}
