import { useState } from "react";
import { createCallLog } from "../../api/liaisoningAPIs/callLogs";

const LogCallForm = ({ hr, setLogForm, onSubmit }) => {
    // A single state object to hold all form data
    const [formData, setFormData] = useState({
        call_mode: "phone",
        call_outcome: "spoken",
        hiring_tag: "neutral",
        contact_id: hr.contact_id,
        conversation_summary: "",
        remarks: "",
        next_follow_up_date: "",
        call_timestamp: new Date().toISOString().slice(0, 16),
        recruitment_cycle: "2025-26"
    });

    // A single handler to update state for any form field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle the form submission
    const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting:", formData);

  try {
    await createCallLog(formData);
    onSubmit();
    setLogForm(false);
  } catch (error) {
    console.error("Failed to create call log:", error);
    alert(error.response?.data?.message || "Something went wrong, please try again.");
  }
};


    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="p-6 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Log Call for {hr.full_name}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Fill in the details of your interaction with {hr.company}.
                            </p>
                        </div>
                        <button
                            onClick={() => setLogForm(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 bg-gray-50 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Call Mode Dropdown */}
                            <div>
                                <label htmlFor="call_mode" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Call Mode
                                </label>
                                <select
                                    id="call_mode"
                                    name="call_mode"
                                    value={formData.call_mode}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                >
                                    <option value="phone">Phone</option>
                                    <option value="email">Email</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="other">Other</option>
                                </select>


                            </div>

                            {/* Call Outcome Dropdown */}
                            <div>
                                <label
                                    htmlFor="call_outcome"
                                    className="block text-sm font-semibold text-gray-700 mb-1"
                                >
                                    Call Outcome <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="call_outcome"
                                    name="call_outcome"
                                    value={formData.call_outcome}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                    required
                                >
                                    <option value="spoken">Spoken</option>
                                    <option value="didnt pick">Didn't Pick</option>
                                    <option value="not reachable">Not Reachable</option>
                                    <option value="switch off">Switch Off</option>
                                </select>
                            </div>

                            {/* Hiring Tag Dropdown */}
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="hiring_tag"
                                    className="block text-sm font-semibold text-gray-700 mb-1"
                                >
                                    Hiring Tag <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="hiring_tag"
                                    name="hiring_tag"
                                    value={formData.hiring_tag}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                    required
                                >
                                    <option value="confirmed">Confirmed</option>
                                    <option value="positive">Positive</option>
                                    <option value="negative">Negative</option>
                                    <option value="neutral">Neutral</option>
                                </select>
                            </div>

                            {/* --- CONDITIONAL FOLLOW-UP DATE FIELD --- */}
                            {(formData.call_outcome === "spoken" && formData.hiring_tag !== "confirmed" && formData.hiring_tag !== "negative") && (
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="next_follow_up_date"
                                        className="block text-sm font-semibold text-gray-700 mb-1"
                                    >
                                        Next Follow-up Date
                                    </label>
                                    <input
                                        type="date"
                                        id="next_follow_up_date"
                                        name="next_follow_up_date"
                                        value={formData.next_follow_up_date}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                    />
                                </div>
                            )}


                            <div className="md:col-span-2">
                                <label htmlFor="conversation_summary" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Conversation Summary <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="conversation_summary"
                                    name="conversation_summary"
                                    rows="4"
                                    value={formData.conversation_summary}
                                    onChange={handleChange}
                                    placeholder="Enter your raw notes here..."
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                    required
                                ></textarea>
                            </div>

                            {/* Internal Remarks Textarea */}
                            <div className="md:col-span-2">
                                <label htmlFor="remarks" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Internal Remarks (Optional)
                                </label>
                                <textarea
                                    id="remarks"
                                    name="remarks"
                                    rows="3"
                                    value={formData.remarks}
                                    onChange={handleChange}
                                    placeholder="e.g., Very polite, may need faculty push..."
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer with Buttons */}
                    <div className="flex justify-end items-center gap-3 p-4 bg-white border-t">
                        <button
                            type="button"
                            onClick={() => setLogForm(false)}
                            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-teal-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-600"
                        >
                            Submit Log
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LogCallForm;