import { Tool } from "../components/Canvas";
import { getExistingShapes } from "./http";

type Shape = {
    id?: number;
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    id?: number;
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    id?: number;
    type: "pencil";
    points: { x: number, y: number }[];
} | {
    id?: number;
    type: "text";
    text: string;
    x: number;
    y: number;
}

export class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[]
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "circle";
    private currentPencilPoints: { x: number, y: number }[] = [];

    socket: WebSocket;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }
    
    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler)
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler)
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler)
    }

    setTool(tool: Tool) {
        this.selectedTool = tool;
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === "chat") {
                const parsedData = JSON.parse(message.message)
                this.existingShapes.push({
                    ...parsedData.shape,
                    id: message.id
                })
                this.clearCanvas();
            }

            if (message.type === "delete") {
                this.existingShapes = this.existingShapes.filter(s => s.id !== message.id);
                this.clearCanvas();
            }
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.existingShapes.map((shape) => {
            this.ctx.strokeStyle = "rgba(255, 255, 255)"
            this.ctx.fillStyle = "rgba(255, 255, 255)"
            this.ctx.lineWidth = 2;

            if (shape.type === "rect") {
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();                
            } else if (shape.type === "pencil") {
                this.ctx.beginPath();
                if (shape.points.length > 0) {
                    this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
                    for (let i = 1; i < shape.points.length; i++) {
                        this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
                    }
                }
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "text") {
                this.ctx.font = "20px Outfit, sans-serif";
                this.ctx.fillText(shape.text, shape.x, shape.y);
            }
        })
    }

    private isPointInShape(x: number, y: number, shape: Shape): boolean {
        if (shape.type === "rect") {
            const minX = Math.min(shape.x, shape.x + shape.width);
            const maxX = Math.max(shape.x, shape.x + shape.width);
            const minY = Math.min(shape.y, shape.y + shape.height);
            const maxY = Math.max(shape.y, shape.y + shape.height);
            return x >= minX && x <= maxX && y >= minY && y <= maxY;
        } else if (shape.type === "circle") {
            const dist = Math.sqrt((x - shape.centerX) ** 2 + (y - shape.centerY) ** 2);
            return dist <= Math.abs(shape.radius);
        } else if (shape.type === "pencil") {
            // Check if point is near any line segment
            for (let i = 0; i < shape.points.length - 1; i++) {
                const p1 = shape.points[i];
                const p2 = shape.points[i+1];
                const d = this.distToSegment({x, y}, p1, p2);
                if (d < 10) return true; // threshold
            }
        } else if (shape.type === "text") {
            const width = this.ctx.measureText(shape.text).width;
            return x >= shape.x && x <= shape.x + width && y <= shape.y && y >= shape.y - 20;
        }
        return false;
    }

    private distToSegment(p: {x: number, y: number}, v: {x: number, y: number}, w: {x: number, y: number}) {
        const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
        if (l2 === 0) return Math.sqrt((p.x - v.x) ** 2 + (p.y - v.y) ** 2);
        let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return Math.sqrt((p.x - (v.x + t * (w.x - v.x))) ** 2 + (p.y - (v.y + t * (w.y - v.y))) ** 2);
    }

    mouseDownHandler = (e: MouseEvent) => {
        const x = e.offsetX;
        const y = e.offsetY;

        if (this.selectedTool === "eraser") {
            // Find topmost shape (reverse order)
            for (let i = this.existingShapes.length - 1; i >= 0; i--) {
                const shape = this.existingShapes[i];
                if (this.isPointInShape(x, y, shape) && shape.id) {
                    this.socket.send(JSON.stringify({
                        type: "delete",
                        id: shape.id,
                        roomId: Number(this.roomId)
                    }));
                    // Shape will be removed via socket message
                    break;
                }
            }
            return;
        }

        if (this.selectedTool === "text") {
            const text = window.prompt("Enter text:");
            if (text) {
                const shape: Shape = {
                    type: "text",
                    text,
                    x,
                    y
                };
                this.socket.send(JSON.stringify({
                    type: "chat",
                    message: JSON.stringify({ shape }),
                    roomId: Number(this.roomId)
                }));
            }
            return;
        }

        this.clicked = true
        this.startX = x;
        this.startY = y;

        if (this.selectedTool === "pencil") {
            this.currentPencilPoints = [{ x, y }];
        }
    }

    mouseUpHandler = (e: MouseEvent) => {
        if (!this.clicked) return;
        this.clicked = false
        const width = e.offsetX - this.startX;
        const height = e.offsetY - this.startY;

        let shape: Shape | null = null;
        if (this.selectedTool === "rect") {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                height,
                width
            }
        } else if (this.selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: this.startX + radius,
                centerY: this.startY + radius,
            }
        } else if (this.selectedTool === "pencil") {
            if (this.currentPencilPoints.length > 1) {
                shape = {
                    type: "pencil",
                    points: this.currentPencilPoints
                }
            }
            this.currentPencilPoints = [];
        }

        if (!shape) {
            return;
        }

        // Optimistic update (might not have ID yet)
        // this.existingShapes.push(shape); // Disabled to avoid double-rendering if broadcast is fast

        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId: Number(this.roomId)
        }))

        this.clearCanvas();
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.clicked) {
            const width = e.offsetX - this.startX;
            const height = e.offsetY - this.startY;
            
            this.ctx.strokeStyle = "rgba(255, 255, 255)"
            this.ctx.lineWidth = 2;

            if (this.selectedTool === "rect") {
                this.clearCanvas();
                this.ctx.strokeRect(this.startX, this.startY, width, height);   
            } else if (this.selectedTool === "circle") {
                this.clearCanvas();
                const radius = Math.max(width, height) / 2;
                const centerX = this.startX + radius;
                const centerY = this.startY + radius;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();                
            } else if (this.selectedTool === "pencil") {
                const newPoint = { x: e.offsetX, y: e.offsetY };
                const lastPoint = this.currentPencilPoints[this.currentPencilPoints.length - 1];
                
                this.currentPencilPoints.push(newPoint);
                
                this.ctx.beginPath();
                this.ctx.moveTo(lastPoint.x, lastPoint.y);
                this.ctx.lineTo(newPoint.x, newPoint.y);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler)
        this.canvas.addEventListener("mouseup", this.mouseUpHandler)
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler)    
    }
}