// Simple proxy server to protect the OpenAI API key from exposure on the client.
// Adds the OpenAI API key to every request from the client, and returns the response from Weaviate.
// Based on https://github.com/chimurai/http-proxy-middleware
import { config } from './config';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Create Express server
const app = express();

// Configuration
const PORT = 3000;
app.use('/', createProxyMiddleware({
  target: config.scheme + '://' + config.host,
  changeOrigin: true,  // required; "needed for virtual hosted sites"
  headers: {
    'Authorization': 'Bearer ' + config.weaviateApiKey,
    'X-OpenAI-Api-Key': config.openAiApiKey,
  },
}));

// Start the Proxy
app.listen(PORT, 'localhost', () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
