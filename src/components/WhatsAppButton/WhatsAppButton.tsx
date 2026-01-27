import "./WhatsAppButton.css";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

export function WhatsAppButton({ phoneNumber, message = "Hello! I need help with..." }: WhatsAppButtonProps) {
  // Format phone number: remove spaces, dashes, and + sign
  const formattedNumber = phoneNumber.replace(/[\s\-+]/g, "");

  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${formattedNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  const handleClick = () => {
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="whatsapp-button-container" onClick={handleClick}>
      <div className="whatsapp-button">
        <i className="bi bi-whatsapp"></i>
      </div>
      <div className="whatsapp-tooltip">Message us on WhatsApp</div>
    </div>
  );
}
