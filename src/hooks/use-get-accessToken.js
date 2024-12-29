export const useGetAccessToken=()=>{
    // Retrieve and parse the access token from localStorage
    const session = localStorage.getItem("session");
    if (!session) {
        throw new Error("Session data is not available in localStorage");
    }

    const { access_token } = JSON.parse(session); // Destructure the access_token
    if (!access_token) {
        return "Access token is missing in session data";
    }

    return access_token;
}