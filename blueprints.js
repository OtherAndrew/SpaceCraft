 
 /*
The idea of blueprints is to have 'blueprints' of different entities that we can just call when we need a certain
entity.
 */


// simple rectangle box with collider

const borderBlueprint = (props, entityManager) => {
    let e = entityManager.addEntity({
        id: entityManager.entities.length,
        tag: 'border',
        components: [
            new CTransform({
                x: props.x,
                y: props.y,
                velocityX: 0,
                velocityY: 0,
                angle: 0,
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
        id: entityManager.entities.length,
        tag: 'player',
        components: [
            new CTransform({
                x: props.x,
                y: props.y,
                velocityX: 0,
                velocityY: 6,
                angle: 0,
            }),
            new CBoxCollider({
                x: props.x,
                y: props.y,
                width: props.width,
                height: props.height
            }),
            new CRigidBody({
                mass: 1
            })
        ]
    })
    return e
}