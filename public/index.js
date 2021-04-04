import { memory } from "game-of-life-wasm/game_of_life_wasm_bg";
import { Universe } from "game-of-life-wasm";
import { fps } from "./metrics.js";

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";


const universe = Universe.new();
const width = universe.width();
const height = universe.height();

const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext("2d");

const renderLoop = () => {
    
    fps.render();

    universe.tick();

    drawGrid();
    drawCells();

    requestAnimationFrame(renderLoop);
};

const bitIsSet = (n, arr) => {
    const byte = Math.floor(n / 8);
    const mask = 1 << (n % 8);
    return (arr[byte] & mask) === mask;
}

const drawGrid = () => {

    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    for(let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    for(let j = 0; j <= height; j++) {
        ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
};


const drawCells = () => {

    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height / 8);

    ctx.beginPath;

    ctx.fillStyle = ALIVE_COLOR;
    for(let row = 0; row < height; row++) {
        for(let col = 0; col < width; col++) {

            const idx = row * height + col;

            if(!bitIsSet(idx, cells)) continue; // cell is dead; in this loop only cells that are alive get drawn

            ctx.fillRect(col * (CELL_SIZE + 1) + 1, row * (CELL_SIZE + 1) + 1, CELL_SIZE, CELL_SIZE);
        }
    }


    ctx.fillStyle = DEAD_COLOR;
    for(let row = 0; row < height; row++) {
        for(let col = 0; col < width; col++) {

            const idx = row * height + col;

            if(bitIsSet(idx, cells)) continue;

            ctx.fillRect(col * (CELL_SIZE + 1) + 1, row * (CELL_SIZE + 1) + 1, CELL_SIZE, CELL_SIZE);
        }
    }

    ctx.stroke();
};


requestAnimationFrame(renderLoop);




