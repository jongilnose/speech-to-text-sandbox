import multer from 'multer';
import { NextApiRequestWithFile, NextApiResponse } from 'next';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

export const uploadAsync = (req: NextApiRequestWithFile, res: NextApiResponse) => {
  return new Promise((resolve, reject) => {
    upload(req as any, res as any, err => {
      if (err) {
        reject(err);
      } else {
        resolve(req.file);
      }
    });
  });
};
