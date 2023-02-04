/**
 *  control dirtCarver update
 *  @author Jeep Naarkom
 */
class DirtcarverController {
    constructor(monster, player) {
        this.player = player
        this.dc = monster
        // this.dc.components.transform
        //this.Transform = this.spore.transform
        // this.dc.components.state
        //this.acceleration = 1
        //this.gravity = .98
        //this.direction = 'right';
        // this.dc.components.rigidBody.isGrounded = false
        this.dc.components.transform.velocityY = .4
        this.velocity = .8
    }

    /**
     * Updates player state, animation, and position
     * @param input keyboard input
     * @param tick time slice
     */
    update(tick) {
        //despawn after x range from player position
        // this.updateBB()
        //if stuck  * -1 to velocity and change sprite direction
        //default state


        // this.dc.components.state.setState('walkR');
        // console.log(this.state)

        if (this.player.components.transform.x < this.dc.components.transform.x) {
            this.dc.components.state.setState('walkL');
            this.dc.components.transform.x -= this.velocity
        } else if (this.player.components.transform.x > this.dc.components.transform.x) {
            this.dc.components.transform.x += this.velocity
            this.dc.components.state.setState('walkR');
        }
        //console.log(this.player.components)
            //implement physics if not on the ground, need to check for empty space

        // if(!this.dc.components.state.grounded) {
        //     this.dc.components.transform.velocityY += GRAVITY
        // } else if(this.dc.components.state.grounded) {
        //     this.dc.components.transform.velocityY = 0
        // }

        this.dc.components.transform.update(tick);
        // this.pCollider.x = this.pTransform.x
        // this.pCollider.y = this.pTransform.y
    }

}