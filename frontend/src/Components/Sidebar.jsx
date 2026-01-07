import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  AlertTriangle,
  Utensils,
  Library,
  Search,
  LogOut,
  GraduationCap ,
  School ,
  FileText ,
  Users,
} from "lucide-react"; // Added Users icon
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  const menuItems = [
    { path: "/admin", icon: <LayoutDashboard />, label: "Office Overview" },
    { path: "/admin/students", icon: <Users />, label: "Student Records" }, // New Section
    { path: "/admin/issues", icon: <AlertTriangle />, label: "Campus Issues" },
    { path: "/admin/canteen", icon: <Utensils />, label: "Canteen Authority" },
    { path: "/admin/library", icon: <Library />, label: "Library Authority" },
    // { path: "/admin/lost-found", icon: <Search />, label: "Lost & Found" },
    { path: "/admin/college-info", icon: <School />, label: "College-info" },
    { path: "/admin/college-policy", icon: <FileText />, label: "College-Policy" },
    { path: "/admin/teacher", icon: <Users />, label: "Teacher Management" },
    { path: "/admin/department", icon: <GraduationCap  />, label: "Department" },
  ];

  // Filter menu items based on role
  let filteredMenuItems;

  if (user?.role === "admin") {
    filteredMenuItems = menuItems; // admin sees everything
  } else if (user?.role === "canteen") {
    filteredMenuItems = [];
  } else {
    filteredMenuItems = []; // students or others see nothing
  }

  return (
    <aside className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col shadow-sm">
      
      <nav className="flex-1 p-4 space-y-1">
        {filteredMenuItems.map((item) => (
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
            {item.icon}
            <span className="text-sm tracking-wide">{item.label}</span>
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
