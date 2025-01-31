// src/components/Button.tsx
import React from 'react';

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
    return (
        <button
            {...props}
            style={{
                padding: '0.8rem 1.5rem',
                backgroundColor: 'var(--accent-color)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-color-500)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-color)')}
        >
            {children}
        </button>
    );
};

export { Button };
