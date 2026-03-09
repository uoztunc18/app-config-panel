import { getAuth } from "firebase/auth";

export const askSuggestion = async (country) => {
  try {
    const user = getAuth().currentUser;
    if (!user) {
      router.push("/signin");
      return;
    }
    const token = await user.getIdToken();

    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/ai`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ country: country }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    throw new Error(`Config service failed: ${err.message}`);
  }
};
