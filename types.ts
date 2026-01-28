
export interface ImageData {
  url: string;
  width: number;
  height: number;
  file?: File;
}

export interface HistoryItem {
  id: string;
  stegoUrl: string;
  passwordHash: string; // Stored for client-side verification
  timestamp: number;
  label: string;
}

export interface Metrics {
  psnr: number;
  ssim: number;
  mse: number;
  payloadSize: number;
}

export enum AppState {
  IDLE = 'IDLE',
  DASHBOARD = 'DASHBOARD',
  STEP_CARRIER = 'STEP_CARRIER',
  STEP_SECRET = 'STEP_SECRET',
  STEP_RESULT = 'STEP_RESULT'
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
