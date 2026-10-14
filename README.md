# Creator Quickscan — A Bigger Circle

Werkende vragenlijst-website op basis van `PDF prototype.pdf` en
`briefing duncan.docx`. Geen build-stap nodig: puur HTML/CSS/JS.

## Lokaal bekijken

Open `index.html` niet rechtstreeks als bestand (de browser blokkeert dan
de `<script>`-bestanden). Start in plaats daarvan een eenvoudige lokale
server vanuit deze map, bijvoorbeeld:

```
npx serve .
```

en open de getoonde localhost-URL.

## Bestanden

- `index.html` — basis-HTML (laadt de fonts, CSS en JS).
- `css/style.css` — alle styling, met de ABC-kleuren als CSS-variabelen.
- `js/content.js` — alle teksten, vragen, scoreregels en voorbeeldadvies-
  /creatorprofielteksten.
- `js/app.js` — de applicatielogica (navigatie, scoring, matching, render).
- `assets/LEESMIJ.txt` — uitleg waar het echte logo en de "Obviously"-
  fontbestanden moeten komen zodra ze beschikbaar zijn.

## Status t.o.v. de briefing — Fase 1 (klaar)

- Alle vragen en antwoordopties uit het prototype.
- Navigatie met voortgangsbalk; teruggaan verliest geen antwoorden.
- Automatische puntentelling per stelling (Nooit=0 … Altijd=3).
- Score per onderdeel: (punten/9)×100. Totaalscore: (punten/63)×100.
- Automatische bepaling van de 2 sterkste en 2 zwakste onderdelen.
- Resultatenpagina met de echte, berekende scores.
- Transparantievraag apart opgeslagen, telt niet mee in de score.
- Voorbeeldadvies (quick win / volgende stap / langetermijndoel) en
  3 fictieve creatorprofielen — vooraf geschreven teksten die automatisch
  geselecteerd/gematcht worden op basis van de echte antwoorden (budget,
  gekozen platformen, merkwoorden, contentsoort). Dit is de fase 1
  vervanger voor de AI-koppeling.
- Huisstijlkleuren uit de brand guidelines toegepast; placeholder-
  lettertype (Oswald/Work Sans) totdat "Obviously" wordt aangeleverd.
- Responsive voor mobiel en desktop.

De exacte grenzen tussen scoreniveaus ("Startpunt", "In ontwikkeling",
"Goed op weg", "Sterk onderbouwd") in `js/content.js` (`LEVELS`) zijn een
voorlopige indeling — pas aan zodra dit is afgestemd.

## Nog te doen (fase 2 en 3, zoals in de briefing)

- Echte AI-koppeling voor persoonlijke adviezen/profielen in plaats van
  de huidige vooraf geschreven tekstenpool.
- Daadwerkelijk e-mailen van resultaten en een PDF-rapport genereren.
- Echte agenda-koppeling voor "Plan een gesprek" (nu alleen een lokale
  bevestiging, niet gekoppeld aan een systeem).
- Privacyverklaring en toestemming voor gegevensverwerking.
- Origineel logo en "Obviously"-lettertype verwerken (zie
  `assets/LEESMIJ.txt`).
