import type { NextApiRequest, NextApiResponse } from "next";
import type { respostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDb } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import { publicacaoModel } from "@/models/PublicacaoModel";

const feedEndpoint = async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg | any>) => {
    try {
        if(req.method === 'GET') {
            if(req?.query?.id) {
                const usuario = await UsuarioModel.findById(req?.query.id);
                if(!usuario) {
                    return res.status(400).json({error: 'Usuário não encontrado'});
                }
                const publicacao = await publicacaoModel
                    .find({idUsuario : usuario._id})
                    .sort({data : -1});
                    return res.status(200).json(publicacao);
            }
            return res.status(200).json({error: 'Método informado não é válido'});
        }
    } catch(e) {
        console.log(e);
        return res.status(400).json({error: 'Não foi possível obter o feed'});
    }
}

export default validarTokenJWT(conectarMongoDb(feedEndpoint));