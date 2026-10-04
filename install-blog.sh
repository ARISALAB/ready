#!/bin/bash
# ============================================================
#  install-blog.sh — Εγκατάσταση blog στο arakronservices.gr
#  Τρέξε το από το root του repo ARISALAB/ready
#  Χρήση:  bash install-blog.sh
# ============================================================

set -e

GREEN='\033[0;32m'; YEL='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok(){ echo -e "${GREEN}✔${NC} $1"; }
info(){ echo -e "${YEL}→${NC} $1"; }
err(){ echo -e "${RED}✖${NC} $1"; }

echo ""
echo "=============================================="
echo "  Εγκατάσταση blog — AR Akron Services"
echo "=============================================="
echo ""

# ---------- 0. Έλεγχοι ----------
if [ ! -f "index.html" ] || [ ! -f "CNAME" ]; then
  err "Δεν βρίσκομαι στο root του repo 'ready'."
  err "Κάνε πρώτα: cd /διαδρομή/προς/ready"
  exit 1
fi

if [ ! -f "blog/index.html" ] || [ ! -f "blog/kostologisi-menou-estiatoriou.html" ]; then
  err "Δεν βρέθηκε ο φάκελος blog/ με τα αρχεία."
  err "Αντίγραψε πρώτα blog/index.html και blog/kostologisi-menou-estiatoriou.html"
  exit 1
fi

if [ ! -f "blog-css-additions.css" ]; then
  err "Δεν βρέθηκε το blog-css-additions.css στο root."
  exit 1
fi

ok "Βρίσκομαι στο σωστό repo"

# ---------- 1. Backup ----------
BK="../ready-backup-$(date +%Y%m%d-%H%M%S)"
cp -r . "$BK"
ok "Backup: $BK"

# ---------- 2. CSS ----------
if grep -q "BLOG — προσθήκη" assets/site.css; then
  info "Το blog CSS υπάρχει ήδη, παραλείπεται"
else
  printf '\n' >> assets/site.css
  cat blog-css-additions.css >> assets/site.css
  ok "Προστέθηκε blog CSS στο assets/site.css"
fi

# ---------- 3. Cache busting ----------
sed -i 's|site\.css?v=10|site.css?v=11|g' *.html en/*.html
ok "CSS version → v=11"

# ---------- 4. Μενού: GREEK ----------
GRNAV=0
for f in index.html services.html apps.html about.html faq.html contact.html privacy.html; do
  [ -f "$f" ] || continue
  grep -q '<a href="/blog/">Blog</a>' "$f" && continue

  if grep -q '<a href="/apps" aria-current="page">Εφαρμογές</a>' "$f"; then
    sed -i 's|\(      <a href="/apps" aria-current="page">Εφαρμογές</a>\)|\1\n      <a href="/blog/">Blog</a>|' "$f"
  else
    sed -i 's|\(      <a href="/apps">Εφαρμογές</a>\)|\1\n      <a href="/blog/">Blog</a>|' "$f"
  fi
  GRNAV=$((GRNAV+1))
done
ok "Μενού GR: $GRNAV σελίδες"

# ---------- 5. Μενού: ENGLISH ----------
ENNAV=0
for f in en/*.html; do
  [ -f "$f" ] || continue
  grep -q '<a href="/blog/">Blog</a>' "$f" && continue

  if grep -q '<a href="/en/apps" aria-current="page">Apps</a>' "$f"; then
    sed -i 's|\(      <a href="/en/apps" aria-current="page">Apps</a>\)|\1\n      <a href="/blog/">Blog</a>|' "$f"
  else
    sed -i 's|\(      <a href="/en/apps">Apps</a>\)|\1\n      <a href="/blog/">Blog</a>|' "$f"
  fi
  ENNAV=$((ENNAV+1))
done
ok "Μενού EN: $ENNAV σελίδες"

# ---------- 6. Footer ----------
FTR=0
for f in *.html; do
  [ -f "$f" ] || continue
  grep -q '<li><a href="/blog/">Blog</a></li>' "$f" && continue
  grep -q '<li><a href="/apps">Εφαρμογές</a></li>' "$f" || continue
  sed -i 's|<li><a href="/apps">Εφαρμογές</a></li>|<li><a href="/apps">Εφαρμογές</a></li><li><a href="/blog/">Blog</a></li>|g' "$f"
  FTR=$((FTR+1))
done
for f in en/*.html; do
  [ -f "$f" ] || continue
  grep -q '<li><a href="/blog/">Blog</a></li>' "$f" && continue
  grep -q '<li><a href="/en/apps">Apps</a></li>' "$f" || continue
  sed -i 's|<li><a href="/en/apps">Apps</a></li>|<li><a href="/en/apps">Apps</a></li><li><a href="/blog/">Blog</a></li>|g' "$f"
  FTR=$((FTR+1))
done
ok "Footer: $FTR σελίδες"

# ---------- 7. Sitemap ----------
if grep -q "/blog/" sitemap.xml; then
  info "Το sitemap έχει ήδη blog entries"
else
  TODAY=$(date +%Y-%m-%d)
  sed -i "s|</urlset>|  <url><loc>https://www.arakronservices.gr/blog/</loc><lastmod>${TODAY}</lastmod><priority>0.9</priority></url>\n  <url><loc>https://www.arakronservices.gr/blog/kostologisi-menou-estiatoriou</loc><lastmod>${TODAY}</lastmod><priority>0.8</priority></url>\n</urlset>|" sitemap.xml
  ok "Sitemap: +2 URLs"
fi

# ---------- 8. Clean URLs ----------
if [ -d "_build" ] || [ -f "netlify.toml" ]; then
  if [ ! -f "netlify.toml" ]; then
    cat > netlify.toml <<'TOML'
[[redirects]]
  from = "/blog/:slug"
  to = "/blog/:slug.html"
  status = 200
TOML
    ok "Δημιουργήθηκε netlify.toml για clean URLs"
  else
    if grep -q "blog/:slug" netlify.toml; then
      info "Το netlify.toml έχει ήδη blog redirect"
    else
      cat >> netlify.toml <<'TOML'

[[redirects]]
  from = "/blog/:slug"
  to = "/blog/:slug.html"
  status = 200
TOML
      ok "Προστέθηκε blog redirect στο netlify.toml"
    fi
  fi
else
  info "GitHub Pages: μετατροπή σε φακέλους για clean URLs"
  mkdir -p blog/kostologisi-menou-estiatoriou
  mv blog/kostologisi-menou-estiatoriou.html blog/kostologisi-menou-estiatoriou/index.html
  ok "blog/kostologisi-menou-estiatoriou/index.html"
fi

# ---------- 9. Καθαρισμός ----------
rm -f blog-css-additions.css
ok "Αφαιρέθηκε το προσωρινό blog-css-additions.css"

# ---------- 10. Έλεγχος ----------
echo ""
echo "=============================================="
echo "  ΕΛΕΓΧΟΣ"
echo "=============================================="
echo -n "Blog στο μενού:    "; grep -l '<a href="/blog/">Blog</a>' *.html en/*.html 2>/dev/null | wc -l | tr -d ' '; 
echo -n "CSS v=11:          "; grep -l 'site.css?v=11' *.html en/*.html 2>/dev/null | wc -l | tr -d ' '
echo -n "Blog CSS γραμμές:  "; grep -c "" assets/site.css
echo -n "Sitemap URLs:      "; grep -c "<url>" sitemap.xml

echo ""
echo "=============================================="
echo "  ΕΠΟΜΕΝΑ ΒΗΜΑΤΑ"
echo "=============================================="
echo ""
echo "  1. Δες τις αλλαγές:"
echo "     git diff --stat"
echo ""
echo "  2. Αν όλα καλά:"
echo "     git add -A"
echo "     git commit -m \"Προσθήκη blog: δομή + πρώτο άρθρο κοστολόγησης\""
echo "     git push"
echo ""
echo "  3. Μετά το deploy, στο Search Console:"
echo "     Έλεγχος URL → /blog/ → Αίτημα ευρετηρίασης"
echo ""
echo "  Backup σε: $BK"
echo "  Αναίρεση:  rm -rf * && cp -r $BK/* ."
echo ""
