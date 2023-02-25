class MobFactory {

    constructor(entityManager) {
        this.entityManager = entityManager;
    }

    build(type, x, y) {
        let mob;
        const position = { x: x, y: y };
        switch (type) {
            case 'bloodsucker': mob = new Bloodsucker(position); break;
            case 'bombfly': mob = new Bombfly(position); break;
            case 'creeperilla': mob = new Creeperilla(position); break;
            case 'dirtcarver': mob = new Dirtcarver(position); break;
            case 'electrojelly': mob = new Electrojelly(position); break;
            case 'grapebomb': mob = new Grapebomb(position); break;
            case 'lightbug': mob = new Lightbug(position); break;
            case 'lightjelly': mob = new Lightjelly(position); break;
            case 'mossamber': mob = new Mossamber(position); break;
            case 'mossfly': mob = new Mossfly(position); break;
            case 'player': mob = new Player(position); break;
            case 'rocket': mob = new Rocket(position); break;
            case 'silverfish': mob = new Silverfish(position); break;
            case 'spore': mob = new Spore(position); break;
            case 'spiderboss': mob = new Spiderboss(position); break;
            case 'spikejumper': mob = new Spikejumper(position); break;
            case 'vengefly': mob = new Vengefly(position); break;
            case 'wormtank': mob = new Wormtank(position); break;
            default: console.log(`Invalid mob name: ${type}.`);
        }
        return mob ? this.entityManager.addEntity(mob) : null;
    }
}