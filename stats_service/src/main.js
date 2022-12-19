async function handleStatsPost(request) {
  const reqBody = await request.json();
  const { status } = reqBody;

  const currentUTCTimestamp = Math.floor(Date.now() / 1000);

  let stats = JSON.parse(await POWER_ALARM_KV.get("stats"));
  if (stats === null) {
    stats = [];
  }

  stats.push([currentUTCTimestamp, status]);
  await POWER_ALARM_KV.put("stats", JSON.stringify(stats));

  return new Response(JSON.stringify({"message": "success"}));
}

async function handleStatsGet() {
  let stats = await POWER_ALARM_KV.get("stats");

  return new Response(stats);
}

function UnauthorizedResponse() {
  const resBody = JSON.stringify({"message": "bad auth"});
  return new Response(resBody, {
    status: 401,
  });
}

addEventListener('fetch', async event => {
  const {request} = event;
  const {url, body} = request;

  const authHeader = request.headers.get("Authorization");
  if (authHeader !== "Bearer " + API_SECRET) {
    return event.respondWith(UnauthorizedResponse());
  }

  if (url.endsWith("/stats")) {
    if (request.method === 'POST') {
      return event.respondWith(handleStatsPost(request));
    } else if (request.method === 'GET') {
      return event.respondWith(handleStatsGet(request));
    }
  }

  return event.respondWith(handleRequest(request));
});
