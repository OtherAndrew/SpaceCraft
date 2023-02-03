/**
 * Component to store state and animation.
 *
 * @author Andrew Nguyen
 * @version 1/19/23
 */

class CState {

    /**
     * Initializes CState component.
     * @returns {CState} The CState component.
     * @constructor
     */
    constructor() {
        this.name = "state";
        this.currentState = 'idleR';
        // this.input = '';
        // this.direction = 'right';
        this.grounded = false;
        this.sprite = null;
        this.transform = null;
        return this;
    }

    setState(state) {
        if (state !== this.currentState) {
            this.currentState = state;
            if (this.sprite) this.sprite.setAnimation(this.currentState);
            if (this.transform) this.transform.setBehavior(this.currentState);
        }
    }


    // update() {
    //     switch (this.input) {
    //         case 'a':
    //             if (this.direction === "left") {
    //                 if (this.grounded) {
    //                     this.sprite.setAnimation("walkL");
    //                 } else {
    //                     this.sprite.setAnimation("jumpL");
    //                 }
    //             } else if (this.direction === "right") {
    //                 console.log("Something went wrong (input a)");
    //             }
    //             break;
    //         case 'd':
    //             if (this.direction === "left") {
    //                 console.log("Something went wrong (input d)")
    //             } else if (this.direction === "right") {
    //                 if (this.grounded) {
    //                     this.sprite.setAnimation("walkR");
    //                 } else {
    //                     this.sprite.setAnimation("jumpR");
    //                 }
    //             }
    //             break;
    //         case '':
    //             if (this.direction === "left") {
    //                 if (this.grounded) {
    //                     this.sprite.setAnimation("idleL");
    //                 } else {
    //                     this.sprite.setAnimation("jumpL");
    //                 }
    //             } else if (this.direction === "right") {
    //                 if (this.grounded) {
    //                     this.sprite.setAnimation("idleR");
    //                 } else {
    //                     this.sprite.setAnimation("jumpR");
    //                 }
    //             }
    //             break;
    //         default:
    //             console.log("Invalid input");
    //     }
    //
    // }
}