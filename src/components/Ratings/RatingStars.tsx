type Props = {
  rating: number;
  count: number;
};

export function RatingStars({ rating, count }: Props) {
  if (count === 0) {
    return <small className="text-muted">No reviews</small>;
  }

  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  return (
    <div className="d-flex align-items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => {
        if (s <= full)
          return <i key={s} className="bi bi-star-fill text-warning" />;
        if (s === full + 1 && half)
          return <i key={s} className="bi bi-star-half text-warning" />;
        return <i key={s} className="bi bi-star text-muted" />;
      })}
      <small className="text-muted ms-1">
        {rating.toFixed(1)} ({count})
      </small>
    </div>
  );
}
