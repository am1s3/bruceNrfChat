<img width="1814" height="867" alt="image4" src="https://github.com/user-attachments/assets/5b24d186-cbd6-49b6-9bb6-32bb5f8498be" />

# bruceNrfChat 🔐

**Encrypted text messaging for ESP32‑S3**  
Using nRF24L01+ radios, Bruce firmware, and Diffie‑Hellman key exchange.

---

## Overview

`bruceNrfChat` is a real‑time, encrypted chat application for ESP32‑S3 microcontrollers running the [Bruce firmware](https://bruce.computer). It connects two devices directly via nRF24L01+ modules, enabling secure text communication without Wi‑Fi, Bluetooth, or the Internet.

This project runs entirely from an SD card – no firmware recompilation is required. Just copy the JavaScript file, insert the card, and start chatting.

---

## Features

- **End‑to‑end encryption** – Diffie‑Hellman key exchange + XOR cipher.
- **Virtual QWERTY keyboard** – full input using physical buttons.
- **Chat history** – messages are saved to SD card (`/chat_log.txt`) and can be viewed anytime (press and hold BACK for 2 seconds).
- **Typing indicator** – shows when the other device is composing a message.
- **Delivery confirmation (ACK)** – each message is acknowledged; delivered messages display a checkmark (✓).
- **Role‑based communication** – Initiator (sender) and Responder (receiver).
- **Off‑grid** – pure 2.4 GHz radio, no external infrastructure.
- **Portable** – runs from SD card; no firmware flashing required.
- **Modular** – easily adaptable to any ESP32‑S3 board.

---

## Supported Hardware

| Device / Board | Script File |
|----------------|-------------|
| **Smoochiee V2** | `bruceNrfChat_smoochiee.js` |
| **LilyGO T‑Embed CC1101** | `bruceNrfChat_t-embed.js` |
| **M5Stack Cardputer** | `bruceNrfChat_cardputer.js` |
| **M5StickC Plus2** | `bruceNrfChat_stickcplus2.js` |
| **LilyGO T‑Display S3** | `bruceNrfChat_tdisplay-s3.js` |
| **CYD‑2432S028** | `bruceNrfChat_cyd.js` |
| **Custom ESP32‑S3** | `bruceNrfChat_ESP32-generic.js` |

> For custom boards, simply edit the pin definitions at the top of `bruceNrfChat_ESP32-generic.js` to match your wiring.

---

## Requirements

- **Two ESP32‑S3 devices** (or compatible boards) with Bruce firmware v1.15+.
- **Two nRF24L01+ modules** (PA/LNA recommended for longer range).
- **Two SD cards** (FAT32) – one per device.
- **Physical buttons** for navigation (wired according to your board’s pinout).
- **Optional:** USB keyboard (USB‑host capable boards).

---

## Installation & Setup

### 1. Prepare Hardware
- Flash Bruce firmware (v1.15 or newer) on both devices.
- Wire the nRF24 module to the SPI pins (defaults are listed in each script).

### 2. Choose & Copy Script
- Select the script for your board from the table above.
- For custom boards, edit the pin definitions at the top of `bruceNrfChat_ESP32-generic.js`.
- Copy the `.js` file to the **root** of the SD card.

### 3. Run the Script
- Insert the SD card, open Bruce menu → **Scripts** → select the file.
- On **one** device, **press and hold UP** during startup – it becomes the **Responder**.
- On the **other**, start normally – it becomes the **Initiator**.

The devices will automatically perform a Diffie‑Hellman key exchange and then enter chat mode.

---

## Usage Guide

### Virtual Keyboard Controls

| Button | Action |
|--------|--------|
| **UP / DOWN** | Navigate keyboard rows |
| **LEFT / RIGHT** | Navigate keyboard columns |
| **SELECT** | Select highlighted character / send message |
| **BACK** | In keyboard mode – send current message and switch to chat view. In chat view – return to keyboard. Press and hold for 2 seconds to view history. |

### Chat History
- **View history:** Press and hold the **BACK** button for 2 seconds (in keyboard or chat mode).
- The last 50 messages are displayed.
- Press **SELECT** or **BACK** to return to the keyboard.

### Typing Indicator
- When you start typing, the other device shows *"Other is typing..."*.
- The indicator disappears after 1 second of inactivity.

### Delivery Confirmation
- Sent messages are marked with `...` until the receiver acknowledges.
- Once acknowledged, the status changes to `✓`.

---

## Security Model

`bruceNrfChat` uses a two‑step cryptographic process:

1. **Diffie‑Hellman key exchange** – a secure public‑key protocol allowing both devices to independently compute a shared secret without transmitting it over the air.
2. **XOR encryption** – each message is XOR‑encrypted using the shared secret.

> ⚠️ **Important:** XOR is a lightweight cipher suitable for demonstration and education. It protects against casual eavesdropping but is not resistant to determined cryptanalysis. For production use, consider replacing with AES‑128 (planned for future release).

---

## Customising Pin Assignments

For custom wiring, edit the following variables at the top of `bruceNrfChat_ESP32-generic.js`:

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

Set these to match your physical connections, save, and run.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"NRF24 not configured"** | Check pin definitions; ensure nRF24 is powered and wired correctly. |
| **No messages received** | Verify both devices use the same channel (default 100) and data rate (250 kbps). Check antenna placement. |
| **Display shows garbage** | Confirm display driver (ST7789/ILI9341) is correct for your board. Try a different Bruce build. |
| **Buttons unresponsive** | Double‑check button GPIO numbers in the script – they may differ from your board. |
| **History not saving** | Ensure SD card is present and formatted as FAT32. |
| **ACK not received** | Check signal strength; try moving devices closer. |

---

## Contributing

Contributions are welcome! To propose improvements or new features:

1. Fork this repository.
2. Create a new feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please follow the existing code style and include appropriate documentation.

---

## License

This project is distributed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- The [Bruce firmware](https://bruce.computer) team for their outstanding platform.
- The open‑source community for nRF24L01+ support and inspiration.
- All contributors and testers who helped refine this project.

---

**Developed with 🔐 and 💻 by the bruceNrfChat community.**
