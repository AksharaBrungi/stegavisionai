# StegaVision AI  
### Secure Image Steganography Using Client-Side Autoencoder Principles

StegaVision AI is a privacy-focused web application that securely hides a secret image inside a carrier image using steganography. The hidden image is protected by a password and remains completely invisible until authorized access is provided.

The entire system runs **fully on the client side**, without any backend server or external database, ensuring maximum privacy and zero data leakage.

---

## 🚀 Key Highlights

- Secure image-in-image data hiding
- Password-protected secret image reveal
- Secret image never visible after encoding
- Dashboard with full history of encoded images
- Click any stored image → enter password → reveal secret
- No backend server, no cloud storage
- High privacy, fast performance, works offline

---

## 🧠 Project Overview

StegaVision AI implements **image steganography** using a **Least Significant Bit (LSB)** approach inspired by **autoencoder concepts in deep learning**.

Instead of transmitting secret images directly, the system embeds secret pixel data into the carrier image’s least noticeable bits, making the carrier image appear completely normal to human vision.

---

## 🛠️ Technology Stack

### Languages
- **TypeScript** – core application logic
- **JavaScript** – browser execution
- **HTML5** – application structure
- **CSS3** – styling

### Frameworks & Tools
- **React** – user interface
- **Vite** – development & build tool
- **Tailwind CSS** – modern responsive UI
- **HTML5 Canvas API** – pixel-level image processing
- **LocalStorage API** – browser-based data storage

---

## ❌ Technologies Not Used

- Java / Python backend
- Node.js server
- SQL / MongoDB
- Cloud or third-party storage
- External APIs for processing

---

## 🏗️ System Architecture

```

User
↓
React Frontend (TypeScript)
↓
Canvas API (Image Processing Engine)
↓
Browser LocalStorage (Client-Side Database)

```

All processing and storage occur **inside the user’s browser**.

---

## 📂 Project Structure

```

stegavision-ai/
│
├── index.html
├── main.tsx
├── App.tsx
├── types.ts
├── metadata.json
├── package.json
├── vite.config.ts
│
├── components/
│   ├── Header.tsx
│   ├── ImageUploader.tsx
│   └── UI Components
│
├── utils/
│   └── steganography.ts

```

---

## 🔄 Application Workflow

### 1. Carrier Image Selection
User uploads a normal image that acts as the cover.

### 2. Secret Image Upload
User uploads the confidential image to be hidden.

### 3. Password Setup
A password is set to protect the secret image.

### 4. Encoding Process
- Secret image data is embedded into carrier image pixels
- Secret image is removed from UI completely
- Only the encoded carrier image remains

### 5. Dashboard & History
- Encoded images are saved locally
- History persists using browser LocalStorage

### 6. Secret Image Reveal
- Click any saved carrier image
- Enter correct password
- Secret image is decoded and displayed

---

## 🔬 Steganography Technique Used

### Least Significant Bit (LSB) Encoding

Each image pixel consists of RGB color channels, each 8 bits long.

- Most Significant Bits (MSB): visible color
- Least Significant Bits (LSB): visually insignificant

#### Encoding Formula:
```

EncodedPixel = (CarrierPixel & 0xF0) | (SecretPixel >> 4)

````

#### Decoding:
- Extract LSBs
- Shift bits back to reconstruct the secret image

This method preserves visual quality while securely hiding data.

---

## 🧠 Autoencoder Inspiration

Although no neural network is trained, the system follows **autoencoder logic**:

| Autoencoder Component | Project Equivalent |
|----------------------|-------------------|
| Encoder | Image embedding logic |
| Latent Space | Stego-image |
| Decoder | Secret image reconstruction |

---

## 🔐 Security & Privacy Model

- Secret image never displayed post-encoding
- Password required for every reveal
- All data remains on the local machine
- No server communication
- Clear History option removes all stored data

---

## ▶️ How to Run the Project
### Steps
```bash
npm install
npm run dev
````

Open the displayed URL (usually):

```
http://localhost:5173
```

---

## 🧪 Backend Explanation (For Viva / Exams)

This project does **not use a traditional backend**.

* **Processing backend**: HTML5 Canvas API
* **Storage backend**: Browser LocalStorage
* **Logic backend**: TypeScript (client-side)

This architecture ensures privacy, speed, and zero deployment cost.

---

## 📌 Applications

* Secure image sharing
* Confidential data hiding
* Cybersecurity demonstrations
* Academic mini / major projects
* Privacy-preserving communication

---

## 🎓 Learning Outcomes

* Practical steganography implementation
* Client-side image processing
* React + TypeScript architecture
* Browser storage mechanisms
* Security-focused UI design

---
