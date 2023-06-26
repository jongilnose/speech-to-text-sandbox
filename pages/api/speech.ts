const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: `${process.env.OPENAI_KEY}`
});
const openai = new OpenAIApi(configuration);
export default async (req: any, res: any) => {
  if (req.method === 'POST') {
    let { messages } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    res.status(201).json({message : response.data.choices[0].message.content});
  } else {
    res.status(405).end();
  }
};
