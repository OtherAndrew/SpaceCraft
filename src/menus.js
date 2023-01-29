class CraftMenu {

    constructor(containManager) {
        this.cm = containManager;
        this.recipes = [];

        // TESTING
        this.x = 30;
        this.y = 30;

        this.cm.createInventory("table1", this.x, this.y, 1, 3, "pink", "recipe");
        this.cm.addToInventory("table1", new block1());
        this.cm.addToInventory("table1", new block2());
        this.cm.addToInventory("table1", new block3(), 2);
        this.cm.activateInventory("table1");
        this.recipes.push("table1");

        this.cm.createInventory("table2", this.x, this.y + 54, 1, 2, "pink", "recipe");
        this.cm.addToInventory("table2", new block2());
        this.cm.addToInventory("table2", new block3());
        this.cm.activateInventory("table2");
        this.recipes.push("table2");

        this.cm.createInventory("furnace1", this.x, this.y + 54 * 2, 1, 2, "red", "recipe");
        this.cm.addToInventory("furnace1", new block3());
        this.cm.addToInventory("furnace1", new block1());
        this.cm.activateInventory("furnace1");
        this.recipes.push("furnace1");

        for (const entry in this.recipes) {
            let recipe = this.recipes[entry];
            if (recipe.includes("table")) {
                this.denoteProduct(recipe, "green");
            } else if (recipe.includes("furnace")) {
                this.denoteProduct(recipe, "grey");
            }
        }
    }

    denoteProduct(owner, color) {
        let product = this.cm.getInventory(owner)[0];
        product.keyword = owner;
        product.font = "bold 20";
        product.fillColor = color;
        product.x -= 7;
        product.y -= 4;
        product.width += 7;
        product.calculateMiddle();
    }

    update(uiActive) {
        // check player counts
        // update own/required counts
        // update whether something creatable or not
        // if (true) {
        //     for (let i = 0; i < this.recipes.length; i++) {
        //         let uncraftable = true;
        //         for (let j = 1; j < this.recipes[i].length && uncraftable; j++) {
        //             uncraftable = this.cm.checkInsufficient(this.recipes[i][j]);
        //         }
        //         this.recipes[i][0].uncraftable = uncraftable;
        //     }
        // }
    }

    draw(uiActive) {

    }
}

class StoreMenu {

}