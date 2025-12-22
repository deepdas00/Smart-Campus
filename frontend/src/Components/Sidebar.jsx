import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, AlertTriangle, Utensils, 
  Library, Search, LogOut, Users 
} from "lucide-react"; // Added Users icon

export default function Sidebar() {
  const menuItems = [
    { path: "/admin", icon: <LayoutDashboard />, label: "Office Overview" },
    { path: "/admin/students", icon: <Users />, label: "Student Records" }, // New Section
    { path: "/admin/issues", icon: <AlertTriangle />, label: "Campus Issues" },
    { path: "/admin/canteen", icon: <Utensils />, label: "Canteen Authority" },
    { path: "/admin/library", icon: <Library />, label: "Library Authority" },
    { path: "/admin/lost-found", icon: <Search />, label: "Lost & Found" },
  ];

  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col shadow-sm">
      <div className="p-6 border-b">
        <div className="font-black text-2xl tracking-tighter text-blue-700">SMART<span className="text-gray-900">CAMPUS</span></div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-100 font-bold" 
                : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
              }`
            }
          >
            {/* Cloned icon to adjust size if needed */}
            {item.icon} <span className="text-sm tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t">
        <button className="w-full p-3 flex items-center gap-2 text-red-600 hover:bg-red-50 rounded-xl transition font-bold text-sm">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}