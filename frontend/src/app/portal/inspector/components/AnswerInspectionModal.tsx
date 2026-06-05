import { Controller } from 'react-hook-form';
import * as z from 'zod';
import { ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

export const answerSchema = z.object({
  condition: z.enum(['Pass', 'Fail', 'NeedsMaintenance']),
  notes: z.string().optional(),
});

interface AnswerInspectionModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof answerSchema>) => Promise<void>;
  formError: string | null;
  form: any;
  inspection: any;
}

export function AnswerInspectionModal({
  isOpen,
  setIsOpen,
  onSubmit,
  formError,
  form,
  inspection
}: AnswerInspectionModalProps) {
  if (!inspection) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl bg-white border-0 shadow-2xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-indigo-600" />
            Complete Inspection
          </DialogTitle>
          <DialogDescription>
            Record the outcome of your inspection for Extinguisher <span className="font-semibold text-gray-800">{inspection.extinguisherId}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          
          <Controller
            name="condition"
            control={form.control}
            render={({ field, fieldState }: any) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Extinguisher Condition</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <SelectTrigger className="w-full bg-gray-50 border-gray-200 focus:ring-indigo-600 focus:border-indigo-600 data-[invalid=true]:border-red-500">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pass">Pass</SelectItem>
                    <SelectItem value="Fail">Fail</SelectItem>
                    <SelectItem value="NeedsMaintenance">Needs Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error?.message || "Error"]} />}
              </Field>
            )}
          />

          <Controller
            name="notes"
            control={form.control}
            render={({ field, fieldState }: any) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Inspection Notes (Optional)</FieldLabel>
                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="e.g., pressure low, pin missing..." className="bg-gray-50" />
                {fieldState.invalid && <FieldError errors={[fieldState.error?.message || "Error"]} />}
              </Field>
            )}
          />
          
          {formError && <p className="text-sm text-red-500 font-medium">{formError}</p>}
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Report</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
