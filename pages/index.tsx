import axios from 'axios';
import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Messages from '../components/Messages';
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

  const startListening = () => {
    SpeechRecognition.startListening({ language: 'ko', continuous: true });
  };

  const stopListening = async () => {
    await SpeechRecognition.stopListening();
    setIsLoading(true);
    await startSpeech();
    setIsLoading(false);
  };

  // const handleSpeechMessage = async (message:any) => {
  //   setSpeechMessageInput(message)
  // }

  // const handleKeyDown = async (event: React.KeyboardEvent<HTMLDivElement>) => {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //     setIsLoading(true);
  //     await startSpeech()
  //     setIsLoading(false);
  //   }
  // };
  return (
    <Layout>
      <div>
        <div className="text-center mb-5">
          <h1>상담 로봇</h1>
        </div>
        <div className="app">
          <div className="row">
            <div className="text-center">{introduce}</div>
            <div>
              {listening ? (
                <div className="text-center m-5">
                  음성인식 : <span className="text-danger speech-mic">인식중</span>
                </div>
              ) : (
                <div className="text-center m-5">음성인식 : 대기중</div>
              )}
              <div className="text-center">
                {listening ? (
                  <Button className="speech-button active" title="말하는중" disabled={isLoading} onClick={stopListening}>
                    {isLoading ? <Spinner size="sm" animation="grow" variant="dark" /> : <BiMicrophone />}
                  </Button>
                ) : (
                  <Button className="speech-button" title="대기중" disabled={isLoading} onClick={startListening}>
                    {isLoading ? <Spinner size="sm" animation="grow" variant="dark" /> : <BiMicrophoneOff />}
                  </Button>
                )}
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
