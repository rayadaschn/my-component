export default abstract class BaseDrawTools {
  /**
   * show property
   */
  public name: string;
  public icon: string;
  public cursor?: string;
  public key?: string;
  public active: boolean;
  public rubber: boolean;

  /**
   * draw property
   */
  public canvas: HTMLCanvasElement;
  public canvasBackup: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public ctxBackup: CanvasRenderingContext2D;
  public color: string = "#030303";
  public size: number = 1;
  public dashedLineLong: number = 0;
  public dashedInterval: number = 0;
  public canDraw: boolean = false;
  public emptyName: string = "清空";

  constructor(
    name: string,
    icon: string,
    canvas: HTMLCanvasElement,
    canvasBackup: HTMLCanvasElement,
    cursor?: string,
    key?: string,
    rubber: boolean = false,
    active: boolean = false
  ) {
    this.name = name;
    this.icon = icon;
    this.canvas = canvas;
    this.canvasBackup = canvasBackup;
    this.ctx = this.canvas.getContext("2d")!;
    this.ctxBackup = this.canvasBackup.getContext("2d")!;
    this.cursor = cursor;
    this.key = key;
    this.rubber = rubber;
    this.active = active;
  }

  clearContext(clearAll?: boolean) {
    if (clearAll) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.ctxBackup.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getClientPosition(e: MouseEvent) {
    return {
      clientX:
        e.clientX -
        (this.canvas.parentElement ? this.canvas.parentElement.offsetLeft : 0),
      clientY:
        e.clientY -
        (this.canvas.parentElement ? this.canvas.parentElement.offsetTop : 0),
    };
  }

  enable() {
    this.clearContext();
    this.canvasBackup.style.zIndex = "1";
    this.canDraw = false;
    this.active = true;
    let startX: number = 0;
    let startY: number = 0;

    const mousedown = (e: MouseEvent) => {
      this.ctx.strokeStyle = this.color;
      this.ctxBackup.strokeStyle = this.color;
      this.ctxBackup.lineWidth = this.size;
      e = e || window.event;
      const { clientX, clientY } = this.getClientPosition(e);
      startX = clientX;
      startY = clientY;
      this.ctxBackup.moveTo(clientX, clientY);
      this.canDraw = true;
      this.draw().onmousedown(e);
    };

    const mouseup = (e: MouseEvent) => {
      e = e || window.event;
      this.canDraw = false;
      this.draw().onmouseup(e);
      if (this.rubber) {
      } else {
        const image = new Image();
        image.src = this.canvasBackup.toDataURL("image/png", 1);
        image.onload = () => {
          this.ctx.drawImage(
            image,
            0,
            0,
            image.width,
            image.height,
            0,
            0,
            this.canvas.width,
            this.canvas.height
          );
          this.clearContext();
        };
      }
    };

    const mousemove = (e: MouseEvent) => {
      e = e || window.event;
      this.ctxBackup.setLineDash([this.dashedLineLong, this.dashedInterval]);
      this.draw().onmousemove(e, { startX, startY });
    };

    const mouseout = (e: MouseEvent) => {
      this.clearContext();
      this.draw().onmouseout(e);
    };

    this.canvasBackup.onmousedown = mousedown;
    this.canvasBackup.onmousemove = mousemove;
    this.canvasBackup.onmouseup = mouseup;
    this.canvasBackup.onmouseout = mouseout;
  }

  disable() {
    this.active = false;
  }

  drawImage(
    imageSrc: string,
    options: {
      sx: number;
      sy: number;
      dx: number;
      dy: number;
    }
  ) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      this.ctx.drawImage(
        img,
        options.sx,
        options.sy,
        img.width,
        img.height,
        options.dx,
        options.dy,
        this.canvas.width,
        this.canvas.height
      );
    };
    img.src = imageSrc;
  }

  output(format: "png" | "jpeg" | "webp") {
    const enlargedCanvas = document.createElement("canvas");
    const enlargedCtx = enlargedCanvas.getContext("2d");
    const scaleFactor = 2; // 放大倍数，您可以根据需要调整
    enlargedCanvas.width = this.canvas.width * scaleFactor;
    enlargedCanvas.height = this.canvas.height * scaleFactor;
    enlargedCtx.drawImage(
      this.canvas,
      0,
      0,
      this.canvas.width,
      this.canvas.height,
      0,
      0,
      enlargedCanvas.width,
      enlargedCanvas.height
    );

    const a = document.createElement("a");
    const ext = format || "webp";
    a.href = enlargedCanvas.toDataURL("image/png", 1.0);
    // a.href = this.canvas.toDataURL(`image/${ext}`, 1);
    if (format === "jpeg") {
      const canvas = document.createElement("canvas");
      canvas.width = this.canvas.width;
      canvas.height = this.canvas.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.canvas, 0, 0);
        a.href = canvas.toDataURL(`image/${ext}`, 1);
      }
    }
    a.download = `drawing.${ext}`;
    a.click();
  }

  getImgUrl(format: "png" | "webp" = "png") {
    const url = this.canvas.toDataURL(`image/${format}`, 1);
    return url;
  }

  abstract draw(): {
    onmousedown: (e: MouseEvent) => void;
    onmousemove: (
      e: MouseEvent,
      options?: { startX: number; startY: number }
    ) => void;
    onmouseup: (e: MouseEvent) => void;
    onmouseout: (e: MouseEvent) => void;
  };
}
