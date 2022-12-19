export async function postJSON(url, object) {
  return await fetch( url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(object)
  })
}

