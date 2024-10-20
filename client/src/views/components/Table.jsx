import axiosInstance from "../../axiosInstance/axiosInstance";
import { useState, useEffect } from "react";

const Table = () => {
    const [data, setData] = useState([]);

    // Get the headers dynamically from the keys of the first object

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/users");
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        console.log("data", data);
    }, []);

    const headers = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {headers.map((key) => (
                            <th scope="col" className="px-6 py-3" key={key}>
                                {key}
                            </th>
                        ))}
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>

                {/* rest of the rows */}
                {/* <tbody>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                            Apple MacBook Pro 17"
                        </th>
                        <td className="px-6 py-4">Silver</td>
                        <td className="px-6 py-4">Laptop</td>
                        <td className="px-6 py-4">$2999</td>
                        <td className="px-6 py-4 text-right">
                            <a
                                href="#"
                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >
                                Edit
                            </a>
                        </td>
                    </tr>
                </tbody> */}

                <tbody>
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            {headers.map((key) => (
                                <td key={key} className="px-6 py-4">
                                    {key === "is_admin"
                                        ? item[key]
                                            ? "Admin"
                                            : "User"
                                        : item[key]}{" "}
                                    {/* Special formatting for boolean values */}
                                </td>
                            ))}
                            <td className="px-6 py-4 text-right">
                                <a
                                    href="#"
                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                    Edit
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
