import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { employeeService } from "../services/api";
import {
  Card, Button, Modal, FormField, Input, Select,
  LoadingState, ErrorState, EmptyState, Badge, ConfirmDialog, Spinner,
} from "../components/UI";

const DEPARTMENTS = ["Engineering", "Design", "Product", "Marketing", "Sales", "HR", "Finance", "Operations"];

const INITIAL_FORM = { employeeId: "", fullName: "", email: "", department: "" };

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const validate = () => {
    const errs = {};
    if (!form.employeeId.trim()) errs.employeeId = "Required";
    if (!form.fullName.trim()) errs.fullName = "Required";
    if (!form.email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.department) errs.department = "Required";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      await employeeService.create(form);
      toast.success("Employee added successfully");
      setShowModal(false);
      setForm(INITIAL_FORM);
      setFormErrors({});
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await employeeService.delete(confirmDelete._id);
      toast.success("Employee deleted");
      setConfirmDelete(null);
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = employees.filter(
    (e) =>
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>Employees</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>{employees.length} total employees</p>
        </div>
        <Button onClick={() => { setForm(INITIAL_FORM); setFormErrors({}); setShowModal(true); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Employee
        </Button>
      </div>

      <div style={{ position: "relative" }}>
        <svg
          style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <Input
          placeholder="Search by name, ID, department or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: "40px" }}
        />
      </div>

      <Card>
        {loading ? (
          <LoadingState message="Fetching employees..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="👥"
            title={search ? "No employees match your search" : "No employees yet"}
            description={!search ? "Add your first employee to get started." : undefined}
            action={!search ? (
              <Button onClick={() => setShowModal(true)}>Add Employee</Button>
            ) : undefined}
          />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  {["Employee ID", "Name", "Email", "Department", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 20px",
                        textAlign: "left",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp, i) => (
                  <tr
                    key={emp._id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid var(--border-subtle)" : "none",
                      transition: "background 0.1s ease",
                      animation: `fadeIn 0.2s ease ${i * 0.03}s both`,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--accent)", background: "var(--accent-glow)", padding: "3px 8px", borderRadius: "4px" }}>
                        {emp.employeeId}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "var(--accent-glow)",
                            border: "1px solid rgba(108,99,255,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "var(--accent)",
                            flexShrink: 0,
                          }}
                        >
                          {emp.fullName.charAt(0).toUpperCase()}
                        </div>
                        <Link
                          to={`/employees/${emp._id}`}
                          style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", textDecoration: "none" }}
                          onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
                          onMouseLeave={(e) => (e.target.style.color = "var(--text-primary)")}
                        >
                          {emp.fullName}
                        </Link>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--text-secondary)" }}>{emp.email}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <Badge variant="accent">{emp.department}</Badge>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Link to={`/employees/${emp._id}`}>
                          <Button variant="secondary" style={{ padding: "6px 12px", fontSize: "12px" }}>View</Button>
                        </Link>
                        <Button
                          variant="danger"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                          onClick={() => setConfirmDelete(emp)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Employee">
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <FormField label="Employee ID" error={formErrors.employeeId}>
            <Input
              placeholder="e.g. EMP-001"
              value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            />
          </FormField>
          <FormField label="Full Name" error={formErrors.fullName}>
            <Input
              placeholder="John Doe"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </FormField>
          <FormField label="Email Address" error={formErrors.email}>
            <Input
              type="email"
              placeholder="john@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </FormField>
          <FormField label="Department" error={formErrors.department}>
            <Select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
          </FormField>
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSubmit} loading={submitting}>Add Employee</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete Employee"
        description={`Are you sure you want to delete ${confirmDelete?.fullName}? This will also remove all their attendance records.`}
        loading={deleting}
      />
    </div>
  );
}
