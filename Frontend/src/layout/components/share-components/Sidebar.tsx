import {
  ChevronDown,
  ChevronsRight,
  House,
  LogOut,
  Bed,
  Bell,
  Calendar1,
  LayoutGrid,
  CalendarRange,
  MessageCircleMore,
  Settings2,
  Radar,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useHandleLogout from "@/hooks/useHandleLogout";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";
import useNotificationStore from "@/stores/useNotificationStore";
import RequireRole from "@/permission/RequireRole";
import { ROLE } from "@/constant/roleList";

const Sidebar = () => {
  const [open, setOpen] = useState<boolean>(() => {
    return localStorage.getItem("sidebar") === "false" ? false : true;
  });
  const [selected, setSelected] = useState<string>(() => {
    return localStorage.getItem("selectedSidebarOption") || "Dashboard";
  });
  const { handleLogout } = useHandleLogout();
  const navigate = useNavigate();
  const unreadNotification = useNotificationStore(state => state.unreadNotification);

  return (
    <motion.nav
      layout
      className="z-100 flex h-screen shrink-0 flex-col overflow-y-auto border-r border-slate-300 bg-white p-2"
      style={{
        width: open ? "225px" : "fit-content",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <TitleSection open={open} />
      <div className="space-y-1">
        <Option
          Icon={House}
          title="Dashboard"
          titleColor="text-blue-800"
          IconColor="text-blue-600"
          selected={selected}
          setSelected={setSelected}
          link={() => navigate("/admin-portal")}
          open={open}
        />
        <Option
          Icon={LayoutGrid}
          title="Facility"
          titleColor="text-indigo-500"
          IconColor="text-indigo-500"
          selected={selected}
          setSelected={setSelected}
          link={() => navigate("/admin-facility")}
          open={open}
        />
        <Option
          Icon={Bed}
          title="Room"
          titleColor="text-indigo-700"
          IconColor="text-indigo-500"
          selected={selected}
          setSelected={setSelected}
          link={() => navigate("/admin-room")}
          open={open}
        />
        <Option
          Icon={Calendar1}
          title="Event"
          titleColor="text-sky-500"
          IconColor="text-sky-500"
          selected={selected}
          setSelected={setSelected}
          link={() => navigate("/admin-event")}
          open={open}
        />
        {/* Calendar Dropdown */}
        <SidebarDropdown
          open={open}
          icon={CalendarRange}
          label="Calendar"
          labelColor="text-blue-700"
          selected={selected}
          setSelected={setSelected}
          items={[
            {
              label: "Booking Reservation",
              path: "/admin-booking-calendar",
            },
            {
              label: "Room Deactivation",
              path: "/admin-deactivation-room-calendar",
            },
            {
              label: "Event Booking",
              path: "/admin-event-request-calendar",
            },
            {
              label: "Restaurant Reservation",
              path: "/admin-reservation-calendar",
            },
          ]}
        />
        {/* Reward Program DropDown */}
        <SidebarDropdown
          open={open}
          icon={Calendar1}
          label="Reward Program"
          labelColor="text-purple-500"
          selected={selected}
          setSelected={setSelected}
          items={[
            {
              label: "Reward Settings",
              path: "/admin-reward-setting",
            },
            {
              label: "Reward Management",
              path: "/admin-reward-redemption",
            },
            {
              label: "Reward History",
              path: "/admin-reward-history",
            },
          ]}
        />

        <Option
          Icon={MessageCircleMore}
          title="Chat"
          selected={selected}
          titleColor="text-emerald-400"
          IconColor="text-emerald-400"
          setSelected={setSelected}
          link={() => navigate("/admin-chat")}
          open={open}
        />
        <Option
          Icon={Bell}
          title="Notification"
          selected={selected}
          titleColor="text-yellow-400"
          IconColor="text-yellow-400"
          setSelected={setSelected}
          link={() => navigate("/admin-notification")}
          open={open}
          notify={unreadNotification}
        />
        <RequireRole allowedRoles={[ROLE.SuperAdmin]}>
          <Option
            Icon={Radar}
            title="Monitoring"
            selected={selected}
            titleColor="text-stone-400"
            IconColor="text-stone-400"
            setSelected={setSelected}
            link={() => navigate("/admin-suspicious-event")}
            open={open}
            notify={unreadNotification}
          />
        </RequireRole>
        <Option
          Icon={Settings2}
          title="Setting"
          selected={selected}
          titleColor="text-stone-500"
          IconColor="text-stone-500"
          setSelected={setSelected}
          link={() => navigate("/admin-setting")}
          open={open}
        />
        <Option
          Icon={LogOut}
          title="Logout"
          selected={selected}
          setSelected={setSelected}
          titleColor="text-rose-700"
          IconColor="text-rose-700"
          link={handleLogout}
          open={open}
        />
      </div>
      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

export default Sidebar;

const TitleSection = ({ open }: { open: boolean }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  return (
    <div className="mb-3 border-b border-slate-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
              onClick={() => {
                navigate("/admin-profile"),
                  localStorage.removeItem("selectedSidebarOption");
              }}
            >
              {user ? (
                <>
                  <span className="block text-xs font-semibold">
                    {user.username}
                  </span>
                  <span className="block text-xs text-slate-500 capitalize">
                    {user.role === "superAdmin" ? "Super Admin" : user.role}
                  </span>
                </>
              ) : (
                <>
                  <span className="block w-[100px] animate-pulse bg-slate-500"></span>
                  <span className="block w-[100px] animate-pulse bg-slate-500"></span>
                </>
              )}
            </motion.div>
          )}
        </div>
        {open && <ChevronDown className="mr-2 size-5" />}
      </div>
    </div>
  );
};

const Logo = () => {
  const { user } = useAuthStore();
  return (
    <motion.div className="grid size-10 shrink-0 place-content-center rounded-md bg-blue-200">
      <Link
        to="/"
        onClick={() => localStorage.removeItem("selectedSidebarOption")}
      >
        <img
          src={user?.profilePic || "https://ui-avatars.com/api/?name=Admin"}
          alt={user?.username || "Admin"}
          className="h-10 w-10 rounded-md object-cover"
        />
      </Link>
    </motion.div>
  );
};

const Option = ({
  Icon,
  IconColor,
  titleColor,
  title,
  selected,
  setSelected,
  open,
  notify,
  link,
}: {
  Icon: React.ComponentType<any>;
  IconColor: string;
  titleColor: string;
  title: string;
  selected: string;
  open: boolean;
  notify?: number | null;
  setSelected: (title: string) => void;
  link?: () => void;
}) => {
  const isProfileSelected = localStorage.getItem("selectedSidebarOption");
  return (
    <motion.button
      layout
      className={`relative flex h-12 w-full cursor-pointer items-center rounded-md transition-colors ${selected === title && isProfileSelected ? "bg-indigo-100 text-indigo-800" : "text-slate-500 hover:bg-slate-100"}`}
      onClick={() => {
        setSelected(title);
        localStorage.setItem("selectedSidebarOption", title);
        if (link) link();
      }}
      aria-label={`Go to ${title}`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg"
      >
        <Icon className={IconColor ? `${IconColor}` : ""} />
      </motion.div>
      {open && (
        <motion.span
          layout
          className={`text-xs font-medium ${titleColor && titleColor}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
        >
          {title}
        </motion.span>
      )}

      <AnimatePresence>
        {open && (notify ?? 0) > 0 ? (
          <motion.span
            key="notify-badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ transform: "translateY(-50%)" }}
            className="absolute right-4 size-7 rounded bg-rose-400 pt-1 text-center text-sm text-white"
          >
            {notify}
          </motion.span>
        ) : (
          (notify ?? 0) > 0 && (
            <motion.span
              key="notify-badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ transform: "translateY(-50%)" }}
              className="absolute top-0 right-3 size-7 rounded-full bg-rose-400 p-1 text-center text-sm text-white"
            >
              {notify}
            </motion.span>
          )
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const SidebarDropdown = ({
  icon: Icon,
  label,
  labelColor,
  selected,
  setSelected,
  open,
  items,
}: {
  icon: React.ComponentType<any>;
  label: string;
  labelColor?: string;
  selected: string;
  setSelected: (title: string) => void;
  open: boolean;
  items: { label: string; path: string }[];
}) => {
  const localKey = `sidebarDropdown-${label}`; // unique key per dropdown
  const [expanded, setExpanded] = useState<boolean>(() => {
    return localStorage.getItem(localKey) === "true";
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(localKey, expanded.toString());
  }, [expanded]);
  
  const isParentActive =
    items.some((item) => item.label === selected) || selected === label;

  useEffect(() => {
    if (!open && expanded) {
      setExpanded(false);
    }
  }, [open]);

  return (
    <div>
      <motion.button
        layout
        onClick={() => setExpanded((prev) => !prev)}
        className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-slate-600 transition-colors hover:bg-slate-100 ${
          isParentActive ? "bg-indigo-100 text-indigo-800" : ""
        }`}
      >
        <Icon className={labelColor} />
        {open && (
          <motion.span
            layout
            className={`text-xs font-medium ${labelColor || "text-purple-500"}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
          >
            {label}
          </motion.span>
        )}
        <motion.span className="ml-auto">
          <ChevronDown
            className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {expanded && open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, scaleY: 0.9, transformOrigin: "top" }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.9 }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            className="ml-8 origin-top overflow-hidden"
          >
            <div className="space-y-1 py-1">
              {items.map((item) => (
                <motion.button
                  key={item.label}
                  onClick={() => {
                    setSelected(item.label);
                    localStorage.setItem("selectedSidebarOption", item.label);
                    navigate(item.path);
                  }}
                  className={`w-full cursor-pointer text-left text-xs text-slate-600 transition-colors hover:text-indigo-700 ${
                    selected === item.label
                      ? "font-semibold text-indigo-700"
                      : ""
                  }`}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.125 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const ToggleClose = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <motion.button
      layout
      onClick={() => {
        setOpen((prev) => {
          const next = !prev;
          localStorage.setItem("sidebar", JSON.stringify(next));
          return next;
        });
      }}
      className="mt-auto cursor-pointer border-t border-slate-300 transition-colors hover:bg-slate-100"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <ChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs font-medium"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};
