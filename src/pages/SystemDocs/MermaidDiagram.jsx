import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose',
});

const MermaidDiagram = ({ chart }) => {
    const mermaidRef = useRef(null);

    useEffect(() => {
        const renderDiagram = async () => {
            if (mermaidRef.current && chart) {
                try {
                    mermaidRef.current.innerHTML = '';
                    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                    const { svg } = await mermaid.render(id, chart.trim());
                    if (mermaidRef.current) {
                        mermaidRef.current.innerHTML = svg;
                    }
                } catch (error) {
                    console.error("Mermaid syntax error:", error);
                }
            }
        };
        renderDiagram();
    }, [chart]);

    return (
        <div ref={mermaidRef}></div>
    );
};

export default MermaidDiagram;
