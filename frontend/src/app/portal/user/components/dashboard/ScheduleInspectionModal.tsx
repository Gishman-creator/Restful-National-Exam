import { Controller } from 'react-hook-form';
import * as z from 'zod';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export const scheduleSchema = z.object({
  extinguisherId: z.string().min(1, { message: 'Required' }),
  scheduledDate: z.date({ message: 'Required' }),
  personnelNotified: z.boolean().optional(),
});

interface ScheduleInspectionModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof scheduleSchema>) => Promise<void>;
  formError: string | null;
  form: any;
  extinguishers: any[];
}

export function ScheduleInspectionModal({
  isOpen,
  setIsOpen,
  onSubmit,
  formError,
  form,
  extinguishers
}: ScheduleInspectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant="outline" className="gap-2" />}>
        <CalendarIcon className="w-4 h-4" />
        Schedule Inspection
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl bg-white border-0 shadow-2xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900">Schedule Inspection</DialogTitle>
          <DialogDescription>
            Request an upcoming inspection for an extinguisher.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="extinguisherId"
            control={form.control}
            render={({ field, fieldState }: any) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Select Extinguisher</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger className="w-full bg-gray-50 border-gray-200 focus:ring-indigo-600 focus:border-indigo-600 data-[invalid=true]:border-red-500">
                    <SelectValue placeholder="Select an extinguisher..." />
                  </SelectTrigger>
                  <SelectContent>
                    {extinguishers.map(ext => (
                      <SelectItem key={ext._id} value={ext.serialNumber}>
                        {ext.serialNumber} - {ext.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error?.message || "Error"]} />}
              </Field>
            )}
          />
          
          <Controller
            name="scheduledDate"
            control={form.control}
            render={({ field, fieldState }: any) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                <Popover>
                  <PopoverTrigger render={
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full h-12 px-4 py-3 justify-start text-left font-normal bg-gray-50 border-gray-200",
                        !field.value && "text-muted-foreground"
                      )}
                    />
                  }>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && <FieldError errors={[fieldState.error?.message || "Error"]} />}
              </Field>
            )}
          />

          <Controller
            name="personnelNotified"
            control={form.control}
            render={({ field }: any) => (
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id={field.name}
                  checked={field.value}
                  onChange={field.onChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
                />
                <label htmlFor={field.name} className="text-sm font-medium text-gray-700">Notify relevant personnel</label>
              </div>
            )}
          />
          
          {formError && <p className="text-sm text-red-500 font-medium">{formError}</p>}
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Schedule</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
