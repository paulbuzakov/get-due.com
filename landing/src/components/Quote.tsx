import { motion } from 'motion/react';
import { Fleuron } from './Ornaments';

export function Quote() {
  return (
    <section className="section">
      <div className="shell pullquote">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.9 }}
        >
          <Fleuron className="fleuron" />
          <blockquote>
            <span className="mark">“</span>The first ledger I&apos;ve kept that makes
            me want to read what I own.<span className="mark">”</span>
          </blockquote>
          <cite>— Eleanor M., Family Office · NYC</cite>
        </motion.div>
      </div>
    </section>
  );
}
