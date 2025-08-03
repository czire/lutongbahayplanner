"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DebouncedLink from "@/components/ui/DebouncedLink";
import { ShoppingCart, ArrowLeft } from "lucide-react";

const GroceryListPage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Grocery List
        </h1>
        <p className="text-lg text-gray-600">
          Manage your grocery items and shopping lists
        </p>
      </div>

      {/* Coming Soon Content */}
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader className="text-center pb-6">
            <div className="text-6xl mb-4">
              <ShoppingCart className="w-16 h-16 mx-auto text-orange-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Coming Soon!
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg">
              We're working hard to bring you an amazing grocery list feature
            </CardDescription>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">
                What's Coming:
              </h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Auto-generate grocery lists from your meal plans
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Smart ingredient grouping and quantity calculations
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Price tracking and budget management
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Shopping list sharing and collaboration
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Store location integration
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <DebouncedLink
                href="/meal-planner"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Meal Planner
              </DebouncedLink>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroceryListPage;
