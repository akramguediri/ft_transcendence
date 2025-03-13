import getCSRFTokenFromCookies from './token/GetTokenFromCookies';
import API_URL from './config.js';
export const updatePassword = async (oldPassword, newPassword, newPasswordConfirm) => {
    const requestData = {
        old_pwd: oldPassword,
        new_pwd: newPassword,
        new_pwd_confirm: newPasswordConfirm,
    };

    try {
        const response = await fetch(`${API_URL}/usermanagement/updatePassword`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(requestData),
            headers: {
                'X-CSRFToken': getCSRFTokenFromCookies(),
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || 'Failed to update password');
        }

        return { success: true, message: 'Password updated successfully!' };
    } catch (error) {
        return { success: false, message: error.message || 'An unexpected error occurred' };
    }
};
