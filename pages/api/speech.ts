import { Configuration, OpenAIApi } from 'openai';
const configuration = new Configuration({
  apiKey: `${process.env.OPENAI_KEY}`,
});
const openai = new OpenAIApi(configuration);
export default async (req: any, res: any) => {
  if (req.method === 'POST') {
    const { messages } = req.body;
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });
    res.status(200).json(response.data);
  } else {
    res.status(405).end();
  }
};
