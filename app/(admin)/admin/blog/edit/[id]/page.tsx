// File: app/(admin)/admin/blog/edit/[id]/page.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AdminBlogForm } from "@/components/admin-blog-form";

// Lấy dữ liệu chi tiết của bài viết từ API
async function getPostDetails(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  try {
    const res = await fetch(`${apiUrl}/api/admin/blog/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const postData = await getPostDetails(params.id);

  if (!postData) {
    return <div>Bài viết không tồn tại hoặc có lỗi xảy ra.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chỉnh sửa bài viết</CardTitle>
        <CardDescription>
          Cập nhật thông tin chi tiết cho bài viết dưới đây.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdminBlogForm isEditing={true} postData={postData} />
      </CardContent>
    </Card>
  );
}
