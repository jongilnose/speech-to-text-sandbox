import axios from 'axios';
import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Messages from '../components/Messages';
import Recorder from '../components/Recorder';
import Layout from '../components/layout/Layout';

interface Props {
  title: string;
}

interface Messages {
  role: string;
  content: string;
}

export default function Home() {
  const [introduce, setIntroduceInput] = useState('');
  const [messages, setMessagesInput] = useState<Messages[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState('BROWSER');
  const [liveListening, setLiveListening] = useState(false);
  const { isMicrophoneAvailable, transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setIntroduceInput('죄송합니다. 귀하의 브라우저는 Web Speech API를 지원하지 않습니다. Chrome에서 이 데모를 열어보세요.');
    }
    if (!isMicrophoneAvailable) {
      setIntroduceInput('마이크 사용 권한을 부여해야 사용할 수 있습니다.');
    }
  }, []);

  const startSpeech = async () => {
    if (isLoading === true) {
      return;
    }
    if (transcript === '') {
      return;
    }
    const newMessages = {
      role: 'user',
      content: transcript,
    };
    const tmpArray = [newMessages, ...messages];
    setMessagesInput(tmpArray);
    const responseMessage = await handleConversation(tmpArray);
    const botMessages = {
      role: 'assistant',
      content: responseMessage,
    };
    setMessagesInput([botMessages, ...tmpArray]);
    resetTranscript();
  };

  const handleConversation = async (messages: unknown) => {
    const response = await axios.post(`/api/speech`, {
      messages: messages,
    });
    return response.data.message.trim();
  };

  const browserListeningStart = async () => {
    setLiveListening(true);
    SpeechRecognition.startListening({ language: 'ko', continuous: true });
    await startSpeech();
  };

  const stopListening = async () => {
    setLiveListening(false);
    await SpeechRecognition.stopListening();
  };

  const setListening = async () => {
    if (liveListening) {
      await stopListening();
      return;
    }
    switch (type) {
      case 'BROWSER':
        await browserListeningStart();
        break;
      case 'CLOVA':
        console.log('CLOVA');
        break;
      case 'TRANSCRIBE':
        console.log('TRANSCRIBE');
        break;
      case 'WHISPER':
        console.log('WHISPER');
        break;
    }
  };

  return (
    <Layout>
      <div>
        <div className="text-center mb-5">
          <h1>{type} Recognition</h1>
        </div>
        <div className="app">
          <div className="row">
            <div>
              <Form.Select onChange={(e: any) => setType(e.currentTarget.value)}>
                <option value="BROWSER">브라우저 내장</option>
                <option value="CLOVA">네이버 크로바</option>
                <option value="TRANSCRIBE">AWS Transcribe</option>
                <option value="WHISPER">OpenAI whisper</option>
              </Form.Select>
            </div>
            <div>
              {liveListening ? (
                <div className="text-center m-5">
                  음성인식 : <span className="text-danger speech-mic">인식중</span>
                </div>
              ) : (
                <div className="text-center m-5">음성인식 : 대기중</div>
              )}
              <div className="text-center">
                <Recorder />
              </div>
              {/* <div>
                <input type="text" className="transcript-input" name="transcript" id="transcript" value={speechMessage} onChange={e => handleSpeechMessage(e.target.value)}  onKeyDown={handleKeyDown} />
              </div> */}
              {listening ? <div className="transcript">{transcript}</div> : ''}
              <div className="messages-container text-center">
                <Messages messages={messages} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      title: 'Home - Foresting',
    },
  };
};
