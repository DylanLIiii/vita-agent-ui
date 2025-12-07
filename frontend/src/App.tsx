import React, { useEffect, useRef } from 'react';
import { useStreamIngestion } from './hooks/useStreamIngestion';
import { ToolRegistryProvider, useToolRegistry } from './lib/ToolRegistry';
import { VisionTool } from './components/tools/VisionTool';
import { TakeActionTool } from './components/tools/TakeActionTool';
import { ControlNavTool } from './components/tools/ControlNavTool';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BrainCircuit } from 'lucide-react';

import { GenericTool } from './components/tools/GenericTool';
import { ThinkingBlock } from './components/ThinkingBlock';

const TOOLS = {
    'vision_analyze': VisionTool,
    'take_action': TakeActionTool,
    'control_nav': ControlNavTool,
    'generic_tool': GenericTool
};

const StreamRenderer = () => {
    const { blocks, isConnected, availableClients, activeClientId, setActiveClientId } = useStreamIngestion('ws://localhost:61111');
    const { getTool } = useToolRegistry();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [blocks]);

    return (
        <div className="flex h-screen bg-gray-50/50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">Active Agents</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {availableClients.length === 0 ? (
                        <div className="text-sm text-gray-400 p-2 italic text-center">
                            No agents connected
                        </div>
                    ) : (
                        availableClients.map(client => (
                            <button
                                key={client.id}
                                onClick={() => setActiveClientId(client.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${activeClientId === client.id
                                        ? 'bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-100'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="truncate">{client.name}</div>
                                <div className="text-[10px] text-gray-400 truncate">{client.id}</div>
                            </button>
                        ))
                    )}
                </div>
                <div className="p-4 border-t border-gray-100">
                    <div className={`flex items-center gap-2 text-xs ${isConnected ? 'text-green-600' : 'text-red-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        {isConnected ? 'Server Connected' : 'Disconnected'}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <header className="sticky top-0 z-50 flex items-center justify-between py-4 px-6 backdrop-blur-xl bg-white/40 border-b border-white/20 transition-all duration-300">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-system-blue shadow-[0_0_10px_rgba(0,122,255,0.5)]"></div>
                        <span className="font-semibold text-lg tracking-tight text-gray-900">
                            {activeClientId
                                ? availableClients.find(c => c.id === activeClientId)?.name || 'Agent Stream'
                                : 'Agent Stream'
                            }
                        </span>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <AnimatePresence mode="popLayout">
                            {(!blocks || blocks.length === 0) && activeClientId && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center text-gray-400 py-20"
                                >
                                    Waiting for output from {availableClients.find(c => c.id === activeClientId)?.name}...
                                </motion.div>
                            )}

                            {blocks.map((block, i) => {
                                if (block.type === 'user_request') {
                                    return (
                                        <div key={i} className="flex justify-end">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-system-blue text-white px-4 py-2 rounded-2xl max-w-[80%] shadow-sm text-sm"
                                            >
                                                {block.content}
                                            </motion.div>
                                        </div>
                                    );
                                } else if (block.type === 'system') {
                                    return (
                                        <div key={i} className="flex justify-center my-2">
                                            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full uppercase tracking-wider">
                                                {block.content}
                                            </span>
                                        </div>
                                    );
                                } else if (block.type === 'text') {
                                    if (block.isThinking) {
                                        return (
                                            <div key={i} className="flex gap-3 my-2">
                                                {/* Spacer to align with avatar */}
                                                <div className="flex-shrink-0 w-8" />
                                                <ThinkingBlock content={block.content} />
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={i} className="flex gap-3 my-2">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
                                                <Sparkles size={14} />
                                            </div>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm max-w-[85%] leading-relaxed text-[15px] text-gray-800"
                                            >
                                                {block.content}
                                            </motion.div>
                                        </div>
                                    );
                                } else if (block.type === 'tool_call') {
                                    const ToolComp = getTool(block.name);
                                    if (!ToolComp) {
                                        // Fallback to GenericTool for unknown tools
                                        return (
                                            <div key={i} className="flex gap-3 my-2">
                                                <div className="flex-shrink-0 w-8" />
                                                <div className="w-full max-w-[85%]">
                                                    <GenericTool args={block.args} result={block.result} name={block.name} />
                                                </div>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={i} className="flex gap-3 my-2">
                                            <div className="flex-shrink-0 w-8" />
                                            <div className="w-full max-w-[85%]">
                                                <ToolComp args={block.args} result={block.result} />
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </AnimatePresence>
                        <div ref={bottomRef} className="h-4" />
                    </div>
                </div>
            </div>
        </div>
    );
};


function App() {
    return (
        <ToolRegistryProvider initialTools={TOOLS}>
            <StreamRenderer />
        </ToolRegistryProvider>
    );
}

export default App;
