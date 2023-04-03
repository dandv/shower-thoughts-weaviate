// Config file. In addition to this, index.html uses process.env.GRAPHQL_URL (dev vs. prod server)
import 'dotenv/config';
export const config = {
  filename: 'shower-thoughts.json',
  host: process.env.WEAVIATE_HOST,
  scheme: 'https',
  weaviateApiKey: process.env.WEAVIATE_API_KEY,
  openAiApiKey: process.env.OPENAI_APIKEY,
};
