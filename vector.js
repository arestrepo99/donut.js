export default class Vector {
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    normalize(){
        const length = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
        return new Vector(this.x/length, this.y/length, this.z/length);
    }

    rotateX(rad){
        const cosa = Math.cos(rad);
        const sina = Math.sin(rad);
        const y = this.y * cosa - this.z * sina;
        const z = this.y * sina + this.z * cosa;
        return new Vector(this.x, y, z);
    }

    rotateY(rad){
        const cosa = Math.cos(rad);
        const sina = Math.sin(rad);
        const x = this.x * cosa - this.z * sina;
        const z = this.x * sina + this.z * cosa;
        return new Vector(x, this.y, z);
    }

    rotateZ(rad){
        const cosa = Math.cos(rad);
        const sina = Math.sin(rad);
        const x = this.x * cosa - this.y * sina;
        const y = this.x * sina + this.y * cosa;
        return new Vector(x, y, this.z);
    }

    rotate(rads) {
        let p = this.rotateX(rads.x);
        p = p.rotateY(rads.y);
        p = p.rotateZ(rads.z);
        return p;
    }

    dot(point){
        return this.x * point.x + this.y * point.y + this.z * point.z;
    }

    copy() {
        return new Vector(this.x, this.y, this.z);
    }

    // Substracts a vector from this vector
    sub(point){
        return new Vector(this.x - point.x, this.y - point.y, this.z - point.z);
    }
    // Adds a vector to this vector
    add(point){
        return new Vector(this.x + point.x, this.y + point.y, this.z + point.z);
    }

    cross(point) {
        return new Vector(
            this.y * point.z - this.z * point.y,
            this.z * point.x - this.x * point.z,
            this.x * point.y - this.y * point.x,
        );
    }

    getZ(){
        return this.z;
    }

    scale(scalar){
        return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
    }

}