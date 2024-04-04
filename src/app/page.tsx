"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Filter, XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import axios from "axios";
import { QueryResult } from "@upstash/vector";
import { Product } from "@/db";
import ProductCard from "@/components/Products/Product";
import ProductSkeleton from "@/components/Products/ProductSkeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductState } from "@/lib/validators/product-validator";
import { Slider } from "@/components/ui/slider";
import debounce from "lodash.debounce";
import EmptyProd from "@/components/Products/EmptyProd";
import { Sheet } from "@/components/ui/sheet";
import Filters from "@/components/Products/Filters";

const SORT_OPT = [
  {
    name: "None",
    value: "none",
  },
  {
    name: "Price: Low to High",
    value: "price-asc",
  },
  {
    name: "Price: High to Low",
    value: "price-desc",
  },
] as const;

const SUBCATEGORY = [
  {
    name: "Shirts",
    selected: true,
    href: "#",
  },
  {
    name: "Hoodies",
    selected: false,
    href: "#",
  },
  {
    name: "Sweatshirts",
    selected: false,
    href: "#",
  },
  {
    name: "Accessories",
    selected: false,
    href: "#",
  },
];

const COLOR_FILTER = {
  id: "color",
  name: "Color",
  options: [
    { label: "White", value: "white" },
    { label: "Beige", value: "beige" },
    { label: "Blue", value: "blue" },
    { label: "Green", value: "green" },
    { label: "Purple", value: "purple" },
  ] as const,
};

const SIZE_FILTER = {
  id: "size",
  name: "Size",
  options: [
    { label: "S", value: "S" },
    { label: "M", value: "M" },
    { label: "L", value: "L" },
  ],
} as const;

const PRICE_FILTER = {
  id: "price",
  name: "Price",
  options: [
    {
      label: "Any price",
      value: [0, 100],
    },
    {
      label: "Under $20",
      value: [0, 20],
    },
    {
      label: "Under $40",
      value: [0, 40],
    },
  ],
} as const;

export default function Home() {
  const [isFilterSheetVisible, setFilterSheetVisible] = useState(false);
  const [sort, setSort] = useState<ProductState>({
    sort: "none",
    color: ["beige", "blue", "green", "purple", "white"],
    size: ["L", "M", "S"],
    price: { isCustom: false, range: [0, 100] },
  });

  const toggleFilterSheet = () => {
    setFilterSheetVisible(!isFilterSheetVisible);
  };
  const { data: products, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.post<QueryResult<Product>[]>(
        `${process.env.NEXT_PUBLIC_URL}/api/products`,
        {
          filter: {
            sort: sort.sort,
            color: sort.color,
            size: sort.size,
            price: sort.price.range,
          },
        }
      );
      return data;
    },
  });

  const onSubmit = () => refetch();

  const debounceSubmit = debounce(onSubmit, 500);
  const _debounceSubmit = useCallback(debounceSubmit, []);

  const applyAllFilters = ({
    category,
    value,
  }: {
    category: keyof Omit<typeof sort, "price" | "sort">;
    value: string;
  }) => {
    const isFIltered = sort[category].includes(value as never);
    if (isFIltered) {
      setSort((prev) => ({
        ...prev,
        [category]: prev[category].filter((v) => v !== value),
      }));
    } else {
      setSort((prev) => ({
        ...prev,
        [category]: [...prev[category], value],
      }));
    }
    _debounceSubmit();
  };

  const minPrice = Math.min(sort.price.range[0], sort.price.range[1]);

  const maxPrice = Math.max(sort.price.range[0], sort.price.range[1]);

  console.log(sort);
  return (
    <main
      className={` mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`}
    >
      {isFilterSheetVisible && (
        <div className="w-full h-full bg-black opacity-60 z-50 fixed top-0 left-0" />
      )}
      <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          High quality selection
        </h1>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
              Sort
              <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPT.map((opt) => (
                <button
                  className={cn(
                    "text-left w-full block px-4 py-2 text-sm hover:bg-gray-50 hover:text-gray-600",
                    sort.sort === opt.value
                      ? "bg-gray-100 text-gray-900 hover:text-gray-900 hover:bg-gray-100"
                      : "text-gray-500"
                  )}
                  key={opt.value}
                  onClick={() => {
                    setSort((prev) => ({
                      ...prev,
                      sort: opt.value,
                    }));

                    _debounceSubmit();
                  }}
                >
                  {opt.name}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            onClick={toggleFilterSheet}
            className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className={`filter-sheet ${isFilterSheetVisible ? "open" : ""}`}>
        <button onClick={toggleFilterSheet} className="close-button">
          <XIcon />
        </button>
        <div className="filter-content ">
          <div
            className={cn("lg:block", {
              block: isFilterSheetVisible,
              hidden: !isFilterSheetVisible,
            })}
          >
            <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
              {SUBCATEGORY.map((category) => (
                <li key={category.name}>
                  <button
                    disabled={!category.selected}
                    className="disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>

            <Accordion type="multiple" className="animate-none">
              {/* COLOR FIlter */}
              <AccordionItem value="color">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="text-gray-900font-medium">Color</span>
                </AccordionTrigger>
                <AccordionContent className="pt-6 animate-none ">
                  <ul className="space-y-4">
                    {COLOR_FILTER.options.map((color, idx) => (
                      <li key={color.value} className="flex items-center ">
                        <input
                          type="checkbox"
                          id={`color-${idx}`}
                          className="h-4 w-4 rounded cursor-pointer border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={() =>
                            applyAllFilters({
                              category: "color",
                              value: color.value,
                            })
                          }
                          checked={sort.color.includes(color.value)}
                        />
                        <label
                          htmlFor={`color-${idx}`}
                          className="ml-3 text-sm text-gray-600 cursor-pointer"
                        >
                          {color.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              {/* SIZE FILTER */}
              <AccordionItem value="size">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="text-gray-900font-medium">Size</span>
                </AccordionTrigger>
                <AccordionContent className="pt-6 animate-none ">
                  <ul className="space-y-4">
                    {SIZE_FILTER.options.map((size, idx) => (
                      <li key={size.value} className="flex items-center ">
                        <input
                          type="checkbox"
                          id={`size-${idx}`}
                          className="h-4 w-4 rounded cursor-pointer border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={() =>
                            applyAllFilters({
                              category: "size",
                              value: size.value,
                            })
                          }
                          checked={sort.size.includes(size.value)}
                        />
                        <label
                          htmlFor={`size-${idx}`}
                          className="ml-3 text-sm text-gray-600 cursor-pointer"
                        >
                          {size.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              {/* PRICE FILTER */}
              <AccordionItem value="price">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="text-gray-900font-medium">Price</span>
                </AccordionTrigger>
                <AccordionContent className="pt-6 animate-none ">
                  <ul className="space-y-4">
                    {PRICE_FILTER.options.map((size, idx) => (
                      <li key={size.label} className="flex items-center ">
                        <input
                          type="radio"
                          id={`price-${idx}`}
                          className="h-4 w-4 rounded cursor-pointer border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={() => {
                            setSort((prev) => ({
                              ...prev,
                              price: {
                                isCustom: false,
                                range: [...size.value],
                              },
                            }));
                            _debounceSubmit();
                          }}
                          checked={
                            !sort.price.isCustom &&
                            sort.price.range[0] === size.value[0] &&
                            sort.price.range[1] === size.value[1]
                          }
                        />
                        <label
                          htmlFor={`price-${idx}`}
                          className="ml-3 text-sm text-gray-600 cursor-pointer"
                        >
                          {size.label}
                        </label>
                      </li>
                    ))}
                    <li className="flex justify-center flex-col gap-2">
                      <div>
                        <input
                          type="radio"
                          id={`price-${PRICE_FILTER.options.length}`}
                          className="h-4 w-4 rounded cursor-pointer border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          onChange={() => {
                            setSort((prev) => ({
                              ...prev,
                              price: {
                                isCustom: true,
                                range: [0, 100],
                              },
                            }));
                            _debounceSubmit();
                          }}
                          checked={sort.price.isCustom}
                        />
                        <label
                          htmlFor={`price-${PRICE_FILTER.options.length}`}
                          className="ml-3 text-sm text-gray-600 cursor-pointer"
                        >
                          Custom
                        </label>
                      </div>
                      <div className="flex justify-between">
                        <p className="font-medium">Price</p>
                        <div>
                          {sort.price.isCustom
                            ? minPrice.toFixed(0)
                            : sort.price.range[0].toFixed(0)}{" "}
                          $ -{" "}
                          {sort.price.isCustom
                            ? maxPrice.toFixed(0)
                            : sort.price.range[1].toFixed(0)}{" "}
                          $
                        </div>
                      </div>
                      <Slider
                        className={cn({
                          "opacity-50": !sort.price.isCustom,
                        })}
                        disabled={!sort.price.isCustom}
                        value={
                          sort.price.isCustom ? sort.price.range : [0, 100]
                        }
                        min={0}
                        defaultValue={[0, 100]}
                        max={100}
                        step={5}
                        onValueChange={(range) => {
                          const [newMin, newMax] = range;
                          setSort((prev) => ({
                            ...prev,
                            price: {
                              isCustom: true,
                              range: [newMin, newMax],
                            },
                          }));
                        }}
                      />
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-y-10 gap-x-6  lg:grid-cols-4  ">
          {/* Filters */}
          <div className={`hidden lg:block`}>
            <Filters
              COLOR_FILTER={COLOR_FILTER}
              SIZE_FILTER={SIZE_FILTER}
              PRICE_FILTER={PRICE_FILTER}
              SUBCATEGORY={SUBCATEGORY}
              applyAllFilters={applyAllFilters}
              sort={sort}
              setSort={setSort}
              minPrice={minPrice}
              maxPrice={maxPrice}
              _debounceSubmit={_debounceSubmit}
            />
          </div>
          {/* Product grid */}
          <ul className="lg:col-span-3 grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-8">
            {products && products.length === 0 ? (
              <EmptyProd />
            ) : products ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product.metadata!} />
              ))
            ) : (
              new Array(12)
                .fill(null)
                .map((_, idx) => <ProductSkeleton key={idx} />)
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
