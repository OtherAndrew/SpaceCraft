class Lightbug {
    /**
     * Initializes Lightbug (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {number} props.x       X position of monster spawn
     * @param {number} props.y       Y position of monster spawn
     * @returns {Object}             return enemy
     * @constructor
     */
    constructor(props) {
        this.tag = 'lightbug mob';
        this.name = 'lightbug';
        this.components = this.#buildComponents(props);
        return this;
    };

    #buildComponents(props) {
        const stats = new CStats({
            speed: 2.2,
            invincible: true
        });
        const sprite = new CSprite({
            sprite: ASSET_MANAGER.getAsset(CHAR_PATH.LIGHTBUG),
            sWidth: 50,
            sHeight: 49,
            scale: 1,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 7,
            fps: 25,
            padding: 2
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
        });
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: sprite.dWidth,
            height: sprite.dHeight
        });

        this.#addAnimations(sprite);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;
        return [stats, sprite, transform, collider, state];
    }

    update(tick, targetX, targetY) {
        const velocity = this.components["stats"].speed;
        const offsetX = 0
        const offsetY = -28

        const x = this.components.transform.x;
        const y = this.components.transform.y;
        const transform = this.components.transform;


        //despawn after x range from player position

        const distance = getDistance2(x, y, targetX, targetY);
        const angle = getAngle2(x + offsetX, y + offsetY, targetX, targetY);
        if (distance <= 400) {
            // transform.velocityX = Math.cos(angle) * velocity;
            // transform.velocityY = Math.sin(angle) * velocity;
            transform.velocityY = targetY + offsetY < y ? -velocity : velocity;
            transform.velocityX = targetX + offsetX < x ? -velocity : velocity;
        } else {
            transform.velocityX = 0;
            transform.velocityY = 0;
        }
        //adding tint
    }

    #addAnimations(sprite) {
        const aMap = sprite.animationMap;
        aMap.set('idleR', new AnimationProps(0, 0, 7));
    };

    #gettingTint() {
        let imageData = this.lightbug.components.sprite
        for (let i = 0; i < imageData.length; i += 4) {
            // Update the red, green, and blue values
            imageData.data[i] += 1; // red
            imageData.data[i + 1] = 0; // green
            imageData.data[i + 2] = 0; // blue
        }

        this.lightbug.components.sprite.putImageData(imageData,0,0);

    }
}

