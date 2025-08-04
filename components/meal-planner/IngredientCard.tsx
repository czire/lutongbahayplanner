"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { GuestRecipeIngredient } from "@/lib/types/guest";

interface EditableIngredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  price?: number;
  pricePerUnit?: number | null;
  notes?: string | null;
  recipeId: string;
}

interface IngredientCardProps {
  ingredient: GuestRecipeIngredient;
  onUpdate: (updatedIngredient: GuestRecipeIngredient) => void;
  onDelete: (ingredientId: string) => void;
  isLoading?: boolean;
}

export const IngredientCard = ({
  ingredient,
  onUpdate,
  onDelete,
  isLoading = false,
}: IngredientCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempIngredient, setTempIngredient] =
    useState<EditableIngredient | null>(null);

  const handleEditStart = () => {
    setIsEditing(true);
    setTempIngredient({
      id: ingredient.id,
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      price: ingredient.price,
      pricePerUnit: ingredient.pricePerUnit,
      notes: ingredient.notes,
      recipeId: ingredient.recipeId,
    });
  };

  const handleSave = () => {
    if (tempIngredient) {
      const updatedIngredient: GuestRecipeIngredient = {
        id: tempIngredient.id,
        name: tempIngredient.name,
        quantity: tempIngredient.quantity,
        unit: tempIngredient.unit,
        price: tempIngredient.price ?? 0,
        pricePerUnit: tempIngredient.pricePerUnit,
        notes: tempIngredient.notes,
        recipeId: tempIngredient.recipeId,
      };
      onUpdate(updatedIngredient);
    }
    setIsEditing(false);
    setTempIngredient(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempIngredient(null);
  };

  if (isEditing) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`inline-name-${ingredient.id}`}>Name</Label>
              <Input
                id={`inline-name-${ingredient.id}`}
                value={tempIngredient?.name || ""}
                onChange={(e) =>
                  setTempIngredient((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                placeholder="Ingredient name"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor={`inline-quantity-${ingredient.id}`}>
                  Quantity
                </Label>
                <Input
                  id={`inline-quantity-${ingredient.id}`}
                  value={tempIngredient?.quantity || ""}
                  onChange={(e) =>
                    setTempIngredient((prev) =>
                      prev ? { ...prev, quantity: e.target.value } : null
                    )
                  }
                  placeholder="Amount"
                />
              </div>
              <div>
                <Label htmlFor={`inline-unit-${ingredient.id}`}>Unit</Label>
                <Input
                  id={`inline-unit-${ingredient.id}`}
                  value={tempIngredient?.unit || ""}
                  onChange={(e) =>
                    setTempIngredient((prev) =>
                      prev ? { ...prev, unit: e.target.value } : null
                    )
                  }
                  placeholder="kg, pcs"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`inline-price-${ingredient.id}`}>Price (₱)</Label>
              <Input
                id={`inline-price-${ingredient.id}`}
                type="number"
                step="0.01"
                value={tempIngredient?.price || 0}
                onChange={(e) =>
                  setTempIngredient((prev) =>
                    prev
                      ? { ...prev, price: parseFloat(e.target.value) || 0 }
                      : null
                  )
                }
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor={`inline-pricePerUnit-${ingredient.id}`}>
                Price per Unit (₱)
              </Label>
              <Input
                id={`inline-pricePerUnit-${ingredient.id}`}
                type="number"
                step="0.01"
                value={tempIngredient?.pricePerUnit || 0}
                onChange={(e) =>
                  setTempIngredient((prev) =>
                    prev
                      ? {
                          ...prev,
                          pricePerUnit: parseFloat(e.target.value) || 0,
                        }
                      : null
                  )
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`inline-notes-${ingredient.id}`}>Notes</Label>
            <Input
              id={`inline-notes-${ingredient.id}`}
              value={tempIngredient?.notes || ""}
              onChange={(e) =>
                setTempIngredient((prev) =>
                  prev ? { ...prev, notes: e.target.value } : null
                )
              }
              placeholder="Optional notes"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-gray-900 text-lg">
              {ingredient.name}
            </h4>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
              {ingredient.quantity} {ingredient.unit}
            </span>
          </div>

          {ingredient.notes && (
            <p className="text-gray-600 text-sm italic mb-2">
              📝 {ingredient.notes}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {ingredient.pricePerUnit && (
              <span>
                💱 ₱{ingredient.pricePerUnit.toFixed(2)} per {ingredient.unit}
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">Cost</div>
          <div className="text-xl font-bold text-green-600">
            ₱{(ingredient.price || 0).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleEditStart}
          disabled={isLoading}
        >
          <Pencil className="mr-2" size={16} />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isLoading}>
              <Trash2 className="mr-2" size={16} />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Ingredient</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this ingredient? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(ingredient.id)}
                className="bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
