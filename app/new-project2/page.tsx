"use client"

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FieldValues, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown } from 'lucide-react';
import SimpleLayout from '@/components/layout';
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { countries } from "content/countries";
import { buildingTypes } from 'content/buildingTypes';
import { submitProjectForm2 } from '@/lib/actions';
import { NewProjectFormSchema, NewProjectFormSchemaType, NewProjectFormType } from '@/lib/types';
import { questions } from 'content/questions';
import { cn } from '@/lib/utils';

function ProjectTitle({ form }:{ form: NewProjectFormType }) {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Project Title</FormLabel>
          <FormControl>
            <Input onChange={field.onChange} name={field.name} placeholder='Untitled'/>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function CountrySelector({ form }: { form: NewProjectFormType }) {
  return (
    <FormField
      control={form.control}
      name="country"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Country</FormLabel>
          <Select value={field.value} onValueChange={field.onChange} name={field.name}>
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
  const curBuildingSubtypeList = buildingTypes.find(v => v.type.startsWith(curBuildingType))?.subtypes;

  return (
    <div className="flex flex-row space-x-4">
      <FormField
        control={form.control}
        name="buildingType"
        render={({ field }) => (
          <FormItem className="w-1/2">
            <FormLabel>Building Industry</FormLabel>
            <Select onValueChange={field.onChange} name={field.name}>
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
      <FormField
        control={form.control}
        name="buildingSubtype"
        render={({ field }) => (
          <FormItem className={cn("w-1/2 transition-opacity duration-100", curBuildingSubtypeList ? "" : "opacity-0 invisible")}>
            <FormLabel>Building Type</FormLabel>
            <Select name={field.name} defaultValue={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger >
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {curBuildingSubtypeList?.map((t, i) => (
                  <SelectItem key={i} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
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
              className="resize-y h-36"
              {...form.register(field.name)}
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
            <Input type="file" multiple {...form.register(field.name)} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function DetailedQuestion({ form, qa }:{ form: NewProjectFormType, qa : any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={qa.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{qa.title}</FormLabel>
          {/* <FormDescription> */}
            <ul className="list-disc list-inside text-sm">
              {qa.hints.map((hint: string[], i: number) => (<li key={i}>{hint}</li>))}
            </ul>
          {/* </FormDescription> */}
          <FormControl>
            <Textarea
              placeholder=""
              className="resize-y"
              {...form.register(field.name)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

}

function DetailedQuestions({ form }:{ form: NewProjectFormType }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2"
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">
            Detailed Questions
          </h4>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        {questions.map((qa, i) =>
          <DetailedQuestion form={form} qa={qa} key={i} />)}
      </CollapsibleContent>
    </Collapsible>
  )
}

function NewProjectForm() {
  const session = useSession();

  const searchParams = useSearchParams();
  const countryParam: string | null = searchParams.get('country');
  const defaultCountry: string = countryParam && countries.some(c => c.value == countryParam.toLowerCase()) ? countryParam : "";

  // TODO save form data to local storage so it's not lost on refresh
  const form = useForm<NewProjectFormSchemaType>({
    resolver: zodResolver(NewProjectFormSchema),
    defaultValues: {
      country: defaultCountry,
    }
  })

  function handleSubmitProjectForm(data: FieldValues, event?: React.BaseSyntheticEvent) {
    const fdata = new FormData(event?.target);
    submitProjectForm2(fdata);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitProjectForm)} className="space-y-6" >
        <ProjectTitle form={form} />
        <CountrySelector form={form}/>
        <BuildingTypeSelector form={form} />
        <ProjectDescription form={form} />
        <ProjectDocuments form={form} />
        <DetailedQuestions form={form} />
        <div className="mt-6 flex items-center justify-end gap-x-3">
          {session.data?.user?
            <Button type="submit" >Submit</Button> :
            <Button disabled>Signin to Submit (TODO)</Button>
          }
        </div>
      </form>
    </Form>
  )
}

export default function Page() {
  return (
    <SimpleLayout>
      <section className="grow flex flex-col p-16 max-w-3xl">
        <h3 className='pb-10'>Create a New Project</h3>
        <NewProjectForm />
      </section>
    </SimpleLayout>
  )
}