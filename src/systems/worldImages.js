

class WorldImages {
    constructor(player) {
        this.player = player
        this.darkLevel = HEIGHT_PIXELS * .5 + HEIGHT * .5
    }

    init(entityManager) {
        this.fov = entityManager.addEntity({
            tag: 'fov',
            components: [
                new CTransform({
                    x: this.player.components.transform.x,
                    y: this.player.components.transform.y
                }),
                new CSprite({
                    sprite: ASSET_MANAGER.cache[FOV_SPRITE],
                    sWidth: WIDTH,
                    sHeight: HEIGHT,
                    scale: 1,
                    firstFrameX: 0,
                    frameY: 0,
                    lastFrameX: 2,
                    fps: 6,
                })
            ]
        })
        let spriteMap = this.fov.components.sprite.animationMap
        spriteMap.set('zoomIn', new AnimationProps(0,0,2))
        spriteMap.set('zoomOut', new AnimationProps(2,0,0))

    }
    update() {
        let playerPos = this.player.components.transform
        if(playerPos.y >= this.darkLevel) {
            this.fov.isDrawable = true
            this.fov.components.transform.x = this.player.components.transform.x
            this.fov.components.transform.y = this.player.components.transform.y
            this.fov.components.sprite.setAnimation('zoomIn')
        } else {
            this.fov.isDrawable = false
        }
        console.log(this.darkLevel, this.fov.components.transform.x, this.fov.components.transform.y)   
        console.log(this.fov)
    }
}