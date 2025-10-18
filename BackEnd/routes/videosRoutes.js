// routes/videosRoutes.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { autenticar, apenasAdmins } = require('../authMiddleware');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ROTAS PARA VÍDEOS ---
router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('videos').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

router.get('/curso/:curso_id', async (req, res) => {
    const { curso_id } = req.params;
    const { data, error } = await supabase.from('videos').select('*').eq('curso_id', curso_id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
});

router.get('/:id', autenticar, apenasAdmins, async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('videos').select('*').eq('id', id).single();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ message: 'Vídeo não encontrado.' });
    res.status(200).json(data);
});

router.post('/', autenticar, apenasAdmins, async (req, res) => {
    const { titulo, descricao, url, curso_id } = req.body;
    const { data, error } = await supabase.from('videos').insert([{ titulo, descricao, url, curso_id }]).select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
});

router.put('/:id', autenticar, apenasAdmins, async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, url, curso_id } = req.body;
    const { data, error } = await supabase.from('videos').update({ titulo, descricao, url, curso_id, updated_at: new Date() }).eq('id', id).select();
    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ message: 'Vídeo não encontrado para atualização.' });
    res.status(200).json(data[0]);
});

router.delete('/:id', autenticar, apenasAdmins, async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('videos').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json({ message: 'Vídeo apagado com sucesso!' });
});

module.exports = router;
