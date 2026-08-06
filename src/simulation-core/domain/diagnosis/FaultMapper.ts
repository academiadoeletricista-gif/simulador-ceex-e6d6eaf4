import { FaultType } from './FaultType';

export class FaultMapper {
  /**
   * Mappings from potential database strings (various formats) to FaultType
   */
  private static readonly MAPPINGS: Record<string, FaultType> = {
    // Standard matches
    'OPEN_FUSE': FaultType.OPEN_FUSE,
    'BROKEN_COIL': FaultType.BROKEN_COIL,
    'SHORTED_COIL': FaultType.SHORTED_COIL,
    'OPEN_START_BUTTON': FaultType.OPEN_START_BUTTON,
    'OPEN_STOP_BUTTON': FaultType.OPEN_STOP_BUTTON,
    'BROKEN_AUX_CONTACT': FaultType.BROKEN_AUX_CONTACT,
    'WELDED_AUX_CONTACT': FaultType.WELDED_AUX_CONTACT,
    'TRIPPED_RELAY': FaultType.TRIPPED_RELAY,
    'BROKEN_WIRE': FaultType.BROKEN_WIRE,
    'LOOSE_TERMINAL': FaultType.LOOSE_TERMINAL,
    'MISSING_VOLTAGE': FaultType.MISSING_VOLTAGE,
    'MECHANICAL_FAILURE': FaultType.MECHANICAL_FAILURE,
    'NONE': FaultType.NONE,

    // Case variations / Human readable variations
    'open_fuse': FaultType.OPEN_FUSE,
    'fusivel_aberto': FaultType.OPEN_FUSE,
    'bobina_rompida': FaultType.BROKEN_COIL,
    'bobina_curto': FaultType.SHORTED_COIL,
    'botao_partida_aberto': FaultType.OPEN_START_BUTTON,
    'botao_parada_aberto': FaultType.OPEN_STOP_BUTTON,
    'contato_auxiliar_quebrado': FaultType.BROKEN_AUX_CONTACT,
    'rele_tripado': FaultType.TRIPPED_RELAY,
    'falha_mecanica': FaultType.MECHANICAL_FAILURE,
  };

  /**
   * Normalizes and maps a raw database string to a FaultType
   * @throws Error if the value is invalid or unknown
   */
  public static map(rawValue: string | null | undefined): FaultType {
    if (!rawValue) {
      console.warn('[FaultMapper] Received empty fault value, defaulting to NONE');
      return FaultType.NONE;
    }

    const normalized = rawValue.trim().toUpperCase();
    
    // Direct match check
    if (this.MAPPINGS[normalized]) {
      return this.MAPPINGS[normalized];
    }

    // Key lookup in Enum values
    const enumValue = Object.values(FaultType).find(v => v === normalized);
    if (enumValue) {
      return enumValue as FaultType;
    }

    throw new Error(`[FaultMapper] Invalid or unknown fault value received: "${rawValue}"`);
  }

  /**
   * Validates if a component ID exists in the expected circuit set
   */
  public static validateComponent(componentTag: string, circuitComponents: string[]): boolean {
    if (!componentTag) return false;
    return circuitComponents.includes(componentTag);
  }
}
