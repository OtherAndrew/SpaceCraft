// Changes state of an entity. Usually used to change an animation
class EntityController {

    constructor(entities, player, projectileFactory) {
        Object.assign(this, { entities, player, projectileFactory })
    }

    update(tick) {
        const pCollider = this.player.components['boxCollider']
        const updateList = this.entities.filter(e => e.isDrawable && e.tag.includes('mob'));
        updateList.forEach(e => {
            e.components['state'].elapsedTime += tick;
            e.components['state'].attackTime += tick;
            e.update(pCollider, this.projectileFactory);
            e.components['boxCollider'].sideCollision = false;
            e.components['boxCollider'].attackCollision = false;
        });
    }
}