import type { NextApiRequest, NextApiResponse } from "next";
import type { respostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import nc from "next-connect";
import { upload, uploadImagemCosmic } from "@/services/uploadImagemCosmic";
import { conectarMongoDb } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";

const handler = nc()
    .use(upload.single('file'))
    .post(async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {
        const {descricao, file} = req?.body;

        if(!descricao || descricao.length < 2) {
            return res.status(400).json({error: 'Descrição inválida'});
        };

        if(!file) {
        return res.status(400).json({error: 'O arquivo selecionado não é suportado'})
    };

        return res.status(400).json({error: 'Publicação carregada com sucesso'})
    });

export const config = {
    api : {
        bodyParser : false
    }
}

export default validarTokenJWT(conectarMongoDb(handler));  