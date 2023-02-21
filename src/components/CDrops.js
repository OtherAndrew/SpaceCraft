/**
 * Holds drop list for given entity.
 */

class CDrops {

    /**
     * Initializes CDrops component.
     * @param dropList List of drops, default empty.
     * @return {CDrops}
     */
    constructor(dropList = []) {
        Object.assign(this, { dropList });
        this.name = "drops";
        return this;
    }

}