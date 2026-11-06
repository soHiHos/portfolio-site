import path from 'node:path';
import { Font, renderToBuffer } from '@react-pdf/renderer';
import { EstimateDocument } from '../../components/estimator/estimate-pdf';
import type { Contact, Estimate } from '../../components/estimator/estimate';

// Renders the same estimate PDF as the browser does, for the email attachment. Fonts are read from public/fonts
// (next.config.ts makes sure they are bundled with this route).

let fontsRegistered = false;

export async function estimatePdfBuffer(contact: Contact, e: Estimate, preferBuyout: boolean, today = new Date()): Promise<Buffer> {
  if (!fontsRegistered) {
    const dir = path.join(process.cwd(), 'public', 'fonts');
    Font.register({
      family: 'Inter',
      fonts: [
        { src: path.join(dir, 'Inter-Regular.ttf'), fontWeight: 400 },
        { src: path.join(dir, 'Inter-SemiBold.ttf'), fontWeight: 600 },
      ],
    });
    Font.registerHyphenationCallback((word) => [word]);
    fontsRegistered = true;
  }
  return renderToBuffer(<EstimateDocument contact={contact} e={e} today={today} preferBuyout={preferBuyout} />);
}
