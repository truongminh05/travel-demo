// File: app/(admin)/admin/blog/page.tsx

import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { PlusCircleIcon } from "lucide-react";
import { AdminBlogActions } from "@/components/admin-blog-actions";

async function getBlogPosts() {
  const { data, error } = await supabase
    .from("BlogPosts")
    .select("PostID, Title, Status, CreatedAt, Image")
    .order("CreatedAt", { ascending: false });
  if (error) {
    console.error("Lỗi lấy bài viết blog:", error);
    return [];
  }
  return data;
}

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Quản lý Blog</CardTitle>
            <CardDescription>
              Thêm, sửa và xóa các bài viết trên trang blog của bạn.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1" asChild>
            <Link href="/admin/blog/new">
              <PlusCircleIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Thêm Bài viết
              </span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                Ảnh
              </TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>
                <span className="sr-only">Hành động</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.PostID}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={post.Title}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={post.Image || "/placeholder.svg"}
                    width="64"
                    unoptimized
                  />
                </TableCell>
                <TableCell className="font-medium">{post.Title}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      post.Status === "Published" ? "default" : "outline"
                    }
                  >
                    {post.Status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(post.CreatedAt).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  <AdminBlogActions postId={post.PostID} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
