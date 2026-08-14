import NotificationBell from "./notifications/NotificationBell";

function StudentTopbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-100/95 px-8 py-4 backdrop-blur">
      <div className="flex items-center justify-end">
        <NotificationBell />
      </div>
    </header>
  );
}

export default StudentTopbar;