
// main.jsx → Wraps app with <AuthProvider>
// AuthContext.jsx → Manages global auth state (user, login, logout)
// useAuth.js → Simple hook to access AuthContext from any component
// api.js → Handles ALL backend communication + auto-adds auth headers
// auth.js → Utility functions for token/role checking
// ProtectedRoute.jsx → Guards routes that need authentication
// App.jsx → Route definitions + conditional navigation


import { Link ,NavLink} from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent,
         DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
//import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useAuth } from '../context/AuthContext';
import { UserCircle } from "lucide-react";
export default function Navbar() {
  const { user, logout } = useAuth();
  const navLinks = [
   { to: "/listings", label: "Listings" },
    { to: "/reviews", label: "Reviews" },
    { to: "/forum", label: "Forums" },
    { to: "/dashboard", label: "Role-Dashboard", roles: ["tenant", "landlord", "admin"] },
    { to: "/admin", label: "Admin Panel", roles: ["admin"] },
  ];
  
return (
  <nav className="glass sticky top-0 z-50 h-16 border-b border-zinc-200 dark:border-zinc-700 px-4 py-2 flex items-center justify-between bg-white/70 dark:bg-black/50 backdrop-blur-sm">
    <Link to="/" className="font-bold text-3xl text-primary">
      Boma
    </Link>

    <div className="flex items-center gap-4">
      {navLinks.map(
        ({ to, label, roles }) =>
          (!roles || roles.includes(user?.role)) && (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-primary" : "text-gray-600 dark:text-gray-300"}`
              }
            >
              {label}
            </NavLink>
          )
      )}

      {user?.role && (
        <span
          className={`px-2 py-1 rounded text-xs font-medium hidden sm:inline ${
            user.role === "admin"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          }`}
        >
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      )}

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <UserCircle className="h-6 w-6 cursor-pointer" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {user && (
            <div className="cursor-pointer px-2 py-1.5 text-sm text-gray-600 dark:text-gray-300 border-b">
              @{user.username}
            </div>
          )}
          <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </nav>
);
}