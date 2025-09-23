"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2 } from "lucide-react";

export type GalleryItem = {
  ImageID: number;
  ImageURL: string | null;
  Caption: string | null;
  Content: string | null;
};

export default function AdminTourGalleryManager({
  tourId,
  initial,
}: {
  tourId: number;
  initial: GalleryItem[];
}) {
  const { toast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const openEdit = (it: GalleryItem) => {
    setEditing({ ...it });
    setPreviewFile(null);
    setPreviewURL(null);
  };

  const submitEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const fd = new FormData();
      if (editing.Caption != null) fd.append("Caption", editing.Caption);
      if (editing.Content != null) fd.append("Content", editing.Content);
      if (previewFile) fd.append("imageFile", previewFile);

      const res = await fetch(
        `/api/admin/tours/details/${tourId}/images/${editing.ImageID}`,
        { method: "PATCH", body: fd }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Update failed");

      setItems((prev) =>
        prev.map((it) =>
          it.ImageID === editing.ImageID
            ? {
                ...it,
                Caption: editing.Caption,
                Content: editing.Content,
                ImageURL: previewURL || it.ImageURL,
              }
            : it
        )
      );
      toast({ title: "Đã lưu", description: "Ảnh đã được cập nhật." });
      setEditing(null);
    } catch (e: any) {
      toast({ title: "Lỗi", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(
        `/api/admin/tours/details/${tourId}/images/${deleteId}`,
        { method: "DELETE" }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Delete failed");
      setItems((prev) => prev.filter((it) => it.ImageID !== deleteId));
      toast({ title: "Đã xoá", description: "Ảnh đã được xoá." });
    } catch (e: any) {
      toast({ title: "Lỗi", description: e.message, variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      {/* Grid wrapper cho toàn bộ gallery */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <div
            key={it.ImageID}
            className="flex flex-col rounded-lg shadow-md hover:shadow-lg overflow-hidden transition bg-white dark:bg-zinc-800 h-full"
          >
            {/* Ảnh */}
            <div className="relative w-full aspect-video">
              <Image
                src={it.ImageURL || "/placeholder.svg"}
                alt={it.Caption || `Ảnh ${it.ImageID}`}
                fill
                className="object-cover"
              />
            </div>

            {/* Nội dung */}
            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="font-semibold text-base">
                  {it.Caption || "Không có caption"}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                  {it.Content || "(Chưa có nội dung chi tiết)"}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  size="sm"
                  className="flex-1"
                  variant="outline"
                  onClick={() => openEdit(it)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Sửa
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-destructive text-white hover:bg-destructive/90"
                  onClick={() => setDeleteId(it.ImageID)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Xoá
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog sửa */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Sửa ảnh chi tiết</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                <Image
                  src={previewURL || editing.ImageURL || "/placeholder.svg"}
                  alt={editing.Caption || "preview"}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <Label>Đổi ảnh (tuỳ chọn)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setPreviewFile(f);
                    setPreviewURL(f ? URL.createObjectURL(f) : null);
                  }}
                />
              </div>

              <div>
                <Label>Caption</Label>
                <Input
                  value={editing.Caption ?? ""}
                  onChange={(e) =>
                    setEditing((prev) =>
                      prev ? { ...prev, Caption: e.target.value } : prev
                    )
                  }
                />
              </div>

              <div>
                <Label>Nội dung chi tiết</Label>
                <Textarea
                  rows={5}
                  value={editing.Content ?? ""}
                  onChange={(e) =>
                    setEditing((prev) =>
                      prev ? { ...prev, Content: e.target.value } : prev
                    )
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Huỷ
            </Button>
            <Button onClick={submitEdit} disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert xoá */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá ảnh này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Xoá
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
