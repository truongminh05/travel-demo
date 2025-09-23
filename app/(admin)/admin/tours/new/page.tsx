import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AdminTourForm } from "@/components/admin-tour-form";

export default function NewTourPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thêm tour mới</CardTitle>
        <CardDescription>
          Vui lòng điền vào biểu mẫu bên dưới để thêm một gói tour mới vào trang
          web của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Component form này đã được tạo ở các bước trước */}
        <AdminTourForm />
      </CardContent>
    </Card>
  );
}
