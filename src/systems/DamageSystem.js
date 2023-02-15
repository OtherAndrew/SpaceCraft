
class DamageSystem {

    constructor(entities) {
        Object.assign(this, { entities });
    }

    update(tick) {
        const updateList = this.entities.filter(e => e.isDrawable
            // && (e.tag.includes('mob') || e.tag.includes("player"))
            && e.components["stats"]);
        // console.log(updateList)
        updateList.forEach(e => {
            if (e.components["stats"].currentHealth <= 0 && e.tag.includes('mob')) {
                e.destroy();
                // e.components.currentCount--;
            }
            if (e.components["stats"].canRegen(tick)) {
                e.components.heal(1);
            }
        });
    }
}