import {ArcRotateCamera, Vector3} from "babylonjs";

export function setupCamera(scene) {
    const camera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 4, 100, Vector3.Zero(), scene);

    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    camera.lowerRadiusLimit = 15;

    return camera;
}
