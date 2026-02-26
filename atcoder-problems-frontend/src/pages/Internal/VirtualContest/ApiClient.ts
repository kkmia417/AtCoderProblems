import {
  CONTEST_CREATE,
  CONTEST_ITEM_UPDATE,
  CONTEST_JOIN,
  CONTEST_LEAVE,
  CONTEST_UPDATE,
} from "../ApiUrl";
import { fetchInternalApi } from "../../../api/InternalAPIFetch";
import { VirtualContestItem, VirtualContestMode } from "../types";

export interface CreateContestRequest {
  title: string;
  memo: string;
  start_epoch_second: number;
  duration_second: number;
  mode: VirtualContestMode;
  is_public: boolean;
  penalty_second: number;
}
export interface CreateContestResponse {
  contest_id: string;
}

export const createVirtualContest = (request: CreateContestRequest) =>
  fetchInternalApi(CONTEST_CREATE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .then((response) => response.json())
    .then((response) => response as CreateContestResponse);

export interface UpdateContestRequest {
  id: string;
  title: string;
  memo: string;
  start_epoch_second: number;
  duration_second: number;
  mode: string | null;
  is_public: boolean;
  penalty_second: number;
}
export const updateVirtualContestInfo = (request: UpdateContestRequest) =>
  fetchInternalApi(CONTEST_UPDATE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

export const updateVirtualContestItems = (
  contestId: string,
  problems: VirtualContestItem[]
) =>
  fetchInternalApi(CONTEST_ITEM_UPDATE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contest_id: contestId,
      problems: problems.map((p, i) => ({
        ...p,
        order: i,
      })),
    }),
  }).then((response) => response);

export const joinContest = (contestId: string) =>
  fetchInternalApi(CONTEST_JOIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contest_id: contestId }),
  }).then(() => ({}));

export const leaveContest = (contestId: string) =>
  fetchInternalApi(CONTEST_LEAVE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contest_id: contestId }),
  });
