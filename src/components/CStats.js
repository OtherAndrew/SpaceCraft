class CStats {
    constructor({damage = 0, maxHealth = 1, speed = 0, invincible = false }) {
        Object.assign(this, { damage, maxHealth, speed, invincible })
        this.currentHealth = this.maxHealth;
        this.name = "stats"
        this.regenCooldown = 10;
        this.elapsedTime = this.regenCooldown;
        return this;
    }

    applyDamage(damage) {
        if (!this.invincible) {
            this.currentHealth -= damage;
            this.elapsedTime = 0;
        }
    }

    heal(amount) {
        this.currentHealth = clamp(this.currentHealth + amount, 0, this.maxHealth);
    }

    canRegen() {
        return this.elapsedTime >= this.regenCooldown;
    }

}