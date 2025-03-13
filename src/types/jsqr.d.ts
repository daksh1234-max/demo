declare module 'jsqr' {
  interface Point {
    x: number;
    y: number;
  }

  interface QRLocation {
    topLeftCorner: Point;
    topRightCorner: Point;
    bottomRightCorner: Point;
    bottomLeftCorner: Point;
  }

  interface QRCode {
    data: string;
    location: QRLocation;
  }

  function jsQR(
    imageData: Uint8ClampedArray,
    width: number,
    height: number
  ): QRCode | null;

  export = jsQR;
}
