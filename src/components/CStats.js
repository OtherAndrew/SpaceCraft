class CStats {
    constructor({damage = 0, maxHealth = 1, speed = 0}) {
        Object.assign(this, { damage, maxHealth, speed })
        this.currentHealth = this.maxHealth;
        this.name = "stats"
        return this;
    }
}