/**
 *  control spore update
 */
class GraphebombController {
    constructor(monster, player) {
        this.player = player
        this.grapebomb = monster
        // this.Transform = this.grapebomb.components.transform
        //this.Transform = this.spore.transform
        // this.state = this.spore.components.state

        this.grapebomb.components.rigidBody.isGrounded = false
        this.grapebomb.components.transform.velocityY = 0
    }

    /**
     * Updates player state, animation, and position
     * @param input keyboard input
     * @param tick time slice
     */
    update(tick) {
        //despawn after x range from player position

        //default state
        this.grapebomb.components.state.setState('idleR');
        // console.log(this.state)

        let distance = Math.sqrt(Math.pow(this.grapebomb.components.transform.x - this.player.components.transform.x, 2)
            + Math.pow(this.grapebomb.components.transform.y - this.player.components.transform.y, 2));
        if (distance <= 400) {
            this.grapebomb.components.state.setState('death');
        }
        //implement physics if not on the ground, need to check for empty space

        if(!this.grapebomb.components.rigidBody.isGrounded) {
            this.grapebomb.components.transform.velocityY += GRAVITY
        } else if(this.grapebomb.components.rigidBody.isGrounded) {
            this.grapebomb.components.transform.velocityY = 0
        }

        this.grapebomb.components.transform.update(tick);
        // this.pCollider.x = this.pTransform.x
        // this.pCollider.y = this.pTransform.y
    }
}