<img width="1814" height="867" alt="image4" src="https://github.com/user-attachments/assets/5b24d186-cbd6-49b6-9bb6-32bb5f8498be" />

# bruceNrfChat 🔐

**Secure, peer‑to‑peer encrypted messaging for ESP32‑S3**  
Powered by nRF24L01+ radios, Bruce firmware, and Diffie‑Hellman key exchange.

---

## 📖 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Supported Hardware](#supported-hardware)
- [System Requirements](#system-requirements)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
  - [Discovery Mode](#discovery-mode)
  - [Connection Request](#connection-request)
  - [Chat Mode](#chat-mode)
  - [Chat History](#chat-history)
- [Security Model](#security-model)
- [Customising Pin Assignments](#customising-pin-assignments)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

**bruceNrfChat** is a real‑time, end‑to‑end encrypted text messaging system designed for ESP32‑S3 microcontrollers running the [Bruce firmware](https://bruce.computer). It establishes a direct, infrastructure‑less radio link between two devices using **nRF24L01+** transceivers, enabling secure communication without Wi‑Fi, Bluetooth, cellular networks, or any central server.

The entire application is written in JavaScript and executed via Bruce's built‑in interpreter. **No firmware recompilation is required** – simply copy the script to an SD card and run it from the Bruce menu.

This project is intended for **educational and research purposes** – demonstrating secure key exchange, encryption, and peer‑to‑peer networking on embedded hardware.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **🔐 End‑to‑end encryption** | Diffie‑Hellman key exchange + XOR cipher (lightweight, demo‑grade). |
| **🔍 Device Discovery** | Automatically finds other devices running the same application. |
| **🤝 Connection Requests** | Select a discovered device; the recipient receives a prompt to accept or reject the chat invitation. |
| **⌨️ Virtual Keyboard** | Full QWERTY layout with letters, numbers, punctuation, and control keys (SPACE, BACK, CLEAR, SEND). |
| **💬 Chat History** | Messages are saved to SD card (`/chat_log.txt`) and can be viewed at any time. |
| **✍️ Typing Indicator** | Shows when the other device is composing a message. |
| **✅ Delivery Confirmation (ACK)** | Each message is acknowledged; delivered messages display a checkmark (✓). |
| **📡 Off‑grid operation** | Pure 2.4 GHz radio – no external infrastructure required. |
| **📦 Portable** | Runs from SD card; no firmware flashing or rebuilding needed. |
| **🧩 Modular** | Easily adaptable to any ESP32‑S3 board – just edit the pin definitions. |

---

## 🧩 Supported Hardware

| Device / Board | Script File |
|----------------|-------------|
| **Smoochiee V2** | `bruceNrfChat_smoochiee.js` |
| **LilyGO T‑Embed CC1101** | `bruceNrfChat_t-embed.js` |
| **M5Stack Cardputer** | `bruceNrfChat_cardputer.js` |
| **M5StickC Plus2** | `bruceNrfChat_stickcplus2.js` |
| **LilyGO T‑Display S3** | `bruceNrfChat_tdisplay-s3.js` |
| **CYD‑2432S028** | `bruceNrfChat_cyd.js` |
| **Custom ESP32‑S3 (any board)** | `bruceNrfChat_ESP32-generic.js` |

> **Note:** All devices now use the **same unified script** – simply adjust the pin definitions at the beginning of the file.

---

## System Requirements

- **Two ESP32‑S3 devices** (or compatible boards) with Bruce firmware **v1.15 or newer**.
- **Two nRF24L01+ modules** (PA/LNA recommended for extended range).
- **Two SD cards** (formatted as FAT32) – one per device.
- **Physical buttons** for navigation (wired according to your board’s pinout).
- **Optional:** An external USB keyboard for text entry (USB‑host capable boards).

---

## Installation & Setup

### 1. Prepare Your Hardware
- Flash Bruce firmware (v1.15 or newer) on both devices.
- Wire the nRF24 module to the SPI pins (defaults are listed in the script).
- Ensure stable power supply (3.3V, at least 500 mA) – add **100 µF electrolytic capacitors** near the nRF24 modules to prevent voltage drops.

### 2. Choose and Configure the Script
- Download `bruceNrfChat_v2.js` from the [Releases](https://github.com/yourusername/bruceNrfChat/releases) page.
- Open the file in a text editor and adjust the pin definitions at the top to match your physical wiring:
  ```javascript
  var nrfCE   = 9;   // Chip Enable
  var nrfCSN  = 8;   // Chip Select
  var nrfSCK  = 14;  // SPI Clock
  var nrfMOSI = 13;  // Master Out Slave In
  var nrfMISO = 12;  // Master In Slave Out

  var btnUP     = 5;
  var btnDOWN   = 39;
  var btnLEFT   = 40;
  var btnRIGHT  = 41;
  var btnSELECT = 16;
  var btnBACK   = 42;
  ```

### 3. Copy and Run
- Copy the script to the **root directory** of the SD card.
- Insert the SD card into the device.
- From the Bruce main menu, navigate to **Scripts** → select `bruceNrfChat_v2.js`.

---

## Usage Guide

### Discovery Mode
- The script starts in **Discovery Mode** and automatically scans for other devices running the same application.
- Found devices are displayed in a list with their unique IDs (derived from the device's MAC address).
- Use **UP / DOWN** buttons to select a device.
- Press **SELECT** to send a connection request to the chosen device.

### Connection Request
- The recipient sees a prompt: `"User X wants to chat. Accept? [SELECT=YES / BACK=NO]"`.
- If accepted, both devices immediately perform a Diffie‑Hellman key exchange and switch to **Chat Mode**.
- If rejected, the initiator is notified, and both return to Discovery Mode.

### Chat Mode
- Use the virtual keyboard to compose messages:
  - **UP / DOWN / LEFT / RIGHT** – navigate the keyboard.
  - **SELECT** – choose the highlighted character or send the message.
  - **BACK** – in keyboard mode: send the current message and switch to chat view; in chat view: return to the keyboard.
- Special keys:
  - `SPACE` – insert a space.
  - `BACK` – delete the last character.
  - `CLEAR` – erase all typed text.
  - `SEND` – encrypt and transmit the message.
- Messages are displayed with:
  - `...` – pending delivery.
  - `✓` – confirmed delivered.

### Chat History
- **View history:** Press and hold the **BACK** button for 2 seconds.
- The last 50 messages are displayed.
- Press **SELECT** or **BACK** to return to the keyboard.

---

## Security Model

`bruceNrfChat` employs a **two‑stage cryptographic process**:

### 1. Diffie‑Hellman Key Exchange
- Each device generates a random private key (`privateKey`) and computes a public key (`publicKey = g^privateKey mod p`).
- The public keys are exchanged over the air via nRF24.
- Each device independently computes the shared secret (`sharedSecret = otherPublic^privateKey mod p`).
- The shared secret is **identical on both devices** but cannot be derived by an eavesdropper without knowing either private key.

### 2. XOR Encryption
- Each message byte is XOR‑encrypted using the shared secret (cyclically repeated).
- The receiving device decrypts using the **same** XOR operation.
- This provides protection against casual eavesdropping but is **not cryptographically secure** against determined adversaries.

> ⚠️ **Important:** XOR is a demonstration‑grade cipher. For production‑grade security, use AES‑128 (planned for a future release).

---

## Customising Pin Assignments

To adapt the script to a custom‑wired board, edit the following variables at the top of `bruceNrfChat_v2.js`:

```javascript
// nRF24 SPI pins
var nrfCE   = 9;   // Chip Enable
var nrfCSN  = 8;   // Chip Select
var nrfSCK  = 14;  // SPI Clock
var nrfMOSI = 13;  // Master Out Slave In
var nrfMISO = 12;  // Master In Slave Out

// Physical button pins
var btnUP     = 5;
var btnDOWN   = 39;
var btnLEFT   = 40;
var btnRIGHT  = 41;
var btnSELECT = 16;
var btnBACK   = 42;
```

Set these values to match your actual GPIO connections, save the file, and run the script as usual.

---

## Troubleshooting

| Issue | Possible Solution |
|-------|-------------------|
| **"NRF24 not configured"** | Check pin definitions; ensure nRF24 is powered and wired correctly. |
| **No devices found** | Ensure both devices are on the same channel (default 100) and within range. Verify that both are running the same script version. |
| **Request ignored** | The other device may be already in a chat session or the user rejected the request. |
| **Messages not received** | Check signal strength; try moving devices closer. Verify that antennas are properly connected. |
| **Display shows garbage** | Confirm display driver (ST7789/ILI9341) is correct for your board. Try a different Bruce build. |
| **Buttons unresponsive** | Double‑check button GPIO numbers in the script – they may differ from your board. |
| **History not saving** | Ensure SD card is present, formatted as FAT32, and writable. |

---

## Contributing

Contributions are welcome! To propose improvements, bug fixes, or new features:

1. Fork this repository.
2. Create a new feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please adhere to the existing code style and include appropriate documentation.

---

## License

This project is distributed under the **MIT License**. See the [LICENSE](LICENSE) file for full details.

---

## Acknowledgments

- The [Bruce firmware](https://bruce.computer) team for their outstanding platform.
- The open‑source community for nRF24L01+ support and inspiration.
- All contributors and testers who helped refine this project.

---

**Maintained by [am1s3](https://github.com/am1s3).**  
**Developed with 🔐 and 💻 for the Bruce community.**
