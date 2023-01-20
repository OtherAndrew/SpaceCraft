
class Player {
    constructor(sprite) {
        const positionX = WIDTH / 2;
        const positionY = HEIGHT / 2;
        const sWidth = 200;
        const sHeight = 250;
        const scale = BLOCKSIZE / sWidth * 1.5;
        const dWidth = sWidth * scale;
        const dHeight = sWidth * scale;

        this.tag = 'player';
        this.components = [
            new CSprite(sprite, sWidth, sHeight, {
                scale: scale,
                fps: 30
            }),
            new CTransform({
                x: positionX,
                y: positionY,
                maxVelocity: 15
            }),
            new CBoxCollider({
                x: positionX,
                y: positionY,
                width: dWidth,
                height: dHeight
            }),
            new CRigidBody(1),
            // new CInput(),
            new CState()
        ];

        return this;
    };
}

