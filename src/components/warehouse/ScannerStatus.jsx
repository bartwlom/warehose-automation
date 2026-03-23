import {
  Radio,
  CircleCheck as CheckCircle2,
  CircleX as XCircle,
  Activity,
} from "lucide-react";
import { formatTimeSince } from "../../utils/formatters";

export default function ScannerStatus({ scanner, loading }) {
  if (loading) {
    return (
      <div className="p-6">
        <div className="h-24 animate-pulse bg-gray-800 rounded"></div>
      </div>
    );
  }

  const getStatusInfo = (scanner) => {
    if (!scanner) {
      return {
        text: "Not Connected",
        color: "text-gray-400",
        bgColor: "bg-gray-700/20",
        icon: Radio,
      };
    }

    const status = scanner.status;
    const lastSeen = scanner.last_seen || scanner.last_ping;
    const isStale =
      lastSeen && Date.now() - new Date(lastSeen).getTime() > 30000;

    if (isStale) {
      return {
        text: "Offline",
        color: "text-red-400",
        bgColor: "bg-red-400/10",
        icon: XCircle,
      };
    }

    switch (status) {
      case "scanning":
        return {
          text: "Scanning...",
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
          icon: Activity,
        };
      case "online":
      case "active":
        return {
          text: "Online",
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          icon: CheckCircle2,
        };
      default:
        return {
          text: "Not Connected",
          color: "text-gray-400",
          bgColor: "bg-gray-700/20",
          icon: Radio,
        };
    }
  };

  const statusInfo = getStatusInfo(scanner);
  const StatusIcon = statusInfo.icon;

  const stats = [
    {
      label: "Expected",
      value: scanner?.scan_summary?.expected || 0,
      color: "text-blue-400",
    },
    {
      label: "Detected",
      value: scanner?.scan_summary?.received || 0,
      color: "text-green-400",
    },
    {
      label: "Sent",
      value: scanner?.scan_summary?.sent || 0,
      color: "text-yellow-400",
    },
    {
      label: "Irrelevant",
      value: scanner?.scan_summary?.irrelevant || 0,
      color: "text-gray-400",
    },
  ];

  const lastSeen = scanner?.last_seen || scanner?.last_ping;

  return (
    <div>
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${statusInfo.bgColor}`}>
              <StatusIcon
                className={`${statusInfo.color} ${
                  scanner?.status === "scanning" ? "animate-pulse" : ""
                }`}
                size={24}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">ESP32 Master</h3>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`w-2 h-2 rounded-full ${statusInfo.bgColor}`}
                ></div>
                <span className={`text-sm font-medium ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Last Active</p>
            <p className="text-sm font-medium text-gray-300">
              {lastSeen ? formatTimeSince(lastSeen) : "Never"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h4 className="text-sm font-medium text-gray-400 mb-4">
          Current Scan Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-gray-800/50 rounded-lg p-4">
              <p className={`text-sm font-medium ${stat.color}`}>
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {stat.value}
                <span className="text-sm ml-1 text-gray-400">items</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
