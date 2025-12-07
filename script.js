// DOM Elements
const form = document.getElementById('obituaryForm');
const steps = document.querySelectorAll('.form-section');
const progressSteps = document.querySelectorAll('.progress-step');

// State
let currentStep = 1;
let dateInputType = 'gregorian';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
    initializeDateToggle();
    initializeEndearmentToggle();
    initializeShivaLocationToggle();
    HebrewDate.initHebrewDateSelectors();
    initializeDateConversion();
    setDefaultDate();
});

// Initialize Form
function initializeForm() {
    // Set today's date as default
    const today = new Date();
    const dateInput = document.getElementById('deathDateGregorian');
    dateInput.value = today.toISOString().split('T')[0];
    
    // Update converted date
    updateConvertedDate();
}

// Set Default Date
function setDefaultDate() {
    const today = new Date();
    const dateInput = document.getElementById('deathDateGregorian');
    dateInput.value = today.toISOString().split('T')[0];
    updateConvertedDate();
}

// Initialize Date Toggle
function initializeDateToggle() {
    const toggleButtons = document.querySelectorAll('.date-toggle');
    const gregorianGroup = document.getElementById('gregorianDate');
    const hebrewGroup = document.getElementById('hebrewDate');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            dateInputType = btn.dataset.type;
            
            if (dateInputType === 'gregorian') {
                gregorianGroup.classList.remove('hidden');
                hebrewGroup.classList.add('hidden');
            } else {
                gregorianGroup.classList.add('hidden');
                hebrewGroup.classList.remove('hidden');
            }
            
            updateConvertedDate();
        });
    });
}

// Initialize Endearment Toggle
function initializeEndearmentToggle() {
    const endearmentSelect = document.getElementById('endearment');
    const customGroup = document.getElementById('customEndearmentGroup');
    
    endearmentSelect.addEventListener('change', () => {
        if (endearmentSelect.value === 'custom') {
            customGroup.classList.remove('hidden');
            document.getElementById('customEndearment').focus();
        } else {
            customGroup.classList.add('hidden');
        }
    });
}

// Initialize Shiva Location Toggle
function initializeShivaLocationToggle() {
    const shivaLocationSelect = document.getElementById('shivaLocation');
    const customGroup = document.getElementById('customShivaLocationGroup');
    
    shivaLocationSelect.addEventListener('change', () => {
        if (shivaLocationSelect.value === 'custom') {
            customGroup.classList.remove('hidden');
            document.getElementById('customShivaLocation').focus();
        } else {
            customGroup.classList.add('hidden');
        }
    });
}

// Initialize Date Conversion
function initializeDateConversion() {
    const gregorianInput = document.getElementById('deathDateGregorian');
    const hebrewDay = document.getElementById('hebrewDay');
    const hebrewMonth = document.getElementById('hebrewMonth');
    const hebrewYear = document.getElementById('hebrewYear');
    
    gregorianInput.addEventListener('change', updateConvertedDate);
    hebrewDay.addEventListener('change', updateConvertedDate);
    hebrewMonth.addEventListener('change', updateConvertedDate);
    hebrewYear.addEventListener('change', updateConvertedDate);
}

// Update Converted Date Display
function updateConvertedDate() {
    const display = document.getElementById('convertedDateDisplay');
    
    if (dateInputType === 'gregorian') {
        const gregorianInput = document.getElementById('deathDateGregorian');
        if (gregorianInput.value) {
            const hebrewDate = HebrewDate.gregorianToHebrew(gregorianInput.value);
            if (hebrewDate) {
                display.textContent = hebrewDate.formatted;
            } else {
                display.textContent = '-';
            }
        } else {
            display.textContent = '-';
        }
    } else {
        const day = document.getElementById('hebrewDay').value;
        const month = document.getElementById('hebrewMonth');
        const year = document.getElementById('hebrewYear').value;
        
        if (day && month.value && year) {
            const monthName = month.options[month.selectedIndex].text;
            display.textContent = `${HebrewDate.hebrewDays[day - 1]} ${monthName} ${HebrewDate.numberToHebrewYear(parseInt(year))}`;
        } else {
            display.textContent = '-';
        }
    }
}

// Navigate to Step
function goToStep(step) {
    // Validate before proceeding
    if (step > currentStep && !validateStep(currentStep)) {
        return;
    }
    
    currentStep = step;
    
    // Update step visibility
    steps.forEach((s, index) => {
        s.classList.remove('active');
        if (index + 1 === step) {
            s.classList.add('active');
        }
    });
    
    // Update progress indicators
    progressSteps.forEach((p, index) => {
        p.classList.remove('active', 'completed');
        if (index + 1 === step) {
            p.classList.add('active');
        } else if (index + 1 < step) {
            p.classList.add('completed');
        }
    });
    
    // Generate preview for steps 2 and 3
    if (step === 2 || step === 3) {
        generatePreview();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Validate Step
function validateStep(step) {
    if (step === 1) {
        const openingLine = document.getElementById('openingLine').value;
        const fullName = document.getElementById('fullName').value;
        
        if (!openingLine) {
            alert('נא לבחור שורת פתיחה');
            document.getElementById('openingLine').focus();
            return false;
        }
        
        if (!fullName.trim()) {
            alert('נא להזין את שם הנפטר/ת');
            document.getElementById('fullName').focus();
            return false;
        }
        
        return true;
    }
    
    return true;
}

// Get Form Data
function getFormData() {
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const endearmentSelect = document.getElementById('endearment');
    let endearment = endearmentSelect.value;
    
    if (endearment === 'custom') {
        endearment = document.getElementById('customEndearment').value;
    } else if (endearment) {
        // Adjust endearment based on gender (with ה הידיעה)
        if (gender === 'female') {
            const femaleEndearments = {
                'האהוב': 'האהובה',
                'היקר': 'היקרה',
                'האהוב והיקר': 'האהובה והיקרה',
                'היקיר': 'היקירה'
            };
            endearment = femaleEndearments[endearment] || endearment;
        }
    }
    
    // Get frame style
    const frameStyle = document.getElementById('frameStyle').value;
    
    // Get opening line and adjust for gender
    let openingLine = document.getElementById('openingLine').value;
    if (gender === 'female') {
        openingLine = openingLine.replace('פטירתו/פטירתה', 'פטירתה');
    } else {
        openingLine = openingLine.replace('פטירתו/פטירתה', 'פטירתו');
    }
    
    // Get dates
    let gregorianDate = '';
    let hebrewDate = '';
    let dayOfWeek = '';
    
    const gregorianInput = document.getElementById('deathDateGregorian');
    if (gregorianInput.value) {
        const dateObj = new Date(gregorianInput.value);
        const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
        dayOfWeek = days[dateObj.getDay()];
        
        // Format as DD.MM.YY
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = String(dateObj.getFullYear()).slice(-2);
        gregorianDate = `${day}.${month}.${year}`;
        
        const converted = HebrewDate.gregorianToHebrew(gregorianInput.value);
        if (converted) {
            hebrewDate = converted.formatted;
        }
    }
    
    // Get shiva location text
    const shivaLocationSelect = document.getElementById('shivaLocation');
    let shivaLocationText = shivaLocationSelect.value;
    if (shivaLocationText === 'custom') {
        shivaLocationText = document.getElementById('customShivaLocation').value;
    } else {
        shivaLocationText = 'יושבים שבעה ' + shivaLocationText;
    }
    
    // Build shiva address lines
    const shivaStreet = document.getElementById('shivaStreet').value;
    const shivaNumber = document.getElementById('shivaNumber').value;
    const shivaApartment = document.getElementById('shivaApartment').value;
    const shivaEntrance = document.getElementById('shivaEntrance').value;
    const shivaFloor = document.getElementById('shivaFloor').value;
    const shivaCity = document.getElementById('shivaCity').value;
    
    let shivaAddressLines = [];
    if (shivaStreet) {
        let line1 = 'רחוב ' + shivaStreet;
        if (shivaNumber) line1 += ' ' + shivaNumber;
        if (shivaApartment) line1 += ', דירה ' + shivaApartment;
        shivaAddressLines.push(line1);
        
        let line2Parts = [];
        if (shivaEntrance) line2Parts.push('כניסה ' + shivaEntrance);
        if (shivaFloor) line2Parts.push('קומה ' + shivaFloor);
        if (shivaCity) line2Parts.push(shivaCity);
        if (line2Parts.length > 0) {
            shivaAddressLines.push(line2Parts.join(', '));
        }
    }
    
    // Get funeral time
    const funeralTime = document.getElementById('funeralTime').value;
    let funeralTimeFormatted = '';
    if (funeralTime) {
        const [hours, minutes] = funeralTime.split(':');
        funeralTimeFormatted = `${hours}:${minutes}`;
    }
    
    // Get showBasd
    const showBasd = document.getElementById('showBasd').checked;
    
    // Get relationship
    const relationship = document.getElementById('relationship').value;
    
    return {
        showBasd,
        frameStyle,
        openingLine,
        relationship,
        gender,
        title: document.getElementById('title').value,
        fullName: document.getElementById('fullName').value,
        endearment,
        gregorianDate,
        hebrewDate,
        dayOfWeek,
        cemetery: document.getElementById('cemetery').value,
        funeralTime: funeralTimeFormatted,
        shivaLocationText,
        shivaAddressLines,
        signature: document.getElementById('signature').value,
        additionalNotes: document.getElementById('additionalNotes').value
    };
}

// Generate Preview
function generatePreview() {
    const data = getFormData();
    
    // Build name with title
    let fullNameDisplay = data.fullName;
    if (data.title) {
        fullNameDisplay = data.title + ' ' + data.fullName;
    }
    
    // Build relationship line with endearment
    let relationshipLine = data.relationship || '';
    if (data.endearment && relationshipLine) {
        relationshipLine += ' ' + data.endearment;
    }
    
    // Build funeral info line
    let funeralLine = '';
    if (data.cemetery || data.hebrewDate) {
        funeralLine = 'ההלוויה תתקיים';
        if (data.dayOfWeek) {
            funeralLine += ` היום יום ${data.dayOfWeek}`;
        }
        if (data.hebrewDate) {
            funeralLine += `, ${data.hebrewDate}`;
        }
        if (data.gregorianDate) {
            funeralLine += ` (${data.gregorianDate})`;
        }
    }
    
    let funeralLine2 = '';
    if (data.funeralTime || data.cemetery) {
        if (data.funeralTime) {
            funeralLine2 = `בשעה ${data.funeralTime}`;
        }
        if (data.cemetery) {
            funeralLine2 += ` בבית העלמין ${data.cemetery}`;
        }
    }
    
    // Get frame class
    const frameClasses = {
        'simple': 'frame-simple',
        'double': 'frame-double',
        'thick': 'frame-thick',
        'ornate': 'frame-ornate'
    };
    const frameClass = frameClasses[data.frameStyle] || 'frame-simple';
    
    const previewHTML = `
        <div class="obituary-border ${frameClass}">
            ${data.showBasd ? '<div class="obituary-basd">בס"ד</div>' : ''}
            
            <div class="obituary-opening">${data.openingLine}</div>
            
            ${relationshipLine ? `<div class="obituary-relationship">${relationshipLine}</div>` : ''}
            
            <div class="obituary-name-container">
                <span class="obituary-name">${fullNameDisplay}</span>
                <span class="obituary-zal">ז"ל</span>
            </div>
            
            ${(funeralLine || funeralLine2) ? `
                <div class="obituary-funeral-info">
                    ${funeralLine ? `<div class="obituary-funeral-line">${funeralLine}</div>` : ''}
                    ${funeralLine2 ? `<div class="obituary-funeral-line">${funeralLine2}</div>` : ''}
                </div>
            ` : ''}
            
            ${data.additionalNotes ? `
                <div class="obituary-notes">${data.additionalNotes}</div>
            ` : ''}
            
            <div class="obituary-bottom-section">
                ${data.signature ? `<div class="obituary-signature">${data.signature}</div>` : '<div></div>'}
                
                ${data.shivaAddressLines.length > 0 ? `
                    <div class="obituary-shiva">
                        <div class="obituary-shiva-title">${data.shivaLocationText},</div>
                        ${data.shivaAddressLines.map(line => `<div>${line}</div>`).join('')}
                    </div>
                ` : '<div></div>'}
            </div>
        </div>
    `;
    
    document.getElementById('obituaryPreview').innerHTML = previewHTML;
    document.getElementById('obituaryFinal').innerHTML = previewHTML;
}

// Print Obituary
function printObituary() {
    window.print();
}

// Download as Image
async function downloadAsImage() {
    const element = document.getElementById('obituaryFinal');
    
    try {
        const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true
        });
        
        const link = document.createElement('a');
        link.download = 'מודעת-אבל.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Error generating image:', error);
        alert('שגיאה ביצירת התמונה. נסו שוב.');
    }
}

// Make functions globally available
window.goToStep = goToStep;
window.printObituary = printObituary;
window.downloadAsImage = downloadAsImage;

