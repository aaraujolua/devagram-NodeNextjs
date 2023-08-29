import type { NextApiRequest, NextApiResponse } from "next";
import type { respostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { conectarMongoDb } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";

const usuarioEndPoint = async (req : NextApiRequest, res: NextApiResponse<respostaPadraoMsg | any>) => {
    try {
        const {userId} = req?.query;

        //buscar dados do usuario
        const usuario = await UsuarioModel.findById(userId);
        usuario.senha = null;
        return res.status(200).json(usuario);
    } catch(e) {
        console.log(e);
        return res.status(400).json({error:'Não foi possível obter o token de acesso'});
    }
}

export default validarTokenJWT(conectarMongoDb(usuarioEndPoint));