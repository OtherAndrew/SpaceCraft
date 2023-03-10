class HealthSystem {

    constructor(entityManager, particleFactory, containerManager) {
        Object.assign(this, {entityManager, particleFactory, containerManager});
    }

    update(tick) {
        const updateList = this.entityManager.getEntities;
        for (let i = 0; i < updateList.length; i++) {
            const e = updateList[i];
            if (!e.isDrawable || !e.components['stats']) continue;
            const eStats = e.components["stats"];
            if (eStats.isDead) {
                if (e.tag.includes('mob') || e.name === "player") {
                    this.particleFactory.generate('death', e.components['boxCollider'].center);
                    if (e.components['drops']) {
                        e.components['drops'].dropList.forEach(d => {
                            this.containerManager.addToInventory('player', this.entityManager.addEntity(d))
                        });
                    }
                    if (e.name !== "player") e.destroy();
                }
            } else {
                if (eStats.canRegen()) {
                    eStats.heal(eStats.regenAmount);
                } else {
                    eStats.elapsedTime += tick;
                }
            }
        }
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
    const healthPercentage = entity.components['stats'].isDead ?
        0 : entity.components['stats'].currentHealth / entity.components['stats'].maxHealth
    if (healthPercentage > 0.75) ctx.fillStyle = "green";
    else if (healthPercentage > 0.50) ctx.fillStyle = "yellow";
    else if (healthPercentage > 0.25) ctx.fillStyle = "orange";
    else ctx.fillStyle = "red";
    ctx.rect(x, y, w * healthPercentage, h);
    ctx.fill();
    ctx.restore();
}

const drawBlockDestruction = (ctx, entity, x, y) => {
    ctx.save();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.fillStyle = "transparent";
    ctx.rect(x, y, BLOCKSIZE, BLOCKSIZE);
    ctx.fill();
    ctx.beginPath();
    const healthPercentage = entity.components['stats'].isDead ?
        0 : entity.components['stats'].currentHealth / entity.components['stats'].maxHealth
    ctx.fillStyle = rgba(0, 0, 0, (1 - healthPercentage) * 0.8);
    ctx.rect(x, y, BLOCKSIZE, BLOCKSIZE);
    ctx.fill();
    ctx.restore();
}