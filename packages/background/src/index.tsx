import React from "react";
import { cn } from "@ajrojasfuentes/core";

export interface BackLayerProps {
  className?: string;
  enableNebulae?: boolean;
}

export function BackLayer({ className, enableNebulae = true }: BackLayerProps) {
  return (
    <>
      <div className={cn("fixed inset-0 w-full h-full bg-[#030014] overflow-hidden z-0 pointer-events-none", className)} />
      
      {enableNebulae && (
        <div className="fixed inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="nebula-1 absolute mix-blend-screen" 
               style={{ top: "-20%", left: "-10%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(88,28,135,0.3) 0%, transparent 70%)" }} />
          <div className="nebula-2 absolute mix-blend-screen" 
               style={{ top: "-10%", right: "-20%", width: "70vw", height: "70vw", background: "radial-gradient(circle, rgba(55,48,163,0.2) 0%, transparent 70%)" }} />
          <div className="nebula-3 absolute mix-blend-screen" 
               style={{ bottom: "-20%", left: "10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(112,26,117,0.2) 0%, transparent 70%)" }} />
          <div className="nebula-4 absolute mix-blend-screen" 
               style={{ bottom: "0%", right: "0%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(6,78,59,0.1) 0%, transparent 70%)" }} />
        </div>
      )}
    </>
  );
}
