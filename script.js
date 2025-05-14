const dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];
const mineCounter = document.getElementById("mines");
var mines = 0;

function gen() {
    if (document.getElementById("table")) {
        document.getElementById("table").remove();
        gen()
    } else {
        //#region tablegen
        const width = parseInt(document.getElementById("width").value);
        const height = parseInt(document.getElementById("height").value);
        const chance = parseInt(document.getElementById("chance").value);
        const div = document.getElementById("doboz");
        const table = document.createElement("table");
        table.cWidth = width;
        table.cHeight = height;
        table.id = "table";
        mines = 0;
        mineCounter.innerText = mines;
        for (let i = 0; i < height; i++) {
            const tr = document.createElement("tr");
            for (let j = 0; j < width; j++) {
                const td = document.createElement("td");
                td.id = `${i}_${j}`;
                td.revealed = false;
                td.number = 0;
                td.innerText = "#";
                td.flagged = false;
                td.isMine = Math.floor((Math.random()*100)+1)<=chance;
                    if (td.isMine) {
                        mines++;
                        mineCounter.innerText = mines;
                    }
                td.onclick = () => {clickCheck(td)}
                td.addEventListener('contextmenu', (event) => {
                    event.preventDefault();
                    flag(td);
                    return false;
                });
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        div.appendChild(table);
        //#endregion
        //remelem a buneim meg megbocsathatoak...
        //#region numbering
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                var cell = document.getElementById(`${i}_${j}`);
                if (cell.isMine) cell.number = -1; else {
                    for (let k = 0; k < dirs.length; k++) {
                        if (isInbounds(i+dirs[k][0], j+dirs[k][1], height, width)) {
                            if (document.getElementById(`${i+dirs[k][0]}_${j+dirs[k][1]}`).isMine) cell.number++;
                        }
                    }
                }
            }
        }
        //#endregion
    }
}

function isInbounds(i, j, h, w) {
    if (i >= h || i < 0 || j >= w || j < 0) return false;
    return true;
}

function peekable(cell) {
    cell.onmousedown = () => {
        peek(cell);
    }
    cell.onmouseup = () => {
        unpeek();
    };
}

function flag(cell) {
    if (!cell.revealed) {
        if (cell.flagged == false) {
            cell.innerText = "!!";
            cell.flagged = true;
            mines--;
            mineCounter.innerText = mines;
        } else {
            cell.innerText = "#";
            cell.flagged = false;
            mines++;
            mineCounter.innerText = mines;
        }
    }
}

function clickCheck(cell) {
    if (!cell.flagged) {
        cell.onclick = "";
        if (cell.isMine) {
            document.body.style.display = "none";
        } else {
            reveal(cell);
        }
    }
}

function peek(cell) {
    const table = document.getElementById("table");
    const height = table.cHeight;
    const width = table.cWidth;
    const cellId = cell.id.split("_");
    const cI = cellId[0]*1;
    const cJ = cellId[1]*1;
    console.log(cellId, cI, cJ, width, height)
    for (let i = 0; i < dirs.length; i++) {
        if (isInbounds(cI+dirs[i][0], cJ+dirs[i][1], height, width)) {
            var cCell = document.getElementById(`${cI+dirs[i][0]}_${cJ+dirs[i][1]}`);
            if (!cCell.flagged && !cCell.revealed)
                console.log(dirs[i], cCell);
                if (!cCell.revealed && !cCell.flagged) cCell.innerText = "_";
        }
    }
}

function unpeek() {
    const table = document.getElementById("table");
    const height = table.cHeight;
    const width = table.cWidth;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const cCell = document.getElementById(`${i}_${j}`);
            if (cCell.innerText == "_") {
                cCell.innerText = "#";
            }
        }
    }
}

function reveal(cell) {
    if (!cell.revealed) {
        cell.innerText = cell.number;
        cell.onclick = "";
        cell.revealed = true;
        peekable(cell);
        if (cell.number == 0) {
            const table = document.getElementById("table");
            const height = table.cHeight;
            const width = table.cWidth;
            const cellId = cell.id.split("_");
            const cI = cellId[0]*1;
            const cJ = cellId[1]*1;
            console.log(cellId, cI, cJ, width, height)
            for (let i = 0; i < dirs.length; i++) {
                if (isInbounds(cI+dirs[i][0], cJ+dirs[i][1], height, width)) {
                    var cCell = document.getElementById(`${cI+dirs[i][0]}_${cJ+dirs[i][1]}`);
                    console.log(dirs[i], cCell);
                    if (!cCell.revealed && cCell.number != -1) reveal(cCell);
                }
            }
        }
    }
}