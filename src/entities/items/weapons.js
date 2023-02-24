/**
 * Weapon item blueprints.
 *
 * @author Andrew Nguyen
 */
class LaserPistol {
    constructor() {
        this.tag = "laserPistol";
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

class LaserGun {
    constructor() {
        this.tag = "laserGun";
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

class LaserRifle {
    constructor() {
        this.tag = "laserRifle";
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

class Flamethrower {
    constructor() {
        this.tag = "flamethrower";
        this.name = "weapon";
        this.components = [
            new CSprite({
                sprite: ASSET_MANAGER.cache[WEAPON_PATH.FLAMETHROWER],
                sWidth: 32,
                sHeight: 32
            }),
            new CWeaponProps('fire', 6, 3)
        ];
        return this;
    }
}

class GrenadeLauncher {
    constructor() {
        this.tag = "grenadeLauncher";
        this.name = "weapon";
        this.components = [
            new CSprite({
                sprite: ASSET_MANAGER.cache[WEAPON_PATH.GRENADE_LAUNCHER],
                sWidth: 32,
                sHeight: 32
            }),
            new CWeaponProps('bomb', 1.25)
        ];
        return this;
    }
}

class HandCannon {
    constructor() {
        this.tag = "handCannon";
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

class Minigun {
    constructor() {
        this.tag = "minigun";
        this.name = "weapon";
        this.components = [
            new CSprite({
                sprite: ASSET_MANAGER.cache[WEAPON_PATH.MINIGUN],
                sWidth: 42,
                sHeight: 42,
            }),
            new CWeaponProps('minigun_bullet', 10, 2.5)
        ];
        return this;
    }
}

class Railgun {
    constructor() {
        this.tag = "railgun";
        this.name = "weapon";
        this.components = [
            new CSprite({
                sprite: ASSET_MANAGER.cache[WEAPON_PATH.RAILGUN],
                sWidth: 36,
                sHeight: 36,
            }),
            new CWeaponProps('railgun_bullet', 5)
        ];
        return this;
    }
}