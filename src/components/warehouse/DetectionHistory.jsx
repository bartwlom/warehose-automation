import { Clock, Signal, Package, History } from "lucide-react";
import { formatDateTime } from "../../utils/formatters";

export default function DetectionHistory({ detections, loading }) {
  if (loading) {
    return (
      <div className="p-6 border-b border-gray-700/50">
        <h3 className="text-lg font-semibold text-white">Detection History</h3>
        <div className="animate-pulse space-y-4">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="border-b border-gray-700/50 py-4">
                <div className="h-6 bg-gray-800 animate-pulse rounded w-1/3"></div>
                <div className="mt-2 h-4 bg-gray-800 animate-pulse rounded w-1/4"></div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (!detections || detections.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Detection History</h2>
        <div className="text-center text-gray-400 py-6">
          <div className="inline-block p-3 bg-gray-800/50 rounded-lg mb-2">
            <History className="text-gray-500" size={24} />
          </div>
          <p>No detections found</p>
        </div>
      </div>
    );
  }

  const deviceMap = new Map();
  detections.forEach((detection) => {
    if (!detection.deviceName) return;

    const existing = deviceMap.get(detection.deviceName);
    if (
      !existing ||
      new Date(detection.timestamp) > new Date(existing.timestamp)
    ) {
      deviceMap.set(detection.deviceName, detection);
    }
  });

  const latestDetections = Array.from(deviceMap.values()).sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Detection History</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b dark:border-gray-700">
              <th className="pb-3 font-semibold text-gray-700 dark:text-gray-300">
                Device Name
              </th>
              <th className="pb-3 font-semibold text-gray-700 dark:text-gray-300">
                Package ID
              </th>
              <th className="pb-3 font-semibold text-gray-700 dark:text-gray-300">
                Status
              </th>
              <th className="pb-3 font-semibold text-gray-700 dark:text-gray-300">
                Signal Strength
              </th>
              <th className="pb-3 font-semibold text-gray-700 dark:text-gray-300">
                Last Seen
              </th>
            </tr>
          </thead>
          <tbody>
            {latestDetections.map((detection) => (
              <tr
                key={detection.deviceName}
                className="border-b dark:border-gray-700"
              >
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <Package
                      size={16}
                      className="text-gray-400 dark:text-gray-500"
                    />
                    <span className="font-medium">{detection.deviceName}</span>
                  </div>
                </td>
                <td className="py-3">{detection.deviceName}</td>
                <td className="py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      detection.present
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {detection.present ? "✓ Present" : "✗ Not Present"}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1">
                    <Signal
                      size={14}
                      className="text-gray-400 dark:text-gray-500"
                    />
                    <span>{detection.rssi} dBm</span>
                  </div>
                </td>
                <td className="py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Clock
                      size={14}
                      className="text-gray-400 dark:text-gray-500"
                    />
                    {formatDateTime(detection.timestamp)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
