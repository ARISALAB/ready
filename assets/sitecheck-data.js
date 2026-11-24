/* AR Akron Services — website check (SEO, AI visibility, customers): shared data (browser + Netlify function).
   The analysis runs on the check-up engine (futurearis.netlify.app). This file holds the texts (Greek / English),
   the groups, the weights and the scoring, so the page and the email always agree.
   Texts say what is missing and what it costs, never how to fix it. */
(function (root) {
  // head: which of the three headline scores the group feeds
  var GROUPS = [
    { id: 'seo', head: 'seo', el: 'Σας βρίσκει η Google;', en: 'Can Google find you?' },
    { id: 'ai', head: 'ai', el: 'Σας προτείνουν τα AI (ChatGPT, Gemini, Perplexity);', en: 'Do ChatGPT, Gemini and Perplexity recommend you?' },
    { id: 'leads', head: 'leads', el: 'Φέρνει πελάτες;', en: 'Does it bring in customers?' },
    { id: 'venue', head: 'leads', el: 'Για εστιατόρια, καφέ και μπαρ', en: 'For restaurants, cafés and bars' },
    { id: 'trust', head: 'leads', el: 'Σας εμπιστεύονται;', en: 'Do visitors trust it?' },
    { id: 'mobile', head: 'leads', el: 'Στο κινητό', en: 'On a phone' }
  ];
  var HEADS = [
    { id: 'seo', el: 'Google', en: 'Google' },
    { id: 'ai', el: 'AI', en: 'AI' },
    { id: 'leads', el: 'Πελάτες', en: 'Customers' }
  ];

  // src: 'core' = general checks (report.positives/negatives), 'ai' = report.ai, 'venue' = report.venue (only for food venues)
  var ITEMS = {
    // ---- Google ----
    title: { src: 'core', g: 'seo', w: 3,
      el: { n: 'Τίτλος στη Google', r: 'Στα αποτελέσματα της Google το site σας εμφανίζεται με τίτλο που δεν λέει τι κάνετε και πού, οπότε χάνετε κλικ από ανθρώπους που ψάχνουν ακριβώς αυτό.' },
      en: { n: 'Title in Google results', r: 'In Google results your site shows a title that does not say what you do or where, so you lose clicks from people searching for exactly that.' } },
    desc: { src: 'core', g: 'seo', w: 3,
      el: { n: 'Περιγραφή στη Google', r: 'Κάτω από τον τίτλο η Google δείχνει ένα τυχαίο κομμάτι κειμένου αντί για μια πρόταση που πείθει να σας επιλέξουν.' },
      en: { n: 'Description in Google results', r: 'Under your title Google shows a random piece of text instead of a sentence that makes people choose you.' } },
    h1: { src: 'core', g: 'seo', w: 2,
      el: { n: 'Κύριος τίτλος σελίδας', r: 'Ούτε ο επισκέπτης ούτε η Google βλέπουν καθαρά ποιο είναι το κύριο θέμα της σελίδας.' },
      en: { n: 'Main page heading', r: 'Neither visitors nor Google can clearly see what the page is mainly about.' } },
    content: { src: 'core', g: 'seo', w: 3,
      el: { n: 'Αρκετό κείμενο', r: 'Με τόσο λίγο κείμενο η Google δεν έχει για ποιες αναζητήσεις να σας δείξει, και ο επισκέπτης δεν βρίσκει απαντήσεις.' },
      en: { n: 'Enough text', r: 'With so little text Google has nothing to match you to searches with, and visitors find no answers.' } },
    headings: { src: 'core', g: 'seo', w: 1,
      el: { n: 'Υπότιτλοι', r: 'Το κείμενο χωρίς υπότιτλους διαβάζεται δύσκολα, από ανθρώπους και από μηχανές.' },
      en: { n: 'Subheadings', r: 'Text without subheadings is hard to read, for people and for machines.' } },
    noindex: { src: 'core', g: 'seo', w: 4,
      el: { n: 'Η Google επιτρέπεται να δείχνει το site', r: 'Το site σας ενδεχομένως δεν εμφανίζεται καθόλου στη Google.' },
      en: { n: 'Google is allowed to show the site', r: 'Your site may not appear on Google at all.' } },
    sitemap: { src: 'core', g: 'seo', w: 2,
      el: { n: 'Χάρτης σελίδων για τη Google', r: 'Η Google μπορεί να αργεί να βρει όλες τις σελίδες σας, ειδικά τις καινούριες.' },
      en: { n: 'Sitemap for Google', r: 'Google may be slow to find all your pages, especially new ones.' } },
    canonical: { src: 'core', g: 'seo', w: 1,
      el: { n: 'Μία διεύθυνση ανά σελίδα', r: 'Η Google ενδεχομένως μετρά την ίδια σελίδα με περισσότερες από μία διευθύνσεις και μοιράζει τη δύναμή της.' },
      en: { n: 'One address per page', r: 'Google may count the same page under more than one address and split its strength.' } },
    alt: { src: 'core', g: 'seo', w: 2,
      el: { n: 'Περιγραφές στις εικόνες', r: 'Οι εικόνες σας δεν εμφανίζονται στις αναζητήσεις εικόνων και δεν «διαβάζονται» από τυφλούς χρήστες.' },
      en: { n: 'Image descriptions', r: 'Your images do not show up in image searches and cannot be read by blind visitors.' } },
    schema: { src: 'core', g: 'seo', w: 2,
      el: { n: 'Δομημένα δεδομένα', r: 'Η Google δεν μπορεί να δείξει πλούσια αποτελέσματα για εσάς, όπως ωράριο, αστέρια ή ερωτήσεις.' },
      en: { n: 'Structured data', r: 'Google cannot show rich results for you, such as hours, stars or questions.' } },

    // ---- AI ----
    aibots: { src: 'ai', g: 'ai', w: 5,
      el: { n: 'Τα AI επιτρέπεται να διαβάσουν το site', r: 'Το site σας λέει στα ChatGPT, Perplexity ή Claude να μην το διαβάζουν. Όταν κάποιος τα ρωτήσει για τη δουλειά σας, απαντούν με βάση τους ανταγωνιστές σας.' },
      en: { n: 'AI assistants are allowed to read the site', r: 'Your site tells ChatGPT, Perplexity or Claude not to read it. When someone asks them about what you do, they answer with your competitors.' } },
    nojs: { src: 'ai', g: 'ai', w: 4,
      el: { n: 'Το κείμενο διαβάζεται χωρίς JavaScript', r: 'Τα περισσότερα AI διαβάζουν μόνο το κείμενο που υπάρχει στη σελίδα με το που ανοίγει. Αν το περιεχόμενό σας φορτώνει αργότερα, για αυτά η σελίδα είναι σχεδόν άδεια.' },
      en: { n: 'Text readable without JavaScript', r: 'Most AI tools only read the text that is on the page when it first loads. If your content appears later, the page looks almost empty to them.' } },
    entity: { src: 'ai', g: 'ai', w: 4,
      el: { n: 'Ταυτότητα επιχείρησης για μηχανές', r: 'Τα AI και η Google δεν βλέπουν σε μορφή που καταλαβαίνουν ποια επιχείρηση είστε, τι κάνετε, πού βρίσκεστε και πώς επικοινωνεί κανείς μαζί σας. Χωρίς αυτό σας μπερδεύουν ή σας παραλείπουν.' },
      en: { n: 'Business identity for machines', r: 'AI tools and Google cannot see, in a form they understand, which business you are, what you do, where you are and how to reach you. Without it they mix you up or leave you out.' } },
    clear: { src: 'ai', g: 'ai', w: 3,
      el: { n: 'Καθαρή περιγραφή του τι κάνετε', r: 'Η αρχική σελίδα δεν λέει καθαρά και αναλυτικά τι κάνετε και για ποιον. Ένα AI δεν μπορεί να σας προτείνει για κάτι που δεν βρίσκει γραμμένο.' },
      en: { n: 'A clear description of what you do', r: 'Your home page does not clearly say what you do and for whom. An AI assistant cannot recommend you for something it cannot find written down.' } },
    faq: { src: 'ai', g: 'ai', w: 3,
      el: { n: 'Ερωτήσεις και απαντήσεις', r: 'Ο κόσμος ρωτάει τα AI με ερωτήσεις. Όταν το site σας δεν απαντά σε ερωτήσεις πελατών, τα AI παίρνουν τις απαντήσεις από αλλού, και μαζί τους πελάτες.' },
      en: { n: 'Questions and answers', r: 'People ask AI assistants questions. When your site does not answer customer questions, AI takes the answers from elsewhere, and the customers with them.' } },
    profiles: { src: 'ai', g: 'ai', w: 2,
      el: { n: 'Σύνδεση με τα προφίλ σας', r: 'Χωρίς συνδέσμους προς τα προφίλ σας (Facebook, Instagram, LinkedIn, Google) τα AI δυσκολεύονται να καταλάβουν ότι όλα αυτά είναι η ίδια επιχείρηση, και σας εμπιστεύονται λιγότερο.' },
      en: { n: 'Links to your profiles', r: 'Without links to your profiles (Facebook, Instagram, LinkedIn, Google), AI tools struggle to tell that they are all the same business, and trust you less.' } },
    about: { src: 'ai', g: 'ai', w: 2,
      el: { n: 'Σελίδα «Ποιοι είμαστε»', r: 'Τα AI και οι πελάτες ψάχνουν ποιος είναι πίσω από την επιχείρηση. Χωρίς αυτή τη σελίδα, φαίνεστε λιγότερο αξιόπιστοι από όσους την έχουν.' },
      en: { n: 'An “About us” page', r: 'AI tools and customers look for who is behind a business. Without this page, you look less trustworthy than those who have one.' } },
    llms: { src: 'ai', g: 'ai', w: 1,
      el: { n: 'Οδηγός για AI (llms.txt)', r: 'Δεν υπάρχει σύντομος οδηγός για τα AI με το τι κάνετε και ποιες σελίδες μετράνε. Είναι νέο πρότυπο, αλλά όσοι το έχουν διαβάζονται πιο εύκολα.' },
      en: { n: 'Guide for AI (llms.txt)', r: 'There is no short guide telling AI tools what you do and which pages matter. It is a new standard, but sites that have it are easier to read.' } },

    // ---- Customers ----
    contact: { src: 'core', g: 'leads', w: 4,
      el: { n: 'Στοιχεία επικοινωνίας', r: 'Όταν δεν φαίνεται αμέσως πώς επικοινωνεί κανείς μαζί σας, οι περισσότεροι φεύγουν χωρίς να ρωτήσουν.' },
      en: { n: 'Contact details', r: 'When it is not obvious how to contact you, most people leave without asking.' } },
    cta: { src: 'core', g: 'leads', w: 4,
      el: { n: 'Κουμπί για το επόμενο βήμα', r: 'Ο επισκέπτης δεν ξέρει τι να κάνει μετά: να τηλεφωνήσει, να ζητήσει προσφορά, να κλείσει ραντεβού; Όταν δεν του το λέτε, συνήθως δεν κάνει τίποτα.' },
      en: { n: 'A button for the next step', r: 'Visitors do not know what to do next: call, ask for a quote, book? When you do not tell them, they usually do nothing.' } },
    click: { src: 'core', g: 'leads', w: 3,
      el: { n: 'Τηλέφωνο και email με ένα άγγιγμα', r: 'Στο κινητό ο επισκέπτης πρέπει να αντιγράψει με το χέρι το τηλέφωνο ή το email. Κάθε επιπλέον βήμα χάνει πελάτες.' },
      en: { n: 'Tap-to-call phone and email', r: 'On a phone, visitors have to copy your number or email by hand. Every extra step loses customers.' } },
    form: { src: 'core', g: 'leads', w: 3,
      el: { n: 'Φόρμα επικοινωνίας', r: 'Πολλοί δεν θέλουν να τηλεφωνήσουν. Χωρίς σωστή φόρμα, όποιος σας βρίσκει στις 11 το βράδυ δεν έχει πώς να σας αφήσει μήνυμα.' },
      en: { n: 'Contact form', r: 'Many people do not want to call. Without a proper form, anyone who finds you at 11pm has no way to leave you a message.' } },
    proof: { src: 'core', g: 'leads', w: 4,
      el: { n: 'Κριτικές και παραδείγματα δουλειάς', r: 'Οι νέοι πελάτες πιστεύουν τους άλλους πελάτες, όχι τα λόγια της επιχείρησης. Χωρίς κριτικές ή παραδείγματα χάνετε το πιο πειστικό σας επιχείρημα.' },
      en: { n: 'Reviews and examples of work', r: 'New customers trust other customers, not what a business says about itself. Without reviews or examples you lose your most convincing argument.' } },
    pricing: { src: 'core', g: 'leads', w: 2,
      el: { n: 'Τιμές ή «από Χ €»', r: 'Όταν δεν φαίνεται καμία τιμή, πολλοί υποθέτουν ότι είστε ακριβοί και δεν ρωτούν καθόλου.' },
      en: { n: 'Prices or “from €X”', r: 'When no price is shown, many people assume you are expensive and never ask.' } },
    specifics: { src: 'core', g: 'leads', w: 2,
      el: { n: 'Συγκεκριμένα στοιχεία', r: 'Χωρίς αριθμούς, χρόνια, πελάτες ή αποτελέσματα, το κείμενο μοιάζει με όλων των άλλων και δεν ξεχωρίζετε.' },
      en: { n: 'Concrete details', r: 'Without numbers, years, clients or results, your text sounds like everyone else’s and you do not stand out.' } },
    cliches: { src: 'core', g: 'leads', w: 2,
      el: { n: 'Κείμενο χωρίς κοινοτοπίες', r: 'Φράσεις όπως «ποιότητα και αξιοπιστία» τις γράφουν όλοι. Ο επισκέπτης τις προσπερνά και δεν μαθαίνει γιατί να διαλέξει εσάς.' },
      en: { n: 'Text without clichés', r: 'Phrases like “quality and reliability” are on every site. Visitors skip them and never learn why they should choose you.' } },
    og: { src: 'core', g: 'leads', w: 2,
      el: { n: 'Εικόνα όταν μοιράζονται το link', r: 'Όταν κάποιος στέλνει το site σας σε Viber, Messenger ή Facebook, βγαίνει χωρίς σωστή φωτογραφία και κείμενο, και κανείς δεν πατάει.' },
      en: { n: 'Preview when the link is shared', r: 'When someone shares your site on WhatsApp, Messenger or Facebook, it shows up without a proper photo and text, and nobody taps it.' } },

    // ---- Food venues only ----
    book: { src: 'venue', g: 'venue', w: 5,
      el: { n: 'Online κράτηση τραπεζιού', r: 'Όποιος θέλει να κλείσει τραπέζι στις 11 το βράδυ ή ενώ είναι στη δουλειά, δεν μπορεί. Πολλοί δεν τηλεφωνούν ποτέ: απλώς κλείνουν σε άλλο μαγαζί που τους το επιτρέπει.' },
      en: { n: 'Online table booking', r: 'Anyone who wants to book at 11pm or from work cannot. Many people never call: they simply book a place that lets them do it online.' } },
    menu: { src: 'venue', g: 'venue', w: 5,
      el: { n: 'Μενού μέσα στο site (όχι μόνο PDF)', r: 'Το μενού είναι το πρώτο πράγμα που ψάχνει ο πελάτης. Αν λείπει ή ανοίγει μόνο ως PDF, στο κινητό διαβάζεται δύσκολα και η Google δεν «βλέπει» τα πιάτα σας.' },
      en: { n: 'Menu on the site (not only a PDF)', r: 'The menu is the first thing guests look for. If it is missing or only a PDF, it is hard to read on a phone and Google cannot see your dishes.' } },
    hours: { src: 'venue', g: 'venue', w: 3,
      el: { n: 'Ωράριο λειτουργίας', r: 'Ο πελάτης δεν ξέρει αν είστε ανοιχτά τώρα. Στην αμφιβολία, πηγαίνει κάπου που είναι σίγουρος.' },
      en: { n: 'Opening hours', r: 'Guests cannot tell if you are open right now. When in doubt, they go somewhere they are sure about.' } },
    map: { src: 'venue', g: 'venue', w: 3,
      el: { n: 'Χάρτης και οδηγίες', r: 'Χωρίς σύνδεσμο ή χάρτη Google, ο πελάτης πρέπει να ψάξει μόνος του πώς θα έρθει. Οι τουρίστες συχνά τα παρατάνε.' },
      en: { n: 'Map and directions', r: 'Without a Google Maps link or map, guests have to work out how to get to you. Visitors to the area often give up.' } },
    photos: { src: 'venue', g: 'venue', w: 2,
      el: { n: 'Φωτογραφίες από το μαγαζί και τα πιάτα', r: 'Ο κόσμος διαλέγει πού θα φάει με τα μάτια. Λίγες ή καθόλου φωτογραφίες σημαίνουν ότι η απόφαση παίρνεται αλλού.' },
      en: { n: 'Photos of the venue and the food', r: 'People choose where to eat with their eyes. Few or no photos means the decision is made elsewhere.' } },
    english: { src: 'venue', g: 'venue', w: 2,
      el: { n: 'Αγγλική έκδοση', r: 'Οι επισκέπτες από το εξωτερικό δεν καταλαβαίνουν τι προσφέρετε και η Google δεν σας δείχνει όταν ψάχνουν στα αγγλικά.' },
      en: { n: 'English version', r: 'Visitors from abroad cannot understand what you offer, and Google does not show you when they search in English.' } },

    // ---- Trust ----
    https: { src: 'core', g: 'trust', w: 4,
      el: { n: 'Ασφαλής σύνδεση (https)', r: 'Ο browser γράφει «Μη ασφαλές» δίπλα στη διεύθυνσή σας. Πολλοί κλείνουν τη σελίδα αμέσως.' },
      en: { n: 'Secure connection (https)', r: 'The browser shows “Not secure” next to your address. Many people close the page straight away.' } },
    fresh: { src: 'core', g: 'trust', w: 3,
      el: { n: 'Το site δείχνει ενημερωμένο', r: 'Παλιό copyright, παλιές ανακοινώσεις ή αναφορές σε περασμένες χρονιές κάνουν τον επισκέπτη να αναρωτιέται αν η επιχείρηση λειτουργεί ακόμα.' },
      en: { n: 'The site looks up to date', r: 'An old copyright year, old notices or past years make visitors wonder whether the business is still running.' } },
    placeholders: { src: 'core', g: 'trust', w: 3,
      el: { n: 'Χωρίς σπασμένο κείμενο', r: 'Κείμενο από πρότυπο ή κωδικοί στη θέση των λέξεων δείχνουν ότι κανείς δεν προσέχει το site, και ο επισκέπτης υποθέτει το ίδιο για την επιχείρηση.' },
      en: { n: 'No broken text', r: 'Template text or code where words should be shows that nobody looks after the site, and visitors assume the same about the business.' } },
    privacy: { src: 'core', g: 'trust', w: 2,
      el: { n: 'Πολιτική απορρήτου', r: 'Αν το site συλλέγει στοιχεία (φόρμα, cookies) χωρίς ενημέρωση, μπορεί να μην πληροί τον GDPR, και οι προσεκτικοί επισκέπτες το προσέχουν.' },
      en: { n: 'Privacy policy', r: 'If the site collects data (forms, cookies) without a notice, it may not meet GDPR, and careful visitors notice.' } },
    emaildomain: { src: 'core', g: 'trust', w: 2,
      el: { n: 'Επαγγελματικό email', r: 'Ένα gmail ή hotmail δίνει εικόνα μικρότερης επιχείρησης και τα μηνύματά σας πέφτουν πιο εύκολα στα ανεπιθύμητα.' },
      en: { n: 'Business email address', r: 'A gmail or hotmail address makes the business look smaller, and your emails land in spam more easily.' } },
    legal: { src: 'core', g: 'trust', w: 1,
      el: { n: 'Στοιχεία επιχείρησης (ΑΦΜ / ΓΕΜΗ)', r: 'Χωρίς ΑΦΜ ή ΓΕΜΗ δυσκολεύεται κάποιος να επιβεβαιώσει ότι η επιχείρηση υπάρχει και είναι νόμιμη.' },
      en: { n: 'Company details (VAT / registry no.)', r: 'Without a VAT or registry number it is harder to confirm that the business exists and is legitimate.' } },
    social: { src: 'core', g: 'trust', w: 1,
      el: { n: 'Σωστοί σύνδεσμοι στα social', r: 'Ένας σπασμένος σύνδεσμος στα social δείχνει ότι κάτι δεν συντηρείται.' },
      en: { n: 'Working social links', r: 'A broken social media link shows that something is not looked after.' } },

    // ---- Mobile ----
    viewport: { src: 'core', g: 'mobile', w: 4,
      el: { n: 'Προσαρμόζεται στο κινητό', r: 'Στο κινητό η σελίδα βγαίνει μικροσκοπική. Οι περισσότεροι επισκέπτες έρχονται από κινητό, και η Google κατατάσσει τα sites με βάση την έκδοση για κινητό.' },
      en: { n: 'Fits a phone screen', r: 'On a phone the page shows up tiny. Most visitors come from phones, and Google ranks sites by their mobile version.' } },
    perf: { src: 'core', g: 'mobile', w: 3,
      el: { n: 'Βάρος σελίδας', r: 'Η σελίδα είναι βαριά και αργεί να ανοίξει με δεδομένα κινητού. Όποιος περιμένει πάνω από λίγα δευτερόλεπτα, γυρίζει πίσω στη Google.' },
      en: { n: 'Page weight', r: 'The page is heavy and slow to open on mobile data. Anyone who waits more than a few seconds goes back to Google.' } },
    response: { src: 'core', g: 'mobile', w: 2,
      el: { n: 'Ταχύτητα απόκρισης', r: 'Ο server αργεί να απαντήσει, οπότε η σελίδα μένει λευκή πριν αρχίσει καν να φορτώνει.' },
      en: { n: 'Server response time', r: 'The server is slow to respond, so the page stays blank before it even starts loading.' } }
  };

  var PTS = { pass: 1, warn: 0.5, fail: 0 };
  var STATUS = ['pass', 'warn', 'fail'];

  // Picks the items this tool uses out of a check-up report: [[id, status], ...]
  function fromReport(rep) {
    var out = [], seen = {};
    function take(i, src) { if (ITEMS[i.id] && ITEMS[i.id].src === src && STATUS.indexOf(i.status) > -1 && !seen[i.id]) { seen[i.id] = 1; out.push([i.id, i.status]); } }
    ((rep && rep.positives) || []).concat((rep && rep.negatives) || []).forEach(function (i) { take(i, 'core'); });
    ((rep && rep.ai && rep.ai.items) || []).forEach(function (i) { take(i, 'ai'); });
    if (rep && rep.venue && rep.venue.isVenue) (rep.venue.items || []).forEach(function (i) { take(i, 'venue'); });
    return out;
  }

  function avg(ids, map) {
    var W = 0, V = 0;
    ids.forEach(function (id) { W += ITEMS[id].w; V += ITEMS[id].w * PTS[map[id]]; });
    return W ? Math.round(100 * V / W) : null;
  }

  // list: [[id, status], ...] -> overall score, three headline scores, groups, problems (worst first)
  function compute(list) {
    var map = {};
    (list || []).forEach(function (x) { if (x && ITEMS[x[0]] && PTS.hasOwnProperty(x[1])) map[x[0]] = x[1]; });
    var ids = Object.keys(ITEMS).filter(function (id) { return map[id]; });
    var groups = GROUPS.map(function (g) {
      var its = ids.filter(function (id) { return ITEMS[id].g === g.id; });
      return { id: g.id, head: g.head, score: avg(its, map), items: its.map(function (id) { return { id: id, status: map[id] }; }) };
    }).filter(function (g) { return g.items.length; });
    var heads = {};
    HEADS.forEach(function (h) {
      heads[h.id] = avg(ids.filter(function (id) { var g = GROUPS.filter(function (x) { return x.id === ITEMS[id].g; })[0]; return g.head === h.id; }), map);
    });
    var hv = HEADS.map(function (h) { return heads[h.id]; }).filter(function (v) { return v !== null; });
    var score = hv.length ? Math.round(hv.reduce(function (a, b) { return a + b; }, 0) / hv.length) : 0;
    var problems = ids.filter(function (id) { return map[id] !== 'pass'; }).map(function (id) {
      return { id: id, status: map[id], loss: ITEMS[id].w * (1 - PTS[map[id]]) };
    }).sort(function (a, b) { return b.loss - a.loss || ITEMS[b.id].w - ITEMS[a.id].w; });
    var band = score >= 80 ? 'good' : score >= 60 ? 'ok' : score >= 40 ? 'mid' : 'low';
    return { n: ids.length, score: score, band: band, heads: heads, groups: groups, problems: problems, map: map };
  }

  var BANDS = {
    good: { el: { t: 'Το site σας δουλεύει', d: 'Τα βασικά είναι σωστά: σας βρίσκουν, σας καταλαβαίνουν και μπορούν να επικοινωνήσουν. Τα λίγα κενά που έμειναν είναι αυτά που ξεχωρίζουν ένα καλό site από ένα που φέρνει δουλειά.' },
            en: { t: 'Your site is working', d: 'The basics are right: people find you, understand you and can get in touch. The few gaps left are what separate a good site from one that brings in work.' } },
    ok: { el: { t: 'Καλή βάση, με κενά που κοστίζουν', d: 'Η βάση υπάρχει, αλλά λείπουν πράγματα που ψάχνουν η Google, τα AI ή οι πελάτες πριν αποφασίσουν. Εκεί χάνετε δουλειά χωρίς να το ξέρετε.' },
          en: { t: 'A good base, with gaps that cost you', d: 'The basics are there, but some things Google, AI tools or customers look for are missing. That is where you lose work without knowing it.' } },
    mid: { el: { t: 'Χάνετε πελάτες', d: 'Το site δεν απαντά σε βασικές ερωτήσεις και δεν το διαβάζουν σωστά η Google και τα AI. Αρκετοί από όσους θα μπορούσαν να σας βρουν, καταλήγουν σε ανταγωνιστή.' },
           en: { t: 'You are losing customers', d: 'Your site does not answer basic questions, and Google and AI tools do not read it properly. Many people who could find you end up with a competitor.' } },
    low: { el: { t: 'Το site δεν δουλεύει για εσάς', d: 'Σήμερα το site μάλλον σας κοστίζει περισσότερο απ’ όσο σας φέρνει. Η Google και τα AI δύσκολα σας προτείνουν, και όσοι το ανοίγουν δεν βρίσκουν λόγο ή τρόπο να επικοινωνήσουν.' },
           en: { t: 'Your site is not working for you', d: 'Right now the site probably costs you more than it brings. Google and AI tools rarely recommend you, and visitors find no reason or way to get in touch.' } }
  };

  var D = { GROUPS: GROUPS, HEADS: HEADS, ITEMS: ITEMS, BANDS: BANDS, fromReport: fromReport, compute: compute, ENGINE: 'https://futurearis.netlify.app/.netlify/functions/analyze' };
  if (typeof module !== 'undefined' && module.exports) module.exports = D; else root.SC_DATA = D;
})(this);
