import type { NextApiRequest, NextApiResponse } from "next";
import type { respostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { conectarMongoDb } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { usuarioModel } from "@/models/UsuarioModel";
import { publicacaoModel } from "@/models/PublicacaoModel";
import { politicaCORS } from '@/middlewares/politicaCORS';

const comentarioEndpoint = async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {
    try{
        if(req.method === 'PUT'){
            const {userId, id} = req.query;
            const usuarioLogado = await usuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({error : 'Usuário não encontrado'});
            }
            
            const publicacao =  await publicacaoModel.findById(id);
            if(!publicacao){
                return res.status(400).json({error : 'Publicação não encontrada'});
            }

            if(!req.body || !req.body.comentario
                || req.body.comentario.length < 2){
                return res.status(400).json({error : 'Comentário não é válido'});
            }

            const comentario = {
                usuarioId : usuarioLogado._id,
                nome : usuarioLogado.nome,
                comentario : req.body.comentario
            }

            publicacao.comentarios.push(comentario);
            await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
            return res.status(200).json({msg : 'Comentário adicionado com sucesso'});
        }
        
        return res.status(405).json({error : 'Método informado não é válido'});
    }catch(e){
        console.log(e);
        return res.status(500).json({error : 'Erro ao adicionar comentário'});
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDb(comentarioEndpoint)));