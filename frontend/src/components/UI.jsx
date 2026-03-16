export function Spinner({ size = 20 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `2px solid var(--border)`,
        borderTopColor: "var(--accent)",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}

export function LoadingState({ message = "Loading..." }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
        gap: "16px",
      }}
    >
      <Spinner size={32} />
      <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>{message}</span>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
        gap: "12px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "40px", opacity: 0.3 }}>{icon}</div>
      <div style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-secondary)" }}>{title}</div>
      {description && (
        <div style={{ fontSize: "13px", color: "var(--text-muted)", maxWidth: "300px" }}>{description}</div>
      )}
      {action && <div style={{ marginTop: "8px" }}>{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
        gap: "12px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "var(--red-dim)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{message}</div>
      {onRetry && (
        <button onClick={onRetry} style={{ marginTop: "4px" }} className="btn-secondary">
          Try again
        </button>
      )}
    </div>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-card)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Badge({ children, variant = "default" }) {
  const variants = {
    default: { bg: "var(--bg-elevated)", color: "var(--text-secondary)" },
    present: { bg: "var(--green-dim)", color: "var(--green)" },
    absent: { bg: "var(--red-dim)", color: "var(--red)" },
    accent: { bg: "var(--accent-glow)", color: "var(--accent)" },
  };
  const v = variants[variant] || variants.default;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: "100px",
        fontSize: "12px",
        fontWeight: 500,
        background: v.bg,
        color: v.color,
        letterSpacing: "0.01em",
      }}
    >
      {children}
    </span>
  );
}

export function StatCard({ label, value, icon, color = "var(--accent)" }) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        boxShadow: "var(--shadow-card)",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: `${color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "26px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
          {value}
        </div>
        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>{label}</div>
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "var(--shadow-elevated)",
          animation: "fadeIn 0.2s ease",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>{title}</span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div style={{ padding: "24px" }}>{children}</div>
      </div>
    </div>
  );
}

export function FormField({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: "12px", color: "var(--red)" }}>{error}</span>}
    </div>
  );
}

export function Input({ ...props }) {
  return (
    <input
      {...props}
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "10px 12px",
        color: "var(--text-primary)",
        fontSize: "14px",
        outline: "none",
        transition: "border-color 0.15s ease",
        width: "100%",
        ...props.style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "var(--accent)";
        props.onFocus && props.onFocus(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "var(--border)";
        props.onBlur && props.onBlur(e);
      }}
    />
  );
}

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "10px 12px",
        color: "var(--text-primary)",
        fontSize: "14px",
        outline: "none",
        width: "100%",
        cursor: "pointer",
        ...props.style,
      }}
    >
      {children}
    </select>
  );
}

export function Button({ children, variant = "primary", loading = false, ...props }) {
  const styles = {
    primary: {
      background: "var(--accent)",
      color: "white",
      border: "none",
    },
    secondary: {
      background: "var(--bg-elevated)",
      color: "var(--text-secondary)",
      border: "1px solid var(--border)",
    },
    danger: {
      background: "var(--red-dim)",
      color: "var(--red)",
      border: "1px solid rgba(248,113,113,0.2)",
    },
  };
  const s = styles[variant] || styles.primary;
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{
        ...s,
        padding: "10px 18px",
        borderRadius: "var(--radius-sm)",
        fontSize: "14px",
        fontWeight: 500,
        cursor: loading || props.disabled ? "not-allowed" : "pointer",
        opacity: loading || props.disabled ? 0.6 : 1,
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        transition: "opacity 0.15s ease, transform 0.1s ease",
        fontFamily: "var(--font-sans)",
        ...props.style,
      }}
    >
      {loading && <Spinner size={14} />}
      {children}
    </button>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, description, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>{description}</p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>Delete</Button>
      </div>
    </Modal>
  );
}
