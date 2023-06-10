const userName = "abcd"; //defining login details
const userPass = 1234;

localStorage.setItem("userName", userName); // saving login details in localStorage
localStorage.setItem("userPass", userPass);

function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let localName = localStorage.getItem("userName");
  let localPass = localStorage.getItem("userPass");

  //validating login details
  if (username == localName && password == localPass) {
    alert("login successful");
    window.location.href = "difficulty.html";
  } else {
    let loginDiv = document.getElementById("login-inner");
    let err = document.createElement("h5");
    err.innerHTML = "Please make sure both of your login details are correct!";
    err.setAttribute("id", "err");
    if (document.getElementById("err") != null) {
      remove();
    }
    err.style.color = "red";
    err.style.marginBottom = "0";
    err.style.paddingBottom = "0";
    loginDiv.appendChild(err);
  }
}

function createTable(tableData) {
  //creating the table
  const finishBtn = document.getElementById("finish-btn"); //saving elements and resetting them every click
  finishBtn.style.display = "none";
  const againBtn = document.getElementById("again-btn");
  finishBtn.style.display = "none";
  const solveBtn = document.getElementById("solve-btn");
  finishBtn.style.display = "none";
  const oldTable = document.querySelector("table");
  if (oldTable !== null) {
    oldTable.remove();
  }
  //removing the err message if the user change diffs
  const oldErr = document.getElementById("sudErr");
  if (oldErr != null) {
    oldErr.remove();
  }

  //create a sudoku table
  let table = document.createElement("table");
  let tableBody = document.createElement("tbody");

  //creating table rows
  tableData.forEach(function (rowData) {
    let row = document.createElement("tr");
    //creating table cells
    rowData.forEach(function (cellData) {
      let cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });
  let diffDiv = document.getElementById("btnDiv");
  table.setAttribute("id", "gameTable");
  table.style.marginTop = "20px";
  table.style.marginBottom = "0";
  table.appendChild(tableBody);
  diffDiv.appendChild(table);

  finishBtn.style.display = "inline"; //giving the buttons display inline
  againBtn.style.display = "inline";
  solveBtn.style.display = "inline";
  //converting empty cells to inputs type number
  const tds = document.querySelectorAll("td");
  tds.forEach(function (td) {
    if (td.innerHTML === "") {
      //converting empty 'tds' to inputs
      let input = document.createElement("input");
      input.setAttribute("type", "number");
      input.setAttribute("maxlength", "1");
      input.setAttribute("min", "1");
      input.setAttribute(
        "oninput",
        "limitInputLength(this, 1);" // Assign the function name as a string
      );

      input.setAttribute("class", "user-inputs");
      td.innerHTML = "";
      td.appendChild(input);
    }
  });
}

function limitInputLength(input, maxLength) {
  // Remove non-digit characters from the input value
  input.value = input.value.replace(/\D/g, "");

  // Get the numeric value from the input
  let number = parseInt(input.value);

  // Check if the number is within the range of 1 to 9
  if (isNaN(number) || number < 1 || number > 9) {
    if (input.value.length > 1) {
      // Remove the last character if it is not within the range
      input.value = input.value.slice(0, -1);
    } else {
      // Clear the input value if it doesn't contain a valid number
      input.value = "";
    }
  } else if (input.value.length > maxLength) {
    // Truncate the input value if it exceeds the maximum length
    input.value = input.value.slice(0, maxLength);
  }
}

function createTableSolved(tableData) {
  //showing the solution
  let table = document.createElement("table");
  let tableBody = document.createElement("tbody");

  tableData.forEach(function (rowData) {
    let row = document.createElement("tr");

    rowData.forEach(function (cellData) {
      let cell = document.createElement("td");
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });
  gameTable.remove(); //making sure the previous table is removed
  let err = document.getElementById("sudErr");
  if (err != null) {
    err.remove();
  }
  let diffDiv = document.getElementById("btnDiv");
  table.style.marginTop = "20px";
  table.style.marginBottom = "0";
  table.appendChild(tableBody);
  diffDiv.appendChild(table);
}

function emptyTheCells(array, cellsToRemove) {
  //randomly resetting cells
  let emptyCells = 0;
  //starting with 0 empty cells, resetting depending on difficulty
  while (emptyCells < cellsToRemove) {
    // Generate random row and column index
    const row = Math.floor(Math.random() * array.length);
    const col = Math.floor(Math.random() * array[0].length);

    if (array[row][col] !== "") {
      array[row][col] = "";
      emptyCells++;
    }
  }
  return array; //returning the generated array
}

function finish() {
  //User validation if he is right
  const table = document.querySelector("table");
  let array = [];
  const index = localStorage.getItem("index");

  for (let i = 0; i < table.rows.length; i++) {
    //a loop to convert the table with inputs back to a 2d array
    let row = [];
    for (let j = 0; j < table.rows[i].cells.length; j++) {
      let cell = table.rows[i].cells[j];
      let input = cell.querySelector("input[type='number']");
      if (input) {
        row.push(input.value);
      } else {
        row.push(cell.innerHTML);
      }
    }
    array.push(row);
  }
  //starting with a true flag, check if user is right
  let flag = true;

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (parseInt(array[i][j]) != grids[index][i][j]) {
        //comparing the converted array to the original array we passed
        flag = false;
        // alert("you are wrong, please try again.");
        let err = document.createElement("h4");
        err.setAttribute("id", "sudErr");
        err.style.color = "red";
        err.innerHTML =
          "Please check your answers and make sure you followed the rules!";
        let diffDiv = document.getElementById("btnDiv");
        if (document.getElementById("sudErr") != null) {
          remove();
        }
        diffDiv.appendChild(err);
        return;
      }
    }
  }
  if (flag) {
    alert("You did a great job! Consider playing in a different difficulty");
    location.reload();
  }
}

function again() {
  // Get the table
  let table = document.getElementById("gameTable");
  // Loop through all rows and cells
  for (let i = 0, row; (row = table.rows[i]); i++) {
    for (let j = 0, cell; (cell = row.cells[j]); j++) {
      // Check if the cell contains an input tag
      let input = cell.getElementsByTagName("input");
      if (input.length > 0) {
        // Remove the existing input element
        cell.removeChild(input[0]);
        // Create a new input element
        let newInput = document.createElement("input");
        newInput.setAttribute("type", "number");
        newInput.setAttribute("maxlength", "1");
        newInput.setAttribute("min", "1");
        newInput.setAttribute(
          "oninput", //allowing only 1 character to be entered
          "javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)"
        );
        newInput.setAttribute("class", "form-control");
        // Add the new input element to the cell
        cell.appendChild(newInput);
      }
    }
  }
}

var grids = [
  [
    [3, 8, 7, 4, 9, 1, 6, 2, 5],
    [2, 4, 1, 5, 6, 8, 3, 7, 9],
    [5, 6, 9, 3, 2, 7, 4, 1, 8],
    [7, 5, 8, 6, 1, 9, 2, 3, 4],
    [1, 2, 3, 7, 8, 4, 5, 9, 6],
    [4, 9, 6, 2, 5, 3, 1, 8, 7],
    [9, 3, 4, 1, 7, 6, 8, 5, 2],
    [6, 7, 5, 8, 3, 2, 9, 4, 1],
    [8, 1, 2, 9, 4, 5, 7, 6, 3],
  ],
  [
    [1, 7, 4, 9, 6, 2, 8, 5, 3],
    [9, 3, 8, 7, 5, 4, 6, 2, 1],
    [6, 5, 2, 8, 3, 1, 9, 4, 7],
    [8, 9, 5, 6, 7, 3, 4, 1, 2],
    [7, 6, 1, 4, 2, 9, 5, 3, 8],
    [4, 2, 3, 5, 1, 8, 7, 9, 6],
    [5, 1, 7, 3, 4, 6, 2, 8, 9],
    [3, 8, 6, 2, 9, 5, 1, 7, 4],
    [2, 4, 9, 1, 8, 7, 3, 6, 5],
  ],
  [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ],
];

function createEasyGame() {
  const index = Math.floor(Math.random() * grids.length); //generate a random index to select one of the grids
  localStorage.setItem("index", index); //save it in local storage
  var randomMatrix = grids[index];

  let passedGrid = JSON.parse(JSON.stringify(randomMatrix)); //copy the grid
  createTable(emptyTheCells(passedGrid, 25)); //pass the copied grid with the number of cells to reset
}
function createNormalGame() {
  const index = Math.floor(Math.random() * grids.length);
  localStorage.setItem("index", index);
  var randomMatrix = grids[index];
  let passedGrid = JSON.parse(JSON.stringify(randomMatrix));
  createTable(emptyTheCells(passedGrid, 40));
}
function createHardGame() {
  const index = Math.floor(Math.random() * grids.length);
  localStorage.setItem("index", index);
  var randomMatrix = grids[index];
  let passedGrid = JSON.parse(JSON.stringify(randomMatrix));
  createTable(emptyTheCells(passedGrid, 55));
}
function createSolve() {
  const index = localStorage.getItem("index");
  createTableSolved(grids[index]); //passing the current grid so it solves the right one
}
