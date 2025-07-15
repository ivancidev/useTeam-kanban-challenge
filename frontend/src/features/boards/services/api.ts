import { BaseApiService } from "../../../shared/services/base-api";
import type { Board } from "../types";

class BoardsApiService extends BaseApiService {
  async getBoards(): Promise<Board[]> {
    return this.request<Board[]>("/boards");
  }

  async getBoard(id: string): Promise<Board> {
    return this.request<Board>(`/boards/${id}`);
  }

  async getDefaultBoard(): Promise<Board> {
    return this.request<Board>("/boards/default");
  }

  async createBoard(name: string): Promise<Board> {
    return this.request<Board>("/boards", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  }

  async updateBoard(id: string, name: string): Promise<Board> {
    return this.request<Board>(`/boards/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
  }

  async deleteBoard(id: string): Promise<void> {
    await this.request<void>(`/boards/${id}`, {
      method: "DELETE",
    });
  }
}

export const boardsApi = new BoardsApiService();
