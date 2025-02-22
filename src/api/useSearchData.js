import { useState } from "react";

const useSearchData = (data) => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = data.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return { searchQuery, setSearchQuery, filteredData };
};

export default useSearchData;
