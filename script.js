let names = JSON.parse(localStorage.getItem("names")) || [];

function loadNames() {
  const table = document.getElementById("nameList");
  table.innerHTML = "";
  names.forEach((name, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td class="drag-handle" draggable="true" data-index="${index}">${
      index + 1
    }</td>
                    <td>${name}</td>  <!-- Name is now fully copyable -->
                    <td><button class="delete-btn" onclick="deleteName(${index})">Delete</button></td>
                `;
    table.appendChild(row);
  });

  enableDragDrop();
}

function addName() {
  const nameInput = document.getElementById("nameInput");
  let name = nameInput.value.trim().toLowerCase();

  if (name === "") {
    alert("Please enter a name!");
    return;
  }

  if (names.includes(name)) {
    alert("This name is already added!");
    return;
  }

  names.push(name);
  localStorage.setItem("names", JSON.stringify(names));
  nameInput.value = "";
  loadNames();
}

function deleteName(index) {
  names.splice(index, 1);
  localStorage.setItem("names", JSON.stringify(names));
  loadNames();
}

function enableDragDrop() {
  const rows = document.querySelectorAll(".drag-handle");
  let draggingRow = null;

  rows.forEach((row) => {
    row.addEventListener("dragstart", (e) => {
      draggingRow = e.target.closest("tr");
      e.dataTransfer.setData(
        "text/plain",
        draggingRow.querySelector(".drag-handle").dataset.index
      );
    });

    row.addEventListener("dragover", (e) => {
      e.preventDefault();
      const draggingOverRow = e.target.closest("tr");
      if (draggingOverRow && draggingOverRow !== draggingRow) {
        const parent = draggingOverRow.parentNode;
        parent.insertBefore(draggingRow, draggingOverRow);
      }
    });

    row.addEventListener("drop", () => {
      const newOrder = Array.from(
        document.querySelectorAll("#nameList tr")
      ).map((row) => names[row.querySelector(".drag-handle").dataset.index]);
      names = newOrder;
      localStorage.setItem("names", JSON.stringify(names));
      loadNames();
    });
  });
}

loadNames();
