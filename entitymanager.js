/*
Manages and creates Entities.
A Entity Factory. Nothing else should be able to create entities without going through a manager.

Entity - any object within the game. Components are attached to the entities to give them functionality.



*/

class EntityManager {

    constructor(){
        this.entities = []
        this.entitiyMap = new Map()
        this.totalEntities = 0
        this.toAddEntities = []
    }

    

    addEntity(props) {
        let e = new Entity(props)
        this.toAddEntities.push(e)
        return e
    }

    get getEntities() {
        return this.entities
    }

    getEntity(tag) {
        return this.entitiyMap.get(tag)
    }

    update() {
        this.toAddEntities.forEach(e => {
            this.entities.push(e)
            this.entitiyMap.set(e.tag, this.totalEntities++)
        })
        let removed = this.#removeDeadEntities()
        this.toAddEntities.length = 0
        for(let tag in removed) {
            this.entitiyMap.delete(tag)
        }
    }
    #removeDeadEntities() {
        if(this.entities.length) {
            let removed = []
            for(let i = this.entities.length - 1; i >= 0; i--) {
                let e = this.entities[i]
                if(!e.isAlive) {
                    removed.push(e.tag)
                    this.entities.splice(i, 1)
                }
            }
            return removed
        }
    }
}

class Entity  {

    constructor(props) {
        this.id = props.id
        this.tag = props.tag
        this.isAlive = true
        this.components = {}
        if(props.components) {
            this.addComponent(props.components)
        }
    }

    destroy() {
        this.isAlive = false
    }
    update(keys) {
        for(let c in this.components) {
            if(this.components[c].update) {
                this.components[c].update(keys)
            }
        }
    }



    addComponent(components) {
        components.forEach(c => {
            this.components[c.name] = c
        })
    }
}



