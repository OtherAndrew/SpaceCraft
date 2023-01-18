class HUD {
    constructor(scene) {
        Object.assign(this, {scene, open: false, x: 420, y: 690, d: 42, r: 15, s: 47});
        // this.entities = new Array(16).fill(null);
        this.containers = [];

        let i = 0;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                this.containers.push(new Container(i++, this.x + (this.s * col), this.y - (this.s * row)))
            }
        }

        this.entitiesCount = new Map();
        this.containers[0].item = new block1();
        this.containers[1].item = new block2();
        this.containers[2].item = new block3();
        console.log(this.containers);

        // for testing HUD vs Inventory mode
        // this.open = true;

        // for testing Ent list
        // this.add(new block3());
        // this.add(new block2());
        // this.add(new block3());
        // this.add(new plant1());
        // this.remove(0);
        // this.add(new block1());
        // this.remove(0);
        // this.add(new block3());
        // this.add(new block3());
        // this.swap(0, 10);
        // this.delete(15);

        // console.log(this);
    };

    // called by ent remove system to add to inven
    add(entity) {
        if (this.entitiesCount.size === 16) {
            return false;
        }
        // rough first draft code, needs refactor
        let firstNull = null;
        for (let i = 0; i < 16; i++) {
            if (this.containers[i] && entity.constructor === this.containers[i].constructor) {
                this.increment(i);
                return true;
            } else if (firstNull == null && this.containers[i] == null) {
                firstNull = i;
            }
        }
        if (firstNull != null) {
            this.containers[firstNull] = entity;
            this.increment(firstNull);
            return true;
        } else {
            return false;
        }
    };

    // called by add to stack ents of a type in inven
    increment(index) {
        if (this.entitiesCount.has(index)) {
            this.entitiesCount.set(index, this.entitiesCount.get(index) + 1);
        } else {
            this.entitiesCount.set(index, 1);
        }
    };

    // called by ent place system to remove from inven
    // returns ent to be re-added to engine
    remove(index) {
        let ent = this.containers[index];
        if (ent) {
            if (this.decrement(index)) {
                return structuredClone(ent);
            } else {
                this.containers[index] = null;
                return ent;
            }
        }
    };

    // called by remove to remove ents from a stack in inven
    // returns remaining count
    decrement(index) {
        if (this.entitiesCount.has(index)) {
            var count = this.entitiesCount.get(index) - 1;
            if (count) {
                this.entitiesCount.set(index, count);
            } else {
                this.entitiesCount.delete(index);
            }
        }
        return count;
    };

    // called to swap ent locations
    swap(from, to) {
        let placeholder = this.containers[from];
        this.containers[from] = this.containers[to];
        this.containers[to] = placeholder;

        let countF = this.entitiesCount.get(from);
        let countT = this.entitiesCount.get(to);
        if (countF && countT) {
            this.entitiesCount.set(from, countT);
            this.entitiesCount.set(to, countF);
        } else if (countF) {
            this.entitiesCount.delete(from);
            this.entitiesCount.set(to, countF);
        } else if (countT) {
            this.entitiesCount.delete(to);
            this.entitiesCount.set(to, countT);
        }
    };

    // called to delete ent entirely from inven
    delete(index) {
        this.containers[index] = null;
        this.entitiesCount.delete(index);
        // disable it completely
        // ent = null;
    };

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

class Container extends Path2D {
    constructor(slot, x, y) {
        super();
        Object.assign(this, {slot, x, y});
        this.midx = this.x + 21;
        this.midy = this.y + 21;
        this.item = null;
        this.itemCount = 0;
        this.selected = false;
        this.roundRect(this.x, this.y, 42, 42, 15)

        // canvas.addEventListener("click", e => {
        //     if (ctx.isPointInPath(this, e.offsetX, e.offsetY)) {
        //         ctx.fillSytle = "green";
        //         ctx.fill(this);
        //     } else {
        //         ctx.fillSytle = "blue";
        //         ctx.fill(this);
        //     }
        // });
    }

    draw(ctx) {
        ctx.fillStyle = "blue";
        ctx.strokeStyle = "white";
        ctx.lineWidth="2";
        ctx.fill(this);
        ctx.stroke(this);
        // this.roundRect(ctx, this.x, this.y, 42, 42, 15);
        if (this.item) {
            let itemImage = ASSET_MANAGER.getAsset(this.item.sprite);
            let shrunkX = itemImage.width * 0.65;
            let shrunkY = itemImage.height * 0.65;
            ctx.drawImage(itemImage, this.midx - shrunkX / 2, this.midy - shrunkY / 2, shrunkX, shrunkY);
            // this.item.draw(ctx, this.midx - this.item.width / 2, this.midy - this.item.height / 2);
        }
    }

    // credit: https://www.scriptol.com/html5/canvas/rounded-rectangle.php
    // roundRect(ctx, x, y, w, h, radius) {
    //     let r = x + w;
    //     let b = y + h;
    //     ctx.beginPath();
    //     ctx.fillStyle = "blue";
    //     ctx.strokeStyle = "white";
    //     ctx.lineWidth="2";
    //     ctx.moveTo(x+radius, y);
    //     ctx.lineTo(r-radius, y);
    //     ctx.quadraticCurveTo(r, y, r, y+radius);
    //     ctx.lineTo(r, y+h-radius);
    //     ctx.quadraticCurveTo(r, b, r-radius, b);
    //     ctx.lineTo(x+radius, b);
    //     ctx.quadraticCurveTo(x, b, x, b-radius);
    //     ctx.lineTo(x, y+radius);
    //     ctx.quadraticCurveTo(x, y, x+radius, y);
    //     ctx.fill();
    //     ctx.stroke();
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
        this.type = "rock";
        this.sprite = "./assets/sprites/b1.png";
    };
}

class block2 extends Block {
    constructor() {
        super();
        this.type = "sand";
        this.sprite = "./assets/sprites/b2.png";
    };
}

class block3 extends Block {
    constructor() {
        super();
        this.type = "dirt";
        this.sprite = "./assets/sprites/b3.png";
    };
}