const { description } = require('../../package')
const extendsNetworks = {
  pinterest: {
    sharer: 'https://pinterest.com/pin/create/button/?url=@url&media=@media&description=@title',
    type: 'popup',
    icon: '/pinterest.png',
  },
  linkedin: {
    sharer:
      'https://www.linkedin.com/shareArticle?mini=true&url=@url&title=@title&summary=@description',
    type: 'popup',
    color: '#1786b1',
    icon:
      '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M910.336 0H113.664A114.005333 114.005333 0 0 0 0 113.664v796.672A114.005333 114.005333 0 0 0 113.664 1024h796.672A114.005333 114.005333 0 0 0 1024 910.336V113.664A114.005333 114.005333 0 0 0 910.336 0zM352.256 796.330667H207.189333V375.466667h145.066667z m-72.021333-477.866667a77.824 77.824 0 0 1-81.237334-74.069333A77.824 77.824 0 0 1 280.234667 170.666667a77.824 77.824 0 0 1 81.237333 73.728 77.824 77.824 0 0 1-81.237333 73.386666z m582.314666 477.866667H716.8v-227.669334c0-46.762667-18.432-93.525333-73.045333-93.525333a84.992 84.992 0 0 0-81.237334 94.549333v226.304h-140.629333V375.466667h141.653333v60.757333a155.989333 155.989333 0 0 1 136.533334-71.338667c60.416 0 163.498667 30.378667 163.498666 194.901334z" /></svg>',
  },
}

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Asdraban\'s Open Source Blog',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['link', { rel:"apple-touch-icon", type:"image/png", sizes: "180x180", href:"/favicon/apple-touch-icon.png"}],
    ['link', { rel:"icon", type:"image/png", sizes: "32x32", href:"/favicon/favicon-32x32.png"}],
    ['link', { rel:"icon", type:"image/png", sizes: "16x16", href:"/favicon/favicon-16x16.png"}],
    ['link', { rel:"manifest", href:"/favicon/site.webmanifest"}],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],

  ],
  markdown: {
    lineNumbers: true
  },

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Blog',
        link: '/blog/',
      },
      {
        text: 'VuePress',
        link: 'https://v1.vuepress.vuejs.org'
      }
    ],
    sidebar: {
      '/blog/': [
        {
          title: 'Guide',
          collapsable: false,
          children: [
            '',
            '8-bitcoin-big-num',
            '7-bitcoin-first-commit',
            '6-json-viewer-chrome-extension-1',
            '5-react-php',
            '4-fixing-blog-google-analytics',
            '3-keep-your-backend-secure',
            '2-memoizing',
            '1-require-json-file',

          ]
        }
      ],
    },
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    [
    'sitemap', {
      hostname: 'https://massimonicolardi.it'
    }],
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    ['@vuepress/google-analytics',
      {
        'ga': 'UA-219142670-1' 
      }
    ],
    'social-share',
    {
      networks: [ 'linkedin',
      'facebook',
      'twitter',
      'reddit',
      'whatsapp',
      'telegram'],
      email: 'nicolardi.massimo@gmail.com',
      twitterUser: 'Nicolardi',
      fallbackImage: 'social-share.png',
      isPlain: true,
      extendsNetworks
     
    },
  ]
}
