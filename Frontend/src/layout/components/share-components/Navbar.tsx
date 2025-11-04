import { Link, NavLink } from "react-router-dom";
import list from "@/constant/navBarList";
import {
  Loader,
  ShieldUser,
  User,
  Settings,
  BookOpen,
  LogOut,
  Gift,
  CreditCard,
} from "lucide-react";
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
import useSystemSettingStore from "@/stores/useSystemSettingStore";
import { useSocket } from "@/context/SocketContext";

const Navbar = () => {
  const { setOpenLoginPopup } = useAuthStore();
  const isAdminVerified = localStorage.getItem("admin-verified");
  const { user } = useAuthStore();
  const userData = localStorage.getItem("user");
  const userDetails = userData ? JSON.parse(userData) : {};
  const [navbar, setNavbar] = useState(false);
  const { handleLogout, isLoading } = useHandleLogout();
  const { logo, fetchAllHotelInformationInCustomerSide } =
    useSystemSettingStore((state) => state);
  const { activeUsers } = useSocket();
  const scrollHeader = () => {
    setNavbar(window.scrollY > 10);
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHeader);
    return () => window.removeEventListener("scroll", scrollHeader);
  }, []);

  useEffect(() => {
    fetchAllHotelInformationInCustomerSide();
  }, [fetchAllHotelInformationInCustomerSide]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size={24} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <nav
      className={`fixed top-0 z-50 w-full p-4 transition-all duration-600 ${navbar ? "animate-fadeInDown bg-[#3d60ca] shadow-md" : "bg-transparent"}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to={"/"}>
          <img
            src={logo}
            alt="Logo"
            className="fixed top-0 left-0 h-[60px] w-[100px] object-contain transition-all duration-500 ease-in-out hover:scale-110"
          />
        </Link>

        <ul className="flex items-center gap-[3rem]">
          {list.map((link) => (
            <li key={link.to} className="group relative cursor-pointer">
              <NavLink
                to={link.to}
                className={({ isActive }) => {
                  return `relative text-[1rem] font-semibold after:absolute after:-bottom-1 after:left-0 after:h-[3px] after:w-0 after:bg-blue-400 after:transition-all after:duration-500 after:content-[''] ${navbar ? "text-white" : "text-gray-900"} ${isActive ? "after:w-full" : "after:left-1/2"} group:hover:transition-all group-hover:text-blue-400 group-hover:duration-400 group-hover:after:left-0 group-hover:after:w-full group-hover:after:origin-center group-hover:after:scale-x-100`;
                }}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {!user ? (
          <div className="group flex items-center">
            <button
              className={`fixed flex cursor-pointer items-center gap-2 rounded-xl border-3 border-white px-3 py-1 font-bold text-white transition-colors duration-300 group-hover:text-blue-500 hover:border-blue-500 ${navbar ? "bg-transparent" : ""}`}
              onClick={() => setOpenLoginPopup(true)}
            >
              <ShieldUser />
              <span>Login</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="absolute right-10 flex cursor-pointer items-center gap-3 outline-none focus-visible:ring-0">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-white">
                      <AvatarImage src={user.profilePic} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                        {userDetails?.state?.user?.username
                          ?.charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Indicator */}
                    {activeUsers.includes(user._id) ? (
                      <div className="absolute -right-1 -bottom-1 rounded-full bg-green-400 p-1.5">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-green-200"></div>
                      </div>
                    ) : (
                      <div className="absolute -right-1 -bottom-1 rounded-full bg-gray-400 p-1.5">
                        <div className="h-2 w-2 rounded-full bg-gray-200" />
                      </div>
                    )}
                  </div>
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-lg font-semibold text-transparent">
                    {userDetails?.state?.user?.username}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <div className="bottom-0 bg-gray-400 before:absolute before:content-none"></div>

              {/* Foam-inspired dropdown menu */}
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="z-[100] min-w-[240px] overflow-hidden border-0 bg-transparent p-0 shadow-none"
              >
                {/* Chat bubble tail */}
                <div className="absolute -top-1 right-10 h-3 w-3 rotate-45 bg-white/90 shadow-md backdrop-blur-lg" />

                {/*drop down menu main content*/}
                <div
                  className="rounded-2xl bg-white/90 p-2 backdrop-blur-lg"
                  style={{
                    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 247, 255, 0.9) 100%)",
                  }}
                >
                  {/* User info section */}
                  <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profilePic} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                        {userDetails?.state?.user?.username
                          ?.charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {userDetails?.state?.user?.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.role === "admin" || user.role === "superAdmin"
                          ? "Admin Account"
                          : "Member Account"}
                      </p>
                    </div>
                  </div>

                  <DropdownMenuLabel className="px-3 pt-4 pb-2 text-xs font-medium tracking-wider text-gray-500 uppercase">
                    My Account
                  </DropdownMenuLabel>

                  <div className="space-y-1">
                    <DropdownMenuItem className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-blue-50 focus:bg-blue-50">
                      <Link to={"/profile"} className="flex items-center gap-3">
                        <User className="h-5 w-5 text-blue-500" />
                        <span>Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-blue-50 focus:bg-blue-50">
                      <Link
                        to={"/display-booking"}
                        className="flex items-center gap-3"
                      >
                        <BookOpen className="h-5 w-5 text-indigo-500" />
                        <span>Bookings History</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-blue-50 focus:bg-blue-50">
                      <Link
                        to={"/pending-booking"}
                        className="flex items-center gap-3"
                      >
                        <CreditCard className="h-5 w-5 text-purple-500" />
                        <span>Pending Bookings</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-blue-50 focus:bg-blue-50">
                      <Link
                        to={"/reward-redemption"}
                        className="flex items-center gap-3"
                      >
                        <Gift className="h-5 w-5 text-amber-500" />
                        <span>Rewards & Benefits</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>

                  {(user.role === "admin" || user.role === "superAdmin") &&
                    !!isAdminVerified && (
                      <>
                        <DropdownMenuSeparator className="my-1 bg-gray-200" />
                        <DropdownMenuLabel className="px-3 pt-2 pb-1 text-xs font-medium tracking-wider text-gray-500 uppercase">
                          Administration
                        </DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer rounded-lg p-3 transition-colors hover:bg-blue-50 focus:bg-blue-50">
                          <Link
                            to={"/admin-portal"}
                            onClick={() =>
                              localStorage.setItem(
                                "selectedSidebarOption",
                                "Dashboard",
                              )
                            }
                            className="flex items-center gap-3"
                          >
                            <Settings className="h-5 w-5 text-blue-600" />
                            <span>Admin Portal</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                  <DropdownMenuSeparator className="my-1 bg-gray-200" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer rounded-lg p-3 text-red-500 transition-colors hover:bg-red-50 focus:bg-red-50"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="h-5 w-5 text-rose-500" />
                      <span>Logout</span>
                    </div>
                  </DropdownMenuItem>
                </div>

                {/* Bubble effect at the bottom */}
                {/* <div className="relative -top-3 left-1/2 -translate-x-1/2">
                  <div className="h-6 w-6 rounded-full bg-white/70 backdrop-blur-sm"></div>
                  <div className="absolute top-1 left-1 h-4 w-4 rounded-full bg-white/50 backdrop-blur-sm"></div>
                </div> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
