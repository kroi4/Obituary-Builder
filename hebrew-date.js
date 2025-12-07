// Hebrew Date Conversion Utilities
// This is a simplified version - for production, consider using a library like hebcal

const hebrewMonths = [
    { name: 'תשרי', value: 1 },
    { name: 'חשוון', value: 2 },
    { name: 'כסלו', value: 3 },
    { name: 'טבת', value: 4 },
    { name: 'שבט', value: 5 },
    { name: 'אדר', value: 6 },
    { name: 'אדר א׳', value: 6.1 },
    { name: 'אדר ב׳', value: 6.2 },
    { name: 'ניסן', value: 7 },
    { name: 'אייר', value: 8 },
    { name: 'סיוון', value: 9 },
    { name: 'תמוז', value: 10 },
    { name: 'אב', value: 11 },
    { name: 'אלול', value: 12 }
];

const hebrewDays = [
    'א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ז׳', 'ח׳', 'ט׳', 'י׳',
    'י״א', 'י״ב', 'י״ג', 'י״ד', 'ט״ו', 'ט״ז', 'י״ז', 'י״ח', 'י״ט', 'כ׳',
    'כ״א', 'כ״ב', 'כ״ג', 'כ״ד', 'כ״ה', 'כ״ו', 'כ״ז', 'כ״ח', 'כ״ט', 'ל׳'
];

const hebrewNumerals = {
    1: 'א', 2: 'ב', 3: 'ג', 4: 'ד', 5: 'ה', 6: 'ו', 7: 'ז', 8: 'ח', 9: 'ט',
    10: 'י', 20: 'כ', 30: 'ל', 40: 'מ', 50: 'נ', 60: 'ס', 70: 'ע', 80: 'פ', 90: 'צ',
    100: 'ק', 200: 'ר', 300: 'ש', 400: 'ת'
};

// Convert number to gematria (Hebrew numerals)
function numberToGematria(num, addGershayim = true) {
    if (num <= 0) return '';
    
    let result = '';
    
    // Handle hundreds
    while (num >= 400) {
        result += hebrewNumerals[400];
        num -= 400;
    }
    if (num >= 100) {
        result += hebrewNumerals[Math.floor(num / 100) * 100];
        num = num % 100;
    }
    
    // Special cases for 15 and 16 (avoid using יה and יו)
    if (num === 15) {
        result += 'טו';
    } else if (num === 16) {
        result += 'טז';
    } else {
        // Handle tens
        if (num >= 10) {
            result += hebrewNumerals[Math.floor(num / 10) * 10];
            num = num % 10;
        }
        
        // Handle units
        if (num > 0) {
            result += hebrewNumerals[num];
        }
    }
    
    // Add gershayim before last letter if more than one letter
    if (addGershayim) {
        if (result.length > 1) {
            result = result.slice(0, -1) + '"' + result.slice(-1);
        } else if (result.length === 1) {
            result += "'";
        }
    }
    
    return result;
}

// Convert number to Hebrew year representation (e.g., תשפ"ו)
function numberToHebrewYear(year) {
    // Get last 3 digits (e.g., 5786 -> 786)
    const shortYear = year % 1000;
    
    // Convert to gematria
    let result = numberToGematria(shortYear, false);
    
    // Add gershayim before last letter
    if (result.length > 1) {
        result = result.slice(0, -1) + '"' + result.slice(-1);
    }
    
    return result;
}

// Convert number to Hebrew year with ה' prefix (e.g., ה'תשפ"ו)
function numberToHebrewYearWithPrefix(year) {
    return "ה'" + numberToHebrewYear(year);
}

// Simplified Gregorian to Hebrew conversion
// Note: This is an approximation. For accurate conversion, use a proper library
function gregorianToHebrew(date) {
    const gDate = new Date(date);
    
    // Use Intl.DateTimeFormat for basic Hebrew calendar support
    try {
        const hebrewFormatter = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const parts = hebrewFormatter.formatToParts(gDate);
        let day = '', month = '', year = '';
        
        parts.forEach(part => {
            if (part.type === 'day') day = part.value;
            if (part.type === 'month') month = part.value;
            if (part.type === 'year') year = part.value;
        });
        
        // Convert day to Hebrew letters
        const dayNum = parseInt(day);
        const hebrewDay = hebrewDays[dayNum - 1] || day;
        
        // Convert year to Hebrew letters
        const yearNum = parseInt(year);
        const hebrewYear = numberToHebrewYearWithPrefix(yearNum);
        
        return {
            day: dayNum,
            month: month,
            year: yearNum,
            formatted: `${hebrewDay} ${month} ${hebrewYear}`
        };
    } catch (e) {
        console.error('Error converting to Hebrew date:', e);
        return null;
    }
}

// Format Gregorian date in Hebrew
function formatGregorianInHebrew(date) {
    const gDate = new Date(date);
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    return gDate.toLocaleDateString('he-IL', options);
}

// Initialize Hebrew date selectors
function initHebrewDateSelectors() {
    const daySelect = document.getElementById('hebrewDay');
    const monthSelect = document.getElementById('hebrewMonth');
    const yearSelect = document.getElementById('hebrewYear');
    
    // Populate days (1-30)
    for (let i = 1; i <= 30; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = hebrewDays[i - 1];
        daySelect.appendChild(option);
    }
    
    // Populate months
    hebrewMonths.forEach(month => {
        const option = document.createElement('option');
        option.value = month.value;
        option.textContent = month.name;
        monthSelect.appendChild(option);
    });
    
    // Populate years (current Hebrew year ± 2 years)
    // Current Hebrew year is approximately Gregorian year + 3760
    const currentGregorianYear = new Date().getFullYear();
    const currentHebrewYear = currentGregorianYear + 3760;
    
    for (let i = currentHebrewYear - 2; i <= currentHebrewYear + 1; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = numberToHebrewYear(i);
        yearSelect.appendChild(option);
    }
}

// Export functions for use in main script
window.HebrewDate = {
    gregorianToHebrew,
    formatGregorianInHebrew,
    initHebrewDateSelectors,
    numberToHebrewYear,
    numberToHebrewYearWithPrefix,
    numberToGematria,
    hebrewMonths,
    hebrewDays
};

