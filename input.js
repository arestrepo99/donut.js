// Listen to input turning on lines and points




document.getElementById("myCheck").addEventListener("click", ()=>toggle('l'));
document.getElementById("myCheck2").addEventListener("click", ()=>toggle('p'));
document.getElementById("myCheck3").addEventListener("click", ()=>toggle('b'));
document.getElementById("myCheck4").addEventListener("click", ()=>toggle('t'));
document.getElementById("myCheck5").addEventListener("click", ()=>toggle('r'));
document.getElementById("myCheck6").addEventListener("click", ()=>toggle('e'));
document.getElementById("myCheck7").addEventListener("click", ()=>toggle('i'));
document.getElementById("myCheck8").addEventListener("click", ()=>toggle('o'));

export const settings = {
    renderLines: false,
    renderPoints: false,
    renderTriangles: true,
    betterShading: true,
    lighting: true,
    rotate: true,
    texture: true,
    rotateLight: true,
};

export function toggle(keyName){
    if (keyName === 'l')      settings.renderLines = !settings.renderLines;
    else if (keyName === 'p') settings.renderPoints = !settings.renderPoints;
    else if (keyName === 'b') settings.betterShading = !settings.betterShading;
    else if (keyName === 't') settings.renderTriangles = !settings.renderTriangles;
    else if (keyName === 'r') settings.rotate = !settings.rotate
    else if (keyName === 'e') settings.texture = !settings.texture
    else if (keyName === 'i') settings.lighting = !settings.lighting
    else if (keyName === 'o') settings.rotateLight = !settings.rotateLight
}

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    toggle(keyName);
}, false);

