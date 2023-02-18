class InteractiveMenu {

    builtin_recipes = [
        [{tag: 'interact_furnace'},
            {tag: 'tile_dirt', count: 10},
            {tag: 'tile_stone', count: 20}],
        [{tag: 'interact_anvil'},
            {tag: 'tile_copper', count: 10},  // item_bar_copper
            {tag: 'tile_dirt', count: 20},
            {tag: 'tile_stone', count: 5}],
        [{tag: 'interact_table'},
            {tag: 'tile_iron', count: 10},  // item_bar_iron
            {tag: 'tile_copper', count: 5}]
    ];

    table_recipes = [
        [{tag: 'interact_chest'},
            {tag: 'tile_dirt'}],
        [{tag: 'tile_iron'},
            {tag: 'tile_dirt', count: 5},
            {tag: 'tile_stone', count: 2}],
        [{tag: 'tile_dirt'},
            {tag: 'tile_stone'}],
        [{tag: 'tile_stone'},
            {tag: 'tile_dirt'}]
    ];

    furnace_recipes = [
        [{tag: 'tile_iron'},
            {tag: 'tile_dirt', count: 5},
            {tag: 'tile_stone', count: 2}],
        [{tag: 'tile_dirt'},
            {tag: 'tile_stone'}],
        [{tag: 'tile_stone'},
            {tag: 'tile_dirt'}]
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
                let generate;
                if (item.tag.includes('interact')) { // interactive
                    generate = new Entity(generateInteractive(item.tag, 0, 0), 0);
                }/* else if (item.tag.includes('item')) {
                    generate = new Entity(generateItem(item.tag, 0, 0), 0);
                }*/ else { // tile
                    generate = new Entity(generateBlock(item.tag, 0, 0, 'craftgen'), 0);
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

    createChest() {
        this.cm.createInventory(this.chestCount + 'chest', 1000, 300, 4, 4, 'red');
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

// /**
//  * Blueprint for Crafter entities.
//  *
//  * @author Andrew Nguyen
//  * @version 1/20/23
//  */
// /**
//  * Initializes new Block
//  * @param {Object} props         Position and display properties
//  * @param {string} props.tag     Type tag
//  * @param {Image} props.sprite   Sprite sheet
//  * @param {number} props.x       X position on canvas to draw sprite
//  * @param {number} props.y       Y position on canvas to draw sprite
//  * @param {number} props.sWidth  Width of sprite on sprite sheet
//  * @param {number} props.sHeight Height of sprite on sprite sheet
//  * @param {number} props.scale   Sprite scale factor, 1 by default
//  * @param {number} props.frameX  X position of sprite frame (not pixel position!), 0 by default
//  * @param {number} props.frameY  Y position of sprite frame (not pixel position!), 0 by default
//  * @returns {Object}             This Block's properties.
//  * @constructor
//  */
// const Crafter = function(props) {
//     return {
//         tag: props.tag,
//         components: [
//             new CTransform({
//                 x: props.x,
//                 y: props.y
//             }),
//             new CSprite({
//                 sprite: props.sprite,
//                 sWidth: props.sWidth,
//                 sHeight: props.sHeight,
//                 scale: props.scale,
//                 firstFrameX: props.frameX,
//                 frameY: props.frameY
//             }),
//             new CLifespan(props.lifespan)
//         ]
//     };
// }
// Crafter.prototype.name = 'crafter';