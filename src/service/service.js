const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzSjWIQVe8UK5GXT40mxCtHeiYXzkztnekOaJRFXKR29n3f9pa_QgjpXedd1UwaU_Izjw/exec";

export const submitScore = async (rollNumber, name, email, score) => {
    const formData = new FormData();
    formData.append("rollNumber", rollNumber.trim());
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("score", score);

    try {
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", // keep this to avoid CORS errors
            body: formData,
        });

        // No response accessible due to no-cors mode, assume success
        return { success: true };
    } catch (error) {
        console.error("Error submitting score:", error);
        throw new Error("Submission failed, please check your network.");
    }
};

