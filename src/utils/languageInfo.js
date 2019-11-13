export function getLanguageInfo(code) {
  switch (code) {
    case 'de':
      return {
        name: 'Deutsch',
        code: code
      };
    case 'en':
      return {
        name: 'English',
        code: code
      };
    case 'en-au':
      return {
        name: 'English (Australia)',
        code: code
      };
    case 'es':
      return {
        name: 'Español',
        code: code
      };
    case 'es-mx':
      return {
        name: 'Español mexicano',
        code: code
      };
    case 'fr':
      return {
        name: 'Français',
        code: code
      };
    case 'it':
      return {
        name: 'Italiano',
        code: code
      };
    case 'ja':
      return {
        name: '日本語',
        code: code
      };
    case 'ko':
      return {
        name: '한국어',
        code: code
      };
    case 'pl':
      return {
        name: 'Polski',
        code: code
      };
    case 'pt-br':
      return {
        name: 'Português Brasileiro',
        code: code
      };
    case 'ru':
      return {
        name: 'Русский',
        code: code
      };
    case 'zh-cht':
      return {
        name: '繁體中文',
        code: code
      };
    case 'zh-chs':
      return {
        name: '简体中文',
        code: code
      };
    default:
      return { code: code };
  }
}
