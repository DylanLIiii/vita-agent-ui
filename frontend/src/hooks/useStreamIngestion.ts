import { useState, useEffect, useRef } from 'react';
import { StreamParser } from '../lib/streamParser';
import { StreamState, StreamChunk } from '../types';

export function useStreamIngestion(url: string) {
    const [state, setState] = useState<StreamState>({
        blocks: [],
        isThinking: false,
        isConnected: false,
    });

    const parserRef = useRef(new StreamParser());

    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log('Connected to WS');
            setState(s => ({ ...s, isConnected: true }));
        };

        ws.onmessage = (event) => {
            try {
                const chunk: StreamChunk = JSON.parse(event.data);
                const updatedBlocks = parserRef.current.processChunk(chunk);
                setState(s => ({ ...s, blocks: updatedBlocks }));
            } catch (e) {
                console.error("Failed to parse chunk", e);
            }
        };

        ws.onclose = () => {
            console.log('Disconnected from WS');
            setState(s => ({ ...s, isConnected: false }));
        };

        return () => {
            ws.close();
        };
    }, [url]);

    return state;
}
