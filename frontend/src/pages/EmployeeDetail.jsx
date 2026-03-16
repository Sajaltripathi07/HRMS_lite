import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { employeeService, attendanceService } from "../services/api";
import { Card, Badge, Button, LoadingState, ErrorState, ConfirmDialog } from "../components/UI";

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState({ records: [], totalPresent: 0, totalDays: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [filterDate, setFilterDate] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [emps, att] = await Promise.all([
        employeeService.getAll(),
        attendanceService.getByEmployee(id),
      ]);
      const emp = emps.find((e) => e._id === id);
      if (!emp) { setError("Employee not found"); return; }
      setEmployee(emp);
      setAttendance(att);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await employeeService.delete(id);
      toast.success("Employee deleted");
      navigate("/employees");
    } catch (e) {
      toast.error(e.message);
      setDeleting(false);
    }
  };

  if (loading) return <LoadingState message="Loading employee..." />;
  if (error) return <ErrorState message={error} />;

  const filteredRecords = filterDate
    ? attendance.records.filter((r) => r.date === filterDate)
    : attendance.records;

  const attendanceRate = attendance.totalDays > 0
    ? Math.round((attendance.totalPresent / attendance.totalDays) * 100)
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Link
          to="/employees"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "var(--text-muted)",
            textDecoration: "none",
            padding: "6px 10px",
            borderRadius: "var(--radius-sm)",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>/</span>
        <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{employee.fullName}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Card style={{ padding: "28px 24px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "var(--accent-glow)",
                  border: "2px solid rgba(108,99,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  fontWeight: 600,
                  color: "var(--accent)",
                }}
              >
                {employee.fullName.charAt(0).toUpperCase()}
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>{employee.fullName}</div>
                <Badge variant="accent" style={{ marginTop: "6px" }}>{employee.department}</Badge>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Employee ID", value: employee.employeeId, mono: true },
                { label: "Email", value: employee.email },
                { label: "Department", value: employee.department },
                { label: "Joined", value: new Date(employee.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) },
              ].map(({ label, value, mono }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: mono ? "var(--font-mono)" : undefined }}>{value}</span>
                </div>
              ))}
            </div>

            <Button
              variant="danger"
              onClick={() => setConfirmDelete(true)}
              style={{ width: "100%", marginTop: "24px", justifyContent: "center" }}
            >
              Delete Employee
            </Button>
          </Card>

          <Card style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "16px" }}>
              Attendance Summary
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Total Days Recorded", value: attendance.totalDays },
                { label: "Days Present", value: attendance.totalPresent, color: "var(--green)" },
                { label: "Days Absent", value: attendance.totalDays - attendance.totalPresent, color: "var(--red)" },
                { label: "Attendance Rate", value: `${attendanceRate}%`, color: attendanceRate >= 80 ? "var(--green)" : "var(--amber)" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{label}</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: color || "var(--text-primary)" }}>{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Attendance Records</span>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "7px 10px",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                  outline: "none",
                  colorScheme: "dark",
                }}
              />
              {filterDate && (
                <Button variant="secondary" onClick={() => setFilterDate("")} style={{ padding: "6px 10px", fontSize: "12px" }}>
                  Clear
                </Button>
              )}
            </div>
          </div>

          {filteredRecords.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
              {filterDate ? "No records for this date" : "No attendance records yet"}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    {["Date", "Status"].map((h) => (
                      <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((rec, i) => (
                    <tr
                      key={rec._id}
                      style={{ borderBottom: i < filteredRecords.length - 1 ? "1px solid var(--border-subtle)" : "none", animation: `fadeIn 0.2s ease ${i * 0.02}s both` }}
                    >
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
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Employee"
        description={`Delete ${employee.fullName}? This will also remove all attendance records.`}
        loading={deleting}
      />
    </div>
  );
}
