const Background_0 = function(props) {
    return {
        tag: 'background_layer_0',
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
Background_0.prototype.name = 'background0';
