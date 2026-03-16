import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { employeeService, attendanceService } from "../services/api";
import { StatCard, Card, Badge, LoadingState, ErrorState } from "../components/UI";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, emps, att] = await Promise.all([
        employeeService.getStats(),
        employeeService.getAll(),
        attendanceService.getAll(),
      ]);
      setStats(s);
      setEmployees(emps.slice(0, 5));
      setRecentAttendance(att.slice(0, 8));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingState message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div>
        <h1 style={{ fontSize: "22px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
          Good day, Admin 👋
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <StatCard
          label="Total Employees"
          value={stats?.totalEmployees ?? 0}
          color="var(--accent)"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatCard
          label="Departments"
          value={stats?.totalDepartments ?? 0}
          color="var(--amber)"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          }
        />
        <StatCard
          label="Attendance Rate"
          value={`${stats?.attendanceRate ?? 0}%`}
          color="var(--green)"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          }
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <Card>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Recent Employees</span>
            <Link to="/employees" style={{ fontSize: "12px", color: "var(--accent)", textDecoration: "none" }}>View all →</Link>
          </div>
          {employees.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>No employees yet</div>
          ) : (
            <div>
              {employees.map((emp, i) => (
                <Link
                  key={emp._id}
                  to={`/employees/${emp._id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 24px",
                    borderBottom: i < employees.length - 1 ? "1px solid var(--border-subtle)" : "none",
                    textDecoration: "none",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "var(--accent-glow)",
                      border: "1px solid rgba(108,99,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--accent)",
                      flexShrink: 0,
                    }}
                  >
                    {emp.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{emp.fullName}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{emp.department}</div>
                  </div>
                  <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{emp.employeeId}</span>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Recent Attendance</span>
            <Link to="/attendance" style={{ fontSize: "12px", color: "var(--accent)", textDecoration: "none" }}>Mark attendance →</Link>
          </div>
          {recentAttendance.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>No attendance records</div>
          ) : (
            <div>
              {recentAttendance.map((rec, i) => (
                <div
                  key={rec._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 24px",
                    borderBottom: i < recentAttendance.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>{rec.employee?.fullName}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>{rec.date}</div>
                  </div>
                  <Badge variant={rec.status === "Present" ? "present" : "absent"}>{rec.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
