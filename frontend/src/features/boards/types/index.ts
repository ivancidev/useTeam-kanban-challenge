import type { Column } from "../../columns/types";

export interface Board {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  columns?: Column[];
}

export interface CreateBoardDto {
  name: string;
}

export interface UpdateBoardDto {
  name?: string;
}

// Re-export Column type for Board relations
export type { Column } from "../../columns/types";
