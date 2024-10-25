import { useState, useCallback, useEffect } from 'react';

function App() {
  const [Length, setLength] = useState(8);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeChars, setIncludeChars] = useState(false);
  const [Password, setPassword] = useState("");
  const [notifications, setNotifications] = useState([]); 

  const PasswordGenerator = useCallback(() => {
    const characterSets = {
        letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        numbers: "1234567890",
        specialChars: "!@#$%^&*-_+={}[]<>?|"
    };

    let requiredCharacters = "";

    let str = characterSets.letters;

    if (includeNumbers) {
      str += characterSets.numbers;
      requiredCharacters += characterSets.numbers.charAt(Math.floor(Math.random() * characterSets.numbers.length));
    }
    console.log(requiredCharacters)

    if (includeChars) {
      str += characterSets.specialChars;
      requiredCharacters += characterSets.specialChars.charAt(Math.floor(Math.random() * characterSets.specialChars.length));
    }

    const remainingLength = Length - requiredCharacters.length;
    let pass = requiredCharacters;

    for (let i = 0; i < remainingLength; i++) {
        const char = str.charAt(Math.floor(Math.random() * str.length));
        pass += char;
    }

    pass = pass.split('').sort(() => Math.random() - 0.5).join('');

    setPassword(pass);
}, [Length, includeNumbers, includeChars]);



  useEffect(() => {
    PasswordGenerator();
  }, [Length, includeNumbers, includeChars, PasswordGenerator]);


  const copyToClipboard = () => {
    navigator.clipboard.writeText(Password).then(() => {
     
      const id = Date.now(); 
      setNotifications((prev) => [...prev, id]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((notifId) => notifId !== id));
      }, 1500);
    });
  };

  return (
    <>
      <div className="bg-slate-900 w-full h-48 rounded-2xl text-center m-10">
        <h1 className="p-4 w-full text-3xl font-semibold">Password Generator</h1>
        
        <div className="m-4">
          <input 
            className="p-2 rounded-tl-md rounded-bl-md border border-yellow-600" 
            type="text" 
            placeholder="Generated Password" 
            value={Password} 
            readOnly 
          />
          <button 
            className="bg-yellow-600 text-white py-2 px-4 rounded-tr-md rounded-br-md font-semibold hover:bg-yellow-700" 
            onClick={copyToClipboard}
          >
            Copy
          </button>
        </div>

        <div className="m-4 flex justify-center text-center items-center">
          <div className="m-2 flex justify-center text-center items-center">
            <input 
              type="range" 
              min={8} 
              max={16} 
              value={Length} 
              onChange={(e) => setLength(Number(e.target.value))} 
              className="w-20 m-1"
            />
            <label>Length: {Length}</label>
          </div>

          <div className="m-2 flex justify-center text-center items-center">
            <input 
              className="m-1" 
              type="checkbox" 
              checked={includeNumbers} 
              onChange={() => setIncludeNumbers((prev) => !prev)} 
            />
            <label className="m-1">Include Numbers</label>
          </div>

          <div className="m-2 flex justify-center text-center items-center">
            <input 
              className="m-1" 
              type="checkbox" 
              checked={includeChars} 
              onChange={() => setIncludeChars((prev) => !prev)} 
            />
            <label className="m-1">Include Special Characters</label>
          </div>
        </div>

        {/* Notification stacking */}
        <div className="fixed bottom-5 right-5">
          {notifications.map((id) => (
            <div
              key={id}
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 mb-2"
              style={{ transition: 'opacity 0.3s ease-in-out', opacity: 1 }}
            >
              Password copied to clipboard!
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
