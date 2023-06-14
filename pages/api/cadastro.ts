import type { NextApiRequest, NextApiResponse } from "next";
import type { respostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import type { cadastroRequisicao } from "@/types/CadastroRequisicao";
import { UsuarioModel } from "@/models/UsuarioModel";
import { conectarMongoDb } from "@/middlewares/conectar-mongodb";

const endpointCadastro = 
    async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {

    if(req.method === 'POST'){
        const usuario = req.body as cadastroRequisicao;

        if(!usuario.nome || usuario.nome.length < 2) {
            return res.status(400).json({error: 'Nome inválido'});
        }

        if(!usuario.email || usuario.email.length < 5 || !usuario.email.includes('@') 
        || !usuario.email.includes('.')) {
            return res.status(400).json({error: 'E-mail inválido'});
        }

        if(!usuario.senha || usuario.senha.length < 6) {
            return res.status(400).json({error: 'Senha inválida'});
        }

        // salvar no banco de dados
        await UsuarioModel.create(usuario);
        return res.status(200).json({msg: 'Usuário cadastrado com sucesso!'})
    }
    return res.status(405).json({error: 'Método informado não é válido'});
}

// export default conectarMongoDb (endpointCadastro);

export default endpointCadastro;

