import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import Select from './Select';
import { apiService, type ProxyResponse} from '../Services/apiService'; // Importar o serviço

interface Header {
    id: string;
    keyName: string;
    value: string;
}

// Usar a interface ProxyResponse importada para o estado da resposta
const HomePage: React.FC = () => {
    const [url, setUrl] = useState<string>('https://jsonplaceholder.typicode.com/todos/1');
    const [method, setMethod] = useState<string>('GET');
    const [headers, setHeaders] = useState<Header[]>([{ id: Date.now().toString(), keyName: '', value: '' }]);
    const [requestBody, setRequestBody] = useState<string>('');
    const [response, setResponse] = useState<ProxyResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const httpMethods = [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
        { value: 'PATCH', label: 'PATCH' },
        { value: 'OPTIONS', label: 'OPTIONS' },
        { value: 'HEAD', label: 'HEAD' },
    ];

    const handleAddHeader = () => {
        setHeaders([...headers, { id: Date.now().toString(), keyName: '', value: '' }]);
    };

    const handleHeaderChange = (index: number, field: 'keyName' | 'value', fieldValue: string) => {
        const newHeaders = headers.map((header, i) => {
            if (i === index) {
                return { ...header, [field]: fieldValue };
            }
            return header;
        });
        setHeaders(newHeaders);
    };

    const handleRemoveHeader = (id: string) => {
        setHeaders(headers.filter(header => header.id !== id));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setResponse(null);

        const filteredHeaders = headers.reduce((acc, header) => {
            if (header.keyName.trim() !== '') {
                acc[header.keyName.trim()] = header.value.trim();
            }
            return acc;
        }, {} as Record<string, string>);

        let parsedBody: any = requestBody;
        if (method !== 'GET' && method !== 'HEAD' && requestBody.trim() !== '') {
            try {
                parsedBody = JSON.parse(requestBody);
            } catch (error) {
                console.warn("Corpo da requisição não é um JSON válido, enviando como texto.");
            }
        }

        const apiRequestData = {
            url,
            method,
            headers: filteredHeaders,
            body: (method !== 'GET' && method !== 'HEAD' && requestBody.trim() !== '') ? parsedBody : undefined,
        };

        console.log('Enviando requisição para o backend:', apiRequestData);

        const apiResponse = await apiService(apiRequestData);
        setResponse(apiResponse);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 font-sans">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-center text-indigo-400 tracking-tight">Banana</h1>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* input */}
                <section className="space-y-6 p-6 bg-gray-800 rounded-lg shadow-2xl">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-indigo-300 border-b border-gray-700 pb-2">Configuração da Requisição</h2>
                        <Input
                            label="URL da API"
                            id="apiUrl"
                            type="url"
                            placeholder="https://exemplo.com/api/recurso"
                            value={url}
                            onChange={(e: any) => setUrl(e.target.value)}
                            containerClassName="mb-4"
                        />
                        <Select
                            label="Método HTTP"
                            id="httpMethod"
                            options={httpMethods}
                            value={method}
                            onChange={(e: any) => setMethod(e.target.value)}
                            containerClassName="mb-6"
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3 text-indigo-300">Cabeçalhos (Headers)</h2>
                        {headers.map((header, index) => (
                            <div key={header.id} className="flex items-center space-x-2 mb-2">
                                <Input
                                    type="text"
                                    placeholder="Chave (ex: Content-Type)"
                                    value={header.keyName}
                                    onChange={(e: any) => handleHeaderChange(index, 'keyName', e.target.value)}
                                    className="flex-1"
                                    containerClassName="mb-0"
                                />
                                <Input
                                    type="text"
                                    placeholder="Valor (ex: application/json)"
                                    value={header.value}
                                    onChange={(e: any) => handleHeaderChange(index, 'value', e.target.value)}
                                    className="flex-1"
                                    containerClassName="mb-0"
                                />
                                <Button onClick={() => handleRemoveHeader(header.id)} variant="danger" className="px-3 py-2 mb-3 h-10">
                                    X
                                </Button>
                            </div>
                        ))}
                        <Button onClick={handleAddHeader} variant="secondary" className="mt-2 text-sm">
                            Adicionar Cabeçalho
                        </Button>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-3 text-indigo-300">Corpo da Requisição (Body)</h2>
                        <textarea
                            rows={6}
                            placeholder='{\n  "chave": "valor",\n  "numero": 123,\n  "booleano": true\n}'
                            value={requestBody}
                            onChange={(e) => setRequestBody(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white resize-y"
                            disabled={method === 'GET' || method === 'HEAD' || method === 'DELETE' || method === 'OPTIONS'}
                        />
                        {(method === 'GET' || method === 'HEAD' || method === 'DELETE' || method === 'OPTIONS') &&
                            <p className="text-xs text-gray-400 mt-1">O corpo da requisição geralmente não é usado com o método {method}.</p>}
                    </div>

                    <Button onClick={handleSubmit} variant="primary" className="w-full mt-8 py-3 text-base" disabled={isLoading || !url.trim()}>
                        {isLoading ? 'Enviando...' : 'Enviar Requisição'}
                    </Button>
                </section>

                {/* response */}
                <section className="space-y-6 p-6 bg-gray-800 rounded-lg shadow-2xl">
                    <h2 className="text-2xl font-semibold text-indigo-300 border-b border-gray-700 pb-2">Resposta da API</h2>
                    {isLoading && (
                        <div className="flex justify-center items-center h-full min-h-[200px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
                        </div>
                    )}
                    {!isLoading && !response && (
                        <div className="p-4 border border-dashed border-gray-700 rounded-md min-h-[300px] flex items-center justify-center">
                            <div className="text-gray-500 text-center">
                                <pre className="mb-2">
<pre className="text-sm text-gray-500 whitespace-pre-wrap">
{`
              ,---------------------------,             
              |  /---------------------\   |             
              | |                       | |             
              | |     Aguardadno        | |             
              | |      requisição       | |             
              | |                       | |             
              | |                       | |             
              | \\______________________/  |             
              |___________________________|             
            ,---\_____     []     _______/------,       
          /         /______________\           /|       
        /___________________________________ /  | ___   
        |                                   |   |    )  
        |  _ _ _                 [-------]  |   |   (   
        |  o o o                 [-------]  |  /    _)_ 
        |__________________________________ |/     /  / 
    /-------------------------------------/|      ( )/ 
  /-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/ /            
/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/ /             
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~                
`}
</pre>
                                </pre>
                                {/* <p>Aguardando requisição para exibir a resposta aqui.</p> */}
                            </div>
                        </div>
                    )}
                    {!isLoading && response && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-indigo-200">Status:
                                    <span className={`ml-2 font-bold ${response.status && response.status >= 200 && response.status < 300 ? 'text-green-400' : 'text-red-400'}`}>
                                        {response.status || 'N/A'}
                                    </span>
                                </h3>
                                {response.time !== undefined && <p className="text-sm text-gray-400">Tempo: {response.time} ms</p>}
                                {response.size && <p className="text-sm text-gray-400">Tamanho: {response.size}</p>}
                            </div>

                            {response.headers && Object.keys(response.headers).length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium text-indigo-200 mb-1">Cabeçalhos da Resposta:</h3>
                                    <pre className="bg-gray-700 p-3 rounded-md text-sm overflow-x-auto whitespace-pre-wrap break-all">
                                        {JSON.stringify(response.headers, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {response.body !== undefined && response.body !== null && (
                                <div>
                                    <h3 className="text-lg font-medium text-indigo-200 mb-1">Corpo da Resposta:</h3>
                                    <pre className="bg-gray-700 p-3 rounded-md text-sm overflow-x-auto whitespace-pre-wrap break-all">
                                        {typeof response.body === 'string' ? response.body : JSON.stringify(response.body, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {response.error && (
                                <div>
                                    <h3 className="text-lg font-medium text-red-400 mb-1">Erro:</h3>
                                    <pre className="bg-gray-700 p-3 rounded-md text-sm text-red-300 overflow-x-auto whitespace-pre-wrap break-all">
                                        {response.error}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>

            <footer className="mt-12 text-center text-sm text-gray-500">
                <p>Projeto Testador de API - Criado com Manus</p>
            </footer>
        </div>
    );
};

export default HomePage;

