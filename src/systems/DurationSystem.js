class DurationSystem {
    constructor(entities) {
        this.entities = entities;
    }

    update(tick) {
        for (let i = 0; i < this.entities.length; i++) {
            const e = this.entities[i];
            if (e.components["duration"]) {
                e.components["duration"].time -= tick;
                if (e.components["duration"].time < 0) {
                    e.destroy();
                }
            }
        }
    }
}