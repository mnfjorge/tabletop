import {MeshBuilder, PhysicsImpostor, StandardMaterial, Texture, Vector3} from "babylonjs";
import {Card} from "../../objects/card";

export const monopoly = {
    getBoard: function(scene) {
        const board = MeshBuilder.CreateBox("board", {width: 50, height: 0.5, depth: 50}, scene);
        const boardMaterial = new StandardMaterial("material-board", scene);
        boardMaterial.ambientTexture = new Texture("monopoly/board.jpg", scene);
        board.material = boardMaterial;
        board.position = new Vector3(0, 0.5, 0);
        board.rotation = new Vector3(0, Math.PI * 1.5, 0);

        board.physicsImpostor = new PhysicsImpostor(board, PhysicsImpostor.BoxImpostor, {
            mass: 0,
            friction: 10,
            restitution: 0
        }, scene);

        return board;
    },

    getObjects: function(scene) {
        const card1 = new Card(scene, "card1", "monopoly/card1.png");
        card1.setDraggable();

        const card3 = new Card(scene, "card3", "monopoly/card1.png");
        card3.setDraggable();

        const card2 = new Card(scene, "card2", "monopoly/card1.png");
        card2.setDraggable();
    }
};
