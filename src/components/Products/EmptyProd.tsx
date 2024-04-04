import { XCircle } from "lucide-react";
import React from "react";

const EmptyProd = () => {
  return (
    <div className="relative col-span-full h-80  w-full p-12 flex flex-col items-center justify-center">
      <XCircle className="w-16 h-16 text-gray-500" />
      <h1 className="text-2xl font-bold text-gray-500">No products found</h1>
      <p className="text-gray-500">
        Try adjusting your search or filters to find what you&apos;re looking
        for.
      </p>
    </div>
  );
};

export default EmptyProd;
