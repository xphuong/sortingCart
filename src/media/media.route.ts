import express from 'express';
import { singleFileUpload } from './media.controller';
import { upload } from './multer';
const router = express.Router();

router.post('/',upload.single('file'),singleFileUpload);


export default router