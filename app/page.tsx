'use client';

import Link from 'next/link';
import { Dispatch, MouseEventHandler, SetStateAction, useState } from 'react';
import SimpleLayout from '@/components/layout';

const linkStyle: string = "px-12 py-6 my-24 border border-gray-300 rounded-xl text-2xl text-center bg-gray-50 hover:bg-gray-300 hover:shadow";
const sectionStyle: string = "flex flex-col mx-auto my-auto py-12 justify-center";

function ChooseCountry({ setCountry } : { setCountry :  Dispatch<SetStateAction<null>> }) {

  const handleCountryButton: MouseEventHandler<HTMLButtonElement> = (e: any) => {
    setCountry(e.target.name);
  };

  const countries: string[] = ["Kenya", "Pakistan", "China"];

  return (<section className={sectionStyle}>
    <h1 className="text-4xl">Where do you want to build?</h1>
    <div className="grid grid-cols-3 gap-8 justify-center items-center">
      {countries.map((country) => (
        <button className={linkStyle} key={country.toLowerCase()} name={country.toLowerCase()} onClick={handleCountryButton}>{country}</button>
      ))}
    </div>
  </section>);
}

function ChooseStep({ country } : { country : string }) {

  const steps = [
    { key: "build", text: "Building Design", href: "/job-posting" },
    { key: "procure", text: "Procurement", href: "/" },
    { key: "track", text: "Track Your Build", href: "/" },
  ];

  return (<section className={sectionStyle}>
    <h1 className="text-4xl">Choose a build step</h1>
    <div className="grid grid-cols-3 gap-8 justify-center items-center">
      {steps.map((step) => (
        <Link
          href={{
            pathname: step.href,
            query: { country: country },
          }}
          className={linkStyle} key={step.key}
        >
          {step.text}
        </Link>
      ))}
    </div>
  </section>)
}

export default function Page() {
  const [country, setCountry] = useState(null);
  return (
    <SimpleLayout>
      {
        !country ? 
        <ChooseCountry setCountry={setCountry} /> :
        <ChooseStep country={country} />
      }
    </SimpleLayout>
  );
}
