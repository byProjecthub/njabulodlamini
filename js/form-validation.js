/* ========================================
   Form Validation & AJAX Submission
   ======================================== */

(function() {
    'use strict';

    // ========================================
    // Form Validation
    // ========================================

    function initFormValidation() {
        const forms = document.querySelectorAll('form[data-validate]');

        forms.forEach(form => {
            form.addEventListener('submit', handleFormSubmit);

            // Real-time validation on blur
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => clearError(input));
            });
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');

        clearError(field);

        if (required && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }

        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }

        if (type === 'tel' && value) {
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            if (!phoneRegex.test(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }

        if (field.minLength && value.length < field.minLength) {
            showFieldError(field, `Minimum ${field.minLength} characters required`);
            return false;
        }

        return true;
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        field.style.borderColor = '#ef4444';

        // Remove existing error message
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) existingError.remove();

        // Add error message
        const errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.textContent = message;
        errorEl.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 6px;
            display: block;
        `;
        field.parentElement.appendChild(errorEl);
    }

    function clearError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';
        const errorEl = field.parentElement.querySelector('.field-error');
        if (errorEl) errorEl.remove();
    }

    // ========================================
    // Form Submission with AJAX
    // ========================================

    function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;

        // Validate all fields
        const inputs = form.querySelectorAll('input[required], textarea[required], input[type="email"]');
        let isValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            if (window.showToast) {
                window.showToast('Please fix the errors in the form', 'error');
            }
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px;display:inline-block;margin-right:8px;"></span> Sending...';
        submitBtn.disabled = true;

        // Submit form via AJAX
        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            if (data.status === 'success') {
                form.reset();
                if (window.showToast) {
                    window.showToast(data.message || 'Message sent successfully!', 'success');
                }
            } else {
                if (window.showToast) {
                    window.showToast(data.message || 'Something went wrong. Please try again.', 'error');
                }
            }
        })
        .catch(error => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            if (window.showToast) {
                window.showToast('Network error. Please try again.', 'error');
            }
            console.error('Form submission error:', error);
        });
    }

    // ========================================
    // Initialize
    // ========================================

    document.addEventListener('DOMContentLoaded', initFormValidation);

})();
