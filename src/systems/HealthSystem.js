
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
                const origin = {
                    x: e.components['boxCollider'].center.x,
                    y: e.components['boxCollider'].center.y
                }
                this.projectileManager.entityShoot('death_effect', origin, origin)
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