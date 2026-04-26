import { motion } from 'motion/react';

export function CTA() {
  return (
    <section className="cta" id="open">
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9 }}
        >
          <h2>
            Begin a <em>private</em><br />
            ledger today.
          </h2>
          <p>
            Ten minutes to open. No card. No commitment. Bring your spreadsheet —
            we&apos;ll import it.
          </p>
          <div className="actions">
            <a href="#" className="btn">Open an Account <span className="arrow">→</span></a>
            <a href="#" className="btn btn-ghost">Read the Specimen</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
