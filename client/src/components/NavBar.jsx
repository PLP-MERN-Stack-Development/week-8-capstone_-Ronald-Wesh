
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent,
         DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  
  return (
    <nav className="glass sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-700 px-4 py-2 flex items-center justify-between">
      <Link to="/dashboard" className="font-bold text-lg">Boma Web App </Link>

      <div className="flex items-center gap-2 cursor-pointer">
        {user?.role && (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            user.role === 'admin' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          }`}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        )}
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="cursor-pointer" variant="ghost" size="icon">
              <UserCircleIcon className="h-6 w-6 cursor-pointer" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {user && (
              <>
                <div className="px-2 py-1.5 text-sm text-gray-600 dark:text-gray-300 border-b">
                  @{user.username}
                </div>
              </>
            )}
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}




// import { Link } from "react-router-dom";
// import ThemeToggle from "./ThemeToggle";
// import { Button } from "@/components/ui/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { UserCircle } from "lucide-react";
// import { useAuth } from '../context/AuthContext';

// export default function Navbar() {
//     const { user, logout } = useAuth();

//     return (
//         <nav className="glass sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-700 px-4 py-2 flex items-center justify-between">
//             <Link to="/dashboard" className="font-bold text-lg">Boma</Link>
            
//             <div className="flex items-center gap-2">
//                 {user?.role && (
//                     <span className={`px-2 py-1 rounded text-xs font-medium ${
//                         user.role === 'admin'
//                             ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
//                             : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
//                     }`}>
//                         {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                     </span>
//                 )}
//                 <ThemeToggle />
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon">
//                             <UserCircle className="h-6 w-6" />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="w-44">
//                         {user && (
//                             <div className="px-2 py-1.5 text-sm text-gray-600 dark:text-gray-300 border-b">
//                                 @{user.username}
//                             </div>
//                         )}
//                         <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             </div>
//         </nav>
//     );
// }

