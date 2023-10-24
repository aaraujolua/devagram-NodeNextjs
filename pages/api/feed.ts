import type { NextApiRequest, NextApiResponse } from "next";
import type { respostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDb } from "@/middlewares/conectarMongoDB";
import { usuarioModel } from "@/models/UsuarioModel";
import { publicacaoModel } from "@/models/PublicacaoModel";
import { seguidorModel } from "@/models/SeguidorModel";
import { politicaCORS } from '@/middlewares/politicaCORS';

const feedEndpoint = async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg | any>) => {
    try {
        if(req.method === 'GET') {
            if(req?.query?.id) {
                const usuario = await usuarioModel.findById(req?.query.id);
                if(!usuario) {
                    return res.status(400).json({error: 'Usuário não encontrado'});
                }
                const publicacao = await publicacaoModel
                    .find({idUsuario : usuario._id})
                    .sort({data : -1});
                    return res.status(200).json(publicacao);
            } else {
                const {userId} = req.query;
                const usuarioLogado = await usuarioModel.findById(userId);
                if(!usuarioLogado){
                    return res.status(400).json({error : 'Usuário não encontrado'});
                }
                const seguidores = await seguidorModel.find({usuarioId : usuarioLogado._id});
                const seguidoresIds = seguidores.map(s => s.usuarioSeguidoId);

                const publicacoes = await publicacaoModel.find({
                    $or : [
                        {idUsuario : usuarioLogado._id},
                        {idUsuario : seguidoresIds}
                    ]
                })
                .sort({data : -1});

                const result = [];
                for (const publicacao of publicacoes) {
                   const usuarioDaPublicacao = await usuarioModel.findById(publicacao.idUsuario);
                   if(usuarioDaPublicacao){
                        const final = {...publicacao._doc, usuario : {
                            nome : usuarioDaPublicacao.nome,
                            avatar : usuarioDaPublicacao.avatar
                        }};
                        result.push(final);  
                   }
                }

                return res.status(200).json(result);
            }
        }
            return res.status(405).json({error : 'Método informado não é válido'});
    }catch(e){
        console.log(e);
    }
    return res.status(400).json({error : 'Não foi possível obter o feed'});
}

export default politicaCORS(validarTokenJWT(conectarMongoDb(feedEndpoint)));