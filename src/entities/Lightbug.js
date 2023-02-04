class Lightbug {
    /**
     * Initializes Lightbug (enemy)
     * @param {Object} props         enemy position and display properties
     * @param {Image} props.sprite   enemy sprite sheet
     * @param {number} props.x       X position of starting frame
     * @param {number} props.y       Y position of the starting frame
     * @param {number} props.sWidth  frame width
     * @param {number} props.sHeight frame height
     * @param {number} props.scale   frame scale
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
        const sprite = new CSprite({
            sprite: props.sprite,
            sWidth: props.sWidth,
            sHeight: props.sHeight,
            scale: props.scale,
            firstFrameX: 0,
            frameY: 0,
            lastFrameX: 7,
            fps: 25,
            padding: 2
        });
        const transform = new CTransform({
            x: props.x,
            y: props.y,
            velocityX: 0,
            velocityY: 0,
            maxVelocityX: 2.5,
            maxVelocityY: 2.5
        });
        const collider = new CBoxCollider({
            x: props.x,
            y: props.y,
            width: props.sWidth * props.scale,
            height: props.sHeight * props.scale
        });

        this.#addAnimations(sprite);
        transform.collider = collider
        const state = new CState();
        state.sprite = sprite;
        return [sprite, transform, collider, state];
    }

    update(tick, targetX, targetY) {
        const velocity = 2.2
        const offsetX = 0
        const offsetY = -28

        const x = this.components.transform.x;
        const y = this.components.transform.y;
        const transform = this.components.transform;

        //update the state of anim
        //despawn after x range from player position

        console.log("lightbug: x:" + x + ", y: " + y)
        //default state
        this.components.state.setState('idleR');
        const distance = getDistance2(x, y, targetX, targetY);
        if (distance <= 400) {
            transform.velocityY = targetY + offsetY < y ? -velocity : velocity;
            transform.velocityX = targetX + offsetX < x ? -velocity : velocity;
        } else {
            transform.velocityY = 0;
            transform.velocityX = 0;
        }
        //adding tint


        // Calculate the angle between the monster and player

        this.components.transform.update(tick);
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

