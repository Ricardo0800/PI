require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const { autenticar, apenasAdmins } = require("./authMiddleware");

const app = express();
const port = 3000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseKey) {
    console.error("ERRO CRÍTICO: Variáveis de ambiente do Supabase não carregadas.");
    process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Servidor do Projeto Integrado está a funcionar!"));

// Importar e usar as rotas modularizadas
const cursosRoutes = require("./routes/cursosRoutes");
const videosRoutes = require("./routes/videosRoutes");
const materiaisRoutes = require("./routes/materiaisRoutes");
const usersRoutes = require("./routes/usersRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const progressoRoutes = require("./routes/progressoRoutes");

app.use("/api/cursos", cursosRoutes);
app.use("/api/videos", videosRoutes);
app.use("/api/materiais", materiaisRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/progresso", progressoRoutes);

// Rota para autenticação de sessão (não modularizada, pois é única e específica)
app.get("/api/auth/session", autenticar, async (req, res, next) => {
    try {
        const { data: perfil, error } = await supabase
            .from("Users")
            .select("id, name, email, id_categoria")
            .eq("auth_user_id", req.user.id)
            .single();

        if (error) throw error;
        if (!perfil) {
            return res.status(404).json({ message: "Perfil de utilizador não encontrado." });
        }
        res.status(200).json(perfil);
    } catch (error) {
        next(error);
    }
});

// --- ROTAS PARA O FRONTEND DO CLIENTE (ainda no server.js, pois dependem de lógica de progresso)

// GET: Obter a lista de cursos com o progresso do utilizador já calculado
app.get("/api/biblioteca/cursos", autenticar, async (req, res, next) => {
    try {
        const userId = req.user.id;
        let { data: cursos, error: cursosError } = await supabase.from("courses").select("*");
        if (cursosError) throw cursosError;

        const { data: videos, error: videosError } = await supabase.from("videos").select("id, curso_id");
        if (videosError) throw videosError;

        const { data: progresso, error: progressoError } = await supabase.from("progresso_usuario").select("video_id, assistido").eq("user_id", userId);
        if (progressoError) throw progressoError;

        const videosAssistidos = new Set(progresso.filter(p => p.assistido).map(p => p.video_id));

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
        next(error);
    }
});

// GET: Obter todos os vídeos de um curso e o status de \'assistido\' para o utilizador
app.get("/api/biblioteca/curso/:cursoId/videos", autenticar, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { cursoId } = req.params;

        const { data: videos, error: videosError } = await supabase.from("videos").select("*").eq("curso_id", cursoId);
        if (videosError) throw videosError;

        const videoIds = videos.map(v => v.id);
        const { data: progresso, error: progressoError } = await supabase.from("progresso_usuario").select("video_id, assistido").eq("user_id", userId).in("video_id", videoIds);
        if (progressoError) throw progressoError;

        const videosAssistidos = new Set(progresso.filter(p => p.assistido).map(p => p.video_id));

        const videosComProgresso = videos.map(v => ({ ...v, assistido: videosAssistidos.has(v.id) }));

        res.status(200).json(videosComProgresso);
    } catch (error) {
        next(error);
    }
});

// Middleware de tratamento de erros global (coloque no final do server.js, antes do app.listen)
app.use((err, req, res, next) => {
    console.error(err.stack); // Registra o erro completo no console do servidor
    res.status(500).json({ error: "Ocorreu um erro interno no servidor. Tente novamente mais tarde." });
});

// --- INICIAR O SERVIDOR ---
app.listen(port, () => {
    console.log(`Servidor completo e CORRIGIDO a postos em http://localhost:${port}`);
});


