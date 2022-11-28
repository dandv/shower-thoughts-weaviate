# Weaviate Demo App - Shower thoughts

Node.js app that imports the top ~1000 [shower thoughts](https://reddit.com/r/showerthoughts) from reddit, and displays the most amusing ones (per redditors' opinions) that match a given topic.

## Live demo

https://shower-thoughts-weaviate.dandv.me/

## Usage

1. Obtain an [OpenAI key](https://beta.openai.com/account/api-keys) and store it in the `.env` file.
2. Optionally fetch the shower thoughts into a JSON file (`shower-thoughts.json` is included for convenience in the repo)
3. Optionally create the Weaviate schema and import the data from the JSON file (a WCS instance has been already created, `shower-thoughts.semi.network`)
4. Launch the app server (a simple proxy necessary to protect the OpenAI key from being exposed on the client)
5. Launch the web app

```bash
git clone https://github.com/dandv/shower-thoughts-weaviate
cd shower-thoughts-weaviate
npm install
# npm run reddit  # shower-thoughts.json is included in the repo
# npm run ingest  # the file has already been imported
nano .env  # add the OpenAI API key
npm run server  # ...then in a new terminal...
npm start
```
