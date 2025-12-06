import React from 'react';
import { Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export const GenericTool: React.FC<{ args: any; result?: any; name?: string }> = ({ args, result, name = 'Tool Call' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-apple-gray-50 border border-apple-gray-200 rounded-xl p-4 my-2 font-mono text-xs shadow-sm"
        >
            <div className="flex items-center gap-2 mb-2 text-apple-gray-600 font-semibold uppercase tracking-wider">
                <Terminal size={14} />
                <span>{name}</span>
            </div>

            <div className="space-y-3">
                <div>
                    <div className="text-apple-gray-400 mb-1">Input (Args)</div>
                    <pre className="bg-white p-3 rounded-lg border border-apple-gray-100 overflow-x-auto text-apple-gray-800">
                        {JSON.stringify(args, null, 2)}
                    </pre>
                </div>

                {result && (
                    <div>
                        <div className="text-apple-gray-400 mb-1">Result</div>
                        <pre className="bg-green-50 p-3 rounded-lg border border-green-100 overflow-x-auto text-green-800">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
