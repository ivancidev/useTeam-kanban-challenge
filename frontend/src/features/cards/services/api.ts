import { BaseApiService } from "../../../shared/services/base-api";
import type { Card, CreateCardDto, UpdateCardDto, MoveCardDto } from "../types";

class CardsApiService extends BaseApiService {
  async getCards(columnId?: string): Promise<Card[]> {
    const query = columnId ? `?columnId=${columnId}` : "";
    return this.request<Card[]>(`/cards${query}`);
  }

  async createCard(data: CreateCardDto): Promise<Card> {
    return this.request<Card>("/cards", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCard(id: string, data: UpdateCardDto): Promise<Card> {
    return this.request<Card>(`/cards/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async moveCard(id: string, data: MoveCardDto): Promise<Card> {
    return this.request<Card>(`/cards/${id}/move`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteCard(id: string): Promise<void> {
    await this.request<void>(`/cards/${id}`, {
      method: "DELETE",
    });
  }
}

export const cardsApi = new CardsApiService();
