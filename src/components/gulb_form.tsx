import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BuildingIcon, Loader2, UserIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { useState } from 'react';

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(50, {
      message: 'Name must be less than 50 characters.',
    }),
});

export type GulbFormValues = z.infer<typeof formSchema>;

export type GulbFormProps = {
  isSubmitDisabled: boolean;
  onSubmit: (values: GulbFormValues, isOrg: boolean) => void;
};

export function GulbForm({ onSubmit, isSubmitDisabled }: GulbFormProps) {
  const [isOrg, setIsOrg] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((v) => onSubmit(v, isOrg))}
        className="mx-auto max-w-md"
      >
        <div className="flex flex-col space-y-6 sm:flex-row sm:space-x-2 sm:space-y-0">
          <div className="flex">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsOrg(false)}
                    type="button"
                    variant={isOrg ? 'outline' : 'default'}
                    className="rounded-r-none"
                  >
                    <UserIcon className="h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="mb-1 rounded-md border border-border p-2 text-xs">
                  <p className="border-1 border-border">User</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsOrg(true)}
                    type="button"
                    variant={isOrg ? 'default' : 'outline'}
                    className="rounded-l-none"
                  >
                    <BuildingIcon className="h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="mb-1 rounded-md border border-border p-2 text-xs">
                  <p className="border-1 border-border">Organization</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="ml-2 flex-grow">
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage className="absolute !mt-0 ml-1 text-xs sm:!mt-1" />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isSubmitDisabled} type="submit">
            {isSubmitDisabled ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Loading</span>
              </>
            ) : (
              <span>Submit</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
