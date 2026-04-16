import { useState } from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const { backendUrl } = useAppContext();

    const signup = async ({ name, email, password, confirmPassword, branch, role }) => {
        const success = handleInputError({ name, email, password, confirmPassword, branch });
        if (!success) return;
        setLoading(true);
        try {
            const res = await fetch(`${backendUrl}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, branch, role })
            })
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            toast.success(data.autoApproved ? "Signup successful! You can now log in." : "Signup successful! Pending admin approval.");
        }
        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }
    };
    return { loading, signup };
}

function handleInputError({ name, email, password, confirmPassword, branch }) {
    if (!name || !email || !password || !confirmPassword || !branch) {
        toast.error('All fields are required');
        return false;
    }
    if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return false;
    }
    return true;
}


export default useSignup