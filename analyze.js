function main() {
  const march16 = new Date(2020, 02, 16);
  const data = require("./data.json").filter(
    // Filter out jobs that failed because they got stuck.
    // e.g. https://gitlab.com/tmobile/digital/tos/tos-apps/-/jobs/478412958
    d =>
      d.duration !== null &&
      d.status === 'success' &&
      d.duration > 210 &&
      d.duration < 90 * 60
      //!(d.duration > 3000 && d.status === "failed")
     // !(d.duration > 3000)
  );

  console.log("Duration:\n");
  printStats(x => x.duration, data, march16);
  console.log(
    "\n===============================================================\n"
  );
  console.log("Queued:\n");
  printStats(
    x =>
      (new Date(x.started_at).getTime() - new Date(x.created_at).getTime()) /
      1000,
    data,
    march16
  );
}

function printStats(getNumber, data, nxDate) {
  const groups = data.reduce(
    (acc, d) => {
      if (new Date(d.finished_at).getTime() >= nxDate) {
        acc.withNxCloud.push(Number(getNumber(d)));
      } else {
        acc.withoutNxCloud.push(Number(getNumber(d)));
      }
      return acc;
    },
    {
      withNxCloud: [],
      withoutNxCloud: []
    }
  );

  groups.withNxCloud.sort((a, b) => a - b);
  groups.withoutNxCloud.sort((a, b) => a - b);

  const maxWith = groups.withNxCloud[groups.withNxCloud.length - 1];
  const maxWithout = groups.withoutNxCloud[groups.withoutNxCloud.length - 1];
  const minWith = groups.withNxCloud[0];
  const minWithout = groups.withoutNxCloud[0];

  console.log("WITH NX CLOUD");
  console.log("-------------\n");
  console.log(`Max:                   ${maxWith}`);
  console.log(`Min:                   ${minWithout}`);
  console.log(`Mean:                  ${mean(groups.withNxCloud).toFixed(2)}`);
  console.log(`Median:                ${median(groups.withNxCloud)}`);
  console.log(`Mode (rounded to 5s): ${mode(groups.withNxCloud)}`);
  console.log();
  console.log("WITHOUT NX CLOUD");
  console.log("----------------\n");
  console.log(`Max:                   ${maxWithout}`);
  console.log(`Min:                   ${minWithout}`);
  console.log(
    `Mean:                  ${mean(groups.withoutNxCloud).toFixed(2)}`
  );
  console.log(`Median:                ${median(groups.withoutNxCloud)}`);
  console.log(`Mode (rounded to 5s): ${mode(groups.withoutNxCloud)}`);
  console.log();
  console.log(
    "Max with cloud:",
    data.find(d => getNumber(d) === maxWith).web_url
  );
  console.log(
    "Min with cloud:",
    data.find(d => getNumber(d) === minWith).web_url
  );
  console.log(
    "Max without cloud: ",
    data.find(d => getNumber(d) === maxWithout).web_url
  );
  console.log(
    "Min without cloud: ",
    data.find(d => getNumber(d) === minWithout).web_url
  );
}

function mean(xs) {
  return xs.reduce((s, x) => s + x, 0) / xs.length;
}

function mode(xs) {
  const counts = xs
    .map(x => Math.round(x / 5) * 5)
    .reduce((acc, x) => {
      const count = acc[x] || 0;
      acc[x] = count + 1;
      return acc;
    }, {});
  const sorted = Object.entries(counts).sort(([_, a], [__, b]) => b - a);
  return sorted[0][0];
}

function median(xs) {
  return xs[Math.floor(xs.length / 2)];
}

main();
