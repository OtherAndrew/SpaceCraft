class HUD {
    constructor(game) {
        Object.assign(this, {game, open: false, x: 420, y: 690, d: 42, r: 15, s: 47});
        this.entities = new Array(16).fill(null);
        this.entitiesCount = new Map();
        this.game.hud = this;

        // for testing HUD vs Inventory mode
        // this.open = true;

        // for testing Ent list
        this.add(new weapon1());
        this.add(new block2());
        this.add(new weapon1());
        this.add(new plant1());
        this.remove(0);
        this.add(new block5());
        this.remove(0);
        this.add(new weapon1());
        this.add(new weapon1());
        this.swap(0, 10);
        this.delete(15);

        console.log(this);
    };

    // called by ent remove system to add to inven
    add(entity) {
        if (this.entitiesCount.size === 16) {
            return false;
        }
        // rough first draft code, needs refactor
        let firstNull = null;
        for (let i = 0; i < 16; i++) {
            if (this.entities[i] && entity.constructor === this.entities[i].constructor) {
                this.increment(i);
                return true;
            } else if (firstNull == null && this.entities[i] == null) {
                firstNull = i;
            }
        }
        if (firstNull != null) {
            this.entities[firstNull] = entity;
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
        let ent = this.entities[index];
        if (ent) {
            if (this.decrement(index)) {
                return structuredClone(ent);
            } else {
                this.entities[index] = null;
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
        let placeholder = this.entities[from];
        this.entities[from] = this.entities[to];
        this.entities[to] = placeholder;

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
        this.entities[index] = null;
        this.entitiesCount.delete(index);
        // disable it completely
        // ent = null;
    };

    update() {

    };

    draw(ctx) {
        // draw backdrop of inventory
        let rowCount = 5;
        if (!this.open) {
            ctx.globalAlpha = 0.7;
            rowCount = 1;
        }
        for (let row = 0; row < rowCount; row++) {
            for (let col = 0; col < 4; col++) {
                if (row < 4) {
                    this.roundRect(ctx, this.x + (this.s * col), this.y - (this.s * row), this.d, this.d, this.r);
                } else if (col === 3) {
                    this.roundRect(ctx, this.x + (this.s * col), this.y - (this.s * row), this.d, this.d, this.r);
                }
            }
        }
        ctx.globalAlpha = 1;

        // draw ents in inventory (placeholder)
        for (let i = 0; i < 16; i++) {
            if (this.entities[i]) {
                this.entities[i].draw();
            }
        }
    };

    // credit: https://www.scriptol.com/html5/canvas/rounded-rectangle.php
    roundRect(ctx, x, y, w, h, radius) {
        let r = x + w;
        let b = y + h;
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.strokeStyle = "white";
        ctx.lineWidth="2";
        ctx.moveTo(x+radius, y);
        ctx.lineTo(r-radius, y);
        ctx.quadraticCurveTo(r, y, r, y+radius);
        ctx.lineTo(r, y+h-radius);
        ctx.quadraticCurveTo(r, b, r-radius, b);
        ctx.lineTo(x+radius, b);
        ctx.quadraticCurveTo(x, b, x, b-radius);
        ctx.lineTo(x, y+radius);
        ctx.quadraticCurveTo(x, y, x+radius, y);
        ctx.fill();
        ctx.stroke();
    };
}

// Testing classes
class block2 {
    constructor() {
        this.type = "rock";
    };

    draw() {

    };
}

class block5 {
    constructor() {
        this.type = "sand";
    };

    draw() {

    };
}

class weapon1 {
    constructor() {
        this.type = "sword";
    };

    draw() {

    };
}

class plant1 {
    constructor() {
        this.type = "sunflower";
    };

    draw() {

    };
}