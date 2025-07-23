import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Gift, Sparkles, Heart, MessageSquare, Send, Bot, Rocket, Satellite, Gem, Lightbulb } from 'lucide-react'; // Added Lightbulb for prophecy

// Main App component
const App = () => {
  // State to control the visibility of the main birthday message
  const [messageVisible, setMessageVisible] = useState(false);
  // State to simulate a console log output
  const [consoleLog, setConsoleLog] = useState([]);
  // State to track the current index of the console log lines being displayed
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  // State to control the "boot-up" animation completion
  const [bootUpComplete, setBootUpComplete] = useState(false);
  // State to control the visibility of the Interstellar Message Log modal
  const [interstellarLogVisible, setInterstellarLogVisible] = useState(false);
  // State to control the visibility of the chatbot
  const [chatBotVisible, setChatBotVisible] = useState(false);
  // State for chatbot messages
  const [chatMessages, setChatMessages] = useState([]);
  // State for current chatbot input
  const [chatInput, setChatInput] = useState('');
  // State for chatbot loading indicator
  const [isChatLoading, setIsChatLoading] = useState(false);
  // State to control the visibility of the Memory Crystal modal
  const [memoryCrystalVisible, setMemoryCrystalVisible] = useState(false);
  // State to track the current memory fragment displayed
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  // State to control the visibility of the Cosmic Prophecy modal
  const [cosmicProphecyVisible, setCosmicProphecyVisible] = useState(false);
  // State for the generated prophecy text
  const [prophecyText, setProphecyText] = useState('');
  // State for prophecy loading indicator
  const [isProphecyLoading, setIsProphecyLoading] = useState(false);

  // Ref for scrolling chat to bottom
  const chatMessagesEndRef = useRef(null);

  // Array of messages to simulate a console boot-up sequence
  const bootUpMessages = [
    "INITIATING INTERGALACTIC TRANSMISSION PROTOCOL...",
    "ESTABLISHING SECURE QUANTUM LINK TO SECTOR TEBOHO-7...",
    "DECRYPTING CELEBRATION ENCRYPTIONS FROM MVUYELWA_OS...",
    "AUTHENTICATING RECIPIENT: TEBOHO, RESIDENT OF PLANET EARTH...",
    "VERIFYING TRANSMISSION INTEGRITY: 100%...",
    "CALIBRATING VISUAL DISPLAY FOR OPTIMAL RECEPTION...",
    "PREPARING COSMIC SURPRISE SEQUENCE...",
    "TRANSMISSION COMPLETE. DISPLAYING PRIMARY MESSAGE."
  ];

  // Array of personal memory fragments for the Memory Crystal (UPDATED FOR PLATONIC TONE)
  const memoryFragments = [
    "Memory Fragment 001: Your laughter is truly infectious, brightening up any cosmic journey. It's almost as loud as a black hole burping!",
    "Memory Fragment 002: Grateful for every moment we've navigated this galaxy together as friends. Each one, a shining star. Even that time we almost got sucked into a wormhole trying to find the best pizza.",
    "Memory Fragment 003: Your brilliance and kindness shine brighter than any supernova, Teboho. Never forget how amazing you are. Seriously, sunglasses are recommended when you enter a room.",
    "Memory Fragment 004: Our shared adventures and inside jokes are etched into the very fabric of spacetime. More fun to come! Maybe next time we'll find a planet made entirely of chocolate.",
    "Memory Fragment 005: May your journey through the cosmos be as extraordinary as your friendship. Happy Birthday! And remember, if you ever meet an alien, ask if they have Wi-Fi."
  ];

  // Effect hook to simulate the console log appearing line by line
  useEffect(() => {
    if (currentLogIndex < bootUpMessages.length) {
      const timer = setTimeout(() => {
        setConsoleLog(prev => [...prev, bootUpMessages[currentLogIndex]]);
        setCurrentLogIndex(prev => prev + 1);
      }, 500); // Adjust typing speed here
      return () => clearTimeout(timer);
    } else {
      // Once all console messages are displayed, set bootUpComplete to true
      setBootUpComplete(true);
      // After a short delay, reveal the main birthday message
      const revealTimer = setTimeout(() => {
        setMessageVisible(true);
      }, 1000); // Delay before main message appears
      return () => clearTimeout(revealTimer);
    }
  }, [currentLogIndex, bootUpMessages]);

  // Scroll to bottom of chat messages
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Function to handle sending a message to the chatbot
  const handleSendMessage = async () => {
    if (chatInput.trim() === '') return;

    const userMessage = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      let chatHistory = [];
      // Add previous messages to history for context
      chatMessages.forEach(msg => chatHistory.push({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] }));
      chatHistory.push({ role: "user", parts: [{ text: chatInput }] });

      const payload = { contents: chatHistory };
      const apiKey = "AIzaSyBForYkIf4uIdOdoAUNmuYeqaCt0VOZao8"; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const botResponse = result.candidates[0].content.parts[0].text;
        setChatMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'bot', text: "Error: Could not get a response. Transmission interference detected." }]);
      }
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);
      setChatMessages(prev => [...prev, { role: 'bot', text: "Error: Failed to connect to the intergalactic network." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Function to handle activating the Memory Crystal
  const handleActivateMemoryCrystal = () => {
    setMemoryCrystalVisible(true);
    setCurrentMemoryIndex(0); // Start from the first memory
  };

  // Function to cycle through memory fragments
  const showNextMemory = () => {
    setCurrentMemoryIndex((prevIndex) => (prevIndex + 1) % memoryFragments.length);
  };

  // Function to generate Cosmic Prophecy
  const generateCosmicProphecy = async () => {
    setCosmicProphecyVisible(true);
    setProphecyText('');
    setIsProphecyLoading(true);

    try {
      const prompt = "Generate a quirky, positive, sci-fi themed birthday prophecy for Teboho, including elements of space travel, new discoveries, joy, and maybe a humorous alien encounter. Keep it around 100-150 words.";
      let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];

      const payload = { contents: chatHistory };
      const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        setProphecyText(result.candidates[0].content.parts[0].text);
      } else {
        setProphecyText("Prophecy transmission failed. Cosmic dust interference detected!");
      }
    } catch (error) {
      console.error("Error generating prophecy:", error);
      setProphecyText("Prophecy generator offline. Check intergalactic power grid.");
    } finally {
      setIsProphecyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-gray-200 font-inter flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background glowing particles/shapes for avant-garde sci-fi feel */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyan-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-pink-600 rounded-full mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Subtle background grid/circuit pattern */}
      <div className="absolute inset-0 z-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-3xl bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8 md:p-12 flex flex-col items-center text-center transform transition-all duration-500 ease-in-out scale-95 hover:scale-100 border-t-4 border-l-4 border-gradient-to-br from-purple-500 to-cyan-500">

        {/* Top decorative line - now part of the main border */}
        <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mb-8 opacity-0"></div> {/* Hidden, border takes over */}

        {/* Console/Boot-up Area */}
        <div className="w-full bg-gray-900 text-green-400 font-mono text-left p-6 rounded-lg border border-gray-700 mb-8 max-h-60 overflow-y-auto custom-scrollbar shadow-inner-lg">
          {consoleLog.map((line, index) => (
            <p key={index} className="mb-1 animate-fadeIn">
              <Terminal size={16} className="inline-block mr-2 text-purple-400" />
              {line}
            </p>
          ))}
          {/* Blinking cursor effect */}
          {!bootUpComplete && (
            <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1"></span>
          )}
        </div>

        {/* Main Birthday Message Area */}
        {messageVisible && (
          <div className="opacity-0 animate-fadeInUp delay-1000">
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300 mb-6 leading-tight drop-shadow-lg">
              INTERGALACTIC TRANSMISSION: HAPPY BIRTHDAY, TEBOHO!
              <Sparkles size={48} className="inline-block ml-4 text-yellow-300 animate-bounce" />
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              May your Earth-cycle be filled with joy, laughter, and cosmic wonders!
              You're truly a stellar phenomenon!
            </p>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Rocket size={40} className="text-purple-400 animate-pulse" />
              <span className="text-3xl text-cyan-400 font-bold">
                A Galactic Celebration Just For You!
              </span>
              <Satellite size={40} className="text-pink-400 animate-ping" />
            </div>
            <p className="text-lg text-gray-400 italic">
              — Transmitted from a distant star system by Mvuyelwa
            </p>

            {/* Buttons for additional features */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 flex-wrap gap-4"> {/* Added flex-wrap and gap */}
              <button
                onClick={() => setInterstellarLogVisible(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center border border-purple-400 min-w-[200px]"
              >
                <MessageSquare size={20} className="mr-2" />
                Interstellar Message Log
              </button>
              <button
                onClick={() => setChatBotVisible(true)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold rounded-full shadow-lg hover:from-cyan-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center border border-cyan-400 min-w-[200px]"
              >
                <Bot size={20} className="mr-2" />
                Query Birthday Bot
              </button>
              <button
                onClick={handleActivateMemoryCrystal}
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-red-600 text-white font-bold rounded-full shadow-lg hover:from-pink-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center border border-pink-400 min-w-[200px]"
              >
                <Gem size={20} className="mr-2" />
                Activate Memory Crystal
              </button>
              <button
                onClick={generateCosmicProphecy}
                className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-full shadow-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center border border-yellow-400 min-w-[200px]"
              >
                <Lightbulb size={20} className="mr-2" />
                Consult Cosmic Oracle
              </button>
            </div>
          </div>
        )}

        {/* Bottom decorative line - now part of the main border */}
        <div className="w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-8 opacity-0"></div> {/* Hidden, border takes over */}
      </div>

      {/* Interstellar Message Log Modal */}
      {interstellarLogVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-8 max-w-xl w-full text-center relative transform scale-95 animate-scaleIn border-t-4 border-l-4 border-gradient-to-br from-purple-500 to-cyan-500">
            <button
              onClick={() => setInterstellarLogVisible(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300 mb-6 drop-shadow-lg">
              Interstellar Message Log
            </h2>
            <div className="text-left text-gray-300 mb-6 border border-gray-700 rounded-lg p-4 bg-gray-900 overflow-y-auto max-h-[60vh] custom-scrollbar">
              <p className="text-lg font-bold text-cyan-400 mb-2 flex items-center">
                <Terminal size={20} className="mr-2" />
                Log Entry: Primary Birthday Transmission
              </p>
              <p className="mb-4">
                Origin: Mvuyelwa_OS, Sector Xylo-7. Destination: Teboho, Planet Earth.
                <br />
                Message: May your Earth-cycle be filled with joy, laughter, and cosmic wonders! You're truly a stellar phenomenon!
              </p>
              <div className="w-full h-px bg-gray-700 my-4"></div>
              <p className="text-lg font-bold text-purple-400 mb-2 flex items-center">
                <Satellite size={20} className="mr-2" />
                Personal Log Entry from Mvuyelwa
              </p>
              <p className="text-xl leading-relaxed">
                Greetings, Teboho, from across the cosmic expanse!
                <br /><br />
                This transmission carries my warmest wishes for your current orbital completion.
                I've calibrated these digital constructs to manifest a celebration worthy of your unique stellar signature.
                <br /><br />
                Now, I know what you're thinking: "Mvuyelwa, did you really send this from a dimension where socks never get lost in the laundry?" And the answer is... perhaps! The quantum entanglement of birthday wishes is a mysterious thing.
                <br /><br />
                May your personal universe expand with boundless joy, uncharted adventures (hopefully without any rogue asteroids), and vibrant, nebular happiness. May your coffee always be perfectly brewed, your Wi-Fi signal strong, and your alien encounters be of the friendly, gift-bearing kind.
                <br /><br />
                Your presence illuminates the void, and I am grateful for our shared trajectory. Seriously, you're cooler than a black hole in a freezer.
                <br /><br />
                End Transmission.
                <br />
                — Mvuyelwa, Operative of the Star-Bound Sentience (and occasional cosmic comedian)
              </p>
            </div>
            <Sparkles size={32} className="text-yellow-300 mx-auto animate-spin-slow" />
          </div>
        </div>
      )}

      {/* Chatbot Modal */}
      {chatBotVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-8 max-w-md w-full h-3/4 flex flex-col relative transform scale-95 animate-scaleIn border-t-4 border-l-4 border-gradient-to-br from-cyan-500 to-teal-500">
            <button
              onClick={() => setChatBotVisible(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 mb-6 flex items-center justify-center drop-shadow-lg">
              <Bot size={32} className="mr-2" /> Birthday Bot AI
            </h2>

            {/* Chat messages display area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 mb-4 bg-gray-900 rounded-lg border border-gray-700">
              {chatMessages.length === 0 && (
                <p className="text-gray-500 text-center italic">
                  Greetings, Earthling! This is the Birthday Bot. Query me about anything related to your celebration or the cosmos!
                </p>
              )}
              {chatMessages.map((msg, index) => (
                <div key={index} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-xl max-w-[80%] ${
                    msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start mb-3">
                  <div className="p-3 rounded-xl bg-gray-700 text-gray-200 rounded-bl-none">
                    <span className="animate-pulse">Bot processing data...</span>
                  </div>
                </div>
              )}
              <div ref={chatMessagesEndRef} /> {/* Scroll target */}
            </div>

            {/* Chat input area */}
            <div className="flex mt-auto">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                placeholder="Transmit your query..."
                className="flex-1 p-3 rounded-l-full bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-cyan-500"
                disabled={isChatLoading}
              />
              <button
                onClick={handleSendMessage}
                className="px-5 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-r-full hover:from-cyan-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center"
                disabled={isChatLoading}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Memory Crystal Activation Modal */}
      {memoryCrystalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-8 max-w-lg w-full text-center relative transform scale-95 animate-scaleIn border-t-4 border-l-4 border-gradient-to-br from-pink-500 to-red-500">
            <button
              onClick={() => setMemoryCrystalVisible(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-300 mb-6 flex items-center justify-center drop-shadow-lg">
              <Gem size={40} className="mr-3 animate-spin-slow" />
              Memory Crystal Projection
            </h2>

            <div
              className="relative w-full max-w-[200px] sm:max-w-[250px] aspect-square mx-auto mb-8 cursor-pointer transform hover:scale-105 transition-transform duration-300"
              onClick={showNextMemory}
            >
              {/* Crystal base shape (can be more complex SVG for true sci-fi) */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-70 animate-pulse-light"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-blue-300 to-purple-500 rounded-full opacity-80 animate-pulse-light animation-delay-500"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-blue-200 to-purple-400 rounded-full opacity-90 animate-pulse-light animation-delay-1000"></div>
              <div className="absolute inset-6 bg-gradient-to-br from-blue-100 to-purple-300 rounded-full opacity-100 animate-pulse-light animation-delay-1500"></div>

              {/* Central glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2/3 h-2/3 bg-white rounded-full filter blur-xl opacity-50 animate-glow"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-white text-5xl sm:text-6xl font-bold">
                <Heart size={64} className="text-pink-400 animate-beat" />
              </div>
            </div>

            <p className="text-xl text-gray-300 italic mb-6 animate-fadeInUp delay-500 overflow-y-auto max-h-[20vh] custom-scrollbar">
              {memoryFragments[currentMemoryIndex]}
            </p>
            <p className="text-sm text-gray-500">
              Click the crystal to reveal another memory fragment.
            </p>
            <Sparkles size={32} className="text-yellow-300 mx-auto mt-6 animate-spin-slow" />
          </div>
        </div>
      )}

      {/* Cosmic Prophecy Modal */}
      {cosmicProphecyVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gray-800 bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700 p-8 max-w-lg w-full text-center relative transform scale-95 animate-scaleIn border-t-4 border-l-4 border-gradient-to-br from-yellow-500 to-orange-500">
            <button
              onClick={() => setCosmicProphecyVisible(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-300 mb-6 flex items-center justify-center drop-shadow-lg">
              <Lightbulb size={40} className="mr-3 animate-pulse" />
              Cosmic Prophecy
            </h2>

            {isProphecyLoading ? (
              <div className="flex flex-col items-center justify-center h-48">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
                <p className="mt-4 text-xl text-gray-300">Consulting the Cosmic Oracle...</p>
              </div>
            ) : (
              <p className="text-xl text-gray-300 leading-relaxed mb-6 overflow-y-auto max-h-[40vh] custom-scrollbar">
                {prophecyText}
              </p>
            )}
            <Sparkles size={32} className="text-yellow-300 mx-auto mt-6 animate-spin-slow" />
          </div>
        </div>
      )}

      {/* Tailwind CSS CDN for easy deployment */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Custom styles for animations and scrollbar */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Orbitron:wght@400;700&display=swap');
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        .font-orbitron {
          font-family: 'Orbitron', sans-serif;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        .drop-shadow-lg {
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));
        }
        .shadow-inner-lg {
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.6);
        }
        .border-gradient-to-br {
          border-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
          border-image-slice: 1;
        }
        .animate-pulse-light {
          animation: pulse-light 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-glow {
          animation: glow 1.5s ease-in-out infinite alternate;
        }
        .animate-beat {
          animation: beat 1s infinite alternate;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-light {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes glow {
          from { box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #fff; }
          to { box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #fff; }
        }
        @keyframes beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        /* Custom scrollbar for the console log and chat */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default App;
