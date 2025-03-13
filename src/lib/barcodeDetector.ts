import jsQR from 'jsqr';

interface BarcodeDetectorOptions {
  formats: string[];
}

interface Point {
  x: number;
  y: number;
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DetectedBarcode {
  boundingBox: BoundingBox;
  cornerPoints: Point[];
  format: string;
  rawValue: string;
}

export class BarcodeDetector {
  private formats: string[];

  constructor(options: BarcodeDetectorOptions) {
    this.formats = options.formats;
  }

  async detect(image: HTMLCanvasElement): Promise<DetectedBarcode[]> {
    const context = image.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }

    const imageData = context.getImageData(0, 0, image.width, image.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (!code) {
      return [];
    }

    // Convert jsQR result to BarcodeDetector format
    const result: DetectedBarcode = {
      boundingBox: {
        x: code.location.topLeftCorner.x,
        y: code.location.topLeftCorner.y,
        width: code.location.bottomRightCorner.x - code.location.topLeftCorner.x,
        height: code.location.bottomRightCorner.y - code.location.topLeftCorner.y,
      },
      cornerPoints: [
        code.location.topLeftCorner,
        code.location.topRightCorner,
        code.location.bottomRightCorner,
        code.location.bottomLeftCorner,
      ],
      format: 'qr_code',
      rawValue: code.data,
    };

    return [result];
  }
}
