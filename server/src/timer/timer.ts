export interface Timer {
  start(timeout: number, callback: () => void|Promise<void>): Timer;
  stop(): Timer;
}