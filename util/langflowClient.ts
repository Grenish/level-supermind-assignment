export class LangflowClient {
    private applicationToken: string;

    constructor(applicationToken: string) {
        this.applicationToken = applicationToken;
    }

    async runFlow(flowId: string, langflowId: string, message: string, inputType: string = 'chat', outputType: string = 'chat', tweaks: any = {}, stream: boolean = false): Promise<any> {
        const url = `/api/chat`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    flowId,
                    langflowId,
                    message,
                    inputType,
                    outputType,
                    tweaks,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error in LangflowClient:', error);
            throw error;
        }
    }
}

