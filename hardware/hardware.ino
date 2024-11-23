#include <SoftwareSerial.h>
#define BLUE_LED 3
#define GREEN_LED 2


SoftwareSerial sim800(7, 6);  // RX, TX (ubah pin sesuai kebutuhan Anda)

const String APN = "internet";  // APN operator Anda

void setup() {
  Serial.begin(9600);
  sim800.begin(9600);
  Serial.println("Initializing SIM800L...");

  pinMode(BLUE_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);

  digitalWrite(BLUE_LED, HIGH);
  digitalWrite(GREEN_LED, HIGH);

  delay(3000);


  digitalWrite(BLUE_LED, LOW);
  digitalWrite(GREEN_LED, LOW);

  delay(2000);


  if (initializeSIM800()) {
    Serial.println("SIM800L initialized successfully!");
    digitalWrite(BLUE_LED, HIGH);

  } else {
    Serial.println("Failed to initialize SIM800L. Check connections or SIM card.");
    while (true)
      ;
  }
}

void loop() {
  Serial.println("Attempting HTTP GET...");
  if (httpGET("http://103.47.226.184/api")) {
    Serial.println("Success");
    digitalWrite(BLUE_LED, HIGH);
    digitalWrite(GREEN_LED, HIGH);
  }
  delay(5000);  // Tunggu 5 detik sebelum mencoba lagi
  digitalWrite(BLUE_LED, LOW);
  digitalWrite(GREEN_LED, LOW);
}

bool initializeSIM800() {
  sendCommand("AT", "OK", 2000);                                    // Cek koneksi modul
  sendCommand("AT+CSQ", "OK", 2000);                                // Cek sinyal
  sendCommand("AT+CPIN?", "READY", 2000);                           // Cek status SIM
  sendCommand("AT+CREG?", "+CREG: 0,1", 2000);                      // Cek registrasi jaringan
  sendCommand("AT+SAPBR=3,1,\"CONTYPE\",\"GPRS\"", "OK", 2000);     // Set koneksi GPRS
  sendCommand("AT+SAPBR=3,1,\"APN\",\"" + APN + "\"", "OK", 2000);  // Set APN
  return sendCommand("AT+SAPBR=1,1", "OK", 5000);                   // Buka koneksi GPRS
}

bool httpGET(String url) {
  // Inisialisasi HTTP
  if (!sendCommand("AT+HTTPINIT", "OK", 2000)) return false;

  // Set parameter HTTP
  if (!sendCommand("AT+HTTPPARA=\"CID\",1", "OK", 2000)) return false;
  if (!sendCommand("AT+HTTPPARA=\"URL\",\"" + url + "\"", "OK", 2000)) return false;

  // Mulai aksi HTTP GET
  if (!sendCommand("AT+HTTPACTION=0", "+HTTPACTION: 0,200", 10000)) {
    sendCommand("AT+HTTPTERM", "OK", 2000);  // Pastikan koneksi HTTP ditutup jika gagal
    return false;
  }

  // Tutup HTTP setelah pengiriman berhasil
  sendCommand("AT+HTTPTERM", "OK", 2000);
  return true;
}

bool sendCommand(String command, String expectedResponse, int timeout) {
  sim800.println(command);
  long int time = millis();
  while ((time + timeout) > millis()) {
    if (sim800.available()) {
      String response = sim800.readString();
      if (response.indexOf(expectedResponse) != -1) {
        return true;
      }
    }
  }
  return false;
}