import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Slider } from '../ui/slider';
import { cn } from '@/lib/utils';

const Filters = ({
  COLOR_FILTER,
  applyAllFilters,
  sort,
  setSort,
  SIZE_FILTER,
  PRICE_FILTER,
  SUBCATEGORY,
  _debounceSubmit,
  minPrice,
  maxPrice,

}:
{
  COLOR_FILTER: any,
  applyAllFilters: any,
  sort: any,
  setSort: any,
  SIZE_FILTER: any,
  PRICE_FILTER: any,
  SUBCATEGORY: any,
  _debounceSubmit: any,
  minPrice: number,
  maxPrice: number,
}
) => {
  return (
    <>
      <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
        {SUBCATEGORY.map((category: any) => (
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
              {COLOR_FILTER.options.map((color: any, idx: any) => (
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
              {SIZE_FILTER.options.map((size: any, idx: any) => (
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
              {PRICE_FILTER.options.map((size: any, idx: any) => (
                <li key={size.label} className="flex items-center ">
                  <input
                    type="radio"
                    id={`price-${idx}`}
                    className="h-4 w-4 rounded cursor-pointer border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    onChange={() => {
                      setSort((prev: any) => ({
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
                      setSort((prev: any) => ({
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
                  value={sort.price.isCustom ? sort.price.range : [0, 100]}
                  min={0}
                  defaultValue={[0, 100]}
                  max={100}
                  step={5}
                  onValueChange={(range) => {
                    const [newMin, newMax] = range;
                    setSort((prev: any) => ({
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
    </>
  );
};

export default Filters