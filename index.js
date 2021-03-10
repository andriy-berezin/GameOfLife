class GameOfLife {
  constructor(area) {
    this.area = area;
  }
  start() {
    this.state = this._setState();
    this._generateArea(this.state);
  }

  nextGeneration() {
    this.state = this._setState(this.state);
    this._generateArea(this.state);
  }

  _generateArea(state) {
    let game = document.querySelector(".game");
    game.innerHTML = "";
    for (let i = 0; i < state.size; i++) {
      const cell = state.get(i);
      let cellElement = document.createElement("div");
      let cellStatus = document.createElement("input");
      cellStatus.type = "checkbox";
      cellStatus.checked = cell;
      cellStatus.id = i;
      cellElement.appendChild(cellStatus);
      cellElement.className = "cell";
      game.append(cellElement);
    }
  }

  _setState(state = null) {
    let result = new Map();
    if (state) {
      //apply life rules
      let getNeighbors = (i) => {
        let neighbors = [
          i % this.area === 0 ? Number.NaN : i - this.area - 1,
          i - this.area,
          (i + 1) % this.area === 0 ? Number.NaN : i - this.area + 1,
          i % this.area === 0 ? Number.NaN : i - 1,
          (i + 1) % this.area === 0 ? Number.NaN : i + 1,
          i % this.area === 0 ? Number.NaN : i + this.area - 1,
          i + this.area,
          (i + 1) % this.area === 0 ? Number.NaN : i + this.area + 1
        ];

        let neighborCells = neighbors
          .filter((n) => state.has(n))
          .map((c) => state.get(c));
        return neighborCells;
      };

      for (let i = 0; i < state.size; i++) {
        const cell = state.get(i);
        let newCell = cell;
        let neighbors = getNeighbors(i);
        /*Any live cell with fewer than two
        or more than three live neighbors dies.*/
        /*Any live cell with two or three live 
        neighbors lives on to the next generation*/
        if (cell) {
          let liveNeighbors = neighbors.filter((n) => n).length;
          if (liveNeighbors < 2 || liveNeighbors > 3) {
            newCell = false;
          }
        }
        /*Any dead cell with exactly three live neighbors 
        becomes a live cell.*/
        if (!cell) {
          let liveNeighbors = neighbors.filter((n) => n).length;
          if (liveNeighbors === 3) {
            newCell = true;
          }
        }
        result.set(i, newCell);
      }
    } else {
      //new random
      result = new Map();
      for (let i = 0; i < this.area * this.area; i++) {
        result.set(i, Math.random() < 0.5);
      }
    }
    return result;
  }
}

let game = new GameOfLife(8);
game.start();

let generateButton = document.querySelector(".generateButton");
generateButton.addEventListener("click", () => game.nextGeneration());
