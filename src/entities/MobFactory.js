class MobFactory {

    constructor(entityManager) {
        this.entityManager = entityManager;
    }

    build(mob, x, y) {
        let out = null;
        switch (mob) {
            case 'player': out = this.entityManager.addEntity(new Player({ x: x, y: y })); break;
            case 'spore': out = this.entityManager.addEntity(new Spore({ x: x, y: y })); break;
            case 'dirtcarver': out = this.entityManager.addEntity(new Dirtcarver({ x: x, y: y })); break;
            case 'lightbug': out = this.entityManager.addEntity(new Lightbug({ x: x, y: y })); break;
            case 'lightjelly': out = this.entityManager.addEntity(new Lightjelly({ x: x, y: y })); break;
            case 'grapebomb': out = this.entityManager.addEntity(new Grapebomb({ x: x, y: y })); break;
            case 'wormtank': out = this.entityManager.addEntity(new Wormtank({ x: x, y: y })); break;
            case 'mossamber': out = this.entityManager.addEntity(new Mossamber({ x: x, y: y })); break;
            case 'rocket': out = this.entityManager.addEntity(new Rocket({ x: x, y: y })); break;
            default: console.log(`Invalid mob name: ${mob}.`);
        }
        return out;
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

    #buildGrapebomb(x, y) {
        return new Grapebomb({ x: x, y: y });
    }

    #buildMossamber(x, y) {
        return new Grapebomb({ x: x, y: y });
    }
    #buildRocket(x, y) {
        return new Grapebomb({ x: x, y: y });
    }
}