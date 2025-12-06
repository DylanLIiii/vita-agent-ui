import asyncio
import websockets
import json

async def stream_data():
    uri = "ws://localhost:3000"
    
    steps = [
        {"type": "user_request", "content": "Can you analyze this image for me?"},
        {"type": "token", "content": "Hello from Python! "},
        {"type": "token", "content": "I "},
        {"type": "token", "content": "am "},
        {"type": "token", "content": "streaming "},
        {"type": "token", "content": "data "},
        {"type": "token", "content": "now.\n"},
        {"type": "token", "content": "<thinking>"},
        {"type": "token", "content": "Connecting "},
        {"type": "token", "content": "to "},
        {"type": "token", "content": "neural "},
        {"type": "token", "content": "engine... "},
        {"type": "token", "content": "</thinking>"},
        {"type": "tool_call", "name": "vision_analyze", "args": {"mode": 1, "image": "https://images.unsplash.com/photo-1542281286-9e0a56e2e1a1?q=80&w=2000&auto=format&fit=crop", "question": "Analyze this landscape"}, "id": "call_py_1"},
        {"type": "tool_result", "id": "call_py_1", "result": "Mountainous landscape with forests"},
        {"type": "token", "content": "The "},
        {"type": "token", "content": "analysis "},
        {"type": "token", "content": "is "},
        {"type": "token", "content": "complete!"},
        {"type": "token", "content": "\nNow trying a generic tool...\n"},
        {"type": "tool_call", "name": "custom_search", "args": {"query": "Latest AI agents", "filters": ["news", "code"]}, "id": "call_py_2"},
        {"type": "tool_result", "id": "call_py_2", "result": {"hits": 5, "top_hit": "LangChain Agent"}}
    ]

    async with websockets.connect(uri) as websocket:
        print(f"Connected to {uri}")
        
        for step in steps:
            await websocket.send(json.dumps(step))
            print(f"Sent: {step}")
            await asyncio.sleep(0.2)
            
        print("Stream finished")

if __name__ == "__main__":
    try:
        asyncio.run(stream_data())
    except KeyboardInterrupt:
        print("Stream stopped")
    except Exception as e:
        print(f"Error: {e}")
