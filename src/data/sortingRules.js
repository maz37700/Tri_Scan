// ── French waste sorting rules by postal code region ──
// In production, this would be an API call to CITEO / local collectivity APIs.
// For the MVP, we use a curated database of major regions.

const SORTING_PROFILES = {
  default: {
    name: 'Consignes nationales (extension tri)',
    region: 'France métropolitaine',
    rules: {
      jaune: {
        label: 'Bac Jaune',
        accepts: [
          'Tous les emballages plastique (bouteilles, pots, barquettes, films, sacs)',
          'Emballages métalliques (canettes, boîtes conserve, aérosols vides, barquettes alu)',
          'Cartons, cartonnettes, briques alimentaires',
          'Papiers, journaux, magazines, enveloppes',
        ],
        refuses: [
          'Vaisselle, miroirs, vitres (pas dans le jaune ni le verre)',
          'Emballages très souillés (les vider suffit, pas besoin de laver)',
        ],
        tip: 'En cas de doute, mettez dans le bac jaune ! Les centres de tri sont équipés pour trier.',
      },
      verre: {
        label: 'Conteneur Verre',
        accepts: ['Bouteilles en verre', 'Pots en verre', 'Bocaux en verre'],
        refuses: ['Vaisselle, porcelaine', 'Miroirs, vitres', 'Ampoules (déchetterie)'],
        tip: 'Pas besoin de bouchons : retirez-les. Le verre se recycle à l\'infini.',
      },
      compost: {
        label: 'Biodéchets / Compost',
        accepts: [
          'Épluchures de fruits et légumes',
          'Restes de repas (y compris viande, poisson)',
          'Marc de café, sachets de thé',
          'Coquilles d\'œuf',
          'Fleurs fanées, petits déchets de jardin',
        ],
        refuses: ['Huile de friture', 'Litière animale', 'Mégots'],
        tip: 'Obligatoire depuis le 1er janvier 2024 (loi AGEC). Renseignez-vous auprès de votre mairie pour le composteur.',
        mandatory: true,
      },
      ordures: {
        label: 'Ordures Ménagères',
        accepts: [
          'Couches, protections hygiéniques',
          'Mouchoirs, essuie-tout souillés',
          'Vaisselle cassée (emballer les morceaux)',
          'Objets en plastique non-emballage (jouets, stylos…)',
        ],
        tip: 'Tout ce qui n\'est ni recyclable, ni compostable, ni dangereux.',
      },
      dechetterie: {
        label: 'Déchetterie',
        accepts: [
          'Encombrants (meubles, matelas)',
          'Appareils électroniques (DEEE)',
          'Peintures, solvants, huiles',
          'Gravats, bois',
        ],
        tip: 'Trouvez votre déchetterie sur dechetteries.info ou votre mairie.',
      },
      special: {
        label: 'Filières Spéciales',
        accepts: [
          'Médicaments → Pharmacie (Cyclamed)',
          'Piles et batteries → Magasins (bacs dédiés)',
          'Textiles, chaussures → Bornes Le Relais / Eco TLC',
          'Cartouches d\'encre → Magasins informatiques',
        ],
        tip: 'Ne jamais jeter ces déchets à la poubelle classique !',
      },
    },
  },

  // Paris-specific overrides
  '75': {
    name: 'Paris',
    region: 'Ville de Paris',
    overrides: {
      jaune: {
        tip: 'Paris Bac jaune : tous les emballages + papiers. Le tri est simplifié.',
      },
      compost: {
        tip: 'Paris : composteurs de quartier et collecte en porte-à-porte dans certains arrondissements. Consultez paris.fr',
      },
    },
  },

  // Lyon Métropole
  '69': {
    name: 'Métropole de Lyon',
    region: 'Grand Lyon',
    overrides: {
      jaune: {
        tip: 'Grand Lyon : extension des consignes depuis 2022. Tous les plastiques vont au jaune.',
      },
    },
  },

  // Marseille
  '13': {
    name: 'Marseille / Bouches-du-Rhône',
    region: 'Métropole Aix-Marseille',
    overrides: {
      jaune: {
        tip: 'Métropole AMP : consignes de tri étendues à tous les emballages plastique.',
      },
    },
  },

  // Indre (36) - local for Châteauroux
  '36': {
    name: 'Indre',
    region: 'Châteauroux Métropole',
    overrides: {
      jaune: {
        tip: 'Châteauroux Métropole : le bac jaune accueille tous les emballages. Tri simplifié !',
      },
      compost: {
        tip: 'Distribution de composteurs gratuits par la collectivité. Renseignez-vous en mairie.',
      },
    },
  },
};

/**
 * Get sorting profile for a given postal code.
 * Falls back to national defaults.
 */
export function getSortingProfile(postalCode) {
  if (!postalCode || postalCode.length < 2) return SORTING_PROFILES.default;

  const dept = postalCode.substring(0, 2);
  const regional = SORTING_PROFILES[dept];

  if (!regional) return SORTING_PROFILES.default;

  // Merge regional overrides with defaults
  const merged = {
    name: regional.name,
    region: regional.region,
    rules: { ...SORTING_PROFILES.default.rules },
  };

  if (regional.overrides) {
    for (const [bin, overrides] of Object.entries(regional.overrides)) {
      if (merged.rules[bin]) {
        merged.rules[bin] = { ...merged.rules[bin], ...overrides };
      }
    }
  }

  return merged;
}

/**
 * Validate and normalize a French postal code
 */
export function normalizePostalCode(input) {
  const cleaned = (input || '').replace(/\s/g, '');
  if (/^\d{5}$/.test(cleaned)) return cleaned;
  if (/^\d{2}$/.test(cleaned)) return cleaned + '000'; // dept code
  return null;
}

/**
 * Get the department name from a postal code
 */
export function getDepartmentFromPostal(postalCode) {
  const DEPTS = {
    '01': 'Ain', '02': 'Aisne', '03': 'Allier', '04': 'Alpes-de-Haute-Provence',
    '05': 'Hautes-Alpes', '06': 'Alpes-Maritimes', '07': 'Ardèche', '08': 'Ardennes',
    '09': 'Ariège', '10': 'Aube', '11': 'Aude', '12': 'Aveyron',
    '13': 'Bouches-du-Rhône', '14': 'Calvados', '15': 'Cantal', '16': 'Charente',
    '17': 'Charente-Maritime', '18': 'Cher', '19': 'Corrèze', '21': 'Côte-d\'Or',
    '22': 'Côtes-d\'Armor', '23': 'Creuse', '24': 'Dordogne', '25': 'Doubs',
    '26': 'Drôme', '27': 'Eure', '28': 'Eure-et-Loir', '29': 'Finistère',
    '30': 'Gard', '31': 'Haute-Garonne', '32': 'Gers', '33': 'Gironde',
    '34': 'Hérault', '35': 'Ille-et-Vilaine', '36': 'Indre', '37': 'Indre-et-Loire',
    '38': 'Isère', '39': 'Jura', '40': 'Landes', '41': 'Loir-et-Cher',
    '42': 'Loire', '43': 'Haute-Loire', '44': 'Loire-Atlantique', '45': 'Loiret',
    '46': 'Lot', '47': 'Lot-et-Garonne', '48': 'Lozère', '49': 'Maine-et-Loire',
    '50': 'Manche', '51': 'Marne', '52': 'Haute-Marne', '53': 'Mayenne',
    '54': 'Meurthe-et-Moselle', '55': 'Meuse', '56': 'Morbihan', '57': 'Moselle',
    '58': 'Nièvre', '59': 'Nord', '60': 'Oise', '61': 'Orne',
    '62': 'Pas-de-Calais', '63': 'Puy-de-Dôme', '64': 'Pyrénées-Atlantiques',
    '65': 'Hautes-Pyrénées', '66': 'Pyrénées-Orientales', '67': 'Bas-Rhin',
    '68': 'Haut-Rhin', '69': 'Rhône', '70': 'Haute-Saône', '71': 'Saône-et-Loire',
    '72': 'Sarthe', '73': 'Savoie', '74': 'Haute-Savoie', '75': 'Paris',
    '76': 'Seine-Maritime', '77': 'Seine-et-Marne', '78': 'Yvelines',
    '79': 'Deux-Sèvres', '80': 'Somme', '81': 'Tarn', '82': 'Tarn-et-Garonne',
    '83': 'Var', '84': 'Vaucluse', '85': 'Vendée', '86': 'Vienne',
    '87': 'Haute-Vienne', '88': 'Vosges', '89': 'Yonne', '90': 'Territoire de Belfort',
    '91': 'Essonne', '92': 'Hauts-de-Seine', '93': 'Seine-Saint-Denis',
    '94': 'Val-de-Marne', '95': 'Val-d\'Oise',
  };
  if (!postalCode) return null;
  return DEPTS[postalCode.substring(0, 2)] || null;
}

export { SORTING_PROFILES };
