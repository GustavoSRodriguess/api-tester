import axios from 'axios';

const API_BASE_URL = 'http://localhost:3005';

interface ApiRequestData {
    method: string;
    url: string;
    body?: any;
    headers?: Record<string, string>;
}

export interface ProxyResponse { 
    status: number | null;
    headers: Record<string, string> | null;
    body: any | null;
    error?: string | null;
    size?: number | null;
    time?: number | null;
}

export const apiService = async (requestData: ApiRequestData): Promise<ProxyResponse> => {
    try {
        console.log(requestData)
        const response = await axios.post<ProxyResponse>(`${API_BASE_URL}/proxy`, requestData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Erro ao chamar o proxy do backend:', error);
        if (axios.isAxiosError(error) && error.response) {
            // Se o backend retornou um erro estruturado (ex: 400, 500 do próprio proxy)
            return error.response.data as ProxyResponse;
        }
        // Para outros tipos de erro (ex: rede, backend fora do ar)
        return {
            status: null,
            headers: null,
            body: null,
            error: error.message || 'Erro desconhecido ao conectar ao backend.',
            size: undefined,
            time: undefined
        };
    }
};