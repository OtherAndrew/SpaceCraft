const Background_1 = function(props) {
    return {
        tag: 'background_layer_1',
        components: [
            new CTransform({
                x: props.x,
                y: props.y,
                maxVelocity: props.maxVelocity
            }),
            new CSprite({
                sprite: props.sprite,
                sWidth: props.sWidth,
                sHeight: props.sHeight,
                scale: props.scale,
            })
        ]
    };
}
Background_1.prototype.name = 'background1';
