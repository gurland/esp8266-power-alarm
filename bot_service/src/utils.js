export async function postJSON(url, object) {
  return await fetch( BASE_BOT_API_URL + '/sendMessage', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(object)
  })
}

