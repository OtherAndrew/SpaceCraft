// Changes state of an entity. Usually used to change an animation
class EntityController {

    constructor(entities, player, projectileManager) {
        this.entities = entities;
        this.playerPosition = player.components.transform;
        this.projectileManager = projectileManager;
    }

    update(tick) {
        const updateList = this.entities.filter(e => e.isDrawable && e.tag.includes('mob'));
        // console.log(updateList)
        updateList.forEach(e => {
            e.elapsedTime += tick;
            e.update(this.playerPosition.x, this.playerPosition.y, this.projectileManager);
        });
    }
}