import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import authAxios from "@/lib/authAxios";

interface Category {
  _id: string;
  name: string;
}

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3000/categories");
      setCategories(res.data.categories);
    } catch (err) {
      console.error("خطا در دریافت دسته‌بندی‌ها", err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    setLoading(true);
    try {
      await authAxios.post("http://localhost:3000/categories", { name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error("خطا در افزودن دسته‌بندی", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedToDelete) return;
    try {
      await authAxios.delete(`http://localhost:3000/categories/${selectedToDelete._id}`);
      fetchCategories();
    } catch (err) {
      console.error("خطا در حذف دسته‌بندی", err);
    } finally {
      setSelectedToDelete(null);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Card className="w-full max-w-xl mx-auto" dir="rtl">
      <CardHeader >
        <CardTitle>مدیریت دسته‌بندی‌ها</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="نام دسته‌بندی جدید"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button onClick={handleAddCategory} disabled={loading}>
            افزودن
          </Button>
        </div>

        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex justify-between items-center p-2 border rounded"
            >
              <span>{cat.name}</span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setSelectedToDelete(cat)}
                  >
                    حذف
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      آیا از حذف «{selectedToDelete?.name}» مطمئن هستید؟
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedToDelete(null)}>
                      انصراف
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteCategory}>
                      تأیید
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
