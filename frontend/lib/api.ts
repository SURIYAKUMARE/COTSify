import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const api = axios.create({
  baseURL: BASE,
  timeout: 30000, // 30s — AI calls can take time
});

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface Component {
  name: string;
  category: "hardware" | "software";
  description: string;
  quantity: number;
  search_query: string;
}

export interface AnalyzeResponse {
  project_title: string;
  summary: string;
  hardware: Component[];
  software: Component[];
}

export interface StoreResult {
  place_id: string;
  name: string;
  address: string;
  rating?: number;
  total_ratings?: number;
  distance_km?: number;
  open_now?: boolean;
  maps_url: string;
  lat: number;
  lng: number;
}

export interface OnlineProduct {
  platform: string;
  name: string;
  price?: number;
  currency: string;
  rating?: number;
  reviews_count?: number;
  url: string;
  image_url?: string;
  availability: string;
}

export interface PriceComparison {
  component_name: string;
  products: OnlineProduct[];
  lowest_price?: OnlineProduct;
  best_rated?: OnlineProduct;
}

// â”€â”€ Built-in fallback data (works without backend) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FALLBACK_DB: Record<string, AnalyzeResponse> = {
  attendance: { project_title: "AI Smart Attendance System", summary: "Face recognition-based attendance system using Raspberry Pi and camera module. Automatically marks attendance by detecting and recognizing faces in real-time.", hardware: [ { name: "Raspberry Pi 4 Model B", category: "hardware", description: "Main processing unit for face recognition", quantity: 1, search_query: "Raspberry Pi 4 Model B 4GB" }, { name: "USB Camera Module", category: "hardware", description: "Captures face images for recognition", quantity: 1, search_query: "USB webcam camera module Raspberry Pi" }, { name: "MicroSD Card 32GB", category: "hardware", description: "OS and data storage", quantity: 1, search_query: "32GB microSD card class 10" }, { name: "5V 3A Power Supply", category: "hardware", description: "Powers Raspberry Pi", quantity: 1, search_query: "Raspberry Pi 5V 3A power supply" }, { name: "HDMI Display", category: "hardware", description: "Output display", quantity: 1, search_query: "7 inch HDMI display Raspberry Pi" } ], software: [ { name: "Raspberry Pi OS", category: "software", description: "Operating system", quantity: 1, search_query: "Raspberry Pi OS download" }, { name: "OpenCV", category: "software", description: "Computer vision library for face detection", quantity: 1, search_query: "OpenCV Python face recognition" }, { name: "face_recognition Library", category: "software", description: "Python face recognition library", quantity: 1, search_query: "face_recognition Python library" }, { name: "Python 3", category: "software", description: "Programming language", quantity: 1, search_query: "Python 3 download" }, { name: "SQLite", category: "software", description: "Database for attendance records", quantity: 1, search_query: "SQLite database Python" } ] },
  parking: { project_title: "Smart Parking System IoT", summary: "IoT-based smart parking system that detects available parking slots using ultrasonic sensors and displays status on LCD with LED indicators.", hardware: [ { name: "Arduino Uno R3", category: "hardware", description: "Main microcontroller", quantity: 1, search_query: "Arduino Uno R3 microcontroller" }, { name: "ESP8266 NodeMCU", category: "hardware", description: "WiFi module for IoT connectivity", quantity: 1, search_query: "ESP8266 NodeMCU WiFi module" }, { name: "HC-SR04 Ultrasonic Sensor", category: "hardware", description: "Detects vehicle presence in parking slot", quantity: 4, search_query: "HC-SR04 ultrasonic distance sensor" }, { name: "16x2 LCD Display I2C", category: "hardware", description: "Shows available parking slots", quantity: 1, search_query: "16x2 LCD I2C display Arduino" }, { name: "LED Red Green Pack", category: "hardware", description: "Slot occupied/free indicators", quantity: 8, search_query: "LED red green 5mm pack" }, { name: "Breadboard", category: "hardware", description: "Prototyping", quantity: 1, search_query: "830 point breadboard" }, { name: "Jumper Wires", category: "hardware", description: "Connections", quantity: 20, search_query: "jumper wires kit" } ], software: [ { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" }, { name: "Blynk IoT Platform", category: "software", description: "Mobile dashboard", quantity: 1, search_query: "Blynk IoT platform" } ] },
  irrigation: { project_title: "Smart Irrigation System using IoT", summary: "An IoT-based irrigation system that monitors soil moisture and automates watering using sensors and a microcontroller connected to the cloud.", hardware: [ { name: "Arduino Uno R3", category: "hardware", description: "Main microcontroller", quantity: 1, search_query: "Arduino Uno R3 microcontroller board" }, { name: "Soil Moisture Sensor", category: "hardware", description: "Detects soil water level", quantity: 2, search_query: "capacitive soil moisture sensor module" }, { name: "ESP8266 NodeMCU", category: "hardware", description: "WiFi connectivity module", quantity: 1, search_query: "ESP8266 NodeMCU WiFi module" }, { name: "Relay Module 5V", category: "hardware", description: "Controls water pump", quantity: 1, search_query: "5V relay module single channel" }, { name: "Water Pump 12V", category: "hardware", description: "Pumps water to plants", quantity: 1, search_query: "12V mini submersible water pump" }, { name: "DHT11 Sensor", category: "hardware", description: "Temperature and humidity sensor", quantity: 1, search_query: "DHT11 temperature humidity sensor module" }, { name: "Jumper Wires", category: "hardware", description: "Circuit connections", quantity: 20, search_query: "jumper wires male female breadboard" }, { name: "Breadboard", category: "hardware", description: "Prototyping board", quantity: 1, search_query: "830 point solderless breadboard" } ], software: [ { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download free" }, { name: "Blynk IoT Platform", category: "software", description: "Cloud dashboard for IoT", quantity: 1, search_query: "Blynk IoT platform" }, { name: "PubSubClient MQTT Library", category: "software", description: "MQTT messaging protocol", quantity: 1, search_query: "PubSubClient MQTT Arduino library" } ] },
  accident: { project_title: "Accident Detection and Alert System", summary: "Vehicle accident detection system using accelerometer to detect sudden impact, GPS for location tracking, and GSM module to send emergency SMS alerts.", hardware: [ { name: "Arduino Uno R3", category: "hardware", description: "Main microcontroller", quantity: 1, search_query: "Arduino Uno R3 microcontroller" }, { name: "MPU6050 Accelerometer Gyroscope", category: "hardware", description: "Detects sudden impact", quantity: 1, search_query: "MPU6050 accelerometer gyroscope module" }, { name: "NEO-6M GPS Module", category: "hardware", description: "Tracks vehicle location", quantity: 1, search_query: "NEO-6M GPS module Arduino" }, { name: "SIM800L GSM Module", category: "hardware", description: "Sends SMS alert to emergency contacts", quantity: 1, search_query: "SIM800L GSM GPRS module" }, { name: "Li-Po Battery 3.7V", category: "hardware", description: "Portable power supply", quantity: 1, search_query: "3.7V LiPo battery 2000mAh" }, { name: "Buzzer", category: "hardware", description: "Local alert sound", quantity: 1, search_query: "active buzzer 5V Arduino" } ], software: [ { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" }, { name: "TinyGPS++ Library", category: "software", description: "GPS data parsing", quantity: 1, search_query: "TinyGPS++ Arduino library" } ] },
  homeauto: { project_title: "Smart Home Automation Voice Control", summary: "Voice-controlled home automation using ESP32 with relay modules to control lights, fans, and appliances via Google Assistant or Alexa.", hardware: [ { name: "ESP32 DevKit V1", category: "hardware", description: "Main WiFi+BT microcontroller", quantity: 1, search_query: "ESP32 DevKit V1 WiFi Bluetooth" }, { name: "4-Channel Relay Module", category: "hardware", description: "Controls 4 home appliances", quantity: 1, search_query: "4 channel relay module 5V" }, { name: "DHT22 Sensor", category: "hardware", description: "Temperature and humidity monitoring", quantity: 1, search_query: "DHT22 temperature humidity sensor" }, { name: "PIR Motion Sensor", category: "hardware", description: "Motion-based automation", quantity: 2, search_query: "PIR motion sensor HC-SR501" }, { name: "5V Power Supply", category: "hardware", description: "Powers the system", quantity: 1, search_query: "5V 2A power supply adapter" } ], software: [ { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" }, { name: "Sinric Pro", category: "software", description: "Alexa/Google Home integration", quantity: 1, search_query: "Sinric Pro ESP32 Alexa" }, { name: "IFTTT", category: "software", description: "Automation triggers", quantity: 1, search_query: "IFTTT automation platform" } ] },
  assistant: { project_title: "AI Virtual Assistant Device", summary: "A mini Alexa-like AI voice assistant built on Raspberry Pi with microphone and speaker, capable of answering questions and controlling smart devices.", hardware: [ { name: "Raspberry Pi 4 Model B", category: "hardware", description: "Main processing unit", quantity: 1, search_query: "Raspberry Pi 4 Model B 4GB" }, { name: "USB Microphone", category: "hardware", description: "Voice input", quantity: 1, search_query: "USB microphone Raspberry Pi" }, { name: "3.5mm Speaker", category: "hardware", description: "Audio output", quantity: 1, search_query: "3.5mm speaker Raspberry Pi" }, { name: "MicroSD Card 32GB", category: "hardware", description: "OS storage", quantity: 1, search_query: "32GB microSD card" }, { name: "5V 3A Power Supply", category: "hardware", description: "Power", quantity: 1, search_query: "Raspberry Pi 5V 3A power supply" } ], software: [ { name: "Raspberry Pi OS", category: "software", description: "Operating system", quantity: 1, search_query: "Raspberry Pi OS" }, { name: "Google Assistant SDK", category: "software", description: "AI assistant engine", quantity: 1, search_query: "Google Assistant SDK Raspberry Pi" }, { name: "Python 3", category: "software", description: "Programming language", quantity: 1, search_query: "Python 3 download" }, { name: "SpeechRecognition Library", category: "software", description: "Voice recognition", quantity: 1, search_query: "Python SpeechRecognition library" } ] },
  helmet: { project_title: "Smart Helmet Safety Alcohol Detection", summary: "Smart safety helmet with alcohol detection sensor and IR sensor to ensure rider safety. Prevents bike ignition if alcohol is detected.", hardware: [ { name: "Arduino Uno R3", category: "hardware", description: "Main microcontroller", quantity: 1, search_query: "Arduino Uno R3" }, { name: "MQ3 Alcohol Sensor", category: "hardware", description: "Detects alcohol level in breath", quantity: 1, search_query: "MQ3 alcohol sensor module" }, { name: "IR Sensor Module", category: "hardware", description: "Detects if helmet is worn", quantity: 1, search_query: "IR infrared sensor module" }, { name: "Relay Module 5V", category: "hardware", description: "Controls bike ignition", quantity: 1, search_query: "5V relay module" }, { name: "Buzzer", category: "hardware", description: "Alert sound", quantity: 1, search_query: "active buzzer 5V" }, { name: "16x2 LCD Display", category: "hardware", description: "Status display", quantity: 1, search_query: "16x2 LCD display Arduino" } ], software: [ { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" } ] },
  objectdetection: { project_title: "AI Object Detection System", summary: "Real-time AI object detection system using camera and deep learning models (YOLO/TensorFlow) running on Raspberry Pi or laptop.", hardware: [ { name: "Raspberry Pi 4 Model B", category: "hardware", description: "Edge AI processing unit", quantity: 1, search_query: "Raspberry Pi 4 Model B 4GB" }, { name: "Raspberry Pi Camera Module V2", category: "hardware", description: "Video input for detection", quantity: 1, search_query: "Raspberry Pi camera module v2" }, { name: "MicroSD Card 64GB", category: "hardware", description: "Storage for models", quantity: 1, search_query: "64GB microSD card class 10" } ], software: [ { name: "Python 3", category: "software", description: "Programming language", quantity: 1, search_query: "Python 3 download" }, { name: "OpenCV", category: "software", description: "Computer vision library", quantity: 1, search_query: "OpenCV Python" }, { name: "YOLOv8", category: "software", description: "Object detection model", quantity: 1, search_query: "YOLOv8 object detection" }, { name: "Raspberry Pi OS", category: "software", description: "Operating system", quantity: 1, search_query: "Raspberry Pi OS" } ] },
  linerobot: { project_title: "Line Following Robot", summary: "A robot that follows a black line on a white surface using IR sensors and a motor driver controlled by a microcontroller.", hardware: [ { name: "Arduino Uno R3", category: "hardware", description: "Main controller", quantity: 1, search_query: "Arduino Uno R3 board" }, { name: "IR Sensor Module", category: "hardware", description: "Detects line on surface", quantity: 2, search_query: "IR infrared sensor module" }, { name: "L298N Motor Driver", category: "hardware", description: "Controls DC motors", quantity: 1, search_query: "L298N dual H-bridge motor driver" }, { name: "DC Gear Motor 6V", category: "hardware", description: "Drives wheels", quantity: 2, search_query: "DC gear motor 6V robot" }, { name: "Robot Chassis Kit", category: "hardware", description: "2WD robot body", quantity: 1, search_query: "2WD robot car chassis kit" }, { name: "Li-Po Battery 7.4V", category: "hardware", description: "Power supply", quantity: 1, search_query: "7.4V LiPo battery 1000mAh" } ], software: [ { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" } ] },
  fire: { project_title: "Fire Detection System", summary: "Automatic fire detection system using flame sensor and smoke sensor with buzzer alarm and optional SMS alert.", hardware: [ { name: "Arduino Uno R3", category: "hardware", description: "Main microcontroller", quantity: 1, search_query: "Arduino Uno R3" }, { name: "Flame Sensor Module", category: "hardware", description: "Detects fire/flame", quantity: 2, search_query: "flame sensor module Arduino" }, { name: "MQ2 Gas Sensor", category: "hardware", description: "Detects smoke and gas", quantity: 1, search_query: "MQ2 gas smoke sensor module" }, { name: "Buzzer", category: "hardware", description: "Fire alarm sound", quantity: 1, search_query: "active buzzer 5V Arduino" }, { name: "Relay Module", category: "hardware", description: "Triggers sprinkler/alarm", quantity: 1, search_query: "5V relay module" } ], software: [ { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" } ] },
  gesture: { project_title: "Gesture Controlled Robot", summary: "A robot controlled by hand gestures using accelerometer sensor and RF wireless communication between transmitter glove and robot receiver.", hardware: [ { name: "Arduino Uno R3", category: "hardware", description: "Controller for transmitter and receiver", quantity: 2, search_query: "Arduino Uno R3" }, { name: "MPU6050 Accelerometer", category: "hardware", description: "Detects hand tilt/gesture", quantity: 1, search_query: "MPU6050 accelerometer gyroscope" }, { name: "nRF24L01 RF Module", category: "hardware", description: "Wireless communication", quantity: 2, search_query: "nRF24L01 RF wireless module" }, { name: "L298N Motor Driver", category: "hardware", description: "Controls robot motors", quantity: 1, search_query: "L298N motor driver" }, { name: "DC Gear Motor", category: "hardware", description: "Robot movement", quantity: 4, search_query: "DC gear motor robot" }, { name: "Robot Chassis", category: "hardware", description: "4WD robot body", quantity: 1, search_query: "4WD robot chassis kit" } ], software: [ { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" } ] },
  streetlight: { project_title: "Smart Street Light Auto ON OFF", summary: "Automatic street light system that turns ON at night and OFF during day using LDR sensor, with motion detection for energy saving.", hardware: [ { name: "Arduino Uno R3", category: "hardware", description: "Main controller", quantity: 1, search_query: "Arduino Uno R3" }, { name: "LDR Sensor Module", category: "hardware", description: "Detects ambient light level", quantity: 1, search_query: "LDR light dependent resistor module" }, { name: "Relay Module 5V", category: "hardware", description: "Switches street light ON/OFF", quantity: 1, search_query: "5V relay module" }, { name: "PIR Motion Sensor", category: "hardware", description: "Detects pedestrian for dimming", quantity: 1, search_query: "PIR motion sensor HC-SR501" }, { name: "LED High Power", category: "hardware", description: "Street light simulation", quantity: 2, search_query: "high power LED 5W white" } ], software: [ { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" } ] },
  humanrobot: { project_title: "Human Following Robot", summary: "A robot that autonomously follows a human using ultrasonic sensors to maintain distance, with optional camera-based AI tracking.", hardware: [ { name: "Arduino Uno R3", category: "hardware", description: "Main controller", quantity: 1, search_query: "Arduino Uno R3" }, { name: "HC-SR04 Ultrasonic Sensor", category: "hardware", description: "Measures distance to human", quantity: 3, search_query: "HC-SR04 ultrasonic sensor" }, { name: "L298N Motor Driver", category: "hardware", description: "Controls motors", quantity: 1, search_query: "L298N motor driver" }, { name: "DC Gear Motor", category: "hardware", description: "Robot movement", quantity: 2, search_query: "DC gear motor 6V" }, { name: "Robot Chassis", category: "hardware", description: "2WD robot body", quantity: 1, search_query: "2WD robot chassis" } ], software: [ { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" } ] },
  rfid: { project_title: "RFID Door Lock System", summary: "Secure door lock system using RFID card authentication. Authorized cards unlock the door via servo motor, unauthorized access triggers buzzer alarm.", hardware: [ { name: "Arduino Uno R3", category: "hardware", description: "Main controller", quantity: 1, search_query: "Arduino Uno R3" }, { name: "MFRC522 RFID Module", category: "hardware", description: "Reads RFID cards/tags", quantity: 1, search_query: "MFRC522 RFID module Arduino" }, { name: "RFID Cards and Tags", category: "hardware", description: "Access cards", quantity: 5, search_query: "RFID cards tags 13.56MHz" }, { name: "SG90 Servo Motor", category: "hardware", description: "Controls door lock mechanism", quantity: 1, search_query: "SG90 servo motor" }, { name: "Buzzer", category: "hardware", description: "Unauthorized access alert", quantity: 1, search_query: "active buzzer 5V" }, { name: "16x2 LCD Display", category: "hardware", description: "Shows access status", quantity: 1, search_query: "16x2 LCD I2C display" } ], software: [ { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" }, { name: "MFRC522 Library", category: "software", description: "RFID library for Arduino", quantity: 1, search_query: "MFRC522 Arduino library" } ] },
  weather: { project_title: "Weather Monitoring Station", summary: "IoT weather station that monitors temperature, humidity, and rainfall, displaying data on LCD and sending to cloud dashboard via ESP8266.", hardware: [ { name: "ESP8266 NodeMCU", category: "hardware", description: "WiFi microcontroller", quantity: 1, search_query: "ESP8266 NodeMCU WiFi module" }, { name: "DHT11 Sensor", category: "hardware", description: "Temperature and humidity", quantity: 1, search_query: "DHT11 temperature humidity sensor" }, { name: "Rain Sensor Module", category: "hardware", description: "Detects rainfall", quantity: 1, search_query: "rain sensor module Arduino" }, { name: "BMP180 Pressure Sensor", category: "hardware", description: "Atmospheric pressure", quantity: 1, search_query: "BMP180 barometric pressure sensor" }, { name: "0.96 inch OLED Display", category: "hardware", description: "Shows weather data", quantity: 1, search_query: "0.96 inch OLED display I2C" } ], software: [ { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" }, { name: "ThingSpeak", category: "software", description: "IoT cloud platform", quantity: 1, search_query: "ThingSpeak IoT platform" } ] },
  health: { project_title: "Health Monitoring System", summary: "Wearable health monitoring system that tracks pulse rate, body temperature, and SpO2 levels, sending data to mobile app via ESP32 Bluetooth.", hardware: [ { name: "ESP32 DevKit V1", category: "hardware", description: "Main WiFi+BT controller", quantity: 1, search_query: "ESP32 DevKit V1" }, { name: "MAX30100 Pulse Oximeter", category: "hardware", description: "Measures pulse and SpO2", quantity: 1, search_query: "MAX30100 pulse oximeter sensor" }, { name: "DS18B20 Temperature Sensor", category: "hardware", description: "Body temperature measurement", quantity: 1, search_query: "DS18B20 temperature sensor waterproof" }, { name: "0.96 inch OLED Display", category: "hardware", description: "Displays health data", quantity: 1, search_query: "0.96 inch OLED I2C display" }, { name: "Li-Po Battery 3.7V", category: "hardware", description: "Wearable power supply", quantity: 1, search_query: "3.7V LiPo battery 1000mAh" } ], software: [ { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" }, { name: "Blynk App", category: "software", description: "Mobile health dashboard", quantity: 1, search_query: "Blynk IoT app" } ] },
  waterlevel: { project_title: "Smart Water Level Indicator", summary: "Automatic water level monitoring system that displays tank level and triggers pump/buzzer when level is low or full.", hardware: [ { name: "Arduino Uno R3", category: "hardware", description: "Main controller", quantity: 1, search_query: "Arduino Uno R3" }, { name: "HC-SR04 Ultrasonic Sensor", category: "hardware", description: "Non-contact level measurement", quantity: 1, search_query: "HC-SR04 ultrasonic sensor" }, { name: "Relay Module 5V", category: "hardware", description: "Controls water pump", quantity: 1, search_query: "5V relay module" }, { name: "Buzzer", category: "hardware", description: "Low/full level alert", quantity: 1, search_query: "active buzzer 5V" }, { name: "16x2 LCD Display", category: "hardware", description: "Numeric level display", quantity: 1, search_query: "16x2 LCD I2C display" } ], software: [ { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" } ] },
  energymeter: { project_title: "IoT Smart Energy Meter", summary: "Smart energy meter that measures current consumption, calculates power usage and cost, and sends data to cloud dashboard via ESP8266.", hardware: [ { name: "ESP8266 NodeMCU", category: "hardware", description: "WiFi microcontroller", quantity: 1, search_query: "ESP8266 NodeMCU WiFi module" }, { name: "ACS712 Current Sensor", category: "hardware", description: "Measures AC/DC current", quantity: 1, search_query: "ACS712 current sensor module" }, { name: "ZMPT101B Voltage Sensor", category: "hardware", description: "Measures AC voltage", quantity: 1, search_query: "ZMPT101B voltage sensor module" }, { name: "16x2 LCD Display I2C", category: "hardware", description: "Shows power consumption", quantity: 1, search_query: "16x2 LCD I2C display" } ], software: [ { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" }, { name: "ThingSpeak", category: "software", description: "Energy data cloud platform", quantity: 1, search_query: "ThingSpeak IoT platform" } ] },
  surveillance: { project_title: "Smart Surveillance System", summary: "AI-powered surveillance system with motion detection, face recognition, and real-time video streaming using Raspberry Pi and camera.", hardware: [ { name: "Raspberry Pi 4 Model B", category: "hardware", description: "Main processing unit", quantity: 1, search_query: "Raspberry Pi 4 Model B 4GB" }, { name: "Raspberry Pi Camera Module V2", category: "hardware", description: "HD video capture", quantity: 1, search_query: "Raspberry Pi camera module v2" }, { name: "PIR Motion Sensor", category: "hardware", description: "Triggers recording on motion", quantity: 2, search_query: "PIR motion sensor HC-SR501" }, { name: "MicroSD Card 64GB", category: "hardware", description: "Video storage", quantity: 1, search_query: "64GB microSD card" } ], software: [ { name: "Raspberry Pi OS", category: "software", description: "Operating system", quantity: 1, search_query: "Raspberry Pi OS" }, { name: "OpenCV", category: "software", description: "Computer vision and motion detection", quantity: 1, search_query: "OpenCV Python" }, { name: "MotionEye OS", category: "software", description: "Surveillance camera software", quantity: 1, search_query: "MotionEye surveillance Raspberry Pi" } ] },
  default: { project_title: "", summary: "A technical project requiring various hardware and software components.", hardware: [ { name: "Arduino Uno R3", category: "hardware", description: "Main microcontroller board", quantity: 1, search_query: "Arduino Uno R3 microcontroller" }, { name: "Breadboard", category: "hardware", description: "Solderless prototyping board", quantity: 1, search_query: "830 point breadboard" }, { name: "Jumper Wires Kit", category: "hardware", description: "Male-male, male-female, female-female wires", quantity: 1, search_query: "jumper wires kit 120pcs" }, { name: "Resistor Kit", category: "hardware", description: "Assorted resistors", quantity: 1, search_query: "resistor assortment kit" }, { name: "LED Pack", category: "hardware", description: "Assorted 5mm LEDs", quantity: 1, search_query: "LED assorted pack 5mm" } ], software: [ { name: "Arduino IDE", category: "software", description: "Development environment", quantity: 1, search_query: "Arduino IDE free download" }, { name: "VS Code", category: "software", description: "Code editor", quantity: 1, search_query: "VS Code download" } ] },
};
function getFallbackAnalysis(title: string): AnalyzeResponse {
  const t = title.toLowerCase();

  // ── Exact DB matches first ──────────────────────────────────────────────────
  if (t.includes("attendance") || t.includes("face recogn") || t.includes("face detect")) return { ...FALLBACK_DB.attendance, project_title: title };
  if (t.includes("parking")) return { ...FALLBACK_DB.parking, project_title: title };
  if (t.includes("irrigat") || (t.includes("water") && t.includes("soil"))) return { ...FALLBACK_DB.irrigation, project_title: title };
  if (t.includes("accident") || (t.includes("alert") && t.includes("gps"))) return { ...FALLBACK_DB.accident, project_title: title };
  if (t.includes("voice control") || (t.includes("home") && t.includes("automat"))) return { ...FALLBACK_DB.homeauto, project_title: title };
  if (t.includes("virtual assistant") || t.includes("alexa")) return { ...FALLBACK_DB.assistant, project_title: title };
  if (t.includes("helmet") || t.includes("alcohol")) return { ...FALLBACK_DB.helmet, project_title: title };
  if (t.includes("object detect")) return { ...FALLBACK_DB.objectdetection, project_title: title };
  if (t.includes("line follow") || (t.includes("robot") && t.includes("line"))) return { ...FALLBACK_DB.linerobot, project_title: title };
  if (t.includes("fire detect") || t.includes("flame")) return { ...FALLBACK_DB.fire, project_title: title };
  if (t.includes("gesture")) return { ...FALLBACK_DB.gesture, project_title: title };
  if (t.includes("street light") || t.includes("streetlight")) return { ...FALLBACK_DB.streetlight, project_title: title };
  if (t.includes("human follow") || (t.includes("robot") && t.includes("follow"))) return { ...FALLBACK_DB.humanrobot, project_title: title };
  if (t.includes("rfid") || t.includes("door lock")) return { ...FALLBACK_DB.rfid, project_title: title };
  if (t.includes("weather") || t.includes("weather monitor")) return { ...FALLBACK_DB.weather, project_title: title };
  if (t.includes("health monitor") || t.includes("pulse") || t.includes("heart rate")) return { ...FALLBACK_DB.health, project_title: title };
  if (t.includes("water level")) return { ...FALLBACK_DB.waterlevel, project_title: title };
  if (t.includes("energy meter") || t.includes("smart meter")) return { ...FALLBACK_DB.energymeter, project_title: title };
  if (t.includes("surveillance") || t.includes("cctv") || t.includes("security camera")) return { ...FALLBACK_DB.surveillance, project_title: title };

  // ── Smart keyword-based component builder ───────────────────────────────────
  // Detects keywords and assembles the right components for ANY project title
  const hw: Component[] = [];
  const sw: Component[] = [];

  const add = (name: string, desc: string, qty = 1, sq = "") =>
    hw.push({ name, category: "hardware", description: desc, quantity: qty, search_query: sq || name });
  const addSW = (name: string, desc: string, sq = "") =>
    sw.push({ name, category: "software", description: desc, quantity: 1, search_query: sq || name });

  // ── Detect microcontroller ──────────────────────────────────────────────────
  const needsRPi = t.includes("raspberry") || t.includes("linux") || t.includes("camera") || t.includes("opencv") || t.includes("python") || t.includes("ai") || t.includes("ml") || t.includes("deep learn") || t.includes("neural") || t.includes("image");
  const needsESP32 = t.includes("esp32") || t.includes("bluetooth") || t.includes("ble") || t.includes("wifi") && t.includes("bt");
  const needsESP8266 = t.includes("esp8266") || t.includes("nodemcu") || (t.includes("wifi") && !needsESP32 && !needsRPi);
  const needsArduino = !needsRPi && !needsESP32 && !needsESP8266;

  if (needsRPi) {
    add("Raspberry Pi 4 Model B 4GB", "Main processing unit for AI/vision tasks", 1, "Raspberry Pi 4 Model B 4GB");
    add("MicroSD Card 32GB", "OS and data storage", 1, "32GB microSD card class 10");
    add("5V 3A USB-C Power Supply", "Powers Raspberry Pi 4", 1, "Raspberry Pi 4 power supply 5V 3A");
    addSW("Raspberry Pi OS", "Operating system", "Raspberry Pi OS download");
    addSW("Python 3", "Programming language", "Python 3 download");
  } else if (needsESP32) {
    add("ESP32 DevKit V1", "Dual-core WiFi+Bluetooth microcontroller", 1, "ESP32 DevKit V1");
    addSW("Arduino IDE", "Programming environment", "Arduino IDE download");
  } else if (needsESP8266) {
    add("ESP8266 NodeMCU V3", "WiFi-enabled microcontroller", 1, "ESP8266 NodeMCU V3");
    addSW("Arduino IDE", "Programming environment", "Arduino IDE download");
  } else {
    add("Arduino Uno R3", "Main microcontroller board", 1, "Arduino Uno R3");
    addSW("Arduino IDE", "Programming environment", "Arduino IDE download");
  }

  // ── Detect display ──────────────────────────────────────────────────────────
  if (t.includes("display") || t.includes("lcd") || t.includes("screen") || t.includes("show") || t.includes("counter") || t.includes("monitor") || t.includes("visitor")) {
    if (t.includes("oled") || t.includes("small")) {
      add("0.96\" OLED Display I2C", "Displays data/count", 1, "0.96 inch OLED display I2C SSD1306");
    } else if (t.includes("7 seg") || t.includes("seven seg") || t.includes("digit") || t.includes("counter") || t.includes("visitor")) {
      add("4-Digit 7-Segment Display TM1637", "Displays numeric count", 1, "TM1637 4 digit 7 segment display");
      add("16x2 LCD Display I2C", "Shows status messages", 1, "16x2 LCD I2C display Arduino");
    } else {
      add("16x2 LCD Display I2C", "Displays output data", 1, "16x2 LCD I2C display Arduino");
    }
  }

  // ── Detect sensors based on project type ───────────────────────────────────
  if (t.includes("visitor") || t.includes("people count") || t.includes("crowd") || t.includes("entry") || t.includes("exit") || t.includes("counter")) {
    add("PIR Motion Sensor HC-SR501", "Detects person entering/exiting", 2, "PIR motion sensor HC-SR501");
    add("IR Sensor Module", "Counts people passing through", 2, "IR infrared obstacle sensor module");
  }
  if (t.includes("automat") || t.includes("control") || t.includes("switch")) {
    add("Relay Module 5V", "Controls electrical devices automatically", 1, "5V relay module single channel");
  }
  if (t.includes("temperature") || t.includes("humidity") || t.includes("climate") || t.includes("environment")) {
    add("DHT11 Sensor", "Measures temperature and humidity", 1, "DHT11 temperature humidity sensor");
  }
  if (t.includes("distance") || t.includes("obstacle") || t.includes("proximity") || t.includes("ultrasonic")) {
    add("HC-SR04 Ultrasonic Sensor", "Measures distance", 1, "HC-SR04 ultrasonic distance sensor");
  }
  if (t.includes("light") || t.includes("ldr") || t.includes("dark") || t.includes("bright")) {
    add("LDR Sensor Module", "Detects light intensity", 1, "LDR light sensor module");
  }
  if (t.includes("gas") || t.includes("smoke") || t.includes("air quality") || t.includes("pollution")) {
    add("MQ-2 Gas Sensor", "Detects gas/smoke levels", 1, "MQ-2 gas smoke sensor module");
  }
  if (t.includes("soil") || t.includes("plant") || t.includes("garden") || t.includes("moisture")) {
    add("Soil Moisture Sensor", "Detects soil water content", 2, "capacitive soil moisture sensor");
  }
  if (t.includes("gps") || t.includes("location") || t.includes("track") || t.includes("navigation")) {
    add("NEO-6M GPS Module", "Provides GPS location data", 1, "NEO-6M GPS module Arduino");
  }
  if (t.includes("gsm") || t.includes("sms") || t.includes("cellular") || t.includes("sim")) {
    add("SIM800L GSM Module", "Sends SMS alerts via cellular", 1, "SIM800L GSM GPRS module");
  }
  if (t.includes("bluetooth") || t.includes("ble") || t.includes("wireless control")) {
    add("HC-05 Bluetooth Module", "Wireless communication", 1, "HC-05 Bluetooth module");
  }
  if (t.includes("motor") || t.includes("robot") || t.includes("car") || t.includes("vehicle") || t.includes("drive")) {
    add("L298N Motor Driver", "Controls DC motors", 1, "L298N dual H-bridge motor driver");
    add("DC Gear Motor 6V", "Drives wheels/movement", 2, "DC gear motor 6V 200RPM");
    add("Robot Chassis Kit", "Mechanical body", 1, "2WD robot car chassis kit");
    add("Li-Po Battery 7.4V 1000mAh", "Power supply for motors", 1, "7.4V LiPo battery 1000mAh");
  }
  if (t.includes("servo") || t.includes("arm") || t.includes("gripper") || t.includes("door") || t.includes("lock")) {
    add("SG90 Servo Motor", "Provides rotational control", 2, "SG90 servo motor 9g");
  }
  if (t.includes("camera") || t.includes("vision") || t.includes("image") || t.includes("photo") || t.includes("video")) {
    if (needsRPi) {
      add("Raspberry Pi Camera Module V2", "Captures images/video", 1, "Raspberry Pi camera module v2");
    } else {
      add("OV7670 Camera Module", "Image capture module", 1, "OV7670 camera module Arduino");
    }
  }
  if (t.includes("solar") || t.includes("renewable") || t.includes("energy harvest")) {
    add("Solar Panel 6V 1W", "Harvests solar energy", 1, "6V 1W solar panel");
    add("TP4056 Battery Charger Module", "Charges battery from solar", 1, "TP4056 lithium battery charger");
    add("18650 Li-Ion Battery", "Energy storage", 2, "18650 lithium ion battery 3000mAh");
  }
  if (t.includes("buzzer") || t.includes("alarm") || t.includes("alert") || t.includes("sound")) {
    add("Active Buzzer 5V", "Produces alarm sound", 1, "active buzzer 5V Arduino");
  }
  if (t.includes("led") || t.includes("light") || t.includes("indicator") || t.includes("blink")) {
    add("LED Pack (Assorted)", "Visual indicators", 10, "LED assorted pack 5mm");
    add("Resistor Kit 220Ω-10kΩ", "Current limiting for LEDs", 1, "resistor assortment kit");
  }
  if (t.includes("keypad") || t.includes("password") || t.includes("pin") || t.includes("input")) {
    add("4x4 Matrix Keypad", "User input interface", 1, "4x4 matrix keypad membrane");
  }
  if (t.includes("fingerprint") || t.includes("biometric")) {
    add("R307 Fingerprint Sensor", "Biometric authentication", 1, "R307 fingerprint sensor module");
  }
  if (t.includes("rfid") || t.includes("nfc") || t.includes("card")) {
    add("MFRC522 RFID Module", "Reads RFID cards/tags", 1, "MFRC522 RFID reader module");
    add("RFID Cards & Key Fobs", "Access credentials", 5, "RFID cards 13.56MHz");
  }
  if (t.includes("pump") || t.includes("water") || t.includes("irrigat") || t.includes("flow")) {
    add("Mini Submersible Water Pump", "Pumps water", 1, "mini submersible water pump 5V");
    add("Relay Module 5V", "Controls pump on/off", 1, "5V relay module");
  }
  if (t.includes("stepper") || t.includes("cnc") || t.includes("3d print") || t.includes("precise")) {
    add("28BYJ-48 Stepper Motor + ULN2003", "Precise rotational control", 1, "28BYJ-48 stepper motor ULN2003");
  }
  if (t.includes("accelerometer") || t.includes("gyroscope") || t.includes("imu") || t.includes("tilt") || t.includes("motion detect")) {
    add("MPU-6050 Gyroscope + Accelerometer", "Detects motion and orientation", 1, "MPU6050 gyroscope accelerometer module");
  }
  if (t.includes("pressure") || t.includes("altitude") || t.includes("barometric")) {
    add("BMP280 Pressure Sensor", "Measures atmospheric pressure", 1, "BMP280 barometric pressure sensor");
  }
  if (t.includes("heart") || t.includes("pulse") || t.includes("spo2") || t.includes("oximeter") || t.includes("health")) {
    add("MAX30100 Pulse Oximeter Sensor", "Measures heart rate and SpO2", 1, "MAX30100 pulse oximeter sensor");
  }
  if (t.includes("rain") || t.includes("flood") || t.includes("rainfall")) {
    add("Rain Sensor Module", "Detects rainfall", 1, "rain sensor module Arduino");
  }
  if (t.includes("lora") || t.includes("long range") || t.includes("lpwan")) {
    add("LoRa SX1278 433MHz Module", "Long-range wireless communication", 2, "LoRa SX1278 433MHz module");
  }
  if (t.includes("cloud") || t.includes("iot") || t.includes("internet") || t.includes("dashboard") || t.includes("monitor")) {
    if (!needsESP32 && !needsESP8266 && !needsRPi) {
      add("ESP8266 NodeMCU V3", "WiFi connectivity for IoT", 1, "ESP8266 NodeMCU WiFi module");
    }
    addSW("Blynk IoT Platform", "Mobile dashboard for IoT", "Blynk IoT platform");
    addSW("MQTT Protocol (Mosquitto)", "IoT messaging protocol", "Mosquitto MQTT broker");
  }
  if (t.includes("opencv") || t.includes("face") || t.includes("image process") || t.includes("computer vision")) {
    addSW("OpenCV", "Computer vision library", "OpenCV Python pip install");
    addSW("NumPy", "Numerical computing", "NumPy Python pip install");
  }
  if (t.includes("machine learn") || t.includes("deep learn") || t.includes("neural") || t.includes("tensorflow") || t.includes("yolo")) {
    addSW("TensorFlow / Keras", "Deep learning framework", "TensorFlow pip install");
    addSW("YOLOv8", "Object detection model", "YOLOv8 ultralytics pip install");
  }
  if (t.includes("database") || t.includes("store") || t.includes("record") || t.includes("log")) {
    addSW("SQLite / MySQL", "Database for storing records", "SQLite Python");
  }
  if (t.includes("web") || t.includes("flask") || t.includes("server") || t.includes("api")) {
    addSW("Flask / FastAPI", "Web server framework", "Flask Python pip install");
  }
  if (t.includes("android") || t.includes("app") || t.includes("mobile")) {
    addSW("MIT App Inventor / Flutter", "Mobile app development", "MIT App Inventor");
  }

  // ── Always add basic prototyping components ─────────────────────────────────
  if (!t.includes("raspberry") && !t.includes("linux")) {
    add("Breadboard 830-Point", "Solderless prototyping board", 1, "830 point solderless breadboard");
    add("Jumper Wires Kit (120pcs)", "Circuit connections M-M, M-F, F-F", 1, "jumper wires kit 120pcs");
  }

  // ── If nothing matched, use smart default ──────────────────────────────────
  if (hw.length <= 2) {
    // Build from title words
    const words = title.split(/\s+/).filter(w => w.length > 3);
    return {
      project_title: title,
      summary: `${title} — an embedded systems project using microcontrollers, sensors, and actuators to automate and monitor the described functionality.`,
      hardware: [
        { name: "Arduino Uno R3", category: "hardware", description: "Main microcontroller", quantity: 1, search_query: "Arduino Uno R3" },
        { name: "ESP8266 NodeMCU", category: "hardware", description: "WiFi connectivity", quantity: 1, search_query: "ESP8266 NodeMCU" },
        { name: "PIR Motion Sensor", category: "hardware", description: "Motion/presence detection", quantity: 2, search_query: "PIR motion sensor HC-SR501" },
        { name: "16x2 LCD Display I2C", category: "hardware", description: "Data display", quantity: 1, search_query: "16x2 LCD I2C display" },
        { name: "Active Buzzer", category: "hardware", description: "Audio alert", quantity: 1, search_query: "active buzzer 5V" },
        { name: "Relay Module 5V", category: "hardware", description: "Device control", quantity: 1, search_query: "5V relay module" },
        { name: "Breadboard 830-Point", category: "hardware", description: "Prototyping", quantity: 1, search_query: "830 point breadboard" },
        { name: "Jumper Wires Kit", category: "hardware", description: "Connections", quantity: 1, search_query: "jumper wires kit" },
        { name: "9V Battery + Clip", category: "hardware", description: "Power supply", quantity: 1, search_query: "9V battery clip connector" },
      ],
      software: [
        { name: "Arduino IDE", category: "software", description: "Programming environment", quantity: 1, search_query: "Arduino IDE download" },
        { name: "VS Code", category: "software", description: "Code editor", quantity: 1, search_query: "VS Code download" },
      ],
    };
  }

  // ── Add power supply if not already added ──────────────────────────────────
  if (!hw.some(c => c.name.toLowerCase().includes("battery") || c.name.toLowerCase().includes("power"))) {
    if (needsRPi) {
      // already added above
    } else if (hw.some(c => c.name.toLowerCase().includes("motor") || c.name.toLowerCase().includes("pump"))) {
      add("Li-Po Battery 7.4V", "Power supply for motors", 1, "7.4V LiPo battery 1000mAh");
    } else {
      add("9V Battery + Clip Connector", "Power supply", 1, "9V battery clip connector");
    }
  }

  // ── Add software if none added ─────────────────────────────────────────────
  if (sw.length === 0) {
    addSW("Arduino IDE", "Programming environment", "Arduino IDE download");
  }

  return {
    project_title: title,
    summary: `${title} — an embedded systems project that uses ${hw.slice(0, 3).map(c => c.name).join(", ")} and more to implement the required functionality.`,
    hardware: hw,
    software: sw,
  };
}

const FALLBACK_PRICES: Record<string, OnlineProduct[]> = {
  "arduino": [
    { platform: "Amazon", name: "Arduino Uno R3 Original Board", price: 649, currency: "INR", rating: 4.5, reviews_count: 12400, url: "https://www.amazon.in/s?k=arduino+uno+r3", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=Arduino", availability: "in_stock" },
    { platform: "Flipkart", name: "Arduino Uno R3 Microcontroller", price: 599, currency: "INR", rating: 4.3, reviews_count: 8700, url: "https://www.flipkart.com/search?q=arduino+uno", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=Arduino", availability: "in_stock" },
    { platform: "Robu.in", name: "Arduino Uno R3 Compatible Board", price: 349, currency: "INR", rating: 4.1, reviews_count: 2300, url: "https://robu.in/?s=arduino+uno", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=Arduino", availability: "in_stock" },
  ],
  "esp32": [
    { platform: "Amazon", name: "ESP32 DevKit V1 WiFi Bluetooth", price: 399, currency: "INR", rating: 4.6, reviews_count: 15200, url: "https://www.amazon.in/s?k=esp32+devkit", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=ESP32", availability: "in_stock" },
    { platform: "Flipkart", name: "ESP32 Development Board", price: 379, currency: "INR", rating: 4.4, reviews_count: 9800, url: "https://www.flipkart.com/search?q=esp32+devkit", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=ESP32", availability: "in_stock" },
    { platform: "Robu.in", name: "ESP32 DevKit V1 Board", price: 299, currency: "INR", rating: 4.5, reviews_count: 4200, url: "https://robu.in/?s=esp32", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=ESP32", availability: "in_stock" },
  ],
  "esp8266": [
    { platform: "Amazon", name: "ESP8266 NodeMCU WiFi Module", price: 299, currency: "INR", rating: 4.4, reviews_count: 9800, url: "https://www.amazon.in/s?k=esp8266+nodemcu", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=ESP8266", availability: "in_stock" },
    { platform: "Flipkart", name: "NodeMCU ESP8266 Board", price: 279, currency: "INR", rating: 4.2, reviews_count: 5600, url: "https://www.flipkart.com/search?q=esp8266", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=ESP8266", availability: "in_stock" },
    { platform: "Robu.in", name: "ESP8266 NodeMCU V3", price: 199, currency: "INR", rating: 4.5, reviews_count: 1200, url: "https://robu.in/?s=esp8266", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=ESP8266", availability: "in_stock" },
  ],
  "raspberry pi": [
    { platform: "Amazon", name: "Raspberry Pi 4 Model B 4GB", price: 5499, currency: "INR", rating: 4.8, reviews_count: 32000, url: "https://www.amazon.in/s?k=raspberry+pi+4", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=RPi4", availability: "in_stock" },
    { platform: "Robu.in", name: "Raspberry Pi 4 Model B", price: 5200, currency: "INR", rating: 4.7, reviews_count: 8900, url: "https://robu.in/?s=raspberry+pi+4", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=RPi4", availability: "in_stock" },
  ],
  "soil moisture": [
    { platform: "Amazon", name: "Capacitive Soil Moisture Sensor v1.2", price: 149, currency: "INR", rating: 4.2, reviews_count: 3200, url: "https://www.amazon.in/s?k=soil+moisture+sensor", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=Soil", availability: "in_stock" },
    { platform: "Flipkart", name: "Soil Moisture Sensor Module", price: 129, currency: "INR", rating: 4.0, reviews_count: 1800, url: "https://www.flipkart.com/search?q=soil+moisture+sensor", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=Soil", availability: "in_stock" },
    { platform: "Robu.in", name: "Capacitive Soil Moisture Sensor", price: 99, currency: "INR", rating: 4.3, reviews_count: 560, url: "https://robu.in/?s=soil+moisture", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=Soil", availability: "in_stock" },
  ],
  "dht11": [
    { platform: "Amazon", name: "DHT11 Temperature Humidity Sensor", price: 119, currency: "INR", rating: 4.3, reviews_count: 14200, url: "https://www.amazon.in/s?k=dht11+sensor", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=DHT11", availability: "in_stock" },
    { platform: "Flipkart", name: "DHT11 Digital Sensor Module", price: 99, currency: "INR", rating: 4.1, reviews_count: 7800, url: "https://www.flipkart.com/search?q=dht11", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=DHT11", availability: "in_stock" },
    { platform: "Robu.in", name: "DHT11 Sensor with PCB", price: 79, currency: "INR", rating: 4.4, reviews_count: 2100, url: "https://robu.in/?s=dht11", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=DHT11", availability: "in_stock" },
  ],
  "relay": [
    { platform: "Amazon", name: "5V Single Channel Relay Module", price: 89, currency: "INR", rating: 4.1, reviews_count: 6700, url: "https://www.amazon.in/s?k=5v+relay+module", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=Relay", availability: "in_stock" },
    { platform: "Flipkart", name: "5V Relay Module for Arduino", price: 79, currency: "INR", rating: 4.0, reviews_count: 3400, url: "https://www.flipkart.com/search?q=relay+module", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=Relay", availability: "in_stock" },
    { platform: "Robu.in", name: "Single Channel 5V Relay", price: 59, currency: "INR", rating: 4.2, reviews_count: 890, url: "https://robu.in/?s=relay+module", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=Relay", availability: "in_stock" },
  ],
  "l298n": [
    { platform: "Amazon", name: "L298N Dual H-Bridge Motor Driver", price: 149, currency: "INR", rating: 4.3, reviews_count: 7600, url: "https://www.amazon.in/s?k=l298n+motor+driver", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=L298N", availability: "in_stock" },
    { platform: "Flipkart", name: "L298N Motor Driver Module", price: 129, currency: "INR", rating: 4.1, reviews_count: 4200, url: "https://www.flipkart.com/search?q=l298n", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=L298N", availability: "in_stock" },
    { platform: "Robu.in", name: "L298N Motor Driver Board", price: 99, currency: "INR", rating: 4.4, reviews_count: 1800, url: "https://robu.in/?s=l298n", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=L298N", availability: "in_stock" },
  ],
  "ultrasonic": [
    { platform: "Amazon", name: "HC-SR04 Ultrasonic Distance Sensor", price: 89, currency: "INR", rating: 4.5, reviews_count: 18900, url: "https://www.amazon.in/s?k=hc-sr04+ultrasonic", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=HCSR04", availability: "in_stock" },
    { platform: "Flipkart", name: "HC-SR04 Ultrasonic Sensor Module", price: 79, currency: "INR", rating: 4.3, reviews_count: 9400, url: "https://www.flipkart.com/search?q=hc-sr04", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=HCSR04", availability: "in_stock" },
    { platform: "Robu.in", name: "HC-SR04 Ultrasonic Ranging Module", price: 59, currency: "INR", rating: 4.6, reviews_count: 3200, url: "https://robu.in/?s=hc-sr04", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=HCSR04", availability: "in_stock" },
  ],
  "servo": [
    { platform: "Amazon", name: "SG90 Micro Servo Motor 9g", price: 129, currency: "INR", rating: 4.3, reviews_count: 9800, url: "https://www.amazon.in/s?k=sg90+servo", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=SG90", availability: "in_stock" },
    { platform: "Flipkart", name: "SG90 Servo Motor for Arduino", price: 119, currency: "INR", rating: 4.1, reviews_count: 5600, url: "https://www.flipkart.com/search?q=sg90+servo", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=SG90", availability: "in_stock" },
    { platform: "Robu.in", name: "SG90 9g Micro Servo", price: 89, currency: "INR", rating: 4.4, reviews_count: 2100, url: "https://robu.in/?s=sg90+servo", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=SG90", availability: "in_stock" },
  ],
  "pir": [
    { platform: "Amazon", name: "PIR Motion Sensor HC-SR501", price: 79, currency: "INR", rating: 4.4, reviews_count: 12600, url: "https://www.amazon.in/s?k=pir+sensor", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=PIR", availability: "in_stock" },
    { platform: "Flipkart", name: "PIR Infrared Motion Sensor", price: 69, currency: "INR", rating: 4.2, reviews_count: 6800, url: "https://www.flipkart.com/search?q=pir+sensor", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=PIR", availability: "in_stock" },
    { platform: "Robu.in", name: "HC-SR501 PIR Motion Sensor", price: 49, currency: "INR", rating: 4.5, reviews_count: 2400, url: "https://robu.in/?s=pir+sensor", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=PIR", availability: "in_stock" },
  ],
  "mpu6050": [
    { platform: "Amazon", name: "MPU6050 Gyroscope Accelerometer Module", price: 199, currency: "INR", rating: 4.4, reviews_count: 8900, url: "https://www.amazon.in/s?k=mpu6050", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=MPU6050", availability: "in_stock" },
    { platform: "Flipkart", name: "MPU-6050 6-Axis IMU Module", price: 179, currency: "INR", rating: 4.2, reviews_count: 4500, url: "https://www.flipkart.com/search?q=mpu6050", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=MPU6050", availability: "in_stock" },
    { platform: "Robu.in", name: "MPU6050 Accelerometer Gyro", price: 149, currency: "INR", rating: 4.5, reviews_count: 1800, url: "https://robu.in/?s=mpu6050", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=MPU6050", availability: "in_stock" },
  ],
  "rfid": [
    { platform: "Amazon", name: "MFRC522 RFID Module with Card", price: 199, currency: "INR", rating: 4.3, reviews_count: 11200, url: "https://www.amazon.in/s?k=mfrc522+rfid", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=RFID", availability: "in_stock" },
    { platform: "Flipkart", name: "RFID Reader Module MFRC522", price: 179, currency: "INR", rating: 4.1, reviews_count: 5600, url: "https://www.flipkart.com/search?q=rfid+module", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=RFID", availability: "in_stock" },
    { platform: "Robu.in", name: "MFRC522 RFID Kit", price: 149, currency: "INR", rating: 4.4, reviews_count: 2300, url: "https://robu.in/?s=rfid+module", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=RFID", availability: "in_stock" },
  ],
  "oled": [
    { platform: "Amazon", name: "0.96 inch OLED Display I2C", price: 199, currency: "INR", rating: 4.5, reviews_count: 14500, url: "https://www.amazon.in/s?k=oled+display+0.96", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=OLED", availability: "in_stock" },
    { platform: "Flipkart", name: "OLED 128x64 I2C Display", price: 179, currency: "INR", rating: 4.3, reviews_count: 7200, url: "https://www.flipkart.com/search?q=oled+display", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=OLED", availability: "in_stock" },
    { platform: "Robu.in", name: "0.96 OLED SSD1306 Module", price: 149, currency: "INR", rating: 4.6, reviews_count: 3100, url: "https://robu.in/?s=oled+display", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=OLED", availability: "in_stock" },
  ],
  "breadboard": [
    { platform: "Amazon", name: "830 Point Solderless Breadboard", price: 79, currency: "INR", rating: 4.4, reviews_count: 8900, url: "https://www.amazon.in/s?k=breadboard+830", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=BB", availability: "in_stock" },
    { platform: "Flipkart", name: "Breadboard 830 Tie Points", price: 69, currency: "INR", rating: 4.2, reviews_count: 4500, url: "https://www.flipkart.com/search?q=breadboard", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=BB", availability: "in_stock" },
    { platform: "Robu.in", name: "Full Size 830 Point Breadboard", price: 49, currency: "INR", rating: 4.5, reviews_count: 1800, url: "https://robu.in/?s=breadboard", image_url: "https://placehold.co/200x200/1f2937/06b6d4?text=BB", availability: "in_stock" },
  ],
};

function getFallbackPrices(componentName: string, searchQuery: string): PriceComparison {
  const key = Object.keys(FALLBACK_PRICES).find(k => componentName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(componentName.toLowerCase()));
  const products = key ? FALLBACK_PRICES[key] : [
    { platform: "Amazon", name: componentName, price: undefined, currency: "INR", rating: undefined, reviews_count: undefined, url: `https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}`, image_url: `https://placehold.co/200x200/1f2937/06b6d4?text=${encodeURIComponent(componentName.split(" ")[0])}`, availability: "unknown" },
    { platform: "Flipkart", name: componentName, price: undefined, currency: "INR", rating: undefined, reviews_count: undefined, url: `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`, image_url: `https://placehold.co/200x200/1f2937/06b6d4?text=${encodeURIComponent(componentName.split(" ")[0])}`, availability: "unknown" },
    { platform: "Robu.in", name: componentName, price: undefined, currency: "INR", rating: undefined, reviews_count: undefined, url: `https://robu.in/?s=${encodeURIComponent(searchQuery)}`, image_url: `https://placehold.co/200x200/1f2937/06b6d4?text=${encodeURIComponent(componentName.split(" ")[0])}`, availability: "unknown" },
  ];
  const priced = products.filter(p => p.price != null);
  return {
    component_name: componentName,
    products,
    lowest_price: priced.length ? priced.reduce((a, b) => (a.price! < b.price! ? a : b)) : undefined,
    best_rated: products.filter(p => p.rating).reduce((a, b) => ((a.rating || 0) > (b.rating || 0) ? a : b), products[0]),
  };
}

async function tryBackend<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  // Always try backend if BASE is set (even localhost for local dev)
  if (!BASE) return fallback;
  try { return await fn(); } catch { return fallback; }
}

// â”€â”€ API calls â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function analyzeProject(title: string): Promise<AnalyzeResponse & { _source?: string }> {
  // 1. Try backend first (if running)
  try {
    const { data } = await api.post("/api/analyze/", { project_title: title });
    return { ...data, _source: "backend" };
  } catch { /* backend not running */ }

  // 2. Try Gemini directly from browser (free, fast)
  const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (geminiKey && geminiKey.length > 10) {
    try {
      const { analyzeWithGemini } = await import("./ai-service");
      const result = await analyzeWithGemini(title);
      return { ...result, _source: "gemini" };
    } catch (e) {
      console.warn("Gemini failed:", e);
    }
  }

  // 3. Try OpenAI directly from browser
  const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (openaiKey && openaiKey.startsWith("sk-")) {
    try {
      const { analyzeWithOpenAI } = await import("./ai-service");
      const result = await analyzeWithOpenAI(title);
      return { ...result, _source: "openai" };
    } catch (e) {
      console.warn("OpenAI failed:", e);
    }
  }

  // 4. Use built-in fallback
  return { ...getFallbackAnalysis(title), _source: "fallback" };
}

export async function getNearbyStores(componentName: string, lat: number, lng: number): Promise<StoreResult[]> {
  return tryBackend(
    async () => { const { data } = await api.post("/api/stores/nearby", { component_name: componentName, latitude: lat, longitude: lng, radius_meters: 15000 }); return data.stores; },
    [
      { place_id: "mock_1", name: "Electronics Hub", address: "123 Tech Street, Electronics Market", rating: 4.2, total_ratings: 340, distance_km: 1.2, open_now: true, maps_url: "https://maps.google.com", lat: lat + 0.01, lng: lng + 0.01 },
      { place_id: "mock_2", name: "Component World", address: "456 Circuit Avenue, Tech Zone", rating: 4.5, total_ratings: 210, distance_km: 2.8, open_now: true, maps_url: "https://maps.google.com", lat: lat + 0.02, lng: lng - 0.01 },
      { place_id: "mock_3", name: "Robomart Electronics", address: "789 Maker Lane, Innovation District", rating: 3.9, total_ratings: 95, distance_km: 4.1, open_now: false, maps_url: "https://maps.google.com", lat: lat - 0.03, lng: lng + 0.02 },
    ]
  );
}

export async function comparePrices(componentName: string, searchQuery: string): Promise<PriceComparison> {
  return tryBackend(
    async () => { const { data } = await api.post("/api/compare/", { component_name: componentName, search_query: searchQuery }); return data; },
    getFallbackPrices(componentName, searchQuery)
  );
}

export async function compareBulk(components: Component[]): Promise<PriceComparison[]> {
  return tryBackend(
    async () => { const { data } = await api.post("/api/compare/bulk", components.map(c => ({ component_name: c.name, search_query: c.search_query }))); return data; },
    components.map(c => getFallbackPrices(c.name, c.search_query))
  );
}

export async function saveProject(userId: string, projectTitle: string, analysis: AnalyzeResponse, bookmarked: string[] = []) {
  try { const { data } = await api.post("/api/projects/save", { user_id: userId, project_title: projectTitle, analysis, bookmarked_components: bookmarked }); return data; } catch { return null; }
}

export async function getUserProjects(userId: string) {
  try { const { data } = await api.get(`/api/projects/${userId}`); return data.projects; } catch { return []; }
}

export async function deleteProject(projectId: string, userId: string) {
  try { await api.delete(`/api/projects/${projectId}?user_id=${userId}`); } catch { /* ignore */ }
}

