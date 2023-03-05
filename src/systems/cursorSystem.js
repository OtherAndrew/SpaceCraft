

class CursorSystem {
    constructor(canvas, terrainMap, hud, player) {
        this.cursor = canvas.style
        this.terrainMap = terrainMap
        this.cursorList = []
        this.playerHud = hud
        this.player = player
    }

    init() {
        this.cursorList[MISC_PATH.CURSOR_PICK] = `url(${MISC_PATH.CURSOR_PICK}), none`
        this.cursorList[MISC_PATH.CURSOR_CROSSHAIR] = `url(${MISC_PATH.CURSOR_CROSSHAIR}), none`
        this.cursorList[MISC_PATH.CURSOR_HAND] = `url(${MISC_PATH.CURSOR_HAND}), none`
        this.cursorList[MISC_PATH.BLOCK_PLACEMENT_GREEN] = `url(${MISC_PATH.BLOCK_PLACEMENT_GREEN}), none`
        this.cursorList[MISC_PATH.BLOCK_PLACEMENT_RED] = `url(${MISC_PATH.BLOCK_PLACEMENT_RED}), none`
    }
    update(menuActive, pos) {
        if(pos) {
            this.cursor.cursor = this.cursorList[MISC_PATH.CURSOR_HAND]
            let selected = this.playerHud.activeContainer.item
            if(!menuActive && selected) {
                let tag = this.terrainMap[pos.y][pos.x].tag
                if(/tile|interact/.test(tag) && selected.tag.includes('Pickaxe') && checkPlayerDistance(pos, this.player) < BLOCK_PLACEMENT_DISTANCE) {
                    this.cursor.cursor = this.cursorList[MISC_PATH.CURSOR_PICK]
                } else if (selected.name === "weapon") {
                    this.cursor.cursor = this.cursorList[MISC_PATH.CURSOR_CROSSHAIR]
                } else if(/tile|interact/.test(selected.tag)) {
                    this.cursor.cursor = isPlaceable(this.player, pos, this.terrainMap) && /air/.test(tag) ? 
                                        this.cursorList[MISC_PATH.BLOCK_PLACEMENT_GREEN] :
                                        this.cursorList[MISC_PATH.BLOCK_PLACEMENT_RED]
                }
            }
        }
        
    }
}