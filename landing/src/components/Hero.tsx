import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const TARGET = 1_284_637.42;

export function Hero() {
  const value = useCountUp(TARGET, 1600);

  return (
    <section className="hero" id="top">
      <div className="shell hero-grid">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="hero-eyebrow">
            <span className="eyebrow">A Private Ledger</span>
            <span className="dingbat">✦</span>
            <span className="roman">in six chapters</span>
          </div>

          <h1 className="headline">
            Wealth<span className="punct">,</span><br />
            <em>well kept.</em>
          </h1>

          <p className="lede">
            GetDue is the quiet record of your modern fortune — stocks and dividends,
            properties and rents, cash and loans, all bound together with the calendar
            of every payment that comes due. One ledger. Beautifully arranged.
          </p>

          <div className="hero-actions">
            <a href="#open" className="btn">
              Open an Account
              <span className="arrow">→</span>
            </a>
            <a href="#statement" className="btn btn-ghost">View Specimen Statement</a>
          </div>

          <div className="hero-meta">
            <span className="star">✦</span>
            <span>No card required</span>
            <span>·</span>
            <span>Bank-grade encryption</span>
            <span>·</span>
            <span>Multi-currency</span>
          </div>
        </motion.div>

        <motion.aside
          className="dossier"
          initial={{ opacity: 0, y: 30, rotate: -3.5 }}
          animate={{ opacity: 1, y: 0, rotate: -1.4 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.2, 0.7, 0.2, 1] }}
          aria-label="Sample portfolio dossier"
        >
          <div className="dossier-corner" aria-hidden>G</div>

          <div className="dossier-head">
            <div>
              <div className="label">Account No. 0014-A</div>
              <div className="holder">Mr. Henry Whitcomb</div>
            </div>
            <div className="label" style={{ textAlign: 'right' }}>
              Quarterly<br />Dossier
            </div>
          </div>

          <div className="figure-block">
            <div className="figure-label">Total Net Position</div>
            <div className="figure">
              <span className="currency">$</span>
              {value}
            </div>
            <div className="figure-delta">
              <span>▲ 4.62%</span>
              <span style={{ color: 'var(--ink-mute)' }}>vs. last quarter</span>
            </div>
          </div>

          <div className="dossier-rows">
            <Row name="Equities" detail="(28 positions)" num="$ 614,028" delta="+1.8%" up />
            <Row name="Properties" detail="(2 holdings)" num="$ 482,400" delta="+0.3%" up />
            <Row name="Cash" detail="(USD · EUR · GBP)" num="$ 138,209" delta="—" />
            <Row name="Loans" detail="receivable" num="$  74,000" delta="-0.4%" down />
            <Row name="Recurring" detail="next 30 days" num="$ -24,000" delta="paid" />
          </div>

          <div className="dossier-foot">
            <span>Settled · {formatToday()}</span>
            <span>Page i / iv</span>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

function Row({
  name,
  detail,
  num,
  delta,
  up,
  down,
}: {
  name: string;
  detail: string;
  num: string;
  delta: string;
  up?: boolean;
  down?: boolean;
}) {
  return (
    <div className="dossier-row">
      <span className="name">
        {name} <em>{detail}</em>
      </span>
      <span className="num">{num}</span>
      <span className={`delta ${up ? 'up' : down ? 'down' : ''}`}>{delta}</span>
    </div>
  );
}

function formatToday() {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function useCountUp(target: number, durationMs: number) {
  const [val, setVal] = useState('0.00');
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = target * eased;
      setVal(
        current.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      );
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return val;
}
