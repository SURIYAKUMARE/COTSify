"use client";
import { useState } from "react";
import { X, ExternalLink, BookOpen, PlayCircle, FileText, Cpu, Zap, ChevronRight } from "lucide-react";

interface WiringResource {
  title: string;
  type: "tutorial" | "datasheet" | "video" | "pinout";
  url: string;
  source: string;
}

const COMPONENT_RESOURCES: Record<string, WiringResource[]> = {
  "arduino": [
    { title: "Arduino Uno Pinout Diagram", type: "pinout", url: "https://content.arduino.cc/assets/Pinout-UNOrev3_latest.pdf", source: "Arduino.cc" },
    { title: "Getting Started with Arduino", type: "tutorial", url: "https://www.arduino.cc/en/Guide", source: "Arduino.cc" },
    { title: "Arduino Uno Datasheet", type: "datasheet", url: "https://docs.arduino.cc/hardware/uno-rev3", source: "Arduino Docs" },
    { title: "Arduino Basics - Full Course", type: "video", url: "https://www.youtube.com/results?search_query=arduino+uno+tutorial+beginners", source: "YouTube" },
  ],
  "esp32": [
    { title: "ESP32 DevKit Pinout", type: "pinout", url: "https://randomnerdtutorials.com/esp32-pinout-reference-gpios/", source: "RandomNerd" },
    { title: "ESP32 Getting Started Guide", type: "tutorial", url: "https://randomnerdtutorials.com/getting-started-with-esp32/", source: "RandomNerd" },
    { title: "ESP32 Datasheet", type: "datasheet", url: "https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf", source: "Espressif" },
    { title: "ESP32 Complete Tutorial", type: "video", url: "https://www.youtube.com/results?search_query=esp32+tutorial+beginners", source: "YouTube" },
  ],
  "esp8266": [
    { title: "NodeMCU ESP8266 Pinout", type: "pinout", url: "https://randomnerdtutorials.com/esp8266-pinout-reference-gpios/", source: "RandomNerd" },
    { title: "ESP8266 Getting Started", type: "tutorial", url: "https://randomnerdtutorials.com/how-to-install-esp8266-board-arduino-ide/", source: "RandomNerd" },
    { title: "ESP8266 Datasheet", type: "datasheet", url: "https://www.espressif.com/sites/default/files/documentation/0a-esp8266ex_datasheet_en.pdf", source: "Espressif" },
  ],
  "raspberry pi": [
    { title: "Raspberry Pi GPIO Pinout", type: "pinout", url: "https://pinout.xyz/", source: "Pinout.xyz" },
    { title: "Raspberry Pi Documentation", type: "tutorial", url: "https://www.raspberrypi.com/documentation/", source: "RPi Foundation" },
    { title: "Raspberry Pi Beginner Guide", type: "video", url: "https://www.youtube.com/results?search_query=raspberry+pi+4+beginners+tutorial", source: "YouTube" },
  ],
  "dht11": [
    { title: "DHT11 Wiring with Arduino", type: "tutorial", url: "https://randomnerdtutorials.com/esp8266-dht11-dht22-temperature-humidity-web-server-with-arduino-ide/", source: "RandomNerd" },
    { title: "DHT11 Datasheet", type: "datasheet", url: "https://www.mouser.com/datasheet/2/758/DHT11-Technical-Data-Sheet-Translated-Version-1143054.pdf", source: "Mouser" },
    { title: "DHT11 Tutorial", type: "video", url: "https://www.youtube.com/results?search_query=dht11+arduino+tutorial", source: "YouTube" },
  ],
  "hc-sr04": [
    { title: "HC-SR04 Wiring Diagram", type: "tutorial", url: "https://randomnerdtutorials.com/complete-guide-for-ultrasonic-sensor-hc-sr04/", source: "RandomNerd" },
    { title: "HC-SR04 Datasheet", type: "datasheet", url: "https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf", source: "SparkFun" },
    { title: "Ultrasonic Sensor Tutorial", type: "video", url: "https://www.youtube.com/results?search_query=hc-sr04+arduino+tutorial", source: "YouTube" },
  ],
  "l298n": [
    { title: "L298N Motor Driver Wiring", type: "tutorial", url: "https://lastminuteengineers.com/l298n-dc-stepper-driver-arduino-tutorial/", source: "LastMinuteEngineers" },
    { title: "L298N Datasheet", type: "datasheet", url: "https://www.st.com/resource/en/datasheet/l298.pdf", source: "ST Microelectronics" },
    { title: "L298N Motor Control Tutorial", type: "video", url: "https://www.youtube.com/results?search_query=l298n+motor+driver+arduino", source: "YouTube" },
  ],
  "mpu6050": [
    { title: "MPU6050 Wiring & Code", type: "tutorial", url: "https://randomnerdtutorials.com/esp32-mpu-6050-accelerometer-gyroscope-arduino/", source: "RandomNerd" },
    { title: "MPU6050 Datasheet", type: "datasheet", url: "https://invensense.tdk.com/wp-content/uploads/2015/02/MPU-6000-Datasheet1.pdf", source: "InvenSense" },
  ],
  "relay": [
    { title: "Relay Module Wiring Guide", type: "tutorial", url: "https://randomnerdtutorials.com/guide-for-relay-module-with-arduino/", source: "RandomNerd" },
    { title: "Relay Module Tutorial", type: "video", url: "https://www.youtube.com/results?search_query=relay+module+arduino+tutorial", source: "YouTube" },
  ],
  "servo": [
    { title: "SG90 Servo Wiring", type: "tutorial", url: "https://lastminuteengineers.com/servo-motor-arduino-tutorial/", source: "LastMinuteEngineers" },
    { title: "SG90 Datasheet", type: "datasheet", url: "https://components101.com/motors/servo-motor-basics-pinout-datasheet", source: "Components101" },
  ],
  "oled": [
    { title: "OLED Display Wiring", type: "tutorial", url: "https://randomnerdtutorials.com/guide-for-oled-display-with-arduino/", source: "RandomNerd" },
    { title: "SSD1306 OLED Tutorial", type: "video", url: "https://www.youtube.com/results?search_query=oled+display+arduino+tutorial", source: "YouTube" },
  ],
  "rfid": [
    { title: "MFRC522 RFID Wiring", type: "tutorial", url: "https://randomnerdtutorials.com/security-access-using-mfrc522-rfid-reader-with-arduino/", source: "RandomNerd" },
    { title: "RFID Module Tutorial", type: "video", url: "https://www.youtube.com/results?search_query=rfid+mfrc522+arduino+tutorial", source: "YouTube" },
  ],
  "pir": [
    { title: "PIR Sensor Wiring Guide", type: "tutorial", url: "https://randomnerdtutorials.com/complete-guide-for-pir-motion-sensor-with-arduino/", source: "RandomNerd" },
    { title: "PIR Motion Sensor Tutorial", type: "video", url: "https://www.youtube.com/results?search_query=pir+sensor+arduino+tutorial", source: "YouTube" },
  ],
  "soil moisture": [
    { title: "Soil Moisture Sensor Wiring", type: "tutorial", url: "https://randomnerdtutorials.com/esp32-esp8266-analog-readings-with-mcp3008/", source: "RandomNerd" },
    { title: "Soil Sensor Tutorial", type: "video", url: "https://www.youtube.com/results?search_query=soil+moisture+sensor+arduino", source: "YouTube" },
  ],
};

function getResources(componentName: string): WiringResource[] {
  const name = componentName.toLowerCase();
  for (const [key, resources] of Object.entries(COMPONENT_RESOURCES)) {
    if (name.includes(key) || key.includes(name.split(" ")[0])) {
      return resources;
    }
  }
  // Generic fallback
  return [
    { title: `${componentName} Tutorial`, type: "tutorial", url: `https://randomnerdtutorials.com/?s=${encodeURIComponent(componentName)}`, source: "RandomNerd" },
    { title: `${componentName} on YouTube`, type: "video", url: `https://www.youtube.com/results?search_query=${encodeURIComponent(componentName + " arduino tutorial")}`, source: "YouTube" },
    { title: `${componentName} Datasheet`, type: "datasheet", url: `https://www.alldatasheet.com/view.jsp?Searchword=${encodeURIComponent(componentName)}`, source: "AllDatasheet" },
  ];
}

const TYPE_CONFIG = {
  tutorial: { icon: <BookOpen className="w-4 h-4" />, color: "text-cyan-400", bg: "bg-cyan-950/60 border-cyan-800/50", label: "Tutorial" },
  datasheet: { icon: <FileText className="w-4 h-4" />, color: "text-blue-400", bg: "bg-blue-950/60 border-blue-800/50", label: "Datasheet" },
  video: { icon: <PlayCircle className="w-4 h-4" />, color: "text-red-400", bg: "bg-red-950/60 border-red-800/50", label: "Video" },
  pinout: { icon: <Cpu className="w-4 h-4" />, color: "text-green-400", bg: "bg-green-950/60 border-green-800/50", label: "Pinout" },
};

interface Props {
  componentName: string | null;
  onClose: () => void;
}

export default function WiringDiagramModal({ componentName, onClose }: Props) {
  if (!componentName) return null;

  const resources = getResources(componentName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-gradient-to-r from-cyan-950/50 to-blue-950/50">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-white font-bold text-sm">{componentName}</h2>
              <p className="text-gray-400 text-xs">Wiring guides & resources</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resources */}
        <div className="p-5 flex flex-col gap-3">
          {resources.map((r, i) => {
            const cfg = TYPE_CONFIG[r.type];
            return (
              <a
                key={i}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition-all"
              >
                <div className={`p-2 rounded-xl border flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium group-hover:text-cyan-300 transition-colors truncate">{r.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs">{r.source}</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(componentName + " wiring diagram arduino")}`}
            target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-medium py-2.5 rounded-xl transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Search more on Google
          </a>
        </div>
      </div>
    </div>
  );
}
