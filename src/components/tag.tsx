import React from "react";

interface TagProps {
  title: string;
  body: string;
}

export default function Tag({ title }: TagProps) {
  return (
    <button className="px-4 py-2 outline rounded-full m-1.5 text-center text-sm hover:bg-black hover:text-white focus:bg-black focus:outline-none focus:text-white text-slate-700">
      {title}
    </button>
  );
}
