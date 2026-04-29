import { useState } from "react";
import axios from "axios";

const mockProducts = [
  { name: "Rice Basmati", sku: "RB001", stock: 50, threshold: 20, status: "OK" },
  { name: "Wheat Flour", sku: "WF002", stock: 10, threshold: 25, status: "LOW" },
  { name: "Sunflower Oil", sku: "SO003", stock: 5, threshold: 15, status: "CRITICAL" },
];

const mockSuppliers = [
  { id: 1, name: "Raj Traders", category: "Grains & Oils", contact: "raj@traders.com", lead: "3 days", status: "Active" },
  { id: 2, name: "Fresh Farm Co", category: "Dairy & Vegetables", contact: "fresh@farm.com", lead: "1 day", status: "Active" },
  { id: 3, name: "Global Spices Ltd", category: "Spices", contact: "info@globalspices.com", lead: "5 days", status: "Pending" },
];

const mockPurchaseOrders = [
  { id: "PO001", supplier: "Raj Traders", item: "Rice Basmati x100", total: "₹12,000", date: "2024-01-10", status: "Received" },
  { id: "PO002", supplier: "Fresh Farm Co", item: "Milk x50", total: "₹2,500", date: "2024-01-12", status: "Sent" },
  { id: "PO003", supplier: "Global Spices Ltd", item: "Turmeric x30", total: "₹4,800", date: "2024-01-14", status: "Pending" },
];

// components
function Badge({ status }) {
  const colors = {
    OK: "bg-green-100 text-green-700",
    LOW: "bg-yellow-100 text-yellow-700",
    CRITICAL: "bg-red-100 text-red-700",
    Active: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Received: "bg-blue-100 text-blue-700",
    Sent: "bg-indigo-100 text-indigo-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function Dashboard({ setTab, messages, input, setInput, loading, sendMessage }) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">Total Products</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">3</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <p className="text-yellow-500 text-sm">Low Stock Alerts</p>
          <p className="text-3xl font-bold text-yellow-500 mt-1">1</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <p className="text-red-500 text-sm">Critical Items</p>
          <p className="text-3xl font-bold text-red-500 mt-1">1</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button onClick={() => setTab("suppliers")} className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl p-5 text-left transition">
          <div className="text-2xl mb-2">🏭</div>
          <p className="font-semibold text-indigo-700">Manage Suppliers</p>
        </button>
        <button onClick={() => setTab("orders")} className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-5 text-left transition">
          <div className="text-2xl mb-2">📋</div>
          <p className="font-semibold text-blue-700">Purchase Orders</p>
        </button>
        <button className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left opacity-60 cursor-not-allowed">
          <div className="text-2xl mb-2">📊</div>
          <p className="font-semibold text-slate-700">Reports (Soon)</p>
        </button>
      </div>

      {/* Inventory + Chat */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 w-full overflow-hidden">
          <h2 className="text-slate-700 font-semibold mb-3">📦 Inventory</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead className="bg-slate-50">
                <tr>
                  {["Product", "SKU", "Stock", "Threshold", "Status"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockProducts.map((p, i) => (
                  <tr key={i} className="border-t border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{p.sku}</td>
                    <td className="px-4 py-3 text-sm">{p.stock}</td>
                    <td className="px-4 py-3 text-sm">{p.threshold}</td>
                    <td className="px-4 py-3"><Badge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full lg:w-80">
          <h2 className="text-slate-700 font-semibold mb-3">🤖 AI Assistant</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-80">
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`px-3 py-2 rounded-2xl text-sm max-w-[85%] ${m.role === "user" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-800"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-xs text-slate-400 p-2">Thinking...</div>}
            </div>
            <div className="p-2 border-t flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} className="flex-1 text-sm px-3 py-2 border rounded-lg outline-none" placeholder="Ask AI..." />
              <button onClick={sendMessage} className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [messages, setMessages] = useState([{ role: "ai", text: "Hi! Ask me anything about inventory." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: input }]);
    const currentInput = input;
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/chat", { question: currentInput });
      setMessages(prev => [...prev, { role: "ai", text: res.data.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Error connecting to backend!" }]);
    }
    setLoading(false);
  };

  const tabs = [
    { id: "dashboard", label: "🏠 Dashboard" },
    { id: "suppliers", label: "🏭 Suppliers" },
    { id: "orders", label: "📋 Orders" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white px-4 md:px-8 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">SmartStore AI</h1>
        <span className="bg-green-500 text-[10px] px-2 py-1 rounded-full">● Live</span>
      </div>

      <div className="bg-white border-b px-4 md:px-8 flex overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === t.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        {activeTab === "dashboard" && <Dashboard setTab={setActiveTab} messages={messages} input={input} setInput={setInput} loading={loading} sendMessage={sendMessage} />}
        {activeTab === "suppliers" && (
          <div className="bg-white rounded-xl shadow-sm border p-4 overflow-x-auto">
             <table className="w-full min-w-[600px]">
               <thead className="bg-slate-50"><tr>{["Supplier", "Category", "Lead Time", "Status"].map(h => <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>)}</tr></thead>
               <tbody>{mockSuppliers.map(s => <tr className="border-t"> <td className="px-4 py-3 text-sm font-medium">{s.name}</td><td className="px-4 py-3 text-sm">{s.category}</td><td className="px-4 py-3 text-sm">{s.lead}</td><td className="px-4 py-3"><Badge status={s.status} /></td></tr>)}</tbody>
             </table>
          </div>
        )}
        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-sm border p-4 overflow-x-auto">
             <table className="w-full min-w-[600px]">
               <thead className="bg-slate-50"><tr>{["PO ID", "Supplier", "Total", "Status"].map(h => <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">{h}</th>)}</tr></thead>
               <tbody>{mockPurchaseOrders.map(o => <tr className="border-t"> <td className="px-4 py-3 text-sm font-mono text-indigo-600">{o.id}</td><td className="px-4 py-3 text-sm">{o.supplier}</td><td className="px-4 py-3 text-sm font-medium">{o.total}</td><td className="px-4 py-3"><Badge status={o.status} /></td></tr>)}</tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
}