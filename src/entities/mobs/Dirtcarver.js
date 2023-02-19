class Dirtcarver {
    /**
     * Initializes Dirtcarver (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of monster spawn
     * @param {number} props.y       Y position of monster spawn
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'dirtcarver mob';
        this.name = 'dirtcarver';
        this.components = this.#buildComponents(props);
        this.rand = Math.floor(Math.random()*(60 - 10) + 10);
    };

    #buildComponents(props) {
        const stats = new CStats({
            speed: 0.8
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.cache[CHAR_PATH.DIRTCARVER],
            sWidth: 262,
            sHeight: 84,
            scale: 0.5,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 3,
            fps: 12,
            padding: 3
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            hasGravity: true,
        });
        const cWidth = 2.2 * BLOCKSIZE;
        const collider = new CBoxCollider({
            x: props.x + props.width / 2,
            y: props.y,
            width: cWidth,
            xOffset: (sprite.dWidth - cWidth) / 2,
            height: sprite.dHeight
        });

        this.#addAnimations(sprite);
        this.#addBehaviors(transform, stats);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;
        state.transform = transform;
        return [stats, sprite, transform, collider, state];
    }

    update(targetX, targetY, projectileManager) {
        const x = this.components['boxCollider'].center.x;
        const state = targetX < x ? "walkL" : "walkR";
        this.components.state.setState(state);

        if (this.rand > 0) {
            this.rand--;

        } else {
            let height = Math.floor(Math.random()*(15 - 3) + 3);
            this.components.transform.velocityY -= height;
            this.components.transform.velocityX = state == "walkL" ? -2: 2;
        }
        console.log('dc num', this.rand);
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0, 0));
        aMap.set('idleL', new AnimationProps(0, 1,0));
        aMap.set('walkR', new AnimationProps(0, 0, 3));
        aMap.set('walkL', new AnimationProps(0, 1, 3));
    };
    #addBehaviors(transform, stats) {
        const bMap = transform.behaviorMap;
        bMap.set('idleR', new BehaviorProps(0, null));
        bMap.set('idleL', new BehaviorProps(0, null));
        bMap.set('walkR', new BehaviorProps(stats.speed, null));
        bMap.set('walkL', new BehaviorProps(-stats.speed, null));
    }

}

