import fs from 'fs';
const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';

// language => Language code (Kor, Jpn, Eng, Chn)
export default async (req: any, res: any) => {
  const { language, filePath } = req.body;
  const url = `https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=${language}`;
  const requestConfig = {
    url: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-NCP-APIGW-API-KEY-ID': clientId,
      'X-NCP-APIGW-API-KEY': clientSecret,
    },
    body: fs.createReadStream(filePath),
  };

  // request(requestConfig, (err: any, response: { statusCode: any }, body: any) => {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }

  //   console.log(response.statusCode);
  //   console.log(body);
  // });
};

// stt('Kor', 'Speech file path (ex: ./test.wav)');
