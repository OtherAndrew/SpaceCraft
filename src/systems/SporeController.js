/**
 *  control spore update
 */
class SporeController {
    constructor(monster) {

        this.spore = monster
        this.Transform = this.spore.components.transform
        //this.Transform = this.spore.transform
        this.state = this.spore.components.state
        //this.acceleration = 1
        this.gravity = 1.5
        //this.direction = 'right';
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
        this.state.setState('idleR');
        // console.log(this.state)

        //implement physics if not on the ground, need to check for empty space

        // if(!this.spore.components.rigidBody.isGrounded) {
        //     this.Transform.velocityY += this.gravity
        // } else if(this.spore.components.rigidBody.isGrounded) {
        //     this.Transform.velocityY = 0
        // }

        this.Transform.update(tick);
        // this.pCollider.x = this.pTransform.x
        // this.pCollider.y = this.pTransform.y
    }
}