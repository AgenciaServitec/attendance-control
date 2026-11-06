'use client';

import * as React from 'react';
import dayjs from 'dayjs';
import { IconCalendar } from '@tabler/icons-react';
import { type DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerWithRangeProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  className?: string;
}

export function DatePickerWithRange({ date, setDate, className }: DatePickerWithRangeProps) {
  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="w-full justify-start text-left font-normal pl-8 text-sm relative"
          >
            <IconCalendar size={16} className="absolute left-2.5 top-2.5 text-muted-foreground" />
            {date?.from ? (
              date.to ? (
                <>
                  {dayjs(date.from).format('DD MMM YYYY')} - {dayjs(date.to).format('DD MMM YYYY')}
                </>
              ) : (
                dayjs(date.from).format('DD MMM YYYY')
              )
            ) : (
              <span className="text-muted-foreground">Filtrar por fecha...</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
