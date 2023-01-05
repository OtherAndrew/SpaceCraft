

// check if a point lies within a rectangle

/*
    Params example
    point = {x: 0, y: 0}
    rect = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }
*/
const pointInRect = (point, rect) => {
    return (point.x >= rect.x && point.y >= rect.y && point.x < rect.x + rect.width && point.y < rect.y + rect.height)
}

// check if rectangle collides with another rectangle
function checkCollision(entityA, entityB) {
    if(entityA.components.boxCollider && entityB.components.boxCollider) {
        let a = entityA.components.boxCollider
        let b = entityB.components.boxCollider
        if(a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y) {
                return true
            }
    }
}