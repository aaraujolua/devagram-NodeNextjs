import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDb } from '@/middlewares/conectarMongoDB';
import type { respostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { publicacaoModel } from "@/models/PublicacaoModel";
import { usuarioModel } from '@/models/UsuarioModel';
import { politicaCORS } from '@/middlewares/politicaCORS';

const likeEndpoint 
    = async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {

    try {
        if(req.method === 'PUT'){
            // id da Publicacao - checked
            const {id} = req?.query;
            const publicacao = await publicacaoModel.findById(id);
            if(!publicacao){
                return res.status(400).json({error : 'Publicação não encontrada'});
            }

            // id do usuario que ta curtindo a pub            
            const {userId} = req?.query;
            const usuario = await usuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({error : 'Usuário não encontrado'});
            }
            
            const indexDoUsuarioNoLike = publicacao.likes.findIndex((e : any) => e.toString() === usuario._id.toString());

            // se o index for > -1 sinal q ele ja curte a foto
            if(indexDoUsuarioNoLike != -1){
                publicacao.likes.splice(indexDoUsuarioNoLike, 1);
                await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg : 'A publicação foi descurtida'});
            }else {
                // se o index for -1 sinal q ele nao curte a foto
                publicacao.likes.push(usuario._id);
                await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg : 'A publicação foi curtida'});
            }
        }

        return res.status(405).json({error : 'Método informado não é válido'});
    }catch(e){
        console.log(e);
        return res.status(500).json({error : 'Ocorreu erro ao curtir/descurtir uma publicação'});
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDb(likeEndpoint)));