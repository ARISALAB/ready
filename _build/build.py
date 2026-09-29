# -*- coding: utf-8 -*-
"""Δημιουργεί όλες τις σελίδες του arakronservices.gr (ΕΛ + EN).
Τρέξε από τον φάκελο του repo:  python _build/build.py"""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://www.arakronservices.gr"
UTM = "?utm_source=arakronservices&utm_medium=referral&utm_campaign=digital_solutions"
W3F_KEY = "612db534-c306-4c99-914c-b151396dac36"
V = "9"  # αύξησε το όταν αλλάζεις css/js για να μην κρατάει ο browser παλιά έκδοση

ICON = {
 "arrow": '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
 "pin": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
 "phone": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
 "mail": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
 "ig": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
}
MARK = ('<svg class="brand-mark" viewBox="0 0 64 64" aria-hidden="true">'
        '<rect x="1.5" y="1.5" width="61" height="61" rx="13" fill="none" stroke="#c9a24a" stroke-opacity=".45"/>'
        '<path d="M15 49 L32 14 L49 49" fill="none" stroke="#c9a24a" stroke-width="5.2"/>'
        '<path d="M22.5 38.5 H41.5" stroke="#c9a24a" stroke-width="4.2"/></svg>')

# ------------------------------------------------------------------ κείμενα
L = {
"el": dict(
  prefix="", other="en", other_label="EN", locale="el_GR",
  nav=[("services","Υπηρεσίες"),("apps","Εφαρμογές"),("about","Σχετικά"),("contact","Επικοινωνία")],
  book="Κλείστε ραντεβού", menu="Μενού", skip="Μετάβαση στο περιεχόμενο",
  title_home="AR Akron Services | Συμβουλευτική εστίασης & φιλοξενίας",
  desc_home="Συμβουλευτική, εκπαίδευση προσωπικού και ψηφιακά εργαλεία για εστιατόρια, ξενοδοχεία και τουριστικές επιχειρήσεις στην Αθήνα.",
  hero_eyebrow="Συμβουλευτική εστίασης & φιλοξενίας, Αθήνα",
  hero_h1="Οργάνωση που φαίνεται <em>στο ταμείο</em>",
  hero_lead="Συμβουλευτική, εκπαίδευση προσωπικού και ψηφιακά εργαλεία για εστιατόρια, ξενοδοχεία και τουριστικές επιχειρήσεις, από κάποιον που τρέχει ο ίδιος εστιατόριο.",
  hero_2="Δείτε τις υπηρεσίες",
  audience=["Εστιατόρια & ταβέρνες","Καφέ & bars","Ξενοδοχεία","Τουριστικές επιχειρήσεις"],
  srv_eyebrow="Υπηρεσίες", srv_h2="Τι λύνουμε για την επιχείρησή σας",
  srv_lead="Ξεκινάμε από τα πραγματικά προβλήματα της καθημερινής λειτουργίας και φτάνουμε σε λύσεις που εφαρμόζονται.",
  services=[
   ("Συμβουλευτική εστιατορίων","Οργανώνουμε τη λειτουργία της κουζίνας και της σάλας ώστε να δουλεύει πιο γρήγορα, με λιγότερη σπατάλη και καλύτερη εξυπηρέτηση.",
    ["Οργάνωση κουζίνας και σάλας","Σχεδιασμός και κοστολόγηση μενού","Διαδικασίες εξυπηρέτησης πελατών"]),
   ("Στρατηγική & ανάπτυξη","Σχέδιο για το πού πηγαίνει η επιχείρηση: νέο κατάστημα, αλλαγή concept ή ανάληψη διαχείρισης, με αριθμούς και χρονοδιάγραμμα.",
    ["Business plan και μελέτη βιωσιμότητας","Προτάσεις διαχείρισης καταστημάτων","Τοποθέτηση στην αγορά και προώθηση"]),
   ("Εκπαίδευση προσωπικού","Σεμινάρια για τις ομάδες σας, προσαρμοσμένα στη δική σας επιχείρηση, ώστε όλοι να δουλεύουν με τον ίδιο τρόπο και το ίδιο επίπεδο.",
    ["Εξυπηρέτηση και πωλήσεις στη σάλα","Διαδικασίες και υγιεινή κουζίνας","Εκπαίδευση νέων υπαλλήλων"]),
   ("Οικονομική διαχείριση","Ξέρετε ανά πάσα στιγμή τι κερδίζετε. Κοστολόγηση, έλεγχος εξόδων και προμηθευτών, με εργαλεία που χρησιμοποιούνται εύκολα.",
    ["Κοστολόγηση πιάτων και ποτών","Έλεγχος εξόδων και προμηθευτών","Αναφορές με τα βασικά νούμερα"]),
  ],
  srv_more="Αναλυτικά οι υπηρεσίες",
  proc_eyebrow="Πώς δουλεύουμε", proc_h2="Τρία βήματα, χωρίς θεωρίες",
  steps=[("Αυτοψία & ανάλυση","Ερχόμαστε στο κατάστημα, βλέπουμε πώς δουλεύει στην πράξη και μιλάμε με εσάς και την ομάδα σας."),
         ("Πλάνο με προτεραιότητες","Σας παραδίδουμε ένα καθαρό σχέδιο: τι αλλάζει πρώτο, πόσο κοστίζει και τι αποτέλεσμα περιμένουμε."),
         ("Εφαρμογή & παρακολούθηση","Είμαστε δίπλα σας στην εφαρμογή, εκπαιδεύουμε το προσωπικό και μετράμε τα αποτελέσματα.")],
  apps_eyebrow="Ψηφιακά εργαλεία", apps_h2="Εφαρμογές που φτιάξαμε για τον κλάδο",
  apps_lead="Πέρα από τη συμβουλευτική, αναπτύσσουμε δικές μας εφαρμογές για επιχειρήσεις εστίασης και φιλοξενίας.",
  apps_more="Όλες οι εφαρμογές",
  apps=[
   dict(key="tr",name="TableReserve",url="https://tablereserve.gr/",img="/app-tablereserve.jpg",for_="Για εστιατόρια και bars",
        desc="Online κρατήσεις τραπεζιών. Οι πελάτες κλείνουν από το site σας και εσείς βλέπετε όλες τις κρατήσεις σε ένα σημείο.",
        bullets=["Σελίδα κρατήσεων για το κατάστημά σας","Ειδοποιήσεις με email σε εσάς και στον πελάτη","Πίνακας διαχείρισης για όλες τις κρατήσεις","Plugin για ιστοσελίδες WordPress"],
        cta="Δείτε το TableReserve"),
   dict(key="gf",name="GoFinanceOS",url="https://gofinanceos.com/",img="/app-gofinanceos.jpg",for_="Για εστιατόρια, καφέ και μικρές επιχειρήσεις",
        desc="Οικονομική διαχείριση που δουλεύει και χωρίς internet. Εφάπαξ άδεια χρήσης, χωρίς μηνιαία συνδρομή.",
        bullets=["Έσοδα, έξοδα, προμηθευτές και μισθοδοσία","Λειτουργεί και χωρίς σύνδεση στο internet","Τα δεδομένα μένουν στον υπολογιστή σας","Εφάπαξ άδεια, χωρίς συνδρομή"],
        cta="Δείτε το GoFinanceOS"),
   dict(key="awb",name="akronwebuilder.gr",url="https://akronwebuilder.gr/",img="/app-akronwebuilder.jpg",for_="Για κάθε επιχείρηση που θέλει δικό της site",
        desc="Ιστοσελίδες και web εφαρμογές κατά παραγγελία, σχεδιασμένες για τη δική σας επιχείρηση και όχι από έτοιμο template.",
        bullets=["Ιστοσελίδες για εστιατόρια και επιχειρήσεις","Web εφαρμογές κατά παραγγελία","Σύνδεση με online κρατήσεις"],
        cta="Επισκεφθείτε το akronwebuilder.gr"),
  ],
  about_eyebrow="Ποιος είμαι", about_h2="Γνωρίζω την εστίαση από μέσα",
  about_p=["Είμαι ο <strong>Άρης Αλαμπουρινός</strong>. Είμαι ιδιοκτήτης του <strong>Plaki Meze</strong> στην Αθήνα, οπότε τα προβλήματα ενός εστιατορίου τα ζω κάθε μέρα: προσωπικό, κόστη, προμηθευτές, κρατήσεις.",
           "Είμαι επίσης web developer, απόφοιτος του Εθνικού και Καποδιστριακού Πανεπιστημίου Αθηνών. Γι' αυτό συνδυάζω την πρακτική εμπειρία της σάλας με ψηφιακά εργαλεία που φτιάχνω ο ίδιος.",
           "Με την AR Akron Services βοηθάω επιχειρήσεις εστίασης, τουρισμού και φιλοξενίας να δουλεύουν πιο οργανωμένα και να κερδίζουν περισσότερα."],
  about_alt="Ο Άρης Αλαμπουρινός", sign="Άρης Αλαμπουρινός",
  clients_eyebrow="Έχουμε συνεργαστεί με",
  clients=["Pandrosou Garden","ΔΙΕΘΝΗΣ ΔΡΑΣΗ"],
  cta_h2="Ας δούμε μαζί την επιχείρησή σας",
  cta_p="Πείτε μας τι σας απασχολεί και θα σας προτείνουμε τα επόμενα βήματα.",
  call="Καλέστε μας",
  # services page
  title_services="Υπηρεσίες | AR Akron Services",
  desc_services="Συμβουλευτική εστιατορίων, στρατηγική και ανάπτυξη, εκπαίδευση προσωπικού και οικονομική διαχείριση για επιχειρήσεις φιλοξενίας.",
  sp_h1="Υπηρεσίες για εστίαση, τουρισμό και φιλοξενία",
  sp_lead="Κάθε συνεργασία ξεκινά από την αυτοψία. Διαλέγετε μία υπηρεσία ή τις συνδυάζουμε σε ένα ολοκληρωμένο πλάνο.",
  link_tr="Online κρατήσεις με το TableReserve", link_gf="Οικονομική διαχείριση με το GoFinanceOS",
  # apps page
  title_apps="Εφαρμογές | AR Akron Services",
  desc_apps="TableReserve για online κρατήσεις, GoFinanceOS για οικονομική διαχείριση και akronwebuilder.gr για ιστοσελίδες.",
  ap_h1="Ψηφιακά εργαλεία για την επιχείρησή σας",
  demo_h2="Θέλετε να δείτε μια εφαρμογή στην πράξη;",
  demo_p="Κλείστε μια σύντομη παρουσίαση και σας δείχνουμε πώς ταιριάζει στη δική σας επιχείρηση.",
  demo_btn="Κλείστε παρουσίαση",
  # contact
  title_contact="Επικοινωνία | AR Akron Services",
  desc_contact="Επικοινωνήστε με την AR Akron Services: τηλ. 698 366 1460, info@arakronservices.gr, Άγιος Δημήτριος Αττικής.",
  cp_h1="Πείτε μας τι χρειάζεστε",
  cp_lead="Γράψτε μας λίγα λόγια για την επιχείρησή σας και θα σας απαντήσουμε μέσα σε μία εργάσιμη ημέρα.",
  f_name="Ονοματεπώνυμο", f_email="Email", f_phone="Τηλέφωνο (προαιρετικό)", f_biz="Επιχείρηση (προαιρετικό)",
  f_msg="Μήνυμα", f_send="Αποστολή μηνύματος", f_subject="Νέο μήνυμα από arakronservices.gr",
  i_addr="Διεύθυνση", i_phone="Τηλέφωνο", i_mail="Email", i_social="Social",
  # privacy
  title_privacy="Πολιτική απορρήτου | AR Akron Services",
  desc_privacy="Πώς η AR Akron Services συλλέγει και χρησιμοποιεί προσωπικά δεδομένα και cookies.",
  pp_h1="Πολιτική απορρήτου", pp_updated="Τελευταία ενημέρωση: 28 Σεπτεμβρίου 2026",
  privacy=[
   ("Ποιος είναι υπεύθυνος για τα δεδομένα σας","<p>Υπεύθυνος επεξεργασίας είναι η ατομική επιχείρηση <strong>Αριστείδης Αλαμπουρινός – AR Akron Services</strong>, Γρίβα Διγενή 2, 17342 Άγιος Δημήτριος Αττικής, ΑΦΜ 112492149, Αρ. ΓΕΜΗ 161479309000. Για οποιοδήποτε θέμα σχετικά με τα δεδομένα σας γράψτε μας στο <a href=\"mailto:info@arakronservices.gr\">info@arakronservices.gr</a> ή καλέστε στο 698 366 1460.</p>"),
   ("Ποια δεδομένα συλλέγουμε","<ul><li><strong>Φόρμα επικοινωνίας:</strong> όνομα, email, προαιρετικά τηλέφωνο και επωνυμία επιχείρησης, και το μήνυμά σας. Τα χρησιμοποιούμε μόνο για να σας απαντήσουμε. Η αποστολή γίνεται μέσω της υπηρεσίας Web3Forms, η οποία προωθεί το μήνυμα στο email μας.</li><li><strong>Στατιστικά επισκεψιμότητας:</strong> μόνο αν το αποδεχτείτε, χρησιμοποιούμε το Google Analytics για ανώνυμα στοιχεία, όπως ποιες σελίδες διαβάζονται και από ποια συσκευή.</li></ul>"),
   ("Cookies και τοπική αποθήκευση","<ul><li><strong>Απαραίτητα:</strong> ο browser σας κρατά την επιλογή σας για τα cookies. Δεν στέλνεται πουθενά.</li><li><strong>Στατιστικών (Google Analytics):</strong> ενεργοποιούνται μόνο μετά από την αποδοχή σας. Μπορείτε να αλλάξετε γνώμη όποτε θέλετε από το «Ρυθμίσεις cookies» στο κάτω μέρος κάθε σελίδας.</li></ul>"),
   ("Πόσο καιρό κρατάμε τα δεδομένα","<p>Τα μηνύματα της φόρμας τα κρατάμε όσο χρειάζεται για την επικοινωνία μας και για τυχόν συνεργασία που θα ακολουθήσει. Τα στατιστικά του Google Analytics διατηρούνται για όσο ορίζουν οι ρυθμίσεις του λογαριασμού μας, και το πολύ για 14 μήνες.</p>"),
   ("Τα δικαιώματά σας","<p>Έχετε δικαίωμα να ζητήσετε πρόσβαση, διόρθωση ή διαγραφή των δεδομένων σας, να περιορίσετε ή να αντιταχθείτε στην επεξεργασία τους και να ζητήσετε τη φορητότητά τους. Στείλτε μας email στο <a href=\"mailto:info@arakronservices.gr\">info@arakronservices.gr</a>. Αν θεωρείτε ότι δεν χειριστήκαμε σωστά τα δεδομένα σας, μπορείτε να υποβάλετε καταγγελία στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (<a href=\"https://www.dpa.gr\" target=\"_blank\" rel=\"noopener\">www.dpa.gr</a>).</p>"),
  ],
  # footer
  ft_tag="Συμβουλευτική και ψηφιακά εργαλεία για εστίαση, τουρισμό και φιλοξενία.",
  ft_company="Στοιχεία επιχείρησης", ft_owner="Αριστείδης Αλαμπουρινός", ft_addr="Γρίβα Διγενή 2, 17342 Άγιος Δημήτριος, Αττική",
  ft_gemi="Αρ. ΓΕΜΗ", ft_afm="ΑΦΜ", ft_apps="Εφαρμογές", ft_info="Πληροφορίες", ft_privacy="Πολιτική απορρήτου",
  ft_cookies="Ρυθμίσεις cookies", ft_rights="Όλα τα δικαιώματα διατηρούνται.", ft_nav="Σελίδες", home="Αρχική",
),
"en": dict(
  prefix="/en", other="el", other_label="ΕΛ", locale="en_US",
  nav=[("services","Services"),("apps","Apps"),("about","About"),("contact","Contact")],
  book="Book a meeting", menu="Menu", skip="Skip to content",
  title_home="AR Akron Services | Restaurant & hospitality consulting in Athens",
  desc_home="Consulting, staff training and digital tools for restaurants, hotels and tourism businesses in Athens, Greece.",
  hero_eyebrow="Restaurant & hospitality consulting, Athens",
  hero_h1="Organisation you can see <em>on the bottom line</em>",
  hero_lead="Consulting, staff training and digital tools for restaurants, hotels and tourism businesses, from someone who runs a restaurant himself.",
  hero_2="See our services",
  audience=["Restaurants & tavernas","Cafés & bars","Hotels","Tourism businesses"],
  srv_eyebrow="Services", srv_h2="What we solve for your business",
  srv_lead="We start from the real problems of day-to-day operations and arrive at solutions that actually get implemented.",
  services=[
   ("Restaurant consulting","We organise kitchen and floor operations so they run faster, with less waste and better service.",
    ["Kitchen and floor organisation","Menu design and costing","Guest service procedures"]),
   ("Strategy & growth","A plan for where the business is going: a new venue, a concept change or taking over management, with numbers and a timeline.",
    ["Business plan and feasibility study","Venue management proposals","Market positioning and promotion"]),
   ("Staff training","Seminars for your teams, tailored to your business, so everyone works the same way and to the same standard.",
    ["Floor service and upselling","Kitchen procedures and hygiene","Onboarding new staff"]),
   ("Financial management","Know what you earn at any moment. Costing, expense and supplier control, with tools that are easy to use.",
    ["Dish and drink costing","Expense and supplier control","Reports with the key numbers"]),
  ],
  srv_more="Services in detail",
  proc_eyebrow="How we work", proc_h2="Three steps, no theory",
  steps=[("Site visit & analysis","We come to your venue, see how it works in practice and talk with you and your team."),
         ("A prioritised plan","You get a clear plan: what changes first, what it costs and what result we expect."),
         ("Implementation & follow-up","We stay with you during implementation, train the staff and measure the results.")],
  apps_eyebrow="Digital tools", apps_h2="Apps we built for the industry",
  apps_lead="Beyond consulting, we build our own software for restaurants and hospitality businesses.",
  apps_more="All apps",
  apps=[
   dict(key="tr",name="TableReserve",url="https://tablereserve.gr/",img="/app-tablereserve.jpg",for_="For restaurants and bars",
        desc="Online table reservations. Guests book from your website and you see every booking in one place.",
        bullets=["A booking page for your venue","Email notifications to you and the guest","One dashboard for all bookings","Plugin for WordPress websites"],
        cta="See TableReserve"),
   dict(key="gf",name="GoFinanceOS",url="https://gofinanceos.com/",img="/app-gofinanceos.jpg",for_="For restaurants, cafés and small businesses",
        desc="Financial management that works even offline. One-time license, no monthly subscription.",
        bullets=["Revenue, expenses, suppliers and payroll","Works without an internet connection","Your data stays on your computer","One-time license, no subscription"],
        cta="See GoFinanceOS"),
   dict(key="awb",name="akronwebuilder.gr",url="https://akronwebuilder.gr/",img="/app-akronwebuilder.jpg",for_="For any business that wants its own website",
        desc="Custom websites and web applications, designed for your business rather than built from a template.",
        bullets=["Websites for restaurants and businesses","Custom web applications","Integration with online bookings"],
        cta="Visit akronwebuilder.gr"),
  ],
  about_eyebrow="About me", about_h2="I know hospitality from the inside",
  about_p=["I'm <strong>Aris Alampourinos</strong>. I own <strong>Plaki Meze</strong> in Athens, so I live a restaurant's problems every day: staff, costs, suppliers, bookings.",
           "I'm also a web developer, a graduate of the National and Kapodistrian University of Athens. That's why I combine hands-on floor experience with digital tools I build myself.",
           "With AR Akron Services I help restaurant, tourism and hospitality businesses run in a more organised way and earn more."],
  about_alt="Aris Alampourinos", sign="Aris Alampourinos",
  clients_eyebrow="We have worked with",
  clients=["Pandrosou Garden","DIETHNIS DRASI"],
  cta_h2="Let's look at your business together",
  cta_p="Tell us what's on your mind and we'll suggest the next steps.",
  call="Call us",
  title_services="Services | AR Akron Services",
  desc_services="Restaurant consulting, strategy and growth, staff training and financial management for hospitality businesses.",
  sp_h1="Services for restaurants, tourism and hospitality",
  sp_lead="Every engagement starts with a site visit. Choose one service or we combine them into a complete plan.",
  link_tr="Online bookings with TableReserve", link_gf="Financial management with GoFinanceOS",
  title_apps="Apps | AR Akron Services",
  desc_apps="TableReserve for online bookings, GoFinanceOS for financial management and akronwebuilder.gr for websites.",
  ap_h1="Digital tools for your business",
  demo_h2="Want to see an app in action?",
  demo_p="Book a short demo and we'll show you how it fits your business.",
  demo_btn="Book a demo",
  title_contact="Contact | AR Akron Services",
  desc_contact="Contact AR Akron Services: +30 698 366 1460, info@arakronservices.gr, Agios Dimitrios, Athens.",
  cp_h1="Tell us what you need",
  cp_lead="Write a few words about your business and we'll reply within one working day.",
  f_name="Full name", f_email="Email", f_phone="Phone (optional)", f_biz="Business (optional)",
  f_msg="Message", f_send="Send message", f_subject="New message from arakronservices.gr (EN)",
  i_addr="Address", i_phone="Phone", i_mail="Email", i_social="Social",
  title_privacy="Privacy policy | AR Akron Services",
  desc_privacy="How AR Akron Services collects and uses personal data and cookies.",
  pp_h1="Privacy policy", pp_updated="Last updated: 28 September 2026",
  privacy=[
   ("Who is responsible for your data","<p>The data controller is the sole proprietorship <strong>Aristeidis Alampourinos – AR Akron Services</strong>, Griva Digeni 2, 17342 Agios Dimitrios, Attica, Greece, VAT No. EL112492149, GEMI No. 161479309000. For any question about your data, email <a href=\"mailto:info@arakronservices.gr\">info@arakronservices.gr</a> or call +30 698 366 1460.</p>"),
   ("What data we collect","<ul><li><strong>Contact form:</strong> your name, email, optionally phone and business name, and your message. We use them only to reply to you. Messages are sent through the Web3Forms service, which forwards them to our email.</li><li><strong>Visitor statistics:</strong> only if you accept, we use Google Analytics for anonymous data such as which pages are read and on which device.</li></ul>"),
   ("Cookies and local storage","<ul><li><strong>Essential:</strong> your browser keeps your cookie choice. It is not sent anywhere.</li><li><strong>Analytics (Google Analytics):</strong> enabled only after you accept. You can change your mind at any time via “Cookie settings” at the bottom of every page.</li></ul>"),
   ("How long we keep data","<p>We keep contact form messages for as long as needed for our communication and any collaboration that follows. Google Analytics statistics are kept as set in our account settings, and for at most 14 months.</p>"),
   ("Your rights","<p>You have the right to request access to, correction or deletion of your data, to restrict or object to its processing, and to request its portability. Email us at <a href=\"mailto:info@arakronservices.gr\">info@arakronservices.gr</a>. If you believe we have not handled your data properly, you can file a complaint with the Hellenic Data Protection Authority (<a href=\"https://www.dpa.gr\" target=\"_blank\" rel=\"noopener\">www.dpa.gr</a>).</p>"),
  ],
  ft_tag="Consulting and digital tools for restaurants, tourism and hospitality.",
  ft_company="Company details", ft_owner="Aristeidis Alampourinos", ft_addr="Griva Digeni 2, 17342 Agios Dimitrios, Attica, Greece",
  ft_gemi="GEMI No.", ft_afm="VAT No.", ft_apps="Apps", ft_info="Information", ft_privacy="Privacy policy",
  ft_cookies="Cookie settings", ft_rights="All rights reserved.", ft_nav="Pages", home="Home",
)}


# ================================================================ ενημέρωση περιεχομένου (βάσει εμπειρίας)
L["el"].update(dict(
  hero_lead="Συμβουλευτική, εκπαίδευση προσωπικού και ψηφιακά εργαλεία για εστιατόρια, ξενοδοχεία και τουριστικές επιχειρήσεις, με πάνω από 25 χρόνια εμπειρίας μέσα σε καταστήματα εστίασης.",
  nav=[("services","Υπηρεσίες"),("apps","Εφαρμογές"),("about","Σχετικά"),("contact","Επικοινωνία")],
  srv_h2="Από το ξεκίνημα μέχρι την καθημερινή λειτουργία",
  srv_lead="Έξι τομείς όπου μπορούμε να βοηθήσουμε, είτε ξεκινάτε νέο κατάστημα είτε θέλετε να βελτιώσετε ένα που ήδη λειτουργεί.",
  srv_link="Περισσότερα",
  services2=[
   dict(h="Έναρξη & επαναλειτουργία καταστήματος", short="Από το άδειο κατάστημα μέχρι την πρώτη γεμάτη βραδιά.",
        p="Σχεδιάζουμε και επιβλέπουμε όλη την προετοιμασία ενός νέου καταστήματος ή την επαναλειτουργία ενός χώρου μετά από διακοπή, ώστε να ανοίξει οργανωμένο από την πρώτη μέρα.",
        items=["Επίβλεψη ανακαίνισης και προετοιμασίας","Στελέχωση και οργανόγραμμα","Επαναλειτουργία μετά από διακοπή λειτουργίας"]),
   dict(h="Μενού & τιμολογιακή πολιτική", short="Μενού που πουλάει και τιμές που αφήνουν κέρδος.",
        p="Καταρτίζουμε ή αναδιοργανώνουμε το μενού με βάση το πραγματικό κόστος κάθε πιάτου, το κοινό σας και τις συνθήκες της αγοράς.",
        items=["Κατάρτιση και αναδιοργάνωση μενού","Κοστολόγηση πιάτων και ποτών","Τιμολογιακή πολιτική","Συνδυασμοί φαγητού και κρασιού"]),
   dict(h="Εκπαίδευση προσωπικού", short="Ομάδα που δουλεύει με τον ίδιο τρόπο και το ίδιο επίπεδο.",
        p="Εκπαιδεύουμε σερβιτόρους, προσωπικό υποδοχής, ταμεία και μετρ, με πιστοποιημένη μεθοδολογία εκπαίδευσης ενηλίκων και πρακτική μέσα στο κατάστημα.",
        items=["Εξυπηρέτηση και πωλήσεις στη σάλα","Υποδοχή πελατών και κρατήσεις","Διαδικασίες ταμείου","Εκπαίδευση νέων υπαλλήλων"]),
   dict(h="Οργάνωση λειτουργίας", short="Σάλα και κουζίνα που δουλεύουν συντονισμένα.",
        p="Βάζουμε σαφείς ρόλους, σωστό καταμερισμό εργασίας και καθαρή ροή παραγγελιών ανάμεσα σε κουζίνα και σάλα, για γρηγορότερη και σταθερή εξυπηρέτηση.",
        items=["Ροή παραγγελιών κουζίνας και σάλας","Καταμερισμός εργασίας και βάρδιες","Πρότυπα εξυπηρέτησης πελατών"], link="tr"),
   dict(h="Οικονομική διαχείριση & ταμείο", short="Ξέρετε κάθε μέρα τι κερδίζετε.",
        p="Αναλαμβάνουμε ή οργανώνουμε την οικονομική διαχείριση: έλεγχο ταμείου και εισπράξεων, παρακολούθηση εξόδων και αποτελεσμάτων.",
        items=["Έλεγχος ταμείου και εισπράξεων","Παρακολούθηση εξόδων και αποτελεσμάτων","Οικονομική διεύθυνση καταστήματος"], link="gf"),
   dict(h="Αποθήκη & προμηθευτές", short="Λιγότερη σπατάλη, καλύτερες τιμές.",
        p="Οργανώνουμε τη διαχείριση τροφίμων και αποθήκης και αξιολογούμε τους προμηθευτές σας με βάση τη σχέση κόστους και ποιότητας.",
        items=["Διαχείριση τροφίμων και αποθήκης","Αξιολόγηση κόστους και ποιότητας προμηθευτών","Έλεγχος σπατάλης"]),
  ],
  sp_h1="Υπηρεσίες για εστίαση, τουρισμό και φιλοξενία",
  stats=[("25+","χρόνια στην εστίαση"),("20+","χρόνια σε θέσεις ευθύνης"),("40+","καταστήματα και μονάδες"),("15+","πόλεις και περιοχές, από την Αθήνα έως την Αλεξανδρούπολη")],
  ab_eyebrow="Σχετικά", ab_h2="Η εστίαση, από κάθε πόστο",
  ab_teaser="Η AR Akron Services στηρίζεται σε εμπειρία από κάθε πόστο ενός εστιατορίου: από τη σάλα και την κουζίνα μέχρι τη διοίκηση και την οικονομική διεύθυνση.",
  ab_more="Γνωρίστε μας",
  venues_eyebrow="Καταστήματα όπου έχουμε αναλάβει έναρξη, οργάνωση ή διοίκηση",
  venues=["Ο Κήπος της Πανδρόσου","Πλάκι Meze","Άλμπουρο","Πράσινη Τέντα","Ερμείον","Κίτρο","Θέσπις","Χάραμα","Στάση για Φαγητό","Ουζερί Αλέξης","Άβατον Wine Bar"],
  title_about="Σχετικά | AR Akron Services",
  desc_about="Η AR Akron Services στηρίζεται σε πάνω από 25 χρόνια εμπειρίας στην εστίαση: ανοίγματα καταστημάτων, οργάνωση, εκπαίδευση προσωπικού και οικονομική διεύθυνση.",
  abp_h1="Η εστίαση, από κάθε πόστο",
  abp_lead="Πίσω από την AR Akron Services βρίσκεται μια πορεία 25 ετών σε κάθε πόστο ενός εστιατορίου.",
  abp_story=["Η εμπειρία μας ξεκινά από τη σάλα και φτάνει μέχρι τη διοίκηση: σερβιτόρος, μετρ, υπεύθυνος προσωπικού, υπεύθυνος καταστήματος, οικονομικός διευθυντής και ιδιοκτήτης επιχείρησης. Γι' αυτό καταλαβαίνουμε τα προβλήματα κάθε θέσης και μιλάμε τη γλώσσα της ομάδας σας.",
             "Έχουμε αναλάβει την έναρξη νέων καταστημάτων, την επαναλειτουργία μονάδων μετά από διακοπή και την οργάνωση εστιατορίων από την Αθήνα έως την Αλεξανδρούπολη: από ουζερί και ταβέρνες μέχρι wine bars και μεγάλους χώρους με ζωντανή μουσική.",
             "Σήμερα, μαζί με τη συμβουλευτική, αναπτύσσουμε και δικά μας ψηφιακά εργαλεία, όπως το TableReserve και το GoFinanceOS, για να λύνουμε προβλήματα που ζήσαμε στην πράξη."],
  hl_eyebrow="Τι φέρνουμε στη συνεργασία", hl_h2="Αποδεδειγμένη εμπειρία",
  highlights=[("Ανοίγματα & επαναλειτουργίες","Έναρξη νέων καταστημάτων και επαναλειτουργία μονάδων, από την ανακαίνιση μέχρι την πρώτη μέρα λειτουργίας."),
              ("Βραβευμένα καταστήματα","Εμπειρία στη λειτουργία βραβευμένων καταστημάτων εστίασης."),
              ("Πιστοποιημένη εκπαίδευση","Πιστοποίηση εκπαιδευτή ενηλίκων από το Κέντρο Επιμόρφωσης του ΕΚΠΑ και πιστοποίηση εξυπηρέτησης πελατών εστιατορίου."),
              ("Ελληνικά & Αγγλικά","Άριστη γνώση αγγλικών (C2), για συνεργασία με τουριστικές επιχειρήσεις και διεθνή πελατεία.")],
))
L["en"].update(dict(
  hero_lead="Consulting, staff training and digital tools for restaurants, hotels and tourism businesses, backed by more than 25 years of hands-on restaurant experience.",
  srv_h2="From the very start to everyday operations",
  srv_lead="Six areas where we can help, whether you are opening a new venue or improving one that is already running.",
  srv_link="Learn more",
  services2=[
   dict(h="Opening & re-opening a venue", short="From an empty room to the first full night.",
        p="We plan and supervise the whole preparation of a new venue, or the re-opening of one after a closure, so it opens organised from day one.",
        items=["Supervision of renovation and preparation","Staffing and organisation chart","Re-opening after a closure"]),
   dict(h="Menu & pricing", short="A menu that sells and prices that leave a profit.",
        p="We create or rework your menu based on the real cost of every dish, your audience and market conditions.",
        items=["Menu creation and redesign","Dish and drink costing","Pricing policy","Food and wine pairing"]),
   dict(h="Staff training", short="A team that works the same way, to the same standard.",
        p="We train waiters, hosts, cashiers and maîtres d'hôtel, using a certified adult-training methodology and hands-on practice in your venue.",
        items=["Floor service and upselling","Guest reception and bookings","Cash desk procedures","Onboarding new staff"]),
   dict(h="Operations", short="Floor and kitchen working in sync.",
        p="We set clear roles, the right division of work and a clean order flow between kitchen and floor, for faster and more consistent service.",
        items=["Kitchen and floor order flow","Division of work and shifts","Guest service standards"], link="tr"),
   dict(h="Financial management & cash control", short="Know every day what you earn.",
        p="We run or organise your financial management: cash and receipts control, tracking of expenses and results.",
        items=["Cash and receipts control","Tracking expenses and results","Financial management of the venue"], link="gf"),
   dict(h="Stock & suppliers", short="Less waste, better prices.",
        p="We organise food and stock management and assess your suppliers on the balance of cost and quality.",
        items=["Food and stock management","Supplier cost and quality assessment","Waste control"]),
  ],
  stats=[("25+","years in hospitality"),("20+","years in management roles"),("40+","venues and units"),("15+","cities and regions, from Athens to Alexandroupoli")],
  ab_eyebrow="About", ab_h2="Hospitality, from every position",
  ab_teaser="AR Akron Services is built on experience from every position in a restaurant: from the floor and the kitchen to management and financial direction.",
  ab_more="About us",
  venues_eyebrow="Venues where we have led an opening, organisation or management",
  venues=["Pandrosou Garden","Plaki Meze","Albouro","Prasini Tenta","Hermion","Kitro","Thespis","Xarama","Stasi gia Fagito","Ouzeri Alexis","Avaton Wine Bar"],
  title_about="About | AR Akron Services",
  desc_about="AR Akron Services is built on 25+ years of restaurant experience: venue openings, operations, staff training and financial management.",
  abp_h1="Hospitality, from every position",
  abp_lead="Behind AR Akron Services lies a 25-year career across every position in a restaurant.",
  abp_story=["Our experience runs from the floor to management: waiter, maître d'hôtel, staff manager, venue manager, financial director and business owner. That's why we understand the problems of every role and speak your team's language.",
             "We have led the opening of new venues, the re-opening of units after a closure and the organisation of restaurants from Athens to Alexandroupoli: from ouzeris and tavernas to wine bars and large venues with live music.",
             "Today, alongside consulting, we build our own digital tools, such as TableReserve and GoFinanceOS, to solve problems we have lived in practice."],
  hl_eyebrow="What we bring", hl_h2="Proven experience",
  highlights=[("Openings & re-openings","Opening new venues and re-opening units, from renovation to the first day of service."),
              ("Award-winning venues","Experience running award-winning restaurants."),
              ("Certified training","Adult trainer certification from the University of Athens Lifelong Learning Centre, and a restaurant customer-service certification."),
              ("Greek & English","Fluent English (C2), for working with tourism businesses and international guests.")],
))

PAGES = ["home","services","apps","about","contact","privacy"]
def url(lang, page):
    p = L[lang]["prefix"]
    if page == "home": return (p + "/") if p else "/"
    return f"{p}/{page}"
def fname(lang, page):
    base = "index" if page == "home" else page
    return os.path.join(ROOT, ("en" if lang=="en" else ""), base + ".html")

# ------------------------------------------------------------------ κομμάτια
def head(t, lang, page, title, desc, extra=""):
    other = t["other"]
    alt = "".join(f'  <link rel="alternate" hreflang="{lg}" href="{SITE}{url(lg,page)}">\n' for lg in ("el","en"))
    return f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="{SITE}{url(lang,page)}">
{alt}  <link rel="alternate" hreflang="x-default" href="{SITE}{url('el',page)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="AR Akron Services">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="{SITE}{url(lang,page)}">
  <meta property="og:image" content="{SITE}/og-image.jpg">
  <meta property="og:locale" content="{t['locale']}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#0b0b0c">
  <link rel="icon" href="/favicon.ico?v=3" sizes="48x48">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=3">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=3">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=3">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Commissioner:wght@300;400;500;600&family=Noto+Serif+Display:ital,wght@0,400;0,500;1,400&display=swap">
  <link rel="stylesheet" href="/assets/site.css?v={V}">
{extra}</head>
<body>
<a class="skip" href="#main">{t['skip']}</a>
'''

def header(t, lang, page):
    items = []
    for key, label in [("home", t["home"])] + t["nav"]:
        cur = ' aria-current="page"' if key == page else ''
        items.append(f'<a href="{url(lang,key)}"{cur}>{label}</a>')
    other = t["other"]
    items.append(f'<a class="lang" href="{url(other,page)}" hreflang="{other}" lang="{other}">{t["other_label"]}</a>')
    items.append(f'<a class="btn btn-gold" href="{url(lang,"contact")}">{t["book"]}</a>')
    return f'''<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="{url(lang,'home')}" aria-label="AR Akron Services">{MARK}<span class="brand-name">AR Akron<small>SERVICES</small></span></a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav">{t['menu']}</button>
    <nav class="nav" id="nav">
      {chr(10).join('      '+i for i in items).strip()}
    </nav>
  </div>
</header>
'''

def footer(t, lang):
    apps = "".join(f'<li><a href="{a["url"]}{UTM}" target="_blank" rel="noopener">{a["name"]}</a></li>' for a in t["apps"])
    pages = "".join(f'<li><a href="{url(lang,k)}">{lbl}</a></li>' for k,lbl in [("home",t["home"])]+t["nav"])
    return f'''<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="brand" href="{url(lang,'home')}" aria-label="AR Akron Services">{MARK}<span class="brand-name">AR Akron<small>SERVICES</small></span></a>
        <p style="margin-top:16px;max-width:34ch">{t['ft_tag']}</p>
        <div class="legal-lines" style="margin-top:18px">
          <p>{t['ft_owner']}</p>
          <p>{t['ft_addr']}</p>
          <p>{t['ft_afm']}: {'EL' if lang=='en' else ''}112492149 &nbsp;|&nbsp; {t['ft_gemi']}: 161479309000</p>
          <p><a href="tel:+306983661460">+30 698 366 1460</a> &nbsp;|&nbsp; <a href="mailto:info@arakronservices.gr">info@arakronservices.gr</a></p>
        </div>
      </div>
      <div><h4>{t['ft_nav']}</h4><ul>{pages}</ul></div>
      <div><h4>{t['ft_apps']}</h4><ul>{apps}</ul></div>
      <div><h4>{t['ft_info']}</h4><ul>
        <li><a href="{url(lang,'privacy')}">{t['ft_privacy']}</a></li>
        <li><button type="button" class="linklike" id="cookie-settings">{t['ft_cookies']}</button></li>
        <li><a href="https://www.facebook.com/arakronservices" target="_blank" rel="noopener">Facebook</a></li>
        <li><a href="https://www.instagram.com/arakronservices/" target="_blank" rel="noopener">Instagram</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom"><span>© 2026 AR Akron Services. {t['ft_rights']}</span><span>arakronservices.gr</span></div>
  </div>
</footer>
<script src="/assets/site.js?v={V}" defer></script>
</body>
</html>
'''

def cta_band(t, lang):
    return f'''<section><div class="wrap"><div class="cta-band reveal">
  <h2>{t['cta_h2']}</h2>
  <p>{t['cta_p']}</p>
  <div class="hero-cta">
    <a class="btn btn-gold" href="{url(lang,'contact')}">{t['book']} {ICON['arrow']}</a>
  </div>
</div></div></section>
'''

def service_cards(t, lang, detailed=False):
    out = []
    for i, s in enumerate(t["services2"]):
        if not detailed:
            out.append(f'<article class="card reveal"><p class="card-num">0{i+1}</p><h3>{s["h"]}</h3><p>{s["short"]}</p>'
                       f'<a class="link" href="{url(lang,"services")}#s{i+1}">{t["srv_link"]} →</a></article>')
            continue
        extra = ""
        if s.get("link") == "tr": extra = f'<a class="link" href="https://tablereserve.gr/{UTM}" target="_blank" rel="noopener">{t["link_tr"]} →</a>'
        if s.get("link") == "gf": extra = f'<a class="link" href="https://gofinanceos.com/{UTM}" target="_blank" rel="noopener">{t["link_gf"]} →</a>'
        lis = "".join(f"<li>{x}</li>" for x in s["items"])
        out.append(f'<article class="card reveal" id="s{i+1}"><p class="card-num">0{i+1}</p><h2 class="card-h">{s["h"]}</h2><p>{s["p"]}</p><ul>{lis}</ul>{extra}</article>')
    return f'<div class="{"grid-2" if detailed else "grid-3"}">' + "\n".join(out) + '</div>'

def stats_band(t):
    return '<div class="stats">' + "".join(f'<div class="stat reveal"><p class="stat-n">{n}</p><p class="stat-l">{l}</p></div>' for n,l in t["stats"]) + '</div>'

LOGO_SLUGS = ["kipos-pandrosou","plaki-meze","albouro","prasini-tenta","ermeion","kitro","thespis","xarama","stasi","ouzeri-alexis","avaton"]
def venues(t):
    items = []
    for slug, name in zip(LOGO_SLUGS, t["venues"]):
        items.append(f'<li><img src="/logos/{slug}.png" alt="{name}" title="{name}" loading="lazy" '
                     f'onerror="this.replaceWith(document.createTextNode(this.alt))"></li>')
    return f'<div class="clients reveal"><p class="eyebrow">{t["venues_eyebrow"]}</p><ul class="client-list">' + "".join(items) + '</ul></div>'

def app_cards(t):
    out=[]
    for a in t["apps"]:
        out.append(f'''<article class="app reveal">
  <a class="app-shot" href="{a['url']}{UTM}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><img src="{a['img']}" alt="" loading="lazy" width="1200" height="750"></a>
  <div class="app-body"><h3>{a['name']}</h3><p class="for">{a['for_']}</p><p class="desc">{a['desc']}</p>
  <a class="link" href="{a['url']}{UTM}" target="_blank" rel="noopener">{a['cta']} →</a></div>
</article>''')
    return '<div class="apps">' + "\n".join(out) + '</div>'

# ------------------------------------------------------------------ σελίδες
def page_home(t, lang):
    ld = {"@context":"https://schema.org","@type":"ProfessionalService","name":"AR Akron Services",
          "url":SITE+"/","image":SITE+"/og-image.jpg","logo":SITE+"/favicon-512.png",
          "description":t["desc_home"],"telephone":"+306983661460","email":"info@arakronservices.gr",
          
          "address":{"@type":"PostalAddress","streetAddress":"Γρίβα Διγενή 2","postalCode":"17342","addressLocality":"Άγιος Δημήτριος","addressRegion":"Αττική","addressCountry":"GR"},
          "areaServed":"GR","sameAs":["https://www.facebook.com/arakronservices","https://www.instagram.com/arakronservices/"]}
    extra = f'  <link rel="preload" as="image" href="/hero-wine.jpg">\n  <script type="application/ld+json">{json.dumps(ld,ensure_ascii=False)}</script>\n'
    aud = "".join(f"<li>{x}</li>" for x in t["audience"])
    steps = "".join(f'<div class="step reveal"><p class="step-num">0{i+1}</p><h3>{h}</h3><p>{p}</p></div>' for i,(h,p) in enumerate(t["steps"]))
    body = f'''<main id="main">
<section class="hero">
  <div class="hero-bg" aria-hidden="true"><div class="hero-media"><video class="hero-video" muted loop playsinline preload="none" poster="/hero-wine.jpg" data-src="/hero-wine.mp4"></video></div></div>
  <div class="wrap hero-inner">
    <p class="eyebrow">{t['hero_eyebrow']}</p>
    <h1>{t['hero_h1']}</h1>
    <p class="lead">{t['hero_lead']}</p>
    <div class="hero-cta">
      <a class="btn btn-gold" href="{url(lang,'contact')}">{t['book']} {ICON['arrow']}</a>
      <a class="btn btn-ghost" href="{url(lang,'services')}">{t['hero_2']}</a>
    </div>
  </div>
</section>
<div class="audience"><div class="wrap"><ul>{aud}</ul></div></div>

<section id="services">
  <div class="wrap">
    <div class="section-head reveal"><p class="eyebrow">{t['srv_eyebrow']}</p><h2 class="h2">{t['srv_h2']}</h2><p class="lead">{t['srv_lead']}</p></div>
    {service_cards(t, lang)}
    <p class="more"><a class="btn btn-ghost" href="{url(lang,'services')}">{t['srv_more']} {ICON['arrow']}</a></p>
  </div>
</section>

<section class="alt">
  <div class="wrap">
    <div class="section-head reveal"><p class="eyebrow">{t['proc_eyebrow']}</p><h2 class="h2">{t['proc_h2']}</h2></div>
    <div class="steps">{steps}</div>
  </div>
</section>

<section id="apps">
  <div class="wrap">
    <div class="section-head reveal"><p class="eyebrow">{t['apps_eyebrow']}</p><h2 class="h2">{t['apps_h2']}</h2><p class="lead">{t['apps_lead']}</p></div>
    {app_cards(t)}
    <p class="more"><a class="btn btn-ghost" href="{url(lang,'apps')}">{t['apps_more']} {ICON['arrow']}</a></p>
  </div>
</section>

<section id="about" class="alt">
  <div class="wrap">
    <div class="section-head reveal"><p class="eyebrow">{t['ab_eyebrow']}</p><h2 class="h2">{t['ab_h2']}</h2><p class="lead">{t['ab_teaser']}</p></div>
    {stats_band(t)}
    <p class="more"><a class="btn btn-ghost" href="{url(lang,'about')}">{t['ab_more']} {ICON['arrow']}</a></p>
    {venues(t)}
  </div>
</section>
{cta_band(t, lang)}
</main>
'''
    return head(t, lang, "home", t["title_home"], t["desc_home"], extra) + header(t, lang, "home") + body + footer(t, lang)

def page_services(t, lang):
    steps = "".join(f'<div class="step reveal"><p class="step-num">0{i+1}</p><h3>{h}</h3><p>{p}</p></div>' for i,(h,p) in enumerate(t["steps"]))
    body = f'''<main id="main">
<div class="page-head"><div class="wrap"><p class="eyebrow">{t['srv_eyebrow']}</p><h1>{t['sp_h1']}</h1><p class="lead">{t['sp_lead']}</p></div></div>
<section><div class="wrap">{service_cards(t, lang, detailed=True)}</div></section>
<section class="alt"><div class="wrap">
  <div class="section-head reveal"><p class="eyebrow">{t['proc_eyebrow']}</p><h2 class="h2">{t['proc_h2']}</h2></div>
  <div class="steps">{steps}</div>
</div></section>
{cta_band(t, lang)}
</main>
'''
    return head(t, lang, "services", t["title_services"], t["desc_services"]) + header(t, lang, "services") + body + footer(t, lang)

def page_apps(t, lang):
    rows=[]
    for a in t["apps"]:
        lis="".join(f"<li>{b}</li>" for b in a["bullets"])
        rows.append(f'''<article class="app-row reveal">
  <a class="app-shot" href="{a['url']}{UTM}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><img src="{a['img']}" alt="" loading="lazy" width="1200" height="750"></a>
  <div><h2>{a['name']}</h2><p class="for">{a['for_']}</p><p class="desc">{a['desc']}</p><ul>{lis}</ul>
  <a class="btn btn-gold" href="{a['url']}{UTM}" target="_blank" rel="noopener">{a['cta']} {ICON['arrow']}</a></div>
</article>''')
    body = f'''<main id="main">
<div class="page-head"><div class="wrap"><p class="eyebrow">{t['apps_eyebrow']}</p><h1>{t['ap_h1']}</h1><p class="lead">{t['apps_lead']}</p></div></div>
<section style="padding-top:40px"><div class="wrap">{''.join(rows)}</div></section>
<section style="padding-top:0"><div class="wrap"><div class="cta-band reveal">
  <h2>{t['demo_h2']}</h2><p>{t['demo_p']}</p>
  <div class="hero-cta"><a class="btn btn-gold" href="{url(lang,'contact')}">{t['demo_btn']} {ICON['arrow']}</a></div>
</div></div></section>
</main>
'''
    return head(t, lang, "apps", t["title_apps"], t["desc_apps"]) + header(t, lang, "apps") + body + footer(t, lang)

def page_contact(t, lang):
    body = f'''<main id="main">
<div class="page-head"><div class="wrap"><p class="eyebrow">{t['nav'][3][1]}</p><h1>{t['cp_h1']}</h1><p class="lead">{t['cp_lead']}</p></div></div>
<section><div class="wrap contact-grid">
  <form class="form" id="contact-form" action="https://api.web3forms.com/submit" method="POST">
    <input type="hidden" name="access_key" value="{W3F_KEY}">
    <input type="hidden" name="subject" value="{t['f_subject']}">
    <input type="hidden" name="from_name" value="arakronservices.gr">
    <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div class="field"><label for="f-name">{t['f_name']}</label><input id="f-name" name="name" required autocomplete="name"></div>
    <div class="field"><label for="f-email">{t['f_email']}</label><input id="f-email" name="email" type="email" required autocomplete="email"></div>
    <div class="field"><label for="f-phone">{t['f_phone']}</label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
    <div class="field"><label for="f-biz">{t['f_biz']}</label><input id="f-biz" name="business" autocomplete="organization"></div>
    <div class="field"><label for="f-msg">{t['f_msg']}</label><textarea id="f-msg" name="message" required></textarea></div>
    <button class="btn btn-gold" type="submit">{t['f_send']}</button>
    <p class="form-status" id="form-status" role="status"></p>
  </form>
  <div class="info">
    <div class="info-item">{ICON['phone']}<div><span>{t['i_phone']}</span><a href="tel:+306983661460">698 366 1460</a></div></div>
    <div class="info-item">{ICON['mail']}<div><span>{t['i_mail']}</span><a href="mailto:info@arakronservices.gr">info@arakronservices.gr</a></div></div>
    <div class="info-item">{ICON['pin']}<div><span>{t['i_addr']}</span><p>{t['ft_addr']}</p></div></div>
    <div class="info-item">{ICON['ig']}<div><span>{t['i_social']}</span><a href="https://www.instagram.com/arakronservices/" target="_blank" rel="noopener">Instagram</a> &nbsp;·&nbsp; <a href="https://www.facebook.com/arakronservices" target="_blank" rel="noopener">Facebook</a></div></div>
  </div>
</div></section>
</main>
'''
    return head(t, lang, "contact", t["title_contact"], t["desc_contact"]) + header(t, lang, "contact") + body + footer(t, lang)

def page_privacy(t, lang):
    parts = "".join(f"<h2>{h}</h2>{b}" for h,b in t["privacy"])
    body = f'''<main id="main">
<div class="page-head"><div class="wrap"><h1>{t['pp_h1']}</h1><p class="lead">{t['pp_updated']}</p></div></div>
<section style="padding-top:30px"><div class="wrap legal">{parts}</div></section>
</main>
'''
    return head(t, lang, "privacy", t["title_privacy"], t["desc_privacy"]) + header(t, lang, "privacy") + body + footer(t, lang)


def page_about(t, lang):
    story = "".join(f"<p>{p}</p>" for p in t["abp_story"])
    hl = "".join(f'<article class="card reveal"><p class="card-num">0{i+1}</p><h3>{h}</h3><p>{p}</p></article>' for i,(h,p) in enumerate(t["highlights"]))
    body = f'''<main id="main">
<div class="page-head"><div class="wrap"><p class="eyebrow">{t['ab_eyebrow']}</p><h1>{t['abp_h1']}</h1><p class="lead">{t['abp_lead']}</p></div></div>
<section><div class="wrap">
  <div class="about">
    <div class="portrait reveal">
      <div class="ph" aria-hidden="true">{MARK.replace('class="brand-mark"','')}</div>
      <img src="/founder.jpg" alt="AR Akron Services" loading="lazy" width="760" height="950" onerror="this.remove()">
    </div>
    <div class="text reveal">{story}</div>
  </div>
  <div style="margin-top:80px">{stats_band(t)}</div>
</div></section>
<section class="alt"><div class="wrap">
  <div class="section-head reveal"><p class="eyebrow">{t['hl_eyebrow']}</p><h2 class="h2">{t['hl_h2']}</h2></div>
  <div class="grid-2">{hl}</div>
  {venues(t)}
</div></section>
{cta_band(t, lang)}
</main>
'''
    return head(t, lang, "about", t["title_about"], t["desc_about"]) + header(t, lang, "about") + body + footer(t, lang)

BUILD = dict(home=page_home, about=page_about, services=page_services, apps=page_apps, contact=page_contact, privacy=page_privacy)
for lang in ("el","en"):
    os.makedirs(os.path.join(ROOT, "en"), exist_ok=True)
    for pg in PAGES:
        with open(fname(lang,pg), "w", encoding="utf-8", newline="\n") as f:
            f.write(BUILD[pg](L[lang], lang))

# redirects για παλιές σελίδες
def redirect(path, target):
    with open(os.path.join(ROOT, path), "w", encoding="utf-8", newline="\n") as f:
        f.write(f'<!DOCTYPE html><html lang="el"><head><meta charset="UTF-8"><meta name="robots" content="noindex">'
                f'<link rel="canonical" href="{SITE}{target}"><meta http-equiv="refresh" content="0; url={target}">'
                f'<title>AR Akron Services</title></head><body><p><a href="{target}">AR Akron Services</a></p></body></html>\n')
redirect("documents.html", "/")

# sitemap
urls = [(url(lg,p), "1.0" if p=="home" else ("0.3" if p=="privacy" else "0.8")) for lg in ("el","en") for p in PAGES]
with open(os.path.join(ROOT,"sitemap.xml"),"w",encoding="utf-8",newline="\n") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for u,pr in urls: f.write(f"  <url><loc>{SITE}{u}</loc><lastmod>2026-09-28</lastmod><priority>{pr}</priority></url>\n")
    f.write("</urlset>\n")
print("OK")
