import { ScrollViewStyleReset } from 'expo-router/html';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* SEO Meta Tags */}
        <meta name="description" content="HushRyd - Your pick of rides at low prices. Travel across AP & Telangana by carpool or bus." />
        <meta name="keywords" content="rideshare, carpool, bus, travel, Andhra Pradesh, Telangana, Hyderabad, Vijayawada" />
        <meta name="author" content="HushRyd" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="HushRyd - Travel Made Simple" />
        <meta property="og:description" content="Your pick of rides at low prices. Travel across AP & Telangana by carpool or bus." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/icon.png" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="HushRyd - Travel Made Simple" />
        <meta name="twitter:description" content="Your pick of rides at low prices. Travel across AP & Telangana by carpool or bus." />
        <meta name="twitter:image" content="/icon.png" />

        {/* 
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native. 
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Using raw CSS styles as an escape-hatch to ensure the background color never flickers in dark-mode. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #fff;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}`;
