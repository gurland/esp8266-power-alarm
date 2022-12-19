import {postJSON} from './utils'

const BASE_BOT_API_URL = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN;


async function sendMessage(chat_id, message) {
  return await postJSON(BASE_BOT_API_URL+"/sendMessage", {
      chat_id: chat_id,
      text: message.toString().substring(0, 4096)
    })
}

async function setWebhook() {
  return await postJSON(BASE_BOT_API_URL + '/setWebhook', {
    url: BASE_TG_BOT_SERVICE_API_URL+"/webhook/"+TELEGRAM_BOT_TOKEN+"/update",
    drop_pending_updates: true
  })
}

async function deleteWebhook() {
  return await postJSON(BASE_BOT_API_URL + '/deleteWebhook', {
    drop_pending_updates: true
  })
}

async function getWebhookInfo() {
  return await postJSON(BASE_BOT_API_URL + '/getWebhookInfo')
}

async function processTelegramUpdate(request) {
  const reqBody = await request.json();
  if (reqBody.message) {
    const {chat, text} = reqBody.message;

    await sendMessage(chat.id, text);
  }

  return new Response(null, {status: 200});
}

addEventListener('fetch', event => {
  const { request } = event;
  const { url } = request;

  if (request.method === 'GET') {
    if (url.endsWith("/webhook/"+TELEGRAM_BOT_TOKEN+"/setWebhook")) {
      return event.respondWith(setWebhook());
    } else if (url.endsWith("/webhook/"+TELEGRAM_BOT_TOKEN+"/deleteWebhook")) {
      return event.respondWith(deleteWebhook());
    } else if (url.endsWith("/webhook/"+TELEGRAM_BOT_TOKEN+"/getWebhookInfo")) {
      return event.respondWith(getWebhookInfo());
    }
  } else if (request.method === "POST") {
    if (url.endsWith("/webhook/"+TELEGRAM_BOT_TOKEN+"/update")) {
      return event.respondWith(processTelegramUpdate(request));
    }
  }
});

async function checkPowerOutages(event) {
  const stats = JSON.parse(await POWER_ALARM_KV.get("stats"));
  const wasPowerOutage = JSON.parse(await POWER_ALARM_KV.get("wasPowerOutage"));

  let isPowerOutage = true;
  for (const stat of stats.reverse()) {
    if (Math.floor(event.scheduledTime/1000) - stat[0] < 300) {
      if ([stat[1]]) {
        isPowerOutage = false;
      }
    } else {
      break;
    }
  }

  if (wasPowerOutage !== isPowerOutage) {
    await POWER_ALARM_KV.put("wasPowerOutage", JSON.stringify(isPowerOutage));
    await sendMessage(
      690766397,
      isPowerOutage ? "There is power outage detected" : "Power is regained bro!"
    );
  }
}


addEventListener("scheduled", (event) => {
  event.waitUntil(checkPowerOutages(event));
});
