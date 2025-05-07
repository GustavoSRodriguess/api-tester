const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

app.post("/proxy", async (req, res) => {
    const { url, method, headers: clientHeaders, body: requestBody } = req.body;
    console.log(url)
    console.log(method)
    console.log(clientHeaders)
    console.log(requestBody)
    
    if(!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    if(!method) {
        return res.status(400).json({ error: 'Method is required' });
    }
    try {
        const startTime = Date.now();
        const response = await axios({
            method: method,
            url: url,
            headers: clientHeaders || {},
            data: requestBody,
            validateStatus: function (status) {
                return status >= 200 && status < 600;
            }
        });
        const endTime = Date.now();
        const duration = endTime - startTime;
        res.json(response.data);

        let responseSize = 0;
        if(response.data) {
            responseSize = Buffer.byteLength(JSON.stringify(response.data), 'utf8');
        }
        console.log(`Request to ${url} took ${duration}ms and returned ${response.status} with size ${responseSize} bytes`);
        if(response.headers) {
            responseSize += Buffer.byteLength(JSON.stringify(response.headers), 'utf8');
            console.log(`Response headers size: ${responseSize} bytes`);
        }

        res.json({
            status: response.status,
            headers: response.headers,
            body: response.data,
            time: duration,
            size: `${(responseSize / 1024).toFixed(2)} KB`,
        });
    } catch (error) {
        if(error.response) {
            const errorResponse = error.response.data || error.message;
            const errorStatus = error.response.status || 500;
            console.error(`Error: ${errorResponse}, Status: ${errorStatus}`);
            res.status(errorStatus).json({ error: errorResponse });
        }
        else if(error.request) {
            console.error(`no response received: ${error.message}`);
            res.status(500).json({ error: 'no response received' });
        } else {
            console.error(`Error: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }
});
app.get('/health', (req, res) => {
    res.json({ status: 'UP' });
});

app.listen(PORT,"0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});