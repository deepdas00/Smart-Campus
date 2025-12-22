import React, { useState } from 'react';
import { 
  Search, Bell, User, BookOpen, Clock, 
  AlertCircle, ShoppingBag, ArrowRight, 
  LayoutGrid, Zap, ChevronRight, Plus, Coffee, Utensils
} from 'lucide-react';
import ProfileSidebar from '../Components/ProfileSidebar';
import CollegeInfo from '../Components/CollegeInfo';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png";
import profile from "../assets/profile.png";


export default function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  
  const [userData] = useState({
    name: "John Doe",
    activeIssue: { 
        id: "BK-99", 
        title: "QUANTUM FRONTIERS", 
        due: "30 Dec", 
        progress: 68, 
        color: "from-blue-600 to-indigo-700", 
        author: "Dr. A. Thorne" 
    },
    libraryHistory: [
      { id: "H1", title: "Machine Learning Basics", returned: "Oct 12, 2024", author: "Andrew Ng" },
      { id: "H2", title: "Organic Chemistry", returned: "Sept 05, 2024", author: "J. Smith" },
    ],
    campusComplaints: [
      { id: "C-1", subject: "WiFi Deadzone - Library Floor 2", status: "Under Review", date: "21 Dec" },
      { id: "C-2", subject: "Broken Fan - Room 402", status: "Resolved", date: "18 Dec" }
    ],
    canteenOrders: [
      { id: "FD-55", item: "Double Patty Burger", time: "12:40 PM", price: "$5.50", status: "Ready" },
      { id: "FD-59", item: "Iced Caramel Latte", time: "10:15 AM", price: "$3.00", status: "Collected" }
    ]
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  

  

  // --- SUB-PAGE: LIBRARY (Current + History) ---
  const LibraryPage = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500 mt-[-35px]">
      <div>
        <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Currently Issued</h3>
        <div className={`p-8 rounded-[2.5rem] bg-gradient-to-br ${userData.activeIssue.color} text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6`}>
           <div className="flex items-center gap-6">
              <div className="w-20 h-28 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl flex items-center justify-center"><BookOpen size={40}/></div>
              <div>
                <h2 className="text-3xl font-black tracking-tighter italic">{userData.activeIssue.title}</h2>
                <p className="opacity-80 font-bold uppercase text-[10px] tracking-widest mt-1">Return by {userData.activeIssue.due}</p>
              </div>
           </div>
           <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">Read Now</button>
        </div>
      </div>

      <div>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Past Transactions</h3>
        <div className="grid gap-3">
            {userData.libraryHistory.map(item => (
                <div key={item.id} className="p-5 bg-white border border-slate-100 rounded-3xl flex justify-between items-center group hover:border-slate-300 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-slate-900 transition-colors"><Clock size={18}/></div>
                        <div>
                            <p className="text-sm font-black text-slate-800">{item.title}</p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase">Returned on {item.returned}</p>
                        </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-200" />
                </div>
            ))}
        </div>
      </div>
    </div>
  );

  // --- SUB-PAGE: CANTEEN ORDERS ---
  const OrdersPage = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black tracking-tighter uppercase">Canteen Orders</h2>
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Utensils size={20}/></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userData.canteenOrders.map(order => (
          <div key={order.id} className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white"><Coffee size={20}/></div>
                <div>
                    <h4 className="font-black text-sm">{order.item}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{order.time} • {order.id}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-black text-slate-900">{order.price}</p>
                <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase ${order.status === 'Ready' ? 'bg-orange-100 text-orange-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                    {order.status}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- SUB-PAGE: CAMPUS COMPLAINTS ---
  const ComplaintsPage = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-4">
        <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Campus Issues</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Report infrastructure concerns</p>
        </div>
        <button className="bg-orange-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-orange-600 transition-colors">
          <Plus size={14}/> New Report
        </button>
      </div>
      <div className="space-y-3">
        {userData.campusComplaints.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center"><AlertCircle size={22}/></div>
              <div>
                <h4 className="font-black text-sm text-slate-800">{item.subject}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Logged: {item.date}</p>
              </div>
            </div>
            <div className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg ${item.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                {item.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (

    <div>

    <div>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to={"/"} className="flex items-center space-x-2">
                <img
                  src={logo}
                  alt="Smart Campus Logo"
                  className="w-13.5 h-13.5 rounded-full object-cover bg-white/60 backdrop-blur border border-white/40 shadow"
                />
                <span className="text-xl font-bold bg-blue-700  bg-clip-text text-transparent">
                  Smart Campus
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              
              <span className="text-gray-600 hidden sm:inline cursor-pointer hover:text-blue-500">
                Logout
              </span>
              <Link className="flex items-center space-x-2">
                <img
                  src={profile}
                  alt="Profile"
                  onClick={() => setShowProfileMenu(true)}
                  className="w-13.5 h-13.5 rounded-full object-cover bg-white/60 backdrop-blur border border-white/40 shadow"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Profile menu side bar */}
      <ProfileSidebar
        isOpen={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
      />

      {/*Banner*/}
      <CollegeInfo />
    </div>

    <div className="h-screen w-screen bg-[#fcfcfd] flex overflow-hidden font-sans text-slate-900">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-20 lg:w-64 flex flex-col border-r border-slate-100 bg-white">
        <div className="p-8 flex items-center justify-center lg:justify-start gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Zap size={20} fill="currentColor" />
          </div>
          <span className="hidden lg:block font-black text-xl tracking-tighter italic">HUB.</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <NavItem icon={<LayoutGrid size={20}/>} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
          <NavItem icon={<BookOpen size={20}/>} label="Library" active={activeTab === 'Library'} onClick={() => setActiveTab('Library')} />
          <NavItem icon={<ShoppingBag size={20}/>} label="Canteen" active={activeTab === 'Orders'} onClick={() => setActiveTab('Orders')} />
          <NavItem icon={<AlertCircle size={20}/>} label="Issues" active={activeTab === 'Complaints'} onClick={() => setActiveTab('Complaints')} />
        </nav>
      </aside>


      

      

      <div className="flex-1 flex flex-col min-w-0">
        <div className='mt-15'></div>

        <main className="flex-1 overflow-y-auto p-10 no-scrollbar">
          {activeTab === 'Overview' ? (
            <div className="space-y-10">
                <section>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Active Loan</h3>
                    <div className={`p-6 rounded-[2rem] bg-gradient-to-r ${userData.activeIssue.color} text-white flex justify-between items-center`}>
                        <div className="flex items-center gap-4">
                            <BookOpen size={24}/>
                            <p className="font-black tracking-tight">{userData.activeIssue.title}</p>
                        </div>
                        <button onClick={() => setActiveTab('Library')} className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase">View History</button>
                    </div>
                </section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4">Latest Meal</h4>
                        <div className="flex justify-between items-center font-bold text-sm">
                            <span>{userData.canteenOrders[0].item}</span>
                            <span className="text-orange-500 tracking-tighter italic">{userData.canteenOrders[0].status}</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4">Campus Health</h4>
                        <div className="flex justify-between items-center font-bold text-sm">
                            <span className="truncate max-w-[150px]">{userData.campusComplaints[0].subject}</span>
                            <ChevronRight size={16} />
                        </div>
                    </div>
                </div>
            </div>
          ) : activeTab === 'Library' ? <LibraryPage /> : activeTab === 'Orders' ? <OrdersPage /> : <ComplaintsPage />}
        </main>
      </div>
    </div>

    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer group ${active ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
    >
      {icon}
      <span className="hidden lg:block font-bold text-sm tracking-tight">{label}</span>
    </div>
  );
}