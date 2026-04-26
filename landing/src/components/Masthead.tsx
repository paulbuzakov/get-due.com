export function Masthead() {
  return (
    <header className="masthead">
      <div className="shell">
        <div className="masthead-inner">
          <div className="colophon-left">
            <span>Vol. I</span>
            <span className="pip">✦</span>
            <span>No. 01</span>
          </div>
          <a href="#top" className="brand" aria-label="GetDue">
            Get<span className="amp">d</span>ue
          </a>
          <div className="colophon-right">
            <span>Est. MMXXVI</span>
            <span className="pip">✦</span>
            <span>{formatDate()}</span>
          </div>
        </div>
      </div>
      <nav className="nav">
        <div className="shell nav-inner">
          <a href="#dispatches">Dispatches</a>
          <a href="#statement">Statement</a>
          <a href="#rates">Rates</a>
          <a href="#archive">Archive</a>
          <a href="#login">Login</a>
          <a href="#open" className="cta">Open an Account →</a>
        </div>
      </nav>
    </header>
  );
}

function formatDate() {
  const d = new Date();
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
}
