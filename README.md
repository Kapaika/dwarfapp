# Poszukiwanie Domów Krasnoludków

Aplikacja internetowa do gry terenowej polegającej na poszukiwaniu ukrytych domów krasnoludków w Jurze Krakowsko-Częstochowskiej.

## Funkcjonalności

- Interaktywna mapa z lokalizacjami domów krasnoludków
- Skaner kodów QR do wykrywania znalezionych domów
- Śledzenie postępów w znajdowaniu wszystkich domów
- Geolokalizacja pokazująca aktualne położenie użytkownika i odległości do domów krasnoludków
- Indywidualne strony dla każdego domu z historią, zdjęciami i nagraniami audio

## Jak to działa

1. Dzieci korzystają z mapy na stronie, aby zlokalizować domy krasnoludków (oznaczone pinezkami)
2. W każdej lokalizacji będzie kod QR do zeskanowania
3. Korzystając ze skanera QR na stronie, dzieci mogą zeskanować kod, aby oznaczyć dom krasnoludka jako znaleziony
4. Po znalezieniu krasnoludka, dzieci mogą przeczytać jego historię, obejrzeć zdjęcia i posłuchać narracji audio
5. Celem jest odnalezienie wszystkich siedmiu domów krasnoludków!

## Instrukcja przygotowania

### 1. Kody QR

Kody QR dla każdego z krasnoludków można wygenerować używając następujących wartości:

- Mędrek: `dwarf-doc-1234`
- Gburek: `dwarf-grumpy-5678`
- Wesołek: `dwarf-happy-9012`
- Śpioszek: `dwarf-sleepy-3456`
- Nieśmiałek: `dwarf-bashful-7890`
- Apsik: `dwarf-sneezy-1357`
- Gapcio: `dwarf-dopey-2468`

Do wygenerowania kodów QR można użyć dowolnego generatora, na przykład: https://www.qr-code-generator.com/

### 2. Zdjęcia

W aplikacji są zarezerwowane miejsca na 3 zdjęcia dla każdego krasnoludka. Należy je umieścić w folderze `images/` o nazwach:

- `medrek-1.jpg`, `medrek-2.jpg`, `medrek-3.jpg`
- `gburek-1.jpg`, `gburek-2.jpg`, `gburek-3.jpg`
- `wesolek-1.jpg`, `wesolek-2.jpg`, `wesolek-3.jpg`
- `spioszek-1.jpg`, `spioszek-2.jpg`, `spioszek-3.jpg`
- `niesmialek-1.jpg`, `niesmialek-2.jpg`, `niesmialek-3.jpg`
- `apsik-1.jpg`, `apsik-2.jpg`, `apsik-3.jpg`
- `gapcio-1.jpg`, `gapcio-2.jpg`, `gapcio-3.jpg`

Jeśli zdjęcia nie zostaną dodane, aplikacja wyświetli zastępcze obrazy.

### 3. Nagrania Audio

Dla każdego krasnoludka należy przygotować nagranie audio opowiadające jego historię i umieścić je w folderze `audio/` o nazwach:

- `medrek.mp3`
- `gburek.mp3`
- `wesolek.mp3`
- `spioszek.mp3`
- `niesmialek.mp3`
- `apsik.mp3`
- `gapcio.mp3`

## Uruchamianie aplikacji

Aplikacja jest statyczną stroną internetową, więc wystarczy otworzyć plik `index.html` w przeglądarce.

Dla lepszego doświadczenia, zaleca się uruchomienie jej na lokalnym serwerze HTTP:

```bash
# Jeśli masz zainstalowany Python 3
python3 -m http.server

# Jeśli masz zainstalowany Node.js
npx http-server
```

## Dla urządzeń mobilnych

Aplikacja jest zoptymalizowana pod urządzenia mobilne i oferuje funkcję "Dodaj do ekranu głównego", dzięki czemu może działać jak natywna aplikacja.

## Wymagania

- Nowoczesna przeglądarka internetowa z włączonym JavaScript
- Dostęp do kamery do skanowania kodów QR
- Dostęp do geolokalizacji (opcjonalnie, do obliczania odległości)
- Połączenie z Internetem (do ładowania kafelków mapy)

## Udanej zabawy!
