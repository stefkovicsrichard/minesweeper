const dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];
const mineCounter = document.getElementById("mines");
const safes = [];
var mines = 0;
var tMines = 0;
var peeking = 0;
var timer;
var sTime;
var min = 0;
var sec = 0;
var ischeating = 0;

function gen() {
    if (document.getElementById("table")) {
        document.getElementById("table").remove();
        clearTimer(true);
        ischeating = 0;
        safes.length = 0;
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
                td.flagged = false;
                td.isMine = Math.floor((Math.random()*100)+1)<=chance;
                if (td.isMine) {
                    mines++;
                    tMines = mines;
                    mineCounter.innerText = mines;
                } else if (td.number == 0) {
                    safes.push(td);
                }
                td.onclick = () => {reveal(td)}
                td.addEventListener('contextmenu', contextMenuReplacer);
                td.onmouseup = (event) => {
                    if (event.button == 0) {
                        unpeek(td);
                    }
                };
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
        var safen = Math.floor(Math.random()*(safes.length-1));
        safes[safen].classList.add("starter");
        //#endregion
        document.getElementById("timer").innerText = "00:00";
        timer = setInterval(time, 1000)
    }
}

function cheat() {
    var tds = document.querySelectorAll("td");
    if (ischeating === 1) {
        ischeating = 0;
        tds.forEach(e => {
            if (e.isMine) e.classList.remove("highlighted");
        });
    } else {
        tds.forEach(e => {
            if (e.isMine) e.classList.add("highlighted");
        });
        ischeating = 1;
    }
}

function time() {
    sec++;
    if (sec == 60) {
        sec = 0;
        min++;
    }
    if (min < 10) {
        if (sec < 10) {
            sTime = `0${min}:0${sec}`
        } else {
            sTime = `0${min}:${sec}`
        }
    } else {
        if (sec < 10) {
            sTime = `${min}:0${sec}`
        } else {
            sTime = `${min}:${sec}`
        }
    }
    document.getElementById("timer").innerText = sTime;
}

function isInbounds(i, j, h, w) {
    if (i >= h || i < 0 || j >= w || j < 0) return false;
    return true;
}

function peekable(cell) {
    cell.onmousedown = (event) => {
        if (event.button == 0){
            peek(cell);
        }
    }
}

function flag(cell) {
    if (!cell.revealed) {
        if (cell.flagged == false) {
            cell.innerText = "!!";
            cell.flagged = true;
            mines--;
            mineCounter.innerText = mines;
        } else {
            cell.innerText = "";
            cell.flagged = false;
            mines++;
            mineCounter.innerText = mines;
        }
    }
}

// function clickCheck(cell) {
//     if (!cell.flagged) {
//         cell.onclick = "";
//         if (cell.isMine) {
//             document.body.style.display = "none";
//         } else {
//             reveal(cell);
//         }
//     }
// }

function clearTimer(bool) {
    clearInterval(timer);
    timer = null;
    sTime = "";
    sec = 0;
    min = 0;
    mines = 0;
    if (bool) {
        document.getElementById("mines").innerText = "";
        document.getElementById("timer").innerText = "";
    }
}

function lose() {
    const table = document.getElementById("table");
    const height = table.cHeight;
    const width = table.cWidth;
    clearTimer(true);
    table.style.boxShadow = "0px 0px 7px 7px red";
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            var cCell = document.getElementById(`${i}_${j}`);
            cCell.onclick = "";
            cCell.onmousedown = "";
            cCell.onmouseup = "";
            cCell.removeEventListener('contextmenu', contextMenuReplacer);
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
    for (let i = 0; i < dirs.length; i++) {
        if (isInbounds(cI+dirs[i][0], cJ+dirs[i][1], height, width)) {
            var cCell = document.getElementById(`${cI+dirs[i][0]}_${cJ+dirs[i][1]}`);
            if (!cCell.flagged && !cCell.revealed)
                if (!cCell.revealed && !cCell.flagged) {
                    cCell.classList.add("peeking")
                    peeking++;
                }
        }
    }
}

//https://stackoverflow.com/questions/6562727/is-there-a-function-to-deselect-all-text-using-javascript
//kodfutas leallasanak megakadalyozasa select kozben
function clearSelection()
{
    if (window.getSelection) {window.getSelection().removeAllRanges();}
    else if (document.selection) {document.selection.empty();}
}

function unpeek(cell) {
    clearSelection();
    const table = document.getElementById("table");
    const height = table.cHeight;
    const width = table.cWidth;
    const cellId = cell.id.split("_");
    const cI = cellId[0]*1;
    const cJ = cellId[1]*1;
    var flagged = 0;
    for (let i = 0; i < dirs.length; i++) {
        if (isInbounds(cI+dirs[i][0], cJ+dirs[i][1], height, width)) {
            var cCell = document.getElementById(`${cI+dirs[i][0]}_${cJ+dirs[i][1]}`);
            if (cCell.flagged) {
                flagged++;
            }
        }
    }
    for (let i = 0; i < dirs.length; i++) {
        if (isInbounds(cI+dirs[i][0], cJ+dirs[i][1], height, width)){
            var cCell = document.getElementById(`${cI+dirs[i][0]}_${cJ+dirs[i][1]}`);
            if (!cCell.flagged && !cCell.revealed) {
                if (flagged == cell.number) {
                    reveal(cCell);
                }
            }
        }
    }
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            var cCell = document.getElementById(`${i}_${j}`);
            if (cCell.classList.contains("peeking")) {
                cCell.classList.remove("peeking")
            }
        }
    }
    peeking = 0;
}

function endCheck() {
    var rCells = 0;
    var fCells = 0;
    const table = document.getElementById("table");
    const height = table.cHeight;
    const width = table.cWidth;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            var cCell = document.getElementById(`${i}_${j}`);
            if (!cCell.revealed && !cCell.flagged) rCells++;
            if (cCell.flagged) fCells++;
        }
    }
    if (rCells == mineCounter || rCells+fCells == tMines) {
        table.style.boxShadow = "0px 0px 7px 7px goldenrod";
		mineCounter = 0;
        clearTimer(false);
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                var cCell = document.getElementById(`${i}_${j}`);
                if (!cCell.revealed) {
                    cCell.innerText = "!!";
                }
                cCell.onclick = "";
                cCell.onmousedown = "";
                cCell.onmouseup = "";
                cCell.removeEventListener('contextmenu', contextMenuReplacer);
            }
        }
    }
}

function contextMenuReplacer(event) {
    event.preventDefault();
    flag(this);
    return false;
}

function reveal(cell) {
    if (!cell.flagged) {
        if (cell.isMine) {
            cell.innerText = "*";
            cell.classList.add("mine");
            lose();
        }
        if (!cell.revealed) {
            if (!cell.number == 0 && !cell.isMine) {
                cell.classList.add(`n${cell.number}`);
                cell.innerText = cell.number;
            }
            cell.onclick = "";
            cell.revealed = true;
            cell.classList.add("revealed");
            if (cell.classList.contains("starter")) cell.classList.remove("starter");
            peekable(cell);
            if (cell.number == 0) {
                const table = document.getElementById("table");
                const height = table.cHeight;
                const width = table.cWidth;
                const cellId = cell.id.split("_");
                const cI = cellId[0]*1;
                const cJ = cellId[1]*1;
                for (let i = 0; i < dirs.length; i++) {
                    if (isInbounds(cI+dirs[i][0], cJ+dirs[i][1], height, width)) {
                        var cCell = document.getElementById(`${cI+dirs[i][0]}_${cJ+dirs[i][1]}`);
                        if (!cCell.revealed && cCell.number != -1) reveal(cCell);
                    }
                }
            }
        }
        endCheck();
    }
}