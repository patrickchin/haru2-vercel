/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
'use client';

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Footer from '../components/footer'
import Header from '../components/header'

function questionCountry() {
  return (
    <>
        <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
          Country
        </label>
        <div className="mt-2">
          <select
            id="country"
            name="country"
            autoComplete="country-name"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 max-w-xs text-sm leading-6"
          >
            <option>Kenya</option>
            <option>Canada</option>
            <option>Mexico</option>
            <option>China</option>
            <option>Pakistan</option>
          </select>
        </div>
    </>
  );
      
}

function questions() {
  return (
    <>
      <div className="flex flex-col space-y-2">
        <label htmlFor="about" className="text-sm font-medium text-gray-900">
          Lifestyle
        </label>
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>How many people will be living in the house?</li>
          <li>Are there any other specific lifestyle preferences or routines to consider?</li>
        </ul>
        <textarea
          name="lifestyle"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm"
          defaultValue={''}
        />
      </div>
      
      <div className="flex flex-col space-y-2">
        <label htmlFor="future" className="block text-sm font-medium text-gray-900">
          Future Plans
        </label>
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>Are there any plans for future expansions or modifications to the house?</li>
          <li>Do you have any long-term considerations, such as aging in place?</li>
        </ul>
        <textarea
          name="future"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm"
          defaultValue={''}
        />
      </div>


      <div className="flex flex-col space-y-2">
        <label htmlFor="budget" className="block text-sm font-medium text-gray-900">
          Budget and Timeline
        </label>
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>What is your budget for the project, including construction and materials?</li>
          <li>Is there a specific timeline or deadline for completing the project?</li>
        </ul>
        <textarea
          name="budget"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm"
          defaultValue={''}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="energy" className="block text-sm font-medium text-gray-900">
          Energy Efficiency and Sustainability
        </label>
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>Are you interested in incorporating energy-efficient or sustainable design elements?</li>
          <li>Do you have any preferences for eco-friendly materials?</li>
        </ul>
        <textarea
          name="energy"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm"
          defaultValue={''}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="technology" className="block text-sm font-medium text-gray-900">
          Technology Integratioy
        </label>
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>Are there specific technology features you would like to integrate into your home?</li>
          <li>Smart home systems, automation, etc.</li>
        </ul>
        <textarea
          name="technology"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm"
          defaultValue={''}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="outdoors" className="block text-sm font-medium text-gray-900">
          Outdoor Spaces
        </label>
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>Do you have any preferences for outdoor spaces such as gardens, patios, or decks?</li>
          <li>Are there specific views or orientations you would like to take advantage of?</li>
        </ul>
        <textarea
          name="outdoors"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm"
          defaultValue={''}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="security" className="block text-sm font-medium text-gray-900">
          Privacy and Security
        </label>
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>How important is privacy to you?</li>
          <li>Aretherespecificsecurityconsiderationsweshouldaddress?</li>
        </ul>
        <textarea
          name="security"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm"
          defaultValue={''}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="security" className="block text-sm font-medium text-gray-900">
          Regulatory and Zoning Requirement
        </label>
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>Are there any local zoning or regulatory requirements we need to consider in the design?</li>
          <li>Have you already obtained necessary permits for the construction?</li>
        </ul>
        <textarea
          name="security"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm"
          defaultValue={''}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="maintenance" className="block text-sm font-medium text-gray-900">
          Maintenance Preference
        </label>
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>Are there specific materials or finishes you prefer for ease of maintenance?</li>
          <li>What level of maintenance are you comfortable with for the long term?</li>
        </ul>
        <textarea
          name="maintenance"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm"
          defaultValue={''}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="special" className="block text-sm font-medium text-gray-900">
          Maintenance Preference
        </label>
        <ul className="list-disc list-inside text-sm text-gray-600">
          <li>Do you have any specific needs such as accessibility features or special accommodations?</li>
        </ul>
        <textarea
          name="special"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm"
          defaultValue={''}
        />
      </div>

      <div>
        <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
          Do you have any drawings to attach?
        </label>
        <p className="block text-sm text-gray-900">Archutectural docments, land survey documents, legal documents</p>

        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
            <div className="mt-4 flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>
    </>
  );
}

function Form() {
  return (
    <form className="flex flex-col space-y-8">

      {questions()}

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>

    </form>
  )
}


export default function Page() {
    return (
    <>
      <Header />
      <main className="flex flex-col w-screen mx-auto max-w-5xl">

        <section className="text-gray-600 body-font flex flex-col mx-auto space-y-8 mt-12 justify-center">
          
            <h1>New Job Posting</h1>
            {Form()}
          
        </section>

      </main>
      <Footer />
    </>
    )
}