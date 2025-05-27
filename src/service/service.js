const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzv_kDsiK64ChkMK9VzgzkcLeMjeeqf5pJ1Y0r7y_SePjFtUssmDtsTXyNvPRBkBtoWsQ/exec";

export const submitScore = async (rollNumber, score) => {
    const formData = new FormData();
    formData.append("rollNumber", rollNumber.trim());
    formData.append("score", score);

    try {
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: formData, // No headers needed, browser sets it automatically
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const result = await response.json(); // assuming script returns JSON
        return result;
    } catch (error) {
        console.error("Error submitting score:", error);
        throw new Error("Submission failed, please check your network or try again.");
    }
};
