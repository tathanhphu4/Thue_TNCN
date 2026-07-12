const autocannon = require("autocannon");
const BASE_URL = "http://localhost:5000";
const TOKEN = process.env.JWT_TOKEN || "";

function runScenario(opts) {
  return new Promise((resolve, reject) => {
    const inst = autocannon({ ...opts, outputStream: process.stderr }, (err, r) => {
      if (err) return reject(err);
      resolve(r);
    });
    autocannon.track(inst, { renderProgressBar: true });
  });
}

function fmt(v) { return v != null ? v.toFixed(2) + " ms" : "N/A"; }
function fmtThr(v) { return v ? v.toFixed(2) + " req/s" : "N/A"; }

(async () => {
  console.log("\n>>> PERF-01: GET /api/health (10 users, 20s)");
  const r1 = await runScenario({ url: BASE_URL+"/api/health", method:"GET", connections:10, duration:20, title:"PERF-01 Health" });

  console.log("\n>>> PERF-02: POST /api/auth/login (3 users, 20s)");
  const r2 = await runScenario({ url: BASE_URL+"/api/auth/login", method:"POST", connections:3, duration:20, headers:{"content-type":"application/json"}, body: JSON.stringify({email:"admin@taxvn.com",password:"Admin@123"}), title:"PERF-02 Login" });

  console.log("\n>>> PERF-03: POST /api/tax/calculate (20 users, 30s)");
  const r3 = await runScenario({ url: BASE_URL+"/api/tax/calculate", method:"POST", connections:20, duration:30, headers:{"content-type":"application/json","authorization":"Bearer "+TOKEN}, body: JSON.stringify({totalIncome:25000000,dependents:1,otherDeductions:0}), title:"PERF-03 Calculate" });

  console.log("\n>>> PERF-04: GET /api/tax/declarations (20 users, 30s)");
  const r4 = await runScenario({ url: BASE_URL+"/api/tax/declarations", method:"GET", connections:20, duration:30, headers:{"authorization":"Bearer "+TOKEN}, title:"PERF-04 Declarations" });

  const all = {PERF_01:r1, PERF_02:r2, PERF_03:r3, PERF_04:r4};
  console.log("\n========== REPORT ==========");
  for (const [id, r] of Object.entries(all)) {
    const l = r.latency;
    console.log("\n["+id+"] "+r.title);
    console.log("  total_requests : "+r.requests.total);
    console.log("  non2xx         : "+r.non2xx);
    console.log("  errors         : "+r.errors);
    console.log("  avg_ms         : "+fmt(l.mean));
    console.log("  p50_ms         : "+fmt(l.p50));
    console.log("  p90_ms         : "+fmt(l.p90));
    console.log("  p95_ms         : "+fmt(l.p95));
    console.log("  p99_ms         : "+fmt(l.p99));
    console.log("  max_ms         : "+fmt(l.max));
    console.log("  throughput     : "+fmtThr(r.requests.mean));
    const errRate = r.requests.total > 0 ? (((r.errors+r.non2xx)/r.requests.total)*100).toFixed(2) : "0.00";
    console.log("  error_rate     : "+errRate+"%");
  }
  console.log("\n>>> DONE");
})();
