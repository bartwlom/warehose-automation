import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProducts } from "../hooks/useProducts";
import { useRealtimeData } from "../hooks/useRealtimeData";
import ShipmentForm from "../components/sender/ShipmentForm";
import ShipmentList from "../components/sender/ShipmentList";
import {
  Package,
  Plus,
  Truck,
  CheckCircle,
  MapPin,
  Bluetooth,
} from "lucide-react";

export default function SenderPortal() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { createProduct } = useProducts();
  const [shipments, setShipments] = useState([]);

  const { data: allProducts } = useRealtimeData("products");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && allProducts) {
      const myShipments = allProducts.filter(
        (p) => p.sender_email === user.email
      );
      myShipments.sort(
        (a, b) =>
          new Date(b.shipment_date || b.created_date) -
          new Date(a.shipment_date || a.created_date)
      );
      setShipments(myShipments);
    }
  }, [user, allProducts]);

  const handleCreateShipment = async (formData) => {
    try {
      const shipmentData = {
        ...formData,
        sender_email: user.email,
        sender_name: user.full_name || user.email,
        status: "sent",
        shipment_date: new Date().toISOString(),
        created_by: user.email,
      };

      await createProduct(shipmentData);
      alert("Shipment created successfully!");
    } catch (error) {
      console.error("Failed to create shipment:", error);
      alert("Failed to create shipment. Please try again.");
    }
  };

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

  const stats = {
    total: shipments.length,
    sent: shipments.filter((s) => s.status === "sent").length,
    delivered: shipments.filter((s) => s.status === "received").length,
  };

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
        <h1 className="portal-title">Sender Portal</h1>
        <p className="portal-description">
          Create shipments, track packages, and manage your logistics with
          real-time IoT tracking
        </p>
      </div>

      <div className="portal-stats-grid">
        <div className="stats-card">
          <div className="number">{stats.total}</div>
          <div className="label flex items-center justify-center gap-2">
            <Package size={14} />
            Total
          </div>
        </div>
        <div className="stats-card">
          <div className="number" style={{ color: "var(--primary-start)" }}>
            {stats.sent}
          </div>
          <div className="label flex items-center justify-center gap-2">
            <Truck size={14} />
            In Transit
          </div>
        </div>
        <div className="stats-card">
          <div className="number" style={{ color: "var(--color-success)" }}>
            {stats.delivered}
          </div>
          <div className="label flex items-center justify-center gap-2">
            <CheckCircle size={14} />
            Delivered
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
              title: "Create Shipment",
              desc: "Fill in package details and assign a BLE beacon device",
              icon: Plus,
            },
            {
              step: "2",
              title: "Attach Device",
              desc: "Physically attach the ESP32 device to your package",
              icon: Bluetooth,
            },
            {
              step: "3",
              title: "Track Online",
              desc: "Monitor your shipment status in real-time dashboard",
              icon: MapPin,
            },
            {
              step: "4",
              title: "Confirmation",
              desc: "Receiver verifies and marks package as received",
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

      <div className="portal-content-grid">
        <ShipmentForm onSubmit={handleCreateShipment} currentUser={user} />
        <ShipmentList shipments={shipments} />
      </div>
    </div>
  );
}

