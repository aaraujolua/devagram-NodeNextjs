import type { NextApiResponse } from "next";
import type { respostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import nc from "next-connect";
import { upload, uploadImagemCosmic } from "@/services/uploadImagemCosmic";
import { conectarMongoDb } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { publicacaoModel } from "@/models/PublicacaoModel";
import { usuarioModel } from "@/models/UsuarioModel";
import { politicaCORS } from '@/middlewares/politicaCORS';

const handler = nc()
    .use(upload.single('file'))
    .post(async (req : any, res : NextApiResponse<respostaPadraoMsg>) => {

        try {
            const {userId} = req.query;
            const usuario = await usuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({error: 'Usuário não encontrado'});
            };

            if(!req || !req.body) {
                return res.status(400).json({error: 'Parâmetros de entrada não informados'});
            };

            const {descricao} = req?.body;
            if(!descricao || descricao.length < 2) {
                return res.status(400).json({error: 'Descrição inválida'});
            };
        
            if(!req.file) {
                return res.status(400).json({error: 'O arquivo selecionado não é suportado'})
            };

            const image = await uploadImagemCosmic(req);
            const publicacao = {
                idUsuario : usuario.id,
                descricao,
                foto : image.media.url,
                data : new Date()
            };

        await publicacaoModel.create(publicacao);
        return res.status(200).json({msg: 'Publicação carregada com sucesso'})

        }catch(e) {
            console.log(e);
            return res.status(400).json({error : 'Erro ao enviar publicação'});
        }
    });
        
export const config = {
    api : {
        bodyParser : false
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDb(handler)));