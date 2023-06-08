
export default class Line {

    constructor (p1, p2){
        this.p1 = p1;
        this.p2 = p2;
    }

    rotate(rotation){
        return new Line(this.p1.rotate(rotation), this.p2.rotate(rotation));
    }

    getZ(){
        return (this.p1.z + this.p2.z)/2 - 20;
    }

}