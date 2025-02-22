import { useState } from "react";

const useUpdateData = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateData = async (id, updatedTask) => {
        setLoading(true);
        setError(null);
    
        try {
            const response = await fetch(`${url}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            const result = await response.json();
            return result; // Ensure the updated task is returned
        } catch (error) {
            setError(error.message);
            return null; // Return null on failure
        } finally {
            setLoading(false);
        }
    };

    return { updateData, loading, error };
};

export default useUpdateData;
