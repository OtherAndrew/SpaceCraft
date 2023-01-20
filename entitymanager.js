/*
Manages and creates Entities.
A Entity Factory. Nothing else should be able to create entities without going through a manager.

Entity - any object within the game. Components are attached to the entities to give them functionality.



*/

/**
 * Manages the Game entities.
 * 
 */
class EntityManager {

    constructor(){
        this.entities = []
        this.entitiyMap = new Map()
        this.totalEntities = 0
        this.toAddEntities = []
    }

    

    /**
     * Creates and adds an entity to the manager
     * 
     * @param {
     * id: num,
     * tag: string,
     * isAlive: bool,
     * components: list of component objects} props 
     * 
     * @returns the created entity
     */
    addEntity(props) {
        let e = new Entity(props, this.totalEntities++)
        this.toAddEntities.push(e)
        return e
    }

    /**
     * @returns the entity list
     */
    get getEntities() {
        return this.entities
    }

    /**
     * Returns an entity groups by tag or a single entity with id
     * 
     * @param {string, Number} tag 
     * @returns an entity group with tag argument or entity with id argument
     */
    getEntity(arg) {
        if(typeof arg === 'number') return this.entitiyMap.get(arg)
    }

    /**
     * Adds pending entities from the toAddEntities list to the main entities list.
     * Removes dead entities from the entities list and also from the entitiesMap. Dead === isAlive === false.
     * Finally, clears the toAddEntities list.
     */
    update() {
        this.toAddEntities.forEach(e => {
            this.entities.push(e)
            this.entitiyMap.set(e.id, e)
        })
        let removed = this.#removeDeadEntities()
        this.toAddEntities.length = 0
        for(let tag in removed) {
            this.entitiyMap.delete(tag)
        }
    }

    /**
     * Private Helper function for update.
     * 
     * @returns the dead entities
     */
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


/**
 * Entity class. Only the EntityManager should be able to create entities.
 * 
 */
class Entity  {

    constructor(props, id) {
        this.id = id
        this.tag = props.tag
        this.isDrawable = true
        this.isAlive = true
        this.components = {}
        if(props.components) {
            this.addComponent(props.components)
        }
    }

    /**
     * Marks entity for deletion
     */
    destroy() {
        this.isAlive = false
    }

    /**
     * Adds component objects to the entity.
     * @param {list} components 
     */
    addComponent(components) {
        components.forEach(c => {
            this.components[c.name] = c
        })
    }
}



