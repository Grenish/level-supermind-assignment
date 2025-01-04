import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { flowId, langflowId, message, inputType, outputType, tweaks } = await req.json();

    const apiUrl = `https://api.langflow.astra.datastax.com/lf/${langflowId}/api/v1/run/${flowId}?stream=false`;
    const applicationToken = process.env.NEXT_PUBLIC_LANGFLOW_APPLICATION_TOKEN;

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${applicationToken}`,
            },
            body: JSON.stringify({
                input_value: message,
                input_type: inputType || "chat",
                output_type: outputType || "chat",
                tweaks: tweaks || {},
            }),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch: ${response.statusText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Proxy Error:", error);
        return NextResponse.json({ error: "An error occurred during the request." }, { status: 500 });
    }
}
