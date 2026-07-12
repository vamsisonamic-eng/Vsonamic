import './globals.css';

export const metadata = {
  title: 'The Ad-Tech Amusement Park — programmatic & retail media, explained by scrolling',
  description:
    'A 3D ride down the digital supply chain: why old billboards guess, how the 100-millisecond ad auction works, and why retail media networks are the new gold mine.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
