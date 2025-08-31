// Simple i18n loader: loads a JSON file and replaces elements with data-i18n keys.
(function(){
  let currentLang = 'en';
  
  // Inline fallback data removed, now using separate JSON files
  
  async function loadLocale(locale){
    console.log('Loading locale:', locale);
    
    try {
      // First, try to find an inline JSON script with the requested locale
      const inline = document.querySelector(`script[type="application/json"][data-i18n-lang="${locale}"]`) || document.getElementById('i18n-inline');
      if(inline && inline.textContent.trim()){
        try{
          const data = JSON.parse(inline.textContent);
          applyLocale(data);
          currentLang = locale;
          updateLanguageButtons();
          document.documentElement.setAttribute('lang', locale);
          console.log('Loaded from inline script');
          return;
        }catch(e){
          console.warn('Failed to parse inline i18n JSON', e);
        }
      }
      
      // Try to load the locale JSON
      try {
        const data = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', `assets/i18n/${locale}.json`);
          xhr.onload = () => {
            if (xhr.status === 200) {
              try {
                const data = JSON.parse(xhr.responseText);
                resolve(data);
              } catch (e) {
                reject(e);
              }
            } else {
              reject(new Error('XHR status ' + xhr.status));
            }
          };
          xhr.onerror = () => reject(new Error('XHR error'));
          xhr.send();
        });
        applyLocale(data);
        currentLang = locale;
        updateLanguageButtons();
        document.documentElement.setAttribute('lang', locale);
        console.log('Loaded from external file');
        return;
      } catch (loadError) {
        console.warn('Load failed:', loadError);
      }
      
      throw new Error('No data available for locale: ' + locale);
      
    }catch(err){
      console.warn('i18n load failed completely, falling back to English:', err);
      if(locale !== 'en') {
        loadLocale('en');
      }
    }
  }

  function applyLocale(obj, prefix=''){
    console.log('Applying locale with prefix:', prefix);
    for(const key in obj){
      const val = obj[key];
      const path = prefix ? `${prefix}.${key}` : key;
      if(typeof val === 'object'){
  applyLocale(val, path);
        continue;
      }
      // Replace text for elements with matching data-i18n
      const els = document.querySelectorAll(`[data-i18n="${path}"]`);
      els.forEach(el=>{
        const rendered = val.replace('{year}', new Date().getFullYear());
        if(el.tagName === 'IMG'){
          el.alt = rendered;
        } else if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'){
          el.placeholder = rendered;
        } else {
          el.innerHTML = rendered;
        }
      });
    }
  }

  function updateLanguageButtons(){
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
  }

  // Global function for language switching
  window.switchLanguage = function(lang) {
    console.log('Switching to language:', lang);
    loadLocale(lang);
    // Update URL without reloading page
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
  };

  // Auto-detect language (basic): url param `lang` or browser lang fallback
  const url = new URL(window.location.href);
  const lang = url.searchParams.get('lang') || navigator.language.split('-')[0] || 'en';
  console.log('Initial language detected:', lang);
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      loadLocale(lang).catch(()=>loadLocale('en'));
    });
  } else {
    loadLocale(lang).catch(()=>loadLocale('en'));
  }
})();
