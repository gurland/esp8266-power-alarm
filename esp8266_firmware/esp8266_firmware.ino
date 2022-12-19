#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>

#define WIFI_SSID "WiFi_ssid"
#define WIFI_PASSWORD "WiFi_pws"
#define STATS_API_URL "https://stats.user-name.workers.dev/stats"
#define STATS_API_AUTHORIZATION "Bearer secret_token"

ESP8266WiFiMulti WiFiMulti;
std::unique_ptr<BearSSL::WiFiClientSecure>client(new BearSSL::WiFiClientSecure);
HTTPClient https;

void setup() {
  Serial.begin(115200);
  Serial.println("Power ON");
  
  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(WIFI_SSID, WIFI_PASSWORD);
  
  client->setInsecure();
}

void sendCurrentPowerStatus() {
  Serial.print("[HTTPS] begin...\n");
  if (https.begin(*client, STATS_API_URL)) {
    Serial.print("[HTTPS] POST...\n");
    
    https.addHeader("Authorization", STATS_API_AUTHORIZATION);
    int httpCode = https.POST("{\"status\":1}");
  
    if (httpCode > 0) {
      Serial.printf("[HTTPS] Response code: %d\n", httpCode);
    }
  } else {
    Serial.printf("[HTTPS] Unable to connect\n");
  }
  
  https.end();
}

void loop() {
  if ((WiFiMulti.run() == WL_CONNECTED)) {
    sendCurrentPowerStatus();
    Serial.println("Wait 60s before next round...");
    delay(60000);
  } else {
    Serial.printf("[WiFi] Not connected yet.\n");
    delay(1000);
  }
}
