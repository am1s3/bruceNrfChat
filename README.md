<img width="1814" height="867" alt="image4" src="https://github.com/user-attachments/assets/5b24d186-cbd6-49b6-9bb6-32bb5f8498be" />

# bruceNrfChat 🔐

**A secure, encrypted text‑messaging system for ESP32‑S3 devices**  
Leveraging nRF24L01+ radios, Bruce firmware, and Diffie‑Hellman key exchange.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Supported Hardware](#supported-hardware)
- [Requirements](#requirements)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [Security Model](#security-model)
- [Customising Pin Assignments](#customising-pin-assignments)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

`bruceNrfChat` is a lightweight, real‑time messaging application designed for ESP32‑S3 microcontrollers running the [Bruce firmware](https://bruce.computer). It establishes a direct, encrypted radio link between two devices using **nRF24L01+** transceivers, enabling secure text communication without relying on Wi‑Fi, Bluetooth, or the Internet.

The project is entirely written in JavaScript and executed via Bruce's built‑in interpreter. No firmware recompilation is required – simply copy the script to an SD card and run it from the Bruce menu.

---

## Features

- **End‑to‑end encryption** – Diffie‑Hellman key exchange + XOR cipher.
- **Virtual QWERTY keyboard** – full text input using physical buttons.
- **Role‑based communication** – Initiator (sender) and Responder (receiver).
- **Off‑grid operation** – pure radio frequency (2.4 GHz) with no external infrastructure.
- **Low latency** – optimized for near‑instantaneous message delivery.
- **Portable** – runs directly from an SD card; no firmware flashing required.
- **Modular** – easily adaptable to any ESP32‑S3 board.

---

## Supported Hardware

| Device / Board | Script File | Default Pin Configuration |
|----------------|-------------|---------------------------|
| **Smoochiee V2** | `bruceNrfChat_smoochiee.js` | Standard Bruce reference board |
| **LilyGO T‑Embed CC1101** | `bruceNrfChat_t-embed.js` | Built‑in CC1101 with nRF24 on SPI |
| **M5Stack Cardputer** | `bruceNrfChat_cardputer.js` | Integrated keyboard and display |
| **M5StickC Plus2** | `bruceNrfChat_stickcplus2.js` | 3 buttons, compact form factor |
| **LilyGO T‑Display S3** | `bruceNrfChat_tdisplay-s3.js` | Popular display board |
| **CYD‑2432S028** | `bruceNrfChat_cyd.js` | Resistive touch, ILI9341 display |
| **Custom ESP32‑S3 (any board)** | `bruceNrfChat_ESP32-generic.js` | **User‑definable pinout** – edit at the top of the script |

> **Note:** The generic script is intended for users with non‑standard wiring. You must manually set the correct GPIO numbers for nRF24 and buttons before running it.

---

## Requirements

- **Two ESP32‑S3 devices** (or compatible boards) with Bruce firmware (v1.15+).
- **Two nRF24L01+ modules** (PA/LNA recommended for extended range).
- **Two SD cards** (formatted as FAT32) – one per device.
- **Basic wiring** – nRF24 connected via SPI; physical buttons for navigation.
- **Optional:** An external USB keyboard for text entry (USB‑host capable boards).

---

## Installation & Setup

### 1. Prepare the Hardware
- Flash Bruce firmware (v1.15 or newer) on both devices.
- Wire the nRF24 module to the SPI pins (defaults are listed in each script).

### 2. Choose and Copy the Script
- Select the appropriate script for your board from the table above.
- If using a custom board, download `bruceNrfChat_ESP32-generic.js` and adjust the pin definitions at the beginning of the file.
- Copy the `.js` file to the **root directory** of your SD card.

### 3. Insert the SD Card and Run
- Insert the SD card into the device.
- From the Bruce main menu, navigate to **Scripts** → select the script file.

### 4. Set the Communication Role
- On **one** device, **press and hold the UP button** during script startup – this device becomes the **Responder** (waits for incoming messages).
- On the **other** device, start the script normally – this becomes the **Initiator** (sends the first message).

The devices will automatically perform a Diffie‑Hellman key exchange and then enter chat mode.

---

## Usage Guide

### Virtual Keyboard Controls

| Button | Action |
|--------|--------|
| **UP** / **DOWN** | Navigate keyboard rows |
| **LEFT** / **RIGHT** | Navigate keyboard columns |
| **SELECT** | Select highlighted character / send message |
| **BACK** | In keyboard mode – send current message and switch to chat view; in chat view – return to keyboard |

### Special Keys on the Keyboard
- `SPACE` – insert a space.
- `BACK` – delete the last character.
- `CLEAR` – erase all typed text.
- `SEND` – encrypt and transmit the message.

### Chat Mode
After sending a message, the screen switches to **Chat Mode**, displaying:
- The outgoing message (sent by you).
- Any incoming message (decrypted and displayed).
- A prompt to return to the keyboard.

Press **SELECT** or **BACK** to return to the keyboard and compose a new message.

---

## Security Model

`bruceNrfChat` employs a **two‑step cryptographic process**:

1. **Diffie‑Hellman key exchange** – a secure public‑key protocol that allows both devices to independently compute a shared secret without transmitting it over the air.
2. **XOR encryption** – each message is XOR‑encrypted using the shared secret before transmission. The receiving device decrypts it using the same secret.

> ⚠️ **Important:** XOR is a lightweight cipher suitable for demonstration and educational purposes. It provides protection against casual eavesdropping but is not resistant to determined cryptanalysis. For production‑grade security, consider replacing XOR with AES‑128 (future release).

---

## Customising Pin Assignments

If you are using a **custom‑wired** ESP32‑S3 board, edit the `bruceNrfChat_ESP32-generic.js` file and adjust the following variables at the top:

```javascript
// nRF24 SPI pins
var nrfCE   = 9;   // Chip Enable
var nrfCSN  = 8;   // Chip Select
var nrfSCK  = 14;  // SPI Clock
var nrfMOSI = 13;  // Master Out Slave In
var nrfMISO = 12;  // Master In Slave Out

// Physical button pins (adjust to your wiring)
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
| **No messages received** | Verify both devices use the same channel (default 100) and data rate (250 kbps). Check antenna placement. |
| **Display shows garbage** | Confirm display driver (ST7789/ILI9341) is correct for your board. Try a different Bruce build. |
| **Buttons unresponsive** | Double‑check button GPIO numbers in the script – they may differ from your board. |
| **Script fails to start** | Ensure the file is saved with UTF‑8 encoding, Unix (LF) line endings, and `.js` extension. |

---

## Contributing

Contributions are welcome! To propose improvements or new features:

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

**Developed with 🔐 and 💻 by the bruceNrfChat community.**
