

class CursorSystem {
    constructor(canvas, terrainMap, hud) {
        this.cursor = canvas.style
        this.terrainMap = terrainMap
        this.cursorList = []
        this.playerHud = hud
    }

    init() {
        this.cursorList[MISC_PATH.PICK_CURSOR] = `url(${MISC_PATH.PICK_CURSOR}), none`
    }
    update(pos) {
        if(pos) {
            let selected = this.playerHud.activeContainer.item
            if(selected) {
                // let tag = this.terrainMap[pos.y][pos.x].tag
                if(/*tag.includes('tile') &&*/ selected.tag === 'pickaxe') {
                    this.cursor.cursor = this.cursorList[MISC_PATH.PICK_CURSOR]
                } else {
                    this.cursor.cursor = "pointer"
                }
            } else {
                this.cursor.cursor = "pointer"
            }
        }
        
    }
}