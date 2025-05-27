import { useState } from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder = '',
  error = '',
  helper = '',
  value,
  onChange,
  required = false,
  className = '',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-error-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-4 py-3 rounded-md border shadow-sm placeholder-gray-400 
            transition-all duration-200
            ${error 
              ? 'border-error-500 focus:ring-error-500 focus:border-error-500' 
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            }
            ${isFocused ? 'ring-2 ring-primary-500' : ''}
            focus:outline-none
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
      
      {!error && helper && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
}