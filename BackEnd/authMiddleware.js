// backend/authMiddleware.js

// Importamos a instância do Supabase que vamos precisar
// (Vamos criar um ficheiro para partilhá-la no próximo passo)
const { createClient } = require('@supabase/supabase-js');

// Temos de carregar as variáveis de ambiente aqui também
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


/**
 * Middleware de autenticação principal.
 * Verifica o token JWT enviado pelo frontend.
 */
const autenticar = async (req, res, next) => {
    // 1. Pega o token do cabeçalho "Authorization"
    const authHeader = req.headers.authorization;

    // Se não houver cabeçalho ou não começar com "Bearer ", recusa o acesso.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso negado: nenhum token fornecido.' });
    }

    // Pega apenas a parte do token, ignorando "Bearer "
    const token = authHeader.split(' ')[1];

    try {
        // 2. Pede ao Supabase para verificar o token
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            // Se o Supabase disser que o token é inválido, recusa o acesso.
            return res.status(401).json({ message: 'Acesso negado: token inválido ou expirado.' });
        }

        // 3. Anexa os dados do utilizador ao pedido (req)
        // Assim, as próximas funções (as rotas) saberão quem está a fazer o pedido.
        req.user = user;

        // 4. Se tudo estiver correto, chama a próxima função na fila (a rota final)
        next();

    } catch (err) {
        res.status(500).json({ message: 'Ocorreu um erro interno ao validar o token.' });
    }
};


/**
 * Middleware de autorização.
 * Verifica se o utilizador autenticado é um administrador.
 * IMPORTANTE: Este middleware DEVE ser usado DEPOIS do middleware 'autenticar'.
 */
const apenasAdmins = async (req, res, next) => {
    // Pega o utilizador que o middleware 'autenticar' já validou e anexou ao 'req'
    const { user } = req;

    if (!user) {
        return res.status(401).json({ message: 'Utilizador não autenticado.' });
    }

    try {
        // Vai à tabela 'Users' e busca o perfil do utilizador logado
        const { data: perfilUsuario, error } = await supabase
            .from('Users')
            .select('id_categoria')
            .eq('auth_user_id', user.id) // Compara o ID do auth.users com a nossa tabela
            .single();

        if (error || !perfilUsuario) {
            return res.status(403).json({ message: 'Acesso negado: perfil de utilizador não encontrado.' });
        }

        // ASSUMIMOS QUE: id_categoria = 2 significa "Administrador"
        // Se for diferente na sua tabela, ajuste este número.
        if (perfilUsuario.id_categoria !== 2) {
            return res.status(403).json({ message: 'Acesso negado: requer privilégios de administrador.' });
        }
        
        // Se o utilizador é um admin, deixa o pedido passar
        next();

    } catch (err) {
        res.status(500).json({ message: 'Ocorreu um erro ao verificar as permissões do utilizador.' });
    }
};

// Exporta as nossas funções para que o server.js as possa usar
module.exports = {
    autenticar,
    apenasAdmins
};