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
npm run server
npm start
```

## Weaviate feedback / issues discovered during development

* [Need explicit documentation for the JavaScript client methods](https://github.com/semi-technologies/weaviate-javascript-client/issues/90)

* OpenAI requiring an API key for querying, means the GraphiQL explorer can’t be used (there’s no way to set header values)

* > "Starting with v1.11.0 the OPENAI_APIKEY variable is now optional and you can instead provide the key at insert/query time as an HTTP header."
  - that was not exctly the case. When `OPENAI_APIKEY` was set, the JavaScript client didn’t proxy it to text2vec-openai.

* The WCS console logs out all clients every hour.

* Would help to mention how to prevent importing duplicate objects. Critical when the import fails, e.g. due to rate limits.

* Document that deleting a schema also deletes all objects of that type.

* Would help to explain why `dataType` is an array of one element.

* The Import tutorial should mention that vectorWeights will be null, and explain why `vector` isn't output at `/v1/objects`

* https://weaviate.io/developers/weaviate/current/schema/schema-configuration.html#class-object explains the `vectorizer` property, but not the `moduleConfig` one.

* In the Wikipedia dataset, `hasParagraphs` suggests a boolean value. Just `paragraphs` would suggest the paragraphs themselves.

* The `order` property isn’t explained at https://weaviate.io/developers/weaviate/current/getting-started/query.html, and it should be added to the [glossary](https://weaviate.io/developers/weaviate/current/more-resources/glossary.html)