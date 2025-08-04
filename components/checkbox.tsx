interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-base leading-6 font-medium">
      <input
        className="h-4 w-4 rounded-lg border-gray-300 bg-gray-100 text-green-400 accent-green-400 transition focus-visible:ring-2 focus-visible:ring-green-200"
        type="checkbox"
        checked={checked}
        onChange={onChange}
        id={label}
      />
      {label}
    </label>
  );
}
