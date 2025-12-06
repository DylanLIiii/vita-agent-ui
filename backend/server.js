const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Stream Viewer Backend');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.send(JSON.stringify({ type: 'token', content: 'Connected to Stream Server...\n' }));

    ws.on('message', (message) => {
        // Parse message to ensure it's valid JSON (optional safety)
        try {
            const data = JSON.parse(message);
            // Broadcast to ALL other clients (except sender)
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        } catch (e) {
            console.error("Invalid JSON received", e);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Mock Producer logic to simulate LangChain stream
function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Endpoint or Trigger to start a mock stream
// specific to "Simulating LangChain"
// We will expose a simple interval loop to test the frontend
const startMockStream = () => {
    console.log("Starting mock stream...");

    const steps = [
        { type: 'token', content: "Hello! " },
        { type: 'token', content: "I " },
        { type: 'token', content: "will " },
        { type: 'token', content: "check " },
        { type: 'token', content: "that " },
        { type: 'token', content: "for " },
        { type: 'token', content: "you.\n" },
        { type: 'token', content: "<thinking>" },
        { type: 'token', content: "Checking " },
        { type: 'token', content: "weather " },
        { type: 'token', content: "API " },
        { type: 'token', content: "for " },
        { type: 'token', content: "San " },
        { type: 'token', content: "Francisco." },
        { type: 'token', content: "</thinking>" },
        { type: 'tool_call', name: 'vision_analyze', args: { mode: 1, image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=2000&auto=format&fit=crop', question: 'What is the weather like?' }, id: 'call_1' },
        { type: 'tool_result', id: 'call_1', result: 'Sunny, 25C' },
        { type: 'token', content: "The " },
        { type: 'token', content: "weather " },
        { type: 'token', content: "is " },
        { type: 'token', content: "sunny." },
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i >= steps.length) {
            clearInterval(interval);
            return;
        }
        broadcast(steps[i]);
        i++;
    }, 200); // 200ms delay between chunks
};

// Start mock stream after 5 seconds automatically for testing (or loop it)
setInterval(() => {
    if (wss.clients.size > 0) {
        // Only start if someone is listening and we haven't flooded them recently?
        // For now, let's just expose a way to trigger it? 
        // Or just run it once a client connects?
    }
    // Simple auto-trigger for demo purposes every 10s if clients connected?
    // startMockStream(); 
}, 15000);

// The previous second wss.on('connection') block is now integrated into the first one.
// The setTimeout(startMockStream, 2000); call is removed as it was not part of the requested change.

server.listen(3000, () => {
    console.log('Server started on port 3000');
});

