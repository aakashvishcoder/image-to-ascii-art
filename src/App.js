import React, { useState, useRef } from "react";
import "./App.css";

const ASCII_CHARS = "@#8&$%*o!;." // From dark to light

function App() {
  const [asciiArt, setAsciiArt] = useState("");
  const canvasRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const width = 100; // width in characters
        const scale = width / img.width;
        const height = img.height * scale;

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        let ascii = "";
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const offset = (y * width + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const avg = (r + g + b) / 3;

            const charIndex = Math.floor((avg / 255) * (ASCII_CHARS.length - 1));
            ascii += ASCII_CHARS.charAt(charIndex);
          }
          ascii += "\n";
        }

        setAsciiArt(ascii);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="App">
      <h1>Image to ASCII Art</h1>
      <input type="file" accept="image/*" onChange={handleFile} />
      <pre className="ascii">{asciiArt}</pre>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default App;
