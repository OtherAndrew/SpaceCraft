class Containermanager {
    constructor() {

    }

    createInventory(count, x, y) {
        let newInven = [];
        for (let i = 0; i <= count; i++) {
            newInven[i] = new Container(i, x, y);
        }
        return newInven;
    }

}