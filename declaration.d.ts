declare module '*.scss' {
  const content: Record<string, string>;
  declare global {
    interface Window {
      TranslateInit: () => void;
      google: {
        translate: any;
      };
    }
  }
  export default content;
}
