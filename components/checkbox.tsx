interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-base font-normal leading-6">
      <input
        className="h-4 w-4 rounded-lg border-gray-300 bg-gray-100 text-green-400 accent-green-400 focus-visible:ring-2 focus-visible:ring-green-200"
        type="checkbox"
        checked={checked}
        onChange={onChange}
        id={label}
      />
      {label}
    </label>
  );
};

export default Checkbox;
