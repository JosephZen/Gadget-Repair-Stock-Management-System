import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

function Scanner() {
    const [scannedId, setScannedId] = useState(null);
    const [componentData, setComponentData] = useState(null);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // 1. Initialize the Scanner
        const scanner = new Html5QrcodeScanner(
            "qr-reader", // This must match the ID of the div below
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false // verbose mode
        );

        // 2. Start Scanning
        scanner.render(onScanSuccess, onScanError);

        // 3. What happens when it successfully reads a QR Code
        function onScanSuccess(decodedText) {
            scanner.clear(); // Immediately turn off the camera
            setScannedId(decodedText);
            fetchComponentDetails(decodedText);
        }

        // 4. What happens when it fails (it will fail 10 times a second until it sees a QR code)
        function onScanError(err) {
            // We usually leave this empty so it doesn't spam the console
        }

        // 5. Cleanup function: Turn off the camera if the user navigates to another page
        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner", error));
        };
    }, []);

    // Fetch the data from your Postgres Database via Render Backend
    const fetchComponentDetails = async (id) => {
        setLoading(true);
        setError('');
        try {
            // Make sure this matches your actual backend URL or local API
            const response = await axios.get(`http://localhost:3000/api/components/${id}`);
            
            if (response.data.success) {
                setComponentData(response.data.component);
                setLinks(response.data.links || []);
            }
        } catch (err) {
            console.error(err);
            setError("Component not found in database.");
        } finally {
            setLoading(false);
        }
    };

    // Reset scanner to scan another item
    const resetScanner = () => {
        setScannedId(null);
        setComponentData(null);
        setLinks([]);
        setError('');
        // Reloading the page is the safest way to reset the camera cleanly in browsers
        window.location.reload(); 
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-black text-gray-800 mb-6 text-center">Scan Part</h1>

            {/* ERROR MESSAGE */}
            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-center font-semibold">
                    {error}
                </div>
            )}

            {/* SCANNER CAMERA VIEW */}
            {!scannedId && (
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                    <div id="qr-reader" className="w-full"></div>
                    <p className="text-center text-gray-500 mt-4 text-sm">
                        Point your camera at the component's QR code
                    </p>
                </div>
            )}

            {/* LOADING STATE */}
            {loading && (
                <div className="text-center py-10">
                    <p className="text-xl font-bold text-blue-600 animate-pulse">Searching Database...</p>
                </div>
            )}

            {/* SUCCESS: SHOW COMPONENT DATA */}
            {componentData && !loading && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
                    
                    {/* Part Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {componentData.brand} {componentData.model}
                            </h2>
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider mt-1">
                                {componentData.category}
                            </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            componentData.condition.includes('New') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                            {componentData.condition}
                        </span>
                    </div>

                    {/* Part Details */}
                    <div className="space-y-3 mb-6">
                        <p className="text-gray-600">
                            <strong className="text-gray-800">Stock Available:</strong> {componentData.stock_quantity}
                        </p>
                        {componentData.description && (
                            <p className="text-gray-600">
                                <strong className="text-gray-800">Notes:</strong> {componentData.description}
                            </p>
                        )}
                        <p className="text-xs text-gray-400 font-mono mt-4">ID: {componentData.id}</p>
                    </div>

                    {/* Supplier Links Section */}
                    {links.length > 0 && (
                        <div className="border-t pt-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-3">Reorder Links</h3>
                            <div className="space-y-2">
                                {links.map(link => (
                                    <a 
                                        key={link.id} 
                                        href={link.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border"
                                    >
                                        <span className="font-semibold text-blue-600">{link.store_name}</span>
                                        {link.price && <span className="text-gray-600 font-medium">${link.price}</span>}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Scan Again Button */}
                    <button 
                        onClick={resetScanner}
                        className="w-full mt-8 bg-black text-white p-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                    >
                        Scan Another Part
                    </button>
                </div>
            )}
        </div>
    );
}

export default Scanner;