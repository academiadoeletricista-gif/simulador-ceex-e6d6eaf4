import { QuizQuestion, QuizDifficulty } from './QuizTypes';
import { FaultType } from '../diagnosis/FaultType';

export const COMPONENT_QUIZ_POOL: Record<string, QuizQuestion[]> = {
  'K1': [
    {
      id: 'q_k1_1',
      question: 'Se houver 220V nos terminais A1 e A2 do contator e ele não atracar, qual o defeito mais provável?',
      options: [
        'Bobina aberta ou queimada',
        'Contatos de potência sujos',
        'Falta de fase na potência',
        'Mola de retorno muito forte'
      ],
      correctOptionIndex: 0,
      explanation: 'A bobina é o elemento eletromagnético que gera o campo para fechar os contatos. Se há tensão e não há movimento, a bobina está interrompida.',
      points: 20,
      difficulty: QuizDifficulty.EASY
    }
  ],
  'F2': [
    {
      id: 'q_f2_1',
      question: 'O relé térmico disparou (trip). Qual deve ser o primeiro passo antes de resetá-lo?',
      options: [
        'Aumentar a corrente de ajuste',
        'Substituir o motor imediatamente',
        'Aguardar o resfriamento e investigar a causa da sobrecarga',
        'Fazer um jumper nos terminais 95-96'
      ],
      correctOptionIndex: 2,
      explanation: 'O disparo térmico indica uma sobrecarga real ou travamento mecânico. Resetar sem investigar pode causar danos permanentes ao motor.',
      points: 20,
      difficulty: QuizDifficulty.MEDIUM
    }
  ]
};

export const FAULT_QUIZ_POOL: Partial<Record<FaultType, QuizQuestion[]>> = {
  [FaultType.OPEN_FUSE]: [
    {
      id: 'q_fuse_1',
      question: 'Ao encontrar um fusível de comando aberto, qual a conduta técnica correta?',
      options: [
        'Substituir por um fio de cobre grosso',
        'Substituir por um fusível de mesma especificação e verificar curto-circuito no comando',
        'Aumentar a amperagem do fusível para não queimar mais',
        'Ignorar o fusível e ligar direto'
      ],
      correctOptionIndex: 1,
      explanation: 'Fusíveis protegem contra sobrecorrente. Substituir por um valor maior ou por fios elimina a proteção do circuito.',
      points: 25,
      difficulty: QuizDifficulty.EASY
    }
  ]
};
