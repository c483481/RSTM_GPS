#include <SoftwareSerial.h>
#include "SIM800L.h"

#define SIM800_RX_PIN 10
#define SIM800_TX_PIN 11
#define SIM800_RST_PIN 6
#define GREEN_LED_PIN 2  // Success indicator
#define BLUE_LED_PIN 3   // Failure indicator

const char APN[] = "Internet.be";
const char URL[] = "https://postman-echo.com/get?foo1=bar1&foo2=bar2";

SIM800L* sim800l;

void setStatusLED(bool success) {
  if (success) {
    digitalWrite(GREEN_LED_PIN, HIGH);
    digitalWrite(BLUE_LED_PIN, LOW);
    delay(100);
    digitalWrite(GREEN_LED_PIN, LOW);
  } else {
    digitalWrite(BLUE_LED_PIN, HIGH);
    digitalWrite(GREEN_LED_PIN, LOW);
    delay(100);
    digitalWrite(BLUE_LED_PIN, LOW);
  }
}

void startupSequence() {
  // Repeat sequence 3 times
  for(int i = 0; i < 3; i++) {
    // Green LED on for 2 seconds
    digitalWrite(GREEN_LED_PIN, HIGH);
    delay(2000);
    digitalWrite(GREEN_LED_PIN, LOW);
    
    // Blue LED on for 1 second
    digitalWrite(BLUE_LED_PIN, HIGH);
    delay(1000);
    digitalWrite(BLUE_LED_PIN, LOW);
  }
}

void setup() {  
  // Initialize Serial Monitor for debugging
  Serial.begin(115200);
  while(!Serial);

  // Initialize LED pins
  pinMode(GREEN_LED_PIN, OUTPUT);
  pinMode(BLUE_LED_PIN, OUTPUT);

  startupSequence();

  digitalWrite(GREEN_LED_PIN, LOW);
  digitalWrite(BLUE_LED_PIN, LOW);
  
  // Initialize a SoftwareSerial
  SoftwareSerial* serial = new SoftwareSerial(SIM800_RX_PIN, SIM800_TX_PIN);
  serial->begin(9600);
  delay(1000);
   
  // Initialize SIM800L driver with an internal buffer of 200 bytes and a reception buffer of 512 bytes
  sim800l = new SIM800L((Stream *)serial, SIM800_RST_PIN, 200, 512);

  // Setup module for GPRS communication
  setupModule();
}
 
void loop() {

  digitalWrite(GREEN_LED_PIN, LOW);
  digitalWrite(BLUE_LED_PIN, LOW);
  // Establish GPRS connectivity (5 trials)
  bool connected = false;
  for(uint8_t i = 0; i < 5 && !connected; i++) {
    delay(1000);
    connected = sim800l->connectGPRS();
  }

  // Check if connected, if not reset the module and setup the config again
  if(connected) {
    setStatusLED(true);  // Green LED flash for success
    Serial.print(F("GPRS connected with IP "));
    Serial.println(sim800l->getIP());
    delay(2000);
  } else {
    setStatusLED(false);  // Blue LED flash for failure
    Serial.println(F("GPRS not connected !"));
    Serial.println(F("Reset the module."));
    sim800l->reset();
    setupModule();
    return;
  }

  digitalWrite(GREEN_LED_PIN, LOW);
  digitalWrite(BLUE_LED_PIN, LOW);
  Serial.println(F("Start HTTP GET..."));

  // Do HTTP GET communication with 10s for the timeout (read)
  uint16_t rc = sim800l->doGet(URL, 10000);
  if(rc == 200) {
    setStatusLED(true);  // Green LED flash for success
    Serial.print(F("HTTP GET successful ("));
    Serial.print(sim800l->getDataSizeReceived());
    Serial.println(F(" bytes)"));
    Serial.print(F("Received : "));
    Serial.println(sim800l->getDataReceived());
  } else {
    setStatusLED(false);  // Blue LED flash for failure
    Serial.print(F("HTTP GET error "));
    Serial.println(rc);
  }

  delay(1000);

  // Close GPRS connectivity (5 trials)
  bool disconnected = sim800l->disconnectGPRS();
  for(uint8_t i = 0; i < 5 && !connected; i++) {
    delay(1000);
    disconnected = sim800l->disconnectGPRS();
  }
  
  if(disconnected) {
    Serial.println(F("GPRS disconnected !"));
  } else {
    Serial.println(F("GPRS still connected !"));
  }

  // Go into low power mode
  bool lowPowerMode = sim800l->setPowerMode(MINIMUM);
  if(lowPowerMode) {
    Serial.println(F("Module in low power mode"));
  } else {
    Serial.println(F("Failed to switch module to low power mode"));
  }

  delay(5000);
}

void setupModule() {
  // Wait until the module is ready to accept AT commands
  while(!sim800l->isReady()) {
    setStatusLED(false);  // Blue LED flash for failure
    Serial.println(F("Problem to initialize AT command, retry in 1 sec"));
    delay(1000);
  }
  setStatusLED(true);  // Green LED flash for success
  Serial.println(F("Setup Complete!"));

  // Wait for the GSM signal
  uint8_t signal = sim800l->getSignal();
  while(signal <= 0) {
    setStatusLED(false);  // Blue LED flash for failure
    delay(1000);
    signal = sim800l->getSignal();
  }
  setStatusLED(true);  // Green LED flash for success
  Serial.print(F("Signal OK (strenght: "));
  Serial.print(signal);
  Serial.println(F(")"));
  delay(1000);

  // Wait for operator network registration
  NetworkRegistration network = sim800l->getRegistrationStatus();
  while(network != REGISTERED_HOME && network != REGISTERED_ROAMING) {
    setStatusLED(false);  // Blue LED flash for failure
    delay(1000);
    network = sim800l->getRegistrationStatus();
  }
  setStatusLED(true);  // Green LED flash for success
  Serial.println(F("Network registration OK"));
  delay(1000);

  // Setup APN for GPRS configuration
  bool success = sim800l->setupGPRS(APN);
  while(!success) {
    setStatusLED(false);  // Blue LED flash for failure
    success = sim800l->setupGPRS(APN);
    delay(5000);
  }
  setStatusLED(true);  // Green LED flash for success
  Serial.println(F("GPRS config OK"));
}