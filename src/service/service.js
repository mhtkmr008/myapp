const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxVo6uEJhfjZ2ZgU2NFa5Eq98QD6aHvIFgxERl9huiMX8bhnzhQIz4W6rJXpV4X7XEv6g/exec";

export const submitScore = async (rollNumber, score) => {
    const dataToSend = { rollNumber: rollNumber.trim(), score };

    try {
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error submitting score:", error);
        throw new Error("Submission failed, please check your network or try again.");
    }
};