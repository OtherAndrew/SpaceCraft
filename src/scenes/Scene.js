

/**
 * A container that holds entities, systems, game logic. The idea is that each scene will contain different game states.
 * Such as main menu scene, main game scene, battle scene, etc.
 */
class Scene {
    constructor() {
        this.entityManager = new EntityManager()
        this.blockFactory = new BlockFactory(this.entityManager);
        this.containerManager = new ContainerManager();
        this.renderSystem = new RenderSystem(this.entityManager.getEntities)
    }

    update() {

    }
     draw() {

     }
}