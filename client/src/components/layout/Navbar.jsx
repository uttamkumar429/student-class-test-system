function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8">

      <h2 className="text-2xl font-bold text-slate-800">
        Dashboard
      </h2>

      <div className="text-right">

        <h3 className="font-semibold">
          {user?.fullName}
        </h3>

        <p className="text-sm text-slate-500">
          {user?.role}
        </p>

      </div>

    </header>
  );
}

export default Navbar;