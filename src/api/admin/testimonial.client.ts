import { apiGet, apiPost, apiPut, apiDelete } from "../base/apiClient";

/* List */
export function fetchTestimonials(skip: number, top: number) {
  return apiGet<any>(`/testimonial/getall/paginated?skip=${skip}&top=${top}`);
}

/* Count */
export function fetchTestimonialCount() {
  return apiGet<any>(`/testimonial/count`);
}

/* Create */
export function createTestimonial(payload: any) {
  return apiPost("/testimonial/create", {
    reqData: payload,
  });
}

/* Update */
export function updateTestimonial(id: number, payload: any) {
  return apiPut(`/testimonial/update/${id}`, {
    reqData: payload,
  });
}

/* Delete */
export function deleteTestimonial(id: number) {
  return apiDelete(`/testimonial/delete/${id}`);
}
