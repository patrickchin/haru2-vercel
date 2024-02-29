"use client"

import { useSearchParams } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import SimpleLayout from '@/components/layout';
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries } from "content/countries";
import { buildingTypes } from 'content/buildingTypes';
import { submitProjectForm2 } from '@/lib/actions';
import { NewProjectFormSchema, NewProjectFormSchemaType, NewProjectFormType } from '@/lib/types';

function CountrySelector({ form }: { form: NewProjectFormType }) {

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
          <Select defaultValue={defaultCountry} onValueChange={field.onChange} name={field.name}>
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
  );
}

function BuildingTypeSelector({ form }: { form: NewProjectFormType }) {

  const curBuildingType: string = form.watch("buildingType");
  const curBuildingSubtypeList: string[] | undefined = buildingTypes.find((v) => v.type.startsWith(curBuildingType))?.subtypes;

  return (
    <>
      <FormField
        control={form.control}
        name="buildingType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Building Industry</FormLabel>
            <Select defaultValue={field.value} onValueChange={field.onChange} name={field.name}>
              <FormControl>
                <SelectTrigger >
                  <SelectValue placeholder="Select a category"/>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {buildingTypes.map((t, i) => (
                  <SelectItem key={i} value={t.type}>{t.type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {curBuildingSubtypeList &&
        <FormField
          control={form.control}
          name="buildingSubtype"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Building Type</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange} name={field.name}>
                <FormControl>
                  <SelectTrigger >
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {curBuildingSubtypeList.map((t, i) => (
                    <SelectItem key={i} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      }
    </>
  );
}

function ProjectDescription({ form }:{ form: NewProjectFormType }) {
  return (
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
  )
}

function ProjectDocuments({ form }:{ form: NewProjectFormType }) {
  return (
    <FormField
      control={form.control}
      name="files"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Additional Documents</FormLabel>
          <FormControl>
            <Input type="file" multiple {...form.register(field.name)} name={field.name} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function NewProjectForm() {
  const form = useForm<NewProjectFormSchemaType>({
    resolver: zodResolver(NewProjectFormSchema),
  })

  return (
    <Form {...form}>
      <form action={submitProjectForm2} className="w-2/3 space-y-6">
        <CountrySelector form={form}/>
        <BuildingTypeSelector form={form} />
        <ProjectDescription form={form} />
        <ProjectDocuments form={form} />
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
          Create a New Project
        </h2>
        <NewProjectForm />
      </section>
    </SimpleLayout>
  )
}