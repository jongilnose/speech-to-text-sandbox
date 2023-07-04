import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { BiMicrophone, BiMicrophoneOff, BiPlay } from 'react-icons/bi';

export default function Recorder() {
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newMediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(newMediaRecorder);
    newMediaRecorder.start();

    newMediaRecorder.addEventListener('dataavailable', event => {
      setAudioChunks(prevAudioChunks => [...prevAudioChunks, event.data]);
    });

    newMediaRecorder.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setAudioURL(audioUrl);
    });

    setRecording(true);
  };

  const sendAudioToServer = async () => {
    const audioBlob = new Blob(audioChunks);
    const audioFile = new File([audioBlob], 'audio.mp3', {
      type: 'audio/mp3',
    });

    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await axios.post('/api/whisper', formData);
    console.log(response.data);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      sendAudioToServer();
    }
  };

  const playRecording = () => {
    audioRef.current?.play();
    setPlaying(true);
  };

  const stopPlaying = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };

  useEffect(() => {
    if (!recording && audioChunks.length > 0) {
      sendAudioToServer();
    }
  }, [recording, audioChunks]);

  return (
    <div>
      <Button
        className={recording ? 'speech-button active' : 'speech-button'}
        title={recording ? '말하는중' : '대기중'}
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? <BiMicrophone /> : <BiMicrophoneOff />}
      </Button>
      {audioURL && (
        <Button className="play-button" onClick={playing ? stopPlaying : playRecording}>
          <BiPlay />
        </Button>
      )}
      {audioURL && <audio src={audioURL} controls />}
    </div>
  );
}
