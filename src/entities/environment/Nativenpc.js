/**
 * Nativenpc is an npc character.
 * Can direct player to do tasks and can be trade with.
 *
 * @author Jeep Naarkom
 */

class Nativenpc {
    /**
     * Initializes Nativenpc
     * @param {Object} props   Position properties.
     * @param {number} props.x X spawn position.
     * @param {number} props.y Y spawn position.
     * @returns {Nativenpc} Nativenpc blueprint.
     * @constructor
     */
    constructor(props) {
        this.tag = 'mob ignoreAttack';
        this.name = 'nativenpc';
        this.components = this.#buildComponents(props);
        return this;
    };

    #buildComponents(props) {
        const stats = new CStats({
            speed: .2,
            invincible: true
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.NATIVENPC],
            sWidth: 109,
            sHeight: 159,
            scale: BLOCKSIZE * 2 / 109,
            lastFrameX: 5,
            fps: 9,
            padding: 3
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true,
        });
        const cWidth = BLOCKSIZE * 2.5;
        // const cHeight = BLOCKSIZE * 2.5;
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: cWidth,
            xOffset: (sprite.dWidth - cWidth) / 2,
            height: sprite.dHeight,
        });
        const state = new CState();
        const duration = new CDuration();
        this.#addAnimations(sprite);
        transform.collider = collider
        state.sprite = sprite;
        return [stats, sprite, transform, collider, state, duration];
    }

    update(target, projectileManager) {
        const targetX = target.center.x;
        const x = this.components['boxCollider'].center.x;
        const state = targetX < x ? "headL": "idleR";
        this.components.state.setState(state);
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0, 5, 9));
        aMap.set('headL', new AnimationProps(6, 0, 6, 9));
        aMap.set('idleL', new AnimationProps(0, 1,5, 9));
        aMap.set('headR', new AnimationProps(6, 1, 6, 9));
        aMap.set('walkR', new AnimationProps(0, 0, 5, 9));
        aMap.set('walkL', new AnimationProps(0, 1, 5, 9));
    };
}

