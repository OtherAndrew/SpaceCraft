class HUD {
    constructor(containermanager, player) {
        // hook relevant ent and system
        this.player = player;
        this.cm = containermanager;
        
        // create player inventory and trashcan
        this.cm.createInventory(this.player, 420, 690, 4, 4, undefined, true);
        this.cm.createInventory(null, 561, 502, 1, 1, "red");
        this.cm.activateInventory(this.player);
        this.cm.activateInventory(null);
        
        this.containers = this.cm.getInventory(player);
        this.containers[0].active = true;
        for (let bar = 1; bar < 4; bar++) {
            this.containers[bar].active = false;
        }
        this.add(new block1());
        this.add(new block2());
        this.add(new block1());
        this.add(new block3());
        console.log(this.containers);
    };

    // called by ent remove system to add to inven
    add(entity) {
        this.cm.addToInventory(this.player, entity);
    };

    // called by ent place system to remove from inven
    // returns ent to be re-added to engine
    // remove(index) {
    //     this.cm.removeFromInventory(this.player, index);
    // };
    //
    // // called to swap ent locations
    // swap(from, to) {
    //     this.cm.swapInInventory(this.player, from, to);
    // };

    // called to delete ent entirely from inven
    // delete(index) {
    //     this.containers[index] = null;
    //     this.entitiesCount.delete(index);
    //     // disable it completely
    //     // ent = null;
    // };

    // update(uiActive) {
    //     this.open = uiActive;
    // };

    // draw(ctx) {
    //     // draw backdrop of inventory
    //     ctx.save();
    //     let rowCount = 5;
    //     if (!this.open) {
    //         ctx.globalAlpha = 0.7;
    //         rowCount = 1;
    //     }
    //     let i = 0;
    //     for (let row = 0; row < rowCount; row++) {
    //         for (let col = 0; col < 4; col++) {
    //             if (this.containers[i]) {
    //                 this.containers[i++].draw(ctx);
    //             }
    //         }
    //     }
    //     ctx.restore();
    // };
}
// Testing classes
class Block {
    constructor() {
        this.sprite = null;
        this.width = 32;
        this.height = 32;
    };

    draw(ctx, x, y) {
        ctx.drawImage(ASSET_MANAGER.getAsset(this.sprite), x, y);
    };
}

// Testing classes
class block1 extends Block {
    constructor() {
        super();
        this.tag = "rock";
        this.sprite = "./assets/sprites/b1.png";
    };
}

class block2 extends Block {
    constructor() {
        super();
        this.tag = "sand";
        this.sprite = "./assets/sprites/b2.png";
    };
}

class block3 extends Block {
    constructor() {
        super();
        this.tag = "dirt";
        this.sprite = "./assets/sprites/b3.png";
    };
}