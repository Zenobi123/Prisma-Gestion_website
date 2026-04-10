
export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export class AnalyticsService {
  private static isInitialized = false;

  static initialize(trackingId?: string): void {
    if (this.isInitialized || !trackingId) return;

    // Google Analytics 4 initialization
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', {
        page_title: document.title,
        page_location: window.location.href
      });
    `;
    document.head.appendChild(script2);

    this.isInitialized = true;
  }

  static trackEvent(event: AnalyticsEvent): void {
    if (!this.isInitialized || typeof window === 'undefined') return;

    // @ts-ignore
    if (window.gtag) {
      // @ts-ignore
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    }
  }

  static trackPageView(path: string, title?: string): void {
    if (!this.isInitialized || typeof window === 'undefined') return;

    // @ts-ignore
    if (window.gtag) {
      // @ts-ignore
      window.gtag('config', 'GA_TRACKING_ID', {
        page_path: path,
        page_title: title || document.title
      });
    }
  }

  static trackConversion(conversionId: string, value?: number): void {
    this.trackEvent({
      event: 'conversion',
      category: 'engagement',
      action: 'conversion',
      label: conversionId,
      value
    });
  }
}
