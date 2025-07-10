import { BaseApiService } from "../../../shared/services/base-api";
import type { Column, CreateColumnDto, UpdateColumnDto } from "../types";

class ColumnsApiService extends BaseApiService {
  async getColumns(boardId?: string): Promise<Column[]> {
    const query = boardId ? `?boardId=${boardId}` : "";
    return this.request<Column[]>(`/columns${query}`);
  }

  async createColumn(data: CreateColumnDto): Promise<Column> {
    return this.request<Column>("/columns", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateColumn(id: string, data: UpdateColumnDto): Promise<Column> {
    return this.request<Column>(`/columns/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteColumn(id: string): Promise<void> {
    await this.request<void>(`/columns/${id}`, {
      method: "DELETE",
    });
  }
}

export const columnsApi = new ColumnsApiService();
