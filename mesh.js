import Vector from "./vector.js";
import Line from "./line.js";
import Triangle from "./triangle.js";
import {settings} from "./input.js";



class Texture{

    constructor(width, height, texture){
        this.width = width;
        this.height = height;
        this.texture = texture;
    }

    getPixel(x,y){
        if (x >= this.width) x = this.width - 1;
        if (y >= this.height) y = this.height - 1;
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        const i = (x + y*this.width)*4;
        return [this.texture[i + 0], this.texture[i + 1], this.texture[i + 2], this.texture[i + 3]];
    }
}

const t_width = 600; const t_height = 1800;
let texture_array = new Uint8ClampedArray(t_width * t_height * 4);

const FREQUENCY = Math.PI / t_height * 10;
const AMPLITUDE = 5;
const START = t_width/2 + AMPLITUDE*2
const END = t_width - AMPLITUDE*2
// [224,116,185] pink
// [180,150,100] brown
for (let i = 0; i< t_width; i++) {
    for (let j = 0; j< t_height; j++) {
        const index = (j*t_width + i)*4;
        if (i > AMPLITUDE*Math.sin(j*FREQUENCY) + START && i < AMPLITUDE*Math.sin(j*FREQUENCY) + END){
            // pink
            texture_array[index + 0] = 249; // R value
            texture_array[index + 1] = 103; // G value
            texture_array[index + 2] = 198; // B value

        } else {
            // brown    
            texture_array[index + 0] = 191; // R value
            texture_array[index + 1] = 154; // G value
            texture_array[index + 2] = 94; // B value
        }
    }
}

// Add Sprinkles
const num_sprinkles = 800;
let num_added = 0;
const colors = [
    [250,0,0,255],
    [0,250,0,255],
    [0,0,250,255],
]
const length = 1;
const size = 6;
while (num_added < num_sprinkles){
    const i = Math.floor(Math.random() * t_width);
    const j = Math.floor(Math.random() * t_height);
    if (i > AMPLITUDE*Math.sin(j*FREQUENCY) + START && i < AMPLITUDE*Math.sin(j*FREQUENCY) + END){
        num_added++;
        const color = colors[Math.floor(Math.random() * colors.length)];
        let direction_x = Math.random();
        let direction_y = Math.random();
        const sum = direction_x + direction_y;
        direction_x = direction_x / (sum);
        direction_y = direction_y / (sum);
        // for (let k = 0; k < length; k++){
            for( let k1 = -size; k1 < size; k1++){
                for ( let k2 = -size; k2 < size; k2++){
                    // console.log(k, direction_x, direction_y)
                    const x = i + k1 //+ k * direction_x;
                    const y = j + k2 //+ k * direction_y;
                    const index = (y*t_width + x)*4;
                    // Gets smaller as k gets bigger
                    const ratio = 1 - Math.sqrt(k1*k1 + k2*k2) / size;
                    texture_array[index + 0] = color[0] * (ratio) + texture_array[index + 0] * (1-ratio); // R value
                    texture_array[index + 1] = color[1] * (ratio) + texture_array[index + 1] * (1-ratio); // G value
                    texture_array[index + 2] = color[2] * (ratio) + texture_array[index + 2] * (1-ratio); // B value
                    texture_array[index + 3] = color[3] * (ratio) + texture_array[index + 3] * (1-ratio); // A value
                }
            }
        // }
    }
}


const texture = new Texture(t_width, t_height, texture_array);
const textureCanvas = document.getElementById('texture');
const textureCtx = textureCanvas.getContext('2d');
const textureImageData = textureCtx.createImageData(t_width, t_height);
textureCanvas.width = t_width;
textureCanvas.height = t_height;
textureImageData.data.set(texture_array);
// textureCtx.putImageData(textureImageData, 0, 0);



const CIRCLE_RADIUS = 80;
const HOLE_RADIUS = 90;
const N_STEPS_CIRCLE = 20;
const N_STEPS_DONUT = 40;
// CREATE DONUT MESH
function DonutMesh(){
    const step_circle = 2*Math.PI/N_STEPS_CIRCLE;
    const step_donut = 2*Math.PI/N_STEPS_DONUT;
    const triangles = [];
    const points = [];
    const lines = [];
    const c_r = CIRCLE_RADIUS;
    const h_r = HOLE_RADIUS;
    // const screen = new Screen(width, height);
    for (let i = 0; i < 2*Math.PI; i+=step_circle){
        for (let j = 0; j < 2*Math.PI; j+=step_donut){
            let p1 = new Vector(Math.cos(i)*c_r + ( h_r + c_r), Math.sin(i)*c_r, 0)
            let n1 = new Vector(Math.cos(i), Math.sin(i), 0).normalize();
            let p2 = new Vector(Math.cos(i+step_circle)*c_r + ( h_r + c_r), Math.sin(i+step_circle)*c_r, 0)
            let n2 = new Vector(Math.cos(i+step_circle), Math.sin(i+step_circle), 0).normalize();
            let p3 = p1.copy(); let p4 = p2.copy();
            let n3 = n1.copy(); let n4 = n2.copy();
            p1 = p1.rotateY(j); p2 = p2.rotateY(j); p3 = p3.rotateY(j+step_donut); p4 = p4.rotateY(j+step_donut);
            n1 = n1.rotateY(j); n2 = n2.rotateY(j); n3 = n3.rotateY(j+step_donut); n4 = n4.rotateY(j+step_donut);
            const t1 = new Triangle(p1, p2, p3); const t2 = new Triangle(p3, p2, p4);
            t1.setNormalAtVertices(n1, n2, n3); t2.setNormalAtVertices(n3, n2, n4);
            t1.setTexture(
                new Vector(i/(2*Math.PI), j/(2*Math.PI), 0), 
                new Vector((i+step_circle)/(2*Math.PI), j/(2*Math.PI), 0),
                new Vector(i/(2*Math.PI), (j+step_donut)/(2*Math.PI), 0),
                texture);
            t2.setTexture(
                new Vector(i/(2*Math.PI), (j+step_donut)/(2*Math.PI), 0),
                new Vector((i+step_circle)/(2*Math.PI), j/(2*Math.PI), 0),
                new Vector((i+step_circle)/(2*Math.PI), (j+step_donut)/(2*Math.PI), 0),
                texture);
            points.push(p1);
            lines.push(new Line(p1, p2));
            lines.push(new Line(p2, p3));
            lines.push(new Line(p3, p1));
            triangles.push(t1);
            triangles.push(t2);
        }
    }
    return {triangles, points, lines};
}

const donut = DonutMesh();

// Animation Frame Creator
function drawDonut(rotation, screen){
    // const screen = new Screen(width, height);

    let {triangles, points, lines} = donut;
    
    triangles = triangles.map(triangle => triangle.rotate(rotation));
    points = points.map(point => point.rotate(rotation));
    lines = lines.map(line => line.rotate(rotation));

    const objects = [...triangles, ...lines];

    // Sort objects by z position of first point
    objects.sort((a,b) => {
        return  b.getZ() - a.getZ();
    });

    objects.forEach(object => {
        if (object instanceof Triangle){
            screen.triangle(object);
        } else if (object instanceof Line){
            if (settings.renderLines) screen.line(object, [0, 0, 180], [0, 0, 180]);
            // screen.line(object, [0, 0, 0], [0, 0, 0]);
        }
    });
    
    if (settings.renderPoints) points.forEach(point => screen.point(point, [255, 0, 0]));
    screen.draw();
}



function drawTriange(rotation){
    const size = 50;
    const screen = new Screen(size, size);
    const triangle_height = size / 3;
    p1 = new Vector(triangle_height, 0, 0);
    p2 = new Vector(-triangle_height, 0, 0);
    p3 = new Vector(0, -triangle_height, 0);

    p1 = p1.rotate(rotation);
    p2 = p2.rotate(rotation);
    p3 = p3.rotate(rotation);

    t = new Triangle(p2, p1, p3);

    screen.triangle(t);
    
    screen.line(p1, p2, [255, 0, 0], [255, 0, 0]);
    screen.line(p2, p3, [255, 0, 0], [255, 0, 0]);
    screen.line(p3, p1, [255, 0, 0], [255, 0, 0]);


    screen.point(p1, [255, 0, 0]);
    screen.point(p2, [255, 0, 0]);
    screen.point(p3, [255, 0, 0]);
    screen.draw(10);
}




export default drawDonut;