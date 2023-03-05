/**
 * Tool item blueprints.
 *
 * @author Andrew Nguyen
 */

class Pickaxe {
    constructor() {
        this.tag = "Pickaxe";
        this.name = "tool";
        this.components = [
            new CSprite({
                sprite: ASSET_MANAGER.cache[MISC_PATH.PICK],
                sWidth: BLOCKSIZE,
                sHeight: BLOCKSIZE
            }),
            new CStats({
                damage: 1
            })
        ];
        return this;
    }
}

class SuperPickaxe {
    constructor() {
        this.tag = "Super Pickaxe";
        this.name = "tool";
        this.components = [
            new CSprite({
                sprite: ASSET_MANAGER.cache[MISC_PATH.SUPER_PICK],
                sWidth: BLOCKSIZE,
                sHeight: BLOCKSIZE
            }),
            new CStats({
                damage: 100
            })
        ];
        return this;
    }
}