export const useFetchModalData = async (apiUrl) => {
    try {
        const session = localStorage.getItem("session");
        if (!session) {
        throw new Error("Session data is not available in localStorage");
        }

        const { access_token } = JSON.parse(session); // Destructure the access_token
        if (!access_token) {
        throw new Error("Access token is missing in session data");
        }
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${authToken}`,
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const result = await response.json();
      return { title: result.title || "Untitled", content: result.content || "No content available." };
    } catch (error) {
      throw error;
    }
  };