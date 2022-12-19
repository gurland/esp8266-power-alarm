terraform {
  backend "gcs" {
    bucket  = "tf-states-gurland"
    prefix  = "terraform/states/power_stats"
  }
}
