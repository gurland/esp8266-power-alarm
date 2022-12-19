output "stats_url" {
  value = "${cloudflare_worker_script.stats_service.name}.${var.cf_account_name}.workers.dev"
}
