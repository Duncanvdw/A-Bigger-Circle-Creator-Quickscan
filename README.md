# Creator Quickscan — A Bigger Circle

Werkende vragenlijst-website op basis van het Adobe XD-prototype van
A Bigger Circle, `PDF prototype.pdf` en `briefing duncan.docx`. Geen
build-stap nodig: puur HTML/CSS/JS.

## Lokaal bekijken

Open `index.html` niet rechtstreeks als bestand (de browser blokkeert dan
de `<script>`-bestanden). Start in plaats daarvan een eenvoudige lokale
server vanuit deze map, bijvoorbeeld:

```
npx serve .
```

en open de getoonde localhost-URL.

## Bestanden

- `index.html` — basis-HTML (laadt de CSS en JS).
- `style.css` — alle styling: ABC-kleuren als CSS-variabelen en de
  @font-face-regels voor de echte "Obviously"-fontbestanden.
- `content.js` — alle teksten, vragen, scoreregels en voorbeeldadvies-
  /creatorprofielteksten.
- `app.js` — de applicatielogica (navigatie, scoring, matching, render).
- `Obviously-*.otf` — de officiële ABC-lettertypebestanden.
- `LEESMIJ.txt` — uitleg over het (nog ontbrekende) logo.

## Status t.o.v. de briefing — Fase 1 (klaar)

- Alle vragen en antwoordopties uit het prototype.
- Schermvolgorde volgt het Adobe XD-prototype: welkom → introvragen →
  "over jouw merk" → de zeven scorende onderdelen → transparantie →
  resultatenoverzicht (met ingebedde CTA) → tussenscherm → resultaten-
  carrousel (score + jouw antwoorden, 3 creatorprofielen, vervolgstappen,
  grootste kansen, afsluitende CTA).
- Navigatie met voortgangsbalk tijdens de vragen; teruggaan verliest geen
  antwoorden.
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
- Huisstijlkleuren uit de brand guidelines toegepast (nergens zwart of
  grijs: alleen ultramarine/oat/bblue + de secundaire cheer/connect/care-
  accenten); het echte "Obviously"-lettertype (Condensed Bold voor titels,
  Condensed SemiBold voor koppen, Extended Medium/Light voor subkoppen,
  Regular/Italic/SemiBold voor lopende tekst).
- Responsive voor mobiel en desktop.

De exacte grenzen tussen scoreniveaus ("Startpunt", "In ontwikkeling",
"Goed op weg", "Sterk onderbouwd") in `content.js` (`LEVELS`) zijn een
voorlopige indeling — pas aan zodra dit is afgestemd.

## Nog te doen (fase 2 en 3, zoals in de briefing)

- Echte AI-koppeling voor persoonlijke adviezen/profielen in plaats van
  de huidige vooraf geschreven tekstenpool.
- Daadwerkelijk e-mailen van resultaten en een PDF-rapport genereren.
- Echte agenda-koppeling voor "Plan een gesprek" (nu alleen een lokale
  bevestiging, niet gekoppeld aan een systeem).
- Privacyverklaring en toestemming voor gegevensverwerking.
- Origineel logo verwerken zodra aangeleverd (zie `LEESMIJ.txt`) — het
  lettertype staat al.
