// Inicjalizacja danych krasnoludków
const dwarfData = [
    {
        id: 1,
        name: "Mędrek",
        location: [50.32411, 19.62878], // Dom nr 1 - 50°19'26.8"N 19°37'43.6"E
        found: false,
        description: "Przywódca siedmiu krasnoludków. Bardzo mądry i nosi okulary.",
        qrCode: "dwarf-doc-1234"
    },
    {
        id: 2,
        name: "Gburek",
        location: [50.32239, 19.62975], // Dom nr 2 - 50°19'20.6"N 19°37'47.1"E
        found: false,
        description: "Zawsze w złym humorze, ale ma złote serce.",
        qrCode: "dwarf-grumpy-5678"
    },
    {
        id: 3,
        name: "Wesołek",
        location: [50.30772, 19.61908], // Dom nr 3 - 50°18'27.8"N 19°37'08.7"E
        found: false,
        description: "Zawsze uśmiechnięty i wprowadza radość wszystkim wokół.",
        qrCode: "dwarf-happy-9012"
    },
    {
        id: 4,
        name: "Śpioszek",
        location: [50.30678, 19.61650], // Dom nr 4 - 50°18'24.4"N 19°36'59.4"E
        found: false,
        description: "Może zasnąć wszędzie i o każdej porze.",
        qrCode: "dwarf-sleepy-3456"
    },
    {
        id: 5,
        name: "Nieśmiałek",
        location: [50.33558, 19.62711], // Dom nr 5 - 50°20'08.1"N 19°37'37.6"E
        found: false,
        description: "Nieśmiały i łatwo się zawstydza, ma różowe policzki.",
        qrCode: "dwarf-bashful-7890"
    },
    {
        id: 6,
        name: "Apsik",
        location: [50.32853, 19.62428], // Dom nr 6 - 50°19'42.7"N 19°37'27.4"E
        found: false,
        description: "Ma okropne alergie i często kicha.",
        qrCode: "dwarf-sneezy-1357"
    },
];

// Save the dwarf data to local storage
function saveDwarfData() {
    localStorage.setItem('dwarfData', JSON.stringify(dwarfData));
    updateDwarfFoundDisplay();
}

// Load dwarf data from local storage
function loadDwarfData() {
    const savedData = localStorage.getItem('dwarfData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Update our dwarfData with saved values
        parsedData.forEach((dwarf, index) => {
            dwarfData[index].found = dwarf.found;
        });
    }
    updateDwarfFoundDisplay();
}

// Update the found dwarfs display
function updateDwarfFoundDisplay() {
    const foundCount = document.getElementById('found-count');
    const totalCount = document.getElementById('total-count');
    const foundDwarfsList = document.getElementById('found-dwarfs');
    
    // Clear the list
    foundDwarfsList.innerHTML = '';
    
    // Count found dwarfs
    const found = dwarfData.filter(dwarf => dwarf.found).length;
    foundCount.textContent = found;
    totalCount.textContent = dwarfData.length;
    
    // Update the header text to show we're displaying only found dwarf houses
    const dwarfInfoHeader = document.querySelector('.dwarf-info h2');
    if (dwarfInfoHeader) {
        dwarfInfoHeader.textContent = `Chatynki: ${found}/${dwarfData.length} Znalezionych`;
    }
    
    // Populate the list - now showing ONLY found dwarfs
    const foundDwarfs = dwarfData.filter(dwarf => dwarf.found);
    
    if (foundDwarfs.length === 0) {
        // Show message when no dwarfs are found yet
        const listItem = document.createElement('li');
        listItem.className = 'no-dwarfs-found';
        listItem.textContent = 'Nie znaleziono jeszcze żadnej chatynki. Wprowadź magiczny kod aby odkryć pierwszy dom!';
        foundDwarfsList.appendChild(listItem);
    } else {
        foundDwarfs.forEach(dwarf => {
            const listItem = document.createElement('li');
            listItem.classList.add('found');
            
            // Make dwarf names clickable
            const dwarfNameLink = document.createElement('a');
            dwarfNameLink.href = getDwarfPageUrl(dwarf);
            dwarfNameLink.className = 'dwarf-name-link';
            dwarfNameLink.textContent = dwarf.name;
            
            listItem.appendChild(dwarfNameLink);
            listItem.appendChild(document.createTextNode(' - Znaleziony! '));
            
            const detailsLink = document.createElement('a');
            detailsLink.href = getDwarfPageUrl(dwarf);
            detailsLink.className = 'dwarf-link';
            detailsLink.textContent = 'Zobacz szczegóły';
            
            listItem.appendChild(detailsLink);
            
            // Add the list item to the list
            foundDwarfsList.appendChild(listItem);
            
            // Add click handler to the list item (for better mobile experience)
            listItem.addEventListener('click', function(e) {
                // Only navigate if the click wasn't on a specific link
                if (!e.target.closest('a')) {
                    window.location.href = getDwarfPageUrl(dwarf);
                }
            });
        });
    }
}

// Initialize the map
let map;
let markers = [];
let userLocationMarker;
let userLocationCircle;

function initMap() {
    // Calculate the center of all dwarf houses
    const centerLat = dwarfData.reduce((sum, dwarf) => sum + dwarf.location[0], 0) / dwarfData.length;
    const centerLng = dwarfData.reduce((sum, dwarf) => sum + dwarf.location[1], 0) / dwarfData.length;
    
    // Create the map centered at the calculated center of all dwarf houses
    map = L.map('map').setView([centerLat, centerLng], 15);
    
    // Add sepia-toned map tiles for old map/newspaper look
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        className: 'sepia-tiles' // Apply sepia filter via CSS
    }).addTo(map);
    
    // Add custom dwarf house icon
    const dwarfIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', // Red for better visibility on sepia map
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    
    // Add markers for each dwarf house
    dwarfData.forEach(dwarf => {
        const popupContent = dwarf.found ? 
            `<div class="map-popup found">
                <div class="popup-title">Dom ${dwarf.name}a</div>
                <div class="popup-status">✅ Odkryto!</div>
                <div class="popup-desc">${dwarf.description}</div>
                <a href="${getDwarfPageUrl(dwarf)}" class="popup-link">Zobacz szczegóły</a>
            </div>` : 
            `<div class="map-popup">
                <div class="popup-title">Dom ${dwarf.name}a</div>
                <div class="popup-status">❓ Nie odkryto</div>
                <div class="popup-desc">Znajdź go i wprowadź kod magiczny!</div>
            </div>`;
            
        const marker = L.marker(dwarf.location, { icon: dwarfIcon })
            .addTo(map)
            .bindPopup(popupContent);
        
        markers.push(marker);
    });
    
    // Fit the map to show all dwarf houses with a slight padding
    fitMapToDwarfs();
    
    // Add custom user location functionality
    showUserLocation();
}

// Function to fit map bounds to all dwarf markers
function fitMapToDwarfs() {
    // Create a bounds object
    const bounds = L.latLngBounds();
    
    // Extend the bounds to include each dwarf house location
    dwarfData.forEach(dwarf => {
        bounds.extend(dwarf.location);
    });
    
    // Add a slight padding to the bounds
    const padding = 0.3; // in km
    const paddedBounds = bounds.pad(padding);
    
    // Set the map view to these bounds
    map.fitBounds(paddedBounds);
}

// Calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Promień Ziemi in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Funkcja pokazująca odległość do domów krasnoludków
function showDistanceToDwarfs(userLat, userLon) {
    dwarfData.forEach((dwarf, index) => {
        const distance = calculateDistance(userLat, userLon, dwarf.location[0], dwarf.location[1]);
        const distanceText = distance < 1 ? 
            `${(distance * 1000).toFixed(0)} m` : 
            `${distance.toFixed(1)} km`;
        
        let popupContent = `<b>Dom ${dwarf.name}a</b><br>Odległość: ${distanceText}<br>`;
        
        if (dwarf.found) {
            popupContent += `✅ Znaleziony!<br>${dwarf.description}<br><a href="${getDwarfPageUrl(dwarf)}" class="popup-link">Zobacz szczegóły</a>`;
        } else {
            popupContent += `Znajdź go i wprowadź kod magiczny!`;
        }
        
        markers[index].bindPopup(popupContent);
    });
}

// Funkcja pokazująca aktualną lokalizację użytkownika
function showUserLocation() {
    if ('geolocation' in navigator) {
        // Przycisk lokalizacji
        const locationControl = L.Control.extend({
            options: {
                position: 'bottomright'
            },

            onAdd: function() {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                const button = L.DomUtil.create('a', 'locate-button', container);
                button.innerHTML = '📍';
                button.title = 'Pokaż moją lokalizację';
                button.style.fontSize = '20px';
                button.style.textDecoration = 'none';
                button.style.fontWeight = 'bold';
                button.style.display = 'flex';
                button.style.alignItems = 'center';
                button.style.justifyContent = 'center';
                button.style.width = '30px';
                button.style.height = '30px';
                
                L.DomEvent.on(button, 'click', function() {
                    navigator.geolocation.getCurrentPosition(
                        function(position) {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            const accuracy = position.coords.accuracy;
                            
                            // Usuń poprzednie markery lokalizacji
                            if (userLocationMarker) {
                                map.removeLayer(userLocationMarker);
                            }
                            if (userLocationCircle) {
                                map.removeLayer(userLocationCircle);
                            }
                            
                            // Dodaj marker lokalizacji użytkownika
                            const userIcon = L.icon({
                                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png', // Gold for user to stand out
                                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                                iconSize: [25, 41],
                                iconAnchor: [12, 41],
                                popupAnchor: [1, -34],
                                shadowSize: [41, 41]
                            });
                            
                            userLocationMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map)
                                .bindPopup('<div class="map-popup user-location"><div class="popup-title">Twoja lokalizacja</div><div class="popup-status">Jesteś tutaj!</div></div>').openPopup();
                            
                            // Dodaj okrąg pokazujący dokładność lokalizacji
                            userLocationCircle = L.circle([lat, lng], {
                                radius: accuracy / 2,
                                weight: 2,
                                color: '#40916c',
                                fillColor: '#40916c',
                                fillOpacity: 0.15
                            }).addTo(map);
                            
                            // Create a bounds object that includes both the user and dwarf houses
                            const bounds = L.latLngBounds();
                            
                            // Add user location to bounds
                            bounds.extend([lat, lng]);
                            
                            // Add all dwarf houses to bounds
                            dwarfData.forEach(dwarf => {
                                bounds.extend(dwarf.location);
                            });
                            
                            // Fit the map to show both the user and all dwarfs
                            map.fitBounds(bounds, {
                                padding: [50, 50], // Add padding in pixels
                                maxZoom: 16 // Restrict max zoom level
                            });
                            
                            // Pokaż informację o odległości do domów krasnoludków
                            showDistanceToDwarfs(lat, lng);
                        },
                        function(error) {
                            alert('Nie udało się ustalić Twojej lokalizacji: ' + getLocationErrorMessage(error));
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0
                        }
                    );
                });
                
                return container;
            }
        });
        
        map.addControl(new locationControl());
    } else {
        console.warn('Geolokalizacja nie jest dostępna w tej przeglądarce');
    }
}

// Funkcja pomocnicza do wyświetlania błędów geolokalizacji
function getLocationErrorMessage(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            return "Użytkownik odmówił dostępu do geolokalizacji.";
        case error.POSITION_UNAVAILABLE:
            return "Informacja o lokalizacji jest niedostępna.";
        case error.TIMEOUT:
            return "Przekroczono czas oczekiwania na lokalizację.";
        case error.UNKNOWN_ERROR:
            return "Wystąpił nieznany błąd.";
        default:
            return "Wystąpił nieoczekiwany błąd.";
    }
}

// Funkcja obliczająca odległość między dwoma punktami geograficznymi (w km)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Promień Ziemi w kilometrach
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Funkcja pokazująca odległość do domów krasnoludków
function showDistanceToDwarfs(userLat, userLon) {
    dwarfData.forEach((dwarf, index) => {
        const distance = calculateDistance(userLat, userLon, dwarf.location[0], dwarf.location[1]);
        const distanceText = distance < 1 ? 
            `${(distance * 1000).toFixed(0)} m` : 
            `${distance.toFixed(1)} km`;
        
        let popupContent = `<b>Dom ${dwarf.name}a</b><br>Odległość: ${distanceText}<br>`;
        
        if (dwarf.found) {
            popupContent += `✅ Znaleziony!<br>${dwarf.description}<br><a href="${getDwarfPageUrl(dwarf)}" class="popup-link">Zobacz szczegóły</a>`;
        } else {
            popupContent += `Znajdź go i zeskanuj kod QR!`;
        }
        
        markers[index].bindPopup(popupContent);
    });
}

// Funkcja sprawdzająca urządzenie mobilne i pokazująca podpowiedź o dodaniu do ekranu głównego
function checkMobileDevice() {
    // Sprawdzenie czy urządzenie jest mobilne
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Sprawdź czy aplikacja jest otwarta z ekranu głównego czy z przeglądarki
        const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
        
        // Jeśli nie jest w trybie standalone, pokaż podpowiedź o dodaniu do ekranu głównego
        if (!isStandalone && !localStorage.getItem('homescreen-prompt-shown')) {
            setTimeout(() => {
                const addToHomeScreen = document.createElement('div');
                addToHomeScreen.className = 'add-to-home-screen';
                
                // Treść w zależności od systemu (iOS vs Android)
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                if (isIOS) {
                    addToHomeScreen.innerHTML = `
                        <div class="prompt-content">
                            <p>Aby łatwiej korzystać z aplikacji, dodaj ją do ekranu głównego!</p>
                            <p>Kliknij <strong>Udostępnij</strong> <span class="icon">↑</span> a następnie <strong>"Dodaj do ekranu głównego"</strong></p>
                            <button class="close-prompt">Rozumiem</button>
                        </div>
                    `;
                } else {
                    addToHomeScreen.innerHTML = `
                        <div class="prompt-content">
                            <p>Aby łatwiej korzystać z aplikacji, dodaj ją do ekranu głównego!</p>
                            <p>Kliknij menu <strong>⋮</strong> a następnie <strong>"Dodaj do ekranu głównego"</strong></p>
                            <button class="close-prompt">Rozumiem</button>
                        </div>
                    `;
                }
                
                document.body.appendChild(addToHomeScreen);
                
                // Obsługa zamknięcia
                document.querySelector('.close-prompt').addEventListener('click', () => {
                    addToHomeScreen.style.display = 'none';
                    localStorage.setItem('homescreen-prompt-shown', 'true');
                });
            }, 2000);
        }
        
        // Dostosuj rozmiary dla telefonu
        adjustForMobileDevice();
    }
}

// Funkcja dostosowująca aplikację do urządzeń mobilnych
function adjustForMobileDevice() {
    // Dostosuj wysokość mapy
    if (window.innerHeight < 700) {
        document.getElementById('map').style.height = '300px';
    }
}

// Helper function to normalize Polish characters for filenames
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

// Helper function to get dwarf page URL
function getDwarfPageUrl(dwarf) {
    return `dwarfs/${dwarf.id}-${normalizePolishName(dwarf.name)}.html`;
}

// Handle code input
function handleCodeInput(code) {
    const trimmedCode = code.trim().toUpperCase();
    console.log("Received code:", code);
    console.log("Trimmed code:", trimmedCode);
    
    // Special codes
    if (trimmedCode === "3541") {
        console.log("Redirecting to chata_niekochana.html");
        window.location.href = "dwarfs/chata_niekochana.html";
        return;
    }
    if (trimmedCode === "9331") {
        console.log("Redirecting to bistro.html");
        window.location.href = "dwarfs/bistro.html";
        return;
    }
    if (trimmedCode === "4659") {
        console.log("Redirecting to bracia.html");
        window.location.href = "dwarfs/bracia.html";
        return;
    }
    if (trimmedCode === "7291") {
        console.log("Redirecting to bydlin.html");
        window.location.href = "dwarfs/bydlin.html";
        return;
    }
    if (trimmedCode === "2214") {
        console.log("Redirecting to januszówka.html");
        window.location.href = "dwarfs/januszówka.html";
        return;
    }
    if (trimmedCode === "1942") {
        console.log("Redirecting to leśnik.html");
        window.location.href = "dwarfs/leśnik.html";
        return;
    }
    if (trimmedCode === "2375") {
        console.log("Redirecting to olkuskie_iglice.html");
        window.location.href = "dwarfs/olkuskie_iglice.html";
        return;
    }
    
    // Check if this code matches any dwarf QR code
    const matchingDwarf = dwarfData.find(dwarf => dwarf.qrCode === trimmedCode);
    
    if (matchingDwarf) {
        // Found a matching dwarf!
        if (!matchingDwarf.found) {
            matchingDwarf.found = true;
            saveDwarfData();
            
            // Show success message
            const resultsElement = document.getElementById('code-results');
            resultsElement.innerHTML = `Gratulacje! Znalazłeś dom ${matchingDwarf.name}a! <br><a href="${getDwarfPageUrl(matchingDwarf)}" class="success-link">Zobacz historię ${matchingDwarf.name}a</a>`;
            resultsElement.style.color = '#2d6a4f';
            
            // Update marker on map
            const markerIndex = dwarfData.findIndex(d => d.id === matchingDwarf.id);
            if (markerIndex !== -1) {
                markers[markerIndex].setPopupContent(
                    `<div class="map-popup found">
                        <div class="popup-title">Dom ${matchingDwarf.name}a</div>
                        <div class="popup-status">✅ Odkryto!</div>
                        <div class="popup-desc">${matchingDwarf.description}</div>
                        <a href="${getDwarfPageUrl(matchingDwarf)}" class="popup-link">Zobacz szczegóły</a>
                    </div>`
                );
            }
        } else {
            // Already found dwarf
            const resultsElement = document.getElementById('code-results');
            resultsElement.innerHTML = `Już znalazłeś dom ${matchingDwarf.name}a! <br><a href="${getDwarfPageUrl(matchingDwarf)}" class="success-link">Zobacz historię ${matchingDwarf.name}a</a>`;
            resultsElement.style.color = '#40916c';
        }
    } else {
        // No matching code
        const resultsElement = document.getElementById('code-results');
        resultsElement.textContent = `Nieprawidłowy kod magiczny. Spróbuj ponownie!`;
        resultsElement.style.color = '#9c2a2a';
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map
    initMap();
    
    // Load saved data
    loadDwarfData();
    
    // Set up the code input functionality
    const submitCodeButton = document.getElementById('submit-code');
    const magicCodeInput = document.getElementById('magic-code');
    
    if (submitCodeButton && magicCodeInput) {
        console.log("Event listeners being set up");
        submitCodeButton.addEventListener('click', () => {
            console.log("Button clicked!");
            const code = magicCodeInput.value;
            console.log("Input value:", code);
            if (code) {
                handleCodeInput(code);
                magicCodeInput.value = ''; // Clear input after submission
            } else {
                const resultsElement = document.getElementById('code-results');
                resultsElement.textContent = 'Proszę wprowadzić kod magiczny!';
                resultsElement.style.color = '#9c2a2a';
            }
        });
        
        // Allow Enter key to submit the code
        magicCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitCodeButton.click();
            }
        });
    }
    
    // Sprawdź, czy konwersja nazw krasnoludków działa poprawnie (do debugowania)
    console.log("Weryfikacja generowanych URL-i stron krasnoludków:");
    dwarfData.forEach(dwarf => {
        console.log(`${dwarf.name} -> ${getDwarfPageUrl(dwarf)}`);
    });
    
    // Sprawdź czy użytkownik korzysta z urządzenia mobilnego i czy aplikacja jest otwarta bezpośrednio
    checkMobileDevice();
});
