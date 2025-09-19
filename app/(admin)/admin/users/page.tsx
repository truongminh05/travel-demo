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

async function getUsers() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          A list of all registered users in your application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.UserID}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {user.FirstName[0]}
                        {user.LastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.FirstName} {user.LastName}
                      </p>
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
