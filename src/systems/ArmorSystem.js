class ArmorSystem {

    constructor(player, containerManager) {
        Object.assign(this, {player, containerManager});
        this.heavyArmor = [0, {item: {tag: 'item_heavyArmor'}, count: 1}];
        this.lightArmor = [0, {item: {tag: 'item_lightArmor'}, count: 1}];
    }

    /**
     * Applies armor value to player if holding armor.
     */
    applyArmor() {
        if (this.containerManager.checkSufficient(this.heavyArmor)) {
            this.player.components['stats'].defenseMod = 0.33;
        } else if (this.containerManager.checkSufficient(this.lightArmor)) {
            this.player.components['stats'].defenseMod = 0.66;
        } else {
            this.player.components['stats'].defenseMod = 1;
        }
    }
}