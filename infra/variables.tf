variable "api_secret" {
  description = "Used to provide minimal stats POST security"
  default = "test_secret"
}

variable "telegram_bot_token" {
  description = "Telegram Bot API Token"
  default = "test_token"
}

variable "cf_account_name" {
  default = "test_name"
}
