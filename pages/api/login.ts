import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDb } from '@/middlewares/conectarMongoDB';
import type { respostaPadraoMsg } from '@/types/RespostaPadraoMsg';
import type { LoginResposta } from '@/types/LoginResposta';
import md5 from 'md5';
import { usuarioModel } from '@/models/UsuarioModel';
import jwt from 'jsonwebtoken'; 
import { politicaCORS } from '@/middlewares/politicaCORS';

const endpointLogin = async (
    req : NextApiRequest,
    res: NextApiResponse<respostaPadraoMsg | LoginResposta>  
) => {

    const {MINHA_CHAVE_JWT} = process.env;
    if(!MINHA_CHAVE_JWT){
        res.status(500).json({error: 'ENV Jwt não informada'});
    }
    if(req.method === 'POST') {
        const {login, senha} = req.body;

        const usuariosEncontrados = await usuarioModel.find({email : login, senha: md5(senha)})
        if(usuariosEncontrados && usuariosEncontrados.length > 0) {
            const usuarioEncontrado = usuariosEncontrados[0];   

            const token = jwt.sign(
                {_id : usuarioEncontrado._id}, MINHA_CHAVE_JWT as string);
            return res.status(200).json({
                nome : usuarioEncontrado.nome, 
                email : usuarioEncontrado.email, 
                token });
        }
        return res.status(405).json({error: 'Usuário ou senha incorretos'});
    }
    return res.status(405).json({error: 'Método informado não é válido'});
}

export default politicaCORS(conectarMongoDb(endpointLogin));