 
 /*
The idea of blueprints is to have 'blueprints' of different entities that we can just call when we need a certain
entity.
 */


// simple rectangle box with collider

const borderBlueprint = (props, entityManager) => {
    let e = entityManager.addEntity({
        tag: 'ground',
        components: [
            new CTransform({
                x: props.x,
                y: props.y,
                velocityX: 0,
                velocityY: 0,
                rotation: 0,
            }),
            new CBoxCollider({
                x: props.x,
                y: props.y,
                width: props.width,
                height: props.height
            })
        ]
    })
}


// This box is meant to be controlled by the player.
const simpleDynamicBox = (props, entityManager) => {
    let e = entityManager.addEntity({
        tag: 'player',
        components: [
            new CTransform({
                x: props.x,
                y: props.y,
                velocityX: 0,
                velocityY: 0,
                maxVelocity: 10,
                rotation: 0,
            }),
            new CBoxCollider({
                x: props.x,
                y: props.y,
                width: props.width,
                height: props.height
            }),
            new CRigidBody(),
            new CInput()
        ]
    })
    return e
}