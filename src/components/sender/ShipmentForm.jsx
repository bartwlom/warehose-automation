import { useState } from "react";
import { Package, User, Mail, FileText, Plus, ArrowRight } from "lucide-react";

export default function ShipmentForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    product_name: "",
    product_id: "",
    receiver_email: "",
    receiver_name: "",
    device_name: "ESP32_Slave1",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        product_name: "",
        product_id: "",
        receiver_email: "",
        receiver_name: "",
        device_name: "ESP32_Slave1",
        notes: "",
      });
    } catch (error) {
      console.error("Error creating shipment:", error);
      alert("Failed to create shipment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const deviceOptions = [
    "ESP32_Slave1",
    "ESP32_Slave2",
    "ESP32_Slave3",
    "ESP32_Slave4",
    "ESP32_Slave5",
  ];

  return (
    <div className="shipment-form-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="form-icon-wrapper">
          <Plus size={18} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Create New Shipment</h2>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Fill in the details to send a package
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-space">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              <Package size={14} className="form-label-icon" />
              Product Name
            </label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="e.g., Dell Laptop XPS 15"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Package size={14} className="form-label-icon" />
              Package ID
            </label>
            <input
              type="text"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="e.g., PKG-001"
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">
              <User size={14} className="form-label-icon" />
              Receiver Name
            </label>
            <input
              type="text"
              name="receiver_name"
              value={formData.receiver_name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Jane Smith"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={14} className="form-label-icon" />
              Receiver Email
            </label>
            <input
              type="email"
              name="receiver_email"
              value={formData.receiver_email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="receiver@company.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <Package size={14} className="form-label-icon" />
            Device Name (BLE Beacon)
          </label>
          <div className="select-wrapper">
            <select
              name="device_name"
              value={formData.device_name}
              onChange={handleChange}
              required
              className="form-input"
            >
              {deviceOptions.map((device) => (
                <option key={device} value={device}>
                  {device}
                </option>
              ))}
            </select>
            <div className="select-arrow">
              <ArrowRight size={14} className="rotate-90" />
            </div>
          </div>
          <p className="form-hint">
            Select the ESP32 device attached to this package
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">
            <FileText size={14} className="form-label-icon" />
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="form-input resize-none"
            placeholder="Handle with care - fragile electronics"
          />
        </div>

        <button type="submit" disabled={submitting} className="submit-button">
          {submitting ? (
            <>
              <div className="spinner"></div>
              Creating...
            </>
          ) : (
            <>
              <Plus size={18} />
              Create Shipment
            </>
          )}
        </button>
      </form>
    </div>
  );
}
