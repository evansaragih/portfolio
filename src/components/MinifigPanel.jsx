const EXPRESSIONS = [
  { key: 'happy',     emoji: '😊' },
  { key: 'surprised', emoji: '😮' },
  { key: 'cool',      emoji: '😎' },
  { key: 'wink',      emoji: '😉' },
];

const TORSO_COLORS = [
  { color: '#1e3a5f', label: 'Navy hoodie' },
  { color: '#c0392b', label: 'Red jacket' },
  { color: '#1a6b3c', label: 'Green' },
  { color: '#e67e22', label: 'Orange' },
  { color: '#6c3483', label: 'Purple' },
];

const PANTS_COLORS = [
  { color: '#2d3748', label: 'Dark grey' },
  { color: '#4a5568', label: 'Grey' },
  { color: '#1e3a5f', label: 'Navy' },
  { color: '#7b4a2d', label: 'Brown' },
];

const HAIR_COLORS = [
  { color: '#1a1a1a', label: 'Black' },
  { color: '#8b4513', label: 'Brown' },
  { color: '#d4a017', label: 'Blonde' },
  { color: '#cc4444', label: 'Red' },
];

const HAIR_STYLES = [
  { key: 'wavy',  label: '〜' },
  { key: 'spiky', label: '⚡' },
  { key: 'flat',  label: '—' },
];

const glassStyle = {
  position: 'absolute',
  bottom: 24,
  right: 24,
  zIndex: 30,
  background: 'rgba(255,255,255,0.45)',
  backdropFilter: 'blur(22px)',
  WebkitBackdropFilter: 'blur(22px)',
  border: '1px solid rgba(255,255,255,0.65)',
  borderRadius: 20,
  padding: '16px 18px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
  minWidth: 210,
  userSelect: 'none',
  fontFamily: 'Inter, sans-serif',
};

const labelStyle = {
  fontSize: '0.68rem',
  color: '#9CA3AF',
  marginBottom: 6,
  marginTop: 10,
  display: 'block',
};

export default function MinifigPanel({ state, onChange }) {
  const set = (key, val) => onChange({ ...state, [key]: val });

  return (
    <div style={glassStyle}>
      <p style={{
        fontFamily: 'Satoshi, sans-serif',
        fontSize: '0.68rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: '#6B7280',
        textTransform: 'uppercase',
        marginBottom: 12,
      }}>
        Customise Lego
      </p>

      {/* Expression */}
      <span style={labelStyle}>Expression</span>
      <div style={{ display: 'flex', gap: 5, marginBottom: 2 }}>
        {EXPRESSIONS.map(({ key, emoji }) => (
          <button
            key={key}
            title={key}
            onClick={() => set('expression', key)}
            style={{
              width: 36, height: 36,
              borderRadius: 10,
              border: state.expression === key ? '2px solid #17242a' : '2px solid transparent',
              background: state.expression === key ? '#17242a' : 'rgba(0,0,0,0.07)',
              fontSize: '1.05rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Clothes */}
      <span style={labelStyle}>Clothes</span>
      <div style={{ display: 'flex', gap: 5, marginBottom: 2 }}>
        {TORSO_COLORS.map(({ color, label }) => (
          <button
            key={color}
            title={label}
            onClick={() => set('torsoColor', color)}
            style={{
              width: 26, height: 26,
              borderRadius: 7,
              background: color,
              border: state.torsoColor === color ? '2.5px solid #17242a' : '2.5px solid rgba(0,0,0,0.1)',
              outline: state.torsoColor === color ? '1.5px solid #fff' : 'none',
              outlineOffset: '-4px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          />
        ))}
      </div>

      {/* Pants */}
      <span style={labelStyle}>Pants</span>
      <div style={{ display: 'flex', gap: 5, marginBottom: 2 }}>
        {PANTS_COLORS.map(({ color, label }) => (
          <button
            key={color}
            title={label}
            onClick={() => set('pantsColor', color)}
            style={{
              width: 26, height: 26,
              borderRadius: 7,
              background: color,
              border: state.pantsColor === color ? '2.5px solid #17242a' : '2.5px solid rgba(0,0,0,0.1)',
              outline: state.pantsColor === color ? '1.5px solid #fff' : 'none',
              outlineOffset: '-4px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          />
        ))}
      </div>

      {/* Hair color */}
      <span style={labelStyle}>Hair colour</span>
      <div style={{ display: 'flex', gap: 5, marginBottom: 2 }}>
        {HAIR_COLORS.map(({ color, label }) => (
          <button
            key={color}
            title={label}
            onClick={() => set('hairColor', color)}
            style={{
              width: 26, height: 26,
              borderRadius: 7,
              background: color,
              border: state.hairColor === color ? '2.5px solid #17242a' : '2.5px solid rgba(0,0,0,0.1)',
              outline: state.hairColor === color ? '1.5px solid #fff' : 'none',
              outlineOffset: '-4px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          />
        ))}
      </div>

      {/* Hair style */}
      <span style={labelStyle}>Hair style</span>
      <div style={{ display: 'flex', gap: 5 }}>
        {HAIR_STYLES.map(({ key, label }) => (
          <button
            key={key}
            title={key}
            onClick={() => set('hairStyle', key)}
            style={{
              width: 36, height: 28,
              borderRadius: 8,
              border: state.hairStyle === key ? '2px solid #17242a' : '2px solid transparent',
              background: state.hairStyle === key ? '#17242a' : 'rgba(0,0,0,0.07)',
              color: state.hairStyle === key ? '#fff' : '#4B5563',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
