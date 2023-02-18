
class HealthSystem {

    constructor(entities, projectileManager) {
        Object.assign(this, { entities, projectileManager });
    }

    update(tick) {
        const updateList = this.entities.filter(e => e.isDrawable
            // && (e.tag.includes('mob') || e.tag.includes("player"))
            && e.components["stats"]);
        // console.log(updateList)
        updateList.forEach(e => {
            const eStats = e.components["stats"];
            if (eStats.currentHealth <= 0) {
                const origin = e.components['boxCollider'].center;
                this.projectileManager.detonate('death_effect', origin);
                if (e.tag.includes('mob')) {
                    e.destroy();
                }
            } else {
                if (eStats.canRegen()) {
                    eStats.heal(eStats.regenAmount);
                } else {
                    eStats.elapsedTime += tick;
                }
            }
        });
    }
}