import { iconLibrary } from './assets/icons.js';

//  SELECTORS
const iconGrid = document.getElementById('icon-grid');
const iconSearch = document.getElementById('icon-search');
const currentIconDisplay = document.getElementById('current-icon');
const copyBtn = document.getElementById('copy-btn');
const categorySelect = document.getElementById('category-select');
const templateButtons = document.querySelectorAll('.template-btn');
const emailCanvas = document.getElementById('email-canvas'); // Central target for copy/templates
const resetBtn = document.getElementById('reset-btn');

//  TEMPLATE DATA (Matches your 4 categories)
const emailTemplates = {
    announcement: { icon: "📢", title: "Company Announcement", body: "We have some exciting news to share! Our team has reached a major milestone.", color: "#f3f2f1" },
    invite: { icon: "📅", title: "You're Invited!", body: "Join us for our upcoming team networking event this Friday.", color: "#e1f5fe" },
    alert: { icon: "⚠️", title: "Urgent: Weather Update", body: "Due to hazardous conditions, the office is closed today. Please work remotely.", color: "#fff4ce" },
    congrats: { icon: "🎉", title: "Kudos to the Team!", body: "Celebrating the successful launch of our latest project. Great job everyone!", color: "#dff6dd" }
};

//  RENDER ICONS (Search & Filter Logic)
function renderIcons() {
    const searchTerm = iconSearch.value.toLowerCase();
    const selectedCategory = categorySelect.value;
    iconGrid.innerHTML = ""; 

    const filtered = iconLibrary.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    filtered.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('icon-item');
        div.innerText = item.char;
        div.title = item.name;

        div.onclick = () => {
            currentIconDisplay.innerText = item.char;
            currentIconDisplay.classList.add('pop-effect');
            setTimeout(() => currentIconDisplay.classList.remove('pop-effect'), 200);
        };
        iconGrid.appendChild(div);
    });
}

//  COPY LOGIC (Captures the 60px/28px HTML)
async function copyTemplateToClipboard() {
    // We grab the HTML from inside the emailCanvas
    const htmlContent = emailCanvas.innerHTML; 
    const plainText = emailCanvas.innerText;   

    try {
        const clipboardItem = new ClipboardItem({
            "text/html": new Blob([htmlContent], { type: "text/html" }),
            "text/plain": new Blob([plainText], { type: "text/plain" })
        });
        await navigator.clipboard.write([clipboardItem]);

        const toast = document.getElementById('copy-toast');
        if (toast) {
            toast.style.display = 'block';
            setTimeout(() => { toast.style.display = 'none'; }, 8000);
        }
    } catch (err) { console.error("Copy failed!", err); }
}

// TEMPLATE PICKER LOGIC (Preserves Font Sizes)
templateButtons.forEach(button => {
    button.addEventListener('click', () => {
        const type = button.getAttribute('data-type');
        const selected = emailTemplates[type];
        
        if (selected) {
            const h1 = emailCanvas.querySelector('h1');
            const p = emailCanvas.querySelector('p');

            // 1. Update text using textContent
            h1.textContent = selected.title;
            p.textContent = selected.body;

            // 2. FORCE the font sizes to stay (Fixes the 12px bug)
            h1.style.fontSize = "72px";
            p.style.fontSize = "40px";
            
            // 3. Keep existing styles
            h1.style.color = "#0078d4";
            h1.style.fontWeight = "800";
            p.style.color = "#605e5c";
            
            currentIconDisplay.innerText = selected.icon;
            document.getElementById('icon-display-circle').style.backgroundColor = selected.color;

            // UI Update for Buttons
            templateButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        }
    });
});



const editableFields = document.querySelectorAll('[contenteditable="true"]');
const wordCountDisplay = document.getElementById('word-count-display');

// The function that calculates the words
function updateWordCount() {
    let combinedText = "";

    // Loop through both the Title and the Body to get all text
    editableFields.forEach(field => {
        combinedText += " " + field.innerText;
    });

    // Clean up the text: trim spaces and split by any whitespace
    const words = combinedText.trim().split(/\s+/).filter(word => word.length > 0);
    const count = words.length;

    // Update the HTML display
    wordCountDisplay.innerText = `Words: ${count}`;

    // Optional: Visual cue if they go over 50 words
    if (count > 50) {
        wordCountDisplay.style.color = "#d83b01"; // Outlook Error Red
        wordCountDisplay.style.fontWeight = "bold";
    } else {
        wordCountDisplay.style.color = "#605e5c"; // Standard Grey
        wordCountDisplay.style.fontWeight = "normal";
    }
}

// Attach the "input" listener to each field
editableFields.forEach(field => {
    field.addEventListener('input', updateWordCount);
});

// Run once on page load so it shows the initial count
updateWordCount();






resetBtn.addEventListener('click', () => {
    const h1 = emailCanvas.querySelector('h1');
    const p = emailCanvas.querySelector('p');

    // 1. Force the original text back
    h1.textContent = "Announcement Title";
    p.textContent = "Click here to edit your message. This announcement is designed to look great in Outlook!";

    // 2. Force the massive 60px/28px sizes back (The "Forced" fix!)
    h1.style.fontSize = "60px";
    p.style.fontSize = "28px";
    
    // 3. Reset the icon and circle color
    currentIconDisplay.innerText = "📢";
    document.getElementById('icon-display-circle').style.backgroundColor = "#f3f2f1";

    // 4. Reset the Template Buttons UI
    templateButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-type="announcement"]').classList.add('active');

    // 5. Hide the copy toast if it's visible
    document.getElementById('copy-toast').style.display = 'none';

    console.log("Template Reset!");
});


//  EVENT LISTENERS
iconSearch.addEventListener('input', renderIcons);
categorySelect.addEventListener('change', renderIcons);
copyBtn.addEventListener('click', copyTemplateToClipboard);

// 7. INITIALIZE
renderIcons();

