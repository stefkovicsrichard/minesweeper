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
                var cell = document.getElementById(`${i}_${j}`)
                if (cell.isBomb) cell.number = -1;
                else if (i == 0 && j == 0) {
                    if (document.getElementById(`${i}_${j+1}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i+1}_${j+1}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i+1}_${j}`).isBomb) cell.number++;
                } else if (i == 0 && j == width-1) {
                    if (document.getElementById(`${i}_${j-1}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i+1}_${j-1}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i+1}_${j}`).isBomb) cell.number++;
                } else if (i == height-1 && j == width-1) {
                    if (document.getElementById(`${i}_${j-1}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i-1}_${j-1}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i-1}_${j}`).isBomb) cell.number++;
                } else if (i == height-1 && j == 0) {
                    if (document.getElementById(`${i}_${j+1}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i-1}_${j+1}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i-1}_${j}`).isBomb) cell.number++;
                } else if (i == 0) {
                    if (document.getElementById(`${i}_${j-1}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i+1}_${j-1}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i+1}_${j}`).isBomb) cell.number++;
                    if (document.getElementById(`${i+1}_${j+1}`).isBomb) cell.number++;
                    if (document.getElementById(`${i}_${j+1}`).isBomb) cell.number++;
                } else if (j == 0) {
                    if (document.getElementById(`${i-1}_${j}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i-1}_${j+1}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i}_${j+1}`).isBomb) cell.number++;
                    if (document.getElementById(`${i+1}_${j+1}`).isBomb) cell.number++;
                    if (document.getElementById(`${i+1}_${j}`).isBomb) cell.number++;
                } else if (i == height-1) {
                    if (document.getElementById(`${i}_${j-1}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i-1}_${j-1}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i-1}_${j}`).isBomb) cell.number++;
                    if (document.getElementById(`${i-1}_${j+1}`).isBomb) cell.number++;
                    if (document.getElementById(`${i}_${j+1}`).isBomb) cell.number++;
                } else if (j == width-1) {
                    if (document.getElementById(`${i-1}_${j}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i-1}_${j-1}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i}_${j-1}`).isBomb) cell.number++;
                    if (document.getElementById(`${i+1}_${j-1}`).isBomb) cell.number++;
                    if (document.getElementById(`${i+1}_${j}`).isBomb) cell.number++;
                } else {
                    if (document.getElementById(`${i-1}_${j}`).isBomb) cell.number++;
                    if (document.getElementById(`${i-1}_${j+1}`).isBomb) cell.number++;
                    if (document.getElementById(`${i}_${j+1}`).isBomb) cell.number++;
                    if (document.getElementById(`${i+1}_${j+1}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i+1}_${j}`).isBomb) cell.number++; 
                    if (document.getElementById(`${i+1}_${j-1}`).isBomb) cell.number++;
                    if (document.getElementById(`${i}_${j-1}`).isBomb) cell.number++;
                    if (document.getElementById(`${i-1}_${j-1}`).isBomb) cell.number++;
                }
            }
        }
        //#endregion
    }
}

function clickCheck(cell) {
    if (cell.isBomb) {
        document.body.style.display = "none";
        console.log("bomb");
    } else {
        cell.revealed = true;
        console.log("not bomb, num: " + cell.number);
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