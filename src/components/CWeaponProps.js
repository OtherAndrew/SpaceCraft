/**
 * Component that keeps track of weapon properties.
 * (Damage/projectile info contained in {@link ./src/entities/ProjectileFactory.js}).
 *
 * @author Andrew Nguyen
 */

class CWeaponProps {

    /**
     * Initializes CWeaponProps component.
     * @param {string} projectileType   The projectile this weapon fires
     *                                  (see {@link ./src/entities/ProjectileFactory.js}).
     * @param {number} cooldownDuration How long the weapon cooldown lasts. 0 by default.
     * @param {number} fireDuration     How long the weapon can continuously fire for, if it can continuously fire.
     *                                  0 by default.
     * @param {string | null} sound     Sound effect associated with weapon. null by default.
     * @return {CWeaponProps}
     */
    constructor(projectileType, cooldownDuration = 0, fireDuration = 0, sound = null) {
        Object.assign(this, { projectileType, cooldownDuration, fireDuration, sound });
        this.name = "weaponProps";
        this.cooldownTime = 0;
        this.fireTime = 0;
        return this;
    }

    readyToFire() {
        return this.fireTime <= this.fireDuration;
    }

}