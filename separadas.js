import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://mmegueeiaqwsrswgmwbx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tZWd1ZWVpYXF3c3Jzd2dtd2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjIwNjUsImV4cCI6MjA2MDg5ODA2NX0.JEEKLpDoJRG87FFGNB8YP5k8F-TPCJvbqpoJQTupdcc'; // sua chave
const supabase = createClient(supabaseUrl, supabaseKey);

const enviarCurso = document.getElementById('salvarCursoBtn');
enviarCurso.addEventListener('click', async () => {
  const nome = document.getElementById('cursoNome').value;
  const descricao = document.getElementById('cursoDescricao').value;

  if (!nome.trim() || !descricao.trim()) {
    alert('Preencha todos os campos.');
    return;
  }

  const { data, error } = await supabase.from('courses').insert([
    { nome: nome, descricao: descricao }
  ]);

  if (error) {
    console.error('Erro ao adicionar curso:', error);
  } else {
    console.log('Curso adicionado:', data);
    document.getElementById('cursoModal').classList.remove('is-active');
    fetchCursos();
  }
});

const tabelaCursos = document.getElementById('tabelaCursos');
const salvarVideoBtn = document.querySelector('#videoModal .modal-card-foot .is-success');
async function fetchVideos() {
const { data, error } = await supabase
.from('videos')
.select('id, titulo, url, descricao, curso_id');

if (error) {
console.error('Erro ao buscar vídeos:', error);
return;
}

const tabela = document.getElementById('tabelaVideos');
tabela.innerHTML = '';
const listaSemCurso = document.getElementById('listaVideosSemCurso');
listaSemCurso.innerHTML = ''; // Limpa a lista de vídeos sem curso

data.forEach(video => {
const tr = document.createElement('tr');
tr.innerHTML = `
  <td>${video.id}</td>
  <td>${video.titulo}</td>
  <td>${video.curso_id === 0 ? '' : video.curso_id}</td>
  <td><a href="${video.url}" target="_blank">Ver</a></td>
  <td>
    <button class="button is-small is-info" onclick="editarVideo(${video.id})">Editar</button>
    <button class="button is-small is-danger" onclick="excluirVideo(${video.id})">Excluir</button>
  </td>
`;
tabela.appendChild(tr);

// Adiciona à lista de vídeos sem curso
if (video.curso_id === 0) {
  const li = document.createElement('li');
  li.textContent = `${video.titulo} (ID: ${video.id})`;
  listaSemCurso.appendChild(li);
}
});
}
async function carregarCursosNoSelect() {
const { data, error } = await supabase.from('courses').select('id, nome');

if (error) {
console.error('Erro ao carregar cursos:', error);
return;
}

const select = document.getElementById('cursoSelect');
select.innerHTML = '<option value="">-- Nenhum curso --</option>';

data.forEach(curso => {
const option = document.createElement('option');
option.value = curso.id;
option.textContent = curso.nome;
select.appendChild(option);
});
}



salvarVideoBtn.addEventListener('click', async () => {
  const titulo = document.getElementById('videoTitulo').value;
  const link = document.getElementById('videoLink').value;
  const descricao = document.getElementById('videoDescricao').value;
  const cursoId = document.getElementById('cursoSelect').value || null;

  if (!titulo.trim() || !link.trim()) {
    alert('Título e link são obrigatórios.');
    return;
  }

  const { data, error } = await supabase.from('videos').insert([{
    titulo,
    descricao,
    url:link,
    curso_id: cursoId ? parseInt(cursoId) : 0
  }]);

  if (error) {
    console.error('Erro ao adicionar vídeo:', error);
    alert('Erro ao adicionar vídeo.');
  } else {
    console.log('Vídeo adicionado:', data);
    document.getElementById('videoModal').classList.remove('is-active');
    fetchVideos(); // você vai criar essa função logo abaixo
  }
});
async function fetchCursos() {
const { data, error } = await supabase.from('courses').select('id, nome, descricao');

if (error) {
console.error('Erro ao buscar cursos:', error);
return;
}

tabelaCursos.innerHTML = '';  // Limpa a tabela antes de adicionar novos cursos

data.forEach(curso => {
const tr = document.createElement('tr');
tr.innerHTML = `
  <td>${curso.id}</td>
  <td>${curso.nome}</td>
  <td>
    <button class="button is-small is-info" onclick="editarCurso(${curso.id})">Editar</button>
    <button class="button is-small is-danger" onclick="excluirCurso(${curso.id})">Excluir</button>
  </td>
`;
tabelaCursos.appendChild(tr);
});
}

async function excluirCurso(cursoId) {
const { data, error } = await supabase.from('courses').delete().eq('id', cursoId);
if (error) {
console.error('Erro ao excluir curso:', error);
} else {
console.log('Curso excluído:', data);
fetchCursos();  // Atualiza a lista de cursos
}
}

async function editarVideo(videoId) {
const { data, error } = await supabase.from('videos').select('*').eq('id', videoId).single();

if (error) {
console.error('Erro ao carregar vídeo para edição:', error);
return;
}

// Preencher o formulário de edição
document.getElementById('editTitulo').value = data.titulo;
document.getElementById('editLink').value = data.url;
document.getElementById('editDescricao').value = data.descricao;

// Se o vídeo tiver curso associado, preencher o select do curso
const editCursoSelect = document.getElementById('editCursoSelect');
const { data: cursos, error: cursosError } = await supabase.from('courses').select('*');

if (cursosError) {
console.error('Erro ao carregar cursos para edição:', cursosError);
return;
}

editCursoSelect.innerHTML = '<option value="">-- Nenhum curso --</option>';
cursos.forEach(curso => {
const option = document.createElement('option');
option.value = curso.id;
option.textContent = curso.nome;
if (curso.id === data.curso_id) {
  option.selected = true;
}
editCursoSelect.appendChild(option);
});

// Mostrar a modal de edição
document.getElementById('editarVideoModal').classList.add('is-active');
}
document.querySelector('#editarVideoModal .modal-card-foot .is-success').addEventListener('click', async () => {
const titulo = document.getElementById('editTitulo').value;
const link = document.getElementById('editLink').value;
const descricao = document.getElementById('editDescricao').value;
const cursoId = document.getElementById('editCursoSelect').value || null;
if (!titulo.trim() || !link.trim()) {
alert('Título e link são obrigatórios.');
return;
}

const { data, error } = await supabase.from('videos').update({
titulo,
descricao,
url: link,
curso_id: cursoId ? parseInt(cursoId) : null
}).eq('id', videoId);

if (error) {
console.error('Erro ao editar vídeo:', error);
} else {
console.log('Vídeo editado:', data);
document.getElementById('editarVideoModal').classList.remove('is-active');
fetchVideos();  // Atualiza a lista de vídeos
}
});
document.addEventListener('DOMContentLoaded', () => {
fetchCursos();
fetchVideos();
});

async function salvarEdicaoCurso(cursoId) {
const nome = document.getElementById('nomeCurso').value;
const descricao = document.getElementById('descricaoCurso').value;

try {
const { error } = await supabase
  .from('cursos')
  .update({ nome, descricao })
  .eq('id', cursoId);

if (error) throw error;

// Fechar o modal
const modal = document.getElementById('editarCursoModal');
modal.classList.remove('is-active');

// Atualizar a lista de cursos
fetchCursos();

alert('Curso editado com sucesso!');
} catch (error) {
console.error('Erro ao salvar edições do curso:', error);
}
}
async function preencherSelectVideos() {
try {
const { data, error } = await supabase
  .from('videos')
  .select('*');

if (error) throw error;

const select = document.getElementById('videoInicialSelect');
data.forEach(video => {
  const option = document.createElement('option');
  option.value = video.id;
  option.textContent = video.titulo;
  select.appendChild(option);
});
} catch (error) {
console.error('Erro ao preencher vídeos:', error);
}
}
async function excluirVideo(videoId) {
const confirmacao = confirm('Tem certeza que deseja excluir este vídeo?');
if (!confirmacao) return;

try {
const { error } = await supabase
  .from('videos')
  .delete()
  .eq('id', videoId);

if (error) throw error;

// Atualizar a lista de vídeos
fetchVideos();
alert('Vídeo excluído com sucesso!');
} catch (error) {
console.error('Erro ao excluir vídeo:', error);
}
}
document.addEventListener('DOMContentLoaded', () => {
fetchCursos();
fetchVideos();
carregarCursosNoSelect(); // Já estava aqui
preencherSelectVideos(); // Adicione esta linha
});
document.addEventListener('DOMContentLoaded', () => {
// ... (seu código existente do DOMContentLoaded) ...

// Abrir modal de edição de curso
const editarCursoModal = document.getElementById('editarCursoModal');
if (editarCursoModal) {
const closeEditarCursoModal = editarCursoModal.querySelector('.delete');
const cancelEditarCursoModal = editarCursoModal.querySelector('#cancelEditarCursoModal');

if (closeEditarCursoModal) {
  closeEditarCursoModal.addEventListener('click', () => editarCursoModal.classList.remove('is-active'));
}
if (cancelEditarCursoModal) {
  cancelEditarCursoModal.addEventListener('click', () => editarCursoModal.classList.remove('is-active'));
}
}
});

async function editarCurso(cursoId) {
try {
const { data, error } = await supabase
  .from('courses')
  .select('*')
  .eq('id', cursoId)
  .single();

if (error) throw error;

// Preencher os campos do modal (assumindo que esses IDs existem no seu HTML)
document.getElementById('nomeCurso').value = data.nome;
document.getElementById('descricaoCurso').value = data.descricao;

// Exibir o modal
const modal = document.getElementById('editarCursoModal');
if (modal) {
  modal.classList.add('is-active');
}

// Salvar as edições ao clicar no botão (assumindo que este ID existe no seu HTML)
const salvarEdicaoCursoBtn = document.getElementById('salvarEdicaoCurso');
if (salvarEdicaoCursoBtn) {
  salvarEdicaoCursoBtn.onclick = () => salvarEdicaoCurso(cursoId);
}

} catch (error) {
console.error('Erro ao editar curso:', error);
}
}

async function salvarEdicaoCurso(cursoId) {
const nome = document.getElementById('nomeCurso').value;
const descricao = document.getElementById('descricaoCurso').value;

try {
const { error } = await supabase
  .from('courses')
  .update({ nome, descricao })
  .eq('id', cursoId);

if (error) throw error;

// Fechar o modal
const modal = document.getElementById('editarCursoModal');
if (modal) {
  modal.classList.remove('is-active');
}

// Atualizar a lista de cursos
fetchCursos();

alert('Curso editado com sucesso!');
} catch (error) {
console.error('Erro ao salvar edições do curso:', error);
}
}
// Chama a função para carregar cursos ao inicializar
fetchCursos();
fetchVideos(); // Chama a função para carregar vídeos ao inicializar
carregarCursosNoSelect(); // Carrega cursos no select do modal de vídeo 
