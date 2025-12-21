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
    initializeVisitingHours();
    initializeShivaLocations();
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

// Initialize Visiting Hours Toggle
function initializeVisitingHours() {
    const checkbox = document.getElementById('enableVisitingHours');
    const inputsContainer = document.getElementById('visitingHoursInputs');
    const addBtn = document.getElementById('addTimeSlotBtn');
    
    if (checkbox && inputsContainer) {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                inputsContainer.classList.remove('hidden');
            } else {
                inputsContainer.classList.add('hidden');
            }
        });
    }
    
    // Add time slot button
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            addTimeSlot();
        });
    }
}

// Time slot counter
let timeSlotCounter = 1;
const MAX_TIME_SLOTS = 3;

// Add a new time slot
function addTimeSlot() {
    const container = document.getElementById('timeSlotsContainer');
    const slots = container.querySelectorAll('.time-range');
    
    if (slots.length >= MAX_TIME_SLOTS) return;
    
    timeSlotCounter++;
    
    const newSlot = document.createElement('div');
    newSlot.className = 'time-range';
    newSlot.dataset.slotIndex = timeSlotCounter - 1;
    
    newSlot.innerHTML = `
        <span class="time-label">משעה</span>
        <input type="time" class="visiting-hours-from" value="10:00">
        <span class="time-label">עד</span>
        <input type="time" class="visiting-hours-to" value="20:00">
        <button type="button" class="btn-remove-time-slot">✕</button>
    `;
    
    // Add remove handler
    const removeBtn = newSlot.querySelector('.btn-remove-time-slot');
    removeBtn.addEventListener('click', () => {
        newSlot.remove();
        updateTimeSlotButton();
    });
    
    container.appendChild(newSlot);
    updateTimeSlotButton();
}

// Update add button visibility based on slot count
function updateTimeSlotButton() {
    const container = document.getElementById('timeSlotsContainer');
    const addBtn = document.getElementById('addTimeSlotBtn');
    const slots = container.querySelectorAll('.time-range');
    
    if (addBtn) {
        if (slots.length >= MAX_TIME_SLOTS) {
            addBtn.style.display = 'none';
        } else {
            addBtn.style.display = 'flex';
        }
    }
}

// Location counter for unique IDs
let locationCounter = 1;

// Initialize Shiva Locations
function initializeShivaLocations() {
    const container = document.getElementById('shivaLocationsContainer');
    const addBtn = document.getElementById('addLocationBtn');
    
    // Initialize existing location card event listeners
    initializeLocationCard(container.querySelector('.shiva-location-card'));
    
    // Add location button
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            addNewLocation();
        });
    }
}

// Initialize a single location card's event listeners
function initializeLocationCard(card) {
    if (!card) return;
    
    const locationSelect = card.querySelector('.shiva-location-select');
    const customGroup = card.querySelector('.custom-location-group');
    
    if (locationSelect && customGroup) {
        locationSelect.addEventListener('change', () => {
            if (locationSelect.value === 'custom') {
                customGroup.classList.remove('hidden');
                customGroup.querySelector('input').focus();
            } else {
                customGroup.classList.add('hidden');
            }
        });
    }
    
    // Remove button handler
    const removeBtn = card.querySelector('.btn-remove-location');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            removeLocation(card);
        });
    }
}

// Add a new location card
function addNewLocation() {
    const container = document.getElementById('shivaLocationsContainer');
    locationCounter++;
    
    const newCard = document.createElement('div');
    newCard.className = 'shiva-location-card';
    newCard.dataset.locationIndex = locationCounter - 1;
    
    newCard.innerHTML = `
        <div class="location-header">
            <span class="location-number">מיקום ${locationCounter}</span>
            <button type="button" class="btn-remove-location">הסר</button>
        </div>
        
        <div class="form-group">
            <select class="shiva-location-select">
                <option value="בבית המנוח">יושבים שבעה בבית המנוח</option>
                <option value="בבית המנוחה">יושבים שבעה בבית המנוחה</option>
                <option value="בבית">יושבים שבעה בבית</option>
                <option value="custom">טקסט מותאם אישית...</option>
            </select>
        </div>
        <div class="form-group hidden custom-location-group">
            <input type="text" class="custom-shiva-location" placeholder="טקסט מותאם אישית">
        </div>
        
        <div class="days-selector-group">
            <label>ימים:</label>
            <div class="days-selector">
                <label class="day-checkbox"><input type="checkbox" value="א׳"><span>א׳</span></label>
                <label class="day-checkbox"><input type="checkbox" value="ב׳"><span>ב׳</span></label>
                <label class="day-checkbox"><input type="checkbox" value="ג׳"><span>ג׳</span></label>
                <label class="day-checkbox"><input type="checkbox" value="ד׳"><span>ד׳</span></label>
                <label class="day-checkbox"><input type="checkbox" value="ה׳"><span>ה׳</span></label>
                <label class="day-checkbox"><input type="checkbox" value="ו׳"><span>ו׳</span></label>
                <label class="day-checkbox"><input type="checkbox" value="ש׳"><span>ש׳</span></label>
            </div>
        </div>
        
        <div class="address-inputs">
            <input type="text" class="shiva-street" placeholder="רחוב">
            <div class="address-row">
                <input type="text" class="shiva-number" placeholder="מספר בית">
                <input type="text" class="shiva-apartment" placeholder="דירה">
            </div>
            <div class="address-row">
                <input type="text" class="shiva-entrance" placeholder="כניסה">
                <input type="text" class="shiva-floor" placeholder="קומה">
            </div>
            <input type="text" class="shiva-city" placeholder="עיר">
        </div>
    `;
    
    container.appendChild(newCard);
    initializeLocationCard(newCard);
    updateLocationNumbers();
}

// Remove a location card
function removeLocation(card) {
    const container = document.getElementById('shivaLocationsContainer');
    const cards = container.querySelectorAll('.shiva-location-card');
    
    // Don't remove if it's the only one
    if (cards.length <= 1) return;
    
    card.remove();
    updateLocationNumbers();
}

// Update location card numbers after add/remove
function updateLocationNumbers() {
    const container = document.getElementById('shivaLocationsContainer');
    const cards = container.querySelectorAll('.shiva-location-card');
    
    cards.forEach((card, index) => {
        const numberSpan = card.querySelector('.location-number');
        if (numberSpan) {
            numberSpan.textContent = `מיקום ${index + 1}`;
        }
        card.dataset.locationIndex = index;
    });
    
    locationCounter = cards.length;
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
        // Clear previous error states
        // Error states are cleared per location card below
        
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
        
        // Validate shiva locations
        const locationCards = document.querySelectorAll('.shiva-location-card');
        let isValid = true;
        
        locationCards.forEach((card, index) => {
            const cityInput = card.querySelector('.shiva-city');
            const city = cityInput.value.trim();
            
            // Check if any other address field is filled in this card
            const street = card.querySelector('.shiva-street').value.trim();
            const number = card.querySelector('.shiva-number').value.trim();
            const apartment = card.querySelector('.shiva-apartment').value.trim();
            const entrance = card.querySelector('.shiva-entrance').value.trim();
            const floor = card.querySelector('.shiva-floor').value.trim();
            
            const hasAddressDetails = street || number || apartment || entrance || floor;
            
            // Clear error style
            cityInput.classList.remove('input-error');
            
            if (hasAddressDetails && !city) {
                cityInput.classList.add('input-error');
                if (isValid) { // Only alert once
                    alert(`נא להזין עיר לכתובת השבעה (מיקום ${index + 1})`);
                    cityInput.focus();
                }
                isValid = false;
            }
        });
        
        if (!isValid) return false;
        
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
    
    // Get shiva locations (multiple)
    const shivaLocations = [];
    const locationCards = document.querySelectorAll('.shiva-location-card');
    
    locationCards.forEach(card => {
        const locationSelect = card.querySelector('.shiva-location-select');
        let locationText = locationSelect.value;
        
        if (locationText === 'custom') {
            const customInput = card.querySelector('.custom-shiva-location');
            locationText = customInput ? customInput.value : '';
        } else {
            locationText = 'יושבים שבעה ' + locationText;
        }
        
        // Get selected days
        const selectedDays = [];
        const dayCheckboxes = card.querySelectorAll('.day-checkbox input:checked');
        dayCheckboxes.forEach(cb => selectedDays.push(cb.value));
        
        // Get address
        const street = card.querySelector('.shiva-street')?.value || '';
        const number = card.querySelector('.shiva-number')?.value || '';
        const apartment = card.querySelector('.shiva-apartment')?.value || '';
        const entrance = card.querySelector('.shiva-entrance')?.value || '';
        const floor = card.querySelector('.shiva-floor')?.value || '';
        const city = card.querySelector('.shiva-city')?.value || '';
        
        // Build address lines
        let addressLines = [];
        if (street || city) {
            let addressParts = [];
            
            if (street) {
                let streetPart = 'רחוב ' + street;
                if (number) streetPart += ' ' + number;
                addressParts.push(streetPart);
            }
            if (apartment) addressParts.push('דירה ' + apartment);
            if (entrance) addressParts.push('כניסה ' + entrance);
            if (floor) addressParts.push('קומה ' + floor);
            if (city) addressParts.push(city);
            
            addressLines.push(addressParts.join(', '));
        }
        
        shivaLocations.push({
            locationText: locationText.replace(/ /g, '&nbsp;'),
            days: selectedDays,
            daysFormatted: formatDaysRange(selectedDays),
            addressLines
        });
    });
    
    // Get visiting hours (multiple slots)
    const visitingHoursEnabled = document.getElementById('enableVisitingHours')?.checked || false;
    const visitingHoursSlots = [];
    
    if (visitingHoursEnabled) {
        const timeSlots = document.querySelectorAll('#timeSlotsContainer .time-range');
        timeSlots.forEach(slot => {
            const from = slot.querySelector('.visiting-hours-from')?.value || '';
            const to = slot.querySelector('.visiting-hours-to')?.value || '';
            if (from && to) {
                visitingHoursSlots.push({ from, to });
            }
        });
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
        shivaLocations,
        visitingHours: {
            enabled: visitingHoursEnabled,
            slots: visitingHoursSlots
        },
        signature: document.getElementById('signature').value,
        additionalNotes: document.getElementById('additionalNotes').value
    };
}

// Format days range (e.g., "א׳-ג׳" or "א׳, ג׳, ה׳")
function formatDaysRange(days) {
    if (days.length === 0) return '';
    if (days.length === 7) return ''; // All days, no need to show
    
    const allDays = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
    const indices = days.map(d => allDays.indexOf(d)).filter(i => i !== -1).sort((a, b) => a - b);
    
    if (indices.length === 0) return '';
    
    // Check if consecutive
    let isConsecutive = true;
    for (let i = 1; i < indices.length; i++) {
        if (indices[i] !== indices[i - 1] + 1) {
            isConsecutive = false;
            break;
        }
    }
    
    if (isConsecutive && indices.length > 2) {
        return `ימים ${allDays[indices[0]]}-${allDays[indices[indices.length - 1]]}`;
    } else if (indices.length === 1) {
        return `יום ${allDays[indices[0]]}`;
    } else {
        return `ימים ${days.join(', ')}`; 
    }
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
                
                ${data.shivaLocations.length > 0 && data.shivaLocations.some(loc => loc.addressLines.length > 0) ? `
                    <div class="obituary-shiva">
                        <div class="obituary-shiva-title">יושבים&nbsp;שבעה,</div>
                        ${data.shivaLocations.map((loc, index) => {
                            if (loc.addressLines.length === 0) return '';
                            return `
                                <div class="obituary-shiva-location ${data.shivaLocations.filter(l => l.addressLines.length > 0).length > 1 ? 'multi-location' : ''}">
                                    ${loc.addressLines
                                        .map(line => {
                                            const withNumberSpans = line.replace(/\d+/g, '<span class="address-number">$&</span>');
                                            return `<div>${withNumberSpans.replace(/ /g, '&nbsp;')}</div>`;
                                        })
                                        .join('')}
                                    ${loc.daysFormatted ? `<div class="obituary-shiva-days">${loc.daysFormatted}</div>` : ''}
                                </div>
                            `;
                        }).join('')}
                        ${data.visitingHours.enabled && data.visitingHours.slots.length > 0 ? `
                            <div class="obituary-visiting-hours">
                                שעות&nbsp;קבלת&nbsp;קהל:&nbsp;${data.visitingHours.slots.map(s => `${s.from}-${s.to}`).join(',&nbsp;')}
                            </div>
                        ` : ''}
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
        
        // Add class to force A4 landscape size (overrides mobile CSS)
        element.classList.add('force-capture-size');
        
        // Wait a moment for layout to settle
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const canvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            letterRendering: true,
            logging: false,
            width: 800,
            height: 571,
            scrollX: -window.scrollX,
            scrollY: -window.scrollY
        });
        
        // Remove the force-capture class
        element.classList.remove('force-capture-size');
        
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
        
        // Make sure to remove the class even if there's an error
        element.classList.remove('force-capture-size');
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

