declare global {
  interface Window {
    ReactNativeWebView: any;
    Kakao: any;
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const ReactNativeWebView = window.ReactNativeWebView;
