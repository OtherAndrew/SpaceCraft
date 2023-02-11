class DurationSystem {
    constructor(entites) {
        this.entites = entites;
    }

    update(tick) {
        const checkList = this.entites.filter(e => e.components["duration"]);
        checkList.forEach(e => {
            e.components["duration"].time -= tick;
            if (e.components["duration"].time < 0) {
                e.destroy();
            }
        })
    }
}