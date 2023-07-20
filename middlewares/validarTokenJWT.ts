import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { respostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import jwt from 'jsonwebtoken';

export const validarTokenJWT = (handler : NextApiHandler) =>
    (req : NextApiRequest, res : NextApiResponse<respostaPadraoMsg>) => {

    const {MINHA_CHAVE_JWT} = process.env;
    if(!MINHA_CHAVE_JWT) {
        return res.status(500).json({ error : 'ENV chave JWT não informada na execução do processo'})
    }

    if(!req || req.headers) {
        return res.status(401).json({ error : 'Não foi possível validar o token de acesso'});
    }

    if(req.method !== 'OPTIONS') {
        const authorization = req.headers['authorization'];
        if(!authorization) {
            return res.status(401).json({ error : 'Não foi possíve validar o token de acesso'});
        }
    }

    const token = authorization.substring(7);
  
    }