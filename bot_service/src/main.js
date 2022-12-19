addEventListener('fetch', event => {
  const { request } = event;
  const { url } = request;

  const data = {
    hello: url,
    request: request
  };

  const json = JSON.stringify(data, null, 2);

  return event.respondWith(
    new Response(json, {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    })
  );
});
