import {
  Package,
  Calendar,
  CircleCheck as CheckCircle2,
  CircleX as XCircle,
  Clock,
  User,
  Tag,
} from "lucide-react";
import { formatDateTime } from "../../utils/formatters";
import StatusBadge from "../common/StatusBadge";

export default function ProductList({
  products,
  onMarkReceived,
  currentUserEmail,
}) {
  if (!products || products.length === 0) {
    return (
      <div className="product-list-card">
        <h2 className="list-title">
          <Package size={20} />
          Incoming Products
        </h2>
        <div className="empty-list">
          <Package size={48} />
          <p>No products assigned to you yet</p>
          <p>Products will appear here once senders create shipments for you</p>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(
    (p) => p.receiver_email === currentUserEmail && p.status !== "irrelevant",
  );

  if (filteredProducts.length === 0) {
    return (
      <div className="product-list-card">
        <h2 className="list-title">
          <Package size={20} />
          Incoming Products
        </h2>
        <div className="empty-list">
          <Package size={48} />
          <p>No products assigned to you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-card">
      <h2 className="list-title">
        <Package size={20} />
        Incoming Products
        <span className="list-count">{filteredProducts.length}</span>
      </h2>
      <div className="list-space">
        {filteredProducts.map((product) => {
          const canMarkReceived = product.status === "present";

          return (
            <div key={product.id} className="product-card">
              <div className="card-header">
                <div className="card-title-group">
                  <div className="card-icon">
                    <Package size={16} />
                  </div>
                  <h3 className="card-title">{product.product_name}</h3>
                  <StatusBadge status={product.status} />
                </div>
                <div className="card-status">
                  {product.status === "present" && (
                    <span className="status-badge present">
                      <CheckCircle2 size={14} />
                      Detected
                    </span>
                  )}
                  {product.status === "missing" && (
                    <span className="status-badge missing">
                      <XCircle size={14} />
                      Not Found
                    </span>
                  )}
                  {product.status === "received" && (
                    <span className="status-badge received">
                      <CheckCircle2 size={14} />
                      Received
                    </span>
                  )}
                </div>
              </div>

              <div className="card-info-grid">
                <div className="card-info-item">
                  <Tag size={12} />
                  <span>ID: {product.product_id || product.id}</span>
                </div>
                <div className="card-info-item">
                  <Clock size={12} />
                  <span>Device: {product.device_name}</span>
                </div>
                <div className="card-info-item">
                  <User size={12} />
                  <span>
                    From: {product.sender_name || product.sender_email}
                  </span>
                </div>
                <div className="card-info-item">
                  <Calendar size={12} />
                  <span>Shipped: {formatDateTime(product.shipment_date)}</span>
                </div>
                {product.received_date && (
                  <div className="card-info-item received">
                    <CheckCircle2 size={12} />
                    <span>
                      Received: {formatDateTime(product.received_date)}
                    </span>
                  </div>
                )}
              </div>

              {product.notes && (
                <div className="card-notes">
                  <span>Notes:</span> {product.notes}
                </div>
              )}

              {canMarkReceived && (
                <button
                  onClick={() => onMarkReceived(product)}
                  className="mark-received-btn"
                >
                  <CheckCircle2 size={16} />
                  Mark as Received
                </button>
              )}

              {product.status === "received" && (
                <div className="received-badge">
                  <CheckCircle2 size={16} />
                  Package successfully received
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
