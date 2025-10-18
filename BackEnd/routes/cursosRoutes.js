// routes/cursosRoutes.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { autenticar, apenasAdmins } = require('../authMiddleware');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ROTAS PARA CURSOS ---
router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('courses').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
});

router.get('/:id', autenticar, apenasAdmins, async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('courses').select('*').eq('id_course', id).single();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ message: 'Curso não encontrado.' });
    res.status(200).json(data);
});

router.post('/', autenticar, apenasAdmins, async (req, res) => {
    const { nome, descricao } = req.body;
    const { data, error } = await supabase.from('courses').insert([{ nome, descricao }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

router.put('/:id', autenticar, apenasAdmins, async (req, res) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    const { data, error } = await supabase.from('courses').update({ nome, descricao, updated_at: new Date() }).eq('id_course', id).select();
    if (error) return res.status(500).json({ error: `Erro do Supabase: ${error.message}` });
    if (!data || data.length === 0) return res.status(404).json({ message: `Curso com ID ${id} não foi encontrado.` });
    res.status(200).json(data[0]);
});

router.delete('/:id', autenticar, apenasAdmins, async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('courses').delete().eq('id_course', id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ message: 'Curso apagado com sucesso!' });
});

module.exports = router;
