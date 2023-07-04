import { NextApiRequest } from 'next';

declare module 'next' {
  export interface NextApiRequestWithFile extends NextApiRequest {
    file: Multer.File;
  }
}
