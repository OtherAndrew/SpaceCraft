
class Player {
    constructor(sprite, scale) {
        const positionX = WIDTH / 2;
        const positionY = HEIGHT / 2;
        const sWidth = 200;
        const sHeight = 250;

        this.tag = "player";
        this.scale = scale;
        this.states = [];
        this.components = [
            new CSprite(sprite, sWidth, sHeight, {
                scale: scale,
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
                width: sWidth * scale,
                height: sHeight * scale
            }),
            new CRigidBody(1),
            new CInput(),
            new CState(0, 0, 1, "idleR")
        ];

        return this;
    };
}

