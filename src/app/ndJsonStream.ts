// ND-JSON response streamer
// See https://lichess.org/api#section/Introduction/Streaming-with-ND-JSON

export interface Stream {
  closePromise: Promise<void>;
  close(): Promise<void>;
}

export async function readStream<T>(
  response: Response,
  onChunk: (data: T) => void
): Promise<void> {
  if (!response.body) {
    throw new Error('Response has no body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    
    if (done) {
      // Process any remaining data in the buffer
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer) as T;
          onChunk(data);
        } catch (e: unknown) {
          console.error('Error parsing JSON:', e);
        }
      }
      break;
    }

    // Append new data to buffer and process complete lines
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    
    // Process all complete lines except the last one (which might be incomplete)
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();
      if (line) {
        try {
          const data = JSON.parse(line) as T;
          onChunk(data);
        } catch (e: unknown) {
          console.error('Error parsing JSON:', e);
        }
      }
    }
    
    // Keep the last (potentially incomplete) line in the buffer
    buffer = lines[lines.length - 1];
  }
}
