export default function MapEmbed() {
  return (
    <div>
      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0117506736186!2d77.63955!3d12.97893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16b23e0fd7bf%3A0x1d8e9a694f9bab32!2s17th%20Main%20Rd%2C%20Indiranagar%2C%20Bengaluru%2C%20Karnataka%20560038!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%"
          height="480"
          style={{ border: 0, display: 'block' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Silverring Ventures Office Location"
        />
      </div>

      {/* Office info below map */}
      <div style={{
        background: 'var(--deep)',
        padding: '60px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1,
        borderTop: '0.5px solid var(--faint)',
      }}>
        {[
          {
            label: 'OFFICE HOURS',
            lines: ['Monday – Friday', '9:00 AM – 6:00 PM IST', 'Saturday by appointment'],
          },
          {
            label: 'RESPONSE TIME',
            lines: ['Email: within 24 hours', 'WhatsApp: within 2 hours', 'Phone: direct line'],
          },
          {
            label: 'GET HERE',
            lines: ['Nearest metro: Indiranagar', 'CMH Road, 5 min walk', 'Ample parking available'],
          },
        ].map((col) => (
          <div key={col.label} style={{ padding: '0 40px' }}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: 16,
            }}>
              {col.label}
            </div>
            {col.lines.map((line, i) => (
              <div key={i} style={{
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                fontSize: 14,
                lineHeight: 1.9,
                color: 'var(--muted)',
              }}>
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
