"use client"
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSearchParams } from 'next/navigation'

export function CountrySelector2() {
  const searchParams = useSearchParams();
  const search: string | null = searchParams.get('country');
  const countries: string[] = [
    "Kenya", "China", "Pakistan"
  ];
  const defaultCountry = (search && countries.includes(search)) ? search : "";
  return (
    <select name="country" defaultValue={defaultCountry} className="text-lg p-3 border rounded-md">
      {countries.map((c, i) => <option key={i} value={c.toLocaleLowerCase()}>{c}</option>)}
    </select>
  );
}

export default function CountrySelector() {
  const searchParams = useSearchParams();
  const search: string | null = searchParams.get('country');
  const countries: string[] = [
    "Kenya", "China", "Pakistan"
  ];
  const defaultCountry = (search && countries.includes(search)) ? search : "";

  return (
    <RadioGroup name="country" defaultValue={defaultCountry} className="flex flex-row space-x-4">
      {countries.map((c, i) =>
        <div key={i} className="flex items-center space-x-2">
          <RadioGroupItem value={c.toLocaleLowerCase()} id={`country-selector-${c}`} />
          <Label htmlFor={`country-selector-${c}`} className="text-lg">{c}</Label>
        </div>
      )}
    </RadioGroup>
  );
}