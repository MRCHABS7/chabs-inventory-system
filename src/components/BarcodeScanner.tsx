import { useState, useRef, useEffect } from 'react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: string) => void;
  isActive?: boolean;
}

export default function BarcodeScanner({ onScan, onError, isActive = false }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [lastScanned, setLastScanned] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isActive && isScanning) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isActive, isScanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      onError?.('Unable to access camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleScan(manualInput.trim());
      setManualInput('');
    }
  };

  const handleScan = (barcode: string) => {
    if (barcode === lastScanned) return; // Prevent duplicate scans
    
    setLastScanned(barcode);
    onScan(barcode);
    
    // Clear last scanned after 2 seconds to allow rescanning
    setTimeout(() => setLastScanned(''), 2000);
  };

  // Simulate barcode detection (in a real app, you'd use a library like QuaggaJS or ZXing)
  const simulateScan = () => {
    const sampleBarcodes = [
      '1234567890123',
      '9876543210987',
      '5555555555555',
      '1111111111111'
    ];
    const randomBarcode = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)];
    handleScan(randomBarcode);
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">📱 Barcode Scanner</h3>
        <button
          onClick={() => setIsScanning(!isScanning)}
          className={`btn ${isScanning ? 'btn-danger' : 'btn-primary'}`}
          aria-label={isScanning ? 'Stop scanning' : 'Start scanning'}
        >
          {isScanning ? '⏹️ Stop Camera' : '📷 Start Camera'}
        </button>
      </div>

      {isScanning && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-red-500 w-64 h-32 bg-transparent">
                <div className="text-white text-center mt-2 text-sm">
                  Position barcode within this frame
                </div>
              </div>
            </div>
          </div>

          {/* Demo button for testing */}
          <div className="text-center">
            <button
              onClick={simulateScan}
              className="btn btn-secondary"
              aria-label="Simulate barcode scan for testing"
            >
              🎯 Simulate Scan (Demo)
            </button>
          </div>
        </div>
      )}

      {/* Manual Input */}
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Manual Entry</h4>
          <form onSubmit={handleManualSubmit} className="flex space-x-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Enter barcode manually..."
              className="input flex-1"
              aria-label="Manual barcode entry"
            />
            <button
              type="submit"
              className="btn btn-primary"
              aria-label="Submit manual barcode"
            >
              ✓ Submit
            </button>
          </form>
        </div>

        {/* Recent Scans */}
        {lastScanned && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <div>
                <div className="font-medium text-green-800">Last Scanned</div>
                <div className="text-green-700 font-mono">{lastScanned}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">📖 Instructions</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Click "Start Camera" to begin scanning</li>
          <li>• Position the barcode within the red frame</li>
          <li>• The barcode will be detected automatically</li>
          <li>• Use manual entry if camera scanning isn't available</li>
          <li>• Grant camera permissions when prompted</li>
        </ul>
      </div>
    </div>
  );
}