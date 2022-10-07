/**
 * @file Save in a JSON file the top ~1000 shower thoughts from reddit,
 * https://www.reddit.com/r/Showerthoughts/top/?sort=top&t=all
 */
import { config } from './config';
import fetch from 'node-fetch';
import { writeFileSync } from 'fs';
const SHOWER_THOUGHTS_COUNT = 1_000;  // fetch no more than this many shower thoughts

type ShowerThought = {
  text: string;
  upvotes: number;
  author: string;
  url: string;
}

const showerThoughts: Array<ShowerThought> = [];
let after = '', count = 0;

// Paginate through Reddit threads
while (count < SHOWER_THOUGHTS_COUNT && after != null) {
  // Get the top threads of all time per https://www.reddit.com/dev/api#GET_{sort}
  const response = await fetch(`https://www.reddit.com/r/ShowerThoughts/top.json?t=all&limit=100&after=${after}`);
  const listing = (await response.json())['data'];  // https://www.reddit.com/dev/api#listings
  const threads = listing['children'];
  for (const { data: thread } of threads)  // alias the 'data' field to what it is here, a thread
    showerThoughts.push({
      text: thread.title,
      upvotes: thread.ups,
      author: thread.author,
      url: 'https://reddit.com' + thread.permalink,
    });
  after = listing['after'];
  count += threads.length;
  console.log(`Fetched ${threads.length} threads, with upvotes from ${threads[0].data.ups} to ${threads.at(-1).data.ups}. To resume, 'after' was ${after}.`);
}
writeFileSync(config.filename, JSON.stringify(showerThoughts, null, 4));
console.log(`Dumped ${showerThoughts.length} thread titles to ${config.filename}`);
