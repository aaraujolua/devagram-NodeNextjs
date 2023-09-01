import type { NextApiRequest, NextApiResponse } from "next";
import type { respostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDb } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import nc from 'next-connect';
import { upload, uploadImagemCosmic } from "@/services/uploadImagemCosmic";

const handler = nc()
    .use(upload.single('file'))
    .put(async(req : any, res : NextApiResponse<respostaPadraoMsg>) => {
        try{
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            
            if(!usuario){
                return res.status(400).json({error : 'Usuário não encontrado'});
            }

            const {nome} = req?.body;
            if(nome && nome.length > 2){
                usuario.nome = nome;
            }

            const {file} = req;
            if(file && file.originalname){
                const image = await uploadImagemCosmic(req);
                if(image && image.media && image.media.url){
                    usuario.avatar = image.media.url;
                } 
            }

            await UsuarioModel
                .findByIdAndUpdate({_id : usuario._id}, usuario);

            return res.status(200).json({msg : 'Usuário alterado com sucesso'});
        }catch(e){
            console.log(e);
            return res.status(400).json({error : 'Não foi possivel atualizar usuário:' + e});
        }
    })
    .get(async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg | any>) => {
        try {
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            console.log('usuario', usuario);
            usuario.senha = null;
            return res.status(200).json(usuario);
        }catch(e) {
            console.log(e);
        }
    
        return res.status(400).json({error : 'Não foi possível obter dados do usuário'})
    });

export const config = {
    api : {
        bodyParser : false
    }
}

export default validarTokenJWT(conectarMongoDb(handler));
// politicaCORS()