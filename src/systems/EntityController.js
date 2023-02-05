// Changes state of an entity. Usually used to change an animation
class EntityController {

    constructor(entities, player) {
        this.entities = entities;
        this.playerPosition = player.components.transform;
    }

    update(tick) {
        const updateList = this.entities.filter(e => e.tag.includes('mob'));
        // console.log(updateList)
        updateList.forEach(e => {
            e.update(tick, this.playerPosition.x, this.playerPosition.y);
        });
    }
}