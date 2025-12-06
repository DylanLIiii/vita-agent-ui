import React from 'react';
import { motion } from 'framer-motion';
import { Eye, MapPin } from 'lucide-react';

export const VisionTool: React.FC<{ args: any; result?: any }> = ({ args, result }) => {
    const { mode, image, question } = args;

    // Mode 1: VQA
    if (mode === 1) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm my-4"
            >
                <div className="relative">
                    <img src={image} alt="Analysis Target" className="w-full h-56 object-cover" />
                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Eye size={12} />
                        <span>Vision Analysis</span>
                    </div>
                </div>

                <div className="p-4 space-y-3">
                    <div className="text-sm font-medium text-gray-900 leading-snug">"{question}"</div>
                    {result && (
                        <div className="flex gap-2 items-start mt-2 pt-2 border-t border-gray-100">
                            <div className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase mt-0.5">Result</div>
                            <div className="text-sm text-gray-600 leading-relaxed">{result}</div>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }

    // Mode 2: Object Detection (Placeholder)
    if (mode === 2) {
        return (
            <div className="p-4 bg-gray-100 rounded-lg">
                Mode 2 Visualization
            </div>
        )
    }

    return <div>Unknown Mode</div>;
};
