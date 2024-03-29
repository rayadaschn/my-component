import BaseDrawTools from "./BaseDrawTools";

export default class DND extends BaseDrawTools {
  constructor(canvas: HTMLCanvasElement, canvasBackup: HTMLCanvasElement) {
    super("拖拽导入", "add_photo_alternate", canvas, canvasBackup, "auto");
    this.initDrag();
  }

  handleDragOver = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  handleDrop = (e: DragEvent) => {
    this.handleDragOver(e);
    const files = e.dataTransfer?.files || ([] as []);
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const t = f.type ? f.type : "n/a";
      const reader = new FileReader();
      const isImg = this.isImage(t);
      if (isImg) {
        reader.onload = (event) => {
          const image = new Image();
          image.onload = () => {
            const ctx = this.canvas.getContext("2d");
            ctx &&
              ctx.drawImage(
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
          };
          image.src = event.target?.result as string;
        };
        reader.readAsDataURL(f);
      }
    }
  };

  isImage(type: string) {
    switch (type) {
      case "image/jpeg":
      case "image/png":
      case "image/gif":
      case "image/bmp":
      case "image/jpg":
        return true;
      default:
        return false;
    }
  }

  initDrag() {
    this.canvasBackup.addEventListener("dragover", this.handleDragOver, false);
    this.canvasBackup.addEventListener("drop", this.handleDrop, false);
  }

  draw() {
    const noop = () => {};
    return {
      onmousedown: noop,
      onmousemove: noop,
      onmouseup: noop,
      onmouseout: noop,
    };
  }
}
