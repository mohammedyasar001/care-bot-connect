

// Define the SpeechRecognition interface
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Extend Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

// Speech recognition polyfill
if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
  window.webkitSpeechRecognition = class MockSpeechRecognition implements SpeechRecognition {
    continuous = false;
    interimResults = false;
    lang = 'en-US';
    onstart: ((event: Event) => void) | null = null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null = null;
    onerror: ((event: Event) => void) | null = null;
    onend: ((event: Event) => void) | null = null;
    
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() { return true; }
    
    start() { 
      if (this.onstart) {
        this.onstart(new Event('start')); 
      }
      setTimeout(() => { 
        if (this.onend) {
          this.onend(new Event('end')); 
        }
      }, 1000); 
    }
    
    stop() { 
      if (this.onend) {
        this.onend(new Event('end')); 
      }
    }
    
    abort() { 
      if (this.onend) {
        this.onend(new Event('end')); 
      }
    }
  } as any;
}

