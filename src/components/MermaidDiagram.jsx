import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'inherit'
});

const MermaidDiagram = ({ chart }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (containerRef.current && chart) {
      mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart)
        .then((result) => {
          containerRef.current.innerHTML = result.svg;
          // Ensure SVG respects scale properly
          const svg = containerRef.current.querySelector('svg');
          if (svg) {
            svg.style.maxWidth = 'none';
          }
          // Reset scale on new chart
          setScale(1);
        })
        .catch((error) => {
          console.error("Mermaid parsing error:", error);
        });
    }
  }, [chart]);

  const zoomIn = () => setScale(s => Math.min(s + 0.25, 3));
  const zoomOut = () => setScale(s => Math.max(s - 0.25, 0.25));
  const resetZoom = () => setScale(1);

  return (
    <div className="relative w-full flex flex-col group">
      {/* Zoom Controls Overlay */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-[#1a1a1a]/90 backdrop-blur-sm p-1.5 rounded-lg border border-[#333] shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={zoomOut} className="p-1.5 bg-transparent hover:bg-[#333] rounded-md text-white/70 hover:text-white transition-colors" title="Zoom Out">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
        </button>
        <button onClick={resetZoom} className="px-2 py-1.5 min-w-[3.5rem] text-center bg-transparent hover:bg-[#333] rounded-md text-white/70 hover:text-white font-medium transition-colors text-xs" title="Reset Zoom">
          {Math.round(scale * 100)}%
        </button>
        <button onClick={zoomIn} className="p-1.5 bg-transparent hover:bg-[#333] rounded-md text-white/70 hover:text-white transition-colors" title="Zoom In">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
        </button>
      </div>
      
      {/* Diagram Container */}
      <div className="w-full overflow-auto custom-scrollbar flex justify-center items-center min-h-[400px] p-4">
        <div 
           className="transition-transform duration-200 ease-out origin-center"
           style={{ transform: `scale(${scale})` }} 
        >
            <div ref={containerRef} className="mermaid-container flex justify-center items-center" />
        </div>
      </div>
    </div>
  );
};

export default MermaidDiagram;
