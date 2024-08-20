interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-base font-medium leading-6">
      <input
        className="focus-visible:ring-green-200 h-4 w-4 rounded-lg border-gray-300 bg-gray-100 text-green-400 accent-green-400 transition focus-visible:ring-2"
        type="checkbox"
        checked={checked}
        onChange={onChange}
        id={label}
      />
      {label}
    </label>
  );
}
