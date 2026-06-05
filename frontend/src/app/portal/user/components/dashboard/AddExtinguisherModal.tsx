import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from "date-fns";
import { Plus, Check, ChevronsUpDown, CalendarIcon } from 'lucide-react';
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { districtOptions } from '@/lib/districts';

export const extSchema = z.object({
  serialNumber: z.string().min(1, { message: 'Required' }),
  type: z.enum(['Water', 'Foam', 'CO2', 'DryPowder', 'WetChemical']),
  size: z.enum(['2.5 lbs.', '5 lbs.', '9 lbs.', '12 lbs.']),
  location: z.string().min(1, { message: 'Required' }),
  manufacturingDate: z.date().optional(),
  expirationDate: z.date().optional(),
});

interface AddExtinguisherModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof extSchema>) => Promise<void>;
  formError: string | null;
  editingExtId: string | null;
  form: any;
  onOpenNew: () => void;
}

export function AddExtinguisherModal({ 
  isOpen, 
  setIsOpen, 
  onSubmit, 
  formError, 
  editingExtId,
  form,
  onOpenNew
}: AddExtinguisherModalProps) {
  const [openLocation, setOpenLocation] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button onClick={onOpenNew} className="gap-2" />}>
        <Plus className="w-4 h-4" />
        Add Extinguisher
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl bg-white border-0 shadow-2xl p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {editingExtId ? 'Edit Extinguisher' : 'Register Extinguisher'}
          </DialogTitle>
          <DialogDescription>
            {editingExtId ? 'Update extinguisher details.' : 'Add a new extinguisher to your assigned list.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="serialNumber"
            control={form.control}
            render={({ field, fieldState }: any) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Serial Number</FieldLabel>
                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="e.g. EXT-001" className="bg-gray-50" disabled={!!editingExtId} value={field.value || ""} />
                {fieldState.invalid && <FieldError errors={[fieldState.error?.message || "Error"]} />}
              </Field>
            )}
          />
          
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }: any) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                <Select onValueChange={field.onChange} disabled={!!editingExtId} value={field.value || ""}>
                  <SelectTrigger className="w-full bg-gray-50 border-gray-200 focus:ring-indigo-600 focus:border-indigo-600 data-[invalid=true]:border-red-500">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Water">Water</SelectItem>
                    <SelectItem value="Foam">Foam</SelectItem>
                    <SelectItem value="CO2">CO2</SelectItem>
                    <SelectItem value="DryPowder">Dry Powder</SelectItem>
                    <SelectItem value="WetChemical">Wet Chemical</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error?.message || "Error"]} />}
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="size"
              control={form.control}
              render={({ field, fieldState }: any) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Size</FieldLabel>
                  <Select onValueChange={field.onChange} disabled={!!editingExtId} value={field.value || ""}>
                    <SelectTrigger className="w-full bg-gray-50 border-gray-200 focus:ring-indigo-600 focus:border-indigo-600 data-[invalid=true]:border-red-500">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2.5 lbs.">2.5 lbs.</SelectItem>
                      <SelectItem value="5 lbs.">5 lbs.</SelectItem>
                      <SelectItem value="9 lbs.">9 lbs.</SelectItem>
                      <SelectItem value="12 lbs.">12 lbs.</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error?.message || "Error"]} />}
                </Field>
              )}
            />

            <Controller
              name="location"
              control={form.control}
              render={({ field, fieldState }: any) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Location (District)</FieldLabel>
                  <Popover open={openLocation} onOpenChange={setOpenLocation}>
                    <PopoverTrigger render={
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openLocation}
                        className={cn(
                          "w-full justify-between h-12 px-4 py-3 bg-gray-50 border-gray-200 font-normal",
                          !field.value && "text-muted-foreground",
                          fieldState.invalid && "border-red-500"
                        )}
                      />
                    }>
                        {field.value
                          ? field.value
                          : "Select district..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search district..." />
                        <CommandList>
                          <CommandEmpty>No district found.</CommandEmpty>
                          <CommandGroup>
                            {districtOptions.map((district) => (
                              <CommandItem
                                key={district}
                                value={district}
                                onSelect={() => {
                                  form.setValue("location", district)
                                  setOpenLocation(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === district ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {district}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && <FieldError errors={[fieldState.error?.message || "Error"]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="manufacturingDate"
              control={form.control}
              render={({ field, fieldState }: any) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Manufacturing Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger disabled={!!editingExtId} render={
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
              name="expirationDate"
              control={form.control}
              render={({ field, fieldState }: any) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Expiration Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger disabled={!!editingExtId} render={
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
          </div>
          
          {formError && <p className="text-sm text-red-500 font-medium">{formError}</p>}
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">{editingExtId ? 'Update' : 'Register'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
