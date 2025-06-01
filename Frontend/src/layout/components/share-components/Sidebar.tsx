import {
  ChevronDown,
  ChevronsRight,
  House,
  LogOut,
  Bed,
  Bell,
  Calendar1,
  LayoutGrid,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import useHandleLogout from "@/hooks/useHandleLogout";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";

const Sidebar = () => {
  const [open, setOpen] = useState<boolean>(() => {
    return localStorage.getItem("sidebar") === "false" ? false : true;
  });
  const [selected, setSelected] = useState<string>(() => {
    return localStorage.getItem("selectedSidebarOption") || "Dashboard";
  });
  const { handleLogout } = useHandleLogout();
  const navigate = useNavigate();

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2"
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
        <Option
          Icon={Bell}
          title="Notification"
          selected={selected}
          titleColor="text-yellow-400"
          IconColor="text-yellow-400"
          setSelected={setSelected}
          link={() => navigate("/admin-notification")}
          open={open}
          notify={3}
        />
        <Option
          Icon={LogOut}
          title="Logout"
          selected={selected}
          setSelected={setSelected}
          titleColor="text-rose-500"
          IconColor="text-rose-500"
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
  notify?: number;
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
      {open && notify && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ transform: "translateY(-50%)" }}
          className="absolute right-4 size-5 rounded bg-rose-400 text-center text-sm text-white"
        >
          {notify}
        </motion.span>
      )}
    </motion.button>
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
      className="absolute right-0 bottom-0 left-0 cursor-pointer border-t border-slate-300 transition-colors hover:bg-slate-100"
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
