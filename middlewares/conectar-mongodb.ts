import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from 'mongoose';
import type { respostaPadraoMsg } from "@/types/resposta-padrao-msg";


export const conectarMongoDb = (handler : NextApiHandler) =>
    async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {

// verificar se o banco já está conectado. Se estiver, seguir para o endpoint ou próximo middleware!
    if (mongoose.connections[0].readyState) {
        return handler(req, res);
    }
        
// se não estiver conectado, vamos conectar
// obter a variável de ambiente preenchida do env
    const {DB_CONEXAO_STRING} = process.env;

// se a env estiver vazia parar o andamento do sistema e alertar o programador
    if (!DB_CONEXAO_STRING) {
        return res.status(500).json({error : 'ENV de configuração do banco não informado'});
    }
    
    mongoose.connection.on('connected', () => console.log('Banco de dados conectado com sucesso'));
    mongoose.connection.on('error', error => console.log(`Ocorreu algum erro ao conectar no banco de dados ${error}`));
    await mongoose.connect(DB_CONEXAO_STRING);

// quando conectado, seguir para o endpoint
    return handler(req, res);
}
