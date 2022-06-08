import { Request } from 'express';
import multer from 'multer';               
import { ErrorResponse } from '../utils/ErrorResponse';

const storage = multer.diskStorage({
    destination:(req:Request,file:Express.Multer.File,cb)=>{
        cb(null,'uploads');
    },
    filename:(req:Request,file:Express.Multer.File,cb:Function)=>{
        cb(null,new Date().toISOString().replace(/:/g,'-')+'-'+file?.originalname);
    }

});

// const filefilter = (req:Request,file:Express.Multer.File,cb:any)=>{
//     if(file.mimetype==='image/png'||file.mimetype==='image/jpg'||file.mimetype==='image/ipeg'){
//         cb(null,true);
//     }else{
//         cb(null,false);
//     }
// }
const filefilter= (req:Request,file:Express.Multer.File,cb:Function) =>{
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
        return cb(new ErrorResponse('Only images are allowed for me',401));
    }
    cb(null, true);
}

export const upload = multer({storage:storage,
    limits: { fileSize: 2000000},
    fileFilter:filefilter})