document.addEventListener("DOMContentLoaded", function() {
    const exceptions = [
        "a", "an", "the", "and", "but", "or", "for", "nor", "on",
        "at", "to", "by", "with", "of", "in", "up", "down", "from", "are", "is", "was"
    ];

    const abbreviations = ["AI", "CBI", "NASA", "FBI"]; // Add more abbreviations as needed

    const capitalizeInput = (text) => {
        return text.split(/(\s+|-|\.)/) // Split by spaces, hyphens, and dots
                   .map((segment, index) => {
                       const lowerCaseSegment = segment.toLowerCase();
                       if (index === 0 || exceptions.indexOf(lowerCaseSegment) === -1) {
                           const isAbbreviation = abbreviations.includes(lowerCaseSegment.toUpperCase());
                           return isAbbreviation ? segment.toUpperCase() : segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
                       } else {
                           return lowerCaseSegment;
                       }
                   })
                   .join('');
    };

    const processText = (text) => {
        const lines = text.split('\n');
        return lines.map((line) => {
            if (line.startsWith('Q.') || line.startsWith('Answer:') || line.startsWith('Explanation:')) {
                return line; // do it anythink q or question 
            } else if (line.startsWith('Question:')) {
                return line.replace('Question:', 'Q.');
            }
                else if (!line.startsWith('Q.') && !line.startsWith('Question:') && !line.startsWith('Answer:') && !line.startsWith('Explanation:')) {
                    return line; // Return other lines unchanged
            }

            const parts = line.split(':');
            if (parts.length > 1) {
                const prefix = parts[0].trim();
                const content = parts.slice(1).join(':').trim();
                return `${prefix}: ${capitalizeInput(content)}`;
            }

            return capitalizeInput(line); //reset text 
        }).join('\n');
    };

    const inputTextarea = document.getElementById("textarea1");
    const outputTextarea = document.getElementById("textarea2");
    const copyBtn = document.getElementById("copyBtn");

    const adjustHeight = (textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    };

    inputTextarea.addEventListener("input", function(e) {
        const text = e.target.value;
        const processedText = processText(text);
        outputTextarea.value = processedText;
        adjustHeight(inputTextarea);
        adjustHeight(outputTextarea);

       //copy button part 
        if (processedText.trim().length > 0) {
            copyBtn.style.display = 'block';
        } else {
            copyBtn.style.display = 'none';
        }
    });

    //copy the clipboard from textarea 
    copyBtn.addEventListener("click", function() {
        outputTextarea.select();
        document.execCommand("copy");
        alert("Copied to clipboard!");
    });

    // Initial processing in case there's pre-existing text
    const initialText = inputTextarea.value.trim();
    if (initialText.length > 0) {
        outputTextarea.value = processText(initialText);
        copyBtn.style.display = 'block';
    }

    // Adjust textarea heights initially
    adjustHeight(inputTextarea);
    adjustHeight(outputTextarea);
});
