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
    initializeAddressValidation();
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

// Initialize Address Validation
function initializeAddressValidation() {
    const shivaCity = document.getElementById('shivaCity');
    
    // Remove error styling when user starts typing in city field
    shivaCity.addEventListener('input', () => {
        shivaCity.classList.remove('input-error');
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
        
        // Clear previous error states
        document.getElementById('shivaCity').classList.remove('input-error');
        
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
        
        // Validate shiva address: if any address field is filled, city is required
        const shivaStreet = document.getElementById('shivaStreet').value.trim();
        const shivaNumber = document.getElementById('shivaNumber').value.trim();
        const shivaApartment = document.getElementById('shivaApartment').value.trim();
        const shivaEntrance = document.getElementById('shivaEntrance').value.trim();
        const shivaFloor = document.getElementById('shivaFloor').value.trim();
        const shivaCity = document.getElementById('shivaCity').value.trim();
        
        const hasAddressDetails = shivaStreet || shivaNumber || shivaApartment || shivaEntrance || shivaFloor;
        
        if (hasAddressDetails && !shivaCity) {
            document.getElementById('shivaCity').classList.add('input-error');
            alert('נא להזין עיר לכתובת השבעה');
            document.getElementById('shivaCity').focus();
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
    let isToday = false;
    
    const gregorianInput = document.getElementById('deathDateGregorian');
    if (gregorianInput.value) {
        const dateObj = new Date(gregorianInput.value);
        const today = new Date();
        
        // Check if the date is today
        isToday = dateObj.toDateString() === today.toDateString();
        
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
        shivaLocationText = document.getElementById('customShivaLocation').value.replace(/ /g, '&nbsp;');
    } else {
        shivaLocationText = 'יושבים&nbsp;שבעה&nbsp;' + shivaLocationText.replace(/ /g, '&nbsp;');
    }
    
    // Build shiva address - dynamic single or multi-line based on content
    const shivaStreet = document.getElementById('shivaStreet').value;
    const shivaNumber = document.getElementById('shivaNumber').value;
    const shivaApartment = document.getElementById('shivaApartment').value;
    const shivaEntrance = document.getElementById('shivaEntrance').value;
    const shivaFloor = document.getElementById('shivaFloor').value;
    const shivaCity = document.getElementById('shivaCity').value;
    
    let shivaAddressLines = [];
    if (shivaStreet || shivaCity) {
        let addressParts = [];
        
        // Street and number
        if (shivaStreet) {
            let streetPart = 'רחוב ' + shivaStreet;
            if (shivaNumber) streetPart += ' ' + shivaNumber;
            addressParts.push(streetPart);
        }
        
        // Apartment
        if (shivaApartment) {
            addressParts.push('דירה ' + shivaApartment);
        }
        
        // Entrance
        if (shivaEntrance) {
            addressParts.push('כניסה ' + shivaEntrance);
        }
        
        // Floor
        if (shivaFloor) {
            addressParts.push('קומה ' + shivaFloor);
        }
        
        // City
        if (shivaCity) {
            addressParts.push(shivaCity);
        }
        
        // If we have many parts, split into two lines for readability
        if (addressParts.length > 3) {
            // First line: street + number + apartment
            let line1Parts = [];
            if (shivaStreet) {
                let streetPart = 'רחוב ' + shivaStreet;
                if (shivaNumber) streetPart += ' ' + shivaNumber;
                line1Parts.push(streetPart);
            }
            if (shivaApartment) line1Parts.push('דירה ' + shivaApartment);
            if (line1Parts.length > 0) shivaAddressLines.push(line1Parts.join(', '));
            
            // Second line: entrance + floor + city
            let line2Parts = [];
            if (shivaEntrance) line2Parts.push('כניסה ' + shivaEntrance);
            if (shivaFloor) line2Parts.push('קומה ' + shivaFloor);
            if (shivaCity) line2Parts.push(shivaCity);
            if (line2Parts.length > 0) shivaAddressLines.push(line2Parts.join(', '));
        } else {
            // Single line for simple addresses
            shivaAddressLines.push(addressParts.join(', '));
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
        isToday,
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
    let fullNameDisplay = data.fullName.replace(/ /g, '&nbsp;');
    if (data.title) {
        fullNameDisplay = data.title + '&nbsp;' + data.fullName.replace(/ /g, '&nbsp;');
    }
    
    // Build relationship line with endearment
    let relationshipLine = data.relationship ? data.relationship.replace(/ /g, '&nbsp;') : '';
    if (data.endearment && relationshipLine) {
        relationshipLine += '&nbsp;' + data.endearment.replace(/ /g, '&nbsp;');
    }
    
    // Build funeral info line
    let funeralLine = '';
    if (data.cemetery || data.hebrewDate) {
        funeralLine = 'ההלוויה&nbsp;תתקיים';
        if (data.dayOfWeek) {
            // Only show "היום" if the date is actually today
            if (data.isToday) {
                funeralLine += `&nbsp;היום&nbsp;יום&nbsp;${data.dayOfWeek}`;
            } else {
                funeralLine += `&nbsp;ביום&nbsp;${data.dayOfWeek}`;
            }
        }
        if (data.hebrewDate) {
            funeralLine += `,&nbsp;${data.hebrewDate.replace(/ /g, '&nbsp;')}`;
        }
        if (data.gregorianDate) {
            // Wrap Gregorian date in LTR span so parentheses render correctly in RTL and in images/PDF
            funeralLine += `&nbsp;<span class="ltr-date">(${data.gregorianDate})</span>`;
        }
    }
    
    let funeralLine2 = '';
    if (data.funeralTime || data.cemetery) {
        if (data.funeralTime) {
            funeralLine2 = `בשעה&nbsp;${data.funeralTime}`;
        }
        if (data.cemetery) {
            funeralLine2 += `&nbsp;בבית&nbsp;העלמין&nbsp;${data.cemetery.replace(/ /g, '&nbsp;')}`;
        }
    }
    
    // Get frame class
    const frameClasses = {
        'simple': 'frame-simple',
        'double': 'frame-double',
        'thick': 'frame-thick'
    };
    const frameClass = frameClasses[data.frameStyle] || 'frame-thick';
    
    const previewHTML = `
        <div class="obituary-border ${frameClass}">
            ${data.showBasd ? '<div class="obituary-basd">בס"ד</div>' : ''}
            
            <div class="obituary-opening">${data.openingLine.replace(/ /g, '&nbsp;')}</div>
            
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
                <div class="obituary-notes">${data.additionalNotes.replace(/ /g, '&nbsp;')}</div>
            ` : ''}
            
            <div class="obituary-bottom-section">
                ${data.signature ? `<div class="obituary-signature">${data.signature.replace(/ /g, '&nbsp;')}</div>` : '<div></div>'}
                
                ${data.shivaAddressLines.length > 0 ? `
                    <div class="obituary-shiva">
                        <div class="obituary-shiva-title">${data.shivaLocationText},</div>
                        ${data.shivaAddressLines
                            .map(line => {
                                // Wrap numbers to control spacing and then keep non-breaking spaces
                                const withNumberSpans = line.replace(/\d+/g, '<span class="address-number">$&</span>');
                                return `<div>${withNumberSpans.replace(/ /g, '&nbsp;')}</div>`;
                            })
                            .join('')}
                    </div>
                ` : '<div></div>'}
            </div>
        </div>
    `;
    
    document.getElementById('obituaryPreview').innerHTML = previewHTML;
    document.getElementById('obituaryFinal').innerHTML = previewHTML;
    
    // Apply current styles
    updatePreviewStyle();
}

// Print Obituary
function printObituary() {
    // Create a new window with only the obituary
    const printContent = document.getElementById('obituaryFinal').outerHTML;
    const printWindow = window.open('', '_blank');
    
    // Get current font and size classes
    const obituaryEl = document.getElementById('obituaryFinal');
    const fontClass = Array.from(obituaryEl.classList).find(c => c.startsWith('font-')) || 'font-frank';
    const sizeClass = Array.from(obituaryEl.classList).find(c => c.startsWith('size-')) || 'size-medium';
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="he" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>מודעת אבל</title>
            <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700&family=David+Libre:wght@400;500;700&family=Frank+Ruhl+Libre:wght@300;400;500;700&family=Heebo:wght@400;500;600;700&family=Rubik:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
                @page { size: A4 landscape; margin: 10mm; }
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    min-height: 100vh;
                    background: white;
                    font-family: 'Frank Ruhl Libre', serif;
                }
                /* שמירה על אותם ממדים כמו בתצוגה הרגילה כדי שלא "יימתח" לפי גודל המסך */
                .obituary-preview {
                    width: 800px;
                    max-width: 800px;
                    min-width: 700px;
                    aspect-ratio: 1.4 / 1;
                    background: #ffffff;
                    color: #1a1a1a;
                    padding: 25px;
                    font-family: 'Frank Ruhl Libre', serif;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                }
                .obituary-preview.font-frank { font-family: 'Frank Ruhl Libre', serif; }
                .obituary-preview.font-david { font-family: 'David Libre', serif; }
                .obituary-preview.font-assistant { font-family: 'Assistant', sans-serif; }
                .obituary-preview.font-heebo { font-family: 'Heebo', sans-serif; }
                .obituary-preview.font-rubik { font-family: 'Rubik', sans-serif; }
                
                .obituary-border { padding: 20px 30px; position: relative; flex: 1; display: flex; flex-direction: column; }
                .obituary-border.frame-simple { border: 3px solid #1a1a1a; }
                .obituary-border.frame-double { border: 3px double #1a1a1a; box-shadow: inset 0 0 0 4px #fff, inset 0 0 0 7px #1a1a1a; }
                .obituary-border.frame-thick { border: 6px solid #1a1a1a; }
                
                .obituary-basd { position: absolute; top: 10px; right: 15px; font-size: 1rem; font-weight: 500; }
                .obituary-opening { font-size: 1.4rem; font-weight: 700; line-height: 1.6; margin-bottom: 5px; margin-top: 15px; }
                .obituary-relationship { font-size: 1.3rem; font-weight: 700; margin-bottom: 10px; }
                .obituary-name-container { display: flex; align-items: center; justify-content: center; gap: 20px; margin: 15px 0; }
                .obituary-name { font-size: 3rem; font-weight: 700; line-height: 1.2; }
                .obituary-zal { font-size: 1.5rem; font-weight: 400; }
                .obituary-funeral-info { font-size: 1.15rem; font-weight: 600; margin: 15px 0; line-height: 1.8; }
                .obituary-funeral-line { margin: 3px 0; }
                .obituary-bottom-section { display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto; padding-top: 15px; }
                .obituary-signature { font-size: 1.5rem; font-weight: 700; text-align: left; order: 2; }
                .obituary-shiva { text-align: right; font-size: 1rem; line-height: 1.6; font-weight: 600; order: 1; }
                .obituary-shiva-title { font-weight: 700; }
                .obituary-notes { font-size: 0.9rem; font-style: italic; margin: 15px 0; padding: 10px; background: #f9f9f9; border-radius: 4px; }
                .ltr-date { direction: ltr; unicode-bidi: embed; display: inline-block; }
                
                /* Size classes */
                .size-small .obituary-name { font-size: 2.2rem; }
                .size-small .obituary-zal { font-size: 1.1rem; }
                .size-small .obituary-opening, .size-small .obituary-relationship { font-size: 1rem; }
                .size-small .obituary-funeral-info { font-size: 0.9rem; }
                .size-small .obituary-shiva, .size-small .obituary-signature { font-size: 0.9rem; }
                
                .size-large .obituary-name { font-size: 3.8rem; }
                .size-large .obituary-zal { font-size: 1.8rem; }
                .size-large .obituary-opening, .size-large .obituary-relationship { font-size: 1.6rem; }
                .size-large .obituary-funeral-info { font-size: 1.4rem; }
                .size-large .obituary-shiva, .size-large .obituary-signature { font-size: 1.3rem; }
            </style>
        </head>
        <body>
            <div class="obituary-preview ${fontClass} ${sizeClass}">
                ${document.getElementById('obituaryFinal').innerHTML}
            </div>
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        window.close();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

// Download as Image
async function downloadAsImage() {
    const element = document.getElementById('obituaryFinal');
    
    try {
        // Wait to ensure fonts and layout are fully ready
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }
        
        const rect = element.getBoundingClientRect();
        
        const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2, // מספיק חד, פחות עיוותים
            useCORS: true,
            letterRendering: true,
            logging: false,
            width: rect.width,
            height: rect.height,
            scrollX: -window.scrollX,
            scrollY: -window.scrollY
        });
        
        // Get deceased name and date for filename
        const fullName = document.getElementById('fullName').value || 'נפטר';
        const gregorianInput = document.getElementById('deathDateGregorian');
        let dateString = '';
        
        if (gregorianInput.value) {
            const dateObj = new Date(gregorianInput.value);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = String(dateObj.getFullYear()).slice(-2);
            dateString = `_${day}.${month}.${year}`;
        }
        
        const link = document.createElement('a');
        link.download = `מודעת-אבל_${fullName}${dateString}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Error generating image:', error);
        alert('שגיאה ביצירת התמונה. נסו שוב.');
    }
}

// Update Preview Style
function updatePreviewStyle() {
    const preview = document.getElementById('obituaryPreview');
    const final = document.getElementById('obituaryFinal');
    const font = document.getElementById('previewFont').value;
    const frame = document.getElementById('previewFrame').value;
    const size = document.getElementById('previewSize').value;
    
    // Apply styles to both preview and final
    applyStyles(preview, font, frame, size);
    applyStyles(final, font, frame, size);
}

// Update Final Style (kept for compatibility)
function updateFinalStyle() {
    // This function is kept for compatibility but now just calls updatePreviewStyle
    updatePreviewStyle();
}

// Apply styles to preview element
function applyStyles(element, font, frame, size) {
    // Remove all font classes
    element.classList.remove('font-frank', 'font-david', 'font-assistant', 'font-heebo', 'font-rubik');
    // Add selected font class
    element.classList.add('font-' + font);
    
    // Update frame on the border element
    const border = element.querySelector('.obituary-border');
    if (border) {
        border.classList.remove('frame-simple', 'frame-double', 'frame-thick');
        border.classList.add('frame-' + frame);
    }
    
    // Remove all size classes
    element.classList.remove('size-small', 'size-medium', 'size-large');
    // Add selected size class
    element.classList.add('size-' + size);
}

// Toggle Basd visibility
function toggleBasd() {
    const previewBasd = document.getElementById('previewBasd');
    const finalBasd = document.getElementById('finalBasd');
    const showBasdForm = document.getElementById('showBasd');
    
    // Sync all checkboxes
    const isChecked = event.target.checked;
    if (previewBasd) previewBasd.checked = isChecked;
    if (finalBasd) finalBasd.checked = isChecked;
    if (showBasdForm) showBasdForm.checked = isChecked;
    
    // Update the preview
    const basdElements = document.querySelectorAll('.obituary-basd');
    basdElements.forEach(el => {
        el.style.display = isChecked ? 'block' : 'none';
    });
}

// Make functions globally available
window.goToStep = goToStep;
window.printObituary = printObituary;
window.downloadAsImage = downloadAsImage;
window.updatePreviewStyle = updatePreviewStyle;
window.updateFinalStyle = updateFinalStyle;
window.toggleBasd = toggleBasd;

