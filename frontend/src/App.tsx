import React, { useEffect, useRef } from 'react';
import { useStreamIngestion } from './hooks/useStreamIngestion';
import { ToolRegistryProvider, useToolRegistry } from './lib/ToolRegistry';
import { VisionTool } from './components/tools/VisionTool';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BrainCircuit } from 'lucide-react';

import { GenericTool } from './components/tools/GenericTool';

const TOOLS = {
    'vision_analyze': VisionTool,
    'generic_tool': GenericTool
};

const StreamRenderer = () => {
    const { blocks, isConnected } = useStreamIngestion('ws://localhost:3000');
    const { getTool } = useToolRegistry();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [blocks]);

    return (
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-12 flex flex-col gap-6 min-h-screen">
            <header className="sticky top-0 z-50 flex items-center justify-between py-4 -mx-4 px-4 md:-mx-6 md:px-6 backdrop-blur-xl bg-white/40 border-b border-white/20 mb-4 transition-all duration-300">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-system-blue shadow-[0_0_10px_rgba(0,122,255,0.5)]"></div>
                    <span className="font-semibold text-lg tracking-tight text-gray-900">Agent Stream</span>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full border ${isConnected ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                    {isConnected ? 'Live' : 'Disconnected'}
                </div>
            </header>

            <div className="flex-1 space-y-6">
                <AnimatePresence>
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
                        } else if (block.type === 'text') {
                            if (block.isThinking) {
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="backdrop-blur-md bg-white/30 border border-white/40 rounded-xl p-4 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                <BrainCircuit size={14} className="animate-pulse text-indigo-400" />
                                                Thinking Process
                                            </div>
                                            <div className="text-sm font-mono text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                                                {block.content}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            }
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="leading-relaxed text-[17px] text-gray-800 font-normal tracking-wide whitespace-pre-wrap break-words"
                                >
                                    {block.content}
                                </motion.div>
                            );
                        } else if (block.type === 'tool_call') {
                            const ToolComp = getTool(block.name);
                            if (!ToolComp) {
                                // Fallback to GenericTool for unknown tools
                                return (
                                    <div key={i}>
                                        <GenericTool args={block.args} result={block.result} name={block.name} />
                                    </div>
                                );
                            }
                            return (
                                <div key={i}>
                                    <ToolComp args={block.args} result={block.result} />
                                </div>
                            );
                        }
                        return null;
                    })}
                </AnimatePresence>
                <div ref={bottomRef} className="h-4" />
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
