class CraftMenu {
    table_recipes = [
        [{tag : 'tile_ruby'},
            {tag : 'tile_dirt'},
            {tag : 'tile_stone', count : 2}],
        [{tag : 'tile_dirt'},
            {tag : 'tile_stone'}],
        [{tag : 'tile_stone'},
            {tag : 'tile_dirt'}]
    ];
    
    
    constructor(containManager) {
        this.cm = containManager;
        this.recipes = [];

        // TESTING
        this.x = 30;
        this.y = 30;
        this.spacer = 54;
        
        this.buildRecipe('table', this.table_recipes);

        // this.cm.createInventory('table1', this.x, this.y + this.spacer * this.recipes.length, 1, 3, 'pink', 'recipe');
        // this.cm.addToInventory('table1', new Entity(generateBlock('tile_ruby', 0, 0, 'craftgen'), 0));
        // this.cm.addToInventory('table1', new Entity(generateBlock('tile_dirt', 0, 0, 'craftgen'), 0));
        // this.cm.addToInventory('table1', new Entity(generateBlock('tile_stone', 0, 0, 'craftgen'), 0), 2);
        // this.recipes.push('table1');
        //
        // this.cm.createInventory('table2', this.x, this.y + this.spacer * this.recipes.length, 1, 2, 'pink', 'recipe');
        // this.cm.addToInventory('table2', new Entity(generateBlock('tile_dirt', 0, 0, 'craftgen'), 0));
        // this.cm.addToInventory('table2', new Entity(generateBlock('tile_stone', 0, 0, 'craftgen'), 0));
        // this.recipes.push('table2');
        //
        // this.cm.createInventory('table3', this.x, this.y + this.spacer * this.recipes.length, 1, 2, 'pink', 'recipe');
        // this.cm.addToInventory('table3', new Entity(generateBlock('tile_stone', 0, 0, 'craftgen'), 0));
        // this.cm.addToInventory('table3', new Entity(generateBlock('tile_dirt', 0, 0, 'craftgen'), 0));
        // this.recipes.push('table3');

        for (const entry in this.recipes) {
            let recipe = this.recipes[entry];
            if (recipe.includes('table')) {
                this.denoteRecipe(recipe, 'green');
            } else if (recipe.includes('furnace')) {
                this.denoteRecipe(recipe, 'grey');
            }
        }
    }

    buildRecipe(owner, recipes) {
        for (let i = 0; i < recipes.length; i++) {
            this.cm.createInventory(
                owner + i,
                this.x,
                this.y + this.spacer * i,
                1,
                recipes[i].length, 
                CRAFT_COLOR[owner],
                'recipe'
            );
            for (let j = 0; j < recipes[i].length; j++) {
                this.cm.addToInventory(
                    owner + i,
                    new Entity(generateBlock(recipes[i][j].tag, 0, 0, 'craftgen'), 0),
                    recipes[i][j].count/* || 1*/
                );
            }
            this.recipes.push(owner + i);
        }
    }

    denoteRecipe(owner, color) {
        let recipe = this.cm.getInventory(owner)
        let product = recipe[0];
        product.keyword = owner;
        product.font = 'bold 20';
        product.fillColor = color;
        product.x -= 7;
        product.y -= 4;
        product.width += 7;
        product.calculateMiddle();

        for (let i = 1; i < recipe.length; i++) {
            console.log(this.cm.playerCounts)
            recipe[i].playerCount = this.cm.playerCounts.get(recipe[i].item.tag);
            console.log(recipe[i].item.tag + ' : ' + recipe[i].playerCount)
            recipe[i].update = function() {
                this.displayText = recipe[i].playerCount + '/' + this.count;
            }
        }
    }

    update(uiActive) {
        if (uiActive) {
            let actives = this.cm.activeInventory;
            for (let i = 2; i < actives.length; i++) {
                if (this.recipes.includes(actives[i][0].owner)) {
                    actives[i][0].uncraftable = !this.cm.checkSufficient(actives[i]);
                }
                for (let j = 1; j < actives[i].length; j++) {
                    let playerCount = this.cm.playerCounts.get(actives[i][j].item.tag);
                    if (playerCount) {
                        actives[i][j].playerCount = playerCount;
                        actives[i][j].insufficient = playerCount < actives[i][j].count;
                    } else {
                        actives[i][j].playerCount = 0;
                        actives[i][j].insufficient = true;
                    }
                }
            }
        }
    }
}

/**
 * Blueprint for Crafter entities.
 *
 * @author Andrew Nguyen
 * @version 1/20/23
 */

/**
 * Initializes new Block
 * @param {Object} props         Position and display properties
 * @param {string} props.tag     Type tag
 * @param {Image} props.sprite   Sprite sheet
 * @param {number} props.x       X position on canvas to draw sprite
 * @param {number} props.y       Y position on canvas to draw sprite
 * @param {number} props.sWidth  Width of sprite on sprite sheet
 * @param {number} props.sHeight Height of sprite on sprite sheet
 * @param {number} props.scale   Sprite scale factor, 1 by default
 * @param {number} props.frameX  X position of sprite frame (not pixel position!), 0 by default
 * @param {number} props.frameY  Y position of sprite frame (not pixel position!), 0 by default
 * @returns {Object}             This Block's properties.
 * @constructor
 */
const Crafter = function(props) {
    return {
        tag: props.tag,
        components: [
            new CTransform({
                x: props.x,
                y: props.y
            }),
            new CSprite({
                sprite: props.sprite,
                sWidth: props.sWidth,
                sHeight: props.sHeight,
                scale: props.scale,
                firstFrameX: props.frameX,
                frameY: props.frameY
            }),
            new CLifespan(props.lifespan)
        ]
    };
}
Crafter.prototype.name = 'crafter';

const generateCrafter = (tag, x, y) => {
    let id = cleanTag(tag).toUpperCase();
    let image = ASSET_MANAGER.cache[CRAFT_PATH[id]];
    let tempX = x * BLOCKSIZE, tempY = y * BLOCKSIZE;
    return new Crafter({
        tag: tag,
        sprite: image,
        lifespan: 20,
        x: tempX,
        y: tempY,
        sWidth: image.width,
        sHeight: image.height,
    });
}