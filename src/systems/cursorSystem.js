

class CursorSystem {
    constructor(canvas, terrainMap, hud) {
        this.cursor = canvas.style
        this.terrainMap = terrainMap
        this.cursorList = []
        this.playerHud = hud
    }

    init() {
        this.cursorList[MISC_PATH.CURSOR_PICK] = `url(${MISC_PATH.CURSOR_PICK}), none`
        this.cursorList[MISC_PATH.CURSOR_CROSSHAIR] = `url(${MISC_PATH.CURSOR_CROSSHAIR}), none`
        this.cursorList[MISC_PATH.CURSOR_HAND] = `url(${MISC_PATH.CURSOR_HAND}), none`
    }
    update(menuActive, pos) {
        if(pos) {
            this.cursor.cursor = this.cursorList[MISC_PATH.CURSOR_HAND]
            let selected = this.playerHud.activeContainer.item
            if(!menuActive && selected) {
                // let tag = this.terrainMap[pos.y][pos.x].tag
                if(/*/tile|craft/.test(tag) &&*/ selected.tag === 'pickaxe') {
                    this.cursor.cursor = this.cursorList[MISC_PATH.CURSOR_PICK]
                } else if (selected.tag === 'gun' || selected.tag === 'flamethrower' || selected.tag === 'grenadeLauncher') {
                    this.cursor.cursor = this.cursorList[MISC_PATH.CURSOR_CROSSHAIR]
                }
            }
        }
        
    }
}