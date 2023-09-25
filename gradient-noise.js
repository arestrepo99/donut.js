import Vector from "./vector.js";
const noise = new Noise();

export default class GradientNoiseMap{

    static calculateGradient(x, y, noiseFunction, step) {
        const dx = noiseFunction(x + step, y) - noiseFunction(x - step, y);
        const dy = noiseFunction(x, y + step) - noiseFunction(x, y - step);
        return [dx, dy];
      }
      
    static getNormal(x,y, width, height){
        // Return vector normal to surface where height is defined by noise function
        const noisefunc = (x,y) => noise.simplex2(x,y);
        const zoom = 0.009;
        const loc_x = x / width / zoom;
        const loc_y = y / height / zoom;
        const step = 1/width;
        const value = Math.abs(noise.simplex2(loc_x, loc_y));
        const gradient = GradientNoiseMap.calculateGradient(loc_x, loc_y, noisefunc, step);
        return new Vector(gradient[0], gradient[1], 2*step).normalize();
    }
      
    static createNormalMap(width,height){
        const normalMap = new Array(width * height * 4);
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const cell = (x + y * width) * 4;
                const gradient = GradientNoiseMap.getNormal(x,y, width, height);
                normalMap[cell] = gradient.x;
                normalMap[cell + 1] = gradient.y;
                normalMap[cell + 2] = gradient.z;
                normalMap[cell + 3] = 0;
        
            }
        }
        return normalMap;
    } 

    
}


