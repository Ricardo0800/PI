// backend/server.js - VERSÃO FINAL CORRIGIDA

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { autenticar, apenasAdmins } = require('./authMiddleware');

const app = express();
const port = 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseKey) {
    console.error('ERRO CRÍTICO: Variáveis de ambiente do Supabase não carregadas.');
    process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Servidor do Projeto Integrado está a funcionar!'));

// --- ROTAS PARA CURSOS ---
app.get('/api/cursos', async (req, res) => { const { data, error } = await supabase.from('courses').select('*'); if (error) return res.status(500).json({ error: error.message }); res.status(200).json(data); });
app.get('/api/cursos/:id', autenticar, apenasAdmins, async (req, res) => { const { id } = req.params; const { data, error } = await supabase.from('courses').select('*').eq('id_course', id).single(); if (error) return res.status(500).json({ error: error.message }); if (!data) return res.status(404).json({ message: 'Curso não encontrado.' }); res.status(200).json(data); });
app.post('/api/cursos', autenticar, apenasAdmins, async (req, res) => { const { nome, descricao } = req.body; const { data, error } = await supabase.from('courses').insert([{ nome, descricao }]).select(); if (error) return res.status(500).json({ error: error.message }); res.status(201).json(data[0]); });
app.put('/api/cursos/:id', autenticar, apenasAdmins, async (req, res) => { const { id } = req.params; const { nome, descricao } = req.body; const { data, error } = await supabase.from('courses').update({ nome, descricao, updated_at: new Date() }).eq('id_course', id).select(); if (error) return res.status(500).json({ error: `Erro do Supabase: ${error.message}` }); if (!data || data.length === 0) return res.status(404).json({ message: `Curso com ID ${id} não foi encontrado.` }); res.status(200).json(data[0]); });
app.delete('/api/cursos/:id', autenticar, apenasAdmins, async (req, res) => { const { id } = req.params; const { error } = await supabase.from('courses').delete().eq('id_course', id); if (error) return res.status(500).json({ error: error.message }); res.status(200).json({ message: 'Curso apagado com sucesso!' }); });

// --- ROTAS PARA VÍDEOS ---
app.get('/api/videos', async (req, res) => { const { data, error } = await supabase.from('videos').select('*'); if (error) return res.status(500).json({ error: error.message }); return res.status(200).json(data); });
app.get('/api/videos/curso/:curso_id', async (req, res) => { const { curso_id } = req.params; const { data, error } = await supabase.from('videos').select('*').eq('curso_id', curso_id); if (error) return res.status(500).json({ error: error.message }); return res.status(200).json(data); });
app.get('/api/videos/:id', autenticar, apenasAdmins, async (req, res) => { const { id } = req.params; const { data, error } = await supabase.from('videos').select('*').eq('id', id).single(); if (error) return res.status(500).json({ error: error.message }); if (!data) return res.status(404).json({ message: 'Vídeo não encontrado.' }); res.status(200).json(data); });
app.post('/api/videos', autenticar, apenasAdmins, async (req, res) => { const { titulo, descricao, url, curso_id } = req.body; const { data, error } = await supabase.from('videos').insert([{ titulo, descricao, url, curso_id }]).select(); if (error) return res.status(500).json({ error: error.message }); return res.status(201).json(data[0]); });
app.put('/api/videos/:id', autenticar, apenasAdmins, async (req, res) => { const { id } = req.params; const { titulo, descricao, url, curso_id } = req.body; const { data, error } = await supabase.from('videos').update({ titulo, descricao, url, curso_id, updated_at: new Date() }).eq('id', id).select(); if (error) return res.status(500).json({ error: error.message }); if (!data || data.length === 0) return res.status(404).json({ message: 'Vídeo não encontrado para atualização.' }); res.status(200).json(data[0]); });
app.delete('/api/videos/:id', autenticar, apenasAdmins, async (req, res) => { const { id } = req.params; const { error } = await supabase.from('videos').delete().eq('id', id); if (error) return res.status(500).json({ error: error.message }); res.status(200).json({ message: 'Vídeo apagado com sucesso!' }); });

// --- INICIAR O SERVIDOR ---
app.listen(port, () => {
    console.log(`Servidor completo e CORRIGIDO a postos em http://localhost:${port}`);
});

// Adicione estas novas rotas no seu server.js
app.get('/api/auth/session', autenticar, async (req, res) => {
    // Se o pedido chegou aqui, o middleware 'autenticar' já confirmou que o token é válido.
    // Agora, vamos buscar o perfil correspondente na nossa tabela 'Users'.
    const { data: perfil, error } = await supabase
        .from('Users')
        .select('id, name, email, id_categoria') // Selecionamos apenas os dados seguros
        .eq('auth_user_id', req.user.id) // req.user foi adicionado pelo middleware 'autenticar'
        .single();

    if (error || !perfil) {
        // Se não houver perfil, recusa o acesso
        return res.status(404).json({ message: 'Perfil de utilizador não encontrado.' });
    }

    // Se encontrou, devolve os dados do perfil para o frontend
    res.status(200).json(perfil);
});
// --- ROTAS PARA MATERIAIS (Materiais) ---

// GET: Obter todos os materiais (público)
app.get('/api/materiais',autenticar, async (req, res) => {
    const { data, error } = await supabase.from('Materiais').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
});

// POST: Criar um novo material (protegido)
app.post('/api/materiais', autenticar, apenasAdmins, async (req, res) => {
    const { nome, link } = req.body;
    const { data, error } = await supabase.from('Materiais').insert([{ nome, link }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

// PUT: Atualizar um material (protegido)
app.put('/api/materiais/:id', autenticar, apenasAdmins, async (req, res) => {
    const { id } = req.params;
    const { nome, link } = req.body;
    const { data, error } = await supabase.from('Materiais').update({ nome, link }).eq('id', id).select();
    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ message: `Material com ID ${id} não foi encontrado.` });
    res.status(200).json(data[0]);
});

// DELETE: Apagar um material (protegido)
app.delete('/api/materiais/:id', autenticar, apenasAdmins, async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('Materiais').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ message: 'Material apagado com sucesso!' });
});


// Adicione estas novas rotas no seu server.js

// --- ROTAS PARA UTILIZADORES (Users) ---

// GET: Obter todos os utilizadores e as suas categorias (protegido)
// Substitua APENAS esta rota no seu server.js

// GET: Obter todos os utilizadores e as suas categorias (protegido)
app.get('/api/users', autenticar, apenasAdmins, async (req, res) => {
    const { data, error } = await supabase
        .from('Users')
        .select(`
            id,
            auth_user_id, 
            name,
            email,
            created_at,
            categorias ( id_categoria, nome ) 
        `);
        
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
});
// PUT: Atualizar a categoria de um utilizador (protegido)
app.put('/api/users/:id/categoria', autenticar, apenasAdmins, async (req, res) => {
    const { id } = req.params;
    const { id_categoria } = req.body; // O frontend vai enviar o novo ID da categoria

    const { data, error } = await supabase
        .from('Users')
        .update({ id_categoria: id_categoria, updated_at: new Date() })
        .eq('id', id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data[0]);
});

// Adicione estas duas novas rotas de super-poderes no seu server.js

// POST: Criar um novo utilizador e o seu perfil (protegido)
// Esta rota vai criar um novo utilizador no sistema de autenticação do Supabase
// e depois criar o seu perfil na nossa tabela 'Users'.
app.post('/api/users', autenticar, apenasAdmins, async (req, res) => {
    const { name, email, password, id_categoria } = req.body;

    // 1. Cria o utilizador no sistema de autenticação do Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Marca o email como confirmado automaticamente
    });

    if (authError) {
        return res.status(400).json({ error: `Erro ao criar utilizador na autenticação: ${authError.message}` });
    }

    // 2. Se a criação funcionou, insere o perfil na nossa tabela 'Users'
    const { data: profileData, error: profileError } = await supabase
        .from('Users')
        .insert({
            auth_user_id: authData.user.id, // Liga o perfil ao utilizador de autenticação
            name: name,
            email: email,
            id_categoria: id_categoria
        })
        .select();

    if (profileError) {
        // Se a criação do perfil falhar, tentamos apagar o utilizador de autenticação para não deixar lixo
        await supabase.auth.admin.deleteUser(authData.user.id);
        return res.status(500).json({ error: `Erro ao criar perfil do utilizador: ${profileError.message}` });
    }

    res.status(201).json(profileData[0]);
});


// DELETE: Apagar um utilizador completamente (do auth e da tabela Users) (protegido)
app.delete('/api/users/:id', autenticar, apenasAdmins, async (req, res) => {
    const { id } = req.params; // Este é o auth_user_id (uuid)

    // A ordem é importante: primeiro apagamos o perfil, depois a conta de autenticação
    // Se a regra 'ON DELETE CASCADE' estiver ativa na foreign key, este passo não é necessário, mas fazemo-lo por segurança
    await supabase.from('Users').delete().eq('auth_user_id', id);

    // Agora, apagamos o utilizador do sistema de autenticação do Supabase
    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) {
        return res.status(500).json({ error: `Erro ao apagar utilizador da autenticação: ${authError.message}` });
    }

    res.status(200).json({ message: 'Utilizador apagado com sucesso de todo o sistema.' });
});

// Adicione esta nova rota para o Dashboard no seu server.js

// --- ROTA PARA O DASHBOARD ---

// GET: Obter todas as estatísticas para o painel de administração (protegido)
app.get('/api/dashboard/stats', autenticar, apenasAdmins, async (req, res) => {
    try {
        // Usamos Promise.all para executar todas as consultas ao mesmo tempo,
        // o que é muito mais rápido!

        const [
            { count: totalUsuarios, error: erroUsers },
            { count: totalVideos, error: erroVideos },
            { count: totalMateriais, error: erroMateriais },
            { data: ultimosVideos, error: erroUltimosVideos },
            { data: ultimosMateriais, error: erroUltimosMateriais }
        ] = await Promise.all([
            supabase.from('Users').select('*', { count: 'exact', head: true }),
            supabase.from('videos').select('*', { count: 'exact', head: true }),
            supabase.from('Materiais').select('*', { count: 'exact', head: true }),
            supabase.from('videos').select('titulo, created_at').order('created_at', { ascending: false }).limit(3),
            supabase.from('Materiais').select('nome, created_at').order('created_at', { ascending: false }).limit(3)
        ]);

        // Verifica se alguma das consultas deu erro
        if (erroUsers || erroVideos || erroMateriais || erroUltimosVideos || erroUltimosMateriais) {
            console.error('Erro ao buscar estatísticas:', { erroUsers, erroVideos, erroMateriais, erroUltimosVideos, erroUltimosMateriais });
            throw new Error('Ocorreu um erro ao buscar os dados do dashboard.');
        }

        // Combina os logs de vídeos e materiais
        const logs = [
            ...ultimosVideos.map(v => ({ tipo: 'Vídeo', nome: v.titulo, data: v.created_at })),
            ...ultimosMateriais.map(m => ({ tipo: 'Material', nome: m.nome, data: m.created_at }))
        ];

        // Ordena os logs combinados por data, pegando os 5 mais recentes
        logs.sort((a, b) => new Date(b.data) - new Date(a.data));
        const ultimosLogs = logs.slice(0, 5);

        // Envia todos os dados numa única resposta JSON
        res.status(200).json({
            totalUsuarios,
            totalVideos,
            totalMateriais,
            ultimosLogs
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Adicione estas novas rotas no seu server.js

// --- ROTAS PARA O FRONTEND DO CLIENTE ---

// GET: Obter a lista de cursos com o progresso do utilizador já calculado
app.get('/api/biblioteca/cursos', autenticar, async (req, res) => {
    try {
        const userId = req.user.id; // ID do utilizador logado (do middleware 'autenticar')

        // 1. Busca todos os cursos
        let { data: cursos, error: cursosError } = await supabase.from('courses').select('*');
        if (cursosError) throw cursosError;

        // 2. Busca todos os vídeos e o progresso do utilizador de uma só vez
        const { data: videos, error: videosError } = await supabase.from('videos').select('id, curso_id');
        if(videosError) throw videosError;

        const { data: progresso, error: progressoError } = await supabase.from('progresso_usuario').select('video_id, assistido').eq('user_id', userId);
        if(progressoError) throw progressoError;

        const videosAssistidos = new Set(progresso.filter(p => p.assistido).map(p => p.video_id));

        // 3. Calcula o progresso para cada curso
        const cursosComProgresso = cursos.map(curso => {
            const videosDoCurso = videos.filter(v => v.curso_id === curso.id_course);
            const totalVideos = videosDoCurso.length;
            if (totalVideos === 0) {
                return { ...curso, progresso: 0 };
            }
            const videosAssistidosNoCurso = videosDoCurso.filter(v => videosAssistidos.has(v.id)).length;
            const porcentagem = Math.round((videosAssistidosNoCurso / totalVideos) * 100);
            return { ...curso, progresso: porcentagem };
        });

        res.status(200).json(cursosComProgresso);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao calcular o progresso dos cursos: ' + error.message });
    }
});

// GET: Obter todos os vídeos de um curso e o status de 'assistido' para o utilizador
app.get('/api/biblioteca/curso/:cursoId/videos', autenticar, async (req, res) => {
    try {
        const userId = req.user.id;
        const { cursoId } = req.params;

        const { data: videos, error: videosError } = await supabase.from('videos').select('*').eq('curso_id', cursoId);
        if(videosError) throw videosError;

        const videoIds = videos.map(v => v.id);
        const { data: progresso, error: progressoError } = await supabase.from('progresso_usuario').select('video_id, assistido').eq('user_id', userId).in('video_id', videoIds);
        if(progressoError) throw progressoError;
        
        const videosAssistidos = new Set(progresso.filter(p => p.assistido).map(p => p.video_id));

        const videosComProgresso = videos.map(v => ({...v, assistido: videosAssistidos.has(v.id) }));
        
        res.status(200).json(videosComProgresso);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os vídeos do curso: ' + error.message });
    }
});

// POST: Marcar um vídeo como assistido
app.post('/api/progresso', autenticar, async (req, res) => {
    try {
        const userId = req.user.id;
        const { video_id } = req.body;

        const { error } = await supabase.from('progresso_usuario').upsert({
            user_id: userId,
            video_id: video_id,
            assistido: true,
            porcentagem_assistida: 100,
            updated_at: new Date()
        });

        if (error) throw error;
        res.status(200).json({ message: 'Progresso atualizado com sucesso.' });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar o progresso: ' + error.message });
    }
});