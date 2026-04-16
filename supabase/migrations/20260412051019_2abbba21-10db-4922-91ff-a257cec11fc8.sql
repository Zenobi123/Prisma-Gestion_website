
-- Allow anonymous reads for slug checking (seeding)
DROP POLICY IF EXISTS "Anyone can read published blog posts" ON public.blog_posts;
CREATE POLICY "Anyone can read blog posts"
ON public.blog_posts FOR SELECT
USING (true);

-- Seed default blog posts
INSERT INTO public.blog_posts (title, excerpt, content, author, publish_date, status, image, slug, tags, seo_title, seo_description) VALUES
(
  'L''Environnement Fiscal Camerounais : Cadre Juridique et Institutionnel',
  'Découvrez les sources du droit fiscal, l''organisation de la DGI et les obligations des contribuables au Cameroun.',
  '<h2>1. Les sources du droit fiscal camerounais</h2><p>Le système fiscal camerounais repose sur un ensemble hiérarchisé de normes juridiques. Au sommet, la Constitution du 18 janvier 1996 pose le principe fondamental de consentement à l''impôt : « Le Parlement vote les lois et consent l''impôt ». Aucune autorité administrative ne peut imposer un prélèvement sans base légale expresse.</p><p>Le Code Général des Impôts (CGI) constitue le corpus central. Il est actualisé chaque année par la Loi de Finances. La Loi sur la Fiscalité Locale régit les impôts collectés au profit des collectivités territoriales décentralisées. Enfin, les conventions fiscales internationales (comme celles avec la France ou la CEMAC) priment le droit interne.</p><h2>2. Organisation de l''administration fiscale (DGI)</h2><p>La Direction Générale des Impôts est la structure centrale chargée de l''assiette, du contrôle et du recouvrement. Ses structures opérationnelles sont classées selon la taille des contribuables :</p><ul><li><strong>DGE (Direction des Grandes Entreprises) :</strong> CA ≥ 3 milliards FCFA</li><li><strong>CIME (Centre des Impôts des Moyennes Entreprises) :</strong> 50 M ≤ CA &lt; 3 milliards FCFA</li><li><strong>CDI (Centre Divisionnaire des Impôts) :</strong> CA &lt; 50 millions ou régime IGS</li></ul><h2>3. Obligations générales du contribuable</h2><p>Tout contribuable doit :</p><ul><li>S''immatriculer pour obtenir un Numéro d''Identifiant Unique (NIU).</li><li>Souscrire des déclarations périodiques (DSF, DAS, etc.).</li><li>Payer ses impôts dans les délais légaux (sous peine de pénalités de retard).</li><li>Conserver ses documents comptables pendant un délai minimal de 10 ans.</li></ul><h2>Conclusion</h2><p>La maîtrise de la hiérarchie des normes et de l''organisation fiscale est essentielle pour tout professionnel. C''est le socle qui garantit la conformité et la protection du contribuable.</p>',
  'Nathan OBIANG TIME',
  '2026-04-12',
  'Publié',
  '/placeholder.svg',
  'environnement-fiscal-camerounais-cadre-juridique',
  ARRAY['Fiscalité', 'Droit', 'Cameroun'],
  'L''Environnement Fiscal Camerounais : Cadre Juridique',
  'Analyse du cadre juridique et institutionnel de l''environnement fiscal au Cameroun.'
),
(
  'La Réforme Fiscale de 2026 : Les Nouveaux Régimes d''Imposition',
  'Comprendre la suppression du RSI et l''adoption de l''Impôt Général Synthétique (IGS) face au régime du réel.',
  '<h2>1. Présentation générale — La réforme LF 2026</h2><p>La Loi de Finances 2026 a profondément réformé le paysage des régimes d''imposition au Cameroun. L''ancien Régime Simplifié d''Imposition (RSI) est supprimé. Désormais, le système ne comprend plus que deux régimes : l''Impôt Général Synthétique (IGS) et le régime du réel.</p><h2>2. L''Impôt Général Synthétique libératoire (IGS)</h2><p>L''IGS s''applique aux personnes physiques et morales dont le CA annuel est strictement inférieur à 50 000 000 FCFA. Il est libératoire de l''IS, TVA, patente, IRPP-BIC, etc.</p><p>Il offre de nombreux avantages :</p><ul><li>Paiement trimestriel simplifié.</li><li>Tenue d''une comptabilité simplifiée (livre de recettes et dépenses).</li><li>Réduction de 50 % pour les adhérents d''un Centre de Gestion Agréé (CGA).</li></ul><h2>3. Le régime du réel</h2><p>Le régime du réel s''applique obligatoirement à toutes les entreprises dont le chiffre d''affaires est ≥ 50 millions FCFA, avec une option volontaire possible pour les autres. Il implique :</p><ul><li>Tenue d''une comptabilité complète OHADA.</li><li>Déclarations mensuelles (TVA, acomptes IS, IRPP sur salaires).</li><li>Dépôt annuel de la Déclaration Statistique et Fiscale (DSF).</li></ul><h2>4. Règles de passage entre régimes</h2><p>Le passage de l''IGS au réel est automatique si le CA dépasse 50 millions FCFA. Le passage inverse (Réel vers IGS) est possible si le CA reste inférieur à 50 millions pendant deux exercices consécutifs, sur demande expresse.</p>',
  'Nathan OBIANG TIME',
  '2026-04-13',
  'Publié',
  '/placeholder.svg',
  'reforme-fiscale-2026-regimes-imposition',
  ARRAY['Fiscalité', 'Réforme', 'Cameroun', 'IGS'],
  'Réforme Fiscale 2026 : Régimes d''Imposition au Cameroun',
  'Explication de la réforme LF 2026 sur les régimes d''imposition, avec un focus sur l''IGS et le régime du réel.'
),
(
  'Panorama des Impôts et Taxes au Cameroun (2026)',
  'Tour d''horizon des principaux impôts (IS, IRPP, TVA) et des incitations fiscales de la Loi de Finances 2026.',
  '<h2>1. L''Impôt sur les Sociétés (IS)</h2><p>L''IS frappe les bénéfices réalisés par les personnes morales. Le taux principal est de 30 % du bénéfice fiscal imposable, auquel s''ajoutent les Centimes Additionnels Communaux (10 % de l''IS), portant le taux effectif global à 33 %.</p><p>Il existe un minimum de perception de 2,2 % du CA HT, acquitté mensuellement sous forme d''acomptes.</p><h2>2. L''Impôt sur le Revenu des Personnes Physiques (IRPP)</h2><p>L''IRPP s''applique selon un barème progressif (de 10 % à 35 %) aux différents revenus (salaires, BIC, BNC, revenus fonciers). Des taxes annexes comme la contribution au Crédit Foncier et la redevance audiovisuelle viennent s''ajouter.</p><h2>3. La Taxe sur la Valeur Ajoutée (TVA)</h2><p>Le taux général de la TVA est de 19,25 % TTC. La LF 2026 introduit un taux réduit à 10 % pour la construction et la vente de logements sociaux. Les exportations sont taxées à 0 %, avec droit à déduction.</p><h2>4. Fiscalité du Numérique (Innovation LF 2026)</h2><p>L''article 23 bis du CGI instaure un dispositif de taxation des activités de l''économie numérique basé sur la notion de Présence Économique Significative (PES). Les entreprises étrangères ciblant le marché camerounais ou exploitant des plateformes de commerce électronique sont soumises à une taxe de 3 % sur les revenus générés au Cameroun.</p><h2>5. Incitations fiscales de la LF 2026</h2><p>La LF 2026 propose d''importantes mesures incitatives :</p><ul><li>Déduction majorée à 150 % des salaires bruts pour l''emploi de jeunes (&lt; 35 ans) en CDI.</li><li>Réduction de 50 % de l''IGS pour les travailleurs indépendants handicapés.</li><li>Taux réduit de TVA à 10 % pour le logement social.</li></ul>',
  'Nathan OBIANG TIME',
  '2026-04-14',
  'Publié',
  '/placeholder.svg',
  'panorama-impots-taxes-cameroun-2026',
  ARRAY['Fiscalité', 'Taxes', 'Cameroun'],
  'Panorama des Impôts et Taxes au Cameroun (2026)',
  'Synthèse des principaux impôts (IS, IRPP, TVA) et nouvelles taxes du numérique au Cameroun pour 2026.'
),
(
  'Veille impots.cm : dernières publications fiscales',
  'Consultez rapidement les derniers documents, actualités et notes publiés sur impots.cm.',
  '<h2>Dernières parutions de impots.cm</h2><p>Cet article de veille vous permet d''accéder directement aux informations les plus récentes publiées par la Direction Générale des Impôts du Cameroun.</p><div class="bg-gray-50"><h3>Accès rapide</h3><ul><li><a href="https://www.impots.cm/" target="_blank" rel="noopener noreferrer">Page d''accueil impots.cm</a></li><li><a href="https://www.impots.cm/fr/actualites" target="_blank" rel="noopener noreferrer">Rubrique actualités</a></li><li><a href="https://www.impots.cm/fr/documentations" target="_blank" rel="noopener noreferrer">Rubrique documents</a></li></ul></div><p>Astuce: ouvrez les rubriques ci-dessus pour identifier immédiatement la dernière publication.</p>',
  'PRISMA GESTION',
  '2026-04-10',
  'Publié',
  '/blog-images/veille-impots.jpg',
  'veille-impots-cm-dernieres-publications',
  ARRAY['Veille réglementaire', 'Fiscalité'],
  'Veille impots.cm : dernières publications fiscales',
  'Suivez les dernières publications, actualités et documents publiés sur impots.cm.'
),
(
  'Veille cnps.cm : dernières actualités sociales',
  'Retrouvez le dernier élément publié sur cnps.cm : communiqué, document ou news officielle.',
  '<h2>Dernières parutions de cnps.cm</h2><p>Cette veille centralise l''accès aux contenus récents diffusés par la CNPS.</p><div class="bg-gray-50"><h3>Accès rapide</h3><ul><li><a href="https://www.cnps.cm/" target="_blank" rel="noopener noreferrer">Page d''accueil cnps.cm</a></li><li><a href="https://www.cnps.cm/actualites/" target="_blank" rel="noopener noreferrer">Rubrique actualités</a></li><li><a href="https://www.cnps.cm/documentation/" target="_blank" rel="noopener noreferrer">Rubrique documentation</a></li></ul></div><p>Vérifiez ces sections pour consulter la publication la plus récente.</p>',
  'PRISMA GESTION',
  '2026-04-10',
  'Publié',
  '/blog-images/veille-cnps.jpg',
  'veille-cnps-cm-dernieres-actualites',
  ARRAY['Veille réglementaire', 'Social'],
  'Veille cnps.cm : dernières actualités sociales',
  'Accédez rapidement aux dernières actualités et documents publiés sur cnps.cm.'
),
(
  'Veille egecam.cm : nouveaux documents et annonces',
  'Un point d''accès direct vers la dernière publication visible sur egecam.cm.',
  '<h2>Dernières parutions de egecam.cm</h2><p>Utilisez cette page pour accéder en un clic aux nouveautés publiées par EGECAM.</p><div class="bg-gray-50"><h3>Accès rapide</h3><ul><li><a href="https://egecam.cm/" target="_blank" rel="noopener noreferrer">Page d''accueil egecam.cm</a></li><li><a href="https://egecam.cm/category/actualites/" target="_blank" rel="noopener noreferrer">Rubrique actualités</a></li><li><a href="https://egecam.cm/category/documents/" target="_blank" rel="noopener noreferrer">Rubrique documents</a></li></ul></div><p>Consultez ces sections pour repérer le dernier contenu publié.</p>',
  'PRISMA GESTION',
  '2026-04-10',
  'Publié',
  '/blog-images/veille-egecam.jpg',
  'veille-egecam-cm-documents-annonces',
  ARRAY['Veille', 'Institutionnel'],
  'Veille egecam.cm : nouveaux documents et annonces',
  'Suivi des dernières publications de egecam.cm (documents, actualités, annonces).'
),
(
  'Veille DGICAM Facebook : dernière publication',
  'Suivez la dernière publication postée sur la page Facebook officielle DGICAM.',
  '<h2>Dernières parutions Facebook DGICAM</h2><p>Cette veille pointe vers la page officielle DGICAM pour consulter le dernier post publié.</p><div class="bg-gray-50"><h3>Lien direct</h3><ul><li><a href="https://www.facebook.com/DGICAM" target="_blank" rel="noopener noreferrer">Page Facebook DGICAM</a></li></ul></div><p>Le premier post affiché en haut du fil correspond généralement à la publication la plus récente.</p>',
  'PRISMA GESTION',
  '2026-04-10',
  'Publié',
  '/blog-images/veille-dgicam.jpg',
  'veille-facebook-dgicam-derniere-publication',
  ARRAY['Veille', 'Réseaux sociaux'],
  'Veille DGICAM Facebook : dernière publication',
  'Accès rapide à la dernière publication de la page Facebook DGICAM.'
),
(
  'Les avantages de la comptabilité en ligne',
  'Pourquoi passer à la comptabilité informatisée en 2025.',
  '',
  'Nathan OBIANG TIME',
  '2026-04-11',
  'Publié',
  '/lovable-uploads/85999c6b-953e-4905-b204-fec3dfc4e72f.png',
  'avantages-comptabilite-en-ligne',
  ARRAY['Comptabilité'],
  'Les avantages de la comptabilité en ligne en 2025',
  'Découvrez pourquoi passer à la comptabilité informatisée en 2025 peut transformer votre entreprise.'
),
(
  'Les nouvelles normes fiscales et comptables pour 2025',
  'Lois des finances 2025, ce que vous devez savoir.',
  '',
  'Nathan OBIANG TIME',
  '2026-04-11',
  'Publié',
  '/lovable-uploads/4d9dc424-4eb4-4aca-aba9-e462d333f67c.png',
  'nouvelles-normes-fiscales-2025',
  ARRAY['Fiscalité'],
  'Nouvelles normes fiscales et comptables 2025',
  'Tout ce que vous devez savoir sur la loi de finances 2025 et les nouvelles obligations fiscales.'
),
(
  'Impôt Général Synthétique (IGS)',
  'IGS, ce qui change.',
  '',
  'Nathan OBIANG TIME',
  '2026-04-11',
  'Publié',
  '/lovable-uploads/a9b4950e-4e9a-4b2d-89ed-55266f59fd49.png',
  'impot-general-synthetique-igs',
  ARRAY['Fiscalité'],
  'Impôt Général Synthétique (IGS) : Ce qui change',
  'Découvrez l''Impôt Général Synthétique (IGS), comment il fonctionne et ce qui change pour les entreprises.'
)
ON CONFLICT (slug) DO NOTHING;
