// Changes state of an entity. Usually used to change an animation
class EntityController {

    constructor(entities, player, projectileManager) {
        this.entities = entities;
        this.player = player
        this.projectileManager = projectileManager;
    }

    update(tick) {
        const playerPosition = this.player.components['boxCollider'].center
        const updateList = this.entities.filter(e => e.isDrawable && e.tag.includes('mob'));
        // console.log(updateList)
        updateList.forEach(e => {
            e.components['state'].elapsedTime += tick;
            e.update(playerPosition.x, playerPosition.y, this.projectileManager);
        });
    }
}