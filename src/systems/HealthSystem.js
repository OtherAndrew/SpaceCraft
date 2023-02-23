class HealthSystem {

    constructor(entityManager, particleFactory, containerManager) {
        Object.assign(this, {entityManager, particleFactory, containerManager});
    }

    update(tick) {
        const updateList = this.entityManager.getEntities.filter(e => e.isDrawable
            // && (e.tag.includes('mob') || e.tag.includes("player"))
            && e.components["stats"]);
        // console.log(updateList)
        updateList.forEach(e => {
            const eStats = e.components["stats"];
            if (eStats.isDead) {
                if (e.tag.includes('mob') || e.name === "player") {
                    this.particleFactory.generate('death', e.components['boxCollider'].center);
                    if (e.components['drops']) {
                        e.components['drops'].dropList.forEach(d => {
                            this.containerManager.addToInventory('player', this.entityManager.addEntity(d))
                        });
                    }
                    e.destroy();
                }
                // else if (e.name === 'block') {
                //     e.tag = 'air'
                //     e.id = null
                //     delete e.components["boxCollider"]
                // }
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

const drawHealthbar = (ctx, entity, x, y, w, h) => {
    ctx.save();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.beginPath();
    // let healthPercentage = Math.max(0,
    //     entity.components['stats'].currentHealth / entity.components['stats'].maxHealth);
    let healthPercentage = entity.components['stats'].isDead ?
        0 : entity.components['stats'].currentHealth / entity.components['stats'].maxHealth
    if (healthPercentage > 0.75) ctx.fillStyle = "green";
    else if (healthPercentage > 0.50) ctx.fillStyle = "yellow";
    else if (healthPercentage > 0.25) ctx.fillStyle = "orange";
    else ctx.fillStyle = "red";
    ctx.rect(x, y, w * healthPercentage, h);
    ctx.fill();
    ctx.restore();
}