const fs = require("fs");
const bent = require("bent");
const getJSON = bent("json");
const { subMonths } = require("date-fns");
require('dotenv').config();

# See: https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html
const API_KEY = process.env.GITLAB_API_KEY;

# GitLab throttles its API
const DELAY = Number(process.env.DELAY) || 1000;

main().catch(e => console.error(e));

async function main() {
  const earliest = subMonths(new Date(), 1).getTime();
  let data = [];
  let page = 1;

  while (true) {
    console.log(`Fetching page ${page}`);
    const ps = await getJSON(
      `https://gitlab.com/api/v4/projects/17349538/pipelines?page=${page}`,
      null,
      {
        "PRIVATE-TOKEN": API_KEY,
      }
    );

    if (!ps[0] || new Date(ps[0].updated_at).getTime() < earliest) {
      break;
    }
    page++;

    await Promise.all(
      ps.map(async (p) => {
        await delay(DELAY);
        const d = await getJSON(
          `https://gitlab.com/api/v4/projects/17349538/pipelines/${p.id}`,
          null,
          {
            "PRIVATE-TOKEN": API_KEY,
          }
        );
        const x = {
          ...p,
          ...d,
        };
        console.log(x);
        data.push(x);
      })
    );

    await delay(20000);
  }

  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

