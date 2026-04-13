const ANALYSIS_PROMPT = `Tu es un expert du tri des déchets en France. Analyse cette image et identifie le ou les objets/déchets visibles.

Réponds UNIQUEMENT en JSON valide (pas de markdown, pas de backticks) avec cette structure exacte :
{
  "items": [
    {
      "name": "nom de l'objet",
      "material": "matériau principal",
      "bin": "jaune|verre|ordures|compost|dechetterie|special",
      "instruction": "consigne de tri précise en 1-2 phrases",
      "tip": "astuce ou info écologique courte"
    }
  ],
  "confidence": 0.95
}

Règles de tri France 2024+ :
- Bac jaune (extension des consignes) : TOUS les emballages plastique (y compris films, pots, barquettes), métaux, cartons, papiers, briques
- Bac verre : bouteilles, pots et bocaux en verre uniquement
- Compost : biodéchets (obligatoire depuis 2024)
- Ordures ménagères : ce qui ne se recycle pas
- Déchetterie : encombrants, DEEE, piles, peintures, huiles
- Special : médicaments (pharmacie), piles (magasins), textiles (bornes)

Si l'image ne montre pas de déchet identifiable, retourne :
{"items": [{"name": "Non identifié", "material": "inconnu", "bin": "ordures", "instruction": "Objet non reconnu.", "tip": "Consultez le guide de tri de votre commune."}], "confidence": 0.1}`;

/**
 * Analyze a waste image using Claude API
 * @param {string} imageDataUrl - base64 data URL of the image
 * @param {string} apiKey - Anthropic API key (stored locally)
 * @returns {Promise<Object>} Analysis result
 */
export async function analyzeWasteImage(imageDataUrl) {
  const base64 = imageDataUrl.split(',')[1];
  const mediaType = imageDataUrl.split(';')[0].split(':')[1] || 'image/jpeg';

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: ANALYSIS_PROMPT },
        ],
      }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.content?.map(c => c.text || '').join('') || '';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

/**
 * Demo results for offline/testing mode
 */
export const DEMO_ITEMS = [
  { label: '🥫 Boîte de conserve', desc: 'Boîte métal alimentaire' },
  { label: '🍾 Bouteille en verre', desc: 'Bouteille de vin / jus' },
  { label: '📦 Carton d\'emballage', desc: 'Carton Amazon / colis' },
  { label: '🥤 Bouteille plastique', desc: 'Bouteille d\'eau / soda' },
  { label: '🍌 Peau de banane', desc: 'Déchet organique' },
  { label: '🔋 Pile usagée', desc: 'Pile AA / AAA' },
  { label: '📰 Journal / magazine', desc: 'Papier imprimé' },
  { label: '💊 Médicaments', desc: 'Boîte de médicaments' },
];

export const DEMO_RESULTS = {
  '🥫 Boîte de conserve': { items: [{ name: 'Boîte de conserve', material: 'Acier / Aluminium', bin: 'jaune', instruction: 'Inutile de laver, il suffit de bien la vider. Jetez-la dans le bac jaune avec le couvercle.', tip: 'L\'acier est recyclable à l\'infini. Une boîte recyclée redevient une nouvelle boîte en 60 jours.' }], confidence: 0.95 },
  '🍾 Bouteille en verre': { items: [{ name: 'Bouteille en verre', material: 'Verre', bin: 'verre', instruction: 'Déposez dans le conteneur à verre sans le bouchon.', tip: 'Le verre se recycle à l\'infini sans perte de qualité.' }], confidence: 0.97 },
  '📦 Carton d\'emballage': { items: [{ name: 'Carton d\'emballage', material: 'Carton ondulé', bin: 'jaune', instruction: 'Pliez à plat, retirez le scotch si possible. Direction bac jaune.', tip: 'Recycler 1 tonne de carton sauve 2,5 tonnes de bois.' }], confidence: 0.93 },
  '🥤 Bouteille plastique': { items: [{ name: 'Bouteille plastique', material: 'PET', bin: 'jaune', instruction: 'Videz, écrasez dans le sens de la longueur, replacez le bouchon. Bac jaune.', tip: 'Une bouteille plastique met 450 ans à se décomposer. Recyclée, elle peut devenir un pull polaire.' }], confidence: 0.96 },
  '🍌 Peau de banane': { items: [{ name: 'Peau de banane', material: 'Matière organique', bin: 'compost', instruction: 'Biodéchets obligatoires depuis 2024. Composteur ou bac biodéchets.', tip: 'Se décompose en quelques semaines au compost, mais 2 ans dans la nature.' }], confidence: 0.98 },
  '🔋 Pile usagée': { items: [{ name: 'Pile usagée', material: 'Métaux lourds / Lithium', bin: 'special', instruction: 'Ne JAMAIS jeter à la poubelle ! Bacs de collecte en magasin.', tip: 'En France, 1 pile sur 2 seulement est recyclée.' }], confidence: 0.99 },
  '📰 Journal / magazine': { items: [{ name: 'Journal / Magazine', material: 'Papier imprimé', bin: 'jaune', instruction: 'Bac jaune tel quel, sans sac plastique. Les agrafes ne posent pas de problème.', tip: 'Recycler du papier = 3x moins d\'énergie que d\'en fabriquer.' }], confidence: 0.94 },
  '💊 Médicaments': { items: [{ name: 'Médicaments', material: 'Chimie pharmaceutique', bin: 'special', instruction: 'TOUJOURS rapporter en pharmacie (Cyclamed). Jamais dans l\'évier ou la poubelle.', tip: 'Un médicament jeté dans les toilettes peut contaminer 100 000 litres d\'eau.' }], confidence: 0.99 },
};
