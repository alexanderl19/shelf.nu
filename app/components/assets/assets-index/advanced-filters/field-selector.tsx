import { useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
} from "@radix-ui/react-popover";
import { useLoaderData } from "@remix-run/react";
import { ChevronRight } from "~/components/icons/library";
import { Button } from "~/components/shared/button";
import {
  parseColumnName,
  type Column,
} from "~/modules/asset-index-settings/helpers";
import type { AssetIndexLoaderData } from "~/routes/_layout+/assets._index";
import { tw } from "~/utils/tw";
import { getAvailableColumns, getUIFieldType } from "./helpers";
import type { Filter } from "./schema";

export function FieldSelector({
  filter,
  filters,
  setFilter,
}: {
  filter: Filter;
  filters: Filter[];
  setFilter: (name: string) => void;
}) {
  const { settings } = useLoaderData<AssetIndexLoaderData>();
  const columns = settings.columns as Column[];
  const [fieldName, setFieldName] = useState<string>("");
  useEffect(() => {
    setFieldName(filter.name);
  }, [filter.name]);

  /** Filter out the already existing filters and the columns which are not visible */
  const availableColumns = getAvailableColumns(columns, filters, "filter");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="w-[150px] justify-start truncate whitespace-nowrap font-normal [&_span]:max-w-full [&_span]:truncate"
        >
          <ChevronRight className="ml-[2px] inline-block rotate-90" />
          <span className="ml-2">{parseColumnName(fieldName)}</span>{" "}
        </Button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          align="start"
          className={tw(
            "z-[999999] mt-2 max-h-[400px] overflow-scroll rounded-md border border-gray-200 bg-white"
          )}
        >
          {availableColumns.map((column, index) => (
            <div
              key={column.name + index}
              className="px-4 py-2 text-[14px]  text-gray-600 hover:cursor-pointer hover:bg-gray-50"
              onClick={() => setFilter(column.name)}
            >
              <span className="font-medium">
                {parseColumnName(column.name)}
              </span>
              <span className="ml-2 font-normal text-gray-500">
                {getUIFieldType({ column, friendlyName: true })}
              </span>
            </div>
          ))}
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}
