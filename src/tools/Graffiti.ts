import BaseDrawTools from "./BaseDrawTools";

export default class Graffiti extends BaseDrawTools {
  constructor(
    canvas: HTMLCanvasElement,
    canvasBackup: HTMLCanvasElement,
    key?: string
  ) {
    super("涂鸦", "brush", canvas, canvasBackup, "crosshair", key);
  }
  draw() {
    const noop = () => {};
    return {
      onmousedown: noop,
      onmousemove: (e: MouseEvent) => {
        const { clientX: x, clientY: y } = this.getClientPosition(e);
        if (this.canDraw) {
          this.ctxBackup.beginPath();
          this.ctxBackup.strokeStyle = this.color;
          this.ctxBackup.fillStyle = this.color;
          this.ctxBackup.arc(x, y, this.size * 10, 0, Math.PI * 2, false);
          this.ctxBackup.fill();
          this.ctxBackup.stroke();
        } else {
          this.clearContext();
          this.ctxBackup.beginPath();
          this.ctxBackup.fillStyle = this.color;
          this.ctxBackup.arc(x, y, this.size * 10, 0, Math.PI * 2, false);
          this.ctxBackup.fill();
          this.ctxBackup.stroke();
        }
      },
      onmouseup: noop,
      onmouseout: noop,
    };
  }
}
