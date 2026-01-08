import { apiGet, apiPut } from "../base/apiClient";

/* Paginated list */
export function fetchReviews(skip: number, top: number) {
  return apiGet<any>(`/Review/getall/paginated?skip=${skip}&top=${top}`);
}

/* Count */
export function fetchReviewCount() {
  return apiGet<any>(`/Review/count`);
}

/* Approve / Reject */
export function updateReviewStatus(id: number, isApproved: boolean) {
  return apiPut(
    `/AdminReview/approve/${id}`,
    {
      reqData: { isApproved },
    },
    true
  );
}
