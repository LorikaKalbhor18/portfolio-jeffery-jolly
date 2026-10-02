;(function () {
  try {
    var stored = localStorage.getItem('theme')
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    var isDark = stored ? stored === 'dark' : prefersDark
    if (isDark) document.documentElement.classList.add('dark')
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  } catch (_) {}
})()
