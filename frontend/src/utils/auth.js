export const setDataToLocalStorage = (data) => {
    const { authToken, username, image } = data;
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("username", username);
    localStorage.setItem("image", image);
}

export const clearLocalStorage = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("image");
}