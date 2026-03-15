import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  Warehouse,
  Bluetooth,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Activity,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  const portals = [
    {
      path: "/sender",
      title: "Sender Portal",
      description: "Create and track your shipments",
      icon: Package,
      color: "from-blue-500 to-blue-600",
      features: ["Real-time tracking", "ESP32 integration", "Status updates"],
    },
    {
      path: "/receiver",
      title: "Receiver Portal",
      description: "View and verify incoming packages",
      icon: Truck,
      color: "from-emerald-500 to-emerald-600",
      features: [
        "Bluetooth verification",
        "Package validation",
        "Secure receipt",
      ],
    },
    {
      path: "/warehouse",
      title: "Warehouse Tracker",
      description: "Real-time BLE detection monitoring",
      icon: Warehouse,
      color: "from-violet-500 to-violet-600",
      features: ["Live monitoring", "Detection history", "System status"],
    },
  ];

  const stats = [
    {
      number: "24",
      label: "Active Shipments",
      icon: Package,
      change: "+12%",
      color: "text-blue-400",
    },
    {
      number: "89",
      label: "BLE Devices",
      icon: Bluetooth,
      change: "Stable",
      color: "text-emerald-400",
    },
    {
      number: "1,203",
      label: "Verified Packages",
      icon: Shield,
      change: "+5%",
      color: "text-purple-400",
    },
  ];

  return (
    <div className="flex flex-col space-y-16 animate-fadeIn text-slate-100 pb-20">
      <section className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Warehouse size={400} />
        </div>

        <div className="relative z-10 p-10 md:p-16 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium tracking-wide">
              <Zap size={14} className="fill-current" />
              <span>POWERED BY ESP32 BLE TECHNOLOGY</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Smart Inventory & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Logistics Automation
              </span>
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed max-w-xl tracking-wide">
              Revolutionize your warehouse operations with real-time package
              tracking, instant verification, and seamless BLE beacon
              integration.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <Link
                to="/sender"
                className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-blue-900/20 flex items-center gap-3 group text-lg"
              >
                Get Started{" "}
                <ArrowRight
                  size={22}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to="/warehouse"
                className="px-10 py-4 rounded-xl font-bold tracking-wide text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-all flex items-center gap-3 text-lg"
              >
                <Activity size={22} /> Live Demo
              </Link>
            </div>
          </div>

          <div className="hidden xl:block relative w-[500px] h-[400px] flex-shrink-0">
            <div className="absolute inset-0 bg-blue-500/5 rounded-2xl rotate-3 border border-white/5 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl -rotate-3 border border-white/5 backdrop-blur-sm"></div>
            <div className="absolute inset-0 bg-slate-800/80 rounded-2xl border border-white/10 shadow-2xl p-8 flex flex-col gap-6">
              <div className="h-28 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 p-5 flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Package size={32} />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-32 bg-slate-700 rounded-lg"></div>
                  <div className="h-3 w-48 bg-slate-800 rounded-lg"></div>
                </div>
              </div>
              <div className="h-28 rounded-xl bg-slate-900/50 border border-white/5 p-5 flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Truck size={32} />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-32 bg-slate-700 rounded-lg"></div>
                  <div className="h-3 w-24 bg-slate-800 rounded-lg"></div>
                </div>
              </div>
              <div className="mt-auto flex gap-3">
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-slate-800/40 border border-white/5 hover:border-white/10 hover:bg-slate-800/60 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 rounded-xl bg-slate-900/50 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                  <Icon size={32} className={stat.color} />
                </div>
                <span
                  className={`text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full ${stat.change.includes("+")
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-slate-700 text-slate-400"
                    }`}
                >
                  {stat.change}
                </span>
              </div>
              <div className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                {stat.number}
              </div>
              <div className="text-base text-slate-400 font-medium tracking-wide">
                {stat.label}
              </div>
            </div>
          );
        })}
      </section>

      <section>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Access Portals
          </h2>
          <div className="h-px w-full max-w-xs bg-gradient-to-r from-blue-500/20 to-transparent ml-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portals
            .filter((portal) => {
              if (!user) return true;
              if (user.role === "admin") return true;
              if (user.role === "sender") return portal.path !== "/receiver";
              if (user.role === "receiver") return portal.path !== "/sender";
              return true;
            })
            .map((portal) => {
              const Icon = portal.icon;
              return (
                <Link
                  key={portal.path}
                  to={portal.path}
                  className="group relative overflow-hidden rounded-3xl bg-slate-800 border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 h-full flex flex-col"
                >
                  <div
                    className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${portal.color}`}
                  ></div>

                  <div className="p-8 lg:p-10 relative z-10 flex-1 flex flex-col">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${portal.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="text-white" size={32} />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors tracking-tight">
                      {portal.title}
                    </h3>
                    <p className="text-slate-400 text-base mb-8 line-clamp-3 leading-relaxed">
                      {portal.description}
                    </p>

                    <ul className="space-y-4 mb-8 mt-auto">
                      {portal.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-sm text-slate-500 group-hover:text-slate-300 transition-colors"
                        >
                          <CheckCircle
                            size={16}
                            className="text-blue-500/50 group-hover:text-blue-400 flex-shrink-0"
                          />
                          <span className="font-medium tracking-wide">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 group-hover:translate-x-2 transition-transform uppercase tracking-widest mt-4">
                      Enter Portal <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>

      <section className="py-12 border-t border-white/5">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">
            Why Choose WareHub?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Built for modern logistics with real-time tracking and verification.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Real-Time Tracking",
              icon: Zap,
              color: "text-yellow-400",
            },
            {
              title: "Secure Verification",
              icon: Shield,
              color: "text-purple-400",
            },
            {
              title: "ESP32 Powered",
              icon: Bluetooth,
              color: "text-blue-400",
            },
            {
              title: "Mobile Friendly",
              icon: Smartphone,
              color: "text-pink-400",
            },
          ].map((feat, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-900/50 border border-white/5 flex items-center gap-3"
            >
              <feat.icon className={feat.color} size={20} />
              <span className="font-medium text-slate-200">{feat.title}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-8 border-t border-white/5 mt-auto text-center text-slate-500 text-sm">
        <p>
          © {new Date().getFullYear()} WareHub. Made with logic by ❤️.
        </p>
      </footer>
    </div>
  );
}
