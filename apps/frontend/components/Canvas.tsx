import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, Square, LayoutGrid } from "lucide-react";
import { Game } from "../draw/Game";

export type Tool = "circle" | "rect" | "pencil";

export function Canvas({
    roomId,
    socket
}: {
    socket: WebSocket;
    roomId: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("pencil")

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    useEffect(() => {
        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomId, socket);
            setGame(g);

            return () => {
                g.destroy();
            }
        }
    }, [canvasRef, roomId, socket]);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-950">
            <canvas 
                ref={canvasRef} 
                width={typeof window !== "undefined" ? window.innerWidth : 0} 
                height={typeof window !== "undefined" ? window.innerHeight : 0}
                className="block"
            />
            <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
        </div>
    );
}

function Topbar({selectedTool, setSelectedTool}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-1 p-1 bg-slate-900/30 backdrop-blur-lg border border-slate-800/40 rounded-lg shadow-xl">
                <div className="px-2 border-r border-slate-800/40 mr-0.5 hidden sm:flex items-center">
                   <div className="flex items-center gap-1.5 text-slate-500 group">
                        <LayoutGrid className="w-3 h-3 group-hover:text-purple-400 transition-colors" />
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] select-none opacity-80">Scribble</span>
                   </div>
                </div>
                
                <IconButton 
                    onClick={() => setSelectedTool("pencil")}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil className="w-3.5 h-3.5" />}
                />
                <IconButton 
                    onClick={() => setSelectedTool("rect")} 
                    activated={selectedTool === "rect"} 
                    icon={<Square className="w-3.5 h-3.5" />} 
                />
                <IconButton 
                    onClick={() => setSelectedTool("circle")} 
                    activated={selectedTool === "circle"} 
                    icon={<Circle className="w-3.5 h-3.5" />} 
                />
            </div>
        </div>
    );
}