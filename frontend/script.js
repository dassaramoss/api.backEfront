const API_URL = "http://localhost:3000";

// Elementos do DOM
const alunoList = document.getElementById("alunoList");
const alunoForm = document.getElementById("alunoForm");
const alunoIdInput = document.getElementById("alunoId");
const nomeInput = document.getElementById("nome");
const idadeInput = document.getElementById("idade");
const cursoInput = document.getElementById("curso");

const buscarIdInput = document.getElementById("buscarId");
const btnBuscar = document.getElementById("btnBuscar");
const alunoEncontradoList = document.getElementById("alunoEncontrado");
const cancelEditBtn = document.getElementById("cancelEdit");

// ------------------------ FUNÇÕES ------------------------

// Mostrar/ocultar formulário de edição
function showForm() { alunoForm.style.display = "block"; }
function hideForm() { alunoForm.style.display = "none"; alunoForm.reset(); }

// Listar todos os alunos
async function fetchAlunos() {
  alunoList.innerHTML = "";
  try {
    const res = await fetch(`${API_URL}/alunos`);
    const alunos = await res.json();

    alunos.forEach((aluno) => {
      const li = document.createElement("li");
      li.textContent = `${aluno.nome} - ${aluno.idade} anos - ${aluno.curso}`;

      const editBtn = document.createElement("button");
      editBtn.textContent = "Editar";
      editBtn.onclick = () => editAluno(aluno, li);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Deletar";
      deleteBtn.onclick = () => deleteAluno(aluno.id);

      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      alunoList.appendChild(li);
    });
  } catch (err) {
    console.error("Erro ao buscar alunos:", err);
  }
}

// Buscar aluno por ID
async function buscarAlunoPorId() {
  const id = buscarIdInput.value;
  alunoEncontradoList.innerHTML = "";

  if (!id) {
    alert("Digite um ID válido");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/alunos/${id}`);
    if (!res.ok) {
      const errorData = await res.json();
      alert(`Erro: ${errorData.erro}`);
      return;
    }

    const aluno = await res.json();

    const li = document.createElement("li");
    li.textContent = `${aluno.nome} - ${aluno.idade} anos - ${aluno.curso}`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.onclick = () => editAluno(aluno, li);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Deletar";
    deleteBtn.onclick = () => deleteAluno(aluno.id);

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    alunoEncontradoList.appendChild(li);

  } catch (err) {
    console.error("Erro ao buscar aluno:", err);
  }
}

// Preencher formulário para editar aluno
function editAluno(aluno, liElement) {
  alunoIdInput.value = aluno.id;
  nomeInput.value = aluno.nome;
  idadeInput.value = aluno.idade;
  cursoInput.value = aluno.curso;

  showForm();

  // Destaca visualmente o aluno sendo editado
  document.querySelectorAll("li").forEach(li => li.style.backgroundColor = "");
  if (liElement) liElement.style.backgroundColor = "#e0f7fa";

  // Scroll suave até o formulário
  alunoForm.scrollIntoView({ behavior: "smooth" });
}

// Atualizar aluno
alunoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = alunoIdInput.value;
  const nome = nomeInput.value;
  const idade = idadeInput.value;
  const curso = cursoInput.value;

  try {
    const res = await fetch(`${API_URL}/alunos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, idade: Number(idade), curso }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(`Erro: ${errorData.erro}`);
      return;
    }

    alert("Aluno atualizado com sucesso!");
    hideForm();
    fetchAlunos();
    buscarAlunoPorId();
  } catch (err) {
    console.error("Erro ao atualizar aluno:", err);
  }
});

// Cancelar edição
cancelEditBtn.addEventListener("click", hideForm);

// Deletar aluno
async function deleteAluno(id) {
  if (!confirm("Deseja realmente deletar este aluno?")) return;

  try {
    const res = await fetch(`${API_URL}/alunos/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const errorData = await res.json();
      alert(`Erro: ${errorData.erro}`);
      return;
    }

    alert("Aluno deletado com sucesso!");
    fetchAlunos();
    buscarAlunoPorId();
    hideForm();
  } catch (err) {
    console.error("Erro ao deletar aluno:", err);
  }
}

// ------------------------ EVENTOS ------------------------
btnBuscar.addEventListener("click", buscarAlunoPorId);

// Carregar lista inicial de alunos
fetchAlunos();