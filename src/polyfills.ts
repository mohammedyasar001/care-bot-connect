
// Speech recognition polyfill
if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
  window.webkitSpeechRecognition = class MockSpeechRecognition {
    onstart = () => {};
    onresult = () => {};
    onerror = () => {};
    onend = () => {};
    start() { this.onstart(); setTimeout(() => this.onend(), 1000); }
    stop() { this.onend(); }
  } as any;
}
