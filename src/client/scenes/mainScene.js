import 'cannon';
import {Color3, HemisphericLight, MeshBuilder, PhysicsImpostor, Scene, Vector3,} from 'babylonjs';
import {AdvancedDynamicTexture, Button, Control, StackPanel, TextBlock} from 'babylonjs-gui';
import {setupCamera} from "../utils/camera";
import {chat} from "./chat";
import game from "../utils/game";
import {Pin} from "../objects/pin";
import io from 'socket.io-client';

export class MainScene {
    constructor(game, engine) {
        this.game = game;
        this.engine = engine;
        this.canvas = this.engine.getRenderingCanvas();
        this.scene = new Scene(this.engine);
        this.scene.ambientColor = new Color3(1, 1, 1);
        this.scene.enablePhysics(null);
        this.players = {};
    }

    init() {
        this.light = new HemisphericLight("light1", new Vector3(1, 1, 0), this.scene);

        this.camera = setupCamera(this.scene);
        this.camera.attachControl(this.canvas);

        this.setupGui();
        this.setupWorld();
        this.setupSocket();
    }

    setupGui() {
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        chat.init(advancedTexture);

        this.label = new TextBlock();
        this.label.text = '';
        this.label.color = "white";
        this.label.fontSize = 14;
        this.label.width = "120px";
        this.label.height = "40px";
        this.label.linkOffsetY = "-30px";
        this.label.linkOffsetX = "40px";
        advancedTexture.addControl(this.label);

        const buttonsStack = new StackPanel();
        buttonsStack.isVertical = false;
        buttonsStack.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        buttonsStack.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        buttonsStack.height = "40px";
        buttonsStack.top = "10px";
        buttonsStack.left = "10px";
        advancedTexture.addControl(buttonsStack);

        const btnResetCamera = new Button.CreateSimpleButton('btn-reset-camera', 'Reset Camera');
        btnResetCamera.width = "140px";
        btnResetCamera.height = "40px";
        btnResetCamera.color = "white";
        btnResetCamera.background = "darkgray";
        btnResetCamera.onPointerClickObservable.add(() => {
            this.camera.alpha = Math.PI / 2;
            this.camera.beta = Math.PI / 4;
            this.camera.radius = 100;
        });
        buttonsStack.addControl(btnResetCamera);

        const btnRoll = new Button.CreateSimpleButton('btn-roll', 'Roll');
        btnRoll.width = "120px";
        btnRoll.height = "40px";
        btnRoll.color = "white";
        btnRoll.background = "darkgray";
        btnRoll.paddingLeft = "10px";
        btnRoll.onPointerClickObservable.add(() => {
            this.camera.alpha = Math.PI / 2;
            this.camera.beta = Math.PI / 4;
            this.camera.radius = 100;
        });
        buttonsStack.addControl(btnRoll);

        const btnToggleChat = new Button.CreateSimpleButton('btn-toggle-chat', 'Chat');
        btnToggleChat.width = "120px";
        btnToggleChat.height = "40px";
        btnToggleChat.color = "white";
        btnToggleChat.background = "darkgray";
        btnToggleChat.paddingLeft = "10px";
        btnToggleChat.onPointerClickObservable.add(() => {
            chatContainer.isVisible = !chatContainer.isVisible;
        });
        buttonsStack.addControl(btnToggleChat);
    }

    setupWorld() {
        const ground = MeshBuilder.CreateBox("ground", {width: 100, height: 1, depth: 100}, this.scene);

        ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, {
            mass: 0,
            friction: 10,
            restitution: 0
        }, this.scene);

        const board = this.game.getBoard(this.scene);
    }

    updatePlayer(data) {
        if (this.player) {
            this.scene.removeMesh(this.player.getMesh());
        }

        this.player = new Pin(this, data.login, data.color);
        this.player.setDraggable();

        if (data.position && data.rotation) {
            this.player.updatePosition(
                data.position,
                data.rotation
            );
        }
    }

    updatePlayers(data) {
        if (!this.players[data.login]) {
            this.players[data.login] = new Pin(this, data.login, data.color);
        }

        if (data.position && data.rotation) {
            this.players[data.login].updatePosition(
                data.position,
                data.rotation
            );
        }
    }

    setupSocket() {
        this.socket = io.connect('/game');
        this.socket.on('connect', () => {
            this.socket.emit('join', {room: game.getGameId(), login: game.getLogin()});
        });
        this.socket.on('player-joined', (data) => {
            if (data.login === game.getLogin()) {
                this.updatePlayer(data);
            } else {
                this.updatePlayers(data);
            }
        });
        this.socket.on('player-left', (data) => {
            if (data.login === game.getLogin()) {
                this.scene.removeMesh(this.player.getMesh());
            } else {
                if (this.players[data.login]) {
                    this.scene.removeMesh(this.players[data.login].getMesh());
                    delete this.players[data.login];
                }
            }
        });
        this.socket.on('status', (data) => {
            if (data && data.players) {
                Object.keys(data.players).filter(login => login !== game.getLogin()).map(login => {
                    this.updatePlayers(data.players[login]);
                });
            }
        });
        this.socket.on('status-move', (data) => {
            if (data.login === game.getLogin()) {
                return;
            }

            this.updatePlayers(data);
        });

        this.scene.registerBeforeRender(() => {
            if (!this.scene.isReady()) {
                return;
            }

            if (this.player && this.player.isDirty) {
                this.socket.emit('move-player', {
                    login: game.getLogin(),
                    position: this.player.getMesh().position,
                    rotation: this.player.getMesh().rotation
                });
            }
        });

        // const cards = this.game.getObjects(this);
    }

    setLabel(text, mesh) {
        this.label.text = text;
        if (mesh) {
            this.label.linkWithMesh(mesh);
        }
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }
}

