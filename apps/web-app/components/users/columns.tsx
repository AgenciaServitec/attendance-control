'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { type DataTableFeatures } from './data-table-features';
import dayjs from 'dayjs';
import {
  IconBrandWhatsapp,
  IconDotsVertical,
  IconId,
  IconMail,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button'; // Ajusta la ruta del componente

export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

const columnHelper = createColumnHelper<DataTableFeatures, Payment>();

export const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('createAt', {
    header: 'Fecha de Creación',
    cell: ({ row }) => {
      const dateStr = row.original.created_at;
      if (!dateStr) return <span className="text-xs text-muted-foreground">-</span>;

      return (
        <span className="text-xs text-muted-foreground">
          {dayjs(dateStr).format('DD/MM/YYYY hh:mm A')}
        </span>
      );
    },
  }),
  columnHelper.accessor('fullName', {
    header: 'Nombres y Apellidos',
    cell: ({ row }) => {
      const data = row.original;
      const fullName =
        `${data.first_name} ${data.paternal_surname} ${data.maternal_surname || ''}`.trim();

      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={data.avatar_url}
              alt={`Foto de Perfil de ${data.first_name} ${data.paternal_surname}`}
            />
            <AvatarFallback className="text-xs">
              {data.first_name?.[0]}
              {data.paternal_surname?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-xs">
            <div className="flex items-center gap-1 font-medium text-foreground">
              <span>{fullName}</span>
              <CopyButton value={fullName} size={12} />
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <IconId stroke={2} size={13} />
              <span>{data.document_number}</span>
              {data.document_number && <CopyButton value={data.document_number} size={12} />}
            </div>
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor('contact', {
    header: 'Contacto',
    cell: ({ row }) => {
      const data = row.original;
      const email = data.email || 'test@gmail.com';
      const phone = `${data.country_code || ''} ${data.phone_number || ''}`.trim();

      return (
        <div className="flex flex-col gap-0.5 text-xs">
          <div className="flex items-center gap-1">
            <IconMail stroke={2} size={13} className="text-muted-foreground shrink-0" />
            <Link href={`mailto:${email}`} className="hover:underline text-foreground">
              {email}
            </Link>
            <CopyButton value={email} size={12} />
          </div>
          <div className="flex items-center gap-1">
            <IconBrandWhatsapp stroke={2} size={13} className="text-[#25D366] shrink-0" />
            <Link
              href={`https://api.whatsapp.com/send/?phone=${(data.country_code || '').replace('+', '')}${data.phone_number || ''}`}
              className="hover:underline text-foreground"
            >
              {phone}
            </Link>
            {data.phone_number && <CopyButton value={phone} size={12} />}
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor('organization', {
    header: 'Organización',
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="rounded-sm border-primary text-primary text-[11px] px-1.5 py-0.5"
      >
        Servitec
      </Badge>
    ),
  }),
  columnHelper.accessor('role', {
    header: 'Rol',
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="rounded-sm border-green-600 text-green-600 text-[11px] px-1.5 py-0.5"
      >
        Administrador
      </Badge>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Estado',
    cell: ({ row }) => {
      const data = row.original;

      return (
        <Badge
          variant="outline"
          className={`rounded-sm text-[11px] px-1.5 py-0.5 ${
            data.status === 'active'
              ? 'border-green-600 text-green-600'
              : 'border-destructive text-destructive'
          }`}
        >
          {data.status === 'active' ? 'Activo' : 'Inactivo'}
        </Badge>
      );
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Opciones',
    cell: ({ row }) => {
      const data = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-7 w-7 p-0">
              <span className="sr-only">Abrir menú</span>
              <IconDotsVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href={`/users/${data.id}/edit`}
                className="flex items-center gap-2 cursor-pointer text-xs"
              >
                <IconPencil size={14} /> Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer text-xs">
              <IconTrash size={14} /> Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }),
]);
