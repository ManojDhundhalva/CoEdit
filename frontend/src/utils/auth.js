export const setDataToLocalStorage = async (data) => {
    const { authToken, username, image } = data;
    
    // Set items in localStorage
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("username", username);
    localStorage.setItem("image", image);
    
    // Add a 0.5-second delay
    await new Promise((resolve) => setTimeout(resolve, 500));
};


export const clearLocalStorage = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("image");
}