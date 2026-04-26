const items: Array<{ sym: string; px: string; delta: string; dir: 'up' | 'down' | 'flat' }> = [
  { sym: 'AAPL',  px: '232.41', delta: '+1.24%', dir: 'up' },
  { sym: 'MSFT',  px: '441.78', delta: '+0.62%', dir: 'up' },
  { sym: 'GOOGL', px: '189.04', delta: '-0.31%', dir: 'down' },
  { sym: 'BRK.B', px: '478.20', delta: '+0.18%', dir: 'up' },
  { sym: 'NVDA',  px: '142.66', delta: '+2.81%', dir: 'up' },
  { sym: 'TSLA',  px: '258.93', delta: '-1.42%', dir: 'down' },
  { sym: 'JPM',   px: '218.55', delta: '+0.44%', dir: 'up' },
  { sym: 'VTI',   px: '281.07', delta: '+0.21%', dir: 'up' },
  { sym: 'XOM',   px: '116.34', delta: '-0.08%', dir: 'down' },
  { sym: 'GLD',   px: '241.92', delta: '+0.74%', dir: 'up' },
  { sym: 'BND',   px: ' 73.18', delta: '—',      dir: 'flat' },
  { sym: 'EUR/USD', px: '1.0824', delta: '-0.12%', dir: 'down' },
  { sym: 'BTC',   px: '64,210', delta: '+1.06%', dir: 'up' },
  { sym: 'CASH·HYS', px: '4.55%', delta: 'APY', dir: 'flat' },
];

export function Ticker() {
  const doubled = [...items, ...items];
  return (
    <div className="ticker" aria-hidden>
      <div className="ticker-track">
        {doubled.map((it, i) => (
          <span key={i} className="ticker-item">
            <span className="sym">{it.sym}</span>
            <span className="px">{it.px}</span>
            <span className={it.dir}>{it.delta}</span>
            <span className="div">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
