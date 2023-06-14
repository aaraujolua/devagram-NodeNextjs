import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDb } from '../../middlewares/conectar-mongodb'
import type { respostaPadraoMsg } from '@/types/RespostaPadraoMsg';

const endpointLogin = (
    req : NextApiRequest,
    res: NextApiResponse<respostaPadraoMsg>
) => {
    if(req.method === 'POST') {
        const {login, senha} = req.body;

        if(login === 'admin@admin.com' &&
            senha === 'Admin@123') {
                return res.status(200).json({msg : 'Usuário autenticado com sucesso! '});
        }
        return res.status(405).json({error: 'Usuário ou senha incorretos'});
    }
    return res.status(405).json({error: 'Método informado não é válido'});
}

export default conectarMongoDb(endpointLogin);