var role = "initiator";
var text = "";
var receivedText = "";
var keyboardLayout = [
    ["1","2","3","4","5","6","7","8","9","0"],
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L",";"],
    ["Z","X","C","V","B","N","M",",",".","?"],
    ["SPACE","BACK","CLEAR","SEND"]
];
var rows = 5;
var cols = 10;
var selectedRow = 0;
var selectedCol = 0;
var mode = "keyboard";

var nrfCE = 9;
var nrfCSN = 8;
var nrfSCK = 14;
var nrfMOSI = 13;
var nrfMISO = 12;

var btnUP = 38;
var btnDOWN = 39;
var btnLEFT = 40;
var btnRIGHT = 41;
var btnSELECT = 37;
var btnBACK = 42;

var p = 2147483647;
var g = 5;
var privateKey = Math.floor(Math.random() * (p - 2)) + 2;
var publicKey = modPow(g, privateKey, p);
var sharedSecret = 0;
var dhComplete = false;

if (gpio.read(btnUP) == 0) { role = "responder"; }

nrf.init(nrfSCK, nrfMISO, nrfMOSI, nrfCSN, nrfCE);
nrf.setChannel(100);
nrf.setDataRate("250kbps");
nrf.setPower("max");

display.clear();

function modPow(base, exp, mod) {
    var result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 == 1) { result = (result * base) % mod; }
        exp = exp >> 1;
        base = (base * base) % mod;
    }
    return result;
}

function encryptDecrypt(msg, key) {
    var out = "";
    for (var i = 0; i < msg.length; i++) {
        out += String.fromCharCode(msg.charCodeAt(i) ^ key);
    }
    return out;
}

function drawKeyboard() {
    display.clear();
    display.println("Chat (" + role + ")");
    display.println("Text: " + text + "_");
    display.println("");
    for (var r = 0; r < rows; r++) {
        var line = "";
        for (var c = 0; c < cols; c++) {
            if (r == selectedRow && c == selectedCol) {
                line += "[" + keyboardLayout[r][c] + "]";
            } else {
                line += " " + keyboardLayout[r][c] + " ";
            }
        }
        display.println(line);
    }
    if (receivedText != "") {
        display.println("Last received: " + receivedText);
    }
    display.println("Keys: UP/DOWN/LEFT/RIGHT | SELECT=choose | BACK=exit");
}

function drawChat() {
    display.clear();
    display.println("Chat (" + role + ")");
    display.println("----------------");
    display.println("You: " + text);
    if (receivedText != "") {
        display.println("Other: " + receivedText);
    }
    display.println("----------------");
    display.println("Press SELECT to send | BACK to exit");
}

function dhExchange() {
    display.println("DH: exchanging keys...");
    if (role == "initiator") {
        nrf.send(publicKey.toString());
        var received = nrf.receive();
        while (received == null || received == "") {
            delay(100);
            received = nrf.receive();
        }
        var otherPublic = parseInt(received);
        sharedSecret = modPow(otherPublic, privateKey, p);
    } else {
        var received = nrf.receive();
        while (received == null || received == "") {
            delay(100);
            received = nrf.receive();
        }
        var otherPublic = parseInt(received);
        nrf.send(publicKey.toString());
        sharedSecret = modPow(otherPublic, privateKey, p);
    }
    dhComplete = true;
    display.println("DH: secret established.");
    display.println("Secret: " + sharedSecret);
    delay(1000);
    display.clear();
}

display.println("Starting DH key exchange...");
dhExchange();
drawKeyboard();

while (true) {
    if (mode == "keyboard") {
        if (gpio.read(btnUP) == 0) {
            selectedRow = (selectedRow - 1 + rows) % rows;
            if (selectedRow == rows - 1) { selectedCol = 0; }
            drawKeyboard();
            delay(200);
        }
        if (gpio.read(btnDOWN) == 0) {
            selectedRow = (selectedRow + 1) % rows;
            if (selectedRow == rows - 1) { selectedCol = 0; }
            drawKeyboard();
            delay(200);
        }
        if (gpio.read(btnLEFT) == 0) {
            selectedCol = (selectedCol - 1 + cols) % cols;
            drawKeyboard();
            delay(200);
        }
        if (gpio.read(btnRIGHT) == 0) {
            selectedCol = (selectedCol + 1) % cols;
            drawKeyboard();
            delay(200);
        }
        if (gpio.read(btnSELECT) == 0) {
            var key = keyboardLayout[selectedRow][selectedCol];
            if (key == "SPACE") {
                text += " ";
            } else if (key == "BACK") {
                if (text.length > 0) { text = text.slice(0, -1); }
            } else if (key == "CLEAR") {
                text = "";
            } else if (key == "SEND") {
                if (text.length > 0) {
                    var encrypted = encryptDecrypt(text, sharedSecret);
                    nrf.send(encrypted);
                    receivedText = "";
                    mode = "chat";
                    drawChat();
                }
            } else {
                text += key;
            }
            drawKeyboard();
            delay(200);
        }
        if (gpio.read(btnBACK) == 0) {
            if (text.length > 0) {
                var encrypted = encryptDecrypt(text, sharedSecret);
                nrf.send(encrypted);
                receivedText = "";
                mode = "chat";
                drawChat();
            }
            delay(200);
        }
        var incoming = nrf.receive();
        if (incoming != null && incoming != "") {
            var decrypted = encryptDecrypt(incoming, sharedSecret);
            receivedText = decrypted;
            drawKeyboard();
        }
        delay(50);
    }
    if (mode == "chat") {
        display.println("Press SELECT to return to keyboard");
        if (gpio.read(btnSELECT) == 0) {
            mode = "keyboard";
            drawKeyboard();
            delay(200);
        }
        if (gpio.read(btnBACK) == 0) {
            mode = "keyboard";
            drawKeyboard();
            delay(200);
        }
        var incoming = nrf.receive();
        if (incoming != null && incoming != "") {
            var decrypted = encryptDecrypt(incoming, sharedSecret);
            receivedText = decrypted;
            drawChat();
        }
        delay(50);
    }
}
