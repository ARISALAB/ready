# Εγκατάσταση blog με Git Bash

## Τι κατεβάζεις

Από τα file cards της συζήτησης, κατέβασε 4 αρχεία:

| Αρχείο | Πού πάει |
|---|---|
| `index.html` (blog) | στον φάκελο `blog/` |
| `kostologisi-menou-estiatoriou.html` | στον φάκελο `blog/` |
| `blog-css-additions.css` | στο **root** του repo |
| `install-blog.sh` | στο **root** του repo |

---

## Βήμα 1 — Άνοιξε Git Bash στο repo

```bash
cd /c/Users/<χρήστης>/<διαδρομή>/ready
```

Τσέκαρε ότι είσαι στο σωστό σημείο:

```bash
pwd && ls CNAME index.html
```

Πρέπει να δεις τα δύο αρχεία. Αν όχι, είσαι σε λάθος φάκελο.

---

## Βήμα 2 — Τράβα τις τελευταίες αλλαγές

```bash
git pull
```

---

## Βήμα 3 — Βάλε τα αρχεία στη θέση τους

```bash
mkdir -p blog
```

Τώρα σύρε με το ποντίκι (ή αντίγραψε) τα δύο HTML στον `blog/`, και τα `blog-css-additions.css` + `install-blog.sh` στο root.

Επιβεβαίωσε:

```bash
ls blog/ && ls blog-css-additions.css install-blog.sh
```

Πρέπει να δεις και τα τέσσερα.

---

## Βήμα 4 — Τρέξε το script

```bash
bash install-blog.sh
```

Το script κάνει αυτόματα:

- Backup όλου του repo σε `../ready-backup-<ημερομηνία>`
- Προσθέτει το blog CSS στο `assets/site.css`
- Αλλάζει `site.css?v=10` → `v=11` σε όλες τις σελίδες
- Βάζει «Blog» στο μενού και στο footer — **14 σελίδες**, ελληνικά και αγγλικά
- Προσθέτει 2 URLs στο `sitemap.xml`
- Ρυθμίζει clean URLs (netlify.toml ή φακέλους, ανάλογα με το hosting)

Αν το τρέξεις δεύτερη φορά κατά λάθος, δεν χαλάει τίποτα — ανιχνεύει τι έχει ήδη γίνει.

---

## Βήμα 5 — Δες τι άλλαξε

```bash
git status
git diff --stat
```

Για να δεις αναλυτικά μια συγκεκριμένη αλλαγή:

```bash
git diff index.html
```

---

## Βήμα 6 — Δοκίμασε τοπικά πριν ανεβάσεις

```bash
python -m http.server 8000
```

Άνοιξε `http://localhost:8000/blog/` στον browser. Έλεγξε:

- Το blog φορτώνει με το σωστό dark design
- Το άρθρο ανοίγει, οι πίνακες φαίνονται σωστά
- Το «Blog» υπάρχει στο μενού κάθε σελίδας
- Σε στενό παράθυρο οι πίνακες κάνουν scroll, δεν σπάνε

Σταμάτα με `Ctrl+C`.

---

## Βήμα 7 — Ανέβασμα

```bash
git add -A
git commit -m "Προσθήκη blog: δομή + πρώτο άρθρο κοστολόγησης μενού"
git push
```

---

## Βήμα 8 — Πες το στη Google

Μόλις ολοκληρωθεί το deploy (1–2 λεπτά):

1. Google Search Console → **Έλεγχος URL**
2. Επικόλλησε `https://www.arakronservices.gr/blog/`
3. **Αίτημα ευρετηρίασης**
4. Επανάλαβε για `https://www.arakronservices.gr/blog/kostologisi-menou-estiatoriou`

Η Google συνήθως κάνει index σε 1–7 ημέρες.

---

## Αν κάτι πάει στραβά

**Αναίρεση πριν το commit:**

```bash
git checkout -- .
git clean -fd
```

**Αναίρεση μετά το commit (όχι pushed):**

```bash
git reset --hard HEAD~1
```

**Από το backup:**

```bash
cd ..
rm -rf ready/*
cp -r ready-backup-<ημερομηνία>/* ready/
```

---

## Για κάθε επόμενο άρθρο

```bash
cp blog/kostologisi-menou-estiatoriou.html blog/neo-arthro.html
```

Άλλαξε μέσα: `<title>`, meta description, canonical, τα `og:*`, το JSON-LD (headline, datePublished, breadcrumb) και το περιεχόμενο.

Μετά πρόσθεσε το entry στο `blog/index.html` και το URL στο `sitemap.xml`:

```bash
git add -A && git commit -m "Νέο άρθρο: <τίτλος>" && git push
```
