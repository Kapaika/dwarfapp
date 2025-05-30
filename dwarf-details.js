// Helper function to normalize Polish characters for debugging
function normalizePolishName(name) {
    const polishChars = {
        'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
        'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z'
    };
    
    return name.toLowerCase()
        .split('')
        .map(char => polishChars[char] || char)
        .join('');
}

// Check if the dwarf has been found
document.addEventListener('DOMContentLoaded', function() {
    // Get the dwarf ID from the URL (e.g., "/dwarfs/1-medrek.html" -> "1")
    // Extract filename from path, handle potential URL encoding/decoding issues
    const pathParts = decodeURIComponent(window.location.pathname).split('/');
    const filename = pathParts[pathParts.length - 1];
    const currentDwarfId = parseInt(filename.split('-')[0]);
    
    // Log the current page information for debugging
    console.log('Current page:', {
        path: window.location.pathname,
        filename: filename,
        dwarfId: currentDwarfId
    });
    
    // Check localStorage to see if we've found this dwarf
    const savedData = localStorage.getItem('dwarfData');
    
    if (savedData) {
        const dwarfData = JSON.parse(savedData);
        const currentDwarf = dwarfData.find(dwarf => dwarf.id === currentDwarfId);
        
        if (currentDwarf && !currentDwarf.found) {
            // Create a notice element
            const noticeElement = document.createElement('div');
            noticeElement.className = 'not-found-notice';
            noticeElement.innerHTML = `
                <p>👀 Nie znalazłeś jeszcze oficjalnie tego domu krasnoludka!</p>
                <p>Aby oznaczyć go jako znaleziony, musisz zeskanować jego kod QR w prawdziwym świecie.</p>
            `;
            
            // Insert it after the dwarf-navigation div
            const navigationElement = document.querySelector('.dwarf-navigation');
            if (navigationElement) {
                navigationElement.after(noticeElement);
            }
        }
    }
});
