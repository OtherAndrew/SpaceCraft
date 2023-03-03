// Changes state of an entity. Usually used to change an animation
class MobController {

    constructor(entities, player, projectileFactory) {
        Object.assign(this, { entities, player, projectileFactory })
    }

    update(tick) {
        const pCollider = this.player.components['boxCollider']
        const updateList = this.entities.filter(e => /*e.isDrawable &&*/ e.tag.includes('mob') || !e.tag.includes('npc'));
        updateList.forEach(e => {
            if (!e.tag.includes('npc') && getDistance(e.components['boxCollider'].center, pCollider) > WIDTH * 1.5) {
                e.destroy();
                console.log(`despawned ${e.name}`)
            } else if (e.isDrawable) {
                e.components['state'].elapsedTime += tick;
                e.components['state'].attackTime += tick;
                e.update(pCollider, this.projectileFactory);
                e.components['boxCollider'].sideCollision = false;
                e.components['boxCollider'].attackCollision = false;
            }
        });
    }
}
