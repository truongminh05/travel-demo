// File: app/(admin)/admin/users/page.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Hàm lấy dữ liệu không đổi
async function getUsers() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    // Ném lỗi với thông tin chi tiết hơn để dễ debug
    const errorBody = await res.text();
    throw new Error(
      `Failed to fetch users. Status: ${res.status}. Body: ${errorBody}`
    );
  }
  return res.json();
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Người dùng</CardTitle>
        <CardDescription>
          Danh sách tất cả người dùng đã đăng ký trong ứng dụng của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Ngày tham gia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => {
              // THAY ĐỔI: Xử lý FullName để lấy chữ cái đầu
              const nameParts = user.FullName?.split(" ") || ["", ""];
              const firstNameInitial = nameParts[0]?.[0] || "";
              const lastNameInitial =
                nameParts.length > 1
                  ? nameParts[nameParts.length - 1]?.[0] || ""
                  : "";

              return (
                <TableRow key={user.UserID}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {firstNameInitial}
                          {lastNameInitial}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.FullName}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.Email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.Role === "Admin" ? "default" : "outline"}
                    >
                      {user.Role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.CreatedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
