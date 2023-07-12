/**
 * @file Data ingestion for the Shower Thoughts Weaviate demo app:
 * - create schema
 * - parse the JSON exported by the reddit script (shower-thoughts.json)
 * - import the data into the cluster, trying to account for the OpenAI rate limiting
 */
import { config } from './config';
import weaviate, { ApiKey } from 'weaviate-ts-client';
import showerThoughts from './shower-thoughts.json' assert { type: 'json' };

const client = weaviate.client({
  scheme: config.scheme,
  host: config.host,
  apiKey: new ApiKey(config.weaviateApiKey),
  headers: { 'X-OpenAI-Api-Key': config.openAiApiKey },
});

const showerThoughtClass = {
  class: 'ShowerThought',
  description: 'A type of thought you might have while carrying out a routine task like showering, driving, or daydreaming; a miniature epiphany you have that highlights the oddities within the familiar',

  // https://weaviate.io/developers/weaviate/current/retriever-vectorizer-modules/text2vec-openai.html
  vectorizer: 'text2vec-openai',
  moduleConfig: {
    'text2vec-openai': {
      model: 'davinci',
      modelVersion: '003',
      type: 'text',  // as opposed to 'code';
    },
  },

  properties: [
    {
      name: 'text',
      dataType: ['text'],
      description: 'The text of the shower thought',
    },
    {
      name: 'upvotes',
      dataType: ['int'],
      description: 'The number of upvotes on /r/showerthoughts',
    },
    {
      name: 'author',
      dataType: ['text'],
      description: 'The reddit username of the author',
    },
    {
      name: 'url',
      dataType: ['text'],
      description: 'Link to the reddit thread of the shower thought',
    },
  ],
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Return whether a shower thought has already been imported. Used to avoid creating duplicates.
async function exists(showerThoughtText: string): Promise<boolean> {
  const result = await client.graphql
    .get()
    .withClassName('ShowerThought')
    .withFields('upvotes')  // we don't really need any field; `upvotes` is the shortest
    .withWhere({
      path: ['text'],
      operator: 'Equal',
      valueString: showerThoughtText,
    })
    .withLimit(1)
    .do();
  return result.data.Get.ShowerThought.length > 0;
}

let potentialErrors = 0;
async function importData() {
  const batchSize = 60;
  let batcher = client.batch.objectsBatcher();
  let counter = 0;

  async function importBatch() {
    try {
      const response = await batcher.do();
      // Check for vectorizer errors like "OpenAI API Key: no api key found" or "Rate limit reached"
      const error = response.find(r => r.result.errors?.error[0]?.message);
      if (error) {
        potentialErrors++;
        throw new Error(error.result.errors.error[0].message);
      }
      console.log(`Imported ${response.length} objects.`);
    } catch (e) {
      console.error(e.message);
    }
  }

  for (const st of showerThoughts) {
    const obj = {
      class: 'ShowerThought',
      properties: st,
    };
    // Add the object to the batch queue if it hasn't been imported already
    if (!await exists(st.text)) {
      batcher = batcher.withObject(obj);
      counter++;
    }
    if (counter >= batchSize) {
      await importBatch();
      // await sleep(80 * 1000);  // uncomment if necessary; 70s still resulted in rate limiting
      batcher = client.batch.objectsBatcher();
      counter = 0;
    }
  }
  // Import the last batch
  await importBatch();
}

// Create the schema
try {
  await client.schema.classDeleter().withClassName('ShowerThought').do();  // uncomment to delete all objects
  await client.schema.classCreator().withClass(showerThoughtClass).do();
} catch (e) {
  // If the schema already exists, that's fine. Otherwise, re-throw.
  if (e.message.search('422') === -1)  // https://github.com/weaviate/weaviate/issues/2708
    throw e;
}

console.log('Schema ready, importing data...');
// Import the shower thoughts
await importData();
if (potentialErrors)
  console.log('Some object were skipped during import. Re-run until no new objects have been imported.');
else
  console.log('Import finished.');
