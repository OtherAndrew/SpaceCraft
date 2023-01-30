/**
 *  control spore update
 */
class LightjellyController {
    constructor(monster, player) {
        this.player = player
        this.lightjelly = monster
        this.Transform = this.lightjelly.components.transform
        //this.Transform = this.spore.transform
        this.state = this.lightjelly.components.state
        //this.acceleration = 1
        this.gravity = 0
        //this.direction = 'right';
        // this.lightjelly.components.rigidBody.isGrounded = false
        this.Transform.velocityX = 0
        this.Transform.velocityY = 0
        this.velocity = 1
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


        if (this.player.components.transform.y < this.lightjelly.components.transform.y
            && this.player.components.transform.x < this.lightjelly.components.transform.x) {
            this.lightjelly.components.transform.y -= this.velocity
            this.lightjelly.components.transform.x -= this.velocity

        } else if (this.player.components.transform.y > this.lightjelly.components.transform.y
            && this.player.components.transform.x < this.lightjelly.components.transform.x) {
            this.lightjelly.components.transform.y += this.velocity
            this.lightjelly.components.transform.x -= this.velocity

        } else if (this.player.components.transform.y < this.lightjelly.components.transform.y
            && this.player.components.transform.x > this.lightjelly.components.transform.x) {
            this.lightjelly.components.transform.y -= this.velocity
            this.lightjelly.components.transform.x += this.velocity

        } else if (this.player.components.transform.y > this.lightjelly.components.transform.y
            && this.player.components.transform.x > this.lightjelly.components.transform.x) {
            this.lightjelly.components.transform.y += this.velocity
            this.lightjelly.components.transform.x += this.velocity
        }
        // Calculate the angle between the monster and player


        this.Transform.update(tick);

    }
}


// let distance = Math.sqrt(Math.pow(this.lightjelly.components.transform.x - this.player.components.transform.x, 2)
//     + Math.pow(this.lightjelly.components.transform.y - this.player.components.transform.y, 2));
// if (distance >= 0) {
//     let xdist = this.player.components.transform.x - this.lightjelly.components.transform.x
//     let ydist = this.player.components.transform.y - this.lightjelly.components.transform.y
//     this.lightjelly.components.transform.x += xdist > 0 ? 1 : -1;
//     this.lightjelly.components.transform.y += ydist > 0 ? 1 : -1;
//     this.lightjelly.components.transform.x += xdist < 0 ? -1 : 1;
//     this.lightjelly.components.transform.y += ydist < 0 ? -1 : 1;



// let angle = Math.atan2(this.player.components.transform.y - this.lightjelly.components.transform.y,
//     this.player.components.transform.x - this.lightjelly.components.transform.x);

// if (this.player.components.transform.y < this.lightjelly.components.transform.y
//     && this.player.components.transform.x < this.lightjelly.components.transform.x) {
//     this.lightjelly.components.transform.y -= 1
//     this.lightjelly.components.transform.x -= 1
//
// } else if (this.player.components.transform.y > this.lightjelly.components.transform.y
//     && this.player.components.transform.x < this.lightjelly.components.transform.x) {
//     this.lightjelly.components.transform.y += 1
//     this.lightjelly.components.transform.x -= 1
//
// } else if (this.player.components.transform.y < this.lightjelly.components.transform.y
//     && this.player.components.transform.x > this.lightjelly.components.transform.x) {
//     this.lightjelly.components.transform.y -= 1
//     this.lightjelly.components.transform.x += 1
//
// } else if (this.player.components.transform.y > this.lightjelly.components.transform.y
//     && this.player.components.transform.x > this.lightjelly.components.transform.x) {
//     this.lightjelly.components.transform.y += 1
//     this.lightjelly.components.transform.x += 1

// }
// this.lightjelly.components.transform.x += Math.cos(angle) * this.Transform.velocityX;
// this.lightjelly.components.transform.y += Math.sin(angle) * this.Transform.velocityX;
