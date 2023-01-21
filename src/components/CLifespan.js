





/**
 * Adds a lifespan to an entity, current build does not regenerate over time.
 * The plan is to regenerate life when not being damaged.
 * 
 * @param {Number} amount 
 */
const CLifespan = function CLifespan(amount) {
    this.total = amount
    this.current = amount
}
CLifespan.prototype.name = 'lifespan'