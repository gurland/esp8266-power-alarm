import {handleStatsGet, handleStatsLatestGet, handleStatsPost} from "./handlers/stats";


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

  if (url.endsWith("/stats/latest")) {
    if (request.method === 'GET') {
      return event.respondWith(handleStatsLatestGet());
    }
  }

  return event.respondWith(handleRequest(request));
});
