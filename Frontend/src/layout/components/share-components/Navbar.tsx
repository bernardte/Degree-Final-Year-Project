import { Link, NavLink } from "react-router-dom";
import list from "@/constant/navBarList";
import { Loader, ShieldUser } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useHandleLogout from "@/hooks/useHandleLogout";

const Navbar = () => {
  const { setOpenLoginPopup } = useAuthStore();
  const isAdminVerified = localStorage.getItem("admin-verified");
  console.log(isAdminVerified);
  const { user } = useAuthStore();
  const userData = localStorage.getItem("user");
  const userDetails = userData ? JSON.parse(userData) : {};
  const [navbar, setNavbar] = useState(false);
  const { handleLogout, isLoading } = useHandleLogout();
  const scrollHeader = () => {
    if (window.scrollY > 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  console.log(user?.role);
  useEffect(() => {
    window.addEventListener("scroll", scrollHeader);

    return () => {
      window.removeEventListener("scroll", scrollHeader);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size={24} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <nav
      className={`fixed top-0 z-50 m-0 h-[60px] w-full overflow-hidden p-4 transition-all duration-600 ${navbar ? "animate-fadeInDown overflow-hidden bg-[#3d60ca] shadow-md" : "animate-fadeInUp overflow-hidden bg-transparent"}`}
    >
      <Link to={"/"}>
        <img src="/Logo 2.png" alt="Logo" className="absolute left-0 top-0 h-[60px] w-[100px] rounded-full object-cover transition-all duration-500 ease-in-out hover:scale-110" />
      </Link>
      <ul className="flex items-center justify-center gap-[3rem] p-1">
        {list.map((link) => (
          <li key={link.to} className="group relative cursor-pointer">
            <NavLink
              to={link.to}
              // note:
              //after:w-0 is the initial value of the underline position
              //group-hover:after:left-0 start from left to full
              //grou-hover:after-w-full start from 0 to full
              //after:origin-center start from the middle to the both side
              className={({ isActive }) => {
                return `relative text-[1rem] font-medium ${navbar ? "text-white" : "text-gray-900"} font-extrabold after:absolute after:-bottom-1 after:left-0 after:h-[3px] after:w-0 after:bg-blue-400 after:transition-all after:duration-500 after:content-[''] ${isActive ? "after:w-full" : "after:left-1/2"} group:hover:transition-all group-hover:text-blue-400 group-hover:duration-400 group-hover:after:left-0 group-hover:after:w-full group-hover:after:origin-center group-hover:after:scale-x-100`;
              }}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {!user ? (
        <div className="group absolute top-3 right-0 mr-[50px] mt-1 flex items-center justify-center rounded-xl border-3 border-white transition-all duration-300 hover:border-blue-500 focus:ring-0 focus:outline-none">
          
          <button
            className={`group:hover:transition-colors group:hover:duration:500 group:hover:ease-in-out flex cursor-pointer items-center justify-center gap-2 px-3 py-1 font-bold text-white group-hover:rounded-xl ${navbar && "bg-transparent"} duration-300 group-hover:text-blue-500`}
            onClick={() => setOpenLoginPopup(true)}
          >
            <ShieldUser />
            <span>Login</span>
          </button>
        </div>
      ) : (
        <div className="absolute top-4 right-0 mr-[50px] flex items-center justify-center focus:ring-0 focus:outline-none">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex cursor-pointer outline-none focus-visible:ring-0">
                {userDetails?.state?.user && (
                  <Avatar>
                    <AvatarImage src={userDetails?.state?.user?.profilePic} />
                    <AvatarFallback>
                      {userDetails?.state?.user?.username
                        ?.charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span className="mr-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text pl-2 text-2xl font-semibold text-transparent">
                  {userDetails?.state?.user?.username}
                </span>
              </button>
            </DropdownMenuTrigger>
            {/* Dropdown menu content */}
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="z-[100] max-h-[300px] w-[160px] overflow-auto rounded-md border bg-white shadow-lg"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Link to={"/display-booking"}>
                  <span>View Booking</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link to={"/pending-booking"}>
                  <span>Pending Booking</span>
                </Link>
              </DropdownMenuItem>
              {(user.role === "admin" || user.role === "superAdmin") &&
                (!!isAdminVerified) && (
                  <DropdownMenuItem>
                    <Link to={"/admin-portal"}>Admin Portal</Link>
                  </DropdownMenuItem>
                )}
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
