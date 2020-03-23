export function getGroundPosition(scene, mustHit) {
    const pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
        return mesh.id === 'ground';
    });

    if (pickInfo.hit) {
        return pickInfo.pickedPoint;
    }

    return null;
}
