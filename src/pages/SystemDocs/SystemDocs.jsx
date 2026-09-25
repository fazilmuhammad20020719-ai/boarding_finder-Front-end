import React, { useState } from 'react';
import MermaidDiagram from '../../components/MermaidDiagram';

const docSections = [
    { id: 'auth', title: '1. User Authentication & Onboarding' },
    { id: 'property', title: '2. Property Listing & Search' },
    { id: 'booking', title: '3. Booking & Digital Leasing' },
    { id: 'payments', title: '4. Payments & Transactions' },
    { id: 'social', title: '5. Social & Community' },
    { id: 'admin', title: '6. Admin & Support Operations' },
    { id: 'profile', title: '7. User Profile & Notifications' },
    { id: 'reviews', title: '8. Reviews & Ratings' },
    { id: 'reporting', title: '9. Reporting & Safety' },
];

import { diagrams } from './activityDiagrams';
import { erDiagrams } from './erDiagrams';
import { sequenceDiagrams } from './sequenceDiagrams';
import { usecaseDiagrams } from './usecaseDiagrams';

const DiagramCard = ({ diag, index }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(diag.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadSVG = () => {
        const svgElement = document.querySelector(`#diagram-container-${index} svg`);
        if (!svgElement) {
            alert("Diagram is still rendering, please wait a moment.");
            return;
        }
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${diag.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDownloadDOCX = () => {
        const svgElement = document.querySelector(`#diagram-container-${index} svg`);
        if (!svgElement) {
            alert("Diagram is still rendering, please wait a moment.");
            return;
        }

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            const rect = svgElement.getBoundingClientRect();
            canvas.width = rect.width * 2;
            canvas.height = rect.height * 2;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const pngUrl = canvas.toDataURL('image/png');

            const htmlContent = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head><meta charset='utf-8'><title>${diag.title}</title></head>
            <body>
                <h1 style="font-family: Arial, sans-serif; color: #333;">${diag.title}</h1>
                <p style="font-family: Arial, sans-serif; color: #666; font-size: 14px;">${diag.description}</p>
                <br/>
                <img src="${pngUrl}" style="max-width: 100%; height: auto;" />
            </body>
            </html>
        `;

            const docBlob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
            const docUrl = URL.createObjectURL(docBlob);
            const link = document.createElement('a');
            link.href = docUrl;
            link.download = `${diag.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.doc`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
            URL.revokeObjectURL(docUrl);
        };
        img.src = url;
    };

    return (
        <div className="bg-[#111] border border-[#333] rounded-3xl overflow-hidden shadow-xl">
            <div className="p-5 md:p-6 border-b border-[#333] bg-[#1A1A1A] flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{diag.title}</h3>
                    <p className="text-white/60 text-sm mt-1">{diag.description}</p>
                </div>

                {/* Export Actions */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-white/80 hover:text-white transition-colors text-sm font-medium border border-[#333]"
                        title="Copy Mermaid Code"
                    >
                        {copied ? (
                            <>
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                Copy Code
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleDownloadSVG}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20 text-[#8b5cf6] hover:text-[#a78bfa] transition-colors text-sm font-medium border border-[#8b5cf6]/20"
                        title="Download SVG"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Export SVG
                    </button>

                    <button
                        onClick={handleDownloadDOCX}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 text-[#3b82f6] hover:text-[#60a5fa] transition-colors text-sm font-medium border border-[#3b82f6]/20"
                        title="Export to Word (DOCX)"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Export DOCX
                    </button>
                </div>
            </div>
            <div id={`diagram-container-${index}`} className="bg-[#0f0f0f] rounded-b-3xl relative">
                <MermaidDiagram chart={diag.code} />
            </div>
        </div>
    );
};

const SystemDocs = () => {
    const [activeSection, setActiveSection] = useState('auth');
    const [diagramType, setDiagramType] = useState('activity');

    const currentDiagrams =
        diagramType === 'activity' ? diagrams[activeSection] :
            diagramType === 'er' ? erDiagrams[activeSection] :
                diagramType === 'sequence' ? sequenceDiagrams[activeSection] :
                    usecaseDiagrams[activeSection];

    return (
        <div className="flex h-screen bg-black text-white pt-[70px]">
            {/* Sidebar Navigation */}
            <div className="w-80 bg-[#111] border-r border-[#333] h-full overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-[#8b5cf6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        System Docs
                    </h2>
                    <nav className="space-y-2">
                        {docSections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium flex items-center justify-between ${activeSection === section.id
                                        ? 'bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/20'
                                        : 'text-white/60 hover:text-white hover:bg-[#222]'
                                    }`}
                            >
                                {section.title}
                                <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 h-full overflow-y-auto bg-[#0a0a0a] p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
                        <div className="flex-1 pr-4">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {docSections.find(s => s.id === activeSection)?.title}
                            </h1>
                            <p className="text-white/60">
                                {diagramType === 'activity'
                                    ? 'Activity diagrams and system workflows for this module.'
                                    : diagramType === 'er'
                                        ? 'Entity-Relationship (ER) models for this module.'
                                        : diagramType === 'sequence'
                                            ? 'Sequence diagrams detailing system interactions between actors, client, and servers.'
                                            : 'Use Case diagrams illustrating actor interactions with the system.'}
                            </p>
                        </div>

                        {/* Toggle Switch */}
                        <div className="inline-flex flex-wrap md:flex-nowrap bg-[#111] border border-[#333] rounded-xl p-1 w-full xl:w-auto">
                            {[
                                { id: 'activity', label: 'Activity' },
                                { id: 'er', label: 'ER Models' },
                                { id: 'sequence', label: 'Sequence' },
                                { id: 'usecase', label: 'Use Case' }
                            ].map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setDiagramType(type.id)}
                                    className={`flex-1 xl:flex-none px-4 md:px-5 py-2.5 md:py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${diagramType === type.id
                                            ? 'bg-[#8b5cf6] text-white shadow-md'
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-12">
                        {currentDiagrams?.length > 0 ? (
                            currentDiagrams.map((diag, index) => (
                                <DiagramCard key={index} diag={diag} index={index} />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-[#111] rounded-3xl border border-[#333] border-dashed">
                                <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                <h3 className="text-xl font-bold text-white mb-2">Diagrams Pending</h3>
                                <p className="text-white/50">The diagrams for this section have not been drawn yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemDocs;
