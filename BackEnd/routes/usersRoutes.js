// routes/usersRoutes.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { autenticar, apenasAdmins } = require('../authMiddleware');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ROTAS PARA UTILIZADORES ---

// GET para listar utilizadores (sem alterações, já estava bom)
router.get('/', autenticar, apenasAdmins, async (req, res) => {
    const { data, error } = await supabase
        .from('Users')
        .select(`id, auth_user_id, name, email, created_at, categorias ( id_categoria, nome )`);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
});

// PUT para alterar categoria (sem alterações, já estava bom)
router.put('/:id/categoria', autenticar, apenasAdmins, async (req, res) => {
    const { id } = req.params;
    const { id_categoria } = req.body;
    const { data, error } = await supabase
        .from('Users')
        .update({ id_categoria: id_categoria, updated_at: new Date() })
        .eq('id', id)
        .select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data[0]);
});


// ***** A CORREÇÃO ESTÁ AQUI *****
router.post('/', autenticar, apenasAdmins, async (req, res, next) => {
    const { name, email, password, id_categoria } = req.body;
    
    try {
        // 1. Cria o utilizador na autenticação do Supabase.
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true, // Recomenda-se manter true para segurança
        });

        if (authError) {
            // Se falhar aqui, é um erro real (ex: email já existe)
            return res.status(400).json({ error: `Erro ao criar utilizador na autenticação: ${authError.message}` });
        }

        const newUserId = authData.user.id;

        // 2. CORREÇÃO: Usa 'upsert' para criar ou atualizar o perfil na tabela Users.
        // O 'upsert' evita o erro de "chave duplicada".
        const { data: profileData, error: profileError } = await supabase
            .from('Users')
            .upsert({
                auth_user_id: newUserId,
                name: name,
                email: email,
                id_categoria: id_categoria
            }, {
                onConflict: 'auth_user_id' // Informa qual coluna usar para detetar o conflito
            })
            .select()
            .single(); // Esperamos um único resultado

        if (profileError) {
            // Se o upsert falhar, é um erro grave. Desfazemos a criação do utilizador.
            console.error("Erro no upsert do perfil, a reverter a criação do utilizador auth...", profileError);
            await supabase.auth.admin.deleteUser(newUserId);
            // Retorna a mensagem de erro específica do banco de dados.
            return res.status(500).json({ error: `Erro ao criar/atualizar perfil do utilizador: ${profileError.message}` });
        }

        // 3. Se tudo correu bem, retorna o perfil criado/atualizado.
        res.status(201).json(profileData);

    } catch (error) {
        // Captura quaisquer outros erros inesperados
        next(error);
    }
});


// DELETE para apagar utilizador (sem alterações, já estava bom)
router.delete('/:id', autenticar, apenasAdmins, async (req, res) => {
    const { id } = req.params; // Este é o auth_user_id (uuid)
    
    // É mais seguro apagar o utilizador auth primeiro. Se falhar, o perfil não é apagado.
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) {
        return res.status(500).json({ error: `Erro ao apagar utilizador da autenticação: ${authError.message}` });
    }
    
    // Se o auth user foi apagado, apaga o perfil correspondente
    await supabase.from('Users').delete().eq('auth_user_id', id);

    res.status(200).json({ message: 'Utilizador apagado com sucesso de todo o sistema.' });
});

module.exports = router;
