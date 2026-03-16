import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { employeeService, attendanceService } from "../services/api";
import { Card, Button, FormField, Select, Badge, LoadingState, ErrorState, EmptyState, Modal } from "../components/UI";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeId: "", date: new Date().toISOString().split("T")[0], status: "Present" });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [emps, recs] = await Promise.all([
        employeeService.getAll(),
        attendanceService.getAll(),
      ]);
      setEmployees(emps);
      setRecords(recs);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const loadFiltered = async () => {
    try {
      const params = {};
      if (filterEmployee) params.employeeId = filterEmployee;
      if (filterDate) params.date = filterDate;
      const recs = await attendanceService.getAll(params);
      setRecords(recs);
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    if (!loading) loadFiltered();
  }, [filterEmployee, filterDate]);

  const validate = () => {
    const errs = {};
    if (!form.employeeId) errs.employeeId = "Required";
    if (!form.date) errs.date = "Required";
    if (!form.status) errs.status = "Required";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      await attendanceService.mark(form);
      toast.success("Attendance marked successfully");
      setShowModal(false);
      setForm({ employeeId: "", date: new Date().toISOString().split("T")[0], status: "Present" });
      setFormErrors({});
      loadFiltered();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const clearFilters = () => {
    setFilterEmployee("");
    setFilterDate("");
  };

  const hasFilters = filterEmployee || filterDate;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>Attendance</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>{records.length} records</p>
        </div>
        <Button onClick={() => { setForm({ employeeId: "", date: new Date().toISOString().split("T")[0], status: "Present" }); setFormErrors({}); setShowModal(true); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Mark Attendance
        </Button>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px", fontWeight: 500 }}>Filter by Employee</div>
          <Select value={filterEmployee} onChange={(e) => setFilterEmployee(e.target.value)}>
            <option value="">All Employees</option>
            {employees.map((e) => (
              <option key={e._id} value={e._id}>{e.fullName} ({e.employeeId})</option>
            ))}
          </Select>
        </div>
        <div style={{ flex: 1, minWidth: "180px" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px", fontWeight: 500 }}>Filter by Date</div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{
              width: "100%",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "10px 12px",
              color: "var(--text-primary)",
              fontSize: "14px",
              fontFamily: "var(--font-sans)",
              outline: "none",
              colorScheme: "dark",
            }}
          />
        </div>
        {hasFilters && (
          <Button variant="secondary" onClick={clearFilters} style={{ alignSelf: "flex-end" }}>
            Clear Filters
          </Button>
        )}
      </div>

      <Card>
        {loading ? (
          <LoadingState message="Loading attendance..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : records.length === 0 ? (
          <EmptyState
            icon="📅"
            title={hasFilters ? "No records match your filters" : "No attendance records yet"}
            description={!hasFilters ? "Start marking daily attendance for your employees." : undefined}
            action={!hasFilters ? (
              <Button onClick={() => setShowModal(true)}>Mark Attendance</Button>
            ) : undefined}
          />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  {["Employee ID", "Name", "Department", "Date", "Status"].map((h) => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((rec, i) => (
                  <tr
                    key={rec._id}
                    style={{ borderBottom: i < records.length - 1 ? "1px solid var(--border-subtle)" : "none", animation: `fadeIn 0.2s ease ${i * 0.02}s both` }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "13px 20px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent)", background: "var(--accent-glow)", padding: "3px 8px", borderRadius: "4px" }}>
                        {rec.employee?.employeeId}
                      </span>
                    </td>
                    <td style={{ padding: "13px 20px", fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>{rec.employee?.fullName}</td>
                    <td style={{ padding: "13px 20px" }}>
                      <Badge variant="accent">{rec.employee?.department}</Badge>
                    </td>
                    <td style={{ padding: "13px 20px", fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text-secondary)" }}>{rec.date}</td>
                    <td style={{ padding: "13px 20px" }}>
                      <Badge variant={rec.status === "Present" ? "present" : "absent"}>{rec.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Mark Attendance">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <FormField label="Employee" error={formErrors.employeeId}>
            <Select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">Select employee</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>{e.fullName} — {e.employeeId}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Date" error={formErrors.date}>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "10px 12px",
                color: "var(--text-primary)",
                fontSize: "14px",
                fontFamily: "var(--font-sans)",
                outline: "none",
                width: "100%",
                colorScheme: "dark",
              }}
            />
          </FormField>
          <FormField label="Status" error={formErrors.status}>
            <div style={{ display: "flex", gap: "10px" }}>
              {["Present", "Absent"].map((s) => (
                <button
                  key={s}
                  onClick={() => setForm({ ...form, status: s })}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "var(--radius-sm)",
                    border: form.status === s
                      ? `1px solid ${s === "Present" ? "var(--green)" : "var(--red)"}`
                      : "1px solid var(--border)",
                    background: form.status === s
                      ? s === "Present" ? "var(--green-dim)" : "var(--red-dim)"
                      : "var(--bg-elevated)",
                    color: form.status === s
                      ? s === "Present" ? "var(--green)" : "var(--red)"
                      : "var(--text-secondary)",
                    fontSize: "14px",
                    fontWeight: form.status === s ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </FormField>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", background: "var(--bg-elevated)", padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
            If attendance already exists for this employee on this date, it will be updated.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "4px" }}>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSubmit} loading={submitting}>Mark Attendance</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
