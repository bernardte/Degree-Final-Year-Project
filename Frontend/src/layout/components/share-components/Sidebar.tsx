import {
  ChevronDown,
  ChevronsRight,
  House,
  LogOut,
  Bed,
  Bell,
  Calendar1,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import useHandleLogout from "@/hooks/useHandleLogout";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [selected, setSelected] = useState<string>("Dashboard");
  const { handleLogout } = useHandleLogout();
  const navigate = useNavigate();

  return (
    <motion.nav
      layout
      className="boder-slate-300 sticky top-0 h-screen shrink-0 border-r bg-white p-2"
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
          Icon={Bed}
          title="Room"
          titleColor="text-indigo-700"
          IconColor="text-indigo-500"
          selected={selected}
          setSelected={setSelected}
          link={() => navigate("/room")}
          open={open}
        />
        <Option
          Icon={Calendar1}
          title="Event"
          titleColor="text-amber-700"
          IconColor="text-amber-600"
          selected={selected}
          setSelected={setSelected}
          link={() => navigate("/event")}
          open={open}
        />
        <Option
          Icon={Bell}
          title="Notification"
          selected={selected}
          titleColor="text-rose-700"
          IconColor="text-rose-600"
          setSelected={setSelected}
          link={() => navigate("/notification")}
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
            >
              <span className="block text-xs font-semibold">
                Tom Is Loading
              </span>
              <span className="block text-xs text-slate-500">Pro Plan</span>
            </motion.div>
          )}
        </div>
        {open && <ChevronDown className="mr-2 size-5" />}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div className="grid size-10 shrink-0 place-content-center rounded-md bg-blue-200">
      <Link to="/">
        <svg
          width="50"
          height="20"
          viewBox="0 3 67 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M45.0353 4.66312C45.8331 3.77669 46.7195 3.04539 47.6281 2.46921C49.2236 1.47198 50.9079 0.940125 52.6364 0.940125V15.411C51.3732 11.0232 48.6475 7.25591 45.0353 4.66312ZM66.5533 40.9401H15.2957C6.87461 40.9401 0.0712891 34.1146 0.0712891 25.7157C0.0712891 17.6714 6.3206 11.0675 14.232 10.5135V0.940125C16.0048 0.940125 17.7555 1.44982 19.3954 2.46921C20.304 3.02323 21.1904 3.75453 21.9882 4.59663C25.2458 2.31409 29.1904 0.984446 33.4674 0.984446C33.4674 10.2254 30.1433 20.9734 19.3289 20.9955H33.3566C32.9577 19.2005 31.3178 17.8709 29.3677 17.8487H37.5228C35.5727 17.8487 33.9328 19.2005 33.5339 21.0177H46.6087C49.2236 21.0177 51.8164 21.5274 54.2541 22.5468C56.6696 23.544 58.8857 25.0288 60.725 26.8681C62.5865 28.7296 64.0491 30.9235 65.0464 33.339C66.0436 35.7324 66.5533 38.3252 66.5533 40.9401ZM22.8525 10.7795C23.1849 11.6437 24.0713 12.6188 25.3123 13.3279C26.5533 14.0371 27.8386 14.3252 28.7472 14.1922C28.4148 13.3279 27.5284 12.3529 26.2874 11.6437C25.0464 10.9346 23.761 10.6465 22.8525 10.7795ZM41.5117 13.3279C40.2707 14.0371 38.9854 14.3252 38.0768 14.1922C38.4092 13.3279 39.2957 12.3529 40.5367 11.6437C41.7777 10.9346 43.063 10.6465 43.9716 10.7795C43.6613 11.6437 42.7527 12.6188 41.5117 13.3279Z"
            fill="#283841"
          ></path>
        </svg>
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
  setSelected: (title: string) => void;
  open: boolean;
  notify?: number;
  link?: () => void;
}) => {
  return (
    <motion.button
      layout
      className={`relative flex h-12 w-full cursor-pointer items-center rounded-md transition-colors ${selected === title ? "bg-indigo-100 text-indigo-800" : "text-slate-500 hover:bg-slate-100"}`}
      onClick={() => {
        setSelected(title);
        if (link) link();
      }}
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
      onClick={() => setOpen((prev) => !prev)}
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
