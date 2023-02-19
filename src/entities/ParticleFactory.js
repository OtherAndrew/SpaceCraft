class ParticleFactory {

    constructor(entityManager) {
        this.entityManager = entityManager;
    }

    generate(type, position) {
        const particleQueue = [];
        switch (type) {
            case 'death':
                particleQueue.push(new Particle({
                    sprite: this.deathSprite(),
                    origin: position,
                }));
                break;
            default: console.log(`ParticleManager.generate: Invalid particle type: ${type}.`);
        }
        particleQueue.forEach(p => this.entityManager.addEntity(p));
    }

    deathSprite() {
        return new CSprite({
            sprite: ASSET_MANAGER.getAsset(MISC_PATH.DEATH_EFFECT),
            sWidth: 64,
            sHeight: 64,
            scale: 2,
            lastFrameX: 10,
            fps: 30
        })
    }
}

class Particle {

    /**
     * Generates Particle blueprint.
     * @param {Object} props                   Particle properties
     * @param {CSprite} props.sprite           Particle sprite
     * @param {{number, number}} props.origin  Particle origin point (x, y)
     * @return {Particle} Particle blueprint.
     */
    constructor(props) {
        this.tag = 'particle';
        this.name = 'particle';
        this.components = this.#buildComponents(props);
        return this;
    }

    #buildComponents(props) {
        const sprite = props.sprite;
        const transform = new CTransform({
            x: props.origin.x - sprite.dWidth / 2,
            y: props.origin.y - sprite.dHeight / 2,
            hasGravity: false,
        });
        const duration = new CDuration(sprite.frameDuration * (sprite.lastFrameX + 2));
        return [sprite, transform, duration];
    }
}
