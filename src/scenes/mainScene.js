import 'cannon';
import {
    ArcRotateCamera,
    Color3,
    HemisphericLight,
    MeshBuilder,
    PhysicsImpostor,
    Scene,
    StandardMaterial,
    Texture,
    Vector3,
} from 'babylonjs';
import {AdvancedDynamicTexture, TextBlock, Control, Button, StackPanel, InputText, ScrollViewer} from 'babylonjs-gui';
import {Card} from "../objects/card";

export class MainScene {
    constructor(engine) {
        this.engine = engine;
    }

    init() {
        const canvas = this.engine.getRenderingCanvas();

        this.scene = new Scene(this.engine);

        this.scene.ambientColor = new Color3(1, 1, 1);
        this.scene.enablePhysics(null);

        this.camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 100, Vector3.Zero(), this.scene);
        this.camera.attachControl(canvas, true);
        this.camera.lowerBetaLimit = 0.1;
        this.camera.upperBetaLimit = (Math.PI / 2) * 0.99;
        this.camera.lowerRadiusLimit = 15;

        const light1 = new HemisphericLight("light1", new Vector3(1, 1, 0), this.scene);

        const ground = MeshBuilder.CreateBox("ground", {width: 100, height: 1, depth: 100}, this.scene);

        const board = MeshBuilder.CreateBox("board", {width: 50, height: 0.5, depth: 50}, this.scene);
        const boardMaterial = new StandardMaterial("material-board", this.scene);
        boardMaterial.ambientTexture = new Texture("board.jpg", this.scene);
        board.material = boardMaterial;
        board.position = new Vector3(0, 0.5, 0);
        board.rotation = new Vector3(0, Math.PI * 1.5, 0);

        board.physicsImpostor = new PhysicsImpostor(board, PhysicsImpostor.BoxImpostor, {
            mass: 0,
            friction: 10,
            restitution: 0
        }, this.scene);

        ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, {
            mass: 0,
            friction: 10,
            restitution: 0
        }, this.scene);

        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

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

        const chatContainer = new StackPanel();
        chatContainer.isVertical = true;
        chatContainer.alpha = 0.7;
        chatContainer.background = "black";
        chatContainer.adaptHeightToChildren = false;
        chatContainer.adaptWidthToChildren = false;
        chatContainer.height = "220px";
        chatContainer.width = "200px";
        chatContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        chatContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        advancedTexture.addControl(chatContainer);

        const chatScroll = new ScrollViewer();
        chatScroll.width = "200px";
        chatScroll.height = "200px";
        chatContainer.addControl(chatScroll);

        const chatText = new TextBlock();
        chatText.text = "chat here\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis efficitur vehicula. Nullam non nisi sodales, vulputate ligula non, finibus lectus. Phasellus at lacus scelerisque, scelerisque turpis ac, tempus augue. Aliquam erat volutpat. Nunc libero nulla, accumsan eu cursus at, pulvinar sed velit. Nulla varius faucibus libero, quis accumsan nisi pellentesque eu. Nullam aliquam sodales risus, eu efficitur ex viverra ac. Pellentesque varius, quam id pretium pretium, lectus erat elementum leo, non feugiat massa urna ut velit. Sed pellentesque facilisis ultrices";
        chatText.color = "white";
        chatText.fontSize = 12;
        chatText.resizeToFit = true;
        chatText.textWrapping = true;
        chatText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        chatScroll.addControl(chatText);

        const chatInput = new InputText();
        chatInput.width = "200px";
        chatInput.height = "20px";
        chatInput.color = "white";
        chatInput.fontSize = 12;
        chatInput.onKeyboardEventProcessedObservable.add((eventData) => {
            if (eventData.key === 'Enter') {
                chatText.text += "\n" + chatInput.text;
                chatInput.text = '';
                chatScroll.verticalBar.value = 1;
                advancedTexture.moveFocusToControl(chatInput);
            }
        });
        chatContainer.addControl(chatInput);

        const card1 = new Card(this, "card1", "card1.png");
        card1.setDraggable();

        const card3 = new Card(this, "card3", "card1.png");
        card3.setDraggable();

        const card2 = new Card(this, "card2", "card1.png");
        card2.setDraggable();
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

