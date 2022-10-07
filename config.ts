// Config file. In addition to this, index.html uses process.env.GRAPHQL_URL (dev vs. prod server)
import 'dotenv/config';
export const config = {
  filename: 'shower-thoughts.json',
  host: 'shower-thoughts.semi.network/',
  scheme: 'https',
  openAiApiKey: process.env.OPENAI_APIKEY,
};
