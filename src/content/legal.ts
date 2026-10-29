import type { Lang } from "@/i18n/translations";

// Texts of the legal pages (/legal/privacy, /legal/terms, /legal/imprint).
// They describe what the app actually does: keep them in sync when adding a
// new service, tracker, payment or kind of personal data.
//
// TODO before going live: replace every [bracketed] value in OPERATOR.
export const OPERATOR = {
  name: "[Full name or company name]",
  address: "[Street and number], [Postcode] [City], Germany",
  email: "[contact@memoriz.club]",
  // Required for companies only; leave empty otherwise
  register: "",
  vatId: "",
  // Region of the Supabase project (Supabase dashboard > Project settings > General)
  databaseRegion: "[e.g. EU (Frankfurt)]",
};

export const LEGAL_UPDATED = "2026-10-29";

export type LegalDocId = "privacy" | "terms" | "imprint";

export type LegalDoc = {
  title: string;
  sections: { heading?: string; paragraphs: string[] }[];
};

const o = OPERATOR;

const en: Record<LegalDocId, LegalDoc> = {
  imprint: {
    title: "Legal notice",
    sections: [
      {
        heading: "Information according to § 5 DDG",
        paragraphs: [
          o.name,
          o.address,
          `Email: ${o.email}`,
          ...(o.register ? [o.register] : []),
          ...(o.vatId ? [`VAT ID: ${o.vatId}`] : []),
        ],
      },
      {
        heading: "Responsible for content according to § 18 (2) MStV",
        paragraphs: [`${o.name}, ${o.address}`],
      },
      {
        heading: "Pages created by users",
        paragraphs: [
          "Pages published at memoriz.club/<name> are created by our users, who are responsible for their content. We do not check them before they are published. If a page breaks the law or your rights, use the “Report this page” link at the bottom of it or write to us, and we will act promptly.",
        ],
      },
      {
        heading: "Consumer dispute resolution",
        paragraphs: [
          "We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.",
        ],
      },
    ],
  },

  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "1. Who is responsible",
        paragraphs: [
          `The controller for the processing of personal data on Memoriz is ${o.name}, ${o.address}, ${o.email}. Write to this address for any question about your data or to exercise your rights.`,
        ],
      },
      {
        heading: "2. What we process and why",
        paragraphs: [
          "Account: your name, email address and password (stored only as a hash). We need them to create your account, sign you in and send you the email confirming your address. Legal basis: performance of our contract with you (Art. 6 (1) (b) GDPR). We also store the date on which you accepted the Terms and confirmed your age, as proof (Art. 6 (1) (c) and (f) GDPR).",
          "Your page: the texts, photos, colours, song titles and YouTube links you add, and the language and address (URL) you choose. Photos are re-encoded in your browser before upload, which removes metadata such as the GPS position where they were taken. Your draft is visible only to you. When you publish, the page becomes visible to anyone who has its link. Legal basis: Art. 6 (1) (b) GDPR.",
          "Content about other people: the page may contain the name, photos and memories of the person you make it for, or of others. Please only add them if they agree to it. We process this data on your behalf and only to show your page.",
          "Technical data: when you open any page, our hosting provider processes your IP address, the date and time, the page requested and your browser's user agent to deliver the page and protect the service against abuse. These logs are deleted automatically after a short period. When you publish, we log your account ID and the page address to prevent abuse. Legal basis: our legitimate interest in a secure service (Art. 6 (1) (f) GDPR).",
        ],
      },
      {
        heading: "3. Storage on your device",
        paragraphs: [
          "We do not use cookies, analytics or advertising trackers. We store in your browser's local storage only what the service needs to work: your sign-in session (while you are signed in), your language choice, and for the current visit only, whether you have already seen the introduction tour. This is strictly necessary for the service you request (§ 25 (2) no. 2 TDDDG), so no consent banner is needed.",
        ],
      },
      {
        heading: "4. Service providers",
        paragraphs: [
          `Supabase Inc. (USA) hosts our database, sign-in and confirmation emails. Region of the database: ${o.databaseRegion}.`,
          "Vercel Inc. (USA) hosts the website and delivers it to your browser.",
          "Both process data only on our instructions under a data processing agreement (Art. 28 GDPR). Where data may reach the USA, transfers are covered by the EU–US Data Privacy Framework and/or the EU Standard Contractual Clauses.",
          "Fonts are served from our own servers; no request is made to Google Fonts.",
        ],
      },
      {
        heading: "5. YouTube",
        paragraphs: [
          "Songs in a playlist are played through YouTube, a service of Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland. The YouTube player is only loaded when you press play, in YouTube's privacy-enhanced mode (youtube-nocookie.com). From then on, Google receives your IP address and information about your device and may process it according to its own privacy policy (policies.google.com/privacy), including in the USA. Legal basis: your action of pressing play (Art. 6 (1) (a) GDPR, § 25 (1) TDDDG). You can avoid this by not playing songs.",
          "While you edit a song, the title and artist you enter may be sent to the YouTube Data API to find the matching video automatically.",
        ],
      },
      {
        heading: "6. How long we keep your data",
        paragraphs: [
          "We keep your account and page until you delete your account. You can do this at any time from the account menu of the dashboard: your account, page and public link are deleted immediately. Copies in our provider's backups are overwritten within their backup cycle (a few days).",
        ],
      },
      {
        heading: "7. Your rights",
        paragraphs: [
          "You have the right to access your data (Art. 15 GDPR), to rectification (Art. 16), to erasure (Art. 17), to restriction of processing (Art. 18), to data portability (Art. 20) and to object to processing based on legitimate interests (Art. 21). You can download your data and delete your account yourself from the dashboard; for anything else, write to us.",
          "You also have the right to lodge a complaint with a data protection supervisory authority, in particular in the EU member state where you live or work.",
        ],
      },
      {
        heading: "8. Minimum age",
        paragraphs: [
          "Memoriz is intended for people aged 16 and over. We do not knowingly collect data from younger children. If you believe a child under 16 has created an account, contact us and we will delete it.",
        ],
      },
    ],
  },

  terms: {
    title: "Terms of Service",
    sections: [
      {
        heading: "1. The service",
        paragraphs: [
          `Memoriz, operated by ${o.name} (see Legal notice), lets you build a personal web page from templates and publish it at an address of your choice. The service is currently free of charge.`,
        ],
      },
      {
        heading: "2. Your account",
        paragraphs: [
          "You must be at least 16 years old to create an account. Give accurate information and keep your password secret. You are responsible for what happens in your account.",
        ],
      },
      {
        heading: "3. Your content",
        paragraphs: [
          "You remain the owner of what you add to your page. You give us the non-exclusive, free right to store, process and display it, only as needed to run the service and to show your page to the people you share it with. This right ends when you delete the content or your account.",
          "You are responsible for your content. You confirm that you have the rights to the texts and photos you add, and that the people shown or named agree to appear on your page.",
          "It is forbidden to publish content that is illegal, or that infringes the rights of others (copyright, privacy, personality rights), or that is hateful, harassing, pornographic, violent, or that sexualises minors, or that is used to impersonate someone, deceive or spread malware.",
        ],
      },
      {
        heading: "4. Published pages",
        paragraphs: [
          "A published page can be seen by anyone who has its link. We ask search engines not to list it, but cannot guarantee that a shared link stays private. Changes you make only go live when you publish again.",
          "Songs are played from YouTube. Their availability depends on YouTube, and YouTube's terms apply to them.",
        ],
      },
      {
        heading: "5. Reports and removal",
        paragraphs: [
          "Anyone can report a page with the link at its bottom or by email. We may remove content, take a page offline or close an account that breaks these Terms or the law, and will tell the account holder why, unless the law prevents it.",
        ],
      },
      {
        heading: "6. Availability",
        paragraphs: [
          "We work to keep Memoriz available but, as a free service, cannot guarantee uninterrupted operation. We may change or discontinue features; if we close the service, we will tell you in advance where possible.",
        ],
      },
      {
        heading: "7. Liability",
        paragraphs: [
          "We are liable without limitation for intent and gross negligence, for injury to life, body or health, and under the Product Liability Act. For slight negligence, we are liable only for the breach of an essential contractual obligation, limited to the foreseeable damage typical of the contract. Otherwise our liability is excluded.",
        ],
      },
      {
        heading: "8. Ending the contract",
        paragraphs: [
          "You can delete your account at any time from the dashboard. We may end the contract with two weeks' notice, or immediately for a serious breach of these Terms.",
        ],
      },
      {
        heading: "9. Changes and applicable law",
        paragraphs: [
          "We may update these Terms for good reason. We will inform you of important changes before they apply; you can then delete your account if you do not agree.",
          "German law applies. If you are a consumer, this does not remove the protection of the mandatory law of the country where you live.",
        ],
      },
    ],
  },
};

const fr: Record<LegalDocId, LegalDoc> = {
  imprint: {
    title: "Mentions légales",
    sections: [
      {
        heading: "Informations selon le § 5 DDG (droit allemand)",
        paragraphs: [
          o.name,
          o.address,
          `E-mail : ${o.email}`,
          ...(o.register ? [o.register] : []),
          ...(o.vatId ? [`N° de TVA : ${o.vatId}`] : []),
        ],
      },
      {
        heading: "Responsable du contenu selon le § 18 (2) MStV",
        paragraphs: [`${o.name}, ${o.address}`],
      },
      {
        heading: "Pages créées par les utilisateurs",
        paragraphs: [
          "Les pages publiées sur memoriz.club/<nom> sont créées par nos utilisateurs, qui sont responsables de leur contenu. Nous ne les vérifions pas avant leur publication. Si une page enfreint la loi ou vos droits, utilisez le lien « Signaler cette page » en bas de celle-ci ou écrivez-nous : nous agirons rapidement.",
        ],
      },
      {
        heading: "Règlement des litiges de consommation",
        paragraphs: [
          "Nous ne sommes ni disposés ni tenus à participer à une procédure de règlement des litiges devant un organisme de médiation de la consommation.",
        ],
      },
    ],
  },

  privacy: {
    title: "Politique de confidentialité",
    sections: [
      {
        heading: "1. Responsable du traitement",
        paragraphs: [
          `Le responsable du traitement des données personnelles sur Memoriz est ${o.name}, ${o.address}, ${o.email}. Écrivez à cette adresse pour toute question sur vos données ou pour exercer vos droits.`,
        ],
      },
      {
        heading: "2. Données traitées et finalités",
        paragraphs: [
          "Compte : votre nom, votre adresse e-mail et votre mot de passe (stocké uniquement sous forme chiffrée). Ils servent à créer votre compte, à vous connecter et à vous envoyer l’e-mail de confirmation de votre adresse. Base légale : exécution du contrat (art. 6 (1) (b) RGPD). Nous conservons aussi la date à laquelle vous avez accepté les conditions et confirmé votre âge, à titre de preuve (art. 6 (1) (c) et (f) RGPD).",
          "Votre page : les textes, photos, couleurs, titres de chansons et liens YouTube que vous ajoutez, ainsi que la langue et l’adresse (URL) choisies. Les photos sont réencodées dans votre navigateur avant l’envoi, ce qui supprime les métadonnées comme la position GPS de la prise de vue. Votre brouillon n’est visible que par vous. Une fois publiée, la page est visible par toute personne disposant du lien. Base légale : art. 6 (1) (b) RGPD.",
          "Contenu concernant d’autres personnes : la page peut contenir le nom, les photos et les souvenirs de la personne à qui vous la destinez, ou d’autres personnes. N’ajoutez-les qu’avec leur accord. Nous traitons ces données pour votre compte et uniquement pour afficher votre page.",
          "Données techniques : à chaque ouverture d’une page, notre hébergeur traite votre adresse IP, la date et l’heure, la page demandée et l’agent utilisateur de votre navigateur afin de livrer la page et de protéger le service contre les abus. Ces journaux sont supprimés automatiquement après une courte durée. Lors d’une publication, nous enregistrons l’identifiant de votre compte et l’adresse de la page pour prévenir les abus. Base légale : notre intérêt légitime à un service sûr (art. 6 (1) (f) RGPD).",
        ],
      },
      {
        heading: "3. Stockage sur votre appareil",
        paragraphs: [
          "Nous n’utilisons ni cookies, ni outils de mesure d’audience, ni traceurs publicitaires. Nous stockons dans le stockage local de votre navigateur uniquement ce qui est nécessaire au service : votre session de connexion (tant que vous êtes connecté), votre choix de langue et, pour la visite en cours seulement, le fait d’avoir déjà vu la visite guidée. Ce stockage est strictement nécessaire au service demandé (§ 25 (2) n° 2 TDDDG) ; aucun bandeau de consentement n’est donc requis.",
        ],
      },
      {
        heading: "4. Prestataires",
        paragraphs: [
          `Supabase Inc. (États-Unis) héberge notre base de données, la connexion et les e-mails de confirmation. Région de la base de données : ${o.databaseRegion}.`,
          "Vercel Inc. (États-Unis) héberge le site et le livre à votre navigateur.",
          "Tous deux traitent les données uniquement sur nos instructions, dans le cadre d’un contrat de sous-traitance (art. 28 RGPD). Lorsque des données peuvent être transférées aux États-Unis, ces transferts sont encadrés par le EU–US Data Privacy Framework et/ou les clauses contractuelles types de l’UE.",
          "Les polices sont servies depuis nos propres serveurs ; aucune requête n’est envoyée à Google Fonts.",
        ],
      },
      {
        heading: "5. YouTube",
        paragraphs: [
          "Les chansons d’une playlist sont lues via YouTube, un service de Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlande. Le lecteur YouTube n’est chargé que lorsque vous appuyez sur lecture, en mode de confidentialité renforcée (youtube-nocookie.com). À partir de ce moment, Google reçoit votre adresse IP et des informations sur votre appareil et peut les traiter selon sa propre politique de confidentialité (policies.google.com/privacy), y compris aux États-Unis. Base légale : votre action d’appuyer sur lecture (art. 6 (1) (a) RGPD, § 25 (1) TDDDG). Pour l’éviter, il suffit de ne pas lancer de chanson.",
          "Lorsque vous modifiez une chanson, le titre et l’artiste saisis peuvent être envoyés à l’API YouTube Data pour trouver automatiquement la vidéo correspondante.",
        ],
      },
      {
        heading: "6. Durée de conservation",
        paragraphs: [
          "Nous conservons votre compte et votre page jusqu’à la suppression de votre compte. Vous pouvez la faire à tout moment depuis le menu Compte du tableau de bord : votre compte, votre page et son lien public sont supprimés immédiatement. Les copies dans les sauvegardes de notre prestataire sont écrasées au fil de son cycle de sauvegarde (quelques jours).",
        ],
      },
      {
        heading: "7. Vos droits",
        paragraphs: [
          "Vous disposez d’un droit d’accès (art. 15 RGPD), de rectification (art. 16), d’effacement (art. 17), de limitation du traitement (art. 18), à la portabilité (art. 20) et d’opposition aux traitements fondés sur l’intérêt légitime (art. 21). Vous pouvez télécharger vos données et supprimer votre compte vous-même depuis le tableau de bord ; pour toute autre demande, écrivez-nous.",
          "Vous pouvez également introduire une réclamation auprès d’une autorité de protection des données, notamment dans l’État membre de l’UE où vous résidez ou travaillez (en France : la CNIL).",
        ],
      },
      {
        heading: "8. Âge minimum",
        paragraphs: [
          "Memoriz s’adresse aux personnes de 16 ans et plus. Nous ne collectons pas sciemment de données concernant des enfants plus jeunes. Si vous pensez qu’un enfant de moins de 16 ans a créé un compte, contactez-nous et nous le supprimerons.",
        ],
      },
    ],
  },

  terms: {
    title: "Conditions d’utilisation",
    sections: [
      {
        heading: "1. Le service",
        paragraphs: [
          `Memoriz, exploité par ${o.name} (voir Mentions légales), vous permet de créer une page web personnelle à partir de modèles et de la publier à l’adresse de votre choix. Le service est actuellement gratuit.`,
        ],
      },
      {
        heading: "2. Votre compte",
        paragraphs: [
          "Vous devez avoir au moins 16 ans pour créer un compte. Donnez des informations exactes et gardez votre mot de passe secret. Vous êtes responsable de ce qui se passe sur votre compte.",
        ],
      },
      {
        heading: "3. Votre contenu",
        paragraphs: [
          "Vous restez propriétaire de ce que vous ajoutez à votre page. Vous nous accordez le droit non exclusif et gratuit de le stocker, de le traiter et de l’afficher, uniquement dans la mesure nécessaire au fonctionnement du service et à l’affichage de votre page aux personnes avec qui vous la partagez. Ce droit prend fin lorsque vous supprimez le contenu ou votre compte.",
          "Vous êtes responsable de votre contenu. Vous confirmez détenir les droits sur les textes et photos que vous ajoutez, et que les personnes représentées ou nommées acceptent d’apparaître sur votre page.",
          "Il est interdit de publier un contenu illégal, qui porte atteinte aux droits d’autrui (droit d’auteur, vie privée, droit à l’image), haineux, harcelant, pornographique, violent, sexualisant des mineurs, ou servant à usurper une identité, tromper ou diffuser des logiciels malveillants.",
        ],
      },
      {
        heading: "4. Pages publiées",
        paragraphs: [
          "Une page publiée peut être vue par toute personne disposant de son lien. Nous demandons aux moteurs de recherche de ne pas la référencer, mais ne pouvons garantir qu’un lien partagé reste privé. Vos modifications ne sont en ligne qu’après une nouvelle publication.",
          "Les chansons sont lues depuis YouTube. Leur disponibilité dépend de YouTube, dont les conditions s’appliquent.",
        ],
      },
      {
        heading: "5. Signalements et retrait",
        paragraphs: [
          "Chacun peut signaler une page via le lien en bas de celle-ci ou par e-mail. Nous pouvons retirer un contenu, mettre une page hors ligne ou fermer un compte qui enfreint ces conditions ou la loi, et en informerons le titulaire du compte avec les motifs, sauf si la loi l’interdit.",
        ],
      },
      {
        heading: "6. Disponibilité",
        paragraphs: [
          "Nous faisons en sorte que Memoriz reste disponible mais, s’agissant d’un service gratuit, ne pouvons garantir un fonctionnement ininterrompu. Nous pouvons modifier ou arrêter des fonctionnalités ; si nous fermons le service, nous vous en informerons à l’avance dans la mesure du possible.",
        ],
      },
      {
        heading: "7. Responsabilité",
        paragraphs: [
          "Notre responsabilité est illimitée en cas de faute intentionnelle ou de négligence grave, d’atteinte à la vie, au corps ou à la santé, et au titre de la loi sur la responsabilité du fait des produits. En cas de négligence légère, nous ne sommes responsables qu’en cas de manquement à une obligation contractuelle essentielle, dans la limite du dommage prévisible et typique du contrat. Toute autre responsabilité est exclue.",
        ],
      },
      {
        heading: "8. Fin du contrat",
        paragraphs: [
          "Vous pouvez supprimer votre compte à tout moment depuis le tableau de bord. Nous pouvons mettre fin au contrat avec un préavis de deux semaines, ou immédiatement en cas de manquement grave à ces conditions.",
        ],
      },
      {
        heading: "9. Modifications et droit applicable",
        paragraphs: [
          "Nous pouvons modifier ces conditions pour un motif légitime. Nous vous informerons des changements importants avant leur entrée en vigueur ; vous pourrez alors supprimer votre compte si vous n’êtes pas d’accord.",
          "Le droit allemand s’applique. Si vous êtes consommateur, cela ne vous prive pas de la protection des dispositions impératives du droit de votre pays de résidence.",
        ],
      },
    ],
  },
};

export const legalDocs: Record<Lang, Record<LegalDocId, LegalDoc>> = { en, fr };

export const isLegalDocId = (value: string | undefined): value is LegalDocId =>
  value === "privacy" || value === "terms" || value === "imprint";
