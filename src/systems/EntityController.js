// Changes state of an entity. Usually used to change an animation
class EntityController {

    constructor(entities, player, projectileFactory) {
        Object.assign(this, { entities, player, projectileFactory })
    }

    update(tick) {
        const playerPosition = this.player.components['boxCollider'].center
        const updateList = this.entities.filter(e => e.isDrawable && e.tag.includes('mob'));
        // console.log(updateList)
        updateList.forEach(e => {
            e.components['state'].elapsedTime += tick;
            e.update(playerPosition.x, playerPosition.y, this.projectileFactory);
        });
    }
}