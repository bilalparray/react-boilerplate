import { useState } from "react";
import { submitProductReview } from "../../services/reviewService";

type Props = {
  productId: number;
  onClose: () => void;
  onSuccess: () => void;
};

export function WriteReviewModal({ productId, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !comment) return alert("Fill all fields");

    try {
      setLoading(true);
      await submitProductReview({
        name,
        email,
        rating,
        comment,
        productId,
      });

      onSuccess();
      onClose();
    } catch {
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-modal-backdrop">
      <div className="review-modal">
        <h5 className="fw-bold mb-3">Write a Review</h5>

        <input
          className="form-control mb-2"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="form-select mb-2"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Stars
            </option>
          ))}
        </select>

        <textarea
          className="form-control mb-3"
          rows={4}
          placeholder="Your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="d-flex gap-2">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-success flex-fill"
            disabled={loading}
            onClick={handleSubmit}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
