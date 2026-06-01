/* ═══════════════════════════════════════════════════════════════
   MAKARIO — app.js  v4.0  |  Réseau · Marketplace · Messagerie
   Afrique Centrale — Congo Brazzaville & Région
   ═══════════════════════════════════════════════════════════════ */

const RAILWAY_URL  = 'https://makario-server.onrender.com';

const _isLocal     = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const SOCKET_URL   = _isLocal ? 'http://localhost:3000' : RAILWAY_URL;
const API_URL      = SOCKET_URL + '/api';
let   USE_MOCK     = false;
let   socket       = null;

// ─── DONNÉES MOCK (mode démo) ──────────────────────────────────────
const MOCK = {
  companies: [
    // ── Partenaires locaux ─────────────────────────────────────────
    { id:1, name:'SIGTH-TECH CONGO', sector:'TIC', city:'Brazzaville', services:'Développement web et mobile, solutions informatiques sur mesure, hébergement cloud.', vision:'Être le partenaire N°1 du peuple congolais dans le domaine des TIC.', address:'84, Rue Mayama, Brazzaville', phone:'+242 06 634 00 00', email:'contact@sigth-tech.com', cover:'💻', init:'ST' },
    { id:2, name:'BEST INFORMATIQUE', sector:'TIC', city:'Pointe-Noire', services:'Vente de matériel informatique, maintenance, formation, réseaux.', vision:'Digitaliser les entreprises congolaises à moindre coût.', address:'Centre-ville, Pointe-Noire', phone:'+242 05 512 00 00', cover:'🖥️', init:'BI' },
    { id:3, name:'EGCM', sector:'Éducation & Formation', city:'Brazzaville', services:'Formation professionnelle qualifiante, coaching emploi, stages en entreprise.', vision:"Former la jeunesse congolaise pour l'emploi de demain.", address:'84, Rue Mayama, Immeuble BGF1, 1er étage', phone:'+242 06 681 00 00', email:'egcm@formation.cg', cover:'📚', init:'EG' },
    { id:4, name:'AOFIP', sector:'Éducation & Formation', city:'Brazzaville', services:'Formation professionnelle et qualifiante, insertion professionnelle, coaching.', vision:"Vers l'emploi, mais pas seul.", address:'Rue Matsoua, Brazzaville', phone:'+242 06 672 00 00', cover:'🎓', init:'AO' },
    { id:5, name:'AI COMMUNICATION', sector:'TIC', city:'Brazzaville', services:'Agence de communication digitale, création de contenu, réseaux sociaux, branding.', vision:'Booster la visibilité des marques congolaises.', address:'Plateau des 15 ans, Brazzaville', phone:'+242 06 663 00 00', email:'contact@aicommunication.cg', cover:'📡', init:'AI' },
    { id:6, name:'MAGIC DESIGN', sector:'Culture & Arts', city:'Pointe-Noire', services:"Design graphique, identité visuelle, création de logo, impression.", vision:"L'art au service des entreprises.", address:'Avenue Lumumba, Pointe-Noire', phone:'+242 05 545 00 00', cover:'🎨', init:'MD' },
    { id:7, name:'MUSAS CONGO', sector:'Commerce', city:'Brazzaville', services:'Distribution alimentaire, import-export, grossiste, livraison.', vision:'Nourrir le Congo, de Brazzaville à Owando.', address:'Marché Total, Brazzaville', phone:'+242 06 623 00 00', cover:'🛒', init:'MC' },
    { id:8, name:'BTP PRO CONGO', sector:'BTP', city:'Dolisie', services:'Construction, rénovation, génie civil, architecture, études techniques.', vision:'Bâtir le Congo moderne, pierre par pierre.', address:'Centre-ville, Dolisie', phone:'+242 05 782 00 00', cover:'🏗️', init:'BP' },
    // ── Grandes entreprises du Congo ───────────────────────────────
    { id:9, name:'BGFI Bank Congo', sector:'Finance & Banque', city:'Brazzaville', services:"Banque universelle, crédit aux entreprises et particuliers, épargne, transferts internationaux, monétique, crédit immobilier.", vision:"Être la banque de référence de l'Afrique Centrale.", address:'Boulevard Denis Sassou Nguesso, Centre-ville, Brazzaville', phone:'+242 05 305 00 00', email:'contact@bgfi.com', website:'www.bgfi.com', cover:'🏦', init:'BG', verified:true },
    { id:10, name:'MTN Congo', sector:'Télécommunications', city:'Brazzaville', services:"Téléphonie mobile, internet 4G/5G, MTN Mobile Money, forfaits data, voix et SMS pour particuliers et entreprises.", vision:"Connecter chaque Congolais au monde numérique.", address:'Avenue du 31 Juillet, BP 2892, Brazzaville', phone:'8888', email:'customercare@mtn.cg', website:'www.mtn.cg', cover:'📡', init:'MT', verified:true },
    { id:11, name:'Airtel Congo', sector:'Télécommunications', city:'Brazzaville', services:"Téléphonie mobile, Airtel Money, internet 4G, offres prépayées et postpayées, roaming international.", vision:"La connectivité accessible pour tous les Congolais.", address:'Avenue Matsoua, Quartier Poto-Poto, Brazzaville', phone:'128', email:'support@airtel.cg', website:'www.airtel.cg', cover:'📱', init:'AC', verified:true },
    { id:12, name:'SNPC', sector:'Énergie & Pétrole', city:'Brazzaville', services:"Exploration, production et commercialisation du pétrole brut congolais. Partenariats JV avec TotalEnergies, ENI, Chevron.", vision:"Valoriser les ressources pétrolières du Congo au profit du peuple congolais.", address:'Avenue du Port, BP 188, Brazzaville', phone:'+242 05 622 00 00', email:'snpc@snpc.cg', cover:'⛽', init:'SN', verified:true },
    { id:13, name:'TotalEnergies Congo', sector:'Énergie & Pétrole', city:'Pointe-Noire', services:"Distribution de carburants, lubrifiants, stations-service, gaz domestique, solutions industrielles.", vision:"Énergie propre et accessible à tous les Congolais.", address:'Port Autonome de Pointe-Noire, BP 1004', phone:'+242 05 534 00 00', email:'congo@totalenergies.com', website:'totalenergies.cg', cover:'🛢️', init:'TE', verified:true },
    { id:14, name:'CIB (Congolaise Industrielle des Bois)', sector:'Sylviculture & Industrie', city:'Ouesso', services:"Exploitation forestière certifiée FSC, scierie industrielle, transformation du bois, exportation vers l'Europe et l'Asie.", vision:"Une industrie du bois responsable, durable et créatrice d'emplois au Congo.", address:'BP 3, Ouesso, Département Sangha', phone:'+242 05 767 00 00', email:'cib@cib-bois.com', cover:'🪵', init:'CI', verified:true },
    { id:15, name:'Olam Congo', sector:'Agriculture & Commerce', city:'Brazzaville', services:"Négoce agricole, transformation alimentaire, huile de palme, sucre, farines. Distribution nationale et export.", vision:"Nourrir le monde en partant du Congo.", address:'Zone Industrielle, Brazzaville', phone:'+242 05 300 00 00', website:'www.olamgroup.com', cover:'🌿', init:'OL', verified:true },
    { id:16, name:'Canal+ Congo', sector:'Médias & Divertissement', city:'Brazzaville', services:"Télévision par satellite, bouquets Canal+ Afrique, streaming, contenus africains et internationaux.", vision:"Le meilleur du divertissement pour l'Afrique.", address:'Avenue du Général de Gaulle, Brazzaville', phone:'+242 05 500 00 00', website:'www.canalplus.com/afrique', cover:'📺', init:'C+', verified:true },
    { id:17, name:'Azur Assurances Congo', sector:'Assurances', city:'Brazzaville', services:"Assurance vie, multirisques habitation, auto, santé entreprise, responsabilité civile professionnelle.", vision:"Protéger les familles et les entreprises congolaises.", address:'Rue Lyautey, Centre-ville, Brazzaville', phone:'+242 05 558 00 00', email:'azur@azurassurances.cg', cover:'🛡️', init:'AZ', verified:true },
    { id:18, name:'La Poste du Congo', sector:'Logistique & Services', city:'Brazzaville', services:"Courrier postal, envoi de colis, mandat postal, épargne postale, numérisation des services publics.", vision:"Relier chaque coin du Congo à moindre coût.", address:'Rond-Point de la Poste, Centre-ville, Brazzaville', phone:'+242 05 281 00 00', cover:'✉️', init:'LP', verified:true },
    { id:19, name:'Hôtel Ledger Plaza Brazzaville', sector:'Tourisme & Hôtellerie', city:'Brazzaville', services:"Hôtel 5 étoiles, restaurant gastronomique, rooftop bar, salles de conférences, spa, piscine.", vision:"L'hospitalité haut de gamme au cœur de Brazzaville.", address:"Avenue de l'OUA, Centre-ville, Brazzaville", phone:'+242 06 514 00 00', website:'ledgerplazabrazzaville.com', cover:'🏨', init:'HL', verified:true },
    { id:20, name:'CB Pharma Congo', sector:'Santé & Pharmacie', city:'Brazzaville', services:"Grossiste pharmaceutique, distribution de médicaments essentiels, dispositifs médicaux, vaccins.", vision:"Un médicament disponible pour chaque Congolais.", address:'Plateau des 15 ans, Brazzaville', phone:'+242 06 645 00 00', cover:'💊', init:'CP', verified:false },
    // ── Grandes entreprises africaines ─────────────────────────────
    { id:21, name:'Dangote Group', sector:'Industrie & Commerce', city:'Lagos', services:"Ciment, sucre, farine, sel, pétrochimie. Leader industriel présent dans 20 pays africains.", vision:"Industrialiser l'Afrique depuis le continent.", address:'Union Marble House, 1 Alfred Rewane Road, Lagos, Nigeria', phone:'+234 1 280 4000', website:'www.dangote.com', cover:'🏭', init:'DG', verified:true, country:'Nigeria 🇳🇬' },
    { id:22, name:'Safaricom', sector:'Télécommunications', city:'Nairobi', services:"Téléphonie mobile, M-Pesa Mobile Money (leader mondial du paiement mobile), internet 4G/5G, solutions IoT.", vision:"Transformer la vie des Africains par la technologie.", address:'Safaricom House, Waiyaki Way, Nairobi, Kenya', phone:'+254 722 000 000', website:'www.safaricom.co.ke', cover:'📶', init:'SF', verified:true, country:'Kenya 🇰🇪' },
    { id:23, name:'Jumia Group', sector:'E-commerce & Tech', city:'Lagos', services:"Marketplace e-commerce panafricain, Jumia Food, Jumia Pay. Opère dans 11 pays africains.", vision:"Premier e-commerce africain coté en bourse (NYSE).", address:'94 Broad Street, Lagos, Nigeria', phone:'+234 700 JUMIA', website:'www.jumia.com', cover:'🛍️', init:'JU', verified:true, country:'Nigeria 🇳🇬' },
    { id:24, name:'Equity Bank Group', sector:'Finance & Banque', city:'Nairobi', services:"Banque digitale, microfinance, crédit PME, assurance, EazzyBiz business banking. 7 pays africains.", vision:"Transformer des vies, donner de la dignité, étendre la prospérité.", address:'Equity Centre, Hospital Road, Nairobi, Kenya', phone:'+254 763 000 000', website:'www.equitybankgroup.com', cover:'🏦', init:'EQ', verified:true, country:'Kenya 🇰🇪' },
  ],
  sectors: [
    { id:'tic', label:'TIC', icon:'💻', count:124 },
    { id:'finance', label:'Finance & Banque', icon:'🏦', count:45 },
    { id:'telecom', label:'Télécoms', icon:'📡', count:18 },
    { id:'energie', label:'Énergie & Pétrole', icon:'⛽', count:32 },
    { id:'commerce', label:'Commerce', icon:'🛒', count:312 },
    { id:'services', label:'Prestations', icon:'⚙️', count:198 },
    { id:'btp', label:'BTP', icon:'🏗️', count:87 },
    { id:'tourisme', label:'Tourisme', icon:'🍽️', count:64 },
    { id:'culture', label:'Culture & Arts', icon:'🎨', count:43 },
    { id:'sante', label:'Santé', icon:'🏥', count:91 },
    { id:'education', label:'Formation', icon:'📚', count:76 },
    { id:'agri', label:'Agriculture', icon:'🌿', count:29 },
    { id:'media', label:'Médias', icon:'📺', count:21 },
    { id:'industrie', label:'Industrie', icon:'🏭', count:44 },
  ],
  news: [
    { id:1, company:'EGCM', avatar:'EG', title:'Formation Femme & TIC — Inscriptions ouvertes!', body:'La prochaine session de formation Excel, comptabilité et bureautique commence le 14 Mars.', emoji:'📊', date: new Date(Date.now()-3600000).toISOString(), likes:24, comments:[] },
    { id:2, company:'AOFIP', avatar:'AO', title:"Offre de stage bénévole en entreprise", body:"Je prépare mon stage en entreprise. Vers l'emploi mais pas seul.", emoji:'💼', date: new Date(Date.now()-7200000).toISOString(), likes:41, comments:[] },
    { id:3, company:'AI COMMUNICATION', avatar:'AI', title:'Nouveau service : Community Management', body:'Nous lançons notre offre de gestion des réseaux sociaux pour les PME congolaises.', emoji:'📱', date: new Date(Date.now()-86400000).toISOString(), likes:18, comments:[] },
    { id:4, company:'SIGTH-TECH CONGO', avatar:'ST', title:"Développement d'application mobile sur mesure", body:"Vous avez un projet d'application ? Nous transformons vos idées en solutions numériques performantes.", emoji:'📲', date: new Date(Date.now()-172800000).toISOString(), likes:56, comments:[] },
    { id:5, company:'MTN Congo', avatar:'MT', title:'MTN MoMo — Le paiement mobile simplifié', body:"Payez vos factures, envoyez de l'argent et rechargez en quelques secondes avec MTN Mobile Money.", emoji:'💸', date: new Date(Date.now()-259200000).toISOString(), likes:89, comments:[] },
    { id:6, company:'BGFI Bank Congo', avatar:'BG', title:'Ouverture de compte en ligne — 100% digital', body:'BGFI Bank Congo lance son service ouverture de compte 100% en ligne. Disponible en 24h sans déplacement.', emoji:'🏦', date: new Date(Date.now()-345600000).toISOString(), likes:134, comments:[] },
  ],
  people: [
    { id:'p1', name:'Serge Tambou', profession:'Développeur Full-Stack', city:'Brazzaville', country:'Congo', bio:'Fondateur de SIGTH-TECH CONGO. 8 ans en développement web/mobile. Expert React & Node.js.', skills:['JavaScript','React','Node.js','Flutter'], connections:124, avatar:'ST', companyId:1 },
    { id:'p2', name:'Espoir Goma', profession:'Directeur Pédagogique', city:'Brazzaville', country:'Congo', bio:'Directeur pédagogique à EGCM. Expert en formation professionnelle et insertion emploi au Congo.', skills:['Formation','Management','Pédagogie','RH'], connections:89, avatar:'EG', companyId:3 },
    { id:'p3', name:'Aimée Itoua', profession:'Directrice Communication', city:'Brazzaville', country:'Congo', bio:'Directrice d\'AI Communication. Spécialiste du marketing digital pour les PME africaines.', skills:['Marketing Digital','Social Media','Branding','Content'], connections:213, avatar:'AI', companyId:5 },
    { id:'p4', name:'Jean-Marie Mouanda', profession:'Ingénieur Pétrolier', city:'Pointe-Noire', country:'Congo', bio:'10 ans d\'expérience dans le pétrole offshore. Expert forage et production pour TotalEnergies Congo.', skills:['Géologie Pétrolière','Forage','HSE','Anglais Technique'], connections:67, avatar:'JM' },
    { id:'p5', name:'Grâce Mbemba', profession:'Architecte DESA', city:'Brazzaville', country:'Congo', bio:'Architecte spécialisée en construction durable et urbanisme tropical. Fondatrice de son cabinet.', skills:['Architecture','AutoCAD','Revit','BTP Durable'], connections:156, avatar:'GM' },
    { id:'p6', name:'Patrick Loubaki', profession:'Entrepreneur & Investisseur', city:'Brazzaville', country:'Congo', bio:'Fondateur de 3 startups tech en Afrique centrale. Mentor auprès des jeunes entrepreneurs congolais.', skills:['Entrepreneuriat','Fintech','Leadership','Levée de Fonds'], connections:412, avatar:'PL', isEntrepreneur:true },
    { id:'p7', name:'Dorothée Nkossi', profession:'Médecin & Innovatrice HealthTech', city:'Brazzaville', country:'Congo', bio:'Médecin généraliste et cofondatrice d\'une plateforme de télémédecine. Engagée pour la santé numérique au Congo.', skills:['Médecine','Télémédecine','Santé Publique','Innovation'], connections:98, avatar:'DN' },
    { id:'p8', name:'Christian Bouya', profession:'Expert-Comptable ONECCA', city:'Pointe-Noire', country:'Congo', bio:'Expert-comptable agréé ONECCA Congo. Spécialiste fiscalité congolaise, comptabilité SYSCOHADA, audit PME.', skills:['Comptabilité','Fiscalité Congo','Audit','SYSCOHADA'], connections:143, avatar:'CB' },
    { id:'p9', name:'Marie-France Taty', profession:'Enseignante & Formatrice TIC', city:'Brazzaville', country:'Congo', bio:'Professeure de mathématiques et formatrice en TIC. Pionnière de la digitalisation de l\'éducation au Congo.', skills:['Enseignement','Formation TIC','Mathématiques','Pédagogie Numérique'], connections:75, avatar:'MF' },
    { id:'p10', name:'Rodrigue Nzaou', profession:'Designer UI/UX Senior', city:'Brazzaville', country:'Congo', bio:'Designer senior chez MAGIC DESIGN. Passionné par l\'identité visuelle des marques africaines et le design inclusif.', skills:['Figma','Adobe Suite','UI/UX','Branding Africain'], connections:187, avatar:'RN', companyId:6 },
    { id:'p11', name:'Blaise Moukagni', profession:'Ingénieur Réseaux & Télécoms', city:'Brazzaville', country:'Congo', bio:'Ingénieur télécoms chez Airtel Congo. Expert déploiement infrastructure 4G/5G et optimisation réseau.', skills:['Réseaux','4G/5G','Cisco CCNP','Télécoms'], connections:54, avatar:'BM', companyId:11 },
    { id:'p12', name:'Laetitia Nguimbi', profession:'Juriste d\'Entreprise OHADA', city:'Brazzaville', country:'Congo', bio:'Juriste spécialisée en droit des affaires OHADA et droit social congolais. Conseil et accompagnement PME.', skills:['Droit OHADA','Contrats','Droit Social','Contentieux'], connections:91, avatar:'LN' },
  ],
  universities: [
    { id:'u1', name:'Université Marien Ngouabi (UMN)', type:'Université Publique', city:'Brazzaville', country:'Congo 🇨🇬', faculties:['Droit, Économie & Gestion','Lettres & Sciences Humaines','Sciences & Techniques','Médecine & Pharmacie','ENSP Polytechnique','FLSH'], address:'Boulevard Denis Sassou Nguesso, BP 69, Brazzaville', phone:'+242 06 665 12 34', email:'rectorat@umng.cg', founded:1971, students:'25 000+', cover:'🎓', init:'UMN', verified:true },
    { id:'u2', name:'ENSP (École Nationale Supérieure Polytechnique)', type:'École d\'Ingénieurs', city:'Brazzaville', country:'Congo 🇨🇬', faculties:['Génie Civil','Génie Électrique','Génie Informatique & Télécoms','Génie Chimique & Procédés','Génie Mécanique'], address:'Campus UMN, BP 69, Brazzaville', phone:'+242 06 612 00 00', email:'ensp@umng.cg', founded:1962, students:'2 500+', cover:'⚙️', init:'EN', verified:true },
    { id:'u3', name:'IST Congo (Institut Supérieur de Technologie)', type:'Institut Privé', city:'Brazzaville', country:'Congo 🇨🇬', faculties:['Informatique & Réseaux','Développement Web & Mobile','Gestion Informatisée','Administration Systèmes & Cloud'], address:'Quartier Bacongo, Avenue Bouenza, Brazzaville', phone:'+242 06 680 00 00', email:'contact@ist-congo.com', founded:2003, students:'1 200+', cover:'💻', init:'IS', verified:true },
    { id:'u4', name:'Université de Pointe-Noire (UPN)', type:'Université Publique', city:'Pointe-Noire', country:'Congo 🇨🇬', faculties:['Sciences & Techniques Pétrolières','Sciences Économiques','Droit des Affaires','Ingénierie Offshore'], address:'Avenue du Général de Gaulle, Pointe-Noire', phone:'+242 05 549 00 00', email:'upn@education.cg', founded:2012, students:'5 000+', cover:'🏛️', init:'UP', verified:true },
    { id:'u5', name:'ESSEC Congo', type:'École de Gestion', city:'Brazzaville', country:'Congo 🇨🇬', faculties:['Commerce & Marketing','Finance d\'Entreprise','Management Interculturel','Entrepreneuriat & Innovation'], address:'Plateau des 15 ans, Brazzaville', phone:'+242 06 670 00 00', email:'info@essec-congo.com', founded:2008, students:'800+', cover:'📊', init:'ES', verified:false },
    { id:'u6', name:'IFEG (Institut de Formation à l\'Expertise et à la Gestion)', type:'Institut Professionnel', city:'Brazzaville', country:'Congo 🇨🇬', faculties:['Comptabilité SYSCOHADA','Gestion des RH','Fiscalité Congolaise','Audit & Contrôle de Gestion'], address:'Rue Félix Éboué, Brazzaville', phone:'+242 06 655 00 00', email:'ifeg@formation.cg', founded:2005, students:'600+', cover:'📋', init:'IF', verified:false },
    { id:'u7', name:'Université de Yaoundé I', type:'Université Publique', city:'Yaoundé', country:'Cameroun 🇨🇲', faculties:['Sciences','Médecine','Droit','Lettres','Économie & Gestion'], address:'Ngoa-Ekellé, BP 1365, Yaoundé', phone:'+237 222 23 13 89', email:'rectorat@uy1.uninet.cm', founded:1962, students:'45 000+', cover:'🎓', init:'UY', verified:true },
    { id:'u8', name:'Université Cheikh Anta Diop (UCAD)', type:'Université Publique', city:'Dakar', country:'Sénégal 🇸🇳', faculties:['Sciences & Technologie','Droit','Médecine','Lettres','Sciences Économiques'], address:'Boulevard Dial Diop, Dakar', phone:'+221 33 825 05 30', email:'contact@ucad.sn', website:'www.ucad.sn', founded:1957, students:'80 000+', cover:'🏛️', init:'UC', verified:true },
    { id:'u9', name:'Université Félix Houphouët-Boigny', type:'Université Publique', city:'Abidjan', country:'Côte d\'Ivoire 🇨🇮', faculties:['Sciences','Médecine','Droit','Lettres','Sciences Économiques'], address:'Cocody, 01 BP V 34, Abidjan', phone:'+225 27 22 44 08 21', email:'presidence@univ-fhb.edu.ci', founded:1963, students:'60 000+', cover:'🎓', init:'UF', verified:true },
    { id:'u10', name:'Université de Kinshasa (UNIKIN)', type:'Université Publique', city:'Kinshasa', country:'RD Congo 🇨🇩', faculties:['Sciences','Médecine','Droit','Lettres','Sciences Sociales & Politiques'], address:'Campus de Lemba, BP 127, Kinshasa XI', phone:'+243 997 000 000', email:'rectorat@unikin.ac.cd', founded:1954, students:'35 000+', cover:'🏫', init:'UK', verified:true },
    { id:'u11', name:'Université de Lomé', type:'Université Publique', city:'Lomé', country:'Togo 🇹🇬', faculties:['Sciences','Médecine','Droit','Lettres','ESTIM','FASEG'], address:'BP 1515, Lomé', phone:'+228 22 21 35 00', email:'presidence@univ-lome.tg', founded:1970, students:'25 000+', cover:'🎓', init:'UL', verified:true },
    { id:'u12', name:'Université Omar Bongo (UOB)', type:'Université Publique', city:'Libreville', country:'Gabon 🇬🇦', faculties:['Sciences','Médecine','Droit','Lettres','Sciences Économiques'], address:'BP 13131, Libreville', phone:'+241 01 73 20 14', email:'rectorat@uob.ga', founded:1970, students:'20 000+', cover:'🏛️', init:'UO', verified:true },
  ],
  entrepreneurs: [
    { id:'e1', name:'Patrick Loubaki', startup:'CongoPay', sector:'Fintech', stage:'Croissance', pitch:'Solution de paiement mobile multi-opérateurs pour le Congo. Compatible MTN, Airtel, Orange Money. +50 000 utilisateurs actifs.', city:'Brazzaville', avatar:'PL', funding:'500K USD levés', seeking:false, personId:'p6' },
    { id:'e2', name:'Alvine Moutsila', startup:'FarmConnect CG', sector:'AgriTech', stage:'MVP', pitch:'Plateforme B2B mettant en relation les agriculteurs du Pool et les acheteurs grossistes de Brazzaville. Réduit les intermédiaires de 60%.', city:'Brazzaville', avatar:'AM', funding:'Recherche 100K USD', seeking:true },
    { id:'e3', name:'Joël Nkaya', startup:'MedCongo', sector:'HealthTech', stage:'Seed', pitch:'Application de télémédecine avec IA pour le diagnostic préliminaire. 1ère plateforme de santé numérique au Congo. 1 200 consultations/mois.', city:'Brazzaville', avatar:'JN', funding:'150K USD levés', seeking:false },
    { id:'e4', name:'Stéphanie Bouanga', startup:'EduNum Congo', sector:'EdTech', stage:'MVP', pitch:'Plateforme de cours en ligne en français adaptée aux programmes congolais. Pour collégiens et lycéens. Fonctionne hors-ligne.', city:'Pointe-Noire', avatar:'SB', funding:'Recherche 80K USD', seeking:true },
    { id:'e5', name:'Léandre Moussoki', startup:'TrackCG', sector:'Logistique & Tech', stage:'Croissance', pitch:'GPS tracking et gestion de flotte pour entreprises congolaises. API intégrable. 35 clients B2B actifs. +500 véhicules suivis.', city:'Brazzaville', avatar:'LM', funding:'300K USD levés', seeking:false },
    { id:'e6', name:'Fabiola Kiminou', startup:'CongoJob', sector:'RH & Recrutement', stage:'Lancement', pitch:'1ère plateforme d\'emploi vérifiée au Congo. CV en ligne, alertes offres par secteur, vérification employeurs, matching IA.', city:'Brazzaville', avatar:'FK', funding:'Recherche 50K USD', seeking:true },
    { id:'e7', name:'Aristide Mabika', startup:'Solar Congo', sector:'Énergie Verte', stage:'Seed', pitch:'Kits solaires en location-vente pour ménages sans électricité. 5 000 FCFA/mois seulement. 200 foyers déjà équipés à Dolisie.', city:'Dolisie', avatar:'AR', funding:'200K USD levés', seeking:true },
    { id:'e8', name:'Vanessa Tsika', startup:'BeautyAfrica', sector:'E-commerce', stage:'Croissance', pitch:'Marketplace de produits de beauté africains naturels. Livraison 24h à Brazzaville. Présente dans 5 pays d\'Afrique centrale.', city:'Brazzaville', avatar:'VT', funding:'Autofinancé', seeking:false },
  ],
};

function mockDB(key, def) {
  try { return JSON.parse(localStorage.getItem('mk_'+key)) || def; } catch { return def; }
}
function mockSave(key, val) { localStorage.setItem('mk_'+key, JSON.stringify(val)); }

// ─── ÉTAT GLOBAL ──────────────────────────────────────────────────
let token        = localStorage.getItem('makario_token') || null;
let currentUser  = JSON.parse(localStorage.getItem('makario_user')||'null');
let companiesAll    = [];
let companiesPage   = 1;
let companiesHasMore = false;
let navHistory      = ['home'];
let currentConvId = null;
let likedNewsIds  = JSON.parse(localStorage.getItem('makario_liked')||'[]');
let mockNews      = mockDB('news', [...MOCK.news]);

// ─── COUCHE API (réel ou mock) ────────────────────────────────────

async function apiFetch(method, path, body) {
  if (USE_MOCK) return mockFetch(method, path, body);
  try {
    const opts = { method, headers: { 'Content-Type':'application/json', ...(token?{'Authorization':'Bearer '+token}:{}) } };
    if (body) opts.body = JSON.stringify(body);
    const res  = await fetch(API_URL + path, opts);
    return await res.json();
  } catch {
    USE_MOCK = true;
    return mockFetch(method, path, body);
  }
}

async function apiUpload(formData) {
  if (USE_MOCK) {
    // Mode démo : lire le fichier et retourner une data URL locale
    return new Promise(resolve => {
      const file = formData.get('file');
      if (!file) return resolve({ success:false, error:'Aucun fichier' });
      const reader = new FileReader();
      reader.onload = e => resolve({ success:true, data:{ url: e.target.result, filename:'demo', size: file.size, demo:true } });
      reader.readAsDataURL(file);
    });
  }
  try {
    const res = await fetch(API_URL + '/upload', {
      method: 'POST',
      headers: token ? { 'Authorization':'Bearer '+token } : {},
      body: formData
    });
    return await res.json();
  } catch {
    return { success:false, error:'Upload impossible — vérifiez la connexion' };
  }
}

function mockFetch(method, path, body) {
  // Simule latence réseau
  return new Promise(resolve => setTimeout(() => resolve(mockRoute(method, path, body)), 120));
}

function mockRoute(method, path, body) {
  const parts = path.split('/').filter(Boolean);
  const resource = parts[0];
  const id = parts[1] ? parseInt(parts[1]) : null;
  const sub = parts[2];

  if (resource === 'health') return { success:true, message:'Mode démo actif' };

  // AUTH
  if (resource === 'auth') {
    const action = parts[1];
    if (action === 'register') {
      const users = mockDB('users',[]);
      if (users.find(u=>u.email===body.email)) return {success:false,error:'Email déjà utilisé'};
      const user = {id:Date.now(),name:body.name,email:body.email,avatar:body.name.slice(0,1).toUpperCase(),createdAt:new Date().toISOString()};
      users.push(user);
      mockSave('users',users);
      const t = 'demo_' + btoa(JSON.stringify(user));
      localStorage.setItem('makario_token', t);
      localStorage.setItem('makario_user', JSON.stringify(user));
      if (body.company?.name) {
        const companies = mockDB('companies',[...MOCK.companies]);
        const newCo = {id:Date.now()+1,...body.company,init:body.company.name.slice(0,2).toUpperCase(),cover:'🏢',ownerId:user.id,createdAt:new Date().toISOString()};
        companies.push(newCo);
        mockSave('companies',companies);
      }
      return {success:true,data:{token:t,user}};
    }
    if (action === 'login') {
      const users = mockDB('users',[]);
      const user = users.find(u=>u.email===body.email);
      if (!user) return {success:false,error:'Email ou mot de passe incorrect'};
      const t = 'demo_' + btoa(JSON.stringify(user));
      localStorage.setItem('makario_token', t);
      localStorage.setItem('makario_user', JSON.stringify(user));
      return {success:true,data:{token:t,user}};
    }
    if (action === 'me') {
      if (!currentUser) return {success:false,error:'Non authentifié'};
      return {success:true,data:currentUser};
    }
  }

  // COMPANIES
  if (resource === 'companies') {
    const companies = mockDB('companies',[...MOCK.companies]);
    if (method==='GET'&&!id) return {success:true,data:companies};
    if (method==='GET'&&id) { const c=companies.find(x=>String(x.id)===String(id)); return c?{success:true,data:c}:{success:false,error:'Introuvable'}; }
    if (method==='POST') {
      if (!currentUser) return {success:false,error:'Non authentifié'};
      const c = {id:Date.now(),...body,init:(body.name||'').slice(0,2).toUpperCase(),cover:'🏢',ownerId:currentUser.id,createdAt:new Date().toISOString()};
      companies.push(c); mockSave('companies',companies);
      return {success:true,data:c};
    }
    if (method==='PATCH'&&id) {
      if (!currentUser) return {success:false,error:'Non authentifié'};
      const idx=companies.findIndex(x=>String(x.id)===String(id));
      if (idx===-1) return {success:false,error:'Introuvable'};
      if (String(companies[idx].ownerId)!==String(currentUser.id)) return {success:false,error:'Non autorisé'};
      Object.assign(companies[idx],body);
      if (body.name) companies[idx].init=body.name.slice(0,2).toUpperCase();
      mockSave('companies',companies);
      return {success:true,data:companies[idx]};
    }
    if (method==='DELETE'&&id) {
      if (!currentUser) return {success:false,error:'Non authentifié'};
      const idx=companies.findIndex(x=>String(x.id)===String(id));
      if (idx===-1) return {success:false,error:'Introuvable'};
      if (String(companies[idx].ownerId)!==String(currentUser.id)) return {success:false,error:'Non autorisé'};
      companies.splice(idx,1);
      mockSave('companies',companies);
      return {success:true};
    }
  }

  // SECTORS
  if (resource === 'sectors') return {success:true,data:MOCK.sectors};

  // NEWS
  if (resource === 'news') {
    const news = mockDB('news',[...MOCK.news]);
    if (method==='GET'&&!id&&!sub) return {success:true,data:[...news].reverse()};
    if (method==='POST'&&!id) {
      if (!currentUser) return {success:false,error:'Non authentifié'};
      const n = {id:Date.now(),...body,company:currentUser.name,avatar:currentUser.avatar,date:new Date().toISOString(),likes:0,comments:[]};
      news.push(n); mockSave('news',news);
      return {success:true,data:n};
    }
    if (id&&sub==='like') {
      const n=news.find(x=>x.id===id); if(n){n.likes++;mockSave('news',news);return {success:true,data:n};}
    }
    if (id&&sub==='unlike') {
      const n=news.find(x=>x.id===id); if(n){n.likes=Math.max(0,n.likes-1);mockSave('news',news);return {success:true,data:n};}
    }
  }

  // FAVORITES
  if (resource === 'favorites') {
    if (!currentUser) return {success:false,error:'Non authentifié'};
    const favs = mockDB('favs_'+currentUser.id,[]);
    const companies = mockDB('companies',[...MOCK.companies]);
    if (method==='GET') { const list=companies.filter(c=>favs.includes(c.id)); return {success:true,data:list}; }
    if (method==='POST'&&id) {
      if (favs.includes(id)) return {success:false,error:'Déjà en favoris'};
      favs.push(id); mockSave('favs_'+currentUser.id,favs); return {success:true};
    }
    if (method==='DELETE'&&id) {
      const idx=favs.indexOf(id); if(idx>-1){favs.splice(idx,1);mockSave('favs_'+currentUser.id,favs);} return {success:true};
    }
  }

  // CONVERSATIONS
  if (resource === 'conversations') {
    if (!currentUser) return {success:false,error:'Non authentifié'};
    const convs = mockDB('convs',[]);
    if (method==='GET'&&!id) return {success:true,data:convs.filter(c=>c.participants.includes(currentUser.id)).map(c=>({...c,preview:'',time:'',unread:0}))};
    if (method==='POST'&&!id) {
      const existing = convs.find(c=>c.participants.includes(currentUser.id)&&c.participants.includes(body.recipientId));
      if (existing) return {success:true,data:existing};
      const conv = {id:Date.now(),participants:[currentUser.id,body.recipientId],companyId:body.companyId||null,createdAt:new Date().toISOString()};
      convs.push(conv); mockSave('convs',convs); return {success:true,data:conv};
    }
    if (id&&sub==='messages') {
      const msgs = mockDB('msgs_'+id,[]);
      if (method==='GET') return {success:true,data:msgs.map(m=>({...m,sent:m.senderId===currentUser.id}))};
      if (method==='POST') {
        const msg={id:Date.now(),conversationId:id,senderId:currentUser.id,senderName:currentUser.name,text:body.text,date:new Date().toISOString(),read:false};
        msgs.push(msg); mockSave('msgs_'+id,msgs); return {success:true,data:{...msg,sent:true}};
      }
    }
  }

  // STATS
  if (resource === 'stats') {
    const companies = mockDB('companies',[...MOCK.companies]);
    const users = mockDB('users',[]);
    const news = mockDB('news',[...MOCK.news]);
    return {success:true,data:{totalCompanies:companies.length,totalUsers:users.length,totalNews:news.length,totalSectors:MOCK.sectors.length}};
  }

  // PEOPLE
  if (resource === 'people') {
    const people = mockDB('people', MOCK.people);
    if (method==='GET'&&!id) return {success:true,data:people};
    if (method==='GET'&&id) { const p=people.find(x=>x.id===id); return p?{success:true,data:p}:{success:false,error:'Introuvable'}; }
  }

  // UNIVERSITIES
  if (resource === 'universities') {
    if (method==='GET') return {success:true,data:MOCK.universities};
  }

  // ENTREPRENEURS
  if (resource === 'entrepreneurs') {
    if (method==='GET') return {success:true,data:MOCK.entrepreneurs};
  }

  // SUBSCRIPTIONS
  if (resource === 'subscriptions') {
    if (!currentUser) return {success:false,error:'Non authentifié'};
    const subs = mockDB('subscriptions',{});
    if (method==='GET') return {success:true,data:subs[currentUser.id]||null};
    if (method==='POST') {
      subs[currentUser.id] = {...body, activatedAt:new Date().toISOString(), userId:currentUser.id};
      mockSave('subscriptions',subs);
      return {success:true,data:subs[currentUser.id]};
    }
  }

  // AUTH PROFILE UPDATE
  if (resource === 'auth' && parts[1] === 'profile' && method === 'PUT') {
    if (!currentUser) return {success:false,error:'Non authentifié'};
    const users = mockDB('users',[]);
    const idx = users.findIndex(u=>u.id===currentUser.id);
    if (idx>-1) {
      if (body.name) users[idx].name=body.name;
      if (body.profession!==undefined) users[idx].profession=body.profession;
      if (body.city!==undefined) users[idx].city=body.city;
      if (body.avatar!==undefined) users[idx].avatar=body.avatar;
      mockSave('users',users);
      const {password,...safe}=users[idx];
      currentUser=safe;
      localStorage.setItem('makario_user',JSON.stringify(currentUser));
      return {success:true,data:safe};
    }
    return {success:false,error:'Utilisateur introuvable'};
  }

  return {success:false,error:'Route inconnue'};
}

// ─── TOAST ────────────────────────────────────────────────────────
function showToast(msg, type) {
  let t = document.getElementById('toast-msg');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast-msg';
    t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);color:#fff;padding:10px 20px;border-radius:24px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,.25);transition:opacity .3s;pointer-events:none;white-space:nowrap;max-width:80vw;text-align:center';
    document.body.appendChild(t);
  }
  t.style.background = type==='error'?'#EF4444':type==='success'?'#2ED47A':'#1E66FF';
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(t._timer); t._timer = setTimeout(()=>{t.style.opacity='0';},2800);
}

// ─── NAVIGATION ───────────────────────────────────────────────────
function goTo(page) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const el = document.getElementById('page-'+page);
  if (el) el.classList.add('active');
  document.querySelectorAll('.bn-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
  if (navHistory[navHistory.length-1]!==page) navHistory.push(page);
  const map = {home:loadHome,explore:loadExplore,news:loadNews,messages:loadMessages,favorites:loadFavorites,profile:loadProfile,dashboard:loadDashboard};
  if (map[page]) map[page]();
  window.scrollTo(0,0);
}

function goBack() {
  if (navHistory.length>1){navHistory.pop();goTo(navHistory[navHistory.length-1]);}
}

function formatTime(d) {
  const dt=new Date(d),now=new Date(),diff=now-dt;
  if(diff<60000)return "À l'instant";
  if(diff<3600000)return`Il y a ${Math.floor(diff/60000)} min`;
  if(diff<86400000)return`Il y a ${Math.floor(diff/3600000)}h`;
  return dt.toLocaleDateString('fr-FR',{day:'numeric',month:'short'});
}

// ─── COMPOSANTS ───────────────────────────────────────────────────
function companyCard(c) {
  return `<div class="company-card" onclick="openCompany('${c.id}')">
    <div class="cc-cover"><div class="cc-avatar" style="font-size:28px;background:linear-gradient(135deg,#1E66FF22,#2ED47A22)">${c.cover||c.init}</div></div>
    <div class="cc-body">
      <div class="cc-header">
        <div>
          <h4 class="cc-name">${c.name}${c.verified?'<span style="background:#D1FAE5;color:#065F46;font-size:9px;padding:2px 6px;border-radius:6px;margin-left:6px;font-weight:800">✓ Vérifié</span>':''}</h4>
          <span class="cc-sector">${c.sector} · ${c.city}${c.country?' · '+c.country:''}</span>
        </div>
        <button class="fav-btn" onclick="toggleFav(event,'${c.id}')" data-company-id="${c.id}" style="font-size:18px;background:none;border:none;cursor:pointer;color:#ccc">♡</button>
      </div>
      <p class="cc-services">${(c.services||'').slice(0,90)}…</p>
      ${c.phone||c.email?`<div style="font-size:11px;color:#6B7280;margin-bottom:8px;display:flex;gap:10px;flex-wrap:wrap">${c.phone?`<a href="tel:${c.phone}" onclick="event.stopPropagation()" style="color:#1E66FF;font-weight:600;text-decoration:none">📞 ${c.phone}</a>`:''}${c.email?`<a href="mailto:${c.email}" onclick="event.stopPropagation()" style="color:#1E66FF;font-weight:600;text-decoration:none;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">✉️ ${c.email}</a>`:''}</div>`:''}
      <div class="cc-actions">
        <button class="btn-sm btn-primary" onclick="event.stopPropagation();openCompany('${c.id}')">Voir</button>
        <button class="btn-sm btn-outline" onclick="event.stopPropagation();contactCompany('${c.id}')">Contacter</button>
      </div>
    </div>
  </div>`;
}

function newsCard(n) {
  const liked=likedNewsIds.includes(n.id);
  return `<article class="news-card" id="news-card-${n.id}">
    <div class="nc-header">
      <div class="nc-avatar">${n.avatar||'?'}</div>
      <div class="nc-meta"><strong>${n.company||'Entreprise'}</strong><span>${formatTime(n.date)}</span></div>
    </div>
    ${n.emoji?`<div style="font-size:32px;margin:10px 0">${n.emoji}</div>`:''}
    <h4 class="nc-title">${n.title}</h4>
    <p class="nc-body">${n.body}</p>
    ${n.image?`<img src="${n.image}" alt="" style="width:100%;border-radius:12px;margin:10px 0;max-height:220px;object-fit:cover;display:block"/>`:''}
    <div class="nc-actions">
      <button class="nc-btn${liked?' liked':''}" id="like-btn-${n.id}" onclick="toggleLike(${n.id})" style="${liked?'color:#1E66FF':''}">
        ${liked?'♥':'♡'} <span id="likes-count-${n.id}">${n.likes}</span>
      </button>
      <button class="nc-btn" onclick="showToast('Commentaire bientôt disponible')">💬 ${(n.comments||[]).length}</button>
      <button class="nc-btn" onclick="showToast('Lien copié !')">↗ Partager</button>
    </div>
  </article>`;
}

// ─── HOME ─────────────────────────────────────────────────────────
async function loadHome() {
  if (companiesAll.length===0){const r=await apiFetch('GET','/companies');if(r.success)companiesAll=r.data;}
  const spotlight=document.getElementById('spotlight-list');
  if (spotlight) spotlight.innerHTML=companiesAll.slice(0,4).map(c=>`
    <div class="spotlight-card" onclick="openCompany('${c.id}')">
      <div style="font-size:36px;margin-bottom:10px">${c.cover||c.init}</div>
      <div style="font-weight:800;font-size:11px;color:var(--navy,#0D1931);margin-bottom:3px;line-height:1.3">${c.name}</div>
      <div style="font-size:10px;color:var(--blue,#1E66FF);font-weight:700">${c.sector}</div>
      <div style="font-size:10px;color:#6B7280;margin-top:2px">📍 ${c.city}</div>
    </div>`).join('');
  const sectorsEl=document.getElementById('sectors-home');
  if (sectorsEl&&!sectorsEl.dataset.loaded){
    const rs=await apiFetch('GET','/sectors');
    if(rs.success){sectorsEl.innerHTML=rs.data.map(s=>`<div class="sector-pill" onclick="exploreSector('${s.label}')"><div style="font-size:28px;margin-bottom:6px">${s.icon}</div><div style="font-weight:800;font-size:12px">${s.label}</div><div style="font-size:10px;color:#6B7280;margin-top:2px">${s.count}+</div></div>`).join('');sectorsEl.dataset.loaded='1';}
  }
}

// ─── EXPLORE — ONGLETS ────────────────────────────────────────────
function switchExploreTab(tab) {
  document.querySelectorAll('.et-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.explore-tab-content').forEach(c => c.classList.add('hidden'));
  document.getElementById('tab-' + tab)?.classList.remove('hidden');
  if (tab === 'companies') loadExplore();
  else if (tab === 'people') loadPeople();
  else if (tab === 'universities') loadUniversities();
  else if (tab === 'entrepreneurs') loadEntrepreneurs();
}

// ─── EXPLORE — ENTREPRISES ────────────────────────────────────────
async function loadExplore(){
  if(companiesAll.length===0){
    companiesPage=1; companiesHasMore=false;
    const r=await apiFetch('GET','/companies');
    if(r.success){
      companiesAll=r.data;
      companiesHasMore=r.pagination?r.pagination.page<r.pagination.pages:false;
    }
  }
  renderExploreList(companiesAll);
}
async function loadMoreCompanies(){
  if(!companiesHasMore)return;
  companiesPage++;
  const r=await apiFetch('GET','/companies?page='+companiesPage);
  if(r.success){
    companiesAll=[...companiesAll,...r.data];
    companiesHasMore=r.pagination?companiesPage<r.pagination.pages:false;
    renderExploreList(companiesAll);
  }
}
function renderExploreList(list){
  const el=document.getElementById('explore-list');
  if(!el)return;
  el.innerHTML=list.length?list.map(c=>companyCard(c)).join(''):'<div class="empty-state" style="padding:40px;text-align:center;color:#6B7280"><p>Aucune entreprise trouvée</p></div>';
  let btn=document.getElementById('load-more-companies');
  if(!btn){
    btn=document.createElement('button');
    btn.id='load-more-companies';
    btn.style.cssText='display:none;width:100%;margin:16px 0;padding:14px;border:1.5px solid rgba(255,255,255,.12);border-radius:14px;background:rgba(255,255,255,.04);color:#A8C0DC;font-weight:700;font-size:13px;cursor:pointer';
    btn.textContent='Charger plus d\'entreprises ↓';
    btn.onclick=loadMoreCompanies;
    el.after(btn);
  }
  btn.style.display=companiesHasMore?'block':'none';
}
function filterCompanies(){
  const q=(document.getElementById('explore-search')?.value||'').toLowerCase();
  const sector=document.getElementById('filter-sector')?.value||'';
  const city=document.getElementById('filter-city')?.value||'';
  let r=companiesAll;
  if(q)r=r.filter(c=>c.name.toLowerCase().includes(q)||(c.services||'').toLowerCase().includes(q));
  if(sector)r=r.filter(c=>c.sector===sector);
  if(city)r=r.filter(c=>c.city===city);
  renderExploreList(r);
}
function exploreSector(sector){goTo('explore');setTimeout(()=>{switchExploreTab('companies');const s=document.getElementById('filter-sector');if(s){s.value=sector;filterCompanies();}},100);}
function handleSearch(q){if(!q||q.trim().length<2)return;goTo('explore');setTimeout(()=>{switchExploreTab('companies');const i=document.getElementById('explore-search');if(i){i.value=q;filterCompanies();}},100);}

// ─── PERSONNES ────────────────────────────────────────────────────
let peopleAll = [];

function personCard(p) {
  const grad = ['linear-gradient(135deg,#1E66FF,#2ED47A)','linear-gradient(135deg,#7C3AED,#1E66FF)','linear-gradient(135deg,#FF6B35,#F7B500)','linear-gradient(135deg,#2ED47A,#1E66FF)'][p.id.charCodeAt(1)%4];
  return `<div class="person-card" onclick="openPersonProfile('${p.id}')">
    <div class="pc-avatar" style="background:${grad}">${p.avatar}</div>
    <div class="pc-body">
      <div class="pc-name">${p.name}${p.isEntrepreneur?'<span class="pc-entrepreneur-badge">🚀</span>':''}</div>
      <div class="pc-role">${p.profession}</div>
      <div class="pc-location">📍 ${p.city}, ${p.country}</div>
      <p class="pc-bio">${(p.bio||'').slice(0,85)}…</p>
      <div class="pc-skills">${(p.skills||[]).slice(0,3).map(s=>`<span class="skill-tag">${s}</span>`).join('')}</div>
      <div class="pc-footer">
        <span class="pc-connections">👥 ${p.connections} connexions</span>
        <button class="btn-sm btn-primary" onclick="event.stopPropagation();connectPerson('${p.id}')">+ Connecter</button>
      </div>
    </div>
  </div>`;
}

async function loadPeople() {
  const list = document.getElementById('people-list'); if (!list) return;
  if (peopleAll.length === 0) {
    list.innerHTML = skeletonNewsCards(4);
    const r = await apiFetch('GET', '/people');
    peopleAll = r.success ? r.data : MOCK.people;
  }
  renderPeople(peopleAll);
}

function renderPeople(data) {
  const list = document.getElementById('people-list'); if (!list) return;
  list.innerHTML = data.length ? data.map(p => personCard(p)).join('')
    : '<div class="empty-state">Aucune personne trouvée</div>';
}

function filterPeople() {
  const q = (document.getElementById('people-search')?.value||'').toLowerCase();
  if (!q) { renderPeople(peopleAll); return; }
  renderPeople(peopleAll.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.profession||'').toLowerCase().includes(q) ||
    (p.city||'').toLowerCase().includes(q) ||
    (p.skills||[]).some(s => s.toLowerCase().includes(q))
  ));
}

async function connectPerson(personId) {
  if (!token) { showToast('Connectez-vous pour contacter', 'error'); return goTo('login'); }
  showToast('Demande de connexion envoyée ! ✓', 'success');
}

function openPersonProfile(personId) {
  const p = peopleAll.find(x => x.id === personId) || MOCK.people.find(x => x.id === personId);
  if (!p) return;
  goTo('company');
  const page = document.getElementById('page-company');
  page.querySelector('.company-detail')?.remove();
  const div = document.createElement('div'); div.className = 'company-detail'; div.style.padding = '20px';
  const grad = ['linear-gradient(135deg,#1E66FF,#2ED47A)','linear-gradient(135deg,#7C3AED,#1E66FF)','linear-gradient(135deg,#FF6B35,#F7B500)','linear-gradient(135deg,#2ED47A,#1E66FF)'][p.id.charCodeAt(1)%4];
  div.innerHTML = `
    <div style="text-align:center;padding:28px;background:linear-gradient(135deg,rgba(74,142,255,.12),rgba(46,212,122,.08));border-radius:20px;margin-bottom:16px;border:1px solid rgba(255,255,255,.06)">
      <div style="width:80px;height:80px;border-radius:50%;${grad.replace('linear-gradient','background:linear-gradient')};color:#fff;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;margin:0 auto 14px">${p.avatar}</div>
      <h2 style="font-size:22px;font-weight:800;color:#E0EEFF">${p.name}${p.isEntrepreneur?' 🚀':''}</h2>
      <div style="color:#4A8EFF;font-weight:700;margin-top:4px">${p.profession}</div>
      <div style="color:#5F7FA0;font-size:13px;margin-top:4px">📍 ${p.city}, ${p.country}</div>
      <div style="margin-top:14px;display:flex;gap:20px;justify-content:center">
        <div style="text-align:center"><strong style="display:block;font-size:20px;color:#E0EEFF">${p.connections}</strong><span style="font-size:11px;color:#5F7FA0">Connexions</span></div>
      </div>
    </div>
    ${p.bio?`<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:16px;margin-bottom:12px"><h4 style="font-size:13px;font-weight:800;color:#E0EEFF;margin-bottom:8px">À propos</h4><p style="font-size:13px;color:#A8C0DC;line-height:1.6">${p.bio}</p></div>`:''}
    ${p.skills?.length?`<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:16px;margin-bottom:16px"><h4 style="font-size:13px;font-weight:800;color:#E0EEFF;margin-bottom:10px">Compétences</h4><div style="display:flex;flex-wrap:wrap;gap:8px">${p.skills.map(s=>`<span class="skill-tag">${s}</span>`).join('')}</div></div>`:''}
    <div style="display:flex;gap:10px">
      <button class="btn-primary" onclick="connectPerson('${p.id}')" style="flex:2">✉️ Contacter</button>
      <button class="btn-outline" onclick="showToast('Profil partagé !')" style="flex:1">↗ Partager</button>
    </div>`;
  page.appendChild(div);
}

// ─── UNIVERSITÉS ──────────────────────────────────────────────────
let universitiesAll = [];

function universityCard(u) {
  return `<div class="uni-card" onclick="openUniversity('${u.id}')">
    <div class="uc-header">
      <div class="uc-icon">${u.cover}</div>
      <div style="flex:1">
        ${u.verified?'<span class="uc-badge verified">✓ Vérifiée</span>':''}
        <div class="uc-type">${u.type}</div>
      </div>
    </div>
    <h4 class="uc-name">${u.name}</h4>
    <div class="uc-location">📍 ${u.city} · ${u.country}</div>
    <div class="uc-meta">
      <span>🎓 ${u.students} étudiants</span>
      <span>📅 Fondée en ${u.founded}</span>
    </div>
    <div class="uc-faculties">${u.faculties.slice(0,3).map(f=>`<span class="skill-tag">${f}</span>`).join('')}${u.faculties.length>3?`<span class="skill-tag">+${u.faculties.length-3} filières</span>`:''}</div>
    <div class="uc-actions">
      <button class="btn-sm btn-primary" onclick="event.stopPropagation();openUniversity('${u.id}')">Voir détails</button>
      ${u.phone?`<button class="btn-sm btn-outline" onclick="event.stopPropagation();window.open('tel:${u.phone}')">📞 Appeler</button>`:''}
    </div>
  </div>`;
}

async function loadUniversities() {
  const list = document.getElementById('universities-list'); if (!list) return;
  if (universitiesAll.length === 0) {
    list.innerHTML = skeletonNewsCards(3);
    const r = await apiFetch('GET', '/universities');
    universitiesAll = r.success ? r.data : MOCK.universities;
  }
  renderUniversities(universitiesAll);
}

function renderUniversities(data) {
  const list = document.getElementById('universities-list'); if (!list) return;
  list.innerHTML = data.length ? data.map(u => universityCard(u)).join('')
    : '<div class="empty-state">Aucune université trouvée</div>';
}

function filterUniversities() {
  const q = (document.getElementById('uni-search')?.value||'').toLowerCase();
  const country = document.getElementById('filter-uni-country')?.value||'';
  const type = document.getElementById('filter-uni-type')?.value||'';
  let data = universitiesAll;
  if (q) data = data.filter(u => u.name.toLowerCase().includes(q)||(u.city||'').toLowerCase().includes(q)||(u.faculties||[]).some(f=>f.toLowerCase().includes(q)));
  if (country) data = data.filter(u => u.country.toLowerCase().includes(country.toLowerCase()));
  if (type) data = data.filter(u => u.type === type);
  renderUniversities(data);
}

function openUniversity(univId) {
  const u = universitiesAll.find(x=>x.id===univId)||MOCK.universities.find(x=>x.id===univId);
  if (!u) return;
  goTo('company');
  const page = document.getElementById('page-company');
  page.querySelector('.company-detail')?.remove();
  const div = document.createElement('div'); div.className='company-detail'; div.style.padding='20px';
  div.innerHTML = `
    <div style="text-align:center;padding:24px;background:linear-gradient(135deg,rgba(74,142,255,.12),rgba(46,212,122,.08));border-radius:16px;margin-bottom:16px;border:1px solid rgba(255,255,255,.06)">
      <div style="font-size:56px;margin-bottom:10px">${u.cover}</div>
      <h2 style="font-size:18px;font-weight:800;color:#E0EEFF;line-height:1.3">${u.name}</h2>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:8px;flex-wrap:wrap">
        <span style="background:rgba(74,142,255,.15);color:#4A8EFF;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600">${u.type}</span>
        <span style="background:rgba(255,255,255,.06);color:#5F7FA0;padding:4px 12px;border-radius:20px;font-size:12px">📍 ${u.city} · ${u.country}</span>
        ${u.verified?'<span style="background:rgba(46,212,122,.15);color:#2ED47A;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700">✓ Vérifiée</span>':''}
      </div>
      <div style="display:flex;gap:20px;justify-content:center;margin-top:14px">
        <div><strong style="display:block;font-size:16px;color:#E0EEFF">${u.founded}</strong><span style="font-size:11px;color:#5F7FA0">Fondée</span></div>
        <div><strong style="display:block;font-size:16px;color:#E0EEFF">${u.students}</strong><span style="font-size:11px;color:#5F7FA0">Étudiants</span></div>
        <div><strong style="display:block;font-size:16px;color:#E0EEFF">${u.faculties.length}</strong><span style="font-size:11px;color:#5F7FA0">Facultés</span></div>
      </div>
    </div>
    <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:16px;margin-bottom:12px">
      <h4 style="font-size:13px;font-weight:800;color:#E0EEFF;margin-bottom:10px">Facultés & Filières</h4>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${u.faculties.map(f=>`<span class="skill-tag">${f}</span>`).join('')}</div>
    </div>
    <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:16px;margin-bottom:16px">
      <h4 style="font-size:13px;font-weight:800;color:#E0EEFF;margin-bottom:8px">Contact & Localisation</h4>
      <div style="font-size:13px;color:#A8C0DC;line-height:1.9">
        📍 ${u.address}<br/>
        ${u.phone?`📞 <a href="tel:${u.phone}" style="color:#4A8EFF;font-weight:600">${u.phone}</a><br/>`:''}
        ${u.email?`✉️ <a href="mailto:${u.email}" style="color:#4A8EFF;font-weight:600">${u.email}</a>`:''}
      </div>
    </div>
    <div style="display:flex;gap:10px">
      ${u.phone?`<button class="btn-primary" onclick="window.open('tel:${u.phone}')" style="flex:1">📞 Appeler</button>`:''}
      ${u.email?`<button class="btn-outline" onclick="window.open('mailto:${u.email}')" style="flex:1">✉️ Email</button>`:''}
      <button class="btn-outline" onclick="showToast('Lien copié !')" style="flex:1">↗ Partager</button>
    </div>`;
  page.appendChild(div);
}

// ─── HUB ENTREPRENEURS ────────────────────────────────────────────
let entrepreneursAll = [];

const STAGE_STYLE = {
  'Idée':     {bg:'#F3F4F6',fg:'#6B7280'},
  'MVP':      {bg:'#FEF3C7',fg:'#92400E'},
  'Lancement':{bg:'#DBEAFE',fg:'#1E40AF'},
  'Seed':     {bg:'#D1FAE5',fg:'#065F46'},
  'Croissance':{bg:'#EDE9FE',fg:'#6D28D9'},
};

function entrepreneurCard(e) {
  const s = STAGE_STYLE[e.stage]||{bg:'#F3F4F6',fg:'#6B7280'};
  return `<div class="ent-card">
    <div class="ec-header">
      <div class="ec-avatar">${e.avatar}</div>
      <div style="flex:1;min-width:0">
        <div class="ec-name">${e.name}</div>
        <div class="ec-startup">🚀 ${e.startup}</div>
      </div>
      <span class="ec-stage" style="background:${s.bg};color:${s.fg}">${e.stage}</span>
    </div>
    <div class="ec-sector">🏷️ ${e.sector} &nbsp;·&nbsp; 📍 ${e.city}</div>
    <p class="ec-pitch">${e.pitch}</p>
    <div class="ec-footer">
      <span class="ec-funding">💰 ${e.funding}</span>
      ${e.seeking?'<span class="ec-seeking">🎯 Cherche investisseur</span>':'<span style="color:#2ED47A;font-size:11px;font-weight:700">✓ Financé</span>'}
    </div>
    <div class="ec-actions">
      <button class="btn-sm btn-primary" onclick="event.stopPropagation();contactEntrepreneur('${e.id}')">✉️ Contacter</button>
      <button class="btn-sm btn-outline" onclick="event.stopPropagation();showToast('Profil partagé !')">↗ Partager</button>
    </div>
  </div>`;
}

async function loadEntrepreneurs() {
  const list = document.getElementById('entrepreneurs-list'); if (!list) return;
  if (entrepreneursAll.length === 0) {
    list.innerHTML = skeletonNewsCards(3);
    const r = await apiFetch('GET', '/entrepreneurs');
    entrepreneursAll = r.success ? r.data : MOCK.entrepreneurs;
  }
  renderEntrepreneurs(entrepreneursAll);
}

function renderEntrepreneurs(data) {
  const list = document.getElementById('entrepreneurs-list'); if (!list) return;
  list.innerHTML = data.length ? data.map(e => entrepreneurCard(e)).join('')
    : '<div class="empty-state">Aucun entrepreneur trouvé</div>';
}

function filterEntrepreneurs() {
  const q = (document.getElementById('ent-search')?.value||'').toLowerCase();
  const sector = document.getElementById('filter-ent-sector')?.value||'';
  const stage = document.getElementById('filter-ent-stage')?.value||'';
  let data = entrepreneursAll;
  if (q) data = data.filter(e => e.name.toLowerCase().includes(q)||e.startup.toLowerCase().includes(q)||e.pitch.toLowerCase().includes(q));
  if (sector) data = data.filter(e => e.sector === sector);
  if (stage) data = data.filter(e => e.stage === stage);
  renderEntrepreneurs(data);
}

function contactEntrepreneur(entId) {
  if (!token) { showToast('Connectez-vous pour contacter', 'error'); return goTo('login'); }
  const e = entrepreneursAll.find(x=>x.id===entId)||MOCK.entrepreneurs.find(x=>x.id===entId);
  showToast(`Message envoyé à ${e?.name||'l\'entrepreneur'} !`, 'success');
}

// ─── FICHE ENTREPRISE ─────────────────────────────────────────────
async function openCompany(id){
  goTo('company');
  let c=companiesAll.find(x=>String(x.id)===String(id));
  if(!c){const r=await apiFetch('GET','/companies/'+id);if(r.success)c=r.data;}
  if(!c)return showToast('Entreprise introuvable','error');
  const page=document.getElementById('page-company');
  page.querySelector('.company-detail')?.remove();
  const div=document.createElement('div');div.className='company-detail';
  div.style.padding='20px';
  div.innerHTML=`
    <div style="text-align:center;padding:24px;background:linear-gradient(135deg,rgba(74,142,255,.12),rgba(46,212,122,.08));border-radius:16px;margin-bottom:16px;border:1px solid rgba(255,255,255,.06)">
      <div style="font-size:56px;margin-bottom:8px">${c.cover||c.init}</div>
      <h2 style="font-size:20px;font-weight:800;color:#E0EEFF">${c.name}</h2>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:8px;flex-wrap:wrap">
        <span style="background:rgba(74,142,255,.15);color:#4A8EFF;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600">${c.sector}</span>
        <span style="background:rgba(255,255,255,.06);color:#5F7FA0;padding:4px 12px;border-radius:20px;font-size:12px">📍 ${c.city}${c.country?' · '+c.country:''}</span>
        ${c.verified?'<span style="background:rgba(46,212,122,.15);color:#2ED47A;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700">✓ Vérifié</span>':''}
      </div>
      ${c.address?`<div style="margin-top:8px;font-size:12px;color:#5F7FA0">🏢 ${c.address}</div>`:''}
    </div>
    ${c.phone||c.email||c.website?`<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:16px;margin-bottom:12px">
      <h4 style="font-size:13px;font-weight:800;color:#E0EEFF;margin-bottom:10px">Contact</h4>
      <div style="display:flex;flex-direction:column;gap:8px;font-size:13px">
        ${c.phone?`<a href="tel:${c.phone}" style="color:#4A8EFF;font-weight:600;text-decoration:none;display:flex;align-items:center;gap:6px">📞 ${c.phone}</a>`:''}
        ${c.email?`<a href="mailto:${c.email}" style="color:#4A8EFF;font-weight:600;text-decoration:none;display:flex;align-items:center;gap:6px">✉️ ${c.email}</a>`:''}
        ${c.website?`<a href="https://${c.website}" target="_blank" style="color:#4A8EFF;font-weight:600;text-decoration:none;display:flex;align-items:center;gap:6px">🌐 ${c.website}</a>`:''}
      </div>
    </div>`:''}
    <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:16px;margin-bottom:12px">
      <h4 style="font-size:13px;font-weight:800;color:#E0EEFF;margin-bottom:8px">Nos Services</h4>
      <p style="font-size:13px;color:#A8C0DC;line-height:1.6">${c.services||'Non renseigné'}</p>
    </div>
    <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:16px;margin-bottom:16px">
      <h4 style="font-size:13px;font-weight:800;color:#E0EEFF;margin-bottom:8px">Notre Vision</h4>
      <p style="font-size:13px;color:#A8C0DC;line-height:1.6">${c.vision||'Non renseigné'}</p>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn-primary" onclick="contactCompany('${c.id}')" style="flex:2">✉️ Contacter</button>
      <button class="btn-outline" onclick="toggleFav(null,'${c.id}')" style="flex:1">♡ Favori</button>
    </div>
    ${currentUser && c.ownerId && String(c.ownerId) === String(currentUser.id) ? `<button class="btn-outline" onclick="showEditCompanyModal('${c.id}')" style="width:100%;margin-top:10px;border-color:rgba(74,142,255,.5);color:#4A8EFF;font-weight:700">✏️ Modifier mon entreprise</button>` : ''}`;
  page.appendChild(div);
}

// ─── MODIFIER / SUPPRIMER ENTREPRISE ─────────────────────────────
async function showEditCompanyModal(id) {
  let c = companiesAll.find(x => String(x.id) === String(id));
  if (!c) {
    const r = await apiFetch('GET', '/companies/' + id);
    if (!r.success) return showToast('Entreprise introuvable', 'error');
    c = r.data;
  }
  let m = document.getElementById('edit-company-modal');
  if (!m) {
    m = document.createElement('div'); m.id = 'edit-company-modal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(8px);z-index:1000;display:flex;align-items:flex-end;justify-content:center';
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });
    document.body.appendChild(m);
  }
  const esc = s => (s||'').replace(/"/g,'&quot;');
  m.innerHTML = `<div style="background:#080F1A;border:1px solid rgba(255,255,255,.08);border-bottom:none;width:100%;max-width:500px;border-radius:20px 20px 0 0;padding:24px;max-height:90vh;overflow-y:auto">
    <h3 style="margin-bottom:16px;font-size:18px;color:#E0EEFF">✏️ Modifier l'entreprise</h3>
    <div style="display:grid;gap:10px;margin-bottom:16px">
      <div><label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">NOM</label>
        <input id="ec-name" value="${esc(c.name)}" style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:10px 14px;font-size:14px;box-sizing:border-box"/></div>
      <div><label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">SECTEUR</label>
        <input id="ec-sector" value="${esc(c.sector)}" style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:10px 14px;font-size:14px;box-sizing:border-box"/></div>
      <div><label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">VILLE</label>
        <input id="ec-city" value="${esc(c.city)}" style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:10px 14px;font-size:14px;box-sizing:border-box"/></div>
      <div><label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">TÉLÉPHONE</label>
        <input id="ec-phone" value="${esc(c.phone)}" style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:10px 14px;font-size:14px;box-sizing:border-box"/></div>
      <div><label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">SERVICES</label>
        <textarea id="ec-services" rows="3" style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:10px 14px;font-size:14px;resize:vertical;box-sizing:border-box">${c.services||''}</textarea></div>
      <div><label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">VISION</label>
        <textarea id="ec-vision" rows="2" style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:10px 14px;font-size:14px;resize:vertical;box-sizing:border-box">${c.vision||''}</textarea></div>
      <div><label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">ADRESSE</label>
        <input id="ec-address" value="${esc(c.address)}" style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:10px 14px;font-size:14px;box-sizing:border-box"/></div>
      <div><label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">SITE WEB</label>
        <input id="ec-website" value="${esc(c.website)}" placeholder="www.example.com" style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:10px 14px;font-size:14px;box-sizing:border-box"/></div>
    </div>
    <div style="display:flex;gap:10px">
      <button onclick="document.getElementById('edit-company-modal').remove()" style="flex:1;padding:12px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(255,255,255,.05);cursor:pointer;color:#A8C0DC">Annuler</button>
      <button onclick="saveCompanyEdit('${c.id}')" style="flex:2;padding:12px;background:linear-gradient(135deg,#4A8EFF,#2D6FFF);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer">Enregistrer</button>
    </div>
    <button onclick="deleteCompany('${c.id}')" style="width:100%;margin-top:10px;padding:11px;border:1px solid #EF4444;border-radius:10px;background:transparent;color:#EF4444;cursor:pointer;font-weight:600;font-size:13px">🗑️ Supprimer l'entreprise</button>
  </div>`;
}

async function saveCompanyEdit(id) {
  const name     = document.getElementById('ec-name')?.value.trim();
  const sector   = document.getElementById('ec-sector')?.value.trim();
  const city     = document.getElementById('ec-city')?.value.trim();
  const phone    = document.getElementById('ec-phone')?.value.trim();
  const services = document.getElementById('ec-services')?.value.trim();
  const vision   = document.getElementById('ec-vision')?.value.trim();
  const address  = document.getElementById('ec-address')?.value.trim();
  const website  = document.getElementById('ec-website')?.value.trim();
  if (!name || !sector) return showToast('Nom et secteur requis', 'error');
  const r = await apiFetch('PATCH', '/companies/' + id, { name, sector, city, phone, services, vision, address, website });
  if (r.success) {
    companiesAll = companiesAll.map(c => String(c.id) === String(id) ? r.data : c);
    showToast('Entreprise mise à jour !', 'success');
    document.getElementById('edit-company-modal')?.remove();
    openCompany(id);
  } else showToast(r.error || 'Erreur', 'error');
}

async function deleteCompany(id) {
  if (!confirm('Supprimer définitivement cette entreprise ?')) return;
  const r = await apiFetch('DELETE', '/companies/' + id);
  if (r.success) {
    companiesAll = companiesAll.filter(c => String(c.id) !== String(id));
    showToast('Entreprise supprimée', 'success');
    document.getElementById('edit-company-modal')?.remove();
    goBack();
  } else showToast(r.error || 'Erreur', 'error');
}

// ─── NEWS ─────────────────────────────────────────────────────────
async function loadNews(){
  const feed=document.getElementById('news-feed');if(!feed)return;
  feed.innerHTML=skeletonNewsCards(3);
  const r=await apiFetch('GET','/news');
  if(!r.success){feed.innerHTML=`<p style="color:red;padding:16px">${r.error}</p>`;return;}
  feed.innerHTML=r.data.map(n=>newsCard(n)).join('');
  const sb=document.getElementById('sidebar-sectors');
  if(sb&&!sb.dataset.loaded){const rs=await apiFetch('GET','/sectors');if(rs.success){sb.innerHTML=rs.data.map(s=>`<div class="sidebar-sector-item" onclick="exploreSector('${s.label}')" style="padding:8px;cursor:pointer;border-radius:8px;font-size:13px;display:flex;align-items:center;gap:6px"><span>${s.icon}</span>${s.label}</div>`).join('');sb.dataset.loaded='1';}}
  const sugg=document.getElementById('suggested-companies');
  if(sugg&&companiesAll.length>0)sugg.innerHTML=companiesAll.slice(0,3).map(c=>`<div onclick="openCompany('${c.id}')" style="display:flex;align-items:center;gap:10px;padding:8px;cursor:pointer;border-radius:8px"><div style="width:36px;height:36px;border-radius:50%;background:#1E66FF22;display:flex;align-items:center;justify-content:center;font-size:18px">${c.cover||c.init}</div><div><div style="font-size:12px;font-weight:700">${c.name}</div><div style="font-size:11px;color:#6B7280">${c.sector}</div></div></div>`).join('');
}

async function toggleLike(newsId){
  const liked=likedNewsIds.includes(newsId);
  const r=await apiFetch('POST',liked?`/news/${newsId}/unlike`:`/news/${newsId}/like`);
  if(r.success){
    if(liked)likedNewsIds=likedNewsIds.filter(x=>x!==newsId);else likedNewsIds.push(newsId);
    localStorage.setItem('makario_liked',JSON.stringify(likedNewsIds));
    const btn=document.getElementById('like-btn-'+newsId);
    const cnt=document.getElementById('likes-count-'+newsId);
    if(btn){btn.innerHTML=(likedNewsIds.includes(newsId)?'♥':'♡')+' <span id="likes-count-'+newsId+'">'+((r.data?.likes)??parseInt(cnt?.textContent||'0')+(liked?-1:1))+'</span>';btn.style.color=likedNewsIds.includes(newsId)?'#1E66FF':'';}
  } else if(r.error==='Non authentifié'){showToast('Connectez-vous pour liker','error');goTo('login');}
}

let _pubImageUrl = null;

function showPublishModal(){
  if(!token){showToast('Connectez-vous pour publier','error');return goTo('login');}
  _pubImageUrl=null;
  let m=document.getElementById('publish-modal');
  if(!m){m=document.createElement('div');m.id='publish-modal';m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(8px);z-index:1000;display:flex;align-items:flex-end;justify-content:center';m.addEventListener('click',e=>{if(e.target===m)m.remove();});document.body.appendChild(m);}
  m.innerHTML=`<div style="background:#080F1A;border:1px solid rgba(255,255,255,.08);border-bottom:none;width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:24px;max-height:90vh;overflow-y:auto">
    <h3 style="margin-bottom:16px;font-size:18px;color:#E0EEFF">Nouvelle publication</h3>
    <input id="pub-title" placeholder="Titre de votre publication…" style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:10px 14px;margin-bottom:10px;font-size:14px;box-sizing:border-box"/>
    <textarea id="pub-body" placeholder="Décrivez votre offre, actualité…" rows="4" style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:10px 14px;font-size:14px;resize:vertical;box-sizing:border-box;margin-bottom:10px"></textarea>
    <div id="pub-img-preview" style="display:none;margin-bottom:10px;border-radius:12px;overflow:hidden;position:relative">
      <img id="pub-img-tag" style="width:100%;max-height:180px;object-fit:cover;display:block"/>
      <button onclick="_pubImageUrl=null;document.getElementById('pub-img-preview').style.display='none'" style="position:absolute;top:6px;right:6px;background:rgba(0,0,0,.7);border:none;color:#fff;border-radius:50%;width:28px;height:28px;cursor:pointer;font-size:14px">✕</button>
    </div>
    <button onclick="_selectPubImage()" style="width:100%;border:1.5px dashed rgba(255,255,255,.15);border-radius:10px;padding:12px;background:rgba(255,255,255,.04);cursor:pointer;color:#5F7FA0;font-size:13px;margin-bottom:14px">📷 Ajouter une image</button>
    <div style="display:flex;gap:10px">
      <button onclick="document.getElementById('publish-modal').remove()" style="flex:1;padding:12px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(255,255,255,.05);cursor:pointer;color:#A8C0DC">Annuler</button>
      <button onclick="submitPost()" style="flex:2;padding:12px;background:linear-gradient(135deg,#4A8EFF,#2D6FFF);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer">📢 Publier</button>
    </div>
  </div>`;
}

function _selectPubImage(){
  const input=document.createElement('input');input.type='file';input.accept='image/*';
  input.onchange=async()=>{
    const file=input.files[0];if(!file)return;
    if(file.size>5*1024*1024)return showToast('Image trop grande (max 5 Mo)','error');
    showToast('Upload en cours…');
    const fd=new FormData();fd.append('file',file);
    const r=await apiUpload(fd);
    if(r.success){
      _pubImageUrl=r.data.url;
      const prev=document.getElementById('pub-img-preview');
      const img=document.getElementById('pub-img-tag');
      if(prev&&img){img.src=_pubImageUrl;prev.style.display='block';}
      showToast('Image ajoutée !','success');
    } else showToast(r.error||'Erreur upload','error');
  };
  input.click();
}

async function submitPost(){
  const title=document.getElementById('pub-title')?.value.trim();
  const body=document.getElementById('pub-body')?.value.trim();
  if(!title||!body)return showToast('Titre et contenu requis','error');
  const r=await apiFetch('POST','/news',{title,body,emoji:'📢',image:_pubImageUrl||undefined});
  if(r.success){showToast('Publication ajoutée !','success');document.getElementById('publish-modal')?.remove();_pubImageUrl=null;loadNews();}
  else showToast(r.error||'Erreur','error');
}

// ─── MESSAGES ─────────────────────────────────────────────────────
async function loadMessages(){
  const list=document.getElementById('conv-list-inner');if(!list)return;
  if(!token){return goTo('login');}
  list.innerHTML=Array.from({length:3},()=>`<div class="conv-item skeleton-card"><div class="sk-avatar"></div><div style="flex:1;display:flex;flex-direction:column;gap:7px"><div class="sk-title"></div><div class="sk-line" style="width:60%"></div></div></div>`).join('');
  const r=await apiFetch('GET','/conversations');
  if(!r.success||r.data.length===0){list.innerHTML=`<div style="padding:20px;text-align:center"><p style="color:#5F7FA0;margin-bottom:12px">Pas encore de conversations</p><button class="btn-outline sm" onclick="goTo('explore')">Trouver des entreprises</button></div>`;return;}
  list.innerHTML=r.data.map(c=>`<div class="conv-item" onclick="openConv('${c.id}','${c.name}','${c.init||c.name?.slice(0,2)||'?'}')">
    <div class="ci-avatar">${c.init||c.name?.slice(0,2)||'?'}</div>
    <div class="ci-body"><div class="ci-top"><strong>${c.name||'Conversation'}</strong><span class="ci-time">${c.time||''}</span></div>
    <div class="ci-preview">${c.preview||'Démarrer la conversation'}</div></div>
    ${c.unread?`<div class="ci-badge">${c.unread}</div>`:''}
  </div>`).join('');
}

async function openConv(convId,name,initials){
  if(socket){if(currentConvId)socket.emit('leave_conv',currentConvId);socket.emit('join_conv',convId);}
  currentConvId=convId;
  const win=document.getElementById('chat-window');if(!win)return;
  win.innerHTML=`
    <div class="chat-header" style="display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.08)">
      <button onclick="currentConvId=null" style="background:none;border:none;cursor:pointer;color:#A8C0DC;font-size:18px">←</button>
      <div style="width:36px;height:36px;border-radius:50%;background:#4A8EFF;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800">${initials}</div>
      <strong style="font-size:14px;color:#E0EEFF">${name}</strong>
    </div>
    <div class="chat-messages" id="chat-messages" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px"><div style="text-align:center;color:#5F7FA0">Chargement…</div></div>
    <div class="chat-input-bar" style="display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.08)">
      <input id="chat-input" placeholder="Écrire un message…" onkeydown="if(event.key==='Enter')sendMessage()" style="flex:1;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:24px;padding:10px 16px;font-size:14px"/>
      <button onclick="sendMessage()" style="width:40px;height:40px;border-radius:50%;background:#4A8EFF;border:none;cursor:pointer;color:#fff;font-size:18px">➤</button>
    </div>`;
  const r=await apiFetch('GET',`/conversations/${convId}/messages`);
  const msgs=document.getElementById('chat-messages');if(!msgs)return;
  msgs.innerHTML=r.success&&r.data.length>0?r.data.map(m=>`<div style="align-self:${m.sent?'flex-end':'flex-start'};max-width:75%">
    <div style="background:${m.sent?'#4A8EFF':'rgba(255,255,255,.07)'};color:#fff;padding:10px 14px;border-radius:${m.sent?'18px 18px 4px 18px':'18px 18px 18px 4px'};font-size:14px">${m.text}</div>
    <div style="font-size:10px;color:#5F7FA0;margin-top:3px;text-align:${m.sent?'right':'left'}">${formatTime(m.date)}</div>
  </div>`).join(''):'<div style="text-align:center;color:#5F7FA0;padding:20px">Démarrez la conversation !</div>';
  msgs.scrollTop=msgs.scrollHeight;
}

async function sendMessage(){
  const input=document.getElementById('chat-input');if(!input||!currentConvId)return;
  const text=input.value.trim();if(!text)return;input.value='';
  const r=await apiFetch('POST',`/conversations/${currentConvId}/messages`,{text});
  if(r.success){const msgs=document.getElementById('chat-messages');if(msgs){const b=document.createElement('div');b.style.cssText='align-self:flex-end;max-width:75%';b.innerHTML=`<div style="background:#4A8EFF;color:#fff;padding:10px 14px;border-radius:18px 18px 4px 18px;font-size:14px">${text}</div><div style="font-size:10px;color:#5F7FA0;margin-top:3px;text-align:right">À l'instant</div>`;msgs.appendChild(b);msgs.scrollTop=msgs.scrollHeight;}}
  else showToast(r.error||'Erreur','error');
}

async function contactCompany(companyId){
  if(!token){showToast('Connectez-vous pour contacter','error');return goTo('login');}
  const c=companiesAll.find(x=>String(x.id)===String(companyId));
  const r=await apiFetch('POST','/conversations',{recipientId:c?.ownerId||99,companyId});
  if(r.success){goTo('messages');setTimeout(()=>openConv(r.data.id,c?.name||'Entreprise',c?.init||'?'),300);}
  else showToast(r.error||'Erreur','error');
}

// ─── FAVORIS ──────────────────────────────────────────────────────
async function loadFavorites(){
  const list=document.getElementById('favorites-list');const empty=document.getElementById('favorites-empty');if(!list)return;
  if(!token){list.innerHTML='';if(empty){empty.classList.remove('hidden');empty.querySelector('p').textContent='Connectez-vous pour voir vos favoris';}return;}
  const r=await apiFetch('GET','/favorites');
  if(r.success&&r.data.length>0){list.innerHTML=r.data.map(c=>companyCard(c)).join('');if(empty)empty.classList.add('hidden');}
  else{list.innerHTML='';if(empty)empty.classList.remove('hidden');}
}

async function toggleFav(event,companyId){
  if(event)event.stopPropagation();
  if(!token){showToast('Connectez-vous pour sauvegarder','error');return goTo('login');}
  const r=await apiFetch('POST','/favorites/'+companyId);
  if(r.success){showToast('Ajouté aux favoris ♡','success');const btn=document.querySelector(`.fav-btn[data-company-id="${companyId}"]`);if(btn){btn.style.color='#EF4444';btn.textContent='♥';}}
  else if(r.error==='Déjà en favoris'){const r2=await apiFetch('DELETE','/favorites/'+companyId);if(r2.success){showToast('Retiré des favoris');const btn=document.querySelector(`.fav-btn[data-company-id="${companyId}"]`);if(btn){btn.style.color='';btn.textContent='♡';}if(document.getElementById('page-favorites')?.classList.contains('active'))loadFavorites();}}
  else showToast(r.error||'Erreur','error');
}

// ─── PROFIL ───────────────────────────────────────────────────────
async function loadProfile(){
  if(!token){showToast('Connectez-vous pour accéder à votre profil','error');return goTo('login');}
  const r=await apiFetch('GET','/auth/me');if(!r.success)return;
  currentUser=r.data;
  // Nom + rôle
  const nameEl=document.querySelector('.profile-name');
  const roleEl=document.querySelector('.profile-role');
  if(nameEl)nameEl.textContent=currentUser.name||'Mon profil';
  if(roleEl)roleEl.textContent=(currentUser.profession||'Professionnel')+(currentUser.city?' · '+currentUser.city:'');
  // Avatar
  setNavAvatar((currentUser.name?.slice(0,1)||'U').toUpperCase());
  const avatarImg=document.getElementById('profile-avatar-img');
  if(avatarImg)avatarImg.src='https://ui-avatars.com/api/?name='+encodeURIComponent(currentUser.name||'U')+'&background=1E66FF&color=fff&size=100';
  // Lignes d'infos
  document.querySelectorAll('#page-profile .info-row').forEach(row=>{
    const lbl=(row.querySelector('label')?.textContent||'').toLowerCase();
    const val=row.querySelector('span');if(!val)return;
    if(lbl==='nom')val.textContent=currentUser.name?.split(' ').slice(1).join(' ')||currentUser.name||'—';
    if(lbl==='prénom')val.textContent=currentUser.name?.split(' ')[0]||'—';
    if(lbl==='email')val.textContent=currentUser.email||'—';
    if(lbl==='profession')val.textContent=currentUser.profession||'—';
    if(lbl==='ville')val.textContent=currentUser.city||'—';
  });
  // Bouton déconnexion
  if(!document.getElementById('logout-btn')){
    const btn=document.createElement('button');btn.id='logout-btn';btn.className='btn-outline mt';
    btn.style.cssText='margin-top:12px;width:100%;color:#EF4444;border-color:#EF4444';
    btn.textContent='🔓 Déconnexion';btn.onclick=logout;
    const card=document.querySelector('#page-profile .profile-card');if(card)card.appendChild(btn);
  }
}

function logout(){
  if(socket){socket.disconnect();socket=null;}
  token=null;currentUser=null;
  localStorage.removeItem('makario_token');localStorage.removeItem('makario_user');
  showToast('Déconnecté');setNavAvatar('M');document.getElementById('logout-btn')?.remove();goTo('home');
}

function triggerAvatarUpload(){
  if(!token){showToast('Connectez-vous d\'abord','error');return;}
  const input=document.createElement('input');
  input.type='file';input.accept='image/*';
  input.onchange=async()=>{
    const file=input.files[0];if(!file)return;
    if(file.size>5*1024*1024)return showToast('Image trop grande (max 5 Mo)','error');
    showToast('Upload en cours…');
    const fd=new FormData();fd.append('file',file);
    const r=await apiUpload(fd);
    if(r.success){
      const avatarImg=document.getElementById('profile-avatar-img');
      if(avatarImg)avatarImg.src=r.data.url;
      await apiFetch('PUT','/auth/profile',{avatar:r.data.demo?null:r.data.url});
      showToast('Photo de profil mise à jour !','success');
    } else showToast(r.error||'Erreur upload','error');
  };
  input.click();
}

function showEditProfileModal(){
  if(!token){showToast('Connectez-vous','error');return goTo('login');}
  let m=document.getElementById('edit-profile-modal');
  if(!m){m=document.createElement('div');m.id='edit-profile-modal';m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;display:flex;align-items:flex-end;justify-content:center';m.addEventListener('click',e=>{if(e.target===m)m.remove();});document.body.appendChild(m);}
  const u=currentUser||{};
  const parts=(u.name||'').split(' ');
  const fn=parts[0]||'';const ln=parts.slice(1).join(' ')||'';
  m.innerHTML=`<div style="background:#080F1A;border:1px solid rgba(255,255,255,.08);border-bottom:none;width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:24px">
    <h3 style="margin-bottom:16px;font-size:18px;color:#E0EEFF">Modifier le profil</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
      <div><label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">PRÉNOM</label><input id="ep-firstname" value="${fn}" style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:10px 14px;font-size:14px;box-sizing:border-box"/></div>
      <div><label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">NOM</label><input id="ep-lastname" value="${ln}" style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:10px 14px;font-size:14px;box-sizing:border-box"/></div>
    </div>
    <div style="margin-bottom:10px"><label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">PROFESSION</label><input id="ep-profession" value="${u.profession||''}" placeholder="Chef d'entreprise, Développeur…" style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:10px 14px;font-size:14px;box-sizing:border-box"/></div>
    <div style="margin-bottom:16px"><label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">VILLE</label>
      <select id="ep-city" style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:#0B1525;color:#A8C0DC;border-radius:10px;padding:10px 14px;font-size:14px;box-sizing:border-box">
        <option value="">Sélectionner</option>
        <option${u.city==='Brazzaville'?' selected':''}>Brazzaville</option>
        <option${u.city==='Pointe-Noire'?' selected':''}>Pointe-Noire</option>
        <option${u.city==='Dolisie'?' selected':''}>Dolisie</option>
        <option${u.city==='Ouesso'?' selected':''}>Ouesso</option>
        <option${u.city==='Paris'?' selected':''}>Paris</option>
        <option${u.city==='Montréal'?' selected':''}>Montréal</option>
      </select>
    </div>
    <div style="display:flex;gap:10px">
      <button onclick="document.getElementById('edit-profile-modal').remove()" style="flex:1;padding:12px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(255,255,255,.05);cursor:pointer;color:#A8C0DC">Annuler</button>
      <button onclick="saveProfile()" style="flex:2;padding:12px;background:linear-gradient(135deg,#4A8EFF,#2D6FFF);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer">Enregistrer</button>
    </div>
  </div>`;
}

async function saveProfile(){
  const fn=document.getElementById('ep-firstname')?.value.trim();
  const ln=document.getElementById('ep-lastname')?.value.trim();
  const name=[fn,ln].filter(Boolean).join(' ');
  const profession=document.getElementById('ep-profession')?.value.trim();
  const city=document.getElementById('ep-city')?.value;
  if(!name)return showToast('Le nom est requis','error');
  const r=await apiFetch('PUT','/auth/profile',{name,profession,city});
  if(r.success){
    currentUser=r.data;localStorage.setItem('makario_user',JSON.stringify(currentUser));
    showToast('Profil mis à jour !','success');
    document.getElementById('edit-profile-modal')?.remove();
    loadProfile();
  } else showToast(r.error||'Erreur','error');
}

// ─── DASHBOARD ────────────────────────────────────────────────────
async function loadDashboard(){
  if(!token){showToast('Connectez-vous','error');return goTo('login');}
  const rs=await apiFetch('GET','/stats');
  if(rs.success){
    const s=rs.data;
    const vals=[s.totalCompanies,s.totalUsers,s.totalNews,s.totalSectors];
    document.querySelectorAll('#page-dashboard .dash-stat').forEach((el,i)=>{
      const strong=el.querySelector('strong');
      if(strong&&vals[i]!==undefined) animateCounter(strong,vals[i]);
    });
  }
  const rNews=await apiFetch('GET','/news');
  const pubFeed=document.getElementById('pub-grid');
  if(pubFeed&&rNews.success)pubFeed.innerHTML=rNews.data.slice(0,5).map(n=>`<div style="padding:12px;border:1.5px solid rgba(255,255,255,.08);border-radius:12px;margin-bottom:8px;background:rgba(255,255,255,.03)"><div style="font-weight:700;font-size:13px;color:#E0EEFF;margin-bottom:4px">${n.title}</div><div style="font-size:11px;color:#5F7FA0">${formatTime(n.date)} · ♥ ${n.likes} · ${(n.comments||[]).length} commentaires</div></div>`).join('')||'<p style="color:#5F7FA0;padding:10px 0">Aucune publication</p>';
}

// ─── AUTH ─────────────────────────────────────────────────────────
let authStep=1,authTab='personal';
function switchAuthTab(tab){authTab=tab;}
function nextStep(){const s=document.querySelectorAll('#page-register .form-step');if(authStep<s.length){s[authStep-1].classList.remove('active');authStep++;s[authStep-1].classList.add('active');_updateStepDots();}}
function prevStep(){const s=document.querySelectorAll('#page-register .form-step');if(authStep>1){s[authStep-1].classList.remove('active');authStep--;s[authStep-1].classList.add('active');_updateStepDots();}}
function _updateStepDots(){document.querySelectorAll('#page-register .step').forEach((el,i)=>{el.classList.toggle('active',i<authStep);});}

async function completeRegister(){
  const firstname=(document.getElementById('reg-firstname')?.value||'').trim();
  const lastname=(document.getElementById('reg-lastname')?.value||'').trim();
  const name=[firstname,lastname].filter(Boolean).join(' ');
  const email=document.getElementById('reg-email')?.value?.trim();
  const password=document.getElementById('reg-password')?.value;
  if(!name||!email||!password)return showToast('Tous les champs sont requis','error');
  if(password.length<6)return showToast('Mot de passe : 6 caractères min','error');
  const confirm=document.getElementById('reg-confirm')?.value;
  if(confirm&&confirm!==password)return showToast('Les mots de passe ne correspondent pas','error');
  const body={name,email,password};
  if(authTab==='company')body.company={name:document.getElementById('comp-name')?.value?.trim(),sector:document.getElementById('comp-sector')?.value,city:document.getElementById('comp-city')?.value,services:document.getElementById('comp-services')?.value?.trim()};
  const r=await apiFetch('POST','/auth/register',body);
  if(r.success){token=r.data.token;currentUser=r.data.user;localStorage.setItem('makario_token',token);localStorage.setItem('makario_user',JSON.stringify(currentUser));showToast(`Bienvenue, ${currentUser.name} ! 🎉`,'success');authStep=1;connectSocket();goTo('home');setNavAvatar((currentUser.name?.slice(0,1)||'U').toUpperCase());}
  else showToast(r.error||'Erreur inscription','error');
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.querySelector('svg').innerHTML = isHidden
    ? '<line x1="1" y1="1" x2="23" y2="23"/><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>'
    : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
}

async function completeLogin(){
  const email=document.getElementById('login-email')?.value?.trim();
  const password=document.getElementById('login-password')?.value;
  if(!email||!password)return showToast('Email et mot de passe requis','error');
  const r=await apiFetch('POST','/auth/login',{email,password});
  if(r.success){token=r.data.token;currentUser=r.data.user;localStorage.setItem('makario_token',token);localStorage.setItem('makario_user',JSON.stringify(currentUser));showToast(`Bon retour, ${currentUser.name} ! 👋`,'success');connectSocket();goTo('home');setNavAvatar((currentUser.name?.slice(0,1)||'U').toUpperCase());}
  else showToast(r.error||'Email ou mot de passe incorrect','error');
}

// ─── SYSTÈME DE PAIEMENT COMPLET ──────────────────────────────────

function showPayModal(plan, price) {
  if (!token) { showToast('Connectez-vous pour vous abonner', 'error'); return goTo('login'); }
  let m = document.getElementById('pay-modal');
  if (!m) {
    m = document.createElement('div'); m.id = 'pay-modal';
    m.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:2000;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(10px)';
    document.body.appendChild(m);
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });
  }
  m.innerHTML = `
  <div style="background:#080F1A;border:1px solid rgba(255,255,255,.08);border-bottom:none;width:100%;max-width:500px;border-radius:24px 24px 0 0;padding:0;overflow:hidden;max-height:92vh;overflow-y:auto">
    <!-- En-tête -->
    <div style="background:linear-gradient(135deg,#4A8EFF,#2ED47A);padding:24px 24px 20px;color:#fff">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:12px;opacity:.8;font-weight:600;letter-spacing:.5px;text-transform:uppercase">Abonnement</div>
          <div style="font-size:24px;font-weight:800;margin-top:2px">${plan}</div>
        </div>
        <button onclick="document.getElementById('pay-modal').remove()" style="background:rgba(255,255,255,.2);border:none;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">✕</button>
      </div>
      <div style="margin-top:12px;background:rgba(255,255,255,.15);border-radius:12px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:13px;opacity:.9">Montant total</span>
        <span style="font-size:20px;font-weight:800">${price} FCFA</span>
      </div>
    </div>

    <div style="padding:20px 20px 32px">
      <!-- Sécurité -->
      <div style="display:flex;align-items:center;gap:6px;color:#5F7FA0;font-size:11px;margin-bottom:20px;justify-content:center">
        🔒 <span>Paiement 100% sécurisé · SSL 256 bits · Données cryptées</span>
      </div>

      <div style="font-size:13px;font-weight:700;color:#E0EEFF;margin-bottom:12px;text-transform:uppercase;letter-spacing:.5px">Choisissez votre mode de paiement</div>

      <!-- ══ CARTES BANCAIRES ══ -->
      <div style="margin-bottom:8px">
        <button onclick="togglePaySection('card-section')" style="width:100%;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;text-align:left;font-weight:700;color:#E0EEFF;font-size:14px">
          <div style="display:flex;gap:4px;align-items:center">
            <div style="background:#1A1F71;color:#fff;font-size:9px;font-weight:900;padding:3px 6px;border-radius:4px;letter-spacing:.5px">VISA</div>
            <div style="background:#EB001B;color:#fff;font-size:9px;font-weight:900;padding:3px 6px;border-radius:4px;position:relative">
              <span style="position:absolute;left:-4px;top:0;width:12px;height:100%;background:#FF5F00;border-radius:2px"></span>
              <span style="position:relative">MC</span>
            </div>
            <div style="background:#2E77BC;color:#fff;font-size:9px;font-weight:800;padding:3px 5px;border-radius:4px">AMEX</div>
          </div>
          <span style="flex:1">Carte bancaire</span>
          <span style="font-size:18px;transition:transform .2s" id="chevron-card">▾</span>
        </button>
        <div id="card-section" style="display:none;background:rgba(255,255,255,.04);border:1.5px solid rgba(74,142,255,.25);border-top:none;border-radius:0 0 14px 14px;padding:16px">
          <div style="display:grid;gap:10px">
            <div>
              <label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">NUMÉRO DE CARTE</label>
              <input id="card-num" type="text" placeholder="1234 5678 9012 3456" maxlength="19"
                oninput="this.value=this.value.replace(/[^0-9]/g,'').replace(/(.{4})/g,'$1 ').trim()"
                style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:11px 14px;font-size:15px;box-sizing:border-box;letter-spacing:1px;font-family:monospace"/>
            </div>
            <div>
              <label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">NOM SUR LA CARTE</label>
              <input id="card-name" type="text" placeholder="FELIX NGOMA" style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:11px 14px;font-size:14px;box-sizing:border-box;text-transform:uppercase"/>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div>
                <label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">EXPIRATION</label>
                <input id="card-exp" type="text" placeholder="MM/AA" maxlength="5"
                  oninput="let v=this.value.replace(/\D/g,'');if(v.length>=2)v=v.slice(0,2)+'/'+v.slice(2);this.value=v"
                  style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:11px 14px;font-size:14px;box-sizing:border-box;font-family:monospace"/>
              </div>
              <div>
                <label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">CVV</label>
                <input id="card-cvv" type="password" placeholder="•••" maxlength="4" style="width:100%;border:1.5px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:11px 14px;font-size:14px;box-sizing:border-box;font-family:monospace"/>
              </div>
            </div>
            <button onclick="processCardPayment('${plan}','${price}')" style="width:100%;background:linear-gradient(135deg,#1E66FF,#1555CC);color:#fff;border:none;border-radius:12px;padding:14px;font-size:15px;font-weight:700;cursor:pointer;margin-top:4px">
              💳 Payer ${price} FCFA
            </button>
          </div>
        </div>
      </div>

      <!-- ══ PAYPAL ══ -->
      <div style="margin-bottom:8px">
        <button onclick="processPayPal('${plan}','${price}')" style="width:100%;background:#FFC439;border:1.5px solid #F0B930;border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;font-weight:800;color:#003087;font-size:15px">
          <span style="font-size:20px">🅿️</span>
          <span style="font-family:system-ui;letter-spacing:-.3px"><span style="color:#009cde">Pay</span><span style="color:#003087">Pal</span></span>
          <span style="flex:1;text-align:right;font-size:12px;font-weight:600;color:#003087;opacity:.7">Payer en un clic</span>
        </button>
      </div>

      <!-- ══ GOOGLE PAY / APPLE PAY ══ -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
        <button onclick="processGooglePay('${plan}','${price}')" style="background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.12);border-radius:14px;padding:13px;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;font-weight:700;font-size:13px;color:#E0EEFF">
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Google Pay
        </button>
        <button onclick="processApplePay('${plan}','${price}')" style="background:#000;border:1.5px solid #000;border-radius:14px;padding:13px;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;font-weight:700;font-size:13px;color:#fff">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04l-.05.17zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          Apple Pay
        </button>
      </div>

      <!-- ══ SÉPARATEUR ══ -->
      <div style="display:flex;align-items:center;gap:10px;margin:16px 0">
        <div style="flex:1;height:1px;background:rgba(255,255,255,.08)"></div>
        <span style="font-size:11px;color:#5F7FA0;font-weight:600">MOBILE MONEY AFRIQUE</span>
        <div style="flex:1;height:1px;background:rgba(255,255,255,.08)"></div>
      </div>

      <!-- ══ MTN MOBILE MONEY ══ -->
      <div style="margin-bottom:8px">
        <button onclick="togglePaySection('mtn-section')" style="width:100%;background:rgba(255,204,0,.08);border:1.5px solid rgba(255,213,79,.4);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;text-align:left;font-weight:700;color:#E0EEFF;font-size:14px">
          <div style="width:32px;height:32px;background:#FFCC00;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:11px;color:#0D1931">MTN</div>
          <span style="flex:1">MTN Mobile Money</span>
          <span style="font-size:11px;color:#5F7FA0">CG · CD · CM · CI · GH…</span>
          <span id="chevron-mtn" style="font-size:18px">▾</span>
        </button>
        <div id="mtn-section" style="display:none;background:rgba(255,204,0,.05);border:1.5px solid rgba(255,213,79,.3);border-top:none;border-radius:0 0 14px 14px;padding:16px">
          <label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">NUMÉRO MTN MOBILE MONEY</label>
          <div style="display:flex;gap:8px">
            <div style="background:rgba(255,255,255,.08);border-radius:10px;padding:11px 12px;font-size:13px;font-weight:700;white-space:nowrap;color:#A8C0DC">🇨🇬 +242</div>
            <input id="mtn-num" type="tel" placeholder="06 XXX XX XX" style="flex:1;border:1.5px solid rgba(255,213,79,.4);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:11px 14px;font-size:15px;font-family:monospace;box-sizing:border-box"/>
          </div>
          <button onclick="processMobileMoney('MTN','${plan}','${price}')" style="width:100%;background:#FFCC00;color:#0D1931;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:800;cursor:pointer;margin-top:10px">
            📱 Payer via MTN MoMo
          </button>
        </div>
      </div>

      <!-- ══ AIRTEL MONEY ══ -->
      <div style="margin-bottom:8px">
        <button onclick="togglePaySection('airtel-section')" style="width:100%;background:rgba(255,0,0,.08);border:1.5px solid rgba(255,138,128,.4);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;text-align:left;font-weight:700;color:#E0EEFF;font-size:14px">
          <div style="width:32px;height:32px;background:#FF0000;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:10px;color:#fff">AIR</div>
          <span style="flex:1">Airtel Money</span>
          <span style="font-size:11px;color:#5F7FA0">CG · CD · RW · ZM…</span>
          <span id="chevron-airtel" style="font-size:18px">▾</span>
        </button>
        <div id="airtel-section" style="display:none;background:rgba(255,0,0,.05);border:1.5px solid rgba(255,138,128,.3);border-top:none;border-radius:0 0 14px 14px;padding:16px">
          <label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">NUMÉRO AIRTEL MONEY</label>
          <div style="display:flex;gap:8px">
            <div style="background:rgba(255,255,255,.08);border-radius:10px;padding:11px 12px;font-size:13px;font-weight:700;white-space:nowrap;color:#A8C0DC">🇨🇬 +242</div>
            <input id="airtel-num" type="tel" placeholder="05 XXX XX XX" style="flex:1;border:1.5px solid rgba(255,138,128,.4);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:11px 14px;font-size:15px;font-family:monospace;box-sizing:border-box"/>
          </div>
          <button onclick="processMobileMoney('Airtel','${plan}','${price}')" style="width:100%;background:#FF0000;color:#fff;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:800;cursor:pointer;margin-top:10px">
            📲 Payer via Airtel Money
          </button>
        </div>
      </div>

      <!-- ══ ORANGE MONEY ══ -->
      <div style="margin-bottom:8px">
        <button onclick="togglePaySection('orange-section')" style="width:100%;background:rgba(255,102,0,.08);border:1.5px solid rgba(255,171,64,.4);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;text-align:left;font-weight:700;color:#E0EEFF;font-size:14px">
          <div style="width:32px;height:32px;background:#FF6600;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#fff">◉</div>
          <span style="flex:1">Orange Money</span>
          <span style="font-size:11px;color:#5F7FA0">SN · CI · CM · ML…</span>
          <span id="chevron-orange" style="font-size:18px">▾</span>
        </button>
        <div id="orange-section" style="display:none;background:rgba(255,102,0,.05);border:1.5px solid rgba(255,171,64,.3);border-top:none;border-radius:0 0 14px 14px;padding:16px">
          <label style="font-size:11px;font-weight:700;color:#5F7FA0;display:block;margin-bottom:5px">NUMÉRO ORANGE MONEY</label>
          <div style="display:flex;gap:8px">
            <select id="orange-country" style="background:#0B1525;border:1px solid rgba(255,255,255,.1);color:#A8C0DC;border-radius:10px;padding:11px 10px;font-size:12px;font-weight:700">
              <option value="+221">🇸🇳 +221</option>
              <option value="+225">🇨🇮 +225</option>
              <option value="+237">🇨🇲 +237</option>
              <option value="+223">🇲🇱 +223</option>
              <option value="+224">🇬🇳 +224</option>
            </select>
            <input id="orange-num" type="tel" placeholder="7X XXX XX XX" style="flex:1;border:1.5px solid rgba(255,171,64,.4);background:rgba(255,255,255,.05);color:#E0EEFF;border-radius:10px;padding:11px 14px;font-size:15px;font-family:monospace;box-sizing:border-box"/>
          </div>
          <button onclick="processMobileMoney('Orange','${plan}','${price}')" style="width:100%;background:#FF6600;color:#fff;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:800;cursor:pointer;margin-top:10px">
            🟠 Payer via Orange Money
          </button>
        </div>
      </div>

      <!-- ══ WAVE ══ -->
      <div style="margin-bottom:8px">
        <button onclick="processMobileMoney('Wave','${plan}','${price}')" style="width:100%;background:rgba(0,180,255,.08);border:1.5px solid rgba(41,182,246,.4);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;font-weight:700;color:#E0EEFF;font-size:14px">
          <div style="width:32px;height:32px;background:#00B4FF;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#fff">〜</div>
          <span style="flex:1">Wave</span>
          <span style="font-size:11px;color:#5F7FA0">SN · CI · BF · ML · UG…</span>
        </button>
      </div>

      <!-- ══ SÉPARATEUR ══ -->
      <div style="display:flex;align-items:center;gap:10px;margin:16px 0">
        <div style="flex:1;height:1px;background:rgba(255,255,255,.08)"></div>
        <span style="font-size:11px;color:#5F7FA0;font-weight:600">AUTRES</span>
        <div style="flex:1;height:1px;background:rgba(255,255,255,.08)"></div>
      </div>

      <!-- ══ VIREMENT BANCAIRE ══ -->
      <div style="margin-bottom:8px">
        <button onclick="togglePaySection('wire-section')" style="width:100%;background:rgba(165,180,252,.08);border:1.5px solid rgba(165,180,252,.3);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;text-align:left;font-weight:700;color:#E0EEFF;font-size:14px">
          <span style="font-size:22px">🏦</span>
          <span style="flex:1">Virement bancaire</span>
          <span id="chevron-wire" style="font-size:18px">▾</span>
        </button>
        <div id="wire-section" style="display:none;background:rgba(165,180,252,.05);border:1.5px solid rgba(165,180,252,.2);border-top:none;border-radius:0 0 14px 14px;padding:16px">
          <div style="background:rgba(255,255,255,.05);border-radius:10px;padding:14px;font-size:13px;line-height:1.8;color:#A8C0DC">
            <div><strong style="color:#E0EEFF">Banque :</strong> BGFI Bank Congo</div>
            <div><strong style="color:#E0EEFF">IBAN :</strong> CG 86 0001 0000 1234 5678 9012 345</div>
            <div><strong style="color:#E0EEFF">BIC :</strong> BGFICGCG</div>
            <div><strong style="color:#E0EEFF">Bénéficiaire :</strong> MAKARIO SAS</div>
            <div style="margin-top:8px;font-weight:700;color:#4A8EFF"><strong>Référence :</strong> MAK-${plan.toUpperCase()}-${Date.now().toString().slice(-6)}</div>
          </div>
          <div style="font-size:11px;color:#5F7FA0;margin-top:10px;line-height:1.6">⚠️ Votre abonnement sera activé sous 24–48h après réception du virement. Envoyez votre preuve de paiement à <strong style="color:#A8C0DC">paiements@makario.cg</strong></div>
          <button onclick="copyWireRef()" style="width:100%;background:#4A8EFF;color:#fff;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;margin-top:10px">
            📋 Copier la référence
          </button>
        </div>
      </div>

      <!-- ══ CRYPTO ══ -->
      <div style="margin-bottom:8px">
        <button onclick="togglePaySection('crypto-section')" style="width:100%;background:rgba(129,140,248,.08);border:1.5px solid rgba(221,214,254,.3);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;text-align:left;font-weight:700;color:#E0EEFF;font-size:14px">
          <span style="font-size:22px">₿</span>
          <span style="flex:1">Crypto-monnaies</span>
          <span style="font-size:11px;color:#5F7FA0">BTC · ETH · USDT</span>
          <span id="chevron-crypto" style="font-size:18px">▾</span>
        </button>
        <div id="crypto-section" style="display:none;background:rgba(129,140,248,.05);border:1.5px solid rgba(221,214,254,.2);border-top:none;border-radius:0 0 14px 14px;padding:16px">
          <div style="display:grid;gap:8px">
            <button onclick="processCrypto('Bitcoin','${plan}')" style="background:rgba(255,193,7,.08);border:1.5px solid rgba(255,193,7,.3);border-radius:10px;padding:12px;display:flex;align-items:center;gap:10px;cursor:pointer;font-weight:700;color:#E0EEFF">
              <span style="font-size:22px">₿</span><div style="text-align:left"><div style="font-size:13px">Bitcoin (BTC)</div><div style="font-size:11px;color:#5F7FA0;font-weight:400">≈ ${(parseInt(price.replace(/\s/g,''))/900000).toFixed(5)} BTC</div></div>
            </button>
            <button onclick="processCrypto('Ethereum','${plan}')" style="background:rgba(129,140,248,.08);border:1.5px solid rgba(156,159,228,.3);border-radius:10px;padding:12px;display:flex;align-items:center;gap:10px;cursor:pointer;font-weight:700;color:#E0EEFF">
              <span style="font-size:22px">Ξ</span><div style="text-align:left"><div style="font-size:13px">Ethereum (ETH)</div><div style="font-size:11px;color:#5F7FA0;font-weight:400">≈ ${(parseInt(price.replace(/\s/g,''))/1500000).toFixed(4)} ETH</div></div>
            </button>
            <button onclick="processCrypto('USDT','${plan}')" style="background:rgba(38,161,123,.08);border:1.5px solid rgba(38,161,123,.3);border-radius:10px;padding:12px;display:flex;align-items:center;gap:10px;cursor:pointer;font-weight:700;color:#E0EEFF">
              <span style="font-size:22px">₮</span><div style="text-align:left"><div style="font-size:13px">Tether (USDT)</div><div style="font-size:11px;color:#5F7FA0;font-weight:400">≈ ${(parseInt(price.replace(/\s/g,''))/600).toFixed(2)} USDT</div></div>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>`;
}

function togglePaySection(id) {
  const all = ['card-section','mtn-section','airtel-section','orange-section','wire-section','crypto-section'];
  all.forEach(sid => {
    const el = document.getElementById(sid);
    const chevId = 'chevron-' + sid.replace('-section','');
    const chev = document.getElementById(chevId);
    if (sid === id) {
      const isOpen = el && el.style.display !== 'none';
      if (el) el.style.display = isOpen ? 'none' : 'block';
      if (chev) chev.style.transform = isOpen ? '' : 'rotate(180deg)';
    } else {
      if (el) el.style.display = 'none';
      if (chev) chev.style.transform = '';
    }
  });
}

function processCardPayment(plan, price) {
  const num = document.getElementById('card-num')?.value.replace(/\s/g,'');
  const name = document.getElementById('card-name')?.value.trim();
  const exp = document.getElementById('card-exp')?.value.trim();
  const cvv = document.getElementById('card-cvv')?.value.trim();
  if (!num || num.length < 15) return showToast('Numéro de carte invalide', 'error');
  if (!name) return showToast('Nom sur la carte requis', 'error');
  if (!exp || exp.length < 4) return showToast('Date d\'expiration invalide', 'error');
  if (!cvv || cvv.length < 3) return showToast('CVV invalide', 'error');
  showPaymentProcessing(plan, price, '💳 Carte bancaire');
}

function processPayPal(plan, price) {
  showPaymentProcessing(plan, price, '🅿️ PayPal');
}

function processGooglePay(plan, price) {
  showPaymentProcessing(plan, price, '📱 Google Pay');
}

function processApplePay(plan, price) {
  showPaymentProcessing(plan, price, '🍎 Apple Pay');
}

function processMobileMoney(provider, plan, price) {
  let num = '';
  if (provider === 'MTN') num = document.getElementById('mtn-num')?.value.trim();
  else if (provider === 'Airtel') num = document.getElementById('airtel-num')?.value.trim();
  else if (provider === 'Orange') num = document.getElementById('orange-num')?.value.trim();
  if (['MTN','Airtel','Orange'].includes(provider) && !num) {
    return showToast('Entrez votre numéro ' + provider, 'error');
  }
  showPaymentProcessing(plan, price, '📱 ' + provider + (num ? ' · ' + num : ''));
}

function processCrypto(coin, plan) {
  showPaymentProcessing(plan, '—', '₿ ' + coin);
}

function copyWireRef() {
  const refEl = document.querySelector('#wire-section [style*="color:#1E66FF"] strong');
  const refText = refEl?.textContent || ('MAK-REF-' + Date.now().toString().slice(-6));
  navigator.clipboard?.writeText(refText).catch(()=>{});
  showToast('Référence copiée !', 'success');
}

function showPaymentProcessing(plan, price, method) {
  const m = document.getElementById('pay-modal');
  if (m) m.innerHTML = `
  <div style="background:#080F1A;border:1px solid rgba(255,255,255,.08);width:100%;max-width:500px;border-radius:24px 24px 0 0;padding:48px 28px;text-align:center">
    <div style="font-size:64px;margin-bottom:16px;animation:spin 1s linear infinite;display:inline-block">⏳</div>
    <h3 style="font-size:20px;font-weight:800;color:#E0EEFF;margin-bottom:8px">Traitement en cours…</h3>
    <p style="color:#A8C0DC;font-size:14px;margin-bottom:4px">Méthode : <strong>${method}</strong></p>
    <p style="color:#5F7FA0;font-size:13px">Ne fermez pas cette page</p>
  </div>`;
  setTimeout(async () => {
    await apiFetch('POST', '/subscriptions', { plan, method, price });
    if (m) m.innerHTML = `
    <div style="background:#080F1A;border:1px solid rgba(255,255,255,.08);width:100%;max-width:500px;border-radius:24px 24px 0 0;padding:48px 28px;text-align:center">
      <div style="width:72px;height:72px;background:linear-gradient(135deg,#2ED47A,#4A8EFF);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:36px">✓</div>
      <h3 style="font-size:22px;font-weight:800;color:#E0EEFF;margin-bottom:8px">Paiement confirmé ! 🎉</h3>
      <p style="color:#A8C0DC;font-size:14px;margin-bottom:4px">Abonnement <strong style="color:#E0EEFF">${plan}</strong> activé</p>
      <p style="color:#5F7FA0;font-size:13px;margin-bottom:24px">Via ${method}</p>
      <div style="background:rgba(46,212,122,.08);border:1px solid rgba(46,212,122,.2);border-radius:12px;padding:14px;margin-bottom:24px;font-size:13px;color:#2ED47A">
        ✅ Votre compte a été mis à niveau<br/>✅ Confirmation envoyée par email<br/>✅ Avantages actifs immédiatement
      </div>
      <button onclick="document.getElementById('pay-modal').remove();showToast('Bienvenue dans le plan ${plan} !','success')"
        style="width:100%;background:linear-gradient(135deg,#4A8EFF,#2ED47A);color:#fff;border:none;border-radius:14px;padding:16px;font-size:16px;font-weight:800;cursor:pointer">
        Accéder à mon espace →
      </button>
    </div>`;
  }, 2200);
}

function toggleThis(el){el.classList.toggle('active');}

// ─── FONCTIONS UTILITAIRES ─────────────────────────────────────────
function closeModal(id) { document.getElementById(id)?.classList.add('hidden'); }

function animateCounter(el, target, duration) {
  const num = parseInt(String(target).replace(/\s/g,''));
  if (!el || isNaN(num)) return;
  duration = duration || 1000;
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    el.textContent = Math.floor(p * num).toLocaleString('fr-FR');
    if (p < 1) requestAnimationFrame(step); else el.textContent = num.toLocaleString('fr-FR');
  };
  requestAnimationFrame(step);
}

function skeletonNewsCards(n) {
  return Array.from({length: n}, () => `
    <div class="news-card skeleton-card">
      <div class="nc-header" style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <div class="sk-avatar"></div>
        <div style="flex:1;display:flex;flex-direction:column;gap:7px">
          <div class="sk-title"></div>
          <div class="sk-line" style="width:55%"></div>
        </div>
      </div>
      <div class="sk-title" style="width:80%;margin-bottom:10px"></div>
      <div class="sk-line"></div>
      <div class="sk-line" style="width:88%;margin-top:7px"></div>
    </div>`).join('');
}

// ─── INIT ─────────────────────────────────────────────────────────
function setNavAvatar(text){const el=document.getElementById('nav-avatar-init');if(el)el.textContent=text;}

function connectSocket(){
  if(!token||!window.io||USE_MOCK)return;
  if(socket){socket.disconnect();}
  socket=window.io(SOCKET_URL,{auth:{token}});
  socket.on('new_message',(msg)=>{
    // Si la conversation est ouverte, ajouter le message en temps réel
    if(currentConvId===msg.conversationId&&msg.senderId!==currentUser?.id){
      const msgs=document.getElementById('chat-messages');
      if(msgs){
        const b=document.createElement('div');
        b.style.cssText='align-self:flex-start;max-width:75%';
        b.innerHTML=`<div style="background:rgba(255,255,255,.07);color:#E0EEFF;padding:10px 14px;border-radius:18px 18px 18px 4px;font-size:14px">${msg.text}</div><div style="font-size:10px;color:#5F7FA0;margin-top:3px">À l'instant</div>`;
        msgs.appendChild(b);msgs.scrollTop=msgs.scrollHeight;
      }
    }
    // Recharger la liste de conversations pour mettre à jour le preview
    if(document.getElementById('page-messages')?.classList.contains('active'))loadMessages();
  });
  socket.on('connect_error',(e)=>console.warn('Socket erreur:',e.message));
}

async function init(){
  // Tester connexion backend
  try {
    const res = await fetch(API_URL+'/health',{signal:AbortSignal.timeout(2000)});
    const data = await res.json();
    USE_MOCK = !data.success;
  } catch {
    USE_MOCK = true;
  }

  // Afficher l'app, masquer le splash
  const splash=document.getElementById('splash');
  const appEl=document.getElementById('app');
  if(splash){splash.classList.add('fade-out');setTimeout(()=>{splash.style.display='none';},500);}
  if(appEl)appEl.classList.remove('hidden');

  if(token){
    const r=await apiFetch('GET','/auth/me');
    if(r.success){currentUser=r.data;setNavAvatar((currentUser.name?.slice(0,1)||'U').toUpperCase());connectSocket();}
    else{token=null;localStorage.removeItem('makario_token');localStorage.removeItem('makario_user');}
  }
  await loadHome();


  // Barre de progression + classe scrolled sur la navbar
  const _bar = document.getElementById('scroll-progress');
  const _nav = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    const top = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (_bar) _bar.style.width = (h > 0 ? (top / h * 100) : 0) + '%';
    if (_nav) _nav.classList.toggle('scrolled', top > 10);
  }, { passive: true });

  // Banner installation PWA
  let _installPrompt = null;
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    _installPrompt = e;
    document.getElementById('install-banner')?.classList.remove('hidden');
  });
  document.getElementById('install-btn')?.addEventListener('click', () => {
    if (_installPrompt) { _installPrompt.prompt(); _installPrompt.userChoice.then(() => { _installPrompt = null; }); }
    document.getElementById('install-banner')?.classList.add('hidden');
  });
  document.getElementById('install-close')?.addEventListener('click', () => {
    document.getElementById('install-banner')?.classList.add('hidden');
  });
}

document.addEventListener('DOMContentLoaded', init);
