import { createBucketClient } from '@cosmicjs/sdk';
import multer from 'multer';
import cosmicjs from 'cosmicjs';

const {
    BUCKET_SLUG, READ_KEY, WRITE_KEY } = process.env;

const Cosmic = cosmicjs;

const bucketDevagram = createBucketClient({
    bucketSlug: BUCKET_SLUG as string,
    readKey: READ_KEY as string,
    writeKey: WRITE_KEY as string,
});

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const uploadImagemCosmic = async (req: any) => {
    /* console.log('uploadImagemCosmic url', req.url)
    console.log('uploadImagemCosmic media_object', req.media_object)*/
    if(req?.file?.originalname){

        if(!req.file.originalname.includes('.png') &&
            !req.file.originalname.includes('.jpg') && 
            !req.file.originalname.includes('.jpeg')){
                throw new Error('Extensao da imagem invalida');
        } 
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer
        };

        let folder = "avatar";

        if (req.url && req.url.includes('publicacao')) {
            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: "publicacoes",
            });
        } else if (req.url && req.url.includes('usuario')){
            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: "avatares",
            });
        } else {
            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: "stories",
            });
        }
    }
}

export { upload, uploadImagemCosmic };