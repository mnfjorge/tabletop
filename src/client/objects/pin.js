import {
    ActionManager,
    Color3,
    ExecuteCodeAction,
    HighlightLayer,
    MeshBuilder,
    PhysicsImpostor,
    PointerEventTypes,
    StandardMaterial,
    Vector3
} from "babylonjs";
import {getGroundPosition} from "../utils/dragAndDrop";
import game from "../utils/game";

export class Pin {
    constructor(scene, name, color) {
        this.scene = scene;
        this.isDirty = false;
        this.self = MeshBuilder.CreateBox(name, {width: 2, height: 2, depth: 2}, this.scene.getScene());
        this.material = new StandardMaterial(`material-pin–${name}`, this.scene.getScene());
        this.material.ambientColor = Color3.FromHexString(color);
        this.self.material = this.material;
        this.self.rotation = new Vector3(0, Math.PI / -2, 0);
        this.self.position = new Vector3(0, 3, 0);

        this.self.physicsImpostor = new PhysicsImpostor(this.self, PhysicsImpostor.BoxImpostor, {
            mass: 10,
            friction: 10,
            restitution: 0
        }, this.scene.getScene());
    }

    onPointerDown(pickInfo) {
        if (pickInfo.hit) {
            this.isDirty = true;
            this.self.physicsImpostor.sleep();
            this.self.position.y = 2;
            this.self.rotationQuaternion.x = 0;
            this.self.rotationQuaternion.z = 0;
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

        this.isDirty = false;
        this.self.physicsImpostor.wakeUp();
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
        this.self.position.addInPlace(diff);

        this.startingPoint = current;
    };


    setDraggable() {
        const scene = this.scene.getScene();
        const card = this.self;

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
                        this.onPointerDown(pointerInfo.pickInfo);
                    }
                    break;
                case PointerEventTypes.POINTERUP:
                    this.onPointerUp();
                    break;
                case PointerEventTypes.POINTERMOVE:
                    this.onPointerMove();
                    break;
            }
        });
    }

    updatePosition(position, rotation) {
        this.self.position = position;
        // this.self.rotation = rotation;
    }

    getMesh() {
        return this.self;
    }
}
