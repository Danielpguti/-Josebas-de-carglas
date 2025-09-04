
export interface TireOption {
  tier: 'Alta gama' | 'Óptimo' | 'Económico';
  price: number;
  eta: string;
  notes: string;
}

export interface TireSize {
  width: number;
  aspect: number;
  rim: number;
}
