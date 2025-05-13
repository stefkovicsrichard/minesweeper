function gen() {
    const width = parseInt(document.getElementById("width").value);
    const height = parseInt(document.getElementById("height").value);
    const div = document.getElementById("doboz");
    const table = document.createElement("table");
    table.cWidth = width;
    table.cHeight = height;
    table.id = "table"
    for (let i = 0; i < height; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < width; j++) {
            const td = document.createElement("td");
            td.innerText = i+j;
            td.isBomb = false;
            td.id = `${i}-${j}`;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    div.appendChild(table)
}

function isBomb(cell) {
    table = document.getElementById("table");
    for (let i = 0; i < table.cHeight; i++) {
        for (let j = 0; j < table.cWidth; j++) {
            if (document.getElementById(`${i}-${j}`).isBomb) {
                console.log("bomb");
            } else {
                console.log("not bomb");
            }
        }
    }
}