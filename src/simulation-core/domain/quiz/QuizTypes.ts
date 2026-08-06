export enum QuizDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  points: number;
  difficulty: QuizDifficulty;
  contextType?: 'FASTER_DIAGNOSIS' | 'SAFETY' | 'THEORY' | 'COMPONENT';
}

export interface QuizState {
  currentQuestion: QuizQuestion | null;
  answeredQuestions: {
    questionId: string;
    isCorrect: boolean;
    pointsEarned: number;
  }[];
  totalPoints: number;
}
