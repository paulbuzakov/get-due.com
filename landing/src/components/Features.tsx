import { motion } from 'motion/react';
import {
  StocksIcon,
  PropertyIcon,
  CashIcon,
  LoanIcon,
  RecurringIcon,
  CalendarIcon,
} from './Ornaments';

const dispatches = [
  {
    num: 'I.',
    icon: StocksIcon,
    title: <>Equities <em>&amp; dividends</em></>,
    body:
      'Lots, splits, dividends and unrealised gains — recorded in the manner of a brokerage of the old school. Currency conversion handled silently in the margin.',
    tag: 'Lots · DRIP · Cost basis',
  },
  {
    num: 'II.',
    icon: PropertyIcon,
    title: <>Properties <em>&amp; rents</em></>,
    body:
      'Each holding maintained as a small dossier of its own — purchase, mortgage, rents received, expenses incurred, and the slow appreciation of land.',
    tag: 'Mortgage · Rent roll · Yield',
  },
  {
    num: 'III.',
    icon: CashIcon,
    title: <>Cash <em>across borders</em></>,
    body:
      'Multi-currency accounts kept on parallel rails. Daily FX captured on the day it occurred, never reconstructed after the fact.',
    tag: 'USD · EUR · GBP · 30 more',
  },
  {
    num: 'IV.',
    icon: LoanIcon,
    title: <>Loans <em>given &amp; owed</em></>,
    body:
      'Money lent to a friend, money borrowed from the bank — both find their place in the ledger. Amortisation calculated to the cent.',
    tag: 'Schedules · Interest · Balloons',
  },
  {
    num: 'V.',
    icon: RecurringIcon,
    title: <>Recurring <em>obligations</em></>,
    body:
      'The subscriptions, the salaries, the standing orders. Rules in plain language — the second Tuesday, the last day of the month, every quarter ending.',
    tag: 'Cron-grade scheduling',
  },
  {
    num: 'VI.',
    icon: CalendarIcon,
    title: <>The calendar <em>of capital</em></>,
    body:
      'Every dividend ex-date, every rent collection, every coupon. Months ahead — never a payment forgotten, never a deadline missed.',
    tag: 'iCal · Reminders · Forecasts',
  },
];

export function Features() {
  return (
    <section className="section" id="dispatches">
      <div className="shell">
        <div className="section-head">
          <span className="num">§</span>
          <h2 className="title">
            Dispatches from <em>the ledger.</em>
          </h2>
          <span className="meta">Six chapters · twenty-eight tools · one record</span>
        </div>

        <div className="dispatches">
          {dispatches.map((d, i) => {
            const Icon = d.icon;
            return (
              <motion.article
                key={i}
                className="dispatch"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <Icon className="dispatch-icon" />
                <span className="dispatch-num">{d.num}</span>
                <h3>{d.title}</h3>
                <p>{d.body}</p>
                <span className="dispatch-tag">
                  <span>{d.tag}</span>
                  <span className="pip">✦</span>
                </span>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
