'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { ColumnFiltersState, useTable } from '@tanstack/react-table';
import { type DateRange } from 'react-day-picker';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { DataTable } from '@/components/users/data-table'; // O la ruta genérica
import { columns } from '@/components/users/columns';
import { getProfiles } from '@/app/actions/profiles-actions';
import { TableFilters } from '@/components/table-filters';
import { features } from '@/components/users/data-table-features'; // O la ruta genérica
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

dayjs.extend(isBetween);

export default function UsersPage() {
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState([]);

  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    startTransition(async () => {
      const _users = await getProfiles();
      setUsers(_users?.data || []);
    });
  }, []);

  const filteredData = useMemo(() => {
    let data = users;

    if (dateFilter?.from && dateFilter?.to) {
      data = data.filter((user: any) => {
        if (!user.created_at) return false;
        const createdDate = dayjs(user.created_at);
        const from = dayjs(dateFilter.from).startOf('day');
        const to = dayjs(dateFilter.to).endOf('day');
        return createdDate.isBetween(from, to, 'day', '[]');
      });
    }
    return data;
  }, [users, dateFilter]);

  const table = useTable({
    features,
    data: filteredData,
    columns,
    state: {
      globalFilter,
      columnFilters,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
  });

  const handleColumnFilterChange = (id: string, value: string) => {
    table.getColumn(id)?.setFilterValue(value === 'all' ? undefined : value);
  };

  const handleReset = () => {
    setGlobalFilter('');
    setDateFilter(undefined);
    setColumnFilters([]);
  };

  return (
    <div className="space-y-4">
      <TableFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onResetFilters={handleReset}
      >
        <Select
          value={(table.getColumn('role')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(val) => handleColumnFilterChange('role', val)}
        >
          <SelectTrigger className="w-full text-sm col-span-1">
            <SelectValue placeholder="Rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="user">Usuario</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(val) => handleColumnFilterChange('status', val)}
        >
          <SelectTrigger className="w-full text-sm col-span-1">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </TableFilters>

      {isPending ? (
        <div className="flex h-48 w-full items-center justify-center rounded-md border border-dashed">
          <Spinner className="text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Cargando usuarios...</span>
        </div>
      ) : (
        <DataTable table={table} />
      )}
    </div>
  );
}
