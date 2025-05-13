import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useUserStore from "@/stores/useUserStore";
import { Loader2, Mail, User } from "lucide-react";
import ActionButton from "../../share-components/ActionButton";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import { useState } from "react";

const UsersTable = () => {
  const { user: users, isLoading, error, fetchUser } = useUserStore((state) => state);
  const [roles, setRoles] = useState<{ [key: string]: string }>({});
  const { showToast } = useToast();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load users. Please try again later.
      </div>
    );
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    setRoles((prev) => ({...prev, [userId]: newRole}))
  }


  const handleEdit = async(userId: string) => {
    const updatedRole = roles[userId];
    try {
      const response = await axiosInstance.patch(
        "/api/admin/update-user-role",
        {
          userId,
          newRole: updatedRole,
        },
      );
      showToast("success", response?.data?.message);
      fetchUser();
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.response?.data?.message;
    
      if (message.includes("Access denied")) {
        showToast("warn", message);
        return;
      }
    
      showToast("error", message);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full border rounded-lg overflow-hidden border-zinc-200 text-sm text-zinc-700">
        <TableHeader className="sticky top-0 z-10 bg-blue-100 text-xs tracking-wider text-zinc-700 uppercase">
          <TableRow>
            <TableHead>Index</TableHead>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead className="min-w-[160px]">Fullname</TableHead>
            <TableHead className="min-w-[160px]">Username</TableHead>
            <TableHead className="min-w-[160px] text-center">Email</TableHead>
            <TableHead className="min-w-[160px] text-center">Role</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user._id}
              className={`transition-colors duration-200 hover:bg-blue-50 ${
                index % 2 === 0 ? "bg-white" : "bg-blue-50/50"
              } border-b border-zinc-200`}
            >
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>
                <img
                  src={
                    user.imageUrl
                      ? user.imageUrl
                      : "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(user.name || "User")
                  }
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-300"
                />
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-700">
                  <User className="h-4 w-4 opacity-60" />
                  {user.name}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-700">
                  <User className="h-4 w-4 opacity-60" />
                  {user.username}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-zinc-700">
                  <Mail className="h-4 w-4 opacity-60" />
                  {user.email}
                </span>
              </TableCell>
              <TableCell>
                <Select
                  value={roles[user._id] || user.role}
                  onValueChange={(value) => handleRoleChange(user._id, value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user" className="capitalize">
                      <span className="capitalize text-gray-700">user</span>
                    </SelectItem>
                    <SelectItem value="admin" className="capitalize">
                      <span className="text-blue-600 capitalize">
                        admin
                      </span>
                    </SelectItem>
                    <SelectItem value="superAdmin" className="capitalize">
                      <span className="text-red-600 capitalize">
                        super admin
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right text-blue-500">
                {/* Future actions like edit/delete buttons can be placed here */}
                <ActionButton
                  onEdit={() => handleEdit(user._id)}
                  editLabel={
                    roles[user._id] && roles[user._id] !== user.role
                      ? "Save"
                      : "Edit"
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
