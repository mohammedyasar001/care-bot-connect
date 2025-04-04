
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
  // Create a mock implementation for environments that don't support speech recognition
  class MockSpeechRecognition implements SpeechRecognition {
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
      const startEvent = new Event('start');
      if (this.onstart) {
        this.onstart(startEvent); 
      }
      
      // Simulate ending after a delay
      setTimeout(() => { 
        const endEvent = new Event('end');
        if (this.onend) {
          this.onend(endEvent); 
        }
      }, 1000); 
    }
    
    stop() { 
      const endEvent = new Event('end');
      if (this.onend) {
        this.onend(endEvent); 
      }
    }
    
    abort() { 
      const endEvent = new Event('end');
      if (this.onend) {
        this.onend(endEvent); 
      }
    }
  }
  
  // Assign the mock class to the window object
  window.webkitSpeechRecognition = MockSpeechRecognition as any;
}
