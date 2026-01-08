import {
  createUnit,
  deleteUnit,
  fetchUnitCount,
  fetchUnits,
  updateUnit,
} from "../../api/admin/unit.api";

export async function getUnits(skip: number, top: number) {
  const res = await fetchUnits(skip, top);
  return res.successData;
}

export async function getUnitTotal() {
  const res = await fetchUnitCount();
  return res.successData.intResponse;
}

export async function addUnit(data: any) {
  return createUnit(data);
}

export async function editUnit(id: number, data: any) {
  return updateUnit(id, data);
}

export async function removeUnit(id: number) {
  return deleteUnit(id);
}
