import { useState, useEffect, useCallback } from "react";

const API = "https://pulsemail-server.onrender.com/api";

// ─── TEMPLATES DATA ───
const EMAIL_TEMPLATES = [
  {
    id: "welcome",
    icon: "👋",
    name: "Welcome Email",
    category: "Onboarding",
    catColor: "#10B981",
    subject: "Welcome to PulseMail! 👋",
    body: "We're thrilled to have you on board!\n\nHere's how to get the most out of your first week:\n\n1. Set up your profile and preferences\n2. Explore your dashboard and key features\n3. Reach out anytime — our support team is here for you\n\nWe're glad you're here, and we can't wait to help you succeed. Just reply to this email if you ever have a question.",
    cta: "Get Started →",
    support: "+1 (800) 123-4567",
  },
  {
    id: "promo",
    icon: "🎁",
    name: "Promotional Offer",
    category: "Promotional",
    catColor: "#F59E0B",
    subject: "🎁 Exclusive 30% OFF — Limited Time!",
    body: "Good news — we've got something special for you.\n\nFor a limited time, take an exclusive discount on any of our premium plans:\n\n1. Click the button below to visit our store\n2. Add your favorite items to your cart\n3. Enter code SAVE30 at checkout\n\nThis offer runs through December 31, 2024, so don't wait too long!",
    cta: "Claim Your Discount →",
    support: "+1 (800) 000-1234",
  },
  {
    id: "newsletter",
    icon: "📰",
    name: "Monthly Newsletter",
    category: "Newsletter",
    catColor: "#3B82F6",
    subject: "📰 Your May Update from PulseMail",
    body: "Here's what's new this month.\n\nWe've been hard at work — new features, growing momentum, and a few things we think you'll love:\n\n• New template builder is live\n• Open rates are up across the board\n• Fresh tips on writing subject lines that get opened\n\nThanks for being part of the journey. Hit reply anytime — we'd love to hear from you.",
    cta: "Read Full Update →",
    support: "+1 (800) 123-4567",
  },
  {
    id: "followup",
    icon: "🔄",
    name: "Follow-Up",
    category: "Re-engage",
    catColor: "#8B5CF6",
    subject: "Quick follow-up from PulseMail",
    body: "Just circling back on my last message — I know inboxes get busy, so wanted to make sure this didn't get buried.\n\nI'd love to show you how {{brand}} can streamline your workflow and save your team real time each week.\n\nGot 15 minutes this week for a quick call?",
    cta: "Book a Quick Call →",
    support: "+1 (800) 000-5678",
  },
  {
    id: "invoice",
    icon: "🧾",
    name: "Invoice / Receipt",
    category: "Transactional",
    catColor: "#EF4444",
    subject: "Your {{brand}} Invoice #MF-2024-0042",
    body: "Thanks for your payment — here are your invoice details:\n\nInvoice #MF-2024-0042\nDate: November 22, 2024\nPlan: Pro Monthly — $49.00\nStatus: Paid\n\nYour next billing date is December 22, 2024. You can update your billing details anytime in your account settings.",
    cta: "Download Invoice →",
    support: "billing@mailflow.io",
  },
];

// ─── CAMPAIGNS DATA ───
const CAMPAIGNS = [
  { id: 1, name: "Black Friday Mega Sale", type: "Promotional", status: "Live", sent: 12840, openRate: 42.5, clickRate: 8.0, date: "May 15, 2026" },
  { id: 2, name: "Weekly Product Digest", type: "Newsletter", status: "Live", sent: 8930, openRate: 33.0, clickRate: 7.0, date: "May 14, 2026" },
  { id: 3, name: "Year-End Review 2026", type: "Newsletter", status: "Scheduled", sent: 0, openRate: 0, clickRate: 0, date: "May 30, 2026" },
  { id: 4, name: "Customer Onboarding", type: "Transactional", status: "Live", sent: 3420, openRate: 80.0, clickRate: 26.0, date: "May 12, 2026" },
  { id: 5, name: "Re-engagement Series", type: "Re-engage", status: "Paused", sent: 4510, openRate: 20.0, clickRate: 4.0, date: "May 10, 2026" },
];

const CONTACTS = [
  { id: 1, name: "Adebayo Johnson", email: "adebayo@company.ng", group: "VIP", active: "2h ago" },
  { id: 2, name: "Sarah Chen", email: "sarah.chen@startup.io", group: "Clients", active: "1d ago" },
  { id: 3, name: "Marcus Webb", email: "m.webb@agency.com", group: "Leads", active: "3h ago" },
  { id: 4, name: "Fatima Al-Rashid", email: "fatima@enterprise.co", group: "VIP", active: "5m ago" },
  { id: 5, name: "James Okonkwo", email: "james.o@tech.ng", group: "Newsletter", active: "1w ago" },
  { id: 6, name: "Elena Petrova", email: "elena.p@design.studio", group: "Clients", active: "2d ago" },
  { id: 7, name: "David Kim", email: "d.kim@venture.vc", group: "Leads", active: "4h ago" },
  { id: 8, name: "Amara Diallo", email: "amara@creative.sn", group: "VIP", active: "30m ago" },
];

const CHART_DATA = [320, 480, 390, 620, 540, 710, 680];
const CHART_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── ICONS ───
const I = {
  grid: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  send: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  users: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  bar: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  gear: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  search: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  bell: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  plus: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  mail: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>,
  eye: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  click: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M15 15l-2 5L9 9l11 4-5 2z"/></svg>,
  edit: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  chevDown: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>,
  desktop: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  phone: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>,
};

// ─── COLORS ───
const C = {
  bg: "#08090D", s1: "#0F1117", s2: "#161921", s3: "#1C2030",
  b1: "#1E2235", b2: "#282D42",
  t1: "#EAECF5", t2: "#9299B8", t3: "#555C78",
  ac: "#FF6B3D", acL: "#FF8A65", acD: "rgba(255,107,61,0.1)",
  ok: "#10B981", okD: "rgba(16,185,129,0.1)",
  warn: "#F59E0B", warnD: "rgba(245,158,11,0.1)",
  err: "#EF4444", errD: "rgba(239,68,68,0.1)",
  info: "#3B82F6", infoD: "rgba(59,130,246,0.1)",
};

const FONT = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&display=swap";

// ─── STATUS / GROUP BADGES ───
function Badge({ label, color, dot }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: color + "18", color, fontSize: 11, fontWeight: 600 }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, animation: "pulse 2s infinite" }} />}
      {label}
    </span>
  );
}

// ─── LIVE EMAIL PREVIEW ───
function LivePreview({ form, previewMode }) {
  const brandColor = form.brandColor || "#008CFF";
  const brand = form.senderName || "Your Brand";
  const name = form.firstName || "there";
  const subject = (form.subject || "Your subject line here")
    .replace("{{brand}}", brand)
    .replace("{{month}}", "May");
  const bodyText = (form.body || "Start writing your email content...")
    .replace(/\{\{brand\}\}/g, brand)
    .replace("{{month}}", "May");
  const cta = form.cta || "Click Here →";

  const lines = bodyText.split("\n").filter(Boolean);
  const isPhone = previewMode === "phone";

  return (
    <div style={{
      width: isPhone ? 280 : "100%",
      margin: isPhone ? "0 auto" : 0,
      background: "#FAFAFA",
      borderRadius: 12,
      overflow: "hidden",
      border: isPhone ? "8px solid #222" : "1px solid #E5E7EB",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      {/* macOS dots */}
      <div style={{ padding: "10px 14px", background: "#F3F4F6", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FFBD2E" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28C840" }} />
        </div>
        <span style={{ fontSize: 11, color: "#6B7280", marginLeft: 8 }}>{brand}</span>
      </div>
      {/* Banner */}
      <div style={{ background: brandColor, padding: isPhone ? "18px 16px" : "24px 28px" }}>
        <div style={{ fontSize: isPhone ? 18 : 22, fontWeight: 700, color: "#fff", fontFamily: "'Fraunces', serif" }}>
          {brand} 
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: isPhone ? "18px 16px" : "28px 32px", color: "#1F2937", fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ fontSize: isPhone ? 16 : 20, fontWeight: 700, lineHeight: 1.3, marginBottom: 16, color: "#111827" }}>
          {subject}
        </div>
        <div style={{ fontSize: 14, color: "#374151", marginBottom: 8 }}>Hi {name},</div>
        {lines.map((line, i) => {
          const trimmed = line.trim();
          const isStep = /^\d+[\.\)]/.test(trimmed);
          const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-");
          if (isStep) {
            const num = trimmed.match(/^(\d+)/)[1];
            const rest = trimmed.replace(/^\d+[\.\)]\s*/, "");
            return (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6, marginTop: i === 0 || lines[i - 1]?.trim().match(/^\d/) ? 0 : 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: brandColor, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{num}</div>
                <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{rest}</span>
              </div>
            );
          }
          if (isBullet) {
            return (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4, paddingLeft: 4 }}>
                <span style={{ color: brandColor, fontWeight: 700, fontSize: 16, lineHeight: 1.4 }}>•</span>
                <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{trimmed.replace(/^[•\-]\s*/, "")}</span>
              </div>
            );
          }
          return <p key={i} style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "10px 0" }}>{trimmed}</p>;
        })}
        {/* CTA */}
        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <div style={{
            display: "inline-block", padding: "14px 32px", borderRadius: 8,
            background: brandColor, color: "#fff", fontSize: 14, fontWeight: 700,
            letterSpacing: "0.02em",
          }}>{cta}</div>
        </div>
        {/* Footer */}
        <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 16, fontSize: 12, color: "#9CA3AF", lineHeight: 1.6 }}>
          This email was sent by <strong style={{ color: "#6B7280" }}>{brand}</strong>.
        </div>
        {/* Support Contact */}
        {form.support && form.support.trim() && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, padding: "14px 16px", background: "#f4f5f8", borderRadius: 5,  }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="13" height="13" fill="none" stroke="#6B7280" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>Get in touch with {brand}. Available 24/7.</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: brandColor, marginTop: 2 }}>{form.support}</div>
            </div>
          </div>
        )}
        {/* Copyright & Unsubscribe */}
        <div style={{ textAlign: "center", marginTop: 16, paddingTop: 12, fontSize: 11, color: "#C0C4CC" }}>
          © {new Date().getFullYear()} {brand} · <span style={{ textDecoration: "underline", cursor: "pointer" }}>Unsubscribe</span> · <span style={{ textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}

// ─── SEND MAIL PAGE (3-column) ───
function SendMailPage({ user }) {
  const [selected, setSelected] = useState("welcome");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [toast, setToast] = useState(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [drafts, setDrafts] = useState([]);
  const [scheduleDate, setScheduleDate] = useState("");

  const tpl = EMAIL_TEMPLATES.find(t => t.id === selected);

  const [form, setForm] = useState({
    senderName: user?.name || "PulseMail Support",
    fromEmail: "hello@mailingsuppo88rt.online",
    to: "",
    cc: "",
    bcc: "",
    subject: tpl.subject,
    firstName: "Jessica",
    brandColor: "#008CFF",
    body: tpl.body,
    cta: tpl.cta,
    support: user?.email || "support@pulsemail.io",
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const selectTemplate = useCallback((id) => {
    const t = EMAIL_TEMPLATES.find(x => x.id === id);
    setSelected(id);
    setSent(false);
    setErrors({});
    setForm(prev => ({
      ...prev,
      subject: t.subject,
      body: t.body,
      cta: t.cta,
      support: t.support,
    }));
    showToast(`Template loaded: ${t.name}`);
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.to.trim()) errs.to = "At least one recipient is required";
    if (!form.subject.trim()) errs.subject = "Subject line is required";
    if (!form.body.trim()) errs.body = "Message body cannot be empty";
    if (!form.senderName.trim()) errs.senderName = "Sender name is required";
    if (!form.fromEmail.trim() || !form.fromEmail.includes("@")) errs.fromEmail = "Valid email required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) {
      showToast("Please fix the errors before sending", "error");
      return;
    }
    setSending(true);
    setErrors({});
    try {
      const token = localStorage.getItem("pulsemail_token");
      const res = await fetch(`${API}/email/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          to: form.to,
          cc: form.cc,
          bcc: form.bcc,
          subject: form.subject,
          body: form.body,
          senderName: form.senderName,
          fromEmail: form.fromEmail,
          cta: form.cta,
          brandColor: form.brandColor,
          firstName: form.firstName,
          support: form.support,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setSending(false);
      setSent(true);
      showToast(data.message || `Email sent to ${form.to}!`);
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setSending(false);
      showToast(err.message, "error");
    }
  };

  const handleDraft = () => {
    const draft = { ...form, id: Date.now(), template: selected, savedAt: new Date().toLocaleTimeString() };
    setDrafts(prev => [...prev, draft]);
    showToast(`Draft saved at ${draft.savedAt}`);
  };

  const handleSchedule = () => {
    if (!validate()) {
      showToast("Please fix errors before scheduling", "error");
      return;
    }
    if (!scheduleDate) {
      showToast("Please pick a date and time first", "error");
      return;
    }
    showToast(`Scheduled for ${new Date(scheduleDate).toLocaleString()}`);
  };

  const upd = (k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors(prev => { const n = { ...prev }; delete n[k]; return n; });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 340px", gap: 20, height: "calc(100vh - 120px)" }}>
      {/* LEFT — Templates */}
      <div style={{ background: C.s1, borderRadius: 16, border: `1px solid ${C.b1}`, padding: 16, overflowY: "auto" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t2, marginBottom: 12, letterSpacing: "0.04em" }}>Choose Template</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {EMAIL_TEMPLATES.map(t => {
            const active = selected === t.id;
            return (
              <button key={t.id} onClick={() => selectTemplate(t.id)} style={{
                textAlign: "left", padding: "14px 14px", borderRadius: 12, cursor: "pointer",
                border: active ? `2px solid ${C.ac}` : `1px solid ${C.b1}`,
                background: active ? C.acD : "transparent",
                transition: "all 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>{t.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: active ? C.ac : C.t1 }}>{t.name}</span>
                </div>
                <div style={{ fontSize: 11, color: C.t3, marginBottom: 6, lineHeight: 1.4 }}>{t.category}</div>
                <Badge label={t.category} color={t.catColor} />
              </button>
            );
          })}
        </div>
      </div>

      {/* MIDDLE — Compose Form */}
      <div style={{ background: C.s1, borderRadius: 16, border: `1px solid ${C.b1}`, padding: 24, overflowY: "auto", position: "relative" }}>
        {/* Sending overlay */}
        {sending && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(8,9,13,0.85)", backdropFilter: "blur(4px)",
            borderRadius: 16, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
          }}>
            <div style={{
              width: 48, height: 48, border: `3px solid ${C.b1}`, borderTopColor: C.ac,
              borderRadius: "50%", animation: "spin 0.8s linear infinite",
            }} />
            <div style={{ color: C.t1, fontSize: 14, fontWeight: 600 }}>Sending your email...</div>
            <div style={{ color: C.t3, fontSize: 12 }}>This may take a moment</div>
          </div>
        )}

        {/* Sent success overlay */}
        {sent && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(8,9,13,0.85)", backdropFilter: "blur(4px)",
            borderRadius: 16, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%", background: C.okD, border: `2px solid ${C.ok}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
              animation: "fadeSlideIn 0.4s ease",
            }}>✓</div>
            <div style={{ color: C.ok, fontSize: 16, fontWeight: 700 }}>Email Sent Successfully!</div>
            <div style={{ color: C.t2, fontSize: 12, textAlign: "center", maxWidth: 300, lineHeight: 1.6 }}>
              Your email to <strong style={{ color: C.t1 }}>{form.to}</strong> has been sent from <strong style={{ color: C.t1 }}>{form.fromEmail}</strong>
            </div>
            <button onClick={() => setSent(false)} style={{
              marginTop: 8, padding: "8px 24px", borderRadius: 8, border: `1px solid ${C.b1}`,
              background: "transparent", color: C.t1, fontSize: 12, fontWeight: 500, cursor: "pointer",
            }}>Compose Another</button>
          </div>
        )}

        <div style={{ fontSize: 10, fontWeight: 600, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
          Sender Identity — Inbox shows brand name; address when opened
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <Field label="Sender / Brand Name" value={form.senderName} onChange={v => upd("senderName", v)} error={errors.senderName} />
          <Field label="From Email" value={form.fromEmail} onChange={v => upd("fromEmail", v)} error={errors.fromEmail} />
        </div>
        <Field label="To — Recipients" value={form.to} onChange={v => upd("to", v)} placeholder="Add email & press Enter" style={{ marginBottom: 12 }} error={errors.to} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <Field label="CC" value={form.cc} onChange={v => upd("cc", v)} placeholder="cc@company.com" />
          <Field label="BCC" value={form.bcc} onChange={v => upd("bcc", v)} placeholder="bcc@company.com" />
        </div>
        <Field label="Subject Line" value={form.subject} onChange={v => upd("subject", v)} style={{ marginBottom: 12 }} error={errors.subject} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, marginBottom: 12, alignItems: "end" }}>
          <Field label="Recipient First Name" value={form.firstName} onChange={v => upd("firstName", v)} />
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: C.t3, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Brand Color</label>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input type="color" value={form.brandColor} onChange={e => upd("brandColor", e.target.value)}
                style={{ width: 36, height: 36, border: "none", borderRadius: 8, cursor: "pointer", background: "transparent" }} />
            </div>
          </div>
          <Field label="" value={form.brandColor} onChange={v => upd("brandColor", v)} />
        </div>

        {/* Textarea with toolbar */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: errors.body ? C.err : C.t3, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Message Body</label>
          <div style={{ border: `1px solid ${errors.body ? C.err : C.b1}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s" }}>
            <div style={{ display: "flex", gap: 0, padding: "5px 8px", borderBottom: `1px solid ${C.b1}`, background: C.bg }}>
              {[{ l: "B", fw: 700 }, { l: "I", fs: "italic" }, { l: "U", td: "underline" }, { l: "🔗" }, { l: "📎" }, { l: "🖼" }].map((b, i) => (
                <button key={i} style={{ background: "none", border: "none", color: C.t2, cursor: "pointer", padding: "4px 8px", borderRadius: 4, fontSize: 13, fontWeight: b.fw || 400, fontStyle: b.fs || "normal" }}>{b.l}</button>
              ))}
            </div>
            <textarea value={form.body} onChange={e => upd("body", e.target.value)} rows={8}
              style={{ width: "100%", border: "none", padding: 14, fontSize: 13, color: C.t1, background: "transparent", resize: "vertical", outline: "none", fontFamily: "'Outfit', sans-serif", lineHeight: 1.6, boxSizing: "border-box" }} />
          </div>
          {errors.body && <div style={{ fontSize: 10, color: C.err, marginTop: 4 }}>{errors.body}</div>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <Field label="CTA Button Label" value={form.cta} onChange={v => upd("cta", v)} />
          <Field label="Support Contact" value={form.support} onChange={v => upd("support", v)} />
        </div>

        {/* Tracking */}
        <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.t2, cursor: "pointer" }}>
            <input type="checkbox" defaultChecked style={{ accentColor: C.ac }} />
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>{I.eye} Opens</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.t2, cursor: "pointer" }}>
            <input type="checkbox" defaultChecked style={{ accentColor: C.ac }} />
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>{I.click} Clicks</span>
          </label>
        </div>

        {/* Schedule */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: C.t3, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Schedule Send</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)}
              style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.b1}`, background: C.bg, color: C.t1, fontSize: 13, outline: "none", fontFamily: "'Outfit', sans-serif" }} />
            {scheduleDate && (
              <button onClick={handleSchedule} style={{
                padding: "10px 16px", borderRadius: 10, border: "none",
                background: C.warnD, color: C.warn, fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>⏰ Schedule</button>
            )}
          </div>
        </div>

        {/* Drafts indicator */}
        {drafts.length > 0 && (
          <div style={{ marginBottom: 12, padding: "8px 12px", borderRadius: 8, background: C.infoD, fontSize: 11, color: C.info }}>
            📂 {drafts.length} draft{drafts.length > 1 ? "s" : ""} saved — last at {drafts[drafts.length - 1].savedAt}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleDraft} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1px solid ${C.b1}`, background: "transparent", color: C.t2, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.info; e.currentTarget.style.color = C.info; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.b1; e.currentTarget.style.color = C.t2; }}>
            💾 Draft
          </button>
          <button onClick={handleSend} disabled={sending} style={{
            flex: 2, padding: "12px", borderRadius: 10, border: "none",
            background: sending ? C.t3 : `linear-gradient(135deg, ${C.ac}, ${C.acL})`, color: "#fff",
            fontSize: 13, fontWeight: 700, cursor: sending ? "not-allowed" : "pointer",
            boxShadow: sending ? "none" : `0 4px 20px ${C.ac}40`,
            transition: "all 0.3s",
          }}>
            {sending ? "Sending..." : "Send Now ✈"}
          </button>
        </div>
      </div>

      {/* RIGHT — Live Preview */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase" }}>Live Email Preview</span>
          <div style={{ display: "flex", gap: 4, background: C.s2, borderRadius: 8, padding: 3 }}>
            {[{ id: "desktop", icon: I.desktop }, { id: "phone", icon: I.phone }].map(m => (
              <button key={m.id} onClick={() => setPreviewMode(m.id)} style={{
                padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                background: previewMode === m.id ? C.s3 : "transparent",
                color: previewMode === m.id ? C.t1 : C.t3, transition: "all 0.2s",
              }}>{m.icon}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", borderRadius: 16, background: C.s1, border: `1px solid ${C.b1}`, padding: 16 }}>
          <LivePreview form={form} previewMode={previewMode} />
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: toast.type === "error" ? C.err : C.ok, color: "#fff", padding: "12px 24px", borderRadius: 12,
          fontSize: 13, fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          animation: "slideUp 0.3s ease", zIndex: 999, display: "flex", alignItems: "center", gap: 8,
          maxWidth: 400,
        }}>
          {toast.type === "error" ? "⚠️" : "✅"} {toast.msg}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, style = {}, error }) {
  return (
    <div style={style}>
      {label && <label style={{ fontSize: 10, fontWeight: 600, color: error ? C.err : C.t3, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{label}</label>}
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${error ? C.err : C.b1}`, background: C.bg, color: C.t1, fontSize: 13, outline: "none", fontFamily: "'Outfit', sans-serif", boxSizing: "border-box", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = error ? C.err : C.ac}
        onBlur={e => e.target.style.borderColor = error ? C.err : C.b1}
      />
      {error && <div style={{ fontSize: 10, color: C.err, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

// ─── DASHBOARD ───
function DashboardPage() {
  const stats = [
    { label: "Emails Sent", value: "29,903", change: "+12.4%", up: true, icon: I.send, color: C.ac },
    { label: "Open Rate", value: "38.2%", change: "+3.1%", up: true, icon: I.eye, color: C.ok },
    { label: "Click Rate", value: "9.4%", change: "+1.2%", up: true, icon: I.click, color: C.info },
    { label: "Contacts", value: "4,219", change: "+48 new", up: true, icon: I.users, color: C.warn },
  ];
  const max = Math.max(...CHART_DATA);
  const activity = [
    { text: '"Black Friday Mega Sale" sent to 12,840 contacts', time: "2h ago", color: C.ok },
    { text: '5,462 contacts opened "Black Friday Mega Sale"', time: "1h ago", color: C.info },
    { text: '7 emails bounced from "Weekly Product Digest"', time: "4h ago", color: C.err },
    { text: '"Year-End Review 2026" scheduled for May 30', time: "Yesterday", color: C.warn },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: C.s1, borderRadius: 14, padding: "20px 22px", border: `1px solid ${C.b1}`,
            animation: `fadeSlideIn 0.5s ${i * 0.08}s both`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: C.t2, fontWeight: 500 }}>{s.label}</span>
              <span style={{ color: s.color, opacity: 0.6 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.t1, fontFamily: "'Fraunces', serif", letterSpacing: "-0.02em" }}>{s.value}</div>
            <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: s.up ? C.ok : C.err }}>{s.up ? "↑" : "↓"} {s.change}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Chart */}
        <div style={{ background: C.s1, borderRadius: 14, padding: 22, border: `1px solid ${C.b1}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <div><div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>Send Volume</div><div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>Last 7 days</div></div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.t1, fontFamily: "'Fraunces', serif" }}>{CHART_DATA.reduce((a, b) => a + b, 0).toLocaleString()}</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 110 }}>
            {CHART_DATA.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: "100%", borderRadius: 5, minHeight: 6,
                  height: `${(v / max) * 100}%`,
                  background: i === CHART_DATA.length - 1 ? `linear-gradient(180deg, ${C.acL}, ${C.ac})` : `linear-gradient(180deg, ${C.ac}35, ${C.ac}15)`,
                  transition: "height 0.6s cubic-bezier(0.16,1,0.3,1)",
                  transitionDelay: `${i * 0.06}s`,
                }} />
                <span style={{ fontSize: 10, color: C.t3, fontWeight: 500 }}>{CHART_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Activity */}
        <div style={{ background: C.s1, borderRadius: 14, padding: 22, border: `1px solid ${C.b1}` }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 14 }}>Recent Activity</div>
          {activity.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < activity.length - 1 ? `1px solid ${C.b1}` : "none" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.color, marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: C.t1, lineHeight: 1.5 }}>{a.text}</div>
                <div style={{ fontSize: 10, color: C.t3, marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CAMPAIGNS PAGE ───
function CampaignsPage() {
  const statusColor = { Live: C.ok, Scheduled: C.warn, Paused: C.err, Draft: C.t3 };
  return (
    <div style={{ background: C.s1, borderRadius: 14, border: `1px solid ${C.b1}`, overflow: "hidden" }}>
      <div style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.b1}` }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>All Campaigns</span>
        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Live", "Scheduled", "Paused"].map((f, i) => (
            <button key={f} style={{ padding: "4px 12px", borderRadius: 7, border: `1px solid ${i === 0 ? C.ac : C.b1}`, background: i === 0 ? C.acD : "transparent", color: i === 0 ? C.ac : C.t3, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>{f}</button>
          ))}
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr style={{ borderBottom: `1px solid ${C.b1}` }}>
          {["Campaign", "Type", "Status", "Sent", "Open Rate", "Click Rate", ""].map(h => (
            <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 10, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
          ))}
        </tr></thead>
        <tbody>{CAMPAIGNS.map(c => (
          <tr key={c.id} style={{ borderBottom: `1px solid ${C.b1}`, cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = C.s2}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <td style={{ padding: "12px 20px" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>{c.name}</div>
              <div style={{ fontSize: 10, color: C.t3, marginTop: 2 }}>{c.date}</div>
            </td>
            <td style={{ padding: "12px 20px", fontSize: 11, color: C.t2 }}>{c.type}</td>
            <td style={{ padding: "12px 20px" }}><Badge label={c.status} color={statusColor[c.status]} dot={c.status === "Live"} /></td>
            <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 500, color: C.t1 }}>{c.sent > 0 ? c.sent.toLocaleString() : "—"}</td>
            <td style={{ padding: "12px 20px" }}>
              {c.openRate > 0 ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 48, height: 4, borderRadius: 2, background: C.b1 }}>
                    <div style={{ width: `${c.openRate}%`, height: "100%", borderRadius: 2, background: C.ok }} />
                  </div>
                  <span style={{ fontSize: 11, color: C.t1 }}>{c.openRate}%</span>
                </div>
              ) : <span style={{ fontSize: 11, color: C.t3 }}>—</span>}
            </td>
            <td style={{ padding: "12px 20px", fontSize: 11, color: c.clickRate > 0 ? C.t1 : C.t3 }}>{c.clickRate > 0 ? c.clickRate + "%" : "—"}</td>
            <td style={{ padding: "12px 20px" }}>
              <div style={{ display: "flex", gap: 5 }}>
                <button style={{ background: C.acD, border: "none", borderRadius: 5, padding: "4px 6px", color: C.ac, cursor: "pointer" }}>{I.edit}</button>
                <button style={{ background: C.errD, border: "none", borderRadius: 5, padding: "4px 6px", color: C.err, cursor: "pointer" }}>{I.trash}</button>
              </div>
            </td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

// ─── CONTACTS PAGE ───
function ContactsPage({ onAdd }) {
  const groupColor = { VIP: C.warn, Clients: C.ac, Leads: C.ok, Newsletter: C.info };
  return (
    <div style={{ background: C.s1, borderRadius: 14, border: `1px solid ${C.b1}`, overflow: "hidden" }}>
      <div style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.b1}` }}>
        <div><div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>Contacts</div><div style={{ fontSize: 11, color: C.t3 }}>{CONTACTS.length} total</div></div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.b1}`, background: "transparent", color: C.t2, fontSize: 12, cursor: "pointer" }}>Import CSV</button>
          <button onClick={onAdd} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${C.ac}, ${C.acL})`, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>{I.plus} Add</button>
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr style={{ borderBottom: `1px solid ${C.b1}` }}>
          {["Name", "Email", "Group", "Active", ""].map(h => (
            <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 10, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
          ))}
        </tr></thead>
        <tbody>{CONTACTS.map(c => (
          <tr key={c.id} style={{ borderBottom: `1px solid ${C.b1}`, transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = C.s2}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <td style={{ padding: "10px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${C.ac}50, ${C.acL}30)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.t1 }}>{c.name.split(" ").map(n => n[0]).join("")}</div>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>{c.name}</span>
              </div>
            </td>
            <td style={{ padding: "10px 20px", fontSize: 12, color: C.t2 }}>{c.email}</td>
            <td style={{ padding: "10px 20px" }}><Badge label={c.group} color={groupColor[c.group]} /></td>
            <td style={{ padding: "10px 20px", fontSize: 11, color: C.t3 }}>{c.active}</td>
            <td style={{ padding: "10px 20px" }}>
              <div style={{ display: "flex", gap: 5 }}>
                <button style={{ background: C.acD, border: "none", borderRadius: 5, padding: "4px 6px", color: C.ac, cursor: "pointer" }}>{I.edit}</button>
                <button style={{ background: C.errD, border: "none", borderRadius: 5, padding: "4px 6px", color: C.err, cursor: "pointer" }}>{I.trash}</button>
              </div>
            </td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

// ─── ANALYTICS PAGE ───
function AnalyticsPage() {
  const metrics = [
    { label: "Delivery Rate", value: "98.7%", sub: "Industry avg: 95%", color: C.ok },
    { label: "Bounce Rate", value: "1.3%", sub: "Hard: 0.4% · Soft: 0.9%", color: C.err },
    { label: "Unsubscribe", value: "0.12%", sub: "Below avg", color: C.warn },
    { label: "Spam Reports", value: "0.01%", sub: "Excellent", color: C.info },
  ];
  const top = CAMPAIGNS.filter(c => c.openRate > 0).sort((a, b) => b.openRate - a.openRate).slice(0, 4);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: C.s1, borderRadius: 14, padding: 20, border: `1px solid ${C.b1}`, borderLeft: `3px solid ${m.color}` }}>
            <div style={{ fontSize: 11, color: C.t2, marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: C.t1, fontFamily: "'Fraunces', serif" }}>{m.value}</div>
            <div style={{ fontSize: 10, color: C.t3, marginTop: 4 }}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ background: C.s1, borderRadius: 14, padding: 22, border: `1px solid ${C.b1}` }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 14 }}>Top Performing Campaigns</div>
        {top.map((c, i) => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < top.length - 1 ? `1px solid ${C.b1}` : "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: C.acD, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.ac, fontSize: 14, fontFamily: "'Fraunces', serif" }}>#{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>{c.name}</div>
              <div style={{ fontSize: 10, color: C.t3 }}>{c.sent.toLocaleString()} sent</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ok }}>{c.openRate}% opened</div>
              <div style={{ fontSize: 10, color: C.t3 }}>{c.clickRate}% clicked</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADD CONTACT MODAL ───
function AddContactModal({ onClose }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [group, setGroup] = useState("Clients");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleAdd = async () => {
    if (!firstName.trim() || !cEmail.trim()) { setErr("First name and email are required"); return; }
    if (!cEmail.includes("@")) { setErr("Please enter a valid email"); return; }
    setSaving(true); setErr("");
    try {
      const token = localStorage.getItem("pulsemail_token");
      const res = await fetch(`${API}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email: cEmail, group_tag: group, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add contact");
      onClose(data.contact);
    } catch (e) {
      setErr(e.message);
    } finally { setSaving(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s" }} onClick={() => onClose(null)}>
      <div style={{ background: C.s1, borderRadius: 18, width: 440, border: `1px solid ${C.b1}`, animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.t1 }}>Add New Contact</span>
            <button onClick={() => onClose(null)} style={{ background: "none", border: "none", color: C.t3, cursor: "pointer", fontSize: 18 }}>✕</button>
          </div>
          {err && <div style={{ padding: "8px 12px", borderRadius: 8, background: C.errD, color: C.err, fontSize: 12, marginBottom: 12 }}>⚠️ {err}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <Field label="First Name" value={firstName} onChange={setFirstName} placeholder="John" />
            <Field label="Last Name" value={lastName} onChange={setLastName} placeholder="Doe" />
          </div>
          <Field label="Email" value={cEmail} onChange={setCEmail} placeholder="john@example.com" style={{ marginBottom: 12 }} />
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: C.t3, letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Group</label>
            <select value={group} onChange={e => setGroup(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.b1}`, background: C.bg, color: C.t1, fontSize: 13, outline: "none", fontFamily: "'Outfit', sans-serif" }}>
              <option>Clients</option><option>Leads</option><option>VIP</option><option>Newsletter</option>
            </select>
          </div>
          <Field label="Notes" value={notes} onChange={setNotes} placeholder="Optional..." style={{ marginBottom: 20 }} />
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => onClose(null)} style={{ flex: 1, padding: 11, borderRadius: 10, border: `1px solid ${C.b1}`, background: "transparent", color: C.t2, fontSize: 13, cursor: "pointer" }}>Cancel</button>
            <button onClick={handleAdd} disabled={saving} style={{ flex: 1, padding: 11, borderRadius: 10, border: "none", background: saving ? C.t3 : `linear-gradient(135deg, ${C.ac}, ${C.acL})`, color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Adding..." : "Add Contact"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH PAGE ───
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (mode === "login") {
      if (!email.trim() || !password.trim()) { setError("Please fill in all fields"); return; }
      if (!email.includes("@")) { setError("Please enter a valid email address"); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
      setLoading(true);
      try {
        const res = await fetch(`${API}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");
        localStorage.setItem("pulsemail_token", data.token);
        onLogin(data.user);
      } catch (err) {
        setError(err.message);
      } finally { setLoading(false); }
    } else if (mode === "signup") {
      if (!name.trim() || !email.trim() || !password.trim() || !confirmPw.trim()) { setError("Please fill in all fields"); return; }
      if (!email.includes("@")) { setError("Please enter a valid email address"); return; }
      if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
      if (password !== confirmPw) { setError("Passwords do not match"); return; }
      setLoading(true);
      try {
        const res = await fetch(`${API}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed");
        localStorage.setItem("pulsemail_token", data.token);
        onLogin(data.user);
      } catch (err) {
        setError(err.message);
      } finally { setLoading(false); }
    } else {
      if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email address"); return; }
      setLoading(true);
      setTimeout(() => { setLoading(false); setSuccess("Password reset link sent to your inbox!"); setTimeout(() => { setMode("login"); setSuccess(""); }, 2500); }, 1500);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.b1}`, background: C.bg, color: C.t1, fontSize: 14, outline: "none", fontFamily: "'Outfit', sans-serif", transition: "border-color 0.2s", boxSizing: "border-box" };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: C.t3, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", display: "flex", background: C.bg, color: C.t1, position: "relative", overflow: "hidden" }}>
      <link href={FONT} rel="stylesheet" />
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
        @keyframes float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-12px) } }
        @keyframes glow { 0%,100% { opacity:0.3 } 50% { opacity:0.6 } }
        @keyframes spin { to { transform:rotate(360deg) } }
        * { box-sizing:border-box; margin:0; padding:0 }
        input::placeholder { color:${C.t3} }
        button { font-family:'Outfit',sans-serif }
      `}</style>

      {/* Left — Branding */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 60, position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${C.bg} 0%, #0D0F18 50%, #11131E 100%)` }}>
        <div style={{ position: "absolute", top: "15%", left: "10%", width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, ${C.ac}12, transparent 70%)`, animation: "float 8s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "15%", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${C.info}10, transparent 70%)`, animation: "float 6s ease-in-out infinite 2s", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${C.ac}06, transparent 70%)`, transform: "translate(-50%, -50%)", animation: "glow 4s ease-in-out infinite", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `linear-gradient(${C.t1} 1px, transparent 1px), linear-gradient(90deg, ${C.t1} 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 420, animation: "slideUp 0.8s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 40 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${C.ac}, ${C.acL})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 32px ${C.ac}40` }}>{I.mail}</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Fraunces', serif", letterSpacing: "-0.03em" }}>PulseMail</div>
              <div style={{ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>Professional Email Studio</div>
            </div>
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 700, fontFamily: "'Fraunces', serif", lineHeight: 1.2, marginBottom: 16, letterSpacing: "-0.03em" }}>
            Send smarter.<br /><span style={{ color: C.ac, fontStyle: "italic" }}>Connect</span> deeper.
          </h1>
          <p style={{ fontSize: 15, color: C.t2, lineHeight: 1.7, marginBottom: 40 }}>
            Design beautiful branded email campaigns, manage contacts, and track engagement — all in one place.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
            {[{ val: "99.2%", label: "Delivery Rate" }, { val: "2.4M", label: "Emails Sent" }, { val: "12k+", label: "Active Users" }].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Fraunces', serif", color: C.t1 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div style={{ width: 480, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 52px", background: C.s1, borderLeft: `1px solid ${C.b1}`, animation: "fadeIn 0.6s ease" }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: C.t1, marginBottom: 6 }}>
            {mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
          </h2>
          <p style={{ fontSize: 13, color: C.t2 }}>
            {mode === "login" ? "Sign in to your PulseMail workspace" : mode === "signup" ? "Start sending beautiful emails today" : "We'll send you a reset link"}
          </p>
        </div>

        {error && <div style={{ padding: "10px 14px", borderRadius: 10, background: C.errD, border: `1px solid ${C.err}30`, color: C.err, fontSize: 12, fontWeight: 500, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, animation: "slideUp 0.2s ease" }}>⚠️ {error}</div>}
        {success && <div style={{ padding: "10px 14px", borderRadius: 10, background: C.okD, border: `1px solid ${C.ok}30`, color: C.ok, fontSize: 12, fontWeight: 500, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, animation: "slideUp 0.2s ease" }}>✅ {success}</div>}

        {mode === "signup" && (
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Full Name</label>
            <input value={name} onChange={e => { setName(e.target.value); setError(""); }} onKeyDown={handleKeyDown} placeholder="Alex Okafor" style={inputStyle}
              onFocus={e => e.target.style.borderColor = C.ac} onBlur={e => e.target.style.borderColor = C.b1} />
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Email Address</label>
          <input value={email} onChange={e => { setEmail(e.target.value); setError(""); }} onKeyDown={handleKeyDown} placeholder="you@company.com" type="email" style={inputStyle}
            onFocus={e => e.target.style.borderColor = C.ac} onBlur={e => e.target.style.borderColor = C.b1} />
        </div>

        {mode !== "forgot" && (
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input value={password} onChange={e => { setPassword(e.target.value); setError(""); }} onKeyDown={handleKeyDown} placeholder="••••••••" type={showPw ? "text" : "password"} style={{ ...inputStyle, paddingRight: 44 }}
                onFocus={e => e.target.style.borderColor = C.ac} onBlur={e => e.target.style.borderColor = C.b1} />
              <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.t3, cursor: "pointer", padding: 4 }}>
                {showPw ? I.eye : <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>}
              </button>
            </div>
          </div>
        )}

        {mode === "signup" && (
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Confirm Password</label>
            <input value={confirmPw} onChange={e => { setConfirmPw(e.target.value); setError(""); }} onKeyDown={handleKeyDown} placeholder="••••••••" type={showPw ? "text" : "password"} style={inputStyle}
              onFocus={e => e.target.style.borderColor = C.ac} onBlur={e => e.target.style.borderColor = C.b1} />
          </div>
        )}

        {mode === "login" && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: C.t2, cursor: "pointer" }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ accentColor: C.ac }} /> Remember me
            </label>
            <button onClick={() => { setMode("forgot"); setError(""); }} style={{ background: "none", border: "none", color: C.ac, fontSize: 12, cursor: "pointer", fontWeight: 500 }}>Forgot password?</button>
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", padding: "13px", borderRadius: 10, border: "none",
          background: loading ? C.t3 : `linear-gradient(135deg, ${C.ac}, ${C.acL})`,
          color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : `0 4px 24px ${C.ac}40`,
          transition: "all 0.3s", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          {loading && <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />}
          {loading ? (mode === "login" ? "Signing in..." : mode === "signup" ? "Creating account..." : "Sending link...") :
           mode === "login" ? "Sign In to PulseMail →" : mode === "signup" ? "Create Account →" : "Send Reset Link →"}
        </button>

        {mode !== "forgot" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: C.b1 }} /><span style={{ fontSize: 11, color: C.t3 }}>or</span><div style={{ flex: 1, height: 1, background: C.b1 }} />
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              {[
                { label: "Google", icon: <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> },
                { label: "GitHub", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill={C.t1}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> },
              ].map((btn, i) => (
                <button key={i} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1px solid ${C.b1}`, background: "transparent", color: C.t1, fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.b2} onMouseLeave={e => e.currentTarget.style.borderColor = C.b1}>
                  {btn.icon} {btn.label}
                </button>
              ))}
            </div>
          </>
        )}

        <div style={{ textAlign: "center", fontSize: 13, color: C.t2 }}>
          {mode === "login" ? (<>Don't have an account? <button onClick={() => { setMode("signup"); setError(""); }} style={{ background: "none", border: "none", color: C.ac, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Create one free</button></>) :
           mode === "signup" ? (<>Already have an account? <button onClick={() => { setMode("login"); setError(""); }} style={{ background: "none", border: "none", color: C.ac, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Sign in</button></>) :
           (<button onClick={() => { setMode("login"); setError(""); }} style={{ background: "none", border: "none", color: C.ac, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>← Back to Sign In</button>)}
        </div>
      </div>
    </div>
  );
}


// ─── MAIN APP ───
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [showAdd, setShowAdd] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem("pulsemail_token");
    if (!token) { setAuthLoading(false); return; }
    fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setUser(data.user))
      .catch(() => localStorage.removeItem("pulsemail_token"))
      .finally(() => setAuthLoading(false));
  }, []);

  if (authLoading) return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, color: C.t1 }}>
      <link href={FONT} rel="stylesheet" />
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${C.b1}`, borderTopColor: C.ac, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <div style={{ color: C.t2, fontSize: 14 }}>Loading PulseMail...</div>
      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg) } } * { box-sizing:border-box; margin:0 }`}</style>
    </div>
  );

  if (!user) return <AuthPage onLogin={setUser} />;

  const initials = user.name.split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";
  const handleLogout = () => { localStorage.removeItem("pulsemail_token"); setUser(null); setPage("dashboard"); };

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: I.grid },
    { id: "sendmail", label: "Send Mail", icon: I.send },
    { id: "campaigns", label: "Campaigns", icon: I.mail },
    { id: "contacts", label: "Contacts", icon: I.users },
    { id: "analytics", label: "Analytics", icon: I.bar },
  ];

  const titles = { dashboard: "Dashboard", sendmail: "Send Mail", campaigns: "Campaigns", contacts: "Contacts", analytics: "Analytics" };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: C.bg, minHeight: "100vh", color: C.t1, display: "flex" }}>
      <link href={FONT} rel="stylesheet" />
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) scale(.97) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.35 } }
        @keyframes spin { to { transform:rotate(360deg) } }
        * { box-sizing:border-box; margin:0; padding:0 }
        ::-webkit-scrollbar { width:4px; height:4px }
        ::-webkit-scrollbar-track { background:transparent }
        ::-webkit-scrollbar-thumb { background:${C.b1}; border-radius:10px }
        input::placeholder, textarea::placeholder { color:${C.t3} }
        select { appearance:none }
        button { font-family:'Outfit',sans-serif }
      `}</style>

      {/* Sidebar */}
      <div style={{
        width: collapsed ? 62 : 220, minHeight: "100vh", background: C.s1,
        borderRight: `1px solid ${C.b1}`, display: "flex", flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.16,1,0.3,1)", flexShrink: 0, position: "relative",
      }}>
        <div style={{ padding: collapsed ? "18px 12px" : "18px 18px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.b1}`, minHeight: 60 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: `linear-gradient(135deg, ${C.ac}, ${C.acL})`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            boxShadow: `0 4px 14px ${C.ac}35`,
          }}>{I.mail}</div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.t1, fontFamily: "'Fraunces', serif", letterSpacing: "-0.02em" }}>PulseMail</div>
              <div style={{ fontSize: 9, color: C.t3, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Studio</div>
            </div>
          )}
        </div>

        <div style={{ padding: "10px 8px", flex: 1 }}>
          {nav.map(n => {
            const active = page === n.id;
            return (
              <button key={n.id} onClick={() => setPage(n.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: collapsed ? "9px 0" : "9px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 9, border: "none", cursor: "pointer", marginBottom: 2,
                background: active ? C.acD : "transparent",
                color: active ? C.ac : C.t2,
                fontSize: 13, fontWeight: active ? 600 : 400, transition: "all 0.2s",
              }}>{n.icon}{!collapsed && n.label}</button>
            );
          })}

          <div style={{ margin: "10px 0", borderTop: `1px solid ${C.b1}` }} />

          <button onClick={() => setPage("sendmail")} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 8,
            padding: collapsed ? "9px 0" : "9px 12px", justifyContent: "center",
            borderRadius: 9, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg, ${C.ac}, ${C.acL})`,
            color: "#fff", fontSize: 13, fontWeight: 600,
            boxShadow: `0 4px 14px ${C.ac}30`,
          }}>{I.plus}{!collapsed && "Compose"}</button>
        </div>

        <button onClick={() => setCollapsed(!collapsed)} style={{
          position: "absolute", top: 18, right: -11, width: 22, height: 22, borderRadius: "50%",
          background: C.s2, border: `1px solid ${C.b1}`, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", color: C.t3,
          transform: collapsed ? "rotate(90deg)" : "rotate(-90deg)", transition: "transform 0.3s",
        }}>{I.chevDown}</button>

        {/* User + Logout */}
        <div style={{ padding: collapsed ? "14px 8px" : "14px 16px", borderTop: `1px solid ${C.b1}`, display: "flex", alignItems: "center", gap: 8, justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${C.ok}50, ${C.info}50)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: C.t1, flexShrink: 0 }}>{initials}</div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: C.t1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: 10, color: C.t3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleLogout} title="Sign out" style={{ background: "none", border: "none", color: C.t3, cursor: "pointer", padding: 4, transition: "color 0.2s", flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = C.err} onMouseLeave={e => e.currentTarget.style.color = C.t3}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.b1}`, background: C.s1, minHeight: 58 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.t1 }}>{titles[page]}</div>
            <div style={{ fontSize: 11, color: C.t3 }}>Monday, May 18, 2026</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {page === "sendmail" && (
              <>
                <button onClick={() => setPage("sendmail")} style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${C.b1}`, background: "transparent", color: C.t1, fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>{I.plus} Send Mail</button>
                <button style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: C.ac, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Import Contacts</button>
              </>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 9, background: C.bg, border: `1px solid ${C.b1}`, minWidth: 180 }}>
              <span style={{ color: C.t3 }}>{I.search}</span>
              <input placeholder="Search..." style={{ border: "none", background: "transparent", outline: "none", color: C.t1, fontSize: 12, fontFamily: "'Outfit', sans-serif", width: "100%" }} />
            </div>
            <button style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${C.b1}`, background: "transparent", color: C.t2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {I.bell}<div style={{ position: "absolute", top: 7, right: 8, width: 5, height: 5, borderRadius: "50%", background: C.err }} />
            </button>
            <button style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${C.b1}`, background: "transparent", color: C.t2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{I.gear}</button>
          </div>
        </div>

        <div style={{ flex: 1, padding: page === "sendmail" ? 20 : 24, overflowY: "auto" }}>
          {page === "dashboard" && <DashboardPage />}
          {page === "sendmail" && <SendMailPage user={user} />}
          {page === "campaigns" && <CampaignsPage />}
          {page === "contacts" && <ContactsPage onAdd={() => setShowAdd(true)} />}
          {page === "analytics" && <AnalyticsPage />}
        </div>
      </div>

      {showAdd && <AddContactModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}