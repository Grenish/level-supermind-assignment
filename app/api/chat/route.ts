import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const apiKey = process.env.NEXT_GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const MODEL_NAME = "gemini-2.0-flash-exp";

interface Message {
    role: "user" | "model";
    content: string;
}

export async function POST(req: Request): Promise<Response> {
    try {
        const { messages }: { messages: Message[] } = await req.json();
        const latestMessage = messages[messages.length - 1]?.content?.toLowerCase();

        if (!latestMessage) {
            return errorResponse("No message content provided.", 400);
        }

        if (isGraphRequest(latestMessage)) {
            return await handleGraphRequest(latestMessage);
        } else {
            return await handleChatRequest(messages, latestMessage);
        }
    } catch (error) {
        console.error("Error:", error);
        return errorResponse("An error occurred while processing your request.");
    }
}

function isGraphRequest(message: string): boolean {
    return message.includes("generate") && message.includes("graph");
}

async function handleGraphRequest(prompt: string): Promise<Response> {
    const graphPrompt = `Generate a graph with the following details:
    1. A title for the graph
    2. Type of graph (line, bar, etc.)
    3. X-axis label
    4. Y-axis label
    5. 7 data points with labels and values
    6. A brief analysis of the data (2-3 sentences)

    Format the response as a JSON object with the following structure:
    {
      "title": "string",
      "type": "string",
      "xAxis": "string",
      "yAxis": "string",
      "data": [
        { "label": "string", "value": number }
      ],
      "analysis": "string"
    }`;

    try {
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: `You're Reah, a data analyst and advisor. Generate relevant graphs 
        and provide beneficial conclusions for the user.`,
        });

        const result = await model.startChat({
            generationConfig: {
                temperature: 1,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
                responseMimeType: "text/plain",
            },
            history: [
                {
                    role: "user",
                    parts: [{ text: prompt }],
                },
            ],
        }).sendMessage("Generate graph");

        const responseText = result.response?.text();
        if (!responseText) {
            throw new Error("Empty response from model.");
        }

        const graphData = JSON.parse(responseText);

        return new Response(
            JSON.stringify({
                role: "assistant",
                content: "Here's the generated graph and its analysis:",
                graphData,
            }),
            { headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error generating graph:", error);
        return errorResponse("Failed to generate graph data.");
    }
}

async function handleChatRequest(messages: Message[], latestMessage: string): Promise<Response> {
    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const chat = model.startChat({
            generationConfig: {
                temperature: 1,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
                responseMimeType: "text/plain",
            },
            history: messages.slice(0, -1).map(({ role, content }) => ({
                role,
                parts: [{ text: content }],
            })),
        });

        const result = await chat.sendMessage(latestMessage);
        const responseText = result.response?.text() || "No response generated.";

        return new Response(
            JSON.stringify({ role: "assistant", content: responseText }),
            { headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error handling chat:", error);
        return errorResponse("Failed to process the chat request.");
    }
}

function errorResponse(message: string, status = 500): Response {
    return new Response(
        JSON.stringify({ error: message }),
        { status, headers: { "Content-Type": "application/json" } }
    );
}
