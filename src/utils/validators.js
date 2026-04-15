/**
 * Form validation utilities
 */

export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email format';
    return '';
  },

  password: (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain a number';
    return '';
  },

  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  },

  name: (name) => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    return '';
  },

  phone: (phone) => {
    if (!phone) return 'Phone is required';
    const phoneRegex = /^[\d\s+()-]{10,}$/;
    if (!phoneRegex.test(phone)) return 'Invalid phone format';
    return '';
  },

  url: (url) => {
    try {
      new URL(url);
      return '';
    } catch {
      return 'Invalid URL';
    }
  },

  number: (value, min = 0, max = Infinity) => {
    const num = parseFloat(value);
    if (isNaN(num)) return 'Must be a number';
    if (num < min) return `Must be at least ${min}`;
    if (num > max) return `Must be at most ${max}`;
    return '';
  },

  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return '';
  },
};

/**
 * Form validation hooks
 */
export const useFormValidation = (initialState, onSubmit) => {
  const [formData, setFormData] = React.useState(initialState);
  const [errors, setErrors] = React.useState({});

  const validateField = (name, value) => {
    // Custom validation can be added here
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return {
    formData,
    setFormData,
    errors,
    handleChange,
    handleSubmit,
  };
};
