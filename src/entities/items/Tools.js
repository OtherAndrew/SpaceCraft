/**
 * Tool item blueprints.
 *
 * @author Andrew Nguyen
 */

class Pickaxe {
    constructor() {
        this.tag = "pickaxe";
        this.name = "tool";
        this.components = [
            new CSprite({
                sprite: ASSET_MANAGER.cache[MISC_PATH.PICK],
                sWidth: BLOCKSIZE,
                sHeight: BLOCKSIZE
            })
        ];
        return this;
    }
}