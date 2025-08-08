// src/jquery.magnific-popup.d.ts
declare module 'jquery' {
    interface JQuery<TElement = HTMLElement> {
        magnificPopup(options?: any): JQuery<TElement>;
    }
}