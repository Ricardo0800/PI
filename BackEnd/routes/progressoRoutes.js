// routes/progressoRoutes.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { autenticar } = require('../authMiddleware');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ROTA PARA O PROGRESSO DO CLIENTE ---
router.post('/', autenticar, async (req, res) => {
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

module.exports = router;
