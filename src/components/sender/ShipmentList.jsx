import {
  Package,
  Calendar,
  Mail,
  User,
  ArrowRight,
  CircleCheck as CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { formatDateTime } from "../../utils/formatters";
import StatusBadge from "../common/StatusBadge";

export default function ShipmentList({ shipments, loading }) {
  if (loading) {
    return (
      <div className="shipment-list-card">
        <h2 className="list-title">
          <Package size={20} />
          My Shipments
        </h2>
        <div className="list-space">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!shipments || shipments.length === 0) {
    return (
      <div className="shipment-list-card">
        <h2 className="list-title">
          <Package size={20} />
          My Shipments
        </h2>
        <div className="empty-list">
          <Package size={48} />
          <p>No shipments created yet</p>
          <p>Create your first shipment using the form</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shipment-list-card">
      <h2 className="list-title">
        <Package size={20} />
        My Shipments
        <span className="list-count">{shipments.length}</span>
      </h2>
      <div className="list-space">
        {shipments.map((shipment) => (
          <div key={shipment.id} className="shipment-card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon">
                  <Package size={16} />
                </div>
                <h3 className="card-title">{shipment.product_name}</h3>
                <StatusBadge status={shipment.status} />
              </div>
              <div className="card-status">
                {shipment.status === "received" && (
                  <span className="status-badge delivered">
                    <CheckCircle size={14} />
                    Delivered
                  </span>
                )}
                {shipment.status === "sent" && (
                  <span className="status-badge transit">
                    <Clock size={14} />
                    In Transit
                  </span>
                )}
                {shipment.status === "missing" && (
                  <span className="status-badge missing">
                    <XCircle size={14} />
                    Missing
                  </span>
                )}
              </div>
            </div>

            <div className="card-info-grid">
              <div className="card-info-item">
                <Clock size={12} />
                <span>ID: {shipment.product_id || shipment.id}</span>
              </div>
              <div className="card-info-item">
                <ArrowRight size={12} />
                <span>Device: {shipment.device_name}</span>
              </div>
              <div className="card-info-item">
                <User size={12} />
                <span>{shipment.receiver_name}</span>
              </div>
              <div className="card-info-item">
                <Mail size={12} />
                <span className="truncate">{shipment.receiver_email}</span>
              </div>
              <div className="card-info-item">
                <Calendar size={12} />
                <span>{formatDateTime(shipment.shipment_date)}</span>
              </div>
              {shipment.received_date && (
                <div className="card-info-item received">
                  <CheckCircle size={12} />
                  <span>{formatDateTime(shipment.received_date)}</span>
                </div>
              )}
            </div>

            {shipment.notes && (
              <div className="card-notes">
                <span>Notes:</span> {shipment.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
