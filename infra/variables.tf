variable "api_secret" {
  description = "Used to provide minimal stats POST security"
  default = "test_secret"
}

variable "telegram_bot_token" {
  description = "Telegram Bot API Token"
  default = "test_token"
}

variable "cf_account_id" {
  description = "Cloudflare Account ID"
}

variable "cf_api_token" {
  description = "Cloudflare API Key"
}

variable "cf_account_name" {
  description = "Cloudflare Account name (used as subdomain for *.workers.dev"
  default = "test_name"
}

variable "base_tg_bot_service_api_url" {
  description = "Cloudflare hosted worker BASE URL for telegram webhook setup"
}