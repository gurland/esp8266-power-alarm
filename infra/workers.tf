resource "cloudflare_workers_kv_namespace" "power_alarm" {
  title = "power_alarm"
}

resource "cloudflare_worker_script" "stats_service" {
  name    = "stats"
  content = file("../stats_service/src/main.js")

  kv_namespace_binding {
    name         = "POWER_ALARM"
    namespace_id = cloudflare_workers_kv_namespace.power_alarm.id
  }
}

#resource "cloudflare_worker_script" "tg_bot_service" {
#  name    = "tg_bot"
#  content = file("../stats_service/src/main.js")
#
#  kv_namespace_binding {
#    name         = "POWER_ALARM"
#    namespace_id = cloudflare_workers_kv_namespace.power_alarm.id
#  }
#}
