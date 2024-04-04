import { db } from "@/db";
import { ProductFilterValidator } from "@/lib/validators/product-validator";
import { NextRequest } from "next/server";

class Filter {
  private filters: Map<string, string[]> = new Map();
  hasFilters() {
    return this.filters.size > 0;
  }
  addFilter(key: string, operator: string, value: string | number) {
    const filters = this.filters.get(key) || [];
    filters.push(
      `${key} ${operator} ${typeof value === "number" ? value : `"${value}"`}`
    );
    this.filters.set(key, filters);
  }
  addRawFilter(key: string, value: string) {
    this.filters.set(key, [value]);
  }

  getFilters() {
    const parts: string[] = [];
    this.filters.forEach((values, key) => {
      const group = values.join(" OR ");
      parts.push(`(${group})`);
    });
    return parts.join(" AND ");
  }
}
const AVG_PRODUCT_PRICE = 25;
const MAX_PRODUCT_PRICE = 50;

export const POST = async (request: NextRequest) => {
  try {
   
    const body = await request.json();
    
    const { color, size, sort, price } = ProductFilterValidator.parse(
      body.filter
    );
   
    const filter = new Filter();

    if(color.length > 0) color.forEach((color)=> filter.addFilter("color", "=", color));
    else if (color.length === 0) filter.addRawFilter("color", `color = ""`)

    if(size.length > 0) size.forEach((size)=> filter.addFilter("size", "=", size));
    else if (size.length === 0) filter.addRawFilter("size", `size = ""`)

    filter.addRawFilter("price", `price >= ${price[0]} AND price <= ${price[1]}`);

    
    const products = await db.query({
      topK: 12,
      vector: [
        0,
        0,
        sort === "none"
          ? AVG_PRODUCT_PRICE
          : sort === "price-asc"
          ? 0
          : MAX_PRODUCT_PRICE,
      ],
      includeMetadata: true,
      filter: filter.hasFilters() ? filter.getFilters() : undefined,
    });
   
    return new Response(JSON.stringify(products));
  } catch (error) {
    console.error("Error in POST:", error);
    return new Response(null, { status: 400 });
  }
};
