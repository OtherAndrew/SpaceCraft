const CSprite = function CSprite(sprite, width, height, sizeMod, fps, frameX, frameY) {
    this.sprite = sprite
    this.spriteWidth = width
    this.spriteHeight = height
    this.resizeWidth = this.spriteWidth * sizeMod
    this.resizeHeight = this.spriteHeight * sizeMod
    this.frameX = frameX || 0
    this.frameY = frameY || 0
    this.maxFrames = 0
    this.frameInterval = fps
    this.frameTimer = 0
    return this
}
CSprite.prototype.name = 'sprite'