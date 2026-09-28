/* Φόρμα επικοινωνίας μέσω Web3Forms (δωρεάν, λειτουργεί σε GitHub Pages). */
(function () {
  var M = {
    el: { sending: 'Αποστολή…', ok: 'Ευχαριστούμε! Το μήνυμά σας στάλθηκε, θα σας απαντήσουμε σύντομα.',
          err: 'Το μήνυμα δεν στάλθηκε. Δοκιμάστε ξανά ή γράψτε μας στο info@arakronservices.gr.' },
    en: { sending: 'Sending…', ok: 'Thank you! Your message was sent and we will reply soon.',
          err: 'The message was not sent. Please try again or email info@arakronservices.gr.' },
    es: { sending: 'Enviando…', ok: '¡Gracias! Su mensaje se ha enviado y le responderemos pronto.',
          err: 'El mensaje no se envió. Inténtelo de nuevo o escriba a info@arakronservices.gr.' }
  };
  function lang() {
    try { var l = localStorage.getItem('selectedLanguage'); return M[l] ? l : 'el'; } catch (e) { return 'el'; }
  }

  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var btn = document.getElementById('submit-button');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var m = M[lang()];
    if (form.botcheck && form.botcheck.checked) return;

    status.className = 'form-status';
    status.textContent = m.sending;
    btn.disabled = true;

    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.success) throw new Error(j.message || 'error');
        status.className = 'form-status ok';
        status.textContent = m.ok;
        form.reset();
      })
      .catch(function () {
        status.className = 'form-status err';
        status.textContent = m.err;
      })
      .then(function () { btn.disabled = false; });
  });
})();
