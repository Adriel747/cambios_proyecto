const nombre = document.getElementById("addName");
const apellidoP = document.getElementById("addLastNameP");
const apellidoM = document.getElementById("addLastNameM")
const botonadd = document.getElementById("btnAdd");
const tableBody = document.querySelector("#data-table tbody");
const addForm = document.getElementById("addForm");

// Función para cargar los datos en la tabla
async function loadTableData() {
  try {
    const resp = await fetch("http://localhost:3000/posts");
    const posts = await resp.json();

    tableBody.innerHTML = "";

    posts.forEach(post => {
      const row = createRow(post);
      tableBody.appendChild(row);
    });

    addEditDeleteEventListeners();//mostrar los listener
  } catch (err) {
    console.log("error de ingreso: " + err);
  }
}

//listener boton editar y elimninar 
function addEditDeleteEventListeners() {
  const editButtons = document.querySelectorAll(".btn-edit");
  const deleteButtons = document.querySelectorAll(".btn-delete");

  editButtons.forEach(button => {
    button.addEventListener("click", () => {
      const postId = button.dataset.id;//guarda id 
      editPost(postId);
    });
  });

  deleteButtons.forEach(button => {
    button.addEventListener("click", () => {
      const postId = button.dataset.id;
      deletePost(postId);
    });
  });
}


//crear fila en tabla 
function createRow(post) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${post.name}</td>
    <td>${post.lastNameP}</td>
    <td>${post.lastNameM}</td>
    <td>
      <button class="btn-edit" data-id="${post.id}">Editar</button>
      <button class="btn-delete" data-id="${post.id}">Eliminar</button>
    </td>
  `;
  return row;
}


//editar post 
async function editPost(postId) {
  try {
    const resp = await fetch(`http://localhost:3000/posts/${postId}`);
    const post = await resp.json();

    const name = prompt("Ingrese el nuevo nombre:", post.name);
    const lastNameP = prompt("Ingrese el nuevo apellidoP:", post.lastNameP);
    const lastNameM =prompt ("ingrese apellidoM:",post.lastNameM);

    if (name && lastNameP) {
      const updatedPost = {
        id: postId,
        name: name,
        lastNameP: lastNameP,
        lastNameM:lastNameM
      };

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const myInit = {
        method: "PUT",
        body: JSON.stringify(updatedPost),
        headers: myHeaders
      };

      const updateResp = await fetch(`http://localhost:3000/posts/${postId}`, myInit);

      if (updateResp.status !== 200) {
        console.log("dato no actualizado");
        return;
      }

      console.log("El post se ha actualizado correctamente");
      loadTableData();
    }
  } catch (err) {
    console.log("Hubo un error: " + err);
  }
}

//eliminar post
async function deletePost(postId) {
  try {
    const confirmDelete = confirm(" deseas eliminar este post?");

    if (confirmDelete) {
      const myInit = {
        method: "DELETE"
      };

      const resp = await fetch(`http://localhost:3000/posts/${postId}`, myInit);

      if (resp.status !== 200) {
        console.log("No se pudo eliminar el recurso");
        return;
      }

      console.log("El post se ha eliminado correctamente");
      loadTableData();
    }
  } catch (err) {
    console.log("Hubo un error: " + err);
  }
}

//agregar post 
async function addPost() {
  const name = nombre.value;
  const lastNameP = apellidoP.value;
  const lastNameM = apellidoM.value;

  if (!name || !lastNameP || !lastNameM) {
    alert("Por favor, ingresa un nombre y  apellidos.");
    return;
  }

  try {
    const newPost = {
      name: name,
      lastNameP: lastNameP,
      lastNameM: lastNameM
    };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const myInit = {
      method: "POST",
      body: JSON.stringify(newPost),
      headers: myHeaders
    };

    const resp = await fetch("http://localhost:3000/posts", myInit);//se realiza solicitud

    if (resp.status !== 201) {
      console.log("no se creo el dato");
      return;
    }

    console.log("el post se creo correctamente");
    loadTableData();
    nombre.value = "";
    apellidoP.value = "";
    apellidoM.value = "";
  } catch (err) {
    console.log("hubo un error: " + err);
  }
}

//cargar datos
loadTableData();

//listening cargar
botonadd.addEventListener("click", e => {
  e.preventDefault();
  addPost();
});
