
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale/fr';
import { cn } from "@/lib/utils";

interface DateTimeSelectorProps {
  date: Date | undefined;
  time: string | undefined;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

export const DateTimeSelector = ({ 
  date, 
  time, 
  onDateChange, 
  onTimeChange 
}: DateTimeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date<span className="text-red-500">*</span>
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className={cn(
                "w-full justify-start text-left font-normal border border-gray-300 focus:ring-2 focus:ring-prisma-purple focus:border-prisma-purple",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: fr }) : "Choisir une date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
          Heure<span className="text-red-500">*</span>
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="time"
              className={cn(
                "w-full justify-start text-left font-normal border border-gray-300 focus:ring-2 focus:ring-prisma-purple focus:border-prisma-purple",
                !time && "text-muted-foreground"
              )}
            >
              <Clock className="mr-2 h-4 w-4" />
              {time || "Choisir une heure"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <div className="grid grid-cols-2 gap-2 p-2 max-h-[200px] overflow-y-auto">
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  variant="outline"
                  className={cn(
                    "justify-center",
                    time === slot && "bg-prisma-purple text-white hover:bg-prisma-purple/90"
                  )}
                  onClick={() => onTimeChange(slot)}
                  type="button"
                >
                  {slot}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
