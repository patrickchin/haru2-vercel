"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod"
import { UseFormReturn, useForm } from "react-hook-form"
import { z } from "zod"
import SimpleLayout from '@/components/layout';
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries } from "content/countries";

function allFilesSmall(list: FileList | undefined) {
  if (list === undefined) return true;
  return Array.from(list).every((f: any) => f.size < 4_500_000);
}

const FormSchema = z.object({
  country: z.string(),
  designFiles: z.any().transform((f) => f as FileList).optional().refine(allFilesSmall),
  legalFiles: z.any().transform((f) => f as FileList).optional().refine(allFilesSmall),
  description: z.string().min(3),
})
type FormSchemaType = z.infer<typeof FormSchema>;

function CountrySelector({ form }: { form: UseFormReturn<FormSchemaType> }) {

  const searchParams = useSearchParams();
  const countryParam: string | null = searchParams.get('country');
  const defaultCountry: string = countryParam && countries.some(c => c.value == countryParam.toLowerCase()) ? countryParam : "";

  return (
    <FormField
      control={form.control}
      name="country"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Country</FormLabel>
          <Select defaultValue={defaultCountry} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {countries.map((c, i) => <SelectItem key={i} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function NewProjectForm() {

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: FormSchemaType) {
    console.log(data);
    // const { url } = await put('articles/blob.txt', 'Hello World!', {
    //   access: 'public',
    //   token: 'vercel_blob_rw_RZEAI2El6QqESEXV_PCDS238bzWkF2bA4wQK98Sa3EeR02b'
    // });
    // console.log("uploaded to ", url);
    // router.push("/");
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

        <CountrySelector form={form}/>

        <FormField
          control={form.control}
          name="designFiles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Design Documents</FormLabel>
              <FormControl>
                <Input type="file" multiple {...form.register(field.name)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="legalFiles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Legal Documents</FormLabel>
              <FormControl>
                <Input type="file" multiple {...form.register(field.name)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about your project"
                  className="resize-none"
                  name={field.name} 
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-6 flex items-center justify-end gap-x-3">
          <Button type="submit" >Submit</Button>
        </div>
      </form>
    </Form>
  )
}

export default function Page() {

  return (
    <SimpleLayout>
      <section className="grow flex flex-col text-gray-600 bg-white shadow-xl p-16">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-6">
          New Project
        </h2>
        <NewProjectForm />
      </section>
    </SimpleLayout>
  )
}