
import Vector from './vector.js';
import {settings} from "./input.js";
// import Line from './line.js';
// import Triangle from './triangle.js';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

export default class Screen{

    constructor(width, height){
        this.width = width;
        this.height = height;
        this.data = new Uint8ClampedArray(width * height * 4);
        for (let i = 0; i< this.data.length; i+=4) {
            // this.data[i + 0] = i/100; // R value
            // this.data[i + 1] = height+i/100; // G value
            // this.data[i + 2] = 0; // B value
            this.data[i + 3] = 255; // A value
        }
        this.light = new Vector(0.5,0.5,-1).normalize();
        // this.light = new Vector(0,0,-1).normalize();
        this.camera = {
            direction: new Vector(0,0,1),
        }
    }

    set(x,y, value){
        x = Math.floor(x) + this.width/2; y = Math.floor(y) + this.height/2;
        this.data[(y*this.width + x)*4 + 0] = value[0];
        this.data[(y*this.width + x)*4 + 1] = value[1];
        this.data[(y*this.width + x)*4 + 2] = value[2];
        this.data[(y*this.width + x)*4 + 3] = 255;
    }

    get(x,y) {
        x = Math.floor(x) + this.width/2; y = Math.floor(y) + this.height/2;
        return [
            this.data[(y*this.width + x)*4 + 0],
            this.data[(y*this.width + x)*4 + 1],
            this.data[(y*this.width + x)*4 + 2],
            this.data[(y*this.width + x)*4 + 3],
        ]
    }

    point(point, value){
        // 3x3 point rasterization
        const size = 1;
        for (let x = point.x-size; x <= point.x+size; x++){
            for (let y = point.y-size; y <= point.y+size; y++){
                this.set(x, y, value);
            }
        }
        this.set(point.x, point.y, value);
    }


    line(line, value1, value2) {
        const point1 = line.p1;
        const point2 = line.p2;
        // Line rasterization
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        const xinc = dx / steps;
        const yinc = dy / steps;
        let x = point1.x;
        let y = point1.y;
        let value = value1;
        for (let i = 0; i < steps; i++) {
            this.set(Math.floor(x), Math.floor(y), value);
            x += xinc;
            y += yinc;
            value = value.map((v, i) => v + (value2[i] - value1[i]) / steps);
        }
    }


    triangle(triangle){
        // Triangle rasterization
        const {n1, n2, n3} = triangle.getNormalAtVertices();
        // Check if triangle is backfacing
        if ( triangle.normal().dot(this.camera.direction) > 0) return;

        let intensity = {
            i1: Math.max(0, n1.dot(this.light)),
            i2: Math.max(0, n2.dot(this.light)),
            i3: Math.max(0, n3.dot(this.light)),
        }

        // No shading
        if (!settings.betterShading) {
            const int = triangle.normal().dot(this.light);
            intensity.i1 = int
            intensity.i2 = int
            intensity.i3 = int
        }
        // if (noShading) intensity.i1 = intensity.i2 = intensity.i3 = 1;
        if (!settings.renderTriangles) return

        const p1 = triangle.p1;
        const p2 = triangle.p2;
        const p3 = triangle.p3;

        const minx = Math.floor(Math.min(p1.x, p2.x, p3.x));
        const miny = Math.floor(Math.min(p1.y, p2.y, p3.y));

        const maxx = Math.ceil(Math.max(p1.x, p2.x, p3.x));
        const maxy = Math.ceil(Math.max(p1.y, p2.y, p3.y));

        for ( let x = minx; x < maxx; x++){
            for (let y = miny; y < maxy; y++){
                const {u, w, v} = triangle.barycentric(x,y);
                if ( w >= -0.01 && v >= -0.01 && u >= -0.01 && w <= 1.01 && v <= 1.01 && u <= 1.01){
                    let color = triangle.getColorAtBarycentric(u,w,v);
                    let mixed_intensity = (intensity.i1 * u + intensity.i2 * w + intensity.i3 * v);
                    if (!settings.lighting) {
                        mixed_intensity = 1;
                    }
                    color = [color[0] * mixed_intensity, color[1] * mixed_intensity, color[2] * mixed_intensity, color[3]];
                    this.set(x,y, [color[0], color[1], color[2], color[3]]);
                }
            }
        }
    }

    upsample(number) {
        const array = this.data;
        // Upsample
        array = new Uint8ClampedArray(this.width * this.height * 4 * number * number);
        for (let i = 0; i < this.width; i++){
            for (let j = 0; j < this.height; j++){
                for (let x = 0; x < number; x++){
                    for (let y = 0; y < number; y++){
                        array[((j*number+y)*this.width*number + (i*number+x))*4 + 3] = 255;
                        array[((j*number+y)*this.width*number + (i*number+x))*4 + 0] = this.data[(j*this.width + i)*4 + 0];
                        array[((j*number+y)*this.width*number + (i*number+x))*4 + 1] = this.data[(j*this.width + i)*4 + 1];
                        array[((j*number+y)*this.width*number + (i*number+x))*4 + 2] = this.data[(j*this.width + i)*4 + 2];
                    }
                }
            }
        }
        return array;
    }


    blur(kernelSize) {
        const gpu = new GPU();
        for (let i = 0; i < this.width; i++){
            for (let j = 0; j < this.height; j++){
                let r = 0, g = 0, b = 0;
                for (let x = 0; x < kernelSize; x++){
                    for (let y = 0; y < kernelSize; y++){
                        const k = kernel[x*kernelSize + y];
                        r += this.data[((j+y)*this.width + (i+x))*4 + 0] * k;
                        g += this.data[((j+y)*this.width + (i+x))*4 + 1] * k;
                        b += this.data[((j+y)*this.width + (i+x))*4 + 2] * k;
                    }
                }
                array[(j*this.width + i)*4 + 0] = r;
                array[(j*this.width + i)*4 + 1] = g;
                array[(j*this.width + i)*4 + 2] = b;
            }
        }
        return array;
    }

    draw(upsample = 1){
        let array = this.data;
        if (upsample > 1) array = this.upsample(upsample);
        // array = this.blur(4);
        const imageData = new ImageData(array, this.width*upsample, this.height*upsample);
        ctx.putImageData(imageData, 0,0)
    }

}