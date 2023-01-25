class HUD {
    constructor(containermanager, player) {
        // register relevant ent and system
        this.player = player;
        this.cm = containermanager;
        
        // create player inventory and trashcan
        this.cm.createInventory(this.player, 420, 690, 4, 4, undefined, true);
        this.cm.createInventory(null, 561, 502, 1, 1, "red");
        this.cm.activateInventory(this.player);
        this.cm.activateInventory(null);
        
        this.containers = this.cm.getInventory(player);
        this.activeContainer = this.containers[0];
        this.getStartPoint();

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

    draw(uiActive, ctx) {
        if (!uiActive) {
            ctx.save();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "yellow";
            this.getStartPoint();
            ctx.beginPath();
            ctx.rect(this.x, this.y, 42, 42);
            ctx.stroke();
            ctx.restore();
        }
    }

    getStartPoint() {
        this.x = this.activeContainer.x;
        this.y = this.activeContainer.y;
    }

    update(uiActive, keys) {
        if (!uiActive) {
            if (keys['1']) {
                this.activeContainer = this.containers[0];
            }
            if (keys['2']) {
                this.activeContainer = this.containers[1];
            }
            if (keys['3']) {
                this.activeContainer = this.containers[2];
            }
            if (keys['4']) {
                this.activeContainer = this.containers[3];
            }
        }
    }
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