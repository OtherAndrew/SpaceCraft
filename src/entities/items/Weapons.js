/**
 * Weapon item blueprints.
 *
 * @author Andrew Nguyen
 */

/**
 * The player's starter pistol. Weak but does the job.
 * T1 weapon.
 */
class LaserPistol {
    constructor() {
        this.tag = "Laser Pistol";
        this.name = "weapon";
        this.components = [
            new CSprite({
                sprite: ASSET_MANAGER.cache[WEAPON_PATH.LASER_PISTOL],
                sWidth: 32,
                sHeight: 32
            }),
            new CWeaponProps('weak_bullet', 0.5)
        ];
        return this;
    }
}

/**
 * An upgrade from the starter pistol. Fires slightly faster and has slightly longer range.
 * T2 weapon.
 */
class LaserGun {
    constructor() {
        this.tag = "Laser Gun";
        this.name = "weapon";
        this.components = [
            new CSprite({
                sprite: ASSET_MANAGER.cache[WEAPON_PATH.LASER_GUN],
                sWidth: 32,
                sHeight: 32
            }),
            new CWeaponProps('mid_bullet', 0.33)
        ];
        return this;
    }
}

/**
 * An upgrade from the Laser Gun. Fires even faster and has even longer range.
 * T3 weapon.
 */
class LaserRifle {
    constructor() {
        this.tag = "Laser Rifle";
        this.name = "weapon";
        this.components = [
            new CSprite({
                sprite: ASSET_MANAGER.cache[WEAPON_PATH.LASER_RIFLE],
                sWidth: 32,
                sHeight: 32
            }),
            new CWeaponProps('strong_bullet', 0.25)
        ];
        return this;
    }
}

/**
 * Shoots flames at short range to do continuous damage. Pierces mobs.
 * T2 weapon.
 */
class Flamethrower {
    constructor() {
        this.tag = "Flamethrower";
        this.name = "weapon";
        this.components = [
            new CSprite({
                sprite: ASSET_MANAGER.cache[WEAPON_PATH.FLAMETHROWER],
                sWidth: 32,
                sHeight: 32
            }),
            new CWeaponProps('fire', 5, 7, SOUND_PATH.FIRE)
        ];
        return this;
    }
}

/**
 * Shoots arcing grenades that cause a large explosion, dealing massive damage.
 * T4 weapon.
 */
class GrenadeLauncher {
    constructor() {
        this.tag = "Grenade Launcher";
        this.name = "weapon";
        this.components = [
            new CSprite({
                sprite: ASSET_MANAGER.cache[WEAPON_PATH.GRENADE_LAUNCHER],
                sWidth: 32,
                sHeight: 32
            }),
            new CWeaponProps('bomb', 1)
        ];
        return this;
    }
}

/**
 * Fires a volley of three mini bombs, dealing massive damage but with a small explosion.
 * T3 weapon.
 */
class HandCannon {
    constructor() {
        this.tag = "Hand Cannon";
        this.name = "weapon";
        this.components = [
            new CSprite({
                sprite: ASSET_MANAGER.cache[WEAPON_PATH.HAND_CANNON],
                sWidth: 32,
                sHeight: 32
            }),
            new CWeaponProps("mini_bomb", 1.5)
        ];
        return this;
    }
}

/**
 * Fires a continuous stream of bullets, dealing massive damage.
 * Restricts the player's movement when active and has a long cooldown.
 * T4 weapon.
 */
class Minigun {
    constructor() {
        this.tag = "Minigun";
        this.name = "weapon";
        this.components = [
            new CSprite({
                sprite: ASSET_MANAGER.cache[WEAPON_PATH.MINIGUN],
                sWidth: 42,
                sHeight: 42,
            }),
            new CWeaponProps('minigun_bullet', 12, 12, SOUND_PATH.MINIGUN)
        ];
        return this;
    }
}

/**
 * Fires a single bullet that deals massive damage and pierces mobs and blocks.
 * Restricts the player's movement when active and has a long cooldown.
 * T4 weapon.
 */
class Railgun {
    constructor() {
        this.tag = "Railgun";
        this.name = "weapon";
        this.components = [
            new CSprite({
                sprite: ASSET_MANAGER.cache[WEAPON_PATH.RAILGUN],
                sWidth: 36,
                sHeight: 36,
            }),
            new CWeaponProps('railgun_bullet', 4)
        ];
        return this;
    }
}