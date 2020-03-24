import {Engine} from "babylonjs";
import {MainScene} from "../scenes/mainScene";
import {monopoly} from "../games/monopoly/game";

class Game {
    init(canvas) {
        this.engine = new Engine(canvas, true, { stencil: true });

        this.scene = new MainScene(monopoly, this.engine);
        this.scene.init();

        this.engine.runRenderLoop(() => {
            this.scene.getScene().render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        const urlParams = new URLSearchParams(window.location.search);
        this.gameId = urlParams.get('id') || 'room1';
        this.login = urlParams.get('login') || 'user';
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

    getGameId() {
        return this.gameId;
    }

    getLogin() {
        return this.login;
    }
}

const game = new Game();

export default game;
