

/**
 * Constants that are used across the game.
 */

//Game Values
const WIDTH = 1024
const HEIGHT = 768
const GRIDSIZE = 15
const BLOCKSIZE = 32
const WIDTH_PIXELS = GRIDSIZE * GRIDSIZE * BLOCKSIZE
const HEIGHT_PIXELS = WIDTH_PIXELS * 2
const GRAVITY = 1
const BACKGROUND_SCROLLING_SPEED_0 = .03
const BACKGROUND_SCROLLING_SPEED_1 = .05
const BACKGROUND_SCROLLING_SPEED_2 = .06
const BACKGROUND_SCROLLING_SPEED_3 = .07
const BACKGROUND_SCROLLING_SPEED_4 = .08
const BACKGROUND_SCROLLING_SPEED_5 = .09

//Misc
const FOV_SPRITE = './assets/overlay/fov.png'


// NPC Sprite Sheets
const PLAYER_PATH = "./assets/sprites/player.png";
const ENTITY_PATH = "./assets/sprites/entity.png";
const SPORE_PATH = "./assets/sprites/spore.png";
const DIRTCARVER_PATH = "./assets/sprites/dirtcarver.png";
const LIGHTJELLY_PATH = "./assets/sprites/lightjelly.png";
const LIGHTBUG_PATH = "./assets/sprites/lightbug.png";
const GRAPEBOMB_PATH = "./assets/sprites/grapebomb.png";
const GENERICDEATH_PATH = "./assets/sprites/smoke.png";

//Tiles
const TILES_BISMUTH_PATH = './assets/tiles/tilesBismuth.png'
const TILES_COAL_PATH = './assets/tiles/tilesCoal.png'
const TILES_COBALT_PATH = './assets/tiles/tilesCobalt.png'
const TILES_COPPER_PATH = './assets/tiles/tilesCopper.png'
const TILES_FERRITE_PATH = './assets/tiles/tilesFerrite.png'
const TILES_GOLD_PATH = './assets/tiles/tilesGold.png'
const TILES_IRON_PATH = './assets/tiles/tilesIron.png'
const TILES_PARAFFIN_PATH = './assets/tiles/tilesParaffin.png'
const TILES_SAND_PATH = './assets/tiles/tilesSand.png'
const TILES_SILICA_PATH = './assets/tiles/tilesSilica.png'
const TILES_TIN_PATH = './assets/tiles/tilesTin.png'
const TILES_TITANITE_PATH = './assets/tiles/tilesTitanite.png'
const TILES_TUNGSTEN_PATH = './assets/tiles/tilesTungsten.png'
const TILES_DIRT_PATH = './assets/tiles/tilesDirt.png'
const TILES_STONE_PATH = './assets/tiles/tilesStone.png'
const TILES_RUBY_PATH = './assets/tiles/tilesRuby.png'

const BISMUTH_GEN_STATS = {
    yMin: 0,
    yMax: 0,
    rate: 3.0
}
const COAL_GEN_STATS = {
    yMin: 0,
    yMax: 0,
    rate: 7.0
}
const COBALT_GEN_STATS = {
    yMin: 0,
    yMax: 0,
    rate: 3.0
}
const COPPER_GEN_STATS = {
    yMin: 0,
    yMax: 0,
    rate: 7.0
}
const FERRITE_GEN_STATS = {
    yMin: 0,
    yMax: 0,
    rate: 3.0
}
const GOLD_GEN_STATS = {
    yMin: 0,
    yMax: 0,
    rate: 6.0
}
const IRON_GEN_STATS = {
    yMin: 0,
    yMax: 0,
    rate: 7.0
}
const PARAFFIN_GEN_STATS = {
    yMin: 0,
    yMax: 0,
    rate: 3.0
}
const SAND_GEN_STATS = {
    yMin: 0,
    yMax: 0,
    rate: 15.0
}
const SILICA_GEN_STATS = {
    yMin: 0,
    yMax: 0,
    rate: 5.0
}
const TIN_GEN_STATS = {
    yMin: 0,
    yMax: 0,
    rate: 2.5
}
const TITANITE_GEN_STATS = {
    yMin: 0,
    yMax: 0,
    rate: 1.5
}
const TUNGSTEN_GEN_STATS = {
    yMin: 0,
    yMax: 0,
    rate: 3.0
}
const RUBY_GEN_STATS = {
    yMin: 0,
    yMax: 0,
    rate: 0.0
}


//Tiles Lifespan numbers
const TILE_DIRT_LIFESPAN = 20
const TILE_STONE_LIFESPAN = 30
const TILE_RUBY_LIFESPAN = 50


//Backgrounds
const BACKGROUND_SURFACE_0 ='./assets/backgrounds/surface_background_0.png'
const BACKGROUND_SURFACE_1 ='./assets/backgrounds/surface_background_1.png'
const BACKGROUND_DIRT = './assets/backgrounds/background_dirt.png'
const UNDERGROUND_BACKGROUND_0 = './assets/backgrounds/underground_0.png'
const UNDERGROUND_BACKGROUND_1 = './assets/backgrounds/underground_1.png'
const UNDERGROUND_BACKGROUND_2 = './assets/backgrounds/underground_2.png'
const UNDERGROUND_BACKGROUND_3 = './assets/backgrounds/underground_3.png'
const UNDERGROUND_BACKGROUND_4 = './assets/backgrounds/underground_4.png'
const UNDERGROUND_BACKGROUND_5 = './assets/backgrounds/underground_5.png'
const UNDERGROUND_BACKGROUND_6 = './assets/backgrounds/underground_6.png'

//Cursors
const PICK_CURSOR = './assets/cursors/pickCursor.cur'

// TESTING
const BG = './assets/backgrounds/bg.png'
const B1 = './assets/sprites/b1.png'
const B2 = './assets/sprites/b2.png'
const B3 = './assets/sprites/b3.png'
const O1 = './assets/overlay/overlaymockup.png'
const PICK = './assets/icons/item_3485.png'

// arrays to queue using a loop
const TERRAIN_ASSETS_ARRAY = [
    TILES_BISMUTH_PATH,
    TILES_COAL_PATH,
    TILES_COBALT_PATH,
    TILES_COPPER_PATH,
    TILES_DIRT_PATH,
    TILES_FERRITE_PATH,
    TILES_GOLD_PATH,
    TILES_IRON_PATH,
    TILES_PARAFFIN_PATH,
    TILES_RUBY_PATH,
    TILES_SAND_PATH,
    TILES_SILICA_PATH,
    TILES_STONE_PATH,
    TILES_TIN_PATH,
    TILES_TITANITE_PATH,
    TILES_TUNGSTEN_PATH,
    BACKGROUND_SURFACE_0,
    BACKGROUND_SURFACE_1,
    BG,
    B1,
    B2,
    B3,
    O1,
    PICK,
    SPORE_PATH,
    DIRTCARVER_PATH,
    LIGHTJELLY_PATH,
    LIGHTBUG_PATH,
    GRAPEBOMB_PATH,
    GENERICDEATH_PATH,
    UNDERGROUND_BACKGROUND_0,
    UNDERGROUND_BACKGROUND_1,
    UNDERGROUND_BACKGROUND_2,
    UNDERGROUND_BACKGROUND_3,
    UNDERGROUND_BACKGROUND_4,
    UNDERGROUND_BACKGROUND_5,
    UNDERGROUND_BACKGROUND_6,
    BACKGROUND_DIRT,
    PICK_CURSOR,
    FOV_SPRITE
]

