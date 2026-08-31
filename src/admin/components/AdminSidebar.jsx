import { NavLink } from "react-router-dom";

function AdminSidebar() {
  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
    },
    {
      name: "Products",
      path: "/admin/products",
    },
    {
      name: "Users",
      path: "/admin/users",
    },
    {
      name: "Orders",
      path: "/admin/orders",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#5a3e2b] text-white p-5">
      
      <div className="mb-10">
        <h1 className="text-2xl font-serif font-bold">
          INARAH
        </h1>

        <p className="text-sm tracking-widest">
          ADMIN PANEL
        </p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-[#6b4b35] text-[#5a3e2b]"
                  : "hover:bg-[#6b4b35] "
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}

export default AdminSidebar;