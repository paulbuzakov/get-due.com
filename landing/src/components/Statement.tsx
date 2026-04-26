import { motion } from 'motion/react';

const rows = [
  { name: 'Equities', detail: '28 lots · 14 issuers', basis: '412,118.20', value: '614,028.74', delta: '+48.96%', dir: 'up' as const },
  { name: 'Properties', detail: '2 holdings · Brooklyn · Lisboa', basis: '380,000.00', value: '482,400.00', delta: '+26.95%', dir: 'up' as const },
  { name: 'Cash & equivalents', detail: 'USD · EUR · GBP', basis: '138,209.41', value: '138,209.41', delta: '—', dir: 'flat' as const },
  { name: 'Loans receivable', detail: '1 promissory note', basis:  '80,000.00', value:  '74,000.00', delta:  '-7.50%', dir: 'down' as const },
  { name: 'Recurring (forecast)', detail: 'next 30 days', basis:       '—', value: '-24,000.27', delta:    'paid', dir: 'flat' as const },
];

export function Statement() {
  return (
    <section className="section alt" id="statement">
      <div className="shell statement-wrap">
        <motion.div
          className="statement-copy"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <span className="eyebrow">Specimen Statement</span>
          <h2>
            Every page is a <em>record</em>—<br />
            every figure, accounted for.
          </h2>
          <p>
            GetDue prints a single, legible statement of your affairs. Cost basis on the
            left, current value on the right, every position individually attested.
            Print it. Sign it. Hand it to your accountant in November.
          </p>
          <ul>
            <li><span className="marker">i.</span><span>Daily snapshot — one row per holding, never reconstructed.</span></li>
            <li><span className="marker">ii.</span><span>FX captured on the day, in the currency it occurred.</span></li>
            <li><span className="marker">iii.</span><span>Audit trail on every entry — who changed what, when.</span></li>
            <li><span className="marker">iv.</span><span>Export to PDF, CSV, OFX or your accountant&apos;s preferred dialect.</span></li>
          </ul>
        </motion.div>

        <motion.div
          className="statement"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="statement-head">
            <div>
              <div className="title">
                Statement <em>of Affairs</em>
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginTop: 4 }}>
                Account 0014-A · H. Whitcomb
              </div>
            </div>
            <div className="period">
              Q1 MMXXVI<br />01 Jan — 31 Mar
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Holding</th>
                <th className="right">Cost basis</th>
                <th className="right">Value</th>
                <th className="right">Δ</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>
                    <span className="name">
                      {r.name} <em>· {r.detail}</em>
                    </span>
                  </td>
                  <td className="right">{r.basis}</td>
                  <td className="right">{r.value}</td>
                  <td className={`right ${r.dir}`}>{r.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="statement-total">
            <span className="label">Net Position · USD</span>
            <span className="value">
              <span className="ccy">$</span>1,284,637.42
            </span>
          </div>

          <div className="statement-foot">
            <div>
              <div className="signature">H. Whitcomb</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginTop: 6 }}>
                Holder of record
              </div>
            </div>
            <div className="cert">
              Certified true &amp; complete on this day, the 26ᵗʰ of April, MMXXVI.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
