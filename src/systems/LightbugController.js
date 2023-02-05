/**
 *  control spore update
 *  @author Jeep Naarkom
 */
class LightbugController {
    constructor(monster, player) {
        this.player = player
        this.lightbug = monster
        // this.lightbug.components.transform
        // this.lightbug.components.state
        //this.acceleration = 1
        this.gravity = 0

        this.lightbug.components.transform.velocityX = 0
        this.lightbug.components.transform.velocityY = 0
        this.velocity = 2.2
        this.offsetX = 0
        this.offsetY = -28

    }

    /**
     * Updates player state, animation, and position
     * @param input keyboard input
     * @param tick time slice
     */
    update(tick) {   //update the state of anim
        //despawn after x range from player position


        //default state
        this.lightbug.components.state.setState('idleR');
        let distance = Math.sqrt(Math.pow(this.lightbug.components.transform.x - this.player.components.transform.x, 2)
            + Math.pow(this.lightbug.components.transform.y - this.player.components.transform.y, 2));
        if (distance <= 400) {
            if (this.player.components.transform.y + this.offsetY <= this.lightbug.components.transform.y
                && this.player.components.transform.x + this.offsetX <= this.lightbug.components.transform.x) {
                this.lightbug.components.transform.y -= this.velocity
                this.lightbug.components.transform.x -= this.velocity

            } else if (this.player.components.transform.y + this.offsetY >= this.lightbug.components.transform.y
                && this.player.components.transform.x + this.offsetX <= this.lightbug.components.transform.x) {
                this.lightbug.components.transform.y += this.velocity
                this.lightbug.components.transform.x -= this.velocity

            } else if (this.player.components.transform.y + this.offsetY <= this.lightbug.components.transform.y
                && this.player.components.transform.x + this.offsetX >= this.lightbug.components.transform.x) {
                this.lightbug.components.transform.y -= this.velocity
                this.lightbug.components.transform.x += this.velocity

            } else if (this.player.components.transform.y + this.offsetY >= this.lightbug.components.transform.y
                && this.player.components.transform.x + this.offsetX >= this.lightbug.components.transform.x) {
            this.lightbug.components.transform.y += this.velocity
            this.lightbug.components.transform.x += this.velocity
            }
        }
        //adding tint


        // Calculate the angle between the monster and player

        this.lightbug.components.transform.update(tick);



    }


}
