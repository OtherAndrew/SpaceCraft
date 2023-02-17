
class HealthSystem {

    constructor(entities) {
        Object.assign(this, { entities });
    }

    update(tick) {
        const updateList = this.entities.filter(e => e.isDrawable
            // && (e.tag.includes('mob') || e.tag.includes("player"))
            && e.components["stats"]);
        // console.log(updateList)
        updateList.forEach(e => {
            const eStats = e.components["stats"];
            if (eStats.currentHealth <= 0 && e.tag.includes('mob')) {
                e.destroy();
            } else {
                if (eStats.canRegen()) {
                    eStats.heal(0.1);
                } else {
                    eStats.elapsedTime += tick;
                }
            }
        });
    }
}