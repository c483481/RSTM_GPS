#include <SoftwareSerial.h>
#include <TinyGPS++.h>

// Pin Definitions
#define GPS_RX 5     // GPS RX pin
#define GPS_TX 4     // GPS TX pin
#define SIM_RX 7     // SIM800L RX pin
#define SIM_TX 6     // SIM800L TX pin
#define BLUE_LED 3   // Status LED
#define GREEN_LED 2  // GPS Fix LED

// Initialize objects
TinyGPSPlus gps;
SoftwareSerial sim800(SIM_RX, SIM_TX);
SoftwareSerial gpsSerial(GPS_RX, GPS_TX);

// Constants
const String APN = "internet";  // Telkomsel APN
const String xid = "01JDP3CWEDXV8E11GHQ24NEZAF";
const String SERVER = "http://gps.rekantanisuksesmakmur.xyz";

// Global variables
double latitude = 0;
double longitude = 0;
int retry_count = 0;
const int MAX_RETRIES = 20;

void setup() {
  // Initialize serial communications
  Serial.begin(9600);
  sim800.begin(9600);
  gpsSerial.begin(9600);

  // Set up LED pins
  pinMode(BLUE_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);

  // Initial LED test
  digitalWrite(BLUE_LED, HIGH);
  digitalWrite(GREEN_LED, HIGH);
  delay(1000);
  digitalWrite(BLUE_LED, LOW);
  digitalWrite(GREEN_LED, LOW);

  Serial.println(F("GPS Tracker Starting..."));
  Serial.println(F("Initializing SIM800L..."));

  // Keep trying to initialize until successful
  while (!initializeSIM800()) {
    Serial.println(F("SIM800L init failed. Retrying in 5 seconds..."));
    blinkLED(BLUE_LED, 3);  // Blink to indicate error
    delay(5000);
    retry_count++;
    if (retry_count >= MAX_RETRIES) {
      Serial.println(F("Failed to initialize after max retries. Resetting..."));
      softReset();
    }
  }

  testGSM();

  Serial.println(F("SIM800L initialized successfully!"));
  digitalWrite(BLUE_LED, HIGH);
}

void loop() {
  // Read GPS data
  while (gpsSerial.available()) {
    if (gps.encode(gpsSerial.read())) {
      updateGPS();
    }
  }

  // Every 30 seconds, try to send data if we have a GPS fix
  static unsigned long lastSendTime = 0;
  if (millis() - lastSendTime >= 30000) {
    lastSendTime = millis();
    sendData();
  }

  // Check for serial commands
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    handleCommand(command);
  }
}

void updateGPS() {
  if (gps.location.isValid()) {
    digitalWrite(GREEN_LED, HIGH);
    latitude = gps.location.lat();
    longitude = gps.location.lng();

    Serial.print(F("Position: "));
    Serial.print(latitude, 6);
    Serial.print(F(","));
    Serial.println(longitude, 6);

    delay(100);
    digitalWrite(GREEN_LED, LOW);
  }
}

void testGSM() {
  Serial.println(F("\n--- Running GSM Diagnostics ---"));

  Serial.println(F("Testing basic AT..."));
  sendATCommandWithResponse("AT", 1000);

  Serial.println(F("Checking signal quality..."));
  sendATCommandWithResponse("AT+CSQ", 1000);

  Serial.println(F("Checking network registration..."));
  sendATCommandWithResponse("AT+CREG?", 1000);

  Serial.println(F("Checking GPRS status..."));
  sendATCommandWithResponse("AT+SAPBR=2,1", 1000);

  Serial.println(F("--- Diagnostics Complete ---\n"));
}

String sendATCommandWithResponse(String command, int timeout) {
  Serial.print(F("Sending: "));
  Serial.println(command);

  sim800.println(command);
  String response = waitForResponse(timeout);

  Serial.print(F("Response: "));
  Serial.println(response);

  return response;
}


bool initializeSIM800() {
  // Reset modul terlebih dahulu
  sendATCommand("AT+CFUN=0", "OK", 3000);  // Soft reset
  delay(3000);
  sendATCommand("AT+CFUN=1", "OK", 3000);  // Restore full functionality
  delay(3000);

  // Basic AT test
  if (!sendATCommand("AT", "OK", 1000)) {
    Serial.println(F("Basic AT test failed"));
    return false;
  }

  // Echo off
  sendATCommand("ATE0", "OK", 1000);

  // Mode teks untuk SMS
  sendATCommand("AT+CMGF=1", "OK", 1000);

  // Cek SIM dan tunggu sampai siap
  for (int i = 0; i < 10; i++) {
    if (sendATCommand("AT+CPIN?", "READY", 1000)) break;
    if (i == 9) {
      Serial.println(F("SIM not ready"));
      return false;
    }
    delay(1000);
  }

  // Set mode jaringan ke GSM only
  sendATCommand("AT+CNMP=13", "OK", 1000);

  // Tunggu registrasi jaringan
  for (int i = 0; i < 30; i++) {
    if (sendATCommand("AT+CREG?", "0,1", 1000)) break;
    if (i == 29) {
      Serial.println(F("Network registration failed"));
      return false;
    }
    delay(1000);
  }

  // Set bearer settings
  sendATCommand("AT+SAPBR=3,1,\"Contype\",\"GPRS\"", "OK", 2000);
  sendATCommand("AT+SAPBR=3,1,\"APN\",\"" + APN + "\"", "OK", 2000);

  // Close bearer if existing
  sendATCommand("AT+SAPBR=0,1", "OK", 2000);
  delay(2000);

  // Open bearer
  for (int i = 0; i < 5; i++) {
    if (sendATCommand("AT+SAPBR=1,1", "OK", 3000)) break;
    if (i == 4) {
      Serial.println(F("Bearer activation failed"));
      return false;
    }
    delay(2000);
  }

  // Disable SSL for testing
  sendATCommand("AT+HTTPSSL=0", "OK", 1000);

  return true;
}

bool sendATCommand(String command, String expectedResponse, int timeout) {
  String response = sendATCommandWithResponse(command, timeout);
  return response.indexOf(expectedResponse) != -1;
}

String waitForResponse(int timeout) {
  String response = "";
  unsigned long start = millis();

  while (millis() - start < timeout) {
    while (sim800.available()) {
      char c = sim800.read();
      response += c;
      delay(1);  // Short delay for stability
    }
  }

  return response;
}

void sendData() {
  Serial.println(F("Attempting to send data..."));

  String url = SERVER + "/truck/" + xid + "/location?latitude=" + String(latitude, 6) + "&longitude=" + String(longitude, 6) + "&battery=100";

  if (httpGET(url)) {
    Serial.println(F("Data sent successfully!"));
    digitalWrite(BLUE_LED, HIGH);
    delay(200);
    digitalWrite(BLUE_LED, LOW);
  } else {
    Serial.println(F("Failed to send data"));
    blinkLED(BLUE_LED, 2);
  }
}

bool httpGET(String url) {
  Serial.println(F("Preparing HTTP GET request"));
  Serial.print(F("URL: "));
  Serial.println(url);

  // Initialize HTTP service
  Serial.println(F("Initializing HTTP service..."));
  if (!sendCommand("AT+HTTPINIT", "OK", 2000)) {
    Serial.println(F("HTTP init failed"));
    return false;
  }

  // Set parameters
  Serial.println(F("Setting HTTP parameters..."));
  if (!sendCommand("AT+HTTPPARA=\"CID\",1", "OK", 2000)) {
    Serial.println(F("Failed to set CID"));
    return false;
  }

  if (!sendCommand("AT+HTTPPARA=\"URL\",\"" + url + "\"", "OK", 2000)) {
    Serial.println(F("Failed to set URL"));
    return false;
  }

  // Start GET action
  Serial.println(F("Sending GET request..."));
  if (!sendCommand("AT+HTTPACTION=0", "+HTTPACTION:", 30000)) {
    Serial.println(F("HTTP GET failed"));
    sendCommand("AT+HTTPTERM", "OK", 2000);
    return false;
  }

  // Read response
  Serial.println(F("Reading response..."));
  if (!sendCommand("AT+HTTPREAD", "OK", 10000)) {
    Serial.println(F("Failed to read response"));
  }

  // Terminate HTTP service
  Serial.println(F("Terminating HTTP service..."));
  sendCommand("AT+HTTPTERM", "OK", 2000);

  return true;
}

bool sendCommand(String command, String expectedResponse, int timeout) {
  Serial.print(F("Sending command: "));
  Serial.println(command);

  sim800.println(command);

  String response = "";
  unsigned long startTime = millis();

  while (millis() - startTime < timeout) {
    while (sim800.available()) {
      char c = sim800.read();
      response += c;

      // Print response character by character
      Serial.write(c);
    }

    if (response.indexOf(expectedResponse) != -1) {
      Serial.println(F("\nExpected response received"));
      return true;
    }
  }

  Serial.println(F("\nCommand timed out"));
  return false;
}

void handleCommand(String command) {
  if (command == "reset") {
    Serial.println(F("Resetting device..."));
    softReset();
  } else if (command == "status") {
    printStatus();
  }
}

void printStatus() {
  Serial.println(F("\n--- System Status ---"));
  Serial.print(F("GPS Fix: "));
  Serial.println(gps.location.isValid() ? "Yes" : "No");
  Serial.print(F("Latitude: "));
  Serial.println(latitude, 6);
  Serial.print(F("Longitude: "));
  Serial.println(longitude, 6);
  Serial.print(F("Satellites: "));
  Serial.println(gps.satellites.value());
  Serial.println(F("------------------\n"));
}

void blinkLED(int pin, int times) {
  for (int i = 0; i < times; i++) {
    digitalWrite(pin, HIGH);
    delay(200);
    digitalWrite(pin, LOW);
    delay(200);
  }
}

void softReset() {
  asm volatile("jmp 0");
}