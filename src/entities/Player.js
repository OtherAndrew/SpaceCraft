
class Player {
    constructor(sprite, scale) {
        const positionX = WIDTH / 2;
        const positionY = HEIGHT / 2;
        const sWidth = 200;
        const sHeight = 250;

        this.tag = "player";
        this.scale = scale;
        this.components = [
            new CSprite(sprite, sWidth, sHeight, {
                scale: scale,
                frameY: 1,
                fps: 30
            }),
            new CTransform({
                x: positionX,
                y: positionY,
                maxVelocity: 25
            }),
            new CBoxCollider({
                x: positionX,
                y: positionY,
                width: BLOCKSIZE,
                height: BLOCKSIZE
            }),
            new CRigidBody(1),
            new CInput()
        ];

        return this;
    };
}

