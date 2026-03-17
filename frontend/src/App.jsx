import { useState, useEffect } from 'react';
import axios from 'axios';
import Scanner from './pages/Scanner'; // Adjust path if needed
import GenerateQR from './pages/GenerateQR'; // Adjust path if needed

function App() {
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'add', 'scanner'
    const [inventory, setInventory] = useState([]);
    
    // Form State
    const [formData, setFormData] = useState({
        brand: '', model: '', category: 'LCD', condition: 'New', description: '', stock_quantity: 1
    });

    const API_URL = 'http://localhost:3000/api/components'; // Change when deploying

    // Fetch Inventory
    const fetchInventory = async () => {
        try {
            const res = await axios.get(API_URL);
            if (res.data.success) setInventory(res.data.components);
        } catch (err) {
            console.error("Failed to load inventory", err);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    // Create New Item
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, formData);
            alert("Part added successfully!");
            setFormData({ brand: '', model: '', category: 'LCD', condition: 'New', description: '', stock_quantity: 1 });
            fetchInventory();
            setActiveTab('inventory');
        } catch (err) {
            console.error(err);
            alert("Failed to add part.");
        }
    };

    // Delete Item
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this part?")) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchInventory();
            } catch (err) {
                console.error(err);
                alert("Failed to delete.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
            {/* Navigation */}
            <nav className="bg-black text-white p-4 shadow-md">
                <div className="max-w-6xl mx-auto flex gap-4 font-bold overflow-x-auto">
                    <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded-lg ${activeTab === 'inventory' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>📦 Inventory</button>
                    <button onClick={() => setActiveTab('add')} className={`px-4 py-2 rounded-lg ${activeTab === 'add' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>➕ Add Part</button>
                    <button onClick={() => setActiveTab('scanner')} className={`px-4 py-2 rounded-lg ${activeTab === 'scanner' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>📷 Scanner</button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto p-6">
                
                {/* --- TAB 1: INVENTORY & QR PRINTING --- */}
                {activeTab === 'inventory' && (
                    <div>
                        <h2 className="text-3xl font-black mb-6">Current Stock</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {inventory.map(item => (
                                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-xl">{item.brand} {item.model}</h3>
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold uppercase">{item.category}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">Condition: <span className="font-semibold text-black">{item.condition}</span></p>
                                        <p className="text-sm text-gray-500 mb-4">Stock: <span className="font-semibold text-black">{item.stock_quantity}</span></p>
                                    </div>
                                    
                                    <div className="border-t pt-4">
                                        <GenerateQR componentId={item.id} componentName={`${item.brand} ${item.model}`} category={item.category} />
                                        <button onClick={() => handleDelete(item.id)} className="w-full mt-3 text-red-500 text-sm font-bold hover:underline">
                                            Delete Item
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- TAB 2: ADD NEW PART --- */}
                {activeTab === 'add' && (
                    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-black mb-6">Add New Part</h2>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <input type="text" placeholder="Brand (e.g., Apple)" required className="w-full p-3 border rounded-xl" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                            <input type="text" placeholder="Model (e.g., iPhone 11)" required className="w-full p-3 border rounded-xl" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
                            
                            <select className="w-full p-3 border rounded-xl bg-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                <option>LCD</option>
                                <option>Battery</option>
                                <option>Motherboard</option>
                                <option>Small Parts</option>
                            </select>

                            <select className="w-full p-3 border rounded-xl bg-white" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                                <option>New</option>
                                <option>Used - Excellent</option>
                                <option>Stripped / Salvaged</option>
                                <option>Broken</option>
                            </select>

                            <input type="number" min="1" placeholder="Quantity" className="w-full p-3 border rounded-xl" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} />
                            <textarea placeholder="Notes / Description" className="w-full p-3 border rounded-xl" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>

                            <button type="submit" className="w-full bg-black text-white p-3 rounded-xl font-bold hover:bg-gray-800">Save Part to Database</button>
                        </form>
                    </div>
                )}

                {/* --- TAB 3: SCANNER --- */}
                {activeTab === 'scanner' && (
                    <Scanner />
                )}

            </main>
        </div>
    );
}

export default App;