// register-sw.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(() => console.log('Service Worker zaregistrován'))
      .catch((err) => console.error('SW error:', err));
  });
}

