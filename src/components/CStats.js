class CStats {
    constructor({damage = 0, maxHealth = 1, speed = 0 }) {
        Object.assign(this, { damage, maxHealth, speed })
        this.currentHealth = this.maxHealth;
        this.defenseMod = 1;
        this.damageMod = 1;
        this.name = "stats"
        return this;
    }

    applyDamage(damage) {
        this.currentHealth -= damage * this.defenseMod;
    }

    doDamage() {
        return this.damage * this.damageMod;
    }

    addDefense(modifier) {
        this.defenseMod -= modifier;
    }

    addAttack(modifier) {
        this.damageMod += modifier;
    }
}