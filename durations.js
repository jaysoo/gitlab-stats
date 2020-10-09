function main() {
  const data = require("./data.json").filter(
    // Filter out jobs that failed because they got stuck.
    // e.g. https://gitlab.com/tmobile/digital/tos/tos-apps/-/jobs/478412958
    (d) =>
      d.duration !== null &&
      d.status === "success" &&
      d.duration > 210 &&
      d.duration < 90 * 60 &&
      d.before_sha !== "0000000000000000000000000000000000000000" &&
      d.ref !== "tmo/master" &&
      !d.ref.startsWith("refs/merge-requests/")
    //!(d.duration > 3000 && d.status === "failed")
    // !(d.duration > 3000)
  );

  const last = data[0];
  const first = data[data.length - 1];
  const durations = data.map((d) => d.duration);
  const max = Math.max(...durations);
  const min = Math.min(...durations);
  const total = durations.reduce((t, d) => t + d);
  const avg = total / durations.length;
  const median = durations[Math.floor(durations.length / 2)];
  const maxJob = data.find((d) => d.duration === max);
  const minJob = data.find((d) => d.duration === min);
  const medianJob = data.find((d) => d.duration === median);

  console.log(`
=====
Stats
=====

First MR         ${first.finished_at} (${first.web_url})
Last MR          ${last.finished_at} (${last.web_url})

# MRs            ${durations.length}
Total time (s)   ${total}
Avg time (s)     ${avg.toFixed(2)}
Median time (s)  ${median} (${medianJob.web_url})
Max time (s)     ${max} (${maxJob.web_url})
Min time (s)     ${min} (${minJob.web_url})
`);
}

main();
