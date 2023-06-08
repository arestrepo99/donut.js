// import Screen from './screen.js';
import { settings } from './input.js';
import Vector from './vector.js';
// import Line from './line.js';
// import Triangle from './triangle.js';




export default class Triangle{

    constructor(p1, p2, p3, texture){
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.texture = texture;
    }



    setNormalAtVertices(n1, n2, n3){
        this.n1 = n1; this.n2 = n2; this.n3 = n3;
    }

    getNormalAtVertices(){
        if (this.n1 && this.n2 && this.n3) return {n1: this.n1, n2: this.n2, n3: this.n3};
        const n = this.normal();
        return {n1: n, n2: n, n3: n};
    }

    normal(){
        const v1 = this.p2.sub(this.p1);
        const v2 = this.p3.sub(this.p1);
        return v1.cross(v2).normalize();
    }

    // Get the w1 and w2 values for a point
    barycentric(x,y) {
        const p1 = this.p1.copy(); p1.z = 0;
        const p2 = this.p2.copy(); p2.z = 0;
        const p3 = this.p3.copy(); p3.z = 0;

        const v0 = p1.sub(p2);
        const v1 = p1.sub(p3);
        const v2 = new Vector(p1.x - x, p1.y - y, 0);
        const d00 = v0.dot(v0);
        const d01 = v0.dot(v1);
        const d11 = v1.dot(v1);
        const d20 = v2.dot(v0);
        const d21 = v2.dot(v1);
        const denom = d00 * d11 - d01 * d01;
        const w = (d11 * d20 - d01 * d21) / denom;
        const v = (d00 * d21 - d01 * d20) / denom;
        const u = 1 - w - v;
        return {u, w, v}; 
        // u corresponds to p1, v to p2 and w to p3
    }

    setTexture(r1, r2, r3, texture){
        this.r1 = r1; this.r2 = r2; this.r3 = r3; // Ratios where each vertex is in the texture
        this.texture = texture;
    }

    getColorAtBarycentric(u, v, w){
        if (!this.texture) return [255, 255, 255, 255];
        if (!settings.texture) return [255, 255, 255, 255];
        const ratioAtTexture = new Vector(this.r1.x * u + this.r2.x * v + this.r3.x * w, this.r1.y * u + this.r2.y * v + this.r3.y * w, 0);
        const x = Math.floor(ratioAtTexture.x * this.texture.width);
        const y = Math.floor(ratioAtTexture.y * this.texture.height);
        return this.texture.getPixel(x, y);
    }

    rotate(rotation){
        const p1 = this.p1.rotate(rotation);
        const p2 = this.p2.rotate(rotation);
        const p3 = this.p3.rotate(rotation);
        const triangle = new Triangle(p1, p2, p3);
        // Rotate normals
        if (this.n1 && this.n2 && this.n3) {
            const n1 = this.n1.rotate(rotation);
            const n2 = this.n2.rotate(rotation);
            const n3 = this.n3.rotate(rotation);
            triangle.setNormalAtVertices(n1, n2, n3);
        }
        // Assign texture
        if (this.texture) {
            triangle.setTexture(this.r1, this.r2, this.r3, this.texture);
        }
        return triangle;
    }

    getZ(){
        return (this.p1.z + this.p2.z + this.p3.z)/3;
    }

}