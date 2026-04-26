export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              Get<em>d</em>ue
            </div>
            <p className="footer-tag">
              A private ledger for the diligent investor — set in Fraunces &amp; JetBrains Mono,
              printed on no paper at all.
            </p>
          </div>

          <div className="footer-col">
            <h4>The Ledger</h4>
            <ul>
              <li><a href="#">Equities</a></li>
              <li><a href="#">Properties</a></li>
              <li><a href="#">Cash &amp; FX</a></li>
              <li><a href="#">Loans</a></li>
              <li><a href="#">Recurring</a></li>
              <li><a href="#">Calendar</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>The House</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Specimen statement</a></li>
              <li><a href="#">Changelog</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>The Fine Print</h4>
            <ul>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">Status</a></li>
              <li><a href="mailto:hello@getdue.com">hello@getdue.com</a></li>
            </ul>
          </div>
        </div>

        <div className="colophon-note">
          <span>© MMXXVI · GetDue &amp; Co.</span>
          <span className="pip">✦ Set in Fraunces · JetBrains Mono ✦</span>
          <span>Volume I · No. 01</span>
        </div>
      </div>
    </footer>
  );
}
