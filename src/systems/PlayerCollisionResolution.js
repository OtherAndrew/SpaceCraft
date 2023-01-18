class PlayerCollisionResolution {
    constructor(player) {
        this.playerComponents = player.components
        this.collisions = this.playerComponents.boxCollider.collisions
    }
    update() {
        for(let e in this.collisions) {
            if(e === 'ground') {
                this.playerComponents.rigidBody.isGrounded = this.collisions[e]
                this.collisions[e] = false
            }
        }
    }
}