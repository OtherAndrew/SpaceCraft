class CStats {
    constructor({damage = 0, maxHealth = 1, speed = 0, invincible = false, currentCount = 0, total}) {
        Object.assign(this, { damage, maxHealth, speed, invincible, currentCount, total })
        this.currentHealth = this.maxHealth;
        this.defenseMod = 1;
        this.damageMod = 1;
        this.name = "stats"
        this.elapsedTime = 0;
        this.regenCooldown = 5;
        this.currentCount = 0;
        this.total = 0;
        return this;
    }

    applyDamage(damage) {
        if (!this.invincible) {
            this.currentHealth -= damage * this.defenseMod;
            this.elapsedTime = 0;
        }
    }

    heal(amount) {
        this.currentHealth = clamp(this.currentHealth + amount, 0, this.maxHealth);
    }

    canRegen(tick) {
        this.elapsedTime += tick;
        return this.elapsedTime >= this.regenCooldown;
    }

    doDamage() {
        return this.damage * this.damageMod;
    }

    /**
     * Add damage resistance.
     * @param {number} modifier Percentage between 1 and 0 (30% damage resist = 0.30)
     */
    addDefense(modifier) {
        this.defenseMod -= modifier;
    }

    /**
     * Add attack buff.
     * @param {number} modifier Percentage between 1 and 0 (30% damage buff = 0.30)
     */
    addDamage(modifier) {
        this.damageMod += modifier;
    }

    addSpeed(modifier) {
        this.speed *= (1 + modifier);
    }
}