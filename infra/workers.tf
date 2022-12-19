resource "cloudflare_workers_kv_namespace" "power_alarm" {
  title = "power_alarm_kv"
}

resource "cloudflare_worker_script" "stats_service" {
  name    = "stats"
  content = file("../stats_service/dist/main.js")

  kv_namespace_binding {
    name         = "POWER_ALARM_KV"
    namespace_id = cloudflare_workers_kv_namespace.power_alarm.id
  }

  secret_text_binding {
    name = "API_SECRET"
    text = var.api_secret
  }
}

resource "cloudflare_worker_script" "tg_bot_service" {
  name    = "tg_bot"
  content = file("../bot_service/dist/main.js")

  kv_namespace_binding {
    name         = "POWER_ALARM"
    namespace_id = cloudflare_workers_kv_namespace.power_alarm.id
  }

  secret_text_binding {
    name = "TELEGRAM_BOT_TOKEN"
    text = var.telegram_bot_token
  }

  secret_text_binding {
    name = "BASE_TG_BOT_SERVICE_API_URL"
    text = var.base_tg_bot_service_api_url
  }
}
