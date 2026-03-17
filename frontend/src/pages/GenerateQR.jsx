import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useReactToPrint } from 'react-to-print';

function GenerateQR({ componentId, componentName, category }) {
    const qrRef = useRef();

    // This hook creates a hidden print window that only prints what is inside the ref
    const handlePrint = useReactToPrint({
        content: () => qrRef.current,
        documentTitle: `${componentName}-QR`,
    });

    if (!componentId) return null;

    return (
        <div className="flex flex-col items-center">
            {/* The actual sticker to be printed */}
            <div 
                ref={qrRef} 
                className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center w-64"
            >
                <h3 className="font-bold text-center text-lg text-gray-800 leading-tight">
                    {componentName}
                </h3>
                <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">
                    {category}
                </p>
                
                <QRCodeSVG value={componentId} size={150} level="H" />
                
                <p className="text-[10px] text-gray-400 mt-3 font-mono text-center break-all">
                    {componentId}
                </p>
            </div>

            <button 
                onClick={handlePrint} 
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
            >
                🖨️ Print Sticker
            </button>
        </div>
    );
}

export default GenerateQR;