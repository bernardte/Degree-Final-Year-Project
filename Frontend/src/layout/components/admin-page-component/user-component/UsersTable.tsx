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
import { ActionButton } from "../../share-components/ActionButton";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import { useState } from "react";
import RequireRole from "@/permission/RequireRole";
import { ROLE } from "@/constant/roleList";

const UsersTable = () => {
  const {
    user: users,
    isLoading,
    error,
    updateRole,
  } = useUserStore((state) => state);
  const [roles, setRoles] = useState<{ [key: string]: string }>({});
  const { showToast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

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
    setRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleEdit = async (userId: string) => {
    const updatedRole = roles[userId];
    setLoading(true);
    try {
      const response = await axiosInstance.patch(
        "/api/admin/update-user-role",
        {
          userId,
          newRole: updatedRole,
        },
      );
      showToast("success", response?.data?.message);
      updateRole(userId, updatedRole as "superAdmin" | "admin" | "user");
    } catch (error: any) {
      const message =
        error?.response?.data?.error || error?.response?.data?.message;

      if (message.includes("Access denied")) {
        showToast("warn", message);
        return;
      }

      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full overflow-hidden rounded-lg border border-zinc-200 text-sm text-zinc-700">
        <TableHeader className="sticky top-0 z-10 bg-blue-100 text-xs tracking-wider text-zinc-700 uppercase">
          <TableRow>
            <TableHead>Index</TableHead>
            <TableHead className="w-[100px]">Avatar</TableHead>
            <TableHead className="min-w-[10px]">Fullname</TableHead>
            <TableHead className="min-w-[10px]">Username</TableHead>
            <TableHead className="min-w-[100px] text-center">Email</TableHead>
            <TableHead className="min-w-[110px] text-center">Role</TableHead>
            <RequireRole allowedRoles={[ROLE.SuperAdmin]}>
              <TableHead className="text-center">Actions</TableHead>
            </RequireRole>
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
                    user.profilePic
                      ? user.profilePic
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
                  <Mail className="h-4 w-4 text-rose-500 opacity-60" />
                  {user.email}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Select
                    value={roles[user._id] || user.role}
                    onValueChange={(value) => handleRoleChange(user._id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user" className="capitalize">
                        <span className="text-gray-700 capitalize">user</span>
                      </SelectItem>
                      <SelectItem value="admin" className="capitalize">
                        <span className="text-blue-600 capitalize">admin</span>
                      </SelectItem>
                      <SelectItem value="superAdmin" className="capitalize">
                        <span className="text-red-600 capitalize">
                          super admin
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
              <TableCell className="flex items-center justify-center text-right text-blue-500">
                {/* Future actions like edit/delete buttons can be placed here */}
                <RequireRole allowedRoles={[ROLE.SuperAdmin]}>
                  <ActionButton
                    loading={loading}
                    onEdit={() => handleEdit(user._id)}
                    editLabel={
                      roles[user._id] && roles[user._id] !== user.role
                        ? "Save"
                        : "Edit"
                    }
                  />
                </RequireRole>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
