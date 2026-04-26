import { motion } from 'motion/react';

const tiers = [
  {
    name: <>Apprentice</>,
    price: '0',
    per: '/ forever',
    blurb: 'For the new investor with one or two positions and an honest curiosity.',
    features: [
      'Up to 10 holdings',
      'One currency',
      'Stocks & cash modules',
      'Monthly statement (PDF)',
    ],
    cta: 'Begin',
  },
  {
    name: <>Steward <em>·</em> Standard</>,
    price: '12',
    per: '/ month',
    blurb: 'The full ledger — every module, every currency, every report.',
    features: [
      'Unlimited holdings',
      'All six modules',
      'Multi-currency, daily FX',
      'Recurring scheduler',
      'Calendar exports (iCal)',
      'Email & SMS notices',
    ],
    cta: 'Open an account',
    featured: true,
    stamp: 'Recommended',
  },
  {
    name: <>Trustee</>,
    price: '49',
    per: '/ month',
    blurb: 'For families and small offices with multiple holders, accountants, and an audit trail to keep.',
    features: [
      'Up to 5 account holders',
      'Roles & permissions',
      'Accountant access',
      'API & webhooks',
      'White-glove onboarding',
    ],
    cta: 'Speak to us',
  },
];

export function Pricing() {
  return (
    <section className="section alt" id="rates">
      <div className="shell">
        <div className="section-head">
          <span className="num">¶</span>
          <h2 className="title">
            The <em>rate card.</em>
          </h2>
          <span className="meta">No surcharges · cancel anytime · paid in clean coin</span>
        </div>

        <div className="rates">
          {tiers.map((t, i) => (
            <motion.div
              key={i}
              className={`rate ${t.featured ? 'featured' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              {t.stamp && <span className="rate-stamp">{t.stamp}</span>}
              <div className="rate-name">{t.name}</div>
              <div className="rate-price">
                <span className="ccy">$</span>{t.price}
                <span className="per">{t.per}</span>
              </div>
              <p>{t.blurb}</p>
              <ul>
                {t.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <a href="#open" className="btn rate-cta">
                {t.cta} <span className="arrow">→</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
