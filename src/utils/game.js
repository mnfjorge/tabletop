import {Engine} from "babylonjs";
import {MainScene} from "../scenes/mainScene";

class Game {
    init(canvas) {
        this.engine = new Engine(canvas, true, { stencil: true });

        this.scene = new MainScene(this.engine);
        this.scene.init();

        this.engine.runRenderLoop(() => {
            this.scene.getScene().render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    getEngine() {
        return this.engine;
    }

    getCanvas() {
        return this.engine.getRenderingCanvas();
    }

    getScene() {
        return this.scene;
    }
}

const game = new Game();

export default game;
