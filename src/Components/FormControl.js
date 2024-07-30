import React from "react";

//* Create FormControls component to be used in Login & Signup pages
export default function FormControls({ label, type, id, value, placeholder, setValue }) {
  return (
    <div className="pb-5 flex flex-col items-start w-full sm:w-[48%]">
      <label htmlFor={id} className="text-[#e1e1e1] text-[13px] pb-[6px] pl-1">
        <p>{label}</p>
        </label>
        <input
          className="bg-[#2e3e50] w-full placeholder:text-[#b9b9b9] text-[#e0e0e0] placeholder:text-[12px] text-[13px] placeholder:font-light h-[55px] border-none outline-none rounded-[12px] flex items-center px-6"
          onChange={(e) => setValue(e.target.value)}
          required
          value={value}
          type={type}
          name={id}
          id={id}
          placeholder={placeholder}
        />

    </div>
  );
}
