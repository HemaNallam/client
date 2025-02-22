import { useState } from "react";

const useDeleteData = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteData = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${url}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            return true; // Ensure success flag is returned
        } catch (error) {
            setError(error.message);
            return false; // Return failure flag
        } finally {
            setLoading(false);
        }
    };

    return { deleteData, loading, error };
};

export default useDeleteData;
