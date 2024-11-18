import { useAuth } from "../context/auth";
import API from "../utils/api";

// Create a custom hook for easy access to GET and POST
const useAPI = () => {
    const { LogOut } = useAuth();

    const GET = async (url, params = {}, signal = null) => {
        try {
            const response = await API.get(url, { params, signal });
            return response;
        } catch (error) {
            handleError(error);
        }
    };

    const POST = async (url, data = {}, params = {}, signal = null) => {
        try {
            const response = await API.post(url, data, { params, signal });
            return response;
        } catch (error) {
            handleError(error);
        }
    };

    const handleError = (error) => {
        if (error.code === "ERR_CANCELED") {
            // console.error("[Request aborted] :", error.message);
        } else if (error.response) {
            // if (error.response.status === 403) LogOut(); //unauthorized
            console.error("[API request error] :", error.response.data?.message);
        } else {
            console.error("[Network or server error] :", error.message);
        }
        throw error;
    };

    return { GET, POST };
};

export default useAPI;