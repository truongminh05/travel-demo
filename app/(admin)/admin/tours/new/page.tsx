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
        <CardTitle>Add New Tour</CardTitle>
        <CardDescription>
          Fill out the form below to add a new tour package to your website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Component form này đã được tạo ở các bước trước */}
        <AdminTourForm />
      </CardContent>
    </Card>
  );
}
