/**
 * Entity stats (damage, health, speed, etc.).
 *
 * @author Andrew Nguyen
 */

class CStats {
    /**
     * Initializes CStats component.
     * @param {number} damage        Entity damage. 0 by default.
     * @param {number} maxHealth     Entity max health. 0 by default.
     * @param {number} speed         Entity speed. 0 by default.
     * @param {number} regenCooldown Time it takes since last damaged for entity to start
     *                               regenerating health. 10 by default.
     * @param {number} regenAmount   Health regenerated per tick. 0.25 by default.
     * @param {boolean} invincible   If entity is invincible. false by default.
     * @return {CStats} This CStats component.
     */
    constructor({ damage = 0, maxHealth = 1, speed = 0,
                    regenCooldown = 10, regenAmount = 0.25, invincible = false }) {
        Object.assign(this, { damage, maxHealth, speed, regenCooldown, regenAmount, invincible })
        this.currentHealth = this.maxHealth;
        this.name = "stats"
        this.elapsedTime = this.regenCooldown;
        this.isDamaged = false;
        return this;
    }

    /**
     * Applies damage to entity.
     * @param {number} damage Damage to apply.
     */
    applyDamage(damage) {
        if (!this.invincible) {
            this.currentHealth -= damage;
            this.elapsedTime = 0;
            this.isDamaged = true;
        }
    }

    /**
     * Heals entity.
     * @param {number} amount Amount to heal.
     */
    heal(amount) {
        this.currentHealth = clamp(this.currentHealth + amount, 0, this.maxHealth);
        if (this.currentHealth >= this.maxHealth) this.isDamaged = false;
    }

    /**
     * Determines if entity can regenerate health.
     * @return {boolean} If entity can regenerate health.
     */
    canRegen() {
        return this.elapsedTime >= this.regenCooldown;
    }

}