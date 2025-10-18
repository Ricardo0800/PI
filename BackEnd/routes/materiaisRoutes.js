// routes/materiaisRoutes.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { autenticar, apenasAdmins } = require('../authMiddleware');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ROTAS PARA MATERIAIS ---
router.get('/', autenticar, async (req, res) => {
    const { data, error } = await supabase.from('Materiais').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
});

router.post('/', autenticar, apenasAdmins, async (req, res) => {
    const { nome, link } = req.body;
    const { data, error } = await supabase.from('Materiais').insert([{ nome, link }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
});

router.put('/:id', autenticar, apenasAdmins, async (req, res) => {
    const { id } = req.params;
    const { nome, link } = req.body;
    const { data, error } = await supabase.from('Materiais').update({ nome, link }).eq('id', id).select();
    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ message: `Material com ID ${id} não foi encontrado.` });
    res.status(200).json(data[0]);
});

router.delete('/:id', autenticar, apenasAdmins, async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('Materiais').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ message: 'Material apagado com sucesso!' });
});

module.exports = router;
