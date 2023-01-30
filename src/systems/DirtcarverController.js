/**
 *  control dirtCarver update
 *  @author Jeep Naarkom
 */
class DirtcarverController {
    constructor(monster) {

        this.dc = monster
        this.Transform = this.dc.components.transform
        //this.Transform = this.spore.transform
        this.state = this.dc.components.state
        //this.acceleration = 1
        this.gravity = 1.5
        //this.direction = 'right';
        this.dc.components.rigidBody.isGrounded = false
        this.Transform.velocityY = 0
    }

    /**
     * Updates player state, animation, and position
     * @param input keyboard input
     * @param tick time slice
     */
    update(tick) {
        //despawn after x range from player position

        //default state
        this.state.setState('walkR');
        // console.log(this.state)

        //implement physics if not on the ground, need to check for empty space

        // if(!this.dc.components.rigidBody.isGrounded) {
        //     this.Transform.velocityY += GRAVITY
        // } else if(this.dc.components.rigidBody.isGrounded) {
        //     this.Transform.velocityY = 0
        // }

        this.Transform.update(tick);
        // this.pCollider.x = this.pTransform.x
        // this.pCollider.y = this.pTransform.y
    }
}