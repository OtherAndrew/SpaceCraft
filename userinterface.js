class HUD {
    // constructor(scene) {
    //     Object.assign(this, {scene, open: false, x: 420, y: 690, s: 47});
    //     this.game = this.scene.game;
    //     this.containers = [];
    //     let i = 0;
    //     for (let row = 0; row < 4; row++) {
    //         for (let col = 0; col < 4; col++) {
    //             this.containers.push(new Container(null, this.x + (this.s * col), this.y - (this.s * row), i++))
    //         }
    //     }
    //     this.fillCount = 0;
    //
    //     console.log(this.containers);
    //     console.log("Fill count: %d", this.fillCount);
    // };

    constructor(containermanager, player) {
        this.player = player;
        this.cm = containermanager;
        this.containers = this.cm.getInventory(player);
        // this.fillCount = 0;
        this.add(new block1());
        this.add(new block2());
        this.add(new block1());
        this.add(new block3());
        console.log(this.containers);
        // console.log("Fill count: %d", this.fillCount);
    };

    // called by ent remove system to add to inven
    add(entity) {
        // if (this.fillCount === 16) {
        //     return false;
        // }
        // let firstNull = null;
        // for (let i = 0; i < 16; i++) {
        //     if (this.containers[i].item && entity.tag === this.containers[i].item.tag) {
        //         this.containers[i].count++;
        //         return true;
        //     } else if (firstNull == null && this.containers[i].item == null) {
        //         firstNull = this.containers[i];
        //     }
        // }
        // if (firstNull != null) {
        //     firstNull.item = entity;
        //     firstNull.count++;
        //     // this.fillCount++;
        //     return true;
        // } else {
        //     return false;
        // }
        this.cm.addToInventory(this.player, entity);
    };

    // called by ent place system to remove from inven
    // returns ent to be re-added to engine
    remove(index) {
        // let ent = this.containers[index];
        // if (ent.item) {
        //     if (--ent.count) {
        //         return structuredClone(ent.item);
        //     } else {
        //         let item = ent.item;
        //         ent.item = null;
        //         // this.fillCount--;
        //         return item;
        //     }
        // }
        this.cm.removeFromInventory(this.player, index);
    };

    // called to swap ent locations
    swap(from, to) {
        // let placeholder = this.containers[from].item;
        // this.containers[from].item = this.containers[to].item;
        // this.containers[to].item = placeholder;
        //
        // placeholder = this.containers[from].count;
        // this.containers[from].count = this.containers[to].count;
        // this.containers[to].count = placeholder;
        this.cm.swapInInventory(this.player, from, to);
    };

    // called to delete ent entirely from inven
    // delete(index) {
    //     this.containers[index] = null;
    //     this.entitiesCount.delete(index);
    //     // disable it completely
    //     // ent = null;
    // };

    update(uiActive) {
        this.open = uiActive;
    };

    draw(ctx) {
        // draw backdrop of inventory
        ctx.save();
        let rowCount = 5;
        if (!this.open) {
            ctx.globalAlpha = 0.7;
            rowCount = 1;
        }
        let i = 0;
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < 4; col++) {
                if (this.containers[i]) {
                    this.containers[i].draw(ctx);
                    i++;
                }
            }
        }
        ctx.restore();
    };
}

// class Container extends Path2D {
//     constructor(owner, x, y, slot) {
//         super();
//         Object.assign(this, {owner, x, y, slot});
//         this.midx = this.x + 21;
//         this.midy = this.y + 21;
//         this.item = null;
//         this.count = 0;
//         this.selected = false;
//         //this.roundRect(this.x, this.y, 42, 42, 15)
//
//         // canvas.addEventListener("click", e => {
//         //     if (ctx.isPointInPath(this, e.offsetX, e.offsetY)) {
//         //         ctx.fillStyle = "green";
//         //         ctx.fill(this);
//         //     } else {
//         //         ctx.fillStyle = "blue";
//         //         ctx.fill(this);
//         //     }
//         // });
//     }
//
//     draw(ctx) {
//         // ctx.fillStyle = "blue";
//         // ctx.strokeStyle = "white";
//         // ctx.lineWidth="2";
//         // ctx.fill(this);
//         // ctx.stroke(this);
//         this.roundRect(ctx, this.x, this.y, 42, 42, 15);
//         if (this.item) {
//             let itemImage = ASSET_MANAGER.getAsset(this.item.sprite);
//             let shrunkX = itemImage.width * 0.65;
//             let shrunkY = itemImage.height * 0.65;
//             ctx.drawImage(itemImage, this.midx - shrunkX / 2, this.midy - shrunkY / 2, shrunkX, shrunkY);
//             ctx.save();
//             ctx.globalAlpha = 1;
//             ctx.fillStyle = "white";
//             ctx.fillText(this.count, this.x+8, this.y + 33);
//             ctx.restore();
//         }
//     }
//
//     // credit: https://www.scriptol.com/html5/canvas/rounded-rectangle.php
//     roundRect(ctx, x, y, w, h, radius) {
//         let r = x + w;
//         let b = y + h;
//         ctx.beginPath();
//         ctx.fillStyle = "blue";
//         ctx.strokeStyle = "white";
//         ctx.lineWidth="2";
//         ctx.moveTo(x+radius, y);
//         ctx.lineTo(r-radius, y);
//         ctx.quadraticCurveTo(r, y, r, y+radius);
//         ctx.lineTo(r, y+h-radius);
//         ctx.quadraticCurveTo(r, b, r-radius, b);
//         ctx.lineTo(x+radius, b);
//         ctx.quadraticCurveTo(x, b, x, b-radius);
//         ctx.lineTo(x, y+radius);
//         ctx.quadraticCurveTo(x, y, x+radius, y);
//         ctx.fill();
//         ctx.stroke();
//     };
// }

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