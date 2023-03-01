

class MusicPlayer {
    constructor(player) {
        this.player = player
        this.timer = 0
        this.timesUp = 60
        this.surfacelevel = HEIGHT_PIXELS * .5
        this.caveLevel = HEIGHT_PIXELS * .5 + WIDTH * 2
    }
    update(tick) {
        let yLevel = this.player.components.transform.y
        this.timer += tick
        if(this.timer > this.timesUp) {
            this.timer = 0
            if(yLevel < this.surfacelevel) {
                let index = randomInt(3)
                ASSET_MANAGER.playAsset(SOUND_PATH['THUNDER_' + index])
            } else if(yLevel > this.caveLevel) {
                let index = randomInt(10)
                ASSET_MANAGER.playAsset(SOUND_PATH['CAVE_' + index])
            }
        }
    }

}