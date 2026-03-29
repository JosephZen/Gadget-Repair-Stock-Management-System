import Swal from 'sweetalert2';

// SwiftToast configuration for consistent "premium" toast alerts
const SwiftToast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

/**
 * Standard Success Alert
 * @param {string} title - The title of the alert 
 * @param {string} text - The optional description
 */
export const showSuccessAlert = (title, text = '') => {
    SwiftToast.fire({
        icon: 'success',
        title: title,
        text: text,
        background: '#fff',
        color: '#2e7d32', // MUI Success green
        iconColor: '#2e7d32',
    });
};

/**
 * Standard Error Alert
 * @param {string} title - The title of the alert
 * @param {string} text - The optional description
 */
export const showErrorAlert = (title, text = '') => {
    SwiftToast.fire({
        icon: 'error',
        title: title,
        text: text,
        background: '#fff',
        color: '#d32f2f', // MUI Error red
        iconColor: '#d32f2f',
    });
};

/**
 * Standard Info Alert for modules coming soon
 * @param {string} title - The module name or title
 */
export const showInfoAlert = (title) => {
    SwiftToast.fire({
        icon: 'info',
        title: title,
        text: 'This module is coming soon in a future update!',
        background: '#fff',
        color: '#0288d1', // MUI Info blue
        iconColor: '#0288d1',
    });
};

/**
 * Premium Confirmation Dialog for Deletion
 * @param {string} title - The title of the alert
 * @param {string} text - The warning subtext
 * @returns {Promise<boolean>} - Resolves to true if confirmed
 */
export const showConfirmDelete = async (title = 'Are you sure?', text = "You won't be able to revert this!") => {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d32f2f', // MUI Error red
        cancelButtonColor: '#757575',  // Grey
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        background: '#fff',
        borderRadius: '15px',
        customClass: {
            popup: 'premium-swal-popup',
            confirmButton: 'premium-swal-confirm',
            cancelButton: 'premium-swal-cancel'
        }
    });
    return result.isConfirmed;
};

export default SwiftToast;
