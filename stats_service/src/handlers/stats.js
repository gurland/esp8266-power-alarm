export async function handleStatsPost(request) {
  const reqBody = await request.json();
  const {status} = reqBody;

  const currentUTCTimestamp = Math.floor(Date.now() / 1000);

  let stats = JSON.parse(await POWER_ALARM_KV.get("stats"));
  if (stats === null) {
    stats = [];
  }

  stats.push([currentUTCTimestamp, status]);
  await POWER_ALARM_KV.put("stats", JSON.stringify(stats));

  return new Response(JSON.stringify({"message": "success"}));
}

export async function handleStatsGet() {
  let stats = await POWER_ALARM_KV.get("stats");

  return new Response(stats);
}

export async function handleStatsLatestGet() {
  let stats = JSON.parse(await POWER_ALARM_KV.get("stats"));

  return new Response(JSON.stringify(stats.pop()));
}
