/**
 * Entity stats (damage, health, speed, etc.).
 *
 * @author Andrew Nguyen
 */

class CStats {
    /**
     * Initializes CStats component.
     * @param {number} damage         Entity damage. 0 by default.
     * @param {number} maxHealth      Entity max health. 1 by default.
     * @param {number} speed          Entity speed. 0 by default.
     * @param {number} regenCooldown  Time since last damaged before entity starts
     *                                regenerating health. 10 by default.
     * @param {number} regenAmount    Health regenerated per tick. 0.1% of max health by default.
     * @param {boolean} invincible    If entity is invincible. false by default.
     * @param {boolean} hasFallDamage If entity can suffer fall damage. true by default.
     * @return {CStats} This CStats component.
     */
    constructor({ damage = 0, maxHealth = 1, speed = 0,
                    regenCooldown = 10, regenAmount = maxHealth * 0.001,
                    invincible = false, hasFallDamage = true }) {
        Object.assign(this, { damage, maxHealth, speed, regenCooldown, regenAmount, invincible, hasFallDamage })
        this.currentHealth = this.maxHealth;
        this.name = "stats"
        this.elapsedTime = this.regenCooldown;
        this.isDamaged = false;
        this.isDead = false;
        return this;
    }

    /**
     * Applies damage to entity.
     * @param {number} damage Damage to apply.
     */
    applyDamage(damage) {
        if (!this.invincible) {
            this.currentHealth = clamp(this.currentHealth - damage, 0, this.maxHealth);
            this.elapsedTime = 0;
            this.isDamaged = true;
            this.isDead = this.currentHealth === 0;
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

    // /**
    //  * Determines if entity is dead, i.e. current health is 0 or less.
    //  * @return {boolean} If entity is dead.
    //  */
    // isDead {
    //     return this.currentHealth <= 0;
    // }
}