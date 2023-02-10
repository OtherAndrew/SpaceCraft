class MobFactory {

    constructor(entityManager) {
        this.entityManager = entityManager;
    }

    build(mob, x, y) {
        switch (mob) {
            case 'spore': this.entityManager.addEntity(new Spore({ x: x, y: y })); break;
            case 'dirtcarver': this.entityManager.addEntity(new Dirtcarver({ x: x, y: y })); break;
            case 'lightbug': this.entityManager.addEntity(new Lightbug({ x: x, y: y })); break;
            default: console.log(`Invalid mob name: ${mob}.`);
        }
    }

    #buildSpore(x, y) {
        return new Spore({ x: x, y: y });
    }

    #buildDirtcarver(x, y) {
        return new Dirtcarver({ x: x, y: y });
    }

    #buildLightbug(x, y) {
        return new Lightbug({ x: x, y: y });
    }

}