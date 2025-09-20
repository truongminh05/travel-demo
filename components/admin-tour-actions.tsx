"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontalIcon, EditIcon, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface AdminTourActionsProps {
  tourId: number;
}

export function AdminTourActions({ tourId }: AdminTourActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/tours/${tourId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete tour");

      toast({ title: "Success", description: "Tour deleted successfully." });
      // Reload the page to see changes. A more advanced solution would update the state.
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <MoreHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/admin/tours/edit/${tourId}`}>
              <EditIcon className="mr-2 h-4 w-4" /> Sửa
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setIsDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <TrashIcon className="mr-2 h-4 w-4" /> Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn
              tour khỏi cơ sở dữ liệu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
