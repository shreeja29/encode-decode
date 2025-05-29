import React, { useState } from "react";
import "./App.css";

const Toast = ({ message, onClose }) => {
  if (!message) return null;

  setTimeout(() => {
    onClose();
  }, 3500);

  return (
    <div className="toast">
      {message}
      <button onClick={onClose} aria-label="Close toast">×</button>
    </div>
  );
};

function handleKeyDownInTextarea(e, inputText, setInputText) {
  if (e.key === "Tab") {
    e.preventDefault();
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newValue = inputText.slice(0, start) + "\t" + inputText.slice(end);
    setInputText(newValue);
    
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 1;
    }, 0);
  }
}

function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  const handleEncodeDecode = async (mode) => {
    const url = `http://localhost:3000/${mode}`;
    const bodyKey = mode === "encode" ? "text" : "encoded";
    const body = { [bodyKey]: inputText };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
      //  console.log((await res.json()).error);
       
        const errCode = res.status === 400 ? (await res.json()).code : "NETWORK_ERROR";
        console.log({errCode});
        
        switch (errCode) {
          case "INPUT_TOO_LONG":
            showToast("Message exceeds 280 characters.");
            break;
          case "UNSUPPORTED_CONTROL_CHAR":
            showToast("Input contains unsupported control characters.");
            break;
          case "UNKNOWN_SYMBOL":
            showToast("Encoded text contains unknown symbols.");
            break;
          default:
            showToast("Server unreachable. Please try again.");
        }
        setOutputText("");
        return;
      }

      const data = await res.json();
      console.log({data});
      
      const outputKey = mode === "encode" ? "encoded" : "decoded";
      setOutputText(data[outputKey]);
    } catch(err){
      showToast(err);
      setOutputText("");
    }
  };

  return (
    <>
      <div className="container">
        <h1 className="title">Symbol Cipher Tool</h1>
        <div className="textarea-group">
          <section className="input-section">
            <label htmlFor="input-text">Input Text</label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => handleKeyDownInTextarea(e, inputText, setInputText)}
              placeholder="Type your text here... (press Tab to insert a tab)"
              spellCheck={false}
              rows={10}
            />
          </section>

          <section className="output-section">
            <label htmlFor="output-text">Output Text</label>
            <textarea
              id="output-text"
              value={outputText}
              readOnly
              placeholder="Output will appear here..."
              rows={10}
            />
          </section>
        </div>

        <div className="button-group">
          <button onClick={() => handleEncodeDecode("encode")} className="btn encode">
            Encode
          </button>
          <button onClick={() => handleEncodeDecode("decode")} className="btn decode">
            Decode
          </button>
        </div>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </>
  );
}

export default App;
