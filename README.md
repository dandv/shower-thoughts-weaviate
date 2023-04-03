# Weaviate Demo App - Shower thoughts

Node.js app that imports the top ~1000 [shower thoughts](https://reddit.com/r/showerthoughts) from reddit, and displays the most amusing ones (per redditors' opinions) that match a given topic.

## Live demo

https://shower-thoughts-weaviate.dandv.me/

## Usage

1. Set up the project:
   ```bash
   git clone https://github.com/dandv/shower-thoughts-weaviate
   cd shower-thoughts-weaviate
   npm install

2. Optionally update the shower thoughts JSON file. The `shower-thoughts.json` from the repo is up-to-date as of 2023-April-04.
   ```bash
   npm run reddit  # updates shower-thoughts.json from reddit.com

3. Create a Weaviate instance. This can be as simple as running the single-executable Linux binary from the [latest release](https://github.com/weaviate/weaviate/releases), or signing up for a [free Weaviate Cloud Services sandbox](https://console.weaviate.cloud), or running a [Docker container](https://weaviate.io/developers/weaviate/installation) locally.

4. Create a `.env` file in the project directory with the following keys:
   ```text
   OPENAI_APIKEY=...get this from https://platform.openai.com/account/api-keys...
   # The following two keys are only necessary if you use WCS; not if using Docker
   WEAVIATE_HOST=...sign up at https://console.weaviate.cloud...
   WEAVIATE_API_KEY=...get the Admin key from Weaviace Cloud Services...
   GRAPHQL_URL=http://localhost:3000/v1/graphql
   ```

   * Take note of the Weaviate cluster hostname, e.g. `localhost:8080` for Docker or `shower-thoughts-ctv1de32.weaviate.network` if using WCS. Store this in the `.env` file as the `WEAVIATE_HOST`.

   * For WCS, click on the cluster Details then the key 🔑 icon and copy the Admin key. Store it as `WEAVIATE_API_KEY` in the `.env` file.

5. Create the Weaviate schema and import the data from the JSON file
   ```bash
   npm run ingest

6. Launch the app server (a simple proxy necessary to protect the OpenAI key from being exposed on the client).
   ```bash
   npm run server

7. Launch the web app
   ```bash
   # in a new terminal...
   npm start
