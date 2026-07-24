export interface Student {
  id: number;
  name: string;
  username: string;
  class: string;
}

export interface StudentEntry extends Student {
  included: boolean;
}
