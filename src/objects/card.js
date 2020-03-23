import {
    MeshBuilder,
    PhysicsImpostor,
    PointerEventTypes,
    StandardMaterial,
    Texture,
    Vector3,
    ExecuteCodeAction,
    ActionManager,
    HighlightLayer,
    Color3
} from "babylonjs";
import {getGroundPosition} from "../utils/dragAndDrop";
import game from "../utils/game";

export class Card {
    constructor(scene, name, image) {
        this.scene = scene;
        this.card = MeshBuilder.CreateBox(name, {width: 4.5, height: 0.1, depth: 3.6}, this.scene.getScene());
        this.material = new StandardMaterial(`material-card–${name}`, this.scene.getScene());
        this.material.ambientTexture = new Texture(image, this.scene.getScene());
        this.card.material = this.material;
        this.card.rotation = new Vector3(0, Math.PI / -2, 0);
        this.card.position = new Vector3(0, 1.2, 0);

        this.card.physicsImpostor = new PhysicsImpostor(this.card, PhysicsImpostor.BoxImpostor, {
            mass: 10,
            friction: 10,
            restitution: 0
        }, this.scene.getScene());
    }

    onPointerDown(pickInfo) {
        if (pickInfo.hit) {
            this.card.physicsImpostor.sleep();
            this.card.position.y = 2;
            this.startingPoint = getGroundPosition(this.scene.getScene());

            if (this.startingPoint) {
                setTimeout(() => {
                    this.scene.getCamera().detachControl(game.getCanvas());
                }, 0);
            }
        }
    }

    onPointerUp() {
        if (this.startingPoint) {
            this.scene.getCamera().attachControl(game.getCanvas(), true);
            this.startingPoint = null;
        }

        this.card.physicsImpostor.wakeUp();
    }

    onPointerMove() {
        if (!this.startingPoint) {
            return;
        }

        const current = getGroundPosition(this.scene.getScene());

        if (!current) {
            return;
        }

        const diff = current.subtract(this.startingPoint);
        this.card.position.addInPlace(diff);

        this.startingPoint = current;
    };


    setDraggable() {
        const scene = this.scene.getScene();
        const card = this.card;

        const hl = new HighlightLayer(`hl-${card.name}`, scene);
        hl.isEnabled = false;
        hl.blurHorizontalSize = 0.1;
        hl.blurVerticalSize = 0.1;
        hl.addMesh(card, Color3.Green());

        card.actionManager = new ActionManager(scene);
        card.actionManager.registerAction(new ExecuteCodeAction({
            trigger: ActionManager.OnPointerOverTrigger
        }, () => {
            hl.isEnabled = true;
            this.scene.setLabel(card.name, card);
        }));

        card.actionManager.registerAction(new ExecuteCodeAction({
            trigger: ActionManager.OnPointerOutTrigger
        }, () => {
            hl.isEnabled = false;
            this.scene.setLabel('');
        }));

        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case PointerEventTypes.POINTERDOWN:
                    if (pointerInfo.pickInfo.pickedMesh === card) {
                        console.log('POINTERDOWN', pointerInfo);
                        this.onPointerDown(pointerInfo.pickInfo);
                    }
                    break;
                case PointerEventTypes.POINTERUP:
                    console.log('POINTERUP', pointerInfo);
                    this.onPointerUp();
                    break;
                case PointerEventTypes.POINTERMOVE:
                    this.onPointerMove();
                    break;
            }
        });
    }
}
