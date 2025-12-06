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
                className="w-full max-w-md bg-white/50 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-sm my-4"
            >
                <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-500">
                    <Eye size={16} className="text-system-blue" />
                    <span>Vision Analysis</span>
                </div>

                <div className="relative rounded-xl overflow-hidden mb-3">
                    <img src={image} alt="Analysis Target" className="w-full h-48 object-cover" />
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-900">"{question}"</div>
                    {result && (
                        <div className="text-sm text-gray-600 bg-white/40 p-2 rounded-lg border border-white/20">
                            Result: {result}
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
