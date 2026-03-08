// frontend/src/services/api.js

export const queryMedicalSystem = async (queryText) => {
  try {
    // Connect to your Python Backend (Port 8000)
    const response = await fetch("http://127.0.0.1:8000/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: queryText }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Connection failed:", error);
    throw error; // Pass error back to UI to show the red alert box
  }
};