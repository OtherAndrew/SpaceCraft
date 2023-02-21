class InteractiveMenu {

    builtin_recipes = [
        [{tag: 'interact_furnace'},
            {tag: 'tile_dirt', count: 10},
            {tag: 'tile_stone', count: 20}],
        [{tag: 'interact_anvil'},
            {tag: 'item_copper bar', count: 10},
            {tag: 'tile_dirt', count: 20},
            {tag: 'tile_stone', count: 5}],
        [{tag: 'interact_table'},
            {tag: 'item_iron bar', count: 10},
            {tag: 'tile_copper', count: 5}],
        [{tag: 'interact_station'},
            {tag: 'interact_table'},
            {tag: 'tile_stone', count: 200},
            {tag: 'tile_copper'}], // trader plan
        [{tag: 'interact_hub'},
            {tag: 'interact_table'},
            {tag: 'tile_stone', count: 200},
            {tag: 'tile_copper'}], // trader plan
    ];

    table_recipes = [
        [{tag: 'interact_trader'},
            {tag: 'tile_stone', count: 80},
            {tag: 'item_copper bar', count: 20}],
        [{tag: 'laserGun', name: 'weapon'},
            {tag: 'laserPistol', name: 'weapon'},
            {tag: 'item_ferrite bar', count: 10},
            {tag: 'tile_coal', count: 20}],
        [{tag: 'laserRifle', name: 'weapon'},
            {tag: 'laserGun', name: 'weapon'},
            {tag: 'item_iron bar', count: 10},
            {tag: 'tile_coal', count: 20}],
        [{tag: 'flamethrower', name: 'weapon'},
            {tag: 'laserGun', name: 'weapon'},
            {tag: 'item_bismuth bar', count: 10},
            {tag: 'tile_coal', count: 20}]
        // refined silica 1:1 silica
        // circuit 1 goldbar, 5 amber
    ];

    furnace_recipes = [
        [{tag: 'interact_chest'},       // TESTING
            {tag: 'tile_sand'}],
        [{tag: 'item_bismuth bar'},
            {tag: 'tile_bismuth', count: 2}],
        [{tag: 'item_cobalt bar'},
            {tag: 'tile_cobalt', count: 2}],
        [{tag: 'item_copper bar'},
            {tag: 'tile_copper', count: 2}],
        [{tag: 'item_ferrite bar'},
            {tag: 'tile_ferrite', count: 2}],
        [{tag: 'item_gold bar'},
            {tag: 'tile_gold', count: 2}],
        [{tag: 'item_iron bar'},
            {tag: 'tile_iron', count: 2}],
        [{tag: 'item_paraffin bar'},
            {tag: 'tile_paraffin', count: 2}],
        [{tag: 'item_tin bar'},
            {tag: 'tile_tin', count: 2}],
        [{tag: 'item_titanite bar'},
            {tag: 'tile_titanite', count: 2}],
        [{tag: 'item_tungsten bar'},
            {tag: 'tile_tungsten', count: 2}],
        [{tag: 'item_steel bar'},
            {tag: 'tile_iron'},
            {tag: 'tile_coal'},
            {tag: 'tile_silica'}],
    ];

    constructor(containManager) {
        this.cm = containManager;
        this.recipes = [];
        this.chestCount = 0;

        // TESTING
        this.x = 30;
        this.y = 30;
        this.spacer = 54;

        this.buildRecipe('builtin', this.builtin_recipes);
        this.buildRecipe('table', this.table_recipes);
        this.buildRecipe('furnace', this.furnace_recipes);

        this.recipes.forEach(recipe => this.denoteRecipe(recipe));

        // this.cm.loadInventory('builtin');
    }

    buildRecipe(owner, recipes) {
        for (let i = 0; i < recipes.length; i++) {
            let id = i + '_' + owner;
            this.cm.createInventory(
                id,
                this.x,
                this.y + this.spacer * i,
                1,
                recipes[i].length,
                CRAFT_COLOR[owner.toUpperCase() + '_I'],
                'recipe'
            );
            for (let j = 0; j < recipes[i].length; j++) {
                let item = recipes[i][j];
                let tag = item.tag;
                let generate;
                if (item.name && item.name.includes('weapon')) {
                    generate = new Entity(generateWeapon(item));
                } else if (tag.includes('item')) {
                    generate = new Entity(generateItem(tag));
                } else if (tag.includes('interact')) { // interactive
                    generate = new Entity(generateInteractive(tag));
                } else { // tile
                    generate = new Entity(generateBlock(tag, 0, 0, 'craftgen'));
                }
                this.cm.addToInventory(
                    id,
                    generate,
                    item.count
                );
            }
            this.recipes.push(id);
        }
    }

    denoteRecipe(owner) {
        let recipe = this.cm.getInventory(owner)
        let product = recipe[0];
        product.keyword = owner;
        product.font = 'bold 20';
        product.fillColor = CRAFT_COLOR[cleanTag(owner.toUpperCase()) + '_P'];
        product.x -= 7;
        product.y -= 4;
        product.width += 7;
        product.calculateMiddle();

        for (let i = 1; i < recipe.length; i++) {
            let ingredient = recipe[i];
            ingredient.font = '12'
            ingredient.playerCount = this.cm.playerCounts.get(ingredient.item.tag);
            ingredient.update = function () {
                this.displayText = ingredient.playerCount + '/' + this.count;
            }
        }
    }

    update(menuActive) {
        if (menuActive) {
            let actives = this.cm.activeInventory;
            for (let i = 2; i < actives.length; i++) {
                if (this.recipes.includes(actives[i][0].owner)) { // if this is recognized as a recipe
                    actives[i][0].uncraftable = !this.cm.checkSufficient(actives[i]);  // check if player can make it
                    for (let j = 1; j < actives[i].length; j++) { // update each ingredient
                        let ingredient = actives[i][j];
                        let playerCount = this.cm.getPlayerCounts(ingredient.item.tag);
                        if (playerCount) {
                            ingredient.playerCount = playerCount;
                            ingredient.insufficient = playerCount < ingredient.count;
                        } else {
                            ingredient.playerCount = 0;
                            ingredient.insufficient = true;
                        }
                    }
                }
            }
        }
    }
}
