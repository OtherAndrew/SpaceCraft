/**
 * Manages weapon cooldowns.
 *
 * @author Andrew Nguyen
 */

class WeaponSystem {
    constructor(entities) {
        this.entities = entities;
    }
    update(tick) {
        // const weaponList = this.entities.filter(e => e.components["weaponProps"]);
        // weaponList.forEach(weapon => {
        //     const wProps = weapon.components['weaponProps'];
        //     if (!wProps.readyToFire()) {
        //         if (wProps.cooldownTime >= wProps.cooldownDuration) {
        //             wProps.cooldownTime = 0;
        //             wProps.fireTime = 0;
        //         } else {
        //             wProps.cooldownTime += tick;
        //         }
        //     }
        //     // else if (!mouseDown) { // regen when not using
        //     //      w.fireTime = clamp(w.fireTime - tick/3, 0, w.fireTime);
        //     // }
        // });
        for (let i = 0; i < this.entities.length; i++) {
            const e = this.entities[i];
            if (e.components["weaponProps"]) {
                const wProps = e.components['weaponProps'];
                if (!wProps.readyToFire()) {
                    if (wProps.cooldownTime >= wProps.cooldownDuration) {
                        wProps.cooldownTime = 0;
                        wProps.fireTime = 0;
                    } else {
                        wProps.cooldownTime += tick;
                    }
                }
            }
        }
    }
}