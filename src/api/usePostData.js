import { useState } from "react";

const usePostData = (url) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const postData = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to post data");
            }
            return await response.json();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { postData, loading, error };
};

export default usePostData;