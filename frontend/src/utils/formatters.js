import moment from "moment";

export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    // Extract time part
    const timeOptions = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };
    const time = date.toLocaleString("en-US", timeOptions); // e.g., "2:30 PM"

    // Extract date part
    const dateOptions = {
        day: "numeric",
        month: "short", // e.g. "Sep"
        year: "numeric",
    };
    const formattedDate = date.toLocaleString("en-US", dateOptions); // e.g., "9 Sep, 2020"

    return `${time} ${formattedDate}`;
};

export const formatLogTimestamp = (date) => {
    const options = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    };

    const formattedDate = new Date(date).toLocaleString('en-US', options);
    const milliseconds = String(new Date(date).getMilliseconds()).padStart(3, '0'); // Ensures 3 digits

    return `${formattedDate}, ${milliseconds}ms`;
}

export const DateFormatter = (dateString) => {
    // Convert and format the date using moment
    const formattedDate = moment(dateString).format("MMMM D, YYYY, h:mm A");
    return formattedDate;
};

// Convert time to minutes and seconds format
export const formatTimeMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
