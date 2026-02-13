import { useState, useRef, useEffect } from 'react';

interface CodeInputProps {
  length: number;
  onSubmit: (code: string) => void;
  disabled?: boolean;
}

export function CodeInput({ length, onSubmit, disabled }: CodeInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newDigits.every(d => d !== '')) {
      onSubmit(newDigits.join(''));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleClear() {
    setDigits(Array(length).fill(''));
    inputRefs.current[0]?.focus();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-3">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={disabled}
            className="w-14 h-16 text-center text-2xl font-mono font-bold bg-gray-900 border-2 border-gray-600 rounded-lg text-white focus:border-amber-400 focus:outline-none disabled:opacity-50"
          />
        ))}
      </div>
      <button
        onClick={handleClear}
        disabled={disabled}
        className="text-sm text-gray-400 hover:text-white underline disabled:opacity-50"
      >
        Clear
      </button>
    </div>
  );
}
