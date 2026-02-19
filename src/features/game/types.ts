export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | 'Q' | 'J' | 'K' | '7' | 'A';

export interface Card {
    suit: Suit;
    rank: Rank;
    value: number;
    id: string; // unique identifier e.g. "hearts-A"
}

export interface Player {
    id: string;
    username: string;
    avatar_url?: string;
    position: 0 | 1 | 2 | 3;
    team: 'A' | 'B';
    hand?: string[]; // Array of card IDs
    cards_won?: string[];
}

export interface GameState {
    id: string;
    status: 'waiting' | 'playing' | 'finished' | 'cancelled';
    stake: number;
    host_id: string;
    trump_suit?: Suit;
    current_turn: 0 | 1 | 2 | 3; // Position
    current_round: number; // 1-10
    current_trick_cards: { player_id: string; card: string }[];
    players: Player[];
    score_a: number;
    score_b: number;
    winner_team?: 'A' | 'B';
}
