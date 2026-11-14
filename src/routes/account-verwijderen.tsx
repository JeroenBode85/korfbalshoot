import { createFileRoute } from '@tanstack/react-router';
import { ShieldCheck } from 'lucide-react';
import { GameLayout } from '@/components/game-layout';
import { pageHead } from '@/lib/page-head';

export const Route = createFileRoute('/account-verwijderen')({
  head: () => ({
    ...pageHead('Account en gegevens verwijderen | Korfbal Shoot!', 'Vraag via info@korfbalshoot.nl verwijdering van je Korfbal Shoot!-account of afzonderlijke gegevens aan. Lees welke gegevens worden verwijderd en hoe lang de afhandeling duurt.'),
    meta: [
      ...pageHead('Account en gegevens verwijderen | Korfbal Shoot!', 'Vraag via info@korfbalshoot.nl verwijdering van je Korfbal Shoot!-account of afzonderlijke gegevens aan. Lees welke gegevens worden verwijderd en hoe lang de afhandeling duurt.').meta,
      { property: 'og:url', content: 'https://korfbalshoot.lovable.app/account-verwijderen' },
    ],
    links: [{ rel: 'canonical', href: 'https://korfbalshoot.lovable.app/account-verwijderen' }],
  }),
  component: AccountDeletionPage,
});

function AccountDeletionPage() {
  return (
    <GameLayout>
      <section className="legal-page">
        <div className="container-game legal-inner">
          <span className="eyebrow"><ShieldCheck />KORFBAL SHOOT!</span>
          <h1>Account en gegevens verwijderen</h1>
          <p className="legal-lead">Bij Korfbal Shoot! vinden we het belangrijk dat je zelf controle hebt over je persoonsgegevens.</p>
          <p className="mt-4 text-base leading-relaxed">Wil je jouw spelersaccount verwijderen of bepaalde gegevens laten verwijderen? Dan kun je hiervoor eenvoudig een verzoek indienen via e-mail.</p>
          <div className="legal-body">
            <section>
              <h2>Hoe vraag je verwijdering aan?</h2>
              <ol className="mt-3 list-decimal space-y-3 pl-6 text-[15px] leading-relaxed text-muted-foreground">
                <li>Stuur een e-mail naar <a className="legal-mail" href="mailto:info@korfbalshoot.nl">info@korfbalshoot.nl</a>.</li>
                <li>Vermeld als onderwerp: <strong className="text-foreground">Verzoek gegevens verwijderen – Korfbal Shoot!</strong></li>
                <li>Vermeld je spelersnaam en eventueel je vereniging.</li>
                <li>Geef aan wat je wilt laten verwijderen:
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    <li>Je volledige spelersaccount en bijbehorende gegevens.</li>
                    <li>Alleen bepaalde persoonsgegevens of opgeslagen scores.</li>
                  </ul>
                </li>
              </ol>
              <p>Na ontvangst beoordelen we je verzoek. Indien nodig vragen we aanvullende informatie om te controleren of het betreffende account van jou is.</p>
            </section>
            <section>
              <h2>Welke gegevens kunnen worden verwijderd?</h2>
              <p>Bij het verwijderen van een volledig spelersaccount worden de bijbehorende persoonsgegevens verwijderd, waaronder, voor zover aanwezig:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-[15px] leading-relaxed text-muted-foreground">
                <li>Spelersnaam</li>
                <li>Vereniging</li>
                <li>Gekoppeld e-mailadres</li>
                <li>Opgeslagen scores</li>
                <li>Gegevens van het spelersprofiel</li>
              </ul>
              <p>Na verwijdering zijn je account en bijbehorende gegevens niet meer beschikbaar. Ook kunnen je scores verdwijnen uit de online klassementen.</p>
            </section>
            <section>
              <h2>Hoe lang duurt het?</h2>
              <p>We behandelen verwijderingsverzoeken zo snel mogelijk en uiterlijk binnen één maand na ontvangst, tenzij een wettelijk toegestane verlenging van toepassing is.</p>
              <p>Als we bepaalde gegevens om wettelijke redenen langer moeten bewaren, informeren we je welke gegevens dat zijn, waarom en hoelang ze worden bewaard.</p>
            </section>
            <section>
              <h2>Vragen?</h2>
              <p>Heb je vragen over je account, je gegevens of het verwijderen daarvan?</p>
              <p>Neem gerust contact op via:</p>
              <p><a className="legal-mail font-bold" href="mailto:info@korfbalshoot.nl">info@korfbalshoot.nl</a></p>
            </section>
          </div>
        </div>
      </section>
    </GameLayout>
  );
}