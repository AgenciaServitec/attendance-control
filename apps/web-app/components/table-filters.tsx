'use client';

import { ReactNode } from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { type DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-picker-range';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field';

interface TableFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  dateFilter?: DateRange;
  setDateFilter?: (value: DateRange | undefined) => void;
  onResetFilters?: () => void;
  children?: ReactNode;
}

export function TableFilters({
  globalFilter,
  setGlobalFilter,
  dateFilter,
  setDateFilter,
  onResetFilters,
  children,
}: TableFiltersProps) {
  return (
    <FieldSet>
      <FieldLegend>Filtros</FieldLegend>
      <FieldGroup className="grid grid-cols-6 gap-4">
        <InputGroup className="col-span-6 lg:col-span-3">
          <InputGroupAddon align="inline-start">
            <IconSearch size={16} />
          </InputGroupAddon>
          <InputGroupInput
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(String(e.target.value))}
            placeholder="Buscar..."
            className="pl-8 text-sm"
          />
        </InputGroup>
        <div className="col-span-6 lg:col-span-2">
          {setDateFilter && (
            <DatePickerWithRange date={dateFilter} setDate={setDateFilter} className="w-full" />
          )}
        </div>
        <div className="col-span-6 lg:col-span-1">
          {onResetFilters && (
            <Button variant="destructive" onClick={onResetFilters} className="w-full">
              <IconX size={16} className="mr-1" /> Limpiar
            </Button>
          )}
        </div>
        {children}
      </FieldGroup>
    </FieldSet>
  );
}
