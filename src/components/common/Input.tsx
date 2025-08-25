import React from 'react';

interface InputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder, 
  required = false,
  disabled = false,
  min, 
  max,
  step,
  error,
  className = ''
}) => {
  const inputId = `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        } ${
          disabled 
            ? 'bg-gray-100 cursor-not-allowed text-gray-500' 
            : 'bg-white'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};