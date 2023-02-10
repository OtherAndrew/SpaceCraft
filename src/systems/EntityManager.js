/*
Manages and creates Entities.
A NPC Factory. Nothing else should be able to create entities without going through a manager.

NPC - any object within the game. Components are attached to the entities to give them functionality.



*/

/**
 * Manages the Game entities.
 * 
 */
class EntityManager {

    constructor(){
        this.entities = []
        this.entityMap = new Map()
        this.totalEntities = 0
        this.toAddEntities = []
    }

    /**
     * Creates and adds an entity to the manager
     * @todo isAlive?
     * @param {Object} props          NPC properties
     * @param {string} props.tag      NPC tag
     * @param {[]} props.components   NPC components
     * @returns {Entity}              the created entity
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
        if(typeof arg === 'number') return this.entityMap.get(arg)
    }

    /**
     * Adds pending entities from the toAddEntities list to the main entities list.
     * Removes dead entities from the entities list and also from the entitiesMap. Dead === isAlive === false.
     * Finally, clears the toAddEntities list.
     */
    update() {
        this.toAddEntities.forEach(e => {
            this.entities.push(e)
            this.entityMap.set(e.id, e)
        })
        let removed = this.#removeDeadEntities()
        this.toAddEntities.length = 0
        for(let tag in removed) {
            this.entityMap.delete(tag)
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
 * NPC class. Only the EntityManager should be able to create entities.
 * 
 */
class Entity  {

    /**
     *
     * @param {Object} props          Entity properties
     * @param {string} props.tag      Entity tag(s)
     * @param {[]} props.components   Entity components
     * @param {function} props.update Entity update function
     * @param {number} id             Entity ID
     */
    constructor(props, id) {
        this.id = id
        this.tag = props.tag
        this.isDrawable = true
        this.isAlive = true
        this.components = {}
        this.update = null;
        if (props.components) this.addComponent(props.components);
        if (props.update) this.update = props.update;
    }

    /**
     * Marks entity for deletion
     */
    destroy() {
        this.isAlive = false
    }

    /**
     * Adds component objects to the entity.
     * @param {[]} components
     */
    addComponent(components) {
        components.forEach(c => this.components[c.name] = c);
    }

    /**
     * Removes component.
     * @param {string} name Name of component to remove.
     */
    removeComponent(name) {
        this.components = this.components.filter(c => c.name !== name);
    }

}



