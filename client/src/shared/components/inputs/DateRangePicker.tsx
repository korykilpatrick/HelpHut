import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '../base/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../base/Popover';
import { BaseButton } from '../base/BaseButton';
import BaseText from '../base/BaseText';

interface DateRangePickerProps {
  label?: string;
  startDate: Date | null;
  endDate: Date | null;
  onChange: (range: { start: Date | null; end: Date | null }) => void;
}

export function DateRangePicker({
  label,
  startDate,
  endDate,
  onChange
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return format(date, 'MMM d, yyyy');
  };

  const handleSelect = (date: Date | null) => {
    if (!date) return;

    if (!startDate || (startDate && endDate)) {
      // Start new selection
      onChange({ start: date, end: null });
    } else {
      // Complete selection
      if (date < startDate) {
        onChange({ start: date, end: startDate });
      } else {
        onChange({ start: startDate, end: date });
      }
      setIsOpen(false);
    }
  };

  const clearSelection = () => {
    onChange({ start: null, end: null });
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      {label && (
        <BaseText size="sm" weight="medium" className="mb-1.5">
          {label}
        </BaseText>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <BaseButton
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? (
              endDate ? (
                <>
                  {formatDate(startDate)} - {formatDate(endDate)}
                </>
              ) : (
                formatDate(startDate)
              )
            ) : (
              <span className="text-muted-foreground">Pick a date range</span>
            )}
          </BaseButton>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{ from: startDate, to: endDate }}
            onSelect={(range) => {
              if (!range) return;
              handleSelect(range.from || range.to || null);
            }}
            numberOfMonths={2}
            defaultMonth={startDate || new Date()}
          />
          <div className="border-t p-3">
            <BaseButton
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={clearSelection}
            >
              Clear Selection
            </BaseButton>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 