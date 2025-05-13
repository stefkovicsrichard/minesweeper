const dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];

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
        table.id = "table"
        for (let i = 0; i < height; i++) {
            const tr = document.createElement("tr");
            for (let j = 0; j < width; j++) {
                const td = document.createElement("td");
                td.id = `${i}_${j}`;
                td.revealed = false;
                td.number = 0;
                td.innerText = "##";
                td.isBomb = Math.floor((Math.random()*100)+1)<=chance;
                    if (td.isBomb) td.style.backgroundColor = "rgba(255, 0, 0, 0.2)"
                td.addEventListener("click", () => {clickCheck(td)}, {once: true});
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
                if (cell.isBomb) cell.number = -1; else {
                    for (let k = 0; k < dirs.length; k++) {
                        if (isInbounds(i+dirs[k][0], j+dirs[k][1], height, width)) {
                            if (document.getElementById(`${i+dirs[k][0]}_${j+dirs[k][1]}`).isBomb) cell.number++;
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

function clickCheck(cell) {
    if (cell.isBomb) {
        document.body.style.display = "none";
        console.log("bomb");
    } else {
        cell.revealed = true;
        console.log("not bomb, num: " + cell.number + " " + cell.id);
    }
}

function isBomb(cell) {
    table = document.getElementById("table");
    for (let i = 0; i < table.cHeight; i++) {
        for (let j = 0; j < table.cWidth; j++) {
            var coords = cell.split("_");
            if (i == coords[0] && j == coords[1]) {
                if (document.getElementById(cell).isBomb) {
                    console.log("bomb");
                } else {
                    console.log("not bomb");
                }
            }
        }
    }
}