export interface Timer {
  start(timeout: number, callback: () => void): Timer;
  stop(): Timer;
}