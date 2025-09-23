// File: app/(admin)/admin/blog/new/page.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AdminBlogForm } from "@/components/admin-blog-form";

export default function NewBlogPostPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thêm bài viết mới</CardTitle>
        <CardDescription>
          Điền vào biểu mẫu dưới đây để thêm một bài viết mới vào blog của bạn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminBlogForm />
      </CardContent>
    </Card>
  );
}
