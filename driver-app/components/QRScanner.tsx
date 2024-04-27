import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { useState } from 'react';

const QRScanner = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);

  const startScanner = async () => {
    setIsScanning(true);
    try {
      const scanResult = await BarcodeScanner.startScan();
      if (scanResult.hasContent) {
        setIsScanning(false);
        onScanComplete(scanResult.content);
      } else {
        setIsScanning(false);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setIsScanning(false);
    }
  };

  return (
    <button onClick={startScanner} disabled={isScanning}>
      {isScanning ? 'Scanning...' : 'Scan QR Code'}
    </button>
  );
};

export default QRScanner;