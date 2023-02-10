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

const BG_PATH = {
    DIRT	        :	'./assets/backgrounds/background_dirt.png',
    SURFACE_0       :   './assets/backgrounds/surface_background_0.png',
    SURFACE_1       :   './assets/backgrounds/surface_background_1.png',
    UNDERGROUND_0	:	'./assets/backgrounds/underground_0.png',
    UNDERGROUND_1	:	'./assets/backgrounds/underground_1.png',
    UNDERGROUND_2	:	'./assets/backgrounds/underground_2.png',
    UNDERGROUND_3	:	'./assets/backgrounds/underground_3.png',
    UNDERGROUND_4	:	'./assets/backgrounds/underground_4.png',
    UNDERGROUND_5	:	'./assets/backgrounds/underground_5.png',
    UNDERGROUND_6	:	'./assets/backgrounds/underground_6.png'
}

const CHAR_PATH = {
    DIRTCARVER  :	'./assets/sprites/dirtcarver.png',
    ENTITY      :	'./assets/sprites/entity.png',
    GRAPEBOMB   :	'./assets/sprites/grapebomb.png',
    LIGHTBUG    :	'./assets/sprites/lightbug.png',
    LIGHTJELLY  :	'./assets/sprites/lightjelly.png',
    PLAYER      :	'./assets/sprites/player.png',
    SPORE       :	'./assets/sprites/spore.png'
}

const MISC_PATH = {
    GENERICDEATH	:	'./assets/sprites/smoke.png',
    PICK	        :	'./assets/icons/item_3485.png',
    PICK_CURSOR	    :	'./assets/cursors/pickCursor.cur'
}

const OVERLAY_PATH = {
    INVENTORY   :   './assets/overlay/inventory.png',
    VIGNETTE    :   './assets/overlay/vignette.png'
}


const TEST_PATH = {
    // FOR TEST ASSETS
}

const TILE_LIFE = {
    DIRT    :   20,
    RUBY    :   50,
    STONE   :   30
}

const TILE_PATH = {
    BISMUTH	    :	'./assets/tiles/tilesBismuth.png',
    COAL	    :	'./assets/tiles/tilesCoal.png',
    COBALT	    :	'./assets/tiles/tilesCobalt.png',
    COPPER	    :	'./assets/tiles/tilesCopper.png',
    DIRT	    :	'./assets/tiles/tilesDirt.png',
    FERRITE	    :	'./assets/tiles/tilesFerrite.png',
    GOLD	    :	'./assets/tiles/tilesGold.png',
    IRON	    :	'./assets/tiles/tilesIron.png',
    PARAFFIN	:	'./assets/tiles/tilesParaffin.png',
    RUBY	    :	'./assets/tiles/tilesRuby.png',
    SAND	    :	'./assets/tiles/tilesSand.png',
    SILICA	    :	'./assets/tiles/tilesSilica.png',
    STONE	    :	'./assets/tiles/tilesStone.png',
    TIN	        :	'./assets/tiles/tilesTin.png',
    TITANITE	:	'./assets/tiles/tilesTitanite.png',
    TUNGSTEN	:	'./assets/tiles/tilesTungsten.png',
}

const PATHS = {
    BGS         :   BG_PATH,
    CHARS       :   CHAR_PATH,
    MISCS       :   MISC_PATH,
    OVERLAYS    :   OVERLAY_PATH,
    TESTS       :   TEST_PATH,
    TILES       :   TILE_PATH
}
