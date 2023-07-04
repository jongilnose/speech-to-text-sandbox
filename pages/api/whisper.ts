import fs from 'fs/promises';
import multer from 'multer';
import { NextApiRequestWithFile, NextApiResponse } from 'next';
import openai from '../../lib/openai';

const upload = multer({ dest: 'uploads/' });
const uploadMiddleware = upload.single('audio');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequestWithFile, res: NextApiResponse) {
  try {
    await new Promise((resolve, reject) => uploadMiddleware(req as any, res as any, err => (err ? reject(err) : resolve(req))));

    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const buffer = await fs.readFile(req.file.path);
    const file = {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      lastModified: req.file.lastModifiedDate,
      buffer: buffer,
    };
    // const audioFile = new File([buffer], req.file.originalname, { type: req.file.mimetype });
    const response = await openai.createTranscription(
      file, // audio input file
      'whisper-1', // Whisper model name.
      undefined, // Prompt
      'json', // Output format. Options are: json, text, srt, verbose_json, or vtt.
      1, // Temperature.
      'ko', // ISO language code. Eg, for english `en`
    );
    console.log(response);
  } catch (error) {
    console.error('Error while processing file:', error);
    res.status(500).send('Error while processing file');
  } finally {
    await fs.unlink(req.file.path);
  }
}
