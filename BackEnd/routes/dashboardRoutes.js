// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { autenticar, apenasAdmins } = require('../authMiddleware');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- ROTA PARA O DASHBOARD ---
router.get('/stats', autenticar, apenasAdmins, async (req, res) => {
    try {
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

        if (erroUsers || erroVideos || erroMateriais || erroUltimosVideos || erroUltimosMateriais) {
            console.error('Erro ao buscar estatísticas:', { erroUsers, erroVideos, erroMateriais, erroUltimosVideos, erroUltimosMateriais });
            throw new Error('Ocorreu um erro ao buscar os dados do dashboard.');
        }

        const logs = [
            ...ultimosVideos.map(v => ({ tipo: 'Vídeo', nome: v.titulo, data: v.created_at })),
            ...ultimosMateriais.map(m => ({ tipo: 'Material', nome: m.nome, data: m.created_at }))
        ];

        logs.sort((a, b) => new Date(b.data) - new Date(a.data));
        const ultimosLogs = logs.slice(0, 5);

        res.status(200).json({ totalUsuarios, totalVideos, totalMateriais, ultimosLogs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
