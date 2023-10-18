import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMongoDb } from '@/middlewares/conectarMongoDB';
import type { respostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { seguidorModel } from '@/models/SeguidorModel';
import { usuarioModel } from '@/models/UsuarioModel';
import { politicaCORS } from '@/middlewares/politicaCORS';

const pesquisaEndpoint
    = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg | any[]>) => {
        try {
            if (req.method === 'GET') {
                if (req?.query?.id) {
                    const usuarioEncontrado = await usuarioModel.findById(req?.query?.id);
                    if (!usuarioEncontrado) {
                        return res.status(400).json({ error: 'Usuário não encontrado' });
                    }

                    const user = {
                        senha: null,
                        segueEsseUsuario: false,
                        nome: usuarioEncontrado.nome,
                        email: usuarioEncontrado.email,
                        _id: usuarioEncontrado._id,
                        avatar: usuarioEncontrado.avatar,
                        seguidores: usuarioEncontrado.seguidores,
                        seguindo: usuarioEncontrado.seguindo,
                        publicacoes: usuarioEncontrado.publicacoes,
                    } as any;

                    const segueEsseUsuario = await seguidorModel.find({ usuarioId: req?.query?.userId, usuarioSeguidoId: usuarioEncontrado._id });
                    if (segueEsseUsuario && segueEsseUsuario.length > 0) {
                        user.segueEsseUsuario = true;
                    }
                    return res.status(200).json(user);
                } else {
                    const { filtro } = req.query;
                    if (!filtro || filtro.length < 2) {
                        return res.status(400).json({ error: 'Favor informar pelo menos 2 caracteres para a busca' });
                    }

                    const usuariosEncontrados = await usuarioModel.find({
                        $or: [{ nome: { $regex: filtro, $options: 'i' } },
                            //{ email : {$regex : filtro, $options: 'i'}}
                        ]
                    });

                    usuariosEncontrados.forEach(userFound => {
                        userFound.senha = null
                    });

                    return res.status(200).json(usuariosEncontrados);
                }
            }
            return res.status(405).json({ error: 'Metodo informado nao e valido' });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: 'Nao foi possivel buscar usuarios:' + e });
        }
    }

export default politicaCORS(validarTokenJWT(conectarMongoDb(pesquisaEndpoint)));