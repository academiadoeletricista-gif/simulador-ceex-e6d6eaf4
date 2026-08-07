import { supabase } from "@/integrations/supabase/client";

/**
 * Migration SPRINT CORE-REBUILD-01
 * Ensures PD-001 has functional hypotheses and validation logic in the database.
 */
export async function migratePD001() {
  console.log("Starting migration for PD-001...");

  // 1. Get PD-001 case id
  const { data: caseData, error: caseError } = await supabase
    .from('cases')
    .select('id')
    .eq('code', 'PD-001')
    .single();

  if (caseError || !caseData) {
    console.error("PD-001 not found or error:", caseError);
    return;
  }

  const caseId = caseData.id;

  // 2. Insert Hypotheses
  const hypotheses = [
    {
      case_id: caseId,
      title: "Fusível F1 Queimado",
      description: "O fusível de proteção do circuito de comando pode ter rompido.",
      is_correct: true,
      is_root_cause: true,
      validation_logic: {
        requiredMeasurement: "F1_in-F1_out",
        expectedResult: "0V",
        ifMatch: "confirma",
        ifNoMatch: "descarta"
      }
    },
    {
      case_id: caseId,
      title: "Relé Térmico Atuado",
      description: "O relé térmico pode ter desarmado por sobrecarga.",
      is_correct: false,
      is_root_cause: false,
      validation_logic: {
        requiredMeasurement: "95-96",
        expectedResult: "0V",
        ifMatch: "confirma",
        ifNoMatch: "descarta"
      }
    },
    {
      case_id: caseId,
      title: "Falha na Bobina K1",
      description: "A bobina do contator K1 pode estar interrompida.",
      is_correct: false,
      is_root_cause: false,
      validation_logic: {
        requiredMeasurement: "K1_A1-K1_A2",
        expectedResult: "220V",
        ifMatch: "confirma",
        ifNoMatch: "descarta"
      }
    }
  ];

  // Clean existing hypotheses for this case first to avoid duplicates
  await supabase.from('case_hypotheses').delete().eq('case_id', caseId);

  const { error: insertError } = await supabase
    .from('case_hypotheses')
    .insert(hypotheses);

  if (insertError) {
    console.error("Error inserting hypotheses:", insertError);
  } else {
    console.log("Hypotheses for PD-001 updated successfully.");
  }

  // 3. Update evidenceData in content JSONB
  const evidenceData = [
    {
      id: "ev_f1_volt",
      type: "measurement",
      label: "Medição em F1_in-F1_out",
      value: "0V", // Indicating no continuity / open fuse if measuring across it in a specific way or just the result for the logic
      impacts: {}
    },
    {
      id: "ev_rt_volt",
      type: "measurement",
      label: "Medição em 95-96",
      value: "220V", // Normal closed state
      impacts: {}
    }
  ];

  const { error: updateError } = await supabase
    .from('cases')
    .update({ 
      content: { 
        evidenceData,
        availableTools: ['Multímetro', 'Inspeção Visual'],
        topology: 'DOL'
      } 
    })
    .eq('id', caseId);

  if (updateError) {
    console.error("Error updating case content:", updateError);
  } else {
    console.log("Case content for PD-001 updated successfully.");
  }
}
