declare module 'html5-qrcode' {
  export type CameraConfig = { facingMode?: 'environment' | 'user' } | string;

  export interface Html5QrcodeConfig {
    fps?: number;
    qrbox?: number | { width: number; height: number };
  }

  export class Html5Qrcode {
    constructor(elementId: string | HTMLElement);
    start(
      cameraIdOrConfig: CameraConfig,
      config?: Html5QrcodeConfig,
      qrCodeSuccessCallback?: (decodedText: string) => void,
      qrCodeErrorCallback?: (errorMessage: string) => void
    ): Promise<void>;
    stop(): Promise<void>;
    clear(): void;
  }
}
