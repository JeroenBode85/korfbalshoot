# Korfbal Shoot! – configuratie en overdracht

## Wat werkt
- Nederlandstalige startpagina met originele aangeleverde gamebeelden.
- Live openbare clubstanden: alle pagina’s worden alleen-lezen opgehaald, maximaal zes verzoeken, 100 clubs per pagina. De huidige API levert 450 clubs.
- Zoeken op clubnaam en plaats, meer laden, veilige clubpagina’s, originele serverposities (gelijke standen behouden).
- Native delen, link kopiëren, vierkante PNG (1080 × 1080) en story-PNG (1080 × 1920), inclusief ophaalmoment.
- Eigen server-gerenderde titel en Open Graph-beschrijving voor startpagina, ranglijsten en iedere club.

## Configuratie
`src/lib/game-config.ts`: Play Store-link en `comingSoon`. Zet `comingSoon` op `true` voor de tekst “Binnenkort op Google Play”. De openbare beschikbaarheid en appbeoordelingen zijn niet geverifieerd; er worden geen ratings of downloadaantallen getoond.

De openbare API wordt rechtstreeks gelezen, zonder sleutel, login of schrijfrechten. Geen nieuw Cloud-project aangemaakt, geen wijzigingen in de bestaande gameomgeving. Gegevens worden 60 seconden gecachet per proces/browser en door de upstream API. Bij een nieuwe serverinstantie kan een nieuwe read plaatsvinden; upstream rate limiting moet door de eigenaar worden bevestigd. Search en limit worden upstream genegeerd; offset werkt. Websitepaginering en zoeken worden op de veilig opgehaalde clubgegevens toegepast, zonder scores of posities te herberekenen.

## Ontbrekende publieke koppelingen
De onderstaande URL’s zijn **voorgestelde contracten, geen bestaande endpoints**:
1. `GET /public-player-standings?mode=overall&cursor=...&limit=50&q=...`: openbare spelersnaam, publieke deel-ID (geen auth-ID), vereniging, serverpositie, record, fetched_at en paginering.
2. `GET /public-week-standings?week=YYYY-MM-DD&cursor=...&limit=50&q=...`: dezelfde velden met weekscore; week_start, week_end, next_reset_at, server_now en fetched_at als ISO-timestamps. Server berekent maandag 00.00 Europe/Amsterdam inclusief DST. Alleen hierdoor kunnen periode en countdown betrouwbaar worden getoond.
3. `GET /public-weeks`: veilige lijst beschikbare afgesloten weken. Daarna kan de eerdere-wekenkeuze met stabiele URL’s worden toegevoegd.
4. `GET /public-club-contributions?club_id=...`: maximaal vijf publicatie-goedgekeurde spelersnamen en records; nooit auth-ID, e-mail, sessies of spelerslocaties.

Alle endpoints: alleen GET, bounded pagination, 60-seconden cache, serverberekende scores en posities, rate limiting, publieke projectie met expliciete publicatiekeuze en passende toestemming voor minderjarigen. De beveiligde competition-functie is niet gebruikt.

## Ter beoordeling, niet uitgevoerd
Zonder bestaand schema, policies en consentmodel is uitvoerbare SQL of servercode voor de gameomgeving niet verantwoord. Eerst een door de eigenaar aangeleverd schema/policy-overzicht beoordelen; daarna afzonderlijk een SQL-migratie en endpointcode voorbereiden. Geen gok naar tabelnamen of RLS, niets toegepast. De ontbrekende koppelingen tonen nu een beschikbaarheidsmelding, geen demoresultaten.

## Social previews
De clubnaam, stand en score worden al in server-gerenderde metadata getoond. Een echte crawler-leesbare absolute previewafbeelding per resultaat is **nog niet aangesloten**; PNG-downloads zijn geen crawler-afbeeldingen. Voor oplevering van de volledige social-previewfunctie is een publieke alleen-lezen beeldendpoint of vooraf gegenereerde beeldopslag nodig, na goedkeuring van hosting/Cloud. Maak dan `og:image` en `twitter:image` absolute HTTPS-URL’s voor dezelfde kaart; test na publicatie met WhatsApp en social debuggers. Persoonlijke resultaatlinks en eerdere-weeklinks volgen zodra de veilige bronnen bestaan.

## Assets en inhoud
- Startscherm, ballencollectie, dagveld en nachtveld zijn als originele assets opgeslagen.
- Voor een nog vrijere openingscompositie: los transparant logo, korf+paal en geel-blauwe bal aanleveren. De huidige screenshot blijft intact qua verhouding.
- Geen clublogo’s aangeleverd: initialenemblemen gebruikt.
- Officiële privacyverklaring en contactgegevens ontbreken; de footer noemt dit eerlijk en verzint niets.
- Deelkaarten gebruiken momenteel typografische branding; voor het originele grafische game-logo in de kaart is een transparant los logo nodig.

## Publicatie
Niet gepubliceerd. Publicatie en wijzigingen aan de bestaande omgeving vereisen expliciete toestemming.