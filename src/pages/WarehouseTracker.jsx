import { useState } from "react";
import { useRealtimeData } from "../hooks/useRealtimeData";
import ScannerStatus from "../components/warehouse/ScannerStatus";
import DetectionCards from "../components/warehouse/DetectionCards";
import DetectionHistory from "../components/warehouse/DetectionHistory";
import { Warehouse, Bluetooth, Activity, RefreshCw } from "lucide-react";

export default function WarehouseTracker() {
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: scanner, loading: scannersLoading } = useRealtimeData(
    "warehouse/scanner",
    { enabled: autoRefresh, isObject: true },
  );

  const { data: detections, loading: detectionsLoading } = useRealtimeData(
    "warehouse/detections",
    {
      limitToLast: 50,
      sortBy: "timestamp",
      sortDesc: true,
      enabled: autoRefresh,
    },
  );

  const { data: currentStatus } = useRealtimeData("warehouse/current_status", {
    enabled: autoRefresh,
  });

  const { data: products } = useRealtimeData("products", {
    enabled: autoRefresh,
  });

  const totalDetections = detections?.length || 0;
  const presentDevices = currentStatus?.filter((s) => s.present).length || 0;
  const totalDevices = currentStatus?.length || 0;

  return (
    <div className="page-container portal-container">
      <div className="header-section">
        <div
          className="icon-wrapper mx-auto mb-4"
          style={{
            width: "3.5rem",
            height: "3.5rem",
            borderRadius: "1rem",
            background: "var(--color-primary)",
          }}
        >
          <Warehouse size={28} />
        </div>
        <h1 className="portal-title">Warehouse Tracker</h1>
        <p className="portal-description">
          Real-time BLE detection monitoring for your warehouse operations
        </p>
      </div>

      <div className="warehouse-stats-grid">
        <div className="stats-card">
          <div className="number">{totalDevices}</div>
          <div className="label flex items-center justify-center gap-2">
            <Bluetooth size={14} />
            Total
          </div>
        </div>
        <div className="stats-card">
          <div className="number" style={{ color: "var(--color-success)" }}>
            {presentDevices}
          </div>
          <div className="label flex items-center justify-center gap-2">
            <Activity size={14} />
            Present
          </div>
        </div>
        <div className="stats-card">
          <div className="number" style={{ color: "var(--primary-start)" }}>
            {totalDetections}
          </div>
          <div className="label flex items-center justify-center gap-2">
            <RefreshCw size={14} />
            Detections
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            autoRefresh
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-card)] text-gray-300 border border-[var(--divider)]"
          }`}
        >
          <RefreshCw size={16} className={autoRefresh ? "animate-spin" : ""} />
          {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
        </button>
      </div>

      <div className="warehouse-content">
        <div className="card">
          <ScannerStatus scanner={scanner} loading={scannersLoading} />
        </div>

        <div className="card">
          <DetectionCards detections={detections} products={products} />
        </div>

        <div className="card">
          <DetectionHistory
            detections={detections}
            loading={detectionsLoading}
          />
        </div>
      </div>
    </div>
  );
}
