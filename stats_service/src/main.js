

addEventListener('fetch', async event => {
  const { request } = event;
  const { url, body } = request;

  // const x = await ();

  // const data = {
  //   event: x
  // };
  //
  // const json = JSON.stringify(data, null, 2);
  // if (url.endsWith("/stats")) {
  //
  // }

  // if (request.method === 'POST') {
  //   return event.respondWith(handleRequest(request));
  // } else if (request.method === 'GET') {
  //   return event.respondWith(new Response(`The request was a GET`));
  // }

  // return event.respondWith(async (request) => {{
  //   const retBody = JSON.stringify(await request.json());
  //   return new Response(retBody);
  // }})

  return event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const retBody = JSON.stringify(await request.json());
  return new Response(retBody);
}
