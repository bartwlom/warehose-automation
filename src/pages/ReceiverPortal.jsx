import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ref, update, get } from "firebase/database";
import { database } from "../firebase/config";
import { useAuth } from "../hooks/useAuth";
import { useProducts } from "../hooks/useProducts";
import { useRealtimeData } from "../hooks/useRealtimeData";
import ProductList from "../components/receiver/ProductList";
import {
  Radio,
  Package,
  CheckCircle,
  XCircle,
  Bluetooth,
  Shield,
  Clock,
  BadgeCheck,
} from "lucide-react";

export default function ReceiverPortal() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { updateProduct } = useProducts();
  const [isScanning, setIsScanning] = useState(false);

  const { data: allProducts } = useRealtimeData("products");
  const { data: currentStatus } = useRealtimeData("warehouse/current_status");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const myProducts = useMemo(
    () => allProducts?.filter((p) => p.receiver_email === user?.email) || [],
    [allProducts, user?.email]
  );

  useEffect(() => {
    if (!currentStatus || currentStatus.length === 0 || !myProducts) return;

    const statusMap = new Map(currentStatus.map((s) => [s.id, s]));

    const syncProducts = async () => {
      const promises = myProducts.map(async (product) => {
        try {
          if (!product || !product.device_name || product.status === "received")
            return;

          const deviceEntry = statusMap.get(product.device_name);
          const newStatus =
            deviceEntry && deviceEntry.present ? "present" : "missing";

          if (newStatus !== product.status) {
            await updateProduct(product.id, {
              status: newStatus,
              updated_date: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.error("Error syncing product status from current_status:", err);
        }
      });
      await Promise.all(promises);
    };

    syncProducts();
  }, [currentStatus, myProducts, updateProduct]);

  const handleMarkReceived = async (product) => {
    await updateProduct(product.id, {
      status: "received",
      received_date: new Date().toISOString(),
    });
  };

  const simulateBluetoothVerification = async () => {
    setIsScanning(true);

    try {
      const triggerRef = ref(database, "warehouse/scanner/trigger_scan");
      await update(triggerRef, {
        requested: true,
        requested_by: user.email,
        requested_at: new Date().toISOString(),
      });

      const scannerStatusRef = ref(database, "warehouse/scanner");
      await update(scannerStatusRef, {
        status: "scanning",
        last_seen: new Date().toISOString(),
      });

      let scanComplete = false;
      let attempts = 0;
      const maxAttempts = 15;

      while (!scanComplete && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        attempts++;

        const detectionsRef = ref(database, "warehouse/detections");
        const detectionsSnapshot = await get(detectionsRef);
        const allDetections = detectionsSnapshot.val();

        if (allDetections) {
          const recentDetections = Object.values(allDetections).filter(
            (detection) => {
              const detectionTime = detection.timestamp
                ? parseInt(detection.timestamp)
                : 0;
              return Date.now() - detectionTime < 30000;
            }
          );

          if (recentDetections.length > 0) {
            scanComplete = true;
          }
        }
      }

      const currentStatusRef = ref(database, "warehouse/current_status");
      const currentStatusSnapshot = await get(currentStatusRef);
      const currentStatusData = currentStatusSnapshot.val() || {};

      const detectedDevices = new Set();
      Object.entries(currentStatusData).forEach(([deviceName, status]) => {
        if (status.present === true) {
          detectedDevices.add(deviceName);
        }
      });

      const receiverDeviceMap = new Map();
      myProducts.forEach((product) => {
        if (product.device_name) {
          receiverDeviceMap.set(product.device_name, product);
        }
      });

      for (const product of myProducts) {
        if (product.status === "received") continue;

        const deviceName = product.device_name;
        const isDetected = detectedDevices.has(deviceName);

        let newStatus;
        if (isDetected) {
          newStatus = receiverDeviceMap.has(deviceName)
            ? "present"
            : "irrelevant";
        } else {
          newStatus =
            product.receiver_email === user.email ? "missing" : "irrelevant";
        }

        if (product.status !== newStatus) {
          await updateProduct(product.id, {
            status: newStatus,
            updated_date: new Date().toISOString(),
          });
        }
      }

      await update(triggerRef, { requested: false });
      await update(scannerStatusRef, { status: "online" });

      const presentCount = myProducts.filter(
        (p) => p.status === "present"
      ).length;
      const missingCount = myProducts.filter(
        (p) => p.status === "missing"
      ).length;
      const detectedCount = detectedDevices.size;

      alert(
        `Bluetooth verification complete!\n\nDetected Slaves: ${detectedCount}/3\nYour Packages:\n✓ ${presentCount} Present\n✗ ${missingCount} Missing`
      );
    } catch (error) {
      console.error("Verification error:", error);
      if (error.code === "PERMISSION_DENIED") {
        alert(
          "Verification failed: Permission Denied.\n\nPlease ensure your Firebase Realtime Database rules allow writing to 'warehouse/scanner' and 'warehouse/detections'."
        );
      } else {
        alert(
          "Verification failed. Please try again.\nError: " + error.message
        );
      }
    } finally {
      setIsScanning(false);
    }
  };

  const presentCount = myProducts.filter((p) => p.status === "present").length;
  const missingCount = myProducts.filter((p) => p.status === "missing").length;
  const receivedCount = myProducts.filter(
    (p) => p.status === "received"
  ).length;

  if (authLoading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

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
          <Package size={28} />
        </div>
        <h1 className="portal-title">Receiver Portal</h1>
        <p className="portal-description">
          Verify incoming packages with Bluetooth scanning and track your
          deliveries in real-time
        </p>
      </div>

      <div className="receiver-stats-grid">
        <div className="stats-card">
          <div className="number">{myProducts.length}</div>
          <div className="label flex items-center justify-center gap-2">
            <Package size={14} />
            Total
          </div>
        </div>
        <div className="stats-card">
          <div className="number" style={{ color: "var(--color-success)" }}>
            {presentCount}
          </div>
          <div className="label flex items-center justify-center gap-2">
            <CheckCircle size={14} />
            Present
          </div>
        </div>
        <div className="stats-card">
          <div className="number" style={{ color: "var(--color-error)" }}>
            {missingCount}
          </div>
          <div className="label flex items-center justify-center gap-2">
            <XCircle size={14} />
            Missing
          </div>
        </div>
        <div className="stats-card">
          <div className="number" style={{ color: "var(--primary-start)" }}>
            {receivedCount}
          </div>
          <div className="label flex items-center justify-center gap-2">
            <Shield size={14} />
            Received
          </div>
        </div>
      </div>

      <div className="card how-it-works-card">
        <h2 className="section-title" style={{ justifyContent: "center" }}>
          How It Works
        </h2>
        <div className="steps-grid">
          {[
            {
              step: "1",
              title: "Await Delivery",
              desc: "Wait for shipment notification from sender",
              icon: Clock,
            },
            {
              step: "2",
              title: "Start Scanner",
              desc: 'Click "Verify Bluetooth" to scan for devices',
              icon: Bluetooth,
            },
            {
              step: "3",
              title: "Verify Items",
              desc: "System detects which packages are present",
              icon: BadgeCheck,
            },
            {
              step: "4",
              title: "Mark Received",
              desc: "Confirm and mark packages as received",
              icon: CheckCircle,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="step-card">
                <div className="step-number">{item.step}</div>
                <div
                  className="icon-wrapper mx-auto mb-3"
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "0.5rem",
                    background: "var(--color-primary)",
                  }}
                >
                  <Icon size={14} />
                </div>
                <h4 style={{ fontSize: "0.75rem" }}>{item.title}</h4>
                <p style={{ fontSize: "0.65rem" }}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card verification-card">
        <div className="verification-content">
          <div className="flex items-start gap-4">
            <div
              className="icon-wrapper flex-shrink-0"
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "0.75rem",
                background: "var(--color-primary)",
                boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
              }}
            >
              <Bluetooth size={20} />
            </div>
            <div className="verification-text">
              <h2 className="text-lg font-bold text-white mb-2">
                Bluetooth Verification
              </h2>
              <p
                style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}
              >
                Verify which packages are physically present using Bluetooth
                scanning. The Master ESP32 will scan all slave devices to
                detect your packages in real-time.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="badge badge-present">
                  <CheckCircle size={12} className="mr-1" />
                  {presentCount} Present
                </span>
                <span className="badge badge-missing">
                  <XCircle size={12} className="mr-1" />
                  {missingCount} Missing
                </span>
              </div>
            </div>
          </div>

          <div className="verification-action">
            {isScanning && (
              <div
                className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
                style={{ background: "rgba(34, 197, 94, 0.1)" }}
              >
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-success)" }}
                >
                  Scanning...
                </span>
              </div>
            )}
            <button
              onClick={simulateBluetoothVerification}
              disabled={isScanning}
              className="btn-primary flex items-center gap-2"
              style={{ boxShadow: "0 4px 15px rgba(59, 130, 246, 0.4)" }}
            >
              <Radio
                size={18}
                className={isScanning ? "animate-pulse" : ""}
              />
              {isScanning ? "Scanning..." : "Verify Bluetooth"}
            </button>
          </div>
        </div>
      </div>

      <ProductList
        products={myProducts}
        onMarkReceived={handleMarkReceived}
        currentUserEmail={user?.email}
      />
    </div>
  );
}
