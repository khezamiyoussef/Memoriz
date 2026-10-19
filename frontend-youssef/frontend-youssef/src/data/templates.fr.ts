// French text for the templates in ./templates.ts. Structure (ids, field types,
// min/max) comes from the English definitions; anything not listed here falls
// back to English.

interface FieldText {
  label?: string;
  defaultValue?: string;
  placeholder?: string;
}

interface TemplateText {
  name: string;
  description: string;
  fields: Record<string, FieldText>;
}

const photoCaption = 'Légende de la photo';
const date = 'Date';
const eventTitle = "Titre de l'événement";
const eventDesc = "Description de l'événement";
const songName = 'Nom de la chanson';
const artistName = "Nom de l'artiste";
const songMemory = 'Pourquoi cette chanson compte...';
const writePromise = 'Écris une promesse...';
const describeWord = 'Décris ce mot...';

export const TEMPLATES_FR: Record<string, TemplateText> = {
  hero: {
    name: "Section d'accueil",
    description: 'Grand en-tête avec image de fond et texte superposé',
    fields: {
      title: { label: 'Titre', defaultValue: 'Bienvenue', placeholder: 'Saisissez le titre principal' },
      subtitle: { label: 'Sous-titre', defaultValue: 'Un joli message pour toi', placeholder: 'Saisissez le sous-titre' },
      buttonText: { label: 'Texte du bouton', defaultValue: 'Découvrir', placeholder: 'Libellé du bouton' },
      backgroundImage: { label: 'Image de fond' },
    },
  },
  'photo-gallery': {
    name: 'Galerie photos',
    description: 'Jolie galerie en grille avec légendes',
    fields: {
      title: { label: 'Titre de la section', defaultValue: 'Nos souvenirs', placeholder: 'Titre de la galerie' },
      photo1: { label: 'Photo 1' },
      caption1: { label: 'Légende 1', placeholder: photoCaption },
      photo2: { label: 'Photo 2' },
      caption2: { label: 'Légende 2', placeholder: photoCaption },
      photo3: { label: 'Photo 3' },
      caption3: { label: 'Légende 3', placeholder: photoCaption },
    },
  },
  'love-letter': {
    name: "Lettre d'amour",
    description: 'Message élégant avec bordures décoratives',
    fields: {
      greeting: { label: 'Formule d’appel', defaultValue: 'Mon amour,', placeholder: 'Formule d’ouverture' },
      body: {
        label: 'Corps de la lettre',
        defaultValue: 'Chaque instant avec toi est un trésor que je garde précieusement dans mon cœur...',
        placeholder: 'Écris ton message ici',
      },
      closing: { label: 'Formule de fin', defaultValue: 'À toi pour toujours,', placeholder: 'Formule de clôture' },
      signature: { label: 'Signature', defaultValue: 'Ton prénom', placeholder: 'Ton prénom' },
    },
  },
  'flip-cards': {
    name: 'Cartes à retourner',
    description: 'Cartes interactives qui révèlent leur contenu au survol',
    fields: {
      title: { label: 'Titre de la section', defaultValue: "Pourquoi je t'aime", placeholder: 'Titre de la section' },
      card1Front: { label: 'Carte 1 – recto', defaultValue: '✨ Raison 1', placeholder: 'Texte du recto' },
      card1Back: { label: 'Carte 1 – verso', defaultValue: 'Ton sourire illumine la pièce', placeholder: 'Texte du verso' },
      card2Front: { label: 'Carte 2 – recto', defaultValue: '💫 Raison 2', placeholder: 'Texte du recto' },
      card2Back: { label: 'Carte 2 – verso', defaultValue: "Ta gentillesse n'a pas de limites", placeholder: 'Texte du verso' },
      card3Front: { label: 'Carte 3 – recto', defaultValue: '🌟 Raison 3', placeholder: 'Texte du recto' },
      card3Back: { label: 'Carte 3 – verso', defaultValue: 'Tu rends chaque jour plus lumineux', placeholder: 'Texte du verso' },
    },
  },
  carousel: {
    name: 'Carrousel de souvenirs',
    description: 'Carrousel automatique avec images et légendes',
    fields: {
      title: { label: 'Titre de la section', defaultValue: 'Notre voyage', placeholder: 'Titre de la section' },
      slide1Image: { label: 'Image diapo 1' },
      slide1Caption: { label: 'Légende diapo 1', defaultValue: 'Notre premier souvenir', placeholder: 'Légende de la diapo' },
      slide2Image: { label: 'Image diapo 2' },
      slide2Caption: { label: 'Légende diapo 2', defaultValue: 'Un moment précieux', placeholder: 'Légende de la diapo' },
      slide3Image: { label: 'Image diapo 3' },
      slide3Caption: { label: 'Légende diapo 3', defaultValue: 'Ensemble pour toujours', placeholder: 'Légende de la diapo' },
    },
  },
  timeline: {
    name: 'Chronologie',
    description: 'Frise verticale des moments importants',
    fields: {
      title: { label: 'Titre de la section', defaultValue: 'Notre histoire', placeholder: 'Titre de la section' },
      event1Date: { label: 'Date événement 1', defaultValue: 'Janvier 2024', placeholder: date },
      event1Title: { label: 'Titre événement 1', defaultValue: 'Là où tout a commencé', placeholder: eventTitle },
      event1Desc: { label: 'Description événement 1', defaultValue: 'Le jour où tout a changé...', placeholder: eventDesc },
      event2Date: { label: 'Date événement 2', defaultValue: 'Mars 2024', placeholder: date },
      event2Title: { label: 'Titre événement 2', defaultValue: 'Un moment spécial', placeholder: eventTitle },
      event2Desc: { label: 'Description événement 2', defaultValue: "Un souvenir qu'on n'oubliera jamais...", placeholder: eventDesc },
      ...Object.fromEntries(
        [3, 4, 5, 6, 7, 8].flatMap((n) => [
          [`event${n}Date`, { label: `Date événement ${n}`, placeholder: date }],
          [`event${n}Title`, { label: `Titre événement ${n}`, placeholder: eventTitle }],
          [`event${n}Desc`, { label: `Description événement ${n}`, placeholder: eventDesc }],
        ])
      ),
    },
  },
  'make-a-wish': {
    name: 'Fais un vœu',
    description: 'Formulaire interactif pour envoyer un vœu',
    fields: {
      title: { label: 'Titre', defaultValue: 'Fais un vœu', placeholder: 'Titre de la section' },
      prompt: { label: 'Invitation', defaultValue: 'Ferme les yeux et fais un vœu...', placeholder: "Texte d'invitation" },
      placeholder: { label: 'Texte indicatif du champ', defaultValue: 'Écris ton vœu ici...', placeholder: 'Texte indicatif' },
      buttonText: { label: "Bouton d'envoi", defaultValue: 'Envoyer mon vœu ✨', placeholder: 'Texte du bouton' },
    },
  },
  'final-message': {
    name: 'Message de fin',
    description: 'Section de clôture élégante avec cœur animé',
    fields: {
      line1: {
        label: 'Première ligne',
        defaultValue: "Merci d'être la plus belle part de chacune de mes journées.",
        placeholder: 'Première ligne du message',
      },
      line2: {
        label: 'Deuxième ligne',
        defaultValue: "Je t'aime plus que les mots ne pourront jamais le dire.",
        placeholder: 'Deuxième ligne du message',
      },
      headline: { label: 'Titre principal', defaultValue: 'Joyeux anniversaire, mon tout.', placeholder: 'Titre principal' },
      closing: { label: 'Formule de fin', defaultValue: 'À toi pour toujours,', placeholder: 'Formule de clôture' },
      signature: { label: 'Signature', defaultValue: 'Ton prénom', placeholder: 'Ton prénom' },
    },
  },
  'name-display': {
    name: 'Prénom en vedette',
    description: 'Grand prénom animé avec ses significations',
    fields: {
      name: { label: 'Prénom', placeholder: 'Prénom à afficher' },
      meaning1: { label: 'Mot 1', defaultValue: 'Bien-aimée', placeholder: 'Premier mot' },
      meaning1Desc: { label: 'Description du mot 1', placeholder: describeWord },
      meaning2: { label: 'Mot 2', defaultValue: 'Pure', placeholder: 'Deuxième mot' },
      meaning2Desc: { label: 'Description du mot 2', placeholder: describeWord },
      meaning3: { label: 'Mot 3', defaultValue: 'Gracieuse', placeholder: 'Troisième mot' },
      meaning3Desc: { label: 'Description du mot 3', placeholder: describeWord },
      meaning4: { label: 'Mot 4', defaultValue: 'Exaltée', placeholder: 'Quatrième mot' },
      meaning4Desc: { label: 'Description du mot 4', placeholder: describeWord },
    },
  },
  'floating-decoration': {
    name: 'Cœurs flottants',
    description: 'Décoration animée de cœurs qui flottent',
    fields: {
      color: { label: 'Couleur des cœurs' },
      count: { label: 'Nombre de cœurs', placeholder: 'ex. 15' },
    },
  },
  surprises: {
    name: 'Boîtes surprises',
    description: 'Boîtes cliquables qui révèlent des surprises avec des confettis',
    fields: {
      title: { label: 'Titre de la section', defaultValue: 'Tes surprises', placeholder: 'Titre de la section' },
      box1Label: { label: 'Libellé boîte 1', defaultValue: 'Surprise n°1', placeholder: 'Libellé de la boîte' },
      box1Reveal: { label: 'Texte révélé boîte 1', defaultValue: "🎉 Une aventure spéciale t'attend !", placeholder: 'Ce qui est révélé' },
      box2Label: { label: 'Libellé boîte 2', defaultValue: 'Surprise n°2', placeholder: 'Libellé de la boîte' },
      box2Reveal: { label: 'Texte révélé boîte 2', defaultValue: '💝 Un dîner romantique en tête-à-tête !', placeholder: 'Ce qui est révélé' },
      box3Label: { label: 'Libellé boîte 3', defaultValue: 'Surprise n°3', placeholder: 'Libellé de la boîte' },
      box3Reveal: { label: 'Texte révélé boîte 3', defaultValue: '✨ Une journée magique rien que pour toi !', placeholder: 'Ce qui est révélé' },
    },
  },
  'love-playlist': {
    name: "Playlist d'amour",
    description: 'Une sélection de chansons qui racontent votre histoire',
    fields: {
      title: { label: 'Titre de la section', defaultValue: 'Notre playlist', placeholder: 'ex. Les chansons qui nous ressemblent' },
      subtitle: { label: 'Sous-titre', defaultValue: 'Chaque chanson me fait penser à toi', placeholder: 'Une courte accroche' },
      accentColor: { label: "Couleur d'accent" },
      song1Title: { label: 'Titre chanson 1', placeholder: songName },
      song1Artist: { label: 'Artiste chanson 1', placeholder: artistName },
      song1Youtube: { label: 'Lien YouTube chanson 1', placeholder: 'Collez un lien YouTube' },
      song1Memory: {
        label: 'Souvenir chanson 1',
        defaultValue: "Elle passait le soir où j'ai compris que je tombais amoureux de toi.",
        placeholder: songMemory,
      },
      song2Title: { label: 'Titre chanson 2', placeholder: songName },
      song2Artist: { label: 'Artiste chanson 2', placeholder: artistName },
      song2Youtube: { label: 'Lien YouTube chanson 2', placeholder: 'Collez un lien YouTube' },
      song2Memory: {
        label: 'Souvenir chanson 2',
        defaultValue: 'Chaque mot semble avoir été écrit pour nous.',
        placeholder: songMemory,
      },
      song3Title: { label: 'Titre chanson 3', placeholder: songName },
      song3Artist: { label: 'Artiste chanson 3', placeholder: artistName },
      song3Youtube: { label: 'Lien YouTube chanson 3', placeholder: 'Collez un lien YouTube' },
      song3Memory: {
        label: 'Souvenir chanson 3',
        defaultValue: "Parce que je n'ai vraiment pas pu m'en empêcher.",
        placeholder: songMemory,
      },
      song4Title: { label: 'Titre chanson 4', placeholder: 'Nom de la chanson (facultatif)' },
      song4Artist: { label: 'Artiste chanson 4', placeholder: artistName },
      song4Youtube: { label: 'Lien YouTube chanson 4', placeholder: 'Collez un lien YouTube' },
      song4Memory: { label: 'Souvenir chanson 4', placeholder: songMemory },
      footerNote: {
        label: 'Note de bas de page',
        defaultValue: 'fait avec amour, rien que pour toi',
        placeholder: 'ex. fait avec amour, rien que pour toi',
      },
    },
  },
  'promise-jar': {
    name: 'Bocal à promesses',
    description: 'Des petits mots pliés dans un bocal, chacun révélant une promesse',
    fields: {
      title: { label: 'Titre de la section', defaultValue: 'Mes promesses pour toi', placeholder: 'ex. Du fond du cœur' },
      subtitle: { label: 'Sous-titre', defaultValue: 'Touche un mot pour déplier une promesse', placeholder: "Ligne d'instruction" },
      jarColor: { label: "Couleur d'accent du bocal" },
      promise1: {
        label: 'Promesse 1',
        defaultValue: 'Je promets de toujours te faire rire, même dans tes jours les plus durs.',
        placeholder: writePromise,
      },
      promise2: { label: 'Promesse 2', defaultValue: 'Je promets de te tenir la main dans chaque tempête.', placeholder: writePromise },
      promise3: {
        label: 'Promesse 3',
        defaultValue: "Je promets de ne jamais cesser de te surprendre par de petites attentions d'amour.",
        placeholder: writePromise,
      },
      promise4: { label: 'Promesse 4', defaultValue: 'Je promets d’être ton refuge, toujours.', placeholder: writePromise },
      promise5: { label: 'Promesse 5', defaultValue: "Je promets de t'aimer un peu plus chaque jour.", placeholder: writePromise },
    },
  },
};
