"use client";

import { Plus } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { useState } from "react";

export default function SimpleInput({
  placeholder,
  label,
  onAdd,
}: {
  placeholder: string;
  label: string;
  onAdd: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    onAdd(value);
    setValue("");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  return (
    <div className="flex gap-2 mb-8">
      <Input
        type="text"
        placeholder={placeholder}
        className="flex-1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleInputKeyDown}
      />
      <Button size="icon" onClick={submit}>
        <Plus className="h-4 w-4" />
        <span className="sr-only">{label}</span>
      </Button>
    </div>
  );
}
