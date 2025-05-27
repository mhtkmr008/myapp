const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzv_kDsiK64ChkMK9VzgzkcLeMjeeqf5pJ1Y0r7y_SePjFtUssmDtsTXyNvPRBkBtoWsQ/exec";

export const submitScore = async (rollNumber, score) => {
    const formData = new FormData();
    formData.append("rollNumber", rollNumber.trim());
    formData.append("score", score);

    try {
        await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", // 🚨 Important for skipping CORS
            body: formData,
        });

        // Since no response is accessible, just assume it's okay
        return { success: true };
    } catch (error) {
        console.error("Error submitting score:", error);
        throw new Error("Submission failed, please check your network.");
    }
};
