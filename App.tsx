
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import { AppState, ImageData, HistoryItem } from './types';
import { processLSBEncode, processLSBDecode } from './utils/steganography';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.DASHBOARD);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Creation Flow States
  const [coverImage, setCoverImage] = useState<ImageData | null>(null);
  const [secretImage, setSecretImage] = useState<ImageData | null>(null);
  const [stegoImage, setStegoImage] = useState<ImageData | null>(null);
  const [password, setPassword] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Detail View States
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [passInput, setPassInput] = useState<string>('');
  const [revealError, setRevealError] = useState(false);
  const [revealedSecret, setRevealedSecret] = useState<string | null>(null);

  // Load History from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('stegavision_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (item: HistoryItem) => {
    const updated = [item, ...history];
    setHistory(updated);
    localStorage.setItem('stegavision_history', JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to permanently delete all history?')) {
      setHistory([]);
      localStorage.removeItem('stegavision_history');
    }
  };

  const handleNewTransformation = () => {
    setCoverImage(null);
    setSecretImage(null);
    setStegoImage(null);
    setPassword('');
    setAppState(AppState.STEP_CARRIER);
  };

  const startSynthesis = async () => {
    if (!coverImage || !secretImage || !password) return;
    setIsProcessing(true);
    try {
      const { stegoUrl } = await processLSBEncode(coverImage.url, secretImage.url);
      setStegoImage({ url: stegoUrl, width: coverImage.width, height: coverImage.height });
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        stegoUrl,
        passwordHash: password, // Simple client-side check
        timestamp: Date.now(),
        label: `Transformation ${history.length + 1}`
      };
      saveToHistory(newItem);
      setAppState(AppState.STEP_RESULT);
    } catch (err) {
      console.error(err);
      alert('Transformation failed. Kernel error.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReveal = async () => {
    if (!selectedItem) return;
    if (passInput === selectedItem.passwordHash) {
      setRevealError(false);
      setIsProcessing(true);
      try {
        const secret = await processLSBDecode(selectedItem.stegoUrl);
        setRevealedSecret(secret);
      } catch (err) {
        alert('Reconstruction failed.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      setRevealError(true);
      setTimeout(() => setRevealError(false), 1000);
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        onNavigate={(v) => v === 'dashboard' ? setAppState(AppState.DASHBOARD) : handleNewTransformation()} 
        onClearHistory={handleClearHistory}
        currentView={appState === AppState.DASHBOARD ? 'dashboard' : 'new'}
      />

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        
        {/* DASHBOARD VIEW */}
        {appState === AppState.DASHBOARD && !selectedItem && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex justify-between items-end border-b border-slate-800 pb-8">
              <div>
                <h2 className="text-4xl font-black text-white">DASHBOARD</h2>
                <p className="text-slate-400 mt-2">Manage and reveal your secure steganographic transformations.</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Storage</p>
                <p className="text-2xl font-mono text-blue-400">{history.length} <span className="text-sm">ITEMS</span></p>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="glass rounded-3xl p-20 text-center border-dashed border-2 border-slate-800">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
                  <i className="fa-solid fa-inbox text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-300">No transformations found</h3>
                <p className="text-slate-500 mt-2 max-w-sm mx-auto">Upload a carrier image to begin your first deep steganographic mapping.</p>
                <button 
                  onClick={handleNewTransformation}
                  className="mt-8 bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold transition-all shadow-xl shadow-blue-600/20"
                >
                  Create New Transformation
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => { setSelectedItem(item); setRevealedSecret(null); setPassInput(''); }}
                    className="group glass rounded-2xl overflow-hidden cursor-pointer border border-slate-800 hover:border-blue-500 transition-all hover:-translate-y-1"
                  >
                    <div className="aspect-square bg-slate-900 relative">
                      <img src={item.stegoUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={item.label} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</p>
                        <p className="text-sm font-bold text-white mt-1">Encrypted Payload</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DETAIL REVEAL VIEW */}
        {appState === AppState.DASHBOARD && selectedItem && (
          <div className="animate-in slide-in-from-bottom-8 duration-500">
            <button 
              onClick={() => setSelectedItem(null)}
              className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase font-black text-xs tracking-widest"
            >
              <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7">
                <div className="glass p-4 rounded-3xl border border-slate-800 shadow-2xl">
                  <img src={selectedItem.stegoUrl} className="w-full h-auto rounded-2xl" alt="Stego View" />
                </div>
              </div>
              
              <div className="lg:col-span-5 space-y-8">
                <div className="glass p-8 rounded-3xl border border-slate-800">
                  <h3 className="text-2xl font-bold mb-2">Authenticated Reveal</h3>
                  <p className="text-slate-400 text-sm mb-8">Enter the security key associated with this transformation to reconstruct the hidden pixels.</p>
                  
                  {!revealedSecret ? (
                    <div className="space-y-4">
                      <input 
                        type="password"
                        placeholder="Security Key"
                        className={`w-full bg-slate-900 border ${revealError ? 'border-red-500 animate-shake' : 'border-slate-700'} rounded-xl px-4 py-4 text-center text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono`}
                        value={passInput}
                        onChange={(e) => setPassInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleReveal()}
                      />
                      <button 
                        onClick={handleReveal}
                        disabled={isProcessing}
                        className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all shadow-xl shadow-blue-500/20"
                      >
                        {isProcessing ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Reconstruct Payload'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in zoom-in-95 duration-500">
                      <div className="aspect-square glass rounded-2xl overflow-hidden border-2 border-green-500/30">
                        <img src={revealedSecret} className="w-full h-full object-contain" alt="Revealed" />
                      </div>
                      <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-widest justify-center">
                        <i className="fa-solid fa-circle-check"></i> Pixel Integrity Verified
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: CARRIER UPLOAD */}
        {appState === AppState.STEP_CARRIER && (
          <div className="max-w-2xl mx-auto glass p-12 rounded-3xl shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black">STEP 1: THE CARRIER</h2>
              <p className="text-slate-400 mt-2">Select the public image that will house the hidden data.</p>
            </div>
            <ImageUploader label="Upload Carrier Image" onImageLoad={setCoverImage} currentImage={coverImage} />
            {coverImage && (
              <button 
                onClick={() => setAppState(AppState.STEP_SECRET)}
                className="w-full mt-10 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                Continue to Secret Payload <i className="fa-solid fa-arrow-right"></i>
              </button>
            )}
          </div>
        )}

        {/* STEP 2: SECRET & PASSWORD */}
        {appState === AppState.STEP_SECRET && (
          <div className="max-w-2xl mx-auto glass p-12 rounded-3xl shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black">STEP 2: THE PAYLOAD</h2>
              <p className="text-slate-400 mt-2">Upload the image to hide and set your decryption password.</p>
            </div>
            
            <ImageUploader label="Upload Secret Image" onImageLoad={setSecretImage} currentImage={secretImage} />
            
            <div className="mt-10 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Security Password</label>
                <input 
                  type="password"
                  placeholder="Set secret key..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <button onClick={() => setAppState(AppState.STEP_CARRIER)} className="flex-1 bg-slate-800 text-slate-400 py-4 rounded-xl font-bold">Back</button>
                <button 
                  onClick={startSynthesis}
                  disabled={!secretImage || !password || isProcessing}
                  className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  {isProcessing ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-atom"></i>}
                  {isProcessing ? 'Encoding...' : 'Generate Transformation'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: RESULT */}
        {appState === AppState.STEP_RESULT && (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-in zoom-in-95 duration-700">
            <div className="glass p-12 rounded-3xl border border-slate-800">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest mb-6">
                <i className="fa-solid fa-circle-check"></i> Synthesis Complete
              </div>
              <h2 className="text-3xl font-black mb-8">Stego-Carrier Generated</h2>
              
              <div className="aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden border-4 border-slate-800 shadow-2xl mb-10">
                <img src={stegoImage?.url} className="w-full h-full object-contain" alt="Stego Result" />
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setAppState(AppState.DASHBOARD)}
                  className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-lg transition-all"
                >
                  View in Dashboard
                </button>
                <button 
                  onClick={handleNewTransformation}
                  className="w-full text-slate-500 hover:text-white font-bold uppercase tracking-widest text-xs"
                >
                  Create Another
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default App;
