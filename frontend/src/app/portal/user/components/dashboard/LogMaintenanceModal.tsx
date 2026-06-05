import { Controller } from 'react-hook-form';
import * as z from 'zod';
import { Wrench } from 'lucide-react';
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

export const maintenanceSchema = z.object({
  extinguisherId: z.string().min(1, { message: 'Required' }),
  actionTaken: z.string().min(1, { message: 'Required' }),
  dateOfAction: z.string().min(1, { message: 'Required' }),
  conditionNoted: z.enum(['Pass', 'Fail', 'NeedsMaintenance']),
});

interface LogMaintenanceModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof maintenanceSchema>) => Promise<void>;
  formError: string | null;
  form: any;
}

export function LogMaintenanceModal({
  isOpen,
  setIsOpen,
  onSubmit,
  formError,
  form,
}: LogMaintenanceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Wrench className="w-4 h-4" />
        Log Maintenance
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl bg-white border-0 shadow-2xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900">Log Maintenance</DialogTitle>
          <DialogDescription>
            Record maintenance activities. Condition cannot be modified later.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="extinguisherId"
            control={form.control}
            render={({ field, fieldState }: any) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Extinguisher ID</FieldLabel>
                <Input {...field} id={field.name} placeholder="EXT-001" className="bg-gray-50" />
                {fieldState.invalid && <FieldError errors={[fieldState.error?.message || "Error"]} />}
              </Field>
            )}
          />

          <Controller
            name="actionTaken"
            control={form.control}
            render={({ field, fieldState }: any) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Action Taken</FieldLabel>
                <Input {...field} id={field.name} placeholder="Recharged, replaced pin, etc." className="bg-gray-50" />
                {fieldState.invalid && <FieldError errors={[fieldState.error?.message || "Error"]} />}
              </Field>
            )}
          />
          
          <Controller
            name="dateOfAction"
            control={form.control}
            render={({ field, fieldState }: any) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Date of Action</FieldLabel>
                <Input {...field} id={field.name} type="datetime-local" className="bg-gray-50" />
                {fieldState.invalid && <FieldError errors={[fieldState.error?.message || "Error"]} />}
              </Field>
            )}
          />

          <Controller
            name="conditionNoted"
            control={form.control}
            render={({ field, fieldState }: any) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Condition Noted</FieldLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full bg-gray-50 border-gray-200 focus:ring-indigo-600 focus:border-indigo-600 data-[invalid=true]:border-red-500">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pass">Pass</SelectItem>
                    <SelectItem value="NeedsMaintenance">Needs Maintenance</SelectItem>
                    <SelectItem value="Fail">Fail (Out of Service)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-rose-500 mt-1">Note: Condition cannot be updated after saving.</p>
                {fieldState.invalid && <FieldError errors={[fieldState.error?.message || "Error"]} />}
              </Field>
            )}
          />
          
          {formError && <p className="text-sm text-red-500 font-medium">{formError}</p>}
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Log</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
