import type { NextApiRequest, NextApiResponse } from "next";
import type { respostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import type { cadastroRequisicao } from "@/types/CadastroRequisicao";
import { UsuarioModel } from "@/models/UsuarioModel";
import { conectarMongoDb } from "@/middlewares/conectarMongoDB";
import md5 from 'md5';
import { upload, uploadImagemCosmic } from "@/services/uploadImagemCosmic";
import nc from 'next-connect';

const handler = nc ()
    .use(upload.single('file'))
    .post(async (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {
    try {console.log('cadastro endpoint', req) 

            const usuario = req.body as cadastroRequisicao;
    
            if(!usuario.nome || usuario.nome.length < 2) {
                return res.status(400).json({error: 'Nome inválido'});
            }
    
            if(!usuario.email || usuario.email.length < 5 || !usuario.email.includes('@') || !usuario.email.includes('.')) {
                return res.status(400).json({error: 'E-mail inválido'});
            }
    
            if(!usuario.senha || usuario.senha.length < 6) {
                return res.status(400).json({error: 'Senha inválida'});
            }
    
            //verificar duplicidades
            const usuariosComMesmoEmail = await UsuarioModel.find({email : usuario.email});
            if (usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0) {
                return res.status(400).json({error: 'Já existe uma conta com o e-mail informado'});
            }

            // enviar a imagem do multer para o cosmic
            const image = await uploadImagemCosmic(req);
    
            // salvar no banco de dados
            const usuarioASerSalvo = {
                nome : usuario.nome,
                email : usuario.email,
                senha : md5(usuario.senha),
                avatar : image?.media?.url
            }
            await UsuarioModel.create(usuarioASerSalvo);
            return res.status(200).json({msg: 'Usuário cadastrado com sucesso!'})
            
        } catch(e) {
        console.log(e);
            return res.status(500).json({error: 'Erro ao cadastrar usuário'})
        }
    });

export const config = {
    api: {
        bodyParser : false
    }
}    

export default conectarMongoDb(handler);
